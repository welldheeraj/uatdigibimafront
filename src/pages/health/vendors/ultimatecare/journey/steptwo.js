"use client";
import React, { useState, useEffect, useCallback } from "react";
import UniversalDatePicker from "../../../../datepicker/index";
import { format, parse } from "date-fns";
import { isNumber } from "@/styles/js/validation";
import { CallApi } from "@/api";
import constant from "@/env";
import { Controller } from "react-hook-form";

// --- helpers ---
const normalizeRelation = (rel = "") => rel?.toLowerCase().trim();


const getPrefixByRelation = (relation) => {
  const r = normalizeRelation(relation);
  if (r === "son" || r === "daughter") return "child";
  if (r === "husband" || r === "wife") return "spouse"; // <-- important: unify
  return r || "";
};

const isChildRel = (relation) => {
  const r = normalizeRelation(relation);
  return r === "son" || r === "daughter";
};
const isSpouseRel = (relation) => {
  const r = normalizeRelation(relation);
  return r === "husband" || r === "wife";
};


const titleByRelation = (relation) => {
  const r = normalizeRelation(relation);
  if (!r) return "";
  if (r === "husband") return "Husband";
  if (r === "wife") return "Spouse"; 
  return r.charAt(0).toUpperCase() + r.slice(1);
};

