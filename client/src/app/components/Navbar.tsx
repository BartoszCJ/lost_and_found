"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Załóżmy, że rolę zapisujesz podczas logowania
    if (token) {
      setIsLoggedIn(true);
      if (role) setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Nazwa Aplikacji */}
        <div className="flex items-center">
          <Image
            width={32}
            height={32}
            className="w-8 h-8 mr-2"
            src="/assets/icons/logo.png"
            alt="Logo"
          />
          <Link href="/">
            <span className="text-xl font-bold text-gray-800">
              Biuro Rzeczy Znalezionych
            </span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            href="/reports"
            className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
          >
            Zgłoszenia
          </Link>
          <Link
            href="/users"
            className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
          >
            Użytkownicy
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
          >
            Raporty
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/items"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Przedmioty
              </Link>
              <Link
                href="/my-submissions"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Twoje zgłoszenia
              </Link>
            </>
          )}

          {/* Warunkowo wyświetlany panel zarządzania dla roli "admin" */}
          {isLoggedIn && userRole === "admin" && (
            <Link
              href="/admin-panel"
              className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
            >
              Panel Zarządzania
            </Link>
          )}

          {/* Warunkowo wyświetlany panel zarządzania dla roli "admin" */}
          {isLoggedIn && userRole === "admin" && (
            <Link
              href="/admin-panel"
              className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
            >
              Panel Zarządzania
            </Link>
          )}
        </div>

        {/* Panel użytkownika / Logowanie/wylogowanie */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <Link
              href="/auth"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition duration-300"
            >
              Zaloguj się
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-md font-medium transition duration-300"
            >
              Wyloguj
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
