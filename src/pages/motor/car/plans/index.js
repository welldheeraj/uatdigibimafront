"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";
import { FaChevronLeft, FaCar, FaInfoCircle } from "react-icons/fa";
import PaCoverModal from "./pacovermodal";
import AddonModal, { VendorAddonModal } from "./addonmodal";
import UpdateIdvModal from "./updateIdvmodal";
import VendorCard from "./vendorcard";
import VehicleCard from "../../vehicledetails/index";
import { MotorCardSkeleton } from "@/components/loader";
import { showError } from "@/layouts/toaster";

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showAccessories, setShowAccessories] = useState(false);
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
        const res = await CallApi(constant.API.MOTOR.CAR.PLANS, "GET");
        console.log(res);

        if (res.data?.under === "company") {
          setIsCompany(true);
        }

        // Determine plan type from keys
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

        // Use local planType directly here
        console.log("PlanType detected immediately:", planType);

        // Pick addon list based on selected plan type
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
        // Plan type list for dropdown
        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(
          ([key, label]) => ({
            id: key,
            label,
          })
        );
        setPlanTypes(plantypeList);

        // Vendors
        const vendorArr = res.data?.vendor || [];
        setFullAddonsName(res.data?.addons || {});
        const activeVendors = vendorArr.filter((v) => v.isActive === "1");
        setVendorList(activeVendors);

        // Vehicle details
        setVehicleDetails(res.data?.vehicledetails || []);

        // PACover
        const paCover = res.data?.pacover;
        if (paCover === "1") {
          setPaCoverChecked(paCover);
        }

        // Selected addons based on selected plan type
        // if (planType === 2) {
        //   setSelectedAddon(res.data?.selectedaddon || []);
        // } else if (planType === 1) {
        //   setSelectedAddon(res.data?.odselectedaddon || []);
        // } else if (planType === 3) {
        //   setSelectedAddon(res.data?.tpselectedaddon || []);
        // }

        // Motor type
        setMotorType(res.cache);

        // Still set all lists separately in case you need them later
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
        constant.ROUTES.MOTOR.VENDOR.CAR[String(vendorPayload.vid)] || "";

      const vendorWithRoute = { ...vendorPayload, route };

      const response = await CallApi(
        constant.API.MOTOR.CAR.QUOTE,
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
        allPlans.push({ ...data, vendorId: vendorPayload.vid });
      }
    }

    if (allPlans.length > 0) {
      setVendorPlans(allPlans);
    } else {
      setVendorPlans([]);
      setQuoteError(true);
    }

    // addons
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

  useEffect(() => {
    // console.log("addon update ", Addonlist);
  }, [Addonlist]);
  useEffect(() => {
    console.log("plane update ", selectedPlanType);
    if (selectedPlanType == 2) {
      console.log(compAddonlist);
    }
    if (selectedPlanType == 1) {
      console.log(odAddonlist);
    }
    if (selectedPlanType == 3) {
      console.log(tpAddonlist);
    }
  }, [selectedPlanType]);

  const handleIdvUpdate = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // const handleAddonChange = (id) => {
  //   if (String(selectedPlanType) == 1) {
  //     setOdSelectedAddon((prev) =>
  //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //     );
  //   } else if (String(selectedPlanType) == 2) {
  //     setSelectedAddon((prev) =>
  //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //     );
  //   } else {
  //     setTpSelectedAddon((prev) =>
  //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //     );
  //   }
  // };

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

      console.log(payload);

      const res = await CallApi(
        constant.API.MOTOR.CAR.ADDADDONS,
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

    await CallApi(constant.API.MOTOR.CAR.CHANGEPLAN, "POST", {
      pacover: paCoverChecked ? "1" : "0",
      planetype: newPlanType,
    });

    const allPlans = [];
    let gotValidPlan = false;

    for (let i = 0; i < vendorList.length; i++) {
      const vendorPayload = vendorList[i];
      const route =
        constant.ROUTES.MOTOR.VENDOR.CAR[String(vendorPayload.vid)] || "";

      const vendorWithRoute = { ...vendorPayload, route };

      const response = await CallApi(
        constant.API.MOTOR.CAR.QUOTE,
        "POST",
        vendorWithRoute
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
      const allPlans = [];
      //const addonlist =[];
      for (let i = 0; i < vendorList.length; i++) {
        const vendorPayload = vendorList[i];
        const response = await CallApi(
          constant.API.MOTOR.CAR.GETCACHEQUOTE,
          "POST",
          vendorPayload
        );

        if (response?.status) {
          allPlans.push({ ...response.data, vendorId: vendorPayload.vid });
          //setAddonlist(response.addonlist);
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
      setLoading(true);
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
        const route =
          constant.ROUTES.MOTOR.VENDOR.CAR[String(vendorPayload.vid)] || "";

        const vendorWithRoute = {
          ...vendorPayload,
          route,
        };
        const response = await CallApi(
          constant.API.MOTOR.CAR.QUOTE,
          "POST",
          vendorWithRoute
        );

        if (response?.status === "1" && response?.data) {
          allPlans.push({ ...response.data });
        }
      }
      setVendorPlans(allPlans);
    } catch (error) {
      console.error("Error updating PA Cover:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccessories = async (accessoriesPayload) => {
    try {
      const res = await CallApi(
        constant.API.MOTOR.CAR.ACCESSORIES,
        "POST",
        accessoriesPayload
      );

      if (res.status === "1" || res.status === true) {
        // console.log("Accessories saved successfully:", res);

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

    console.log("Redirecting to:", route);
    router.push(route);
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1500);
  //   return () => clearTimeout(timer);
  // }, []);
  // useEffect(() => {
  //   if (vendorPlans.length > 0) {
  //     setLoading(false);
  //   }
  // }, [vendorPlans]);
  const showSkeleton = loading || vendorPlans.length === 0;

  const handleRedirect = () => {
    if (motortype === "knowcar" || motortype === "") {
      // console.log("➡ Redirecting to KNOWCARSTEPTHREE");
      router.push(constant.ROUTES.MOTOR.CAR.KNOWCARSTEPTHREE);
    } else if (motortype === "newcar") {
      // console.log("➡ Redirecting to NEWCARDETAILSTWO");
      router.push(constant.ROUTES.MOTOR.CAR.NEWCAR);
    } else {
      // console.log("⚠ Unhandled motortype:", motortype);
    }
  };

  return (
    <div className="bgcolor p-6  min-h-screen  overflow-x-hidden">
      <div className="mb-1">
        <button
          onClick={handleRedirect}
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

            {/* PA Cover */}
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

            {/* IDV Input */}
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

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="thmbtn text-white px-6 py-2 rounded-xl"
              >
                Update
              </button>
              <button
                onClick={() => setIsAddonModalOpen(true)}
                className="thmbtn text-white px-6 py-2 rounded-xl"
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
  {loading ? (
    Array(3).fill(0).map((_, idx) => <MotorCardSkeleton key={idx} />)
  ) : quoteError ? (
    <div className="col-span-full text-center text-gray-500 py-10">
       No Plans Available
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
        onPremiumClick={premiumBackupData}
        handlePlanSubmit={handlePlanSubmit}
      />
    ))
  )}
</div>

        </div>

        {/* Right: VehicleCard Section (3 columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-sm sticky top-6">
            {(motortype === "knowcar" || motortype === "newcar") && (
              <VehicleCard
                vehicleDetails={vehicleDetails}
                title={motortype === "knowcar" ? "Private Car" : "New Car"}
                icon={<FaCar className="text-blue-600 text-xl" />}
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
