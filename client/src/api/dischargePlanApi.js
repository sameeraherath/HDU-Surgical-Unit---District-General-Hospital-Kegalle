import apiClient from "./apiClient";

/**
 * Discharge Plan API Client
 * Handles all API calls related to discharge planning and workflow
 */

// Create a new discharge plan
export const createDischargePlan = async (dischargePlanData) => {
  const response = await apiClient.post(
    "/consultant/discharge-plans",
    dischargePlanData
  );
  return response.data;
};

// Get all discharge plans with pagination and filters
export const getAllDischargePlans = async (params = {}) => {
  const response = await apiClient.get("/consultant/discharge-plans", {
    params,
  });
  return response.data;
};

// Get discharge plan for a specific patient (most recent)
export const getDischargePlanByPatient = async (patientId) => {
  const response = await apiClient.get(
    `/consultant/discharge-plans/patient/${patientId}`
  );
  return response.data;
};

// Get all pending discharge plans (awaiting approval)
export const getPendingDischargePlans = async () => {
  const response = await apiClient.get("/consultant/discharge-plans/pending");
  return response.data;
};

// Get a specific discharge plan by ID
export const getDischargePlanById = async (id) => {
  const response = await apiClient.get(`/consultant/discharge-plans/${id}`);
  return response.data;
};

// Update a discharge plan
export const updateDischargePlan = async (id, dischargePlanData) => {
  const response = await apiClient.put(
    `/consultant/discharge-plans/${id}`,
    dischargePlanData
  );
  return response.data;
};

// Submit discharge plan for approval
export const submitForApproval = async (id) => {
  const response = await apiClient.post(
    `/consultant/discharge-plans/${id}/submit`
  );
  return response.data;
};

// Approve a discharge plan
export const approveDischargePlan = async (id, approvalData) => {
  const response = await apiClient.post(
    `/consultant/discharge-plans/${id}/approve`,
    approvalData
  );
  return response.data;
};

// Complete a discharge plan (mark patient as discharged)
export const completeDischargePlan = async (id, completionData) => {
  const response = await apiClient.post(
    `/consultant/discharge-plans/${id}/complete`,
    completionData
  );
  return response.data;
};

// Cancel a discharge plan
export const cancelDischargePlan = async (id, cancelData) => {
  const response = await apiClient.post(
    `/consultant/discharge-plans/${id}/cancel`,
    cancelData
  );
  return response.data;
};

// Update discharge checklist
export const updateDischargeChecklist = async (id, checklistData) => {
  const response = await apiClient.patch(
    `/consultant/discharge-plans/${id}/checklist`,
    checklistData
  );
  return response.data;
};

// Get discharge plan statistics
export const getDischargeStats = async () => {
  const response = await apiClient.get("/consultant/discharge-plans/stats");
  return response.data;
};

export default {
  createDischargePlan,
  getAllDischargePlans,
  getDischargePlanByPatient,
  getPendingDischargePlans,
  getDischargePlanById,
  updateDischargePlan,
  submitForApproval,
  approveDischargePlan,
  completeDischargePlan,
  cancelDischargePlan,
  updateDischargeChecklist,
  getDischargeStats,
};
