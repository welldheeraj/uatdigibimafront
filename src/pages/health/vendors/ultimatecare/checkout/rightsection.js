"use client";

import { useRouter, usePathname } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { showSuccess, showError }  from "@/layouts/toaster";
import { FiInfo } from "react-icons/fi";
import { CallApi } from "@/api";
import constant from "@/env.js";
export default function SummaryCard({
  tenure = "",
  tenurePrices = {},
  coverAmount = "",
  selectedAddons = [],
  compulsoryAddons = [],
  fullAddonsName = {},
  addons = {},
  totalPremium = 0,
  basePremium = 0,    // NEW
  coverage = 0,       // NEW
  currentStep = 1,
  onGoToPayment,
  applyClicked,
  isAddOnsModified,
  oldPincode,
  newPincode
}) {
  const [priceChangeMsg, setPriceChangeMsg] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isStepFour = currentStep === 4;
  const isJourneyPage = pathname.includes("/health/vendors/ultimatecare/journey");

  const [priceLoading, setPriceLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);
  const [totalLoading, setTotalLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const prevPricesRef = useRef({});
  const prevAddonsRef = useRef([]);
  const prevTotalRef = useRef(totalPremium);

  const formatAmount = (amt) => (Number(amt) === 100 ? "1 Cr" : `${amt} Lac`);
  const formatPrice = (val) => `₹ ${(val || 0).toLocaleString()}`;
  const selectedTenurePrice = tenurePrices[tenure] || 0;

  useEffect(() => {
    if (Object.keys(prevPricesRef.current).length === 0) {
      prevPricesRef.current = tenurePrices;
      return;
    }
    if (
      JSON.stringify(prevPricesRef.current) !== JSON.stringify(tenurePrices)
    ) {
      setPriceLoading(true);
      prevPricesRef.current = tenurePrices;
      setTimeout(() => setPriceLoading(false), 600);
    }
  }, [tenurePrices]);

  useEffect(() => {
    const currentAddonValues = compulsoryAddons.map((key) => addons[key] || 0);
    if (
      JSON.stringify(prevAddonsRef.current) !==
      JSON.stringify(currentAddonValues)
    ) {
      setAddonLoading(true);
      prevAddonsRef.current = currentAddonValues;
      setTimeout(() => setAddonLoading(false), 600);
    }
  }, [addons, compulsoryAddons]);

useEffect(() => {
  if (prevTotalRef.current && prevTotalRef.current !== totalPremium) {
    const oldPrice = formatPrice(prevTotalRef.current);
    const newPrice = formatPrice(totalPremium);

    setPriceChangeMsg(
      `The PIN code in your address (${oldPincode}) is different from the PIN code you chose while taking quote (${newPincode}). Hence, the total premium is revised from ${oldPrice} to ${newPrice}.`
    );
  }
  prevTotalRef.current = totalPremium;
},  [totalPremium, oldPincode, newPincode]);
 

  const handleProceed = () => {
    if (isAddOnsModified && !applyClicked) {
      showError(
        "Please click Apply to save your AddOns changes before proceeding."
      );
      return;
    }
console.log('hello total' ,totalPremium)
    const params = new URLSearchParams();
    params.append("tenure", tenure);
    params.append("coverAmount", coverAmount);
    params.append("totalPremium", totalPremium);
    params.append("selectedAddons", JSON.stringify(selectedAddons));
    params.append("compulsoryAddons", JSON.stringify(compulsoryAddons));
    params.append("tenurePrices", JSON.stringify(tenurePrices));
    params.append("addons", JSON.stringify(addons));
    params.append("fullAddonsName", JSON.stringify(fullAddonsName));
    setLoading(true);
    router.push(`/health/vendors/ultimatecare/journey?${params.toString()}`);
  };

  return (
    <div className="w-full lg:w-[415px] bg-white rounded-2xl shadow-sm p-6 text-sm self-start">
      <h2 className="text-base font-semibold text-[#003366] mb-1">Summary</h2>

      <div className="flex items-center justify-between text-sm font-semibold text-black mb-3">
        <p className="text-gray-600 mb-1">
          Base Premium - {tenure} {tenure === 1 ? "Year" : "Years"}
        </p>
        {priceLoading ? (
          <span className="flex items-center space-x-1 animate-bounce">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            <div className="w-2 h-2 bg-gray-500 rounded-full delay-150" />
            <div className="w-2 h-2 bg-gray-500 rounded-full delay-300" />
          </span>
        ) : (
          <span>{formatPrice(basePremium || selectedTenurePrice)}</span>
        )}
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Coverage</span>
        <span className="font-semibold text-black">
           {formatAmount(coverage || coverAmount)}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#003366] mt-4 mb-2">
        Add-On(s) benefits
      </p>
      <div className="space-y-1 text-gray-700">
        {compulsoryAddons.length > 0 ? (
          compulsoryAddons.map((key) => (
            <div className="flex justify-between" key={key}>
              <span>{fullAddonsName[key] || key}</span>
              {addonLoading ? (
                <span className="flex items-center space-x-1 animate-bounce">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full delay-150" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full delay-300" />
                </span>
              ) : (
                <span>{formatPrice(addons[key])}</span>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs">No mandatory add-ons.</div>
        )}
      </div>

      {selectedAddons && Object.values(selectedAddons).length > 0 && (
        <>
          <p className="text-sm font-semibold text-[#003366] mt-6 mb-2">
            Selected Optional Add-Ons
          </p>
          <div className="space-y-1 text-gray-700">
            {Object.entries(selectedAddons).map(([k, key]) => {
              if (
                (key === "1" || key === "2") &&
                Object.values(selectedAddons).includes("ped")
              ) {
                return null;
              }

              let addonKey = key;
              let rightSide = formatPrice(addons[key]);

              if (key === "ped") {
                const pedDurationEntry = Object.entries(selectedAddons).find(
                  ([_, val]) => val === "1" || val === "2"
                );

                if (pedDurationEntry?.[1] === "1") {
                  rightSide = "1 Year";
                } else if (pedDurationEntry?.[1] === "2") {
                  rightSide = "2 Years";
                } else {
                  rightSide = "Duration Not Set";
                }
              }

              return (
                <div className="flex justify-between" key={k}>
                  <span>{fullAddonsName[addonKey] || addonKey}</span>
                  <span>{rightSide}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

   <div className="mt-4 border-t pt-3 font-semibold text-black relative">

  {/* Why Price Change */}
    {priceChangeMsg && (
  <div className="flex justify-end mb-3 relative">
    <div className="flex items-center gap-1 group cursor-pointer">
      <span className="text-blue-600 text-sm underline">Why Price Change</span>
     <span className="text-gray-400 text-xs">
  <FiInfo size={14} />
</span>

      {/* Tooltip Box */}
      <div className="absolute right-0 top-5 w-100 p-4 bg-gradient-to-br from-teal-100 to-blue-50 
        text-gray-800 text-sm rounded-xl shadow-lg border border-blue-200 
        opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 
        transition-all duration-300 ease-out z-10">
        <p className="leading-relaxed text-[13px]">
          {priceChangeMsg}
        </p>
      </div>
    </div>
  </div>
     )}

  {/* Total Premium */}
  <div className="flex justify-between">
    <span>Total Premium</span>
    <span>{formatPrice(totalPremium)}</span>
  </div>
</div>

      {!isJourneyPage && (
        <button
          onClick={handleProceed}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
        >
          Proceed to Proposal <BsArrowRight />
        </button>
      )}

      {isJourneyPage && isStepFour && (
        <button
          onClick={onGoToPayment}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
        >
          Go to Payment
        </button>
      )}
    </div>
  );
}
