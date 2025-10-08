import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as consultationApi from '../../api/consultationApi';

// Async thunks
export const fetchAllConsultations = createAsyncThunk(
  'consultations/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await consultationApi.getAllConsultations(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPendingConsultations = createAsyncThunk(
  'consultations/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      return await consultationApi.getPendingConsultations();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyConsultations = createAsyncThunk(
  'consultations/fetchMy',
  async (params, { rejectWithValue }) => {
    try {
      return await consultationApi.getMyConsultations(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConsultationsByPatient = createAsyncThunk(
  'consultations/fetchByPatient',
  async (patientId, { rejectWithValue }) => {
    try {
      return await consultationApi.getConsultationsByPatient(patientId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConsultationById = createAsyncThunk(
  'consultations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await consultationApi.getConsultationById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createConsultation = createAsyncThunk(
  'consultations/create',
  async (consultationData, { rejectWithValue }) => {
    try {
      return await consultationApi.createConsultation(consultationData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const assignConsultation = createAsyncThunk(
  'consultations/assign',
  async ({ id, assignmentData }, { rejectWithValue }) => {
    try {
      return await consultationApi.assignConsultation(id, assignmentData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateConsultationStatus = createAsyncThunk(
  'consultations/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await consultationApi.updateConsultationStatus(id, statusData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeConsultation = createAsyncThunk(
  'consultations/complete',
  async ({ id, completionData }, { rejectWithValue }) => {
    try {
      return await consultationApi.completeConsultation(id, completionData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelConsultation = createAsyncThunk(
  'consultations/cancel',
  async ({ id, cancelData }, { rejectWithValue }) => {
    try {
      return await consultationApi.cancelConsultation(id, cancelData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConsultationStats = createAsyncThunk(
  'consultations/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await consultationApi.getConsultationStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  consultations: [],
  currentConsultation: null,
  pendingConsultations: [],
  myConsultations: [],
  patientConsultations: [],
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
    urgency: null,
    consultationType: null,
    consultantId: null,
  },
};

// Slice
const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentConsultation: (state, action) => {
      state.currentConsultation = action.payload;
    },
    clearCurrentConsultation: (state) => {
      state.currentConsultation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all consultations
      .addCase(fetchAllConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload.consultations || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch pending consultations
      .addCase(fetchPendingConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingConsultations = action.payload.consultations || action.payload;
      })
      .addCase(fetchPendingConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my consultations
      .addCase(fetchMyConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.myConsultations = action.payload.consultations || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchMyConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch consultations by patient
      .addCase(fetchConsultationsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultationsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientConsultations = action.payload.consultations || action.payload;
      })
      .addCase(fetchConsultationsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch consultation by ID
      .addCase(fetchConsultationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConsultation = action.payload.consultation || action.payload;
      })
      .addCase(fetchConsultationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create consultation
      .addCase(createConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConsultation.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations.unshift(action.payload.consultation || action.payload);
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign consultation
      .addCase(assignConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignConsultation.fulfilled, (state, action) => {
        state.loading = false;
        const assignedConsultation = action.payload.consultation || action.payload;
        const index = state.consultations.findIndex((c) => c.id === assignedConsultation.id);
        if (index !== -1) {
          state.consultations[index] = assignedConsultation;
        }
        state.pendingConsultations = state.pendingConsultations.filter(
          (c) => c.id !== assignedConsultation.id
        );
        if (state.currentConsultation?.id === assignedConsultation.id) {
          state.currentConsultation = assignedConsultation;
        }
      })
      .addCase(assignConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update consultation status
      .addCase(updateConsultationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConsultationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedConsultation = action.payload.consultation || action.payload;
        const index = state.consultations.findIndex((c) => c.id === updatedConsultation.id);
        if (index !== -1) {
          state.consultations[index] = updatedConsultation;
        }
        if (state.currentConsultation?.id === updatedConsultation.id) {
          state.currentConsultation = updatedConsultation;
        }
      })
      .addCase(updateConsultationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete consultation
      .addCase(completeConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeConsultation.fulfilled, (state, action) => {
        state.loading = false;
        const completedConsultation = action.payload.consultation || action.payload;
        const index = state.consultations.findIndex((c) => c.id === completedConsultation.id);
        if (index !== -1) {
          state.consultations[index] = completedConsultation;
        }
        state.myConsultations = state.myConsultations.filter(
          (c) => c.id !== completedConsultation.id || c.status !== 'COMPLETED'
        );
        if (state.currentConsultation?.id === completedConsultation.id) {
          state.currentConsultation = completedConsultation;
        }
      })
      .addCase(completeConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel consultation
      .addCase(cancelConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelConsultation.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledConsultation = action.payload.consultation || action.payload;
        const index = state.consultations.findIndex((c) => c.id === cancelledConsultation.id);
        if (index !== -1) {
          state.consultations[index] = cancelledConsultation;
        }
        if (state.currentConsultation?.id === cancelledConsultation.id) {
          state.currentConsultation = cancelledConsultation;
        }
      })
      .addCase(cancelConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchConsultationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchConsultationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentConsultation,
  clearCurrentConsultation,
  clearError,
} = consultationSlice.actions;

export default consultationSlice.reducer;
