import{r as e}from"c5c40cc0-BhOk4swo.js";import{t}from"c5c40cc0-BQtK1fGv.js";var n=Object.freeze([Object.freeze({label:`NAME`,subject:`display-name`}),Object.freeze({label:`TEAM`,subject:`team`}),Object.freeze({label:`PAINT`,subject:`livery`})]);function r(e){return`<div class="modal panel report-subject" role="dialog" aria-modal="true" aria-labelledby="report-subject-title">
        <h2 id="report-subject-title">REPORT ${a(e.displayName)}</h2>
        <div class="report-subject__options">
          ${n.map(e=>`<button type="button" class="secondary-button report-subject__option" data-report-subject="${e.subject}">${e.label}</button>`).join(`
          `)}
        </div>
        <div class="game-menu-options" role="group" aria-label="Report navigation">
          ${t({attributes:`data-report-subject-action='cancel'`,row:!0})}
        </div>
      </div>`}function i(t){let n=e({content:r({displayName:t.displayName}),initialFocusSelector:`[data-report-subject]`,mount:t.mount,scrimClassName:`report-subject-scrim`});n.element.addEventListener(`click`,e=>{let r=e.target;if(!(r instanceof HTMLElement))return;if(r.closest(`[data-report-subject-action='cancel']`)!==null){n.close();return}let i=r.closest(`[data-report-subject]`)?.dataset.reportSubject;i!==void 0&&(n.close(),(i===`display-name`||i===`team`||i===`livery`)&&t.onChoose(i))})}function a(e){return e.replace(/&/gu,`&amp;`).replace(/</gu,`&lt;`).replace(/>/gu,`&gt;`).replace(/"/gu,`&quot;`)}export{i as openReportSubjectDialogV1};