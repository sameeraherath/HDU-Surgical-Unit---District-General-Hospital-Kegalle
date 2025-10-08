import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as consultantApi from '../../api/consultantApi';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'consultant/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await consultantApi.getDashboardStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPatientsNeedingAttention = createAsyncThunk(
  'consultant/fetchPatientsNeedingAttention',
  async (_, { rejectWithValue }) => {
    try {
      return await consultantApi.getPatientsNeedingAttention();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'consultant/fetchRecentActivity',
  async (params, { rejectWithValue }) => {
    try {
      return await consultantApi.getRecentActivity(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWorkloadMetrics = createAsyncThunk(
  'consultant/fetchWorkloadMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await consultantApi.getWorkloadMetrics();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUpcomingDischarges = createAsyncThunk(
  'consultant/fetchUpcomingDischarges',
  async (params, { rejectWithValue }) => {
    try {
      return await consultantApi.getUpcomingDischarges(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const refreshAllData = createAsyncThunk(
  'consultant/refreshAllData',
  async (params, { rejectWithValue }) => {
    try {
      return await consultantApi.refreshAllData(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  dashboardStats: {
    todaysWardRounds: 0,
    patientsForDischarge: 0,
    pendingConsultations: 0,
    activeDischargePlans: 0,
    teachingSessionsThisMonth: 0,
    ongoingAudits: 0,
    criticalPatients: 0,
    pendingTasks: 0,
  },
  patientsNeedingAttention: [],
  recentActivity: {
    wardRounds: 0,
    teachingSessions: 0,
    consultationsCompleted: 0,
    patientsDischarged: 0,
  },
  workloadMetrics: {
    activePatients: 0,
    pendingTasks: 0,
    pendingConsultations: 0,
    pendingDischarges: 0,
    workloadScore: 0,
    workloadLevel: 'LOW',
  },
  upcomingDischarges: [],
  loading: false,
  error: null,
  lastRefreshed: null,
};

// Slice
const consultantSlice = createSlice({
  name: 'consultant',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.dashboardStats = initialState.dashboardStats;
      state.patientsNeedingAttention = [];
      state.recentActivity = initialState.recentActivity;
      state.workloadMetrics = initialState.workloadMetrics;
      state.upcomingDischarges = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.stats || action.payload;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch patients needing attention
      .addCase(fetchPatientsNeedingAttention.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsNeedingAttention.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsNeedingAttention = action.payload.patients || action.payload;
      })
      .addCase(fetchPatientsNeedingAttention.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload.activity || action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch workload metrics
      .addCase(fetchWorkloadMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkloadMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.workloadMetrics = action.payload.workload || action.payload;
      })
      .addCase(fetchWorkloadMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch upcoming discharges
      .addCase(fetchUpcomingDischarges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingDischarges.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingDischarges = action.payload.dischargePlans || action.payload;
      })
      .addCase(fetchUpcomingDischarges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh all data
      .addCase(refreshAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAllData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (data.dashboardStats) state.dashboardStats = data.dashboardStats;
        if (data.patientsNeedingAttention) state.patientsNeedingAttention = data.patientsNeedingAttention;
        if (data.recentActivity) state.recentActivity = data.recentActivity;
        if (data.workloadMetrics) state.workloadMetrics = data.workloadMetrics;
        if (data.upcomingDischarges) state.upcomingDischarges = data.upcomingDischarges;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(refreshAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardData, clearError } = consultantSlice.actions;

export default consultantSlice.reducer;
