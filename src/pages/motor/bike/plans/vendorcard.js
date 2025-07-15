"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import constant from "@/env";

export default function VendorCard({ data, onAddonsClick }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPremiumData, setSelectedPremiumData] = useState([]);
  const router = useRouter();
  const handlePremium = () => {
    const premium = data.premiumBackup || {};
    const premiumArray = Object.entries(premium).map(([key, value]) => ({
      label: key,
      amount: value,
    }));
    setSelectedPremiumData(premiumArray);
    setShowModal(true);
  };

  return (
    <>
      {/* Card */}
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
            <span className="text-black font-semibold">
              ₹ {data.idv?.toLocaleString() || "-"}
            </span>
          </p>

          <div className="flex items-center justify-center bg-gray-100 w-[140px] rounded py-1 shadow">
            <button
              className="text-center"
              type="button"
              onClick={() => router.push(constant.ROUTES.MOTOR.BIKE.SHRIRAM.SHRIRAMJOURNEY)}
            >
              <p className="font-medium text-sm">Buy Now</p>
              <p className="font-semibold text-sm">
                ₹ {data.price?.toLocaleString() || "-"}
              </p>
            </button>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={() => onAddonsClick(data)}
              className="text-blue-500 text-sm hover:underline"
            >
              Addons
            </button>
            <button
              onClick={handlePremium}
              className="text-blue-500 text-sm hover:underline"
            >
              Premium Backup
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Premium Backup */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-800">
                Premium Backup
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {selectedPremiumData?.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {selectedPremiumData.map((item, index) => (
                  <li key={index} className="text-sm border-b pb-2">
                    <strong>{item.label}</strong>: ₹{" "}
                    {item.amount?.toLocaleString() || "-"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                No premium backup data found.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
