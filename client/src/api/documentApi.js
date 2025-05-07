import apiClient from "./apiClient";

export const uploadPatientDocuments = async (patientId, files) => {
  try {
    const formData = new FormData();

    if (!files || Object.keys(files).length === 0) {
      throw new Error("No files provided for upload");
    }

    Object.entries(files).forEach(([type, fileList]) => {
      if (fileList) {
        if (Array.isArray(fileList) && fileList.length > 0) {
          fileList.forEach((file) => {
            if (file instanceof File) {
              formData.append(type, file);
            }
          });
        } else if (fileList instanceof File) {
          formData.append(type, fileList);
        } else if (fileList.name) {
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
    if (error.response) {
      throw new Error(
        error.response.data.message || "Server error during document upload"
      );
    }
    throw new Error(error.message || "Failed to upload documents");
  }
};

export const getPatientDocuments = async (patientId) => {
  try {
    const response = await apiClient.get(
      `/documents/patients/${patientId}/documents`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch documents"
      );
    }
    throw new Error(error.message || "Failed to fetch documents");
  }
};
