import Product from "../models/Product.js";
import { deleteFile } from "../middlewares/upload.js";
import { checkExpiredHotDeals } from "../middlewares/expirationTask.js";

setInterval(checkExpiredHotDeals, 60 * 60 * 1000);

export const ProuctController = {
  addProduct: async (req, res) => {
    try {
      const {
        productName,
        price,
        discount,
        image,
        category,
        description,
        availableQuantity,
        offers,
        unit
      } = req.body;

      const existingProduct = await Product.findOne({ productName });

      if (existingProduct) {
        return res
          .status(409)
          .json({ message: "Product already exists", ok: false });
      }

      const discountedPrice = price - discount;

      const product = await Product.create({
        productName,
        discount,
        price,
        discountedPrice,
        image,
        category,
        description,
        availableQuantity,
        offer: offers,
        unit
      });

      return res.status(201).json({
        data: product,
        message: "Product created successfully",
        ok: true,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", ok: false });
    }
  },

  getProducts: async (req, res) => {
    let { page, limit, search, startdate, enddate } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = {};

      if (search) {
        query.productName = { $regex: search, $options: "i" };
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

      const products = await Product.find(query)
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Product.countDocuments(query);

      return res.status(200).json({
        data: products,
        ok: true,
        message: "Products fetched successfully",
        count,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again", ok: false });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.query;

      const product = await Product.findById(id).populate("category");

      return res.status(200).json({
        data: product,
        ok: true,
        message: "Product fetched successfully",
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res
          .status(400)
          .json({ ok: false, message: "Product ID is required" });
      }

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res
          .status(404)
          .json({ ok: false, message: "Product not found" });
      }

      if (product) {
        deleteFile(product.imageUrl);
      }

      return res.status(200).json({
        data: product,
        ok: true,
        message: "Product deleted successfully",
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.query;
      const {
        productName,
        price,
        discount,
        category,
        description,
        availableQuantity,
        offers,
        image,
        unit
      } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ ok: false, message: "Product ID is required" });
      }



      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          productName,
          price,
          discount,
          image,
          category,
          description,
          availableQuantity,
          offers,
          unit
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ ok: false, message: "Product not found" });
      }

      return res.status(200).json({
        data: updatedProduct,
        ok: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ ok: false, message: error.message });
    }
  },

  // updateProduct: async (req, res) => {
  //   try {
  //     const { id } = req.query;
  //     const {
  //       productName,
  //       price,
  //       discount,
  //       image,
  //       category,
  //       description,
  //       availableQuantity,
  //       offers,
  //     } = req.body;

  //     if (!id) {
  //       return res
  //         .status(400)
  //         .json({ ok: false, message: "Product ID is required" });
  //     }

  //     const updatedProduct = await Product.findByIdAndUpdate(
  //       id,
  //       {
  //         productName,
  //         price,
  //         discount,
  //         image,
  //         category,
  //         description,
  //         availableQuantity,
  //         offers,
  //       },
  //       { new: true }
  //     );

  //     if (!updatedProduct) {
  //       return res
  //         .status(404)
  //         .json({ ok: false, message: "Product not found" });
  //     }

  //     return res.status(200).json({
  //       data: updatedProduct,
  //       ok: true,
  //       message: "Product updated successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     return res.status(500).json({ ok: false, message: error.message });
  //   }
  // },
  filterProducts: async (req, res) => {
    let { page, limit, productName, minPrice, maxPrice, tags, category } =
      req.query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const filter = {};

      if (productName) {
        filter.productName = new RegExp(productName, "i");
      }

      if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice);
        }

        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice);
        }
      }

      if (category && category !== "all") {
        filter["category"] = category;
      }

      if (category === "all") {
        filter["category"] = { $ne: null };
      }

      if (tags) {
        filter.tags = { $in: tags.split(",") };
      }

      const filteredProducts = await Product.find(filter)
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await Product.countDocuments(filter);

      return res.status(200).json({
        data: filteredProducts,
        message: "Products filtered successfully",
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

  setHotDeal: async (req, res) => {
    try {
      const productId = req.query.productId;
      const toggle = req.query.toggle;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (toggle === "true") {
        product.isHotDeal = true;
      } else if (toggle === "false") {
        product.isHotDeal = false;
      } else {
        return res
          .status(400)
          .json({ error: "Invalid 'toggle' parameter value" });
      }

      await product.save();

      const message = `Hot deal set to ${product.isHotDeal ? "true" : "false"
        } successfully`;

      res.status(200).json({ product, message, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", ok: false });
    }
  },

  getHotDeals: async (req, res) => {
    let { page, limit } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const hotDeals = await Product.find({ isHotDeal: true })
        .skip((page - 1) * limit)
        .limit(limit);

      const count = await Product.countDocuments({ isHotDeal: true });

      res.status(200).json({
        deals: hotDeals,
        message: "Hot deals retrieved successfully",
        ok: true,
        count: count,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", ok: false });
    }
  },

  getHotDeal: async (req, res) => {
    let { page, limit } = req.query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const { categoryId } = req.query;

      if (!categoryId) {
        return res
          .status(400)
          .json({ ok: false, message: "Category ID is required" });
      }

      const hotDeals = await Product.find({
        category: categoryId,
        isHotDeal: true,
      });

      const count = await Product.countDocuments({
        category: categoryId,
        isHotDeal: true,
      });

      res.status(200).json({
        deals: hotDeals,
        message: "Hot deals retrieved successfully",
        ok: true,
        count,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", ok: false });
    }
  },

  searchProducts: async (req, res) => {
    let { query: productName, page, limit } = req.query;
    try {
      if (!productName) {
        return res
          .status(400)
          .json({ ok: false, message: "Product name is required" });
      }

      limit = parseInt(limit) || 10;
      page = parseInt(page) || 1;

      const products = await Product.find({
        productName: { $regex: productName, $options: "i" },
      })
        .skip(page * limit)
        .limit(limit)
        .lean()
        .exec();

      res.status(200).json({
        data: products,
        message: "Products retrieved successfully",
        ok: true,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error", ok: false });
    }
  },
};
