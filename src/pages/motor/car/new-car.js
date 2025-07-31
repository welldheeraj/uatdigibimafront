"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import constant from "../../../env";
import { CallApi } from "../../../api";
import DropdownWithSearch from "../../lib/DropdownWithSearch";
import { showError } from "@/layouts/toaster";
import { carTwo } from "@/images/Image";

function NewCar() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [under, setUnder] = useState("individual");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [manufactureYears, setManufactureYears] = useState([]);
  const [savedPageData, setSavedPageData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setManufactureYears([currentYear, currentYear - 1]);
  }, []);

  useEffect(() => {
    async function getSavedResponse() {
      try {
        const response = await CallApi(
          constant.API.MOTOR.CAR.NEWCARDETAILSTWO,
          "GET"
        );
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
      setSelectedModel(savedPageData.model || null);
      setValue("model", savedPageData.model);
    }
  }, [savedPageData, models, setValue]);

  useEffect(() => {
    if (savedPageData) {
      reset({
        brand: savedPageData.brand,
        model: savedPageData.model,
        brandyear: savedPageData.brandyear,
        under: savedPageData.under || "individual",
      });
      setUnder(savedPageData.under || "individual");
    }
  }, [savedPageData,reset]);

  const handleGetBrands = async () => {
    try {
      const Brandvalue = "MOT-PRD-001";
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
        setModels(response);
        reset((prev) => ({ ...prev, model: "" }));
      } catch (error) {
        console.error("error fetching models", error);
      }
    };
    if (selectedBrand) handleGetModels();
  }, [selectedBrand,reset]);

  const onSubmit = async (data) => {
    try {
      const response = await CallApi(
        constant.API.MOTOR.CAR.NEWCARDETAILSTWO,
        "POST",
        data
      );
      if (response.status === true) {
        router.push(constant.ROUTES.MOTOR.CAR.PLANS);
      }
    } catch (error) {
      console.log(error);
    }
  };
    const onInvalid = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const message = errors[firstErrorKey]?.message || "Please check required fields.";
    showError(message);
  };

  return (
    <div className="bgcolor py-6 sm:py-10 min-h-screen flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto rounded-[64px] bg-white shadow-lg px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#426D98] text-center">
          Car insurance provides essential coverage against accidents.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="hidden md:col-span-2 md:flex justify-center items-center p-4">
            <div className="w-full max-w-[220px] sm:max-w-xs">
              <Image
                src={carTwo}
                alt="Car Image"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit,onInvalid)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="sm:col-span-2">
                <label className="labelcls">Car Register Under</label>
                <div className="flex items-center bg-[#E9F1FF] rounded-full p-1 w-fit shadow-sm">
                  {["individual", "company"].map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input
                        type="radio"
                        value={type}
                        {...register("under", { required: true })}
                        className="peer hidden"
                        checked={under === type}
                        onChange={() => {
                          setUnder(type);
                          setValue("under", type);
                        }}
                      />
                      <div
                        className={`
                          px-5 py-1.5 rounded-full text-sm font-semibold capitalize
                          text-[#2F4A7E] hover:bg-[#d3e6ff]
                          transition-all duration-300 ease-in-out
                          peer-checked:bg-[#7998F4]
                          peer-checked:text-white
                        `}
                      >
                        {type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="labelcls">Manufacture</label>
                <DropdownWithSearch
                  id="brandsDropdown"
                  name="brand"
                  options={brands.map((brand) => ({
                    value: brand.MANUFACTURER,
                    label: brand.MANUFACTURER,
                  }))}
                {...register("brand", { required: "Please select a Manufacture." })}
                  value={selectedBrand}
                  onChange={(value) => {
                    setSelectedBrand(value);
                    setValue("brand", value);
                  }}
                  placeholder="Select or type brand"
                  className="inputcls"
                />
              </div>

              <div>
                <label className="labelcls">Model & Variant</label>
                <DropdownWithSearch
                  id="modelsDropdown"
                  name="model"
                {...register("model", { required: "Please select a model." })}
                  options={models.map((model) => ({
                    value: model.id,
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
              </div>

              <div>
                <label className="labelcls">Year Of Manufacture</label>
                <select
               {...register("brandyear", { required: "Please select manufacture year." })}
                  className="inputcls"
                >
                  <option value="">Select Year</option>
                  {manufactureYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3 justify-start">
                <button
                  type="button"
                  onClick={() => router.push(constant.ROUTES.MOTOR.SELECTVEHICLE)}
                  className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  style={{ background: "#7998F4" }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  style={{ background: "#7998F4" }}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCar;
