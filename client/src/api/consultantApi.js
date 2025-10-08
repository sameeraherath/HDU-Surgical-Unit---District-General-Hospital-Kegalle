import apiClient from "./apiClient";

/**
 * Consultant Dashboard API Client
 * Handles all API calls related to consultant dashboard statistics and metrics
 */

// Get dashboard overview statistics
export const getDashboardStats = async () => {
  const response = await apiClient.get("/consultant/stats/overview");
  return response.data;
};

// Get patients needing immediate attention
export const getPatientsNeedingAttention = async () => {
  const response = await apiClient.get(
    "/consultant/stats/patients-needing-attention"
  );
  return response.data;
};

// Get recent activity summary
export const getRecentActivity = async (params = {}) => {
  const response = await apiClient.get("/consultant/stats/recent-activity", {
    params,
  });
  return response.data;
};

// Get workload metrics
export const getWorkloadMetrics = async () => {
  const response = await apiClient.get("/consultant/stats/workload");
  return response.data;
};

// Get upcoming discharges
export const getUpcomingDischarges = async (params = {}) => {
  const response = await apiClient.get(
    "/consultant/stats/upcoming-discharges",
    { params }
  );
  return response.data;
};

// Refresh all dashboard data
export const refreshAllData = async (params = {}) => {
  const response = await apiClient.get("/consultant/stats/refresh", { params });
  return response.data;
};

export default {
  getDashboardStats,
  getPatientsNeedingAttention,
  getRecentActivity,
  getWorkloadMetrics,
  getUpcomingDischarges,
  refreshAllData,
};
