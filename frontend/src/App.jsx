// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Import your pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import VaultPage from './pages/VaultPage';
import Navbar from './components/Navbar';

// A simple wrapper to protect private routes
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes (Requires Login) */}
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
                <Route path="/vault" element={<PrivateRoute><VaultPage /></PrivateRoute>} />
                
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}