import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as clinicalAuditApi from "../../api/clinicalAuditApi";

// Async thunks
export const fetchAllClinicalAudits = createAsyncThunk(
  "clinicalAudits/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.getAllClinicalAudits(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchClinicalAuditsByConsultant = createAsyncThunk(
  "clinicalAudits/fetchByConsultant",
  async ({ consultantId, params }, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.getClinicalAuditsByConsultant(
        consultantId,
        params
      );
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchClinicalAuditById = createAsyncThunk(
  "clinicalAudits/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.getClinicalAuditById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createClinicalAudit = createAsyncThunk(
  "clinicalAudits/create",
  async (auditData, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.createClinicalAudit(auditData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateClinicalAudit = createAsyncThunk(
  "clinicalAudits/update",
  async ({ id, auditData }, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.updateClinicalAudit(id, auditData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAuditStatus = createAsyncThunk(
  "clinicalAudits/updateStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.updateAuditStatus(id, statusData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const recordPresentation = createAsyncThunk(
  "clinicalAudits/recordPresentation",
  async ({ id, presentationData }, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.recordPresentation(id, presentationData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteClinicalAudit = createAsyncThunk(
  "clinicalAudits/delete",
  async (id, { rejectWithValue }) => {
    try {
      await clinicalAuditApi.deleteClinicalAudit(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAuditStats = createAsyncThunk(
  "clinicalAudits/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalAuditApi.getAuditStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  audits: [],
  currentAudit: null,
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
    auditType: null,
    status: null,
    consultantId: null,
  },
};

// Slice
const clinicalAuditSlice = createSlice({
  name: "clinicalAudits",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentAudit: (state, action) => {
      state.currentAudit = action.payload;
    },
    clearCurrentAudit: (state) => {
      state.currentAudit = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clinical audits
      .addCase(fetchAllClinicalAudits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClinicalAudits.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = action.payload.audits || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllClinicalAudits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch clinical audits by consultant
      .addCase(fetchClinicalAuditsByConsultant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicalAuditsByConsultant.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = action.payload.audits || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchClinicalAuditsByConsultant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch clinical audit by ID
      .addCase(fetchClinicalAuditById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicalAuditById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAudit = action.payload.audit || action.payload;
      })
      .addCase(fetchClinicalAuditById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create clinical audit
      .addCase(createClinicalAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClinicalAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.audits.unshift(action.payload.audit || action.payload);
      })
      .addCase(createClinicalAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update clinical audit
      .addCase(updateClinicalAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClinicalAudit.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAudit = action.payload.audit || action.payload;
        const index = state.audits.findIndex((a) => a.id === updatedAudit.id);
        if (index !== -1) {
          state.audits[index] = updatedAudit;
        }
        if (state.currentAudit?.id === updatedAudit.id) {
          state.currentAudit = updatedAudit;
        }
      })
      .addCase(updateClinicalAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update audit status
      .addCase(updateAuditStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuditStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAudit = action.payload.audit || action.payload;
        const index = state.audits.findIndex((a) => a.id === updatedAudit.id);
        if (index !== -1) {
          state.audits[index] = updatedAudit;
        }
        if (state.currentAudit?.id === updatedAudit.id) {
          state.currentAudit = updatedAudit;
        }
      })
      .addCase(updateAuditStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Record presentation
      .addCase(recordPresentation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordPresentation.fulfilled, (state, action) => {
        state.loading = false;
        const presentedAudit = action.payload.audit || action.payload;
        const index = state.audits.findIndex((a) => a.id === presentedAudit.id);
        if (index !== -1) {
          state.audits[index] = presentedAudit;
        }
        if (state.currentAudit?.id === presentedAudit.id) {
          state.currentAudit = presentedAudit;
        }
      })
      .addCase(recordPresentation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete clinical audit
      .addCase(deleteClinicalAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClinicalAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = state.audits.filter((a) => a.id !== action.payload);
        if (state.currentAudit?.id === action.payload) {
          state.currentAudit = null;
        }
      })
      .addCase(deleteClinicalAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchAuditStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchAuditStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentAudit,
  clearCurrentAudit,
  clearError,
} = clinicalAuditSlice.actions;

export default clinicalAuditSlice.reducer;
