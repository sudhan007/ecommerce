import Deliveryperson from "../models/Deliveryperson.js";
import bcrypt from "bcrypt"
import Order from "../models/Order.js";
export const DeliverypersonController = {

    createDeliveryPerson: async (req, res) => {
        const saltRounds = 10
        try {
            const { name, phoneNumber, password, } = req.body;
            if (!name || !phoneNumber || !password && name === "" && phoneNumber === "" && password === "") {
                return res.status(400).json({ message: "All fields are required", ok: false });
            }

            if (password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters", ok: false });
            }
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hashSync(password, salt);
            const existingperson = await Deliveryperson.findOne({ phoneNumber })

            const comparePassword = await bcrypt.compare(password, passwordHash);

            if (!comparePassword) {
                return res.status(400).json({ message: "Password is incorrect", ok: false });
            }
            if (existingperson) {
                return res.status(409).json({ message: "Deliveryperson already exists", ok: false });
            }

            const person = await Deliveryperson.create({
                name,
                phoneNumber,
                password: passwordHash
            })

            return res.status(201).json({
                data: person,
                message: "Deliveryperson created ",
                ok: true
            })

        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false });
        }
    },

    DeliverypersonLogin: async (req, res) => {
        try {
            const { phoneNumber, password } = req.body
            if (!phoneNumber || !password) {
                return res.status(400).json({ message: "All fields are required", ok: false })
            }
            const user = await Deliveryperson.findOne({ phoneNumber })
            console.log(user)
            if (!user) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            }
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return res.status(401).json({ ok: false, message: "Password is incorrect" })
            }

            const userData = {
                _id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber
            }



            return res.status(200).json({ data: userData, ok: true, message: "logged in successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },
    getAllDeliveryPersons: async (req, res) => {
        let { page, limit, search } = req.query;
        try {
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10

            const query = {}

            if (search) {
                query.name = { $regex: search, $options: "i" }
            }


            const deliveryPersons = await Deliveryperson.find(query)
                .select("-password")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await Deliveryperson.countDocuments(query)

            return res.status(201).json({
                data: deliveryPersons,
                count,
                ok: true,
                message: "Delivery persons fetched successfully"
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },

    getDeliveryPerson: async (req, res) => {
        try {
            const { id } = req.query

            const getPerson = await Deliveryperson.findById(id)
            if (!getPerson) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            }
            return res.status(200).json({ data: getPerson, ok: true, message: "Deliveryperson fetched successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },

    availableDeliveryPersons: async (req, res) => {
        try {
            const availablePersons = await Deliveryperson.find({ isAvailable: true }).select("-password")
            if (!availablePersons) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            } else if (availablePersons.length === 0) {
                return res.status(404).json({ ok: false, message: "No deliveryperson available" })
            }
            return res.status(200).json({ data: availablePersons, ok: true, message: "Deliveryperson fetched successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },

    getOrdersByDeliveryPerson: async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ ok: false, message: "Person Id is required" })
            }
            const orders = await Order.find({ status: { $in: ["confirmed", "pickedup", "ontheWay"] }, deliveryPerson: id }).populate("address").populate("userId", "phoneNumber email  firstName").populate("orderSummary._id", "productName createdAt")
            if (!orders) {
                return res.status(404).json({ ok: false, message: "Orders not found" })
            }
            return res.status(200).json({ data: orders, ok: true, message: "Orders fetched successfully" })

        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },
    completedOrder: async (req, res) => {
        try {
            const { id, orderId } = req.query
            if (!id) {
                return res.status(400).json({ ok: false, message: "Person Id is required" })
            }
            const person = await Deliveryperson.findById(id).select("_id name isAvailable phoneNumber orderHistory");
            const order = await Order.findById(orderId)
            if (!order) {
                return res.status(404).json({ ok: false, message: "Order not found" })
            }
            if (!person) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            }
            person.isAvailable = true
            // order.deliveryPerson = null
            order.status = "delivered"
            person.orderHistory.push(order)
            await order.save()
            await person.save()
            return res.status(200).json({ data: { person, order }, ok: true, message: "Order completed" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },

    getCompletedOrders: async (req, res) => {
        let { id } = req.query
        if (!id) {
            return res.status(400).json({ ok: false, message: "Person Id is required" })
        }
        try {

            const person = await Deliveryperson.findById(id).select("_id name isAvailable phoneNumber orderHistory").populate({
                path: "orderHistory",
                populate: {
                    path: "address",
                    path: "userId",
                    options: {
                        select: "firstName lastName phoneNumber email"
                    }
                }
            }).sort({ createdAt: -1 }).exec();


            if (!person) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            }
            return res.status(200).json({ data: person, ok: true, message: "Deliveryperson fetched successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },



    // getCompletedOrders: async (req, res) => {
    //     let { id, page, limit } = req.query;
    //     if (!id) {
    //         return res.status(400).json({ ok: false, message: "Person Id is required" });
    //     }
    //     try {
    //         page = parseInt(page) || 1;
    //         limit = parseInt(limit) || 10;

    //         const person = await Deliveryperson.findById(id)
    //             .select("_id name isAvailable phoneNumber orderHistory")
    //             .populate({
    //                 path: "orderHistory",
    //                 populate: {
    //                     path: "address userId",
    //                     options: {
    //                         select: "firstName lastName phoneNumber email"
    //                     }
    //                 }
    //             })
    //             .exec();

    //         if (!person) {
    //             return res.status(404).json({ ok: false, message: "Deliveryperson not found" });
    //         }

    //         const startIndex = (page - 1) * limit;
    //         const endIndex = page * limit;
    //         const orderHistorySlice = person.orderHistory.slice(startIndex, endIndex);

    //         return res.status(200).json({
    //             data: {
    //                 ...person.toObject(),
    //                 orderHistory: orderHistorySlice
    //             },
    //             ok: true,
    //             message: "Deliveryperson fetched successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message, ok: false });
    //     }
    // },



    updateDeliveryPerson: async (req, res) => {

        try {
            const { id } = req.query;
            const { name, phoneNumber, password } = req.body

            if (!id) {
                return res.status(400).json({ ok: false, message: "Person Id is required" })
            }

            const updatePerson = await Deliveryperson.findByIdAndUpdate(
                { _id: id },
                { name, phoneNumber, password },
                { new: true }
            )

            return res.status(200).json({ data: updatePerson, ok: true, message: "Deliveryperson updated " })

        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    },

    deleteDeliveryPerson: async (req, res) => {
        try {
            const { id } = req.query
            if (!id) {
                return res.status(400).json({ ok: false, message: "Person Id is required" })
            }
            const deletePerson = await Deliveryperson.findByIdAndDelete(id);

            if (!deletePerson) {
                return res.status(404).json({ ok: false, message: "Deliveryperson not found" })
            }
            return res.status(200).json({ data: deletePerson, ok: true, message: "Deliveryperson deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    }

}