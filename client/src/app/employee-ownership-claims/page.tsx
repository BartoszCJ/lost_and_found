"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";

// Przykładowy interfejs roszczenia
interface OwnershipClaim {
  id: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  date_submitted: string;
  item: {
    id: number;
    name: string;
    description: string | null;
    category: string;
    location_found: string | null;
    date_found: string | null;
    status: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
  };
}

const EmployeeOwnershipClaims = () => {
  // ------- Kluczowe: definiujemy stany ------
  const [claims, setClaims] = useState<OwnershipClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<OwnershipClaim | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Paginacja i filtrowanie
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  // Informacje zwrotne z serwera
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Definiujemy funkcję fetchClaims
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/ownership-claims?page=${page}&limit=${limit}&status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Błąd pobierania roszczeń");
      }

      const result = await res.json(); // { data, currentPage, totalPages, ... }
      setClaims(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wywołujemy fetch w useEffect przy zmianie page, limit, statusFilter
  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter]);

  // Funkcja do aktualizacji statusu roszczenia
  const handleStatusChange = async (
    claim: OwnershipClaim,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/ownership-claims/${claim.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Błąd podczas aktualizacji roszczenia.");
      }

      // Odśwież listę (lub zaktualizuj stan lokalnie)
      fetchClaims();

      // Ewentualnie, jeśli chcemy na żywo podmienić status zaznaczonego roszczenia:
      if (selectedClaim && selectedClaim.id === claim.id) {
        setSelectedClaim({ ...selectedClaim, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectClaim = (claim: OwnershipClaim) => {
    setSelectedClaim(claim);
  };

  if (loading) return <p>Ładowanie roszczeń własności...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Roszczenia własności
      </h1>

      {/* Dwukolumnowy układ */}
      <div className="flex gap-4">
        {/* LEFT COLUMN: Lista roszczeń */}
        <div className="w-1/2 bg-white shadow-md rounded-lg p-4 h-[70vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Lista roszczeń:</h2>
          {claims.length === 0 ? (
            <p>Brak roszczeń.</p>
          ) : (
            <ul className="space-y-2">
              {claims.map((claim) => (
                <li
                  key={claim.id}
                  onClick={() => handleSelectClaim(claim)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedClaim?.id === claim.id
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <p className="font-bold">
                    #{claim.id} — {claim.item?.name || "Brak nazwy"}
                  </p>
                  <p className="text-sm">
                    Użytkownik: {claim.user?.email || "Brak info"}
                  </p>
                  <p
                    className={`text-sm ${
                      claim.status === "approved"
                        ? "text-green-600"
                        : claim.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {claim.status}
                  </p>
                </li>
              ))}
            </ul>
          )}{" "}
          <div className="flex items-center gap-2 mt-5">
            <CustomButton
              onClick={() => setStatusFilter("pending")}
              title="Oczekujące"
              className="w-auto px-4 py-2"
            />
            <CustomButton
              onClick={() => setStatusFilter("all")}
              title="Wszystkie"
              className="w-auto px-4 py-2"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Szczegóły roszczenia + przedmiot */}
        <div className="w-1/2 bg-white shadow-md rounded-lg p-4 h-[70vh] overflow-y-auto">
          {selectedClaim ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Szczegóły roszczenia #{selectedClaim.id}
              </h2>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    selectedClaim.status === "approved"
                      ? "text-green-600"
                      : selectedClaim.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {selectedClaim.status}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Zgłaszający:</span>{" "}
                {selectedClaim.user?.name || "Brak imienia"} (
                {selectedClaim.user?.email})
              </p>
              <p className="mb-2">
                <span className="font-semibold">Opis roszczenia:</span>{" "}
                {selectedClaim.description}
              </p>

              <div className="my-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Przedmiot:</h3>
                <p className="mb-1">
                  <span className="font-semibold">Nazwa:</span>{" "}
                  {selectedClaim.item?.name || "Brak nazwy"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Kategoria:</span>{" "}
                  {selectedClaim.item?.category}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Opis:</span>{" "}
                  {selectedClaim.item?.description || "Brak opisu"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Lokalizacja znaleziona:</span>{" "}
                  {selectedClaim.item?.location_found || "Brak informacji"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Data znalezienia:</span>{" "}
                  {selectedClaim.item?.date_found
                    ? new Date(
                        selectedClaim.item.date_found
                      ).toLocaleDateString()
                    : "Brak daty"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Status przedmiotu:</span>{" "}
                  {selectedClaim.item?.status}
                </p>
              </div>

              {/* Przyciski do akceptacji/odrzucenia */}
              {selectedClaim.status === "pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() =>
                      handleStatusChange(selectedClaim, "approved")
                    }
                  >
                    Zatwierdź
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      handleStatusChange(selectedClaim, "rejected")
                    }
                  >
                    Odrzuć
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Wybierz roszczenie z lewej listy, aby zobaczyć szczegóły.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Poprzednia
        </button>
        <span>
          Strona {currentPage} z {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Następna
        </button>
      </div>
    </div>
  );
};

export default EmployeeOwnershipClaims;
