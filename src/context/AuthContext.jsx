import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthAPI } from '../api/auth';

const AuthContext = createContext();

const USER_TYPE_MAP = {
  pacient: 'patient',
  patient: 'patient',
  admin: 'admin',
  doctor: 'doctor',
  nurse: 'nurse',
};

/** Нормализует пользователя с API (fullName, userType, isAdmin, certificates) в форму для UI */
function normalizeUser(user) {
  if (!user) return user;
  const fullName = user.fullName || '';
  const parts = fullName.trim().split(/\s+/);
  const firstName = user.firstName ?? parts[0] ?? '';
  const lastName = user.lastName ?? parts.slice(1).join(' ') ?? '';
  const rawUserType = user.userType != null ? String(user.userType).toLowerCase() : '';
  const typeFromUserType = USER_TYPE_MAP[rawUserType];
  const type =
    user.type ??
    (user.isAdmin === true ? 'admin' : null) ??
    typeFromUserType ??
    'patient';
  const license = user.certificates?.[0] ?? user.license ?? '';
  return {
    ...user,
    fullName: fullName || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    type,
    license,
    certificates: user.certificates ?? [],
    isAdmin: user.isAdmin === true,
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refresh';
const USER_KEY = 'medicare_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    AuthAPI.getUserInfo()
      .then((user) => {
        const normalized = normalizeUser(user);
        setCurrentUser(normalized);
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (tokens, userData) => {
    if (tokens?.token) localStorage.setItem(TOKEN_KEY, tokens.token);
    if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
    const user = userData || currentUser;
    if (user) {
      const normalized = normalizeUser(user);
      setCurrentUser(normalized);
      localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateUser = (updatedData) => {
    const merged = { ...currentUser, ...updatedData };
    const updatedUser = merged.fullName != null && merged.firstName == null
      ? normalizeUser(merged)
      : merged;
    setCurrentUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  /** Запрос GET /info и обновление текущего пользователя в контексте. При 401 сработает interceptor. */
  const refreshUser = () => {
    return AuthAPI.getUserInfo()
      .then((user) => {
        const normalized = normalizeUser(user);
        setCurrentUser(normalized);
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
        return normalized;
      });
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    refreshUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
