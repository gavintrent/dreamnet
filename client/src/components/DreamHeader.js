import React from 'react';
import { Link } from 'react-router-dom';

export default function DreamHeader({ dream, editable, onEdit, onDelete }) {
  return (
    <div style={{ position: 'relative' }}>
      <h3>{dream.title}</h3>
      {dream.username && (
        <p style={{ marginBottom: '0.3rem' }}>
          by <Link to={`/users/${dream.username}`}>@{dream.username}</Link>
        </p>
      )}
      {editable && (
        <div style={{ position: 'absolute', top: 5, right: 10 }}>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
