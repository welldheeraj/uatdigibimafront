import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import constant from "../../../../env";

export default function KnowCarSlideTwo() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [under, setUnder] = useState("individual");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const router = useRouter();

  const registerDate = watch("carregdate");

  const manufactYearOpt = () => {
    if (!registerDate) return [];
    const year = new Date(registerDate).getFullYear();
    return [year, year - 1];
  };
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    router.push(constant.ROUTES.MOTOR.KnowCarSlide3)
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

            {/* Manufacture */}
            <div>
              <label className="block font-medium mb-1">Manufacture</label>
              <input
                list="brand-options"
                {...register("brand", { required: true })}
                className="w-full border rounded px-3 py-2"
                placeholder="Select or type brand"
              />
              <datalist id="brand-options">
                {brands.map((brand, idx) => (
                  <option key={idx} value={brand} />
                ))}
              </datalist>

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
              />
              <datalist id="model-options">
                {models.map((model, idx) => (
                  <option key={idx} value={model} />
                ))}
              </datalist>

              {errors.model && (
                <span className="text-red-600 text-sm">Model is required</span>
              )}
            </div>

            {/* Register Date */}
            <div>
              <label className="block font-medium mb-1">Register Date</label>
              <input
                type="date"
                {...register("carregdate", { required: true })}
                className="w-full border rounded px-3 py-2"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}" // Optional: HTML5 pattern, not enforced by all browsers
                max={new Date().toISOString().split("T")[0]} // Prevent future date
              />
            </div>

            {/* Year of Manufacture */}
            {registerDate && (
              <div>
                <label className="block font-medium mb-1">
                  Year Of Manufacture
                </label>
                <select
                  {...register("brandyear")}
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
