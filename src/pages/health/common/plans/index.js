"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CallApi } from "../../../../api";
import constant from "../../../../env";

import FilterForm from "./filter";
import PlanCard from "./plancard";
import SlidePanel from "../../vendors/caresupereme/sidebar";
import HealthInsuranceLoader from "../../loader";

export default function HealthPlan() {
  const [vendorData, setVendorData] = useState([]);
  const [plansData, setPlansData] = useState([]);
  const [coveragelist, setCoveragelist] = useState([]);
  const [tenurelist, setTenurelist] = useState([]);
  const [filters, setFilters] = useState({ coverage: "", tenure: "" });

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showPincodePanel, setShowPincodePanel] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [pincode, setPincode] = useState("110065");
  const [memberName, setMemberName] = useState("Gfggf");

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  const filterData = useMemo(() => [
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
  ], [coveragelist, tenurelist, filters]);

  const handleFilterChange = ({ target: { name, value } }) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    CallApi(constant.API.HEALTH.PLANDATA)
      .then((res) => {
        setVendorData(res.vendor || []);
        setCoveragelist(res.coveragelist || []);
        setTenurelist(res.tenurelist || []);
        setFilters({
          coverage: res.coverage?.toString() || "",
          tenure: res.tenure?.toString() || "",
        });
        setShouldRefetch(false);
      })
      .catch(console.error);
  }, [shouldRefetch]);

  useEffect(() => {
    reset(
      filterData.reduce((acc, item) => {
        acc[item.name] = item.value || "";
        return acc;
      }, {})
    );
  }, [filterData, reset]);

  useEffect(() => {
    if (!vendorData.length) return;

    setLoadingPlans(true);
    (async () => {
      const responses = await Promise.all(
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
      setPlansData(responses.filter(Boolean));
      setLoadingPlans(false);
    })();
  }, [vendorData]);

  const onSubmit = async (data) => {
    setLoadingPlans(true);

    const formatted = {
      coverage: data.coverage?.includes("Cr")
        ? "100"
        : data.coverage?.replace(" Lac", ""),
      tenure: data.tenure?.replace(" Year", ""),
    };

    try {
      const res = await CallApi(
        constant.API.HEALTH.FILTERPLAN,
        "POST",
        formatted
      );
      res.status ? setShouldRefetch(true) : setPlansData([]);
      setLoadingPlans(false);
    } catch (err) {
      console.error("Filter error:", err);
      setLoadingPlans(false);
    }
  };

  const handlePlanSubmit = () => router.push("/health/vendors/caresupereme/checkout");

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#C8EDFE]">
        <HealthInsuranceLoader />
      </div>
    );
  }

  return (
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
          {plansData.length ? (
            plansData.map((plan, i) => (
              <PlanCard key={i} plan={plan} handlePlanSubmit={handlePlanSubmit} />
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
