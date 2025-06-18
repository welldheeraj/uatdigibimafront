"use client";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/navigation";
import constant from "../../env";

export default function ProposalUI() {
   const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([true, true, true]);
  const [coverAmount, setCoverAmount] = useState("5 Lac");
  const basePremium = 14537;
  const totalPremium =
    basePremium + 62 + 832 + 1038 + 2561 + 919 + 802 + 1473 + 1381;

  return (
    <div className="bg-[#C8EDFE] min-h-screen px-4 sm:px-10 lg:px-20 py-6">
      <button className="text-sm text-gray-700 mb-4"  onClick={() => router.push(constant.ROUTES.HEALTH.PLANS)}>
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
              <option>5 Lac</option>
              <option>10 Lac</option>
              <option>20 Lac</option>
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
              {[1, 2, 3].map((year, index) => (
                <label
                  key={index}
                  className={`relative flex items-center gap-2 px-6 py-3 border rounded-xl cursor-pointer transition-all duration-200 flex-1 min-w-[160px] max-w-full ${
                    selectedPeriod === index
                      ? "border border-gray-400"
                      : "border border-gray-400"
                  }`}
                >
                  {selectedPeriod === index && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
                  )}
                  <input
                    type="radio"
                    name="policyPeriod"
                    value={year}
                    checked={selectedPeriod === index}
                    onChange={() => setSelectedPeriod(index)}
                    className="form-checkbox accent-pink-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-sm text-black font-medium">
                    {year} Year @
                  </span>
                </label>
              ))}
            </div>


          </div>

          {/* Add-Ons */}
          <div className="bg-white rounded-xl p-4 px-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-semibold text-lg">Add-On</div>
                  <div className="text-base text-gray-600">
                    You should get these additional benefits to enhance your current plan.
                  </div>
                </div>
                <button className="px-6 py-1 thmbtn">
                  Apply
                </button>
              </div>

              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 mb-4 flex justify-between items-center"
                >
                  <div className="flex-1 pr-4">
                    <div className="font-semibold text-base text-black mb-1">
                      Instant Cover
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      Claim can be made for hospitalization related to Diabetes, Hypertension,
                      Hyperlipidemia & Asthma after initial wait period of 30 days.
                    </div>
                  </div>

            <div
              className="flex items-center justify-between cursor-pointer gap-2 px-4 py-2 border border-gray-400 rounded-xl min-w-[120px]"
              onClick={() => {
                const newAddOns = [...selectedAddOns];
                newAddOns[index] = !newAddOns[index]; 
                setSelectedAddOns(newAddOns);
              }}
            >
              <div className="text-[14px] text-gray-800 text-center leading-tight">
                <div className="font-medium">Premium</div>
                <div className="font-bold text-sm">2561</div>
              </div>
              <input
                type="checkbox"
                checked={selectedAddOns[index]}
                onChange={() => {}}
                className="accent-purple-500 w-4 h-4 rounded"
              />
            </div>



                </div>
              ))}
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
          <p className="text-gray-600 mb-1">Base Premium - 2 year</p>
          <div className="text-right text-sm font-semibold text-black mb-3">
            ₹ {basePremium.toLocaleString()}
          </div>

          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Coverage</span>
            <span className="font-semibold text-black">{coverAmount}</span>
          </div>

          <p className="text-sm font-semibold text-[#003366] mt-4 mb-2">
            Add-On(s) benefits
          </p>

          <div className="space-y-1 text-gray-700">
            {[
              ["Wellness Benefit", 62],
              ["Air Ambulance", 832],
              ["Cumulative Bonus Super", 1038],
              ["Instant Cover", 2561],
              ["Annual Health Check-up", 919],
              ["Claim Shield", 802],
              ["Befit Benefit", 1473],
              ["OPD Care", 1381],
            ].map(([label, value]) => (
              <div className="flex justify-between" key={label}>
                <span>{label}</span>
                <span>₹{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t pt-3 font-semibold text-black">
            <span>Total Premium</span>
            <span>₹ {totalPremium.toLocaleString()}</span>
          </div>

          <button onClick={() => router.push(constant.ROUTES.HEALTH.PROPOSAL)} className="w-full mt-4 py-2 flex items-center justify-center gap-2 thmbtn">
            Proceed to Proposal <BsArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
