import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as auditApi from "../../api/auditApi";

// Thunks
export const fetchAuditLogs = createAsyncThunk(
  "audit/fetchAuditLogs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getAuditLogs(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAuditLogById = createAsyncThunk(
  "audit/fetchAuditLogById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await auditApi.getAuditLogById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAuditHistory = createAsyncThunk(
  "audit/fetchAuditHistory",
  async ({ tableName, recordId }, { rejectWithValue }) => {
    try {
      const data = await auditApi.getAuditHistory(tableName, recordId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAuditStatistics = createAsyncThunk(
  "audit/fetchAuditStatistics",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getAuditStatistics(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchUserActivityTimeline = createAsyncThunk(
  "audit/fetchUserActivityTimeline",
  async ({ userId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await auditApi.getUserActivityTimeline(userId, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientActivityTimeline = createAsyncThunk(
  "audit/fetchPatientActivityTimeline",
  async ({ patientId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await auditApi.getPatientActivityTimeline(patientId, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCriticalEvents = createAsyncThunk(
  "audit/fetchCriticalEvents",
  async ({ limit, hours }, { rejectWithValue }) => {
    try {
      const data = await auditApi.getCriticalEvents(limit, hours);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchFailedActions = createAsyncThunk(
  "audit/fetchFailedActions",
  async ({ page, limit, hours }, { rejectWithValue }) => {
    try {
      const data = await auditApi.getFailedActions(page, limit, hours);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const exportAuditLogs = createAsyncThunk(
  "audit/exportAuditLogs",
  async ({ startDate, endDate, format }, { rejectWithValue }) => {
    try {
      const data = await auditApi.exportAuditLogs(startDate, endDate, format);
      
      if (format === "csv") {
        // Create download link for CSV
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `audit-logs-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { message: "Export successful" };
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  auditLogs: [],
  selectedLog: null,
  auditHistory: [],
  statistics: null,
  userTimeline: [],
  patientTimeline: [],
  criticalEvents: [],
  failedActions: [],
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
  filters: {
    userId: null,
    action: null,
    actionCategory: null,
    patientId: null,
    startDate: null,
    endDate: null,
    severity: null,
    success: null,
  },
  loading: false,
  error: null,
};

// Slice
const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLog: (state) => {
      state.selectedLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.auditLogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch audit logs";
      })

      // Fetch audit log by ID
      .addCase(fetchAuditLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLog = action.payload.auditLog;
      })
      .addCase(fetchAuditLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch audit log";
      })

      // Fetch audit history
      .addCase(fetchAuditHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.auditHistory = action.payload.auditLogs;
      })
      .addCase(fetchAuditHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch audit history";
      })

      // Fetch audit statistics
      .addCase(fetchAuditStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAuditStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch statistics";
      })

      // Fetch user activity timeline
      .addCase(fetchUserActivityTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivityTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.userTimeline = action.payload.activities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserActivityTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user timeline";
      })

      // Fetch patient activity timeline
      .addCase(fetchPatientActivityTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientActivityTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.patientTimeline = action.payload.activities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPatientActivityTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch patient timeline";
      })

      // Fetch critical events
      .addCase(fetchCriticalEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriticalEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.criticalEvents = action.payload.criticalEvents;
      })
      .addCase(fetchCriticalEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch critical events";
      })

      // Fetch failed actions
      .addCase(fetchFailedActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFailedActions.fulfilled, (state, action) => {
        state.loading = false;
        state.failedActions = action.payload.failedActions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFailedActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch failed actions";
      })

      // Export audit logs
      .addCase(exportAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportAuditLogs.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to export audit logs";
      });
  },
});

export const { setFilters, resetFilters, clearError, clearSelectedLog } = auditSlice.actions;
export default auditSlice.reducer;
