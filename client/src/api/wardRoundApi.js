import apiClient from "./apiClient";

/**
 * Ward Round API Client
 * Handles all API calls related to consultant ward rounds
 */

// Create a new ward round
export const createWardRound = async (wardRoundData) => {
  const response = await apiClient.post(
    "/consultant/ward-rounds",
    wardRoundData
  );
  return response.data;
};

// Get all ward rounds with pagination and filters
export const getAllWardRounds = async (params = {}) => {
  const response = await apiClient.get("/consultant/ward-rounds", { params });
  return response.data;
};

// Get ward rounds for a specific patient
export const getWardRoundsByPatient = async (patientId) => {
  const response = await apiClient.get(
    `/consultant/ward-rounds/patient/${patientId}`
  );
  return response.data;
};

// Get today's ward rounds for the logged-in consultant
export const getTodaysWardRounds = async () => {
  const response = await apiClient.get("/consultant/ward-rounds/today");
  return response.data;
};

// Get a specific ward round by ID
export const getWardRoundById = async (id) => {
  const response = await apiClient.get(`/consultant/ward-rounds/${id}`);
  return response.data;
};

// Update a ward round
export const updateWardRound = async (id, wardRoundData) => {
  const response = await apiClient.put(
    `/consultant/ward-rounds/${id}`,
    wardRoundData
  );
  return response.data;
};

// Review a ward round (senior consultant)
export const reviewWardRound = async (id, reviewData) => {
  const response = await apiClient.post(
    `/consultant/ward-rounds/${id}/review`,
    reviewData
  );
  return response.data;
};

// Delete a ward round
export const deleteWardRound = async (id) => {
  const response = await apiClient.delete(`/consultant/ward-rounds/${id}`);
  return response.data;
};

// Get ward round statistics
export const getWardRoundStats = async () => {
  const response = await apiClient.get("/consultant/ward-rounds/stats");
  return response.data;
};

export default {
  createWardRound,
  getAllWardRounds,
  getWardRoundsByPatient,
  getTodaysWardRounds,
  getWardRoundById,
  updateWardRound,
  reviewWardRound,
  deleteWardRound,
  getWardRoundStats,
};
