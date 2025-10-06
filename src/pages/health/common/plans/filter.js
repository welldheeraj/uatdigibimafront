"use client";
import React, { useMemo, useCallback } from "react";

const FilterForm = ({
  filterData,
  register,
  handleSubmit,
  onSubmit,
  filters,
  onFilterChange,
  loadingPlans,
}) => {
  const handleChange = useCallback(
    (e) => onFilterChange(e),
    [onFilterChange]
  );

  const filterOptions = useMemo(
    () =>
      filterData.map((item, i) => {
        const isDisabled = ["insurers", "features"].includes(item.name);

        return (
          <div
            key={i}
            className={`flex items-center rounded-full bg-white px-3 py-1.4 border ${
              isDisabled
                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                : "border-gray-400"
            } shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <span className="text-indigo-600 text-xs pr-2">{item.label}</span>
            <select
              {...register(item.name)}
              disabled={isDisabled}
              name={item.name}
              value={filters[item.name] || ""}
              onChange={handleChange}
              className={`bg-white text-gray-800 font-medium text-xs px-2 py-1 rounded-md focus:outline-none transition ${
                isDisabled ? "bg-gray-100 text-gray-500" : "cursor-pointer"
              }`}
            >
              {item.options.map((opt, idx) => {
                const isObj = typeof opt === "object" && opt !== null;
                const displayText = isObj ? opt.label : opt;
                let optionValue;
                if (isObj) optionValue = opt.value;
                else if (item.name === "plantype") optionValue = opt === "Base" ? "1" : opt === "Port" ? "2" : "";
                else if (item.name === "tenure") optionValue = opt.replace(/\s*Years?$/, "");
                else optionValue = opt === "1 Cr" ? "100" : opt.replace(" Lac", "");

                return (
                  <option
                    key={idx}
                    value={optionValue}
                    disabled={
                      displayText === "Select" &&
                      !(item.name === "insurers" )
                    }
                  >
                    {displayText}
                  </option>
                );
              })}
            </select>
          </div>
        );
      }),
    [filterData, filters, register, handleChange]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-center gap-3 text-sm mb-8"
    >
      {filterOptions}
      <button
        type="submit"
        className="px-6 py-1 thmbtn flex items-center justify-center gap-2"
        disabled={loadingPlans}
      >
        {loadingPlans ? (
          <>
            Applying
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </>
        ) : (
          "Apply"
        )}
      </button>
    </form>
  );
};

export default FilterForm;
