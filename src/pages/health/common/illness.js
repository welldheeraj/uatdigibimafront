"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "../../../layouts/toaster";
import { CallApi, getUserinfo,isAuth } from "../../../api";
import constant from "../../../env";

export default function IllnessForm() {
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { data: [] },
  });

  const illnesses = [
    "Diabetes",
    "Blood Pressure",
    "Asthma",
    "Thyroid",
    "Heart Disease",
    "Other Disease",
  ];

  const router = useRouter();
  const selected = watch("data") || [];
  const isNoDiseaseSelected = selected.includes("No Existing Disease");
  const isAnyOtherSelected = selected.some((d) => d !== "No Existing Disease");

  useEffect(()=>{
    async function getAuth()
    {
      const isauth= await isAuth();
    
      console.log('auth:',isauth);
      if(!isauth)
      {
        router.replace(constant.ROUTES.INDEX);
      }
    }
    getAuth();
  },[]);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const fetchData = async () => {
        try {
          const res = await getUserinfo(getToken);
          const data = await res.json();

          let pedList = [];
          if (data.user?.ped) {
            const parsedPED = JSON.parse(data.user.ped || "{}");
            pedList = parsedPED.data || [];
          }

          console.log("Final PED list:", pedList); 

          if (data.status) {
            reset({ data: pedList });
          }
        } catch (error) {
          console.error("Error parsing PED:", error);
        }
      };
      fetchData();
    }
  }, [reset]);


  const toggleSelection = (value) => {
    let newValues = new Set(selected);
    if (newValues.has(value)) {
      newValues.delete(value);
    } else {
      if (value === "No Existing Disease") {
        newValues = new Set(["No Existing Disease"]);
      } else {
        newValues.delete("No Existing Disease");
        newValues.add(value);
      }
    }
    setValue("data", Array.from(newValues));
  };

  const onSubmit = async (formData) => {
    if (formData.data.length === 0) {
      showError("Please select at least one illness.");
      return;
    }
    try {
      const response = await CallApi(
        constant.API.HEALTH.SAVEILLNESS,
        "POST",
        formData
      );
      console.log("Server Response:", response);
      router.push(constant.ROUTES.HEALTH.PLANS);
    } catch (err) {
      console.error("API error:", err);
      showError("Failed to submit data. Please try again.");
    }
  };

  return (
    <div className="bg-[#C8EDFE] px-2 sm:px-4 py-6 sm:py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1100px] mx-auto mt-5 mb-10 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-8 rounded-[64px] bg-[#FFFF] text-white text-center"
      >
        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] text-[#426D98] font-bold sm:leading-snug md:leading-relaxed mb-10">
          Do any member(s) have any existing data for which they take{" "}
          <br className="hidden sm:inline" />
          regular medication?
        </h2>

        {/* Illness Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 justify-items-center mb-6">
          {illnesses.map((illness) => {
            const isChecked = selected.includes(illness);
            return (
              <label
                key={illness}
                className={`relative flex justify-between items-center w-[280px] px-4 py-3 bg-white text-black rounded-xl font-medium border ${
                  isChecked
                    ? "border border-gray-400"
                    : "border border-gray-400"
                } ${
                  isNoDiseaseSelected
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {illness}
                <input
                  type="checkbox"
                  value={illness}
                  {...register("data")}
                  checked={isChecked}
                  onChange={() => toggleSelection(illness)}
                  disabled={isNoDiseaseSelected}
                  className="form-checkbox accent-pink-500 w-4 h-4"
                />
                {isChecked && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
                )}
              </label>
            );
          })}
        </div>

        {/* No Existing Disease */}
        <div className="flex justify-center mb-6">
          <label
            className={`relative flex justify-between items-center w-[280px] px-4 py-3 bg-white text-black rounded-xl font-medium border ${
              selected.includes("No Existing Disease")
                ? "border border-gray-400"
                : "border border-gray-400"
            } ${
              isAnyOtherSelected
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            No Existing Disease
            <input
              type="checkbox"
              value="No Existing Disease"
              {...register("data")}
              checked={selected.includes("No Existing Disease")}
              onChange={() => toggleSelection("No Existing Disease")}
              disabled={isAnyOtherSelected}
              className="form-checkbox accent-pink-500 w-4 h-4"
            />
            {selected.includes("No Existing Disease") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
            )}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => router.push(constant.ROUTES.HEALTH.INSURE)}
            className="px-10 py-2 thmbtn"
          >
            Back
          </button>
          <button type="submit" className="px-10 py-2 thmbtn">
            View Plans
          </button>
        </div>
      </form>
    </div>
  );
}
