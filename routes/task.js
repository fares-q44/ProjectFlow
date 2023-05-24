const express = require('express');
const router = express.Router({ mergeParams: true });
const comment = require('./comment');
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/task');

// Route for creating a new task within a project
router.post('/projects/:projectId/tasks', createTask);

// Route for retrieving all tasks for a project
router.get('/projects/:projectId/tasks', getAllTasks);

// Route for retrieving a specific task
router.get('/:taskId', getTask);

// Route for updating a task
router.put('/:taskId', updateTask);

// Route for deleting a task
router.delete('/:taskId', deleteTask);
router.use('/:taskId/comments', comment);
module.exports = router;
