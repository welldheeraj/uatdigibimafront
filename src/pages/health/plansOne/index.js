// pages/health/index.jsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CallApi } from "../../../api";
import constant from "../../../env";

import FilterForm from "./filter";
import PlanCard from "./plancard";
import SlidePanel from "./sidebar";
import HealthInsuranceLoader from "../loader";

export default function HealthPlan() {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [plansData, setPlansData] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showPincodePanel, setShowPincodePanel] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [pincode, setPincode] = useState("110065");
  const [memberName, setMemberName] = useState("Gfggf");
  const [coveragelist, setCoveragelist] = useState([]);
  const [tenurelist, setTenurelist] = useState([]);
  const [selectcoverage, setSelectcoverage] = useState("");
  const [selecttenure, setSelecttenure] = useState("");

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  const [filters, setFilters] = useState({
    coverage: "",
    tenure: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    CallApi(constant.API.HEALTH.PLANDATA)
      .then((res) => {
        setCoveragelist(res.coveragelist || []);
        setTenurelist(res.tenurelist || []);
        setVendorData(res.vendor || []);
        setSelectcoverage(res.coverage || "");
        setSelecttenure(res.tenure || "");
        setFilters({
          coverage: res.coverage?.toString() || "",
          tenure: res.tenure?.toString() || "",
        });
        setIsDataLoaded(true);
        setShouldRefetch(false);
      })
      .catch(console.error);
  }, [shouldRefetch]);

  useEffect(() => {
    if (!isDataLoaded || vendorData.length === 0) return;
    setLoadingPlans(true);

    (async () => {
      const temp = await Promise.all(
        vendorData.map(async (vendor) => {
          try {
            const res = await CallApi(
              constant.API.HEALTH.GETQUOTE,
              "POST",
              vendor
            );
            return res.status && res.data ? res.data : null;
          } catch {
            return null;
          }
        })
      );
      setPlansData(temp.filter(Boolean));
      setLoadingPlans(false);
    })();
  }, [vendorData, isDataLoaded]);

 const filterData = useMemo(
  () => [
    {
      label: "Plan Type",
      name: "planType",
      options: ["Select", "Base", "Top-up"],
      value: filters.planType || "",
    },
    {
      label: "Coverage",
      name: "coverage",
      options: [
        "Select",
        ...coveragelist.map((val) => (val === 100 ? "1 Cr" : `${val} Lac`)),
      ],
      value: filters.coverage || "",
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
      options: ["Select", ...tenurelist.map((val) => `${val} Year`)],
      value: filters.tenure || "",
    },
  ],
  [coveragelist, tenurelist, filters]
);


  useEffect(() => {
    const defaultVals = {};
    filterData.forEach((item) => {
      defaultVals[item.name] = item.value || "";
    });
    reset(defaultVals);
  }, [filterData, reset]);

  const onSubmit = async (data) => {
    setLoadingPlans(true);
    const formattedData = {
      coverage: data.coverage?.includes("Cr")
        ? "100"
        : data.coverage?.replace(" Lac", ""),
      tenure: data.tenure?.replace(" Year", ""),
    };

    try {
      const res = await CallApi(
        constant.API.HEALTH.FILTERPLAN,
        "POST",
        formattedData
      );
      if (res.status) {
        setShouldRefetch(true);
      } else {
        setPlansData([]);
        setLoadingPlans(false);
      }
    } catch (err) {
      console.error("Error during filtered quote fetch:", err);
      setLoadingPlans(false);
    }
  };

  const handlePlanSubmit = (plan) => {
    router.push("/health/checkoutOne");
  };

  return loadingPlans ? (
    <div className="min-h-screen flex items-center justify-center bg-[#C8EDFE]">
      <HealthInsuranceLoader />
    </div>
  ) : (
    <div className="bg-[#C8EDFE] min-h-screen px-4 sm:px-10 lg:px-20 py-6">
      <button
        type="button"
        onClick={() => router.push("/health/illness")}
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
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6 pr-6">
          {plansData.length > 0 ? (
            plansData.map((plan, i) => (
              <PlanCard
                key={i}
                plan={plan}
                handlePlanSubmit={handlePlanSubmit}
              />
            ))
          ) : (
            <div>No plans available</div>
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
    </div>
  );
}
