"use client";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
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
  const opdToken = (normalizedAddons || []).find((a) =>
    /^opd(500|5000)$/i.test(String(a))
  );

  const opdDefaultValue = opdToken
    ? String(opdToken).replace(/opd/i, "")
    : normalizedAddons.includes("500")
    ? "500"
    : normalizedAddons.includes("5000")
    ? "5000"
    : "";
  const initialAddons = {};
  Object.keys(addons || {}).forEach((k) => {
    initialAddons[k] = normalizedAddons.includes(k);
  });

  initialAddons.ped = normalizedAddons.includes("ped");
  initialAddons.opd = Boolean(opdToken) || normalizedAddons.includes("opd");

  const { register, handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      addons: initialAddons,
      pedaddonvalue: pedDefaultValue,
      opdaddonvalue: opdDefaultValue,
    },
  });

  const [hasUserChanged, setHasUserChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const pedChecked = useWatch({
    control,
    name: "addons.ped",
    defaultValue: initialAddons.ped,
  });
  const opdChecked = useWatch({
    control,
    name: "addons.opd",
    defaultValue: initialAddons.opd,
  });
  const isPedSelected = !!pedChecked;

  useEffect(() => {
    const nextAddons = {};
    Object.keys(addons || {}).forEach((k) => {
      nextAddons[k] = normalizedAddons.includes(k);
    });
    nextAddons.ped = normalizedAddons.includes("ped");
    const nextOpdToken = (normalizedAddons || []).find((a) =>
      /^opd(500|5000)$/i.test(String(a))
    );
    nextAddons.opd = Boolean(nextOpdToken) || normalizedAddons.includes("opd");

    const nextPedVal = normalizedAddons.includes("1")
      ? "1"
      : normalizedAddons.includes("2")
      ? "2"
      : "";

    const nextOpdVal = nextOpdToken
      ? String(nextOpdToken).replace(/opd/i, "")
      : normalizedAddons.includes("500")
      ? "500"
      : normalizedAddons.includes("5000")
      ? "5000"
      : "";

    reset({
      addons: nextAddons,
      pedaddonvalue: nextPedVal,
      opdaddonvalue: nextOpdVal,
    });
  }, [reset, addons, selectedAddons,normalizedAddons]);

  useEffect(() => {
    if (opdToken) {
      setValue("addons.opd", true, { shouldDirty: false });
      setValue("opdaddonvalue", String(opdToken).replace(/opd/i, ""), {
        shouldDirty: false,
      });
    }
    if (normalizedAddons.includes("ped")) {
      setValue("addons.ped", true, { shouldDirty: false });
      setValue("pedaddonvalue", pedDefaultValue, { shouldDirty: false });
    }
  }, [opdToken, normalizedAddons, pedDefaultValue, setValue]);

  const onSubmit = async (data) => {
    let selectedKeys = [];
    const addonsData = data.addons || {};
    const isPedChecked = addonsData.ped;
    const pedValue = data.pedaddonvalue;

    const isOpdChecked = addonsData.opd;
    const opdValue = data.opdaddonvalue;

    Object.entries(addonsData).forEach(([key, checked]) => {
      if (checked && key !== "ped" && key !== "opd") {
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

    if (isOpdChecked) {
      if (!opdValue) {
        showError("Please select a value for OPD.");
        return;
      }
      if (["500", "5000"].includes(opdValue)) {
        selectedKeys.push(`opd${opdValue}`);
        selectedKeys = selectedKeys.filter(
          (val) => val !== "opd" && val !== "500" && val !== "5000"
        );
      }
    } else {
      selectedKeys = selectedKeys.filter(
        (val) =>
          !/^opd(500|5000)$/i.test(String(val)) &&
          val !== "500" &&
          val !== "5000"
      );
    }

    try {
      setLoading(true);
      const payload = { addon: selectedKeys };
      const response = await CallApi(
        constant.API.HEALTH.ULTIMATECARE.ADDADDONS,
        "POST",
        payload
      );
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
          const lowerKey = String(key).toLowerCase();
          const isPED = lowerKey === "ped";
          const isOPD = lowerKey === "opd";

          const rowDesc =
            safeDesObj[lowerKey] ??
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
                  {/* Premium box hide for PED & OPD */}
                  {!isPED && !isOPD && (
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

                  {isOPD && (
                    <select
                      {...register("opdaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!opdChecked}
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
                      <option value="500">₹500</option>
                      <option value="5000">₹5000</option>
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
