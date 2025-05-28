import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';

export default function DreamEditor({ form, setForm, users, onSave, onCancel }) {
  return (
    <>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />

      <MentionsInput
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Edit your dream..."
        style={{ minHeight: '80px', width: '100%', marginBottom: '0.5rem' }}
      >
        <Mention
          trigger="@"
          markup="@\[__display__\](__id__)"
          data={(query, callback) => {
            const filtered = users
              .filter(u => u.id.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5)
              .map(u => ({ id: u.id, display: u.display }));
            callback(filtered);
          }}
          displayTransform={(id) => `@${id}`}
          appendSpaceOnAdd
        />
      </MentionsInput>

      <label>
        <input
          type="checkbox"
          checked={form.is_public}
          onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
        />{' '}
        Make public
      </label>

      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </>
  );
}
