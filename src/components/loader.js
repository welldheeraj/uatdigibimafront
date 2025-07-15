"use client";
import { FaCar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CarInsuranceLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinner with Icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-[#28A7E4] animate-spin" />
          <FaCar className="text-[#28A7E4] text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Loader Text */}
        <p className="text-[#2F4A7E] font-semibold text-sm text-center">
          Fetching the best motor insurance deals...
        </p>
      </motion.div>
    </div>
  );
}

export function MotorCardSkeleton() {
  return (
    <div className="w-full sm:w-[320px] h-80 bg-white rounded-3xl shadow-md p-5 animate-pulse">
      <div className="flex flex-col items-center gap-4 h-full justify-between">
        <div className="w-28 h-24 bg-blue-100 rounded-xl" />
        <div className="w-36 h-4 bg-blue-200 rounded" />
        <div className="w-48 h-3 bg-blue-100 rounded" />
        <div className="w-28 h-8 bg-blue-200 rounded-xl mt-4" />
        <div className="flex gap-4 mt-2">
          <div className="w-16 h-3 bg-blue-100 rounded" />
          <div className="w-20 h-3 bg-blue-100 rounded" />
        </div>
      </div>
    </div>
  );
}

