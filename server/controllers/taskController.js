const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, stages } = req.body;

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

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

exports.getTasks = async (req, res) => {
  try {
    let tasks;
    
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

    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }
    
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updateFields = {};

    if (req.user.role === 'admin') {
      const { title, description, assignedTo, priority, dueDate, status, stages } = req.body;
      
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (assignedTo) {
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
      const { status } = req.body;
      
      if (status) {
        updateFields.status = status === 'reviewed' ? task.status : status;
      }
    }

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

exports.updateTaskStage = async (req, res) => {
  try {
    const { completed } = req.body;
    const { id, stageIndex } = req.params;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.stages[stageIndex]) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task stage' });
    }

    task.stages[stageIndex].completed = completed;
    
    if (completed) {
      task.stages[stageIndex].completedAt = Date.now();
      
      const allStagesCompleted = task.stages.every(stage => stage.completed);
      
      if (allStagesCompleted && task.status !== 'reviewed') {
        task.status = 'completed';
      }
    } else {
      task.stages[stageIndex].completedAt = undefined;
      task.stages[stageIndex].approvedBy = undefined;
      
      if (task.status === 'completed') {
        task.status = 'in-progress';
      }
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

exports.approveTaskStage = async (req, res) => {
  try {
    const { id, stageIndex } = req.params;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.stages[stageIndex]) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    if (!task.stages[stageIndex].completed) {
      return res.status(400).json({ message: 'Stage must be completed before approval' });
    }

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