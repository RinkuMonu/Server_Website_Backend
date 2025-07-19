const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/encryptPassword');
const { generateToken } = require('../utils/generateToken');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, company_name, address, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      company_name,
      address,
      role
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.is_deleted) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logout successful (client must discard token)' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.is_deleted)
      return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // In production: Send email with resetToken
    res.status(200).json({ message: 'Password reset token generated', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      is_deleted: false
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.is_deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, password, phone, company_name, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (company_name) user.company_name = company_name;
    if (address) user.address = address;
    if (password) user.password = await hashPassword(password);

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ is_deleted: false }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, is_deleted: false }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, phone, company_name, address, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user || user.is_deleted) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (company_name) user.company_name = company_name;
    if (address) user.address = address;
    if (role) user.role = role;
    if (password) user.password = await hashPassword(password);

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.is_deleted) return res.status(404).json({ message: 'User not found' });

    user.is_deleted = true;
    user.deleted_at = new Date();
    await user.save();

    res.status(200).json({ message: 'Your profile has been soft deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.is_deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is_deleted = true;
    user.deleted_at = new Date();
    await user.save();

    res.status(200).json({ message: 'User soft deleted by admin successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Admin failed to delete user', error: err.message });
  }
};