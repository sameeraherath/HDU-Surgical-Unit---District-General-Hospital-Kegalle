import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as prescriptionApi from "../../api/prescriptionApi";

// Async thunks
export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (prescriptionData, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.createPrescription(prescriptionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create prescription"
      );
    }
  }
);

export const fetchPrescriptionsByPatient = createAsyncThunk(
  "prescriptions/fetchByPatient",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.getPrescriptionsByPatient(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch prescriptions"
      );
    }
  }
);

export const fetchActivePrescriptions = createAsyncThunk(
  "prescriptions/fetchActive",
  async (params, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.getActivePrescriptions(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active prescriptions"
      );
    }
  }
);

export const fetchControlledPrescriptions = createAsyncThunk(
  "prescriptions/fetchControlled",
  async (params, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.getControlledPrescriptions(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch controlled prescriptions"
      );
    }
  }
);

export const fetchMedicationSchedule = createAsyncThunk(
  "prescriptions/fetchSchedule",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.getMedicationSchedule(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch medication schedule"
      );
    }
  }
);

export const updatePrescription = createAsyncThunk(
  "prescriptions/update",
  async ({ prescriptionId, updateData }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.updatePrescription(
        prescriptionId,
        updateData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update prescription"
      );
    }
  }
);

export const discontinuePrescription = createAsyncThunk(
  "prescriptions/discontinue",
  async ({ prescriptionId, discontinuationData }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.discontinuePrescription(
        prescriptionId,
        discontinuationData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to discontinue prescription"
      );
    }
  }
);

export const verifyPrescription = createAsyncThunk(
  "prescriptions/verify",
  async ({ prescriptionId, verificationData }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.verifyPrescription(
        prescriptionId,
        verificationData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify prescription"
      );
    }
  }
);

export const dispensePrescription = createAsyncThunk(
  "prescriptions/dispense",
  async ({ prescriptionId, dispensingData }, { rejectWithValue }) => {
    try {
      const data = await prescriptionApi.dispensePrescription(
        prescriptionId,
        dispensingData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to dispense prescription"
      );
    }
  }
);

const initialState = {
  prescriptions: [],
  activePrescriptions: [],
  controlledPrescriptions: [],
  medicationSchedule: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {
    status: "",
  },
  loading: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: "prescriptions",
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
      // Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions.unshift(action.payload.prescription);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by patient
      .addCase(fetchPrescriptionsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptionsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload.prescriptions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPrescriptionsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active
      .addCase(fetchActivePrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.activePrescriptions = action.payload.prescriptions;
      })
      .addCase(fetchActivePrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch controlled
      .addCase(fetchControlledPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchControlledPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.controlledPrescriptions = action.payload.prescriptions;
      })
      .addCase(fetchControlledPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch schedule
      .addCase(fetchMedicationSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicationSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.medicationSchedule = action.payload.schedule;
      })
      .addCase(fetchMedicationSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updatePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.prescription.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload.prescription;
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Discontinue
      .addCase(discontinuePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discontinuePrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.prescription.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload.prescription;
        }
      })
      .addCase(discontinuePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify
      .addCase(verifyPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.prescription.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload.prescription;
        }
      })
      .addCase(verifyPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Dispense
      .addCase(dispensePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dispensePrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.prescription.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload.prescription;
        }
      })
      .addCase(dispensePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } =
  prescriptionSlice.actions;

export default prescriptionSlice.reducer;
