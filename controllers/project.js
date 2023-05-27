const asyncHandler = require('../middleware/async');
const Project = require('../models/Project');
const User = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// @desc Get all projects
// @route GET /api/projects
// @access public
exports.getAllProjects = asyncHandler(async (req, res, next) => {
  let projects;
  if (req.params.id) {
    projects = await Project.find({ owner: req.params.id });
  } else {
    projects = await Project.find();
  }
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});
// @desc Get Single project
// @route GET /api/projects/:id
// @access public
exports.getSingleProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    count: project.length,
    data: project,
  });
});
// @desc Create a project
// @route POST /api/projects
// @access public
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});
// @desc Update a project
// @route PUT /api/projects/:id
// @access private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with the id ${req.params.id}`, 404)
    );
  }
  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user with the id ${req.user.id} is not authorized to update project ${project._id} `,
        401
      )
    );
  }
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});
// @desc Delete a project
// @route DELETE /api/projects/:id
// @access private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with the id ${req.params.id}`, 404)
    );
  }
  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user with the id ${req.user.id} is not authorized to delete project ${project._id} `,
        401
      )
    );
  }
  project = await Project.findByIdAndDelete(req.params.id);
  res.status(201).json({
    success: true,
    data: {},
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
// @route POST /api/projects/:id/file
// @access private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project is not found', 404));
  }
  if (project.file) {
    return next(new ErrorResponse('Project Already has a file', 400));
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      // Handle error if any
      return next(err);
    }

    // File has been uploaded successfully
    const file = req.file;
    project.file = file.path;
    await project.save();
    res
      .status(200)
      .json({ success: true, message: 'File uploaded successfully' });
  });
});

// @desc Download a file
// @route GET /api/projects/:id/file
// @access private
exports.downloadFile = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project is not found', 404));
  }
  if (!project.file) {
    return next(new ErrorResponse('Project does not have a file', 400));
  }
  const filePath = path.resolve(__dirname, '..', project.file);

  res.sendFile(filePath);
});

// @desc Delete a file
// @route DELETE /api/projects/:id/file
// @access private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project is not found', 404));
  }
  if (!project.file) {
    return next(new ErrorResponse('Project does not have a file', 400));
  }
  const filePath = path.resolve(__dirname, '..', project.file);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log('path/file.txt was deleted');
  });
  project.file = undefined;
  await project.save();
  res.status(200).json({ success: true, data: {} });
});
