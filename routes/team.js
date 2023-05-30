const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeamsForUser,
  getTeam,
  updateTeam,
  deleteTeam,
  addMembersToTeam,
  removeMember,
} = require('../controllers/team');
const { protect } = require('../middleware/auth');

// Create a new team
router.post('/', protect, createTeam);

// Retrieve all teams for a user
router.get('/', protect, getTeamsForUser);

// Retrieve a specific team
router.get('/:id', protect, getTeam);

// Update a team
router.put('/:id', protect, updateTeam);

// Delete a team
router.delete('/:id', protect, deleteTeam);

// Add member to a team
router.post('/:id/members', protect, addMembersToTeam);

// Remove member from a team
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
