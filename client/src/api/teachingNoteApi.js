import apiClient from "./apiClient";

/**
 * Teaching Note API Client
 * Handles all API calls related to academic teaching sessions
 */

// Create a new teaching note
export const createTeachingNote = async (teachingNoteData) => {
  const response = await apiClient.post(
    "/consultant/teaching-notes",
    teachingNoteData
  );
  return response.data;
};

// Get all teaching notes with pagination and filters
export const getAllTeachingNotes = async (params = {}) => {
  const response = await apiClient.get("/consultant/teaching-notes", {
    params,
  });
  return response.data;
};

// Get teaching notes by consultant
export const getTeachingNotesByConsultant = async (
  consultantId,
  params = {}
) => {
  const response = await apiClient.get(
    `/consultant/teaching-notes/consultant/${consultantId}`,
    { params }
  );
  return response.data;
};

// Get teaching notes by patient (case-based teaching)
export const getTeachingNotesByPatient = async (patientId) => {
  const response = await apiClient.get(
    `/consultant/teaching-notes/patient/${patientId}`
  );
  return response.data;
};

// Get a specific teaching note by ID
export const getTeachingNoteById = async (id) => {
  const response = await apiClient.get(`/consultant/teaching-notes/${id}`);
  return response.data;
};

// Update a teaching note
export const updateTeachingNote = async (id, teachingNoteData) => {
  const response = await apiClient.put(
    `/consultant/teaching-notes/${id}`,
    teachingNoteData
  );
  return response.data;
};

// Delete a teaching note
export const deleteTeachingNote = async (id) => {
  const response = await apiClient.delete(`/consultant/teaching-notes/${id}`);
  return response.data;
};

// Search teaching notes
export const searchTeachingNotes = async (searchQuery) => {
  const response = await apiClient.get("/consultant/teaching-notes/search", {
    params: { q: searchQuery },
  });
  return response.data;
};

// Get teaching note statistics
export const getTeachingStats = async () => {
  const response = await apiClient.get("/consultant/teaching-notes/stats");
  return response.data;
};

export default {
  createTeachingNote,
  getAllTeachingNotes,
  getTeachingNotesByConsultant,
  getTeachingNotesByPatient,
  getTeachingNoteById,
  updateTeachingNote,
  deleteTeachingNote,
  searchTeachingNotes,
  getTeachingStats,
};
