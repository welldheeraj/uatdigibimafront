"use client";

import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import constant from "../../../env";

export default function SummaryCard({
  tenure = "",
  tenurePrices = {},
  coverAmount = "",
  selectedAddons = [],
  compulsoryAddons = [],
  fullAddonsName = {},
  addons = {},
  totalPremium = 0,
}) {
  const router = useRouter();
  console.log("selectedAddonsdfdfsdsfdf:", selectedAddons);

  const formatAmount = (amt) => (Number(amt) === 100 ? "1 Cr" : `${amt} Lac`);
  const formatPrice = (val) => `₹ ${(val || 0).toLocaleString()}`;

  const selectedTenurePrice = tenurePrices[tenure] || 0;
  const selectedAddonPrices = compulsoryAddons.map((key) => addons[key] || 0);

  const [priceLoading, setPriceLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);
  const [totalLoading, setTotalLoading] = useState(false);

  const prevPricesRef = useRef({});
  const prevAddonsRef = useRef([]);
  const prevTotalRef = useRef(totalPremium);

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
    if (prevTotalRef.current !== totalPremium) {
      setTotalLoading(true);
      prevTotalRef.current = totalPremium;
      setTimeout(() => setTotalLoading(false), 600);
    }
  }, [totalPremium]);

  return (
    <div className="w-full lg:w-[415px] bg-white rounded-2xl shadow-sm p-6 text-sm  self-start">
      <h2 className="text-base font-semibold text-[#003366] mb-1">Summary</h2>

      <div className="flex items-center justify-between text-sm font-semibold text-black mb-3">
        <p className="text-gray-600 mb-1">
          Base Premium - {tenure} {tenure === 1 ? "Year" : "Years"}
        </p>
        {priceLoading ? (
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
          </span>
        ) : (
          <span>{formatPrice(selectedTenurePrice)}</span>
        )}
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Coverage</span>
        <span className="font-semibold text-black">
          {formatAmount(coverAmount)}
        </span>
      </div>

      {/* Add-On(s) benefits - compulsory */}
      <p className="text-sm font-semibold text-[#003366] mt-4 mb-2">
        Add-On(s) benefits
      </p>
      <div className="space-y-1 text-gray-700">
        {compulsoryAddons.length > 0 ? (
          compulsoryAddons.map((key) => (
            <div className="flex justify-between" key={key}>
              <span>{fullAddonsName[key] || key}</span>
              {addonLoading ? (
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
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

      {/* Selected Optional Addons */}
      {selectedAddons && Object.values(selectedAddons).length > 0 && (
        <>
          <p className="text-sm font-semibold text-[#003366] mt-6 mb-2">
            Selected Optional Add-Ons
          </p>
          <div className="space-y-1 text-gray-700">
            {Object.values(selectedAddons).map((key) => (
              <div className="flex justify-between" key={key}>
                <span>{fullAddonsName[key] || key}</span>
                <span>{formatPrice(addons[key])}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex justify-between border-t pt-3 font-semibold text-black">
        <span>Total Premium</span>
        {totalLoading ? (
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
          </span>
        ) : (
          <span></span>
        )}
      </div>

      <button
        onClick={() => router.push(constant.ROUTES.HEALTH.PROPOSAL)}
        className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
      >
        Proceed to Proposal <BsArrowRight />
      </button>
    </div>
  );
}
