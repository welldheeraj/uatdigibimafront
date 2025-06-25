"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import StepOneForm from "./stepone.js";
import StepTwoForm from "./steptwo.js";
import StepThreeForm from "./stepthree.js";
import StepFourForm from "./stepfour.js";
import { showSuccess, showError } from "../../../styles/js/toaster";
import { validateFields } from "../../../styles/js/validation.js";
import constant from "../../../env";
import validateKycStep from "./kycvalidation.js";
import { CallApi } from "../../../api";

export default function StepperForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [kycType, setKycType] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [proofs, setProofs] = useState({ identity: "", address: "" });
  const [fileNames, setFileNames] = useState({});
  const [kycVerified, setKycVerified] = useState(false);
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [verifieddata, setVerifiedData] = useState([]);
  const [steponedata, setStepOneData] = useState([]);
  const [steptwodata, setStepTwoData] = useState([]);

  const step1Form = useForm();
  const step2Form = useForm();
  const step3Form = useForm();
  const step4Form = useForm();

  const inputClass = "border border-gray-400 rounded px-3 py-2 text-sm w-full";
  const steps = ["Step", "Step", "Step", ""];

  const back = () =>
    currentStep === 1
      ? router.push(constant.ROUTES.HEALTH.CHECKOUT)
      : setCurrentStep((prev) => prev - 1);

  const validateFormStepOne = async () => {
    const rawValues = step1Form.getValues();

    const result = await validateKycStep(
      step1Form,
      kycType,
      rawValues,
      proofs,
      setKycVerified,
      kycVerified,
      setIsPanVerified,
      setVerifiedData
    );
    if (!result) return false;

    const fieldsValid = await validateFields(step1Form);
    if (!fieldsValid) return false;

    const values = {
      ...rawValues,
      customerpancardDob: rawValues.panDob,
      sameAddress: sameAddress ? "1" : "0",
    };
    delete values.panDob;

    console.log(values);
    try {
      const res = await CallApi(constant.API.HEALTH.SAVESTEPONE, "POST", values);
      console.log(res);

      if (res === 1 || res?.status) {
        setStepOneData(res)
        return true;
      } else {
        console.error("API failed or returned unexpected value:", res);
        return false;
      }
    } catch (error) {
      console.error("API call error:", error);
      return false;
      // return true;
    }
  };

 const validateFormStepTwo = async () => {
  const fieldsValid = await validateFields(step2Form);
  if (!fieldsValid) return false;

  const rawValues = step2Form.getValues();

  const values = {
    ...rawValues,
  };

  console.log("Step 2 values", values);

  try {
    const res = await CallApi(constant.API.HEALTH.SAVESTEPTWO, "POST", values);
    console.log("Step 2 API Response", res);

    if (res === 1 || res?.status) {
      setStepTwoData(res); // Optional: agar step 2 ka data store karna ho
      return true;
    } else {
      console.error("Step 2 API failed or returned unexpected value:", res);
      return false;
    }
  } catch (error) {
    console.error("Step 2 API call error:", error);
    return false;
  }
};



  



    
  const validateFormStepThree = async () => await validateFields(step3Form);
  const validateFormStepFour = async () => true;

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const onSubmitStep = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await validateFormStepOne();
    else if (currentStep === 2) isValid = await validateFormStepTwo();
    else if (currentStep === 3) isValid = await validateFormStepThree();
    else if (currentStep === 4) isValid = await validateFormStepFour();

    if (!isValid) return;
    const formToUse =
      currentStep === 1
        ? step1Form
        : currentStep === 2
        ? step2Form
        : currentStep === 3
        ? step3Form
        : step4Form;

    console.log(`Step ${currentStep} Data:`, formToUse.getValues());
    goNext();
  };

  const handleVerifyPan = async () => {
    const values = step1Form.getValues();
    await validateKycStep(
      step1Form,
      "PAN Card",
      values,
      proofs,
      setKycVerified,
      kycVerified,
      setIsPanVerified,
      setVerifiedData
    );
  };

  const handleVerifyAadhar = async () => {
    const values = step1Form.getValues();
    await validateKycStep(
      step1Form,
      "Aadhar ( Last 4 Digits )",
      values,
      proofs,
      setKycVerified,
      kycVerified,
      undefined,
      setVerifiedData
    );
  };

  const handleVerifyOther = async () => {
    const values = step1Form.getValues();
    await validateKycStep(
      step1Form,
      "Others",
      values,
      proofs,
      setKycVerified,
      kycVerified,
      undefined,
      setVerifiedData
    );
  };

  return (
    <div className="min-h-screen bg-[#C8EDFE] p-4 sm:p-8">
      <button
        onClick={back}
        className="text-blue-700 flex items-center gap-2 mb-4 text-sm font-medium"
      >
        <FaChevronLeft /> Go back to Previous
      </button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[32px] shadow p-8 shadow">
          <div className="flex justify-between items-center">
            {steps.map((label, i) => {
              const sn = i + 1,
                active = sn === currentStep,
                done = sn < currentStep;
              return (
                <div
                  key={sn}
                  className={`flex items-center ${
                    sn !== steps.length ? "w-full" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full border flex justify-center items-center text-sm font-medium
                      ${
                        done || active
                          ? "thmbtn text-white border-white-600"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {done ? <FaCheck size={12} /> : sn}
                    </div>
                    {label && (
                      <span className="text-sm text-gray-700">{label}</span>
                    )}
                  </div>
                  {sn !== steps.length && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        done ? "thmbtn" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            {currentStep === 1 && (
              <StepOneForm
                step1Form={step1Form}
                kycType={kycType}
                setKycType={setKycType}
                handleVerifyPan={handleVerifyPan}
                handleVerifyAadhar={handleVerifyAadhar}
                handleVerifyOther={handleVerifyOther}
                loading={loading}
                sameAddress={sameAddress}
                setSameAddress={setSameAddress}
                fileNames={fileNames}
                setFileNames={setFileNames}
                proofs={proofs}
                setProofs={setProofs}
                inputClass={inputClass}
                onSubmitStep={onSubmitStep}
                kycVerified={kycVerified}
                setKycVerified={setKycVerified}
                isPanVerified={isPanVerified}
                verifieddata={verifieddata}
                
              />
            )}
            {currentStep === 2 && (
              <StepTwoForm
                step2Form={step2Form}
                steponedata={steponedata}
                inputClass={inputClass}
                onSubmitStep={onSubmitStep}
              />
            )}
            {currentStep === 3 && (
              <StepThreeForm
                step3Form={step3Form}
                onSubmitStep={onSubmitStep}
              />
            )}
            {currentStep === 4 && (
              <StepFourForm step4Form={step4Form} onSubmitStep={onSubmitStep} />
            )}
          </div>
        </div>

        <div className="w-full lg:w-[360px] sticky top-4 self-start bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Plan Summary
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>💠 Base Premium: ₹14,537</li>
            <li>💠 Add-Ons: ₹3,820</li>
            <li>💠 Total: ₹18,357</li>
            <li>💠 Cover: 10 Lac</li>
            <li>💠 Policy: 2 Years</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
