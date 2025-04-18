import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastMessage: null,
  toastType: "info",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || "info";
    },
    clearToast: (state) => {
      state.toastMessage = null;
      state.toastType = "info";
    },
  },
});

export const { showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
