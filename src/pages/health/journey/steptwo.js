"use client";
import React, { useState, useEffect } from "react";
import UniversalDatePicker from "../../datepicker/index";
import { format, parse } from "date-fns";
import { isNumber } from "../../../styles/js/validation";

export default function StepTwoForm({
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
}) {
  const [dates, setDates] = useState({});
//   useEffect(() => {
//   const values = step2Form.getValues();
//   const updatedDates = {};

//   if (values.proposerdob2) {
//     const parsed = parse(values.proposerdob2, "dd-MM-yyyy", new Date());
//     updatedDates.self = { dob: parsed };
//   }

//   if (values.nomineedob) {
//     const parsed = parse(values.nomineedob, "dd-MM-yyyy", new Date());
//     updatedDates.nominee = { dob: parsed };
//   }

//   let childCounter = 1;

//   (steponedata?.members || []).forEach((m) => {
//     const name = m.name?.toLowerCase();
//     let key = "";

//     if (name === "wife") key = "spousedob";
//     else if (name === "father") key = "fatherdob";
//     else if (name === "mother") key = "motherdob";
//     else if (name === "grandfather") key = "grandfatherdob";
//     else if (name === "grandmother") key = "grandmotherdob";
//     else if (name === "fatherinlaw") key = "fatherlawdob";
//     else if (name === "motherinlaw") key = "motherlawdob";
//     else if (name === "son" || name === "daughter") key = `childdob${childCounter++}`;

//     if (values[key]) {
//       const parsed = parse(values[key], "dd-MM-yyyy", new Date());
//       updatedDates[key.replace("dob", "")] = { dob: parsed };
//     }
//   });

//   setDates(updatedDates);
// }, []);


  const handleDateChange = (key, fieldNameInForm) => (date) => {
    if (!date || isNaN(date)) return;

    const formatted = format(date, "dd-MM-yyyy");

    setDates((prev) => ({
      ...prev,
      [key]: { ...prev[key], dob: date },
    }));

    step2Form.setValue(fieldNameInForm, formatted, {
      shouldValidate: true,
    });
  };

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

  const members = [
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

  useEffect(() => {
    const selfData = steponedata?.self?.[0];
    if (selfData?.dob) {
      const parsedDate = parse(selfData.dob, "dd-MM-yyyy", new Date());

      setDates((prev) => ({
        ...prev,
        self: { dob: parsedDate },
      }));

      step2Form.setValue("proposername", selfData.kyc_name || "");
      step2Form.setValue("proposerdob2", selfData.dob);
    }
  }, [steponedata]);

  let childCounter = 1;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Self:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("proposername", {
            required: "Name is required",
          })}
          placeholder="Proposer Name"
          className={inputClass}
        />
        <UniversalDatePicker
          id="dobproposerdob2"
          name="proposerdob2"
          className={`proposerdob2 ...`}
          value={dates?.self?.dob || null}
          data-age={steponedata?.members?.find(m => m.name?.toLowerCase() === "self")?.age || ""}
          onChange={handleDateChange("self", "proposerdob2")}
          placeholder="Pick a date"
          error={!dates?.self?.dob}
          errorText="Please select a valid date"
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

      {members.map((member, index) => {
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

              <UniversalDatePicker
                id={dobFieldName}
                name={dobFieldName}
                className={`${dobFieldName} ...`}
                value={dates?.[`${fieldPrefix}${suffix}`]?.dob || null}
                data-age={member.age}
                onChange={handleDateChange(
                  `${fieldPrefix}${suffix}`,
                  dobFieldName
                )}
                placeholder="Pick a date"
                error={!dates?.[`${fieldPrefix}${suffix}`]?.dob}
                errorText="Please select a valid date"
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

      <h2 className="text-xl font-bold text-gray-800 mt-8">Nominee:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("nomineename", {
            required: "Nominee Name is required",
          })}
          placeholder="Enter Nominee Full Name"
          className={inputClass}
        />
        <UniversalDatePicker
          id="nomineedob"
          name="nomineedob"
          className={`nomineedob ...`}
          value={dates?.nominee?.dob || null}
          data-age=""
          onChange={handleDateChange("nominee", "nomineedob")}
          placeholder="Pick a date"
          // error={!dates?.nominee?.dob || invalidFields.includes("nomineedob")}
          error={!dates?.nominee?.dob }
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
