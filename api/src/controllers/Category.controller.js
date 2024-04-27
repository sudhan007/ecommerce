import { deleteFile } from "../middlewares/upload.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js"

export const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const { categoryName, image } = req.body;

      const existingCategory = await Category.findOne({ categoryName });
      if (existingCategory) {
        deleteFile(image);
        return res.status(409).json({ message: "Category already exists", ok: false });
      }

      const category = await Category.create({
        categoryName: categoryName,
        image: image,
      });

      return res.status(201).json({
        data: category,
        message: "Category created successfully",
        ok: true,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getCategories: async (req, res) => {
    let { page, limit, search, startdate, enddate } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = {};

      if (search) {
        query.categoryName = {
          $regex: search,
          $options: "i",
        };
      }
      if (startdate) {
        query.createdAt = {
          $gte: new Date(startdate),
        };
      }
      if (enddate) {
        query.createdAt = {
          $lte: new Date(enddate),
        };
      }

      const categories = await Category.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products',
          },
        },
        {
          $addFields: {
            productCount: { $size: '$products' },
          },
        },
        {
          $unset: 'products',
        },
        {
          $match: query,
        },
      ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Category.countDocuments(query);

      return res.status(200).json({ data: categories, ok: true, message: "Categories fetched successfully", count });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getCategory: async (req, res) => {
    try {

      const { id } = req.query;

      const category = await Category.findById(id);

      return res.status(200).json({ data: category, ok: true, message: "Category fetched successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.query;
      const { categoryName, image } = req.body;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Category ID is required' });
      }

      const existingCategory = await Category.findById(id);

      if (!existingCategory) {
        return res.status(404).json({ ok: false, message: "Category not found" });
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        { _id: id },
        { categoryName, image },
        { new: true }
      );

      return res.status(200).json({ data: updatedCategory, ok: true, message: "Category updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Category ID is required' });
      }

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return res.status(404).json({ ok: false, message: 'Category not found' });
      }
      await Product.deleteMany({ category: category._id });
      if (category) {
        deleteFile(category.image);
      }

      return res.status(200).json({ data: category, ok: true, message: "Category deleted successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },
};