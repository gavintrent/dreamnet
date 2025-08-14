// PageNavigation.jsx
import React from 'react';

export default function PageNavigation({ currentPage, totalPages, setCurrentPage }) {
  return (
    <>
      <button
        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
        disabled={currentPage === 0}
        className="absolute bottom-2 left-2 z-20 text-2xl text-highlight hover:text-[#a60c74] disabled:opacity-0 font-['Jersey_10']"
      >
        ←
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={currentPage === totalPages - 1}
        className="absolute bottom-2 right-2 z-20 text-2xl text-highlight hover:text-[#a60c74] disabled:opacity-0 font-['Jersey_10']"
      >
        →
      </button>
    </>
  );
}