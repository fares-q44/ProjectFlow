const asyncHandler = require('../middleware/async');
const Project = require('../models/Project');
const User = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

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
// @access public
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
// @access public
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
