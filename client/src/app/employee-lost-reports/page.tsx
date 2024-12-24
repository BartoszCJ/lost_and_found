"use client";
import React, { useEffect, useState } from "react";

interface LostReport {
  id: number;
  name: string;
  description: string;
  status: string; // "pending", "resolved", "rejected", ...
  item_id: number | null;
  item?: {
    id: number;
    name: string;
    status: string;
  } | null;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Możesz też mieć typ Items
interface Item {
  id: number;
  name: string;
  status: string;
}

const EmployeeLostReports = () => {
  const [reports, setReports] = useState<LostReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LostReport | null>(null);

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // a) Pobierz lost-reports
      const reportsRes = await fetch("http://localhost:3001/api/lost-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!reportsRes.ok) {
        throw new Error("Błąd pobierania zgłoszeń.");
      }
      const reportsData = await reportsRes.json();

      // b) Pobierz listę itemów, np. TYLKO te, które mają status "found"
      //    albo WSZYSTKIE - zależy, co chcesz w selekcie.
      const itemsRes = await fetch("http://localhost:3001/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!itemsRes.ok) {
        throw new Error("Błąd pobierania przedmiotów.");
      }
      const itemsData = await itemsRes.json();

      setReports(reportsData);
      setAllItems(itemsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2) Kliknięcie w wybrane zgłoszenie
  const handleSelectReport = (report: LostReport) => {
    setSelectedReport(report);
    setSelectedItemId(report.item_id || null);
  };

  // 3) Obsługa przypisania itemu do raportu
  const handleAssignItem = async () => {
    if (!selectedReport || !selectedItemId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/lost-reports/${selectedReport.id}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: selectedItemId }),
        }
      );
      if (!response.ok) {
        throw new Error("Błąd podczas przypisywania przedmiotu.");
      }

      // Odśwież listę zgłoszeń
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Ładowanie zgłoszeń...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto flex gap-4 mt-10">
      {/* Lista zgłoszeń po lewej */}
      <div className="w-1/2 bg-white shadow p-4">
        <h2 className="text-lg font-bold">Zgłoszenia zagubienia</h2>
        <ul>
          {reports.map((report) => (
            <li
              key={report.id}
              onClick={() => handleSelectReport(report)}
              className={`p-2 my-2 cursor-pointer border ${
                selectedReport?.id === report.id ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <p>
                <strong>ID:</strong> {report.id}, <strong>User ID:</strong>{" "}
                {report.user_id}
              </p>
              <p>
                <strong>Data zgłoszenia:</strong>{" "}
                {formatDate(report.date_reported)}
              </p>
              <p>
                <strong>Data zgubienia:</strong> {formatDate(report.date_lost)}
              </p>
              <p>
                <strong>Nazwa:</strong> {report.name || "Brak nazwy"}
              </p>
              <p>
                <strong>Opis przedmiotu:</strong> {report.description}
              </p>
              <p>
                <strong>Lokalizacja zgubienia:</strong> {report.location_lost}
              </p>
              <p>
                <strong>Status:</strong> {report.status}
              </p>
              <p>
                <strong>Użytkownik:</strong> {report.user?.email}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Szczegóły raportu i przypisywanie itemu */}
      <div className="w-1/2 bg-white shadow p-4">
        {selectedReport ? (
          <>
            <h2 className="text-lg font-bold mb-2">
              Szczegóły zgłoszenia #{selectedReport.id}
            </h2>
            <p>
              <strong>Opis:</strong> {selectedReport.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            <p>
              <strong>Data zgłoszenia:</strong> {selectedReport._reported}
            </p>
            <p>
              <strong>Aktualnie przypisany przedmiot:</strong>{" "}
              {selectedReport.item ? selectedReport.item.name : "Brak (null)"}
            </p>
            {/* Select z listą wszystkich itemów - możesz przefiltrować 
                jeśli chcesz pokazywać tylko te o statusie "found" itp. */}
            <div className="mt-4">
              <label htmlFor="selectItem" className="block font-semibold mb-2">
                Wybierz przedmiot do przypisania:
              </label>
              <select
                id="selectItem"
                className="border p-2 w-full"
                value={selectedItemId ?? ""}
                onChange={(e) => setSelectedItemId(Number(e.target.value))}
              >
                <option value="">-- Wybierz przedmiot --</option>
                {allItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (status: {item.status})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
              onClick={handleAssignItem}
            >
              Przypisz
            </button>
          </>
        ) : (
          <p>Wybierz zgłoszenie z lewej listy</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeLostReports;
