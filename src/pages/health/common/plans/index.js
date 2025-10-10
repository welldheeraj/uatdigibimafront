"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CallApi } from "../../../../api";
import constant from "../../../../env";
import { flushSync } from "react-dom";


import FilterForm from "./filter";
import PlanCard from "./plancard";
import SlidePanel from "../../sidebar";
import { HealthPlanCardSkeleton } from "../../loader";
import { AnimatePresence, motion } from "framer-motion";

import { getDBData, storeDBData, deleteDBData } from "../../../../api";
import { useRef } from "react";

const normalizeCoverageToLower = (val, list = []) => {
  if (!val || !Array.isArray(list) || list.length < 2) return "";
  const n = Number(val);
  const arr = [...list].sort((a, b) => a - b);
  const idx = arr.indexOf(n);
  if (idx === -1) return "";
  if (idx === arr.length - 1) return String(arr[arr.length - 2]);
  return String(arr[idx]);
};
export default function HealthPlan() {
  const [vendorData, setVendorData] = useState([]);
  const [plansData, setPlansData] = useState([]);
  const [coveragelist, setCoveragelist] = useState([]);
  const [tenurelist, setTenurelist] = useState([]);
  const [filters, setFilters] = useState({
    plantype: "",
    coverage: "",
    tenure: "",
    covertype: "",
    porttenure: "",
  });

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showPincodePanel, setShowPincodePanel] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [pincode, setPincode] = useState("");
  const [memberName, setMemberName] = useState("");

    const [filterChanged, setFilterChanged] = useState(false);

  const [compared, setCompared] = useState([]);

  const originalFiltersRef = useRef({});

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  const handleFilterChange = ({ target: { name, value } }) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("refresh")) {
      console.log(
        "Refresh param detected — clearing cache and reload..."
      );
      (async () => {
        await Promise.all([
          deleteDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANDATA),
          deleteDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANVENDOR),
           deleteDBData(constant.DBSTORE.HEALTH.CARE.CARECHECKOUTDATA),
            deleteDBData(constant.DBSTORE.HEALTH.CARE.CARECHECKOUTTENUREDATA),
          
        ]);
        setVendorData([]);
        setPlansData([]);
        setShouldRefetch((prev) => !prev); 
      })();
    }
  }, []);

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        // 1) DB 
        await new Promise((r) => setTimeout(r, 200));
        const cached = await getDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANDATA);
        let res = cached;

        if (!cached) {
          // API call
          res = await CallApi(constant.API.HEALTH.PLANDATA);
          // store in DB
          if (res) await storeDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANDATA, res);
        }


        if (res) {
          setVendorData(res.vendor || []);
          setCoveragelist(res.coveragelist || []);
          setTenurelist(res.tenurelist || []);
          setPincode(res.pincode || "");

          const normalizedCoverage = normalizeCoverageToLower(
            res.coverage,
            res.coveragelist
          );

          const mapPortTenureLabel = (v) => {
            const s = String(v || "").trim();
            if (!s) return "";
            if (s === "1") return "1 Year";
            if (s === "2") return "2 Years";
            return "3 Years & Above";
          };

          setFilters({
            plantype: res.plantype?.toString() || "",
            coverage: normalizedCoverage,
            tenure: res.tenure?.toString() || "",
            covertype: res.covertype?.toString() || "",
            porttenure: mapPortTenureLabel(res.porttenure),
          });

          const allMembers = res.aInsureData || [];
          setMemberName(`Self(${allMembers.length})`);

          originalFiltersRef.current = {
            plantype: res.plantype?.toString() || "",
            coverage: normalizedCoverage,
            tenure: res.tenure?.toString() || "",
            covertype: res.covertype?.toString() || "",
            porttenure: mapPortTenureLabel(res.porttenure),
          };

          setShouldRefetch(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadPlanData();
  }, [shouldRefetch]); 

  const normalizeFilterPayload = (f = {}) => ({
    plantype: String(f.plantype || ""),
    coverage: String(f.coverage || ""),
    tenure: String(f.tenure || ""),
    covertype: String(f.covertype || ""),
    porttenure: String(f.porttenure || ""),
  });

  const areFiltersSame = (a, b) =>
    JSON.stringify(normalizeFilterPayload(a)) ===
    JSON.stringify(normalizeFilterPayload(b));

  const filterData = useMemo(() => {
    const arr = [...(coveragelist || [])].sort((a, b) => a - b);
    const coverageOptions = ["Select"];
    for (let i = 0; i < arr.length - 1; i++) {
      const curr = arr[i]; 
      const next = arr[i + 1]; 
      const nextLabel = next === 100 ? "1 Cr" : `${next} Lac`;
      coverageOptions.push({
        label: `${curr}–${nextLabel}`,
        value: String(curr),
      });
    }

    const baseFilters = [
      {
        label: "Plan Type",
        name: "plantype",
        options: ["Select", "Base", "Port"],
        value: filters.plantype || "",
      },
      {
        label: "Coverage",
        name: "coverage",
        options: coverageOptions,
        value: filters.coverage || "",
      },
      {
        label: "Cover",
        name: "covertype",
        options: ["Select", "Individual", "Floater"],
        value: filters.covertype || "",
      },
      {
        label: "Insurers",
        name: "insurers",
        options: ["Select", "TATA AIG", "Care"],
        value: filters.insurers || "",
      },
      {
        label: "Features",
        name: "features",
        options: ["Select", "OPD", "Daycare"],
        value: filters.features || "",
      },
      {
        label: "Tenure",
        name: "tenure",
        options: [
          "Select",
          ...(tenurelist || []).map((v) => `${v} Year${v > 1 ? "s" : ""}`),
        ],
        value: filters.tenure || "",
      },
    ];

    const isPort =
      filters.plantype === "2" ||
      (typeof filters.plantype === "string" &&
        filters.plantype.toLowerCase() === "port");

    if (isPort) {
      baseFilters.push({
        label: "Port Tenure",
        name: "porttenure",
        options: ["Select", "1 Year", "2 Years", "3 Years & Above"],
        value: filters.porttenure || "",
      });
    }
    return baseFilters;
  }, [coveragelist, tenurelist, filters]);

  useEffect(() => {
    reset(
      filterData.reduce((acc, item) => {
        acc[item.name] = item.value || "";
        return acc;
      }, {})
    );
  }, [filterData, reset]);

  const vendorFetchedRef = useRef(false);

