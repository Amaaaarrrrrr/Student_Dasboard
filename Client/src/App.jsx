import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <div>
        <a href="https://vite.devjh" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        {/*  */}
        
      </div>
      <h1>Student Portal System</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          counting.. {count}
        </button>
        <p>
          
        </p>
      </div>
      <p className="read-the-docs">
        This is changing to student portal system 
      </p>
    </>
  )
}

export default App;
