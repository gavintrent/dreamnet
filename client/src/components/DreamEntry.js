import React, { useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import api from '../api';
import { linkifyMentions, cleanMentions } from '../utils/formatMentions';
import { Link } from 'react-router-dom';

export default function DreamEntry({ dream, users, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    title: dream.title,
    content: dream.content,
    is_public: dream.is_public
  });
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const editable = !!onUpdate && !!onDelete;

  useEffect(() => {
    api.get(`/likes/${dream.id}`)
      .then(res => setLikeCount(res.data.count))
      .catch(console.error);

    const token = localStorage.getItem('token');
    if (token) {
      api.get(`/likes/${dream.id}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setLiked(res.data.liked))
        .catch(console.error);
    }
  }, [dream.id]);

  const toggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (liked) {
      await api.delete(`/likes/${dream.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLikeCount(c => c - 1);
    } else {
      await api.post(`/likes/${dream.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setLikeCount(c => c + 1);
    }
    setLiked(!liked);
  };

  const handleEdit = () => {
    setEditing(true);
    setMenuOpen(false);
  }
  const handleCancel = () => {
    setEditing(false);
    setForm({
      title: dream.title,
      content: dream.content,
      is_public: dream.is_public
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const cleaned = cleanMentions(form.content); // convert to @username format

    try {
      const res = await api.patch(`/dreams/${dream.id}`, {
        title: form.title,
        content: cleaned,
        is_public: form.is_public
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditing(false);
      onUpdate(res.data);
    } catch (err) {
      console.error('Failed to update dream:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this dream?')) return;
    const token = localStorage.getItem('token');

    try {
      await api.delete(`/dreams/${dream.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(dream.id);
    } catch (err) {
      console.error('Failed to delete dream:', err);
    }
  };

  return (
    <div className="dream-entry" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fafafa', position: 'relative' }}>
      
      {/* Menu Button */}
      {editable && !editing && (
        <div style={{ position: 'absolute', top: 5, right: 10 }}>
          <button onClick={() => setMenuOpen(!menuOpen)}>⋯</button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #ccc', zIndex: 10 }}>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}

      {editing ? (
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
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>{dream.title}</h3>
          {dream.username && (
            <p style={{ marginBottom: '0.3rem' }}>
              by <Link to={`/users/${dream.username}`}>@{dream.username}</Link>
            </p>
          )}
          <p
            dangerouslySetInnerHTML={{
              __html: linkifyMentions(dream.content)
            }}
          />
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
            {editable && (dream.is_public ? '🌐 Public' : '🔒 Private')}{' '}
            {new Date(dream.created_at).toLocaleString()}
          </p>
          <button onClick={toggleLike}>
            {liked ? '💖' : '🤍'} {likeCount}
          </button>
        </>
      )}
    </div>
  );
}