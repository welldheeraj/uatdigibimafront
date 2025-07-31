"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CallApi } from "@/api";
import CarInsuranceLoader from "@/components/loader";
import { showSuccess, showError } from "@/layouts/toaster";

export default function ThankYou() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [policyData, setPolicyData] = useState(null);

  const policynumber = router.query.policynumber;
  const Param1 = router.query.Param1;
  const Param2 = router.query.Param2;
  const policyurl = router.query.policyurl;

  const payload = {
    policy: policynumber,
    parm1: Param1,
    parm2: Param2,
    policyurl: policyurl,
  };

  const fetchData = useCallback(async (payload) => {
    setLoading(true);
    try {
      const response = await CallApi(
        "/api/motor-bike-shriram/thankyou",
        "POST",
        payload
      );

      if (response?.status && response?.data) {
        setPolicyData(response.data);
        showSuccess("Policy generated successfully!");
      } else {
        showError(response?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const { policynumber, Param1, Param2, policyurl } = router.query;
    const payload = {
      policy: policynumber,
      parm1: Param1,
      parm2: Param2,
      policyurl: policyurl,
    };

    fetchData(payload);
  }, [router.isReady, router.query, fetchData]);
  return (
    <div className="min-h-screen bgcolor flex items-center justify-center p-4 sm:p-8">
      {loading ? (
        <div className="text-center text-gray-500 text-lg font-medium">
          <CarInsuranceLoader />
        </div>
      ) : policyData ? (
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 text-center border border-blue-100">
          <div className="icon text-green-500 text-5xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
          <p className="text-gray-700">
            Your policy has been successfully generated.
          </p>
          <p className="text-md mt-4 mb-3 text-black font-semibold">
            <strong>Policy Number:</strong>
            <br />
            {policyData.policy}
          </p>
          <a
            href={policyData.policyURL}
            className="thmbtn text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-download mr-2"></i>
            Download Policy
          </a>
        </div>
      ) : (
        <div className="min-h-screen text-center text-red-500">
          Policy data not found.
        </div>
      )}
    </div>
  );
}
