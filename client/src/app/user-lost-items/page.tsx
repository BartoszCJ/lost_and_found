"use client";

import React, { useEffect, useState } from "react";

interface Report {
  id: number;
  name: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  date_found: string | null;
}

const useFetchReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Brak tokena");

        const response = await fetch(
          "http://localhost:3001/api/lost-reports/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Błąd podczas pobierania zgłoszeń.");

        const data = await response.json();
        setReports(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error };
};

const UserLostReports = () => {
  const { reports, loading, error } = useFetchReports();

  if (loading) {
    return <p>Ładowanie zgłoszeń...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (reports.length === 0) {
    return <p>Nie masz jeszcze żadnych zgłoszeń.</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Twoje zgłoszenia</h1>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li
            key={report.id}
            className="p-4 border rounded bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {report.name || "Brak nazwy"}
              </h2>
              <span
                className={`px-3 py-1 text-sm rounded ${
                  report.status === "resolved"
                    ? "bg-green-200 text-green-800"
                    : report.status === "rejected"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {report.status === "pending"
                  ? "W trakcie"
                  : report.status === "resolved"
                  ? "Zatwierdzone"
                  : "Odrzucone"}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              {report.description || "Brak opisu"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Data zgubienia:{" "}
              {report.date_found
                ? new Date(report.date_found).toLocaleDateString()
                : "Nie podano daty"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserLostReports;
