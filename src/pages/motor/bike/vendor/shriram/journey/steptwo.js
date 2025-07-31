"use client";
import React, { useState, useEffect,useMemo ,useCallback } from "react";
import UniversalDatePicker from "../../../../../datepicker/index";
import { format, parse } from "date-fns";
import { Controller } from "react-hook-form";
import DropdownWithSearch from "../../../../../lib/DropdownWithSearch";
import WindowedSelect from "react-windowed-select";
const CHUNK_SIZE = 1000;
export default function StepTwoForm({
  motortype,
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
  usersData,
  bikedata,
  journeydata,
  bankdata,
  prevInsurdata,
}) {
  console.log("motor type wqeewreewrrerwe",bikedata)
  //  const policyDetails = JSON.parse(journeydata.pre_policy_details || "{}");
  // console.log("prevInsuranceId as string:", String(policyDetails.prevInsuranceId));
  console.log(bankdata);
  const [enabled, setEnabled] = useState(false);
   const [optionsChunk, setOptionsChunk] = useState([]);
  const [page, setPage] = useState(1);
  const { handleSubmit, control, register, setValue, formState } = step2Form;

  useEffect(() => {
    if (bikedata?.prepolitype == "bundled") {
      setValue("policyfdate", bikedata.bdfromdate || "");
      setValue("policytodate", bikedata.bdtodate || "");
      setValue("tppolicyfdate", bikedata.bdtpfromdate || "");
      setValue("tppolicytodate", bikedata.bdtptodate || "");
    }
    if (bikedata?.prepolitype == "comprehensive") {
      setValue("policyfdate", bikedata.compfromdate || "");
      setValue("policytodate", bikedata.comptodate || "");
    }
    if (bikedata?.prepolitype == "odonly") {
      setValue("policyfdate", bikedata.odfromdate || "");
      setValue("policytodate", bikedata.odtodate || "");
      setValue("tppolicyfdate", bikedata.odtpfromdate || "");
      setValue("tppolicytodate", bikedata.odtptodate || "");
    }
    if (bikedata?.prepolitype == "tponly") {
      setValue("policyfdate", bikedata.tpfromdate || "");
      setValue("policytodate", bikedata.tptodate || "");
    }

    if (bikedata?.prepolitype)
      setValue("policytype", bikedata.prepolitype.toUpperCase());
    //  console.log(bikedata)
  },[bikedata, setValue]);

  useEffect(() => {
    if (!journeydata || Object.keys(journeydata).length === 0) return;

    const safeParse = (val) => {
      try {
        return val ? JSON.parse(val) : {};
      } catch {
        return {};
      }
    };

    const bankDetails = safeParse(journeydata.bank_details);
    const vehicleDetails = safeParse(journeydata.vehicle_details);
    const policyDetails = safeParse(journeydata.pre_policy_details);
    console.log(bankDetails)

    if (bankDetails?.bankloantype || bankDetails?.financierbranch) {
      setEnabled(true);
      setValue("bankloantype", bankDetails.bankloantype || "");
      setValue("financierbranch", bankDetails.financierbranch || "");
    }

    setValue("enginenumber", vehicleDetails.Enginenumber || "");
    setValue("chassisnumber", vehicleDetails.Chassisnumber || "");
    setValue("prevInsurance", policyDetails.prevInsuranceId || "");
    setValue(
      "policytype",
      policyDetails.policytype || bikedata?.prepolitype?.toUpperCase() || ""
    );
    setValue("policynumber", policyDetails.policynumber || "");
    // setValue("policyfdate", policyDetails.policyfdate || "");
    // setValue("policytodate", policyDetails.policytodate || "");

    if (policyDetails.tpprevInsurance || policyDetails.tppolicynumber) {
      setValue("tpprevInsurance", policyDetails.tpprevInsurance || "");
      setValue("tppolicytype", policyDetails.tppolicytype || "ODONLY");
      setValue("tppolicynumber", policyDetails.tppolicynumber || "");
      // setValue("tppolicyfdate", policyDetails.tppolicyfdate || "");
      // setValue("tppolicytodate", policyDetails.tppolicytodate || "");
    }
  }, [journeydata, bikedata?.prepolitype, setValue]);

  const toggleLoan = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    if (!newVal) {
      setValue("bankloantype", "");
      setValue("financierbranch", "");
    }
  };


  const getNextChunk = useCallback(
  (page) => {
    const start = 0;
    const end = page * CHUNK_SIZE;
    return bankdata.slice(0, end).map((bank) => ({
      value: bank.id,
      label: bank.FIN_NAME,
    }));
  },
  [bankdata]
);

