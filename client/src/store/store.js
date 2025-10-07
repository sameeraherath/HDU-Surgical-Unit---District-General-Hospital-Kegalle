import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import loaderReducer from "../features/loaderSlice";
import uiReducer from "../features/ui/uiSlice";
import alertsReducer from "../features/alerts/alertsSlice";
import patientReducer from "../features/patients/patientSlice";
import userProfileReducer from "../features/userProfile/userProfileSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import auditReducer from "../features/audit/auditSlice";
import progressNotesReducer from "../features/progressNotes/progressNoteSlice";
import investigationsReducer from "../features/investigations/investigationSlice";
import prescriptionsReducer from "../features/prescriptions/prescriptionSlice";
import tasksReducer from "../features/tasks/taskSlice";
import fluidBalanceReducer from "../features/fluidBalance/fluidBalanceSlice";
import medicalOfficerReducer from "../features/medicalOfficer/medicalOfficerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    ui: uiReducer,
    alerts: alertsReducer,
    patient: patientReducer,
    userProfile: userProfileReducer,
    notifications: notificationsReducer,
    audit: auditReducer,
    progressNotes: progressNotesReducer,
    investigations: investigationsReducer,
    prescriptions: prescriptionsReducer,
    tasks: tasksReducer,
    fluidBalance: fluidBalanceReducer,
    medicalOfficer: medicalOfficerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["patient.fileObjects"],
      },
    }),
});
