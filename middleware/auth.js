const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(new ErrorResponse('Not auhtorized', 401));
  }

  const decoded = jwt.verify(token, 'lefkmnelofoejio');
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      next(new ErrorResponse('Not authorized', 403));
    }
  };
};
