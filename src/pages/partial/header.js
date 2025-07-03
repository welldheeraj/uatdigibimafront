"use client";

import { useState, useEffect } from "react";
import { CallNextApi } from "../utils/helper";
import {
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaPhoneAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { CallApi } from "../../api";
import constant from "../../env";
import { useRouter } from "next/router";
import { showSuccess } from "@/layouts/toaster";

//setUsername={Username}
export default function Header({ token,username, setUsername }) {
  const router = useRouter();
  const route = router.pathname;
  const splitRoute = route.split("/").filter(segment => segment !== "")[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // useEffect(() => {
  //   console.log('uuuu', username);
  // }, [username])
  const logout = async () => {
    const response = await CallApi("/api/logout", "POST", "");
    if (response.status) {
      localStorage.removeItem("token");
      setUsername("");
      await CallNextApi("/api/deletesession");
      // console.log('deletesession', await res.json());
      window.dispatchEvent(new Event("auth-change"));
      setIsDropdownOpen(false);
      showSuccess(response.message);
      if ('/' + splitRoute === constant.ROUTES.HEALTH.INDEX) {
        router.push(constant.ROUTES.HEALTH.INDEX);
      }
      if ('/' + splitRoute === constant.ROUTES.USER.INDEX) {
        router.push('/');
      }
      if ('/' + splitRoute === constant.ROUTES.MOTOR.INDEX) {
        router.push(constant.ROUTES.MOTOR.INDEX);
      } else {
        window.dispatchEvent(new Event("auth-change"));
      }
    }
  };

  return (
    <header className="w-full bg-[#C8EDFE]">
      {/* Top Contact Bar */}
      <div className="w-full bg-gradient-to-r from-[#28A7E4] to-[#4C609A] text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-xs" />
          <span>info@digibima.com</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-xs" />
          <span>+91 9876543210</span>
        </div>
      </div>

      {/* Logo and Profile */}
      <div className="bg-white px-6 py-4 mx-4 flex justify-between items-center rounded-bl-[40px] rounded-br-[40px] shadow-sm border-b relative">
        <div className="flex items-center gap-2">
          <img
            src="https://test.digibima.com/public/front/images/logo.png"
            alt="DigiBima Logo"
            className="h-[35px] w-auto"
          />
        </div>

        {/* Profile Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2 rounded-full text-white"
          >
            <FaUserCircle className="text-lg" />
            <span>Hi,{username ? username : "Guest"}</span>
            {isDropdownOpen ? (
              <FaChevronUp className="text-sm" />
            ) : (
              <FaChevronDown className="text-sm" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
              <ul className="divide-y divide-gray-100 text-sm text-gray-700">
                {!username && !token ? (
                  <li
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push(constant.ROUTES.HEALTH.INDEX);
                    }}
                    className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                  >
                    <FaUser className="text-blue-400 w-4 h-4" />
                    Login
                  </li>
                ) : (
                  <>
                    <li
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push(constant.ROUTES.USER.PROFILE);
                      }}
                      className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                    >
                      <FaUser className="text-blue-400 w-4 h-4" />
                      Profile
                    </li>

                    <li
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}

                      className="px-5 py-3 hover:bg-red-50 hover:text-red-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                    >
                      <button className="flex items-center gap-2">
                        <FaSignOutAlt className="text-red-400 w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
