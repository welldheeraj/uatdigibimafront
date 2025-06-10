import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-blue-900 text-white text-xs sm:text-sm px-2 sm:px-4 py-2">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <EmailIcon fontSize="small" />
            <span>info@digibima.com</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon fontSize="small" />
            <span>+91 9119 173 733</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full bg-white px-4 py-3 shadow border-b">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="https://test.digibima.com/public/front/images/logo.png"
              alt="Logo"
              className="h-[35px] w-auto"
            />
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow text-sm hover:bg-gray-200 transition"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <AccountCircleIcon className="text-gray-500" />
              <span className="hidden sm:inline">Hi, </span>
              {isDropdownOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow rounded w-48 z-50">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Profile
                </a>
                <hr />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
