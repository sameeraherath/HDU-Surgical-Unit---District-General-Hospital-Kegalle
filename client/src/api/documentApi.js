import apiClient from "./apiClient";

export const uploadPatientDocuments = async (patientId, files) => {
  try {
    const formData = new FormData();

    Object.entries(files).forEach(([type, fileList]) => {
      if (fileList && fileList.length > 0) {
        if (Array.isArray(fileList)) {
          fileList.forEach((file) => {
            formData.append(type, file);
          });
        } else {
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
