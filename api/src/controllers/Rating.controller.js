import Rating from '../models/Rating.js';
import Product from '../models/Product.js';

export const RatingController = {
    createRating: async (req, res) => {
      try {
        const { productId, userId, rating, comment } = req.body;
  
        const existingReview = await Rating.findOne({ productId, userId });
  
        if (existingReview) {
          return res.status(409).json({
            ok: false,
            message: "Review already exists for this user and product",
          });
        }
  
        const newReview = new Rating({
          productId,
          userId,
          rating,
          comment,
        });

        const product = await Product.findById(productId);
        product.ratings.push(newReview._id);
        await product.save();
        await newReview.save();
    
        return res.status(201).json({
          ok: true,
          message: "Review posted successfully",
          data: newReview,
        });
      } catch (error) {
        console.error("Error posting review:", error);
        return res.status(500).json({
          ok: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    },
  
    getRating: async (req, res) => {
        try {
          const {productId} = req.query;
      
          const product = await Product.findById(productId).populate('ratings');
      
          if (!product) {
            return res.status(404).json({
              ok: false,
              message: 'Product not found',
            });
          }
      
          const ratings = product.ratings;
      
          return res.status(200).json({
            ok: true,
            data: {
              productId: product._id,
              ratings,
            },
            message: 'Ratings retrieved successfully',
            count: ratings.length,
          });
        } catch (error) {
          console.error('Error getting ratings:', error);
          return res.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: error.message,
          });
        }
    },
    
   getRatings: async (req, res) => {
        let { page, limit, search, startdate, enddate } = req.query;

      try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const query = {};

      if (search) {
        query.comment = {
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

        const ratings = await Rating.find(query)
        .populate('productId')
        .populate('userId')
      .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

        const count = await Rating.countDocuments(query);
  
        return res.status(200).json({
          ok: true,
          data: ratings,
          message: "Ratings fetched successfully",
          count
        });
      } catch (error) {
        console.error("Error fetching ratings:", error);
        return res.status(500).json({
          ok: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    },
  
    updateRating: async (req, res) => {
      try {
        const { id } = req.query;
        const { rating, comment } = req.body;
  
        const updatedRating = await Rating.findByIdAndUpdate(
          id,
          { rating, comment },
          { new: true } 
        );
  
        if (!updatedRating) {
          return res.status(404).json({
            ok: false,
            message: "Rating not found",
          });
        }
  
        return res.status(200).json({
          ok: true,
          message: "Rating updated successfully",
          data: updatedRating,
        });
      } catch (error) {
        console.error("Error updating rating:", error);
        return res.status(500).json({
          ok: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    },
  
    deleteRating: async (req, res) => {
      try {
        const { id } = req.query;
  
        const deletedRating = await Rating.findByIdAndDelete(id);
  
        if (!deletedRating) {
          return res.status(404).json({
            ok: false,
            message: "Rating not found",
          });
        }
  
        return res.status(200).json({
          ok: true,
          message: "Rating deleted successfully",
          data: deletedRating,
        });
      } catch (error) {
        console.error("Error deleting rating:", error);
        return res.status(500).json({
          ok: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    },
  };
  