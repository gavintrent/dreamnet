export function cleanMentions(text) {
  return text.replace(/@\\\[(.+?)\\\]\((.+?)\)/g, '@$1');
}