const asyncHandler = require('../middleware/async');

const Task = require('../models/Task');

// @desc Create a new task within a project
// @route POST /api/projects/:projectId/tasks
// @access Public
exports.createTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const taskData = req.body;

  // Add project ID to task data
  taskData.project = projectId;

  const task = await Task.create(taskData);
  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc Retrieve all tasks for a project
// @route GET /api/projects/:projectId/tasks
// @access Public
exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId });
  res.json({
    success: true,
    data: tasks,
  });
});

// @desc Retrieve a specific task
// @route GET /api/projects/:projectId/tasks/:taskId
// @access Public
exports.getTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({
    success: true,
    data: task,
  });
});

// @desc Update a task
// @route PUT /api/projects/:projectId/tasks/:taskId
// @access Public
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const taskData = req.body;

  const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({
    success: true,
    data: task,
  });
});

// @desc Delete a task
// @route DELETE /api/projects/:projectId/tasks/:taskId
// @access Public
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({
    success: true,
    message: 'Task deleted',
  });
});
