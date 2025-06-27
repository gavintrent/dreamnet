import React, { useState, useEffect } from "react";
import useDreamLikes from "../hooks/useDreamLikes";
import api from "../api";
import { cleanMentions, linkifyMentions } from "../utils/formatMentions";
import { paginateByLineEstimate } from "../utils/paginateContent";
import NotebookPageStack from "./NotebookPageStack";
import DreamControls from "./DreamControls";
import CommentsSection from "./CommentsSection";

export default function DreamEntry({ dream, users, onUpdate, onDelete }) {
  // eslint-disable-next-line
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: dream.title,
    content: dream.content,
    is_public: dream.is_public,
  });


  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const editable = !!onUpdate && !!onDelete;
  const { likeCount, liked, toggleLike } = useDreamLikes(dream.id);

  useEffect(() => {
    if (!showComments) return;
    api
      .get(`/comments/${dream.id}`)
      .then((res) => setComments(res.data))
      .catch(console.error);
  }, [showComments, dream.id]);

  const submitComment = async () => {
    const token = localStorage.getItem("token");
    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await api.post(
      `/comments/${dream.id}`,
      {
        content: newComment,
        parent_id: replyingTo || null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setComments((prev) => [
      ...prev,
      { ...res.data, username: userRes.data.username },
    ]);
    setNewComment("");
    setReplyingTo(null);
  };

  // eslint-disable-next-line
  const handleEdit = () => setEditing(true);
  // eslint-disable-next-line
  const handleCancel = () => {
    setEditing(false);
    setForm({
      title: dream.title,
      content: dream.content,
      is_public: dream.is_public,
    });
  };
  // eslint-disable-next-line
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const cleaned = cleanMentions(form.content);

    try {
      const res = await api.patch(
        `/dreams/${dream.id}`,
        {
          title: form.title,
          content: cleaned,
          is_public: form.is_public,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(false);
      onUpdate(res.data);
    } catch (err) {
      console.error("Failed to update dream:", err);
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Delete this dream?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/dreams/${dream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Deleted dream:", dream.id);
      onDelete(dream.id);
    } catch (err) {
      console.error("Failed to delete dream:", err);
    }
  };

  const topLevelCount = comments.filter((c) => c.parent_id === null).length;
  const isPublic = dream.is_public

  useEffect(() => {
    const paginated = paginateByLineEstimate(dream.content, 21, 72).map(linkifyMentions);
    setPages(paginated);
  }, [dream.content]);

  return (
    <div className="flex flex-col items-center ">
      <NotebookPageStack
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        title={dream.title}
        username={dream.username}
        timestamp={dream.created_at}
      />
      <DreamControls
        liked={liked}
        likeCount={likeCount}
        toggleLike={toggleLike}
        showComments={showComments}
        setShowComments={setShowComments}
        isPublic={isPublic}
        editable={editable}
        topLevelCount={topLevelCount}
        onDelete={handleDelete}
      />
      {showComments && (
        <CommentsSection
          {...{ comments, replyingTo, setReplyingTo, newComment, setNewComment, submitComment }}
        />
      )}
    </div>
  );
}
