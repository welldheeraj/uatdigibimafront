"use client";
import React,{ useEffect } from "react";

import { useForm } from "react-hook-form";
import { showSuccess, showError } from "@/layouts/toaster";
import { CallApi, getUserinfo } from "../../../api";
import constant from "../../../env";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function EditIllnessComponent({ onClose }) {
  const { register, handleSubmit, watch, setValue, reset } = useForm({ defaultValues: { data: [] } });
  const illnesses = ["Diabetes","Blood Pressure","Asthma","Thyroid","Heart Disease","Other Disease"];
  const selected = watch("data") || [];
  const isNoDiseaseSelected = selected.includes("No Existing Disease");
  const isAnyOtherSelected = selected.some((d) => d !== "No Existing Disease");

useEffect(() => {
  const getToken = localStorage.getItem("token");
  if (getToken) {
    const fetchData = async () => {
      try {
        const res = await getUserinfo(getToken);
        const data = await res.json();
        console.log(" data :", data);
        console.log("pre ped data :", data.user?.ped);

        let pedList = [];
        if (data.user?.ped) {
          const parsedPED = JSON.parse(data.user.ped || "{}");
          pedList = parsedPED.data || [];
        }

        console.log("Final PED list:", pedList);

        // prefill checkboxes if data exists
        if (pedList.length > 0) {
          setValue("data", pedList);
        }

      } catch (error) {
        console.error("Error parsing PED:", error);
      }
    };
    fetchData();
  }
}, [reset, setValue]);





  const saveIllnessMutation = useMutation({
    mutationFn: (payload) => CallApi(constant.API.HEALTH.SAVEILLNESS, "POST", payload),
    onSuccess: (res) => { if(res?.status){ showSuccess("Illness saved"); onClose?.(); } else showError("Failed to save"); },
    onError: () => showError("Failed to submit data."),
  });

  const toggleSelection = (value) => {
    let newValues = new Set(selected);
    if (newValues.has(value)) newValues.delete(value);
    else {
      if (value==="No Existing Disease") newValues=new Set(["No Existing Disease"]);
      else { newValues.delete("No Existing Disease"); newValues.add(value); }
    }
    setValue("data", Array.from(newValues));
  };

  const onSubmit = (formData) => { if(formData.data.length===0) return showError("Select at least one illness"); saveIllnessMutation.mutate(formData); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
      <h2 className="text-[18px] font-semibold text-blue-900 mb-3">Select Existing Illness</h2>
      <div className="flex flex-col gap-3">
        {illnesses.map((ill) => {
          const isChecked = selected.includes(ill);
          return (
            <label key={ill} className={`relative flex justify-between items-center px-4 py-3 bg-white rounded-xl border ${isNoDiseaseSelected?"opacity-50 cursor-not-allowed":"cursor-pointer"}`}>
              {ill}
              <input type="checkbox" value={ill} {...register("data")} checked={isChecked} onChange={()=>toggleSelection(ill)} disabled={isNoDiseaseSelected} className="form-checkbox accent-pink-500 w-4 h-4"/>
            </label>
          );
        })}
        <label className={`relative flex justify-between items-center px-4 py-3 bg-white rounded-xl border ${isAnyOtherSelected?"opacity-50 cursor-not-allowed":"cursor-pointer"}`}>
          No Existing Disease
          <input type="checkbox" value="No Existing Disease" {...register("data")} checked={selected.includes("No Existing Disease")} onChange={()=>toggleSelection("No Existing Disease")} disabled={isAnyOtherSelected} className="form-checkbox accent-pink-500 w-4 h-4"/>
        </label>
      </div>
      <button type="submit" disabled={saveIllnessMutation.isLoading} className="w-full thmbtn py-2 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md">
        {saveIllnessMutation.isLoading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}
