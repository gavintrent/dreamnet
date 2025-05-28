import React from 'react';

export default function DreamFooter({ liked, likeCount, toggleLike, showComments, setShowComments, timestamp, isPublic, editable, commentCount }) {
  return (
    <>
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {editable && (isPublic ? '🌐 Public' : '🔒 Private')} {new Date(timestamp).toLocaleString()}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={toggleLike}>
          {liked ? '💖' : '🤍'} {likeCount}
        </button>
        <button onClick={() => setShowComments(!showComments)}>
            {showComments ? 'Hide Comments' : `Show Comments (${commentCount})`}
        </button>
      </div>
    </>
  );
}
