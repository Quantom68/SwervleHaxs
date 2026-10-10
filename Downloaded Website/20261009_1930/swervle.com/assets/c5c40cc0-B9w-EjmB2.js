const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/c5c40cc0-C31tV2ul2.js","assets/c5c40cc0-CImtAwe1.html","assets/c5c40cc0-DYV1W_g-.html","assets/c5c40cc0-CmKS15sT.html","assets/c5c40cc0-BLXvhO9G.html","assets/c5c40cc0-DJA0DpRu.html","assets/c5c40cc0-pXB29GhL.html","assets/c5c40cc0-DK3Fl9T5.html","assets/c5c40cc0-ClflJg7G.html","assets/c5c40cc0-DkSL9Spr.html","assets/e5c40cc0-DicLYlw2.html","assets/c5c40cc0-BJsikUZQ.html","assets/c5c40cc0-D7z-PLih.html","assets/c5c40cc0-oI4KEVEK.html","assets/c5c40cc0-D5tcFeaC.html","assets/c5c40cc0-BL17fXCL.html","assets/c5c40cc0-Czpn1I53.html","assets/c5c40cc0-BYoVEzak.html","assets/c5c40cc0-DAbztGoo.html","assets/c5c40cc0-Ci9AQodu.html","assets/c5c40cc0-BhOk4swo.html","assets/c5c40cc0-CGkwXA-9.html","assets/c5c40cc0-CSPszdR4.html","assets/c5c40cc0-QUVOQosp.html","assets/c5c40cc0-Cu5iSaLK.html","assets/c5c40cc0-BudYx6Ml.html","assets/c5c40cc0-Cz5iw4uG.html","assets/c5c40cc0-CeS6GaSU.html","assets/index-g5c40cc0-CwK4b9mm.html","assets/c5c40cc0-CWmW_rlP2.js"])))=>i.map(i=>d[i]);
import{s as e}from"c5c40cc0-ClflJg7G.js";import{t}from"c5c40cc0-BL17fXCL.js";import{t as n}from"c5c40cc0-Czpn1I53.js";import{i as r,mn as i}from"e5c40cc0-DicLYlw2.js";import{a,i as o,n as s,r as c,s as l}from"c5c40cc0-eJHPJnKp.js";import{n as u,r as d}from"c5c40cc0-BI_7_iX_.js";import{a as ee,i as te}from"c5c40cc0-DMhXDDCU.js";var f=`neutral`;function p(e){let t=e.releaseStatus??(e.published?`ACTIVE`:`UNPUBLISHED`);return Object.freeze({label:t,tone:ne(t)})}function ne(e){return e===`ACTIVE`?`ok`:e===`STAGED`?`attention`:e===`FAILED`||e===`MISSING`?`bad`:f}function m(e){return e.curation.availability===`available`?e.curation.requestedSeed:e.rebuild.publishedSeed??e.rebuild.requestedSeed}function h(e){return e===null?`PENDING`:e.secondaryBiomeId===null?e.primaryBiomeId:`${e.primaryBiomeId} + ${e.secondaryBiomeId}`}function g(e){return e.thumbnail.trackDigest===null?e.curation.availability===`available`?e.curation.trackDigest:null:e.thumbnail.trackDigest}function _(e){let t=encodeURIComponent(e.dailyId);if(v(e))return`/daily/${t}`;let n=g(e);return n===null?null:`/daily/${t}?adminTest=${encodeURIComponent(n)}`}function v(e){return(e.releaseStatus??(e.published?`ACTIVE`:`UNPUBLISHED`))===`ACTIVE`}function re(e){let t=g(e);return t===null?null:Object.freeze({dailyId:e.dailyId,expectedDigest:t,seed:m(e)})}function y(e,t){if(typeof e!=`string`)return null;let n=Date.parse(e);if(!Number.isFinite(n))return null;let r=n-t.getTime();if(r<=0)return Object.freeze({activationAtIso:e,label:`LIVE NOW`,live:!0});let i=Math.floor(r/1e3),a=Math.floor(i/86400),o=[Math.floor(i%86400/3600),Math.floor(i%3600/60),i%60].map(e=>String(e).padStart(2,`0`)).join(`:`);return Object.freeze({activationAtIso:e,label:a===0?o:`${String(a)}D ${o}`,live:!1})}function b(e){if(v(e))return null;let t=m(e);return e.releaseStatus===`STAGED`&&e.rebuild.publishedSeed!==null?Object.freeze({action:`CHANGE SEED`,consequence:`A NEW SEED REBUILDS THIS MAP, RECHECKS IT, AND DROPS ITS CARD. NOTHING PUBLISHED CHANGES.`,dailyId:e.dailyId,port:`replaceStagedDailySeed`,seed:e.rebuild.publishedSeed}):e.curation.availability===`available`?Object.freeze({action:`REBUILD`,consequence:`A NEW SEED QUEUES A REBUILD AND RERUNS THE CHECKS. NOTHING IS PUBLISHED.`,dailyId:e.dailyId,port:`requestDailySeedRebuild`,seed:t}):null}function x(e){let t=e.curation.availability===`available`?e.curation:e.biome;if(t===null)return Object.freeze([]);let n=t.playabilityBudget.status,r=t.performanceBudget.status;return Object.freeze([Object.freeze({label:`PLAYABILITY ${n.toUpperCase()}`,tone:S(n)}),Object.freeze({label:`PERFORMANCE ${r.toUpperCase()}`,tone:S(r)})])}function S(e){return e===`passed`?`ok`:e===`failed`?`bad`:f}function C(e,t){let n=i(t),r=[...e.calendar].filter(e=>e.dailyId>n).sort((e,t)=>e.dailyId.localeCompare(t.dailyId))[0]??e.calendar.find(e=>e.dailyId===n)??[...e.calendar].sort((e,t)=>t.dailyId.localeCompare(e.dailyId))[0];if(r===void 0)return null;let a=w(r);return Object.freeze({activationAtIso:r.activationAtIso??null,biome:h(T(r)),checks:x(r),day:r,driveHref:_(r),imageAlt:a.alt,imageUrl:a.imageUrl,live:v(r),mapSource:re(r),seed:m(r),seedControl:b(r),status:p(r),trackDigest:g(r)})}function w(e){let t=e.curation.availability===`available`&&e.curation.preview.status===`ready`?e.curation.preview:e.thumbnail;return Object.freeze({alt:t.alt,imageUrl:t.status===`ready`?t.imageUrl:null,status:t.status.toUpperCase()})}function T(e){return e.curation.availability===`available`&&e.curation.biome!==null?e.curation.biome:e.biome}function E(e){return Object.freeze([...new Set(e.calendar.map(({dailyId:e})=>e.slice(0,7)))].sort())}function D(e,t,n){if(t!==null&&e.includes(t))return t;let r=n?.slice(0,7)??null;return r!==null&&e.includes(r)?r:e.at(-1)??null}function O(e,t){return Object.freeze(e.calendar.filter(({dailyId:e})=>e.startsWith(`${t}-`)).sort((e,t)=>e.dailyId.localeCompare(t.dailyId)))}function k(e){let t=/^(\d{4})-(\d{2})$/u.exec(e);if(t===null)return e;let n=new Date(Date.UTC(Number(t[1]),Number(t[2])-1,1));return Number.isNaN(n.getTime())?e:new Intl.DateTimeFormat(`en-US`,{month:`long`,timeZone:`UTC`,year:`numeric`}).format(n).toUpperCase()}function ie(e){let t=Date.parse(`${e}T12:00:00.000Z`);return Number.isFinite(t)?`${new Intl.DateTimeFormat(`en-US`,{timeZone:`UTC`,weekday:`short`}).format(new Date(t)).toUpperCase()} ${e.slice(8)}`:e}function ae(e,t){let n=e.indexOf(t);return Object.freeze({next:n>=0?e[n+1]??null:null,previous:n>0?e[n-1]??null:null})}function oe(e){return(e+2654435769)%4294967296}function se(e){return e.durationTicks===null?null:t(e.durationTicks,e.displayTimeMs)}function ce(t){let n=se(t);return n===null?null:e(n)}function le(e,t){return e.flagged?Object.freeze({label:`FLAGGED ${String(e.signalCount)}`,tone:`bad`}):t===null?e.outcome===`verification-rejected`||e.outcome===`invalid`?Object.freeze({label:`REJECTED`,tone:`bad`}):e.outcome===`verification-error`?Object.freeze({label:`ERROR`,tone:`bad`}):e.outcome===`quit`||e.outcome===`dnf`?Object.freeze({label:e.outcome.toUpperCase(),tone:f}):Object.freeze({label:`UNRANKED`,tone:f}):Object.freeze({label:t.toUpperCase(),tone:t===`eligible`?`ok`:f})}function ue(e){return new Map(e.leaderboard.map(e=>[e.raceId,e.leaderboardStatus]))}function de(e){return e.availability===`unavailable`&&(e.reasonCode===`adapter-not-configured`||e.reasonCode===`not-found`)}function fe(e){if(e.availability!==`available`)return null;let{funScore:t}=e;return t.status!==`ready`||t.score===null?null:Object.freeze({drivers:t.simulatedDriverCount,recommendation:(t.recommendation??`inspect`).toUpperCase(),score:Math.round(t.score)})}function A(e){return e.availability===`available`&&e.buildState===`reviewable`&&e.trackDigest!==null&&e.aiFieldId!==null&&e.funReportId!==null&&e.contentFingerprint!==null&&e.playabilityBudget.status===`passed`&&e.performanceBudget.status===`passed`}var j=1e3,M=class{#e;#t;#n;#r;#i;#a;#o;#s;#c;#l=!1;#u=null;#d=null;#f=``;#p=null;#m=null;#h=null;#g=null;#_=null;#v=!1;#y=null;#b=new Map;#x=new Set;#S;#C;constructor(e){this.#e=e.mount,this.#t=e.port,this.#n=e.sessionId,this.#r=e.initialDayId??null,this.#i=e.initialPlayerQuery??null,this.#a=e.devFixture??!1,this.#c=e.initialSnapshot??null,this.#s=e.now??(()=>new Date),this.#o=e.navigate??(e=>{globalThis.location.replace(e)}),this.#S=e=>{this.#T(e)},this.#C=e=>{this.#E(e)},this.#e.addEventListener(`submit`,this.#S),this.#e.addEventListener(`click`,this.#C),this.#z({status:`loading`}),this.#y=globalThis.setInterval(()=>{L(this.#e,this.#s())},j)}async load(){if(this.#i!==null){this.#o(`?tab=player&player=${encodeURIComponent(this.#i)}`);return}this.#z({status:`loading`});try{this.#u=this.#c??await this.#t.loadDashboard(this.#n),this.#c=null,this.#p=null,this.#m=null,this.#I(),await this.#w(),this.#I()}catch(e){this.#u=null,this.#z({message:Q(e,`OPERATIONS COULD NOT BE READ.`),status:`error`})}}destroy(){this.#v=!0,this.#y!==null&&globalThis.clearInterval(this.#y),this.#y=null,this.#g?.dispose(),this.#g=null,this.#_?.(),this.#_=null,this.#e.removeEventListener(`submit`,this.#S),this.#e.removeEventListener(`click`,this.#C),this.#e.replaceChildren()}async#w(){if(!this.#l&&(this.#l=!0,!(this.#r===null||this.#d!==null)))try{this.#d=await this.#t.lookupDay(this.#n,this.#r)}catch{}}async#T(e){let t=e.target;if(!(t instanceof HTMLFormElement))return;let n=t.dataset.adminSeedPort;if(n===`replaceStagedDailySeed`||n===`requestDailySeedRebuild`){e.preventDefault(),await this.#O(t,n);return}let r=t.dataset.adminAutomationAction;if(r===`veto`||r===`pull`||r===`reseed`){e.preventDefault(),await this.#k(t,r);return}if(t.dataset.adminDaySort!==void 0){e.preventDefault(),await this.#A(t);return}let i=t.dataset.adminLookup;if(i!==`day`&&i!==`run`)return;e.preventDefault();let a=new FormData(t).get(`query`);if(!(typeof a!=`string`||a.trim().length===0)){this.#F(`LOOKING UP...`);try{i===`run`?this.#f=ke(await this.#t.lookupRun(this.#n,a.trim()),this.#s()):(this.#f=``,this.#d=await this.#t.lookupDay(this.#n,a.trim())),this.#p=null}catch(e){this.#p=Q(e,`LOOKUP FAILED.`),this.#f=``}this.#I()}}async#E(t){let n=t.target;if(!(n instanceof Element))return;let r=n.closest(`a[data-admin-day-link]`);if(r!==null&&!t.defaultPrevented&&t.button===0&&!t.metaKey&&!t.ctrlKey&&!t.shiftKey&&!t.altKey){let e=r.dataset.adminDayLink;if(e!==void 0){t.preventDefault(),await this.#D(e);return}}let i=n.closest(`button[data-admin-action]`);if(i===null)return;let a=i.dataset.adminAction;if(a===`retry-load`){await this.load();return}if(a===`calendar-month`){let e=i.dataset.adminCalendarMonth;e!==void 0&&/^\d{4}-\d{2}$/u.test(e)&&(this.#h=e,this.#I());return}if(a===`watch-run`){await this.#M(X(i,`raceId`));return}if(a===`curation-approve`||a===`curation-test`){await this.#j(i,a);return}i.disabled=!0,this.#F(`APPLYING...`);try{if(a===`review-start`)await this.#t.startIntegrityReview(this.#n,X(i,`reviewId`));else if(a===`review-clear`||a===`review-confirm`){let e=X(i,`reviewId`),t=this.#e.querySelector(`[data-review-note="${$(e)}"]`)?.value??``;await this.#t.resolveIntegrityReview(this.#n,e,a===`review-clear`?`cleared`:`confirmed`,t)}else if(a===`review-accept`){let t=X(i,`reviewId`),n=this.#e.querySelector(`[data-review-note="${$(t)}"]`)?.value??``,r=this.#t.acceptIntegrityReviewRun?.bind(this.#t);if(r===void 0){this.#p=`THIS DEPLOYMENT CANNOT ACCEPT A REJECTED RUN.`,this.#I();return}let a=await r(this.#n,t,n);this.#p=a.onBoard?`${a.displayTimeMs===null?`THE RUN`:e(a.displayTimeMs)} IS ON THE BOARD${a.replayRecovered?` WITH ITS REPLAY`:` (NO REPLAY RECOVERED)`}.`:`THAT RACE RECORDED NO TRACE, SO THERE IS NO TIME TO BOARD.`}else if(a===`review-media`){let e=await this.#t.requestReviewMedia(this.#n,X(i,`reviewId`));this.#f=je(e,this.#s()),this.#p=e.playbackUrl===null?`REVIEW MEDIA IS NOT READY.`:null,this.#I();return}else return;await this.load()}catch(e){this.#p=Q(e,`THE ACTION FAILED.`),this.#I()}}async#D(e){this.#N(`calendar-day:${e}`,`OPENING ${e}...`);try{this.#d=await this.#t.lookupDay(this.#n,e),this.#f=``,this.#p=null}catch(e){this.#p=Q(e,`THAT DAY COULD NOT BE READ.`)}this.#m=null,this.#I()}async#O(e,t){let n=Z(e,`dailyId`),r=Number(Z(e,`seed`));this.#N(`seed:${n}`,`REBUILDING ${n} ON SEED ${String(r)}...`);try{if(t===`replaceStagedDailySeed`){let e=await this.#t.replaceStagedDailySeed(this.#n,n,r);await this.#P(n),this.#p=`${n} IS STAGED ON SEED ${String(e.seed)}.`}else await this.#t.requestDailySeedRebuild(this.#n,n,r),await this.#P(n),this.#p=`${n} REBUILD QUEUED. THE SCHEDULER RERUNS ITS CHECKS.`}catch(e){this.#p=Q(e,`THE SEED DID NOT CHANGE.`)}this.#m=null,this.#I()}async#k(e,t){let n=Z(e,`dailyId`),r=Z(e,`reason`),i=t===`reseed`?Number(Z(e,`seed`)):void 0,a=`automation:${t}:${n}`;this.#N(a,`${t.toUpperCase()} ${n}...`);try{await this.#t.recordDailyAutomationOverride(this.#n,n,t,r,i),this.#u=await this.#t.loadDashboard(this.#n),this.#p=t===`veto`?`${n} WAS VETOED BEFORE ACTIVATION.`:t===`pull`?`${n} WAS PULLED FROM THE PENDING SCHEDULE.`:`${n} REBUILDS ON SEED ${String(i)} AT THE NEXT SCHEDULER RUN.`}catch(e){this.#p=Q(e,`THE OVERRIDE FAILED.`)}this.#m=null,this.#I()}async#A(e){let t=Z(e,`dailyId`),n=Z(e,`sort`);this.#N(`sort:${t}`,`SORTING...`);try{this.#d=await this.#t.lookupDay(this.#n,t,{sort:n}),this.#f=``,this.#p=null}catch(e){this.#p=Q(e,`THE RUNS COULD NOT BE SORTED.`)}this.#m=null,this.#I()}async#j(e,t){let n=X(e,`dailyId`),r=X(e,`candidateId`);this.#N(`${t}:${n}`,t===`curation-approve`?`APPROVING ${n}...`:`BUILDING A TEST LINK...`);try{if(t===`curation-approve`)await this.#t.approveDailyCandidate(this.#n,n,r),await this.#P(n),this.#p=`${n} IS APPROVED. IT IS NOT PUBLISHED.`;else{let e=await this.#t.createDailyTestRaceLink(this.#n,n,r);this.#f=Ae(e),this.#p=null}}catch(e){this.#p=Q(e,`THE CURATION ACTION FAILED.`)}this.#m=null,this.#I()}async#M(e){this.#F(`LOADING THE REPLAY...`);try{let t=await this.#t.requestRunReplay(this.#n,e),{AdminReplayCanvasV1:r}=await n(async()=>{let{AdminReplayCanvasV1:e}=await import(`./c5c40cc0-C31tV2ul2.js`);return{AdminReplayCanvasV1:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]));this.#g?.dispose(),this.#g=null,this.#g=await r.mount(document.body,{onExit:()=>{this.#g=null},replay:t}),this.#p=`SPECTATING. SPACE PLAYS, ESC EXITS.`}catch(e){this.#g=null,this.#p=Q(e,`THAT REPLAY COULD NOT BE LOADED.`)}this.#I()}#N(e,t){this.#m===null&&(this.#m=e,this.#p=t,this.#I())}async#P(e){let t=this.#d,[n,r]=await Promise.all([this.#t.loadDashboard(this.#n),t?.day.dailyId===e?this.#t.lookupDay(this.#n,e,t.allRaces.query):Promise.resolve(null)]);this.#u=n,r!==null&&(this.#d=r)}#F(e){this.#p=e,this.#I()}#I(){if(this.#u===null)return;let e=this.#s();this.#z({actionMessage:this.#p,busyActionKey:this.#m,calendarMonth:this.#h,mapImages:this.#b,resultHtml:`${this.#d===null?``:xe(this.#d,e,this.#m,this.#a)}${this.#f}`,snapshot:this.#u,status:`ready`}),this.#L()}async#L(){if(this.#u===null||this.#R())return;let e=C(this.#u,this.#s())?.mapSource??null;if(e===null||this.#x.has(e.expectedDigest)||(this.#x.add(e.expectedDigest),await new Promise(e=>{globalThis.setTimeout(e,0)}),this.#R()))return;let t=await R(e);t===null||this.#R()||(this.#b.set(e.expectedDigest,t),this.#I())}#R(){return this.#v}#z(e){this.#_?.(),this.#e.innerHTML=N(e,this.#s()),this.#_=l(this.#e)}};function N(e,t=new Date){if(e.status===`loading`)return`<main class="swervle-admin" data-admin-surface="v2" aria-busy="true">
      <p class="admin-activity-state" role="status">READING OPERATIONS&hellip;</p>
    </main>`;if(e.status===`error`)return`<main class="swervle-admin" data-admin-surface="v2" aria-busy="false">
      <section class="admin-profile__band" role="alert">
        <h1 class="admin-profile__band-title">OPERATIONS UNAVAILABLE</h1>
        <p class="admin-profile__span">${c(e.message)}</p>
        <p class="admin-profile__actions"><button class="board-scope-option" type="button"
          data-admin-action="retry-load">RETRY</button></p>
      </section>
    </main>`;let{snapshot:n}=e,i=e.busyActionKey??null,a=C(n,t),o=a?.mapSource===null||a===null?null:e.mapImages?.get(a.mapSource.expectedDigest)??null;return r(`operations`,`<section class="admin-today admin-operations"
    aria-label="Operations" aria-busy="${i===null?`false`:`true`}">
    ${e.actionMessage===null?``:`<p class="admin-activity-state" role="status" aria-live="polite">${c(e.actionMessage)}</p>`}
    ${P(a,i,t,o)}
    ${me(n,i,t)}
    ${e.resultHtml.length===0?``:`<div aria-live="polite">${e.resultHtml}</div>`}
    ${V(n,e.calendarMonth??null,a?.day.dailyId??null)}
    ${ge(n,t)}
    ${ve(n.clientPerformance)}
    ${be()}
  </section>`)}function P(e,t,n,r){if(e===null)return W(`NEXT MAP`,`<p class="admin-today__zero">NO DAY IS SCHEDULED.</p>`);let i=e.driveHref===null?`<span class="admin-profile__none">NOTHING IS BUILT TO DRIVE.</span>`:`<a class="board-scope-option" data-intent="primary" data-admin-drive
        href="${s(e.driveHref)}" target="_blank" rel="noopener">${e.live?`DRIVE TODAY`:`DRIVE IT`}</a>`;return`<section class="admin-profile__band admin-operations__hero-band"
    aria-labelledby="admin-ops-next">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-next">${e.live?`TODAY&rsquo;S MAP`:`NEXT MAP`}</h2>
      <p class="admin-profile__pills">
        <span class="admin-pill" data-tone="${s(e.status.tone)}">${c(e.status.label)}</span>
        ${a({id:e.day.dailyId,kind:`day`,maxLabelLength:12})}
        ${e.checks.map(K).join(``)}
      </p>
    </div>
    <div class="admin-operations__hero">
      ${F(e.day,r,e.imageUrl,e.imageAlt)}
      <div class="admin-operations__hero-facts">
        ${I(e.activationAtIso,e.live,n)}
        <div class="admin-operations__facts">
          ${z(`BIOME`,c(e.biome))}
          ${z(`SEED`,String(e.seed))}
          ${e.trackDigest===null?``:z(`DIGEST`,`${c(e.trackDigest.slice(0,12))}${o(e.trackDigest,`Copy track digest`)}`)}
        </div>
        <div class="admin-operations__do">
          ${i}
          ${B(e.seedControl,t)}
        </div>
        ${e.seedControl===null?`<p class="admin-today__note">${e.live?`A LIVE MAP CANNOT CHANGE SEED.`:`NO SEED CONTROL: NOTHING IS STAGED FOR THIS DAY YET.`}</p>`:`<p class="admin-today__note">${c(e.seedControl.consequence)}</p>`}
      </div>
    </div>
  </section>`}function F(e,t,n,r){let i=w(e),a=t??n;return`<div class="admin-operations__hero-art">
    ${a===null?`<p class="admin-today__zero">MAP PREVIEW ${c(i.status)}</p>`:`<img class="admin-operations__map" src="${s(a)}"
      alt="${s(t===null?r:`Rebuilt terrain map for ${e.dailyId}`)}">`}
    ${a===null?``:`<p class="admin-profile__pills"><span class="admin-pill" data-tone="${t===null?`neutral`:`ok`}">${t===null?`ROUTE ONLY`:`FULL MAP`}</span></p>`}
  </div>`}function I(e,t,n){let r=y(e,n);return r===null?`<div class="admin-operations__countdown-tile">
      <span class="admin-profile__tile-label">GOES LIVE</span>
      <span class="admin-operations__countdown">${t?`LIVE NOW`:`UNSCHEDULED`}</span>
    </div>`:`<div class="admin-operations__countdown-tile" data-admin-countdown="${s(r.activationAtIso)}">
    <span class="admin-profile__tile-label" data-admin-countdown-label>${r.live?`WENT LIVE`:`GOES LIVE IN`}</span>
    <span class="admin-operations__countdown" role="timer" data-admin-countdown-value>${c(r.label)}</span>
    <span class="admin-profile__tile-detail">${c(d(r.activationAtIso).toUpperCase())}</span>
  </div>`}function L(e,t){for(let n of e.querySelectorAll(`[data-admin-countdown]`)){let e=y(n.dataset.adminCountdown??null,t);if(e===null)continue;let r=n.querySelector(`[data-admin-countdown-value]`);r!==null&&(r.textContent=e.label);let i=n.querySelector(`[data-admin-countdown-label]`);i!==null&&(i.textContent=e.live?`WENT LIVE`:`GOES LIVE IN`)}}async function R(e){try{let[t,r,i]=await Promise.all([n(()=>import(`./c5c40cc0-Cz5iw4uG.js`).then(e=>e.t),__vite__mapDeps([26,7,3,4,19,27,9])),n(()=>import(`./e5c40cc0-DicLYlw2.js`).then(e=>e.lt),__vite__mapDeps([10,7,11,12,1,2,3,4,13,5,14,9,8,6,15,16,17,18,19,20,21,22,23,24,25,26,27,28])),n(()=>import(`./c5c40cc0-pXB29GhL.js`).then(e=>e.t),__vite__mapDeps([6,7,8,9]))]),a=[i.swervleTrackRulesetVersionForDailyV1(e.dailyId),void 0];for(let n of a){let i;try{i=t.generateTrackV2(n===void 0?{seed:e.seed}:{rulesetVersion:n,seed:e.seed})}catch{continue}if(i.revision.trackDigest!==e.expectedDigest)continue;let a=r.renderTopDownPreviewSvgV1({spec:r.createTopDownPreviewSpecV1({dailyId:e.dailyId,track:i}),targetId:`operator-preview`,track:i}).svg;return`data:image/svg+xml,${encodeURIComponent(a)}`}return null}catch{return null}}function z(e,t){return`<p class="admin-operations__fact"><span class="admin-profile__tile-label">${c(e)}</span><b>${t}</b></p>`}function B(e,t){if(e===null)return``;let n=t===`seed:${e.dailyId}`,r=`admin-ops-seed-${e.dailyId}`;return`<form class="admin-operations__seed" data-admin-seed-port="${s(e.port)}" aria-busy="${n?`true`:`false`}">
    <input type="hidden" name="dailyId" value="${s(e.dailyId)}">
    <label class="admin-profile__band-label" for="${s(r)}">SEED</label>
    <input class="admin-profile__field admin-operations__seed-field"
      id="${s(r)}" name="seed" type="number" inputmode="numeric"
      min="0" max="4294967295" step="1" required value="${String(e.seed)}"
      ${n?`disabled`:``}>
    <button class="board-scope-option" type="submit" ${n?`disabled`:``}>${n?`WORKING&hellip;`:c(e.action)}</button>
  </form>`}function V(e,t,n){let r=E(e),i=D(r,t,n);if(i===null)return W(`SCHEDULE`,`<p class="admin-today__zero">NO DAY HAS BEEN BUILT YET.</p>`);let a=ae(r,i),o=O(e,i);return`<section class="admin-profile__band" aria-labelledby="admin-ops-schedule">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-schedule">SCHEDULE</h2>
      <div class="admin-profile__actions">
        <button class="board-scope-option" type="button" data-admin-action="calendar-month"
          data-admin-calendar-month="${s(a.previous??i)}"
          aria-label="Previous month" ${a.previous===null?`disabled`:``}>&larr;</button>
        <span class="admin-profile__band-label"><b>${c(k(i))}</b></span>
        <button class="board-scope-option" type="button" data-admin-action="calendar-month"
          data-admin-calendar-month="${s(a.next??i)}"
          aria-label="Next month" ${a.next===null?`disabled`:``}>&rarr;</button>
      </div>
    </div>
    <div class="admin-profile__tiles admin-operations__month">${o.map(e=>pe(e,n)).join(``)}</div>
  </section>`}function pe(e,t){let n=p(e),r=e.raceCount>0,i=e.dailyId===t;return`<a class="admin-operations__day-tile" data-admin-day-link="${s(e.dailyId)}"${i?` data-admin-day-focus="true"`:``}
    href="?tab=operations&amp;day=${encodeURIComponent(e.dailyId)}">
    <span class="admin-profile__tile-label">${c(ie(e.dailyId))}</span>
    <span class="admin-pill" data-tone="${s(n.tone)}">${c(n.label)}</span>
    <span class="admin-profile__tile-value">${r?String(e.completionCount):``}</span>
    <span class="admin-profile__tile-detail">${r?`OF ${String(e.raceCount)} RACES`:`NOT RACED`}</span>
    <span class="admin-profile__tile-detail">SEED ${String(m(e))}</span>
    <span class="admin-profile__tile-detail">${c(h(T(e)))}</span>
  </a>`}function me(e,t,n){let{exceptions:r,latestRun:i}=e.dailyAutomation;return r.length===0?``:`<section class="admin-profile__band" aria-labelledby="admin-ops-exceptions">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-exceptions">SCHEDULER STUCK</h2>
      <p class="admin-profile__band-label">${i===null?`NO SCHEDULER RUN RECORDED`:`LAST RUN <b>${c(u(i.runAtIso,n))}</b>`}</p>
    </div>
    <ul class="admin-activity__list">${r.map(e=>he(e,t)).join(``)}</ul>
  </section>`}function he(e,t){let n=e.publicationId===null?`veto`:`pull`,r=t===`automation:${n}:${e.dailyId}`,i=t===`automation:reseed:${e.dailyId}`,o=oe(e.attempts.at(-1)?.seed??0),l=e.attempts.slice(-5).map(e=>`<li class="admin-profile__span">#${String(e.ordinal)} SEED ${String(e.seed)} &middot; ${c(e.rejectionCodes.length===0?`PASSED`:e.rejectionCodes.join(`, `))}</li>`).join(``),u={reason:`admin-ops-${n}-reason-${e.dailyId}`,reseedReason:`admin-ops-reseed-reason-${e.dailyId}`,seed:`admin-ops-reseed-seed-${e.dailyId}`};return`<li class="admin-activity-row" role="${e.severity===`error`?`alert`:`status`}">
    <span class="admin-pill" data-tone="${e.severity===`error`?`bad`:`attention`}">${c(e.severity.toUpperCase())}</span>
    <div class="admin-activity-row__body">
      <div class="admin-activity-row__who">
        ${a({id:e.dailyId,kind:`day`,maxLabelLength:12})}
        <span class="admin-activity-row__code">${c(e.code)}</span>
      </div>
      <span class="admin-profile__span">${c(e.message)}</span>
      <ul class="admin-today__queues">${l}</ul>
      <div class="admin-operations__forms">
        <form class="admin-operations__form" data-admin-automation-action="${n}"
          aria-busy="${r?`true`:`false`}">
          <input type="hidden" name="dailyId" value="${s(e.dailyId)}">
          <label class="admin-profile__band-label"
            for="${s(u.reason)}">REASON</label>
          <input class="admin-profile__field admin-operations__field"
            id="${s(u.reason)}" name="reason" maxlength="500" required
            ${r?`disabled`:``}>
          <button class="board-scope-option" type="submit" data-intent="destructive"
            ${r?`disabled`:``}>${r?`WORKING&hellip;`:n===`veto`?`VETO THE SLOT`:`PULL THE SLOT`}</button>
        </form>
        <form class="admin-operations__form" data-admin-automation-action="reseed"
          aria-busy="${i?`true`:`false`}">
          <input type="hidden" name="dailyId" value="${s(e.dailyId)}">
          <label class="admin-profile__band-label"
            for="${s(u.seed)}">SEED</label>
          <input class="admin-profile__field admin-operations__seed-field"
            id="${s(u.seed)}" name="seed" type="number" inputmode="numeric"
            min="0" max="4294967295" step="1" required value="${String(o)}"
            ${i?`disabled`:``}>
          <label class="admin-profile__band-label"
            for="${s(u.reseedReason)}">REASON</label>
          <input class="admin-profile__field admin-operations__field"
            id="${s(u.reseedReason)}" name="reason" maxlength="500" required
            ${i?`disabled`:``}>
          <button class="board-scope-option" type="submit" ${i?`disabled`:``}>${i?`WORKING&hellip;`:`RESEED AND RECHECK`}</button>
        </form>
      </div>
      <p class="admin-today__note">${n===`veto`?`VETO STOPS THIS SLOT BEING BUILT. RESEED REBUILDS IT AT THE NEXT SCHEDULER RUN.`:`PULL REMOVES THE PENDING PUBLICATION. RESEED REBUILDS IT AT THE NEXT SCHEDULER RUN.`}</p>
    </div>
  </li>`}function ge(e,t){return e.reviewQueue.length===0?``:`<section class="admin-profile__band" aria-labelledby="admin-ops-integrity">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-integrity">HELD FOR REVIEW</h2>
      <p class="admin-profile__band-label"><b>${String(e.reviewQueue.length)}</b> OPEN</p>
    </div>
    <ul class="admin-activity__list">${e.reviewQueue.map(e=>_e(e,t)).join(``)}</ul>
  </section>`}function _e(e,t){let n=`admin-ops-review-note-${e.reviewId}`,r=te(e),i=Me(e),a=ee(e),o=r.officialTime===null?``:`<div class="admin-activity-row__duration"><b>${c(r.officialTime)}</b>${a?`<span class="admin-profile__span">CLAIMED</span>`:``}</div>`,l=e.onBoard===!0?`<span class="admin-pill" data-tone="good">ON THE BOARD</span>`:`<button class="board-scope-option" type="button" data-intent="primary"
            data-admin-action="review-accept"
            data-review-id="${s(e.reviewId)}">ACCEPT RUN</button>`;return`<li class="admin-activity-row">
    <span class="admin-pill" data-tone="${s(r.tone)}">${c(r.disposition)}</span>
    <div class="admin-activity-row__body">
      <div class="admin-activity-row__who">${i}</div>
      <p class="admin-moderation-row__detail">${c(r.detail)}</p>
      <span class="admin-profile__span">HELD <b>${c(u(e.queuedAtIso,t))}</b></span>
      <div class="admin-operations__verdict">
        <label class="admin-profile__band-label"
          for="${s(n)}">NOTE</label>
        <input class="admin-profile__field admin-operations__field"
          id="${s(n)}"
          data-review-note="${s(e.reviewId)}" maxlength="500"
          autocomplete="off">
        <div class="admin-operations__verdict-actions">
          <button class="board-scope-option" type="button" data-admin-action="review-start"
            data-review-id="${s(e.reviewId)}">HOLD</button>
          ${l}
          <button class="board-scope-option" type="button" data-intent="primary"
            data-admin-action="review-clear"
            data-review-id="${s(e.reviewId)}">CLEAR REVIEW</button>
          <button class="board-scope-option" type="button" data-intent="destructive"
            data-admin-action="review-confirm"
            data-review-id="${s(e.reviewId)}">CONFIRM CHEATING</button>
          ${e.reviewMedia==null?``:`<button class="board-scope-option" type="button" data-admin-action="review-media"
              data-review-id="${s(e.reviewId)}">WATCH</button>`}
        </div>
      </div>
      <p class="admin-today__note">ACCEPT RUN PUTS THIS TIME ON THE BOARD AND CLOSES THE
        REVIEW. CLEAR CLOSES THE REVIEW ONLY; LEADERBOARD STATUS DOES NOT CHANGE.
        CONFIRM RECORDS A CHEATING VERDICT AGAINST THIS RUN.</p>
    </div>
    ${o}
  </li>`}function ve(e){if(e===null)return W(`CLIENT PERFORMANCE`,`<p class="admin-today__zero">NOT MEASURED HERE: ANALYTICS ENGINE IS NOT READABLE
        FROM THIS DEPLOYMENT.</p>`);let t=`LAST ${String(e.windowDays)} DAYS`;if(e.tiers.length===0&&e.devices.length===0)return W(`CLIENT PERFORMANCE`,`<p class="admin-today__zero">NO RACE REPORTED A FRAME BUDGET IN THE ${c(t)}.</p>`);let n=e.tiers.reduce((e,t)=>e+t.races,0);return W(`CLIENT PERFORMANCE`,`<p class="admin-profile__band-label"><b>${c(t)}</b> ${String(n)} RACES REPORTED</p>
    <div class="admin-profile__tiles">${e.tiers.map(e=>q(String(e.races),e.tier.toUpperCase(),ye(e.races,n))).join(``)}</div>
    <p class="admin-profile__band-label">95TH PERCENTILE FRAME, BY DEVICE</p>
    ${e.devices.length===0?`<p class="admin-today__zero">NO REPORT CARRIED A FRAME TIME.</p>`:`<div class="admin-profile__tiles">${e.devices.map(e=>q(e.p95FrameMs===null?`NOT READ`:`${e.p95FrameMs.toFixed(1)} MS`,e.deviceClass.toUpperCase(),`${String(e.races)} MEASURED`)).join(``)}</div>`}`)}function ye(e,t){return t<=0?null:`${String(Math.round(e/t*100))}% OF RACES`}function be(){return`<section class="admin-profile__band" aria-labelledby="admin-ops-lookup">
    <h2 class="admin-profile__band-title" id="admin-ops-lookup">LOOKUP</h2>
    <div class="admin-operations__forms">
      ${H(`day`,`DAY`,`YYYY-MM-DD`)}
      ${H(`run`,`RUN`,`Race id or public run id`)}
    </div>
  </section>`}function H(e,t,n){let r=`admin-ops-lookup-${e}`;return`<form class="admin-operations__form" data-admin-lookup="${s(e)}">
    <label class="admin-profile__band-label" for="${s(r)}">${c(t)}</label>
    <input class="admin-profile__field admin-operations__field"
      id="${s(r)}" name="query" required autocomplete="off"
      placeholder="${s(n)}">
    <button class="board-scope-option" type="submit">FIND</button>
  </form>`}function xe(e,t=new Date,n=null,r=!1){let{day:i}=e,a=p(i),o=w(i),l=_(i),u=b(i);return`<section class="admin-profile__band admin-operations__hero-band"
    aria-labelledby="admin-ops-day">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-day">${c(i.dailyId)}</h2>
      <p class="admin-profile__pills">
        <span class="admin-pill" data-tone="${s(a.tone)}">${c(a.label)}</span>
        ${r&&J(i)?`<span class="admin-entity-flag" data-tone="bad">DEV BYPASS</span>`:``}
        ${x(i).map(K).join(``)}
      </p>
    </div>
    <div class="admin-operations__hero">
      ${F(i,null,o.imageUrl,o.alt)}
      <div class="admin-operations__hero-facts">
        ${I(i.activationAtIso??null,v(i),t)}
        <div class="admin-operations__facts">
          ${z(`BIOME`,c(h(T(i))))}
          ${z(`SEED`,String(m(i)))}
        </div>
        <div class="admin-operations__do">
          ${l===null?``:`<a class="board-scope-option" data-intent="primary" data-admin-drive
              href="${s(l)}" target="_blank" rel="noopener">DRIVE IT</a>`}
          ${B(u,n)}
        </div>
        ${u===null?``:`<p class="admin-today__note">${c(u.consequence)}</p>`}
      </div>
    </div>
    <div class="admin-profile__tiles">
      ${q(String(i.completionCount),`FINISHES`,`OF ${String(i.raceCount)} RACES`)}
      ${q(String(i.quitCount),`QUITS`,Se(e))}
      ${q(String(i.retryCount),`RETRIES`,null)}
      ${q(String(i.offlineAiRaceCount),`AI RUNS`,null)}
    </div>
    ${Ce(i.curation,n)}
  </section>
  ${Te(e)}
  ${Ee(e,n,t)}`}function Se(e){return e.quitCheckpointCounts.length===0?null:`AT ${e.quitCheckpointCounts.map(({checkpointIndex:e,count:t})=>`CP${String(e)}×${String(t)}`).join(` `)}`}function Ce(e,t){if(e.availability===`unavailable`)return de(e)?``:`<p class="admin-activity-state admin-activity-state--error" role="alert">
      THE CANDIDATE SERVICE DID NOT ANSWER. RELOAD BEFORE DECIDING ANYTHING.</p>`;let n=fe(e),r=t===`curation-approve:${e.dailyId}`,i=t===`curation-test:${e.dailyId}`,a=A(e)&&!r;return`<div class="admin-profile__signals">
    <p class="admin-profile__pills">
      <span class="admin-pill" data-tone="neutral">${c(e.buildState.toUpperCase())}</span>
      <span class="admin-pill" data-tone="neutral">REBUILD ${c(e.rebuild.status.toUpperCase())}</span>
      ${n===null?``:`<span class="admin-profile__span">FUN <b>${String(n.score)}</b> &middot; ${c(n.recommendation)} &middot; ${String(n.drivers)} AI RUNS</span>`}
      <span class="admin-profile__span">CANDIDATE ${c(e.candidateId)}</span>
      ${e.approval===null?`<span class="admin-profile__none">AUTO-POLICY DECIDES PUBLICATION</span>`:`<span class="admin-profile__span">APPROVED BY ${c(e.approval.approvedByAccountId)}</span>`}
    </p>
    ${we(e)}
    <div class="admin-profile__actions">
      <button class="board-scope-option" type="button" data-intent="primary"
        data-admin-action="curation-approve"
        data-daily-id="${s(e.dailyId)}"
        data-candidate-id="${s(e.candidateId)}"
        ${a?``:`disabled`}>${r?`WORKING&hellip;`:e.buildState===`approved`?`APPROVED`:`APPROVE`}</button>
      <button class="board-scope-option" type="button" data-admin-action="curation-test"
        data-daily-id="${s(e.dailyId)}"
        data-candidate-id="${s(e.candidateId)}"
        ${e.trackDigest!==null&&!i?``:`disabled`}>${i?`WORKING&hellip;`:`TEST RACE LINK`}</button>
    </div>
    <p class="admin-today__note">APPROVE RECORDS AN OPERATOR OVERRIDE. IT DOES NOT PUBLISH.</p>
  </div>`}function we(e){let t=[];return e.playabilityBudget.status===`failed`&&t.push(U(e.failureCode===null?`PLAYABILITY FAILED`:`PLAYABILITY FAILED (${e.failureCode.replaceAll(`-`,` `).toUpperCase()})`,e.playabilityBudget,`check`)),e.performanceBudget.status===`failed`&&t.push(U(`PERFORMANCE BUDGET EXCEEDED`,e.performanceBudget,`ms`)),t.length===0?``:`<div role="alert">${t.join(``)}</div>`}function U(e,t,n){let r=Y(t.measured,n===`ms`?`ms`:null),i=Y(t.maximum,n===`ms`?`ms`:null),a=n===`check`?`${r} FAILING / ${i} ALLOWED`:`MEASURED ${r} / BUDGET ${i}`,o=t.notes.length===0?``:`<ul class="admin-profile__signal-list">${t.notes.map(e=>`<li class="admin-profile__signal-why">${c(e)}</li>`).join(``)}</ul>`;return`<p class="admin-profile__band-label"><b>${c(e)}</b> ${c(a)}</p>${o}
    <p class="admin-profile__none">CHECK ${c(t.budgetVersion)}</p>`}function Te(n){if(n.leaderboard.length===0)return W(`BOARD`,`<p class="admin-today__zero">NO RUN ON THIS DAY IS BOARD-ELIGIBLE.</p>`);let r=n.leaderboard.map(n=>`<li class="admin-activity-row admin-operations__row">
    <span class="admin-activity-row__country">${String(n.rank)}</span>
    <div class="admin-activity-row__body">
      <div class="admin-activity-row__who">${G(n.publicDisplayName)}${a({id:n.raceId,kind:`race`,maxLabelLength:14})}</div>
      <span class="admin-activity-row__code">${c(n.participantKind.toUpperCase())}${n.challengeShareIds.length===0?``:` &middot; ${c(n.challengeShareIds.join(`, `))}`}</span>
    </div>
    <div class="admin-activity-row__duration"><b>${c(e(t(n.durationTicks,n.displayTimeMs)))}</b></div>
  </li>`).join(``);return`<section class="admin-profile__band" aria-labelledby="admin-ops-board">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-board">BOARD</h2>
      <p class="admin-profile__band-label"><b>${String(n.leaderboardTotalCount)}</b> RANKED${n.leaderboardTruncated?`, SHOWING ${String(n.leaderboard.length)}`:``}</p>
    </div>
    <ul class="admin-activity__list admin-operations__list">${r}</ul>
  </section>`}function Ee(e,t,n){let r=ue(e),{allRaces:i}=e,o=i.items.length===0?`<p class="admin-today__zero">NOBODY HAS RACED THIS DAY.</p>`:`<ul class="admin-activity__list admin-operations__list">${i.items.map(e=>{let t=le(e,r.get(e.raceId)??null),i=ce(e);return`<li class="admin-activity-row admin-operations__row">
        <span class="admin-pill" data-tone="${s(t.tone)}">${c(t.label)}</span>
        <div class="admin-activity-row__body">
          <div class="admin-activity-row__who">${G(e.publicDisplayName)}${a({id:e.raceId,kind:`race`,maxLabelLength:10})}</div>
          <span class="admin-activity-row__code">${c(e.outcome.toUpperCase())}${e.retryCount===0?``:` &middot; ${String(e.retryCount)} RETRIES`} &middot; ${e.quitCheckpointIndex===null?`CP ${String(e.lastCheckpointIndex)}`:`QUIT AT CP ${String(e.quitCheckpointIndex)}`}</span>
        </div>
        <div class="admin-activity-row__right admin-operations__row-right">
          <div class="admin-activity-row__duration${i===null?` admin-activity-row__duration--none`:``}"><b>${i===null?`&mdash;`:c(i)}</b></div>
          <span class="admin-activity-row__time">${c(u(e.endedAtIso,n))}</span>
          ${e.publicRunId===null?`<span class="admin-profile__none">&mdash;</span>`:`<button class="board-scope-option admin-activity-row__watch" type="button"
            data-admin-action="watch-run"
            data-race-id="${s(e.raceId)}"
            aria-label="Watch ${s(e.publicDisplayName)} run ${s(e.raceId)}">WATCH</button>`}
        </div>
      </li>`}).join(``)}</ul>`;return`<section class="admin-profile__band" aria-labelledby="admin-ops-runs">
    <div class="admin-profile__livery-head">
      <div class="admin-profile__who">
        <h2 class="admin-profile__band-title" id="admin-ops-runs">RUNS</h2>
        <p class="admin-profile__band-label"><b>${String(i.totalCount)}</b> SAVED${i.truncated?`, SHOWING ${String(i.items.length)}`:``}</p>
      </div>
      ${Oe(e,t)}
    </div>
    ${o}
  </section>`}var De=Object.freeze([[`fastest`,`FASTEST`],[`slowest`,`SLOWEST`],[`outcome`,`OUTCOME`],[`retries`,`MOST RETRIES`],[`quit-checkpoint`,`QUIT POINT`],[`flagged`,`FLAGGED FIRST`]]);function Oe(e,t){let n=t===`sort:${e.day.dailyId}`,r=`admin-ops-sort-${e.day.dailyId}`;return`<form class="admin-profile__actions" data-admin-day-sort
    aria-busy="${n?`true`:`false`}">
    <input type="hidden" name="dailyId" value="${s(e.day.dailyId)}">
    <label class="admin-activity__facet">
      <span class="admin-profile__band-label">SORT</span>
      <select id="${s(r)}" name="sort" ${n?`disabled`:``}>${De.map(([t,n])=>`<option value="${t}"${e.allRaces.query.sort===t?` selected`:``}>${n}</option>`).join(``)}</select>
    </label>
    <button class="board-scope-option" type="submit" ${n?`disabled`:``}>${n?`WORKING&hellip;`:`APPLY`}</button>
  </form>`}function ke(n,r){let i=n.verifierVerdict.durationTicks===null?`&mdash;`:c(e(t(n.verifierVerdict.durationTicks,n.verifierVerdict.displayTimeMs)));return`<section class="admin-profile__band" aria-labelledby="admin-ops-run">
    <h2 class="admin-profile__band-title" id="admin-ops-run">RUN</h2>
    <p class="admin-profile__pills">
      ${a({copyable:!0,id:n.raceId,kind:`race`})}
      ${G(n.publicDisplayName)}
      ${a({id:n.dailyId,kind:`day`,maxLabelLength:12})}
    </p>
    <div class="admin-profile__tiles">
      ${q(i,`OFFICIAL TIME`,n.verifierVerdict.verifierBuild)}
      ${q(n.outcome.toUpperCase(),`OUTCOME`,n.participantKind.toUpperCase())}
      ${q(n.leaderboardStatus.toUpperCase(),`BOARD`,n.verifierVerdict.status.toUpperCase())}
      ${q(String(n.humanTelemetry.activeRaceTicks),`TICKS`,`CP ${String(n.humanTelemetry.lastCheckpointIndex)}`)}
    </div>
    <p class="admin-profile__span">SAVED <b>${c(u(n.endedAtIso,r))}</b></p>
  </section>`}function Ae(e){return`<section class="admin-profile__band" role="status">
    <h2 class="admin-profile__band-title">TEST RACE READY</h2>
    <p class="admin-profile__span">CANDIDATE <b>${c(e.candidateId)}</b> &middot; DIGEST <b>${c(e.trackDigest.slice(0,12))}</b></p>
    <p class="admin-profile__actions"><a class="board-scope-option" data-intent="primary"
      href="${s(e.url)}">DRIVE ${c(e.dailyId)}</a></p>
  </section>`}function je(e,t){return e.playbackUrl===null?`<section class="admin-profile__band" role="status">
      <h2 class="admin-profile__band-title">REVIEW MEDIA</h2>
      <p class="admin-profile__pills"><span class="admin-pill" data-tone="neutral">${c(e.status.toUpperCase())}</span></p>
      <p class="admin-today__zero">NOT READY TO PLAY.</p>
    </section>`:e.contentType===`video/mp4`?`<section class="admin-profile__band">
      <h2 class="admin-profile__band-title">REVIEW MEDIA</h2>
      <video class="admin-operations__map" controls preload="metadata"
        src="${s(e.playbackUrl)}"></video>
      <p class="admin-profile__span">ACCESS ENDS <b>${c(e.expiresAtIso===null?`SOON`:u(e.expiresAtIso,t))}</b></p>
    </section>`:`<section class="admin-profile__band">
    <h2 class="admin-profile__band-title">REVIEW REPLAY</h2>
    <p class="admin-profile__actions"><a class="board-scope-option"
      href="${s(e.playbackUrl)}" target="_blank"
      rel="noopener">OPEN THE ARTIFACT</a></p>
  </section>`}function W(e,t){let n=`admin-ops-${e.toLowerCase().replaceAll(/[^a-z]+/gu,`-`)}`;return`<section class="admin-profile__band" aria-labelledby="${s(n)}">
    <h2 class="admin-profile__band-title" id="${s(n)}">${c(e)}</h2>
    ${t}
  </section>`}function G(e){return e.trim()===``?`<span class="admin-entity admin-entity--plain">RACER</span>`:a({id:e,kind:`player`,label:e})}function Me(e){let t=e.publicDisplayName?.trim()??``,n=e.accountId?.trim()??``;return a(n!==``||t!==``?{id:n===``?t:n,kind:`player`,label:t===``?null:t}:{id:e.raceId,kind:`race`,maxLabelLength:14})}function K(e){return`<span class="admin-pill" data-tone="${s(e.tone)}">${c(e.label)}</span>`}function q(e,t,n){return`<div class="admin-operations__day-tile">
    <span class="admin-profile__tile-label">${c(t)}</span>
    <span class="admin-profile__tile-value">${c(e)}</span>
    ${n===null?``:`<span class="admin-profile__tile-detail">${c(n)}</span>`}
  </div>`}function J(e){if(!e.published)return!1;let{curation:t}=e;return t.availability!==`available`||t.buildState!==`approved`}function Y(e,t){return e===null?`—`:`${String(Math.round(e*100)/100)}${t===null?``:` ${t}`}`}function X(e,t){let n=e.dataset[t];if(n===void 0)throw TypeError(`Admin action target is missing.`);return n}function Z(e,t){let n=new FormData(e).get(t);if(typeof n!=`string`||n.trim().length===0)throw TypeError(`Admin form data is incomplete.`);return n.trim()}function Q(e,t){return e instanceof Error&&(e.name.startsWith(`Admin`)||e instanceof TypeError||e instanceof RangeError)?e.message.toUpperCase():t}function $(e){return typeof CSS>`u`?e.replaceAll(/[^A-Za-z0-9_-]/gu,`_`):CSS.escape(e)}var Ne=class extends M{};function Pe(e,t=new Date){return N(e,t)}function Fe(e,t){let n=Date.parse(e.expiresAtIso)-t;if(!Number.isFinite(n)||n<=0)return``;let r=Math.ceil(n/1e3);return`<p class="admin-undo" role="status"><button class="board-scope-option" type="button"
    data-admin-action="undo" data-undo="${s(JSON.stringify(e))}">UNDO</button>
    <span class="admin-muted">${String(r)}s</span></p>`}export{Pe as n,Fe as r,Ne as t};