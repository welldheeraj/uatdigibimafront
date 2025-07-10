"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import constant from "../../../env";
import Image from "next/image";
import DropdownWithSearch from "../../lib/DropdownWithSearch";
import { CallApi } from "../../../api";

function NewBike() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
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
          constant.API.MOTOR.BIKE.NEWBIKEDETAILSTWO,
          "GET"
        );
        console.log("Saved response new Bikee", response);
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
        // model: matchedModelRef.current?.id || "",
        model: savedPageData.model,
        // carregdate: savedPageData.carregdate,
        brandyear: savedPageData.brandyear,
        under: savedPageData.under || "individual",
      });
      setUnder(savedPageData.under || "individual");

    }
  }, [savedPageData]);




  const handleGetBrands = async () => {
    try {
      const BikeBrand = "MOT-PRD-002";
      const brand = { brand: BikeBrand };
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
        // reset((prev) => ({ ...prev, model: "" }));
      } catch (error) {
        console.error("error fetching models", error);
      }
    }
    if (selectedBrand) handleGetModels();
  }, [selectedBrand]);

  const onSubmit = async (data) => {
    console.log("new bike payload ka data", data);

    try {
      const response = await CallApi(constant.API.MOTOR.BIKE.NEWBIKEDETAILSTWO,"POST", data)
       
      console.log("NewBBB response", response)

      if(response.status === true){
             router.push(constant.ROUTES.MOTOR.BIKEPLANS)
      }

    } catch (error) {
      console.log(error)
    }
    //  router.push(constant.ROUTES.MOTOR.BIKEPLANS)
  };

  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="text-center text-lg font-semibold mb-6">
        Motor insurance provides essential coverage against accidents.
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

            <div>
              <label className="block font-medium mb-1">Manufacture</label>
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
              />
              {errors.brand && (
                <span className="text-red-600 text-sm">Brand is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Model & Variant</label>
              <DropdownWithSearch
                id="modelsDropdown"
                name="model"
                {...register("model", { required: true })}
                options={models.map((model) => ({
                  value: model.id,
                  label: model.model,
                }))}
                value={selectedModel}
                onChange={(value) => {
                  setSelectedModel(value);
                  setValue("model", value);
                  console.log("model ki value", value);
                }}
                placeholder="Select or type Model"
              />
              {errors.model && (
                <span className="text-red-600 text-sm">Model is required</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Year Of Manufacture
              </label>
              <select
                {...register("brandyear", { required: true })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Year</option>
                {manufactureYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.newbikemanuyear && (
                <span className="text-red-600 text-sm">Year is required</span>
              )}
            </div>

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
        </div>
      </div>
    </div>
  );
}

export default NewBike;
