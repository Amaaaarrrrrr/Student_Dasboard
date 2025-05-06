import React, { createContext, useState, useContext } from 'react';

// Create the GlobalContext with default empty object
const GlobalContext = createContext({});

/**
 * GlobalProvider component to wrap the app and provide global state and updater function.
 * Manages global state variables and provides a method to update them.
 */
export const GlobalProvider = ({ children }) => {
  // State object to hold global state variables
  const [state, setState] = useState({
    // Example global state variables
    theme: 'light',
    language: 'en',
  });

  /**
   * Updates global state by merging new state with previous state.
   * @param {Object} newState - Partial state to merge into current state.
   */
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <GlobalContext.Provider value={{ state, updateState }}>
      {children}
    </GlobalContext.Provider>
  );
};

/**
 * Custom hook to access the GlobalContext in components.
 * @returns {Object} The global context value including state and updateState function.
 */
export const useGlobal = () => {
  return useContext(GlobalContext);
};
