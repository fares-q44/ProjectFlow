const express = require('express');
const { authorize, protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
const {
  createComment,
  getComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require('../controllers/comment');

router.route('/').post(createComment).get(getAllComments);

router
  .route('/:commentId')
  .get(getComment)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
