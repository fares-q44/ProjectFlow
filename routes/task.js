const express = require('express');
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/task');

const router = express.Router({ mergeParams: true });

// Routes for tasks within a project
router.route('/').post(createTask).get(getAllTasks);
router.route('/:taskId').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
