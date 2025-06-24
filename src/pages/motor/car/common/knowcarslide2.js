"use client"

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import constant from "../../../../env";
import { CallApi } from "../../../../api";
import UniversalDatePicker from "../../../datepicker/index";
import { format } from "date-fns";

export default function KnowCarSlideTwo() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset
  } = useForm();
  const [under, setUnder] = useState("individual");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [dates, setDates] = useState({ regDate: "", regDateRaw: null });
  const router = useRouter();

const [savedPageData, setSavedPageData] = useState(null)

  // const { vehicle } = router.state;
  // const [vahan, setVahan] = useState(vehicle);

  const registerDate = watch("carregdate");

const manufactYearOpt = () => {
  if (!dates.regDateRaw) return [];
  const year = dates.regDateRaw.getFullYear();
  return [year, year - 1];
};

    useEffect(() => {
      async function getSavedResponse() {
        try {
          const response = await CallApi(
            constant.API.MOTOR.CAR.SAVESTEPTWO,
            "GET"
          );
          console.log("Saved response of page 2", response);
          setSavedPageData(response.data)
        } catch (error) {
          console.error(error);
        }
      }
  
      getSavedResponse();
    },[]);



useEffect(() => {
  if (savedPageData) {
    reset({
      brand: savedPageData.brand,
      model: savedPageData.model,
      carregdate: savedPageData.carregdate, 
      brandyear: savedPageData.brandyear
        });

  }

}, [savedPageData]);



  const handleDateChange = (key) => (date) => {
  if (!date || isNaN(date.getTime())) {
    return;
  }

  const formatted = format(date, "dd-MM-yyyy");
  setDates({ [key]: formatted, [`${key}Raw`]: date });
  setValue("carregdate", formatted);
};

  const handleGetBrands = async () => {
    try {
      const brand = {
        brand: "CAR",
      };
      const response = await CallApi(constant.API.MOTOR.BRANDS, "POST", brand);
      console.log("Brands ka res", response);
      setBrands(response.brand);
      console.log("mai hoo", brands);
    } catch (error) {
      console.error("error fetching in brands", error);
    }
  };

  const handleGetModels = async () => {
    try {
      const data = {
        brand: selectedBrand,
        type: "TW",
      };

      const response = await CallApi(constant.API.MOTOR.MODELS, "POST", data);
      console.log("i'm Model", response);
      setModels(response);
    } catch (error) {
      console.error("error fetching in models",error);
    }
  };

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);

    try {
      const response = await CallApi(constant.API.MOTOR.CARDETAILSTWO, "POST", data);
      console.log(response)

      var savepagedata;
      if(response){
        savepagedata = await CallApi(constant.API.MOTOR.CAR.SAVESTEPTWO,"POST",data)

        console.log(savepagedata)
      }

      if(savepagedata){

        router.push(constant.ROUTES.MOTOR.KnowCarSlide3);
      }
    } catch (error) {
      console.error(error)
    }
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

        {/* Right: Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">
                Car Register Under
              </label>
              <div className="flex gap-4">
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    under === "individual" ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="individual"
                    {...register("under", { required: true })}
                    checked={under === "individual"}
                    onChange={() => setUnder("individual")}
                  />
                  Individual
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    under === "company" ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="company"
                    {...register("under", { required: true })}
                    checked={under === "company"}
                    onChange={() => setUnder("company")}
                  />
                  Company
                </label>
              </div>
              {errors.under && (
                <span className="text-red-600 text-sm">Please select one</span>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block font-medium mb-1">Manufacture</label>
              <input
                list="brand-options"
                {...register("brand", { required: true })}
                className="w-full border rounded px-3 py-2"
                placeholder="Select or type brand"
                onClick={handleGetBrands}
                value={selectedBrand}
              />

              {
                <ul className="absolute z-10 bg-white border max-h-60 overflow-y-auto rounded shadow-md mt-1">
                  {brands.map((brand, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSelectedBrand(brand.MANUFACTURER);
                        setValue("brand", brand.MANUFACTURER);
                        setBrands([]);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {brand.MANUFACTURER}
                    </li>
                  ))}
                </ul>
              }

              {errors.brand && (
                <span className="text-red-600 text-sm">Brand is required</span>
              )}
            </div>

            {/* Model & Variant */}
            <div>
              <label className="block font-medium mb-1">Model & Variant</label>
              <input
                list="model-options"
                {...register("model", { required: true })}
                className="w-full border rounded px-3 py-2"
                placeholder="Select or type model"
                onClick={handleGetModels}
                value={selectedModel}
              />

              {
                <ul className="absolute z-10 bg-white border max-h-60 overflow-y-auto rounded shadow-md mt-1">
                  {models.map((model, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSelectedModel(model.model);
                        setValue("model", model.model);
                        setModels([]);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {model.model}
                    </li>
                  ))}
                </ul>
              }

              {errors.model && (
                <span className="text-red-600 text-sm">Model is required</span>
              )}
            </div>

            {/* Register Date */}
            <div>
              <label className="block font-medium mb-1">Register Date</label>

              <UniversalDatePicker
                id="regDate"
                name="regDate"
                value={dates.regDateRaw} 
                onChange={handleDateChange("regDate")}
                placeholder="Pick a start date"
                error={!dates.regDate}
                errorText="Please select a valid date"
              />
            </div>

            {/* Year of Manufacture */}
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

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 justify-start">
              <button
                type="button"
                onClick={() => router.push(constant.ROUTES.MOTOR.SELECTVEHICLE)}
                className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
              >
                Continue
              </button>
            </div>
          </form>

          {/* Footer Text */}
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
