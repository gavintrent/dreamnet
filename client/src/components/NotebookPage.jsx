// NotebookPage.jsx
import React from 'react';
import NotebookHeader from './NotebookHeader';
import PageNavigation from './PageNavigation';

export default function NotebookPage({ htmlContent, currentPage, totalPages, setCurrentPage, title, username, timestamp }) {
  return (
    <div className="absolute inset-0 bg-[#f6eee3] border border-gray-400 rounded-xl shadow-md overflow-hidden">
      {/* Lined Background */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-xl overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[...Array(Math.ceil(650 / 30))].map((_, i) => (
            <line
              key={i}
              x1="8%"
              x2="92%"
              y1={30 * (i + 1)}
              y2={30 * (i + 1)}
              stroke="#bbb"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Header */}
      {currentPage === 0 && (
        <NotebookHeader title={title} username={username} timestamp={timestamp} />
      )}

      {/* Content */}
      <div className="relative z-10 px-[8%] pt-[0px] leading-[30px] text-black whitespace-pre-wrap font-['Jersey_10']">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      {/* Arrows */}
      {totalPages > 1 && (
        <PageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}