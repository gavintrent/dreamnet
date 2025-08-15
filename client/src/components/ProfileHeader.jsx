// components/ProfileHeader.jsx
import { getAvatarUrl } from '../utils/avatarUtils';

export default function ProfileHeader({ username, profile }) {
  return (
    <div className="relative z-10 flex items-start text-[var(--cream-color)]">
      <img
        src={getAvatarUrl(profile?.avatar)}
        alt={`${username}'s avatar`}
        className="w-24 h-24 rounded-full object-cover border border-base-300 ml-6 mr-8 animate-[floatFade3_6s_ease-in-out_infinite]"
      />
      <div className="flex flex-col jersey-10-thin mt-2">
        <h2 className="float-username text-3xl m-0">@{username}'s Dream Journal</h2>
        {profile?.name && (
          <h3 className="text-lg jersey-10-thin m-0 mt-1 float-name">{profile.name}</h3>
        )}
        {profile?.bio && (
          <p className="text-sm jersey-10-thin mt-2 max-w-[60ch] float-bio">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}