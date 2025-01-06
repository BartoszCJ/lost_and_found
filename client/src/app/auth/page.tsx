"use client";

import React, { useState } from "react";
import LoginUser from "../components/Login";
import Register from "../components/Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-between min-h-screen bg-gray-100">
      <div
        className={`w-1/2 h-screen p-8 shadow-2xl rounded-l-lg flex flex-col items-center justify-start transition-all duration-300 ${
          isLogin ? "bg-white" : "bg-gray-300 bg-opacity-50"
        }`}
      >

          {isLogin && (
            <>
              <h1 className="text-2xl font-bold text-center mb-6 mt-20">
                Logowanie
              </h1>
              <LoginUser />
              <button
                onClick={() => setIsLogin(false)}
                className="mt-6 text-blue-500 hover:underline"
              >
                Nie masz konta? Zarejestruj się
              </button>
            </>
          )}

      </div>
      <div
        className={`w-1/2 h-screen p-8  shadow-2xl rounded-r-lg flex flex-col items-center justify-start transition-all duration-300 ${
          !isLogin ? "bg-white" : "bg-gray-300 bg-opacity-50"
        }`}
      >
        {!isLogin && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6 mt-20 ">
              Rejestracja
            </h1>
            <Register />
            <button
              onClick={() => setIsLogin(true)}
              className="mt-6 text-blue-500 hover:underline"
            >
              Masz już konto? Zaloguj się
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
