import React from "react";
import { useAuth } from "../../context/useAuth";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "material-react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const { login } = useAuth();

  const showToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values);
    } catch (err) {
      setErrors({ general: "Invalid username or password" });
      showToast("Unable to log in. Please try again.");
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: "16px", width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

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
                <Typography color="error" align="center" gutterBottom>
                  {errors.general}
                </Typography>
              )}

              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, borderRadius: "8px", padding: "12px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography align="center" sx={{ mt: 2 }}>
          Not registered yet?{" "}
          <MuiLink component={Link} to="/register" underline="hover">
            Register here
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
