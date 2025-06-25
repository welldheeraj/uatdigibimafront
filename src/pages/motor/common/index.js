"use client";

import { useState, useEffect } from "react";
import { showSuccess, showError } from "../../../styles/js/toaster";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import constant from "../../../env";
import { CallApi } from "../../../api";
import { FaCar, FaMotorcycle, FaTractor } from "react-icons/fa6";

export default function VehicleSelect({ usersData }) {
  const [carnumber, setCarnumber] = useState();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle: "car",
      carOption: "knowcar",
      bikeOption: "knowbike",
      commercialOption: "knowcommercial",
    },
  });

  useEffect(() => {
    reset({
      vehicle: "car",
      carOption: "knowcar",
      bikeOption: "knowbike",
      commercialOption: "knowcommercial",
      mobile: usersData?.mobile,
      carRegNumber: carnumber
    });
  }, [usersData ,carnumber]);

  useEffect(() => {
    async function getSavedResponse() {
      try {
        const response = await CallApi(
          constant.API.MOTOR.CAR.SAVESTEPONE,
          "GET"
        );
        setCarnumber(response.data.carregnumber);
        console.log("Saved response", response);
        // if (response.data.carregnumber) {
        //   // setValue("carRegNumber", response.data.carregnumber);

        //   reset({
        //     carRegNumber: response.data.carregnumber,
        //   });
        // }
      } catch (error) {
        console.error(error);
      }
    }
    getSavedResponse();
  }, []);
  const router = useRouter();
  const selectedVehicle = watch("vehicle");
  const carOption = watch("carOption");
  const bikeOption = watch("bikeOption");
  const commercialOption = watch("commercialOption");

  const onSubmit = async (data) => {
    console.log("abc data", data);
    const selected = data.vehicle;
    console.log("Vaahan", selected);
    var payload = {
      carregnumber: data.carRegNumber,
    };
    // console.log('im pay',payload);
    // return ;
    if (selected === "car") {
      payload.carOption = data.carOption;
      if (data.carOption === "knowcar") {
        payload.carregnumber = data.carRegNumber;
      } else if (data.carOption === "newcar") {
        payload.carCity = data.carCity;
      }
    } else if (selected === "bike") {
      payload.bikeOption = data.bikeOption;

      if (data.bikeOption === "knowbike") {
        payload.bikeRegNumber = data.bikeRegNumber;
      } else if (data.bikeOption === "newbike") {
        payload.bikeCity = data.bikeCity;
      }
    } else if (selected === "commercial") {
      payload.commercialOption = data.commercialOption;

      if (data.commercialOption === "knowcommercial") {
        payload.commercialRegNumber = data.commercialRegNumber;
      } else if (data.commercialOption === "newcommercial") {
        payload.commercialCity = data.commercialCity;
      }
    }

    //console.log("Filtered Submit Payload:", payload);
    // router.push(constant.ROUTES.MOTOR.KnowCarSlide2); /

    try {
      const response = await CallApi(constant.API.MOTOR.VERIFYRTO, "POST", {
        carregnumber: data.carRegNumber,
      });
      var saveresponse;
      if (response) {
        saveresponse = await CallApi(
          constant.API.MOTOR.CAR.SAVESTEPONE,
          "POST",
          {
            carregnumber: data.carRegNumber,
          }
        );
        console.log(saveresponse);
      }
      if (saveresponse) {
        router.push(constant.ROUTES.MOTOR.KnowCarSlide2);
      }
      showSuccess("Detail verified");
      // router.push({
      //   pathname: "/constant.ROUTES.MOTOR.KnowCarSlide2",
      //   state: { vehicle: selected },
      // });
    } catch (error) {
      console.error("Error", error);
      showError("Error");
    }
  };

  return (
    <div>
      <div className=" ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 md:p-8 bg-[#F0FAFC] rounded-md shadow-md space-y-6"
        >
          <p className="text-[#2F4A7E] text-base md:text-3xl font-semibold  text-center">
            Motor insurance provides essential coverage against accidents.
          </p>

          <div className="flex flex-col md:flex-row">
            {/* image section */}
            <div className="w-1/2 mb-6 flex justify-center ">
              <div className="w-32 h-20 bg-gray-100 flex items-center justify-center rounded">
                <img src="#" alt="Vehicle" className="object-contain h-full" />
              </div>
            </div>

            {/* form section */}

            <div className="w-1/2 flex items-center justify-center">
              <div>
                {/* Vehicle Selection */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {["car", "bike", "commercial"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("vehicle")}
                        className="hidden peer"
                      />
                      <div className="bg-gradient-to-r from-[#28A7E4] to-[#426D98] text-white vehicle-box peer-checked:ring-2 peer-checked:ring-blue-500 px-4 py-2 rounded border">
                        {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                        {type === "car" && <FaCar className="inline ml-2" />}
                        {type === "bike" && (
                          <FaMotorcycle className="inline ml-2" />
                        )}
                        {type === "commercial" && (
                          <FaTractor className="inline ml-2" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* CAR FORM */}
                {selectedVehicle === "car" && (
                  <div className="space-y-4 ">
                    <div className="flex gap-4">
                      <label>
                        <input
                          type="radio"
                          value="knowcar"
                          {...register("carOption")}
                        />
                        Know Car No.
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="newcar"
                          {...register("carOption")}
                        />
                        New Car
                      </label>
                    </div>

                    {carOption === "knowcar" && (
                      <>
                        <div className="flex  gap-4 ">
                          <div className="flex flex-col">
                            <label>Car Registration Number</label>
                            <input
                              type="text"
                              placeholder="Enter Car Registration Number"
                              {...register("carRegNumber", {
                                required:
                                  carOption === "knowcar"
                                    ? "Car Registration Number is required"
                                    : false,
                                pattern: {
                                  value: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                                  message: "Invalid car registration number",
                                },
                              })}
                              className="w-full border rounded p-2"
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .toUpperCase()
                                  .slice(0, 10);
                              }}
                            />
                            {errors.carRegNumber && (
                              <p className="text-red-500 text-sm">
                                {errors.carRegNumber.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="number"
                              // readOnly
                              // disabled
                              {...register("mobile", {
                                required:
                                  carOption === "knowcar"
                                    ? "Mobile Number is required"
                                    : false,
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Invalid Mobile Number",
                                },
                              })}
                              className="w-full border rounded p-2"
                            />
                            {errors.mobile && (
                              <p className="text-red-500 text-sm">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {carOption === "newcar" && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label>City Name</label>
                            <input
                              type="text"
                              placeholder="Enter City Name"
                              {...register("carCity", {
                                required:
                                  carOption === "newcar"
                                    ? "City name is required"
                                    : false,
                              })}
                              className="w-[full] border rounded p-2"
                            />
                            {errors.carCity && (
                              <p className="text-red-500 text-sm">
                                {errors.carCity.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="number"
                              readOnly
                              //disabled
                              {...register("mobile", {
                                required:
                                  carOption === "newcar"
                                    ? "Mobile number is required"
                                    : false,
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Invalid Mobile Number",
                                },
                              })}
                              className="w-full border rounded p-2"
                            />
                            {errors.mobile && (
                              <p className="text-red-500 text-sm">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* BIKE FORM */}
                {selectedVehicle === "bike" && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <label>
                        <input
                          type="radio"
                          value="knowbike"
                          {...register("bikeOption")}
                        />
                        Know Bike No.
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="newbike"
                          {...register("bikeOption")}
                        />
                        New Bike
                      </label>
                    </div>

                    {bikeOption === "knowbike" && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label>Bike Registration Number</label>
                            <input
                              type="text"
                              placeholder="Enter Bike Registration Number"
                              {...register("bikeRegNumber", {
                                pattern: {
                                  value: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                                  message: "Invalid bike registration number",
                                },
                              })}
                              className="w-full border rounded p-2"
                            />
                            {errors.bikeRegNumber && (
                              <p className="text-red-500 text-sm">
                                {errors.bikeRegNumber.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="text"
                              // value={mobile}
                              // readOnly
                              // disabled
                              {...register("mobile", {
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Invalid Mobile Number",
                                },
                              })}
                              className="w-full border rounded p-2"
                            />
                            {errors.mobile && (
                              <p className="text-red-500 text-sm">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {bikeOption === "newbike" && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label>City Name</label>
                            <input
                              type="text"
                              placeholder="Enter City Name"
                              {...register("bikeCity")}
                              className="w-full border rounded p-2"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="text"
                              // value={mobile}
                              // readOnly
                              // disabled
                              {...register("mobile", {
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Invalid Mobile Number",
                                },
                              })}
                              className="w-full border rounded p-2"
                            />
                            {errors.mobile && (
                              <p className="text-red-500 text-sm">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* COMMERCIAL FORM */}
                {selectedVehicle === "commercial" && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <label>
                        <input
                          type="radio"
                          value="knowcommercial"
                          {...register("commercialOption")}
                        />
                        Know Commercial No.
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="newcommercial"
                          {...register("commercialOption")}
                        />
                        New Commercial
                      </label>
                    </div>

                    {commercialOption === "knowcommercial" && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label>Registration Number</label>
                            <input
                              type="text"
                              placeholder="Enter Commercial Reg. Number"
                              {...register("commercialRegNumber")}
                              className="w-full border rounded p-2"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="text"
                              // value={mobile}
                              // readOnly
                              // disabled
                              {...register("mobile")}
                              className="w-full border rounded p-2"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {commercialOption === "newcommercial" && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label>City Name</label>
                            <input
                              type="text"
                              placeholder="Enter City Name"
                              {...register("commercialCity")}
                              className="w-full border rounded p-2"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label>Mobile Number</label>
                            <input
                              type="text"
                              // value={mobile}
                              // readOnly
                              // disabled
                              {...register("mobile")}
                              className="w-full border rounded p-2"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-start mt-2">
                  <button
                    type="button"
                    onClick={() => router.push(constant.ROUTES.MOTOR.INDEX)}
                    className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    style={{
                      background:
                        "linear-gradient(to bottom, #426D98, #28A7E4)",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    style={{
                      background:
                        "linear-gradient(to bottom, #426D98, #28A7E4)",
                    }}
                  >
                    Continue
                  </button>
                </div>

                {/* Footer Text */}
                <p className="mt-4 text-lg">
                  Already bought a policy from DigiBima?{" "}
                  <a href="#" className="text-blue-600 underline">
                    Renew Now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
