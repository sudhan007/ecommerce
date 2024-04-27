import Product from "../models/Product.js";

export const checkExpiredHotDeals = async () => {
  try {
    const currentDateTime = new Date();

    const expiredProducts = await Product.find({
      isHotDeal: true,
      expirationDate: { $lt: currentDateTime },
    });

    for (const product of expiredProducts) {
      product.isHotDeal = false;
      product.expirationDate = null;
      await product.save();
    }

    console.log("Expired hot deals checked and updated.");
  } catch (error) {
    console.error("Error checking expired hot deals:", error);
  }
};
