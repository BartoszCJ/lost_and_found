"use client";

import React, { useState } from "react";
import LoginUser from "../components/Login";
import Register from "../components/Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Lewa część ekranu */}
      <div className="w-1/2 bg-white p-8 shadow-lg rounded-l-lg flex flex-col items-center justify-center">
        {isLogin ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Logowanie</h1>
            <LoginUser />
            <button
              onClick={() => setIsLogin(false)}
              className="mt-6 text-blue-500 hover:underline"
            >
              Nie masz konta? Zarejestruj się
            </button>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-center mb-6">Witaj ponownie!</h1>
        )}
      </div>

      {/* Prawa część ekranu */}
      <div className="w-1/2 bg-white p-8 shadow-lg rounded-r-lg flex flex-col items-center justify-center">
        {!isLogin ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Rejestracja</h1>
            <Register />
            <button
              onClick={() => setIsLogin(true)}
              className="mt-6 text-blue-500 hover:underline"
            >
              Masz już konto? Zaloguj się
            </button>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-center mb-6">Zaloguj się!</h1>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
