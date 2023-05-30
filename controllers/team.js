const asyncHandler = require('../middleware/async');
const Team = require('../models/Team');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
// @desc Create a new team
// @route POST /api/teams
// @access private
exports.createTeam = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const team = await Team.create(body);

  res.status(201).json({
    success: true,
    data: team,
  });
});

// @desc Retrieve all teams for a user
// @route GET /api/teams
// @access private
exports.getTeamsForUser = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const userId = req.user.id;

  const teams = await Team.find({ members: userId });

  res.status(200).json({
    success: true,
    data: teams,
  });
});

// @desc Retrieve a specific team
// @route GET /api/teams/:id
// @access private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse('Team not found', 404));
  }

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc Update a team
// @route PUT /api/teams/:id
// @access private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;

  let team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse('Team not found', 404));
  }

  await team.updateOne(req.body);

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc Delete a team
// @route DELETE /api/teams/:id
// @access private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse('Team not found', 404));
  }

  await team.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Add members to a team
// @route POST /api/teams/:id/members
// @access private
exports.addMembersToTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const { members } = req.body;
  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorResponse('Team not found', 404));
  }

  // Add new members to the team
  team.members.push(...members);
  console.log(team);
  await team.save();

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc Remove member from a team
// @route DELETE /api/teams/:id/members/:memberId
// @access private
exports.removeMember = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({ success: false, error: 'Team not found' });
  }
  const memberId = req.params.userId;
  const memberObjectId = new mongoose.Types.ObjectId(memberId);
  if (!team.members.includes(memberObjectId)) {
    return res
      .status(400)
      .json({ success: false, error: 'Member does not exist in the team' });
  }

  // Remove the member from the members array
  team.members.pull(memberId);
  await team.save();

  res.status(200).json({
    success: true,
    message: 'Member removed from the team successfully',
  });
});
