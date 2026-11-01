const HOUR = 3_600_000;
const CHANNEL = '1531444317783199804';
function valid(feed) {
 return feed?.channelId===CHANNEL && Array.isArray(feed.items) && feed.items.every(item=>item && typeof item==='object' && typeof item.id==='string' && typeof item.body==='string') && Number.isFinite(Date.parse(feed.fetchedAt));
}
export function createNewsReader({fetchImpl=fetch,readSaved=()=>null,writeSaved=()=>{},now=Date.now,bootstrap=null,endpoint='/api/v1/news'}={}) {
 let saved;try{saved=readSaved();}catch{saved=null;}
 let feed=valid(saved?.feed)?saved.feed:null;
 if(valid(bootstrap) && (!feed || Date.parse(bootstrap.fetchedAt)>Date.parse(feed.fetchedAt)))feed=bootstrap;
 let lastAttemptAt=Math.max(Number(saved?.lastAttemptAt)||0,feed?Date.parse(feed.fetchedAt):0);
 let pending;
 const persist=()=>{try{writeSaved({feed,lastAttemptAt});}catch{/* Storage is optional; server HTML remains available. */}};
 persist();
 return async function read() {
  if(pending)return pending;
  if(now()-lastAttemptAt<HOUR) {
   if(feed)return feed;
   throw new Error('Announcements retry is deferred');
  }
  lastAttemptAt=now();persist();
  pending=(async()=>{
   try {
    const items=new Map();const cursors=new Set();let cursor='';let first;
    for(let page=0;page<100;page++){
     const response=await fetchImpl(`${endpoint}${cursor?`?before=${cursor}`:''}`,{credentials:'omit',signal:AbortSignal.timeout(12000)});
     if(!response.ok)throw new Error('Unavailable');
     const next=await response.json();if(!valid(next))throw new Error('Invalid feed');first??=next;
     for(const item of next.items)items.set(item.id,item);
     if(!next.nextCursor){feed={...first,items:[...items.values()],nextCursor:null};persist();return feed;}
     cursor=String(next.nextCursor);
     if(!/^[1-9]\d{16,19}\.[a-f0-9]{64}$/.test(cursor)||cursors.has(cursor))throw new Error('Invalid cursor');cursors.add(cursor);
    }
    throw new Error('Incomplete archive');
   }catch(error){if(feed)return feed;throw error;}
  })();
  try{return await pending;}finally{pending=null;}
 };
}
