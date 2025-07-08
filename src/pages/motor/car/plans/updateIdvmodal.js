"use client";
import React from "react";
import { Modal } from "@mui/material";

export default function UpdateIdvModal({ open, onClose, value, setValue }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
          <div className="flex flex-col gap-12 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Car insured value (IDV)</h2>
              <button onClick={onClose} className="text-3xl">×</button>
            </div>
            <div>
              <div className="flex">
                <h2 className="font-semibold">Your IDV:</h2>
                <input
                  type="text"
                  className="border border-blue-600 ml-4 pl-2 p-1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <input
                id="slider"
                type="range"
                min="100"
                max="1000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-4 bg-gradient-to-r from-blue-600 to-violet-300"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>100</span>
                <span>1000</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="text-white w-full p-1 rounded"
                style={{ background: "linear-gradient(to bottom, #426D98, #28A7E4)" }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
