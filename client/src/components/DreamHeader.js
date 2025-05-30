import React from 'react';
import { Link } from 'react-router-dom';

export default function DreamHeader({ dream, editable, onEdit, onDelete }) {
  return (
    <div className="relative pl-16">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-pixelify text-2xl m-0">{dream.title}</h3>
        {dream.username && (
          <p className="jersey-10-regular text-lg m-0">
            — dreamt by <Link to={`/users/${dream.username}`}>@{dream.username}</Link>
          </p>
        )}
      </div>

      {editable && (
        <div className="absolute top-1 right-2 space-x-2">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>

  );
}