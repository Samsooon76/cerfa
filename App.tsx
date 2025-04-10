import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRedirectHandler from './components/Auth/AuthRedirectHandler';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DossiersPage from './pages/DossiersPage';
import AlternantsPage from './pages/AlternantsPage';
import ParametresPage from './pages/ParametresPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthRedirectHandler>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dossiers" element={
              <ProtectedRoute>
                <DossiersPage />
              </ProtectedRoute>
            } />
            <Route path="/alternants" element={
              <ProtectedRoute>
                <AlternantsPage />
              </ProtectedRoute>
            } />
            <Route path="/parametres" element={
              <ProtectedRoute>
                <ParametresPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthRedirectHandler>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
