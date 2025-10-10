import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import houseOfficerApi from "../../api/houseOfficerApi";

// Async thunks for House Officer functionality
export const fetchDashboardOverview = createAsyncThunk(
  "houseOfficer/fetchDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.getDashboardOverview();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard overview"
      );
    }
  }
);

export const fetchAssignedTasks = createAsyncThunk(
  "houseOfficer/fetchAssignedTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.getAssignedTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned tasks"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "houseOfficer/updateTaskStatus",
  async ({ taskId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.updateTaskStatus(taskId, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

export const fetchPatientDetails = createAsyncThunk(
  "houseOfficer/fetchPatientDetails",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.getPatientDetails(patientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient details"
      );
    }
  }
);

export const fetchPatientsList = createAsyncThunk(
  "houseOfficer/fetchPatientsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.getPatientsList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients list"
      );
    }
  }
);

export const fetchTaskStatistics = createAsyncThunk(
  "houseOfficer/fetchTaskStatistics",
  async (period = "week", { rejectWithValue }) => {
    try {
      const response = await houseOfficerApi.getTaskStatistics(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task statistics"
      );
    }
  }
);

export const refreshAllData = createAsyncThunk(
  "houseOfficer/refreshAllData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all([
        dispatch(fetchDashboardOverview()),
        dispatch(fetchAssignedTasks()),
        dispatch(fetchTaskStatistics()),
      ]);
      return { lastRefreshed: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh data"
      );
    }
  }
);

const initialState = {
  // Dashboard data
  dashboardOverview: null,
  assignedTasks: [],
  patientsList: [],
  taskStatistics: null,
  
  // UI state
  loading: false,
  error: null,
  lastRefreshed: null,
  
  // Pagination
  tasksPagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  patientsPagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  
  // Current patient details
  currentPatient: null,
};

const houseOfficerSlice = createSlice({
  name: "houseOfficer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    setTasksPagination: (state, action) => {
      state.tasksPagination = { ...state.tasksPagination, ...action.payload };
    },
    setPatientsPagination: (state, action) => {
      state.patientsPagination = { ...state.patientsPagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Overview
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardOverview = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assigned Tasks
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedTasks = action.payload.tasks;
        state.tasksPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the task in the assigned tasks list
        const updatedTask = action.payload;
        const index = state.assignedTasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.assignedTasks[index] = updatedTask;
        }
        state.error = null;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Patient Details
      .addCase(fetchPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Patients List
      .addCase(fetchPatientsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsList.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsList = action.payload.patients;
        state.patientsPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPatientsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Task Statistics
      .addCase(fetchTaskStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.taskStatistics = action.payload;
        state.error = null;
      })
      .addCase(fetchTaskStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Refresh All Data
      .addCase(refreshAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastRefreshed = action.payload.lastRefreshed;
        state.error = null;
      })
      .addCase(refreshAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentPatient,
  setTasksPagination,
  setPatientsPagination,
} = houseOfficerSlice.actions;

export default houseOfficerSlice.reducer;
