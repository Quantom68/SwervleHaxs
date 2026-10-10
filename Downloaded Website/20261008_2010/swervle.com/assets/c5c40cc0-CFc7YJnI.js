import{Dt as e,Hn as t,Jt as n,R as r,T as i,_r as a,cr as o,zn as s}from"c5c40cc0-BJsikUZQ.js";import{E as c,T as l,_ as u,b as d,f,g as p,h as m,i as h,m as g,n as _,r as v,w as y}from"c5c40cc0-DAbztGoo.js";import{i as b}from"c5c40cc0-lSSsv1qL.js";var x=.02,S=18,C=1e-6,w=1e-4;function T(e){let t=e=>String(Math.round(e/w));return`${t(e.x)},${t(e.y)},${t(e.z)}`}function E(e){let t=new Map;e.forEach((e,n)=>{for(let r=0;r<3;r+=1){let i=T(e.vertices[r]??e.centroid),a=T(e.vertices[(r+1)%3]??e.centroid),o=i<a?`${i}|${a}`:`${a}|${i}`,s=t.get(o);s===void 0?t.set(o,[n]):s.push(n)}});let n=e.map(()=>[]);for(let e of t.values())for(let t of e)for(let r of e)t!==r&&!n[t]?.includes(r)&&n[t]?.push(r);return n}var D=class{#e=0;#t=new a;#n=new a;add(e){this.#e+=e.area,this.#t.addScaledVector(e.normal,e.area),this.#n.addScaledVector(e.centroid,e.area)}get area(){return this.#e}get axis(){return this.#t.clone().normalize()}get origin(){return this.#n.clone().divideScalar(this.#e||1)}deviation(e,t){let n=this.axis,r=this.origin,i=0,a=e=>{for(let t of e.vertices){let e=Math.abs(t.clone().sub(r).dot(n));e>i&&(i=e)}};for(let t of e)a(t);return t!==null&&a(t),i}};function O(e,t={}){let n=t.flatness??x,r=Math.cos((t.seedAngle??S)*Math.PI/180),i=t.minSeedArea??C,a=E(e),o=e.map((e,t)=>({area:e.area,index:t})).sort((e,t)=>t.area-e.area).map(e=>e.index),s=new Set,c=[];for(let t of o){if(s.has(t))continue;let o=e[t];if(o===void 0||o.area<i&&c.length>0)continue;let l=[o],u=new D;u.add(o),s.add(t);let d=o.normal.clone(),f=[...a[t]??[]];for(;f.length>0;){let t=f.shift();if(t===void 0||s.has(t))continue;let i=e[t];if(i!==void 0&&i.exterior===o.exterior&&!(i.normal.dot(d)<r)&&!(u.deviation(l,i)>n)){s.add(t),l.push(i),u.add(i);for(let e of a[t]??[])s.has(e)||f.push(e)}}let p=u.axis,m=0;for(let e of l){let t=Math.acos(Math.min(1,Math.max(-1,e.normal.dot(p))))*180/Math.PI;t>m&&(m=t)}c.push({area:u.area,axis:p,faces:l,flatness:u.deviation(l,null),origin:u.origin,tilt:m})}return e.forEach((e,t)=>{if(s.has(t))return;let n=new D;n.add(e),c.push({area:e.area,axis:n.axis,faces:[e],flatness:0,origin:n.origin,tilt:0})}),k(c,e,a,n,r).sort((e,t)=>t.area-e.area)}var ee=.04*.04*.5;function k(e,t,n,r,i){let a=new Map;e.forEach((e,t)=>{for(let n of e.faces)a.set(n,t)});let o=e.map(e=>[...e.faces]),s=e.map(()=>!0),c=!0;for(;c;){c=!1;for(let l=0;l<o.length;l+=1){if(!s[l])continue;let u=o[l];if(u===void 0||u.length===0||u.reduce((e,t)=>e+t.area,0)>ee||u.length>4)continue;let d=-1,f=1/0;for(let c of u)for(let p of n[c.triangle]??[]){let n=t[p];if(n===void 0)continue;let m=a.get(n);if(m===void 0||m===l||!s[m]||n.exterior!==c.exterior)continue;let h=e[m];if(h===void 0||c.normal.dot(h.axis)<i)continue;let g=new D;for(let e of o[m]??[])g.add(e);for(let e of u)g.add(e);let _=g.deviation([...o[m]??[],...u],null);_>r*1.5||_<f&&(f=_,d=m)}if(d<0)continue;let p=o[d];if(p!==void 0){for(let e of u)p.push(e),a.set(e,d);o[l]=[],s[l]=!1,c=!0}}}let l=[];return o.forEach((e,t)=>{if(!s[t]||e.length===0)return;let n=new D;for(let t of e)n.add(t);let r=n.axis,i=0;for(let t of e){let e=Math.acos(Math.min(1,Math.max(-1,t.normal.dot(r))))*180/Math.PI;e>i&&(i=e)}l.push({area:n.area,axis:r,faces:e,flatness:n.deviation(e,null),origin:n.origin,tilt:i})}),l}var A=`latticeRight`,j=`latticeDown`,M=`latticeAxis`,N=`latticePixel`,P=`latticeOriginU`,F=`latticeOriginV`,I=`latticePackX`,L=`latticePackY`,R=`latticeCols`,z=`latticeRows`;function B(){return{x:0,y:0,rowHeight:0}}function V(e,t,n,i,o,s=new a,c=B()){let l=G(O(W(e,i,s)),c),u=e.getAttribute(`position`),d=new Float32Array(u.count*3),f=new Float32Array(u.count*3),p=new Float32Array(u.count*3),m=new Float32Array(u.count),h=new Float32Array(u.count),_=new Float32Array(u.count),v=new Float32Array(u.count),y=new Float32Array(u.count),b=new Float32Array(u.count),x=new Float32Array(u.count);for(let e of l){let r=e.faces[0],a=r===void 0?0:r.centroid.dot(e.frame.w),o=r!==void 0&&i[r.triangle]===1;for(let r=0;r<e.cols;r+=1)for(let i=0;i<e.rows;i+=1){let s={frame:0,i:e.packX+r,j:e.packY+i,k:0},c=g(s);if(n.has(c))continue;let l=e.frame.u.clone().multiplyScalar(e.originU+(r+.5)*e.pixel).addScaledVector(e.frame.v,e.originV+(i+.5)*e.pixel).addScaledVector(e.frame.w,a);n.set(c,Object.freeze({cell:s,inside:o,key:c,normal:e.frame.w.clone(),part:t,point:l}))}for(let t of e.faces)K(d,f,p,m,h,_,v,y,b,x,t.triangle,e)}e.setAttribute(A,new r(d,3)),e.setAttribute(j,new r(f,3)),e.setAttribute(M,new r(p,3)),e.setAttribute(N,new r(m,1)),e.setAttribute(P,new r(h,1)),e.setAttribute(F,new r(_,1)),e.setAttribute(I,new r(v,1)),e.setAttribute(L,new r(y,1)),e.setAttribute(R,new r(b,1)),e.setAttribute(z,new r(x,1)),e.computeBoundingBox(),e.computeBoundingSphere()}function H(e,t){return e.getAttribute(t)}function U(e,t,n,r){let i=t=>H(e,t),o=i(A),s=i(j),c=i(M),l=i(N),u=i(P),d=i(F),f=i(I),p=i(L),m=i(R),h=i(z),v=l?.getX(t)??.04;if(o!==void 0&&s!==void 0&&c!==void 0&&u!==void 0&&d!==void 0&&f!==void 0&&p!==void 0&&m!==void 0&&h!==void 0&&v>1e-6){let e={frame:0,u:new a(o.getX(t),o.getY(t),o.getZ(t)),v:new a(s.getX(t),s.getY(t),s.getZ(t)),w:new a(c.getX(t),c.getY(t),c.getZ(t))},r=Math.max(0,m.getX(t)-1),i=Math.max(0,h.getX(t)-1),l=Math.min(r,Math.max(0,Math.floor((n.dot(e.u)-u.getX(t))/v))),_=Math.min(i,Math.max(0,Math.floor((n.dot(e.v)-d.getX(t))/v))),y={frame:0,i:f.getX(t)+l,j:p.getX(t)+_,k:0};return{cell:y,key:g(y),normal:e.w,pixel:v}}let y={frame:0,i:0,j:0,k:0};return{cell:y,key:g(y),normal:r,pixel:_}}function W(e,t,n){let r=e.getAttribute(`position`),i=Math.floor(r.count/3),o=[];for(let e=0;e<i;e+=1){let i=[0,1,2].map(t=>{let i=e*3+t;return new a(r.getX(i),r.getY(i),r.getZ(i)).add(n)}),[s,c,l]=i,u=new a().subVectors(c,s).cross(new a().subVectors(l,s)),d=u.length();if(d===0)continue;let f=u.clone().divideScalar(d),p=new a().add(s).add(c).add(l).divideScalar(3);o.push({area:d/2,centroid:p,exterior:t[e]!==1,nodeName:`body`,normal:f,role:`paint`,triangle:e,vertices:i})}return o}function G(e,t){let n=e.map(e=>{let t=y(e.axis),n=1/0,r=-1/0,i=1/0,a=-1/0,o=0,s=0,u=0;for(let c of e.faces)for(let e of c.vertices){let c=e.dot(t.u),l=e.dot(t.v),d=e.dot(t.w);c<n&&(n=c),c>r&&(r=c),l<i&&(i=l),l>a&&(a=l),o=Math.max(o,Math.abs(c)),s=Math.max(s,Math.abs(l)),u=Math.max(u,Math.abs(d))}let d=Math.max(0,r-n),f=Math.max(0,a-i),p=l(d,f,o,s,u,_);return{faces:e.faces,frame:t,pixel:p,originU:c(n,p),originV:c(i,p),cols:Math.max(1,Math.floor(d/p)+1),rows:Math.max(1,Math.floor(f/p)+1)}}).sort((e,t)=>t.rows-e.rows),r=[];for(let e of n){if(t.x+e.cols+1>2048&&(t.x=0,t.y+=t.rowHeight+1,t.rowHeight=0),t.y+e.rows+1>1500)throw Error(`Vehicle livery atlas cannot hold every patch`);r.push({...e,packX:t.x,packY:t.y}),t.x+=e.cols+1,t.rowHeight=Math.max(t.rowHeight,e.rows)}return r}function K(e,t,n,r,i,a,o,s,c,l,u,d){for(let f=0;f<3;f+=1){let p=u*3+f;e[p*3]=d.frame.u.x,e[p*3+1]=d.frame.u.y,e[p*3+2]=d.frame.u.z,t[p*3]=d.frame.v.x,t[p*3+1]=d.frame.v.y,t[p*3+2]=d.frame.v.z,n[p*3]=d.frame.w.x,n[p*3+1]=d.frame.w.y,n[p*3+2]=d.frame.w.z,r[p]=d.pixel,i[p]=d.originU,a[p]=d.originV,o[p]=d.packX,s[p]=d.packY,c[p]=d.cols,l[p]=d.rows}}var q=`
  attribute vec3 latticeRight;
  attribute vec3 latticeDown;
  attribute vec3 latticeAxis;
  attribute float latticePixel;
  attribute float latticeOriginU;
  attribute float latticeOriginV;
  attribute float latticePackX;
  attribute float latticePackY;
  attribute float latticeCols;
  attribute float latticeRows;
  varying vec3 vCar;
  varying vec3 vRight;
  varying vec3 vDown;
  varying vec3 vLitNormal;
  varying float vPixel;
  varying float vOriginU;
  varying float vOriginV;
  varying float vPackX;
  varying float vPackY;
  varying float vCols;
  varying float vRows;
  uniform vec3 vehicleOffset;
  void main() {
    vCar = position + vehicleOffset;
    vRight = latticeRight;
    vDown = latticeDown;
    vPixel = latticePixel;
    vOriginU = latticeOriginU;
    vOriginV = latticeOriginV;
    vPackX = latticePackX;
    vPackY = latticePackY;
    vCols = latticeCols;
    vRows = latticeRows;
    vLitNormal = normalize(normalMatrix * normal);
    // Associativity matters here, and it is not a style choice. A ghost draws
    // twice: a hidden depth pass in a THREE built-in material, then the visible
    // surface with depthFunc EQUAL. Equal depth means BIT-identical depth, and
    // THREE's project_vertex computes it as projection * (modelView * position).
    // Written left-to-right, GLSL folds this to (projection * modelView) *
    // position — the same maths, a different rounding, an ULP of disagreement,
    // and scattered fragments failing the equality test. That is what made
    // custom-body ghosts flicker while the stock car was clean.
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,J=`
  varying vec3 vCar;
  varying vec3 vRight;
  varying vec3 vDown;
  varying vec3 vLitNormal;
  varying float vPixel;
  varying float vOriginU;
  varying float vOriginV;
  varying float vPackX;
  varying float vPackY;
  varying float vCols;
  varying float vRows;
  uniform sampler2D paintMap;
  uniform sampler2D presetMap;
  uniform float pixel;
  uniform float uGridAll;
  uniform vec3 uGridColor;
  // A ghost is faded by the view that owns it, and faded again while it overlaps
  // the player's car. A ShaderMaterial gets none of that for free.
  uniform float opacity;

  void main() {
    float cell = vPixel > 1e-6 ? vPixel : pixel;
    float u = (dot(vCar, vRight) - vOriginU) / cell;
    float v = (dot(vCar, vDown) - vOriginV) / cell;
    float iu = floor(u);
    float jv = floor(v);
    iu = clamp(iu, 0.0, max(vCols - 1.0, 0.0));
    jv = clamp(jv, 0.0, max(vRows - 1.0, 0.0));
    vec2 texel = vec2(vPackX + iu, vPackY + jv);
    vec2 uv = (texel + 0.5) / vec2(2048.0, 1500.0);
    vec4 hand = texture2D(paintMap, uv);
    vec4 preset = texture2D(presetMap, uv);
    vec3 paint = hand.a > 0.5 ? hand.rgb : (preset.a > 0.5 ? preset.rgb : vec3(1.0));

    vec3 light = normalize(vec3(0.45, 0.8, 0.4));
    float lambert = 0.45 + 0.55 * max(dot(normalize(vLitNormal), light), 0.0);
    vec3 shaded = paint * lambert;
    gl_FragColor = vec4(shaded, opacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    if (uGridAll > 0.0) {
      vec2 liveryTexel = vec2(vPackX + u, vPackY + v);
      vec2 liveryStep = max(fwidth(liveryTexel), vec2(1e-5));
      vec2 liveryGrid = abs(fract(liveryTexel - 0.5) - 0.5) / liveryStep;
      float liveryLine = 1.0 - clamp(min(liveryGrid.x, liveryGrid.y), 0.0, 1.0);
      float liveryDensity = clamp(0.30 / max(liveryStep.x, liveryStep.y), 0.0, 1.0);
      float liveryAlpha = liveryLine * 0.26 * liveryDensity;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, uGridColor, liveryAlpha * uGridAll);
    }
  }
`,Y=new a(16/255,34/255,42/255);function X(t){let r=new i(t,h,v,n,o);return r.magFilter=e,r.minFilter=e,r.generateMipmaps=!1,r.colorSpace=s,r.needsUpdate=!0,r}var Z=class{pixels=new Uint8Array(h*v*4);texture=X(this.pixels);write(e){this.pixels.fill(0);for(let[t,n]of Object.entries(e.pixels)){let e=f(t);if(e===null)continue;let r=d(e);r!==null&&this.#e(r,n)}this.texture.needsUpdate=!0}#e(e,t){let[n,r,i]=m(t);this.pixels[e]=n,this.pixels[e+1]=r,this.pixels[e+2]=i,this.pixels[e+3]=255}dispose(){this.texture.dispose()}},Q=class{pixels=new Uint8Array(h*v*4);texture=X(this.pixels);write(e,t,n=`factory`){this.pixels.fill(0);for(let r of t.values()){let t=d(r.cell);if(t===null)continue;let[i,a,o]=m(n===`blank`?p(e,`blank`,r.point,r.normal,r.part,r.inside):u(e,r.key)??p(e,`factory`,r.point,r.normal,r.part,r.inside));this.pixels[t]=i,this.pixels[t+1]=a,this.pixels[t+2]=o,this.pixels[t+3]=255}this.texture.needsUpdate=!0}dispose(){this.texture.dispose()}};function te(e,n,r=new a,i,o=!1){let s=new t({fragmentShader:J,side:0,uniforms:{paintMap:{value:e.texture},pixel:{value:_},presetMap:{value:n.texture},uGridAll:{value:+!!o},uGridColor:{value:Y.clone()},opacity:{value:1},vehicleOffset:{value:r.clone()}},vertexShader:q});return Object.defineProperty(s,"opacity",{configurable:!0,get:()=>Number(s.uniforms.opacity?.value??1),set:e=>{let t=s.uniforms.opacity;t!==void 0&&(t.value=e)}}),s}var ne=.45,re=Math.cos(10*Math.PI/180),ie=.01,ae=.18,oe=.03,$=.2;function se(e){let t=[],n=1/0,r=-1/0,i=0;for(let o of e){let e=o.geometry.getAttribute(`position`),s=Math.floor(e.count/3);for(let c=0;c<s;c+=1){let s=[0,1,2].map(t=>{let o=c*3+t,s=new a(e.getX(o),e.getY(o),e.getZ(o));return n=Math.min(n,s.y),r=Math.max(r,s.y),i=Math.max(i,Math.abs(s.x)),s});t.push({geometry:o.geometry,nodeName:o.nodeName,triangle:c,vertices:s})}}let o=b(t.map(e=>e.vertices)),s=n+(r-n)*ne,c=t.map((e,t)=>{let[n,r,c]=e.vertices,l=new a().subVectors(r,n).cross(new a().subVectors(c,n)),u=l.length(),d=u===0?new a(0,1,0):l.clone().divideScalar(u),f=new a().add(n).add(r).add(c).divideScalar(3);return{geometry:e.geometry,triangle:e.triangle,face:{area:u/2,centroid:f,exterior:ue(f,d,o)&&!ce(f,d,s)&&!le(f,d,o,i),nodeName:e.nodeName,normal:d,role:`paint`,triangle:t,vertices:e.vertices}}}),l=de(c.map(e=>e.face)),u=new Map;for(let t of e)u.set(t.geometry,new Uint8Array(Math.floor(t.geometry.getAttribute(`position`).count/3)));return c.forEach((e,t)=>{l[t]?.exterior===!1&&u.get(e.geometry)?.fill(1,e.triangle,e.triangle+1)}),u}function ce(e,t,n){return e.y>n&&(t.y<-.5||t.x*e.x<-.25)}function le(e,t,n,r){let i=new a(0,1,0),o=e.clone().addScaledVector(t,oe);if(n.hits(o,i))return!0;if(t.y<.5||Math.abs(e.x)>r-ae)return!1;let s=0;for(let e of[new a($,0,0),new a(-.2,0,0),new a(0,0,$),new a(0,0,-.2)])if(n.hits(o.clone().add(e),i)&&(s+=1),s>=2)return!0;return!1}function ue(e,t,n){return!n.hits(e.clone().addScaledVector(t,.002),t)}function de(e){let t=E(e),n=[...e],r=!0;for(;r;){r=!1;for(let e=0;e<n.length;e+=1){let i=n[e];if(!(i===void 0||i.exterior))for(let a of t[e]??[]){let t=n[a];if(!(t?.exterior!==!0||i.normal.dot(t.normal)<re)&&!(Math.abs(i.centroid.clone().sub(t.centroid).dot(t.normal))>ie)){n[e]={...i,exterior:!0},r=!0;break}}}}return n}export{B as a,te as i,Z as n,V as o,Q as r,U as s,se as t};