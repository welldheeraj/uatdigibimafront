"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
import { FiInfo, FiDownload } from "react-icons/fi";
import { showError } from "@/layouts/toaster";

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
  console.log(totalPremium)
  const router = useRouter();
  const pathname = usePathname();
  const isStepFour = currentStep === 4;
  const isCheckoutPage = pathname.includes("/health/vendors/bajaj/checkout");
  const isJourneyPage = pathname.includes("/health/vendors/bajaj/journey");

  const [priceChangeMsg, setPriceChangeMsg] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);

  const prevPricesRef = useRef({});
  const prevTotalRef = useRef(totalPremium);

  const formatAmount = (amt) => (Number(amt) === 100 ? "1 Cr" : `${amt} Lac`);
  const formatPrice = (val) => `₹ ${(val || 0).toLocaleString()}`;
  const selectedTenurePrice = tenurePrices[tenure] || 0;

  // ✅ Helper: normalize & find correct Addon Name
  const getAddonName = (key) => {
    const cleanedKey = key.replace(/[0-9]+$/g, "").replace(/SIMAX\d*/i, "").trim();
    const baseMatch = Object.keys(fullAddonsName).find((name) =>
      key.startsWith(name)
    );
    return (
      fullAddonsName[key] ||
      fullAddonsName[cleanedKey] ||
      (baseMatch ? fullAddonsName[baseMatch] : key)
    );
  };

  // Detect premium change animation
  useEffect(() => {
    if (Object.keys(prevPricesRef.current).length === 0) {
      prevPricesRef.current = tenurePrices;
      return;
    }
    if (JSON.stringify(prevPricesRef.current) !== JSON.stringify(tenurePrices)) {
      setPriceLoading(true);
      prevPricesRef.current = tenurePrices;
      setTimeout(() => setPriceLoading(false), 600);
    }
  }, [tenurePrices]);

  // Detect total premium change message
  useEffect(() => {
    if (prevTotalRef.current && prevTotalRef.current !== totalPremium) {
      const oldPrice = formatPrice(prevTotalRef.current);
      const newPrice = formatPrice(totalPremium);
      const isPincodeChanged = oldPincode?.trim() && newPincode?.trim();

      setPriceChangeMsg(
        isPincodeChanged
          ? `The PIN code in your address (${oldPincode}) is different from the PIN code you chose while taking quote (${newPincode}). Hence, the total premium is revised from ${oldPrice} to ${newPrice}.`
          : `You have changed your plan, members, or coverage. Hence, the total premium is revised from ${oldPrice} to ${newPrice}.`
      );
    }
    prevTotalRef.current = totalPremium;
  }, [totalPremium, oldPincode, newPincode]);

  const handleProceed = () => {
    if (isAddOnsModified && !applyClicked) {
      showError("Please click Apply to save your AddOns changes before proceeding.");
      return;
    }

    const params = new URLSearchParams({
      tenure,
      coverAmount,
      totalPremium,
      selectedAddons: JSON.stringify(selectedAddons),
      compulsoryAddons: JSON.stringify(compulsoryAddons),
      tenurePrices: JSON.stringify(tenurePrices),
      addons: JSON.stringify(addons),
      fullAddonsName: JSON.stringify(fullAddonsName),
    });

    router.push(`/health/vendors/bajaj/journey?${params.toString()}`);
  };

  const handleBrowse = () =>
    window.open(
      "https://stage.digibima.com/public/broucher/caresupreme.pdf",
      "_blank"
    );

  return (
    <div className="w-full lg:w-[415px] bg-white rounded-[32px] shadow-sm p-6 text-sm self-start">
      <h2 className="text-base font-semibold text-[#003366] mb-1">Summary</h2>

      {/* Base Premium */}
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

      {/* Coverage */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Coverage</span>
        <span className="font-semibold text-black">
          {formatAmount(coverage || coverAmount)}
        </span>
      </div>

      {/* Compulsory Add-ons (Names Only) */}
      <p className="text-sm font-semibold text-[#003366] mt-4 mb-2">
        Add-On(s) benefits
      </p>
      <div className="space-y-1 text-gray-700">
        {compulsoryAddons.length > 0 ? (
          compulsoryAddons.map((key) => (
            <div className="flex justify-between" key={key}>
              <span>{getAddonName(key)}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs">No mandatory add-ons.</div>
        )}
      </div>

      {/* Selected Add-ons (Names Only) */}
      {selectedAddons && Object.values(selectedAddons).length > 0 && (
        <>
          <p className="text-sm font-semibold text-[#003366] mt-6 mb-2">
            Selected Optional Add-Ons
          </p>
          <div className="space-y-1 text-gray-700">
            {Object.entries(selectedAddons).map(([k, key]) => (
              <div className="flex justify-between" key={k}>
                <span>{getAddonName(key)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Price Change Tooltip */}
      <div className="mt-4 border-t pt-3 font-semibold text-black">
        {priceChangeMsg && (
          <div className="flex justify-end items-center gap-2 mt-1">
            <div className="relative group">
              <span className="text-blue-600 text-sm underline cursor-pointer">
                Why Price Change
              </span>
              <div className="absolute right-0 top-full mt-1 w-[300px] p-3 bg-gradient-to-br from-teal-100 to-blue-50 text-gray-800 text-sm rounded-xl shadow-lg border border-blue-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out z-10 whitespace-normal pointer-events-none">
                <p className="leading-relaxed text-[13px]">{priceChangeMsg}</p>
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

      {/* Buttons */}
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
