const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function image(item) {
  try {
    const url = new URL(item.thumbnail);
    if (url.protocol === 'https:' && url.hostname === 'static-cdn.jtvnw.net') return `<img loading="lazy" src="${escape(url.href)}" width="640" height="360" alt="">`;
  } catch { /* A missing preview still has a useful channel and title. */ }
  return '<span class="stream-placeholder">SWERVLE</span>';
}
function playable(item) {
  return /^[a-z0-9_]{4,25}$/.test(item.channel) && (item.kind === 'live' || (item.kind === 'video' && /^\d+$/.test(item.id)));
}
function card(item, featured = false) {
  const live = item.kind === 'live';
  const url = live ? `https://www.twitch.tv/${item.channel}` : `https://www.twitch.tv/videos/${item.id}`;
  const date = !live && Number.isFinite(Date.parse(item.createdAt)) ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.createdAt)) : '';
  const detail = live ? `${Number(item.viewers || 0).toLocaleString('en-US')} watching` : [date, item.duration].filter(Boolean).join(' · ');
  return `<article class="stream-card${featured ? ' stream-featured' : ''}"><a class="stream-preview" href="${url}" target="_blank" rel="noopener noreferrer" data-twitch-kind="${item.kind}" data-twitch-id="${live ? item.channel : item.id}" aria-label="${live ? 'Watch live' : 'Watch broadcast'}: ${escape(item.name)}">${image(item)}<span class="stream-play">${live ? 'Watch live' : 'Watch broadcast'}</span></a><div class="stream-details"><div class="stream-channel"><h3>${escape(item.name)}</h3>${item.official ? '<span class="data-tag">SWERVLE</span>' : ''}${live ? '<span class="stream-live">LIVE</span>' : ''}</div><p class="stream-title">${escape(item.title)}</p><p class="stream-meta">${escape(detail)}</p></div></article>`;
}
export function streamFeedView(feed, now = Date.now()) {
  const live = feed.live?.status === 'current' && feed.live.expiresAt > now ? (feed.live.items ?? []).filter(playable).slice(0, 12) : [];
  const videos = feed.videos?.status === 'current' ? (feed.videos.items ?? []).filter(playable).slice(0, 6) : [];
  const liveBody = live.length
    ? `<div class="streams-live-grid">${live.map((item, index) => card(item, index === 0)).join('')}</div>`
    : `<p class="stream-status">${feed.live?.status === 'current' && feed.live.expiresAt > now ? 'No Swervle streams are live right now.' : 'Live streams could not be checked.'} <a href="https://www.twitch.tv/swervlecom" target="_blank" rel="noopener noreferrer">Swervle on Twitch</a></p>`;
  const pastBody = videos.length ? `<div class="streams-vod-grid">${videos.map(item => card(item)).join('')}</div>`
    : `<p class="stream-status">${feed.videos?.status === 'current' ? 'No saved Swervle broadcasts are available right now.' : 'Past broadcasts are unavailable right now.'} <a href="https://www.twitch.tv/swervlecom/videos?filter=archives&amp;sort=time" target="_blank" rel="noopener noreferrer">Browse on Twitch</a></p>`;
  return `${liveBody}<div class="streams-past-heading"><h3>Past broadcasts</h3></div>${pastBody}`;
}

export function twitchPlayerUrl(kind, id, hostname) {
  if ((kind === 'live' && !/^[a-z0-9_]{4,25}$/.test(id)) || (kind === 'video' && !/^\d+$/.test(id)) || !['live', 'video'].includes(kind)) return null;
  const url = new URL('https://player.twitch.tv/');
  url.searchParams.set(kind === 'live' ? 'channel' : 'video', kind === 'live' ? id : `v${id}`);
  url.searchParams.set('parent', hostname);
  url.searchParams.set('autoplay', 'true');
  return url.href;
}
