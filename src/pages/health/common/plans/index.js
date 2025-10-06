"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CallApi } from "../../../../api";
import constant from "../../../../env";
import Image from "next/image";

import FilterForm from "./filter";
import PlanCard from "./plancard";
import SlidePanel from "../../sidebar";
import { HealthPlanCardSkeleton } from "../../loader";
import { AnimatePresence, motion } from "framer-motion";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";

export default function HealthPlan() {
  const [vendorData, setVendorData] = useState([]);
  const [coveragelist, setCoveragelist] = useState([]);
  const [tenurelist, setTenurelist] = useState([]);
  const [filters, setFilters] = useState({
    plantype: "",
    coverage: "",
    tenure: "",
    covertype: "",
    porttenure: "",
  });

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showPincodePanel, setShowPincodePanel] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [pincode, setPincode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [compared, setCompared] = useState([]);

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  // normalize coverage
  const normalizeCoverageToLower = (val, list = []) => {
    if (!val || !Array.isArray(list) || list.length < 2) return "";
    const n = Number(val);
    const arr = [...list].sort((a, b) => a - b);
    const idx = arr.indexOf(n);
    if (idx === -1) return "";
    if (idx === arr.length - 1) return String(arr[arr.length - 2]);
    return String(arr[idx]);
  };

  const handleFilterChange = ({ target: { name, value } }) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  // 🔹 Query: Initial Plan Data
  const { data: initData } = useQuery({
    queryKey: ["planData"],
    queryFn: () => CallApi(constant.API.HEALTH.PLANDATA),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // set state when initData comes
  useEffect(() => {
    if (initData) {
      setVendorData(initData.vendor || []);
      setCoveragelist(initData.coveragelist || []);
      setTenurelist(initData.tenurelist || []);
      setPincode(initData.pincode || "");

      const normalizedCoverage = normalizeCoverageToLower(
        initData.coverage,
        initData.coveragelist
      );

      const mapPortTenureLabel = (v) => {
        const s = String(v || "").trim();
        if (!s) return "";
        if (s === "1") return "1 Year";
        if (s === "2") return "2 Years";
        return "3 Years & Above";
      };

      setFilters({
        plantype: initData.plantype?.toString() || "",
        coverage: normalizedCoverage,
        tenure: initData.tenure?.toString() || "",
        covertype: initData.covertype?.toString() || "",
        porttenure: mapPortTenureLabel(initData.porttenure),
      });

      const allMembers = initData.aInsureData || [];
      setMemberName(`Self(${allMembers.length})`);
    }
  }, [initData]);

  // 🔹 useQueries: vendor plans one-by-one
  const vendorQueries = useQueries({
    queries: vendorData.map((vendor) => ({
      queryKey: ["vendorPlan", vendor.vid],
      queryFn: async () => {
        const route = constant.ROUTES.HEALTH.VENDOR[String(vendor.vid)] || "";
        const res = await CallApi(constant.API.HEALTH.GETQUOTE, "POST", {
          ...vendor,
          route,
        });
        if (!res.status) throw new Error("Failed to fetch plan");
        return res.data;
      },
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    })),
  });

  const plansData = vendorQueries.map((q) => q.data).filter(Boolean);
  const loadingPlans = vendorQueries.some((q) => q.isLoading);

  // 🔹 Mutation: Filter Plans
  const filterMutation = useMutation({
    mutationFn: (payload) =>
      CallApi(constant.API.HEALTH.FILTERPLAN, "POST", payload),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries(["planData"]);
      }
    },
  });

  // filterData options
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

  // sync filters to form
  useEffect(() => {
    reset(
      filterData.reduce((acc, item) => {
        acc[item.name] = item.value || "";
        return acc;
      }, {})
    );
  }, [filterData, reset]);

  // onSubmit handler
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
    filterMutation.mutate(formatted);
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
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6 pr-6">
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

          {loadingPlans &&
            Array.from({ length: vendorData.length - plansData.length }).map(
              (_, i) => <HealthPlanCardSkeleton key={`skeleton-${i}`} />
            )}

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

      {/* Compare Drawer */}
      <AnimatePresence>
        {compared.length > 0 && (
          <motion.div
            key="compare-drawer"
            initial={{ y: "-120vh", opacity: 0, scale: 0.95, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, bounce: 1 }}
            className="fixed right-4 bottom-4 z-50 w-80 max-w-[88vw] rounded-xl shadow-2xl bg-white border border-gray-200"
            role="region"
            aria-label="Compare plans drawer"
          >
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-800">Compare Plans</h3>
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
                      <Image
                        src={`${constant.BASE_URL}/front/logo/${p.logo}`}
                        alt={p.productname || "logo"}
                        width={40}
                        height={40}
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
