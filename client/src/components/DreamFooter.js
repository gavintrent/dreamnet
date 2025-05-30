export default function DreamFooter({
  liked,
  likeCount,
  toggleLike,
  showComments,
  setShowComments,
  timestamp,
  isPublic,
  editable,
  commentCount
}) {
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex gap-4 items-center justify-center text-sm">
        <button onClick={toggleLike}>
          {liked ? '💖' : '🤍'} {likeCount}
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : `💬 ${commentCount}`}
        </button>
        <span className="font-pixelify-italic text-gray-500">
          {editable && (isPublic ? '🌐 Public • ' : '🔒 Private • ')}
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
