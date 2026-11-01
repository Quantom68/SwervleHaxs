import{n as e}from"c5c40cc0-CmKS15sT.js";import{$n as t,Dn as n,G as r,Hn as i,Nt as a,Pt as o,R as s,Rt as c,U as l,Vn as u,Vt as d,W as f,Yn as p,_r as m,_t as h,c as ee,g as te,gr as g,h as _,ht as ne,jt as re,k as ie,l as ae,mt as oe,o as se,p as ce,sr as le,tr as ue,vt as v,xr as de,yt as fe,zn as pe,zt as me}from"c5c40cc0-BJsikUZQ.js";import{n as y,r as he}from"c5c40cc0-D7z-PLih.js";import{r as ge,t as _e}from"c5c40cc0-VK318vwB.js";import{r as ve,v as ye}from"c5c40cc0-tYwZacaO.js";import{r as be}from"c5c40cc0-2E51mLa6.js";import{n as xe,t as Se}from"c5c40cc0-CWwg_aBc.js";import{r as Ce}from"c5c40cc0-Bl0PRET02.js";function b(t){if(!Ee(t))throw TypeError(`Car view definition must be an object.`);if(e(t.contentId,`Car view content ID`),x(t.cameraBindingId,`Car camera binding ID`),x(t.steeringWheelBindingId,`Car steering-wheel binding ID`),Te(t.steeringWheelVisualMultiplier,`Car steering-wheel multiplier`),we(t.wheelBindingIds,`Car wheel binding IDs`,!0),we(t.collisionBindingIds,`Car collision binding IDs`,!0),!Array.isArray(t.doors)||t.doors.length===0)throw RangeError(`Car view definition requires door bindings.`);let n=new Set,r=new Set;for(let[e,i]of t.doors.entries()){if(!Ee(i))throw TypeError(`Car door ${String(e)} must be an object.`);if(x(i.id,`Car door ${String(e)} ID`),x(i.bindingId,`Car door "${i.id}" binding ID`),i.sideMultiplier!==-1&&i.sideMultiplier!==1)throw RangeError(`Car door "${i.id}" side multiplier must be -1 or 1.`);if(n.has(i.id))throw RangeError(`Duplicate car door ID: ${i.id}.`);if(r.has(i.bindingId))throw RangeError(`Duplicate car door binding ID: ${i.bindingId}.`);n.add(i.id),r.add(i.bindingId)}}function we(e,t,n){if(!Array.isArray(e)||n&&e.length===0)throw RangeError(`${t} must be a non-empty array.`);let r=new Set;for(let[n,i]of e.entries()){if(x(i,`${t}[${String(n)}]`),r.has(i))throw RangeError(`${t} must be unique.`);r.add(i)}}function x(e,t){if(typeof e!=`string`||e.length===0)throw TypeError(`${t} must be non-empty.`)}function Te(e,t){if(typeof e!=`number`||!Number.isFinite(e))throw TypeError(`${t} must be finite.`)}function Ee(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var De=class{contentId;entityId;root=new l;#e;#t;#n;#r=new Map;#i;#a=new Map;#o=new d;#s=new d;#c=new d;#l=new m;#u=new m;#d=new m;#f=new m;#p=new m;#m=new d;#h=new d;#g=new d;#_=null;#v;#y=!1;#b;constructor(e){b(e.definition),this.contentId=e.definition.contentId,this.entityId=e.entityId,this.#e=e.assetInstance,this.#t=e.assetInstance.scene,this.#n=e.definition,this.root.name=`car-view:${e.entityId}`;try{if(e.assetInstance.contentId!==e.definition.contentId)throw RangeError(`CarView requires a car AssetInstance.`);if(e.assetInstance.disposed)throw Error(`CarView cannot own an already-disposed AssetInstance.`);this.#v=Oe(e.assetInstance,e.appearance),this.#i=S(e.assetInstance,e.definition.steeringWheelBindingId,`steering-wheel`),this.root.add(this.#t),this.#t.updateWorldMatrix(!0,!0);for(let t of e.definition.wheelBindingIds){let n=S(e.assetInstance,t,`wheel`);if([...this.#a.values()].includes(n))throw Error(`Car wheel binding "${t}" aliases another wheel node.`);this.root.attach(n),this.#a.set(t,n)}for(let t of e.definition.collisionBindingIds)S(e.assetInstance,t,`collision`).visible=!1;for(let t of e.definition.doors)this.#r.set(t.id,S(e.assetInstance,t.bindingId,`door`));S(e.assetInstance,e.definition.cameraBindingId,`camera`),this.#b=_e(this.root,{...e.materialRegistrar===void 0?{}:{materialRegistrar:e.materialRegistrar}}),Pe(this.#b.finalMaterials,e.materialColorOverrides)}catch(t){throw this.#v?.dispose(),this.#v=void 0,this.#b?.dispose(),this.root.removeFromParent(),this.root.clear(),e.assetInstance.dispose(),t}}get disposed(){return this.#y}copyInterpolatedChassisQuaternion(e){return this.#S(),e.copy(this.#c)}consumeSnapshot(e){this.#S(),Fe(e,this.entityId,this.#n),this.#_=e}update(e){if(this.#S(),!Number.isFinite(e)||e<0||e>1)throw RangeError(`CarView interpolation alpha must be between 0 and 1.`);let t=this.#_;if(t===null)throw Error(`CarView has no snapshot to render.`);let n=t.vehicle.chassis;this.#l.set(T(n.previousPosition.x,n.position.x,e),T(n.previousPosition.y,n.position.y,e),T(n.previousPosition.z,n.position.z,e)),ze(this.#o,n.previousQuaternion),ze(this.#s,n.quaternion),this.#c.copy(this.#o).slerp(this.#s,e).normalize(),this.#t.position.copy(this.#l),this.#t.quaternion.copy(this.#c),this.#i.rotation.z=t.steeringSimulator.position*this.#n.steeringWheelVisualMultiplier;let r=We(t.vehicle);for(let[t,n]of this.#n.doors.entries()){let i=r[t],a=this.#r.get(n.id);if(i===void 0||a===void 0)throw RangeError(`Car door binding "${n.id}" is unavailable.`);a.rotation.y=n.sideMultiplier*T(i.previousRotation,i.rotation,e)}for(let n of t.vehicle.wheels)this.#x(n,t,e)}dispose(){this.#y||(this.#y=!0,this.#_=null,this.root.removeFromParent(),this.#v?.dispose(),this.#v=void 0,this.#b?.dispose(),this.#b=void 0,this.#e.dispose(),this.root.clear(),this.#r.clear(),this.#a.clear())}#x(e,t,n){let r=this.#a.get(e.id),i=t.vehicle.raycastVehicle.wheels[e.raycastWheelIndex];if(r===void 0||i===void 0)throw RangeError(`Car wheel binding "${e.id}" is unavailable.`);let a=i.configuration;this.#u.set(a.chassisConnectionPointLocal.x,a.chassisConnectionPointLocal.y,a.chassisConnectionPointLocal.z).applyQuaternion(this.#c).add(this.#l),this.#d.set(a.directionLocal.x,a.directionLocal.y,a.directionLocal.z).applyQuaternion(this.#c).multiplyScalar(T(i.previousSuspensionLength,i.currentSuspensionLength,n)),this.#u.add(this.#d),this.#f.set(-a.directionLocal.x,-a.directionLocal.y,-a.directionLocal.z).normalize(),this.#p.set(a.axleLocal.x,a.axleLocal.y,a.axleLocal.z).normalize(),this.#m.setFromAxisAngle(this.#f,i.steering),this.#h.setFromAxisAngle(this.#p,T(i.previousRotation,i.currentRotation,n)),this.#g.copy(this.#c).multiply(this.#m).multiply(this.#h).normalize(),r.position.copy(this.#u),r.quaternion.copy(this.#g)}#S(){if(this.#y)throw Error(`CarView "${this.entityId}" has been disposed.`)}};function Oe(e,t){if(t===void 0)return;if(t.geometries.length===0)throw RangeError(`CarView appearance requires at least one geometry color binding.`);let n=[],r=new Set;try{for(let i of t.geometries){if(typeof i.bindingId!=`string`||i.bindingId.length===0)throw TypeError(`CarView appearance binding IDs must be non-empty.`);if(r.has(i.bindingId))throw RangeError(`CarView appearance binding "${i.bindingId}" is duplicated.`);r.add(i.bindingId),Ne(i.defaultColor,`CarView appearance "${i.bindingId}" default color`);let t=S(e,i.bindingId,`appearance`);if(!Me(t))throw TypeError(`CarView appearance binding "${i.bindingId}" must be a mesh.`);let a=t.geometry,o=a.index===null?a.clone():a.toNonIndexed();n.push({materials:je(t,i.bindingId),mesh:t,originalGeometry:a,replacementGeometry:o}),ke(o,i)}}catch(e){for(let e of n)e.replacementGeometry.dispose();throw e}let i=new Map;for(let e of n){e.mesh.geometry=e.replacementGeometry;for(let t of e.materials)i.has(t)||i.set(t,t.vertexColors),t.vertexColors=!0,t.needsUpdate=!0}let a=!1;return Object.freeze({dispose:()=>{if(!a){a=!0;for(let e=n.length-1;e>=0;--e){let t=n[e];t!==void 0&&(t.mesh.geometry=t.originalGeometry,t.replacementGeometry.dispose())}for(let[e,t]of i)e.vertexColors=t,e.needsUpdate=!0}}})}function ke(e,t){if(!e.hasAttribute(`position`))throw RangeError(`CarView appearance binding "${t.bindingId}" has no positions.`);let n=e.getAttribute(`position`);if(n.itemSize!==3||n.count%3!=0)throw RangeError(`CarView appearance binding "${t.bindingId}" is not triangular.`);let r=n.count/3;if(t.expectedFaceCount!==void 0&&(!Number.isSafeInteger(t.expectedFaceCount)||t.expectedFaceCount<1||t.expectedFaceCount!==r))throw RangeError(`CarView appearance binding "${t.bindingId}" expected ${String(t.expectedFaceCount)} faces, received ${String(r)}.`);let i=t.faceRanges??[],a=0;for(let e of i){if(Ne(e.color,`CarView appearance "${t.bindingId}" face color`),!Number.isSafeInteger(e.startFace)||!Number.isSafeInteger(e.endFace)||e.startFace<a||e.startFace<0||e.endFace<=e.startFace||e.endFace>r)throw RangeError(`CarView appearance binding "${t.bindingId}" has an invalid face range.`);a=e.endFace}let o=new s(new Float32Array(n.count*3),3);Ae(o,0,r,t.defaultColor);for(let e of i)Ae(o,e.startFace,e.endFace,e.color);e.setAttribute(`color`,o)}function Ae(e,t,n,r){let i=new _().setRGB((r>>16&255)/255,(r>>8&255)/255,(r&255)/255);for(let r=t;r<n;r+=1){let t=r*3;for(let n=0;n<3;n+=1)e.setXYZ(t+n,i.r,i.g,i.b)}}function je(e,t){return(Array.isArray(e.material)?e.material:[e.material]).map(e=>{if(!(`vertexColors`in e)||typeof e.vertexColors!=`boolean`)throw TypeError(`CarView appearance binding "${t}" uses a material without vertex colors.`);return e})}function Me(e){return e instanceof v}function Ne(e,t){if(!Number.isSafeInteger(e)||e<0||e>16777215)throw RangeError(`${t} must be a 24-bit RGB integer.`)}function Pe(e,t){if(t===void 0)return;let n=Object.entries(t);for(let[e,t]of n){if(e.length===0)throw TypeError(`CarView material color names must be non-empty.`);if(!Number.isSafeInteger(t)||t<0||t>16777215)throw RangeError(`CarView material color "${e}" must be a 24-bit RGB integer.`)}let r=new Set,i=[];for(let n of e){let e=t[n.name];if(e!==void 0){if(!(`color`in n)||!(n.color instanceof _))throw TypeError(`CarView material "${n.name}" does not support a color override.`);r.add(n.name),i.push({color:n.color,value:e})}}for(let[e]of n)if(!r.has(e))throw RangeError(`CarView material color target "${e}" was not found.`);for(let e of i)e.color.setHex(e.value)}function Fe(e,t,n){if(b(n),!w(e)||e.version!==3||e.kind!==`car`){let t=w(e)?e.version:void 0;throw RangeError(`Unsupported CarView snapshot version: ${String(t)}.`)}if(e.entityId!==t)throw RangeError(`CarView snapshot entity does not match "${t}".`);if(typeof e.controlActive!=`boolean`||typeof e.canTiltForwards!=`boolean`)throw TypeError(`CarView snapshot boolean state is invalid.`);C(e.speed,`CarView snapshot speed`),He(e.shiftTimer,`CarView snapshot shift timer`),He(e.airSpinTimer,`CarView snapshot air-spin timer`),be(e.gear),Be(e.heldControls),Ve(e.steeringSimulator),Ie(e.vehicle,t,e.controlActive,n)}function Ie(e,t,n,r){if(!w(e)||e.version!==2||e.kind!==`vehicle`)throw RangeError(`CarView vehicle snapshot version is unsupported.`);if(e.entityId!==t)throw RangeError(`CarView vehicle snapshot entity does not match.`);if(e.drive!==`awd`&&e.drive!==`fwd`&&e.drive!==`rwd`)throw RangeError(`CarView vehicle snapshot drive layout is invalid.`);if(e.controlActive!==n)throw RangeError(`CarView car and vehicle control state do not match.`);if(ye(e.chassis,`CarView chassis snapshot`),e.chassis.entityId!==t)throw RangeError(`CarView chassis snapshot entity does not match.`);if(ve(e.raycastVehicle),e.raycastVehicle.chassisEntityId!==t)throw RangeError(`CarView raycast snapshot entity does not match.`);if(!Array.isArray(e.wheels)||e.wheels.length!==r.wheelBindingIds.length||e.raycastVehicle.wheels.length!==r.wheelBindingIds.length)throw RangeError(`CarView wheel snapshots do not match its definition.`);Le(e.doors,r);let i=new Set,a=new Set;for(let t of e.wheels){if(Re(t),!r.wheelBindingIds.includes(t.id))throw RangeError(`CarView wheel ID "${t.id}" is not authored by the car asset.`);if(i.has(t.id)||a.has(t.raycastWheelIndex)||t.raycastWheelIndex>=e.raycastVehicle.wheels.length)throw RangeError(`CarView wheel bindings must have unique valid IDs and indices.`);i.add(t.id),a.add(t.raycastWheelIndex)}}function Le(e,t){if(!Array.isArray(e)||e.length!==t.doors.length)throw RangeError(`CarView door snapshots do not match its definition.`);for(let[n,r]of e.entries()){let e=t.doors[n];if(e===void 0||!w(r)||r.version!==1||r.id!==e.id)throw RangeError(`CarView door snapshot ${String(n)} does not match its authored ID and order.`);for(let t of[`rotation`,`previousRotation`,`velocity`,`targetRotation`])C(r[t],`CarView door "${e.id}" ${t}`);for(let t of[`achievingTargetRotation`,`physicsEnabled`])if(typeof r[t]!=`boolean`)throw TypeError(`CarView door "${e.id}" ${t} must be boolean.`);for(let t of[`lastVehicleVelocity`,`doorWorldPosition`,`lastTrailerPosition`,`lastTrailerVelocity`,`lastVehiclePosition`])Ue(r[t],`CarView door "${e.id}" ${t}`)}}function Re(e){if(!w(e)||e.version!==1)throw RangeError(`CarView wheel binding version is unsupported.`);if(typeof e.id!=`string`||e.id.length===0)throw TypeError(`CarView wheel binding ID must be non-empty.`);if(!w(e.position))throw TypeError(`CarView wheel binding position must be an object.`);for(let t of[`x`,`y`,`z`])C(e.position[t],`CarView wheel binding position.${t}`);if(typeof e.steering!=`boolean`||e.drive!==`fwd`&&e.drive!==`rwd`)throw TypeError(`CarView wheel binding steering/drive metadata is invalid.`);if(typeof e.raycastWheelIndex!=`number`||!Number.isSafeInteger(e.raycastWheelIndex)||e.raycastWheelIndex<0)throw TypeError(`CarView wheel binding index must be a non-negative safe integer.`)}function S(e,t,n){let r=e.nodeBindings.get(t);if(r===void 0)throw Error(`Car asset is missing ${n} node binding "${t}".`);return r}function ze(e,t){e.set(t.x,t.y,t.z,t.w).normalize()}function Be(e){if(!w(e))throw TypeError(`CarView held controls must be an object.`);for(let t of[`brake`,`left`,`reverse`,`right`,`throttle`])if(typeof e[t]!=`boolean`)throw TypeError(`CarView held control "${t}" must be boolean.`)}function Ve(e){if(!w(e)||e.version!==1||e.kind!==`scalar`)throw RangeError(`CarView steering snapshot version is unsupported.`);for(let t of[`mass`,`damping`,`frameTime`,`offset`,`position`,`velocity`,`target`])C(e[t],`CarView steering snapshot ${t}`);if(!Array.isArray(e.cache)||e.cache.length!==2)throw RangeError(`CarView steering snapshot requires two cache frames.`);for(let t of e.cache){if(!w(t))throw TypeError(`CarView steering cache frame is invalid.`);C(t.position,`CarView steering cache position`),C(t.velocity,`CarView steering cache velocity`)}}function C(e,t){if(typeof e!=`number`||!Number.isFinite(e))throw TypeError(`${t} must be finite.`)}function He(e,t){if(C(e,t),e<0)throw RangeError(`${t} must be non-negative.`)}function Ue(e,t){if(!w(e))throw TypeError(`${t} must be an object.`);for(let n of[`x`,`y`,`z`])C(e[n],`${t}.${n}`)}function w(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function T(e,t,n){return e+(t-e)*n}function We(e){if(!w(e)||!Array.isArray(e.doors))throw TypeError(`CarView vehicle door snapshots are unavailable.`);return e.doors}var E=class extends Error{code;contentId;url;httpStatus;expectedBytes;actualBytes;expectedSha256;actualSha256;constructor(e){super(e.message,e.cause===void 0?void 0:{cause:e.cause}),this.name=`AssetLoadError`,this.code=e.code,this.contentId=e.contentId,this.url=e.url,this.httpStatus=e.httpStatus,this.expectedBytes=e.expectedBytes,this.actualBytes=e.actualBytes,this.expectedSha256=e.expectedSha256,this.actualSha256=e.actualSha256}},Ge=1e-5,D=class extends Error{violations;constructor(e){let t=Object.freeze([...e]);super(`GLTF contract failed: ${t.join(` `)}`),this.name=`GltfContractError`,this.violations=t}};function Ke(e){let t=e.nodeBindings??[],n=e.animationBindings??[],r=e.animationClips??[],i=[];O(t,`node binding ID`,e=>e.id,i),O(t,`node name`,e=>e.nodeName,i),O(n,`animation binding ID`,e=>e.id,i),O(n,`clip name`,e=>e.clipName,i),O(r,`animation duration ID`,e=>e.id,i);for(let e of r)(!Number.isFinite(e.durationSeconds)||e.durationSeconds<0)&&i.push(`Animation duration "${e.id}" must be a finite, non-negative number.`);let a=new Set(r.map(e=>e.id)),o=new Set(n.map(e=>e.id));for(let e of n)a.has(e.id)||i.push(`Animation binding "${e.id}" has no matching duration contract.`);for(let e of r)o.has(e.id)||i.push(`Animation duration "${e.id}" has no matching clip binding.`);if(i.length>0)throw new D(i);return Object.freeze({nodeBindings:Object.freeze(t.map(e=>Object.freeze({...e}))),animationBindings:Object.freeze(n.map(e=>Object.freeze({...e}))),animationClips:Object.freeze(r.map(e=>Object.freeze({...e})))})}function qe(e,t,n=Ge){if(!Number.isFinite(n)||n<0)throw RangeError(`GLTF duration tolerance must be finite and non-negative.`);let r=Ke(t),i=[],a=Je(e.scene),o=new Map;for(let e of r.nodeBindings){let t=a.get(e.nodeName)??[];if(t.length!==1){i.push(`Node binding "${e.id}" expected exactly one node named "${e.nodeName}", found ${String(t.length)}.`);continue}let n=t[0];n!==void 0&&o.set(e.id,n)}let s=new Map;for(let t of e.animations){if(t.name.length===0){i.push(`Every GLTF animation clip must have a non-empty name.`);continue}let e=s.get(t.name)??[];e.push(t),s.set(t.name,e)}for(let[e,t]of s)t.length>1&&i.push(`Animation clip name "${e}" is not unique; found ${String(t.length)} clips.`);let c=new Map(r.animationClips.map(e=>[e.id,e.durationSeconds])),l=new Map;for(let e of r.animationBindings){let t=s.get(e.clipName)??[];if(t.length!==1){i.push(`Animation binding "${e.id}" expected exactly one clip named "${e.clipName}", found ${String(t.length)}.`);continue}let r=t[0],a=c.get(e.id);if(!(r===void 0||a===void 0)){if(!Number.isFinite(r.duration)||r.duration<0){i.push(`Animation clip "${e.clipName}" has invalid duration ${String(r.duration)}.`);continue}if(Math.abs(r.duration-a)>n){i.push(`Animation clip "${e.clipName}" duration ${String(r.duration)}s does not match expected ${String(a)}s (tolerance ${String(n)}s).`);continue}l.set(e.id,r)}}if(i.length>0)throw new D(i);return Object.freeze({nodes:o,animations:l})}function Je(e){let t=new Map;return e.traverse(e=>{let n=t.get(e.name)??[];n.push(e),t.set(e.name,n)}),t}function O(e,t,n,r){let i=new Set;for(let a of e){let e=n(a);if(e.trim().length===0){r.push(`Every ${t} must be a non-empty string.`);continue}if(i.has(e)){r.push(`Duplicate ${t} "${e}".`);continue}i.add(e)}}var Ye=/^[a-f0-9]{64}$/iu;function Xe(t){let n=new Set,r=[];for(let i of t){if(e(i.contentId,`Asset contentId`),n.has(i.contentId))throw Error(`Asset contentId "${i.contentId}" is defined more than once.`);if(n.add(i.contentId),i.url.trim().length===0)throw TypeError(`Asset "${i.contentId}" URL must not be empty.`);if(!Number.isSafeInteger(i.bytes)||i.bytes<0)throw RangeError(`Asset "${i.contentId}" bytes must be a non-negative safe integer.`);if(!Ye.test(i.sha256))throw TypeError(`Asset "${i.contentId}" sha256 must contain exactly 64 hexadecimal characters.`);r.push(Object.freeze({contentId:i.contentId,url:i.url,bytes:i.bytes,sha256:i.sha256.toUpperCase(),gltfContract:Ke(i.gltfContract)}))}return Object.freeze(r)}var Ze=class{#e=new Map;#t;#n;#r=new Map;#i=new Map;#a=new Set;#o=!1;constructor(e){for(let t of Xe(e.manifest))this.#e.set(t.contentId,t);this.#t=e.fetch??$e,this.#n=e.parser??et}get disposed(){return this.#o}get cachedAssetCount(){return this.#r.size}get pendingAssetCount(){return this.#i.size}async preload(e){await this.#s(e)}load(e){return this.preload(e)}async instantiate(e){let t=await this.#s(e);if(this.#o)throw this.#u(e,t.definition.url);let n=xe(t.gltf.scene),r=rt(n);try{let i=qe({scene:n,animations:t.gltf.animations},t.definition.gltfContract),a=new Qe({contentId:e,scene:n,animations:Object.freeze([...t.gltf.animations]),nodeBindings:i.nodes,animationBindings:i.animations,ownedMaterials:r,onDispose:e=>{this.#a.delete(e)}});return this.#a.add(a),a}catch(i){throw n.removeFromParent(),ut(r),i instanceof D?new E({code:`contract`,contentId:e,url:t.definition.url,message:`Cloned asset "${e}" no longer satisfies its GLTF contract: ${i.message}`,cause:i}):i}}dispose(){if(this.#o)return;this.#o=!0;for(let e of this.#i.values())e.controller.abort(`AssetManager disposed`);for(let e of[...this.#a])e.dispose();let e=at();for(let t of this.#r.values())ot(t.gltf,e);lt(e),this.#r.clear()}#s(e){let t=this.#e.get(e);if(this.#o)throw this.#u(e,t?.url);if(t===void 0)throw new E({code:`contract`,contentId:e,message:`Asset "${e}" is not present in the asset manifest. Register its typed definition before loading it.`});let n=this.#r.get(e);if(n!==void 0)return Promise.resolve(n);let r=this.#i.get(e);if(r!==void 0)return r.promise;let i=new AbortController,a=this.#c(t,i.signal).then(n=>{if(this.#o||i.signal.aborted)throw ct(n),this.#l(t);let r=Object.freeze({definition:t,gltf:n});return this.#r.set(e,r),r}).finally(()=>{this.#i.get(e)?.promise===a&&this.#i.delete(e)});return this.#i.set(e,{controller:i,promise:a}),a}async#c(e,t){let n;try{n=await this.#t(e.url,{signal:t})}catch(n){throw t.aborted||k(n)?this.#l(e,n):new E({code:`network`,contentId:e.contentId,url:e.url,message:`Could not fetch asset "${e.contentId}" from "${e.url}". Check the URL and network connection.`,cause:n})}if(!n.ok)throw new E({code:`network`,contentId:e.contentId,url:e.url,httpStatus:n.status,message:`Asset "${e.contentId}" request to "${e.url}" failed with HTTP ${String(n.status)}${n.statusText.length>0?` ${n.statusText}`:``}.`});let r;try{r=await n.arrayBuffer()}catch(n){throw t.aborted||k(n)?this.#l(e,n):new E({code:`network`,contentId:e.contentId,url:e.url,message:`Asset "${e.contentId}" responded, but its bytes could not be read from "${e.url}".`,cause:n})}if(A(t))throw this.#l(e);if(r.byteLength!==e.bytes)throw new E({code:`integrity`,contentId:e.contentId,url:e.url,expectedBytes:e.bytes,actualBytes:r.byteLength,message:`Asset "${e.contentId}" byte length mismatch at "${e.url}": expected ${String(e.bytes)}, received ${String(r.byteLength)}. Regenerate the manifest only after reviewing the asset change.`});let i;try{i=await tt(r)}catch(t){throw new E({code:`integrity`,contentId:e.contentId,url:e.url,expectedSha256:e.sha256,message:`Asset "${e.contentId}" could not be SHA-256 verified. Ensure Web Crypto is available in this runtime.`,cause:t})}if(t.aborted)throw this.#l(e);if(i!==e.sha256)throw new E({code:`integrity`,contentId:e.contentId,url:e.url,expectedSha256:e.sha256,actualSha256:i,message:`Asset "${e.contentId}" SHA-256 mismatch at "${e.url}": expected ${e.sha256}, received ${i}. Do not parse or trust this response.`});let a;try{a=await this.#n(r,{contentId:e.contentId,url:e.url,resourcePath:nt(e.url),signal:t})}catch(n){throw A(t)||k(n)?this.#l(e,n):new E({code:`parse`,contentId:e.contentId,url:e.url,message:`Asset "${e.contentId}" passed integrity checks but GLTF parsing failed for "${e.url}". Verify that the source is a supported GLB/GLTF.`,cause:n})}if(A(t)||this.disposed)throw ct(a),this.#l(e);try{qe(a,e.gltfContract)}catch(t){throw ct(a),t instanceof D?new E({code:`contract`,contentId:e.contentId,url:e.url,message:`Asset "${e.contentId}" at "${e.url}" does not satisfy its generated GLTF bindings: ${t.message}`,cause:t}):t}return a}#l(e,t){return new E({code:`aborted`,contentId:e.contentId,url:e.url,message:`Loading asset "${e.contentId}" from "${e.url}" was aborted. Retry with an active AssetManager.`,...t===void 0?{}:{cause:t}})}#u(e,t){return new E({code:`disposed`,contentId:e,...t===void 0?{}:{url:t},message:`AssetManager has been disposed and cannot load or instantiate asset "${e}". Create a new manager for subsequent work.`})}},Qe=class{contentId;scene;animations;nodeBindings;animationBindings;#e;#t;#n=!1;constructor(e){this.contentId=e.contentId,this.scene=e.scene,this.animations=e.animations,this.nodeBindings=e.nodeBindings,this.animationBindings=e.animationBindings,this.#e=e.ownedMaterials,this.#t=e.onDispose}get disposed(){return this.#n}dispose(){this.#n||(this.#n=!0,this.scene.removeFromParent(),ut(this.#e),this.#t(this))}},$e=async(e,t)=>{if(typeof globalThis.fetch!=`function`)throw Error(`Global fetch is unavailable.`);return globalThis.fetch(e,{signal:t.signal})},et=async(e,t)=>new Se().parseAsync(e,t.resourcePath);async function tt(e){let t=await globalThis.crypto.subtle.digest(`SHA-256`,e);return[...new Uint8Array(t)].map(e=>e.toString(16).padStart(2,`0`)).join(``).toUpperCase()}function nt(e){let t=e.split(`#`,1)[0]??e,n=t.split(`?`,1)[0]??t,r=n.lastIndexOf(`/`);return r<0?``:n.slice(0,r+1)}function k(e){return typeof e==`object`&&!!e&&`name`in e&&e.name===`AbortError`}function A(e){return e.aborted}function rt(e){let t=new Map,n=new Set;return e.traverse(e=>{let r=e,i=r.material;if(i instanceof oe){let e=it(i,t);r.material=e,n.add(e)}else if(Array.isArray(i)){let e=i.map(e=>it(e,t));r.material=e;for(let t of e)n.add(t)}}),n}function it(e,t){let n=t.get(e);if(n!==void 0)return n;let r=e.clone();return t.set(e,r),r}function at(){return{geometries:new Set,materials:new Set,textures:new Set}}function ot(e,t){let n=new Set([e.scene,...e.scenes]);for(let e of n)e.traverse(e=>{let n=e;if(n.geometry instanceof ae&&t.geometries.add(n.geometry),n.material instanceof oe)t.materials.add(n.material);else if(Array.isArray(n.material))for(let e of n.material)t.materials.add(e)});for(let e of t.materials)st(e,t.textures)}function st(e,t){let n=new Set;for(let r of Object.values(e))j(r,t,n)}function j(e,n,r){if(e instanceof t){n.add(e);return}if(!(typeof e!=`object`||!e||r.has(e))){if(r.add(e),Array.isArray(e)){for(let t of e)j(t,n,r);return}if(Object.getPrototypeOf(e)===Object.prototype)for(let t of Object.values(e))j(t,n,r)}}function ct(e){let t=at();ot(e,t),lt(t)}function lt(e){for(let t of e.geometries)t.dispose();ut(e.materials);for(let t of e.textures)t.dispose()}function ut(e){for(let t of e)t.dispose()}var dt=new h,ft=class e{constructor(e){e||={},this.zNear=e.webGL===!0?-1:0,this.zFar=1,this.vertices={near:[new m,new m,new m,new m],far:[new m,new m,new m,new m]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4),e.reversedDepth===!0&&(this.zNear=1,this.zFar=0)}setFromProjectionMatrix(e,t){let n=this.zNear,r=this.zFar,i=e.elements[11]===0;return dt.copy(e).invert(),this.vertices.near[0].set(1,1,n),this.vertices.near[1].set(1,-1,n),this.vertices.near[2].set(-1,-1,n),this.vertices.near[3].set(-1,1,n),this.vertices.near.forEach(function(e){e.applyMatrix4(dt)}),this.vertices.far[0].set(1,1,r),this.vertices.far[1].set(1,-1,r),this.vertices.far[2].set(-1,-1,r),this.vertices.far[3].set(-1,1,r),this.vertices.far.forEach(function(e){e.applyMatrix4(dt);let n=Math.abs(e.z);i?e.z*=Math.min(t/n,1):e.multiplyScalar(Math.min(t/n,1))}),this.vertices}split(t,n){for(;t.length>n.length;)n.push(new e);n.length=t.length;let r=this.vertices.near[0].z,i=this.vertices.far[0].z;for(let e=0;e<t.length;e++){let a=n[e];if(e===0)for(let e=0;e<4;e++)a.vertices.near[e].copy(this.vertices.near[e]);else{let n=(t[e-1]*i-r)/(i-r);for(let e=0;e<4;e++)a.vertices.near[e].lerpVectors(this.vertices.near[e],this.vertices.far[e],n)}if(e===t.length-1)for(let e=0;e<4;e++)a.vertices.far[e].copy(this.vertices.far[e]);else{let n=(t[e]*i-r)/(i-r);for(let e=0;e<4;e++)a.vertices.far[e].lerpVectors(this.vertices.near[e],this.vertices.far[e],n)}}}toSpace(e,t){for(let n=0;n<4;n++)t.vertices.near[n].copy(this.vertices.near[n]).applyMatrix4(e),t.vertices.far[n].copy(this.vertices.far[n]).applyMatrix4(e)}},pt={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+y.lights_pars_begin},mt=new h,ht=new ft({webGL:!0}),M=new m,gt=new m,N=new se,P=[],F=[],I=new h,_t=new h,vt=new m(0,1,0),yt=class{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||`practical`,this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new m(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new ft({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this._createLights(),this.updateFrustums(),this._injectInclude()}_createLights(){for(let e=0;e<this.cascades;e++){let e=new ie(16777215,this.lightIntensity);e.castShadow=!0,e.shadow.mapSize.width=this.shadowMapSize,e.shadow.mapSize.height=this.shadowMapSize,e.shadow.camera.near=this.lightNear,e.shadow.camera.far=this.lightFar,e.shadow.bias=this.shadowBias,this.parent.add(e),this.parent.add(e.target),this.lights.push(e)}}_initCascades(){let e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}_updateShadowBounds(){let e=this.frustums;for(let t=0;t<e.length;t++){let e=this.lights[t].shadow.camera,n=this.frustums[t],r=n.vertices.near,i=n.vertices.far,a=i[0],o;o=a.distanceTo(i[2])>a.distanceTo(r[2])?i[2]:r[2];let s=a.distanceTo(o);if(this.fade){let e=this.camera,t=Math.max(e.far,this.maxFar),r=.25*(n.vertices.far[0].z/(t-e.near))**2*(t-e.near);s+=r}e.left=-s/2,e.right=s/2,e.top=s/2,e.bottom=-s/2,e.updateProjectionMatrix()}}_getBreaks(){let e=this.camera,t=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case`uniform`:n(this.cascades,e.near,t,this.breaks);break;case`logarithmic`:r(this.cascades,e.near,t,this.breaks);break;case`practical`:i(this.cascades,e.near,t,.5,this.breaks);break;case`custom`:this.customSplitsCallback===void 0&&console.error(`CSM: Custom split scheme callback not defined.`),this.customSplitsCallback(this.cascades,e.near,t,this.breaks);break}function n(e,t,n,r){for(let i=1;i<e;i++)r.push((t+(n-t)*i/e)/n);r.push(1)}function r(e,t,n,r){for(let i=1;i<e;i++)r.push(t*(n/t)**(i/e)/n);r.push(1)}function i(e,t,i,a,o){P.length=0,F.length=0,r(e,t,i,F),n(e,t,i,P);for(let t=1;t<e;t++)o.push(ne.lerp(P[t-1],F[t-1],a));o.push(1)}}update(){let e=this.camera,t=this.frustums;I.lookAt(gt,this.lightDirection,vt),_t.copy(I).invert();for(let n=0;n<t.length;n++){let r=this.lights[n],i=r.shadow.camera,a=(i.right-i.left)/this.shadowMapSize,o=(i.top-i.bottom)/this.shadowMapSize;mt.multiplyMatrices(_t,e.matrixWorld),t[n].toSpace(mt,ht);let s=ht.vertices.near,c=ht.vertices.far;N.makeEmpty();for(let e=0;e<4;e++)N.expandByPoint(s[e]),N.expandByPoint(c[e]);N.getCenter(M),M.z=N.max.z+this.lightMargin,M.x=Math.floor(M.x/a)*a,M.y=Math.floor(M.y/o)*o,M.applyMatrix4(I),r.position.copy(M),r.target.position.copy(M),r.target.position.x+=this.lightDirection.x,r.target.position.y+=this.lightDirection.y,r.target.position.z+=this.lightDirection.z}}_injectInclude(){y.lights_fragment_begin=pt.lights_fragment_begin,y.lights_pars_begin=pt.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE=``);let t=[],n=this,r=this.shaders;e.onBeforeCompile=function(i){let a=Math.min(n.camera.far,n.maxFar);n._getExtendedBreaks(t),i.uniforms.CSM_cascades={value:t},i.uniforms.cameraNear={value:n.camera.near},i.uniforms.shadowFar={value:a},r.set(e,i)},r.set(e,null)}_updateUniforms(){let e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(t,n){if(t!==null){let n=t.uniforms;this._getExtendedBreaks(n.CSM_cascades.value),n.cameraNear.value=this.camera.near,n.shadowFar.value=e}!this.fade&&`CSM_FADE`in n.defines?(delete n.defines.CSM_FADE,n.needsUpdate=!0):this.fade&&!(`CSM_FADE`in n.defines)&&(n.defines.CSM_FADE=``,n.needsUpdate=!0)},this)}_getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new g);e.length=this.breaks.length;for(let t=0;t<this.cascades;t++){let n=this.breaks[t],r=this.breaks[t-1]||0;e[t].x=r,e[t].y=n}}updateFrustums(){this._getBreaks(),this._initCascades(),this._updateShadowBounds(),this._updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){let e=this.shaders;e.forEach(function(e,t){delete t.onBeforeCompile,delete t.defines.USE_CSM,delete t.defines.CSM_CASCADES,delete t.defines.CSM_FADE,e!==null&&(delete e.uniforms.CSM_cascades,delete e.uniforms.cameraNear,delete e.uniforms.shadowFar),t.needsUpdate=!0}),e.clear()}},bt=R(.59,.4,.6),xt=R(.095,.2,.75),L=Object.freeze({csm:Object.freeze({cascades:3,customSplits:Object.freeze([1/16,1/4,1]),fade:!0,lightIntensity:2.5,maxFar:250,shadowMapSize:2048,shadowDepthBias:-5e-5,shadowIntensity:1,shadowNormalBias:.02,shadowRadius:2}),daylightCurve:Object.freeze({lowerDegrees:-6,upperDegrees:6}),exposure:Object.freeze({day:1,night:.6,twilight:.8}),hemisphere:Object.freeze({dayGround:xt,dayMaximumIntensity:.9,dayMinimumIntensity:.3,daySky:bt,intensityCurvePower:.25,nightGround:R(.63,.18,.35),nightIntensity:.25,nightSky:R(.63,.35,.6),positionY:50,twilightGround:R(.055,.25,.55),twilightIntensity:.55,twilightSky:R(.075,.45,.7)}),moon:Object.freeze({color:12176639,discDistance:850,discRadius:7,lightDistance:10,maximumLightIntensity:.55}),nightFadeCurve:Object.freeze({lowerDegrees:-12,upperDegrees:-6}),sky:Object.freeze({gradient:Object.freeze({nightHorizon:R(.63,.42,.075),nightZenith:R(.66,.55,.025),twilightHorizon:R(.055,.72,.38),twilightZenith:R(.61,.4,.18),zenithExponent:.35}),heightSegments:12,luminance:1,mieCoefficient:.005,mieDirectionalG:.8,radius:1e3,rayleigh:1,turbidity:2,widthSegments:24}),solar:Object.freeze({distance:10,noonAzimuthDegrees:145,noonElevationDegrees:50}),stars:Object.freeze({color:16777215,count:1024,radius:900,seed:1592594996,size:1.5}),sunColors:Object.freeze({day:R(0,0,1),night:R(.62,.35,.65),twilight:R(.06,.9,.72)})});L.hemisphere.dayMinimumIntensity+(1-Math.abs(L.solar.noonElevationDegrees-90)/90)**L.hemisphere.intensityCurvePower*(L.hemisphere.dayMaximumIntensity-L.hemisphere.dayMinimumIntensity);function St(e){if(V(e.solar.distance,`Environment sun distance`),U(e.solar.noonAzimuthDegrees,`Environment noon azimuth`),U(e.solar.noonElevationDegrees,`Environment noon elevation`),Math.abs(e.solar.noonElevationDegrees)>90)throw RangeError(`Environment noon elevation must be within [-90, 90].`);if(Ct(e.nightFadeCurve,`Environment night fade curve`),Ct(e.daylightCurve,`Environment daylight curve`),e.nightFadeCurve.upperDegrees!==e.daylightCurve.lowerDegrees)throw RangeError(`Environment night and daylight curves must meet continuously.`);for(let[t,n]of[[`day`,e.exposure.day],[`twilight`,e.exposure.twilight],[`night`,e.exposure.night]])V(n,`Environment ${t} exposure`);V(e.sky.radius,`Environment sky radius`),Tt(e.sky.widthSegments,`Environment sky width segments`,3),Tt(e.sky.heightSegments,`Environment sky height segments`,2);for(let[t,n]of[[`luminance`,e.sky.luminance],[`turbidity`,e.sky.turbidity],[`rayleigh`,e.sky.rayleigh],[`Mie coefficient`,e.sky.mieCoefficient],[`Mie directional G`,e.sky.mieDirectionalG]])U(n,`Environment sky ${t}`);let t=e.sky.gradient;for(let[e,n]of[[`twilight horizon`,t.twilightHorizon],[`twilight zenith`,t.twilightZenith],[`night horizon`,t.nightHorizon],[`night zenith`,t.nightZenith]])z(n,`Environment sky gradient ${e}`);V(t.zenithExponent,`Environment sky gradient zenith exponent`);for(let[t,n]of[[`day`,e.sunColors.day],[`twilight`,e.sunColors.twilight],[`night`,e.sunColors.night]])z(n,`Environment ${t} sun color`);let n=e.hemisphere;for(let[e,t]of[[`day sky`,n.daySky],[`day ground`,n.dayGround],[`twilight sky`,n.twilightSky],[`twilight ground`,n.twilightGround],[`night sky`,n.nightSky],[`night ground`,n.nightGround]])z(t,`Environment hemisphere ${e}`);for(let[e,t]of[[`day minimum intensity`,n.dayMinimumIntensity],[`day maximum intensity`,n.dayMaximumIntensity],[`twilight intensity`,n.twilightIntensity],[`night intensity`,n.nightIntensity],[`curve power`,n.intensityCurvePower]])H(t,`Environment hemisphere ${e}`);if(n.dayMaximumIntensity<n.dayMinimumIntensity)throw RangeError(`Environment hemisphere maximum intensity cannot be below minimum.`);if(U(n.positionY,`Environment hemisphere position`),B(e.stars.count,`Environment star count`,1),B(e.stars.seed,`Environment star seed`,0),e.stars.seed>4294967295)throw RangeError(`Environment star seed must fit an unsigned 32-bit integer.`);if(V(e.stars.radius,`Environment star radius`),V(e.stars.size,`Environment star size`),wt(e.stars.color,`Environment star color`),wt(e.moon.color,`Environment moon color`),V(e.moon.discDistance,`Environment moon disc distance`),V(e.moon.discRadius,`Environment moon disc radius`),V(e.moon.lightDistance,`Environment moon light distance`),H(e.moon.maximumLightIntensity,`Environment moon maximum light intensity`),e.stars.radius>=e.sky.radius||e.moon.discDistance>=e.sky.radius)throw RangeError(`Environment stars and moon must remain inside the sky sphere.`);if(B(e.csm.cascades,`Environment CSM cascades`,1),typeof e.csm.fade!=`boolean`)throw TypeError(`Environment CSM fade state must be boolean.`);if(V(e.csm.maxFar,`Environment CSM maximum far distance`),V(e.csm.lightIntensity,`Environment CSM light intensity`),B(e.csm.shadowMapSize,`Environment CSM shadow map size`,1),U(e.csm.shadowDepthBias,`Environment CSM shadow depth bias`),H(e.csm.shadowIntensity,`Environment CSM shadow intensity`),e.csm.shadowIntensity>1)throw RangeError(`Environment CSM shadow intensity must be within [0, 1].`);if(H(e.csm.shadowNormalBias,`Environment CSM shadow normal bias`),H(e.csm.shadowRadius,`Environment CSM shadow radius`),e.csm.customSplits.length!==e.csm.cascades)throw RangeError(`Environment CSM split count must equal its cascade count.`);let r=0;for(let t of e.csm.customSplits){if(V(t,`Environment CSM split`),t<=r||t>1)throw RangeError(`Environment CSM splits must increase within (0, 1].`);r=t}if(r!==1)throw RangeError(`Environment CSM splits must end at 1.`)}function R(e,t,n){return Object.freeze({h:e,l:n,s:t})}function Ct(e,t){if(U(e.lowerDegrees,`${t} lower elevation`),U(e.upperDegrees,`${t} upper elevation`),e.lowerDegrees>=e.upperDegrees)throw RangeError(`${t} must have increasing elevation bounds.`)}function z(e,t){U(e.h,`${t} hue`);for(let[n,r]of[[`saturation`,e.s],[`lightness`,e.l]])if(U(r,`${t} ${n}`),r<0||r>1)throw RangeError(`${t} ${n} must be in [0, 1].`)}function wt(e,t){if(B(e,t,0),e>16777215)throw RangeError(`${t} must be a 24-bit color.`)}function Tt(e,t,n){B(e,t,n)}function B(e,t,n){if(!Number.isSafeInteger(e))throw TypeError(`${t} must be a safe integer.`);if(e<n)throw RangeError(`${t} must be at least ${String(n)}.`)}function V(e,t){if(U(e,t),e<=0)throw RangeError(`${t} must be positive.`)}function H(e,t){if(U(e,t),e<0)throw RangeError(`${t} must be non-negative.`)}function U(e,t){if(!Number.isFinite(e))throw TypeError(`${t} must be finite.`)}function Et(){return{cameraPos:{value:new m},legacyLuminance:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},nightBlend:{value:0},nightHorizonColor:{value:new _},nightZenithColor:{value:new _},rayleigh:{value:1},skyGradientZenithExponent:{value:1},sunPosition:{value:new m},turbidity:{value:2},twilightBlend:{value:0},twilightHorizonColor:{value:new _},twilightZenithColor:{value:new _}}}var Dt=`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      const vec3 up = vec3( 0.0, 1.0, 0.0 );

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
       zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
       return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
       float c = ( 0.2 * T ) * 10E-18;
       return 0.434 * c * MieConst;
      }

      void main() {

       vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
       vWorldPosition = worldPosition.xyz;

       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

       vSunDirection = normalize( sunPosition );

       vSunE = sunIntensity( dot( vSunDirection, up ) );

       vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

       float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
       vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
       vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,Ot=`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // Three r185 injects a luminance(vec3) helper into ShaderMaterial.
      // The legacy luminance uniform is retained under a non-conflicting name;
      // its only historical use remains commented out below.
      uniform float legacyLuminance;
      uniform float mieDirectionalG;
      uniform vec3 cameraPos;
      uniform float nightBlend;
      uniform vec3 nightHorizonColor;
      uniform vec3 nightZenithColor;
      uniform float skyGradientZenithExponent;
      uniform float twilightBlend;
      uniform vec3 twilightHorizonColor;
      uniform vec3 twilightZenithColor;

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at
      // 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      const vec3 up = vec3( 0.0, 1.0, 0.0 );
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
       return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
       float g2 = pow( g, 2.0 );
       float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
       return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      // Filmic ToneMapping http://filmicgames.com/archives/75
      const float A = 0.15;
      const float B = 0.50;
      const float C = 0.10;
      const float D = 0.20;
      const float E = 0.02;
      const float F = 0.30;

      const float whiteScale = 1.0748724675633854; // 1.0 / Uncharted2Tonemap(1000.0)

      vec3 Uncharted2Tonemap( vec3 x ) {
       return ( ( x * ( A * x + C * B ) + D * E ) / ( x * ( A * x + B ) + D * F ) ) - E / F;
      }

      void main() {
      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
       float zenithAngle = acos( max( 0.0, dot( up, normalize( vWorldPosition - cameraPos ) ) ) );
       float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
       float sR = rayleighZenithLength * inverse;
       float sM = mieZenithLength * inverse;

      // combined extinction factor
       vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
       float cosTheta = dot( normalize( vWorldPosition - cameraPos ), vSunDirection );

       float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
       vec3 betaRTheta = vBetaR * rPhase;

       float mPhase = hgPhase( cosTheta, mieDirectionalG );
       vec3 betaMTheta = vBetaM * mPhase;

       vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
       Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
       vec3 direction = normalize( vWorldPosition - cameraPos );
       float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
       float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
       vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
       vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
       float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
       L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

       vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

       //vec3 curr = Uncharted2Tonemap( ( log2( 2.0 / pow( legacyLuminance, 4.0 ) ) ) * texColor );
        // vec3 color = texColor * whiteScale;
        vec3 color = texColor * 0.3;

       vec3 retColor = pow( color, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

       // Preserve the exact legacy daytime path when both typed blends are zero.
       float skyGradientBlend = clamp( twilightBlend + nightBlend, 0.0, 1.0 );
       if ( skyGradientBlend > 0.0 ) {
         float zenithBlend = pow(
           clamp( direction.y, 0.0, 1.0 ),
           skyGradientZenithExponent
         );
         vec3 twilightGradient = mix(
           twilightHorizonColor,
           twilightZenithColor,
           zenithBlend
         );
         vec3 nightGradient = mix(
           nightHorizonColor,
           nightZenithColor,
           zenithBlend
         );
         vec3 phaseGradient = (
           twilightGradient * twilightBlend + nightGradient * nightBlend
         ) / skyGradientBlend;
         retColor = mix( retColor, phaseGradient, skyGradientBlend );
       }

       gl_FragColor = vec4( retColor, 1.0 );

        #if defined( TONE_MAPPING )
          gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
        #endif
      } `;Object.freeze({fragmentShader:Ot,vertexShader:Dt});var kt=.98,At=class extends re{moonDisc;skyMesh;starField;uniforms;#e=new m;#t;#n=!1;constructor(e){super(),this.name=`day-night-environment-sky`,this.#t=e,this.uniforms=Et(),this.uniforms.legacyLuminance.value=e.sky.luminance,this.uniforms.turbidity.value=e.sky.turbidity,this.uniforms.rayleigh.value=e.sky.rayleigh,this.uniforms.mieCoefficient.value=e.sky.mieCoefficient,this.uniforms.mieDirectionalG.value=e.sky.mieDirectionalG;let t=e.sky.gradient;this.uniforms.nightHorizonColor.value.copy(W(t.nightHorizon)),this.uniforms.nightZenithColor.value.copy(W(t.nightZenith)),this.uniforms.twilightHorizonColor.value.copy(W(t.twilightHorizon)),this.uniforms.twilightZenithColor.value.copy(W(t.twilightZenith)),this.uniforms.skyGradientZenithExponent.value=t.zenithExponent;let n=new i({depthWrite:!1,fragmentShader:Ot,side:1,uniforms:this.uniforms,vertexShader:Dt});this.skyMesh=new v(new p(e.sky.radius,e.sky.widthSegments,e.sky.heightSegments),n),this.skyMesh.name=`legacy-preetham-sky`,this.skyMesh.frustumCulled=!1,this.skyMesh.renderOrder=-1e3,this.skyMesh.onBeforeRender=(e,t,n)=>{this.applyCamera(n),this.updateMatrixWorld(!0)};let r=new ae;r.setAttribute(`position`,new ee(Mt(e.stars),3));let a=new me({blending:2,color:e.stars.color,depthWrite:!1,opacity:0,size:e.stars.size,sizeAttenuation:!1,transparent:!0});this.starField=new c(r,a),this.starField.name=`deterministic-star-field`,this.starField.frustumCulled=!1,this.starField.renderOrder=-999,this.starField.visible=!1;let o=new fe({color:e.moon.color,depthWrite:!1,opacity:0,side:2,transparent:!0});this.moonDisc=new v(new ce(e.moon.discRadius,48),o),this.moonDisc.name=`moon-disc`,this.moonDisc.frustumCulled=!1,this.moonDisc.renderOrder=-998,this.moonDisc.visible=!1,this.add(this.skyMesh,this.starField,this.moonDisc)}applyFrame(e,t){this.#n||(this.applyCamera(e),this.applyFrameState(t))}applyCamera(e){if(this.#n)return;e.getWorldPosition(this.#e),this.position.copy(this.#e);let t=jt(e),n=this.#t.sky.radius,r=t===null||n<t?n:t*kt;this.scale.setScalar(r/n),this.uniforms.cameraPos.value.copy(this.#e),this.moonDisc.lookAt(this.#e)}applyFrameState(e){if(this.#n)return;this.uniforms.sunPosition.value.set(e.solar.sunPosition.x,e.solar.sunPosition.y,e.solar.sunPosition.z),this.uniforms.twilightBlend.value=e.curves.twilight,this.uniforms.nightBlend.value=e.curves.night;let t=e.curves.stars;this.starField.material.opacity=t,this.starField.visible=t>0;let n=e.curves.effectiveMoonContribution;this.moonDisc.material.opacity=n,this.moonDisc.visible=n>0,this.moonDisc.position.set(e.solar.moonDirection.x*this.#t.moon.discDistance,e.solar.moonDirection.y*this.#t.moon.discDistance,e.solar.moonDirection.z*this.#t.moon.discDistance),this.moonDisc.lookAt(this.#e)}diagnostics(){return Object.freeze({nightBlend:this.uniforms.nightBlend.value,nightHorizon:G(this.uniforms.nightHorizonColor.value),nightZenith:G(this.uniforms.nightZenithColor.value),twilightBlend:this.uniforms.twilightBlend.value,twilightHorizon:G(this.uniforms.twilightHorizonColor.value),twilightZenith:G(this.uniforms.twilightZenithColor.value),zenithExponent:this.uniforms.skyGradientZenithExponent.value})}dispose(){this.#n||(this.#n=!0,this.removeFromParent(),this.skyMesh.geometry.dispose(),this.skyMesh.material.dispose(),this.starField.geometry.dispose(),this.starField.material.dispose(),this.moonDisc.geometry.dispose(),this.moonDisc.material.dispose(),this.clear())}};function jt(e){let t=e.far;return typeof t==`number`&&Number.isFinite(t)&&t>0?t:null}function W(e){return new _().setHSL(e.h,e.s,e.l)}function G(e){return Object.freeze({b:e.b,g:e.g,r:e.r})}function Mt(e){if(!Number.isSafeInteger(e.count)||e.count<=0)throw RangeError(`Deterministic star count must be a positive safe integer.`);if(!Number.isSafeInteger(e.seed)||e.seed<0||e.seed>4294967295)throw RangeError(`Deterministic star seed must be an unsigned 32-bit integer.`);if(!Number.isFinite(e.radius)||e.radius<=0)throw RangeError(`Deterministic star radius must be positive and finite.`);let t=Nt(e.seed),n=new Float32Array(e.count*3);for(let r=0;r<e.count;r+=1){let i=t()*2-1,a=t()*Math.PI*2,o=Math.sqrt(Math.max(0,1-i*i)),s=r*3;n[s]=e.radius*o*Math.cos(a),n[s+1]=e.radius*i,n[s+2]=e.radius*o*Math.sin(a)}return n}function Nt(e){let t=e>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var K=24,Pt=Math.PI/180;function Ft(e,t=L){Ht(e);let n=It(e.timeOfDayHours,t.solar);return Object.freeze({curves:Lt(n.elevationDegrees,t),solar:n})}function It(e,t=L.solar){let n=q(e);Ut(t);let r=(n-6)/K*Math.PI*2,i=t.noonElevationDegrees*Math.sin(r),a=Math.abs(i)<1e-12?0:i,o=t.noonAzimuthDegrees+(n-12)/K*360,s=Vt(o),c=a*Pt,l=o*Pt,u=Math.cos(c),d=Wt({x:t.distance*Math.sin(l)*u,y:t.distance*Math.sin(c),z:t.distance*Math.cos(l)*u}),f=1/Math.hypot(d.x,d.y,d.z);if(!Number.isFinite(f))throw RangeError(`Environment solar vector is not finite.`);let p=Wt({x:d.x*f,y:d.y*f,z:d.z*f}),m=Wt({x:-p.x,y:-p.y,z:-p.z});return Object.freeze({azimuthDegrees:s,csmDirection:m,elevationDegrees:a,moonDirection:m,sunDirection:p,sunPosition:d,timeOfDayHours:n})}function Lt(e,t=L){if(!Number.isFinite(e))throw TypeError(`Environment solar elevation must be finite.`);let n=zt(e,t.daylightCurve),r=J(1-zt(e,t.nightFadeCurve)),i=J(1-n-r),a=n*Rt(e,t.hemisphere)+i*t.hemisphere.twilightIntensity+r*t.hemisphere.nightIntensity,o=n*t.exposure.day+i*t.exposure.twilight+r*t.exposure.night;if(Gt(n,`daylight`),Gt(i,`twilight`),Gt(r,`night`),!Number.isFinite(a)||a<0)throw RangeError(`Environment hemisphere curve is invalid.`);if(!Number.isFinite(o)||o<=0)throw RangeError(`Environment exposure curve is invalid.`);return Object.freeze({daylight:n,effectiveMoonContribution:r,effectiveSunContribution:n,exposure:o,hemisphereIntensity:a,night:r,stars:r,twilight:i})}function Rt(e,t=L.hemisphere){if(!Number.isFinite(e))throw TypeError(`Environment hemisphere elevation must be finite.`);let n=J(1-Math.abs(e-90)/90);return t.dayMinimumIntensity+n**+t.intensityCurvePower*(t.dayMaximumIntensity-t.dayMinimumIntensity)}function zt(e,t){if(!Number.isFinite(e)||!Number.isFinite(t.lowerDegrees)||!Number.isFinite(t.upperDegrees))throw TypeError(`Environment elevation curve values must be finite.`);if(t.lowerDegrees>=t.upperDegrees)throw RangeError(`Environment elevation curve bounds must increase.`);let n=J((e-t.lowerDegrees)/(t.upperDegrees-t.lowerDegrees));return J(n*n*n*(n*(n*6-15)+10))}function q(e){if(!Number.isFinite(e))throw TypeError(`Environment time of day must be finite.`);let t=(e%K+K)%K;return t===0?0:t}function Bt(e,t,n){let r=q(e),i=q(t);if(!Number.isFinite(n)||n<0||n>1)throw RangeError(`Environment clock interpolation alpha must be within [0, 1].`);return q(r+((i-r+12+K)%K-12)*n)}function Vt(e){let t=(e%360+360)%360;return t===0?0:t}function Ht(e){if(typeof e!=`object`||!e||Array.isArray(e))throw TypeError(`Environment clock snapshot requires a finite timeOfDayHours value.`);let t=e;if(typeof t.timeOfDayHours!=`number`||!Number.isFinite(t.timeOfDayHours))throw TypeError(`Environment clock snapshot requires a finite timeOfDayHours value.`)}function Ut(e){if(![e.distance,e.noonAzimuthDegrees,e.noonElevationDegrees].every(Number.isFinite))throw TypeError(`Environment solar configuration must be finite.`);if(e.distance<=0)throw RangeError(`Environment sun distance must be positive.`)}function Wt(e){if(![e.x,e.y,e.z].every(Number.isFinite))throw RangeError(`Environment vector must be finite.`);return Object.freeze({x:e.x,y:e.y,z:e.z})}function J(e){return Math.min(1,Math.max(0,e))}function Gt(e,t){if(!Number.isFinite(e)||e<0||e>1)throw RangeError(`Environment ${t} curve must be within [0, 1].`)}var Kt=12,qt=[`USE_CSM`,`CSM_CASCADES`,`CSM_FADE`],Jt=class{csm;hemisphereLight;moonLight;sky;#e;#t=new m;#n;#r;#i;#a;#o;#s;#c;#l=new Map;#u;#d;#f=new _;#p;#m;#h;#g;#_=!1;#v;#y;#b;#x=`every-frame`;#S=!0;#C=!0;#w=`full`;constructor(e){this.#n=e.config??L,St(this.#n),this.#e=e.camera,this.#u=e.scene,this.#d=e.scene.background;let t=this.#n.hemisphere;this.#i=Y(t.daySky),this.#r=Y(t.dayGround),this.#m=Y(t.twilightSky),this.#p=Y(t.twilightGround),this.#s=Y(t.nightSky),this.#o=Y(t.nightGround),this.#a=Y(this.#n.sunColors.day),this.#h=Y(this.#n.sunColors.twilight),this.#c=Y(this.#n.sunColors.night),this.#f.copy(this.#a),this.sky=new At(this.#n),this.hemisphereLight=new r(this.#i,this.#r,1),this.hemisphereLight.name=`day-night-hemisphere-light`,this.hemisphereLight.position.set(0,t.positionY,0),this.moonLight=new ie(this.#n.moon.color,this.#n.moon.maximumLightIntensity),this.moonLight.name=`moon-directional-light`,this.moonLight.target.name=`moon-directional-light-target`,this.#g=Ft(Object.freeze({timeOfDayHours:Kt}),this.#n),this.#u.add(this.sky,this.hemisphereLight,this.moonLight,this.moonLight.target);let n=this.#n.csm;this.#v=n.cascades,this.#y=n.maxFar,this.#b=n.shadowMapSize;let i=this.#g.solar.csmDirection;this.csm=new yt({camera:this.#e,cascades:n.cascades,customSplitsCallback:(e,t,r,i)=>{if(e!==n.customSplits.length)throw RangeError(`Environment CSM cascade and split counts diverged.`);i.push(...n.customSplits)},lightDirection:new m(i.x,i.y,i.z),lightIntensity:n.lightIntensity,maxFar:n.maxFar,mode:`custom`,parent:this.#u,shadowBias:n.shadowDepthBias,shadowMapSize:n.shadowMapSize});for(let e of this.csm.lights)e.shadow.intensity=n.shadowIntensity,e.shadow.normalBias=n.shadowNormalBias,e.shadow.radius=n.shadowRadius;this.csm.fade=n.fade,this.csm.updateFrustums(),this.#D()}get currentFrame(){return this.#g}get exposure(){return this.#g.curves.exposure}update(e){if(this.#_)return;let t=q(e.timeOfDayHours)!==this.#g.solar.timeOfDayHours;if(t&&(this.#g=Ft(e,this.#n)),t||this.#C){this.#C=!1,this.#D();return}!this.#S&&this.#w===`gradient`||this.#O()}updateFrustums(){this.#_||!this.#S||this.csm.updateFrustums()}setShadowsEnabled(e){this.#_||this.#S===e||(this.#S=e,this.#C=!0,this.#j(),e&&(this.csm.updateFrustums(),this.#g.curves.effectiveSunContribution>0&&this.csm.update()))}setShadowUpdatePolicy(e){this.#x=e,this.setShadowsEnabled(e!==`disabled`)}setShadowBudget(e,t,n){if(!Number.isSafeInteger(e)||e<0||e>this.csm.lights.length)throw RangeError(`Shadow cascade count must be an integer from zero through ${String(this.csm.lights.length)}.`);if(!Number.isSafeInteger(t)||t<0||e>0&&t<1)throw RangeError(`Shadow map size must be a non-negative integer.`);if(!Number.isFinite(n)||n<0||e>0&&n<=0)throw RangeError(`Shadow distance must be finite and non-negative.`);this.#_||(this.#v=e,this.#b=t,this.#y=n,this.#C=!0,this.csm.maxFar=Math.max(n,.1),t>0&&(this.csm.shadowMapSize=t),this.#j(),this.#S&&this.#v>0&&this.csm.updateFrustums())}setSkyMode(e){this.#_||this.#w===e||(this.#w=e,this.#C=!0,this.sky.visible=e!==`gradient`,e!==`gradient`&&this.#u.background===this.#f&&(this.#u.background=this.#d),this.#D())}registerMaterial(e){if(this.#_)return;let t=this.#l.get(e);if(t!==void 0)return t.references+=1,this.#T(e,t);let n=e.defines,r={hadDefines:n!==void 0,hadOwnOnBeforeCompile:Object.hasOwn(e,`onBeforeCompile`),priorDefines:Object.freeze(qt.map(e=>Object.freeze({key:e,present:n!==void 0&&Object.hasOwn(n,e),value:n?.[e]}))),priorOnBeforeCompile:e.onBeforeCompile,references:1};try{this.csm.setupMaterial(e),this.#N(e)}catch(t){throw this.#E(e,r),t}return this.#l.set(e,r),ge(e,this),this.#T(e,r)}setupMaterial(e){return this.registerMaterial(e)}diagnostics(){return Object.freeze({breaks:Object.freeze([...this.csm.breaks]),currentFrame:this.#g,exposure:this.exposure,lights:Object.freeze({csm:Object.freeze(this.csm.lights.map(e=>Object.freeze({intensity:e.intensity,shadowIntensity:e.shadow.intensity,visible:e.visible}))),hemisphereGroundColor:Yt(this.hemisphereLight.groundColor),hemisphereIntensity:this.hemisphereLight.intensity,hemisphereSkyColor:Yt(this.hemisphereLight.color),moonIntensity:this.moonLight.intensity,moonVisible:this.moonLight.visible,sunColor:Yt(this.#f)}),registeredMaterialCount:this.#l.size,shadowCascadeCount:this.#v,shadowDistance:this.#y,shadowMapSize:this.#b,shadowUpdatePolicy:this.#x,shadowsEnabled:this.#S,skyMode:this.#w,sky:this.sky.diagnostics()})}dispose(){if(!this.#_){this.#_=!0,this.sky.dispose(),this.hemisphereLight.removeFromParent(),this.moonLight.removeFromParent(),this.moonLight.target.removeFromParent();for(let[e,t]of this.#l)this.#E(e,t);this.#l.clear(),this.#u.background===this.#f&&(this.#u.background=this.#d),this.csm.remove(),this.csm.dispose()}}#T(e,t){let n=!1;return Object.freeze({dispose:()=>{if(n)return;n=!0;let r=this.#l.get(e);r===t&&(--r.references,!(r.references>0)&&(this.#l.delete(e),this.#E(e,r)))}})}#E(e,t){this.csm.shaders.delete(e),t.hadOwnOnBeforeCompile?e.onBeforeCompile=t.priorOnBeforeCompile:Reflect.deleteProperty(e,`onBeforeCompile`);let n=e.defines;if(t.hadDefines){let r=n??{};e.defines=r,Xt(r,t.priorDefines)}else n!==void 0&&(Xt(n,t.priorDefines),Object.keys(n).length===0&&(e.defines=void 0));e.needsUpdate=!0}#D(){this.#e.updateMatrixWorld(!0),this.sky.applyFrame(this.#e,this.#g),this.#k(),this.#A()}#O(){this.#e.updateMatrixWorld(!0),this.sky.applyCamera(this.#e),this.#A()}#k(){let e=this.#g.curves;Zt(this.hemisphereLight.color,this.#i,this.#m,this.#s,e.daylight,e.twilight,e.night),Zt(this.hemisphereLight.groundColor,this.#r,this.#p,this.#o,e.daylight,e.twilight,e.night),this.hemisphereLight.intensity=e.hemisphereIntensity,this.moonLight.intensity=this.#n.moon.maximumLightIntensity*e.effectiveMoonContribution,this.moonLight.visible=e.effectiveMoonContribution>0;let t=this.#g.solar.csmDirection;this.csm.lightDirection.set(t.x,t.y,t.z),Zt(this.#f,this.#a,this.#h,this.#c,e.daylight,e.twilight,e.night),this.#w===`gradient`&&(this.#u.background=this.#f);let n=this.#n.csm.lightIntensity*e.effectiveSunContribution,r=this.#M();for(let[t,i]of this.csm.lights.entries())i.color.copy(this.#f),i.intensity=n,i.visible=e.effectiveSunContribution>0&&t<r}#A(){let e=this.#g.curves;this.#e.getWorldPosition(this.#t);let t=this.#g.solar.moonDirection;this.moonLight.position.set(this.#t.x+t.x*this.#n.moon.lightDistance,this.#t.y+t.y*this.#n.moon.lightDistance,this.#t.z+t.z*this.#n.moon.lightDistance),this.moonLight.target.position.copy(this.#t),this.#S&&e.effectiveSunContribution>0&&this.csm.update()}#j(){let e=this.#M();for(let[t,n]of this.csm.lights.entries()){let r=this.#S&&t<this.#v;n.castShadow=r,n.visible=this.#g.curves.effectiveSunContribution>0&&t<e,r&&(n.shadow.mapSize.width!==this.#b||n.shadow.mapSize.height!==this.#b)&&(n.shadow.mapSize.set(this.#b,this.#b),n.shadow.map?.dispose(),n.shadow.map=null,n.shadow.needsUpdate=!0)}for(let e of this.#l.keys())this.#N(e)}#M(){return Math.max(1,this.#S?this.#v:0)}#N(e){let t=this.#M();e.defines!==void 0&&e.defines.CSM_CASCADES!==t&&(e.defines.CSM_CASCADES=t,e.needsUpdate=!0)}};function Y(e){return new _().setHSL(e.h,e.s,e.l)}function Yt(e){return Object.freeze({b:e.b,g:e.g,r:e.r})}function Xt(e,t){for(let n of t)n.present?e[n.key]=n.value:Reflect.deleteProperty(e,n.key)}function Zt(e,t,n,r,i,a,o){e.setRGB(t.r*i+n.r*a+r.r*o,t.g*i+n.g*a+r.g*o,t.b*i+n.b*a+r.b*o)}var Qt={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},X=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},$t=new a(-1,1,1,-1,0,1),en=new class extends ae{constructor(){super(),this.setAttribute(`position`,new s([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new s([0,2,0,0,2,0],2))}},tn=class{constructor(e){this._mesh=new v(en,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$t)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},nn=class extends X{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof i?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=le.clone(e.uniforms),this.material=new i({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new tn(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},rn=class extends X{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},an=class extends X{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},on=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new g);this._width=n.width,this._height=n.height,t=new de(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:f}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new nn(Qt),this.copyPass.material.blending=0,this.timer=new ue}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}rn!==void 0&&(r instanceof rn?n=!0:r instanceof an&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new g);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Z={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},sn=class extends X{constructor(){super(),this.isOutputPass=!0,this.uniforms=le.clone(Z.uniforms),this.material=new n({name:Z.name,uniforms:this.uniforms,vertexShader:Z.vertexShader,fragmentShader:Z.fragmentShader}),this._fsQuad=new tn(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},te.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},cn=class extends X{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new _}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ln={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new g(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},un=1e6,dn=250,fn=class{#e;#t;#n=null;#r=!1;#i=null;#a=!1;constructor(e,t=!1){let n=t?null:pn(e),r=n===null?null:mn(n.getExtension(`EXT_disjoint_timer_query_webgl2`));this.#e=r===null?null:n,this.#t=r}get supported(){return this.#e!==null&&this.#t!==null}takeFrameMs(){let e=this.#i;return this.#i=null,e}begin(){let e=this.#e,t=this.#t;if(this.#a||e===null||t===null||this.#r||(this.#o(),this.#n!==null))return;let n=e.createQuery();n!==null&&(this.#n=n,this.#r=!0,e.beginQuery(t.TIME_ELAPSED_EXT,n))}end(){let e=this.#e,t=this.#t;!this.#r||e===null||t===null||(this.#r=!1,e.endQuery(t.TIME_ELAPSED_EXT))}dispose(){this.#a=!0;let e=this.#e;e===null||this.#n===null||(this.#r&&(this.#r=!1,this.#t!==null&&e.endQuery(this.#t.TIME_ELAPSED_EXT)),e.deleteQuery(this.#n),this.#n=null)}#o(){let e=this.#e,t=this.#t,n=this.#n;if(e===null||t===null||n===null||e.getQueryParameter(n,e.QUERY_RESULT_AVAILABLE)!==!0)return;let r=e.getParameter(t.GPU_DISJOINT_EXT)===!0,i=e.getQueryParameter(n,e.QUERY_RESULT);if(e.deleteQuery(n),this.#n=null,r||typeof i!=`number`||!Number.isFinite(i))return;let a=i/un;a<0||a>dn||(this.#i=a)}};function pn(e){if(typeof e!=`object`||!e)return null;let t=e;return typeof t.createQuery==`function`&&typeof t.beginQuery==`function`&&typeof t.endQuery==`function`&&typeof t.getQueryParameter==`function`&&typeof t.getExtension==`function`?e:null}function mn(e){if(typeof e!=`object`||!e)return null;let t=e;return typeof t.TIME_ELAPSED_EXT==`number`&&typeof t.GPU_DISJOINT_EXT==`number`?e:null}var hn=64,gn=16e4,_n=class{canvas;scene=new u;#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u=null;#d;#f=0;#p=0;#m=null;#h=NaN;#g=!1;#_=[];#v=1/0;#y=0;#b=!1;#x=new Set;#S=!1;#C;#w;#T;constructor(e){this.#l=e.mount,this.#C=$(e.internalRenderScale??1,`Renderer internal render scale`),this.#w=Sn(e.maxFramebufferPixels??1/0,`Renderer framebuffer pixel budget`),this.#d=e.alpha??!1?!1:e.composerEnabled??!0,this.#T=$(e.pixelRatio??globalThis.devicePixelRatio,`Renderer pixel ratio`);let t=e.alpha??!1;this.#i=new he({alpha:t,antialias:t,powerPreference:`high-performance`,stencil:!0}),this.#i.debug.checkShaderErrors=e.shaderErrorChecks??!0;let n=yn(this.#i);this.#o=n.renderer,this.#s=n.vendor,this.#c=n.softwareRenderer,this.canvas=this.#i.domElement,this.canvas.className=`game-canvas`,this.canvas.tabIndex=0,t?this.#i.setClearAlpha(0):this.scene.background=new _(1120295),this.#i.outputColorSpace=pe,this.#i.toneMapping=4,this.#i.toneMappingExposure=1,this.#i.shadowMap.type=1,this.#A(e.shadowsEnabled??!0),this.#i.setPixelRatio(this.#T*this.#C),this.#r=new cn(this.scene,new o),this.#n=new sn,this.#t=new nn(ln),this.#e=new on(this.#i),this.#e.renderTarget1.stencilBuffer=!0,this.#e.renderTarget2.stencilBuffer=!0,this.#e.addPass(this.#r),this.#e.addPass(this.#n),this.#e.addPass(this.#t),this.#a=new fn(this.#i.getContext(),this.#c),this.canvas.addEventListener(`webglcontextlost`,this.#D),this.#l.addEventListener(`webglcontextlost`,this.#E,{capture:!0}),this.canvas.addEventListener(`webglcontextrestored`,this.#O),this.#l.append(this.canvas)}get contextLost(){return this.#g}get renderingSuspended(){return this.#b}onContextRestored(e){return this.#x.add(e),()=>{this.#x.delete(e)}}#E=e=>{e.target!==this.canvas||!this.#b||(e.stopImmediatePropagation(),this.#g=!0)};#D=e=>{e.preventDefault(),this.#g=!0;let t=globalThis.performance.now();for(this.#_.push(t);this.#_.length>0&&t-(this.#_[0]??t)>3e4;)this.#_.shift()};#O=()=>{if(!this.#S&&(this.#g=!1,!this.#b)){if(this.#_.length>=5){this.#b=!0,this.#m=null,this.#i.setDrawingBufferSize(1,1,1),this.#e.setSize(1,1);return}this.#_.length>=2&&this.#y>0&&(this.#v=Math.max(gn,Math.min(this.#v,this.#y)/2)),this.#m=null,this.#h=NaN,this.#k();for(let e of[...this.#x])try{e()}catch{}}};resize(e,t,n=globalThis.devicePixelRatio){if(!(this.#S||e<=0||t<=0)){if(!Number.isFinite(e)||!Number.isFinite(t))throw RangeError(`Renderer dimensions must be positive and finite.`);if(this.#T=$(n,`Renderer pixel ratio`),this.#p=e,this.#f=t,this.#b&&!this.#g){let e=this.#_.at(-1)??-1/0;if(globalThis.performance.now()-e<=3e4)return;this.#b=!1,this.#_.length=0,this.#m=null,this.#h=NaN}this.#k()}}renderHidden(e){if(this.#S||this.#g||this.#b)return;this.#u??=new de(hn,hn,{stencilBuffer:!0});let t=this.#i.getRenderTarget();this.#i.setRenderTarget(this.#u);try{this.#i.render(this.scene,e)}finally{this.#i.setRenderTarget(t)}}render(e){this.#S||this.#g||this.#b||(this.#a.begin(),this.#d?(this.#r.camera=e,this.#e.render()):this.#i.render(this.scene,e),this.#a.end())}takeGpuFrameMs(){return this.#a.takeFrameMs()}get gpuTimingSupported(){return this.#a.supported}precompile(e){if(!this.#S){this.#i.compile(this.scene,e);for(let e of this.#i.info.programs??[])e.getUniforms()}}prepareTextureV1(e){this.#S||this.#i.initTexture(e)}setRenderBudget(e){this.#S||(this.#C=$(e.internalRenderScale,`Renderer internal render scale`),this.#w=Sn(e.maxFramebufferPixels,`Renderer framebuffer pixel budget`),this.#k())}setComposerEnabled(e){this.#S||this.#d===e||(this.#d=e,this.#k())}setFxaaEnabled(e){this.#S||(this.#t.enabled=e)}setShadowsEnabled(e){this.#S||this.#A(e)}setExposure(e){if(!Number.isFinite(e)||e<=0)throw RangeError(`Renderer exposure must be positive and finite.`);this.#i.toneMappingExposure=e}get drawCallCount(){return this.#i.info.render.calls}diagnostics(){let e=this.#i.getDrawingBufferSize(new g),t=this.#j();return Object.freeze({activeComposerPasses:this.#d?this.#t.enabled?3:2:0,composerEnabled:this.#d,composerHeight:this.#e.renderTarget1.height,composerWidth:this.#e.renderTarget1.width,cssHeight:this.#f,cssWidth:this.#p,drawingBufferHeight:e.y,drawingBufferPixels:e.x*e.y,drawingBufferWidth:e.x,drawCalls:this.#i.info.render.calls,exposure:this.#i.toneMappingExposure,fxaaEnabled:this.#t.enabled,fxaaResolutionX:t.x,fxaaResolutionY:t.y,internalRenderScale:this.#C,maxFramebufferPixels:Number.isFinite(this.#w)?this.#w:null,composerTargetType:this.#e.renderTarget1.texture.type,contextVersion:this.#i.capabilities.isWebGL2?2:1,maxTextureSize:this.#i.capabilities.maxTextureSize,outputColorSpace:this.#i.outputColorSpace,passOrder:Object.freeze([`RenderPass`,`OutputPass`,`FXAA`]),pixelRatio:this.#i.getPixelRatio(),renderMode:this.#d?`composer`:`direct`,requestedPixelRatio:this.#T,rendererName:this.#o,rendererVendor:this.#s,renderedLines:this.#i.info.render.lines,renderedPoints:this.#i.info.render.points,renderedTriangles:this.#i.info.render.triangles,resourceGeometries:this.#i.info.memory.geometries,resourcePrograms:this.#i.info.programs?.length??0,resourceTextures:this.#i.info.memory.textures,softwareRenderer:this.#c,shadowMapAutoUpdate:this.#i.shadowMap.autoUpdate,shadowMapEnabled:this.#i.shadowMap.enabled,shadowMapType:this.#i.shadowMap.type,toneMapping:this.#i.toneMapping})}dispose(){this.#S||(this.#S=!0,this.canvas.removeEventListener(`webglcontextlost`,this.#D),this.#l.removeEventListener(`webglcontextlost`,this.#E,{capture:!0}),this.canvas.removeEventListener(`webglcontextrestored`,this.#O),this.#x.clear(),this.#a.dispose(),this.scene.clear(),this.#t.dispose(),this.#n.dispose(),this.#r.dispose(),this.#e.dispose(),this.#u?.dispose(),this.#u=null,this.#i.dispose(),this.canvas.remove())}#k(){let e=vn({height:this.#f,internalRenderScale:this.#C,maxFramebufferPixels:Math.min(this.#w,this.#v),requestedPixelRatio:this.#T,width:this.#p});if(this.#p<=0||this.#f<=0){this.#i.setPixelRatio(e);return}let t=`${String(this.#p)}x${String(this.#f)}@${String(e)}:${this.#d?`composer`:`direct`}`;if(t!==this.#m){if(this.#m=t,this.#i.setDrawingBufferSize(this.#p,this.#f,e),this.#y=Math.floor(this.#p*e)*Math.floor(this.#f*e),this.#d){this.#h!==e&&(this.#h=e,this.#e.setPixelRatio(e)),this.#e.setSize(this.#p,this.#f),this.#j().set(1/(this.#p*e),1/(this.#f*e));return}this.#e.setSize(1,1),this.#e.setPixelRatio(1),this.#h=1,this.#j().set(1/(this.#p*e),1/(this.#f*e))}}#A(e){this.#i.shadowMap.enabled=e,this.#i.shadowMap.autoUpdate=e,this.#i.shadowMap.needsUpdate=e}#j(){let e=this.#t.uniforms.resolution?.value;if(!(e instanceof g))throw TypeError(`FXAA resolution uniform is unavailable.`);return e}};function vn(e){let t=$(e.requestedPixelRatio,`Renderer requested pixel ratio`),n=$(e.internalRenderScale,`Renderer internal render scale`),r=Sn(e.maxFramebufferPixels,`Renderer framebuffer pixel budget`);if(!Number.isFinite(e.width)||!Number.isFinite(e.height)||e.width<0||e.height<0)throw RangeError(`Renderer dimensions must be finite and non-negative.`);let i=t*n;if(e.width===0||e.height===0||!Number.isFinite(r))return i;let a=Math.sqrt(r/(e.width*e.height));return Math.min(i,a)}function yn(e){try{let t=e.getContext(),n=Q(t,t.RENDERER),r=Q(t,t.VENDOR);if(bn(n)){let e=t.getExtension(`WEBGL_debug_renderer_info`);e!==null&&(n=Q(t,e.UNMASKED_RENDERER_WEBGL),r=Q(t,e.UNMASKED_VENDOR_WEBGL))}return Object.freeze({renderer:n,softwareRenderer:xn(n,r),vendor:r})}catch{return Object.freeze({renderer:null,softwareRenderer:!1,vendor:null})}}function bn(e){return e===null||/^WebKit WebGL$/iu.test(e)}function Q(e,t){let n=e.getParameter(t);return typeof n==`string`&&n.trim().length>0?n.trim():null}function xn(e,t){return/SwiftShader|software rasterizer|software renderer|llvmpipe|softpipe|lavapipe|Microsoft Basic Render|Mesa OffScreen/iu.test(`${t??``} ${e??``}`)}function $(e,t){if(!Number.isFinite(e)||e<=0)throw RangeError(`${t} must be positive and finite.`);return e}function Sn(e,t){if(Number.isFinite(e)&&e>0||e===1/0)return e;throw RangeError(`${t} must be positive.`)}var Cn=Object.freeze({...L,csm:Object.freeze({...L.csm,lightIntensity:3,shadowIntensity:.6}),exposure:Object.freeze({day:1.15,night:.8,twilight:1.05}),hemisphere:Object.freeze({...L.hemisphere,dayMaximumIntensity:2,dayMinimumIntensity:1,nightIntensity:.6,twilightIntensity:1.2})}),wn=new _(Ce.sky),Tn=On(Cn.sky.gradient.twilightHorizon),En=On(Cn.sky.gradient.nightHorizon);function Dn(e,t){e.setRGB(wn.r*t.daylight+Tn.r*t.twilight+En.r*t.night,wn.g*t.daylight+Tn.g*t.twilight+En.g*t.night,wn.b*t.daylight+Tn.b*t.twilight+En.b*t.night)}function On(e){return new _().setHSL(e.h,e.s,e.l)}export{Bt as a,Fe as c,Jt as i,b as l,Dn as n,Ze as o,_n as r,De as s,Cn as t};