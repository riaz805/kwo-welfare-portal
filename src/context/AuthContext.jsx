import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kwo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role, permissions = {}) => {
    const userData = {
      role, // 'super_admin' or 'limited_admin'
      permissions,
      loginAt: new Date().toISOString()
    };
    setUser(userData);
    localStorage.setItem('kwo_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kwo_user');
  };

  const hasPermission = (permKey) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return !!user.permissions[permKey];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
