/**
 * Utility functions for handling avatar URLs consistently across the app
 */

/**
 * Constructs the full avatar URL from a relative path
 * @param {string} avatarPath - The avatar path from the database
 * @returns {string} - The full avatar URL
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '/avatars/default-avatar-2.jpg';
  
  // If it's already a full URL, return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // If it's a relative path, construct the full URL using API base
  if (avatarPath.startsWith('/')) {
    // Use the API base URL (localhost:4000 in dev, your domain in production)
    const apiBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
    return `${apiBase}${avatarPath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  const apiBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
  return `${apiBase}/uploads/${avatarPath}`;
};

/**
 * Gets the default avatar URL
 * @returns {string} - The default avatar URL
 */
export const getDefaultAvatarUrl = () => '/avatars/default-avatar-2.jpg'; 