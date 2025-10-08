import apiClient from "./apiClient";

/**
 * Consultation API Client
 * Handles all API calls related to inter-departmental consultations
 */

// Create a new consultation request
export const createConsultation = async (consultationData) => {
  const response = await apiClient.post(
    "/consultant/consultations",
    consultationData
  );
  return response.data;
};

// Get all consultations with pagination and filters
export const getAllConsultations = async (params = {}) => {
  const response = await apiClient.get("/consultant/consultations", { params });
  return response.data;
};

// Get pending consultations (awaiting assignment)
export const getPendingConsultations = async () => {
  const response = await apiClient.get("/consultant/consultations/pending");
  return response.data;
};

// Get consultations assigned to logged-in consultant
export const getMyConsultations = async (params = {}) => {
  const response = await apiClient.get(
    "/consultant/consultations/my-consultations",
    { params }
  );
  return response.data;
};

// Get consultations for a specific patient
export const getConsultationsByPatient = async (patientId) => {
  const response = await apiClient.get(
    `/consultant/consultations/patient/${patientId}`
  );
  return response.data;
};

// Get a specific consultation by ID
export const getConsultationById = async (id) => {
  const response = await apiClient.get(`/consultant/consultations/${id}`);
  return response.data;
};

// Assign a consultation to a consultant
export const assignConsultation = async (id, assignmentData) => {
  const response = await apiClient.post(
    `/consultant/consultations/${id}/assign`,
    assignmentData
  );
  return response.data;
};

// Update consultation status
export const updateConsultationStatus = async (id, statusData) => {
  const response = await apiClient.patch(
    `/consultant/consultations/${id}/status`,
    statusData
  );
  return response.data;
};

// Complete a consultation
export const completeConsultation = async (id, completionData) => {
  const response = await apiClient.post(
    `/consultant/consultations/${id}/complete`,
    completionData
  );
  return response.data;
};

// Cancel a consultation
export const cancelConsultation = async (id, cancelData) => {
  const response = await apiClient.post(
    `/consultant/consultations/${id}/cancel`,
    cancelData
  );
  return response.data;
};

// Get consultation statistics
export const getConsultationStats = async () => {
  const response = await apiClient.get("/consultant/consultations/stats");
  return response.data;
};

export default {
  createConsultation,
  getAllConsultations,
  getPendingConsultations,
  getMyConsultations,
  getConsultationsByPatient,
  getConsultationById,
  assignConsultation,
  updateConsultationStatus,
  completeConsultation,
  cancelConsultation,
  getConsultationStats,
};
