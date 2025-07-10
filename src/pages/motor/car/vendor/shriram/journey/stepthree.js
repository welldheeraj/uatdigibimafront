"use client";
import React from "react";
import{ useState, useEffect } from "react";
import constant from "@/env";
import UniversalDatePicker from "../../../../../datepicker/index";
import { format, parse } from "date-fns";

export default function StepThreeForm({
  step3Form,
  onSubmitStep,
  steptwodata,
  inputClass,
}) {
  const [dates, setDates] = useState({});
    const handleDateChange = (key, fieldNameInForm) => (date) => {
      if (!date || isNaN(date)) return;
  
      const formatted = format(date, "dd-MM-yyyy");
  
      setDates((prev) => ({
        ...prev,
        [key]: { ...prev[key], dob: date },
      }));
  
      step3Form.setValue(fieldNameInForm, formatted, {
        shouldValidate: true,
      });
    };
  // const rawMembers = (steptwodata?.members || []).filter(
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

  // const members = [
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

  // const medicalonetoggleillness = [
  //   "cancer",
  //   "heart",
  //   "hypertension",
  //   "breathing",
  //   "endocrine",
  //   "diabetes",
  //   "muscles",
  //   "liver",
  //   "kidney",
  //   "auto",
  //   "congenital",
  //   "hivaids",
  //   "any",
  //   "has",
  //   "hasany",
  // ];

  // const medicalonetoggletwoillness = [
  //   "insurer",
  //   "premium",
  //   "insurance",
  //   "diagnosed",
  // ];
  // const lifestyletoggletwoillness=['insurer','premium','insurance','diagnosed'];
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
     {/* NOMINEE SECTION */}
       <input type="hidden" {...step3Form.register("step")} value="three" />
      <h2 className="text-xl font-bold text-gray-800 mt-8">Nominee:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step3Form.register("nomineename", {
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
          error={!dates?.nominee?.dob}
        />
        <select
          {...step3Form.register("nomineerelation", {
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
        className="mt-4 px-6 py-2 thmbtn"
      >
        Continue
      </button>
    </form>
  );
}
