import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fluidBalanceApi from "../../api/fluidBalanceApi";

// Async thunks
export const recordFluidBalance = createAsyncThunk(
  "fluidBalance/record",
  async (fluidData, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.recordFluidBalance(fluidData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to record fluid balance"
      );
    }
  }
);

export const fetchFluidBalanceByPatient = createAsyncThunk(
  "fluidBalance/fetchByPatient",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.getFluidBalanceByPatient(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fluid balance records"
      );
    }
  }
);

export const fetchFluidBalanceSummary = createAsyncThunk(
  "fluidBalance/fetchSummary",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.getFluidBalanceSummary(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fluid balance summary"
      );
    }
  }
);

export const fetchFluidBalanceChartData = createAsyncThunk(
  "fluidBalance/fetchChartData",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.getFluidBalanceChartData(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chart data"
      );
    }
  }
);

export const updateFluidBalance = createAsyncThunk(
  "fluidBalance/update",
  async ({ recordId, updateData }, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.updateFluidBalance(
        recordId,
        updateData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update fluid balance record"
      );
    }
  }
);

export const verifyFluidBalance = createAsyncThunk(
  "fluidBalance/verify",
  async (recordId, { rejectWithValue }) => {
    try {
      const data = await fluidBalanceApi.verifyFluidBalance(recordId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify fluid balance record"
      );
    }
  }
);

export const deleteFluidBalance = createAsyncThunk(
  "fluidBalance/delete",
  async (recordId, { rejectWithValue }) => {
    try {
      await fluidBalanceApi.deleteFluidBalance(recordId);
      return recordId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete fluid balance record"
      );
    }
  }
);

const initialState = {
  records: [],
  summary: null,
  chartData: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 100,
    pages: 0,
  },
  filters: {
    recordType: "",
    shiftTime: "",
    startDate: "",
    endDate: "",
  },
  loading: false,
  error: null,
};

const fluidBalanceSlice = createSlice({
  name: "fluidBalance",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Record fluid balance
      .addCase(recordFluidBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordFluidBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload.fluidBalance);
        if (state.summary) {
          state.summary.totalInput = action.payload.cumulativeInput24h;
          state.summary.totalOutput = action.payload.cumulativeOutput24h;
          state.summary.balance = action.payload.balance24h;
        }
      })
      .addCase(recordFluidBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by patient
      .addCase(fetchFluidBalanceByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFluidBalanceByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFluidBalanceByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch summary
      .addCase(fetchFluidBalanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFluidBalanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFluidBalanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch chart data
      .addCase(fetchFluidBalanceChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFluidBalanceChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchFluidBalanceChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateFluidBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFluidBalance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (r) => r.id === action.payload.record.id
        );
        if (index !== -1) {
          state.records[index] = action.payload.record;
        }
      })
      .addCase(updateFluidBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify
      .addCase(verifyFluidBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyFluidBalance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (r) => r.id === action.payload.record.id
        );
        if (index !== -1) {
          state.records[index] = action.payload.record;
        }
      })
      .addCase(verifyFluidBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteFluidBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFluidBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteFluidBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } =
  fluidBalanceSlice.actions;

export default fluidBalanceSlice.reducer;
