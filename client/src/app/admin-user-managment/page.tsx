/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "employee" | "admin";
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena - zaloguj się jako admin");
      }

      const res = await fetch("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Błąd pobierania listy użytkowników.");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!res.ok) {
        throw new Error("Nie udało się zmienić roli.");
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddEmployee = async () => {
    if (
      !newEmployeeEmail.trim() ||
      !newEmployeePassword.trim() ||
      !newEmployeeName.trim()
    ) {
      alert("Podaj nazwę, email i hasło");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/users/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newEmployeeEmail,
          password: newEmployeePassword,
          name: newEmployeeName,
        }),
      });
      if (!res.ok) {
        throw new Error("Nie udało się dodać pracownika.");
      }
      alert("Pracownik został dodany.");
      setNewEmployeeName("");
      setNewEmployeeEmail("");
      setNewEmployeePassword("");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Nie udało się usunąć użytkownika.");
      }
      alert("Użytkownik został usunięty.");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Ładowanie listy użytkowników...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Panel Administratora</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dodaj nowego pracownika:</h2>
        <div className="flex space-x-2">
          <input
            type="nazwa"
            className="border p-2"
            placeholder="Nazwa pracownika"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
          />
          <input
            type="email"
            className="border p-2"
            placeholder="Email pracownika"
            value={newEmployeeEmail}
            onChange={(e) => setNewEmployeeEmail(e.target.value)}
          />
          <input
            type="password"
            className="border p-2"
            placeholder="Hasło pracownika"
            value={newEmployeePassword}
            onChange={(e) => setNewEmployeePassword(e.target.value)}
          />
          <button
            onClick={handleAddEmployee}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Dodaj
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Lista użytkowników:</h2>
        {users.length === 0 ? (
          <p>Brak użytkowników.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2">ID</th>
                <th className="border border-gray-200 px-4 py-2">Imię</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Rola</th>
                <th className="border border-gray-200 px-4 py-2">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{u.id}</td>
                  <td className="border border-gray-200 px-4 py-2">{u.name}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {u.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="border p-1"
                    >
                      <option value="user">user</option>
                      <option value="employee">employee</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td className="border border-gray-200 px-4 py-2 ">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded items-center"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
