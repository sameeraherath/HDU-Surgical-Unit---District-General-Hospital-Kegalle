import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Box,
  Avatar,
  CircularProgress,
  Link as MuiLink,
  Backdrop,
  Container,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/loaderSlice";
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";
import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import { Link } from "react-router-dom";


const enhancedFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    minHeight: "56px",
    backgroundColor: "#f8fafc",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
    },
  },
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    minHeight: "56px",
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
  },
};

const Register = () => {
  const { formik, nurseGrades } = useRegistrationForm();
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state.loader.isLoading);
  const { values, handleChange, errors, touched, setFieldValue } = formik;

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));
    try {
      await formik.handleSubmit(event);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Backdrop open={globalLoading} sx={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                p: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  mx: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <PersonAdd sx={{ fontSize: 28, color: "white" }} />
              </Avatar>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "white",
                  mb: 1,
                }}
              >
                Create Your Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Join the HDU team and start managing patient care
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <FormControl fullWidth sx={enhancedFieldStyle} size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        label="Role"
                      >
                        <MenuItem value="Consultant">Consultant</MenuItem>
                        <MenuItem value="Medical Officer">
                          Medical Officer
                        </MenuItem>
                        <MenuItem value="House Officer">House Officer</MenuItem>
                        <MenuItem value="Nurse">Nurse</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <TextField
                      label="Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      fullWidth
                      sx={enhancedFieldStyle}
                      size="small"
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      fullWidth
                      sx={enhancedFieldStyle}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePassword}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      label="Registration Number"
                      name="registrationNumber"
                      value={values.registrationNumber}
                      onChange={handleChange}
                      error={
                        touched.registrationNumber &&
                        Boolean(errors.registrationNumber)
                      }
                      helperText={
                        touched.registrationNumber && errors.registrationNumber
                      }
                      fullWidth
                      sx={enhancedFieldStyle}
                      size="small"
                    />
                  </Grid>

                  <Grid item>
                    <FormControl fullWidth sx={enhancedFieldStyle} size="small">
                      <InputLabel>Ward</InputLabel>
                      <Select
                        name="ward"
                        value={values.ward}
                        onChange={handleChange}
                        label="Ward"
                      >
                        <MenuItem value="Side A">Side A</MenuItem>
                        <MenuItem value="Side B">Side B</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <MuiTelInput
                      value={values.mobileNumber}
                      onChange={(val) => setFieldValue("mobileNumber", val)}
                      label="Mobile Number"
                      defaultCountry="LK"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                      TextFieldProps={{
                        sx: enhancedFieldStyle,
                        size: "small",
                        error:
                          touched.mobileNumber && Boolean(errors.mobileNumber),
                        helperText: touched.mobileNumber && errors.mobileNumber,
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      sx={enhancedFieldStyle}
                      size="small"
                    />
                  </Grid>

                  <Grid item>
                    <FormControl fullWidth sx={enhancedFieldStyle} size="small">
                      <InputLabel>Sex</InputLabel>
                      <Select
                        name="sex"
                        value={values.sex}
                        onChange={handleChange}
                        label="Sex"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {["Consultant", "House Officer", "Medical Officer"].includes(
                    values.role
                  ) && (
                    <>
                      <Grid item>
                        <TextField
                          label="Name with Initials"
                          name="nameWithInitials"
                          value={values.nameWithInitials}
                          onChange={handleChange}
                          error={
                            touched.nameWithInitials &&
                            Boolean(errors.nameWithInitials)
                          }
                          helperText={
                            touched.nameWithInitials && errors.nameWithInitials
                          }
                          fullWidth
                          sx={enhancedFieldStyle}
                          size="small"
                        />
                      </Grid>

                      <Grid item>
                        <TextField
                          label="Speciality"
                          name="speciality"
                          value={values.speciality}
                          onChange={handleChange}
                          error={
                            touched.speciality && Boolean(errors.speciality)
                          }
                          helperText={touched.speciality && errors.speciality}
                          fullWidth
                          sx={enhancedFieldStyle}
                          size="small"
                        />
                      </Grid>
                    </>
                  )}

                  {values.role === "Nurse" && (
                    <Grid item>
                      <FormControl fullWidth sx={enhancedFieldStyle} size="small">
                        <InputLabel>Grade</InputLabel>
                        <Select
                          name="grade"
                          value={values.grade}
                          onChange={handleChange}
                          label="Grade"
                        >
                          {nurseGrades.map((grade) => (
                            <MenuItem key={grade} value={grade}>
                              {grade}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Box mt={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 4px 20px rgba(37, 99, 235, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                    boxShadow: "0 6px 25px rgba(37, 99, 235, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                disabled={globalLoading}
                startIcon={<PersonAdd />}
              >
                Create Account
              </Button>
            </Box>
            
            <Box textAlign="center" mt={3}>
              <Typography sx={{ fontSize: "14px", color: "#64748b", mb: 2 }}>
                Already have an account?
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: "#1d4ed8",
                    backgroundColor: "rgba(37, 99, 235, 0.04)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                endIcon={<ArrowIcon sx={{ fontSize: 16 }} />}
              >
                Sign In
              </Button>
            </Box>
          </form>
        </Box>
        </Paper>
      </Container>
    </Box>
    </>
  );
};

export default Register;
