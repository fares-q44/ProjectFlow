const asyncHandler = require('../middleware/async');
const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const Task = require('../models/Task');
const fs = require('fs');
// @desc Create a new task within a task
// @route POST /api/tasks/:projectId/tasks
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

// Create storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Specify the destination folder where the file should be saved
  },
  filename: (req, file, cb) => {
    const fileName =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName); // Specify the file name
  },
});

// Create upload instance
const upload = multer({ storage });

// @desc Upload a file
// @route POST /api/tasks/:id/file
// @access private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorResponse('Task is not found', 404));
  }
  if (task.file) {
    return next(new ErrorResponse('Task Already has a file', 400));
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      // Handle error if any
      return next(err);
    }

    // File has been uploaded successfully
    const file = req.file;
    task.file = file.path;
    await task.save();
    res
      .status(200)
      .json({ success: true, message: 'File uploaded successfully' });
  });
});

// @desc Download a file
// @route GET /api/tasks/:id/file
// @access private
exports.downloadFile = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorResponse('Task is not found', 404));
  }
  if (!task.file) {
    return next(new ErrorResponse('Task does not have a file', 400));
  }
  const filePath = path.resolve(__dirname, '..', task.file);

  res.sendFile(filePath);
});

// @desc Delete a file
// @route DELETE /api/tasks/:id/file
// @access private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorResponse('Task is not found', 404));
  }
  if (!task.file) {
    return next(new ErrorResponse('Task does not have a file', 400));
  }
  const filePath = path.resolve(__dirname, '..', task.file);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log('path/file.txt was deleted');
  });
  task.file = undefined;
  await task.save();
  res.status(200).json({ success: true, data: {} });
});
