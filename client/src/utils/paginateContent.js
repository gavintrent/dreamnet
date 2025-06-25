export function paginateByLineEstimate(content, maxLines = 21, maxCharsPerLine = 70, maxLinesFirstPage = 20) {
  const lines = content.split('\n');
  const pages = [];
  let currentPage = [];
  let lineCount = 0;

  for (const rawLine of lines) {
    const line = rawLine === '' ? ' ' : rawLine; // preserve blank lines
    const words = line.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const needsSpace = currentLine.length > 0 ? 1 : 0;

      if (currentLine.length + needsSpace + word.length <= maxCharsPerLine) {
        currentLine += (needsSpace ? ' ' : '') + word;
      } else {
        // Line full → add to page
        const pageLimit = pages.length === 0 ? maxLinesFirstPage : maxLines;
        if (lineCount >= pageLimit) {
          pages.push(currentPage.join('\n'));
          currentPage = [];
          lineCount = 0;
        }
        currentPage.push(currentLine);
        lineCount++;
        currentLine = word;
      }
    }

    // Push final part of line
    if (currentLine) {
      const pageLimit = pages.length === 0 ? maxLinesFirstPage : maxLines;
      if (lineCount >= pageLimit) {
        pages.push(currentPage.join('\n'));
        currentPage = [];
        lineCount = 0;
      }
      currentPage.push(currentLine);
      lineCount++;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join('\n'));
  }

  return pages;
}