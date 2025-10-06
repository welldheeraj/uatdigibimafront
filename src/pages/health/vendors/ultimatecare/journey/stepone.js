"use client";
import React, { useState, useEffect, useCallback } from "react";
import { isAlpha, isNumber } from "@/styles/js/validation";
import { FiLoader } from "react-icons/fi";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UniversalDatePicker from "../../../../datepicker/index";
import { CallApi } from "@/api";
import constant from "@/env";
import { format, parse } from "date-fns";
import { Controller } from "react-hook-form";
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
  verifiedData,
  setStepOneData,
  kycData,
  isPanKycHidden,
  setIsPanKycHidden,
  isAadharKycHidden,
  setIsAadharKycHidden,
  isOtherKycHidden,
  setIsOtherKycHidden,
  setQuoteData,
  setOldPincode,
  setNewPincode,
  setPlanType
}) {
  const isPanAlreadyVerified = isPanVerified;
  const [priceChangeLoading, setPriceChangeLoading] = useState(false);
  const [usersData, setUsersData] = useState(false);
  const [isUserPrefilled, setIsUserPrefilled] = useState(false);
  const [isVerifiedPrefilled, setIsVerifiedPrefilled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

   const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingAadhar, setIsVerifyingAadhar] = useState(false);
  const [isVerifyingOther, setIsVerifyingOther] = useState(false);

  const [fetchedPincode, setFetchedPincode] = useState("");
  const [hasUserChangedPin, setHasUserChangedPin] = useState(false);

  const [dates, setDates] = useState({
    customerpancardno: "",
    aadhar: "",
    proposal: "",
  });

  const handleDateChange = useCallback(
    (key, field) => (date) => {
      const formatted = format(date, "dd-MM-yyyy");
      setDates((prev) => ({ ...prev, [key]: date }));
      step1Form.setValue(field, formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [step1Form]
  );

  const handlePincodeInput = useCallback(
    async (e) => {
      const value = e.target.value.trim();
      const fieldId = e.target.name || e.target.id;

      if (!/^\d{6}$/.test(value)) return;

      try {
        const res = await CallApi(constant.API.HEALTH.ACPINCODE, "POST", {
          pincode: value,
        });

        if (res?.length > 0) {
          const { state, district } = res[0];

          if (fieldId === "Pincode") {
            step1Form.setValue("City", district);
            step1Form.setValue("State", state);

            if (!fetchedPincode) {
              setFetchedPincode(value);
              setOldPincode(value);
              setHasUserChangedPin(false);
            } else if (value !== fetchedPincode) {
              setHasUserChangedPin(true);
              step1Form.setValue("newpincode", value);
              setNewPincode(value);

              try {
                const quoteResponse = await CallApi(
                  constant.API.HEALTH.ULTIMATECARE.CHANGEPINCODE,
                  "POST",
                  { newpincode: value }
                );
                if (quoteResponse?.status) {
                  setQuoteData({
                    totalpremium: quoteResponse.totalpremium,
                    basepremium: quoteResponse.basepremium,
                    coverage: quoteResponse.coverage,
                  });
                }
              } catch (error) {
                console.error("CHANGEPINCODE error:", error);
              }
            }
          } else if (fieldId === "commcurrentPincode") {
            step1Form.setValue("commcurrentCity", district);
            step1Form.setValue("commcurrentState", state);
          }
        } else {
          if (fieldId === "Pincode") {
            step1Form.setValue("City", "");
            step1Form.setValue("State", "");
          } else if (fieldId === "commcurrentPincode") {
            step1Form.setValue("commcurrentCity", "");
            step1Form.setValue("commcurrentState", "");
          }
        }
      } catch (error) {
        console.error("Pincode API Error:", error);
      }
    },
    [fetchedPincode, step1Form, setOldPincode, setNewPincode, setQuoteData]
  );

  useEffect(() => {
    const fetchDataONE = async () => {
      try {
        const res = await CallApi(
          constant.API.HEALTH.ULTIMATECARE.SAVESTEPONE,
          "GET"
        );
        console.log(res)
        setUsersData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataONE();
  }, [step1Form]);

  useEffect(() => {
    if (!usersData || isUserPrefilled) return;
    const user = usersData.data || {};
    const userInfo = usersData.user?.[0] || {};
    const contact = JSON.parse(user.contact_details || "{}");
    const permanent = JSON.parse(user.permanent_address || "{}");
    const comm = JSON.parse(user.comunication_address || "{}");
    setPlanType(usersData.plantype);
    const typeMap = {
      p: "PAN Card",
      a: "Aadhar ( Last 4 Digits )",
      o: "Others",
    };

    const kycCode = usersData.cacheData?.toLowerCase();
    const kycLabel = typeMap[kycCode];

    if (kycLabel) {
      setKycType(kycLabel);
      step1Form.setValue("kycType", kycLabel, { shouldValidate: true });
      setKycVerified(true);

      if (kycCode === "p") {
        setIsPanVerified(true);
        setIsPanKycHidden(true);
      }
      if (kycCode === "a") {
        // setIsPanVerified(true);
        setIsAadharKycHidden(true);
      }
      if (kycCode === "o") {
        // setIsPanVerified(true);
        setIsOtherKycHidden(true);
      }
    }

    const set = step1Form.setValue;
    const directFields = {
      proposername: user.kyc_name,
      mr_ms_gender: user.gender,
      contactemail: userInfo.email,
      contactmobile: userInfo.mobile,
      contactemergency: contact.contactemergency,
      house: permanent.address1,
      colony: permanent.address2,
      Landmark: permanent.landmark,
      City: permanent.city,
      State: permanent.state,
      Pincode: userInfo.pincode,
    };

    Object.entries(directFields).forEach(([formKey, value]) => {
      const isDirty = step1Form.formState?.dirtyFields?.[formKey];
      if (value && !isDirty) {
        set(formKey, value, { shouldValidate: true });

        if (formKey === "Pincode") {
          set("oldpincode", value, { shouldValidate: true });
          handlePincodeInput({ target: { name: "Pincode", value } });
        }
      }
    });

    if (user.pan) {
      set("customerpancardno", user.pan, { shouldValidate: true });
    }

    if (user.dob) {
      const [dd, mm, yyyy] = user.dob.split("-");
      const dob = new Date(`${yyyy}-${mm}-${dd}`);
      handleDateChange("customerpancardno", "customerpancardDob")(dob);
      handleDateChange("proposal", "proposerdob1")(dob);
    }

    if (comm.status === "1") {
      setSameAddress(false);

      const commFields = {
        commcurrenthouse: comm.commcurrenthouse,
        commcurrentcolony: comm.commcurrentcolony,
        commcurrentLandmark: comm.commcurrentlandmark,
        commcurrentCity: comm.commcurrentcity,
        commcurrentState: comm.commcurrentstate,
        commcurrentPincode: comm.commcurrentpincode,
      };

      Object.entries(commFields).forEach(([formKey, value]) => {
        if (value) {
          set(formKey, value, { shouldValidate: true });
          if (formKey === "commcurrentPincode") {
            handlePincodeInput({
              target: { name: "commcurrentPincode", value },
            });
          }
        }
      });
    }

    setIsUserPrefilled(true);
  }, [
    usersData,
    isUserPrefilled,
    setKycType,
    setKycVerified,
    setIsPanVerified,
    setIsPanKycHidden,
    setIsAadharKycHidden,
    setIsOtherKycHidden,
    step1Form,
    handlePincodeInput,
    handleDateChange,
    setSameAddress,
    setPlanType,
  ]);

  useEffect(() => {
    if (
      !verifiedData ||
      Object.keys(verifiedData).length === 0 ||
      isVerifiedPrefilled
    )
      return;

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
      const isDirty = step1Form.formState?.dirtyFields?.[formKey];
      if (verifiedData[apiKey] && !isDirty) {
        if (apiKey === "dob") {
          const [dd, mm, yyyy] = verifiedData.dob.split("-");
          handleDateChange(
            "proposal",
            "proposerdob1"
          )(new Date(`${yyyy}-${mm}-${dd}`));
        } else if (apiKey === "gender") {
          const g = verifiedData.gender?.toUpperCase();
          set(formKey, g === "M" ? "Mr" : g === "F" ? "Ms" : "");
        } else {
          set(formKey, verifiedData[apiKey]);
        }
      }
    });

    if (verifiedData.kyctype === "p") setIsPanKycHidden(true);
    if (verifiedData.kyctype === "a") setIsAadharKycHidden(true);
    if (verifiedData.kyctype === "o") setIsOtherKycHidden(true);

    setIsVerifiedPrefilled(true);
  }, [
    verifiedData,
    isVerifiedPrefilled,
    step1Form,
    handleDateChange,
    setIsPanKycHidden,
    setIsAadharKycHidden,
    setIsOtherKycHidden,
  ]);

  useEffect(() => {
    if (!sameAddress || userInteracted) return;

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
        set(communication, get(permanent), { shouldValidate: true });
      });
    };

    syncFields();

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
  }, [sameAddress, userInteracted, step1Form]);

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

  useEffect(() => {
    const unregister = step1Form.unregister;
    if (kycType !== "PAN Card") {
      unregister("customerpancardno");
      unregister("customerpancardDob");
    }
    if (kycType !== "Aadhar ( Last 4 Digits )") {
      unregister("aadharLast4");
      unregister("aadharName");
      unregister("aadharDob");
      unregister("aadharGender");
    }
    if (kycType !== "Others") {
      unregister("identityProof");
      unregister("addressProof");
      // optional: unregister file upload fields too
    }
  }, [kycType, step1Form.unregister]);

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

            <Controller
              control={step1Form.control}
              name="customerpancardDob"
              rules={{ required: "Please select a valid date" }}
              render={({ field, fieldState }) => (
                <UniversalDatePicker
                  id="customerpancardDob"
                  name="customerpancardDob"
                  className={inputClass}
                  value={
                    field.value
                      ? parse(field.value, "dd-MM-yyyy", new Date())
                      : null
                  }
                  onChange={(date) => {
                    if (date instanceof Date && !isNaN(date)) {
                      const formatted = format(date, "dd-MM-yyyy");
                      field.onChange(formatted);
                    }
                    //  const formatted = format(date, "dd-MM-yyyy");
                    //  setDates((prev) => ({ ...prev, customerpancardno: date }));
                    //  field.onChange(formatted);
                  }}
                  placeholder="Pick a date"
                  error={!!fieldState.error}
                  errorText={fieldState.error?.message}
                />
              )}
            />

           <button
            type="button"
            onClick={async () => {
              setIsVerifyingPan(true);
              await handleVerifyPan();
              setIsVerifyingPan(false);
            }}
            disabled={isPanAlreadyVerified || isVerifyingPan}
            className={`px-4 py-2 thmbtn cursor-pointer flex items-center justify-center gap-2
              ${isPanAlreadyVerified ? "bg-green-600 cursor-not-allowed" : ""}
              ${isVerifyingPan ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {isPanAlreadyVerified ? (
              "VERIFIED"
            ) : isVerifyingPan ? (
              <>
                
                Verifying<span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
                onChange={(date) => {
                  if (date instanceof Date && !isNaN(date)) {
                    const formatted = format(date, "dd-MM-yyyy");
                    handleDateChange("aadhar", "aadharDob");
                  }
                }}
                placeholder="Pick a start date"
                error={!dates.aadhar}
                errorText="Please select a valid date"
              />
            </div>

            <div className="sm:col-span-2">
              <button
  type="button"
  onClick={async () => {
    setIsVerifyingAadhar(true);
    await handleVerifyAadhar();
    setIsVerifyingAadhar(false);
  }}
  className="w-full px-1 py-2 thmbtn flex items-center justify-center gap-2"
  disabled={isVerifyingAadhar}
>
  {isVerifyingAadhar ? (
    <>
      Verifying <FiLoader className="animate-spin" />
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
  onClick={async () => {
    setIsVerifyingOther(true);
    await handleVerifyOther();
    setIsVerifyingOther(false);
  }}
  className="px-4 py-2 thmbtn flex items-center gap-2"
  disabled={isVerifyingOther}
>
  {isVerifyingOther ? (
    <>
    Verifying<FiLoader className="animate-spin" />
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
            Proposer&apos;s details:
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
              <Controller
                control={step1Form.control}
                name="proposerdob1"
                rules={{ required: "Please select a valid date" }}
                render={({ field, fieldState }) => (
                  <UniversalDatePicker
                    id="proposerdob1"
                    name="proposerdob1"
                    className={inputClass}
                    value={
                      field.value
                        ? parse(field.value, "dd-MM-yyyy", new Date())
                        : null
                    }
                    onChange={(date) => {
                      if (date instanceof Date && !isNaN(date)) {
                        const formatted = format(date, "dd-MM-yyyy");
                        setDates((prev) => ({ ...prev, proposal: date }));
                        field.onChange(formatted);
                      }
                    }}
                    placeholder="Pick a date"
                    error={!!fieldState.error}
                    errorText={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      <label className="block font-semibold cursor-pointer">
        Current Address
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
                      handlePincodeInput(e);
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
                if (
                  communication === "commcurrentPincode" &&
                  value.length === 6
                ) {
                  handlePincodeInput({
                    target: { name: communication, value },
                  });
                }
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
              onBlur={
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
