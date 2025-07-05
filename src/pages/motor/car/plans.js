"use client";

import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { parseCookies } from "nookies";
import { CallApi } from "@/api";
import constant from "@/env";
import { showError } from "@/layouts/toaster";
import { useRouter } from "next/router";

// import { CallNextApi } from "./utils/helper";
// export async function getdata() {
//   return "gghghgh"; // Returning a resolved string as a promise
// }

// export async function getServerSideProps(context) {
//   const cookies = parseCookies(context);
//   const encryptedToken = cookies.unused || null;

//   if (!encryptedToken) {
//     console.log("No token found in session");
//     return {
//       props: {
//         abc: null,
//       },
//     };
//   }

//   // Optional: decrypt token here if needed
//   const token = encryptedToken;

//   try {
//     const response = await fetch(
//       "https://stage.digibima.com/api/motor-car/plans",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`, // Or use "Bearer " + token if needed
//         },
//       }
//     );

//     const data = await response.json();

//     return {
//       props: {
//         abc: data,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching plans:", error);
//     return {
//       props: {
//         abc: null,
//       },
//     };
//   }
// }

export default function Plans() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [addonModalOpen, setIsAddonModalOpen] = useState(false);
  const [paModalOpen, setIsPaModalOpen] = useState(false);
  const [value, setValue] = useState(100);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [showIrdai, setShowIrdai] = useState(false);
  const [showPaCover, setShowPaCover] = useState(false);
  const [showAccessories, setShowAccessories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planTypes, setPlanTypes] = useState([]);
  const [plan, setPlan] = useState([]);
  const [addAddonModal, setAddAddonModal] = useState(false);
  const [addons, setAddons] = useState([]);
  const [selectedAddon, setSelectedAddon] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await CallApi(constant.API.MOTOR.CAR.PLANS, "GET");
        console.log("Saved response", res);
        const addonObj = res.data?.addons || {};
        const addonList = Object.entries(addonObj).map(([key, label]) => ({
          id: key,
          label: label.trim(),
          //hasTooltip: checkIfHasTooltip(label), // helper function
        }));
        setAddons(addonList);
        const plantypeObj = res.data?.plantype || {};
        const plantypeList = Object.entries(plantypeObj).map(
          ([key, label]) => ({
            id: key,
            label,
          })
        );
        setPlanTypes(plantypeList);
        const vendorArr = res.data?.vendor || [];
        setVendorList(vendorArr.filter((v) => v.isActive === "1"));
        // using plans state for addons now
        //setPlans(res.data);
      } catch (error) {
        console.error("Error loading saved step three data:", error);
      }
    }
    getDetails();
  }, []);

  const handleAddonChange = (id) => {
    setSelectedAddon((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSaveAddons = async () => {
    try {
      const payload = {
        selectedaddons: selectedAddon,
      };
      console.log("Sending to API:", payload);
      const res = await CallApi(
        constant.API.MOTOR.CAR.ADDADDONS,
        "POST",
        payload
      );
      console.log("Saved successfully:", res);
    } catch (error) {
      console.error("Failed to save addons:", error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const optOutBoxes = [
    "The car is registered in a company’s name.",
    "Not have eff. DL With Decl. Letter.",
    "Already CPA Policy Exists.",
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6">
      {/* Go Back */}
      <div className="mb-1">
        <button
          className="text-sm "
          onClick={() => router.push(constant.ROUTES.MOTOR.KNOWCARSTEPTHREE)}
        >
          ← Go back to Previous
        </button>
      </div>

      {/* Page Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 ">
        <div className="w-full w-full bg-white p-4 rounded-xl shadow-md ">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap ">
            {/* Plan Type */}
            <div className="flex flex-col">
              <label className="font-semibold">Plan Type</label>
              <select className="border rounded p-2 mt-1 w-40">
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PA Cover */}
            <div
              className="flex items-center space-x-3 mt-6 md:mt-8 bg-[#D8E0FF] p-3 rounded "
              onClick={() => setIsPaModalOpen(true)}
            >
              <input type="checkbox" id="pa-cover" className="w-4 h-4" />
              <label htmlFor="pa-cover" className="text-sm">
                PA Cover
              </label>
              <span className="text-gray-400 text-xs cursor-pointer">ℹ️</span>
            </div>

            <Modal open={paModalOpen} onClose={() => setIsPaModalOpen(false)}>
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full">
                  <div className="flex items-center justify-between ">
                    <h2 className="font-semibold text-lg">
                      Personal Accident (PA) Cover
                    </h2>

                    <button
                      className=" text-gray-700 py-2 px-4 text-3xl font-base rounded"
                      onClick={() => setIsPaModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="bg-white rounded-lg  mx-auto text-sm">
                    {/* IRDAI Notice */}
                    <div className="mb-4">
                      <button
                        className="text-blue-600 font-medium focus:outline-none flex items-center space-x-1"
                        onClick={() => setShowIrdai(!showIrdai)}
                      >
                        <span>IRDAI Notice</span>
                        {showIrdai ? (
                          <RiArrowDropDownLine className="text-4xl" />
                        ) : (
                          <RiArrowDropUpLine className="text-4xl" />
                        )}
                      </button>

                      {showIrdai && (
                        <p className="mt-2 text-gray-700">
                          As per the{" "}
                          <strong>
                            Insurance Regulatory and Development Authority of
                            India (IRDAI)
                          </strong>{" "}
                          notice,{" "}
                          <span className="text-red-600">
                            Personal Accident (PA) Cover is mandatory
                          </span>{" "}
                          if the car is owned by an individual who does not have
                          a{" "}
                          <span className="text-red-600">
                            Personal Accident cover of ₹15 Lakhs
                          </span>
                          . Please opt for 'Personal Accident (PA) Cover'.
                        </p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="mb-4 border-l-4 rounded border-red-500 pl-4">
                      <p className="font-semibold text-gray-800 mb-2">
                        You can opt out if...
                      </p>
                      {optOutBoxes.map((label, index) => (
                        <label key={index} className="block mb-1">
                          <input type="checkbox" className="mr-2" />
                          {label}
                        </label>
                      ))}
                    </div>

                    {/* PA Cover */}
                    <div>
                      <button
                        className="text-blue-600 font-medium focus:outline-none flex items-center space-x-1"
                        onClick={() => setShowPaCover(!showPaCover)}
                      >
                        What is PA Cover?{" "}
                        {showPaCover ? (
                          <RiArrowDropDownLine className="text-4xl" />
                        ) : (
                          <RiArrowDropUpLine className="text-4xl" />
                        )}
                      </button>

                      {showPaCover && (
                        <div className="mt-2 text-gray-700">
                          <p className="font-semibold text-black">
                            What is PA Cover?
                          </p>
                          <p className="mt-1">
                            This policy covers the owner for death or disability
                            due to an accident. The owner (in case of
                            disability) or the nominee (in case of death) will
                            receive ₹15 Lakhs.
                          </p>
                          <p className="mt-1">
                            Stay protected with the right insurance coverage.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <button
                      style={{
                        background:
                          "linear-gradient(to bottom, #426D98, #28A7E4)",
                      }}
                      className="text-white px-12 p-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Modal>

            {/* IDV */}
            <div className="flex items-center gap-2 mt-6 md:mt-8">
              <label className="font-semibold">IDV:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-24 focus:outline-blue-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 md:mt-8 ">
              <button
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
                className=" text-white px-4 py-2 rounded"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Update
              </button>
              <button
                style={{
                  background: "linear-gradient(to bottom, #426D98, #28A7E4)",
                }}
                className=" text-white px-4 py-2 rounded"
                onClick={() => setIsAddonModalOpen(true)}
              >
                Addons
              </button>

              <Modal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
              >
                <div className="fixed inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
                    <div className="flex flex-col gap-12 bg-white">
                      <div className="flex items-center justify-between ">
                        <h2 className="font-semibold text-lg">
                          Car insured value (IDV)
                        </h2>

                        <button
                          className=" text-gray-700 py-2 px-4 text-3xl font-base rounded"
                          onClick={() => setIsUpdateModalOpen(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div>
                        <div className="flex">
                          <h2 className="font-semibold">Your IDV:</h2>
                          <input
                            type="text"
                            className="border border-blue-600 ml-4 pl-2 p-1"
                            value={value}
                          />
                        </div>
                        <input
                          id="slider"
                          type="range"
                          min="100"
                          max="1000"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer mt-4 bg-gradient-to-r from-blue-600 to-violet-300`}
                        />

                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>100</span>
                          <span>1000</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center ">
                        <button
                          style={{
                            background:
                              "linear-gradient(to bottom, #426D98, #28A7E4)",
                          }}
                          className="text-white w-full p-1 rounded"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

              <Modal
                open={addonModalOpen}
                onClose={() => setIsAddonModalOpen(false)}
              >
                <div className="fixed inset-0 flex items-center justify-center ">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] max-w-full">
                    <div className="flex items-center justify-between ">
                      <h2 className="font-semibold text-lg">Add Addons</h2>

                      <button
                        className=" text-gray-700 py-2 px-4 text-3xl font-base rounded"
                        onClick={() => setIsAddonModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>

                    <div>
                      <div className="w-full  mx-auto mt-1">
                        {/* Tabs */}
                        <div className="flex border-b">
                          <button
                            className={`px-4 py-2 focus:outline-none  ${
                              activeTab === "Tab1"
                                ? "border-b-2 border-blue-500 text-blue-600 "
                                : "text-blue-400"
                            }`}
                            onClick={() => setActiveTab("Tab1")}
                          >
                            Addons
                          </button>
                          <button
                            className={`px-4 py-2 focus:outline-none ${
                              activeTab === "Tab2"
                                ? "border-b-2 border-blue-500 text-blue-600 "
                                : "text-blue-400"
                            }`}
                            onClick={() => setActiveTab("Tab2")}
                          >
                            Accessories
                          </button>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                          {activeTab === "Tab1" && (
                            <div className="p-2">
                              <p className="mb-4 text-gray-600">
                                Select the addons you'd like to add.
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {addons.map((addon) => (
                                  <div
                                    key={addon.id}
                                    className="bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center p-2 rounded-md border relative"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`addon-${addon.id}`}
                                      className="mr-2"
                                      checked={selectedAddon.includes(addon.id)}
                                      onChange={() =>
                                        handleAddonChange(addon.id)
                                      }
                                    />

                                    <label
                                      htmlFor={`addon-${addon.id}`}
                                      className="text-sm font-medium truncate"
                                    >
                                      {addon.label}
                                    </label>

                                    {addon.hasTooltip && (
                                      <div className="group ml-2 relative cursor-pointer">
                                        <span className="text-gray-500 text-sm">
                                          ℹ️
                                        </span>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-green-50 text-black text-xs p-2 rounded shadow-md w-48 z-10">
                                          More info about {addon.label}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 flex items-center justify-center">
                                <button
                                  className="py-2 px-8 text-white font-semibold rounded"
                                  style={{
                                    background:
                                      "linear-gradient(to bottom, #426D98, #28A7E4)",
                                  }}
                                  onClick={handleSaveAddons}
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          )}

                          {activeTab === "Tab2" && (
                            <div className="p-2">
                              <p className=" mb-4 text-gray-600">
                                Choose Your Additional Accessories
                              </p>

                              <div className="mb-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={showAccessories}
                                    onChange={(e) =>
                                      setShowAccessories(e.target.checked)
                                    }
                                    className="mr-2"
                                  />
                                  <span className="font-medium text-blue-600">
                                    Additional Accessories
                                  </span>
                                </label>
                              </div>

                              {showAccessories && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="bg-blue-50 p-2 rounded-md flex items-center border">
                                    <input
                                      type="checkbox"
                                      id="electrical"
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor="electrical"
                                      className="text-sm font-medium"
                                    >
                                      Electrical
                                    </label>
                                  </div>

                                  <div className="bg-blue-50 p-2 rounded-md flex items-center border">
                                    <input
                                      type="checkbox"
                                      id="nonElectrical"
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor="nonElectrical"
                                      className="text-sm font-medium"
                                    >
                                      Non-Electrical
                                    </label>
                                  </div>

                                  <div className="bg-blue-50 p-2 rounded-md flex items-center border">
                                    <input
                                      type="checkbox"
                                      id="lpgCng"
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor="lpgCng"
                                      className="text-sm font-medium"
                                    >
                                      LPG/CNG
                                    </label>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex items-center justify-center">
                                <button
                                  className="py-2 px-8 text-white font-semibold rounded"
                                  style={{
                                    background:
                                      "linear-gradient(to bottom, #426D98, #28A7E4)",
                                  }}
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Details Page */}
      <div className="flex flex-col gap-2 md:flex-row mt-4">
        {/* Vendor Cards */}
        <div className="w-full lg:w-3/4 flex flex-wrap gap-6 justify-start lg:ml-16">
          {vendorList
            .filter((vendor) => vendor.isActive === "1")
            .map((vendor) => (
              <div
                key={vendor.vid}
                className="w-full sm:w-[320px] h-80 rounded-md bg-white shadow-md p-4"
              >
                <div className="flex flex-col items-center gap-4 h-full justify-between">
                  {/* Vendor Name */}
                  <h2 className="text-blue-800 font-medium text-center capitalize">
                    {vendor.vendorname}
                  </h2>

                  {/* Logo */}
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shadow">
                    {vendor.logo && (
                      <img
                        src={`/images/${vendor.logo}`}
                        alt={vendor.vendorname}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  {/* IDV Info */}
                  <p className="text-gray-500 text-sm">
                    Cover value (IDV){" "}
                    <span className="text-black font-semibold">₹ 3,54,998</span>
                  </p>

                  {/* Price Box */}
                  <div className="flex items-center justify-center bg-gray-100 w-[140px] rounded py-1 shadow">
                    <div className="text-center">
                      <p className="font-medium text-sm">Buy Now</p>
                      <p className="font-semibold text-sm">₹ 9,667</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => setAddAddonModal(true)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Addons
                    </button>
                    <button className="text-blue-500 text-sm hover:underline">
                      Premium Backup
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {addAddonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
              <button
                onClick={() => setAddAddonModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-4">Selected Addons</h3>
              {selectedAddon.length === 0 ? (
                <p className="text-sm text-gray-600">No addons selected.</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 max-h-52 overflow-auto">
                  {addons
                    .filter((a) => selectedAddon.includes(a.id))
                    .map((addon) => (
                      <li key={addon.id}>{addon.label}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Car Details Card */}
        <div className="w-full lg:w-1/4 bg-white shadow-lg border p-4 rounded-xl ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Private Car
          </h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">RTO City:</span>
              <span className="text-gray-700 font-semibold">Indore</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">Manufacturer:</span>
              <span className="text-gray-700 font-semibold">DATSUN</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">Model:</span>
              <span className="text-gray-700 font-semibold">GO PLUS A</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">Variant:</span>
              <span className="text-gray-700 font-semibold">GO PLUS A</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">Registration Year:</span>
              <span className="text-gray-700 font-semibold">2024</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 p-2">
              <span className="font-medium">Policy Expiry:</span>
              <span className="text-gray-700 font-semibold">Not Expired</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
