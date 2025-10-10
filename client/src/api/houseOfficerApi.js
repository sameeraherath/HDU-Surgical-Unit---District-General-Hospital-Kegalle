import apiClient from "./apiClient";

const houseOfficerApi = {
  // Dashboard Overview
  getDashboardOverview: () => apiClient.get("/house-officer/dashboard"),

  // Task Management
  getAssignedTasks: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/house-officer/tasks?${queryParams.toString()}`);
  },

  updateTaskStatus: (taskId, data) => 
    apiClient.put(`/house-officer/tasks/${taskId}`, data),

  // Patient Management (Read-only)
  getPatientsList: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/house-officer/patients?${queryParams.toString()}`);
  },

  getPatientDetails: (patientId) => 
    apiClient.get(`/house-officer/patients/${patientId}`),

  // Statistics
  getTaskStatistics: (period = "week") => 
    apiClient.get(`/house-officer/statistics/tasks?period=${period}`),
};

export default houseOfficerApi;
