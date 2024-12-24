"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: "guest",
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string>("guest");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isTokenExpired = (exp: number) => Date.now() >= exp * 1000;

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("guest");
    setIsLoading(false);
    router.push("/"); // Przekierowanie
  };

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.exp && isTokenExpired(decoded.exp)) {
        logout();
        return;
      }
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setRole(decoded.role);
      setIsLoading(false);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        if (!decoded.exp || !isTokenExpired(decoded.exp)) {
          setIsLoggedIn(true);
          setRole(decoded.role);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
