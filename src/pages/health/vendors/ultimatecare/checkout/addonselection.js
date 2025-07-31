"use client";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { CallApi } from "../../../../../api";
import constant from "../../../../../env";
import { showSuccess, showError } from "@/layouts/toaster";

export default function AddOnSelection({
  addons = {},
  compulsoryAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
  setApplyClicked,
  setIsAddOnsModified,
}) {
  const normalizedAddons = Array.isArray(selectedAddons)
    ? selectedAddons
    : typeof selectedAddons === "string" && selectedAddons.startsWith("[")
    ? JSON.parse(selectedAddons)
    : Object.values(selectedAddons || {});

  const tbAddon = normalizedAddons.find(
    (val) => val.startsWith("tb") && val !== "tb"
  );
  const tbValueFromSelectedAddon = tbAddon?.replace("tb", "") || "";
  const isTbChecked = normalizedAddons.includes("tb") || !!tbAddon;

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      addons: { tb: isTbChecked },
      tbaddonvalue: tbValueFromSelectedAddon,
    },
  });

  const [hasUserChanged, setHasUserChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTbSelected = useWatch({ control, name: "addons.tb" });

  const onSubmit = async (data) => {
    let selectedKeys = [];
    const addonsData = data.addons || {};
    const istbChecked = addonsData.tb;
    const tbValue = data.tbaddonvalue;

    if (!hasUserChanged) {
      showError("Please modify at least one add-on before applying.");
      return;
    }

    Object.entries(addonsData).forEach(([key, checked]) => {
      if (checked && key !== "tb") {
        selectedKeys.push(key);
      }
    });

    if (istbChecked) {
      if (!tbValue) {
        showError("Please select a value for TB Duration.");
        return;
      }
      selectedKeys.push(`tb${tbValue}`);
    }

    try {
      setLoading(true);
      const payload = { addon: selectedKeys };

      const response = await CallApi(
        constant.API.HEALTH.ULTIMATECARE.ADDADDONS,
        "POST",
        payload
      );
      console.log("AddOns Applied:", response);

      if (typeof setApplyClicked === "function") setApplyClicked(true);
      if (typeof setIsAddOnsModified === "function")
        setIsAddOnsModified(false);

      if (getCheckoutData) getCheckoutData();
      showSuccess("Add-Ons applied successfully.");
      setHasUserChanged(false);
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
              You should get these additional benefits to enhance your current
              plan.
            </p>
          </div>
          <button type="submit" className="px-6 py-1 thmbtn" disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>

        {optionalAddOns.map(([key, price]) => {
          const selectedNames = normalizedAddons.map((v) =>
            v.toLowerCase().trim()
          );
          const isTb = key.toLowerCase() === "tb";
          const isChecked = isTb
            ? isTbChecked
            : selectedNames.includes(key.toLowerCase().trim());

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
                  Covers specific health events with added protection and faster
                  claims.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-4 md:mt-0">
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                  {!isTb && (
                    <div className="text-center leading-tight text-sm text-gray-800">
                      <p className="font-medium">Premium</p>
                      <p className="font-bold">
                        ₹{Number(price).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <input
                    type="checkbox"
                    {...register(`addons.${key}`)}
                    defaultChecked={isChecked}
                    className="accent-purple-500 w-4 h-4"
                    onChange={(e) => {
                      setValue(`addons.${key}`, e.target.checked);
                      setHasUserChanged(true);
                      if (typeof setIsAddOnsModified === "function")
                        setIsAddOnsModified(true);
                      if (typeof setApplyClicked === "function")
                        setApplyClicked(false);
                    }}
                  />

                  {isTb && (
                    <select
                      {...register("tbaddonvalue")}
                      className="border rounded-md text-sm"
                      defaultValue={tbValueFromSelectedAddon}
                      disabled={!isTbSelected}
                      onChange={() => {
                        setHasUserChanged(true);
                        if (typeof setIsAddOnsModified === "function")
                          setIsAddOnsModified(true);
                        if (typeof setApplyClicked === "function")
                          setApplyClicked(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
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
