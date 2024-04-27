import User from "../models/User.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";
import Analytics from "../models/Analytics.js";
import Deliveryperson from "../models/Deliveryperson.js";
import Starexdetails from "../models/Starexdetails.js";

const validateCoupon = async (couponId) => {
  try {
    const validCoupon = await Coupon.findOne({ _id: couponId });
    return validCoupon;
  } catch (error) {
    console.error("Error validating coupon:", error);
    return null;
  }
};

const applyCouponDiscount = (originalTotalPrice, discountPercentage) => {
  const discountMultiplier = 1 - discountPercentage / 100;
  const discountedTotalPrice = originalTotalPrice * discountMultiplier;
  return discountedTotalPrice >= 0 ? discountedTotalPrice : 0;
};
function generateTrackingNumber() {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let trackingNumber = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    trackingNumber += characters.charAt(randomIndex);
  }
  return trackingNumber;
}

export const OrderController = {
  createOrder: async (req, res) => {
    const { userId, couponId, address, paymentMethod, deliveryCharge } =
      req.body;

    try {
      const trackingNumber = generateTrackingNumber();

      const user = await User.findById(userId).populate("cartId");

      if (!user) {
        return res.status(404).json({ message: "User not found", ok: false });
      }

      const products = user.cartId.products;

      if (products.length === 0) {
        return res.status(400).json({ message: "Cart is empty", ok: false });
      }
      const cartTotal = user.cartId.totalPrice;

      const order = new Order({
        userId: userId,
        trackingNumber,
        orderSummary: products,
        address: address,
        total: cartTotal,
        paymentMethod: paymentMethod,
        deliveryCharge: deliveryCharge,
        orderTracking: ["Confirmed"],
        from: "Starex Market",
      });

      const cart = await Cart.findById(user.cartId);

      cart.products = [];
      cart.totalPrice = 0;

      await cart.save();

      user.orderHistory.push(order._id);

      let orders = await order.save();
      await user.save();

      const responseData = {
        data: orders,
        ok: true,
        message: "Order Submitted successfully",
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const { trackingNumber } = req.query;

      if (!trackingNumber) {
        return res
          .status(400)
          .json({ message: "Tracking number is required", ok: false });
      }
      const details = await Starexdetails.findOne()

      const order = await Order.findOne(
        { trackingNumber: trackingNumber },
        "-orderTracking -orderId"
      )
        .populate({
          path: "userId",
          select: "-addresses -orderHistory -cartId",
        })
        .populate({
          path: "orderSummary._id",
          select: "productName price quantity image",
          as: "product",
        })
        .populate({
          path: "address",
          select: "-latitude -longitude",
        })
        .lean()
        .exec();

      if (!order) {
        return res.status(404).json({ message: "Order not found", ok: false });
      }
      return res
        .status(200)
        .json({ data: { order, details }, ok: true, message: "Order found successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getOrders: async (req, res) => {
    let { page, limit, search, startdate, enddate, status } = req.query;
    try {
      const query = {};

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      if (search) {
        query.trackingNumber = { $regex: search, $options: "i" };
      }

      if (startdate && enddate) {
        query.createdAt = {
          $gte: new Date(startdate),
          $lte: new Date(enddate),
        };
      } else if (startdate) {
        query.createdAt = {
          $gte: new Date(startdate),
        };
      } else if (enddate) {
        query.createdAt = {
          $lte: new Date(enddate),
        };
      }

      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .populate("userId", [
          "email",
          "firstName",
          "lastName",
          "address",
          "phoneNumber",
        ],).populate("deliveryPerson", ["name", "phoneNumber"])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Order.countDocuments();

      res.status(200).json({
        data: orders,
        ok: true,
        message: "Orders fetched successfully",
        count,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },
  getOrdersByUserId: async (req, res) => {
    let { userId, page, limit, search, startdate, enddate, status } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = { userId };

      if (search) {
        query.firstName = { $regex: search, $options: "i" };
      }

      if (startdate && enddate) {
        query.createdAt = {
          $gte: new Date(startdate),
          $lte: new Date(enddate),
        };
      } else if (startdate) {
        query.createdAt = {
          $gte: new Date(startdate),
        };
      } else if (enddate) {
        query.createdAt = {
          $lte: new Date(enddate),
        };
      }

      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .populate({
          path: "userId",
          select: "_id email phoneNumber orderId firstName",
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "No orders found for the user", data: [] });
      }

      const ordersData = orders.map((order) => {
        const orderSummary = order.orderSummary.map((summaryItem) => ({
          weight: summaryItem.weight,
          price: summaryItem.price,
          quantity: summaryItem.quantity,
          userId: summaryItem.userId,
          createdAt: summaryItem.createdAt,
          updatedAt: summaryItem.updatedAt,
          phoneNumber: order.userId.phoneNumber,
          email: order.userId.email,
          orderId: order.userId.orderId,
          firstName: order.userId.firstName,
          from: order.from,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          status: order.status,
          trackingNumber: order.trackingNumber,
        }));

        const totalAmount = orderSummary.reduce(
          (total, item) => total + item.price,
          0
        );
        const totalCount = orderSummary.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          orderSummary: orderSummary,
          totalCount: totalCount,
          totalAmount: totalAmount,
          trackingNumber: order.trackingNumber,
          status: order.status,
        };
      });

      const count = await Order.countDocuments({ userId, ...query });

      return res.status(200).json({
        ok: true,
        data: ordersData,
        message: "Orders retrieved successfully",
        count,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  getOrder: async (req, res) => {
    const { orderId } = req.query;

    try {
      const order = await Order.findById(orderId).populate("address").populate("userId", "phoneNumber email name firstName").populate("orderSummary._id", "productName").populate("deliveryPerson", "name phone _id");
      if (!order) {
        return res.status(404).json({ message: "Order not found", ok: false });
      }

      const responseData = {
        data: order,
        ok: true,
        message: "Order retrieved successfully",
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Error getting order by orderId:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  updateOrder: async (req, res) => {
    const { orderId, newStatus } = req.query;
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ ok: false, message: "Order not found" });
      }

      order.orderTracking.push(newStatus);
      order.pop(newStatus);
      await order.save();

      return res.status(200).json({
        ok: true,
        data: {
          orderId: order._id,
          orderTracking: order.orderTracking,
        },
        message: "Order Tracking updated successfully",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  deliveryMan: async (req, res) => {
    const { orderId, personId } = req.query;

    if (!orderId || !personId) {
      return res.status(400).json({ ok: false, message: "Order Id and Deliveryman Id are required" });
    }

    try {
      const order = await Order.findById(orderId);
      const person = await Deliveryperson.findById(personId).select("_id name isAvailable phoneNumber orderHistory");
      if (!order) {
        return res.status(404).json({ ok: false, message: "Order not found" });
      }
      if (!person) {
        return res.status(404).json({ ok: false, message: "Deliveryman not found" });
      }
      if (order.deliveryPerson) {
        return res.status(400).json({ ok: false, message: "A delivery man is already assigned" });
      }

      if (!person.isAvailable) {
        return res.status(400).json({ ok: false, message: "Deliveryman is not available" });
      }

      order.deliveryPerson = person
      person.isAvailable = false;
      await person.save();
      await order.save();

      return res
        .status(200)
        .json({ data: order, ok: true, message: "Deliveryman assigned " });

    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  deleteOrder: async (req, res) => {
    const { orderId } = req.query;

    try {
      const order = await Order.findByIdAndDelete(orderId);

      if (!order) {
        return res.status(404).json({ ok: false, message: "Order not found" });
      }

      const user = await User.findOneAndUpdate(
        { orders: orderId },
        { $pull: { orders: orderId } },
        { new: true }
      );

      return res
        .status(200)
        .json({ data: {}, ok: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  trackOrder: async (req, res) => {
    try {
      const { trackingNumber } = req.query;

      const order = await Order.findOne({
        trackingNumber: trackingNumber,
      }).populate("address");

      if (!order) {
        console.log("Order not found in the database");
        return res.status(404).json({ message: "Order not found", ok: false });
      }

      const orderDetails = {
        orderId: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        estimateDelivery: order.estimateDelivery,
        firstName: order.firstName,

        total: order.total,
        lastName: order.lastName,
        address: order.address,
        from: order.from,
        paymentMethod: order.paymentMethod,
        orderSummary: order.orderSummary,
      };

      return res.status(200).json({
        data: orderDetails,
        message: "Order tracking information retrieved successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error fetching order tracking", error);
      res.status(500).json({ message: "Internal Server Error", ok: false });
    }
  },

  updateTracking: async (req, res) => {
    try {
      const { orderId, newStatus } = req.query;

      const order = await Order.findOne({ _id: orderId });
      const person = await Deliveryperson.findOne({ _id: order.deliveryPerson }).populate("name isAvailable phoneNumber");

      console.log(person, "personnnn");



      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (newStatus === "delivered" && person !== null) {
        // order.deliveryPerson = null
        order.status = "delivered"
        person.isAvailable = true
        await person.save()
      }

      order.status = newStatus;
      await order.save()
      console.log("person after deliverd by admn", person)
      return res.status(200).json({
        data: order,
        message: "Order tracking updated successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error updating order tracking", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  paymentHistory: async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const { paymentMethod, amount } = req.body;

      const order = await Order.findOne({ _id: orderId });

      if (!order) {
        return res.status(404).json({ message: "Order not found", ok: false });
      }

      order.paymentHistory.push({
        paymentMethod,
        amount,
        date: new Date(),
      });

      await order.save();

      return res.status(200).json({
        data: order.paymentHistory,
        message: "Payment added to order successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error adding payment to order:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", ok: false });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const orderId = req.query.orderId;

      const order = await Order.findOne({ _id: orderId });

      if (!order) {
        return res.status(404).json({ message: "Order not found", ok: false });
      }

      return res.status(200).json({
        data: order.paymentHistory,
        message: "Payment history fetched successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", ok: false });
    }
  },

  dailyAnalytics: async (req, res) => {
    try {
      const { date } = req.query;

      const selectedDate = new Date(date);

      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const dailyOrders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const totalOrders = dailyOrders.length;
      const totalAmount = dailyOrders.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      );

      return res.status(200).json({
        totalAmount,
        totalOrders: totalOrders,
        date: selectedDate.toISOString(),
        message: "Daily Analytics retrieved successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error retrieving daily analytics:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", ok: false });
    }
  },

  weeklyAnalytics: async (req, res) => {
    try {
      const { date } = req.query;

      const selectedDate = new Date(date);

      const startDate = new Date(selectedDate);
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 6);
      endDate.setHours(23, 59, 59, 999);

      const weeklyOrders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const totalOrders = weeklyOrders.length;

      const totalAmount = weeklyOrders.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      );

      return res.status(200).json({
        totalAmount,
        totalOrders,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        message: "Weekly Analytics retrieved successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error retrieving weekly analytics:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", ok: false });
    }
  },

  monthlyAnalytics: async (req, res) => {
    try {
      const { date } = req.query;

      const selectedDate = new Date(date);

      const startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );
      endDate.setHours(23, 59, 59, 999);

      const monthlyOrders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const totalOrders = monthlyOrders.length;

      const totalAmount = monthlyOrders.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      );

      return res.status(200).json({
        totalAmount,
        totalOrders,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        message: "Monthly Analytics retrieved successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error retrieving monthly analytics:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", ok: false });
    }
  },
};
