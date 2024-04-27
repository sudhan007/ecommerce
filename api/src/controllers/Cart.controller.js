import Cart from "../models/Cart.js";
import User from "../models/User.js";

export const CartController = {
  addCart: async (req, res) => {
    try {
      const { totalPrice, products, userId } = req.body;
      let productCount = products.length;

      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      let cart = await Cart.findById(user.cartId);
      if (cart) {
        await cart.populate("products._id", "products.productName");
        cart.products = products;
        cart.totalPrice = totalPrice;
        await cart.save();
        return res.status(200).json({
          ok: true,
          data: {
            totalPrice: cart.totalPrice,
            productCount: cart.products.length,
          },
          message: "Cart item added successfully",
        });
      } else {
        const newCart = new Cart({
          products: products,
          totalPrice: totalPrice,
          userId: userId,
        });
        await newCart.populate("products._id", "products.productName");

        await newCart.save();
        user.cartId = newCart._id;
        await user.save();
      }

      return res.status(200).json({
        ok: true,
        data: {
          totalPrice: totalPrice,
          productCount: productCount,
        },
        message: "Cart item added successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCart: async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const cart = await Cart.findById(user.cartId)
        .populate({
          path: "products",
          populate: {
            path: "_id",
            model: "Product",
            select: "productName image",
          },
        })
        .populate("userId", "_id")
        .lean();

      cart.products = cart.products.map((product) => {
        return {
          _id: product._id._id,
          productName: product._id.productName,
          price: product.price,
          quantity: product.quantity,
          image: product._id.image
        };
      });

      return res.status(200).json({
        ok: true,
        data: cart,
        message: "Cart item retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting cart items:", error);
      return res.status(500).json({ ok: false, message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const { cartId } = req.query;
      const { weight } = req.body;

      const cart = await Cart.findById(cartId).populate("productId");

      if (!cart) {
        return res.status(404).json({ ok: false, message: "Cart not found" });
      }

      const product = cart.productId;

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const initialWeight = 0;

      const updatedWeight = initialWeight + weight;
      const updatedPrice = product.discountedPrice * updatedWeight;

      cart.weight = updatedWeight;
      cart.amount = updatedPrice;

      await cart.save();

      res.status(200).json({
        ok: true,
        data: {
          updatedCart: cart,
        },
        message: "Cart weight updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCart: async (req, res) => {
    const { cartItemId } = req.query;

    try {
      const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);

      if (!deletedCartItem) {
        return res
          .status(404)
          .json({ ok: false, message: "Cart item not found" });
      }

      const user = await User.findOneAndUpdate(
        { carts: cartItemId },
        { $pull: { carts: cartItemId } },
        { new: true }
      );

      return res.status(200).json({
        ok: true,
        message: "Cart item deleted successfully",
        data: {},
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return res
        .status(500)
        .json({ ok: false, message: "Something went wrong" });
    }
  },
};
