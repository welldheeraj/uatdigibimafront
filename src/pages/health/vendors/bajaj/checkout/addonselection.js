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
  defaultAddons = [],
  selectedAddons = [],
  fullAddonsName = {},
  getCheckoutData,
  setApplyClicked,
  setIsAddOnsModified,
}) {
  console.log("selectedAddons", selectedAddons);
  console.log("defaultAddons", defaultAddons);

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
        let base = item,
          val = "";
        const numMatch = String(item).match(/^([A-Za-z]+)(\d+)$/);
        const rrMatch = String(item).match(/^([A-Z]{2})([A-Z0-9]+)$/i);
        if (numMatch) [base, val] = [numMatch[1], numMatch[2]];
        else if (rrMatch) [base, val] = [rrMatch[1], rrMatch[2]];
        result[base] = val || "";
      }
    }
    return result;
  }, [selectedAddons, addons]);

  const parsedDefaults = useMemo(() => {
    const out = {};
    if (!defaultAddons) return out;

    if (Array.isArray(defaultAddons)) {
      for (const item of defaultAddons) {
        let base = String(item),
          val = "";
        const numMatch = base.match(/^([A-Za-z]+)(\d+)$/);
        const rrMatch = base.match(/^([A-Z]{2})([A-Z0-9]+)$/i);
        if (numMatch) [base, val] = [numMatch[1], numMatch[2]];
        else if (rrMatch) [base, val] = [rrMatch[1], rrMatch[2]];
        out[base] = (val || "").toUpperCase();
      }
      return out;
    }

    for (const [k, v] of Object.entries(defaultAddons || {})) {
      if (v == null) continue;
      let val = String(v).trim();
      const parenIdx = val.indexOf("(");
      if (parenIdx > 0) val = val.slice(0, parenIdx).trim();
      val = val.split(" ")[0].trim();
      out[k] = val.toUpperCase();
    }
    return out;
  }, [defaultAddons]);
  const lockedDefaultKeys = useMemo(() => {
    const map = {};
    Object.keys(parsedDefaults || {}).forEach((base) => {
      const match = Object.keys(addons || {}).find(
        (k) => k.toLowerCase() === base.toLowerCase()
      );
      if (match) map[match] = true;
    });
    return map;
  }, [parsedDefaults, addons]);

  const initialSelected = useMemo(() => {
    const hasSelected =
      (Array.isArray(selectedAddons) && selectedAddons.length > 0) ||
      (typeof selectedAddons === "string" &&
        selectedAddons.startsWith("[") &&
        JSON.parse(selectedAddons || "[]").length > 0) ||
      (!!selectedAddons &&
        typeof selectedAddons === "object" &&
        Object.keys(selectedAddons).length > 0);

    return hasSelected ? parsedSelected : parsedDefaults;
  }, [selectedAddons, parsedSelected, parsedDefaults]);

  const default_Addons = useMemo(() => {
    const map = {};
    for (const key of Object.keys(addons)) {
      map[key] = Object.keys(initialSelected).some(
        (sel) => sel.toLowerCase() === key.toLowerCase()
      );
    }
    return map;
  }, [addons, initialSelected]);

  const { register, handleSubmit, control, setValue, reset, getValues } =
    useForm({
      defaultValues: { addons: default_Addons },
    });

  const watchedAddons = useWatch({ control, name: "addons" });

  useEffect(() => {
    const next = { addons: default_Addons };
    if (JSON.stringify(getValues().addons) !== JSON.stringify(next.addons)) {
      reset(next);
    }
  }, [default_Addons, reset, getValues]);

  useEffect(() => {
    for (const [base, val] of Object.entries(initialSelected)) {
      const match = Object.keys(addons).find(
        (k) => k.toLowerCase() === base.toLowerCase()
      );
      if (!match) continue;

      setValue(`addons.${match}`, true);
      if (Array.isArray(addons[match])) {
        setValue(`${match}addonvalue`, (val || "").toUpperCase());
      }
    }
  }, [initialSelected, addons, setValue]);

  useEffect(() => {
    if (initialSelected?.RR) return;

    const rrOptions = addons["RR"];
    if (!rrOptions || !Array.isArray(rrOptions)) return;

    let defaultRR = "";
    if (coverAmount >= 3 && coverAmount <= 10) defaultRR = "SPA";
    else if (coverAmount > 10) defaultRR = "ACTUAL";
    else defaultRR = "";

    const current = getValues("RRaddonvalue");

    if (!current || current !== defaultRR) {
      if (defaultRR) {
        setValue("addons.RR", true);
        setValue("RRaddonvalue", defaultRR);
      } else {
        setValue("addons.RR", false);
        setValue("RRaddonvalue", "");
      }
    }
  }, [coverAmount, addons, getValues, setValue, initialSelected]);

  useEffect(() => {
    const defaults = {
      ped: "3", // 36 months
      prhe: "60", // 60 days
      phe: "90", // 90 days
      sdwp: "2", // 24 months
    };

    Object.entries(defaults).forEach(([key, val]) => {
      if (initialSelected?.[key]) return;

      const options = addons[key];
      if (!Array.isArray(options)) return;

      const currentVal = getValues(`${key}addonvalue`);
      const isChecked = getValues(`addons.${key}`);

      if (!currentVal && !isChecked) {
        setValue(`addons.${key}`, true);
        setValue(`${key}addonvalue`, String(val));
      }
    });
  }, [addons, getValues, setValue, initialSelected]);

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
          if (["addon23", "addon24", "addon25"].includes(key)) {
            selectedKeys.push(key);
            continue;
          }

          if (Array.isArray(options) && options.length > 0 && !val) {
            showError(
              `Please select a value for ${fullAddonsName[key] || key}.`
            );
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
      // return false;

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
        <p className="text-gray-500 text-sm animate-pulse">
          Loading Add-Ons...
        </p>
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

        {displayAddOns.map(([key, price]) => {
          const hasDropdown =
            Array.isArray(price) &&
            price.length > 0 &&
            !["addon23", "addon24", "addon25"].includes(key);

          const isLocked = !!lockedDefaultKeys[key];

          return (
            <div
              key={key}
              className="border rounded-2xl p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-sm text-black mb-1 flex items-center gap-2">
                  {fullAddonsName[key] || key}
                  {isLocked && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {addonsDes[key] || "No description available."}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <label
                  className={`flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl cursor-pointer ${
                    hasDropdown ? "min-w-[120px]" : "min-w-auto"
                  } ${isLocked ? "opacity-100" : ""}`}
                  title={
                    isLocked ? "This add-on is part of defaults" : undefined
                  }
                >
                  <input
                    type="checkbox"
                    {...register(`addons.${key}`)}
                    checked={watchedAddons?.[key] || false}
                    onClick={(e) => {
                      if (isLocked) e.preventDefault();
                    }}
                    onChange={(e) => {
                      if (isLocked) return;
                      const checked = e.target.checked;
                      setValue(`addons.${key}`, checked);
                      setChanged(true);
                      setIsAddOnsModified?.(true);
                      setApplyClicked?.(false);

                      const initVal = initialSelected?.[key] || "";
                      const firstOpt = Array.isArray(price)
                        ? String(price?.[0] ?? "")
                        : "";
                      setValue(
                        `${key}addonvalue`,
                        checked ? initVal || firstOpt : ""
                      );
                    }}
                    className="accent-purple-500 w-4 h-4"
                  />

                  {hasDropdown && (
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
                        const match = label.match(
                          /^([A-Za-z0-9._-]+)\s*\(([^)]+)\)/
                        );
                        if (match) {
                          value = match[1].trim().toUpperCase();
                          label = match[2].trim();
                        }
                        if (["ped", "phe", "prhe"].includes(key))
                          label +=
                            key === "ped"
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
