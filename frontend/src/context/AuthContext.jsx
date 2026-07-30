// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // FastAPI OAuth2 requires FormData, not JSON!
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        localStorage.setItem('token', response.data.access_token);
        setIsAuthenticated(true);
    };

    const register = async (email, password) => {
        await api.post('/auth/register', { email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};