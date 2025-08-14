// src/context/UserProvider.js
// src/context/UserProvider.js
import React, { useState, useCallback, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import axiosInstance from "../axiosConfig"; // axios custom kamu

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const logoutTimerRef = useRef(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/dashboard/index");
      console.log(response.data.users);
      setUser(response.data.users);
    } catch (error) {
      console.error("Gagal fetch user:", error);
    }
  }, []);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      logout();
      alert("Anda telah logout karena tidak ada aktivitas selama 10 menit.");
    }, 10 * 60 * 1000); // 10 menit
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("auth/login", credentials);
      console.log(response.data);

      const receivedToken = response.data.token;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);

      // Update axiosInstance header
      axiosInstance.defaults.headers[
        "Authorization"
      ] = `Bearer ${receivedToken}`;

      fetchUser();
      resetLogoutTimer(); // mulai hitung waktu setelah login
    } catch (error) {
      console.error("Gagal login:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    delete axiosInstance.defaults.headers["Authorization"];
    localStorage.removeItem("token");
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    window.location.href = "/login"; // redirect ke login
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      resetLogoutTimer();
    }

    // Event untuk deteksi aktivitas
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetLogoutTimer)
    );

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetLogoutTimer)
      );
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [token, fetchUser, resetLogoutTimer]);

  return (
    <UserContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
