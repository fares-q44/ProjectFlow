const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc Register user
// @route POST /api/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendTokenResponse(user, res);
});
// @desc Login user
// @route GET /api/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );
  if (!user) {
    return next(new ErrorResponse('Email or Password is incorrect', 400));
  }
  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorResponse('Email or Password is incorrect', 400));
  }
  sendTokenResponse(user, res);
});
// @desc Get logged in user
// @route GET /api/auth/login
// @access private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
// @desc Update user data
// @route GET /api/auth/updatedata
// @access private
exports.updateData = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc Delete user
// @route GET /api/auth/deleteUser
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc Admin Delete user
// @route GET /api/auth/deleteUser/:id
// @access private
exports.adminDeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

function sendTokenResponse(user, res) {
  const token = user.getJwtToken();

  res
    .status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      token,
    });
}
