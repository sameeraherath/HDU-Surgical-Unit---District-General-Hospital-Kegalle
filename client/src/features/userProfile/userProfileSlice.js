import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserPreferences,
  updateUserPreferences,
  changePassword,
} from "../../api/userProfileApi";

const initialState = {
  profile: null,
  preferences: null,
  loading: false,
  error: null,
  uploadingPicture: false,
  updatingProfile: false,
  updatingPreferences: false,
  changingPassword: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserProfile();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await updateUserProfile(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const uploadPicture = createAsyncThunk(
  "userProfile/uploadPicture",
  async (file, { rejectWithValue }) => {
    try {
      const data = await uploadProfilePicture(file);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload picture"
      );
    }
  }
);

export const deletePicture = createAsyncThunk(
  "userProfile/deletePicture",
  async (_, { rejectWithValue }) => {
    try {
      const data = await deleteProfilePicture();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete picture"
      );
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  "userProfile/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserPreferences();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch preferences"
      );
    }
  }
);

export const updatePreferences = createAsyncThunk(
  "userProfile/updatePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const data = await updateUserPreferences(preferences);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update preferences"
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "userProfile/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await changePassword(passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.preferences = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.updatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.profile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.error = action.payload;
      })
      // Upload picture
      .addCase(uploadPicture.pending, (state) => {
        state.uploadingPicture = true;
        state.error = null;
      })
      .addCase(uploadPicture.fulfilled, (state, action) => {
        state.uploadingPicture = false;
        if (state.profile && state.profile.profile) {
          state.profile.profile.profilePictureUrl =
            action.payload.profilePictureUrl;
        }
      })
      .addCase(uploadPicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.error = action.payload;
      })
      // Delete picture
      .addCase(deletePicture.pending, (state) => {
        state.uploadingPicture = true;
        state.error = null;
      })
      .addCase(deletePicture.fulfilled, (state) => {
        state.uploadingPicture = false;
        if (state.profile && state.profile.profile) {
          state.profile.profile.profilePictureUrl = null;
        }
      })
      .addCase(deletePicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.error = action.payload;
      })
      // Fetch preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.updatingPreferences = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.updatingPreferences = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.updatingPreferences = false;
        state.error = action.payload;
      })
      // Change password
      .addCase(updatePassword.pending, (state) => {
        state.changingPassword = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.changingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, resetProfileState } =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
