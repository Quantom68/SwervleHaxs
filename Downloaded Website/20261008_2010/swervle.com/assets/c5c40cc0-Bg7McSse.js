import{n as e,r as t}from"c5c40cc0-eJHPJnKp2.js";var n=Object.freeze([7,30,90,365]),r=1440*60*1e3,i=Object.freeze({growth:Object.freeze([`dashboard`,`race`,`garage`,`cohorts`,`days`]),revenue:Object.freeze([`dashboard`,`grants`,`patreon`]),traffic:Object.freeze([`dashboard`,`sources`,`locations`,`referrals`,`campaigns`])}),a=Object.freeze({campaigns:Object.freeze({tab:`traffic`,view:`campaigns`}),funnel:Object.freeze({tab:`growth`,view:`dashboard`}),locations:Object.freeze({tab:`traffic`,view:`locations`}),maps:Object.freeze({tab:`growth`,view:`days`}),overview:Object.freeze({tab:`growth`,view:`dashboard`}),referrals:Object.freeze({tab:`traffic`,view:`referrals`}),sources:Object.freeze({tab:`traffic`,view:`sources`})});function o(e){let t=e.searchParams,n=t.get(`tab`)??``,r=a[n],i=r?.tab??s(n),o=r?.view??c(i,t.get(`view`)),u=t.get(`from`),d=t.get(`to`),f=u!==null||d!==null;return Object.freeze({cursor:t.get(`cursor`),days:f?null:l(t.get(`days`)),fromIso:u,includeInternal:t.get(`includeInternal`)===`1`,legacyTab:r===void 0?null:n,tab:i,toIso:d,view:o})}function s(e){return e===`traffic`||e===`revenue`||e===`growth`?e:`growth`}function c(e,t){return i[e].find(e=>e===t)??`dashboard`}function l(e){let t=e===null?NaN:Number(e);return n.includes(t)?t:30}function u(e,t){return e.days===null?e.fromIso??void 0:new Date(t.getTime()-e.days*r).toISOString().slice(0,10)}function d(e){return e.days===null?e.toIso??void 0:void 0}function f(e,t={}){let n=t.tab??e.tab,r=t.view??(t.tab===void 0?e.view:`dashboard`),i=t.days??e.days,a=t.includeInternal??e.includeInternal,o=t.cursor??null,s=new URLSearchParams;return s.set(`tab`,n),r!==`dashboard`&&s.set(`view`,r),i===null?(e.fromIso!==null&&s.set(`from`,e.fromIso),e.toIso!==null&&s.set(`to`,e.toIso)):i!==30&&s.set(`days`,String(i)),a&&s.set(`includeInternal`,`1`),o!==null&&s.set(`cursor`,o),`?${s.toString()}`}function p(e){return`<div class="admin-activity__head" role="group" aria-label="Range">
    <div class="admin-activity__filters">
      <span class="admin-activity__volume-label">RANGE</span>${n.map(t=>h(t===365?`1Y`:`${String(t)}D`,f(e,{days:t}),e.days===t)).join(``)}${e.days===null?S(`CUSTOM ${m(e)}`,`attention`):``}
    </div>
    <div class="admin-activity__filters">
      ${h(`MY OWN TRAFFIC`,f(e,{includeInternal:!e.includeInternal}),e.includeInternal)}
    </div>
  </div>`}function m(e){let t=e.fromIso??`START`,n=e.toIso??`NOW`;return`${t.slice(0,10)} TO ${n.slice(0,10)}`}function h(n,r,i){return`<button class="board-scope-option" type="button" aria-pressed="${i?`true`:`false`}" data-admin-analytics-go="${e(r)}">${t(n)}</button>`}function g(e,n){return`<div class="admin-activity__head">
    <div class="admin-activity__filters">
      ${h(`BACK`,f(e,{tab:e.tab}),!1)}
      <span class="admin-activity__volume-label">${t(n)}</span>
    </div>
    <div class="admin-activity__filters"></div>
  </div>`}function _(n,r,i){let a=`admin-analytics-${n.toLowerCase().replaceAll(/[^a-z]+/gu,`-`)}`;return`<section class="admin-today__card" aria-labelledby="${e(a)}">
    <header class="admin-today__card-head">
      <h2 class="admin-today__card-title" id="${e(a)}">${t(n)}</h2>
      <p class="admin-eyebrow">${t(r)}</p>
    </header>
    ${i}
  </section>`}function v(n,r,i){let a=`admin-analytics-band-${n.toLowerCase().replaceAll(/[^a-z]+/gu,`-`)}`;return`<section class="admin-profile__band" aria-labelledby="${e(a)}">
    <div class="admin-today__card-head">
      <h2 class="admin-profile__band-title" id="${e(a)}">${t(n)}</h2>
      <p class="admin-eyebrow">${t(r)}</p>
    </div>
    ${i}
  </section>`}function y(e,n,r=null){return`<div class="admin-today__figure">
    <b class="admin-today__figure-value">${t(e)}</b>
    <span class="admin-today__figure-label">${t(n)}</span>
    ${r??``}
  </div>`}function b(e,t=!1){return`<div class="admin-today__figures${t?` admin-today__figures--tight`:``}">${e.join(``)}</div>`}function x(n,r){return`<span class="admin-today__delta" data-tone="${e(r)}">${t(n)}</span>`}function S(n,r){return`<span class="admin-pill" data-tone="${e(r)}">${t(n)}</span>`}function C(e,n){return`<span class="admin-people-row__stat"><b>${t(e)}</b> ${t(n)}</span>`}function w(n){return`<ul class="admin-today__queues">${n.map(n=>`<li class="admin-today__queue">
    <button class="admin-today__queue-link" type="button" data-admin-analytics-go="${e(n.search)}">${t(n.label)}</button>
    ${n.count===``?``:`<b class="admin-today__queue-count">${t(n.count)}</b>`}
  </li>`).join(``)}</ul>`}function T(e,n,r){return`<li class="admin-today__queue">
    <div class="admin-activity-row__body">
      <div class="admin-activity-row__who">${e}</div>
      <div class="admin-activity-row__meta">${n}</div>
    </div>
    <b class="admin-today__queue-count">${t(r)}</b>
  </li>`}function E(e){return`<ul class="admin-today__queues">${e.join(``)}</ul>`}function D(e){return`<span class="admin-today__queue-link">${t(e)}</span>`}function O(t,n){return t.length===0?``:`<div class="admin-activity__bars" role="img" aria-label="${e(n)}">${t.map(e=>{let t=Number.isFinite(e)?Math.min(1,Math.max(0,e)):0;return t<=0?`<span class="admin-activity__bar" data-empty="true"></span>`:`<span class="admin-activity__bar" style="--admin-bar:${t.toFixed(4)}"></span>`}).join(``)}</div>`}function k(e){return`<p class="admin-today__zero">${t(e)}</p>`}function A(e){return`<p class="admin-activity-state admin-activity-state--error" role="alert">${t(e)}</p>`}function j(e){return`<p class="admin-activity-state" role="status">${t(e)}</p>`}function M(e){return e===null?`NONE`:new Intl.NumberFormat(`en-US`).format(e)}function N(e){return e===null||!Number.isFinite(e)?`NONE`:`${(e*100).toFixed(e>=.1?0:1)}%`}function P(e){return new Intl.NumberFormat(`en-US`,{currency:`USD`,maximumFractionDigits:2,minimumFractionDigits:e%100==0?0:2,style:`currency`}).format(e/100)}export{P as C,p as E,M as S,g as T,h as _,d as a,C as b,_ as c,A as d,y as f,j as g,E as h,f as i,x as l,T as m,u as n,v as o,b as p,o as r,O as s,a as t,w as u,S as v,N as w,k as x,D as y};