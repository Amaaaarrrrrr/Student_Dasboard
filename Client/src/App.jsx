import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <AppRoutes />
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
