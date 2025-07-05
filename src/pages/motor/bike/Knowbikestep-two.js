"use client";

import { useForm } from "react-hook-form";
import { useState,useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import UniversalDatePicker from "../../datepicker/index";
import { format, parse } from "date-fns";
import DropdownWithSearch from "../../lib/DropdownWithSearch";
import { CallApi } from "../../../api";
import constant from "../../../env";

export default function KnowBikeStepTwo() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const [under, setUnder] = useState("individual");
 const [brands, setBrands] = useState([]);
   const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
   const [dates, setDates] = useState({ regDate: "", regDateRaw: null });


  const router = useRouter();
  const registerDate = watch("bikeregdate");

  const manufactYearOpt = () => {
    if (!dates.regDateRaw) return [];
    const year = dates.regDateRaw.getFullYear();
    return [year, year - 1];
  };

  const handleDateChange = (key) => (date) => {
    if (!date || isNaN(date.getTime())) return;
    const formatted = format(date, "dd-MM-yyyy");
    setDates({ [key]: formatted, [`${key}Raw`]: date });
    setValue("bikeregdate", formatted);
  };


    const handleGetBrands = async () => {
    try {
      const brand = { brand: "BIKE" };
      const response = await CallApi(constant.API.MOTOR.BRANDS, "POST", brand);
      setBrands(response.brand);
    } catch (error) {
      console.error("error fetching brands", error);
    }
  };


    useEffect(() => {
    handleGetBrands();
  }, []);

    useEffect(() => {
    const handleGetModels = async () => {
      try {
        const bike = "MOT-PRD-002";
        const data = { brand: selectedBrand, type: bike };
        const response = await CallApi(constant.API.MOTOR.MODELS, "POST", data);
        setModels(response);
        reset((prev) => ({ ...prev, model: "" }));
      } catch (error) {
        console.error("error fetching bike models", error);
      }
    };
    if (selectedBrand) handleGetModels();
  }, [selectedBrand]);




  const onSubmit = async (data) => {
    console.log("Submitted know bike Data:", data);
    // router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTHREE);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center text-lg font-semibold mb-6">
        Bike insurance provides essential coverage against accidents.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <Image
            src=""
            alt="Car"
            width={400}
            height={300}
            className="rounded shadow"
          />
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">
                Bike Register Under
              </label>
              <div className="flex gap-4">
                {["individual", "company"].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 cursor-pointer ${
                      under === type ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("under", { required: true })}
                      checked={under === type}
                      onChange={() => {
                        setUnder(type);
                        setValue("under", type);
                      }}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
              {errors.under && (
                <span className="text-red-600 text-sm">Please select one</span>
              )}
            </div>
           
             {/* Manufacture */}
            <div>
              <label className="labelcls">Manufacture</label>
              <DropdownWithSearch
                id="brandsDropdown"
                    name="brand"
                    options={brands.map((brand) => ({
                      value: brand.MANUFACTURER,
                      label: brand.MANUFACTURER,
                    }))}
                    {...register("brand", { required: true })}
                    value={selectedBrand}
                    onChange={(value) => {
                      setSelectedBrand(value);
                      setValue("brand", value);
                    }}
                    placeholder="Select or type brand"
                    className="inputcls"
              />
              {errors.brand && (
                <span className="text-red-600 text-sm">Brand is required</span>
              )}
            </div>
  

            {/* Model & Variant */}
            <div>
              <label className="labelcls">Model & Variant</label>
              <DropdownWithSearch
                id="modelsDropdown"
                    name="model"
                    {...register("model", { required: true })}
                    options={models.map((model) => ({
                      value: model.model,
                      label: model.model,
                    }))}
                    value={selectedModel}
                    onChange={(value) => {
                      setSelectedModel(value);
                      setValue("model", value);
                    }}
                    placeholder="Select or type Model"
                    className="inputcls"
              />
              {errors.model && (
                <span className="text-red-600 text-sm">Model is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Register Date</label>
              <UniversalDatePicker
                id="bikeregdate"
                name="bikeregdate"
                value={dates.regDateRaw}
                onChange={handleDateChange("regDate")}
                placeholder="Pick a start date"
                error={!dates.regDate}
                errorText="Please select a valid date"
              />
              {errors.carregdate && (
                <span className="text-red-600 text-sm">Date is required</span>
              )}
            </div>

            {registerDate && (
              <div>
                <label className="block font-medium mb-1">
                  Year Of Manufacture
                </label>
                <select
                  {...register("brandyear", { required: true })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Year</option>
                  {manufactYearOpt().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.brandyear && (
                  <span className="text-red-600 text-sm">Year is required</span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                type="button"
                onClick={() => router.push(constant.ROUTES.MOTOR.SELECTVEHICLE)}
                className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
              >
                Continue
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-center">
            Already bought a policy from DigiBima?{" "}
            <a href="#" className="text-blue-600 underline">
              Renew Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
