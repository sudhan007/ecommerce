import Deal from "../models/Deal.js";
import { deleteFile } from "../middlewares/upload.js";
import { checkExpiredHotDeals } from "../middlewares/expirationTask.js";

export const DealController = {
  addDeal: async (req, res) => {
    try {
      const { name, image, description, category } = req.body;
      const expirationHours = parseFloat(req.body.expirationHours || 24);

      const existingDeal = await Deal.findOne({ name });
      if (existingDeal) {
        deleteFile(image);
        return res.status(409).json({ message: "Deal already exists", ok: false });
      }

      const deal = await Deal.create({
        name: name,
        image: image,
        description: description,
        category: category,
      });
      deal.expirationDate = new Date(Date.now() + expirationHours * 3600 * 1000);
      await checkExpiredHotDeals();

      return res.status(201).json({
        data: deal,
        message: "Deal created successfully",
        ok: true,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getDeals: async (req, res) => {
    let { page, limit, search, startdate, enddate } = req.query;

    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = {};

      if (search) {
        query.name = {
          $regex: search,
          $options: "i",
        };
      }
      if (startdate) {
        query.createdAt = {
          $gte: startdate,
        };
      }
      if (enddate) {
        query.createdAt = {
          $lte: enddate,
        };
      }

      const deals = await Deal.find(query).populate('category')
        .select('+expirationDate')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Deal.countDocuments(query);

      return res.status(200).json({
        ok: true,
        data: deals,
        message: "Deals fetched successfully",
        count
      });
    } catch (error) {
      console.error("Error fetching deals:", error);
      return res.status(500).json({
        ok: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getSingleDealByCategory: async (req, res) => {
    let { page, limit } = req.query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const { categoryId } = req.query;
      if (!categoryId) {
        return res.status(400).json({ ok: false, message: 'Category ID is required' });
      }
      const deal = await Deal.find({ category: categoryId }).populate('category')     
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

      const count = await Deal.countDocuments({
        category: categoryId,
      });

      if (!deal) {
        return res.status(404).json({ ok: false, message: 'Deal not found for the specified category' });
      }

      return res.status(200).json({ data: deal, ok: true, message: "Deal fetched successfully",count });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  updateDeal: async (req, res) => {
    try {
      const { id } = req.query;
      const { name, image, description,expirationHours } = req.body;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Deal ID is required' });
      }

      const existingDeal = await Deal.findById(id);

      if (!existingDeal) {
        return res.status(404).json({ ok: false, message: "Deal not found" });
      }

      const updatedDeal = await Deal.findByIdAndUpdate(
        id,
        { name, image, description,expirationHours },
        { new: true }
      );

      updatedDeal.expirationDate = new Date(Date.now() + expirationHours * 3600 * 1000);
      await checkExpiredHotDeals();

      return res.status(200).json({ data: updatedDeal, ok: true, message: "Deal updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  deleteDeal: async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Deal ID is required' });
      }

      const deal = await Deal.findByIdAndDelete(id);

      if (!deal) {
        return res.status(404).json({ ok: false, message: 'Deal not found' });
      }

      deleteFile(deal.image);

      return res.status(200).json({ data: deal, ok: true, message: "Deal deleted successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },
};
