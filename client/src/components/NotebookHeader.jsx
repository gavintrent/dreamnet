// NotebookHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotebookHeader({ title, username, timestamp }) {
  return (
    <div className="flex justify-between items-center pt-[5px] text-black leading-[30px] px-[8%] font-['Jersey_10']">
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-xl">{title}</span>{' '}
        <span className="text-sm">
          — dreamt by{' '}
          <Link to={`/users/${username}`} className="text-highlight hover:underline">
            @{username}
          </Link>
        </span>
      </span>
      <span className="text-sm whitespace-nowrap">{new Date(timestamp).toLocaleDateString()}</span>
    </div>
  );
}
