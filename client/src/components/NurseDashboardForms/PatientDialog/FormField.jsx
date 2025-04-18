import React from "react";
import { Field } from "formik";
import { TextField, MenuItem, Box } from "@mui/material";

const FormField = ({
  name,
  label,
  type = "text",
  multiline = false,
  rows,
  select = false,
  options = [],
  touched,
  errors,
  handleChange,
  handleBlur,
}) => (
  <Field
    as={TextField}
    name={name}
    label={
      <>
        {label}
        <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
          *
        </Box>
      </>
    }
    type={type}
    fullWidth
    variant="outlined"
    size="small"
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched[name] && Boolean(errors[name])}
    helperText={touched[name] && errors[name]}
    multiline={multiline}
    rows={rows}
    select={select}
    InputLabelProps={
      type === "date" || type === "datetime-local" ? { shrink: true } : {}
    }
    sx={{
      "& .MuiOutlinedInput-root": {
        backgroundColor: "background.paper",
        "&:hover fieldset": {
          borderColor: "primary.light",
        },
        "&.Mui-focused fieldset": {
          borderColor: "primary.main",
          borderWidth: 2,
        },
      },
      mb: 1,
    }}
  >
    {select &&
      options.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
  </Field>
);

export default FormField;
