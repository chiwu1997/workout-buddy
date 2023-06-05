import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutsContextProvider } from './context/WorkoutsContext'
import { AuthContextProvider } from './context/AuthContext'
import { DropdownContextProvider } from './context/DropdownContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <DropdownContextProvider>
          <App />
        </DropdownContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);