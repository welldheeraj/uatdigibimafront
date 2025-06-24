// ✅ File: components/proposal/StepThreeForm.jsx
"use client";
import React from "react";

export default function StepThreeForm({ step3Form, onSubmitStep }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        Help us know the medical condition, if any
      </h2>

      {/* Medical History */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Medical History:</h3>
        <div className="flex items-center justify-between">
          <label className="text-sm">
            1. Has any person been diagnosed/treated for any condition?
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...step3Form.register("hasMedicalCondition")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
          </label>
        </div>
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm">
            2. Details of previous or existing health insurance?
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...step3Form.register("hasPreviousInsurance")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
          </label>
        </div>
      </div>

      {/* Lifestyle History */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Lifestyle History:</h3>
        <div className="flex items-center justify-between">
          <label className="text-sm">
            1. Personal habit of smoking/alcohol/gutkha/tobacco/paan?
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...step3Form.register("hasLifestyleHabits")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
          </label>
        </div>
      </div>

      {/* Agreement Checkboxes */}
      <div className="space-y-2 text-sm text-gray-700">
        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            {...step3Form.register("agreeTnC", { required: true })}
          />
          <span>
            I hereby agree to the{" "}
            <a className="text-blue-600 underline">Terms & Conditions</a> of the
            purchase of this policy. *
          </span>
        </label>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            {...step3Form.register("standingInstruction")}
          />
          <span>
            I would also like to add Standing Instruction on my credit card for
            automatic future renewal premiums.
          </span>
        </label>

        <label className="flex gap-2 items-start">
          <input type="checkbox" {...step3Form.register("optForEMI")} />
          <span>
            I would like to opt for the EMI (Equated Monthly Installment) option
            for payment of premiums.
          </span>
        </label>

        <label className="flex gap-2 items-start">
          <input type="checkbox" {...step3Form.register("autoDebitBank")} />
          <span>
            I authorize the auto-debit of premiums from my bank account for
            automatic payment.
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmitStep}
        className="mt-4 px-6 py-2 thmbtn"
      >
        Continue
      </button>
    </form>
  );
}
