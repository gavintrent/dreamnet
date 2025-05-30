import React from 'react';
import DreamEntry from '../components/DreamEntry';
import { Link, useNavigate } from 'react-router-dom';

export default function UserProfilePage({
  username,
  profile,
  dreams,
  users,
  editable,
  onUpdate,
  onDelete,
  onFollowToggle,
  isFollowing
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-[4.5rem]">
      {/* Outer centered container */}
      <div className="mx-auto w-[80vw] relative text-white">
        {/* Avatar + header */}
        <div className="flex items-center">
          {profile?.avatar && (
            <img
              src={profile.avatar}
              alt={`${username}'s avatar`}
              className="w-16 h-16 rounded-full mr-4 object-cover border border-base-300"
            />
          )}
          <div className="font-pixelify -translate-y-12">
            <h2 className="text-lg translate-x-8 m-0">
              @{username}'s Dream Journal
            </h2>
            {profile?.name && (
              <h3 className="jersey-10-thin m-0 translate-x-4">
                {profile.name}
              </h3>
            )}
            {profile?.bio && (
              <p className="jersey-10-thin mt-1 mb-0">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Button row below the avatar/header */}
        <div className="relative mt-4 h-10">
          {editable ? (
            <>
              {/* Edit Profile aligned left */}
              <button
                onClick={() => navigate('/edit-profile')}
                className="absolute left-0 jersey-10-thin"
              >
                Edit Profile
              </button>
              {/* Add New Dream centered */}
              <Link
                to="/new-dream"
                className="absolute left-1/2 transform -translate-x-1/2"
              >
                <button className="jersey-10-thin">Add New Dream</button>
              </Link>
            </>
          ) : onFollowToggle ? (
            /* Follow/Unfollow aligned left when not editable */
            <button
              onClick={onFollowToggle}
              className="absolute left-0 jersey-10-thin"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Dream entries */}
      <div className="mt-6">
        {dreams.length === 0 ? (
          <p className="text-center">
            {editable ? 'You have no dreams yet.' : 'No public dreams yet.'}
          </p>
        ) : (
          dreams.map((dream) => (
            <DreamEntry
              key={dream.id}
              dream={dream}
              users={users}
              {...(editable ? { onUpdate, onDelete } : {})}
            />
          ))
        )}
      </div>
    </div>
  );
}
