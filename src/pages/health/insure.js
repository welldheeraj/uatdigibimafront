"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import env from "../../env";
export default function InsurePage({
  gender = "male",
  prefilledData = [],
  child = [],
}) {
  const router = useRouter();

  const [members, setMembers] = useState([
    { name: "self", age: "" },
    { name: gender === "male" ? "wife" : "husband", age: "" },
    ...[
      "father",
      "mother",
      "grandfather",
      "grandmother",
      "fatherinlaw",
      "motherinlaw",
    ].map((m) => ({
      name: m,
      age: "",
    })),
  ]);

  const [selectedMembers, setSelectedMembers] = useState(
    prefilledData?.map((item) => item.name) || []
  );

  //   const [childrenCount, setChildrenCount] = useState(child?.length || 0);

  const maxChildren = 4;
  const [children, setChildren] = useState([]);
  const [isChildChecked, setIsChildChecked] = useState(child.length > 0);

  useEffect(() => {
    if (child && child.length > 0) {
      const mapped = child.map(([type, age]) => ({
        type,
        age: age.toString(),
      }));
      setChildren(mapped.slice(0, maxChildren));
    }
  }, [child]);

  const addChild = () => {
    if (children.length < maxChildren) {
      setChildren([...children, { type: "", age: "" }]);
    } else {
      alert("Maximum Four Children Allowed");
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
  // Load prefilled child data
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
  const showError = (message) => {
  alert(message); 
  
 };

  const handleSubmit = () => {
    const selected = members.filter((m) => selectedMembers.includes(m.name));
    const formData = {
      insuredMembers: selected.map((m) => ({ name: m.name, age: m.age })),
      children: children,
    };

    // Validation
    const getAge = (name) => {
      const m = members.find((m) => m.name === name);
      return m && m.age ? parseInt(m.age, 10) : null;
    };

    const isSelected = (name) => selectedMembers.includes(name);
    if (selected.length === 0) {
      showError("Please select at least one family member.");
      return;
    }

    for (const member of selected) {
      if (!member.age) {
        showError(`Please select age for ${member.name}`);
        return;
      }
    }

    const selfAge = getAge("self");
    const spouseAge = getAge("wife") || getAge("husband");
    const fatherAge = getAge("father");
    const motherAge = getAge("mother");
    const grandfatherAge = getAge("grandfather");
    const grandmotherAge = getAge("grandmother");
    const fatherinlawAge = getAge("fatherinlaw");
    const motherinlawAge = getAge("motherinlaw");


    const checkGap = (older, younger, minGap, label) =>{
      if(older && younger && older - younger < minGap ){
        showError(`The gap between ${label} should be at least ${minGap} years.`);
        return false;
      }
        return true;
    };

     if (
    (isSelected("father") && !checkGap(fatherAge, selfAge, 18, "Self and Father")) ||
    (isSelected("father") && spouseAge && !checkGap(fatherAge, spouseAge, 18, "Spouse and Father")) ||

    (isSelected("mother") && !checkGap(motherAge, selfAge, 18, "Self and Mother")) ||
    (isSelected("mother") && spouseAge && !checkGap(motherAge, spouseAge, 18, "Spouse and Mother")) ||

    (isSelected("fatherinlaw") && !checkGap(fatherinlawAge, selfAge, 18, "Self and Father-in-law")) ||
    (isSelected("fatherinlaw") && spouseAge && !checkGap(fatherInLawAge, spouseAge, 18, "Spouse and Father-in-law")) ||

    (isSelected("motherinlaw") && !checkGap(motherinlawAge, selfAge, 18, "Self and Mother-in-law")) ||
    (isSelected("motherinlaw") && spouseAge && !checkGap(motherInLawAge, spouseAge, 18, "Spouse and Mother-in-law")) ||

    (isSelected("grandfather") && !checkGap(grandfatherAge, selfAge, 36, "Self and Grandfather")) ||
    (isSelected("grandfather") && spouseAge && !checkGap(grandfatherAge, spouseAge, 18, "Spouse and Grandfather")) ||

    (isSelected("grandmother") && !checkGap(grandmotherAge, selfAge, 36, "Self and Grandmother")) ||
    (isSelected("grandmother") && spouseAge && !checkGap(grandmotherAge, spouseAge, 18, "Spouse and Grandmother")) ||

    (isSelected("father") && isSelected("grandfather") && !checkGap(grandfatherAge, fatherAge, 18, "Father and Grandfather")) ||
    (isSelected("father") && isSelected("grandmother") && !checkGap(grandmotherAge, fatherAge, 18, "Father and Grandmother")) ||

    (isSelected("mother") && isSelected("grandfather") && !checkGap(grandfatherAge, motherAge, 18, "Mother and Grandfather")) ||
    (isSelected("mother") && isSelected("grandmother") && !checkGap(grandmotherAge, motherAge, 18, "Mother and Grandmother"))
  ) {
    return;
  }
  // console.log(env.USER);
    console.log("Submitting", formData);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-10 pb-16">
      <section id="slide3" className="w-full max-w-5xl">
        <h5 className="text-lg font-semibold mb-6">
          Select members you want to insure
        </h5>
         {/* <p>User:{env.USER}</p> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src="https://test.digibima.com/public/front/images/DIGIBIMA-1.jpg"
              alt="Slide Image"
            />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${member.name}box`}
                    checked={selectedMembers.includes(member.name)}
                    onChange={() => handleToggle(member.name)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <label
                    htmlFor={`${member.name}box`}
                    className="mr-2 capitalize"
                  >
                    {member.name.replace(/inlaw/, " in-law")}
                  </label>
                  <select
                    name={member.name}
                    value={member.age}
                    onChange={(e) =>
                      ageChange(member.name, e.target.value)
                    }
                    disabled={!selectedMembers.includes(member.name)}
                    className="ml-auto border rounded px-2 py-1"
                  >
                    <option value="">Age</option>
                    {Array.from({ length: 82 }, (_, i) => 18 + i).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Children Section */}
            <div className="col-span-full mt-4">
              <div className="flex items-center justify-between border p-2 rounded">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChildChecked}
                    onChange={toggleChildCheckbox}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>Children</span>
                </label>
                {isChildChecked && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={removeChild}
                      type="button"
                      disabled={children.length === 0}
                      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{children.length}</span>
                    <button
                      onClick={addChild}
                      type="button"
                      disabled={children.length >= maxChildren}
                      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Child Inputs */}
              {isChildChecked && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                  id="childContainer"
                >
                  {children.map((child, index) => (
                    <div key={index} className="flex space-x-2 items-center">
                      <select
                        className="border px-2 py-1 rounded w-1/2"
                        value={child.type}
                        onChange={(e) =>
                          childChange(index, "type", e.target.value)
                        }
                      >
                        <option value="">Select Child</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                      </select>
                      <select
                        className="border px-2 py-1 rounded w-1/2"
                        value={child.age}
                        onChange={(e) =>
                          childChange(index, "age", e.target.value)
                        }
                      >
                        <option value="">Age</option>
                        {Array.from({ length: 24 }, (_, i) => i + 1).map(
                          (age) => (
                            <option key={age} value={age}>
                              {age}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => router.push("/health")}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
