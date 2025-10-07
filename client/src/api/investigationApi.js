import apiClient from "./apiClient";

// Order a new investigation
export const orderInvestigation = async (investigationData) => {
  const response = await apiClient.post(
    "/api/medical-officer/investigations",
    investigationData
  );
  return response.data;
};

// Get investigations for a patient
export const getInvestigationsByPatient = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/investigations/${patientId}`,
    { params }
  );
  return response.data;
};

// Get pending investigations
export const getPendingInvestigations = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/investigations/pending",
    { params }
  );
  return response.data;
};

// Get critical investigations
export const getCriticalInvestigations = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/investigations/critical",
    { params }
  );
  return response.data;
};

// Update investigation status
export const updateInvestigationStatus = async (investigationId, statusData) => {
  const response = await apiClient.put(
    `/api/medical-officer/investigations/${investigationId}/status`,
    statusData
  );
  return response.data;
};

// Cancel an investigation
export const cancelInvestigation = async (investigationId, cancellationData) => {
  const response = await apiClient.put(
    `/api/medical-officer/investigations/${investigationId}/cancel`,
    cancellationData
  );
  return response.data;
};

// Add investigation result
export const addInvestigationResult = async (investigationId, resultData) => {
  const response = await apiClient.post(
    `/api/medical-officer/investigations/${investigationId}/results`,
    resultData
  );
  return response.data;
};

// Get investigation results
export const getInvestigationResults = async (investigationId) => {
  const response = await apiClient.get(
    `/api/medical-officer/investigations/${investigationId}/results`
  );
  return response.data;
};

// Review an investigation
export const reviewInvestigation = async (investigationId, reviewData) => {
  const response = await apiClient.put(
    `/api/medical-officer/investigations/${investigationId}/review`,
    reviewData
  );
  return response.data;
};
