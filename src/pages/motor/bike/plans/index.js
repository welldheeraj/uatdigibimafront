"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";
import PaCoverModal from "./pacovermodal";
import AddonModal, { VendorAddonModal } from "./addonmodal";
import UpdateIdvModal from "./updateIdvmodal";
import VendorCard from "./vendorcard";
import VehicleCard from "../../vehicledetails/index";
import { FaChevronLeft, FaMotorcycle, FaInfoCircle } from "react-icons/fa";
import { MotorCardSkeleton } from "@/components/loader";

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showAccessories, setShowAccessories] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
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
  const [idv, setIdv] = useState();
  const [motortype, setMotorType] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await CallApi(constant.API.MOTOR.BIKE.PLANS, "GET");
         if (res.data?.under === "company") {
          setIsCompany(true);
        }
        const addonObj = res.data?.addons || {};
        const addonList = Object.entries(addonObj).map(([key, label]) => ({
          id: key,
          label: label.trim(),
        }));
        console.log("rtrtereterererr", res);
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
        // console.log(vehicleDetails)
        const paCover = res.data?.pacover;
        if (paCover == "1") setPaCoverChecked(paCover);

        setSelectedAddon(res.data?.selectedaddons || []);
        setMotorType(res.cache);
        console.log(motortype);
      } catch (error) {
        console.error("Error loading plan data:", error);
      }
    }
    getDetails();
  }, [motortype]);

  const getQuote = useCallback(async () => {
    console.log(vendorList);
    if (!vendorList.length) return;
    try {
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const payload = vendorList[i];
        const route =
          constant.ROUTES.MOTOR.VENDOR.BIKE[String(payload.vid)] || "";

        const vendorWithRoute = {
          ...payload,
          route,
        };
        console.log("Requesting quote for:", vendorWithRoute);

        const response = await CallApi(
          constant.API.MOTOR.BIKE.QUOTE,
          "POST",
          vendorWithRoute
        );
        console.log(response);
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
    } catch (error) {
      console.error("Error loading quote:", error);
    }
  }, [vendorList]);

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  const handleIdvUpdate = async () => {
    setLoading(true);
    try {
      const response = await CallApi(
        constant.API.MOTOR.BIKE.UPDATEIDV,
        "POST",
        selectedIdv
      );
      if (response.status) {
        setIsUpdateModalOpen(false);
        await getQuote();
      } else {
        alert("Failed to update IDV");
      }
    } catch (error) {
      alert("An error occurred while updating IDV.");
      setLoading(false);
    }
  };

  const handleAddonChange = (id) => {
    setSelectedAddon((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveAddons = async () => {
    setLoading(true);
    try {
      const res = await CallApi(
        constant.API.MOTOR.BIKE.ADDADDONS,
        "POST",
        selectedAddon
      );
      console.log("Saved successfully:", res);
      if (res.status) {
        await getCacheQuote();
        setIsAddonModalOpen(false);
      } else {
        console.error("Addon update failed:", res);
      }
    } catch (error) {
      console.error("Failed to save addons:", error);
      setLoading(false);
    }
  };

  const handlePlanTypeChange = async (e) => {
    const newPlanType = e.target.value;
    setSelectedPlanType(newPlanType);
    setLoading(true);
    try {
      await CallApi(constant.API.MOTOR.BIKE.CHANGEPLAN, "POST", {
        pacover: paCoverChecked ? "1" : "0",
        planetype: newPlanType,
      });
      await getCacheQuote();
    } catch (error) {
      console.error("Plan type change failed:", error);
      setLoading(false);
    }
  };

  const getCacheQuote = async () => {
    try {
      const allPlans = [];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const route =
          constant.ROUTES.MOTOR.VENDOR.BIKE[String(vendorPayload.vid)] || "";

        const vendorWithRoute = {
          ...vendorPayload,
          route,
        };
        const response = await CallApi(
          constant.API.MOTOR.BIKE.GETCACHEQUOTE,
          "POST",
          vendorWithRoute
        );
        console.log("hello", response);
        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
        }
      }
      setVendorPlans(allPlans);
    } catch (error) {
      console.error("Cache quote fetch failed:", error);
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
      await getCacheQuote();
    } catch (error) {
      console.error("Error updating PA Cover:", error);
    }
  };

  const handleSaveAccessories = async (accessoriesPayload) => {
    try {
      const res = await CallApi(
        constant.API.MOTOR.BIKE.ACCESSORIES,
        "POST",
        accessoriesPayload
      );
      if (res.status === "1" || res.status === true) await getCacheQuote();
    } catch (err) {
      console.error("Error while saving accessories:", err);
    }
  };

  const handlePlanSubmit = (plan) => {
    const route = typeof plan === "string" ? plan : plan?.route;

    if (!route) {
      console.warn("No route found for the selected plan.");
      return;
    }

    console.log("Redirecting to:", route);
    router.push(route);
  };
  useEffect(() => {
    if (vendorPlans.length > 0) {
      setLoading(false);
    }
  }, [vendorPlans]);
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1500);
  //   return () => clearTimeout(timer);
  // }, []);
  const handleRedirect = () => {
    console.log("ram",motortype)
    if (motortype === "knowbike" || motortype === "") {
      // console.log("➡ Redirecting to KNOWBIKESTEPTHREE");
      router.push(constant.ROUTES.MOTOR.BIKE.KNOWBIKESTEPTHREE);
    } else if (motortype === "newbike") {
      // console.log("➡ Redirecting to NEWBike");
      router.push(constant.ROUTES.MOTOR.BIKE.NEWBIKE);
    } else {
      // console.log("⚠ Unhandled motortype:", motortype);
    }
  };

  return (
    <div className="bgcolor p-6 min-h-screen overflow-x-hidden">
      <div className="mb-1">
        <button
          onClick={handleRedirect}
          className="text-blue-700 flex items-center gap-2 mb-4 text-sm font-medium"
        >
          <FaChevronLeft /> Go back to Previous
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full p-6 rounded-3xl shadow-2xl bg-white">
          <div className="flex flex-col md:flex-row md:items-end gap-5 flex-wrap">
            <div className="flex flex-col w-44">
              <label className="font-semibold text-[#426D98] mb-2 text-sm">
                Plan Type
              </label>
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

           <div
              className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#cfe2ff] to-[#d6eaff] rounded-2xl shadow-md hover:shadow-lg transition ${
                isCompany ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !isCompany && setIsPaModalOpen(true)}
            >
              <input
                type="checkbox"
                id="pa-cover"
                className="form-checkbox accent-pink-500 h-4 w-4 rounded border border-gray-300"
                checked={paCoverChecked}
                readOnly
                disabled={isCompany}
              />
              <label
                htmlFor="pa-cover"
                className={`text-sm font-medium text-[#1f3b57] ${
                  isCompany ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                PA Cover
              </label>
              <span className="text-blue-600 text-sm font-bold">
                <FaInfoCircle />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#426D98] text-sm whitespace-nowrap">
                IDV:
              </label>
              <input
                type="text"
                value={idv}
                readOnly
                className="border border-blue-300 rounded-xl px-4 py-2 w-28 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="thmbtn text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition text-sm font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => setIsAddonModalOpen(true)}
                className="thmbtn text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition text-sm font-semibold"
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
        {/* Left: VendorCard Section (9 columns) */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? Array(3).fill(0).map((_, idx) => <MotorCardSkeleton key={idx} />)
              : vendorPlans.map((plan) => (
                  <VendorCard
                    key={plan.vendorId}
                    data={plan}
                    onAddonsClick={(vendorData) => {
                      setSelectedPlan(vendorData);
                      setAddAddonModal(true);
                    }}
                      handlePlanSubmit={handlePlanSubmit}
                    onPremiumClick={premiumBackupData}
                  />
                ))}
          </div>
        </div>
      
        {/* Right: VehicleCard Section (3 columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-sm sticky top-6">
            {(motortype === "knowbike" || motortype === "newbike") && (
              <VehicleCard
                vehicleDetails={vehicleDetails}
                title={motortype === "knowbike" ? "Private Bike" : "New Bike"}
                icon={<FaMotorcycle className="text-blue-600 text-xl" />}
              />
            )}
          </div>
        </div>
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
