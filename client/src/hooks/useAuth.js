import { useDispatch, useSelector } from "react-redux";
import * as authApi from "../api/authApi";
import {
  setUser,
  clearUser,
  setLoading,
  setError,
} from "../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.login(credentials);
      dispatch(setUser(res));
      dispatch(setLoading(false));
      return res;
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setError(err.response?.data?.message || "Login failed"));
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.register(formData);
      dispatch(setUser(res));
      dispatch(setLoading(false));
      return res;
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setError(err.response?.data?.message || "Registration failed"));
      throw err;
    }
  };

  const logoutUser = () => {
    dispatch(clearUser());
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logoutUser,
  };
};
