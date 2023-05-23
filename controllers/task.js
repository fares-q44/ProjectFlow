const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

// @desc Create a new task within a project
// @route POST /api/projects/:projectId/tasks
// @access Public
exports.createTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${projectId}`, 404)
    );
  }

  req.body.project = projectId;
  const task = await Task.create(req.body);

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
  console.log(projectId);
  const tasks = await Task.find({ project: projectId });
  console.log(tasks);
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc Retrieve a specific task
// @route GET /api/projects/:projectId/tasks/:taskId
// @access Public
exports.getTask = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOne({ _id: taskId, project: projectId });

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc Update a task
// @route PUT /api/projects/:projectId/tasks/:taskId
// @access Public
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc Delete a task
// @route DELETE /api/projects/:projectId/tasks/:taskId
// @access Public
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
