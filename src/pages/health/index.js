'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState('male');
  const [otpVisible, setOtpVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState('');

  const mobile = watch('mobile');
  const name = watch('name');
  const pincode = watch('pincode');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

 const sendOtp = async () => {
  setIsLoading(true);
  console.log("Sending OTP to:", mobile);

  // try {
    const response = await fetch("https://stage.digibima.com/api/sendotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile }),
    });

    const result = await response.json();
    console.log("OTP API result:", result);
    if (response.ok && result.status === "true") {
      setTimeout(() => {
        setOtpVisible(true);
        setTimer(30);
        setIsLoading(false);
        alert("OTP sent to your mobile");
      }, 1000); 
    } else {
      setIsLoading(false);
      alert(result.message || "Failed to send OTP. Please try again.");
    }
  // } catch (error) {
  //   console.error("Error sending OTP:", error);
  //   setIsLoading(false);
  //   alert("Something went wrong while sending OTP.");
  // }
};


  const verifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (otp === '123456') {
        setIsOtpVerified(true);
        setOtpVisible(false);
        alert('OTP Verified');
      } else {
        alert('Invalid OTP');
      }
      setIsLoading(false);
    }, 1000);
  };

  const onSubmit = (data) => {
    if (!isOtpVerified) {
      alert('Please verify your mobile number');
      return;
    }
    // alert('Form submitted!');
    router.push('health/insure');
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-white flex items-center justify-center px-4 pt-10 pb-16">
      <div className="w-full max-w-6xl bg-[#f4fcff] rounded-xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2">
          <img src="https://test.digibima.com/public/front/images/DIGIBIMA-2.jpg" alt="Insurance Visual" className="w-full h-auto object-contain" />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-blue-900 text-center md:text-left drop-shadow mb-4">Find Top Plans For You</h2>

          
          <div className="flex gap-2 mb-4">
            {['male', 'female'].map((gender) => (
              <label key={gender}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={() => setSelectedGender(gender)}
                  className="hidden"
                />
                <div className={`px-5 py-2 rounded border text-sm font-medium cursor-pointer transition ${selectedGender === gender
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </div>
              </label>
            ))}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            <div>
              <label className="text-sm font-semibold text-blue-900 mb-1 block">Name</label>
              <input
                {...register('name', { required: true })}
                type="text"
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
            </div>

           
            <div>
              <label className="text-sm font-semibold text-blue-900 mb-1 block">Mobile Number</label>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <input
                    {...register('mobile', {
                      required: true,
                      pattern: /^[0-9]{10}$/
                    })}
                    type="tel"
                    maxLength={10}
                    readOnly={isOtpVerified}
                    placeholder="Enter Mobile Number"
                    className={`w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 ${isOtpVerified
                      ? 'border-red-500 bg-gray-100 text-gray-700'
                      : 'border-gray-300 bg-white focus:ring-blue-100'}`}
                  />
                  {!isOtpVerified && (
                    <button
                      type="button"
                      disabled={mobile?.length !== 10 || isLoading || timer > 0}
                      onClick={sendOtp}
                      className={`px-3 py-2 text-sm rounded ${mobile?.length === 10 && timer === 0
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                        : 'bg-[#c7cdfc] text-white cursor-not-allowed'}`}
                    >
                      {timer > 0 ? 'Resend' : 'Verify'}
                    </button>
                  )}
                </div>
                {!isOtpVerified && timer > 0 && (
                  <p className="text-sm text-gray-600">You can resend OTP in 00:{timer.toString().padStart(2, '0')}</p>
                )}
                {errors.mobile && <p className="text-red-500 text-xs mt-1">Mobile Number required</p>}
              </div>
            </div>

           
            <div>
              <label className="text-sm font-semibold text-blue-900 mb-1 block">Pincode</label>
              <input
                {...register('pincode', {
                  required: true,
                  pattern: /^[0-9]{6}$/
                })}
                type="text"
                maxLength={6}
                placeholder="Enter Pincode"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">Pincode required</p>}
            </div>

            
            {otpVisible && (
              <div>
                <label className="text-sm font-semibold text-blue-900 mb-1 block">Enter OTP</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || isLoading}
                    className={`px-3 py-2 text-sm rounded ${otp.length === 6
                      ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                      : 'bg-gray-300 text-white cursor-not-allowed'}`}
                  >
                    {isLoading ? 'Verifying...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>

        
          <div className="flex flex-col md:items-start gap-1">
            <button
              type="submit"
              className={`px-6 py-2 rounded-full text-sm font-semibold ${isOtpVerified
                ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                : 'bg-[#c7cdfc] text-white cursor-not-allowed disabled'}`}
            >
              Continue
            </button>
            <p className="text-sm mt-1">
              Already bought a policy from DigiBima?{' '}
              <a href="#" className="text-blue-600 underline">
                Renew Now
              </a>
            </p>
          </div>
            
        </div>
      </div>
    </form>
  );
}
