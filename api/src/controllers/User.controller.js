import bcrypt from "bcrypt";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { deleteFile } from "../middlewares/upload.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

import { sendResponseError } from "../middlewares/middleware.js";
import {
  checkPassword,
  newToken,
  adminToken,
} from "../utils/utility.function.js";
import Cart from "../models/Cart.js";

export const UserController = {
  login: async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
      return res.json({ message: "Phone number is required", ok: false });
    }
    try {
      let user = await User.findOne({
        phoneNumber: Number(phone),
      });
      if (!user) {
        user = new User({
          phoneNumber: Number(phone),
          role: "user",
        });

        await user.save();
      }

      let cart = await Cart.findOne({
        userId: user._id,
      });

      if (!cart) {
        cart = new Cart({
          userId: user._id,
          products: [],
          totalPrice: 0,
        });
      }

      user.cartId = cart._id;
      await user.save();
      await cart.save();

      let token = newToken(user.phoneNumber);
      return res.status(200).json({
        message: "Login successfully",
        ok: true,
        data: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          token: token,
        },
      });
    } catch (err) {
      console.log("Error", err);
      sendResponseError(500, `Error ${err}`, res);
    }
  },
  getAllCounts: async (req, res) => {
    try {
      const productCount = await Product.countDocuments();
      const orderCount = await Order.countDocuments();
      const categoryCount = await Category.countDocuments();
      const userCount = await User.countDocuments();

      return res.status(200).json({
        productCount,
        orderCount,
        categoryCount,
        userCount,
      });
    } catch (error) {
      console.error("Error during counting:", error);
      return res.status(500).json({ message: "Count error", ok: false });
    }
  },

  GetCookie: async (req, res) => {
    const { userId } = req.cookies.userId;

    if (userId) {
      res.send(`User ID: ${userId}`);
    } else {
      res.send("User ID not found in the cookie");
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.query;
    const { name, email, image } = req.body;

    try {
      if (!userId) {
        return res
          .status(400)
          .json({ ok: false, message: "userId are required" });
      }
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      if (email) {
        const userExistsWithEmail = await User.findOne({
          email,
          _id: { $ne: userId },
        });
        if (userExistsWithEmail) {
          return res
            .status(400)
            .json({ ok: false, message: "Email already exists" });
        }
      }

      existingUser.firstName = name || existingUser.firstName;
      existingUser.email = email || existingUser.email;
      existingUser.image = image || existingUser.image;

      await existingUser.save();

      return res.status(200).json({
        ok: true,
        message: "Profile updated successfully",
      });
    } catch (err) {
      console.log("Error: ", err);
      return res
        .status(500)
        .json({ ok: false, message: "Something wrong, please try again" });
    }
  },

  getMinimalData: async (req, res) => {
    try {
      const users = await User.findOne({
        role: "user",
        _id: req.query.userId,
      }).select("firstName email phoneNumber image");
      return res.status(200).json({ ok: true, data: users });
    } catch (err) {
      console.log("Error:", err);
      return res
        .status(500)
        .json({ ok: false, message: "Something went wrong, please try again" });
    }
  },

  forgetPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const resetToken = generateResetToken();

      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000;
      await user.save();

      return res
        .status(200)
        .json({ ok: true, message: "Password reset token sent successfully" });
    } catch (err) {
      console.log("Error:", err);
      return res
        .status(500)
        .json({ ok: false, message: "Something went wrong, please try again" });
    }
  },

  getUser: async (req, res) => {
    try {
      const { userId } = req.query;

      const user = await User.findById(userId).populate("cartId");

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ data: user, ok: true, message: "User Fetched Successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getUsers: async (req, res) => {
    let { page, limit, search, startdate, enddate } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = {};

      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },

        ];
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

      const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await User.countDocuments(query);

      return res.status(200).json({
        data: users,
        ok: true,
        message: "Users fetched successfully",
        count,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { userId } = req.query;
      const { enteredPassword, newPassword } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        enteredPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ ok: false, message: "Password is incorrect" });
      }

      const isNewPasswordSameAsEntered = await bcrypt.compare(
        newPassword,
        user.password
      );

      if (isNewPasswordSameAsEntered) {
        return res.status(400).json({
          ok: false,
          message: "New password must be different from the current password",
        });
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 8);

      user.password = newHashedPassword;
      await user.save();

      return res.status(200).json({
        data: user,
        ok: true,
        message: "Password updated successfully",
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  updateNotifications: async (req, res) => {
    try {
      const { id } = req.query;

      const user = await User.findById(id);

      user.notifications.forEach((notif) => {
        notif.status = "read";
      });

      user.markModified("notifications");
      await user.save();

      return res.status(200).json({
        data: user,
        ok: true,
        message: "Notifications updated successfully",
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  filter: async (req, res) => {
    try {
      const { firstName, phoneNumber, email } = req.query;

      const filter = {};

      if (firstName) {
        filter.firstName = new RegExp(firstName, "i");
      }

      if (phoneNumber) {
        const phoneNumberRegex = new RegExp(phoneNumber, "i");
        filter.phoneNumber = phoneNumberRegex;
        if (typeof phoneNumber !== "string") {
          console.error("Invalid phone number format");
          return;
        }
      }

      if (email) {
        filter.email = new RegExp(email, "i");
      }

      const filteredUsers = await User.find(filter);
      console.log("Filter:", filteredUsers);
      const count = await User.countDocuments(filter);

      return res.status(200).json({
        data: filteredUsers,
        message: "Users filtered successfully",
        ok: true,
        count,
      });
    } catch (error) {
      console.error("Error filtering products:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", ok: false });
    }
  },

  insertCart: async (req, res) => {
    try {
      const cartsToInsert = req.body.Carts;
      const userId = req.body.userId;

      let insertedCarts = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { Carts: cartsToInsert } },
        { new: true }
      );

      return res.status(200).json({
        data: insertedCarts,
        ok: true,
        message: "Carts Added successfully",
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ "adminLogin.email": email });

      if (!user) {
        const adminUser = new User({
          adminLogin: {
            email: "admin@gmail.com",
            password: await bcrypt.hash("admin", 10),
          },
          role: "admin",
        });
        const token = newToken(adminUser);
        adminUser.token = token;
        await adminUser.save();

        return res.status(201).json({
          token: token,
          ok: true,
          user: adminUser,
          message: "Admin user created and logged in",
        });
      }

      if (user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized access" });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.adminLogin.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = newToken(user);
      user.token = token;
      await user.save();

      return res.status(200).json({
        token: token,
        ok: true,
        user,
        message: "Admin login successful",
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ message: "Login error", ok: false });
    }
  },

  editAdminLogin: async (req, res) => {
    try {
      const { userId } = req.query;
      const { email, password, image } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      user.adminLogin.email = email;
      user.adminLogin.password = await bcrypt.hash(password, 10);

      if (image) {
        user.image = image;
      }

      await user.save();

      return res.status(200).json({
        user,
        ok: true,
        message: "Admin login credentials updated successfully",
      });
    } catch (error) {
      console.error("Error during admin login update:", error);
      return res.status(500).json({ message: "Update error", ok: false });
    }
  },
};
