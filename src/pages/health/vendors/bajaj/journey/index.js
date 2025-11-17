"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import StepOneForm from "./stepone.js";
import StepTwoForm from "./steptwo.js";
import StepThreeForm from "./stepthree.js";
import StepFourForm from "./stepfour.js";
import SummaryCard from "../checkout/rightsection.js";
import { showSuccess, showError } from "@/layouts/toaster";
import { validateFields } from "@/styles/js/validation.js";
import validateStepTwoData from "./validatesteptwoagedata.js";
import constant from "@/env.js";
import validateKycStep from "./kycvalidation.js";
import { CallApi,getDBData } from "@/api";
import { HealthLoaderOne } from "@/components/loader";
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
  const [verifiedData, setVerifiedData] = useState([]);
  const [steponedata, setStepOneData] = useState([]);
  const [steptwodata, setStepTwoData] = useState([]);
  const [stepthreedata, setStepThreeData] = useState([]);
  const [totalPremium, setTotalPremium] = useState("");
  const [isCKYCHidden, setIsCKYCHidden] = useState(false);
  const [isOtherKycHidden, setIsOtherKycHidden] = useState(false);
      const [tenureTxn, setTenureTxn] = useState(null);
       const [finalTxn, setFinalTxn] = useState(null);
  const [quoteData, setQuoteData] = useState({
    totalpremium: "",
    basepremium: "",
    coverage: "",
  });
  const [oldPincode, setOldPincode] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const searchParams = useSearchParams();
  const summaryData = useMemo(() => {
    const getParsed = (key) => {
      try {
        return JSON.parse(searchParams.get(key) || "[]");
      } catch {
        return [];
      }
    };
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
  const steps = ["", "", "", ""];
  // const steps = ["Step", "Step", "Step", ""];

  const back = async () => {
    if (currentStep === 1) {
      router.push(constant.ROUTES.HEALTH.BAJAJ.CHECKOUT);
    } else {
      setLoading(true);
      setCurrentStep((prev) => prev - 1);
      setLoading(false);
    }
  };

  const validateFormStepOne = async () => {
    step1Form.unregister("kycType");
    const rawValues = step1Form.getValues();
    console.log(rawValues)

    // if (!kycVerified) {
    //   showError("Please complete KYC verification before proceeding.");
    //   return false;
    // }

    const fieldsValid = await validateFields(step1Form);
    if (!fieldsValid) return false;

    const values = {
      ...rawValues,
      customerpancardDob: rawValues.customerpancardDob,
      sameAddress: sameAddress ? "1" : "0",
    };
    delete values.panDob;
    try {
      setLoading(true);
      const res = await CallApi(
        constant.API.HEALTH.BAJAJ.SAVESTEPONE,
        "POST",
        values
      );
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
    const values = step2Form.getValues();
    const fieldsValid = await validateFields(step2Form);
    if (!fieldsValid) return false;
    const rawValues = step2Form.getValues();
    const nomineeDob = values.nomineedob;
    const validAge = validateStepTwoData(values, steponedata);
    if (!validAge) return false;
    try {
      setLoading(true);
      const res = await CallApi(
        constant.API.HEALTH.BAJAJ.SAVESTEPTWO,
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
    const data = step3Form.getValues();
    const members = steptwodata?.member || [];
    const agreeTnC = data.agreeTnC;
    console.log("hello");


    if (!agreeTnC) {
      step3Form.setFocus("agreeTnC");
      showError(
        "Please agree to Terms & Conditions and Standing Instruction to continue."
      );
      return false;
    }

    const transformed = members.map((m) => {
      const memberData = {};

      const processQuestions = (questions) => {
        Object.values(questions).forEach((q) => {
          const toggle = data[q.name]?.toggle;
          const selectedMembers = data[q.name]?.members || [];

          if (toggle && selectedMembers.includes(m.id)) {
            memberData[q.name] = "Y"; 
          }
        });
      };

      processQuestions(constant.BAJAJQUESTION.HEALTH);
      processQuestions(constant.BAJAJQUESTION.LIFESTYLE);

      return {
        id: m.id,
        name: m.name,
        data: memberData,
      };
    });

    console.log("Payload:", transformed);
    // return false;
    try {
      const res = await CallApi(
        constant.API.HEALTH.BAJAJ.SAVESTEPTHREE,
        "POST",
        transformed
      );
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
  };

  const GoToPayment = async () => {
    setLoading(true);
    try {
      const res = await CallApi(constant.API.HEALTH.BAJAJ.CREATEPOLICY, "POST");
      console.log("API Response:", res);

      const status = res?.status;

      if (status === "1" || status === 1 || status === true) {
        const paymentLink = res?.data?.paymentlink;

        if (paymentLink) {
          router.push(
            `/health/vendors/bajaj/payment?paymentLink=${paymentLink}`
          );
        } else {
          const backendMsg =
            res?.data?.msg || "Payment link not received from server.";
          showError(backendMsg);
        }
      } else {
        const fallbackMsg = "Something went wrong while creating policy.";
        const backendMsg =
          res?.error?.[0]?.errDescription || res?.message || fallbackMsg;
        showError(backendMsg);
      }
    } catch (error) {
      console.error("API Error", error);
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const onSubmitStep = async () => {
    let isValid = false;
    // setLoading(true);
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
    goNext();
  };

  const handleVerifyIdentity = async () => {
    const values = step1Form.getValues();

    console.log(values);
    // return false;
    await validateKycStep(
      step1Form,
      "CKYC",
      values,
      proofs,
      setKycVerified,
      kycVerified,
      setVerifiedData,
      setIsCKYCHidden,
      setIsOtherKycHidden,
      finalTxn
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
      setVerifiedData,
      setIsCKYCHidden,
      setIsOtherKycHidden
    );
  };
  useEffect(() => {
    if (quoteData.totalpremium) {
    }
  }, [quoteData]);


  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const data = await getDBData(constant.DBSTORE.HEALTH.BAJAJ.TENURETXN);
        if (data) {
          console.log("Retrieved from DB:", data);
          setTenureTxn(data);
        } else {
          console.log("No data found for tenureTxn");
        }
      } catch (err) {
        console.error("Error retrieving data:", err);
      }
    };

    fetchFromDB();
  }, []);

  useEffect(() => {
    if (!tenureTxn || !summaryData?.tenure) return;

    const selectedTenure = String(summaryData.tenure); 
    const txnObj = tenureTxn[selectedTenure]; 

    if (txnObj) {
      console.log("Found matching txn:", txnObj);
      setFinalTxn(txnObj);
    } else {
      console.warn("No matching txn found for tenure:", selectedTenure);
    }
  }, [tenureTxn, summaryData]);

  return (
    <>
      {loading ? (
        <HealthLoaderOne />
      ) : (
        <div className="min-h-screen bgcolor p-4 sm:p-8">
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
                      className={`flex items-center ${
                        sn !== steps.length ? "w-full" : ""
                      }`}
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
                          className={`flex-1 h-0.5 mx-2 ${
                            done ? "thmbtn" : "bg-gray-200"
                          }`}
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
                    finalTxn={finalTxn}
                    setKycType={setKycType}
                    handleVerifyIdentity={handleVerifyIdentity}
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
                    verifiedData={verifiedData}
                    usersData={usersData}
                    kycData={kycData}
                    isCKYCHidden={isCKYCHidden}
                    setIsCKYCHidden={setIsCKYCHidden}
                    isOtherKycHidden={isOtherKycHidden}
                    setIsOtherKycHidden={setIsOtherKycHidden}
                    setQuoteData={setQuoteData}
                    setNewPincode={setNewPincode}
                    setOldPincode={setOldPincode}
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
                    totalPremium={
                      quoteData.totalpremium || summaryData.totalPremium
                    }
                    basePremium={
                      quoteData.basepremium || summaryData.basepremium
                    }
                    coverage={quoteData.coverage || summaryData.coverage}
                    onGoToPayment={GoToPayment}
                  />
                )}
              </div>
            </div>

            {/* Summary Card */}
            <SummaryCard
              tenure={summaryData.tenure}
              coverAmount={summaryData.coverAmount}
              totalPremium={quoteData.totalpremium || summaryData.totalPremium}
              basePremium={quoteData.basepremium || summaryData.basepremium}
              coverage={quoteData.coverage || summaryData.coverage}
              selectedAddons={summaryData.selectedAddons}
              compulsoryAddons={summaryData.compulsoryAddons}
              tenurePrices={summaryData.tenurePrices}
              addons={summaryData.addons}
              fullAddonsName={summaryData.fullAddonsName}
              currentStep={currentStep}
              onGoToPayment={GoToPayment}
              newPincode={newPincode}
              oldPincode={oldPincode}
            />
          </div>
        </div>
      )}
    </>
  );
}
