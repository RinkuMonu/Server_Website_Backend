const Plan = require('../models/plan.model');
const Category = require('../models/category.model');

exports.createPlan = async (req, res) => {
  try {
    const {
      category_id,
      name,
      slug,
      cpu,
      ram,
      storage,
      bandwidth,
      os_options,
      location,
      duration,
      price,
      setup_fee,
      stock,
      is_active,
      features
    } = req.body;

    const existingSlug = await Plan.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const plan = new Plan({
      category_id,
      name,
      slug,
      cpu,
      ram,
      storage,
      bandwidth,
      os_options,
      location,
      duration,
      price,
      setup_fee,
      stock,
      is_active,
      features
    });

    await plan.save();
    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create plan', error: err.message });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const {
      search,
      category_id,
      is_active,
      duration,
      cpu,
      ram,
      location,
      min_price,
      max_price,
      plan_type,
      slug
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    if (category_id) filter.category_id = category_id;
    if (is_active !== undefined) filter.is_active = is_active === 'true';
    if (duration) filter.duration = duration;
    if (cpu) filter.cpu = cpu;
    if (ram) filter.ram = ram;
    if (location) filter.location = location;

    if (slug) filter.slug = slug;

    if (plan_type === 'monthly') filter.duration = 'monthly';
    else if (plan_type === 'yearly') filter.duration = 'yearly';

    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = parseFloat(min_price);
      if (max_price) filter.price.$lte = parseFloat(max_price);
    }

    let plans = await Plan.find(filter)
      .populate('features')
      .lean();

    if (plan_type === 'yearly') {
      plans = plans.map(plan => ({
        ...plan,
        yearly_price: plan.price * 12
      }));
    }

    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans', error: err.message });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('features')
      .lean();

    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    if (plan.duration === 'yearly') {
      plan.yearly_price = plan.price * 12;
    }

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plan', error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('features');

    if (!updated) return res.status(404).json({ message: 'Plan not found' });

    res.status(200).json({ message: 'Plan updated successfully', plan: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update plan', error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Plan not found' });

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete plan', error: err.message });
  }
};

exports.getPlansBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const plans = await Plan.find({ category_id: category._id })
      .populate('features')
      .lean();

    return res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch plans by slug',
      error: err.message
    });
  }
};
