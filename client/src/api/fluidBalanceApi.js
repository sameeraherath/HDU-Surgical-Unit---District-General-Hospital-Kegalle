import apiClient from "./apiClient";

// Record fluid balance entry
export const recordFluidBalance = async (fluidData) => {
  const response = await apiClient.post(
    "/api/medical-officer/fluid-balance",
    fluidData
  );
  return response.data;
};

// Get fluid balance records for a patient
export const getFluidBalanceByPatient = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/fluid-balance/${patientId}`,
    { params }
  );
  return response.data;
};

// Get fluid balance summary
export const getFluidBalanceSummary = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/fluid-balance/${patientId}/summary`,
    { params }
  );
  return response.data;
};

// Get fluid balance chart data
export const getFluidBalanceChartData = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/fluid-balance/${patientId}/chart`,
    { params }
  );
  return response.data;
};

// Update fluid balance record
export const updateFluidBalance = async (recordId, updateData) => {
  const response = await apiClient.put(
    `/api/medical-officer/fluid-balance/${recordId}`,
    updateData
  );
  return response.data;
};

// Verify fluid balance record
export const verifyFluidBalance = async (recordId) => {
  const response = await apiClient.put(
    `/api/medical-officer/fluid-balance/${recordId}/verify`
  );
  return response.data;
};

// Delete fluid balance record
export const deleteFluidBalance = async (recordId) => {
  const response = await apiClient.delete(
    `/api/medical-officer/fluid-balance/${recordId}`
  );
  return response.data;
};
