import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { CallApi } from "../../api";
import constant from "../../env";

export default function HealthPlan() {
  const [vendorData, setVendorData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [plansData, setPlansData] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showPincodePanel, setShowPincodePanel] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [pincode, setPincode] = useState("110065");
  const [memberName, setMemberName] = useState("Gfggf");
  const [coveragelist, setCoveragelist] = useState([]);
  const [tenurelist, setTenurelist] = useState([]);
  const [selectcoverage, setSelectcoverage] = useState('');
const [selecttenure, setSelecttenure] = useState('');
  

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    CallApi(constant.API.HEALTH.PLANDATA)
      .then((res) => {
        console.log(res);
        setCoveragelist(res.coveragelist || []);
        setTenurelist(res.tenurelist || []);
        setVendorData(res.vendor || []);
        setSelectcoverage(res.coverage || []);
        setSelecttenure(res.tenure || []);
        setIsDataLoaded(true);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isDataLoaded || vendorData.length === 0) return;

    (async () => {
      const temp = await Promise.all(
        vendorData.map(async (vendor) => {
          try {
            const res = await CallApi(
              constant.API.HEALTH.GETQUOTE,
              "POST",
              vendor
            );
            return res.status && res.data ? res.data : null;
          } catch {
            return null;
          }
        })
      );
      const filtered = temp.filter(Boolean);
      setPlansData(filtered);
      setLoadingPlans(false);
    })();
  }, [vendorData, isDataLoaded]);

