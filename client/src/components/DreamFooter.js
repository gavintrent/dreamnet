import { ReactComponent as HeartIcon } from '../assets/icons/heart-svgrepo-com.svg'
import { ReactComponent as CommentIcon } from '../assets/icons/message-text-svgrepo-com.svg'
import { ReactComponent as PublicIcon } from '../assets/icons/sun-svgrepo-com.svg';
import { ReactComponent as PrivateIcon } from '../assets/icons/lock-svgrepo-com.svg';

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
        <button onClick={toggleLike} className="font-pixelify flex items-center gap-1">
          <HeartIcon className={`w-5 h-5 ${liked ? 'text-pink-500' : 'text-gray-400'}`} />
          {likeCount}
        </button>
        <button onClick={() => setShowComments(!showComments)} className = "font-pixelify flex gap-1 items-center justify-center text-sm">
          <CommentIcon className="w-5 h-5 text-gray-400" />
          {showComments ? 'Hide Comments' : commentCount}
        </button>
          <span className="font-pixelify-italic text-gray-500 flex items-center gap-1">
            {editable && (
              <>
                {isPublic ? (
                  <PublicIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <PrivateIcon className="w-4 h-4 text-gray-500" />
                )}
                <span>{isPublic ? 'Public' : 'Private'} •</span>
              </>
            )}
            {new Date(timestamp).toLocaleString()}
          </span>
      </div>
    </div>
  );
}
