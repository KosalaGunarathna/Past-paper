import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load saved session or null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pastpaper_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pastpaper_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('pastpaper_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pastpaper_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pastpaper_token', token);
    } else {
      localStorage.removeItem('pastpaper_token');
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    if (authToken) {
      setToken(authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pastpaper_user');
    localStorage.removeItem('pastpaper_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      logout, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
