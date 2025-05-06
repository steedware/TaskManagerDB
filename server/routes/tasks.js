const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask,
  addTaskNote,
  updateTaskStage,
  approveTaskStage
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

router.route('/:id/notes')
  .post(protect, addTaskNote);

router.route('/:id/stages/:stageIndex')
  .put(protect, updateTaskStage);

router.route('/:id/stages/:stageIndex/approve')
  .put(protect, admin, approveTaskStage);

module.exports = router;