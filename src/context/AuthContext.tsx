import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  register: (email: string, name: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('zen_campus_current_user');
    if (storedUserId) {
      const users = storage.getUsers();
      const found = users.find(u => u.id === storedUserId);
      if (found) setUser(found);
    }
  }, []);

  const login = (email: string) => {
    const users = storage.getUsers();
    const found = users.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('zen_campus_current_user', found.id);
      return true;
    }
    return false;
  };

  const register = (email: string, name: string) => {
    const users = storage.getUsers();
    if (users.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
    };
    storage.saveUser(newUser);
    setUser(newUser);
    localStorage.setItem('zen_campus_current_user', newUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zen_campus_current_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    storage.saveUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
