"use client";

import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

import CoverageAmount from "./coverageamount";
import PolicyPeriodOptions from "./policyperiodoptions";
import AddOnSelection from "./addonselection";
import MemberDetails from "./editmember";
import SummaryCard from "./rightsection";
import HealthInsuranceLoader from "../loader";

import { CallApi } from "../../../api";
import constant from "../../../env";

export default function ProposalUI() {
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addons, setAddons] = useState({});
  const [fullAddonsName, setFullAddonsName] = useState({});
  const [compulsoryAddons, setCompulsoryAddons] = useState([]);
  const [coverageOptions, setCoverageOptions] = useState([]);
  const [coverAmount, setCoverAmount] = useState("");
  const [tenurePrices, setTenurePrices] = useState({});
  const [tenureOptions, setTenureOptions] = useState([]);
  const [tenure, setTenure] = useState("");
  const [insurers, setInsurers] = useState([]);
  const [childList, setChildList] = useState([]);
  const [gender, setGender] = useState("");
  const [kycRequired, setKycRequired] = useState(false);

  // Initial data fetch
  useEffect(() => {
    getCheckoutData();
  }, []);

  // Fetch checkout data
  function getCheckoutData() {
     setLoading(true);
    CallApi(constant.API.HEALTH.CHECKOUT)
      .then((r) => {
        console.log(r);
        setSelectedAddons(r.selected_addon || []);
        setAddons(r["addon value"] || {});
        setFullAddonsName(r.addonname || {});
        setCompulsoryAddons(r.compulsoryaddon || []);
        setCoverageOptions(r.coveragelist || []);
        setCoverAmount(r.coverage || "");
        setTenureOptions(r.tenureList || []);
        setTenure(r.tenure || "");
        setInsurers(r.aInsureData || []);
        setChildList(r.child || []);
        setGender(r.gender || "");
        setKycRequired(r.kyc === "1");
      })
      .catch((err) => {
        console.error("Error during checkout fetch:", err);
      })
      .finally(() => setLoading(false));
  }

  // Fetch prices per tenure
  const fetchData = async () => {
    const newTenurePrices = {};
    if (!coverAmount || tenureOptions.length === 0) return;

    for (const t of tenureOptions) {
      const data = { tenure: t, coverage: coverAmount };

      try {
        const response = await CallApi(
          constant.API.HEALTH.PlANCHECKOUT,
          "POST",
          data
        );

        if (response?.data?.premium) {
          newTenurePrices[t] = response.data.premium;
        }
      } catch (error) {
        console.error("Error fetching price for tenure:", t, error);
      }
    }

    setTenurePrices(newTenurePrices);
  };

  // Refetch prices when coverage or options change
  useEffect(() => {
    if (coverAmount && tenureOptions.length > 0) {
      fetchData();
    }
  }, [coverAmount, tenureOptions]);

  const basePremium = tenurePrices[tenure] || 0;

  const totalPremium =
    basePremium +
    Object.entries(addons)
      .filter(([key]) => compulsoryAddons.includes(key))
      .reduce((sum, [_, price]) => sum + (Number(price) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#C8EDFE]">
        <HealthInsuranceLoader />
      </div>
    );
  }

  return (
    <div className="bg-[#C8EDFE] min-h-screen px-3 sm:px-10 lg:px-20 py-6">
      <button
        type="button"
        onClick={() => router.push("/health/One")}
        className="inline-flex items-center text-base text-indigo-700 mb-4 hover:underline gap-1"
      >
        <FiArrowLeft className="text-lg" />
        Go back to Previous
      </button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <CoverageAmount
            coverAmount={coverAmount}
            setCoverAmount={setCoverAmount}
            coverageOptions={coverageOptions}
           onCoverageChange={(newValue) => {
            setCoverAmount(newValue);
            setLoading(true); 
            CallApi(constant.API.HEALTH.FILTERPLAN, "POST", {
              coverage: newValue,
            })
              .then((res) => {
                console.log("FILTERPLAN result:", res);
                getCheckoutData(); 
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}


          />

          <PolicyPeriodOptions
            tenureOptions={tenureOptions}
            tenure={tenure}
            setTenure={setTenure}
            tenurePrices={tenurePrices}
           onTenureChange={(newTenure) => {
            setTenure(newTenure);
            setLoading(true);

            CallApi(constant.API.HEALTH.FILTERPLAN, "POST", {
              coverage: coverAmount,
              tenure: newTenure,
            })
              .then((res) => {
                console.log("FILTERPLAN result:", res);
                getCheckoutData();
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}

          />

          <AddOnSelection
            addons={addons}
            compulsoryAddons={compulsoryAddons}
            fullAddonsName={fullAddonsName}
            selectedAddons={selectedAddons}
            getCheckoutData={getCheckoutData}
          />

          <MemberDetails
            memberName="Ravi & Family"
            count={3}
            onEdit={() => console.log("Edit member clicked")} // or handle logic if needed
          />
        </div>

        {/* Right Section */}
        <SummaryCard
          tenure={tenure}
          tenurePrices={tenurePrices}
          coverAmount={coverAmount}
          compulsoryAddons={compulsoryAddons}
          fullAddonsName={fullAddonsName}
           selectedAddons={selectedAddons}
          addons={addons}
          totalPremium={totalPremium}
        />
      </div>
    </div>
  );
}