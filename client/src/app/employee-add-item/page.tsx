/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const EmployeeAddItem: React.FC = () => {
  const router = useRouter();

  // Stan formularza
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location_found: "",
    date_found: "",
    status: "Znaleziony",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Nazwa przedmiotu jest wymagana.");
      return;
    }
    if (!formData.category.trim()) {
      setError("Kategoria przedmiotu jest wymagana.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Brak tokena - zaloguj się jako pracownik.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd dodawania przedmiotu.");
      }

      const newItem = await res.json();
      setSuccess(`Przedmiot "${newItem.name}" został dodany pomyślnie.`);
      setFormData({
        name: "",
        description: "",
        category: "",
        location_found: "",
        date_found: "",
        status: "Znaleziony",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">
        Dodaj Nowy Przedmiot (Employee)
      </h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nazwa:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Opis:</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Kategoria:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Lokalizacja znalezienia:
          </label>
          <input
            type="text"
            name="location_found"
            value={formData.location_found}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Data znalezienia:</label>
          <input
            type="date"
            name="date_found"
            value={formData.date_found}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Znaleziony">Znaleziony</option>
            <option value="Przypisany">Przypisany</option>
            <option value="Zwrocony">Zwrocony</option>
            <option value="Zarchiwizowany">Zarchiwizowany</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded font-semibold"
        >
          Dodaj przedmiot
        </button>
      </form>
    </div>
  );
};

export default EmployeeAddItem;
