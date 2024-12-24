"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../components/AuthContext";

const Navbar = () => {
  const { isLoggedIn, role, isLoading, logout } = useAuth();

  if (isLoading) {
    return null; // Nie renderuj nic, dopóki `AuthContext` się nie zainicjalizuje
  }

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
            href="/"
            className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
          >
            Strona główna
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
          >
            Kontakt
          </Link>
          {isLoggedIn && role === "user" && (
            <>
              <Link
                href="/items"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Przedmioty
              </Link>
              <Link
                href="/user-claims"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Twoje roszczenia
              </Link>
              <Link
                href="/user-lost-item"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Zgłoś zagubienie
              </Link>
              <Link
                href="/user-lost-item-status"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Twoje zguby
              </Link>
            </>
          )}
          {isLoggedIn && role === "employee" && (
            <>
              <Link
                href="/all-items"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Wszystkie przedmioty
              </Link>
              <Link
                href="/employee-ownership-claims"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Roszczenia własności
              </Link>
              <Link
                href="/employee-lost-reports"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Zgłoszenia
              </Link>
              <Link
                href="/add-item"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Dodaj przedmiot
              </Link>
            </>
          )}
          {isLoggedIn && role === "admin" && (
            <>
              <Link
                href="/"
                className="text-gray-600 hover:text-green-600 font-medium transition duration-300"
              >
                Admin panel
              </Link>
            </>
          )}
        </div>

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
              onClick={() => {
                logout();
              }}
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
