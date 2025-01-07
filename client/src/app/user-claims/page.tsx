"use client";

import React, { useEffect, useState } from "react";

interface Claim {
  id: number;
  description: string;
  status: "Oczekuje" | "Zaakceptowane" | "Odrzucone";
  item: { name: string };
}

const MyClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/ownership-claims/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch claims.");
        }

        const data = await response.json();
        setClaims(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    };

    fetchClaims();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Twoje roszczenia</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">
              Przedmiot: {claim.item.name}
            </h2>
            <p className="text-gray-700">Opis: {claim.description}</p>
            <p
              className={`font-medium ${
                claim.status === "Zaakceptowane"
                  ? "text-green-500"
                  : claim.status === "Odrzucone"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              Status:{" "}
              {claim.status === "Oczekuje"
                ? "W trakcie weryfikacji"
                : claim.status === "Zaakceptowane"
                ? "Zatwierdzone"
                : "Odrzucone"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClaims;
