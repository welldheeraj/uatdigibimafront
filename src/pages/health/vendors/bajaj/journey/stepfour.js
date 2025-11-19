"use client";
import React from "react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import constant from "@/env";
import { useRouter, useSearchParams } from "next/navigation";

export default function StepFourForm({
  stepthreedata,
  step4Form,
  onSubmitStep,
  totalPremium,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEditStep = (stepNo) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("step", stepNo);
    router.push(`/health/vendors/bajaj/journey?${currentParams.toString()}`);
  };

  const proposer = stepthreedata?.proposar || {};
  const members = stepthreedata?.insures || [];
  const nominee = stepthreedata?.nominee || {};
  const pedArray = stepthreedata?.ped || [];


  const PED_MAP = {};

  Object.entries(constant.BAJAJQUESTION.HEALTH).forEach(([id, q]) => {
    PED_MAP[q.name] = { ...q, id, type: "HEALTH" };
  });

  Object.entries(constant.BAJAJQUESTION.LIFESTYLE).forEach(([id, q]) => {
    PED_MAP[q.name] = { ...q, id, type: "LIFESTYLE" };
  });


  let pedData = [];

  try {
    pedArray.forEach((pedItem) => {
      const pedObj = pedItem.data || {};

      Object.entries(pedObj).forEach(([key, value]) => {
        const question = PED_MAP[key];

        if (question) {
          const shortName = pedItem.name?.split(" ")[0] || "Unknown";

          pedData.push({
            questionId: question.id,
            questionLabel: question.label,
            name: shortName,
            type: question.type,
          });
        }
      });
    });
  } catch (err) {
    console.error("PED parsing error:", err);
  }

  const medicalHistory = pedData.filter((i) => i.type === "HEALTH");
  const lifestyleHistory = pedData.filter((i) => i.type === "LIFESTYLE");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-8 bg-[#f9fafb] p-4 sm:p-6 min-h-screen w-full"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-gray-800">📋 Proposal Summary</h2>

        <SectionCard title="Products Details" onEdit={() => handleEditStep(1)}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Image
              src={`${constant.BASE_URL}/front/logo/${stepthreedata?.logo}`}
              alt="carelogo"
              width={80}
              height={40}
              className="object-contain"
            />
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                My Health Care —{" "}
                <span className="text-green-600 font-bold">₹{totalPremium}</span>{" "}
                Coverage
              </h3>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm shadow">
                View All Benefits
              </button>
            </div>
          </div>
        </SectionCard>


        <SectionCard title="Proposer Details" onEdit={() => handleEditStep(1)}>
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

  
        <SectionCard title="Address" onEdit={() => handleEditStep(1)}>
          <p className="text-sm text-gray-600 mb-2">Permanent Address</p>
          <div className="bg-gray-50 p-3 rounded-md border text-sm break-words whitespace-pre-wrap">
            {(() => {
              const addr = proposer.address || {};
              // const { address1, address2, landmark, city, state, pincode } = addr;
              // const formatted = [address1, address2, landmark, city, state, pincode]
              //   .filter(Boolean)
              //   .join(", ");
              // return formatted || "-";
              return addr || "-";
            })()}
          </div>
        </SectionCard>

       
        <SectionCard
          title="Insured Members Details"
          onEdit={() => handleEditStep(2)}
        >
          <Table
            headers={["Name", "Age", "Height", "Weight"]}
            rows={members.map((m) => [
              m.name,
              m.age,
              `${m.height}' ${m.inch}"`,
              m.weight,
            ])}
          />
        </SectionCard>

 
        <SectionCard title="Nominee Details" onEdit={() => handleEditStep(2)}>
          <Table
            headers={["Name", "Relation", "Nominee DOB"]}
            rows={[
              [nominee.name || "-", nominee.relation || "-", nominee.dob || "-"],
            ]}
          />
        </SectionCard>

   
        <SectionCard title="Health Details" onEdit={() => handleEditStep(3)}>
      
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Medical History</h4>
            {medicalHistory.length > 0 ? (
              <Table
                headers={["Sr. No.", "Question", "Patient Name"]}
                rows={medicalHistory.map((item, i) => [
                  i + 1,
                  item.questionLabel,
                  item.name,
                ])}
              />
            ) : (
              <p className="text-gray-500 italic">N/A</p>
            )}
          </div>

      
          <div className="mt-8">
            <h4 className="font-semibold text-gray-800 mb-2">Lifestyle History</h4>
            {lifestyleHistory.length > 0 ? (
              <Table
                headers={["Sr. No.", "Question", "Patient Name"]}
                rows={lifestyleHistory.map((item, i) => [
                  i + 1,
                  item.questionLabel,
                  item.name,
                ])}
              />
            ) : (
              <p className="text-gray-500 italic">N/A</p>
            )}
          </div>
        </SectionCard>
      </div>
    </form>
  );
}


function SectionCard({ title, children, onEdit }) {
  return (
    <div className="relative bg-white shadow-md rounded-xl p-4 sm:p-6 hover:shadow-lg transition w-full overflow-x-auto">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition text-sm flex items-center gap-1"
        >
          <FiEdit className="w-4 h-4" />
          Edit
        </button>
      )}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 break-words">
        {title}
      </h3>
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
          <p className="font-medium text-gray-900 break-words whitespace-pre-wrap">
            {value}
          </p>
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
