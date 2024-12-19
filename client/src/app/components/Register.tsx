import React, { useState } from "react";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const Register = () => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Rejestracja nie powiodła się.");
      }

      setSuccess(true);
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
      className="space-y-7 bg-white p-8 rounded-lg w-full max-w-md mx-auto"
    >
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-center">
          Rejestracja zakończona sukcesem!
        </p>
      )}
      <InputField
        label="Nazwa użytkownika"
        icon="/assets/icons/person.png"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
        placeholder="Wpisz nazwę użytkownika"
      />
      <InputField
        label="Email"
        icon="/assets/icons/email.png"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Wpisz swój email"
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
      />
      <div className="p-4">
        <CustomButton
          onClick={handleSubmit}
          title={loading ? "Rejestracja..." : "Zarejestruj się"}
          bgVariant={loading ? "secondary" : "success"}
          textVariant="default"
          className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default Register;
