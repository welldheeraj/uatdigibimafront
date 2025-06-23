import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

const SlidePanel = ({
  isSlideOpen,
  setIsSlideOpen,
  pincode,
  memberName,
  setPincode,
  setMemberName,
}) => {
  const [showPincodePanel, setShowPincodePanel] = useState(false); // Local state for showing the Pincode panel
  const [showMemberPanel, setShowMemberPanel] = useState(false); // Local state for showing the Member panel

  return (
    <div className="md:col-span-3">
      <div className="bg-white border rounded-[30px] shadow-md p-4">
        <div className="text-base font-semibold text-[gray-800] mb-1">
          Members Covered
        </div>
        <div
          className="text-sm text-[#3ACC22] cursor-pointer underline hover:text-blue-800"
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
            <h2 className="text-2xl font-bold text-blue-900 mb-8">Edit Your Search</h2>

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
                    <p className="font-medium text-gray-800">{memberName}</p>
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
                {showPincodePanel ? "Change Pincode" : "Edit Insured Member"}
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
                    ? setPincode(e.target.value.replace(/\D/g, "")) // Only numbers for pincode
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
  );
};

export default SlidePanel;
