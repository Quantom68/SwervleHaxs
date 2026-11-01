const DEFAULT_DISCORD = "https://discord.gg/sSP8ZEJ9Pn";
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function safeUrl(value, fallback = "#") {
  if (typeof value !== "string") return fallback;
  if (/^\/(?![\\/])/.test(value) && !value.includes("\\") && ![...value].some((character) => character.charCodeAt(0) < 32)) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function href(value, fallback) { return escapeHtml(safeUrl(value, fallback)); }
function date(value, options = {}) {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? `${value}T12:00:00Z` : value);
  return Number.isNaN(parsed.valueOf()) ? escapeHtml(value) : parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago", ...options });
}
function externalLink(url, label, className = "text-link") {
  return `<a class="${className}" href="${href(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}
export const STEAM_TRAILER_ID = '8Gcx2Uvw5gw';
export function youtubePoster(id = STEAM_TRAILER_ID, eager = false) {
  if (!/^[\w-]{11}$/.test(id)) return '';
  return `<div class="youtube-player"><a class="youtube-poster" href="https://www.youtube.com/watch?v=${id}" data-youtube="${id}" aria-label="Play Swervle Steam trailer"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="270" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} alt="Swervle Steam trailer"><span class="video-play"><span class="play-triangle" aria-hidden="true"></span><span>Watch trailer</span></span></a></div>`;
}
function withoutRoles(value) { return String(value ?? '').replace(/<@&\d+>|@role\b/g, '').replace(/[ \t]+$/gm, '').trim(); }
export function newsText(body) {
  const inline = (text, depth = 0) => {
    if (depth > 6) return escapeHtml(text);
    text = String(text);
    return String(text).split(/(\\[\\`*_{}[\]()#+.!~<>-]|<https?:\/\/[^\s<>]+>|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>]+|\*\*\*[^\n]+?\*\*\*|\*\*[^\n]+?\*\*|__[^\n]+?__|~~[^\n]+?~~|\*[^*\n]+\*|(?<![\w])_[^_\n]+_(?![\w])|`[^`\n]+`)/g).map(part => {
      if (part.startsWith('\\')) return escapeHtml(part.slice(1));
      if (/^<https?:/.test(part)) return externalLink(part.slice(1,-1), escapeHtml(part.slice(1,-1)), 'announcement-link');
      if (part.startsWith('***') && part.endsWith('***')) return `<strong><em>${inline(part.slice(3,-3), depth+1)}</em></strong>`;
      const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
      if (link) return externalLink(link[2], escapeHtml(link[1]), 'announcement-link');
      if (/^https?:\/\//.test(part)) return externalLink(part, escapeHtml(part), 'announcement-link');
      for (const [mark, tag] of [['**','strong'], ['__','u'], ['~~','del'], ['*','em'], ['_','em'], ['`','code']]) {
        if (part.length > mark.length * 2 && part.startsWith(mark) && part.endsWith(mark)) {
          const content = part.slice(mark.length, -mark.length);
          return `<${tag}>${tag === 'code' ? escapeHtml(content) : inline(content, depth + 1)}</${tag}>`;
        }
      }
      return escapeHtml(part);
    }).join('');
  };
  const lines = withoutRoles(body).split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length;) {
    if (!lines[i].trim()) { i++; continue; }
    if (/^```/.test(lines[i])) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); continue;
    }
    if (/^-#\s/.test(lines[i])) { blocks.push(`<p class="quiet">${inline(lines[i++].replace(/^-#\s/,''))}</p>`); continue; }
    if (/^#{1,3}\s/.test(lines[i])) { blocks.push(`<h3 class="discord-heading">${inline(lines[i++].replace(/^#+\s*/,''))}</h3>`); continue; }
    if (/^>\s?/.test(lines[i])) {
      const quote=[]; while(i < lines.length && /^>\s?/.test(lines[i])) quote.push(inline(lines[i++].replace(/^>\s?/,'')));
      blocks.push(`<blockquote>${quote.join('<br>')}</blockquote>`); continue;
    }
    if (/^\s*(?:[-*]|\d+\.)\s/.test(lines[i])) {
      const tag = /^\s*\d+\./.test(lines[i]) ? 'ol' : 'ul';
      const pattern = tag === 'ol' ? /^\s*\d+\.\s/ : /^\s*[-*]\s/;
      const list=[]; while(i < lines.length && pattern.test(lines[i])) list.push(`<li>${inline(lines[i++].replace(pattern,''))}</li>`);
      blocks.push(`<${tag}>${list.join('')}</${tag}>`); continue;
    }
    const paragraph=[inline(lines[i++])];
    while(i < lines.length && lines[i].trim() && !/^(?:```|-#\s|#{1,3}\s|>\s?|\s*(?:[-*]|\d+\.)\s)/.test(lines[i])) paragraph.push(inline(lines[i++]));
    blocks.push(`<p>${paragraph.join('<br>')}</p>`);
  }
  return blocks.join('');
}
function publicHttps(value) {
  try { const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port?url.href:null; } catch { return null; }
}
function linkPreviews(embeds) {
  return (Array.isArray(embeds)?embeds:[]).slice(0,10).map(embed=>{
    const url=publicHttps(embed.url);if(!url)return '';
    const image=publicHttps(embed.image);
    const provider=embed.provider || new URL(url).hostname;
    return `<a class="link-preview" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><span class="link-preview-provider">${escapeHtml(provider)}</span><strong class="link-preview-title">${escapeHtml(embed.title||provider)}</strong>${embed.description?`<span class="link-preview-description">${escapeHtml(String(embed.description).replace(/\\([\\*_~.!,])/g,'$1'))}</span>`:''}${(embed.fields??[]).slice(0,25).map(field=>`<span class="link-preview-field"><strong>${escapeHtml(field.name)}</strong><span>${escapeHtml(field.value)}</span></span>`).join('')}${image?`<img loading="lazy" src="${escapeHtml(image)}" alt="" referrerpolicy="no-referrer">`:''}</a>`;
  }).join('');
}
export function announcementReactions(item) {
  const reactions=(Array.isArray(item.reactions)?item.reactions:[]).filter(reaction=>Number.isSafeInteger(reaction.count)&&reaction.count>0&&typeof reaction.emoji==='string').slice(0,20);
  if(!reactions.length)return '';
  return `<div class="announcement-reactions" aria-label="Reactions on Discord">${reactions.map(reaction=>{
    const image=typeof reaction.image==='string' && /^https:\/\/cdn\.discordapp\.com\/emojis\/[1-9]\d{16,19}\.(?:png|webp|gif)(?:\?size=\d+)?$/.test(reaction.image)?reaction.image:null;
    return `<span class="reaction-chip" aria-label="${escapeHtml(reaction.emoji)}, ${reaction.count} reactions"><span class="reaction-emoji" aria-hidden="true">${image?`<img src="${escapeHtml(image)}" loading="lazy" alt="">`:escapeHtml(reaction.emoji)}</span><span>${reaction.count.toLocaleString('en-US')}</span></span>`;
  }).join('')}</div>`;
}
export function announcementBody(item) {
  const lines = withoutRoles(item.body).split('\n');
  while(lines.length && !lines[0].trim())lines.shift();
  const firstTitle=lines[0]?.replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '').trim();
  if (firstTitle === withoutRoles(item.title) || (item.embeds?.length && firstTitle?.replace(/\s*<?https?:\/\/\S+.*$/, '').trim() === withoutRoles(item.title))) lines.shift();
  const files=(item.attachments ?? []).filter(file => /^https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\/attachments\//.test(file.url) && /^image\/(png|jpeg|webp|gif|avif)$/.test(file.contentType));
  const pictures=files.length?`<div class="announcement-gallery${files.length===1?' is-single':''}">${files.map(file => `<a class="announcement-image" href="${href(file.url)}" target="_blank" rel="noopener noreferrer"><img src="${href(file.url)}" loading="lazy" alt="${escapeHtml(file.filename)}"></a>`).join('')}</div>`:'';
  const trailer=String(item.id)==='1550145185810489454'?`<div class="announcement-trailer">${youtubePoster()}</div>`:'';
  return newsText(lines.join('\n').trim()) + trailer + pictures + linkPreviews(item.embeds);
}
export function newsItems(data, limit = 8, base = "") {
  const items = (data.news ?? []).slice(0, limit);
  if (!items.length) return `<p>${data.newsStatus === 'current' ? 'No announcements yet.' : 'Announcements could not be loaded. Please check the announcements channel on Discord.'}</p>${externalLink(data.links?.discord ?? DEFAULT_DISCORD, "Join Discord")}`;
  return `${data.newsStatus === 'stale' ? '<p class="news-status">Showing saved announcements while Discord is unavailable.</p>' : ''}` + items.map((item) => `<article class="news-entry"${item.id ? ` id="news-${escapeHtml(item.id)}"` : ""}><time datetime="${escapeHtml(item.date)}">${date(item.date)}</time>${item.editedAt ? '<span class="news-edited">Edited</span>' : ''}${item.title ? `<h3>${escapeHtml(withoutRoles(item.title))}</h3>` : ""}<div class="announcement-body">${announcementBody(item)}</div>${announcementReactions(item)}${item.id ? `<a class="small-button" href="${base}/news/${encodeURIComponent(item.id)}">READ ANNOUNCEMENT</a>` : item.url ? externalLink(item.url, "VIEW ANNOUNCEMENT") : ""}</article>`).join("");
}
