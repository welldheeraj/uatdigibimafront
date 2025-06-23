// ✅ File: components/proposal/StepOneForm.jsx
"use client";
import React from "react";
import { FiLoader } from "react-icons/fi";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function StepOneForm({
  step1Form,
  kycType,
  setKycType,
  handleVerifyPan,
  handleVerifyAadhar,
  handleVerifyOther,
  loading,
  sameAddress,
  setSameAddress,
  fileNames,
  setFileNames,
  proofs,
  setProofs,
  inputClass,
  onSubmitStep,
}) {
  const fields = {
    identity: ["AADHAR", "PAN", "PASSPORT", "VOTER ID", "DRIVING LICENSE"],
    address: ["UTILITY BILL", "BANK STATEMENT", "RENT AGREEMENT", "RATION CARD"],
  };

  const format = (type, val) => `${type}${val?.replace(/\s+/g, "").toLowerCase()}`;

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-bold text-[#2F4A7E] mb-1">
        Great! Let’s Start with proposer details
      </h2>
      <p className="text-gray-500">We’ll begin with some basic information.</p>

      <label className="block font-semibold cursor-pointer">Select Proposer</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <select
          {...step1Form.register("proposer", { required: "Please select a proposer" })}
          className={inputClass}
        >
          <option value="">Select</option>
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
            className={`relative flex items-center px-4 py-3 rounded-md border text-sm cursor-pointer w-full transition-all duration-200 ${kycType === type ? "border-gray-400 bg-white" : "border-gray-400 bg-white"}`}
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
            <button
              type="button"
              onClick={handleVerifyPan}
              className="px-4 py-2 thmbtn flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <><FiLoader className="animate-spin" /> Verifying...</> : "VERIFY"}
            </button>
          </div>
        </div>
      )}

      {kycType === "Aadhar ( Last 4 Digits )" && (
        <div className="space-y-2">
          <label className="block font-medium">Please Provide Aadhar Card Info</label>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
            <select {...step1Form.register("aadharGender")}
              className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-2">
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
              className="border border-gray-300 px-3 py-2 rounded text-sm sm:col-span-5"
            />
            <button
              type="button"
              onClick={handleVerifyAadhar}
              className="px-1 py-2 sm:col-span-2 thmbtn flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <><FiLoader className="animate-spin" /> Verifying...</> : "VERIFY"}
            </button>
          </div>
        </div>
      )}

      {kycType === "Others" && (
        <div className="space-y-2">
          <label className="block font-semibold cursor-pointer">Please Provide Other Card Info</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(fields).map(([type, options]) => (
              <div key={type}>
                <label className="block text-sm font-medium mb-1 uppercase text-gray-700">
                  {type} PROOF TYPE
                </label>
                <select
                  className={`w-full ${inputClass}`}
                  onChange={(e) => setProofs({ ...proofs, [type]: e.target.value })}
                  value={proofs[type] || ""}
                >
                  <option value="">Select Type</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {proofs[type] && (
                  <div className="relative mt-2">
                    <label
                      htmlFor={`${type}-${proofs[type]}`}
                      className="block w-full cursor-pointer border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-md text-center"
                    >
                      <UploadFileIcon className="text-indigo-500 mb-2 mr-1" fontSize="small" />
                      {fileNames[`${type}-${proofs[type]}`] || "Upload File"}
                    </label>
                    <input
                      id={`${type}-${proofs[type]}`}
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setFileNames({
                          ...fileNames,
                          [`${type}-${proofs[type]}`]: e.target.files?.[0]?.name || "",
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
            {loading ? <><FiLoader className="animate-spin" /> Verifying...</> : "VERIFY"}
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
        onClick={onSubmitStep}
        className="mt-4 px-6 py-2 thmbtn"
      >
        Continue
      </button>
    </form>
  );
}
