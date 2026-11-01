import{a as e,i as t}from"c5c40cc0-Cq8C9w5B2.js";import{STEAM_ACHIEVEMENT_KEYS_V1 as n}from"c5c40cc0-D153q8VB.js";var r=`swervle.steam.session.v1`;async function i(e){let n=t();if(n===null)throw Error(`Steam sign-in requires the Steam preload bridge.`);let r=e.sessionStorage===void 0?l():e.sessionStorage,i=await a(n),u=o(i,e.initialSession);if(e.initialSession.kind===`signed-in`&&u!==null&&s(r)===u)return await _(e.mount,n,e.initialSession.steam?.shellMinimum??null),{created:!1,session:e.initialSession};for(c(r,null);;){e.onLoading?.(`SIGNING IN WITH STEAM…`);let t;try{t=await n.getAuthTicket()}catch{await v(e.mount,`Steam is not available right now.`);continue}let a=await e.gateway.exchangeTicket(t);if(!a.ok){await v(e.mount,g(a.reason));continue}if(a.session.kind!==`signed-in`){await v(e.mount,`Steam sign-in did not create an account session.`);continue}return await _(e.mount,n,a.session.steam?.shellMinimum??null),c(r,o(i,a.session)),{created:a.created,session:a.session}}}async function a(e){let t=e.lobby;if(typeof t?.self!=`function`)return null;try{let{steamId:e}=await t.self();return/^[0-9]{17}$/u.test(e)?e:null}catch{return null}}function o(e,t){return e===null||t.kind!==`signed-in`||t.steam?.linked!==!0||!t.accountId?null:JSON.stringify([e,t.accountId])}function s(e){try{return e?.getItem(r)??null}catch{return null}}function c(e,t){try{t===null?e?.removeItem(r):e?.setItem(r,t)}catch{}}function l(){try{return globalThis.sessionStorage}catch{return null}}async function u(e){let t=e.storage??E(),n=h(e.session);try{if(t?.getItem(n)===`done`)return e.session;t?.setItem(n,`pending`)}catch{}let r=x(e.mount,`
    <p class="eyebrow">STEAM SIGN-IN</p>
    <h2>Already race on swervle.com?</h2>
    <p class="account-copy">Link this Steam copy to keep your web name, history and earned achievements.</p>
    <div class="account-actions">
      <button class="primary-button" type="button" data-steam-action="link">LINK MY ACCOUNT</button>
      <button class="secondary-button" type="button" data-steam-action="fresh">START FRESH</button>
    </div>`),i=await C(r,new Set([`fresh`,`link`])),a=e.session;if(i===`link`){let t=await y(e.mount,e.gateway,`START FRESH`);t!==null&&(a=t)}r.remove();try{t?.setItem(h(a),`done`),a.username!==e.session.username&&t?.setItem(n,`done`)}catch{}return a}function d(e,t=E()){try{t?.setItem(h(e),`pending`)}catch{}}function f(e,t=E()){try{return t?.getItem(h(e))===`pending`}catch{return!1}}async function p(e,t){return await y(e,t,`BACK`)!==null}async function m(e,r,i=E()){let a=t();if(a===null||r.kind!==`signed-in`)return;let o=await e.loadAchievements();if(o===null)return;let s=new Set(n),c=`swervle.steam.ach.${r.accountId??r.username}`,l=T(i,c);for(let e of o){if(!s.has(e)||l.has(e))continue;let t=!1;try{t=await a.unlockAchievement(e)}catch{}if(t){l.add(e);try{i?.setItem(c,JSON.stringify([...l]))}catch{}}}}function h(e){return`swervle.steam.firstLaunch.${e.accountId??e.username}`}function g(e){switch(e){case`upstream`:return`Steam sign-in is temporarily unavailable.`;case`not-owned`:return`This Steam account does not own Swervle.`;case`account-disabled`:return`This Swervle account is disabled.`;case`replayed`:return`That Steam ticket was already used. Request a new one.`;case`invalid`:case`malformed`:return`Steam could not verify this copy of Swervle.`;case`unavailable`:return`Swervle could not reach Steam sign-in.`}}async function _(t,n,r){r===null||e(n.shellVersion,r)||(x(t,`
    <p class="eyebrow">UPDATE REQUIRED</p>
    <h2>UPDATE SWERVLE IN STEAM</h2>
    <p class="account-copy">This version can no longer connect. Install the latest update from your Steam Library.</p>
    <div class="account-actions">
      <button class="primary-button" type="button" data-steam-action="open-steam">OPEN STEAM</button>
    </div>`).addEventListener(`click`,e=>{w(e)===`open-steam`&&n.openExternal(`steam://nav/library`)}),await new Promise(()=>void 0))}async function v(e,t){let n=x(e,`
    <p class="eyebrow">STEAM SIGN-IN</p>
    <h2>COULDN'T SIGN IN</h2>
    <p class="account-copy">${O(t)}</p>
    <div class="account-actions">
      <button class="primary-button" type="button" data-steam-action="retry">RETRY</button>
    </div>`);await C(n,new Set([`retry`])),n.remove()}async function y(e,n,r){let i=t();if(i===null)return null;let a=x(e,`
    <p class="eyebrow">LINK ACCOUNT</p>
    <h2>CREATING LINK CODE…</h2>
    <p class="account-copy">Keep this window open.</p>`),o=await n.issueLinkCode();if(o===null)return a.innerHTML=S(`
      <p class="eyebrow">LINK ACCOUNT</p>
      <h2>LINKING IS UNAVAILABLE</h2>
      <p class="account-copy">This Steam account cannot start a link right now.</p>
      <div class="account-actions"><button class="secondary-button" type="button" data-steam-action="cancel">${r}</button></div>`),await C(a,new Set([`cancel`])),a.remove(),null;a.innerHTML=S(`
    <p class="eyebrow">LINK ACCOUNT</p>
    <h2 class="steam-link-code">${O(o.code)}</h2>
    <p class="account-copy">Open your browser, sign in to your existing Swervle account, and confirm this code.</p>
    <p class="account-note steam-link-wait"><span aria-hidden="true">●</span> Waiting for confirmation…</p>
    <div class="account-actions">
      <button class="primary-button" type="button" data-steam-action="browser">OPEN BROWSER</button>
      <button class="secondary-button" type="button" data-steam-action="cancel">${r}</button>
    </div>`);let s={cancelled:!1};a.addEventListener(`click`,e=>{let t=w(e);t===`browser`&&i.openExternal(o.url),t===`cancel`&&(s.cancelled=!0)});let c=Math.min(Date.parse(o.expiresAt),Date.now()+10*6e4);for(;!s.cancelled&&Date.now()<c;){let t=await n.pollLinkCode(o.codeId);if(t.status===`claimed`||t.status===`consumed`){let r=t.session??await n.loadSession();if(r.kind===`signed-in`)return a.remove(),t.message!==null&&await b(e,t.message),r}if(t.status===`expired`)break;await D(3e3)}return a.remove(),null}async function b(e,t){let n=x(e,`
    <p class="eyebrow">ACCOUNT LINKED</p>
    <h2>YOU'RE READY</h2>
    <p class="account-copy">${O(t)}</p>
    <div class="account-actions">
      <button class="primary-button" type="button" data-steam-action="continue">CONTINUE</button>
    </div>`);await C(n,new Set([`continue`])),n.remove()}function x(e,t){e.querySelector(`[data-steam-blocker]`)?.remove();let n=document.createElement(`div`);return n.className=`modal-scrim steam-blocker`,n.dataset.steamBlocker=`true`,n.innerHTML=S(t),e.append(n),n}function S(e){return`<div class="result-card account-dialog panel steam-card" role="dialog" aria-modal="true">${e}</div>`}function C(e,t){return new Promise(n=>{let r=i=>{let a=w(i);a===null||!t.has(a)||(e.removeEventListener(`click`,r),n(a))};e.addEventListener(`click`,r)})}function w(e){return(e.target instanceof Element?e.target.closest(`[data-steam-action]`):null)?.dataset.steamAction??null}function T(e,t){try{let n=JSON.parse(e?.getItem(t)??`[]`);return new Set(Array.isArray(n)?n.filter(e=>typeof e==`string`):[])}catch{return new Set}}function E(){try{return globalThis.localStorage}catch{return null}}function D(e){return new Promise(t=>{globalThis.setTimeout(t,e)})}function O(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}export{i as ensureSteamSessionV1,f as isSteamFirstLaunchPendingV1,d as markSteamFirstLaunchPendingV1,m as mirrorSteamAchievementsV1,p as openSteamAccountLinkFlowV1,u as presentSteamFirstLaunchV1,h as steamFirstLaunchStorageKeyV1,g as steamTicketFailureMessageV1};