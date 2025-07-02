"use client";
import { useForm, useWatch } from "react-hook-form"; 
import { useState } from "react";
import { CallApi } from "../../../api";
import constant from "../../../env";
import { showSuccess, showError }  from "@/layouts/toaster";

export default function AddOnSelection({
  addons = {},
  compulsoryAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
  setApplyClicked,
  setIsAddOnsModified,
}) {
  const { register, handleSubmit, control } = useForm(); 
  const [loading, setLoading] = useState(false);

  const isPedSelected = useWatch({ name: "addons.ped", control }); 

  const onSubmit = async (data) => {
    let selectedKeys = [];
    const addonsData = data.addons || {};
    const isPedChecked = addonsData.ped;
    const pedValue = data.pedaddonvalue;

    Object.entries(addonsData).forEach(([key, checked]) => {
      if (checked && key !== "ped") {
        selectedKeys.push(key);
      }
    });

    if (isPedChecked) {
      if (!pedValue) {
        showError("Please select a value for PED Wait Period Modification.");
        return;
      }

      if (["1", "2"].includes(pedValue)) {
        selectedKeys.push("ped", pedValue);
      }
    } else {
      selectedKeys = selectedKeys.filter((val) => val !== "1" && val !== "2");
    }

    try {
      setLoading(true);
      const payload = { addon: selectedKeys };
      const response = await CallApi(constant.API.HEALTH.ADDADDONS, "POST", payload);
      console.log("AddOns Applied:", response);

      if (typeof setApplyClicked === "function") setApplyClicked(true);
      if (typeof setIsAddOnsModified === "function") setIsAddOnsModified(false);

      if (getCheckoutData) getCheckoutData();
      showSuccess("Add-Ons applied successfully.");
    } catch (error) {
      console.error("Apply failed:", error);
      showError("Failed to apply add-ons.");
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-base mb-2">Add-On</h2>
            <p className="text-sm text-gray-600">
              You should get these additional benefits to enhance your current plan.
            </p>
          </div>
          <button type="submit" className="px-6 py-1 thmbtn" disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>

        {optionalAddOns.map(([key, price]) => {
          const selectedNames = Object.values(selectedAddons).map((v) =>
            v.toLowerCase().trim()
          );
          const isChecked = selectedNames.includes(key.toLowerCase().trim());
          const isPED = key.toLowerCase() === "ped";

          return (
            <div
              key={key}
              className="border rounded-2xl p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-sm text-black mb-1">
                  {fullAddonsName[key] || key}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Covers specific health events with added protection and faster claims.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-4 md:mt-0">
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                  {!isPED && (
                    <div className="text-center leading-tight text-sm text-gray-800">
                      <p className="font-medium">Premium</p>
                      <p className="font-bold">₹{Number(price).toLocaleString()}</p>
                    </div>
                  )}

                  <input
                    type="checkbox"
                    {...register(`addons.${key}`)}
                    defaultChecked={isChecked}
                    className="accent-purple-500 w-4 h-4"
                    onChange={() => {
                      if (typeof setIsAddOnsModified === "function") setIsAddOnsModified(true);
                      if (typeof setApplyClicked === "function") setApplyClicked(false);
                    }}
                  />

                  {isPED && (
                    <select
                      {...register("pedaddonvalue")}
                      className="border rounded-md text-sm"
                      defaultValue=""
                      // disabled={!isPedSelected} 
                      onChange={() => {
                        if (typeof setIsAddOnsModified === "function") setIsAddOnsModified(true);
                        if (typeof setApplyClicked === "function") setApplyClicked(false);
                      }}
                    >
                      <option value="" disabled>Select</option>
                      <option value="1">1 Years</option>
                      <option value="2">2 Years</option>
                    </select>
                  )}
                </label>
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-1 thmbtn" disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </form>
    </div>
  );
}
