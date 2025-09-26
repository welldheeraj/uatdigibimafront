"use client";
import React from "react";
import StepThreeForm from "./stepthree";
// import validateFormStepThree from "./validateFormStepThree";

export default function StepThreeContainer({
  planType = 1,
  step3Form,
  steptwodata,
  onNext,   // parent se next step function
  onPrev,   // optional
}) {
  const handleSubmitPlan1 = async () => {
    // const ok = await validateFormStepThree(step3Form, steptwodata);
    if (ok && onNext) onNext();
  };

  // const handleSubmitPlan2 = async () => {
  //   // Abhi ke liye Step 3 skip. Agar API ko kuch flag chahiye ho, yahan POST kar do.
  //   if (onNext) onNext();
  // };

  if (planType === 1) {
    // ✅ PURANA Step 3 exactly same chalega (UI + validation + payload)
    return (
      <StepThreeForm
        step3Form={step3Form}
        steptwodata={steptwodata}
        onSubmitStep={handleSubmitPlan1}
      />
    );
  }

  // planType === 2 -> yahan baad me naye questions dikhayenge
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Plan Type 2 – Step 3</h2>
      <p className="text-gray-600">Is plan ke liye alag questions dikhayenge (aap list dena).</p>

      <div className="flex gap-3">
        {onPrev && (
          <button onClick={onPrev} className="px-5 py-2 thmbtn-outline">Back</button>
        )}
        <button onClick={handleSubmitPlan2} className="px-6 py-2 thmbtn">Continue</button>
      </div>
    </div>
  );
}
