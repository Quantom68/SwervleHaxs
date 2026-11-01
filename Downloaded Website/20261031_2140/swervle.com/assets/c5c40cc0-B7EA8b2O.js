import{_t as e}from"c5c40cc0-DpfM-SsN.js";import{HttpSteamAccountGatewayV1 as t}from"c5c40cc0-D153q8VB.js";function n(e,t,n=`idle`){if(n===`claimed`)return i(e,`
      <p class="eyebrow">STEAM LINK</p>
      <h1>ACCOUNT LINKED</h1>
      <p>Your Steam copy is ready. Return to Swervle in Steam.</p>`);if(n===`conflict`)return i(e,`
      <p class="eyebrow">STEAM LINK</p>
      <h1>STEAM IS ALREADY LINKED</h1>
      <p>This Steam account is already linked to another Swervle account. Unlink it there first.</p>`);if(t.kind!==`signed-in`)return i(e,`
      <p class="eyebrow">STEAM LINK · ${a(e)}</p>
      <h1>SIGN IN TO LINK</h1>
      <p>Sign in to the Swervle account whose name and race history you want to use in Steam.</p>
      <div class="account-actions">
        <button class="primary-button" type="button" data-link-action="google">CONTINUE WITH GOOGLE</button>
      </div>
      <form class="account-email" data-link-email novalidate>
        <label class="account-email-label" for="steam-link-email">Or use your email</label>
        <div class="account-email-row">
          <input id="steam-link-email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" data-link-email-input>
          <button class="secondary-button" type="submit">EMAIL ME A LINK</button>
        </div>
        <p class="account-note" data-link-note role="status"></p>
      </form>`);let r=n===`unavailable`?`<p class="account-note" role="alert">That code could not be claimed. Check the code in Steam and try again.</p>`:``;return i(e,`
    <p class="eyebrow">STEAM LINK · ${a(e)}</p>
    <h1>LINK YOUR STEAM COPY?</h1>
    <p>Link your Steam copy to <strong>${a(t.username)}</strong>?</p>
    ${r}
    <div class="account-actions">
      <button class="primary-button" type="button" data-link-action="confirm"${n===`claiming`?` disabled`:``}>${n===`claiming`?`LINKING…`:`CONFIRM`}</button>
    </div>`)}async function r(r,i,a=new e,o=new t){document.body.dataset.swervleSurface=`steam-link`;let s=await a.load(),c=e=>{r.innerHTML=n(i,s,e)};c(`idle`),r.addEventListener(`click`,e=>{let t=e.target instanceof Element?e.target.closest(`[data-link-action]`)?.dataset.linkAction:void 0;if(t===`google`){a.startGoogleSignIn(`/link/${i}`);return}t!==`confirm`||s.kind!==`signed-in`||(c(`claiming`),o.claimLinkCode(i).then(e=>{c(e===`claimed`?`claimed`:e===`conflict`?`conflict`:`unavailable`)}))}),r.addEventListener(`submit`,e=>{let t=e.target instanceof HTMLFormElement&&e.target.matches(`[data-link-email]`)?e.target:null;if(t===null)return;e.preventDefault();let n=t.querySelector(`[data-link-email-input]`),r=t.querySelector(`[data-link-note]`),o=n?.value.trim()??``;if(!o.includes(`@`)){n?.focus();return}a.startEmailSignIn(o,`/link/${i}`).then(e=>{r!==null&&(r.textContent=e===`sent`?`Check your email, then return here to confirm the link.`:`Email sign-in is unavailable. Try again in a moment.`)})})}function i(e,t){return`<main class="steam-link-page" data-link-code="${a(e)}">
    <section class="result-card account-dialog panel steam-link-panel">
      ${t}
    </section>
  </main>`}function a(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}export{r as bootSteamLinkRouteV1};