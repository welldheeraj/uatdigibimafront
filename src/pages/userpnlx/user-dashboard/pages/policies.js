import { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { showSuccess, showError } from "@/layouts/toaster";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CallApi } from "@/api";
import constant from "@/env";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

export default function Policy() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromIndex, setFromIndex] = useState(1);

  const skeletonWidths = ["w-8", "w-24", "w-20", "w-28", "w-10","w-10","w-10","w-10","w-10"];
  // const [pagination, setPagination] = useState({
  //   // pageIndex: 0,
  //   // pageSize: 20,
  // });

  const columns = useMemo(
    () => [
      {
        header: "S.No.",
        id: "serial",
        cell: ({ row }) => fromIndex + row.index,
      },
      {
        header: "Proposer Name",
        accessorKey: "proposerName",
      },
      {
        header: "Policy Name",
        accessorKey: "policyName",
      },
      {
        header: "Policy Type",
        accessorKey: "policyType",
      },
      {
        header: "Proposal Number",
        accessorKey: "proposalNumber",
      },
      {
        header: "Policy Number",
        accessorKey: "policyNumber",
      },
      {
        header: "Apply Date",
        accessorKey: "applyDate",
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      // {
      //   header: "Action",
      //   accessorKey: "action",
      //    cell: ({ row }) => (
      //   <button
      //      onClick={() => handleDownload(row.original)}
      //     className="text-blue-600 hover:text-blue-800"
      //     title="Download Policy"
      //   >
      //     <FaDownload />
      //   </button>
      // ),
      // },
      {
  header: "Action",
  accessorKey: "action",
  cell: ({ row }) =>
    row.original?.policy_pdf ? (
      <Link
        href={row.original.policy_pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
        title="Download Policy"
      >
        <FaDownload />
      </Link>
    ) : (
      <FaDownload
        onClick={() => showError("Policy PDF not available")}
        className="text-gray-400 cursor-pointer"
        title="No Policy Available"
      />
    ),
}

    ],
    [fromIndex]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // onPaginationChange: setPagination,
    // manualPagination: true,
    // pageCount: pageCount,
  });

 async function getPolicyPage(pageNum) {
  try {
    setLoading(true); 
    const response = await CallApi(
      `${constant.API.USER.POLICY}?page=${pageNum}`,
      "GET"
    );

    console.log("policy ka res", response);

    const tableData =
      response?.data?.policies?.data?.map((item) => ({
        proposerName: item.proposar_name,
        policyName: item.policy_name,
        policyType: item.policy_type,
        proposalNumber: item.proposal,
        policyNumber: item.policy,
        status: item.status_details || "NA",
         policy_pdf: item.policy_pdf,
      })) || [];

    setData(tableData);
    setPageCount(response?.data?.policies?.last_page || 0);
    setTotalRecords(response?.data?.policies?.total || 0);
    setCurrentPage(response?.data?.policies?.current_page || 1);
    setFromIndex(response?.data?.policies?.from || 1);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); 
  }
}


  useEffect(() => {
    getPolicyPage(1);
  }, []);

const handleDownload = async (policy) => {
    console.log("Download clicked row data:", policy);
    // return false;
  try {
    setLoading(true);

    const res = await CallApi(constant.API.USER.DOWNLOADPOLICY, "POST",policy.policy_pdf_path)
 console.log(res)

  } catch (error) {
    console.error("Download failed:", error);
  } finally {
    setLoading(false);
  }
};


  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) =>
        setData(result.data.filter((row) => row.name && row.position)),
    });
  };

  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const workbook = XLSX.read(reader.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(sheet);
      setData(parsed.filter((row) => row.name && row.position));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full mt-5 overflow-x-auto">
      <div className="rounded-xl shadow-lg border border-blue-200 bg-white overflow-x-auto min-w-full sm:min-w-[600px]">
        <table className="w-full table-auto text-sm text-left text-gray-800">
          <thead className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 text-gray-700 text-xs uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-3 cursor-pointer break-words max-w-[180px] align-top"
                  >
                    <div className="flex items-start gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && (
                        <AiOutlineArrowUp className="text-sm text-blue-600" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <AiOutlineArrowDown className="text-sm text-blue-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-blue-100">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {skeletonWidths.map((width, index) => (
                      <td key={index} className="px-5 py-3">
                        <div
                          className={`h-4 ${width} bg-gray-200 animate-pulse rounded`}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`transition-all hover:bg-blue-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-5 py-3 break-words max-w-[180px] align-top"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + Total Info */}
      <div className="flex justify-between items-center flex-wrap gap-4 pt-4">
        <div className="bg-yellow-100 text-gray-800 px-4 py-2 rounded-full text-sm shadow-inner">
          Total <span className="font-semibold">{totalRecords}</span> Records
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* First + Prev */}
          <button
            onClick={() => getPolicyPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
          >
            «
          </button>
          <button
            onClick={() => getPolicyPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => getPolicyPage(i + 1)}
              className={`px-3 py-1 rounded-full text-sm transition font-medium ${
                currentPage === i + 1
                  ? "bg-blue-800 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next + Last */}
          <button
            onClick={() => getPolicyPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
          >
            ›
          </button>
          <button
            onClick={() => getPolicyPage(pageCount)}
            disabled={currentPage === pageCount}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
