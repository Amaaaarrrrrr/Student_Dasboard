import React, { createContext, useState, useContext } from 'react';

// Create the GlobalContext with default empty object
const GlobalContext = createContext({});

// GlobalProvider component to wrap the app and provide global state
export const GlobalProvider = ({ children }) => {
  // State object to hold global state variables
  const [state, setState] = useState({
    // Add global state variables here
  });

  // Function to update global state by merging new state with previous state
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

// Custom hook to use the GlobalContext in components
export const useGlobal = () => {
  return useContext(GlobalContext);
};
