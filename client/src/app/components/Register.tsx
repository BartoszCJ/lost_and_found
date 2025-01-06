import React, { useState } from "react";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const Register = () => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errors.name = "Nazwa użytkownika jest wymagana.";
    if (!email.trim()) errors.email = "Email jest wymagany.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Podaj poprawny email.";

    if (!password.trim()) errors.password = "Hasło jest wymagane.";
    else if (password.length < 6)
      errors.password = "Hasło musi mieć co najmniej 6 znaków.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateFields()) return;

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
        error={fieldErrors.name}
      />

      <InputField
        label="Email"
        icon="/assets/icons/email.png"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Wpisz swój email"
        error={fieldErrors.email}
      />

      <InputField
        label="Hasło"
        icon="/assets/icons/lock.png"
        secureTextEntry
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder="Wpisz swoje hasło"
        showpasswordstrength={true} 
      />
      {fieldErrors.password && (
        <p className="text-red-500 text-sm">{fieldErrors.password}</p>
      )}
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
