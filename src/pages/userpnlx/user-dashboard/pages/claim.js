"use client";
import { useForm } from "react-hook-form";

// Reusable Input component
export function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

const Claims = ({ collapsed }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("claims data", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <div
          className={`bg-white w-full ${
            collapsed ? "sm:w-5xl" : "sm:w-5xl"
          } p-8 rounded-[64px] shadow-lg`}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-[20px] md:text-[24px] font-bold mb-8 text-[#426D98] text-center md:text-left">
              Enter Below Details and Submit Your Claim Request
            </h2>

            <div className="w-full px-16">
              <div className="grid grid-cols-1 md:grid-cols-2 px-5 gap-6">
                <Input
                  label="Proposer Name"
                  name="proposer_name" // FIX: Avoid space in field name
                  placeholder="Enter Full Name"
                  register={register}
                />
                <Input
                  label="Mobile Number"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  register={register}
                />
                <Input
                  label="Email Id"
                  name="email"
                  placeholder="Enter Email Id"
                  register={register}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Insurance Policy
                  </label>
                  <select
                    {...register("insurancePolicy")}
                    defaultValue=""
                    className="inputcls"
                  >
                    <option value="" disabled>
                      Select Insurance Policy
                    </option>
                    <option value="Health">Health</option>
                    <option value="Vehicle">Vehicle</option>
                  </select>
                </div>

                <Input
                  label="Policy Number"
                  name="policy_number" // FIX: Avoid space in field name
                  placeholder="Enter Policy Number"
                  register={register}
                />
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="px-6 py-2 thmbtn">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Claims;
