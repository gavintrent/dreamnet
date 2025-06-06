import React, { useEffect, useRef, useState } from 'react';
import DreamEntry from './DreamEntry';

export default function DreamGrid({ dreams, users, onUpdate, onDelete }) {
  const editable = !!onUpdate && !!onDelete;
  const [columns, setColumns] = useState([[], []]);
  const refs = useRef([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, dreams.length);

    // Wait until all refs are mounted
    const heights = refs.current.map(ref => ref?.offsetHeight || 0);

    const left = [];
    const right = [];
    let leftHeight = 0;
    let rightHeight = 0;

    dreams.forEach((dream, i) => {
      const height = heights[i];
      if (leftHeight <= rightHeight) {
        left.push(dream);
        leftHeight += height;
      } else {
        right.push(dream);
        rightHeight += height;
      }
    });

    setColumns([left, right]);
  }, [dreams]);

  return (
    <>
      {/* Hidden render for measuring entries */}
      <div className="invisible absolute top-0 left-0">
        {dreams.map((dream, i) => (
          <div key={dream.id} ref={el => refs.current[i] = el} className="w-[40vw]">
            <DreamEntry dream={dream} users={users} {...(editable ? { onUpdate, onDelete } : {})} />
          </div>
        ))}
      </div>

      {/* Actual visible balanced grid */}
      <div className="flex justify-center gap-6">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col w-[40vw]">
            {col.map((dream) => (
              <DreamEntry
                key={dream.id}
                dream={dream}
                users={users}
                {...(editable ? { onUpdate, onDelete } : {})}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}