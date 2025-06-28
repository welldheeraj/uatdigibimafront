import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import constant from "../../../../env";
export default function KnowCarStepTwo() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [ownershipToggle, setOwnershipToggle] = useState(false);
  const [policyToggle, setPolicyToggle] = useState(false);
  const bonusValue = watch("bonus");
  const router = useRouter();

  const handleOwnershipToggle = () => {
    setOwnershipToggle((prev) => {
      const newValue = !prev;
      setValue("ownershiptoggle_hidden", newValue ? "1" : "0");
      return newValue;
    });
  };

  const handlePolicyToggle = () => {
    setPolicyToggle((prev) => !prev);
  };
  const prePolicyType = watch("prepolitype");
  // console.log("Policy Type:", prePolicyType);
  console.log(ownershipToggle, policyToggle);


  const onSubmit = () => {
    // console.log("Form submitted:", data);
    // You can POST to your API here

   router.push(constant.ROUTES.MOTOR.PLANS); 
  };



  return (
    <div className="container mx-auto px-4 py-6">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Policy Type Selection */}
          <div>
            <label htmlFor="prepolitype" className="block font-medium mb-2">
              Select your previous policy type
            </label>
            <select
              id="prepolitype"
              {...register("prepolitype", { required: true })}
              //onChange={togglePrexpdateSection}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Policy</option>
              <option value="bundled">Bundled (1 Year OD + 3 Years TP)</option>
              <option value="comprehensive">
                Comprehensive (1 Year OD + 1 Year TP)
              </option>
              <option value="odonly">OD Only</option>
              <option value="tponly">TP Only</option>
            </select>
            {errors.prepolitype && (
              <span className="text-red-600 text-sm">
                Please select a policy type
              </span>
            )}
          </div>

          {/* Bundled Policy Dates */}
          {prePolicyType === "bundled" && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("bdfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.bdfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("bdtodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.bdtodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm font-semibold pt-2">
                Third Party Policy Dates
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("bdtpfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.bdtpfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("bdtptodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.bdtptodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {prePolicyType === "comprehensive" && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("compfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.compfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("comptodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.comptodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {prePolicyType === "odonly" && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("odfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.odfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("odtodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.odtodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm font-semibold pt-2">
                Third Party Policy Dates
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("odtpfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.odtpfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("odtptodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.odtptodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {prePolicyType === "tponly" && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("tpfromdate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.compfromdate && (
                    <span className="text-red-600 text-sm">
                      From Date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("tptodate", { required: true })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.comptodate && (
                    <span className="text-red-600 text-sm">
                      To Date is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="w-full mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ownership Toggle */}
              <div>
                <label className="block font-medium mb-1">
                  Was there any ownership transfer in the previous year?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={ownershipToggle}
                    onChange={() => {
                      setOwnershipToggle(!ownershipToggle);
                      setValue(
                        "ownershiptransfer",
                        !ownershipToggle ? "1" : "0"
                      );
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <input type="hidden" {...register("ownershiptransfer")} />
              </div>

              {/* Policy Claim Toggle */}
              <div>
                <label className="block font-medium mb-1">
                  Did you make a claim in yourprevious policy period?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={policyToggle}
                    onChange={() => {
                      setPolicyToggle(!policyToggle);
                      setValue("policyclaim", !policyToggle ? "1" : "0");
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <input type="hidden" {...register("policyclaim")} />
              </div>
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  How much was the No Claim Bonus in the previous policy?
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-3">
                  {["0", "20", "25", "35", "45", "50"].map((value) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        value={value}
                        {...register("bonus")}
                        className="hidden peer"
                      />
                      <div className="bonus-box peer-checked:ring-2 peer-checked:ring-blue-600 px-4 py-2 rounded border text-sm font-semibold text-center">
                        {value}%
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional: Display selected value */}
            {bonusValue && (
              <p className="mt-4 text-sm text-gray-600">
                Selected Bonus: {bonusValue}%
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 justify-start">
            <button
              type="button"
              onClick={() => router.push(constant.ROUTES.MOTOR.KnowCarSlide2)}
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
      </div>
    </div>
  );
}
