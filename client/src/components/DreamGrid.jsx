import React, { useMemo } from 'react';
import DreamEntry from './DreamEntry';
import { dreamFacts } from '../assets/facts/dreamFacts';
import { sleepHealthTips } from '../assets/facts/sleepHealth';

export default function DreamGrid({ dreams, users, onUpdate, onDelete }) {
  const editable = !!onUpdate && !!onDelete;
  const allFacts = [...dreamFacts, ...sleepHealthTips];

  // Memoize the facts per dream list
  const factBlocks = useMemo(() => {
    const blocks = [];

    dreams.forEach((dream, idx) => {
      blocks.push(
        <DreamEntry
          key={dream.id}
          dream={dream}
          users={users}
          {...(editable ? { onUpdate, onDelete } : {})}
        />
      );

      // Add fact block after the first row (every 2 dreams in md:grid-cols-2)
      // and then every 8 rows (every 16 dreams)
      if ((idx + 1) % 2 === 0 && ((idx + 1) / 2 === 1 || (idx + 1) % 8 === 0)) {
        const fact = allFacts[Math.floor(Math.random() * allFacts.length)];
        blocks.push(
          <div
            key={`info-${idx}`}
            className="col-span-full w-full bg-[var(--accent-yellow)] text-yellow-900 rounded-md p-3 text-center font-pixelify"
          >
            {fact}
          </div>
        );
      }
    });

    return blocks;
    // eslint-disable-next-line
  }, [dreams, users, onUpdate, onDelete]); // rerun only when relevant data changes

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-6xl px-4">
        {factBlocks}
      </div>
    </div>
  );
}