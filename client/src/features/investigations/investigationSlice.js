import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as investigationApi from "../../api/investigationApi";

// Async thunks
export const orderInvestigation = createAsyncThunk(
  "investigations/order",
  async (investigationData, { rejectWithValue }) => {
    try {
      const data = await investigationApi.orderInvestigation(investigationData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to order investigation"
      );
    }
  }
);

export const fetchInvestigationsByPatient = createAsyncThunk(
  "investigations/fetchByPatient",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await investigationApi.getInvestigationsByPatient(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch investigations"
      );
    }
  }
);

export const fetchPendingInvestigations = createAsyncThunk(
  "investigations/fetchPending",
  async (params, { rejectWithValue }) => {
    try {
      const data = await investigationApi.getPendingInvestigations(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending investigations"
      );
    }
  }
);

export const fetchCriticalInvestigations = createAsyncThunk(
  "investigations/fetchCritical",
  async (params, { rejectWithValue }) => {
    try {
      const data = await investigationApi.getCriticalInvestigations(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch critical investigations"
      );
    }
  }
);

export const updateInvestigationStatus = createAsyncThunk(
  "investigations/updateStatus",
  async ({ investigationId, statusData }, { rejectWithValue }) => {
    try {
      const data = await investigationApi.updateInvestigationStatus(
        investigationId,
        statusData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const cancelInvestigation = createAsyncThunk(
  "investigations/cancel",
  async ({ investigationId, cancellationData }, { rejectWithValue }) => {
    try {
      const data = await investigationApi.cancelInvestigation(
        investigationId,
        cancellationData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel investigation"
      );
    }
  }
);

export const addInvestigationResult = createAsyncThunk(
  "investigations/addResult",
  async ({ investigationId, resultData }, { rejectWithValue }) => {
    try {
      const data = await investigationApi.addInvestigationResult(
        investigationId,
        resultData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add result"
      );
    }
  }
);

export const fetchInvestigationResults = createAsyncThunk(
  "investigations/fetchResults",
  async (investigationId, { rejectWithValue }) => {
    try {
      const data = await investigationApi.getInvestigationResults(
        investigationId
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch results"
      );
    }
  }
);

export const reviewInvestigation = createAsyncThunk(
  "investigations/review",
  async ({ investigationId, reviewData }, { rejectWithValue }) => {
    try {
      const data = await investigationApi.reviewInvestigation(
        investigationId,
        reviewData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review investigation"
      );
    }
  }
);

const initialState = {
  investigations: [],
  pendingInvestigations: [],
  criticalInvestigations: [],
  currentInvestigation: null,
  currentResults: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {
    investigationType: "",
    status: "",
    urgency: "",
  },
  loading: false,
  error: null,
};

const investigationSlice = createSlice({
  name: "investigations",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentInvestigation: (state) => {
      state.currentInvestigation = null;
      state.currentResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Order investigation
      .addCase(orderInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations.unshift(action.payload.investigation);
      })
      .addCase(orderInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch investigations by patient
      .addCase(fetchInvestigationsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestigationsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = action.payload.investigations;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInvestigationsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pending investigations
      .addCase(fetchPendingInvestigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingInvestigations = action.payload.investigations;
      })
      .addCase(fetchPendingInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch critical investigations
      .addCase(fetchCriticalInvestigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriticalInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.criticalInvestigations = action.payload.investigations;
      })
      .addCase(fetchCriticalInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateInvestigationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestigationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(
          (inv) => inv.id === action.payload.investigation.id
        );
        if (index !== -1) {
          state.investigations[index] = action.payload.investigation;
        }
      })
      .addCase(updateInvestigationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel investigation
      .addCase(cancelInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(
          (inv) => inv.id === action.payload.investigation.id
        );
        if (index !== -1) {
          state.investigations[index] = action.payload.investigation;
        }
      })
      .addCase(cancelInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add result
      .addCase(addInvestigationResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInvestigationResult.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResults.push(action.payload.result);
      })
      .addCase(addInvestigationResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch results
      .addCase(fetchInvestigationResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestigationResults.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResults = action.payload.results;
      })
      .addCase(fetchInvestigationResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Review investigation
      .addCase(reviewInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(
          (inv) => inv.id === action.payload.investigation.id
        );
        if (index !== -1) {
          state.investigations[index] = action.payload.investigation;
        }
      })
      .addCase(reviewInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentInvestigation,
  clearError,
} = investigationSlice.actions;

export default investigationSlice.reducer;
