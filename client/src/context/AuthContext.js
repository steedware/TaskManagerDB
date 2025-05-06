import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  axios.defaults.baseURL = 'http://localhost:5000/api';

  axios.interceptors.request.use(
    (config) => {
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/users/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid login credentials');
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/users', { name, email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put('/users/profile', userData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Aktualizacja profilu nie powiodła się');
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete('/users/profile');
      logout();
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Usunięcie konta nie powiodło się');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};