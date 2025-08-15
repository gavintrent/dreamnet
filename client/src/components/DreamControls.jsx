// DreamControls.jsx
import { ReactComponent as HeartIcon } from '../assets/icons/heart-svgrepo-com.svg';
import { ReactComponent as CommentIcon } from '../assets/icons/message-text-svgrepo-com.svg';
import { ReactComponent as PublicIcon } from '../assets/icons/sun-svgrepo-com.svg';
import { ReactComponent as PrivateIcon } from '../assets/icons/lock-svgrepo-com.svg';
import { ReactComponent as DeleteIcon } from '../assets/icons/trash-svgrepo-com.svg';

export default function DreamControls({
  liked,
  likeCount,
  toggleLike,
  showComments,
  setShowComments,
  isPublic,
  editable,
  commentCount,
  onDelete,
}) {
  return (
            <div className="mt-2 flex gap-6 items-center justify-center text-sm font-pixelify text-highlight">
      {editable && (
        <span className="flex items-center">
          {isPublic ? (
            <PublicIcon className="w-4 h-4" />
          ) : (
            <PrivateIcon className="w-4 h-4" />
          )}
          <span className="ml-1">{isPublic ? 'Public' : 'Private'}</span>
        </span>
      )}

      <button onClick={toggleLike} className="flex items-center gap-1 hover:text-pink-500">
                  <HeartIcon className={`w-4 h-4 ${liked ? 'text-[var(--cream-color)]' : 'text-highlight'}`} />
        <span>{likeCount}</span>
      </button>

      <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 hover:text-pink-500">
                  <CommentIcon className="w-4 h-4 text-highlight" />
        <span>{showComments ? 'Hide Comments' : commentCount}</span>
      </button>

      {editable && (
        <button onClick={onDelete} className="hover:text-[#d40f95]">
          <DeleteIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}