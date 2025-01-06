import React, { useState } from "react";
import { Item } from "../types/type";

interface ClaimFormProps {
  item: Item;
  onClose: () => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ item, onClose }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/ownership-claims", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                item_id: item.id,
                description,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("API Error:", data);
            throw new Error(data.error || "Failed to submit ownership claim.");
        }

        alert("Claim submitted successfully!");
        onClose();
    } catch (err: unknown) {
      console.error("Error submitting claim:", err);
  
      if (err instanceof Error) {
          alert(err.message);
      } else {
          alert("An unexpected error occurred.");
      }
  }
};

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Zgłoś roszczenie</h2>
        <p className="text-gray-600 mb-4">
          Przedmiot: <strong>{item.name}</strong>
        </p>
        <textarea
          placeholder="Opisz cechy przedmiotu..."
          className="w-full border border-gray-300 rounded p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Wyślij
          </button>
          <button onClick={onClose} className="text-gray-500 hover:underline">
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimForm;
