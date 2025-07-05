"use client"

import {  useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import constant from "../../../env";
import Image from "next/image";
import DropdownWithSearch from "../../lib/DropdownWithSearch";


function NewBike() {

const {register, setValue,   handleSubmit, formState: { errors },} = useForm();

  const [under, setUnder] = useState("individual");


    const router = useRouter();

  const onSubmit = (data) => {
     console.log(data)
     router.push(constant.ROUTES.MOTOR.PLANS)
  }


  return (
    <div className='container mx-auto px-4 py-6 '>
          <div className="text-center text-lg font-semibold mb-6">
      Motor insurance provides essential coverage against accidents.
      </div>
           
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <Image src="" alt="Car" width={400} height={300} className="rounded shadow" />
        </div>

    <div>
      <form  onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div>
              <label className="block font-medium mb-2">Bike Register Under</label>
              <div className="flex gap-4">
                {['individual', 'company'].map((type) => (
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
              {errors.under && <span className="text-red-600 text-sm">Please select one</span>}
            </div>

          <div>
              <label className="block font-medium mb-1">Manufacture</label>
              <DropdownWithSearch
                id="brandsDropdown"
                name="brand"
           
                placeholder="Select or type brand"
              />
              {errors.brand && <span className="text-red-600 text-sm">Brand is required</span>}
            </div>

        <div>
              <label className="block font-medium mb-1">Model & Variant</label>
              <DropdownWithSearch
                id="modelsDropdown"
                name="model"
              
                placeholder="Select or type Model"
              />
              {errors.model && <span className="text-red-600 text-sm">Model is required</span>}
            </div>

              <div>
                <label className="block font-medium mb-1">Year Of Manufacture</label>
                <select 
                // {...register("brandyear", { required: true })} 
                className="w-full border rounded px-3 py-2">
                  <option value="">Select Year</option>
                  {/* {manufactYearOpt().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))} */}
                </select>
                {/* {errors.brandyear && <span className="text-red-600 text-sm">Year is required</span>} */}
              </div>


                  <div className="flex flex-wrap gap-3 justify-start">
              <button
                type="button"
                onClick={() => router.push(constant.ROUTES.MOTOR.SELECTVEHICLE)}
                className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
                   
              >
                Continue
              </button>
            </div>
      </form>
      </div>    
    </div>

    </div>
  )
}

export default NewBike