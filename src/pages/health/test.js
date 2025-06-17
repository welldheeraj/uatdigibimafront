"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CallApi } from "../../api";
import constant from "../../env";

export default function Pincode() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const [cities, setCities] = useState({});
  const [error, setError] = useState("");
  const [displayedPincode, setDisplayedPincode] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".city-suggestions")) {
        setCities({});
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debounced fetchCities call
  useEffect(() => {
    const cleaned = displayedPincode.replace(/\D/g, "").slice(0, 6);
    if (cleaned.length >= 3) {
      const timeout = setTimeout(() => {
        fetchCities(cleaned);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setCities({});
    }
  }, [displayedPincode]);

  // API call for cities
  const fetchCities = (pincode) => {
    if (/^\d{3,6}$/.test(pincode)) {
      const pincodeData = { pincode };
      CallApi(constant.API.HEALTH.PINCODE, "POST", pincodeData)
        .then((data) => {
          setCities(data);
          setError("");
        })
        .catch(() => {
          setCities({});
          setError("Error fetching city list. Try again.");
          setIsButtonEnabled(false);
        });
    } else {
      setCities({});
    }
  };

  // When user selects a city
  const handleCityClick = (pin, city) => {
    const full = `${pin}${city ? ` (${city})` : ""}`;
    setDisplayedPincode(full);
    setValue("pincode", pin);
    setCities({});
    setIsButtonEnabled(true);
  };

  return (
    <div className="relative">
      <label className="text-sm font-semibold text-blue-900 mb-1 block">
        Pincode
      </label>

      {/* Pincode input field */}
      <input
        type="text"
        value={displayedPincode}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
          setDisplayedPincode(cleaned);
          setValue("pincode", cleaned);
        }}
        placeholder="Enter Pincode"
        className="w-full px-4 py-2 text-sm border border-gray-400 rounded-md"
      />

      {/* Hidden input for react-hook-form */}
      <input
        type="hidden"
        {...register("pincode", {
          pattern: {
            value: /^[0-9]{5,6}$/,
            message: "Enter a valid 5 or 6 digit pincode",
          },
        })}
      />

      {/* Suggestions Dropdown */}
      {Object.keys(cities).length > 0 && (
        <ul className="absolute z-10 w-full border rounded shadow-sm bg-white city-suggestions mt-1 max-h-[120px] overflow-y-scroll">
          {Object.entries(cities).map(([code, city]) => (
            <li key={code}>
              <button
                type="button"
                onClick={() => handleCityClick(code, city)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <i className="fa-solid fa-location-dot mr-2"></i>
                {code} {city ? `(${city})` : ""}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {errors.pincode && (
        <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
      )}
    </div>
  );
}
