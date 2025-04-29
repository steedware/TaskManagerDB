import axios from 'axios';

// Get all tasks
export const getAllTasks = async () => {
  try {
    const { data } = await axios.get('/tasks');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching tasks');
  }
};

// Get task by ID
export const getTaskById = async (id) => {
  try {
    const { data } = await axios.get(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching task');
  }
};

// Create new task (admin only)
export const createTask = async (taskData) => {
  try {
    const { data } = await axios.post('/tasks', taskData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating task');
  }
};

// Update task
export const updateTask = async (id, taskData) => {
  try {
    const { data } = await axios.put(`/tasks/${id}`, taskData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating task');
  }
};

// Delete task (admin only)
export const deleteTask = async (id) => {
  try {
    const { data } = await axios.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting task');
  }
};

// Add note to task
export const addTaskNote = async (taskId, content) => {
  try {
    const { data } = await axios.post(`/tasks/${taskId}/notes`, { content });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding note');
  }
};

// Update task stage
export const updateTaskStage = async (taskId, stageIndex, completed) => {
  try {
    const { data } = await axios.put(`/tasks/${taskId}/stages/${stageIndex}`, { completed });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating stage');
  }
};

// Approve task stage (admin only)
export const approveTaskStage = async (taskId, stageIndex) => {
  try {
    const { data } = await axios.put(`/tasks/${taskId}/stages/${stageIndex}/approve`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error approving stage');
  }
};