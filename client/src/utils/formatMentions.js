function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])
  );
}

export function linkifyMentions(text) {
  const safe = escapeHTML(text);
  return safe.replace(/@(\w+)/g, (match, username) => {
    return `<a href="/users/${username}" class="mention-link">@${username}</a>`;
  });
}