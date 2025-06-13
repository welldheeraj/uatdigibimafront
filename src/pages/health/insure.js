"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HiPlus, HiMinus } from 'react-icons/hi';
import { showSuccess, showError } from "../../styles/js/toaster"; 
import {CallApi,VerifyToken} from "../../api";
import constant from "../../env";


export default function InsurePage({
  gender = "male",
  prefilledData = [],
  child = [],
}) {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [tokenverified,setTokenVerified] = useState();
  const [data,setData] = useState();
   const { reset } = useForm();
  
 //console.log(tokenverified);
  useEffect(() => {
    const getInsureData = async () => {
      try {
        const res = await CallApi(constant.API.HEALTH.GETINSURE);
        if (res.status === true && res.data) {
          console.log(res.data);

          // Dynamically populate the members list with fetched data
           const updatedMembers = [
            { name: "self", age: res.data.find(item => item.name === "self")?.age || "", mobile: res.data.find(item => item.name === "self")?.mobile || "" },
            { name: gender === "male" ? "wife" : "husband", age: res.data.find(item => item.name === (gender === "male" ? "wife" : "husband"))?.age || "", mobile: res.data.find(item => item.name === (gender === "male" ? "wife" : "husband"))?.mobile || "" },
            ...["father", "mother", "grandfather", "grandmother", "fatherinlaw", "motherinlaw"].map((m) => ({
              name: m, 
              age: res.data.find(item => item.name === m)?.age || "" 
            }))
          ];

          setMembers(updatedMembers);

          // Reset form with fetched data
          reset({
            name: res.data[0]?.name || "",
            mobile: res.data[0]?.mobile || "",
            pincode: res.data[0]?.pincode || "",
            gender: res.data[0]?.gender || "",
          });

          // Set selected members based on the fetched data
          const selectedMembers = res.data.map(member => member.name);
          setSelectedMembers(selectedMembers); // Set the selected members to include those from the API
        } else {
          console.error("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getInsureData();
  }, [gender, reset]);
useEffect(() => {
  const updatedMembers = [
    { name: "self", age: "" },
    { name: gender === "male" ? "wife" : "husband", age: "" },
    ...["father", "mother", "grandfather", "grandmother", "fatherinlaw", "motherinlaw"].map((m) => ({ name: m, age: "" }))
  ];
  setMembers(updatedMembers);
}, [gender]);

  const [selectedMembers, setSelectedMembers] = useState(
    prefilledData?.map((item) => item.name) || []
  );

   const maxChildren = 4;
  const [children, setChildren] = useState([]);
  const [isChildChecked, setIsChildChecked] = useState(child.length > 0);


  useEffect(() => {
    if (child && child.length > 0) {
      const mapped = child.map(([type, age]) => ({ type, age: age.toString() }));
      setChildren(mapped.slice(0, maxChildren));
    }
  }, [child]);

  const addChild = () => {
    if (children.length < maxChildren) {
      setChildren([...children, { type: "", age: "" }]);
    } else {
      showError("Maximum Four Children Allowed");
    }
  };

  const removeChild = () => {
    if (children.length > 0) {
      setChildren(children.slice(0, -1));
    }
  };

  const childChange = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };  

  const toggleChildCheckbox = () => {
    if (isChildChecked) {
      setChildren([]);
    } else {
      setChildren([{ type: "", age: "" }]);
    }
    setIsChildChecked(!isChildChecked);
  };

  const handleToggle = (name) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const ageChange = (name, age) => {
    setMembers((prev) =>
      prev.map((m) => (m.name === name ? { ...m, age } : m))
    );
  };

  // const showError = (message) => alert(message);  // Updated to show error alert

  const handleSubmit = async() => {
    const selected = members.filter((m) => selectedMembers.includes(m.name));
    const formData = {
      data:[...selected.map((m) => ({ name: m.name, age: m.age })),
          ...(children || []),
      ], 
    };
    console.log(formData);
    const getAge = (name) => members.find((m) => m.name === name)?.age || null;
    const isSelected = (name) => selectedMembers.includes(name);

    if (selected.length === 0) return showError("Please select at least one family member.");
    for (const m of selected) if (!m.age) return showError(`Please select age for ${m.name}`);

    const ageInt = (val) => parseInt(val, 10);
    const selfAge = ageInt(getAge("self"));
    const spouseAge = ageInt(getAge("wife")) || ageInt(getAge("husband"));
    const fatherAge = ageInt(getAge("father"));
    const motherAge = ageInt(getAge("mother"));
    const grandfatherAge = ageInt(getAge("grandfather"));
    const grandmotherAge = ageInt(getAge("grandmother"));
    const fatherinlawAge = ageInt(getAge("fatherinlaw"));
    const motherinlawAge = ageInt(getAge("motherinlaw"));

    const checkGap = (older, younger, gap, label) => {
      if (older && younger && older - younger < gap) {
        showError(`The gap between ${label} should be at least ${gap} years.`);
        return false;
      }
      return true;
    };

    // Check for family member age gap validation (Self, Father, Mother, etc.)
    if (
      (isSelected("father") && (!checkGap(fatherAge, selfAge, 18, "Self and Father") || (spouseAge && !checkGap(fatherAge, spouseAge, 18, "Spouse and Father")))) ||
      (isSelected("mother") && (!checkGap(motherAge, selfAge, 18, "Self and Mother") || (spouseAge && !checkGap(motherAge, spouseAge, 18, "Spouse and Mother")))) ||
      (isSelected("fatherinlaw") && (!checkGap(fatherinlawAge, selfAge, 18, "Self and Father-in-law") || (spouseAge && !checkGap(fatherinlawAge, spouseAge, 18, "Spouse and Father-in-law")))) ||
      (isSelected("motherinlaw") && (!checkGap(motherinlawAge, selfAge, 18, "Self and Mother-in-law") || (spouseAge && !checkGap(motherinlawAge, spouseAge, 18, "Spouse and Mother-in-law")))) ||
      (isSelected("grandfather") && (!checkGap(grandfatherAge, selfAge, 36, "Self and Grandfather") || (spouseAge && !checkGap(grandfatherAge, spouseAge, 18, "Spouse and Grandfather")))) ||
      (isSelected("grandmother") && (!checkGap(grandmotherAge, selfAge, 36, "Self and Grandmother") || (spouseAge && !checkGap(grandmotherAge, spouseAge, 18, "Spouse and Grandmother")))) ||
      (isSelected("father") && isSelected("grandfather") && !checkGap(grandfatherAge, fatherAge, 18, "Father and Grandfather")) ||
      (isSelected("father") && isSelected("grandmother") && !checkGap(grandmotherAge, fatherAge, 18, "Father and Grandmother")) ||
      (isSelected("mother") && isSelected("grandfather") && !checkGap(grandfatherAge, motherAge, 18, "Mother and Grandfather")) ||
      (isSelected("mother") && isSelected("grandmother") && !checkGap(grandmotherAge, motherAge, 18, "Mother and Grandmother"))
    ) return;

     if (isChildChecked) {
    for (const child of children) {
      if (!child.type || !child.age) {
        showError("Please select both type and age for each child.");
        return;
      }
    }
     const incomplete = children
    .map((c, i) => ({ ...c, index: i + 1 })) 
    .filter(({ type, age }) => (type || age) && (!type || !age));

   if (incomplete.length) {
    incomplete.forEach(({ index, type, age }) => {
      if (!type && !age) return;            
      if (!type)
        showError(`Child ${index}: select a relationship/type`);
      if ( !age)
        showError(`Child ${index}: select an age`);
    });
    return; 
  }
  }

  // Children age validation: age should be between 1 and 18
  for (const child of children) {
    const childAge = parseInt(child.age, 10);
    if (childAge < 1 || childAge > 18) {
      showError("Children's age must be between 1 and 18.");
      return;
    }
  }
    console.log("Submitting", formData);
     showSuccess("Data saved!")
    //router.push("/health/illness")
  try {
    const response = await CallApi(constant.API.HEALTH.ILLNESS, "POST", formData);
    console.log("Server Response:", response);
    router.push(constant.ROUTES.HEALTH.ILLNESS);
  } catch (err) {
    console.error("API error:", err);
    showError("Failed to submit data. Please try again.");
  }
  };

  return (
      <div className="bg-[#C8EDFE] px-4 py-10 min-h-screen flex items-center justify-center">
      <section id="slide3" className="max-w-8xl rounded-[64px] bg-[#fff] text-white grid grid-cols-1 lg:grid-cols-2 p-4 sm:p-6 md:p-10 gap-6">

 
        <div className="hidden lg:block sticky top-10 h-fit self-start">
          <img src="/images/health/health-two.png" alt="Family Health" className="w-full h-auto max-w-md mx-auto" />
        </div>

      
        <div className="w-full">
          <h2 className="text-[24px] md:text-[28px] font-bold mb-8 text-[#426D98] text-center md:text-left">
            Select members you want to insure
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.filter((m) => ["self", "wife", "husband"].includes(m.name)).map((member) => (
                <MemberCard key={member.name} member={member} selectedMembers={selectedMembers} handleToggle={handleToggle} ageChange={ageChange} />
              ))}
              <div className="col-span-full">
                <ChildrenSection
                  isChildChecked={isChildChecked}
                  toggleChildCheckbox={toggleChildCheckbox}
                  children={children}
                  addChild={addChild}
                  removeChild={removeChild}
                  childChange={childChange}
                  maxChildren={maxChildren}
                />
              </div>
              {members.filter((m) => !["self", "wife", "husband"].includes(m.name)).map((member) => (
                <MemberCard key={member.name} member={member} selectedMembers={selectedMembers} handleToggle={handleToggle} ageChange={ageChange} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-start">
              <button type="button" onClick={() => router.push(constant.ROUTES.HEALTH.INDEX)}  className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition" style={{
                background: "linear-gradient(to bottom, #426D98, #28A7E4)"
              }}>
                Back
              </button>
              <button type="button" onClick={handleSubmit} className="px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition" style={{
                background: "linear-gradient(to bottom, #426D98, #28A7E4)"
              }}>
                Continue
              </button>
            </div>
          </form>
        </div>

      </section>
    </div>
  );
}

function MemberCard({ member, selectedMembers, handleToggle, ageChange }) {
  return (
    <div onClick={() => handleToggle(member.name)} className="flex items-center justify-between gap-2 bg-white px-4 py-2 rounded-xl text-black w-full relative border border-gray-400">
      {selectedMembers.includes(member.name) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>}
      <input type="checkbox" checked={selectedMembers.includes(member.name)} onChange={() => handleToggle(member.name)} className="form-checkbox accent-pink-500 h-4 w-4  cursor-pointer" onClick={(e) => e.stopPropagation()} />
      <label className="text-sm font-medium text-gray-800 capitalize cursor-pointer" onClick={(e) => e.stopPropagation()}>{member.name.replace(/inlaw/, " in-law")}</label>
      <select name={member.name} value={member.age} onChange={(e) => ageChange(member.name, e.target.value)} disabled={!selectedMembers.includes(member.name)} className="ml-auto border border-gray-400 rounded-lg px-3 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-blue-200" onClick={(e) => e.stopPropagation()}>
        <option value="">Age</option>
        {Array.from({ length: 82 }, (_, i) => 18 + i).map((age) => (
          <option key={age} value={age}>{age}</option>
        ))}
      </select>
    </div>
  );
}

function ChildrenSection({ isChildChecked, toggleChildCheckbox, children, addChild, removeChild, childChange, maxChildren }) {
  return (
    <>
      <div onClick={toggleChildCheckbox} className="flex items-center justify-between gap-2 bg-white px-4 py-3 rounded-xl text-black w-full relative border border-gray-400">
        {isChildChecked && <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>}
        <label className="flex items-center space-x-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isChildChecked} onChange={(e) => { e.stopPropagation(); toggleChildCheckbox(); }} className="form-checkbox accent-pink-500 h-4 w-4  " />
          <span className="text-sm font-medium text-gray-800">Children</span>
        </label>
        {isChildChecked && (
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={removeChild} type="button" disabled={children.length === 0} className="bg-gray-300 rounded disabled:opacity-50">
              <HiMinus className="text-xl text-gray-700" />
            </button>
            <span className="font-medium text-gray-700">{children.length}</span>
            <button onClick={addChild} type="button" disabled={children.length >= maxChildren} className="bg-gray-300 rounded disabled:opacity-50">
              <HiPlus className="text-xl text-gray-700" />
            </button>
          </div>
        )}
      </div>
      {isChildChecked && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" id="childContainer">
          {children.map((child, index) => (
            <div key={index} className="flex items-center gap-3 border border-gray-400 p-2 rounded-xl bg-white shadow-sm">
              <select className="w-1/2 border border-gray-400 px-3 py-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-200" value={child.type} onChange={(e) => childChange(index, "type", e.target.value)}>
                <option value="">Select Child</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
              </select>
              <select className="w-1/2 border border-gray-400 px-3 py-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-200" value={child.age} onChange={(e) => childChange(index, "age", e.target.value)}>
                <option value="">Age</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
