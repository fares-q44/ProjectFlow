const express = require('express');
const {
  register,
  login,
  getMe,
  updateData,
  deleteUser,
  adminDeleteUser,
} = require('../controllers/auth');
const { authorize, protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.get('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedata', protect, updateData);
router.delete('/deleteuser', protect, deleteUser);
router.delete('/deleteuser/:id', protect, authorize('admin'), adminDeleteUser);

module.exports = router;
