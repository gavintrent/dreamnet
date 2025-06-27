// components/ProfileActions.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function ProfileActions({ editable, onFollowToggle, isFollowing }) {
  const navigate = useNavigate();

  if (editable) {
    return (
      <div className="flex justify-center gap-4 mt-6 z-10 mb-4">
        <button
          onClick={() => navigate('/edit-profile')}
          className="px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md"
        >
          Edit Profile
        </button>

        <Link to="/new-dream">
          <button className="px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md">
            + New Journal Entry
          </button>
        </Link>
      </div>
    );
  }

  if (onFollowToggle) {
    return (
      <div className="flex justify-center gap-4 mt-6 z-10 mb-4">
        <button
          onClick={onFollowToggle}
          className="px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md"
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    );
  }

  return null;
}
