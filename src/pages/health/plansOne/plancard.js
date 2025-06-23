import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const PlanCard = ({ plan, handlePlanSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePlanSubmit(plan);
      }}
      className="bg-white rounded-[30px] border border-blue-100 shadow-md p-6 flex flex-col sm:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-6 w-full sm:w-3/4 flex-wrap sm:flex-nowrap">
        <div className="w-20 h-14 relative rounded-md bg-blue-50 flex items-center justify-center shadow-inner">
          {plan.logo ? (
            <Image
              src={`/images/health/vendorimage/${plan.logo}`}
              alt={plan.productname}
              width={80}
              height={40}
              className="object-contain"
            />
          ) : (
            <span className="text-xs text-blue-700 font-semibold">No Logo</span>
          )}
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold text-blue-900 mb-1 uppercase tracking-wide">
            {plan.productname}
          </h3>
          <div className="text-indigo-600 text-base text-sm cursor-pointer hover:underline">
            Addons & View Features
          </div>
        </div>
        <div className="flex flex-col items-center sm:ml-auto">
          <span className="text-xs text-gray-500 font-semibold">Cover</span>
          <span className="bg-gradient-to-r from-sky-100 to-sky-50 text-blue-800 font-semibold text-sm px-4 py-1.5 rounded-full shadow mt-1">
          {plan.coverage === 100 || plan.coverage === "100" ? "1 Cr" : `${plan.coverage} Lakh`}
        </span>

        </div>
      </div>

     <div className="text-right">
  <button
    type="submit"
    className="px-6 py-2 text-sm flex items-center justify-center  thmbtn"
  >
    <FaRupeeSign className="text-sm" />
    {Math.round(Number(plan.premium.replace(/,/g, "")) / 12).toLocaleString("en-IN")}{" "}
    / month
    <FiArrowRight />
  </button>

  <div className="text-sm flex items-center justify-center text-gray-500 mt-1 italic gap-2">
    <FaRupeeSign className="text-xs" />
    {plan.premium}/Year
  </div>
</div>
    </form>
  );
};

export default PlanCard;
