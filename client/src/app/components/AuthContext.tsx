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
  getToken: () => string | null; // Nowa funkcja
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
  getToken: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string>("guest");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // Stan na token
  const router = useRouter();

  const isTokenExpired = (exp: number) => Date.now() >= exp * 1000;

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
    setRole("guest");
    setIsLoading(false);
    router.push("/");
  };

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.exp && isTokenExpired(decoded.exp)) {
        logout();
        return;
      }
      localStorage.setItem("token", token);
      setToken(token); // Zapis tokena
      setIsLoggedIn(true);
      setRole(decoded.role);
      setIsLoading(false);
    } catch {
      logout();
    }
  };

  const getToken = () => token; // Funkcja zwracająca token

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<TokenPayload>(storedToken);
        if (!decoded.exp || !isTokenExpired(decoded.exp)) {
          setToken(storedToken); // Ustawienie tokena
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
      value={{ isLoggedIn, role, isLoading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
