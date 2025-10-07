import apiClient from "./apiClient";

// Get user profile
export const getUserProfile = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put("/users/profile", profileData);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await apiClient.post("/users/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  const response = await apiClient.delete("/users/profile/picture");
  return response.data;
};

// Get user preferences
export const getUserPreferences = async () => {
  const response = await apiClient.get("/users/preferences");
  return response.data;
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  const response = await apiClient.put("/users/preferences", preferences);
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await apiClient.put("/users/password", passwordData);
  return response.data;
};
