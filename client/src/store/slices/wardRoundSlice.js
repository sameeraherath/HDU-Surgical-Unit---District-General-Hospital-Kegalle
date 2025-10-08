import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wardRoundApi from '../../api/wardRoundApi';

// Async thunks
export const fetchAllWardRounds = createAsyncThunk(
  'wardRounds/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await wardRoundApi.getAllWardRounds(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWardRoundsByPatient = createAsyncThunk(
  'wardRounds/fetchByPatient',
  async (patientId, { rejectWithValue }) => {
    try {
      return await wardRoundApi.getWardRoundsByPatient(patientId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTodaysWardRounds = createAsyncThunk(
  'wardRounds/fetchTodays',
  async (_, { rejectWithValue }) => {
    try {
      return await wardRoundApi.getTodaysWardRounds();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWardRoundById = createAsyncThunk(
  'wardRounds/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await wardRoundApi.getWardRoundById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createWardRound = createAsyncThunk(
  'wardRounds/create',
  async (wardRoundData, { rejectWithValue }) => {
    try {
      return await wardRoundApi.createWardRound(wardRoundData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateWardRound = createAsyncThunk(
  'wardRounds/update',
  async ({ id, wardRoundData }, { rejectWithValue }) => {
    try {
      return await wardRoundApi.updateWardRound(id, wardRoundData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const reviewWardRound = createAsyncThunk(
  'wardRounds/review',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      return await wardRoundApi.reviewWardRound(id, reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWardRound = createAsyncThunk(
  'wardRounds/delete',
  async (id, { rejectWithValue }) => {
    try {
      await wardRoundApi.deleteWardRound(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWardRoundStats = createAsyncThunk(
  'wardRounds/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await wardRoundApi.getWardRoundStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  wardRounds: [],
  currentWardRound: null,
  todaysWardRounds: [],
  patientWardRounds: [],
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
    patientId: null,
    consultantId: null,
    startDate: null,
    endDate: null,
    patientStatus: null,
  },
};

// Slice
const wardRoundSlice = createSlice({
  name: 'wardRounds',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentWardRound: (state, action) => {
      state.currentWardRound = action.payload;
    },
    clearCurrentWardRound: (state) => {
      state.currentWardRound = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ward rounds
      .addCase(fetchAllWardRounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWardRounds.fulfilled, (state, action) => {
        state.loading = false;
        state.wardRounds = action.payload.wardRounds || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllWardRounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch today's ward rounds
      .addCase(fetchTodaysWardRounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodaysWardRounds.fulfilled, (state, action) => {
        state.loading = false;
        state.todaysWardRounds = action.payload.wardRounds || action.payload;
      })
      .addCase(fetchTodaysWardRounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ward rounds by patient
      .addCase(fetchWardRoundsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWardRoundsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientWardRounds = action.payload.wardRounds || action.payload;
      })
      .addCase(fetchWardRoundsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ward round by ID
      .addCase(fetchWardRoundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWardRoundById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWardRound = action.payload.wardRound || action.payload;
      })
      .addCase(fetchWardRoundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create ward round
      .addCase(createWardRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWardRound.fulfilled, (state, action) => {
        state.loading = false;
        state.wardRounds.unshift(action.payload.wardRound || action.payload);
      })
      .addCase(createWardRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ward round
      .addCase(updateWardRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWardRound.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWardRound = action.payload.wardRound || action.payload;
        const index = state.wardRounds.findIndex((wr) => wr.id === updatedWardRound.id);
        if (index !== -1) {
          state.wardRounds[index] = updatedWardRound;
        }
        if (state.currentWardRound?.id === updatedWardRound.id) {
          state.currentWardRound = updatedWardRound;
        }
      })
      .addCase(updateWardRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Review ward round
      .addCase(reviewWardRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewWardRound.fulfilled, (state, action) => {
        state.loading = false;
        const reviewedWardRound = action.payload.wardRound || action.payload;
        const index = state.wardRounds.findIndex((wr) => wr.id === reviewedWardRound.id);
        if (index !== -1) {
          state.wardRounds[index] = reviewedWardRound;
        }
        if (state.currentWardRound?.id === reviewedWardRound.id) {
          state.currentWardRound = reviewedWardRound;
        }
      })
      .addCase(reviewWardRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete ward round
      .addCase(deleteWardRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWardRound.fulfilled, (state, action) => {
        state.loading = false;
        state.wardRounds = state.wardRounds.filter((wr) => wr.id !== action.payload);
        if (state.currentWardRound?.id === action.payload) {
          state.currentWardRound = null;
        }
      })
      .addCase(deleteWardRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchWardRoundStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWardRoundStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchWardRoundStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentWardRound,
  clearCurrentWardRound,
  clearError,
} = wardRoundSlice.actions;

export default wardRoundSlice.reducer;
