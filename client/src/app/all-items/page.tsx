"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext"; // Import kontekstu

interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  location_found: string | null;
  date_found: string | null;
  status: string;
}

const AllItems = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Czekamy, aż AuthContext przestanie się ładować
    if (!isLoading) {
      // Jeżeli użytkownik nie jest zalogowany – ustawiamy błąd i nie robimy fetch
      if (!isLoggedIn) {
        setError("Użytkownik nie jest zalogowany.");
        setLoading(false);
        return;
      }

      // Gdy user jest zalogowany, pobieramy dane
      const fetchItems = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Brak tokena");

          const response = await fetch("http://localhost:3001/api/items", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok)
            throw new Error("Błąd podczas pobierania przedmiotów.");

          const data = await response.json();
          setItems(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchItems();
    }
  }, [isLoggedIn, isLoading]);

  // Jeśli AuthContext wciąż się ładuje:
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gray-600">Trwa sprawdzanie stanu logowania...</p>
          </div>
        </main>
      </div>
    );
  }

  // Jeśli wciąż ładujemy same przedmioty:
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gray-600">Ładowanie przedmiotów...</p>
          </div>
        </main>
      </div>
    );
  }

  // Jeśli pojawił się błąd (np. brak tokena, brak zalogowania, error z fetch):
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Możesz tu wstawić <Navbar /> jeśli chcesz */}
      <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Wszystkie przedmioty
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Nazwa
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Opis
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Kategoria
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Lokalizacja
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Status
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-gray-800">
                    Data znalezienia
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.description || "Brak opisu"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.category}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.location_found || "Brak danych"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.status}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {item.date_found
                        ? new Date(item.date_found).toLocaleDateString()
                        : "Brak danych"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllItems;
