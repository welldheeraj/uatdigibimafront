import { useEffect, useMemo, useState } from "react";
import Layout from "./component/layout";
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

import { CallApi } from "../../api";
import constant from "../../env";
// import ButtonList from "./ButtonList";


export default function Policy() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [pageCount, setPageCount] = useState(0);

  // const buttons = []
  const columns = useMemo(
    () => [
      {
        header: "S.No.",
        id: "serial",
        cell: ({ row }) => row.index + 1,
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
      {
        header: "Action",
        accessorKey: "action",
      },
    ],
    []
  );

  // for (let i = 1; i <= pageCount; i++) {
  //   buttons.push(
  //     <button
  //       key={i}
  //       className="px-4 py-2 bg-blue-400 text-white rounded"
  //       onClick={getPolicyPage(i)}
  //     >
  //       {i}
  //     </button>
  //   )
  // }

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,

    manualPagination: true,
    pageCount: pageCount,
  });

  async function getPolicyPage(page) {
    try {

      const response = await CallApi(`${constant.API.USER.POLICY}?page=${page}`, "GET");

      console.log("policy ka res", response)


      const tableData = response?.data?.policies?.data?.map((item) => ({
        proposerName: item.proposar_name,
        policyName: item.policy_name,
        policyType: item.policy_type,
        proposalNumber: item.proposal,
        policyNumber: item.policy,
        // applyDate : item,
        status: item.status_details || "NA",
      })) || [];
      setData(tableData);
      setPageCount(response?.data?.policies?.last_page || 0);
      setTotalRecords(response?.data?.policies?.total || 0);
      return
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    // async function getPolicy() {
    //   try {
    //     const page = pagination.pageIndex + 1;
    //     const response = await CallApi(`${constant.API.USER.POLICY}?page=${page}`, "GET");

    //     console.log("policy ka res", response)


    //     const tableData = response?.data?.policies?.data?.map((item) => ({
    //       proposerName: item.proposar_name,
    //       policyName: item.policy_name,
    //       policyType: item.policy_type,
    //       proposalNumber: item.proposal,
    //       policyNumber: item.policy,
    //       // applyDate : item,
    //       status: item.status_details || "NA",

    //     })) || [];

    //     setData(tableData);


    // setPageCount(response?.data?.policies?.last_page || 0);
    // setTotalRecords(response?.data?.policies?.total || 0);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    getPolicyPage(1);
  }, []);

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
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 border rounded"
          />
          {/* <label className="text-sm font-medium">Import CSV:
            <input type="file" accept=".csv" onChange={handleCSVImport} className="ml-2" />
          </label>
          <label className="text-sm font-medium">Import Excel:
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="ml-2" />
          </label> */}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left text-gray-700">
            <thead className="bg-gray-100 uppercase text-xs font-semibold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-2 border cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc"
                        ? " 🔼"
                        : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border">
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

        {/* Pagination */}
        {/* <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div> */}



        {/* New pagination */}
        <div className="flex justify-between items-center pt-4 flex-wrap gap-4">
          {/* Left side: Total Records */}
          <div className="bg-yellow-100 text-black px-3 py-1 rounded">
            Total {totalRecords} Records
          </div>

          {/* Right side: Pagination Numbers */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
              disabled={pagination.pageIndex === 0}
              className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
            >
              «
            </button>

            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              disabled={pagination.pageIndex === 0}
              className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
            >
              ‹
            </button>

            {/* Page Numbers */}
            {/* {Array.from({ length: pageCount }, (_, i) => i).map((page) => {
      // Only show current page, first 2, last 2, or close neighbors
      if (
        page === 0 ||
        page === pageCount - 1 ||
        Math.abs(page - pagination.pageIndex) <= 2
      ) {
        return (
          <button
            key={page}
            onClick={() =>
              setPagination((prev) => ({ ...prev, pageIndex: page }))
            }
            className={`px-3 py-1 border rounded ${
              page === pagination.pageIndex
                ? "bg-white border-gray-500"
                : "bg-blue-700 text-white"
            }`}
          >
            {page + 1}
          </button>
        );
      } else if (
        Math.abs(page - pagination.pageIndex) === 3 &&
        page !== 1 &&
        page !== pageCount - 2
      ) {
        return (
          <span key={page} className="px-2 py-1">
            ...
          </span>
        );
      } else {
        return null;
      }
    })} */}



  {/* <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          className="px-4 py-2 bg-blue-500 text-white rounded "
        >
           {i + 1}
        </button>
      ))}
    </div> */}


    {/* <ButtonList pageCount={pageCount} pageClick={getPolicyPage()}/> */}

            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.min(prev.pageIndex + 1, pageCount - 1),
                }))
              }
              disabled={pagination.pageIndex >= pageCount - 1}
              className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
            >
              ›
            </button>

            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }))
              }
              disabled={pagination.pageIndex >= pageCount - 1}
              className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>

      </div>


    </Layout>
  );
}
