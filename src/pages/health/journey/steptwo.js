"use client";
import React, { useState, useEffect } from "react";
import UniversalDatePicker from "../../datepicker/index";
import { parse } from "date-fns";

export default function StepTwoForm({
  step2Form,
  steponedata,
  inputClass,
  onSubmitStep,
}) {
  const [dates, setDates] = useState({});

  const handleDateChange = (sectionKey, field) => (value) => {
    setDates((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));

    step2Form.setValue(`${sectionKey}.${field}`, value, {
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
  // 1. Wife
  ...rawMembers.filter((m) => m.name?.toLowerCase() === "wife"),

  // 2. Parents & Grandparents
  ...rawMembers.filter((m) =>
    parentsAndGrandparents.includes(m.name?.toLowerCase())
  ),

  // 3. Children (Son/Daughter)
  ...rawMembers.filter((m) => children.includes(m.name?.toLowerCase())),

  // 4. Others (excluding all above)
  ...rawMembers.filter(
    (m) => {
      const name = m.name?.toLowerCase();
      return (
        name !== "wife" &&
        !parentsAndGrandparents.includes(name) &&
        !children.includes(name)
      );
    }
  ),
];


useEffect(() => {
  const selfData = steponedata?.self?.[0];
  if (selfData) {
    const formattedDob = selfData.dob
      ? parse(selfData.dob, "dd-MM-yyyy", new Date())
      : "";

    step2Form.setValue("name", selfData.kyc_name || "");
    step2Form.setValue("dob", formattedDob || "");

    setDates((prev) => ({
      ...prev,
      self: {
        ...prev.self,
        dob: formattedDob || "",
      },
    }));
  }
}, [steponedata]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Self:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("name", { required: "Name is required" })}
          placeholder="Name"
          className={inputClass}
        />
        <UniversalDatePicker
          id="dob"
          name="dob"
          value={dates?.self?.dob || ""}
          onChange={handleDateChange("self", "dob")}
          placeholder="Pick a date"
          error={!dates?.self?.dob}
          errorText="Please select a valid date"
        />

        <select
          {...step2Form.register("occupation", {
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
            {...step2Form.register("heightFeet", {
              required: "Height (Feet) is required",
            })}
            placeholder="Height (Feet)"
            className={inputClass + " w-1/2"}
          />
          <input
            {...step2Form.register("heightInches", {
              required: "Height (Inches) is required",
            })}
            placeholder="Height (Inches)"
            className={inputClass + " w-1/2"}
          />
        </div>

        <input
          {...step2Form.register("weight", { required: "Weight is required" })}
          placeholder="Weight (KG)"
          className={inputClass}
        />

        <input
          {...step2Form.register("bankAccount", {
            required: "Bank Account is required",
          })}
          placeholder="Bank Account"
          className={inputClass}
        />

        <input
          {...step2Form.register("bankIfsc", {
            required: "Bank IFSC is required",
          })}
          placeholder="Bank IFSC"
          className={inputClass}
        />

        <input
          {...step2Form.register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          className={inputClass}
        />
      </div>

      {members.map((member, index) => (
        <div key={index} className="">
          <h2 className="font-semibold text-lg capitalize mb-4">
            {member.name} Details:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...step2Form.register(`members.${index}.name`, {
                required: "Name is required",
              })}
              placeholder={`Enter ${member.name}'s Full Name`}
              className={inputClass}
            />

            <UniversalDatePicker
              id={`members.${index}.dob`}
              name={`members.${index}.dob`}
              value={dates?.[`member-${index}`]?.dob || ""}
              onChange={handleDateChange(`members.${index}`, "dob")}
              placeholder="Pick a date"
              error={!dates?.[`member-${index}`]?.dob}
              errorText="Please select a valid date"
            />

            <select
              {...step2Form.register(`members.${index}.occupation`, {
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
                {...step2Form.register(`members.${index}.heightFeet`, {
                  required: "Height (Feet) is required",
                })}
                placeholder="Height (Feet)"
                className={`${inputClass} w-1/2`}
              />
              <input
                {...step2Form.register(`members.${index}.heightInches`, {
                  required: "Height (Inches) is required",
                })}
                placeholder="Height (Inches)"
                className={`${inputClass} w-1/2`}
              />
            </div>

            <input
              {...step2Form.register(`members.${index}.weight`, {
                required: "Weight is required",
              })}
              placeholder="Weight (KG)"
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <h2 className="text-xl font-bold text-gray-800">Nominee:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("nomineeName", {
            required: "Nominee Name is required",
          })}
          placeholder="Enter Nominee Full Name"
          className={inputClass}
        />
        <UniversalDatePicker
          id="nomineeDob"
          name="nomineeDob"
          value={dates?.nominee?.dob || ""}
          onChange={handleDateChange("nominee", "dob")}
          placeholder="Pick a date"
          error={!dates?.nominee?.dob}
          errorText="Please select a valid date"
        />
        <select
          {...step2Form.register("nomineeRelation", {
            required: "Please select the nominee relation",
          })}
          className={inputClass}
        >
          <option value="">Relation</option>
          <option value="Spouse">Spouse</option>
          <option value="Child">Child</option>
          <option value="Parent">Parent</option>
          <option value="Sibling">Sibling</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onSubmitStep}
        className="mt-4 px-6 py-2 thmbtn"
      >
        Continue
      </button>
    </form>
  );
}
