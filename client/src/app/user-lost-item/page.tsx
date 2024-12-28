"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const UserLostItem = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location_lost: "",
    date_lost: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) {
      newErrors.name = "Nazwa przedmiotu jest wymagana.";
    }
    if (!form.category) {
      newErrors.category = "Kategoria jest wymagana.";
    }
    // Poprawione: sprawdzamy "date_lost" (a nie "date_found")
    if (!form.date_lost) {
      newErrors.date_lost = "Data zgubienia jest wymagana.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:3001/api/lost-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodaj token do nagłówka
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Błąd podczas dodawania zgłoszenia.");

      alert("Zgłoszenie zostało dodane!");
      router.push("/user-lost-item-status"); // Przekierowanie po sukcesie
    } catch (error) {
      console.error(error);
      alert("Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Zgłoś zagubiony przedmiot
      </h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Nazwa przedmiotu"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Wprowadź nazwę przedmiotu"
          error={errors.name}
        />

        <InputField
          label="Opis przedmiotu"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Wprowadź szczegóły"
        />

        {/* Kategoria - select */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Kategoria</label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Wybierz kategorię</option>
            <option value="Elektronika">Elektronika</option>
            <option value="Akcesoria">Akcesoria</option>
            <option value="Odzież">Odzież</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <InputField
          label="Miejsce zgubienia"
          name="location_lost"
          value={form.location_lost}
          onChange={handleInputChange}
          placeholder="Wprowadź lokalizację"
        />

        <InputField
          label="Data zgubienia"
          name="date_lost"
          type="date"
          value={form.date_lost}
          onChange={handleInputChange}
          placeholder="Wybierz datę"
          error={errors.date_lost}
        />

        <div className="flex space-x-4 mt-6">
          <CustomButton type="submit" title="Zgłoś zagubienie" />
          <CustomButton
            type="button"
            title="Anuluj"
            onClick={() => router.push("/")}
            bgVariant="secondary"
          />
        </div>
      </form>
    </div>
  );
};

export default UserLostItem;
