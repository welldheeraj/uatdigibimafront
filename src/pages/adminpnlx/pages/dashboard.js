import Link from 'next/link';
import Lottie from "lottie-react";
import expiredpolicies from "@/animation/expiredpolicies.json";
import activeAnimation from "@/animation/apporved.json";
import totalAnimation from "@/animation/amount.json";
import totalpolicies from "@/animation/totalpolicies.json";
import Image from 'next/image';
import { healthImg,twowheelerImg,fourwheelerImg,commercialImg,travelImg } from "@/images/Image";
export default function WelcomeBanner({
  collapsed,
  setCollapsed,
  openMenus,
  setOpenMenus,
 admindata
}) {
  console.log(admindata)
  const colors = [
    "from-[#E9D5FF] to-[#C4B5FD]", // Lavender gradient
    "from-[#FECDD3] to-[#FDA4AF]", // Soft pink
    "from-[#FDE68A] to-[#FCD34D]", // Light yellow-orange
    "from-[#BFDBFE] to-[#93C5FD]", // Sky blue

    //  "from-[#C084FC] to-[#A855F7]",     // Total Policies – soft violet
    // "from-[#FCA5A5] to-[#F87171]",     // Active Policies – warm pink red
    // "from-[#FDBA74] to-[#FB923C]",     // Expired Policies – peachy orange
    // "from-[#FCA5A5] to-[#F43F5E]",     // Total Claims – rose red
  ];

 const categories = [
  { label: "Health", image: healthImg, redirectTo: "/health/common/insure" },
  { label: "Two Wheeler", image: twowheelerImg, redirectTo: "/motor/select-vehicle-type" },
  { label: "Four Wheeler", image: fourwheelerImg, redirectTo: "/motor/select-vehicle-type" },
  { label: "Commercial", image: commercialImg, redirectTo: "/motor/select-vehicle-type" },
  { label: "Travel", image: travelImg, redirectTo: "/motor/select-vehicle-type" },
];
  const cardTitles = [
  `Total Policies ${admindata?.policyCount ?? '--'}`,
  `Active Policies ${admindata?.activepolicies ?? '--'}`,
  `Expired Policies ${admindata?.expiredpolicies ?? '--'}`,
  `Total Claims ${admindata?.totalClaims ?? '--'}`,
];
  const cardAnimations = [
    totalpolicies,
    activeAnimation,
    expiredpolicies,
    totalAnimation,
  ];
  
  return (
  <div className="w-full space-y-6">
  {/* Welcome Section */}
  <div
    className="relative bg-cover bg-center rounded-3xl overflow-hidden shadow-md p-6 flex items-center min-h-[200px] sm:min-h-[250px] md:min-h-[220px]"
    style={{ backgroundImage: "url('/images/dashboard/imgone.jpg')" }}
  >
    <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-3 min-w-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
        Hello {admindata?.admin ? admindata.admin : "Guest"}...!
      </h1>
      <p className="text-gray-800 mt-2">
        Welcome to Digibima Insurance. Your trusted partner in securing your
        future.
      </p>
    </div>
  </div>

  {/* Colored Cards Section */}
  <div className="flex flex-wrap gap-4 justify-center md:justify-between">
    {cardTitles.map((title, index) => (
      <div
        key={index}
        className={`bg-white rounded-3xl p-[3px] shadow-md h-[160px] transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl w-full ${collapsed ? "sm:w-[280px]" : "sm:w-[240px]"} sm:w-full md:w-[230px]`}
      >
        <div
          className={`bg-gradient-to-tr ${colors[index]} rounded-3xl h-full w-full flex flex-col justify-center items-center`}
        >
          <Lottie
            animationData={cardAnimations[index]}
            loop
            className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 mb-2"
          />
          <div className="text-white font-semibold text-lg">{title}</div>
        </div>
      </div>
    ))}
  </div>

  {/* Categories Section */}
  <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
    {categories.map((item, index) => (
      <Link
        key={index}
        href={item.redirectTo || "/"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center space-y-2 cursor-pointer"
      >
        <div className="w-20 h-20 md:w-18 md:h-18 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-blue-100">
          <Image
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out hover:rotate-1"
            width={80}
            height={80}
            priority
          />
        </div>

        <div className="text-sm font-semibold text-gray-800 text-center">
          {item.label}
        </div>
      </Link>
    ))}
  </div>
</div>

  );
}
