import Link from "next/link";
import { useState,useEffect} from "react";
import Lottie from "lottie-react";
import expiredpolicies from "@/animation/expiredpolicies.json";
import activeAnimation from "@/animation/apporved.json";
import totalAnimation from "@/animation/amount.json";
import totalpolicies from "@/animation/totalpolicies.json";
import { CallApi } from "@/api";
import constant from "@/env";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import {
  FaBell,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaRegCalendarAlt,
  FaFileInvoiceDollar,
  FaHeadset,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  healthImg,
  twowheelerImg,
  fourwheelerImg,
  commercialImg,
  travelImg,
} from "@/images/Image";
import { Code } from "@mui/icons-material";
export default function WelcomeBanner({
  collapsed,
  setCollapsed,
  openMenus,
  setOpenMenus,
}) {
   // Redirect if not user
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await CallApi(constant.API.USER.USERDASHBOARD, "GET");
        console.log("data", response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchdata();
  },[]);
  const { userData, token } = useUser();
  const [notifications] = useState([
    { id: 1, text: "Your health policy is expiring in 5 days", time: "2h ago" },
    { id: 2, text: "New offer: 10% discount on renewals", time: "1d ago" },
  ]);
  const [renewals] = useState([
    { id: 1, policy: "Health Insurance", expiry: "12 Aug 2025" },
    { id: 2, policy: "Car Insurance", expiry: "18 Aug 2025" },
  ]);

  const [feedback] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      rating: 4,
      comment: "Smooth process & fast claim!",
    },
    {
      id: 2,
      name: "Priya Verma",
      rating: 5,
      comment: "Very satisfied with the support team.",
    },
  ]);
  console.log(userData);
  const colors = [
    "from-[#D1C2F2] to-[#B09FE5] bg-gradient-to-br", // Lavender gradient
    "from-[#FECDD3] to-[#FDA4AF] bg-gradient-to-br", // Soft pink
    "from-[#FDE68A] to-[#FCD34D] bg-gradient-to-br", // Light yellow-orange
    "from-[#BFDBFE] to-[#93C5FD] bg-gradient-to-br", // Sky blue

    //  "from-[#C084FC] to-[#A855F7]",     // Total Policies – soft violet
    // "from-[#FCA5A5] to-[#F87171]",     // Active Policies – warm pink red
    // "from-[#FDBA74] to-[#FB923C]",     // Expired Policies – peachy orange
    // "from-[#FCA5A5] to-[#F43F5E]",     // Total Claims – rose red
  ];
  const categories = [
    { label: "Health", image: healthImg, redirectTo: "/health/common/insure" },
    {
      label: "Two Wheeler",
      image: twowheelerImg,
      redirectTo: "/motor/select-vehicle-type",
    },
    {
      label: "Four Wheeler",
      image: fourwheelerImg,
      redirectTo: "/motor/select-vehicle-type",
    },
    {
      label: "Commercial",
      image: commercialImg,
      redirectTo: "/motor/select-vehicle-type",
    },
    {
      label: "Travel",
      image: travelImg,
      redirectTo: "/motor/select-vehicle-type",
    },
  ];
  const cardTitles = [
    "Total Policies",
    "Active Policies",
    "Expired Policies",
    "Total Claims",
  ];
  const cardAnimations = [
    totalpolicies,
    activeAnimation,
    expiredpolicies,
    totalAnimation,
  ];

  const cardData = [
    {
      title: "Total Policies",
      value: "00",
      subText: "All Time",
      animation: totalpolicies,
      bg: "from-blue-100 via-indigo-200 to-indigo-300",
    },
    {
      title: "Active Policies",
      value: "00",
      subText: "Currently Active",
      animation: activeAnimation,
      bg: "from-green-100 via-emerald-200 to-teal-300",
    },
    {
      title: "Expired Policies",
      value: "00",
      subText: "No Longer Active",
      animation: expiredpolicies,
      bg: "from-red-100 via-rose-200 to-pink-300",
    },
    {
      title: "Total Claims",
      value: "00",
      subText: "Processed Claims",
      animation: totalAnimation,
      bg: "from-yellow-100 via-orange-200 to-amber-300",
    },
  ];

  // chart design Code
  const [view, setView] = useState("Monthly");

  const claimsData = [
    { month: "Jan", Approved: 800, Pending: 300 },
    { month: "Feb", Approved: 1100, Pending: 250 },
    { month: "Mar", Approved: 950, Pending: 400 },
    { month: "Apr", Approved: 1200, Pending: 350 },
    { month: "May", Approved: 1050, Pending: 500 },
    { month: "Jun", Approved: 1300, Pending: 450 },
    { month: "Jul", Approved: 1500, Pending: 600 },
    { month: "Aug", Approved: 1700, Pending: 550 },
    { month: "Sep", Approved: 1400, Pending: 500 },
    { month: "Oct", Approved: 1300, Pending: 480 },
    { month: "Nov", Approved: 1250, Pending: 520 },
    { month: "Dec", Approved: 1600, Pending: 400 },
  ];

  // Insurance Overview Data
  const insuranceData = [
    { name: "Total Premiums Collected", value: 500000, color: "#22c55e" },
    { name: "Claims Paid", value: 200000, color: "#3b82f6" },
    { name: "Pending Claim Amount", value: 50000, color: "#f97316" },
  ];
  return (
    <div className="w-full space-y-6">
      {/* Welcome Section */}
      <div
        className="relative bg-cover bg-center rounded-3xl overflow-hidden shadow-md p-4 sm:p-6 flex items-center min-h-[180px] sm:min-h-[220px] md:min-h-[250px]"
        style={{ backgroundImage: "url('/images/dashboard/imgone.jpg')" }}
      >
        <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 md:p-5 w-full max-w-xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">
            Hello {userData?.name || ""}...!
          </h1>
          <p className="text-sm sm:text-base text-gray-800 mt-2">
            Welcome to Digibima Insurance. Your trusted partner in securing your
            future.
          </p>
        </div>
      </div>

      {/*second type card design  Colored Cards Section */}
      {/* <div className="flex flex-wrap gap-4 justify-center md:justify-between">
        {cardTitles.map((title, index) => (
          <div
            key={index}
            className={`bg-white rounded-3xl p-[3px] shadow-md h-[160px] transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl
      w-full ${collapsed ? "sm:w-[280px]" : "sm:w-[240px]"}`}
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
      </div> */}
      {/* <div className="relative w-64 p-4 rounded-xl overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"></div>

        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white opacity-10"></div>

        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white opacity-5"></div>

        <div className="relative z-10">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              📈
            </div>
          </div>
          <p className="text-sm font-medium">Ventas totales</p>
          <h2 className="text-2xl font-bold">$2,500</h2>
        </div>
      </div> */}

      <div className="flex flex-wrap justify-center md:justify-between gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`relative w-60 h-52 rounded-3xl p-4 shadow-md text-black bg-gradient-to-br ${card.bg} overflow-hidden`}
          >
            {/* Background circles - match gradient tone */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.bg} opacity-40 mix-blend-overlay`}
            ></div>
            <div
              className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-br ${card.bg} opacity-40 mix-blend-overlay`}
            ></div>

            {/* Card content */}
            <div className="relative ">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">
                  {card.title.split(" ")[0]}
                  <br />
                  {card.title.split(" ")[1]}
                </p>
                <Lottie animationData={card.animation} className="w-20 h-18" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{card.value}</h2>
                <p className="text-sm text-gray-700 mt-1">{card.subText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-white via-blue-50 to-white p-6 rounded-3xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-full shadow-md">
            <FaBell size={18} />
          </div>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Notifications
          </span>
        </h3>

        <ul className="space-y-3 max-h-64  pr-1 ">
          {notifications.map((note) => (
            <li
              key={note.id}
              className="group p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                  {note.text}
                </p>
                <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-500 transition">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                  {note.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {/* Claims Overview */}
        <div className="md:col-span-2 bg-gradient-to-br from-white via-indigo-50 to-white p-6 rounded-3xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-500 text-white rounded-full shadow-md">
                <FaFileInvoiceDollar size={18} />
              </div>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                Claims Overview
              </span>
            </h3>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.05)",
                }}
              />
              <Legend />
              <Bar
                dataKey="Approved"
                stackId="a"
                fill="#93c5fd"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Pending"
                stackId="a"
                fill="#60a5fa"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insurance Overview */}
        <div className="bg-gradient-to-br from-white via-pink-50 to-white p-6 rounded-3xl shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-pink-200">
                <FaShieldAlt size={20} />
              </div>
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
                Insurance Overview
              </span>
            </h2>

            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="border border-pink-200 bg-white/60 backdrop-blur-md rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-pink-300 outline-none transition"
            >
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="w-full h-64 overflow-hidden">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.9} />
                  </linearGradient>
                </defs>

                <Pie
                  data={insuranceData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                  labelLine={false}
                >
                  {insuranceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "url(#grad1)" : "url(#grad2)"}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: "#555", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-green-500 font-bold text-xl">+13%</div>
          <ul className="mt-4 text-sm">
            {insuranceData.map((item, idx) => (
              <li key={idx}>
                <span
                  className="inline-block w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}: ${item.value.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-green-50 to-white p-6 rounded-3xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
          <div className="p-2 bg-green-500 text-white rounded-full shadow-md">
            <FaRegCalendarAlt size={18} />
          </div>
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
            Upcoming Renewals
          </span>
        </h3>
        <ul className="divide-y">
          {renewals.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>{item.policy}</span>
              <span className="text-gray-500">{item.expiry}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-full shadow-md">
            <FaHeadset size={18} />
          </div>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Support & Help
          </span>
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center bg-blue-50 p-4 rounded-xl hover:bg-blue-100">
            <FaPhoneAlt className="text-blue-500 text-2xl" />
            <span className="mt-2 text-sm">Call Us</span>
          </div>
          <div className="flex flex-col items-center bg-green-50 p-4 rounded-xl hover:bg-green-100">
            <FaEnvelope className="text-green-500 text-2xl" />
            <span className="mt-2 text-sm">Email Support</span>
          </div>
          <div className="flex flex-col items-center bg-purple-50 p-4 rounded-xl hover:bg-purple-100">
            <FaUser className="text-purple-500 text-2xl" />
            <span className="mt-2 text-sm">Live Chat</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
        {categories.map((item, index) => (
          <Link
            key={index}
            href={item.redirectTo || "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center space-y-2 cursor-pointer w-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-blue-100">
              <Image
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out hover:rotate-1"
                width={80}
                height={80}
                priority
              />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-800 text-center">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
