// ✅ File: components/proposal/StepFourForm.jsx
"use client";
import React from "react";

export default function StepFourForm({ step4Form, onSubmitStep }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        Help us know the medical condition, if any
      </h2>

      {/* Placeholder content - this step can be extended */}
      <p className="text-sm text-gray-600">
        No additional information required at this step currently.
      </p>

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
