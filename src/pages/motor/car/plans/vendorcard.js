"use client";
import React from "react";

export default function VendorCard({ data, onAddonsClick }) {
  return (
    <div className="w-full sm:w-[320px] h-80 rounded-md bg-white shadow-md p-4">
      <div className="flex flex-col items-center gap-4 h-full justify-between">
        <h2 className="text-blue-800 font-medium text-center capitalize">
          {data.title || "Unknown Vendor"}
        </h2>

        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shadow">
          {data.logo && (
            <img
              src={`/images/${data.logo}`}
              alt={data.title}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <p className="text-gray-500 text-sm">
          Cover value (IDV):{" "}
          <span className="text-black font-semibold">₹ {data.idv?.toLocaleString() || "-"}</span>
        </p>

        <div className="flex items-center justify-center bg-gray-100 w-[140px] rounded py-1 shadow">
          <div className="text-center">
            <p className="font-medium text-sm">Buy Now</p>
            <p className="font-semibold text-sm">₹ {data.premium?.toLocaleString() || "-"}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <button onClick={onAddonsClick} className="text-blue-500 text-sm hover:underline">
            Addons
          </button>
          <button className="text-blue-500 text-sm hover:underline">
            Premium Backup
          </button>
        </div>
      </div>
    </div>
  );
}
