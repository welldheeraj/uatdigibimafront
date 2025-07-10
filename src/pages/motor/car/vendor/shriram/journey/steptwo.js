"use client";
import React, { useState, useEffect } from "react";
import UniversalDatePicker from "../../../../../datepicker/index";
import { format, parse } from "date-fns";
import { Controller } from "react-hook-form";
import { isNumber } from "@/styles/js/validation";
import { CallApi } from "@/api";
import constant from "@/env";

export default function StepTwoForm({
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
  usersData,
}) {

  const [enabled, setEnabled] = useState(false);


 

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // let childCounter = 1;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await CallApi(
  //         constant.API.HEALTH.CARESUPEREME.SAVESTEPTWO,
  //         "GET"
  //       );
  //       const savedData = res.data || [];
  //       console.log(savedData);

  //       if (savedData.length > 0) {
  //         const generatedMembers = savedData
  //           .filter(
  //             (item) =>
  //               item.relation?.toLowerCase() !== "self" &&
  //               !item.relation?.toLowerCase().includes("(nominee)")
  //           )
  //           .map((item) => ({
  //             name: item.relation?.toLowerCase(),
  //             dob: item.dob,
  //             height: item.height,
  //             inch: item.inch,
  //             weight: item.weight,
  //             gender: item.gender,
  //             age: item.age,
  //             fullname: item.name,
  //           }));

  //         setApiMembers(generatedMembers);

  //         const selfData = savedData.find(
  //           (item) => item.relation?.toLowerCase() === "self"
  //         );
  //         if (selfData) {
  //           step2Form.setValue("proposername", selfData.name || "");
  //           step2Form.setValue("proposerdob2", selfData.dob || "");
  //           step2Form.setValue("proposerheight", selfData.height || "");
  //           step2Form.setValue("proposerinches", selfData.inch || "");
  //           step2Form.setValue("proposerweight", selfData.weight || "");
  //           step2Form.setValue(
  //             "proposeroccupation",
  //             selfData.gender === "MALE" ? "Salaried" : "Unemployed"
  //           );

  //           if (selfData.dob) {
  //             const parsedDate = parse(selfData.dob, "dd-MM-yyyy", new Date());
  //             setDates((prev) => ({ ...prev, self: { dob: parsedDate } }));
  //           }
  //         }

  //         const nomineeData = savedData.find(
  //           (item) => item.relation?.toLowerCase() === "(nominee)"
  //         );
  //         if (nomineeData) {
  //           step2Form.setValue("nomineename", nomineeData.name || "");
  //           step2Form.setValue("nomineedob", nomineeData.dob || "");
  //           // step2Form.setValue("nomineerelation", nomineeData.gender || "");

  //           if (nomineeData.dob) {
  //             const parsedDate = parse(
  //               nomineeData.dob,
  //               "dd-MM-yyyy",
  //               new Date()
  //             );
  //             setDates((prev) => ({ ...prev, nominee: { dob: parsedDate } }));
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  // useEffect(() => {
  //   if (apiMembers.length === 0) return;

  //   let tempChildCount = 1;

  //   apiMembers.forEach((member) => {
  //     const name = member.name?.toLowerCase();
  //     let fieldPrefix = "";
  //     let suffix = "";

  //     const isChild = name === "son" || name === "daughter";
  //     const isWife = name === "wife";

  //     if (isChild) {
  //       fieldPrefix = "child";
  //       suffix = tempChildCount++;
  //     } else if (isWife) {
  //       fieldPrefix = "spouse";
  //     } else {
  //       fieldPrefix = name;
  //     }

  //     const fullPrefix = `${fieldPrefix}${suffix}`;

  //     step2Form.setValue(
  //       isChild
  //         ? `${fieldPrefix}relation${suffix}`
  //         : `${fieldPrefix}occupation`,
  //       member.gender === "MALE" ? "Salaried" : "Unemployed"
  //     );

  //     step2Form.setValue(`${fieldPrefix}name${suffix}`, member.fullname || "");
  //     step2Form.setValue(`${fieldPrefix}height${suffix}`, member.height || "");
  //     step2Form.setValue(`${fieldPrefix}inches${suffix}`, member.inch || "");
  //     step2Form.setValue(`${fieldPrefix}weight${suffix}`, member.weight || "");

  //     if (member.dob) {
  //       const parsedDate = parse(member.dob, "dd-MM-yyyy", new Date());
  //       setDates((prev) => ({
  //         ...prev,
  //         [fieldPrefix + suffix]: { dob: parsedDate },
  //       }));
  //       const dobFieldName = isChild
  //         ? `${fieldPrefix}dob${suffix}`
  //         : `${fieldPrefix}dob`;

  //       step2Form.setValue(dobFieldName, member.dob);
  //     }
  //   });
  // }, [apiMembers]);

  // const handleDateChange = (key, fieldNameInForm) => (date) => {
  //   if (!date || isNaN(date)) return;

  //   const formatted = format(date, "dd-MM-yyyy");

  //   setDates((prev) => ({
  //     ...prev,
  //     [key]: { ...prev[key], dob: date },
  //   }));

  //   step2Form.setValue(fieldNameInForm, formatted, {
  //     shouldValidate: true,
  //   });
  // };

  // const rawMembers = (steponedata?.members || []).filter(
  //   (m) => m.name?.toLowerCase() !== "self"
  // );

  // const parentsAndGrandparents = [
  //   "father",
  //   "mother",
  //   "grandfather",
  //   "grandmother",
  //   "fatherinlaw",
  //   "motherinlaw",
  // ];
  // const children = ["son", "daughter"];

  // const computedMembers = [
  //   ...rawMembers.filter((m) => m.name?.toLowerCase() === "wife"),
  //   ...rawMembers.filter((m) =>
  //     parentsAndGrandparents.includes(m.name?.toLowerCase())
  //   ),
  //   ...rawMembers.filter((m) => children.includes(m.name?.toLowerCase())),
  //   ...rawMembers.filter((m) => {
  //     const name = m.name?.toLowerCase();
  //     return (
  //       name !== "wife" &&
  //       !parentsAndGrandparents.includes(name) &&
  //       !children.includes(name)
  //     );
  //   }),
  // ];

  // const finalMembers = apiMembers.length > 0 ? apiMembers : computedMembers;

  // useEffect(() => {
  //   const self = steponedata?.self?.[0] || {};
  //   const u = usersData || {};

  //   const getVal = (key) => self[key] || u[key] || "";

  //   const fieldMap = {
  //     proposername: "kyc_name",
  //     proposerdob2: "dob",
  //     proposerheight: "height",
  //     proposerinches: "inch",
  //     proposerweight: "weight",
  //     proposeroccupation: "occupation",
  //   };

  //   Object.entries(fieldMap).forEach(([formKey, dataKey]) => {
  //     step2Form.setValue(formKey, getVal(dataKey));
  //   });

  //   // Set DOB in date picker
  //   if (getVal("dob")) {
  //     const parsedDate = parse(getVal("dob"), "dd-MM-yyyy", new Date());
  //     setDates((prev) => ({
  //       ...prev,
  //       self: { dob: parsedDate },
  //     }));
  //   }

  //   // Bank details
  //   try {
  //     const bank = u.bank_details ? JSON.parse(u.bank_details) : {};
  //     step2Form.setValue("proposarbankaccount", bank.account || "");
  //     step2Form.setValue("proposarbankifsc", bank.ifsc || "");
  //   } catch (err) {
  //     console.error("Bank details parse error", err);
  //   }
  // }, [steponedata, usersData]);

  // childCounter = 1;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Hypothecation / Loan Toggle Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Hypothecation/Loan</h2>
          <input type="hidden" {...step2Form.register("step")} value="second" />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-500 transition-colors" />
          <div
            className={`absolute left-0 top-0 w-6 h-6 bg-white border border-gray-200 rounded-full shadow transform transition-transform ${
              enabled ? "translate-x-6" : ""
            }`}
          />
        </label>
      </div>

      {/* Conditional Loan Fields */}
      {enabled && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="labelcls">Enter Bank/ Loan provider</label>
            <select
              name="bankloantype"
              {...step2Form.register("bankloantype")}
              className={inputClass}
            >
              <option value="">Select provider…</option>
              <option value="bank1">Bank 1</option>
              <option value="bank2">Bank 2</option>
            </select>
          </div>
          <div>
            <label className="labelcls">Enter Financier Branch</label>
            <input
              type="text"
               {...step2Form.register("financierbranch")}
              placeholder="Branch name…"
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Vehicle & Previous Policy Details Card */}
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
              {...step2Form.register("enginenumber")}
              className={inputClass}
              placeholder="Engine Number"
            />
          </div>
          <div>
            <label className="labelcls">Chassis Number</label>
            <input
              type="text"
              {...step2Form.register("chassisnumber")}
              className={inputClass}
              placeholder="Chassis Number"
            />
          </div>
        </div>
      </div>

      {/* Previous Policy Details */}
      <div>
        <h3 className="text-md font-semibold mb-2">
          Previous Policy Details <span className="text-red-500">*</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="labelcls">Select Insurance</label>
            <select
              name="insuranceCompany"
             {...step2Form.register("prevInsurance")}
              className={inputClass}
            >
              <option value="">-- Select Insurance --</option>
              <option value="acko">Acko General Insurance Ltd</option>
              <option value="bajaj">Bajaj Allianz</option>
              <option value="hdfc">HDFC ERGO</option>
            </select>
          </div>
          <div>
            <label className="labelcls">Policy Type</label>
            <input
              type="text"
              value="COMPREHENSIVE"
             {...step2Form.register("policytype")}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>
          <div>
            <label className="labelcls">Policy Number</label>
            <input
              type="text"
              {...step2Form.register("policynumber")}
              className={inputClass}
              placeholder="Policy Number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="labelcls">Policy From Date</label>

              <Controller
                control={step2Form.control}
                name="policyfdate"
                rules={{ required: "Please select a valid date" }}
                render={({ field, fieldState }) => (
                  <UniversalDatePicker
                    id="policyfdate"
                    name="policyfdate"
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
                control={step2Form.control}
                name="policytodate"
                rules={{ required: "Please select a valid date" }}
                render={({ field, fieldState }) => (
                  <UniversalDatePicker
                    id="policytodate"
                    name="policytodate"
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

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmitStep}
        className="mt-6 px-6 py-2 thmbtn"
      >
        Continue
      </button>
    </form>
  );
}
