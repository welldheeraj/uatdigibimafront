import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HiPlus, HiMinus } from "react-icons/hi";
import { showSuccess, showError } from "@/layouts/toaster";
import { CallApi, VerifyToken } from "../../../api";
import constant from "../../../env";
import Image from "next/image";
import { healthTwo } from "@/images/Image";

export default function InsurePage() {
  const router = useRouter();
  const { reset } = useForm();

  const [gender, setGender] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [childrenList, setChildrenList] = useState([]);
  const [isChildChecked, setIsChildChecked] = useState(false);
  const maxChildren = 4;

  const [showModal, setShowModal] = useState(true);
  const [planType, setPlanType] = useState("");
   const [tenure, setTenure] = useState("");

  useEffect(() => {
    const getInsureData = async () => {
      try {
        const res = await CallApi(constant.API.HEALTH.GETINSURE);
        console.log("step two data", res);
        if (res.status && res.data) {
          if (res.gender) {
            setGender(res.gender.toLowerCase());
          }
          const apiData = res.data;
          const updatedMembers = [
            {
              name: "self",
              age: apiData.find((item) => item.name === "self")?.age || "",
            },
            {
              name: gender === "male" ? "wife" : "husband",
              age:
                apiData.find(
                  (item) =>
                    item.name === (gender === "male" ? "wife" : "husband")
                )?.age || "",
            },
            ...[
              "father",
              "mother",
              "grandfather",
              "grandmother",
              "fatherinlaw",
              "motherinlaw",
            ].map((m) => ({
              name: m,
              age: apiData.find((item) => item.name === m)?.age || "",
            })),
          ];

          const childData = apiData
            .filter((item) => item.name === "Son" || item.name === "Daughter")
            .map((item) => ({
              name: item.name,
              age: item.age,
            }));
          setChildrenList(childData);
          setIsChildChecked(childData.length > 0);
          setMembers(updatedMembers);

          const selected = apiData
            .filter((item) => item.name !== "Son" && item.name !== "Daughter")
            .map((m) => m.name);
          setSelectedMembers(selected);
        } else {
          showError("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Something went wrong while fetching data.");
      }
    };

    getInsureData();
  }, [gender, reset]);

  const addChild = () => {
    if (childrenList.length < maxChildren) {
      setChildrenList([...childrenList, { name: "", age: "" }]);
    } else {
      showError("Maximum Four Children Allowed");
    }
  };

  const removeChild = () => {
    setChildrenList(childrenList.slice(0, -1));
  };

  const childChange = (index, field, value) => {
    const updated = [...childrenList];
    updated[index][field] = value;
    setChildrenList(updated);
  };

  const toggleChildCheckbox = () => {
    setIsChildChecked((prev) => {
      const newChecked = !prev;
      setChildrenList(newChecked ? [{ name: "", age: "" }] : []);
      return newChecked;
    });
  };

  const handleToggle = (name) => {
    setSelectedMembers((prev) => {
      const updatedSelection = prev.includes(name)
        ? prev.filter((m) => m !== name)
        : [...prev, name];

      console.log("Updated selected members:", updatedSelection);
      return updatedSelection;
    });
  };

  const ageChange = (name, age) => {
    setMembers((prev) => {
      const updatedMembers = prev.map((m) =>
        m.name === name ? { ...m, age } : m
      );
      console.log("Updated members:", updatedMembers);
      return updatedMembers;
    });
  };

  const getAge = (name) =>
    parseInt(members.find((m) => m.name === name)?.age || "", 10) || null;
  const isSelected = (name) => selectedMembers.includes(name);

  const checkGap = (older, younger, gap, label) => {
    if (older && younger && older - younger < gap) {
      showError(`The gap between ${label} should be at least ${gap} years.`);
      return false;
    }
    return true;
  };

  const validateAgeGaps = () => {
    const agePairs = [
      ["father", "self", 18, "Self and Father"],
      [
        "father",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Father",
      ],
      ["mother", "self", 18, "Self and Mother"],
      [
        "mother",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Mother",
      ],
      ["fatherinlaw", "self", 18, "Self and Father-in-law"],
      [
        "fatherinlaw",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Father-in-law",
      ],
      ["motherinlaw", "self", 18, "Self and Mother-in-law"],
      [
        "motherinlaw",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Mother-in-law",
      ],
      ["grandfather", "self", 36, "Self and Grandfather"],
      [
        "grandfather",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Grandfather",
      ],
      ["grandmother", "self", 36, "Self and Grandmother"],
      [
        "grandmother",
        gender === "male" ? "wife" : "husband",
        18,
        "Spouse and Grandmother",
      ],
      ["grandfather", "father", 18, "Father and Grandfather"],
      ["grandmother", "father", 18, "Father and Grandmother"],
      ["grandfather", "mother", 18, "Mother and Grandfather"],
      ["grandmother", "mother", 18, "Mother and Grandmother"],
    ];

    for (const [older, younger, gap, label] of agePairs) {
      if (isSelected(older) && isSelected(younger)) {
        if (!checkGap(getAge(older), getAge(younger), gap, label)) return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    const selected = members.filter((m) => selectedMembers.includes(m.name));
    if (selected.length === 0) {
      return showError("Please select at least one family member.");
    }
    for (const m of selected) {
      if (!m.age) {
        return showError(`Please select age for ${m.name}`);
      }
    }

    if (!validateAgeGaps()) return;
    if (isChildChecked) {
      for (let i = 0; i < childrenList.length; i++) {
        const { name, age } = childrenList[i];
        if (!name || !age) {
          return showError(`Child ${i + 1}: Please fill both name and age`);
        }
        const ageNum = parseInt(age, 10);
        if (ageNum < 1 || ageNum > 18) {
          return showError(`Child ${i + 1}: Age must be between 1 and 18`);
        }
      }
    }

    let childdd = childrenList.map((child) => ({
      name: child.name,
      age: child.age,
    }));
    let membersss = selected.map((m) => ({ name: m.name, age: m.age }));
    const formData = [...childdd, ...membersss];
    console.log("Submitting form data:", formData);

    try {
      const response = await CallApi(
        constant.API.HEALTH.ILLNESS,
        "POST",
        formData
      );
      console.log("Server response:", response);
      if (response.status) {
        showSuccess("Data saved!");
        router.push(constant.ROUTES.HEALTH.ILLNESS);
      } else {
        showError(response.error || "Failed to submit data. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err);
      showError("Failed to submit data. Please try again.");
    }
  };

  useEffect(() => {
    const handleLoad = () => {
      const saved = localStorage.getItem("planType");

      if (saved === "1" || saved === "2") {
        setPlanType(saved);
        setShowModal(false);
      } else {
        localStorage.removeItem("planType");
        setShowModal(true);
      }
    };

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const handleplanSubmit = async () => {
    if (!planType) {
      showError("Please select a plan type.");
      return;
    }
     if (planType === "2" && !tenure) {
    showError("Please select a Tenure.");
    return;
  }

    try {
      const response = await CallApi(constant.API.HEALTH.PLANTYPE, "POST", {
        plantype: planType,
        tenure: planType === "2" ? tenure : null,
      });

      console.log(
        "Server response:",
        response,
        constant.API.HEALTH.PLANTYPE,
        planType
      );
      // return false;

      if (response.status) {
        showSuccess("Plan submitted successfully!");
        localStorage.setItem("planType", response.plantype);
        setShowModal(false);
      } else {
        showError(response.error || "Failed to submit plan. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err);
      showError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-8 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-semibold mb-6 text-gray-800  border-b pb-3">
              Select Plan Type
            </h2>

            <div className="flex flex-col gap-5">
              <label
                className={`flex items-center gap-3 cursor-pointer p-4 rounded-2xl transition-all border-2 
                ${
                  planType === "1"
                    ? "bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  value="1"
                  checked={planType === "1"}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-pink-400">
                  {planType === "1" && (
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  )}
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  New Plan
                </span>
              </label>

              {/* Port Existing */}
              <label
                className={`flex items-center gap-3 cursor-pointer p-4 rounded-2xl transition-all border-2 
                ${
                  planType === "2"
                    ? "bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  value="2"
                  checked={planType === "2"}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-pink-400">
                  {planType === "2" && (
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  )}
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  Port Existing
                </span>
              </label>
           {planType === "2" && (
              <select
                name="tenure"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select Tenure
                </option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years & Above</option>
              </select>
            )}

            </div>

           
            <div className="mt-8 text-center">
              <button
                onClick={handleplanSubmit}
                className="thmbtn px-8 py-3 rounded-full "
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bgcolor px-4 py-10 min-h-screen flex items-center justify-center">
          <section
            id="slide3"
            className=" max-w-9xl rounded-[64px] bg-[#fff] text-white grid grid-cols-1 lg:grid-cols-2 p-4 sm:p-6 md:p-10 gap-6"
          >
            <div className="hidden md:flex items-center justify-center">
              <Image
                src={healthTwo}
                alt="Family Health"
                className="max-w-[350px] w-full h-auto object-contain"
              />
            </div>

            <div className="w-full">
              <h2 className="text-[24px] md:text-[28px] font-bold mb-8 text-[#426D98] text-center md:text-left">
                Select members you want to insure
              </h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members
                    .filter((m) => ["self", "wife", "husband"].includes(m.name))
                    .map((member) => (
                      <MemberCard
                        key={member.name}
                        member={member}
                        selectedMembers={selectedMembers}
                        handleToggle={handleToggle}
                        ageChange={ageChange}
                      />
                    ))}
                  <div className="col-span-full">
                    <ChildrenSection
                      isChildChecked={isChildChecked}
                      toggleChildCheckbox={toggleChildCheckbox}
                      childrenList={childrenList} // updated prop name
                      addChild={addChild}
                      removeChild={removeChild}
                      childChange={childChange}
                      maxChildren={maxChildren}
                    />
                  </div>
                  {members
                    .filter(
                      (m) => !["self", "wife", "husband"].includes(m.name)
                    )
                    .map((member) => (
                      <MemberCard
                        key={member.name}
                        member={member}
                        selectedMembers={selectedMembers}
                        handleToggle={handleToggle}
                        ageChange={ageChange}
                      />
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-start">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="px-6 py-2 thmbtn rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 thmbtn rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function MemberCard({ member, selectedMembers, handleToggle, ageChange }) {
  return (
    <div
      onClick={() => handleToggle(member.name)}
      className="flex items-center justify-between gap-2 bg-white px-4 py-2 rounded-xl text-black w-full relative border border-gray-400"
    >
      <input
        type="checkbox"
        checked={selectedMembers.includes(member.name)}
        onChange={() => handleToggle(member.name)}
        className="form-checkbox accent-pink-500 h-4 w-4 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
      <label
        className="text-sm font-medium text-gray-800 capitalize cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        {member.name.replace(/inlaw/, " in-law")}
      </label>
      <select
        name={member.name}
        value={member.age}
        onChange={(e) => ageChange(member.name, e.target.value)}
        disabled={!selectedMembers.includes(member.name)}
        className="ml-auto border border-gray-400 rounded-lg px-3 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">Age</option>
        {Array.from({ length: 82 }, (_, i) => 18 + i).map((age) => (
          <option key={age} value={age}>
            {age}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChildrenSection({
  isChildChecked,
  toggleChildCheckbox,
  childrenList, // updated prop name
  addChild,
  removeChild,
  childChange,
  maxChildren,
}) {
  return (
    <>
      <div
        onClick={toggleChildCheckbox}
        className="flex items-center justify-between gap-2 bg-white px-4 py-3 rounded-xl text-black w-full relative border border-gray-400"
      >
        <label
          className="flex items-center space-x-2 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isChildChecked}
            onChange={(e) => {
              e.stopPropagation();
              toggleChildCheckbox();
            }}
            className="form-checkbox accent-pink-500 h-4 w-4"
          />
          <span className="text-sm font-medium text-gray-800">Children</span>
        </label>
        {isChildChecked && (
          <div
            className="flex items-center space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={removeChild}
              type="button"
              disabled={childrenList.length === 0}
              className="thmbtn rounded disabled:opacity-50"
            >
              <HiMinus className="text-xl text-white" />
            </button>
            <span className="font-medium text-gray-700">
              {childrenList.length}
            </span>
            <button
              onClick={addChild}
              type="button"
              disabled={childrenList.length >= maxChildren}
              className="thmbtn rounded disabled:opacity-50"
            >
              <HiPlus className="text-xl text-white" />
            </button>
          </div>
        )}
      </div>
      {isChildChecked && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
          id="childContainer"
        >
          {childrenList.map((child, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border border-gray-400 p-2 rounded-xl bg-white shadow-sm"
            >
              <select
                className="w-1/2 border border-gray-400 text-sm font-medium text-gray-800 cursor-pointer px-3 py-2 rounded-md "
                value={child.name}
                onChange={(e) => childChange(index, "name", e.target.value)}
              >
                <option value="">Select Child</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
              </select>
              <select
                className="w-1/2 border border-gray-400 text-sm font-medium text-gray-800 cursor-pointer px-3 py-2 rounded-md "
                value={child.age}
                onChange={(e) => childChange(index, "age", e.target.value)}
              >
                <option value="">Age</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
