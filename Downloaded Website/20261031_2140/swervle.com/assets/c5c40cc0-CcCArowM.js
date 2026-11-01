const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/c5c40cc0-D0i6jKuo.js","assets/c5c40cc0-DpfM-SsN.html","assets/c5c40cc0-DK3Fl9T5.html","assets/c5c40cc0-DZbvnItu.html","assets/c5c40cc0-BWtHKyr1.html","assets/c5c40cc0-Ci9AQodu.html","assets/c5c40cc0-CmKS15sT.html","assets/c5c40cc0-Da7UEB6L.html","assets/c5c40cc0-ZjY89OC8.html","assets/c5c40cc0-BLXvhO9G.html","assets/c5c40cc0-CImtAwe1.html","assets/c5c40cc0-DYV1W_g-.html","assets/c5c40cc0-BpjyYlDZ.html","assets/c5c40cc0--Wi6uMJd.html","assets/c5c40cc0-tYwZacaO.html","assets/c5c40cc0-DKLck-oL.html","assets/c5c40cc0-2E51mLa6.html","assets/c5c40cc0-D5tcFeaC.html","assets/c5c40cc0-DuY8ssIB.html","assets/c5c40cc0-B_YTYEkU.html","assets/c5c40cc0-BJsikUZQ.html","assets/c5c40cc0-VK318vwB.html","assets/c5c40cc0-Djx0OSEx.html","assets/c5c40cc0-D7z-PLih.html","assets/c5c40cc0-CWwg_aBc.html","assets/c5c40cc0-Bl0PRET02.html","assets/c5c40cc0-BSQOq0ua.html","assets/c5c40cc0-BL17fXCL.html","assets/c5c40cc0-CV78eY0Z.html","assets/c5c40cc0-VdyjqzP_.html","assets/c5c40cc0-DHpD0fo0.html","assets/c5c40cc0-Czpn1I53.html","assets/c5c40cc0-0aNL7uzK.html","assets/c5c40cc0-BV28pGJ3.html","assets/c5c40cc0-CcUYFpIY.html","assets/c5c40cc0-Byag952r.html","assets/c5c40cc0-Cu4ZNROz2.html","assets/c5c40cc0-BhOk4swo2.html","assets/c5c40cc0-OSaL8rTm2.html","assets/c5c40cc0-0H9A0zAK2.html","assets/c5c40cc0-jg3vz80F2.html","assets/c5c40cc0-DeRMB9u22.html","assets/c5c40cc0-DCj6zu9z2.html","assets/c5c40cc0-Cq8C9w5B2.html","assets/c5c40cc0-B5d-IM4S2.html","assets/c5c40cc0-Cu5iSaLK2.html","assets/c5c40cc0-86CRusDE2.html","assets/c5c40cc0-D4AdJWVm2.html","assets/c5c40cc0-BGDM4q_q2.html","assets/c5c40cc0-CAsyXjmb2.html","assets/c5c40cc0-CI9pOWQX2.html","assets/c5c40cc0-DpPhHae12.html","assets/c5c40cc0-nBl6onMU2.html","assets/BootSwervleV1-g5c40cc0-BbKItRN1.html","assets/c5c40cc0-D7t_LH1E.js"])))=>i.map(i=>d[i]);
import{s as e}from"c5c40cc0-DuY8ssIB.js";import{r as t}from"c5c40cc0-BSQOq0ua.js";import{t as n}from"c5c40cc0-BL17fXCL.js";import{t as r}from"c5c40cc0-Czpn1I53.js";import{i}from"c5c40cc0-nBl6onMU2.js";import{a,i as o,n as s,r as c,s as l}from"c5c40cc0-BisjIhQf2.js";import{n as u,r as d}from"c5c40cc0-D5oFQOQN2.js";import{a as f,i as p}from"c5c40cc0-BbM0clYJ.js";var m=`neutral`;function h(e){let t=e.releaseStatus??(e.published?`ACTIVE`:`UNPUBLISHED`);return Object.freeze({label:t,tone:ee(t)})}function ee(e){return e===`ACTIVE`?`ok`:e===`STAGED`?`attention`:e===`FAILED`||e===`MISSING`?`bad`:m}function g(e){if(e.curation.availability!==`available`)return!1;let t=e.thumbnail.trackDigest,n=e.curation.trackDigest;return t===null||n===null||t.startsWith(n)||n.startsWith(t)}function _(e){return e.curation.availability===`available`&&g(e)?e.curation.requestedSeed:e.rebuild.publishedSeed??e.rebuild.requestedSeed}function v(e){return e===null?`PENDING`:e.secondaryBiomeId===null?e.primaryBiomeId:`${e.primaryBiomeId} + ${e.secondaryBiomeId}`}function y(e){return e.thumbnail.trackDigest===null?e.curation.availability===`available`?e.curation.trackDigest:null:e.thumbnail.trackDigest}function b(e){let t=encodeURIComponent(e.dailyId);if(x(e))return`/daily/${t}`;let n=y(e);return n===null?null:`/daily/${t}?adminTest=${encodeURIComponent(n)}`}function x(e){return(e.releaseStatus??(e.published?`ACTIVE`:`UNPUBLISHED`))===`ACTIVE`}function S(e){let t=y(e);return t===null?null:Object.freeze({dailyId:e.dailyId,expectedDigest:t,seed:_(e)})}function C(e,t){if(typeof e!=`string`)return null;let n=Date.parse(e);if(!Number.isFinite(n))return null;let r=n-t.getTime();if(r<=0)return Object.freeze({activationAtIso:e,label:`LIVE NOW`,live:!0});let i=Math.floor(r/1e3),a=Math.floor(i/86400),o=[Math.floor(i%86400/3600),Math.floor(i%3600/60),i%60].map(e=>String(e).padStart(2,`0`)).join(`:`);return Object.freeze({activationAtIso:e,label:a===0?o:`${String(a)}D ${o}`,live:!1})}function w(e){if(x(e))return null;let t=_(e);return e.releaseStatus===`STAGED`&&e.rebuild.publishedSeed!==null?Object.freeze({action:`CHANGE SEED`,consequence:`A NEW SEED REBUILDS THIS MAP, RECHECKS IT, AND DROPS ITS CARD. NOTHING PUBLISHED CHANGES.`,dailyId:e.dailyId,port:`replaceStagedDailySeed`,seed:e.rebuild.publishedSeed}):e.curation.availability===`available`?Object.freeze({action:`REBUILD`,consequence:`A NEW SEED QUEUES A REBUILD AND RERUNS THE CHECKS. NOTHING IS PUBLISHED.`,dailyId:e.dailyId,port:`requestDailySeedRebuild`,seed:t}):null}function T(e){let t=e.curation.availability===`available`?e.curation:e.biome;if(t===null)return Object.freeze([]);let n=t.playabilityBudget.status,r=t.performanceBudget.status;return Object.freeze([Object.freeze({label:`PLAYABILITY ${n.toUpperCase()}`,tone:E(n)}),Object.freeze({label:`PERFORMANCE ${r.toUpperCase()}`,tone:E(r)})])}function E(e){return e===`passed`?`ok`:e===`failed`?`bad`:m}function D(e,n){let r=t(n),i=[...e.calendar].filter(e=>e.dailyId>r).sort((e,t)=>e.dailyId.localeCompare(t.dailyId))[0]??e.calendar.find(e=>e.dailyId===r)??[...e.calendar].sort((e,t)=>t.dailyId.localeCompare(e.dailyId))[0];if(i===void 0)return null;let a=O(i);return Object.freeze({activationAtIso:i.activationAtIso??null,biome:v(k(i)),checks:T(i),day:i,driveHref:b(i),imageAlt:a.alt,imageUrl:a.imageUrl,live:x(i),mapSource:S(i),seed:_(i),seedControl:w(i),status:h(i),trackDigest:y(i)})}function O(e){let t=e.curation.availability===`available`&&g(e)&&e.curation.preview.status===`ready`?e.curation.preview:e.thumbnail;return Object.freeze({alt:t.alt,imageUrl:t.status===`ready`?t.imageUrl:null,status:t.status.toUpperCase()})}function k(e){return e.curation.availability===`available`&&g(e)&&e.curation.biome!==null?e.curation.biome:e.biome}function te(e){return Object.freeze([...new Set(e.calendar.map(({dailyId:e})=>e.slice(0,7)))].sort())}function ne(e,t,n){if(t!==null&&e.includes(t))return t;let r=n?.slice(0,7)??null;return r!==null&&e.includes(r)?r:e.at(-1)??null}function re(e,t){return Object.freeze(e.calendar.filter(({dailyId:e})=>e.startsWith(`${t}-`)).sort((e,t)=>e.dailyId.localeCompare(t.dailyId)))}function ie(e){let t=/^(\d{4})-(\d{2})$/u.exec(e);if(t===null)return e;let n=new Date(Date.UTC(Number(t[1]),Number(t[2])-1,1));return Number.isNaN(n.getTime())?e:new Intl.DateTimeFormat(`en-US`,{month:`long`,timeZone:`UTC`,year:`numeric`}).format(n).toUpperCase()}function ae(e){let t=Date.parse(`${e}T12:00:00.000Z`);return Number.isFinite(t)?`${new Intl.DateTimeFormat(`en-US`,{timeZone:`UTC`,weekday:`short`}).format(new Date(t)).toUpperCase()} ${e.slice(8)}`:e}function oe(e,t){let n=e.indexOf(t);return Object.freeze({next:n>=0?e[n+1]??null:null,previous:n>0?e[n-1]??null:null})}function se(e){return(e+2654435769)%4294967296}function ce(e){return e.durationTicks===null?null:n(e.durationTicks,e.displayTimeMs)}function le(t){let n=ce(t);return n===null?null:e(n)}function ue(e,t){return e.flagged?Object.freeze({label:`FLAGGED ${String(e.signalCount)}`,tone:`bad`}):t===null?e.outcome===`verification-rejected`||e.outcome===`invalid`?Object.freeze({label:`REJECTED`,tone:`bad`}):e.outcome===`verification-error`?Object.freeze({label:`ERROR`,tone:`bad`}):e.outcome===`quit`||e.outcome===`dnf`?Object.freeze({label:e.outcome.toUpperCase(),tone:m}):Object.freeze({label:`UNRANKED`,tone:m}):Object.freeze({label:t.toUpperCase(),tone:t===`eligible`?`ok`:m})}function de(e){return new Map(e.leaderboard.map(e=>[e.raceId,e.leaderboardStatus]))}function fe(e){return e.availability===`unavailable`&&(e.reasonCode===`adapter-not-configured`||e.reasonCode===`not-found`)}function pe(e){if(e.availability!==`available`)return null;let{funScore:t}=e;return t.status!==`ready`||t.score===null?null:Object.freeze({drivers:t.simulatedDriverCount,recommendation:(t.recommendation??`inspect`).toUpperCase(),score:Math.round(t.score)})}function me(e){return e.availability===`available`&&e.buildState===`reviewable`&&e.trackDigest!==null&&e.aiFieldId!==null&&e.funReportId!==null&&e.contentFingerprint!==null&&e.playabilityBudget.status===`passed`&&e.performanceBudget.status===`passed`}var A=1e3,j=`(max-width: 760px)`;function M(){return typeof globalThis.matchMedia==`function`&&globalThis.matchMedia(j).matches}var N=class{#e;#t;#n;#r;#i;#a;#o;#s;#c;#l=!1;#u=null;#d=null;#f=``;#p=null;#m=null;#h=null;#g=null;#_=null;#v=!1;#y=null;#b=new Map;#x=new Set;#S=!1;#C;#w;constructor(e){this.#e=e.mount,this.#t=e.port,this.#n=e.sessionId,this.#r=e.initialDayId??null,this.#i=e.initialPlayerQuery??null,this.#a=e.devFixture??!1,this.#c=e.initialSnapshot??null,this.#s=e.now??(()=>new Date),this.#o=e.navigate??(e=>{globalThis.location.replace(e)}),this.#C=e=>{this.#E(e)},this.#w=e=>{this.#D(e)},this.#e.addEventListener(`submit`,this.#C),this.#e.addEventListener(`click`,this.#w),this.#W({status:`loading`}),this.#y=globalThis.setInterval(()=>{R(this.#e,this.#s())},A)}async load(){if(this.#i!==null){this.#o(`?tab=player&player=${encodeURIComponent(this.#i)}`);return}this.#W({status:`loading`});try{this.#u=this.#c??await this.#t.loadDashboard(this.#n),this.#c=null,this.#p=null,this.#m=null,this.#R(),await this.#T(),this.#R()}catch(e){this.#u=null,this.#W({message:Q(e,`OPERATIONS COULD NOT BE READ.`),status:`error`})}}destroy(){this.#v=!0,this.#y!==null&&globalThis.clearInterval(this.#y),this.#y=null,this.#g?.dispose(),this.#g=null,this.#_?.(),this.#_=null,this.#e.removeEventListener(`submit`,this.#C),this.#e.removeEventListener(`click`,this.#w),this.#e.replaceChildren()}async#T(){if(!this.#l&&(this.#l=!0,!(this.#r===null||this.#d!==null)))try{this.#d=await this.#t.lookupDay(this.#n,this.#r)}catch{}}async#E(e){let t=e.target;if(!(t instanceof HTMLFormElement))return;let n=t.dataset.adminSeedPort;if(n===`replaceStagedDailySeed`||n===`requestDailySeedRebuild`){e.preventDefault(),await this.#A(t,n);return}let r=t.dataset.adminAutomationAction;if(r===`veto`||r===`pull`||r===`reseed`){e.preventDefault(),await this.#j(t,r);return}if(t.dataset.adminDaySort!==void 0){e.preventDefault(),await this.#M(t);return}let i=t.dataset.adminLookup;if(i!==`day`&&i!==`run`)return;e.preventDefault();let a=new FormData(t).get(`query`);if(!(typeof a!=`string`||a.trim().length===0)){this.#L(`LOOKING UP...`);try{i===`run`?this.#f=Me(await this.#t.lookupRun(this.#n,a.trim()),this.#s()):(this.#f=``,this.#d=await this.#t.lookupDay(this.#n,a.trim())),this.#p=null}catch(e){this.#p=Q(e,`LOOKUP FAILED.`),this.#f=``}this.#R()}}async#D(t){let n=t.target;if(!(n instanceof Element))return;let r=n.closest(`a[data-admin-day-link]`);if(r!==null&&!t.defaultPrevented&&t.button===0&&!t.metaKey&&!t.ctrlKey&&!t.shiftKey&&!t.altKey){let e=r.dataset.adminDayLink;if(e!==void 0){t.preventDefault(),await this.#O(e);return}}let i=n.closest(`button[data-admin-action]`);if(i===null)return;let a=i.dataset.adminAction;if(a===`retry-load`){await this.load();return}if(a===`calendar-month`){let e=i.dataset.adminCalendarMonth;e!==void 0&&/^\d{4}-\d{2}$/u.test(e)&&(this.#h=e,this.#R());return}if(a===`build-full-map`){await this.#V();return}if(a===`watch-run`){await this.#P(X(i,`raceId`));return}if(a===`curation-approve`||a===`curation-test`){await this.#N(i,a);return}i.disabled=!0,this.#L(`APPLYING...`);try{if(a===`review-start`)await this.#t.startIntegrityReview(this.#n,X(i,`reviewId`));else if(a===`review-clear`||a===`review-confirm`){let e=X(i,`reviewId`),t=this.#e.querySelector(`[data-review-note="${$(e)}"]`)?.value??``;await this.#t.resolveIntegrityReview(this.#n,e,a===`review-clear`?`cleared`:`confirmed`,t)}else if(a===`review-accept`){let t=X(i,`reviewId`),n=this.#e.querySelector(`[data-review-note="${$(t)}"]`)?.value??``,r=this.#t.acceptIntegrityReviewRun?.bind(this.#t);if(r===void 0){this.#p=`THIS DEPLOYMENT CANNOT ACCEPT A REJECTED RUN.`,this.#R();return}let a=await r(this.#n,t,n);this.#p=a.onBoard?`${a.displayTimeMs===null?`THE RUN`:e(a.displayTimeMs)} IS ON THE BOARD${a.replayRecovered?` WITH ITS REPLAY`:` (NO REPLAY RECOVERED)`}.`:`THAT RACE RECORDED NO TRACE, SO THERE IS NO TIME TO BOARD.`}else if(a===`review-media`){let e=await this.#t.requestReviewMedia(this.#n,X(i,`reviewId`));this.#f=Pe(e,this.#s()),this.#p=e.playbackUrl===null?`REVIEW MEDIA IS NOT READY.`:null,this.#R();return}else return;await this.load()}catch(e){this.#p=Q(e,`THE ACTION FAILED.`),this.#R()}}async#O(e){this.#F(`calendar-day:${e}`,`OPENING ${e}...`);try{this.#d=await this.#t.lookupDay(this.#n,e),this.#f=``,this.#p=null}catch(e){this.#p=Q(e,`THAT DAY COULD NOT BE READ.`)}this.#m=null,this.#R(),this.#k()}#k(){M()&&(this.#e.querySelector(`#admin-ops-day`)?.closest(`section`)??null)?.scrollIntoView({block:`start`})}async#A(e,t){let n=Z(e,`dailyId`),r=Number(Z(e,`seed`));this.#F(`seed:${n}`,`REBUILDING ${n} ON SEED ${String(r)}...`);try{if(t===`replaceStagedDailySeed`){let e=await this.#t.replaceStagedDailySeed(this.#n,n,r);await this.#I(n),this.#p=`${n} IS STAGED ON SEED ${String(e.seed)}.`}else await this.#t.requestDailySeedRebuild(this.#n,n,r),await this.#I(n),this.#p=`${n} REBUILD QUEUED. THE SCHEDULER RERUNS ITS CHECKS.`}catch(e){this.#p=Q(e,`THE SEED DID NOT CHANGE.`)}this.#m=null,this.#R()}async#j(e,t){let n=Z(e,`dailyId`),r=Z(e,`reason`),i=t===`reseed`?Number(Z(e,`seed`)):void 0,a=`automation:${t}:${n}`;this.#F(a,`${t.toUpperCase()} ${n}...`);try{await this.#t.recordDailyAutomationOverride(this.#n,n,t,r,i),this.#u=await this.#t.loadDashboard(this.#n),this.#p=t===`veto`?`${n} WAS VETOED BEFORE ACTIVATION.`:t===`pull`?`${n} WAS PULLED FROM THE PENDING SCHEDULE.`:`${n} REBUILDS ON SEED ${String(i)} AT THE NEXT SCHEDULER RUN.`}catch(e){this.#p=Q(e,`THE OVERRIDE FAILED.`)}this.#m=null,this.#R()}async#M(e){let t=Z(e,`dailyId`),n=Z(e,`sort`);this.#F(`sort:${t}`,`SORTING...`);try{this.#d=await this.#t.lookupDay(this.#n,t,{sort:n}),this.#f=``,this.#p=null}catch(e){this.#p=Q(e,`THE RUNS COULD NOT BE SORTED.`)}this.#m=null,this.#R()}async#N(e,t){let n=X(e,`dailyId`),r=X(e,`candidateId`);this.#F(`${t}:${n}`,t===`curation-approve`?`APPROVING ${n}...`:`BUILDING A TEST LINK...`);try{if(t===`curation-approve`)await this.#t.approveDailyCandidate(this.#n,n,r),await this.#I(n),this.#p=`${n} IS APPROVED. IT IS NOT PUBLISHED.`;else{let e=await this.#t.createDailyTestRaceLink(this.#n,n,r);this.#f=Ne(e),this.#p=null}}catch(e){this.#p=Q(e,`THE CURATION ACTION FAILED.`)}this.#m=null,this.#R()}async#P(e){this.#L(`LOADING THE REPLAY...`);try{let t=await this.#t.requestRunReplay(this.#n,e),{AdminReplayCanvasV1:n}=await r(async()=>{let{AdminReplayCanvasV1:e}=await import(`./c5c40cc0-D0i6jKuo.js`);return{AdminReplayCanvasV1:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54]));this.#g?.dispose(),this.#g=null,this.#g=await n.mount(document.body,{onExit:()=>{this.#g=null},replay:t}),this.#p=`SPECTATING. SPACE PLAYS, ESC EXITS.`}catch(e){this.#g=null,this.#p=Q(e,`THAT REPLAY COULD NOT BE LOADED.`)}this.#R()}#F(e,t){this.#m===null&&(this.#m=e,this.#p=t,this.#R())}async#I(e){let t=this.#d,[n,r]=await Promise.all([this.#t.loadDashboard(this.#n),t?.day.dailyId===e?this.#t.lookupDay(this.#n,e,t.allRaces.query):Promise.resolve(null)]);this.#u=n,r!==null&&(this.#d=r)}#L(e){this.#p=e,this.#R()}#R(){if(this.#u===null)return;let e=this.#s();this.#W({actionMessage:this.#p,busyActionKey:this.#m,calendarMonth:this.#h,mapBuild:this.#H(),mapImages:this.#b,resultHtml:`${this.#d===null?``:we(this.#d,e,this.#m,this.#a)}${this.#f}`,snapshot:this.#u,status:`ready`}),this.#z()}async#z(){M()||await this.#B()}async#B(){if(this.#u===null||this.#U())return;let e=D(this.#u,this.#s())?.mapSource??null;if(e===null||this.#x.has(e.expectedDigest)||(this.#x.add(e.expectedDigest),await new Promise(e=>{globalThis.setTimeout(e,0)}),this.#U()))return;let t=await z(e);t===null||this.#U()||(this.#b.set(e.expectedDigest,t),this.#R())}async#V(){if(this.#S)return;this.#S=!0,this.#R(),await new Promise(e=>{globalThis.requestAnimationFrame(()=>{globalThis.requestAnimationFrame(()=>{e()})})});let e=this.#b.size;await this.#B(),this.#S=!1,!this.#U()&&(this.#b.size===e&&(this.#p=`THIS MAP DOES NOT REBUILD FROM ITS SEED. THE ROUTE IS THE PICTURE.`),this.#R())}#H(){if(this.#S)return`building`;if(this.#u===null||!M())return null;let e=D(this.#u,this.#s())?.mapSource??null;return e===null||this.#x.has(e.expectedDigest)?null:`offer`}#U(){return this.#v}#W(e){this.#_?.(),this.#e.innerHTML=P(e,this.#s()),this.#_=l(this.#e)}};function P(e,t=new Date){if(e.status===`loading`)return`<main class="swervle-admin" data-admin-surface="v2" aria-busy="true">
      <p class="admin-activity-state" role="status">READING OPERATIONS&hellip;</p>
    </main>`;if(e.status===`error`)return`<main class="swervle-admin" data-admin-surface="v2" aria-busy="false">
      <section class="admin-profile__band" role="alert">
        <h1 class="admin-profile__band-title">OPERATIONS UNAVAILABLE</h1>
        <p class="admin-profile__span">${c(e.message)}</p>
        <p class="admin-profile__actions"><button class="board-scope-option" type="button"
          data-admin-action="retry-load">RETRY</button></p>
      </section>
    </main>`;let{snapshot:n}=e,r=e.busyActionKey??null,a=D(n,t),o=a?.mapSource===null||a===null?null:e.mapImages?.get(a.mapSource.expectedDigest)??null;return i(`operations`,`<section class="admin-today admin-operations"
    aria-label="Operations" aria-busy="${r===null?`false`:`true`}">
    ${e.actionMessage===null?``:`<p class="admin-activity-state" role="status" aria-live="polite">${c(e.actionMessage)}</p>`}
    ${F(a,r,t,o,e.mapBuild??null)}
    ${_e(n,r,t)}
    ${e.resultHtml.length===0?``:`<div aria-live="polite">${e.resultHtml}</div>`}
    ${he(n,e.calendarMonth??null,a?.day.dailyId??null)}
    ${ye(n,t)}
    ${xe(n.clientPerformance)}
    ${Ce()}
  </section>`)}function F(e,t,n,r,i=null){if(e===null)return W(`NEXT MAP`,`<p class="admin-today__zero">NO DAY IS SCHEDULED.</p>`);let l=e.driveHref===null?`<span class="admin-profile__none">NOTHING IS BUILT TO DRIVE.</span>`:`<a class="board-scope-option" data-intent="primary" data-admin-drive
        href="${s(e.driveHref)}" target="_blank" rel="noopener">${e.live?`DRIVE TODAY`:`DRIVE IT`}</a>`;return`<section class="admin-profile__band admin-operations__hero-band"
    aria-labelledby="admin-ops-next">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-next">${e.live?`TODAY&rsquo;S MAP`:`NEXT MAP`}</h2>
      <p class="admin-profile__pills">
        <span class="admin-pill" data-tone="${s(e.status.tone)}">${c(e.status.label)}</span>
        ${a({id:e.day.dailyId,kind:`day`,maxLabelLength:12})}
        ${e.checks.map(q).join(``)}
      </p>
    </div>
    <div class="admin-operations__hero">
      ${I(e.day,r,e.imageUrl,e.imageAlt,i)}
      <div class="admin-operations__hero-facts">
        ${L(e.activationAtIso,e.live,n)}
        <div class="admin-operations__facts">
          ${B(`BIOME`,c(e.biome))}
          ${B(`SEED`,String(e.seed))}
          ${e.trackDigest===null?``:B(`DIGEST`,`${c(e.trackDigest.slice(0,12))}${o(e.trackDigest,`Copy track digest`)}`)}
        </div>
        <div class="admin-operations__do">
          ${l}
          ${V(e.seedControl,t)}
        </div>
        ${e.seedControl===null?`<p class="admin-today__note">${e.live?`A LIVE MAP CANNOT CHANGE SEED.`:`NO SEED CONTROL: NOTHING IS STAGED FOR THIS DAY YET.`}</p>`:`<p class="admin-today__note">${c(e.seedControl.consequence)}</p>`}
      </div>
    </div>
  </section>`}function I(e,t,n,r,i=null){let a=O(e),o=t!==null||i===null?``:`<button class="board-scope-option" type="button" data-admin-action="build-full-map"
      ${i===`building`?`disabled`:``}>${i===`building`?`BUILDING THE MAP&hellip;`:`SHOW FULL MAP`}</button>`,l=t??n;return`<div class="admin-operations__hero-art">
    ${l===null?`<p class="admin-today__zero">MAP PREVIEW ${c(a.status)}</p>`:`<img class="admin-operations__map" src="${s(l)}"
      alt="${s(t===null?r:`Rebuilt terrain map for ${e.dailyId}`)}">`}
    ${l===null?``:`<p class="admin-profile__pills"><span class="admin-pill" data-tone="${t===null?`neutral`:`ok`}">${t===null?`ROUTE ONLY`:`FULL MAP`}</span>${o}</p>`}
  </div>`}function L(e,t,n){let r=C(e,n);return r===null?`<div class="admin-operations__countdown-tile">
      <span class="admin-profile__tile-label">GOES LIVE</span>
      <span class="admin-operations__countdown">${t?`LIVE NOW`:`UNSCHEDULED`}</span>
    </div>`:`<div class="admin-operations__countdown-tile" data-admin-countdown="${s(r.activationAtIso)}">
    <span class="admin-profile__tile-label" data-admin-countdown-label>${r.live?`WENT LIVE`:`GOES LIVE IN`}</span>
    <span class="admin-operations__countdown" role="timer" data-admin-countdown-value>${c(r.label)}</span>
    <span class="admin-profile__tile-detail">${c(d(r.activationAtIso).toUpperCase())}</span>
  </div>`}function R(e,t){for(let n of e.querySelectorAll(`[data-admin-countdown]`)){let e=C(n.dataset.adminCountdown??null,t);if(e===null)continue;let r=n.querySelector(`[data-admin-countdown-value]`);r!==null&&(r.textContent=e.label);let i=n.querySelector(`[data-admin-countdown-label]`);i!==null&&(i.textContent=e.live?`WENT LIVE`:`GOES LIVE IN`)}}async function z(e){try{let[t,n,i]=await Promise.all([r(()=>import(`./c5c40cc0-BWtHKyr1.js`).then(e=>e.t),__vite__mapDeps([4,2,5,6,7,8,9])),r(()=>import(`./c5c40cc0-DpfM-SsN.js`).then(e=>e.U),__vite__mapDeps([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53])),r(()=>import(`./c5c40cc0-B_YTYEkU.js`).then(e=>e.t),__vite__mapDeps([19,2,13,18,8]))]),a=[i.swervleTrackRulesetVersionForDailyV1(e.dailyId),void 0];for(let r of a){let i;try{i=t.generateTrackV2(r===void 0?{seed:e.seed}:{rulesetVersion:r,seed:e.seed})}catch{continue}if(i.revision.trackDigest!==e.expectedDigest)continue;let a=n.renderTopDownPreviewSvgV1({spec:n.createTopDownPreviewSpecV1({dailyId:e.dailyId,track:i}),targetId:`operator-preview`,track:i}).svg;return`data:image/svg+xml,${encodeURIComponent(a)}`}return null}catch{return null}}function B(e,t){return`<p class="admin-operations__fact"><span class="admin-profile__tile-label">${c(e)}</span><b>${t}</b></p>`}function V(e,t){if(e===null)return``;let n=t===`seed:${e.dailyId}`,r=`admin-ops-seed-${e.dailyId}`;return`<form class="admin-operations__seed" data-admin-seed-port="${s(e.port)}" aria-busy="${n?`true`:`false`}">
    <input type="hidden" name="dailyId" value="${s(e.dailyId)}">
    <label class="admin-profile__band-label" for="${s(r)}">SEED</label>
    <input class="admin-profile__field admin-operations__seed-field"
      id="${s(r)}" name="seed" type="number" inputmode="numeric"
      min="0" max="4294967295" step="1" required value="${String(e.seed)}"
      ${n?`disabled`:``}>
    <button class="board-scope-option" type="submit" ${n?`disabled`:``}>${n?`WORKING&hellip;`:c(e.action)}</button>
  </form>`}function he(e,t,n){let r=te(e),i=ne(r,t,n);if(i===null)return W(`SCHEDULE`,`<p class="admin-today__zero">NO DAY HAS BEEN BUILT YET.</p>`);let a=oe(r,i),o=re(e,i);return`<section class="admin-profile__band" aria-labelledby="admin-ops-schedule">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-schedule">SCHEDULE</h2>
      <div class="admin-profile__actions">
        <button class="board-scope-option" type="button" data-admin-action="calendar-month"
          data-admin-calendar-month="${s(a.previous??i)}"
          aria-label="Previous month" ${a.previous===null?`disabled`:``}>&larr;</button>
        <span class="admin-profile__band-label"><b>${c(ie(i))}</b></span>
        <button class="board-scope-option" type="button" data-admin-action="calendar-month"
          data-admin-calendar-month="${s(a.next??i)}"
          aria-label="Next month" ${a.next===null?`disabled`:``}>&rarr;</button>
      </div>
    </div>
    <div class="admin-profile__tiles admin-operations__month">${o.map(e=>ge(e,n)).join(``)}</div>
  </section>`}function ge(e,t){let n=h(e),r=e.raceCount>0,i=e.dailyId===t;return`<a class="admin-operations__day-tile" data-admin-day-link="${s(e.dailyId)}"${i?` data-admin-day-focus="true"`:``}
    href="?tab=operations&amp;day=${encodeURIComponent(e.dailyId)}">
    <span class="admin-profile__tile-label">${c(ae(e.dailyId))}</span>
    <span class="admin-pill" data-tone="${s(n.tone)}">${c(n.label)}</span>
    <span class="admin-profile__tile-value">${r?String(e.completionCount):``}</span>
    <span class="admin-profile__tile-detail">${r?`OF ${String(e.raceCount)} RACES`:`NOT RACED`}</span>
    <span class="admin-profile__tile-detail admin-operations__day-more">SEED ${String(_(e))}</span>
    <span class="admin-profile__tile-detail admin-operations__day-more">${c(v(k(e)))}</span>
  </a>`}function _e(e,t,n){let{exceptions:r,latestRun:i}=e.dailyAutomation;return r.length===0?``:`<section class="admin-profile__band" aria-labelledby="admin-ops-exceptions">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-exceptions">SCHEDULER STUCK</h2>
      <p class="admin-profile__band-label">${i===null?`NO SCHEDULER RUN RECORDED`:`LAST RUN <b>${c(u(i.runAtIso,n))}</b>`}</p>
    </div>
    <ul class="admin-activity__list">${r.map(e=>ve(e,t)).join(``)}</ul>
  </section>`}function ve(e,t){let n=e.publicationId===null?`veto`:`pull`,r=t===`automation:${n}:${e.dailyId}`,i=t===`automation:reseed:${e.dailyId}`,o=se(e.attempts.at(-1)?.seed??0),l=e.attempts.slice(-5).map(e=>`<li class="admin-profile__span">#${String(e.ordinal)} SEED ${String(e.seed)} &middot; ${c(e.rejectionCodes.length===0?`PASSED`:e.rejectionCodes.join(`, `))}</li>`).join(``),u={reason:`admin-ops-${n}-reason-${e.dailyId}`,reseedReason:`admin-ops-reseed-reason-${e.dailyId}`,seed:`admin-ops-reseed-seed-${e.dailyId}`};return`<li class="admin-activity-row" role="${e.severity===`error`?`alert`:`status`}">
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
  </li>`}function ye(e,t){return e.reviewQueue.length===0?``:`<section class="admin-profile__band" aria-labelledby="admin-ops-integrity">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-integrity">HELD FOR REVIEW</h2>
      <p class="admin-profile__band-label"><b>${String(e.reviewQueue.length)}</b> OPEN</p>
    </div>
    <ul class="admin-activity__list">${e.reviewQueue.map(e=>be(e,t)).join(``)}</ul>
  </section>`}function be(e,t){let n=`admin-ops-review-note-${e.reviewId}`,r=p(e),i=K(e),a=f(e),o=r.officialTime===null?``:`<div class="admin-activity-row__duration"><b>${c(r.officialTime)}</b>${a?`<span class="admin-profile__span">CLAIMED</span>`:``}</div>`,l=e.onBoard===!0?`<span class="admin-pill" data-tone="good">ON THE BOARD</span>`:`<button class="board-scope-option" type="button" data-intent="primary"
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
  </li>`}function xe(e){if(e===null)return W(`CLIENT PERFORMANCE`,`<p class="admin-today__zero">NOT MEASURED HERE: ANALYTICS ENGINE IS NOT READABLE
        FROM THIS DEPLOYMENT.</p>`);let t=`LAST ${String(e.windowDays)} DAYS`;if(e.tiers.length===0&&e.devices.length===0)return W(`CLIENT PERFORMANCE`,`<p class="admin-today__zero">NO RACE REPORTED A FRAME BUDGET IN THE ${c(t)}.</p>`);let n=e.tiers.reduce((e,t)=>e+t.races,0);return W(`CLIENT PERFORMANCE`,`<p class="admin-profile__band-label"><b>${c(t)}</b> ${String(n)} RACES REPORTED</p>
    <div class="admin-profile__tiles">${e.tiers.map(e=>J(String(e.races),e.tier.toUpperCase(),Se(e.races,n))).join(``)}</div>
    <p class="admin-profile__band-label">95TH PERCENTILE FRAME, BY DEVICE</p>
    ${e.devices.length===0?`<p class="admin-today__zero">NO REPORT CARRIED A FRAME TIME.</p>`:`<div class="admin-profile__tiles">${e.devices.map(e=>J(e.p95FrameMs===null?`NOT READ`:`${e.p95FrameMs.toFixed(1)} MS`,e.deviceClass.toUpperCase(),`${String(e.races)} MEASURED`)).join(``)}</div>`}`)}function Se(e,t){return t<=0?null:`${String(Math.round(e/t*100))}% OF RACES`}function Ce(){return`<section class="admin-profile__band" aria-labelledby="admin-ops-lookup">
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
  </form>`}function we(e,t=new Date,n=null,r=!1){let{day:i}=e,a=h(i),o=O(i),l=b(i),u=w(i);return`<section class="admin-profile__band admin-operations__hero-band"
    aria-labelledby="admin-ops-day">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-day">${c(i.dailyId)}</h2>
      <p class="admin-profile__pills">
        <span class="admin-pill" data-tone="${s(a.tone)}">${c(a.label)}</span>
        ${r&&Fe(i)?`<span class="admin-entity-flag" data-tone="bad">DEV BYPASS</span>`:``}
        ${T(i).map(q).join(``)}
      </p>
    </div>
    <div class="admin-operations__hero">
      ${I(i,null,o.imageUrl,o.alt)}
      <div class="admin-operations__hero-facts">
        ${L(i.activationAtIso??null,x(i),t)}
        <div class="admin-operations__facts">
          ${B(`BIOME`,c(v(k(i))))}
          ${B(`SEED`,String(_(i)))}
        </div>
        <div class="admin-operations__do">
          ${l===null?``:`<a class="board-scope-option" data-intent="primary" data-admin-drive
              href="${s(l)}" target="_blank" rel="noopener">DRIVE IT</a>`}
          ${V(u,n)}
        </div>
        ${u===null?``:`<p class="admin-today__note">${c(u.consequence)}</p>`}
      </div>
    </div>
    <div class="admin-profile__tiles">
      ${J(String(i.completionCount),`FINISHES`,`OF ${String(i.raceCount)} RACES`)}
      ${J(String(i.quitCount),`QUITS`,Te(e))}
      ${J(String(i.retryCount),`RETRIES`,null)}
      ${J(String(i.offlineAiRaceCount),`AI RUNS`,null)}
    </div>
    ${Ee(i.curation,n)}
  </section>
  ${Oe(e)}
  ${ke(e,n,t)}`}function Te(e){return e.quitCheckpointCounts.length===0?null:`AT ${e.quitCheckpointCounts.map(({checkpointIndex:e,count:t})=>`CP${String(e)}×${String(t)}`).join(` `)}`}function Ee(e,t){if(e.availability===`unavailable`)return fe(e)?``:`<p class="admin-activity-state admin-activity-state--error" role="alert">
      THE CANDIDATE SERVICE DID NOT ANSWER. RELOAD BEFORE DECIDING ANYTHING.</p>`;let n=pe(e),r=t===`curation-approve:${e.dailyId}`,i=t===`curation-test:${e.dailyId}`,a=me(e)&&!r;return`<div class="admin-profile__signals">
    <p class="admin-profile__pills">
      <span class="admin-pill" data-tone="neutral">${c(e.buildState.toUpperCase())}</span>
      <span class="admin-pill" data-tone="neutral">REBUILD ${c(e.rebuild.status.toUpperCase())}</span>
      ${n===null?``:`<span class="admin-profile__span">FUN <b>${String(n.score)}</b> &middot; ${c(n.recommendation)} &middot; ${String(n.drivers)} AI RUNS</span>`}
      <span class="admin-profile__span">CANDIDATE ${c(e.candidateId)}</span>
      ${e.approval===null?`<span class="admin-profile__none">AUTO-POLICY DECIDES PUBLICATION</span>`:`<span class="admin-profile__span">APPROVED BY ${c(e.approval.approvedByAccountId)}</span>`}
    </p>
    ${De(e)}
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
  </div>`}function De(e){let t=[];return e.playabilityBudget.status===`failed`&&t.push(U(e.failureCode===null?`PLAYABILITY FAILED`:`PLAYABILITY FAILED (${e.failureCode.replaceAll(`-`,` `).toUpperCase()})`,e.playabilityBudget,`check`)),e.performanceBudget.status===`failed`&&t.push(U(`PERFORMANCE BUDGET EXCEEDED`,e.performanceBudget,`ms`)),t.length===0?``:`<div role="alert">${t.join(``)}</div>`}function U(e,t,n){let r=Y(t.measured,n===`ms`?`ms`:null),i=Y(t.maximum,n===`ms`?`ms`:null),a=n===`check`?`${r} FAILING / ${i} ALLOWED`:`MEASURED ${r} / BUDGET ${i}`,o=t.notes.length===0?``:`<ul class="admin-profile__signal-list">${t.notes.map(e=>`<li class="admin-profile__signal-why">${c(e)}</li>`).join(``)}</ul>`;return`<p class="admin-profile__band-label"><b>${c(e)}</b> ${c(a)}</p>${o}
    <p class="admin-profile__none">CHECK ${c(t.budgetVersion)}</p>`}function Oe(t){if(t.leaderboard.length===0)return W(`BOARD`,`<p class="admin-today__zero">NO RUN ON THIS DAY IS BOARD-ELIGIBLE.</p>`);let r=t.leaderboard.map(t=>`<li class="admin-activity-row admin-operations__row">
    <span class="admin-activity-row__country">${String(t.rank)}</span>
    <div class="admin-activity-row__body">
      <div class="admin-activity-row__who">${G(t.publicDisplayName)}${a({id:t.raceId,kind:`race`,maxLabelLength:14})}</div>
      <span class="admin-activity-row__code">${c(t.participantKind.toUpperCase())}${t.challengeShareIds.length===0?``:` &middot; ${c(t.challengeShareIds.join(`, `))}`}</span>
    </div>
    <div class="admin-activity-row__duration"><b>${c(e(n(t.durationTicks,t.displayTimeMs)))}</b></div>
  </li>`).join(``);return`<section class="admin-profile__band" aria-labelledby="admin-ops-board">
    <div class="admin-profile__livery-head">
      <h2 class="admin-profile__band-title" id="admin-ops-board">BOARD</h2>
      <p class="admin-profile__band-label"><b>${String(t.leaderboardTotalCount)}</b> RANKED${t.leaderboardTruncated?`, SHOWING ${String(t.leaderboard.length)}`:``}</p>
    </div>
    <ul class="admin-activity__list admin-operations__list">${r}</ul>
  </section>`}function ke(e,t,n){let r=de(e),{allRaces:i}=e,o=i.items.length===0?`<p class="admin-today__zero">NOBODY HAS RACED THIS DAY.</p>`:`<ul class="admin-activity__list admin-operations__list">${i.items.map(e=>{let t=ue(e,r.get(e.raceId)??null),i=le(e);return`<li class="admin-activity-row admin-operations__row">
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
      ${je(e,t)}
    </div>
    ${o}
  </section>`}var Ae=Object.freeze([[`fastest`,`FASTEST`],[`slowest`,`SLOWEST`],[`outcome`,`OUTCOME`],[`retries`,`MOST RETRIES`],[`quit-checkpoint`,`QUIT POINT`],[`flagged`,`FLAGGED FIRST`]]);function je(e,t){let n=t===`sort:${e.day.dailyId}`,r=`admin-ops-sort-${e.day.dailyId}`;return`<form class="admin-profile__actions" data-admin-day-sort
    aria-busy="${n?`true`:`false`}">
    <input type="hidden" name="dailyId" value="${s(e.day.dailyId)}">
    <label class="admin-activity__facet">
      <span class="admin-profile__band-label">SORT</span>
      <select id="${s(r)}" name="sort" ${n?`disabled`:``}>${Ae.map(([t,n])=>`<option value="${t}"${e.allRaces.query.sort===t?` selected`:``}>${n}</option>`).join(``)}</select>
    </label>
    <button class="board-scope-option" type="submit" ${n?`disabled`:``}>${n?`WORKING&hellip;`:`APPLY`}</button>
  </form>`}function Me(t,r){let i=t.verifierVerdict.durationTicks===null?`&mdash;`:c(e(n(t.verifierVerdict.durationTicks,t.verifierVerdict.displayTimeMs)));return`<section class="admin-profile__band" aria-labelledby="admin-ops-run">
    <h2 class="admin-profile__band-title" id="admin-ops-run">RUN</h2>
    <p class="admin-profile__pills">
      ${a({copyable:!0,id:t.raceId,kind:`race`})}
      ${G(t.publicDisplayName)}
      ${a({id:t.dailyId,kind:`day`,maxLabelLength:12})}
    </p>
    <div class="admin-profile__tiles">
      ${J(i,`OFFICIAL TIME`,t.verifierVerdict.verifierBuild)}
      ${J(t.outcome.toUpperCase(),`OUTCOME`,t.participantKind.toUpperCase())}
      ${J(t.leaderboardStatus.toUpperCase(),`BOARD`,t.verifierVerdict.status.toUpperCase())}
      ${J(String(t.humanTelemetry.activeRaceTicks),`TICKS`,`CP ${String(t.humanTelemetry.lastCheckpointIndex)}`)}
    </div>
    <p class="admin-profile__span">SAVED <b>${c(u(t.endedAtIso,r))}</b></p>
  </section>`}function Ne(e){return`<section class="admin-profile__band" role="status">
    <h2 class="admin-profile__band-title">TEST RACE READY</h2>
    <p class="admin-profile__span">CANDIDATE <b>${c(e.candidateId)}</b> &middot; DIGEST <b>${c(e.trackDigest.slice(0,12))}</b></p>
    <p class="admin-profile__actions"><a class="board-scope-option" data-intent="primary"
      href="${s(e.url)}">DRIVE ${c(e.dailyId)}</a></p>
  </section>`}function Pe(e,t){return e.playbackUrl===null?`<section class="admin-profile__band" role="status">
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
  </section>`}function G(e){return e.trim()===``?`<span class="admin-entity admin-entity--plain">RACER</span>`:a({id:e,kind:`player`,label:e})}function K(e){let t=e.publicDisplayName?.trim()??``,n=e.accountId?.trim()??``;return a(n!==``||t!==``?{id:n===``?t:n,kind:`player`,label:t===``?null:t}:{id:e.raceId,kind:`race`,maxLabelLength:14})}function q(e){return`<span class="admin-pill" data-tone="${s(e.tone)}">${c(e.label)}</span>`}function J(e,t,n){return`<div class="admin-operations__day-tile">
    <span class="admin-profile__tile-label">${c(t)}</span>
    <span class="admin-profile__tile-value">${c(e)}</span>
    ${n===null?``:`<span class="admin-profile__tile-detail">${c(n)}</span>`}
  </div>`}function Fe(e){if(!e.published)return!1;let{curation:t}=e;return t.availability!==`available`||t.buildState!==`approved`}function Y(e,t){return e===null?`—`:`${String(Math.round(e*100)/100)}${t===null?``:` ${t}`}`}function X(e,t){let n=e.dataset[t];if(n===void 0)throw TypeError(`Admin action target is missing.`);return n}function Z(e,t){let n=new FormData(e).get(t);if(typeof n!=`string`||n.trim().length===0)throw TypeError(`Admin form data is incomplete.`);return n.trim()}function Q(e,t){return e instanceof Error&&(e.name.startsWith(`Admin`)||e instanceof TypeError||e instanceof RangeError)?e.message.toUpperCase():t}function $(e){return typeof CSS>`u`?e.replaceAll(/[^A-Za-z0-9_-]/gu,`_`):CSS.escape(e)}var Ie=class extends N{};function Le(e,t=new Date){return P(e,t)}function Re(e,t){let n=Date.parse(e.expiresAtIso)-t;if(!Number.isFinite(n)||n<=0)return``;let r=Math.ceil(n/1e3);return`<p class="admin-undo" role="status"><button class="board-scope-option" type="button"
    data-admin-action="undo" data-undo="${s(JSON.stringify(e))}">UNDO</button>
    <span class="admin-muted">${String(r)}s</span></p>`}export{Le as n,Re as r,Ie as t};