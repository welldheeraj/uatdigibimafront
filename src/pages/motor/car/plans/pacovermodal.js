"use client";
import React from "react";
import { Modal } from "@mui/material";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

export default function PaCoverModal({ open, onClose, showIrdai, setShowIrdai, showPaCover, setShowPaCover, optOutBoxes }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Personal Accident (PA) Cover</h2>
            <button onClick={onClose} className="text-3xl">×</button>
          </div>
          <div className="text-sm">
            <div className="mb-4">
              <button onClick={() => setShowIrdai(!showIrdai)} className="text-blue-600 font-medium flex items-center space-x-1">
                <span>IRDAI Notice</span>
                {showIrdai ? <RiArrowDropDownLine className="text-4xl" /> : <RiArrowDropUpLine className="text-4xl" />}
              </button>
              {showIrdai && (
                <p className="mt-2 text-gray-700">
                  As per the <strong>IRDAI</strong> notice, <span className="text-red-600">PA Cover is mandatory</span>...
                </p>
              )}
            </div>
            <div className="mb-4 border-l-4 rounded border-red-500 pl-4">
              <p className="font-semibold text-gray-800 mb-2">You can opt out if...</p>
             {(optOutBoxes || []).map((label, idx) => (
  <label key={idx} className="block mb-1">
    <input type="checkbox" className="mr-2" />
    {label}
  </label>
))}
            </div>
            <div>
              <button onClick={() => setShowPaCover(!showPaCover)} className="text-blue-600 font-medium flex items-center space-x-1">
                What is PA Cover?
                {showPaCover ? <RiArrowDropDownLine className="text-4xl" /> : <RiArrowDropUpLine className="text-4xl" />}
              </button>
              {showPaCover && (
                <div className="mt-2 text-gray-700">
                  <p className="font-semibold text-black">What is PA Cover?</p>
                  <p>This policy covers the owner for death or disability due to an accident...</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mt-4">
              <button className="text-white px-12 p-1 rounded" style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
