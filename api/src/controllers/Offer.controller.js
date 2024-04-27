import Offer from "../models/Offer.js";
import { deleteFile } from "../middlewares/upload.js";


export const OfferController = {
  addOffer: async (req, res) => {
    try {
      const { name, image, description, category } = req.body;

      const existingOffer = await Offer.findOne({ name });
      if (existingOffer) {
        deleteFile(image);
        return res.status(409).json({ message: "Offer already exists", ok: false });
      }

      const offer = await Offer.create({
        name: name,
        image: image,
        category,
        description: description
      });

      return res.status(201).json({
        data: offer,
        message: "Offer created successfully",
        ok: true,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  getOffers: async (req, res) => {
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

      const offers = await Offer.find(query).populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Offer.countDocuments(query);

      return res.status(200).json({
        ok: true,
        data: offers,
        message: "Offers fetched successfully",
        count
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({
        ok: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getSingleOfferByCategory: async (req, res) => {
    let { page, limit } = req.query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const { categoryId } = req.query;

      if (!categoryId) {
        return res.status(400).json({ ok: false, message: 'Category ID is required' });
      }

      const offer = await Offer.find({ category: categoryId });

      const count = await Offer.countDocuments({
        category: categoryId,
      });

      if (!offer) {
        return res.status(404).json({ ok: false, message: 'Offer not found for the specified category' });
      }

      return res.status(200).json({ data: offer, ok: true, message: 'Offer fetched successfully', count });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  updateOffer: async (req, res) => {
    try {
      const { id } = req.query;
      const { name, image, description } = req.body;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Offer ID is required' });
      }

      const existingOffer = await Offer.findById(id);

      if (!existingOffer) {
        return res.status(404).json({ ok: false, message: "Offer not found" });
      }

      const updatedOffer = await Offer.findByIdAndUpdate(
        { _id: id },
        { name, image, description },
        { new: true }
      );

      return res.status(200).json({ data: updatedOffer, ok: true, message: "Offer updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  },

  deleteOffer: async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ ok: false, message: 'Offer ID is required' });
      }

      const offer = await Offer.findByIdAndDelete(id);

      if (!offer) {
        return res.status(404).json({ ok: false, message: 'Offer not found' });
      }
      await Offer.deleteMany({ offer: offer._id });
      if (offer) {
        deleteFile(offer.image);
      }

      return res.status(200).json({ data: offer, ok: true, message: "Offer deleted successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message, ok: false });
    }
  }
};


