import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminApi } from "@/services/api";

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("rk_token");
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await adminApi.me();
      setUser(data);
    } catch {
      localStorage.removeItem("rk_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await adminApi.login({ email, password });
    localStorage.setItem("rk_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("rk_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await adminApi.me();
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
