"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { CallApi } from "../../../api";
import constant from "../../../env";

export default function AddOnSelection({
  addons = {},
  compulsoryAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
}) {

  // console.log("selectedAddons:", selectedAddons); 
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const selectedKeys = Object.entries(data.addons || {})
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    console.log("Selected Optional Add-Ons:", selectedKeys);

    try {
      setLoading(true);
      const payload = { addon: selectedKeys };
      const response = await CallApi(constant.API.HEALTH.ADDADDONS, "POST", payload);
      console.log("API Success:", response);

      if (getCheckoutData) getCheckoutData();
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const optionalAddOns = Object.entries(addons).filter(
    ([key]) => !compulsoryAddons.includes(key)
  );

  if (optionalAddOns.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 px-6 mb-6 text-sm text-gray-500">
        No optional add-ons available for this plan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 px-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-base mb-2">Add-On</h2>
            <p className="text-sm text-gray-600">
              You should get these additional benefits to enhance your current plan.
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-1 thmbtn"
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>

        {/* Add-on Cards */}
        {optionalAddOns.map(([key, price]) => {
          const selectedNames = Object.values(selectedAddons).map(v => v.toLowerCase().trim());
          const isChecked = selectedNames.includes(key.toLowerCase().trim());

          return (
            <div
              key={key}
              className="border rounded-2xl p-4 mb-4 flex justify-between items-center"
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-sm text-black mb-1">
                  {fullAddonsName[key] || key}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Covers specific health events with added protection and faster claims.
                </p>
              </div>

              <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                <div className="text-center leading-tight text-sm text-gray-800">
                  <p className="font-medium">Premium</p>
                  <p className="font-bold">₹{Number(price).toLocaleString()}</p>
                </div>
                <input
                  type="checkbox"
                  {...register(`addons.${key}`)}
                  defaultChecked={isChecked}
                  className="accent-purple-500 w-4 h-4"
                />
              </label>
            </div>
          );
        })}

        {/* Bottom Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-1 thmbtn"
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </form>
    </div>
  );
}
