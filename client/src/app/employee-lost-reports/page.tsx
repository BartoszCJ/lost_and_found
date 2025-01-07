/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

interface LostReport {
  id: number;
  name: string;
  description: string;
  location_lost: string;
  date_lost: string;
  date_reported: string;
  status: "Oczekuje" | "Zaakceptowane" | "Odrzucone";
  item_id: number | null;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface LostReportsResponse {
  data: LostReport[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface Item {
  id: number;
  name: string;
  description: string;
  status: string;
}

const EmployeeLostReports: React.FC = () => {
  const [reports, setReports] = useState<LostReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LostReport | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Oczekuje" | "Zaakceptowane" | "Odrzucone"
  >("all");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Brak tokena!");

      const limit = 5;
      const statusParam =
        statusFilter !== "all" ? `status=${statusFilter}` : "";
      const url = `http://localhost:3001/api/lost-reports?${statusParam}&page=${page}&limit=${limit}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Błąd podczas pobierania zgłoszeń.");
      }
      const result: LostReportsResponse = await res.json();
      setReports(result.data);
      setPage(result.currentPage);
      setTotalPages(result.totalPages);

      const itemsRes = await fetch("http://localhost:3001/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!itemsRes.ok) {
        throw new Error("Błąd podczas pobierania przedmiotów.");
      }
      const itemsData: Item[] = await itemsRes.json();
      setAllItems(itemsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const getStatusColorClass = (status: LostReport["status"]) => {
    switch (status) {
      case "Oczekuje":
        return "text-yellow-600";
      case "Zaakceptowane":
        return "text-green-600";
      case "Odrzucone":
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };

  const handleSelectReport = (report: LostReport) => {
    setSelectedReport(report);
    setSelectedItem(null);
  };

  const filteredItems = allItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => item.status !== "Przypisany");

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleFilterChange = (
    newFilter: "all" | "Oczekuje" | "Zaakceptowane" | "Odrzucone"
  ) => {
    setStatusFilter(newFilter);
    setPage(1);
    setSelectedReport(null);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setSelectedReport(null);
    }
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setSelectedReport(null);
    }
  };

  const handleRejectReport = async () => {
    if (!selectedReport) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/lost-reports/${selectedReport.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Odrzucone" }),
        }
      );
      if (!res.ok) {
        throw new Error("Nie udało się odrzucić zgłoszenia.");
      }
      alert("Zgłoszenie zostało odrzucone.");
      fetchReports();
      setSelectedReport(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolveAndAssign = async () => {
    if (!selectedReport) {
      alert("Najpierw wybierz zgłoszenie");
      return;
    }
    if (!selectedItem) {
      alert("Najpierw wybierz przedmiot z listy");
      return;
    }
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
          body: JSON.stringify({ itemId: selectedItem.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Błąd przypisywania przedmiotu do zgłoszenia.");
      }
      alert("Zgłoszenie zostało zatwierdzone i przedmiot przypisany.");
      fetchReports();
      setSelectedReport(null);
      setSelectedItem(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 flex gap-4">
      <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-6">Zgłoszenia zagubienia</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded ${
              statusFilter === "all" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => handleFilterChange("Oczekuje")}
            className={`px-3 py-1 rounded ${
              statusFilter === "Oczekuje"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Oczekujące
          </button>
          <button
            onClick={() => handleFilterChange("Zaakceptowane")}
            className={`px-3 py-1 rounded ${
              statusFilter === "Zaakceptowane"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Zaakceptowane
          </button>
          <button
            onClick={() => handleFilterChange("Odrzucone")}
            className={`px-3 py-1 rounded ${
              statusFilter === "Odrzucone"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Odrzucone
          </button>
        </div>

        {reports.length === 0 ? (
          <p>Brak zgłoszeń w tej kategorii.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li
                key={report.id}
                onClick={() => handleSelectReport(report)}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedReport?.id === report.id ? "bg-green-50" : "bg-white"
                }`}
              >
                <p>
                  <strong>ID:</strong> {report.id}
                </p>
                <p>
                  <strong>Nazwa:</strong> {report.name}
                </p>
                <p className={getStatusColorClass(report.status)}>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>User:</strong> {report.user.email}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
          >
            Poprzednia
          </button>
          <span>
            Strona {page} z {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
          >
            Następna
          </button>
        </div>
      </div>

      <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
        {selectedReport ? (
          <>
            <h2 className="text-xl font-bold mb-2">
              Zgłoszenie #{selectedReport.id}
            </h2>
            <p className={getStatusColorClass(selectedReport.status)}>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            <p>
              <strong>Nazwa:</strong> {selectedReport.name}
            </p>
            <p>
              <strong>Opis:</strong> {selectedReport.description}
            </p>
            <p>
              <strong>Gdzie zgubiono:</strong> {selectedReport.location_lost}
            </p>
            <p>
              <strong>Data zagubienia:</strong>{" "}
              {new Date(selectedReport.date_lost).toLocaleDateString()}
            </p>
            <p>
              <strong>Data zgłoszenia:</strong>{" "}
              {new Date(selectedReport.date_reported).toLocaleDateString()}
            </p>
            <p>
              <strong>Użytkownik:</strong> {selectedReport.user.email}
            </p>
            {selectedReport.item ? (
              <div className="mt-4 p-4 bg-gray-50 border rounded">
                <h4 className="font-semibold mb-2">Przypisany przedmiot:</h4>
                <p>
                  <strong>Nazwa:</strong> {selectedReport.item.name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedReport.item.status}
                </p>
                <p>
                  <strong>Opis:</strong> {selectedReport.item.description}
                </p>
              </div>
            ) : (
              <p className="mt-4">Brak przypisanego przedmiotu.</p>
            )}
            {selectedReport.status === "Oczekuje" && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleRejectReport}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Odrzuć
                </button>{" "}
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleResolveAndAssign}
                >
                  Zatwierdź (przypisz wybrany przedmiot)
                </button>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Wybierz przedmiot z listy
              </h3>
              <input
                type="text"
                placeholder="Wpisz nazwę przedmiotu..."
                className="border p-2 w-full mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredItems.length === 0 ? (
                <p>Brak wyników wyszukiwania.</p>
              ) : (
                <ul className="max-h-48 overflow-y-auto space-y-2">
                  {filteredItems.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-2 border rounded cursor-pointer flex justify-between 
                        ${
                          selectedItem?.id === item.id
                            ? "bg-blue-50 border-blue-300"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <div>
                        <strong>{item.name}</strong> ({item.status})
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p>Wybierz zgłoszenie z lewej listy, aby zobaczyć szczegóły.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeLostReports;
