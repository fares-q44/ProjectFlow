const asyncHandler = require('../middleware/async');

const Comment = require('../models/Comment');

// @desc Create a new comment on a task
// @route POST /api/comments
// @access Public
exports.createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc Get all comments for a task
// @route GET /api/comments
// @access Public
exports.getComment = asyncHandler(async (req, res) => {
  const comments = await Comment.findOne({ _id: req.params.commentId });

  res.status(200).json({
    success: true,
    data: comments,
  });
});
// @desc Get all comments
// @route GET /api/comments
// @access Public
exports.getAllComments = asyncHandler(async (req, res) => {
  if (req.params.taskId) {
    const comments = await Comment.find({ task: req.params.taskId });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } else {
    const comments = await Comment.find();

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
});

// @desc Update a comment
// @route PUT /api/comments/:commentId
// @access Public
exports.updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    res.status(404).json({
      success: false,
      error: 'Comment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc Delete a comment
// @route DELETE /api/comments/:commentId
// @access Public
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId);

  if (!comment) {
    res.status(404).json({
      success: false,
      error: 'Comment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
