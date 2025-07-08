"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";

import PaCoverModal from "./pacovermodal";
import AddonModal from "./addonmodal";
import UpdateIdvModal from "./updateIdvmodal";
import VendorCard from "./vendorcard";
import CarDetailsCard from "./cardetailscard";

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [addonModalOpen, setIsAddonModalOpen] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [value, setValue] = useState(100);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showAccessories, setShowAccessories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planTypes, setPlanTypes] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedAddon, setSelectedAddon] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [vendorPlans, setVendorPlans] = useState([]);
  const [addAddonModal, setAddAddonModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await CallApi(constant.API.MOTOR.CAR.PLANS, "GET");
        console.log(res)
        const addonObj = res.data?.addons || {};
        const addonList = Object.entries(addonObj).map(([key, label]) => ({
          id: key,
          label: label.trim(),
        }));
        setAddons(addonList);

        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(([key, label]) => ({
          id: key,
          label,
        }));
        setPlanTypes(plantypeList);

        const vendorArr = res.data?.vendor || [];
        setVendorList(vendorArr.filter((v) => v.isActive === "1"));
      } catch (error) {
        console.error("Error loading plan data:", error);
      }
    }
    getDetails();
  }, []);

useEffect(() => {
  async function getQuote() {
    if (!vendorList.length) return;
    try {
      const allPlans = [];

      for (let i = 0; i < vendorList.length; i++) {
        const payload = vendorList[i];
        const response = await CallApi(constant.API.MOTOR.CAR.QUOTE, "POST", payload);
        console.log(response)
        if (response?.status == "1" && response?.data) {
          allPlans.push({
            ...response.data,
            vendorId: payload.vid, // associate response with vendor
          });
        }
      }

      setVendorPlans(allPlans); 
      console.log("All vendor plans:", allPlans);
    } catch (error) {
      console.error("Error loading quote:", error);
    }
  }

  getQuote();
}, [vendorList]);


  const handleAddonChange = (id) => {
    setSelectedAddon((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveAddons = async () => {
    try {
      const payload = { selectedaddons: selectedAddon };
      const res = await CallApi(constant.API.MOTOR.CAR.ADDADDONS, "POST", payload);
      console.log("Saved successfully:", res);
    } catch (error) {
      console.error("Failed to save addons:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6">
      {/* Go Back */}
      <div className="mb-1">
        <button
          className="text-sm"
          onClick={() => router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTHREE)}
        >
          ← Go back to Previous
        </button>
      </div>

      {/* Form Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full bg-white p-4 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
            {/* Plan Type */}
            <div className="flex flex-col">
              <label className="font-semibold">Plan Type</label>
              <select className="border rounded p-2 mt-1 w-40">
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PA Cover */}
            <div
              className="flex items-center space-x-3 mt-6 md:mt-8 bg-[#D8E0FF] p-3 rounded cursor-pointer"
              onClick={() => setIsPaModalOpen(true)}
            >
              <input type="checkbox" id="pa-cover" className="w-4 h-4" />
              <label htmlFor="pa-cover" className="text-sm">PA Cover</label>
              <span className="text-gray-400 text-xs cursor-pointer">ℹ️</span>
            </div>

            {/* IDV */}
            <div className="flex items-center gap-2 mt-6 md:mt-8">
              <label className="font-semibold">IDV:</label>
              <input type="text" className="border rounded px-2 py-1 w-24 focus:outline-blue-600" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 md:mt-8">
              <button
                style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
                className="text-white px-4 py-2 rounded"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Update
              </button>
              <button
                style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
                className="text-white px-4 py-2 rounded"
                onClick={() => setIsAddonModalOpen(true)}
              >
                Addons
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaCoverModal open={paModalOpen} onClose={() => setIsPaModalOpen(false)} />
      <UpdateIdvModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        value={value}
        setValue={setValue}
      />
      <AddonModal
        open={addonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addons={addons}
        selectedAddon={selectedAddon}
        handleAddonChange={handleAddonChange}
        handleSaveAddons={handleSaveAddons}
        showAccessories={showAccessories}
        setShowAccessories={setShowAccessories}
      />

      {/* Details Section */}
      <div className="flex flex-col gap-2 md:flex-row mt-4">
        {/* Vendor Cards */}
       <div className="w-full lg:w-3/4 flex flex-wrap gap-6 justify-start lg:ml-16">
                {vendorPlans.map((plan) => (
                    <VendorCard
                    key={plan.vendorId}
                    data={plan} 
                    onAddonsClick={() => setAddAddonModal(true)}
                    />
                ))}
                </div>


        {/* Sidebar */}
        <CarDetailsCard />
      </div>

      {/* Bottom Popup for Addons View */}
      {addAddonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={() => setAddAddonModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Selected Addons</h3>
            {selectedAddon.length === 0 ? (
              <p className="text-sm text-gray-600">No addons selected.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 max-h-52 overflow-auto">
                {addons
                  .filter((a) => selectedAddon.includes(a.id))
                  .map((addon) => (
                    <li key={addon.id}>{addon.label}</li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}