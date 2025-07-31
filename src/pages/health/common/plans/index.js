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
import  { HealthPlanCardSkeleton } from "../../loader";

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
  const [pincode, setPincode] = useState("");
  const [memberName, setMemberName] = useState("");

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
        console.log("plandata",res);
        setVendorData(res.vendor || []);
        setCoveragelist(res.coveragelist || []);
        setTenurelist(res.tenurelist || []);
        setPincode(res.pincode || "")
        setFilters({
          coverage: res.coverage?.toString() || "",
          tenure: res.tenure?.toString() || "",
        });
        const allMembers = res.aInsureData || [];
      const memberCount = allMembers.length;
      setMemberName(`Self(${memberCount})`);
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
//  console.log(vendorData)
    setLoadingPlans(true);
    (async () => {
      const responses = await Promise.all(
        vendorData.map(async (vendor) => {
        const route =  constant.ROUTES.HEALTH.VENDOR[String(vendor.vid)] || "";

        const vendorWithRoute = {
          ...vendor,
          route, 
        };

        console.log("Requesting quote for:", vendorWithRoute);
          try {
            const res = await CallApi(
              constant.API.HEALTH.GETQUOTE,
              "POST",
              vendorWithRoute
            );
            console.log("Response for",  res);
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

 const handlePlanSubmit = (plan) => {
  console.log("Selected Plan:", plan);

  if (!plan?.route) {
    console.warn("No route found for the selected plan.");
    return;
  }

  router.push(plan.route); // Navigate to the dynamic route
};


  // if (loadingPlans) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#C8EDFE]">
  //       <HealthInsuranceLoader />
  //     </div>
  //   );
  // }

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
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6 pr-6">
          {loadingPlans ? (
            Array.from({ length: 3 }).map((_, i) => <HealthPlanCardSkeleton key={i} />)
          ) : plansData.length ? (
            plansData.map((plan, i) => (
              <PlanCard
                key={i}
                plan={plan}
                allPlans={plansData}
                handlePlanSubmit={handlePlanSubmit}
              />
            ))
          ) : (
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
    </div>
  );
}
