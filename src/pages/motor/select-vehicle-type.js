"use client";

import { useState, useEffect, useRef } from "react";
import { showSuccess, showError } from "../../layouts/toaster";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import constant from "../../env";
import { CallApi,isAuth } from "../../api";
import { FaCar, FaMotorcycle, FaTractor } from "react-icons/fa6";

export default function VehicleSelect({ usersData }) {
  const [carnumber, setCarnumber] = useState();
  const [cities, setCities] = useState(null);
const cityRef = useRef(null);


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

  useEffect(()=>{
    async function getAuth()
    {
      const isauth=isAuth();
      if(!isauth)
      {
        router.replace(constant.ROUTES.INDEX);
      }
    }
    getAuth();
  },[]);
  useEffect(() => {
    reset({
      vehicle: "car",
      carOption: "knowcar",
      bikeOption: "knowbike",
      commercialOption: "knowcommercial",
      mobile: usersData?.mobile,
      carRegNumber: carnumber,
      carCity : cities,
    });
  }, [usersData, carnumber]);

  useEffect(() => {
    async function getSavedResponse() {
      try {
        const response = await CallApi(
          constant.API.MOTOR.CAR.SAVESTEPONE,
          "GET"
        );
        setCarnumber(response.data.carregnumber);
        console.log("Saved responseee", response);
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

  const getCities = async (value) => {
    try {
      const response = await CallApi(constant.API.MOTOR.GETCITY, "POST", {
        city: value,
      });

      console.log("Cities ka response", response);

      setCities(response);
    } catch (error) {
      console.error(error);
    }
  };

  // const onSubmit = async (data) => {
  //   console.log("abc data", data);
  //   const selected = data.vehicle;
  //   console.log("Vaahan", selected);
  //   var payload = {
  //     carregnumber: data.carRegNumber,
  //   };
  //   // console.log('im pay',payload);
  //   // return ;
  //   if (selected === "car") {
  //     payload.carOption = data.carOption;
  //     if (data.carOption === "knowcar") {
  //       payload.carregnumber = data.carRegNumber;
  //     } else if (data.carOption === "newcar") {
  //       payload.carCity = data.carCity;
  //     }
  //   } else if (selected === "bike") {
  //     payload.bikeOption = data.bikeOption;

  //     if (data.bikeOption === "knowbike") {
  //       payload.bikeRegNumber = data.bikeRegNumber;
  //     } else if (data.bikeOption === "newbike") {
  //       payload.bikeCity = data.bikeCity;
  //     }
  //   } else if (selected === "commercial") {
  //     payload.commercialOption = data.commercialOption;

  //     if (data.commercialOption === "knowcommercial") {
  //       payload.commercialRegNumber = data.commercialRegNumber;
  //     } else if (data.commercialOption === "newcommercial") {
  //       payload.commercialCity = data.commercialCity;
  //     }
  //   }

  //   //console.log("Filtered Submit Payload:", payload);
  //   // router.push(constant.ROUTES.MOTOR.KnowCarSlide2); /

  //   try {
  //     const response = await CallApi(constant.API.MOTOR.VERIFYRTO, "POST", {
  //       carregnumber: data.carRegNumber,
  //       // carCity : data.carCity
  //     });

  //     console.log("res of verifying" , response)
  //     var saveresponse;
  //     if (response) {
  //       saveresponse = await CallApi(
  //         constant.API.MOTOR.CAR.SAVESTEPONE,
  //         "POST",
  //         {
  //           carregnumber: data.carRegNumber,
  //           //  carCity : data.carCity
  //         }
  //       );
  //       console.log("saving after verifying",saveresponse);
  //     }
  //     if (saveresponse) {
  //       router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTWO);
  //     }
  //     showSuccess("Detail verified");
  //     // router.push({
  //     //   pathname: "/constant.ROUTES.MOTOR.KnowCarSlide2",
  //     //   state: { vehicle: selected },
  //     // });
  //   } catch (error) {
  //     console.error("Error", error);
  //     showError("Error");
  //   }
  // };


  const onSubmit = async (data) => {
    console.log("abc data", data);
    const selected = data.vehicle;
    console.log("Vaahan", selected);
    var payload = {
      carregnumber: data.carRegNumber,
    };
    console.log('im pay',payload);
    // return ;
    if (selected === "car") {
      payload.carOption = data.carOption;
      if (data.carOption === "knowcar") {
        payload.carregnumber = data.carRegNumber;

         try {
      const response = await CallApi(constant.API.MOTOR.VERIFYRTO, "POST", {
        carregnumber: data.carRegNumber,
      
      });
-     
      console.log("res of verifying RTO" , response)

     if(response.status === false){
        showError(response.message)
     }

    if(response.status === true){
      showSuccess("Detail verified");
    }

      var saveresponse;
      if (response.status === true) {
        saveresponse = await CallApi(
          constant.API.MOTOR.CAR.SAVESTEPONE,
          "POST",
          {
            carregnumber: data.carRegNumber,
           
          }
        );
        console.log("saving after verifying",saveresponse);
      }
      if (saveresponse) {
        router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTWO);
      }
      
      // router.push({
      //   pathname: "/constant.ROUTES.MOTOR.KnowCarSlide2",
      //   state: { vehicle: selected },
      // });
    } catch (error) {
      console.error("Error", error);
      showError("Error");
    }

      } else if (data.carOption === "newcar") {
        payload.carCity = data.carCity;
          router.push(constant.ROUTES.MOTOR.NEWCAR);
      }
    } else if (selected === "bike") {
      payload.bikeOption = data.bikeOption;

      if (data.bikeOption === "knowbike") {
        payload.bikeRegNumber = data.bikeRegNumber;

         router.push(constant.ROUTES.MOTOR.KNOWBIKESTEPTWO);
         
      } else if (data.bikeOption === "newbike") {
        payload.bikeCity = data.bikeCity;

         router.push(constant.ROUTES.MOTOR.NEWBIKE);
      }
    } else if (selected === "commercial") {
      payload.commercialOption = data.commercialOption;

      if (data.commercialOption === "knowcommercial") {
        payload.commercialRegNumber = data.commercialRegNumber;
      } else if (data.commercialOption === "newcommercial") {
        payload.commercialCity = data.commercialCity;
      }
    }



 
  };


useEffect(() => {
  function handleClickOutside(event) {
    if (cityRef.current && !cityRef.current.contains(event.target)) {
      setCities([]); 
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#C2EBFF] py-6 sm:py-10"
    >
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-6xl rounded-[64px] bg-white shadow-lg px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 gap-6 flex flex-col md:flex-row items-center">
          {/* Left Section (Form Content) */}

          {/* Right Section (Image) */}
          <div className="hidden md:flex flex-col md:items-start gap-1 mt-2 w-full md:w-2/5 p-2 md:p-6 justify-center">
          <img
            src="/images/health/health-One.png"
            alt="Home with Umbrella"
            className="max-w-[280px] sm:max-w-xs w-full object-contain"
          />
        </div>

          <div className="w-full md:w-3/5 p-2 md:p-6">
            <p className="text-[#2F4A7E] text-lg sm:text-xl md:text-2xl font-semibold text-center w-full mb-6">
              Motor insurance provides essential coverage against accidents.
            </p>
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
                    <div
                      className="px-4 py-2 rounded-full border 
                      bg-white text-black 
                      peer-checked:bg-gradient-to-r 
                      peer-checked:from-[#28A7E4] 
                      peer-checked:to-[#426D98] 
                      peer-checked:text-white 
                      transition-colors duration-200"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
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
                      <div className="flex flex-col md:flex-row gap-4 ">
                        <div className="flex flex-col">
                          <label className="labelcls ">
                            Car Registration Number
                          </label>
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
                            className="inputcls"
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

                        <div className="flex flex-col ">
                          <label className="labelcls">
                            Mobile Number
                          </label>
                          <input
                            type="text"
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
                            className="inputcls"
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
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex flex-col relative"  ref={cityRef}>
                            <label className="text-base md:text-base">
                              City Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter City Name"
                        
                              {...register("carCity", {
                                required:
                                  carOption === "newcar"
                                    ? "City name is required"
                                    : false,
                                onChange: (e) => getCities(e.target.value),
                              })}
                              className="w-full border rounded p-2 mt-1"
                            />
                            {errors.carCity && (
                              <p className="text-red-500 text-sm">
                                {errors.carCity.message}
                              </p>
                            )}

                            {cities?.length > 0 && (
                              <ul className="absolute top-full left-0 right-0 z-10 border rounded bg-white max-h-40 overflow-y-auto shadow-md mt-1">
                                {cities.map((city, idx) => (
                                  <li
                                    key={idx}
                                    onClick={() => {
                                      setValue("carCity", city);
                                      setCities([]);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    {city}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label className="text-base md:text-base">
                              Mobile Number
                            </label>
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
                              className="w-full border rounded p-2 mt-1"
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
                <div className="space-y-4 ">
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
                      <div className="flex flex-col md:flex-row gap-4 ">
                        <div className="flex flex-col">
                          <label className="labelcls">
                            Bike Registration Number
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Bike Registration Number"
                            {...register("bikeRegNumber", {
                              pattern: {
                                value: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                                message: "Invalid bike registration number",
                              },
                            })}
                            className="inputcls"
                          />
                          {errors.bikeRegNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.bikeRegNumber.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="labelcls">
                            Mobile Number
                          </label>
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
                            className="inputcls"
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
                      <div className="flex flex-col md:flex-row  gap-4">
                        <div className="flex flex-col">
                          <label className="labelcls">
                            City Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter City Name"
                            {...register("bikeCity")}
                            className="inputcls"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="labelcls">
                            Mobile Number
                          </label>
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
                            className="inputcls"
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
                <div className="space-y-4 ">
                  <div className="flex flex-col md:flex-row gap-4">
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
                  </div>

                  {commercialOption === "knowcommercial" && (
                    <>
                      <div className="flex flex-col md:flex-row gap-4 ">
                        <div className="flex flex-col gap-2">
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
                            <label>Vehicle Type</label>
                            <select
                              name="commercialVehicle"
                              id="comVehicle"
                              className="p-1"
                            >
                              <option>Vehicle Type</option>
                              <option value="">
                                Passenger Carrying Commercial Vehicle
                              </option>
                              <option value="">
                                Goods Carrying Commercial Vehicles
                              </option>
                            </select>
                          </div>
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

              <div className="flex flex-wrap gap-3 justify-start mt-4">
                <button
                  type="button"
                  onClick={() => router.push(constant.ROUTES.MOTOR.INDEX)}
                  className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  style={{
                    background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="px-6 py-2 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  style={{
                    background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                  }}
                >
                  Continue
                </button>
              </div>

              {/* Footer Text */}
              <p className="text-base text-black mt-1">
            Already bought a policy from DigiBima?{" "}
            <a href="#" className="text-green-600 font-bold underline">
              Renew Now
            </a>
          </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
