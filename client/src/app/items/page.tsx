"use client";
import React, { useState } from "react";
import { Item } from "../types/type";
import ClaimForm from "../components/ClaimForm"; // Import nowego komponentu

export default function Items() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/items?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: Item[] = await response.json();
        setItems(data);
      } else {
        console.error("Błąd podczas wyszukiwania.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Wyszukaj przedmiot
      </h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Wpisz nazwę przedmiotu..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-200"
        />
        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Szukaj
        </button>
      </div>
      {items.length > 0 && (
        <ul className="mt-8 w-full max-w-4xl bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="p-4 hover:bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-gray-400">
                Kategoria: {item.category}
              </p>
              <button
                onClick={() => setSelectedItem(item)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Zgłoś roszczenie
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedItem && (
        <ClaimForm item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
