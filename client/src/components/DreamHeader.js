import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/icons/trash-svgrepo-com.svg'
import { ReactComponent as EditIcon } from '../assets/icons/edit-svgrepo-com.svg'

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
        <div className="jersey-10-regular text-gray-500 flex absolute top-1 right-2 space-x-2">
          <button onClick={onEdit} className="hover:text-[#d40f95]">
            <EditIcon className="w-5 h-5"/>
          </button>
          <button onClick={onDelete} className="hover:text-[#d40f95]">
            <DeleteIcon className="w-5 h-5"/>
          </button>
        </div>
      )}
    </div>

  );
}