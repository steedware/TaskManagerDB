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

// Get all tasks and create new task
router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

// Get, update and delete task by ID
router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

// Add note to task
router.route('/:id/notes')
  .post(protect, addTaskNote);

// Update task stage
router.route('/:id/stages/:stageIndex')
  .put(protect, updateTaskStage);

// Approve task stage (admin only)
router.route('/:id/stages/:stageIndex/approve')
  .put(protect, admin, approveTaskStage);

module.exports = router;