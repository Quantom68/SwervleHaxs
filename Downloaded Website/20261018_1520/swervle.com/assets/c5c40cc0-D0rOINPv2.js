import{r as e,t}from"c5c40cc0-BhOk4swo.js";import{dismissShopNoticeV1 as n,readShopStateV1 as r,shopNoticesV1 as i}from"c5c40cc0-CKO_P-YD.js";var a=null;function o(e){let n=e.subject===null?``:`<p class="shop-notice-subject">${t(e.subject.toUpperCase())}</p>`;return`
      <div class="result-card shop-notice-dialog panel" data-approved="${String(e.approved)}" role="dialog" aria-modal="true" aria-labelledby="shop-notice-title" aria-describedby="shop-notice-text">
        <h2 id="shop-notice-title">${t(e.title)}</h2>
        ${n}
        <p class="shop-notice-text" id="shop-notice-text">${t(e.text)}</p>
        <div class="result-actions">
          <button class="primary-button shop-notice-ok" type="button" data-shop-notice-ok>OK</button>
        </div>
      </div>`}function s(){return a!==null}function c(t,s=r()){if(a!==null)return!1;let l=i(s)[0];if(l===void 0)return!1;let u=e({closeOnEscape:!1,closeOnScrimClick:!1,content:o(l),initialFocusSelector:`[data-shop-notice-ok]`,mount:t,scrimClassName:`shop-notice-scrim`});return a=u,u.element.addEventListener(`keydown`,e=>{e.key===`Escape`&&(e.stopPropagation(),e.preventDefault())}),u.element.querySelector(`[data-shop-notice-ok]`)?.addEventListener(`click`,()=>{u.close(),a=null,n(l.id).catch(()=>void 0).then(()=>{t.isConnected&&c(t)})}),!0}export{c as presentShopNoticesV1,o as renderShopNoticeV1,s as shopNoticeShowingV1};