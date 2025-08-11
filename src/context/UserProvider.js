// src/context/UserProvider.js
import React, { useState, useCallback } from 'react';
import { UserContext } from './UserContext';
import axiosInstance from '../axiosConfig'; // gunakan axios custom kamu

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');


  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/dashboard/index');
      console.log(response.data.users);
      setUser(response.data.users);
    } catch (error) {
      console.error('Gagal fetch user:', error);
        // logout();
    }
  }, []);

//   useEffect(() => {
//     if (token) {
//       fetchUser();
//     }
//   }, [token, fetchUser]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('auth/login', credentials);
      console.log(response.data);
      
      const receivedToken = response.data.token;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      // Update axiosInstance header
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${receivedToken}`;

      fetchUser();
    } catch (error) {
      console.error('Gagal login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    delete axiosInstance.defaults.headers['Authorization'];
    localStorage.removeItem('token');
  };


  return (
    <UserContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

