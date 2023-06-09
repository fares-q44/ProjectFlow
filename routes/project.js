const express = require('express');
const {
  getAllProjects,
  getSingleProject,
  createProject,
  updateProject,
  deleteProject,
  uploadFile,
  downloadFile,
  deleteFile,
} = require('../controllers/project');
const auth = require('./auth');
const taskRouter = require('./task');
const { authorize, protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllProjects).post(protect, createProject);
router
  .route('/:id')
  .get(getSingleProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
router.route('/:id/file').post(uploadFile).get(downloadFile).delete(deleteFile);
router.use('/:projectId/tasks', taskRouter);
module.exports = router;
