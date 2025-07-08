"use client";
import React from "react";

export default function CarDetailsCard() {
  const carDetails = [
    { label: "RTO City", value: "Indore" },
    { label: "Manufacturer", value: "DATSUN" },
    { label: "Model", value: "GO PLUS A" },
    { label: "Variant", value: "GO PLUS A" },
    { label: "Registration Year", value: "2024" },
    { label: "Policy Expiry", value: "Not Expired" },
  ];

  return (
    <div className="w-full lg:w-1/4 bg-white shadow-lg border p-4 rounded-xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Private Car</h2>
      <div className="text-sm space-y-2">
        {carDetails.map(({ label, value }, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-gray-200 p-2"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700 font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
