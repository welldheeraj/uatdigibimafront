"use client";

import React, { useState } from "react";
import { Modal } from "@mui/material";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { CallApi } from "@/api"; 
import constant from "@/env";

export default function PaCoverModal({
  open,
  onClose,
  setPaCoverChecked,
  onSave, 
}) {
  const [optOut, setOptOut] = useState({
    companyBike: false,
    noDl: false,
    existingPolicy: false,
  });
  const [showIrdai, setShowIrdai] = useState(false);
  const [showPaCover, setShowPaCover] = useState(false);

  const handleCheckboxChange = (key) => {
    setOptOut((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validatePaCheckbox = () => {
  const reasons = [];

  if (optOut.companyBike)
    reasons.push({ 1: "The bike is registered in a company’s name." });
  if (optOut.noDl)
    reasons.push({ 2: "Not have effective DL With Declaration Letter." });
  if (optOut.existingPolicy)
    reasons.push({ 3: "Already CPA Policy Exists." });

  const optedOut = reasons.length > 0;
  const pacover = optedOut ? "0" : "1";

  const payload = optedOut
    ? [...reasons, { pacover }]
    : [{ pacover }];

  onSave({ payload, checked: !optedOut }); 
  onClose();
};


  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-lg">Personal Accident (PA) Cover</h5>
            <button onClick={onClose} className="text-3xl">×</button>
          </div>

          {/* IRDAI Notice */}
          <button
            onClick={() => setShowIrdai(!showIrdai)}
            className="text-blue-600 font-medium flex items-center mb-2 mt-4"
          >
            IRDAI Notice
            {showIrdai ? <RiArrowDropUpLine className="text-3xl" /> : <RiArrowDropDownLine className="text-3xl" />}
          </button>
          {showIrdai && (
            <p className="text-gray-700 text-sm mb-4">
              As per the <strong>Insurance Regulatory and Development Authority of India (IRDAI)</strong> notice, 
              <span className="text-red-600"> Personal Accident (PA) Cover is mandatory</span> if the bike is owned by an individual 
              who does not have a <span className="text-red-600">Personal Accident cover of ₹15 Lakhs</span>. 
              Please opt for 'Personal Accident (PA) Cover'.
            </p>
          )}

          {/* Opt Out Checkboxes */}
          <div className="mb-4">
            <h5 className="font-semibold text-sm mb-2">You can opt out if...</h5>
            <ul className="text-sm space-y-2">
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={optOut.companyBike}
                    onChange={() => handleCheckboxChange("companyBike")}
                    className="mr-2"
                  />
                  The bike is registered in a company’s name.
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={optOut.noDl}
                    onChange={() => handleCheckboxChange("noDl")}
                    className="mr-2"
                  />
                  Not have effective DL With Declaration Letter.
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={optOut.existingPolicy}
                    onChange={() => handleCheckboxChange("existingPolicy")}
                    className="mr-2"
                  />
                  Already CPA Policy Exists.
                </label>
              </li>
            </ul>
          </div>

          {/* PA Cover Accordion */}
          <button
            onClick={() => setShowPaCover(!showPaCover)}
            className="text-blue-600 font-medium flex items-center mt-2"
          >
            What is PA Cover?
            {showPaCover ? <RiArrowDropUpLine className="text-3xl" /> : <RiArrowDropDownLine className="text-3xl" />}
          </button>
          {showPaCover && (
            <div className="text-gray-700 text-sm mt-2">
              <h5 className="font-semibold">What is PA Cover?</h5>
              <p>
                This policy covers the owner for death or disability due to an accident. 
                The owner (in case of disability) or the nominee (in case of death) will receive ₹15 Lakhs.
              </p>
              <p className="italic mt-2">Stay protected with the right insurance coverage.</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-start mt-6">
            <button
              className="text-white px-6 py-2 rounded text-sm"
              style={{
                background: "linear-gradient(to bottom, #426D98, #28A7E4)",
              }}
              onClick={validatePaCheckbox}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
