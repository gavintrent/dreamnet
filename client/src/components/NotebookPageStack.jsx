import { AnimatePresence, motion } from 'framer-motion';
import NotebookPage from './NotebookPage';

export default function NotebookPageStack({ pages, currentPage, setCurrentPage, title, username, timestamp }) {
  return (
    <div className="relative w-[38vw] h-[660px] mt-6 mb-2 font-['Jersey_10'] z-10">
      {/* Stacked corners */}
      {pages.length > 1 && (
        <>
          {Array(Math.min(pages.length - currentPage - 1, 4))
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full bg-[var(--cream-color)] border border-gray-500 rounded-xl"
                style={{
                  zIndex: -1 * (i + 1),
                  transform: `translate(${(i + 1) * 4}px, ${(i + 1) * 4}px)`
                }}
              />
            ))}
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <NotebookPage
            htmlContent={pages[currentPage]}
            currentPage={currentPage}
            totalPages={pages.length}
            setCurrentPage={setCurrentPage}
            title={title}
            username={username}
            timestamp={timestamp}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}