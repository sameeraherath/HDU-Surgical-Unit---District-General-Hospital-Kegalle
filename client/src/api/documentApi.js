import apiClient from "./apiClient";

// Upload patient documents
export const uploadPatientDocuments = async (patientId, files) => {
  try {
    const formData = new FormData();

    // Group files by type and append to form data
    Object.entries(files).forEach(([type, fileList]) => {
      if (fileList && fileList.length > 0) {
        // If it's an array of files (for multiple file uploads like medicalReports)
        if (Array.isArray(fileList)) {
          fileList.forEach((file) => {
            formData.append(type, file);
          });
        } else {
          // Single file
          formData.append(type, fileList);
        }
      }
    });

    const response = await apiClient.post(
      `/documents/patients/${patientId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading documents:", error);
    throw error;
  }
};

// Get patient documents
export const getPatientDocuments = async (patientId) => {
  try {
    const response = await apiClient.get(
      `/documents/patients/${patientId}/documents`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    throw error;
  }
};
