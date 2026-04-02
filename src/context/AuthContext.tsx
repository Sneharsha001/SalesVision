import React, { createContext, useContext, useState } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRegisteredUsers = (): StoredUser[] => {
  try {
    const data = localStorage.getItem("sv-registered-users");
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveRegisteredUsers = (users: StoredUser[]) => {
  localStorage.setItem("sv-registered-users", JSON.stringify(users));
};

// Simple hash for demo (NOT production-grade – use bcrypt on a real backend)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("sv-user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (email: string, password: string): boolean => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      toast.error("No account found. Please register first.");
      return false;
    }
    if (found.passwordHash !== simpleHash(password)) {
      toast.error("Incorrect password. Please try again.");
      return false;
    }
    const u: User = { id: crypto.randomUUID(), name: found.name, email: found.email };
    setUser(u);
    localStorage.setItem("sv-user", JSON.stringify(u));
    toast.success(`Welcome back, ${u.name}!`);
    return true;
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists. Please login.");
      return false;
    }
    const newUser: StoredUser = { name, email, passwordHash: simpleHash(password) };
    saveRegisteredUsers([...users, newUser]);
    const u: User = { id: crypto.randomUUID(), name, email };
    setUser(u);
    localStorage.setItem("sv-user", JSON.stringify(u));
    toast.success(`Account created! Welcome, ${name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sv-user");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
