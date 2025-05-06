import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext with default value null
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap the app and provide authentication state and functions.
 * Manages the current authenticated user and provides login and logout methods.
 */
export const AuthProvider = ({ children }) => {
  // User state to hold authenticated user info
  const [user, setUser] = useState(null);

  /**
   * Logs in a user by setting the user data.
   * @param {Object} userData - The authenticated user data.
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Logs out the user by clearing the user data.
   */
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext in components.
 * @returns {Object} The auth context value including user, login, and logout.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