const filterData = useMemo(() => [
  {
    label: "Plan Type",
    name: "planType",
    options: ["Select", "Base", "Top-up"],
    value: "",
  },
  {
    label: "Coverage",
    name: "coverage",
    options: [
      "Select",
      ...coveragelist.map((val) => (val === 100 ? "1 Cr" : `${val} Lac`)),
    ],
    value: selectcoverage
      ? selectcoverage === 100
        ? "1 Cr"
        : `${selectcoverage} Lac`
      : "",
  },
  {
    label: "Insurers",
    name: "insurers",
    options: ["Select", "TATA AIG", "Care"],
    value: "",
  },
  {
    label: "Features",
    name: "features",
    options: ["Select", "OPD", "Daycare"],
    value: "",
  },
  {
    label: "Tenure",
    name: "tenure",
    options: ["Select", ...tenurelist.map((val) => `${val} Year`)],
    value: selecttenure ? `${selecttenure} Year` : "",
  },
], [coveragelist, tenurelist, selectcoverage, selecttenure]);


  useEffect(() => {
    const defaultVals = {};
    filterData.forEach((item) => {
      defaultVals[item.name] = item.value || "";
    });
    reset(defaultVals);
  }, [filterData, reset]);

  
 const onSubmit = async (data) => {
  const formattedData = {
    // ...data,
    coverage: data.coverage?.includes('Cr')? '1' : data.coverage?.replace(' Lac', ''),
    tenure: data.tenure?.replace(' Year', ''),
  };

  console.log("Filter Form Data:", formattedData);

  try {
    const res = await CallApi(constant.API.HEALTH.FILTERPLAN, "POST", formattedData);
    console.log("FILTERPLAN response:", res);

    if (res.status ) {
       console.log("status", res.status);
       window.location.reload();
      


    } else {
      // setPlansData([]);
      console.warn("FILTERPLAN returned no results.");
    }

  } catch (err) {
    console.error("Error during filtered quote fetch:", err);
    // setPlansData([]);
  }
};


  const handlePlanSubmit = (plan) => {
    console.log("Plan Submitted:", plan);
    router.push("/health/checkout");
  };
  return (
    <div className="bg-[#C8EDFE] min-h-screen px-4 sm:px-10 lg:px-20 py-6">
      <button
        type="button"
        onClick={() => router.push("/health/illness")}
        className="inline-block text-indigo-700 font-medium mb-4 hover:underline"
      >
        &larr; Go back to Previous
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap items-center gap-3 text-sm mb-8"
      >
        {filterData.map((item, i) => {
          const isDisabled = ["planType", "insurers", "features"].includes(
            item.name
          );

          return (
            <div
              key={i}
              className={`flex items-center rounded-full bg-white px-3 py-1.4 border ${
                isDisabled
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : "border-gray-400"
              } shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <span className="text-indigo-600 font-medium pr-2">
                {item.label}
              </span>
              <select
                {...register(item.name)}
                disabled={isDisabled}
                className={`bg-white text-gray-800 font-medium text-sm px-2 py-1 rounded-md focus:outline-none transition ${
                  isDisabled ? "bg-gray-100 text-gray-500" : "cursor-pointer"
                }`}
              >
                {item.options.map((opt, idx) => (
                  <option key={idx} value={opt} disabled={opt === "Select"}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <button type="submit" className="px-6 py-1 thmbtn">
          Apply
        </button>
      </form>

      <style jsx>{`
        .animated-background {
          position: relative;
          overflow: hidden;
          background-color: #f0f0f0;
          border-radius: 1rem;
          height: 100px;
          width: 100%;
        }

        .animated-background::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: shimmer 1.6s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6 pr-6">
          {loadingPlans ? (
            <div className="animated-background" />
          ) : Array.isArray(plansData) && plansData.length > 0 ? (
            plansData.map((plan, i) => (
              <form
                key={i}
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
                      <span className="text-xs text-blue-700 font-semibold">
                        No Logo
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-blue-900 mb-1 uppercase tracking-wide">
                      {plan.productname}
                    </h3>
                    <div className="text-indigo-600 text-base font-medium cursor-pointer hover:underline">
                      Addons & View Features
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:ml-auto">
                    <span className="text-xs text-gray-500 font-semibold">
                      Cover
                    </span>
                    <span className="bg-gradient-to-r from-sky-100 to-sky-50 text-blue-800 font-semibold text-sm px-4 py-1.5 rounded-full shadow mt-1">
                      {plan.coverage} {plan.coverage === 100 ? "Cr" : "Lakh"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="px-8 py-2 flex items-center justify-center thmbtn"
                  >
                    <FaRupeeSign className=" text-xs" />
                    {Math.round(
                      Number(plan.premium.replace(/,/g, "")) / 12
                    ).toLocaleString("en-IN")}{" "}
                    / month <FiArrowRight />
                  </button>
                  <div className="text-base flex items-center justify-center text-gray-500 mt-1 italic">
                    <FaRupeeSign className=" text-xs" />
                    {plan.premium}/Year
                  </div>
                </div>
              </form>
            ))
          ) : (
            <div>No plans available</div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="md:col-span-3">
          <div className="bg-white border rounded-[30px] shadow-md p-4">
            <div className="text-xl font-semibold text-[gray-800] mb-1">
              Members Covered
            </div>
            <div
              className="text-base text-[#3ACC22] cursor-pointer underline hover:text-blue-800"
              onClick={() => setIsSlideOpen(true)}
            >
              Edit Members
            </div>
          </div>

          {/* Main Slide Panel */}
          {isSlideOpen && !showPincodePanel && !showMemberPanel && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-end">
              <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 relative rounded-l-xl transition-transform duration-300">
                <button
                  onClick={() => setIsSlideOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                  <CloseIcon fontSize="medium" />
                </button>
                <h2 className="text-2xl font-bold text-blue-900 mb-8">
                  Edit Your Search
                </h2>

                <div className="divide-y divide-gray-200">
                  {/* Row – Insured Members */}
                  <div
                    className="flex items-center justify-between py-4 cursor-pointer"
                    onClick={() => setShowMemberPanel(true)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <PersonIcon className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Insured Members</p>
                        <p className="font-medium text-gray-800">
                          {memberName}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className="text-gray-400" />
                  </div>

                  {/* Row – Pincode */}
                  <div
                    className="flex items-center justify-between py-4 cursor-pointer"
                    onClick={() => setShowPincodePanel(true)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <LocationOnIcon className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pincode</p>
                        <p className="font-medium text-gray-800">{pincode}</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panels: Change Pincode and Edit Member Name */}
          {isSlideOpen && (showPincodePanel || showMemberPanel) && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-end">
              <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 relative rounded-l-xl transition-transform duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      if (showPincodePanel) {
                        setShowPincodePanel(false);
                      } else if (showMemberPanel) {
                        setShowMemberPanel(false);
                      }
                    }}
                    className="text-blue-800"
                  >
                    <ArrowBackIcon />
                  </button>

                  <h2 className="text-lg font-semibold text-blue-900">
                    {showPincodePanel
                      ? "Change Pincode"
                      : "Edit Insured Member"}
                  </h2>

                  <button
                    onClick={() => setIsSlideOpen(false)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Input Field */}
                <div className="mb-8">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {showPincodePanel ? "Enter Pincode" : "Member Name"}
                  </label>
                  <input
                    type="text"
                    value={showPincodePanel ? pincode : memberName}
                    onChange={(e) =>
                      showPincodePanel
                        ? setPincode(e.target.value.replace(/\D/g, ""))
                        : setMemberName(e.target.value)
                    }
                    className="w-full border rounded-md px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Continue */}
                <div className="mt-auto">
                  <button
                    onClick={() => {
                      setShowPincodePanel(false);
                      setShowMemberPanel(false);
                      setIsSlideOpen(false);
                    }}
                    className="w-full px-6 py-2 thmbtn"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
