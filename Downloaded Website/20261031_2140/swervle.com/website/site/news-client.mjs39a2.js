/* global document, location, IntersectionObserver */
import { newsItems } from 'news-view.mjs';
import { createNewsReader } from 'news-cache.mjs';
const base=document.body.dataset.siteBase || '';
const endpoint=base || location.origin==='https://swervle.com' ? '/api/v1/news' : '/public-api/api/v1/news';
let bootstrap;
try{bootstrap=JSON.parse(document.querySelector('[data-news-snapshot]')?.textContent||'null');}catch{bootstrap=null;}
const readNews=createNewsReader({endpoint,bootstrap,
 readSaved:()=>JSON.parse(localStorage.getItem('swervle-public-news-v3')||'null'),
 writeSaved:value=>localStorage.setItem('swervle-public-news-v3',JSON.stringify(value)),
});
async function update(region) {
 const id=region.dataset.newsId || (base && location.pathname.match(/\/news\/([1-9]\d{16,19})\/?$/)?.[1]);
 const limit=Number(region.dataset.newsLimit)||Infinity;
 try {
  const feed=await readNews();
  const news=id?feed.items.filter(item=>item.id===id):feed.items;
  region.innerHTML=id&&!news.length?'<p>This announcement is no longer available.</p>':newsItems({news,newsStatus:'current'},limit,base);
  if(id){
   region.querySelectorAll('a.small-button').forEach(link=>link.remove());
   const title=news[0]?.title||'Announcement';
   const heading=document.querySelector('main > header h1');
   if(heading){heading.textContent=title;region.querySelector('.news-entry h3')?.remove();}
   else {const h1=document.createElement('h1');h1.textContent=title;region.prepend(h1);region.querySelector('.news-entry h3')?.remove();}
   document.title=`${title} | Swervle`;
  }
  region.dataset.newsStatus=Date.now()-Date.parse(feed.fetchedAt)<3_600_000?'current':'saved';
 }catch{
  region.dataset.newsStatus='stale';
  if(!region.querySelector('.news-entry,.announcement-body'))region.innerHTML='<p><a href="https://discord.com/channels/1530058306393997362/1531444317783199804">Read announcements on Discord</a>.</p>';
 }
}
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);void update(entry.target);}},{rootMargin:'200px'});
for(const region of document.querySelectorAll('[data-announcements]'))observer.observe(region);
