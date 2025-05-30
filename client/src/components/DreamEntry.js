import React, { useState, useEffect } from 'react';
import DreamHeader from './DreamHeader';
import DreamEditor from './DreamEditor';
import DreamFooter from './DreamFooter';
import CommentsSection from './CommentsSection';
import useDreamLikes from '../hooks/useDreamLikes';
import api from '../api';
import { linkifyMentions, cleanMentions } from '../utils/formatMentions';

export default function DreamEntry({ dream, users, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: dream.title,
    content: dream.content,
    is_public: dream.is_public
  });

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const editable = !!onUpdate && !!onDelete;
  const { likeCount, liked, toggleLike } = useDreamLikes(dream.id);

  useEffect(() => {
    if (!showComments) return;
    api.get(`/comments/${dream.id}`)
      .then(res => setComments(res.data))
      .catch(console.error);
  }, [showComments, dream.id]);

  const submitComment = async () => {
    const token = localStorage.getItem('token');
    const userRes = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const res = await api.post(`/comments/${dream.id}`, {
      content: newComment,
      parent_id: replyingTo || null
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setComments(prev => [...prev, { ...res.data, username: userRes.data.username }]);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleEdit = () => setEditing(true);
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
    const cleaned = cleanMentions(form.content);

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

  const topLevelCount = comments.filter(c => c.parent_id === null).length;


  return (
    <div className="px-48 mt-4">
    <div className="dream-entry bg-base-100 shadow-md rounded-2xl p-6 mb-6 border border-base-300 text-white">
      {editing ? (
        <DreamEditor form={form} setForm={setForm} users={users} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <>
          <DreamHeader dream={dream} editable={editable} onEdit={handleEdit} onDelete={handleDelete} />
          <p 
            className="jersey-10-thin px-24 whitespace-pre-line leading-relaxed"
            dangerouslySetInnerHTML={{ __html: linkifyMentions(dream.content) }} 
          />
          <DreamFooter
            liked={liked}
            likeCount={likeCount}
            toggleLike={toggleLike}
            showComments={showComments}
            setShowComments={setShowComments}
            timestamp={dream.created_at}
            isPublic={dream.is_public}
            editable={editable}
            commentCount={topLevelCount}
          />
          {showComments && (
            <CommentsSection
              comments={comments}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              newComment={newComment}
              setNewComment={setNewComment}
              submitComment={submitComment}
            />
          )}
        </>
      )}
    </div>
    </div>
  );
}
