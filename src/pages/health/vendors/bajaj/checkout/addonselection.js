"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { CallApi } from "../../../../../api";
import constant from "../../../../../env";
import { showSuccess, showError } from "@/layouts/toaster";

export default function AddOnSelection({
  coverAmount,
  addons = {},
  addonsDes = {},
  compulsoryAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
  setApplyClicked,
  setIsAddOnsModified,
}) {
  console.log("Cover Amount →", coverAmount);

  // Normalize selected add-ons (handles ped1, RRGW, addon23, etc.)
  const parsedSelected = useMemo(() => {
    const arr = Array.isArray(selectedAddons)
      ? selectedAddons
      : typeof selectedAddons === "string" && selectedAddons.startsWith("[")
      ? JSON.parse(selectedAddons)
      : Object.values(selectedAddons || []);

    const result = {};
    for (const item of arr) {
      if (addons[item]) result[item] = "";
      else {
        let base = item, val = "";
        const numMatch = item.match(/^([A-Za-z]+)(\d+)$/);
        const rrMatch = item.match(/^([A-Z]{2})([A-Z0-9]+)$/i);
        if (numMatch) [base, val] = [numMatch[1], numMatch[2]];
        else if (rrMatch) [base, val] = [rrMatch[1], rrMatch[2]];
        result[base] = val || "";
      }
    }
    return result;
  }, [selectedAddons, addons]);

  // Default checked state
  const defaultAddons = useMemo(() => {
    const map = {};
    for (const key of Object.keys(addons)) {
      map[key] = Object.keys(parsedSelected).some(
        (sel) => sel.toLowerCase() === key.toLowerCase()
      );
    }
    return map;
  }, [addons, parsedSelected]);

  const { register, handleSubmit, control, setValue, reset, getValues } = useForm({
    defaultValues: { addons: defaultAddons },
  });

  const watchedAddons = useWatch({ control, name: "addons" });

  // Sync checkboxes with default selection
  useEffect(() => {
    const next = { addons: defaultAddons };
    if (JSON.stringify(getValues().addons) !== JSON.stringify(next.addons)) {
      reset(next);
    }
  }, [defaultAddons, reset, getValues]);

  // Preselect dropdown values for parsed items (RR, PED, etc.)
  useEffect(() => {
    for (const [base, val] of Object.entries(parsedSelected)) {
      const match = Object.keys(addons).find(
        (k) => k.toLowerCase() === base.toLowerCase()
      );
      if (match && Array.isArray(addons[match])) {
        setValue(`${match}addonvalue`, val.toUpperCase() || "");
      }
    }
  }, [parsedSelected, addons, setValue]);

  // Auto-select RR addon based on coverAmount
// 🧠 Auto-select RR addon dynamically based on coverAmount
useEffect(() => {
  const rrOptions = addons["RR"];
  if (!rrOptions || !Array.isArray(rrOptions)) return;

  let defaultRR = "";
  if (coverAmount >= 3 && coverAmount <= 10) defaultRR = "SPA";
  else if (coverAmount > 10) defaultRR = "ACTUAL";
  else defaultRR = ""; // for <3L case, no default

  const current = getValues("RRaddonvalue");

  // 🔹 Only update if:
  // - No RR selected yet, or
  // - Current default no longer matches expected (e.g. coverAmount changed)
  if (!current || current !== defaultRR) {
    if (defaultRR) {
      setValue("addons.RR", true);
      setValue("RRaddonvalue", defaultRR);
      console.log(`Auto-updated RR = ${defaultRR}`);
    } else {
      // if coverAmount < 3, disable RR selection
      setValue("addons.RR", false);
      setValue("RRaddonvalue", "");
      console.log("RR cleared (below 3L)");
    }
  }
}, [coverAmount, addons, getValues, setValue]);


  // Auto-select default values for PED, PHE, PRHE, SDWP
  useEffect(() => {
    const defaults = {
      ped: "3",   // 36 months
      prhe: "60", // 60 days
      phe: "90",  // 90 days
      sdwp: "2",  // 24 months
    };

    Object.entries(defaults).forEach(([key, val]) => {
      const options = addons[key];
      if (!Array.isArray(options)) return;

      const currentVal = getValues(`${key}addonvalue`);
      const isChecked = getValues(`addons.${key}`);

      if (!currentVal && !isChecked) {
        setValue(`addons.${key}`, true);
        setValue(`${key}addonvalue`, String(val));
        console.log(`Auto-defaulted ${key.toUpperCase()} = ${val}`);
      }
    });
  }, [addons, getValues, setValue]);

  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  //  Submit handler
  const onSubmit = async (data) => {
    try {
      const addonsData = data.addons || {};
      const selectedKeys = [];

      for (const [key, checked] of Object.entries(addonsData)) {
        if (checked) {
          const options = addons[key];
          const val = data[`${key}addonvalue`];

          //  Skip validation for pure checkbox add-ons (addon23–25)
          if (["addon23", "addon24", "addon25"].includes(key)) {
            selectedKeys.push(key);
            continue;
          }

          // If dropdown-based add-on missing value, stop safely
          if (Array.isArray(options) && options.length > 0 && !val) {
            showError(`Please select a value for ${fullAddonsName[key] || key}.`);
            return;
          }

          selectedKeys.push(val ? key + val : key);
        }
      }

      if (!changed) {
        showError("Please modify at least one add-on before applying.");
        return;
      }

      const payload = { addon: [...new Set(selectedKeys)] };
      console.log("Final Payload:", payload);

      setLoading(true);
      await CallApi(constant.API.HEALTH.BAJAJ.ADDADDONS, "POST", payload);
      showSuccess("Add-Ons applied successfully.");
      getCheckoutData?.();
      setApplyClicked?.(true);
      setIsAddOnsModified?.(false);
      setChanged(false);
    } catch (error) {
      console.error("Apply failed:", error);
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayAddOns = Object.entries(addons).filter(
    ([k]) => !compulsoryAddons.includes(k) || k.toLowerCase() === "ncb"
  );

  if (!displayAddOns.length)
    return (
      <div className="bg-white rounded-xl p-4 px-6 mb-6">
        <p className="text-gray-500 text-sm animate-pulse">Loading Add-Ons...</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl p-4 px-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-base mb-1">Add-On</h2>
            <p className="text-sm text-gray-600">
              Choose from available add-ons to enhance your plan.
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-1 thmbtn flex items-center gap-2"
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


        {displayAddOns.map(([key, price]) => (
          <div
            key={key}
            className="border rounded-2xl p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="flex-1 pr-4">
              <p className="font-semibold text-sm text-black mb-1">
                {fullAddonsName[key] || key}
              </p>
              <p className="text-sm text-gray-600">
                {addonsDes[key] || "No description available."}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`addons.${key}`)}
                  checked={watchedAddons?.[key] || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setValue(`addons.${key}`, checked);
                    setChanged(true);
                    setIsAddOnsModified?.(true);
                    setApplyClicked?.(false);
                    setValue(`${key}addonvalue`, checked ? String(price?.[0] ?? "") : "");
                  }}
                  className="accent-purple-500 w-4 h-4"
                />

                {/* Dropdown (skip for addon23–25) */}
                {Array.isArray(price) &&
                  price.length > 0 &&
                  !["addon23", "addon24", "addon25"].includes(key) && (
                    <select
                      {...register(`${key}addonvalue`)}
                      className="border rounded-md text-sm"
                      disabled={!watchedAddons?.[key]}
                      defaultValue={getValues(`${key}addonvalue`) || ""}
                      onChange={(e) => {
                        setValue(`${key}addonvalue`, e.target.value);
                        setChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {price.map((option, i) => {
                        let label = String(option).trim();
                        let value = label.toUpperCase();
                        const match = label.match(/^([A-Za-z0-9._-]+)\s*\(([^)]+)\)/);
                        if (match) {
                          value = match[1].trim().toUpperCase();
                          label = match[2].trim();
                        }
                        if (["ped", "phe", "prhe"].includes(key))
                          label += key === "ped"
                            ? " Year"
                            : " Day" + (option > 1 ? "s" : "");
                        return (
                          <option key={i} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  )}
              </label>
            </div>
          </div>
        ))}

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
