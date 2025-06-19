"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { showSuccess, showError } from "../../styles/js/toaster";
import { validateFields } from "../../styles/js/validation.js";
import constant from "../../env";

export default function StepperForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [kycType, setKycType] = useState("");
  const [sameAddress, setSameAddress] = useState(true);

  const step1Form = useForm();
  const step2Form = useForm();
  const step3Form = useForm();
  const step4Form = useForm();

  const inputClass = "border border-gray-400 rounded px-3 py-2 text-sm w-full";

  const [proofs, setProofs] = useState({ identity: "", address: "" });
  const [fileNames, setFileNames] = useState({});

  const fields = {
    identity: ["AADHAR", "PAN", "PASSPORT", "VOTER ID", "DRIVING LICENSE"],
    address: [
      "UTILITY BILL",
      "BANK STATEMENT",
      "RENT AGREEMENT",
      "RATION CARD",
    ],
  };

  const format = (type, val) =>
    `${type}${val?.replace(/\s+/g, "").toLowerCase()}`;

  // kyc verifiy call api start
  const verifyKyc = async (type, payload, apiUrl) => {
    if (Object.values(payload).some((val) => !val))
      return alert(`Please enter valid ${type} info`);

    setLoading(true);
    console.log(apiUrl, payload);
    try {
      // const res = await CallApi(apiUrl, "POST", payload);
      // alert(res.status === "success" ? `${type} Verified ` : `${type} Failed `);
    } catch {
      // alert(`Error verifying ${type}`);
    } finally {
      // setLoading(false);
    }
  };
  // kyc verifiy call api end

  // pan verifiy call api start
  const handleVerifyPan = () => {
    const { panNumber, dob } = step1Form.getValues();
    verifyKyc("PAN", { pan: panNumber, dob }, constant.API.HEALTH.kycdata);
  };
  // pan verifiy call api end
  // Aadhar verifiy call api start
  const handleVerifyAadhar = () => {
    const { aadharLast4, aadharName, aadharDob } = step1Form.getValues();
    const payload = {
      last4: aadharLast4,
      name: aadharName,
      dob: aadharDob,
    };
    verifyKyc("Aadhar", payload, constant.API.HEALTH.verifyAadhar);
  };
  // Aadhar verifiy call api end
  // Other verifiy call api start
  const handleVerifyOther = async () => {
    if (Object.values(proofs).some((v) => !v))
      return alert("Select all proof types");

    const formData = new FormData();
    Object.entries(proofs).forEach(([type, value]) => {
      formData.append(type, value);
      const file = document.getElementById(`${type}-${value}`)?.files?.[0];
      if (file) formData.append(`${type}_file`, file);
    });

    setLoading(true);
    console.log(formData);
    try {
      // const res = await CallApi(constant.API.HEALTH.verifyOther, "POST", formData, true);
      // alert(res.status === "success" ? "Verified " : "Failed ");
    } catch {
      // alert("Error verifying document");
    } finally {
      // setLoading(false);
    }
  };

  // Other verifiy call api end
  const steps = ["Step", "Step", "Step", ""];
  const back = () =>
    currentStep === 1
      ? router.push(constant.ROUTES.HEALTH.CHECKOUT)
      : setCurrentStep((prev) => prev - 1);
  const validateFormStepOne = async () => {
    // Example validation for step 1
    const isValid = await validateFields(step1Form, ["address2"]);
    return isValid;
  };

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

  const validateFormStepTwo = async () => {
    const isValid = await validateFields(step2Form, ["address2"]);
    return isValid;
  };

  const validateFormStepThree = async () => {
    return await validateFields(step3Form);
  };
  const validateFormStepFour = async () => {
    return true;
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
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-2xl font-bold text-[#2F4A7E] mb-1">
                  Great! Let’s Start with proposer details
                </h2>
                <p className="text-gray-500">
                  We’ll begin with some basic information.
                </p>
                <label className="block font-semibold cursor-pointer">
                  Select Proposer
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <select
                    {...step1Form.register("proposer", {
                      required: "Please select a proposer",
                    })}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option value="SELF">SELF</option>
                    <option value="SPOUSE">SPOUSE</option>
                    <option value="PARENT">PARENT</option>
                  </select>
                </div>

                <label className="block font-semibold cursor-pointer">
                  Proposer KYC
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {["PAN Card", "Aadhar ( Last 4 Digits )", "Others"].map(
                    (type) => (
                      <label
                        key={type}
                        className={`relative flex items-center px-4 py-3 rounded-md border text-sm cursor-pointer w-full transition-all duration-200
                            ${
                              kycType === type
                                ? "border-gray-400 bg-white"
                                : "border-gray-400 bg-white"
                            }`}
                      >
                        {kycType === type && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
                        )}
                        <input
                          {...step1Form.register("kycType")}
                          type="checkbox"
                          value={type}
                          checked={kycType === type}
                          onChange={() => setKycType(type)}
                          className="mr-2 accent-pink-500 h-4 w-4"
                        />
                        {type}
                      </label>
                    )
                  )}
                </div>

                {kycType === "PAN Card" && (
                  <div className="space-y-2">
                    <label className="block font-semibold cursor-pointer">
                      Please Provide PAN Card Info
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        {...step1Form.register("panNumber")}
                        placeholder="PAN No."
                        className={inputClass}
                      />
                      <input
                        type="date"
                        {...step1Form.register("dob")}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPan}
                        className="px-4 py-2 thmbtn flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FiLoader className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "VERIFY"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {kycType === "Aadhar ( Last 4 Digits )" && (
                  <div className="space-y-2">
                    <label className="block font-medium">
                      Please Provide Aadhar Card Info
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
                      <select
                        {...step1Form.register("aadharGender")}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-2"
                      >
                        <option value="">Mr/Ms</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>

                      <input
                        type="text"
                        {...step1Form.register("aadharLast4")}
                        placeholder="AADHAR NO. (LAST 4 DIGIT)"
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-5"
                      />

                      <input
                        type="text"
                        {...step1Form.register("aadharName")}
                        placeholder="FULL NAME AS PER AADHAR"
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-5"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <input
                        type="date"
                        {...step1Form.register("aadharDob")}
                        placeholder="D.O.B (DD-MM-YYYY)"
                        className="border border-gray-300 px-3 py-2 rounded text-sm sm:col-span-5"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyAadhar}
                        className="px-1 py-2 sm:col-span-2 thmbtn flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FiLoader className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "VERIFY"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {kycType === "Others" && (
                  <div className="space-y-2">
                    <label className="block font-semibold cursor-pointer">
                      Please Provide Other Card Info
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {Object.entries(fields).map(([type, options]) => (
                        <div key={type}>
                          <label className="block text-sm font-medium mb-1 uppercase text-gray-700">
                            {type} PROOF TYPE
                          </label>

                          <select
                            className={`w-full ${inputClass}`}
                            onChange={(e) =>
                              setProofs({ ...proofs, [type]: e.target.value })
                            }
                            value={proofs[type] || ""}
                          >
                            <option value="">Select Type</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          {proofs[type] && (
                            <div className="relative mt-2">
                              <label
                                htmlFor={`${type}-${proofs[type]}`}
                                className="block w-full cursor-pointer border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-md text-center"
                              >
                                <UploadFileIcon
                                  className="text-indigo-500 mb-2 mr-1"
                                  fontSize="small"
                                />
                                {fileNames[`${type}-${proofs[type]}`] ||
                                  "Upload File"}
                              </label>
                              <input
                                id={`${type}-${proofs[type]}`}
                                type="file"
                                name={format(type, proofs[type])}
                                className="hidden"
                                onChange={(e) =>
                                  setFileNames({
                                    ...fileNames,
                                    [`${type}-${proofs[type]}`]:
                                      e.target.files?.[0]?.name || "",
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOther}
                      className="px-4 py-2 thmbtn flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "VERIFY"
                      )}
                    </button>
                  </div>
                )}

                <label className="block font-semibold cursor-pointer">
                  Contact Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "address1",
                    "address2",
                    "landmark",
                    "city",
                    "state",
                    "pincode",
                  ].map((field) => (
                    <input
                      key={field}
                      {...step1Form.register(field)}
                      placeholder={field.replace(/^[a-z]/, (c) =>
                        c.toUpperCase()
                      )}
                      className={inputClass}
                    />
                  ))}
                </div>

                <label className="block font-semibold cursor-pointer">
                  Communication Address
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    className="ml-2 accent-pink-500 h-4 w-4"
                    onChange={(e) => {
                      const same = e.target.checked;
                      setSameAddress(same);
                      const get = step1Form.getValues;
                      const set = step1Form.setValue;
                      [
                        "Address1",
                        "Address2",
                        "Landmark",
                        "City",
                        "State",
                        "Pincode",
                      ].forEach((f) =>
                        set(`comm${f}`, same ? get(f.toLowerCase()) : "")
                      );
                    }}
                  />
                  <span className="ml-2">Same As Permanent Address</span>
                </label>

                {!sameAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {[
                      "commAddress1",
                      "commAddress2",
                      "commLandmark",
                      "commCity",
                      "commState",
                      "commPincode",
                    ].map((field) => (
                      <input
                        key={field}
                        {...step1Form.register(field)}
                        placeholder={field
                          .replace("comm", "")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                        className={inputClass}
                      />
                    ))}
                  </div>
                )}

                <label className="block font-semibold cursor-pointer">
                  Contact Details
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <input
                    {...step1Form.register("email")}
                    placeholder="Email Address"
                    className={inputClass}
                  />
                  <input
                    {...step1Form.register("mobile")}
                    placeholder="Mobile Number"
                    className={inputClass}
                  />
                  <input
                    {...step1Form.register("emergencyContact")}
                    placeholder="Emergency Mobile No."
                    className={inputClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={onSubmitStep} // Validate and go to the next step
                  className="mt-4 px-6 py-2 thmbtn"
                >
                  Continue
                </button>
              </form>
            )}

            {currentStep === 2 && (
              <form
                onSubmit={(e) => e.preventDefault()} // Add the onSubmit handler for validation and submission
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-800">Self:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    {...step2Form.register("name", {
                      required: "Name is required",
                    })}
                    placeholder="Name"
                    className={inputClass}
                  />
                  <input
                    {...step2Form.register("dob", {
                      required: "Date of Birth is required",
                    })}
                    type="date"
                    placeholder="D.O.B"
                    className={inputClass}
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
                    {...step2Form.register("weight", {
                      required: "Weight is required",
                    })}
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
                    {...step2Form.register("email", {
                      required: "Email is required",
                    })}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Nominee:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    {...step2Form.register("nomineeName", {
                      required: "Nominee Name is required",
                    })}
                    placeholder="Enter Nominee Full Name"
                    className={inputClass}
                  />

                  <input
                    {...step2Form.register("nomineeDob", {
                      required: "Nominee Date of Birth is required",
                    })}
                    type="date"
                    className={inputClass}
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
                  onClick={onSubmitStep} // Validate and go to the next step
                  className="mt-4 px-6 py-2 thmbtn"
                >
                  Continue
                </button>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Help us know the medical condition, if any
                </h2>

                {/* Medical History */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Medical History:
                  </h3>

                  <div className="flex items-center justify-between">
                    <label className="text-sm">
                      1. Has any person been diagnosed/treated for any
                      condition?
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...step3Form.register("hasMedicalCondition")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <label className="text-sm">
                      2. Details of previous or existing health insurance?
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...step3Form.register("hasPreviousInsurance")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
                    </label>
                  </div>
                </div>

                {/* Lifestyle History */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Lifestyle History:
                  </h3>

                  <div className="flex items-center justify-between">
                    <label className="text-sm">
                      1. Personal habit of smoking/alcohol/gutkha/tobacco/paan?
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...step3Form.register("hasLifestyleHabits")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300"></div>
                    </label>
                  </div>
                </div>

                {/* Agreement Checkboxes */}
                <div className="space-y-2 text-sm text-gray-700">
                  <label className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      {...step3Form.register("agreeTnC", { required: true })}
                    />
                    <span>
                      I hereby agree to the{" "}
                      <a className="text-blue-600 underline">
                        Terms & Conditions
                      </a>{" "}
                      of the purchase of this policy. *
                    </span>
                  </label>

                  <label className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      {...step3Form.register("standingInstruction")}
                    />
                    <span>
                      I would also like to add Standing Instruction on my credit
                      card for automatic future renewal premiums.
                    </span>
                  </label>

                  <label className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      {...step3Form.register("optForEMI")}
                    />
                    <span>
                      I would like to opt for the EMI (Equated Monthly
                      Installment) option for payment of premiums.
                    </span>
                  </label>

                  <label className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      {...step3Form.register("autoDebitBank")}
                    />
                    <span>
                      I authorize the auto-debit of premiums from my bank
                      account for automatic payment.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={onSubmitStep}
                  className="mt-4 px-6 py-2 thmbtn"
                >
                  Continue
                </button>
              </form>
            )}
            {currentStep === 4 && (
              <form className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Help us know the medical condition, if any
                </h2>
              </form>
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
