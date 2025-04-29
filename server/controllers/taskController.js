const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, stages } = req.body;

    // Check if assigned user exists
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority: priority || 'medium',
      dueDate,
      stages: stages || []
    });

    if (task) {
      res.status(201).json(task);
    } else {
      res.status(400).json({ message: 'Invalid task data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    
    // If admin, get all tasks, otherwise only get tasks assigned to the user
    if (req.user.role === 'admin') {
      tasks = await Task.find({})
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 });
    }
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .populate('stages.approvedBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to view this task
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }
    
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions - only admin can edit all fields
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Determine which fields can be updated based on user role
    const updateFields = {};

    if (req.user.role === 'admin') {
      // Admins can update all fields
      const { title, description, assignedTo, priority, dueDate, status, stages } = req.body;
      
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (assignedTo) {
        // Verify user exists
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        updateFields.assignedTo = assignedTo;
      }
      if (priority) updateFields.priority = priority;
      if (dueDate) updateFields.dueDate = dueDate;
      if (status) updateFields.status = status;
      if (stages) updateFields.stages = stages;
    } else {
      // Regular users can only update status and add notes
      const { status } = req.body;
      
      if (status) {
        // Regular users can't set status to 'reviewed'
        updateFields.status = status === 'reviewed' ? task.status : status;
      }
    }

    // Update task with allowed fields
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
     .populate('assignedBy', 'name email');
    
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add note to task
// @route   POST /api/tasks/:id/notes
// @access  Private
exports.addTaskNote = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to add notes to this task
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add notes to this task' });
    }

    const note = {
      content,
      createdBy: req.user._id,
      createdAt: Date.now()
    };

    task.notes.push(note);
    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.createdBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update task stage
// @route   PUT /api/tasks/:id/stages/:stageIndex
// @access  Private
exports.updateTaskStage = async (req, res) => {
  try {
    const { completed } = req.body;
    const { id, stageIndex } = req.params;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if stage exists
    if (!task.stages[stageIndex]) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task stage' });
    }

    // Update stage
    task.stages[stageIndex].completed = completed;
    
    if (completed) {
      task.stages[stageIndex].completedAt = Date.now();
    } else {
      task.stages[stageIndex].completedAt = undefined;
      task.stages[stageIndex].approvedBy = undefined;
    }

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .populate('stages.approvedBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve task stage (admin only)
// @route   PUT /api/tasks/:id/stages/:stageIndex/approve
// @access  Private/Admin
exports.approveTaskStage = async (req, res) => {
  try {
    const { id, stageIndex } = req.params;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if stage exists
    if (!task.stages[stageIndex]) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    // Only approve if stage is completed
    if (!task.stages[stageIndex].completed) {
      return res.status(400).json({ message: 'Stage must be completed before approval' });
    }

    // Set approver
    task.stages[stageIndex].approvedBy = req.user._id;
    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .populate('stages.approvedBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};