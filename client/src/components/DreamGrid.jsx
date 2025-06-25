import React from 'react';
import DreamEntry from './DreamEntry';
import { dreamFacts } from '../assets/facts/dreamFacts';
import { sleepHealthTips } from '../assets/facts/sleepHealth';

export default function DreamGrid({ dreams, users, onUpdate, onDelete }) {
  const editable = !!onUpdate && !!onDelete;
  const allFacts = [...dreamFacts, ...sleepHealthTips]

  // Helper: interleave info boxes
  const interleaved = dreams.flatMap((dream, idx) => {
    const items = [
      <DreamEntry
        key={dream.id}
        dream={dream}
        users={users}
        {...(editable ? { onUpdate, onDelete } : {})}
      />
    ];

    if ((idx + 1) % 8 === 0) {
      const randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
      items.push(
        <div
          key={`info-${idx}`}
          className="col-span-full w-full bg-yellow-200 border border-yellow-300 text-yellow-900 rounded-md p-3 text-center font-pixelify"
        >
          {randomFact}
        </div>
      );
    }

    return items;
  });

  // Add one at the top
  const introFact = allFacts[Math.floor(Math.random() * allFacts.length)];
  interleaved.unshift(
    <div
      key="info-intro"
      className="col-span-full w-full bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-md p-3 text-center font-pixelify"
    >
      {introFact}
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-6xl px-4">
        {interleaved}
      </div>
    </div>
  );
}
