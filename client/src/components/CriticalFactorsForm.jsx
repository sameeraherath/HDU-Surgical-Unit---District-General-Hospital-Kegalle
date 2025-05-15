import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import apiClient from "../api/apiClient";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const CriticalFactorsForm = ({ open, onClose, patientId, bedNumber }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const initialFormState = useMemo(
    () => ({
      heartRate: "", // 60–100 bpm
      respiratoryRate: "", // 12–20 breaths/min
      bloodPressureSystolic: "", // 90-120 mmHg
      bloodPressureDiastolic: "", // 60-80 mmHg
      spO2: "", // 95–100%
      temperature: "", // 36.1–37.2 °C
      glasgowComaScale: "", // 13–15 (normal)
      painScale: "", // 0–10
      bloodGlucose: "", // 70–140 mg/dL
      urineOutput: "", // ≥0.5 mL/kg/hr (Store as direct value for now)
    }),
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Validation schema for Formik - all fields are optional
  const validationSchema = Yup.object({
    heartRate: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(20, "Heart rate should be at least 20 bpm")
      .max(250, "Heart rate should not exceed 250 bpm"),
    respiratoryRate: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(5, "Respiratory rate should be at least 5 breaths/min")
      .max(60, "Respiratory rate should not exceed 60 breaths/min"),
    bloodPressureSystolic: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(60, "Systolic pressure should be at least 60 mmHg")
      .max(250, "Systolic pressure should not exceed 250 mmHg"),
    bloodPressureDiastolic: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(30, "Diastolic pressure should be at least 30 mmHg")
      .max(150, "Diastolic pressure should not exceed 150 mmHg"),
    spO2: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(50, "SpO2 should be at least 50%")
      .max(100, "SpO2 should not exceed 100%"),
    temperature: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(30, "Temperature should be at least 30°C")
      .max(45, "Temperature should not exceed 45°C"),
    glasgowComaScale: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(3, "GCS should be at least 3")
      .max(15, "GCS should not exceed 15"),
    painScale: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(0, "Pain scale should be at least 0")
      .max(10, "Pain scale should not exceed 10"),
    bloodGlucose: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(20, "Blood glucose should be at least 20 mg/dL")
      .max(600, "Blood glucose should not exceed 600 mg/dL"),
    urineOutput: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(0, "Urine output should be at least 0 mL/kg/hr")
      .max(10, "Urine output should not exceed 10 mL/kg/hr"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        ...values,
        patientId: patientId,
        recordedBy: currentUser?.id,
        recordedAt: new Date().toISOString(),
      };

      // Convert empty strings to null for the backend
      for (const key in payload) {
        if (payload[key] === "") {
          payload[key] = null;
        }
      }

      try {
        await apiClient.post(
          `/critical-factors/patients/${patientId}/critical-factors`,
          payload
        );
        setSuccessMessage("Critical factors recorded successfully!");
        setIsLoading(false);
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to record critical factors."
        );
        setIsLoading(false);
      }
    },
  }); // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      formik.resetForm();
      setError(null);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Intentionally excluding formik to prevent infinite renders

  const fields = [
    {
      name: "heartRate",
      label: "Heart Rate (HR)",
      unit: "bpm",
      normalRange: "60–100",
    },
    {
      name: "respiratoryRate",
      label: "Respiratory Rate (RR)",
      unit: "breaths/min",
      normalRange: "12–20",
    },
    {
      name: "bloodPressureSystolic",
      label: "Blood Pressure (Systolic)",
      unit: "mmHg",
      normalRange: "90–120",
    },
    {
      name: "bloodPressureDiastolic",
      label: "Blood Pressure (Diastolic)",
      unit: "mmHg",
      normalRange: "60–80",
    },
    { name: "spO2", label: "SpO₂", unit: "%", normalRange: "95–100" },
    {
      name: "temperature",
      label: "Temperature",
      unit: "°C",
      normalRange: "36.1–37.2",
    },
    {
      name: "glasgowComaScale",
      label: "Glasgow Coma Scale",
      unit: "",
      normalRange: "13–15",
    },
    { name: "painScale", label: "Pain Scale", unit: "", normalRange: "0–10" },
    {
      name: "bloodGlucose",
      label: "Blood Glucose",
      unit: "mg/dL",
      normalRange: "70–140",
    },
    {
      name: "urineOutput",
      label: "Urine Output",
      unit: "mL/kg/hr",
      normalRange: "≥0.5",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Record Vitals for Patient in Bed {bedNumber} (ID: {patientId || "N/A"})
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.name}>
                <TextField
                  fullWidth
                  type={
                    field.name === "temperature" || field.name === "urineOutput"
                      ? "number"
                      : "number"
                  }
                  name={field.name}
                  label={`${field.label} (${field.unit})`}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    (formik.touched[field.name] && formik.errors[field.name]) ||
                    `Normal: ${field.normalRange}`
                  }
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step:
                      field.name === "temperature" ||
                      field.name === "urineOutput"
                        ? "0.1"
                        : "1",
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Saving..." : "Save Vitals"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CriticalFactorsForm;
