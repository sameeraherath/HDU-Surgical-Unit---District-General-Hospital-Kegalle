import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as medicalOfficerApi from "../../api/medicalOfficerApi";

// Async thunks
export const fetchDashboardOverview = createAsyncThunk(
  "medicalOfficer/fetchDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const data = await medicalOfficerApi.getDashboardOverview();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard overview"
      );
    }
  }
);

export const fetchWorkloadStatistics = createAsyncThunk(
  "medicalOfficer/fetchWorkloadStatistics",
  async (params, { rejectWithValue }) => {
    try {
      const data = await medicalOfficerApi.getWorkloadStatistics(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workload statistics"
      );
    }
  }
);

export const fetchPatientSummary = createAsyncThunk(
  "medicalOfficer/fetchPatientSummary",
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await medicalOfficerApi.getPatientSummary(patientId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient summary"
      );
    }
  }
);

export const fetchMyPatients = createAsyncThunk(
  "medicalOfficer/fetchMyPatients",
  async (params, { rejectWithValue }) => {
    try {
      const data = await medicalOfficerApi.getMyPatients(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients"
      );
    }
  }
);

const initialState = {
  dashboardOverview: {
    overview: {
      activePatientsCount: 0,
      todayTasks: 0,
      overdueTasks: 0,
      pendingInvestigations: 0,
      criticalInvestigations: 0,
      activePrescriptions: 0,
      todayNotes: 0,
    },
    patientsNeedingAttention: 0,
    recentPatients: [],
  },
  workloadStatistics: {
    period: "week",
    statistics: {
      progressNotes: 0,
      investigationsOrdered: 0,
      prescriptionsWritten: 0,
      tasksCompleted: 0,
      tasksAssigned: 0,
    },
  },
  currentPatientSummary: null,
  patients: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  loading: false,
  error: null,
};

const medicalOfficerSlice = createSlice({
  name: "medicalOfficer",
  initialState,
  reducers: {
    clearPatientSummary: (state) => {
      state.currentPatientSummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard overview
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardOverview = action.payload;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch workload statistics
      .addCase(fetchWorkloadStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkloadStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.workloadStatistics = action.payload;
      })
      .addCase(fetchWorkloadStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch patient summary
      .addCase(fetchPatientSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatientSummary = action.payload;
      })
      .addCase(fetchPatientSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my patients
      .addCase(fetchMyPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPatientSummary, clearError } = medicalOfficerSlice.actions;

export default medicalOfficerSlice.reducer;
