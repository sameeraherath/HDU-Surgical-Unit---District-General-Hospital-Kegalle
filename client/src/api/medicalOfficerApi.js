import apiClient from "./apiClient";

// Get dashboard overview
export const getDashboardOverview = async () => {
  const response = await apiClient.get("/medical-officer/dashboard");
  return response.data.data;
};

// Get workload statistics
export const getWorkloadStatistics = async (params = {}) => {
  const response = await apiClient.get(
    "/medical-officer/statistics/workload",
    { params }
  );
  return response.data.data;
};

// Get patient summary
export const getPatientSummary = async (patientId) => {
  const response = await apiClient.get(
    `/medical-officer/patients/${patientId}/summary`
  );
  return response.data.data;
};

// Get patients list
export const getMyPatients = async (params = {}) => {
  const response = await apiClient.get("/medical-officer/patients", {
    params,
  });
  return response.data.data;
};
