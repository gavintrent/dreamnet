import React, { useEffect, useState } from 'react';
import { paginateByLineEstimate } from '../utils/paginateContent';
import { linkifyMentions } from '../utils/formatMentions';
import NotebookPageStack from './NotebookPageStack';
import DreamControls from './DreamControls';
import CommentsSection from './CommentsSection';

export default function DreamPageViewer(props) {
  const {
    content, liked, likeCount, toggleLike, showComments, setShowComments,
    isPublic, editable, commentCount, onDelete, comments,
    replyingTo, setReplyingTo, newComment, setNewComment, submitComment,
    title, username, timestamp
  } = props;

  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const paginated = paginateByLineEstimate(content, 21, 70).map(linkifyMentions);
    setPages(paginated);
  }, [content]);

  return (
    <div className="flex flex-col items-center ">
      <NotebookPageStack
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        title={title}
        username={username}
        timestamp={timestamp}
      />
      <DreamControls
        {...{ liked, likeCount, toggleLike, showComments, setShowComments, isPublic, editable, commentCount, onDelete }}
      />
      {showComments && (
        <CommentsSection
          {...{ comments, replyingTo, setReplyingTo, newComment, setNewComment, submitComment }}
        />
      )}
    </div>
  );
}
