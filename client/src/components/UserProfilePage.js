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
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {profile?.avatar && (
            <img
              src={`${profile.avatar}`}
              alt={`${username}'s avatar`}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                marginRight: '1rem',
                objectFit: 'cover',
                border: '1px solid #ccc'
              }}
            />
          )}
          <div>
            <h2 style={{ margin: 0 }}>@{username}'s Dream Journal</h2>
            {profile?.name && <h3 style={{ margin: 0 }}>{profile.name}</h3>}
            {profile?.bio && <p style={{ margin: '0.3rem 0 0' }}>{profile.bio}</p>}
          </div>
        </div>

        {editable ? (
          <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        ) : onFollowToggle ? (
          <button onClick={onFollowToggle}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        ) : null}
      </div>

      {editable && (
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/new-dream">
            <button>Add New Dream</button>
          </Link>
        </div>
      )}

      {dreams.length === 0 ? (
        <p>{editable ? 'You have no dreams yet.' : 'No public dreams yet.'}</p>
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
  );
}
