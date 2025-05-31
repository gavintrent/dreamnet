import React from 'react';

export default function CommentsSection({ comments, replyingTo, setReplyingTo, newComment, setNewComment, submitComment }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      {comments
        .filter(c => c.parent_id === null)
        .map(comment => (
          <div key={comment.id} style={{ marginBottom: '1rem' }}>
            <strong>@{comment.username}</strong>: {comment.content}
            <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
              {comments
                .filter(r => r.parent_id === comment.id)
                .map(reply => (
                  <div key={reply.id}>
                    ↳ <strong>@{reply.username}</strong>: {reply.content}
                  </div>
                ))}
              <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
            </div>
          </div>
        ))}
      <div className="flex-flex-col items-center justify-center ">
        <textarea className="textarea textarea-bordered w-full max-w-xl"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={replyingTo ? 'Replying...' : 'Add a comment'}
        />
      </div>
      <button onClick={submitComment}>Post</button>
    </div>
  );
}
