"use client";
import React from "react";
import { Controller } from "react-hook-form";
import constant from "@/env";

export default function StepThreeForm({
  step3Form,
  onSubmitStep,
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6 w-full">
      <h2 className="text-xl font-bold text-gray-800">
        Help us know the medical condition, if any
      </h2>

      {/* Medical History */}
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-700 mb-2">Medical History:</h3>

        {Object.entries(constant.BAJAJQUESTION.HEALTH).map(([key, q]) => (
          <div key={key} className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-medium flex-1 min-w-[200px]">
              {`${key}. ${q.label || q}`}
            </label>
            <Controller
              name={q.name}
              control={step3Form.control}
              defaultValue="N"
              render={({ field }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value === "Y"}
                    onChange={(e) => field.onChange(e.target.checked ? "Y" : "N")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              )}
            />
          </div>
        ))}
      </div>

      {/* Lifestyle History */}
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-700 mb-2">Lifestyle History:</h3>

        {Object.entries(constant.BAJAJQUESTION.LIFESTYLE).map(([key, q]) => (
          <div key={key} className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-medium flex-1 min-w-[200px]">
              {`${key}. ${q.label || q}`}
            </label>
            <Controller
              name={q.name}
              control={step3Form.control}
              defaultValue="N"
              render={({ field }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value === "Y"}
                    onChange={(e) => field.onChange(e.target.checked ? "Y" : "N")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              )}
            />
          </div>
        ))}
      </div>

      {/* Agreement Checkboxes */}
      <div className="space-y-2 text-sm text-gray-700">
        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            {...step3Form.register("agreeTnC", { required: true })}
            className="cursor-pointer accent-pink-500 h-4 w-4"
          />
          <span>
            I hereby agree to the{" "}
            <a className="text-blue-600 underline">Terms & Conditions</a> of the
            purchase of this policy. *
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmitStep}
        className="mt-4 px-6 py-2 thmbtn w-full sm:w-auto"
      >
        Continue
      </button>
    </form>
  );
}
