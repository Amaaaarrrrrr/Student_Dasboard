import React, { createContext, useContext, useReducer } from "react";

// ==============================
// INITIAL STATE
// ==============================
const initialState = {
  user: null, // Stores the logged-in user's information
  token: null, // Stores the JWT token
  loading: false, // Global loading state
  error: null, // Global error state
};

// ==============================
// REDUCER FUNCTION
// ==============================
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ==============================
// CONTEXT CREATION
// ==============================
const GlobalContext = createContext();

// ==============================
// PROVIDER COMPONENT
// ==============================
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// ==============================
// CUSTOM HOOK
// ==============================
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};