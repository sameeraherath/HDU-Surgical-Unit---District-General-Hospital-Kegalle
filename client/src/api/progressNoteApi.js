import apiClient from "./apiClient";

// Create a new progress note
export const createProgressNote = async (noteData) => {
  const response = await apiClient.post(
    "/api/medical-officer/progress-notes",
    noteData
  );
  return response.data;
};

// Get progress notes for a patient
export const getProgressNotesByPatient = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/progress-notes/${patientId}`,
    { params }
  );
  return response.data;
};

// Get a single progress note by ID
export const getProgressNoteById = async (noteId) => {
  const response = await apiClient.get(
    `/api/medical-officer/progress-notes/detail/${noteId}`
  );
  return response.data;
};

// Update a progress note
export const updateProgressNote = async (noteId, updateData) => {
  const response = await apiClient.put(
    `/api/medical-officer/progress-notes/${noteId}`,
    updateData
  );
  return response.data;
};

// Review a progress note (Consultant only)
export const reviewProgressNote = async (noteId, reviewData) => {
  const response = await apiClient.put(
    `/api/medical-officer/progress-notes/${noteId}/review`,
    reviewData
  );
  return response.data;
};

// Delete a progress note
export const deleteProgressNote = async (noteId) => {
  const response = await apiClient.delete(
    `/api/medical-officer/progress-notes/${noteId}`
  );
  return response.data;
};

// Get progress note templates
export const getProgressNoteTemplates = async () => {
  const response = await apiClient.get(
    "/api/medical-officer/progress-notes/templates"
  );
  return response.data;
};

// Create a progress note template
export const createProgressNoteTemplate = async (templateData) => {
  const response = await apiClient.post(
    "/api/medical-officer/progress-notes/templates",
    templateData
  );
  return response.data;
};
