import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  Container,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/loaderSlice";
import { showToast } from "../../features/ui/uiSlice";
import { 
  Login as LoginIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    dispatch(setLoading(true));
    try {
      const result = await login(values);

      if (result.user && result.user.role) {
        const route =
          {
            Nurse: "/nurse-dashboard",
            "House Officer": "/house-officer-dashboard",
            "Medical Officer": "/medical-officer-dashboard",
            Consultant: "/consultant-dashboard",
          }[result.user.role] || "/landing";

        navigate(route);
      } else {
        navigate("/landing");
      }
    } catch (error) {
      setErrors({ general: "Invalid username or password" });
      console.error("Login error:", error);
      dispatch(
        showToast({
          message: "Unable to log in. Please try again.",
          type: "error",
        })
      );
    }

    dispatch(setLoading(false));
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: "24px",
                color: "#1e293b",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              Sign in to access your dashboard
            </Typography>
          </Box>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
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
                type="submit"
                disabled={isSubmitting}
                startIcon={<LoginIcon />}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>

          <Box textAlign="center" mt={3}>
            <Typography sx={{ fontSize: "14px", color: "#64748b", mb: 2 }}>
              Don't have an account?
            </Typography>
            <Button
              component={Link}
              to="/register"
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
              Create Account
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
