"use client";
import React, { useState, useEffect } from "react";
import { isAlpha, isNumber } from "@/styles/js/validation";
import { FiLoader } from "react-icons/fi";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UniversalDatePicker from "../../../../datepicker/index";
import { CallApi } from "@/api";
import constant from "@/env";
import { format } from "date-fns";


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
  kycVerified,
  setKycVerified,
  setIsPanVerified, 
  onSubmitStep,
  isPanVerified,
  verifieddata,
  setStepOneData,
  usersData,
  kycData,
}) {
  
  const isPanKyc = kycData?.kyctype?.toLowerCase() === "p";
  const isOtherKyc = kycData?.kyctype?.toLowerCase() === "o";
  
  const isPanKycHidden = kycVerified && isPanKyc;
  const isOtherKycHidden = kycVerified && isOtherKyc;
  console.log(isOtherKycHidden)

  const [dates, setDates] = useState({
    customerpancardno: "",
    aadhar: "",
    proposal: "",
  });

  const handleDateChange = (key, field) => (date) => {
    const formatted = format(date, "dd-MM-yyyy");
    setDates((prev) => ({ ...prev, [key]: date }));
    step1Form.setValue(field, formatted, { shouldValidate: true });
  };

  useEffect(() => {
    if (!usersData) return;

    const typeMap = {
      p: "PAN Card",
      a: "Aadhar ( Last 4 Digits )",
      o: "Others",
    };
    // console.log(usersData)
    const formatted = typeMap[kycData?.kyctype?.toLowerCase()];
    if (formatted) {
      setKycType(formatted);
      step1Form.setValue("kycType", formatted, { shouldValidate: true });

      setKycVerified(true);
    }

    const set = step1Form.setValue;

    const directFields = {
      proposername: "kyc_name",
      mr_ms_gender: "mr_mrs",
      contactemail: "email",
      contactmobile: "mobile",
      contactemergency: "emergency_mobile",
      house: "house",
      colony: "colony",
      Landmark: "landmark",
      City: "city",
      State: "state",
      Pincode: "pincode",
    };

    Object.entries(directFields).forEach(([formKey, userKey]) => {
      if (usersData[userKey]) {
        set(formKey, usersData[userKey], { shouldValidate: true });
      }
    });

    if (usersData.panid) {
      set("customerpancardno", usersData.panid, { shouldValidate: true });

      // // PAN is available — mark as verified
      // setIsPanVerified(true);
    }

    if (usersData.dob) {
      const [dd, mm, yyyy] = usersData.dob.split("-");
      handleDateChange("customerpancardno", "customerpancardDob")(new Date(`${yyyy}-${mm}-${dd}`));
      handleDateChange("proposal", "proposerdob1")(new Date(`${yyyy}-${mm}-${dd}`));
    }

    try {
      const comm = JSON.parse(usersData.communication || "{}");
      if (comm.status === "1") {
        setSameAddress(false);
        const commFields = {
          commcurrenthouse: "comhouse",
          commcurrentcolony: "comcolony",
          commcurrentLandmark: "comlandmark",
          commcurrentCity: "comcity",
          commcurrentState: "comstate",
          commcurrentPincode: "compincode",
        };
        Object.entries(commFields).forEach(([formKey, key]) => {
          if (comm[key]) {
            set(formKey, comm[key], { shouldValidate: true });
          }
        });
      }
    } catch (err) {
      console.error("Invalid communication JSON:", err);
    }
  }, [usersData]);


  const isPanAlreadyVerified =
    isPanVerified ;

  useEffect(() => {
    if (!verifieddata || Object.keys(verifieddata).length === 0) return;
    const set = step1Form.setValue;

    const map = {
      pan: "customerpancardno",
      dob: "customerpancardDob",
      gender: "mr_ms_gender",
      proposalname: "proposername",
      proposaldob: "proposerdob1",
      permLine1: "house",
      permLine2: "colony",
      permLine3: "Landmark",
      permCity: "City",
      permState: "State",
      permPin: "Pincode",
      email: "contactemail",
    };

    Object.entries(map).forEach(([apiKey, formKey]) => {
      if (verifieddata[apiKey]) {
        if (apiKey === "dob") {
          const [dd, mm, yyyy] = verifieddata.dob.split("-");
          handleDateChange(
            "proposal",
            "proposerdob1"
          )(new Date(`${yyyy}-${mm}-${dd}`));
        } else if (apiKey === "gender") {
          const g = verifieddata.gender?.toUpperCase();
          set(formKey, g === "M" ? "Mr" : g === "F" ? "Ms" : "");
        } else {
          set(formKey, verifieddata[apiKey]);
        }
      }
    });

    const fullName = `${verifieddata.firstName || ""} ${
      verifieddata.lastName || ""
    }`.trim();
    if (fullName) {
      set("proposername", fullName);
      set("customerAadharName", fullName);
    }

    if (verifieddata.permCorresSameflag === "Y") {
      setSameAddress(true);
      ["house", "colony", "Landmark", "City", "State", "Pincode"].forEach(
        (key) => {
          set(`commcurrent${key}`, step1Form.getValues(key));
        }
      );
    }
  }, [verifieddata]);

  useEffect(() => {
    if (!sameAddress) return;

    const get = step1Form.getValues;
    const set = step1Form.setValue;

    const syncFields = () => {
      [
        ["house", "commcurrenthouse"],
        ["colony", "commcurrentcolony"],
        ["Landmark", "commcurrentLandmark"],
        ["City", "commcurrentCity"],
        ["State", "commcurrentState"],
        ["Pincode", "commcurrentPincode"],
      ].forEach(([permanent, communication]) => {
        set(communication, get(permanent));
      });
    };

    const subscription = step1Form.watch((values, { name }) => {
      const permKeys = [
        "house",
        "colony",
        "Landmark",
        "City",
        "State",
        "Pincode",
      ];
      if (permKeys.includes(name)) {
        syncFields();
      }
    });

    return () => subscription.unsubscribe();
  }, [sameAddress]);

  const fields = {
    identity: [
      "AADHAR",
      "PAN",
      "PASSPORT",
      "VOTER ID",
      "DRIVING LICENSE",
      "FORM 60",
    ],
    address: ["AADHAR", "PASSPORT", "VOTER ID", "DRIVING LICENSE", "FORM 60"],
  };
  const handlePincodeInput = async (e) => {
    const value = e.target.value;
    const fieldId = e.target.name || e.target.id;

    if (value.length === 6) {
      try {
        const res = await CallApi(constant.API.HEALTH.ACPINCODE, "POST", {
          pincode: value,
        });

        if (res?.length > 0) {
          const { state, district } = res[0];
          console.log(res);

          if (fieldId == "Pincode") {
            console.log(fieldId, district, state);
            step1Form.setValue("City", district);
            step1Form.setValue("State", state);
          } else if (fieldId === "commcurrentPincode") {
            step1Form.setValue("commcurrentCity", district);
            step1Form.setValue("commcurrentState", state);
          }
        }
      } catch (error) {
        console.error("Error fetching pincode info:", error);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-bold text-[#2F4A7E] mb-1">
        Great! Let’s Start with proposer details
      </h2>
      <p className="text-gray-500">We’ll begin with some basic information.</p>

      <label className="block font-semibold cursor-pointer">
        Select Proposer
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <select
          {...step1Form.register("proposar", {
            required: "Please select a proposer",
          })}
          className={inputClass}
        >
          <option value="SELF">SELF</option>
        </select>
      </div>

      <label className="block font-semibold cursor-pointer">Proposer KYC</label>
      <div className="flex flex-col sm:flex-row gap-3">
        {["PAN Card", "Aadhar ( Last 4 Digits )", "Others"].map((type) => (
          <label
            key={type}
            className={`relative flex items-center px-4 py-3 rounded-md border text-sm cursor-pointer w-full transition-all duration-200 ${
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
              // disabled={kycVerified}
              onChange={() => setKycType(type)}
              // onChange={() => !kycVerified && setKycType(type)}
              className="mr-2 accent-pink-500 h-4 w-4"
            />

            {type}
          </label>
        ))}
      </div>

      {/* PAN Card Section - Hidden if already verified via PAN */}
      {kycType === "PAN Card" && !isPanKycHidden && (
        <div className="space-y-2">
          <label className="block font-semibold cursor-pointer">
            Please Provide PAN Card Info
          </label>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              {...step1Form.register("customerpancardno")}
              maxLength={10}
              placeholder="PAN No."
              className="h-[40px] px-4 border border-gray-300 rounded-md text-sm w-full md:w-[220px]"
              onChange={(e) => {
                const upper = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                step1Form.setValue("customerpancardno", upper);
              }}
            />

            <UniversalDatePicker
              id="customerpancardDob"
              name="customerpancardDob"
              value={dates.customerpancardno}
              onChange={handleDateChange(
                "customerpancardno",
                "customerpancardDob"
              )}
              placeholder="Pick a start date"
              error={!dates.pan}
              errorText="Please select a valid date"
            />

<input
  type="button"
  onClick={handleVerifyPan}
  disabled={isPanAlreadyVerified || loading}
  value={
    isPanAlreadyVerified
      ? "VERIFIED"
      : loading
      ? "Verifying..."
      : "VERIFY"
  }
  className={`px-4 py-2 thmbtn
    ${isPanAlreadyVerified ? "bg-green-600 cursor-not-allowed" : ""}
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
/>


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
              maxLength={4}
              onChange={(e) => isNumber(e, step1Form.setValue, "aadharLast4")}
              placeholder="AADHAR NO. (LAST 4 DIGIT)"
              className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-5"
            />

            <input
              type="text"
              {...step1Form.register("aadharName")}
              onChange={(e) => isAlpha(e, step1Form.setValue, "aadharName")}
              placeholder="FULL NAME AS PER AADHAR"
              className="border border-gray-300 px-3 py-2 rounded w-full text-sm sm:col-span-5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <UniversalDatePicker
                id="aadharDob"
                name="aadharDob"
                value={dates.aadhar}
                onChange={handleDateChange("aadhar", "aadharDob")}
                placeholder="Pick a start date"
                error={!dates.aadhar}
                errorText="Please select a valid date"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleVerifyAadhar}
                className="w-full px-1 py-2 thmbtn flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Verifying...
                  </>
                ) : (
                  "VERIFY"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {kycType === "Others" && !isOtherKycHidden && (
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
                      {fileNames[`${type}-${proofs[type]}`] || "Upload File"}
                    </label>
                    <input
                      id={`${type}-${proofs[type]}`}
                      type="file"
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
                <FiLoader className="animate-spin" /> Verifying...
              </>
            ) : (
              "VERIFY"
            )}
          </button>
        </div>
      )}

      {kycVerified && (
        <div className="space-y-2">
          <label className="block font-semibold text-sm">
            Proposer's details:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <select
              {...step1Form.register("mr_ms_gender")}
              className="border border-gray-300 px-3 py-2 rounded text-sm md:col-span-2"
            >
              <option value="">Mr/Ms</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
            </select>

            <input
              {...step1Form.register("proposername")}
              placeholder="Full Name as per your ID Card"
              className="border border-gray-300 px-3 py-2 rounded text-sm w-full md:col-span-6"
            />

            <div className="md:col-span-4">
              <UniversalDatePicker
                id="proposerdob1"
                name="proposerdob1"
                value={dates.proposal}
                onChange={handleDateChange("proposal", "proposerdob1")}
                placeholder="Pick a start date"
                error={!dates.proposal}
                errorText="Please select a valid date"
              />
            </div>
          </div>
        </div>
      )}

      <label className="block font-semibold cursor-pointer">
        Contact Details
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["house", "colony", "Landmark", "City", "State", "Pincode"].map(
          (field) => (
            <input
              key={field}
              {...step1Form.register(field, {
                onChange:
                  field === "Pincode"
                    ? (e) => isNumber(e, step1Form.setValue, "Pincode")
                    : undefined,
              })}
              onInput={
                field === "Pincode"
                  ? (e) => {
                      handlePincodeInput(e); // 👉 custom function
                    }
                  : undefined
              }
              placeholder={field.replace(/^[a-z]/, (c) => c.toUpperCase())}
              className={inputClass}
              maxLength={field === "Pincode" ? 6 : undefined}
            />
          )
        )}
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

            if (same) {
              [
                ["house", "commcurrenthouse"],
                ["colony", "commcurrentcolony"],
                ["Landmark", "commcurrentLandmark"],
                ["City", "commcurrentCity"],
                ["State", "commcurrentState"],
                ["Pincode", "commcurrentPincode"],
              ].forEach(([permanent, communication]) => {
                const value = get(permanent) || "";
                set(communication, value, { shouldValidate: true });
              });
            } else {
              [
                "commcurrenthouse",
                "commcurrentcolony",
                "commcurrentLandmark",
                "commcurrentCity",
                "commcurrentState",
                "commcurrentPincode",
              ].forEach((communication) => {
                set(communication, "", { shouldValidate: true });
              });
            }
          }}
        />
        <span className="ml-2">Same As Permanent Address</span>
      </label>

      {!sameAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            "commcurrenthouse",
            "commcurrentcolony",
            "commcurrentLandmark",
            "commcurrentCity",
            "commcurrentState",
            "commcurrentPincode",
          ].map((field) => (
            <input
              key={field}
              {...step1Form.register(field, {
                onChange:
                  field === "commcurrentPincode"
                    ? (e) =>
                        isNumber(e, step1Form.setValue, "commcurrentPincode")
                    : undefined,
              })}
              onInput={
                field === "commcurrentPincode" ? handlePincodeInput : undefined
              }
              placeholder={field
                .replace("comm", "")
                .replace(/([A-Z])/g, " $1")
                .trim()}
              className={inputClass}
              maxLength={field === "commcurrentPincode" ? 6 : undefined}
            />
          ))}
        </div>
      )}

      <label className="block font-semibold cursor-pointer">
        Contact Details
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <input
          {...step1Form.register("contactemail")}
          placeholder="Email Address"
          className={inputClass}
        />
        <input
          {...step1Form.register("contactmobile", {
            onChange: (e) => isNumber(e, step1Form.setValue, "contactmobile"),
          })}
          placeholder="Mobile Number"
          className={inputClass}
          maxLength={10}
        />

        <input
          {...step1Form.register("contactemergency", {
            onChange: (e) =>
              isNumber(e, step1Form.setValue, "contactemergency"),
          })}
          placeholder="Emergency Mobile No."
          className={inputClass}
          maxLength={10}
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
