"use client";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import constant from "@/env";
import UniversalDatePicker from "../../datepicker/index";
import { CallApi } from "@/api";
import { format, parse } from "date-fns";
import { showError } from "@/layouts/toaster";

export default function KnowCarSlideThree() {
  const { control, register, handleSubmit, watch, setValue } = useForm({
  defaultValues: {
    ownershiptoggle: "0",
    policyclaim: "0",
  },
});
  const [ownershipToggle, setOwnershipToggle] = useState(false);
  const [policyToggle, setPolicyToggle] = useState(false);
  const [Data, setData] = useState(null);
  const router = useRouter();

  const prePolicyType = watch("prepolitype");
  const bonusValue = watch("bonus-button");

  const calculateToDate = (fromDateStr, isThreeYear) => {
    if (!fromDateStr) return "";
    const [dd, mm, yyyy] = fromDateStr.split("-").map(Number);
    const fromDate = new Date(yyyy, mm - 1, dd);
    if (isNaN(fromDate)) return "";
    const toDate = new Date(fromDate);
    toDate.setFullYear(toDate.getFullYear() + (isThreeYear ? 3 : 1));
    toDate.setDate(toDate.getDate() - 1);
    return format(toDate, "dd-MM-yyyy");
  };

  const bdfromdate = watch("bdfromdate");
  const bdtpfromdate = watch("bdtpfromdate");
  const compfromdate = watch("compfromdate");
  const odfromdate = watch("odfromdate");
  const odtpfromdate = watch("odtpfromdate");
  const tpfromdate = watch("tpfromdate");

 useEffect(() => {
  async function getDetails() {
    try {
      const res = await CallApi(constant.API.MOTOR.CAR.KNOWCARDETAILSTHREE, "GET");
      console.log("Saved response", res.data);

      const data = res?.data;
      if (data) {
        setData(data); 

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            setValue(key, value);
          }
        });

        setOwnershipToggle(data.ownershiptoggle === "1");
        setPolicyToggle(data.policyclaim === "1");
      }
    } catch (error) {
      console.error("Error loading saved step three data:", error);
    }
  }

  getDetails();
}, [setValue]);

  useEffect(() => {
    if (bdfromdate) setValue("bdtodate", calculateToDate(bdfromdate, false));
  }, [bdfromdate]);

  useEffect(() => {
    if (bdtpfromdate)
      setValue("bdtptodate", calculateToDate(bdtpfromdate, true));
  }, [bdtpfromdate]);

  useEffect(() => {
    if (compfromdate)
      setValue("comptodate", calculateToDate(compfromdate, false));
  }, [compfromdate]);

  useEffect(() => {
    if (odfromdate) setValue("odtodate", calculateToDate(odfromdate, false));
  }, [odfromdate]);

  useEffect(() => {
    if (odtpfromdate)
      setValue("odtptodate", calculateToDate(odtpfromdate, true));
  }, [odtpfromdate]);

  useEffect(() => {
    if (tpfromdate) setValue("tptodate", calculateToDate(tpfromdate, false));
  }, [tpfromdate]);

  const requiredDates = {
    bundled: ["bdfromdate", "bdtodate", "bdtpfromdate", "bdtptodate"],
    comprehensive: ["compfromdate", "comptodate"],
    odonly: ["odfromdate", "odtodate", "odtpfromdate", "odtptodate"],
    tponly: ["tpfromdate", "tptodate"],
  };

  const onSubmit = async(data) => {
    if (!data.prepolitype) {
      showError("Please select a previous policy type.");
      return;
    }

    const fieldsToCheck = requiredDates[data.prepolitype] || [];
    for (let field of fieldsToCheck) {
      if (!data[field]) {
        showError("Please fill all required date fields before continuing.");
        return;
      }
    }

    console.log("Form submitted:", data); 
    try {
      const res = await CallApi(
        constant.API.MOTOR.CAR.KNOWCARDETAILSTHREE,
        "POST",
        data
      );
      console.log(res);
      if (res) {
         router.push(constant.ROUTES.MOTOR.PLANS);
      }
    } catch (error) {
      console.error(error);
    }
   
  };

  const renderDatePicker = (name, label, { validateFutureDate = false } = {}) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (value) => {
            if (!value) return "This field is required.";
            if (validateFutureDate) {
              const date = parse(value, "dd-MM-yyyy", new Date());
              if (date > new Date()) return "Future date not allowed.";
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <UniversalDatePicker
              id={name}
              name={name}
              onChange={(date) => {
                if (date instanceof Date && !isNaN(date)) {
                  const formatted = format(date, "dd-MM-yyyy");
                  field.onChange(formatted);
                }
              }}
              placeholder="Pick a date"
              value={
                field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : null
              }
              maxDate={validateFutureDate ? new Date() : undefined}
            />
            {fieldState?.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center text-lg font-semibold mb-6">
        Motor insurance provides essential coverage against accidents.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Policy Type Dropdown */}
        <div>
          <label className="block font-medium mb-2">Select previous policy type</label>
          <select {...register("prepolitype")} className="w-full border rounded px-3 py-2">
            <option value="">Select Policy</option>
            <option value="bundled">Bundled (1Y OD + 3Y TP)</option>
            <option value="comprehensive">Comprehensive (1Y OD + 1Y TP)</option>
            <option value="odonly">OD Only</option>
            <option value="tponly">TP Only</option>
          </select>
        </div>

        {/* Bundled */}
        {prePolicyType === "bundled" && (
          <div className="bg-gray-50 border p-4 rounded space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("bdfromdate", "OD From Date", { validateFutureDate: true })}
              {renderDatePicker("bdtodate", "OD To Date")}
            </div>
            <div className="text-sm font-semibold">TP Dates</div>
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("bdtpfromdate", "TP From Date", { validateFutureDate: true })}
              {renderDatePicker("bdtptodate", "TP To Date")}
            </div>
          </div>
        )}

        {/* Comprehensive */}
        {prePolicyType === "comprehensive" && (
          <div className="bg-gray-50 border p-4 rounded space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("compfromdate", "From Date", { validateFutureDate: true })}
              {renderDatePicker("comptodate", "To Date")}
            </div>
          </div>
        )}

        {/* OD Only */}
        {prePolicyType === "odonly" && (
          <div className="bg-gray-50 border p-4 rounded space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("odfromdate", "OD From Date", { validateFutureDate: true })}
              {renderDatePicker("odtodate", "OD To Date")}
            </div>
            <div className="text-sm font-semibold">TP Dates</div>
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("odtpfromdate", "TP From Date", { validateFutureDate: true })}
              {renderDatePicker("odtptodate", "TP To Date")}
            </div>
          </div>
        )}

        {/* TP Only */}
        {prePolicyType === "tponly" && (
          <div className="bg-gray-50 border p-4 rounded space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {renderDatePicker("tpfromdate", "TP From Date", { validateFutureDate: true })}
              {renderDatePicker("tptodate", "TP To Date")}
            </div>
          </div>
        )}

        {/* Ownership & Claim */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ownership Transfer */}
          <div>
            <label className="block font-medium mb-1">
              Was there any ownership transfer in the previous year?
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={ownershipToggle}
                onChange={() => {
                  const value = !ownershipToggle ? "1" : "0";
                  setOwnershipToggle(!ownershipToggle);
                  setValue("ownershiptoggle", value);
                }}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <input type="hidden" {...register("ownershiptoggle")} />
          </div>

          {/* Policy Claim */}
          <div>
            <label className="block font-medium mb-1">
              Did you make a claim in your previous policy period?
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={policyToggle}
                onChange={() => {
                  const value = !policyToggle ? "1" : "0";
                  setPolicyToggle(!policyToggle);
                  setValue("policyclaim", value);
                }}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <input type="hidden" {...register("policyclaim")} />
          </div>
        </div>

        {/* Bonus */}
        {!policyToggle && (
          <div>
            <p className="text-base font-medium mb-2">
              How much was the No Claim Bonus in the previous policy?
            </p>
            <div className="flex flex-wrap gap-3">
              {["0", "20", "25", "35", "45", "50"].map((val) => (
                <label key={val} className="cursor-pointer">
                  <input
                    type="radio"
                    value={val}
                    {...register("bonus-button")}
                    className="hidden peer"
                  />
                  <div className="bonus-box peer-checked:ring-2 peer-checked:ring-blue-600 px-4 py-2 rounded border text-sm font-semibold text-center">
                    {val}%
                  </div>
                </label>
              ))}
            </div>
            {/* {bonusValue && (
              <p className="mt-2 text-sm text-gray-600">
                Selected Bonus: {bonusValue}%
              </p>
            )} */}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTWO)}
            className="px-6 py-2 rounded-full font-semibold bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
            style={{
              background: "linear-gradient(to bottom, #426D98, #28A7E4)",
            }}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
