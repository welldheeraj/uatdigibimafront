"use client";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { CallApi } from "../../../../../api";
import constant from "../../../../../env";
import { showSuccess, showError } from "@/layouts/toaster";

export default function AddOnSelection({
  addons = {},
  addonsDes = {},
  compulsoryAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
  setApplyClicked,
  setIsAddOnsModified,
}) {
   console.log("addon description", addonsDes);
  const normalizedAddons = Array.isArray(selectedAddons)
    ? selectedAddons
    : typeof selectedAddons === "string" && selectedAddons.startsWith("[")
    ? JSON.parse(selectedAddons)
    : Object.values(selectedAddons || {});

  const pedDefaultValue = normalizedAddons.includes("1")
    ? "1"
    : normalizedAddons.includes("2")
    ? "2"
    : "";

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      addons: {
        ped: normalizedAddons.includes("ped"),
      },
      pedaddonvalue: pedDefaultValue,
    },
  });

  const [hasUserChanged, setHasUserChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const pedChecked = useWatch({ control, name: "addons.ped" });
  const isPedSelected = !!pedChecked;

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

    if (!hasUserChanged) {
      showError("Please modify at least one add-on before applying.");
      return;
    }

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
      const response = await CallApi(
        constant.API.HEALTH.ULTIMATECARE.ADDADDONS,
        "POST",
        payload
      );
      console.log("AddOns Applied:", response);

      if (typeof setApplyClicked === "function") setApplyClicked(true);
      if (typeof setIsAddOnsModified === "function") setIsAddOnsModified(false);

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
      <div className="bg-white rounded-xl p-4 px-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-3 w-72 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-purple-200 rounded-full animate-pulse" />
        </div>

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border rounded-2xl p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center animate-pulse"
          >
            <div className="flex-1 pr-4">
              <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-4 md:mt-0">
              <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl min-w-[120px]">
                <div className="h-10 w-16 bg-gray-300 rounded" />
                <div className="h-4 w-4 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
      const safeDesObj =
    addonsDes && typeof addonsDes === "object" ? addonsDes : {};
  const firstKey = optionalAddOns[0]?.[0];
  const headerDesc =
    (firstKey &&
      (safeDesObj[String(firstKey).toLowerCase()] ?? safeDesObj[firstKey])) ||
    "No description available.";

  return (
    <div className="bg-white rounded-xl p-4 px-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-base mb-2">Add-On</h2>
             <p className="text-sm text-gray-600 leading-relaxed">
              {headerDesc}
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-1 thmbtn flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                Applying
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>

        {optionalAddOns.map(([key, price]) => {
          const isChecked = normalizedAddons.includes(key);
          const isPED = key.toLowerCase() === "ped";
           const rowDesc =
            safeDesObj[key.toLowerCase()] ??
            safeDesObj[key] ??
            "No description available.";

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
                  {rowDesc}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-4 md:mt-0">
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                  {!isPED && (
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
                    defaultChecked={isPED ? pedChecked : isChecked}
                    onChange={(e) => {
                      setValue(`addons.${key}`, e.target.checked);
                      setHasUserChanged(true);
                      if (typeof setIsAddOnsModified === "function")
                        setIsAddOnsModified(true);
                      if (typeof setApplyClicked === "function")
                        setApplyClicked(false);
                    }}
                    className="accent-purple-500 w-4 h-4"
                  />

                  {isPED && (
                    <select
                      {...register("pedaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!pedChecked}
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
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                    </select>
                  )}
                </label>
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-1 thmbtn flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                Applying
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
