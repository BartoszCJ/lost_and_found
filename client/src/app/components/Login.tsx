"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logowanie nie powiodło się.");
      }

      const { token } = await response.json();

      // Zapisz token w localStorage
      localStorage.setItem("token", token);

      // Odczytaj payload tokena, np. by uzyskać rolę użytkownika
      const decoded = jwtDecode<TokenPayload>(token);
      localStorage.setItem("role", decoded.role);

      // Przekieruj użytkownika np. do dashboard
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 bg-white p-8 rounded-lg w-full max-w-md mx-auto pr"
    >
      {error && <p className="text-red-500">{error}</p>}
      <InputField
        label="Email"
        icon="/assets/icons/email.png"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Wpisz swój email"
        containerStyle="mb-4"
      />
      <InputField
        label="Hasło"
        icon="/assets/icons/lock.png"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder="Wpisz swoje hasło"
        secureTextEntry
        containerStyle="mb-4"
      />
      <div className="pr-5 pl-5 pt-5">
        <CustomButton
          onClick={handleSubmit}
          title={loading ? "Logowanie..." : "Zaloguj"}
          bgVariant={loading ? "secondary" : "success"}
          textVariant="default"
          className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default LoginUser;
