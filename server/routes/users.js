const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUser);

module.exports = router;