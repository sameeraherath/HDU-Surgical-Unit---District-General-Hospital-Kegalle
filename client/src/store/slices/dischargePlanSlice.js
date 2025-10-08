import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dischargePlanApi from "../../api/dischargePlanApi";

// Async thunks
export const fetchAllDischargePlans = createAsyncThunk(
  "dischargePlans/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.getAllDischargePlans(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDischargePlanByPatient = createAsyncThunk(
  "dischargePlans/fetchByPatient",
  async (patientId, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.getDischargePlanByPatient(patientId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPendingDischargePlans = createAsyncThunk(
  "dischargePlans/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.getPendingDischargePlans();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDischargePlanById = createAsyncThunk(
  "dischargePlans/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.getDischargePlanById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDischargePlan = createAsyncThunk(
  "dischargePlans/create",
  async (dischargePlanData, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.createDischargePlan(dischargePlanData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDischargePlan = createAsyncThunk(
  "dischargePlans/update",
  async ({ id, dischargePlanData }, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.updateDischargePlan(id, dischargePlanData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitForApproval = createAsyncThunk(
  "dischargePlans/submitForApproval",
  async (id, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.submitForApproval(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveDischargePlan = createAsyncThunk(
  "dischargePlans/approve",
  async ({ id, approvalData }, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.approveDischargePlan(id, approvalData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeDischargePlan = createAsyncThunk(
  "dischargePlans/complete",
  async ({ id, completionData }, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.completeDischargePlan(id, completionData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelDischargePlan = createAsyncThunk(
  "dischargePlans/cancel",
  async ({ id, cancelData }, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.cancelDischargePlan(id, cancelData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDischargeChecklist = createAsyncThunk(
  "dischargePlans/updateChecklist",
  async ({ id, checklistData }, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.updateDischargeChecklist(id, checklistData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDischargeStats = createAsyncThunk(
  "dischargePlans/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await dischargePlanApi.getDischargeStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  dischargePlans: [],
  currentDischargePlan: null,
  pendingDischargePlans: [],
  patientDischargePlan: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: null,
    consultantId: null,
  },
};

// Slice
const dischargePlanSlice = createSlice({
  name: "dischargePlans",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentDischargePlan: (state, action) => {
      state.currentDischargePlan = action.payload;
    },
    clearCurrentDischargePlan: (state) => {
      state.currentDischargePlan = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all discharge plans
      .addCase(fetchAllDischargePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDischargePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargePlans = action.payload.dischargePlans || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllDischargePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch pending discharge plans
      .addCase(fetchPendingDischargePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingDischargePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingDischargePlans =
          action.payload.dischargePlans || action.payload;
      })
      .addCase(fetchPendingDischargePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch discharge plan by patient
      .addCase(fetchDischargePlanByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischargePlanByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDischargePlan =
          action.payload.dischargePlan || action.payload;
      })
      .addCase(fetchDischargePlanByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch discharge plan by ID
      .addCase(fetchDischargePlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischargePlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDischargePlan =
          action.payload.dischargePlan || action.payload;
      })
      .addCase(fetchDischargePlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create discharge plan
      .addCase(createDischargePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDischargePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargePlans.unshift(
          action.payload.dischargePlan || action.payload
        );
      })
      .addCase(createDischargePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update discharge plan
      .addCase(updateDischargePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDischargePlan.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === updatedPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = updatedPlan;
        }
        if (state.currentDischargePlan?.id === updatedPlan.id) {
          state.currentDischargePlan = updatedPlan;
        }
      })
      .addCase(updateDischargePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit for approval
      .addCase(submitForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForApproval.fulfilled, (state, action) => {
        state.loading = false;
        const submittedPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === submittedPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = submittedPlan;
        }
        if (state.currentDischargePlan?.id === submittedPlan.id) {
          state.currentDischargePlan = submittedPlan;
        }
      })
      .addCase(submitForApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve discharge plan
      .addCase(approveDischargePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveDischargePlan.fulfilled, (state, action) => {
        state.loading = false;
        const approvedPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === approvedPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = approvedPlan;
        }
        state.pendingDischargePlans = state.pendingDischargePlans.filter(
          (dp) => dp.id !== approvedPlan.id
        );
        if (state.currentDischargePlan?.id === approvedPlan.id) {
          state.currentDischargePlan = approvedPlan;
        }
      })
      .addCase(approveDischargePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete discharge plan
      .addCase(completeDischargePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeDischargePlan.fulfilled, (state, action) => {
        state.loading = false;
        const completedPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === completedPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = completedPlan;
        }
        if (state.currentDischargePlan?.id === completedPlan.id) {
          state.currentDischargePlan = completedPlan;
        }
      })
      .addCase(completeDischargePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel discharge plan
      .addCase(cancelDischargePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelDischargePlan.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === cancelledPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = cancelledPlan;
        }
        if (state.currentDischargePlan?.id === cancelledPlan.id) {
          state.currentDischargePlan = cancelledPlan;
        }
      })
      .addCase(cancelDischargePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update checklist
      .addCase(updateDischargeChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDischargeChecklist.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlan = action.payload.dischargePlan || action.payload;
        const index = state.dischargePlans.findIndex(
          (dp) => dp.id === updatedPlan.id
        );
        if (index !== -1) {
          state.dischargePlans[index] = updatedPlan;
        }
        if (state.currentDischargePlan?.id === updatedPlan.id) {
          state.currentDischargePlan = updatedPlan;
        }
      })
      .addCase(updateDischargeChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchDischargeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischargeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchDischargeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentDischargePlan,
  clearCurrentDischargePlan,
  clearError,
} = dischargePlanSlice.actions;

export default dischargePlanSlice.reducer;
