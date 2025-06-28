"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import StepOneForm from "./stepone.js";
import StepTwoForm from "./steptwo.js";
import StepThreeForm from "./stepthree.js";
import StepFourForm from "./stepfour.js";
import { showSuccess, showError } from "@/layouts/toaster";
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
  const [stepthreedata, setStepThreeData] = useState([]);

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
      // customerpancardDob: rawValues.panDob,
      customerpancardDob: rawValues.customerpancardDob,
      sameAddress: sameAddress ? "1" : "0",
    };
    delete values.panDob;

    console.log(values);
    console.log("pandob", values.customerpancardDob);
    try {
      const res = await CallApi(
        constant.API.HEALTH.SAVESTEPONE,
        "POST",
        values
      );
      console.log(res);

      if (res === 1 || res?.status) {
        setStepOneData(res);
        return true;
      } else {
        console.error("API failed or returned unexpected value:", res);
        showError(res.error);
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
    console.log("Nominee DOB: ", values.nomineedob);

    try {
      const res = await CallApi(
        constant.API.HEALTH.SAVESTEPTWO,
        "POST",
        values
      );
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

  const validateFormStepThree = async (step3Form, steptwodata) => {
    const isValid = await step3Form.trigger();
    if (!isValid) return false;

    const data = step3Form.getValues();
    const members = steptwodata?.member || [];

    let hasError = false;
    let firstInvalidInput = null;
    let dobErrorShown = false;

    const sectionMap = {
      1: [
        "cancer",
        "heart",
        "hypertension",
        "breathing",
        "endocrine",
        "diabetes",
        "muscles",
        "liver",
        "kidney",
        "auto",
        "congenital",
        "hivaids",
        "any",
        "has",
        "hasany",
      ],
      2: ["insurer", "premium", "insurance", "diagnosed"],
      3: ["cigarettes"],
    };

    Object.values(sectionMap)
      .flat()
      .forEach((key) => {
        members.forEach((m, index) => {
          const checkKey = `${key}main${index + 1}`;
          const dateKey = `${checkKey}date`;

          const isChecked = data[checkKey];
          const dateValue = data[dateKey];
          const input = document.querySelector(`input[name="${dateKey}"]`);
          const trimmed = dateValue?.trim() || "";

          if (isChecked) {
            if (!trimmed) {
              if (input) {
                input.classList.add("border-red-500");
                if (!firstInvalidInput) firstInvalidInput = input;
              }
              hasError = true;
              return;
            }

            const [mm, yyyy] = trimmed.split("/");
            const month = parseInt(mm, 10);
            const year = parseInt(yyyy, 10);

            if (!month || month < 1 || month > 12) {
              if (input) {
                input.classList.add("border-red-500");
                if (!firstInvalidInput) firstInvalidInput = input;
              }
              hasError = true;
              return;
            }

            const inputDOB = input?.getAttribute("data-dob");
            if (inputDOB) {
              const [day, dobMM, dobYYYY] = inputDOB.split("-");
              const dobDate = new Date(
                Number(dobYYYY),
                Number(dobMM) - 1,
                Number(day)
              );
              const inputDate = new Date(year, month - 1);

              const dobMonth = dobDate.getMonth();
              const dobYear = dobDate.getFullYear();
              const inputMonth = inputDate.getMonth();
              const inputYear = inputDate.getFullYear();

              const today = new Date();
              const currentMonth = today.getMonth();
              const currentYear = today.getFullYear();

              const isBeforeDOB =
                inputYear < dobYear ||
                (inputYear === dobYear && inputMonth < dobMonth);

              const isInFuture =
                inputYear > currentYear ||
                (inputYear === currentYear && inputMonth > currentMonth);

              if (isBeforeDOB || isInFuture) {
                input.classList.add("border-red-500");
                if (!firstInvalidInput) firstInvalidInput = input;
                hasError = true;

                if (!dobErrorShown) {
                  showError(
                    isBeforeDOB
                      ? "Date cannot be before member's Date of Birth (MM/YYYY)."
                      : "Date cannot be in the future (MM/YYYY)."
                  );
                  dobErrorShown = true;
                }
                return;
              }
            }

            input?.classList.remove("border-red-500");
          } else {
            input?.classList.remove("border-red-500");
          }
        });
      });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        firstInvalidInput.focus();
      }
      showError(
        "Please fill valid MM/YYYY (month ≤ 12, not before DOB or future) for all selected members."
      );
      return false;
    }

    const getExtraFields = (keyPrefix) => ({
      des: data[`${keyPrefix}desc`] || "",
      quantity: data[`${keyPrefix}qty`] || 0,
    });

    const result = [];

    members.forEach((m, index) => {
      const memberData = {
        id: m.id,
        age: m.age,
        dob: m.dob,
        data: [],
      };

      Object.entries(sectionMap).forEach(([section, keys]) => {
        keys.forEach((key, keyIndex) => {
          const checkKey = `${key}main${index + 1}`;
          const dateKey = `${checkKey}date`;

          if (data[checkKey] && data[dateKey]) {
            const extra = getExtraFields(checkKey);

            memberData.data.push({
              did: `${section}.${keyIndex + 1}`,
              date: data[dateKey],
              des: extra.des,
              quantity: section === "3" ? extra.quantity : 0,
            });
          }
        });
      });

      if (memberData.data.length > 0) {
        result.push(memberData);
      }
    });

    console.log(result);

    try {
      const res = await CallApi(
        constant.API.HEALTH.SAVESTEPTHREE,
        "POST",
        result
      );
      console.log("Step 3 API Response", res);

      if (res === 1 || res?.status) {
        setStepThreeData(res);
        return true;
      } else {
        console.error("Step 3 API failed or returned unexpected value:", res);
        return false;
      }
    } catch (error) {
      console.error("Step 3 API call error:", error);
      return false;
    }
    return result;
  };

  const GoToPayment = async () => {
    setLoading(true);
    try {
      console.log("ram");
      const res = await CallApi(constant.API.HEALTH.CREATEPOLICY, "POST");
      console.log("create policy API Response", res);

      if (res === 1 || res?.status) {
        const response = await CallApi(constant.API.HEALTH.GETPROPOSAL, "POST");
        console.log("payment", response);

        if (response.proposalNumber) {
          console.log("navigating...");
          router.push(
            `/health/payment?proposalNumber=${response.proposalNumber}`
          );
        } else {
          console.error("Missing proposalNumber");
        }
      } else {
        console.error("Create policy failed", res);
      }
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const onSubmitStep = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await validateFormStepOne();
    else if (currentStep === 2) isValid = await validateFormStepTwo();
    else if (currentStep === 3)
      isValid = await validateFormStepThree(step3Form, steptwodata);
    else if (currentStep === 4) isValid = await GoToPayment();

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
                steptwodata={steptwodata}
                inputClass={inputClass}
                onSubmitStep={onSubmitStep}
              />
            )}
            {currentStep === 4 && (
              <StepFourForm
                step4Form={step4Form}
                stepthreedata={stepthreedata}
                onSubmitStep={onSubmitStep}
              />
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
