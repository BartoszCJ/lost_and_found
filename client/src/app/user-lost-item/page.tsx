"use client";

import React, { useState } from "react";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { useRouter } from "next/navigation";

const UserLostItem = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location_found: "",
    date_found: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = "Nazwa przedmiotu jest wymagana.";
    if (!form.category) newErrors.category = "Kategoria jest wymagana.";
    if (!form.date_found)
      newErrors.date_found = "Data zgubienia jest wymagana.";
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
      router.push("/dashboard"); // Przekierowanie po sukcesie
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
          name="location_found"
          value={form.location_found}
          onChange={handleInputChange}
          placeholder="Wprowadź lokalizację"
        />
        <InputField
          label="Data zgubienia"
          name="date_found"
          type="date"
          value={form.date_found}
          onChange={handleInputChange}
          placeholder="Wybierz datę"
          error={errors.date_found}
        />
        <div className="flex space-x-4 mt-6">
          <CustomButton type="submit" title="Zgłoś zagubienie" />
          <CustomButton
            type="button"
            title="Anuluj"
            onClick={() => router.push("/dashboard")}
            bgVariant="secondary"
          />
        </div>
      </form>
    </div>
  );
};

export default UserLostItem;
