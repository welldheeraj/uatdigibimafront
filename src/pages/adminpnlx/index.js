import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "../../layouts/toaster";
import { CallApi } from "../../api";
import constant from "../../env";

const Index = () => {  // FIXED: Component name changed to uppercase
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let interval;
    if (showOtp && timer > 1) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 1) {
      clearInterval(interval);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const isValidMobile = (number) => /^[0-9]{10}$/.test(number);

  const sendOTP = async () => {
    try {
      if (!isValidMobile(mobile)) {
        showError("Enter only Admin number");
        return;
      }

      const payload = { mobile };
      const response = await CallApi(constant.API.ADMIN.ADMINLOGIN, "POST", payload);

      console.log(response);

      if (response.status === false) {
        showError(response.message);
        return;
      }

      if (response.status === true) {
        const data = { mobile };
        const response = await CallApi(constant.API.ADMIN.SENDOTP, "POST", data);
        console.log(response);

        if (response.status === true) {
          showSuccess(response.message);
        }

        setShowOtp(true);
        setTimer(20);
        setCanResend(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValidOtp = (code) => /^[0-9]{6}$/.test(code);

  const verifyOTP = async () => {
    try {
      if (!isValidOtp(otp)) {
        showError("Please enter a valid OTP");
        return;
      }

      const data = {
        mobile: mobile,
        otp: otp,
      };

      const response = await CallApi(
        constant.API.HEALTH.VERIFYOTP,
        "POST",
        data
      );
      console.log(response);

      if (response.status === false) {
        showError(response.message);
      }

      if (response.status === true) {
        showSuccess("Welcome to admin dashboard");
        router.push(constant.ROUTES.ADMIN.ADMINDASHBOARD);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!showOtp) {
      sendOTP();
    } else {
      console.log("Verifying OTP:", otp);
    }
  };

  const handleResend = () => {
    sendOTP();
    setOtp("");
    setTimer(20);
    setCanResend(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row h-[500px] shadow-md">
        {/* Left Sign-in part */}
        <div className="bg-white p-8 rounded w-full">
          <div className="flex flex-col items-center justify-center h-[500px]">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign-In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!showOtp ? (
                <>
                  <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d{0,10}$/.test(input)) {
                        setMobile(input);
                      }
                    }}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d{0,6}$/.test(input)) {
                        setOtp(input);
                      }
                    }}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />

                  {!canResend ? (
                    <p className="text-red-600 text-center">
                      Resend in {timer}s
                    </p>
                  ) : (
                    <p
                      className="text-red-600 text-center cursor-pointer"
                      onClick={handleResend}
                    >
                      Didn&apos;t receive an OTP?{" "}
                      <span className="text-blue-400">Resend</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={verifyOTP}
                  >
                    Verify
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Right Image Part */}
        <div className="bg-blue-200 w-full flex flex-col items-center justify-center">
          <h2 className="font-semibold text-2xl">Welcome To DigiBima</h2>
          <p className="p-4 text-sm">
            Please enter your registered mobile number to access the admin
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