export default function StepTwoForm({
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
  usersData,
}) {
  const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [dates, setDates] = useState({});
  const [apiMembers, setApiMembers] = useState([]);
    const [isMinor, setIsMinor] = useState(false);
  const nomineeDobStr = step2Form.watch("nomineedob");

  const handleDateChange = useCallback(
    (key, fieldNameInForm) => (date) => {
      if (!date || isNaN(date)) return;
      const formatted = format(date, "dd-MM-yyyy");
      setDates((prev) => ({ ...prev, [key]: { ...prev[key], dob: date } }));
      step2Form.clearErrors(fieldNameInForm);
      step2Form.setValue(fieldNameInForm, formatted, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [step2Form]
  );

  useEffect(() => {
    if (isAutoFilled) return;

    const self = steponedata?.self?.[0] || {};
    const u = usersData || {};
    console.log("step one data:", steponedata);

    const getVal = (key) => self[key] || u[key] || "";

    const fieldMap = {
      proposername: "kyc_name",
      proposerdob2: "dob",
      proposerheight: "height",
      proposerinches: "inch",
      proposerweight: "weight",
      proposeroccupation: "occupation",
    };

    Object.entries(fieldMap).forEach(([formKey, dataKey]) => {
      if (!step2Form.getValues(formKey)) {
        step2Form.setValue(formKey, getVal(dataKey));
      }
    });

    if (!step2Form.getValues("proposerdob2") && getVal("dob")) {
      const parsedDate = parse(getVal("dob"), "dd-MM-yyyy", new Date());
      setDates((prev) => ({ ...prev, self: { dob: parsedDate } }));
    }

    try {
      const bank = u.bank_details ? JSON.parse(u.bank_details) : {};
      if (!step2Form.getValues("proposarbankaccount")) {
        step2Form.setValue("proposarbankaccount", bank.account || "");
      }
      if (!step2Form.getValues("proposarbankifsc")) {
        step2Form.setValue("proposarbankifsc", bank.ifsc || "");
      }
    } catch (err) {
      console.error("Bank details parse error", err);
    }

    setIsAutoFilled(true);
  }, [isAutoFilled, step2Form, steponedata, usersData]);


  const allMembers = steponedata?.members || [];


  const spouseMembers = allMembers.filter((m) =>
    ["wife", "husband"].includes(m.name?.toLowerCase())
  );
  const childrenMembers = allMembers.filter((m) =>
    ["son", "daughter"].includes(m.name?.toLowerCase())
  );
  const otherMembers = allMembers.filter(
    (m) =>
      !["self", "wife", "husband"].includes(m.name?.toLowerCase()) &&
      !["son", "daughter"].includes(m.name?.toLowerCase()) &&
      !m.name?.toLowerCase().includes("nominee")
  );

  // Final members order
  const orderedMembers = [...spouseMembers, ...childrenMembers, ...otherMembers];

  let childCount = 1;


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAutoFilled) return;

        const res = await CallApi(
          constant.API.HEALTH.ULTIMATECARE.SAVESTEPTWO,
          "GET"
        );
        console.log("API Response:", res);

        const savedData = res.data || [];

        // BANK
        const raw = res.bank_details;
        if (raw) {
          const bankData =
            typeof raw === "object"
              ? typeof raw.bank_details === "string"
                ? JSON.parse(raw.bank_details)
                : raw
              : {};
          if (!step2Form.getValues("proposarbankaccount")) {
            step2Form.setValue("proposarbankaccount", bankData.account || "");
          }
          if (!step2Form.getValues("proposarbankifsc")) {
            step2Form.setValue("proposarbankifsc", bankData.ifsc || "");
          }
        }

        // SELF
        const selfData = savedData.find(
          (item) => item.relation?.toLowerCase() === "self"
        );
        if (selfData) {
          step2Form.setValue("proposername", selfData.name || "");
          step2Form.setValue("proposerdob2", selfData.dob || "");
          if (selfData.dob) {
            const parsedDate = parse(selfData.dob, "dd-MM-yyyy", new Date());
            setDates((prev) => ({ ...prev, self: { dob: parsedDate } }));
          }
          step2Form.setValue("proposerheight", selfData.height || "");
          step2Form.setValue("proposerinches", selfData.inch || "");
          step2Form.setValue("proposerweight", selfData.weight || "");
          step2Form.setValue(
            "proposeroccupation",
            selfData.gender === "MALE" ? "Salaried" : "Unemployed"
          );
        }

        // NOMINEE
        const nomineeData = savedData.find((item) =>
          (item.relation || "").toLowerCase().includes("nominee")
        );
        if (nomineeData) {
          console.log("nomineeData",nomineeData)
          step2Form.setValue("nomineename", nomineeData.name || "");
          step2Form.setValue("nomineedob", nomineeData.dob || "");
        
          if (nomineeData.dob) {
            const parsedDate = parse(nomineeData.dob, "dd-MM-yyyy", new Date());
            setDates((prev) => ({ ...prev, nominee: { dob: parsedDate } }));
          }
          const cleanRelation = nomineeData.relation
            ?.replace(/[^a-z]/gi, "")
            .replace(/nominee/gi, "")
            .trim();
          const capitalizedRelation =
            cleanRelation?.charAt(0).toUpperCase() +
            cleanRelation?.slice(1).toLowerCase();
          step2Form.setValue("nomineerelation", capitalizedRelation || "");
        }
        if(isMinor){
            step2Form.setValue("appointeename", nomineeData.appointee_name || "");
            const appointeeRelation = nomineeData.appointee_relation
              ? nomineeData.appointee_relation.charAt(0).toUpperCase() +
                nomineeData.appointee_relation.slice(1).toLowerCase()
              : "";

            step2Form.setValue("appointeerelation", appointeeRelation);
        }

        setApiMembers(savedData);
        setIsAutoFilled(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isAutoFilled, step2Form]);

/** Prefill members from API into form fields (ONLY for members present in Step One) */
useEffect(() => {
  if (!apiMembers || !apiMembers.length) return;

  // 1) Build allow-lists from Step One rendered members
  const namesFromStepOne = (steponedata?.members || []).map((m) =>
    normalizeRelation(m?.name)
  );

  const allowedNames = new Set(namesFromStepOne); // e.g., 'wife', 'son', 'father', etc.
  const allowSpouse =
    allowedNames.has("husband") || allowedNames.has("wife"); // spouse fields only if rendered

  const allowedChildSlots = namesFromStepOne.filter(
    (n) => n === "son" || n === "daughter"
  ).length; // how many child blocks rendered

  let childCountUsed = 0; // do not exceed rendered child slots

  // 2) Fill ONLY allowed members
  apiMembers.forEach((apiMember) => {
    const relation = normalizeRelation(apiMember?.relation);
    if (!relation || relation === "self" || relation.includes("nominee")) return;

    // Skip if this relation is NOT rendered in Step One UI
    if (isSpouseRel(relation) && !allowSpouse) return;

    if (isChildRel(relation)) {
      // respect the number of child blocks created by Step One
      if (childCountUsed >= allowedChildSlots) return;
      childCountUsed += 1;
    } else {
      // e.g. father/mother/brother must exist in Step One list to be filled
      if (!allowedNames.has(relation)) return;
    }

    const prefix = getPrefixByRelation(relation); // 'spouse' | 'child' | 'father' ...
    const suffix = isChildRel(relation) ? String(childCountUsed) : "";
    const dobField = suffix ? `${prefix}dob${suffix}` : `${prefix}dob`;

    step2Form.setValue(`${prefix}name${suffix}`, apiMember?.name || "");
    step2Form.setValue(`${prefix}height${suffix}`, apiMember?.height || "");
    step2Form.setValue(`${prefix}inches${suffix}`, apiMember?.inch || "");
    step2Form.setValue(`${prefix}weight${suffix}`, apiMember?.weight || "");

    if (!isChildRel(relation)) {
      step2Form.setValue(
        `${prefix}occupation${suffix}`,
        apiMember?.gender === "MALE" ? "Salaried" : "Unemployed"
      );
    }

    if (apiMember?.dob) {
      step2Form.setValue(dobField, apiMember.dob, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      step2Form.clearErrors(dobField);
    }
  });
}, [apiMembers, steponedata?.members, step2Form]);

  // Stale field errors clear
  useEffect(() => {
    const sub = step2Form.watch((vals, { name }) => {
      if (name && vals?.[name]) step2Form.clearErrors(name);
    });
    return () => sub?.unsubscribe?.();
  }, [step2Form]);

  let childCounterForRender = 1;

      /* -------------------- Appointee: minor detection -------------------- */


  const getAge = (dateObj) => {
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) age--;
    return age;
  };

  useEffect(() => {
    if (!nomineeDobStr) {
      setIsMinor(false);
      return;
    }
    const d = parse(nomineeDobStr, "dd-MM-yyyy", new Date());
    if (isNaN(d)) {
      setIsMinor(false);
      return;
    }
    setIsMinor(getAge(d) < 18);
  }, [nomineeDobStr]);
  /* -------------------------------------------------------------------- */
   useEffect(() => {
    if (isMinor) {
      step2Form.register("appointeename", {
        required: "Appointee Name is required",
      });
      step2Form.register("appointeerelation", {
        required: "Please select the appointee relation",
      });
    } else {
      step2Form.unregister("appointeename");
      step2Form.unregister("appointeerelation");
    }
  }, [isMinor, step2Form]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      {/* SELF SECTION */}
      <h2 className="text-xl font-bold text-gray-800">Self:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("proposername", {
            required: "Name is required",
          })}
          placeholder="Proposer Name"
          className={inputClass}
        />

        <Controller
          control={step2Form.control}
          name="proposerdob2"
          rules={{ required: "Proposer DOB required" }}
          render={({ field, fieldState }) => (
            <UniversalDatePicker
              id="dobproposerdob2"
              name="proposerdob2"
              value={
                field.value
                  ? parse(field.value, "dd-MM-yyyy", new Date())
                  : null
              }
              onChange={(date) => {
                if (date instanceof Date && !isNaN(date)) {
                  const formatted = format(date, "dd-MM-yyyy");
                  field.onChange(formatted);
                  handleDateChange("self", "proposerdob2")(date);
                }
              }}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              placeholder="Pick a date"
            />
          )}
        />

        <select
          {...step2Form.register("proposeroccupation", {
            required: "Please select an occupation",
          })}
          className={inputClass}
        >
          <option value="">Select Occupation</option>
          <option value="Salaried">Salaried</option>
          <option value="Self Employed">Self Employed</option>
          <option value="Unemployed">Unemployed</option>
        </select>

        <div className="flex gap-2">
          <input
            {...step2Form.register("proposerheight", {
              required: "Height (Feet) is required",
            })}
            onChange={(e) => isNumber(e, step2Form.setValue, "proposerheight")}
            maxLength={1}
            placeholder="Height (Feet)"
            className={`${inputClass} w-1/2`}
          />
          <input
            {...step2Form.register("proposerinches", {
              required: "Height (Inches) is required",
            })}
            onChange={(e) => isNumber(e, step2Form.setValue, "proposerinches")}
            maxLength={2}
            placeholder="Height (Inches)"
            className={`${inputClass} w-1/2`}
          />
        </div>

        <input
          {...step2Form.register("proposerweight", {
            required: "Weight is required",
          })}
          onChange={(e) => isNumber(e, step2Form.setValue, "proposerweight")}
          maxLength={3}
          placeholder="Weight (KG)"
          className={inputClass}
        />
        <input
          {...step2Form.register("proposarbankaccount", {
            required: "Bank Account is required",
          })}
          placeholder="Bank Account"
          className={inputClass}
        />
        <input
          {...step2Form.register("proposarbankifsc", {
            required: "Bank IFSC is required",
          })}
          placeholder="Bank IFSC"
          className={inputClass}
        />
      </div>

      {/* MEMBERS SECTION */}
      {orderedMembers.map((member, index) => {
        const relation = normalizeRelation(member?.name);
        const isChild = isChildRel(relation);
        const isSpouse = isSpouseRel(relation);

        const prefix = getPrefixByRelation(relation);
        const suffix = isChild ? childCounterForRender++ : "";
        const dobFieldName = isChild ? `${prefix}dob${suffix}` : `${prefix}dob`;

        // UI-only dynamic labels
        const spouseLabel = isSpouse ? (relation === "husband" ? "Husband" : "Spouse") : "";
        const spouseKeyLabel = isSpouse ? (relation === "husband" ? "husband" : "spouse") : "";

        return (
          <div key={index} className="mt-6">
            <h2 className="font-semibold text-lg capitalize mb-4">
              {titleByRelation(relation)} Details:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...step2Form.register(
                  isChild ? `${prefix}name${suffix}` : `${prefix}name`,
                  {
                    
                    required: isSpouse
                      ? `${spouseKeyLabel}name is required`
                      : "Name is required",
                  }
                )}
                placeholder={
                  isSpouse
                    ? `Enter ${spouseLabel}'s Full Name`
                    : `Enter ${member.name}'s Full Name`
                }
                className={inputClass}
              />

              <Controller
                control={step2Form.control}
                name={dobFieldName}
                rules={{
              
                  required: isSpouse
                    ? `${spouseKeyLabel}dob is required`
                    : "Please select a valid date",
                }}
                render={({ field, fieldState }) => (
                  <UniversalDatePicker
                    id={dobFieldName}
                    name={dobFieldName}
                    value={
                      field.value
                        ? parse(field.value, "dd-MM-yyyy", new Date())
                        : null
                    }
                    data-age={member.age}
                    onChange={(date) => {
                      if (date instanceof Date && !isNaN(date)) {
                        const formatted = format(date, "dd-MM-yyyy");
                        field.onChange(formatted);
                        handleDateChange(`${prefix}${suffix}`, dobFieldName)(
                          date
                        );
                      }
                    }}
                    placeholder={
                      isSpouse ? `${spouseLabel} DOB` : "Pick a date"
                    }
                    error={!!fieldState.error}
                    errorText={fieldState.error?.message}
                  />
                )}
              />

              {isChild ? (
                <select
                  {...step2Form.register(`${prefix}relation${suffix}`, {
                    required: "Please select an occupation",
                  })}
                  className={inputClass}
                >
                  <option value="">Child Relation</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                </select>
              ) : isSpouse ? (
                <select
                  {...step2Form.register(`${prefix}occupation`, {
                    
                    required: `${spouseKeyLabel}occupation is required`,
                  })}
                  className={inputClass}
                >
                  <option value="">Select Occupation</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              ) : null}

              <div className="flex gap-2">
                <input
                  {...step2Form.register(
                    isChild ? `${prefix}height${suffix}` : `${prefix}height`,
                    {
                     
                      required: isSpouse
                        ? `${spouseKeyLabel}height is required`
                        : "Height (Feet) is required",
                    }
                  )}
                  onChange={(e) =>
                    isNumber(
                      e,
                      step2Form.setValue,
                      isChild ? `${prefix}height${suffix}` : `${prefix}height`
                    )
                  }
                  maxLength={1}
                  placeholder={
                    isSpouse ? `${spouseLabel} Height (Feet)` : "Height (Feet)"
                  }
                  className={`${inputClass} w-1/2`}
                />
                <input
                  {...step2Form.register(
                    isChild ? `${prefix}inches${suffix}` : `${prefix}inches`,
                    {
                     
                      required: isSpouse
                        ? `${spouseKeyLabel}inches is required`
                        : "Height (Inches) is required",
                    }
                  )}
                  onChange={(e) =>
                    isNumber(
                      e,
                      step2Form.setValue,
                      isChild ? `${prefix}inches${suffix}` : `${prefix}inches`
                    )
                  }
                  maxLength={2}
                  placeholder={
                    isSpouse
                      ? `${spouseLabel} Height (Inches)`
                      : "Height (Inches)"
                  }
                  className={`${inputClass} w-1/2`}
                />
              </div>

              <input
                {...step2Form.register(
                  isChild ? `${prefix}weight${suffix}` : `${prefix}weight`,
                  {
                   
                    required: isSpouse
                      ? `${spouseKeyLabel}weight is required`
                      : "Weight is required",
                  }
                )}
                onChange={(e) =>
                  isNumber(
                    e,
                    step2Form.setValue,
                    isChild ? `${prefix}weight${suffix}` : `${prefix}weight`
                  )
                }
                maxLength={3}
                placeholder={
                  isSpouse ? `${spouseLabel} Weight (KG)` : "Weight (KG)"
                }
                className={inputClass}
              />
            </div>
          </div>
        );
      })}

      {/* NOMINEE SECTION */}
      <h2 className="text-xl font-bold text-gray-800 mt-8">Nominee:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("nomineename", {
            required: "Nominee Name is required",
          })}
          placeholder="Enter Nominee Full Name"
          className={inputClass}
        />
        <Controller
          control={step2Form.control}
          name="nomineedob"
          rules={{ required: "Nominee DOB is required" }}
          render={({ field, fieldState }) => (
            <UniversalDatePicker
              id="nomineedob"
              name="nomineedob"
              value={
                field.value
                  ? parse(field.value, "dd-MM-yyyy", new Date())
                  : null
              }
              onChange={(date) => {
                if (date instanceof Date && !isNaN(date)) {
                  const formatted = format(date, "dd-MM-yyyy");
                  field.onChange(formatted);
                  handleDateChange("nominee", "nomineedob")(date);
                }
              }}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              placeholder="Pick a date"
            />
          )}
        />

        <select
          {...step2Form.register("nomineerelation", {
            required: "Please select the nominee relation",
          })}
          className={inputClass}
        >
          <option value="">Relation</option>
          <option value="Spouse">Spouse</option>
          <option value="Father">Father</option>
          <option value="Mother">Mother</option>
          <option value="Brother">Brother</option>
          <option value="Sister">Sister</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
        </select>

                  {/* Show Appointee fields if nominee is a minor */}
        {isMinor && (
          <>
            <input
              {...step2Form.register("appointeename", {
                required: "Appointee Name is required",
              })}
              placeholder="Enter Appointee Full Name"
              className={inputClass}
            />
            <select
              {...step2Form.register("appointeerelation", {
                required: "Please select the appointee relation",
              })}
              className={inputClass}
            >
              <option value="">Relation</option>
              <option value="Spouse">Spouse</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
            </select>
          </>
        )}
      </div>

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
