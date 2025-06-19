import { useForm } from "react-hook-form";

export default function VehicleSelect() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle: "car",
      carOption: "knowcar",
      bikeOption: "knowbike",
      commercialOption: "knowcommercial",
    },
  });

  const selectedVehicle = watch("vehicle");
  const carOption = watch("carOption");
  const bikeOption = watch("bikeOption");
  //const commercialOption = watch("commercialOption");

  const mobile = "";

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 md:p-8 bg-white rounded-md shadow-md space-y-6"
    >
      <p className="text-base md:text-lg font-medium text-gray-700">
        Motor insurance provides essential coverage against accidents.
      </p>

      <div className="mb-6 flex justify-center">
        <div className="w-32 h-20 bg-gray-100 flex items-center justify-center rounded">
          <img src="#" alt="Vehicle" className="object-contain h-full" />
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="flex flex-wrap gap-4 justify-center">
        {["car", "bike", "commercial"].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={type}
              {...register("vehicle")}
              className="hidden peer"
            />
            <div className="vehicle-box peer-checked:ring-2 peer-checked:ring-blue-500 px-4 py-2 rounded border">
              {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
              <i
                className={`fa-solid ${
                  type === "car"
                    ? "fa-car"
                    : type === "bike"
                    ? "fa-motorcycle"
                    : "fa-tractor"
                } motoricon ml-2`}
              ></i>
            </div>
          </label>
        ))}
      </div>

      {/* CAR FORM */}
      {selectedVehicle === "car" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <label>
              <input type="radio" value="knowcar" {...register("carOption")} />
              Know Car No.
            </label>
            <label>
              <input type="radio" value="newcar" {...register("carOption")} />
              New Car
            </label>
          </div>

          {carOption === "knowcar" && (
            <>
              <input
                type="text"
                placeholder="Enter Car Registration Number"
                {...register("carRegNumber", {
                  pattern: {
                    value: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                    message: "Invalid car registration number",
                  },
                })}
                className="w-full border rounded p-2"
              />
              {errors.carRegNumber && (
                <p className="text-red-500 text-sm">
                  {errors.carRegNumber.message}
                </p>
              )}
              <input
                type="text"
                // value={mobile}
                //readOnly
                //disabled
                {...register("mobile", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid Mobile Number",
                  },
                })}
                className="w-full border rounded p-2"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </>
          )}

          {carOption === "newcar" && (
            <>
              <input
                type="text"
                placeholder="Enter City Name"
                {...register("carCity")}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                // value={mobile}
                //readOnly
                //disabled
                {...register("mobile", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid Mobile Number",
                  },
                })}
                className="w-full border rounded p-2"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
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
              <input type="radio" value="newbike" {...register("bikeOption")} />
              New Bike
            </label>
          </div>

          {bikeOption === "knowbike" && (
            <>
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
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </>
          )}

          {bikeOption === "newbike" && (
            <>
              <input
                type="text"
                placeholder="Enter City Name"
                {...register("bikeCity")}
                className="w-full border rounded p-2"
              />
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
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* COMMERCIAL FORM */}
      {/* {selectedVehicle === "commercial" && (
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
              <input
                type="text"
                placeholder="Enter Commercial Reg. Number"
                {...register("commercialRegNumber")}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                value={mobile}
                readOnly
                disabled
                {...register("mobile")}
                className="w-full border rounded p-2"
              />
            </>
          )}

          {commercialOption === "newcommercial" && (
            <>
              <input
                type="text"
                placeholder="Enter City Name"
                {...register("commercialCity")}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                value={mobile}
                readOnly
                disabled
                {...register("mobile")}
                className="w-full border rounded p-2"
              />
            </>
          )}
        </div>
      )} */}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
      >
        Submit
      </button>
    </form>
  );
}
