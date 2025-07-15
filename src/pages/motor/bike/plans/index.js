"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";
import PaCoverModal from "./pacovermodal";
import AddonModal from "./addonmodal";
import UpdateIdvModal from "./updateIdvmodal";
import VendorCard from "./vendorcard";
import BikeDetailsCard from "./bikedetailscard";
import VehicleCard from '../../vehicledetails/index'

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showAccessories, setShowAccessories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planTypes, setPlanTypes] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedAddon, setSelectedAddon] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [vendorPlans, setVendorPlans] = useState([]);
  const [addAddonModal, setAddAddonModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [premiumBackupData, setPremiumBackupData] = useState(null);
  const [idvMin, setIdvMin] = useState(null);
  const [idvMax, setIdvMax] = useState(null);
  const [selectedIdv, setSelectedIdv] = useState(null);
  const [paCoverChecked, setPaCoverChecked] = useState(false);
 const [vehicleDetails, setVehicleDetails] = useState([]);
  const [idv,setIdv] = useState();
  const [motortype, setMotorType] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await CallApi(constant.API.MOTOR.BIKE.PLANS, "GET");
        console.log(res)
        const addonObj = res.data?.addons || {};
        const addonList = Object.entries(addonObj).map(([key, label]) => ({
          id: key,
          label: label.trim(),
        }));
        setAddons(addonList);

        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(
          ([key, label]) => ({ id: key, label })
        );
        setPlanTypes(plantypeList);

        const vendorArr = res.data?.vendor || [];
        const activeVendors = vendorArr.filter((v) => v.isActive === "1");
        setVendorList(activeVendors);

        const vehicleDetails = res.data?.vehicledetails || [];
        setVehicleDetails(vehicleDetails);
        const paCover = res.data?.pacover;
         if(paCover == "1"){
            setPaCoverChecked(paCover);
         }
        const selectaddon = res.data?.selectedaddons || [];
        setSelectedAddon(selectaddon);
        setMotorType(res.cache);

        console.log(selectaddon);
       
      } catch (error) {
        console.error("Error loading plan data:", error);
      }
    }
    getDetails();
  }, []);

  const getQuote = async () => {
    if (!vendorList.length) return;
    try {
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const payload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.BIKE.QUOTE,
          "POST",
          payload
        );
        if (response?.status == "1" && response?.data) {
          if (allPlans.length === 0) {
            const data = response.data;
            setIdvMin(data.minrange);
            setIdvMax(data.maxrange);
            setIdv(data.idv);
            setSelectedIdv(data.selectedvalue);
          }

          allPlans.push({ ...response.data, vendorId: payload.vid });
        }
      }
      setVendorPlans(allPlans);
      console.log(vendorPlans);
      
    } catch (error) {
      console.error("Error loading quote:", error);
    }
  };

  useEffect(() => {
    getQuote();
  }, [vendorList]);

  const handleIdvUpdate = async () => {
    try {
      console.log(selectedIdv);
      const response = await CallApi(
        constant.API.MOTOR.BIKE.UPDATEIDV,
        "POST",
        selectedIdv
      );
      console.log(response);
      if (response.status ) {
        setIsUpdateModalOpen(false);
        await getQuote();
      } else {
        alert("Failed to update IDV");
      }
    } catch (error) {
      console.error("Error updating IDV:", error);
      alert("An error occurred while updating IDV.");
    }
  };

  const handleAddonChange = (id) => {
    setSelectedAddon((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveAddons = async () => {
    try {
      
      const res = await CallApi(
        constant.API.MOTOR.BIKE.ADDADDONS,
        "POST",
        selectedAddon
      );
      console.log("Saved successfully:", res);
      if(res.status){
      await getCacheQuote();
      setIsAddonModalOpen(false);
      }
     else {
        console.error("Addon update failed:", res);
      }
    } catch (error) {
      console.error("Failed to save addons:", error);
    }
  };

  const handlePlanTypeChange = async (e) => {
    const newPlanType = e.target.value;
    setSelectedPlanType(newPlanType);

    try {
      await CallApi(constant.API.MOTOR.BIKE.CHANGEPLAN, "POST", {
        pacover: paCoverChecked ? "1" : "0",
        planetype: newPlanType,
      });

      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.BIKE.GETCACHEQUOTE,
          "POST",
          vendorPayload
        );
        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
        }
      }
      setVendorPlans(allPlans);
    } catch (error) {
      console.error("Plan type change failed:", error);
    }
  };

   const getCacheQuote = async () => {
    try {
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.BIKE.GETCACHEQUOTE,
          "POST",
          vendorPayload
        );
        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
        }
      }
      setVendorPlans(allPlans);
    } catch (error) {
      console.error("Plan type change failed:", error);
    }
  };

  const handlePaCoverSave = async ({ payload, checked }) => {
    setPaCoverChecked(checked);

    try {
      if (checked) {
        await CallApi(constant.API.MOTOR.BIKE.CHANGEPLAN, "POST", {
          pacover: "1",
          planetype: selectedPlanType,
        });
      } else {
        await CallApi(constant.API.MOTOR.BIKE.PACOVERREASON, "POST", payload);
      }
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.BIKE.GETCACHEQUOTE,
          "POST",
          vendorPayload
        );
        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
        }
      }
      setVendorPlans(allPlans);
      
    } catch (error) {
      console.error("Error updating PA Cover:", error);
    }
  };

  const handleSaveAccessories = async (accessoriesPayload) => {
    try {
      const res = await CallApi(constant.API.MOTOR.BIKE.ACCESSORIES, "POST",accessoriesPayload);

      if (res.status === "1" || res.status === true) {
        console.log("Accessories saved successfully:", res);
     
        await getCacheQuote(); 
      } else {
        console.error("Accessories update failed:", res);
      }
    } catch (err) {
      console.error("Error while saving accessories:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6">
      <div className="mb-1">
        <button
          className="text-sm"
          onClick={() => router.push(constant.ROUTES.MOTOR.BIKE.KNOWBIKESTEPTHREE)}
        >
          ← Go back to Previous
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full bg-white p-4 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
            <div className="flex flex-col">
              <label className="font-semibold">Plan Type</label>
              <select
                className="border rounded p-2 mt-1 w-40"
                value={selectedPlanType}
                onChange={handlePlanTypeChange}
              >
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="flex items-center space-x-3 mt-6 md:mt-8 bg-[#D8E0FF] p-3 rounded cursor-pointer"
              onClick={() => setIsPaModalOpen(true)}
            >
              <input
                type="checkbox"
                id="pa-cover"
                className="w-4 h-4"
                checked={paCoverChecked}
              />
              <label htmlFor="pa-cover" className="text-sm">
                PA Cover
              </label>
              <span className="text-gray-400 text-xs cursor-pointer">ℹ️</span>
            </div>

            <div className="flex items-center gap-2 mt-6 md:mt-8">
              <label className="font-semibold">IDV:</label>
              <input
                type="text"
                value={idv}
                className="border rounded px-2 py-1 w-24 focus:outline-blue-600"
              />
            </div>

            <div className="flex gap-3 mt-6 md:mt-8">
              <button
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
                className="text-white px-4 py-2 rounded"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Update
              </button>
              <button
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
                className="text-white px-4 py-2 rounded"
                onClick={() => setIsAddonModalOpen(true)}
              >
                Addons
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaCoverModal
        open={paModalOpen}
        onClose={() => setIsPaModalOpen(false)}
        setPaCoverChecked={setPaCoverChecked}
        onSave={handlePaCoverSave}
      />

      <UpdateIdvModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        value={selectedIdv}
        setValue={setSelectedIdv}
        min={idvMin}
        max={idvMax}
        onUpdate={handleIdvUpdate}
      />

      <AddonModal
        open={IsAddonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addons={addons}
        selectedAddon={selectedAddon}
        handleAddonChange={handleAddonChange}
        handleSaveAddons={handleSaveAddons}
        showAccessories={showAccessories}
        setShowAccessories={setShowAccessories}
        onSaveAccessories={handleSaveAccessories} 
      />

      <div className="flex flex-col gap-2 md:flex-row mt-4">
        <div className="w-full lg:w-3/4 flex flex-wrap gap-6 justify-start lg:ml-16">
          {vendorPlans.map((plan) => (
            <VendorCard
              key={plan.vendorId}
              data={plan}
              onAddonsClick={(vendorData) => {
                setSelectedPlan(vendorData);
                setAddAddonModal(true);
                console.log(vendorData);
              }}
              onPremiumClick={premiumBackupData}
            />
          ))}
        </div>
        {(motortype === "knowbike" || motortype === "newbike") && (
               <VehicleCard
                 vehicleDetails={vehicleDetails}
                 title={motortype === "knowbike" ? "Private Bike" : "New Bike"}
                 icon={<FaCar className="text-blue-600 text-xl" />}
               />
             )}
      </div>

      {addAddonModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={() => {
                setAddAddonModal(false);
                setSelectedPlan(null);
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Vendor Addons</h3>

            {selectedPlan.addons &&
            Object.keys(selectedPlan.addons).length > 0 ? (
             
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 max-h-52 overflow-auto">
                {Object.entries(selectedPlan.addons).map(([addonId, price]) => (
                  <li key={addonId} >
                    <strong>Addon {addonId}</strong>: ₹ {price}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                No addons available for this plan.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
