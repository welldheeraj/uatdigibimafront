"use client";

import { useRouter, usePathname } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { showError } from "@/layouts/toaster";
import { FiInfo, FiDownload } from "react-icons/fi";

export default function SummaryCard({
  tenure = "",
  tenurePrices = {},
  coverAmount = "",
  selectedAddons = [],
  compulsoryAddons = [],
  fullAddonsName = {},
  addons = {},
  totalPremium = 0,
  basePremium = 0,
  coverage = 0,
  currentStep = 1,
  onGoToPayment,
  applyClicked,
  isAddOnsModified,
  oldPincode,
  newPincode,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isStepFour = currentStep === 4;

  const isCheckoutPage = pathname.includes(
    "/health/vendors/ultimatecare/checkout"
  );
  const isJourneyPage = pathname.includes(
    "/health/vendors/ultimatecare/journey"
  );

  const [priceChangeMsg, setPriceChangeMsg] = useState("");

  const [priceLoading, setPriceLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);

  const prevPricesRef = useRef({});
  const prevAddonsRef = useRef([]);
  const prevTotalRef = useRef(totalPremium);

  const formatAmount = (amt) =>
    Number(amt) === 100 ? "1 Cr" : `${amt} Lac`;

  const formatPrice = (val) =>
    `₹ ${(val || 0).toLocaleString()}`;

  const selectedTenurePrice = tenurePrices[tenure] || 0;

  /* --------------------------- PRICE LOADING ANIMATION ---------------------------- */

  useEffect(() => {
    if (Object.keys(prevPricesRef.current).length === 0) {
      prevPricesRef.current = tenurePrices;
      return;
    }
    if (
      JSON.stringify(prevPricesRef.current) !==
      JSON.stringify(tenurePrices)
    ) {
      setPriceLoading(true);
      prevPricesRef.current = tenurePrices;
      setTimeout(() => setPriceLoading(false), 600);
    }
  }, [tenurePrices]);

  /* --------------------------- ADDON LOADING ANIMATION ---------------------------- */

  useEffect(() => {
    const currentAddonValues = compulsoryAddons.map(
      (key) => addons[key] || 0
    );

    if (
      JSON.stringify(prevAddonsRef.current) !==
      JSON.stringify(currentAddonValues)
    ) {
      setAddonLoading(true);
      prevAddonsRef.current = currentAddonValues;
      setTimeout(() => setAddonLoading(false), 600);
    }
  }, [addons, compulsoryAddons]);

  /* --------------------------- PRICE CHANGE MESSAGE ---------------------------- */

  useEffect(() => {
    if (prevTotalRef.current && prevTotalRef.current !== totalPremium) {
      const oldPrice = formatPrice(prevTotalRef.current);
      const newPrice = formatPrice(totalPremium);

      const isPincodeChanged = oldPincode?.trim() && newPincode?.trim();

      if (isPincodeChanged) {
        setPriceChangeMsg(
          `The PIN code in your address (${oldPincode}) is different from the PIN code you chose while taking quote (${newPincode}). Hence, the total premium is revised from ${oldPrice} to ${newPrice}.`
        );
      } else {
        setPriceChangeMsg(
          `You have changed your plan, members, or coverage. Hence, the total premium is revised from ${oldPrice} to ${newPrice}.`
        );
      }
    }
    prevTotalRef.current = totalPremium;
  }, [totalPremium, oldPincode, newPincode]);

  /* --------------------------- PROCEED BUTTON CHECK ---------------------------- */

  const handleProceed = () => {
    if (isAddOnsModified && !applyClicked) {
      showError(
        "Please click Apply to save your AddOns changes before proceeding."
      );
      return;
    }

    const params = new URLSearchParams();
    params.append("tenure", tenure);
    params.append("coverAmount", coverAmount);
    params.append("totalPremium", totalPremium);
    params.append("selectedAddons", JSON.stringify(selectedAddons));
    params.append("compulsoryAddons", JSON.stringify(compulsoryAddons));
    params.append("tenurePrices", JSON.stringify(tenurePrices));
    params.append("addons", JSON.stringify(addons));
    params.append("fullAddonsName", JSON.stringify(fullAddonsName));

    router.push(`/health/vendors/ultimatecare/journey?${params.toString()}`);
  };

  const handleBrowse = () => {
    window.open(
      "https://stage.digibima.com/public/broucher/ultimatecare.pdf",
      "_blank"
    );
  };

  /* --------------------------- OPD Adjuster ---------------------------- */

  const isOpdVariant = (val) => val === "opd500" || val === "opd5000";

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="w-full lg:w-[415px] bg-white rounded-[32px] shadow-sm p-6 text-sm self-start">

      <h2 className="text-base font-semibold text-[#003366] mb-1">
        Summary
      </h2>

      {/* --------------------------- BASE PREMIUM ---------------------------- */}

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

      {/* --------------------------- COVERAGE ---------------------------- */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Coverage</span>
        <span className="font-semibold text-black">
          {formatAmount(coverage || coverAmount)}
        </span>
      </div>

      {/* --------------------------- ADDONS BENEFITS ---------------------------- */}

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

      {/* --------------------------- OPTIONAL ADDONS ---------------------------- */}

      {selectedAddons && Object.values(selectedAddons).length > 0 && (
        <>
          <p className="text-sm font-semibold text-[#003366] mt-6 mb-2">
            Selected Optional Add-Ons
          </p>

          <div className="space-y-1 text-gray-700">
            {Object.entries(selectedAddons).map(([k, val]) => {
              const valueStr = String(val);

              // Hide PED duration duplicate
              if (
                (val === "1" || val === "2") &&
                Object.values(selectedAddons).includes("ped")
              ) {
                return null;
              }

              let displayKey;
              let rightSide;

              if (isOpdVariant(valueStr)) {
                displayKey = "opd";
                rightSide = formatPrice(addons.opd || 0);
              } else if (valueStr === "ped" || k === "ped") {
                displayKey = "ped";

                const duration = Object.values(selectedAddons).find(
                  (v) => v === "1" || v === "2"
                );

                rightSide =
                  duration === "1"
                    ? "1 Year"
                    : duration === "2"
                    ? "2 Years"
                    : "Duration Not Set";
              } else {
                displayKey = valueStr;
                rightSide =
                  formatPrice(addons[valueStr] || addons[k] || 0);
              }

              return (
                <div className="flex justify-between" key={k}>
                  <span>{fullAddonsName[displayKey] || displayKey}</span>
                  <span>{rightSide}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* --------------------------- TOTAL PREMIUM ---------------------------- */}

      <div className="mt-4 border-t pt-3 font-semibold text-black">

        {/* Why price change tooltip */}
        {priceChangeMsg && (
          <div className="flex justify-end items-center gap-2 mt-1">
            <div className="relative group">
              <span className="text-blue-600 text-sm underline cursor-pointer">
                Why Price Change
              </span>

              <div
                className="absolute right-0 top-full mt-1 w-[300px] p-3 bg-gradient-to-br 
                from-teal-100 to-blue-50 text-gray-800 text-sm rounded-xl shadow-lg 
                border border-blue-200 opacity-0 group-hover:opacity-100 
                translate-y-2 group-hover:translate-y-0 transition-all duration-300 
                ease-out z-10 whitespace-normal pointer-events-none"
              >
                <p className="leading-relaxed text-[13px]">
                  {priceChangeMsg}
                </p>
              </div>
            </div>

            <span className="text-gray-400 text-xs">
              <FiInfo size={14} />
            </span>
          </div>
        )}

        <div className="flex justify-between mt-2">
          <span>Total Premium</span>
          <span>{formatPrice(totalPremium)}</span>
        </div>
      </div>

      {/* --------------------------- BUTTONS ---------------------------- */}

      <div>
        {!isJourneyPage && (
          <button
            onClick={handleProceed}
            className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
          >
            Proceed to Proposal <BsArrowRight />
          </button>
        )}

        {isCheckoutPage && (
          <button
            onClick={handleBrowse}
            className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
          >
            Plan Brochure <FiDownload />
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
    </div>
  );
}
