"use client";

import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CoverageAmount from "./coverageamount";
import PolicyPeriodOptions from "./policyperiodoptions";
import AddOnSelection from "./addonselection";
import MemberDetails from "./editmember";
import SummaryCard from "./rightsection";
import SlidePanel from "../../../sidebar/index";
import { CallApi } from "../../../../../api";
import constant from "../../../../../env";

// react-query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProposalUI() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [addons, setAddons] = useState({});
  const [addonsDes, setAddonsDes] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [fullAddonsName, setFullAddonsName] = useState({});
  const [compulsoryAddons, setCompulsoryAddons] = useState([]);
  const [coverageOptions, setCoverageOptions] = useState([]);
  const [coverAmount, setCoverAmount] = useState("");
  const [tenureOptions, setTenureOptions] = useState([]);
  const [tenure, setTenure] = useState("");
  const [tenurePrices, setTenurePrices] = useState({});
  const [totalPremium, setTotalPremium] = useState("");
  const [insurers, setInsurers] = useState([]);
  const [childList, setChildList] = useState([]);
  const [gender, setGender] = useState("");
  const [kycRequired, setKycRequired] = useState(false);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [applyClicked, setApplyClicked] = useState(false);
  const [isAddOnsModified, setIsAddOnsModified] = useState(false);

  // 1. Checkout initial data
  const { data: checkoutData, isLoading: loadingCheckout } = useQuery({
    queryKey: ["checkoutData"],
    queryFn: () => CallApi(constant.API.HEALTH.CARESUPEREME.CHECKOUT),
  });

  // set state when checkoutData comes
  useEffect(() => {
    if (checkoutData) {
      setSelectedAddons(checkoutData.selected_addon || []);
      setAddons(checkoutData["addon value"] || {});
      setFullAddonsName(checkoutData.addonname || {});
      setAddonsDes(checkoutData.addondes || {});
      setCompulsoryAddons(checkoutData.compulsoryaddon || []);
      setCoverageOptions(checkoutData.coveragelist || []);
      setCoverAmount(checkoutData.coverage || "");
      setPincode(checkoutData.pincode || "");
      setTotalPremium(checkoutData.totalamount || "");
      setTenureOptions(checkoutData.tenureList || []);
      setTenure(checkoutData.tenure || "");
      setInsurers(checkoutData.aInsureData || []);
      setChildList(checkoutData.child || []);
      setGender(checkoutData.gender || "");
      setKycRequired(checkoutData.kyc === "1");

      const allMembers = checkoutData.aInsureData || [];
      setMemberName(`Self(${allMembers.length})`);
    }
  }, [checkoutData]);

  // 2. Tenure wise prices (dependent query)
  const { data: pricesData } = useQuery({
    queryKey: ["tenurePrices", coverAmount, tenureOptions],
    queryFn: async () => {
      const newPrices = {};
      for (const t of tenureOptions) {
        try {
          const res = await CallApi(
            constant.API.HEALTH.CARESUPEREME.PlANCHECKOUT,
            "POST",
            { tenure: t, coverage: coverAmount }
          );
          if (res?.data?.premium) newPrices[t] = res.data.premium;
        } catch (err) {
          console.error("Price error:", err);
        }
      }
      return newPrices;
    },
    enabled: !!coverAmount && tenureOptions.length > 0,
  });

  // set tenurePrices when pricesData comes
  useEffect(() => {
    if (pricesData) setTenurePrices(pricesData);
  }, [pricesData]);

  // 3. Filter API (on coverage/tenure change)
  const filterMutation = useMutation({
    mutationFn: (payload) =>
      CallApi(constant.API.HEALTH.FILTERPLAN, "POST", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["checkoutData"]);
      queryClient.invalidateQueries(["tenurePrices"]);
    },
  });

  const handleCoverageOrTenureChange = (type, value) => {
    const updatedPayload =
      type === "coverage"
        ? { coverage: value }
        : { coverage: coverAmount, tenure: value };

    if (type === "coverage") setCoverAmount(value);
    else setTenure(value);

    filterMutation.mutate(updatedPayload);
  };

  const basePremium = tenurePrices[tenure] || 0;

  return (
    <div className="bgcolor min-h-screen px-3 sm:px-10 lg:px-20 py-6">
      <button
        type="button"
        onClick={() => router.push("/health/common/plans")}
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
            setCoverAmount={(val) =>
              handleCoverageOrTenureChange("coverage", val)
            }
            coverageOptions={coverageOptions}
          />

          <PolicyPeriodOptions
            tenureOptions={tenureOptions}
            tenure={tenure}
            setTenure={(val) => handleCoverageOrTenureChange("tenure", val)}
            tenurePrices={tenurePrices}
          />

          <AddOnSelection
            addons={addons}
            addonsDes={addonsDes}
            compulsoryAddons={compulsoryAddons}
            fullAddonsName={fullAddonsName}
            selectedAddons={selectedAddons}
            getCheckoutData={() =>
              queryClient.invalidateQueries(["checkoutData"])
            }
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
