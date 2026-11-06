import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, LoginData, RegisterData } from '../services/authService';
import { mockStorage } from '../services/storage';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const current = mockStorage.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    const res = await authService.login(data);
    setUser(res.user);
  };

  const register = async (data: RegisterData) => {
    const res = await authService.register(data);
    setUser(res.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const users = mockStorage.getUsers();
    let targetUser: User | undefined;
    if (targetRole === 'admin') {
      targetUser = users.find((u) => u.role === 'admin');
    } else if (targetRole === 'expert') {
      targetUser = users.find((u) => u.role === 'expert' && u.isApproved);
    } else {
      targetUser = users.find((u) => u.role === 'farmer');
    }

    if (targetUser) {
      mockStorage.setCurrentUser(targetUser);
      setUser(targetUser);
    }
  };

  const resetDemoData = () => {
    mockStorage.resetToDefaults();
    const current = mockStorage.getCurrentUser();
    setUser(current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
