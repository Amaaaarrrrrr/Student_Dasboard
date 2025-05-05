import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext with default value null
const AuthContext = createContext(null);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  // User state to hold authenticated user info
  const [user, setUser] = useState(null);

  // Function to log in a user by setting user data
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out a user by clearing user data
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in components
export const useAuth = () => {
  return useContext(AuthContext);
};
