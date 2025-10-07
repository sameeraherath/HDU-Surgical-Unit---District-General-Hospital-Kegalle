import apiClient from "./apiClient";

// Create a new task
export const createTask = async (taskData) => {
  const response = await apiClient.post("/api/medical-officer/tasks", taskData);
  return response.data;
};

// Get my tasks (assigned to me)
export const getMyTasks = async (params = {}) => {
  const response = await apiClient.get("/api/medical-officer/tasks/my-tasks", {
    params,
  });
  return response.data;
};

// Get tasks created by me
export const getTasksCreatedByMe = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/tasks/created-by-me",
    { params }
  );
  return response.data;
};

// Get tasks for a patient
export const getTasksByPatient = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/tasks/patient/${patientId}`,
    { params }
  );
  return response.data;
};

// Get overdue tasks
export const getOverdueTasks = async (params = {}) => {
  const response = await apiClient.get("/api/medical-officer/tasks/overdue", {
    params,
  });
  return response.data;
};

// Get task statistics
export const getTaskStatistics = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/tasks/statistics",
    { params }
  );
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId, statusData) => {
  const response = await apiClient.put(
    `/api/medical-officer/tasks/${taskId}/status`,
    statusData
  );
  return response.data;
};

// Update a task
export const updateTask = async (taskId, updateData) => {
  const response = await apiClient.put(
    `/api/medical-officer/tasks/${taskId}`,
    updateData
  );
  return response.data;
};

// Cancel a task
export const cancelTask = async (taskId, cancellationData) => {
  const response = await apiClient.put(
    `/api/medical-officer/tasks/${taskId}/cancel`,
    cancellationData
  );
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(
    `/api/medical-officer/tasks/${taskId}`
  );
  return response.data;
};
