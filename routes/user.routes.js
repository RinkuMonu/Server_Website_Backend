const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteMyProfile,
  deleteUserByAdmin
} = require('../controllers/user.controller');

const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', authMiddleware, getProfile);
// router.put('/profile', authMiddleware, updateProfile);

router.get('/', authMiddleware, isAdmin, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/updateprofile', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware,  deleteMyProfile);
router.delete('/:id', authMiddleware, isAdmin, deleteUserByAdmin);
module.exports = router;
