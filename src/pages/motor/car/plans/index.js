"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";
import { FaChevronLeft,FaCar ,FaInfoCircle  } from "react-icons/fa";
import PaCoverModal from "./pacovermodal";
import AddonModal, {VendorAddonModal} from "./addonmodal";
import UpdateIdvModal from "./updateIdvmodal";
import VendorCard from "./vendorcard";
import VehicleCard from '../../vehicledetails/index'
import { MotorCardSkeleton } from "@/components/loader";
console.log("MotorCardSkeleton:", MotorCardSkeleton); 

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showAccessories, setShowAccessories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planTypes, setPlanTypes] = useState([]);
   const [fullAddonsName, setFullAddonsName] = useState({});
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
        const res = await CallApi(constant.API.MOTOR.CAR.PLANS, "GET");
        const addonObj = res.data?.addons || {};
        const addonList = Object.entries(addonObj).map(([key, label]) => ({
          id: key,
          label: label.trim(),
        }));
        console.log("plandata",res);
        setAddons(addonList);

        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(
          ([key, label]) => ({ id: key, label })
        );
        setPlanTypes(plantypeList);

        const vendorArr = res.data?.vendor || [];
         setFullAddonsName(res.data?.addons || {});

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
          constant.API.MOTOR.CAR.QUOTE,
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
      const response = await CallApi(
        constant.API.MOTOR.CAR.UPDATEIDV,
        "POST",
        selectedIdv
      );
      if (response.status === "1") {
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
        constant.API.MOTOR.CAR.ADDADDONS,
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
      await CallApi(constant.API.MOTOR.CAR.CHANGEPLAN, "POST", {
        pacover: paCoverChecked ? "1" : "0",
        planetype: newPlanType,
      });

      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.CAR.GETCACHEQUOTE,
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
          constant.API.MOTOR.CAR.GETCACHEQUOTE,
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
        await CallApi(constant.API.MOTOR.CAR.CHANGEPLAN, "POST", {
          pacover: "1",
          planetype: selectedPlanType,
        });
      } else {
        await CallApi(constant.API.MOTOR.CAR.PACOVERREASON, "POST", payload);
      }
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.CAR.GETCACHEQUOTE,
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
      const res = await CallApi(constant.API.MOTOR.CAR.ACCESSORIES, "POST",accessoriesPayload);

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

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1500);
  //   return () => clearTimeout(timer);
  // }, []);
  useEffect(() => {
  if (vendorPlans.length > 0) {
    setLoading(false);
  }
}, [vendorPlans]);


  return (
    <div className="bg-[#C8EDFE] p-6  min-h-screen  overflow-x-hidden">
      <div className="mb-1">
       <button
          onClick={() => router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTHREE)}
          className="text-blue-700 flex items-center gap-2 mb-4 text-sm font-medium"
        >
          <FaChevronLeft /> Go back to Previous
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full  p-6 rounded-3xl shadow-2xl  bg-[#fff]">
          <div className="flex flex-col md:flex-row md:items-end gap-5 flex-wrap">
            
            {/* Plan Type */}
            <div className="flex flex-col w-44">
              <label className="font-semibold text-[#426D98] mb-2 text-sm">Plan Type</label>
              <select
                className="border border-blue-300 rounded-xl px-4 py-2 text-sm text-[#1f3b57] bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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

            {/* PA Cover */}
            <div
              className="flex items-center  gap-3 px-4 py-3 bg-gradient-to-r from-[#cfe2ff] to-[#d6eaff] rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition"
              onClick={() => setIsPaModalOpen(true)}
            >
              <input
                type="checkbox"
                id="pa-cover"
                className="form-checkbox accent-pink-500 h-4 w-4 cursor-pointer rounded border border-gray-300"
                checked={paCoverChecked}
                readOnly
              />
              <label htmlFor="pa-cover" className="text-sm font-medium text-[#1f3b57] cursor-pointer">
                PA Cover
              </label>
              <span className="text-blue-600 text-sm font-bold"><FaInfoCircle/></span>
            </div>

            {/* IDV Input */}
            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#426D98] text-sm whitespace-nowrap">IDV:</label>
              <input
                type="text"
                value={idv}
                readOnly
                className="border border-blue-300 rounded-xl px-4 py-2 w-28 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
              />
            </div>


            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="bg-gradient-to-r from-[#426D98] to-[#28A7E4] text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition text-sm font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => setIsAddonModalOpen(true)}
                className="bg-gradient-to-r from-[#426D98] to-[#28A7E4] text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition text-sm font-semibold"
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
            {loading
              ? Array(2).fill(0).map((_, idx) => <MotorCardSkeleton key={idx} />)
              : vendorPlans.map((plan) => (
                  <VendorCard
                    key={plan.vendorId}
                    data={plan}
                    onAddonsClick={(vendorData) => {
                      setSelectedPlan(vendorData);
                      setAddAddonModal(true);
                    }}
                    onPremiumClick={premiumBackupData}
                  />
            ))}


          </div>

       
      {(motortype === "knowcar" || motortype === "newcar") && (
        <VehicleCard
          vehicleDetails={vehicleDetails}
          title={motortype === "knowcar" ? "Private Car" : "New Car"}
          icon={<FaCar className="text-blue-600 text-xl" />}
        />
      )}

      </div>

      <VendorAddonModal
  isOpen={addAddonModal}
  fullAddonsName={fullAddonsName}
  onClose={() => {
    setAddAddonModal(false);
    setSelectedPlan(null);
  }}
  selectedPlan={selectedPlan}
/>
    </div>
  );
}
