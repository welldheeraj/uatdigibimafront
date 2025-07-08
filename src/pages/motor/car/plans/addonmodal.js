"use client";
import React from "react";
import { Modal } from "@mui/material";

export default function AddonModal({
  open,
  onClose,
  activeTab,
  setActiveTab,
  addons,
  selectedAddon,
  handleAddonChange,
  handleSaveAddons,
  showAccessories,
  setShowAccessories,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] max-w-full">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Add Addons</h2>
            <button onClick={onClose} className="text-3xl">×</button>
          </div>
          <div className="w-full mx-auto mt-1">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeTab === "Tab1" ? "border-b-2 border-blue-500 text-blue-600" : "text-blue-400"}`}
                onClick={() => setActiveTab("Tab1")}
              >
                Addons
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "Tab2" ? "border-b-2 border-blue-500 text-blue-600" : "text-blue-400"}`}
                onClick={() => setActiveTab("Tab2")}
              >
                Accessories
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "Tab1" && (
                <div className="p-2">
                  <p className="mb-4 text-gray-600">Select the addons you'd like to add.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {addons.map((addon) => (
                      <div key={addon.id} className="bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center p-2 rounded-md border">
                        <input
                          type="checkbox"
                          checked={selectedAddon.includes(addon.id)}
                          onChange={() => handleAddonChange(addon.id)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium truncate">{addon.label}</label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      onClick={handleSaveAddons}
                      className="py-2 px-8 text-white font-semibold rounded"
                      style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Tab2" && (
                <div className="p-2">
                  <p className="mb-4 text-gray-600">Choose Your Additional Accessories</p>
                  <label className="inline-flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={showAccessories}
                      onChange={(e) => setShowAccessories(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="font-medium text-blue-600">Additional Accessories</span>
                  </label>

                  {showAccessories && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {["Electrical", "Non-Electrical", "LPG/CNG"].map((type) => (
                        <div key={type} className="bg-blue-50 p-2 rounded-md flex items-center border">
                          <input type="checkbox" className="mr-2" id={type} />
                          <label htmlFor={type} className="text-sm font-medium">{type}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-center">
                    <button
                      className="py-2 px-8 text-white font-semibold rounded"
                      style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
