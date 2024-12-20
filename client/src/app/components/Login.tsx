"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../components/AuthContext";



const LoginUser = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateFields = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email jest wymagany.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Podaj poprawny email.";

    if (!password.trim()) errors.password = "Hasło jest wymagane.";
    else if (password.length < 4)
      errors.password = "Hasło musi mieć co najmniej 6 znaków.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // Zwraca true, jeśli brak błędów
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateFields()) return; // Zatrzymaj wysyłanie, jeśli są błędy

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
      login(token); // Wywołanie funkcji login, aby zaktualizować stan w AuthContext

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
        error={fieldErrors.email}
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
        error={fieldErrors.password}
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
