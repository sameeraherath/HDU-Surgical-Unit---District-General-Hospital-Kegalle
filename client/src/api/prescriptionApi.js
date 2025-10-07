import apiClient from "./apiClient";

// Create a new prescription
export const createPrescription = async (prescriptionData) => {
  const response = await apiClient.post(
    "/api/medical-officer/prescriptions",
    prescriptionData
  );
  return response.data;
};

// Get prescriptions for a patient
export const getPrescriptionsByPatient = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/prescriptions/${patientId}`,
    { params }
  );
  return response.data;
};

// Get all active prescriptions
export const getActivePrescriptions = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/prescriptions/active",
    { params }
  );
  return response.data;
};

// Get controlled prescriptions
export const getControlledPrescriptions = async (params = {}) => {
  const response = await apiClient.get(
    "/api/medical-officer/prescriptions/controlled",
    { params }
  );
  return response.data;
};

// Get medication schedule for a patient
export const getMedicationSchedule = async (patientId, params = {}) => {
  const response = await apiClient.get(
    `/api/medical-officer/prescriptions/schedule/${patientId}`,
    { params }
  );
  return response.data;
};

// Update a prescription
export const updatePrescription = async (prescriptionId, updateData) => {
  const response = await apiClient.put(
    `/api/medical-officer/prescriptions/${prescriptionId}`,
    updateData
  );
  return response.data;
};

// Discontinue a prescription
export const discontinuePrescription = async (
  prescriptionId,
  discontinuationData
) => {
  const response = await apiClient.put(
    `/api/medical-officer/prescriptions/${prescriptionId}/discontinue`,
    discontinuationData
  );
  return response.data;
};

// Verify a prescription (Pharmacist only)
export const verifyPrescription = async (prescriptionId, verificationData) => {
  const response = await apiClient.put(
    `/api/medical-officer/prescriptions/${prescriptionId}/verify`,
    verificationData
  );
  return response.data;
};

// Dispense a prescription (Pharmacist only)
export const dispensePrescription = async (prescriptionId, dispensingData) => {
  const response = await apiClient.put(
    `/api/medical-officer/prescriptions/${prescriptionId}/dispense`,
    dispensingData
  );
  return response.data;
};
