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
    const [savingAddons, setSavingAddons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(false);
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
  const [Addonlist, setAddonlist] = useState([]);
  const [compAddonlist, setCompAddonlist] = useState([]);
  const [odAddonlist, setOdAddonlist] = useState([]);
  const [tpAddonlist, setTpAddonlist] = useState([]);
  const [addon115Amount, setAddon115Amount] = useState("");
  const [comselectedAddon, setComSelectedAddon] = useState([]);
  const [odselectedAddon, setOdSelectedAddon] = useState([]);
  const [tpselectedAddon, setTpSelectedAddon] = useState([]);

  const router = useRouter();

 useEffect(() => {
    async function getDetails() {
      try {
        setLoading(true);
        const res = await CallApi(constant.API.MOTOR.BIKE.PLANS, "GET");
        if (res.data?.under === "company") {
          setIsCompany(true);
        }
        const planTypeKeys = Object.keys(res.data?.plantype || {});
        let planType = null;

        if (planTypeKeys.includes("2")) {
          planType = 2;
        } else if (planTypeKeys.includes("1")) {
          planType = 1;
        } else if (planTypeKeys.includes("3")) {
          planType = 3;
        }

        setSelectedPlanType(planType);
        let addonSource = {};
        if (planType === 2) {
          addonSource = res.data?.addons || {};
        } else if (planType === 1) {
          addonSource = res.data?.odaddons || {};
        } else if (planType === 3) {
          addonSource = res.data?.tpaddons || {};
        }
        setAddons(
          Object.entries(addonSource).map(([key, label]) => ({
            id: key,
            label: label.trim(),
          }))
        );
        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(
          ([key, label]) => ({
            id: key,
            label,
          })
        );
        setPlanTypes(plantypeList);
        const vendorArr = res.data?.vendor || [];
        setFullAddonsName(res.data?.addons || {});
        const activeVendors = vendorArr.filter((v) => v.isActive === "1");
        setVendorList(activeVendors);s
        setVehicleDetails(res.data?.vehicledetails || []);
        const paCover = res.data?.pacover;
        if (paCover === "1") {
          setPaCoverChecked(paCover);
        }
        setMotorType(res.cache);
        setCompAddonlist(
          Object.entries(res.data?.addons || {}).map(([key, label]) => ({
            id: key,
            label: label.trim(),
          }))
        );

        setOdAddonlist(
          Object.entries(res.data?.odaddons || {}).map(([key, label]) => ({
            id: key,
            label: label.trim(),
          }))
        );

        setTpAddonlist(
          Object.entries(res.data?.tpaddons || {}).map(([key, label]) => ({
            id: key,
            label: label.trim(),
          }))
        );
      } catch (error) {
        console.error("Error loading plan data:", error);
      } finally {
        setLoading(false);
      }
    }
    getDetails();
  }, []);

  // 📌 Fetch quote
  const getQuote = useCallback(async () => {
    if (!vendorList.length) return;
    try {
      setLoading(true);
      setQuoteError(false);

      const allPlans = [];
      let data;
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const route =
          constant.ROUTES.MOTOR.VENDOR.BIKE[String(vendorPayload.vid)] || "";
        const vendorWithRoute = { ...vendorPayload, route };

        const response = await CallApi(
          constant.API.MOTOR.BIKE.QUOTE,
          "POST",
          vendorWithRoute
        );
        data = response?.data;

        if (response?.status == "1" && data) {
          if (allPlans.length === 0) {
            setIdvMin(data.minrange);
            setIdvMax(data.maxrange);
            setIdv(data.idv);
            setSelectedIdv(data.selectedvalue);
          }
          allPlans.push({ ...data });
        }
      }

      if (allPlans.length > 0) {
        setVendorPlans(allPlans);
      } else {
        setVendorPlans([]);
        setQuoteError(true);
      }

      // selected addons
      if (data?.plantype == "2") setSelectedAddon(data.addons?.selectedaddon || []);
      else if (data?.plantype == "1") setSelectedAddon(data.addons?.odselectedaddon || []);
      else if (data?.plantype == "3") setSelectedAddon(data.addons?.tpselectedaddon || []);
    } catch (error) {
      console.error("Error loading quote:", error);
      setQuoteError(true);
    } finally {
      setLoading(false);
    }
  }, [vendorList]);


  useEffect(() => {
    getQuote();
  }, [getQuote]);

  

  const handleIdvUpdate = async () => {
   
    try {
       setLoading(true);
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
    }finally {
      setLoading(false);
    }
  };


    const handleAddonChange = (id) => {
    if (String(selectedPlanType) == 1) {
      setOdSelectedAddon((prev) => {
        const newState = { ...prev };
        if (id in newState) {
          delete newState[id];
        } else {
          newState[id] = 0; // or some default amount
        }
        return newState;
      });
    } else if (String(selectedPlanType) == 2) {
      setSelectedAddon((prev) => {
        const newState = { ...prev };
        if (id in newState) {
          delete newState[id];
        } else {
          newState[id] = 0;
        }
        return newState;
      });
    } else {
      setTpSelectedAddon((prev) => {
        const newState = { ...prev };
        if (id in newState) {
          delete newState[id];
        } else {
          newState[id] = 0;
        }
        return newState;
      });
    }
  };

  const handleSaveAddons = async (addon115Amount = null) => {
     let currentAddons;
     let payloadKey;
 
     if (String(selectedPlanType) === "1") {
       currentAddons = odselectedAddon;
       payloadKey = "odselectedaddon";
     } else if (String(selectedPlanType) === "3") {
       currentAddons = tpselectedAddon;
       payloadKey = "tpselectedaddon";
     } else {
       currentAddons = selectedAddon;
       payloadKey = "selectedaddon";
     }
 
     const addonIds = Object.keys(currentAddons || {});
 
     const presentAddon = addonIds.includes("103") || addonIds.includes("104");
     const requireAddon = addonIds.includes("101");
 
     if (presentAddon && !requireAddon) {
       showError(
         "Zero / Nil Depreciation cover is mandatory when you select the Consumable Cover/Engine Protector"
       );
 
       const filteredAddons = addonIds.filter(
         (id) => id !== "103" && id !== "104"
       );
 
       const newAddons = {};
       filteredAddons.forEach((id) => {
         newAddons[id] = currentAddons[id];
       });
 
       if (String(selectedPlanType) == 1) {
         setOdSelectedAddon(newAddons);
       } else if (String(selectedPlanType) == 3) {
         setTpSelectedAddon(newAddons);
       } else {
         setSelectedAddon(newAddons);
       }
       return;
     }
 
     try {
       setSavingAddons(true);
       const payload = {
         [payloadKey]: Object.keys(currentAddons || {}),
         addon115Amount: addon115Amount,
       };
       const res = await CallApi(
         constant.API.MOTOR.BIKE.ADDADDONS,
         "POST",
         payload
       );
 
       if (res.status) {
         await getQuote();
         setIsAddonModalOpen(false);
       } else {
         console.error("Addon update failed:", res);
       }
     } catch (error) {
       console.error("Failed to save addons:", error);
     } finally {
       setSavingAddons(false);
     }
   };

 const handlePlanTypeChange = async (e) => {
    const newPlanType = e.target.value;
    setSelectedPlanType(newPlanType);

    try {
      setLoading(true);
      setQuoteError(false);

      await CallApi(constant.API.MOTOR.BIKE.CHANGEPLAN, "POST", {
        pacover: paCoverChecked ? "1" : "0",
        planetype: newPlanType,
      });

      const allPlans = [];
      let gotValidPlan = false;

      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const route =
          constant.ROUTES.MOTOR.VENDOR.BIKE[String(vendorPayload.vid)] || "";
        const vendorWithRoute = { ...vendorPayload, route };

        const response = await CallApi(
          constant.API.MOTOR.BIKE.QUOTE,
          "POST",
          vendorPayload
        );

        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
          gotValidPlan = true;
        }
        if (response?.status === "1" && response?.addonlist) {
          setAddonlist(response?.addonlist);
        }
      }

      if (gotValidPlan) {
        setVendorPlans(allPlans);
      } else {
        setVendorPlans([]);
        setQuoteError(true);
      }
    } catch (error) {
      console.error("Plan type change failed:", error);
      setQuoteError(true);
    } finally {
      setLoading(false);
    }
  };



  const getCacheQuote = async () => {
    try {
      setLoading(true);
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
        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
        }
      }
     setVendorPlans(allPlans.length > 0 ? allPlans : []);

    } catch (error) {
      console.error("Cache quote fetch failed:", error);
    }finally {
      setLoading(false);
    }
  };

  const handlePaCoverSave = async ({ payload, checked }) => {
    setPaCoverChecked(checked);
    try {
      setLoading(true);
      if (checked) {
        await CallApi(constant.API.MOTOR.BIKE.CHANGEPLAN, "POST", {
          pacover: "1",
          planetype: selectedPlanType,
        });
      } else {
        await CallApi(constant.API.MOTOR.BIKE.PACOVERREASON, "POST", payload);
      }
      await getQuote();
    } catch (error) {
      console.error("Error updating PA Cover:", error);
    }finally {
      setLoading(false);
    }
  };

  const handleSaveAccessories = async (accessoriesPayload) => {
    try {
      const res = await CallApi(
        constant.API.MOTOR.BIKE.ACCESSORIES,
        "POST",
        accessoriesPayload
      );

      if (res.status === "1" || res.status === true) {
        await getQuote();
      } else {
        console.error("Accessories update failed:", res);
      }
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
    router.push(route);
  };
const showSkeleton = loading || (vendorPlans.length === 0 && !quoteError);
  const handleRedirect = () => {
    if (motortype === "knowbike" || motortype === "") {
      router.push(constant.ROUTES.MOTOR.BIKE.KNOWBIKESTEPTHREE);
    } else if (motortype === "newbike") {
      router.push(constant.ROUTES.MOTOR.BIKE.NEWBIKE);
    } else {
      // console.log("Unhandled motortype:", motortype);
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
        compAddonlist={compAddonlist}
        tpAddonlist={tpAddonlist}
        odAddonlist={odAddonlist}
        selectedPlanType={selectedPlanType}
        selectedAddon={selectedAddon}
        handleAddonChange={handleAddonChange}
        handleSaveAddons={handleSaveAddons}
        showAccessories={showAccessories}
        setShowAccessories={setShowAccessories}
        onSaveAccessories={handleSaveAccessories}
        addon115Amount={addon115Amount}
        setAddon115Amount={setAddon115Amount}
        comselectedAddon={comselectedAddon}
        odselectedAddon={odselectedAddon}
        tpselectedAddon={tpselectedAddon}
         savingAddons={savingAddons}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
        {/* Left: VendorCard Section (9 columns) */}
        <div className="lg:col-span-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {showSkeleton ? (
              Array(3).fill(0).map((_, idx) => <MotorCardSkeleton key={idx} />)
            ) : quoteError ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                🚫 No Plans Available
              </div>
            ) : (
              vendorPlans.map((plan) => (
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
              ))
            )}
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
