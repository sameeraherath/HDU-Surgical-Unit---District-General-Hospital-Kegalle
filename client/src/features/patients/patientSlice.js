import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
  dialogOpen: false,
  selectedBed: null,
  formData: {
    patientId: "",
    fullName: "",
    nicPassport: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    maritalStatus: "",
    contactNumber: "",
    email: "",

    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactNumber: "",
    address: "",

    knownAllergies: "",
    medicalHistory: "",
    currentMedications: "",
    pregnancyStatus: "Not Applicable",
    bloodType: "",

    admissionDateTime: "",
    department: "",
    bedNumber: "",
    initialDiagnosis: "",
    consultantInCharge: "",

    medicalReports: null,
    idProof: null,
    consentForm: null,
  },
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setDialogOpen: (state, action) => {
      state.dialogOpen = action.payload;
      if (!action.payload) {
        state.activeStep = 0;
      }
    },
    setSelectedBed: (state, action) => {
      state.selectedBed = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.activeStep = 0;
      state.dialogOpen = false;
      state.selectedBed = null;
    },
  },
});

export const {
  setActiveStep,
  setDialogOpen,
  setSelectedBed,
  updateFormData,
  resetForm,
} = patientSlice.actions;

export default patientSlice.reducer;
