import StarexDetails from "../models/Starexdetails.js"

export const StarexDetailsController = {


    createDetails: async (req, res) => {
        try {
            const { email, phoneNumber } = req.body;
            const existingDetails = await StarexDetails.findOne();

            if (!email || !phoneNumber || email === "" || phoneNumber === "") {
                return res.status(400).json({ message: "Email and phoneNumber are required", ok: false });
            }

            if (existingDetails) {
                // If data exists, update it
                const updatedDetails = await StarexDetails.findByIdAndUpdate(
                    existingDetails._id,
                    { email, phoneNumber },
                    { new: true }
                );
                return res.status(200).json({
                    data: updatedDetails,
                    message: "StarexDetails updated",
                    ok: true
                });
            } else {
                const details = await StarexDetails.create({
                    email,
                    phoneNumber
                });
                return res.status(201).json({
                    data: details,
                    message: "StarexDetails created",
                    ok: true
                });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false });
        }
    },

    updateDetails: async (req, res) => {
        try {
            const { id } = req.query;
            const { email, phoneNumber } = req.body
            if (!id) {
                return res.status(400).json({ ok: false, message: "Details Id is required" })
            }

            const updateDetails = await StarexDetails.findByIdAndUpdate(
                { _id: id },
                { email, phoneNumber },
                { new: true }
            )

            return res.status(200).json({ data: updateDetails, ok: true, message: "StarexDetails updated " })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }

    },

    getDetails: async (req, res) => {
        try {
            const details = await StarexDetails.findOne();
            return res.status(200).json({ data: details, ok: true, message: "StarexDetails fetched successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message, ok: false })
        }
    }
}