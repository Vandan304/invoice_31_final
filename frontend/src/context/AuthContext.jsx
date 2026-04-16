import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error("Auth Check Failed", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };

        if (token) {
            // If token changes in state (e.g. login/verify), update header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        initAuth();
    }, []); // Run only once on mount to restore session

    // Keep header in sync if token changes later (e.g. login/logout)
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const fetchUser = async () => {
        // ... unused now directly in useEffect but kept if needed manually
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data; // Returns { message, email } - No token yet
    };

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        return res.data; // Returns { message, email } - No token yet
    };

    const verifyOtp = async (email, otp) => {
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const resendOtp = async (email) => {
        const res = await api.post('/auth/send-otp', { email });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, verifyOtp, resendOtp, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
