import React, { useState } from "react";

const Register = () => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      alert("Rejestracja udana! Możesz się teraz zalogować.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nazwa użytkownika"
        className="w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        className="w-full px-4 py-2 border rounded"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Rejestracja zakończona sukcesem!</p>}
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
        Zarejestruj się
      </button>
    </form>
  );
};

export default Register;
