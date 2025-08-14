import React from 'react';

export default function CommentsSection({
  comments,
  replyingTo,
  setReplyingTo,
  newComment,
  setNewComment,
  submitComment,
}) {
  return (
    <div className="w-[38vw] mt-6 mb-8 bg-white border border-gray-300 rounded-xl shadow-md font-['Jersey_10'] px-6 py-4 text-black">
      {/* Comments */}
      <div className="space-y-6">
        {comments
          .filter(c => c.parent_id === null)
          .map(comment => (
            <div key={comment.id}>
              <p>
                <strong className="text-highlight">@{comment.username}</strong>: {comment.content}
              </p>
              {/* Replies */}
              <div className="ml-6 mt-2 text-sm">
                {comments
                  .filter(r => r.parent_id === comment.id)
                  .map(reply => (
                    <p key={reply.id}>
                      ↳ <strong className="text-highlight">@{reply.username}</strong>: {reply.content}
                    </p>
                  ))}
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="mt-1 text-xs text-highlight hover:underline"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Comment box */}
      <div className="mt-6">
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-1 font-['Jersey_10'] text-sm resize-none focus:outline-none focus:ring-2 ring-highlight"
          rows={1}
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={replyingTo ? 'Replying...' : 'Add a comment'}
        />
        <button
          onClick={submitComment}
          className="mt-2 bg-highlight text-white text-sm px-4 py-1 rounded hover:bg-[#c54ca6]"
        >
          Post
        </button>
      </div>
    </div>
  );
}
