import { useState, useEffect } from "react";
import { useGlobalContext } from "./GlobalContext";
import { loginUser, fetchUserProfile } from "../api/auth";

// ==============================
// CUSTOM HOOK: useAuth
// ==============================
const useAuth = () => {
  const { state, dispatch } = useGlobalContext();
  const [isAuthenticated, setIsAuthenticated] = useState(!!state.token);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await loginUser(credentials);

      // Save token and user data in global state
      dispatch({ type: "SET_TOKEN", payload: response.access_token });
      dispatch({ type: "SET_USER", payload: response.user });

      // Update authentication status
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.error || "Login failed" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: "RESET" }); // Reset global state
    setIsAuthenticated(false);
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const profile = await fetchUserProfile();
      dispatch({ type: "SET_USER", payload: profile });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.error || "Failed to fetch profile" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Automatically fetch user profile if token exists
  useEffect(() => {
    if (state.token) {
      fetchProfile();
    }
  }, [state.token]);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    fetchProfile,
  };
};

export default useAuth;