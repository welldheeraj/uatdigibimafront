// ✅ File: components/proposal/StepTwoForm.jsx
"use client";
import React from "react";

export default function StepTwoForm({ step2Form, inputClass, onSubmitStep }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Self:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("name", { required: "Name is required" })}
          placeholder="Name"
          className={inputClass}
        />
        <input
          {...step2Form.register("dob", { required: "Date of Birth is required" })}
          type="date"
          placeholder="D.O.B"
          className={inputClass}
        />
        <select
          {...step2Form.register("occupation", { required: "Please select an occupation" })}
          className={inputClass}
        >
          <option value="">Select Occupation</option>
          <option value="Salaried">Salaried</option>
          <option value="Self Employed">Self Employed</option>
          <option value="Unemployed">Unemployed</option>
        </select>
        <div className="flex gap-2">
          <input
            {...step2Form.register("heightFeet", { required: "Height (Feet) is required" })}
            placeholder="Height (Feet)"
            className={inputClass + " w-1/2"}
          />
          <input
            {...step2Form.register("heightInches", { required: "Height (Inches) is required" })}
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
          {...step2Form.register("bankAccount", { required: "Bank Account is required" })}
          placeholder="Bank Account"
          className={inputClass}
        />
        <input
          {...step2Form.register("bankIfsc", { required: "Bank IFSC is required" })}
          placeholder="Bank IFSC"
          className={inputClass}
        />
        <input
          {...step2Form.register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          className={inputClass}
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800">Nominee:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...step2Form.register("nomineeName", { required: "Nominee Name is required" })}
          placeholder="Enter Nominee Full Name"
          className={inputClass}
        />
        <input
          {...step2Form.register("nomineeDob", { required: "Nominee Date of Birth is required" })}
          type="date"
          className={inputClass}
        />
        <select
          {...step2Form.register("nomineeRelation", { required: "Please select the nominee relation" })}
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
