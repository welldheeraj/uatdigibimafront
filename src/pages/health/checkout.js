"use client";
import React, { useEffect, useState, useMemo } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import constant from "../../env";
import { CallApi } from "../../api";

export default function ProposalUI() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const basePremium = 14537;
  const totalPremium =
    basePremium + 62 + 832 + 1038 + 2561 + 919 + 802 + 1473 + 1381;
  const { register, handleSubmit, watch } = useForm();

  const [addons, setAddons] = useState({});
  const [fullAddonsName, setFullAddonsName] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState({});
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

  useEffect(() => {
    CallApi(constant.API.HEALTH.CHECKOUT)
      .then((r) => {
        console.log("Resolved Data:", r);
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
      .catch(console.error);
  }, []);

  // console.log(tenureOptions);
  // console.log(tenure);
useEffect(() => {
  const fetchData = async () => {
    const newTenurePrices = {}; // Initialize an object to store prices per tenure

    for (const tenure of tenureOptions) {
      const data = { tenure };

      try {
        const response = await CallApi(
          constant.API.HEALTH.PlANCHECKOUT,
          "POST",
          data
        );
        
        if (response.data?.status) {
          const price = response.data.premium; 
          newTenurePrices[tenure] = price;  
        }
      } catch (error) {
        console.error("Error for tenure", tenure, error);
      }
    }
    setTenurePrices(newTenurePrices);
  };

  if (tenureOptions?.length) {
    fetchData();
  }
}, [tenureOptions]);

//  console.log(baseAmount);

  return (
    <div className="bg-[#C8EDFE] min-h-screen px-4 sm:px-10 lg:px-20 py-6">
      <button
        className="text-sm text-gray-700 mb-4"
        onClick={() => router.push(constant.ROUTES.HEALTH.PLANS)}
      >
        ← Go back to Previous
      </button>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1">
          {/* Cover Amount */}
          <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-6">
            <div>
              <div className="font-semibold">Cover Amount</div>
              <div className="text-sm">Is this cover amount sufficient?</div>
            </div>
            <select
              className="bg-white text-black border border-gray-400 px-4 py-1 rounded-md shadow"
              value={coverAmount}
              onChange={(e) => setCoverAmount(e.target.value)}
            >
              {coverageOptions.map((amt) => (
                <option key={amt} value={amt}>
                  {amt === 100 ? "1 Cr" : `${amt} Lac`}
                </option>
              ))}
            </select>
          </div>

          {/* Policy Period */}
          <div className="bg-white rounded-xl p-4 px-8 mb-6">
            <div className="font-semibold text-lg mb-2">Policy Period</div>
            <div className="text-sm text-gray-600 mb-4">
              Choosing a multi-year plan saves your money and the trouble of
              remembering yearly renewals.
            </div>

            <div className="flex flex-wrap gap-4">
  {tenureOptions.map((year) => (
    <label
      key={year}
      className={`relative flex items-center gap-2 px-6 py-3 border rounded-xl cursor-pointer transition-all duration-200 flex-1 min-w-[160px] max-w-full ${tenure == year ? "border-pink-500" : "border-gray-400"}`}
    >
      {tenure == year && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70" />
      )}
      <input
        type="radio"
        name="policyPeriod"
        value={year}
        checked={tenure == year}
        onChange={() => setTenure(year)}
        className="form-checkbox accent-pink-500 h-4 w-4 cursor-pointer"
      />
      <span className="text-sm text-black font-medium">
        {year} {year === 1 ? "Year" : "Years"} 
        {tenurePrices[year] && `- ₹${tenurePrices[year].toLocaleString()}`}
      </span>
      <div className="h-6 w-20 bg-gray-300 rounded animate-pulse mx-auto"></div>
    </label>
  ))}
</div>

          </div>

          {/* Add-Ons */}
          <div className="bg-white rounded-xl p-4 px-6 mb-6">
            <form
              onSubmit={handleSubmit((data) => {
                const selectedKeys = Object.entries(data.addons || {})
                  .filter(([_, checked]) => checked)
                  .map(([key]) => key);

                console.log("Selected Optional Add-Ons:", selectedKeys);
              })}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-semibold text-lg">Add-On</div>
                  <div className="text-base text-gray-600">
                    You should get these additional benefits to enhance your
                    current plan.
                  </div>
                </div>
                <button type="submit" className="px-6 py-1 thmbtn">
                  Apply
                </button>
              </div>
              {Object.entries(addons)
                .filter(([key]) => !compulsoryAddons.includes(key))
                .map(([key, price]) => (
                  <div
                    key={key}
                    className="border rounded-2xl p-4 mb-4 flex justify-between items-center"
                  >
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-base text-black mb-1">
                        {fullAddonsName[key] || key}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        Covers specific health events with added protection and
                        faster claims.
                      </div>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                      <div className="text-[14px] text-gray-800 text-center leading-tight">
                        <div className="font-medium">Premium</div>
                        <div className="font-bold text-sm">
                          ₹{price.toLocaleString()}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register(`addons.${key}`)}
                        className="accent-purple-500 w-4 h-4 rounded"
                      />
                    </label>
                  </div>
                ))}

              <div className="flex justify-end items-right mb-4">
                <button type="submit" className="px-6 py-1 thmbtn">
                  Apply
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 flex justify-between items-start">
            <div>
              <div className="font-semibold text-base text-black">
                Members Covered
              </div>
              <div className="text-sm text-gray-600 mt-1">Akash (1)</div>
            </div>
            <button
              onClick={() => console.log("Edit Members Clicked")}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition"
            >
              Edit Members
            </button>
          </div>
        </div>

        {/* Right Section: Summary */}
        <div className="w-full lg:w-[415px] bg-white rounded-2xl shadow-sm p-6 text-sm font-[Inter] self-start">
          <h2 className="text-base font-semibold text-[#003366] mb-1">
            Summary
          </h2>

          <div className="flex items-center justify-between  text-sm font-semibold text-black mb-3">
            <p className="text-gray-600 mb-1">Base Premium - 2 year</p>₹{" "}
            {basePremium.toLocaleString()}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coverage</span>
            <span className="font-semibold text-black">
              {coverAmount === 100 ? "1 Cr" : `${coverAmount} Lac`}
            </span>
          </div>

          <p className="text-sm font-semibold text-[#003366] mt-2 mb-2">
            Add-On(s) benefits
          </p>

          <div className="space-y-1 text-gray-700">
            {compulsoryAddons.map((key) => (
              <div className="flex justify-between" key={key}>
                <span>{fullAddonsName[key] || key}</span>
                <span>₹{addons[key]?.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t pt-3 font-semibold text-black">
            <span>Total Premium</span>
            <span>₹ {totalPremium.toLocaleString()}</span>
          </div>

          <button
            onClick={() => router.push(constant.ROUTES.HEALTH.PROPOSAL)}
            className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn"
          >
            Proceed to Proposal <BsArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
