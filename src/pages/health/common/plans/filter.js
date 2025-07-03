import React from "react";
const FilterForm = ({
  filterData,
  register,
  handleSubmit,
  onSubmit,
  filters,
  onFilterChange,
}) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-center gap-3 text-sm mb-8"
    >
      {filterData.map((item, i) => {
        const isDisabled = ["planType", "insurers", "features"].includes(
          item.name
        );
        return (
          <div
            key={i}
            className={`flex items-center rounded-full bg-white px-3 py-1.4 border ${
              isDisabled
                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                : "border-gray-400"
            } shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <span className="text-indigo-600 text-xs pr-2">
              {item.label}
            </span>
            <select
              {...register(item.name)}
              disabled={isDisabled}
              name={item.name}
              value={filters[item.name] || ""}
              onChange={onFilterChange}
              className={`bg-white text-gray-800 font-medium text-xs px-2 py-1 rounded-md focus:outline-none transition ${
                isDisabled ? "bg-gray-100 text-gray-500" : "cursor-pointer"
              }`}
            >
              {item.options.map((opt, idx) => {
                let optionValue =
                  opt === "1 Cr"
                    ? "100"
                    : opt.replace(" Lac", "").replace(" Year", "");
                return (
                  <option
                    key={idx}
                    value={optionValue}
                    disabled={opt === "Select"}
                  >
                    {opt}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}

      <button type="submit" className="px-6 py-1 thmbtn">
        Apply
      </button>
    </form>
  );
};
export default FilterForm;
