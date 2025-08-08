import { useEffect, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import Modal from "@/components/modal";

const ManageUser = ({ token }) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromIndex, setFromIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await CallApi(constant.API.ADMIN.MANAGEUSER, "GET");
      if (response?.status) {
        setData(response.data || []);
        setTotalRecords((response.data || []).length);
        setPageCount(Math.ceil((response.data || []).length / 10));
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const columns = useMemo(
    () => [
      {
        header: "S.No.",
        id: "serial",
        cell: ({ row }) => fromIndex + row.index,
      },
      {
        header: "Mobile Number",
        accessorKey: "mobile",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedUser(row.original); 
              setShowViewModal(true); 
            }}
            className="text-blue-600 hover:underline"
          >
            <VisibilityIcon />
          </button>
        ),
      },
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
  });

  const getUserPage = (page) => {
    setCurrentPage(page);
    setFromIndex((page - 1) * 10 + 1);
    table.setPageIndex(page - 1);
  };

  return (
    <>
      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        title="View User"
        width="max-w-md"
        height="max-h-[40vh]"
        showConfirmButton={false}
        showCancelButton={true}
      >
        <div className=" space-y-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              value={selectedUser?.name || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={selectedUser?.mobile || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Created At
            </label>
            <input
              type="text"
              value={selectedUser?.created_at || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          {/* <div className="flex justify-start gap-4 pt-2">
            <button
              className="px-4 py-2 thmbtn"
              onClick={() => {
                setShowViewModal(false);
                setSelectedUser(null);
              }}
            >
              Close
            </button>
          </div> */}
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-xl">
        <h2 className="text-xl font-semibold">Manage User</h2>
      </div>

      {/* Table Wrapper */}
      <div className="w-full mt-5 overflow-x-auto">
        <div className="rounded-xl shadow-lg border border-blue-200 bg-white overflow-x-auto min-w-full sm:min-w-[600px]">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-2 w-full sm:w-64 border border-gray-300 rounded shadow-sm text-sm"
            />
          </div>

          {/* Table */}
          <table className="w-full table-auto text-sm text-left text-gray-800">
            <thead className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 text-gray-700 text-xs uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-5 py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && <span>🔼</span>}
                        {header.column.getIsSorted() === "desc" && <span>🔽</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
           <tbody className="divide-y divide-blue-100">
  {loading ? (
    Array.from({ length: 5 }).map((_, index) => (
      <tr key={index}>
        <td className="px-5 py-3">
          <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
        </td>
        <td className="px-5 py-3">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </td>
        <td className="px-5 py-3">
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
        </td>
        <td className="px-5 py-3">
          <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
        </td>
        <td className="px-5 py-3">
          <div className="h-4 w-10 bg-gray-200 animate-pulse rounded"></div>
        </td>
      </tr>
    ))
  ) : (
    table.getRowModel().rows.map((row, i) => (
      <tr
        key={row.id}
        className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-5 py-3">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center flex-wrap gap-4 pt-4 px-2 sm:px-0">
          <div className="bg-yellow-100 text-gray-800 px-4 py-2 rounded-full text-sm shadow-inner">
            Total <span className="font-semibold">{totalRecords}</span> Records
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => getUserPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
            >
              «
            </button>
            <button
              onClick={() => getUserPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
            >
              ‹
            </button>

            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => getUserPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-800 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => getUserPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
            >
              ›
            </button>
            <button
              onClick={() => getUserPage(pageCount)}
              disabled={currentPage === pageCount}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm disabled:opacity-30 hover:bg-blue-700"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUser;
