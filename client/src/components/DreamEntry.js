import React from 'react';
import { linkifyMentions } from '../utils/formatMentions';

export default function DreamEntry({ dream }) {
  return (
    <div className="dream-entry" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fafafa' }}>
      <h3>{dream.title}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: linkifyMentions(dream.content)
        }}
      />
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
        {dream.is_public ? '🌐 Public' : '🔒 Private'} — {new Date(dream.created_at).toLocaleString()}
      </p>
    </div>
  );
}