useEffect(() => {
  setOptionsChunk(getNextChunk(1));
}, [getNextChunk]);

  const loadMoreOptions = () => {
    const nextPage = page + 1;
    const newChunk = getNextChunk(nextPage);
    setOptionsChunk(newChunk);
    setPage(nextPage);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitStep)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Hypothecation/Loan</h2>
        <input type="hidden" {...register("step")} value="second" />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={toggleLoan}
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-500 transition-colors" />
          <div
            className={`absolute left-0 top-0 w-6 h-6 bg-white border border-gray-200 rounded-full shadow transform transition-transform ${
              enabled ? "translate-x-6" : ""
            }`}
          />
        </label>
      </div>

      {/* Loan Fields (only shown when enabled = true) */}
      {enabled && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="labelcls">Enter Bank/ Loan provider</label>
            {/* <DropdownWithSearch
              id="bankloantype"
              name="bankloantype"
              // options={brands.map((brand) => ({
              //   value: brand.MANUFACTURER,
              //   label: brand.MANUFACTURER,
              // }))}
              {...register("bankloantype")}
              value={selectedBrand}
              onChange={(value) => {
                setSelectedBrand(value);
                setValue("bankloantype", value);
              }}
              placeholder="Select provider"
              className="inputcls"
            /> */}
    <Controller
      name="bankloantype"
      control={control}
      rules={{ required: "Please select a Bank Loan Type" }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <WindowedSelect
            options={optionsChunk}
            value={optionsChunk.find((opt) => opt.value === field.value)}
            onChange={(selected) => field.onChange(selected?.value || "")}
            onMenuScrollToBottom={loadMoreOptions}
            placeholder="Select or type Bank"
            styles={{
              menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />

          </div>
          <div>
            <label className="labelcls">Enter Financier Branch</label>
            <input
              type="text"
              placeholder="Branch name…"
              {...register("financierbranch")}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Vehicle Details */}
      <div>
        <h3 className="text-md font-semibold mb-2">
          Vehicle Details <span className="text-red-500">*</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="labelcls">Engine Number</label>
            <input
              type="text"
              {...register("enginenumber")}
              className={inputClass}
              placeholder="Engine Number"
            />
          </div>
          <div>
            <label className="labelcls">Chassis Number</label>
            <input
              type="text"
              {...register("chassisnumber")}
              className={inputClass}
              placeholder="Chassis Number"
            />
          </div>
        </div>
      </div>

      {motortype !== "newbike" && (
      <div>
        <h3 className="text-md font-semibold mb-2">
          Previous Policy Details <span className="text-red-500">*</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="labelcls">Select Insurance</label>
            {/* <select {...register("prevInsurance")} className={inputClass}>
              <option value="">-- Select Insurance --</option>
              <option value="acko">Acko General Insurance Ltd</option>
              <option value="bajaj">Bajaj Allianz</option>
              <option value="hdfc">HDFC ERGO</option>
            </select> */}
            <Controller
              name="prevInsurance"
              control={control}
              rules={{ required: "Please select an insurance company" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <DropdownWithSearch
                    id="prevInsurance"
                    name="prevInsurance"
                    options={
                      Array.isArray(prevInsurdata)
                        ? prevInsurdata.map((prevInsur) => ({
                            value: prevInsur.id,
                            label: prevInsur.insurance,
                          }))
                        : []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select or type brand"
                    className="inputcls"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <label className="labelcls">Policy Type</label>
            <input
              type="text"
              {...register("policytype")}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>
          <div>
            <label className="labelcls">Policy Number</label>
            <input
              type="text"
              {...register("policynumber")}
              className={inputClass}
              placeholder="Policy Number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="labelcls">Policy From Date</label>
              <Controller
                control={control}
                name="policyfdate"
                render={({ field }) => (
                  <UniversalDatePicker
                    id="policyfdate"
                    className={inputClass}
                    value={
                      field.value
                        ? parse(field.value, "dd-MM-yyyy", new Date())
                        : null
                    }
                    onChange={() => {}}
                    disabled
                  />
                )}
              />
            </div>
            <div>
              <label className="labelcls">Policy To Date</label>
              <Controller
                control={control}
                name="policytodate"
                render={({ field }) => (
                  <UniversalDatePicker
                    id="policytodate"
                    className={inputClass}
                    value={
                      field.value
                        ? parse(field.value, "dd-MM-yyyy", new Date())
                        : null
                    }
                    onChange={() => {}}
                    disabled
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
     )}
      {/* TP Policy (conditional) */}
      
   {motortype !== "newbike" &&
  (bikedata?.prepolitype === "odonly" || bikedata?.prepolitype === "bundled") && (
        <div>
          <h3 className="text-md font-semibold mb-2">
            TP Policy Details <span className="text-red-500">*</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="labelcls">Select Insurance</label>
              {/* <select {...register("tpprevInsurance")} className={inputClass}>
                <option value="">-- Select Insurance --</option>
                <option value="acko">Acko General Insurance Ltd</option>
                <option value="bajaj">Bajaj Allianz</option>
                <option value="hdfc">HDFC ERGO</option>
              </select> */}
              <Controller
                name="tpprevInsurance"
                control={control}
                rules={{ required: "Please select an insurance company" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DropdownWithSearch
                      id="tpprevInsurance"
                      name="tpprevInsurance"
                      options={
                        Array.isArray(prevInsurdata)
                          ? prevInsurdata.map((prevInsur) => ({
                              value: prevInsur.id,
                              label: prevInsur.insurance,
                            }))
                          : []
                      }
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type brand"
                      className="inputcls"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label className="labelcls">Policy Type</label>
              <input
                type="text"
                value="ODONLY"
                {...register("tppolicytype")}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
            </div>
            <div>
              <label className="labelcls">Policy Number</label>
              <input
                type="text"
                {...register("tppolicynumber")}
                className={inputClass}
                placeholder="Policy Number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="labelcls">Policy From Date</label>
                <Controller
                  control={control}
                  name="tppolicyfdate"
                  rules={{ required: "Please select a valid date" }}
                  render={({ field, fieldState }) => (
                    <UniversalDatePicker
                      id="tppolicyfdate"
                      className={inputClass}
                      value={
                        field.value
                          ? parse(field.value, "dd-MM-yyyy", new Date())
                          : null
                      }
                      onChange={(date) =>
                        field.onChange(date ? format(date, "dd-MM-yyyy") : "")
                      }
                      placeholder="Pick a date"
                      error={!!fieldState.error}
                      errorText={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <div>
                <label className="labelcls">Policy To Date</label>
                <Controller
                  control={control}
                  name="tppolicytodate"
                  rules={{ required: "Please select a valid date" }}
                  render={({ field, fieldState }) => (
                    <UniversalDatePicker
                      id="tppolicytodate"
                      className={inputClass}
                      value={
                        field.value
                          ? parse(field.value, "dd-MM-yyyy", new Date())
                          : null
                      }
                      onChange={(date) =>
                        field.onChange(date ? format(date, "dd-MM-yyyy") : "")
                      }
                      placeholder="Pick a date"
                      error={!!fieldState.error}
                      errorText={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="mt-6 px-6 py-2 thmbtn">
        Continue
      </button>
    </form>
  );
}
