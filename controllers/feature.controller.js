const Feature = require('../models/feature.model');

exports.createFeature = async (req, res) => {
  try {
    const data = req.body;

    // Handle bulk insert if an array is sent
    if (Array.isArray(data)) {
      if (!data.length) {
        return res.status(400).json({ message: "Empty array not allowed" });
      }

      const result = await Feature.insertMany(data);
      return res.status(201).json({
        message: 'Features created successfully',
        count: result.length,
        features: result
      });
    }

    // Handle single feature insert
    const { title, group, values } = data;

    if (!title || !group || !values) {
      return res.status(400).json({ message: 'Missing required fields: title, group, or values' });
    }

    const feature = new Feature({ title, group, values });
    await feature.save();

    res.status(201).json({ message: 'Feature created successfully', feature });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to create feature',
      error: err.message
    });
  }
};

exports.getAllFeatures = async (req, res) => {
    try {
        const { group } = req.query;
        const filter = group ? { group } : {};
        const features = await Feature.find(filter).sort({ createdAt: 1 });
        res.status(200).json(features);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch features', error: err.message });
    }
};

exports.getFeatureById = async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);
        if (!feature) return res.status(404).json({ message: 'Feature not found' });
        res.status(200).json(feature);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch feature', error: err.message });
    }
};

exports.updateFeature = async (req, res) => {
    try {
        const updatedFeature = await Feature.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedFeature) return res.status(404).json({ message: 'Feature not found' });
        res.status(200).json({ message: 'Feature updated successfully', feature: updatedFeature });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update feature', error: err.message });
    }
};

exports.deleteFeature = async (req, res) => {
    try {
        const deleted = await Feature.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Feature not found' });
        res.status(200).json({ message: 'Feature deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete feature', error: err.message });
    }
};
