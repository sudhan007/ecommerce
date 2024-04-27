import Coupon from "../models/Coupon.js";

const validateExpirationDate = (expirationDate) => {
    const currentDate = new Date();
    const providedExpirationDate = new Date(expirationDate);
  
    return providedExpirationDate > currentDate;
  };

export const CouponController = {
    createCoupon: async (req, res) => {
        try {
            const { code, discountPercentage, expirationDate } = req.body;
                
            if (!validateExpirationDate(expirationDate)) {
                return res.status(400).json({
                  ok: false,
                  message: 'Expiration date must be in the future',
                });
              }

            const newCoupon = new Coupon({ code, discountPercentage, expirationDate });
            await newCoupon.save();
        
            res.status(201).json({ ok:true,data:newCoupon,message: 'Coupon created successfully' });
          } catch (error) {
            console.error('Error creating coupon:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

    getCoupon: async (req, res) => {
        try {
            const { couponId } = req.query;
        
            const coupon = await Coupon.findById(couponId);
        
            if (!coupon) {
              return res.status(404).json({
                ok: false,
                message: 'Coupon not found',
              });
            }
        
            res.status(200).json({ ok: true, data: coupon, message: 'Coupon retrieved successfully' });
          } catch (error) {
            console.error('Error getting coupon:', error);
            res.status(500).json({ ok: false, error: 'Internal Server Error' });
          }
    },

    getAllCoupons: async (req, res) => {
        let { page, limit, search, startdate, enddate } = req.query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const query = {};

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
            const coupons = await Coupon.find(query);

            const count = await Coupon.countDocuments(query);
        
            res.status(200).json({ ok: true, data: coupons, message: 'All coupons retrieved successfully',count });
          } catch (error) {
            console.error('Error getting all coupons:', error);
            res.status(500).json({ ok: false, error: 'Internal Server Error' });
          }
    },

    updateCoupon: async (req, res) => {
        try {
            const { couponId } = req.query;
            const { code, discountPercentage, expirationDate } = req.body;
        
            if (!validateExpirationDate(expirationDate)) {
              return res.status(400).json({
                ok: false,
                message: 'Expiration date must be in the future',
              });
            }
        
            const updatedCoupon = await Coupon.findByIdAndUpdate(
              couponId,
              { code, discountPercentage, expirationDate },
              { new: true }
            );
        
            if (!updatedCoupon) {
              return res.status(404).json({
                ok: false,
                message: 'Coupon not found',
              });
            }
        
            res.status(200).json({ ok: true, data: updatedCoupon, message: 'Coupon updated successfully' });
          } catch (error) {
            console.error('Error updating coupon:', error);
            res.status(500).json({ ok: false, error: 'Internal Server Error' });
          }
    },

    deleteCoupon: async (req, res) => {
        try {
            const { couponId } = req.query;
        
            const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
        
            if (!deletedCoupon) {
              return res.status(404).json({
                ok: false,
                message: 'Coupon not found',
              });
            }
        
            res.status(200).json({ ok: true, data: deletedCoupon, message: 'Coupon deleted successfully' });
          } catch (error) {
            console.error('Error deleting coupon:', error);
            res.status(500).json({ ok: false, error: 'Internal Server Error' });
          }
    },

};