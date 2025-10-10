"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
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
   isSkeletonLoading = false,
}) {
  const OPD_VALUES = { base: "opd", plus: "opdp" };
  const IC_VALUES = { base: "ic", plus: "icp" };
  const CS_VALUES = { base: "cs", plus: "csp" };
  const NCB_VALUES = { base: "ncb", plus: "cbb" };
  const normalizedAddons = useMemo(() => {
    let arr;
    if (Array.isArray(selectedAddons)) arr = selectedAddons;
    else if (
      typeof selectedAddons === "string" &&
      selectedAddons.startsWith("[")
    ) {
      try {
        arr = JSON.parse(selectedAddons);
      } catch {
        arr = [];
      }
    } else {
      arr = Object.values(selectedAddons || {});
    }
    return arr.map(String).filter(Boolean);
  }, [selectedAddons]);
  const pedDefaultValue = useMemo(() => {
    if (normalizedAddons.includes("1")) return "1";
    if (normalizedAddons.includes("2")) return "2";
    return "";
  }, [normalizedAddons]);
  const icDefaultValue = useMemo(() => {
    if (normalizedAddons.includes(IC_VALUES.plus)) return IC_VALUES.plus;
    if (
      normalizedAddons.includes(IC_VALUES.base) ||
      normalizedAddons.includes("ic")
    )
      return IC_VALUES.base;
    return "";
  }, [normalizedAddons, IC_VALUES.base, IC_VALUES.plus]);

  const csDefaultValue = useMemo(() => {
    if (normalizedAddons.includes(CS_VALUES.plus)) return CS_VALUES.plus;
    if (
      normalizedAddons.includes(CS_VALUES.base) ||
      normalizedAddons.includes("cs")
    )
      return CS_VALUES.base;
    return "";
  }, [normalizedAddons, CS_VALUES.base, CS_VALUES.plus]);

  const opdDefaultValue = useMemo(() => {
    if (normalizedAddons.includes(OPD_VALUES.plus)) return OPD_VALUES.plus;
    if (
      normalizedAddons.includes(OPD_VALUES.base) ||
      normalizedAddons.includes("opd")
    )
      return OPD_VALUES.base;
    return "";
  }, [normalizedAddons, OPD_VALUES.base, OPD_VALUES.plus]);

  const ncbDefaultValue = useMemo(() => {
    if (normalizedAddons.includes(NCB_VALUES.plus)) return NCB_VALUES.plus;
    if (
      normalizedAddons.includes(NCB_VALUES.base) ||
      normalizedAddons.includes("ncb") ||
      compulsoryAddons.includes("ncb")
    )
      return NCB_VALUES.base;
    return "";
  }, [normalizedAddons, compulsoryAddons, NCB_VALUES.base, NCB_VALUES.plus]);

  const defaultAddons = useMemo(() => {
    const map = Object.keys(addons).reduce((acc, key) => {
      const lower = key.toLowerCase();
      if (lower === "ped") {
        acc.ped =
          normalizedAddons.includes("ped") ||
          normalizedAddons.includes("1") ||
          normalizedAddons.includes("2");
      } else if (lower === "ic") {
        acc.ic =
          normalizedAddons.includes("ic") ||
          normalizedAddons.includes(IC_VALUES.base) ||
          normalizedAddons.includes(IC_VALUES.plus);
      } else if (lower === "cs") {
        acc.cs =
          normalizedAddons.includes("cs") ||
          normalizedAddons.includes(CS_VALUES.base) ||
          normalizedAddons.includes(CS_VALUES.plus);
      } else if (lower === "opd") {
        acc.opd =
          normalizedAddons.includes("opd") ||
          normalizedAddons.includes(OPD_VALUES.base) ||
          normalizedAddons.includes(OPD_VALUES.plus);
      } else if (lower === "ncb") {
        acc.ncb =
          compulsoryAddons.includes("ncb") ||
          normalizedAddons.includes("ncb") ||
          normalizedAddons.includes(NCB_VALUES.base) ||
          normalizedAddons.includes(NCB_VALUES.plus);
      } else {
        acc[key] = normalizedAddons.includes(String(key));
      }
      return acc;
    }, {});

    if (!("ped" in map))
      map.ped =
        normalizedAddons.includes("ped") ||
        normalizedAddons.includes("1") ||
        normalizedAddons.includes("2");
    if (!("ic" in map))
      map.ic =
        normalizedAddons.includes("ic") ||
        normalizedAddons.includes(IC_VALUES.base) ||
        normalizedAddons.includes(IC_VALUES.plus);
    if (!("cs" in map))
      map.cs =
        normalizedAddons.includes("cs") ||
        normalizedAddons.includes(CS_VALUES.base) ||
        normalizedAddons.includes(CS_VALUES.plus);
    if (!("opd" in map))
      map.opd =
        normalizedAddons.includes("opd") ||
        normalizedAddons.includes(OPD_VALUES.base) ||
        normalizedAddons.includes(OPD_VALUES.plus);
    if (!("ncb" in map))
      map.ncb =
        compulsoryAddons.includes("ncb") ||
        normalizedAddons.includes("ncb") ||
        normalizedAddons.includes(NCB_VALUES.base) ||
        normalizedAddons.includes(NCB_VALUES.plus);

    return map;
  }, [
    addons,
    normalizedAddons,
    compulsoryAddons,
    IC_VALUES.base,
    IC_VALUES.plus,
    CS_VALUES.base,
    CS_VALUES.plus,
    OPD_VALUES.base,
    OPD_VALUES.plus,
    NCB_VALUES.base,
    NCB_VALUES.plus,
  ]);

  const { register, handleSubmit, control, setValue, reset, getValues } =
    useForm({
      defaultValues: {
        addons: defaultAddons,
        pedaddonvalue: pedDefaultValue,
        icaddonvalue: icDefaultValue,
        csaddonvalue: csDefaultValue,
        opdaddonvalue: opdDefaultValue,
        ncbaddonvalue: ncbDefaultValue,
      },
    });

  useEffect(() => {
    const nextDefaults = {
      addons: defaultAddons,
      pedaddonvalue: pedDefaultValue,
      icaddonvalue: icDefaultValue,
      csaddonvalue: csDefaultValue,
      opdaddonvalue: opdDefaultValue,
      ncbaddonvalue: ncbDefaultValue,
    };
    const cur = getValues();
    const same =
      JSON.stringify(cur?.addons || {}) ===
        JSON.stringify(nextDefaults.addons) &&
      cur?.pedaddonvalue === nextDefaults.pedaddonvalue &&
      cur?.icaddonvalue === nextDefaults.icaddonvalue &&
      cur?.csaddonvalue === nextDefaults.csaddonvalue &&
      cur?.opdaddonvalue === nextDefaults.opdaddonvalue &&
      cur?.ncbaddonvalue === nextDefaults.ncbaddonvalue;

    if (!same) reset(nextDefaults);
  }, [
    defaultAddons,
    pedDefaultValue,
    icDefaultValue,
    csDefaultValue,
    opdDefaultValue,
    ncbDefaultValue,
    reset,
    getValues,
  ]);

  const [hasUserChanged, setHasUserChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const pedChecked = useWatch({ control, name: "addons.ped" });
  const icChecked = useWatch({ control, name: "addons.ic" });
  const csChecked = useWatch({ control, name: "addons.cs" });
  const opdChecked = useWatch({ control, name: "addons.opd" });
  const ncbChecked = useWatch({ control, name: "addons.ncb" });
  const isPedSelected = !!pedChecked;
  const isIcSelected = !!icChecked;
  const isCsSelected = !!csChecked;
  const isOpdSelected = !!opdChecked;
  const isNcbSelected = !!ncbChecked;

  const onSubmit = async (data) => {
    let selectedKeys = [];
    const addonsData = data.addons || {};
    const isPed = addonsData.ped;
    const isIc = addonsData.ic;
    const isCs = addonsData.cs;
    const isOpd = addonsData.opd;
    const isNcb = addonsData.ncb;
    const pedValue = data.pedaddonvalue;
    const icValue = data.icaddonvalue;
    const csValue = data.csaddonvalue;
    const opdValue = data.opdaddonvalue;
    const ncbValue = data.ncbaddonvalue;

    if (isPed && isIc) {
      showError("Please select only one option between PED and IC.");
      return;
    }

    Object.entries(addonsData).forEach(([key, checked]) => {
      if (checked && !["ped", "ic", "cs", "opd", "ncb"].includes(key)) {
        selectedKeys.push(key);
      }
    });
    if (!hasUserChanged) {
      showError("Please modify at least one add-on before applying.");
      return;
    }
    if (isPed) {
      if (!pedValue)
        return showError(
          "Please select a value for PED Wait Period Modification."
        );
      if (["1", "2"].includes(pedValue)) selectedKeys.push("ped", pedValue);
    } else {
      selectedKeys = selectedKeys.filter((v) => v !== "1" && v !== "2");
    }

    if (isIc) {
      if (!icValue)
        return showError("Please select a value for Instant Cover.");
      if ([IC_VALUES.base, IC_VALUES.plus].includes(icValue))
        selectedKeys.push("ic", icValue);
    }

    if (isCs) {
      if (!csValue) return showError("Please select a value for Claim Shield.");
      if ([CS_VALUES.base, CS_VALUES.plus].includes(csValue))
        selectedKeys.push("cs", csValue);
    }

    if (isOpd) {
      if (!opdValue) return showError("Please select a value for OPD.");
      if ([OPD_VALUES.base, OPD_VALUES.plus].includes(opdValue))
        selectedKeys.push("opd", opdValue);
    }

    if (isNcb) {
      if (!ncbValue)
        return showError("Please select a value for No Claim Bonus.");
      if ([NCB_VALUES.base, NCB_VALUES.plus].includes(ncbValue))
        selectedKeys.push("ncb", ncbValue);
    }

    const removeIfPlusPresent = (arr, base, plus) => {
      return arr.includes(plus) ? arr.filter((item) => item !== base) : arr;
    };

    let filteredKeys = [...selectedKeys];

    filteredKeys = removeIfPlusPresent(filteredKeys, "ic", "icp");
    filteredKeys = removeIfPlusPresent(filteredKeys, "cs", "csp");
    filteredKeys = removeIfPlusPresent(filteredKeys, "opd", "opdp");
    filteredKeys = [...new Set(filteredKeys)];
    const payload = { addon: filteredKeys };
    try {
      setLoading(true);
      const response = await CallApi(
        constant.API.HEALTH.CARESUPEREME.ADDADDONS,
        "POST",
        payload
      );
      setApplyClicked?.(true);
      setIsAddOnsModified?.(false);
      getCheckoutData?.();
      showSuccess("Add-Ons applied successfully.");
      setHasUserChanged(false);
    } catch (error) {
      console.error("Apply failed:", error);
      showError("Failed to apply add-ons.");
    } finally {
      setLoading(false);
    }
  };

  const displayAddOns = Object.entries(addons).filter(([key]) => {
    return !compulsoryAddons.includes(key) || key.toLowerCase() === "ncb";
  });
 if (isSkeletonLoading || displayAddOns.length === 0) {
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

        {displayAddOns.map(([key, price]) => {
          const lower = key.toLowerCase();
          const isPED = lower === "ped";
          const isIC = lower === "ic";
          const isCS = lower === "cs";
          const isOPD = lower === "opd";
          const isNCB = lower === "ncb";
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
                  {addonsDes[key] || "No description available."}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-4 md:mt-0">
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-400 rounded-xl min-w-[120px] cursor-pointer">
                  {!(isPED || isIC || isCS || isOPD || isNCB) && (
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
                      const checked = e.target.checked;
                      setValue(`addons.${key}`, checked);
                      setHasUserChanged(true);
                      setIsAddOnsModified?.(true);
                      setApplyClicked?.(false);
                      if (checked) {
                        if (key === "ped") setValue("pedaddonvalue", "1");
                        else if (key === "ic") setValue("icaddonvalue", "ic");
                        else if (key === "cs") setValue("csaddonvalue", "cs");
                        else if (key === "opd")
                          setValue("opdaddonvalue", "opd");
                        else if (key === "ncb")
                          setValue("ncbaddonvalue", "ncb");
                      }
                    }}
                    className="accent-purple-500 w-4 h-4"
                    disabled={
                      (isPED && isIcSelected) || (isIC && isPedSelected)
                    }
                  />
                  {isPED && (
                    <select
                      {...register("pedaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!isPedSelected}
                      defaultValue={pedDefaultValue}
                      onChange={() => {
                        setHasUserChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                    </select>
                  )}

                  {isIC && (
                    <select
                      {...register("icaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!isIcSelected}
                      defaultValue={icDefaultValue}
                      onChange={() => {
                        setHasUserChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value={IC_VALUES.base}>Instant Cover</option>
                      <option value={IC_VALUES.plus}>Instant Cover Plus</option>
                    </select>
                  )}

                  {isCS && (
                    <select
                      {...register("csaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!isCsSelected}
                      defaultValue={csDefaultValue}
                      onChange={() => {
                        setHasUserChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value={CS_VALUES.base}>Claim Shield</option>
                      <option value={CS_VALUES.plus}>Claim Shield Plus</option>
                    </select>
                  )}
                  {isOPD && (
                    <select
                      {...register("opdaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!isOpdSelected}
                      defaultValue={opdDefaultValue}
                      onChange={() => {
                        setHasUserChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value={OPD_VALUES.base}>OPD</option>
                      <option value={OPD_VALUES.plus}>OPD Plus</option>
                    </select>
                  )}
                  {isNCB && (
                    <select
                      {...register("ncbaddonvalue")}
                      className="border rounded-md text-sm"
                      disabled={!isNcbSelected}
                      defaultValue={ncbDefaultValue}
                      onChange={() => {
                        setHasUserChanged(true);
                        setIsAddOnsModified?.(true);
                        setApplyClicked?.(false);
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value={NCB_VALUES.base}>CB Super</option>
                      <option value={NCB_VALUES.plus}>CB Booster</option>
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