useEffect(() => {
  if (!vendorData.length) return;
  if (vendorFetchedRef.current && !shouldRefetch) return;
  vendorFetchedRef.current = true;

  setLoadingPlans(true);

  (async () => {
    try {
      const cached = await getDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANVENDOR);
      if (cached && Array.isArray(cached) && cached.length) {
        console.log("Loaded vendor plans IndexedDB");
        setPlansData(cached);
        setLoadingPlans(false);
        return;
      }

      const finalPlans = [];
      setPlansData([]);
      let loadedCount = 0; // 🟩 Track how many plans have loaded

      for (const vendor of vendorData) {
        const route = constant.ROUTES.HEALTH.VENDOR[String(vendor.vid)] || "";
        const vendorWithRoute = { ...vendor, route };
        console.log(vendorWithRoute);

        try {
          const res = await CallApi(
            constant.API.HEALTH.GETQUOTE,
            "POST",
            vendorWithRoute
          );

          if (res.status && res.data) {
            console.log(res.data);
            finalPlans.push(res.data);

            // 🟩 Immediately update UI with this plan
            setPlansData((prev) => {
              const exists = prev.some(
                (p) =>
                  p?.productname === res.data?.productname &&
                  p?.vendorid === res.data?.vendorid
              );
              return exists ? prev : [...prev, res.data];
            });

            // 🟦 Increment count to adjust skeletons
            loadedCount++;

            // 🪄 Let React paint this plan before next API call
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        } catch (err) {
          console.warn(`Error fetching plan for vendor ${vendor.vid}`, err);
        }
      }

      if (finalPlans.length > 0) {
        await storeDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANVENDOR, finalPlans);
        console.log("Cached vendor plans in IndexedDB");
      }
    } catch (err) {
      console.error("Error fetching vendor plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  })();
}, [vendorData, shouldRefetch]);



  const onSubmit = async (data) => {
    const formatted = {
      coverage: data.coverage ?? "",
      covertype: data?.covertype,
      tenure: data.tenure?.replace(/\s*Years?$/, ""),
      plantype: data?.plantype,
    };

    if (data?.plantype === "2" || data?.plantype?.toLowerCase() === "port") {
      formatted.porttenure = data?.porttenure?.replace(/\s*Years?$/, "") || "";
    }
    try {
      setLoadingPlans(true);
      const res = await CallApi(
        constant.API.HEALTH.FILTERPLAN,
        "POST",
        formatted
      );

      const changed = !areFiltersSame(originalFiltersRef.current, formatted);

      if (res.status) {
        if (changed) {
          await Promise.all([
            deleteDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANDATA),
            deleteDBData(constant.DBSTORE.HEALTH.PLANS.HEALTHPLANVENDOR),
             deleteDBData(constant.DBSTORE.HEALTH.CARE.CARECHECKOUTDATA),
            deleteDBData(constant.DBSTORE.HEALTH.CARE.CARECHECKOUTTENUREDATA),
          ]);
          console.log("Cleared plan caches (filters changed)");

          vendorFetchedRef.current = false;

          setTimeout(() => {
            setVendorData([]); 
            setPlansData([]); 
            setShouldRefetch((p) => !p);
          }, 400);
        } else {
          console.log("filters unchanged, cache kept");
        }
      } else {
        setPlansData([]);
      }

      setLoadingPlans(false);
    } catch (err) {
      console.error("Filter error:", err);
      setLoadingPlans(false);
    }
  };

  const handlePlanSubmit = (plan) => {
    if (!plan?.route)
      return console.warn("No route found for the selected plan.");
    router.push(plan.route);
  };

  const getPlanKey = (plan) =>
    `${String(plan?.productname || "")}|${String(
      plan?.coverage || ""
    )}|${String(plan?.premium || "")}`;

  const isCompared = (plan) =>
    compared.some((p) => getPlanKey(p) === getPlanKey(plan));

  const handleCompareChange = (plan, checked) => {
    if (checked) {
      if (isCompared(plan)) return;
      if (compared.length >= 3) return; 
      setCompared((prev) => [...prev, plan]);
    } else {
      setCompared((prev) =>
        prev.filter((p) => getPlanKey(p) !== getPlanKey(plan))
      );
    }
  };

  const removeCompared = (plan) =>
    setCompared((prev) =>
      prev.filter((p) => getPlanKey(p) !== getPlanKey(plan))
    );

  const compareDisabledForOthers = compared.length >= 3;

  const handleCompareCTA = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("compareType", "health");
      sessionStorage.setItem("comparePlans:health", JSON.stringify(compared));
      sessionStorage.setItem(
        "compareBack",
        window.location.pathname + window.location.search
      );
    }
    router.push("/compare?type=health");
  };

  return (
    <div className="bgcolor min-h-screen px-4 sm:px-10 lg:px-20 py-6">
      <button
        type="button"
        onClick={() => router.push("/health/common/illness")}
        className="inline-flex items-center text-base text-indigo-700 mb-4 hover:underline gap-1"
      >
        <FiArrowLeft className="text-lg" />
        Go back to Previous
      </button>

      <FilterForm
        filterData={filterData}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        filters={filters}
        loadingPlans={loadingPlans}
        onFilterChange={handleFilterChange}
          setFilterChanged={setFilterChanged}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6 pr-6">
  {/* Render loaded plans */}
  {plansData.map((plan, i) => (
    <PlanCard
      key={i}
      plan={plan}
      allPlans={plansData}
      handlePlanSubmit={handlePlanSubmit}
      onCompareChange={handleCompareChange}
      compared={isCompared(plan)}
      disableCompare={compareDisabledForOthers && !isCompared(plan)}
    />
  ))}

  {/* 🌀 Show skeletons for remaining plans */}
  {loadingPlans &&
    plansData.length < vendorData.length &&
    Array.from({
    length: Math.min(
      3,
      vendorData.length - plansData.length
    ),
  }).map((_, i) => (
      <HealthPlanCardSkeleton key={`skeleton-${i}`} />
    ))}

  {/* 🩶 If no plans at all */}
  {!loadingPlans && plansData.length === 0 && (
    <div className="text-gray-500 italic">No plans available</div>
  )}
</div>


        <SlidePanel
          isSlideOpen={isSlideOpen}
          setIsSlideOpen={setIsSlideOpen}
          setShowPincodePanel={setShowPincodePanel}
          setShowMemberPanel={setShowMemberPanel}
          showPincodePanel={showPincodePanel}
          showMemberPanel={showMemberPanel}
          pincode={pincode}
          memberName={memberName}
          setPincode={setPincode}
          setMemberName={setMemberName}
        />
        
      </div>

      <AnimatePresence>
        {compared.length > 0 && (
          <motion.div
            key="compare-drawer"
            initial={{
              y: "-120vh",
              opacity: 0,
              scale: 0.95,
              filter: "blur(2px)",
            }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              bounce: 1,
            }}
            className="fixed right-4 bottom-4 z-50 w-80 max-w-[88vw] rounded-xl shadow-2xl bg-white border border-gray-200"
            role="region"
            aria-label="Compare plans drawer"
            style={{ willChange: "transform" }}
          >
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-800">
                Compare Plans
              </h3>
            </div>

            <div className="max-h-72 overflow-y-auto px-3 py-2 space-y-2">
              {compared.map((p) => (
                <motion.div
                  key={getPlanKey(p)}
                  layout="position"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 px-2 py-2"
                >
                  <div className="h-10 w-10 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                    {p?.logo ? (
                      <img
                        src={`/images/health/vendorimage/${p.logo}`}
                        alt={p.productname || "logo"}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-500">No Logo</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {p?.productname || "—"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCompared(p)}
                    className="p-1 rounded hover:bg-gray-100"
                    aria-label="Remove from compare"
                    title="Remove"
                  >
                    <MdClose className="h-4 w-4 text-gray-500" />
                  </button>
                </motion.div>
              ))}

              {compared.length < 3 && (
                <div className="text-center text-[11px] font-semibold text-gray-400 mt-2">
                  SELECT UPTO {3 - compared.length} MORE PLAN
                  {3 - compared.length > 1 ? "S" : ""} TO COMPARE
                </div>
              )}
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={handleCompareCTA}
                disabled={compared.length < 2}
                className={`w-full px-4 py-2 thmbtn ${
                  compared.length >= 2 ? "" : "cursor-not-allowed opacity-70"
                }`}
                aria-disabled={compared.length < 2}
              >
                Compare Plans
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
