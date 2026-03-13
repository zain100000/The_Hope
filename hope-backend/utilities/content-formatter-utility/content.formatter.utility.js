/**
 * Convert plain text article content into structured HTML
 */

exports.formatArticleContent = (content) => {
  if (!content) return "";

  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let html = "";
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      html += "<ul>";
      listBuffer.forEach((item) => {
        html += `<li>${item}</li>`;
      });
      html += "</ul>";
      listBuffer = [];
    }
  };

  for (const line of lines) {
    // Section heading like "1. What is Anxiety?"
    if (/^\d+\.\s/.test(line)) {
      flushList();
      html += `<h3>${line.replace(/^\d+\.\s/, "")}</h3>`;
      continue;
    }

    // Bullet-like lines (colon explanations)
    if (line.includes(":") && line.length < 200) {
      listBuffer.push(line);
      continue;
    }

    // Regular paragraph
    flushList();
    html += `<p>${line}</p>`;
  }

  flushList();

  return html;
};
