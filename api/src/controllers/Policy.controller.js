import Policy from '../models/Policy.js';

export const PolicyController = {

  addTermsAndPolicy: async (req, res) => {
    try {
      const { type, content } = req.body;

      let policy = await Policy.findOne({ type });

      if (policy) {
        policy.content = content;
        await policy.save();
        return res.status(200).json({
          ok: true,
          message: 'Policy updated successfully',
          data: policy,
        });
      } else {
        policy = new Policy({ type, content });
        await policy.save();
        return res.status(201).json({
          ok: true,
          message: 'Policy added successfully',
          data: policy,
        });
      }
    } catch (error) {
      console.error('Error adding/updating policy:', error);
      return res.status(500).json({ message: error.message, ok: false });
    }
  },

  getTermsAndPolicy: async (req, res) => {
    try {
      const { type } = req.query;
      if (!type) {
        return res.status(400).json({ message: 'Type is required', ok: false });
      }
      const policy = await Policy.findOne({ type });

      if (!policy) {
        return res.status(404).json({ message: 'Policy not found', ok: false });
      }
      return res.status(200).json({ data: policy, ok: true, message: 'Policy fetched successfully' });

    } catch (error) {
      return res.status(500).json({ message: error.message, ok: false });
    }
  },


}