"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { FaRegCreditCard } from "react-icons/fa";
import Lottie from "lottie-react";
import handShake from "@/animation/policygenerate.json";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const proposalNumber = searchParams.get("proposalNumber");
  const returnURL = "https://stage.digibima.com/return/api/carethankyou.php";

  const handlePayment = () => {
    if (!proposalNumber) {
      alert("Missing proposal number");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://apiuat.careinsurance.com/portalui/PortalPayment.run";

    const proposalInput = document.createElement("input");
    proposalInput.type = "hidden";
    proposalInput.name = "proposalNum";
    proposalInput.value = proposalNumber;
    form.appendChild(proposalInput);

    const returnInput = document.createElement("input");
    returnInput.type = "hidden";
    returnInput.name = "returnURL";
    returnInput.value = returnURL;
    form.appendChild(returnInput);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-[#C8EDFE] flex items-center justify-center  sm:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center">
          <Lottie
            animationData={handShake}
            loop
            className="h-40 w-40 md:h-52 md:w-52 lg:h-64 lg:w-64"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Proposal:{" "}
          <span className="text-indigo-600">{proposalNumber || "N/A"}</span>
        </h2>
        <p className="text-sm text-gray-600 py-3">
          Thank you for choosing us for your health insurance needs. After your
          payment is processed, you&apos;ll receive a confirmation email with
          all policy details.
        </p>

        <div className="relative">
          <input
            type="hidden"
            placeholder="Enter Token"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          onClick={handlePayment}
          className="w-full bg-[#7998F4] text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition"
        >
          <FaRegCreditCard className="text-lg" />
          Payment
        </button>
      </div>
    </div>
  );
}
