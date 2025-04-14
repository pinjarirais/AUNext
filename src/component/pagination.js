import React from "react";

function Pagination({ pagenumber, currentpg, onPageChange }) {
  const handlePrevious = () => {
    if (currentpg > 0) {
      onPageChange(currentpg - 1); // call parent handler
    }
  };

  const handleNext = () => {
    if (currentpg < pagenumber.length - 1) {
      onPageChange(currentpg + 1); // call parent handler
    }
  };

  return (
    <div className="pb-6 pt-2 flex items-center">
      <button
        onClick={handlePrevious}
        disabled={currentpg === 0}
        className={`px-3 py-1 cursor-pointer rounded-md text-xs ${
          currentpg === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#6d3078] text-white"
        }`}
      >
        {"<"} Pre
      </button>
      <ul className="flex space-x-1 pl-4 pr-4">
        {pagenumber.map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={`px-3 py-1 rounded cursor-pointer ${
              pg === currentpg
                ? "bg-[#6d3078] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {pg + 1}
          </button>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={currentpg === pagenumber.length - 1}
        className={`px-3 py-1 cursor-pointer rounded-md text-xs ${
          currentpg === pagenumber.length - 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#6d3078] text-white"
        }`}
      >
        Next {">"}
      </button>
    </div>
  );
}

export default Pagination;
