import apiClient from './apiClient';

/**
 * Clinical Audit API Client
 * Handles all API calls related to clinical audits and quality assurance
 */

// Create a new clinical audit
export const createClinicalAudit = async (auditData) => {
  const response = await apiClient.post('/consultant/clinical-audits', auditData);
  return response.data;
};

// Get all clinical audits with pagination and filters
export const getAllClinicalAudits = async (params = {}) => {
  const response = await apiClient.get('/consultant/clinical-audits', { params });
  return response.data;
};

// Get clinical audits by consultant
export const getClinicalAuditsByConsultant = async (consultantId, params = {}) => {
  const response = await apiClient.get(`/consultant/clinical-audits/consultant/${consultantId}`, { params });
  return response.data;
};

// Get a specific clinical audit by ID
export const getClinicalAuditById = async (id) => {
  const response = await apiClient.get(`/consultant/clinical-audits/${id}`);
  return response.data;
};

// Update a clinical audit
export const updateClinicalAudit = async (id, auditData) => {
  const response = await apiClient.put(`/consultant/clinical-audits/${id}`, auditData);
  return response.data;
};

// Update audit status
export const updateAuditStatus = async (id, statusData) => {
  const response = await apiClient.patch(`/consultant/clinical-audits/${id}/status`, statusData);
  return response.data;
};

// Record audit presentation
export const recordPresentation = async (id, presentationData) => {
  const response = await apiClient.post(`/consultant/clinical-audits/${id}/presentation`, presentationData);
  return response.data;
};

// Delete a clinical audit
export const deleteClinicalAudit = async (id) => {
  const response = await apiClient.delete(`/consultant/clinical-audits/${id}`);
  return response.data;
};

// Get clinical audit statistics
export const getAuditStats = async () => {
  const response = await apiClient.get('/consultant/clinical-audits/stats');
  return response.data;
};

export default {
  createClinicalAudit,
  getAllClinicalAudits,
  getClinicalAuditsByConsultant,
  getClinicalAuditById,
  updateClinicalAudit,
  updateAuditStatus,
  recordPresentation,
  deleteClinicalAudit,
  getAuditStats,
};
