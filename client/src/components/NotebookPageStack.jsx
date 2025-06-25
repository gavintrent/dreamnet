// NotebookPageStack.jsx
import React from 'react';
import NotebookPage from './NotebookPage';

export default function NotebookPageStack({ pages, currentPage, setCurrentPage, title, username, timestamp }) {
  return (
    <div className="relative w-[38vw] h-[660px] mt-6 mb-2 font-['Jersey_10']">
      {/* Stacked background pages */}
      {pages.length > 1 && (
        <>
          {Array(Math.min(pages.length - currentPage - 1, 4))
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full bg-[#eee7d7] border border-gray-300 rounded-xl"
                style={{
                  zIndex: -1 * (i + 1),
                  transform: `translate(${(i + 1) * 4}px, ${(i + 1) * 4}px)`
                }}
              />
            ))}
        </>
      )}

      <NotebookPage
        htmlContent={pages[currentPage]}
        currentPage={currentPage}
        totalPages={pages.length}
        setCurrentPage={setCurrentPage}
        title={title}
        username={username}
        timestamp={timestamp}
      />
    </div>
  );
}