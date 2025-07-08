"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import constant from "../../../env";
import { CallApi } from "../../../api";
import UniversalDatePicker from "../../datepicker/index";
import { format, parse } from "date-fns";
import DropdownWithSearch from "../../lib/DropdownWithSearch";

export default function KnowCarStepTwo() {
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
  const [savedPageData, setSavedPageData] = useState(null);

  const router = useRouter();
  const matchedModelRef = useRef(null);
  const registerDate = watch("carregdate");

  useEffect(() => {
    register("carregdate", { required: true });
  }, [register]);

  const manufactYearOpt = () => {
    if (!dates.regDateRaw) return [];
    const year = dates.regDateRaw.getFullYear();
    return [year, year - 1];
  };

  useEffect(() => {
    async function getSavedResponse() {
      try {
        const response = await CallApi(
          constant.API.MOTOR.CAR.KNOWCARDETAILSTWO,
          "GET"
        );
        console.log("Saved response of page 2", response);
        setSavedPageData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getSavedResponse();
  }, []);

  useEffect(() => {
    if (savedPageData && brands.length > 0) {
      setSelectedBrand(savedPageData.brand || null);
      setValue("brand", savedPageData.brand);
    }
  }, [savedPageData, brands, setValue]);

  useEffect(() => {
  if (savedPageData && models.length > 0) {
    const matchedModel = models.find((m) => m.model === savedPageData.model); 
    if (matchedModel) {
      setSelectedModel(matchedModel);
     setValue("model", matchedModel.id);
    }
  }
}, [savedPageData, models, setValue]);

  useEffect(() => {
    if (savedPageData) {
      reset({
        brand: savedPageData.brand,
        model: matchedModelRef.current?.id || "",
        carregdate: savedPageData.carregdate,
        brandyear: savedPageData.brandyear,
        under: savedPageData.under || "individual",
      });
      setUnder(savedPageData.under || "individual");

      if (savedPageData?.carregdate) {
        setDates({
          regDate: savedPageData.carregdate,
          regDateRaw: parse(savedPageData.carregdate, "dd-MM-yyyy", new Date()),
        });
      }
    }
  }, [savedPageData]);

  const handleDateChange = (key) => (date) => {
    if (!date || isNaN(date.getTime())) return;
    const formatted = format(date, "dd-MM-yyyy");
    setDates({ [key]: formatted, [`${key}Raw`]: date });
    setValue("carregdate", formatted);
  };

  const handleGetBrands = async () => {
    try {
      const Brandvalue = "MOT-PRD-001"
      const brand = { brand: Brandvalue };
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
        const car = "MOT-PRD-001";
        const data = { brand: selectedBrand, type: car };
        const response = await CallApi(constant.API.MOTOR.MODELS, "POST", data);
        console.log(response);
        setModels(response);
        reset((prev) => ({ ...prev, model: "" }));
      } catch (error) {
        console.error("error fetching models", error);
      }
    };
    if (selectedBrand) handleGetModels();
  }, [selectedBrand]);

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
    try {
      const response = await CallApi(
        constant.API.MOTOR.CAR.KNOWCARDETAILSTWO,
        "POST",
        data
      );
      if (response) {
        router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTHREE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-[#C8EDFE] py-6 sm:py-10 min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="w-full max-w-6xl mx-auto rounded-[64px] bg-white shadow-lg px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#426D98] text-center">
            Motor insurance provides essential coverage against accidents.
          </h2>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Left Side: Image */}
            <div className="hidden md:col-span-2 md:flex justify-center items-center p-4">
              <div className="w-full max-w-[220px] sm:max-w-xs">
                <img
                  src="/images/health/health-One.png"
                  alt="Home with Umbrella"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Car Register Under */}
                <div className="sm:col-span-2">
                  <label className="labelcls">Car Register Under</label>
                  <div className="flex gap-4 flex-wrap">
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
                    <span className="text-red-600 text-sm">
                      Please select one
                    </span>
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
                    <span className="text-red-600 text-sm">
                      Brand is required
                    </span>
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
                      value: model.id, 
                      label: model.model,
                    }))}
                    value={watch("model") || ""} 
                    onChange={(value) => {
                      setValue("model", value); 
                    }}
                    placeholder="Select or type Model"
                    className="inputcls"
                  />
                  {errors.model && (
                    <span className="text-red-600 text-sm">
                      Model is required
                    </span>
                  )}

                </div>

                {/* Register Date */}
                <div>
                  <label className="labelcls">Register Date</label>
                  <UniversalDatePicker
                    id="carregdate"
                    name="carregdate"
                    className="inputcls"
                    value={dates.regDateRaw}
                    onChange={handleDateChange("regDate")}
                    placeholder="Pick a start date"
                    error={!dates.regDate}
                    errorText="Please select a valid date"
                  />
                  {errors.carregdate && (
                    <span className="text-red-600 text-sm">
                      Date is required
                    </span>
                  )}
                </div>

                {/* Year of Manufacture */}
                {registerDate && (
                  <div>
                    <label className="labelcls">Year Of Manufacture</label>
                    <select
                      {...register("brandyear", { required: true })}
                      className="inputcls"
                    >
                      <option value="">Select Year</option>
                      {manufactYearOpt().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.brandyear && (
                      <span className="text-red-600 text-sm">
                        Year is required
                      </span>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="sm:col-span-2 flex flex-wrap gap-3 justify-start">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(constant.ROUTES.MOTOR.SELECTVEHICLE)
                    }
                    className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    style={{
                      background:
                        "linear-gradient(to bottom, #426D98, #28A7E4)",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    style={{
                      background:
                        "linear-gradient(to bottom, #426D98, #28A7E4)",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
