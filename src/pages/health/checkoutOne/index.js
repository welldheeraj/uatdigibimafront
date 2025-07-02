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
import SlidePanel from "../sidebar/index";

import { CallApi } from "../../../api";
import constant from "../../../env";

export default function ProposalUI() {
  const router = useRouter();

  // State
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
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [pincode, setPincode] = useState("302013");
  const [memberName, setMemberName] = useState("Ravi & Family");


  const [applyClicked, setApplyClicked] = useState(false);
  const [isAddOnsModified, setIsAddOnsModified] = useState(false);

  useEffect(() => {
    getCheckoutData();
  }, []);

  function getCheckoutData() {
    setLoading(true);
    CallApi(constant.API.HEALTH.CHECKOUT)
      .then((r) => {
        console.log(r)
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
      .catch((err) => console.error("Checkout error:", err))
      .finally(() => setLoading(false));
  }

  const fetchData = async () => {
    const newPrices = {};
    if (!coverAmount || tenureOptions.length === 0) return;

    for (const t of tenureOptions) {
      const data = { tenure: t, coverage: coverAmount };
      try {
        const res = await CallApi(constant.API.HEALTH.PlANCHECKOUT, "POST", data);
        if (res?.data?.premium) {
          newPrices[t] = res.data.premium;
        }
      } catch (err) {
        console.error("Price error:", err);
      }
    }

    setTenurePrices(newPrices);
  };

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
        onClick={() => router.push("/health/plans")}
        className="inline-flex items-center text-base text-indigo-700 mb-4 hover:underline gap-1"
      >
        <FiArrowLeft className="text-lg" />
        Go back to Previous
      </button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* LEFT */}
        <div className="flex-1">
          <CoverageAmount
            coverAmount={coverAmount}
            setCoverAmount={setCoverAmount}
            coverageOptions={coverageOptions}
            onCoverageChange={(val) => {
              setCoverAmount(val);
              setLoading(true);
              CallApi(constant.API.HEALTH.FILTERPLAN, "POST", { coverage: val })
                .then(() => getCheckoutData())
                .catch(console.error)
                .finally(() => setLoading(false));
            }}
          />

          <PolicyPeriodOptions
            tenureOptions={tenureOptions}
            tenure={tenure}
            setTenure={setTenure}
            tenurePrices={tenurePrices}
            onTenureChange={(val) => {
              setTenure(val);
              setLoading(true);
              CallApi(constant.API.HEALTH.FILTERPLAN, "POST", {
                coverage: coverAmount,
                tenure: val,
              })
                .then(() => getCheckoutData())
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
            setApplyClicked={setApplyClicked}
            setIsAddOnsModified={setIsAddOnsModified}
          />

          <MemberDetails
            memberName={memberName}
            count={3}
            onEdit={() => setIsSlideOpen(true)}
          />
        </div>

        {/* RIGHT */}
        <SummaryCard
          tenure={tenure}
          tenurePrices={tenurePrices}
          coverAmount={coverAmount}
          compulsoryAddons={compulsoryAddons}
          fullAddonsName={fullAddonsName}
          selectedAddons={selectedAddons}
          addons={addons}
          totalPremium={totalPremium}
          applyClicked={applyClicked}
          isAddOnsModified={isAddOnsModified}
        />
      </div>

      {isSlideOpen && (
        <SlidePanel
          isSlideOpen={isSlideOpen}
          setIsSlideOpen={setIsSlideOpen}
          pincode={pincode}
          memberName={memberName}
          setPincode={setPincode}
          setMemberName={setMemberName}
        />
      )}
    </div>
  );
}
