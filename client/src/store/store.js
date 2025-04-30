import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import loaderReducer from "../features/loaderSlice";
import uiReducer from "../features/ui/uiSlice";
import alertsReducer from "../features/alerts/alertsSlice";
import patientReducer from "../features/patients/patientSlice";

const customLogger = (storeAPI) => (next) => (action) => {
  console.log("➡️ Dispatching:", action);
  console.log("🔁 Previous state:", storeAPI.getState());
  const result = next(action);
  console.log("✅ New state:", storeAPI.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    ui: uiReducer,
    alerts: alertsReducer,
    patient: patientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(customLogger),
});
