import axios from 'axios';

export const getAllTasks = async () => {
  try {
    const { data } = await axios.get('/tasks');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching tasks');
  }
};

export const getTaskById = async (id) => {
  try {
    const { data } = await axios.get(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching task');
  }
};

export const createTask = async (taskData) => {
  try {
    if (taskData.dueDate) {
      const dateStr = taskData.dueDate;
      const timeStr = (taskData.dueTime && taskData.dueTime.trim() !== '') ? taskData.dueTime : '23:59';
      
      const combinedDateTime = new Date(`${dateStr}T${timeStr}`);
      
      taskData = {
        ...taskData,
        dueDate: combinedDateTime,
        dueTime: undefined
      };
    }
    
    const { data } = await axios.post('/tasks', taskData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating task');
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { data } = await axios.put(`/tasks/${id}`, taskData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating task');
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await axios.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting task');
  }
};

export const addTaskNote = async (taskId, content) => {
  try {
    const { data } = await axios.post(`/tasks/${taskId}/notes`, { content });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding note');
  }
};

export const updateTaskStage = async (taskId, stageIndex, completed) => {
  try {
    const { data } = await axios.put(`/tasks/${taskId}/stages/${stageIndex}`, { completed });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating stage');
  }
};

export const approveTaskStage = async (taskId, stageIndex) => {
  try {
    const { data } = await axios.put(`/tasks/${taskId}/stages/${stageIndex}/approve`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error approving stage');
  }
};