import apiClient from "./apiClient";

// Get audit logs with filters
export const getAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.action) params.append("action", filters.action);
  if (filters.actionCategory) params.append("actionCategory", filters.actionCategory);
  if (filters.patientId) params.append("patientId", filters.patientId);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.severity) params.append("severity", filters.severity);
  if (filters.success !== undefined) params.append("success", filters.success);

  const response = await apiClient.get(`/audit/logs?${params.toString()}`);
  return response.data;
};

// Get audit log by ID
export const getAuditLogById = async (id) => {
  const response = await apiClient.get(`/audit/logs/${id}`);
  return response.data;
};

// Get audit history for a specific record
export const getAuditHistory = async (tableName, recordId) => {
  const response = await apiClient.get(`/audit/history/${tableName}/${recordId}`);
  return response.data;
};

// Get audit statistics
export const getAuditStatistics = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.patientId) params.append("patientId", filters.patientId);

  const response = await apiClient.get(`/audit/statistics?${params.toString()}`);
  return response.data;
};

// Get user activity timeline
export const getUserActivityTimeline = async (userId, page = 1, limit = 50) => {
  const response = await apiClient.get(`/audit/user/${userId}/timeline?page=${page}&limit=${limit}`);
  return response.data;
};

// Get patient activity timeline
export const getPatientActivityTimeline = async (patientId, page = 1, limit = 50) => {
  const response = await apiClient.get(`/audit/patient/${patientId}/timeline?page=${page}&limit=${limit}`);
  return response.data;
};

// Get critical events
export const getCriticalEvents = async (limit = 20, hours = 24) => {
  const response = await apiClient.get(`/audit/critical-events?limit=${limit}&hours=${hours}`);
  return response.data;
};

// Get failed actions
export const getFailedActions = async (page = 1, limit = 50, hours = 24) => {
  const response = await apiClient.get(`/audit/failed-actions?page=${page}&limit=${limit}&hours=${hours}`);
  return response.data;
};

// Export audit logs
export const exportAuditLogs = async (startDate, endDate, format = "json") => {
  const params = new URLSearchParams();
  
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("format", format);

  if (format === "csv") {
    const response = await apiClient.get(`/audit/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response.data;
  } else {
    const response = await apiClient.get(`/audit/export?${params.toString()}`);
    return response.data;
  }
};
