"use client";

import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import StepOneForm from "./stepone.js";
import StepTwoForm from "./steptwo.js";
import StepThreeForm from "./stepthree.js";
import StepFourForm from "./stepfour.js";
// import SummaryCard from "../checkout/rightsection.js";
  import CarDetailsCard from '../../../plans/cardetailscard'
import { showSuccess, showError } from "@/layouts/toaster";
import { validateFields } from "@/styles/js/validation.js";
import { validateStepTwoData } from "./validatesteptwoagedata.js";
import constant from "@/env.js";
import validateKycStep from "./kycvalidation.js";
import { CallApi } from "@/api";
// import HealthInsuranceLoader from "../../../loader";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function StepperForm({ usersData, kycData }) {
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
   const [totalPremium, setTotalPremium] = useState("");
  const searchParams = useSearchParams();
  // console.log("User Data:", kycData);
  const summaryData = useMemo(() => {
    const getParsed = (key) => {
      try {
        return JSON.parse(searchParams.get(key) || "[]");
      } catch {
        return [];
      }
    };
    // console.log("hello World", searchParams);
    return {
      tenure: searchParams.get("tenure") || "",
      coverAmount: searchParams.get("coverAmount") || "",
      totalPremium: searchParams.get("totalPremium") || "",
      selectedAddons: getParsed("selectedAddons"),
      compulsoryAddons: getParsed("compulsoryAddons"),
      tenurePrices: getParsed("tenurePrices"),
      addons: getParsed("addons"),
      fullAddonsName: getParsed("fullAddonsName"),
    };
  }, [searchParams]);
    useEffect(() => {
    if (summaryData?.totalPremium) {
      setTotalPremium(summaryData.totalPremium);
    }
  }, [summaryData]);
  
  useEffect(() => {
  const stepFromQuery = parseInt(searchParams.get("step"));
  if (stepFromQuery >= 1 && stepFromQuery <= 4) {
    setCurrentStep(stepFromQuery);
  }
}, [searchParams]);

  const step1Form = useForm();
  const step2Form = useForm();
  const step3Form = useForm();
  const step4Form = useForm();

  const inputClass = "border border-gray-400 rounded px-3 py-2 text-sm w-full";
  const steps = ["Step", "Step", "Step", ""];

  const back = async () => {
    if (currentStep === 1) {
      router.push(constant.ROUTES.HEALTH.CARESUPEREME.CHECKOUT);
    } else {
      setLoading(true);
      setCurrentStep((prev) => prev - 1);
      setLoading(false);
    }
  };

  const validateFormStepOne = async () => {
    const rawValues = step1Form.getValues();

    // const result = await validateKycStep(
    //   step1Form,
    //   kycType,
    //   rawValues,
    //   proofs,
    //   setKycVerified,
    //   kycVerified,
    //   setIsPanVerified,
    //   setVerifiedData
    // );
    // if (!result) return false;
      if (!kycVerified) {
    showError("Please complete KYC verification before proceeding.");
    return false;
  }

    const fieldsValid = await validateFields(step1Form);
    if (!fieldsValid) return false;

    const values = {
      ...rawValues,
      customerpancardDob: rawValues.customerpancardDob,
      sameAddress: sameAddress ? "1" : "0",
    };
    delete values.panDob;

    console.log(values);
    console.log("pandob", values.customerpancardDob);
    try {
      setLoading(true);
      
      const res = await CallApi(
       constant.API.MOTOR.CAR.SHRIRAM.SAVESTEPONE,
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
    } finally {
      setLoading(false);
    }
  };

  const validateFormStepTwo = async () => {
    const fieldsValid = await validateFields(step2Form);
    if (!fieldsValid) return false;

    const rawValues = step2Form.getValues();

    const values = step2Form.getValues();
    // const validAge = validateStepTwoData(values, steponedata);
    // if (!validAge) return false;

    try {
      setLoading(true);
  
      const res = await CallApi(
        constant.API.MOTOR.CAR.SHRIRAM.SAVESTEPONE,
        "POST",
        values
      );
      if (res === 1 || res?.status) {
        setStepTwoData(res);
        return true;
      } else {
        console.error("Step 2 API failed or returned unexpected value:", res);
        return false;
      }
    } catch (error) {
      console.error("Step 2 API call error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateFormStepThree = async (step3Form, steptwodata) => {
    const fieldsValid = await validateFields(step3Form);
    if (!fieldsValid) return false;

    const data = step3Form.getValues();


    try {
      const res = await CallApi(
        constant.API.MOTOR.CAR.SHRIRAM.SAVESTEPONE,
        "POST",
        data
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
    // console.log("Ram")
    setLoading(true);
    try {
      const res = await CallApi(constant.API.HEALTH.CARESUPEREME.CREATEPOLICY, "POST");
      if (res === 1 || res?.status) {
        const response = await CallApi(constant.API.HEALTH.CARESUPEREME.GETPROPOSAL, "POST");
        if (response.proposalNumber) {
          router.push(
            `/health/payment?proposalNumber=${response.proposalNumber}`
          );
        }
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
    setLoading(true);
    if (currentStep === 1) isValid = await validateFormStepOne();
    else if (currentStep === 2) isValid = await validateFormStepTwo();
    else if (currentStep === 3)
      isValid = await validateFormStepThree(step3Form, steptwodata);
    else if (currentStep === 4) isValid = await GoToPayment();

    if (!isValid) {
      setLoading(false);
      return;
    }
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
    setLoading(false);
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

  const identityType = proofs.identity;
  const addressType = proofs.address;

  const identityInput = document.getElementById(`identity-${identityType}`);
  const addressInput = document.getElementById(`address-${addressType}`);
  const photoInput = document.getElementById("media-upload");

  const identityFile = identityInput?.files?.[0];
  const addressFile = addressInput?.files?.[0];
  const insurePhoto = photoInput?.files?.[0];

  const kycData = {
    identity: identityType,
    address: addressType,
    identityValue: proofs.identityValue,
    addressValue: proofs.addressValue,
    fatherName: proofs.fatherName,
    identityFile,
    addressFile,
    insurePhoto,
  };


  await validateKycStep(
    step1Form,
    "Others",
    values,
    kycData,
    setKycVerified,
    kycVerified,
    undefined,
    setVerifiedData
  );
};





//   const handleVerifyOther = async (data) => {
//   console.log("Ram Pass");
//   console.log("Final Data:", data);
// };


  return (
  <>
    {/* {loading ? (
      <HealthInsuranceLoader />
    ) : ( */}
      <div className="min-h-screen bg-[#C8EDFE] p-4 sm:p-8">
        <button
          onClick={back}
          className="text-blue-700 flex items-center gap-2 mb-4 text-sm font-medium"
        >
          <FaChevronLeft /> Go back to Previous
        </button>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-[32px] shadow p-8">
            {/* Stepper */}
            <div className="flex justify-between items-center">
              {steps.map((label, i) => {
                const sn = i + 1;
                const active = sn === currentStep;
                const done = sn < currentStep;

                return (
                  <div
                    key={sn}
                    className={`flex items-center ${sn !== steps.length ? "w-full" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full border flex justify-center items-center text-sm font-medium ${
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
                        className={`flex-1 h-0.5 mx-2 ${done ? "thmbtn" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
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
                  setIsPanVerified={setIsPanVerified}
                  isPanVerified={isPanVerified}
                  verifieddata={verifieddata}
                  usersData={usersData}
                  kycData={kycData}
                />
              )}
              {currentStep === 2 && (
                <StepTwoForm
                  step2Form={step2Form}
                  steponedata={steponedata}
                  inputClass={inputClass}
                  onSubmitStep={onSubmitStep}
                  usersData={usersData}
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
                  currentStep={currentStep}
                  totalPremium={totalPremium}
                  onGoToPayment={GoToPayment}
                  
                />
              )}
            </div>
          </div>

          {/* Summary Card */}
          {/* <SummaryCard
            tenure={summaryData.tenure}
            coverAmount={summaryData.coverAmount}
            totalPremium={summaryData.totalPremium}
            selectedAddons={summaryData.selectedAddons}
            compulsoryAddons={summaryData.compulsoryAddons}
            tenurePrices={summaryData.tenurePrices}
            addons={summaryData.addons}
            fullAddonsName={summaryData.fullAddonsName}
            currentStep={currentStep}
            onGoToPayment={GoToPayment}
          /> */}
          <CarDetailsCard />
        </div>
      </div>
    {/* )} */}
  </>
);

}
