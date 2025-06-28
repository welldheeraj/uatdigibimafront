"use client";
import React from "react";
import { FiEdit } from "react-icons/fi";
import constant from "../../../env";

export default function StepFourForm({
  stepthreedata,
  step4Form,
  onSubmitStep,
}) {
  const proposer = stepthreedata?.proposar || {};
  const members = stepthreedata?.insures || [];
  const nominee = stepthreedata?.nominee || {};
  const ped = stepthreedata?.ped || [];
  const lifestyle = stepthreedata?.lifestyle || [];

  let parsedPed = [];

  try {
    stepthreedata?.insures?.forEach((member) => {
      const raw = member?.ped || "[]";
      let individualPed = [];

      if (typeof raw === "string") {
        individualPed = JSON.parse(raw);
      } else if (Array.isArray(raw)) {
        individualPed = raw;
      }

      console.log("Individual PED for", member.name, ":", individualPed);

    
      individualPed.forEach((item) => {
        parsedPed.push({
          ...item,
          name: member.name || "Unknown",
        });
      });
    });

    console.log("Final Combined PED:", parsedPed);
  } catch (err) {
    console.error("Invalid PED JSON:", err);
  }

 
  const medicalHistory = parsedPed.filter(
    (item) => item.did?.startsWith("1.") || item.did?.startsWith("2.")
  );
  const lifestyleHistory = parsedPed.filter((item) =>
    item.did?.startsWith("3.")
  );

  console.log("Medical:", medicalHistory);
  console.log("Lifestyle:", lifestyleHistory);
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-8 bg-[#f9fafb] p-6 min-h-screen"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-gray-800">
          📋 Proposal Summary
        </h2>

        {/* Product Details */}
        <SectionCard title="Products Details" onEdit>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="/coverage.png"
              alt="Coverage"
              className="w-32 h-32 object-contain"
            />
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Care Supreme —{" "}
                <span className="text-green-600 font-bold">₹7,799</span>{" "}
                Coverage
              </h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Unlimited automatic recharge</li>
                <li>No sub limits on treatment</li>
              </ul>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm shadow">
                View All Benefits
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Proposer Details */}
        <SectionCard title="Proposer Details" onEdit>
          <GridDetail
            items={[
              ["Name", proposer.name || "-"],
              ["Phone No.", proposer.mobile || "-"],
              ["Date of Birth", proposer.dob || "-"],
              ["E-Mail ID", proposer.email || "-"],
              [
                "Emergency No.",
                proposer.emergency_mobile || (
                  <span className="text-gray-400 italic">Not Provided</span>
                ),
              ],
            ]}
          />
        </SectionCard>

        {/* Address */}
        <SectionCard title="Address" onEdit>
          <p className="text-sm text-gray-600 mb-2">Permanent Address</p>
          <div className="bg-gray-50 p-3 rounded-md border text-sm">
            {proposer.address || "-"}
          </div>
        </SectionCard>

        {/* Insured Members */}
        <SectionCard title="Insured Members Details" onEdit>
          <Table
            headers={["Name", "Age", "Height", "Weight"]}
            rows={members.map((m) => [
              m.name,
              m.age,
              `${m.height}' ${m.inch}\"`,
              m.weight,
            ])}
          />
        </SectionCard>

        {/* Nominee */}
        <SectionCard title="Nominee Details" onEdit>
          <Table
            headers={["Name", "Relation", "Nominee DOB"]}
            rows={[
              [
                nominee.name || "-",
                nominee.relation || "-",
                nominee.dob || "-",
              ],
            ]}
          />
        </SectionCard>

        {/* Health Details */}
        <SectionCard title="Health Details" onEdit>
          {/* Medical History */}
          <div>
            <h4 className="font-semibold text-gray-800">Medical History</h4>
            {medicalHistory.length > 0 ? (
              medicalHistory.map((item, i) => {
                const questionId = item.did?.replace(".", "");
                const questionText =
                  constant.QUESTION.CAREDISEASE[questionId] ||
                  "Unknown Question";
                return (
                  <div key={i} className="mb-4">
                    <p className="font-medium text-sm text-gray-700">
                      {questionText}
                    </p>
                    <table className="w-full text-sm mt-2 border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Patient Name</th>
                          <th className="p-2 border">Date Of Disease</th>
                          <th className="p-2 border">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">
                            {item.name || proposer.name || "N/A"}
                          </td>
                          <td className="p-2 border">{item.date || "N/A"}</td>
                          <td className="p-2 border">{item.des || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">N/A</p>
            )}
          </div>

          {/* Lifestyle History */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800">Lifestyle History</h4>
            {lifestyleHistory.length > 0 ? (
              lifestyleHistory.map((item, i) => {
                const questionId = item.did?.replace(".", "");
                const questionText =
                  constant.QUESTION.LIFESTYLE[questionId] ||
                  "Unknown Lifestyle Question";
                return (
                  <div key={i} className="mb-4">
                    <p className="font-medium text-sm text-gray-700">
                      {questionText}
                    </p>
                    <table className="w-full text-sm mt-2 border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Patient Name</th>
                          <th className="p-2 border">Quantity</th>
                          <th className="p-2 border">Date Of Disease</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">
                            {item.name || proposer.name || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {item.quantity || "N/A"}
                          </td>
                          <td className="p-2 border">{item.date || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">N/A</p>
            )}
          </div>
        </SectionCard>

        {/* Continue Button */}
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={onSubmitStep}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionCard({ title, children, onEdit }) {
  return (
    <div className="relative bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
      {onEdit && (
        <button className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition text-sm flex items-center gap-1">
          <FiEdit className="w-4 h-4" />
          Edit
        </button>
      )}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function GridDetail({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {items.map(([label, value], i) => (
        <div key={i}>
          <p className="text-gray-500">{label}</p>
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, ri) => (
              <tr key={ri} className="border-t">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2 border-b text-gray-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
