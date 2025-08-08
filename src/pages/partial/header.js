"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";

import {
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaPhoneAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";
import { CallApi } from "../../api";
import constant from "../../env";
import { useRouter } from "next/router";
import { showSuccess } from "@/layouts/toaster";
import Link from "next/link";
import { logo } from "@/images/Image";

//setUsername={Username}
export default function Header({ token, username, setUsername }) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const router = useRouter();
  const route = router.pathname;
  const splitRoute = route.split("/").filter((segment) => segment !== "")[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = async () => {
    const response = await CallApi("/api/logout", "POST", "");
    if (response.status) {
      localStorage.removeItem("token");
      localStorage.removeItem("logintype");
      setUsername("");
      window.dispatchEvent(new Event("auth-change"));
      setIsDropdownOpen(false);
      showSuccess(response.message);
   
      if (response.status === true) {
        router.push("/");
      } else {
        window.dispatchEvent(new Event("auth-change"));
      }
    }
  };

  return (
    
    <header className="w-full bg-[#C8EDFE]">
       <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
         width="max-w-sm"
         height="max-h-[70vh]"
        title="Notifications"
        confirmText="Mark all read"
        onConfirm={() => {
          // custom logic on confirm
          console.log("Confirmed");
          setShowNotificationModal(false);
        }}
      >
        <p>You have 2 unread notifications.</p>
      </Modal>
      {/* Top Contact Bar */}
      <div className="w-full bg-gradient-to-r from-[#28A7E4] to-[#4C609A] text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-xs" />
          <span>info@digibima.com</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-xs" />
          <span>+91 9119 173 733</span>
        </div>
      </div>

      {/* Logo and Profile */}
      <div className="bg-white px-6 py-4 mx-4 flex justify-between items-center rounded-bl-[40px] rounded-br-[40px] shadow-sm border-b relative">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src={logo} alt="DigiBima Logo" className="h-[35px] w-auto" />
          </Link>
        </div>

        {/* Profile Button with Dropdown */}
        <div className="relative flex items-center gap-2">
          {/*  Notification Bell */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className="w-10 h-10 rounded-full bg-[#C2EBFE] flex items-center justify-center shadow relative"
          >
            <FaBell className="text-purple-600 text-lg" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center">
                2
              </span>
            </span>
          </button>

          {/* 👤 Profile Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#CF5DCD] px-4 py-2 rounded-full text-white"
            >
              <FaUserCircle className="text-lg" />
              <span>Hi, {username ? username : "Guest"}</span>
              {isDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/*  Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                <ul className="divide-y divide-gray-100 text-sm text-gray-700">
                  {!username && !token ? (
                    <li
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push(constant.ROUTES.INDEX);
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
                        <FaSignOutAlt className="text-red-400 w-4 h-4" />
                        Logout
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
