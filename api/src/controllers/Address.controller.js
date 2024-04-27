import Address from "../models/Address.js";
import User from "../models/User.js";

export const AddressController = {
  createAddress: async (req, res) => {
    const { userId } = req.query;
    const {
      name,
      phoneNumber,
      pincode,
      state,
      city,
      houseNo,
      street,
      landmark,
      // addressType,
      latitude,
      longitude,
      mapAddress
    } = req.body;

    try {
      const newAddress = new Address({
        name,
        phoneNumber,
        pincode,
        state,
        city,
        houseNo,
        street,
        landmark,
        // addressType,
        latitude,
        longitude,
        mapAddress
      });

      await newAddress.save();

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      user.addresses.push(newAddress._id);

      await user.save();

      return res.status(201).json({
        ok: true,
        message: "Address added successfully",
        data: {
          address: newAddress,
        },
      });
    } catch (err) {
      console.error("Error adding address to user:", err);
      return res
        .status(500)
        .json({ ok: false, message: "Something went wrong" });
    }
  },

  getAddresses: async (req, res) => {
    const { userId } = req.query;

    try {
      const user = await User.findById(userId).populate('addresses');
      const count = await Address.countDocuments(userId);

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const addresses = user.addresses;

      return res.status(200).json({
        ok: true,
        message: "Addresses fetched successfully",
        data: {
          addresses,
        },
        count
      });
    } catch (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  },

  getAddress: async (req, res) => {
    const { addressId } = req.query;
    try {
      const addresses = await Address.findById(addressId);

      return res.status(200).json({
        ok: true,
        message: "All addresses fetched successfully",
        data: {
          addresses: addresses,
        },
      });
    } catch (err) {
      console.error("Error fetching all addresses:", err);
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  },

  updateAddress: async (req, res) => {
    const { addressId } = req.query;
    const {
      name,
      phoneNumber,
      pincode,
      state,
      city,
      houseNo,
      street,
      landmark,
      addressType,
      latitude,
      longitude
    } = req.body;

    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        {
          name,
          phoneNumber,
          pincode,
          state,
          city,
          houseNo,
          street,
          landmark,
          addressType,
          latitude,
          longitude
        },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({
          ok: false,
          message: "Address not found or could not be updated",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Address updated successfully",
        data: {
          address: updatedAddress,
        },
      });
    } catch (err) {
      console.error("Error updating address:", err);
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  },

  deleteAddress: async (req, res) => {
    const { addressId } = req.query;

    try {
      const address = await Address.findById(addressId);

      if (!address) {
        return res.status(404).json({
          ok: false,
          message: "Address not found or could not be deleted",
        });
      }

      const userId = address.userId;

      const deletedAddress = await Address.findByIdAndDelete(addressId);

      if (!deletedAddress) {
        return res.status(404).json({
          ok: false,
          message: "Address not found or could not be deleted",
        });
      }

      const user = await User.findOneAndUpdate(
        { addresses: addressId },
        { $pull: { addresses: addressId } },
        { new: true }
      );
      await user.save();

      return res.status(200).json({
        ok: true,
        message: "Address deleted successfully",
        data: {
          address: deletedAddress,
        },
      });
    } catch (err) {
      console.error("Error deleting address:", err);
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  },

};
