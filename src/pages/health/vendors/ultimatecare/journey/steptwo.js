"use client";
import React, { useState, useEffect, useCallback } from "react";
import UniversalDatePicker from "../../../../datepicker/index";
import { format, parse } from "date-fns";
import { isNumber } from "@/styles/js/validation";
import { CallApi } from "@/api";
import constant from "@/env";
import { Controller } from "react-hook-form";

export default function StepTwoForm({
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
  usersData,
}) {
  const [isSelfInitialized, setIsSelfInitialized] = useState(false);
  const [isNomineeInitialized, setIsNomineeInitialized] = useState(false);
  const [isMembersInitialized, setIsMembersInitialized] = useState(false);
  const [dates, setDates] = useState({});
  const [apiMembers, setApiMembers] = useState([]);
    const [isMinor, setIsMinor] = useState(false);
  const nomineeDobStr = step2Form.watch("nomineedob");
  let childCounter = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CallApi(
          constant.API.HEALTH.ULTIMATECARE.SAVESTEPTWO,
          "GET"
        );
        const savedData = res.data || [];
        console.log(savedData);
        let bankData = {};
        const raw = res.bank_details;

        if (raw) {
          bankData =
            typeof raw === "object"
              ? typeof raw.bank_details === "string"
                ? JSON.parse(raw.bank_details)
                : raw
              : {};
          step2Form.setValue("proposarbankaccount", bankData.account || "");
          step2Form.setValue("proposarbankifsc", bankData.ifsc || "");
        }

        if (savedData.length > 0) {
          const generatedMembers = savedData
            .filter(
              (item) =>
                item.relation?.toLowerCase() !== "self" &&
                !item.relation?.toLowerCase().includes("(nominee)")
            )
            .map((item) => ({
              name: item.relation?.toLowerCase(),
              dob: item.dob,
              height: item.height,
              inch: item.inch,
              weight: item.weight,
              gender: item.gender,
              age: item.age,
              fullname: item.name,
            }));

          setApiMembers(generatedMembers);

          if (!isSelfInitialized) {
            const selfData = savedData.find(
              (item) => item.relation?.toLowerCase() === "self"
            );

            if (selfData) {
              step2Form.setValue("proposername", selfData.name || "");
              step2Form.setValue("proposerdob2", selfData.dob || "");
              step2Form.setValue("proposerheight", selfData.height || "");
              step2Form.setValue("proposerinches", selfData.inch || "");
              step2Form.setValue("proposerweight", selfData.weight || "");
              step2Form.setValue(
                "proposeroccupation",
                selfData.gender === "MALE" ? "Salaried" : "Unemployed"
              );

              if (selfData.dob) {
                const parsedDate = parse(
                  selfData.dob,
                  "dd-MM-yyyy",
                  new Date()
                );
                setDates((prev) => ({ ...prev, self: { dob: parsedDate } }));
              }

              setIsSelfInitialized(true);
            }
          }
          if (!isNomineeInitialized) {
            const nomineeData = savedData.find((item) =>
              (item.relation || "").toLowerCase().includes("nominee")
            );

            console.log("Fetched nomineeData:", nomineeData);

            if (nomineeData) {
              step2Form.setValue("nomineename", nomineeData.name || "");
              step2Form.setValue("nomineedob", nomineeData.dob || "");

              const cleanRelation = nomineeData.relation
                ?.replace(/[^a-z]/gi, "")
                .replace(/nominee/gi, "")
                .trim();

              const capitalizedRelation =
                cleanRelation?.charAt(0).toUpperCase() +
                cleanRelation?.slice(1).toLowerCase();

              step2Form.setValue("nomineerelation", capitalizedRelation || "");

              if (nomineeData.dob) {
                const parsedDate = parse(
                  nomineeData.dob,
                  "dd-MM-yyyy",
                  new Date()
                );
                setDates((prev) => ({ ...prev, nominee: { dob: parsedDate } }));
              }

              setIsNomineeInitialized(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [step2Form, isSelfInitialized, isNomineeInitialized]);

  useEffect(() => {
    if (apiMembers.length === 0 || isMembersInitialized) return;

    let tempChildCount = 1;

    apiMembers.forEach((member) => {
      const name = member.name?.toLowerCase();
      let fieldPrefix = "";
      let suffix = "";

      const isChild = name === "son" || name === "daughter";
      const isWife = name === "wife";

      if (isChild) {
        fieldPrefix = "child";
        suffix = tempChildCount++;
      } else if (isWife) {
        fieldPrefix = "spouse";
      } else {
        fieldPrefix = name;
      }

      const fullPrefix = `${fieldPrefix}${suffix}`;

      step2Form.setValue(
        isChild
          ? `${fieldPrefix}relation${suffix}`
          : `${fieldPrefix}occupation`,
        member.gender === "MALE" ? "Salaried" : "Unemployed"
      );

      step2Form.setValue(`${fieldPrefix}name${suffix}`, member.fullname || "");
      step2Form.setValue(`${fieldPrefix}height${suffix}`, member.height || "");
      step2Form.setValue(`${fieldPrefix}inches${suffix}`, member.inch || "");
      step2Form.setValue(`${fieldPrefix}weight${suffix}`, member.weight || "");

      if (member.dob) {
        const parsedDate = parse(member.dob, "dd-MM-yyyy", new Date());
        setDates((prev) => ({
          ...prev,
          [fieldPrefix + suffix]: { dob: parsedDate },
        }));
        const dobFieldName = isChild
          ? `${fieldPrefix}dob${suffix}`
          : `${fieldPrefix}dob`;

        step2Form.setValue(dobFieldName, member.dob);
      }
    });
    setIsMembersInitialized(true);
  }, [apiMembers, isMembersInitialized,step2Form]);

const handleDateChange = useCallback(
  (key, fieldNameInForm) => (date) => {
    if (!date || isNaN(date)) return;

    const formatted = format(date, "dd-MM-yyyy");
    setDates((prev) => ({ ...prev, [key]: { ...prev[key], dob: date } }));
    step2Form.setValue(fieldNameInForm, formatted, { shouldValidate: true });
  },
  [step2Form]
);

  const rawMembers = (steponedata?.members || []).filter(
    (m) => m.name?.toLowerCase() !== "self"
  );

  const parentsAndGrandparents = [
    "father",
    "mother",
    "grandfather",
    "grandmother",
    "fatherinlaw",
    "motherinlaw",
  ];
  const children = ["son", "daughter"];

  const computedMembers = [
    ...rawMembers.filter((m) => m.name?.toLowerCase() === "wife"),
    ...rawMembers.filter((m) =>
      parentsAndGrandparents.includes(m.name?.toLowerCase())
    ),
    ...rawMembers.filter((m) => children.includes(m.name?.toLowerCase())),
    ...rawMembers.filter((m) => {
      const name = m.name?.toLowerCase();
      return (
        name !== "wife" &&
        !parentsAndGrandparents.includes(name) &&
        !children.includes(name)
      );
    }),
  ];

  const finalMembers = apiMembers.length > 0 ? apiMembers : computedMembers;

  useEffect(() => {
    const self = steponedata?.self?.[0] || {};
    const u = usersData || {};
    const alreadyFilled = step2Form.getValues("proposername");
    if (alreadyFilled) return;

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
      step2Form.setValue(formKey, getVal(dataKey));
    });

    // Set DOB in date picker
    if (getVal("dob")) {
      const parsedDate = parse(getVal("dob"), "dd-MM-yyyy", new Date());
      setDates((prev) => ({
        ...prev,
        self: { dob: parsedDate },
      }));
    }

    // Bank details
    try {
      const bank = u.bank_details ? JSON.parse(u.bank_details) : {};
      step2Form.setValue("proposarbankaccount", bank.account || "");
      step2Form.setValue("proposarbankifsc", bank.ifsc || "");
    } catch (err) {
      console.error("Bank details parse error", err);
    }
  }, [steponedata, usersData,step2Form]);

  childCounter = 1;
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
      {finalMembers.map((member, index) => {
        const name = member.name?.toLowerCase();
        let isChild = name === "son" || name === "daughter";
        let isWife = name === "wife";

        let fieldPrefix = "";
        let suffix = "";

        if (isChild) {
          fieldPrefix = "child";
          suffix = childCounter++;
        } else if (isWife) {
          fieldPrefix = "spouse";
        } else {
          fieldPrefix = name;
        }

        const dobFieldName = isChild
          ? `${fieldPrefix}dob${suffix}`
          : `${fieldPrefix}dob`;

        return (
          <div key={index} className="mt-6">
            <h2 className="font-semibold text-lg capitalize mb-4">
              {isWife ? "Spouse" : member.name} Details:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...step2Form.register(
                  isChild
                    ? `${fieldPrefix}name${suffix}`
                    : `${fieldPrefix}name`,
                  { required: "Name is required" }
                )}
                placeholder={`Enter ${member.name}'s Full Name`}
                className={inputClass}
              />

             <Controller
                control={step2Form.control}
                name={dobFieldName}
                rules={{ required: "Please select a valid date" }}
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
                        handleDateChange(
                          `${prefix}${suffix}`,
                          dobFieldName
                        )(date);
                      }
                    }}
                    placeholder="Pick a date"
                    error={!!fieldState.error}
                    errorText={fieldState.error?.message}
                  />
                )}
              />

              {isChild ? (
                <input
                  {...step2Form.register(`${fieldPrefix}relation${suffix}`, {
                    required: "Relation is required",
                  })}
                  placeholder="Relation (e.g., Son/Daughter)"
                  className={inputClass}
                />
              ) : (
                <select
                  {...step2Form.register(`${fieldPrefix}occupation`, {
                    required: "Please select an occupation",
                  })}
                  className={inputClass}
                >
                  <option value="">Select Occupation</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              )}

              <div className="flex gap-2">
                <input
                  {...step2Form.register(
                    isChild
                      ? `${fieldPrefix}height${suffix}`
                      : `${fieldPrefix}height`,
                    { required: "Height (Feet) is required" }
                  )}
                  onChange={(e) =>
                    isNumber(
                      e,
                      step2Form.setValue,
                      isChild
                        ? `${fieldPrefix}height${suffix}`
                        : `${fieldPrefix}height`
                    )
                  }
                  maxLength={1}
                  placeholder="Height (Feet)"
                  className={`${inputClass} w-1/2`}
                />
                <input
                  {...step2Form.register(
                    isChild
                      ? `${fieldPrefix}inches${suffix}`
                      : `${fieldPrefix}inches`,
                    { required: "Height (Inches) is required" }
                  )}
                  onChange={(e) =>
                    isNumber(
                      e,
                      step2Form.setValue,
                      isChild
                        ? `${fieldPrefix}inches${suffix}`
                        : `${fieldPrefix}inches`
                    )
                  }
                  maxLength={2}
                  placeholder="Height (Inches)"
                  className={`${inputClass} w-1/2`}
                />
              </div>

              <input
                {...step2Form.register(
                  isChild
                    ? `${fieldPrefix}weight${suffix}`
                    : `${fieldPrefix}weight`,
                  { required: "Weight is required" }
                )}
                onChange={(e) =>
                  isNumber(
                    e,
                    step2Form.setValue,
                    isChild
                      ? `${fieldPrefix}weight${suffix}`
                      : `${fieldPrefix}weight`
                  )
                }
                maxLength={3}
                placeholder="Weight (KG)"
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
