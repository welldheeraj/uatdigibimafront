"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaCheck } from "react-icons/fa";
import constant from "../../env";

const steps = ["Step", "Step", "Step", ""];

export default function StepperForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [kycType, setKycType] = useState("");
  const [sameAddress, setSameAddress] = useState(true);

  const step1Form = useForm();
  const step2Form = useForm();
  const step3Form = useForm();

  const inputClass = "border border-gray-400 rounded px-3 py-2 text-sm";

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));

  const onSubmit = async (data) => {
    console.log(`Step ${currentStep} Data:`, data);
    goNext();
  };

  const back = () => currentStep === 1 ? router.push(constant.ROUTES.HEALTH.CHECKOUT) : setCurrentStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-[#C8EDFE] p-4 sm:p-8">
      <button onClick={back} className="text-blue-700 flex items-center gap-2 mb-4 text-sm font-medium">
        <FaChevronLeft /> Go back to Previous
      </button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[32px] shadow p-8 shadow">
          <div className="flex justify-between items-center">
            {steps.map((label, i) => {
              const sn = i + 1, active = sn === currentStep, done = sn < currentStep;
              return (
                <div key={sn} className={`flex items-center ${sn !== steps.length ? "w-full" : ""}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border flex justify-center items-center text-sm font-medium
                      ${done || active ? "thmbtn text-white border-white-600" : "bg-white text-gray-700 border-gray-300"}`}>
                      {done ? <FaCheck size={12} /> : sn}
                    </div>
                    {label && <span className="text-sm text-gray-700">{label}</span>}
                  </div>
                  {sn !== steps.length && <div className={`flex-1 h-0.5 mx-2 ${done ? "thmbtn" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            {currentStep === 1 && (
              <form onSubmit={step1Form.handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-2xl font-bold text-[#2F4A7E] mb-1">Great! Let’s Start with proposer details</h2>
                <p className="text-gray-500">We’ll begin with some basic information.</p>
                 <label className="block font-semibold cursor-pointer">Select Proposer</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                     <select {...step1Form.register("proposer")} className={inputClass}>
                  <option value="SELF">SELF</option>
                  <option value="SPOUSE">SPOUSE</option>
                  <option value="PARENT">PARENT</option>
                </select>
                  </div>
               
                 <label className="block font-semibold cursor-pointer">Proposer KYC</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    {["PAN Card", "Aadhar ( Last 4 Digits )", "Others"].map((type) => (
                        <label
                        key={type}
                        className={`relative flex items-center px-4 py-3 rounded-md border text-sm cursor-pointer w-full transition-all duration-200
                            ${kycType === type ? "border-gray-400 bg-white" : "border-gray-400 bg-white"}`}
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
                    ))}
                    </div>


                  {kycType === "PAN Card" && (
                        <div className="space-y-2">
                            <label className="block font-semibold cursor-pointer">Please Provide PAN Card Info</label>
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
                            <button type="button" className="px-4 py-2 thmbtn">VERIFY</button>
                            </div>
                        </div>
                        )}

                    {kycType === "Aadhar ( Last 4 Digits )" && (
                      <div className="space-y-2">
                        <label className="block font-medium">Please Provide Aadhar Card Info</label>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <select {...step1Form.register("aadhaarTitle")} className={inputClass} >
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                          </select>
                          <input
                            {...step1Form.register("aadhaarNumber")}
                            placeholder="AADHAR NO. (LAST 4 DIGIT)"
                            className={inputClass}
                            maxLength={4}
                          />
                          <input
                            {...step1Form.register("aadhaarName")}
                            placeholder="FULL NAME AS PER AADHAR"
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center mt-2">
                          <input
                            type="date"
                            {...step1Form.register("aadhaarDob")}
                            placeholder="D.O.B (DD-MM-YYYY)"
                            className={inputClass + " col-span-3 lg:col-span-3"}
                          />
                          <button type="button" className="w-full lg:w-auto px-4 py-2 thmbtn">VERIFY</button>
                        </div>
                      </div>
                    )}




                {kycType === "Others" && (

               <div className="space-y-2">
                        <label className="block font-semibold cursor-pointer">Please Provide Other Card Info</label>
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
                        <button type="button" className="px-4 py-2 thmbtn">VERIFY</button>
                        </div>
                    </div>

                )}

                  <label className="block font-semibold cursor-pointer">Contact Details</label> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["address1", "address2", "landmark", "city", "state", "pincode"].map((field) => (
                    <input key={field} {...step1Form.register(field)} placeholder={field.replace(/^[a-z]/, c => c.toUpperCase())} className={inputClass} />
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
                      ["Address1", "Address2", "Landmark", "City", "State", "Pincode"].forEach(f =>
                        set(`comm${f}`, same ? get(f.toLowerCase()) : "")
                      );
                    }}
                  />
                  <span className="ml-2">Same As Permanent Address</span>
                </label>

                {!sameAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {["commAddress1", "commAddress2", "commLandmark", "commCity", "commState", "commPincode"].map((field) => (
                      <input key={field} {...step1Form.register(field)} placeholder={field.replace("comm", "").replace(/([A-Z])/g, " $1").trim()} className={inputClass} />
                    ))}
                  </div>
                )}

                <label className="block font-semibold cursor-pointer">Contact Details</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <input {...step1Form.register("email")} placeholder="Email Address" className={inputClass} />
                  <input {...step1Form.register("mobile")} placeholder="Mobile Number" className={inputClass} />
                   <input {...step1Form.register("emergencyContact")} placeholder="Emergency Mobile No." className={inputClass} />
                </div>
               

                <button type="submit" className="mt-4 px-6 py-2 thmbtn">Continue</button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={step2Form.handleSubmit(onSubmit)} className="space-y-4">
                <input {...step2Form.register("email", { required: true })} placeholder="Enter your email" className={inputClass} />
                <button type="submit" className="mt-4 px-6 py-2 thmbtn">Continue</button>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={step3Form.handleSubmit(onSubmit)} className="space-y-4">
                <input {...step3Form.register("phone", { required: true })} placeholder="Enter your phone" className={inputClass} />
                <button type="submit" className="mt-4 px-6 py-2 thmbtn">Continue</button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[360px] sticky top-4 self-start bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Plan Summary</h3>
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