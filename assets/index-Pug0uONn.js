function PT(t,i){for(var a=0;a<i.length;a++){const o=i[a];if(typeof o!="string"&&!Array.isArray(o)){for(const s in o)if(s!=="default"&&!(s in t)){const c=Object.getOwnPropertyDescriptor(o,s);c&&Object.defineProperty(t,s,c.get?c:{enumerable:!0,get:()=>o[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function a(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(s){if(s.ep)return;s.ep=!0;const c=a(s);fetch(s.href,c)}})();var Oz=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function mm(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Ph={exports:{}},cl={};var Cv;function UT(){if(Cv)return cl;Cv=1;var t=Symbol.for("react.transitional.element"),i=Symbol.for("react.fragment");function a(o,s,c){var u=null;if(c!==void 0&&(u=""+c),s.key!==void 0&&(u=""+s.key),"key"in s){c={};for(var d in s)d!=="key"&&(c[d]=s[d])}else c=s;return s=c.ref,{$$typeof:t,type:o,key:u,ref:s!==void 0?s:null,props:c}}return cl.Fragment=i,cl.jsx=a,cl.jsxs=a,cl}var Rv;function FT(){return Rv||(Rv=1,Ph.exports=UT()),Ph.exports}var b=FT(),Uh={exports:{}},Ue={};var Mv;function VT(){if(Mv)return Ue;Mv=1;var t=Symbol.for("react.transitional.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),g=Symbol.for("react.activity"),x=Symbol.for("react.view_transition"),v=Symbol.iterator;function w(U){return U===null||typeof U!="object"?null:(U=v&&U[v]||U["@@iterator"],typeof U=="function"?U:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},T=Object.assign,S={};function E(U,te,he){this.props=U,this.context=te,this.refs=S,this.updater=he||A}E.prototype.isReactComponent={},E.prototype.setState=function(U,te){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,te,"setState")},E.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function C(){}C.prototype=E.prototype;function R(U,te,he){this.props=U,this.context=te,this.refs=S,this.updater=he||A}var _=R.prototype=new C;_.constructor=R,T(_,E.prototype),_.isPureReactComponent=!0;var N=Array.isArray;function j(){}var z={H:null,A:null,T:null,S:null},B=Object.prototype.hasOwnProperty;function I(U,te,he){var ve=he.ref;return{$$typeof:t,type:U,key:te,ref:ve!==void 0?ve:null,props:he}}function X(U,te){return I(U.type,te,U.props)}function oe(U){return typeof U=="object"&&U!==null&&U.$$typeof===t}function Y(U){var te={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(he){return te[he]})}var P=/\/+/g;function M(U,te){return typeof U=="object"&&U!==null&&U.key!=null?Y(""+U.key):te.toString(36)}function V(U){switch(U.status){case"fulfilled":return U.value;case"rejected":throw U.reason;default:switch(typeof U.status=="string"?U.then(j,j):(U.status="pending",U.then(function(te){U.status==="pending"&&(U.status="fulfilled",U.value=te)},function(te){U.status==="pending"&&(U.status="rejected",U.reason=te)})),U.status){case"fulfilled":return U.value;case"rejected":throw U.reason}}throw U}function $(U,te,he,ve,le){var be=typeof U;(be==="undefined"||be==="boolean")&&(U=null);var xe=!1;if(U===null)xe=!0;else switch(be){case"bigint":case"string":case"number":xe=!0;break;case"object":switch(U.$$typeof){case t:case i:xe=!0;break;case y:return xe=U._init,$(xe(U._payload),te,he,ve,le)}}if(xe)return le=le(U),xe=ve===""?"."+M(U,0):ve,N(le)?(he="",xe!=null&&(he=xe.replace(P,"$&/")+"/"),$(le,te,he,"",function(ye){return ye})):le!=null&&(oe(le)&&(le=X(le,he+(le.key==null||U&&U.key===le.key?"":(""+le.key).replace(P,"$&/")+"/")+xe)),te.push(le)),1;xe=0;var de=ve===""?".":ve+":";if(N(U))for(var ae=0;ae<U.length;ae++)ve=U[ae],be=de+M(ve,ae),xe+=$(ve,te,he,be,le);else if(ae=w(U),typeof ae=="function")for(U=ae.call(U),ae=0;!(ve=U.next()).done;)ve=ve.value,be=de+M(ve,ae++),xe+=$(ve,te,he,be,le);else if(be==="object"){if(typeof U.then=="function")return $(V(U),te,he,ve,le);throw te=String(U),Error("Objects are not valid as a React child (found: "+(te==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":te)+"). If you meant to render a collection of children, use an array instead.")}return xe}function Z(U,te,he){if(U==null)return U;var ve=[],le=0;return $(U,ve,"","",function(be){return te.call(he,be,le++)}),ve}function me(U){if(U._status===-1){var te=U._result,he=te();he.then(function(ve){(U._status===0||U._status===-1)&&(U._status=1,U._result=ve,he.status===void 0&&(he.status="fulfilled",he.value=ve))},function(ve){(U._status===0||U._status===-1)&&(U._status=2,U._result=ve,he.status===void 0&&(he.status="rejected",he.reason=ve))}),U._status===-1&&(U._status=0,U._result=he)}if(U._status===1)return U._result.default;throw U._result}var q=typeof reportError=="function"?reportError:function(U){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var te=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof U=="object"&&U!==null&&typeof U.message=="string"?String(U.message):String(U),error:U});if(!window.dispatchEvent(te))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",U);return}console.error(U)};function ze(U){var te=z.T,he={};he.types=te!==null?te.types:null,z.T=he;try{var ve=U(),le=z.S;le!==null&&le(he,ve),typeof ve=="object"&&ve!==null&&typeof ve.then=="function"&&ve.then(j,q)}catch(be){q(be)}finally{te!==null&&he.types!==null&&(te.types=he.types),z.T=te}}function ge(U){var te=z.T;if(te!==null){var he=te.types;he===null?te.types=[U]:he.indexOf(U)===-1&&he.push(U)}else ze(ge.bind(null,U))}var H={map:Z,forEach:function(U,te,he){Z(U,function(){te.apply(this,arguments)},he)},count:function(U){var te=0;return Z(U,function(){te++}),te},toArray:function(U){return Z(U,function(te){return te})||[]},only:function(U){if(!oe(U))throw Error("React.Children.only expected to receive a single React element child.");return U}};return Ue.Activity=g,Ue.Children=H,Ue.Component=E,Ue.Fragment=a,Ue.Profiler=s,Ue.PureComponent=R,Ue.StrictMode=o,Ue.Suspense=p,Ue.ViewTransition=x,Ue.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=z,Ue.__COMPILER_RUNTIME={__proto__:null,c:function(U){return z.H.useMemoCache(U)}},Ue.addTransitionType=ge,Ue.cache=function(U){return function(){return U.apply(null,arguments)}},Ue.cacheSignal=function(){return null},Ue.cloneElement=function(U,te,he){if(U==null)throw Error("The argument must be a React element, but you passed "+U+".");var ve=T({},U.props),le=U.key;if(te!=null)for(be in te.key!==void 0&&(le=""+te.key),te)!B.call(te,be)||be==="key"||be==="__self"||be==="__source"||be==="ref"&&te.ref===void 0||(ve[be]=te[be]);var be=arguments.length-2;if(be===1)ve.children=he;else if(1<be){for(var xe=Array(be),de=0;de<be;de++)xe[de]=arguments[de+2];ve.children=xe}return I(U.type,le,ve)},Ue.createContext=function(U){return U={$$typeof:u,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null},U.Provider=U,U.Consumer={$$typeof:c,_context:U},U},Ue.createElement=function(U,te,he){var ve,le={},be=null;if(te!=null)for(ve in te.key!==void 0&&(be=""+te.key),te)B.call(te,ve)&&ve!=="key"&&ve!=="__self"&&ve!=="__source"&&(le[ve]=te[ve]);var xe=arguments.length-2;if(xe===1)le.children=he;else if(1<xe){for(var de=Array(xe),ae=0;ae<xe;ae++)de[ae]=arguments[ae+2];le.children=de}if(U&&U.defaultProps)for(ve in xe=U.defaultProps,xe)le[ve]===void 0&&(le[ve]=xe[ve]);return I(U,be,le)},Ue.createRef=function(){return{current:null}},Ue.forwardRef=function(U){return{$$typeof:d,render:U}},Ue.isValidElement=oe,Ue.lazy=function(U){return{$$typeof:y,_payload:{_status:-1,_result:U},_init:me}},Ue.memo=function(U,te){return{$$typeof:f,type:U,compare:te===void 0?null:te}},Ue.startTransition=ze,Ue.unstable_useCacheRefresh=function(){return z.H.useCacheRefresh()},Ue.use=function(U){return z.H.use(U)},Ue.useActionState=function(U,te,he){return z.H.useActionState(U,te,he)},Ue.useCallback=function(U,te){return z.H.useCallback(U,te)},Ue.useContext=function(U){return z.H.useContext(U)},Ue.useDebugValue=function(){},Ue.useDeferredValue=function(U,te){return z.H.useDeferredValue(U,te)},Ue.useEffect=function(U,te){return z.H.useEffect(U,te)},Ue.useEffectEvent=function(U){return z.H.useEffectEvent(U)},Ue.useId=function(){return z.H.useId()},Ue.useImperativeHandle=function(U,te,he){return z.H.useImperativeHandle(U,te,he)},Ue.useInsertionEffect=function(U,te){return z.H.useInsertionEffect(U,te)},Ue.useLayoutEffect=function(U,te){return z.H.useLayoutEffect(U,te)},Ue.useMemo=function(U,te){return z.H.useMemo(U,te)},Ue.useOptimistic=function(U,te){return z.H.useOptimistic(U,te)},Ue.useReducer=function(U,te,he){return z.H.useReducer(U,te,he)},Ue.useRef=function(U){return z.H.useRef(U)},Ue.useState=function(U){return z.H.useState(U)},Ue.useSyncExternalStore=function(U,te,he){return z.H.useSyncExternalStore(U,te,he)},Ue.useTransition=function(){return z.H.useTransition()},Ue.version="19.3.0",Ue}var Nv;function pm(){return Nv||(Nv=1,Uh.exports=VT()),Uh.exports}var L=pm();const $T=mm(L),Dw=PT({__proto__:null,default:$T},[L]);var Fh={exports:{}},Zt={};var Dv;function GT(){if(Dv)return Zt;Dv=1;var t=pm();function i(y){var g="https://react.dev/errors/"+y;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)g+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+y+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function a(){}var o={d:{f:a,r:function(){throw Error(i(522))},D:a,C:a,L:a,m:a,X:a,S:a,M:a},p:0,findDOMNode:null},s=Symbol.for("react.portal"),c=Symbol.for("react.recoverable"),u=Symbol.for("react.optimistic_key");function d(y,g,x){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:s,key:v==null?null:v===u?u:""+v,children:y,containerInfo:g,implementation:x}}var p=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function f(y,g){if(y==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return Zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Zt.browser=function(y){return{$$typeof:c,_reason:y}},Zt.createPortal=function(y,g){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(i(299));return d(y,g,null,x)},Zt.flushSync=function(y){var g=p.T,x=o.p;try{if(p.T=null,o.p=2,y)return y()}finally{p.T=g,o.p=x,o.d.f()}},Zt.preconnect=function(y,g){typeof y=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,o.d.C(y,g))},Zt.prefetchDNS=function(y){typeof y=="string"&&o.d.D(y)},Zt.preinit=function(y,g){if(typeof y=="string"&&g&&typeof g.as=="string"){var x=g.as,v=f(x,g.crossOrigin),w=typeof g.integrity=="string"?g.integrity:void 0,A=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;x==="style"?o.d.S(y,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:v,integrity:w,fetchPriority:A}):x==="script"&&o.d.X(y,{crossOrigin:v,integrity:w,fetchPriority:A,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},Zt.preinitModule=function(y,g){if(typeof y=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var x=f(g.as,g.crossOrigin);o.d.M(y,{crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}}else g==null&&o.d.M(y)},Zt.preload=function(y,g){if(typeof y=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var x=g.as,v=f(x,g.crossOrigin);o.d.L(y,x,{crossOrigin:v,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},Zt.preloadModule=function(y,g){if(typeof y=="string")if(g){var x=f(g.as,g.crossOrigin);o.d.m(y,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}else o.d.m(y)},Zt.requestFormReset=function(y){o.d.r(y)},Zt.unstable_batchedUpdates=function(y,g){return y(g)},Zt.useFormState=function(y,g,x){return p.H.useFormState(y,g,x)},Zt.useFormStatus=function(){return p.H.useHostTransitionStatus()},Zt.version="19.3.0",Zt}var jv;function jw(){if(jv)return Fh.exports;jv=1;function t(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)}catch(i){console.error(i)}}return t(),Fh.exports=GT(),Fh.exports}var oo=jw();const YT={};function gm(t,i){const a=YT,o=typeof a.includeImageAlt=="boolean"?a.includeImageAlt:!0,s=typeof a.includeHtml=="boolean"?a.includeHtml:!0;return Ow(t,o,s)}function Ow(t,i,a){if(JT(t)){if("value"in t)return t.type==="html"&&!a?"":t.value;if(i&&"alt"in t&&t.alt)return t.alt;if("children"in t)return Ov(t.children,i,a)}return Array.isArray(t)?Ov(t,i,a):""}function Ov(t,i,a){const o=[];let s=-1;for(;++s<t.length;)o[s]=Ow(t[s],i,a);return o.join("")}function JT(t){return!!(t&&typeof t=="object")}const Lv=document.createElement("i");function kl(t){const i="&"+t+";";Lv.innerHTML=i;const a=Lv.textContent;return a.charCodeAt(a.length-1)===59&&t!=="semi"||a===i?!1:a}function ei(t,i,a,o){const s=t.length;let c=0,u;if(i<0?i=-i>s?0:s+i:i=i>s?s:i,a=a>0?a:0,o.length<1e4)u=Array.from(o),u.unshift(i,a),t.splice(...u);else for(a&&t.splice(i,a);c<o.length;)u=o.slice(c,c+1e4),u.unshift(i,0),t.splice(...u),c+=1e4,i+=1e4}function Fn(t,i){return t.length>0?(ei(t,t.length,0,i),t):i}const zv={}.hasOwnProperty;function Lw(t){const i={};let a=-1;for(;++a<t.length;)XT(i,t[a]);return i}function XT(t,i){let a;for(a in i){const s=(zv.call(t,a)?t[a]:void 0)||(t[a]={}),c=i[a];let u;if(c)for(u in c){zv.call(s,u)||(s[u]=[]);const d=c[u];ZT(s[u],Array.isArray(d)?d:d?[d]:[])}}}function ZT(t,i){let a=-1;const o=[];for(;++a<i.length;)(i[a].add==="after"?t:o).push(i[a]);ei(t,0,0,o)}function zw(t,i){const a=Number.parseInt(t,i);return a<9||a===11||a>13&&a<32||a>126&&a<160||a>55295&&a<57344||a>64975&&a<65008||(a&65535)===65535||(a&65535)===65534||a>1114111?"�":String.fromCodePoint(a)}function ti(t){return t.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}const rn=Aa(/[A-Za-z]/),Wt=Aa(/[\dA-Za-z]/),KT=Aa(/[#-'*+\--9=?A-Z^-~]/);function ku(t){return t!==null&&(t<32||t===127)}const Bf=Aa(/\d/),QT=Aa(/[\dA-Fa-f]/),WT=Aa(/[!-/:-@[-`{-~]/);function Ce(t){return t!==null&&t<-2}function We(t){return t!==null&&(t<0||t===32)}function Fe(t){return t===-2||t===-1||t===32}const ka=Aa(new RegExp("\\p{P}|\\p{S}","u")),Ht=Aa(/\s/);function Aa(t){return i;function i(a){return a!==null&&a>-1&&t.test(String.fromCharCode(a))}}function ho(t){const i=[];let a=-1,o=0,s=0;for(;++a<t.length;){const c=t.charCodeAt(a);let u="";if(c===37&&Wt(t.charCodeAt(a+1))&&Wt(t.charCodeAt(a+2)))s=2;else if(c<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(c))||(u=String.fromCharCode(c));else if(c>55295&&c<57344){const d=t.charCodeAt(a+1);c<56320&&d>56319&&d<57344?(u=String.fromCharCode(c,d),s=1):u="�"}else u=String.fromCharCode(c);u&&(i.push(t.slice(o,a),encodeURIComponent(u)),o=a+s+1,u=""),s&&(a+=s,s=0)}return i.join("")+t.slice(o)}function Ve(t,i,a,o){const s=o?o-1:1/0;let c=0;return u;function u(p){return Fe(p)?(t.enter(a),d(p)):i(p)}function d(p){return Fe(p)&&c++<s?(t.consume(p),d):(t.exit(a),i(p))}}function _w(t,i,a,o,s,c){let u=0;return d;function d(y){return Fe(y)?(t.enter(o),p(y)):f(y)}function p(y){return Fe(y)&&u<c?(t.consume(y),u++,p):(t.exit(o),f(y))}function f(y){return u>=s?i(y):a(y)}}const eA={tokenize:tA};function tA(t){const i=t.attempt(this.parser.constructs.contentInitial,o,s);let a;return i;function o(d){if(d===null){t.consume(d);return}return t.enter("lineEnding"),t.consume(d),t.exit("lineEnding"),Ve(t,i,"linePrefix")}function s(d){return t.enter("paragraph"),c(d)}function c(d){const p=t.enter("chunkText",{contentType:"text",previous:a});return a&&(a.next=p),a=p,u(d)}function u(d){if(d===null){t.exit("chunkText"),t.exit("paragraph"),t.consume(d);return}return Ce(d)?(t.consume(d),t.exit("chunkText"),c):(t.consume(d),u)}}let Tu=class{constructor(){this.index=new Map,this.map=[]}add(i,a,o){_v(this,i,a,o,!1)}addBefore(i,a,o){_v(this,i,a,o,!0)}consume(i){if(this.map.sort(function(c,u){return c[0]-u[0]}),this.map.length===0)return;let a=this.map.length;const o=[];for(;a>0;)a-=1,o.push(i.slice(this.map[a][0]+this.map[a][1]),this.map[a][2]),i.length=this.map[a][0];o.push(i.slice()),i.length=0;let s=o.pop();for(;s;){for(const c of s)i.push(c);s=o.pop()}this.map.length=0,this.index.clear()}};function _v(t,i,a,o,s){if(a===0&&o.length===0)return;const c=t.index.get(i);if(c){c[1]+=a,s?(o.push(...c[2]),c[2]=o):c[2].push(...o);return}const u=[i,a,o];t.map.push(u),t.index.set(i,u)}const nA={tokenize:iA},Iv={tokenize:aA};function iA(t){const i=this,a=[];let o=0,s,c,u;return d;function d(C){if(o<a.length){const R=a[o];return i.containerState=R[1],t.attempt(R[0].continuation,p,f)(C)}return f(C)}function p(C){if(o++,i.containerState._closeFlow){i.containerState._closeFlow=void 0,s&&E();const R=i.events.length;let _=R,N;for(;_--;)if(i.events[_][0]==="exit"&&i.events[_][1].type==="chunkFlow"){N=i.events[_][1].end;break}S(o);let j=R;for(;j<i.events.length;)i.events[j][1].end={...N},j++;const z=new Tu;return z.add(_+1,0,i.events.slice(R)),z.add(R,j-R,[]),z.consume(i.events),f(C)}return d(C)}function f(C){if(o===a.length){if(!s)return x(C);if(s.currentConstruct&&s.currentConstruct.concrete)return w(C);i.interrupt=!!(s.currentConstruct&&!s._gfmTableDynamicInterruptHack)}return i.containerState={},t.check(Iv,y,g)(C)}function y(C){return s&&E(),S(o),x(C)}function g(C){return i.parser.lazy[i.now().line]=o!==a.length,u=i.now().offset,w(C)}function x(C){return i.containerState={},t.attempt(Iv,v,w)(C)}function v(C){return o++,a.push([i.currentConstruct,i.containerState]),x(C)}function w(C){if(C===null){s&&E(),S(0),t.consume(C);return}return s=s||i.parser.flow(i.now()),t.enter("chunkFlow",{_tokenizer:s,contentType:"flow",previous:c}),A(C)}function A(C){if(C===null){T(t.exit("chunkFlow"),!0),S(0),t.consume(C);return}return Ce(C)?(t.consume(C),T(t.exit("chunkFlow")),o=0,i.interrupt=void 0,d):(t.consume(C),A)}function T(C,R){const _=i.sliceStream(C);if(R&&_.push(null),C.previous=c,c&&(c.next=C),c=C,s.defineSkip(C.start),s.write(_),i.parser.lazy[C.start.line]){let N=s.events.length;for(;N--;)if(s.events[N][1].start.offset<u&&(!s.events[N][1].end||s.events[N][1].end.offset>u))return;const j=i.events.length;let z=j,B,I;for(;z--;)if(i.events[z][0]==="exit"&&i.events[z][1].type==="chunkFlow"){if(B){I=i.events[z][1].end;break}B=!0}for(S(o),N=j;N<i.events.length;)i.events[N][1].end={...I},N++;const X=new Tu;X.add(z+1,0,i.events.slice(j)),X.add(j,N-j,[]),X.consume(i.events)}}function S(C){let R=a.length;for(;R-- >C;){const _=a[R];i.containerState=_[1],_[0].exit.call(i,t)}a.length=C}function E(){s.write([null]),c=void 0,s=void 0,i.containerState._closeFlow=void 0}}function aA(t,i,a){return Ve(t,t.attempt(this.parser.constructs.document,i,a),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function Au(t){if(t===null||We(t)||Ht(t))return 1;if(ka(t))return 2}function Ju(t,i,a){const o=[];let s=-1;for(;++s<t.length;){const c=t[s].resolveAll;c&&!o.includes(c)&&(i=c(i,a),o.push(c))}return i}const qf={name:"attention",resolveAll:rA,tokenize:oA};function rA(t,i){let a=-1,o;for(;++a<t.length;)if(t[a][0]==="enter"&&t[a][1].type==="attentionSequence"&&t[a][1]._close){let s=a;for(;s--;)if(t[s][0]==="exit"&&t[s][1].type==="attentionSequence"&&t[s][1]._open&&i.sliceSerialize(t[s][1]).charCodeAt(0)===i.sliceSerialize(t[a][1]).charCodeAt(0)){if((t[s][1]._close||t[a][1]._open)&&(t[a][1].end.offset-t[a][1].start.offset)%3&&!((t[s][1].end.offset-t[s][1].start.offset+t[a][1].end.offset-t[a][1].start.offset)%3))continue;const c=t[s][1].end.offset-t[s][1].start.offset>1&&t[a][1].end.offset-t[a][1].start.offset>1?2:1,u={...t[s][1].end},d={...t[a][1].start};Hv(u,-c),Hv(d,c);const p={type:c>1?"strongSequence":"emphasisSequence",start:u,end:{...t[s][1].end}},f={type:c>1?"strongSequence":"emphasisSequence",start:{...t[a][1].start},end:d},y={type:c>1?"strongText":"emphasisText",start:{...t[s][1].end},end:{...t[a][1].start}},g={type:c>1?"strong":"emphasis",start:{...p.start},end:{...f.end}};t[s][1].end={...p.start},t[a][1].start={...f.end},o=[],t[s][1].end.offset-t[s][1].start.offset&&(o=Fn(o,[["enter",t[s][1],i],["exit",t[s][1],i]])),o=Fn(o,[["enter",g,i],["enter",p,i],["exit",p,i],["enter",y,i]]),o=Fn(o,Ju(i.parser.constructs.insideSpan.null,t.slice(s+1,a),i)),o=Fn(o,[["exit",y,i],["enter",f,i],["exit",f,i],["exit",g,i]]);let x=0;t[a][1].end.offset-t[a][1].start.offset&&(x=2,o=Fn(o,[["enter",t[a][1],i],["exit",t[a][1],i]])),ei(t,s-1,a-s+3,o),a=s+o.length-x-2;break}}for(a=-1;++a<t.length;)t[a][1].type==="attentionSequence"&&(t[a][1].type="data");return t}function oA(t,i){const a=this.parser.constructs.attentionMarkers.null,o=this.previous,s=Au(o);let c;return u;function u(p){return c=p,t.enter("attentionSequence"),d(p)}function d(p){if(p===c)return t.consume(p),d;const f=t.exit("attentionSequence"),y=Au(p),g=!y||y===2&&s||a.includes(p)&&p!==42&&p!==95,x=!s||s===2&&y||a.includes(o)&&o!==42&&o!==95;return f._open=!!(c===42?g:g&&(s||!x)),f._close=!!(c===42?x:x&&(y||!g)),i(p)}}function Hv(t,i){t.column+=i,t.offset+=i,t._bufferIndex+=i}const lA={name:"autolink",tokenize:sA};function sA(t,i,a){let o=0;return s;function s(v){return t.enter("autolink"),t.enter("autolinkMarker"),t.consume(v),t.exit("autolinkMarker"),t.enter("autolinkProtocol"),c}function c(v){return rn(v)?(t.consume(v),u):v===64?a(v):f(v)}function u(v){return v===43||v===45||v===46||Wt(v)?(o=1,d(v)):f(v)}function d(v){return v===58?(t.consume(v),o=0,p):(v===43||v===45||v===46||Wt(v))&&o++<32?(t.consume(v),d):(o=0,f(v))}function p(v){return v===62?(t.exit("autolinkProtocol"),t.enter("autolinkMarker"),t.consume(v),t.exit("autolinkMarker"),t.exit("autolink"),i):v===null||v===32||v===60||ku(v)?a(v):(t.consume(v),p)}function f(v){return v===64?(t.consume(v),y):KT(v)?(t.consume(v),f):a(v)}function y(v){return Wt(v)?g(v):a(v)}function g(v){return v===46?(t.consume(v),o=0,y):v===62?(t.exit("autolinkProtocol").type="autolinkEmail",t.enter("autolinkMarker"),t.consume(v),t.exit("autolinkMarker"),t.exit("autolink"),i):x(v)}function x(v){if((v===45||Wt(v))&&o++<63){const w=v===45?x:g;return t.consume(v),w}return a(v)}}const Rl={partial:!0,tokenize:uA};function uA(t,i,a){return o;function o(c){return Fe(c)?Ve(t,s,"linePrefix")(c):s(c)}function s(c){return c===null||Ce(c)?i(c):a(c)}}const Iw={continuation:{tokenize:dA},exit:hA,name:"blockQuote",tokenize:cA};function cA(t,i,a){const o=this;return s;function s(u){if(u===62){const d=o.containerState;return d.open||(t.enter("blockQuote",{_container:!0}),d.open=!0),t.enter("blockQuotePrefix"),t.enter("blockQuoteMarker"),t.consume(u),t.exit("blockQuoteMarker"),c}return a(u)}function c(u){return Fe(u)?(t.enter("blockQuotePrefixWhitespace"),t.consume(u),t.exit("blockQuotePrefixWhitespace"),t.exit("blockQuotePrefix"),i):(t.exit("blockQuotePrefix"),i(u))}}function dA(t,i,a){const o=this;return s;function s(u){return Fe(u)?Ve(t,c,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(u):c(u)}function c(u){return t.attempt(Iw,i,a)(u)}}function hA(t){t.exit("blockQuote")}const Hw={name:"characterEscape",tokenize:fA};function fA(t,i,a){return o;function o(c){return t.enter("characterEscape"),t.enter("escapeMarker"),t.consume(c),t.exit("escapeMarker"),s}function s(c){return WT(c)?(t.enter("characterEscapeValue"),t.consume(c),t.exit("characterEscapeValue"),t.exit("characterEscape"),i):a(c)}}const Bw={name:"characterReference",tokenize:mA};function mA(t,i,a){const o=this;let s=0,c,u;return d;function d(g){return t.enter("characterReference"),t.enter("characterReferenceMarker"),t.consume(g),t.exit("characterReferenceMarker"),p}function p(g){return g===35?(t.enter("characterReferenceMarkerNumeric"),t.consume(g),t.exit("characterReferenceMarkerNumeric"),f):(t.enter("characterReferenceValue"),c=31,u=Wt,y(g))}function f(g){return g===88||g===120?(t.enter("characterReferenceMarkerHexadecimal"),t.consume(g),t.exit("characterReferenceMarkerHexadecimal"),t.enter("characterReferenceValue"),c=6,u=QT,y):(t.enter("characterReferenceValue"),c=7,u=Bf,y(g))}function y(g){if(g===59&&s){const x=t.exit("characterReferenceValue");return u===Wt&&!kl(o.sliceSerialize(x))?a(g):(t.enter("characterReferenceMarker"),t.consume(g),t.exit("characterReferenceMarker"),t.exit("characterReference"),i)}return u(g)&&s++<c?(t.consume(g),y):a(g)}}const Pf={partial:!0,tokenize:pA};function pA(t,i,a){const o=this;return s;function s(u){return u===null?a(u):(t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),c)}function c(u){return o.parser.lazy[o.now().line]?a(u):i(u)}}const Bv={concrete:!0,name:"codeFenced",tokenize:gA};function gA(t,i,a){const o=this,s={partial:!0,tokenize:_};let c=0,u=0,d;return p;function p(N){return f(N)}function f(N){const j=o.events[o.events.length-1];return c=j&&j[1].type==="linePrefix"?j[2].sliceSerialize(j[1],!0).length:0,d=N,t.enter("codeFenced"),t.enter("codeFencedFence"),t.enter("codeFencedFenceSequence"),y(N)}function y(N){return N===d?(u++,t.consume(N),y):u<3?a(N):(t.exit("codeFencedFenceSequence"),Fe(N)?Ve(t,g,"whitespace")(N):g(N))}function g(N){return N===null||Ce(N)?(t.exit("codeFencedFence"),o.interrupt?i(N):t.check(Pf,A,R)(N)):(t.enter("codeFencedFenceInfo"),t.enter("chunkString",{contentType:"string"}),x(N))}function x(N){return N===null||Ce(N)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),g(N)):Fe(N)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),Ve(t,v,"whitespace")(N)):N===96&&N===d?a(N):(t.consume(N),x)}function v(N){return N===null||Ce(N)?g(N):(t.enter("codeFencedFenceMeta"),t.enter("chunkString",{contentType:"string"}),w(N))}function w(N){return N===null||Ce(N)?(t.exit("chunkString"),t.exit("codeFencedFenceMeta"),g(N)):N===96&&N===d?a(N):(t.consume(N),w)}function A(N){return t.attempt(s,R,T)(N)}function T(N){return t.enter("lineEnding"),t.consume(N),t.exit("lineEnding"),S}function S(N){return c>0&&Fe(N)?Ve(t,E,"linePrefix",c+1)(N):E(N)}function E(N){return N===null||Ce(N)?t.check(Pf,A,R)(N):(t.enter("codeFlowValue"),C(N))}function C(N){return N===null||Ce(N)?(t.exit("codeFlowValue"),E(N)):(t.consume(N),C)}function R(N){return t.exit("codeFenced"),i(N)}function _(N,j,z){let B=0;return I;function I(M){return N.enter("lineEnding"),N.consume(M),N.exit("lineEnding"),X}function X(M){return N.enter("codeFencedFence"),Fe(M)?Ve(N,oe,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(M):oe(M)}function oe(M){return M===d?(N.enter("codeFencedFenceSequence"),Y(M)):z(M)}function Y(M){return M===d?(B++,N.consume(M),Y):B>=u?(N.exit("codeFencedFenceSequence"),Fe(M)?Ve(N,P,"whitespace")(M):P(M)):z(M)}function P(M){return M===null||Ce(M)?(N.exit("codeFencedFence"),j(M)):z(M)}}}const Vh={name:"codeIndented",tokenize:bA},yA={partial:!0,tokenize:vA};function bA(t,i,a){return o;function o(d){return t.enter("codeIndented"),_w(t,s,a,"linePrefix",4,4)(d)}function s(d){return d===null?u(d):Ce(d)?t.attempt(yA,s,u)(d):(t.enter("codeFlowValue"),c(d))}function c(d){return d===null||Ce(d)?(t.exit("codeFlowValue"),s(d)):(t.consume(d),c)}function u(d){return t.exit("codeIndented"),i(d)}}function vA(t,i,a){const o=this;return s;function s(u){return o.parser.lazy[o.now().line]?a(u):Ce(u)?(t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),s):_w(t,i,c,"linePrefix",4,4)(u)}function c(u){return Ce(u)?s(u):a(u)}}const xA={name:"codeText",previous:SA,resolve:wA,tokenize:kA};function wA(t){let i=t.length-4,a=3,o,s;if((t[a][1].type==="lineEnding"||t[a][1].type==="space")&&(t[i][1].type==="lineEnding"||t[i][1].type==="space")){for(o=a;++o<i;)if(t[o][1].type==="codeTextData"){t[a][1].type="codeTextPadding",t[i][1].type="codeTextPadding",a+=2,i-=2;break}}for(o=a-1,i++;++o<=i;)s===void 0?o!==i&&t[o][1].type!=="lineEnding"&&(s=o):(o===i||t[o][1].type==="lineEnding")&&(t[s][1].type="codeTextData",o!==s+2&&(t[s][1].end=t[o-1][1].end,t.splice(s+2,o-s-2),i-=o-s-2,o=s+2),s=void 0);return t}function SA(t){return t!==96||this.events[this.events.length-1][1].type==="characterEscape"}function kA(t,i,a){let o=0,s,c;return u;function u(g){return t.enter("codeText"),t.enter("codeTextSequence"),d(g)}function d(g){return g===96?(t.consume(g),o++,d):(t.exit("codeTextSequence"),p(g))}function p(g){return g===null?a(g):g===32?(t.enter("space"),t.consume(g),t.exit("space"),p):g===96?(c=t.enter("codeTextSequence"),s=0,y(g)):Ce(g)?(t.enter("lineEnding"),t.consume(g),t.exit("lineEnding"),p):(t.enter("codeTextData"),f(g))}function f(g){return g===null||g===32||g===96||Ce(g)?(t.exit("codeTextData"),p(g)):(t.consume(g),f)}function y(g){return g===96?(t.consume(g),s++,y):s===o?(t.exit("codeTextSequence"),t.exit("codeText"),i(g)):(c.type="codeTextData",f(g))}}class TA{constructor(i){this.left=i?[...i]:[],this.right=[]}get(i){if(i<0||i>=this.left.length+this.right.length)throw new RangeError("Cannot access index `"+i+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return i<this.left.length?this.left[i]:this.right[this.right.length-i+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(i,a){const o=a??Number.POSITIVE_INFINITY;return o<this.left.length?this.left.slice(i,o):i>this.left.length?this.right.slice(this.right.length-o+this.left.length,this.right.length-i+this.left.length).reverse():this.left.slice(i).concat(this.right.slice(this.right.length-o+this.left.length).reverse())}splice(i,a,o){const s=a||0;this.setCursor(Math.trunc(i));const c=this.right.splice(this.right.length-s,Number.POSITIVE_INFINITY);return o&&dl(this.left,o),c.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(i){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(i)}pushMany(i){this.setCursor(Number.POSITIVE_INFINITY),dl(this.left,i)}unshift(i){this.setCursor(0),this.right.push(i)}unshiftMany(i){this.setCursor(0),dl(this.right,i.reverse())}setCursor(i){if(!(i===this.left.length||i>this.left.length&&this.right.length===0||i<0&&this.left.length===0))if(i<this.left.length){const a=this.left.splice(i,Number.POSITIVE_INFINITY);dl(this.right,a.reverse())}else{const a=this.right.splice(this.left.length+this.right.length-i,Number.POSITIVE_INFINITY);dl(this.left,a.reverse())}}}function dl(t,i){let a=0;if(i.length<1e4)t.push(...i);else for(;a<i.length;)t.push(...i.slice(a,a+1e4)),a+=1e4}function qw(t){const i={};let a=-1,o,s,c,u,d,p,f;const y=new TA(t);for(;++a<y.length;){for(;a in i;)a=i[a];if(o=y.get(a),a&&o[1].type==="chunkFlow"&&y.get(a-1)[1].type==="listItemPrefix"&&(p=o[1]._tokenizer.events,c=0,c<p.length&&p[c][1].type==="lineEndingBlank"&&(c+=2),c<p.length&&p[c][1].type==="content"))for(;++c<p.length&&p[c][1].type!=="content";)p[c][1].type==="chunkText"&&(p[c][1]._isInFirstContentOfListItem=!0,c++);if(o[0]==="enter")o[1].contentType&&(Object.assign(i,AA(y,a)),a=i[a],f=!0);else if(o[1]._container){for(c=a,s=void 0;c--;)if(u=y.get(c),u[1].type==="lineEnding"||u[1].type==="lineEndingBlank")u[0]==="enter"&&(s&&(y.get(s)[1].type="lineEndingBlank"),u[1].type="lineEnding",s=c);else if(!(u[1].type==="linePrefix"||u[1].type==="listItemIndent"))break;s&&(o[1].end={...y.get(s)[1].start},d=y.slice(s,a),d.unshift(o),y.splice(s,a-s+1,d))}}return ei(t,0,Number.POSITIVE_INFINITY,y.slice(0)),!f}function AA(t,i){const a=t.get(i)[1],o=t.get(i)[2];let s=i-1;const c=[];let u=a._tokenizer;u||(u=o.parser[a.contentType](a.start),a._contentTypeTextTrailing&&(u._contentTypeTextTrailing=!0));const d=u.events,p=[],f={};let y,g,x=-1,v=a,w=0,A=0;const T=[A];for(;v;){for(;t.get(++s)[1]!==v;);c.push(s),v._tokenizer||(y=o.sliceStream(v),v.next||y.push(null),g&&u.defineSkip(v.start),v._isInFirstContentOfListItem&&(u._gfmTasklistFirstContentOfListItem=!0),u.write(y),v._isInFirstContentOfListItem&&(u._gfmTasklistFirstContentOfListItem=void 0)),g=v,v=v.next}for(v=a;++x<d.length;)d[x][0]==="exit"&&d[x-1][0]==="enter"&&d[x][1].type===d[x-1][1].type&&d[x][1].start.line!==d[x][1].end.line&&(A=x+1,T.push(A),v._tokenizer=void 0,v.previous=void 0,v=v.next);for(u.events=[],v?(v._tokenizer=void 0,v.previous=void 0):T.pop(),x=T.length;x--;){const S=d.slice(T[x],T[x+1]),E=c.pop();p.push([E,E+S.length-1]),t.splice(E,2,S)}for(p.reverse(),x=-1;++x<p.length;)f[w+p[x][0]]=w+p[x][1],w+=p[x][1]-p[x][0]-1;return f}const EA={resolve:RA,tokenize:MA},CA={partial:!0,tokenize:NA};function RA(t){return qw(t),t}function MA(t,i){let a;return o;function o(d){return t.enter("content"),a=t.enter("chunkContent",{contentType:"content"}),s(d)}function s(d){return d===null?c(d):Ce(d)?t.check(CA,u,c)(d):(t.consume(d),s)}function c(d){return t.exit("chunkContent"),t.exit("content"),i(d)}function u(d){return t.consume(d),t.exit("chunkContent"),a.next=t.enter("chunkContent",{contentType:"content",previous:a}),a=a.next,s}}function NA(t,i,a){const o=this;return s;function s(u){return t.exit("chunkContent"),t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),Ve(t,c,"linePrefix")}function c(u){if(u===null||Ce(u))return a(u);const d=o.events[o.events.length-1];return!o.parser.constructs.disable.null.includes("codeIndented")&&d&&d[1].type==="linePrefix"&&d[2].sliceSerialize(d[1],!0).length>=4?i(u):t.interrupt(o.parser.constructs.flow,a,i)(u)}}function Pw(t,i,a,o,s,c,u,d,p){const f=p||Number.POSITIVE_INFINITY;let y=0;return g;function g(S){return S===60?(t.enter(o),t.enter(s),t.enter(c),t.consume(S),t.exit(c),x):S===null||S===32||S===41||ku(S)?a(S):(t.enter(o),t.enter(u),t.enter(d),t.enter("chunkString",{contentType:"string"}),A(S))}function x(S){return S===62?(t.enter(c),t.consume(S),t.exit(c),t.exit(s),t.exit(o),i):(t.enter(d),t.enter("chunkString",{contentType:"string"}),v(S))}function v(S){return S===62?(t.exit("chunkString"),t.exit(d),x(S)):S===null||S===60||Ce(S)?a(S):(t.consume(S),S===92?w:v)}function w(S){return S===60||S===62||S===92?(t.consume(S),v):v(S)}function A(S){return!y&&(S===null||S===41||We(S))?(t.exit("chunkString"),t.exit(d),t.exit(u),t.exit(o),i(S)):y<f&&S===40?(t.consume(S),y++,A):S===41?(t.consume(S),y--,A):S===null||S===32||S===40||ku(S)?a(S):(t.consume(S),S===92?T:A)}function T(S){return S===40||S===41||S===92?(t.consume(S),A):A(S)}}function Uw(t,i,a,o,s,c){const u=this;let d=0,p;return f;function f(v){return t.enter(o),t.enter(s),t.consume(v),t.exit(s),t.enter(c),y}function y(v){return d>999||v===null||v===91||v===93&&!p||v===94&&!d&&"_hiddenFootnoteSupport"in u.parser.constructs?a(v):v===93?(t.exit(c),t.enter(s),t.consume(v),t.exit(s),t.exit(o),i):Ce(v)?(t.enter("lineEnding"),t.consume(v),t.exit("lineEnding"),y):(t.enter("chunkString",{contentType:"string"}),g(v))}function g(v){return v===null||v===91||v===93||Ce(v)||d++>999?(t.exit("chunkString"),y(v)):(t.consume(v),p||(p=!Fe(v)),v===92?x:g)}function x(v){return v===91||v===92||v===93?(t.consume(v),d++,g):g(v)}}function Fw(t,i,a,o,s,c){let u;return d;function d(x){return x===34||x===39||x===40?(t.enter(o),t.enter(s),t.consume(x),t.exit(s),u=x===40?41:x,p):a(x)}function p(x){return x===u?(t.enter(s),t.consume(x),t.exit(s),t.exit(o),i):(t.enter(c),f(x))}function f(x){return x===u?(t.exit(c),p(u)):x===null?a(x):Ce(x)?(t.enter("lineEnding"),t.consume(x),t.exit("lineEnding"),Ve(t,f,"linePrefix")):(t.enter("chunkString",{contentType:"string"}),y(x))}function y(x){return x===u||x===null||Ce(x)?(t.exit("chunkString"),f(x)):(t.consume(x),x===92?g:y)}function g(x){return x===u||x===92?(t.consume(x),y):y(x)}}function zi(t,i){let a;return o;function o(s){return Ce(s)?(t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),a=!0,o):Fe(s)?Ve(t,o,a?"linePrefix":"lineSuffix")(s):i(s)}}const DA={name:"definition",tokenize:OA},jA={partial:!0,tokenize:LA};function OA(t,i,a){const o=this;let s;return c;function c(v){return t.enter("definition"),u(v)}function u(v){return Uw.call(o,t,d,a,"definitionLabel","definitionLabelMarker","definitionLabelString")(v)}function d(v){return s=ti(o.sliceSerialize(o.events[o.events.length-1][1]).slice(1,-1)),v===58?(t.enter("definitionMarker"),t.consume(v),t.exit("definitionMarker"),p):a(v)}function p(v){return We(v)?zi(t,f)(v):f(v)}function f(v){return Pw(t,y,a,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(v)}function y(v){return t.attempt(jA,g,g)(v)}function g(v){return Fe(v)?Ve(t,x,"whitespace")(v):x(v)}function x(v){return v===null||Ce(v)?(t.exit("definition"),o.parser.defined.push(s),i(v)):a(v)}}function LA(t,i,a){return o;function o(d){return We(d)?zi(t,s)(d):a(d)}function s(d){return Fw(t,c,a,"definitionTitle","definitionTitleMarker","definitionTitleString")(d)}function c(d){return Fe(d)?Ve(t,u,"whitespace")(d):u(d)}function u(d){return d===null||Ce(d)?i(d):a(d)}}const zA={name:"hardBreakEscape",tokenize:_A};function _A(t,i,a){return o;function o(c){return t.enter("hardBreakEscape"),t.consume(c),s}function s(c){return Ce(c)?(t.exit("hardBreakEscape"),i(c)):a(c)}}const IA={name:"headingAtx",resolve:HA,tokenize:BA};function HA(t,i){let a=t.length-2,o=3;if(t[o][1].type==="whitespace"&&(o+=2),a-2>o&&t[a][1].type==="whitespace"&&(a-=2),t[a][1].type==="atxHeadingSequence"&&(o===a-1||a-4>o&&t[a-2][1].type==="whitespace")&&(a-=o+1===a?2:4),a>o){const s={type:"atxHeadingText",start:t[o][1].start,end:t[a][1].end},c={type:"chunkText",start:t[o][1].start,end:t[a][1].end,contentType:"text"};ei(t,o,a-o+1,[["enter",s,i],["enter",c,i],["exit",c,i],["exit",s,i]])}return t}function BA(t,i,a){let o=0;return s;function s(y){return t.enter("atxHeading"),c(y)}function c(y){return t.enter("atxHeadingSequence"),u(y)}function u(y){return y===35&&o++<6?(t.consume(y),u):y===null||We(y)?(t.exit("atxHeadingSequence"),d(y)):a(y)}function d(y){return y===35?(t.enter("atxHeadingSequence"),p(y)):y===null||Ce(y)?(t.exit("atxHeading"),i(y)):Fe(y)?Ve(t,d,"whitespace")(y):(t.enter("atxHeadingText"),f(y))}function p(y){return y===35?(t.consume(y),p):(t.exit("atxHeadingSequence"),d(y))}function f(y){return y===null||y===35||We(y)?(t.exit("atxHeadingText"),d(y)):(t.consume(y),f)}}const qA=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],qv=["pre","script","style","textarea"],PA={concrete:!0,name:"htmlFlow",resolveTo:FA,tokenize:VA},UA={partial:!0,tokenize:$A};function FA(t){let i=t.length;for(;i--&&!(t[i][0]==="enter"&&t[i][1].type==="htmlFlow"););return i>1&&t[i-2][1].type==="linePrefix"&&(t[i][1].start=t[i-2][1].start,t[i+1][1].start=t[i-2][1].start,t.splice(i-2,2)),t}function VA(t,i,a){const o=this;let s,c,u,d,p;return f;function f(H){return y(H)}function y(H){return t.enter("htmlFlow"),t.enter("htmlFlowData"),t.consume(H),g}function g(H){return H===33?(t.consume(H),x):H===47?(t.consume(H),c=!0,A):H===63?(t.consume(H),s=3,o.interrupt?i:q):rn(H)?(t.consume(H),u=String.fromCharCode(H),T):a(H)}function x(H){return H===45?(t.consume(H),s=2,v):H===91?(t.consume(H),s=5,d=0,w):rn(H)?(t.consume(H),s=4,o.interrupt?i:q):a(H)}function v(H){return H===45?(t.consume(H),o.interrupt?i:q):a(H)}function w(H){const U="CDATA[";return H===U.charCodeAt(d++)?(t.consume(H),d===U.length?o.interrupt?i:oe:w):a(H)}function A(H){return rn(H)?(t.consume(H),u=String.fromCharCode(H),T):a(H)}function T(H){if(H===null||H===47||H===62||We(H)){const U=H===47,te=u.toLowerCase();return!U&&!c&&qv.includes(te)?(s=1,o.interrupt?i(H):oe(H)):qA.includes(u.toLowerCase())?(s=6,U?(t.consume(H),S):o.interrupt?i(H):oe(H)):(s=7,o.interrupt&&!o.parser.lazy[o.now().line]?a(H):c?E(H):C(H))}return H===45||Wt(H)?(t.consume(H),u+=String.fromCharCode(H),T):a(H)}function S(H){return H===62?(t.consume(H),o.interrupt?i:oe):a(H)}function E(H){return Fe(H)?(t.consume(H),E):I(H)}function C(H){return H===47?(t.consume(H),I):H===58||H===95||rn(H)?(t.consume(H),R):Fe(H)?(t.consume(H),C):I(H)}function R(H){return H===45||H===46||H===58||H===95||Wt(H)?(t.consume(H),R):_(H)}function _(H){return H===61?(t.consume(H),N):Fe(H)?(t.consume(H),_):C(H)}function N(H){return H===null||H===60||H===61||H===62||H===96?a(H):H===34||H===39?(t.consume(H),p=H,j):Fe(H)?(t.consume(H),N):z(H)}function j(H){return H===p?(t.consume(H),p=null,B):H===null||Ce(H)?a(H):(t.consume(H),j)}function z(H){return H===null||H===34||H===39||H===47||H===60||H===61||H===62||H===96||We(H)?_(H):(t.consume(H),z)}function B(H){return H===47||H===62||Fe(H)?C(H):a(H)}function I(H){return H===62?(t.consume(H),X):a(H)}function X(H){return H===null||Ce(H)?oe(H):Fe(H)?(t.consume(H),X):a(H)}function oe(H){return H===45&&s===2?(t.consume(H),V):H===60&&s===1?(t.consume(H),$):H===62&&s===4?(t.consume(H),ze):H===63&&s===3?(t.consume(H),q):H===93&&s===5?(t.consume(H),me):Ce(H)&&(s===6||s===7)?(t.exit("htmlFlowData"),t.check(UA,ge,Y)(H)):H===null||Ce(H)?(t.exit("htmlFlowData"),Y(H)):(t.consume(H),oe)}function Y(H){return t.check(Pf,P,ge)(H)}function P(H){return t.enter("lineEnding"),t.consume(H),t.exit("lineEnding"),M}function M(H){return H===null||Ce(H)?Y(H):(t.enter("htmlFlowData"),oe(H))}function V(H){return H===45?(t.consume(H),q):oe(H)}function $(H){return H===47?(t.consume(H),u="",Z):oe(H)}function Z(H){if(H===62){const U=u.toLowerCase();return qv.includes(U)?(t.consume(H),ze):oe(H)}return rn(H)&&u.length<8?(t.consume(H),u+=String.fromCharCode(H),Z):oe(H)}function me(H){return H===93?(t.consume(H),q):oe(H)}function q(H){return H===62?(t.consume(H),ze):H===45&&s===2?(t.consume(H),q):oe(H)}function ze(H){return H===null||Ce(H)?(t.exit("htmlFlowData"),ge(H)):(t.consume(H),ze)}function ge(H){return t.exit("htmlFlow"),i(H)}}function $A(t,i,a){return o;function o(s){return t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),t.attempt(Rl,i,a)}}const GA={name:"htmlText",tokenize:YA};function YA(t,i,a){const o=this;let s,c,u;return d;function d(q){return t.enter("htmlText"),t.enter("htmlTextData"),t.consume(q),p}function p(q){return q===33?(t.consume(q),f):q===47?(t.consume(q),_):q===63?(t.consume(q),C):rn(q)?(t.consume(q),z):a(q)}function f(q){return q===45?(t.consume(q),y):q===91?(t.consume(q),c=0,w):rn(q)?(t.consume(q),E):a(q)}function y(q){return q===45?(t.consume(q),v):a(q)}function g(q){return q===null?a(q):q===45?(t.consume(q),x):Ce(q)?(u=g,$(q)):(t.consume(q),g)}function x(q){return q===45?(t.consume(q),v):g(q)}function v(q){return q===62?V(q):q===45?x(q):g(q)}function w(q){const ze="CDATA[";return q===ze.charCodeAt(c++)?(t.consume(q),c===ze.length?A:w):a(q)}function A(q){return q===null?a(q):q===93?(t.consume(q),T):Ce(q)?(u=A,$(q)):(t.consume(q),A)}function T(q){return q===93?(t.consume(q),S):A(q)}function S(q){return q===62?V(q):q===93?(t.consume(q),S):A(q)}function E(q){return q===null||q===62?V(q):Ce(q)?(u=E,$(q)):(t.consume(q),E)}function C(q){return q===null?a(q):q===63?(t.consume(q),R):Ce(q)?(u=C,$(q)):(t.consume(q),C)}function R(q){return q===62?V(q):C(q)}function _(q){return rn(q)?(t.consume(q),N):a(q)}function N(q){return q===45||Wt(q)?(t.consume(q),N):j(q)}function j(q){return Ce(q)?(u=j,$(q)):Fe(q)?(t.consume(q),j):V(q)}function z(q){return q===45||Wt(q)?(t.consume(q),z):q===47||q===62||We(q)?B(q):a(q)}function B(q){return q===47?(t.consume(q),V):q===58||q===95||rn(q)?(t.consume(q),I):Ce(q)?(u=B,$(q)):Fe(q)?(t.consume(q),B):V(q)}function I(q){return q===45||q===46||q===58||q===95||Wt(q)?(t.consume(q),I):X(q)}function X(q){return q===61?(t.consume(q),oe):Ce(q)?(u=X,$(q)):Fe(q)?(t.consume(q),X):B(q)}function oe(q){return q===null||q===60||q===61||q===62||q===96?a(q):q===34||q===39?(t.consume(q),s=q,Y):Ce(q)?(u=oe,$(q)):Fe(q)?(t.consume(q),oe):(t.consume(q),P)}function Y(q){return q===s?(t.consume(q),s=void 0,M):q===null?a(q):Ce(q)?(u=Y,$(q)):(t.consume(q),Y)}function P(q){return q===null||q===34||q===39||q===60||q===61||q===96?a(q):q===47||q===62||We(q)?B(q):(t.consume(q),P)}function M(q){return q===47||q===62||We(q)?B(q):a(q)}function V(q){return q===62?(t.consume(q),t.exit("htmlTextData"),t.exit("htmlText"),i):a(q)}function $(q){return t.exit("htmlTextData"),t.enter("lineEnding"),t.consume(q),t.exit("lineEnding"),Z}function Z(q){return Fe(q)?Ve(t,me,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(q):me(q)}function me(q){return t.enter("htmlTextData"),u(q)}}const ym={name:"labelEnd",resolveAll:KA,resolveTo:QA,tokenize:WA},JA={tokenize:eE},XA={tokenize:tE},ZA={tokenize:nE};function KA(t){let i=-1;const a=[];for(;++i<t.length;){const o=t[i][1];if(a.push(t[i]),o.type==="labelImage"||o.type==="labelLink"||o.type==="labelEnd"){const s=o.type==="labelImage"?4:2;o.type="data",i+=s}}return t.length!==a.length&&ei(t,0,t.length,a),t}function QA(t,i){let a=t.length,o=0,s,c,u;for(;a--;){const y=t[a][1];if(s){if(y.type==="link"||y.type==="labelLink"&&y._inactive)break;t[a][0]==="enter"&&y.type==="labelLink"&&(y._inactive=!0)}else if(c){if(t[a][0]==="enter"&&(y.type==="labelImage"||y.type==="labelLink")&&!y._balanced&&(s=a,y.type!=="labelLink")){o=2;break}}else y.type==="labelEnd"&&(c=a)}const d={type:t[s][1].type==="labelLink"?"link":"image",start:{...t[s][1].start},end:{...t[t.length-1][1].end}},p={type:"label",start:{...t[s][1].start},end:{...t[c][1].end}},f={type:"labelText",start:{...t[s+o+2][1].end},end:{...t[c-2][1].start}};return u=[["enter",d,i],["enter",p,i]],u=Fn(u,t.slice(s+1,s+o+3)),u=Fn(u,[["enter",f,i]]),u=Fn(u,Ju(i.parser.constructs.insideSpan.null,t.slice(s+o+4,c-3),i)),u=Fn(u,[["exit",f,i],t[c-2],t[c-1],["exit",p,i]]),u=Fn(u,t.slice(c+1)),u=Fn(u,[["exit",d,i]]),ei(t,s,t.length,u),t}function WA(t,i,a){const o=this,s=o._labelStarts;let c,u;if(s){for(;s.length>0&&s[s.length-1]._balanced;)s.pop();c=s[s.length-1]}return d;function d(x){return c?c._inactive?g(x):(u=o.parser.defined.includes(ti(o.sliceSerialize({start:c.end,end:o.now()}))),t.enter("labelEnd"),t.enter("labelMarker"),t.consume(x),t.exit("labelMarker"),t.exit("labelEnd"),p):a(x)}function p(x){return x===40?t.attempt(JA,y,u?y:g)(x):x===91?t.attempt(XA,y,u?f:g)(x):u?y(x):g(x)}function f(x){return t.attempt(ZA,y,g)(x)}function y(x){return s.pop(),i(x)}function g(x){return c._balanced=!0,a(x)}}function eE(t,i,a){return o;function o(g){return t.enter("resource"),t.enter("resourceMarker"),t.consume(g),t.exit("resourceMarker"),s}function s(g){return We(g)?zi(t,c)(g):c(g)}function c(g){return g===41?y(g):Pw(t,u,d,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(g)}function u(g){return We(g)?zi(t,p)(g):y(g)}function d(g){return a(g)}function p(g){return g===34||g===39||g===40?Fw(t,f,a,"resourceTitle","resourceTitleMarker","resourceTitleString")(g):y(g)}function f(g){return We(g)?zi(t,y)(g):y(g)}function y(g){return g===41?(t.enter("resourceMarker"),t.consume(g),t.exit("resourceMarker"),t.exit("resource"),i):a(g)}}function tE(t,i,a){const o=this;return s;function s(d){return Uw.call(o,t,c,u,"reference","referenceMarker","referenceString")(d)}function c(d){return o.parser.defined.includes(ti(o.sliceSerialize(o.events[o.events.length-1][1]).slice(1,-1)))?i(d):a(d)}function u(d){return a(d)}}function nE(t,i,a){return o;function o(c){return t.enter("reference"),t.enter("referenceMarker"),t.consume(c),t.exit("referenceMarker"),s}function s(c){return c===93?(t.enter("referenceMarker"),t.consume(c),t.exit("referenceMarker"),t.exit("reference"),i):a(c)}}const iE={name:"labelStartImage",resolveAll:ym.resolveAll,tokenize:aE};function aE(t,i,a){const o=this;let s;return c;function c(p){return t.enter("labelImage"),t.enter("labelImageMarker"),t.consume(p),t.exit("labelImageMarker"),u}function u(p){return p===91?(t.enter("labelMarker"),t.consume(p),t.exit("labelMarker"),s=t.exit("labelImage"),d):a(p)}function d(p){return p===94&&"_hiddenFootnoteSupport"in o.parser.constructs?a(p):(o._labelStarts=o._labelStarts||[],o._labelStarts.push(s),i(p))}}const rE={name:"labelStartLink",resolveAll:ym.resolveAll,tokenize:oE};function oE(t,i,a){const o=this;let s;return c;function c(d){return t.enter("labelLink"),t.enter("labelMarker"),t.consume(d),t.exit("labelMarker"),s=t.exit("labelLink"),u}function u(d){return d===94&&"_hiddenFootnoteSupport"in o.parser.constructs?a(d):(o._labelStarts=o._labelStarts||[],o._labelStarts.push(s),i(d))}}const $h={name:"lineEnding",tokenize:lE};function lE(t,i){return a;function a(o){return t.enter("lineEnding"),t.consume(o),t.exit("lineEnding"),Ve(t,i,"linePrefix")}}const xu={name:"thematicBreak",tokenize:sE};function sE(t,i,a){let o=0,s;return c;function c(f){return t.enter("thematicBreak"),u(f)}function u(f){return s=f,d(f)}function d(f){return f===s?(t.enter("thematicBreakSequence"),p(f)):o>=3&&(f===null||Ce(f))?(t.exit("thematicBreak"),i(f)):a(f)}function p(f){return f===s?(t.consume(f),o++,p):(t.exit("thematicBreakSequence"),Fe(f)?Ve(t,d,"whitespace")(f):d(f))}}const pn={continuation:{tokenize:hE},exit:mE,name:"list",tokenize:dE},uE={partial:!0,tokenize:pE},cE={partial:!0,tokenize:fE};function dE(t,i,a){const o=this,s=o.events[o.events.length-1];let c=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0,u=0;return d;function d(v){const w=o.containerState.type||(v===42||v===43||v===45?"listUnordered":"listOrdered");if(w==="listUnordered"?!o.containerState.marker||v===o.containerState.marker:Bf(v)){if(o.containerState.type||(o.containerState.type=w,t.enter(w,{_container:!0})),w==="listUnordered")return t.enter("listItemPrefix"),v===42||v===45?t.check(xu,a,f)(v):f(v);if(!o.interrupt||v===49)return t.enter("listItemPrefix"),t.enter("listItemValue"),p(v)}return a(v)}function p(v){return Bf(v)&&++u<10?(t.consume(v),p):(!o.interrupt||u<2)&&(o.containerState.marker?v===o.containerState.marker:v===41||v===46)?(t.exit("listItemValue"),f(v)):a(v)}function f(v){return t.enter("listItemMarker"),t.consume(v),t.exit("listItemMarker"),o.containerState.marker=o.containerState.marker||v,t.check(Rl,o.interrupt?a:y,t.attempt(uE,x,g))}function y(v){return o.containerState.initialBlankLine=!0,c++,x(v)}function g(v){return Fe(v)?(t.enter("listItemPrefixWhitespace"),t.consume(v),t.exit("listItemPrefixWhitespace"),x):a(v)}function x(v){return o.containerState.size=c+o.sliceSerialize(t.exit("listItemPrefix"),!0).length,i(v)}}function hE(t,i,a){const o=this;return o.containerState._closeFlow=void 0,t.check(Rl,s,c);function s(d){return o.containerState.furtherBlankLines=o.containerState.furtherBlankLines||o.containerState.initialBlankLine,Ve(t,i,"listItemIndent",o.containerState.size+1)(d)}function c(d){return o.containerState.furtherBlankLines||!Fe(d)?(o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,u(d)):(o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,t.attempt(cE,i,u)(d))}function u(d){return o.containerState._closeFlow=!0,o.interrupt=void 0,Ve(t,t.attempt(pn,i,a),"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(d)}}function fE(t,i,a){const o=this;return Ve(t,s,"listItemIndent",o.containerState.size+1);function s(c){const u=o.events[o.events.length-1];return u&&u[1].type==="listItemIndent"&&u[2].sliceSerialize(u[1],!0).length===o.containerState.size?i(c):a(c)}}function mE(t){t.exit(this.containerState.type)}function pE(t,i,a){const o=this;return Ve(t,s,"listItemPrefixWhitespace",o.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function s(c){const u=o.events[o.events.length-1];return!Fe(c)&&u&&u[1].type==="listItemPrefixWhitespace"?i(c):a(c)}}const Pv={name:"setextUnderline",resolveTo:gE,tokenize:yE};function gE(t,i){const a=new Tu;let o=t.length,s,c,u;for(;o--;)if(t[o][0]==="enter"){if(t[o][1].type==="content"){s=o;break}t[o][1].type==="paragraph"&&(c=o)}else t[o][1].type==="content"&&a.add(o,1,[]),!u&&t[o][1].type==="definition"&&(u=o);const d={type:"setextHeading",start:{...t[s][1].start},end:{...t[t.length-1][1].end}};return t[c][1].type="setextHeadingText",u?(a.add(c,0,[["enter",d,i]]),a.add(u+1,0,[["exit",t[s][1],i]]),t[s][1].end={...t[u][1].end}):t[s][1]=d,a.add(t.length,0,[["exit",d,i]]),a.consume(t),t}function yE(t,i,a){const o=this;let s;return c;function c(f){let y=o.events.length,g;for(;y--;)if(o.events[y][1].type!=="lineEnding"&&o.events[y][1].type!=="linePrefix"&&o.events[y][1].type!=="content"){g=o.events[y][1].type==="paragraph";break}return!o.parser.lazy[o.now().line]&&(o.interrupt||g)?(t.enter("setextHeadingLine"),s=f,u(f)):a(f)}function u(f){return t.enter("setextHeadingLineSequence"),d(f)}function d(f){return f===s?(t.consume(f),d):(t.exit("setextHeadingLineSequence"),Fe(f)?Ve(t,p,"lineSuffix")(f):p(f))}function p(f){return f===null||Ce(f)?(t.exit("setextHeadingLine"),i(f)):a(f)}}const bE={tokenize:vE};function vE(t){const i=this,a=t.attempt(Rl,o,t.attempt(this.parser.constructs.flowInitial,s,Ve(t,t.attempt(this.parser.constructs.flow,s,t.attempt(EA,s)),"linePrefix")));return a;function o(c){if(c===null){t.consume(c);return}return t.enter("lineEndingBlank"),t.consume(c),t.exit("lineEndingBlank"),i.currentConstruct=void 0,a}function s(c){if(c===null){t.consume(c);return}return t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),i.currentConstruct=void 0,a}}const xE={resolveAll:$w()},wE=Vw("string"),SE=Vw("text");function Vw(t){return{resolveAll:$w(t==="text"?kE:void 0),tokenize:i};function i(a){const o=this,s=this.parser.constructs[t],c=a.attempt(s,u,d);return u;function u(y){return f(y)?c(y):d(y)}function d(y){if(y===null){a.consume(y);return}return a.enter("data"),a.consume(y),p}function p(y){return f(y)?(a.exit("data"),c(y)):(a.consume(y),p)}function f(y){if(y===null)return!0;const g=s[y];let x=-1;if(g)for(;++x<g.length;){const v=g[x];if(!v.previous||v.previous.call(o,o.previous))return!0}return!1}}}function $w(t){return i;function i(a,o){let s=-1,c;for(;++s<=a.length;)c===void 0?a[s]&&a[s][1].type==="data"&&(c=s,s++):(!a[s]||a[s][1].type!=="data")&&(s!==c+2&&(a[c][1].end=a[s-1][1].end,a.splice(c+2,s-c-2),s=c+2),c=void 0);return t?t(a,o):a}}function kE(t,i){const a=new Tu;let o=0;for(;++o<=t.length;)if((o===t.length||t[o][1].type==="lineEnding")&&t[o-1][1].type==="data"){const s=t[o-1][1],c=i.sliceStream(s);let u=c.length,d=-1,p=0,f;for(;u--;){const y=c[u];if(typeof y=="string"){for(d=y.length;y.charCodeAt(d-1)===32;)p++,d--;if(d)break;d=-1}else if(y===-2)f=!0,p++;else if(y!==-1){u++;break}}if(i._contentTypeTextTrailing&&o===t.length&&(p=0),p){const y={type:o===t.length||f||p<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:u?d:s.start._bufferIndex+d,_index:s.start._index+u,line:s.end.line,column:s.end.column-p,offset:s.end.offset-p},end:{...s.end}};s.end={...y.start},s.start.offset===s.end.offset?Object.assign(s,y):a.add(o,0,[["enter",y,i],["exit",y,i]])}o++}return a.consume(t),t}const TE={42:pn,43:pn,45:pn,48:pn,49:pn,50:pn,51:pn,52:pn,53:pn,54:pn,55:pn,56:pn,57:pn,62:Iw},AE={91:DA},EE={[-2]:Vh,[-1]:Vh,32:Vh},CE={35:IA,42:xu,45:[Pv,xu],60:PA,61:Pv,95:xu,96:Bv,126:Bv},RE={38:Bw,92:Hw},ME={[-5]:$h,[-4]:$h,[-3]:$h,33:iE,38:Bw,42:qf,60:[lA,GA],91:rE,92:[zA,Hw],93:ym,95:qf,96:xA},NE={null:[qf,xE]},DE={null:[42,95]},jE={null:[]},OE=Object.freeze(Object.defineProperty({__proto__:null,attentionMarkers:DE,contentInitial:AE,disable:jE,document:TE,flow:CE,flowInitial:EE,insideSpan:NE,string:RE,text:ME},Symbol.toStringTag,{value:"Module"}));function LE(t,i,a){let o={_bufferIndex:-1,_index:0,line:a&&a.line||1,column:a&&a.column||1,offset:a&&a.offset||0};const s={},c=[];let u=[],d=[];const p={attempt:j(_),check:j(N),consume:E,enter:C,exit:R,interrupt:j(N,{interrupt:!0})},f={code:null,containerState:{},defineSkip:A,events:[],now:w,parser:t,previous:null,sliceSerialize:x,sliceStream:v,write:g};let y=i.tokenize.call(f,p);return i.resolveAll&&c.push(i),f;function g(X){return u=Fn(u,X),T(),u[u.length-1]!==null?[]:(z(i,0),f.events=Ju(c,f.events,f),f.events)}function x(X,oe){return _E(v(X),oe)}function v(X){return zE(u,X)}function w(){const{_bufferIndex:X,_index:oe,line:Y,column:P,offset:M}=o;return{_bufferIndex:X,_index:oe,line:Y,column:P,offset:M}}function A(X){s[X.line]=X.column,I()}function T(){for(;o._index<u.length;){const X=u[o._index];if(typeof X=="string"){const oe=o._index;for(o._bufferIndex<0&&(o._bufferIndex=0);o._index===oe&&o._bufferIndex<X.length;)S(X.charCodeAt(o._bufferIndex))}else S(X)}}function S(X){y=y(X)}function E(X){Ce(X)?(o.line++,o.column=1,o.offset+=X===-3?2:1,I()):X!==-1&&(o.column++,o.offset++),o._bufferIndex<0?o._index++:(o._bufferIndex++,o._bufferIndex===u[o._index].length&&(o._bufferIndex=-1,o._index++)),f.previous=X}function C(X,oe){const Y=oe||{};return Y.type=X,Y.start=w(),f.events.push(["enter",Y,f]),d.push(Y),Y}function R(X){const oe=d.pop();return oe.end=w(),f.events.push(["exit",oe,f]),oe}function _(X,oe){z(X,oe.from)}function N(X,oe){oe.restore()}function j(X,oe){return Y;function Y(P,M,V){let $,Z,me,q;return Array.isArray(P)?ge(P):"tokenize"in P?ge([P]):ze(P);function ze(he){return ve;function ve(le){const be=le!==null&&he[le],xe=le!==null&&he.null,de=[...Array.isArray(be)?be:be?[be]:[],...Array.isArray(xe)?xe:xe?[xe]:[]];return ge(de)(le)}}function ge(he){return $=he,Z=0,he.length===0?V:H(he[Z])}function H(he){return ve;function ve(le){return q=B(),me=he,he.partial||(f.currentConstruct=he),he.name&&f.parser.constructs.disable.null.includes(he.name)?te():he.tokenize.call(oe?Object.assign(Object.create(f),oe):f,p,U,te)(le)}}function U(he){return X(me,q),M}function te(he){return q.restore(),++Z<$.length?H($[Z]):V}}}function z(X,oe){X.resolveAll&&!c.includes(X)&&c.push(X),X.resolve&&ei(f.events,oe,f.events.length-oe,X.resolve(f.events.slice(oe),f)),X.resolveTo&&(f.events=X.resolveTo(f.events,f))}function B(){const X=w(),oe=f.previous,Y=f.currentConstruct,P=f.events.length,M=Array.from(d);return{from:P,restore:V};function V(){o=X,f.previous=oe,f.currentConstruct=Y,f.events.length=P,d=M,I()}}function I(){o.line in s&&o.column<2&&(o.column=s[o.line],o.offset+=s[o.line]-1)}}function zE(t,i){const a=i.start._index,o=i.start._bufferIndex,s=i.end._index,c=i.end._bufferIndex;let u;if(a===s)u=[t[a].slice(o,c)];else{if(u=t.slice(a,s),o>-1){const d=u[0];typeof d=="string"?u[0]=d.slice(o):u.shift()}c>0&&u.push(t[s].slice(0,c))}return u}function _E(t,i){let a=-1;const o=[];let s;for(;++a<t.length;){const c=t[a];let u;if(typeof c=="string")u=c;else switch(c){case-5:{u="\r";break}case-4:{u=`
`;break}case-3:{u=`\r
`;break}case-2:{u=i?" ":"	";break}case-1:{if(!i&&s)continue;u=" ";break}default:u=String.fromCharCode(c)}s=c===-2,o.push(u)}return o.join("")}function IE(t){const o={constructs:Lw([OE,...(t||{}).extensions||[]]),content:s(eA),defined:[],document:s(nA),flow:s(bE),lazy:{},string:s(wE),text:s(SE)};return o;function s(c){return u;function u(d){return LE(o,c,d)}}}function HE(t){for(;!qw(t););return t}const Uv=/[\0\t\n\r]/g;function BE(){let t=1,i="",a=!0,o;return s;function s(c,u,d){c=i+(typeof c=="string"?c.toString():new TextDecoder(u||void 0).decode(c));const p=[];let f=0;for(i="",a&&(c.charCodeAt(0)===65279&&f++,a=void 0);f<c.length;){Uv.lastIndex=f;const y=Uv.exec(c),g=y&&y.index!==void 0?y.index:c.length,x=c.charCodeAt(g);if(!y){i=c.slice(f);break}if(x===10&&f===g&&o)p.push(-3),o=void 0;else switch(o&&(p.push(-5),o=void 0),f<g&&(p.push(c.slice(f,g)),t+=g-f),x){case 0:{p.push(65533),t++;break}case 9:{const v=Math.ceil(t/4)*4;for(p.push(-2);t++<v;)p.push(-1);break}case 10:{p.push(-4),t=1;break}default:o=!0,t=1}f=g+1}return d&&(o&&p.push(-5),i&&p.push(i),p.push(null)),p}}const qE=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function bm(t){return t.replace(qE,PE)}function PE(t,i,a){if(i)return i;if(a.charCodeAt(0)===35){const s=a.charCodeAt(1),c=s===120||s===88;return zw(a.slice(c?2:1),c?16:10)}return kl(a)||t}function _i(t){return!t||typeof t!="object"?"":"position"in t||"type"in t?Fv(t.position):"start"in t||"end"in t?Fv(t):"line"in t||"column"in t?Uf(t):""}function Uf(t){return Vv(t&&t.line)+":"+Vv(t&&t.column)}function Fv(t){return Uf(t&&t.start)+"-"+Uf(t&&t.end)}function Vv(t){return t&&typeof t=="number"?t:1}const Gw={}.hasOwnProperty;function Tl(t,i,a){return i&&typeof i=="object"&&(a=i,i=void 0),UE(a)(HE(IE(a).document().write(BE()(t,i,!0))))}function UE(t){const i={afterExit:[],beforeEnter:[],transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:u($e),autolinkProtocol:I,autolinkEmail:I,atxHeading:u(De),blockQuote:u(de),characterEscape:I,characterReference:I,codeFenced:u(ae),codeFencedFenceInfo:d,codeFencedFenceMeta:d,codeIndented:u(ae,d),codeText:u(ye,d),codeTextData:I,data:I,codeFlowValue:I,definition:u(Ae),definitionDestinationString:d,definitionLabelString:d,definitionTitleString:d,emphasis:u(Ne),hardBreakEscape:u(Me),hardBreakTrailing:u(Me),htmlFlow:u(ce,d),htmlFlowData:I,htmlText:u(ce,d),htmlTextData:I,image:u(je),label:d,link:u($e),listItem:u(W),listItemValue:v,listOrdered:u(Ge,x),listUnordered:u(Ge),paragraph:u(re),reference:U,referenceString:d,resourceDestinationString:d,resourceTitleString:d,setextHeading:u(De),strong:u(ue),thematicBreak:u(Se)},exit:{atxHeading:f(),atxHeadingSequence:N,autolink:f(),autolinkEmail:xe,autolinkProtocol:be,blockQuote:f(),characterEscapeValue:X,characterReferenceMarkerHexadecimal:he,characterReferenceMarkerNumeric:he,characterReferenceValue:ve,characterReference:le,codeFenced:f(S),codeFencedFence:T,codeFencedFenceInfo:w,codeFencedFenceMeta:A,codeFlowValue:X,codeIndented:f(E),codeText:f(V),codeTextData:X,data:X,definition:f(),definitionDestinationString:_,definitionLabelString:C,definitionTitleString:R,emphasis:f(),hardBreakEscape:f(Y),hardBreakTrailing:f(Y),htmlFlow:f(P),htmlFlowData:X,htmlText:f(M),htmlTextData:X,image:f(Z),label:q,labelText:me,lineEnding:oe,link:f($),listItem:f(),listOrdered:f(),listUnordered:f(),paragraph:f(),referenceString:te,resourceDestinationString:ze,resourceTitleString:ge,resource:H,setextHeading:f(B),setextHeadingLineSequence:z,setextHeadingText:j,strong:f(),thematicBreak:f()}};Yw(i,(t||{}).mdastExtensions||[]);const a={};return o;function o(G){let D={type:"root",children:[],position:void 0};const we={stack:[D],tokenStack:[],config:i,enter:p,exit:y,buffer:d,resume:g,data:a},Te=[],Ie=[];let Oe=-1;for(;++Oe<G.length;)if(Ie.push(G[Oe]),G[Oe][1].type==="listOrdered"||G[Oe][1].type==="listUnordered")if(G[Oe][0]==="enter")Te.push(Ie.length-1);else{const et=Te.pop();c(Ie,et)}for(G=Ie,Oe=-1;++Oe<G.length;){const et=i[G[Oe][0]];G[Oe][0]==="enter"&&i.beforeEnter.length>0&&s(i.beforeEnter,{...we,sliceSerialize:G[Oe][2].sliceSerialize},G[Oe][1]),Gw.call(et,G[Oe][1].type)&&et[G[Oe][1].type].call({...we,sliceSerialize:G[Oe][2].sliceSerialize},G[Oe][1]),G[Oe][0]==="exit"&&i.afterExit.length>0&&s(i.afterExit,{...we,sliceSerialize:G[Oe][2].sliceSerialize},G[Oe][1])}if(we.tokenStack.length>0){const et=we.tokenStack[we.tokenStack.length-1];(et[1]||$v).call(we,void 0,et[0])}for(D.position={start:ga(G.length>0?G[0][1].start:{line:1,column:1,offset:0}),end:ga(G.length>0?G[G.length-2][1].end:{line:1,column:1,offset:0})},Oe=-1;++Oe<i.transforms.length;)D=i.transforms[Oe](D)||D;return D}function s(G,D,we){let Te=-1;for(;++Te<G.length;)G[Te].call(D,we)}function c(G,D){const we=G.length-1;let Te=D-1,Ie=-1,Oe=!1,et,Ye,ht,Qe;const kt=[];for(;++Te<=we;){const Bt=G[Te];switch(Bt[1].type){case"listUnordered":case"listOrdered":case"blockQuote":{Bt[0]==="enter"?Ie++:Ie--,Qe=void 0;break}case"lineEndingBlank":{Bt[0]==="enter"&&(et&&!Qe&&!Ie&&!ht&&(ht=Te),Qe=void 0);break}case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:Qe=void 0}if(!Ie&&Bt[0]==="enter"&&Bt[1].type==="listItemPrefix"||Ie===-1&&Bt[0]==="exit"&&(Bt[1].type==="listUnordered"||Bt[1].type==="listOrdered")){if(et){let jn=Te;for(Ye=void 0;jn--;){const On=G[jn];if(On[1].type==="lineEnding"||On[1].type==="lineEndingBlank"){if(On[0]==="exit")continue;Ye&&(G[Ye][1].type="lineEndingBlank",Oe=!0),On[1].type="lineEnding",Ye=jn}else if(!(On[1].type==="linePrefix"||On[1].type==="blockQuotePrefix"||On[1].type==="blockQuotePrefixWhitespace"||On[1].type==="blockQuoteMarker"||On[1].type==="listItemIndent"))break}ht&&(!Ye||ht<Ye)&&(et._spread=!0),et.end=Object.assign({},Ye?G[Ye][1].start:Bt[1].end),kt.push({at:Ye||Te,event:["exit",et,Bt[2]]})}if(Bt[1].type==="listItemPrefix"){const jn={type:"listItem",_spread:!1,start:Object.assign({},Bt[1].start),end:void 0};et=jn,kt.push({at:Te,event:["enter",jn,Bt[2]]}),ht=void 0,Qe=!0}}}const Je=G.splice(D);let ct=0;for(Te=-1;++Te<Je.length;){for(;ct<kt.length&&kt[ct].at===D+Te;)G.push(kt[ct++].event);G.push(Je[Te])}G[D][1]._spread=Oe}function u(G,D){return we;function we(Te){p.call(this,G(Te),Te),D&&D.call(this,Te)}}function d(){this.stack.push({type:"fragment",children:[]})}function p(G,D,we){this.stack[this.stack.length-1].children.push(G),this.stack.push(G),this.tokenStack.push([D,we||void 0]),G.position={start:ga(D.start),end:void 0}}function f(G){return D;function D(we){G&&G.call(this,we),y.call(this,we)}}function y(G,D){const we=this.stack.pop(),Te=this.tokenStack.pop();if(!Te)throw new Error("Cannot close `"+G.type+"` ("+_i({start:G.start,end:G.end})+"): it’s not open");Te[0].type!==G.type&&(D?D.call(this,G,Te[0]):(Te[1]||$v).call(this,G,Te[0])),we.position.end=ga(G.end)}function g(){return gm(this.stack.pop())}function x(){this.data.expectingFirstListItemValue=!0}function v(G){if(this.data.expectingFirstListItemValue){const D=this.stack[this.stack.length-2];D.start=Number.parseInt(this.sliceSerialize(G),10),this.data.expectingFirstListItemValue=void 0}}function w(){const G=this.resume(),D=this.stack[this.stack.length-1];D.lang=G}function A(){const G=this.resume(),D=this.stack[this.stack.length-1];D.meta=G}function T(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function S(){const G=this.resume(),D=this.stack[this.stack.length-1];D.value=G.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}function E(){const G=this.resume(),D=this.stack[this.stack.length-1];D.value=G.replace(/(\r?\n|\r)$/g,"")}function C(G){const D=this.resume(),we=this.stack[this.stack.length-1];we.label=D,we.identifier=ti(this.sliceSerialize(G)).toLowerCase()}function R(){const G=this.resume(),D=this.stack[this.stack.length-1];D.title=G}function _(){const G=this.resume(),D=this.stack[this.stack.length-1];D.url=G}function N(G){const D=this.stack[this.stack.length-1];if(!D.depth){const we=this.sliceSerialize(G).length;D.depth=we}}function j(){this.data.setextHeadingSlurpLineEnding=!0}function z(G){const D=this.stack[this.stack.length-1];D.depth=this.sliceSerialize(G).codePointAt(0)===61?1:2}function B(){this.data.setextHeadingSlurpLineEnding=void 0}function I(G){const we=this.stack[this.stack.length-1].children;let Te=we[we.length-1];(!Te||Te.type!=="text")&&(Te=Re(),Te.position={start:ga(G.start),end:void 0},we.push(Te)),this.stack.push(Te)}function X(G){const D=this.stack.pop();D.value+=this.sliceSerialize(G),D.position.end=ga(G.end)}function oe(G){const D=this.stack[this.stack.length-1];if(this.data.atHardBreak){const we=D.children[D.children.length-1];we.position.end=ga(G.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&i.canContainEols.includes(D.type)&&(I.call(this,G),X.call(this,G))}function Y(){this.data.atHardBreak=!0}function P(){const G=this.resume(),D=this.stack[this.stack.length-1];D.value=G}function M(){const G=this.resume(),D=this.stack[this.stack.length-1];D.value=G}function V(){const G=this.resume(),D=this.stack[this.stack.length-1];D.value=G}function $(){const G=this.stack[this.stack.length-1];if(this.data.inReference){const D=this.data.referenceType||"shortcut";G.type+="Reference",G.referenceType=D,delete G.url,delete G.title}else delete G.identifier,delete G.label;this.data.referenceType=void 0}function Z(){const G=this.stack[this.stack.length-1];if(this.data.inReference){const D=this.data.referenceType||"shortcut";G.type+="Reference",G.referenceType=D,delete G.url,delete G.title}else delete G.identifier,delete G.label;this.data.referenceType=void 0}function me(G){const D=this.sliceSerialize(G),we=this.stack[this.stack.length-2];we.label=bm(D),we.identifier=ti(D).toLowerCase()}function q(){const G=this.stack[this.stack.length-1],D=this.resume(),we=this.stack[this.stack.length-1];if(this.data.inReference=!0,we.type==="link"){const Te=G.children;we.children=Te}else we.alt=D}function ze(){const G=this.resume(),D=this.stack[this.stack.length-1];D.url=G}function ge(){const G=this.resume(),D=this.stack[this.stack.length-1];D.title=G}function H(){this.data.inReference=void 0}function U(){this.data.referenceType="collapsed"}function te(G){const D=this.resume(),we=this.stack[this.stack.length-1];we.label=D,we.identifier=ti(this.sliceSerialize(G)).toLowerCase(),this.data.referenceType="full"}function he(G){this.data.characterReferenceType=G.type}function ve(G){const D=this.sliceSerialize(G),we=this.data.characterReferenceType;let Te;we?(Te=zw(D,we==="characterReferenceMarkerNumeric"?10:16),this.data.characterReferenceType=void 0):Te=kl(D);const Ie=this.stack[this.stack.length-1];Ie.value+=Te}function le(G){const D=this.stack.pop();D.position.end=ga(G.end)}function be(G){X.call(this,G);const D=this.stack[this.stack.length-1];D.url=this.sliceSerialize(G)}function xe(G){X.call(this,G);const D=this.stack[this.stack.length-1];D.url="mailto:"+this.sliceSerialize(G)}function de(){return{type:"blockquote",children:[],position:void 0}}function ae(){return{type:"code",lang:null,meta:null,value:"",position:void 0}}function ye(){return{type:"inlineCode",value:"",position:void 0}}function Ae(){return{type:"definition",identifier:"",label:null,title:null,url:"",position:void 0}}function Ne(){return{type:"emphasis",children:[],position:void 0}}function De(){return{type:"heading",depth:0,children:[],position:void 0}}function Me(){return{type:"break",position:void 0}}function ce(){return{type:"html",value:"",position:void 0}}function je(){return{type:"image",title:null,url:"",alt:null,position:void 0}}function $e(){return{type:"link",title:null,url:"",children:[],position:void 0}}function Ge(G){return{type:"list",ordered:G.type==="listOrdered",start:null,spread:G._spread,children:[],position:void 0}}function W(G){return{type:"listItem",spread:G._spread,checked:null,children:[],position:void 0}}function re(){return{type:"paragraph",children:[],position:void 0}}function ue(){return{type:"strong",children:[],position:void 0}}function Re(){return{type:"text",value:"",position:void 0}}function Se(){return{type:"thematicBreak",position:void 0}}}function ga(t){return{line:t.line,column:t.column,offset:t.offset}}function Yw(t,i){let a=-1;for(;++a<i.length;){const o=i[a];Array.isArray(o)?Yw(t,o):FE(t,o)}}function FE(t,i){let a;for(a in i)if(Gw.call(i,a))switch(a){case"canContainEols":{const o=i[a];o&&t[a].push(...o);break}case"transforms":{const o=i[a];o&&t[a].push(...o);break}case"afterExit":case"beforeEnter":{const o=i[a];o&&t[a].push(o);break}case"enter":case"exit":{const o=i[a];o&&Object.assign(t[a],o);break}}}function $v(t,i){throw t?new Error("Cannot close `"+t.type+"` ("+_i({start:t.start,end:t.end})+"): a different token (`"+i.type+"`, "+_i({start:i.start,end:i.end})+") is open"):new Error("Cannot close document, a token (`"+i.type+"`, "+_i({start:i.start,end:i.end})+") is still open")}const VE=/[$_\p{ID_Start}]/u,$E=/[$_\u{200C}\u{200D}\p{ID_Continue}]/u,GE=/[-$_\u{200C}\u{200D}\p{ID_Continue}]/u,YE=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,JE=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Jw={};function Kn(t){return t?VE.test(String.fromCodePoint(t)):!1}function hl(t,i){const o=(i||Jw).jsx?GE:$E;return t?o.test(String.fromCodePoint(t)):!1}function Gv(t,i){return(Jw.jsx?JE:YE).test(t)}const XE={}.hasOwnProperty,ZE=Symbol("continue"),Gh=Symbol("exit"),KE=Symbol("skip");function QE(t,i){let a,o;typeof i=="function"?a=i:i&&typeof i=="object"&&(i.enter&&(a=i.enter),i.leave&&(o=i.leave)),s(t,void 0,void 0,[])();function s(c,u,d,p){return Yh(c)&&(f.displayName="node ("+c.type+")"),f;function f(){const y=a?Yv(a(c,u,d,p)):[];if(y[0]===Gh)return y;if(y[0]!==KE){let g;for(g in c)if(XE.call(c,g)&&c[g]&&typeof c[g]=="object"&&g!=="data"&&g!=="position"){const x=p.concat(c),v=c[g];if(Array.isArray(v)){const w=v;let A=0;for(;A>-1&&A<w.length;){const T=w[A];if(Yh(T)){const S=s(T,g,A,x)();if(S[0]===Gh)return S;A=typeof S[1]=="number"?S[1]:A+1}else A++}}else if(Yh(v)){const w=s(v,g,void 0,x)();if(w[0]===Gh)return w}}}return o?Yv(o(c,u,d,p)):y}}}function Yv(t){return Array.isArray(t)?t:typeof t=="number"?[ZE,t]:[t]}function Yh(t){return!!(t&&typeof t=="object"&&"type"in t&&typeof t.type=="string"&&t.type.length>0)}class ut extends Error{constructor(i,a,o){super(),typeof a=="string"&&(o=a,a=void 0);let s="",c={},u=!1;if(a&&("line"in a&&"column"in a?c={place:a}:"start"in a&&"end"in a?c={place:a}:"type"in a?c={ancestors:[a],place:a.position}:c={...a}),typeof i=="string"?s=i:!c.cause&&i&&(u=!0,s=i.message,c.cause=i),!c.ruleId&&!c.source&&typeof o=="string"){const p=o.indexOf(":");p===-1?c.ruleId=o:(c.source=o.slice(0,p),c.ruleId=o.slice(p+1))}if(!c.place&&c.ancestors&&c.ancestors){const p=c.ancestors[c.ancestors.length-1];p&&(c.place=p.position)}const d=c.place&&"start"in c.place?c.place.start:c.place;this.ancestors=c.ancestors||void 0,this.cause=c.cause||void 0,this.column=d?d.column:void 0,this.fatal=void 0,this.file="",this.message=s,this.line=d?d.line:void 0,this.name=_i(c.place)||"1:1",this.place=c.place||void 0,this.reason=this.message,this.ruleId=c.ruleId||void 0,this.source=c.source||void 0,this.stack=u&&c.cause&&typeof c.cause.stack=="string"?c.cause.stack:"",this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}}ut.prototype.file="";ut.prototype.name="";ut.prototype.reason="";ut.prototype.message="";ut.prototype.stack="";ut.prototype.column=void 0;ut.prototype.line=void 0;ut.prototype.ancestors=void 0;ut.prototype.cause=void 0;ut.prototype.fatal=void 0;ut.prototype.place=void 0;ut.prototype.ruleId=void 0;ut.prototype.source=void 0;function WE(t,i){const a=i.prefix||"",o=i.suffix||"",s=Object.assign({},i.acornOptions),c=[],u=[],d=s.onComment,p=s.onToken;let f=!1,y,g;const x=Object.assign({},s,{onComment:c,preserveParens:!0});p&&(x.onToken=u);const v=eC(t,i.tokenTypes),w=v.value,A=a+w+o,T=Jv(w);if(T&&!i.allowEmpty)throw new ut("Unexpected empty expression",{place:E(0),ruleId:"unexpected-empty-expression",source:"micromark-extension-mdx-expression"});try{y=i.expression&&!T?i.acorn.parseExpressionAt(A,0,x):i.acorn.parse(A,x)}catch(C){const R=C,_=E(R.pos);R.message=String(R.message).replace(/ \(\d+:\d+\)$/,""),R.pos=_.offset,R.loc={line:_.line,column:_.column-1},g=R,f=R.raisedAt>=a.length+w.length||R.message==="Unterminated comment"}if(y&&i.expression&&!T)if(Jv(A.slice(y.end,A.length-o.length)))y={type:"Program",start:0,end:a.length+w.length,body:[{type:"ExpressionStatement",expression:y,start:0,end:a.length+w.length}],sourceType:"module",comments:[]};else{const C=E(y.end),R=new Error("Unexpected content after expression");R.pos=C.offset,R.loc={line:C.line,column:C.column-1},g=R,y=void 0}if(y){if(y.comments=c,QE(y,function(C,R,_,N){let j=N[N.length-1],z=R;C.type==="ParenthesizedExpression"&&j&&z&&(typeof _=="number"&&(j=j[z],z=_),j[z]=C.expression),S(C)}),Array.isArray(d))d.push(...c);else if(typeof d=="function")for(const C of c)d(C.type==="Block",C.value,C.start,C.end,C.loc.start,C.loc.end);for(const C of u)C.end<=a.length||C.start-a.length>=w.length||(S(C),Array.isArray(p)?p.push(C):p(C))}return{estree:y,error:g,swallow:f};function S(C){const R=E(C.start),_=E(C.end);C.start=R.offset,C.end=_.offset,C.loc={start:{line:R.line,column:R.column-1,offset:R.offset},end:{line:_.line,column:_.column-1,offset:_.offset}},C.range=[C.start,C.end]}function E(C){let R=C-a.length;R<0?R=0:R>w.length&&(R=w.length);let _=tC(v.stops,R);return _||(_={line:i.start.line,column:i.start.column,offset:i.start.offset}),_}}function Jv(t){return/^\s*$/.test(t.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/[^\r\n]*(\r\n|\n|\r)/g,""))}function eC(t,i){const a={value:"",stops:[]};let o=-1;for(;++o<t.length;){const s=t[o];if(s[0]==="enter"){const c=s[1].type;if(c==="lineEnding"||i.includes(c)){const u=s[2].sliceStream(s[1]);for(;u.length>0&&u[0]===-1;)u.shift();const d=nC(u);a.stops.push([a.value.length,s[1].start]),a.value+=d,a.stops.push([a.value.length,s[1].end])}}}return a}function tC(t,i){let a=0;for(;a<t.length&&t[a][0]<=i;)a+=1;if(a===0)return;const[o,s]=t[a-1],c=i-o;return{line:s.line,column:s.column+c,offset:s.offset+c}}function nC(t){let i=-1;const a=[];let o;for(;++i<t.length;){const s=t[i];let c;if(typeof s=="string")c=s;else switch(s){case-5:{c="\r";break}case-4:{c=`
`;break}case-3:{c=`\r
`;break}case-2:{c="	";break}case-1:{if(o)continue;c=" ";break}default:c=String.fromCharCode(s)}o=s===-2,a.push(c)}return a.join("")}function Jh(t){const i=t||{},a=i.loc||{},o=i.range||[void 0,void 0],s=Xv(a.start,o[0]||i.start),c=Xv(a.end,o[1]||i.end);if(s&&c)return{start:s,end:c}}function Xv(t,i){if(t&&typeof t=="object"){const a="line"in t?Xh(t.line):void 0,o="column"in t?Xh(t.column):void 0;if(a&&o!==void 0)return{line:a,column:o+1,offset:Xh(i)}}}function Xh(t){return typeof t=="number"&&t>-1?t:void 0}const iC=2,to="https://github.com/micromark/micromark-extension-mdx-expression/tree/main/packages/micromark-extension-mdx-expression",aC="#unexpected-end-of-file-in-expression-expected-a-corresponding-closing-brace-for-",rC="#unexpected-lazy-line-in-expression-in-container-expected-line-to-be-prefixed",Zv="#unexpected-type-in-code-expected-an-object-spread-spread",oC="#unexpected-extra-content-in-spread-only-a-single-spread-is-supported",lC="#could-not-parse-expression-with-acorn";function Kv(t,i,a,o,s,c,u,d,p,f,y){const g=this,x=this.events.length+3;let v=0,w,A;return T;function T(R){return t.enter(a),t.enter(o),t.consume(R),t.exit(o),w=g.now(),S}function S(R){if(R===null){if(A)throw A;const _=new ut("Unexpected end of file in expression, expected a corresponding closing brace for `{`",{place:g.now(),ruleId:"unexpected-eof",source:"micromark-extension-mdx-expression"});throw _.url=to+aC,_}if(Ce(R))return t.enter("lineEnding"),t.consume(R),t.exit("lineEnding"),C;if(R===125&&v===0){const _=c?sC.call(g,c,u,s,x,w,f||!1,p||!1):{type:"ok",estree:void 0};if(_.type==="ok"){t.enter(o),t.consume(R),t.exit(o);const N=t.exit(a);return d&&_.estree&&Object.assign(N,{estree:_.estree}),i}return A=_.message,t.enter(s),t.consume(R),E}return t.enter(s),E(R)}function E(R){return R===125&&v===0||R===null||Ce(R)?(t.exit(s),S(R)):(R===123&&!c?v+=1:R===125&&(v-=1),t.consume(R),E)}function C(R){const _=g.now();if(_.line!==w.line&&!y&&g.parser.lazy[_.line]){const N=new ut("Unexpected lazy line in expression in container, expected line to be prefixed with `>` when in a block quote, whitespace when in a list, etc",{place:g.now(),ruleId:"unexpected-lazy",source:"micromark-extension-mdx-expression"});throw N.url=to+rC,N}return Fe(R)?Ve(t,S,"linePrefix",iC+1)(R):S(R)}}function sC(t,i,a,o,s,c,u){const d=WE(this.events.slice(o),{acorn:t,tokenTypes:[a],acornOptions:i,start:s,expression:!0,allowEmpty:c,prefix:u?"({":"",suffix:u?"})":""}),p=d.estree;if(u&&p){const f=p.body[0];if(f.type!=="ExpressionStatement"||f.expression.type!=="ObjectExpression"){const y=Jh(f),g=new ut("Unexpected `"+f.type+"` in code: expected an object spread (`{...spread}`)",{place:y.start,ruleId:"non-spread",source:"micromark-extension-mdx-expression"});throw g.url=to+Zv,g}if(f.expression.properties[1]){const y=Jh(f.expression.properties[1]),g=new ut("Unexpected extra content in spread: only a single spread is supported",{place:y.start,ruleId:"spread-extra",source:"micromark-extension-mdx-expression"});throw g.url=to+oC,g}if(f.expression.properties[0]&&f.expression.properties[0].type!=="SpreadElement"){const y=Jh(f.expression.properties[0]),g=new ut("Unexpected `"+f.expression.properties[0].type+"` in code: only spread elements are supported",{place:y.start,ruleId:"non-spread",source:"micromark-extension-mdx-expression"});throw g.url=to+Zv,g}}if(d.error){const f=new ut("Could not parse expression with acorn",{cause:d.error,place:{line:d.error.loc.line,column:d.error.loc.column+1,offset:d.error.pos},ruleId:"acorn",source:"micromark-extension-mdx-expression"});return f.url=to+lC,{type:"nok",message:f}}return{type:"ok",estree:p}}const Qv="https://github.com/micromark/micromark-extension-mdx-jsx";function Xw(t,i,a,o,s,c,u,d,p,f,y,g,x,v,w,A,T,S,E,C,R,_,N,j,z,B,I,X,oe,Y,P,M){const V=this;let $,Z;return me;function me(D){return t.enter(d),t.enter(p),t.consume(D),t.exit(p),q}function q(D){return We(D)?a(D):($=ze,ue(D))}function ze(D){if(D===47)return t.enter(f),t.consume(D),t.exit(f),$=ge,ue;if(D===62)return re(D);if(D!==null&&D>=0&&Kn(D))return t.enter(g),t.enter(x),t.consume(D),H;G(D,"before name","a character that can start a name, such as a letter, `$`, or `_`"+(D===33?" (note: to create a comment in MDX, use `{/* text */}`)":""))}function ge(D){if(D===62)return re(D);if(D!==null&&D>=0&&Kn(D))return t.enter(g),t.enter(x),t.consume(D),H;G(D,"before name","a character that can start a name, such as a letter, `$`, or `_`"+(D===42||D===47?" (note: JS comments in JSX tags are not supported in MDX)":""))}function H(D){if(D!==null&&D>=0&&hl(D,{jsx:!0}))return t.consume(D),H;if(D===46||D===47||D===58||D===62||D===123||We(D)||Ht(D))return t.exit(x),$=U,ue(D);G(D,"in name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag"+(D===64?" (note: to create a link in MDX, use `[text](url)`)":""))}function U(D){if(D===46)return t.enter(v),t.consume(D),t.exit(v),$=te,ue;if(D===58)return t.enter(A),t.consume(D),t.exit(A),$=le,ue;if(D===47||D===62||D===123||D!==null&&D>=0&&Kn(D))return t.exit(g),de(D);G(D,"after name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function te(D){if(D!==null&&D>=0&&Kn(D))return t.enter(w),t.consume(D),he;G(D,"before member name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function he(D){if(D!==null&&D>=0&&hl(D,{jsx:!0}))return t.consume(D),he;if(D===46||D===47||D===62||D===123||We(D)||Ht(D))return t.exit(w),$=ve,ue(D);G(D,"in member name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag"+(D===64?" (note: to create a link in MDX, use `[text](url)`)":""))}function ve(D){if(D===46)return t.enter(v),t.consume(D),t.exit(v),$=te,ue;if(D===47||D===62||D===123||D!==null&&D>=0&&Kn(D))return t.exit(g),de(D);G(D,"after member name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function le(D){if(D!==null&&D>=0&&Kn(D))return t.enter(T),t.consume(D),be;G(D,"before local name","a character that can start a name, such as a letter, `$`, or `_`"+(D===43||D!==null&&D>46&&D<58?" (note: to create a link in MDX, use `[text](url)`)":""))}function be(D){if(D!==null&&D>=0&&hl(D,{jsx:!0}))return t.consume(D),be;if(D===47||D===62||D===123||We(D)||Ht(D))return t.exit(T),$=xe,ue(D);G(D,"in local name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag")}function xe(D){if(D===47||D===62||D===123||D!==null&&D>=0&&Kn(D))return t.exit(g),de(D);G(D,"after local name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function de(D){if(D===47)return t.enter(y),t.consume(D),t.exit(y),$=W,ue;if(D===62)return re(D);if(D===123)return Kv.call(V,t,ae,S,E,C,o,s,c,!0,!1,u)(D);if(D!==null&&D>=0&&Kn(D))return t.enter(R),t.enter(_),t.enter(N),t.consume(D),ye;G(D,"before attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function ae(D){return $=de,ue(D)}function ye(D){if(D!==null&&D>=0&&hl(D,{jsx:!0}))return t.consume(D),ye;if(D===47||D===58||D===61||D===62||D===123||We(D)||Ht(D))return t.exit(N),$=Ae,ue(D);G(D,"in attribute name","an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag")}function Ae(D){if(D===58)return t.enter(j),t.consume(D),t.exit(j),$=Ne,ue;if(D===61)return t.exit(_),t.enter(B),t.consume(D),t.exit(B),$=ce,ue;if(D===47||D===62||D===123||We(D)||Ht(D)||D!==null&&D>=0&&Kn(D))return t.exit(_),t.exit(R),$=de,ue(D);G(D,"after attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function Ne(D){if(D!==null&&D>=0&&Kn(D))return t.enter(z),t.consume(D),De;G(D,"before local attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function De(D){if(D!==null&&D>=0&&hl(D,{jsx:!0}))return t.consume(D),De;if(D===47||D===61||D===62||D===123||We(D)||Ht(D))return t.exit(z),t.exit(_),$=Me,ue(D);G(D,"in local attribute name","an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag")}function Me(D){if(D===61)return t.enter(B),t.consume(D),t.exit(B),$=ce,ue;if(D===47||D===62||D===123||D!==null&&D>=0&&Kn(D))return t.exit(R),de(D);G(D,"after local attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function ce(D){if(D===34||D===39)return t.enter(I),t.enter(X),t.consume(D),t.exit(X),Z=D,$e;if(D===123)return Kv.call(V,t,je,Y,P,M,o,s,c,!1,!1,u)(D);G(D,"before attribute value","a character that can start an attribute value, such as `\"`, `'`, or `{`"+(D===60?" (note: to use an element or fragment as a prop value in MDX, use `{<element />}`)":""))}function je(D){return t.exit(R),$=de,ue(D)}function $e(D){return D===null&&G(D,"in attribute value","a corresponding closing quote `"+String.fromCodePoint(Z)+"`"),D===Z?(t.enter(X),t.consume(D),t.exit(X),t.exit(I),t.exit(R),Z=void 0,$=de,ue):Ce(D)?($=$e,ue(D)):(t.enter(oe),Ge(D))}function Ge(D){return D===null||D===Z||Ce(D)?(t.exit(oe),$e(D)):(t.consume(D),Ge)}function W(D){if(D===62)return re(D);G(D,"after self-closing slash","`>` to end the tag"+(D===42||D===47?" (note: JS comments in JSX tags are not supported in MDX)":""))}function re(D){return t.enter(p),t.consume(D),t.exit(p),t.exit(d),i}function ue(D){return Ce(D)?(t.enter("lineEnding"),t.consume(D),t.exit("lineEnding"),Se):Fe(D)||Ht(D)?(t.enter("esWhitespace"),Re(D)):$(D)}function Re(D){return Ce(D)?(t.exit("esWhitespace"),ue(D)):Fe(D)||Ht(D)?(t.consume(D),Re):(t.exit("esWhitespace"),$(D))}function Se(D){if(!u&&V.parser.lazy[V.now().line]){const we=new ut("Unexpected lazy line in container, expected line to be prefixed with `>` when in a block quote, whitespace when in a list, etc",V.now(),"micromark-extension-mdx-jsx:unexpected-lazy");throw we.url=Qv+"#unexpected-lazy-line-in-container-expected-line-to-be",we}return ue(D)}function G(D,we,Te){const Ie=new ut("Unexpected "+(D===null?"end of file":"character `"+(D===96?"` ` `":String.fromCodePoint(D))+"` ("+uC(D)+")")+" "+we+", expected "+Te,V.now(),"micromark-extension-mdx-jsx:unexpected-"+(D===null?"eof":"character"));throw Ie.url=Qv+(D===null?"#unexpected-end-of-file-at-expected-expect":"#unexpected-character-at-expected-expect"),Ie}}function uC(t){return"U+"+t.toString(16).toUpperCase().padStart(4,"0")}function cC(t,i){return{name:"mdxJsxTextTag",tokenize:a};function a(o,s,c){return Xw.call(this,o,s,c,t,i.acornOptions,i.addResult,!0,"mdxJsxTextTag","mdxJsxTextTagMarker","mdxJsxTextTagClosingMarker","mdxJsxTextTagSelfClosingMarker","mdxJsxTextTagName","mdxJsxTextTagNamePrimary","mdxJsxTextTagNameMemberMarker","mdxJsxTextTagNameMember","mdxJsxTextTagNamePrefixMarker","mdxJsxTextTagNameLocal","mdxJsxTextTagExpressionAttribute","mdxJsxTextTagExpressionAttributeMarker","mdxJsxTextTagExpressionAttributeValue","mdxJsxTextTagAttribute","mdxJsxTextTagAttributeName","mdxJsxTextTagAttributeNamePrimary","mdxJsxTextTagAttributeNamePrefixMarker","mdxJsxTextTagAttributeNameLocal","mdxJsxTextTagAttributeInitializerMarker","mdxJsxTextTagAttributeValueLiteral","mdxJsxTextTagAttributeValueLiteralMarker","mdxJsxTextTagAttributeValueLiteralValue","mdxJsxTextTagAttributeValueExpression","mdxJsxTextTagAttributeValueExpressionMarker","mdxJsxTextTagAttributeValueExpressionValue")}}function dC(t,i){return{concrete:!0,name:"mdxJsxFlowTag",tokenize:a};function a(o,s,c){const u=this;return d;function d(g){return p(g)}function p(g){return Xw.call(u,o,f,c,t,i.acornOptions,i.addResult,!1,"mdxJsxFlowTag","mdxJsxFlowTagMarker","mdxJsxFlowTagClosingMarker","mdxJsxFlowTagSelfClosingMarker","mdxJsxFlowTagName","mdxJsxFlowTagNamePrimary","mdxJsxFlowTagNameMemberMarker","mdxJsxFlowTagNameMember","mdxJsxFlowTagNamePrefixMarker","mdxJsxFlowTagNameLocal","mdxJsxFlowTagExpressionAttribute","mdxJsxFlowTagExpressionAttributeMarker","mdxJsxFlowTagExpressionAttributeValue","mdxJsxFlowTagAttribute","mdxJsxFlowTagAttributeName","mdxJsxFlowTagAttributeNamePrimary","mdxJsxFlowTagAttributeNamePrefixMarker","mdxJsxFlowTagAttributeNameLocal","mdxJsxFlowTagAttributeInitializerMarker","mdxJsxFlowTagAttributeValueLiteral","mdxJsxFlowTagAttributeValueLiteralMarker","mdxJsxFlowTagAttributeValueLiteralValue","mdxJsxFlowTagAttributeValueExpression","mdxJsxFlowTagAttributeValueExpressionMarker","mdxJsxFlowTagAttributeValueExpressionValue")(g)}function f(g){return Fe(g)?Ve(o,y,"whitespace")(g):y(g)}function y(g){const x=u.parser.constructs.flow[123],v=Array.isArray(x)?x:x?[x]:[];let w;for(const A of v)if(A.name==="mdxFlowExpression"){w=A;break}return g===60?d(g):g===123&&w?o.attempt(w,y,c)(g):g===null||Ce(g)?s(g):c(g)}}}function Wv(t){const i={},a=i.acorn;let o;if(a){if(!a.parse||!a.parseExpressionAt)throw new Error("Expected a proper `acorn` instance passed in as `options.acorn`");o=Object.assign({ecmaVersion:2024,sourceType:"module"},i.acornOptions,{locations:!0})}else if(i.acornOptions||i.addResult)throw new Error("Expected an `acorn` instance passed in as `options.acorn`");return{flow:{60:dC(a||void 0,{acornOptions:o,addResult:i.addResult||void 0})},text:{60:cC(a||void 0,{acornOptions:o,addResult:i.addResult||void 0})}}}function ex(t,i){const a=String(t);if(typeof i!="string")throw new TypeError("Expected character");let o=0,s=a.indexOf(i);for(;s!==-1;)o++,s=a.indexOf(i,s+i.length);return o}const hC=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],tx={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function Zw(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=48&&i<=57}function fC(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=97&&i<=102||i>=65&&i<=70||i>=48&&i<=57}function mC(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=97&&i<=122||i>=65&&i<=90}function nx(t){return mC(t)||Zw(t)}const pC=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function Xu(t,i){const a=i||{},o=typeof a.additional=="string"?a.additional.charCodeAt(0):a.additional,s=[];let c=0,u=-1,d="",p,f;a.position&&("start"in a.position||"indent"in a.position?(f=a.position.indent,p=a.position.start):p=a.position);let y=(p?p.line:0)||1,g=(p?p.column:0)||1,x=w(),v;for(c--;++c<=t.length;)if(v===10&&(g=(f?f[u]:0)||1),v=t.charCodeAt(c),v===38){const S=t.charCodeAt(c+1);if(S===9||S===10||S===12||S===32||S===38||S===60||Number.isNaN(S)||o&&S===o){d+=String.fromCharCode(v),g++;continue}const E=c+1;let C=E,R=E,_;if(S===35){R=++C;const Y=t.charCodeAt(R);Y===88||Y===120?(_="hexadecimal",R=++C):_="decimal"}else _="named";let N="",j="",z="";const B=_==="named"?nx:_==="decimal"?Zw:fC;for(R--;++R<=t.length;){const Y=t.charCodeAt(R);if(!B(Y))break;z+=String.fromCharCode(Y),_==="named"&&hC.includes(z)&&(N=z,j=kl(z))}let I=t.charCodeAt(R)===59;if(I){R++;const Y=_==="named"?kl(z):!1;Y&&(N=z,j=Y)}let X=1+R-E,oe="";if(!(!I&&a.nonTerminated===!1))if(!z)_!=="named"&&A(4,X);else if(_==="named"){if(I&&!j)A(5,1);else if(N!==z&&(R=C+N.length,X=1+R-C,I=!1),!I){const Y=N?1:3;if(a.attribute){const P=t.charCodeAt(R);P===61?(A(Y,X),j=""):nx(P)?j="":A(Y,X)}else A(Y,X)}oe=j}else{I||A(2,X);let Y=Number.parseInt(z,_==="hexadecimal"?16:10);if(gC(Y))A(7,X),oe="�";else if(Y in tx)A(6,X),oe=tx[Y];else{let P="";yC(Y)&&A(6,X),Y>65535&&(Y-=65536,P+=String.fromCharCode(Y>>>10|55296),Y=56320|Y&1023),oe=P+String.fromCharCode(Y)}}if(oe){T(),x=w(),c=R-1,g+=R-E+1,s.push(oe);const Y=w();Y.offset++,a.reference&&a.reference.call(a.referenceContext||void 0,oe,{start:x,end:Y},t.slice(E-1,R)),x=Y}else z=t.slice(E-1,R),d+=z,g+=z.length,c=R-1}else v===10&&(y++,u++,g=0),Number.isNaN(v)?T():(d+=String.fromCharCode(v),g++);return s.join("");function w(){return{line:y,column:g,offset:c+((p?p.offset:0)||0)}}function A(S,E){let C;a.warning&&(C=w(),C.column+=E,C.offset+=E,a.warning.call(a.warningContext||void 0,pC[S],C,S))}function T(){d&&(s.push(d),a.text&&a.text.call(a.textContext||void 0,d,{start:x,end:w()}),d="")}}function gC(t){return t>=55296&&t<=57343||t>1114111}function yC(t){return t>=1&&t<=8||t===11||t>=13&&t<=31||t>=127&&t<=159||t>=64976&&t<=65007||(t&65535)===65535||(t&65535)===65534}function ix(){return{canContainEols:["mdxJsxTextElement"],enter:{mdxJsxFlowTag:o,mdxJsxFlowTagClosingMarker:s,mdxJsxFlowTagAttribute:g,mdxJsxFlowTagExpressionAttribute:x,mdxJsxFlowTagAttributeValueLiteral:t,mdxJsxFlowTagAttributeValueExpression:t,mdxJsxFlowTagSelfClosingMarker:u,mdxJsxTextTag:o,mdxJsxTextTagClosingMarker:s,mdxJsxTextTagAttribute:g,mdxJsxTextTagExpressionAttribute:x,mdxJsxTextTagAttributeValueLiteral:t,mdxJsxTextTagAttributeValueExpression:t,mdxJsxTextTagSelfClosingMarker:u},exit:{mdxJsxFlowTagClosingMarker:d,mdxJsxFlowTagNamePrimary:p,mdxJsxFlowTagNameMember:f,mdxJsxFlowTagNameLocal:y,mdxJsxFlowTagExpressionAttribute:v,mdxJsxFlowTagExpressionAttributeValue:a,mdxJsxFlowTagAttributeNamePrimary:w,mdxJsxFlowTagAttributeNameLocal:A,mdxJsxFlowTagAttributeValueLiteral:T,mdxJsxFlowTagAttributeValueLiteralValue:a,mdxJsxFlowTagAttributeValueExpression:S,mdxJsxFlowTagAttributeValueExpressionValue:a,mdxJsxFlowTagSelfClosingMarker:E,mdxJsxFlowTag:C,mdxJsxTextTagClosingMarker:d,mdxJsxTextTagNamePrimary:p,mdxJsxTextTagNameMember:f,mdxJsxTextTagNameLocal:y,mdxJsxTextTagExpressionAttribute:v,mdxJsxTextTagExpressionAttributeValue:a,mdxJsxTextTagAttributeNamePrimary:w,mdxJsxTextTagAttributeNameLocal:A,mdxJsxTextTagAttributeValueLiteral:T,mdxJsxTextTagAttributeValueLiteralValue:a,mdxJsxTextTagAttributeValueExpression:S,mdxJsxTextTagAttributeValueExpressionValue:a,mdxJsxTextTagSelfClosingMarker:E,mdxJsxTextTag:C}};function t(){this.buffer()}function i(j){return{line:j.line,column:j.column,offset:j.offset}}function a(j){this.config.enter.data.call(this,j),this.config.exit.data.call(this,j)}function o(j){const z={name:void 0,attributes:[],close:!1,selfClosing:!1,start:j.start,end:j.end};this.data.mdxJsxTagStack||(this.data.mdxJsxTagStack=[]),this.data.mdxJsxTag=z,this.buffer()}function s(j){if(this.data.mdxJsxTagStack.length===0)throw new ut("Unexpected closing slash `/` in tag, expected an open tag first",{start:j.start,end:j.end},"mdast-util-mdx-jsx:unexpected-closing-slash")}function c(j){if(this.data.mdxJsxTag.close)throw new ut("Unexpected attribute in closing tag, expected the end of the tag",{start:j.start,end:j.end},"mdast-util-mdx-jsx:unexpected-attribute")}function u(j){if(this.data.mdxJsxTag.close)throw new ut("Unexpected self-closing slash `/` in closing tag, expected the end of the tag",{start:j.start,end:j.end},"mdast-util-mdx-jsx:unexpected-self-closing-slash")}function d(){const j=this.data.mdxJsxTag;j.close=!0}function p(j){const z=this.data.mdxJsxTag;z.name=this.sliceSerialize(j)}function f(j){const z=this.data.mdxJsxTag;z.name+="."+this.sliceSerialize(j)}function y(j){const z=this.data.mdxJsxTag;z.name+=":"+this.sliceSerialize(j)}function g(j){const z=this.data.mdxJsxTag;c.call(this,j),z.attributes.push({type:"mdxJsxAttribute",name:"",value:null,position:{start:i(j.start),end:void 0}})}function x(j){const z=this.data.mdxJsxTag;c.call(this,j),z.attributes.push({type:"mdxJsxExpressionAttribute",value:"",position:{start:i(j.start),end:void 0}}),this.buffer()}function v(j){const z=this.data.mdxJsxTag,B=z.attributes[z.attributes.length-1];B.type;const I=j.estree;B.value=this.resume(),B.position,B.position.end=i(j.end),I&&(B.data={estree:I})}function w(j){const z=this.data.mdxJsxTag,B=z.attributes[z.attributes.length-1];B.type,B.name=this.sliceSerialize(j),B.position,B.position.end=i(j.end)}function A(j){const z=this.data.mdxJsxTag,B=z.attributes[z.attributes.length-1];B.type,B.name+=":"+this.sliceSerialize(j),B.position,B.position.end=i(j.end)}function T(j){const z=this.data.mdxJsxTag,B=z.attributes[z.attributes.length-1];B.value=Xu(this.resume(),{nonTerminated:!1}),B.position,B.position.end=i(j.end)}function S(j){const z=this.data.mdxJsxTag,B=z.attributes[z.attributes.length-1];B.type;const I={type:"mdxJsxAttributeValueExpression",value:this.resume()},X=j.estree;X&&(I.data={estree:X}),B.value=I,B.position,B.position.end=i(j.end)}function E(){const j=this.data.mdxJsxTag;j.selfClosing=!0}function C(j){const z=this.data.mdxJsxTag,B=this.data.mdxJsxTagStack,I=B[B.length-1];if(z.close&&I.name!==z.name)throw new ut("Unexpected closing tag `"+N(z)+"`, expected corresponding closing tag for `"+N(I)+"` ("+_i(I)+")",{start:j.start,end:j.end},"mdast-util-mdx-jsx:end-tag-mismatch");this.resume(),z.close?B.pop():this.enter({type:j.type==="mdxJsxTextTag"?"mdxJsxTextElement":"mdxJsxFlowElement",name:z.name||null,attributes:z.attributes,children:[]},j,R),z.selfClosing||z.close?this.exit(j,_):B.push(z)}function R(j,z){const B=this.data.mdxJsxTagStack,I=B[B.length-1],X=j?" before the end of `"+j.type+"`":"",oe=j?{start:j.start,end:j.end}:void 0;throw new ut("Expected a closing tag for `"+N(I)+"` ("+_i({start:z.start,end:z.end})+")"+X,oe,"mdast-util-mdx-jsx:end-tag-mismatch")}function _(j,z){const B=this.data.mdxJsxTag;throw new ut("Expected the closing tag `"+N(B)+"` either after the end of `"+z.type+"` ("+_i(z.end)+") or another opening tag after the start of `"+z.type+"` ("+_i(z.start)+")",{start:j.start,end:j.end},"mdast-util-mdx-jsx:end-tag-mismatch")}function N(j){return"<"+(j.close?"/":"")+(j.name||"")+">"}}function vm(t,i,a,o,s,c,u,d,p,f,y,g,x,v,w){let A,T;return S;function S(M){return t.enter(o),t.enter(s),t.consume(M),t.exit(s),E}function E(M){return M===35?(A=u,C(M)):M===46?(A=d,C(M)):w&&Fe(M)?Ve(t,E,"whitespace")(M):!w&&We(M)?zi(t,E)(M):M===null||Ce(M)||Ht(M)||ka(M)&&M!==45&&M!==95?P(M):(t.enter(c),t.enter(p),t.consume(M),N)}function C(M){const V=A+"Marker";return t.enter(c),t.enter(A),t.enter(V),t.consume(M),t.exit(V),R}function R(M){if(M===null||M===34||M===35||M===39||M===46||M===60||M===61||M===62||M===96||M===125||We(M))return a(M);const V=A+"Value";return t.enter(V),t.consume(M),_}function _(M){if(M===null||M===34||M===39||M===60||M===61||M===62||M===96)return a(M);if(M===35||M===46||M===125||We(M)){const V=A+"Value";return t.exit(V),t.exit(A),t.exit(c),E(M)}return t.consume(M),_}function N(M){return M===null||Ce(M)||Ht(M)||ka(M)&&M!==45&&M!==46&&M!==58&&M!==95?(t.exit(p),w&&Fe(M)?Ve(t,j,"whitespace")(M):!w&&We(M)?zi(t,j)(M):j(M)):(t.consume(M),N)}function j(M){return M===61?(t.enter(f),t.consume(M),t.exit(f),z):(t.exit(c),E(M))}function z(M){return M===null||M===60||M===61||M===62||M===96||M===125||w&&Ce(M)?a(M):M===34||M===39?(t.enter(y),t.enter(x),t.consume(M),t.exit(x),T=M,I):w&&Fe(M)?Ve(t,z,"whitespace")(M):!w&&We(M)?zi(t,z)(M):(t.enter(g),t.enter(v),t.consume(M),T=void 0,B)}function B(M){return M===null||M===34||M===39||M===60||M===61||M===62||M===96?a(M):M===125||We(M)?(t.exit(v),t.exit(g),t.exit(c),E(M)):(t.consume(M),B)}function I(M){return M===T?(t.enter(x),t.consume(M),t.exit(x),t.exit(y),t.exit(c),Y):(t.enter(g),X(M))}function X(M){return M===T?(t.exit(g),I(M)):M===null?a(M):Ce(M)?w?a(M):zi(t,X)(M):(t.enter(v),t.consume(M),oe)}function oe(M){return M===T||M===null||Ce(M)?(t.exit(v),X(M)):(t.consume(M),oe)}function Y(M){return M===125||We(M)?E(M):P(M)}function P(M){return M===125?(t.enter(s),t.consume(M),t.exit(s),t.exit(o),i):a(M)}}function xm(t,i,a,o,s,c,u){let d=0,p=0,f;return y;function y(T){return t.enter(o),t.enter(s),t.consume(T),t.exit(s),g}function g(T){return T===93?(t.enter(s),t.consume(T),t.exit(s),t.exit(o),i):(t.enter(c),x(T))}function x(T){if(T===93&&!p)return A(T);const S=t.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:f});return f&&(f.next=S),f=S,v(T)}function v(T){return T===null||d>999||T===91&&++p>32?a(T):T===93&&!p--?(t.exit("chunkText"),A(T)):Ce(T)?u?a(T):(t.consume(T),t.exit("chunkText"),x):(t.consume(T),T===92?w:v)}function w(T){return T===91||T===92||T===93?(t.consume(T),d++,v):v(T)}function A(T){return t.exit(c),t.enter(s),t.consume(T),t.exit(s),t.exit(o),i}}function wm(t,i,a,o){const s=this;return c;function c(d){return d===null||Ce(d)||ka(d)||Ht(d)?a(d):(t.enter(o),t.consume(d),u)}function u(d){return d===null||Ce(d)||Ht(d)||ka(d)&&d!==45&&d!==95?(t.exit(o),s.previous===45||s.previous===95?a(d):i(d)):(t.consume(d),u)}}const bC={tokenize:wC,concrete:!0},vC={tokenize:SC,partial:!0},xC={tokenize:kC,partial:!0},cu={tokenize:TC,partial:!0};function wC(t,i,a){const o=this,s=o.events[o.events.length-1],c=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let u=0,d;return p;function p(B){return t.enter("directiveContainer"),t.enter("directiveContainerFence"),t.enter("directiveContainerSequence"),f(B)}function f(B){return B===58?(t.consume(B),u++,f):u<3?a(B):(t.exit("directiveContainerSequence"),wm.call(o,t,y,a,"directiveContainerName")(B))}function y(B){return B===91?t.attempt(vC,g,g)(B):g(B)}function g(B){return B===123?t.attempt(xC,x,x)(B):x(B)}function x(B){return Ve(t,v,"whitespace")(B)}function v(B){return t.exit("directiveContainerFence"),B===null?j(B):Ce(B)?o.interrupt?i(B):t.attempt(cu,w,j)(B):a(B)}function w(B){return B===null?j(B):Ce(B)?t.check(cu,C,j)(B):(t.enter("directiveContainerContent"),A(B))}function A(B){return t.attempt({tokenize:z,partial:!0},N,c?Ve(t,T,"linePrefix",c+1):T)(B)}function T(B){return B===null?N(B):Ce(B)?t.check(cu,E,N)(B):E(B)}function S(B){if(B===null){const I=t.exit("chunkDocument");return o.parser.lazy[I.start.line]=!1,N(B)}return Ce(B)?t.check(cu,R,_)(B):(t.consume(B),S)}function E(B){const I=t.enter("chunkDocument",{contentType:"document",previous:d});return d&&(d.next=I),d=I,S(B)}function C(B){return t.enter("directiveContainerContent"),A(B)}function R(B){t.consume(B);const I=t.exit("chunkDocument");return o.parser.lazy[I.start.line]=!1,A}function _(B){const I=t.exit("chunkDocument");return o.parser.lazy[I.start.line]=!1,N(B)}function N(B){return t.exit("directiveContainerContent"),j(B)}function j(B){return t.exit("directiveContainer"),i(B)}function z(B,I,X){let oe=0;return Ve(B,Y,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function Y(V){return B.enter("directiveContainerFence"),B.enter("directiveContainerSequence"),P(V)}function P(V){return V===58?(B.consume(V),oe++,P):oe<u?X(V):(B.exit("directiveContainerSequence"),Ve(B,M,"whitespace")(V))}function M(V){return V===null||Ce(V)?(B.exit("directiveContainerFence"),I(V)):X(V)}}}function SC(t,i,a){return xm(t,i,a,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function kC(t,i,a){return vm(t,i,a,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function TC(t,i,a){const o=this;return s;function s(u){return t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),c}function c(u){return o.parser.lazy[o.now().line]?a(u):i(u)}}const AC={tokenize:RC},EC={tokenize:MC,partial:!0},CC={tokenize:NC,partial:!0};function RC(t,i,a){const o=this;return s;function s(y){return t.enter("directiveLeaf"),t.enter("directiveLeafSequence"),t.consume(y),c}function c(y){return y===58?(t.consume(y),t.exit("directiveLeafSequence"),wm.call(o,t,u,a,"directiveLeafName")):a(y)}function u(y){return y===91?t.attempt(EC,d,d)(y):d(y)}function d(y){return y===123?t.attempt(CC,p,p)(y):p(y)}function p(y){return Ve(t,f,"whitespace")(y)}function f(y){return y===null||Ce(y)?(t.exit("directiveLeaf"),i(y)):a(y)}}function MC(t,i,a){return xm(t,i,a,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function NC(t,i,a){return vm(t,i,a,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const DC={tokenize:zC,previous:LC},jC={tokenize:_C,partial:!0},OC={tokenize:IC,partial:!0};function LC(t){return t!==58||this.events[this.events.length-1][1].type==="characterEscape"}function zC(t,i,a){const o=this;return s;function s(p){return t.enter("directiveText"),t.enter("directiveTextMarker"),t.consume(p),t.exit("directiveTextMarker"),wm.call(o,t,c,a,"directiveTextName")}function c(p){return p===58?a(p):p===91?t.attempt(jC,u,u)(p):u(p)}function u(p){return p===123?t.attempt(OC,d,d)(p):d(p)}function d(p){return t.exit("directiveText"),i(p)}}function _C(t,i,a){return xm(t,i,a,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function IC(t,i,a){return vm(t,i,a,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function HC(){return{text:{58:DC},flow:{58:[bC,AC]}}}const Zu=(function(t){if(t==null)return UC;if(typeof t=="function")return Ku(t);if(typeof t=="object")return Array.isArray(t)?BC(t):qC(t);if(typeof t=="string")return PC(t);throw new Error("Expected function, string, or object as test")});function BC(t){const i=[];let a=-1;for(;++a<t.length;)i[a]=Zu(t[a]);return Ku(o);function o(...s){let c=-1;for(;++c<i.length;)if(i[c].apply(this,s))return!0;return!1}}function qC(t){const i=t;return Ku(a);function a(o){const s=o;let c;for(c in t)if(s[c]!==i[c])return!1;return!0}}function PC(t){return Ku(i);function i(a){return a&&a.type===t}}function Ku(t){return i;function i(a,o,s){return!!(FC(a)&&t.call(this,a,typeof o=="number"?o:void 0,s||void 0))}}function UC(){return!0}function FC(t){return t!==null&&typeof t=="object"&&"type"in t}const Kw=[],VC=!0,Ff=!1,$C="skip";function Qw(t,i,a,o){let s;typeof i=="function"&&typeof a!="function"?(o=a,a=i):s=i;const c=Zu(s),u=o?-1:1;d(t,void 0,[])();function d(p,f,y){const g=p&&typeof p=="object"?p:{};if(typeof g.type=="string"){const v=typeof g.tagName=="string"?g.tagName:typeof g.name=="string"?g.name:void 0;Object.defineProperty(x,"name",{value:"node ("+(p.type+(v?"<"+v+">":""))+")"})}return x;function x(){let v=Kw,w,A,T;if((!i||c(p,f,y[y.length-1]||void 0))&&(v=GC(a(p,y)),v[0]===Ff))return v;if("children"in p&&p.children){const S=p;if(S.children&&v[0]!==$C)for(A=(o?S.children.length:-1)+u,T=y.concat(S);A>-1&&A<S.children.length;){const E=S.children[A];if(w=d(E,A,T)(),w[0]===Ff)return w;A=typeof w[1]=="number"?w[1]:A+u}}return v}}}function GC(t){return Array.isArray(t)?t:typeof t=="number"?[VC,t]:t==null?Kw:[t]}function YC(){return{canContainEols:["textDirective"],enter:{directiveContainer:JC,directiveContainerAttributes:Kh,directiveContainerLabel:KC,directiveLeaf:XC,directiveLeafAttributes:Kh,directiveText:ZC,directiveTextAttributes:Kh},exit:{directiveContainer:af,directiveContainerAttributeClassValue:Wh,directiveContainerAttributeIdValue:Qh,directiveContainerAttributeName:tf,directiveContainerAttributeValue:ef,directiveContainerAttributes:nf,directiveContainerLabel:QC,directiveContainerName:Zh,directiveLeaf:af,directiveLeafAttributeClassValue:Wh,directiveLeafAttributeIdValue:Qh,directiveLeafAttributeName:tf,directiveLeafAttributeValue:ef,directiveLeafAttributes:nf,directiveLeafName:Zh,directiveText:af,directiveTextAttributeClassValue:Wh,directiveTextAttributeIdValue:Qh,directiveTextAttributeName:tf,directiveTextAttributeValue:ef,directiveTextAttributes:nf,directiveTextName:Zh}}}function JC(t){Sm.call(this,"containerDirective",t)}function XC(t){Sm.call(this,"leafDirective",t)}function ZC(t){Sm.call(this,"textDirective",t)}function Sm(t,i){this.enter({type:t,name:"",attributes:{},children:[]},i)}function Zh(t){const i=this.stack[this.stack.length-1];i.type==="containerDirective"||i.type==="leafDirective"||i.type,i.name=this.sliceSerialize(t)}function KC(t){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},t)}function QC(t){this.exit(t)}function Kh(){this.data.directiveAttributes=[],this.buffer()}function Qh(t){this.data.directiveAttributes.push(["id",Xu(this.sliceSerialize(t),{attribute:!0})])}function Wh(t){this.data.directiveAttributes.push(["class",Xu(this.sliceSerialize(t),{attribute:!0})])}function ef(t){const i=this.data.directiveAttributes;i[i.length-1][1]=Xu(this.sliceSerialize(t),{attribute:!0})}function tf(t){this.data.directiveAttributes.push([this.sliceSerialize(t),""])}function nf(){const t=this.data.directiveAttributes,i={};let a=-1;for(;++a<t.length;){const s=t[a];s[0]==="class"&&i.class?i.class+=" "+s[1]:i[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const o=this.stack[this.stack.length-1];o.type==="containerDirective"||o.type==="leafDirective"||o.type,o.attributes=i}function af(t){this.exit(t)}function bi(t,i,a){i(t,a);for(const o of t.children??[])bi(o,i,t)}function Qu(t){return t.type==="image"?String(t.alt??""):t.value??t.children?.map(Qu).join("")??""}function Be(t){return{start:t.position?.start.offset??0,end:t.position?.end.offset??0}}function _t(t,i){return t.start<i.end&&i.start<t.end}function Eu(t){const i=[0];for(let a=0;a<t.length;a++)t[a]==="\r"?(t[a+1]===`
`&&a++,i.push(a+1)):t[a]===`
`&&i.push(a+1);return i}function ya(t,i){let a=0,o=i.length;for(;a+1<o;){const s=a+o>>>1;i[s]<=t?a=s:o=s}return{offset:t,line:a+1,column:t-i[a]+1}}function WC(t){return t.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu,"").replace(/[\s_]+/g,"-").replace(/^-+|-+$/g,"")||"section"}function gn(t,i=!1){if(typeof t!="string")return;const a=t.trim().replace(/[\u0000-\u0020\u007f]/g,"");if(/^(?:https?:|mailto:|tel:)/i.test(a)||!/^[a-z][a-z\d+.-]*:/i.test(a)||i&&/^data:image\/(?:png|gif|jpe?g|webp|avif);base64,/i.test(a))return t}function eR(t,i){i.sort((u,d)=>u.at-d.at||(u.order??0)-(d.order??0));const a=[],o=[];let s=0,c=0;for(const u of i)a.push(t.slice(s,u.at),u.insert),o.push({from:u.at+c,to:u.at+c+u.insert.length,at:u.at,delta:c+u.insert.length}),s=u.at,c+=u.insert.length;return a.push(t.slice(s)),{value:a.join(""),original(u){let d=0,p=o.length;for(;d<p;){const y=d+p>>>1;o[y].from<=u?d=y+1:p=y}const f=o[d-1];return Math.min(t.length,f?u<f.to?f.at:u-f.delta:u)}}}function tR(t,i,a,o,s=new Set){if(!o&&(!i.size||!t.includes("::"))||!/[<:`~$]/.test(t))return{value:t,original:N=>N,incomplete:new Set};const c=[],u=[],d=new Set,p=[],f=[];let y,g,x,v=0;const w=/[^\r\n]*(?:\r\n|\r|\n|$)/g;for(const N of t.matchAll(w)){if(!N[0])continue;const j=N[0].replace(/[\r\n]+$/,""),z=N.index,B=/^(?: {0,3}>[ \t]?)*(?: {0,3}(?:[-+*]|\d+[.)])[ \t]+)? {0,3}/.exec(j)[0],I=j.slice(B.length),X=z+B.length;if(x&&!/^:{2,}[ \t]*$/.test(I))continue;if(x&&(u.push({start:x.content,end:z}),x=void 0),y){new RegExp(`^${y.marker}{${y.size},}[ \\t]*$`).test(I)&&(u.push({start:y.start,end:z+N[0].length}),y=void 0);continue}const oe=/^(`{3,}|~{3,}|\${2,})(.*)$/.exec(I);if(oe&&!(oe[1][0]==="`"&&oe[2].includes("`"))){y={start:X,marker:oe[1][0]==="$"?"\\$":oe[1][0],size:oe[1].length},o&&!/[\r\n]$/.test(N[0])&&(g={start:X});continue}if(/^[ \t]/.test(I)){u.push({start:z,end:z+N[0].length});continue}const Y=/^(:{2,})([a-zA-Z][\w-]*)(.*)$/.exec(I);if(Y&&i.has(Y[2])){const M=Y[3].trim();if(!/^(?:\[(?:\\.|[^\]])*\])?(?:\{(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^{}"'])*\})?$/.test(M)){o&&z+N[0].length===t.length&&(g={start:X,name:Y[2]});continue}const $={start:X,marker:X,size:Y[1].length,depth:f.length};p.push($),f.push($),v=Math.max(v,$.depth),s.has(Y[2])&&/[\r\n]$/.test(N[0])&&($.content=z+N[0].length,$.prefix=B.replace(/[-+*]|\d+[.)]/g,Z=>" ".repeat(Z.length)),x=$);continue}const P=/^(:{2,})[ \t]*$/.exec(I);if(P&&f.length){if(P[1].length>2){let V=-1;for(let $=f.length-1;$>=0;$--)if(f[$].size>2&&f[$].size<=P[1].length){V=$;break}if(V>=0)for(const $ of f.splice(V+1))$.leaf=!0}const M=f[f.length-1];P[1].length>=M.size&&(M.close=X,M.end=z+j.length,f.pop())}else o&&/^::[\w-]*$/.test(I)&&z+N[0].length===t.length&&(g={start:X})}y&&(u.push({start:y.start,end:t.length}),o&&d.add(y.start)),x&&u.push({start:x.content,end:t.length});const A=p.filter(N=>!N.leaf&&(N.close!==void 0||o)),T=A.some(N=>N.size===2),S=Math.max(3,...A.map(N=>N.size));if(T)for(const N of A){const j=S+v-N.depth;if(j>N.size&&c.push({at:N.marker,insert:":".repeat(j-N.size)}),N.close!==void 0){const z=/^:+/.exec(t.slice(N.close))[0].length;j>z&&c.push({at:N.close,insert:":".repeat(j-z)})}}for(const N of A)if(N.content!==void 0){const j=t.slice(N.content,N.close??t.length),z="~".repeat(Math.max(3,...[...j.matchAll(/~+/g)].map(B=>B[0].length+1)));c.push({at:N.content,insert:`${N.prefix}${z}
`,order:-2}),N.close!==void 0&&c.push({at:N.close,insert:`${z}
${N.prefix}`,order:-1})}if(o)for(const N of f)d.add(N.start);const E=[];if(o&&a.size&&t.includes("<")){let N=0,j=0,z=0;for(let B=0;B<(g?.start??t.length);B++){for(;u[N]&&u[N].end<=B;)N++;if(u[N]?.start<=B){B=u[N].end-1;continue}if(t[B]==="\\"){B++;continue}if(!j&&i.has("math")&&t[B]==="$"){const P=/^\$+/.exec(t.slice(B))[0].length,M=t.indexOf("$".repeat(P),B+P);if(M<0){g={start:B};break}B=M+P-1;continue}if(t[B]==="`"){const P=/^`+/.exec(t.slice(B))[0].length;j?j===P&&(j=0):(j=P,z=B),B+=P-1;continue}if(j||t[B]!=="<")continue;const I=/^<(\/?)([a-zA-Z][\w-]*)/.exec(t.slice(B));if(!I){/^<\/?$/.test(t.slice(B))&&(g={start:B});continue}const X=I[2];if(!a.has(X)){[...a].some(P=>P.startsWith(X))&&B+I[0].length===t.length&&(g={start:B});continue}let oe=B+I[0].length,Y="";for(;oe<t.length;oe++){const P=t[oe];if(Y)P===Y&&(Y="");else if(P==='"'||P==="'")Y=P;else if(P===">")break}if(oe===t.length){g={start:B,name:I[1]?void 0:X};break}I[1]?E.at(-1)?.name===X&&E.pop():t[oe-1]!=="/"&&E.push({name:X,start:B,block:/^(?: {0,3}> ?)*\s*$/.test(t.slice(t.lastIndexOf(`
`,B-1)+1,B))&&/^[ \t]*(?:\r?\n|$)/.test(t.slice(oe+1))}),B=oe}j&&(g={start:Math.min(z,g?.start??t.length)})}for(const N of E)d.add(N.start);const C=g?.start??t.length,R=eR(t.slice(0,C),c.filter(N=>N.at<C)),_=E.reverse().map(N=>`${N.block?`

`:""}</${N.name}>`).join("");return{...R,value:R.value+_,incomplete:d,hidden:g,recoveryOffset:d.size||g?Math.min(...d,g?.start??1/0):void 0}}function nR(t,i,a){const o=t.children?.at(-1);if(o?.type==="paragraph"&&o.position){const c=i.slice(o.position.start.offset);if(/^ {0,3}\|[^\r\n]*(?:(?:\r\n|\r|\n)[|:\- \t]*)?$/.test(c)){o.children=[];return}}let s=i.length;bi(t.children?.at(-1)??t,c=>{if(c.type!=="text"||!c.position)return;const{start:u,end:d}=c.position,p=i.slice(u.offset);for(const f of p.slice(0,d.offset-u.offset).matchAll(/[!\[`*_~\$&^]/g)){const y=f.index;let g=0;for(let v=y-1;v>=0&&p[v]==="\\";v--)g++;if(g%2||p[y]==="_"&&/[\p{L}\p{N}]/u.test(p[y-1]??"")&&/[\p{L}\p{N}]/u.test(p[y+1]??""))continue;const x=p.slice(y).trimEnd();if(/^(?:\^\[[^\]]*$|!?(?:\[[^\]]*$|\[[^\]]*\]\([^)]*$)|`+[^`]*$|\*{1,3}(?:\S[^*]*)?$|_{1,3}(?:\S[^_]*)?$|~{1,2}(?:\S[^~]*)?$|\$[^$]*$|&(?:#x?[\da-f]*|[a-z]*)$)/i.test(x)){s=Math.min(s,u.offset+y);break}}}),s!==i.length&&bi(t,c=>{c.children&&(c.children=c.children.filter(u=>(u.position?.start.offset??0)<s)),!(c.type!=="text"||!c.position||c.position.end.offset<=s)&&(c.value=bm(i.slice(c.position.start.offset,s)),c.position={start:c.position.start,end:ya(s,a)})})}function iR(t){const i=new Set,a=new Set,o=new Set,s=new Map;for(const c of t){if(i.has(c.name))throw new Error(`Duplicate LiMR extension: ${c.name}. Use replaceExtension() to replace it explicitly.`);i.add(c.name);for(const[u,d,p]of[[c.tags,a,"tag"],[c.directives,o,"directive"]])for(const f of u??[]){if(d.has(f))throw new Error(`Duplicate LiMR ${p}: ${f}`);d.add(f)}for(const u of[...c.tags??[],...c.directives??[]]){if(s.has(u)&&s.get(u)!==c)throw new Error(`Duplicate LiMR component syntax: ${u}`);s.set(u,c)}}}function ax(t){iR(t);const i=new Map(t.flatMap(A=>(A.tags??[]).map(T=>[T,A]))),a=new Map(t.flatMap(A=>[...new Set([...A.tags??[],...A.directives??[]])].map(T=>[T,A]))),o=new Set(a.keys()),s=new Set(i.keys()),c=new Set([...a].filter(([,A])=>A.literal).map(([A])=>A)),u=t.flatMap(A=>[...A.micromark??[]]),d=t.flatMap(A=>[...A.mdast??[]]),p=[...u],f=[...d];a.size&&(u.push(HC()),d.push(YC()));const y=i.size?[...u,{disable:{null:["htmlFlow","htmlText"]}},Wv()]:u,g=i.size?[...d,ix()]:d,x=[...p,{disable:{null:["htmlFlow","htmlText"]}},Wv()],v=[...f,ix()];let w;return(A,T,S,E,C="")=>{const R=C?`${C}

limr-definition-boundary

`:"",_=w,N=S.streaming&&_&&!R&&_.offset===T&&A.startsWith(_.fragment)&&!new RegExp(`(?:^|[\\r\\n]) {0,3}${_.fence[0]}{${_.fence.length},}[ \\t]*(?=[\\r\\n]|$)`).test(A.slice(Math.max(_.content,_.fragment.lastIndexOf(`
`)+1,_.fragment.lastIndexOf("\r")+1))),j=N?{value:A,original:ge=>ge,incomplete:new Set([0]),recoveryOffset:0,hidden:void 0}:tR(A,o,s,S.streaming,c),z=R+j.value,B=a.size>0&&/:[a-zA-Z]/.test(z),I=i.size>0&&z.includes("<"),X=B?u:p,oe=B?d:f,Y=ge=>T+j.original(Math.max(0,ge-R.length)),P=E.length?E:Eu(S.source),M=[];let V;const $=ge=>ya(ge,E.length?E:V??=Eu(S.source));let Z=j.recoveryOffset===void 0?void 0:T+j.recoveryOffset,me;try{me=N?{type:"root",children:[{..._.node,value:A.slice(_.content).replace(/(?:\r\n|\r|\n)$/,""),position:{start:{offset:0,line:1,column:1},end:{offset:A.length,line:0,column:0}}}]}:Tl(z,{extensions:I?B?y:x:X,mdastExtensions:I?B?g:v:oe})}catch(ge){me=Tl(z,{extensions:X,mdastExtensions:oe}),Z=T,M.push({message:ge instanceof Error?ge.message:String(ge),offset:T})}me.children=me.children?.filter(ge=>(ge.position?.start.offset??0)>=R.length);const q=me.children?.length===1?me.children[0]:void 0,ze=!R&&q?.type==="code"&&j.incomplete.has(0)&&/^(`{3,}|~{3,})[^\r\n]*(?:\r\n|\r|\n)/.exec(A);if(w=ze?{fragment:A,offset:T,node:{...q},fence:ze[1],content:ze[0].length}:void 0,(T||R.length||i.size||a.size||S.streaming)&&bi(me,ge=>{if(ge.position&&(T||R.length||j.value!==A||N)){const H=Y(ge.position.start.offset),U=Math.max(H,Y(ge.position.end.offset));ge.position={start:ya(H,P),end:ya(U,P)}}if(ge.position&&j.incomplete.has(ge.position.start.offset-T)&&(ge.incomplete=!0),ge.type==="mdxJsxFlowElement"||ge.type==="mdxJsxTextElement"){const H=i.get(ge.name??""),U=ge.attributes,te={},he={};for(const ve of U??[])if(ve.type==="mdxJsxAttribute"&&(typeof ve.value=="string"||ve.value===null)){if(te[ve.name]=ve.value??!0,H&&typeof ve.value=="string"&&ve.position){const le=Y(ve.position.start.offset),be=Y(ve.position.end.offset),xe=S.source.slice(le,be),de=xe.search(/["']/);de>=0&&(he[ve.name]={type:"text",value:ve.value,verbatimEscapes:!0,position:{start:$(le+de+1),end:$(be-1)}})}}else M.push({message:"JSX expressions are not executed. Use string attributes or pass data from React.",offset:ge.position?.start.offset});ge.inline=H?.display==="block"?!1:H?.display==="inline"?!0:ge.type==="mdxJsxTextElement",ge.type=H?"component":"html",ge.attributes=te,Object.keys(he).length&&(ge.attributeNodes=he),ge.selection=H?.selection??"content",!H&&ge.position&&(ge.value=S.source.slice(ge.position.start.offset,ge.position.end.offset),ge.children=void 0)}else if(ge.type==="containerDirective"||ge.type==="leafDirective"||ge.type==="textDirective"){const H=a.get(ge.name??"");if(H){const U=ge.position?.start.offset??0,te=S.source.indexOf(`
`,U),he=S.source.slice(U,te<0?S.source.length:te),ve=he.indexOf("{");if(ve>=0){const le={},be=/([^\s{}=]+)\s*=\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s}]+))/g,xe=he.slice(ve+1);for(const de of xe.matchAll(be)){const ae=de[1],ye=ge.attributes?.[ae];if(typeof ye!="string")continue;const Ae=de[2]!==void 0||de[3]!==void 0,Ne=(de[2]??de[3]??de[4]).length,De=U+ve+1+de.index+de[0].length-(Ae?1:0);le[ae]={type:"text",value:ye,position:{start:$(De-Ne),end:$(De)}}}Object.keys(le).length&&(ge.attributeNodes=le)}ge.inline=ge.type==="textDirective",ge.type="component",ge.selection=H.selection??"content"}}}),j.hidden){const ge=T+j.hidden.start;Z=Math.min(Z??ge,me.children?.at(-1)?.position?.start.offset??ge),me.children?.push({type:j.hidden.name?"component":"streamPending",name:j.hidden.name,incomplete:!0,position:{start:ya(ge,P),end:ya(T+A.length,P)},children:[],attributes:{}})}S.streaming&&nR(me,S.source,P),(T||R.length)&&(me.position={start:ya(T,P),end:ya(T+A.length,P)});for(const ge of t)try{ge.transform?.(me,S)}catch(H){M.push({message:H instanceof Error?H.message:String(H),extension:ge.name})}return{nodes:me.children??[],diagnostics:M,recoveryOffset:Z}}}let aR=0;class rR{id;extensions;parse;snapshot;nextBlock=0;listeners=new Set;definitionSignature="";recoveryOffset;lines=[0];facts=new WeakMap;relevant(i){let a=this.facts.get(i);if(!a){const o=[];bi(i,s=>{(s.annotation||["heading","definition","footnoteDefinition","footnoteReference","annotationDefinition","annotationReference"].includes(s.type))&&o.push(s)}),this.facts.set(i,a=o)}return a}constructor(i="",a={}){this.id=a.id??`limr-${++aR}`,this.extensions=a.extensions??[],this.parse=ax(this.extensions),this.update(i,{streaming:a.streaming})}getSnapshot=()=>this.snapshot;subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));setExtensions(i){if(i===this.extensions)return;this.parse=ax(i),this.extensions=i;const a=this.snapshot;this.update(a.source,{streaming:a.streaming},!0)}append(i){return this.update(this.snapshot.source+i,{streaming:!0})}finish(){return this.update(this.snapshot.source,{streaming:!1})}update(i,a={},o=!1){const s=this.snapshot,c=a.streaming??!1;if(!o&&s?.source===i&&s.streaming===c)return s;const u=this.extensions.some(M=>M.transform&&M.scope!=="local"),d=!o&&s?.streaming&&i.startsWith(s.source)&&!u,p=!!s?.streaming&&!c;let f=d&&s.blocks.length?s.blocks[s.blocks.length-1].range.start:0;const y=this.recoveryOffset!==void 0;d&&y&&(f=Math.min(f,this.recoveryOffset));let g=o||u?"extension":s?p?"finalize":d?"append":"replace":"initial";if(d&&s){const M=Math.max(0,s.source.length-1);for(;this.lines.length>1&&this.lines.at(-1)>M;)this.lines.pop();for(const V of Eu(i.slice(M)).slice(1))this.lines.push(M+V)}else this.lines=Eu(i);const x=this.lines,v={source:i,streaming:c,documentId:this.id};let w=f?s.blocks.filter(M=>M.range.end<=f):[];const A=[];for(const M of w)for(const V of this.relevant(M.node))if(V.type==="definition"||V.type==="footnoteDefinition"){const $=Be(V);A.push(i.slice($.start,$.end))}let T=this.parse(i.slice(f),f,v,x,A.join(`

`));const S=M=>{const V=[];for(const $ of M)for(const Z of this.relevant($))if(Z.type==="definition"||Z.type==="footnoteDefinition"){const me=Be(Z);V.push(i.slice(me.start,me.end))}return V.join("\0")};let E=S([...w.map(M=>M.node),...T.nodes]),C=i.length-f+A.join(`

`).length;const R=!!s&&E!==this.definitionSignature;f&&R&&(g="definitions",f=0,w=[],T=this.parse(i,0,v,x),E=S(T.nodes),C+=i.length),this.definitionSignature=E,this.recoveryOffset=T.recoveryOffset;const _=new Map(s?.blocks.slice(w.length).map(M=>[M.range.start,M]));let N=w.length;const j=[...w];for(let M=0;M<T.nodes.length;M++){const V=T.nodes[M],$=Be(V),Z=_.get($.start),me=c&&M===T.nodes.length-1;!R&&!y&&g==="append"&&Z&&Z.node.type===V.type&&Z.pending===me&&s.source.slice(Z.range.start,Z.range.end)===i.slice($.start,$.end)?(j.push(Z),N++):j.push({id:Z?.id??`${this.id}-b${++this.nextBlock}`,node:V,range:$,pending:me})}const z=[],B=new Map,I=new Map,X=[],oe=new Map,Y=[],P=new Map;for(const M of j)for(const V of this.relevant(M.node)){if(V.type==="heading"){const $=Qu(V),Z=WC($),me=P.get(Z)??0;P.set(Z,me+1),z.push({id:`${this.id}-${Z}${me?`-${me}`:""}`,text:$,level:Number(V.depth),range:Be(V),blockId:M.id})}if(V.type==="definition"&&!B.has(String(V.identifier))&&B.set(String(V.identifier),V),V.type==="footnoteDefinition"&&!I.has(String(V.identifier))&&I.set(String(V.identifier),V),V.type==="footnoteReference"&&!X.includes(String(V.identifier))&&X.push(String(V.identifier)),V.annotation){const $=V.annotation;(V.type!=="footnoteDefinition"||!oe.has($.id))&&oe.set($.id,$)}if(V.type==="annotationReference"){const $=Be(V);Y.push({id:`${this.id}-ref-${$.start}`,range:$,annotationIds:V.annotationIds,embedded:!0,...V.referenceRange?{referenceRange:V.referenceRange}:{}})}}this.snapshot={id:this.id,revision:(s?.revision??-1)+1,source:i,streaming:c,blocks:j,headings:s&&z.length===s.headings.length&&z.every((M,V)=>{const $=s.headings[V];return M.id===$.id&&M.text===$.text&&M.level===$.level&&M.blockId===$.blockId&&M.range.start===$.range.start&&M.range.end===$.range.end})?s.headings:z,definitions:B,footnotes:I,footnoteOrder:X,annotations:[...oe.values()],occurrences:Y,diagnostics:T.diagnostics,metrics:{parsedCharacters:C,reusedBlocks:N,parsedBlocks:T.nodes.length,fullParse:f===0,reason:g}};for(const M of this.listeners)M();return this.snapshot}}function oR(t="",i={}){return new rR(t,i)}function Ml(t,i,a,o={}){const s=t.slice(a.start,a.end),c=[],u=[];let d=0,p=!0;for(let f=0;f<s.length&&d<i.length;){let y=1,g=s[f];if(o.escapes!==!1&&s[f]==="\\"&&/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(s[f+1]??""))y=2,g=s[f+1];else if(s[f]==="&"){const x=/^&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/i.exec(s.slice(f));if(x){const v=bm(x[0]);v!==x[0]&&(y=x[0].length,g=v)}}else s[f]==="\r"&&(y=s[f+1]===`
`?2:1,g=`
`);if(i.startsWith(g,d)){for(let x=0;x<g.length;x++)c.push(a.start+f),u.push(a.start+f+y);d+=g.length}else/[\s>]/.test(g)||(p=!1);f+=y}for(d!==i.length&&(p=!1);c.length<i.length;)c.push(a.start),u.push(a.end);return{starts:c,ends:u,exact:p}}function Wu(t,i,a={}){const o={start:Math.max(0,i.start),end:Math.min(t.source.length,i.end)},s={...o},c=new Set(["strong","emphasis","delete","link","linkReference","heading","listItem","blockquote"]),u=t.source,d=(T,S)=>!u.slice(T,S).trim();function p(T){const S=Be(T);if(!_t(S,s)||S.start>=s.start&&S.end<=s.end)return;T.children?.forEach(p);let E;if(c.has(T.type)&&T.children?.length)E={start:Be(T.children[0]).start,end:Be(T.children.at(-1)).end};else if(T.type==="inlineCode"||T.type==="inlineMath"){const C=(T.type==="inlineCode"?/^`+/:/^\$+/).exec(u.slice(S.start,S.end))?.[0].length??0;E={start:S.start+C,end:S.end-C}}else if(T.type==="code"||T.type==="math"){const C=u.slice(S.start,S.end),R=/^[ \t]*(`{3,}|~{3,}|\${2,})[^\r\n]*(?:\r\n|\r|\n)/.exec(C);if(R){const _=R[1],N=/(?:\r\n|\r|\n)[ \t]*(`+|~+|\$+)[ \t]*$/.exec(C),j=N&&N[1][0]===_[0]&&N[1].length>=_.length;E={start:S.start+R[0].length,end:j?S.start+N.index:S.end}}}if(E&&(s.start>S.start&&s.start<S.end&&(s.start<=E.start||d(E.start,s.start))&&(s.start=S.start),s.end<S.end&&s.end>S.start&&(s.end>=E.end||d(s.end,E.end))&&(s.end=S.end)),T.type==="blockquote"){const C=Math.max(S.start,u.lastIndexOf(`
`,s.start-1)+1);/^[ \t]*(?:>[ \t]*)+$/.test(u.slice(C,s.start))&&(s.start=C)}}let f=0,y=t.blocks.length;for(;f<y;){const T=f+y>>>1;t.blocks[T].range.end<=o.start?f=T+1:y=T}const g=[];for(let T=f;T<t.blocks.length&&t.blocks[T].range.start<o.end;T++){const S=t.blocks[T];g.push(S),p(S.node)}const x=[],v=new Set(["paragraph","heading","code","math","table","listItem","thematicBreak","html"]);function w(T){const S=Be(T);if(_t(S,o)){if(v.has(T.type)||T.type==="component"&&!T.inline){x.push(S);return}T.children?.forEach(w)}}g.forEach(T=>w(T.node));const A=T=>({ranges:T,sourceText:T.map(S=>t.source.slice(S.start,S.end)).join(`

`)});return{documentId:t.id,revision:t.revision,text:a.text??t.source.slice(o.start,o.end),quality:a.quality??"exact",settled:a.settled??!0,raw:A([o]),syntax:A([s]),blocks:A(x.length?x:[o])}}class lR{constructor(i=128){if(this.capacity=i,i<1)throw new Error("Cache capacity must be positive")}capacity;entries=new Map;get size(){return this.entries.size}get(i){if(!this.entries.has(i))return;const a=this.entries.get(i);return this.entries.delete(i),this.entries.set(i,a),a}set(i,a){for(this.entries.delete(i),this.entries.set(i,a);this.entries.size>this.capacity;)this.entries.delete(this.entries.keys().next().value)}delete(i){this.entries.delete(i)}clear(){this.entries.clear()}}class km{values;pending=new Map;constructor(i=128){this.values=new lR(i)}acquire(i,a){const o=this.values.get(i);if(o!==void 0)return{promise:Promise.resolve(o),release(){}};let s=this.pending.get(i);if(!s){const u=new AbortController;s={promise:Promise.resolve().then(()=>a(u.signal)).then(p=>(u.signal.aborted||this.values.set(i,p),p)).finally(()=>{this.pending.get(i)?.controller===u&&this.pending.delete(i)}),controller:u,consumers:0},this.pending.set(i,s)}s.consumers++;let c=!1;return{promise:s.promise,release:()=>{c||(c=!0,--s.consumers===0&&queueMicrotask(()=>{s.consumers===0&&this.pending.get(i)===s&&(this.pending.delete(i),s.controller.abort())}))}}}invalidate(i){if(i!==void 0)this.values.delete(i),this.pending.get(i)?.controller.abort(),this.pending.delete(i);else{this.values.clear();for(const a of this.pending.values())a.controller.abort();this.pending.clear()}}}const Al={color:"#F2C744",style:"background"},Wn=(t,i)=>t.start===i.start&&t.end===i.end;function Ww(t,i){if(i.referenceRange)return i.referenceRange;if(!i.embedded)return i.range;let a=i.range;const o=s=>{const c=Be(s);_t(c,i.range)&&(["paragraph","heading","listItem","tableCell"].includes(s.type)&&(a=c),s.children?.forEach(o))};for(const s of t.blocks)_t(s.range,i.range)&&o(s.node);return a}function vl(t,i){return(t.anchors??(t.range?[{range:t.range}]:[])).flatMap(a=>{if(a.documentId&&a.documentId!==i.id)return[];let o=a.range;if(a.quote&&i.source.slice(o.start,o.end)!==a.quote){const s=i.source.indexOf(a.quote);if(s<0||i.source.indexOf(a.quote,s+1)>=0)return[];o={start:s,end:s+a.quote.length}}else if(a.revision!==void 0&&a.revision!==i.revision&&!a.quote)return[];return o.start>=0&&o.end<=i.source.length&&o.start<=o.end?[{...a,range:o}]:[]})}const rf=new WeakMap;function e0(t,i){rf.get(t)?.();const a=t instanceof Window?t.document.documentElement:t,o=t instanceof Window?t.scrollY:t.scrollTop,s=Math.max(0,Math.min(i,a.scrollHeight-(t instanceof Window?t.innerHeight:t.clientHeight)));if(matchMedia("(prefers-reduced-motion: reduce)").matches){t.scrollTo({top:s,behavior:"instant"});return}const c=Math.min(560,220+Math.abs(s-o)*.15);let u=0,d=0;const p=g=>{["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," "].includes(g.key)&&f()},f=()=>{cancelAnimationFrame(u),t.removeEventListener("wheel",f),t.removeEventListener("touchstart",f),t.removeEventListener("pointerdown",f),t.removeEventListener("keydown",p),rf.delete(t)},y=g=>{d||=g;const x=Math.min(1,(g-d)/c);t.scrollTo({top:o+(s-o)*(1-Math.pow(1-x,4)),behavior:"instant"}),x<1?u=requestAnimationFrame(y):f()};rf.set(t,f),t.addEventListener("wheel",f,{passive:!0}),t.addEventListener("touchstart",f,{passive:!0}),t.addEventListener("pointerdown",f,{passive:!0}),t.addEventListener("keydown",p),u=requestAnimationFrame(y)}const Cu={language:"en",citation:"Citation",contents:"Contents",annotations:"Annotations",expand:"Expand",collapse:"Collapse",close:"Close",copy:"Copy",copied:"Copied",copyFailed:"Copy failed",copyImage:"Copy image URL",copyFigures:"Copy figures Markdown",loading:"Loading…",retry:"Retry",unavailable:"Content unavailable",footnotes:"Footnotes",definition:"Definition",question:"Question",note:"Note",extra:"Extended reading",hint:"Hint",answer:"Answer",submit:"Submit",correct:"Correct",incorrect:"Try again",play:"Play video",highlight:"Highlight",addHighlight:"Add highlight",editHighlight:"Edit highlight",highlightColor:"Color",highlightStyle:"Style",highlightBackground:"Background",highlightUnderline:"Underline",highlightDotted:"Dotted",highlightWavy:"Wavy",hideHighlight:"Hide highlight",showHighlight:"Show highlight",inlineHighlightHint:"Markdown inline highlight, editing unavailable",deleteAnnotations:"Delete",deleteAnnotationsHint:"Deletes {count} annotations on this text and any highlight."},Vn={language:"zh-CN",citation:"引用",contents:"目录",annotations:"注释",expand:"展开",collapse:"收起",close:"关闭",copy:"复制",copied:"已复制",copyFailed:"复制失败",copyImage:"复制图片 URL",copyFigures:"复制图组 Markdown",loading:"加载中…",retry:"重试",unavailable:"暂无内容",footnotes:"脚注",definition:"释义",question:"提问",note:"注释",extra:"拓展阅读",hint:"提示",answer:"答案",submit:"提交",correct:"回答正确",incorrect:"再试一次",play:"播放视频",highlight:"高亮",addHighlight:"添加高亮",editHighlight:"调整高亮",highlightColor:"颜色",highlightStyle:"样式",highlightBackground:"底色",highlightUnderline:"下划线",highlightDotted:"点线",highlightWavy:"波浪线",hideHighlight:"隐藏高亮",showHighlight:"显示高亮",inlineHighlightHint:"Markdown 内嵌高亮，不支持编辑",deleteAnnotations:"删除",deleteAnnotationsHint:"将删除这段文字关联的 {count} 个注释及高亮。"};class Za{constructor(i){this.value=i}value;listeners=new Set;get=()=>this.value;subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));set(i){if(!Object.is(this.value,i)){this.value=i;for(const a of this.listeners)a()}}}const Vf=Object.freeze([]),Tm=Object.freeze({occurrences:Vf,highlights:Vf});class sR{document;interaction=new Za({selection:null,activeHeading:null,hovered:null,active:null,editing:null,activeHighlight:null,hoveredHighlight:null});layout=new Za(0);viewport=new Za(0);documentOffset=new Za(0);decorations=new Za({annotations:new Map,highlights:new Map,occurrences:[],referenceRanges:new Map,byBlock:new Map});configuration;resources=new km(128);resourceVersions=new Za(new Map);resourceKeys=new Map;nextResource=0;anchors=new Map;blocks=new Map;headings=new Map;bindings=new WeakMap;textBinders=new WeakMap;components={};rendererOverrides=new Map;annotationTypes=new Map;resolvedTypes=new WeakMap;locale=Cu;content=null;selectionRange=null;highlightReference=null;layoutFrame=0;observer=null;headingPositions=[];localAnnotations=[];pendingOpen=null;pendingAnnotations;taskController=new AbortController;get signal(){return this.taskController.signal}commands={addAnnotation:(i,a={})=>{this.changeAnnotations(o=>{const s=[...o.filter(c=>c.id!==i.id),i];if(i.type!=="highlight"&&a.highlight!==!1&&(a.highlight!==void 0||this.annotationTypes.get(i.type)?.highlight!=="hover")){const c=this.document.getSnapshot();for(const u of vl(i,c))u.range.start===u.range.end||s.some(d=>d.type==="highlight"&&vl(d,c).some(p=>Wn(p.range,u.range)))||s.push({id:`highlight-${crypto.randomUUID()}`,type:"highlight",anchors:[{...u,id:void 0}],data:{...Al,...a.highlight}})}return s}),a.edit&&this.commands.editAnnotation(i.id)},updateAnnotation:(i,a)=>this.changeAnnotations(o=>o.map(s=>s.id===i?{...s,...a,id:i}:s)),removeAnnotation:i=>this.changeAnnotations(a=>a.filter(o=>o.id!==i)),removeAnnotationsAt:i=>this.changeAnnotations(a=>a.flatMap(o=>{const s=o.anchors??(o.range?[{range:o.range}]:[]),c=s.filter(u=>!vl({...o,range:void 0,anchors:[u]},this.document.getSnapshot()).some(d=>i.some(p=>Wn(p,d.range))));return c.length===s.length?[o]:c.length?[{...o,range:void 0,anchors:c}]:[]})),editAnnotation:i=>{this.updateInteraction({editing:i}),i&&this.commands.activateAnnotation(i)},activateAnnotation:i=>{const a=this.decorations.get().occurrences.find(o=>o.id===i||o.annotationIds.includes(i??""));this.pendingOpen=i&&!a?i:null,this.activate(a?.id??null)}};changeAnnotations(i){const a=this.configuration.get(),o=this.pendingAnnotations&&this.pendingAnnotations.input===a.annotations?this.pendingAnnotations.value:a.annotations??this.localAnnotations,s=i(o);if(a.annotations!==void 0&&!a.onAnnotationsChange)throw new Error("Controlled annotations require onAnnotationsChange to accept edits.");a.annotations===void 0?(this.localAnnotations=s,this.rebuildDecorations()):this.pendingAnnotations={input:a.annotations,value:s},a.onAnnotationsChange?.(s)}start(){this.taskController.signal.aborted&&(this.taskController=new AbortController)}dispose(){this.taskController.abort(),this.resources.invalidate(),this.resourceKeys.clear()}getResourceKey(i){const a=this.resourceKeys.get(i.id);if(a?.annotation===i)return a.key;a&&this.resources.invalidate(a.key);const o=`${i.id}:${++this.nextResource}`;return this.resourceKeys.set(i.id,{annotation:i,key:o}),o}invalidateAnnotation(i){const a=this.resourceKeys.get(i);a&&this.resources.invalidate(a.key);const o=new Map(this.resourceVersions.get());o.set(i,(o.get(i)??0)+1),this.resourceVersions.set(o)}constructor(i,a,o,s){this.configuration=new Za(s),this.installConfiguration(s),this.document=oR(a,{id:i,streaming:o,extensions:s.extensions}),this.rebuildDecorations(),this.document.subscribe(()=>{this.rebuildDecorations();const c=this.interaction.get().selection;if(c&&c.raw.ranges.length===1){const u=this.document.getSnapshot(),d=c.raw.ranges[0];this.updateInteraction({selection:u.source.slice(d.start,d.end)===c.raw.sourceText?Wu(u,d,{text:c.text,quality:c.quality,settled:c.settled}):null})}this.requestLayout(),this.configuration.get().onDocumentChange?.(this.document.getSnapshot())})}installConfiguration(i){this.locale={...Cu,...i.locale},this.components=Object.assign({},...(i.extensions??[]).map(s=>s.components),i.components),this.rendererOverrides=new Map;const a=[...(i.extensions??[]).flatMap(s=>s.rendererOverrides??[]),...Object.entries(i.components??{}).map(([s,c])=>({type:s,component:c})),...i.rendererOverrides??[]];for(const s of a)this.rendererOverrides.set(s.type,[...this.rendererOverrides.get(s.type)??[],s]);const o=[...(i.extensions??[]).flatMap(s=>[...s.annotationTypes??[]]),...i.annotationTypes??[]];this.annotationTypes=new Map(o.map(s=>{if(typeof s.label=="string")return[s.type,s];const c=s.label(this.locale),u=this.resolvedTypes.get(s),d=u?.label===c?u:{...s,label:c};return this.resolvedTypes.set(s,d),[s.type,d]}))}configure(i){const a=this.configuration.get();this.pendingAnnotations?.input!==i.annotations&&(this.pendingAnnotations=void 0),this.installConfiguration(i),this.configuration.set(i),a.extensions!==i.extensions?this.document.setExtensions(i.extensions??[]):(a.annotations!==i.annotations||a.annotationTypes!==i.annotationTypes)&&this.rebuildDecorations(),(a.annotationTypes!==i.annotationTypes||a.extensions!==i.extensions)&&this.resources.invalidate()}updateInteraction(i){const a=this.interaction.get();Object.keys(i).every(o=>Object.is(a[o],i[o]))||(this.interaction.set({...a,...i}),"selection"in i&&this.configuration.get().onSelectionChange?.(i.selection??null))}hover(i,a="marker"){this.updateInteraction({hovered:i,hoverSource:i?a:null}),this.configuration.get().onAnnotationHover?.(this.decorations.get().occurrences.find(o=>o.id===i)??null)}activate(i,a="marker"){this.updateInteraction({active:i,activeSource:i?a:null,hovered:null,hoverSource:null});const o=this.decorations.get().occurrences.find(s=>s.id===i);o&&this.configuration.get().onAnnotationClick?.(o)}hoverHighlight(i){this.interaction.get().hoveredHighlight!==i&&(this.updateInteraction({hoveredHighlight:i}),this.configuration.get().onHighlightHover?.(i?this.decorations.get().annotations.get(this.decorations.get().highlights.get(i)?.annotationId??"")??null:null))}activateHighlight(i){this.updateInteraction({activeHighlight:i,selection:null});const a=i&&this.decorations.get().highlights.get(i);a?this.configuration.get().onHighlightClick?.(this.decorations.get().annotations.get(a.annotationId)):this.highlightReference=null}clearSelection(){this.selectionRange=null;const i=typeof window>"u"?null:window.getSelection();i?.anchorNode&&this.content?.contains(i.anchorNode)&&i.removeAllRanges(),this.highlightReference=null,this.updateInteraction({selection:null,activeHighlight:null})}prepareTextBindings(i){const a=i.closest("[data-limr-block]"),o=a&&this.textBinders.get(a);o&&(this.textBinders.delete(a),o())}rebuildDecorations(){const i=this.document.getSnapshot(),a=this.configuration.get(),o=this.decorations.get(),s=new Map(i.annotations.map(v=>[v.id,v]));for(const v of a.annotations??this.localAnnotations)s.set(v.id,v);for(const[v,w]of this.resourceKeys)s.has(v)||(this.resources.invalidate(w.key),this.resourceKeys.delete(v));const c=this.resourceVersions.get();[...c.keys()].some(v=>!s.has(v))&&this.resourceVersions.set(new Map([...c].filter(([v])=>s.has(v))));const u=[...i.occurrences],d=[];for(const v of s.values())vl(v,i).forEach((w,A)=>{if(v.type==="highlight"){const T=A?`${v.id}:${A}`:v.id,S={...v.data,id:T,annotationId:v.id,range:w.range},E=o.highlights.get(T);d.push(E&&!E.occurrenceId&&Wn(E.range,S.range)&&E.color===S.color&&E.style===S.style&&E.hidden===S.hidden&&E.readOnly===S.readOnly?E:S)}else u.push({...w,id:w.id??`${i.id}-${v.id}-${A}`,annotationIds:[v.id]})});u.sort((v,w)=>v.range.end-w.range.end||v.id.localeCompare(w.id));const p=new Map(u.map(v=>[v.id,Ww(i,v)]));for(const v of u){const w=s.get(v.annotationIds[0]),A=w&&this.annotationTypes.get(w.type);if(!w||A?.highlight!=="hover")continue;const T=p.get(v.id);if(T.start===T.end)continue;const S=`reference-${v.id}`,E={id:S,annotationId:w.id,occurrenceId:v.id,range:T,color:A.color??Al.color,style:"background"},C=o.highlights.get(S);d.push(C&&C.occurrenceId===E.occurrenceId&&C.annotationId===E.annotationId&&Wn(C.range,T)&&C.color===E.color?C:E)}const f=new Map;for(const v of u.length||d.length?i.blocks:[]){const w=u.filter(_=>!_.embedded&&_.range.end>v.range.start&&_.range.end<=v.range.end),A=o.byBlock.get(v.id)??Tm,T=A.occurrences,S=T&&T.length===w.length&&T.every((_,N)=>_.id===w[N].id&&_.range.start===w[N].range.start&&_.range.end===w[N].range.end&&_.annotationIds.join("\0")===w[N].annotationIds.join("\0")),E=d.filter(_=>_t(_.range,v.range)),C=A.highlights,R=C.length===E.length&&C.every((_,N)=>_===E[N]);(w.length||E.length)&&f.set(v.id,S&&R?A:{occurrences:S?T:w,highlights:R?C:E})}const y=f.size===o.byBlock.size&&[...f].every(([v,w])=>o.byBlock.get(v)===w),g=new Map(d.map(v=>[v.id,v]));this.decorations.set({annotations:s,highlights:g,occurrences:u,referenceRanges:p,byBlock:y?o.byBlock:f});const x=this.interaction.get();if(x.editing&&!s.has(x.editing)&&this.pendingOpen!==x.editing&&this.updateInteraction({editing:null}),x.activeHighlight&&!g.has(x.activeHighlight)&&this.activateHighlight(null),x.hoveredHighlight&&!g.has(x.hoveredHighlight)&&this.hoverHighlight(null),x.active&&!u.some(v=>v.id===x.active)&&this.activate(null),x.hovered&&!u.some(v=>v.id===x.hovered)&&this.hover(null),this.pendingOpen){const v=u.find(w=>w.id===this.pendingOpen||w.annotationIds.includes(this.pendingOpen));v&&(this.pendingOpen=null,this.activate(v.id))}}registerAnchor(i,a){a?this.anchors.set(i,a):this.anchors.delete(i),this.requestLayout()}registerHeading(i,a){a?this.headings.set(i,a):this.headings.delete(i),this.requestLayout()}observeBlock(i){i&&(i.dataset.limrBlock&&this.blocks.set(i.dataset.limrBlock,i),this.observer?.observe(i))}unobserveBlock(i){i.dataset.limrBlock&&this.blocks.delete(i.dataset.limrBlock),this.observer?.unobserve(i)}getScrollTop(){return this.configuration.get().scrollRoot?.scrollTop??(typeof window<"u"?window.scrollY:0)}getViewportTop(){return this.configuration.get().scrollRoot?.getBoundingClientRect().top??0}getContentOffset(){const i=this.content&&getComputedStyle(this.content).translate;return i&&parseFloat(i.split(" ")[1]??"0")||0}scrollTo(i,a="smooth"){const o=this.configuration.get().scrollRoot??window;a==="smooth"?e0(o,i):o.scrollTo({top:Math.max(0,i),behavior:a})}scrollToHeading(i){const a=this.headings.get(i);a&&this.scrollTo(a.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24))}scrollToOccurrence(i){const a=this.anchors.get(i);a&&this.scrollTo(a.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24))}followFragment=i=>{if(i.defaultPrevented||i.button!==0||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey)return;const a=i.target instanceof Element?i.target.closest("a[href]"):null;if(!a||a.hasAttribute("download")||a.target&&a.target!=="_self"||!this.content?.contains(a))return;const o=new URL(a.href,document.baseURI);if(!o.hash||o.origin!==location.origin||o.pathname!==location.pathname||o.search!==location.search)return;let s;try{s=decodeURIComponent(o.hash.slice(1))}catch{return}const c=this.content.querySelector(`[id="${CSS.escape(s)}"]`);c&&(i.preventDefault(),this.scrollTo(c.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24)),i.detail===0&&(c.hasAttribute("tabindex")||(c.tabIndex=-1,c.addEventListener("blur",()=>c.removeAttribute("tabindex"),{once:!0})),c.focus({preventScroll:!0})))};requestLayout=()=>{typeof window>"u"||!this.content||this.layoutFrame||(this.layoutFrame=window.requestAnimationFrame(()=>{this.layoutFrame=0;const i=this.getScrollTop()-this.getViewportTop();this.headingPositions=[...this.headings].filter(([,o])=>!o.closest("[inert]")).map(([o,s])=>({id:o,top:s.getBoundingClientRect().top+i})).sort((o,s)=>o.top-s.top);const a=this.interaction.get();a.active&&this.anchors.get(a.active)?.closest("[inert]")&&this.activate(null),a.hovered&&this.anchors.get(a.hovered)?.closest("[inert]")&&this.hover(null),this.layout.set(this.layout.get()+1),this.trackHeading()}))};trackHeading=()=>{const i=this.headingPositions,a=this.getScrollTop()+(this.configuration.get().scrollOffset??24)+2;let o=0,s=i.length;for(;o<s;){const p=o+s>>>1;i[p].top<=a?o=p+1:s=p}const c=this.configuration.get().scrollRoot,u=(c?.scrollHeight??document.documentElement.scrollHeight)-(c?.clientHeight??window.innerHeight),d=u>0&&this.getScrollTop()>=u-2;this.updateInteraction({activeHeading:i[d?i.length-1:Math.max(0,o-1)]?.id??null})};mountContent(i){this.content=i,this.observer=new ResizeObserver(this.requestLayout),this.observer.observe(i),i.querySelectorAll("[data-limr-block]").forEach(c=>this.observer.observe(c));let a=0;const o=()=>{a||(a=requestAnimationFrame(()=>{a=0,this.trackHeading(),this.viewport.set(this.viewport.get()+1)}))},s=this.configuration.get().scrollRoot??window;return s.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",this.requestLayout),document.fonts?.addEventListener("loadingdone",this.requestLayout),i.addEventListener("load",this.requestLayout,!0),i.addEventListener("click",this.followFragment),this.requestLayout(),()=>{this.content=null,this.observer?.disconnect(),this.observer=null,cancelAnimationFrame(a),cancelAnimationFrame(this.layoutFrame),this.layoutFrame=0,s.removeEventListener("scroll",o),window.removeEventListener("resize",this.requestLayout),document.fonts?.removeEventListener("loadingdone",this.requestLayout),i.removeEventListener("load",this.requestLayout,!0),i.removeEventListener("click",this.followFragment)}}}const t0=Vf,uR={tokenize:pR,partial:!0},n0={tokenize:gR,partial:!0},i0={tokenize:yR,partial:!0},a0={tokenize:bR,partial:!0},cR={tokenize:vR,partial:!0},r0={name:"wwwAutolink",tokenize:fR,previous:l0},o0={name:"protocolAutolink",tokenize:mR,previous:s0},Pi={name:"emailAutolink",tokenize:hR,previous:u0},vi={};function dR(){return{text:vi}}let Ka=48;for(;Ka<123;)vi[Ka]=Pi,Ka++,Ka===58?Ka=65:Ka===91&&(Ka=97);vi[43]=Pi;vi[45]=Pi;vi[46]=Pi;vi[95]=Pi;vi[72]=[Pi,o0];vi[104]=[Pi,o0];vi[87]=[Pi,r0];vi[119]=[Pi,r0];function hR(t,i,a){const o=this;let s,c;return u;function u(g){return!$f(g)||!u0.call(o,o.previous)||Am(o.events)?a(g):(t.enter("literalAutolink"),t.enter("literalAutolinkEmail"),d(g))}function d(g){return $f(g)?(t.consume(g),d):g===64?(t.consume(g),p):a(g)}function p(g){return g===46?t.check(cR,y,f)(g):g===45||g===95||Wt(g)?(c=!0,t.consume(g),p):y(g)}function f(g){return t.consume(g),s=!0,p}function y(g){return c&&s&&rn(o.previous)?(t.exit("literalAutolinkEmail"),t.exit("literalAutolink"),i(g)):a(g)}}function fR(t,i,a){const o=this;return s;function s(u){return u!==87&&u!==119||!l0.call(o,o.previous)||Am(o.events)?a(u):(t.enter("literalAutolink"),t.enter("literalAutolinkWww"),t.check(uR,t.attempt(n0,t.attempt(i0,c),a),a)(u))}function c(u){return t.exit("literalAutolinkWww"),t.exit("literalAutolink"),i(u)}}function mR(t,i,a){const o=this;let s="",c=!1;return u;function u(g){return(g===72||g===104)&&s0.call(o,o.previous)&&!Am(o.events)?(t.enter("literalAutolink"),t.enter("literalAutolinkHttp"),s+=String.fromCodePoint(g),t.consume(g),d):a(g)}function d(g){if(rn(g)&&s.length<5)return s+=String.fromCodePoint(g),t.consume(g),d;if(g===58){const x=s.toLowerCase();if(x==="http"||x==="https")return t.consume(g),p}return a(g)}function p(g){return g===47?(t.consume(g),c?f:(c=!0,p)):a(g)}function f(g){return g===null||ku(g)||We(g)||Ht(g)||ka(g)?a(g):t.attempt(n0,t.attempt(i0,y),a)(g)}function y(g){return t.exit("literalAutolinkHttp"),t.exit("literalAutolink"),i(g)}}function pR(t,i,a){let o=0;return s;function s(u){return(u===87||u===119)&&o<3?(o++,t.consume(u),s):u===46&&o===3?(t.consume(u),c):a(u)}function c(u){return u===null?a(u):i(u)}}function gR(t,i,a){let o,s,c;return u;function u(f){return f===46||f===95?t.check(a0,p,d)(f):f===null||We(f)||Ht(f)||f!==45&&ka(f)?p(f):(c=!0,t.consume(f),u)}function d(f){return f===95?o=!0:(s=o,o=void 0),t.consume(f),u}function p(f){return s||o||!c?a(f):i(f)}}function yR(t,i){let a=0,o=0;return s;function s(u){return u===40?(a++,t.consume(u),s):u===41&&o<a?c(u):u===33||u===34||u===38||u===39||u===41||u===42||u===44||u===46||u===58||u===59||u===60||u===63||u===93||u===95||u===126?t.check(a0,i,c)(u):u===null||We(u)||Ht(u)?i(u):(t.consume(u),s)}function c(u){return u===41&&o++,t.consume(u),s}}function bR(t,i,a){return o;function o(d){return d===33||d===34||d===39||d===41||d===42||d===44||d===46||d===58||d===59||d===63||d===95||d===126?(t.consume(d),o):d===38?(t.consume(d),c):d===93?(t.consume(d),s):d===60||d===null||We(d)||Ht(d)?i(d):a(d)}function s(d){return d===null||d===40||d===91||We(d)||Ht(d)?i(d):o(d)}function c(d){return rn(d)?u(d):a(d)}function u(d){return d===59?(t.consume(d),o):rn(d)?(t.consume(d),u):a(d)}}function vR(t,i,a){return o;function o(c){return t.consume(c),s}function s(c){return Wt(c)?a(c):i(c)}}function l0(t){return t===null||t===40||t===42||t===95||t===91||t===93||t===126||We(t)}function s0(t){return!rn(t)}function u0(t){return!(t===47||$f(t))}function $f(t){return t===43||t===45||t===46||t===95||Wt(t)}function Am(t){let i=t.length,a=!1;for(;i--;){const o=t[i][1];if((o.type==="labelLink"||o.type==="labelImage")&&!o._balanced){a=!0;break}if(o._gfmAutolinkLiteralWalkedInto){a=!1;break}}return t.length>0&&!a&&(t[t.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),a}const xR={tokenize:RR,partial:!0};function wR(){return{document:{91:{name:"gfmFootnoteDefinition",tokenize:AR,continuation:{tokenize:ER},exit:CR}},text:{91:{name:"gfmFootnoteCall",tokenize:TR},93:{name:"gfmPotentialFootnoteCall",add:"after",tokenize:SR,resolveTo:kR}}}}function SR(t,i,a){const o=this;let s=o.events.length;const c=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let u;for(;s--;){const p=o.events[s][1];if(p.type==="labelImage"){u=p;break}if(p.type==="gfmFootnoteCall"||p.type==="labelLink"||p.type==="label"||p.type==="image"||p.type==="link")break}return d;function d(p){if(!u||!u._balanced)return a(p);const f=ti(o.sliceSerialize({start:u.end,end:o.now()}));return f.codePointAt(0)!==94||!c.includes(f.slice(1))?a(p):(t.enter("gfmFootnoteCallLabelMarker"),t.consume(p),t.exit("gfmFootnoteCallLabelMarker"),i(p))}}function kR(t,i){let a=t.length;for(;a--;)if(t[a][1].type==="labelImage"&&t[a][0]==="enter"){t[a][1];break}t[a+1][1].type="data",t[a+3][1].type="gfmFootnoteCallLabelMarker";const o={type:"gfmFootnoteCall",start:Object.assign({},t[a+3][1].start),end:Object.assign({},t[t.length-1][1].end)},s={type:"gfmFootnoteCallMarker",start:Object.assign({},t[a+3][1].end),end:Object.assign({},t[a+3][1].end)};s.end.column++,s.end.offset++,s.end._bufferIndex++;const c={type:"gfmFootnoteCallString",start:Object.assign({},s.end),end:Object.assign({},t[t.length-1][1].start)},u={type:"chunkString",contentType:"string",start:Object.assign({},c.start),end:Object.assign({},c.end)},d=[t[a+1],t[a+2],["enter",o,i],t[a+3],t[a+4],["enter",s,i],["exit",s,i],["enter",c,i],["enter",u,i],["exit",u,i],["exit",c,i],t[t.length-2],t[t.length-1],["exit",o,i]];return t.splice(a,t.length-a+1,...d),t}function TR(t,i,a){const o=this,s=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let c=0,u;return d;function d(g){return t.enter("gfmFootnoteCall"),t.enter("gfmFootnoteCallLabelMarker"),t.consume(g),t.exit("gfmFootnoteCallLabelMarker"),p}function p(g){return g!==94?a(g):(t.enter("gfmFootnoteCallMarker"),t.consume(g),t.exit("gfmFootnoteCallMarker"),t.enter("gfmFootnoteCallString"),t.enter("chunkString").contentType="string",f)}function f(g){if(c>999||g===93&&!u||g===null||g===91||We(g))return a(g);if(g===93){t.exit("chunkString");const x=t.exit("gfmFootnoteCallString");return s.includes(ti(o.sliceSerialize(x)))?(t.enter("gfmFootnoteCallLabelMarker"),t.consume(g),t.exit("gfmFootnoteCallLabelMarker"),t.exit("gfmFootnoteCall"),i):a(g)}return We(g)||(u=!0),c++,t.consume(g),g===92?y:f}function y(g){return g===91||g===92||g===93?(t.consume(g),c++,f):f(g)}}function AR(t,i,a){const o=this,s=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let c,u=0,d;return p;function p(w){return t.enter("gfmFootnoteDefinition")._container=!0,t.enter("gfmFootnoteDefinitionLabel"),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionLabelMarker"),f}function f(w){return w===94?(t.enter("gfmFootnoteDefinitionMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionMarker"),t.enter("gfmFootnoteDefinitionLabelString"),t.enter("chunkString").contentType="string",y):a(w)}function y(w){if(u>999||w===93&&!d||w===null||w===91||We(w))return a(w);if(w===93){t.exit("chunkString");const A=t.exit("gfmFootnoteDefinitionLabelString");return c=ti(o.sliceSerialize(A)),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionLabelMarker"),t.exit("gfmFootnoteDefinitionLabel"),x}return We(w)||(d=!0),u++,t.consume(w),w===92?g:y}function g(w){return w===91||w===92||w===93?(t.consume(w),u++,y):y(w)}function x(w){return w===58?(t.enter("definitionMarker"),t.consume(w),t.exit("definitionMarker"),s.includes(c)||s.push(c),Ve(t,v,"gfmFootnoteDefinitionWhitespace")):a(w)}function v(w){return i(w)}}function ER(t,i,a){return t.check(Rl,i,t.attempt(xR,i,a))}function CR(t){t.exit("gfmFootnoteDefinition")}function RR(t,i,a){const o=this;return Ve(t,s,"gfmFootnoteDefinitionIndent",5);function s(c){const u=o.events[o.events.length-1];return u&&u[1].type==="gfmFootnoteDefinitionIndent"&&u[2].sliceSerialize(u[1],!0).length===4?i(c):a(c)}}function MR(t){let a=(t||{}).singleTilde;const o={name:"strikethrough",tokenize:c,resolveAll:s};return a==null&&(a=!0),{text:{126:o},insideSpan:{null:[o]},attentionMarkers:{null:[126]}};function s(u,d){let p=-1;for(;++p<u.length;)if(u[p][0]==="enter"&&u[p][1].type==="strikethroughSequenceTemporary"&&u[p][1]._close){let f=p;for(;f--;)if(u[f][0]==="exit"&&u[f][1].type==="strikethroughSequenceTemporary"&&u[f][1]._open&&u[p][1].end.offset-u[p][1].start.offset===u[f][1].end.offset-u[f][1].start.offset){u[p][1].type="strikethroughSequence",u[f][1].type="strikethroughSequence";const y={type:"strikethrough",start:Object.assign({},u[f][1].start),end:Object.assign({},u[p][1].end)},g={type:"strikethroughText",start:Object.assign({},u[f][1].end),end:Object.assign({},u[p][1].start)},x=[["enter",y,d],["enter",u[f][1],d],["exit",u[f][1],d],["enter",g,d]],v=d.parser.constructs.insideSpan.null;v&&ei(x,x.length,0,Ju(v,u.slice(f+1,p),d)),ei(x,x.length,0,[["exit",g,d],["enter",u[p][1],d],["exit",u[p][1],d],["exit",y,d]]),ei(u,f-1,p-f+3,x),p=f+x.length-2;break}}for(p=-1;++p<u.length;)u[p][1].type==="strikethroughSequenceTemporary"&&(u[p][1].type="data");return u}function c(u,d,p){const f=this.previous,y=this.events;let g=0;return x;function x(w){return f===126&&y[y.length-1][1].type!=="characterEscape"?p(w):(u.enter("strikethroughSequenceTemporary"),v(w))}function v(w){const A=Au(f);if(w===126)return g>1?p(w):(u.consume(w),g++,v);if(g<2&&!a)return p(w);const T=u.exit("strikethroughSequenceTemporary"),S=Au(w);return T._open=!S||S===2&&!!A,T._close=!A||A===2&&!!S,d(w)}}}class NR{constructor(){this.map=[],this.index=new Map}add(i,a,o){DR(this,i,a,o)}consume(i){if(this.map.sort(function(c,u){return c[0]-u[0]}),this.map.length===0)return;let a=this.map.length;const o=[];for(;a>0;)a-=1,o.push(i.slice(this.map[a][0]+this.map[a][1]),this.map[a][2]),i.length=this.map[a][0];o.push(i.slice()),i.length=0;let s=o.pop();for(;s;){for(const c of s)i.push(c);s=o.pop()}this.map.length=0,this.index.clear()}}function DR(t,i,a,o){if(a===0&&o.length===0)return;const s=t.index.get(i);if(s){s[1]+=a,s[2].push(...o);return}const c=[i,a,o];t.map.push(c),t.index.set(i,c)}function jR(t,i){let a=!1;const o=[];for(;i<t.length;){const s=t[i];if(a){if(s[0]==="enter")s[1].type==="tableContent"&&o.push(t[i+1][1].type==="tableDelimiterMarker"?"left":"none");else if(s[1].type==="tableContent"){if(t[i-1][1].type==="tableDelimiterMarker"){const c=o.length-1;o[c]=o[c]==="left"?"center":"right"}}else if(s[1].type==="tableDelimiterRow")break}else s[0]==="enter"&&s[1].type==="tableDelimiterRow"&&(a=!0);i+=1}return o}function OR(){return{flow:{null:{name:"table",tokenize:LR,resolveAll:zR}}}}function LR(t,i,a){const o=this;let s=0,c=0,u;return d;function d(I){let X=o.events.length-1;for(;X>-1;){const{type:P}=o.events[X][1];if(P==="lineEnding"||P==="linePrefix")X--;else break}const oe=X>-1?o.events[X][1].type:null,Y=oe==="tableHead"||oe==="tableRow"?N:p;return Y===N&&o.parser.lazy[o.now().line]?a(I):Y(I)}function p(I){return t.enter("tableHead"),t.enter("tableRow"),f(I)}function f(I){return I===124||(u=!0,c+=1),y(I)}function y(I){return I===null?a(I):Ce(I)?c>1?(c=0,o.interrupt=!0,t.exit("tableRow"),t.enter("lineEnding"),t.consume(I),t.exit("lineEnding"),v):a(I):Fe(I)?Ve(t,y,"whitespace")(I):(c+=1,u&&(u=!1,s+=1),I===124?(t.enter("tableCellDivider"),t.consume(I),t.exit("tableCellDivider"),u=!0,y):(t.enter("data"),g(I)))}function g(I){return I===null||I===124||We(I)?(t.exit("data"),y(I)):(t.consume(I),I===92?x:g)}function x(I){return I===92||I===124?(t.consume(I),g):g(I)}function v(I){return o.interrupt=!1,o.parser.lazy[o.now().line]?a(I):(t.enter("tableDelimiterRow"),u=!1,Fe(I)?Ve(t,w,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(I):w(I))}function w(I){return I===45||I===58?T(I):I===124?(u=!0,t.enter("tableCellDivider"),t.consume(I),t.exit("tableCellDivider"),A):_(I)}function A(I){return Fe(I)?Ve(t,T,"whitespace")(I):T(I)}function T(I){return I===58?(c+=1,u=!0,t.enter("tableDelimiterMarker"),t.consume(I),t.exit("tableDelimiterMarker"),S):I===45?(c+=1,S(I)):I===null||Ce(I)?R(I):_(I)}function S(I){return I===45?(t.enter("tableDelimiterFiller"),E(I)):_(I)}function E(I){return I===45?(t.consume(I),E):I===58?(u=!0,t.exit("tableDelimiterFiller"),t.enter("tableDelimiterMarker"),t.consume(I),t.exit("tableDelimiterMarker"),C):(t.exit("tableDelimiterFiller"),C(I))}function C(I){return Fe(I)?Ve(t,R,"whitespace")(I):R(I)}function R(I){return I===124?w(I):I===null||Ce(I)?!u||s!==c?_(I):(t.exit("tableDelimiterRow"),t.exit("tableHead"),i(I)):_(I)}function _(I){return a(I)}function N(I){return t.enter("tableRow"),j(I)}function j(I){return I===124?(t.enter("tableCellDivider"),t.consume(I),t.exit("tableCellDivider"),j):I===null||Ce(I)?(t.exit("tableRow"),i(I)):Fe(I)?Ve(t,j,"whitespace")(I):(t.enter("data"),z(I))}function z(I){return I===null||I===124||We(I)?(t.exit("data"),j(I)):(t.consume(I),I===92?B:z)}function B(I){return I===92||I===124?(t.consume(I),z):z(I)}}function zR(t,i){let a=-1,o=!0,s=0,c=[0,0,0,0],u=[0,0,0,0],d=!1,p=0,f,y,g;const x=new NR;for(;++a<t.length;){const v=t[a],w=v[1];v[0]==="enter"?w.type==="tableHead"?(d=!1,p!==0&&(rx(x,i,p,f,y),y=void 0,p=0),f={type:"table",start:Object.assign({},w.start),end:Object.assign({},w.end)},x.add(a,0,[["enter",f,i]])):w.type==="tableRow"||w.type==="tableDelimiterRow"?(o=!0,g=void 0,c=[0,0,0,0],u=[0,a+1,0,0],d&&(d=!1,y={type:"tableBody",start:Object.assign({},w.start),end:Object.assign({},w.end)},x.add(a,0,[["enter",y,i]])),s=w.type==="tableDelimiterRow"?2:y?3:1):s&&(w.type==="data"||w.type==="tableDelimiterMarker"||w.type==="tableDelimiterFiller")?(o=!1,u[2]===0&&(c[1]!==0&&(u[0]=u[1],g=du(x,i,c,s,void 0,g),c=[0,0,0,0]),u[2]=a)):w.type==="tableCellDivider"&&(o?o=!1:(c[1]!==0&&(u[0]=u[1],g=du(x,i,c,s,void 0,g)),c=u,u=[c[1],a,0,0])):w.type==="tableHead"?(d=!0,p=a):w.type==="tableRow"||w.type==="tableDelimiterRow"?(p=a,c[1]!==0?(u[0]=u[1],g=du(x,i,c,s,a,g)):u[1]!==0&&(g=du(x,i,u,s,a,g)),s=0):s&&(w.type==="data"||w.type==="tableDelimiterMarker"||w.type==="tableDelimiterFiller")&&(u[3]=a)}for(p!==0&&rx(x,i,p,f,y),x.consume(i.events),a=-1;++a<i.events.length;){const v=i.events[a];v[0]==="enter"&&v[1].type==="table"&&(v[1]._align=jR(i.events,a))}return t}function du(t,i,a,o,s,c){const u=o===1?"tableHeader":o===2?"tableDelimiter":"tableData",d="tableContent";a[0]!==0&&(c.end=Object.assign({},Wr(i.events,a[0])),t.add(a[0],0,[["exit",c,i]]));const p=Wr(i.events,a[1]);if(c={type:u,start:Object.assign({},p),end:Object.assign({},p)},t.add(a[1],0,[["enter",c,i]]),a[2]!==0){const f=Wr(i.events,a[2]),y=Wr(i.events,a[3]),g={type:d,start:Object.assign({},f),end:Object.assign({},y)};if(t.add(a[2],0,[["enter",g,i]]),o!==2){const x=i.events[a[2]],v=i.events[a[3]];if(x[1].end=Object.assign({},v[1].end),x[1].type="chunkText",x[1].contentType="text",a[3]>a[2]+1){const w=a[2]+1,A=a[3]-a[2]-1;t.add(w,A,[])}}t.add(a[3]+1,0,[["exit",g,i]])}return s!==void 0&&(c.end=Object.assign({},Wr(i.events,s)),t.add(s,0,[["exit",c,i]]),c=void 0),c}function rx(t,i,a,o,s){const c=[],u=Wr(i.events,a);s&&(s.end=Object.assign({},u),c.push(["exit",s,i])),o.end=Object.assign({},u),c.push(["exit",o,i]),t.add(a+1,0,c)}function Wr(t,i){const a=t[i],o=a[0]==="enter"?"start":"end";return a[1][o]}const _R={name:"tasklistCheck",tokenize:HR};function IR(){return{text:{91:_R}}}function HR(t,i,a){const o=this;return s;function s(p){return o.previous!==null||!o._gfmTasklistFirstContentOfListItem?a(p):(t.enter("taskListCheck"),t.enter("taskListCheckMarker"),t.consume(p),t.exit("taskListCheckMarker"),c)}function c(p){return We(p)?(t.enter("taskListCheckValueUnchecked"),t.consume(p),t.exit("taskListCheckValueUnchecked"),u):p===88||p===120?(t.enter("taskListCheckValueChecked"),t.consume(p),t.exit("taskListCheckValueChecked"),u):a(p)}function u(p){return p===93?(t.enter("taskListCheckMarker"),t.consume(p),t.exit("taskListCheckMarker"),t.exit("taskListCheck"),d):a(p)}function d(p){return Ce(p)?i(p):Fe(p)?t.check({tokenize:BR},i,a)(p):a(p)}}function BR(t,i,a){return Ve(t,o,"whitespace");function o(s){return s===null?a(s):i(s)}}function c0(t){return Lw([dR(),wR(),MR(t),OR(),IR()])}function qR(t){if(typeof t!="string")throw new TypeError("Expected a string");return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function PR(t,i,a){const s=Zu((a||{}).ignore||[]),c=UR(i);let u=-1;for(;++u<c.length;)Qw(t,"text",d);function d(f,y){let g=-1,x;for(;++g<y.length;){const v=y[g],w=x?x.children:void 0;if(s(v,w?w.indexOf(v):void 0,x))return;x=v}if(x)return p(f,y)}function p(f,y){const g=y[y.length-1],x=c[u][0],v=c[u][1];let w=0;const T=g.children.indexOf(f);let S=!1,E=[];x.lastIndex=0;let C=x.exec(f.value);for(;C;){const _=C.index,N={index:C.index,input:C.input,stack:[...y,f]};let j=v(...C,N);if(typeof j=="string"&&(j=j.length>0?{type:"text",value:j}:void 0),j===!1)x.lastIndex=_+1;else{if(w!==_&&R({type:"text",value:f.value.slice(w,_)}),Array.isArray(j))for(const z of j)R(z);else j&&R(j);w=_+C[0].length,S=!0}if(!x.global)break;C=x.exec(f.value)}return S?(w<f.value.length&&R({type:"text",value:f.value.slice(w)}),g.children.splice(T,1,...E)):E=[f],T+E.length;function R(_){const N=E[E.length-1];N&&N.type==="text"&&_.type==="text"?N.value+=_.value:E.push(_)}}}function UR(t){if(!Array.isArray(t))throw new TypeError("Expected find and replace tuple or list of tuples");const i=[],a=!t[0]||Array.isArray(t[0])?t:[t];let o=-1;for(;++o<a.length;){const s=a[o];i.push([FR(s[0]),VR(s[1])])}return i}function FR(t){return typeof t=="string"?new RegExp(qR(t),"g"):t}function VR(t){return typeof t=="function"?t:function(){return t}}const of="phrasing",lf=["autolink","link","image","label"];function $R(){return{transforms:[QR],enter:{literalAutolink:YR,literalAutolinkEmail:sf,literalAutolinkHttp:sf,literalAutolinkWww:sf},exit:{literalAutolink:KR,literalAutolinkEmail:ZR,literalAutolinkHttp:JR,literalAutolinkWww:XR}}}function GR(){return{unsafe:[{character:"@",before:"[+\\-.\\w]",after:"[\\-.\\w]",inConstruct:of,notInConstruct:lf},{character:".",before:"[Ww]",after:"[\\-.\\w]",inConstruct:of,notInConstruct:lf},{character:":",before:"[ps]",after:"\\/",inConstruct:of,notInConstruct:lf}]}}function YR(t){this.enter({type:"link",title:null,url:"",children:[]},t)}function sf(t){this.config.enter.autolinkProtocol.call(this,t)}function JR(t){this.config.exit.autolinkProtocol.call(this,t)}function XR(t){this.config.exit.data.call(this,t);const i=this.stack[this.stack.length-1];i.type,i.url="http://"+this.sliceSerialize(t)}function ZR(t){this.config.exit.autolinkEmail.call(this,t)}function KR(t){this.exit(t)}function QR(t){PR(t,[[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi,WR],[new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)","gu"),eM]],{ignore:["link","linkReference"]})}function WR(t,i,a,o,s){let c="";if(!d0(s)||(/^w/i.test(i)&&(a=i+a,i="",c="http://"),!tM(a)))return!1;const u=nM(a+o);if(!u[0])return!1;const d={type:"link",title:null,url:c+i+u[0],children:[{type:"text",value:i+u[0]}]};return u[1]?[d,{type:"text",value:u[1]}]:d}function eM(t,i,a,o){return!d0(o,!0)||/[-\d_]$/.test(a)?!1:{type:"link",title:null,url:"mailto:"+i+"@"+a,children:[{type:"text",value:i+"@"+a}]}}function tM(t){const i=t.split(".");return!(i.length<2||i[i.length-1]&&(/_/.test(i[i.length-1])||!/[a-zA-Z\d]/.test(i[i.length-1]))||i[i.length-2]&&(/_/.test(i[i.length-2])||!/[a-zA-Z\d]/.test(i[i.length-2])))}function nM(t){const i=/[!"&'),.:;<>?\]}]+$/.exec(t);if(!i)return[t,void 0];t=t.slice(0,i.index);let a=i[0],o=a.indexOf(")");const s=ex(t,"(");let c=ex(t,")");for(;o!==-1&&s>c;)t+=a.slice(0,o+1),a=a.slice(o+1),o=a.indexOf(")"),c++;return[t,a]}function d0(t,i){const a=t.input.charCodeAt(t.index-1);return(t.index===0||Ht(a)||ka(a))&&(!i||a!==47)}h0.peek=dM;function iM(){this.buffer()}function aM(t){this.enter({type:"footnoteReference",identifier:"",label:""},t)}function rM(){this.buffer()}function oM(t){this.enter({type:"footnoteDefinition",identifier:"",label:"",children:[]},t)}function lM(t){const i=this.resume(),a=this.stack[this.stack.length-1];a.type,a.identifier=ti(this.sliceSerialize(t)).toLowerCase(),a.label=i}function sM(t){this.exit(t)}function uM(t){const i=this.resume(),a=this.stack[this.stack.length-1];a.type,a.identifier=ti(this.sliceSerialize(t)).toLowerCase(),a.label=i}function cM(t){this.exit(t)}function dM(){return"["}function h0(t,i,a,o){const s=a.createTracker(o);let c=s.move("[^");const u=a.enter("footnoteReference"),d=a.enter("reference");return c+=s.move(a.safe(a.associationId(t),{after:"]",before:c})),d(),u(),c+=s.move("]"),c}function hM(){return{enter:{gfmFootnoteCallString:iM,gfmFootnoteCall:aM,gfmFootnoteDefinitionLabelString:rM,gfmFootnoteDefinition:oM},exit:{gfmFootnoteCallString:lM,gfmFootnoteCall:sM,gfmFootnoteDefinitionLabelString:uM,gfmFootnoteDefinition:cM}}}function fM(t){let i=!1;return t&&t.firstLineBlank&&(i=!0),{handlers:{footnoteDefinition:a,footnoteReference:h0},unsafe:[{character:"[",inConstruct:["label","phrasing","reference"]}]};function a(o,s,c,u){const d=c.createTracker(u);let p=d.move("[^");const f=c.enter("footnoteDefinition"),y=c.enter("label");return p+=d.move(c.safe(c.associationId(o),{before:p,after:"]"})),y(),p+=d.move("]:"),o.children&&o.children.length>0&&(d.shift(4),p+=d.move((i?`
`:" ")+c.indentLines(c.containerFlow(o,d.current()),i?f0:mM))),f(),p}}function mM(t,i,a){return i===0?t:f0(t,i,a)}function f0(t,i,a){return(a?"":"    ")+t}const pM=["autolink","destinationLiteral","destinationRaw","reference","titleQuote","titleApostrophe"];Em.attention=xM;Em.peek=wM;function gM(){return{canContainEols:["delete"],enter:{strikethrough:bM},exit:{strikethrough:vM}}}function yM(){return{handlers:{delete:Em},unsafe:[{character:"~",inConstruct:"phrasing",notInConstruct:pM}]}}function bM(t){this.enter({type:"delete",children:[],position:void 0},t)}function vM(t){this.exit(t)}function Em(t,i,a,o){const s=a.createTracker(o),c=a.stack.includes("strikethrough")?"~":"~~",u=a.enter("strikethrough");let d=s.move(c);return d+=a.containerPhrasing(t,{...s.current(),before:d,after:"~"}),d+=s.move(c),u(),d}function xM(){return{construct:"strikethrough",markers:["~"],sizes:[2,1]}}function wM(){return"~"}function SM(t){return t.length}function kM(t,i){const a=i||{},o=(a.align||[]).concat(),s=a.stringLength||SM,c=[],u=[],d=[],p=[];let f=0,y=-1;for(;++y<t.length;){const A=[],T=[];let S=-1;for(t[y].length>f&&(f=t[y].length);++S<t[y].length;){const E=TM(t[y][S]);if(a.alignDelimiters!==!1){const C=s(E);T[S]=C,(p[S]===void 0||C>p[S])&&(p[S]=C)}A.push(E)}u[y]=A,d[y]=T}let g=-1;if(typeof o=="object"&&"length"in o)for(;++g<f;)c[g]=ox(o[g]);else{const A=ox(o);for(;++g<f;)c[g]=A}g=-1;const x=[],v=[];for(;++g<f;){const A=c[g];let T="",S="";A===99?(T=":",S=":"):A===108?T=":":A===114&&(S=":");let E=a.alignDelimiters===!1?1:Math.max(1,p[g]-T.length-S.length);const C=T+"-".repeat(E)+S;a.alignDelimiters!==!1&&(E=T.length+E+S.length,E>p[g]&&(p[g]=E),v[g]=E),x[g]=C}u.splice(1,0,x),d.splice(1,0,v),y=-1;const w=[];for(;++y<u.length;){const A=u[y],T=d[y];g=-1;const S=[];for(;++g<f;){const E=A[g]||"";let C="",R="";if(a.alignDelimiters!==!1){const _=p[g]-(T[g]||0),N=c[g];N===114?C=" ".repeat(_):N===99?_%2?(C=" ".repeat(_/2+.5),R=" ".repeat(_/2-.5)):(C=" ".repeat(_/2),R=C):R=" ".repeat(_)}a.delimiterStart!==!1&&!g&&S.push("|"),a.padding!==!1&&!(a.alignDelimiters===!1&&E==="")&&(a.delimiterStart!==!1||g)&&S.push(" "),a.alignDelimiters!==!1&&S.push(C),S.push(E),a.alignDelimiters!==!1&&S.push(R),a.padding!==!1&&S.push(" "),(a.delimiterEnd!==!1||g!==f-1)&&S.push("|")}w.push(a.delimiterEnd===!1?S.join("").replace(/ +$/,""):S.join(""))}return w.join(`
`)}function TM(t){return t==null?"":String(t)}function ox(t){const i=typeof t=="string"?t.codePointAt(0):0;return i===67||i===99?99:i===76||i===108?108:i===82||i===114?114:0}const AM=Zu(["break","delete","emphasis","footnote","footnoteReference","image","imageReference","inlineCode","inlineMath","link","linkReference","mdxJsxTextElement","mdxTextExpression","strong","text","textDirective"]);function EM(t,i,a,o){const s=a.enter("blockquote"),c=a.createTracker(o);c.move("> "),c.shift(2);const u=a.indentLines(a.containerFlow(t,c.current()),CM);return s(),u}function CM(t,i,a){return">"+(a?"":" ")+t}function RM(t,i){return lx(t,i.inConstruct,!0)&&!lx(t,i.notInConstruct,!1)}function lx(t,i,a){if(typeof i=="string"&&(i=[i]),!i||i.length===0)return a;let o=-1;for(;++o<i.length;)if(t.includes(i[o]))return!0;return!1}function sx(t,i,a,o){let s=-1;for(;++s<a.unsafe.length;){const c=a.unsafe[s];if(c.character===`
`&&!c.before&&!c.after&&RM(a.stack,c))return/[\t ]/.test(o.before)?"":" "}return`\\
`}function MM(t,i){const a=String(t);let o=a.indexOf(i),s=o,c=0,u=0;if(typeof i!="string")throw new TypeError("Expected substring");for(;o!==-1;)o===s?++c>u&&(u=c):c=1,s=o+i.length,o=a.indexOf(i,s);return u}function NM(t,i){return!!(i.options.fences===!1&&t.value&&!t.lang&&/[^\n\r ]/.test(t.value)&&!/^[\t ]*(?:[\n\r]|$)|(?:^|[\n\r])[\t ]*$/.test(t.value))}function DM(t){const i=t.options.fence||"`";if(i!=="`"&&i!=="~")throw new Error("Cannot serialize code with `"+i+"` for `options.fence`, expected `` ` `` or `~`");return i}function jM(t,i,a,o){const s=DM(a),c=t.value||"";if(NM(t,a)){const g=a.enter("codeIndented"),x=a.indentLines(c,OM);return g(),x}const u=a.createTracker(o),d=s.repeat(Math.max(MM(c,s)+1,3)),p=a.enter("codeFenced"),f=s==="`"?"GraveAccent":"Tilde";let y=u.move(d);if(t.lang){const g=a.enter(`codeFencedLang${f}`);y+=u.move(a.safe(t.lang,{before:y,after:" ",encode:["`"],...u.current()})),g()}if(t.lang&&t.meta){const g=a.enter(`codeFencedMeta${f}`);y+=u.move(" "),y+=u.move(a.safe(t.meta,{before:y,after:`
`,encode:["`"],...u.current()})),g()}return y+=u.move(`
`),c&&(y+=u.move(c+`
`)),y+=u.move(d),p(),y}function OM(t,i,a){return(a?"":"    ")+t}function Cm(t){const i=t.options.quote||'"';if(i!=='"'&&i!=="'")throw new Error("Cannot serialize title with `"+i+"` for `options.quote`, expected `\"`, or `'`");return i}function LM(t,i,a,o){const s=Cm(a),c=s==='"'?"Quote":"Apostrophe",u=a.enter("definition");let d=a.enter("label");const p=a.createTracker(o);let f=p.move("[");return f+=p.move(a.safe(a.associationId(t),{before:f,after:"]",...p.current()})),f+=p.move("]: "),d(),!t.url||/[\0- \u007F]/.test(t.url)?(d=a.enter("destinationLiteral"),f+=p.move("<"),f+=p.move(a.safe(t.url,{before:f,after:">",...p.current()})),f+=p.move(">")):(d=a.enter("destinationRaw"),f+=p.move(a.safe(t.url,{before:f,after:t.title?" ":`
`,...p.current()}))),d(),t.title&&(d=a.enter(`title${c}`),f+=p.move(" "+s),f+=p.move(a.safe(t.title,{before:f,after:s,...p.current()})),f+=p.move(s),d()),u(),f}function zM(t){const i=t.options.emphasis||"*";if(i!=="*"&&i!=="_")throw new Error("Cannot serialize emphasis with `"+i+"` for `options.emphasis`, expected `*`, or `_`");return i}Rm.attention=_M;Rm.peek=IM;function Rm(t,i,a,o){const s=a.enter("phrasing"),c=a.containerPhrasing({type:"root",children:[t]},o);return s(),c}function _M(t,i){return{construct:"emphasis",markers:zM(i)==="*"?["*","_"]:["_","*"],sizes:[1]}}function IM(t,i,a){return a.options.emphasis||"*"}function HM(t){return"&#x"+t.toString(16).toUpperCase()+";"}function Mm(t,i,a,o){let s,c,u;typeof i=="function"&&typeof a!="function"?(c=void 0,u=i,s=a):(c=i,u=a,s=o),Qw(t,c,d,s);function d(p,f){const y=f[f.length-1],g=y?y.children.indexOf(p):void 0;return u(p,g,y)}}function BM(t,i){let a=!1;return Mm(t,function(o){if("value"in o&&/\r?\n|\r/.test(o.value)||o.type==="break")return a=!0,Ff}),!!((!t.depth||t.depth<3)&&gm(t)&&(i.options.setext||a))}function qM(t,i,a,o){const s=Math.max(Math.min(6,t.depth||1),1),c=a.createTracker(o);if(BM(t,a)){const g=a.enter("headingSetext"),x=a.enter("phrasing"),v=a.containerPhrasing(t,{...c.current(),before:`
`,after:`
`});return x(),g(),v+`
`+(s===1?"=":"-").repeat(v.length-(Math.max(v.lastIndexOf("\r"),v.lastIndexOf(`
`))+1))}const u="#".repeat(s),d=a.enter("headingAtx"),p=a.enter("phrasing");c.move(u+" ");let f=a.containerPhrasing(t,{before:"# ",after:`
`,...c.current()});const y=f.charCodeAt(0);return(y===9||y===32)&&(f=HM(y)+f.slice(1)),f=f?u+" "+f:u,a.options.closeAtx&&(f+=" "+u),p(),d(),f}m0.peek=PM;function m0(t){return t.value||""}function PM(){return"<"}p0.peek=UM;function p0(t,i,a,o){const s=Cm(a),c=s==='"'?"Quote":"Apostrophe",u=a.enter("image");let d=a.enter("label");const p=a.createTracker(o);let f=p.move("![");return f+=p.move(a.safe(t.alt,{before:f,after:"]",...p.current()})),f+=p.move("]("),d(),!t.url&&t.title||/[\0- \u007F]/.test(t.url)?(d=a.enter("destinationLiteral"),f+=p.move("<"),f+=p.move(a.safe(t.url,{before:f,after:">",...p.current()})),f+=p.move(">")):(d=a.enter("destinationRaw"),f+=p.move(a.safe(t.url,{before:f,after:t.title?" ":")",...p.current()}))),d(),t.title&&(d=a.enter(`title${c}`),f+=p.move(" "+s),f+=p.move(a.safe(t.title,{before:f,after:s,...p.current()})),f+=p.move(s),d()),f+=p.move(")"),u(),f}function UM(){return"!"}g0.peek=FM;function g0(t,i,a,o){const s=t.referenceType,c=a.enter("imageReference");let u=a.enter("label");const d=a.createTracker(o);let p=d.move("![");const f=a.safe(t.alt,{before:p,after:"]",...d.current()});p+=d.move(f+"]["),u();const y=a.stack;a.stack=y.filter(function(x){return x!=="phrasing"}),u=a.enter("reference");const g=a.safe(a.associationId(t),{before:p,after:"]",...d.current()});return u(),a.stack=y,c(),s==="full"||!f||f!==g?p+=d.move(g+"]"):s==="shortcut"?p=p.slice(0,-1):p+=d.move("]"),p}function FM(){return"!"}y0.peek=VM;function y0(t,i,a){let o=t.value||"",s="`",c=-1;for(;new RegExp("(^|[^`])"+s+"([^`]|$)").test(o);)s+="`";for(/[^\n\r ]/.test(o)&&(/^[\n\r ]/.test(o)&&/[\n\r ]$/.test(o)||/^`|`$/.test(o))&&(o=" "+o+" ");++c<a.unsafe.length;){const u=a.unsafe[c],d=a.compilePattern(u);if(!u.atBreak)continue;let p;for(;p=d.exec(o);){let f=p.index;o.charCodeAt(f)===10&&o.charCodeAt(f-1)===13&&f--,o=o.slice(0,f)+" "+o.slice(p.index+1)}}return s+o+s}function VM(){return"`"}function b0(t,i){const a=gm(t);return!!(!i.options.resourceLink&&t.url&&!t.title&&t.children&&t.children.length===1&&t.children[0].type==="text"&&(a===t.url||"mailto:"+a===t.url)&&/^[a-z][+\-.a-z]+:/i.test(t.url)&&!/[\0- <>\u007F]/.test(t.url))}v0.peek=$M;function v0(t,i,a,o){const s=Cm(a),c=s==='"'?"Quote":"Apostrophe",u=a.createTracker(o);if(b0(t,a)){const y=a.stack;a.stack=y.filter(function(v){return v!=="phrasing"});const g=a.enter("autolink");let x=u.move("<");return x+=u.move(a.containerPhrasing(t,{before:x,after:">",...u.current()})),x+=u.move(">"),g(),a.stack=y,x}const d=a.enter("link");let p=a.enter("label"),f=u.move("[");return f+=u.move(a.containerPhrasing(t,{before:f,after:"](",...u.current()})),f+=u.move("]("),p(),!t.url&&t.title||/[\0- \u007F]/.test(t.url)?(p=a.enter("destinationLiteral"),f+=u.move("<"),f+=u.move(a.safe(t.url,{before:f,after:">",...u.current()})),f+=u.move(">")):(p=a.enter("destinationRaw"),f+=u.move(a.safe(t.url,{before:f,after:t.title?" ":")",...u.current()}))),p(),t.title&&(p=a.enter(`title${c}`),f+=u.move(" "+s),f+=u.move(a.safe(t.title,{before:f,after:s,...u.current()})),f+=u.move(s),p()),f+=u.move(")"),d(),f}function $M(t,i,a){return b0(t,a)?"<":"["}x0.peek=GM;function x0(t,i,a,o){const s=t.referenceType,c=a.enter("linkReference");let u=a.enter("label");const d=a.createTracker(o);let p=d.move("[");const f=a.containerPhrasing(t,{before:p,after:"]",...d.current()});p+=d.move(f+"]["),u();const y=a.stack;a.stack=y.filter(function(x){return x!=="phrasing"}),u=a.enter("reference");const g=a.safe(a.associationId(t),{before:p,after:"]",...d.current()});return u(),a.stack=y,c(),s==="full"||!f||f!==g?p+=d.move(g+"]"):s==="shortcut"?p=p.slice(0,-1):p+=d.move("]"),p}function GM(){return"["}function Nm(t){const i=t.options.bullet||"*";if(i!=="*"&&i!=="+"&&i!=="-")throw new Error("Cannot serialize items with `"+i+"` for `options.bullet`, expected `*`, `+`, or `-`");return i}function YM(t){const i=Nm(t),a=t.options.bulletOther;if(!a)return i==="*"?"-":"*";if(a!=="*"&&a!=="+"&&a!=="-")throw new Error("Cannot serialize items with `"+a+"` for `options.bulletOther`, expected `*`, `+`, or `-`");if(a===i)throw new Error("Expected `bullet` (`"+i+"`) and `bulletOther` (`"+a+"`) to be different");return a}function JM(t){const i=t.options.bulletOrdered||".";if(i!=="."&&i!==")")throw new Error("Cannot serialize items with `"+i+"` for `options.bulletOrdered`, expected `.` or `)`");return i}function w0(t){const i=t.options.rule||"*";if(i!=="*"&&i!=="-"&&i!=="_")throw new Error("Cannot serialize rules with `"+i+"` for `options.rule`, expected `*`, `-`, or `_`");return i}function XM(t,i,a,o){const s=a.enter("list"),c=a.bulletCurrent;let u=t.ordered?JM(a):Nm(a);const d=t.ordered?u==="."?")":".":YM(a);let p=i&&a.bulletLastUsed?u===a.bulletLastUsed:!1;if(!t.ordered){const y=t.children?t.children[0]:void 0;if((u==="*"||u==="-")&&y&&(!y.children||!y.children[0])&&a.stack[a.stack.length-1]==="list"&&a.stack[a.stack.length-2]==="listItem"&&a.stack[a.stack.length-3]==="list"&&a.stack[a.stack.length-4]==="listItem"&&a.indexStack[a.indexStack.length-1]===0&&a.indexStack[a.indexStack.length-2]===0&&a.indexStack[a.indexStack.length-3]===0&&(p=!0),w0(a)===u&&y){let g=-1;for(;++g<t.children.length;){const x=t.children[g];if(x&&x.type==="listItem"&&x.children&&x.children[0]&&x.children[0].type==="thematicBreak"){p=!0;break}}}}p&&(u=d),a.bulletCurrent=u;const f=a.containerFlow(t,o);return a.bulletLastUsed=u,a.bulletCurrent=c,s(),f}function ZM(t){const i=t.options.listItemIndent||"one";if(i!=="tab"&&i!=="one"&&i!=="mixed")throw new Error("Cannot serialize items with `"+i+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return i}function KM(t,i,a,o){const s=ZM(a);let c=a.bulletCurrent||Nm(a);i&&i.type==="list"&&i.ordered&&(c=(typeof i.start=="number"&&i.start>-1?i.start:1)+(a.options.incrementListMarker===!1?0:i.children.indexOf(t))+c);let u=c.length+1;(s==="tab"||s==="mixed"&&(i&&i.type==="list"&&i.spread||t.spread))&&(u=Math.ceil(u/4)*4);const d=a.createTracker(o);d.move(c+" ".repeat(u-c.length)),d.shift(u);const p=a.enter("listItem"),f=a.indentLines(a.containerFlow(t,d.current()),y);return p(),f;function y(g,x,v){return x?(v?"":" ".repeat(u))+g:(v?c:c+" ".repeat(u-c.length))+g}}function QM(t,i,a,o){const s=a.enter("paragraph"),c=a.enter("phrasing"),u=a.containerPhrasing(t,o);return c(),s(),u}function WM(t,i,a,o){if(!t.children.some(function(d){return AM(d)}))return a.containerFlow(t,o);const c=a.enter("phrasing"),u=a.containerPhrasing(t,o);return c(),u}function e2(t){const i=t.options.strong||"*";if(i!=="*"&&i!=="_")throw new Error("Cannot serialize strong with `"+i+"` for `options.strong`, expected `*`, or `_`");return i}Dm.attention=t2;Dm.peek=n2;function Dm(t,i,a,o){const s=a.enter("phrasing"),c=a.containerPhrasing({type:"root",children:[t]},o);return s(),c}function t2(t,i){return{construct:"strong",markers:e2(i)==="*"?["*","_"]:["_","*"],sizes:[2]}}function n2(t,i,a){return a.options.strong||"*"}function i2(t,i,a,o){const s=i?i.children:[],c=s.indexOf(t);return a.safe(t.value,{...o,afterNode:s[c+1],beforeNode:s[c-1]})}function a2(t){const i=t.options.ruleRepetition||3;if(i<3)throw new Error("Cannot serialize rules with repetition `"+i+"` for `options.ruleRepetition`, expected `3` or more");return i}function r2(t,i,a){const o=(w0(a)+(a.options.ruleSpaces?" ":"")).repeat(a2(a));return a.options.ruleSpaces?o.slice(0,-1):o}const S0={blockquote:EM,break:sx,code:jM,definition:LM,emphasis:Rm,hardBreak:sx,heading:qM,html:m0,image:p0,imageReference:g0,inlineCode:y0,link:v0,linkReference:x0,list:XM,listItem:KM,paragraph:QM,root:WM,strong:Dm,text:i2,thematicBreak:r2};function o2(){return{enter:{table:l2,tableData:ux,tableHeader:ux,tableRow:u2},exit:{codeText:c2,table:s2,tableData:uf,tableHeader:uf,tableRow:uf}}}function l2(t){const i=t._align;this.enter({type:"table",align:i.map(function(a){return a==="none"?null:a}),children:[]},t),this.data.inTable=!0}function s2(t){this.exit(t),this.data.inTable=void 0}function u2(t){this.enter({type:"tableRow",children:[]},t)}function uf(t){this.exit(t)}function ux(t){this.enter({type:"tableCell",children:[]},t)}function c2(t){let i=this.resume();this.data.inTable&&(i=i.replace(/\\([\\|])/g,d2));const a=this.stack[this.stack.length-1];a.type,a.value=i,this.exit(t)}function d2(t,i){return i==="|"?i:t}function h2(t){const i=t||{},a=i.tableCellPadding,o=i.tablePipeAlign,s=i.stringLength,c=a?" ":"|";return{unsafe:[{character:"\r",inConstruct:"tableCell"},{character:`
`,inConstruct:"tableCell"},{atBreak:!0,character:"|",after:"[	 :-]"},{character:"|",inConstruct:"tableCell"},{atBreak:!0,character:":",after:"-"},{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{inlineCode:x,table:u,tableCell:p,tableRow:d}};function u(v,w,A,T){return f(y(v,A,T),v.align)}function d(v,w,A,T){const S=g(v,A,T),E=f([S]);return E.slice(0,E.indexOf(`
`))}function p(v,w,A,T){const S=A.enter("tableCell"),E=A.enter("phrasing"),C=A.containerPhrasing(v,{...T,before:c,after:c});return E(),S(),C}function f(v,w){return kM(v,{align:w,alignDelimiters:o,padding:a,stringLength:s})}function y(v,w,A){const T=v.children;let S=-1;const E=[],C=w.enter("table");for(;++S<T.length;)E[S]=g(T[S],w,A);return C(),E}function g(v,w,A){const T=v.children;let S=-1;const E=[],C=w.enter("tableRow");for(;++S<T.length;)E[S]=p(T[S],v,w,A);return C(),E}function x(v,w,A){let T=S0.inlineCode(v,w,A);return A.stack.includes("tableCell")&&(T=T.replace(/\|/g,"\\$&")),T}}function f2(){return{exit:{taskListCheckValueChecked:cx,taskListCheckValueUnchecked:cx,paragraph:p2}}}function m2(){return{unsafe:[{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{listItem:g2}}}function cx(t){const i=this.stack[this.stack.length-2];i.type,i.checked=t.type==="taskListCheckValueChecked"}function p2(t){const i=this.stack[this.stack.length-2];if(i&&i.type==="listItem"&&typeof i.checked=="boolean"){const a=this.stack[this.stack.length-1];a.type;const o=a.children[0];if(o&&o.type==="text"){const s=i.children;let c=-1,u;for(;++c<s.length;){const d=s[c];if(d.type==="paragraph"){u=d;break}}u===a&&(o.value=o.value.slice(1),o.value.length===0?a.children.shift():a.position&&o.position&&typeof o.position.start.offset=="number"&&(o.position.start.column++,o.position.start.offset++,a.position.start=Object.assign({},o.position.start)))}}this.exit(t)}function g2(t,i,a,o){const s=t.children[0],c=typeof t.checked=="boolean"&&s&&s.type==="paragraph",u="["+(t.checked?"x":" ")+"] ",d=a.createTracker(o);c&&d.move(u);let p=S0.listItem(t,i,a,{...o,...d.current()});return c&&(p=p.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/,f)),p;function f(y){return y+u}}function k0(){return[$R(),hM(),gM(),o2(),f2()]}function y2(t){return{extensions:[GR(),fM(t),yM(),h2(t),m2()]}}function jm(){return{name:"gfm",directives:["gfm"],micromark:[c0()],mdast:k0(),scope:"local",components:{gfm:({children:t})=>t}}}const b2="modulepreload",v2=function(t){return"/LiMR/"+t},dx={},ec=function(i,a,o){let s=Promise.resolve();if(a&&a.length>0){let p=function(f){return Promise.all(f.map(y=>Promise.resolve(y).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),d=u?.nonce||u?.getAttribute("nonce");s=p(a.map(f=>{if(f=v2(f),f in dx)return;dx[f]=!0;const y=f.endsWith(".css"),g=y?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${g}`))return;const x=document.createElement("link");if(x.rel=y?"stylesheet":b2,y||(x.as="script"),x.crossOrigin="",x.href=f,d&&x.setAttribute("nonce",d),document.head.appendChild(x),y)return new Promise((v,w)=>{x.addEventListener("load",v),x.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${f}`)))})}))}function c(u){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=u,window.dispatchEvent(d),!d.defaultPrevented)throw u}return s.then(u=>{for(const d of u||[])d.status==="rejected"&&c(d.reason);return i().catch(c)})},x2={tokenize:w2,concrete:!0,name:"mathFlow"},hx={tokenize:S2,partial:!0};function w2(t,i,a){const o=this,s=o.events[o.events.length-1],c=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let u=0;return d;function d(E){return t.enter("mathFlow"),t.enter("mathFlowFence"),t.enter("mathFlowFenceSequence"),p(E)}function p(E){return E===36?(t.consume(E),u++,p):u<2?a(E):(t.exit("mathFlowFenceSequence"),Ve(t,f,"whitespace")(E))}function f(E){return E===null||Ce(E)?g(E):(t.enter("mathFlowFenceMeta"),t.enter("chunkString",{contentType:"string"}),y(E))}function y(E){return E===null||Ce(E)?(t.exit("chunkString"),t.exit("mathFlowFenceMeta"),g(E)):E===36?a(E):(t.consume(E),y)}function g(E){return t.exit("mathFlowFence"),o.interrupt?i(E):t.attempt(hx,x,T)(E)}function x(E){return t.attempt({tokenize:S,partial:!0},T,v)(E)}function v(E){return(c?Ve(t,w,"linePrefix",c+1):w)(E)}function w(E){return E===null?T(E):Ce(E)?t.attempt(hx,x,T)(E):(t.enter("mathFlowValue"),A(E))}function A(E){return E===null||Ce(E)?(t.exit("mathFlowValue"),w(E)):(t.consume(E),A)}function T(E){return t.exit("mathFlow"),i(E)}function S(E,C,R){let _=0;return Ve(E,N,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function N(B){return E.enter("mathFlowFence"),E.enter("mathFlowFenceSequence"),j(B)}function j(B){return B===36?(_++,E.consume(B),j):_<u?R(B):(E.exit("mathFlowFenceSequence"),Ve(E,z,"whitespace")(B))}function z(B){return B===null||Ce(B)?(E.exit("mathFlowFence"),C(B)):R(B)}}}function S2(t,i,a){const o=this;return s;function s(u){return u===null?i(u):(t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),c)}function c(u){return o.parser.lazy[o.now().line]?a(u):i(u)}}function k2(t){let a={}.singleDollarTextMath;return a==null&&(a=!0),{tokenize:o,resolve:T2,previous:A2,name:"mathText"};function o(s,c,u){let d=0,p,f;return y;function y(A){return s.enter("mathText"),s.enter("mathTextSequence"),g(A)}function g(A){return A===36?(s.consume(A),d++,g):d<2&&!a?u(A):(s.exit("mathTextSequence"),x(A))}function x(A){return A===null?u(A):A===36?(f=s.enter("mathTextSequence"),p=0,w(A)):A===32?(s.enter("space"),s.consume(A),s.exit("space"),x):Ce(A)?(s.enter("lineEnding"),s.consume(A),s.exit("lineEnding"),x):(s.enter("mathTextData"),v(A))}function v(A){return A===null||A===32||A===36||Ce(A)?(s.exit("mathTextData"),x(A)):(s.consume(A),v)}function w(A){return A===36?(s.consume(A),p++,w):p===d?(s.exit("mathTextSequence"),s.exit("mathText"),c(A)):(f.type="mathTextData",v(A))}}}function T2(t){let i=t.length-4,a=3,o,s;if((t[a][1].type==="lineEnding"||t[a][1].type==="space")&&(t[i][1].type==="lineEnding"||t[i][1].type==="space")){for(o=a;++o<i;)if(t[o][1].type==="mathTextData"){t[i][1].type="mathTextPadding",t[a][1].type="mathTextPadding",a+=2,i-=2;break}}for(o=a-1,i++;++o<=i;)s===void 0?o!==i&&t[o][1].type!=="lineEnding"&&(s=o):(o===i||t[o][1].type==="lineEnding")&&(t[s][1].type="mathTextData",o!==s+2&&(t[s][1].end=t[o-1][1].end,t.splice(s+2,o-s-2),i-=o-s-2,o=s+2),s=void 0);return t}function A2(t){return t!==36||this.events[this.events.length-1][1].type==="characterEscape"}function E2(t){return{flow:{36:x2},text:{36:k2()}}}function C2(){return{enter:{mathFlow:t,mathFlowFenceMeta:i,mathText:c},exit:{mathFlow:s,mathFlowFence:o,mathFlowFenceMeta:a,mathFlowValue:d,mathText:u,mathTextData:d}};function t(p){const f={type:"element",tagName:"code",properties:{className:["language-math","math-display"]},children:[]};this.enter({type:"math",meta:null,value:"",data:{hName:"pre",hChildren:[f]}},p)}function i(){this.buffer()}function a(){const p=this.resume(),f=this.stack[this.stack.length-1];f.type,f.meta=p}function o(){this.data.mathFlowInside||(this.buffer(),this.data.mathFlowInside=!0)}function s(p){const f=this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),y=this.stack[this.stack.length-1];y.type,this.exit(p),y.value=f;const g=y.data.hChildren[0];g.type,g.tagName,g.children.push({type:"text",value:f}),this.data.mathFlowInside=void 0}function c(p){this.enter({type:"inlineMath",value:"",data:{hName:"code",hProperties:{className:["language-math","math-inline"]},hChildren:[]}},p),this.buffer()}function u(p){const f=this.resume(),y=this.stack[this.stack.length-1];y.type,this.exit(p),y.value=f,y.data.hChildren.push({type:"text",value:f})}function d(p){this.config.enter.data.call(this,p),this.config.exit.data.call(this,p)}}function lo({value:t="",onCopy:i,label:a,variant:o="plain",className:s=""}){const c=ln(),[u,d]=L.useState("idle"),p=L.useRef(void 0),f=L.useRef(!0),y=u==="copied"?c.copied:u==="error"?c.copyFailed:a??c.copy;L.useEffect(()=>(f.current=!0,()=>{f.current=!1,clearTimeout(p.current)}),[]);const g=async()=>{try{if(i?await i():await navigator.clipboard.writeText(t),!f.current)return;d("copied")}catch{if(!f.current)return;d("error")}clearTimeout(p.current),p.current=setTimeout(()=>d("idle"),2200)};return b.jsxs("button",{type:"button",className:`limr-copy-button ${s}`,"data-variant":o,"data-status":u,"data-limr-ignore":"true","aria-label":y,title:y,onClick:g,children:[b.jsxs("svg",{className:"limr-copy-glyph",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[b.jsxs("g",{className:"limr-copy-sheets",children:[b.jsx("rect",{x:"8.5",y:"8",width:"10.5",height:"12",rx:"3"}),b.jsx("path",{d:"M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5"})]}),b.jsx("path",{className:"limr-copy-check",d:"m5.5 12 4.2 4.2 8.8-9",pathLength:"1"})]}),b.jsx("span",{className:u==="error"?"limr-copy-error":"limr-sr-only",role:"status",children:u==="copied"?c.copied:u==="error"?c.copyFailed:""})]})}function Om(t,i,a,o=[a]){bi(t,s=>{if(s.type!=="component"||!o.includes(s.name??"")||!s.position)return;const c=s.position.start.offset,u=s.position.end.offset,d=i.slice(c,u),p=/^[^\r\n]*(?:\r\n|\r|\n)/.exec(d),f=/(?:\r\n|\r|\n)[ \t]*:{2,}[ \t]*$/.exec(d),y=c+(p?.[0].length??d.length),g=f?c+f.index:u;s.type=a,s.value=i.slice(y,g).replace(/\r\n?/g,`
`).replace(s.incomplete?/\n$/:/$^/,""),s.valueRange={start:y,end:g},a==="code"&&(s.lang=String(s.attributes?.lang??s.attributes?.language??"text")),s.children=void 0})}let T0,R2;const M2=()=>R2??=ec(()=>import("./math-renderer-CUahYAJ6.js"),[]).then(t=>(T0=t.default,t)),N2=L.lazy(M2);function D2(t={}){function i({node:a}){const o=a.type==="math",s=b.jsx("code",{className:"limr-math-source",children:a.value}),c=T0??N2,u=b.jsx(L.Suspense,{fallback:s,children:b.jsx(c,{value:a.value??"",display:o,options:t})});return o?b.jsxs("div",{className:"limr-math-block",children:[u,b.jsx(lo,{className:"limr-math-copy",variant:"glass",label:"Copy LaTeX",value:`$$
${a.value??""}
$$`})]}):u}return{name:"math",directives:["math"],literal:!0,micromark:[E2()],mdast:[C2()],scope:"local",components:{math:i,inlineMath:i},transform:(a,o)=>Om(a,o.source,"math")}}function Lm(t){return(t.value??"").replace(/\r\n?|\n/g,t.type==="inlineCode"?" ":`
`)}function j2(t,i){const a=Be(i),o=t.slice(a.start,a.end),s=Lm(i),c=[],u=[];if(i.valueRange){const x=i.valueRange;for(let v=x.start;v<x.end&&c.length<s.length;v++){const w=t[v]==="\r"&&t[v+1]===`
`?2:1;c.push(v),u.push(v+w),v+=w-1}return{starts:c,ends:u,exact:c.length===s.length}}if(i.type==="inlineCode"){const x=/^`+/.exec(o)?.[0].length??0;let v=x,w=o.length-x;const A=o.slice(v,w).replace(/\r\n?|\n/g," ");A.startsWith(" ")&&A.endsWith(" ")&&/[^ ]/.test(A)&&(v+=o.slice(v,v+2)===`\r
`?2:1,w-=o.slice(w-2,w)===`\r
`?2:1);for(let T=v;T<w;T++){const S=o[T]==="\r"&&o[T+1]===`
`?2:1;c.push(a.start+T),u.push(a.start+T+S),T+=S-1}return{starts:c,ends:u,exact:c.length===s.length}}const d=[...o.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)].filter(x=>x[0]);let f=/^[ \t]*(?:`{3,}|~{3,})/.test(d[0]?.[0]??"")?1:0,y=!0;const g=s.split(`
`);for(let x=0;x<g.length;x++,f++){const v=d[f],w=g[x],A=(v?.[0]??"").replace(/[\r\n]+$/,""),T=A.endsWith(w)?A.length-w.length:-1;(T<0||!v)&&(y=!1);const S=a.start+(v?.index??o.length)+Math.max(0,T);for(let E=0;E<w.length;E++)c.push(S+E),u.push(S+E+1);x<g.length-1&&(c.push(a.start+(v?.index??0)+A.length),u.push(a.start+(v?.index??0)+(v?.[0].length??A.length)))}return{starts:c,ends:u,exact:y}}const O2=new km(96),L2={js:"javascript",ts:"typescript",py:"python",sh:"bash",yml:"yaml",md:"markdown",rs:"rust","c++":"cpp",text:"text",txt:"text"};function A0(t={}){function i({node:a,pending:o,renderValue:s}){const c=bt(),u=Lm(a),d=String(a.lang??"text").toLowerCase(),p=L2[d]??d,[f,y]=L.useState(null),[g,x]=L.useState(t.eager??!1),v=L.useRef(null);L.useEffect(()=>{if(g)return;if(typeof IntersectionObserver>"u"){x(!0);return}const A=new IntersectionObserver(T=>{T.some(S=>S.isIntersecting)&&(x(!0),A.disconnect())},{root:c.configuration.get().scrollRoot,rootMargin:"400px"});return v.current&&A.observe(v.current),()=>A.disconnect()},[g,c]),L.useEffect(()=>{if(!g||o||u.length>(t.maxLength??1e5))return;let A=!1,T,S;const E=setTimeout(()=>{if(p==="text"||t.languages&&!t.languages.includes(p))return;const C=O2.acquire(JSON.stringify([u,p,t.lightTheme,t.darkTheme]),async()=>{const R=await ec(()=>import("./index-CueyGTAy.js"),[]);if(!(p in R.bundledLanguages)&&!(p in R.bundledLanguagesAlias))return[];const _=await R.codeToTokens(u,{lang:p,themes:{light:t.lightTheme??"github-light",dark:t.darkTheme??"github-dark"},defaultColor:!1});let N=0;return _.tokens.flatMap((j,z)=>{const B=j.map(I=>{const X=N;return N+=I.content.length,{content:I.content,offset:X,style:I.htmlStyle}});return z<_.tokens.length-1&&B.push({content:`
`,offset:N++}),B})});T=C.release,C.promise.then(R=>{const _=()=>{if(A)return;const N=v.current?.ownerDocument.getSelection();if(N&&!N.isCollapsed&&N.rangeCount&&v.current&&N.getRangeAt(0).intersectsNode(v.current)){S||(S=_,document.addEventListener("selectionchange",S));return}S&&(document.removeEventListener("selectionchange",S),S=void 0),y({code:u,tokens:R})};_()}).catch(()=>{})},0);return()=>{A=!0,clearTimeout(E),T?.(),S&&document.removeEventListener("selectionchange",S)}},[u,p,o,g]);const w=f?.code===u?f.tokens:void 0;return b.jsxs("div",{className:"limr-code-block",ref:v,children:[b.jsxs("div",{className:"limr-code-header","data-limr-ignore":"true",children:[b.jsx("span",{children:d}),b.jsx(lo,{value:u})]}),b.jsx("pre",{className:w?.length?"shiki":void 0,children:b.jsx("code",{children:s(w)})})]})}return{name:"code-highlight",directives:["code","code-highlight"],literal:!0,scope:"local",components:{code:i},transform:(a,o)=>Om(a,o.source,"code",["code","code-highlight"])}}const z2=new Set(["inlineCode","code","math","inlineMath","image","imageReference","html"]),_2=new Set(["definition","footnoteDefinition","annotationDefinition","footnoteReference"]),I2=new Set(["text","paragraph","heading","strong","emphasis","delete","blockquote","list","listItem","link","linkReference","table","tableRow","tableCell","thematicBreak","break","annotationReference"]);function H2(t,i,a){const o=[];let s=!0;const c=u=>{if(!(u.selection==="atomic"||z2.has(u.type)||_2.has(u.type))){if(!I2.has(u.type)||i[u.type]||a?.has(u.type)){s=!1;return}if(u.type==="text"){u.value&&o.push(u);return}u.children?.forEach(c)}};return c(t),s?o:null}function B2(t,i){const a=Be(t),o=t.value??"",s=i.slice(a.start,a.end),c=s===o;let u;const d=()=>u??=Ml(s,o,{start:0,end:s.length});return{range:a,atomic:!1,get exact(){return c||d().exact},resolve(p,f){const y=Math.max(0,Math.min(o.length,p));return c?a.start+y:a.start+(f==="start"?d().starts[y]??s.length:d().ends[y-1]??0)}}}function q2(t,i,a){const o=[],s=()=>o.forEach(f=>a.bindings.delete(f)),c=i.map(f=>B2(f,a.document.getSnapshot().source)),u=t.ownerDocument.createTreeWalker(t,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(f){if(f.nodeType===Node.ELEMENT_NODE){const y=f;return y.hasAttribute("data-limr-ignore")||y.hasAttribute("data-limr-text")||a.bindings.get(y)?.atomic?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_SKIP}return NodeFilter.FILTER_ACCEPT}});let d=0,p=0;for(let f=u.nextNode();f;f=u.nextNode()){const y=f.textContent??"";if(!y)continue;const g=[];for(let w=0;w<y.length;){const A=i[d]?.value??"",T=Math.min(y.length-w,A.length-p);if(T<=0||y.slice(w,w+T)!==A.slice(p,p+T))return s(),()=>{};g.push({start:w,end:w+T,offset:p,binding:c[d]}),w+=T,p+=T,p===A.length&&(d++,p=0)}const x=g[0],v=g[g.length-1];a.bindings.set(f,g.length===1&&x.offset===0&&y===i[d-1]?.value?x.binding:{range:{start:x.binding.range.start,end:v.binding.range.end},atomic:!1,get exact(){return g.every(w=>w.binding.exact)},resolve(w,A){const T=g.find(S=>A==="start"?S.end>w:S.end>=w)??v;return T.binding.resolve(T.offset+w-T.start,A)}}),o.push(f)}return s}const Gf={keyframes:[{opacity:0},{opacity:1}],timing:{duration:420,easing:"cubic-bezier(.16,1,.3,1)"}};function E0(t){const i=t.configuration.get();if(i.streamEffect!==void 0)return i.streamEffect;let a=Gf;for(const o of i.extensions??[])o.streaming?.effect!==void 0&&(a=o.streaming.effect);return a}function C0(t,i){if(!(i===!1||!t.animate||matchMedia("(prefers-reduced-motion: reduce)").matches))return t.animate(i.keyframes??Gf.keyframes,{...Gf.timing,...i.timing})}function R0(t,i,a=!0,o=!1){const s=bt();Et(()=>{const c=t.current,u=o?c?.firstElementChild:c;if(!i||!u)return;const d=E0(s),p=d&&d.className?.split(/\s+/).filter(Boolean);p&&u.classList.add(...p),u.dataset.limrEntrance="";const f=C0(u,d);return()=>{f?.cancel(),p&&u.classList.remove(...p)}},[s,i,a])}function P2({children:t,state:i}){const a=L.useRef(null);return R0(a,!0,i,!0),b.jsx("div",{ref:a,className:"limr-stream-block",children:t})}function Yf({value:t,animateInitial:i=!0}){const a=bt(),o=L.useRef(t),s=L.useRef(t),c=L.useRef(null),u=L.useRef(new Set),d=L.useRef(!1),p=L.useRef(!1),f=L.useCallback(()=>{const y=c.current;if(!y)return;const g=y.ownerDocument.getSelection();if(g&&!g.isCollapsed&&g.rangeCount&&g.getRangeAt(0).intersectsNode(y)){d.current||(y.ownerDocument.addEventListener("selectionchange",f),d.current=!0);return}d.current&&(y.ownerDocument.removeEventListener("selectionchange",f),d.current=!1);for(const x of y.querySelectorAll("[data-limr-increment-done]"))x.replaceWith(...x.childNodes);y.normalize()},[]);return Et(()=>{const y=c.current;if(!y)return;const g=E0(a),x=A=>{const T=C0(A,g);T&&(u.current.add(T),T.finished.then(()=>{u.current.delete(T),A.hasAttribute("data-limr-increment")&&(A.dataset.limrIncrementDone=""),f()},()=>u.current.delete(T)))};if(p.current||(p.current=!0,i&&t&&a.document.getSnapshot().streaming&&x(y)),t===s.current)return;let v=s.current.length;if(!t.startsWith(s.current)){for(const E of u.current)E.cancel();u.current.clear();for(const E of y.querySelectorAll("[data-limr-increment]"))E.dataset.limrIncrementDone="";for(v=0;v<Math.min(s.current.length,t.length)&&s.current[v]===t[v];)v++;const A=y.ownerDocument.createTreeWalker(y,NodeFilter.SHOW_TEXT),T=[];for(let E=A.nextNode();E;E=A.nextNode())T.push(E);let S=0;for(const E of T){const C=E.length;S>=v?E.remove():S+C>v&&E.deleteData(v-S,C),S+=C}for(const E of y.querySelectorAll("[data-limr-increment]"))E.textContent||E.remove()}const w=t.slice(v);if(w)if(g===!1||!y.animate||matchMedia("(prefers-reduced-motion: reduce)").matches){const A=y.lastChild;A?.nodeType===Node.TEXT_NODE?A.appendData(w):y.append(y.ownerDocument.createTextNode(w))}else{const A=y.ownerDocument.createElement("span");A.dataset.limrIncrement="",A.className=`limr-stream-increment ${g.className??""}`,A.textContent=w,y.append(A),x(A)}s.current=t},[t,a]),L.useEffect(()=>{const y=c.current?.ownerDocument;return()=>{y?.removeEventListener("selectionchange",f);for(const g of u.current)g.cancel();u.current.clear()}},[]),b.jsx("span",{ref:c,"data-limr-stream-text":"",children:o.current})}let fx;class U2 extends L.Component{release;version=0;start(){const i=++this.version;!this.props.enabled||this.props.pending||(fx??=ec(()=>import("./knuth-plass-layout-Duk2J56u.js"),[]),fx.then(a=>{if(i!==this.version)return;const o=this.props.element();o&&(this.release=a.typeset(o,this.props.runtime,this.props.options))}))}componentDidMount(){this.start()}getSnapshotBeforeUpdate(){return this.version++,this.release?.(),this.release=void 0,null}componentDidUpdate(){this.start()}componentWillUnmount(){this.version++,this.release?.()}render(){return this.props.children}}const tc=t=>t?{"data-limr-block":t.id,"data-source-start":t.range.start,"data-source-end":t.range.end,"data-pending":t.pending||void 0}:{};function Ru({occurrence:t}){const i=bt(),a=qe(i.decorations,f=>f.annotations.get(t.annotationIds[0])),o=qe(i.interaction,f=>f.active===t.id),s=qe(i.interaction,f=>f.hovered===t.id),c=qe(i.configuration,()=>i.annotationTypes.get(a?.type??"citation")),u=c?.icon,d=c?.Marker,p=typeof u=="function"||u&&typeof u=="object"&&!L.isValidElement(u)&&"$$typeof"in u?L.createElement(u):u;return b.jsx("span",{className:"limr-mark-wrap","data-limr-ignore":"true","data-limr-marker":t.id,"data-source-start":t.range.start,"data-source-end":t.range.end,children:b.jsxs("button",{type:"button",ref:f=>i.registerAnchor(t.id,f),className:"limr-mark","data-limr-anchor":t.id,"data-active":o||s||void 0,style:{"--limr-mark-color":c?.color},"aria-label":c?.label??a?.type??"Annotation","aria-expanded":o,onPointerEnter:f=>{f.pointerType!=="touch"&&i.hover(t.id)},onPointerLeave:f=>{f.pointerType!=="touch"&&i.interaction.get().hovered===t.id&&i.interaction.get().hoverSource==="marker"&&i.hover(null)},onFocus:f=>{f.currentTarget.matches(":focus-visible")&&i.hover(t.id)},onBlur:f=>{f.relatedTarget instanceof Element&&f.relatedTarget.closest("[data-occurrence]")?.getAttribute("data-occurrence")===t.id||i.interaction.get().hovered===t.id&&i.interaction.get().hoverSource==="marker"&&i.hover(null)},onClick:()=>{const f=i.interaction.get().hovered===t.id;i.activate(o?null:t.id),f&&i.hover(t.id)},children:[b.jsx("span",{className:"limr-mark-icon",children:d&&a?b.jsx(d,{annotation:a,active:o}):p??"•"}),t.annotationIds.length>1&&b.jsx("span",{className:"limr-mark-count",children:t.annotationIds.length})]})})}function Mu({node:t,context:i,mapping:a,marks:o,style:s,className:c}){const{runtime:u}=i,d=t.value??"",p=Be(t),f=u.document.getSnapshot().source,y=L.useMemo(()=>{let S;const E=f.slice(p.start,p.end);return()=>{if(a)return typeof a=="function"?a():a;if(!S){const C=Ml(E,d,{start:0,end:E.length},{escapes:t.verbatimEscapes!==!0});S={starts:C.starts.map(R=>R+p.start),ends:C.ends.map(R=>R+p.start),exact:C.exact}}return S}},[t,a]),g=o??i.marks.get(t)??t0,x=i.highlights.filter(S=>_t(S.range,p));if(!g.length&&!x.length){const S=!a&&f.slice(p.start,p.end)===d;return b.jsx("span",{style:s,className:c,"data-limr-text":"","data-source-start":p.start,"data-source-end":p.end,ref:E=>{E&&u.bindings.set(E,{range:p,atomic:!1,get exact(){return S||y().exact},resolve:(C,R)=>S?Math.max(p.start,Math.min(p.end,p.start+C)):R==="start"?y().starts[C]??p.end:y().ends[C-1]??p.start})},children:i.live?b.jsx(Yf,{value:d,animateInitial:p.end>i.revealFrom}):d})}const v=y(),w=new Map,A=new Set([0,d.length]);for(const S of g){let E=v.ends.findIndex(C=>C>=S.range.end);E=E<0?d.length:E+1,A.add(E),w.set(E,[...w.get(E)??[],S])}for(const S of x){const E=v.ends.findIndex(R=>R>S.range.start),C=v.starts.findIndex(R=>R>=S.range.end);A.add(Math.max(0,E)),A.add(C<0?d.length:C)}const T=[...A].sort((S,E)=>S-E);return b.jsx(b.Fragment,{children:T.slice(1).map((S,E)=>{const C=T[E],R={start:v.starts[C]??p.start,end:v.ends[S-1]??p.end},_=x.filter(j=>_t(j.range,R));let N=i.live?b.jsx(Yf,{value:d.slice(C,S),animateInitial:R.end>i.revealFrom}):d.slice(C,S);for(const j of _)N=b.jsx("mark",{"data-limr-highlight":j.id,"data-hidden":j.hidden||void 0,className:`limr-highlight limr-highlight-${j.style??"background"}`,style:{"--limr-highlight":j.color??"#f3ce7380"},children:N},j.id);return b.jsxs("span",{style:s,className:c,ref:j=>{j&&u.bindings.set(j,{range:R,atomic:!1,exact:v.exact,resolve:(z,B)=>{const I=Math.max(C,Math.min(S,C+z));return B==="start"?v.starts[I]??R.end:v.ends[I-1]??R.start}})},"data-limr-text":"","data-source-start":R.start,"data-source-end":R.end,children:[N,w.get(S)?.map(j=>b.jsx(Ru,{occurrence:j},j.id))]},C)})})}function cf({node:t,context:i,tokens:a}){const o=i.runtime.document.getSnapshot().source,s=L.useMemo(()=>{let f;return()=>f??=j2(o,t)},[t]),c=Lm(t),u=i.marks.get(t)??t0;if(!a?.length)return b.jsx(Mu,{node:{...t,type:"text",value:c},context:i,mapping:s,marks:u},0);const d=s(),p=a?.length?a:[{content:c,offset:0}];return b.jsx(b.Fragment,{children:p.map((f,y)=>{const g=f.offset,x=g+f.content.length,v={starts:d.starts.slice(g,x),ends:d.ends.slice(g,x),exact:d.exact},w={start:v.starts[0]??Be(t).start,end:v.ends.at(-1)??Be(t).end},A={type:"text",value:f.content,position:{start:{offset:w.start,line:0,column:0},end:{offset:w.end,line:0,column:0}}};return b.jsx(Mu,{className:f.style?"limr-code-token":void 0,style:f.style,node:A,context:i,mapping:v,marks:u.filter(T=>T.range.end>w.start&&T.range.end<=w.end)},y)})})}function F2({node:t,context:i,children:a,inline:o,blockElement:s}){const c=Be(t),u=qe(i.runtime.interaction,v=>v.selection?.raw.ranges.some(w=>_t(w,c))??!1),d=i.highlights.filter(v=>!v.hidden&&_t(v.range,c)),p=o?"span":"div",f=["image","imageReference"].includes(t.type)||t.type==="component"&&t.name==="img",y=f||!o,g=[...i.marks.get(t)??[],...y?i.afterMarks.get(t)??[]:[]],x=g.map(v=>b.jsx(Ru,{occurrence:v},v.id));return b.jsxs(b.Fragment,{children:[b.jsxs(p,{...tc(s),className:`limr-atomic${f?" limr-atomic-image":""}${y?" limr-atomic-corner":""}${d.length?" limr-atomic-highlight":""}`,"data-selected":u||void 0,"data-limr-media":f?"image":void 0,"data-limr-atomic":o?"inline":"block","data-source-start":c.start,"data-source-end":c.end,style:{"--limr-highlight":d[0]?.color??"#f3ce7380"},ref:v=>{v&&i.runtime.bindings.set(v,{range:c,atomic:!0}),s?.ref(v)},children:[a,y&&!!g.length&&b.jsx("span",{className:"limr-corner-marks","data-limr-ignore":"true",children:x})]}),!y&&x]})}function V2({node:t,children:i,runtime:a,blockElement:o}){const s=(()=>{const c=a.document.getSnapshot(),u=t.position?.start.offset??0;let d=0,p=c.headings.length;for(;d<p;){const f=d+p>>>1;c.headings[f].range.start<u?d=f+1:p=f}return c.headings[d]?.range.start===u?c.headings[d].id:void 0})();return L.createElement(`h${t.depth}`,{...tc(o),id:s,ref:c=>{s&&a.registerHeading(s,c),o?.ref(c)}},i)}function mx({node:t,children:i,image:a}){const o=Dl(s=>s.definitions.get(String(t.identifier)));return o?a?b.jsx("img",{src:gn(o.url,!0),alt:String(t.alt??""),title:o.title?String(o.title):void 0,loading:"lazy",decoding:"async"}):b.jsx("a",{href:gn(o.url),title:o.title?String(o.title):void 0,children:i}):b.jsx(b.Fragment,{children:i||String(t.alt??t.label??"")})}function $2({node:t}){const i=bt(),a=String(t.identifier),o=Dl(s=>s.footnoteOrder.indexOf(a)+1);return b.jsx("sup",{"data-limr-ignore":"true",children:b.jsx("a",{href:`#${i.document.id}-fn-${encodeURIComponent(a)}`,id:`${i.document.id}-fnref-${Be(t).start}`,"aria-label":`Footnote ${o}`,children:o})})}class G2 extends L.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(i,a){}componentDidUpdate(i){this.state.failed&&i.fallback!==this.props.fallback&&this.setState({failed:!1})}render(){return this.state.failed?b.jsx("pre",{className:"limr-extension-error",children:this.props.fallback}):this.props.children}}function M0(t){return t.type==="component"&&!t.inline||["math","code","list","table","blockquote"].includes(t.type)||(t.children?.some(M0)??!1)}function Nu(t,i,a=0,o){const{runtime:s}=i;if(t.type==="text"&&i.compact)return i.live?b.jsx(Yf,{value:t.value??"",animateInitial:Be(t).end>i.revealFrom},`text-${t.position?.start.offset??a}`):t.value??"";if(t.type==="streamPending")return null;const c=t===i.block.node?i.blockElement:void 0,u=`${t.type}-${t.position?.start.offset??a}-${a}`;let d=t.type==="list"?{...i,tightList:!t.spread}:i;s.rendererOverrides.size&&(d={...d,ancestors:[...i.ancestors??[],t]});const p=(R,_)=>{let N=-1;return R.forEach((j,z)=>{["definition","footnoteDefinition","annotationDefinition"].includes(j.type)||(N=z)}),N<0&&_?.trailing?[b.jsx(L.Fragment,{children:_.trailing},"trailing")]:R.map((j,z)=>Nu(j,d,z,z===N?_?.trailing:void 0))},f=t.type==="table"?[]:t.type==="listItem"&&i.tightList?(t.children??[]).flatMap((R,_)=>R.type==="paragraph"?p(R.children??[]):Nu(R,i,_)):p(t.children??[]),y=t.type==="component"?t.name??"":t.type,x=s.rendererOverrides.get(y)?.slice().reverse().find(R=>!R.when||R.when(t,{pending:i.block.pending,incomplete:!!t.incomplete,ancestors:i.ancestors??[]})),v=t.incomplete&&!x?s.configuration.get().extensions?.slice().reverse().find(R=>R.components?.[y]):void 0,w=x?.component??(t.incomplete&&v?.streaming?.Loading||s.components[y]);let A;if(w){const R=Be(t),_=N=>{const j=t.attributeNodes?.[N];if(!j)return String(t.attributes?.[N]??"");const z=Be(j);return b.jsx(Mu,{node:j,context:i,marks:i.occurrences.filter(B=>B.range.end>z.start&&B.range.end<=z.end)})};A=b.jsx(G2,{fallback:s.document.getSnapshot().source.slice(R.start,R.end),children:b.jsx(w,{node:t,children:f,pending:i.block.pending,incomplete:!!t.incomplete,source:s.document.getSnapshot().source.slice(R.start,R.end),renderChildren:p,renderValue:N=>b.jsx(cf,{node:t,context:i,tokens:N}),renderAttribute:_})},u)}else switch(t.type){case"text":return b.jsxs(L.Fragment,{children:[i.compact?t.value??"":b.jsx(Mu,{node:t,context:i}),o]},u);case"paragraph":A=M0(t)?b.jsxs("div",{className:"limr-paragraph",children:[f,o]}):b.jsxs("p",{children:[f,o]}),o=void 0;break;case"heading":return b.jsxs(V2,{node:t,runtime:s,blockElement:c,children:[f,o]},u);case"strong":A=b.jsx("strong",{children:f});break;case"emphasis":A=b.jsx("em",{children:f});break;case"delete":A=b.jsx("del",{children:f});break;case"inlineCode":A=b.jsx("code",{className:"limr-inline-code","data-limr-inline-syntax":"","data-source-start":Be(t).start,"data-source-end":Be(t).end,children:b.jsx(cf,{node:t,context:i})});break;case"code":A=b.jsx("pre",{children:b.jsx("code",{children:b.jsx(cf,{node:t,context:i})})});break;case"math":case"inlineMath":A=b.jsx("code",{children:t.value});break;case"blockquote":A=b.jsxs("blockquote",{className:"limr-note",children:[b.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:s.locale.note}),b.jsx("div",{className:"limr-block-content",children:f})]});break;case"list":A=t.ordered?b.jsx("ol",{start:Number(t.start??1),children:f}):b.jsx("ul",{children:f});break;case"listItem":A=b.jsxs("li",{className:typeof t.checked=="boolean"?"limr-task-item":void 0,children:[typeof t.checked=="boolean"&&b.jsx("input",{type:"checkbox",checked:t.checked,disabled:!0,"aria-label":"Task"}),f]});break;case"link":A=b.jsx("a",{href:gn(t.url),title:t.title?String(t.title):void 0,children:f});break;case"image":A=b.jsx("img",{src:gn(t.url,!0),alt:String(t.alt??""),title:t.title?String(t.title):void 0,loading:"lazy",decoding:"async"});break;case"linkReference":A=b.jsx(mx,{node:t,image:!1,children:f});break;case"imageReference":A=b.jsx(mx,{node:t,image:!0,children:f});break;case"thematicBreak":A=b.jsx("hr",{});break;case"break":A=b.jsx("br",{"data-limr-break":"","data-source-start":Be(t).start,"data-source-end":Be(t).end});break;case"table":{const R=t.children??[],_=t.align;A=b.jsx("div",{className:"limr-table-scroll",children:b.jsxs("table",{children:[b.jsx("thead",{children:R.slice(0,1).map((N,j)=>b.jsx("tr",{children:N.children?.map((z,B)=>b.jsx("th",{style:{textAlign:_?.[B]},children:p(z.children??[])},B))},j))}),b.jsx("tbody",{children:R.slice(1).map((N,j)=>b.jsx("tr",{children:N.children?.map((z,B)=>b.jsx("td",{style:{textAlign:_?.[B]},children:p(z.children??[])},B))},j))})]})});break}case"definition":case"footnoteDefinition":case"annotationDefinition":return null;case"footnoteReference":return b.jsxs(L.Fragment,{children:[b.jsx($2,{node:t}),o]},u);case"annotationReference":{const R=t.inline?"span":"div";A=b.jsxs(R,{children:[f,b.jsx(Ru,{occurrence:{id:`${s.document.id}-ref-${Be(t).start}`,range:Be(t),annotationIds:t.annotationIds,embedded:!0}})]});break}case"html":A=b.jsx("span",{className:"limr-literal",children:t.value});break;case"component":A=f;break;default:A=f.length?f:t.value??null}const T=t.selection==="atomic"||["math","inlineMath","image","imageReference","html"].includes(t.type),E=T&&(!t.inline&&!["inlineCode","inlineMath","html"].includes(t.type)||["image","imageReference"].includes(t.type)||t.name==="img")?void 0:i.afterMarks.get(t),C=R=>{const _=E?.length||o?b.jsxs(L.Fragment,{children:[R,E?.map(N=>b.jsx(Ru,{occurrence:N},N.id)),o]},u):R;return i.live&&!t.inline&&(t.type==="component"||["code","math","mermaid","callout","blockquote","table"].includes(t.type))?b.jsx(P2,{state:t.type==="component"?!!t.incomplete:!0,children:_},u):_};if(T)return C(b.jsx(F2,{node:t,context:i,blockElement:c,inline:t.inline||["inlineCode","inlineMath","image","imageReference","html"].includes(t.type),children:A},u));if(c){const R={...tc(c),ref:c.ref};return C(L.isValidElement(A)&&typeof A.type=="string"?L.cloneElement(A,{...R,key:u}):b.jsx("div",{...R,children:A},u))}return C(L.isValidElement(A)?L.cloneElement(A,{key:u}):b.jsx(L.Fragment,{children:A},u))}const N0=L.memo(function({block:i,runtime:a,components:o,extensions:s,rendererOverrides:c,decorations:u,footnoteId:d}){const p=L.useRef(a.document.getSnapshot().streaming);i.pending&&(p.current=!0);const f=L.useRef(i.range.start),y=f.current;Et(()=>{f.current=Math.max(f.current,i.range.end)},[i.range.end]);const g=L.useRef(null),x=L.useCallback(()=>g.current,[]),v=qe(a.configuration,I=>I.typography),w=qe(a.configuration,I=>I.knuthPlass),A=L.useRef(void 0),{occurrences:T}=u,S=L.useMemo(()=>u.highlights.filter(I=>!I.occurrenceId),[u.highlights]),E=L.useMemo(()=>d?{...i.node,type:"listItem"}:i.node,[i,d]),C=L.useMemo(()=>H2(E,a.components,a.rendererOverrides),[E,a,o,s,c]),R=v!=="knuth-plass"&&!!C&&!T.length&&!S.length,_=L.useCallback(I=>{A.current?.(),A.current=void 0,g.current&&a.textBinders.delete(g.current),g.current&&g.current!==I&&a.unobserveBlock(g.current),g.current=I,a.observeBlock(I),I&&R&&C.length&&a.textBinders.set(I,()=>{A.current=q2(I,C,a)})},[a,R,C]),{marks:N,afterMarks:j}=L.useMemo(()=>{const I=new Map,X=new Map;if(!T.length)return{marks:I,afterMarks:X};const oe=[],Y=[],P=new Map,M=new Set(["strong","emphasis","delete","link","linkReference","inlineCode","code","math","inlineMath","image","imageReference","html"]);function V($,Z=[]){$.attributeNodes&&Y.push(...Object.values($.attributeNodes));const me=[...Z,$];$.selection==="atomic"||["text","inlineCode","code","math","inlineMath","image","imageReference","html"].includes($.type)?(oe.push($),P.set($,me)):$.children?.forEach(q=>V(q,me))}V(i.node);for(const $ of T){const Z=[...oe].reverse().find(q=>Be(q).start<$.range.end)??oe[0];if(!(!(Z&&(["image","imageReference"].includes(Z.type)||Z.name==="img")&&Be(Z).end>=$.range.end)&&Y.some(q=>{const ze=Be(q);return $.range.end>ze.start&&$.range.end<=ze.end}))&&Z){const q=P.get(Z)?.find(H=>(M.has(H.type)||H.selection==="atomic")&&Be(H).end<=$.range.end),ze=q?X:I,ge=q??Z;ze.set(ge,[...ze.get(ge)??[],$])}}return{marks:I,afterMarks:X}},[i,T]);if(!d&&["definition","footnoteDefinition","annotationDefinition"].includes(i.node.type))return null;const z={runtime:a,block:i,marks:N,afterMarks:j,highlights:S,occurrences:T,compact:R,live:p.current,revealFrom:y,blockElement:{id:i.id,range:i.range,pending:i.pending,ref:_}},B=d?b.jsx("li",{id:`${a.document.id}-fn-${encodeURIComponent(d)}`,...tc(z.blockElement),ref:_,children:i.node.children?.map((I,X)=>Nu(I,{...z,blockElement:void 0},X))}):Nu(i.node,z);return b.jsx(U2,{element:x,runtime:a,enabled:v==="knuth-plass",pending:i.pending,options:w,children:B})});function Y2(){const t=bt(),i=Dl(d=>d),a=qe(t.configuration,d=>d.components),o=qe(t.configuration,d=>d.extensions),s=qe(t.configuration,d=>d.rendererOverrides),c=qe(t.decorations,d=>d.byBlock),u=L.useMemo(()=>new Map(i.blocks.filter(d=>d.node.type==="footnoteDefinition").map(d=>[String(d.node.identifier),d])),[i.blocks]);return i.footnoteOrder.length?b.jsxs("section",{className:"limr-footnotes","aria-label":t.locale.footnotes,children:[b.jsx("hr",{}),b.jsx("ol",{children:i.footnoteOrder.map(d=>{const p=i.footnotes.get(d);if(!p)return null;const f=u.get(d)??{id:`${i.id}-fn-${d}`,range:Be(p),node:p,pending:!1};return b.jsx(N0,{block:f,runtime:t,components:a,extensions:o,rendererOverrides:s,footnoteId:d,decorations:c.get(f.id)??Tm},d)})})]}):null}const px=new WeakMap;function Du(t){let i=px.get(t);return i||(i=t.createRange(),px.set(t,i)),i}function gx(t,i){const a=t.closest("pre,p,figcaption,li,th,td,h1,h2,h3,h4,h5,h6,.limr-choice-text,.limr-definition-title,.limr-question-title,.limr-block-content");return a&&i.contains(a)?a:t.closest("[data-limr-block]")??i}function Jf(t,i){const a=[];return zm(t,i,o=>(a.push(o),!1)),a}function zm(t,i,a,o,s){i.prepareTextBindings(t);const c=d=>(!o||_t(d.range,o))&&a(d),u=(d,p)=>{if(d instanceof HTMLElement){if(d!==t&&d.hasAttribute("data-limr-document")||d.hasAttribute("inert"))return!1;const f=d.dataset.limrMarker,y=d.dataset.limrAtomic;if(f||y){const x=d.dataset.limrMedia==="image";return c({node:d,kind:f?"marker":x?"image":y==="block"?"block":"inline",range:{start:Number(d.dataset.sourceStart),end:Number(d.dataset.sourceEnd)},flow:x?d:gx(d,i.content),offset:0})}if(d.hasAttribute("data-limr-ignore"))return!1;s&&d.hasAttribute("data-limr-break")&&s({start:Number(d.dataset.sourceStart),end:Number(d.dataset.sourceEnd)});const g=i.bindings.get(d);if(o&&g&&!_t(g.range,o))return!1;g&&(p={binding:g,offset:0})}if(d.nodeType===Node.TEXT_NODE){const f=i.bindings.get(d)??p?.binding,y=i.bindings.has(d)?0:p?.offset??0,g=d.textContent?.length??0;return p&&(p.offset+=g),f?.resolve&&g?c({node:d,kind:"text",range:{start:f.resolve(y,"start"),end:f.resolve(y+g,"end")},flow:gx(d.parentElement,i.content),binding:f,offset:y}):!1}for(const f of d.childNodes)if(u(f,p))return!0;return!1};return u(t)}function nc(t,i,a){const o=t.node,s=o.length,c=t.binding.resolve;let u=0,d=s;for(;u<d;){const g=u+d>>>1;c(t.offset+g+1,"end")<=i.start?u=g+1:d=g}let p=u;for(u=p,d=s;u<d;){const g=u+d>>>1;c(t.offset+g,"start")<i.end?u=g+1:d=g}if(p===u)return null;let f=u;const y=Du(o.ownerDocument);if(a&&f-p>1024&&(y.setStart(o,p),y.setEnd(o,f),y.getBoundingClientRect().height>a.bottom-a.top+80)){for(u=p,d=f;u<d;){const x=u+d>>>1;y.setStart(o,x),y.setEnd(o,x+1),y.getBoundingClientRect().bottom<a.top?u=x+1:d=x}for(p=u,d=f;u<d;){const x=u+d>>>1;y.setStart(o,x),y.setEnd(o,x+1),y.getBoundingClientRect().top<=a.bottom?u=x+1:d=x}f=u}return p===f?null:(y.setStart(o,p),y.setEnd(o,f),y)}function Xf(t,i){const a=t.document.getSnapshot(),o=d=>i.some(p=>_t(p,d)),s=a.blocks.filter(d=>o(d.range)).map(d=>t.blocks.get(d.id)).filter(d=>!!d);if(!s.some(d=>[d,...d.querySelectorAll("[data-limr-atomic]")].some(p=>p.hasAttribute("data-limr-atomic")&&o({start:Number(p.dataset.sourceStart),end:Number(p.dataset.sourceEnd)}))))return;const u=[];for(const d of s){const p=[];let f;zm(d,t,y=>{if(y.kind==="marker"||!o(y.range))return!1;const g=y.kind!=="text"?a.source.slice(y.range.start,y.range.end):i.filter(x=>_t(x,y.range)).map(x=>nc(y,x)?.toString()??"").join("");return g&&(f&&f!==y.flow&&p.push(f.matches("th,td")&&y.flow.matches("th,td")&&f.parentElement===y.flow.parentElement?"	":`
`),p.push(g),f=y.flow),!1},void 0,y=>{o(y)&&p.push(`
`)}),p.length&&u.push(p.join(""))}return u.join(`

`)}function J2(t,i){for(const a of t.document.getSnapshot().blocks){if(!_t(a.range,i))continue;const o=t.blocks.get(a.id);if(!o)continue;let s=null;if(zm(o,t,c=>{if(c.kind==="marker")return!1;if(c.kind==="text"){const u=nc(c,i);if(!u)return!1;const d=c.node,p=u.endOffset;for(let f=u.startOffset;f<p;){const y=Math.min(p,f+(d.data.codePointAt(f)>65535?2:1));u.setStart(d,f),u.setEnd(d,y);const g=u.getBoundingClientRect();if(g.width&&g.height)return s=g,!0;f=y}}else{const u=c.node,d=(u.querySelector(c.kind==="image"?"img":"[data-limr-selection-surface]")??u).getBoundingClientRect();if(d.width&&d.height)return s=d,!0}return!1},i),s)return s}return null}function X2(t,i,a){if(![...t.content.querySelectorAll('[data-limr-selection-order="visual"]')].some(g=>i.intersectsNode(g)))return;const o=[...t.blocks.values()].filter(g=>i.intersectsNode(g));o.sort((g,x)=>g.compareDocumentPosition(x)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);const s=o.flatMap(g=>Jf(g,t)).filter(g=>g.kind!=="marker"),c=[];for(const g of s){if(!i.intersectsNode(g.node))continue;if(g.kind!=="text"){c.push(g.range);continue}const x=g.node,v=i.startContainer===x?i.startOffset:0,w=i.endContainer===x?i.endOffset:x.length;v<w&&c.push({start:g.binding.resolve(g.offset+v,"start"),end:g.binding.resolve(g.offset+w,"end")})}if(!c.length)return;const u=s.map(g=>g.range).sort((g,x)=>g.end-x.end),d=[];for(const g of c){const x=d.at(-1);let v=0,w=u.length;if(x)for(;v<w;){const A=v+w>>>1;u[A].end<=x.end?v=A+1:w=A}x&&g.start>=x.end&&(!u[v]||u[v].start>=g.start)?x.end=g.end:d.push({...g})}const p=t.document.getSnapshot(),f=d.map(g=>Wu(p,g,a)),y=g=>{const x=new Set,v=f.flatMap(w=>w[g].ranges).filter(w=>{const A=`${w.start}:${w.end}`;return x.has(A)?!1:(x.add(A),!0)});return{ranges:v,sourceText:v.map(w=>p.source.slice(w.start,w.end)).join(`

`)}};return{...f[0],raw:y("raw"),syntax:y("syntax"),blocks:y("blocks")}}function Z2(t,i){L.useEffect(()=>{const a=t.content;if(!a||!i)return;let o=0,s=!1,c;function u(w,A,T){let S=w.nodeType===Node.ELEMENT_NODE?w:w.parentElement;if(!S||S.closest("[data-limr-document]")!==a||S.closest("[data-limr-ignore]"))return null;let E=S.closest("[data-limr-atomic]");for(let z=E?.parentElement?.closest("[data-limr-atomic]");z&&a?.contains(z);z=E.parentElement?.closest("[data-limr-atomic]"))E=z;const C=E&&t.bindings.get(E);if(C?.atomic)return{offset:T==="start"?C.range.start:C.range.end,atomic:!0,exact:!0};t.prepareTextBindings(S);const R=w.nodeType===Node.TEXT_NODE?t.bindings.get(w):void 0;if(R?.resolve)return{offset:R.resolve(A,T),atomic:!1,exact:R.exact!==!1};for(;S&&S!==a;){const z=t.bindings.get(S);if(z){if(z.atomic)return{offset:T==="start"?z.range.start:z.range.end,atomic:!0,exact:!0};const B=Du(S.ownerDocument);B.setStart(S,0);try{B.setEnd(w,A)}catch{return null}const I=B.toString().length;return{offset:z.resolve?.(I,T)??(T==="start"?z.range.start:z.range.end),atomic:!1,exact:z.exact!==!1}}S=S.parentElement}const _=w.nodeType===Node.ELEMENT_NODE?Array.from(w.childNodes):[],N=T==="start"?_.slice(A):_.slice(0,A).reverse(),j=z=>{if(z.nodeType===Node.TEXT_NODE&&z.textContent)return u(z,T==="start"?0:z.textContent.length,T);if(z instanceof Element){if(z.hasAttribute("data-limr-ignore")||z.hasAttribute("inert"))return null;const I=t.bindings.get(z);if(I?.atomic)return{offset:T==="start"?I.range.start:I.range.end,atomic:!0,exact:!0}}const B=Array.from(z.childNodes);T==="end"&&B.reverse();for(const I of B){const X=j(I);if(X)return X}return null};for(const z of N){const B=j(z);if(B)return B}return null}function d(){if(o=0,!s&&document.activeElement instanceof Element&&document.activeElement.closest("[data-limr-selection-ui]"))return;const w=window.getSelection();if(!w||w.isCollapsed||!w.rangeCount){(!(document.activeElement instanceof Element)||!document.activeElement.closest("[data-limr-selection-ui]"))&&(c=void 0,t.selectionRange=null,t.updateInteraction({selection:null}));return}const A=w.getRangeAt(0),T=t.document.getSnapshot().revision;if(t.interaction.get().selection&&c?.startNode===A.startContainer&&c.start===A.startOffset&&c.endNode===A.endContainer&&c.end===A.endOffset&&c.revision===T&&c.settled===!s)return;const S=u(A.startContainer,A.startOffset,"start"),E=u(A.endContainer,A.endOffset,"end");if(!S||!E){c=void 0,t.selectionRange=null,t.updateInteraction({selection:null});return}c={startNode:A.startContainer,start:A.startOffset,endNode:A.endContainer,end:A.endOffset,revision:T,settled:!s},t.selectionRange=A.cloneRange(),t.highlightReference=null;const R={text:w.toString()||(S.atomic&&E.atomic?t.document.getSnapshot().source.slice(S.offset,E.offset):""),settled:!s,quality:!S.exact||!E.exact?"unmapped":S.atomic||E.atomic?"atomic":"exact"};let _=X2(t,A,R)??Wu(t.document.getSnapshot(),{start:S.offset,end:E.offset},R);if(!s){const N=Xf(t,_.raw.ranges);N!==void 0&&(_={..._,text:N,quality:"atomic"})}t.updateInteraction({activeHighlight:null,selection:_})}const p=()=>{o||(o=requestAnimationFrame(d))},f=()=>{s=!0},y=()=>{s=!1,p()},g=w=>{const A=window.getSelection(),T=t.interaction.get().selection;return w.defaultPrevented||!A?.anchorNode||A.isCollapsed||!a.contains(A.anchorNode)||T?.quality!=="atomic"||w.target instanceof Element&&w.target.closest("input,textarea,[contenteditable],[data-limr-selection-ui]")?null:T.settled?T.text:Xf(t,T.raw.ranges)??T.text},x=w=>{const A=g(w);!A||!w.clipboardData||(w.clipboardData.setData("text/plain",A),w.preventDefault())},v=w=>{if(w.key.toLowerCase()!=="c"||!(w.ctrlKey||w.metaKey)||w.altKey||!navigator.clipboard?.writeText||window.getSelection()?.toString())return;const A=g(w);A&&(w.preventDefault(),navigator.clipboard.writeText(A).catch(()=>{}))};return document.addEventListener("selectionchange",p),a.addEventListener("pointerdown",f),document.addEventListener("pointerup",y),document.addEventListener("pointercancel",y),document.addEventListener("keyup",p),document.addEventListener("copy",x),document.addEventListener("keydown",v),window.getSelection()?.isCollapsed===!1&&p(),()=>{cancelAnimationFrame(o),document.removeEventListener("selectionchange",p),a.removeEventListener("pointerdown",f),document.removeEventListener("pointerup",y),document.removeEventListener("pointercancel",y),document.removeEventListener("keyup",p),document.removeEventListener("copy",x),document.removeEventListener("keydown",v)}},[t,i])}function yx(t,i,a,o){const s=[],c=(T,S,E)=>{const C=o(T.flow),R=o(E?.element??(T.kind==="text"?T.node.parentElement:T.flow)),_=E?E.rect.top+R.ascent:T.kind==="text"?S.top+R.ascent:S.bottom-C.descent;return{left:S.left,top:_-C.ascent,width:S.width,height:C.height,baseline:_,flow:T.flow}},u=(T,S)=>{for(let E=T+S;E>=0&&E<t.length;E+=S){const C=t[E];if(C.flow!==t[T].flow)return;if(C.kind==="text"){const R=C.node.textContent??"";if(R.trim())return C;if(!R.includes(`
`))continue}if(C.kind!=="marker")return}},d=(T,S)=>{const E=T.node,C=Du(E.ownerDocument),R=S==="first"?0:Math.max(0,E.length-1);return C.setStart(E,R),C.setEnd(E,Math.min(E.length,R+1)),C.getBoundingClientRect()},p=(T,S)=>{const E=u(T,-1),C=u(T,1),R=[E&&{rect:d(E,"last"),element:E.node.parentElement},C&&{rect:d(C,"first"),element:C.node.parentElement}].filter(N=>!!N);R.sort((N,j)=>Math.abs(N.rect.bottom-S.bottom)-Math.abs(j.rect.bottom-S.bottom));const _=R[0];return _&&Math.abs(_.rect.bottom-S.bottom)<Math.max(S.height,_.rect.height)?_:void 0};let f=0,y=t.length;if(t.length>80&&t[0].flow.tagName==="PRE"&&t.at(-1)?.flow===t[0].flow){const T=C=>{const R=t[C];if(R.kind!=="text")return R.node.getBoundingClientRect();const _=Du(R.node.ownerDocument);return _.selectNodeContents(R.node),_.getBoundingClientRect()};let S=0,E=t.length;for(;S<E;){const C=S+E>>>1;T(C).bottom<a.top?S=C+1:E=C}for(f=S,E=t.length;S<E;){const C=S+E>>>1;T(C).top<=a.bottom?S=C+1:E=C}y=S}for(let T=f;T<y;T++){const S=t[T];if(S.kind==="marker"){const E=u(T,-1),C=u(T,1);if(!E||!C||i.start>=E.range.end||i.end<=C.range.start)continue;const R=S.node.getBoundingClientRect();if(!R.width||!R.height||R.bottom<a.top||R.top>a.bottom)continue;const _=c(S,R,p(T,R));s.push({..._,marker:S.node.dataset.limrMarker})}else if(_t(S.range,i))if(S.kind==="text"){const E=S.node.parentElement?.closest(".limr-kp-glue");if(E){const j=E.getBoundingClientRect(),z=p(T,j);j.width&&z&&j.bottom>=a.top&&j.top<=a.bottom&&s.push(c(S,j,z));continue}const C=nc(S,i,a),R=S.node.parentElement?.closest("[data-limr-inline-syntax]"),_=R?Array.from(R.getClientRects()):[],N=R&&getComputedStyle(R);for(const j of C?.getClientRects()??[])if(j.width&&j.height&&j.bottom>=a.top&&j.top<=a.bottom){const z=c(S,j),B=_[0],I=_.at(-1);R&&N&&B&&i.start<=Number(R.dataset.sourceStart)&&Math.abs(B.top-j.top)<j.height&&Math.abs(j.left-B.left-parseFloat(N.paddingLeft))<1&&(z.width+=z.left-B.left,z.left=B.left),R&&N&&I&&i.end>=Number(R.dataset.sourceEnd)&&Math.abs(I.top-j.top)<j.height&&Math.abs(I.right-parseFloat(N.paddingRight)-j.right)<1&&(z.width=I.right-z.left),s.push(z)}}else{const E=S.node,C=S.kind==="image"?E.querySelector("img")??E:S.kind==="block"?E.querySelector("[data-limr-selection-surface]")??E:E,R=C.getBoundingClientRect();if(!R.width||!R.height||R.bottom<a.top||R.top>a.bottom)continue;if(S.kind==="block"||S.kind==="image")s.push({left:R.left,top:R.top,width:R.width,height:R.height,atomic:!0,image:S.kind==="image",baseline:R.bottom,flow:S.kind==="image"?E:C,radius:getComputedStyle(C).borderRadius});else{const _=c(S,R,p(T,R));s.push({..._,atomic:!0})}}}const g=new Map,x=s.map(T=>{if(T.image||T.atomic&&T.height>o(T.flow).height*1.5)return T;let S=g.get(T.flow);S||(S=new Map,g.set(T.flow,S));const E=Math.floor(T.baseline/3);let C=[S.get(E),S.get(E-1),S.get(E+1)].find(R=>R&&Math.abs(R.baseline-T.baseline)<3);return C||(C=T,S.set(E,C)),{...T,top:C.top,height:C.height}}),v=[];for(let T=1;T<x.length;T++){const S=x[T-1],E=x[T],C=E.left-S.left-S.width;S.flow===E.flow&&Math.abs(S.top-E.top)<.5&&C>.1&&C<S.height*.6&&v.push({left:S.left+S.width,top:S.top,width:C,height:S.height,flow:S.flow})}const w=[],A=new Map;for(const T of[...x,...v]){if(!T.flow.hasAttribute("data-limr-kp")||T.atomic||T.marker){w.push(T);continue}let S=A.get(T.flow);S||(S=new Map,A.set(T.flow,S));const E=S.get(T.top)??[];E.push(T),S.set(T.top,E)}for(const T of A.values())for(const S of T.values()){S.sort((C,R)=>C.left-R.left);let E;for(const C of S)E&&C.left<=E.left+E.width+.1&&Math.abs(C.height-E.height)<.1?E.width=Math.max(E.width,C.left+C.width-E.left):(E={...C},w.push(E))}return w}function K2({runtime:t,interactive:i=!0}){const a=L.useRef(null);return L.useEffect(()=>{const o=t.content,s=a.current;if(!o||!s)return;let c=0,u=!1,d=new WeakMap,p=new WeakMap,f=new WeakMap;const y=new Map;let g,x=t.document.getSnapshot(),v=t.interaction.get().selection,w=t.decorations.get().byBlock,A=t.interaction.get().hoveredHighlight,T=t.interaction.get().activeHighlight,S=t.interaction.get().active,E=t.interaction.get().hovered;const C=new Map;let R=[];const _=le=>[...C.values()].flatMap(be=>Array.from(be.children).filter(xe=>xe.dataset.paint===le).map(xe=>xe.getBoundingClientRect())),N=()=>{const le=t.interaction.get(),be=t.decorations.get();return be.referenceRanges.get(le.hovered??"")??(le.activeHighlight?be.highlights.get(le.activeHighlight)?.range:void 0)??be.referenceRanges.get(le.active??"")},j=le=>{const be=t.interaction.get(),xe=t.decorations.get();if(le===be.hovered)return!0;if(le!==be.active)return!1;const de=xe.highlights.get(`reference-${be.hovered}`);return!de?.occurrenceId||!Wn(de.range,xe.referenceRanges.get(le))},z=()=>{const le=t.interaction.get(),be=t.decorations.get(),xe=N();for(const de of C.values())for(const ae of de.children){ae.toggleAttribute("data-hovered",ae.dataset.paint===le.hoveredHighlight);const ye=be.highlights.get(ae.dataset.paint??"");if(ye?.occurrenceId){const Ae=j(ye.occurrenceId);ae.toggleAttribute("data-active",Ae),ae.toggleAttribute("data-muted",!Ae);continue}ae.toggleAttribute("data-active",ae.dataset.paint===le.activeHighlight||!!xe&&!!ye&&Wn(xe,ye.range)),ae.toggleAttribute("data-muted",!!ye?.hidden||!!xe&&!!ye&&!Wn(xe,ye.range))}},B=(le,be)=>{be.remove(),delete le.dataset.limrHighlightHost,delete le.dataset.limrHighlightPosition,C.delete(le)},I=document.createElement("canvas"),X=I.getContext("2d"),oe=le=>{const be=f.get(le);if(be)return be;const xe=getComputedStyle(le),de=parseFloat(xe.fontSize),ae=parseFloat(xe.lineHeight)||de*1.5,ye=`${xe.fontStyle} ${xe.fontWeight} ${de}px ${xe.fontFamily}`,Ae=`${ye}/${ae}`;let Ne=y.get(Ae);if(!Ne){X&&(X.font=ye);const De=X?.measureText("Mg"),Me=De?.fontBoundingBoxAscent??de*.9,ce=De?.fontBoundingBoxDescent??de*.25,je=Math.min(Me+ce,ae-.5);Ne={ascent:Me-Math.max(0,Me+ce-je)/2,descent:ce,height:je},y.set(Ae,Ne)}return f.set(le,Ne),Ne},Y=()=>{s.childNodes.length&&s.replaceChildren();for(const[le,be]of C)B(le,be);R=[]},P=()=>{cancelAnimationFrame(c),c=0;const le=t.interaction.get().selection?.raw.ranges??[],be=t.decorations.get().byBlock;if(!le.length&&![...be.values()].some(Se=>Se.highlights.length)){Y();return}const xe=t.document.getSnapshot();if(xe!==x&&(x=xe,g=void 0),!g){const Se=new Map(xe.blocks.filter(D=>D.node.type==="footnoteDefinition").map(D=>[String(D.node.identifier),D]));g=[...xe.blocks.filter(D=>D.node.type!=="footnoteDefinition"),...xe.footnoteOrder.flatMap(D=>{const we=Se.get(D),Te=xe.footnotes.get(D);return we?[we]:Te?[{id:`${xe.id}-fn-${D}`,range:{start:Te.position.start.offset,end:Te.position.end.offset}}]:[]})].flatMap(D=>{const we=t.blocks.get(D.id);return we?[{element:we,range:D.range,id:D.id}]:[]})}const de=window.visualViewport,ae={top:de?.offsetTop??0,bottom:(de?.offsetTop??0)+(de?.height??window.innerHeight),left:de?.offsetLeft??0,right:(de?.offsetLeft??0)+(de?.width??window.innerWidth)},ye=t.configuration.get().scrollRoot;if(ye){const Se=ye.getBoundingClientRect();ae.top=Math.max(ae.top,Se.top+ye.clientTop),ae.bottom=Math.min(ae.bottom,Se.top+ye.clientTop+ye.clientHeight),ae.left=Math.max(ae.left,Se.left+ye.clientLeft),ae.right=Math.min(ae.right,Se.left+ye.clientLeft+ye.clientWidth)}let Ae=0,Ne=g.length;for(;Ae<Ne;){const Se=Ae+Ne>>>1;g[Se].element.getBoundingClientRect().bottom<ae.top-32?Ae=Se+1:Ne=Se}const De=o.getBoundingClientRect();ae.top=Math.max(ae.top,De.top),ae.bottom=Math.min(ae.bottom,De.bottom);const Me=o.scrollLeft,ce=o.scrollTop,je=[],$e=new Map,Ge=Se=>{const G=$e.get(Se);if(G)return G;const D={...ae};for(let we=Se;we&&we!==o;we=we.parentElement){const Te=getComputedStyle(we),Ie=we.getBoundingClientRect();/hidden|clip|auto|scroll/.test(Te.overflowX)&&(D.left=Math.max(D.left,Ie.left+we.clientLeft),D.right=Math.min(D.right,Ie.left+we.clientLeft+we.clientWidth)),/hidden|clip|auto|scroll/.test(Te.overflowY)&&(D.top=Math.max(D.top,Ie.top+we.clientTop),D.bottom=Math.min(D.bottom,Ie.top+we.clientTop+we.clientHeight))}return $e.set(Se,D),D};for(let Se=Ae;Se<g.length;Se++){const G=g[Se],D=G.element.getBoundingClientRect();if(D.top>ae.bottom+32)break;const we=[...be.get(G.id)?.highlights??[]];for(const Oe of le)_t(Oe,G.range)&&we.push({id:"selection",range:Oe,selection:!0});if(!we.length)continue;let Te=d.get(G.element),Ie=p.get(G.element);(Ie?.width!==D.width||Ie.height!==D.height)&&(Ie=void 0),!Ie&&D.height<(ae.bottom-ae.top)*3&&(Ie={width:D.width,height:D.height,tasks:new Map},p.set(G.element,Ie));for(const Oe of we){const et=Ie?.tasks.get(Oe.id);if(Oe.occurrenceId&&!j(Oe.occurrenceId)&&!et)continue;Te||(Te=Jf(G.element,t),d.set(G.element,Te));let Ye=et&&Wn(et.source,Oe.range)?et.rects:void 0;!Ye&&Ie&&(Ye=yx(Te,Oe.range,{top:-1/0,bottom:1/0},oe).map(Qe=>({...Qe,left:Qe.left-D.left,top:Qe.top-D.top})),Ie.tasks.set(Oe.id,{source:Oe.range,rects:Ye}));const ht=Ye?Ye.map(Qe=>({...Qe,left:Qe.left+D.left,top:Qe.top+D.top})):yx(Te,Oe.range,{top:ae.top-32,bottom:ae.bottom+32},oe);for(const Qe of ht){const kt=Ge(Qe.flow),Je=Math.max(Qe.left,kt.left),ct=Math.max(Qe.top,kt.top),Bt=Math.min(Qe.left+Qe.width,kt.right)-Je,jn=Math.min(Qe.top+Qe.height,kt.bottom)-ct;Bt<=0||jn<=0||je.push({rect:{...Qe,left:Je-De.left+Me,top:ct-ae.top,width:Bt,height:jn},task:Oe})}}}const W=new Map;for(const{rect:Se,task:G}of je)if(!G.selection&&!W.has(Se.flow)){const D=Se.flow,we=D.getBoundingClientRect(),Te=D.scrollLeft-D.clientLeft,Ie=D.scrollTop-D.clientTop;W.set(D,{box:we,x:Te,y:Ie,top:Math.max(ae.top,we.top)-we.top+Ie,positioned:getComputedStyle(D).position!=="static"})}s.style.top=`${ae.top-De.top+ce}px`,s.style.height=`${Math.max(0,ae.bottom-ae.top)}px`;const re=new Map,ue=[];je.forEach(({rect:Se,task:G})=>{let D=s,we=Se.left,Te=Se.top;if(!G.selection){const ht=Se.flow,Qe=W.get(ht);let kt=C.get(ht);kt||(kt=document.createElement("span"),kt.className="limr-highlight-layer",kt.dataset.limrIgnore="true",kt.setAttribute("aria-hidden","true"),ht.dataset.limrHighlightHost="true",Qe.positioned||(ht.dataset.limrHighlightPosition="true"),ht.append(kt),C.set(ht,kt)),kt.style.top=`${Qe.top}px`,kt.style.height=`${Math.max(0,Math.min(ae.bottom,Qe.box.bottom)-Math.max(ae.top,Qe.box.top))}px`,D=kt,we+=De.left-Qe.box.left+Qe.x,Te+=ae.top-Qe.box.top+Qe.y-Qe.top,ue.push({id:G.id,rect:{left:Se.left+De.left-Me,top:Se.top+ae.top,width:Se.width,height:Se.height}})}const Ie=re.get(D)??0;re.set(D,Ie+1);const Oe=D.children[Ie]??document.createElement("span"),et=`limr-paint-rect limr-paint-${G.selection?"selection":G.style??"background"}`;Oe.className!==et&&(Oe.className=et),Oe.dataset.paint=G.id,Oe.toggleAttribute("data-reference",!!G.occurrenceId),Se.marker?Oe.dataset.marker=Se.marker:delete Oe.dataset.marker,Se.atomic?Oe.dataset.atomic="true":delete Oe.dataset.atomic,Se.image?Oe.dataset.media="image":delete Oe.dataset.media;const Ye=`left:${we}px;top:${Te}px;width:${Se.width}px;height:${Se.height}px;border-radius:${Se.radius??"0"};`;if(Oe.dataset.geometry!==Ye&&(Oe.style.cssText=Ye,Oe.dataset.geometry=Ye),G.selection||Oe.style.setProperty("--limr-highlight",G.color??"#F2C744"),G.occurrenceId){const ht=j(G.occurrenceId);Oe.toggleAttribute("data-active",ht),Oe.toggleAttribute("data-muted",!ht)}Oe.parentNode||D.append(Oe)});for(const[Se,G]of C)re.has(G)||B(Se,G);for(const Se of[s,...C.values()]){const G=re.get(Se)??0;Se.children.length>G&&Se.replaceChildren(...Array.from(Se.children).slice(0,G))}R=ue;const Re=t.interaction.get().activeHighlight;Re&&!R.some(Se=>Se.id===Re)&&t.clearSelection(),z(),u&&(u=o.getAnimations().some(Se=>Se instanceof CSSTransition&&Se.transitionProperty==="translate"&&Se.playState==="running"),u&&M())},M=()=>{c||(c=requestAnimationFrame(P))},V=le=>{le.target!==o||le.propertyName!=="translate"||(u=!0,M())};o.addEventListener("transitionrun",V),o.addEventListener("transitionend",V),o.addEventListener("transitioncancel",V);const $=()=>{g=void 0,f=new WeakMap,M()},Z=()=>{y.clear(),p=new WeakMap,$()},me=[t.interaction.subscribe(()=>{const le=t.interaction.get(),be=le.selection,xe=le.active!==S||le.hovered!==E;(le.hoveredHighlight!==A||le.activeHighlight!==T||le.active!==S||le.hovered!==E)&&(A=le.hoveredHighlight,T=le.activeHighlight,S=le.active,E=le.hovered,z()),xe&&M(),be!==v&&(v=be,P())}),t.decorations.subscribe(()=>{const le=t.decorations.get().byBlock;le!==w&&(w=le,d=new WeakMap,p=new WeakMap,M())}),t.layout.subscribe($),t.documentOffset.subscribe(M),t.configuration.subscribe(()=>{p=new WeakMap,$()})],q=new MutationObserver(le=>{let be=!1;for(const xe of le){const de=xe.target instanceof Element?xe.target:xe.target.parentElement;if(!de||de===s||s.contains(de)||de.closest(".limr-highlight-layer")||xe.type==="childList"&&[...xe.addedNodes,...xe.removedNodes].every(ye=>ye instanceof Element&&ye.classList.contains("limr-highlight-layer")))continue;const ae=de.closest("[data-limr-block]");ae?(d.delete(ae),p.delete(ae)):(g=void 0,p=new WeakMap),be=!0}be&&(f=new WeakMap,M())});q.observe(o,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["class","style","inert","open","data-limr-theme","data-limr-justify"]});const ze=le=>{const be=le.target;if(be instanceof Element){const xe=be.closest("[data-limr-block]");xe&&p.delete(xe)}t.hoverHighlight(null),M()};document.addEventListener("scroll",ze,{capture:!0,passive:!0}),window.visualViewport?.addEventListener("resize",M),window.visualViewport?.addEventListener("scroll",M),document.fonts?.addEventListener("loadingdone",Z);const ge=le=>{const be=le.target instanceof Element?le.target:null;if(!be||be.closest("[data-limr-document]")!==o||be.closest("button,input,textarea,select,[contenteditable],[data-limr-ignore]"))return null;const xe=N(),de=t.decorations.get();for(let ae=R.length-1;ae>=0;ae--){const{rect:ye,id:Ae}=R[ae],Ne=de.highlights.get(Ae);if(!(Ne?.occurrenceId||Ne?.hidden||xe&&Ne&&!Wn(xe,Ne.range))&&le.clientX>=ye.left&&le.clientX<=ye.left+ye.width&&le.clientY>=ye.top&&le.clientY<=ye.top+ye.height)return Ae}return null},H=le=>{le.buttons||t.hoverHighlight(ge(le))},U=()=>t.hoverHighlight(null);let te=null;const he=le=>{te={x:le.clientX,y:le.clientY}},ve=le=>{if(le.defaultPrevented||le.button!==0||le.metaKey||le.ctrlKey||le.shiftKey||le.altKey||!te||Math.hypot(le.clientX-te.x,le.clientY-te.y)>4||window.getSelection()?.isCollapsed===!1)return;const be=ge(le);if(!be)return;le.preventDefault();const xe=t.decorations.get().highlights.get(be),de=[];let ae=!1;for(const ye of t.document.getSnapshot().blocks){if(!_t(ye.range,xe.range))continue;const Ae=t.blocks.get(ye.id);if(!Ae)continue;const Ne=[];for(const De of Jf(Ae,t)){if(!_t(De.range,xe.range)||De.kind==="marker")continue;if(De.kind!=="text"){ae=!0;continue}const Me=nc(De,xe.range,{top:-1/0,bottom:1/0});Me&&Ne.push(Me.toString())}Ne.length&&de.push(Ne.join(""))}t.highlightReference={text:!ae&&de.length?de.join(`

`):void 0,getClientRects:()=>_(be),getBoundingClientRect:()=>{const ye=_(be);if(!ye.length)return new DOMRect;const Ae=Math.min(...ye.map(De=>De.left)),Ne=Math.min(...ye.map(De=>De.top));return new DOMRect(Ae,Ne,Math.max(...ye.map(De=>De.right))-Ae,Math.max(...ye.map(De=>De.bottom))-Ne)}},t.activateHighlight(be)};return i&&(o.addEventListener("pointermove",H),o.addEventListener("pointerleave",U),o.addEventListener("pointerdown",he),o.addEventListener("click",ve)),o.dataset.limrPainted="true",M(),()=>{cancelAnimationFrame(c),q.disconnect(),me.forEach(le=>le()),document.removeEventListener("scroll",ze,!0),window.visualViewport?.removeEventListener("resize",M),window.visualViewport?.removeEventListener("scroll",M),document.fonts?.removeEventListener("loadingdone",Z),o.removeEventListener("transitionrun",V),o.removeEventListener("transitionend",V),o.removeEventListener("transitioncancel",V),o.removeEventListener("pointermove",H),o.removeEventListener("pointerleave",U),o.removeEventListener("pointerdown",he),o.removeEventListener("click",ve),delete o.dataset.limrPainted,Y()}},[t,i]),b.jsx("div",{ref:a,className:"limr-paint-layer","data-limr-ignore":"true","aria-hidden":"true"})}function ni({className:t,style:i,interactive:a=!0,followOutput:o=!1,justify:s,...c}){const u=L.useContext(Hm);return c.source!==void 0||!u?b.jsx(Nl,{...c,justify:s,children:b.jsx(bx,{className:t,style:i,interactive:a,followOutput:o})}):b.jsx(bx,{className:t,style:i,interactive:a,followOutput:o,justify:s})}function bx({className:t,style:i,interactive:a,followOutput:o,justify:s}){const c=bt(),u=I0(),d=po(),p=qe(c.configuration,R=>R.theme??"light"),f=qe(c.configuration,R=>R.justify??!1),y=qe(c.configuration,R=>R.typography??"standard"),g=s??(y==="justify"||f),x=qe(c.configuration,R=>R.scrollRoot),v=qe(c.documentOffset,R=>R),w=qe(c.configuration,R=>R.components),A=qe(c.configuration,R=>R.extensions),T=qe(c.configuration,R=>R.rendererOverrides),S=qe(c.decorations,R=>R.byBlock),E=L.useRef(null),C=L.useRef(!0);return Et(()=>E.current?c.mountContent(E.current):void 0,[c,x]),Et(()=>c.requestLayout(),[c,s,f,y]),Z2(c,a),L.useEffect(()=>{if(!o)return;const R=x??window,_=()=>{const N=x??window.document.documentElement,j=x?.clientHeight??window.innerHeight;C.current=N.scrollHeight-c.getScrollTop()-j<48};return R.addEventListener("scroll",_,{passive:!0}),()=>R.removeEventListener("scroll",_)},[c,o,x]),Et(()=>{if(!o||!u.streaming||!C.current)return;const R=requestAnimationFrame(()=>c.scrollTo(x?.scrollHeight??window.document.documentElement.scrollHeight,"instant"));return()=>cancelAnimationFrame(R)},[u,c,o,x]),b.jsxs("article",{ref:E,className:`limr-prose ${t??""}`,style:{...i,translate:v?`0 ${v}px`:i?.translate},"data-limr-theme":p,"data-limr-appearance":d,"data-limr-document":u.id,"data-limr-justify":g,"data-limr-typography":y,children:[u.blocks.map(R=>b.jsx(N0,{block:R,runtime:c,components:w,extensions:A,rendererOverrides:T,decorations:S.get(R.id)??Tm},R.id)),b.jsx(Y2,{}),b.jsx(K2,{runtime:c,interactive:a})]})}function D0({children:t,active:i,resetKey:a,label:o}){const s=L.useRef(null),c=L.useRef(null),u=L.useRef(null),d=L.useRef(null),p=L.useRef(null),f=L.useRef(()=>{});Et(()=>{const v=s.current,w=v.parentElement;if(delete w.dataset.scrolling,!i)return;v.scrollTop=0;let A=0,T,S=0;const E=()=>{A=0;const N=d.current.clientHeight,j=v.scrollHeight-v.clientHeight,z=Math.min(N,Math.max(20,N*v.clientHeight/Math.max(1,v.scrollHeight)));w.toggleAttribute("data-overflow",j>1),u.current.style.height=`${z}px`,u.current.style.transform=`translateY(${j>0?Math.max(0,Math.min(1,v.scrollTop/j))*(N-z):0}px)`},C=()=>{A||(A=requestAnimationFrame(E))};f.current=()=>{clearTimeout(T),!w.closest("[data-motion]")&&(w.dataset.scrolling="true",T=setTimeout(()=>{p.current||delete w.dataset.scrolling},800))};const R=()=>{C(),v.scrollTop!==S&&(S=v.scrollTop,f.current())},_=new ResizeObserver(C);return _.observe(v),_.observe(c.current),v.addEventListener("scroll",R,{passive:!0}),E(),()=>{_.disconnect(),v.removeEventListener("scroll",R),cancelAnimationFrame(A),clearTimeout(T),p.current=null,f.current=()=>{},delete w.dataset.scrolling}},[i,a]);const y=v=>{if(v.button!==0)return;const w=s.current,A=u.current,T=d.current.clientHeight-A.offsetHeight;if(T<=0)return;v.preventDefault(),v.currentTarget.setPointerCapture(v.pointerId);const S=(w.scrollHeight-w.clientHeight)/T;v.target!==A&&(w.scrollTop=(v.clientY-d.current.getBoundingClientRect().top-A.offsetHeight/2)*S),p.current={pointerId:v.pointerId,y:v.clientY,scroll:w.scrollTop,scale:S},f.current()},g=v=>{const w=p.current;w?.pointerId===v.pointerId&&(s.current.scrollTop=w.scroll+(v.clientY-w.y)*w.scale)},x=v=>{p.current?.pointerId===v.pointerId&&(p.current=null,v.currentTarget.hasPointerCapture(v.pointerId)&&v.currentTarget.releasePointerCapture(v.pointerId),f.current())};return b.jsxs("div",{className:"limr-overlay-scroll",children:[b.jsx("div",{ref:s,className:"limr-overlay-content","data-limr-card-body":"",tabIndex:0,role:"region","aria-label":o,children:b.jsx("div",{ref:c,className:"limr-overlay-scroll-inner",children:t})}),b.jsx("div",{ref:d,className:"limr-overlay-scrollbar","aria-hidden":"true",onPointerDown:y,onPointerMove:g,onPointerUp:x,onPointerCancel:x,onLostPointerCapture:x,children:b.jsx("div",{ref:u,className:"limr-overlay-scroll-thumb"})})]})}function ic({title:t,bodyLabel:i,occurrence:a,expanded:o,pinned:s,canExpand:c,expand:u,collapse:d,close:p,children:f}){const y=ln();return b.jsxs(b.Fragment,{children:[b.jsxs("div",{className:"limr-overlay-header",children:[b.jsx("span",{children:t}),b.jsxs("div",{className:"limr-overlay-controls",children:[o?b.jsx("button",{type:"button",onClick:d,children:b.jsx("span",{className:"limr-underline",children:y.collapse})}):c&&b.jsx("button",{type:"button",onClick:u,children:b.jsx("span",{className:"limr-underline",children:y.expand})}),s&&b.jsx("button",{type:"button",className:"limr-overlay-close",onClick:p,"aria-label":y.close,children:"×"})]})]}),b.jsx(D0,{active:!0,resetKey:a.id,label:i??(typeof t=="string"?t:y.annotations),children:f})]})}const Q2=({children:t})=>b.jsx("p",{children:b.jsx("span",{className:"limr-underline",children:t})});function W2(){return b.jsx("svg",{viewBox:"0 0 16 16","aria-hidden":"true",fill:"currentColor",children:b.jsx("path",{d:"M2.5 4.2h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H2.5V4.2Zm6.7 0h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H9.2V4.2Z"})})}function ac({source:t,className:i,...a}){const o=bt(),s=qe(o.configuration,c=>c);return b.jsx(ni,{source:t,extensions:s.extensions,parameters:s.parameters,components:s.components,annotationTypes:s.annotationTypes,theme:s.theme,appearance:s.appearance,locale:s.locale,interactive:!1,...a,className:`limr-annotation-markdown ${i??""}`})}function j0(t={}){function i({annotations:s}){const c=L.useMemo(()=>s.filter(u=>u.type===(t.type??"citation")).map(u=>{const d=u.data,p=d?.summary?.trim()||d?.description?.trim();return p?Tl(p).children?.map(Qu).join(" ").replace(/\s+/g," ").trim():gn(d?.url)||d?.title}).filter(Boolean).join(" · "),[s]);return c?b.jsx("span",{title:c,children:c}):null}function a(s){const c=ln();return b.jsx(ic,{...s,title:c.citation??c.annotations})}function o({data:s}){const c=bt(),u=qe(c.configuration,()=>c.components),d=L.useMemo(()=>({...u,paragraph:u.paragraph??Q2}),[u]),p=L.useRef(null),f=gn(s?.url);return b.jsxs("div",{className:"limr-citation-content","data-linked":!!f||void 0,onClick:y=>{f&&!y.defaultPrevented&&!y.target.closest('a,button,input,textarea,select,summary,[role="button"],[contenteditable="true"],[data-limr-card-interactive]')&&window.getSelection()?.isCollapsed!==!1&&p.current?.click()},children:[b.jsx("a",{ref:p,className:"limr-citation-title",href:f,target:"_blank",rel:"noopener noreferrer",children:b.jsx("span",{className:"limr-underline",children:s?.title??s?.url??"Citation"})}),(s?.description||s?.summary)&&b.jsx(ac,{source:s.description||s.summary,components:d})]})}return{name:"citation",tags:["citation","ref"],scope:"local",annotationTypes:[{type:"citation",label:s=>s.citation??"Citation",icon:W2,color:"#6366f1",highlight:"hover",Content:o,...t,sidebar:{Preview:i,collapseOnContentClick:!1,...t.sidebar},overlay:{Card:a,expand:!1,...t.overlay}}],transform(s){bi(s,c=>{if(!(c.type!=="component"||c.incomplete)){if(c.name==="citation"){const u=c.attributes??{},d=String(u["cite-id"]??u.id??"");c.type="annotationDefinition",c.annotation={id:d,type:"citation",data:{title:u.title,url:u.url,description:u.desc??u.description,summary:u.summary}}}else if(c.name==="ref"){const u=String(c.attributes?.["cite-from-ids"]??c.attributes?.ids??c.attributes?.id??"");let d;try{const p=JSON.parse(u);d=Array.isArray(p)?p.map(String):[String(p)]}catch{d=u.split(",").map(p=>p.trim()).filter(Boolean)}c.type="annotationReference",c.annotationIds=d}}})}}}const eN=L.forwardRef(function({label:i,color:a,children:o,className:s="",style:c,...u},d){return b.jsx("span",{className:"limr-mark-wrap","data-limr-ignore":"true",children:b.jsx("button",{...u,ref:d,type:"button","aria-label":i,title:u.title??i,className:`limr-mark limr-action-mark ${s}`,style:{"--limr-mark-color":a,...c},children:b.jsx("span",{className:"limr-mark-icon",children:o})})})});function qi({open:t,children:i,className:a="",keepMounted:o=!1}){const[s,c]=L.useState(t),[u,d]=L.useState(t),p=L.useRef(null);return Et(()=>{if(o)return;if(t){if(!s){c(!0);return}p.current?.getBoundingClientRect(),d(!0);return}d(!1);const f=setTimeout(()=>c(!1),420);return()=>clearTimeout(f)},[t,o,s]),b.jsx("div",{ref:f=>{p.current=f,f?.toggleAttribute("inert",!t)},className:`limr-collapse ${a}`,"data-open":(o?t:u)||void 0,"aria-hidden":!t,children:b.jsx("div",{className:"limr-collapse-inner",children:s||o?i:null})})}const wu=["origin","translation","both"],df={origin:"原文",translation:"译文",both:"对照"};function tN({mode:t}){return b.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:t==="both"?b.jsxs(b.Fragment,{children:[b.jsx("rect",{x:"2.5",y:"4",width:"8",height:"16",rx:"2.5"}),b.jsx("rect",{x:"13.5",y:"4",width:"8",height:"16",rx:"2.5"}),b.jsx("path",{d:"M5 9h3M5 12h3M16 9h3M16 12h3"})]}):b.jsxs(b.Fragment,{children:[b.jsx("rect",{x:"4.5",y:"3",width:"15",height:"18",rx:"3"}),t==="origin"?b.jsx("path",{d:"M8.5 8h7M8.5 12h7M8.5 16h4"}):b.jsx("path",{d:"M8 8.5h8M12 6.5v2M14.5 8.5c-.5 4-3 6.5-6.5 8M9.5 11c1.2 2.5 3.2 4.2 6.5 5.5"})]})})}function nN(t,i){return wu.includes(t)?t:i}function Zf(t,i){for(const a of t.children??[]){if(a.name===i)return a;if(a.type==="paragraph"){const o=Zf(a,i);if(o)return o}}}function iN(t={}){function i({node:a,children:o,renderChildren:s}){const c=Zf(a,"origin"),u=Zf(a,"translation"),[d,p]=L.useState(),f=Ax("translationMode"),y=Ax("onTranslationModeChange"),g=nN(f??d??a.attributes?.default,t.defaultMode??"origin"),x=c?u?g:"origin":"translation",v=wu[(wu.indexOf(x)+1)%wu.length],w=L.useRef(null),A=L.useRef(!1),T=f!==void 0&&!y;if(Et(()=>{A.current&&(w.current?.focus({preventScroll:!0}),A.current=!1)},[x]),!c&&!u)return b.jsx(b.Fragment,{children:o});const S=c&&u?b.jsx(eN,{ref:w,"data-translation-switch":"","data-mode":x,color:"var(--limr-translation-accent, #6b8fb5)",disabled:T,label:T?`当前${df[x]}，由全局展示模式控制`:`当前${df[x]}，切换到${df[v]}`,onClick:()=>{A.current=document.activeElement===w.current,f!==void 0?y?.(v):p(v)},children:b.jsx(tN,{mode:x})}):void 0;return b.jsxs("div",{className:"limr-translations","data-mode":x,children:[u&&b.jsx(qi,{open:x!=="origin",keepMounted:!0,className:"limr-translation-panel",children:b.jsx("div",{className:"limr-translation-text","data-language":"translation",children:s(u.children??[],{trailing:x==="translation"?S:void 0})})}),c&&b.jsx(qi,{open:x!=="translation",keepMounted:!0,className:"limr-translation-panel",children:b.jsx("div",{className:"limr-translation-text","data-language":"origin",children:s(c.children??[],{trailing:x!=="translation"?S:void 0})})})]})}return{name:"translations",tags:["translations","origin","translation"],directives:["translations","origin","translation"],display:"block",scope:"local",parameters:{translationMode:void 0,onTranslationModeChange:void 0},components:{translations:i,origin:({children:a})=>b.jsx(b.Fragment,{children:a}),translation:({children:a})=>b.jsx(b.Fragment,{children:a})}}}function O0(){const t=ln();return b.jsx("span",{className:"limr-loading",role:"status","aria-label":t.loading,"data-limr-ignore":"true",children:b.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[b.jsx("circle",{className:"limr-loading-track",cx:"16",cy:"16",r:"12"}),b.jsx("g",{className:"limr-loading-orbit",children:b.jsx("circle",{className:"limr-loading-arc",cx:"16",cy:"16",r:"12",pathLength:"100"})})]})})}function fo(){return b.jsx("div",{className:"limr-block-loading",children:b.jsx(O0,{})})}function yt({name:t,...i}){return b.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",...i,children:b.jsxs("g",{transform:t==="highlight"?"translate(0 -1.25)":t==="comment"?"translate(0 -.5)":void 0,children:[(t==="eye"||t==="eye-off")&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6Z"}),b.jsx("circle",{cx:"12",cy:"12",r:"2.7"}),t==="eye-off"&&b.jsx("path",{d:"m4 4 16 16"})]}),t==="question"&&b.jsxs(b.Fragment,{children:[b.jsx("circle",{cx:"12",cy:"12",r:"8.5"}),b.jsx("path",{d:"M9.4 9a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2-2.6 3.7M12 17h.01"})]}),t==="highlight"&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"m8 15 7.6-9a2 2 0 0 1 2.8-.2l.8.7a2 2 0 0 1 .2 2.8L12 18l-4-3Z"}),b.jsx("path",{d:"m8 15-2 3 3 1 3-1M4 21h10M14 8l4 3.5"})]}),t==="edit"&&b.jsx(b.Fragment,{children:b.jsx("path",{d:"m14.5 5.5 4 4M4.5 19.5l4.5-1 11-11a2.1 2.1 0 0 0 0-3 2.1 2.1 0 0 0-3 0l-11 11-1.5 4Z"})}),t==="close"&&b.jsx("path",{d:"m6 6 12 12M18 6 6 18"}),t==="copy"&&b.jsxs(b.Fragment,{children:[b.jsx("rect",{x:"8.5",y:"8",width:"10.5",height:"12",rx:"3"}),b.jsx("path",{d:"M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5"})]}),(t==="zoom-in"||t==="zoom-out")&&b.jsxs(b.Fragment,{children:[b.jsx("circle",{cx:"10.5",cy:"10.5",r:"6.5"}),b.jsx("path",{d:"m15.4 15.4 4.6 4.6M7.5 10.5h6"}),t==="zoom-in"&&b.jsx("path",{d:"M10.5 7.5v6"})]}),t==="source"&&b.jsx(b.Fragment,{children:b.jsx("path",{d:"m7 7-4 5 4 5m10-10 4 5-4 5m-4-13-2 16"})}),t==="image"&&b.jsxs(b.Fragment,{children:[b.jsx("rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"3.5"}),b.jsx("circle",{cx:"15.5",cy:"9",r:"1.5"}),b.jsx("path",{d:"m4 16 4.4-4.4a1.5 1.5 0 0 1 2.2 0L17 19m-3-3 1.4-1.4a1.5 1.5 0 0 1 2.2 0L20 17"})]}),["background","underline","dotted","wavy"].includes(t)&&b.jsxs(b.Fragment,{children:[t==="background"&&b.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"5",fill:"currentColor",fillOpacity:".13",stroke:"none"}),b.jsx("path",{d:"m8 15 3-8a1.05 1.05 0 0 1 2 0l3 8M9.2 12h5.6"}),t==="background"&&b.jsx("path",{d:"M7 19h10",strokeWidth:"2.5"}),t==="underline"&&b.jsx("path",{d:"M5 20h14"}),t==="dotted"&&b.jsx("path",{d:"M5 20h14",strokeDasharray:".1 3.4",strokeWidth:"2.4"}),t==="wavy"&&b.jsx("path",{d:"M4 20c1.3-2 2.7-2 4 0s2.7 2 4 0 2.7-2 4 0 2.7 2 4 0"})]}),t==="chevron"&&b.jsx("path",{d:"m8 10 4 4 4-4"}),t==="check"&&b.jsx("path",{d:"m5.5 12 4.2 4.2 8.8-9"}),t==="trash"&&b.jsx(b.Fragment,{children:b.jsx("path",{d:"M4.5 7h15M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l.7 12a2 2 0 0 0 2 2h4.6a2 2 0 0 0 2-2L17 7M10 11v6M14 11v6"})}),t==="note"&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"M14 3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9l-6-6Z"}),b.jsx("path",{d:"M14 3v4a2 2 0 0 0 2 2h4M8 13h8M8 17h5"})]}),t==="comment"&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"M8 19 4 21V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8Z"}),b.jsx("path",{d:"M8 9h8M8 13h5"})]}),t==="footnote"&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"M5 7h9M5 11h12M5 15h8M5 20h14M18 4h2v5"}),b.jsx("path",{d:"M17.5 9h4"})]}),t==="sparkles"&&b.jsxs(b.Fragment,{children:[b.jsx("path",{d:"m10.5 4 1.8 4.8 4.7 1.7-4.7 1.8-1.8 4.7-1.7-4.7L4 10.5l4.8-1.7L10.5 4Z"}),b.jsx("path",{d:"m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM19 3v4M17 5h4"})]})]})})}let aN=0,vx=Promise.resolve();const rN=new km(32);async function oN(t,i,a,o,s){let c="";const u=vx.then(async()=>{if(s.aborted)throw s.reason;const{default:d}=await ec(async()=>{const{default:f}=await import("./mermaid.core-BCOesDpz.js").then(y=>y.bA);return{default:f}},[]);if(await document.fonts.ready,s.aborted)throw s.reason;d.initialize({startOnLoad:!1,securityLevel:"strict",suppressErrorRendering:!0,fontFamily:o,theme:"base",themeVariables:a?{background:"#242321",primaryColor:"#383531",primaryTextColor:"#e2ded7",primaryBorderColor:"#7b746a",lineColor:"#a29a8e",secondaryColor:"#302e2a",tertiaryColor:"#302e2a"}:{background:"#f9f8f6",primaryColor:"#eeebe6",primaryTextColor:"#49443e",primaryBorderColor:"#b5aca0",lineColor:"#91877a",secondaryColor:"#f5f3ef",tertiaryColor:"#f5f3ef"}});const p=document.createElement("div");p.style.cssText="position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none",p.style.fontFamily=o,document.body.append(p);try{c=(await d.render(t,i,p)).svg}finally{p.remove()}});return vx=u.catch(()=>{}),await u,c}function lN({node:t,incomplete:i}){const a=ln(),o=mo(),s=bt(),c=a.language?.startsWith("zh"),[u]=L.useState(()=>`limr-mermaid-${++aN}`),[d,p]=L.useState(!1),[f,y]=L.useState(),[g,x]=L.useState(!1),[v,w]=L.useState(1),[A,T]=L.useState(0),S=L.useRef(null),E=L.useRef(null),C=L.useRef(null),R=L.useRef(!1),_=t.value??"",N=o==="dark"||o==="auto"&&d,j=JSON.stringify([u,_,N,A]),z=f?.key===j?f:void 0;L.useEffect(()=>{if(o!=="auto")return;const Y=matchMedia("(prefers-color-scheme: dark)"),P=()=>p(Y.matches);return P(),Y.addEventListener("change",P),()=>Y.removeEventListener("change",P)},[o]),L.useEffect(()=>{if(i)return;let Y=!1;const P=S.current?getComputedStyle(S.current).fontFamily:"sans-serif",M=rN.acquire(`${j}:${P}`,V=>oN(u,_,N,P,V));return M.promise.then(V=>{Y||y({key:j,svg:V})},()=>{Y||y({key:j,error:!0})}),()=>{Y=!0,M.release()}},[j,i]),R0(E,!!z?.svg,z?.svg);const B=i||!z,I=g||z?.error;L.useEffect(()=>{const Y=E.current;if(!Y||I)return;const P=M=>{if(!M.shiftKey||M.ctrlKey||M.metaKey||!M.deltaY||Y.scrollWidth<=Y.clientWidth)return;const V=M.deltaMode===1?16:M.deltaMode===2?Y.clientWidth:1;Y.scrollLeft+=(M.deltaX||M.deltaY)*V,M.preventDefault()};return Y.addEventListener("wheel",P,{passive:!1}),()=>Y.removeEventListener("wheel",P)},[B,I]);const X=()=>{const Y=E.current?.firstElementChild;if(!Y)return;const P=document.createRange();P.selectNodeContents(Y);const M=Y.ownerDocument.getSelection();M?.removeAllRanges(),M?.addRange(P)},oe=g?c?"显示图像":"Show diagram":c?"显示源代码":"Show source";return b.jsxs("div",{className:"limr-math-block limr-mermaid-block",ref:S,"data-mermaid-state":B?"loading":z?.error?"error":"ready",children:[b.jsxs("div",{className:"limr-math-display limr-mermaid-display",children:[B&&b.jsx("div",{className:"limr-mermaid-loading",children:b.jsx(O0,{})}),!B&&b.jsxs(b.Fragment,{children:[z?.error&&b.jsxs("div",{className:"limr-mermaid-error","data-limr-ignore":"true",role:"status",children:[c?"图表暂时无法绘制":"Unable to render diagram"," ",b.jsx("button",{type:"button",onClick:()=>T(Y=>Y+1),children:a.retry})]}),b.jsx("pre",{className:"limr-mermaid-source",hidden:!I,children:b.jsx("code",{children:_})}),b.jsx("div",{className:"limr-mermaid-viewport",hidden:!!I,ref:E,tabIndex:0,role:"region","aria-label":c?"图表视口":"Diagram viewport","aria-description":c?"拖动平移；方向键或滚轮移动，Shift 加滚轮横向移动；单击或按 Enter 整块选择。":"Drag to pan; use arrow keys or the wheel to scroll, Shift+wheel to scroll horizontally; click or press Enter to select the block.",onDragStart:Y=>Y.preventDefault(),onPointerDown:Y=>{if(R.current=!1,Y.button!==0||Y.pointerType==="touch")return;const P=Y.currentTarget,M=P.getBoundingClientRect();Y.clientX>=M.left+P.clientLeft+P.clientWidth||Y.clientY>=M.top+P.clientTop+P.clientHeight||(Y.preventDefault(),P.focus({preventScroll:!0}),C.current={id:Y.pointerId,x:Y.clientX,y:Y.clientY,left:P.scrollLeft,top:P.scrollTop,moved:!1},P.setPointerCapture(Y.pointerId))},onPointerMove:Y=>{const P=C.current;if(!P||P.id!==Y.pointerId)return;const M=Y.clientX-P.x,V=Y.clientY-P.y;!P.moved&&Math.hypot(M,V)<=4||(P.moved||(P.moved=!0,s.clearSelection(),Y.currentTarget.dataset.dragging="true"),Y.currentTarget.scrollTo(P.left-M,P.top-V))},onPointerUp:Y=>{C.current?.id===Y.pointerId&&(R.current=C.current.moved,C.current=null,delete Y.currentTarget.dataset.dragging,Y.currentTarget.hasPointerCapture(Y.pointerId)&&Y.currentTarget.releasePointerCapture(Y.pointerId))},onLostPointerCapture:Y=>{C.current=null,delete Y.currentTarget.dataset.dragging},onClick:Y=>{!Y.defaultPrevented&&!R.current&&!Y.ctrlKey&&!Y.metaKey&&!Y.shiftKey&&!Y.altKey&&X()},onKeyDown:Y=>{if(Y.altKey||Y.ctrlKey||Y.metaKey)return;const P=Y.currentTarget,M={ArrowLeft:[-48,0],ArrowRight:[48,0],ArrowUp:[0,-48],ArrowDown:[0,48],PageUp:[0,-P.clientHeight*.9],PageDown:[0,P.clientHeight*.9]};if(M[Y.key])P.scrollBy(...M[Y.key]);else if(Y.key==="Home")P.scrollTo(0,0);else if(Y.key==="End")P.scrollTo(P.scrollWidth,P.scrollHeight);else if(Y.key==="Enter")X();else return;Y.preventDefault()},children:b.jsx("div",{className:"limr-mermaid-canvas",style:{width:`${v*100}%`},role:"img","aria-label":c?"Mermaid 图表":"Mermaid diagram",dangerouslySetInnerHTML:{__html:z?.svg??""}})})]})]}),b.jsxs("div",{className:"limr-block-tools","data-limr-ignore":"true",role:"group","aria-label":c?"图表工具":"Diagram tools",children:[b.jsx(lo,{value:_,label:c?"复制 Mermaid 源代码":"Copy Mermaid source"}),b.jsx("button",{type:"button",disabled:B||!!I||v>=3,title:c?"放大":"Zoom in","aria-label":c?"放大":"Zoom in",onClick:()=>w(Y=>Math.min(3,+(Y+.25).toFixed(2))),children:b.jsx(yt,{name:"zoom-in"})}),b.jsx("button",{type:"button",disabled:B||!!I||v<=.5,title:c?"缩小":"Zoom out","aria-label":c?"缩小":"Zoom out",onClick:()=>w(Y=>Math.max(.5,+(Y-.25).toFixed(2))),children:b.jsx(yt,{name:"zoom-out"})}),b.jsx("button",{type:"button",disabled:B||z?.error,title:oe,"aria-label":oe,"aria-pressed":g,onClick:()=>x(Y=>!Y),children:b.jsx(yt,{name:g?"image":"source"})})]})]})}function sN(){return{name:"mermaid",directives:["mermaid"],literal:!0,scope:"local",components:{mermaid:lN},transform(t,i){Om(t,i.source,"mermaid"),bi(t,a=>{a.type==="code"&&String(a.lang).toLowerCase()==="mermaid"&&(a.type="mermaid"),a.type==="mermaid"&&(a.selection="atomic")})}}}function so(t,i,a){const o=t.slice(a.offset,i),s=[...o.matchAll(/\r\n|\r|\n/g)],c=s.at(-1);return{offset:i,line:a.line+s.length,column:c?o.length-c.index-c[0].length+1:a.column+o.length}}function Kf(t,i,a,o){if(!t.position)return;const s=Be(t);if(s.end<=i||s.start>=a)return;if(s.start>=i&&s.end<=a)return t;let c=Math.max(s.start,i),u=Math.min(s.end,a);const d={...t};if(t.type==="text"){const p=(t.value??"").replace(/\r\n?/g,`
`),f=Ml(o,p,s),y=f.ends.findIndex(x=>x>c);let g=f.starts.findIndex(x=>x>=u);if(y<0||(g<0&&(g=f.starts.length),g<=y))return;d.value=p.slice(y,g),c=f.starts[y],u=f.ends[g-1]}return t.children&&(d.children=va(t.children,c,u,o)),d.position={start:so(o,c,t.position.start),end:so(o,u,t.position.start)},d}function va(t,i,a,o){return t.flatMap(s=>{const c=Kf(s,i,a,o);return c?[c]:[]})}function L0(t,i,a){return t.flatMap(o=>{if(o.type!=="text"||!o.value||!o.position)return[];const s=[...o.value.matchAll(i)];if(!s.length)return[];const c=Ml(a,o.value,Be(o));return s.flatMap(u=>{const d=c.starts[u.index],p=c.ends[u.index+u[0].length-1];return a.slice(d,p)===u[0]?[{start:d,end:p}]:[]})})}function or({name:t,component:i,tags:a=[t],directives:o=[t],selection:s="content",streaming:c}){return{name:t,tags:a,directives:o,selection:s,streaming:c,display:"block",scope:"local",components:Object.fromEntries([...new Set([...a,...o])].map(u=>[u,i]))}}const z0={note:{color:"#6488b5",icon:"edit"},abstract:{color:"#4b9ba0",icon:"note"},info:{color:"#6488b5",icon:"note"},todo:{color:"#6488b5",icon:"check"},tip:{color:"#4b9b8d",icon:"sparkles"},success:{color:"#659664",icon:"check"},question:{color:"#b38b4e",icon:"question"},warning:{color:"#bc8850",icon:"question"},failure:{color:"#be6967",icon:"close"},danger:{color:"#be6967",icon:"close"},bug:{color:"#be6967",icon:"note"},example:{color:"#9580b4",icon:"note"},quote:{color:"#928b80",icon:"comment"}},uN={summary:"abstract",tldr:"abstract",hint:"tip",important:"tip",check:"success",done:"success",help:"question",faq:"question",caution:"warning",attention:"warning",fail:"failure",missing:"failure",error:"danger",cite:"quote"};function cN(t){const i=t.toLowerCase();return uN[i]??(Object.hasOwn(z0,i)?i:"note")}function dN({node:t,renderChildren:i,renderAttribute:a}){const o=ln().language?.startsWith("zh"),s=String(t.attributes?.type??"note").toLowerCase(),c=cN(s),u=z0[c],d=t.children?.find(w=>w.type==="calloutTitle"),p=t.children?.filter(w=>w.type!=="calloutTitle")??[],f=t.attributes?.fold,[y,g]=L.useState(f!=="-"&&f!=="closed"),x=b.jsx("div",{className:"limr-block-content",children:i(p)}),v=b.jsxs(b.Fragment,{children:[b.jsx(yt,{name:u.icon,"data-limr-ignore":"true"}),b.jsx("span",{children:d?i(d.children??[]):t.attributes?.title?a("title"):b.jsx("span",{"data-limr-ignore":"true",children:s.charAt(0).toUpperCase()+s.slice(1)})})]});return b.jsxs("aside",{className:"limr-note limr-callout","data-callout":s,"data-callout-type":c,style:{"--limr-callout-color":u.color},children:[b.jsxs("div",{className:"limr-card-label limr-callout-title",children:[v,f&&b.jsx("button",{type:"button",className:"limr-callout-toggle","aria-label":y?o?"收起提示块":"Collapse callout":o?"展开提示块":"Expand callout","aria-expanded":y,onClick:()=>g(w=>!w),"data-limr-ignore":"true",children:b.jsx(yt,{name:"chevron"})})]}),f?b.jsx(qi,{open:y,keepMounted:!0,children:x}):x]})}function hN(t={}){return{...or({name:"callout",component:t.component??dN,streaming:t.component?void 0:{Loading:fo}}),transform(i,a){bi(i,o=>{if(o.type!=="blockquote")return;const s=o.children?.[0];if(s?.type!=="paragraph"||!s.position)return;const c=s.position.start.offset,u=s.position.end.offset,d=a.source.slice(c,u),p=/^\[!([\w-]+)\]([+-])?[ \t]*/.exec(d);if(!p){a.streaming&&/^\[![\w-]*$/.test(d)&&(o.type="callout",o.incomplete=!0,o.children=[]);return}o.type="callout",o.attributes={type:p[1].toLowerCase(),...p[2]?{fold:p[2]}:{}};const f=/\r\n|\r|\n/.exec(d),y=f?c+f.index:u,g=f?y+f[0].length:u,x=Kf(s,c+p[0].length,y,a.source),v=Kf(s,g,u,a.source);o.children=[...x?.children?.length?[{...x,type:"calloutTitle"}]:[],...v?.children?.length?[v]:[],...o.children.slice(1)]})}}}const fN=({children:t})=>b.jsx(b.Fragment,{children:t});function mN(t={}){const i=(a,o)=>{a.type="embeddedHighlight",a.highlightRange=o,a.annotation={id:`inline-highlight:${Be(a).start}`,type:"highlight",range:o,data:{color:t.color??"var(--limr-inline-highlight, #6B9BD2)",style:"background",readOnly:!0}}};return{name:"inline-highlights",tags:["highlight"],scope:"local",components:{embeddedHighlight:t.component??fN},transform(a,{source:o,streaming:s}){const c=u=>{if(!u.children||["code","inlineCode","math","inlineMath","html","footnoteDefinition","annotationDefinition"].includes(u.type))return;if(u.children.forEach(c),u.type==="component"&&u.name==="highlight"){const y=u.children[0],g=u.children.at(-1);y&&g&&i(u,{start:Be(y).start,end:Be(g).end});return}const d=L0(u.children,new RegExp("(?<!=)==(?!=)","g"),o);if(!u.position)return;if(!d.length){const y=u.children.at(-1),g=Be(u).end;s&&g===o.length&&y?.type==="text"&&o.endsWith("=")&&o[g-2]!=="\\"&&(u.children=va(u.children,Be(u).start,g-1,o));return}const p=[];let f=Be(u).start;for(let y=0;y<d.length;y+=2){const g=d[y],x=d[y+1];if(!x&&(!s||Be(u).end<o.trimEnd().length))break;let v=x?.start??Be(u).end;!x&&o[v-1]==="="&&o[v-2]!=="="&&o[v-2]!=="\\"&&v--;const w=va(u.children,g.end,v,o);if(!w.length&&x)continue;p.push(...va(u.children,f,g.start,o));const A={type:"embeddedHighlight",inline:!0,children:w,incomplete:x?void 0:!0,position:{start:so(o,g.start,u.position.start),end:so(o,x?.end??Be(u).end,u.position.start)}};w.length&&i(A,{start:g.end,end:v}),p.push(A),f=x?.end??Be(u).end}p.push(...va(u.children,f,Be(u).end,o)),u.children=p};c(a)}}}const hf=t=>`footnote:${String(t).trim().replace(/\s+/g," ").toLowerCase()}`;function pN(){return b.jsx(yt,{name:"comment"})}function gN({data:t}){return b.jsx(ac,{source:t?.body??""})}function yN(t){return b.jsx(ic,{...t,title:ln().footnotes})}function bN({data:t}){const i=L.useMemo(()=>Qu(Tl(t?.body??"")).replace(/\s+/g," ").trim(),[t?.body]);return i?b.jsx("span",{title:i,children:i}):null}function vN(t={}){const i=t.type??"footnote",a=(o,s)=>({id:o,type:i,data:{body:s}});return{name:"footnotes",tags:["footnote","footnote-ref"],scope:"local",annotationTypes:[{type:i,label:o=>o.footnotes,icon:pN,color:"#6B9BD2",highlight:"hover",Content:gN,...t,sidebar:{Preview:bN,collapseOnContentClick:!1,...t.sidebar},overlay:{Card:yN,expand:!1,...t.overlay}}],transform(o,{source:s,streaming:c}){const u=d=>{if(d.type==="footnoteDefinition"){const f=Be(d),g=s.slice(f.start,f.end).replace(/^\[\^[^\]]+\]:[ \t]*/,"").replace(/(\r\n|\r|\n)(?: {4}|\t)/g,"$1");d.annotation=a(hf(d.identifier),g);return}if(d.type==="footnoteReference"){d.type="annotationReference",d.inline=!0,d.annotationIds=[hf(d.identifier)];return}if(d.type==="component"&&["footnote","footnote-ref"].includes(d.name??"")){if(d.incomplete){d.children=[];return}const f=hf(d.attributes?.id??"");if(d.name==="footnote"){const y=d.children?.[0],g=d.children?.at(-1);d.type="annotationDefinition",d.annotation=a(f,y&&g?s.slice(Be(y).start,Be(g).end):String(d.attributes?.body??""));return}d.type="annotationReference",d.annotationIds=[f];return}if(!d.children||["code","inlineCode","math","inlineMath","html","annotationDefinition"].includes(d.type))return;d.children.forEach(u);const p=L0(d.children,/\^\[/g,s);if(p.length&&d.position){const f=[],y=Be(d);let g=y.start;for(const x of p){if(x.start<g)continue;let v=1,w=x.end;const A=d.children.filter(S=>S.type!=="text").map(Be);for(;w<y.end&&v;w++){const S=A.find(E=>E.start<=w&&E.end>w);if(S){w=S.end-1;continue}if(s[w]==="\\"){w++;continue}s[w]==="["?v++:s[w]==="]"&&v--}if(v){if(c&&y.end>=s.trimEnd().length){f.push(...va(d.children,g,x.start,s)),g=y.end;break}continue}const T=`inline-footnote:${x.start}`;f.push(...va(d.children,g,x.start,s),{type:"annotationReference",inline:!0,annotationIds:[T],annotation:a(T,s.slice(x.end,w-1)),position:{start:so(s,x.start,d.position.start),end:so(s,w,d.position.start)}}),g=w}f.push(...va(d.children,g,y.end,s)),d.children=f}d.children.forEach((f,y)=>{const g=d.children[y-1];f.type==="annotationReference"&&g?.type==="embeddedHighlight"&&Be(g).end===Be(f).start&&(f.referenceRange=g.highlightRange)})};u(o)}}}function xx({title:t,open:i,onChange:a,children:o}){return b.jsxs("details",{className:"limr-disclosure",open:!0,"data-expanded":i||void 0,children:[b.jsxs("summary",{"aria-expanded":i,onClick:s=>{s.preventDefault(),a(!i)},"data-limr-ignore":"true",children:[b.jsx("span",{className:"limr-underline",children:t}),b.jsx("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:b.jsx("path",{d:"m6 8 4 4 4-4"})})]}),b.jsx(qi,{open:i,keepMounted:!0,children:b.jsx("div",{className:"limr-question-detail",children:o})})]})}function xN({checked:t}){return b.jsxs("svg",{className:"limr-choice-diamond",width:"14",height:"14",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true","data-limr-ignore":"true","data-checked":t||void 0,children:[b.jsx("path",{className:"limr-diamond-outline",d:"M9 1.5L16.5 9L9 16.5L1.5 9Z",fill:"none"}),b.jsx("path",{className:"limr-diamond-fill",d:"M9 5L13 9L9 13L5 9Z",fill:"currentColor"})]})}function wN(t,i="auto"){const a=gn(t);if(!a)return;let o;try{o=new URL(a.startsWith("//")?`https:${a}`:a)}catch{return i==="auto"||i==="native"?{url:a,native:!0}:void 0}if(!["https:","http:"].includes(o.protocol))return;const s=/(?:^|\.)(?:youtube\.com|youtube-nocookie\.com)$/.test(o.hostname)||o.hostname==="youtu.be",c=/(?:^|\.)bilibili\.com$/.test(o.hostname),u=i==="auto"?s?"youtube":c?"bilibili":"native":i;if(u==="native")return{url:a,native:!0};if(u==="youtube"&&s){const d=o.hostname==="youtu.be"?o.pathname.split("/")[1]:o.searchParams.get("v")??/^\/(?:embed|shorts|live)\/([\w-]+)/.exec(o.pathname)?.[1];if(d&&/^[\w-]{11}$/.test(d)){const p=new URL(`https://www.youtube.com/embed/${d}`),f=o.searchParams.get("start")??o.searchParams.get("t");if(f){const y=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(f),g=y?Number(y[1]??0)*3600+Number(y[2]??0)*60+Number(y[3]??0):0;g>0&&p.searchParams.set("start",String(g))}return{url:p.href,native:!1}}}if(u==="bilibili"&&c){const d=/\/video\/(BV[\w]+|av\d+)(?:\/|$)/.exec(o.pathname)?.[1],p=d?.startsWith("BV")?d:o.hostname==="player.bilibili.com"?o.searchParams.get("bvid"):null,f=d?.startsWith("av")?d.slice(2):o.hostname==="player.bilibili.com"?o.searchParams.get("aid"):null;if(p&&/^BV[\w]+$/.test(p)||f&&/^\d+$/.test(f)){const y=new URL("https://player.bilibili.com/player.html");y.searchParams.set(p?"bvid":"aid",p||f),y.searchParams.set("autoplay","0"),y.searchParams.set("high_quality","1"),y.searchParams.set("danmaku","0");const g=o.searchParams.get("p")??o.searchParams.get("page");return g&&/^[1-9]\d*$/.test(g)&&y.searchParams.set("page",g),{url:y.href,native:!1}}}}function SN(t={}){function i({node:a,source:o,renderAttribute:s}){const c=bt(),u=qe(c.configuration,j=>j.scrollRoot),d=L.useRef(null),[p,f]=L.useState(!1),[y,g]=L.useState(!1),[x,v]=L.useState(!1),w=String(a.attributes?.provider??"auto"),A=String(a.attributes?.url??a.attributes?.src??""),T=a.attributes?.loading??t.loading??"visible",S=T==="click"||T==="eager"?T:"visible",E=t.resolveUrl?.(w,A),C=E&&gn(E)?{url:gn(E),native:w==="native"}:wN(A,w);L.useEffect(()=>{v(!1),g(!1)},[A,w]),L.useEffect(()=>{if(p||S!=="visible"||!d.current)return;if(typeof IntersectionObserver>"u"){f(!0);return}const j=new IntersectionObserver(z=>{z.some(B=>B.isIntersecting)&&(f(!0),j.disconnect())},{root:u,rootMargin:"200px"});return j.observe(d.current),()=>j.disconnect()},[p,S,u]);const R=S==="eager"||S==="visible"&&p||y,_=String(a.attributes?.title??`${w==="auto"?"Video":w} video`),N=gn(A);return b.jsxs("div",{ref:d,className:"limr-video","data-limr-selection-surface":"","data-loading":S,children:[b.jsx("div",{className:"limr-video-frame",children:!C||x?b.jsxs("div",{className:"limr-video-error",children:[b.jsx("span",{children:c.locale.unavailable}),N&&b.jsx("a",{href:N,target:"_blank",rel:"noopener noreferrer",children:A})]}):R?C.native?b.jsx("video",{controls:!0,playsInline:!0,preload:"metadata",src:C.url,"aria-label":_,onError:()=>v(!0)}):b.jsx("iframe",{src:C.url,title:_,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0,referrerPolicy:"strict-origin-when-cross-origin",onError:()=>v(!0)}):b.jsx("button",{type:"button",className:"limr-video-play",onClick:()=>g(!0),"aria-label":c.locale.play,children:b.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:b.jsx("path",{d:"m8 5 11 7-11 7Z",fill:"currentColor"})})})}),a.attributes?.title&&b.jsx("div",{className:"limr-video-title",children:s("title")}),b.jsx(lo,{className:"limr-video-copy",variant:"glass",value:o})]})}return or({name:"video",streaming:t.component?void 0:{Loading:fo},tags:["video","md-video"],component:t.component??i,selection:"atomic"})}const _m={minWidth:220,maxWidth:560,minHeight:120,maxHeight:480};function _0({ratio:t,limits:i}){const a=Math.min(i.maxWidth,i.maxHeight*t);return{maximum:a,minimum:Math.min(a,Math.max(i.minWidth,i.minHeight*t))}}function kN(t,i,a,o,s=!0){if(!i.length||t<=0)return 1;const c=i.map(_0),u=y=>{const g=(t-(y-1)*a)/y;return c.every(x=>g>=x.minimum)};if(o){let y=Math.max(1,Math.min(24,Math.floor(o)));if(s)for(;y>1&&!u(y);)y--;return y}const d=Math.max(...c.map(y=>y.maximum)),p=Math.max(...c.map(y=>y.minimum));let f=1;for(;f<i.length&&f<24&&t>=f*d+f*a+p&&u(f+1);)f++;return f}function nr(t,i,a=!1){if(a&&(t===!1||t==="false"||t==="none"))return 1/0;if(typeof t!="number"&&(typeof t!="string"||!/^\d+(?:\.\d+)?(?:px)?$/.test(t)))return i;const o=typeof t=="number"?t:parseFloat(t);return Number.isFinite(o)&&o>=0?o:i}function hu(t={},i=_m){return{minWidth:nr(t["min-width"],i.minWidth),maxWidth:nr(t["max-width"],i.maxWidth,!0),minHeight:nr(t["min-height"],i.minHeight),maxHeight:nr(t["max-height"],i.maxHeight,!0)}}const wx=L.createContext(_m),xl=t=>t.name==="figcaption"||t.name==="caption",Sx=t=>t.flatMap(i=>i.type==="paragraph"&&i.children?.some(a=>a.name==="figure"||xl(a))?i.children:[i]),kx=t=>t.attributes?.id?String(t.attributes.id):void 0,Tx=(t,i)=>{const a=Number(t)/Number(i);return Number.isFinite(a)&&a>0?a:1};function TN(t={}){const i=hu({"min-width":t.minWidth,"max-width":t.maxWidth,"min-height":t.minHeight,"max-height":t.maxHeight});function a({node:c,renderChildren:u,renderAttribute:d,source:p}){const f=ln(),y=Sx(c.children??[]),g=y.filter(N=>N.name==="figure"),x=y.filter(xl),v=y.filter(N=>!xl(N)),w=L.useMemo(()=>hu(c.attributes,i),[c.attributes]),A=L.useRef(null),[T,S]=L.useState(1),E=Math.min(100,nr(c.attributes?.gap,t.gap??16)),C=nr(c.attributes?.rows,t.rows??0),R=nr(c.attributes?.columns??c.attributes?.cols,t.columns??0)||(C>0?Math.ceil(g.length/C):void 0),_=String(c.attributes?.responsive??t.responsive??!0)!=="false";return L.useEffect(()=>{const N=A.current;if(!N)return;const j=()=>{const B=[...N.querySelectorAll(":scope > .limr-figure")],I=g.map((X,oe)=>{const Y=B[oe]?.querySelector("img");return{ratio:Y?.naturalWidth&&Y.naturalHeight?Y.naturalWidth/Y.naturalHeight:Tx(X.attributes?.width,X.attributes?.height),limits:hu(X.attributes,w)}});S(kN(N.clientWidth,I,E,R,_))},z=new ResizeObserver(j);return z.observe(N),N.addEventListener("load",j,!0),N.addEventListener("error",j,!0),j(),()=>{z.disconnect(),N.removeEventListener("load",j,!0),N.removeEventListener("error",j,!0)}},[c,w,E,R,_]),b.jsxs("figure",{id:kx(c),className:"limr-figures","data-limr-selection-order":"visual","data-columns":T,"data-responsive":_,children:[b.jsx(lo,{value:p,label:f.copyFigures,variant:"glass",className:"limr-figures-copy"}),b.jsx(wx.Provider,{value:w,children:b.jsx("div",{ref:A,className:"limr-figures-grid",style:{gridTemplateColumns:`repeat(${T}, minmax(0, 1fr))`,gridTemplateRows:C?`repeat(${Math.max(1,Math.min(24,Math.floor(C)))}, auto auto)`:void 0,gap:E},children:u(v)})}),x.length?u(x):c.attributes?.caption?b.jsx("figcaption",{children:d("caption")}):null]})}function o({node:c,renderChildren:u,renderAttribute:d}){const p=ln(),f=L.useContext(wx),y=hu(c.attributes,f===_m?i:f),g=L.useRef(null),[x,v]=L.useState(Tx(c.attributes?.width,c.attributes?.height)),w=Sx(c.children??[]),A=w.filter(xl),T=w.filter(E=>!xl(E));L.useEffect(()=>{const E=g.current;if(!E)return;const C=()=>{const R=E.querySelector("img");R?.naturalWidth&&R.naturalHeight&&v(R.naturalWidth/R.naturalHeight)};return C(),E.addEventListener("load",C,!0),()=>E.removeEventListener("load",C,!0)},[c]);const S=_0({ratio:x,limits:y}).maximum;return b.jsxs("figure",{id:kx(c),className:"limr-figure","data-limr-selection-order":"visual",style:{"--limr-figure-width":Number.isFinite(S)?`${S}px`:"100%","--limr-figure-min-height":`${Math.min(y.minHeight,y.maxHeight)}px`,"--limr-figure-max-height":Number.isFinite(y.maxHeight)?`${y.maxHeight}px`:"none"},children:[b.jsx("div",{ref:g,className:"limr-figure-media",children:u(T)}),b.jsx(lo,{onCopy:async()=>{const E=g.current?.querySelector("img")?.getAttribute("src");if(!E)throw new Error("Image URL unavailable");await navigator.clipboard.writeText(E)},label:p.copyImage,variant:"glass",className:"limr-figure-copy"}),A.length?u(A):c.attributes?.caption?b.jsx("figcaption",{children:d("caption")}):null]})}const s=({children:c})=>b.jsx("figcaption",{children:c});return{name:"figures",streaming:{Loading:fo},tags:["figures","figure","figcaption","caption","img"],directives:["figures","figure","figcaption"],scope:"local",display:"block",components:{figures:a,figure:o,figcaption:s,caption:s,img:({node:c})=>b.jsx("img",{src:gn(c.attributes?.src,!0),alt:String(c.attributes?.alt??""),loading:"lazy",decoding:"async"})},transform(c){const u=d=>{if(d.type==="component"&&d.name==="img"&&(d.selection="atomic",d.inline=!0),d.type==="component"&&d.name==="figure"&&(d.attributes?.src||d.attributes?.url)){const p=d.attributeNodes?.[d.attributes.src?"src":"url"];d.children=[{type:"image",url:d.attributes.src??d.attributes.url,alt:d.attributes.alt??"",position:p?.position??d.position},...d.children??[]]}d.children?.forEach(u)};u(c)}}}function tr(t,i){const a=[];return bi(t,o=>{o!==t&&o.name===i&&a.push(o)}),a}const Qf=({children:t})=>b.jsx(b.Fragment,{children:t});function AN(t={}){function i({node:a,children:o,renderChildren:s,renderAttribute:c}){const u=bt(),d=tr(a,"title")[0],p=tr(a,"content")[0];return b.jsxs("aside",{className:"limr-definition",children:[b.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:u.locale.definition}),(d||a.attributes?.title)&&b.jsx("div",{className:"limr-definition-title",children:d?s(d.children??[]):c("title")}),b.jsx("div",{className:"limr-block-content",children:p?s(p.children??[]):o})]})}return{...or({name:"definition",streaming:t.component?void 0:{Loading:fo},component:t.component??i}),tags:["definition","title","content"],components:{definition:t.component??i,title:Qf,content:Qf}}}function EN(t={}){function i({node:o,children:s,renderChildren:c,renderAttribute:u}){const d=bt(),[p,f]=L.useState(!1),[y,g]=L.useState(!1),[x,v]=L.useState([]),[w,A]=L.useState(!1),T=tr(o,"question-content")[0],S=tr(o,"question-hint")[0],E=tr(o,"question-answer")[0],C=tr(o,"question-sel-grp")[0],R=tr(o,"question-sel"),_=String(C?.attributes?.multi??o.attributes?.multi??"false")==="true";let N=[];try{const z=JSON.parse(String(C?.attributes?.answer??o.attributes?.answer??"[]"));N=(Array.isArray(z)?z:[z]).map(Number)}catch{}const j=N.length===x.length&&N.every(z=>x.includes(z));return b.jsxs("section",{className:"limr-question",children:[b.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:d.locale.question}),o.attributes?.title&&b.jsx("div",{className:"limr-question-title",children:u("title")}),b.jsx("div",{className:"limr-block-content",children:T?c(T.children??[]):!R.length&&!S&&!E?s:null}),R.length>0&&b.jsxs("fieldset",{className:"limr-question-options",children:[b.jsx("legend",{className:"limr-sr-only",children:String(o.attributes?.title??d.locale.question)}),R.map((z,B)=>b.jsxs("label",{"data-selected":x.includes(B)||void 0,"data-result":w?N.includes(B)?"correct":x.includes(B)?"incorrect":void 0:void 0,children:[b.jsx("input",{type:_?"checkbox":"radio",name:`${d.document.id}-question-${Be(o).start}`,checked:x.includes(B),disabled:w,onChange:()=>{v(_?x.includes(B)?x.filter(I=>I!==B):[...x,B]:[B])}}),b.jsx(xN,{checked:x.includes(B)||w&&N.includes(B)}),b.jsx("span",{className:"limr-choice-text",children:c(z.children??[])})]},B))]}),R.length>0&&N.length>0&&b.jsxs("div",{className:"limr-question-actions","data-limr-ignore":"true",children:[b.jsx("button",{type:"button","data-checked":w||void 0,disabled:!w&&!x.length,onClick:()=>{w?(A(!1),v([]),g(!1)):(A(!0),g(!0))},children:b.jsx("span",{className:"limr-button-label",children:w?d.locale.retry:d.locale.submit},w?"retry":"submit")}),b.jsx(qi,{open:w,children:b.jsx("span",{role:"status",className:`limr-question-result ${j?"limr-success":"limr-error"}`,children:j?d.locale.correct:d.locale.incorrect})})]}),S&&b.jsx(xx,{title:d.locale.hint,open:p,onChange:f,children:c(S.children??[])}),E&&b.jsx(xx,{title:d.locale.answer,open:y,onChange:g,children:c(E.children??[])})]})}const a=["question-content","question-hint","question-answer","question-sel-grp","question-sel"];return{...or({name:"question",streaming:t.component?void 0:{Loading:fo},component:t.component??i}),tags:["question",...a],components:{question:t.component??i,...Object.fromEntries(a.map(o=>[o,Qf]))}}}function CN(t={}){const i=({node:o,children:s,renderAttribute:c})=>b.jsxs("div",{className:"limr-extra",children:[b.jsxs("a",{className:"limr-extra-link",href:gn(o.attributes?.url),target:"_blank",rel:"noreferrer",children:[b.jsx("span",{className:"limr-underline",children:c(o.attributes?.title?"title":"url")}),o.attributes?.desc&&b.jsx("p",{children:b.jsx("span",{className:"limr-underline",children:c("desc")})})]}),s]}),a=({children:o})=>{const s=bt();return b.jsxs("aside",{className:"limr-extras",children:[b.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:s.locale.extra}),o]})};return{...or({name:"extras",streaming:t.component?void 0:{Loading:fo},component:t.component??a}),tags:["extras","extra"],components:{extras:t.component??a,extra:i}}}function Im(){return[jm(),D2(),A0(),sN(),hN(),AN(),EN(),CN(),SN(),TN(),j0(),iN(),mN(),vN()]}let RN;const Hm=L.createContext(null),Et=typeof window<"u"?L.useLayoutEffect:L.useEffect;function Nl({children:t,source:i="",streaming:a=!1,documentId:o,...s}){const c=L.useId(),u=L.useMemo(()=>{const y=s.extensions??(RN??=Im());return s.plugins?.length?[...y,...s.plugins]:y},[s.extensions,s.plugins]),d={...s,extensions:u},[p]=L.useState(()=>new sR(o??`limr-${c.replace(/[^a-z\d_-]/gi,"")}`,i,a,d)),f=L.useRef({source:i,streaming:a,config:d});return Et(()=>{const y=f.current;Object.keys({...y.config,...d}).some(x=>y.config[x]!==d[x])&&p.configure(d),(y.source!==i||y.streaming!==a)&&p.document.update(i,{streaming:a}),f.current={source:i,streaming:a,config:d}}),L.useEffect(()=>(p.start(),()=>p.dispose()),[p]),b.jsx(Hm.Provider,{value:p,children:t})}function bt(){const t=L.useContext(Hm);if(!t)throw new Error("This LiMR component needs a DocumentProvider or Reader. Markdown can also be used on its own.");return t}function Ax(t){const i=bt();return qe(i.configuration,a=>{if(a.parameters?.[t]!==void 0)return a.parameters[t];for(let o=(a.extensions?.length??0)-1;o>=0;o--){const s=a.extensions[o].parameters;if(s&&t in s)return s[t]}})}function qe(t,i){const a=L.useRef(i);a.current=i;const o=L.useRef(void 0),s=L.useCallback(()=>{const c=t.get();if(o.current&&o.current.state===c&&o.current.select===a.current)return o.current.value;const u=a.current(c);return o.current={state:c,select:a.current,value:u},u},[t]);return L.useSyncExternalStore(t.subscribe,s,s)}function I0(){const t=bt();return L.useSyncExternalStore(t.document.subscribe,t.document.getSnapshot,t.document.getSnapshot)}function Dl(t){const i=bt(),a=L.useMemo(()=>({subscribe:i.document.subscribe,get:i.document.getSnapshot}),[i]);return qe(a,t)}function MN(){return qe(bt().interaction,t=>t.selection)}function mo(){return qe(bt().configuration,t=>t.theme??"light")}function po(){return qe(bt().configuration,t=>t.appearance??"classic")}function ln(){const t=bt();return qe(t.configuration,i=>i.locale),t.locale}function Bm(){const t=bt();return L.useMemo(()=>({...t.commands,document:t.document,get signal(){return t.signal},clearSelection:()=>t.clearSelection(),scrollToHeading:i=>t.scrollToHeading(i),scrollToAnnotation:i=>t.scrollToOccurrence(i),invalidateAnnotation:i=>t.invalidateAnnotation(i)}),[t])}function qm(t,i,a,o){L.useEffect(()=>{const s=t.current;if(!s)return;let c=0;const u=new Map,d=()=>{c=0,o?.();const T=s.getBoundingClientRect(),S=window.visualViewport;let E=Math.max(T.top,S?.offsetTop??0),C=Math.min(T.bottom,(S?.offsetTop??0)+(S?.height??innerHeight));const R=i.configuration.get().scrollRoot;if(R){const I=R.getBoundingClientRect();E=Math.max(E,I.top+R.clientTop),C=Math.min(C,I.top+R.clientTop+R.clientHeight)}const _=[...s.querySelectorAll(a)].map(I=>I.getBoundingClientRect()),N=C>E&&_.some(I=>I.top<E-.5),j=C>E&&_.some(I=>I.bottom>C+.5);s.toggleAttribute("data-overflow-top",N),s.toggleAttribute("data-overflow-bottom",j);const z=(I,X)=>{const oe=`${Math.max(0,X).toFixed(2)}px`;s.style.getPropertyValue(I)!==oe&&s.style.setProperty(I,oe)};z("--limr-fade-start",E-T.top),z("--limr-fade-end",C-T.top);const B=performance.now();for(const[I,X]of u){for(const[oe,Y]of X)(Y<=B||!s.contains(I))&&X.delete(oe);X.size||u.delete(I)}u.size&&p()},p=()=>{c||(c=requestAnimationFrame(d))},f=()=>{cancelAnimationFrame(c),d()},y=T=>{const S=T.target;if(!(S instanceof Element)||!/^(top|bottom|left|right|height|max-height|min-height|width|max-width|transform|translate|grid-template-rows|padding.*|margin.*)$/.test(T.propertyName))return;const E=getComputedStyle(S),C=E.transitionProperty.split(",").map(j=>j.trim()),R=Math.max(0,C.indexOf(T.propertyName)),_=j=>{const z=j.split(","),B=z[R%z.length].trim();return parseFloat(B)*(B.endsWith("ms")?1:1e3)},N=u.get(S)??new Map;N.set(T.propertyName,performance.now()+_(E.transitionDuration)+_(E.transitionDelay)+34),u.set(S,N),p()},g=T=>{T.target instanceof Element&&u.get(T.target)?.delete(T.propertyName),p()};s.addEventListener("transitionrun",y),s.addEventListener("transitionend",g),s.addEventListener("transitioncancel",g);const x=new ResizeObserver(f);x.observe(s);const v=new MutationObserver(T=>{T.some(S=>{const E=S.target instanceof Element?S.target:S.target.parentElement;return E&&E!==s&&!E.closest(".limr-highlight-layer,.limr-paint-layer")})&&(o?f():p())});v.observe(s,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["style","class"]});const w=[i.layout.subscribe(p),i.viewport.subscribe(f),i.documentOffset.subscribe(p),i.configuration.subscribe(p)],A=T=>{const S=T.target;(S===window.document||S===window||S instanceof Element&&S.contains(s))&&f()};return window.addEventListener("scroll",A,{capture:!0,passive:!0}),window.addEventListener("resize",p),window.visualViewport?.addEventListener("resize",p),window.visualViewport?.addEventListener("scroll",f),p(),()=>{cancelAnimationFrame(c),x.disconnect(),v.disconnect(),w.forEach(T=>T()),s.removeEventListener("transitionrun",y),s.removeEventListener("transitionend",g),s.removeEventListener("transitioncancel",g),window.removeEventListener("scroll",A,!0),window.removeEventListener("resize",p),window.visualViewport?.removeEventListener("resize",p),window.visualViewport?.removeEventListener("scroll",f),s.removeAttribute("data-overflow-top"),s.removeAttribute("data-overflow-bottom"),s.style.removeProperty("--limr-fade-start"),s.style.removeProperty("--limr-fade-end")}},[t,i,a,o])}function rc({title:t,maxDepth:i=6,followActive:a=!0,topInset:o=24,updateHash:s=!1,className:c,style:u}){const d=bt(),p=po(),f=mo(),y=ln(),g=Dl(C=>C.headings);qe(d.layout,C=>C);const x=qe(d.interaction,C=>C.activeHeading),v=L.useRef(null);qm(v,d,":scope > ol");const w=L.useRef(0),A=L.useRef(void 0),T=g.filter(C=>C.level<=i&&!d.headings.get(C.id)?.closest("[inert]"));T.sort((C,R)=>{const _=d.headings.get(C.id),N=d.headings.get(R.id);return _&&N&&_!==N?_.compareDocumentPosition(N)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1:0});const S=Math.min(...T.map(C=>C.level),6);L.useEffect(()=>{if(!a||!x)return;const C=()=>{const _=v.current;if(!_||_.clientHeight===0)return;const N=Array.from(_.querySelectorAll("[data-heading]")).find(B=>B.dataset.heading===x);if(!N)return;const j=N.getBoundingClientRect().top-_.getBoundingClientRect().top+_.scrollTop-o,z=Math.max(0,Math.min(j,_.scrollHeight-_.clientHeight));Math.abs(z-_.scrollTop)>1&&e0(_,z)},R=Math.max(0,w.current-Date.now());return A.current=setTimeout(C,R),()=>clearTimeout(A.current)},[x,g,a,o]);const E=()=>{w.current=Date.now()+1200,clearTimeout(A.current)};return b.jsxs("nav",{className:`limr-toc ${c??""}`,style:u,"data-limr-theme":f,"data-limr-appearance":p,"aria-label":t??y.contents,children:[b.jsx("div",{className:"limr-toc-title",children:t??y.contents}),b.jsx("div",{className:"limr-toc-scroll",ref:v,onWheel:E,onTouchStart:E,onKeyDown:E,tabIndex:0,children:b.jsx("ol",{children:T.map(C=>b.jsx("li",{children:b.jsx("a",{"data-heading":C.id,href:`#${C.id}`,"aria-current":C.id===x?"location":void 0,style:{paddingInlineStart:12+Math.min(C.level-S,4)*14},onClick:R=>{R.preventDefault(),d.scrollToHeading(C.id),s&&history.replaceState(history.state,"",`#${C.id}`)},children:b.jsx("span",{className:"limr-underline",children:C.text})})},C.id))})})]})}function NN({annotationId:t,presentation:i,expanded:a=!0,enabled:o=!0}){const s=bt(),c=qe(s.decorations,w=>w.annotations.get(t)),u=qe(s.interaction,w=>w.editing===t),d=qe(s.configuration,()=>s.annotationTypes.get(c?.type??"citation")),p=qe(s.resourceVersions,w=>w.get(t)??0),[f,y]=L.useState({id:t,loading:!!d?.load,error:null});L.useEffect(()=>{if(!d?.load||!c||!o)return;let w=!1;y({id:t,loading:!0,error:null});const A=s.resources.acquire(s.getResourceKey(c),T=>d.load(c,{signal:T}));return A.promise.then(T=>{w||y({id:t,data:T,loading:!1,error:null})}).catch(T=>{w||y({id:t,loading:!1,error:T instanceof Error?T:new Error(String(T))})}),()=>{w=!0,A.release()}},[s,c,t,d,p,o]);const g=()=>s.invalidateAnnotation(t),x=d?.Content,v=f.id===t?f:{loading:!!d?.load,error:null,data:void 0};return c?x?b.jsx(x,{editing:u,annotation:c,data:d?.load?v.data??c.data:c.data,loading:d?.load?v.loading:!1,error:v.error,retry:g,presentation:i,expanded:a}):b.jsxs("span",{className:"limr-muted",children:[s.locale.unavailable," · ",c.type]}):b.jsxs("span",{className:"limr-muted",children:[s.locale.unavailable," · ",t]})}function H0({occurrence:t,presentation:i,expanded:a=!0,enabled:o=!0}){return b.jsx(b.Fragment,{children:t.annotationIds.map(s=>b.jsx("div",{className:"limr-annotation-entry",children:b.jsx(NN,{annotationId:s,presentation:i,expanded:a,enabled:o})},s))})}function Wf(t,i){const a=Ww(t,i),o=t.blocks.filter(u=>_t(u.range,a));let s="";const c=u=>{const d=Be(u);if(!(!_t(d,a)||["annotationReference","footnoteReference","annotationDefinition","definition"].includes(u.type)))if(u.value!==void 0){const p=Ml(t.source,u.value,d);s+=u.value.split("").filter((f,y)=>p.ends[y]>a.start&&p.starts[y]<a.end).join("")}else u.type==="image"?s+=String(u.alt??""):u.children?.forEach(c)};return o.forEach((u,d)=>{d&&(s+=" "),c(u.node)}),i.embedded||(s||=i.quote??t.source.slice(a.start,a.end)),s.replace(/\s+/g," ").trim()}const DN=(t,{activeId:i,gap:a,height:o,prioritizeActive:s})=>{const c=t.map(p=>p.anchorTop),u=t.findIndex(p=>p.id===i),d=u<0?0:u;if(!t.length)return new Map;c[d]=o===void 0?t[d].anchorTop:Math.max(0,Math.min(t[d].anchorTop,o-t[d].height));for(let p=d-1;p>=0;p--)c[p]=Math.min(t[p].anchorTop,c[p+1]-t[p].height-a);for(let p=d+1;p<t.length;p++)c[p]=Math.max(t[p].anchorTop,c[p-1]+t[p-1].height+a);if(o!==void 0&&t.reduce((p,f)=>p+f.height,a*(t.length-1))<=o){const p=s&&u>=0?d+1:0;for(let f=t.length-1;f>=p;f--)c[f]=Math.min(c[f],(f===t.length-1?o:c[f+1]-a)-t[f].height);if(p||u<0||c[0]>=0)for(let f=p;f<t.length;f++)c[f]=Math.max(c[f],f===0?0:c[f-1]+t[f-1].height+a)}return new Map(t.map((p,f)=>[p.id,c[f]]))},jN=L.memo(function({occurrence:i,annotation:a,annotations:o,reference:s,active:c,title:u,toggleLabel:d,Preview:p,activate:f}){return b.jsxs(b.Fragment,{children:[s&&b.jsx("div",{className:"limr-sidebar-reference",title:s,children:b.jsx("p",{className:"limr-sidebar-excerpt",children:s})}),b.jsxs("div",{className:"limr-sidebar-card-body",children:[b.jsxs("button",{type:"button",className:"limr-sidebar-card-heading",onClick:()=>f(i.id),"aria-expanded":c,children:[u,b.jsx("span",{className:"limr-sidebar-toggle",children:b.jsx("span",{className:"limr-button-label limr-underline",children:d},String(c))})]}),p&&a&&b.jsx(qi,{open:!c,keepMounted:!0,className:"limr-sidebar-preview-panel",children:b.jsx("div",{className:"limr-sidebar-preview",children:b.jsx(p,{annotation:a,data:a.data,occurrence:i,annotations:o,referenceText:s})})}),b.jsx(qi,{open:c,className:"limr-sidebar-expansion",children:b.jsx("div",{className:"limr-sidebar-card-content",children:b.jsx(H0,{occurrence:i,presentation:"sidebar",enabled:c})})})]})]})});function B0({sync:t="document",gap:i=14,positioner:a=DN,renderCard:o,className:s,style:c}){const u=bt(),d=I0(),p=po(),f=mo(),y=ln(),g=qe(u.decorations,re=>re),x=qe(u.interaction,re=>re.active),v=qe(u.interaction,re=>re.hovered),w=qe(u.interaction,re=>re.hoverSource),A=qe(u.interaction,re=>re.activeSource);L.useSyncExternalStore(u.configuration.subscribe,u.configuration.get,u.configuration.get);const T=L.useSyncExternalStore(u.layout.subscribe,u.layout.get,u.layout.get),S=L.useSyncExternalStore(u.viewport.subscribe,u.viewport.get,u.viewport.get),E=L.useRef(null),C=L.useRef(new Map),[R,_]=L.useState(new Map),[N,j]=L.useState(new Map),[z,B]=L.useState(new Map),[I,X]=L.useState(0),oe=L.useRef({sizes:new Map,minimum:new Map,height:0}),Y=L.useRef(0),[P,M]=L.useState(0),[V,$]=L.useState(0),[Z,me]=L.useState(null),q=L.useRef(null),[ze,ge]=L.useState(null),H=L.useMemo(()=>{const re=[...g.occurrences].sort((ue,Re)=>ue.range.start-Re.range.start||ue.range.end-Re.range.end||ue.id.localeCompare(Re.id));if(t==="none")for(const ue of g.annotations.values())ue.type!=="highlight"&&!re.some(Re=>Re.annotationIds.includes(ue.id))&&re.push({id:`unanchored-${ue.id}`,range:{start:0,end:0},annotationIds:[ue.id]});return re},[g,t]),U=L.useMemo(()=>new Map(H.map(re=>[re.id,Wf(d,re)])),[d,H]),te=L.useMemo(()=>new Map(H.map(re=>[re.id,re.annotationIds.flatMap(ue=>{const Re=g.annotations.get(ue);return Re?[Re]:[]})])),[g,H]),he=L.useCallback((re=!1)=>{const ue=new Map,Re=new Map;C.current.forEach((Te,Ie)=>{const Oe=Te.getBoundingClientRect().height;ue.set(Ie,Oe);const et=[...Te.querySelectorAll(":scope > .limr-sidebar-card-body > .limr-collapse")];Re.set(Ie,Oe-et.reduce((Ye,ht)=>Ye+ht.getBoundingClientRect().height,0))});const Se=E.current?.getBoundingClientRect().height??0,G=oe.current;if(G.height===Se&&G.sizes.size===ue.size&&[...ue].every(([Te,Ie])=>Ie===G.sizes.get(Te)&&Math.abs(Re.get(Te)-(G.minimum.get(Te)??0))<.5))return;oe.current={sizes:ue,minimum:Re,height:Se};const D=()=>{_(ue),j(Re),X(Se)};if(!re){D();return}const we=E.current;we?.setAttribute("data-resizing",""),oo.flushSync(D),cancelAnimationFrame(Y.current),Y.current=requestAnimationFrame(()=>{Y.current=requestAnimationFrame(()=>we?.removeAttribute("data-resizing"))})},[]),ve=L.useCallback(()=>he(!0),[he]);qm(E,u,":scope > .limr-sidebar-card",ve),L.useEffect(()=>{const re=new ResizeObserver(()=>he(!0));return E.current&&re.observe(E.current),C.current.forEach(ue=>re.observe(ue)),he(),()=>re.disconnect()},[H,he,z]),L.useEffect(()=>()=>cancelAnimationFrame(Y.current),[]),Et(()=>{if(t==="none"||!E.current)return;const re=E.current.getBoundingClientRect().top,ue=new Map,Re=u.getContentOffset();for(const Se of H){const G=u.anchors.get(Se.id);if(!G||G.closest("[inert]"))continue;const D=J2(u,g.referenceRanges.get(Se.id)??Se.range);ue.set(Se.id,(D||G.getBoundingClientRect()).top-re-Re)}B(Se=>Se.size===ue.size&&[...ue].every(([G,D])=>Math.abs(D-(Se.get(G)??-1/0))<.5)?Se:ue)},[u,g.referenceRanges,H,T,t]),Et(()=>{if(t!=="document"||!E.current)return;const re=u.configuration.get().scrollRoot,ue=E.current.getBoundingClientRect(),Re=Math.max(ue.top,u.getViewportTop()+(re?.clientTop??0),window.visualViewport?.offsetTop??0),Se=Math.min(ue.bottom,re?u.getViewportTop()+re.clientTop+re.clientHeight:1/0,(window.visualViewport?.offsetTop??0)+(window.visualViewport?.height??innerHeight));M(Math.max(0,Re-ue.top+(u.configuration.get().scrollOffset??24))),$(Math.max(0,Se-Re))},[u,T,S,t]),L.useEffect(()=>{const re=Re=>{if(Re.button!==0)return;const Se=Re.target;if(!(Se instanceof Element))return;const G=Se.closest(".limr-sidebar-card"),D=Se.closest("[data-limr-anchor]");if(G&&E.current?.contains(G)||D&&u.anchors.get(D.dataset.limrAnchor)===D||Se.closest(".limr-overlay-positioner,.limr-selection-toolbar"))return;const{active:we,hovered:Te}=u.interaction.get();(we||Te)&&u.activate(null)},ue=Re=>{if(Re.key!=="Escape"||Re.defaultPrevented||!u.interaction.get().active)return;u.anchors.get(u.interaction.get().active)?.focus({preventScroll:!0}),u.activate(null)};return window.document.addEventListener("pointerdown",re),window.document.addEventListener("keydown",ue),()=>{window.document.removeEventListener("pointerdown",re),window.document.removeEventListener("keydown",ue),t==="document"&&u.documentOffset.set(0)}},[u,t]);const le=H.filter(re=>t==="none"||z.has(re.id));t!=="none"&&le.sort((re,ue)=>(z.get(re.id)??0)-(z.get(ue.id)??0));const be=le.find(re=>(z.get(re.id)??0)>=P)?.id??le.at(-1)?.id??null,xe=v??x??be,de=v??x,ae=v?w:x?A:null,ye=ae==="sidebar"&&Z?.id===xe?Z:null,Ae=ye?.top;Et(()=>{const re=q.current;if(q.current=de?{id:de,top:Ae}:null,de||t!=="document"||!E.current||matchMedia("(prefers-reduced-motion: reduce)").matches){ge(null);return}if(!re)return;const ue=getComputedStyle(E.current),Re=ue.getPropertyValue("--limr-motion-slow").trim(),Se=parseFloat(Re)*(Re.endsWith("ms")?1:1e3),G=Number.isFinite(Se)?Math.max(0,Se):460;if(!G){ge(null);return}const D=E.current.animate([{},{}],{duration:G,easing:ue.getPropertyValue("--limr-ease").trim()||"ease-out"});ge({...re,progress:0});let we=0;const Te=()=>{if(D.playState==="finished"){ge(null);return}ge({...re,progress:D.effect?.getComputedTiming().progress??0}),we=requestAnimationFrame(Te)};return we=requestAnimationFrame(Te),()=>{cancelAnimationFrame(we),D.cancel()}},[de,Ae,t]);const Ne=le.map(re=>({id:re.id,anchorTop:z.get(re.id)??0,height:R.get(re.id)??80})),De={activeId:xe,gap:i,height:t==="document"&&I>0?I:void 0,prioritizeActive:!!(v||x)},Me=new Map(a(ye?Ne.map(re=>re.id===ye.id?{...re,anchorTop:ye.top}:re):Ne,De)),ce=!de&&ze;if(ce){const re=a(Ne.map(ue=>ue.id===ce.id&&ce.top!==void 0?{...ue,anchorTop:ce.top}:ue),{...De,activeId:ce.id,prioritizeActive:!0});for(const[ue,Re]of Me)Me.set(ue,Re+((re.get(ue)??Re)-Re)*(1-ce.progress))}const je=ye?z.get(ye.id)??ye.top:0,$e=t==="document"&&ye?(Me.get(ye.id)??ye.top)-je:0;Et(()=>{t==="document"&&u.documentOffset.set($e)},[u,$e,t]);const Ge=L.useCallback(re=>{if(ye?.id===re)return;const ue=C.current.get(re);if(ue&&E.current){const Re=E.current.getBoundingClientRect().top,Se=ue.getBoundingClientRect().top-Re;me({id:re,top:Se})}},[ye?.id]),W=L.useCallback(re=>{const ue=u.interaction.get(),Re=ue.hovered===re||C.current.get(re)?.matches(":hover");Ge(re),u.activate(ue.active===re?null:re,"sidebar"),Re&&u.hover(re,"sidebar")},[u,Ge]);return b.jsx("aside",{ref:E,"aria-label":y.annotations,className:`limr-sidebar ${s??""}`,"data-sync":t,"data-releasing":ce?"":void 0,"data-limr-theme":f,"data-limr-appearance":p,style:c,children:le.map(re=>{const ue=g.annotations.get(re.annotationIds[0]),Re=u.annotationTypes.get(ue?.type??"citation"),Se=x===re.id,G=Re?.sidebar,D=G?.Preview,we=ae==="marker"&&xe===re.id&&!Se?Math.max(N.get(re.id)??80,I-(z.get(re.id)??0)):I,Te=Se?Math.min(we,Math.max(N.get(re.id)??80,V||I)):we,Ie={"--limr-annotation-color":G?.color??Re?.color,"--limr-annotation-border":G?.borderColor,"--limr-annotation-title":G?.titleColor,"--limr-annotation-text":G?.textColor,"--limr-annotation-excerpt":G?.excerptColor,"--limr-annotation-preview":G?.previewColor,"--limr-sidebar-preview-lines":String(Math.max(1,Math.floor(G?.previewLines??2))),...t==="document"?{position:"absolute",top:Me.get(re.id)??0,insetInline:0,"--limr-sidebar-card-height":`${Te}px`}:{marginBlockEnd:i}},Oe=re.annotationIds.every(Ye=>u.annotationTypes.get(g.annotations.get(Ye)?.type??"")?.sidebar?.collapseOnContentClick),et=()=>W(re.id);return b.jsx("div",{ref:Ye=>{Ye?C.current.set(re.id,Ye):C.current.delete(re.id)},className:"limr-sidebar-card","data-type":ue?.type,"data-locked":ye?.id===re.id||void 0,"data-active":Se||v===re.id||void 0,"data-expanded":Se||void 0,"data-default-card":!o||void 0,"data-content-toggle":Oe||void 0,"data-citations":re.annotationIds.every(Ye=>g.annotations.get(Ye)?.type==="citation")||void 0,"data-occurrence":re.id,style:Ie,onPointerEnter:Ye=>{Ye.pointerType!=="touch"&&(Ge(re.id),u.hover(re.id,"sidebar"))},onPointerLeave:()=>{u.interaction.get().hovered===re.id&&u.interaction.get().hoverSource==="sidebar"&&u.hover(null)},onClick:Ye=>{(!Se||Oe)&&!o&&!Ye.defaultPrevented&&!Ye.target.closest('button,a,input,select,textarea,summary,[role="button"],[role="link"],[contenteditable="true"],[data-limr-card-interactive]')&&window.getSelection()?.isCollapsed!==!1&&et()},children:o?o({occurrence:re,active:Se,activate:et}):b.jsx(jN,{occurrence:re,annotation:ue,annotations:te.get(re.id),reference:U.get(re.id)??"",active:Se,title:Re?.label??ue?.type??"Reference",toggleLabel:Se?y.collapse:y.expand,Preview:D,activate:W})},re.id)})})}function oc(){return typeof window<"u"}function Ea(t){return Pm(t)?(t.nodeName||"").toLowerCase():"#document"}function yn(t){var i;return(t==null||(i=t.ownerDocument)==null?void 0:i.defaultView)||window}function Ui(t){var i;return(i=(Pm(t)?t.ownerDocument:t.document)||window.document)==null?void 0:i.documentElement}function Pm(t){return oc()?t instanceof Node||t instanceof yn(t).Node:!1}function zt(t){return oc()?t instanceof Element||t instanceof yn(t).Element:!1}function on(t){return oc()?t instanceof HTMLElement||t instanceof yn(t).HTMLElement:!1}function ju(t){return!oc()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof yn(t).ShadowRoot}function lc(t){const{overflow:i,overflowX:a,overflowY:o,display:s}=ii(t);return/auto|scroll|overlay|hidden|clip/.test(i+o+a)&&s!=="inline"&&s!=="contents"}function ON(t){return/^(table|td|th)$/.test(Ea(t))}function sc(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const LN=/transform|translate|scale|rotate|perspective|filter/,zN=/paint|layout|strict|content/,Qa=t=>!!t&&t!=="none";let ff;function Um(t){const i=zt(t)?ii(t):t;return Qa(i.transform)||Qa(i.translate)||Qa(i.scale)||Qa(i.rotate)||Qa(i.perspective)||!uc()&&(Qa(i.backdropFilter)||Qa(i.filter))||LN.test(i.willChange||"")||zN.test(i.contain||"")}function _N(t){let i=Ta(t);for(;on(i)&&!wa(i);){if(Um(i))return i;if(sc(i))return null;i=Ta(i)}return null}function uc(){return ff==null&&(ff=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),ff}function wa(t){return/^(html|body|#document)$/.test(Ea(t))}function ii(t){return yn(t).getComputedStyle(t)}function cc(t){return zt(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Ta(t){if(Ea(t)==="html")return t;const i=t.assignedSlot||t.parentNode||ju(t)&&t.host||Ui(t);return ju(i)?i.host:i}function q0(t){const i=Ta(t);return wa(i)?(t.ownerDocument||t).body:on(i)&&lc(i)?i:q0(i)}function Sa(t,i,a){var o;i===void 0&&(i=[]),a===void 0&&(a=!0);const s=q0(t),c=s===((o=t.ownerDocument)==null?void 0:o.body),u=yn(s);if(c){const d=em(u);return i.concat(u,u.visualViewport||[],lc(s)?s:[],d&&a?Sa(d):[])}else return i.concat(s,Sa(s,[],a))}function em(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}const uo=Math.min,Hi=Math.max,Ou=Math.round,fu=Math.floor,Bi=t=>({x:t,y:t}),IN={left:"right",right:"left",bottom:"top",top:"bottom"};function HN(t,i,a){return Hi(t,uo(i,a))}function jl(t,i){return typeof t=="function"?t(i):t}function ar(t){return t.split("-")[0]}function Ol(t){return t.split("-")[1]}function P0(t){return t==="x"?"y":"x"}function U0(t){return t==="y"?"height":"width"}function Ii(t){const i=t[0];return i==="t"||i==="b"?"y":"x"}function F0(t){return P0(Ii(t))}function BN(t,i,a){a===void 0&&(a=!1);const o=Ol(t),s=F0(t),c=U0(s);let u=s==="x"?o===(a?"end":"start")?"right":"left":o==="start"?"bottom":"top";return i.reference[c]>i.floating[c]&&(u=Lu(u)),[u,Lu(u)]}function qN(t){const i=Lu(t);return[tm(t),i,tm(i)]}function tm(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const Ex=["left","right"],Cx=["right","left"],PN=["top","bottom"],UN=["bottom","top"];function FN(t,i,a){switch(t){case"top":case"bottom":return a?i?Cx:Ex:i?Ex:Cx;case"left":case"right":return i?PN:UN;default:return[]}}function VN(t,i,a,o){const s=Ol(t);let c=FN(ar(t),a==="start",o);return s&&(c=c.map(u=>u+"-"+s),i&&(c=c.concat(c.map(tm)))),c}function Lu(t){const i=ar(t);return IN[i]+t.slice(i.length)}function $N(t){var i,a,o,s;return{top:(i=t.top)!=null?i:0,right:(a=t.right)!=null?a:0,bottom:(o=t.bottom)!=null?o:0,left:(s=t.left)!=null?s:0}}function GN(t){return typeof t!="number"?$N(t):{top:t,right:t,bottom:t,left:t}}function zu(t){const{x:i,y:a,width:o,height:s}=t;return{width:o,height:s,top:a,left:i,right:i+o,bottom:a+s,x:i,y:a}}var YN=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","area[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],_u=YN.join(","),V0=typeof Element>"u",co=V0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Iu=!V0&&Element.prototype.getRootNode?function(t){var i;return t==null||(i=t.getRootNode)===null||i===void 0?void 0:i.call(t)}:function(t){return t?.ownerDocument},Hu=function(i,a){var o;a===void 0&&(a=!0);var s=i==null||(o=i.getAttribute)===null||o===void 0?void 0:o.call(i,"inert"),c=s===""||s==="true",u=c||a&&i&&(typeof i.closest=="function"?i.closest("[inert]"):Hu(i.parentNode));return u},JN=function(i){var a,o=i==null||(a=i.getAttribute)===null||a===void 0?void 0:a.call(i,"contenteditable");return o===""||o==="true"},$0=function(i,a,o){if(Hu(i))return[];var s=Array.prototype.slice.apply(i.querySelectorAll(_u));return a&&co.call(i,_u)&&s.unshift(i),s=s.filter(o),s},Bu=function(i,a,o){for(var s=[],c=Array.from(i);c.length;){var u=c.shift();if(!Hu(u,!1))if(u.tagName==="SLOT"){var d=u.assignedElements(),p=d.length?d:u.children,f=Bu(p,!0,o);o.flatten?s.push.apply(s,f):s.push({scopeParent:u,candidates:f})}else{var y=co.call(u,_u);y&&o.filter(u)&&(a||!i.includes(u))&&s.push(u);var g=u.shadowRoot||typeof o.getShadowRoot=="function"&&o.getShadowRoot(u),x=!Hu(g,!1)&&(!o.shadowRootFilter||o.shadowRootFilter(u));if(g&&x){var v=Bu(g===!0?u.children:g.children,!0,o);o.flatten?s.push.apply(s,v):s.push({scopeParent:u,candidates:v})}else c.unshift.apply(c,u.children)}}return s},G0=function(i){return!isNaN(parseInt(i.getAttribute("tabindex"),10))},Y0=function(i){if(!i)throw new Error("No node provided");return i.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(i.tagName)||JN(i))&&!G0(i)?0:i.tabIndex},XN=function(i,a){var o=Y0(i);return o<0&&a&&!G0(i)?0:o},ZN=function(i,a){return i.tabIndex===a.tabIndex?i.documentOrder-a.documentOrder:i.tabIndex-a.tabIndex},J0=function(i){return i.tagName==="INPUT"},KN=function(i){return J0(i)&&i.type==="hidden"},QN=function(i){var a=i.tagName==="DETAILS"&&Array.prototype.slice.apply(i.children).some(function(o){return o.tagName==="SUMMARY"});return a},WN=function(i,a){for(var o=0;o<i.length;o++)if(i[o].checked&&i[o].form===a)return i[o]},eD=function(i){if(!i.name)return!0;var a=i.form||Iu(i),o=function(d){return a.querySelectorAll('input[type="radio"][name="'+d+'"]')},s;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")s=o(window.CSS.escape(i.name));else try{s=o(i.name)}catch(u){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",u.message),!1}var c=WN(s,i.form);return!c||c===i},tD=function(i){return J0(i)&&i.type==="radio"},nD=function(i){return tD(i)&&!eD(i)},iD=function(i){var a,o=i&&Iu(i),s=(a=o)===null||a===void 0?void 0:a.host,c=!1;if(o&&o!==i){var u,d,p;for(c=!!((u=s)!==null&&u!==void 0&&(d=u.ownerDocument)!==null&&d!==void 0&&d.contains(s)||i!=null&&(p=i.ownerDocument)!==null&&p!==void 0&&p.contains(i));!c&&s;){var f,y,g;o=Iu(s),s=(f=o)===null||f===void 0?void 0:f.host,c=!!((y=s)!==null&&y!==void 0&&(g=y.ownerDocument)!==null&&g!==void 0&&g.contains(s))}}return c},Rx=function(i){var a=i.getBoundingClientRect(),o=a.width,s=a.height;return o===0&&s===0},aD=function(i,a){var o=a.displayCheck,s=a.getShadowRoot;if(o==="full-native"&&"checkVisibility"in i){var c=i.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!c}var u=getComputedStyle(i),d=u.visibility;if(d==="hidden"||d==="collapse")return!0;var p=co.call(i,"details>summary:first-of-type"),f=p?i.parentElement:i;if(co.call(f,"details:not([open]) *"))return!0;if(!o||o==="full"||o==="full-native"||o==="legacy-full"){if(typeof s=="function"){for(var y=i;i;){var g=i.parentElement,x=Iu(i);if(g&&!g.shadowRoot&&s(g)===!0)return Rx(i);i.assignedSlot?i=i.assignedSlot:!g&&x!==i.ownerDocument?i=x.host:i=g}i=y}if(iD(i))return!i.getClientRects().length;if(o!=="legacy-full")return!0}else if(o==="non-zero-area")return Rx(i);return!1},rD=function(i){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(i.tagName))for(var a=i.parentElement;a;){if(a.tagName==="FIELDSET"&&a.disabled){for(var o=0;o<a.children.length;o++){var s=a.children.item(o);if(s.tagName==="LEGEND")return co.call(a,"fieldset[disabled] *")?!0:!s.contains(i)}return!0}a=a.parentElement}return!1},nm=function(i,a){return!(a.disabled||KN(a)||aD(a,i)||QN(a)||rD(a))},im=function(i,a){return!(nD(a)||Y0(a)<0||!nm(i,a))},oD=function(i){var a=parseInt(i.getAttribute("tabindex"),10);return!!(isNaN(a)||a>=0)},X0=function(i){var a=[],o=[];return i.forEach(function(s,c){var u=!!s.scopeParent,d=u?s.scopeParent:s,p=XN(d,u),f=u?X0(s.candidates):d;p===0?u?a.push.apply(a,f):a.push(d):o.push({documentOrder:c,tabIndex:p,item:s,isScope:u,content:f})}),o.sort(ZN).reduce(function(s,c){return c.isScope?s.push.apply(s,c.content):s.push(c.content),s},[]).concat(a)},dc=function(i,a){a=a||{};var o;return a.getShadowRoot?o=Bu([i],a.includeContainer,{filter:im.bind(null,a),flatten:!1,getShadowRoot:a.getShadowRoot,shadowRootFilter:oD}):o=$0(i,a.includeContainer,im.bind(null,a)),X0(o)},lD=function(i,a){a=a||{};var o;return a.getShadowRoot?o=Bu([i],a.includeContainer,{filter:nm.bind(null,a),flatten:!0,getShadowRoot:a.getShadowRoot}):o=$0(i,a.includeContainer,nm.bind(null,a)),o},Z0=function(i,a){if(a=a||{},!i)throw new Error("No node provided");return co.call(i,_u)===!1?!1:im(a,i)};function K0(){const t=navigator.userAgentData;return t!=null&&t.platform?t.platform:navigator.platform}function Q0(){const t=navigator.userAgentData;return t&&Array.isArray(t.brands)?t.brands.map(i=>{let{brand:a,version:o}=i;return a+"/"+o}).join(" "):navigator.userAgent}function sD(){return/apple/i.test(navigator.vendor)}function am(){const t=/android/i;return t.test(K0())||t.test(Q0())}function uD(){return Q0().includes("jsdom/")}const Mx="data-floating-ui-focusable",cD="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function eo(t){let i=t.activeElement;for(;((a=i)==null||(a=a.shadowRoot)==null?void 0:a.activeElement)!=null;){var a;i=i.shadowRoot.activeElement}return i}function Nn(t,i){if(!t||!i)return!1;const a=i.getRootNode==null?void 0:i.getRootNode();if(t.contains(i))return!0;if(a&&ju(a)){let o=i;for(;o;){if(t===o)return!0;o=o.parentNode||o.host}}return!1}function ba(t){return"composedPath"in t?t.composedPath()[0]:t.target}function mf(t,i){if(i==null)return!1;if("composedPath"in t)return t.composedPath().includes(i);const a=t;return a.target!=null&&i.contains(a.target)}function dD(t){return t.matches("html,body")}function Qn(t){return t?.ownerDocument||document}function hD(t){return on(t)&&t.matches(cD)}function Nx(t){return t?t.getAttribute("role")==="combobox"&&hD(t):!1}function rm(t){return t?t.hasAttribute(Mx)?t:t.querySelector("["+Mx+"]")||t:null}function no(t,i,a){return a===void 0&&(a=!0),t.filter(s=>{var c;return s.parentId===i&&(!a||((c=s.context)==null?void 0:c.open))}).flatMap(s=>[s,...no(t,s.id,a)])}function Dx(t,i){var a;let o=[],s=(a=t.find(c=>c.id===i))==null?void 0:a.parentId;for(;s;){const c=t.find(u=>u.id===s);s=c?.parentId,c&&(o=o.concat(c))}return o}function pf(t){t.preventDefault(),t.stopPropagation()}function fD(t){return"nativeEvent"in t}function mD(t){return t.mozInputSource===0&&t.isTrusted?!0:am()&&t.pointerType?t.type==="click"&&t.buttons===1:t.detail===0&&!t.pointerType}function pD(t){return uD()?!1:!am()&&t.width===0&&t.height===0||am()&&t.width===1&&t.height===1&&t.pressure===0&&t.detail===0&&t.pointerType==="mouse"||t.width<1&&t.height<1&&t.pressure===0&&t.detail===0&&t.pointerType==="touch"}var gD=typeof document<"u",yD=function(){},Dn=gD?L.useLayoutEffect:yD;const bD={...Dw};function gf(t){const i=L.useRef(t);return Dn(()=>{i.current=t}),i}const vD=bD.useInsertionEffect,xD=vD||(t=>t());function yi(t){const i=L.useRef(()=>{});return xD(()=>{i.current=t}),L.useCallback(function(){for(var a=arguments.length,o=new Array(a),s=0;s<a;s++)o[s]=arguments[s];return i.current==null?void 0:i.current(...o)},[])}const Ll=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function W0(t,i){const a=dc(t,Ll()),o=a.length;if(o===0)return;const s=eo(Qn(t)),c=a.indexOf(s),u=c===-1?i===1?0:o-1:c+i;return a[u]}function e1(t){return W0(Qn(t).body,1)||t}function t1(t){return W0(Qn(t).body,-1)||t}function wl(t,i){const a=i||t.currentTarget,o=t.relatedTarget;return!o||!Nn(a,o)}function wD(t){dc(t,Ll()).forEach(a=>{a.dataset.tabindex=a.getAttribute("tabindex")||"",a.setAttribute("tabindex","-1")})}function jx(t){t.querySelectorAll("[data-tabindex]").forEach(a=>{const o=a.dataset.tabindex;delete a.dataset.tabindex,o?a.setAttribute("tabindex",o):a.removeAttribute("tabindex")})}function Ox(t,i,a){let{reference:o,floating:s}=t;const c=Ii(i),u=F0(i),d=U0(u),p=ar(i),f=c==="y",y=o.x+o.width/2-s.width/2,g=o.y+o.height/2-s.height/2,x=o[d]/2-s[d]/2;let v;switch(p){case"top":v={x:y,y:o.y-s.height};break;case"bottom":v={x:y,y:o.y+o.height};break;case"right":v={x:o.x+o.width,y:g};break;case"left":v={x:o.x-s.width,y:g};break;default:v={x:o.x,y:o.y}}const w=Ol(i);return w&&(v[u]+=x*(w==="end"?1:-1)*(a&&f?-1:1)),v}async function SD(t,i){var a;i===void 0&&(i={});const{x:o,y:s,platform:c,rects:u,elements:d,strategy:p}=t,{boundary:f="clippingAncestors",rootBoundary:y="viewport",elementContext:g="floating",altBoundary:x=!1,padding:v=0}=jl(i,t),w=GN(v),T=d[x?g==="floating"?"reference":"floating":g],S=zu(await c.getClippingRect({element:(a=await(c.isElement==null?void 0:c.isElement(T)))==null||a?T:T.contextElement||await(c.getDocumentElement==null?void 0:c.getDocumentElement(d.floating)),boundary:f,rootBoundary:y,strategy:p})),E=g==="floating"?{x:o,y:s,width:u.floating.width,height:u.floating.height}:u.reference,C=await(c.getOffsetParent==null?void 0:c.getOffsetParent(d.floating)),R=await(c.isElement==null?void 0:c.isElement(C))&&await(c.getScale==null?void 0:c.getScale(C))||{x:1,y:1},_=zu(c.convertOffsetParentRelativeRectToViewportRelativeRect?await c.convertOffsetParentRelativeRectToViewportRelativeRect({elements:d,rect:E,offsetParent:C,strategy:p}):E);return{top:(S.top-_.top+w.top)/R.y,bottom:(_.bottom-S.bottom+w.bottom)/R.y,left:(S.left-_.left+w.left)/R.x,right:(_.right-S.right+w.right)/R.x}}const kD=50,TD=async(t,i,a)=>{const{placement:o="bottom",strategy:s="absolute",middleware:c=[],platform:u}=a,d=u.detectOverflow?u:{...u,detectOverflow:SD},p=await(u.isRTL==null?void 0:u.isRTL(i));let f=await u.getElementRects({reference:t,floating:i,strategy:s}),{x:y,y:g}=Ox(f,o,p),x=o,v=0;const w={};for(let A=0;A<c.length;A++){const T=c[A];if(!T)continue;const{name:S,fn:E}=T,{x:C,y:R,data:_,reset:N}=await E({x:y,y:g,initialPlacement:o,placement:x,strategy:s,middlewareData:w,rects:f,platform:d,elements:{reference:t,floating:i}});y=C??y,g=R??g,w[S]={...w[S],..._},N&&v<kD&&(v++,typeof N=="object"&&(N.placement&&(x=N.placement),N.rects&&(f=N.rects===!0?await u.getElementRects({reference:t,floating:i,strategy:s}):N.rects),{x:y,y:g}=Ox(f,x,p)),A=-1)}return{x:y,y:g,placement:x,strategy:s,middlewareData:w}},AD=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(i){var a,o;const{placement:s,middlewareData:c,rects:u,initialPlacement:d,platform:p,elements:f}=i,{mainAxis:y=!0,crossAxis:g=!0,fallbackPlacements:x,fallbackStrategy:v="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:A=!0,...T}=jl(t,i);if((a=c.arrow)!=null&&a.alignmentOffset)return{};const S=ar(s),E=Ii(d),C=ar(d)===d,R=await(p.isRTL==null?void 0:p.isRTL(f.floating)),_=x||(C||!A?[Lu(d)]:qN(d)),N=w!=="none";!x&&N&&_.push(...VN(d,A,w,R));const j=[d,..._],z=await p.detectOverflow(i,T),B=[];let I=((o=c.flip)==null?void 0:o.overflows)||[];if(y&&B.push(z[S]),g){const P=BN(s,u,R);B.push(z[P[0]],z[P[1]])}if(I=[...I,{placement:s,overflows:B}],!B.every(P=>P<=0)){var X,oe;const P=(((X=c.flip)==null?void 0:X.index)||0)+1,M=j[P];if(M&&(!(g==="alignment"?E!==Ii(M):!1)||I.every(Z=>Ii(Z.placement)===E?Z.overflows[0]>0:!0)))return{data:{index:P,overflows:I},reset:{placement:M}};let V=(oe=I.filter($=>$.overflows[0]<=0).sort(($,Z)=>$.overflows[1]-Z.overflows[1])[0])==null?void 0:oe.placement;if(!V)switch(v){case"bestFit":{var Y;const $=(Y=I.filter(Z=>{if(N){const me=Ii(Z.placement);return me===E||me==="y"}return!0}).map(Z=>[Z.placement,Z.overflows.filter(me=>me>0).reduce((me,q)=>me+q,0)]).sort((Z,me)=>Z[1]-me[1])[0])==null?void 0:Y[0];$&&(V=$);break}case"initialPlacement":V=d;break}if(s!==V)return{reset:{placement:V}}}return{}}}},ED=new Set(["left","top"]);async function CD(t,i){const{placement:a,platform:o,elements:s}=t,c=await(o.isRTL==null?void 0:o.isRTL(s.floating)),u=ar(a),d=Ol(a),p=Ii(a)==="y",f=ED.has(u)?-1:1,y=c&&p?-1:1,g=jl(i,t);let{mainAxis:x,crossAxis:v,alignmentAxis:w}=typeof g=="number"?{mainAxis:g,crossAxis:0,alignmentAxis:null}:{mainAxis:g.mainAxis||0,crossAxis:g.crossAxis||0,alignmentAxis:g.alignmentAxis};return d&&typeof w=="number"&&(v=d==="end"?w*-1:w),p?{x:v*y,y:x*f}:{x:x*f,y:v*y}}const RD=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(i){var a,o;const{x:s,y:c,placement:u,middlewareData:d}=i,p=await CD(i,t);return u===((a=d.offset)==null?void 0:a.placement)&&(o=d.arrow)!=null&&o.alignmentOffset?{}:{x:s+p.x,y:c+p.y,data:{...p,placement:u}}}}},MD=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(i){const{x:a,y:o,placement:s,platform:c}=i,{mainAxis:u=!0,crossAxis:d=!1,limiter:p={fn:E=>{let{x:C,y:R}=E;return{x:C,y:R}}},...f}=jl(t,i),y={x:a,y:o},g=await c.detectOverflow(i,f),x=Ii(s),v=P0(x);let w=y[v],A=y[x];const T=(E,C)=>HN(C+g[E==="y"?"top":"left"],C,C-g[E==="y"?"bottom":"right"]);u&&(w=T(v,w)),d&&(A=T(x,A));const S=p.fn({...i,[v]:w,[x]:A});return{...S,data:{x:S.x-a,y:S.y-o,enabled:{[v]:u,[x]:d}}}}}},ND=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(i){const{placement:a,rects:o,platform:s,elements:c}=i,{apply:u=()=>{},...d}=jl(t,i),p=await s.detectOverflow(i,d),f=ar(a),y=Ol(a),g=Ii(a)==="y",{width:x,height:v}=o.floating;let w,A;f==="top"||f==="bottom"?(w=f,A=y===(await(s.isRTL==null?void 0:s.isRTL(c.floating))?"start":"end")?"left":"right"):(A=f,w=y==="end"?"top":"bottom");const T=v-p.top-p.bottom,S=x-p.left-p.right,E=uo(v-p[w],T),C=uo(x-p[A],S),R=i.middlewareData.shift,_=!R;let N=E,j=C;R!=null&&R.enabled.x&&(j=S),R!=null&&R.enabled.y&&(N=T),_&&!y&&(g?j=x-2*Hi(p.left,p.right):N=v-2*Hi(p.top,p.bottom)),await u({...i,availableWidth:j,availableHeight:N});const z=await s.getDimensions(c.floating);return x!==z.width||v!==z.height?{reset:{rects:!0}}:{}}}};function n1(t){const i=ii(t);let a=parseFloat(i.width)||0,o=parseFloat(i.height)||0;const s=on(t),c=s?t.offsetWidth:a,u=s?t.offsetHeight:o,d=Ou(a)!==c||Ou(o)!==u;return d&&(a=c,o=u),{width:a,height:o,$:d}}function Fm(t){return zt(t)?t:t.contextElement}function io(t){const i=Fm(t);if(!on(i))return Bi(1);const a=i.getBoundingClientRect(),{width:o,height:s,$:c}=n1(i);let u=(c?Ou(a.width):a.width)/o,d=(c?Ou(a.height):a.height)/s;return(!u||!Number.isFinite(u))&&(u=1),(!d||!Number.isFinite(d))&&(d=1),{x:u,y:d}}const DD=Bi(0);function i1(t){const i=yn(t);return!uc()||!i.visualViewport?DD:{x:i.visualViewport.offsetLeft,y:i.visualViewport.offsetTop}}function jD(t,i,a){return i===void 0&&(i=!1),!!a&&i&&a===yn(t)}function rr(t,i,a,o){i===void 0&&(i=!1),a===void 0&&(a=!1);const s=t.getBoundingClientRect(),c=Fm(t);let u=Bi(1);i&&(o?zt(o)&&(u=io(o)):u=io(t));const d=jD(c,a,o)?i1(c):Bi(0);let p=(s.left+d.x)/u.x,f=(s.top+d.y)/u.y,y=s.width/u.x,g=s.height/u.y;if(c&&o){const x=yn(c),v=zt(o)?yn(o):o;let w=x,A=em(w);for(;A&&v!==w;){const T=io(A),S=A.getBoundingClientRect(),E=ii(A),C=S.left+(A.clientLeft+parseFloat(E.paddingLeft))*T.x,R=S.top+(A.clientTop+parseFloat(E.paddingTop))*T.y;p*=T.x,f*=T.y,y*=T.x,g*=T.y,p+=C,f+=R,w=yn(A),A=em(w)}}return zu({width:y,height:g,x:p,y:f})}function hc(t,i){const a=cc(t).scrollLeft;return i?i.left+a:rr(Ui(t)).left+a}function a1(t,i){const a=t.getBoundingClientRect(),o=a.left+i.scrollLeft-hc(t,a),s=a.top+i.scrollTop;return{x:o,y:s}}function OD(t){let{elements:i,rect:a,offsetParent:o,strategy:s}=t;const c=s==="fixed",u=Ui(o),d=i?sc(i.floating):!1;if(o===u||d&&c)return a;let p={scrollLeft:0,scrollTop:0},f=Bi(1);const y=Bi(0),g=on(o);if((g||!c)&&((Ea(o)!=="body"||lc(u))&&(p=cc(o)),g)){const v=rr(o);f=io(o),y.x=v.x+o.clientLeft,y.y=v.y+o.clientTop}const x=u&&!g&&!c?a1(u,p):Bi(0);return{width:a.width*f.x,height:a.height*f.y,x:a.x*f.x-p.scrollLeft*f.x+y.x+x.x,y:a.y*f.y-p.scrollTop*f.y+y.y+x.y}}function LD(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function zD(t){const i=cc(t),a=t.ownerDocument.body,o=Hi(t.scrollWidth,t.clientWidth,a.scrollWidth,a.clientWidth),s=Hi(t.scrollHeight,t.clientHeight,a.scrollHeight,a.clientHeight);let c=-i.scrollLeft+hc(t);const u=-i.scrollTop;return ii(a).direction==="rtl"&&(c+=Hi(t.clientWidth,a.clientWidth)-o),{width:o,height:s,x:c,y:u}}const _D=25;function ID(t,i,a){a===void 0&&(a="viewport");const o=a==="layoutViewport",s=yn(t),c=Ui(t),u=s.visualViewport;let d=c.clientWidth,p=c.clientHeight,f=0,y=0;if(u){const x=!uc()||i==="fixed";o?x||(f=-u.offsetLeft,y=-u.offsetTop):(d=u.width,p=u.height,x&&(f=u.offsetLeft,y=u.offsetTop))}if(hc(c)<=0){const x=c.ownerDocument,v=x.body,w=getComputedStyle(v),A=x.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,T=Math.abs(c.clientWidth-v.clientWidth-A),S=getComputedStyle(c).scrollbarGutter==="stable both-edges"?T/2:T;S<=_D&&(d-=S)}return{width:d,height:p,x:f,y}}function HD(t,i){const a=rr(t,!0,i==="fixed"),o=a.top+t.clientTop,s=a.left+t.clientLeft,c=io(t),u=t.clientWidth*c.x,d=t.clientHeight*c.y,p=s*c.x,f=o*c.y;return{width:u,height:d,x:p,y:f}}function Lx(t,i,a){let o;if(i==="viewport"||i==="layoutViewport")o=ID(t,a,i);else if(i==="document")o=zD(Ui(t));else if(zt(i))o=HD(i,a);else{const s=i1(t);o={x:i.x-s.x,y:i.y-s.y,width:i.width,height:i.height}}return zu(o)}function BD(t,i){const a=i.get(t);if(a)return a;let o=Sa(t,[],!1).filter(d=>zt(d)&&Ea(d)!=="body"),s=null;const c=ii(t).position==="fixed";let u=c?Ta(t):t;for(;zt(u)&&!wa(u);){const d=ii(u),p=Um(u),f=s?s.position:c?"fixed":"";!p&&(f==="fixed"||f==="absolute"&&d.position==="static")?o=o.filter(g=>g!==u):s=d,u=Ta(u)}return i.set(t,o),o}function qD(t){let{element:i,boundary:a,rootBoundary:o,strategy:s}=t;const u=[...a==="clippingAncestors"?sc(i)?[]:BD(i,this._c):[].concat(a),o],d=Lx(i,u[0],s);let p=d.top,f=d.right,y=d.bottom,g=d.left;for(let x=1;x<u.length;x++){const v=Lx(i,u[x],s);p=Hi(v.top,p),f=uo(v.right,f),y=uo(v.bottom,y),g=Hi(v.left,g)}return{width:f-g,height:y-p,x:g,y:p}}function PD(t){const{width:i,height:a}=n1(t);return{width:i,height:a}}function UD(t,i,a){const o=on(i),s=Ui(i),c=a==="fixed",u=rr(t,!0,c,i);let d={scrollLeft:0,scrollTop:0};const p=Bi(0);if((o||!c)&&((Ea(i)!=="body"||lc(s))&&(d=cc(i)),o)){const x=rr(i,!0,c,i);p.x=x.x+i.clientLeft,p.y=x.y+i.clientTop}!o&&s&&(p.x=hc(s));const f=s&&!o&&!c?a1(s,d):Bi(0),y=u.left+d.scrollLeft-p.x-f.x,g=u.top+d.scrollTop-p.y-f.y;return{x:y,y:g,width:u.width,height:u.height}}function yf(t){return ii(t).position==="static"}function zx(t,i){if(!on(t)||ii(t).position==="fixed")return null;if(i)return i(t);let a=t.offsetParent;return Ui(t)===a&&(a=a.ownerDocument.body),a}function r1(t,i){const a=yn(t);if(sc(t))return a;if(!on(t)){let s=Ta(t);for(;s&&!wa(s);){if(zt(s)&&!yf(s))return s;s=Ta(s)}return a}let o=zx(t,i);for(;o&&ON(o)&&yf(o);)o=zx(o,i);return o&&wa(o)&&yf(o)&&!Um(o)?a:o||_N(t)||a}const FD=async function(t){const i=this.getOffsetParent||r1,a=this.getDimensions,o=await a(t.floating);return{reference:UD(t.reference,await i(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function VD(t){return ii(t).direction==="rtl"}const $D={convertOffsetParentRelativeRectToViewportRelativeRect:OD,getDocumentElement:Ui,getClippingRect:qD,getOffsetParent:r1,getElementRects:FD,getClientRects:LD,getDimensions:PD,getScale:io,isElement:zt,isRTL:VD};function o1(t,i){return t.x===i.x&&t.y===i.y&&t.width===i.width&&t.height===i.height}function GD(t,i,a){let o=null,s;const c=Ui(t);function u(){var y;clearTimeout(s),(y=o)==null||y.disconnect(),o=null}function d(y,g){y===void 0&&(y=!1),g===void 0&&(g=1),u();const x=t.getBoundingClientRect(),{left:v,top:w,width:A,height:T}=x;if(y||i(),!A||!T)return;const S=fu(w),E=fu(c.clientWidth-(v+A)),C=fu(c.clientHeight-(w+T)),R=fu(v),N={rootMargin:-S+"px "+-E+"px "+-C+"px "+-R+"px",threshold:Hi(0,uo(1,g))||1};let j=!0;function z(B){const I=B[0].intersectionRatio;if(!o1(x,t.getBoundingClientRect()))return d();if(I!==g){if(!j)return d();I?d(!1,I):s=setTimeout(()=>{d(!1,1e-7)},1e3)}j=!1}try{o=new IntersectionObserver(z,{...N,root:c.ownerDocument})}catch{o=new IntersectionObserver(z,N)}o.observe(t)}const p=yn(t),f=()=>d(a);return p.addEventListener("resize",f),d(!0),()=>{p.removeEventListener("resize",f),u()}}function l1(t,i,a,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:c=!0,elementResize:u=typeof ResizeObserver=="function",layoutShift:d=typeof IntersectionObserver=="function",animationFrame:p=!1}=o,f=Fm(t),y=s||c?[...f?Sa(f):[],...i?Sa(i):[]]:[];y.forEach(S=>{s&&S.addEventListener("scroll",a),c&&S.addEventListener("resize",a)});const g=f&&d?GD(f,a,c):null;let x=-1,v=null;u&&(v=new ResizeObserver(S=>{let[E]=S;E&&E.target===f&&v&&i&&(v.unobserve(i),cancelAnimationFrame(x),x=requestAnimationFrame(()=>{var C;(C=v)==null||C.observe(i)})),a()}),f&&!p&&v.observe(f),i&&v.observe(i));let w,A=p?rr(t):null;p&&T();function T(){const S=rr(t);A&&!o1(A,S)&&a(),A=S,w=requestAnimationFrame(T)}return a(),()=>{var S;y.forEach(E=>{s&&E.removeEventListener("scroll",a),c&&E.removeEventListener("resize",a)}),g?.(),(S=v)==null||S.disconnect(),v=null,p&&cancelAnimationFrame(w)}}const YD=RD,JD=MD,XD=AD,ZD=ND,KD=(t,i,a)=>{const o=new Map,s=a??{},c={...$D,...s.platform,_c:o};return TD(t,i,{...s,platform:c})};var QD=typeof document<"u",WD=function(){},Su=QD?L.useLayoutEffect:WD;function qu(t,i){if(t===i)return!0;if(typeof t!=typeof i)return!1;if(typeof t=="function"&&t.toString()===i.toString())return!0;let a,o,s;if(t&&i&&typeof t=="object"){if(Array.isArray(t)){if(a=t.length,a!==i.length)return!1;for(o=a;o--!==0;)if(!qu(t[o],i[o]))return!1;return!0}if(s=Object.keys(t),a=s.length,a!==Object.keys(i).length)return!1;for(o=a;o--!==0;)if(!{}.hasOwnProperty.call(i,s[o]))return!1;for(o=a;o--!==0;){const c=s[o];if(!(c==="_owner"&&t.$$typeof)&&!qu(t[c],i[c]))return!1}return!0}return t!==t&&i!==i}function s1(t){return typeof window>"u"?1:(t.ownerDocument.defaultView||window).devicePixelRatio||1}function _x(t,i){const a=s1(t);return Math.round(i*a)/a}function bf(t){const i=L.useRef(t);return Su(()=>{i.current=t}),i}function ej(t){t===void 0&&(t={});const{placement:i="bottom",strategy:a="absolute",middleware:o=[],platform:s,elements:{reference:c,floating:u}={},transform:d=!0,whileElementsMounted:p,open:f}=t,[y,g]=L.useState({x:0,y:0,strategy:a,placement:i,middlewareData:{},isPositioned:!1}),[x,v]=L.useState(o);qu(x,o)||v(o);const[w,A]=L.useState(null),[T,S]=L.useState(null),E=L.useCallback(Z=>{Z!==N.current&&(N.current=Z,A(Z))},[]),C=L.useCallback(Z=>{Z!==j.current&&(j.current=Z,S(Z))},[]),R=c||w,_=u||T,N=L.useRef(null),j=L.useRef(null),z=L.useRef(y),B=p!=null,I=bf(p),X=bf(s),oe=bf(f),Y=L.useCallback(()=>{if(!N.current||!j.current)return;const Z={placement:i,strategy:a,middleware:x};X.current&&(Z.platform=X.current),KD(N.current,j.current,Z).then(me=>{const q={...me,isPositioned:oe.current!==!1};P.current&&!qu(z.current,q)&&(z.current=q,oo.flushSync(()=>{g(q)}))})},[x,i,a,X,oe]);Su(()=>{f===!1&&z.current.isPositioned&&(z.current.isPositioned=!1,g(Z=>({...Z,isPositioned:!1})))},[f]);const P=L.useRef(!1);Su(()=>(P.current=!0,()=>{P.current=!1}),[]),Su(()=>{if(R&&(N.current=R),_&&(j.current=_),R&&_){if(I.current)return I.current(R,_,Y);Y()}},[R,_,Y,I,B]);const M=L.useMemo(()=>({reference:N,floating:j,setReference:E,setFloating:C}),[E,C]),V=L.useMemo(()=>({reference:R,floating:_}),[R,_]),$=L.useMemo(()=>{const Z={position:a,left:0,top:0};if(!V.floating)return Z;const me=_x(V.floating,y.x),q=_x(V.floating,y.y);return d?{...Z,transform:"translate("+me+"px, "+q+"px)",...s1(V.floating)>=1.5&&{willChange:"transform"}}:{position:a,left:me,top:q}},[a,d,V.floating,y.x,y.y]);return L.useMemo(()=>({...y,update:Y,refs:M,elements:V,floatingStyles:$}),[y,Y,M,V,$])}const u1=(t,i)=>{const a=YD(t);return{name:a.name,fn:a.fn,options:[t,i]}},c1=(t,i)=>{const a=JD(t);return{name:a.name,fn:a.fn,options:[t,i]}},tj=(t,i)=>{const a=XD(t);return{name:a.name,fn:a.fn,options:[t,i]}},nj=(t,i)=>{const a=ZD(t);return{name:a.name,fn:a.fn,options:[t,i]}},ij="data-floating-ui-focusable",Ix="active",Hx="selected",aj={...Dw};let Bx=!1,rj=0;const qx=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+rj++;function oj(){const[t,i]=L.useState(()=>Bx?qx():void 0);return Dn(()=>{t==null&&i(qx())},[]),L.useEffect(()=>{Bx=!0},[]),t}const lj=aj.useId,Vm=lj||oj;function sj(){const t=new Map;return{emit(i,a){var o;(o=t.get(i))==null||o.forEach(s=>s(a))},on(i,a){t.has(i)||t.set(i,new Set),t.get(i).add(a)},off(i,a){var o;(o=t.get(i))==null||o.delete(a)}}}const uj=L.createContext(null),cj=L.createContext(null),d1=()=>{var t;return((t=L.useContext(uj))==null?void 0:t.id)||null},$m=()=>L.useContext(cj);function El(t){return"data-floating-ui-"+t}function dj(t){t.current!==-1&&(clearTimeout(t.current),t.current=-1)}let Px=0;function Kr(t,i){i===void 0&&(i={});const{preventScroll:a=!1,cancelPrevious:o=!0,sync:s=!1}=i;o&&cancelAnimationFrame(Px);const c=()=>t?.focus({preventScroll:a});s?c():Px=requestAnimationFrame(c)}function hj(t){return t?.ownerDocument||document}const ao={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function Ux(t){return t==="inert"?ao.inert:t==="aria-hidden"?ao["aria-hidden"]:ao.none}let mu=new WeakSet,pu={},vf=0;const fj=()=>typeof HTMLElement<"u"&&"inert"in HTMLElement.prototype;function h1(t){return t?ju(t)?t.host:h1(t.parentNode):null}const mj=(t,i)=>i.map(a=>{if(t.contains(a))return a;const o=h1(a);return t.contains(o)?o:null}).filter(a=>a!=null);function pj(t,i,a,o){const s="data-floating-ui-inert",c=o?"inert":a?"aria-hidden":null,u=mj(i,t),d=new Set,p=new Set(u),f=[];pu[s]||(pu[s]=new WeakMap);const y=pu[s];u.forEach(g),x(i),d.clear();function g(v){!v||d.has(v)||(d.add(v),v.parentNode&&g(v.parentNode))}function x(v){!v||p.has(v)||[].forEach.call(v.children,w=>{if(Ea(w)!=="script")if(d.has(w))x(w);else{const A=c?w.getAttribute(c):null,T=A!==null&&A!=="false",S=Ux(c),E=(S.get(w)||0)+1,C=(y.get(w)||0)+1;S.set(w,E),y.set(w,C),f.push(w),E===1&&T&&mu.add(w),C===1&&w.setAttribute(s,""),!T&&c&&w.setAttribute(c,c==="inert"?"":"true")}})}return vf++,()=>{f.forEach(v=>{const w=Ux(c),T=(w.get(v)||0)-1,S=(y.get(v)||0)-1;w.set(v,T),y.set(v,S),T||(!mu.has(v)&&c&&v.removeAttribute(c),mu.delete(v)),S||v.removeAttribute(s)}),vf--,vf||(ao.inert=new WeakMap,ao["aria-hidden"]=new WeakMap,ao.none=new WeakMap,mu=new WeakSet,pu={})}}function Fx(t,i,a){i===void 0&&(i=!1),a===void 0&&(a=!1);const o=hj(t[0]).body;return pj(t.concat(Array.from(o.querySelectorAll('[aria-live],[role="status"],output'))),o,i,a)}const Gm={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0},Pu=L.forwardRef(function(i,a){const[o,s]=L.useState();Dn(()=>{sD()&&s("button")},[]);const c={ref:a,tabIndex:0,role:o,"aria-hidden":o?void 0:!0,[El("focus-guard")]:"",style:Gm};return b.jsx("span",{...i,...c})}),gj={clipPath:"inset(50%)",position:"fixed",top:0,left:0},f1=L.createContext(null),Vx=El("portal");function yj(t){t===void 0&&(t={});const{id:i,root:a}=t,o=Vm(),s=p1(),[c,u]=L.useState(null),d=L.useRef(null);return Dn(()=>()=>{c?.remove(),queueMicrotask(()=>{d.current=null})},[c]),Dn(()=>{if(!o||d.current)return;const p=i?document.getElementById(i):null;if(!p)return;const f=document.createElement("div");f.id=o,f.setAttribute(Vx,""),p.appendChild(f),d.current=f,u(f)},[i,o]),Dn(()=>{if(a===null||!o||d.current)return;let p=a||s?.portalNode;p&&!Pm(p)&&(p=p.current),p=p||document.body;let f=null;i&&(f=document.createElement("div"),f.id=i,p.appendChild(f));const y=document.createElement("div");y.id=o,y.setAttribute(Vx,""),p=f||p,p.appendChild(y),d.current=y,u(y)},[i,a,o,s]),c}function m1(t){const{children:i,id:a,root:o,preserveTabOrder:s=!0}=t,c=yj({id:a,root:o}),[u,d]=L.useState(null),p=L.useRef(null),f=L.useRef(null),y=L.useRef(null),g=L.useRef(null),x=u?.modal,v=u?.open,w=!!u&&!u.modal&&u.open&&s&&!!(o||c);return L.useEffect(()=>{if(!c||!s||x)return;function A(T){c&&wl(T)&&(T.type==="focusin"?jx:wD)(c)}return c.addEventListener("focusin",A,!0),c.addEventListener("focusout",A,!0),()=>{c.removeEventListener("focusin",A,!0),c.removeEventListener("focusout",A,!0)}},[c,s,x]),L.useEffect(()=>{c&&(v||jx(c))},[v,c]),b.jsxs(f1.Provider,{value:L.useMemo(()=>({preserveTabOrder:s,beforeOutsideRef:p,afterOutsideRef:f,beforeInsideRef:y,afterInsideRef:g,portalNode:c,setFocusManagerState:d}),[s,c]),children:[w&&c&&b.jsx(Pu,{"data-type":"outside",ref:p,onFocus:A=>{if(wl(A,c)){var T;(T=y.current)==null||T.focus()}else{const S=u?u.domReference:null,E=t1(S);E?.focus()}}}),w&&c&&b.jsx("span",{"aria-owns":c.id,style:gj}),c&&oo.createPortal(i,c),w&&c&&b.jsx(Pu,{"data-type":"outside",ref:f,onFocus:A=>{if(wl(A,c)){var T;(T=g.current)==null||T.focus()}else{const S=u?u.domReference:null,E=e1(S);E?.focus(),u?.closeOnFocusOut&&u?.onOpenChange(!1,A.nativeEvent,"focus-out")}}})]})}const p1=()=>L.useContext(f1);function $x(t){return L.useMemo(()=>i=>{t.forEach(a=>{a&&(a.current=i)})},t)}const Gx=20;let xa=[];function Ym(){xa=xa.filter(t=>{var i;return(i=t.deref())==null?void 0:i.isConnected})}function bj(t){Ym(),t&&Ea(t)!=="body"&&(xa.push(new WeakRef(t)),xa.length>Gx&&(xa=xa.slice(-Gx)))}function Yx(){Ym();const t=xa[xa.length-1];return t?.deref()}function vj(t){const i=Ll();return Z0(t,i)?t:dc(t,i)[0]||t}function Jx(t,i){var a;if(!i.current.includes("floating")&&!((a=t.getAttribute("role"))!=null&&a.includes("dialog")))return;const o=Ll(),c=lD(t,o).filter(d=>{const p=d.getAttribute("data-tabindex")||"";return Z0(d,o)||d.hasAttribute("data-tabindex")&&!p.startsWith("-")}),u=t.getAttribute("tabindex");i.current.includes("floating")||c.length===0?u!=="0"&&t.setAttribute("tabindex","0"):(u!=="-1"||t.hasAttribute("data-tabindex")&&t.getAttribute("data-tabindex")!=="-1")&&(t.setAttribute("tabindex","-1"),t.setAttribute("data-tabindex","-1"))}const xj=L.forwardRef(function(i,a){return b.jsx("button",{...i,type:"button",ref:a,tabIndex:-1,style:Gm})});function wj(t){const{context:i,children:a,disabled:o=!1,order:s=["content"],guards:c=!0,initialFocus:u=0,returnFocus:d=!0,restoreFocus:p=!1,modal:f=!0,visuallyHiddenDismiss:y=!1,closeOnFocusOut:g=!0,outsideElementsInert:x=!1,getInsideElements:v=()=>[]}=t,{open:w,onOpenChange:A,events:T,dataRef:S,elements:{domReference:E,floating:C}}=i,R=yi(()=>{var ae;return(ae=S.current.floatingContext)==null?void 0:ae.nodeId}),_=yi(v),N=typeof u=="number"&&u<0,j=Nx(E)&&N,z=fj(),B=z?c:!0,I=!B||z&&x,X=gf(s),oe=gf(u),Y=gf(d),P=$m(),M=p1(),V=L.useRef(null),$=L.useRef(null),Z=L.useRef(!1),me=L.useRef(!1),q=L.useRef(-1),ze=L.useRef(-1),ge=M!=null,H=rm(C),U=yi(function(ae){return ae===void 0&&(ae=H),ae?dc(ae,Ll()):[]}),te=yi(ae=>{const ye=U(ae);return X.current.map(Ae=>E&&Ae==="reference"?E:H&&Ae==="floating"?H:ye).filter(Boolean).flat()});L.useEffect(()=>{if(o||!f)return;function ae(Ae){if(Ae.key==="Tab"){Nn(H,eo(Qn(H)))&&U().length===0&&!j&&pf(Ae);const Ne=te(),De=ba(Ae);X.current[0]==="reference"&&De===E&&(pf(Ae),Ae.shiftKey?Kr(Ne[Ne.length-1]):Kr(Ne[1])),X.current[1]==="floating"&&De===H&&Ae.shiftKey&&(pf(Ae),Kr(Ne[0]))}}const ye=Qn(H);return ye.addEventListener("keydown",ae),()=>{ye.removeEventListener("keydown",ae)}},[o,E,H,f,X,j,U,te]),L.useEffect(()=>{if(o||!C)return;function ae(ye){const Ae=ba(ye),De=U().indexOf(Ae);De!==-1&&(q.current=De)}return C.addEventListener("focusin",ae),()=>{C.removeEventListener("focusin",ae)}},[o,C,U]),L.useEffect(()=>{if(o||!g)return;function ae(){me.current=!0,setTimeout(()=>{me.current=!1})}function ye(De){const Me=De.relatedTarget,ce=De.currentTarget,je=ba(De);queueMicrotask(()=>{const $e=R(),Ge=!(Nn(E,Me)||Nn(C,Me)||Nn(Me,C)||Nn(M?.portalNode,Me)||Me!=null&&Me.hasAttribute(El("focus-guard"))||P&&(no(P.nodesRef.current,$e).find(W=>{var re,ue;return Nn((re=W.context)==null?void 0:re.elements.floating,Me)||Nn((ue=W.context)==null?void 0:ue.elements.domReference,Me)})||Dx(P.nodesRef.current,$e).find(W=>{var re,ue,Re;return[(re=W.context)==null?void 0:re.elements.floating,rm((ue=W.context)==null?void 0:ue.elements.floating)].includes(Me)||((Re=W.context)==null?void 0:Re.elements.domReference)===Me})));if(ce===E&&H&&Jx(H,X),p&&ce!==E&&!(je!=null&&je.isConnected)&&eo(Qn(H))===Qn(H).body){on(H)&&H.focus();const W=q.current,re=U(),ue=re[W]||re[re.length-1]||H;on(ue)&&ue.focus()}if(S.current.insideReactTree){S.current.insideReactTree=!1;return}(j||!f)&&Me&&Ge&&!me.current&&Me!==Yx()&&(Z.current=!0,A(!1,De,"focus-out"))})}const Ae=!!(!P&&M);function Ne(){dj(ze),S.current.insideReactTree=!0,ze.current=window.setTimeout(()=>{S.current.insideReactTree=!1})}if(C&&on(E))return E.addEventListener("focusout",ye),E.addEventListener("pointerdown",ae),C.addEventListener("focusout",ye),Ae&&C.addEventListener("focusout",Ne,!0),()=>{E.removeEventListener("focusout",ye),E.removeEventListener("pointerdown",ae),C.removeEventListener("focusout",ye),Ae&&C.removeEventListener("focusout",Ne,!0)}},[o,E,C,H,f,P,M,A,g,p,U,j,R,X,S]);const he=L.useRef(null),ve=L.useRef(null),le=$x([he,M?.beforeInsideRef]),be=$x([ve,M?.afterInsideRef]);L.useEffect(()=>{var ae,ye;if(o||!C)return;const Ae=Array.from((M==null||(ae=M.portalNode)==null?void 0:ae.querySelectorAll("["+El("portal")+"]"))||[]),De=(ye=(P?Dx(P.nodesRef.current,R()):[]).find(je=>{var $e;return Nx((($e=je.context)==null?void 0:$e.elements.domReference)||null)}))==null||(ye=ye.context)==null?void 0:ye.elements.domReference,Me=[C,De,...Ae,..._(),V.current,$.current,he.current,ve.current,M?.beforeOutsideRef.current,M?.afterOutsideRef.current,X.current.includes("reference")||j?E:null].filter(je=>je!=null),ce=f||j?Fx(Me,!I,I):Fx(Me);return()=>{ce()}},[o,E,C,f,X,M,j,B,I,P,R,_]),Dn(()=>{if(o||!on(H))return;const ae=Qn(H),ye=eo(ae);queueMicrotask(()=>{const Ae=te(H),Ne=oe.current,De=(typeof Ne=="number"?Ae[Ne]:Ne.current)||H,Me=Nn(H,ye);!N&&!Me&&w&&Kr(De,{preventScroll:De===H})})},[o,w,H,N,te,oe]),Dn(()=>{if(o||!H)return;const ae=Qn(H),ye=eo(ae);bj(ye);function Ae(Me){let{reason:ce,event:je,nested:$e}=Me;if(["hover","safe-polygon"].includes(ce)&&je.type==="mouseleave"&&(Z.current=!0),ce==="outside-press")if($e)Z.current=!1;else if(mD(je)||pD(je))Z.current=!1;else{let Ge=!1;document.createElement("div").focus({get preventScroll(){return Ge=!0,!1}}),Ge?Z.current=!1:Z.current=!0}}T.on("openchange",Ae);const Ne=ae.createElement("span");Ne.setAttribute("tabindex","-1"),Ne.setAttribute("aria-hidden","true"),Object.assign(Ne.style,Gm),ge&&E&&E.insertAdjacentElement("afterend",Ne);function De(){if(typeof Y.current=="boolean"){const Me=E||Yx();return Me&&Me.isConnected?Me:Ne}return Y.current.current||Ne}return()=>{T.off("openchange",Ae);const Me=eo(ae),ce=Nn(C,Me)||P&&no(P.nodesRef.current,R(),!1).some($e=>{var Ge;return Nn((Ge=$e.context)==null?void 0:Ge.elements.floating,Me)}),je=De();queueMicrotask(()=>{const $e=vj(je);Y.current&&!Z.current&&on($e)&&(!($e!==Me&&Me!==ae.body)||ce)&&$e.focus({preventScroll:!0}),Ne.remove()})}},[o,C,H,Y,S,T,P,ge,E,R]),L.useEffect(()=>(queueMicrotask(()=>{Z.current=!1}),()=>{queueMicrotask(Ym)}),[o]),Dn(()=>{if(!o&&M)return M.setFocusManagerState({modal:f,closeOnFocusOut:g,open:w,onOpenChange:A,domReference:E}),()=>{M.setFocusManagerState(null)}},[o,M,f,w,A,g,E]),Dn(()=>{o||H&&Jx(H,X)},[o,H,X]);function xe(ae){return o||!y||!f?null:b.jsx(xj,{ref:ae==="start"?V:$,onClick:ye=>A(!1,ye.nativeEvent),children:typeof y=="string"?y:"Dismiss"})}const de=!o&&B&&(f?!j:!0)&&(ge||f);return b.jsxs(b.Fragment,{children:[de&&b.jsx(Pu,{"data-type":"inside",ref:le,onFocus:ae=>{if(f){const Ae=te();Kr(s[0]==="reference"?Ae[0]:Ae[Ae.length-1])}else if(M!=null&&M.preserveTabOrder&&M.portalNode)if(Z.current=!1,wl(ae,M.portalNode)){const Ae=e1(E);Ae?.focus()}else{var ye;(ye=M.beforeOutsideRef.current)==null||ye.focus()}}}),!j&&xe("start"),a,xe("end"),de&&b.jsx(Pu,{"data-type":"inside",ref:be,onFocus:ae=>{if(f)Kr(te()[0]);else if(M!=null&&M.preserveTabOrder&&M.portalNode)if(g&&(Z.current=!0),wl(ae,M.portalNode)){const Ae=t1(E);Ae?.focus()}else{var ye;(ye=M.afterOutsideRef.current)==null||ye.focus()}}})]})}let gu=0;const Xx="--floating-ui-scrollbar-width";function Sj(){const t=K0(),i=/iP(hone|ad|od)|iOS/.test(t)||t==="MacIntel"&&navigator.maxTouchPoints>1,a=document.body.style,s=Math.round(document.documentElement.getBoundingClientRect().left)+document.documentElement.scrollLeft?"paddingLeft":"paddingRight",c=window.innerWidth-document.documentElement.clientWidth,u=a.left?parseFloat(a.left):window.scrollX,d=a.top?parseFloat(a.top):window.scrollY;if(a.overflow="hidden",a.setProperty(Xx,c+"px"),c&&(a[s]=c+"px"),i){var p,f;const y=((p=window.visualViewport)==null?void 0:p.offsetLeft)||0,g=((f=window.visualViewport)==null?void 0:f.offsetTop)||0;Object.assign(a,{position:"fixed",top:-(d-Math.floor(g))+"px",left:-(u-Math.floor(y))+"px",right:"0"})}return()=>{Object.assign(a,{overflow:"",[s]:""}),a.removeProperty(Xx),i&&(Object.assign(a,{position:"",top:"",left:"",right:""}),window.scrollTo(u,d))}}let Zx=()=>{};const kj=L.forwardRef(function(i,a){const{lockScroll:o=!1,...s}=i;return Dn(()=>{if(o)return gu++,gu===1&&(Zx=Sj()),()=>{gu--,gu===0&&Zx()}},[o]),b.jsx("div",{ref:a,...s,style:{position:"fixed",overflow:"auto",top:0,right:0,bottom:0,left:0,...s.style}})}),Tj={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},Aj={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},Kx=t=>{var i,a;return{escapeKey:typeof t=="boolean"?t:(i=t?.escapeKey)!=null?i:!1,outsidePress:typeof t=="boolean"?t:(a=t?.outsidePress)!=null?a:!0}};function Ej(t,i){i===void 0&&(i={});const{open:a,onOpenChange:o,elements:s,dataRef:c}=t,{enabled:u=!0,escapeKey:d=!0,outsidePress:p=!0,outsidePressEvent:f="pointerdown",referencePress:y=!1,referencePressEvent:g="pointerdown",ancestorScroll:x=!1,bubbles:v,capture:w}=i,A=$m(),T=yi(typeof p=="function"?p:()=>!1),S=typeof p=="function"?T:p,E=L.useRef(!1),{escapeKey:C,outsidePress:R}=Kx(v),{escapeKey:_,outsidePress:N}=Kx(w),j=L.useRef(!1),z=yi(P=>{var M;if(!a||!u||!d||P.key!=="Escape"||j.current)return;const V=(M=c.current.floatingContext)==null?void 0:M.nodeId,$=A?no(A.nodesRef.current,V):[];if(!C&&(P.stopPropagation(),$.length>0)){let Z=!0;if($.forEach(me=>{var q;if((q=me.context)!=null&&q.open&&!me.context.dataRef.current.__escapeKeyBubbles){Z=!1;return}}),!Z)return}o(!1,fD(P)?P.nativeEvent:P,"escape-key")}),B=yi(P=>{var M;const V=()=>{var $;z(P),($=ba(P))==null||$.removeEventListener("keydown",V)};(M=ba(P))==null||M.addEventListener("keydown",V)}),I=yi(P=>{var M;const V=c.current.insideReactTree;c.current.insideReactTree=!1;const $=E.current;if(E.current=!1,f==="click"&&$||V||typeof S=="function"&&!S(P))return;const Z=ba(P),me="["+El("inert")+"]",q=Qn(s.floating).querySelectorAll(me);let ze=zt(Z)?Z:null;for(;ze&&!wa(ze);){const te=Ta(ze);if(wa(te)||!zt(te))break;ze=te}if(q.length&&zt(Z)&&!dD(Z)&&!Nn(Z,s.floating)&&Array.from(q).every(te=>!Nn(ze,te)))return;if(on(Z)&&Y){const te=wa(Z),he=ii(Z),ve=/auto|scroll/,le=te||ve.test(he.overflowX),be=te||ve.test(he.overflowY),xe=le&&Z.clientWidth>0&&Z.scrollWidth>Z.clientWidth,de=be&&Z.clientHeight>0&&Z.scrollHeight>Z.clientHeight,ae=he.direction==="rtl",ye=de&&(ae?P.offsetX<=Z.offsetWidth-Z.clientWidth:P.offsetX>Z.clientWidth),Ae=xe&&P.offsetY>Z.clientHeight;if(ye||Ae)return}const ge=(M=c.current.floatingContext)==null?void 0:M.nodeId,H=A&&no(A.nodesRef.current,ge).some(te=>{var he;return mf(P,(he=te.context)==null?void 0:he.elements.floating)});if(mf(P,s.floating)||mf(P,s.domReference)||H)return;const U=A?no(A.nodesRef.current,ge):[];if(U.length>0){let te=!0;if(U.forEach(he=>{var ve;if((ve=he.context)!=null&&ve.open&&!he.context.dataRef.current.__outsidePressBubbles){te=!1;return}}),!te)return}o(!1,P,"outside-press")}),X=yi(P=>{var M;const V=()=>{var $;I(P),($=ba(P))==null||$.removeEventListener(f,V)};(M=ba(P))==null||M.addEventListener(f,V)});L.useEffect(()=>{if(!a||!u)return;c.current.__escapeKeyBubbles=C,c.current.__outsidePressBubbles=R;let P=-1;function M(q){o(!1,q,"ancestor-scroll")}function V(){window.clearTimeout(P),j.current=!0}function $(){P=window.setTimeout(()=>{j.current=!1},uc()?5:0)}const Z=Qn(s.floating);d&&(Z.addEventListener("keydown",_?B:z,_),Z.addEventListener("compositionstart",V),Z.addEventListener("compositionend",$)),S&&Z.addEventListener(f,N?X:I,N);let me=[];return x&&(zt(s.domReference)&&(me=Sa(s.domReference)),zt(s.floating)&&(me=me.concat(Sa(s.floating))),!zt(s.reference)&&s.reference&&s.reference.contextElement&&(me=me.concat(Sa(s.reference.contextElement)))),me=me.filter(q=>{var ze;return q!==((ze=Z.defaultView)==null?void 0:ze.visualViewport)}),me.forEach(q=>{q.addEventListener("scroll",M)}),()=>{d&&(Z.removeEventListener("keydown",_?B:z,_),Z.removeEventListener("compositionstart",V),Z.removeEventListener("compositionend",$)),S&&Z.removeEventListener(f,N?X:I,N),me.forEach(q=>{q.removeEventListener("scroll",M)}),window.clearTimeout(P)}},[c,s,d,S,f,a,o,x,u,C,R,z,_,B,I,N,X]),L.useEffect(()=>{c.current.insideReactTree=!1},[c,S,f]);const oe=L.useMemo(()=>({onKeyDown:z,...y&&{[Tj[g]]:P=>{o(!1,P.nativeEvent,"reference-press")},...g!=="click"&&{onClick(P){o(!1,P.nativeEvent,"reference-press")}}}}),[z,o,y,g]),Y=L.useMemo(()=>{function P(M){M.button===0&&(E.current=!0)}return{onKeyDown:z,onMouseDown:P,onMouseUp:P,[Aj[f]]:()=>{c.current.insideReactTree=!0}}},[z,f,c]);return L.useMemo(()=>u?{reference:oe,floating:Y}:{},[u,oe,Y])}function Cj(t){const{open:i=!1,onOpenChange:a,elements:o}=t,s=Vm(),c=L.useRef({}),[u]=L.useState(()=>sj()),d=d1()!=null,[p,f]=L.useState(o.reference),y=yi((v,w,A)=>{c.current.openEvent=v?w:void 0,u.emit("openchange",{open:v,event:w,reason:A,nested:d}),a?.(v,w,A)}),g=L.useMemo(()=>({setPositionReference:f}),[]),x=L.useMemo(()=>({reference:p||o.reference||null,floating:o.floating||null,domReference:o.reference}),[p,o.reference,o.floating]);return L.useMemo(()=>({dataRef:c,open:i,onOpenChange:y,elements:x,events:u,floatingId:s,refs:g}),[i,y,x,u,s,g])}function g1(t){var i,a;let{elements:o,...s}=t===void 0?{}:t;const{nodeId:c}=s,u=Cj({...s,elements:{reference:(i=o?.reference)!=null?i:null,floating:(a=o?.floating)!=null?a:null}}),d=s.rootContext||u,p=d.elements,[f,y]=L.useState(null),[g,x]=L.useState(null),w=p?.domReference||f,A=L.useRef(null),T=$m();Dn(()=>{w&&(A.current=w)},[w]);const S=ej({...s,elements:{...p,...g&&{reference:g}}}),E=L.useCallback(j=>{const z=zt(j)?{getBoundingClientRect:()=>j.getBoundingClientRect(),getClientRects:()=>j.getClientRects(),contextElement:j}:j;x(z),S.refs.setReference(z)},[S.refs]),C=L.useCallback(j=>{(zt(j)||j===null)&&(A.current=j,y(j)),(zt(S.refs.reference.current)||S.refs.reference.current===null||j!==null&&!zt(j))&&S.refs.setReference(j)},[S.refs]),R=L.useMemo(()=>({...S.refs,setReference:C,setPositionReference:E,domReference:A}),[S.refs,C,E]),_=L.useMemo(()=>({...S.elements,domReference:w}),[S.elements,w]),N=L.useMemo(()=>({...S,...d,refs:R,elements:_,nodeId:c}),[S,R,_,c,d]);return Dn(()=>{d.dataRef.current.floatingContext=N;const j=T?.nodesRef.current.find(z=>z.id===c);j&&(j.context=N)}),L.useMemo(()=>({...S,context:N,refs:R,elements:_}),[S,R,_,N])}function xf(t,i,a){const o=new Map,s=a==="item";let c=t;if(s&&t){const{[Ix]:u,[Hx]:d,...p}=t;c=p}return{...a==="floating"&&{tabIndex:-1,[ij]:""},...c,...i.map(u=>{const d=u?u[a]:null;return typeof d=="function"?t?d(t):null:d}).concat(t).reduce((u,d)=>(d&&Object.entries(d).forEach(p=>{let[f,y]=p;if(!(s&&[Ix,Hx].includes(f)))if(f.indexOf("on")===0){if(o.has(f)||o.set(f,[]),typeof y=="function"){var g;(g=o.get(f))==null||g.push(y),u[f]=function(){for(var x,v=arguments.length,w=new Array(v),A=0;A<v;A++)w[A]=arguments[A];return(x=o.get(f))==null?void 0:x.map(T=>T(...w)).find(T=>T!==void 0)}}}else u[f]=y}),u),{})}}function Rj(t){t===void 0&&(t=[]);const i=t.map(d=>d?.reference),a=t.map(d=>d?.floating),o=t.map(d=>d?.item),s=L.useCallback(d=>xf(d,t,"reference"),i),c=L.useCallback(d=>xf(d,t,"floating"),a),u=L.useCallback(d=>xf(d,t,"item"),o);return L.useMemo(()=>({getReferenceProps:s,getFloatingProps:c,getItemProps:u}),[s,c,u])}const Mj=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function Nj(t,i){var a,o;i===void 0&&(i={});const{open:s,elements:c,floatingId:u}=t,{enabled:d=!0,role:p="dialog"}=i,f=Vm(),y=((a=c.domReference)==null?void 0:a.id)||f,g=L.useMemo(()=>{var E;return((E=rm(c.floating))==null?void 0:E.id)||u},[c.floating,u]),x=(o=Mj.get(p))!=null?o:p,w=d1()!=null,A=L.useMemo(()=>x==="tooltip"||p==="label"?{["aria-"+(p==="label"?"labelledby":"describedby")]:s?g:void 0}:{"aria-expanded":s?"true":"false","aria-haspopup":x==="alertdialog"?"dialog":x,"aria-controls":s?g:void 0,...x==="listbox"&&{role:"combobox"},...x==="menu"&&{id:y},...x==="menu"&&w&&{role:"menuitem"},...p==="select"&&{"aria-autocomplete":"none"},...p==="combobox"&&{"aria-autocomplete":"list"}},[x,g,w,s,y,p]),T=L.useMemo(()=>{const E={id:g,...x&&{role:x}};return x==="tooltip"||p==="label"?E:{...E,...x==="menu"&&{"aria-labelledby":y}}},[x,g,y,p]),S=L.useCallback(E=>{let{active:C,selected:R}=E;const _={role:"option",...C&&{id:g+"-fui-option"}};switch(p){case"select":case"combobox":return{..._,"aria-selected":R}}return{}},[g,p]);return L.useMemo(()=>d?{reference:A,floating:T,item:S}:{},[d,A,T,S])}const wf=t=>t?.playState==="running"||t?.playState==="paused",Qx=(t,i)=>{const a=parseFloat(t)*(t.endsWith("ms")?1:1e3);return Number.isFinite(a)&&a>0?a:i};function Dj(t,i,a,o,s,c,u,d,p,f){const y=L.useRef(null),g=L.useRef(null),x=L.useRef(null),v=L.useRef(null),w=L.useRef(null),A=L.useRef(null),T=L.useRef({open:o,onExit:f});T.current={open:o,onExit:f},Et(()=>{if(!t||!i||!c)return;const S=A.current?.id===u,E=S&&A.current?.expanded!==s,C=!S||A.current?.open!==o||E,R=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!C&&!R)return;const _=getComputedStyle(t),N=t.querySelector(".limr-overlay-surface"),j=t.querySelector(".limr-overlay-card"),z=S?x.current?.effect?.target:null,B=E||s?j:z?.isConnected?z:t.querySelector("[data-limr-card-body], .limr-overlay-content"),I=B?getComputedStyle(B):null,X={opacity:_.opacity,clipPath:_.clipPath},oe=_.transform,Y={opacity:I?.opacity??"1",transform:I?.transform??"none",clipPath:I?.clipPath??"none"};let P=S?y.current:s?p??null:null;if(P&&S&&v.current&&_.transform!=="none"){const ye=new DOMMatrixReadOnly(_.transform);P=new DOMRect(P.x+ye.m41,P.y+ye.m42,P.width,P.height)}if(P&&S&&N&&w.current){const ye=new DOMMatrixReadOnly(getComputedStyle(N).transform);P=new DOMRect(P.x,P.y,P.width*ye.a,P.height*ye.d)}const M=i.getBoundingClientRect(),V=a?.getBoundingClientRect()??M,$=Math.max(0,Math.min(100,((V.left+V.right)/2-M.left)/Math.max(1,M.width)*100)),Z=_.borderRadius||"8px",me=`inset(${d==="bottom"?100:0}% ${100-$}% ${d==="bottom"?0:100}% ${$}% round ${Z})`,q=Math.max(48,(P?.width??0)-M.width+48,(P?.height??0)-M.height+48),ze=`inset(-${q}px -${q}px -${q}px -${q}px round ${Z})`;if(g.current?.cancel(),x.current?.cancel(),v.current?.cancel(),w.current?.cancel(),g.current=x.current=v.current=w.current=null,A.current={id:u,expanded:s,open:o},y.current=M,R||!o&&!S){delete t.dataset.motion,o||T.current.onExit();return}const H=Qx((_.getPropertyValue("--limr-overlay-duration")||_.getPropertyValue("--limr-overlay-enter-duration")).trim(),560),U=Qx(_.getPropertyValue("--limr-overlay-morph-duration").trim(),480),te=o&&!!P&&(E||!S&&s),he=!o&&s&&!!p,ve=he?p:M,le=te||s?U:H,be=_.getPropertyValue("--limr-overlay-ease").trim()||"cubic-bezier(.22,1,.36,1)";if(t.dataset.motion=o?te?"morphing":"opening":"closing",g.current=t.animate([S?{...X,...te?{clipPath:ze}:{}}:{opacity:0,clipPath:te?ze:me},{opacity:o?1:0,clipPath:o||he?ze:me}],{duration:le,easing:be,fill:"both"}),P&&(te||oe!=="none"||he)){const ye=P.left-M.left,Ae=P.top-M.top,Ne=P.width/Math.max(1,M.width),De=P.height/Math.max(1,M.height);v.current=t.animate([{transform:`translate(${ye}px, ${Ae}px)`},{transform:`translate(${ve.left-M.left}px, ${ve.top-M.top}px)`}],{duration:le,easing:be,fill:"both"}),w.current=N?.animate([{transform:`scale(${Ne}, ${De})`},{transform:`scale(${ve.width/Math.max(1,M.width)}, ${ve.height/Math.max(1,M.height)})`}],{duration:le,easing:be,fill:"both"})??null}const xe=o?te?50:S?0:35:0;x.current=B?.animate([S&&!te?Y:{opacity:0,transform:"translateY(6px)",clipPath:te?`inset(0px ${Math.max(0,M.width-P.width)}px ${Math.max(0,M.height-P.height)}px 0px)`:"inset(0px)"},{opacity:o?1:0,transform:o?"translateY(0px)":"translateY(-4px)",clipPath:he?`inset(0px ${Math.max(0,M.width-ve.width)}px ${Math.max(0,M.height-ve.height)}px 0px)`:"inset(0px)"}],{duration:le-xe,delay:xe,easing:be,fill:"both"})??null;const de=g.current,ae=()=>{g.current===de&&([g.current,x.current,v.current,w.current].some(wf)||(delete t.dataset.motion,T.current.open?y.current=i.getBoundingClientRect():T.current.onExit()))};for(const ye of[g.current,x.current,v.current,w.current])ye&&(ye.onfinish=ae);ae()},[t,i,a,o,s,c,u,d,p]),Et(()=>{i&&o&&c&&!wf(v.current)&&(y.current=i.getBoundingClientRect())}),Et(()=>{if(!i||!o)return;const S=new ResizeObserver(()=>{wf(v.current)||(y.current=i.getBoundingClientRect())});return S.observe(i),()=>S.disconnect()},[i,o,u]),Et(()=>()=>{g.current?.cancel(),x.current?.cancel(),v.current?.cancel(),w.current?.cancel(),g.current=x.current=v.current=w.current=null,A.current=null,y.current=null,t&&delete t.dataset.motion},[t])}const fl=t=>typeof t=="number"?`${t}px`:t,jj=()=>()=>{};function Jm({disabled:t=!1,portalRoot:i,previewWidth:a=340,maxHeight:o="80dvh"}){const s=bt(),c=po(),u=mo(),d=ln(),p=qe(s.interaction,Je=>Je.editing),f=qe(s.interaction,Je=>Je.active),y=qe(s.interaction,Je=>Je.hovered),g=qe(s.decorations,Je=>Je.occurrences);L.useSyncExternalStore(s.layout.subscribe,s.layout.get,s.layout.get);const[x,v]=L.useState(null),[w,A]=L.useState(null),[,T]=L.useState(0);L.useEffect(()=>{if(f||t){v(null);return}if(y){v(y);return}const Je=setTimeout(()=>v(null),90);return()=>clearTimeout(Je)},[y,f,t]),L.useEffect(()=>{const Je=()=>T(ct=>ct+1);return window.visualViewport?.addEventListener("resize",Je),window.visualViewport?.addEventListener("scroll",Je),window.addEventListener("resize",Je),()=>{window.visualViewport?.removeEventListener("resize",Je),window.visualViewport?.removeEventListener("scroll",Je),window.removeEventListener("resize",Je)}},[]);const S=f??x,E=g.find(Je=>Je.id===S),[C,R]=L.useState(null),_=E??C,N=_?.id,j=qe(s.decorations,Je=>Je.annotations.get(_?.annotationIds[0]??"")),z=qe(s.configuration,()=>s.annotationTypes.get(j?.type??"citation")),B=z?.overlay?.expand,I=typeof B=="function"?j&&B(j):B,X=f===N,oe=X&&!!I&&w!==N,[Y,P]=L.useState(!1),[M,V]=L.useState(!1),$=!!E&&!t;L.useSyncExternalStore($?s.viewport.subscribe:jj,s.viewport.get,s.viewport.get),L.useEffect(()=>{$&&(R(E),P(oe),V(X))},[E,$,oe,X]);const Z=()=>{(N?s.anchors.get(N):null)?.focus({preventScroll:!0}),s.activate(null),s.hover(null),v(null)},me=N?s.anchors.get(N):void 0,[q,ze]=L.useState(null),ge=q?.id===N?q:null,H=$?oe:Y,U=$&&H&&!ge,te=H&&!U,he=$?X:M,ve=te&&I&&I.placement==="center",le=te&&!ve&&ge,{refs:be,update:xe,floatingStyles:de,context:ae,isPositioned:ye,placement:Ae,middlewareData:Ne}=g1({open:$,elements:{reference:me??null},onOpenChange:Je=>{Je||Z()},strategy:"fixed",transform:!1,placement:"bottom-start",whileElementsMounted:l1,middleware:[u1(8),tj({padding:12}),c1({padding:12}),nj({padding:12,apply:({availableHeight:Je,elements:ct})=>{te?!ve&&!ge&&(ct.floating.style.maxHeight=`min(${fl(I&&I.maxHeight||o)}, ${Math.max(0,Math.floor(Je))}px)`):ct.floating.style.maxHeight=`${Math.max(0,Math.floor(Math.min(360,Je)))}px`}},[te,!!ve,!!ge,I&&I.maxHeight,o]),{name:"limrAnchor",options:te,fn:({elements:Je})=>({data:{id:Je.reference.dataset?.limrAnchor,expanded:te}})}]});Et(()=>{$&&me&&xe()},[me,xe,$,te]);const De=Ej(ae,{escapeKey:!0,outsidePress:!0}),Me=Nj(ae,{role:"dialog"}),{getFloatingProps:ce}=Rj([De,Me]),je=!!ve||!!le||!$||ye&&Ne.limrAnchor?.id===N&&Ne.limrAnchor?.expanded===te,[$e,Ge]=L.useState(null),W=(te?ge?.placement??"bottom":Ae).startsWith("top")?"bottom":"top";if(Dj($e,be.floating.current,me,$,te,je&&!U,N,W,ge?.rect,()=>{R(null),A(null),ze(null)}),Et(()=>{if(!te&&$&&je&&be.floating.current){const Je=be.floating.current.getBoundingClientRect();(!ge||ge.placement!==Ae||["x","y","width","height"].some(ct=>Math.abs(Je[ct]-ge.rect[ct])>.5))&&ze({id:N,rect:Je,placement:Ae})}}),!_||t)return null;const re=window.visualViewport,ue=re?.offsetLeft??0,Re=re?.offsetTop??0,Se=re?.width??window.innerWidth,G=re?.height??window.innerHeight,D=Re+12,we=Re+G-12,Te=Math.max(0,we-D),Ie=te&&I?I:void 0,Oe=`min(${fl(Ie?.width??(ve?640:z?.overlay?.previewWidth??a))}, ${Math.max(0,Se-24)}px)`;let et={...de,width:Oe,maxHeight:Math.min(360,G-24)};if(Ie){if(et={...et,height:Ie.height===void 0?void 0:`min(${fl(Ie.height)}, ${Te}px)`,maxHeight:`min(${fl(Ie.maxHeight??o)}, ${Te}px)`},ve)et={...et,left:ue+Se/2,top:Re+G/2,transform:"translate(-50%, -50%)"};else if(ge){const Je=ge.placement.startsWith("top"),ct=Math.max(0,Je?ge.rect.bottom-D:we-ge.rect.top);et={...et,left:ge.rect.left,top:Je?ge.rect.bottom:ge.rect.top,transform:Je?"translateY(-100%)":"none",maxWidth:ue+Se-12-ge.rect.left,maxHeight:`min(${fl(Ie.maxHeight??o)}, ${ct}px)`}}}const Ye=z?.overlay?.Card,ht={annotation:j??{id:_.annotationIds[0],type:"unknown"},occurrence:_,presentation:te?"expanded":"preview",expanded:te,pinned:he,canExpand:!!I,expand:()=>{A(null),s.activate(_.id)},collapse:()=>{A(_.id),s.activate(_.id)},close:Z,children:b.jsx(H0,{occurrence:_,presentation:te?"expanded":"preview",expanded:te})},Qe=$&&!!ve,kt=b.jsx(wj,{context:ae,modal:Qe,disabled:!$||!X||U,initialFocus:p?-1:be.floating,returnFocus:!1,children:b.jsx("div",{ref:be.setFloating,...ce(),tabIndex:-1,"aria-label":z?.label??d.annotations,className:"limr-overlay-positioner",style:{...et,pointerEvents:$?"auto":"none",visibility:je&&!U?"visible":"hidden"},children:b.jsxs("div",{ref:Ge,className:`limr-annotation-overlay ${te?"limr-annotation-expanded":"limr-annotation-preview"}`,style:{"--limr-annotation-color":z?.color},"data-type":j?.type,"data-state":$?"open":"closing","data-pinned":he||void 0,"data-placement":ve?"center":le?ge.placement:Ae,"data-limr-theme":u,"data-limr-appearance":c,onPointerEnter:Je=>{!X&&Je.pointerType!=="touch"&&s.hover(_.id)},onPointerLeave:()=>{X||s.hover(null)},children:[b.jsx("div",{className:"limr-overlay-surface","aria-hidden":"true"}),b.jsx("div",{className:"limr-overlay-card",children:Ye&&j?b.jsx(Ye,{...ht}):b.jsx(ic,{...ht,title:z?.label??j?.type??d.annotations})})]})})});return b.jsx(m1,{root:i,children:b.jsx(kj,{className:"limr-backdrop","data-expanded":Qe||void 0,lockScroll:Qe,style:{pointerEvents:Qe?"auto":"none"},children:kt})})}const Oj=[{color:"#E57373",label:"Rose",labelZh:"玫瑰"},{color:"#F2C744",label:"Gold",labelZh:"暖黄"},{color:"#81B29A",label:"Sage",labelZh:"鼠尾草"},{color:"#6B9BD2",label:"Blue",labelZh:"雾蓝"},{color:"#B39DDB",label:"Lavender",labelZh:"薰衣草"},{color:"#E5A06E",label:"Apricot",labelZh:"杏橙"},{color:"#61AAA5",label:"Teal",labelZh:"青瓷"}];function Lj(t={}){return{id:`copy-${t.format??"text"}`,label:t.label??(i=>i.locale.copy),icon:b.jsx(yt,{name:"copy"}),successLabel:i=>i.locale.copied,successIcon:b.jsx(yt,{name:"check"}),run:async({selection:i})=>{const a=t.format??"text";await navigator.clipboard.writeText(a==="text"?i.text:i[a].sourceText)}}}function zj({context:t,options:i}){const{locale:a,highlight:o,highlightAppearance:s}=t,c=s.color??Al.color,u=s.style??"background",d=[["background",a.highlightBackground],["underline",a.highlightUnderline],["dotted",a.highlightDotted],["wavy",a.highlightWavy]],p=(f,y)=>{const g={...s,color:f,style:y};t.setHighlightAppearance(g),o&&t.run(x=>x.updateAnnotation(o.id,{data:g}))};return b.jsxs("div",{className:"limr-highlight-settings",children:[b.jsxs("fieldset",{disabled:t.busy,children:[b.jsx("legend",{children:a.highlightStyle}),b.jsx("div",{className:"limr-highlight-styles",children:d.map(([f,y])=>b.jsxs("button",{type:"button","aria-pressed":u===f,onClick:()=>p(c,f),children:[b.jsx(yt,{name:f}),b.jsx("span",{className:"limr-highlight-style-label",children:b.jsx("span",{className:"limr-underline",children:y})})]},f))})]}),b.jsxs("fieldset",{disabled:t.busy,children:[b.jsx("legend",{children:a.highlightColor}),b.jsx("div",{className:"limr-highlight-colors",children:(i.colors??Oj).map(f=>b.jsx("button",{type:"button",className:"limr-color-swatch","aria-label":a.highlight==="高亮"?f.labelZh??f.label:f.label,title:a.highlight==="高亮"?f.labelZh??f.label:f.label,"aria-pressed":c.toLowerCase()===f.color.toLowerCase(),style:{"--swatch":f.color},onClick:()=>p(f.color,u),children:b.jsx(yt,{name:"check"})},f.color))})]})]})}function _j(t={}){return{id:"highlight-palette",label:i=>i.locale.editHighlight,icon:b.jsx(yt,{name:"background"}),placement:"start",render:i=>b.jsx("button",{type:"button",className:"limr-toolbar-swatch","aria-label":i.locale.editHighlight,"aria-expanded":i.expanded,disabled:i.busy,onClick:()=>i.expanded?i.collapse():i.expand(),style:{"--swatch":i.highlightAppearance.color??Al.color}}),renderExpanded:i=>b.jsx(zj,{context:i,options:t})}}function y1(){return{id:"highlight",label:t=>t.highlight?t.highlight.data?.hidden?t.locale.showHighlight:t.locale.hideHighlight:t.locale.addHighlight,icon:t=>b.jsx(yt,{name:t.highlight?t.highlight.data?.hidden?"eye":"eye-off":"highlight"}),visible:t=>!t.highlight||t.annotations.some(i=>i.type!=="highlight"),run:t=>{t.highlight?t.updateAnnotation(t.highlight.id,{data:{...t.highlight.data,hidden:!t.highlight.data?.hidden}}):(t.addAnnotation({id:`highlight-${crypto.randomUUID()}`,type:"highlight",data:{...t.highlightAppearance,hidden:!1},anchors:t.selection.syntax.ranges.map(i=>({range:i,documentId:t.document.id,quote:t.document.source.slice(i.start,i.end)}))}),t.clearSelection())}}}function Ij(){return{id:"delete-annotations",label:t=>t.locale.deleteAnnotations,icon:b.jsx(yt,{name:"trash"}),placement:"end",tone:"danger",visible:t=>t.annotations.length>0,run:t=>{t.removeAnnotationsAt([...t.selection.raw.ranges,...t.selection.syntax.ranges]),t.activateAnnotation(null),t.clearSelection()}}}function Hj({state:t,children:i}){const a=L.useRef(null),[o,s]=L.useState();return Et(()=>{const c=a.current;if(!c)return;const u=[...c.querySelectorAll(".limr-tool-face")],d=()=>{const f=u.find(y=>y.hasAttribute("data-visible"));f&&s(f.offsetWidth)};d();const p=new ResizeObserver(d);return u.forEach(f=>p.observe(f)),()=>p.disconnect()},[t]),b.jsx("span",{className:"limr-tool-faces",ref:a,style:{width:o},children:i})}const Wx=[_j(),y1(),Lj(),Ij()];function b1({actions:t,portalRoot:i,maxPanelHeight:a=260,className:o="",style:s,render:c}){const u=bt(),d=po(),p=mo(),f=MN(),y=qe(u.interaction,W=>W),g=qe(u.decorations,W=>W),x=qe(u.configuration,W=>W),v=y.activeHighlight?g.highlights.get(y.activeHighlight):null,w=g.occurrences.find(W=>W.id===y.active),A=w&&[...g.highlights.values()].some(W=>W.hidden&&Wn(W.range,w.range)),T=L.useMemo(()=>{const W=new Map((t??Wx).map(ue=>[ue.id,ue]));x.extensions?.forEach(ue=>ue.actions?.forEach(Re=>W.set(Re.id,Re))),t?.forEach(ue=>W.set(ue.id,ue));const re=ue=>ue.placement==="start"?-1:ue.placement==="end"?1:0;return[...W.values()].sort((ue,Re)=>re(ue)-re(Re))},[x.extensions,t]),[S,E]=L.useState(null),C=L.useRef(!1),[R,_]=L.useState(null),[N,j]=L.useState(null),[z,B]=L.useState(null),[I,X]=L.useState(!1),[oe,Y]=L.useState(Al),P=L.useRef(void 0),M=L.useRef(void 0),V=L.useId(),$=u.document.getSnapshot(),Z=L.useMemo(()=>{if(f)return f;if(y.editing&&w?.annotationIds.includes(y.editing))return null;const W=v?.range??(A?w?.range:void 0);return W?Wu($,W,{text:Xf(u,[W])??(v?u.highlightReference?.text??Wf($,{id:v.id,range:W}):Wf($,w))}):null},[$,v,w,f,y.editing,A]),me=L.useMemo(()=>{const W=Z?.raw.ranges;if(W?.length!==1)return null;const{start:re,end:ue}=W[0];return u.content?.querySelector(`[data-limr-atomic="block"][data-source-start="${re}"][data-source-end="${ue}"]`)??null},[u,Z]),q=L.useMemo(()=>Z?[...g.annotations.values()].filter(W=>vl(W,$).some(re=>[...Z.raw.ranges,...Z.syntax.ranges].some(ue=>Wn(re.range,ue)))):[],[g,Z,$]),ze=v?g.annotations.get(v.annotationId):q.find(W=>W.type==="highlight"),ge=ze?.data??oe,H=Z?{...u.commands,selection:Z,annotations:q,highlight:ze??null,locale:u.locale,addAnnotation:(W,re)=>u.commands.addAnnotation(W,{highlight:ge,...re}),document:$,signal:u.signal,clearSelection:()=>u.clearSelection()}:null,U=ze?.data?.readOnly===!0,te=H?U?[Wx[2]]:T.filter(W=>W.visible?.(H)??!0):[],he=te.find(W=>W.id===N&&W.renderExpanded),ve=te.some(W=>W.renderExpanded),le=!!H&&Z.settled&&te.length>0,{refs:be,floatingStyles:xe,placement:de,isPositioned:ae}=g1({open:le,strategy:"fixed",placement:"bottom",middleware:[u1(10),{name:"toolbarSpace",options:{hasPanels:ve,maxPanelHeight:a,blockReference:me},fn({rects:W,placement:re,elements:ue}){const Re=window.visualViewport,Se=u.configuration.get().scrollRoot?.getBoundingClientRect(),G=Math.max(Re?.offsetTop??0,Se?.top??0),D=Math.min((Re?.offsetTop??0)+(Re?.height??window.innerHeight),Se?.bottom??1/0),we=Math.max(0,W.reference.y-G-20),Te=Math.max(0,D-W.reference.y-W.reference.height-20),Ie=(ue.floating.querySelector(".limr-toolbar-actions")?.getBoundingClientRect().height??34)+(ue.floating.querySelector(".limr-toolbar-delete-hint,.limr-toolbar-readonly-hint")?.getBoundingClientRect().height??0),Oe=Math.max(0,parseFloat(getComputedStyle(ue.floating).getPropertyValue("--limr-toolbar-panel-max-height"))||a),et=Ie+(ve?Oe:0)+24,Ye=me||Te>=et||Te>=we?"bottom":"top",ht=Ye==="bottom"?Te:we;return ue.floating.style.setProperty("--limr-toolbar-panel-height",`${Math.max(0,Math.min(Oe,ht-Ie-24))}px`),ue.floating.style.setProperty("--limr-toolbar-available-height",`${ht}px`),re!==Ye?{reset:{placement:Ye}}:{}}},c1({padding:10})],whileElementsMounted:l1});L.useEffect(()=>{const W=me??(f?u.selectionRange:v?u.highlightReference:w?u.anchors.get(w.id):null);W&&be.setPositionReference({getBoundingClientRect:()=>W.getBoundingClientRect(),getClientRects:()=>W.getClientRects(),contextElement:me??u.content??void 0})},[u,be,me,f,v,w]);const ye=Z?.raw.ranges.map(W=>`${W.start}-${W.end}`).join(",")??"";L.useEffect(()=>{_(null),j(null),B(null),X(!1),clearTimeout(P.current),clearTimeout(M.current)},[ye,le]),L.useEffect(()=>()=>{clearTimeout(P.current),clearTimeout(M.current)},[]);const Ae=()=>{u.clearSelection(),u.activate(null)};L.useEffect(()=>{if(!le)return;const W=ue=>{ue.target instanceof Element&&ue.target.closest("[data-limr-selection-ui],.limr-sidebar-card,.limr-overlay-positioner,[data-limr-anchor]")||u.interaction.get().activeHighlight&&u.clearSelection()},re=ue=>{ue.key!=="Escape"||ue.defaultPrevented||(N?(j(null),be.floating.current?.querySelector(`[data-action-id="${CSS.escape(N)}"] button`)?.focus()):Ae(),ue.preventDefault())};return document.addEventListener("pointerdown",W),document.addEventListener("keydown",re),()=>{document.removeEventListener("pointerdown",W),document.removeEventListener("keydown",re)}},[le,N,u,be]);const Ne=W=>{clearTimeout(P.current),j(W)},De=async(W,re)=>{if(!(!H||C.current||W.disabled?.(H))){C.current=!0,E(W.id),_(null);try{await re()}catch(ue){u.signal.aborted||_(ue instanceof Error?ue.message:String(ue))}finally{C.current=!1,u.signal.aborted||E(null)}}},Me=W=>({...H,busy:!!S,expanded:N===W.id,highlightAppearance:ge,setHighlightAppearance:Y,expand:()=>Ne(W.id),collapse:()=>j(null),run:re=>De(W,()=>re(H))}),ce=W=>De(W,async()=>{W.run?await W.run(Me(W)):W.renderExpanded&&(N===W.id?j(null):Ne(W.id)),W.successLabel&&!u.signal.aborted&&(B(W.id),clearTimeout(M.current),M.current=setTimeout(()=>B(null),2400))});if(!le||!H)return null;const je=W=>{const re=z===W.id&&W.successLabel?W.successLabel:W.label;return typeof re=="function"?re(H):re},$e=q.filter(W=>W.type!=="highlight").length,Ge=te.some(W=>W.id==="delete-annotations")&&$e>1?H.locale.deleteAnnotationsHint.replace("{count}",String($e)):null;return b.jsx(m1,{root:i,children:b.jsx("div",{ref:be.setFloating,className:`limr-selection-toolbar ${o}`,style:{...s,...xe,visibility:ae?void 0:"hidden"},role:"toolbar","aria-label":"Text actions","data-limr-selection-ui":"true","data-limr-theme":p,"data-limr-appearance":d,"data-placement":de,"data-highlight":ze?.id,"data-readonly":U||void 0,"data-expanded":he?.id,onMouseDown:W=>{(!(W.target instanceof Element)||!W.target.closest("input,textarea,select,[contenteditable]"))&&W.preventDefault()},onPointerEnter:()=>clearTimeout(P.current),onPointerLeave:W=>{W.pointerType!=="mouse"||W.currentTarget.contains(document.activeElement)||(P.current=setTimeout(()=>j(null),200))},onBlur:W=>{!W.currentTarget.contains(W.relatedTarget)&&!W.currentTarget.matches(":hover")&&j(null)},onKeyDown:W=>{if(!(W.target instanceof Element&&W.target.closest(".limr-toolbar-panel"))&&["ArrowRight","ArrowLeft","Home","End","ArrowDown","ArrowUp"].includes(W.key)){if(W.key==="ArrowDown"||W.key==="ArrowUp"){const re=W.target.closest("[data-action-id]")?.dataset.actionId,ue=te.find(Re=>Re.id===re);ue?.renderExpanded&&(Ne(ue.id),requestAnimationFrame(()=>be.floating.current?.querySelector(".limr-toolbar-panel button,.limr-toolbar-panel input,.limr-toolbar-panel textarea")?.focus()))}else{const re=Array.from(W.currentTarget.querySelectorAll(".limr-toolbar-actions button:not(:disabled)")),ue=re.indexOf(document.activeElement),Re=W.key==="Home"?0:W.key==="End"?re.length-1:(ue+(W.key==="ArrowRight"?1:re.length-1))%re.length;re[Re]?.focus()}W.preventDefault()}},children:b.jsxs("div",{className:"limr-toolbar-surface","data-ready":ae||void 0,children:[b.jsx("div",{className:"limr-toolbar-actions",children:c&&!U?c({context:H,actions:te,run:ce}):te.map((W,re)=>b.jsx("div",{className:"limr-toolbar-item","data-action-id":W.id,"data-active":N===W.id||void 0,"data-tone":W.tone,"data-status":z===W.id?"success":void 0,style:{"--limr-tool-index":re},onPointerEnter:ue=>{if(!(ue.pointerType!=="mouse"||S||W.disabled?.(H))&&!(he&&he.id!==W.id&&be.floating.current?.querySelector(".limr-toolbar-panel")?.contains(document.activeElement))){clearTimeout(P.current),W.renderExpanded?Ne(W.id):j(null);try{W.onHover?.(Me(W))}catch(Re){_(Re instanceof Error?Re.message:String(Re))}}},children:W.render?W.render(Me(W)):b.jsx("button",{className:"limr-toolbar-action",type:"button",disabled:!!S||W.disabled?.(H),onClick:()=>{ce(W)},"aria-label":je(W),"aria-busy":S===W.id,"aria-expanded":W.renderExpanded?N===W.id:void 0,"aria-controls":W.renderExpanded&&N===W.id?V:void 0,"aria-describedby":W.id==="delete-annotations"&&Ge&&I?`${V}-delete`:void 0,onPointerEnter:ue=>{W.id==="delete-annotations"&&ue.pointerType!=="touch"&&X(!0)},onPointerLeave:ue=>{W.id==="delete-annotations"&&X(ue.currentTarget.matches(":focus-visible"))},onFocus:ue=>{W.id==="delete-annotations"&&ue.currentTarget.matches(":focus-visible")&&X(!0)},onBlur:ue=>{W.id==="delete-annotations"&&!ue.currentTarget.matches(":hover")&&X(!1)},children:b.jsxs(Hj,{state:je(W),children:[b.jsxs("span",{className:"limr-tool-face","data-visible":z!==W.id||void 0,"aria-hidden":"true",children:[b.jsx("span",{className:"limr-tool-icon",children:typeof W.icon=="function"?W.icon(H):W.icon},typeof W.label=="function"?W.label(H):W.label),b.jsx("span",{className:"limr-tool-label limr-underline",children:typeof W.label=="function"?W.label(H):W.label})]}),W.successLabel&&b.jsxs("span",{className:"limr-tool-face","data-visible":z===W.id||void 0,"aria-hidden":"true",children:[b.jsx("span",{className:"limr-tool-icon",children:W.successIcon??(typeof W.icon=="function"?W.icon(H):W.icon)}),b.jsx("span",{className:"limr-tool-label limr-underline",children:typeof W.successLabel=="function"?W.successLabel(H):W.successLabel})]})]})})},W.id))}),U&&b.jsx("p",{className:"limr-toolbar-readonly-hint",children:H.locale.inlineHighlightHint??"Markdown inline highlight, editing unavailable"}),he&&b.jsx("div",{id:V,className:"limr-toolbar-panel",role:"group","aria-label":je(he),children:b.jsx(D0,{active:!0,label:je(he),children:he.renderExpanded(Me(he))})},he.id),Ge&&b.jsx(qi,{open:I,keepMounted:!0,className:"limr-toolbar-delete-warning",children:b.jsx("p",{id:`${V}-delete`,className:"limr-toolbar-delete-hint",children:Ge})}),R&&b.jsx("span",{role:"alert",className:"limr-action-error",children:R})]},ye)})})}function sn({actions:t,toc:i=!0,sidebar:a=!0,followOutput:o=!1,sidebarBreakpoint:s=1120,fillHeight:c=!0,className:u,style:d,...p}){return b.jsx(Nl,{...p,children:b.jsx(Bj,{actions:t,toc:i,sidebar:a,followOutput:o,sidebarBreakpoint:s,fillHeight:c,className:u,style:d})})}function Bj({actions:t,toc:i,sidebar:a,followOutput:o,sidebarBreakpoint:s,fillHeight:c,className:u,style:d}){const p=bt(),f=qe(p.configuration,_=>_.scrollRoot),y=qe(p.layout,_=>_),g=po(),x=mo(),v=L.useRef(null),w=L.useRef(null),A=L.useRef(null);qm(A,p,":scope > .limr-prose");const[T,S]=L.useState(0),[E,C]=L.useState(0);Et(()=>{if(!c||!v.current)return;const _=v.current.getBoundingClientRect().top-p.getViewportTop()-(f?.clientTop??0)+p.getScrollTop();C(Math.max(0,(f?.clientHeight??window.innerHeight)-_))},[p,f,c,y,T]),L.useEffect(()=>{const _=v.current;if(!_)return;const N=new ResizeObserver(()=>{S(_.clientWidth),p.requestLayout()});return N.observe(_),f&&N.observe(f),_.parentElement&&N.observe(_.parentElement),S(_.clientWidth),()=>N.disconnect()},[p,f,s]),Et(()=>{const _=w.current;if(!_)return;let N=0;const j=()=>{if(N=0,!_.clientWidth)return;const I=window.visualViewport;let X=I?.offsetTop??0,oe=X+(I?.height??window.innerHeight);if(f){const M=f.getBoundingClientRect().top+f.clientTop;X=Math.max(X,M),oe=Math.min(oe,M+f.clientHeight)}const Y=v.current.getBoundingClientRect();_.toggleAttribute("inert",Y.bottom<=X||Y.top>=oe);const P=`${Math.max(0,oe-Math.max(X,_.getBoundingClientRect().top)).toFixed(2)}px`;_.style.getPropertyValue("--limr-toc-available-height")!==P&&_.style.setProperty("--limr-toc-available-height",P)},z=()=>{N||(N=requestAnimationFrame(j))},B=[p.layout.subscribe(z),p.viewport.subscribe(z)];return window.addEventListener("scroll",z,{passive:!0}),window.addEventListener("resize",z),window.visualViewport?.addEventListener("resize",z),window.visualViewport?.addEventListener("scroll",z),j(),()=>{cancelAnimationFrame(N),B.forEach(I=>I()),window.removeEventListener("scroll",z),window.removeEventListener("resize",z),window.visualViewport?.removeEventListener("resize",z),window.visualViewport?.removeEventListener("scroll",z),_.removeAttribute("inert"),_.style.removeProperty("--limr-toc-available-height")}},[p,f,i]);const R=!!a&&T>=s;return b.jsxs("div",{ref:v,className:`limr-reader ${u??""}`,style:{"--limr-reader-available-height":c?`${E}px`:void 0,...d},"data-fill-height":c||void 0,"data-sidebar":R||void 0,"data-toc":i&&T>=800||void 0,"data-limr-theme":x,"data-limr-appearance":g,children:[i&&b.jsxs(b.Fragment,{children:[b.jsx("div",{ref:w,className:"limr-reader-toc",children:b.jsx(rc,{})}),b.jsx(qj,{})]}),b.jsx("main",{ref:A,className:"limr-reader-content",children:b.jsx(ni,{followOutput:o})}),R&&b.jsx(B0,{}),b.jsx(Jm,{disabled:R}),b.jsx(b1,{actions:t})]})}function qj(){const t=ln(),[i,a]=L.useState(!1),o=L.useId();return b.jsxs("div",{className:"limr-reader-mobile-toc",children:[b.jsxs("button",{type:"button",className:"limr-mobile-toc-toggle","aria-expanded":i,"aria-controls":o,onClick:()=>a(s=>!s),children:[b.jsx("span",{children:t.contents}),b.jsx("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:b.jsx("path",{d:"m6 8 4 4 4-4"})})]}),b.jsx("div",{id:o,children:b.jsx(qi,{open:i,keepMounted:!0,children:b.jsx(rc,{})})})]})}const v1=or({name:"counter",component:({children:t,incomplete:i})=>{const[a,o]=L.useState(0);return b.jsxs("section",{"data-counter-open":i,children:[b.jsxs("button",{onClick:()=>o(s=>s+1),children:["Count ",a]}),t]})}}),x1=or({name:"atomic-card",selection:"atomic",component:({children:t,renderAttribute:i})=>b.jsxs("section",{"data-atomic-card":"",children:[b.jsx("header",{children:i("title")}),t]})}),Pj={name:"stream-effect",streaming:{effect:{className:"custom-increment",keyframes:[{opacity:.2},{opacity:1}],timing:{duration:1200}}}},Uj=[v1,x1],Fj=[v1,x1,Pj],Vj=Im().filter(t=>t.name!=="footnotes");function $j(){const[t,i]=L.useState({source:"",streaming:!0}),[a,o]=L.useState(null);return L.useEffect(()=>{window.limrStream=s=>oo.flushSync(()=>i(s))},[]),b.jsxs("main",{style:{maxWidth:t.sidebar?1700:780,padding:24,marginInline:"auto"},children:[b.jsx(sn,{source:t.source,streaming:t.streaming??!0,streamEffect:t.effect,typography:t.typography,extensions:t.legacyFootnotes?Vj:void 0,locale:t.chinese?Vn:void 0,plugins:t.custom?Fj:Uj,toc:!1,sidebar:t.sidebar??!1,onSelectionChange:o}),b.jsx("output",{id:"stream-selection",hidden:!0,children:JSON.stringify(a)})]})}var Sf={exports:{}},ml={},kf={exports:{}},Tf={};var ew;function Gj(){return ew||(ew=1,(function(t){function i(V,$){var Z=V.length;V.push($);e:for(;0<Z;){var me=Z-1>>>1,q=V[me];if(0<s(q,$))V[me]=$,V[Z]=q,Z=me;else break e}}function a(V){return V.length===0?null:V[0]}function o(V){if(V.length===0)return null;var $=V[0],Z=V.pop();if(Z!==$){V[0]=Z;e:for(var me=0,q=V.length,ze=q>>>1;me<ze;){var ge=2*(me+1)-1,H=V[ge],U=ge+1,te=V[U];if(0>s(H,Z))U<q&&0>s(te,H)?(V[me]=te,V[U]=Z,me=U):(V[me]=H,V[ge]=Z,me=ge);else if(U<q&&0>s(te,Z))V[me]=te,V[U]=Z,me=U;else break e}}return $}function s(V,$){var Z=V.sortIndex-$.sortIndex;return Z!==0?Z:V.id-$.id}if(t.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;t.unstable_now=function(){return c.now()}}else{var u=Date,d=u.now();t.unstable_now=function(){return u.now()-d}}var p=[],f=[],y=1,g=null,x=3,v=!1,w=!1,A=!1,T=!1,S=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,C=typeof setImmediate<"u"?setImmediate:null;function R(V){for(var $=a(f);$!==null;){if($.callback===null)o(f);else if($.startTime<=V)o(f),$.sortIndex=$.expirationTime,i(p,$);else break;$=a(f)}}function _(V){if(A=!1,R(V),!w)if(a(p)!==null)w=!0,N||(N=!0,oe());else{var $=a(f);$!==null&&M(_,$.startTime-V)}}var N=!1,j=-1,z=5,B=-1;function I(){return T?!0:!(t.unstable_now()-B<z)}function X(){if(T=!1,N){var V=t.unstable_now();B=V;var $=!0;try{e:{w=!1,A&&(A=!1,E(j),j=-1),v=!0;var Z=x;try{t:{for(R(V),g=a(p);g!==null&&!(g.expirationTime>V&&I());){var me=g.callback;if(typeof me=="function"){g.callback=null,x=g.priorityLevel;var q=me(g.expirationTime<=V);if(V=t.unstable_now(),typeof q=="function"){g.callback=q,R(V),$=!0;break t}g===a(p)&&o(p),R(V)}else o(p);g=a(p)}if(g!==null)$=!0;else{var ze=a(f);ze!==null&&M(_,ze.startTime-V),$=!1}}break e}finally{g=null,x=Z,v=!1}$=void 0}}finally{$?oe():N=!1}}}var oe;if(typeof C=="function")oe=function(){C(X)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,P=Y.port2;Y.port1.onmessage=X,oe=function(){P.postMessage(null)}}else oe=function(){S(X,0)};function M(V,$){j=S(function(){V(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(V){V.callback=null},t.unstable_forceFrameRate=function(V){0>V||125<V?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<V?Math.floor(1e3/V):5},t.unstable_getCurrentPriorityLevel=function(){return x},t.unstable_next=function(V){switch(x){case 1:case 2:case 3:var $=3;break;default:$=x}var Z=x;x=$;try{return V()}finally{x=Z}},t.unstable_requestPaint=function(){T=!0},t.unstable_runWithPriority=function(V,$){switch(V){case 1:case 2:case 3:case 4:case 5:break;default:V=3}var Z=x;x=V;try{return $()}finally{x=Z}},t.unstable_scheduleCallback=function(V,$,Z){var me=t.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?me+Z:me):Z=me,V){case 1:var q=-1;break;case 2:q=250;break;case 5:q=1073741823;break;case 4:q=1e4;break;default:q=5e3}return q=Z+q,V={id:y++,callback:$,priorityLevel:V,startTime:Z,expirationTime:q,sortIndex:-1},Z>me?(V.sortIndex=Z,i(f,V),a(p)===null&&V===a(f)&&(A?(E(j),j=-1):A=!0,M(_,Z-me))):(V.sortIndex=q,i(p,V),w||v||(w=!0,N||(N=!0,oe()))),V},t.unstable_shouldYield=I,t.unstable_wrapCallback=function(V){var $=x;return function(){var Z=x;x=$;try{return V.apply(this,arguments)}finally{x=Z}}}})(Tf)),Tf}var tw;function Yj(){return tw||(tw=1,kf.exports=Gj()),kf.exports}var nw;function Jj(){if(nw)return ml;nw=1;var t=Yj(),i=pm(),a=jw();function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var r=2;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){for(var n=e,r=n;r&&!r.alternate;)n=r,(n.flags&4098)!==0&&(e=n.return),r=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function u(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(c(e)!==e)throw Error(o(188))}function f(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(o(188));return n!==e?null:e}for(var r=e,l=n;;){var h=r.return;if(h===null)break;var m=h.alternate;if(m===null){if(l=h.return,l!==null){r=l;continue}break}if(h.child===m.child){for(m=h.child;m;){if(m===r)return p(h),e;if(m===l)return p(h),n;m=m.sibling}throw Error(o(188))}if(r.return!==l.return)r=h,l=m;else{for(var k=!1,O=h.child;O;){if(O===r){k=!0,r=h,l=m;break}if(O===l){k=!0,l=h,r=m;break}O=O.sibling}if(!k){for(O=m.child;O;){if(O===r){k=!0,r=m,l=h;break}if(O===l){k=!0,l=m,r=h;break}O=O.sibling}if(!k)throw Error(o(189))}}if(r.alternate!==l)throw Error(o(190))}if(r.tag!==3)throw Error(o(188));return r.stateNode.current===r?e:n}function y(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=y(e),n!==null)return n;e=e.sibling}return null}function g(e,n,r,l,h,m){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&r(e,l,h,m)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&g(e.child,n,r,l,h,m))return!0;e=e.sibling}return!1}function x(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function v(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function w(e){var n=[null,null],r=x(e);return r===null||A(n,e,r.child,{foundSelf:!1}),n}function A(e,n,r,l){for(;r!==null;){if(r===n)l.foundSelf=!0;else if(r.tag===5||r.tag===27||r.tag===6){if(l.foundSelf)return e[1]=r,!0;e[0]=r}else if((r.tag!==22||r.memoizedState===null)&&A(e,n,r.child,l))return!0;r=r.sibling}return!1}function T(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(o(559))}}var S=null,E=null;function C(e,n,r){return e===r?!0:e===n?(S=e,!0):!1}function R(e,n,r){return e===r?(E=e,!1):e===n?(E!==null&&(S=e),!0):!1}function _(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function N(e,n,r){for(var l=0,h=e;h;h=r(h))l++;h=0;for(var m=n;m;m=r(m))h++;for(;0<l-h;)e=r(e),l--;for(;0<h-l;)n=r(n),h--;for(;l--;){if(e===n||n!==null&&e===n.alternate)return e;e=r(e),n=r(n)}return null}var j=Object.assign,z=Symbol.for("react.element"),B=Symbol.for("react.transitional.element"),I=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),oe=Symbol.for("react.strict_mode"),Y=Symbol.for("react.profiler"),P=Symbol.for("react.consumer"),M=Symbol.for("react.context"),V=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),Z=Symbol.for("react.suspense_list"),me=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),ze=Symbol.for("react.activity"),ge=Symbol.for("react.legacy_hidden"),H=Symbol.for("react.memo_cache_sentinel"),U=Symbol.for("react.view_transition"),te=Symbol.for("react.recoverable"),he=Symbol.iterator;function ve(e){return e===null||typeof e!="object"?null:(e=he&&e[he]||e["@@iterator"],typeof e=="function"?e:null)}var le=Symbol.for("react.client.reference");function be(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===le?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case X:return"Fragment";case Y:return"Profiler";case oe:return"StrictMode";case $:return"Suspense";case Z:return"SuspenseList";case ze:return"Activity";case U:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case I:return"Portal";case M:return e.displayName||"Context";case P:return(e._context.displayName||"Context")+".Consumer";case V:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case me:return n=e.displayName||null,n!==null?n:be(e.type)||"Memo";case q:n=e._payload,e=e._init;try{return be(e(n))}catch{}}return null}var xe=Array.isArray,de=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ae=a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ye={pending:!1,data:null,method:null,action:null},Ae=[],Ne=-1;function De(e){return{current:e}}function Me(e){0>Ne||(e.current=Ae[Ne],Ae[Ne]=null,Ne--)}function ce(e,n){Ne++,Ae[Ne]=e.current,e.current=n}var je=De(null),$e=De(null),Ge=De(null),W=De(null);function re(e,n){switch(ce(Ge,n),ce($e,e),ce(je,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?_b(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=_b(n),e=Ib(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Me(je),ce(je,e)}function ue(){Me(je),Me($e),Me(Ge)}function Re(e){var n=e.memoizedState;n!==null&&(Jr._currentValue=n.memoizedState,ce(W,e)),n=je.current;var r=Ib(n,e.type);n!==r&&(ce($e,e),ce(je,r))}function Se(e){$e.current===e&&(Me(je),Me($e)),W.current===e&&(Me(W),Jr._currentValue=ye)}var G,D;function we(e){if(G===void 0)try{throw Error()}catch(r){var n=r.stack.trim().match(/\n( *(at )?)/);G=n&&n[1]||"",D=-1<r.stack.indexOf(`
    at`)?" (<anonymous>)":-1<r.stack.indexOf("@")?"@unknown:0:0":""}return`
`+G+e+D}var Te=!1;function Ie(e,n){if(!e||Te)return"";Te=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(n){var pe=function(){throw Error()};if(Object.defineProperty(pe.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(pe,[])}catch(Ee){var K=Ee}Reflect.construct(e,[],pe)}else{try{pe.call()}catch(Ee){K=Ee}pe=!1;try{var ie=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),pe=!0,new e}finally{pe&&(ie!==void 0?Object.defineProperty(e.prototype,"props",ie):delete e.prototype.props)}}}else{try{throw Error()}catch(Ee){K=Ee}(pe=e())&&typeof pe.catch=="function"&&pe.catch(function(){})}}catch(Ee){if(Ee&&K&&typeof Ee.stack=="string")return[Ee.stack,K.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var h=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");h&&h.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var m=l.DetermineComponentFrameRoot(),k=m[0],O=m[1];if(k&&O){var F=k.split(`
`),ee=O.split(`
`);for(h=l=0;l<F.length&&!F[l].includes("DetermineComponentFrameRoot");)l++;for(;h<ee.length&&!ee[h].includes("DetermineComponentFrameRoot");)h++;if(l===F.length||h===ee.length)for(l=F.length-1,h=ee.length-1;1<=l&&0<=h&&F[l]!==ee[h];)h--;for(;1<=l&&0<=h;l--,h--)if(F[l]!==ee[h]){if(l!==1||h!==1)do if(l--,h--,0>h||F[l]!==ee[h]){var se=`
`+F[l].replace(" at new "," at ");return e.displayName&&se.includes("<anonymous>")&&(se=se.replace("<anonymous>",e.displayName)),se}while(1<=l&&0<=h);break}}}finally{Te=!1,Error.prepareStackTrace=r}return(r=e?e.displayName||e.name:"")?we(r):""}function Oe(e,n){switch(e.tag){case 26:case 27:case 5:return we(e.type);case 16:return we("Lazy");case 13:return e.child!==n&&n!==null?we("Suspense Fallback"):we("Suspense");case 19:return we("SuspenseList");case 0:case 15:return Ie(e.type,!1);case 11:return Ie(e.type.render,!1);case 1:return Ie(e.type,!0);case 31:return we("Activity");case 30:return we("ViewTransition");default:return""}}function et(e){try{var n="",r=null;do n+=Oe(e,r),r=e,e=e.return;while(e);return n}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Ye=Object.prototype.hasOwnProperty,ht=t.unstable_scheduleCallback,Qe=t.unstable_cancelCallback,kt=t.unstable_shouldYield,Je=t.unstable_requestPaint,ct=t.unstable_now,Bt=t.unstable_getCurrentPriorityLevel,jn=t.unstable_ImmediatePriority,On=t.unstable_UserBlockingPriority,Il=t.unstable_NormalPriority,X1=t.unstable_LowPriority,lp=t.unstable_IdlePriority,Z1=t.log,K1=t.unstable_setDisableYieldValue,yo=null,vn=null;function Fi(e){if(typeof Z1=="function"&&K1(e),vn&&typeof vn.setStrictMode=="function")try{vn.setStrictMode(yo,e)}catch{}}var xn=Math.clz32?Math.clz32:eS,Q1=Math.log,W1=Math.LN2;function eS(e){return e>>>=0,e===0?32:31-(Q1(e)/W1|0)|0}var Hl=256,Bl=262144,ql=4194304;function Ca(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Pl(e,n,r){var l=e.pendingLanes;if(l===0)return 0;var h=0,m=e.suspendedLanes,k=e.pingedLanes;e=e.warmLanes;var O=l&134217727;return O!==0?(l=O&~m,l!==0?h=Ca(l):(k&=O,k!==0?h=Ca(k):r||(r=O&~e,r!==0&&(h=Ca(r))))):(O=l&~m,O!==0?h=Ca(O):k!==0?h=Ca(k):r||(r=l&~e,r!==0&&(h=Ca(r)))),h===0?0:n!==0&&n!==h&&(n&m)===0&&(m=h&-h,r=n&-n,m>=r||m===32&&(r&4194048)!==0)?n:h}function bo(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function sp(e,n){(n&8)!==0&&(n|=n&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=n;0<r;){var l=31-xn(r),h=1<<l;n|=e[l],r&=~h}return n}function tS(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function up(){var e=ql;return ql<<=1,(ql&62914560)===0&&(ql=4194304),e}function mc(e){for(var n=[],r=0;31>r;r++)n.push(e);return n}function vo(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function nS(e,n,r,l,h,m){var k=e.pendingLanes;e.pendingLanes=r,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=r,e.entangledLanes&=r,e.errorRecoveryDisabledLanes&=r,e.shellSuspendCounter=0;var O=e.entanglements,F=e.expirationTimes,ee=e.hiddenUpdates;for(r=k&~r;0<r;){var se=31-xn(r),pe=1<<se;O[se]=0,F[se]=-1;var K=ee[se];if(K!==null)for(ee[se]=null,se=0;se<K.length;se++){var ie=K[se];ie!==null&&(ie.lane&=-536870913)}r&=~pe}l!==0&&cp(e,l,0),m!==0&&h===0&&e.tag!==0&&(e.suspendedLanes|=m&~(k&~n))}function cp(e,n,r){e.pendingLanes|=n,e.suspendedLanes&=~n;var l=31-xn(n);e.entangledLanes|=n,e.entanglements[l]=e.entanglements[l]|1073741824|r&261930}function dp(e,n){var r=e.entangledLanes|=n;for(e=e.entanglements;r;){var l=31-xn(r),h=1<<l;h&n|e[l]&n&&(e[l]|=n),r&=~h}}function hp(e,n){var r=n&-n;return r=(r&42)!==0?1:pc(r),(r&(e.suspendedLanes|n))!==0?0:r}function pc(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function gc(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function fp(){var e=ae.p;return e!==0?e:(e=window.event,e===void 0?32:xv(e.type))}function mp(e,n){var r=ae.p;try{return ae.p=e,n()}finally{ae.p=r}}var xi=Math.random().toString(36).slice(2),Vt="__reactFiber$"+xi,un="__reactProps$"+xi,sr="__reactContainer$"+xi,pp="__reactEvents$"+xi,iS="__reactListeners$"+xi,aS="__reactHandles$"+xi,gp="__reactResources$"+xi,xo="__reactMarker$"+xi,Ul="__reactLoad$"+xi;function Fl(e){delete e[Vt],delete e[un],delete e[iS],delete e[aS]}function Ra(e){var n;if(n=e[Vt])return n;for(var r=e.parentNode;r;){if(n=r[sr]||r[Vt]){if(r=n.alternate,n.child!==null||r!==null&&r.child!==null)for(e=ev(e);e!==null;){if(r=e[Vt])return r;e=ev(e)}return n}e=r,r=e.parentNode}return null}function ur(e){if(e=e[Vt]||e[sr]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function wo(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(o(33))}function cr(e){var n=e[gp];return n||(n=e[gp]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function qt(e){e[xo]=!0}function yp(e){e[Ul]=void 0}var bp=new Set,vp={};function Ma(e,n){dr(e,n),dr(e+"Capture",n)}function dr(e,n){for(vp[e]=n,e=0;e<n.length;e++)bp.add(n[e])}var rS=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),xp={},wp={};function oS(e){return Ye.call(wp,e)?!0:Ye.call(xp,e)?!1:rS.test(e)?wp[e]=!0:(xp[e]=!0,!1)}var lt=!1;function Sp(){var e=lt;return lt=!1,e}function Vl(e,n,r){if(oS(n))if(r===null)e.removeAttribute(n);else{switch(typeof r){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var l=n.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,r)}}function $l(e,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,r)}}function wi(e,n,r,l){if(l===null)e.removeAttribute(r);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(r);return}e.setAttributeNS(n,r,l)}}function wn(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function kp(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function lS(e,n,r){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var h=l.get,m=l.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return h.call(this)},set:function(k){r=""+k,m.call(this,k)}}),Object.defineProperty(e,n,{enumerable:l.enumerable}),{getValue:function(){return r},setValue:function(k){r=""+k},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function yc(e){if(!e._valueTracker){var n=kp(e)?"checked":"value";e._valueTracker=lS(e,n,""+e[n])}}function Tp(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var r=n.getValue(),l="";return e&&(l=kp(e)?e.checked?"true":"false":e.value),e=l,e!==r?(n.setValue(e),!0):!1}var sS=/[\n"\\]/g;function Ln(e){return e.replace(sS,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function bc(e,n,r,l,h,m,k,O){e.name="",k!=null&&typeof k!="function"&&typeof k!="symbol"&&typeof k!="boolean"?e.type=k:e.removeAttribute("type"),n!=null?k==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+wn(n)):e.value!==""+wn(n)&&(e.value=""+wn(n)):k!=="submit"&&k!=="reset"||e.removeAttribute("value"),n!=null?k==="number"&&e.value==n?vc(e,wn(e.value)):vc(e,wn(n)):r!=null?vc(e,wn(r)):l!=null&&e.removeAttribute("value"),h==null&&m!=null&&(e.defaultChecked=!!m),h!=null&&(e.checked=h&&typeof h!="function"&&typeof h!="symbol"),O!=null&&typeof O!="function"&&typeof O!="symbol"&&typeof O!="boolean"?e.name=""+wn(O):e.removeAttribute("name")}function Ap(e,n,r,l,h,m,k,O){if(m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"&&(e.type=m),n!=null||r!=null){if(!(m!=="submit"&&m!=="reset"||n!=null)){yc(e);return}r=r!=null?""+wn(r):"",n=n!=null?""+wn(n):r,O||n===e.value||(e.value=n),e.defaultValue=n}l=l??h,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=O?e.checked:!!l,e.defaultChecked=!!l,k!=null&&typeof k!="function"&&typeof k!="symbol"&&typeof k!="boolean"&&(e.name=k),yc(e)}function vc(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function hr(e,n,r,l){if(e=e.options,n){n={};for(var h=0;h<r.length;h++)n["$"+r[h]]=!0;for(r=0;r<e.length;r++)h=n.hasOwnProperty("$"+e[r].value),e[r].selected!==h&&(e[r].selected=h),h&&l&&(e[r].defaultSelected=!0)}else{for(r=""+wn(r),n=null,h=0;h<e.length;h++){if(e[h].value===r){e[h].selected=!0,l&&(e[h].defaultSelected=!0);return}n!==null||e[h].disabled||(n=e[h])}n!==null&&(n.selected=!0)}}function Ep(e,n,r){if(n!=null&&(n=""+wn(n),n!==e.value&&(e.value=n),r==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=r!=null?""+wn(r):""}function Cp(e,n,r,l){if(n==null){if(l!=null){if(r!=null)throw Error(o(92));if(xe(l)){if(1<l.length)throw Error(o(93));l=l[0]}r=l}r==null&&(r=""),n=r}r=wn(n),e.defaultValue=r,l=e.textContent,l===r&&l!==""&&l!==null&&(e.value=l),yc(e)}function fr(e,n){if(n){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=n;return}}e.textContent=n}var uS=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Rp(e,n,r){var l=n.indexOf("--")===0;r==null||typeof r=="boolean"||r===""?l?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":l?e.setProperty(n,r):typeof r!="number"||r===0||uS.has(n)?n==="float"?e.cssFloat=r:e[n]=(""+r).trim():e[n]=r+"px"}function Mp(e,n,r){if(n!=null&&typeof n!="object")throw Error(o(62));if(e=e.style,r!=null){for(var l in r)!r.hasOwnProperty(l)||n!=null&&n.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="",lt=!0);for(var h in n)l=n[h],n.hasOwnProperty(h)&&r[h]!==l&&(Rp(e,h,l),lt=!0)}else for(var m in n)n.hasOwnProperty(m)&&Rp(e,m,n[m])}function xc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var cS=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),dS=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Gl(e){return dS.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ai(){}var wc=null;function Sc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var mr=null,pr=null;function Np(e){var n=ur(e);if(n&&(e=n.stateNode)){var r=e[un]||null;e:switch(e=n.stateNode,n.type){case"input":if(bc(e,r.value,r.defaultValue,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name),n=r.name,r.type==="radio"&&n!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll('input[name="'+Ln(""+n)+'"][type="radio"]'),n=0;n<r.length;n++){var l=r[n];if(l!==e&&l.form===e.form){var h=l[un]||null;if(!h)throw Error(o(90));bc(l,h.value,h.defaultValue,h.defaultValue,h.checked,h.defaultChecked,h.type,h.name)}}for(n=0;n<r.length;n++)l=r[n],l.form===e.form&&Tp(l)}break e;case"textarea":Ep(e,r.value,r.defaultValue);break e;case"select":n=r.value,n!=null&&hr(e,!!r.multiple,n,!1)}}}var kc=!1;function Dp(e,n,r){if(kc)return e(n,r);kc=!0;try{var l=e(n);return l}finally{if(kc=!1,(mr!==null||pr!==null)&&(Gs(),mr&&(n=mr,e=pr,pr=mr=null,Np(n),e)))for(n=0;n<e.length;n++)Np(e[n])}}function So(e,n){var r=e.stateNode;if(r===null)return null;var l=r[un]||null;if(l===null)return null;r=l[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(o(231,n,typeof r));return r}var Si=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Tc=!1;if(Si)try{var ko={};Object.defineProperty(ko,"passive",{get:function(){Tc=!0}}),window.addEventListener("test",ko,ko),window.removeEventListener("test",ko,ko)}catch{Tc=!1}var Vi=null,Ac=null,Yl=null;function jp(){if(Yl)return Yl;var e,n=Ac,r=n.length,l,h="value"in Vi?Vi.value:Vi.textContent,m=h.length;for(e=0;e<r&&n[e]===h[e];e++);var k=r-e;for(l=1;l<=k&&n[r-l]===h[m-l];l++);return Yl=h.slice(e,1<l?1-l:void 0)}function Jl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function Xl(){return!0}function Op(){return!1}function en(e){function n(r,l,h,m,k){this._reactName=r,this._targetInst=h,this.type=l,this.nativeEvent=m,this.target=k,this.currentTarget=null;for(var O in e)e.hasOwnProperty(O)&&(r=e[O],this[O]=r?r(m):m[O]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?Xl:Op,this.isPropagationStopped=Op,this}return j(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Xl)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Xl)},persist:function(){},isPersistent:Xl}),n}var $i={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zl=en($i),To=j({},$i,{view:0,detail:0}),hS=en(To),Ec,Cc,Ao,Kl=j({},To,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Mc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ao&&(Ao&&e.type==="mousemove"?(Ec=e.screenX-Ao.screenX,Cc=e.screenY-Ao.screenY):Cc=Ec=0,Ao=e),Ec)},movementY:function(e){return"movementY"in e?e.movementY:Cc}}),Lp=en(Kl),fS=j({},Kl,{dataTransfer:0}),mS=en(fS),pS=j({},To,{relatedTarget:0}),Rc=en(pS),gS=j({},$i,{animationName:0,elapsedTime:0,pseudoElement:0}),yS=en(gS),bS=j({},$i,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),vS=en(bS),xS=j({},$i,{data:0}),zp=en(xS),wS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},SS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function TS(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=kS[e])?!!n[e]:!1}function Mc(){return TS}var AS=j({},To,{key:function(e){if(e.key){var n=wS[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Jl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?SS[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Mc,charCode:function(e){return e.type==="keypress"?Jl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Jl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),ES=en(AS),CS=j({},Kl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),_p=en(CS),RS=j({},$i,{submitter:0}),MS=en(RS),NS=j({},To,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Mc}),DS=en(NS),jS=j({},$i,{propertyName:0,elapsedTime:0,pseudoElement:0}),OS=en(jS),LS=j({},Kl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),zS=en(LS),_S=j({},$i,{newState:0,oldState:0,source:0}),IS=en(_S),HS=[9,13,27,32],Nc=Si&&"CompositionEvent"in window,Eo=null;Si&&"documentMode"in document&&(Eo=document.documentMode);var BS=Si&&"TextEvent"in window&&!Eo,Ip=Si&&(!Nc||Eo&&8<Eo&&11>=Eo),Hp=" ",Bp=!1;function qp(e,n){switch(e){case"keyup":return HS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Pp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var gr=!1;function qS(e,n){switch(e){case"compositionend":return Pp(n);case"keypress":return n.which!==32?null:(Bp=!0,Hp);case"textInput":return e=n.data,e===Hp&&Bp?null:e;default:return null}}function PS(e,n){if(gr)return e==="compositionend"||!Nc&&qp(e,n)?(e=jp(),Yl=Ac=Vi=null,gr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Ip&&n.locale!=="ko"?null:n.data;default:return null}}var US={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Up(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!US[e.type]:n==="textarea"}function Fp(e,n,r,l){mr?pr?pr.push(l):pr=[l]:mr=l,n=Qs(n,"onChange"),0<n.length&&(r=new Zl("onChange","change",null,r,l),e.push({event:r,listeners:n}))}var Co=null,Ro=null;function FS(e){Nb(e,0)}function Ql(e){var n=wo(e);if(Tp(n))return e}function Vp(e,n){if(e==="change")return n}var $p=!1;if(Si){var Dc;if(Si){var jc="oninput"in document;if(!jc){var Gp=document.createElement("div");Gp.setAttribute("oninput","return;"),jc=typeof Gp.oninput=="function"}Dc=jc}else Dc=!1;$p=Dc&&(!document.documentMode||9<document.documentMode)}function Yp(){Co&&(Co.detachEvent("onpropertychange",Jp),Ro=Co=null)}function Jp(e){if(e.propertyName==="value"&&Ql(Ro)){var n=[];Fp(n,Ro,e,Sc(e)),Dp(FS,n)}}function VS(e,n,r){e==="focusin"?(Yp(),Co=n,Ro=r,Co.attachEvent("onpropertychange",Jp)):e==="focusout"&&Yp()}function $S(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ql(Ro)}function GS(e,n){if(e==="click")return Ql(n)}function YS(e,n){if(e==="input"||e==="change")return Ql(n)}function JS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Sn=typeof Object.is=="function"?Object.is:JS;function Mo(e,n){if(Sn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var r=Object.keys(e),l=Object.keys(n);if(r.length!==l.length)return!1;for(l=0;l<r.length;l++){var h=r[l];if(!Ye.call(n,h)||!Sn(e[h],n[h]))return!1}return!0}function Oc(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Xp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Zp(e,n){var r=Xp(e);e=0;for(var l;r;){if(r.nodeType===3){if(l=e+r.textContent.length,e<=n&&l>=n)return{node:r,offset:n-e};e=l}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Xp(r)}}function Kp(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Kp(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Qp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Oc(e.document);n instanceof e.HTMLIFrameElement;){try{var r=typeof n.contentWindow.location.href=="string"}catch{r=!1}if(r)e=n.contentWindow;else break;n=Oc(e.document)}return n}function Lc(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var XS=Si&&"documentMode"in document&&11>=document.documentMode,yr=null,zc=null,No=null,_c=!1;function Wp(e,n,r){var l=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;_c||yr==null||yr!==Oc(l)||(l=yr,"selectionStart"in l&&Lc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),No&&Mo(No,l)||(No=l,l=Qs(zc,"onSelect"),0<l.length&&(n=new Zl("onSelect","select",null,n,r),e.push({event:n,listeners:l}),n.target=yr)))}function Na(e,n){var r={};return r[e.toLowerCase()]=n.toLowerCase(),r["Webkit"+e]="webkit"+n,r["Moz"+e]="moz"+n,r}var br={animationend:Na("Animation","AnimationEnd"),animationiteration:Na("Animation","AnimationIteration"),animationstart:Na("Animation","AnimationStart"),transitionrun:Na("Transition","TransitionRun"),transitionstart:Na("Transition","TransitionStart"),transitioncancel:Na("Transition","TransitionCancel"),transitionend:Na("Transition","TransitionEnd")},Ic={},eg={};Si&&(eg=document.createElement("div").style,"AnimationEvent"in window||(delete br.animationend.animation,delete br.animationiteration.animation,delete br.animationstart.animation),"TransitionEvent"in window||delete br.transitionend.transition);function Da(e){if(Ic[e])return Ic[e];if(!br[e])return e;var n=br[e],r;for(r in n)if(n.hasOwnProperty(r)&&r in eg)return Ic[e]=n[r];return e}var tg=Da("animationend"),ng=Da("animationiteration"),ig=Da("animationstart"),ZS=Da("transitionrun"),KS=Da("transitionstart"),QS=Da("transitioncancel"),ag=Da("transitionend"),rg=new Map,Hc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Hc.push("scrollEnd");function $n(e,n){rg.set(e,n),Ma(n,[e])}var WS=0;function ki(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=Xn.identifierPrefix;var r=WS++;return e="_"+e+"t_"+r.toString(32)+"_",n.autoName=e}function og(e){if(e==null||typeof e=="string")return e;var n=null,r=Hr;if(r!==null)for(var l=0;l<r.length;l++){var h=e[r[l]];if(h!=null){if(h==="none")return"none";n=n==null?h:n+(" "+h)}}return n??e.default}function Ti(e,n){return e=og(e),n=og(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var Wl=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},zn=[],vr=0,Bc=0;function es(){for(var e=vr,n=Bc=vr=0;n<e;){var r=zn[n];zn[n++]=null;var l=zn[n];zn[n++]=null;var h=zn[n];zn[n++]=null;var m=zn[n];if(zn[n++]=null,l!==null&&h!==null){var k=l.pending;k===null?h.next=h:(h.next=k.next,k.next=h),l.pending=h}m!==0&&lg(r,h,m)}}function ts(e,n,r,l){zn[vr++]=e,zn[vr++]=n,zn[vr++]=r,zn[vr++]=l,Bc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function qc(e,n,r,l){return ts(e,n,r,l),ns(e)}function ja(e,n){return ts(e,null,null,n),ns(e)}function lg(e,n,r){e.lanes|=r;var l=e.alternate;l!==null&&(l.lanes|=r);for(var h=!1,m=e.return;m!==null;)m.childLanes|=r,l=m.alternate,l!==null&&(l.childLanes|=r),m.tag===22&&(e=m.stateNode,e===null||e._visibility&1||(h=!0)),e=m,m=m.return;return e.tag===3?(m=e.stateNode,h&&n!==null&&(h=31-xn(r),e=m.hiddenUpdates,l=e[h],l===null?e[h]=[n]:l.push(n),n.lane=r|536870912),m):null}function ns(e){if(50<Qo)throw Qo=0,$s=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var xr={};function ek(e,n,r,l){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function cn(e,n,r,l){return new ek(e,n,r,l)}function Pc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ai(e,n){var r=e.alternate;return r===null?(r=cn(e.tag,n,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=n,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&1206910976,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,n=e.dependencies,r.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r.refCleanup=e.refCleanup,r}function sg(e,n){e.flags&=1206910978;var r=e.alternate;return r===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=r.childLanes,e.lanes=r.lanes,e.child=r.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=r.memoizedProps,e.memoizedState=r.memoizedState,e.updateQueue=r.updateQueue,e.type=r.type,n=r.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function is(e,n,r,l,h,m){var k=0;if(l=e,typeof l=="function")Pc(l)&&(k=1);else if(typeof l=="string")k=RT(e,r,je.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(l){case ze:return e=cn(31,r,n,h),e.elementType=ze,e.lanes=m,e;case X:return Oa(r.children,h,m,n);case oe:k=8,h|=24;break;case Y:return e=cn(12,r,n,h|2),e.elementType=Y,e.lanes=m,e;case $:return e=cn(13,r,n,h),e.elementType=$,e.lanes=m,e;case Z:return e=cn(19,r,n,h),e.elementType=Z,e.lanes=m,e;case ge:case U:return e=h|32,e=cn(30,r,n,e),e.elementType=U,e.lanes=m,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof l=="object"&&l!==null)switch(l.$$typeof){case M:k=10;break e;case P:k=9;break e;case V:k=11;break e;case me:k=14;break e;case q:k=16,l=null;break e}k=29,r=Error(o(130,e===null?"null":typeof e,"")),l=null}return n=cn(k,r,n,h),n.elementType=e,n.type=l,n.lanes=m,n}function Oa(e,n,r,l){return e=cn(7,e,l,n),e.lanes=r,e}function Uc(e,n,r){return e=cn(6,e,null,n),e.lanes=r,e}function ug(e){var n=cn(18,null,null,0);return n.stateNode=e,n}function Fc(e,n,r){return n=cn(4,e.children!==null?e.children:[],e.key,n),n.lanes=r,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var cg=new WeakMap;function _n(e,n){if(typeof e=="object"&&e!==null){var r=cg.get(e);return r!==void 0?r:(n={value:e,source:n,stack:et(n)},cg.set(e,n),n)}return{value:e,source:n,stack:et(n)}}var wr=[],Sr=0,as=null,Do=0,In=[],Hn=0,Gi=null,ri=1,oi="";function Ei(e,n){wr[Sr++]=Do,wr[Sr++]=as,as=e,Do=n}function dg(e,n,r){In[Hn++]=ri,In[Hn++]=oi,In[Hn++]=Gi,Gi=e;var l=ri;e=oi;var h=32-xn(l)-1;l&=~(1<<h),r+=1;var m=32-xn(n)+h;if(30<m){var k=h-h%5;m=(l&(1<<k)-1).toString(32),l>>=k,h-=k,ri=1<<32-xn(n)+h|r<<h|l,oi=m+e}else ri=1<<m|r<<h|l,oi=e}function rs(e){e.return!==null&&(Ei(e,1),dg(e,1,0))}function Vc(e){for(;e===as;)as=wr[--Sr],wr[Sr]=null,Do=wr[--Sr],wr[Sr]=null;for(;e===Gi;)Gi=In[--Hn],In[Hn]=null,oi=In[--Hn],In[Hn]=null,ri=In[--Hn],In[Hn]=null}function hg(e,n){In[Hn++]=ri,In[Hn++]=oi,In[Hn++]=Gi,ri=n.id,oi=n.overflow,Gi=e}var Pt=null,wt=null,tt=!1,Yi=null,Bn=!1,$c=Error(o(519));function Ji(e){var n=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw jo(_n(n,e)),$c}function fg(e){var n=e.stateNode,r=e.type,l=e.memoizedProps;switch(n[Vt]=e,n[un]=l,r){case"dialog":it("cancel",n),it("close",n);break;case"iframe":case"object":case"embed":it("load",n);break;case"video":case"audio":for(r=0;r<el.length;r++)it(el[r],n);break;case"source":it("error",n);break;case"img":case"image":case"link":it("error",n),it("load",n);break;case"details":it("toggle",n);break;case"input":it("invalid",n),Ap(n,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":it("invalid",n);break;case"textarea":it("invalid",n),Cp(n,l.value,l.defaultValue,l.children)}r=l.children,typeof r!="string"&&typeof r!="number"&&typeof r!="bigint"||n.textContent===""+r||l.suppressHydrationWarning===!0||Lb(n.textContent,r)?(l.popover!=null&&(it("beforetoggle",n),it("toggle",n)),l.onScroll!=null&&it("scroll",n),l.onScrollEnd!=null&&it("scrollend",n),l.onClick!=null&&(n.onclick=ai),n=!0):n=!1,n||Ji(e,!0)}function os(e){for(Pt=e.return;Pt;)switch(Pt.tag){case 5:case 31:case 13:Bn=!1;return;case 27:case 3:Bn=!0;return;default:Pt=Pt.return}}function kr(e){if(e!==Pt)return!1;if(!tt)return os(e),tt=!0,!1;var n=e.tag,r;if((r=n!==3&&n!==27)&&((r=n===5)&&(r=e.type,r=!(r!=="form"&&r!=="button")||wh(e.type,e.memoizedProps)),r=!r),r&&wt&&Ji(e),os(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));wt=Wb(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));wt=Wb(e)}else n===27?(n=wt,ca(e.type)?(e=Nh,Nh=null,wt=e):wt=n):wt=Pt?Pn(e.stateNode.nextSibling):null;return!0}function La(){wt=Pt=null,tt=!1}function Gc(){var e=Yi;return e!==null&&(fn===null?fn=e:fn.push.apply(fn,e),Yi=null),e}function jo(e){Yi===null?Yi=[e]:Yi.push(e)}var Yc=De(null),za=null,Ci=null;function Xi(e,n,r){ce(Yc,n._currentValue),n._currentValue=r}function Ri(e){e._currentValue=Yc.current,Me(Yc)}function ls(e,n,r){for(;e!==null;){var l=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,l!==null&&(l.childLanes|=n)):l!==null&&(l.childLanes&n)!==n&&(l.childLanes|=n),e===r)break;e=e.return}}function Jc(e,n,r,l){var h=e.child;for(h!==null&&(h.return=e);h!==null;){var m=h.dependencies;if(m!==null){var k=h.child;m=m.firstContext;e:for(;m!==null;){var O=m;m=h;for(var F=0;F<n.length;F++)if(O.context===n[F]){m.lanes|=r,O=m.alternate,O!==null&&(O.lanes|=r),ls(m.return,r,e),l||(k=null);break e}m=O.next}}else if(h.tag===18){if(k=h.return,k===null)throw Error(o(341));k.lanes|=r,m=k.alternate,m!==null&&(m.lanes|=r),ls(k,r,e),k=null}else h.tag===13&&h.memoizedState!==null&&h.memoizedState.dehydrated===null?(h.lanes|=r,k=h.alternate,k!==null&&(k.lanes|=r),ls(h.return,r,e),k=h.child,k=k!==null?k.sibling:null):k=h.child;if(k!==null)k.return=h;else for(k=h;k!==null;){if(k===e){k=null;break}if(h=k.sibling,h!==null){h.return=k.return,k=h;break}k=k.return}h=k}}function _a(e,n,r,l){e=null;for(var h=n,m=!1;h!==null;){if(!m){if((h.flags&524288)!==0)m=!0;else if((h.flags&262144)!==0)break}if(h.tag===10){var k=h.alternate;if(k===null)throw Error(o(387));if(k=k.memoizedProps,k!==null){var O=h.type;Sn(h.pendingProps.value,k.value)||(e!==null?e.push(O):e=[O])}}else if(h===W.current){if(k=h.alternate,k===null)throw Error(o(387));k.memoizedState.memoizedState!==h.memoizedState.memoizedState&&(e!==null?e.push(Jr):e=[Jr])}h=h.return}return e!==null&&Jc(n,e,r,l),n.flags|=262144,e!==null}function ss(e){for(e=e.firstContext;e!==null;){if(!Sn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ia(e){za=e,Ci=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function $t(e){return mg(za,e)}function us(e,n){return za===null&&Ia(e),mg(e,n)}function mg(e,n){var r=n._currentValue;if(n={context:n,memoizedValue:r,next:null},Ci===null){if(e===null)throw Error(o(308));Ci=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Ci=Ci.next=n;return r}var tk=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(r,l){e.push(l)}};this.abort=function(){n.aborted=!0,e.forEach(function(r){return r()})}},nk=t.unstable_scheduleCallback,ik=t.unstable_NormalPriority,Nt={$$typeof:M,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Xc(){return{controller:new tk,data:new Map,refCount:0}}function Oo(e){e.refCount--,e.refCount===0&&nk(ik,function(){e.controller.abort()})}function pg(e,n){if((e.pendingLanes&4194048)!==0){var r=e.transitionTypes;for(r===null&&(r=e.transitionTypes=[]),e=0;e<n.length;e++){var l=n[e];r.indexOf(l)===-1&&r.push(l)}}}var Lo=null;function ak(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var zo=null,Zc=0,Ha=0,Tr=null;function rk(e,n){if(zo===null){var r=zo=[];Zc=0,Ha=hh(),Tr={status:"pending",value:void 0,then:function(l){r.push(l)}}}return Zc++,n.then(gg,gg),n}function gg(){if(--Zc===0&&(Lo=null,zo!==null)){Tr!==null&&(Tr.status="fulfilled");var e=zo;zo=null,Ha=0,Tr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function ok(e,n){var r=[],l={status:"pending",value:null,reason:null,then:function(h){r.push(h)}};return e.then(function(){l.status="fulfilled",l.value=n;for(var h=0;h<r.length;h++)(0,r[h])(n)},function(h){for(l.status="rejected",l.reason=h,h=0;h<r.length;h++)(0,r[h])(void 0)}),l}var yg=de.S;de.S=function(e,n){if(ub=ct(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&rk(e,n),Lo!==null)for(var r=Ur;r!==null;)pg(r,Lo),r=r.next;if(r=e.types,r!==null){for(var l=Ur;l!==null;)pg(l,r),l=l.next;if(Ha!==0){l=Lo,l===null&&(l=Lo=[]);for(var h=0;h<r.length;h++){var m=r[h];l.indexOf(m)===-1&&l.push(m)}}}yg!==null&&yg(e,n)};var Ba=De(null);function Kc(){var e=Ba.current;return e!==null?e:vt.pooledCache}function cs(e,n){n===null?ce(Ba,Ba.current):ce(Ba,n.pool)}function bg(){var e=Kc();return e===null?null:{parent:Nt._currentValue,pool:e}}var Ar=Error(o(460)),Qc=Error(o(474)),ds=Error(o(542)),hs={then:function(){}};function vg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function xg(e,n,r){switch(r=e[r],r===void 0?e.push(n):r!==n&&(n.then(ai,ai),n=r),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Sg(e),e===void 0&&!("reason"in n)?Error(o(600)):e;default:if(typeof n.status=="string")n.then(ai,ai);else{if(e=vt,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(l){if(n.status==="pending"){var h=n;h.status="fulfilled",h.value=l}},function(l){if(n.status==="pending"){var h=n;h.status="rejected",h.reason=l}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Sg(e),e}throw Pa=n,Ar}}function qa(e){try{var n=e._init;return n(e._payload)}catch(r){throw r!==null&&typeof r=="object"&&typeof r.then=="function"?(Pa=r,Ar):r}}var Pa=null;function wg(){if(Pa===null)throw Error(o(459));var e=Pa;return Pa=null,e}function Sg(e){if(e===Ar||e===ds)throw Error(o(483))}var Er=null,_o=0;function fs(e){var n=_o;return _o+=1,Er===null&&(Er=[]),xg(Er,e,n)}function Zi(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function ms(e,n){throw n.$$typeof===z?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function kg(e){function n(Q,J){if(e){var ne=Q.deletions;ne===null?(Q.deletions=[J],Q.flags|=16):ne.push(J)}}function r(Q,J){if(!e)return null;for(;J!==null;)n(Q,J),J=J.sibling;return null}function l(Q){for(var J=new Map;Q!==null;)Q.key===null?J.set(Q.index,Q):J.set(Q.key,Q),Q=Q.sibling;return J}function h(Q,J){return Q=Ai(Q,J),Q.index=0,Q.sibling=null,Q}function m(Q,J,ne){return Q.index=ne,e?(ne=Q.alternate,ne!==null?(ne=ne.index,ne<J?(Q.flags|=2,J):ne):(Q.flags|=134217730,J)):(Q.flags|=1048576,J)}function k(Q){return e&&Q.alternate===null&&(Q.flags|=134217730),Q}function O(Q,J,ne,fe){return J===null||J.tag!==6?(J=Uc(ne,Q.mode,fe),J.return=Q,J):(J=h(J,ne),J.return=Q,J)}function F(Q,J,ne,fe){var Le=ne.type;return Le===X?(Q=se(Q,J,ne.props.children,fe,ne.key),Zi(Q,ne),Q):J!==null&&(J.elementType===Le||typeof Le=="object"&&Le!==null&&Le.$$typeof===q&&qa(Le)===J.type)?(J=h(J,ne.props),Zi(J,ne),J.return=Q,J):(J=is(ne.type,ne.key,ne.props,null,Q.mode,fe),Zi(J,ne),J.return=Q,J)}function ee(Q,J,ne,fe){return J===null||J.tag!==4||J.stateNode.containerInfo!==ne.containerInfo||J.stateNode.implementation!==ne.implementation?(J=Fc(ne,Q.mode,fe),J.return=Q,J):(J=h(J,ne.children||[]),J.return=Q,J)}function se(Q,J,ne,fe,Le){return J===null||J.tag!==7?(J=Oa(ne,Q.mode,fe,Le),J.return=Q,J):(J=h(J,ne),J.return=Q,J)}function pe(Q,J,ne){if(typeof J=="string"&&J!==""||typeof J=="number"||typeof J=="bigint")return J=Uc(""+J,Q.mode,ne),J.return=Q,J;if(typeof J=="object"&&J!==null){switch(J.$$typeof){case B:return ne=is(J.type,J.key,J.props,null,Q.mode,ne),Zi(ne,J),ne.return=Q,ne;case I:return J=Fc(J,Q.mode,ne),J.return=Q,J;case q:return J=qa(J),pe(Q,J,ne)}if(xe(J)||ve(J))return J=Oa(J,Q.mode,ne,null),J.return=Q,J;if(typeof J.then=="function")return pe(Q,fs(J),ne);if(J.$$typeof===M)return pe(Q,us(Q,J),ne);ms(Q,J)}return null}function K(Q,J,ne,fe){var Le=J!==null?J.key:null;if(typeof ne=="string"&&ne!==""||typeof ne=="number"||typeof ne=="bigint")return Le!==null?null:O(Q,J,""+ne,fe);if(typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case B:return ne.key===Le?F(Q,J,ne,fe):null;case I:return ne.key===Le?ee(Q,J,ne,fe):null;case q:return ne=qa(ne),K(Q,J,ne,fe)}if(xe(ne)||ve(ne))return Le!==null?null:se(Q,J,ne,fe,null);if(typeof ne.then=="function")return K(Q,J,fs(ne),fe);if(ne.$$typeof===M)return K(Q,J,us(Q,ne),fe);ms(Q,ne)}return null}function ie(Q,J,ne,fe,Le){if(typeof fe=="string"&&fe!==""||typeof fe=="number"||typeof fe=="bigint")return Q=Q.get(ne)||null,O(J,Q,""+fe,Le);if(typeof fe=="object"&&fe!==null){switch(fe.$$typeof){case B:return Q=Q.get(fe.key===null?ne:fe.key)||null,F(J,Q,fe,Le);case I:return Q=Q.get(fe.key===null?ne:fe.key)||null,ee(J,Q,fe,Le);case q:return fe=qa(fe),ie(Q,J,ne,fe,Le)}if(xe(fe)||ve(fe))return Q=Q.get(ne)||null,se(J,Q,fe,Le,null);if(typeof fe.then=="function")return ie(Q,J,ne,fs(fe),Le);if(fe.$$typeof===M)return ie(Q,J,ne,us(J,fe),Le);ms(J,fe)}return null}function Ee(Q,J,ne,fe){for(var Le=null,rt=null,He=J,Pe=J=0,Ot=null;He!==null&&Pe<ne.length;Pe++){He.index>Pe?(Ot=He,He=null):Ot=He.sibling;var ot=K(Q,He,ne[Pe],fe);if(ot===null){He===null&&(He=Ot);break}e&&He&&ot.alternate===null&&n(Q,He),J=m(ot,J,Pe),rt===null?Le=ot:rt.sibling=ot,rt=ot,He=Ot}if(Pe===ne.length)return r(Q,He),tt&&Ei(Q,Pe),Le;if(He===null){for(;Pe<ne.length;Pe++)He=pe(Q,ne[Pe],fe),He!==null&&(J=m(He,J,Pe),rt===null?Le=He:rt.sibling=He,rt=He);return tt&&Ei(Q,Pe),Le}for(He=l(He);Pe<ne.length;Pe++)Ot=ie(He,Q,Pe,ne[Pe],fe),Ot!==null&&(e&&(ot=Ot.alternate,ot!==null&&He.delete(ot.key===null?Pe:ot.key)),J=m(Ot,J,Pe),rt===null?Le=Ot:rt.sibling=Ot,rt=Ot);return e&&He.forEach(function(pa){return n(Q,pa)}),tt&&Ei(Q,Pe),Le}function _e(Q,J,ne,fe){if(ne==null)throw Error(o(151));for(var Le=null,rt=null,He=J,Pe=J=0,Ot=null,ot=ne.next();He!==null&&!ot.done;Pe++,ot=ne.next()){He.index>Pe?(Ot=He,He=null):Ot=He.sibling;var pa=K(Q,He,ot.value,fe);if(pa===null){He===null&&(He=Ot);break}e&&He&&pa.alternate===null&&n(Q,He),J=m(pa,J,Pe),rt===null?Le=pa:rt.sibling=pa,rt=pa,He=Ot}if(ot.done)return r(Q,He),tt&&Ei(Q,Pe),Le;if(He===null){for(;!ot.done;Pe++,ot=ne.next())ot=pe(Q,ot.value,fe),ot!==null&&(J=m(ot,J,Pe),rt===null?Le=ot:rt.sibling=ot,rt=ot);return tt&&Ei(Q,Pe),Le}for(He=l(He);!ot.done;Pe++,ot=ne.next())ot=ie(He,Q,Pe,ot.value,fe),ot!==null&&(e&&(Ot=ot.alternate,Ot!==null&&He.delete(Ot.key===null?Pe:Ot.key)),J=m(ot,J,Pe),rt===null?Le=ot:rt.sibling=ot,rt=ot);return e&&He.forEach(function(qT){return n(Q,qT)}),tt&&Ei(Q,Pe),Le}function Ke(Q,J,ne,fe){if(typeof ne=="object"&&ne!==null&&ne.type===X&&ne.key===null&&ne.props.ref===void 0&&(ne=ne.props.children),typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case B:e:{for(var Le=ne.key;J!==null;){if(J.key===Le){if(Le=ne.type,Le===X){if(J.tag===7){r(Q,J.sibling),fe=h(J,ne.props.children),Zi(fe,ne),fe.return=Q,Q=fe;break e}}else if(J.elementType===Le||typeof Le=="object"&&Le!==null&&Le.$$typeof===q&&qa(Le)===J.type){r(Q,J.sibling),fe=h(J,ne.props),Zi(fe,ne),fe.return=Q,Q=fe;break e}r(Q,J);break}else n(Q,J);J=J.sibling}ne.type===X?(fe=Oa(ne.props.children,Q.mode,fe,ne.key),Zi(fe,ne),fe.return=Q,Q=fe):(fe=is(ne.type,ne.key,ne.props,null,Q.mode,fe),Zi(fe,ne),fe.return=Q,Q=fe)}return k(Q);case I:e:{for(Le=ne.key;J!==null;){if(J.key===Le)if(J.tag===4&&J.stateNode.containerInfo===ne.containerInfo&&J.stateNode.implementation===ne.implementation){r(Q,J.sibling),fe=h(J,ne.children||[]),fe.return=Q,Q=fe;break e}else{r(Q,J);break}else n(Q,J);J=J.sibling}fe=Fc(ne,Q.mode,fe),fe.return=Q,Q=fe}return k(Q);case q:return ne=qa(ne),Ke(Q,J,ne,fe)}if(xe(ne))return Ee(Q,J,ne,fe);if(ve(ne)){if(Le=ve(ne),typeof Le!="function")throw Error(o(150));return ne=Le.call(ne),_e(Q,J,ne,fe)}if(typeof ne.then=="function")return Ke(Q,J,fs(ne),fe);if(ne.$$typeof===M)return Ke(Q,J,us(Q,ne),fe);ms(Q,ne)}return typeof ne=="string"&&ne!==""||typeof ne=="number"||typeof ne=="bigint"?(ne=""+ne,J!==null&&J.tag===6?(r(Q,J.sibling),fe=h(J,ne),fe.return=Q,Q=fe):(r(Q,J),fe=Uc(ne,Q.mode,fe),fe.return=Q,Q=fe),k(Q)):r(Q,J)}return function(Q,J,ne,fe){try{_o=0;var Le=Ke(Q,J,ne,fe);return Er=null,Le}catch(He){if(He===Ar||He===ds)throw He;var rt=cn(29,He,null,Q.mode);return rt.lanes=fe,rt.return=Q,rt}}}var Ua=kg(!0),Tg=kg(!1),Ki=!1;function Wc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ed(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Qi(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Wi(e,n,r){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(st&2)!==0){var h=l.pending;return h===null?n.next=n:(n.next=h.next,h.next=n),l.pending=n,n=ns(e),lg(e,null,r),n}return ts(e,l,n,r),ns(e)}function Io(e,n,r){if(n=n.updateQueue,n!==null&&(n=n.shared,(r&4194048)!==0)){var l=n.lanes;l&=e.pendingLanes,r|=l,n.lanes=r,dp(e,r)}}function td(e,n){var r=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,r===l)){var h=null,m=null;if(r=r.firstBaseUpdate,r!==null){do{var k={lane:r.lane,tag:r.tag,payload:r.payload,callback:null,next:null};m===null?h=m=k:m=m.next=k,r=r.next}while(r!==null);m===null?h=m=n:m=m.next=n}else h=m=n;r={baseState:l.baseState,firstBaseUpdate:h,lastBaseUpdate:m,shared:l.shared,callbacks:l.callbacks},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=n:e.next=n,r.lastBaseUpdate=n}var nd=!1;function Ho(){if(nd){var e=Tr;if(e!==null)throw e}}function Bo(e,n,r,l){nd=!1;var h=e.updateQueue;Ki=!1;var m=h.firstBaseUpdate,k=h.lastBaseUpdate,O=h.shared.pending;if(O!==null){h.shared.pending=null;var F=O,ee=F.next;F.next=null,k===null?m=ee:k.next=ee,k=F;var se=e.alternate;se!==null&&(se=se.updateQueue,O=se.lastBaseUpdate,O!==k&&(O===null?se.firstBaseUpdate=ee:O.next=ee,se.lastBaseUpdate=F))}if(m!==null){var pe=h.baseState;k=0,se=ee=F=null,O=m;do{var K=O.lane&-536870913,ie=K!==O.lane;if(ie?(at&K)===K:(l&K)===K){K!==0&&K===Ha&&(nd=!0),se!==null&&(se=se.next={lane:0,tag:O.tag,payload:O.payload,callback:null,next:null});e:{var Ee=e,_e=O;K=n;var Ke=r;switch(_e.tag){case 1:if(Ee=_e.payload,typeof Ee=="function"){pe=Ee.call(Ke,pe,K);break e}pe=Ee;break e;case 3:Ee.flags=Ee.flags&-65537|128;case 0:if(Ee=_e.payload,K=typeof Ee=="function"?Ee.call(Ke,pe,K):Ee,K==null)break e;pe=j({},pe,K);break e;case 2:Ki=!0}}K=O.callback,K!==null&&(e.flags|=64,ie&&(e.flags|=8192),ie=h.callbacks,ie===null?h.callbacks=[K]:ie.push(K))}else ie={lane:K,tag:O.tag,payload:O.payload,callback:O.callback,next:null},se===null?(ee=se=ie,F=pe):se=se.next=ie,k|=K;if(O=O.next,O===null){if(O=h.shared.pending,O===null)break;ie=O,O=ie.next,ie.next=null,h.lastBaseUpdate=ie,h.shared.pending=null}}while(!0);se===null&&(F=pe),h.baseState=F,h.firstBaseUpdate=ee,h.lastBaseUpdate=se,m===null&&(h.shared.lanes=0),oa|=k,e.lanes=k,e.memoizedState=pe}}function Ag(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function Eg(e,n){var r=e.callbacks;if(r!==null)for(e.callbacks=null,e=0;e<r.length;e++)Ag(r[e],n)}var ea=De(null),ps=De(0);function Cg(e,n){e=Oi,ce(ps,e),ce(ea,n),Oi=e|n.baseLanes}function id(){ce(ps,Oi),ce(ea,ea.current)}function ad(){Oi=ps.current,Me(ea),Me(ps)}var Gt=De(null),Qt=null;function ta(e){var n=e.alternate;ce(Yt,Yt.current&1),ce(Gt,e),Qt===null&&(n===null||ea.current!==null||n.memoizedState!==null)&&(Qt=e)}function rd(e){ce(Yt,Yt.current),ce(Gt,e),Qt===null&&(Qt=e)}function Rg(e){e.tag===22?(ce(Yt,Yt.current),ce(Gt,e),Qt===null&&(Qt=e)):na()}function na(){ce(Yt,Yt.current),ce(Gt,Gt.current)}function kn(e){Me(Gt),Qt===e&&(Qt=null),Me(Yt)}var Yt=De(0);function qo(e,n){ce(Gt,Gt.current),ce(Yt,n)}function od(e){Me(Yt),Me(Gt),Qt===e&&(Qt=null)}function gs(e){for(var n=e;n!==null;){if(n.tag===13){var r=n.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||Rh(r)||Mh(r)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Mi=0,Ze=null,gt=null,Dt=null,ys=!1,Cr=!1,Fa=!1,bs=0,Po=0,Rr=null,lk=0;function Ct(){throw Error(o(321))}function ld(e,n){if(n===null)return!1;for(var r=0;r<n.length&&r<e.length;r++)if(!Sn(e[r],n[r]))return!1;return!0}function sd(e,n,r,l,h,m){return Mi=m,Ze=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,de.H=e===null||e.memoizedState===null?dy:hy,Fa=!1,m=r(l,h),Fa=!1,Cr&&(m=Ng(n,r,l,h)),Mg(e),m}function Mg(e){de.H=As;var n=gt!==null&&gt.next!==null;if(Mi=0,Dt=gt=Ze=null,ys=!1,Po=0,Rr=null,n)throw Error(o(300));e===null||jt||(e=e.dependencies,e!==null&&ss(e)&&(jt=!0))}function Ng(e,n,r,l){Ze=e;var h=0;do{if(Cr&&(Rr=null),Po=0,Cr=!1,25<=h)throw Error(o(301));if(h+=1,Dt=gt=null,e.updateQueue!=null){var m=e.updateQueue;m.lastEffect=null,m.events=null,m.stores=null,m.memoCache!=null&&(m.memoCache.index=0)}de.H=pk,m=n(r,l)}while(Cr);return m}function sk(){var e=de.H,n=e.useState()[0];return n=typeof n.then=="function"?Uo(n):n,e=e.useState()[0],(gt!==null?gt.memoizedState:null)!==e&&(Ze.flags|=1024),n}function ud(){var e=bs!==0;return bs=0,e}function cd(e,n,r){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~r}function dd(e){if(ys){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}ys=!1}Mi=0,Dt=gt=Ze=null,Cr=!1,Po=bs=0,Rr=null}function tn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Dt===null?Ze.memoizedState=Dt=e:Dt=Dt.next=e,Dt}function Mt(){if(gt===null){var e=Ze.alternate;e=e!==null?e.memoizedState:null}else e=gt.next;var n=Dt===null?Ze.memoizedState:Dt.next;if(n!==null)Dt=n,gt=e;else{if(e===null)throw Ze.alternate===null?Error(o(467)):Error(o(310));gt=e,e={memoizedState:gt.memoizedState,baseState:gt.baseState,baseQueue:gt.baseQueue,queue:gt.queue,next:null},Dt===null?Ze.memoizedState=Dt=e:Dt=Dt.next=e}return Dt}function vs(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Uo(e){var n=Po;return Po+=1,Rr===null&&(Rr=[]),e=xg(Rr,e,n),n=Ze,(Dt===null?n.memoizedState:Dt.next)===null&&(n=n.alternate,de.H=n===null||n.memoizedState===null?dy:hy),e}function xs(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Uo(e);if(e.$$typeof===te)return;if(e.$$typeof===M)return $t(e)}throw Error(o(438,String(e)))}function hd(e){var n=null,r=Ze.updateQueue;if(r!==null&&(n=r.memoCache),n==null){var l=Ze.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(n={data:l.data.map(function(h){return h.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),r===null&&(r=vs(),Ze.updateQueue=r),r.memoCache=n,r=n.data[n.index],r===void 0)for(r=n.data[n.index]=Array(e),l=0;l<e;l++)r[l]=H;return n.index++,r}function Ni(e,n){return typeof n=="function"?n(e):n}function ws(e){var n=Mt();return fd(n,gt,e)}function fd(e,n,r){var l=e.queue;if(l===null)throw Error(o(311));l.lastRenderedReducer=r;var h=e.baseQueue,m=l.pending;if(m!==null){if(h!==null){var k=h.next;h.next=m.next,m.next=k}n.baseQueue=h=m,l.pending=null}if(m=e.baseState,h===null)e.memoizedState=m;else{n=h.next;var O=k=null,F=null,ee=n,se=!1;do{var pe=ee.lane&-536870913;if(pe!==ee.lane?(at&pe)===pe:(Mi&pe)===pe){var K=ee.revertLane;if(K===0)F!==null&&(F=F.next={lane:0,revertLane:0,gesture:null,action:ee.action,hasEagerState:ee.hasEagerState,eagerState:ee.eagerState,next:null}),pe===Ha&&(se=!0);else if((Mi&K)===K){ee=ee.next,K===Ha&&(se=!0);continue}else pe={lane:0,revertLane:ee.revertLane,gesture:null,action:ee.action,hasEagerState:ee.hasEagerState,eagerState:ee.eagerState,next:null},F===null?(O=F=pe,k=m):F=F.next=pe,Ze.lanes|=K,oa|=K;pe=ee.action,Fa&&r(m,pe),m=ee.hasEagerState?ee.eagerState:r(m,pe)}else K={lane:pe,revertLane:ee.revertLane,gesture:ee.gesture,action:ee.action,hasEagerState:ee.hasEagerState,eagerState:ee.eagerState,next:null},F===null?(O=F=K,k=m):F=F.next=K,Ze.lanes|=pe,oa|=pe;ee=ee.next}while(ee!==null&&ee!==n);if(F===null?k=m:F.next=O,!Sn(m,e.memoizedState)&&(jt=!0,se&&(r=Tr,r!==null)))throw r;e.memoizedState=m,e.baseState=k,e.baseQueue=F,l.lastRenderedState=m}return h===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function md(e){var n=Mt(),r=n.queue;if(r===null)throw Error(o(311));r.lastRenderedReducer=e;var l=r.dispatch,h=r.pending,m=n.memoizedState;if(h!==null){r.pending=null;var k=h=h.next;do m=e(m,k.action),k=k.next;while(k!==h);Sn(m,n.memoizedState)||(jt=!0),n.memoizedState=m,n.baseQueue===null&&(n.baseState=m),r.lastRenderedState=m}return[m,l]}function Dg(e,n,r){var l=Ze,h=Mt(),m=tt;if(m){if(r===void 0)throw Error(o(407));r=r()}else r=n();var k=!Sn((gt||h).memoizedState,r);if(k&&(h.memoizedState=r,jt=!0),h=h.queue,yd(Lg.bind(null,l,h,e),[e]),e=h.getSnapshot!==n||k||Dt!==null&&(Dt.memoizedState.tag&1)!==0,Mr(e?9:8,{destroy:void 0},Og.bind(null,l,h,r,n),null),e){if(l.flags|=2048,vt===null)throw Error(o(349));m||(Mi&127)!==0||jg(l,n,r)}return r}function jg(e,n,r){e.flags|=16384,e={getSnapshot:n,value:r},n=Ze.updateQueue,n===null?(n=vs(),Ze.updateQueue=n,n.stores=[e]):(r=n.stores,r===null?n.stores=[e]:r.push(e))}function Og(e,n,r,l){n.value=r,n.getSnapshot=l,zg(n)&&_g(e)}function Lg(e,n,r){return r(function(){zg(n)&&_g(e)})}function zg(e){var n=e.getSnapshot;e=e.value;try{var r=n();return!Sn(e,r)}catch{return!0}}function _g(e){var n=ja(e,2);n!==null&&mn(n,e,2)}function pd(e){var n=tn();if(typeof e=="function"){var r=e;if(e=r(),Fa){Fi(!0);try{r()}finally{Fi(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ni,lastRenderedState:e},n}function Ig(e,n,r,l){return e.baseState=r,fd(e,gt,typeof l=="function"?l:Ni)}function uk(e,n,r,l,h){if(Ts(e))throw Error(o(485));if(e=n.action,e!==null){var m={payload:h,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(k){m.listeners.push(k)}};de.T!==null?r(!0):m.isTransition=!1,l(m),r=n.pending,r===null?(m.next=n.pending=m,Hg(n,m)):(m.next=r.next,n.pending=r.next=m)}}function Hg(e,n){var r=n.action,l=n.payload,h=e.state;if(n.isTransition){var m=de.T,k={};k.types=m!==null?m.types:null,de.T=k;try{var O=r(h,l),F=de.S;F!==null&&F(k,O),Bg(e,n,O)}catch(ee){gd(e,n,ee)}finally{m!==null&&k.types!==null&&(m.types=k.types),de.T=m}}else try{m=r(h,l),Bg(e,n,m)}catch(ee){gd(e,n,ee)}}function Bg(e,n,r){r!==null&&typeof r=="object"&&typeof r.then=="function"?r.then(function(l){qg(e,n,l)},function(l){return gd(e,n,l)}):qg(e,n,r)}function qg(e,n,r){n.status="fulfilled",n.value=r,Pg(n),e.state=r,n=e.pending,n!==null&&(r=n.next,r===n?e.pending=null:(r=r.next,n.next=r,Hg(e,r)))}function gd(e,n,r){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do n.status="rejected",n.reason=r,Pg(n),n=n.next;while(n!==l)}e.action=null}function Pg(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function Ug(e,n){return n}function Fg(e,n){if(tt){var r=vt.formState;if(r!==null){e:{var l=Ze;if(tt){if(wt){t:{for(var h=wt,m=Bn;h.nodeType!==8;){if(!m){h=null;break t}if(h=Pn(h.nextSibling),h===null){h=null;break t}}m=h.data,h=m==="F!"||m==="F"?h:null}if(h){wt=Pn(h.nextSibling),l=h.data==="F!";break e}}Ji(l)}l=!1}l&&(n=r[0])}}return r=tn(),r.memoizedState=r.baseState=n,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ug,lastRenderedState:n},r.queue=l,r=sy.bind(null,Ze,l),l.dispatch=r,l=pd(!1),m=Sd.bind(null,Ze,!1,l.queue),l=tn(),h={state:n,dispatch:null,action:e,pending:null},l.queue=h,r=uk.bind(null,Ze,h,m,r),h.dispatch=r,l.memoizedState=e,[n,r,!1]}function Vg(e){var n=Mt();return $g(n,gt,e)}function $g(e,n,r){if(n=fd(e,n,Ug)[0],e=ws(Ni)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var l=Uo(n)}catch(k){throw k===Ar?ds:k}else l=n;n=Mt();var h=n.queue,m=h.dispatch;return r!==n.memoizedState&&(Ze.flags|=2048,Mr(9,{destroy:void 0},ck.bind(null,h,r),null)),[l,m,e]}function ck(e,n){e.action=n}function Gg(e){var n=Mt(),r=gt;if(r!==null)return $g(n,r,e);Mt(),n=n.memoizedState,r=Mt();var l=r.queue.dispatch;return r.memoizedState=e,[n,l,!1]}function Mr(e,n,r,l){return e={tag:e,create:r,deps:l,inst:n,next:null},n=Ze.updateQueue,n===null&&(n=vs(),Ze.updateQueue=n),r=n.lastEffect,r===null?n.lastEffect=e.next=e:(l=r.next,r.next=e,e.next=l,n.lastEffect=e),e}function Yg(){return Mt().memoizedState}function Ss(e,n,r,l){var h=tn();Ze.flags|=e,h.memoizedState=Mr(1|n,{destroy:void 0},r,l===void 0?null:l)}function ks(e,n,r,l){var h=Mt();l=l===void 0?null:l;var m=h.memoizedState.inst;gt!==null&&l!==null&&ld(l,gt.memoizedState.deps)?h.memoizedState=Mr(n,m,r,l):(Ze.flags|=e,h.memoizedState=Mr(1|n,m,r,l))}function Jg(e,n){Ss(8390656,8,e,n)}function yd(e,n){ks(2048,8,e,n)}function dk(e){Ze.flags|=4;var n=Ze.updateQueue;if(n===null)n=vs(),Ze.updateQueue=n,n.events=[e];else{var r=n.events;r===null?n.events=[e]:r.push(e)}}function Xg(e){var n=Mt().memoizedState;return dk({ref:n,nextImpl:e}),function(){if((st&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}function Zg(e,n){return ks(4,2,e,n)}function Kg(e,n){return ks(4,4,e,n)}function Qg(e,n){if(typeof n=="function"){e=e();var r=n(e);return function(){typeof r=="function"?r():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Wg(e,n,r){r=r!=null?r.concat([e]):null,ks(4,4,Qg.bind(null,n,e),r)}function bd(){}function ey(e,n){var r=Mt();n=n===void 0?null:n;var l=r.memoizedState;return n!==null&&ld(n,l[1])?l[0]:(r.memoizedState=[e,n],e)}function ty(e,n){var r=Mt();n=n===void 0?null:n;var l=r.memoizedState;if(n!==null&&ld(n,l[1]))return l[0];if(l=e(),Fa){Fi(!0);try{e()}finally{Fi(!1)}}return r.memoizedState=[l,n],l}function vd(e,n,r){return r===void 0||(Mi&1073741824)!==0&&(at&261930)===0?e.memoizedState=n:(e.memoizedState=r,e=db(),Ze.lanes|=e,oa|=e,r)}function ny(e,n,r,l){return Sn(r,n)?r:ea.current!==null?(e=vd(e,r,l),Sn(e,n)||(jt=!0),e):(Mi&106)===0||(Mi&1073741824)!==0&&(at&261930)===0?(jt=!0,e.memoizedState=r):(e=db(),Ze.lanes|=e,oa|=e,n)}function iy(e,n,r,l,h){var m=ae.p;ae.p=m!==0&&8>m?m:8;var k=de.T,O={};O.types=k!==null?k.types:null,de.T=O,Sd(e,!1,n,r);try{var F=h(),ee=de.S;if(ee!==null&&ee(O,F),F!==null&&typeof F=="object"&&typeof F.then=="function"){var se=ok(F,l);Fo(e,n,se,Cn(e))}else Fo(e,n,l,Cn(e))}catch(pe){Fo(e,n,{then:function(){},status:"rejected",reason:pe},Cn())}finally{ae.p=m,k!==null&&O.types!==null&&(k.types=O.types),de.T=k}}function hk(){}function xd(e,n,r,l){if(e.tag!==5)throw Error(o(476));var h=ay(e).queue;iy(e,h,n,ye,r===null?hk:function(){return ry(e),r(l)})}function ay(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:ye,baseState:ye,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ni,lastRenderedState:ye},next:null};var r={};return n.next={memoizedState:r,baseState:r,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ni,lastRenderedState:r},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function ry(e){var n=ay(e);n.next===null&&(n=e.alternate.memoizedState),Fo(e,n.next.queue,{},Cn())}function wd(){return $t(Jr)}function oy(){return Mt().memoizedState}function ly(){return Mt().memoizedState}function fk(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var r=Cn();e=Qi(r);var l=Wi(n,e,r);l!==null&&(mn(l,n,r),Io(l,n,r)),n={cache:Xc()},e.payload=n;return}n=n.return}}function mk(e,n,r){var l=Cn();r={lane:l,revertLane:0,gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Ts(e)?uy(n,r):(r=qc(e,n,r,l),r!==null&&(mn(r,e,l),cy(r,n,l)))}function sy(e,n,r){var l=Cn();Fo(e,n,r,l)}function Fo(e,n,r,l){var h={lane:l,revertLane:0,gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null};if(Ts(e))uy(n,h);else{var m=e.alternate;if(e.lanes===0&&(m===null||m.lanes===0)&&(m=n.lastRenderedReducer,m!==null))try{var k=n.lastRenderedState,O=m(k,r);if(h.hasEagerState=!0,h.eagerState=O,Sn(O,k))return ts(e,n,h,0),vt===null&&es(),!1}catch{}if(r=qc(e,n,h,l),r!==null)return mn(r,e,l),cy(r,n,l),!0}return!1}function Sd(e,n,r,l){if(l={lane:2,revertLane:hh(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Ts(e)){if(n)throw Error(o(479))}else n=qc(e,r,l,2),n!==null&&mn(n,e,2)}function Ts(e){var n=e.alternate;return e===Ze||n!==null&&n===Ze}function uy(e,n){Cr=ys=!0;var r=e.pending;r===null?n.next=n:(n.next=r.next,r.next=n),e.pending=n}function cy(e,n,r){if((r&4194048)!==0){var l=n.lanes;l&=e.pendingLanes,r|=l,n.lanes=r,dp(e,r)}}var As={readContext:$t,use:xs,useCallback:Ct,useContext:Ct,useEffect:Ct,useImperativeHandle:Ct,useLayoutEffect:Ct,useInsertionEffect:Ct,useMemo:Ct,useReducer:Ct,useRef:Ct,useState:Ct,useDebugValue:Ct,useDeferredValue:Ct,useTransition:Ct,useSyncExternalStore:Ct,useId:Ct,useHostTransitionStatus:Ct,useFormState:Ct,useActionState:Ct,useOptimistic:Ct,useMemoCache:Ct,useCacheRefresh:Ct,useEffectEvent:Ct},dy={readContext:$t,use:xs,useCallback:function(e,n){return tn().memoizedState=[e,n===void 0?null:n],e},useContext:$t,useEffect:Jg,useImperativeHandle:function(e,n,r){r=r!=null?r.concat([e]):null,Ss(4194308,4,Qg.bind(null,n,e),r)},useLayoutEffect:function(e,n){return Ss(4194308,4,e,n)},useInsertionEffect:function(e,n){Ss(4,2,e,n)},useMemo:function(e,n){var r=tn();n=n===void 0?null:n;var l=e();if(Fa){Fi(!0);try{e()}finally{Fi(!1)}}return r.memoizedState=[l,n],l},useReducer:function(e,n,r){var l=tn();if(r!==void 0){var h=r(n);if(Fa){Fi(!0);try{r(n)}finally{Fi(!1)}}}else h=n;return l.memoizedState=l.baseState=h,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:h},l.queue=e,e=e.dispatch=mk.bind(null,Ze,e),[l.memoizedState,e]},useRef:function(e){var n=tn();return e={current:e},n.memoizedState=e},useState:function(e){e=pd(e);var n=e.queue,r=sy.bind(null,Ze,n);return n.dispatch=r,[e.memoizedState,r]},useDebugValue:bd,useDeferredValue:function(e,n){var r=tn();return vd(r,e,n)},useTransition:function(){var e=pd(!1);return e=iy.bind(null,Ze,e.queue,!0,!1),tn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,r){var l=Ze,h=tn();if(tt){if(r===void 0)throw Error(o(407));r=r()}else{if(r=n(),vt===null)throw Error(o(349));(at&127)!==0||jg(l,n,r)}h.memoizedState=r;var m={value:r,getSnapshot:n};return h.queue=m,Jg(Lg.bind(null,l,m,e),[e]),l.flags|=2048,Mr(9,{destroy:void 0},Og.bind(null,l,m,r,n),null),r},useId:function(){var e=tn(),n=vt.identifierPrefix;if(tt){var r=oi,l=ri;r=(l&~(1<<32-xn(l)-1)).toString(32)+r,n="_"+n+"R_"+r,r=bs++,0<r&&(n+="H"+r.toString(32)),n+="_"}else r=lk++,n="_"+n+"r_"+r.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:wd,useFormState:Fg,useActionState:Fg,useOptimistic:function(e){var n=tn();n.memoizedState=n.baseState=e;var r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=r,n=Sd.bind(null,Ze,!0,r),r.dispatch=n,[e,n]},useMemoCache:hd,useCacheRefresh:function(){return tn().memoizedState=fk.bind(null,Ze)},useEffectEvent:function(e){var n=tn(),r={impl:e};return n.memoizedState=r,function(){if((st&2)!==0)throw Error(o(440));return r.impl.apply(void 0,arguments)}}},hy={readContext:$t,use:xs,useCallback:ey,useContext:$t,useEffect:yd,useImperativeHandle:Wg,useInsertionEffect:Zg,useLayoutEffect:Kg,useMemo:ty,useReducer:ws,useRef:Yg,useState:function(){return ws(Ni)},useDebugValue:bd,useDeferredValue:function(e,n){var r=Mt();return ny(r,gt.memoizedState,e,n)},useTransition:function(){var e=ws(Ni)[0],n=Mt().memoizedState;return[typeof e=="boolean"?e:Uo(e),n]},useSyncExternalStore:Dg,useId:oy,useHostTransitionStatus:wd,useFormState:Vg,useActionState:Vg,useOptimistic:function(e,n){var r=Mt();return Ig(r,gt,e,n)},useMemoCache:hd,useCacheRefresh:ly,useEffectEvent:Xg},pk={readContext:$t,use:xs,useCallback:ey,useContext:$t,useEffect:yd,useImperativeHandle:Wg,useInsertionEffect:Zg,useLayoutEffect:Kg,useMemo:ty,useReducer:md,useRef:Yg,useState:function(){return md(Ni)},useDebugValue:bd,useDeferredValue:function(e,n){var r=Mt();return gt===null?vd(r,e,n):ny(r,gt.memoizedState,e,n)},useTransition:function(){var e=md(Ni)[0],n=Mt().memoizedState;return[typeof e=="boolean"?e:Uo(e),n]},useSyncExternalStore:Dg,useId:oy,useHostTransitionStatus:wd,useFormState:Gg,useActionState:Gg,useOptimistic:function(e,n){var r=Mt();return gt!==null?Ig(r,gt,e,n):(r.baseState=e,[e,r.queue.dispatch])},useMemoCache:hd,useCacheRefresh:ly,useEffectEvent:Xg};function kd(e,n,r,l){n=e.memoizedState,r=r(l,n),r=r==null?n:j({},n,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Td={enqueueSetState:function(e,n,r){e=e._reactInternals;var l=Cn(),h=Qi(l);h.payload=n,r!=null&&(h.callback=r),n=Wi(e,h,l),n!==null&&(mn(n,e,l),Io(n,e,l))},enqueueReplaceState:function(e,n,r){e=e._reactInternals;var l=Cn(),h=Qi(l);h.tag=1,h.payload=n,r!=null&&(h.callback=r),n=Wi(e,h,l),n!==null&&(mn(n,e,l),Io(n,e,l))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var r=Cn(),l=Qi(r);l.tag=2,n!=null&&(l.callback=n),n=Wi(e,l,r),n!==null&&(mn(n,e,r),Io(n,e,r))}};function fy(e,n,r,l,h,m,k){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,m,k):n.prototype&&n.prototype.isPureReactComponent?!Mo(r,l)||!Mo(h,m):!0}function my(e,n,r,l){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(r,l),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(r,l),n.state!==e&&Td.enqueueReplaceState(n,n.state,null)}function Va(e,n){var r=n;if("ref"in n){r={};for(var l in n)l!=="ref"&&(r[l]=n[l])}if(e=e.defaultProps){r===n&&(r=j({},r));for(var h in e)r[h]===void 0&&(r[h]=e[h])}return r}function py(e){Wl(e)}function gy(e){console.error(e)}function yy(e){Wl(e)}function Es(e,n){try{var r=e.onUncaughtError;r(n.value,{componentStack:n.stack})}catch(l){setTimeout(function(){throw l})}}function by(e,n,r){try{var l=e.onCaughtError;l(r.value,{componentStack:r.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(h){setTimeout(function(){throw h})}}function Ad(e,n,r){return r=Qi(r),r.tag=3,r.payload={element:null},r.callback=function(){Es(e,n)},r}function vy(e){return e=Qi(e),e.tag=3,e}function xy(e,n,r,l){var h=r.type.getDerivedStateFromError;if(typeof h=="function"){var m=l.value;e.payload=function(){return h(m)},e.callback=function(){by(n,r,l)}}var k=r.stateNode;k!==null&&typeof k.componentDidCatch=="function"&&(e.callback=function(){by(n,r,l),typeof h!="function"&&(la===null?la=new Set([this]):la.add(this));var O=l.stack;this.componentDidCatch(l.value,{componentStack:O!==null?O:""})})}function gk(e,n,r,l,h){if(r.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(n=r.alternate,n!==null&&_a(n,r,h,!0),r=Gt.current,r!==null){switch(r.tag){case 31:case 13:case 19:return Qt===null?Ys():r.alternate===null&&Rt===0&&(Rt=3),r.flags&=-257,r.flags|=65536,r.lanes=h,l===hs?r.flags|=16384:(n=r.updateQueue,n===null?r.updateQueue=new Set([l]):n.add(l),uh(e,l,h)),!1;case 22:return r.flags|=65536,l===hs?r.flags|=16384:(n=r.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([l])},r.updateQueue=n):(r=n.retryQueue,r===null?n.retryQueue=new Set([l]):r.add(l)),uh(e,l,h)),!1}throw Error(o(435,r.tag))}return uh(e,l,h),Ys(),!1}if(tt)return n=Gt.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=h,l!==$c&&(e=Error(o(422),{cause:l}),jo(_n(e,r)))):(l!==$c&&(n=Error(o(423),{cause:l}),jo(_n(n,r))),e=e.current.alternate,e.flags|=65536,h&=-h,e.lanes|=h,l=_n(l,r),h=Ad(e.stateNode,l,h),td(e,h),Rt!==4&&(Rt=2)),!1;var m=Error(o(520),{cause:l});if(m=_n(m,r),Ko===null?Ko=[m]:Ko.push(m),Rt!==4&&(Rt=2),n===null)return!0;l=_n(l,r),r=n;do{switch(r.tag){case 3:return r.flags|=65536,e=h&-h,r.lanes|=e,e=Ad(r.stateNode,l,e),td(r,e),!1;case 1:if(n=r.type,m=r.stateNode,(r.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(la===null||!la.has(m))))return r.flags|=65536,h&=-h,r.lanes|=h,h=vy(h),xy(h,e,r,l),td(r,h),!1;break;case 22:if(r.memoizedState!==null)return r.flags|=65536,!1}r=r.return}while(r!==null);return!1}var Ed=Error(o(461)),jt=!1;function It(e,n,r,l){n.child=e===null?Tg(n,null,r,l):Ua(n,e.child,r,l)}function wy(e,n,r,l,h){r=r.render;var m=n.ref;if("ref"in l){var k={};for(var O in l)O!=="ref"&&(k[O]=l[O])}else k=l;return Ia(n),l=sd(e,n,r,k,m,h),O=ud(),e!==null&&!jt?(cd(e,n,h),Di(e,n,h)):(tt&&O&&rs(n),n.flags|=1,It(e,n,l,h),n.child)}function Sy(e,n,r,l,h){if(e===null){var m=r.type;return typeof m=="function"&&!Pc(m)&&m.defaultProps===void 0&&r.compare===null?(n.tag=15,n.type=m,ky(e,n,m,l,h)):(e=is(r.type,null,l,n,n.mode,h),e.ref=n.ref,e.return=n,n.child=e)}if(m=e.child,!Ld(e,h)){var k=m.memoizedProps;if(r=r.compare,r=r!==null?r:Mo,r(k,l)&&e.ref===n.ref)return Di(e,n,h)}return n.flags|=1,e=Ai(m,l),e.ref=n.ref,e.return=n,n.child=e}function ky(e,n,r,l,h){if(e!==null){var m=e.memoizedProps;if(Mo(m,l)&&e.ref===n.ref)if(jt=!1,n.pendingProps=l=m,Ld(e,h))(e.flags&131072)!==0&&(jt=!0);else return n.lanes=e.lanes,Di(e,n,h)}return Cd(e,n,r,l,h)}function Ty(e,n,r,l){var h=l.children,m=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((n.flags&128)!==0){if(m=m!==null?m.baseLanes|r:r,e!==null){for(l=n.child=e.child,h=0;l!==null;)h=h|l.lanes|l.childLanes,l=l.sibling;l=h&~m}else l=0,n.child=null;return Ay(e,n,m,r,l)}if((r&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&cs(n,m!==null?m.cachePool:null),m!==null?Cg(n,m):id(),Rg(n);else return l=n.lanes=536870912,Ay(e,n,m!==null?m.baseLanes|r:r,r,l)}else m!==null?(cs(n,m.cachePool),Cg(n,m),na(),n.memoizedState=null):(e!==null&&cs(n,null),id(),na());return It(e,n,h,r),n.child}function Vo(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Ay(e,n,r,l,h){var m=Kc();return m=m===null?null:{parent:Nt._currentValue,pool:m},n.memoizedState={baseLanes:r,cachePool:m},e!==null&&cs(n,null),id(),Rg(n),e!==null&&_a(e,n,l,!0),n.childLanes=h,null}function Cs(e,n){return n=Rs({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function Ey(e,n,r){return Ua(n,e.child,null,r),e=Cs(n,n.pendingProps),e.flags|=2,kn(n),n.memoizedState=null,e}function yk(e,n,r){var l=n.pendingProps,h=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(tt){if(l.mode==="hidden")return e=Cs(n,l),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Vo(null,e);if(rd(n),(e=wt)?(e=Qb(e,Bn),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Gi!==null?{id:ri,overflow:oi}:null,retryLane:536870912,hydrationErrors:null},r=ug(e),r.return=n,n.child=r,Pt=n,wt=null)):e=null,e===null)throw Ji(n);return n.lanes=536870912,null}return Cs(n,l)}var m=e.memoizedState;if(m!==null){var k=m.dehydrated;if(rd(n),h)if(n.flags&256)n.flags&=-257,n=Ey(e,n,r);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(o(558));else if(jt||_a(e,n,r,!1),h=(r&e.childLanes)!==0,jt||h){if(ea.current===null){if(l=vt,l!==null&&(k=hp(l,r),k!==0&&k!==m.retryLane))throw m.retryLane=k,ja(e,k),mn(l,e,k),Ed;Ys()}n=Ey(e,n,r)}else e=m.treeContext,wt=Pn(k.nextSibling),Pt=n,tt=!0,Yi=null,Bn=!1,e!==null&&hg(n,e),n=Cs(n,l),n.flags|=134221824;return n}return e=Ai(e.child,{mode:l.mode,children:l.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Nr(e,n){var r=n.ref;if(r===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof r!="function"&&typeof r!="object")throw Error(o(284));(e===null||e.ref!==r)&&(n.flags|=4194816)}}function Cd(e,n,r,l,h){return Ia(n),r=sd(e,n,r,l,void 0,h),l=ud(),e!==null&&!jt?(cd(e,n,h),Di(e,n,h)):(tt&&l&&rs(n),n.flags|=1,It(e,n,r,h),n.child)}function Cy(e,n,r,l,h,m){return Ia(n),n.updateQueue=null,r=Ng(n,l,r,h),Mg(e),l=ud(),e!==null&&!jt?(cd(e,n,m),Di(e,n,m)):(tt&&l&&rs(n),n.flags|=1,It(e,n,r,m),n.child)}function Ry(e,n,r,l,h){if(Ia(n),n.stateNode===null){var m=xr,k=r.contextType;typeof k=="object"&&k!==null&&(m=$t(k)),m=new r(l,m),n.memoizedState=m.state!==null&&m.state!==void 0?m.state:null,m.updater=Td,n.stateNode=m,m._reactInternals=n,m=n.stateNode,m.props=l,m.state=n.memoizedState,m.refs={},Wc(n),k=r.contextType,m.context=typeof k=="object"&&k!==null?$t(k):xr,m.state=n.memoizedState,k=r.getDerivedStateFromProps,typeof k=="function"&&(kd(n,r,k,l),m.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof m.getSnapshotBeforeUpdate=="function"||typeof m.UNSAFE_componentWillMount!="function"&&typeof m.componentWillMount!="function"||(k=m.state,typeof m.componentWillMount=="function"&&m.componentWillMount(),typeof m.UNSAFE_componentWillMount=="function"&&m.UNSAFE_componentWillMount(),k!==m.state&&Td.enqueueReplaceState(m,m.state,null),Bo(n,l,m,h),Ho(),m.state=n.memoizedState),typeof m.componentDidMount=="function"&&(n.flags|=4194308),l=!0}else if(e===null){m=n.stateNode;var O=n.memoizedProps,F=Va(r,O);m.props=F;var ee=m.context,se=r.contextType;k=xr,typeof se=="object"&&se!==null&&(k=$t(se));var pe=r.getDerivedStateFromProps;se=typeof pe=="function"||typeof m.getSnapshotBeforeUpdate=="function",O=n.pendingProps!==O,se||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(O||ee!==k)&&my(n,m,l,k),Ki=!1;var K=n.memoizedState;m.state=K,Bo(n,l,m,h),Ho(),ee=n.memoizedState,O||K!==ee||Ki?(typeof pe=="function"&&(kd(n,r,pe,l),ee=n.memoizedState),(F=Ki||fy(n,r,F,l,K,ee,k))?(se||typeof m.UNSAFE_componentWillMount!="function"&&typeof m.componentWillMount!="function"||(typeof m.componentWillMount=="function"&&m.componentWillMount(),typeof m.UNSAFE_componentWillMount=="function"&&m.UNSAFE_componentWillMount()),typeof m.componentDidMount=="function"&&(n.flags|=4194308)):(typeof m.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=l,n.memoizedState=ee),m.props=l,m.state=ee,m.context=k,l=F):(typeof m.componentDidMount=="function"&&(n.flags|=4194308),l=!1)}else{m=n.stateNode,ed(e,n),k=n.memoizedProps,se=Va(r,k),m.props=se,pe=n.pendingProps,K=m.context,ee=r.contextType,F=xr,typeof ee=="object"&&ee!==null&&(F=$t(ee)),O=r.getDerivedStateFromProps,(ee=typeof O=="function"||typeof m.getSnapshotBeforeUpdate=="function")||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(k!==pe||K!==F)&&my(n,m,l,F),Ki=!1,K=n.memoizedState,m.state=K,Bo(n,l,m,h),Ho();var ie=n.memoizedState;k!==pe||K!==ie||Ki||e!==null&&e.dependencies!==null&&ss(e.dependencies)?(typeof O=="function"&&(kd(n,r,O,l),ie=n.memoizedState),(se=Ki||fy(n,r,se,l,K,ie,F)||e!==null&&e.dependencies!==null&&ss(e.dependencies))?(ee||typeof m.UNSAFE_componentWillUpdate!="function"&&typeof m.componentWillUpdate!="function"||(typeof m.componentWillUpdate=="function"&&m.componentWillUpdate(l,ie,F),typeof m.UNSAFE_componentWillUpdate=="function"&&m.UNSAFE_componentWillUpdate(l,ie,F)),typeof m.componentDidUpdate=="function"&&(n.flags|=4),typeof m.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof m.componentDidUpdate!="function"||k===e.memoizedProps&&K===e.memoizedState||(n.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||k===e.memoizedProps&&K===e.memoizedState||(n.flags|=1024),n.memoizedProps=l,n.memoizedState=ie),m.props=l,m.state=ie,m.context=F,l=se):(typeof m.componentDidUpdate!="function"||k===e.memoizedProps&&K===e.memoizedState||(n.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||k===e.memoizedProps&&K===e.memoizedState||(n.flags|=1024),l=!1)}return m=l,Nr(e,n),l=(n.flags&128)!==0,m||l?(m=n.stateNode,r=l&&typeof r.getDerivedStateFromError!="function"?null:m.render(),n.flags|=1,e!==null&&l?(n.child=Ua(n,e.child,null,h),n.child=Ua(n,null,r,h)):It(e,n,r,h),n.memoizedState=m.state,e=n.child):e=Di(e,n,h),e}function My(e,n,r,l){return La(),n.flags|=256,It(e,n,r,l),n.child}var Rd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Md(e){return{baseLanes:e,cachePool:bg()}}function Nd(e,n,r){return e=e!==null?e.childLanes&~r:0,n&&(e|=En),e}function Ny(e,n,r){var l=n.pendingProps,h=!1,m=(n.flags&128)!==0,k;if((k=m)||(k=e!==null&&e.memoizedState===null?!1:(Yt.current&2)!==0),k&&(h=!0,n.flags&=-129),k=(n.flags&32)!==0,n.flags&=-33,e===null){if(tt){if(h?ta(n):na(),(e=wt)?(e=Qb(e,Bn),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Gi!==null?{id:ri,overflow:oi}:null,retryLane:536870912,hydrationErrors:null},r=ug(e),r.return=n,n.child=r,Pt=n,wt=null)):e=null,e===null)throw Ji(n);return Mh(e)?n.lanes=32:n.lanes=536870912,null}return m=l.children,l=l.fallback,h?(na(),h=n.mode,m=Rs({mode:"hidden",children:m},h),l=Oa(l,h,r,null),m.return=n,l.return=n,m.sibling=l,n.child=m,l=n.child,l.memoizedState=Md(r),l.childLanes=Nd(e,k,r),n.memoizedState=Rd,Vo(null,l)):(ta(n),Dd(n,m))}var O=e.memoizedState;if(O!==null){var F=O.dehydrated;if(F!==null)return bk(e,n,m,k,l,F,O,r)}return h?(na(),h=l.fallback,m=n.mode,O=e.child,F=O.sibling,l=Ai(O,{mode:"hidden",children:l.children}),l.subtreeFlags=O.subtreeFlags&1206910976,F!==null?h=Ai(F,h):(h=Oa(h,m,r,null),h.flags|=2),h.return=n,l.return=n,l.sibling=h,n.child=l,Vo(null,l),l=n.child,h=e.child.memoizedState,h===null?h=Md(r):(m=h.cachePool,m!==null?(O=Nt._currentValue,m=m.parent!==O?{parent:O,pool:O}:m):m=bg(),h={baseLanes:h.baseLanes|r,cachePool:m}),l.memoizedState=h,l.childLanes=Nd(e,k,r),n.memoizedState=Rd,Vo(e.child,l)):(ta(n),r=e.child,e=r.sibling,r=Ai(r,{mode:"visible",children:l.children}),r.return=n,r.sibling=null,e!==null&&(k=n.deletions,k===null?(n.deletions=[e],n.flags|=16):k.push(e)),n.child=r,n.memoizedState=null,r)}function Dd(e,n){return n=Rs({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Rs(e,n){return e=cn(22,e,null,n),e.lanes=0,e}function Ms(e,n,r){return Ua(n,e.child,null,r),e=Dd(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function bk(e,n,r,l,h,m,k,O){if(r)return n.flags&256?(ta(n),n.flags&=-257,Ms(e,n,O)):n.memoizedState!==null?(na(),n.child=e.child,n.flags|=128,null):(na(),m=h.fallback,k=n.mode,h=Rs({mode:"visible",children:h.children},k),m=Oa(m,k,O,null),m.flags|=2,h.return=n,m.return=n,h.sibling=m,n.child=h,Ua(n,e.child,null,O),h=n.child,h.memoizedState=Md(O),h.childLanes=Nd(e,l,O),n.memoizedState=Rd,Vo(null,h));if(ta(n),Mh(m)){if(l=m.nextSibling&&m.nextSibling.dataset,l)var F=l.dgst;return l=F,l!==""&&(h=Error(o(419)),h.stack="",h.digest=l,jo({value:h,source:null,stack:null})),Ms(e,n,O)}if(jt||_a(e,n,O,!1),l=(O&e.childLanes)!==0,jt||l){if(ea.current!==null)return Ms(e,n,O);if(l=vt,l!==null&&(h=hp(l,O),h!==0&&h!==k.retryLane))throw k.retryLane=h,ja(e,h),mn(l,e,h),Ed;return Rh(m)||Ys(),Ms(e,n,O)}return Rh(m)?(n.flags|=192,n.child=e.child,null):(e=k.treeContext,wt=Pn(m.nextSibling),Pt=n,tt=!0,Yi=null,Bn=!1,e!==null&&hg(n,e),n=Dd(n,h.children),n.flags|=134221824,n)}function Dy(e,n,r){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n),ls(e.return,n,r)}function jy(e){for(var n=null;e!==null;){var r=e.alternate;r!==null&&gs(r)===null&&(n=e),e=e.sibling}return n}function Ns(e,n,r,l,h,m){var k=e.memoizedState;k===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:l,tail:r,tailMode:h,treeForkCount:m}:(k.isBackwards=n,k.rendering=null,k.renderingStartTime=0,k.last=l,k.tail=r,k.tailMode=h,k.treeForkCount=m)}function jd(e){var n=e.child;for(e.child=null;n!==null;){var r=n.sibling;n.sibling=e.child,e.child=n,n=r}}function Od(e,n,r){var l=n.pendingProps,h=l.revealOrder,m=l.tail;l=l.children;var k=Yt.current;if(n.flags&128)return qo(n,k),null;var O=(k&2)!==0;if(O?(k=k&1|2,n.flags|=128):k&=1,qo(n,k),h==="backwards"&&e!==null?(jd(e),It(e,n,l,r),jd(e)):It(e,n,l,r),l=tt?Do:0,!O&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Dy(e,r,n);else if(e.tag===19)Dy(e,r,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(h){case"backwards":r=jy(n.child),r===null?(h=n.child,n.child=null):(h=r.sibling,r.sibling=null,jd(n)),Ns(n,!0,h,null,m,l);break;case"unstable_legacy-backwards":for(r=null,h=n.child,n.child=null;h!==null;){if(e=h.alternate,e!==null&&gs(e)===null){n.child=h;break}e=h.sibling,h.sibling=r,r=h,h=e}Ns(n,!0,r,null,m,l);break;case"together":Ns(n,!1,null,null,void 0,l);break;case"independent":n.memoizedState=null;break;default:r=jy(n.child),r===null?(h=n.child,n.child=null):(h=r.sibling,r.sibling=null),Ns(n,!1,h,r,m,l)}return n.child}function Oy(e,n,r){var l=n.pendingProps;return Xi(n,n.type,l.value),It(e,n,l.children,r),n.child}function Di(e,n,r){if(e!==null&&(n.dependencies=e.dependencies),oa|=n.lanes,(r&n.childLanes)===0)if(e!==null){if(_a(e,n,r,!1),(r&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,r=Ai(e,e.pendingProps),n.child=r,r.return=n;e.sibling!==null;)e=e.sibling,r=r.sibling=Ai(e,e.pendingProps),r.return=n;r.sibling=null}return n.child}function Ld(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&ss(e)))}function vk(e,n,r){switch(n.tag){case 3:re(n,n.stateNode.containerInfo),Xi(n,Nt,e.memoizedState.cache),La();break;case 27:case 5:Re(n);break;case 4:re(n,n.stateNode.containerInfo);break;case 10:Xi(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,rd(n),null;break;case 13:var l=n.memoizedState;if(l!==null){if(l.dehydrated!==null)return ta(n),n.flags|=128,null;l=_a(e,n,r,!1);var h=n.child.childLanes;return l||(r&h)!==0?Ny(e,n,r):(ta(n),e=Di(e,n,r),e!==null?e.sibling:null)}ta(n);break;case 19:if(n.flags&128)return Od(e,n,r);if(h=(e.flags&128)!==0,l=(r&n.childLanes)!==0,l||(_a(e,n,r,!1),l=(r&n.childLanes)!==0),h){if(l)return Od(e,n,r);n.flags|=128}if(h=n.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),qo(n,Yt.current),l)break;return null;case 22:return n.lanes=0,Ty(e,n,r,n.pendingProps);case 24:Xi(n,Nt,e.memoizedState.cache)}return Di(e,n,r)}function Ly(e,n,r){if(e!==null)if(e.memoizedProps!==n.pendingProps)jt=!0;else{if(!Ld(e,r)&&(n.flags&128)===0)return jt=!1,vk(e,n,r);jt=(e.flags&131072)!==0}else jt=!1,tt&&(n.flags&1048576)!==0&&dg(n,Do,n.index);switch(n.lanes=0,n.tag){case 16:e:{var l=n.pendingProps;if(e=qa(n.elementType),n.type=e,typeof e=="function")Pc(e)?(l=Va(e,l),n.tag=1,n=Ry(null,n,e,l,r)):(n.tag=0,n=Cd(null,n,e,l,r));else{if(e!=null){var h=e.$$typeof;if(h===V){n.tag=11,n=wy(null,n,e,l,r);break e}else if(h===me){n.tag=14,n=Sy(null,n,e,l,r);break e}else if(h===M){n.tag=10,n.type=e,n=Oy(null,n,r);break e}}throw n=be(e)||e,Error(o(306,n,""))}}return n;case 0:return Cd(e,n,n.type,n.pendingProps,r);case 1:return l=n.type,h=Va(l,n.pendingProps),Ry(e,n,l,h,r);case 3:e:{if(re(n,n.stateNode.containerInfo),e===null)throw Error(o(387));l=n.pendingProps;var m=n.memoizedState;h=m.element,ed(e,n),Bo(n,l,null,r);var k=n.memoizedState;if(l=k.cache,Xi(n,Nt,l),l!==m.cache&&Jc(n,[Nt],r,!0),Ho(),l=k.element,m.isDehydrated)if(m={element:l,isDehydrated:!1,cache:k.cache},n.updateQueue.baseState=m,n.memoizedState=m,n.flags&256){n=My(e,n,l,r);break e}else if(l!==h){h=_n(Error(o(424)),n),jo(h),n=My(e,n,l,r);break e}else for(e=n.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,wt=Pn(e.firstChild),Pt=n,tt=!0,Yi=null,Bn=!0,r=Tg(n,null,l,r),n.child=r;r;)r.flags=r.flags&-3|134221824,r=r.sibling;else{if(La(),l===h){n=Di(e,n,r);break e}It(e,n,l,r)}n=n.child}return n;case 26:return Nr(e,n),e===null?(r=rv(n.type,null,n.pendingProps,null))?n.memoizedState=r:tt||(n.stateNode=Hb(n.type,n.pendingProps,Ge.current,n)):n.memoizedState=rv(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return Re(n),e===null&&tt&&(l=n.stateNode=tv(n.type,n.pendingProps,Ge.current),Pt=n,Bn=!0,h=wt,ca(n.type)?(Nh=h,wt=Pn(l.firstChild)):wt=h),It(e,n,n.pendingProps.children,r),Nr(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&tt&&((h=l=wt)&&(l=fT(l,n.type,n.pendingProps,Bn),l!==null?(n.stateNode=l,Pt=n,wt=Pn(l.firstChild),Bn=!1,h=!0):h=!1),h||Ji(n)),Re(n),h=n.type,m=n.pendingProps,k=e!==null?e.memoizedProps:null,l=m.children,wh(h,m)?l=null:k!==null&&wh(h,k)&&(n.flags|=32),n.memoizedState!==null&&(h=sd(e,n,sk,null,null,r),Jr._currentValue=h),Nr(e,n),It(e,n,l,r),n.child;case 6:return e===null&&tt&&((e=r=wt)&&(r=mT(r,n.pendingProps,Bn),r!==null?(n.stateNode=r,Pt=n,wt=null,e=!0):e=!1),e||Ji(n)),null;case 13:return Ny(e,n,r);case 4:return re(n,n.stateNode.containerInfo),l=n.pendingProps,e===null?n.child=Ua(n,null,l,r):It(e,n,l,r),n.child;case 11:return wy(e,n,n.type,n.pendingProps,r);case 7:return l=n.pendingProps,Nr(e,n),It(e,n,l,r),n.child;case 8:return It(e,n,n.pendingProps.children,r),n.child;case 12:return It(e,n,n.pendingProps.children,r),n.child;case 10:return Oy(e,n,r);case 9:return h=n.type._context,l=n.pendingProps.children,Ia(n),h=$t(h),l=l(h),n.flags|=1,It(e,n,l,r),n.child;case 14:return Sy(e,n,n.type,n.pendingProps,r);case 15:return ky(e,n,n.type,n.pendingProps,r);case 19:return Od(e,n,r);case 31:return yk(e,n,r);case 22:return Ty(e,n,r,n.pendingProps);case 24:return Ia(n),l=$t(Nt),e===null?(h=Kc(),h===null&&(h=vt,m=Xc(),h.pooledCache=m,m.refCount++,m!==null&&(h.pooledCacheLanes|=r),h=m),n.memoizedState={parent:l,cache:h},Wc(n),Xi(n,Nt,h)):((e.lanes&r)!==0&&(ed(e,n),Bo(n,null,null,r),Ho()),h=e.memoizedState,m=n.memoizedState,h.parent!==l?(h={parent:l,cache:l},n.memoizedState=h,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=h),Xi(n,Nt,l)):(l=m.cache,Xi(n,Nt,l),l!==h.cache&&Jc(n,[Nt],r,!0))),It(e,n,n.pendingProps.children,r),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),l=n.pendingProps,l.name!=null&&l.name!=="auto"?n.flags|=e===null?18882560:18874368:tt&&rs(n),e!==null&&e.memoizedProps.name!==l.name?n.flags|=4194816:Nr(e,n),It(e,n,l.children,r),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function ji(e){e.flags|=4}function zd(e,n,r,l,h){var m;if((m=(e.mode&32)!==0)&&(m=r===null?uv(n,l):uv(n,l)&&(l.src!==r.src||l.srcSet!==r.srcSet)),m){if(e.flags|=16777216,(h&335544128)===h)if(e.stateNode.complete)e.flags|=8192;else if(pb())e.flags|=8192;else throw Pa=hs,Qc}else e.flags&=-16777217}function zy(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!cv(n))if(pb())e.flags|=8192;else throw Pa=hs,Qc}function Ds(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?up():536870912,e.lanes|=n,zr|=n)}function $o(e,n){if(!tt)switch(e.tailMode){case"visible":break;case"collapsed":for(var r=e.tail,l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null;break;default:for(n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e.tail=null:r.sibling=null}}function St(e){var n=e.alternate!==null&&e.alternate.child===e.child,r=0,l=0;if(n)for(var h=e.child;h!==null;)r|=h.lanes|h.childLanes,l|=h.subtreeFlags&1206910976,l|=h.flags&1206910976,h.return=e,h=h.sibling;else for(h=e.child;h!==null;)r|=h.lanes|h.childLanes,l|=h.subtreeFlags,l|=h.flags,h.return=e,h=h.sibling;return e.subtreeFlags|=l,e.childLanes=r,n}function xk(e,n,r){var l=n.pendingProps;switch(Vc(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return St(n),null;case 1:return St(n),null;case 3:return r=n.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),n.memoizedState.cache!==l&&(n.flags|=2048),Ri(Nt),ue(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(kr(n)?ji(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Gc())),St(n),null;case 26:var h=n.type,m=n.memoizedState;return e===null?(ji(n),m!==null?(St(n),zy(n,m)):(St(n),zd(n,h,null,l,r))):m?m!==e.memoizedState?(ji(n),St(n),zy(n,m)):(St(n),n.flags&=-16777217):(e=e.memoizedProps,e!==l&&ji(n),St(n),zd(n,h,e,l,r)),null;case 27:if(Se(n),r=Ge.current,h=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==l&&ji(n);else{if(!l){if(n.stateNode===null)throw Error(o(166));return St(n),n.subtreeFlags&=-33554433,null}e=je.current,kr(n)?fg(n):(e=tv(h,l,r),n.stateNode=e,ji(n))}return St(n),n.subtreeFlags&=-33554433,null;case 5:if(Se(n),h=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==l&&ji(n);else{if(!l){if(n.stateNode===null)throw Error(o(166));return St(n),n.subtreeFlags&=-33554433,null}if(m=je.current,kr(n))fg(n);else{var k=nl(Ge.current);switch(m){case 1:m=k.createElementNS("http://www.w3.org/2000/svg",h);break;case 2:m=k.createElementNS("http://www.w3.org/1998/Math/MathML",h);break;default:switch(h){case"svg":m=k.createElementNS("http://www.w3.org/2000/svg",h);break;case"math":m=k.createElementNS("http://www.w3.org/1998/Math/MathML",h);break;case"script":m=k.createElement("div"),m.innerHTML="<script><\/script>",m=m.removeChild(m.firstChild);break;case"select":m=typeof l.is=="string"?k.createElement("select",{is:l.is}):k.createElement("select"),l.multiple?m.multiple=!0:l.size&&(m.size=l.size);break;default:m=typeof l.is=="string"?k.createElement(h,{is:l.is}):k.createElement(h)}}m[Vt]=n,m[un]=l;e:for(k=n.child;k!==null;){if(k.tag===5||k.tag===6)m.appendChild(k.stateNode);else if(k.tag!==4&&k.tag!==27&&k.child!==null){k.child.return=k,k=k.child;continue}if(k===n)break e;for(;k.sibling===null;){if(k.return===null||k.return===n)break e;k=k.return}k.sibling.return=k.return,k=k.sibling}n.stateNode=m;e:switch(Xt(m,h,l),h){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&ji(n)}}return St(n),n.subtreeFlags&=-33554433,zd(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,r),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==l&&ji(n);else{if(typeof l!="string"&&n.stateNode===null)throw Error(o(166));if(e=Ge.current,kr(n)){if(e=n.stateNode,r=n.memoizedProps,l=null,h=Pt,h!==null)switch(h.tag){case 27:case 5:l=h.memoizedProps}e[Vt]=n,e=!!(e.nodeValue===r||l!==null&&l.suppressHydrationWarning===!0||Lb(e.nodeValue,r)),e||Ji(n,!0)}else e=nl(e).createTextNode(l),e[Vt]=n,n.stateNode=e}return St(n),null;case 31:if(r=n.memoizedState,e===null||e.memoizedState!==null){if(l=kr(n),r!==null){if(e===null){if(!l)throw Error(o(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Vt]=n}else La(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;St(n),e=!1}else r=Gc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=r),e=!0;if(!e)return n.flags&256?(kn(n),n):(kn(n),null);if((n.flags&128)!==0)throw Error(o(558))}return St(n),null;case 13:if(l=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(h=kr(n),l!==null&&l.dehydrated!==null){if(e===null){if(!h)throw Error(o(318));if(h=n.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(o(317));h[Vt]=n}else La(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;St(n),h=!1}else h=Gc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=h),h=!0;if(!h)return n.flags&256?(kn(n),n):(kn(n),null)}return kn(n),(n.flags&128)!==0?(n.lanes=r,n):(r=l!==null,e=e!==null&&e.memoizedState!==null,r&&(l=n.child,h=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(h=l.alternate.memoizedState.cachePool.pool),m=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(m=l.memoizedState.cachePool.pool),m!==h&&(l.flags|=2048)),r!==e&&r&&(n.child.flags|=8192),Ds(n,n.updateQueue),St(n),null);case 4:return ue(),e===null&&gh(n.stateNode.containerInfo),n.flags|=67108864,St(n),null;case 10:return Ri(n.type),St(n),null;case 19:if(od(n),l=n.memoizedState,l===null)return St(n),null;if(h=(n.flags&128)!==0,m=l.rendering,m===null)if(h)$o(l,!1);else{if(Rt!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(m=gs(e),m!==null){for(n.flags|=128,$o(l,!1),e=m.updateQueue,n.updateQueue=e,Ds(n,e),n.subtreeFlags=0,e=r,r=n.child;r!==null;)sg(r,e),r=r.sibling;return qo(n,Yt.current&1|2),tt&&Ei(n,l.treeForkCount),n.child}e=e.sibling}l.tail!==null&&ct()>Fs&&(n.flags|=128,h=!0,$o(l,!1),n.lanes=4194304)}else{if(!h)if(e=gs(m),e!==null){if(n.flags|=128,h=!0,e=e.updateQueue,n.updateQueue=e,Ds(n,e),$o(l,!0),l.tail===null&&l.tailMode!=="collapsed"&&l.tailMode!=="visible"&&!m.alternate&&!tt)return St(n),null}else 2*ct()-l.renderingStartTime>Fs&&r!==536870912&&(n.flags|=128,h=!0,$o(l,!1),n.lanes=4194304);l.isBackwards?(m.sibling=n.child,n.child=m):(e=l.last,e!==null?e.sibling=m:n.child=m,l.last=m)}if(l.tail!==null){e=l.tail;e:{for(r=e;r!==null;){if(r.alternate!==null){r=!1;break e}r=r.sibling}r=!0}return l.rendering=e,l.tail=e.sibling,l.renderingStartTime=ct(),e.sibling=null,m=Yt.current,m=h?m&1|2:m&1,l.tailMode==="visible"||l.tailMode==="collapsed"||!r||tt?qo(n,m):(r=m,ce(Gt,n),ce(Yt,r),Qt===null&&(Qt=n)),tt&&Ei(n,l.treeForkCount),e}return St(n),null;case 22:case 23:return kn(n),ad(),l=n.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(n.flags|=8192):l&&(n.flags|=8192),l?(r&536870912)!==0&&(n.flags&128)===0&&(St(n),n.subtreeFlags&6&&(n.flags|=8192)):St(n),r=n.updateQueue,r!==null&&Ds(n,r.retryQueue),r=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(r=e.memoizedState.cachePool.pool),l=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(l=n.memoizedState.cachePool.pool),l!==r&&(n.flags|=2048),e!==null&&Me(Ba),null;case 24:return r=null,e!==null&&(r=e.memoizedState.cache),n.memoizedState.cache!==r&&(n.flags|=2048),Ri(Nt),St(n),null;case 25:return null;case 30:return n.flags|=33554432,St(n),null}throw Error(o(156,n.tag))}function wk(e,n){switch(Vc(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Ri(Nt),ue(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return Se(n),null;case 31:if(n.memoizedState!==null){if(kn(n),n.alternate===null)throw Error(o(340));La()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(kn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));La()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return od(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return ue(),null;case 10:return Ri(n.type),null;case 22:case 23:return kn(n),ad(),e!==null&&Me(Ba),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Ri(Nt),null;case 25:return null;default:return null}}function _y(e,n){switch(Vc(n),n.tag){case 3:Ri(Nt),ue();break;case 26:case 27:case 5:Se(n);break;case 4:ue();break;case 31:n.memoizedState!==null&&kn(n);break;case 13:kn(n);break;case 19:od(n);break;case 10:Ri(n.type);break;case 22:case 23:kn(n),ad(),e!==null&&Me(Ba);break;case 24:Ri(Nt)}}function Go(e,n){try{var r=n.updateQueue,l=r!==null?r.lastEffect:null;if(l!==null){var h=l.next;r=h;do{if((r.tag&e)===e){l=void 0;var m=r.create,k=r.inst;l=m(),k.destroy=l}r=r.next}while(r!==h)}}catch(O){mt(n,n.return,O)}}function ia(e,n,r){try{var l=n.updateQueue,h=l!==null?l.lastEffect:null;if(h!==null){var m=h.next;l=m;do{if((l.tag&e)===e){var k=l.inst,O=k.destroy;if(O!==void 0){k.destroy=void 0,h=n;var F=r,ee=O;try{ee()}catch(se){mt(h,F,se)}}}l=l.next}while(l!==m)}}catch(se){mt(n,n.return,se)}}function Iy(e){var n=e.updateQueue;if(n!==null){var r=e.stateNode;try{Eg(n,r)}catch(l){mt(e,e.return,l)}}}function Hy(e,n,r){r.props=Va(e.type,e.memoizedProps),r.state=e.memoizedState;try{r.componentWillUnmount()}catch(l){mt(e,n,l)}}function li(e,n){try{var r=e.ref;if(r!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:var h=e.stateNode,m=ki(e.memoizedProps,h);(h.ref===null||h.ref.name!==m)&&(h.ref=$b(m)),l=h.ref;break;case 7:if(e.stateNode===null){var k=new Rn(e);g(e.child,!1,dT,k,void 0,void 0),e.stateNode=k}l=e.stateNode;break;default:l=e.stateNode}typeof r=="function"?e.refCleanup=r(l):r.current=l}}catch(O){mt(e,n,O)}}function Jt(e,n){var r=e.ref,l=e.refCleanup;if(r!==null)if(typeof l=="function")try{l()}catch(h){mt(e,n,h)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof r=="function")try{r(null)}catch(h){mt(e,n,h)}else r.current=null}function js(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var r=0;r<n.length;r++)Kb(e.stateNode,n[r])}function By(e){for(var n=e.return;n!==null&&(Id(n)&&Kb(e.stateNode,n.stateNode),!_d(n));)n=n.return}function Yo(e){for(var n=e.return;n!==null&&(Id(n)&&hT(e.stateNode,n.stateNode),!_d(n));)n=n.return}function _d(e){return e.tag===5||e.tag===3||e.tag===27}function Id(e){return e&&e.tag===7&&e.stateNode!==null}function Hd(e){var n=e.type,r=e.memoizedProps,l=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":r.autoFocus&&l.focus();break e;case"img":r.src?l.src=r.src:r.srcSet&&(l.srcset=r.srcSet)}}catch(h){mt(e,e.return,h)}}function Bd(e,n,r){try{var l=e.stateNode;Yk(l,e.type,r,n),l[un]=n}catch(h){mt(e,e.return,h)}}function qy(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&ca(e.type)||e.tag===4}function qd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||qy(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&ca(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Pd(e,n,r,l){var h=e.tag;if(h===5||h===6)h=e.stateNode,n?(r.nodeType===9?r.body:r.nodeName==="HTML"?r.ownerDocument.body:r).insertBefore(h,n):(n=r.nodeType===9?r.body:r.nodeName==="HTML"?r.ownerDocument.body:r,n.appendChild(h),r=r._reactRootContainer,r!=null||n.onclick!==null||(n.onclick=ai)),js(e,l),lt=!0;else if(h!==4&&(h===27&&(js(e,l),l=null,ca(e.type)&&(r=e.stateNode,n=null)),e=e.child,e!==null))for(Pd(e,n,r,l),e=e.sibling;e!==null;)Pd(e,n,r,l),e=e.sibling}function Os(e,n,r,l){var h=e.tag;if(h===5||h===6)h=e.stateNode,n?r.insertBefore(h,n):r.appendChild(h),js(e,l),lt=!0;else if(h!==4&&(h===27&&(js(e,l),l=null,ca(e.type)&&(r=e.stateNode)),e=e.child,e!==null))for(Os(e,n,r,l),e=e.sibling;e!==null;)Os(e,n,r,l),e=e.sibling}function Py(e){var n=e.stateNode,r=e.memoizedProps;try{for(var l=e.type,h=n.attributes;h.length;)n.removeAttributeNode(h[0]);Xt(n,l,r),n[Vt]=e,n[un]=r}catch(m){mt(e,e.return,m)}}var Ls=!1,Tn=null;function Uy(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Ls=!0)}var si=null;function Fy(){var e=si;return si=null,e}var dn=0;function Dr(e,n,r,l,h){return dn=0,Vy(e.child,n,r,l,h)}function Vy(e,n,r,l,h){for(var m=!1;e!==null;){if(e.tag===5){var k=e.stateNode;if(l!==null){var O=Th(k);l.push(O),O.view&&(m=!0)}else m||Th(k).view&&(m=!0);Ls=!0,Fb(k,dn===0?n:n+"_"+dn,r),dn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&h||Vy(e.child,n,r,l,h)&&(m=!0));e=e.sibling}return m}function ui(e,n){for(;e!==null;)e.tag===5?Vb(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||ui(e.child,n)),e=e.sibling}function zs(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(zs(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(o(544));var r=n.name;n=Ti(n.default,n.share),n!=="none"&&(Dr(e,r,n,null,!1)||ui(e.child,!1))}e=e.sibling}}function Ud(e,n){if(e.tag===30){var r=e.stateNode,l=e.memoizedProps,h=ki(l,r),m=Ti(l.default,r.paired?l.share:l.enter);m!=="none"?Dr(e,h,m,null,!1)?(zs(e),r.paired||n||Br(e,l.onEnter)):ui(e.child,!1):zs(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ud(e,n),e=e.sibling;else zs(e)}function Fd(e){if(Tn!==null&&Tn.size!==0){var n=Tn;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var r=e.memoizedProps,l=r.name;if(l!=null&&l!=="auto"){var h=n.get(l);if(h!==void 0){var m=Ti(r.default,r.share);if(m!=="none"&&(Dr(e,l,m,null,!1)?(m=e.stateNode,h.paired=m,m.paired=h,Br(e,r.onShare)):ui(e.child,!1)),n.delete(l),n.size===0)break}}}Fd(e)}e=e.sibling}}}function Vd(e){if(e.tag===30){var n=e.memoizedProps,r=ki(n,e.stateNode),l=Tn!==null?Tn.get(r):void 0,h=Ti(n.default,l!==void 0?n.share:n.exit);h!=="none"&&(Dr(e,r,h,null,!1)?l!==void 0?(h=e.stateNode,l.paired=h,h.paired=l,Tn.delete(r),Br(e,n.onShare)):Br(e,n.onExit):ui(e.child,!1)),Tn!==null&&Fd(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Vd(e),e=e.sibling;else Tn!==null&&Fd(e)}function $y(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=ki(n,e.stateNode);n=Ti(n.default,n.update),e.flags&=-5,n!=="none"&&Dr(e,r,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&$y(e);e=e.sibling}}function $d(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,ui(e.child,!1))}$d(e)}e=e.sibling}}function _s(e){if(e.tag===30)e.stateNode.paired=null,ui(e.child,!1),$d(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)_s(e),e=e.sibling;else $d(e)}function Gy(e){for(e=e.child;e!==null;)e.tag===30?ui(e.child,!1):(e.subtreeFlags&33554432)!==0&&Gy(e),e=e.sibling}function Gd(e,n,r,l,h,m,k){for(var O=!1;n!==null;){if(n.tag===5){var F=n.stateNode;if(m!==null&&dn<m.length){var ee=m[dn],se=Th(F);(ee.view||se.view)&&(O=!0);var pe;if(pe=(e.flags&4)===0)if(se.clip)pe=!0;else{pe=ee.rect;var K=se.rect;pe=pe.y!==K.y||pe.x!==K.x||pe.height!==K.height||pe.width!==K.width}pe&&(e.flags|=4),se.abs?se=!ee.abs:(ee=ee.rect,se=se.rect,se=ee.height!==se.height||ee.width!==se.width),se&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&Fb(F,dn===0?r:r+"_"+dn,h),O&&(e.flags&4)!==0||(si===null&&(si=[]),si.push(F,dn===0?l:l+"_"+dn,n.memoizedProps)),dn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&k?e.flags|=n.flags&32:Gd(e,n.child,r,l,h,m,k)&&(O=!0));n=n.sibling}return O}function Yy(e,n){for(e=e.child;e!==null;){if(e.tag===30){var r=e.memoizedProps,l=e.stateNode,h=ki(r,l),m=Ti(r.default,r.update),k;k=e.memoizedState,e.memoizedState=null,l=e;var O=e.child;dn=0,h=Gd(l,O,h,h,m,k,!1),(e.flags&4)!==0&&h&&Br(e,r.onUpdate)}else(e.subtreeFlags&33554432)!==0&&Yy(e);e=e.sibling}}var Ut=!1,dt=!1,ci=!1,Yd=!1,Jy=typeof WeakSet=="function"?WeakSet:Set,Ft=null,di=!1,Jo=!1,Is=!1,Jd=!1;function Sk(e,n,r){if(e=e.containerInfo,vh=Xr,e=Qp(e),Lc(e)){if("selectionStart"in e)var l={start:e.selectionStart,end:e.selectionEnd};else e:{l=(l=e.ownerDocument)&&l.defaultView||window;var h=l.getSelection&&l.getSelection();if(h&&h.rangeCount!==0){l=h.anchorNode;var m=h.anchorOffset,k=h.focusNode;h=h.focusOffset;try{l.nodeType,k.nodeType}catch{l=null;break e}var O=0,F=-1,ee=-1,se=0,pe=0,K=e,ie=null;t:for(;;){for(var Ee;K!==l||m!==0&&K.nodeType!==3||(F=O+m),K!==k||h!==0&&K.nodeType!==3||(ee=O+h),K.nodeType===3&&(O+=K.nodeValue.length),(Ee=K.firstChild)!==null;)ie=K,K=Ee;for(;;){if(K===e)break t;if(ie===l&&++se===m&&(F=O),ie===k&&++pe===h&&(ee=O),(Ee=K.nextSibling)!==null)break;K=ie,ie=K.parentNode}K=Ee}l=F===-1||ee===-1?null:{start:F,end:ee}}else l=null}l=l||{start:0,end:0}}else l=null;for(xh={focusedElem:e,selectionRange:l},Xr=!1,r=(r&335544064)===r,Ft=n,n=r?9270:1024;Ft!==null;){if(e=Ft,r&&(l=e.deletions,l!==null))for(m=0;m<l.length;m++)r&&Vd(l[m]);if(e.alternate===null&&(e.flags&2)!==0)r&&Uy(e),Hs(r);else{if(e.tag===22){if(l=e.alternate,e.memoizedState!==null){l!==null&&l.memoizedState===null&&r&&Vd(l),Hs(r);continue}else if(l!==null&&l.memoizedState!==null){r&&Uy(e),Hs(r);continue}}l=e.child,(e.subtreeFlags&n)!==0&&l!==null?(l.return=e,Ft=l):(r&&$y(e),Hs(r))}}Tn=null}function Hs(e){for(;Ft!==null;){var n=Ft,r=e,l=n.alternate,h=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((h&1024)!==0&&l!==null){r=void 0,h=l.memoizedProps,l=l.memoizedState;var m=n.stateNode;try{var k=Va(n.type,h);r=m.getSnapshotBeforeUpdate(k,l),m.__reactInternalSnapshotBeforeUpdate=r}catch(O){mt(n,n.return,O)}}break;case 3:if((h&1024)!==0){if(l=n.stateNode.containerInfo,r=l.nodeType,r===9)Ch(l);else if(r===1)switch(l.nodeName){case"HEAD":case"HTML":case"BODY":Ch(l);break;default:l.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:r&&l!==null&&(r=ki(l.memoizedProps,l.stateNode),h=n.memoizedProps,h=Ti(h.default,h.update),h!=="none"&&Dr(l,r,h,l.memoizedState=[],!0));break;default:if((h&1024)!==0)throw Error(o(163))}if(l=n.sibling,l!==null){l.return=n.return,Ft=l;break}Ft=n.return}}function Xy(e,n,r){var l=r.flags;switch(r.tag){case 0:case 11:case 15:hi(e,r),l&4&&Go(5,r);break;case 1:if(hi(e,r),l&4)if(e=r.stateNode,n===null)try{e.componentDidMount()}catch(k){mt(r,r.return,k)}else{var h=Va(r.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(h,n,e.__reactInternalSnapshotBeforeUpdate)}catch(k){mt(r,r.return,k)}}l&64&&Iy(r),l&512&&li(r,r.return);break;case 3:if(hi(e,r),l&64&&(e=r.updateQueue,e!==null)){if(n=null,r.child!==null)switch(r.child.tag){case 27:case 5:n=r.child.stateNode;break;case 1:n=r.child.stateNode}try{Eg(e,n)}catch(k){mt(r,r.return,k)}}break;case 27:n===null&&l&4&&Py(r);case 26:case 5:hi(e,r),n===null&&l&4&&Hd(r),l&512&&li(r,r.return);break;case 12:hi(e,r);break;case 31:hi(e,r),l&4&&Wy(e,r);break;case 13:hi(e,r),l&4&&eb(e,r),l&64&&(e=r.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(r=Lk.bind(null,r),pT(e,r))));break;case 22:if(l=r.memoizedState!==null||Ut,!l){var m=n!==null&&n.memoizedState!==null||dt;n=Ut,h=dt,Ut=l,(dt=m)&&!h?(l=2,(r.subtreeFlags&8772)!==0&&(l|=1),Jn(e,r,l)):hi(e,r),Ut=n,dt=h}break;case 30:hi(e,r),l&512&&li(r,r.return);break;case 7:l&512&&li(r,r.return);default:hi(e,r)}}function Xd(e,n){for(e=e.child;e!==null;)Zy(e,n),e=e.sibling}function Zy(e,n){switch(e.tag){case 5:case 26:try{var r=e.stateNode;if(n){var l=r.style;typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"}else{var h=e.stateNode,m=e.memoizedProps.style,k=m!=null&&m.hasOwnProperty("display")?m.display:null;h.style.display=k==null||typeof k=="boolean"?"":(""+k).trim()}}catch(F){mt(e,e.return,F)}Zd(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,lt=!0}catch(F){mt(e,e.return,F)}break;case 18:try{var O=e.stateNode;n?Ub(O,!0):Ub(e.stateNode,!1)}catch(F){mt(e,e.return,F)}break;case 22:case 23:e.memoizedState===null&&Xd(e,n);break;default:Xd(e,n)}}function Zd(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var r=e,l=n;switch(r.tag){case 4:Zy(r,l);break e;case 22:r.memoizedState===null&&Zd(r,l);break e;default:Zd(r,l)}}e=e.sibling}}function Ky(e){var n=e.alternate;n!==null&&(e.alternate=null,Ky(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&Fl(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Tt=null,hn=!1;function Gn(e,n,r){for(r=r.child;r!==null;)Qy(e,n,r),r=r.sibling}function Qy(e,n,r){if(vn&&typeof vn.onCommitFiberUnmount=="function")try{vn.onCommitFiberUnmount(yo,r)}catch{}switch(r.tag){case 26:dt||Jt(r,n),Gn(e,n,r),r.memoizedState?r.memoizedState.count--:r.stateNode&&!dt&&(r=r.stateNode,r.parentNode.removeChild(r));break;case 27:dt||Jt(r,n),Yo(r);var l=Tt,h=hn;ca(r.type)&&(Tt=r.stateNode,hn=!1),Gn(e,n,r),nv(r.stateNode,r.type,r.memoizedProps),Tt=l,hn=h;break;case 5:dt||Jt(r,n),Yo(r);case 6:if(r.tag===6&&Yo(r),l=Tt,h=hn,Tt=null,Gn(e,n,r),Tt=l,hn=h,Tt!==null)if(hn)try{(Tt.nodeType===9?Tt.body:Tt.nodeName==="HTML"?Tt.ownerDocument.body:Tt).removeChild(r.stateNode),lt=!0}catch(m){mt(r,n,m)}else try{Tt.removeChild(r.stateNode),lt=!0}catch(m){mt(r,n,m)}break;case 18:Tt!==null&&(hn?(e=Tt,Pb(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,r.stateNode),Zr(e)):Pb(Tt,r.stateNode));break;case 4:l=Tt,h=hn,Tt=r.stateNode.containerInfo,hn=!0,Gn(e,n,r),Tt=l,hn=h;break;case 0:case 11:case 14:case 15:ia(2,r,n),dt||ia(4,r,n),Gn(e,n,r);break;case 1:dt||(Jt(r,n),l=r.stateNode,typeof l.componentWillUnmount=="function"&&Hy(r,n,l)),Gn(e,n,r);break;case 21:Gn(e,n,r);break;case 22:dt=(l=dt)||r.memoizedState!==null,Gn(e,n,r),dt=l;break;case 30:Jt(r,n),Gn(e,n,r);break;case 7:dt||Jt(r,n),Gn(e,n,r);break;default:Gn(e,n,r)}}function Wy(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Zr(e)}catch(r){mt(n,n.return,r)}}}function eb(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Zr(e)}catch(r){mt(n,n.return,r)}}function kk(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new Jy),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new Jy),n;default:throw Error(o(435,e.tag))}}function Bs(e,n){var r=kk(e);n.forEach(function(l){if(!r.has(l)){r.add(l);var h=zk.bind(null,e,l);l.then(h,h)}})}function nn(e,n,r){var l=n.deletions;if(l!==null)for(var h=0;h<l.length;h++){var m=l[h],k=e,O=n,F=O;e:for(;F!==null;){switch(F.tag){case 27:if(ca(F.type)){Tt=F.stateNode,hn=!1;break e}break;case 5:Tt=F.stateNode,hn=!1;break e;case 3:case 4:Tt=F.stateNode.containerInfo,hn=!0;break e}F=F.return}if(Tt===null)throw Error(o(160));Qy(k,O,m),Tt=null,hn=!1,k=m.alternate,k!==null&&(k.return=null),m.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)tb(n,e,r),n=n.sibling}var Yn=null;function tb(e,n,r){var l=e.alternate,h=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(h&4&&(l=e.updateQueue,l=l!==null?l.events:null,l!==null))for(var m=0;m<l.length;m++){var k=l[m];k.ref.impl=k.nextImpl}nn(n,e,r),an(e),h&4&&(ia(3,e,e.return),Go(3,e),ia(5,e,e.return));break;case 1:nn(n,e,r),an(e),h&512&&(dt||l===null||Jt(l,l.return)),h&64&&Ut&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(r=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=r===null?n:r.concat(n))));break;case 26:if(m=Yn,nn(n,e,r),an(e),h&512&&(dt||l===null||Jt(l,l.return)),h&4)if(h=l!==null?l.memoizedState:null,r=e.memoizedState,l===null)if(r===null)if(e.stateNode===null)if(Ut)e.stateNode=Hb(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,r=e.memoizedProps,h=m.ownerDocument||m;t:switch(n){case"title":l=h.getElementsByTagName("title")[0],(!l||l[xo]||l[Vt]||l.namespaceURI==="http://www.w3.org/2000/svg"||l.hasAttribute("itemprop"))&&(l=h.createElement(n),h.head.insertBefore(l,h.querySelector("head > title"))),Xt(l,n,r),l[Vt]=e,qt(l),n=l;break e;case"link":if(m=sv("link","href",h).get(n+(r.href||""))){for(k=0;k<m.length;k++)if(l=m[k],l.getAttribute("href")===(r.href==null||r.href===""?null:r.href)&&l.getAttribute("rel")===(r.rel==null?null:r.rel)&&l.getAttribute("title")===(r.title==null?null:r.title)&&l.getAttribute("crossorigin")===(r.crossOrigin==null?null:r.crossOrigin)){m.splice(k,1);break t}}l=h.createElement(n),Xt(l,n,r),h.head.appendChild(l);break;case"meta":if(m=sv("meta","content",h).get(n+(r.content||""))){for(k=0;k<m.length;k++)if(l=m[k],l.getAttribute("content")===(r.content==null?null:""+r.content)&&l.getAttribute("name")===(r.name==null?null:r.name)&&l.getAttribute("property")===(r.property==null?null:r.property)&&l.getAttribute("http-equiv")===(r.httpEquiv==null?null:r.httpEquiv)&&l.getAttribute("charset")===(r.charSet==null?null:r.charSet)){m.splice(k,1);break t}}l=h.createElement(n),Xt(l,n,r),h.head.appendChild(l);break;default:throw Error(o(468,n))}l[Vt]=e,qt(l),n=l}e.stateNode=n}else Ut||Lh(m,e.type,e.stateNode);else e.stateNode=lv(m,r,e.memoizedProps);else h!==r?(h===null?(n=l.stateNode,n===null||dt||n.parentNode.removeChild(n)):h.count--,r===null?Ut||Lh(m,e.type,e.stateNode):lv(m,r,e.memoizedProps)):r===null&&e.stateNode!==null&&Bd(e,e.memoizedProps,l.memoizedProps);break;case 27:nn(n,e,r),an(e),h&512&&(dt||l===null||Jt(l,l.return)),l!==null&&h&4&&Bd(e,e.memoizedProps,l.memoizedProps);break;case 5:if(m=ci,ci=!1,nn(n,e,r),ci=m,an(e),h&512&&(dt||l===null||Jt(l,l.return)),e.flags&32){n=e.stateNode;try{fr(n,""),lt=!0}catch(se){mt(e,e.return,se)}}h&4&&e.stateNode!=null&&(n=e.memoizedProps,Bd(e,n,l!==null?l.memoizedProps:n)),h&1024&&(Yd=!0);break;case 6:if(nn(n,e,r),an(e),h&4){if(e.stateNode===null)throw Error(o(162));n=e.memoizedProps,r=e.stateNode;try{r.nodeValue=n,lt=!0}catch(se){mt(e,e.return,se)}}break;case 3:if(lt=!1,eu=null,m=Yn,Yn=il(n.containerInfo),nn(n,e,r),Yn=m,an(e),h&4&&l!==null&&l.memoizedState.isDehydrated)try{Zr(n.containerInfo)}catch(se){mt(e,e.return,se)}Yd&&(Yd=!1,nb(e)),lt=!1;break;case 4:h=ci,ci=Ut,l=Sp(),m=Yn,Yn=il(e.stateNode.containerInfo),nn(n,e,r),an(e),Yn=m,lt&&Jo&&(Is=!0),lt=l,ci=h;break;case 12:nn(n,e,r),an(e);break;case 31:nn(n,e,r),an(e),h&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Bs(e,n)));break;case 13:nn(n,e,r),an(e),e.child.flags&8192&&e.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&(Us=ct()),h&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Bs(e,n)));break;case 22:m=e.memoizedState!==null,k=l!==null&&l.memoizedState!==null;var O=Ut,F=dt,ee=ci;Ut=O||m,ci=ee||m,dt=F||k,nn(n,e,r),dt=F,ci=ee,Ut=O,an(e),h&8192&&(n=e.stateNode,n._visibility=m?n._visibility&-2:n._visibility|1,!m||l===null||k||Ut||dt||(n=k||dt,r=Ut,l=dt,Ut=m||Ut,dt=n,aa(e,2),Ut=r,dt=l),!m&&ci||Xd(e,m)),h&4&&(n=e.updateQueue,n!==null&&(r=n.retryQueue,r!==null&&(n.retryQueue=null,Bs(e,r))));break;case 19:nn(n,e,r),an(e),h&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Bs(e,n)));break;case 30:h&512&&(dt||l===null||Jt(l,l.return)),h=Sp(),m=Jo,k=(r&335544064)===r,O=e.memoizedProps,Jo=k&&Ti(O.default,O.update)!=="none",nn(n,e,r),an(e),k&&l!==null&&lt&&(e.flags|=4),Jo=m,lt=h;break;case 21:break;case 7:h&512&&(dt||l===null||Jt(l,l.return)),l&&l.stateNode!==null&&(l.stateNode._fragmentFiber=e);default:nn(n,e,r),an(e)}}function an(e){var n=e.flags;if(n&2){try{for(var r,l=e.return;l!==null;){if(qy(l)){r=l;break}l=l.return}l=null;for(var h=e.return;h!==null;){if(Id(h)){var m=h.stateNode;l===null?l=[m]:l.push(m)}if(_d(h))break;h=h.return}var k=l;if(r==null)throw Error(o(160));switch(r.tag){case 27:var O=r.stateNode,F=qd(e);Os(e,F,O,k);break;case 5:var ee=r.stateNode;r.flags&32&&(fr(ee,""),r.flags&=-33);var se=qd(e);Os(e,se,ee,k);break;case 3:case 4:var pe=r.stateNode.containerInfo,K=qd(e);Pd(e,K,pe,k);break;default:throw Error(o(161))}}catch(ie){mt(e,e.return,ie)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function nb(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;nb(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Xr=!0,n.reset(),Xr=!1),e=e.sibling}}function jr(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)ib(n,e),n=n.sibling;else Yy(n)}function ib(e,n){var r=e.alternate;if(r===null)Ud(e,!1);else switch(e.tag){case 3:if(Jd=di=!1,Fy(),jr(n,e),!di&&!Is){if(e=si,e!==null)for(var l=0;l<e.length;l+=3){r=e[l];var h=e[l+1];Vb(r,e[l+2]),r=r.ownerDocument.documentElement,r!==null&&r.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+h+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Jd=!0}si=null;break;case 5:jr(n,e);break;case 4:l=di,di=!1,jr(n,e),di&&(Is=!0),di=l;break;case 22:e.memoizedState===null&&(r.memoizedState!==null?Ud(e,!1):jr(n,e));break;case 30:l=di,h=Fy(),di=!1,jr(n,e),di&&(e.flags|=4);var m=e.memoizedProps,k=e.stateNode;n=ki(m,k),k=ki(r.memoizedProps,k);var O=Ti(m.default,m.update);O==="none"?n=!1:(m=r.memoizedState,r.memoizedState=null,r=e.child,dn=0,n=Gd(e,r,n,k,O,m,!0),dn!==(m===null?0:m.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(Br(e,e.memoizedProps.onUpdate),si=h):h!==null&&(h.push.apply(h,si),si=h),di=(e.flags&32)!==0?!0:l;break;default:jr(n,e)}}function hi(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Xy(e,n.alternate,n),n=n.sibling}function aa(e,n){for(e=e.child;e!==null;){var r=e,l=n;switch(r.tag){case 0:case 11:case 14:case 15:ia(4,r,r.return),aa(r,l);break;case 1:Jt(r,r.return);var h=r.stateNode;typeof h.componentWillUnmount=="function"&&Hy(r,r.return,h),aa(r,l);break;case 27:(l&2)!==0&&nv(r.stateNode,r.type,r.memoizedProps);case 5:Jt(r,r.return),r.tag!==5&&r.tag!==27||Yo(r),aa(r,l);break;case 6:Yo(r);break;case 26:Jt(r,r.return),h=r.stateNode,r.memoizedState!==null||h===null||dt||h.parentNode.removeChild(h),aa(r,l);break;case 22:r.memoizedState===null&&aa(r,l);break;case 30:Jt(r,r.return),aa(r,l);break;case 7:Jt(r,r.return);default:aa(r,l)}e=e.sibling}}function Jn(e,n,r){for(r=(n.subtreeFlags&8772)!==0?r:r&-2,n=n.child;n!==null;){var l=n.alternate,h=e,m=n,k=m.flags,O=(r&1)!==0;switch(m.tag){case 0:case 11:case 15:Jn(h,m,r),Go(4,m);break;case 1:if(Jn(h,m,r),l=m,h=l.stateNode,typeof h.componentDidMount=="function")try{h.componentDidMount()}catch(se){mt(l,l.return,se)}if(l=m,h=l.updateQueue,h!==null){var F=l.stateNode;try{var ee=h.shared.hiddenCallbacks;if(ee!==null)for(h.shared.hiddenCallbacks=null,h=0;h<ee.length;h++)Ag(ee[h],F)}catch(se){mt(l,l.return,se)}}O&&k&64&&Iy(m),li(m,m.return);break;case 27:(r&2)!==0&&Py(m);case 5:m.tag!==5&&m.tag!==27||By(m),Jn(h,m,r),O&&l===null&&k&4&&Hd(m),li(m,m.return);break;case 6:By(m);break;case 26:F=m.stateNode,m.memoizedState!==null||F===null||Ut||Lh(il(F.ownerDocument),m.type,F),Jn(h,m,r),O&&l===null&&k&4&&Hd(m),li(m,m.return);break;case 12:Jn(h,m,r);break;case 31:Jn(h,m,r),O&&k&4&&Wy(h,m);break;case 13:Jn(h,m,r),O&&k&4&&eb(h,m);break;case 22:m.memoizedState===null&&Jn(h,m,r),li(m,m.return);break;case 30:Jn(h,m,r),li(m,m.return);break;case 7:li(m,m.return);default:Jn(h,m,r)}n=n.sibling}}function Kd(e,n){var r=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(r=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==r&&(e!=null&&e.refCount++,r!=null&&Oo(r))}function Qd(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&Oo(e))}function qn(e,n,r,l){var h=(r&335544064)===r;if(n.subtreeFlags&(h?10262:10256))for(n=n.child;n!==null;)ab(e,n,r,l),n=n.sibling;else h&&Gy(n)}function ab(e,n,r,l){var h=(r&335544064)===r;h&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&_s(n);var m=n.flags;switch(n.tag){case 0:case 11:case 15:qn(e,n,r,l),m&2048&&Go(9,n);break;case 1:qn(e,n,r,l);break;case 3:qn(e,n,r,l),h&&Jd&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),m&2048&&(m=null,n.alternate!==null&&(m=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==m&&(n.refCount++,m!=null&&Oo(m)));break;case 12:if(m&2048){qn(e,n,r,l),m=n.stateNode;try{var k=n.memoizedProps,O=k.id,F=k.onPostCommit;typeof F=="function"&&F(O,n.alternate===null?"mount":"update",m.passiveEffectDuration,-0)}catch(ee){mt(n,n.return,ee)}}else qn(e,n,r,l);break;case 31:qn(e,n,r,l);break;case 13:qn(e,n,r,l);break;case 23:break;case 22:k=n.stateNode,O=n.alternate,n.memoizedState!==null?(h&&O!==null&&O.memoizedState===null&&_s(O),k._visibility&2?qn(e,n,r,l):Xo(e,n)):(h&&O!==null&&O.memoizedState!==null&&_s(n),k._visibility&2?qn(e,n,r,l):(k._visibility|=2,Or(e,n,r,l,(n.subtreeFlags&10256)!==0||!1))),m&2048&&Kd(O,n);break;case 24:qn(e,n,r,l),m&2048&&Qd(n.alternate,n);break;case 30:h&&(m=n.alternate,m!==null&&(ui(m.child,!0),ui(n.child,!0))),qn(e,n,r,l);break;default:qn(e,n,r,l)}}function Or(e,n,r,l,h){for(h=h&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var m=e,k=n,O=r,F=l,ee=k.flags;switch(k.tag){case 0:case 11:case 15:Or(m,k,O,F,h),Go(8,k);break;case 23:break;case 22:var se=k.stateNode;k.memoizedState!==null?se._visibility&2?Or(m,k,O,F,h):Xo(m,k):(se._visibility|=2,Or(m,k,O,F,h)),h&&ee&2048&&Kd(k.alternate,k);break;case 24:Or(m,k,O,F,h),h&&ee&2048&&Qd(k.alternate,k);break;default:Or(m,k,O,F,h)}n=n.sibling}}function Xo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var r=e,l=n,h=l.flags;switch(l.tag){case 22:Xo(r,l),h&2048&&Kd(l.alternate,l);break;case 24:Xo(r,l),h&2048&&Qd(l.alternate,l);break;default:Xo(r,l)}n=n.sibling}}var $a=8192;function Ga(e,n,r){if(e.subtreeFlags&$a)for(e=e.child;e!==null;)rb(e,n,r),e=e.sibling}function rb(e,n,r){switch(e.tag){case 26:Ga(e,n,r),e.flags&$a&&(e.memoizedState!==null?MT(r,Yn,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&hv(r,e)));break;case 5:Ga(e,n,r),e.flags&$a&&(e=e.stateNode,(n&335544128)===n&&hv(r,e));break;case 3:case 4:var l=Yn;Yn=il(e.stateNode.containerInfo),Ga(e,n,r),Yn=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=$a,$a=16777216,Ga(e,n,r),$a=l):Ga(e,n,r));break;case 30:if((e.flags&$a)!==0&&(l=e.memoizedProps.name,l!=null&&l!=="auto")){var h=e.stateNode;h.paired=null,Tn===null&&(Tn=new Map),Tn.set(l,h)}Ga(e,n,r);break;default:Ga(e,n,r)}}function ob(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Zo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];Ft=l,sb(l,e)}ob(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)lb(e),e=e.sibling}function lb(e){switch(e.tag){case 0:case 11:case 15:Zo(e),e.flags&2048&&ia(9,e,e.return);break;case 3:Zo(e);break;case 12:Zo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,qs(e)):Zo(e);break;default:Zo(e)}}function qs(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];Ft=l,sb(l,e)}ob(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:ia(8,n,n.return),qs(n);break;case 22:r=n.stateNode,r._visibility&2&&(r._visibility&=-3,qs(n));break;default:qs(n)}e=e.sibling}}function sb(e,n){for(;Ft!==null;){var r=Ft;switch(r.tag){case 0:case 11:case 15:ia(8,r,n);break;case 23:case 22:if(r.memoizedState!==null&&r.memoizedState.cachePool!==null){var l=r.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Oo(r.memoizedState.cache)}if(l=r.child,l!==null)l.return=r,Ft=l;else e:for(r=e;Ft!==null;){l=Ft;var h=l.sibling,m=l.return;if(Ky(l),l===r){Ft=null;break e}if(h!==null){h.return=m,Ft=h;break e}Ft=m}}}var Tk={getCacheForType:function(e){var n=$t(Nt),r=n.data.get(e);return r===void 0&&(r=e(),n.data.set(e,r)),r},cacheSignal:function(){return $t(Nt).controller.signal}},Ak=typeof WeakMap=="function"?WeakMap:Map,st=0,vt=null,nt=null,at=0,ft=0,An=null,ra=!1,Lr=!1,Wd=!1,Oi=0,Rt=0,oa=0,Ya=0,Ps=0,En=0,zr=0,Ko=null,fn=null,eh=!1,Us=0,ub=0,Fs=1/0,Vs=null,la=null,At=0,Xn=null,Ja=null,fi=0,th=0,nh=null,cb=null,_r=null,Ir=null,Hr=null,Qo=0,$s=null;function Cn(){return(st&2)!==0&&at!==0?at&-at:de.T!==null?hh():fp()}function db(){if(En===0)if((at&536870912)===0||tt){var e=Bl;Bl<<=1,(Bl&3932160)===0&&(Bl=262144),En=e}else En=536870912;return e=Gt.current,e!==null&&(e.flags|=32),En}function Br(e,n){if(n!=null){var r=e.stateNode,l=r.ref;l===null&&(l=r.ref=$b(ki(e.memoizedProps,r))),Ir===null&&(Ir=[]),Ir.push(n.bind(null,l))}}function mn(e,n,r){(e===vt&&(ft===2||ft===9)||e.cancelPendingCommit!==null)&&(qr(e,0),sa(e,at,En,!1)),vo(e,r),((st&2)===0||e!==vt)&&(e===vt&&((st&2)===0&&(Ya|=r),Rt===4&&sa(e,at,En,!1)),mi(e))}function hb(e,n,r){if((st&6)!==0)throw Error(o(327));var l=!r&&(n&127)===0&&(n&e.expiredLanes)===0||bo(e,n),h=l?Rk(e,n):ah(e,n,!0),m=l;do{if(h===0){Lr&&!l&&sa(e,n,0,!1);break}else{if(r=e.current.alternate,m&&!Ek(r)){h=ah(e,n,!1),m=!1;continue}if(h===2){if(m=n,e.errorRecoveryDisabledLanes&m)var k=0;else k=e.pendingLanes&-536870913,k=k!==0?k:k&536870912?536870912:0;if(k!==0){n=k;e:{var O=e;h=Ko;var F=O.current.memoizedState.isDehydrated;if(F&&(qr(O,k).flags|=256),k=ah(O,k,!1),k!==2&&k!==6){if(Wd&&!F){O.errorRecoveryDisabledLanes|=m,Ya|=m,h=4;break e}m=fn,fn=h,m!==null&&(fn===null?fn=m:fn.push.apply(fn,m))}h=k}if(m=!1,h!==2)continue}}if(h===1){qr(e,0),sa(e,n,0,!0);break}e:{switch(l=e,m=h,m){case 0:case 1:throw Error(o(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:sa(l,n,En,!ra);break e;case 2:fn=null;break;case 3:case 5:break;default:throw Error(o(329))}if((n&62914560)===n&&(h=Us+300-ct(),10<h)){if(sa(l,n,En,!ra),Pl(l,0,!0)!==0)break e;fi=n,l.timeoutHandle=kh(fb.bind(null,l,r,fn,Vs,eh,n,En,Ya,zr,ra,m,"Throttled",-0,0),h);break e}fb(l,r,fn,Vs,eh,n,En,Ya,zr,ra,m,null,-0,0)}}break}while(!0);mi(e)}function fb(e,n,r,l,h,m,k,O,F,ee,se,pe,K,ie){e.timeoutHandle=-1;var Ee=n.subtreeFlags,_e=(m&335544064)===m;if(pe=null,(_e||Ee&8192||(Ee&16785408)===16785408)&&(pe={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ai},Tn=null,rb(n,m,pe),_e&&(Ee=pe,_e=e.containerInfo,_e=(_e.nodeType===9?_e:_e.ownerDocument).__reactViewTransition,_e!=null&&(Ee.count++,Ee.waitingForViewTransition=!0,Ee=ol.bind(Ee),_e.finished.then(Ee,Ee))),Ee=(m&62914560)===m?Us-ct():(m&4194048)===m?ub-ct():0,Ee=NT(pe,Ee),Ee!==null)){fi=m,e.cancelPendingCommit=Ee(wb.bind(null,e,n,m,r,l,h,k,O,F,ee,se,pe,null,K,ie)),sa(e,m,k,!ee);return}wb(e,n,m,r,l,h,k,O,F,ee,se,pe)}function Ek(e){for(var n=e;;){var r=n.tag;if((r===0||r===11||r===15)&&n.flags&16384&&(r=n.updateQueue,r!==null&&(r=r.stores,r!==null)))for(var l=0;l<r.length;l++){var h=r[l],m=h.getSnapshot;h=h.value;try{if(!Sn(m(),h))return!1}catch{return!1}}if(r=n.child,n.subtreeFlags&16384&&r!==null)r.return=n,n=r;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function sa(e,n,r,l){n=sp(e,n),n&=~Ps,n&=~Ya,e.suspendedLanes|=n,e.pingedLanes&=~n,l&&(e.warmLanes|=n),l=e.expirationTimes;for(var h=n;0<h;){var m=31-xn(h),k=1<<m;l[m]=-1,h&=~k}r!==0&&cp(e,r,n)}function Gs(){return(st&6)===0?(Wo(0),!1):!0}function ih(){if(nt!==null){if(ft===0)var e=nt.return;else e=nt,Ci=za=null,dd(e),Er=null,_o=0,e=nt;for(;e!==null;)_y(e.alternate,e),e=e.return;nt=null}}function qr(e,n){var r=e.timeoutHandle;return r!==-1&&(e.timeoutHandle=-1,Zk(r)),r=e.cancelPendingCommit,r!==null&&(e.cancelPendingCommit=null,r()),fi=0,ih(),vt=e,nt=r=Ai(e.current,null),at=n,ft=0,An=null,ra=!1,Lr=bo(e,n),Wd=!1,zr=En=Ps=Ya=oa=Rt=0,fn=Ko=null,eh=!1,Oi=sp(e,n),es(),r}function mb(e,n){Ze=null,de.H=As,n===Ar||n===ds?(n=wg(),ft=3):n===Qc?(n=wg(),ft=4):ft=n===Ed?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,An=n,nt===null&&(Rt=1,Es(e,_n(n,e.current)))}function pb(){var e=Gt.current;return e===null?!0:(at&4194048)===at?Qt===null:(at&62914560)===at||(at&536870912)!==0?e===Qt:!1}function gb(){var e=de.H;return de.H=As,e===null?As:e}function yb(){var e=de.A;return de.A=Tk,e}function Ys(){Rt=4,ra||(at&4194048)!==at&&Gt.current!==null||(Lr=!0),(oa&134217727)===0&&(Ya&134217727)===0||vt===null||sa(vt,at,En,!1)}function ah(e,n,r){var l=st;st|=2;var h=gb(),m=yb();(vt!==e||at!==n)&&(Vs=null,qr(e,n)),n=!1;var k=Rt;e:do try{if(ft!==0&&nt!==null){var O=nt,F=An;switch(ft){case 8:ih(),k=6;break e;case 3:case 2:case 9:case 6:Gt.current===null&&(n=!0);var ee=ft;if(ft=0,An=null,Pr(e,O,F,ee),r&&Lr){k=0;break e}break;default:ee=ft,ft=0,An=null,Pr(e,O,F,ee)}}Ck(),k=Rt;break}catch(se){mb(e,se)}while(!0);return n&&e.shellSuspendCounter++,Ci=za=null,st=l,de.H=h,de.A=m,nt===null&&(vt=null,at=0,es()),k}function Ck(){for(;nt!==null;)bb(nt)}function Rk(e,n){var r=st;st|=2;var l=gb(),h=yb();vt!==e||at!==n?(Vs=null,Fs=ct()+500,qr(e,n)):Lr=bo(e,n);e:do try{if(ft!==0&&nt!==null){n=nt;var m=An;t:switch(ft){case 1:ft=0,An=null,Pr(e,n,m,1);break;case 2:case 9:if(vg(m)){ft=0,An=null,vb(n);break}n=function(){ft!==2&&ft!==9||vt!==e||(ft=7),mi(e)},m.then(n,n);break e;case 3:ft=7;break e;case 4:ft=5;break e;case 7:vg(m)?(ft=0,An=null,vb(n)):(ft=0,An=null,Pr(e,n,m,7));break;case 5:var k=null;switch(nt.tag){case 26:k=nt.memoizedState;case 5:case 27:var O=nt;if(k?cv(k):O.stateNode.complete){ft=0,An=null;var F=O.sibling;if(F!==null)nt=F;else{var ee=O.return;ee!==null?(nt=ee,Js(ee)):nt=null}break t}}ft=0,An=null,Pr(e,n,m,5);break;case 6:ft=0,An=null,Pr(e,n,m,6);break;case 8:ih(),Rt=6;break e;default:throw Error(o(462))}}Mk();break}catch(se){mb(e,se)}while(!0);return Ci=za=null,de.H=l,de.A=h,st=r,nt!==null?0:(vt=null,at=0,es(),Rt)}function Mk(){for(;nt!==null&&!kt();)bb(nt)}function bb(e){var n=Ly(e.alternate,e,Oi);e.memoizedProps=e.pendingProps,n===null?Js(e):nt=n}function vb(e){var n=e,r=n.alternate;switch(n.tag){case 15:case 0:n=Cy(r,n,n.pendingProps,n.type,void 0,at);break;case 11:n=Cy(r,n,n.pendingProps,n.type.render,n.ref,at);break;case 5:dd(n);var l=n;l===Pt&&(tt?(os(l),l.tag===5&&l.stateNode!=null&&(wt=l.stateNode)):(os(l),tt=!0));default:_y(r,n),n=nt=sg(n,Oi),n=Ly(r,n,Oi)}e.memoizedProps=e.pendingProps,n===null?Js(e):nt=n}function Pr(e,n,r,l){Ci=za=null,dd(n),Er=null,_o=0;var h=n.return;try{if(gk(e,h,n,r,at)){Rt=1,Es(e,_n(r,e.current)),nt=null;return}}catch(m){if(h!==null)throw nt=h,m;Rt=1,Es(e,_n(r,e.current)),nt=null;return}n.flags&32768?(tt||l===1?e=!0:Lr||(at&536870912)!==0?e=!1:(ra=e=!0,(l===2||l===9||l===3||l===6)&&(l=Gt.current,l!==null&&l.tag===13&&(l.flags|=16384))),xb(n,e)):Js(n)}function Js(e){var n=e;do{if((n.flags&32768)!==0){xb(n,ra);return}e=n.return;var r=xk(n.alternate,n,Oi);if(r!==null){nt=r;return}if(n=n.sibling,n!==null){nt=n;return}nt=n=e}while(n!==null);Rt===0&&(Rt=5)}function xb(e,n){do{var r=wk(e.alternate,e);if(r!==null){r.flags&=32767,nt=r;return}if(r=e.return,r!==null&&(r.flags|=32768,r.subtreeFlags=0,r.deletions=null),!n&&(e=e.sibling,e!==null)){nt=e;return}nt=e=r}while(e!==null);Rt=6,nt=null}function wb(e,n,r,l,h,m,k,O,F,ee,se,pe){e.cancelPendingCommit=null;do Xs();while(At!==0);if((st&6)!==0)throw Error(o(327));if(n!==null){if(n===e.current)throw Error(o(177));e===vt&&(nt=vt=null,at=0),Ja=n,Xn=e,fi=r,nh=h,cb=l,Nk(e,n,r,k,O,F,pe)}}function Nk(e,n,r,l,h,m,k){var O=n.lanes|n.childLanes;if(th=O,O|=Bc,nS(e,r,O,l,h,m),Ir=null,(r&335544064)===r?(Hr=ak(e),l=10262):(Hr=null,l=10256),(n.subtreeFlags&l)!==0||(n.flags&l)!==0?(e.callbackNode=null,e.callbackPriority=0,_k(Il,function(){return sh(),null})):(e.callbackNode=null,e.callbackPriority=0),Ls=!1,l=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||l){l=de.T,de.T=null,h=ae.p,ae.p=2,m=st,st|=4;try{Sk(e,n,r)}finally{st=m,ae.p=h,de.T=l}}At=1,Ls?_r=nT(k,e.containerInfo,Hr,rh,oh,jk,lh,sh,Dk):(rh(),oh(),lh())}function Dk(e){if(At!==0){var n=Xn.onRecoverableError;n(e,{componentStack:null})}}function jk(){At===3&&(At=0,ib(Ja,Xn),At=4)}function rh(){if(At===1){At=0;var e=Xn,n=Ja,r=fi,l=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||l){l=de.T,de.T=null;var h=ae.p;ae.p=2;var m=st;st|=4;try{Jo=Is=!1,tb(n,e,r),r=xh;var k=Qp(e.containerInfo),O=r.focusedElem,F=r.selectionRange;if(k!==O&&O&&O.ownerDocument&&Kp(O.ownerDocument.documentElement,O)){if(F!==null&&Lc(O)){var ee=F.start,se=F.end;if(se===void 0&&(se=ee),"selectionStart"in O)O.selectionStart=ee,O.selectionEnd=Math.min(se,O.value.length);else{var pe=O.ownerDocument||document,K=pe&&pe.defaultView||window;if(K.getSelection){var ie=K.getSelection(),Ee=O.textContent.length,_e=Math.min(F.start,Ee),Ke=F.end===void 0?_e:Math.min(F.end,Ee);!ie.extend&&_e>Ke&&(k=Ke,Ke=_e,_e=k);var Q=Zp(O,_e),J=Zp(O,Ke);if(Q&&J&&(ie.rangeCount!==1||ie.anchorNode!==Q.node||ie.anchorOffset!==Q.offset||ie.focusNode!==J.node||ie.focusOffset!==J.offset)){var ne=pe.createRange();ne.setStart(Q.node,Q.offset),ie.removeAllRanges(),_e>Ke?(ie.addRange(ne),ie.extend(J.node,J.offset)):(ne.setEnd(J.node,J.offset),ie.addRange(ne))}}}}for(pe=[],ie=O;ie=ie.parentNode;)ie.nodeType===1&&pe.push({element:ie,left:ie.scrollLeft,top:ie.scrollTop});for(typeof O.focus=="function"&&O.focus(),O=0;O<pe.length;O++){var fe=pe[O];fe.element.scrollLeft=fe.left,fe.element.scrollTop=fe.top}}Xr=!!vh,xh=vh=null}finally{st=m,ae.p=h,de.T=l}}e.current=n,At=2}}function oh(){if(At===2){At=0;var e=Xn,n=Ja,r=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||r){r=de.T,de.T=null;var l=ae.p;ae.p=2;var h=st;st|=4;try{Xy(e,n.alternate,n)}finally{st=h,ae.p=l,de.T=r}}At=3}}function lh(){if(At===4||At===3){At=0;var e=_r;_r=null,Je();var n=Xn,r=Ja,l=fi,h=cb,m=(l&335544064)===l?10262:10256;if((r.subtreeFlags&m)!==0||(r.flags&m)!==0?At=5:(At=0,Ja=Xn=null,Sb(n,n.pendingLanes)),m=n.pendingLanes,m===0&&(la=null),gc(l),r=r.stateNode,vn&&typeof vn.onCommitFiberRoot=="function")try{vn.onCommitFiberRoot(yo,r,void 0,(r.current.flags&128)===128)}catch{}if(h!==null){r=de.T,m=ae.p,ae.p=2,de.T=null;try{for(var k=n.onRecoverableError,O=0;O<h.length;O++){var F=h[O];k(F.value,{componentStack:F.stack})}}finally{de.T=r,ae.p=m}}if(h=Ir,k=Hr,Hr=null,h!==null&&(Ir=null,k===null&&(k=[]),e!==null))for(F=0;F<h.length;F++)r=(0,h[F])(k),r!==void 0&&e.finished.finally(r);(fi&3)!==0&&Xs(),mi(n),m=n.pendingLanes,(l&261930)!==0&&(m&42)!==0?n===$s?Qo++:(Qo=0,$s=n):(Qo=0,$s=null),Wo(0)}}function Sb(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,Oo(n)))}function Xs(){return _r!==null&&(_r.skipTransition(),_r=null),rh(),oh(),lh(),sh()}function sh(){if(At!==5)return!1;var e=Xn,n=th;th=0;var r=gc(fi),l=de.T,h=ae.p;try{ae.p=32>r?32:r,de.T=null,r=nh,nh=null;var m=Xn,k=fi;if(At=0,Ja=Xn=null,fi=0,(st&6)!==0)throw Error(o(331));var O=st;if(st|=4,lb(m.current),ab(m,m.current,k,r),st=O,Wo(0,!1),vn&&typeof vn.onPostCommitFiberRoot=="function")try{vn.onPostCommitFiberRoot(yo,m)}catch{}return!0}finally{ae.p=h,de.T=l,Sb(e,n)}}function kb(e,n,r){n=_n(r,n),n=Ad(e.stateNode,n,2),e=Wi(e,n,2),e!==null&&(vo(e,2),mi(e))}function mt(e,n,r){if(e.tag===3)kb(e,e,r);else for(;n!==null;){if(n.tag===3){kb(n,e,r);break}else if(n.tag===1){var l=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(la===null||!la.has(l))){e=_n(r,e),r=vy(2),l=Wi(n,r,2),l!==null&&(xy(r,l,n,e),vo(l,2),mi(l));break}}n=n.return}}function uh(e,n,r){var l=e.pingCache;if(l===null){l=e.pingCache=new Ak;var h=new Set;l.set(n,h)}else h=l.get(n),h===void 0&&(h=new Set,l.set(n,h));h.has(r)||(Wd=!0,h.add(r),e=Ok.bind(null,e,n,r),n.then(e,e))}function Ok(e,n,r){var l=e.pingCache;l!==null&&l.delete(n),e.pingedLanes|=e.suspendedLanes&r,e.warmLanes&=~r,vt===e&&(at&r)===r&&((Rt===4||Rt===3&&(at&62914560)===at&&300>ct()-Us)&&(st&2)===0?qr(e,0):Ps|=r,zr===at&&(zr=0)),mi(e)}function Tb(e,n){n===0&&(n=up()),e=ja(e,n),e!==null&&(vo(e,n),mi(e))}function Lk(e){var n=e.memoizedState,r=0;n!==null&&(r=n.retryLane),Tb(e,r)}function zk(e,n){var r=0;switch(e.tag){case 31:case 13:var l=e.stateNode,h=e.memoizedState;h!==null&&(r=h.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(o(314))}l!==null&&l.delete(n),Tb(e,r)}function _k(e,n){return ht(e,n)}var Ur=null,Fr=null,ch=!1,Zs=!1,dh=!1,ua=0;function mi(e){e!==Fr&&e.next===null&&(Fr===null?Ur=Fr=e:Fr=Fr.next=e),Zs=!0,ch||(ch=!0,Hk())}function Wo(e,n){if(!dh&&Zs){dh=!0;do for(var r=!1,l=Ur;l!==null;){if(e!==0){var h=l.pendingLanes;if(h===0)var m=0;else{var k=l.suspendedLanes,O=l.pingedLanes;m=(1<<31-xn(42|e)+1)-1,m&=h&~(k&~O),m=m&201326741?m&201326741|1:m?m|2:0}m!==0&&(r=!0,Rb(l,m))}else m=at,m=Pl(l,l===vt?m:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(m&3)===0||bo(l,m)||(r=!0,Rb(l,m));l=l.next}while(r);dh=!1}}function Ik(){Ab()}function Ab(){Zs=ch=!1;var e=0;ua!==0&&Xk()&&(e=ua);for(var n=ct(),r=null,l=Ur;l!==null;){var h=l.next,m=Eb(l,n);m===0?(l.next=null,r===null?Ur=h:r.next=h,h===null&&(Fr=r)):(r=l,(e!==0||(m&3)!==0)&&(Zs=!0)),l=h}At!==0&&At!==5||Wo(e),ua!==0&&(ua=0)}function Eb(e,n){for(var r=e.suspendedLanes,l=e.pingedLanes,h=e.expirationTimes,m=e.pendingLanes&-62914561;0<m;){var k=31-xn(m),O=1<<k,F=h[k];F===-1?((O&r)===0||(O&l)!==0)&&(h[k]=tS(O,n)):F<=n&&(e.expiredLanes|=O),m&=~O}if(n=vt,r=at,r=Pl(e,e===n?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,r===0||e===n&&(ft===2||ft===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Qe(l),e.callbackNode=null,e.callbackPriority=0;if((r&3)===0||bo(e,r)){if(n=r&-r,n===e.callbackPriority)return n;switch(l!==null&&Qe(l),gc(r)){case 2:case 8:r=On;break;case 32:r=Il;break;case 268435456:r=lp;break;default:r=Il}return l=Cb.bind(null,e),r=ht(r,l),e.callbackPriority=n,e.callbackNode=r,n}return l!==null&&l!==null&&Qe(l),e.callbackPriority=2,e.callbackNode=null,2}function Cb(e,n){if(At!==0&&At!==5)return e.callbackNode=null,e.callbackPriority=0,null;var r=e.callbackNode;if(Xs()&&e.callbackNode!==r)return null;var l=at;return l=Pl(e,e===vt?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(hb(e,l,n),Eb(e,ct()),e.callbackNode!=null&&e.callbackNode===r?Cb.bind(null,e):null)}function Rb(e,n){if(Xs())return null;hb(e,n,!0)}function Hk(){Kk(function(){(st&6)!==0?ht(jn,Ik):Ab()})}function hh(){if(ua===0){var e=Ha;e===0&&(e=Hl,Hl<<=1,(Hl&261888)===0&&(Hl=256)),ua=e}return ua}function Mb(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Gl(e)}function Bk(e,n,r,l,h){if(n==="submit"&&r&&r.stateNode===h){var m=Mb((h[un]||null).action),k=l.submitter;k&&(n=(n=k[un]||null)?Mb(n.formAction):k.getAttribute("formAction"),n!==null&&(m=n,k=null));var O=new Zl("action","action",null,l,h);e.push({event:O,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(ua!==0){var F=new FormData(h,k);xd(r,{pending:!0,data:F,method:h.method,action:m},null,F)}}else typeof m=="function"&&(O.preventDefault(),F=new FormData(h,k),xd(r,{pending:!0,data:F,method:h.method,action:m},m,F))},currentTarget:h}]})}}for(var fh=0;fh<Hc.length;fh++){var mh=Hc[fh],qk=mh.toLowerCase(),Pk=mh[0].toUpperCase()+mh.slice(1);$n(qk,"on"+Pk)}$n(tg,"onAnimationEnd"),$n(ng,"onAnimationIteration"),$n(ig,"onAnimationStart"),$n("dblclick","onDoubleClick"),$n("focusin","onFocus"),$n("focusout","onBlur"),$n(ZS,"onTransitionRun"),$n(KS,"onTransitionStart"),$n(QS,"onTransitionCancel"),$n(ag,"onTransitionEnd"),dr("onMouseEnter",["mouseout","mouseover"]),dr("onMouseLeave",["mouseout","mouseover"]),dr("onPointerEnter",["pointerout","pointerover"]),dr("onPointerLeave",["pointerout","pointerover"]),Ma("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ma("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ma("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ma("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ma("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ma("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var el="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Uk=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(el));function Nb(e,n){n=(n&4)!==0;for(var r=0;r<e.length;r++){var l=e[r],h=l.event;l=l.listeners;e:{var m=void 0;if(n)for(var k=l.length-1;0<=k;k--){var O=l[k],F=O.instance,ee=O.currentTarget;if(O=O.listener,F!==m&&h.isPropagationStopped())break e;m=O,h.currentTarget=ee;try{m(h)}catch(se){Wl(se)}h.currentTarget=null,m=F}else for(k=0;k<l.length;k++){if(O=l[k],F=O.instance,ee=O.currentTarget,O=O.listener,F!==m&&h.isPropagationStopped())break e;m=O,h.currentTarget=ee;try{m(h)}catch(se){Wl(se)}h.currentTarget=null,m=F}}}}function it(e,n){var r=n[pp];r===void 0&&(r=n[pp]=new Set);var l=e+"__bubble";r.has(l)||(Db(n,e,2,!1),r.add(l))}function ph(e,n,r){var l=0;n&&(l|=4),Db(r,e,l,n)}var Ks="_reactListening"+Math.random().toString(36).slice(2);function gh(e){if(!e[Ks]){e[Ks]=!0,bp.forEach(function(r){r!=="selectionchange"&&(Uk.has(r)||ph(r,!1,e),ph(r,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[Ks]||(n[Ks]=!0,ph("selectionchange",!1,n))}}function Db(e,n,r,l){switch(xv(n)){case 2:var h=LT;break;case 8:h=zT;break;default:h=_h}r=h.bind(null,n,r,e),h=void 0,!Tc||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(h=!0),l?h!==void 0?e.addEventListener(n,r,{capture:!0,passive:h}):e.addEventListener(n,r,!0):h!==void 0?e.addEventListener(n,r,{passive:h}):e.addEventListener(n,r,!1)}function yh(e,n,r,l,h){var m=l;if((n&1)===0&&(n&2)===0&&l!==null)e:for(;;){if(l===null)return;var k=l.tag;if(k===3||k===4){var O=l.stateNode.containerInfo;if(O===h)break;if(k===4)for(k=l.return;k!==null;){var F=k.tag;if((F===3||F===4)&&k.stateNode.containerInfo===h)return;k=k.return}for(;O!==null;){if(k=Ra(O),k===null)return;if(F=k.tag,F===5||F===6||F===26||F===27){l=m=k;continue e}O=O.parentNode}}l=l.return}Dp(function(){var ee=m,se=Sc(r),pe=[];e:{var K=rg.get(e);if(K!==void 0){var ie=Zl,Ee=e;switch(e){case"keypress":if(Jl(r)===0)break e;case"keydown":case"keyup":ie=ES;break;case"focusin":Ee="focus",ie=Rc;break;case"focusout":Ee="blur",ie=Rc;break;case"beforeblur":case"afterblur":ie=Rc;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ie=Lp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ie=mS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ie=DS;break;case tg:case ng:case ig:ie=yS;break;case ag:ie=OS;break;case"scroll":case"scrollend":ie=hS;break;case"wheel":ie=zS;break;case"copy":case"cut":case"paste":ie=vS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ie=_p;break;case"submit":ie=MS;break;case"toggle":case"beforetoggle":ie=IS}var _e=(n&4)!==0,Ke=!_e&&(e==="scroll"||e==="scrollend"),Q=_e?K!==null?K+"Capture":null:K;_e=[];for(var J=ee,ne;J!==null;){var fe=J;if(ne=fe.stateNode,fe=fe.tag,fe!==5&&fe!==26&&fe!==27||ne===null||Q===null||(fe=So(J,Q),fe!=null&&_e.push(tl(J,fe,ne))),Ke)break;J=J.return}0<_e.length&&(K=new ie(K,Ee,null,r,se),pe.push({event:K,listeners:_e}))}}if((n&7)===0){e:{if(ie=e==="mouseover"||e==="pointerover",K=e==="mouseout"||e==="pointerout",ie&&r!==wc&&(Ee=r.relatedTarget||r.fromElement)&&(Ra(Ee)||Ee[sr]))break e;(K||ie)&&(Ee=se.window===se?se:(ie=se.ownerDocument)?ie.defaultView||ie.parentWindow:window,K?(ie=r.relatedTarget||r.toElement,K=ee,ie=ie?Ra(ie):null,ie!==null&&(Ke=c(ie),_e=ie.tag,ie!==Ke||_e!==5&&_e!==27&&_e!==6)&&(ie=null)):(K=null,ie=ee),K!==ie&&(_e=Lp,fe="onMouseLeave",Q="onMouseEnter",J="mouse",(e==="pointerout"||e==="pointerover")&&(_e=_p,fe="onPointerLeave",Q="onPointerEnter",J="pointer"),Ke=K==null?Ee:wo(K),ne=ie==null?Ee:wo(ie),Ee=new _e(fe,J+"leave",K,r,se),Ee.target=Ke,Ee.relatedTarget=ne,fe=null,Ra(se)===ee&&(_e=new _e(Q,J+"enter",ie,r,se),_e.target=ne,_e.relatedTarget=Ke,fe=_e),Ke=fe,_e=K&&ie?N(K,ie,Fk):null,K!==null&&jb(pe,Ee,K,_e,!1),ie!==null&&Ke!==null&&jb(pe,Ke,ie,_e,!0)))}e:{if(K=ee?wo(ee):window,ie=K.nodeName&&K.nodeName.toLowerCase(),ie==="select"||ie==="input"&&K.type==="file")var Le=Vp;else if(Up(K))if($p)Le=YS;else{Le=$S;var rt=VS}else ie=K.nodeName,!ie||ie.toLowerCase()!=="input"||K.type!=="checkbox"&&K.type!=="radio"?ee&&xc(ee.elementType)&&(Le=Vp):Le=GS;if(Le&&(Le=Le(e,ee))){Fp(pe,Le,r,se);break e}rt&&rt(e,K,ee)}switch(rt=ee?wo(ee):window,e){case"focusin":(Up(rt)||rt.contentEditable==="true")&&(yr=rt,zc=ee,No=null);break;case"focusout":No=zc=yr=null;break;case"mousedown":_c=!0;break;case"contextmenu":case"mouseup":case"dragend":_c=!1,Wp(pe,r,se);break;case"selectionchange":if(XS)break;case"keydown":case"keyup":Wp(pe,r,se)}var He;if(Nc)e:{switch(e){case"compositionstart":var Pe="onCompositionStart";break e;case"compositionend":Pe="onCompositionEnd";break e;case"compositionupdate":Pe="onCompositionUpdate";break e}Pe=void 0}else gr?qp(e,r)&&(Pe="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(Pe="onCompositionStart");Pe&&(Ip&&r.locale!=="ko"&&(gr||Pe!=="onCompositionStart"?Pe==="onCompositionEnd"&&gr&&(He=jp()):(Vi=se,Ac="value"in Vi?Vi.value:Vi.textContent,gr=!0)),rt=Qs(ee,Pe),0<rt.length&&(Pe=new zp(Pe,e,null,r,se),pe.push({event:Pe,listeners:rt}),He?Pe.data=He:(He=Pp(r),He!==null&&(Pe.data=He)))),(He=BS?qS(e,r):PS(e,r))&&(Pe=Qs(ee,"onBeforeInput"),0<Pe.length&&(rt=new zp("onBeforeInput","beforeinput",null,r,se),pe.push({event:rt,listeners:Pe}),rt.data=He)),Bk(pe,e,ee,r,se)}Nb(pe,n)})}function tl(e,n,r){return{instance:e,listener:n,currentTarget:r}}function Qs(e,n){for(var r=n+"Capture",l=[];e!==null;){var h=e,m=h.stateNode;if(h=h.tag,h!==5&&h!==26&&h!==27||m===null||(h=So(e,r),h!=null&&l.unshift(tl(e,h,m)),h=So(e,n),h!=null&&l.push(tl(e,h,m))),e.tag===3)return l;e=e.return}return[]}function Fk(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function jb(e,n,r,l,h){for(var m=n._reactName,k=[];r!==null&&r!==l;){var O=r,F=O.alternate,ee=O.stateNode;if(O=O.tag,F!==null&&F===l)break;O!==5&&O!==26&&O!==27||ee===null||(F=ee,h?(ee=So(r,m),ee!=null&&k.unshift(tl(r,ee,F))):h||(ee=So(r,m),ee!=null&&k.push(tl(r,ee,F)))),r=r.return}k.length!==0&&e.push({event:n,listeners:k})}var Vk=/\r\n?/g,$k=/\u0000|\uFFFD/g;function Ob(e){return(typeof e=="string"?e:""+e).replace(Vk,`
`).replace($k,"")}function Lb(e,n){return n=Ob(n),Ob(e)===n}function pt(e,n,r,l,h,m){switch(r){case"children":if(typeof l=="string")n==="body"||n==="textarea"&&l===""||fr(e,l);else if(typeof l=="number"||typeof l=="bigint")n!=="body"&&fr(e,""+l);else return;break;case"className":$l(e,"class",l);break;case"tabIndex":$l(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":$l(e,r,l);break;case"style":Mp(e,l,m);return;case"data":if(n!=="object"){$l(e,"data",l);break}case"src":case"href":if(l===""&&(n!=="a"||r!=="href")){e.removeAttribute(r);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(r);break}l=Gl(l),e.setAttribute(r,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(r,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof m=="function"&&(r==="formAction"?(n!=="input"&&pt(e,n,"name",h.name,h,null),pt(e,n,"formEncType",h.formEncType,h,null),pt(e,n,"formMethod",h.formMethod,h,null),pt(e,n,"formTarget",h.formTarget,h,null)):(pt(e,n,"encType",h.encType,h,null),pt(e,n,"method",h.method,h,null),pt(e,n,"target",h.target,h,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(r);break}l=Gl(l),e.setAttribute(r,l);break;case"onClick":l!=null&&(e.onclick=ai);return;case"onScroll":l!=null&&it("scroll",e);return;case"onScrollEnd":l!=null&&it("scrollend",e);return;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(r=l.__html,r!=null){if(h.children!=null)throw Error(o(60));m?.__html!==r&&(e.innerHTML=r)}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}r=Gl(l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",r);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(r,l):e.removeAttribute(r);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(r,""):e.removeAttribute(r);break;case"capture":case"download":l===!0?e.setAttribute(r,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(r,l):e.removeAttribute(r);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(r,l):e.removeAttribute(r);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(r):e.setAttribute(r,l);break;case"popover":it("beforetoggle",e),it("toggle",e),Vl(e,"popover",l);break;case"xlinkActuate":wi(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":wi(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":wi(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":wi(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":wi(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":wi(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":wi(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":wi(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":wi(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Vl(e,"is",l);break;case"innerText":case"textContent":return;default:if(!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")r=cS.get(r)||r,Vl(e,r,l);else return}lt=!0}function bh(e,n,r,l,h,m){switch(r){case"style":Mp(e,l,m);return;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(r=l.__html,r!=null){if(h.children!=null)throw Error(o(60));m?.__html!==r&&(e.innerHTML=r)}}break;case"children":if(typeof l=="string")fr(e,l);else if(typeof l=="number"||typeof l=="bigint")fr(e,""+l);else return;break;case"onScroll":l!=null&&it("scroll",e);return;case"onScrollEnd":l!=null&&it("scrollend",e);return;case"onClick":l!=null&&(e.onclick=ai);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!vp.hasOwnProperty(r))e:{if(r[0]==="o"&&r[1]==="n"&&(h=r.endsWith("Capture"),m=r.slice(2,h?r.length-7:void 0),n=e[un]||null,n=n!=null?n[r]:null,typeof n=="function"&&e.removeEventListener(m,n,h),typeof l=="function")){typeof n!="function"&&n!==null&&(r in e?e[r]=null:e.hasAttribute(r)&&e.removeAttribute(r)),e.addEventListener(m,l,h);break e}lt=!0,r in e?e[r]=l:l===!0?e.setAttribute(r,""):Vl(e,r,l)}return}lt=!0}function Xt(e,n,r){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":it("error",e),it("load",e);var l=!1,h=!1,m;for(m in r)if(r.hasOwnProperty(m)){var k=r[m];if(k!=null)switch(m){case"src":l=!0;break;case"srcSet":h=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:pt(e,n,m,k,r,null)}}h&&pt(e,n,"srcSet",r.srcSet,r,null),l&&pt(e,n,"src",r.src,r,null);return;case"input":it("invalid",e);var O=m=k=h=null,F=null,ee=null;for(l in r)if(r.hasOwnProperty(l)){var se=r[l];if(se!=null)switch(l){case"name":h=se;break;case"type":k=se;break;case"checked":F=se;break;case"defaultChecked":ee=se;break;case"value":m=se;break;case"defaultValue":O=se;break;case"children":case"dangerouslySetInnerHTML":if(se!=null)throw Error(o(137,n));break;default:pt(e,n,l,se,r,null)}}Ap(e,m,O,F,ee,k,h,!1);return;case"select":it("invalid",e),l=k=m=null;for(h in r)if(r.hasOwnProperty(h)&&(O=r[h],O!=null))switch(h){case"value":m=O;break;case"defaultValue":k=O;break;case"multiple":l=O;default:pt(e,n,h,O,r,null)}n=m,r=k,e.multiple=!!l,n!=null?hr(e,!!l,n,!1):r!=null&&hr(e,!!l,r,!0);return;case"textarea":it("invalid",e),m=h=l=null;for(k in r)if(r.hasOwnProperty(k)&&(O=r[k],O!=null))switch(k){case"value":l=O;break;case"defaultValue":h=O;break;case"children":m=O;break;case"dangerouslySetInnerHTML":if(O!=null)throw Error(o(91));break;default:pt(e,n,k,O,r,null)}Cp(e,l,h,m);return;case"option":for(F in r)r.hasOwnProperty(F)&&(l=r[F],l!=null)&&(F==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":pt(e,n,F,l,r,null));return;case"dialog":it("beforetoggle",e),it("toggle",e),it("cancel",e),it("close",e);break;case"iframe":case"object":it("load",e);break;case"video":case"audio":for(l=0;l<el.length;l++)it(el[l],e);break;case"image":it("error",e),it("load",e);break;case"details":it("toggle",e);break;case"embed":case"source":case"link":it("error",e),it("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(ee in r)if(r.hasOwnProperty(ee)&&(l=r[ee],l!=null))switch(ee){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:pt(e,n,ee,l,r,null)}return;default:if(xc(n)){for(se in r)r.hasOwnProperty(se)&&(l=r[se],l!==void 0&&bh(e,n,se,l,r,void 0));return}}for(O in r)r.hasOwnProperty(O)&&(l=r[O],l!=null&&pt(e,n,O,l,r,null))}var Gk={};function Yk(e,n,r,l){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var h=null,m=null,k=null,O=null,F=null,ee=null,se=null;for(ie in r){var pe=r[ie];if(r.hasOwnProperty(ie)&&pe!=null)switch(ie){case"checked":break;case"value":break;case"defaultValue":F=pe;default:l.hasOwnProperty(ie)||pt(e,n,ie,null,l,pe)}}for(var K in l){var ie=l[K];if(pe=r[K],l.hasOwnProperty(K)&&(ie!=null||pe!=null))switch(K){case"type":ie!==pe&&(lt=!0),m=ie;break;case"name":ie!==pe&&(lt=!0),h=ie;break;case"checked":ie!==pe&&(lt=!0),ee=ie;break;case"defaultChecked":ie!==pe&&(lt=!0),se=ie;break;case"value":ie!==pe&&(lt=!0),k=ie;break;case"defaultValue":ie!==pe&&(lt=!0),O=ie;break;case"children":case"dangerouslySetInnerHTML":if(ie!=null)throw Error(o(137,n));break;default:ie!==pe&&pt(e,n,K,ie,l,pe)}}bc(e,k,O,F,ee,se,m,h);return;case"select":ie=k=O=K=null;for(m in r)if(F=r[m],r.hasOwnProperty(m)&&F!=null)switch(m){case"value":break;case"multiple":ie=F;default:l.hasOwnProperty(m)||pt(e,n,m,null,l,F)}for(h in l)if(m=l[h],F=r[h],l.hasOwnProperty(h)&&(m!=null||F!=null))switch(h){case"value":m!==F&&(lt=!0),K=m;break;case"defaultValue":m!==F&&(lt=!0),O=m;break;case"multiple":m!==F&&(lt=!0),k=m;default:m!==F&&pt(e,n,h,m,l,F)}n=O,r=k,l=ie,K!=null?hr(e,!!r,K,!1):!!l!=!!r&&(n!=null?hr(e,!!r,n,!0):hr(e,!!r,r?[]:"",!1));return;case"textarea":ie=K=null;for(O in r)if(h=r[O],r.hasOwnProperty(O)&&h!=null&&!l.hasOwnProperty(O))switch(O){case"value":break;case"children":break;default:pt(e,n,O,null,l,h)}for(k in l)if(h=l[k],m=r[k],l.hasOwnProperty(k)&&(h!=null||m!=null))switch(k){case"value":h!==m&&(lt=!0),K=h;break;case"defaultValue":h!==m&&(lt=!0),ie=h;break;case"children":break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(o(91));break;default:h!==m&&pt(e,n,k,h,l,m)}Ep(e,K,ie);return;case"option":for(var Ee in r)K=r[Ee],r.hasOwnProperty(Ee)&&K!=null&&!l.hasOwnProperty(Ee)&&(Ee==="selected"?e.selected=!1:pt(e,n,Ee,null,l,K));for(F in l)K=l[F],ie=r[F],l.hasOwnProperty(F)&&K!==ie&&(K!=null||ie!=null)&&(F==="selected"?(K!==ie&&(lt=!0),e.selected=K&&typeof K!="function"&&typeof K!="symbol"):pt(e,n,F,K,l,ie));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var _e in r)K=r[_e],r.hasOwnProperty(_e)&&K!=null&&!l.hasOwnProperty(_e)&&pt(e,n,_e,null,l,K);for(ee in l)if(K=l[ee],ie=r[ee],l.hasOwnProperty(ee)&&K!==ie&&(K!=null||ie!=null))switch(ee){case"children":case"dangerouslySetInnerHTML":if(K!=null)throw Error(o(137,n));break;default:pt(e,n,ee,K,l,ie)}return;default:if(xc(n)){for(var Ke in r)K=r[Ke],r.hasOwnProperty(Ke)&&K!==void 0&&!l.hasOwnProperty(Ke)&&bh(e,n,Ke,void 0,l,K);for(se in l)K=l[se],ie=r[se],!l.hasOwnProperty(se)||K===ie||K===void 0&&ie===void 0||bh(e,n,se,K,l,ie);return}}for(var Q in r)K=r[Q],r.hasOwnProperty(Q)&&K!=null&&!l.hasOwnProperty(Q)&&pt(e,n,Q,null,l,K);for(pe in l)K=l[pe],ie=r[pe],!l.hasOwnProperty(pe)||K===ie||K==null&&ie==null||pt(e,n,pe,K,l,ie)}function zb(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Jk(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,r=performance.getEntriesByType("resource"),l=0;l<r.length;l++){var h=r[l],m=h.transferSize,k=h.initiatorType,O=h.duration;if(m&&O&&zb(k)){for(k=0,O=h.responseEnd,l+=1;l<r.length;l++){var F=r[l],ee=F.startTime;if(ee>O)break;var se=F.transferSize,pe=F.initiatorType;se&&zb(pe)&&(F=F.responseEnd,k+=se*(F<O?1:(O-ee)/(F-ee)))}if(--l,n+=8*(m+k)/(h.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var vh=null,xh=null;function nl(e){return e.nodeType===9?e:e.ownerDocument}function _b(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Ib(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function Hb(e,n,r,l){return r=nl(r).createElement(e),r[Vt]=l,r[un]=n,Xt(r,e,n),qt(r),r}function wh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Sh=null;function Xk(){var e=window.event;return e&&e.type==="popstate"?e===Sh?!1:(Sh=e,!0):(Sh=null,!1)}var kh=typeof setTimeout=="function"?setTimeout:void 0,Zk=typeof clearTimeout=="function"?clearTimeout:void 0,Bb=typeof Promise=="function"?Promise:void 0,qb=typeof requestAnimationFrame=="function"?requestAnimationFrame:kh,Kk=typeof queueMicrotask=="function"?queueMicrotask:typeof Bb<"u"?function(e){return Bb.resolve(null).then(e).catch(Qk)}:kh;function Qk(e){setTimeout(function(){throw e})}function ca(e){return e==="head"}function Pb(e,n){var r=n,l=0;do{var h=r.nextSibling;if(e.removeChild(r),h&&h.nodeType===8)if(r=h.data,r==="/$"||r==="/&"){if(l===0){e.removeChild(h),Zr(n);return}l--}else if(r==="$"||r==="$?"||r==="$~"||r==="$!"||r==="&")l++;else if(r==="html")Dh(e.ownerDocument.documentElement);else if(r==="head"){r=e.ownerDocument.head,Dh(r);for(var m=r.firstChild;m;){var k=m.nextSibling,O=m.nodeName;m[xo]||O==="SCRIPT"||O==="STYLE"||O==="LINK"&&m.rel.toLowerCase()==="stylesheet"||r.removeChild(m),m=k}}else r==="body"&&Dh(e.ownerDocument.body);r=h}while(r);Zr(n)}function Ub(e,n){var r=e;e=0;do{var l=r.nextSibling;if(r.nodeType===1?n?(r._stashedDisplay=r.style.display,r.style.display="none"):(r.style.display=r._stashedDisplay||"",r.getAttribute("style")===""&&r.removeAttribute("style")):r.nodeType===3&&(n?(r._stashedText=r.nodeValue,r.nodeValue=""):r.nodeValue=r._stashedText||""),l&&l.nodeType===8)if(r=l.data,r==="/$"){if(e===0)break;e--}else r!=="$"&&r!=="$?"&&r!=="$~"&&r!=="$!"||e++;r=l}while(r)}function Fb(e,n,r){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,r!=null&&(e.style.viewTransitionClass=r),r=getComputedStyle(e),r.display==="inline"){if(n=e.getClientRects(),n.length===1)var l=1;else for(var h=l=0;h<n.length;h++){var m=n[h];0<m.width&&0<m.height&&l++}l===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+r.paddingTop,e.marginBottom="-"+r.paddingBottom)}}function Vb(e,n){e=e.style,n=n.style;var r=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=r==null||typeof r=="boolean"?"":(""+r).trim(),r=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=r==null||typeof r=="boolean"?"":(""+r).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(r=n.display,e.display=r==null||typeof r=="boolean"?"":r,r=n.margin,r!=null?e.margin=r:(r=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=r==null||typeof r=="boolean"?"":r,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function Wk(e,n,r){return r=r.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=r.innerHeight&&e.left<=r.innerWidth}}function Th(e){var n=e.getBoundingClientRect(),r=getComputedStyle(e);return Wk(n,r,e)}function eT(e){return e.documentElement.clientHeight}function tT(e){this.addEventListener("load",e),this.addEventListener("error",e)}function nT(e,n,r,l,h,m,k,O,F){var ee=n.nodeType===9?n:n.ownerDocument;try{var se=ee.startViewTransition({update:function(){var K=ee.defaultView,ie=K.navigation&&K.navigation.transition,Ee=ee.fonts.status;l();var _e=[];if(Ee==="loaded"&&(eT(ee),ee.fonts.status==="loading"&&_e.push(ee.fonts.ready)),Ee=_e.length,e!==null)for(var Ke=e.suspenseyImages,Q=0,J=0;J<Ke.length;J++){var ne=Ke[J];if(!ne.complete){var fe=ne.getBoundingClientRect();if(0<fe.bottom&&0<fe.right&&fe.top<K.innerHeight&&fe.left<K.innerWidth){if(Q+=dv(ne),Q>tu){_e.length=Ee;break}ne=new Promise(tT.bind(ne)),_e.push(ne)}}}if(0<_e.length)return K=Promise.race([Promise.all(_e),new Promise(function(Le){return setTimeout(Le,500)})]).then(h,h),(ie?Promise.allSettled([ie.finished,K]):K).then(m,m);if(h(),ie)return ie.finished.then(m,m);m()},types:r});ee.__reactViewTransition=se;var pe=[];return se.ready.then(function(){for(var K=ee.documentElement.getAnimations({subtree:!0}),ie=0;ie<K.length;ie++){var Ee=K[ie],_e=Ee.effect,Ke=_e.pseudoElement;if(Ke!=null&&Ke.startsWith("::view-transition")){pe.push(Ee),Ee=_e.getKeyframes();for(var Q=Ke=void 0,J=!0,ne=0;ne<Ee.length;ne++){var fe=Ee[ne],Le=fe.width;if(Ke===void 0)Ke=Le;else if(Ke!==Le){J=!1;break}if(Le=fe.height,Q===void 0)Q=Le;else if(Q!==Le){J=!1;break}delete fe.width,delete fe.height,fe.transform==="none"&&delete fe.transform}J&&Ke!==void 0&&Q!==void 0&&(_e.setKeyframes(Ee),J=getComputedStyle(_e.target,_e.pseudoElement),J.width!==Ke||J.height!==Q)&&(J=Ee[0],J.width=Ke,J.height=Q,J=Ee[Ee.length-1],J.width=Ke,J.height=Q,_e.setKeyframes(Ee))}}k()},function(K){ee.__reactViewTransition===se&&(ee.__reactViewTransition=null);try{typeof K=="object"&&K!==null&&K.name==="InvalidStateError"&&(K.message==="View transition was skipped because document visibility state is hidden."||K.message==="Skipping view transition because document visibility state has become hidden."||K.message==="Skipping view transition because viewport size changed."||K.message==="Transition was aborted because of invalid state")&&(K=null),K!==null&&F(K)}finally{l(),h(),k()}}),se.finished.finally(function(){for(var K=0;K<pe.length;K++)pe[K].cancel();ee.__reactViewTransition===se&&(ee.__reactViewTransition=null),O()}),se}catch{return l(),h(),k(),null}}function Xa(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}Xa.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:j({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},Xa.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,r=e.getAnimations({subtree:!0}),l=[],h=0;h<r.length;h++){var m=r[h].effect;m!==null&&m.target===e&&m.pseudoElement===n&&l.push(r[h])}return l},Xa.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function $b(e){return{name:e,group:new Xa("group",e),imagePair:new Xa("image-pair",e),old:new Xa("old",e),new:new Xa("new",e)}}function Rn(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Rn.prototype.addEventListener=function(e,n,r){var l=null,h=null;if(!(r!=null&&typeof r!="boolean"&&(l=r.signal||null,l!==null&&l.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var m=this._eventListeners;if(Yb(m,e,n,r)===-1){var k=this,O=n;r!=null&&typeof r!="boolean"&&r.once===!0&&(O=function(F){k.removeEventListener(e,n,r),typeof n=="function"?n.call(this,F):n.handleEvent(F)}),l!==null&&(h=k.removeEventListener.bind(k,e,n,r),l.addEventListener("abort",h,{once:!0}),h=l.removeEventListener.bind(l,"abort",h)),l=Vr(r),m.push({type:e,listener:n,optionsOrUseCapture:r,attachedListener:O,cleanup:h}),g(this._fragmentFiber.child,!1,iT,e,O,l)}this._eventListeners=m}};function iT(e,n,r,l){return T(e).addEventListener(n,r,l),!1}Rn.prototype.removeEventListener=function(e,n,r){var l=this._eventListeners;if(l!==null&&(n=Yb(l,e,n,r),n!==-1)){var h=l[n];r=h.attachedListener;var m=h.cleanup;h=Vr(h.optionsOrUseCapture),g(this._fragmentFiber.child,!1,aT,e,r,h),l.splice(n,1),m!==null&&m()}};function aT(e,n,r,l){return T(e).removeEventListener(n,r,l),!1}function Vr(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function Gb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function Yb(e,n,r,l){if(e.length===0)return-1;l=Gb(l);for(var h=0;h<e.length;h++){var m=e[h];if(m.type===n&&m.listener===r&&Gb(m.optionsOrUseCapture)===l)return h}return-1}Rn.prototype.dispatchEvent=function(e){var n=x(this._fragmentFiber);if(n===null)return!0;n=T(n);var r=this._eventListeners;if(r!==null&&0<r.length||!e.bubbles){var l=n.nodeType===9?n.createComment(""):document.createTextNode("");if(r)for(var h=0;h<r.length;h++){var m=r[h];l.addEventListener(m.type,m.attachedListener,Vr(m.optionsOrUseCapture))}if(n.appendChild(l),e=l.dispatchEvent(e),r)for(h=0;h<r.length;h++)m=r[h],l.removeEventListener(m.type,m.attachedListener,Vr(m.optionsOrUseCapture));return n.removeChild(l),e}return n.dispatchEvent(e)},Rn.prototype.focus=function(e){g(this._fragmentFiber.child,!0,Jb,e,void 0,void 0)};function Jb(e,n){return e.tag===6?!1:(e=T(e),gT(e,n))}Rn.prototype.focusLast=function(e){var n=[];g(this._fragmentFiber.child,!0,Ah,n,void 0,void 0);for(var r=n.length-1;0<=r&&!Jb(n[r],e);r--);};function Ah(e,n){return n.push(e),!1}Rn.prototype.blur=function(){var e=x(this._fragmentFiber);e!==null&&(e=T(e),e=nl(e).activeElement,e!==null&&g(this._fragmentFiber.child,!1,rT,e,void 0,void 0))};function rT(e,n){return e.tag===6?!1:(e=T(e),e===n||e.contains(n)?(n.blur(),!0):!1)}Rn.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),g(this._fragmentFiber.child,!1,oT,e,void 0,void 0)};function oT(e,n){return e.tag===6||(e=T(e),n.observe(e)),!1}Rn.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),g(this._fragmentFiber.child,!1,lT,e,void 0,void 0);for(var r=n=0;r<Zn.length;r++){var l=Zn[r];l.fragmentInstance===this&&l.observer===e?e.unobserve(l.instance):Zn[n++]=l}Zn.length=n}};function lT(e,n){return e.tag===6||(e=T(e),n.unobserve(e)),!1}var Zn=[],Eh=!1;function sT(e,n,r){Zn.push({fragmentInstance:e,observer:n,instance:r}),Eh||(Eh=!0,yT(function(){Eh=!1;var l=Zn;Zn=[];for(var h=0;h<l.length;h++){var m=l[h];m.observer.unobserve(m.instance)}}))}Rn.prototype.getClientRects=function(){var e=[];return g(this._fragmentFiber.child,!1,uT,e,void 0,void 0),e};function uT(e,n){if(e.tag===6){e=e.stateNode;var r=e.ownerDocument.createRange();r.selectNodeContents(e),n.push.apply(n,r.getClientRects())}else e=T(e),n.push.apply(n,e.getClientRects());return!1}Rn.prototype.getRootNode=function(e){var n=x(this._fragmentFiber);return n===null?this:T(n).getRootNode(e)},Rn.prototype.compareDocumentPosition=function(e){var n=x(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var r=[];g(this._fragmentFiber.child,!1,Ah,r,void 0,void 0);var l=T(n);if(r.length===0){if(r=l,v(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(r=n)}n=this._fragmentFiber;var h=l=r.compareDocumentPosition(e);return r===e?h=Node.DOCUMENT_POSITION_CONTAINS:l&Node.DOCUMENT_POSITION_CONTAINED_BY&&(r=w(n)[1],r===null?h=Node.DOCUMENT_POSITION_PRECEDING:(e=T(r).compareDocumentPosition(e),h=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),h|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=T(r[0]),h=T(r[r.length-1]);var m=v(this._fragmentFiber)?n.parentElement:l;if(m==null)return Node.DOCUMENT_POSITION_DISCONNECTED;l=m.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,m=m.compareDocumentPosition(h)&Node.DOCUMENT_POSITION_CONTAINED_BY;var k=n.compareDocumentPosition(e),O=h.compareDocumentPosition(e),F=k&Node.DOCUMENT_POSITION_CONTAINED_BY||O&Node.DOCUMENT_POSITION_CONTAINED_BY;return O=l&&m&&k&Node.DOCUMENT_POSITION_FOLLOWING&&O&Node.DOCUMENT_POSITION_PRECEDING,n=l&&n===e||m&&h===e||F||O?Node.DOCUMENT_POSITION_CONTAINED_BY:!l&&n===e||!m&&h===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:k,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||cT(n,this._fragmentFiber,r[0],r[r.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function cT(e,n,r,l,h){var m=Ra(h);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(r=!!m)e:{for(;m!==null;){if(m.tag===7&&(m===n||m.alternate===n)){r=!0;break e}m=m.return}r=!1}return r}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(m===null)return m=h.ownerDocument,h===m||h===m.documentElement||h===m.body;e:{for(m=n,n=x(n);m!==null;){if(!(m.tag!==5&&m.tag!==3&&m.tag!==27||m!==n&&m.alternate!==n)){m=!0;break e}m=m.return}m=!1}return m}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!m)&&!(n=m===r)&&(n=N(r,m,_),n===null?n=!1:(g(n,!0,C,m,r),m=S,S=null,n=m!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!m)&&!(n=m===l)&&(n=N(l,m,_),n===null?n=!1:(g(n,!0,R,m,l),m=S,E=S=null,n=m!==null)),n):!1}function Xb(e,n){var r=e.ownerDocument.createRange();r.selectNodeContents(e),e=r.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Rn.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(o(566));var n=[];g(this._fragmentFiber.child,!1,Ah,n,void 0,void 0);var r=e!==!1;if(n.length===0){var l=w(this._fragmentFiber);if(l=r?l[1]||l[0]||x(this._fragmentFiber):l[0]||l[1],l===null)return;if(l.tag===6){e=T(l),Xb(e,r);return}if(l=T(l),l.nodeType!==9){if(l.nodeType===11){r="host"in l?l.host:null,r!==null&&r.scrollIntoView(e);return}l.scrollIntoView(e)}}for(l=r?n.length-1:0;l!==(r?-1:n.length);){var h=n[l];h.tag===6?(h=T(h),Xb(h,r)):T(h).scrollIntoView(e),l+=r?-1:1}};function dT(e,n){return e=T(e),Zb(e,n),!1}function Zb(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function Kb(e,n){var r=n._eventListeners;if(r!==null)for(var l=0;l<r.length;l++){var h=r[l];e.addEventListener(h.type,h.attachedListener,Vr(h.optionsOrUseCapture))}e.nodeType!==3&&(r=n._observers,r!==null&&r.forEach(function(m){for(var k=0,O=0;O<Zn.length;O++){var F=Zn[O];(F.fragmentInstance!==n||F.observer!==m||F.instance!==e)&&(Zn[k++]=F)}Zn.length=k,m.observe(e)}),Zb(e,n))}function hT(e,n){var r=n._eventListeners;if(r!==null)for(var l=0;l<r.length;l++){var h=r[l];e.removeEventListener(h.type,h.attachedListener,Vr(h.optionsOrUseCapture))}e.nodeType!==3&&(r=n._observers,r!==null&&r.forEach(function(m){typeof m.rootMargin=="string"?sT(n,m,e):m.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function Ch(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var r=n;switch(n=n.nextSibling,r.nodeName){case"HTML":case"HEAD":case"BODY":Ch(r),Fl(r);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(r.rel.toLowerCase()==="stylesheet")continue}e.removeChild(r)}}function fT(e,n,r,l){for(;e.nodeType===1;){var h=r;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[xo])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(m=e.getAttribute("rel"),m==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(m!==h.rel||e.getAttribute("href")!==(h.href==null||h.href===""?null:h.href)||e.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin)||e.getAttribute("title")!==(h.title==null?null:h.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(m=e.getAttribute("src"),(m!==(h.src==null?null:h.src)||e.getAttribute("type")!==(h.type==null?null:h.type)||e.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin))&&m&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var m=h.name==null?null:""+h.name;if(h.type==="hidden"&&e.getAttribute("name")===m)return e}else return e;if(e=Pn(e.nextSibling),e===null)break}return null}function mT(e,n,r){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!r||(e=Pn(e.nextSibling),e===null))return null;return e}function Qb(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Pn(e.nextSibling),e===null))return null;return e}function Rh(e){return e.data==="$?"||e.data==="$~"}function Mh(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function pT(e,n){var r=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||r.readyState!=="loading")n();else{var l=function(){n(),r.removeEventListener("DOMContentLoaded",l)};r.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Pn(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var Nh=null;function Wb(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"||r==="/&"){if(n===0)return Pn(e.nextSibling);n--}else r!=="$"&&r!=="$!"&&r!=="$?"&&r!=="$~"&&r!=="&"||n++}e=e.nextSibling}return null}function ev(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"||r==="$~"||r==="&"){if(n===0)return e;n--}else r!=="/$"&&r!=="/&"||n++}e=e.previousSibling}return null}function gT(e,n){function r(){l=!0}if(e.ownerDocument.activeElement===e)return!0;var l=!1;try{e.ownerDocument.addEventListener("focus",r,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",r,!0)}return l}function yT(e){qb(function(){qb(function(n){return e(n)})})}function tv(e,n,r){switch(n=nl(r),e){case"html":if(e=n.documentElement,!e)throw Error(o(452));return e;case"head":if(e=n.head,!e)throw Error(o(453));return e;case"body":if(e=n.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function nv(e,n,r){for(var l in r){var h=r[l];r.hasOwnProperty(l)&&h!=null&&pt(e,n,l,null,Gk,h)}r.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===ai&&(e.onclick=null),Fl(e)}function Dh(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);Fl(e)}var Un=new Map,iv=new Set;function il(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var Li=ae.d;ae.d={f:bT,r:vT,D:xT,C:wT,L:ST,m:kT,X:AT,S:TT,M:ET};function bT(){var e=Li.f(),n=Gs();return e||n}function vT(e){var n=ur(e);n!==null&&n.tag===5&&n.type==="form"?ry(n):Li.r(e)}var $r=typeof document>"u"?null:document;function av(e,n,r){var l=$r;if(l&&typeof n=="string"&&n){var h=Ln(n);h='link[rel="'+e+'"][href="'+h+'"]',typeof r=="string"&&(h+='[crossorigin="'+r+'"]'),iv.has(h)||(iv.add(h),e={rel:e,crossOrigin:r,href:n},l.querySelector(h)===null&&(n=l.createElement("link"),Xt(n,"link",e),qt(n),l.head.appendChild(n)))}}function xT(e){Li.D(e),av("dns-prefetch",e,null)}function wT(e,n){Li.C(e,n),av("preconnect",e,n)}function ST(e,n,r){Li.L(e,n,r);var l=$r;if(l&&e&&n){var h='link[rel="preload"][as="'+Ln(n)+'"]';n==="image"&&r&&r.imageSrcSet?(h+='[imagesrcset="'+Ln(r.imageSrcSet)+'"]',typeof r.imageSizes=="string"&&(h+='[imagesizes="'+Ln(r.imageSizes)+'"]')):h+='[href="'+Ln(e)+'"]';var m=h;switch(n){case"style":m=Gr(e);break;case"script":m=Yr(e)}if(!(Un.has(m)||(e=j({rel:"preload",href:n==="image"&&r&&r.imageSrcSet?void 0:e,as:n},r),Un.set(m,e),l.querySelector(h)!==null||n==="style"&&l.querySelector(al(m))||n==="script"&&l.querySelector(rl(m))))){var k=l.createElement("link");Xt(k,"link",e),n==="style"&&(k[Ul]=!0,k.onload=k.onerror=function(){yp(k)}),qt(k),l.head.appendChild(k)}}}function kT(e,n){Li.m(e,n);var r=$r;if(r&&e){var l=n&&typeof n.as=="string"?n.as:"script",h='link[rel="modulepreload"][as="'+Ln(l)+'"][href="'+Ln(e)+'"]',m=h;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":m=Yr(e)}if(!Un.has(m)&&(e=j({rel:"modulepreload",href:e},n),Un.set(m,e),r.querySelector(h)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(r.querySelector(rl(m)))return}l=r.createElement("link"),Xt(l,"link",e),qt(l),r.head.appendChild(l)}}}function TT(e,n,r){Li.S(e,n,r);var l=$r;if(l&&e){var h=cr(l).hoistableStyles,m=Gr(e);n=n||"default";var k=h.get(m);if(!k){var O={loading:0,preload:null};if(k=l.querySelector(al(m)))O.loading=5;else{e=j({rel:"stylesheet",href:e,"data-precedence":n},r),(r=Un.get(m))&&jh(e,r);var F=k=l.createElement("link");qt(F),Xt(F,"link",e),F._p=new Promise(function(ee,se){F.onload=ee,F.onerror=se}),F.addEventListener("load",function(){O.loading|=1}),F.addEventListener("error",function(){O.loading|=2}),O.loading|=4,Ws(k,n,l)}k={type:"stylesheet",instance:k,count:1,state:O},h.set(m,k)}}}function AT(e,n){Li.X(e,n);var r=$r;if(r&&e){var l=cr(r).hoistableScripts,h=Yr(e),m=l.get(h);m||(m=r.querySelector(rl(h)),m||(e=j({src:e,async:!0},n),(n=Un.get(h))&&Oh(e,n),m=r.createElement("script"),qt(m),Xt(m,"link",e),r.head.appendChild(m)),m={type:"script",instance:m,count:1,state:null},l.set(h,m))}}function ET(e,n){Li.M(e,n);var r=$r;if(r&&e){var l=cr(r).hoistableScripts,h=Yr(e),m=l.get(h);m||(m=r.querySelector(rl(h)),m||(e=j({src:e,async:!0,type:"module"},n),(n=Un.get(h))&&Oh(e,n),m=r.createElement("script"),qt(m),Xt(m,"link",e),r.head.appendChild(m)),m={type:"script",instance:m,count:1,state:null},l.set(h,m))}}function rv(e,n,r,l){var h=(h=Ge.current)?il(h):null;if(!h)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof r.precedence=="string"&&typeof r.href=="string"?(r=Gr(r.href),n=cr(h).hoistableStyles,l=n.get(r),l||(l={type:"style",instance:null,count:0,state:null},n.set(r,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(r.rel==="stylesheet"&&typeof r.href=="string"&&typeof r.precedence=="string"){e=Gr(r.href);var m=cr(h).hoistableStyles,k=m.get(e);if(k||(h=h.ownerDocument||h,k={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},m.set(e,k),(m=h.querySelector(al(e)))?m._p||(k.instance=m,k.state.loading=5):(m=Un.get(e),m||(m={rel:"preload",as:"style",href:r.href,crossOrigin:r.crossOrigin,integrity:r.integrity,media:r.media,hrefLang:r.hrefLang,referrerPolicy:r.referrerPolicy},Un.set(e,m)),CT(h,e,m,k.state))),n&&l===null)throw Error(o(528,""));return k}if(n&&l!==null)throw Error(o(529,""));return null;case"script":return n=r.async,r=r.src,typeof r=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(r=Yr(r),n=cr(h).hoistableScripts,l=n.get(r),l||(l={type:"script",instance:null,count:0,state:null},n.set(r,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function Gr(e){return'href="'+Ln(e)+'"'}function al(e){return'link[rel="stylesheet"]['+e+"]"}function ov(e){return j({},e,{"data-precedence":e.precedence,precedence:null})}function CT(e,n,r,l){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ul]!==!0){l.loading=1;return}}else n=e.createElement("link"),n[Ul]=!0,n.onload=n.onerror=yp.bind(null,n),Xt(n,"link",r),qt(n),e.head.appendChild(n);l.preload=n,n.addEventListener("load",function(){return l.loading|=1}),n.addEventListener("error",function(){return l.loading|=2})}function Yr(e){return'[src="'+Ln(e)+'"]'}function rl(e){return"script[async]"+e}function lv(e,n,r){if(n.count++,n.instance===null)switch(n.type){case"style":var l=e.querySelector('style[data-href~="'+Ln(r.href)+'"]');if(l)return n.instance=l,qt(l),l;var h=j({},r,{"data-href":r.href,"data-precedence":r.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),qt(l),Xt(l,"style",h),Ws(l,r.precedence,e),n.instance=l;case"stylesheet":h=Gr(r.href);var m=e.querySelector(al(h));if(m)return n.state.loading|=4,n.instance=m,qt(m),m;l=ov(r),(h=Un.get(h))&&jh(l,h),m=(e.ownerDocument||e).createElement("link"),qt(m);var k=m;return k._p=new Promise(function(O,F){k.onload=O,k.onerror=F}),Xt(m,"link",l),n.state.loading|=4,Ws(m,r.precedence,e),n.instance=m;case"script":return m=Yr(r.src),(h=e.querySelector(rl(m)))?(n.instance=h,qt(h),h):(l=r,(h=Un.get(m))&&(l=j({},r),Oh(l,h)),e=e.ownerDocument||e,h=e.createElement("script"),qt(h),Xt(h,"link",l),e.head.appendChild(h),n.instance=h);case"void":return null;default:throw Error(o(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(l=n.instance,n.state.loading|=4,Ws(l,r.precedence,e));return n.instance}function Ws(e,n,r){for(var l=r.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),h=l.length?l[l.length-1]:null,m=h,k=0;k<l.length;k++){var O=l[k];if(O.dataset.precedence===n)m=O;else if(m!==h)break}m?m.parentNode.insertBefore(e,m.nextSibling):(n=r.nodeType===9?r.head:r,n.insertBefore(e,n.firstChild))}function jh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Oh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var eu=null;function sv(e,n,r){if(eu===null){var l=new Map,h=eu=new Map;h.set(r,l)}else h=eu,l=h.get(r),l||(l=new Map,h.set(r,l));if(l.has(e))return l;for(l.set(e,null),r=r.getElementsByTagName(e),h=0;h<r.length;h++){var m=r[h];if(!(m[xo]||m[Vt]||e==="link"&&m.getAttribute("rel")==="stylesheet")&&m.namespaceURI!=="http://www.w3.org/2000/svg"){var k=m.getAttribute(n)||"";k=e+k;var O=l.get(k);O?O.push(m):l.set(k,[m])}}return l}function Lh(e,n,r){e=e.ownerDocument||e,e.head.insertBefore(r,n==="title"?e.querySelector("head > title"):null)}function RT(e,n,r){if(r===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(e=n.disabled,typeof n.precedence=="string"&&e==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function uv(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function cv(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function dv(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function hv(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=dv(n),e.suspenseyImages.push(n)),e=DT.bind(e),n.decode().then(e,e))}function MT(e,n,r,l){if(r.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(r.state.loading&4)===0){if(r.instance===null){var h=Gr(l.href),m=n.querySelector(al(h));if(m){n=m._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=ol.bind(e),n.then(e,e)),r.state.loading|=4,r.instance=m,qt(m);return}m=n.ownerDocument||n,l=ov(l),(h=Un.get(h))&&jh(l,h),m=m.createElement("link"),qt(m);var k=m;k._p=new Promise(function(O,F){k.onload=O,k.onerror=F}),Xt(m,"link",l),r.instance=m}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(r,n),(n=r.state.preload)&&(r.state.loading&3)===0&&(e.count++,r=ol.bind(e),n.addEventListener("load",r),n.addEventListener("error",r))}}var tu=0;function NT(e,n){return e.stylesheets&&e.count===0&&iu(e,e.stylesheets),0<e.count||0<e.imgCount?function(r){var l=setTimeout(function(){if(e.stylesheets&&iu(e,e.stylesheets),e.unsuspend){var m=e.unsuspend;e.unsuspend=null,m()}},6e4+n);0<e.imgBytes&&tu===0&&(tu=62500*Jk());var h=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&iu(e,e.stylesheets),e.unsuspend)){var m=e.unsuspend;e.unsuspend=null,m()}},(e.imgBytes>tu?50:800)+n);return e.unsuspend=r,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(h)}}:null}function fv(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)iu(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function ol(){this.count--,fv(this)}function DT(){this.imgCount--,fv(this)}var nu=null;function iu(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,nu=new Map,n.forEach(jT,e),nu=null,ol.call(e))}function jT(e,n){if(!(n.state.loading&4)){var r=nu.get(e);if(r)var l=r.get(null);else{r=new Map,nu.set(e,r);for(var h=e.querySelectorAll("link[data-precedence],style[data-precedence]"),m=0;m<h.length;m++){var k=h[m];(k.nodeName==="LINK"||k.getAttribute("media")!=="not all")&&(r.set(k.dataset.precedence,k),l=k)}l&&r.set(null,l)}h=n.instance,k=h.getAttribute("data-precedence"),m=r.get(k)||l,m===l&&r.set(null,h),r.set(k,h),this.count++,l=ol.bind(this),h.addEventListener("load",l),h.addEventListener("error",l),m?m.parentNode.insertBefore(h,m.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(h,e.firstChild)),n.state.loading|=4}}var Jr={$$typeof:M,Provider:null,Consumer:null,_currentValue:ye,_currentValue2:ye,_threadCount:0};function OT(e,n,r,l,h,m,k,O,F){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=mc(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mc(0),this.hiddenUpdates=mc(null),this.identifierPrefix=l,this.onUncaughtError=h,this.onCaughtError=m,this.onRecoverableError=k,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=F,this.transitionTypes=null,this.incompleteTransitions=new Map}function mv(e,n,r,l,h,m,k,O,F,ee,se,pe){return e=new OT(e,n,r,k,F,ee,se,pe,O),n=1,m===!0&&(n|=24),m=cn(3,null,null,n),e.current=m,m.stateNode=e,n=Xc(),n.refCount++,e.pooledCache=n,n.refCount++,m.memoizedState={element:l,isDehydrated:r,cache:n},Wc(m),e}function pv(e){return e?(e=xr,e):xr}function gv(e,n,r,l,h,m){h=pv(h),l.context===null?l.context=h:l.pendingContext=h,l=Qi(n),l.payload={element:r},m=m===void 0?null:m,m!==null&&(l.callback=m),r=Wi(e,l,n),r!==null&&(mn(r,e,n),Io(r,e,n))}function yv(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<n?r:n}}function zh(e,n){yv(e,n),(e=e.alternate)&&yv(e,n)}function bv(e){if(e.tag===13||e.tag===31){var n=ja(e,67108864);n!==null&&mn(n,e,67108864),zh(e,67108864)}}function vv(e){if(e.tag===13||e.tag===31){var n=Cn();n=pc(n);var r=ja(e,n);r!==null&&mn(r,e,n),zh(e,n)}}var Xr=!0;function LT(e,n,r,l){var h=de.T;de.T=null;var m=ae.p;try{ae.p=2,_h(e,n,r,l)}finally{ae.p=m,de.T=h}}function zT(e,n,r,l){var h=de.T;de.T=null;var m=ae.p;try{ae.p=8,_h(e,n,r,l)}finally{ae.p=m,de.T=h}}function _h(e,n,r,l){if(Xr){var h=Ih(l);if(h===null)yh(e,n,l,au,r),wv(e,l);else if(IT(h,e,n,r,l))l.stopPropagation();else if(wv(e,l),n&4&&-1<_T.indexOf(e)){for(;h!==null;){var m=ur(h);if(m!==null)switch(m.tag){case 3:if(m=m.stateNode,m.current.memoizedState.isDehydrated){var k=Ca(m.pendingLanes);if(k!==0){var O=m;for(O.pendingLanes|=2,O.entangledLanes|=2;k;){var F=1<<31-xn(k);O.entanglements[1]|=F,k&=~F}mi(m),(st&6)===0&&(Fs=ct()+500,Wo(0))}}break;case 31:case 13:O=ja(m,2),O!==null&&mn(O,m,2),Gs(),zh(m,2)}if(m=Ih(l),m===null&&yh(e,n,l,au,r),m===h)break;h=m}h!==null&&l.stopPropagation()}else yh(e,n,l,null,r)}}function Ih(e){return e=Sc(e),Hh(e)}var au=null;function Hh(e){if(au=null,e=Ra(e),e!==null){var n=c(e);if(n===null)e=null;else{var r=n.tag;if(r===13){if(e=u(n),e!==null)return e;e=null}else if(r===31){if(e=d(n),e!==null)return e;e=null}else if(r===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return au=e,null}function xv(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Bt()){case jn:return 2;case On:return 8;case Il:case X1:return 32;case lp:return 268435456;default:return 32}default:return 32}}var Bh=!1,da=null,ha=null,fa=null,ll=new Map,sl=new Map,ma=[],_T="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function wv(e,n){switch(e){case"focusin":case"focusout":da=null;break;case"dragenter":case"dragleave":ha=null;break;case"mouseover":case"mouseout":fa=null;break;case"pointerover":case"pointerout":ll.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":sl.delete(n.pointerId)}}function ul(e,n,r,l,h,m){return e===null||e.nativeEvent!==m?(e={blockedOn:n,domEventName:r,eventSystemFlags:l,nativeEvent:m,targetContainers:[h]},n!==null&&(n=ur(n),n!==null&&bv(n)),e):(e.eventSystemFlags|=l,n=e.targetContainers,h!==null&&n.indexOf(h)===-1&&n.push(h),e)}function IT(e,n,r,l,h){switch(n){case"focusin":return da=ul(da,e,n,r,l,h),!0;case"dragenter":return ha=ul(ha,e,n,r,l,h),!0;case"mouseover":return fa=ul(fa,e,n,r,l,h),!0;case"pointerover":var m=h.pointerId;return ll.set(m,ul(ll.get(m)||null,e,n,r,l,h)),!0;case"gotpointercapture":return m=h.pointerId,sl.set(m,ul(sl.get(m)||null,e,n,r,l,h)),!0}return!1}function Sv(e){var n=Ra(e.target);if(n!==null){var r=c(n);if(r!==null){if(n=r.tag,n===13){if(n=u(r),n!==null){e.blockedOn=n,mp(e.priority,function(){vv(r)});return}}else if(n===31){if(n=d(r),n!==null){e.blockedOn=n,mp(e.priority,function(){vv(r)});return}}else if(n===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ru(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var r=Ih(e.nativeEvent);if(r===null){r=e.nativeEvent;var l=new r.constructor(r.type,r);wc=l,r.target.dispatchEvent(l),wc=null}else return n=ur(r),n!==null&&bv(n),e.blockedOn=r,!1;n.shift()}return!0}function kv(e,n,r){ru(e)&&r.delete(n)}function HT(){Bh=!1,da!==null&&ru(da)&&(da=null),ha!==null&&ru(ha)&&(ha=null),fa!==null&&ru(fa)&&(fa=null),ll.forEach(kv),sl.forEach(kv)}function ou(e,n){e.blockedOn===n&&(e.blockedOn=null,Bh||(Bh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,HT)))}var lu=null;function Tv(e){lu!==e&&(lu=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){lu===e&&(lu=null);for(var n=0;n<e.length;n+=3){var r=e[n],l=e[n+1],h=e[n+2];if(typeof l!="function"){if(Hh(l||r)===null)continue;break}var m=ur(r);m!==null&&(e.splice(n,3),n-=3,xd(m,{pending:!0,data:h,method:r.method,action:l},l,h))}}))}function Zr(e){function n(F){return ou(F,e)}da!==null&&ou(da,e),ha!==null&&ou(ha,e),fa!==null&&ou(fa,e),ll.forEach(n),sl.forEach(n);for(var r=0;r<ma.length;r++){var l=ma[r];l.blockedOn===e&&(l.blockedOn=null)}for(;0<ma.length&&(r=ma[0],r.blockedOn===null);)Sv(r),r.blockedOn===null&&ma.shift();if(r=(e.ownerDocument||e).$$reactFormReplay,r!=null)for(l=0;l<r.length;l+=3){var h=r[l],m=r[l+1],k=h[un]||null;if(typeof m=="function")k||Tv(r);else if(k){var O=null;if(m&&m.hasAttribute("formAction")){if(h=m,k=m[un]||null)O=k.formAction;else if(Hh(h)!==null)continue}else O=k.action;typeof O=="function"?r[l+1]=O:(r.splice(l,3),l-=3),Tv(r)}}}function Av(){function e(m){m.canIntercept&&m.info==="react-transition"&&m.intercept({handler:function(){return new Promise(function(k){return h=k})},focusReset:"manual",scroll:"manual"})}function n(){h!==null&&(h(),h=null),l||setTimeout(r,20)}function r(){if(!l&&!navigation.transition){var m=navigation.currentEntry;m&&m.url!=null&&navigation.navigate(m.url,{state:m.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,h=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(r,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),h!==null&&(h(),h=null)}}}function qh(e){this._internalRoot=e}su.prototype.render=qh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(o(409));var r=n.current,l=Cn();gv(r,l,e,n,null,null)},su.prototype.unmount=qh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;gv(e.current,2,null,e,null,null),Gs(),n[sr]=null}};function su(e){this._internalRoot=e}su.prototype.unstable_scheduleHydration=function(e){if(e){var n=fp();e={blockedOn:null,target:e,priority:n};for(var r=0;r<ma.length&&n!==0&&n<ma[r].priority;r++);ma.splice(r,0,e),r===0&&Sv(e)}};var Ev=i.version;if(Ev!=="19.3.0")throw Error(o(527,Ev,"19.3.0"));ae.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=f(n),e=e!==null?y(e):null,e=e===null?null:e.stateNode,e};var BT={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:de,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var uu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!uu.isDisabled&&uu.supportsFiber)try{yo=uu.inject(BT),vn=uu}catch{}}return ml.createRoot=function(e,n){if(!s(e))throw Error(o(299));var r=!1,l="",h=py,m=gy,k=yy;return n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onUncaughtError!==void 0&&(h=n.onUncaughtError),n.onCaughtError!==void 0&&(m=n.onCaughtError),n.onRecoverableError!==void 0&&(k=n.onRecoverableError)),n=mv(e,1,!1,null,null,r,l,null,h,m,k,Av),e[sr]=n.current,gh(e),new qh(n)},ml.hydrateRoot=function(e,n,r){if(!s(e))throw Error(o(299));var l=!1,h="",m=py,k=gy,O=yy,F=null;return r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(h=r.identifierPrefix),r.onUncaughtError!==void 0&&(m=r.onUncaughtError),r.onCaughtError!==void 0&&(k=r.onCaughtError),r.onRecoverableError!==void 0&&(O=r.onRecoverableError),r.formState!==void 0&&(F=r.formState)),n=mv(e,1,!0,n,r??null,l,h,F,m,k,O,Av),n.context=pv(null),r=n.current,l=Cn(),l=pc(l),h=Qi(l),h.callback=null,Wi(r,h,l),r=l,n.current.lanes=r,vo(n,r),mi(n),e[sr]=n.current,gh(e),new su(n)},ml.version="19.3.0",ml}var iw;function Xj(){if(iw)return Sf.exports;iw=1;function t(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)}catch(i){console.error(i)}}return t(),Sf.exports=Jj(),Sf.exports}var om=Xj();function pl({open:t,children:i,className:a="",...o}){const[s,c]=L.useState(t),[u,d]=L.useState(!1);return L.useEffect(()=>{if(!t){d(!1);const y=setTimeout(()=>c(!1),360);return()=>clearTimeout(y)}c(!0);let p=0;const f=requestAnimationFrame(()=>{p=requestAnimationFrame(()=>d(!0))});return()=>{cancelAnimationFrame(f),cancelAnimationFrame(p)}},[t]),s?b.jsx("div",{...o,className:`demo-dropdown-menu ${a}`,"data-open":u||void 0,"aria-hidden":!t,ref:p=>{p?.toggleAttribute("inert",!t)},children:b.jsx("div",{className:"demo-dropdown-content",children:i})}):null}const Zj=`# English documentation

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/README) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/README.md)

These pages describe the current repository implementation, including the new streaming, typography, and module capabilities. Check installed exports and types when consuming an npm release. Chinese is the default documentation language; every English page has a matching Chinese page.

| What you want to do | Read |
| --- | --- |
| Install and render a first document | [Getting started](getting-started.md) |
| Understand modules, included capabilities, and configuration | [Built-in modules](modules.md) |
| Write Markdown, Mermaid, callouts, highlights, footnotes, and two-colon components | [Default syntax](syntax.md) |
| Integrate React, typography modes, streaming, custom layouts, or SSR | [Application integration](integration.md) |
| Persist selections, highlights, citations, and annotations; understand atomic copying | [Annotations and selection](annotations.md) |
| Add syntax, cards, actions, streaming effects, or conditional renderers | [Extension development](extensions.md) |
| Build a standalone npm plugin and import it into an app | [Plugin packages](plugin-packages.md) |
| Customize themes, fonts, KP layout, animation, and diagrams | [Styles and fonts](styles.md) |
| Look up component props, hooks, and core APIs | [API reference](api.md) |
| Understand parsing, state, and resource boundaries | [Architecture and behavior](architecture.md) |
| Understand measurements and validation boundaries | [Performance and limits](performance.md) |
| Have an AI use LiMR or develop plugins | [AI Skills](ai-skills.md) |

Start with \`Reader\`, split components when a custom layout is needed, and add plugins for application features. Local persistence, import/export, and simulated assistant responses in the Playground belong to the demo application, not to Reader itself.

Playground uses standard typography by default; its menu also offers Knuth–Plass and justification, and the streaming demo runs at a slower pace. Refresh opens the default document without restoring the previous article or edits. Explicitly saved drafts can be loaded manually; locale preference persists separately. Docs links open the selected page directly, and switching between Docs and Playground preserves edits during the current session.

[Back to README](../../README.en.md) · [Live Playground](https://linloir.github.io/LiMR/)
`,Kj=`# AI Skills: download, install, and use

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/ai-skills) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/ai-skills.md)

Skills are instruction bundles for AI agents, not RendererExtension modules or model services. Installing a Skill does not automatically change a project, install plugins, or connect an AI API.

| Skill | Tasks |
| --- | --- |
| [limr-use](../../skills/limr-use/SKILL.md) | Integrate LiMR, choose components, author syntax, configure annotations/streaming/themes, import existing plugins |
| [limr-plugin-development](../../skills/limr-plugin-development/SKILL.md) | Build new plugin packages with cards/syntax/actions/parameters and validate consumers |

Instructions are in English and accept tasks written in Chinese. Human-facing documentation is bilingual. The development Skill includes a standalone starter; both include local references, so the entire repository is not required in the agent's context.

## Import from the npm package

Install a LiMR version containing Skills, then run in **your application project**:

\`\`\`sh
npm install @linloir/limr
mkdir -p .agents/skills
cp -R node_modules/@linloir/limr/skills/limr-use .agents/skills/
cp -R node_modules/@linloir/limr/skills/limr-plugin-development .agents/skills/
\`\`\`

These commands illustrate a fresh installation. Review local customizations before replacing an existing directory, and update the whole folder to avoid stale templates. Copies are snapshots; npm upgrades do not update them automatically. Review compatibility when upgrading LiMR.

## Import from the repository or ZIP

Copy from the repository's skills directory, or generate ZIPs locally (requires Python 3):

\`\`\`sh
pnpm pack:skills
\`\`\`

Archives are written to artifacts/skills and mirrored to Playground public/downloads for Docs downloads. Each ZIP contains a complete top-level skill directory, not just SKILL.md. A versioned combined archive is also produced. Building the Docs site generates download assets automatically.

After the corresponding site version is deployed, download [limr-use.zip](https://linloir.github.io/LiMR/downloads/limr-use.zip) or [limr-plugin-development.zip](https://linloir.github.io/LiMR/downloads/limr-plugin-development.zip). The local AI Skills page also has download buttons. ZIPs are transport archives, not a promise that every AI client supports one-click import; extract and copy the full folders where needed.

## Codex locations and invocation

Codex supports project skills in .agents/skills and user skills in ~/.agents/skills. Choose one scope to avoid duplicate names. Older clients may use a different supported directory. Changes are normally discovered automatically; restart if missing. Invoke through /skills or $skill-name. Source: [official OpenAI Skills documentation](https://developers.openai.com/codex/skills/).

\`\`\`text
$limr-use Integrate LiMR into this React application with English labels, streaming answers, and controlled annotations.
\`\`\`

\`\`\`text
$limr-plugin-development Create a glossary plugin package with a term block, selection action, expandable card, and sidebar preview, then import it into this application.
\`\`\`

For other SKILL.md-compatible agents, use their supported project/user locations. Without automatic discovery, ask the AI to read SKILL.md and follow its reference/asset links. Do not assume one client's commands work everywhere.

## Expected deliverables

The use Skill should deliver working integration, stable configuration, and validation. The development Skill should deliver module source, exports/types/CSS, a host example, and real package-consumer verification. Both prioritize the installed API, avoid invented syntax and loss of persisted unknown annotations, and do not publish packages or modify external services unless instructed.
`,Qj=`# Annotations and selection

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/annotations) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/annotations.md)

## Data model

Annotation stores data, AnnotationType registers presentation/loading, and AnnotationOccurrence describes one location. One annotation can have multiple anchors; one citation marker can refer to several annotations.

\`\`\`ts
import type { Annotation } from '@linloir/limr';

export const annotations: readonly Annotation[] = [{
  id: 'paper-reference',
  type: 'citation',
  data: { title: 'Paper', url: 'https://example.com/paper' },
  anchors: [{
    range: { start: 0, end: 4 },
    documentId: 'article',
    quote: 'LiMR',
  }],
}, {
  id: 'highlight-1',
  type: 'highlight',
  range: { start: 0, end: 4 },
  data: { color: '#F2C744', style: 'background' },
}];
\`\`\`

The example requires source to begin with LiMR and documentId to be article. range is shorthand for one anchor; anchors takes precedence. All ranges address the **unmodified input**, using UTF-16 offsets with an exclusive end, not UTF-8 bytes or Unicode code points.

Persist source, a stable documentId, annotation ID/type/data/anchors, and your application document version when needed. anchor.revision belongs to the current engine session, not a cross-session identity. If quote no longer matches the range, relocation succeeds only for one unique match in the source. Missing/ambiguous matches or a mismatched documentId skip that anchor. Without quote, a mismatched revision also skips it. This is not automatic position transformation for collaborative editing.

## Three selection forms

| Field | Meaning |
| --- | --- |
| text | Readable selected text; settled atomic content uses its complete original source |
| raw | Mapped original ranges and source |
| syntax | Absorbs adjacent standard Markdown delimiters at each edge, without selecting extra words or outer custom tags |
| blocks | Ranges and source for touched blocks |
| quality | exact, atomic, or unmapped |
| settled | False while a pointer selection is changing |
| documentId / revision | Owning document snapshot |

Each result has ranges and sourceText. Notes usually use syntax.ranges. Store document.source.slice(start, end) as quote for **every range**. Code supports partial selection; math and images are atomic. Do not infer offsets from DOM textContent lengths: entities, escapes, and emoji make those coordinates differ.

The default selection toolbar and browser copy serialize atomic content as a whole, retaining its original delimiters (\`$…$\`, \`$$…$$\`, image syntax, Mermaid fences/directives, or plugin block tags). Surrounding ordinary text keeps its rendered spelling and explicit line breaks. This also applies when reopening an existing highlight. A plugin's \`selection: 'atomic'\` covers its mapped attributes, children, and nested atoms; block-local copy buttons may offer their own specialized format.

## Highlights and commands

highlight needs no extra AnnotationType. Its data supports color, style (background / underline / dotted / wavy), and hidden. Deleting content annotations differs from hiding their highlight.

| Command | Behavior |
| --- | --- |
| addAnnotation(annotation, options?) | Adds/replaces an ID; ordinary content annotations also get a shared persistent highlight by default |
| updateAnnotation(id, partial) | Shallowly merges fields; data is replaced as a whole, so retain needed fields |
| removeAnnotation(id) | Removes that annotation, preserving other annotations and shared highlights |
| removeAnnotationsAt(ranges) | Removes annotations/highlights at exact matching fragments, retaining other anchors |
| editAnnotation(id / null) | Changes shared editing state; setting an ID also activates its card |
| activateAnnotation(id / null) | Opens the annotation's first occurrence, or accepts an explicit occurrence ID |

addAnnotation accepts highlight: false to suppress automatic persistent highlighting, explicit HighlightData to choose its style, and edit: true to enter editing. Types configured with highlight: 'hover' do not add persistent highlights by default, but an explicit appearance still creates one. Default toolbar actions are palette, add/hide highlight, copy, and delete. actions replaces built-in actions; plugin actions are still merged in.

## Citation hover highlights

Citations default to highlight: 'hover'. Hovering a marker or sidebar item, or activating a reference, paints the referenced text with an 18% tint of the type's color behind the text. Clicking pins the highlight after the pointer leaves; it disappears once the reference is neither active nor hovered. Active and hovered references to the same paragraph do not stack their tints. This feedback never updates annotations or saved hidden settings. Embedded refs use their nearest paragraph, heading, list item, or table cell. External references use their own range; the first line anchors sidebar alignment.

Sidebar alignment translates the prose without changing the page's scroll range. Paint updates throughout that animation and on completion or cancellation, so text entering from outside the viewport receives the current hover or active feedback.

Disable it with replaceExtension(standard(), citation({ highlight: false })). Other types can opt into highlight: 'hover'.

## Missing plugins

The current implementation **does not silently ignore unknown annotation types**. It retains data/ranges and may show a generic dot marker. Without Content, the card shows the localized unavailable label and type name. A missing citation definition may also show unavailable content. Install the matching plugin, or let the application decide which annotations to hide temporarily.

If filtering unsupported types, retain the full persisted array and merge hidden data back when accepting edits, so disabling a plugin cannot discard data. Playground plugin checkboxes currently toggle action entries while retaining card renderers; they do not simulate uninstalling a plugin.

## Cards and async resources

Modules register Content for annotation content, overlay.Card for the whole floating card interior, and sidebar.Preview for a local collapsed summary. AnnotationMarkdown reuses Markdown configuration with an isolated selection scope.

load(annotation, { signal }) runs when content is displayed, sharing requests and a bounded cache within one reader. Separate readers are isolated. Preview never invokes load. Content receives data, loading, error, retry, editing, presentation, and expanded; the module renders loading/error UI. Refresh with useLiMR().invalidateAnnotation(id).

Action signals abort when the reader is disposed, not when the menu closes. Preserve question fields when replacing data with streamed answers. Stopping generation, retries, authentication, conversation state, and storage belong to the application adapter. See the [assistant example](../../examples/assistant.tsx) and [extension development](extensions.md).
`,Wj=`# API reference

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/api) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/api.md)

## Entry points

| Entry | Contents |
| --- | --- |
| @linloir/limr | All public core, React, and extension APIs |
| @linloir/limr/core | DOM/React-free engine, selection calculations, tree helpers, caches, data types |
| @linloir/limr/react | Components, hooks, locales, React types |
| @linloir/limr/extensions | Module factories, definitions, selection actions, AnnotationMarkdown |
| styles.css / styles/base.css / fonts.css / math.css | Public styles, prefixed by the package name |
| @linloir/limr/package.json | Package metadata |

This is an API guide. Exact TypeScript declarations ship with the package; plugins should use the installed version's declarations.

## Shared document configuration

Reader, Markdown, and DocumentProvider accept:

| Prop | Default / meaning |
| --- | --- |
| source | Empty string; original Markdown |
| streaming | false |
| documentId | Generated; explicit values should be stable and unique on the page |
| extensions | standard(); the complete extension list |
| plugins | Appended to the default or explicit list |
| parameters | Document-wide module parameter overrides |
| components | NodeRenderer overrides by AST type/custom tag |
| annotationTypes | Add/override presentation by type |
| annotations | Internal state if omitted; controlled if supplied |
| onAnnotationsChange | Next external annotation array, including highlights; required to accept controlled edits |
| theme | light, dark, or auto |
| appearance | classic; CSS scope propagated to portals |
| locale | english; accepts chinese or Partial&lt;LiMRLocale&gt; |
| justify | false; justify prose/list text |
| typography | standard (default), knuth-plass, or justify; legacy CSS modes pretty / normal remain available |
| knuthPlass | TeX paragraph parameters; see [styles](styles.md) |
| rendererOverrides | Ordered, reader-scoped rules with type, component and optional when predicate |
| streamEffect | Increment animation override; false disables |
| scrollRoot | null/omitted means window |
| scrollOffset | 24px |
| onDocumentChange | DocumentSnapshot after updates |
| onSelectionChange | SelectionSnapshot or null |
| onAnnotationClick | Activated AnnotationOccurrence |
| onAnnotationHover | Occurrence or null |
| onHighlightClick / onHighlightHover | Highlight Annotation; hover exit is null |

The default locale is english. Missing partial keys fall back to English. locale affects built-in controls that use LiMRLocale, not document text or third-party copy. Some auxiliary labels (for example Copy LaTeX and translation switch hints) are currently fixed by their modules. The Playground reader-language control demonstrates Chinese/English switching and saves that preference separately in browser storage.

## Components

| Component | Extra props and defaults |
| --- | --- |
| Reader | toc=true, sidebar=true, fillHeight=true, sidebarBreakpoint=1120, actions, followOutput=false, className/style |
| Markdown | interactive=true, followOutput=false, className/style |
| DocumentProvider | children; supplies context to composed views |
| TableOfContents | title, maxDepth=6, followActive=true, topInset=24, updateHash=false, className/style |
| AnnotationSidebar | sync='document' / 'none', gap=14, positioner=alignSidebar, renderCard, className/style |
| AnnotationOverlay | disabled=false, portalRoot, previewWidth=340, maxHeight='80dvh' |
| SelectionToolbar | actions, portalRoot, maxPanelHeight=260, render, className/style |
| AnnotationCard | AnnotationOverlayCardProps plus required title and optional bodyLabel |
| AnnotationContent | annotationId, presentation, expanded=true, enabled=true |
| AnnotationGroup | occurrence, presentation, expanded=true, enabled=true |
| AnnotationMarkdown | MarkdownProps with required source; interactive=false by default |
| InlineMarker | Required label, color, children, button props/ref |
| ToolIcon | name and SVG props; e.g. note, copy, highlight, comment, zoom-in, zoom-out, source, image |

Shared views/hooks require a provider, except standalone Markdown and Reader. AnnotationCard is an interior template, not its own portal. sidebar.renderCard receives occurrence/active/activate; toolbar.render receives context/actions/run.

\`SidebarPositioner\` receives \`{ id, anchorTop, height }[]\` and \`{ activeId, gap, height?, prioritizeActive? }\`, returning a map of IDs to top positions. anchorTop is the first line of referenced text; prioritizeActive distinguishes hovered or active items from the item selected by reading position. The default alignSidebar packs footer cards at rest and prioritizes the current item during interaction.

## Hooks

| Hook | Result |
| --- | --- |
| useDocument() | Complete snapshot |
| useDocumentSelector(select) | Selected value; unchanged references avoid rerenders |
| useLocale() | Merged locale; built-in language is en / zh-CN for plugin dictionaries |
| useSelection() | Selection or null |
| useAnnotation(id) | Annotation or undefined |
| useAnnotations() | Annotations Map and occurrences, combining embedded and external data |
| useAnnotationState() | Active/hovered occurrence IDs plus activate/hover |
| useAnchor(occurrenceId) | Element, viewport rect, contentRect; null until mounted |
| useRendererParameter(name) | Host override or last registered default |
| useLiMR() | Engine, commands, signal, clearSelection, scrollToHeading, scrollToAnnotation, invalidateAnnotation |

useRuntime and useTheme are not public APIs. useLocale, locale.language, and localized annotation labels are available from 1.0.0. See [annotations](annotations.md) for commands and [extensions](extensions.md) for renderer/action contracts.

## Core engine

\`\`\`ts
import { createDocument, selectionFromRange } from '@linloir/limr/core';

const engine = createDocument('# Hello\\n\\nText', { id: 'core-doc', streaming: true });
engine.append('\\n\\nMore text.');
const document = engine.finish();
const selection = selectionFromRange(document, { start: 9, end: 13 });
console.log(document.headings, selection.syntax.sourceText);
\`\`\`

createDocument(source?, { id?, extensions?, streaming? }) returns DocumentEngine. Read with getSnapshot(); subscribe(listener) returns an unsubscribe function. update(source, { streaming? }) replaces the complete input, append(chunk) appends in streaming mode, finish() finalizes, and setExtensions(list) changes parsing configuration.

Core defaults to extensions=[]. Use SyntaxExtension with micromark/mdast for a strictly React-free parser; importing standard from the React extension entry introduces React dependencies.

DocumentSnapshot contains id, revision, source, streaming, blocks, headings, definitions, footnotes, footnoteOrder, annotations, occurrences, diagnostics, and metrics. Its annotations are **parsed from source**. Use useAnnotations for merged external data.

Other core exports include walk, textContent, rangeOf, intersects, safeUrl, mapText, selectionFromRange, replaceExtension, resolveAnnotationAnchors, annotationReferenceRange, sameRange, defaultHighlight, LruCache, and ResourceCache. ResourceCache.acquire returns promise/release; invalidate clears a key or everything.

\`inlineHighlights({ color?, component? })\` and \`footnotes(annotationTypeOptions?)\` are included in \`standard()\`. \`HighlightData.readOnly\` limits the default highlight toolbar to copying and a hint; \`AnnotationOccurrence.referenceRange\` separates a marker's source location from the text it references.

Core also exports \`knuthPlass(items, lengths, options?)\`, \`prepareKnuthPlass(items)\`, \`texBadness\`, and their types. The prepared function reuses prefix sums when solving the same paragraph at multiple widths.
`,eO=`# Architecture and behavior

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/architecture) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/architecture.md)

## Three public layers

1. core owns original source, AST, blocks, headings, embedded references, diagnostics, and selection coordinates, without a React/DOM runtime dependency.
2. React connects document, interaction, layout, external annotations, and resource state to views.
3. extensions implements defaults through the same public contract available to applications; modules can be appended, replaced, or removed.

Docs navigation and Playground persistence/loading/language menus belong to the demo application, not the LiMR core.

## Append parsing

Streaming reparses from the unstable final top-level block, reusing stable prefixes, line indexes, and node semantic indexes. Growing code fences can use a literal fast path. Finalization can also reparse only the tail rather than always parsing the whole document. Late Markdown reference/footnote definitions, middle edits, document-scoped transforms, or extension changes can still require a full parse. Long paragraphs, lists, and complex unclosed tags retain tail-parsing costs.

\`incomplete\` identifies an unclosed node; \`pending\` describes its growing top-level block. Modules can render progressively or provide \`streaming.Loading\`. Incomplete headers and inline syntax markers are deferred. Increment animations affect new content; temporary wrappers merge after animation completion once native selection leaves them. Streaming code retains existing text nodes, and final highlighting waits while its text is selected.

Public source always retains the original input. Internally, the parser inserts markers for two-colon components and incomplete syntax, then maps positions back through sparse offsets. These internal markers never enter copied text, annotations, or persisted data. Custom transforms must preserve original UTF-16 positions and honor locality. Embedded references and application annotations enter separately and merge in the React layer.

## Typography and source mapping

Standard mode uses browser layout by default. KP loads on the client: preparation caches glyph measurements, hyphenation, legal breakpoints, and prefix sums; solving runs TeX paragraph dynamic programming. Stable paragraphs near the viewport take priority and retain their DOM offscreen. Width changes reuse preparation and text containers. Selected paragraphs keep their native Range and defer layout until selection clears. Original source offsets and annotations remain unchanged; see [styles](styles.md) and [performance](performance.md).

Atomic selection text serializes complete original source; surrounding ordinary text retains its rendered spelling and explicit line breaks. Mapped attributes, children, and nested atoms follow the enclosing plugin block’s atomic selection contract.

## State and resources

Update configuration immutably and keep static references stable. Scrolling and parameter updates do not require parsing. A provider manages one primary body; document state and annotation requests are isolated between providers.

Annotation loading uses bounded per-reader caching; releasing consumers can cancel unused requests. Pure Shiki token results use a bounded module-level cache, separate from user annotation data. Mermaid uses bounded result caching and serializes global initialization with rendering so readers using different themes cannot interfere. The library supplies no model service, authentication, database, or automatic persistence.

## Fallback behavior

Unknown HTML/custom tags remain inert source text. In the default configuration, unknown directives render their children. Unknown annotation types retain data and show generic markers/unavailable content rather than silently disappearing. Syntax recovery, transform diagnostics, and client renderer boundaries have distinct scopes; see [extensions](extensions.md).

## Validation boundaries

The repository includes parser/offset/SSR unit tests, real Chromium interaction regressions, and separate React 18/19 npm-consumer checks. Intercepted media, mobile viewport simulation, and performance fixtures are not proof of remote playback, physical-device acceptance, or universal performance.
`,tO=`# Extension development

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/extensions) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/extensions.md)

Start with [built-in modules](modules.md) for module objects, factories, names, Markdown tags, and the difference between \`extensions\` and \`plugins\`.

## Choose an interface

| Need | Interface |
| --- | --- |
| A new block with Markdown content | defineBlock |
| A standalone annotation type | defineAnnotation |
| Combined syntax, annotations, actions, and parameters | defineExtension / RendererExtension |
| A different view for existing nodes or a matching subset | components / rendererOverrides |
| New parsing rules | micromark + mdast, with transform when needed |
| Visual changes only | CSS theme package + appearance |

These APIs are publicly exported from @linloir/limr. Third-party packages must not import src/dist internals or non-public helpers such as useRuntime. See [plugin packages](plugin-packages.md) for a complete standalone starter.

## Append, remove, and replace defaults

\`\`\`tsx
import { Reader, standard, replaceExtension, video, defineBlock } from '@linloir/limr';

const extensions = replaceExtension(standard(), video({ loading: 'click' }));
const plugins = [defineBlock({
  name: 'reading-tip',
  component: ({ children }) => <aside className="reading-tip">{children}</aside>,
})];

export function Article({ source }: { source: string }) {
  return <Reader source={source} extensions={extensions} plugins={plugins} />;
}
\`\`\`

Filter by name to remove a module. Extension names, tag names, and directive names must each be unique; duplicates throw. Do not append a second citation or video through plugins. replaceExtension replaces a matching name or appends if absent. Keep configurations stable to avoid rebuilding the parser during streaming.

## Custom content blocks

\`\`\`tsx
import { defineBlock } from '@linloir/limr';

export const notice = defineBlock({
  name: 'notice',
  component: ({ children, renderAttribute }) => <aside className="notice">
    <header>{renderAttribute('title')}</header>
    {children}
  </aside>,
});
\`\`\`

This supports \`<notice title="Tip">…</notice>\`, paired \`::notice{title="Tip"}\` / \`::\`, and \`:::\` containers. name becomes the tag and directive name unless tags/directives overrides them. defineBlock defaults to display: block, selection: content, and scope: local.

| NodeRendererProps | Use |
| --- | --- |
| node | AST node and static attributes |
| children | Already-rendered subtree; reuse it where possible |
| source | Source for **this node**, not the entire document |
| pending | Whether its tail block is still streaming |
| incomplete | Whether this particular syntax node is unclosed |
| renderChildren(nodes, { trailing? }) | Rearrange an existing subtree or append an action-only marker |
| renderValue(tokens?) | Render literals/tokens while preserving selection and annotation insertion |
| renderAttribute(name) | Render attribute text with original source coordinates |

Do not stringify/reparse children or render only node.value when source mapping is required. Use selection: atomic for charts/media without character correspondence, and data-limr-selection-surface for a visual boundary. Public InlineMarker supports action-only markers without creating annotations.

## Plugins own card presentation

\`\`\`tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon } from '@linloir/limr';

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: ({ data, loading, error, retry }) => loading ? <p>Loading…</p>
    : error ? <button onClick={retry}>Retry</button>
    : <AnnotationMarkdown source={data?.text ?? ''} />,
  sidebar: {
    Preview: ({ data }) => data?.text ? <span>{data.text}</span> : null,
    previewLines: 2,
  },
  overlay: {
    Card: props => <AnnotationCard {...props} title="Note" />,
    previewWidth: 320,
    expand: { placement: 'center', width: 640, maxHeight: '80dvh' },
  },
});
\`\`\`

Content handles presentation (preview / expanded / sidebar), editing, data, and resource state. overlay.Card owns title, body, and controls; use AnnotationCard or render everything yourself. children contains the shared loaded content. LiMR owns positioning, portals, focus, animation, and exit lifecycle. Keep the plugin's semantic title.

Expansion is opt-in. placement accepts anchor / center, sizes accept pixels or CSS lengths, and a resolver can vary the policy by annotation. sidebar.Preview reads local data only; do not fetch for a summary. Preview: false or returning null hides it. The first type in an occurrence owns grouped appearance and summary; annotations provides the group.

sidebar also accepts previewLines, previewColor, color, borderColor, titleColor, textColor, excerptColor, and collapseOnContentClick. Do not repeat card padding at the content root. Use --limr-sidebar-padding-inline and manage internal paragraph spacing.

## Selection actions

\`\`\`tsx
import { defineExtension, ToolIcon } from '@linloir/limr';

export const savePassage = defineExtension({
  name: 'example:save-passage',
  actions: [{
    id: 'example:save-passage', label: 'Save passage', icon: <ToolIcon name="note" />,
    visible: ({ selection }) => selection.settled && selection.quality !== 'unmapped',
    run(context) {
      const id = \`example-note-\${crypto.randomUUID()}\`;
      context.addAnnotation({
        id, type: 'example:note', data: { text: context.selection.text },
        anchors: context.selection.syntax.ranges.map(range => ({
          range, documentId: context.document.id,
          quote: context.document.source.slice(range.start, range.end),
        })),
      });
      context.activateAnnotation(id);
      context.clearSelection();
    },
  }],
});
\`\`\`

Install this alongside the note extension above. SelectionAction requires id, label, and icon, and can define visible, disabled, run, onHover, renderExpanded, or render. Use context.run for panel operations to share toolbar busy/error handling. Context contains the selection, full snapshot, annotations/highlight for the fragment, locale, cancellation signal, and commands. Later actions override matching IDs; explicit host actions take final precedence.

## Parameters

\`\`\`tsx
import { defineExtension, useRendererParameter } from '@linloir/limr';

declare module '@linloir/limr' {
  interface RendererParameters { exampleDetail?: 'short' | 'full' }
}

export const glossary = defineExtension({
  name: 'example:glossary', tags: ['glossary'], scope: 'local',
  parameters: { exampleDetail: 'short' },
  components: {
    glossary: ({ children }) => <aside data-detail={useRendererParameter('exampleDetail')}>
      {children}
    </aside>,
  },
});
\`\`\`

The host overrides defaults with parameters={{ exampleDetail: 'full' }}. Parameter updates affect views without reparsing; later defaults win. A standalone package must include declaration merging in its exported .d.ts.

## Parsing and streaming constraints

SyntaxExtension supports micromark, mdast, tags, directives, display, selection, literal, transform, and scope. Transforms default to document scope. Declare scope: local only if the transform depends on the current subtree and never revises earlier content or needs document-wide semantics. context.source is the original whole document; positions remain original UTF-16 offsets. Plugins must not regex-rewrite source before parsing.

Unknown custom tags display their complete original text, including Markdown inside. Unknown directives in the default configuration render their inner Markdown without outer directive markers; with no directive extension installed, basic Markdown parsing applies. Registered incomplete tags and containers carry node.incomplete and are retried on append; unfinished headers stay hidden or use the module loading view. Invalid JSX can still fall back with diagnostics. Finish with finish() or streaming=false. Transform exceptions become diagnostics. Client renderer boundaries can fall back to source, but React error boundaries do not catch server-rendering exceptions.

Validate tags/directives, Chinese/emoji, offsets, equivalence between finalized streams and one-shot parsing, SSR, and browser behavior for new interactions. For distribution, test actual packed consumption as described in [plugin packages](plugin-packages.md).

## Plugin localization

From 1.0.0, components can read the merged locale through useLocale() and select their own dictionary by locale.language. AnnotationType.label accepts a string or \`(locale) => string\`; actions use context.locale. Citation titles switch between Citation and 引用. A stable plugin instance can update labels without rewriting source. Saved user notes are never translated.

## Streaming presentation

\`pending\` describes a growing top-level block; \`incomplete\` describes this particular unclosed syntax node. Every registered tag also accepts component directive syntax. \`defineBlock\` accepts \`streaming.Loading\`; omit it to render progressively, using \`incomplete\` in your component. Component identity is retained while children grow. Default definition, question, extras, video, figure and callout directives use a small themed ring; Mermaid waits for closure before asynchronously drawing. Code, math, GFM and translations show usable partial content. Blockquote-style callouts can grow progressively once their header is complete. Unclosed citation definitions do not register incomplete data.

\`\`\`tsx
import { defineBlock, defineExtension } from '@linloir/limr';

export const chart = defineBlock({
  name: 'chart',
  component: ({ children }) => <section>{children}</section>,
  streaming: { Loading: () => <span role="status">Preparing chart…</span> },
});
export const streamMotion = defineExtension({
  name: 'example:stream-motion',
  streaming: {
    effect: {
      className: 'my-stream-increment',
      keyframes: [{ opacity: 0.25 }, { opacity: 1 }],
      timing: { duration: 320, easing: 'ease-out' },
    },
  },
});
\`\`\`

The last extension providing \`streaming.effect\` wins. The reader's \`streamEffect\` overrides it; \`false\` disables the effect. Keyframes and timing use the Web Animations API. Reduced-motion preferences suppress new animations. Default text/block entrances change opacity without adding a background tint. Text wrappers are compacted after completion, once the native selection leaves them. Use \`children\`, \`renderChildren\` and \`renderValue\` to retain this behavior; a plugin that replaces its own DOM owns its selection and animation behavior.

\`SyntaxExtension.literal\` protects directive bodies from Markdown/JSX interpretation. Literal modules read their original \`source\` or transform the resulting component. It does not execute attribute expressions, YAML or JavaScript.

## Conditional component replacement

A module's \`rendererOverrides\` can restrict replacement by node type, language, ancestors or streaming state. Rules apply only inside that Reader. The last matching rule wins; Reader rules take precedence over extension rules and component mappings. Unmatched nodes retain their existing renderer.

\`\`\`tsx
import { defineExtension, type NodeRenderer } from '@linloir/limr';

const JavaScriptCode: NodeRenderer = ({ renderValue }) => <pre>{renderValue()}</pre>;
export const customCode = defineExtension({
  name: 'example:javascript-code',
  rendererOverrides: [{
    type: 'code',
    when: (node, context) => node.lang === 'js' && !context.incomplete,
    component: JavaScriptCode,
  }],
});
\`\`\`

\`when\` also receives \`pending\` and \`ancestors\`. An explicit replacement owns its intermediate rendering while retaining LiMR's source wrapper, atomic selection and error boundary. Use \`renderValue\`, \`renderAttribute\` and \`renderChildren\` to preserve mappings. These restrictions scope rendering rules; they are not a JavaScript security sandbox.
`,nO=`# Getting started

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/getting-started) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/getting-started.md)

## Install

\`\`\`sh
npm install @linloir/limr
\`\`\`

The host needs React and React DOM 18.3 or 19. LiMR is ESM and requires Node.js 20+. Use an ESM-capable build tool such as Vite. The application must import CSS explicitly.

## Complete reader

\`\`\`tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = \`# LiMR

Supports **emphasis**, tables, code, and $x^2$.

## References

Read this passage<ref id="guide" />.

<citation id="guide" title="Guide" url="https://example.com/guide" />\`;

export function Article() {
  return <Reader source={source} theme="auto" />;
}
\`\`\`

Wide containers show contents, body, and annotations. Below \`sidebarBreakpoint\` (1120px by default), annotations use an overlay. Contents become a collapsible list on narrow screens.

Typography defaults to \`standard\`; \`knuth-plass\` and \`justify\` are also available, as shown in [integration](integration.md). Defaults include Mermaid, nested callouts, \`==highlights==\`, and footnote cards; do not append duplicate modules. See [built-in modules](modules.md).

## Body only

\`\`\`tsx
import { Markdown } from '@linloir/limr';
import '@linloir/limr/styles/base.css';

export function Excerpt() {
  return <Markdown source="Some **Markdown**." />;
}
\`\`\`

Standalone \`Markdown\` retains parsing and selection support but does not mount a toolbar. Set \`interactive={false}\` to disable selection tracking for static content. Inside a \`DocumentProvider\`, use \`<Markdown />\` without \`source\` to share its document.

## Choose styles

| Import | Includes |
| --- | --- |
| \`@linloir/limr/styles.css\` | Default theme, layout, interaction, and Maple code fonts |
| \`@linloir/limr/styles/base.css\` | The same styling without importing Maple font CSS |
| \`@linloir/limr/fonts.css\` | Maple fonts only, for separate use with base.css |
| \`@linloir/limr/math.css\` | KaTeX styles and local math fonts |

Choose either styles.css or styles/base.css. Selecting base does not remove font files from the npm download. Body fonts come from the host or system; the Playground's Noto Serif SC is not automatically loaded by the library.

## Next steps

- Read [default syntax](syntax.md) to distinguish built-in content modules from application annotation plugins.
- Read [application integration](integration.md) for streaming, scroll containers, and SSR.
- Install the [limr-use Skill](ai-skills.md) for AI-assisted integration.
`,iO=`# Application integration

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/integration) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/integration.md)

## Choose a component

Use \`Reader\` for the complete experience and \`Markdown\` for standalone content. For a custom layout, one DocumentProvider manages one primary Markdown plus its navigation, cards, and toolbar. Passing source to Markdown inside a provider creates an independent document instead of sharing the parent state.

## Streaming content

\`\`\`tsx
import { Markdown } from '@linloir/limr';

export function StreamingAnswer({ answer, generating }: {
  answer: string;
  generating: boolean;
}) {
  return <Markdown source={answer} streaming={generating} followOutput />;
}
\`\`\`

The application owns transport and appends each chunk to the complete answer. Do not pass only the newest chunk as source. The final update must set streaming to false to finalize syntax and semantics. Finalization can reuse stable prefixes; definition changes and other global dependencies may still require a full parse. followOutput follows only while the reader remains near the bottom. The core engine supports append(chunk) / finish(); React props take the accumulated string.

New text and special blocks fade through opacity by default, without replaying the entrance when a paragraph finishes. Use \`streamEffect={false}\` to disable it or supply \`className\`, \`keyframes\`, and \`timing\`; reduced-motion preferences take precedence. Unclosed modules can show loading states while code/math render progressively. Reuse \`children\`, \`renderChildren\`, and \`renderValue\` to preserve controls and selections. See [extensions](extensions.md).

## Paragraph typography

\`\`\`tsx
import { useState } from 'react';
import { Reader, type TypographyMode } from '@linloir/limr';

export function TypographyReader({ source }: { source: string }) {
  const [mode, setMode] = useState<TypographyMode>('standard');
  return <>
    <select aria-label="Typography" value={mode}
      onChange={event => setMode(event.target.value as TypographyMode)}>
      <option value="standard">Standard</option>
      <option value="knuth-plass">Knuth–Plass</option>
      <option value="justify">Justified</option>
    </select>
    <Reader source={source} typography={mode} />
  </>;
}
\`\`\`

\`standard\` is the default; \`justify\` uses browser justification; \`knuth-plass\` enables the paragraph optimizer. \`knuthPlass\` configures TeX parameters and hyphenation. Streaming tails participate in KP once stable. See [styles](styles.md) and [performance](performance.md) for behavior and measurement boundaries.

## Nested scroll containers

\`\`\`tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function ScrollPanel({ source }: { source: string }) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setScrollRoot} style={{ height: '80vh', overflowY: 'auto' }}>
    <Reader source={source} scrollRoot={scrollRoot} scrollOffset={32} />
  </div>;
}
\`\`\`

Window scrolling needs no scrollRoot. Set scrollOffset for a fixed header and --limr-sticky-top for sticky navigation. Give Reader a new React key when switching to an independent document, plus a stable documentId unique on the page, to recreate task and interaction state.

## Custom composition

This is a fixed desktop layout. Prefer Reader for responsive sidebar switching, collapsible contents, and automatic height. With your own breakpoints, decide when to mount the sidebar or overlay.

\`\`\`tsx
import { DocumentProvider, Markdown, TableOfContents, AnnotationSidebar,
  SelectionToolbar } from '@linloir/limr';

export function DesktopReader({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr) 280px', gap: 24 }}>
      <TableOfContents style={{ position: 'sticky', top: 24, alignSelf: 'start', maxHeight: '80vh' }} />
      <main className="limr-reader-content" style={{ minHeight: '70vh', overflow: 'clip' }}>
        <Markdown />
      </main>
      <AnnotationSidebar />
    </div>
    <SelectionToolbar />
  </DocumentProvider>;
}
\`\`\`

Keep body and synchronized sidebar in the same scroll container and unscaled coordinate system. A grid row or the host supplies sidebar height. Do not grow the page to the total card height or add a separate scroll container to the synchronized list. Long card bodies can scroll independently. For a drawer or ordinary list, use AnnotationSidebar with sync="none" and let the host constrain height and overflow.

For an overlay layout, mount Markdown, AnnotationOverlay, and SelectionToolbar under the same provider. The two floating components accept portalRoot; Reader does not expose that prop directly, so compose components when it is needed.

## Controlled data and document switching

\`\`\`tsx
import { useState } from 'react';
import { Reader, type Annotation } from '@linloir/limr';

export function SavedArticle({ id, source }: { id: string; source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader key={id} documentId={id} source={source}
    annotations={annotations} onAnnotationsChange={setAnnotations} />;
}
\`\`\`

This illustrates state for one article. In an application, load/store annotations by article ID and replace the array on navigation; a React key does not clear host state. Omit annotations for internal state. When supplied, accept edits through onAnnotationsChange and pass the new array back, or editing throws. Do not mutate arrays or data in place. See [annotations and selection](annotations.md) for persistence and relocation rules.

## Global translation mode

\`\`\`tsx
import { useState } from 'react';
import { Reader, type TranslationMode } from '@linloir/limr';

export function BilingualArticle({ source }: { source: string }) {
  const [mode, setMode] = useState<TranslationMode | undefined>();
  return <Reader source={source}
    parameters={{ translationMode: mode, onTranslationModeChange: setMode }} />;
}
\`\`\`

Parameters update views without reparsing. Other plugins can register parameters as described in [extension development](extensions.md).

## SSR and client boundaries

Place interactive components inside your framework's client component boundary (for example, 'use client' where required) and let the framework arrange SSR/hydration. Avoid window/document at module initialization. Keep initial source, documentId, and configuration consistent between server and client.

Synchronous SSR falls back to formula source until math is loaded. To include complete KaTeX output in the first HTML, preload it on the server:

\`\`\`tsx
import { renderToString } from 'react-dom/server';
import { Markdown, preloadMath } from '@linloir/limr';

export async function renderArticle(source: string) {
  await preloadMath();
  return renderToString(<Markdown source={source} documentId="server-article" />);
}
\`\`\`

React streaming SSR can also handle Suspense. Shiki adds highlighting on the client; SSR already includes code text. Mermaid emits a loading state on the server and fades in after client rendering. KP measures fonts and typesets on the client; SSR retains ordinary text layout. Annotation load requests start when a card is shown on the client. Put preloaded data in annotation.data if needed. The host must still serve CSS and fonts.

## Existing plugins and themes

Import a factory from a real plugin package and create a stable plugins array outside rendering or with useMemo. Import plugin CSS explicitly as documented by its author. Themes are selected with appearance, not passed through plugins. See [plugin packages](plugin-packages.md) for installation and local tgz consumption.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Missing layout or malformed formulas | Import styles or base, plus math.css |
| Default modules disappear after adding a plugin | Use plugins to append, rather than replacing extensions |
| Annotation edits do not persist | Return a new array from the controlled callback |
| Body and navigation disagree | A Markdown source prop may have created a second provider |
| Nested scrolling targets the wrong place | Pass the actual scrolling DOM element as scrollRoot |
| Portal colors differ from the reader | Scope CSS by data-limr-appearance |
| Streaming repeatedly reparses everything | Keep extensions/plugins stable and check document-scoped transforms |
`,aO="# Built-in modules\n\n> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/modules) for the best reading experience.\n\n[Documentation](README.md) · [简体中文](../zh-CN/modules.md)\n\n## What is a module?\n\nLiMR's base parser understands CommonMark: headings, paragraphs, lists, links, images, and code fences. A **module** is a configuration object that adds capabilities, such as formulas, video rendering, or citation cards. Its public TypeScript type is `RendererExtension`, so the API also calls it an extension.\n\nA module can combine parsing rules, React components, annotation types, toolbar actions, and default parameters. It need not include all of them. For example, `math` adds formula syntax and rendering, `code-highlight` colors existing code fences, and `citation` provides both reference syntax and annotation cards.\n\nA **plugin** usually means a module added by your application or supplied by a third-party package. It uses the same interface as built-in modules. An npm package distributes code and can export several modules. Passing a module to `plugins` appends it to the existing configuration.\n\n## Functions, module names, and tag names\n\nConsider video:\n\n```tsx\nimport { Reader, standard, replaceExtension, video } from '@linloir/limr';\n\nconst videoModule = video({ loading: 'click' });\n// videoModule.name === 'video'\nconst extensions = replaceExtension(standard(), videoModule);\n\nexport function Article() {\n  return <Reader extensions={extensions} source={'<video src=\"/lesson.mp4\" />'} />;\n}\n```\n\n| Form | Where it belongs | Meaning |\n| --- | --- | --- |\n| `video` / `video(...)` | Application JavaScript / TypeScript | The imported function / a call that creates a module configuration object |\n| `videoModule` | Application code | Your variable name for that object; you can rename it |\n| `'video'` | The module object's `name` property | A stable identifier used to distinguish, replace, and remove modules |\n| `<video … />` / `<md-video … />` | Markdown content | Two tags registered by the module, using the same video renderer |\n| `::video{…}` | Markdown content | A registered directive; a `:::video` container also works |\n\nThe names need not match. The code-highlighting factory is `codeHighlight()`, its module name is `'code-highlight'`, and its content uses ordinary code fences without a `<code-highlight>` tag. Writing `video()` or the string `'video'` inside Markdown does not enable a module. Pass the returned object to `plugins`, not a string.\n\n`video({ loading: 'click' })` sets module defaults for that Reader. A `<video loading=\"eager\" … />` tag overrides the setting for one video. Available options vary by module; see [default syntax](syntax.md).\n\n## Default modules included with LiMR\n\nThese modules ship in `@linloir/limr`; no separate npm installations are required. `standard()` returns the following module objects with their default settings.\n\n| Factory function | Object's `name` | Capability and content syntax |\n| --- | --- | --- |\n| `gfm()` | `gfm` | Tables, `~~strikethrough~~`, tasks, autolinks, `[^id]` footnote parsing |\n| `math()` | `math` | `$…$` inline and `$$…$$` display math; also import math.css |\n| `codeHighlight()` | `code-highlight` | Shiki colors for code fences with a language identifier |\n| `definition()` | `definition` | `<definition>` cards with a title and Markdown body |\n| `question()` | `question` | `<question>` exercises with choices, hints, answers, and local scoring |\n| `extras()` | `extras` | `<extras>` / `<extra>` further-reading links |\n| `video()` | `video` | `<video>` / `<md-video>` native video, YouTube, and Bilibili embeds |\n| `figures()` | `figures` | `<figures>` / `<figure>` responsive groups, single figures, and captions |\n| `citation()` | `citation` | `<citation>` source definitions and `<ref>` markers with cards |\n| `translations()` | `translations` | `<translations>` original, translated, and parallel views |\n| `mermaid()` | `mermaid` | Mermaid fences / `::mermaid`, image/source, zoom and copy |\n| `callout()` | `callout` | Obsidian callout types, aliases and nested quotes / `::callout` |\n| `inlineHighlights()` | `inline-highlights` | `==text==` and `::highlight`, blue read-only highlights |\n| `footnotes()` | `footnotes` | `[^id]` / `^[body]`, comment markers and cards; `::footnote` / `::footnote-ref` |\n\nImport these functions from `@linloir/limr` or `@linloir/limr/extensions`. `standard()` is a convenience function returning an array, not an additional module.\n\n`Reader`, standalone `Markdown`, and `DocumentProvider` automatically use `standard()` when `extensions` is omitted. Your first `<Reader source={source} />` therefore supports these capabilities. Components inside a shared Provider inherit its configuration. Core-only `createDocument()` starts with CommonMark; extensions must be explicit, and it does not display React UI.\n\nHighlight, copy, and annotation deletion are built-in toolbar actions. Default modules recognize `==text==` and Markdown footnotes. Source-authored highlights offer copying but no toolbar editing. The Playground's editable margin notes, reading notes, questions, footnote annotations, and simulated assistant come from example plugins and **are not automatically installed in every Reader**. The `question()` exercise module is also separate from question annotations.\n\n## Choosing a configuration\n\nYou do not need to call `standard()` when the defaults suffice. For customization, distinguish three operations:\n\n| Goal | Configuration | Result |\n| --- | --- | --- |\n| Add your own capability | `plugins={[myPlugin]}` | Keep default modules and append your plugin object |\n| Keep only selected capabilities | `extensions={[gfm(), math()]}` | Replace the complete default module list; CommonMark remains available |\n| Configure a built-in module | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | Replace video by module `name`, preserving the other modules |\n\nTo remove one module, filter the array: `standard().filter(module => module.name !== 'video')`. Use `extensions={[]}` when extension syntax is unnecessary.\n\nDo not append `plugins={[video()]}` while the default video module is present: duplicate module names, tags, or directives throw. Without the corresponding module, unknown tags render as text, unknown directives may retain only their inner Markdown, and unknown annotation data remains with generic fallback UI. See [architecture and behavior](architecture.md) for the precise boundaries.\n\nNext, try the [syntax examples](syntax.md), create modules with [extension development](extensions.md), or distribute them using [plugin packages](plugin-packages.md).\n",rO=`# Performance and limits

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/performance) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

The first sections retain the repository's **2026-10-12 historical measurements** for comparison. The **2026-10-13** section below records this optimization's measurements. Neither set is a performance guarantee.

Environment: Intel Core i7-13700, WSL2/Linux, Node 20.19.5, Chromium 156.0.8078.4, React 19 production. Baseline: react-markdown 10.1.0 + remark-gfm 4.0.1.

## Browser

Both render equivalent GFM with the same typography, body only, excluding Reader navigation/sidebar. Values are medians of three isolated pages after warmup and font readiness, alternating renderer order. Timing includes synchronous React commits and forced layout, excluding network, asynchronous heavy resources, and idle frame time.

| Scenario | LiMR | react-markdown |
| --- | ---: | ---: |
| 87,381 characters, 200 sections, initial mount | 126.1 ms | 134.0 ms |
| 877,782 characters, 2,000 sections, initial mount | 1,345.4 ms | 1,437.6 ms |
| 34,860 characters, 138 streaming commits, total synchronous time | 306.1 ms | 1,864.1 ms |
| Same stream, per-commit P95 | 2.9 ms | 23.7 ms |

The final full parse is included. P95 does not mean every frame stays below 16ms. Raw data: [browser.json](../../benchmarks/results/browser.json).

## Selection and SSR

Historical long-document selection paint latency P95 was 25.2–28.5ms; code was 18.9–19.4ms. This measures selectionchange to paint-layer updates, not hardware input-to-display latency. The same automated drag took 3.23s in LiMR and 1.52s in the baseline; similar rAF intervals do not imply identical processing cost. Data: [selection.json](../../benchmarks/results/selection.json).

| Node scenario | LiMR | Baseline |
| --- | ---: | ---: |
| 87,381 characters, SSR | 123.85 ms | 135.80 ms |
| 877,782 characters, SSR | 5,508.29 ms | 2,720.70 ms |
| 34,860 characters, 137 core appends/finalization | 164.04 ms | 2,673.74 ms |

Large-document SSR varied substantially: LiMR samples were 2.64–9.10s and baseline 2.70–5.03s. These results show no SSR advantage. The append baseline reparses the entire prefix each time. Data: [node.json](../../benchmarks/results/node.json).

## Practical limits

Keeping the full DOM supports search, selection, and printing, but initial long-document rendering still costs time. Incremental parsing reuses stable prefixes; long tail blocks, document-scoped transforms, definition changes, middle edits, and finalization can remain expensive. Keep extensions/plugins stable and limit highlighting languages/length when appropriate.

The historical measurements above exclude full Reader layouts; the newer KP comparison below includes one complete Reader workload. Neither set covers large formula collections, Shiki cold starts, arbitrary dense annotations/plugins, or physical mobile devices. Installed font size also differs from browser transfers; see [styles and fonts](styles.md).

## Reproduce in the repository

\`\`\`sh
NODE_ENV=production pnpm bench
pnpm exec vite build
pnpm exec vite preview --host 127.0.0.1 --port 4174
# In another terminal:
pnpm bench:browser
pnpm bench:selection
\`\`\`

Avoid concurrent builds/benchmarks. Scripts write benchmarks/results. Reevaluate using your hardware, content, and built version rather than treating historical numbers as current-package acceptance.

## 2026-10-13: streaming and layout measurements

This compares the working implementation with pre-change commit \`ebab991\` in one process, using the same dependencies, UTF-16 input and chunk boundaries. Five warmed trials alternate order; values are the sample with median total time. Core append and finalization only: React, layout, async highlighting and network are excluded. Environment and raw samples: [streaming.json](../../benchmarks/results/streaming.json).

| Scenario | Characters | Before total | After total |
| --- | ---: | ---: | ---: |
| GFM | 34,860 | 139.22ms | 89.07ms |
| Default modules | 34,860 | 141.40ms | 94.63ms |
| Growing code fence | 43,209 | 1335.87ms | 29.05ms |
| Single long paragraph | 7,840 | 72.43ms | 74.32ms |

Changes include incremental line indexes, cached semantic facts for retained nodes, local finalization, an append path for growing code fences, and lazy code character maps. Complex growing paragraphs still need reparsing. Differences for a single long paragraph are small and subject to runtime variance; these results do not establish equal improvements for all content.

Run \`pnpm bench:streaming\` to measure the current core. For the alternating comparison, set \`LIMR_BENCH_BASELINE\` to a separate untouched checkout of \`ebab991\`, with the same dependencies available there. The script writes \`benchmarks/results/streaming.json\`; it does not recreate the historical hardware or timings.

Production Chromium 156, including synchronous React commits, forced layout, default typography and increment animations: a 34,860-character stream with default modules had **3.9ms P95**, 7.3ms maximum; a 43,211-character code stream had **2.6ms P95**, 12.4ms maximum. Three isolated font-ready pages per scenario, 256-character chunks; idle rAF time and async highlighting excluded. No old-browser-implementation comparison was made, and this is not physical-device input-to-display latency. Data: [streaming-browser.json](../../benchmarks/results/streaming-browser.json).

KP has a separate production benchmark using the complete scikit-learn Playground, including its TOC, sidebar and annotations. Three fresh pages per mode run three downward/upward sweeps each, then 32 viewport changes across 1100–1420px. The first sweep includes newly visible paragraphs; later sweeps reuse their typesetting. The table pools 1,080 scroll samples and 96 resize samples per mode, without CPU throttling.

| Measurement | Standard | Knuth–Plass |
| --- | ---: | ---: |
| Scroll median / P95 / maximum | 16.6 / 17.0 / 18.5ms | 16.6 / 19.8 / 46.5ms |
| Resize median / P95 / maximum | 11.2 / 24.1 / 31.9ms | 17.7 / 41.6 / 49.9ms |
| Scroll samples over 50ms | 0 / 1,080 | 0 / 1,080 |
| Resize samples over 50ms | 0 / 96 | 0 / 96 |

Source anchor lookup prunes unrelated source bindings and stops at the first visible character, avoiding a full KP DOM traversal for every sidebar item.

Scroll timings span \`scrollTo\` through the next rAF; resize timings include the viewport update, protocol overhead and the next rAF. KP still costs more during resizing, but this run did not reproduce the earlier long stalls. These are local Chromium measurements, not physical-device input latency or a guarantee for arbitrary plugins. Raw samples and exact boundaries: [layout.json](../../benchmarks/results/layout.json).

\`\`\`sh
pnpm build:playground
pnpm preview:playground --port 4174
# In another terminal, with no concurrent build or test:
pnpm exec tsx benchmarks/layout.ts
BENCH_URL=http://127.0.0.1:4174/LiMR pnpm exec tsx benchmarks/streaming-browser.ts
\`\`\`

Preparation caches font measurements, hyphenation, legal breakpoints and prefix sums independently of line width. Rendering uses a word-spacing run per line instead of an element per space. Width changes patch glue in place when the breaks match, or reuse text containers when they change. A shared synchronous measurement Range avoids retaining thousands of live ranges across DOM mutations. Highlight geometry is cached in paragraph coordinates, adjacent KP paint fragments merge into lines, and paint writes do not force a layout per rectangle. Viewport-mask coordinates do not inherit into the article. Scrolling retains typeset nodes and does not rerun the paragraph solver.
`,oO=`# Plugin packages

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/plugin-packages) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/plugin-packages.md)

A plugin exports a factory returning RendererExtension. Consumers append it through plugins. One package can provide syntax, annotations, actions, and parameters, with a separate CSS export, without editing LiMR itself.

## Copyable starter

The complete [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md) includes TypeScript, declaration output, CSS, package.json, and tsup configuration. It demonstrates a reading-tip block, an example:note card, and a save-selection action.

After installing LiMR, run from your application:

\`\`\`sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
\`\`\`

In a source checkout, use skills/limr-plugin-development/assets/plugin-template. Replace the @example name, extension/type/action IDs, and implement your data/UI. The starter's private: true prevents accidental publication under an example name and still permits local packing.

## Package contract

| Field | Requirement |
| --- | --- |
| type | module |
| exports["."] | import points to ESM; types points to .d.ts |
| exports["./styles.css"] | Explicit export when the plugin needs CSS |
| files | Built output and usage instructions |
| sideEffects | ["**/*.css"] to retain imported styles |
| peerDependencies | @linloir/limr and react; add react-dom when directly using it |
| Build external | LiMR, React, react/jsx-runtime, and any React DOM entry used |

Bundling another copy of LiMR or React breaks shared contexts/hooks. Externalize host dependencies and avoid internal deep imports. Ship parameter declaration merging with exported types.

## Import into an application

The @example package below is the starter, not a published npm package. Install the generated local archive; use the actual filename printed by npm pack:

\`\`\`sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
\`\`\`

\`\`\`tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: 'Reading note' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
\`\`\`

Use the real name and peer version requirements for a third-party package. Replace default modules through extensions + replaceExtension; do not register the same tag twice. Hosts still configure fonts, math CSS, persistence, and application services.

## Validate distribution

After type checking, install the actual tgz into an independent consumer. Check public imports, SSR, CSS resources, preserved defaults, and new interactions. Packages supporting React 18/19 should verify both. Syntax plugins should compare finalized streams with one-shot parsing. Interactive plugins should cover desktop sidebars, narrow overlays, keyboard behavior, cancellation, and both themes.

The repository also includes packable [reading-tools](../../examples/packages/reading-tools/index.js) and [paper-theme](../../examples/packages/paper-theme/index.css) examples. The [plugin development Skill](ai-skills.md) includes a portable template and references that do not require this repository.
`,lO=`# Styles and fonts

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/styles) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/styles.md)

## Base styles and themes

Default rules live in @layer limr, so ordinary host CSS can override them. Choose styles.css (with Maple) or styles/base.css (without loading Maple), and add math.css for formulas.

\`\`\`tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles/base.css';
import './paper.css';

export function Paper({ source }: { source: string }) {
  return <Reader source={source} appearance="paper" theme="auto" />;
}
\`\`\`

Example paper.css:

\`\`\`css
[data-limr-appearance='paper'] {
  --limr-font-text: Georgia, 'Noto Serif SC', serif;
  --limr-content-width: 820px;
  --limr-accent: #8b6548;
}
[data-limr-appearance='paper'][data-limr-theme='dark'] {
  --limr-accent: #d1ab84;
}
\`\`\`

appearance propagates to portalled controls. Do not rely only on .limr-reader ancestry. theme: auto selects built-in colors with the system preference; custom dark overrides for auto also need a prefers-color-scheme media rule. See the standalone [paper-theme](../../examples/packages/paper-theme/index.css) example.

## Common variables

| Variable | Purpose |
| --- | --- |
| --limr-font-text / --limr-font-code | Body / code fonts |
| --limr-font-size / --limr-line-height | Base typography |
| --limr-font-features | Defaults to normal, preserving full-width Chinese punctuation; opt into 'palt' 1 for proportional spacing |
| --limr-punctuation-spacing | Defaults to space-all, preserving full-width spacing between CJK punctuation |
| --limr-emphasis-spacing / --limr-list-item-gap | Trailing emphasis / list spacing |
| --limr-text / --limr-heading / --limr-secondary / --limr-muted | Text hierarchy |
| --limr-background / --limr-surface / --limr-border | Backgrounds and borders |
| --limr-link / --limr-accent / --limr-selection | Links, active state, selection |
| --limr-content-width / --limr-reader-width | Body / overall width; default 900px / 1800px |
| --limr-toc-width / --limr-sidebar-width / --limr-column-gap | Side column widths and gaps |
| --limr-sticky-top | Sticky offset |
| --limr-reader-bottom-space / --limr-reader-min-height | Short-document height and bottom space |
| --limr-sidebar-padding-inline / --limr-sidebar-reference-gap | Shared padding (10px) and reference separation (1px) |
| --limr-overlay-duration / --limr-overlay-morph-duration | Enter/exit (560ms), preview/expanded morph (480ms) |
| --limr-overlay-z / --limr-toolbar-z | Floating control stacking |
| --limr-overflow-fade-size | Overflow fade, default 24px; 0px disables |
| --limr-toolbar-panel-max-height | Maximum toolbar panel height |
| --limr-tool-icon-size / --limr-mark-size | Toolbar icons / inline markers |
| --limr-mermaid-max-height | Diagram viewport maximum height; default min(70vh, 36rem) |
| --limr-mermaid-scrollbar | Thin diagram scrollbar color; default #87837866 |

--limr-toolbar-available-height, --limr-toolbar-panel-height, and --limr-toc-available-height are runtime measurements, not theme inputs. AnnotationType.sidebar usually supplies local card colors; see [extensions](extensions.md).

## Fonts and package size

Local WOFF2 subsets of Maple Mono NF CN v7.9 ship in the package under the derivative name LiMR Maple Mono NF CN, with the OFL license. unicode-range and font-display: swap limit runtime requests, but the complete font assets still occupy about 31MB. base.css avoids browser loading, not npm installation size.

Body text does not automatically load Chinese fonts. Use system fallbacks, self-hosted fonts, or a host-chosen service. The Playground's Noto Serif SC belongs to the demo. No font should be assumed to cover every script.

Default font/math styles do not require a third-party CDN. Hosts can apply long-lived immutable caching to hashed font URLs; the library cannot set server HTTP headers. Remote image/video/plugin requests depend on content and host configuration.

## Layout and interaction conventions

The reading region determines synchronized sidebar height; do not size the page to all cards combined. Modules own content while the shared layout owns references, summaries, and card shells. Avoid duplicate padding or empty-paragraph compensation. Expanded cards animate from preview geometry; reduced-motion preferences disable motion.

Dense footer references borrow spare space above them at rest. Hovered or active items take alignment priority, allowing neighboring items to clip at the edges. Marker hover can compress the optional summary to leave room for the reference and heading. Expanded content is bounded by the visible reading region and scrolls within its card. Packed sidebar items still align the prose on hover. Deactivation smoothly restores the resting layout using current card heights, \`--limr-motion-slow\`, and \`--limr-ease\`, preserving gaps and page height.

Selection retains native browser ranges and keyboard behavior. Paint layers calculate visible fragments only. Code allows partial highlights, math is atomic, and image highlights use borders. A single atomic block anchors its toolbar below the block. Printing hides paint layers while keeping document content. Mobile automation does not certify native iOS/Android handles or physical-device behavior.

Selection-toolbar copy feedback crossfades with a small scale change. Its label width grows and shrinks to the active face with nonlinear easing through \`--limr-ease\`; reduced-motion preferences remove these transitions.

Mermaid diagrams support drag panning, native touch/trackpad scrolling, arrow keys, Page Up/Down, Home/End, and Shift+wheel for horizontal movement. Click or Enter selects the whole block; dragging never selects its internal labels. Zoom scrolls inside the bounded viewport. The shared glass toolbar appears on hover/focus (always on touch screens); button feedback fades its background without scaling. Source mode keeps ordinary top padding. Themes and plugins can override the diagram height and scrollbar variables on the Reader or block.

## CSS-only themes

Export CSS, include it in files, and mark sideEffects as ["**/*.css"]. A theme does not need React or parser runtime dependencies. Scope rules to an appearance name and check light, dark, auto, portals, and two differently themed readers on the same page.

Expanded toolbar panels use the full available toolbar width. The action row and available viewport determine its width; expanded content does not contribute intrinsic width or enlarge the toolbar. Highlight options use intrinsic text widths and wrap as whole items, aligned to the start. Multiline underlines need an inner inline span rather than a direct flex child.

## Paragraph layout and streaming

\`typography="standard"\` is the default. \`justify\` uses browser justification. \`knuth-plass\` uses TeX's box/glue/penalty dynamic program: four fitness classes, integer badness, squared penalties, consecutive/final hyphen demerits, pretolerance, tolerance and emergency passes. It optimizes the whole paragraph without a beam or paragraph-length cutoff. Default English hyphenation uses Knuth–Liang patterns; Unicode break opportunities also support Chinese punctuation. Browser font shaping remains authoritative, so this does not promise pixel-identical TeX PDF output.

\`knuthPlass\` accepts \`pretolerance\`, \`tolerance\`, \`linePenalty\`, \`hyphenPenalty\`, \`adjacentDemerits\`, \`doubleHyphenDemerits\`, \`finalHyphenDemerits\`, \`emergencyStretch\` (CSS pixels), \`looseness\`, and \`hyphenate\` (\`false\` or a function returning the word's parts). Core defaults follow TeX's usual paragraph parameters, with 16px of emergency stretch. The browser adapter instead derives 3em from the font size for break scoring only; an explicit \`knuthPlass.emergencyStretch\` overrides it. \`pretty\` and \`normal\` remain optional legacy CSS modes.

KP loads lazily and typesets stable paragraphs near the viewport. It retains their DOM when they leave the viewport, reuses measured items and prefix sums for width changes, and preserves native selections before updating text. During shrink, offscreen cached lines clip horizontal overflow until their queued exact layout is ready; an actively selected paragraph temporarily wraps while keeping its native range. Active streaming tails use normal wrapping until stable. Layout never changes original source text, annotations or copy output. See [performance](performance.md) for measured scroll/resize comparisons and [TeX's source](https://github.com/TeX-Live/texlive-source/blob/trunk/texk/web2c/tex.web) for the underlying paragraph model. The separation of preparation and layout also follows the incremental approach used by [Typst](https://github.com/typst/typst/tree/main/crates/typst-layout/src/inline).

Default loading rings use a fixed 32×32 view box, 22px display size, a thick track and an animated arc. Rotation and arc growth/shrink use nonlinear easing around one fixed center; color follows \`--limr-secondary\`. Streaming text and blocks fade from transparent to opaque, without a background tint or a second paragraph-completion entrance. Plugins can replace the shared effect through \`streaming.effect\`, and each Reader can override it through \`streamEffect\`.

Source-authored highlight blue is controlled by \`--limr-inline-highlight\`, or replace the module using \`inlineHighlights({ color })\`. Localize the read-only toolbar hint with \`locale.inlineHighlightHint\`.
`,sO=`# Default syntax

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/syntax) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/syntax.md)

**Modules** are configuration objects that add capabilities such as formulas, videos, or citations. A factory is called in application code to return an object; the module name is its \`name\` property, used for replacement and removal; tags and directives are the syntax written in Markdown. See [built-in modules](modules.md) for concepts and configuration.

The default modules below ship with \`@linloir/limr\`. \`Reader\`, standalone \`Markdown\`, and \`DocumentProvider\` enable all of them through \`standard()\` by default; core-only \`createDocument()\` starts with CommonMark. The following sections include source and rendered examples, using LiMR itself.

## Module catalog

| Factory (application code) | Module name (name) | Capability | Registered tags / directives |
| --- | --- | --- | --- |
| \`gfm()\` | \`gfm\` | Tables, strikethrough, tasks, autolinks, standard footnotes | \`::gfm\` |
| \`math()\` | \`math\` | Inline and display math | \`$…$\`, \`$$…$$\`, \`::math\` |
| \`codeHighlight()\` | \`code-highlight\` | Shiki fenced-code highlighting | Standard code fences, \`::code\` / \`::code-highlight\` |
| \`definition()\` | \`definition\` | Definitions | Tags / directives: definition, title, content |
| \`question()\` | \`question\` | Exercises and answers | Tags / directives: question and child names below |
| \`extras()\` | \`extras\` | Further reading | Tags / directives: extras, extra |
| \`video()\` | \`video\` | Native video, YouTube, Bilibili | Tags / directives: video, md-video |
| \`figures()\` | \`figures\` | Figure groups and captions | Tags / directives: figures, figure, figcaption, caption, img |
| \`citation()\` | \`citation\` | Reference definitions and markers | Tags / directives: citation, ref |
| \`translations()\` | \`translations\` | Original, translated, and parallel text | Tags and directives: translations, origin, translation |
| \`mermaid()\` | \`mermaid\` | Mermaid diagrams | Mermaid fences, \`::mermaid\` |
| \`callout()\` | \`callout\` | Typed, titled and collapsible quotes | \`> [!type]\`, \`::callout\` |
| \`inlineHighlights()\` | \`inline-highlights\` | Source-authored highlights | \`==text==\`, \`::highlight\` |
| \`footnotes()\` | \`footnotes\` | Comment markers and footnote cards | \`[^id]\`, \`^[body]\`, \`::footnote\`, \`::footnote-ref\` |

These are registered static tags in Markdown, not an arbitrary MDX/HTML execution environment. Use string attributes such as \`multi="true"\` and \`answer="[0,2]"\`. Do not use \`answer={[0,2]}\`, event functions, or spread attributes. Unregistered HTML is displayed as text; expressions are not executed and may produce diagnostics. Keep blank lines between block tags and their Markdown content.

## CommonMark and GFM

\`\`\`\`markdown
# Heading

**Bold**, *italic*, ~~deleted~~, [link](https://example.com), \`inline code\`.

> A blockquote, labelled Note by the default renderer.

- A list item
- [x] Complete
- [ ] Pending

| Name | Description |
| --- | --- |
| LiMR | Markdown renderer |

\`\`\`typescript
const value = 42;
\`\`\`

A standard footnote[^note].

[^note]: Footnote content in a sidebar or floating card.
\`\`\`\`

Rendered result (interactive where applicable):

#### Example heading

**Bold**, *italic*, ~~deleted~~, [link](https://example.com), \`inline code\`.

> A blockquote, labelled Note by the default renderer.

- A list item
- [x] Complete
- [ ] Pending

| Name | Description |
| --- | --- |
| LiMR | Markdown renderer |

\`\`\`typescript
const value = 42;
\`\`\`

A standard footnote[^syntax-note].

[^syntax-note]: Footnote content in a sidebar or floating card.

Default \`[^note]\` footnotes use markers and cards. Remove the \`footnotes\` module to restore traditional GFM endnotes. Ordinary Markdown supports \`![Description](/image.png)\`. Raw HTML is not passed through to the DOM. Register an extension or override \`components\` to customize rendering.

## Math and code

\`\`\`markdown
Inline: $E = mc^2$.

$$
\\int_0^1 x^2\\,dx = \\frac{1}{3}
$$
\`\`\`

Rendered result (interactive where applicable):

Inline: $E = mc^2$.

$$
\\int_0^1 x^2\\,dx = \\frac{1}{3}
$$

Import \`@linloir/limr/math.css\`. Configure formulas with \`math({ macros, strict })\`. Fenced language names select Shiki highlighting. Highlighting loads near the viewport; streaming code waits for closure and for native selections to leave before applying colors. Code over the default 100,000-character limit, unsupported languages, and languages outside the configured list retain readable source. Configure \`codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })\`.

## Definitions

\`\`\`markdown
<definition title="Entropy">

A measure of uncertainty: $H(X)$.

</definition>
\`\`\`

Rendered result (interactive where applicable):

<definition title="Entropy">

A measure of uncertainty: $H(X)$.

</definition>

Use child tags for rich titles and an explicit body:

\`\`\`markdown
<definition>

<title>**Entropy** / 熵</title>

<content>

The body supports Markdown.

</content>

</definition>
\`\`\`

The \`title\` attribute is text. Child tags support rich content. The directive form is \`:::definition{title="Entropy"}\`, closed by \`:::\`.

## Exercises

\`\`\`markdown
<question title="Which numbers are even?">

<question-content>Select all correct options.</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>Consider divisibility by 2.</question-hint>

<question-answer>2 and 4 are even.</question-answer>

</question>
\`\`\`

Rendered result (interactive where applicable):

<question title="Which numbers are even?">

<question-content>Select all correct options.</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>Consider divisibility by 2.</question-hint>

<question-answer>2 and 4 are even.</question-answer>

</question>

Answer indices are **zero-based**. \`multi\` is off by default. \`answer\` is a string containing a JSON array or a single index. Attributes on the selection group take precedence over question attributes. Hints and answers expand independently; configured answers enable submission, scoring, and retry. This module neither connects to AI nor creates question annotations.

## Further reading

\`\`\`markdown
<extras>

<extra title="Read more" url="https://example.com/article" desc="Background material." />

</extras>
\`\`\`

Rendered result (interactive where applicable):

<extras>

<extra title="Built-in modules" url="https://linloir.github.io/LiMR/#/docs/en/modules" desc="Background material." />

</extras>

\`extra\` uses \`title\`, \`url\`, and \`desc\`. Links pass through the built-in URL filter.

## Citation cards

\`\`\`markdown
One source<ref id="a" />, or several<ref ids='["a","b"]' />.

<ref id="a">Referenced **text**</ref>

<citation id="a" title="Source A" url="https://example.com/a" description="Full **Markdown** description." summary="Short collapsed summary." />

<citation cite-id="b" title="Source B" url="https://example.com/b" desc="Legacy attribute name." />
\`\`\`

Rendered result (interactive where applicable):

One source<ref id="a" />, or several<ref ids='["a","b"]' />.

<ref id="a">Referenced **text**</ref>

<citation id="a" title="Source A" url="https://example.com/a" description="Full **Markdown** description." summary="Short collapsed summary." />

<citation cite-id="b" title="Source B" url="https://example.com/b" desc="Legacy attribute name." />

Citation IDs use \`cite-id\`, then \`id\`. Descriptions use \`desc\`, then \`description\`. References use \`cite-from-ids\`, \`ids\`, then \`id\`, accepting JSON arrays or comma-separated strings. Definitions do not occupy body space, and multiple markers can reference one definition.

Citations do not expand into large cards by default; clicking pins the preview. Collapsed summaries fall back through \`summary → description → safe URL → title\`, with Markdown stripped. Card content uses description, then summary. Hovering or activating a reference temporarily highlights its nearest text block (paragraph, heading, list item, or table cell), without saving a highlight. External range annotations use their bound range. See [annotations and selection](annotations.md).

## Images, figures, and captions

\`\`\`markdown
<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="/figures/a.png" alt="Experiment A" caption="(a) Experiment A" />

<figure id="experiment-b">

![Experiment B](/figures/b.png)

<figcaption>**(b)** A Markdown caption.</figcaption>

</figure>

<figcaption>Figure 1 · Two experiments.</figcaption>

</figures>
\`\`\`

Rendered result (interactive where applicable):

<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="../assets/source.svg" alt="Experiment A" caption="(a) Experiment A" />

<figure id="experiment-b">

![Experiment B](../assets/rendered.svg)

<figcaption>**(b)** A Markdown caption.</figcaption>

</figure>

<figcaption>Figure 1 · Two experiments.</figcaption>

</figures>

A figure can stand alone. Supply an image through \`src\` / \`url\`, nested Markdown, or \`<img src="…" alt="…" />\`. Use one image per figure and figures for groups. Captions can use an attribute or figcaption / caption child tags; use children for rich text. \`id\` provides an in-page link target.

| Attribute | Default | Meaning |
| --- | --- | --- |
| \`min-width\` / \`min-height\` | 220 / 120 | Determines when another column fits; narrow containers take priority |
| \`max-width\` / \`max-height\` | 560 / 480 | Image bounds preserving aspect ratio; none / false removes a bound |
| \`columns\` / \`cols\` | Automatic | Requested columns, capped at 24 |
| \`rows\` | Automatic | Derives columns from image count when columns are omitted |
| \`responsive\` | true | Reduces explicit columns when space is insufficient; false keeps them |
| \`gap\` | 16 | Group gap in pixels |

Dimensions accept nonnegative numbers or px. Figures inherit group limits and can override them. Factory options use camelCase, such as \`figures({ maxHeight: 360, maxWidth: false })\`. Images retain their aspect ratio, and captions are not cropped. A single figure copies the image URL; a group copies Markdown source. Neither copies image bytes.

Directive example:

\`\`\`markdown
:::figures{columns="2"}
::figure{src="/a.png" caption="A"}
::figure{src="/b.png" caption="B"}
:::
\`\`\`

## Video

\`\`\`markdown
<video src="/demo.mp4" provider="native" title="Demo" />

<md-video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />

<video url="https://www.bilibili.com/video/BV1xx411c7mD/?p=2" />
\`\`\`

\`url\` takes precedence over \`src\`. \`provider\` defaults to auto and also accepts native, youtube, and bilibili. YouTube supports watch, short, embed, shorts, and live URLs with start times. Bilibili supports BV/av IDs and parts. Other attributes are title and loading.

**The default is \`loading="visible"\`**: the player mounts within 200px of the viewport without autoplay. click waits for a click; eager mounts immediately. Set a module default with \`video({ loading: 'click' })\`. Actual playback depends on the platform, network, and embedding permissions; local iframe tests do not guarantee remote playback. Use \`video({ resolveUrl })\` for a custom provider.

Click-to-load example (no player is created before clicking):

<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="Video example" />

## Translations

\`\`\`markdown
<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>
\`\`\`

Rendered result (interactive where applicable):

<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>

\`default\` accepts origin, translation, or both, defaulting to origin unless overridden by the factory's defaultMode. The marker cycles through these modes. Parallel mode shows the translation first. During streaming, an available side is shown while the other is missing. This module does not translate content automatically.

Global \`parameters.translationMode\` overrides individual blocks. Pass onTranslationModeChange to accept marker requests; without a callback, a global mode is locked. Setting it to undefined restores local choices. See [application integration](integration.md).

## Selection and replacement

Toolbar-authored highlights are annotations; source-authored \`==highlights==\` offer copying without editing. All registered default tags also support their matching \`::\` directive. Register plugins for custom tags. See [extension development](extensions.md) to select or replace default modules.

## Two-colon components

All default modules accept the [CoMark component form](https://comark.dev/syntax/components), including nesting, scalar attributes, and Markdown children:

\`\`\`md
::definition{title="A definition"}
**Rich** Markdown content.
::

::question{title="A question"}
::question-content
The prompt.
::
::question-answer
The answer.
::
::
\`\`\`

Names: \`gfm\`, \`definition\`, \`title\`, \`content\`, \`question\` and its existing child tags, \`extras\`, \`extra\`, \`video\`, \`md-video\`, \`figures\`, \`figure\`, \`figcaption\`, \`caption\`, \`img\`, \`citation\`, \`ref\`, \`translations\`, \`origin\`, \`translation\`, \`code\` (alias \`code-highlight\`), \`math\`, \`mermaid\`, \`callout\`, \`highlight\`, \`footnote\`, and \`footnote-ref\`. \`::code{lang="typescript"}\` and \`::math\` preserve their bodies literally. Standard Markdown fences, JSX, single-colon inline directives and existing triple-colon containers remain supported. An unpaired two-colon line in a finished document keeps its legacy leaf-directive meaning. This is component-syntax compatibility, not support for CoMark's YAML props, named slots or frontmatter.

During streaming, partial headers, links, inline code/emphasis/math delimiters and table headers are withheld until usable. Registered open components carry \`incomplete\`; the module chooses a loading view or progressive content. Code fences and display math can render before their closing delimiter. Set \`streaming={false}\` or call \`finish()\` to restore normal final Markdown interpretation. Source ranges always refer to the unmodified original input.

## Mermaid diagrams

\`\`\`\`markdown
\`\`\`mermaid
flowchart LR
  A[Start] --> B{Ready}
  B --> C[Read on]
\`\`\`
\`\`\`\`

\`::mermaid\` is also supported. Open streaming blocks show a loading ring; completed diagrams load asynchronously and fade into view. The math-style surface has one rounded toolbar for copying source, zooming in/out, and switching source/image views. Selection, highlights and markers treat the whole diagram atomically in both views. Mermaid uses strict mode without diagram interaction callbacks.

Rendered result:

\`\`\`mermaid
flowchart LR
  A[Start] --> B{Ready}
  B --> C[Read on]
\`\`\`

Drag to pan, or use arrow keys, Page Up/Down, Home/End and the wheel; Shift+wheel moves horizontally. Click or Enter selects the whole block with its selection toolbar below. Zoomed content scrolls within \`--limr-mermaid-max-height\`, defaulting to \`min(70vh, 36rem)\`. The diagram's own copy button copies its body; selection-toolbar and browser copying preserve the full fence or directive. See [styles](styles.md) and [atomic copying](annotations.md).

## Callouts and nested quotes

\`\`\`markdown
> [!tip]+ Custom title
> A useful hint.
>
> > An ordinary nested quote.
> >
> > > [!warning]- Collapsible reminder
> > > With **Markdown** content.
\`\`\`

Default types are \`note\`, \`abstract\`, \`info\`, \`todo\`, \`tip\`, \`success\`, \`question\`, \`warning\`, \`failure\`, \`danger\`, \`bug\`, \`example\`, and \`quote\`. Obsidian aliases are supported: summary/tldr, hint/important, check/done, help/faq, caution/attention, fail/missing, error, and cite. Types are case-insensitive; unknown names use note styling. \`+\` starts expanded, \`-\` starts collapsed, and no sign creates a regular block. The equivalent component is \`::callout{type="tip" title="Title" fold="-"}\`.

Rendered result; expand the nested reminder:

> [!tip]+ Custom title
> A useful hint.
>
> > An ordinary nested quote.
> >
> > > [!warning]- Collapsible reminder
> > > With **Markdown** content.

## Source highlights and footnotes

\`\`\`markdown
==A blue highlight== offers copying without editing.

==A named note==[^note]

==An inline note==^[With **Markdown** content.]

[^note]: Footnote content.

    A second paragraph.
\`\`\`

Highlights preserve rich inline formatting. Escaped punctuation, code and math do not create highlights. Override the blue through \`--limr-inline-highlight\` or \`inlineHighlights({ color })\`. Their toolbar contains only a copy button and a single-line, left-aligned read-only hint.

Footnotes use rounded comment markers, sidebar items on wide readers, and floating cards on narrow readers. Adjacent footnotes reference precisely the highlighted text; standalone markers reference their paragraph. Named definitions can be reused. \`::highlight\`, \`::footnote{id="note"}\`, and \`::footnote-ref{id="note"}\` provide component forms. Removing the \`footnotes\` module restores GFM superscripts and endnotes.

Rendered result; click a highlight or comment marker:

==A blue highlight== offers copying without editing.

==A named note==[^syntax-source-highlight]

==An inline note==^[With **Markdown** content.]

[^syntax-source-highlight]: Footnote content.

    A second paragraph.
`,uO=`# 中文文档

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/README) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/README.md)

这套文档对应当前仓库实现，包含本次新增的流式、排版与模块能力；使用 npm 包时请核对安装版本的导出与类型。默认入口为中文，英文页面与本目录一一对应。

| 你要做什么 | 阅读文档 |
| --- | --- |
| 安装并显示第一篇文档 | [快速开始](getting-started.md) |
| 了解模块、默认包含的能力与配置方式 | [内置模块](modules.md) |
| 编写 Markdown、Mermaid、callout、高亮、脚注与双冒号组件 | [默认语法](syntax.md) |
| 集成到 React、选择排版模式、接收流式输出、自定义布局或 SSR | [项目集成](integration.md) |
| 保存选区、高亮、引用和自定义标注，理解整体复制 | [标注与选区](annotations.md) |
| 新增语法、卡片、选区动作、流式效果或按条件替换组件 | [扩展开发](extensions.md) |
| 开发独立 npm 插件并在应用中引入 | [插件模块包](plugin-packages.md) |
| 调整主题、字体、KP 排版、动画与图表样式 | [样式与字体](styles.md) |
| 查询组件 props、hooks 和核心 API | [API 参考](api.md) |
| 理解解析、状态和资源边界 | [架构与行为](architecture.md) |
| 了解性能数据和验证范围 | [性能与限制](performance.md) |
| 让 AI 使用 LiMR 或开发插件 | [AI Skills](ai-skills.md) |

先接入 \`Reader\`，需要定制布局时再拆分组件；需要应用功能时优先添加插件。Playground 中的本地保存、导入导出和模拟问答是演示应用功能，不是 Reader 自带的服务。

Playground 默认使用标准排版，可从菜单切换 Knuth–Plass 或两端对齐；流式演示已放慢。刷新会重新打开默认文档，不自动恢复上次的文章或编辑；显式保存的草稿可手动加载，语言偏好独立保留。Docs 链接支持直接打开指定页面，页内切换 Docs / Playground 保留本次会话中的编辑。

[返回 README](../../README.md) · [在线 Playground](https://linloir.github.io/LiMR/)
`,cO=`# AI Skills：下载、导入与使用

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/ai-skills) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/ai-skills.md)

Skills 是指导 AI 工作的文件包，不是运行在 Reader 中的 RendererExtension，也不是模型服务。安装 Skill 不会自动修改项目、安装插件或连接 AI API。

| Skill | 适用任务 |
| --- | --- |
| [limr-use](../../skills/limr-use/SKILL.md) | 接入 LiMR、选择组件、编写语法、配置标注/流式/主题、引入已有插件 |
| [limr-plugin-development](../../skills/limr-plugin-development/SKILL.md) | 开发新插件模块包，扩展卡片/语法/动作/参数，构建并验证消费者 |

两份 Skill 的指令使用英文以便复用，支持中文任务输入；给使用者的说明同时提供中英文。插件 Skill 包含独立模板，两个 Skill 都包含本地 references，无需把整个 LiMR 仓库放进 AI 上下文。

## 从 npm 包导入

先安装包含 Skills 的 LiMR 版本，在**你的应用项目**中运行：

\`\`\`sh
npm install @linloir/limr
mkdir -p .agents/skills
cp -R node_modules/@linloir/limr/skills/limr-use .agents/skills/
cp -R node_modules/@linloir/limr/skills/limr-plugin-development .agents/skills/
\`\`\`

以上为新安装示例；已有同名目录时先检查本地定制，再更新整个目录，避免旧模板残留。导入是快照，npm 升级不会自动同步副本。升级 LiMR 后应同时检查 Skill 版本适配。

## 从仓库或 ZIP 导入

可以从仓库的 skills 目录复制，也可以在本地生成 ZIP（需要 Python 3）：

\`\`\`sh
pnpm pack:skills
\`\`\`

输出在 artifacts/skills，并同步到 Playground 的 public/downloads 供 Docs 页面下载。每个 ZIP 的根目录是完整 skill 文件夹，不只包含 SKILL.md；另有包含两份 Skill 的版本化总包。构建 Docs 站点时自动生成下载文件。

对应版本网站部署后可直接下载：[limr-use.zip](https://linloir.github.io/LiMR/downloads/limr-use.zip)、[limr-plugin-development.zip](https://linloir.github.io/LiMR/downloads/limr-plugin-development.zip)。本地 Docs 的 AI Skills 页面也有下载按钮。ZIP 是便于下载的归档，不代表所有 AI 客户端都支持一键 ZIP 导入；不支持时解压并复制完整目录。

## Codex 的位置与调用

Codex 的项目级目录是 \`.agents/skills/\`，用户级目录是 \`~/.agents/skills/\`。选择一个作用域，避免重复安装同名 Skill。客户端仍使用旧目录时，按该版本支持的路径导入。Codex 通常自动发现变化，未显示时重启；可通过 \`/skills\` 或 \`$skill-name\` 调用。依据：[OpenAI 官方 Skills 文档](https://developers.openai.com/codex/skills/)。

\`\`\`text
$limr-use 在这个 React 项目中接入 LiMR，使用中文界面、流式回答和受控标注。
\`\`\`

\`\`\`text
$limr-plugin-development 创建术语解释插件包，包含术语块、选区动作、可展开卡片和侧栏摘要，再引入当前应用。
\`\`\`

其他支持 SKILL.md 的 AI 工具，使用其实际支持的项目/用户目录；没有 Skill 自动发现能力时，可以要求 AI 阅读 SKILL.md，并按其中链接加载 references 和 assets。无需假定某个客户端专属命令可在所有工具上工作。

## 期望产物

使用 Skill 应交付可运行的集成、稳定配置和验证结果；开发 Skill 应交付模块源码、包导出/类型/CSS、宿主引入示例及真实包消费验证。它们都要求以当前安装版本为准，不虚构解析能力，不删除未知标注的持久化数据，也不在未获指示时发布 npm 或修改外部服务。
`,dO=`# 标注与选区

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/annotations) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/annotations.md)

## 数据模型

\`Annotation\` 是数据，\`AnnotationType\` 是插件注册的呈现和加载逻辑，\`AnnotationOccurrence\` 是一次出现位置。一个标注可以通过 anchors 出现在多处；一个引用角标可以关联多条标注。

\`\`\`ts
import type { Annotation } from '@linloir/limr';

export const annotations: readonly Annotation[] = [{
  id: 'paper-reference',
  type: 'citation',
  data: { title: 'Paper', url: 'https://example.com/paper' },
  anchors: [{
    range: { start: 0, end: 4 },
    documentId: 'article',
    quote: 'LiMR',
  }],
}, {
  id: 'highlight-1',
  type: 'highlight',
  range: { start: 0, end: 4 },
  data: { color: '#F2C744', style: 'background' },
}];
\`\`\`

这个示例要求 source 的前四个 UTF-16 单元为 \`LiMR\`，documentId 为 article。range 是单次锚点的简写；传 anchors 后以 anchors 为准。范围均指向**未经改写的输入**，采用 UTF-16、右端不包含，不是 UTF-8 字节或 Unicode 码点。

持久化时保存原始 source、稳定 documentId、annotation.id、type、data、anchors，并在有需要时记录应用文档版本。anchor.revision 对应当前引擎修订号，不是跨会话持久 ID。quote 与原范围不符时，只在全文有唯一匹配时迁移；无匹配、多个匹配或 documentId 不一致会跳过该锚点。没有 quote 且 revision 不匹配的锚点也会跳过。这不是协同编辑的自动位置转换系统。

## 三种选区

| 字段 | 含义 |
| --- | --- |
| \`text\` | 可读的选中文本；选区稳定后，原子内容使用完整原始源码 |
| \`raw\` | 映射得到的原始范围和源码 |
| \`syntax\` | 仅吸收两端紧邻的标准 Markdown 标记，不扩选未选文字或特殊块外层标签 |
| \`blocks\` | 选区触及的块范围与源码 |
| \`quality\` | exact、atomic 或 unmapped |
| \`settled\` | 指针仍在拖选时为 false |
| \`documentId\` / \`revision\` | 选区所属文档快照 |

每种结果包含 ranges 和 sourceText。一般笔记使用 syntax.ranges，并为**每个范围**保存 \`document.source.slice(start, end)\` 作为 quote。代码支持部分选择；公式和图片作为原子内容。不要用 DOM textContent 长度倒推原文范围，实体、转义和 emoji 会让两者不同。

默认选区工具栏与浏览器复制会完整序列化原子内容，保留原来的 \`$…$\`、\`$$…$$\`、图片语法、Mermaid 围栏／指令及插件块标签；周围普通文字保留渲染后的文本与显式换行。重新点击已有高亮后复制也遵循这一规则。插件的 \`selection: 'atomic'\` 覆盖其映射属性、子内容及嵌套原子块；模块内部的复制按钮可以提供专用格式。

## 高亮和命令

\`highlight\` 不需要安装额外的 AnnotationType，data 支持 color、style（background / underline / dotted / wavy）、hidden。删除内容标注与隐藏高亮是不同操作。

| 命令 | 行为 |
| --- | --- |
| \`addAnnotation(annotation, options?)\` | 添加/替换同 ID 数据；普通内容标注默认同时补充共享高亮 |
| \`updateAnnotation(id, partial)\` | 浅合并标注字段；data 是整体替换，更新时保留需要的字段 |
| \`removeAnnotation(id)\` | 移除这一条标注，其他标注和共享高亮保留 |
| \`removeAnnotationsAt(ranges)\` | 移除精确匹配片段上的标注及高亮；保留它们其他位置的锚点 |
| \`editAnnotation(id / null)\` | 切换共享编辑状态；设置 ID 时也激活卡片 |
| \`activateAnnotation(id / null)\` | 激活标注的首个 occurrence，也接受 occurrence ID |

\`addAnnotation\` 的 \`{ highlight: false }\` 关闭自动持久高亮，显式 HighlightData 指定样式；\`{ edit: true }\` 进入编辑。类型配置 \`highlight: 'hover'\` 时默认不创建持久高亮，但显式传入高亮样式仍可创建。默认选区工具栏为调色板、添加/隐藏高亮、复制、删除；actions 覆盖内置列表，插件动作仍会合并进去。

## Citation 的临时高亮

Citation 默认 \`highlight: 'hover'\`。角标或侧栏条目悬浮、或引用处于 activate 状态时，用类型 color 的 18% 底色高亮关联文本。底色绘制在文字下方；点击激活后，移开鼠标仍保留，取消激活且不再悬浮后才隐藏。同一段落的激活与悬浮引用不会叠加加深颜色。该效果不更新 annotations，也不改变已保存高亮的 hidden 设置。嵌入 ref 使用最近的段落、标题、列表项或表格单元格；外部范围引用使用自身范围，并以该范围首行对齐侧栏。

侧栏联动使用正文位移动画，不改变页面滚动范围。绘制层在动画过程中及结束、取消时更新可见片段，因此从视口外移入的文本也会同步获得当前悬浮或激活高亮。

使用 \`replaceExtension(standard(), citation({ highlight: false }))\` 关闭该效果。其他类型也可显式启用 highlight: 'hover'。

## 缺少插件时

当前实现**不会静默忽略未知 annotation 类型**。数据和范围仍保留，可能显示通用圆点角标；没有 Content 时卡片显示本地化的“不可用”及类型名称。缺失 citation 定义也可能显示不可用提示。要保证呈现，应安装对应插件，或由应用决定暂时隐藏哪些标注。

若应用过滤不支持的类型，保留完整的持久化原始数组，并在写回时合并仍隐藏的数据，避免卸载插件导致数据丢失。Playground 的插件勾选目前只启用/关闭动作入口，仍保留卡片渲染器，因此不会模拟完整卸载插件。

## 卡片与异步资源

卡片 UI 由模块注册：Content 渲染内容，overlay.Card 负责完整浮层内部，sidebar.Preview 负责收起时的本地摘要。\`AnnotationMarkdown\` 在隔离选区作用域内复用 Markdown 配置。

\`load(annotation, { signal })\` 在内容显示时才调用，同一阅读器内复用请求和有限缓存，不在不同 Reader 间共享。Preview 不调用 load。Content 接收 data、loading、error、retry、editing、presentation、expanded；处理加载和错误 UI 是模块的职责。可通过 useLiMR().invalidateAnnotation(id) 刷新。

动作的 signal 在阅读器销毁时取消，关闭菜单不会取消动作。调用 updateAnnotation 更新流式答案时同时保留问题字段；“停止生成”、重试、认证、会话和保存由应用 adapter 管理。参考[助手示例](../../examples/assistant.tsx)和[扩展开发](extensions.md)。
`,hO=`# API 参考

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/api) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/api.md)

## 导出入口

| 入口 | 内容 |
| --- | --- |
| @linloir/limr | 全部公开 core、React 和扩展接口 |
| @linloir/limr/core | 无 React/DOM 的文档引擎、选区计算、树工具、缓存、数据类型 |
| @linloir/limr/react | 组件、hooks、locale、React 类型 |
| @linloir/limr/extensions | 模块工厂、扩展定义、选区动作、AnnotationMarkdown |
| styles.css / styles/base.css / fonts.css / math.css | 公开样式资源，前面加包名 |
| @linloir/limr/package.json | 包元数据 |

以下是使用入口；精确 TypeScript 签名随包导出，插件应以已安装版本的声明为准。

## 共享文档配置

Reader、Markdown 与 DocumentProvider 接受：

| 属性 | 默认 / 说明 |
| --- | --- |
| source | 空字符串，原始 Markdown |
| streaming | false |
| documentId | 自动生成；显式值应稳定且页面内唯一 |
| extensions | standard()，完整扩展清单 |
| plugins | 追加到默认或显式清单 |
| parameters | 文档级模块参数覆盖 |
| components | 按 AST 类型/特殊标签覆盖 NodeRenderer |
| annotationTypes | 按 type 追加/覆盖标注呈现 |
| annotations | 不传则内部管理；传入则受控 |
| onAnnotationsChange | 下一份外部标注数组，包含 highlight；受控编辑必须回传 |
| theme | light，可选 dark / auto |
| appearance | classic，传播到 portal 的样式作用域 |
| locale | english，可传 chinese 或 Partial&lt;LiMRLocale&gt; |
| justify | false，段落/列表两端对齐 |
| typography | standard（默认）、knuth-plass 或 justify；保留旧 CSS 模式 pretty / normal |
| knuthPlass | TeX 段落参数，见[样式](styles.md) |
| rendererOverrides | 按顺序匹配的渲染规则：type、component 和可选 when 条件，仅作用于当前 Reader |
| streamEffect | 覆盖流式增量动画；false 关闭 |
| scrollRoot | null / 未指定表示窗口 |
| scrollOffset | 24px |
| onDocumentChange | 文档更新后的 DocumentSnapshot |
| onSelectionChange | SelectionSnapshot 或 null |
| onAnnotationClick | 激活的 AnnotationOccurrence |
| onAnnotationHover | occurrence 或 null |
| onHighlightClick / onHighlightHover | 高亮 Annotation；hover 离开为 null |

默认 locale 是 english，Partial 未指定键回退到英文。locale 影响采用 LiMRLocale 的内置控件，不翻译正文；第三方插件通过 useLocale 自行提供文案。当前部分辅助文字（例如公式 Copy LaTeX、译文切换提示）仍是模块固定文案。Playground 的界面语言按钮可试用中文/英文切换，选择会独立保存到浏览器。

## 组件

| 组件 | 额外属性及默认值 |
| --- | --- |
| Reader | toc=true、sidebar=true、fillHeight=true、sidebarBreakpoint=1120、actions、followOutput=false、className/style |
| Markdown | interactive=true、followOutput=false、className/style |
| DocumentProvider | children；为下方组件提供上下文 |
| TableOfContents | title、maxDepth=6、followActive=true、topInset=24、updateHash=false、className/style |
| AnnotationSidebar | sync='document' / 'none'、gap=14、positioner=alignSidebar、renderCard、className/style |
| AnnotationOverlay | disabled=false、portalRoot、previewWidth=340、maxHeight='80dvh' |
| SelectionToolbar | actions、portalRoot、maxPanelHeight=260、render、className/style |
| AnnotationCard | AnnotationOverlayCardProps 加必填 title 和可选 bodyLabel |
| AnnotationContent | annotationId、presentation、expanded=true、enabled=true |
| AnnotationGroup | occurrence、presentation、expanded=true、enabled=true |
| AnnotationMarkdown | MarkdownProps，source 必填；默认 interactive=false |
| InlineMarker | label 必填，color、children 和 button 属性/ref |
| ToolIcon | name 与 SVG 属性；如 note、copy、highlight、comment、zoom-in、zoom-out、source、image |

除独立 Markdown 和 Reader 外，共享组件/hooks 应位于 Provider 内。AnnotationCard 是浮层内容模板，不负责自建 portal。sidebar.renderCard 接收 \`{ occurrence, active, activate }\`；toolbar.render 接收 \`{ context, actions, run }\`。

\`SidebarPositioner\` 接收 \`{ id, anchorTop, height }[]\` 与 \`{ activeId, gap, height?, prioritizeActive? }\`，返回 ID 到 top 的映射。anchorTop 是关联文本首行的位置；prioritizeActive 区分悬浮/激活条目与随阅读位置选择的条目。默认 alignSidebar 在静止时收拢文末卡片，交互时优先保留当前条目的对齐。

## Hooks

| Hook | 返回 |
| --- | --- |
| useDocument() | 完整快照 |
| useDocumentSelector(select) | 选中值；返回值引用不变时不重渲染 |
| useLocale() | 当前合并后的 locale；内置 language 为 en / zh-CN，供插件选择自己的词典 |
| useSelection() | 选区或 null |
| useAnnotation(id) | 数据或 undefined |
| useAnnotations() | annotations Map 与 occurrences 数组，含源内引用及外部数据 |
| useAnnotationState() | active / hovered occurrence ID 与 activate / hover |
| useAnchor(occurrenceId) | element、视口 rect、contentRect，未挂载时为 null |
| useRendererParameter(name) | 宿主参数覆盖或最后注册的默认值 |
| useLiMR() | 文档引擎、命令、signal、clearSelection、scrollToHeading、scrollToAnnotation、invalidateAnnotation |

不要将 useRuntime、useTheme 当作公开 API。useLocale、locale.language 和可本地化的标注 label 从 1.0.0 起提供。命令语义见[标注与选区](annotations.md)，渲染和动作契约见[扩展开发](extensions.md)。

## 核心引擎

\`\`\`ts
import { createDocument, selectionFromRange } from '@linloir/limr/core';

const engine = createDocument('# Hello\\n\\nText', { id: 'core-doc', streaming: true });
engine.append('\\n\\nMore text.');
const document = engine.finish();
const selection = selectionFromRange(document, { start: 9, end: 13 });
console.log(document.headings, selection.syntax.sourceText);
\`\`\`

createDocument(source?, { id?, extensions?, streaming? }) 返回 DocumentEngine。getSnapshot() 读取；subscribe(listener) 返回取消订阅函数；update(source, { streaming? }) 替换完整输入；append(chunk) 追加并设流式；finish() 收尾；setExtensions(list) 切换解析配置。

核心默认 extensions=[]。纯核心使用带 micromark/mdast 的 SyntaxExtension；从 React 扩展入口导入 standard 不再是严格的无 React 依赖路径。

DocumentSnapshot 包含 id、revision、source、streaming、blocks、headings、definitions、footnotes、footnoteOrder、annotations、occurrences、diagnostics、metrics。这里 annotations 是**源内解析得到的数据**；外部受控数据使用 useAnnotations，不要混淆两个集合。

其他核心导出包括 walk、textContent、rangeOf、intersects、safeUrl、mapText、selectionFromRange、replaceExtension、resolveAnnotationAnchors、annotationReferenceRange、sameRange、defaultHighlight、LruCache、ResourceCache。ResourceCache.acquire 返回 promise/release；invalidate 可按 key 或全部失效。

\`inlineHighlights({ color?, component? })\` 与 \`footnotes(annotationTypeOptions?)\` 都在 \`standard()\` 中。\`HighlightData.readOnly\` 限制默认高亮工具栏为复制与提示；\`AnnotationOccurrence.referenceRange\` 可将角标的源位置与它引用的文字范围分开。

核心还导出 \`knuthPlass(items, lengths, options?)\`、\`prepareKnuthPlass(items)\`、\`texBadness\` 及对应类型。准备后的函数可按不同宽度求解同一段落，复用前缀和。
`,fO=`# 架构与行为

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/architecture) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/architecture.md)

## 三层公开边界

1. core 管理原始 source、AST、块、标题、源内引用、诊断和选区坐标，无 React/DOM 运行时依赖。
2. React 层将文档、交互、布局、外部标注和资源状态连接到组件。
3. extensions 层使用同一套公开接口提供默认语法和交互；应用可以追加、替换或移除。

Doc 页面导航和 Playground 的保存、加载、语言菜单属于演示应用，不进入 LiMR 核心架构。

## 追加解析

流式追加从末尾尚未稳定的顶层块回退，复用稳定前缀、行号索引和节点语义索引。持续增长的代码围栏可走字面量快速路径；收尾也可只重新解析尾部，不再一律全文解析。后到的 Markdown 引用/脚注定义、中间编辑、全文 transform 或更换扩展仍可能要求全文解析。长段落、列表和复杂未闭合标签仍有尾部重解析成本。

未闭合节点用 \`incomplete\` 标识，与所属顶层块仍在增长的 \`pending\` 区分。模块可渐进渲染或提供 \`streaming.Loading\`；不完整的语法头部与行内标记暂缓显示。增量动画只作用于新内容，临时包装节点在动画结束且原生选区离开后合并。代码在流式追加时保留已有文本节点，最终高亮也避开正在使用的选区。

公开的 source 始终保留原始输入。解析器内部为双冒号组件和未闭合语法补充解析标记，再通过稀疏偏移映射还原到原始 UTF-16 坐标；这些内部标记不会进入复制、标注或持久化数据。自定义 transform 必须维护坐标和局部性约定。源码中引用数据与应用 annotations 分开输入，在 React 视图层合并。

## 排版与源映射

标准模式默认使用浏览器排版。KP 在客户端按需加载：准备阶段缓存字形测量、断词、合法断点和前缀和，求解阶段运行 TeX 段落动态规划。视口附近的稳定段落优先排版，滚动离开后保留 DOM；宽度变化复用准备结果与文本容器。用户仍在选择的段落保留原生 Range，等待选区释放后再排版。源码坐标与标注保持不变，详细策略和测量见[样式](styles.md)与[性能](performance.md)。

原子内容的选区文本以完整源码序列化；同一选区里的普通文字保留渲染文本和显式换行。插件原子块的属性、子内容和嵌套原子节点服从外层整体选择契约。

## 状态与资源

配置数组/对象按不可变数据更新，静态配置保持引用稳定。滚动和 parameter 变化不需要重解析。一个 Provider 管理一个主正文；不同 Provider 的文档和标注请求隔离。

标注异步资源使用阅读器内有限缓存，消费者释放后可以取消无用请求。Shiki 的纯 token 结果使用模块级有限缓存；不应将其与用户标注数据缓存混为一谈。Mermaid 结果使用有限缓存，串行处理全局初始化与绘图，防止不同主题的阅读器相互干扰。库不提供模型服务、账号认证、数据库或自动保存。

## 退化行为

未知 HTML/自定义标签是惰性的原文；默认配置下未知指令仅渲染子内容。未知标注类型保留数据并显示通用角标/不可用提示，并非静默跳过。不完整语法恢复、transform diagnostics 和客户端渲染错误边界各有自己的适用范围，见[扩展开发](extensions.md)。

## 验证边界

仓库包含解析/坐标/SSR 单元测试、真实 Chromium 交互回归和 React 18/19 独立 npm 消费验证。浏览器测试中的远程媒体拦截、移动视口模拟和性能夹具不等于真实平台播放、移动设备验收或通用性能承诺。
`,mO=`# 扩展开发

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/extensions) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/extensions.md)

第一次接触模块时，先阅读[内置模块](modules.md)：那里解释模块对象、创建函数、模块名、Markdown 标签，以及 \`extensions\` 和 \`plugins\` 的区别。

## 选择接口

| 需求 | 接口 |
| --- | --- |
| 一个带 Markdown 正文的新区块 | defineBlock |
| 一种独立标注类型 | defineAnnotation |
| 组合语法、标注、动作和参数 | defineExtension / RendererExtension |
| 改写已有节点外观或只替换满足条件的节点 | components / rendererOverrides |
| 新的解析规则 | micromark + mdast 扩展，必要时 transform |
| 仅修改视觉 | CSS 主题包 + appearance |

所有接口从 \`@linloir/limr\` 公开导出。第三方包不要导入 src、dist 内部路径或 useRuntime 等未公开接口。完整独立模板见[插件模块包](plugin-packages.md)。

## 追加、删除与替换默认模块

\`\`\`tsx
import { Reader, standard, replaceExtension, video, defineBlock } from '@linloir/limr';

const extensions = replaceExtension(standard(), video({ loading: 'click' }));
const plugins = [defineBlock({
  name: 'reading-tip',
  component: ({ children }) => <aside className="reading-tip">{children}</aside>,
})];

export function Article({ source }: { source: string }) {
  return <Reader source={source} extensions={extensions} plugins={plugins} />;
}
\`\`\`

只移除模块可 filter 它的 name。扩展名、注册标签名和指令名各自必须唯一，重复会报错；不要用 plugins 再追加一份 citation 或 video。\`replaceExtension\` 替换同名项，不存在时追加。保留配置引用，避免流式渲染期间反复重建解析器。

## 自定义正文区块

\`\`\`tsx
import { defineBlock } from '@linloir/limr';

export const notice = defineBlock({
  name: 'notice',
  component: ({ children, renderAttribute }) => <aside className="notice">
    <header>{renderAttribute('title')}</header>
    {children}
  </aside>,
});
\`\`\`

支持 \`<notice title="提示">…</notice>\`、配对的 \`::notice{title="提示"}\` / \`::\`，以及 \`:::\` 容器。name 默认同时成为标签名和指令名，可通过 tags / directives 自定义。defineBlock 默认 display: block、selection: content、scope: local。

| NodeRendererProps | 用法 |
| --- | --- |
| node | 当前 AST 节点和静态属性 |
| children | 已经渲染好的子树；优先复用 |
| source | **当前节点**对应的源码片段，不是全文 |
| pending | 所属尾块是否仍在流式生成 |
| incomplete | 当前语法节点是否尚未闭合 |
| renderChildren(nodes, { trailing? }) | 重排已有子树，可在末尾注入纯操作角标 |
| renderValue(tokens?) | 渲染字面量及高亮 token，保留原文选择和标注插入 |
| renderAttribute(name) | 显示属性文本并保留原文坐标 |

不要把 children 转字符串再解析，也不要仅输出 node.value 导致源码映射丢失。无法逐字对应的图表/媒体用 selection: atomic；需要指定可视边界时使用 data-limr-selection-surface。纯操作角标可以使用公开 InlineMarker，不必建立 Annotation。

## 标注卡片由插件拥有

\`\`\`tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon } from '@linloir/limr';

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: ({ data, loading, error, retry }) => loading ? <p>Loading…</p>
    : error ? <button onClick={retry}>Retry</button>
    : <AnnotationMarkdown source={data?.text ?? ''} />,
  sidebar: {
    Preview: ({ data }) => data?.text ? <span>{data.text}</span> : null,
    previewLines: 2,
  },
  overlay: {
    Card: props => <AnnotationCard {...props} title="Note" />,
    previewWidth: 320,
    expand: { placement: 'center', width: 640, maxHeight: '80dvh' },
  },
});
\`\`\`

Content 处理 presentation（preview / expanded / sidebar）、editing、data 和资源状态。overlay.Card 拥有标题、正文和操作，可复用 AnnotationCard 或完全自绘；children 是共享加载状态的内容。LiMR 管理定位、portal、焦点、动画和退出生命周期。不要用通用标题覆盖插件自己的语义。

expand 必须显式配置；默认不展开。placement 支持 anchor / center，尺寸为像素或 CSS 长度，也可按 annotation 返回策略。sidebar.Preview 只读本地 data；不要在摘要触发网络请求。Preview: false 或返回 null 隐藏摘要。同一 occurrence 的首个类型负责卡片外观和分组摘要，可通过 annotations 获取组内数据。

sidebar 支持 previewLines、previewColor、color、borderColor、titleColor、textColor、excerptColor 和 collapseOnContentClick。内容根节点无需重复添加卡片 padding；复用共享 \`--limr-sidebar-padding-inline\`，处理内部段落间距即可。

## 选区动作

\`\`\`tsx
import { defineExtension, ToolIcon } from '@linloir/limr';

export const savePassage = defineExtension({
  name: 'example:save-passage',
  actions: [{
    id: 'example:save-passage', label: 'Save passage', icon: <ToolIcon name="note" />,
    visible: ({ selection }) => selection.settled && selection.quality !== 'unmapped',
    run(context) {
      const id = \`example-note-\${crypto.randomUUID()}\`;
      context.addAnnotation({
        id, type: 'example:note', data: { text: context.selection.text },
        anchors: context.selection.syntax.ranges.map(range => ({
          range, documentId: context.document.id,
          quote: context.document.source.slice(range.start, range.end),
        })),
      });
      context.activateAnnotation(id);
      context.clearSelection();
    },
  }],
});
\`\`\`

与上面的 note 扩展一起安装。SelectionAction 必须有 id、label、icon，可提供 visible、disabled、run、onHover、renderExpanded 或 render。面板操作通过 context.run 使用工具栏的 busy/error 处理。上下文包含选区、完整文档快照、同片段 annotations/highlight、locale、取消信号与命令。动作 ID 冲突时后者覆盖；宿主显式 actions 的同 ID 项最终优先。

## 参数

\`\`\`tsx
import { defineExtension, useRendererParameter } from '@linloir/limr';

declare module '@linloir/limr' {
  interface RendererParameters { exampleDetail?: 'short' | 'full' }
}

export const glossary = defineExtension({
  name: 'example:glossary', tags: ['glossary'], scope: 'local',
  parameters: { exampleDetail: 'short' },
  components: {
    glossary: ({ children }) => <aside data-detail={useRendererParameter('exampleDetail')}>
      {children}
    </aside>,
  },
});
\`\`\`

宿主传 \`parameters={{ exampleDetail: 'full' }}\` 覆盖默认值。参数变更只更新视图，不解析源文；相同参数后注册默认值优先。独立包需要让声明合并出现在导出的 .d.ts 中。

## 解析与流式约束

SyntaxExtension 支持 micromark、mdast、tags、directives、display、selection、literal、transform 和 scope。transform 默认全文作用域；仅依赖当前局部子树、不会回写前文或读取全局文档语义时才声明 scope: local。context.source 仍是原始全文，position 必须保持原始 UTF-16 坐标。插件不要先用正则替换 source 再解析。

未知特殊标签安全显示整段原文，内部 Markdown 也作为原文显示。默认配置的未知指令则渲染内部 Markdown，丢弃指令外层标记；未安装任何指令扩展时按基础 Markdown 解析。已注册的未闭合标签和容器携带 node.incomplete，之后追加继续恢复；半截头部暂缓显示或交由模块展示 loading；无效 JSX 仍可能回退并记录 diagnostics；结束必须 finish 或 streaming=false。扩展 transform 的异常记录为 diagnostic；客户端渲染边界可回退源码，但 React 错误边界不负责捕获服务端渲染异常。

验证应覆盖标签/指令、中文与 emoji、源坐标、流式结束与一次性解析等价、SSR，以及新增交互的浏览器行为。独立分发还需验证真实打包消费，见[插件模块包](plugin-packages.md)。

## 插件本地化

1.0.0 起，组件可用 useLocale() 读取合并后的 locale，以 locale.language 选择自己的文案。AnnotationType.label 接受字符串或 \`(locale) => string\`；选区动作使用 context.locale。Citation 默认标题随语言切换为 Citation / 引用。保持插件实例稳定即可更新文案，无需重写源文；用户保存的笔记不会被翻译。

## 流式中间态与增量动画

\`pending\` 表示顶层块还在增长；\`incomplete\` 表示当前语法节点尚未闭合。注册的标签自动支持组件指令写法。\`defineBlock\` 可提供 \`streaming.Loading\`，不提供时由原组件渐进渲染，并通过 \`incomplete\` 判断状态。后续内容到来时保持组件身份和内部状态。

默认的定义、题目、拓展阅读、视频、图片和 callout 指令使用小圆环等待完整内容；Mermaid 等待闭合后异步绘图；代码、公式、GFM 和翻译模块直接展示可用中间态。callout 的引用块写法可在头部完整后渐进展示正文。未闭合的引用定义不会提前注册不完整数据。第三方模块完全拥有自己的中间态样式。

\`\`\`tsx
import { defineBlock, defineExtension } from '@linloir/limr';

export const chart = defineBlock({
  name: 'chart',
  component: ({ children }) => <section>{children}</section>,
  streaming: { Loading: () => <span role="status">正在准备图表…</span> },
});
export const streamMotion = defineExtension({
  name: 'example:stream-motion',
  streaming: {
    effect: {
      className: 'my-stream-increment',
      keyframes: [{ opacity: 0.25 }, { opacity: 1 }],
      timing: { duration: 320, easing: 'ease-out' },
    },
  },
});
\`\`\`

后注册的 \`streaming.effect\` 优先，阅读器的 \`streamEffect\` 拥有最终覆盖权，\`false\` 关闭效果。关键帧和时间选项使用 Web Animations API；减少动态效果的系统偏好会阻止新动画。默认动画仅改变新增文字和特殊块的透明度，不添加背景色；文字动画结束后在原生选区离开时合并临时包装节点。使用 \`children\`、\`renderChildren\` 和 \`renderValue\` 可保留这些行为；插件自行替换 DOM 时，需要自行维护选区和动画。

\`SyntaxExtension.literal\` 让指令正文保持字面量，避免内部代码被解释为 Markdown 或 JSX。模块可读取原始 \`source\` 或变换组件节点；它不会执行属性表达式、YAML 或 JavaScript。

## 按条件替换渲染组件

模块可通过 \`rendererOverrides\` 限制替换的节点类型、语言、祖先或流式状态；规则只作用于使用该模块的 Reader。后注册且满足条件的规则优先；宿主 Reader 的规则优先于模块和 \`components\` 映射。未匹配的节点继续使用原组件。

\`\`\`tsx
import { defineExtension, type NodeRenderer } from '@linloir/limr';

const JavaScriptCode: NodeRenderer = ({ renderValue }) => <pre>{renderValue()}</pre>;
export const customCode = defineExtension({
  name: 'example:javascript-code',
  rendererOverrides: [{
    type: 'code',
    when: (node, context) => node.lang === 'js' && !context.incomplete,
    component: JavaScriptCode,
  }],
});
\`\`\`

\`when\` 也能读取 \`pending\` 和 \`ancestors\`。显式替换组件拥有自己的中间态渲染，仍处于 LiMR 的源范围、原子选择和异常边界之内。使用 \`renderValue\`、\`renderAttribute\`、\`renderChildren\` 维持精确映射。这里的限制是渲染规则作用域，不是对第三方 JavaScript 的安全沙箱。
`,pO=`# 快速开始

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/getting-started) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/getting-started.md)

## 安装

\`\`\`sh
npm install @linloir/limr
\`\`\`

宿主项目需要 React 和 React DOM 18.3 或 19。包是 ESM，Node.js 要求 20+；支持 Vite 等 ESM 构建工具。CSS 必须由应用显式导入。

## 完整阅读器

\`\`\`tsx
import { Reader, chinese } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = \`# LiMR

正文支持 **强调**、表格、代码和 $x^2$。

## 参考来源

阅读这段话<ref id="guide" />。

<citation id="guide" title="Guide" url="https://example.com/guide" />\`;

export function Article() {
  return <Reader source={source} locale={chinese} theme="auto" />;
}
\`\`\`

宽屏提供目录、正文和侧栏；容器宽度小于 \`sidebarBreakpoint\`（默认 1120px）时标注改用浮层。目录在窄屏以可折叠列表展示。

默认排版为 \`standard\`；可选 \`knuth-plass\` 或 \`justify\`，见[项目集成](integration.md)。默认模块还提供 Mermaid、嵌套 callout、\`==高亮==\` 和脚注卡片，不需要再追加同名插件；完整列表见[内置模块](modules.md)。

## 只需要正文

\`\`\`tsx
import { Markdown } from '@linloir/limr';
import '@linloir/limr/styles/base.css';

export function Excerpt() {
  return <Markdown source="一段 **Markdown**。" />;
}
\`\`\`

\`Markdown\` 可以独立使用，保留解析和选区能力，但不自动挂载工具栏。静态内容可设 \`interactive={false}\` 关闭选区监听。已经有 \`DocumentProvider\` 时，用不带 \`source\` 的 \`<Markdown />\` 共享文档。

## 选用样式

| 导入 | 内容 |
| --- | --- |
| \`@linloir/limr/styles.css\` | 默认主题、布局、交互和 Maple 代码字体 |
| \`@linloir/limr/styles/base.css\` | 相同样式，不引入 Maple 字体 CSS |
| \`@linloir/limr/fonts.css\` | 只引入 Maple，可与 base.css 分开使用 |
| \`@linloir/limr/math.css\` | KaTeX 样式与本地公式字体 |

\`styles.css\` 与 \`styles/base.css\` 选一个。选择 base 不会减少 npm 安装时包含的字体文件。中文正文使用宿主/系统字体，Playground 的 Noto Serif SC 并非组件默认加载项。

## 下一步

- 查看[默认语法](syntax.md)，区分内置正文模块与应用标注插件。
- 查看[项目集成](integration.md)，接入流式输出、滚动容器和 SSR。
- 需要 AI 协助接入时安装 [limr-use Skill](ai-skills.md)。
`,gO=`# 项目集成

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/integration) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/integration.md)

## 选择组件

用 \`Reader\` 获取完整阅读体验；用 \`Markdown\` 渲染独立正文；自己设计布局时让一个 \`DocumentProvider\` 管理一个主 \`Markdown\` 及其目录、卡片和工具栏。Provider 内再次传入 \`source\` 的 Markdown 会创建独立文档，不再共享父文档状态。

## 流式内容

\`\`\`tsx
import { Markdown } from '@linloir/limr';

export function StreamingAnswer({ answer, generating }: {
  answer: string;
  generating: boolean;
}) {
  return <Markdown source={answer} streaming={generating} followOutput />;
}
\`\`\`

应用负责传输层，把每个片段追加到完整 \`answer\`；不要只把最后一个片段传给 source。最后一次更新必须传 \`streaming={false}\`，完成尾部语法与语义校正。收尾可以复用稳定前缀；引用定义变化等情况仍可能触发全文解析。followOutput 只在仍靠近底部时跟随，不会强行拉回正在阅读上文的用户。纯核心支持 \`append(chunk)\` / \`finish()\`，React props 使用累计字符串。

默认新增文字和特殊块使用透明度淡入，段落结束时不重播动画。\`streamEffect={false}\` 可关闭，传入 \`className\`、\`keyframes\` 和 \`timing\` 可自定义；系统的减少动态效果偏好优先。未闭合模块可显示 loading，代码/公式渐进显示；复用 \`children\`、\`renderChildren\`、\`renderValue\` 有助于保留控件状态与选区。插件接口见[扩展开发](extensions.md)。

## 段落排版

\`\`\`tsx
import { useState } from 'react';
import { Reader, type TypographyMode } from '@linloir/limr';

export function TypographyReader({ source }: { source: string }) {
  const [mode, setMode] = useState<TypographyMode>('standard');
  return <>
    <select aria-label="排版模式" value={mode}
      onChange={event => setMode(event.target.value as TypographyMode)}>
      <option value="standard">标准</option>
      <option value="knuth-plass">Knuth–Plass</option>
      <option value="justify">两端对齐</option>
    </select>
    <Reader source={source} typography={mode} />
  </>;
}
\`\`\`

\`standard\` 为默认值；\`justify\` 使用浏览器两端对齐；\`knuth-plass\` 启用真正的段落优化算法。\`knuthPlass\` 可调整 TeX 参数与断词；流式尾段稳定后再参与 KP 排版。详细行为及性能边界见[样式](styles.md)和[性能](performance.md)。

## 内部滚动容器

\`\`\`tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function ScrollPanel({ source }: { source: string }) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setScrollRoot} style={{ height: '80vh', overflowY: 'auto' }}>
    <Reader source={source} scrollRoot={scrollRoot} scrollOffset={32} />
  </div>;
}
\`\`\`

窗口滚动无需指定 scrollRoot。固定顶栏通过 scrollOffset 留出距离；目录布局可用 \`--limr-sticky-top\` 调整。切换整篇独立文档时，给 Reader 新的 React key，并提供稳定、页面内唯一的 documentId，以重新建立任务与交互状态。

## 自定义组合

下面是固定三栏的桌面组合。窄屏响应式切换、目录折叠和自动高度优先使用 Reader；需要自己的断点策略时，由应用决定挂载 sidebar 还是 overlay。

\`\`\`tsx
import { DocumentProvider, Markdown, TableOfContents, AnnotationSidebar,
  SelectionToolbar } from '@linloir/limr';

export function DesktopReader({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr) 280px', gap: 24 }}>
      <TableOfContents style={{ position: 'sticky', top: 24, alignSelf: 'start', maxHeight: '80vh' }} />
      <main className="limr-reader-content" style={{ minHeight: '70vh', overflow: 'clip' }}>
        <Markdown />
      </main>
      <AnnotationSidebar />
    </div>
    <SelectionToolbar />
  </DocumentProvider>;
}
\`\`\`

正文与同步侧栏应处于同一滚动容器、同一未缩放坐标系；侧栏由网格行或宿主给定高度，不按所有卡片总高度撑大页面，也不要给同步列表增加独立滚动。卡片内的长内容可以自行滚动。抽屉等普通列表用 \`<AnnotationSidebar sync="none" />\`，宿主提供高度与 overflow。

浮层组合是在同一个 Provider 中放置 \`<Markdown />\`、\`<AnnotationOverlay />\`、\`<SelectionToolbar />\`。两个浮层组件支持 portalRoot，Reader 的组合 props 不直接暴露 portalRoot；需要定制时拆开组合。

## 受控数据与文档切换

\`\`\`tsx
import { useState } from 'react';
import { Reader, type Annotation } from '@linloir/limr';

export function SavedArticle({ id, source }: { id: string; source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader key={id} documentId={id} source={source}
    annotations={annotations} onAnnotationsChange={setAnnotations} />;
}
\`\`\`

该片段展示单篇文章的状态。真实应用按文章 ID 加载/保存 annotations，并在切换文章时更换这一数组；React key 不会自动清空宿主状态。不传 annotations 时使用组件内部状态；传入后必须通过回调接收并回传编辑，否则编辑操作会报错。不可原地修改数组或 data。持久化范围与迁移规则见[标注与选区](annotations.md)。

## 全局译文模式

\`\`\`tsx
import { useState } from 'react';
import { Reader, type TranslationMode } from '@linloir/limr';

export function BilingualArticle({ source }: { source: string }) {
  const [mode, setMode] = useState<TranslationMode | undefined>();
  return <Reader source={source}
    parameters={{ translationMode: mode, onTranslationModeChange: setMode }} />;
}
\`\`\`

参数仅影响视图，不触发重解析。其他插件也可以注册自己的参数，见[扩展开发](extensions.md)。

## SSR 与客户端边界

交互组件放在宿主框架的客户端组件边界内（例如需要时在文件顶部使用 \`'use client'\`），由框架安排 SSR 和 hydration。不要在模块初始化时访问 window/document；保持服务端与客户端的 source、documentId 和初始配置一致。

同步 SSR 中，未加载公式输出源码回退。需要首次 HTML 包含完整 KaTeX 内容时，在服务器渲染前调用：

\`\`\`tsx
import { renderToString } from 'react-dom/server';
import { Markdown, preloadMath } from '@linloir/limr';

export async function renderArticle(source: string) {
  await preloadMath();
  return renderToString(<Markdown source={source} documentId="server-article" />);
}
\`\`\`

也可以使用 React 流式 SSR 处理 Suspense。Shiki 在客户端补充高亮，SSR HTML 仍包含代码文本。Mermaid 在服务器输出 loading，客户端完成绘图后淡入；KP 在客户端测量字体并排版，SSR 保留普通文本布局。\`load\` 标注请求在客户端显示卡片时发起；如需服务端已有内容，可预先放进 annotation.data。宿主仍需把 CSS 和字体资源放到页面能访问的位置。

## 已有插件与主题

从真实插件包导入工厂，在模块外或 useMemo 中创建稳定 plugins 数组，再传给 Reader。CSS 需要按插件说明显式导入；主题通过 appearance 选择，不是通过 plugins 传入。具体安装与本地 tgz 流程见[插件模块包](plugin-packages.md)。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| 布局没有样式 / 公式错位 | 是否导入 styles 或 base，以及 math.css |
| 加入插件后默认模块消失 | 是否把追加插件误传给 extensions |
| 编辑标注后数据不更新 | 是否在受控回调中回传新数组 |
| 正文、目录不同步 | Markdown 是否意外带 source 创建了第二个 Provider |
| 内部滚动定位错误 | scrollRoot 是否是真正滚动的 DOM 元素 |
| 浮层主题不一致 | 是否使用 data-limr-appearance 作用域覆盖 portal |
| 流式渲染反复全文解析 | 是否每次 render 重建 extensions/plugins，或存在全文 transform |
`,yO="# 内置模块\n\n> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/modules) 可获得最佳阅读体验。\n\n[文档目录](README.md) · [English](../en/modules.md)\n\n## 模块是什么\n\nLiMR 的基础解析器认识 CommonMark：标题、段落、列表、链接、图片和代码围栏等。**模块**是在这个基础上增加一组能力的配置对象，例如识别公式、渲染视频、显示引用卡片。开发时这个对象的公开类型叫 `RendererExtension`，所以 API 中也称它为“扩展”。\n\n模块可以同时包含语法规则、React 渲染组件、标注类型、工具栏动作和默认参数；并非每个模块都必须有这些部分。例如 `math` 增加公式语法和渲染，`code-highlight` 为现有代码围栏添加高亮，`citation` 同时提供引用语法和标注卡片。\n\n**插件**通常指应用自行添加的模块，或第三方包提供的模块。它与内置模块使用相同的接口；npm 包只是分发代码的方式，一个包可以导出多个模块。把模块放进 `plugins` 后，就会追加到已有配置中。\n\n## 函数、模块名和标签名的区别\n\n以视频为例：\n\n```tsx\nimport { Reader, standard, replaceExtension, video } from '@linloir/limr';\n\nconst videoModule = video({ loading: 'click' });\n// videoModule.name === 'video'\nconst extensions = replaceExtension(standard(), videoModule);\n\nexport function Article() {\n  return <Reader extensions={extensions} source={'<video src=\"/lesson.mp4\" />'} />;\n}\n```\n\n| 写法 | 在哪里使用 | 含义 |\n| --- | --- | --- |\n| `video` / `video(...)` | 应用的 JavaScript / TypeScript | 导入的函数 / 调用这个函数，创建一个模块配置对象 |\n| `videoModule` | 应用代码 | 自己给对象起的变量名，可以改成其他名字 |\n| `'video'` | 模块对象的 `name` 字段 | LiMR 区分、替换和移除模块时使用的稳定标识 |\n| `<video … />` / `<md-video … />` | Markdown 正文 | 模块注册的两种标签，触发同一个视频渲染器 |\n| `::video{…}` | Markdown 正文 | 模块注册的指令写法，也可以使用 `:::video` 容器 |\n\n这些名称不要求一致。例如创建代码高亮模块的函数是 `codeHighlight()`，对象的模块名却是 `'code-highlight'`，正文只需要普通代码围栏，不需要 `<code-highlight>` 标签。不要把 `video()` 或字符串 `'video'` 直接写进 Markdown 来启用模块，也不要把字符串放进 `plugins`；传入的是函数返回的对象。\n\n`video({ loading: 'click' })` 的参数设置这个 Reader 中视频模块的默认行为；正文的 `<video loading=\"eager\" … />` 则可以覆盖某一个视频的设置。不同模块支持不同参数，见[默认语法](syntax.md)。\n\n## 随 LiMR 提供的默认模块\n\n这些模块都随 `@linloir/limr` 安装，不需要分别安装 npm 包。`standard()` 返回下面的模块对象数组，使用各自的默认配置。\n\n| 创建模块的函数 | 对象的 `name` | 增加的能力与正文写法 |\n| --- | --- | --- |\n| `gfm()` | `gfm` | 表格、`~~删除线~~`、任务列表、自动链接、`[^id]` 脚注解析 |\n| `math()` | `math` | `$…$` 行内公式、`$$…$$` 块级公式，需要额外导入 math.css |\n| `codeHighlight()` | `code-highlight` | 使用 Shiki 为带语言标记的代码围栏着色 |\n| `definition()` | `definition` | `<definition>` 释义卡片，可带标题与 Markdown 正文 |\n| `question()` | `question` | `<question>` 练习题，选项、提示、答案与本地判分 |\n| `extras()` | `extras` | `<extras>` / `<extra>` 拓展阅读链接 |\n| `video()` | `video` | `<video>` / `<md-video>` 原生视频、YouTube、Bilibili 嵌入 |\n| `figures()` | `figures` | `<figures>` / `<figure>` 响应式图组、单图和图注 |\n| `citation()` | `citation` | `<citation>` 定义来源，`<ref>` 插入引用角标和卡片 |\n| `translations()` | `translations` | `<translations>` 包含原文与译文，切换原文、译文、对照 |\n| `mermaid()` | `mermaid` | Mermaid 围栏 / `::mermaid`，图像、源码、缩放和复制 |\n| `callout()` | `callout` | Obsidian callout 类型、别名和嵌套注释 / `::callout` |\n| `inlineHighlights()` | `inline-highlights` | `==文字==` 和 `::highlight`，默认蓝色只读高亮 |\n| `footnotes()` | `footnotes` | `[^id]`、`^[正文]`，评论角标与脚注卡片；`::footnote` / `::footnote-ref` |\n\n所有函数都可以从 `@linloir/limr` 或 `@linloir/limr/extensions` 导入。`standard()` 是便捷组合函数，自身不是额外的模块；它的返回值是数组。\n\n`Reader`、独立使用的 `Markdown`、`DocumentProvider` 在未传 `extensions` 时自动使用 `standard()`，因此最初的 `<Reader source={source} />` 就支持这些能力。共享 Provider 内的组件使用 Provider 的配置。纯核心 `createDocument()` 默认只启用 CommonMark；需要时显式传入扩展，它不负责显示 React UI。\n\n高亮、复制、删除选区标注是工具栏自带动作。`==文字==` 和 Markdown 脚注由默认模块自动识别；源码中的高亮只可复制，不能通过工具栏编辑。Playground 的可编辑旁注、笔记、提问、脚注和模拟 AI 问答来自示例插件，**没有自动装进每个 Reader**。`question()` 的练习题与“提问”标注也不是同一功能。\n\n## 按需要组合\n\n默认配置足够时不必写 `standard()`。需要定制时，记住这三个操作：\n\n| 目的 | 写法 | 结果 |\n| --- | --- | --- |\n| 加自己的功能 | `plugins={[myPlugin]}` | 保留默认模块，追加插件对象 |\n| 只保留指定能力 | `extensions={[gfm(), math()]}` | 替换完整默认模块清单；CommonMark 仍可用 |\n| 调整一个内置模块 | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | 按模块 `name` 替换视频，保留其他模块 |\n\n移除一个模块也可以过滤数组：`standard().filter(module => module.name !== 'video')`。不需要扩展语法时传 `extensions={[]}`。\n\n不要通过 `plugins={[video()]}` 再次追加已默认存在的视频模块：重复模块名、标签或指令会报错。模块没有启用时，未知标签按文本显示；未知指令可能仅留下内部 Markdown；已有的未知标注数据保留并显示通用回退。完整边界见[架构与行为](architecture.md)。\n\n接下来可以直接试读[语法示例](syntax.md)，或参考[扩展开发](extensions.md)创建模块、[插件模块包](plugin-packages.md)打包分发。\n",bO=`# 性能与限制

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/performance) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/performance.md)

前几节保留仓库 **2026-10-12** 的历史基准，便于对照。文末 **2026-10-13** 一节记录本次优化实测。两组数据都不是性能保证。

环境：Intel Core i7-13700、WSL2/Linux、Node 20.19.5、Chromium 156.0.8078.4、React 19 production。对照为 react-markdown 10.1.0 + remark-gfm 4.0.1。

## 浏览器

双方渲染同一份 GFM，使用相同排版，只比较正文，不含 Reader 目录/侧栏。每组取三个独立页面样本的中位数，预热并等待字体，交替测量；计时包括同步 React 提交和强制布局，不包括网络、异步重资源和帧间空闲时间。

| 场景 | LiMR | react-markdown |
| --- | ---: | ---: |
| 87,381 字符，200 节，首次挂载 | 126.1 ms | 134.0 ms |
| 877,782 字符，2,000 节，首次挂载 | 1,345.4 ms | 1,437.6 ms |
| 34,860 字符，138 次流式提交，累计同步时间 | 306.1 ms | 1,864.1 ms |
| 同一流式场景，单次提交 P95 | 2.9 ms | 23.7 ms |

最后一次完整解析包含在统计中；P95 不代表每帧都低于 16ms。原始数据：[browser.json](../../benchmarks/results/browser.json)。

## 选区与 SSR

历史长文拖选绘制延迟 P95 为 25.2–28.5ms，代码为 18.9–19.4ms。这是 selectionchange 到覆盖层变更的延迟，不是硬件输入到屏幕的延迟。同一自动化拖动手势总耗时 LiMR 3.23s，对照 1.52s；不能因为 rAF 接近就声称成本相同。数据：[selection.json](../../benchmarks/results/selection.json)。

| Node 场景 | LiMR | 对照 |
| --- | ---: | ---: |
| 87,381 字符，SSR | 123.85 ms | 135.80 ms |
| 877,782 字符，SSR | 5,508.29 ms | 2,720.70 ms |
| 34,860 字符，137 次核心追加及收尾 | 164.04 ms | 2,673.74 ms |

大文档 SSR 波动明显，LiMR 的样本为 2.64–9.10s，对照为 2.70–5.03s；这组数据不显示 SSR 优势。核心追加对照每次重新解析完整前缀。数据：[node.json](../../benchmarks/results/node.json)。

## 使用限制

保留全部 DOM 支持搜索、选择和打印，因此首次完整长文渲染仍有成本。增量解析复用稳定前缀；长尾块、全文 transform、定义变化、中间编辑和收尾仍可昂贵。保持 extensions/plugins 引用稳定，按需要限制高亮语言和长度。

上面的历史测量未覆盖完整 Reader 布局；下方新增的 KP 对照包含一个完整 Reader 场景。两组数据都未覆盖大量公式、Shiki 冷启动、任意密集标注或插件组合、实体移动设备。字体安装体积与浏览器请求量也不同，见[样式与字体](styles.md)。

## 在仓库复现

\`\`\`sh
NODE_ENV=production pnpm bench
pnpm exec vite build
pnpm exec vite preview --host 127.0.0.1 --port 4174
# 在另一个终端执行：
pnpm bench:browser
pnpm bench:selection
\`\`\`

运行时避免同时构建或跑其他基准；脚本写入 benchmarks/results。每次使用自己的硬件、内容和已构建版本重新判断，不把历史测量当作最新包验收结果。

## 2026-10-13：流式与排版优化实测

以下为本次工作区实现与修改前提交 \`ebab991\` 的同进程对比，使用同一依赖、原始 UTF-16 输入、分块大小和五次交错顺序采样，按总耗时取中位样本。数据只包含核心追加和收尾，不包含 React、浏览器布局、异步高亮或网络。机器和运行时见 [streaming.json](../../benchmarks/results/streaming.json)。

| 场景 | 字符数 | 修改前总耗时 | 修改后总耗时 |
| --- | ---: | ---: | ---: |
| GFM | 34,860 | 139.22ms | 89.07ms |
| 默认模块 | 34,860 | 141.40ms | 94.63ms |
| 增长的代码围栏 | 43,209 | 1335.87ms | 29.05ms |
| 单个长段落 | 7,840 | 72.43ms | 74.32ms |

优化包含：追加时增量维护行号、缓存已完成节点的语义索引、局部收尾、持续增长代码的词法快速路径，以及按需创建代码字符映射。仍在增长的复杂段落要重新解析；单个长段落的差异较小且受运行波动影响，不能据此声称所有内容都同比加速。

运行 \`pnpm bench:streaming\` 测量当前核心。需要交错对照时，将 \`LIMR_BENCH_BASELINE\` 指向未修改的 \`ebab991\` 独立检出目录，并确保那里可访问相同依赖。脚本写入 \`benchmarks/results/streaming.json\`；复跑不意味着能复现历史硬件与耗时。

生产 Chromium 156 的完整同步更新（React 提交加布局、默认排版和增量动画）中，默认模块的 34,860 字符流式文档 P95 为 **3.9ms**、最大 7.3ms；43,211 字符代码 P95 为 **2.6ms**、最大 12.4ms。每种场景三次隔离页面采样、字体预热、256 字符一块，rAF 等待和异步高亮不计入。这里没有浏览器旧版本对照，也不代表物理设备上的端到端帧率。原始数据：[streaming-browser.json](../../benchmarks/results/streaming-browser.json)。

KP 提供独立生产基准：在完整 scikit-learn Playground 中保留目录、侧栏和标注，每种模式使用三个独立页面，各进行三轮向下/向上滚动，再进行 32 次 1100–1420px 的窗口宽度变化。第一轮包含新进入视口的段落排版，后续轮次复用结果。以下合并每种模式的 1,080 个滚动样本和 96 个缩放样本，没有 CPU 降速。

| 测量 | 标准模式 | Knuth–Plass |
| --- | ---: | ---: |
| 滚动中位数 / P95 / 最大值 | 16.6 / 17.0 / 18.5ms | 16.6 / 19.8 / 46.5ms |
| 缩放中位数 / P95 / 最大值 | 11.2 / 24.1 / 31.9ms | 17.7 / 41.6 / 49.9ms |
| 超过 50ms 的滚动样本 | 0 / 1,080 | 0 / 1,080 |
| 超过 50ms 的缩放样本 | 0 / 96 | 0 / 96 |

侧栏起点定位按源码范围跳过无关绑定，找到首个可见字符即停止，不再为每条批注遍历全部 KP 行节点。

滚动计时从 \`scrollTo\` 到下一次 rAF；缩放计时包含窗口宽度更新、协议开销和下一次 rAF。KP 在缩放时仍有额外成本，但本轮未复现此前的长时间卡顿。这是本机 Chromium 的结果，不代表物理设备输入延迟或任意插件下的性能保证。原始样本和精确测量边界见 [layout.json](../../benchmarks/results/layout.json)。

\`\`\`sh
pnpm build:playground
pnpm preview:playground --port 4174
# 在另一个终端执行，避免同时构建或测试：
pnpm exec tsx benchmarks/layout.ts
BENCH_URL=http://127.0.0.1:4174/LiMR pnpm exec tsx benchmarks/streaming-browser.ts
\`\`\`

准备阶段将字形测量、断词、合法断点与前缀和独立于行宽缓存。渲染使用每行的词间距片段，减少逐空格 DOM；宽度变化时，断点不变则原位调整间距，断点变化则复用文本容器。同步测量共用一个 Range，避免后续 DOM 修改维护大量尚未回收的活动 Range。高亮几何缓存为段落局部坐标，KP 的相邻绘制片段按行合并，集中读写避免每个矩形强制布局。视口蒙层坐标不向正文继承。滚动保留已排版节点，不重复求解段落。
`,vO=`# 插件模块包

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/plugin-packages) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/plugin-packages.md)

一个插件包导出返回 RendererExtension 的工厂，消费者安装后通过 plugins 追加。插件可同时提供语法、标注、动作和参数，CSS 独立导出。它不需要修改 LiMR 源码。

## 可复制模板

完整模板位于 [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md)，包含 TypeScript 源码、类型构建、CSS、package.json 和 tsup 配置。它演示 reading-tip 区块、example:note 卡片和保存选区动作。

安装 LiMR 后，在应用目录执行：

\`\`\`sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
\`\`\`

源码仓库中的对应路径为 skills/limr-plugin-development/assets/plugin-template。替换模板的 @example 包名、扩展名、类型名和动作 ID，再实现业务数据与 UI；模板的 private: true 用于防止示例名被误发布，不影响本地打包。

## 包契约

| 字段 | 要求 |
| --- | --- |
| type | module |
| exports["."] | import 指向 ESM，types 指向 .d.ts |
| exports["./styles.css"] | 插件需要 CSS 时显式导出 |
| files | 包含构建输出与使用说明 |
| sideEffects | CSS 使用 ["**/*.css"]，避免被构建工具移除 |
| peerDependencies | @linloir/limr、react；直接依赖 react-dom API 时再声明 react-dom |
| 构建 external | LiMR、React、react/jsx-runtime，以及使用到的 React DOM 入口 |

LiMR 或 React 的第二份内置副本会破坏上下文/Hook 共享。不要打包宿主依赖，不要深度导入 LiMR 内部文件。参数声明合并必须随导出的类型分发。

## 在应用中引入

下方 @example 包来自模板，并未发布到 npm。先安装本地打出的归档；生成文件名以 npm pack 输出为准：

\`\`\`sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
\`\`\`

\`\`\`tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: '阅读笔记' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
\`\`\`

真实第三方包使用它的包名和 peer 版本约束。改写已存在的默认模块使用 extensions + replaceExtension，不要重复注册同一标签。字体、公式样式、持久化和应用服务仍由宿主配置。

## 验证可分发性

本地类型检查通过后，还需把真实 tgz 安装到独立消费者中：检查公开导入、SSR、CSS 资源、默认模块仍可用和新增交互。支持 React 18/19 的包应分别验证两种宿主。语法插件检查流式结束与一次性解析等价；交互插件检查桌面侧栏、窄屏浮层、键盘、异步取消和两种主题。

LiMR 仓库的 [reading-tools](../../examples/packages/reading-tools/index.js) 和 [paper-theme](../../examples/packages/paper-theme/index.css) 是另一组可打包示例。AI 可使用[插件开发 Skill](ai-skills.md)，其中的模板可独立复制，引用文件无需依赖本仓库路径。
`,xO=`# 样式与字体

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/styles) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/styles.md)

## 基础样式和主题

默认 CSS 在 \`@layer limr\` 中，宿主普通 CSS 可覆盖。选择 styles.css（带 Maple）或 styles/base.css（不加载 Maple）；公式另加 math.css。

\`\`\`tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles/base.css';
import './paper.css';

export function Paper({ source }: { source: string }) {
  return <Reader source={source} appearance="paper" theme="auto" />;
}
\`\`\`

paper.css 示例：

\`\`\`css
[data-limr-appearance='paper'] {
  --limr-font-text: Georgia, 'Noto Serif SC', serif;
  --limr-content-width: 820px;
  --limr-accent: #8b6548;
}
[data-limr-appearance='paper'][data-limr-theme='dark'] {
  --limr-accent: #d1ab84;
}
\`\`\`

appearance 会传给 portal 中的浮层/工具栏；不要只用 \`.limr-reader .your-selector\` 匹配这些元素。theme: auto 通过系统偏好选择内置主题；自定义 auto 深色覆盖还需对应 prefers-color-scheme 媒体规则。独立 CSS 包示例见 [paper-theme](../../examples/packages/paper-theme/index.css)。

## 常用变量

| 变量 | 用途 |
| --- | --- |
| --limr-font-text / --limr-font-code | 正文 / 代码字体 |
| --limr-font-size / --limr-line-height | 基础排版 |
| --limr-font-features | 正文默认 normal，保留中文全角标点；可显式设置 'palt' 1 启用比例标点 |
| --limr-punctuation-spacing | 默认 space-all，保留连续中文标点的全角空白 |
| --limr-emphasis-spacing / --limr-list-item-gap | 斜体末尾 / 列表间距 |
| --limr-text / --limr-heading / --limr-secondary / --limr-muted | 文字层次 |
| --limr-background / --limr-surface / --limr-border | 背景和边框 |
| --limr-link / --limr-accent / --limr-selection | 链接、激活、选区 |
| --limr-content-width / --limr-reader-width | 正文 / 总宽，默认 900px / 1800px |
| --limr-toc-width / --limr-sidebar-width / --limr-column-gap | 侧栏宽度与列间隔 |
| --limr-sticky-top | 吸顶偏移 |
| --limr-reader-bottom-space / --limr-reader-min-height | 短正文高度与底部预留 |
| --limr-sidebar-padding-inline / --limr-sidebar-reference-gap | 侧栏内容统一留白（10px）和关联区间隔（1px） |
| --limr-overlay-duration / --limr-overlay-morph-duration | 浮层进退（560ms）和预览/展开转换（480ms） |
| --limr-overlay-z / --limr-toolbar-z | 浮层层级 |
| --limr-overflow-fade-size | 溢出渐隐，默认 24px，0px 关闭 |
| --limr-toolbar-panel-max-height | 工具栏面板高度上限 |
| --limr-tool-icon-size / --limr-mark-size | 工具图标 / 正文角标尺寸 |
| --limr-mermaid-max-height | 图表视口最大高度；默认 min(70vh, 36rem) |
| --limr-mermaid-scrollbar | 图表细滚动条颜色；默认 #87837866 |

runtime 测量的 --limr-toolbar-available-height、--limr-toolbar-panel-height、--limr-toc-available-height 是布局输出，不应由主题覆盖。sidebar 的局部颜色通常由 AnnotationType.sidebar 配置提供，见[扩展开发](extensions.md)。

## 字体和资源体积

Maple Mono NF CN v7.9 的本地 WOFF2 子集随包分发，衍生字体名为 LiMR Maple Mono NF CN，OFL 许可证随资源提供。unicode-range 和 font-display: swap 限制运行时按需请求，但完整字体资产仍约 31MB，base.css 只避免浏览器加载，不减少 npm 安装体积。

正文不自动加载中文字体；可使用系统回退、自托管或宿主选定的字体服务。Playground 的 Noto Serif SC 是演示项目依赖。不要假定任何字体覆盖所有文字。

默认字体/公式样式不依赖外部 CDN。带哈希的字体资源可由宿主设置长期 immutable 缓存；库无法替服务器设置 HTTP 缓存头。远程图片、视频和插件请求由内容和宿主决定。

## 布局与交互约定

同步侧栏的高度由阅读区域决定，不能用所有卡片总高撑大页面。模块只控制自己的内容，骨架负责灰色关联区、摘要与卡片外壳；避免重复 padding 或空段落补偿。大卡片从预览位置过渡，减少动态效果设置会关闭动画。

密集的文末引用在静止时向上借用空余空间。悬浮或激活时优先对齐当前条目，允许邻项在边缘裁切；角标悬浮时可压缩可选摘要，为关联区和标题留出空间。展开内容受可见阅读区域高度限制，并可在卡片内滚动。侧栏条目即使被向上收拢，也会反向对齐正文。取消激活后按当前卡片高度平滑回位，使用 \`--limr-motion-slow\` 和 \`--limr-ease\`，保持卡片间距与页面高度。

选区保留原生浏览器范围与键盘行为，绘制层只计算可见片段。代码支持局部高亮，公式整体选择，图片高亮使用边框。单个整块选区的工具栏定位在块下方。打印隐藏绘制层并保留正文。移动端自动化检查不等于 iOS/Android 原生拖动手柄和真机验收。

选区工具栏的复制反馈使用淡入淡出与轻微缩放。按钮文字宽度随当前状态增长或收缩，均通过 \`--limr-ease\` 非线性过渡；减少动态效果设置会关闭这些过渡。

Mermaid 图像支持拖拽平移、触摸和触控板滚动、方向键、Page Up/Down、Home/End，以及 Shift＋滚轮横向移动；单击或 Enter 整块选择，拖动不会选中内部文字。缩放仅改变有限高度视口内的内容。共享磨砂工具栏在悬浮或获得焦点时显示，触屏常显；按钮只做背景淡入，不缩放。源码模式保留正常顶部内边距。主题和插件可在 Reader 或图表块上覆盖最大高度与滚动条变量。

## 仅 CSS 的独立主题

包可导出 CSS，files 包含 CSS，sideEffects 为 \`["**/*.css"]\`；不需要 React 或解析器运行时依赖。规则用独立 appearance 名隔离，覆盖浅色、深色、auto 和 portal，并在同页两个不同主题 Reader 中检查。

展开工具栏面板使用工具栏的全部可用宽度。宽度由当前操作按钮行与可用视口决定，展开内容不参与工具栏的固有宽度计算，不会反向撑大工具栏。高亮样式按钮按文字自然宽度排列，空间不足时整项换行并左对齐。多行下划线需要保持内部 span 为 inline，不把它直接作为 flex 子项。

## 段落排版与流式效果

\`typography="standard"\` 为默认模式；\`justify\` 使用浏览器两端对齐；\`knuth-plass\` 使用 TeX 的 box/glue/penalty 动态规划：四种适配类别、整数 badness、独立平方惩罚、连续与末行断词惩罚，以及 pretolerance、tolerance、emergency 多轮求解。整段求最优解，不使用 beam search 或段落长度截断。默认英文断词采用 Knuth–Liang 模式，Unicode 断行规则同时处理中文标点。字形由浏览器测量，因此不承诺与 TeX PDF 逐像素相同。

\`knuthPlass\` 可配置 \`pretolerance\`、\`tolerance\`、\`linePenalty\`、\`hyphenPenalty\`、\`adjacentDemerits\`、\`doubleHyphenDemerits\`、\`finalHyphenDemerits\`、\`emergencyStretch\`（CSS 像素）、\`looseness\` 和 \`hyphenate\`（\`false\` 或返回单词分段的函数）。核心段落参数沿用 TeX 常用默认值，额外提供 16px 应急伸展量；浏览器适配器默认按字号换算为 3em，仅参与断行评估，可用 \`knuthPlass.emergencyStretch\` 显式覆盖。\`pretty\` / \`normal\` 保留为可选的旧版 CSS 模式。

KP 按需加载，对视口附近的稳定段落排版；离开视口后保留 DOM，宽度变化时复用测量结果与前缀和，更新前保护原生选区。窗口缩小时，屏外缓存行暂时裁切横向溢出，进入视口后完成精确排版；仍被选中的段落暂时允许换行并保留原生选区。流式尾段稳定后再排版，不改变源码、标注位置或复制内容。滚动和缩放对照见[性能](performance.md)，算法依据见 [TeX 源码](https://github.com/TeX-Live/texlive-source/blob/trunk/texk/web2c/tex.web)。测量准备与断行分离的设计也参考了 [Typst 的增量排版实现](https://github.com/typst/typst/tree/main/crates/typst-layout/src/inline)。

默认 loading 使用固定 32×32 viewBox、22px 显示尺寸、粗轨道和伸缩弧线；旋转、增长、收缩均为非线性缓动，围绕固定圆心运动，颜色跟随 \`--limr-secondary\`。新增文字与特殊块只做透明度淡入，不增加背景色，段落结束时不再次播放出现动画。插件可用 \`streaming.effect\` 替换共享动画，Reader 可用 \`streamEffect\` 单独覆盖。

源码高亮的默认蓝色由 \`--limr-inline-highlight\` 控制，也可通过 \`inlineHighlights({ color })\` 替换模块。默认只读工具栏的说明可用 \`locale.inlineHighlightHint\` 本地化。
`,wO='# 默认语法\n\n> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/syntax) 可获得最佳阅读体验。\n\n[文档目录](README.md) · [English](../en/syntax.md)\n\n**模块**是为 LiMR 增加一组能力的配置对象，例如公式、视频或引用。下面的“创建函数”在应用代码中调用，返回模块对象；“模块名”是对象的 `name` 字段，用于替换和移除；“标签 / 指令”才是写在 Markdown 正文中的语法。完整概念和配置方式见[内置模块](modules.md)。\n\n`@linloir/limr` 随包提供以下默认模块。`Reader`、独立 `Markdown` 和 `DocumentProvider` 默认通过 `standard()` 全部启用；纯核心 `createDocument()` 默认只有 CommonMark。下面每节给出源码和实际效果，交互示例由 LiMR 自己渲染。\n\n## 模块清单\n\n| 创建函数（应用代码） | 模块名（name） | 默认能力 | 注册的特殊标签 / 指令 |\n| --- | --- | --- | --- |\n| `gfm()` | `gfm` | 表格、删除线、任务列表、自动链接、标准脚注 | `::gfm` |\n| `math()` | `math` | 行内与块级公式 | `$…$`、`$$…$$`、`::math` |\n| `codeHighlight()` | `code-highlight` | Shiki 围栏代码高亮 | 标准代码围栏、`::code` / `::code-highlight` |\n| `definition()` | `definition` | 释义 | 标签 / 指令 `definition`、`title`、`content` |\n| `question()` | `question` | 练习题与答案 | 标签 / 指令 `question` 及下文子标签 |\n| `extras()` | `extras` | 拓展阅读 | 标签 / 指令 `extras`、`extra` |\n| `video()` | `video` | 原生视频、YouTube、Bilibili | 标签 / 指令 `video`、`md-video` |\n| `figures()` | `figures` | 图组与图注 | 标签 / 指令 `figures`、`figure`、`figcaption`、`caption`、`img` |\n| `citation()` | `citation` | 引用定义与角标 | 标签 / 指令 `citation`、`ref` |\n| `translations()` | `translations` | 原文、译文与对照 | 标签及指令 `translations`、`origin`、`translation` |\n| `mermaid()` | `mermaid` | 流程图等 Mermaid 图表 | Mermaid 围栏、`::mermaid` |\n| `callout()` | `callout` | 有类型、标题、折叠状态的注释块 | `> [!type]`、`::callout` |\n| `inlineHighlights()` | `inline-highlights` | 源码内嵌高亮 | `==文字==`、`::highlight` |\n| `footnotes()` | `footnotes` | 评论角标和脚注卡片 | `[^id]`、`^[正文]`、`::footnote`、`::footnote-ref` |\n\n这些是 Markdown 中允许的静态标签，不是任意 MDX/HTML 执行环境。使用字符串属性，如 `multi="true"`、`answer="[0,2]"`；不要使用 `answer={[0,2]}`、事件函数或展开属性。未注册 HTML 按文本显示；表达式不执行并可能产生诊断。嵌套块的标签和正文之间保留空行。\n\n## CommonMark 与 GFM\n\n````markdown\n# 标题\n\n**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、`行内代码`。\n\n> 引用块，默认界面标题为 Note / 注释。\n\n- 普通列表\n- [x] 已完成\n- [ ] 未完成\n\n| 名称 | 说明 |\n| --- | --- |\n| LiMR | Markdown renderer |\n\n```typescript\nconst value = 42;\n```\n\n标准脚注[^note]。\n\n[^note]: 以角标和侧栏 / 窄屏卡片显示的脚注内容。\n````\n\n实际效果（可交互）：\n\n#### 标题示例\n\n**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、`行内代码`。\n\n> 引用块，默认界面标题为 Note / 注释。\n\n- 普通列表\n- [x] 已完成\n- [ ] 未完成\n\n| 名称 | 说明 |\n| --- | --- |\n| LiMR | Markdown renderer |\n\n```typescript\nconst value = 42;\n```\n\n标准脚注[^syntax-note]。\n\n[^syntax-note]: 以角标和侧栏 / 窄屏卡片显示的脚注内容。\n\n默认 `[^note]` 显示脚注角标和卡片；移除 `footnotes` 模块后，GFM 仍可渲染传统文末脚注。图片 `![说明](/image.png)` 由普通 Markdown 支持。原始 HTML 不透传到 DOM；需要自定义外观时注册扩展或覆盖 `components`。\n\n## 公式与代码\n\n```markdown\n行内公式：$E = mc^2$。\n\n$$\n\\int_0^1 x^2\\,dx = \\frac{1}{3}\n$$\n```\n\n实际效果（可交互）：\n\n行内公式：$E = mc^2$。\n\n$$\n\\int_0^1 x^2\\,dx = \\frac{1}{3}\n$$\n\n公式需要导入 `@linloir/limr/math.css`；支持通过 `math({ macros, strict })` 配置。代码围栏语言用于 Shiki 高亮。默认接近视口才加载高亮，流式代码等待语法闭合，且原生选区离开代码后再应用高亮；超过默认 100,000 字符、未支持或未在允许列表中的语言保留可读源码。`codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })` 可配置。\n\n## 释义\n\n```markdown\n<definition title="熵">\n\n表示不确定性的量：$H(X)$。\n\n</definition>\n```\n\n实际效果（可交互）：\n\n<definition title="熵">\n\n表示不确定性的量：$H(X)$。\n\n</definition>\n\n富文本标题和指定正文可以使用子标签：\n\n```markdown\n<definition>\n\n<title>**Entropy** / 熵</title>\n\n<content>\n\n正文支持 Markdown。\n\n</content>\n\n</definition>\n```\n\n`title` 属性按文字渲染；富文本用子标签。也可以写 `:::definition{title="熵"}`，以 `:::` 结束。\n\n## 练习题\n\n```markdown\n<question title="哪些是偶数？">\n\n<question-content>请选择所有正确选项。</question-content>\n\n<question-sel-grp multi="true" answer="[0,2]">\n\n<question-sel>2</question-sel>\n\n<question-sel>3</question-sel>\n\n<question-sel>4</question-sel>\n\n</question-sel-grp>\n\n<question-hint>考虑能否被 2 整除。</question-hint>\n\n<question-answer>2 和 4 是偶数。</question-answer>\n\n</question>\n```\n\n实际效果（可交互）：\n\n<question title="哪些是偶数？">\n\n<question-content>请选择所有正确选项。</question-content>\n\n<question-sel-grp multi="true" answer="[0,2]">\n\n<question-sel>2</question-sel>\n\n<question-sel>3</question-sel>\n\n<question-sel>4</question-sel>\n\n</question-sel-grp>\n\n<question-hint>考虑能否被 2 整除。</question-hint>\n\n<question-answer>2 和 4 是偶数。</question-answer>\n\n</question>\n\n答案索引从 **0** 开始。`multi` 默认关闭；`answer` 可以是 JSON 数组或单个索引的字符串。属性优先读取选择组，其次读取 `question`。提示和答案可以单独展开，有答案索引时支持提交、判分和重试。它不连接 AI，也不创建问答标注。\n\n## 拓展阅读\n\n```markdown\n<extras>\n\n<extra title="继续阅读" url="https://example.com/article" desc="背景和补充材料。" />\n\n</extras>\n```\n\n实际效果（可交互）：\n\n<extras>\n\n<extra title="内置模块" url="https://linloir.github.io/LiMR/#/docs/zh-CN/modules" desc="背景和补充材料。" />\n\n</extras>\n\n`extra` 使用 `title`、`url`、`desc`。链接经过内置 URL 过滤。\n\n## 引用卡片\n\n```markdown\n一个来源<ref id="a" />，或一组来源<ref ids=\'["a","b"]\' />。\n\n<ref id="a">带引用的 **原文**</ref>\n\n<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />\n\n<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />\n```\n\n实际效果（可交互）：\n\n一个来源<ref id="a" />，或一组来源<ref ids=\'["a","b"]\' />。\n\n<ref id="a">带引用的 **原文**</ref>\n\n<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />\n\n<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />\n\n`citation` 的 ID 读取 `cite-id`，其次 `id`；说明读取 `desc`，其次 `description`。`ref` 读取 `cite-from-ids`、`ids`、`id`，支持 JSON 数组或逗号分隔字符串。定义本身不占正文位置，同一个定义可以被多个角标引用。\n\nCitation 默认不提供展开大卡片，点击固定预览；摘要按 `summary → description → 安全 URL → title` 回退，去掉 Markdown 标记。正文显示 `description`，没有时显示 `summary`。悬浮或激活时临时高亮引用所在的最近文本块（段落、标题、列表项或表格单元格），不写入已保存高亮；外部范围标注使用绑定范围。配置与存储见[标注与选区](annotations.md)。\n\n## 图片、图组与图注\n\n```markdown\n<figures columns="2" min-width="220" max-width="560" max-height="480">\n\n<figure src="/figures/a.png" alt="实验 A" caption="(a) 实验 A" />\n\n<figure id="experiment-b">\n\n![实验 B](/figures/b.png)\n\n<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>\n\n</figure>\n\n<figcaption>图 1 · 两个实验。</figcaption>\n\n</figures>\n```\n\n实际效果（可交互）：\n\n<figures columns="2" min-width="220" max-width="560" max-height="480">\n\n<figure src="../assets/source.svg" alt="实验 A" caption="(a) 实验 A" />\n\n<figure id="experiment-b">\n\n![实验 B](../assets/rendered.svg)\n\n<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>\n\n</figure>\n\n<figcaption>图 1 · 两个实验。</figcaption>\n\n</figures>\n\n`figure` 可独立使用。图片可以来自 `src` / `url` 属性、内部 Markdown 图片或 `<img src="…" alt="…" />`。每个 figure 放一张图；多张图用 figures。图注可用 `caption` 属性或 `figcaption` / `caption` 子标签，富文本使用子标签。`id` 可作为页内链接目标。\n\n| 属性 | 默认值 | 说明 |\n| --- | --- | --- |\n| `min-width` / `min-height` | 220 / 120 | 决定何时增加列，窄容器优先适应宽度 |\n| `max-width` / `max-height` | 560 / 480 | 保持比例的图片上限；`none` / `false` 取消上限 |\n| `columns` / `cols` | 自动 | 指定列数，最多 24 |\n| `rows` | 自动 | 未指定列数时由图数推导列数 |\n| `responsive` | true | 容器不足时降低显式列数；false 保留列数 |\n| `gap` | 16 | 图组间距，像素 |\n\n尺寸接受非负数字或 `px`。图组限制由子图继承，子图可以覆盖。对应工厂参数为驼峰命名，例如 `figures({ maxHeight: 360, maxWidth: false })`。图片不变形、不裁切图注。单图复制按钮复制图片 URL；图组复制按钮复制 Markdown 源码，不下载图片二进制。\n\n指令示例：\n\n```markdown\n:::figures{columns="2"}\n::figure{src="/a.png" caption="A"}\n::figure{src="/b.png" caption="B"}\n:::\n```\n\n## 视频\n\n```markdown\n<video src="/demo.mp4" provider="native" title="演示" />\n\n<md-video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />\n\n<video url="https://www.bilibili.com/video/BV1xx411c7mD/?p=2" />\n```\n\n`url` 优先于 `src`；`provider` 默认 `auto`，还可以是 `native`、`youtube`、`bilibili`。YouTube 支持 watch、短链接、embed、shorts、live 和起始时间；Bilibili 支持 BV/av 与分 P。支持 `title` 和 `loading`。\n\n**默认 `loading="visible"`**：在视口附近 200px 挂载播放器，不自动播放。`click` 等待点击，`eager` 立即挂载。可以用 `video({ loading: \'click\' })` 设置模块默认值。平台、网络和嵌入权限仍会影响真实播放；不能把本地 iframe 测试当作远程播放保证。自定义平台通过 `video({ resolveUrl })` 接入。\n\n点击加载的视频示例（点击前不创建播放器）：\n\n<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="视频示例" />\n\n## 分段译文\n\n```markdown\n<translations default="both">\n\n<origin>\n\nOriginal **Markdown**.\n\n</origin>\n\n<translation>\n\n翻译后的 **Markdown**。\n\n</translation>\n\n</translations>\n```\n\n实际效果（可交互）：\n\n<translations default="both">\n\n<origin>\n\nOriginal **Markdown**.\n\n</origin>\n\n<translation>\n\n翻译后的 **Markdown**。\n\n</translation>\n\n</translations>\n\n`default` 为 `origin`、`translation` 或 `both`，未指定时默认 `origin`（可用工厂 `defaultMode` 改写）。角标依次切换原文、译文、对照；对照时译文在前。流式输入只有一侧时先显示已有内容。模块不提供自动翻译服务。\n\n全局 `parameters.translationMode` 覆盖各块；传 `onTranslationModeChange` 接受角标发出的更改请求，否则全局模式锁定。设回 `undefined` 恢复各块的本地选择。见[项目集成](integration.md)。\n\n## 选择与替换\n\n工具栏创建的高亮存为 annotation；`==高亮==` 由源码定义，只提供复制工具栏。默认模块的全部已注册标签都支持同名 `::` 指令。自定义标签需注册插件。使用完整清单配置或替换默认模块，见[扩展开发](extensions.md)。\n\n## 双冒号组件写法\n\n所有默认模块都支持 [CoMark 的组件写法](https://comark.dev/syntax/components)，包括嵌套、标量属性和 Markdown 正文：\n\n```md\n::definition{title="定义"}\n支持 **富文本** 的正文。\n::\n\n::question{title="一道题"}\n::question-content\n题目内容。\n::\n::question-answer\n答案内容。\n::\n::\n```\n\n可用名称包括 `gfm`、`definition`、`title`、`content`、`question` 及其已有子标签、`extras`、`extra`、`video`、`md-video`、`figures`、`figure`、`figcaption`、`caption`、`img`、`citation`、`ref`、`translations`、`origin`、`translation`、`code`（别名 `code-highlight`）、`math`、`mermaid`、`callout`、`highlight`、`footnote`、`footnote-ref`。`::code{lang="typescript"}` 与 `::math` 的正文保持字面量。\n\n标准 Markdown 围栏、JSX、单冒号行内指令和原有三冒号容器继续可用。最终文档中没有配对闭合的双冒号行，保留原有 leaf directive 语义。这里兼容的是组件语法，不包含 CoMark 的 YAML 属性、命名插槽和 frontmatter。\n\n流式过程中，半截头部、链接、行内代码/强调/公式符号和表头会暂缓显示；已识别但未闭合的组件携带 `incomplete`，由模块选择 loading 或渐进内容。代码围栏和块公式可在闭合前展示。结束时设置 `streaming={false}` 或调用 `finish()`，恢复普通 Markdown 的最终解释。所有范围始终对应未改写的原始输入。\n\n## Mermaid 图表\n\n````markdown\n```mermaid\nflowchart LR\n  A[开始] --> B{准备好了吗}\n  B --> C[继续阅读]\n```\n````\n\n也可使用 `::mermaid`。流式闭合前显示 loading，完成后异步加载 Mermaid 并淡入图像。背景与公式块一致，右上角共用圆角工具栏提供复制源码、放大、缩小、源码 / 图像切换。选区、高亮和角标以整张图为单位；源码视图不改变这个原子选择约定。图表使用 Mermaid strict 模式，不执行图中的交互回调。\n\n实际效果：\n\n```mermaid\nflowchart LR\n  A[开始] --> B{准备好了吗}\n  B --> C[继续阅读]\n```\n\n图像模式支持拖动平移、方向键、Page Up/Down、Home/End 和滚轮，Shift + 滚轮横向移动；点击或 Enter 整块选择，选区工具栏位于块下方。放大后的内容在最大高度内滚动，`--limr-mermaid-max-height` 默认 `min(70vh, 36rem)`。操作栏“复制”获取图表正文，选区工具栏及浏览器复制保留完整围栏或指令。详见[样式与字体](styles.md)和[整体复制](annotations.md)。\n\n## Callout 与嵌套注释\n\n```markdown\n> [!tip]+ 自定义标题\n> 提示正文。\n>\n> > 普通的嵌套注释。\n> >\n> > > [!warning]- 可折叠的提醒\n> > > 支持 **Markdown**。\n```\n\n默认类型为 `note`、`abstract`、`info`、`todo`、`tip`、`success`、`question`、`warning`、`failure`、`danger`、`bug`、`example`、`quote`，别名对齐 Obsidian：summary/tldr、hint/important、check/done、help/faq、caution/attention、fail/missing、error、cite。大小写不敏感，未知类型沿用 note 外观。`+` 初始展开，`-` 初始折叠；不写符号时为普通块。另支持 `::callout{type="tip" title="标题" fold="-"}`。\n\n实际效果，可展开内部的提醒：\n\n> [!tip]+ 自定义标题\n> 提示正文。\n>\n> > 普通的嵌套注释。\n> >\n> > > [!warning]- 可折叠的提醒\n> > > 支持 **Markdown**。\n\n## 源码高亮与脚注\n\n```markdown\n==默认蓝色高亮==，点击后只能复制。\n\n==有脚注的高亮==[^note]\n\n==内联脚注==^[这里可以写 **Markdown**。]\n\n[^note]: 脚注正文。\n\n    脚注的第二段。\n```\n\n高亮支持内部富文本，转义字符、代码和公式中的 `==` 保持字面量。高亮颜色可由 CSS `--limr-inline-highlight` 或 `inlineHighlights({ color })` 覆盖。工具栏只提供复制按钮和单行提示“Markdown 内嵌高亮，不支持编辑”。\n\n脚注显示圆润评论角标；宽屏为侧栏 item，窄屏为悬浮卡片，标题是“脚注”。紧邻高亮的脚注引用这段高亮，独立脚注引用所在段落；命名脚注可重复引用。`::highlight`、`::footnote{id="note"}` 和 `::footnote-ref{id="note"}` 可表达相同模块的容器形式。移除 `footnotes` 模块可恢复 GFM 的上标和文末脚注。\n\n实际效果，点击高亮或评论角标：\n\n==默认蓝色高亮==，点击后只能复制。\n\n==有脚注的高亮==[^syntax-source-highlight]\n\n==内联脚注==^[这里可以写 **Markdown**。]\n\n[^syntax-source-highlight]: 脚注正文。\n\n    脚注的第二段。\n',SO="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgNDgwIDI0MCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJSZW5kZXJlZCBkb2N1bWVudCI+CiAgPHJlY3Qgd2lkdGg9IjQ4MCIgaGVpZ2h0PSIyNDAiIHJ4PSIxMiIgZmlsbD0iI2VlZjJlYyIvPgogIDxnIGZpbGw9IiMzNjQ2MzMiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLHNlcmlmIj4KICAgIDx0ZXh0IHg9IjMyIiB5PSI2MCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiPk1hcmtkb3duPC90ZXh0PgogICAgPHRleHQgeD0iMzIiIHk9IjEwOCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPlJlYWRhYmxlIHNvdXJjZTwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxNTYiIGZvbnQtc2l6ZT0iMjQiPuKAoiBXcml0ZTwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxOTYiIGZvbnQtc2l6ZT0iMjQiPuKAoiBSZWFkPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",kO="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgNDgwIDI0MCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJNYXJrZG93biBzb3VyY2UiPgogIDxyZWN0IHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiByeD0iMTIiIGZpbGw9IiNmM2YxZWUiLz4KICA8ZyBmaWxsPSIjNWE1NjUwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0Ij4KICAgIDx0ZXh0IHg9IjMyIiB5PSI2MCI+IyBNYXJrZG93bjwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxMDgiPioqUmVhZGFibGUgc291cmNlKio8L3RleHQ+CiAgICA8dGV4dCB4PSIzMiIgeT0iMTU2Ij4tIFdyaXRlPC90ZXh0PgogICAgPHRleHQgeD0iMzIiIHk9IjE5NiI+LSBSZWFkPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",TO=Object.assign({"../docs/en/README.md":Zj,"../docs/en/ai-skills.md":Kj,"../docs/en/annotations.md":Qj,"../docs/en/api.md":Wj,"../docs/en/architecture.md":eO,"../docs/en/extensions.md":tO,"../docs/en/getting-started.md":nO,"../docs/en/integration.md":iO,"../docs/en/modules.md":aO,"../docs/en/performance.md":rO,"../docs/en/plugin-packages.md":oO,"../docs/en/styles.md":lO,"../docs/en/syntax.md":sO,"../docs/zh-CN/README.md":uO,"../docs/zh-CN/ai-skills.md":cO,"../docs/zh-CN/annotations.md":dO,"../docs/zh-CN/api.md":hO,"../docs/zh-CN/architecture.md":fO,"../docs/zh-CN/extensions.md":mO,"../docs/zh-CN/getting-started.md":pO,"../docs/zh-CN/integration.md":gO,"../docs/zh-CN/modules.md":yO,"../docs/zh-CN/performance.md":bO,"../docs/zh-CN/plugin-packages.md":vO,"../docs/zh-CN/styles.md":xO,"../docs/zh-CN/syntax.md":wO}),AO=Object.assign({"../docs/assets/rendered.svg":SO,"../docs/assets/source.svg":kO}),Uu=[["README","文档概览","Overview"],["getting-started","快速开始","Getting started"],["modules","内置模块","Built-in modules"],["syntax","默认语法","Default syntax"],["integration","项目集成","Application integration"],["annotations","标注与选区","Annotations and selection"],["extensions","扩展开发","Extension development"],["plugin-packages","插件模块包","Plugin packages"],["styles","样式与字体","Styles and fonts"],["api","API 参考","API reference"],["architecture","架构与行为","Architecture and behavior"],["performance","性能与限制","Performance and limits"],["ai-skills","AI Skills","AI Skills"]];function ro(t,i="README",a){return`#/docs/${t}/${i}${a?`?heading=${encodeURIComponent(a)}`:""}`}function aw(t="zh-CN"){if(!location.hash.startsWith("#/docs"))return null;const[i,a=""]=location.hash.slice(1).split("?"),o=i.split("/");return{language:o[2]==="en"?"en":o[2]==="zh-CN"?"zh-CN":t,page:Uu.some(([s])=>s===o[3])?o[3]:"README",heading:new URLSearchParams(a).get("heading")??void 0}}function EO(t,i){const a=gn(t);if(!a)return;const o=/^https:\/\/linloir\.github\.io\/LiMR\/downloads\/(limr-[\w.-]+\.zip)$/.exec(a);if(o)return`/LiMR/downloads/${o[1]}`;if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(a))return a;const s=new URL(a,`https://docs.local/docs/${i.language}/${i.page}.md`),c=/^\/docs\/(zh-CN|en)\/([\w-]+)\.md$/.exec(s.pathname);return c&&Uu.some(([u])=>u===c[2])?ro(c[1],c[2],s.hash.slice(1)):s.pathname==="/README.md"||s.pathname==="/docs/README.md"?ro("zh-CN"):s.pathname==="/README.en.md"?ro("en"):`https://github.com/Linloir/LiMR/blob/main${s.pathname}${s.hash}`}function CO({route:t,theme:i}){const[a,o]=L.useState(!1),s=L.useRef(null),c=t.language==="zh-CN",u=TO[`../docs/${t.language}/${t.page}.md`],d=`docs-${t.language}-${t.page}`,p=L.useMemo(()=>({image:({node:f})=>{const y=new URL(String(f.url??""),`https://docs.local/docs/${t.language}/${t.page}.md`).pathname;return b.jsx("img",{src:AO[`..${y}`]??gn(f.url,!0),alt:String(f.alt??""),title:f.title?String(f.title):void 0,loading:"lazy",decoding:"async"})},link:({node:f,children:y})=>{const g=EO(f.url,t),x=g?.startsWith("https://");return b.jsx("a",{href:g,target:x?"_blank":void 0,rel:x?"noopener noreferrer":void 0,children:y})}}),[t.language,t.page]);return L.useEffect(()=>{o(!1);const f=requestAnimationFrame(()=>{const y=t.heading&&document.getElementById(`${d}-${t.heading}`);y?y.scrollIntoView():window.scrollTo({top:0,behavior:"instant"}),s.current?.focus({preventScroll:!0})});return()=>cancelAnimationFrame(f)},[d,t.heading]),b.jsxs("div",{className:"demo-docs","data-limr-appearance":"classic",children:[b.jsxs("aside",{className:"demo-docs-directory",children:[b.jsx("div",{className:"demo-docs-directory-heading",children:c?"文档目录":"Documentation"}),b.jsxs("button",{type:"button",className:"demo-docs-toggle","aria-controls":"demo-docs-navigation","aria-expanded":a,onClick:()=>o(f=>!f),children:[b.jsxs("span",{className:"limr-underline",children:[c?"文档目录":"Documentation"," · ",Uu.find(([f])=>f===t.page)?.[c?1:2]]}),b.jsx(yt,{name:"chevron"})]}),b.jsx("nav",{id:"demo-docs-navigation",className:"demo-docs-links","data-open":a||void 0,"aria-label":c?"文档目录":"Documentation",children:Uu.map(([f,y,g])=>b.jsx("a",{href:ro(t.language,f),"aria-current":t.page===f?"page":void 0,children:b.jsx("span",{className:"limr-underline",children:c?y:g})},f))})]}),b.jsxs("div",{className:"demo-docs-article",ref:s,tabIndex:-1,lang:t.language,children:[t.page==="ai-skills"&&b.jsxs("div",{className:"demo-controls demo-docs-downloads",children:[b.jsxs("a",{href:"/LiMR/downloads/limr-use.zip",download:!0,children:[b.jsx(yt,{name:"note"}),b.jsxs("span",{className:"limr-underline",children:[c?"下载":"Download"," limr-use"]})]}),b.jsxs("a",{href:"/LiMR/downloads/limr-plugin-development.zip",download:!0,children:[b.jsx(yt,{name:"note"}),b.jsxs("span",{className:"limr-underline",children:[c?"下载":"Download"," limr-plugin-development"]})]})]}),b.jsx(sn,{documentId:d,source:u??"# Document unavailable",components:p,locale:c?Vn:Cu,theme:i,toc:!1,sidebar:!1,fillHeight:!1},d)]})]})}const lm=[{type:"margin-note",label:"旁注",icon:"comment",color:"#81B29A",hint:"在段落旁留下一个想法",labelEn:"Margin note",hintEn:"Leave a thought beside this passage"},{type:"reading-note",label:"笔记",icon:"note",color:"#6B9BD2",hint:"整理这一段的阅读笔记",labelEn:"Note",hintEn:"Write a reading note"},{type:"reader-question",label:"提问",icon:"question",color:"#E5A06E",hint:"写下还想进一步理解的问题",labelEn:"Question",hintEn:"What would you like to understand?"},{type:"reader-footnote",label:"脚注",icon:"footnote",color:"#B39DDB",hint:"补充解释或参考来源",labelEn:"Footnote",hintEn:"Add an explanation or a source"}];function RO({annotation:t,data:i,editing:a,presentation:o}){const s=Bm(),c=ln(),u=c.language?.startsWith("zh")??!1,d=i?.draft??i?.text??"",p=a||i?.draft!==void 0,f=L.useRef(null),y=lm.find(v=>v.type===t.type);L.useEffect(()=>{if(!p||o==="preview")return;const v=requestAnimationFrame(()=>{const w=f.current;w&&(w.focus({preventScroll:!0}),w.selectionStart=w.selectionEnd=w.value.length)});return()=>cancelAnimationFrame(v)},[p,o]),L.useLayoutEffect(()=>{const v=f.current;if(!v)return;const w=()=>{v.style.height="auto",v.style.height=`${v.scrollHeight}px`};w();let A=v.clientWidth;const T=new ResizeObserver(()=>{v.clientWidth!==A&&(A=v.clientWidth,w())});return T.observe(v.parentElement),()=>T.disconnect()},[p,d]);const g=()=>{d.trim()&&(s.updateAnnotation(t.id,{data:{text:d}}),s.editAnnotation(null))},x=()=>{i?.text.trim()?(s.updateAnnotation(t.id,{data:{text:i.text}}),s.editAnnotation(null)):s.removeAnnotation(t.id)};return b.jsx("div",{className:"demo-note-content","data-limr-card-interactive":"true",children:p?b.jsxs("form",{onSubmit:v=>{v.preventDefault(),g()},children:[b.jsx("textarea",{className:"demo-note-editor",ref:f,"aria-label":u?`${y.label}内容`:`${y.labelEn} content`,rows:1,value:d,onChange:v=>s.updateAnnotation(t.id,{data:{text:i?.text??"",draft:v.target.value}}),placeholder:u?y.hint:y.hintEn,onKeyDown:v=>{v.nativeEvent.isComposing||(v.key==="Escape"?(v.preventDefault(),v.stopPropagation(),x()):v.key==="Enter"&&(v.metaKey||v.ctrlKey)&&(v.preventDefault(),g()))}}),b.jsxs("div",{className:"demo-note-actions",children:[b.jsxs("button",{type:"button",onClick:x,children:[b.jsx(yt,{name:"close"}),b.jsx("span",{className:"limr-underline",children:u?"取消":"Cancel"})]}),b.jsxs("button",{type:"submit",className:"demo-note-submit",disabled:!d.trim(),children:[b.jsx(yt,{name:"check"}),b.jsx("span",{className:"limr-underline",children:c.submit})]})]})]}):b.jsxs(b.Fragment,{children:[b.jsx(ac,{source:i?.text||(u?"还没有内容。":"No content yet.")}),b.jsxs("div",{className:"demo-note-actions",children:[b.jsxs("button",{type:"button",onClick:()=>{s.updateAnnotation(t.id,{data:{text:i?.text??"",draft:i?.text??""}}),s.editAnnotation(t.id)},children:[b.jsx(yt,{name:"edit"}),b.jsx("span",{className:"limr-underline",children:u?"修改":"Edit"})]}),b.jsxs("button",{type:"button",className:"demo-note-delete",onClick:()=>s.removeAnnotation(t.id),children:[b.jsx(yt,{name:"trash"}),b.jsx("span",{className:"limr-underline",children:c.deleteAnnotations})]})]})]})})}function MO({data:t}){const i=ln();return b.jsx("span",{children:t?.text||(i.language?.startsWith("zh")?"正在编辑…":"Editing…")})}function w1(){return{name:"reading-notes",annotationTypes:lm.map(t=>({type:t.type,label:i=>i.language?.startsWith("zh")?t.label:t.labelEn,color:t.color,icon:b.jsx(yt,{name:t.icon}),Content:RO,sidebar:{Preview:MO},overlay:{previewWidth:300,expand:{placement:"center",width:400,maxHeight:"75dvh"}}})),actions:lm.map(t=>({id:`reading-notes:${t.type}`,label:i=>i.locale.language?.startsWith("zh")?t.label:t.labelEn,icon:b.jsx(yt,{name:t.icon}),run:i=>{i.addAnnotation({id:`note-${crypto.randomUUID()}`,type:t.type,data:{text:"",draft:""},anchors:i.selection.syntax.ranges.map(a=>({range:a,documentId:i.document.id,quote:i.document.source.slice(a.start,a.end)}))},{edit:!0}),i.clearSelection()}}))}}const pi="/LiMR/papers/feature-channel.png",NO=Im().filter(t=>t.name!=="footnotes"),DO=`# Figures and translations

[Jump to figure](#target-figure) · Footnote[^note]

<figures id="auto-grid">

<figure src="${pi}" caption="First panel" />
<figure src="${pi}" caption="Second panel" />
<figure src="${pi}" caption="Third panel" />

<figcaption>A group caption with **Markdown**.</figcaption>

</figures>

<figures id="manual-grid" columns="3" rows="1">

<figure src="${pi}" />
<figure src="${pi}" />
<figure src="${pi}" />

</figures>

<figures id="fixed-grid" columns="3" responsive="false">

<figure src="${pi}" />
<figure src="${pi}" />
<figure src="${pi}" />

</figures>

<translations default="origin">

<origin>

Original **source-mapped text** with a [link](#target-figure).

</origin>

<translation>

译文包含 **可选择的内容**。

另一段译文，用于观察展开时下方正文的移动。

</translation>

</translations>

## Following paragraph

${Array.from({length:12},()=>"Following text makes a longer reading surface. ".repeat(8)).join(`

`)}

<figure id="target-figure" max-height="180" src="${pi}" caption="Destination" />

[^note]: A footnote destination.
`;function jO(){const[t,i]=L.useState(900),[a,o]=L.useState(),[s,c]=L.useState(null),u=new URLSearchParams(location.search).has("nested");return b.jsxs(b.Fragment,{children:[b.jsxs("div",{children:[b.jsxs("label",{children:["Width",b.jsx("input",{"aria-label":"Reader width",type:"number",value:t,onChange:d=>i(Number(d.target.value))})]}),b.jsxs("select",{"aria-label":"Translation mode",value:a??"local",onChange:d=>o(d.target.value==="local"?void 0:d.target.value),children:[b.jsx("option",{value:"local",children:"Local"}),b.jsx("option",{value:"origin",children:"Origin"}),b.jsx("option",{value:"translation",children:"Translation"}),b.jsx("option",{value:"both",children:"Both"})]})]}),b.jsx("div",{ref:u?c:void 0,"data-testid":"media-scroll",style:{width:"100%",height:u?520:void 0,overflow:u?"auto":void 0},children:b.jsx("div",{style:{width:t,maxWidth:"100%",margin:"0 auto"},children:b.jsx(sn,{source:DO,extensions:NO,scrollRoot:u?s:null,toc:!1,sidebar:!1,parameters:{translationMode:a,onTranslationModeChange:o}})})}),b.jsx("div",{"data-testid":"isolated",children:b.jsx(ni,{source:`<translations>

<origin>Isolated original</origin>

<translation>独立译文</translation>

</translations>`})})]})}function OO(){const[t,i]=L.useState(null);return b.jsxs(b.Fragment,{children:[b.jsx(sn,{source:`<translations>

<origin>

## Original heading

Original **selectable** words.<ref id="paired" />

</origin>

<translation>

## 译文标题

中文 **可选择** 内容。<ref id="paired" />

</translation>

</translations>

<citation id="paired" title="Paired reference" description="Only visible occurrences belong in the sidebar." />`,onSelectionChange:i}),b.jsx("output",{"data-testid":"translation-selection",hidden:!0,children:JSON.stringify(t)})]})}const LO=[w1()],rw=`Before the figures.

<figures id="annotation-grid" columns="2" responsive="false" max-width="300" max-height="300" min-width="80" min-height="60">

<figure id="first-panel" src="/LiMR/papers/feature-channel.png" caption="First panel caption." />

<figure id="second-panel">

![Wide panel](/LiMR/papers/feature-diversity.png)

<figcaption>Second **panel caption**.</figcaption>

</figure>

<figcaption>Overall **group caption**.</figcaption>

</figures>

<figure id="attribute-order" caption="Caption before source." src="/LiMR/papers/feature-neuron.png" max-height="120" />

After the figures.

$$
x^* = \\arg\\max_x a_c(x)
$$

标记应当紧跟前面的文字，最后一个字符和多个角标一起换行。

English markers follow the final word.

<translations>

<origin>Translation controls follow the final word.</origin>

<translation>译文状态的图标同样跟随末尾文字。</translation>

</translations>`;function zO(){const[t,i]=L.useState(800),[a,o]=L.useState(1),[s,c]=L.useState([]),[u,d]=L.useState(null),p=["一起换行。","final word."].flatMap((f,y)=>{const g=rw.indexOf(f);return Array.from({length:a},(x,v)=>({id:`line-${y}-${v}`,type:"citation",range:{start:g,end:g+f.length},data:{title:`Line note ${v+1}`}}))});return b.jsxs(b.Fragment,{children:[b.jsxs("div",{children:[b.jsxs("label",{children:["Width",b.jsx("input",{"aria-label":"Reader width",type:"number",value:t,onChange:f=>i(Number(f.target.value))})]}),b.jsxs("label",{children:["Markers",b.jsx("input",{"aria-label":"Marker count",type:"number",value:a,onChange:f=>o(Number(f.target.value))})]})]}),b.jsx("div",{style:{width:t,maxWidth:"100%",marginInline:"auto"},children:b.jsx(sn,{documentId:"media-annotations",source:rw,locale:Vn,plugins:LO,toc:!1,sidebar:!1,annotations:[...p,...s],onAnnotationsChange:f=>c(f.filter(y=>!y.id.startsWith("line-"))),onSelectionChange:d})}),b.jsx("output",{"data-testid":"media-selection",hidden:!0,children:JSON.stringify(u)}),b.jsx("output",{"data-testid":"media-annotations",hidden:!0,children:JSON.stringify(s)})]})}const ow=b.jsx("svg",{viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:b.jsx("path",{d:"m8 2 1.8 4.2L14 8l-4.2 1.8L8 14l-1.8-4.2L2 8l4.2-1.8L8 2Z",fill:"currentColor"})});function Xm({adapter:t,type:i="assistant",label:a="Ask assistant",icon:o=ow,color:s="#8b5cf6",prompt:c=u=>`Explain “${u.text}”`}){function u(f){return b.jsx(ic,{...f,title:a})}function d({data:f}){return b.jsxs("div",{"aria-busy":f?.status==="streaming",children:[b.jsx(ac,{source:f?.text||"…",streaming:f?.status==="streaming"}),f?.status==="error"&&b.jsx("p",{role:"alert",children:f.error})]})}function p({data:f,referenceText:y}){const g=f?.question||y;return g?b.jsx("span",{title:g,children:g}):null}return{name:i,annotationTypes:[{type:i,label:a,icon:o,color:s,Content:d,sidebar:{Preview:p},overlay:{Card:u,expand:{placement:"center",width:680,height:"80dvh"}}}],actions:[{id:`${i}:ask`,label:a,icon:o??ow,async run(f){const y=`${i}-${crypto.randomUUID()}`,g=c(f.selection);let x="";f.addAnnotation({id:y,type:i,data:{text:x,question:g,status:"streaming"},anchors:f.selection.syntax.ranges.map(v=>({range:v,documentId:f.document.id,quote:f.document.source.slice(v.start,v.end)}))}),f.activateAnnotation(y),f.clearSelection();try{for await(const v of t.answer({selection:f.selection,question:g,signal:f.signal})){if(f.signal.aborted)return;x+=v,f.updateAnnotation(y,{data:{text:x,question:g,status:"streaming"}})}f.signal.aborted||f.updateAnnotation(y,{data:{text:x,question:g,status:"complete"}})}catch(v){f.signal.aborted||f.updateAnnotation(y,{data:{text:x,question:g,status:"error",error:v instanceof Error?v.message:String(v)}})}}}]}}const S1=`# 阅读，从容一点

LiMR 将正文、目录、引用和选区连接在一起。这里的 **重要内容** 可以被选中、复制或高亮；界面会保留你正在阅读的位置。

## 排版与细节

有些内容值得慢慢读。清晰的段落、适度的留白和安静的色彩，让注意力留在文字本身。支持中文、English、emoji 🌱 与行内代码 \`const reader = createDocument(source)\`。

> 阅读不仅是获取信息，也是将不同想法联系起来的过程。

<ref cite-from-ids='["commonmark"]'>标准化的 Markdown 语法，让同一份内容可以在不同应用间流动。</ref>

<citation cite-id="commonmark" title="CommonMark Specification" url="https://spec.commonmark.org/" desc="Markdown 的语法与参考示例。支持 **富文本** 描述。" />

### 表格与列表

| 能力 | 默认支持 | 可以替换 |
| :--- | :---: | :---: |
| 引用角注 | ✓ | ✓ |
| 自定义语法 | ✓ | ✓ |
| 高亮与选区 | ✓ | ✓ |

- [x] 原始 Markdown 坐标
- [x] 长文与流式输出
- [ ] 留出新的想法

## 公式与代码

行内公式 $E = mc^2$ 与独立公式使用相同的渲染能力：

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

\`\`\`typescript
import { Reader, standard, defineBlock } from '@linloir/limr';

const extensions = [
  ...standard(),
  defineBlock({ name: 'notice', component: Notice }),
];
\`\`\`

## 自定义区块

<definition title="渐进式渲染">

<content>

复用已经稳定的区块，更新仍在生成的尾部；当新的引用定义影响前文时，重新处理相关内容。

</content>

</definition>

<question title="哪个部分负责显示正文？">

<question-content>请选择一个组件。</question-content>

<question-sel-grp answer="[0]">

<question-sel>Markdown</question-sel>
<question-sel>TableOfContents</question-sel>

</question-sel-grp>

<question-hint>它也可以独立使用。</question-hint>
<question-answer>**Markdown** 负责正文显示，其余组件按需订阅文档状态。</question-answer>

</question>

<extras>

<extra title="阅读 CommonMark" url="https://spec.commonmark.org/" desc="了解 Markdown 的基础语法。" />

</extras>

## 更远的地方

一个可扩展的阅读器，应该允许应用决定它的用途。菜单动作可以由插件提供，卡片可以是参考资料，也可以是属于你的交互工具。[^design]

[^design]: 插件的内容同样可以使用 LiMR 渲染，并拥有独立的目录和选区作用域。

## 留在同一段文字上的几种想法

读到一个值得停留的句子，不一定要立即决定它属于哪一种笔记。可以先留下一点颜色，再补一个问题；也可以直接写旁注，让它成为以后重新阅读的入口。旁注、笔记、提问与脚注能够同时关联同一片段，各自保存不同的内容。

把鼠标停在工具栏左侧的色块上，可以选择颜色和高亮样式。底色适合提醒，下划线适合强调，点线和波浪线则可以留给仍然开放的问题。已有笔记的片段可以暂时隐藏高亮，文字旁的想法依然保留。

## 从句子到段落

短句能快速传递意思，长段落则给思考留下回旋的空间。阅读界面需要同时容纳这两种节奏：标题提供方向，段落承担推理，引用与脚注让读者能够离开主线，再回到刚才的位置。

当一段话同时包含事实、解释与判断时，可以分别选中它们，留下不同的批注。这不只是分类练习，也是在检验自己是否理解了作者真正说过什么，以及哪些内容是自己补充的推断。

> 有时，理解的进步不是多记住了一句话，而是终于能够把两个原本混在一起的问题分开。

## 让笔记可以继续生长

点击工具栏中的旁注或笔记，会直接打开编辑器。在较宽的窗口中，它与正文并排显示；在手机上，它成为一张可以展开的卡片。写完后保存，再次打开仍然能够修改。

一条笔记可以记录结论，也可以记录结论变化的过程。今天写下的解释，明天可能需要增加一个条件。比起不断创建重复的条目，回到原来的文本旁修订理解，往往更容易看见自己的思考如何发生变化。

## 换一篇文章，继续阅读

顶部的“加载”菜单里提供了更长的练习文本、开源项目的 README、文学作品与论文。代码文档适合检验列表和配置项，小说适合连续阅读，论文适合在论述与表格之间切换。同一个阅读器，可以为这些不同的文本保留一致的操作习惯。

点击“编辑”修改文章，再点击同一位置的“保存”返回阅读，文本和批注就会保存在当前浏览器中。刷新页面会重新打开默认文档；需要继续保存的草稿时，可在“加载”菜单中选择“加载已保存文本”。未保存的编辑和批注不会自动恢复。

## 图片、图注与双语阅读

<figures min-width="160" max-width="240" min-height="120" max-height="240">

<figure src="./papers/feature-neuron.png" alt="单个神经元的优化图像" caption="单个神经元的响应。" />
<figure src="./papers/feature-channel.png" alt="整个通道的优化图像" caption="整个通道的响应。" />

<figcaption>图像来自 Olah、Mordvintsev、Schubert 的 [Feature Visualization](https://distill.pub/2017/feature-visualization/)（2017），CC BY 4.0。更多图文示例在顶部“加载”菜单的论文中。</figcaption>

</figures>

<translations default="both">

<origin>

Read at your own pace. Keep the original close, and let the translation help when you need it.

</origin>

<translation>

按自己的节奏阅读。把原文留在身边，在需要时让译文帮你一把。

</translation>

</translations>
`,_O=`# 逐字抵达

文字可以一边抵达，一边被阅读。点击上方「流式演示」，在代码还没写完时，试着选中已经出现的文字并复制。

## 等一个完整的想法

::definition{title="渐进呈现"}
普通文字和代码可以逐步展开。需要完整信息的组件，先用一个小圆环等待，再呈现自己的内容。格式符号和半截标签留在幕后。
::

## 留住已经选中的内容

::code{lang="typescript"}
const message = "这句话可以在后续内容抵达时复制";

async function read(stream: AsyncIterable<string>) {
  let source = "";
  for await (const chunk of stream) {
    source += chunk;
    console.log(source);
  }
  return source;
}
::

## 公式也能逐渐成形

::math
\\int_0^1 x^2\\,\\mathrm{d}x = \\frac{1}{3}
::

## 保留阅读的节奏

Typography is a sequence of small decisions. Choosing a line break means considering the words that follow, the rhythm of the paragraph, and the space between phrases. A stable stream keeps earlier lines in place while new words arrive; a completed paragraph can take a little more care with its final shape.

::question{title="哪些内容适合渐进呈现？"}
::question-content
代码尚未完成时，已经出现的内容仍然可以阅读和复制。
::
::question-hint
留意已经显示的部分是否保持了相同的位置和选区。
::
::question-answer
可以阅读的中间态持续显示，需要完整数据的模块等待闭合。第三方模块可以自己选择。
::
::

## 等待图表完成

::mermaid
flowchart LR
  A[流式输入] --> B[等待完整语法]
  B --> C[淡入图表]
  C --> D[复制或缩放]
::

## 在段落里留下线索

这段 ==淡蓝色高亮== 可以点击复制。另一段 ==带有脚注的高亮==[^stream-note] 将解释放在侧边；也可以使用 ==内联写法==^[脚注正文支持 **Markdown**，窄屏时会出现在悬浮卡片中。]。

[^stream-note]: 高亮来自 Markdown 源码，所以工具栏只提供复制。脚注与普通标注共用角标、侧栏和窄屏卡片。

> [!tip]+ 嵌套阅读提示
> 文本逐步出现时，只对新增部分淡入。
>
> > 普通注释也可以继续嵌套。
> >
> > > [!example]- 展开看一看
> > > 折叠状态会在后续文本抵达时保留。
`,IO=`# 在文字旁，留下想法

一本书真正属于你，是从写下第一个想法开始的。选中这段话中的 **重要内容**，给它一点颜色，或添上一条旁注。写下来的不必是一段完整的评论，也可以只是一个问题、一个例子，或者一句想在日后重新理解的话。

## 第一遍阅读：先看见结构

开始阅读时，我们常常急于寻找结论。可是结论只有放在论证的路径里才有意义：作者先提出了什么问题，选择了哪些证据，又在哪一步引入了新的假设？第一遍阅读可以放慢标记的速度，把注意力留给段落之间的关系。

一篇文章的结构并不总是写在标题里。有时，一个“然而”意味着视角的转移；一个看似随意的例子，承担着连接抽象概念与生活经验的作用。试着选中这样的转折，写下一条旁注，说明它为什么让你停顿。

## 同一段文字，可以有几种声音

高亮负责提醒你回来，笔记负责记录你回来以后要做什么。它们可以同时留在同一段文字上。添加旁注、笔记、提问或脚注时，这段文字也会得到高亮；之后可以单独隐藏颜色，而保留这些想法。

| 标记 | 适合留下什么 | 下一次阅读时做什么 |
| --- | --- | --- |
| 旁注 | 当下的联想、赞同或疑惑 | 检查理解是否改变 |
| 笔记 | 重新组织过的解释 | 尝试独立复述 |
| 提问 | 尚未解决的问题 | 寻找证据和反例 |
| 脚注 | 来源、背景和补充材料 | 回到原始资料核对 |

你不需要把所有想法塞进一条长笔记。给同一段话添加两个不同类型的标记，可以让“我已经理解的部分”和“我仍然想问的部分”各自保持清晰。

## 让颜色承担一点任务

颜色不是评分。被标成黄色的句子，不一定比没有颜色的句子更重要；它可能只是与你目前的问题有关。选择一个不太复杂的约定，比不断增加分类更容易坚持。

- 暖黄：一个值得记住的结论。
- 雾蓝：需要进一步查证的事实。
- 鼠尾草：能够与已有知识建立联系的地方。
- 玫瑰：值得寻找反例的判断。

底色、下划线、点线和波浪线也可以承担不同的任务。把鼠标移到工具栏左侧的色块，调整高亮的颜色与样式；在手机上，轻点色块即可打开相同的选择。

## 好笔记从复述开始

“这段写得很好”记录了感受，却没有保存理解。试着用自己的语言解释一个观点，并写清楚它成立的条件。如果解释时不得不反复照抄原文，那往往意味着还可以再向前走一步。

> 读懂，不只是能够认出一句话；也包括在它不在眼前时，仍然能说清楚它为什么成立。

例如，读到“系统应当减少状态的重复存储”，可以写下：“同一个事实只保留一个权威来源，界面中的计数、颜色和列表都由它推导。这样修改一个事实时，就不用记住还要同步修改哪些副本。”再补充一个具体的产品例子，这条笔记就有了自己的支点。

## 把问题写得可以回答

“我不懂”是真实的感受，但还不是一个容易推进的问题。可以把它拆开：不懂的是术语、推理过程、证据，还是适用范围？分别提问，能够帮助你判断应该继续读、查资料，还是动手做一个小实验。

1. 作者在这里默认了什么前提？
2. 如果换一种数据或场景，结论还成立吗？
3. 这个例子是在证明结论，还是只在帮助解释？
4. 什么样的观察会让我改变当前的理解？

点击工具栏里的「提问」，直接在打开的卡片中写下一个问题。宽屏时编辑器位于侧栏，小屏时位于展开卡片。保存以后，仍然可以再次编辑或删除。

## 为事实保留回去的路

有些句子需要的不是评价，而是出处。一条脚注可以记下书名、章节、链接与查阅日期，也可以说明原文中被略去的背景。来源越具体，日后核对时就越不依赖当时的记忆。

如果一个论点引用了另一篇文章，可以先保存最初的来源，再用自己的话记录引用发生的语境。这样，当二手解释与原文不一致时，你仍然知道应当回到哪里。

## 第二遍阅读：允许自己改口

一条笔记不需要永久正确。隔几天再次打开文章，发现自己当时忽略了一个限定条件，是理解在发生变化。编辑旧笔记时，可以保留一句“最初我以为……后来发现……”，把变化本身也记录下来。

当你打开一条批注时，其他片段的高亮会暂时淡去，注意力留在当前的文本上。结束这次查看后，它们会重新出现。这种短暂的留白，让密集的标记仍然可以被逐条阅读。

## 一份可以完成的小练习

- [ ] 选出一个观点，用自己的话复述。
- [ ] 给同一片段添加一个问题。
- [ ] 找到一条支持或反对它的证据。
- [ ] 隐藏一次高亮，确认笔记仍然保留。
- [ ] 保存笔记，离开页面后再回来读一遍。

## 留一点没有标记的空间

并不是每次阅读都需要产出。散步时想起的一个句子、读到结尾才明白的一个伏笔，也可以先不写下来。标记的价值，是让你更容易继续与文字相处，而不是让页面看起来已经被认真处理过。

最后，选择一条已经完成使命的笔记，删掉它。保留下来的内容会因此更容易被看见。
`,HO=`# 让复杂的内容，清晰一点

行内公式 $E = mc^2$、代码 \`const answer = 42\` 和普通文字可以在同一个选区里。阅读技术材料时，我们经常需要在推导、程序和解释之间来回移动。下面用一个很小的例子，把这些不同的表达方式放到同一篇文章中。

## 从一个函数开始

设 $f(x)=x^2$。在区间 $[0,1]$ 上，函数的定积分可以直接求得：

$$
\\int_0^1 x^2 \\, dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3}.
$$

这个结果既是解析计算的答案，也可以成为验证数值程序的参照。我们并不需要让程序“证明”积分公式；只需要比较离散近似与已知结果之间的差异，理解步长如何影响误差。

## 离散化与梯形法

把区间等分为 $n$ 份，令 $h=(b-a)/n$，并记 $x_i=a+ih$。梯形公式将曲线下的面积近似为一组梯形面积之和：

$$
T_n = h\\left[\\frac{f(a)+f(b)}{2}+\\sum_{i=1}^{n-1}f(x_i)\\right].
$$

边界的两个函数值只计算一半。这个细节很适合添加一条脚注：每个内部采样点同时属于相邻的两个梯形，而左右端点各自只属于一个梯形。

\`\`\`typescript
function integrate(
  f: (x: number) => number,
  a: number,
  b: number,
  steps = 100,
): number {
  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError('steps must be a positive integer');
  }
  const width = (b - a) / steps;
  let sum = (f(a) + f(b)) / 2;
  for (let index = 1; index < steps; index++) {
    sum += f(a + index * width);
  }
  return sum * width;
}

const estimate = integrate(x => x * x, 0, 1, 100);
console.log({ estimate, error: Math.abs(estimate - 1 / 3) });
\`\`\`

可以只选中循环里的表达式，也可以从上一段说明一直选到代码中的某一行。复制动作保留你实际看到的文字；高亮与批注则绑定对应的原文范围。

## 用误差理解结果

对 $f(x)=x^2$ 而言，这个区间上的梯形公式误差是 $1/(6n^2)$。把采样数翻倍，误差大约缩小到原来的四分之一。表格中的小数只是为了阅读方便而截取，程序内部仍然使用浮点数计算。

| 采样数 $n$ | 近似积分 $T_n$ | 绝对误差 |
| ---: | ---: | ---: |
| 10 | 0.33500000 | 0.00166667 |
| 20 | 0.33375000 | 0.00041667 |
| 100 | 0.33335000 | 0.00001667 |
| 200 | 0.33333750 | 0.00000417 |

> 验证一个数值结果时，先问误差是如何随输入变化的，再问屏幕上打印了多少位小数。

如果你想给这一点留下一个问题，可以选中“误差大约缩小到原来的四分之一”，点击「提问」，再写下：当函数不够光滑时，同样的规律还会成立吗？

## 一个更一般的表达

在许多问题中，我们需要同时处理一组参数。设参数向量为 $\\theta$，损失函数为 $L(\\theta)$，梯度下降的一步更新写作：

$$
\\theta_{t+1}=\\theta_t-\\eta\\nabla L(\\theta_t).
$$

其中 $\\eta$ 是步长。符号看起来很紧凑，但它包含几个独立的决定：如何定义损失，如何计算梯度，如何选择步长，以及什么时候停止更新。分别给这些决定添加笔记，比在公式旁写一大段混合说明更容易重新阅读。

\`\`\`python
from collections.abc import Callable

def descend(gradient: Callable[[float], float], start: float,
            rate: float = 0.1, iterations: int = 20) -> list[float]:
    values = [start]
    for _ in range(iterations):
        values.append(values[-1] - rate * gradient(values[-1]))
    return values

# L(x) = (x - 3)^2, so its derivative is 2(x - 3).
trajectory = descend(lambda x: 2 * (x - 3), start=0)
print(trajectory[-1])
\`\`\`

## 在阅读器中保留这些关系

一个阅读界面需要同时照顾连续阅读与局部操作。代码、公式和表格属于文章的论证，旁注与高亮属于读者的理解过程。两者放在同一个坐标系统里，才容易在以后重新找到关联。

\`\`\`tsx
import { Reader } from '@linloir/limr';
import { useState } from 'react';
import type { Annotation } from '@linloir/limr';

export function ReadingRoom({ source }: { source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader source={source}
    annotations={annotations}
    onAnnotationsChange={setAnnotations}
  />;
}
\`\`\`

## 阅读检查表

- [ ] 给公式中的一个条件添加脚注。
- [ ] 在同一段代码上保留笔记和提问。
- [ ] 为代码中的局部表达式设置下划线。
- [ ] 检查复制后的文本是否保留符号与空格。
- [ ] 调整窗口宽度，观察表格与批注如何适应空间。

## 从答案回到假设

技术阅读最容易漏掉的部分，往往是“这个方法在什么条件下有用”。返回开头的积分例子：等距采样是否必要？函数在区间内是否连续？计算每个采样值的代价是否相同？如果把区间反过来，结果的符号又会如何变化？这些问题能够把一个已经算完的例子，变成下一次探索的起点。
`,BO=`# Express README

> 来源：[expressjs/express](https://github.com/expressjs/express/blob/master/Readme.md)。2026-10-13 读取的本地快照，保留介绍、安装、特性、快速入门、设计思想、示例与贡献章节；省略徽章和成员名单。MIT 许可，完整声明见本文末尾。

**Fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org).**

\`\`\`js
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
\`\`\`

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 18 or higher is required.

If this is a brand new project, make sure to create a \`package.json\` first with
the [\`npm init\` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[\`npm install\` command](https://docs.npmjs.com/downloading-and-installing-packages-locally):

\`\`\`bash
npm install express
\`\`\`

Follow [our installing guide](https://expressjs.com/en/starter/installing.html)
for more information.

## Features

  * Robust routing
  * Focus on high performance
  * Super-high test coverage
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Executable for generating applications quickly

## Docs & Community

  * [Website and Documentation](https://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
  * [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
  * [GitHub Discussions](https://github.com/expressjs/discussions) for discussion on the development and usage of Express

**PROTIP** Be sure to read the [migration guide to v5](https://expressjs.com/en/guide/migrating-5)

## Quick Start

  The quickest way to get started with express is to utilize the executable [\`express(1)\`](https://github.com/expressjs/generator) to generate an application as shown below:

  Install the executable. The executable's major version will match Express's:

\`\`\`bash
npm install -g express-generator@4
\`\`\`

  Create the app:

\`\`\`bash
express /tmp/foo && cd /tmp/foo
\`\`\`

  Install dependencies:

\`\`\`bash
npm install
\`\`\`

  Start the server:

\`\`\`bash
npm start
\`\`\`

  View the website at: http://localhost:3000

## Philosophy

  The Express philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, websites, hybrids, or public
  HTTP APIs.

  Express does not force you to use any specific ORM or template engine. With support for over
  14 template engines via [@ladjs/consolidate](https://github.com/ladjs/consolidate),
  you can quickly craft your perfect framework.

## Examples

  To view the examples, clone the Express repository:

\`\`\`bash
git clone https://github.com/expressjs/express.git --depth 1 && cd express
\`\`\`

  Then install the dependencies:

\`\`\`bash
npm install
\`\`\`

  Then run whichever example you want:

\`\`\`bash
node examples/content-negotiation
\`\`\`

## Contributing

The Express.js project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide](https://github.com/expressjs/express/blob/master/Contributing.md) for more technical details on contributing.

This project has a [Code of Conduct](https://github.com/expressjs/express/blob/master/Code-Of-Conduct.md). By participating, you are expected to uphold this code.

### Security Issues

If you discover a security vulnerability in Express, please see [Security Policies and Procedures](https://github.com/expressjs/express/security/policy).

### Running Tests

To run the test suite, first install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then run \`npm test\`:

\`\`\`bash
npm test
\`\`\`

## License

\`\`\`text
(The MIT License)

Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>
Copyright (c) 2013-2014 Roman Shtylman <shtylman+expressjs@gmail.com>
Copyright (c) 2014-2015 Douglas Christopher Wilson <doug@somethingdoug.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`
`,qO=`# Axios README

> 来源：[axios/axios](https://github.com/axios/axios/blob/v1.x/README.md)。2026-10-13 读取的本地快照，节选特性、安装、使用示例、API 与请求配置；省略徽章和赞助内容。MIT 许可，完整声明见本文末尾。

## Features

- Make [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) from the browser.
- Make [http](https://nodejs.org/api/http.html) requests from Node.js.
- Use the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API for asynchronous request handling.
- Intercept requests and responses to add custom logic or transform data.
- Transform request and response data.
- Cancel requests with built-in cancellation APIs.
- Serialize and parse [JSON](https://www.json.org/json-en.html) data.
- Serialize data objects to \`multipart/form-data\` or \`application/x-www-form-urlencoded\`.
- Add client-side protection against [Cross-Site Request Forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery).

## Installing

### Package manager

Using npm:

\`\`\`bash
$ npm install axios
\`\`\`

Using yarn:

\`\`\`bash
$ yarn add axios
\`\`\`

Using pnpm:

\`\`\`bash
$ pnpm add axios
\`\`\`

Using bun:

\`\`\`bash
$ bun add axios
\`\`\`

Using Deno:

\`\`\`bash
$ deno add axios
\`\`\`

Once the package is installed, import it with \`import\` or \`require\`:

\`\`\`js
import axios, { isCancel, AxiosError } from 'axios';
\`\`\`

You can also use the default export, since the named export is just a re-export from the Axios factory:

\`\`\`js
import axios from 'axios';

console.log(axios.isCancel('something'));
\`\`\`

If you use \`require\` for importing, **only the default export is available**:

\`\`\`js
const axios = require('axios');

console.log(axios.isCancel('something'));
\`\`\`

Some bundlers and ES6 linters need this form:

\`\`\`js
import { default as axios } from 'axios';
\`\`\`

In custom or legacy environments, you can import the bundle directly:

\`\`\`js
const axios = require('axios/dist/browser/axios.cjs'); // browser commonJS bundle (ES2017)
// const axios = require('axios/dist/node/axios.cjs'); // node commonJS bundle (ES2017)
\`\`\`

### CDN

Using jsDelivr CDN (ES5 UMD browser module):

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/axios@1.20.0/dist/axios.min.js"><\/script>
\`\`\`

Using unpkg CDN:

\`\`\`html
<script src="https://unpkg.com/axios@1.20.0/dist/axios.min.js"><\/script>
\`\`\`

## Example

\`\`\`js
import axios from 'axios';
//const axios = require('axios'); // legacy way

try {
  const response = await axios.get('/user?ID=12345');
  console.log(response);
} catch (error) {
  console.error(error);
}

// Optionally the request above could also be done as
axios
  .get('/user', {
    params: {
      ID: 12345,
    },
    timeout: 5000, // 5 seconds. See "Handling Timeouts" below for matching error handling
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the \`async\` keyword to your outer function/method.
async function getUser() {
  try {
    // Example: GET request with query parameters
    const response = await axios.get('/user', {
      params: {
        ID: 12345,
      },
    });

    // Using the \`params\` option improves readability and automatically formats query strings

    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

> Note: Set a \`timeout\` in production. Without one, a stalled request can hang
> indefinitely. See [Handling Timeouts](#handling-timeouts) for the matching error handling.

> Note: \`async/await\` is part of ECMAScript 2017 and is not supported in Internet
> Explorer and older browsers, so use with caution.

Performing a \`POST\` request

\`\`\`js
const response = await axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone',
});
console.log(response);
\`\`\`

Performing multiple concurrent requests

\`\`\`js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()]).then(function (results) {
  const acct = results[0];
  const perm = results[1];
});
\`\`\`

## axios API

Requests can be made by passing the relevant config to \`axios\`.

##### axios(config)

\`\`\`js
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
\`\`\`

\`\`\`js
// GET request for remote image in node.js
import fs from 'fs';
const response = await axios({
  method: 'get',
  url: 'https://bit.ly/2mTM3nY',
  responseType: 'stream',
});
response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
\`\`\`

##### axios(url[, config])

\`\`\`js
// Send a GET request (default method)
axios('/user/12345');
\`\`\`

### Request method aliases

For convenience, aliases have been provided for all common request methods.

##### axios.request(config)

##### axios.get(url[, config])

##### axios.delete(url[, config])

##### axios.head(url[, config])

##### axios.options(url[, config])

##### axios.post(url[, data[, config]])

##### axios.put(url[, data[, config]])

##### axios.patch(url[, data[, config]])

###### Note

When using the alias methods \`url\`, \`method\`, and \`data\` properties don't need to be specified in config.

### Concurrency (deprecated)

Use \`Promise.all\` instead of these helpers.

Helper functions for dealing with concurrent requests.

axios.all(iterable)
axios.spread(callback)

### Creating an instance

You can create a new instance of axios with a custom config.

##### axios.create([config])

\`\`\`js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
\`\`\`

### Instance methods

The following instance methods are available. Axios merges the specified config with the instance config.

##### axios#request(config)

##### axios#get(url[, config])

##### axios#delete(url[, config])

##### axios#head(url[, config])

##### axios#options(url[, config])

##### axios#post(url[, data[, config]])

##### axios#put(url[, data[, config]])

##### axios#patch(url[, data[, config]])

##### axios#getUri([config])

## Request config

### Security notice: decompression-bomb protection is opt-in

By default \`maxContentLength\` and \`maxBodyLength\` are \`-1\` (unlimited). A malicious or compromised server can return a tiny gzip/deflate/brotli/zstd body that expands to gigabytes and exhaust the Node.js process.

If you call servers you do not fully trust, **set a cap**:

\`\`\`js
axios.defaults.maxContentLength = 10 * 1024 * 1024; // 10 MB
axios.defaults.maxBodyLength = 10 * 1024 * 1024;
\`\`\`

See the [security guide](https://axios.rest/pages/misc/security.html) for details.

These config options are available for requests. Only \`url\` is required. Requests default to \`GET\` when \`method\` is not set.

\`\`\`js
{
  // \`url\` is the server URL for the request
  url: '/user',

  // \`method\` is the request method to be used when making the request
  method: 'get', // default

  // Axios prepends \`baseURL\` to \`url\` unless \`url\` is absolute and \`allowAbsoluteUrls\` is set to true.
  // It can be convenient to set \`baseURL\` for an instance of axios to pass relative URLs
  // to the methods of that instance.
  // \`baseURL\` is not a security boundary. If \`url\` is attacker-controlled, validate it
  // before passing it to axios. Relative URLs can contain \`..\` segments that resolve
  // outside an intended path prefix after the final URL is parsed.
  // HTTP(S) URLs must include \`//\` after the protocol. Values such as
  // \`https:example.com\` and \`https:/example.com\` are rejected with ERR_INVALID_URL.
  baseURL: 'https://some-domain.com/api/',

  // \`allowAbsoluteUrls\` determines whether or not absolute URLs will override a configured \`baseUrl\`.
  // When set to true (default), absolute values for \`url\` will override \`baseUrl\`.
  // When set to false, absolute values for \`url\` will always be prepended by \`baseUrl\`.
  allowAbsoluteUrls: true,

  // \`transformRequest\` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

  // \`transformResponse\` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // \`parseReviver\` is an optional function passed as the
  // second argument (reviver) to JSON.parse()
  parseReviver: function (key, value, context) {
    // In modern environments, context.source provides the raw JSON string
    // allowing for precision-safe parsing of BigInt
    if (typeof value === 'number' && context?.source) {
      const isInteger = Number.isInteger(value);
      const isUnsafe = !Number.isSafeInteger(value);
      const isValidIntegerString = /^-?\\d+$/.test(context.source);

      if (isInteger && isUnsafe && isValidIntegerString) {
        try {
          return BigInt(context.source);
        } catch {
          // Fallback: return original value if parsing fails
        }
      }
    }
    return value;
  },

  // \`headers\` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // \`params\` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // \`paramsSerializer\` is an optional config that allows you to customize serializing \`params\`.
  paramsSerializer: {

    // Custom encoder function which sends key/value pairs in an iterative fashion.
    encode?: (param: string): string => { /* Do custom operations here and return transformed string */ },

    // Custom serializer function for the entire parameter. Allows the user to mimic pre 1.x behaviour.
    serialize?: (params: Record<string, any>, options?: ParamsSerializerOptions ),

    // Configuration for formatting array indexes in the params.
    indexes: false, // Three available options: (1) indexes: null (leads to no brackets), (2) (default) indexes: false (leads to empty brackets), (3) indexes: true (leads to brackets with indexes).

    // Maximum object nesting depth when serializing params. Payloads deeper than this throw an
    // AxiosError with code ERR_FORM_DATA_DEPTH_EXCEEDED. Default: 100. Set to Infinity to disable.
    maxDepth: 100

  },

  // \`data\` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH'
  // \`data\` is request-specific: axios does not inherit or deep-merge it from defaults.
  // To add shared body fields, use a request interceptor or transformRequest.
  // When no \`transformRequest\` is set, it must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - React Native: FormData
  // - Node only: Stream, Buffer, FormData (form-data package)
  data: {
    firstName: 'Fred'
  },

  // \`formDataHeaderPolicy\` controls how node.js FormData#getHeaders() is copied.
  // 'legacy' (default) copies all returned headers for v1 compatibility.
  // 'content-only' copies only Content-Type and Content-Length.
  formDataHeaderPolicy: 'legacy',

  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',

  // \`timeout\` specifies the number of milliseconds before the request times out.
  // If the request takes longer than \`timeout\`, Axios aborts it.
  timeout: 1000, // default is \`0\` (no timeout)

  // \`withCredentials\` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  // This only controls whether the browser sends credentials.
  // It does not control whether the XSRF header is added.
  withCredentials: false, // default

  // \`adapter\` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see lib/adapters/README.md)
  adapter: function (config) {
    /* ... */
  },
  // Also, you can set the name of the built-in adapter, or provide an array with their names
  // to choose the first available in the environment
  adapter: 'xhr', // 'fetch' | 'http' | ['xhr', 'http', 'fetch']

  // \`auth\` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an \`Authorization\` header, overwriting any existing
  // \`Authorization\` custom headers you have set using \`headers\`.
  // If \`auth\` is omitted, the Node.js HTTP and fetch adapters can read
  // HTTP Basic auth credentials from the request URL, for example
  // \`https://user:pass@example.com\`. Axios decodes percent-encoded URL
  // credentials, and \`auth\` takes precedence over URL-embedded credentials.
  // The Node.js HTTP adapter preserves Basic auth on same-origin redirects
  // and strips it on cross-origin redirects.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use \`Authorization\` custom headers instead.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // \`responseType\` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default

  // \`responseEncoding\` indicates encoding to use for decoding responses (Node.js only)
  // Note: Ignored for \`responseType\` of 'stream' or client-side requests
  // options are: 'ascii', 'ASCII', 'ansi', 'ANSI', 'binary', 'BINARY', 'base64', 'BASE64', 'base64url',
  // 'BASE64URL', 'hex', 'HEX', 'latin1', 'LATIN1', 'ucs-2', 'UCS-2', 'ucs2', 'UCS2', 'utf-8', 'UTF-8',
  // 'utf8', 'UTF8', 'utf16le', 'UTF16LE'
  responseEncoding: 'utf8', // default

  // \`xsrfCookieName\` is the name of the cookie to use as a value for the xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // \`xsrfHeaderName\` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // \`withXSRFToken\` defines whether to send the XSRF header in browser requests.
  // \`undefined\` (default) - set XSRF header only for the same origin requests
  // \`true\` - always set XSRF header, including for cross-origin requests
  // \`false\` - never set XSRF header
  // function - resolve with custom logic; receives the internal config object
  withXSRFToken: boolean | undefined | ((config: InternalAxiosRequestConfig) => boolean | undefined),

  // \`withXSRFToken\` controls whether Axios reads the XSRF cookie and sets the XSRF header.
  // - \`undefined\` (default): the XSRF header is set only for same-origin requests.
  // - \`true\`: attempt to set the XSRF header for all requests (including cross-origin).
  // - \`false\`: never set the XSRF header.
  // - function: a callback that receives the request \`config\` and returns \`true\`,
  //   \`false\`, or \`undefined\` to decide per-request behavior.
  //
  // Note about \`withCredentials\`: \`withCredentials\` controls whether cross-site
  // requests include credentials (cookies and HTTP auth). In older Axios versions,
  // setting \`withCredentials: true\` implicitly caused Axios to set the XSRF header
  // for cross-origin requests. Newer Axios separates these concerns: to allow the
  // XSRF header to be sent for cross-origin requests you should set both
  // \`withCredentials: true\` and \`withXSRFToken: true\`.
  //
  // Example:
  // axios.get('/user', { withCredentials: true, withXSRFToken: true });

  // \`onUploadProgress\` allows handling of progress events for uploads
  // browser & node.js
  onUploadProgress: function ({loaded, total, progress, bytes, estimated, rate, upload = true}) {
    // Do whatever you want with the Axios progress event
  },

  // \`onDownloadProgress\` allows handling of progress events for downloads
  // browser & node.js
  onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
    // Do whatever you want with the Axios progress event
  },

  // \`maxContentLength\` defines the max size of the response content in bytes.
  // It is enforced by the Node.js HTTP adapter and the fetch adapter.
  maxContentLength: 2000,

  // \`maxBodyLength\` defines the max size of the request content in bytes.
  // It is enforced by the Node.js HTTP adapter and the fetch adapter when the body length can be determined.
  maxBodyLength: 2000,

  // \`redact\` masks matching config keys when AxiosError#toJSON() is called.
  // Matching is case-insensitive and recursive. It does not change the request.
  redact: ['authorization', 'password'],

  // \`validateStatus\` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If \`validateStatus\` returns \`true\` or is set to
  // \`null\`, Axios resolves the promise; otherwise, Axios rejects it.
  // Explicit \`validateStatus: undefined\` resolves every status by default for
  // backward compatibility. Set \`transitional.validateStatusUndefinedResolves\`
  // to \`false\` to make explicit \`undefined\` behave as if this option was omitted.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // \`maxRedirects\` defines the maximum number of redirects to follow in node.js.
  // If set to 0, Axios follows no redirects.
  maxRedirects: 21, // default

  // \`sensitiveHeaders\` (Node only option) lists custom secret-bearing headers
  // (such as \`X-API-Key\`) to remove from cross-origin redirects. Matching is
  // case-insensitive. Same-origin redirects keep these headers. If
  // \`maxRedirects\` is 0, this option is not used.
  sensitiveHeaders: ['X-API-Key'],

  // \`beforeRedirect\` defines a function that Axios calls before redirect.
  // Use this to adjust the request options upon redirecting,
  // to inspect the latest response headers,
  // or to cancel the request by throwing an error
  // If maxRedirects is set to 0, \`beforeRedirect\` is not used.

  beforeRedirect: (options, { headers }) => {
    if (
      options.hostname === "example.com" &&
      options.protocol === "https:"
    ) {
      options.auth = "user:password";
    }
  },
  // Security note:
  // The \`beforeRedirect\` hook runs after sensitive headers are stripped during redirects.
  // \`follow-redirects\` removes credentials on protocol downgrades
  // (HTTPS to HTTP). Because \`beforeRedirect\` runs after that step,
  // re-injecting credentials without checking the destination can expose
  // sensitive data. Only add credentials for trusted HTTPS destinations.

  // \`socketPath\` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either \`socketPath\` or \`proxy\` can be specified.
  // If both are specified, \`socketPath\` is used.
  //
  // Security: when \`socketPath\` is set, hostname/port of the URL are ignored,
  // which bypasses hostname-based SSRF protections. Never derive \`socketPath\`
  // from untrusted input. Use \`allowedSocketPaths\` (below) to restrict accepted
  // socket paths for defense-in-depth.
  socketPath: null, // default

  // \`allowedSocketPaths\` restricts which \`socketPath\` values are accepted.
  // Accepts a string or array of strings. Entries and the incoming socketPath
  // are compared after path.resolve(). A mismatch throws AxiosError with code
  // \`ERR_BAD_OPTION_VALUE\`. When null/undefined, no restriction is applied.
  allowedSocketPaths: null, // default

  // \`transport\` determines the transport method for the request.
  // If defined, Axios uses it. Otherwise, if \`maxRedirects\` is 0,
  // Axios uses the default \`http\` or \`https\` library, depending on the protocol specified in \`protocol\`.
  // Otherwise, Axios uses the \`httpFollow\` or \`httpsFollow\` library, again depending on the protocol,
  // which can handle redirects.
  transport: undefined, // default

  // \`httpAgent\` and \`httpsAgent\` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // \`keepAlive\` that are not enabled by default before Node.js v19.0.0. After Node.js
  // v19.0.0, you no longer need to customize the agent to enable \`keepAlive\` because
  // \`http.globalAgent\` has \`keepAlive\` enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // \`proxy\` defines the hostname, port, and protocol of the proxy server.
  // You can also define your proxy using the conventional \`http_proxy\` and
  // \`https_proxy\` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a \`no_proxy\` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use \`false\` to disable proxies, ignoring environment variables.
  // On Node.js versions with native environment proxy support, axios defers
  // environment proxy handling to Node when the selected agent has \`proxyEnv\`
  // enabled, including processes started with \`NODE_USE_ENV_PROXY=1\`,
  // \`--use-env-proxy\`, or \`NODE_OPTIONS=--use-env-proxy\`. Custom agents without
  // \`proxyEnv\` continue to use axios environment proxy resolution. Explicit
  // \`proxy\` config is still handled by axios.
  // \`auth\` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // For \`http://\` targets, axios sends the request to the proxy in
  // forward-proxy mode and stamps \`Proxy-Authorization\` onto the request
  // headers (overwriting any user-supplied \`Proxy-Authorization\` header).
  // For \`https://\` targets, axios establishes a CONNECT tunnel through the
  // proxy and performs TLS end-to-end with the origin; \`Proxy-Authorization\`
  // is sent on the CONNECT request only, never on the wrapped TLS request,
  // so the proxy never sees the URL, headers, or body. Axios forwards
  // \`httpsAgent\` TLS options such as \`ca\`, \`cert\`, \`key\`, and
  // \`rejectUnauthorized\` to the generated tunneling agent, so they still apply
  // to the origin TLS connection.
  // If you supply an \`HttpsProxyAgent\`, axios leaves tunneling to that agent.
  // If the proxy server uses HTTPS, then you must set the protocol to \`https\`.
  // A user-supplied \`Host\` header in \`headers\` is preserved when forwarding
  // through a proxy (case-insensitive match on \`host\`/\`Host\`/\`HOST\`); this
  // lets you target a virtual host that differs from the request URL, for
  // example, hitting \`127.0.0.1:4000\` while having the proxy treat the
  // request as \`example.com\`. If no \`Host\` header is supplied, axios
  // defaults it to the request URL's \`hostname:port\` as before. The Host
  // header is only set in forward-proxy mode (HTTP targets); for HTTPS
  // tunneling the Host header is sent inside the TLS connection, not seen
  // by the proxy.
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // \`cancelToken\` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  }),

  // an alternative way to cancel Axios requests using AbortController
  signal: new AbortController().signal,

  // \`decompress\` indicates whether or not the response body should be decompressed
  // automatically. If set to \`true\` will also remove the 'content-encoding' header
  // from the responses objects of all decompressed responses
  // Axios supports gzip, deflate, brotli, and zstd when the current Node.js
  // runtime provides the corresponding zlib decompressor.
  // - Node only (XHR cannot turn off decompression)
  decompress: true, // default

  // \`insecureHTTPParser\` boolean.
  // Indicates where to use an insecure HTTP parser that accepts invalid HTTP headers.
  // This may allow interoperability with non-conformant HTTP implementations.
  // Using the insecure parser should be avoided.
  // see options https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_http_request_url_options_callback
  // see also https://nodejs.org/en/blog/vulnerability/february-2020-security-releases/#strict-http-header-parsing-none
  insecureHTTPParser: undefined, // default

  // transitional options for backward compatibility that may be removed in the newer versions
  transitional: {
    // silent JSON parsing mode
    // \`true\`  - ignore JSON parsing errors and set response.data to null if parsing failed (old behaviour)
    // \`false\` - throw SyntaxError if JSON parsing failed
    // Important: this option only takes effect when \`responseType\` is explicitly set to 'json'.
    // When \`responseType\` is omitted (defaults to no value), axios uses \`forcedJSONParsing\`
    // to attempt JSON parsing, but will silently return the raw string on failure regardless
    // of this setting. To have invalid JSON throw errors, use:
    //   { responseType: 'json', transitional: { silentJSONParsing: false } }
    silentJSONParsing: true, // default value for the current Axios version

    // try to parse the response string as JSON even if \`responseType\` is not 'json'
    forcedJSONParsing: true,

    // throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
    clarifyTimeoutError: false,

    // keep explicit \`validateStatus: undefined\` resolving every response status
    // for backward compatibility. Set to false to make explicit undefined behave
    // as if validateStatus was omitted.
    validateStatusUndefinedResolves: true,

    // advertise \`zstd\` in the default Accept-Encoding header when the current
    // Node.js runtime supports zstd decompression. Axios still decompresses
    // zstd responses when support exists and \`decompress\` is true.
    advertiseZstdAcceptEncoding: false,

    // use the legacy interceptor request/response ordering
    legacyInterceptorReqResOrdering: true, // default
  },

  env: {
    // The FormData class to be used to automatically serialize the payload into a FormData object
    FormData: window?.FormData || global?.FormData
  },

  formSerializer: {
      visitor: (value, key, path, helpers) => {}; // custom visitor function to serialize form values
      dots: boolean; // use dots instead of brackets format
      metaTokens: boolean; // keep special endings like {} in parameter key
      indexes: boolean; // array indexes format null - no brackets, false - empty brackets, true - brackets with indexes
      maxDepth: 100; // maximum object nesting depth; throws AxiosError (ERR_FORM_DATA_DEPTH_EXCEEDED) if exceeded. Set to Infinity to disable.
  },

  // http adapter only (node.js)
  maxRate: [
    100 * 1024, // 100KB/s upload limit,
    100 * 1024  // 100KB/s download limit
  ]
}
\`\`\`

For custom secret-bearing headers in Node.js, list them in \`sensitiveHeaders\` so Axios removes them when following a redirect to another origin:

\`\`\`js
axios.get('https://api.example.com/users', {
  headers: { 'X-API-Key': 'secret' },
  sensitiveHeaders: ['X-API-Key'],
});
\`\`\`

### Strict RFC 3986 percent-encoding for query params

By default, axios decodes \`%3A\`, \`%24\`, \`%2C\` and \`%20\` back to \`:\`, \`$\`, \`,\` and \`+\` for readability (the \`+\` follows the \`application/x-www-form-urlencoded\` convention for spaces in query strings). These characters are valid in a query component under [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-3.4), so the default output is correct, but some backends require strict percent-encoding and reject the readable form.

Override the default encoder via \`paramsSerializer.encode\`:

\`\`\`js
// Per-request: emit strict RFC 3986 percent-encoding for query values
axios.get('/foo', {
  params: { filter: JSON.stringify({ startedAt: '2026-01-23' }) },
  paramsSerializer: { encode: encodeURIComponent },
});

// Or set it on the instance defaults
const client = axios.create({
  paramsSerializer: { encode: encodeURIComponent },
});
\`\`\`

## License

\`\`\`text
# Copyright (c) 2014-present Matt Zabriskie & Collaborators

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`
`,PO=`# Alice's Adventures in Wonderland

Lewis Carroll · 1865

> 英文原著第一至第三章，公版作品。文本取自 [Project Gutenberg](https://www.gutenberg.org/ebooks/11)，保留三章原文与诗行，并为各章开头的选段新译中文；这些译文为 LiMR 示例编写，不取自已有中文译本。段末“原 / 译 / 对照”可切换显示。

## Chapter I · Down the Rabbit-Hole

<translations default="origin">

<origin>

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

</origin>

<translation>

爱丽丝坐在河岸边陪着姐姐，渐渐觉得厌倦，无事可做。她偶尔瞥一眼姐姐正在读的书，里面却既没有插图，也没有对话。“一本没有插图、没有对话的书，”爱丽丝心想，“有什么用呢？”

</translation>

</translations>

<translations default="origin">

<origin>

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

</origin>

<translation>

她正琢磨着：起身去摘雏菊，编成花环，这点乐趣值不值得费那番力气？天气热得让她又困又迷糊，她也只能勉强想想。就在这时，一只粉红眼睛的白兔突然从她身旁跑过。

</translation>

</translations>

<translations default="origin">

<origin>

There was nothing so _very_ remarkable in that; nor did Alice think it so _very_ much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually _took a watch out of its waistcoat-pocket_, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

</origin>

<translation>

这本来并不怎么稀奇。听到兔子自言自语：“哎呀！哎呀！我要迟到了！”爱丽丝当时也没觉得有多奇怪——后来回想，她才觉得自己本该惊讶。可是，当兔子真的从**背心口袋里掏出一块表**，看了一眼，又匆匆赶路时，爱丽丝一下子跳了起来：她从没见过穿着背心、还能从口袋里掏出表的兔子！好奇心驱使着她追过田野，恰好看见兔子钻进篱笆下的一个大洞。

</translation>

</translations>

<translations default="origin">

<origin>

In another moment down went Alice after it, never once considering how in the world she was to get out again.

</origin>

<translation>

转眼之间，爱丽丝也跟着钻了进去，压根没想过待会儿该怎么出来。

</translation>

</translations>

<translations default="origin">

<origin>

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

</origin>

<translation>

兔子洞起初像隧道一样直直延伸了一段，接着突然向下倾斜。变化来得如此突然，爱丽丝还没来得及想怎样停下来，就已经掉进了一口深得吓人的井。

</translation>

</translations>

<translations default="origin">

<origin>

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled "ORANGE MARMALADE", but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.

</origin>

<translation>

不是井实在太深，就是她落得太慢；往下落时，她有充足的时间打量四周，猜测接下来会发生什么。起初她试着朝下看，可那里黑得什么也看不清。于是她转而看井壁，发现上面布满橱柜和书架，间或还挂着地图和图画。经过一个架子时，她取下一只罐子，上面写着“橘子果酱”，可惜里面是空的。她怕扔下去会砸死下面的人，便趁继续下落时，设法把罐子塞进另一个橱柜。

</translation>

</translations>

"Well!" thought Alice to herself, "after such a fall as this, I shall think nothing of tumbling down stairs! How brave they'll all think me at home! Why, I wouldn't say anything about it, even if I fell off the top of the house!" (Which was very likely true.)

Down, down, down. Would the fall _never_ come to an end? "I wonder how many miles I've fallen by this time?" she said aloud. "I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—" (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a _very_ good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) "—yes, that's about the right distance—but then I wonder what Latitude or Longitude I've got to?" (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)

Presently she began again. "I wonder if I shall fall right _through_ the earth! How funny it'll seem to come out among the people that walk with their heads downward! The Antipathies, I think—" (she was rather glad there _was_ no one listening, this time, as it didn't sound at all the right word) "—but I shall have to ask them what the name of the country is, you know. Please, Ma'am, is this New Zealand or Australia?" (and she tried to curtsey as she spoke—fancy _curtseying_ as you're falling through the air! Do you think you could manage it?) "And what an ignorant little girl she'll think me for asking! No, it'll never do to ask: perhaps I shall see it written up somewhere."

Down, down, down. There was nothing else to do, so Alice soon began talking again. "Dinah'll miss me very much to-night, I should think!" (Dinah was the cat.) "I hope they'll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I'm afraid, but you might catch a bat, and that's very like a mouse, you know. But do cats eat bats, I wonder?" And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, "Do cats eat bats? Do cats eat bats?" and sometimes, "Do bats eat cats?" for, you see, as she couldn't answer either question, it didn't much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, "Now, Dinah, tell me the truth: did you ever eat a bat?" when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.

Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, "Oh my ears and whiskers, how late it's getting!" She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.

There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.

Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice's first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!

Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; "and even if my head would go through," thought poor Alice, "it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin." For, you see, so many out-of-the-way things had happened lately, that Alice had begun to think that very few things indeed were really impossible.

There seemed to be no use in waiting by the little door, so she went back to the table, half hoping she might find another key on it, or at any rate a book of rules for shutting people up like telescopes: this time she found a little bottle on it, ("which certainly was not here before," said Alice,) and round the neck of the bottle was a paper label, with the words "DRINK ME," beautifully printed on it in large letters.

It was all very well to say "Drink me," but the wise little Alice was not going to do _that_ in a hurry. "No, I'll look first," she said, "and see whether it's marked '_poison_' or not"; for she had read several nice little histories about children who had got burnt, and eaten up by wild beasts and other unpleasant things, all because they _would_ not remember the simple rules their friends had taught them: such as, that a red-hot poker will burn you if you hold it too long; and that if you cut your finger _very_ deeply with a knife, it usually bleeds; and she had never forgotten that, if you drink much from a bottle marked "poison," it is almost certain to disagree with you, sooner or later.

However, this bottle was _not_ marked "poison," so Alice ventured to taste it, and finding it very nice, (it had, in fact, a sort of mixed flavour of cherry-tart, custard, pine-apple, roast turkey, toffee, and hot buttered toast,) she very soon finished it off.

*      *      *      *      *      *      *

    *      *      *      *      *      *

*      *      *      *      *      *      *

"What a curious feeling!" said Alice; "I must be shutting up like a telescope."

And so it was indeed: she was now only ten inches high, and her face brightened up at the thought that she was now the right size for going through the little door into that lovely garden. First, however, she waited for a few minutes to see if she was going to shrink any further: she felt a little nervous about this; "for it might end, you know," said Alice to herself, "in my going out altogether, like a candle. I wonder what I should be like then?" And she tried to fancy what the flame of a candle is like after the candle is blown out, for she could not remember ever having seen such a thing.

After a while, finding that nothing more happened, she decided on going into the garden at once; but, alas for poor Alice! when she got to the door, she found she had forgotten the little golden key, and when she went back to the table for it, she found she could not possibly reach it: she could see it quite plainly through the glass, and she tried her best to climb up one of the legs of the table, but it was too slippery; and when she had tired herself out with trying, the poor little thing sat down and cried.

"Come, there's no use in crying like that!" said Alice to herself, rather sharply; "I advise you to leave off this minute!" She generally gave herself very good advice, (though she very seldom followed it), and sometimes she scolded herself so severely as to bring tears into her eyes; and once she remembered trying to box her own ears for having cheated herself in a game of croquet she was playing against herself, for this curious child was very fond of pretending to be two people. "But it's no use now," thought poor Alice, "to pretend to be two people! Why, there's hardly enough of me left to make _one_ respectable person!"

Soon her eye fell on a little glass box that was lying under the table: she opened it, and found in it a very small cake, on which the words "EAT ME" were beautifully marked in currants. "Well, I'll eat it," said Alice, "and if it makes me grow larger, I can reach the key; and if it makes me grow smaller, I can creep under the door; so either way I'll get into the garden, and I don't care which happens!"

She ate a little bit, and said anxiously to herself, "Which way? Which way?", holding her hand on the top of her head to feel which way it was growing, and she was quite surprised to find that she remained the same size: to be sure, this generally happens when one eats cake, but Alice had got so much into the way of expecting nothing but out-of-the-way things to happen, that it seemed quite dull and stupid for life to go on in the common way.

So she set to work, and very soon finished off the cake.

*      *      *      *      *      *      *

    *      *      *      *      *      *

*      *      *      *      *      *      *

## Chapter II · The Pool of Tears

<translations default="origin">

<origin>

"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); "now I'm opening out like the largest telescope that ever was! Good-bye, feet!" (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). "Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure _I_ shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can;—but I must be kind to them," thought Alice, "or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas."

</origin>

<translation>

“越来越奇怪，越来越奇怪！”爱丽丝喊道。她惊讶得一时连话都说不周全了。“我现在像一架世界上最大的望远镜那样伸长了！再见啦，脚！”她低头看时，两只脚已经远得几乎看不见。“可怜的小脚呀，以后谁替你们穿鞋袜呢？我肯定办不到啦，离得实在太远了。你们只好自己想办法——不过我得对它们好一点，”她又想，“要不然，它们也许不肯往我想去的地方走呢！对了，每年圣诞节，我都送它们一双新靴子。”

</translation>

</translations>

And she went on planning to herself how she would manage it. "They must go by the carrier," she thought; "and how funny it'll seem, sending presents to one's own feet! And how odd the directions will look!

     _Alice's Right Foot, Esq., Hearthrug, near the Fender,_ (_with
     Alice's love_).

Oh dear, what nonsense I'm talking!"

<translations default="origin">

<origin>

Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.

</origin>

<translation>

就在这时，她的头撞上了大厅的天花板。原来，她已经长到九英尺多高了。她立刻拿起那把小金钥匙，急匆匆地朝花园门跑去。

</translation>

</translations>

<translations default="origin">

<origin>

Poor Alice! It was as much as she could do, lying down on one side, to look through into the garden with one eye; but to get through was more hopeless than ever: she sat down and began to cry again.

</origin>

<translation>

可怜的爱丽丝！她侧身躺下，才勉强能用一只眼睛往花园里看；要想进去，却比刚才更没有希望。她坐在地上，又哭了起来。

</translation>

</translations>

"You ought to be ashamed of yourself," said Alice, "a great girl like you," (she might well say this), "to go on crying in this way! Stop this moment, I tell you!" But she went on all the same, shedding gallons of tears, until there was a large pool all round her, about four inches deep and reaching half down the hall.

After a time she heard a little pattering of feet in the distance, and she hastily dried her eyes to see what was coming. It was the White Rabbit returning, splendidly dressed, with a pair of white kid gloves in one hand and a large fan in the other: he came trotting along in a great hurry, muttering to himself as he came, "Oh! the Duchess, the Duchess! Oh! won't she be savage if I've kept her waiting!" Alice felt so desperate that she was ready to ask help of any one; so, when the Rabbit came near her, she began, in a low, timid voice, "If you please, sir—" The Rabbit started violently, dropped the white kid gloves and the fan, and skurried away into the darkness as hard as he could go.

Alice took up the fan and gloves, and, as the hall was very hot, she kept fanning herself all the time she went on talking: "Dear, dear! How queer everything is to-day! And yesterday things went on just as usual. I wonder if I've been changed in the night? Let me think: was I the same when I got up this morning? I almost think I can remember feeling a little different. But if I'm not the same, the next question is, Who in the world am I? Ah, _that's_ the great puzzle!" And she began thinking over all the children she knew that were of the same age as herself, to see if she could have been changed for any of them.

"I'm sure I'm not Ada," she said, "for her hair goes in such long ringlets, and mine doesn't go in ringlets at all; and I'm sure I can't be Mabel, for I know all sorts of things, and she, oh! she knows such a very little! Besides, _she's_ she, and _I'm_ I, and—oh dear, how puzzling it all is! I'll try if I know all the things I used to know. Let me see: four times five is twelve, and four times six is thirteen, and four times seven is—oh dear! I shall never get to twenty at that rate! However, the Multiplication Table doesn't signify: let's try Geography. London is the capital of Paris, and Paris is the capital of Rome, and Rome—no, _that's_ all wrong, I'm certain! I must have been changed for Mabel! I'll try and say '_How doth the little_—'" and she crossed her hands on her lap as if she were saying lessons, and began to repeat it, but her voice sounded hoarse and strange, and the words did not come the same as they used to do:—

"How doth the little crocodile     Improve his shining tail, And pour the waters of the Nile     On every golden scale!

"How cheerfully he seems to grin,     How neatly spread his claws, And welcome little fishes in     With gently smiling jaws!"

"I'm sure those are not the right words," said poor Alice, and her eyes filled with tears again as she went on, "I must be Mabel after all, and I shall have to go and live in that poky little house, and have next to no toys to play with, and oh! ever so many lessons to learn! No, I've made up my mind about it; if I'm Mabel, I'll stay down here! It'll be no use their putting their heads down and saying 'Come up again, dear!' I shall only look up and say 'Who am I then? Tell me that first, and then, if I like being that person, I'll come up: if not, I'll stay down here till I'm somebody else'—but, oh dear!" cried Alice, with a sudden burst of tears, "I do wish they _would_ put their heads down! I am so _very_ tired of being all alone here!"

As she said this she looked down at her hands, and was surprised to see that she had put on one of the Rabbit's little white kid gloves while she was talking. "How _can_ I have done that?" she thought. "I must be growing small again." She got up and went to the table to measure herself by it, and found that, as nearly as she could guess, she was now about two feet high, and was going on shrinking rapidly: she soon found out that the cause of this was the fan she was holding, and she dropped it hastily, just in time to avoid shrinking away altogether.

"That _was_ a narrow escape!" said Alice, a good deal frightened at the sudden change, but very glad to find herself still in existence; "and now for the garden!" and she ran with all speed back to the little door: but, alas! the little door was shut again, and the little golden key was lying on the glass table as before, "and things are worse than ever," thought the poor child, "for I never was so small as this before, never! And I declare it's too bad, that it is!"

As she said these words her foot slipped, and in another moment, splash! she was up to her chin in salt water. Her first idea was that she had somehow fallen into the sea, "and in that case I can go back by railway," she said to herself. (Alice had been to the seaside once in her life, and had come to the general conclusion, that wherever you go to on the English coast you find a number of bathing machines in the sea, some children digging in the sand with wooden spades, then a row of lodging houses, and behind them a railway station.) However, she soon made out that she was in the pool of tears which she had wept when she was nine feet high.

"I wish I hadn't cried so much!" said Alice, as she swam about, trying to find her way out. "I shall be punished for it now, I suppose, by being drowned in my own tears! That _will_ be a queer thing, to be sure! However, everything is queer to-day."

Just then she heard something splashing about in the pool a little way off, and she swam nearer to make out what it was: at first she thought it must be a walrus or hippopotamus, but then she remembered how small she was now, and she soon made out that it was only a mouse that had slipped in like herself.

"Would it be of any use, now," thought Alice, "to speak to this mouse? Everything is so out-of-the-way down here, that I should think very likely it can talk: at any rate, there's no harm in trying." So she began: "O Mouse, do you know the way out of this pool? I am very tired of swimming about here, O Mouse!" (Alice thought this must be the right way of speaking to a mouse: she had never done such a thing before, but she remembered having seen in her brother's Latin Grammar, "A mouse—of a mouse—to a mouse—a mouse—O mouse!") The Mouse looked at her rather inquisitively, and seemed to her to wink with one of its little eyes, but it said nothing.

"Perhaps it doesn't understand English," thought Alice; "I daresay it's a French mouse, come over with William the Conqueror." (For, with all her knowledge of history, Alice had no very clear notion how long ago anything had happened.) So she began again: "Où est ma chatte?" which was the first sentence in her French lesson-book. The Mouse gave a sudden leap out of the water, and seemed to quiver all over with fright. "Oh, I beg your pardon!" cried Alice hastily, afraid that she had hurt the poor animal's feelings. "I quite forgot you didn't like cats."

"Not like cats!" cried the Mouse, in a shrill, passionate voice. "Would _you_ like cats if you were me?"

"Well, perhaps not," said Alice in a soothing tone: "don't be angry about it. And yet I wish I could show you our cat Dinah: I think you'd take a fancy to cats if you could only see her. She is such a dear quiet thing," Alice went on, half to herself, as she swam lazily about in the pool, "and she sits purring so nicely by the fire, licking her paws and washing her face—and she is such a nice soft thing to nurse—and she's such a capital one for catching mice—oh, I beg your pardon!" cried Alice again, for this time the Mouse was bristling all over, and she felt certain it must be really offended. "We won't talk about her any more if you'd rather not."

"We indeed!" cried the Mouse, who was trembling down to the end of his tail. "As if _I_ would talk on such a subject! Our family always _hated_ cats: nasty, low, vulgar things! Don't let me hear the name again!"

"I won't indeed!" said Alice, in a great hurry to change the subject of conversation. "Are you—are you fond—of—of dogs?" The Mouse did not answer, so Alice went on eagerly: "There is such a nice little dog near our house I should like to show you! A little bright-eyed terrier, you know, with oh, such long curly brown hair! And it'll fetch things when you throw them, and it'll sit up and beg for its dinner, and all sorts of things—I can't remember half of them—and it belongs to a farmer, you know, and he says it's so useful, it's worth a hundred pounds! He says it kills all the rats and—oh dear!" cried Alice in a sorrowful tone, "I'm afraid I've offended it again!" For the Mouse was swimming away from her as hard as it could go, and making quite a commotion in the pool as it went.

So she called softly after it, "Mouse dear! Do come back again, and we won't talk about cats or dogs either, if you don't like them!" When the Mouse heard this, it turned round and swam slowly back to her: its face was quite pale (with passion, Alice thought), and it said in a low trembling voice, "Let us get to the shore, and then I'll tell you my history, and you'll understand why it is I hate cats and dogs."

It was high time to go, for the pool was getting quite crowded with the birds and animals that had fallen into it: there were a Duck and a Dodo, a Lory and an Eaglet, and several other curious creatures. Alice led the way, and the whole party swam to the shore.

## Chapter III · A Caucus-Race and a Long Tale

<translations default="origin">

<origin>

They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.

</origin>

<translation>

聚在岸边的这一群，模样实在古怪：鸟儿的羽毛湿漉漉地拖着，野兽的毛皮紧贴着身子。大家都浑身滴水，又恼火，又不舒服。

</translation>

</translations>

<translations default="origin">

<origin>

The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life. Indeed, she had quite a long argument with the Lory, who at last turned sulky, and would only say, "I am older than you, and must know better;" and this Alice would not allow without knowing how old it was, and, as the Lory positively refused to tell its age, there was no more to be said.

</origin>

<translation>

头一个问题当然是怎样重新弄干身子。大家商量了一会儿，爱丽丝竟觉得与它们熟络地说话再自然不过，仿佛认识了一辈子。她还和鹦鹉争论了好久。鹦鹉最后闷闷不乐，只肯说：“我比你年长，当然懂得更多。”可是，除非知道它究竟多大，爱丽丝就不肯认输；鹦鹉又坚决不肯说出年龄，于是也就无话可说了。

</translation>

</translations>

<translations default="origin">

<origin>

At last the Mouse, who seemed to be a person of authority among them, called out, "Sit down, all of you, and listen to me! _I'll_ soon make you dry enough!" They all sat down at once, in a large ring, with the Mouse in the middle. Alice kept her eyes anxiously fixed on it, for she felt sure she would catch a bad cold if she did not get dry very soon.

</origin>

<translation>

最后，老鼠——它在这群动物中似乎颇有威望——大声说：“都坐下，听我说！我很快就会让你们全干起来！”大家立刻围坐成一个大圈，老鼠坐在中央。爱丽丝焦急地盯着它；她确信，如果不能尽快弄干，自己一定会重重地感冒。

</translation>

</translations>

"Ahem!" said the Mouse with an important air, "are you all ready? This is the driest thing I know. Silence all round, if you please! 'William the Conqueror, whose cause was favoured by the pope, was soon submitted to by the English, who wanted leaders, and had been of late much accustomed to usurpation and conquest. Edwin and Morcar, the earls of Mercia and Northumbria—'"

"Ugh!" said the Lory, with a shiver.

"I beg your pardon!" said the Mouse, frowning, but very politely: "Did you speak?"

"Not I!" said the Lory hastily.

"I thought you did," said the Mouse. "—I proceed. 'Edwin and Morcar, the earls of Mercia and Northumbria, declared for him: and even Stigand, the patriotic archbishop of Canterbury, found it advisable—'"

"Found _what_?" said the Duck.

"Found _it_," the Mouse replied rather crossly: "of course you know what 'it' means."

"I know what 'it' means well enough, when _I_ find a thing," said the Duck: "it's generally a frog or a worm. The question is, what did the archbishop find?"

The Mouse did not notice this question, but hurriedly went on, "'—found it advisable to go with Edgar Atheling to meet William and offer him the crown. William's conduct at first was moderate. But the insolence of his Normans—' How are you getting on now, my dear?" it continued, turning to Alice as it spoke.

"As wet as ever," said Alice in a melancholy tone: "it doesn't seem to dry me at all."

"In that case," said the Dodo solemnly, rising to its feet, "I move that the meeting adjourn, for the immediate adoption of more energetic remedies—"

"Speak English!" said the Eaglet. "I don't know the meaning of half those long words, and, what's more, I don't believe you do either!" And the Eaglet bent down its head to hide a smile: some of the other birds tittered audibly.

"What I was going to say," said the Dodo in an offended tone, "was, that the best thing to get us dry would be a Caucus-race."

"What _is_ a Caucus-race?" said Alice; not that she wanted much to know, but the Dodo had paused as if it thought that _somebody_ ought to speak, and no one else seemed inclined to say anything.

"Why," said the Dodo, "the best way to explain it is to do it." (And, as you might like to try the thing yourself, some winter day, I will tell you how the Dodo managed it.)

First it marked out a race-course, in a sort of circle, ("the exact shape doesn't matter," it said,) and then all the party were placed along the course, here and there. There was no "One, two, three, and away," but they began running when they liked, and left off when they liked, so that it was not easy to know when the race was over. However, when they had been running half an hour or so, and were quite dry again, the Dodo suddenly called out "The race is over!" and they all crowded round it, panting, and asking, "But who has won?"

This question the Dodo could not answer without a great deal of thought, and it sat for a long time with one finger pressed upon its forehead (the position in which you usually see Shakespeare, in the pictures of him), while the rest waited in silence. At last the Dodo said, "_Everybody_ has won, and all must have prizes."

"But who is to give the prizes?" quite a chorus of voices asked.

"Why, _she_, of course," said the Dodo, pointing to Alice with one finger; and the whole party at once crowded round her, calling out in a confused way, "Prizes! Prizes!"

Alice had no idea what to do, and in despair she put her hand in her pocket, and pulled out a box of comfits, (luckily the salt water had not got into it), and handed them round as prizes. There was exactly one a-piece, all round.

"But she must have a prize herself, you know," said the Mouse.

"Of course," the Dodo replied very gravely. "What else have you got in your pocket?" he went on, turning to Alice.

"Only a thimble," said Alice sadly.

"Hand it over here," said the Dodo.

Then they all crowded round her once more, while the Dodo solemnly presented the thimble, saying "We beg your acceptance of this elegant thimble;" and, when it had finished this short speech, they all cheered.

Alice thought the whole thing very absurd, but they all looked so grave that she did not dare to laugh; and, as she could not think of anything to say, she simply bowed, and took the thimble, looking as solemn as she could.

The next thing was to eat the comfits: this caused some noise and confusion, as the large birds complained that they could not taste theirs, and the small ones choked and had to be patted on the back. However, it was over at last, and they sat down again in a ring, and begged the Mouse to tell them something more.

"You promised to tell me your history, you know," said Alice, "and why it is you hate—C and D," she added in a whisper, half afraid that it would be offended again.

"Mine is a long and a sad tale!" said the Mouse, turning to Alice, and sighing.

"It _is_ a long tail, certainly," said Alice, looking down with wonder at the Mouse's tail; "but why do you call it sad?" And she kept on puzzling about it while the Mouse was speaking, so that her idea of the tale was something like this:—

         "Fury said to a mouse, That he met in the house, 'Let us both
         go to law: _I_ will prosecute _you_.—Come, I'll take no
         denial; We must have a trial: For really this morning I've
         nothing to do.' Said the mouse to the cur, 'Such a trial, dear
         sir, With no jury or judge, would be wasting our breath.'
         'I'll be judge, I'll be jury,' Said cunning old Fury: 'I'll
         try the whole cause, and condemn you to death.'"

"You are not attending!" said the Mouse to Alice severely. "What are you thinking of?"

"I beg your pardon," said Alice very humbly: "you had got to the fifth bend, I think?"

"I had _not!_" cried the Mouse, sharply and very angrily.

"A knot!" said Alice, always ready to make herself useful, and looking anxiously about her. "Oh, do let me help to undo it!"

"I shall do nothing of the sort," said the Mouse, getting up and walking away. "You insult me by talking such nonsense!"

"I didn't mean it!" pleaded poor Alice. "But you're so easily offended, you know!"

The Mouse only growled in reply.

"Please come back and finish your story!" Alice called after it; and the others all joined in chorus, "Yes, please do!" but the Mouse only shook its head impatiently, and walked a little quicker.

"What a pity it wouldn't stay!" sighed the Lory, as soon as it was quite out of sight; and an old Crab took the opportunity of saying to her daughter "Ah, my dear! Let this be a lesson to you never to lose _your_ temper!" "Hold your tongue, Ma!" said the young Crab, a little snappishly. "You're enough to try the patience of an oyster!"

"I wish I had our Dinah here, I know I do!" said Alice aloud, addressing nobody in particular. "She'd soon fetch it back!"

"And who is Dinah, if I might venture to ask the question?" said the Lory.

Alice replied eagerly, for she was always ready to talk about her pet: "Dinah's our cat. And she's such a capital one for catching mice you can't think! And oh, I wish you could see her after the birds! Why, she'll eat a little bird as soon as look at it!"

This speech caused a remarkable sensation among the party. Some of the birds hurried off at once: one old Magpie began wrapping itself up very carefully, remarking, "I really must be getting home; the night-air doesn't suit my throat!" and a Canary called out in a trembling voice to its children, "Come away, my dears! It's high time you were all in bed!" On various pretexts they all moved off, and Alice was soon left alone.

"I wish I hadn't mentioned Dinah!" she said to herself in a melancholy tone. "Nobody seems to like her, down here, and I'm sure she's the best cat in the world! Oh, my dear Dinah! I wonder if I shall ever see you any more!" And here poor Alice began to cry again, for she felt very lonely and low-spirited. In a little while, however, she again heard a little pattering of footsteps in the distance, and she looked up eagerly, half hoping that the Mouse had changed his mind, and was coming back to finish his story.
`,UO=`# 前赤壁赋

苏轼 · 宋 · 元丰五年（1082）

> 公版原作，按通行简体文本整理段落。可对照[维基文库原文](https://zh.wikisource.org/wiki/前赤壁賦)。以下小标题为阅读导航所加，不属于原作。

## 泛舟赤壁

壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。

## 扣舷而歌

于是饮酒乐甚，扣舷而歌之。歌曰：“桂棹兮兰桨，击空明兮溯流光。渺渺兮予怀，望美人兮天一方。”客有吹洞箫者，倚歌而和之。其声呜呜然，如怨如慕，如泣如诉；余音袅袅，不绝如缕。舞幽壑之潜蛟，泣孤舟之嫠妇。

## 客之所悲

苏子愀然，正襟危坐而问客曰：“何为其然也？”

客曰：“月明星稀，乌鹊南飞。此非曹孟德之诗乎？西望夏口，东望武昌，山川相缪，郁乎苍苍，此非孟德之困于周郎者乎？方其破荆州，下江陵，顺流而东也，舳舻千里，旌旗蔽空，酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？况吾与子渔樵于江渚之上，侣鱼虾而友麋鹿，驾一叶之扁舟，举匏樽以相属。寄蜉蝣于天地，渺沧海之一粟。哀吾生之须臾，羡长江之无穷。挟飞仙以遨游，抱明月而长终。知不可乎骤得，托遗响于悲风。”

## 水月之问

苏子曰：“客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。盖将自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也，而又何羡乎！且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭，是造物者之无尽藏也，而吾与子之所共适。”

## 东方既白

客喜而笑，洗盏更酌。肴核既尽，杯盘狼藉。相与枕藉乎舟中，不知东方之既白。

---

## 读后留白

以下是 LiMR 编写的阅读提示，不属于苏轼原文。

这篇文章既有时间的推进，也有情绪的变化。可以先把“乐甚”“愀然”“喜而笑”分别标记出来，再返回对应段落，看看每一次变化由什么触发。对话没有离开江水与月亮，却改变了观看它们的角度。

同一个意象可以同时承载感官经验与抽象思考。“水光接天”首先是一幅画面，到了“逝者如斯”，水又成为讨论时间的入口。给这两处添加不同的笔记，试着写下它们之间的联系。

也可以选中“自其变者而观之”与“自其不变者而观之”，分别提出一个问题：两种观看方式是在互相否定，还是回答不同层次的疑惑？先留下问题，不急着写出唯一的解释。

最后重新读开头与结尾。故事从月亮升起写到东方发白，文字没有告诉我们所有问题都已经解决，只留下重新饮酒、相互枕藉的场景。那些没有说尽的部分，也可以成为读者自己的旁注。
`,FO=`# Scikit-learn: Machine Learning in Python

Fabian Pedregosa, Gaël Varoquaux, Alexandre Gramfort, Vincent Michel, Bertrand Thirion, Olivier Grisel, Mathieu Blondel, Peter Prettenhofer, Ron Weiss, Vincent Dubourg, Jake Vanderplas, Alexandre Passos, David Cournapeau, Matthieu Brucher, Matthieu Perrot, Édouard Duchesnay

*Journal of Machine Learning Research*, 12, 2825–2830 (2011). Editor: Mikio Braun.

> [原论文及书目信息](https://jmlr.org/papers/v12/pedregosa11a.html) · [原版 PDF](https://jmlr.org/papers/volume12/pedregosa11a/pedregosa11a.pdf)。本文是原论文摘要、正文、表格和参考文献的 Markdown 转写；省略通信地址、页眉页脚，合并 PDF 的断行。数字与版本均保留 2011 年原文语境。摘要、项目愿景、基础技术与结论附有本示例新译的中文，可逐段切换。© 2011 作者；按 [JMLR 的 CC BY 出版政策](https://jmlr.org/author-info.html#publication)署名转载。

## Abstract

<translations default="origin">

<origin>

Scikit-learn is a Python module integrating a wide range of state-of-the-art machine learning algorithms for medium-scale supervised and unsupervised problems. This package focuses on bringing machine learning to non-specialists using a general-purpose high-level language. Emphasis is put on ease of use, performance, documentation, and API consistency. It has minimal dependencies and is distributed under the simplified BSD license, encouraging its use in both academic and commercial settings. Source code, binaries, and documentation can be downloaded from http://scikit-learn.sourceforge.net.

</origin>

<translation>

Scikit-learn 是一个 Python 模块，集成了多种先进的机器学习算法，适用于中等规模的有监督和无监督问题。这个软件包侧重于让非专业人士也能接触机器学习，使用 Python 这样的通用高级语言。它强调易用性、性能、文档以及 API 的一致性，依赖很少，并采用简化的 BSD 许可证，鼓励学术和商业使用。源码、二进制包与文档可从 http://scikit-learn.sourceforge.net 获取。

</translation>

</translations>

**Keywords:** Python, supervised learning, unsupervised learning, model selection

## 1. Introduction

The Python programming language is establishing itself as one of the most popular languages for scientific computing. Thanks to its high-level interactive nature and its maturing ecosystem of scientific libraries, it is an appealing choice for algorithmic development and exploratory data analysis (Dubois, 2007; Milmann and Avaizis, 2011)<ref ids="sk-2,sk-9" />. Yet, as a general-purpose language, it is increasingly used not only in academic settings but also in industry. Scikit-learn harnesses this rich environment to provide state-of-the-art implementations of many well known machine learning algorithms, while maintaining an easy-to-use interface tightly integrated with the Python language. This answers the growing need for statistical data analysis by non-specialists in the software and web industries, as well as in fields outside of computer-science, such as biology or physics. Scikit-learn differs from other machine learning toolboxes in Python for various reasons: i) it is distributed under the BSD license ii) it incorporates compiled code for efficiency, unlike MDP (Zito et al., 2008)<ref id="sk-15" /> and pybrain (Schaul et al., 2010)<ref id="sk-12" />, iii) it depends only on numpy and scipy to facilitate easy distribution, unlike pymvpa (Hanke et al., 2009)<ref id="sk-6" /> that has optional dependencies such as R and shogun, and iv) it focuses on imperative programming, unlike pybrain which uses a data-flow framework. While the package is mostly written in Python, it incorporates the C++ libraries LibSVM (Chang and Lin, 2001)<ref id="sk-1" /> and LibLinear (Fan et al., 2008)<ref id="sk-3" /> that provide reference implementations of SVMs and generalized linear models with compatible licenses. Binary packages are available on a rich set of platforms including Windows and any POSIX platforms.

Furthermore, thanks to its liberal license, it has been widely distributed as part of major free software distributions such as Ubuntu, Debian, Mandriva, NetBSD and Macports and in commercial distributions such as the “Enthought Python Distribution”.

## 2. Project Vision

<translations default="origin">

<origin>

**Code quality.** Rather than providing as many features as possible, the project’s goal has been to provide solid implementations. Code quality is ensured with unit tests—as of release 0.8, test coverage is 81%—and the use of static analysis tools such as pyflakes and pep8. Finally, we strive to use consistent naming for the functions and parameters used throughout a strict adherence to the Python coding guidelines and numpy style documentation.

</origin>

<translation>

**代码质量。** 项目的目标是提供扎实的实现，而不是尽可能堆叠功能。单元测试以及 pyflakes、pep8 等静态分析工具保障代码质量；在 0.8 版本中，测试覆盖率达到 81%。项目还力求统一函数与参数的命名，遵循 Python 编码规范和 NumPy 风格的文档约定。

</translation>

</translations>

<translations default="origin">

<origin>

**BSD licensing.** Most of the Python ecosystem is licensed with non-copyleft licenses. While such policy is beneficial for adoption of these tools by commercial projects, it does impose some restrictions: we are unable to use some existing scientific code, such as the GSL.

</origin>

<translation>

**BSD 许可。** Python 生态中的大多数软件采用非 copyleft 许可证。这有利于商业项目采用这些工具，但也带来限制：项目无法使用某些已有的科学计算代码，例如 GSL。

</translation>

</translations>

<translations default="origin">

<origin>

**Bare-bone design and API.** To lower the barrier of entry, we avoid framework code and keep the number of different objects to a minimum, relying on numpy arrays for data containers.

</origin>

<translation>

**精简设计与 API。** 为了降低使用门槛，我们避免引入框架式代码，尽量减少不同对象的数量，并以 NumPy 数组作为数据容器。

</translation>

</translations>

<translations default="origin">

<origin>

**Community-driven development.** We base our development on collaborative tools such as git, github and public mailing lists. External contributions are welcome and encouraged.

</origin>

<translation>

**社区驱动的开发。** 项目依托 Git、GitHub 和公开邮件列表等协作工具进行开发，欢迎并鼓励外部贡献。

</translation>

</translations>

<translations default="origin">

<origin>

**Documentation.** Scikit-learn provides a ∼300 page user guide including narrative documentation, class references, a tutorial, installation instructions, as well as more than 60 examples, some featuring real-world applications. We try to minimize the use of machine-learning jargon, while maintaining precision with regards to the algorithms employed.

</origin>

<translation>

**文档。** 当时的 scikit-learn 提供约 300 页用户指南，包含说明性文档、类参考、教程、安装说明和 60 多个示例，其中部分来自真实应用。项目尽量减少机器学习术语，同时准确介绍所用算法。

</translation>

</translations>

## 3. Underlying Technologies

<translations default="origin">

<origin>

**Numpy:** the base data structure used for data and model parameters. Input data is presented as numpy arrays, thus integrating seamlessly with other scientific Python libraries. Numpy’s view-based memory model limits copies, even when binding with compiled code (Van der Walt et al., 2011)<ref id="sk-14" />. It also provides basic arithmetic operations.

</origin>

<translation>

**NumPy：** 用于存放数据和模型参数的基础数据结构。输入数据采用 NumPy 数组，因此可以与其他科学 Python 库无缝结合。NumPy 基于视图的内存模型减少了复制，即使与编译代码绑定时也是如此。它还提供基本算术操作。

</translation>

</translations>

<translations default="origin">

<origin>

**Scipy:** efficient algorithms for linear algebra, sparse matrix representation, special functions and basic statistical functions. Scipy has bindings for many Fortran-based standard numerical packages, such as LAPACK. This is important for ease of installation and portability, as providing libraries around Fortran code can prove challenging on various platforms.

</origin>

<translation>

**SciPy：** 提供高效的线性代数算法、稀疏矩阵表示、特殊函数和基础统计函数，并为 LAPACK 等许多以 Fortran 编写的标准数值计算包提供绑定。这有助于安装和移植，因为围绕 Fortran 代码提供跨平台软件库往往并不容易。

</translation>

</translations>

<translations default="origin">

<origin>

**Cython:** a language for combining C in Python. Cython makes it easy to reach the performance of compiled languages with Python-like syntax and high-level operations. It is also used to bind compiled libraries, eliminating the boilerplate code of Python/C extensions.

</origin>

<translation>

**Cython：** 一种在 Python 中结合 C 的语言。它保留类似 Python 的语法和高级操作，同时便于达到编译语言的性能；它也用于绑定已编译的软件库，减少编写 Python/C 扩展时的样板代码。

</translation>

</translations>

## 4. Code Design

**Objects specified by interface, not by inheritance.** To facilitate the use of external objects with scikit-learn, inheritance is not enforced; instead, code conventions provide a consistent interface. The central object is an estimator, that implements a fit method, accepting as arguments an input data array and, optionally, an array of labels for supervised problems. Supervised estimators, such as SVM classifiers, can implement a predict method. Some estimators, that we call transformers, for example, PCA, implement a transform method, returning modified input data. Estimators may also provide a score method, which is an increasing evaluation of goodness of fit: a log-likelihood, or a negated loss function. The other important object is the cross-validation iterator, which provides pairs of train and test indices to split input data, for example K-fold, leave one out, or stratified cross-validation.

**Model selection.** Scikit-learn can evaluate an estimator’s performance or select parameters using cross-validation, optionally distributing the computation to several cores. This is accomplished by wrapping an estimator in a GridSearchCV object, where the “CV” stands for “cross-validated”. During the call to fit, it selects the parameters on a specified parameter grid, maximizing a score (the score method of the underlying estimator). predict, score, or transform are then delegated to the tuned estimator. This object can therefore be used transparently as any other estimator. Cross validation can be made more efficient for certain estimators by exploiting specific properties, such as warm restarts or regularization paths (Friedman et al., 2010)<ref id="sk-4" />. This is supported through special objects, such as the LassoCV. Finally, a Pipeline object can combine several transformers and an estimator to create a combined estimator to, for example, apply dimension reduction before fitting. It behaves as a standard estimator, and GridSearchCV therefore tune the parameters of all steps.

| Algorithm | scikit-learn | mlpy | pybrain | pymvpa | mdp | shogun |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Support Vector Classification | 5.2 | 9.47 | 17.5 | 11.52 | 40.48 | 5.63 |
| Lasso (LARS) | 1.17 | 105.3 | — | 37.35 | — | — |
| Elastic Net | 0.52 | 73.7 | — | 1.44 | — | — |
| k-Nearest Neighbors | 0.57 | 1.41 | — | 0.56 | 0.58 | 1.36 |
| PCA (9 components) | 0.18 | — | — | 8.93 | 0.47 | 0.33 |
| k-Means (9 clusters) | 1.34 | 0.79 | ⋆ | — | 35.75 | 0.68 |
| License | BSD | GPL | BSD | BSD | BSD | GPL |

—: Not implemented. ⋆: Does not converge within 1 hour.

**Table 1.** Time in seconds on the Madelon data set for various machine learning libraries exposed in Python: MLPy (Albanese et al., 2008)<ref id="sk-0" />, PyBrain (Schaul et al., 2010)<ref id="sk-12" />, pymvpa (Hanke et al., 2009)<ref id="sk-6" />, MDP (Zito et al., 2008)<ref id="sk-15" /> and Shogun (Sonnenburg et al., 2010)<ref id="sk-13" />. For more benchmarks see http://github.com/scikit-learn.

## 5. High-level yet Efficient: Some Trade Offs

While scikit-learn focuses on ease of use, and is mostly written in a high level language, care has been taken to maximize computational efficiency. In Table 1, we compare computation time for a few algorithms implemented in the major machine learning toolkits accessible in Python. We use the Madelon data set (Guyon et al., 2004)<ref id="sk-5" />, 4400 instances and 500 attributes, The data set is quite large, but small enough for most algorithms to run.

**SVM.** While all of the packages compared call libsvm in the background, the performance of scikit-learn can be explained by two factors. First, our bindings avoid memory copies and have up to 40% less overhead than the original libsvm Python bindings. Second, we patch libsvm to improve efficiency on dense data, use a smaller memory footprint, and better use memory alignment and pipelining capabilities of modern processors. This patched version also provides unique features, such as setting weights for individual samples.

**LARS.** Iteratively refining the residuals instead of recomputing them gives performance gains of 2–10 times over the reference R implementation (Hastie and Efron, 2004)<ref id="sk-7" />. Pymvpa uses this implementation via the Rpy R bindings and pays a heavy price to memory copies.

**Elastic Net.** We benchmarked the scikit-learn coordinate descent implementations of Elastic Net. It achieves the same order of performance as the highly optimized Fortran version glmnet (Friedman et al., 2010)<ref id="sk-4" /> on medium-scale problems, but performance on very large problems is limited since we do not use the KKT conditions to define an active set.

**kNN.** The k-nearest neighbors classifier implementation constructs a ball tree (Omohundro, 1989)<ref id="sk-10" /> of the samples, but uses a more efficient brute force search in large dimensions.

**PCA.** For medium to large data sets, scikit-learn provides an implementation of a truncated PCA based on random projections (Rokhlin et al., 2009)<ref id="sk-11" />.

**k-means.** scikit-learn’s k-means algorithm is implemented in pure Python. Its performance is limited by the fact that numpy’s array operations take multiple passes over data.

## 6. Conclusion

<translations default="origin">

<origin>

Scikit-learn exposes a wide variety of machine learning algorithms, both supervised and unsupervised, using a consistent, task-oriented interface, thus enabling easy comparison of methods for a given application. Since it relies on the scientific Python ecosystem, it can easily be integrated into applications outside the traditional range of statistical data analysis. Importantly, the algorithms, implemented in a high-level language, can be used as building blocks for approaches specific to a use case, for example, in medical imaging (Michel et al., 2011)<ref id="sk-8" />. Future work includes online learning, to scale to large data sets.

</origin>

<translation>

Scikit-learn 通过一致、面向任务的接口，提供多种有监督和无监督机器学习算法，让用户容易比较不同方法在某个应用中的表现。它依托科学 Python 生态，可以方便地集成到传统统计分析之外的应用中。这些使用高级语言实现的算法，也可以作为针对特定用途的方法的组成部分，例如医学影像。论文当时提出的未来工作包括在线学习，以扩展到大规模数据集。

</translation>

</translations>

## References

1. D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008.<ref id="sk-0" />

2. C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001.<ref id="sk-1" />

3. P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science & Engineering. IEEE/AIP, May 2007.<ref id="sk-2" />

4. R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008.<ref id="sk-3" />

5. J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010.<ref id="sk-4" />

6. I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004.<ref id="sk-5" />

7. M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):37–53, 2009.<ref id="sk-6" />

8. T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004.<ref id="sk-7" />

9. V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of print, April 2011. doi: 10.1016/j.patcog.2011.04.006.<ref id="sk-8" />

10. K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science & Engineering. IEEE/AIP, March 2011.<ref id="sk-9" />

11. S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989.<ref id="sk-10" />

12. V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009.<ref id="sk-11" />

13. T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010.<ref id="sk-12" />

14. S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning Research, 11:1799–1802, 2010.<ref id="sk-13" />

15. S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011.<ref id="sk-14" />

16. T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008.<ref id="sk-15" />

<citation id="sk-0" title="MLPy: high-performance Python package for predictive modeling" summary="D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008." description="D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008." />

<citation id="sk-1" title="LIBSVM: a library for support vector machines" summary="C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001." description="C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001." />

<citation id="sk-2" title="Python: Batteries Included" summary="P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science &amp; Engineering. IEEE/AIP, May 2007." description="P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science &amp; Engineering. IEEE/AIP, May 2007." />

<citation id="sk-3" title="LIBLINEAR: a library for large linear classification" summary="R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008." description="R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008." />

<citation id="sk-4" title="Regularization paths for generalized linear models via coordinate descent" summary="J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010." description="J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010." />

<citation id="sk-5" title="Result analysis of the NIPS 2003 feature selection challenge" summary="I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004." description="I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004." />

<citation id="sk-6" title="PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data" summary="M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):" description="M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):37–53, 2009." />

<citation id="sk-7" title="Least Angle Regression, Lasso and Forward Stagewise" summary="T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004." description="T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004." />

<citation id="sk-8" title="A supervised clustering approach for fMRI-based inference of brain states" summary="V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of p" description="V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of print, April 2011. doi: 10.1016/j.patcog.2011.04.006." />

<citation id="sk-9" title="Scientific Python" summary="K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science &amp; Engineering. IEEE/AIP, March 2011." description="K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science &amp; Engineering. IEEE/AIP, March 2011." />

<citation id="sk-10" title="Five balltree construction algorithms" summary="S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989." description="S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989." />

<citation id="sk-11" title="A randomized algorithm for principal component analysis" summary="V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009." description="V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009." />

<citation id="sk-12" title="PyBrain" summary="T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010." description="T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010." />

<citation id="sk-13" title="The SHOGUN machine learning toolbox" summary="S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning R" description="S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning Research, 11:1799–1802, 2010." />

<citation id="sk-14" title="The NumPy array: A structure for efficient numerical computation" summary="S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011." description="S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011." />

<citation id="sk-15" title="Modular toolkit for data processing (MDP): A Python data processing framework" summary="T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008." description="T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008." />
`,VO=`# Feature Visualization · 特征可视化

Chris Olah, Alexander Mordvintsev, Ludwig Schubert · **Distill, 2017**

> 原论文的选段与插图重排，中文为本示例新译；图注中的读图说明由本示例补充。英文与图片 © 原作者，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 署名使用。[完整论文](https://distill.pub/2017/feature-visualization/)包含交互演示与完整参考文献。

## 1. Seeing what a network looks for

<translations default="both">

<origin>

There is a growing sense that neural networks need to be interpretable to humans. The field of neural network interpretability has formed in response to these concerns. As it matures, two major threads of research have begun to coalesce: feature visualization and attribution.<ref id="fv-paper" />

</origin>

<translation>

人们越来越认识到，神经网络需要能够被人类理解。神经网络可解释性研究正是回应这些关切而形成的。随着这一领域逐渐成熟，两条主要研究方向开始汇聚：**特征可视化**与**归因**。<ref id="fv-paper" />

</translation>

</translations>

<definition title="特征可视化与归因">

特征可视化通过生成例子，研究网络或网络的一部分在寻找什么；归因则研究一个给定例子的哪些部分促成了网络的某种响应。二者回答的问题不同，可以结合使用。

</definition>

## 2. Optimization objectives

<translations default="origin">

<origin>

Neural networks are, generally speaking, differentiable with respect to their inputs. If we want to find out what kind of input would cause a certain behavior—whether that’s an internal neuron firing or the final output behavior—we can use derivatives to iteratively tweak the input towards that goal.

</origin>

<translation>

一般来说，神经网络相对于输入是可微的。如果想知道什么样的输入会引发某种行为——无论是内部神经元的激活，还是最终的输出——我们都可以利用导数，反复调整输入，使它逐步朝这个目标靠近。

</translation>

</translations>

下面的[图 1](#fv-objectives)比较单个神经元与整个通道的优化目标。图像来自原论文，不是自然照片，也不是分类模型对某个类别的完整定义。

<figures id="fv-objectives" min-width="160" max-width="240" min-height="120" max-height="240">

<figure src="./papers/feature-neuron.png" alt="针对单个神经元优化的图像" caption="(a) Neuron：固定空间位置与通道。" />

<figure src="./papers/feature-channel.png" alt="针对整个通道优化的图像" caption="(b) Channel：跨空间位置优化通道响应。" />

<figcaption>

**图 1 · 两种优化目标。** 单神经元目标与通道目标可以产生不同的图像结构。原论文使用 GoogLeNet 展示这些方法。© Olah、Mordvintsev、Schubert，CC BY 4.0。

</figcaption>

</figures>

<translations default="translation">

<origin>

If we want to understand individual features, we can search for examples where they have high values—either for a neuron at an individual position, or for an entire channel. We used the channel objective to create most of the images in this article.

</origin>

<translation>

如果想理解单个特征，我们可以寻找使其响应较高的例子：既可以针对某个空间位置上的神经元，也可以针对整个通道。本文大多数图像都采用通道目标生成。

</translation>

</translations>

用简化的记号表示，寻找高响应输入可以写成：

$$
x^* = \\operatorname*{arg\\,max}_{x} a_c(x)
$$

这里的公式是阅读提示：$a_c$ 表示所选目标的激活值。实际生成质量还与参数化和正则化有关。

## 3. One example is not the whole feature

<translations default="origin">

<origin>

Do our examples show us the full picture? When we create examples by optimization, this is something we need to be very careful of. It’s entirely possible for genuine examples to still mislead us by only showing us one “facet” of what a feature represents.

</origin>

<translation>

这些例子展示了完整面貌吗？通过优化生成例子时，我们必须格外小心。即使例子本身真实有效，也可能只展示一个特征所代表事物的某个“侧面”，从而误导我们。

</translation>

</translations>

<figures id="fv-diversity" columns="2" rows="1" min-width="160" min-height="80" max-width="720" max-height="250">

<figure src="./papers/feature-optimized.png" alt="mixed4a 通道 97 的一次优化结果" max-width="220" caption="(a) 单次优化得到的一种表现。" />

<figure src="./papers/feature-diversity.png" alt="mixed4a 通道 97 加入多样性目标后的四种结果" caption="(b) 多样性优化揭示四种弯曲结构。" />

<figcaption>

**图 2 · 同一通道的不同侧面。** GoogLeNet，mixed4a，unit 97。固定双栏便于比较，窄屏会按图片的最小可读尺寸回到单栏；所有图片保留原始比例。© 原作者，CC BY 4.0。

</figcaption>

</figures>

<translations default="origin">

<origin>

Dataset examples have a big advantage here. By looking through our dataset, we can find diverse examples. It doesn’t just give us ones activating a neuron intensely: we can look across a whole spectrum of activations to see what activates the neuron to different extents.

</origin>

<translation>

数据集中的例子在这里具有很大优势。浏览数据集，可以找到多种多样的例子。它们不仅包括强烈激活某个神经元的输入：我们还可以沿着整个激活强度谱观察，了解哪些输入会让神经元产生不同程度的响应。

</translation>

</translations>

## 4. A building block, not a complete explanation

<translations default="origin">

<origin>

In the quest to make neural networks interpretable, feature visualization stands out as one of the most promising and developed research directions. By itself, feature visualization will never give a completely satisfactory understanding. We see it as one of the fundamental building blocks that, combined with additional tools, will empower humans to understand these systems.

</origin>

<translation>

在使神经网络可解释的探索中，特征可视化是最有前景、发展也最充分的研究方向之一。但仅靠特征可视化，永远无法得到完全令人满意的理解。我们把它看作一块基础积木：与其他工具结合，才有望帮助人们理解这些系统。

</translation>

</translations>

## References and further reading

1. Olah, Mordvintsev & Schubert. *Feature Visualization*. Distill (2017).<ref id="fv-paper" />
2. Olah et al. *The Building Blocks of Interpretability*. Distill (2018).<ref id="fv-followup" />

<citation id="fv-paper" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="优化目标、多样性、神经元交互、正则化与参数化。" description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007。本文英文选段及全部插图的来源，CC BY 4.0。" />

<citation id="fv-followup" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="将特征可视化、归因与降维组合成可解释性界面。" description="Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010。可在顶部“加载”菜单继续阅读其图文译读样例。" />
`,$O=`# The Building Blocks of Interpretability

Chris Olah, Arvind Satyanarayan, Ian Johnson, Shan Carter, Ludwig Schubert, Katherine Ye, Alexander Mordvintsev · **Distill, 2018**

> 原论文选段与原始插图的阅读版，中文为本示例新译，图注说明经整理。[完整论文及交互图](https://distill.pub/2018/building-blocks/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。英文与图片 © 原作者。这里的静态插图不复现原站的交互操作。

## 1. Composable explanations

<translations default="both">

<origin>

In this article, we treat existing interpretability methods as fundamental and composable building blocks for rich user interfaces. We find that these disparate techniques now come together in a unified grammar, fulfilling complementary roles in the resulting interfaces. Moreover, this grammar allows us to systematically explore the space of interpretability interfaces, enabling us to evaluate whether they meet particular goals.<ref id="bb-paper" />

</origin>

<translation>

在本文中，我们把已有的可解释性方法视为构建丰富用户界面的基础积木，并让它们能够相互组合。这些不同的技术可以形成统一的语法，在界面中承担互补的角色。这样的语法还让我们能够系统地探索可解释性界面的设计空间，判断它们是否满足特定目标。<ref id="bb-paper" />

</translation>

</translations>

## 2. Giving meaning to hidden layers

<translations default="origin">

<origin>

However, the power of neural networks lies in their hidden layers—at every layer, the network discovers a new representation of the input. In computer vision, we use neural networks that run the same feature detectors at every position in the image. We can think of each layer’s learned representation as a three-dimensional cube. Each cell in the cube is an activation, or the amount a neuron fires.

</origin>

<translation>

然而，神经网络的力量在于隐藏层：在每一层，网络都为输入找到一种新的表示。在计算机视觉中，同一组特征检测器会在图像的各个位置运行。因此，每一层学到的表示可以看作一个三维立方体，其中每个单元都是一个激活值，也就是某个神经元的响应强度。

</translation>

</translations>

<translations default="origin">

<origin>

To make a semantic dictionary, we pair every neuron activation with a visualization of that neuron and sort them by the magnitude of the activation. This marriage of activations and feature visualization changes our relationship with the underlying mathematical object. Activations now map to iconic representations, instead of abstract indices, with many appearing to be similar to salient human ideas, such as “floppy ear,” “dog snout,” or “fur.”

</origin>

<translation>

构建语义字典时，我们把每个神经元的激活与它的可视化结果配对，再按激活强度排序。激活值与特征可视化的结合，改变了我们理解底层数学对象的方式。激活现在对应形象的视觉符号，而不只是抽象索引；其中许多看起来接近人类熟悉的概念，例如“垂耳”“狗鼻子”或“毛皮”。

</translation>

</translations>

<figure id="bb-pca" max-width="none" max-height="360">

![激活可视化、激活 PCA 与对应视觉基底](./papers/building-activation.png)

<figcaption>

**图 1 · 通过降维获得概览。** 左侧显示空间位置上的激活可视化，中间用 PCA 的分量编码激活，右侧用可视化图像解释这些方向。原图文字和图像完整保留；© Olah et al.，CC BY 4.0。

</figcaption>

</figure>

## 3. Choosing a basis

<translations default="translation">

<origin>

While we introduce semantic dictionaries in terms of neurons, they can be used with any basis of activations. We will explore this more later.

</origin>

<translation>

虽然我们以神经元为单位介绍语义字典，但它也可以用于激活空间的任意一组基底。后文将进一步讨论这一点。

</translation>

</translations>

<figure id="bb-basis" src="./papers/building-vector.png" alt="同一个激活向量分别用主成分与神经元表示" max-width="none" max-height="240" caption="图 2 · 同一激活向量可以用主成分或神经元作为基底表示；不同的视觉词汇强调不同结构。© 原作者，CC BY 4.0。" />

读图时可以把[图 1](#bb-pca)和[图 2](#bb-basis)联系起来：颜色压缩了高维信息，可视化基底则帮助读者理解这些颜色代表什么。

## 4. Attribution between layers

<translations default="origin">

<origin>

An alternate way to slice the cube is by channels instead of spatial locations. Doing so allows us to perform channel attribution: how much did each detector contribute to the final output?

</origin>

<translation>

另一种切分这个立方体的方式，是按通道，而不是按空间位置切分。这样就能进行通道归因：每个检测器对最终输出贡献了多少？

</translation>

</translations>

<figure id="bb-attribution" src="./papers/building-attribution.png" alt="跨隐藏层的通道归因图" max-width="none" max-height="380">

<figcaption>

**图 3 · 通道归因。** 用语义字典中的视觉符号呈现通道及其贡献关系。原站支持悬浮和逐层探索；这里保留原始静态图。© 原作者，CC BY 4.0。

</figcaption>

</figure>

## 5. Keeping explanations human-scale

<translations default="origin">

<origin>

If we want to make useful interfaces into neural networks, it isn’t enough to make things meaningful. We need to make them human scale, rather than overwhelming dumps of information. The key to doing so is finding more meaningful ways of breaking up our activations. There is good reason to believe that such decompositions exist. Often, many channels or spatial positions will work together in a highly correlated way and are most useful to think of as one unit.

</origin>

<translation>

如果想为神经网络构建有用的界面，仅让信息具有意义还不够。我们需要把信息控制在人能够理解的尺度，而不是把海量信息一股脑倾倒出来。关键在于找到更有意义的激活分解方式。我们有理由相信这种分解存在：许多通道或空间位置往往高度相关地协同工作，将它们作为一个整体来理解更有用。

</translation>

</translations>

<question title="为什么需要组合解释方法？">

<question-content>理解这些图像时，哪一种判断更合适？</question-content>

<question-sel-grp answer="[1]">

<question-sel>给每个神经元起一个名称，就完整解释了模型。</question-sel>
<question-sel>把可视化、归因和降维结合起来，可以在不同尺度上提出互补的问题。</question-sel>

</question-sel-grp>

<question-hint>想一想每种方法保留了什么、又聚合或丢失了什么。</question-hint>
<question-answer>第二项更合适。论文讨论的是可组合的方法及其界面设计；每种聚合都存在取舍。</question-answer>

</question>

## References

1. Olah et al. *The Building Blocks of Interpretability*. Distill (2018).<ref id="bb-paper" />
2. Olah, Mordvintsev & Schubert. *Feature Visualization*. Distill (2017).<ref id="bb-feature" />

<citation id="bb-paper" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="语义字典、隐藏层归因与面向人类尺度的解释界面。" description="Chris Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010。本文英文选段与插图均来自原文，按 CC BY 4.0 使用。" />

<citation id="bb-feature" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="以优化得到的图像理解模型寻找的特征。" description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007。" />
`,GO=[{id:"welcome",label:"阅读与排版",description:"从一篇完整的文章开始",source:S1},{id:"streaming",label:"逐字抵达",description:"组件语法、流式代码与公式",source:_O},{id:"notes",label:"做一点笔记",description:"从复述到提问的完整阅读练习",source:IO},{id:"code",label:"公式与代码",description:"数值积分、误差与梯度下降",source:HO},{id:"express",label:"Express README",description:"Web 框架的设计与使用 · 英文",source:BO},{id:"axios",label:"Axios README",description:"请求、示例与 API 配置 · 英文",source:qO},{id:"alice",label:"爱丽丝漫游奇境",description:"英文原著前三章 · 各章选段中英对照",source:PO},{id:"chibi",label:"前赤壁赋",description:"苏轼 · 水与月的对话",source:UO},{id:"paper",label:"scikit-learn 论文",description:"2011 年原论文 · 选段译文与引用",source:FO},{id:"feature-visualization",label:"Feature Visualization",description:"Distill 2017 · 多图布局与逐段译文",source:VO},{id:"building-blocks",label:"可解释性的基础积木",description:"Distill 2018 · 论文插图与中英对照",source:$O},{id:"long",label:"长文阅读",description:"120 节内容，试试目录和滚动",source:Array.from({length:120},(t,i)=>`## 第 ${i+1} 节 · 足够长的标题需要自动换行以保持目录宽度

第 ${i+1} 节内容。

${"长文阅读需要保持清晰、稳定和流畅。".repeat(30)}`).join(`

`)}];function YO(t,i){return new Promise((a,o)=>{if(i.aborted){o(i.reason);return}const s=()=>{clearTimeout(c),o(i.reason)},c=setTimeout(()=>{i.removeEventListener("abort",s),a()},t);i.addEventListener("abort",s,{once:!0})})}function JO({theme:t="light"}){const[i,a]=L.useState(!0),[o,s]=L.useState("尚未请求"),[c,u]=L.useState(null),d=L.useMemo(()=>[Xm({label:"询问助手",prompt:p=>`请解释「${p.text}」。`,adapter:{async*answer({selection:p,signal:f}){s("回答中");try{for(const y of["关于 **",p.text,`** 的说明。

`,"这段回答使用 LiMR 渲染，","并通过同一个插件持续更新。"])await YO(350,f),yield y;s("已完成")}catch(y){throw s(f.aborted?"已取消":"请求失败"),y}}}})],[]);return b.jsxs("div",{className:"demo-page demo-plugin-page",children:[b.jsxs("div",{className:"demo-plugin-intro",children:[b.jsx("p",{children:"选中正文，试试在阅读中发起一次问答。"}),b.jsx("p",{children:"插件提供菜单、角标和流式卡片。这里使用本地模拟回答。"}),b.jsxs("div",{className:"demo-controls",children:[b.jsx("button",{onClick:()=>a(!i),children:i?"卸载阅读器":"挂载阅读器"})," ",b.jsx("output",{id:"adapter-status",children:o})]})]}),i&&b.jsx(sn,{documentId:"plugin-demo",theme:t,source:`# 插件示例

选中 **重要内容**，再从工具菜单询问助手。

## 另一个章节

正文保持独立。`,plugins:d,locale:Vn,onSelectionChange:u}),b.jsx("output",{id:"selection-data",hidden:!0,children:c?JSON.stringify(c):""})]})}const Fu=`# 插件示例

选中 **重要内容**，再从工具菜单询问助手。

单条引用<ref id="single" />与多条引用<ref ids="one,two" />。

## 另一个章节

正文保持独立。

<citation id="single" title="CommonMark Specification" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />

<citation id="one" title="First citation" description="第一条引用的描述。" />

<citation id="two" title="Last citation" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />`,XO=[Xm({label:"询问助手",adapter:{async*answer(){yield"本地回答"}}})],lw=Array.from({length:12},(t,i)=>({id:`answer-${i}`,type:"assistant",range:{start:Fu.indexOf("重要内容"),end:Fu.indexOf("重要内容")+4},data:{text:`关于 **重要内容** 的说明 ${i+1}。

这段回答使用 LiMR 渲染，并通过同一个插件持续更新。`,question:`问题 ${i+1}：请解释这段内容，并给出一个具体的例子。`,status:"complete"}})),Af=[{type:"palette",label:"Custom palette",color:"#d97706",sidebar:{color:"#2563eb",borderColor:"#9333ea",titleColor:"#059669",textColor:"#be185d",excerptColor:"#4f46e5",previewColor:"#0f766e",previewLines:3,Preview:({data:t})=>t==="hide"?null:b.jsxs("p",{children:["Module preview ",b.jsx("span",{style:{color:"#b45309"},children:"Inline preview"})," ","Long subtitle for configurable preview lines. ".repeat(12)]})},Content:()=>b.jsxs("p",{children:["Module text ",b.jsx("span",{style:{color:"#0369a1"},children:"Inline color"})]})}],Wa=`# Citation hover

`+"Readable **rich text** and `inline code` with $x+1$, followed by more words. ".repeat(6)+`<ref id="single" /><ref ids="one,two" /><ref id="single" />

A saved highlight and a hidden highlight.

A **selected passage** with a ranged citation.

Reused source in another paragraph<ref id="single" />.

<citation id="single" title="Single citation" description="A compact description." />

<citation id="one" title="First citation" />

<citation id="two" title="Second citation" />`,ZO=[{id:"saved",type:"highlight",range:{start:Wa.indexOf("saved highlight"),end:Wa.indexOf("saved highlight")+15},data:{color:"#F2C744"}},{id:"hidden",type:"highlight",range:{start:Wa.indexOf("hidden highlight"),end:Wa.indexOf("hidden highlight")+16},data:{color:"#81B29A",hidden:!0}},{id:"ranged",type:"citation",range:{start:Wa.indexOf("selected passage"),end:Wa.indexOf("selected passage")+16},data:{title:"Ranged citation"}}],KO=`# Offscreen references

`+Array.from({length:16},(t,i)=>`Referenced passage ${i+1}<ref id="single" />.`).join(`

`)+`

`+"More reading content after the references. ".repeat(160)+`

<citation id="single" title="Repeated citation" description="A short citation description." />`;function QO(){const t=new URLSearchParams(location.search).has("citations"),i=t&&new URLSearchParams(location.search).has("viewport"),[a,o]=L.useState(i?[]:t?ZO:lw),[s,c]=L.useState("#6366f1"),u=L.useMemo(()=>t?j0({color:s}).annotationTypes:void 0,[t,s]),[d,p]=L.useState(!1),[f,y]=L.useState("light"),[g,x]=L.useState("custom"),[v,w]=L.useState(null),A=new URLSearchParams(location.search).has("nested"),T=new URLSearchParams(location.search).has("previews")?`

摘要<ref id="summary" />，链接<ref id="url" />，标题<ref id="title" />。

<citation id="summary" summary="简短**摘要** &amp; 示例" description="完整描述不覆盖摘要。" url="https://example.com/full" />

<citation id="url" url="https://example.com/reference" />

<citation id="title" title="Title fallback" />`:"",S=i?KO:t?Wa:d?Fu+`

`+Array.from({length:12},(C,R)=>`## Section ${R}

${"正文跟随页面滚动。".repeat(30)}

引用<ref id="single" />。`).join(`

`):Fu+T,E=b.jsx(sn,{documentId:"sidebar-fixture",source:S,annotations:a,annotationTypes:u,onAnnotationsChange:o,plugins:XO,theme:f,locale:Vn,scrollRoot:v});return b.jsxs("div",{className:"demo-page",children:[b.jsxs("div",{className:"demo-controls",children:[b.jsx("button",{onClick:()=>o(C=>[...C,{...lw[0],id:`added-${C.length}`}]),children:"Add annotation"}),b.jsx("button",{onClick:()=>o(C=>C.map(R=>({...R,data:{...R.data,text:`流式回答中的更多内容。

`.repeat(40),status:"streaming"}}))),children:"Stream answer"}),b.jsx("button",{onClick:()=>p(C=>!C),children:"Toggle long document"}),b.jsx("button",{onClick:()=>y(C=>C==="light"?"dark":"light"),children:"Theme"}),b.jsx("button",{onClick:()=>x(C=>C==="custom"?"disabled":C==="disabled"?"empty":"custom"),children:"Toggle preview"}),t&&b.jsx("button",{onClick:()=>c("#0d9488"),children:"Citation color"})]}),A?b.jsx("div",{id:"sidebar-scroll-root",ref:w,style:{height:520,overflow:"auto",border:"1px solid #aaa"},children:E}):E,b.jsx(sn,{documentId:"palette-fixture",source:`# 颜色配置

Module palette.

第二段正文。

第三段正文。`,annotationTypes:g==="disabled"?[{...Af[0],sidebar:{...Af[0].sidebar,Preview:!1}}]:Af,annotations:[{id:"palette",type:"palette",data:g==="empty"?"hide":void 0,range:{start:8,end:14}}],toc:!1,theme:f})]})}function WO(){const[t,i]=L.useState(null),a=new URLSearchParams(location.search).has("reader"),o=L.useMemo(()=>Array.from({length:30},(s,c)=>`## Section ${c+1}

${"A paragraph in a shared scrolling region. ".repeat(25)} <ref id="ref-${c}" />

<citation id="ref-${c}" title="Reference ${c+1}" description="A **nested** description." />`).join(`

`),[]);return b.jsx("div",{className:"demo-page",children:b.jsx("div",{ref:i,id:"scroll-root",style:{height:520,overflowY:"auto",border:"1px solid #aaa"},children:a?b.jsx(sn,{documentId:"scroller",source:o,scrollRoot:t,locale:Vn,style:{padding:20}}):b.jsxs(Nl,{documentId:"scroller",source:o,scrollRoot:t,locale:Vn,children:[b.jsxs("div",{style:{display:"grid",gridTemplateColumns:"190px minmax(0,1fr) 260px",gap:24,padding:20,alignItems:"start"},children:[b.jsx(rc,{style:{position:"sticky",top:0,height:420}}),b.jsx(ni,{}),b.jsx(B0,{})]}),b.jsx(Jm,{disabled:!0}),b.jsx(b1,{})]})})})}function eL(){const t=`# Same heading

<question answer="[0]"><question-content>Choose</question-content><question-sel>A</question-sel><question-sel>B</question-sel></question>

## Next`;return b.jsxs("div",{className:"demo-page",children:[b.jsx(ni,{source:t}),b.jsx(ni,{source:t})]})}const tL={type:"remote",label:"Remote",icon:"◎",overlay:{expand:{placement:"center",height:"80dvh"}},load:async(t,{signal:i})=>{const a=await fetch(`/mock/annotation?version=${t.data?.version??1}`,{signal:i});if(!a.ok)throw new Error("Request failed");return a.json()},Content:({data:t,loading:i,error:a,retry:o})=>b.jsx("div",{children:i?"Loading resource":a?b.jsx("button",{onClick:o,children:"Retry"}):b.jsx("span",{children:t?.title})})};function nL(){const t=Bm();return b.jsxs("div",{children:[b.jsx("button",{onClick:()=>t.invalidateAnnotation("remote"),children:"Refresh resource"}),b.jsx("button",{onClick:()=>t.updateAnnotation("remote",{data:{version:2}}),children:"Change resource"})]})}function iL(){const t=Bm(),i=L.useMemo(()=>a=>{a&&t.addAnnotation({id:"remote",type:"remote",range:{start:0,end:10},data:{version:1}})},[t]);return b.jsxs("div",{ref:i,children:[b.jsx(nL,{}),b.jsx(ni,{}),b.jsx(Jm,{})]})}const aL=[tL];function rL(){return b.jsx("div",{className:"demo-page",children:b.jsx(Nl,{source:`Read once.

<video provider="youtube" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />`,annotationTypes:aL,children:b.jsx(iL,{})})})}function oL(t,i){const a=i||{};return(t[t.length-1]===""?[...t,""]:t).join((a.padRight?" ":"")+","+(a.padLeft===!1?"":" ")).trim()}const lL=/[ \t\n\f\r]/g;function sL(t){return typeof t=="object"?t.type==="text"?sw(t.value):!1:sw(t)}function sw(t){return t.replace(lL,"")===""}class zl{constructor(i,a,o){this.normal=a,this.property=i,o&&(this.space=o)}}zl.prototype.normal={};zl.prototype.property={};zl.prototype.space=void 0;function k1(t,i){const a={},o={};for(const s of t)Object.assign(a,s.property),Object.assign(o,s.normal);return new zl(a,o,i)}function sm(t){return t.toLowerCase()}class bn{constructor(i,a){this.attribute=a,this.property=i}}bn.prototype.attribute="";bn.prototype.booleanish=!1;bn.prototype.boolean=!1;bn.prototype.commaOrSpaceSeparated=!1;bn.prototype.commaSeparated=!1;bn.prototype.defined=!1;bn.prototype.mustUseProperty=!1;bn.prototype.number=!1;bn.prototype.overloadedBoolean=!1;bn.prototype.property="";bn.prototype.spaceSeparated=!1;bn.prototype.space=void 0;let uL=0;const Xe=lr(),Lt=lr(),um=lr(),ke=lr(),xt=lr(),ir=lr(),Mn=lr();function lr(){return 2**++uL}const cm=Object.freeze(Object.defineProperty({__proto__:null,boolean:Xe,booleanish:Lt,commaOrSpaceSeparated:Mn,commaSeparated:ir,number:ke,overloadedBoolean:um,spaceSeparated:xt},Symbol.toStringTag,{value:"Module"})),Ef=Object.keys(cm);class Zm extends bn{constructor(i,a,o,s){let c=-1;if(super(i,a),uw(this,"space",s),typeof o=="number")for(;++c<Ef.length;){const u=Ef[c];uw(this,Ef[c],(o&cm[u])===cm[u])}}}Zm.prototype.defined=!0;function uw(t,i,a){a&&(t[i]=a)}function go(t){const i={},a={};for(const[o,s]of Object.entries(t.properties)){const c=new Zm(o,t.transform(t.attributes||{},o),s,t.space);t.mustUseProperty&&t.mustUseProperty.includes(o)&&(c.mustUseProperty=!0),i[o]=c,a[sm(o)]=o,a[sm(c.attribute)]=o}return new zl(i,a,t.space)}const T1=go({properties:{ariaActiveDescendant:null,ariaAtomic:Lt,ariaAutoComplete:null,ariaBusy:Lt,ariaChecked:Lt,ariaColCount:ke,ariaColIndex:ke,ariaColSpan:ke,ariaControls:xt,ariaCurrent:null,ariaDescribedBy:xt,ariaDetails:null,ariaDisabled:Lt,ariaDropEffect:xt,ariaErrorMessage:null,ariaExpanded:Lt,ariaFlowTo:xt,ariaGrabbed:Lt,ariaHasPopup:null,ariaHidden:Lt,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:xt,ariaLevel:ke,ariaLive:null,ariaModal:Lt,ariaMultiLine:Lt,ariaMultiSelectable:Lt,ariaOrientation:null,ariaOwns:xt,ariaPlaceholder:null,ariaPosInSet:ke,ariaPressed:Lt,ariaReadOnly:Lt,ariaRelevant:null,ariaRequired:Lt,ariaRoleDescription:xt,ariaRowCount:ke,ariaRowIndex:ke,ariaRowSpan:ke,ariaSelected:Lt,ariaSetSize:ke,ariaSort:null,ariaValueMax:ke,ariaValueMin:ke,ariaValueNow:ke,ariaValueText:null,role:null},transform(t,i){return i==="role"?i:"aria-"+i.slice(4).toLowerCase()}});function A1(t,i){return i in t?t[i]:i}function E1(t,i){return A1(t,i.toLowerCase())}const cL=go({attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:ir,acceptCharset:xt,accessKey:xt,action:null,allow:null,allowFullScreen:Xe,allowPaymentRequest:Xe,allowUserMedia:Xe,alpha:Xe,alt:null,as:null,async:Xe,autoCapitalize:null,autoComplete:xt,autoFocus:Xe,autoPlay:Xe,blocking:xt,capture:null,charSet:null,checked:Xe,cite:null,className:xt,closedBy:null,colorSpace:null,cols:ke,colSpan:ke,command:null,commandFor:null,content:null,contentEditable:Lt,controls:Xe,controlsList:xt,coords:ke|ir,crossOrigin:null,data:null,dateTime:null,decoding:null,default:Xe,defer:Xe,dir:null,dirName:null,disabled:Xe,download:um,draggable:Lt,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:Xe,formTarget:null,headers:xt,height:ke,hidden:um,high:ke,href:null,hrefLang:null,htmlFor:xt,httpEquiv:xt,id:null,imageSizes:null,imageSrcSet:null,inert:Xe,inputMode:null,integrity:null,is:null,isMap:Xe,itemId:null,itemProp:xt,itemRef:xt,itemScope:Xe,itemType:xt,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:Xe,low:ke,manifest:null,max:null,maxLength:ke,media:null,method:null,min:null,minLength:ke,multiple:Xe,muted:Xe,name:null,nonce:null,noModule:Xe,noValidate:Xe,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:Xe,optimum:ke,pattern:null,ping:xt,placeholder:null,playsInline:Xe,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:Xe,referrerPolicy:null,rel:xt,required:Xe,reversed:Xe,rows:ke,rowSpan:ke,sandbox:xt,scope:null,scoped:Xe,seamless:Xe,selected:Xe,shadowRootClonable:Xe,shadowRootCustomElementRegistry:Xe,shadowRootDelegatesFocus:Xe,shadowRootMode:null,shadowRootSerializable:Xe,shape:null,size:ke,sizes:null,slot:null,span:ke,spellCheck:Lt,src:null,srcDoc:null,srcLang:null,srcSet:null,start:ke,step:null,style:null,tabIndex:ke,target:null,title:null,translate:null,type:null,typeMustMatch:Xe,useMap:null,value:Lt,width:ke,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:xt,axis:null,background:null,bgColor:null,border:ke,borderColor:null,bottomMargin:ke,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:Xe,declare:Xe,event:null,face:null,frame:null,frameBorder:null,hSpace:ke,leftMargin:ke,link:null,longDesc:null,lowSrc:null,marginHeight:ke,marginWidth:ke,noResize:Xe,noHref:Xe,noShade:Xe,noWrap:Xe,object:null,profile:null,prompt:null,rev:null,rightMargin:ke,rules:null,scheme:null,scrolling:Lt,standby:null,summary:null,text:null,topMargin:ke,valueType:null,version:null,vAlign:null,vLink:null,vSpace:ke,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:Xe,disablePictureInPicture:Xe,disableRemotePlayback:Xe,exportParts:ir,part:xt,prefix:null,property:null,results:ke,security:null,unselectable:null},space:"html",transform:E1}),dL=go({attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",maskType:"mask-type",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},properties:{about:Mn,accentHeight:ke,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:ke,amplitude:ke,arabicForm:null,ascent:ke,attributeName:null,attributeType:null,azimuth:ke,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:ke,by:null,calcMode:null,capHeight:ke,className:xt,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:ke,diffuseConstant:ke,direction:null,display:null,dur:null,divisor:ke,dominantBaseline:null,download:Xe,dx:null,dy:null,edgeMode:null,editable:null,elevation:ke,enableBackground:null,end:null,event:null,exponent:ke,externalResourcesRequired:null,fill:null,fillOpacity:ke,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:ir,g2:ir,glyphName:ir,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:ke,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:ke,horizOriginX:ke,horizOriginY:ke,id:null,ideographic:ke,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:ke,k:ke,k1:ke,k2:ke,k3:ke,k4:ke,kernelMatrix:Mn,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:ke,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:ke,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:ke,overlineThickness:ke,paintOrder:null,panose1:null,path:null,pathLength:ke,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:xt,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:ke,pointsAtY:ke,pointsAtZ:ke,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Mn,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Mn,rev:Mn,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Mn,requiredFeatures:Mn,requiredFonts:Mn,requiredFormats:Mn,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:ke,specularExponent:ke,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:ke,strikethroughThickness:ke,string:null,stroke:null,strokeDashArray:Mn,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:ke,strokeOpacity:ke,strokeWidth:null,style:null,surfaceScale:ke,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Mn,tabIndex:ke,tableValues:null,target:null,targetX:ke,targetY:ke,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Mn,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:ke,underlineThickness:ke,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:ke,values:null,vAlphabetic:ke,vMathematical:ke,vectorEffect:null,vHanging:ke,vIdeographic:ke,version:null,vertAdvY:ke,vertOriginX:ke,vertOriginY:ke,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:ke,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:"svg",transform:A1}),C1=go({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:"xlink",transform(t,i){return"xlink:"+i.slice(5).toLowerCase()}}),R1=go({attributes:{xmlnsxlink:"xmlns:xlink"},properties:{xmlnsXLink:null,xmlns:null},space:"xmlns",transform:E1}),M1=go({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:"xml",transform(t,i){return"xml:"+i.slice(3).toLowerCase()}}),hL={classId:"classID",dataType:"datatype",itemId:"itemID",strokeDashArray:"strokeDasharray",strokeDashOffset:"strokeDashoffset",strokeLineCap:"strokeLinecap",strokeLineJoin:"strokeLinejoin",strokeMiterLimit:"strokeMiterlimit",typeOf:"typeof",xLinkActuate:"xlinkActuate",xLinkArcRole:"xlinkArcrole",xLinkHref:"xlinkHref",xLinkRole:"xlinkRole",xLinkShow:"xlinkShow",xLinkTitle:"xlinkTitle",xLinkType:"xlinkType",xmlnsXLink:"xmlnsXlink"},fL=/[A-Z]/g,cw=/-[a-z]/g,mL=/^data[-\w.:]+$/i;function pL(t,i){const a=sm(i);let o=i,s=bn;if(a in t.normal)return t.property[t.normal[a]];if(a.length>4&&a.slice(0,4)==="data"&&mL.test(i)){if(i.charAt(4)==="-"){const c=i.slice(5).replace(cw,yL);o="data"+c.charAt(0).toUpperCase()+c.slice(1)}else{const c=i.slice(4);if(!cw.test(c)){let u=c.replace(fL,gL);u.charAt(0)!=="-"&&(u="-"+u),i="data"+u}}s=Zm}return new s(o,i)}function gL(t){return"-"+t.toLowerCase()}function yL(t){return t.charAt(1).toUpperCase()}const bL=k1([T1,cL,C1,R1,M1],"html"),Km=k1([T1,dL,C1,R1,M1],"svg");function vL(t){return t.join(" ").trim()}var Qr={},Cf,dw;function xL(){if(dw)return Cf;dw=1;var t=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,i=/\n/g,a=/^\s*/,o=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,s=/^:\s*/,c=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,u=/^[;\s]*/,d=/^\s+|\s+$/g,p=`
`,f="/",y="*",g="",x="comment",v="declaration";function w(T,S){if(typeof T!="string")throw new TypeError("First argument must be a string");if(!T)return[];S=S||{};var E=1,C=1;function R(P){var M=P.match(i);M&&(E+=M.length);var V=P.lastIndexOf(p);C=~V?P.length-V:C+P.length}function _(){var P={line:E,column:C};return function(M){return M.position=new N(P),B(),M}}function N(P){this.start=P,this.end={line:E,column:C},this.source=S.source}N.prototype.content=T;function j(P){var M=new Error(S.source+":"+E+":"+C+": "+P);if(M.reason=P,M.filename=S.source,M.line=E,M.column=C,M.source=T,!S.silent)throw M}function z(P){var M=P.exec(T);if(M){var V=M[0];return R(V),T=T.slice(V.length),M}}function B(){z(a)}function I(P){var M;for(P=P||[];M=X();)M!==!1&&P.push(M);return P}function X(){var P=_();if(!(f!=T.charAt(0)||y!=T.charAt(1))){for(var M=2;g!=T.charAt(M)&&(y!=T.charAt(M)||f!=T.charAt(M+1));)++M;if(M+=2,g===T.charAt(M-1))return j("End of comment missing");var V=T.slice(2,M-2);return C+=2,R(V),T=T.slice(M),C+=2,P({type:x,comment:V})}}function oe(){var P=_(),M=z(o);if(M){if(X(),!z(s))return j("property missing ':'");var V=z(c),$=P({type:v,property:A(M[0].replace(t,g)),value:V?A(V[0].replace(t,g)):g});return z(u),$}}function Y(){var P=[];I(P);for(var M;M=oe();)M!==!1&&(P.push(M),I(P));return P}return B(),Y()}function A(T){return T?T.replace(d,g):g}return Cf=w,Cf}var hw;function wL(){if(hw)return Qr;hw=1;var t=Qr&&Qr.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(Qr,"__esModule",{value:!0}),Qr.default=a;const i=t(xL());function a(o,s){let c=null;if(!o||typeof o!="string")return c;const u=(0,i.default)(o),d=typeof s=="function";return u.forEach(p=>{if(p.type!=="declaration")return;const{property:f,value:y}=p;d?s(f,y,p):y&&(c=c||{},c[f]=y)}),c}return Qr}var gl={},fw;function SL(){if(fw)return gl;fw=1,Object.defineProperty(gl,"__esModule",{value:!0}),gl.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,i=/-([a-z])/g,a=/^[^-]+$/,o=/^-(webkit|moz|ms|o|khtml)-/,s=/^-(ms)-/,c=function(f){return!f||a.test(f)||t.test(f)},u=function(f,y){return y.toUpperCase()},d=function(f,y){return"".concat(y,"-")},p=function(f,y){return y===void 0&&(y={}),c(f)?f:(f=f.toLowerCase(),y.reactCompat?f=f.replace(s,d):f=f.replace(o,d),f.replace(i,u))};return gl.camelCase=p,gl}var yl,mw;function kL(){if(mw)return yl;mw=1;var t=yl&&yl.__importDefault||function(s){return s&&s.__esModule?s:{default:s}},i=t(wL()),a=SL();function o(s,c){var u={};return!s||typeof s!="string"||(0,i.default)(s,function(d,p){d&&p&&(u[(0,a.camelCase)(d,c)]=p)}),u}return o.default=o,yl=o,yl}var TL=kL();const AL=mm(TL),N1=D1("end"),Qm=D1("start");function D1(t){return i;function i(a){const o=a&&a.position&&a.position[t]||{};if(typeof o.line=="number"&&o.line>0&&typeof o.column=="number"&&o.column>0)return{line:o.line,column:o.column,offset:typeof o.offset=="number"&&o.offset>-1?o.offset:void 0}}}function EL(t){const i=Qm(t),a=N1(t);if(i&&a)return{start:i,end:a}}const Wm={}.hasOwnProperty,CL=new Map,RL=/[A-Z]/g,ML=new Set(["table","tbody","thead","tfoot","tr"]),NL=new Set(["td","th"]),j1="https://github.com/syntax-tree/hast-util-to-jsx-runtime";function DL(t,i){if(!i||i.Fragment===void 0)throw new TypeError("Expected `Fragment` in options");const a=i.filePath||void 0;let o;if(i.development){if(typeof i.jsxDEV!="function")throw new TypeError("Expected `jsxDEV` in options when `development: true`");o=BL(a,i.jsxDEV)}else{if(typeof i.jsx!="function")throw new TypeError("Expected `jsx` in production options");if(typeof i.jsxs!="function")throw new TypeError("Expected `jsxs` in production options");o=HL(a,i.jsx,i.jsxs)}const s={Fragment:i.Fragment,ancestors:[],components:i.components||{},create:o,elementAttributeNameCase:i.elementAttributeNameCase||"react",evaluater:i.createEvaluater?i.createEvaluater():void 0,filePath:a,ignoreInvalidStyle:i.ignoreInvalidStyle||!1,passKeys:i.passKeys!==!1,passNode:i.passNode||!1,schema:i.space==="svg"?Km:bL,stylePropertyNameCase:i.stylePropertyNameCase||"dom",tableCellAlignToStyle:i.tableCellAlignToStyle!==!1},c=O1(s,t,void 0);return c&&typeof c!="string"?c:s.create(t,s.Fragment,{children:c||void 0},void 0)}function O1(t,i,a){if(i.type==="element")return jL(t,i,a);if(i.type==="mdxFlowExpression"||i.type==="mdxTextExpression")return OL(t,i);if(i.type==="mdxJsxFlowElement"||i.type==="mdxJsxTextElement")return zL(t,i,a);if(i.type==="mdxjsEsm")return LL(t,i);if(i.type==="root")return _L(t,i,a);if(i.type==="text")return IL(t,i)}function jL(t,i,a){const o=t.schema;let s=o;i.tagName.toLowerCase()==="svg"&&o.space==="html"&&(s=Km,t.schema=s),t.ancestors.push(i);const c=z1(t,i.tagName,!1),u=qL(t,i);let d=tp(t,i);return ML.has(i.tagName)&&(d=d.filter(function(p){return typeof p=="string"?!sL(p):!0})),L1(t,u,c,i),ep(u,d),t.ancestors.pop(),t.schema=o,t.create(i,c,u,a)}function OL(t,i){if(i.data&&i.data.estree&&t.evaluater){const o=i.data.estree.body[0];return o.type,t.evaluater.evaluateExpression(o.expression)}Cl(t,i.position)}function LL(t,i){if(i.data&&i.data.estree&&t.evaluater)return t.evaluater.evaluateProgram(i.data.estree);Cl(t,i.position)}function zL(t,i,a){const o=t.schema;let s=o;i.name==="svg"&&o.space==="html"&&(s=Km,t.schema=s),t.ancestors.push(i);const c=i.name===null?t.Fragment:z1(t,i.name,!0),u=PL(t,i),d=tp(t,i);return L1(t,u,c,i),ep(u,d),t.ancestors.pop(),t.schema=o,t.create(i,c,u,a)}function _L(t,i,a){const o={};return ep(o,tp(t,i)),t.create(i,t.Fragment,o,a)}function IL(t,i){return i.value}function L1(t,i,a,o){typeof a!="string"&&a!==t.Fragment&&t.passNode&&(i.node=o)}function ep(t,i){if(i.length>0){const a=i.length>1?i:i[0];a&&(t.children=a)}}function HL(t,i,a){return o;function o(s,c,u,d){const f=Array.isArray(u.children)?a:i;return d?f(c,u,d):f(c,u)}}function BL(t,i){return a;function a(o,s,c,u){const d=Array.isArray(c.children),p=Qm(o);return i(s,c,u,d,{columnNumber:p?p.column-1:void 0,fileName:t,lineNumber:p?p.line:void 0},void 0)}}function qL(t,i){const a={};let o,s;for(s in i.properties)if(s!=="children"&&Wm.call(i.properties,s)){const c=UL(t,s,i.properties[s]);if(c){const[u,d]=c;t.tableCellAlignToStyle&&u==="align"&&typeof d=="string"&&NL.has(i.tagName)?o=d:a[u]=d}}if(o){const c=a.style||(a.style={});c[t.stylePropertyNameCase==="css"?"text-align":"textAlign"]=o}return a}function PL(t,i){const a={};for(const o of i.attributes)if(o.type==="mdxJsxExpressionAttribute")if(o.data&&o.data.estree&&t.evaluater){const c=o.data.estree.body[0];c.type;const u=c.expression;u.type;const d=u.properties[0];d.type,Object.assign(a,t.evaluater.evaluateExpression(d.argument))}else Cl(t,i.position);else{const s=o.name;let c;if(o.value&&typeof o.value=="object")if(o.value.data&&o.value.data.estree&&t.evaluater){const d=o.value.data.estree.body[0];d.type,c=t.evaluater.evaluateExpression(d.expression)}else Cl(t,i.position);else c=o.value===null?!0:o.value;a[s]=c}return a}function tp(t,i){const a=[];let o=-1;const s=t.passKeys?new Map:CL;for(;++o<i.children.length;){const c=i.children[o];let u;if(t.passKeys){const p=c.type==="element"?c.tagName:c.type==="mdxJsxFlowElement"||c.type==="mdxJsxTextElement"?c.name:void 0;if(p){const f=s.get(p)||0;u=p+"-"+f,s.set(p,f+1)}}const d=O1(t,c,u);d!==void 0&&a.push(d)}return a}function UL(t,i,a){const o=pL(t.schema,i);if(!(a==null||typeof a=="number"&&Number.isNaN(a))){if(Array.isArray(a)&&(a=o.commaSeparated?oL(a):vL(a)),o.property==="style"){let s=typeof a=="object"?a:FL(t,String(a));return t.stylePropertyNameCase==="css"&&(s=VL(s)),["style",s]}return[t.elementAttributeNameCase==="react"&&o.space?hL[o.property]||o.property:o.attribute,a]}}function FL(t,i){try{return AL(i,{reactCompat:!0})}catch(a){if(t.ignoreInvalidStyle)return{};const o=a,s=new ut("Cannot parse `style` attribute",{ancestors:t.ancestors,cause:o,ruleId:"style",source:"hast-util-to-jsx-runtime"});throw s.file=t.filePath||void 0,s.url=j1+"#cannot-parse-style-attribute",s}}function z1(t,i,a){let o;if(!a)o={type:"Literal",value:i};else if(i.includes(".")){const s=i.split(".");let c=-1,u;for(;++c<s.length;){const d=Gv(s[c])?{type:"Identifier",name:s[c]}:{type:"Literal",value:s[c]};u=u?{type:"MemberExpression",object:u,property:d,computed:!!(c&&d.type==="Literal"),optional:!1}:d}o=u}else o=Gv(i)&&!/^[a-z]/.test(i)?{type:"Identifier",name:i}:{type:"Literal",value:i};if(o.type==="Literal"){const s=o.value;return Wm.call(t.components,s)?t.components[s]:s}if(t.evaluater)return t.evaluater.evaluateExpression(o);Cl(t)}function Cl(t,i){const a=new ut("Cannot handle MDX estrees without `createEvaluater`",{ancestors:t.ancestors,place:i,ruleId:"mdx-estree",source:"hast-util-to-jsx-runtime"});throw a.file=t.filePath||void 0,a.url=j1+"#cannot-handle-mdx-estrees-without-createevaluater",a}function VL(t){const i={};let a;for(a in t)Wm.call(t,a)&&(i[$L(a)]=t[a]);return i}function $L(t){let i=t.replace(RL,GL);return i.slice(0,3)==="ms-"&&(i="-"+i),i}function GL(t){return"-"+t.toLowerCase()}const Rf={action:["form"],cite:["blockquote","del","ins","q"],data:["object"],formAction:["button","input"],href:["a","area","base","link"],icon:["menuitem"],itemId:null,manifest:["html"],ping:["a","area"],poster:["video"],src:["audio","embed","iframe","img","input","script","source","track","video"]};function YL(t){const i=this;i.parser=a;function a(o){return Tl(o,{...i.data("settings"),...t,extensions:i.data("micromarkExtensions")||[],mdastExtensions:i.data("fromMarkdownExtensions")||[]})}}function JL(t,i){const a={type:"element",tagName:"blockquote",properties:{},children:t.wrap(t.all(i),!0)};return t.patch(i,a),t.applyData(i,a)}function XL(t,i){const a={type:"element",tagName:"br",properties:{},children:[]};return t.patch(i,a),[t.applyData(i,a),{type:"text",value:`
`}]}function ZL(t,i){const a=i.value?i.value+`
`:"",o={},s=i.lang?i.lang.split(/\s+/):[];s.length>0&&(o.className=["language-"+s[0]]);let c={type:"element",tagName:"code",properties:o,children:[{type:"text",value:a}]};return i.meta&&(c.data={meta:i.meta}),t.patch(i,c),c=t.applyData(i,c),c={type:"element",tagName:"pre",properties:{},children:[c]},t.patch(i,c),c}function KL(t,i){const a={type:"element",tagName:"del",properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}function QL(t,i){const a={type:"element",tagName:"em",properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}function WL(t,i){const a=typeof t.options.clobberPrefix=="string"?t.options.clobberPrefix:"user-content-",o=String(i.identifier).toUpperCase(),s=ho(o.toLowerCase()),c=t.footnoteOrder.indexOf(o);let u,d=t.footnoteCounts.get(o);d===void 0?(d=0,t.footnoteOrder.push(o),u=t.footnoteOrder.length):u=c+1,d+=1,t.footnoteCounts.set(o,d);const p={type:"element",tagName:"a",properties:{href:"#"+a+"fn-"+s,id:a+"fnref-"+s+(d>1?"-"+d:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(u)}]};t.patch(i,p);const f={type:"element",tagName:"sup",properties:{},children:[p]};return t.patch(i,f),t.applyData(i,f)}function e3(t,i){const a={type:"element",tagName:"h"+i.depth,properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}function t3(t,i){if(t.options.allowDangerousHtml){const a={type:"raw",value:i.value};return t.patch(i,a),t.applyData(i,a)}}function _1(t,i){const a=i.referenceType;let o="]";if(a==="collapsed"?o+="[]":a==="full"&&(o+="["+(i.label||i.identifier)+"]"),i.type==="imageReference")return[{type:"text",value:"!["+i.alt+o}];const s=t.all(i),c=s[0];c&&c.type==="text"?c.value="["+c.value:s.unshift({type:"text",value:"["});const u=s[s.length-1];return u&&u.type==="text"?u.value+=o:s.push({type:"text",value:o}),s}function n3(t,i){const a=String(i.identifier).toUpperCase(),o=t.definitionById.get(a);if(!o)return _1(t,i);const s={src:ho(o.url||""),alt:i.alt};o.title!==null&&o.title!==void 0&&(s.title=o.title);const c={type:"element",tagName:"img",properties:s,children:[]};return t.patch(i,c),t.applyData(i,c)}function i3(t,i){const a={src:ho(i.url)};i.alt!==null&&i.alt!==void 0&&(a.alt=i.alt),i.title!==null&&i.title!==void 0&&(a.title=i.title);const o={type:"element",tagName:"img",properties:a,children:[]};return t.patch(i,o),t.applyData(i,o)}function a3(t,i){const a={type:"text",value:i.value.replace(/\r?\n|\r/g," ")};t.patch(i,a);const o={type:"element",tagName:"code",properties:{},children:[a]};return t.patch(i,o),t.applyData(i,o)}function r3(t,i){const a=String(i.identifier).toUpperCase(),o=t.definitionById.get(a);if(!o)return _1(t,i);const s={href:ho(o.url||"")};o.title!==null&&o.title!==void 0&&(s.title=o.title);const c={type:"element",tagName:"a",properties:s,children:t.all(i)};return t.patch(i,c),t.applyData(i,c)}function o3(t,i){const a={href:ho(i.url)};i.title!==null&&i.title!==void 0&&(a.title=i.title);const o={type:"element",tagName:"a",properties:a,children:t.all(i)};return t.patch(i,o),t.applyData(i,o)}function l3(t,i,a){const o=t.all(i),s=a?s3(a):I1(i),c={},u=[];if(typeof i.checked=="boolean"){const y=o[0];let g;y&&y.type==="element"&&y.tagName==="p"?g=y:(g={type:"element",tagName:"p",properties:{},children:[]},o.unshift(g)),g.children.length>0&&g.children.unshift({type:"text",value:" "}),g.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:i.checked,disabled:!0},children:[]}),c.className=["task-list-item"]}let d=-1;for(;++d<o.length;){const y=o[d];(s||d!==0||y.type!=="element"||y.tagName!=="p")&&u.push({type:"text",value:`
`}),y.type==="element"&&y.tagName==="p"&&!s?u.push(...y.children):u.push(y)}const p=o[o.length-1];p&&(s||p.type!=="element"||p.tagName!=="p")&&u.push({type:"text",value:`
`});const f={type:"element",tagName:"li",properties:c,children:u};return t.patch(i,f),t.applyData(i,f)}function s3(t){let i=!1;if(t.type==="list"){i=t.spread||!1;const a=t.children;let o=-1;for(;!i&&++o<a.length;)i=I1(a[o])}return i}function I1(t){const i=t.spread;return i??t.children.length>1}function u3(t,i){const a={},o=t.all(i);let s=-1;for(typeof i.start=="number"&&i.start!==1&&(a.start=i.start);++s<o.length;){const u=o[s];if(u.type==="element"&&u.tagName==="li"&&u.properties&&Array.isArray(u.properties.className)&&u.properties.className.includes("task-list-item")){a.className=["contains-task-list"];break}}const c={type:"element",tagName:i.ordered?"ol":"ul",properties:a,children:t.wrap(o,!0)};return t.patch(i,c),t.applyData(i,c)}function c3(t,i){const a={type:"element",tagName:"p",properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}function d3(t,i){const a={type:"root",children:t.wrap(t.all(i))};return t.patch(i,a),t.applyData(i,a)}function h3(t,i){const a={type:"element",tagName:"strong",properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}function f3(t,i){const a=t.all(i),o=a.shift(),s=[];if(o){const u={type:"element",tagName:"thead",properties:{},children:t.wrap([o],!0)};t.patch(i.children[0],u),s.push(u)}if(a.length>0){const u={type:"element",tagName:"tbody",properties:{},children:t.wrap(a,!0)},d=Qm(i.children[1]),p=N1(i.children[i.children.length-1]);d&&p&&(u.position={start:d,end:p}),s.push(u)}const c={type:"element",tagName:"table",properties:{},children:t.wrap(s,!0)};return t.patch(i,c),t.applyData(i,c)}function m3(t,i,a){const o=a?a.children:void 0,c=(o?o.indexOf(i):1)===0?"th":"td",u=a&&a.type==="table"?a.align:void 0,d=u?u.length:i.children.length;let p=-1;const f=[];for(;++p<d;){const g=i.children[p],x={},v=u?u[p]:void 0;v&&(x.align=v);let w={type:"element",tagName:c,properties:x,children:[]};g&&(w.children=t.all(g),t.patch(g,w),w=t.applyData(g,w)),f.push(w)}const y={type:"element",tagName:"tr",properties:{},children:t.wrap(f,!0)};return t.patch(i,y),t.applyData(i,y)}function p3(t,i){const a={type:"element",tagName:"td",properties:{},children:t.all(i)};return t.patch(i,a),t.applyData(i,a)}const pw=9,gw=32;function g3(t){const i=String(t),a=/\r?\n|\r/g;let o=a.exec(i),s=0;const c=[];for(;o;)c.push(yw(i.slice(s,o.index),s>0,!0),o[0]),s=o.index+o[0].length,o=a.exec(i);return c.push(yw(i.slice(s),s>0,!1)),c.join("")}function yw(t,i,a){let o=0,s=t.length;if(i){let c=t.codePointAt(o);for(;c===pw||c===gw;)o++,c=t.codePointAt(o)}if(a){let c=t.codePointAt(s-1);for(;c===pw||c===gw;)s--,c=t.codePointAt(s-1)}return s>o?t.slice(o,s):""}function y3(t,i){const a={type:"text",value:g3(String(i.value))};return t.patch(i,a),t.applyData(i,a)}function b3(t,i){const a={type:"element",tagName:"hr",properties:{},children:[]};return t.patch(i,a),t.applyData(i,a)}const v3={blockquote:JL,break:XL,code:ZL,delete:KL,emphasis:QL,footnoteReference:WL,heading:e3,html:t3,imageReference:n3,image:i3,inlineCode:a3,linkReference:r3,link:o3,listItem:l3,list:u3,paragraph:c3,root:d3,strong:h3,table:f3,tableCell:p3,tableRow:m3,text:y3,thematicBreak:b3,toml:yu,yaml:yu,definition:yu,footnoteDefinition:yu};function yu(){}const H1=-1,fc=0,Sl=1,Vu=2,np=3,ip=4,ap=5,rp=6,B1=7,q1=8,{defineProperty:x3}=Object,P1=typeof self=="object"?self:globalThis,bw=(t,i)=>{switch(t){case"Function":case"SharedWorker":case"Worker":case"eval":case"setInterval":case"setTimeout":throw new TypeError("unable to deserialize "+t)}return new P1[t](i)},w3=(t,i)=>{const a=(s,c)=>(t.set(c,s),s),o=s=>{if(t.has(s))return t.get(s);const[c,u]=i[s];switch(c){case fc:case H1:return a(u,s);case Sl:{const d=a([],s);for(const p of u)d.push(o(p));return d}case Vu:{const d=a({},s);for(const[p,f]of u){const y=o(p),g=o(f);y==="__proto__"?x3(d,y,{value:g,configurable:!0,enumerable:!0,writable:!0}):d[y]=g}return d}case np:return a(new Date(u),s);case ip:{const{source:d,flags:p}=u;return a(new RegExp(d,p),s)}case ap:{const d=a(new Map,s);for(const[p,f]of u)d.set(o(p),o(f));return d}case rp:{const d=a(new Set,s);for(const p of u)d.add(o(p));return d}case B1:{const{name:d,message:p}=u;return a(typeof P1[d]=="function"?bw(d,p):new Error(p),s)}case q1:return a(BigInt(u),s);case"BigInt":return a(Object(BigInt(u)),s);case"ArrayBuffer":return a(new Uint8Array(u).buffer,u);case"DataView":{const{buffer:d}=new Uint8Array(u);return a(new DataView(d),u)}case"-0":return-0}return a(bw(c,u),s)};return o},vw=t=>w3(new Map,t)(0),er="",{toString:S3}={},{keys:k3,is:T3}=Object,bl=t=>{const i=typeof t;if(i!=="object"||!t)return[fc,i];const a=S3.call(t).slice(8,-1);switch(a){case"Array":return[Sl,er];case"Object":return[Vu,er];case"Date":return[np,er];case"RegExp":return[ip,er];case"Map":return[ap,er];case"Set":return[rp,er];case"DataView":return[Sl,a]}return a.includes("Array")?[Sl,a]:t instanceof Error?[B1,t.name||"Error"]:[Vu,a]},bu=([t,i])=>t===fc&&(i==="function"||i==="symbol"),A3=(t,i,a,o)=>{const s=(u,d)=>{const p=o.push(u)-1;return a.set(d,p),p},c=u=>{if(a.has(u))return a.get(u);let[d,p]=bl(u);switch(d){case fc:{let y=u;switch(p){case"bigint":d=q1,y=u.toString();break;case"number":if(!u&&T3(u,-0))return o.push(["-0"])-1;break;case"function":case"symbol":if(t)throw new TypeError("unable to serialize "+p);y=null;break;case"undefined":return s([H1],u)}return s([d,y],u)}case Sl:{if(p){let x=u;return p==="DataView"?x=new Uint8Array(u.buffer):p==="ArrayBuffer"&&(x=new Uint8Array(u)),s([p,[...x]],u)}const y=[],g=s([d,y],u);for(const x of u)y.push(c(x));return g}case Vu:{if(p)switch(p){case"BigInt":return s([p,u.toString()],u);case"Boolean":case"Number":case"String":return s([p,u.valueOf()],u)}if(i&&"toJSON"in u)return c(u.toJSON());const y=[],g=s([d,y],u);for(const x of k3(u))(t||!bu(bl(u[x])))&&y.push([c(x),c(u[x])]);return g}case np:return s([d,isNaN(u.getTime())?er:u.toISOString()],u);case ip:{const{source:y,flags:g}=u;return s([d,{source:y,flags:g}],u)}case ap:{const y=[],g=s([d,y],u);for(const[x,v]of u)(t||!(bu(bl(x))||bu(bl(v))))&&y.push([c(x),c(v)]);return g}case rp:{const y=[],g=s([d,y],u);for(const x of u)(t||!bu(bl(x)))&&y.push(c(x));return g}}const{message:f}=u;return s([d,{name:p,message:f}],u)};return c},xw=(t,{json:i,lossy:a}={})=>{const o=[];return A3(!(i||a),!!i,new Map,o)(t),o},$u=typeof structuredClone=="function"?(t,i)=>i&&("json"in i||"lossy"in i)?vw(xw(t,i)):structuredClone(t):(t,i)=>vw(xw(t,i));function E3(t,i){const a=[{type:"text",value:"↩"}];return i>1&&a.push({type:"element",tagName:"sup",properties:{},children:[{type:"text",value:String(i)}]}),a}function C3(t,i){return"Back to reference "+(t+1)+(i>1?"-"+i:"")}function R3(t){const i=typeof t.options.clobberPrefix=="string"?t.options.clobberPrefix:"user-content-",a=t.options.footnoteBackContent||E3,o=t.options.footnoteBackLabel||C3,s=t.options.footnoteLabel||"Footnotes",c=t.options.footnoteLabelTagName||"h2",u=t.options.footnoteLabelProperties||{className:["sr-only"]},d=[];let p=-1;for(;++p<t.footnoteOrder.length;){const f=t.footnoteById.get(t.footnoteOrder[p]);if(!f)continue;const y=t.all(f),g=String(f.identifier).toUpperCase(),x=ho(g.toLowerCase());let v=0;const w=[],A=t.footnoteCounts.get(g);for(;A!==void 0&&++v<=A;){w.length>0&&w.push({type:"text",value:" "});let E=typeof a=="string"?a:a(p,v);typeof E=="string"&&(E={type:"text",value:E}),w.push({type:"element",tagName:"a",properties:{href:"#"+i+"fnref-"+x+(v>1?"-"+v:""),dataFootnoteBackref:"",ariaLabel:typeof o=="string"?o:o(p,v),className:["data-footnote-backref"]},children:Array.isArray(E)?E:[E]})}const T=y[y.length-1];if(T&&T.type==="element"&&T.tagName==="p"){const E=T.children[T.children.length-1];E&&E.type==="text"?E.value+=" ":T.children.push({type:"text",value:" "}),T.children.push(...w)}else y.push(...w);const S={type:"element",tagName:"li",properties:{id:i+"fn-"+x},children:t.wrap(y,!0)};t.patch(f,S),d.push(S)}if(d.length!==0)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:c,properties:{...$u(u),id:"footnote-label"},children:[{type:"text",value:s}]},{type:"text",value:`
`},{type:"element",tagName:"ol",properties:{},children:t.wrap(d,!0)},{type:"text",value:`
`}]}}const dm={}.hasOwnProperty,M3={};function N3(t,i){const a=i||M3,o=new Map,s=new Map,c=new Map,u={...v3,...a.handlers},d={all:f,applyData:j3,definitionById:o,footnoteById:s,footnoteCounts:c,footnoteOrder:[],handlers:u,one:p,options:a,patch:D3,wrap:L3};return Mm(t,function(y){if(y.type==="definition"||y.type==="footnoteDefinition"){const g=y.type==="definition"?o:s,x=String(y.identifier).toUpperCase();g.has(x)||g.set(x,y)}}),d;function p(y,g){const x=y.type,v=d.handlers[x];if(dm.call(d.handlers,x)&&v)return v(d,y,g);if(d.options.passThrough&&d.options.passThrough.includes(x)){if("children"in y){const{children:A,...T}=y,S=$u(T);return S.children=d.all(y),S}return $u(y)}return(d.options.unknownHandler||O3)(d,y,g)}function f(y){const g=[];if("children"in y){const x=y.children;let v=-1;for(;++v<x.length;){const w=d.one(x[v],y);if(w){if(v&&x[v-1].type==="break"&&(!Array.isArray(w)&&w.type==="text"&&(w.value=ww(w.value)),!Array.isArray(w)&&w.type==="element")){const A=w.children[0];A&&A.type==="text"&&(A.value=ww(A.value))}Array.isArray(w)?g.push(...w):g.push(w)}}}return g}}function D3(t,i){t.position&&(i.position=EL(t))}function j3(t,i){let a=i;if(t&&t.data){const o=t.data.hName,s=t.data.hChildren,c=t.data.hProperties;if(typeof o=="string")if(a.type==="element")a.tagName=o;else{const u="children"in a?a.children:[a];a={type:"element",tagName:o,properties:{},children:u}}a.type==="element"&&c&&Object.assign(a.properties,$u(c)),"children"in a&&a.children&&s!==null&&s!==void 0&&(a.children=s)}return a}function O3(t,i){const a=i.data||{},o="value"in i&&!(dm.call(a,"hProperties")||dm.call(a,"hChildren"))?{type:"text",value:i.value}:{type:"element",tagName:"div",properties:{},children:t.all(i)};return t.patch(i,o),t.applyData(i,o)}function L3(t,i){const a=[];let o=-1;for(i&&a.push({type:"text",value:`
`});++o<t.length;)o&&a.push({type:"text",value:`
`}),a.push(t[o]);return i&&t.length>0&&a.push({type:"text",value:`
`}),a}function ww(t){let i=0,a=t.charCodeAt(i);for(;a===9||a===32;)i++,a=t.charCodeAt(i);return t.slice(i)}function Sw(t,i){const a=N3(t,i),o=a.one(t,void 0),s=R3(a),c=Array.isArray(o)?{type:"root",children:o}:o||{type:"root",children:[]};return s&&c.children.push({type:"text",value:`
`},s),c}function z3(t,i){return t&&"run"in t?async function(a,o){const s=Sw(a,{file:o,...i});await t.run(s,o)}:function(a,o){return Sw(a,{file:o,...t||i})}}function kw(t){if(t)throw t}var Mf,Tw;function _3(){if(Tw)return Mf;Tw=1;var t=Object.prototype.hasOwnProperty,i=Object.prototype.toString,a=Object.defineProperty,o=Object.getOwnPropertyDescriptor,s=function(f){return typeof Array.isArray=="function"?Array.isArray(f):i.call(f)==="[object Array]"},c=function(f){if(!f||i.call(f)!=="[object Object]")return!1;var y=t.call(f,"constructor"),g=f.constructor&&f.constructor.prototype&&t.call(f.constructor.prototype,"isPrototypeOf");if(f.constructor&&!y&&!g)return!1;var x;for(x in f);return typeof x>"u"||t.call(f,x)},u=function(f,y){a&&y.name==="__proto__"?a(f,y.name,{enumerable:!0,configurable:!0,value:y.newValue,writable:!0}):f[y.name]=y.newValue},d=function(f,y){if(y==="__proto__")if(t.call(f,y)){if(o)return o(f,y).value}else return;return f[y]};return Mf=function p(){var f,y,g,x,v,w,A=arguments[0],T=1,S=arguments.length,E=!1;for(typeof A=="boolean"&&(E=A,A=arguments[1]||{},T=2),(A==null||typeof A!="object"&&typeof A!="function")&&(A={});T<S;++T)if(f=arguments[T],f!=null)for(y in f)g=d(A,y),x=d(f,y),A!==x&&(E&&x&&(c(x)||(v=s(x)))?(v?(v=!1,w=g&&s(g)?g:[]):w=g&&c(g)?g:{},u(A,{name:y,newValue:p(E,w,x)})):typeof x<"u"&&u(A,{name:y,newValue:x}));return A},Mf}var I3=_3();const Nf=mm(I3);function hm(t){if(typeof t!="object"||t===null)return!1;const i=Object.getPrototypeOf(t);return(i===null||i===Object.prototype||Object.getPrototypeOf(i)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)}function H3(){const t=[],i={run:a,use:o};return i;function a(...s){let c=-1;const u=s.pop();if(typeof u!="function")throw new TypeError("Expected function as last argument, not "+u);d(null,...s);function d(p,...f){const y=t[++c];let g=-1;if(p){u(p);return}for(;++g<s.length;)(f[g]===null||f[g]===void 0)&&(f[g]=s[g]);s=f,y?B3(y,d)(...f):u(null,...f)}}function o(s){if(typeof s!="function")throw new TypeError("Expected `middelware` to be a function, not "+s);return t.push(s),i}}function B3(t,i){let a;return o;function o(...u){const d=t.length>u.length;let p;d&&u.push(s);try{p=t.apply(this,u)}catch(f){const y=f;if(d&&a)throw y;return s(y)}d||(p&&p.then&&typeof p.then=="function"?p.then(c,s):p instanceof Error?s(p):c(p))}function s(u,...d){a||(a=!0,i(u,...d))}function c(u){s(null,u)}}const gi={basename:q3,dirname:P3,extname:U3,join:F3,sep:"/"};function q3(t,i){if(i!==void 0&&typeof i!="string")throw new TypeError('"ext" argument must be a string');_l(t);let a=0,o=-1,s=t.length,c;if(i===void 0||i.length===0||i.length>t.length){for(;s--;)if(t.codePointAt(s)===47){if(c){a=s+1;break}}else o<0&&(c=!0,o=s+1);return o<0?"":t.slice(a,o)}if(i===t)return"";let u=-1,d=i.length-1;for(;s--;)if(t.codePointAt(s)===47){if(c){a=s+1;break}}else u<0&&(c=!0,u=s+1),d>-1&&(t.codePointAt(s)===i.codePointAt(d--)?d<0&&(o=s):(d=-1,o=u));return a===o?o=u:o<0&&(o=t.length),t.slice(a,o)}function P3(t){if(_l(t),t.length===0)return".";let i=-1,a=t.length,o;for(;--a;)if(t.codePointAt(a)===47){if(o){i=a;break}}else o||(o=!0);return i<0?t.codePointAt(0)===47?"/":".":i===1&&t.codePointAt(0)===47?"//":t.slice(0,i)}function U3(t){_l(t);let i=t.length,a=-1,o=0,s=-1,c=0,u;for(;i--;){const d=t.codePointAt(i);if(d===47){if(u){o=i+1;break}continue}a<0&&(u=!0,a=i+1),d===46?s<0?s=i:c!==1&&(c=1):s>-1&&(c=-1)}return s<0||a<0||c===0||c===1&&s===a-1&&s===o+1?"":t.slice(s,a)}function F3(...t){let i=-1,a;for(;++i<t.length;)_l(t[i]),t[i]&&(a=a===void 0?t[i]:a+"/"+t[i]);return a===void 0?".":V3(a)}function V3(t){_l(t);const i=t.codePointAt(0)===47;let a=$3(t,!i);return a.length===0&&!i&&(a="."),a.length>0&&t.codePointAt(t.length-1)===47&&(a+="/"),i?"/"+a:a}function $3(t,i){let a="",o=0,s=-1,c=0,u=-1,d,p;for(;++u<=t.length;){if(u<t.length)d=t.codePointAt(u);else{if(d===47)break;d=47}if(d===47){if(!(s===u-1||c===1))if(s!==u-1&&c===2){if(a.length<2||o!==2||a.codePointAt(a.length-1)!==46||a.codePointAt(a.length-2)!==46){if(a.length>2){if(p=a.lastIndexOf("/"),p!==a.length-1){p<0?(a="",o=0):(a=a.slice(0,p),o=a.length-1-a.lastIndexOf("/")),s=u,c=0;continue}}else if(a.length>0){a="",o=0,s=u,c=0;continue}}i&&(a=a.length>0?a+"/..":"..",o=2)}else a.length>0?a+="/"+t.slice(s+1,u):a=t.slice(s+1,u),o=u-s-1;s=u,c=0}else d===46&&c>-1?c++:c=-1}return a}function _l(t){if(typeof t!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(t))}const G3={cwd:Y3};function Y3(){return"/"}function fm(t){return!!(t!==null&&typeof t=="object"&&"href"in t&&t.href&&"protocol"in t&&t.protocol&&t.auth===void 0)}function J3(t){if(typeof t=="string")t=new URL(t);else if(!fm(t)){const i=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+t+"`");throw i.code="ERR_INVALID_ARG_TYPE",i}if(t.protocol!=="file:"){const i=new TypeError("The URL must be of scheme file");throw i.code="ERR_INVALID_URL_SCHEME",i}return X3(t)}function X3(t){if(t.hostname!==""){const o=new TypeError('File URL host must be "localhost" or empty on darwin');throw o.code="ERR_INVALID_FILE_URL_HOST",o}const i=t.pathname;let a=-1;for(;++a<i.length;)if(i.codePointAt(a)===37&&i.codePointAt(a+1)===50){const o=i.codePointAt(a+2);if(o===70||o===102){const s=new TypeError("File URL path must not include encoded / characters");throw s.code="ERR_INVALID_FILE_URL_PATH",s}}return decodeURIComponent(i)}const Df=["history","path","basename","stem","extname","dirname"];class U1{constructor(i){let a;i?fm(i)?a={path:i}:typeof i=="string"||Z3(i)?a={value:i}:a=i:a={},this.cwd="cwd"in a?"":G3.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let o=-1;for(;++o<Df.length;){const c=Df[o];c in a&&a[c]!==void 0&&a[c]!==null&&(this[c]=c==="history"?[...a[c]]:a[c])}let s;for(s in a)Df.includes(s)||(this[s]=a[s])}get basename(){return typeof this.path=="string"?gi.basename(this.path):void 0}set basename(i){Of(i,"basename"),jf(i,"basename"),this.path=gi.join(this.dirname||"",i)}get dirname(){return typeof this.path=="string"?gi.dirname(this.path):void 0}set dirname(i){Aw(this.basename,"dirname"),this.path=gi.join(i||"",this.basename)}get extname(){return typeof this.path=="string"?gi.extname(this.path):void 0}set extname(i){if(jf(i,"extname"),Aw(this.dirname,"extname"),i){if(i.codePointAt(0)!==46)throw new Error("`extname` must start with `.`");if(i.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=gi.join(this.dirname,this.stem+(i||""))}get path(){return this.history[this.history.length-1]}set path(i){fm(i)&&(i=J3(i)),Of(i,"path"),this.path!==i&&this.history.push(i)}get stem(){return typeof this.path=="string"?gi.basename(this.path,this.extname):void 0}set stem(i){Of(i,"stem"),jf(i,"stem"),this.path=gi.join(this.dirname||"",i+(this.extname||""))}fail(i,a,o){const s=this.message(i,a,o);throw s.fatal=!0,s}info(i,a,o){const s=this.message(i,a,o);return s.fatal=void 0,s}message(i,a,o){const s=new ut(i,a,o);return this.path&&(s.name=this.path+":"+s.name,s.file=this.path),s.fatal=!1,this.messages.push(s),s}toString(i){return this.value===void 0?"":typeof this.value=="string"?this.value:new TextDecoder(i||void 0).decode(this.value)}}function jf(t,i){if(t&&t.includes(gi.sep))throw new Error("`"+i+"` cannot be a path: did not expect `"+gi.sep+"`")}function Of(t,i){if(!t)throw new Error("`"+i+"` cannot be empty")}function Aw(t,i){if(!t)throw new Error("Setting `"+i+"` requires `path` to be set too")}function Z3(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}const K3=(function(t){const o=this.constructor.prototype,s=o[t],c=function(){return s.apply(c,arguments)};return Object.setPrototypeOf(c,o),c}),Q3={}.hasOwnProperty;class op extends K3{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=H3()}copy(){const i=new op;let a=-1;for(;++a<this.attachers.length;){const o=this.attachers[a];i.use(...o)}return i.data(Nf(!0,{},this.namespace)),i}data(i,a){return typeof i=="string"?arguments.length===2?(_f("data",this.frozen),this.namespace[i]=a,this):Q3.call(this.namespace,i)&&this.namespace[i]||void 0:i?(_f("data",this.frozen),this.namespace=i,this):this.namespace}freeze(){if(this.frozen)return this;const i=this;for(;++this.freezeIndex<this.attachers.length;){const[a,...o]=this.attachers[this.freezeIndex];if(o[0]===!1)continue;o[0]===!0&&(o[0]=void 0);const s=a.call(i,...o);typeof s=="function"&&this.transformers.use(s)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(i){this.freeze();const a=vu(i),o=this.parser||this.Parser;return Lf("parse",o),o(String(a),a)}process(i,a){const o=this;return this.freeze(),Lf("process",this.parser||this.Parser),zf("process",this.compiler||this.Compiler),a?s(void 0,a):new Promise(s);function s(c,u){const d=vu(i),p=o.parse(d);o.run(p,d,function(y,g,x){if(y||!g||!x)return f(y);const v=g,w=o.stringify(v,x);tz(w)?x.value=w:x.result=w,f(y,x)});function f(y,g){y||!g?u(y):c?c(g):a(void 0,g)}}}processSync(i){let a=!1,o;return this.freeze(),Lf("processSync",this.parser||this.Parser),zf("processSync",this.compiler||this.Compiler),this.process(i,s),Cw("processSync","process",a),o;function s(c,u){a=!0,kw(c),o=u}}run(i,a,o){Ew(i),this.freeze();const s=this.transformers;return!o&&typeof a=="function"&&(o=a,a=void 0),o?c(void 0,o):new Promise(c);function c(u,d){const p=vu(a);s.run(i,p,f);function f(y,g,x){const v=g||i;y?d(y):u?u(v):o(void 0,v,x)}}}runSync(i,a){let o=!1,s;return this.run(i,a,c),Cw("runSync","run",o),s;function c(u,d){kw(u),s=d,o=!0}}stringify(i,a){this.freeze();const o=vu(a),s=this.compiler||this.Compiler;return zf("stringify",s),Ew(i),s(i,o)}use(i,...a){const o=this.attachers,s=this.namespace;if(_f("use",this.frozen),i!=null)if(typeof i=="function")p(i,a);else if(typeof i=="object")Array.isArray(i)?d(i):u(i);else throw new TypeError("Expected usable value, not `"+i+"`");return this;function c(f){if(typeof f=="function")p(f,[]);else if(typeof f=="object")if(Array.isArray(f)){const[y,...g]=f;p(y,g)}else u(f);else throw new TypeError("Expected usable value, not `"+f+"`")}function u(f){if(!("plugins"in f)&&!("settings"in f))throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");d(f.plugins),f.settings&&(s.settings=Nf(!0,s.settings,f.settings))}function d(f){let y=-1;if(f!=null)if(Array.isArray(f))for(;++y<f.length;){const g=f[y];c(g)}else throw new TypeError("Expected a list of plugins, not `"+f+"`")}function p(f,y){let g=-1,x=-1;for(;++g<o.length;)if(o[g][0]===f){x=g;break}if(x===-1)o.push([f,...y]);else if(y.length>0){let[v,...w]=y;const A=o[x][1];hm(A)&&hm(v)&&(v=Nf(!0,A,v)),o[x]=[f,v,...w]}}}}const W3=new op().freeze();function Lf(t,i){if(typeof i!="function")throw new TypeError("Cannot `"+t+"` without `parser`")}function zf(t,i){if(typeof i!="function")throw new TypeError("Cannot `"+t+"` without `compiler`")}function _f(t,i){if(i)throw new Error("Cannot call `"+t+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function Ew(t){if(!hm(t)||typeof t.type!="string")throw new TypeError("Expected node, got `"+t+"`")}function Cw(t,i,a){if(!a)throw new Error("`"+t+"` finished async. Use `"+i+"` instead")}function vu(t){return ez(t)?t:new U1(t)}function ez(t){return!!(t&&typeof t=="object"&&"message"in t&&"messages"in t)}function tz(t){return typeof t=="string"||nz(t)}function nz(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}const iz="https://github.com/remarkjs/react-markdown/blob/main/changelog.md",Rw=[],Mw={allowDangerousHtml:!0},az=/^(https?|ircs?|mailto|xmpp)$/i,rz=[{from:"astPlugins",id:"remove-buggy-html-in-markdown-parser"},{from:"allowDangerousHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"allowNode",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowElement"},{from:"allowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowedElements"},{from:"className",id:"remove-classname"},{from:"disallowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"disallowedElements"},{from:"escapeHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"includeElementIndex",id:"#remove-includeelementindex"},{from:"includeNodeIndex",id:"change-includenodeindex-to-includeelementindex"},{from:"linkTarget",id:"remove-linktarget"},{from:"plugins",id:"change-plugins-to-remarkplugins",to:"remarkPlugins"},{from:"rawSourcePos",id:"#remove-rawsourcepos"},{from:"renderers",id:"change-renderers-to-components",to:"components"},{from:"source",id:"change-source-to-children",to:"children"},{from:"sourcePos",id:"#remove-sourcepos"},{from:"transformImageUri",id:"#add-urltransform",to:"urlTransform"},{from:"transformLinkUri",id:"#add-urltransform",to:"urlTransform"}];function F1(t){const i=oz(t),a=lz(t);return sz(i.runSync(i.parse(a),a),t)}function oz(t){const i=t.rehypePlugins||Rw,a=t.remarkPlugins||Rw,o=t.remarkRehypeOptions?{...t.remarkRehypeOptions,...Mw}:Mw;return W3().use(YL).use(a).use(z3,o).use(i)}function lz(t){const i=t.children||"",a=new U1;return typeof i=="string"&&(a.value=i),a}function sz(t,i){const a=i.allowedElements,o=i.allowElement,s=i.components,c=i.disallowedElements,u=i.skipHtml,d=i.unwrapDisallowed,p=i.urlTransform||uz;for(const y of rz)Object.hasOwn(i,y.from)&&(""+y.from+(y.to?"use `"+y.to+"` instead":"remove it")+iz+y.id,void 0);return Mm(t,f),DL(t,{Fragment:b.Fragment,components:s,ignoreInvalidStyle:!0,jsx:b.jsx,jsxs:b.jsxs,passKeys:!0,passNode:!0});function f(y,g,x){if(y.type==="raw"&&x&&typeof g=="number")return u?x.children.splice(g,1):x.children[g]={type:"text",value:y.value},g;if(y.type==="element"){let v;for(v in Rf)if(Object.hasOwn(Rf,v)&&Object.hasOwn(y.properties,v)){const w=y.properties[v],A=Rf[v];(A===null||A.includes(y.tagName))&&(y.properties[v]=p(String(w||""),v,y))}}if(y.type==="element"){let v=a?!a.includes(y.tagName):c?c.includes(y.tagName):!1;if(!v&&o&&typeof g=="number"&&(v=!o(y,g,x)),v&&x&&typeof g=="number")return d&&y.children?x.children.splice(g,1,...y.children):x.children.splice(g,1),g}}}function uz(t){const i=t.indexOf(":"),a=t.indexOf("?"),o=t.indexOf("#"),s=t.indexOf("/");return i===-1||s!==-1&&i>s||a!==-1&&i>a||o!==-1&&i>o||az.test(t.slice(0,i))?t:""}const cz={};function V1(t){const i=this,a=t||cz,o=i.data(),s=o.micromarkExtensions||(o.micromarkExtensions=[]),c=o.fromMarkdownExtensions||(o.fromMarkdownExtensions=[]),u=o.toMarkdownExtensions||(o.toMarkdownExtensions=[]);s.push(c0(a)),c.push(k0()),u.push(y2(a))}function $1(t){return Array.from({length:t},(i,a)=>`## Section ${a+1}

A paragraph with **strong**, *emphasis*, [a link](https://example.com) and \`code\`. ${"Long documents should stay readable and interactive. ".repeat(5)}

- Item one
- Item two

| Name | Value |
| --- | ---: |
| Alpha | ${a} |
`).join(`
`)}const dz=[jm()];function hz(){const t=L.useRef(null);return L.useEffect(()=>{window.limrBenchmark=async({renderer:i,sections:a,stream:o=!1})=>{const s=om.createRoot(t.current),c=$1(a),u=[],d=(f,y)=>{const g=performance.now();oo.flushSync(()=>s.render(i==="limr"?b.jsx(ni,{source:f,streaming:y,extensions:dz,documentId:"benchmark"}):b.jsx("article",{className:"limr-prose",children:b.jsx(F1,{remarkPlugins:[V1],children:f})}))),t.current.getBoundingClientRect(),u.push(performance.now()-g)};if(o){d("",!0);for(let f=256;f<c.length+256;f+=256)d(c.slice(0,f),f<c.length),await new Promise(requestAnimationFrame)}else d(c,!1);const p={characters:c.length,updates:u.length,totalMs:u.reduce((f,y)=>f+y,0),p95Ms:u.sort((f,y)=>f-y)[Math.floor(u.length*.95)],maxMs:Math.max(...u),elements:t.current.querySelectorAll("*").length};return await new Promise(requestAnimationFrame),oo.flushSync(()=>s.unmount()),await new Promise(requestAnimationFrame),p}},[]),b.jsx("div",{className:"demo-page",style:{maxWidth:900,margin:"auto"},ref:t})}function fz(){const t=Dl(i=>({revision:i.revision,headings:i.headings.length}));return b.jsxs("output",{id:"snapshot-readout",children:[t.revision,":",t.headings]})}function mz(){const[t,i]=L.useState(`# Hydrated

A **stable** document with $x^2$.`);return b.jsxs("div",{className:"demo-page",children:[b.jsxs(Nl,{source:t,children:[b.jsx(rc,{}),b.jsx(ni,{}),b.jsx(fz,{})]}),b.jsx(ni,{source:`# Another document

Separate ID.`}),b.jsx("button",{onClick:()=>i(a=>a+`

## Appended

New text.`),children:"Append"})]})}function pz(t,i,a){L.useEffect(()=>{if(!t||!i)return;const o=[0];for(let T=0;T<a.length;T++)a[T]===`
`&&o.push(T+1);const s=T=>{let S=0,E=o.length;for(;S<E;){const C=S+E>>>1;o[C]<=T?S=C+1:E=C}return Math.max(0,S-1)};let c=[],u=null,d=0,p=0;const f=()=>{const T=i.getBoundingClientRect().top,S=parseFloat(getComputedStyle(t).lineHeight),E={source:t.scrollHeight-t.clientHeight,rendered:i.scrollHeight-i.clientHeight};c=[{source:0,rendered:0}];for(const C of i.querySelectorAll(".limr-reader-content > .limr-prose > [data-limr-block]")){const R={source:s(Number(C.dataset.sourceStart))*S,rendered:C.getBoundingClientRect().top-T+i.scrollTop},_=c.at(-1);R.source>_.source&&R.rendered>_.rendered&&R.source<E.source&&R.rendered<E.rendered&&c.push(R)}c.push(E)},y=(T,S,E)=>{const C=c;let R=0,_=C.length;for(;R<_;){const z=R+_>>>1;C[z][S]<=T?R=z+1:_=z}const N=C[Math.max(0,R-1)],j=C[Math.min(C.length-1,R)];return N[E]+(j[E]-N[E])*Math.min(1,Math.max(0,(T-N[S])/Math.max(1,j[S]-N[S])))},g=T=>{T.target===u&&performance.now()<d||(cancelAnimationFrame(p),p=requestAnimationFrame(()=>{const S=T.target===t,E=S?i:t;u=E,d=performance.now()+100,E.scrollTop=y(S?t.scrollTop:i.scrollTop,S?"source":"rendered",S?"rendered":"source")}))},x=()=>{u=null,d=0},v=new ResizeObserver(f);v.observe(i),v.observe(t);const w=i.querySelector(".limr-prose");w&&v.observe(w);const A=new MutationObserver(f);return w&&A.observe(w,{childList:!0}),t.addEventListener("scroll",g,{passive:!0}),i.addEventListener("scroll",g,{passive:!0}),t.addEventListener("wheel",x,{passive:!0}),i.addEventListener("wheel",x,{passive:!0}),t.addEventListener("pointerdown",x),i.addEventListener("pointerdown",x),document.fonts.addEventListener("loadingdone",f),f(),()=>{cancelAnimationFrame(p),v.disconnect(),A.disconnect(),t.removeEventListener("scroll",g),i.removeEventListener("scroll",g),t.removeEventListener("wheel",x),i.removeEventListener("wheel",x),t.removeEventListener("pointerdown",x),i.removeEventListener("pointerdown",x),document.fonts.removeEventListener("loadingdone",f)}},[t,i,a])}const Gu=["# Selection and motion",'Left<ref id="between" /> right with `inline code` and $x^2$ end.<ref id="last" />',"```typescript\nconst total = 12;\nconst 你好 = total + 1;\n// next line: α Я é \n```",`$$
\\int_0^1 x^2\\,dx = \\frac13
$$`,`<definition title="In a special block">

Inside **rich text** with \`code here\`<ref id="inside" /> after $x+1$ and more text.

Second paragraph.

</definition>`,`> A note with **rich content**.
>
> A second paragraph.`,`<question answer="[0]">
<question-content>Choose a component.</question-content>
<question-sel>Markdown</question-sel>
<question-sel>TableOfContents</question-sel>
<question-hint>A useful hint.</question-hint>
<question-answer>A complete answer.</question-answer>
</question>`,'<extras><extra title="More to read" url="https://example.com" desc="An extended description with balanced spacing." /></extras>','<citation id="between" title="Middle citation" description="First paragraph.&#10;&#10;Second paragraph with **detail**.&#10;&#10;Third paragraph." />','<citation id="last" title="Trailing citation" />','<citation id="inside" title="Nested citation" />'].join(`

`),gz=[{id:"code-note",type:"citation",range:{start:Gu.indexOf("total ="),end:Gu.indexOf("total =")+5},data:{title:"Code annotation",description:"A card inserted into code."}}],yz=[y1()];function bz(){const[t,i]=L.useState(gz),[a,o]=L.useState(null),[s,c]=L.useState(!1);return b.jsxs("div",{className:"demo-page",children:[b.jsx("div",{className:"demo-controls",children:b.jsx("button",{onClick:()=>c(!s),children:"Theme"})}),b.jsx(sn,{source:Gu,documentId:"visual",theme:s?"dark":"light",locale:Vn,annotations:t,onAnnotationsChange:i,actions:yz,onSelectionChange:o}),b.jsx("output",{id:"selection-data",hidden:!0,children:a?JSON.stringify(a):""}),b.jsx("output",{id:"source-data",hidden:!0,children:Gu})]})}const If=b.jsx("svg",{width:"256",height:"256",style:{width:256,height:256},viewBox:"0 0 16 16",children:b.jsx("path",{d:"M8 1 15 8 8 15 1 8Z",fill:"currentColor"})}),G1=[{type:"large-svg",label:"Large SVG",icon:If},{type:"nested-icon",label:"Nested icon",icon:b.jsx("div",{style:{width:200,height:200,fontSize:100},children:If})},{type:"large-image",label:"Large image",icon:b.jsx("img",{width:"200",height:"200",alt:"",src:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>')})},{type:"custom-marker",label:"Custom marker",Marker:()=>b.jsx("div",{style:{width:160,height:160},children:If})},{type:"text-icon",label:"Text icon",icon:"✦"}],vz=`Reference<ref id="reference" /> **Bold plugin text**.

<citation id="reference" title="Reference" />`,xz=G1.map((t,i)=>({id:`plugin-${i}`,type:t.type,range:{start:32,end:38}}));function wz(){return b.jsx("div",{className:"demo-page",children:b.jsx(sn,{source:vz,annotations:xz,annotationTypes:G1,toc:!1,sidebar:!1})})}const Sz=[{type:"detail",label:"Detail",icon:"✦",overlay:{expand:t=>({placement:t.data?.placement??"anchor",height:t.data?.height})},Content:({data:t,expanded:i})=>b.jsxs("div",{children:[b.jsx("p",{children:"Preview content"}),i&&b.jsxs(b.Fragment,{children:[b.jsx("p",{children:t?.text}),b.jsxs("label",{children:["Message ",b.jsx("input",{"aria-label":"Card draft",defaultValue:"Draft stays mounted"})]})]})]})},{type:"click-detail",label:"Click detail",sidebar:{collapseOnContentClick:!0},Content:()=>b.jsx("p",{children:"Click to collapse this module."})},{type:"custom-card",label:"Custom card",overlay:{previewWidth:286,expand:{placement:"center",width:512},Card:({expanded:t,expand:i,collapse:a,close:o,children:s})=>b.jsxs(b.Fragment,{children:[b.jsxs("header",{"data-testid":"module-card-header",style:{padding:16},children:[b.jsx("strong",{children:t?"Expanded by module":"Preview by module"}),b.jsx("button",{onClick:t?a:i,children:t?"Less detail":"More detail"})]}),b.jsx("section",{"data-limr-card-body":"",style:{padding:16},children:s}),b.jsx("footer",{children:b.jsx("button",{onClick:o,children:"Dismiss module"})})]})},Content:()=>b.jsxs("label",{children:["Module draft ",b.jsx("input",{"aria-label":"Module draft",defaultValue:"Keep my state"})]})}],kz=[{id:"center",type:"detail",range:{start:0,end:6},data:{placement:"center",height:"80dvh",text:"A conversation with a large centered surface."}},{id:"anchor",type:"detail",range:{start:8,end:14},data:{placement:"anchor",text:"More detail. The card only grows to fit these extra lines, keeping its anchored edge fixed."}},{id:"click-detail",type:"click-detail",range:{start:16,end:21}},{id:"custom-card",type:"custom-card",range:{start:23,end:29}}];function Tz(){return b.jsx("div",{className:"demo-page",children:b.jsx(sn,{source:`Center. Anchor. Plain. Custom.

Reference<ref id="ref" />

<citation id="ref" title="A citation without expansion" description="Clickable sidebar content." url="https://example.com" />`,annotations:kz,annotationTypes:Sz,locale:Vn,toc:!1})})}const Az='<md-video provider="youtube" url="https://www.youtube.com/watch?v=M7lc1UVf-VE" title="YouTube video" />';function Ez(){const t=[Az,...Array.from({length:40},(i,a)=>`Paragraph ${a}. Space before the next player.`),'<video url="https://www.bilibili.com/video/BV1xx411c7mD?p=2" />','<video url="https://youtu.be/M7lc1UVf-VE" loading="click" />'].join(`

`);return b.jsx("div",{className:"demo-page",children:b.jsx(sn,{source:t,toc:!1,sidebar:!1,locale:Vn})})}const Cz=[jm(),A0()];function Rz(){const t=new URLSearchParams(location.search),i=Math.min(5e3,Math.max(1,Number(t.get("sections")??1e3))),a=t.get("kind")==="code",o=L.useMemo(()=>a?`# Code selection

\`\`\`typescript
${Array.from({length:i},(c,u)=>`const value${u} = calculate(${u}, "Text 中文");`).join(`
`)}
\`\`\``:$1(i),[a,i]);window.selectionProbe??={updates:0,dragging:0,last:null};const s=c=>{window.selectionProbe.updates++,c&&!c.settled&&window.selectionProbe.dragging++,window.selectionProbe.last=c};return b.jsx("main",{style:{maxWidth:780,margin:"40px auto",padding:24},children:t.get("renderer")==="react-markdown"?b.jsx("article",{className:"limr-prose",children:b.jsx(F1,{remarkPlugins:[V1],children:o})}):b.jsx(ni,{source:o,extensions:Cz,onSelectionChange:s,documentId:"selection-benchmark"})})}const Yu="# Tools, close to the words\n\nAlpha **bravo** charlie, with &amp; entities and `literal code`.\n\nA second paragraph keeps the selection and the page independent.\n\n```ts\nconst value = 42;\n```",Nw=Yu.indexOf("bravo"),Mz=[{id:"lower",range:{start:Yu.indexOf("Alpha"),end:Yu.indexOf("charlie")+7},type:"highlight",data:{color:"#F2C744",style:"background"}},{id:"upper",range:{start:Nw,end:Nw+5},type:"highlight",data:{color:"#E57373",style:"wavy"}}];function Nz(){const t=new URLSearchParams(location.search).has("controlled"),[i,a]=L.useState(t?Mz:[]),[o,s]=L.useState(""),[c,u]=L.useState(""),[d,p]=L.useState(0),f=L.useMemo(()=>[{name:"toolbar-example",actions:[{id:"custom",label:"Custom tool",icon:b.jsx("span",{style:{fontSize:300},children:b.jsx("svg",{style:{width:500,height:300},viewBox:"0 0 24 24",children:b.jsx("circle",{cx:"12",cy:"12",r:"7",fill:"currentColor"})})}),onHover:()=>p(y=>y+1),renderExpanded:y=>b.jsxs("div",{children:[b.jsxs("label",{children:["Panel input",b.jsx("input",{value:c,onChange:g=>u(g.target.value)})]}),b.jsx("button",{onClick:()=>{y.run(()=>{throw new Error("Panel action failed")})},children:"Fail action"}),b.jsx("button",{onClick:()=>{y.run(async g=>{await new Promise(x=>setTimeout(x,80)),u(g.selection.text)})},children:"Read selection"}),new URLSearchParams(location.search).has("tall")&&Array.from({length:30},(g,x)=>b.jsxs("p",{children:["Plugin paragraph ",x+1,": a longer explanation that fits the reading tools panel."]},x))]})}]}],[c]);return b.jsxs("div",{className:"demo-page",style:{minHeight:1800},children:[b.jsx(sn,{appearance:new URLSearchParams(location.search).has("skin")?"paper":void 0,source:Yu,locale:Vn,plugins:f,annotations:t?i:void 0,onAnnotationsChange:a,onHighlightHover:y=>s(y?.id??"")}),b.jsx("output",{id:"highlight-data",hidden:!0,children:JSON.stringify(i)}),b.jsx("output",{id:"hovered-highlight",hidden:!0,children:o}),b.jsx("output",{id:"panel-value",hidden:!0,children:c}),b.jsx("output",{id:"hover-count",hidden:!0,children:d})]})}const Y1="limr-playground-document",J1="limr-playground-locale";function Hf(){try{return localStorage.getItem(J1)==="en"?"en":"zh-CN"}catch{return"zh-CN"}}function Dz(){try{const t=JSON.parse(localStorage.getItem(Y1)??"null");if(!t||typeof t.source!="string"||!Array.isArray(t.annotations))return null;if(t.version===2)return t;if(t.version===1&&Array.isArray(t.highlights))return{source:t.source,annotations:[...t.annotations,...t.highlights.map(({id:i,range:a,...o})=>({id:i,range:a,type:"highlight",data:o}))]}}catch{}return null}function jz(){const[t,i]=L.useState(S1),[a,o]=L.useState(!1),[s,c]=L.useState(0),[u,d]=L.useState(!1),[p,f]=L.useState(Hf),[y,g]=L.useState(()=>aw(Hf())),[x,v]=L.useState("standard"),[w,A]=L.useState(),[T,S]=L.useState(!1),[E,C]=L.useState(null),[R,_]=L.useState([]),[N,j]=L.useState(null),[z,B]=L.useState(null),[I,X]=L.useState(!0),[oe,Y]=L.useState(!0),[P,M]=L.useState(null),[V,$]=L.useState(""),[Z,me]=L.useState(""),[q,ze]=L.useState(0),[ge,H]=L.useState("welcome"),U=L.useRef(null),te=L.useRef(null),he=L.useRef(null),ve=L.useRef(null),le=L.useRef(null),be=L.useRef(null),xe=[{value:"knuth-plass",label:"Knuth–Plass"},{value:"standard",label:"标准"},{value:"justify",label:"两端对齐"}],de=[{value:"zh-CN",label:"中文"},{value:"en",label:"English"}],ae=[{value:void 0,label:"随段落"},{value:"origin",label:"原文"},{value:"translation",label:"译文"},{value:"both",label:"对照"}];pz(N,z,t);const ye=L.useMemo(()=>{const ce=w1(),je=p==="zh-CN",$e=Xm({label:je?"询问助手":"Ask assistant",icon:b.jsx(yt,{name:"sparkles"}),color:"#B39DDB",prompt:Ge=>je?`请解释「${Ge.text}」。`:`Explain “${Ge.text}”.`,adapter:{async*answer({selection:Ge,signal:W}){me(je?"回答中":"Answering…");try{for(const re of je?["关于 **",Ge.text,`** 的思考。

`,"先试着用自己的话概括这段内容，",`再找一个生活中的例子与它联系起来。

`,"> 这是一段本地模拟回答，用于体验插件的流式交互。"]:["Thoughts on **",Ge.text,`**.

`,"Try summarizing the passage in your own words, ",`then connect it to an everyday example.

`,"> This is a local simulated response demonstrating streaming plugin interaction."])await new Promise((ue,Re)=>{if(W.aborted){Re(W.reason);return}const Se=()=>{clearTimeout(G),Re(W.reason)},G=setTimeout(()=>{W.removeEventListener("abort",Se),ue()},160);W.addEventListener("abort",Se,{once:!0})}),yield re;me(je?"回答已完成":"Answer complete")}catch(re){throw me(W.aborted?"":je?"回答失败":"Answer failed"),re}}}});return[{...ce,actions:I&&!a?ce.actions:[]},{...$e,actions:oe&&!a?$e.actions:[]}]},[I,oe,a,p]);L.useEffect(()=>{if(!a)return;let ce=0;const je=setInterval(()=>{ce=Math.min(t.length,ce+5),c(ce),ce===t.length&&(o(!1),$("流式演示完成，文本已保留"))},90);return()=>clearInterval(je)},[a,t]),L.useEffect(()=>{const ce=()=>{const je=aw(Hf());g(je),je&&(f(je.language),o(!1)),M(null),C(null)};return ce(),window.addEventListener("hashchange",ce),()=>window.removeEventListener("hashchange",ce)},[]),L.useEffect(()=>{document.documentElement.dataset.theme=u?"dark":"light"},[u]),L.useEffect(()=>{try{localStorage.setItem(J1,p)}catch{}},[p]),L.useEffect(()=>{if(!P)return;const ce=P==="load"?te:P==="plugins"?he:P==="locale"?le:P==="typography"?be:ve,je=Ge=>{Ge.target instanceof Node&&!ce.current?.contains(Ge.target)&&M(null)},$e=Ge=>{Ge.key==="Escape"&&(M(null),ce.current?.querySelector("button")?.focus())};return document.addEventListener("pointerdown",je),document.addEventListener("keydown",$e),()=>{document.removeEventListener("pointerdown",je),document.removeEventListener("keydown",$e)}},[P]);const Ae=(ce,je="")=>{o(!1),c(0),i(ce),H(je),_([]),C(null),me(""),ze($e=>$e+1),M(null)},Ne=()=>{try{localStorage.setItem(Y1,JSON.stringify({version:2,source:t,annotations:R})),$("已保存到此浏览器，可从加载菜单手动打开")}catch{$("保存失败，请下载 Markdown 保留文本")}},De=()=>{const ce=Dz();if(!ce){$("还没有可加载的文本");return}Ae(ce.source),_(ce.annotations),$("已加载保存的文本与标记")},Me=()=>{const ce=URL.createObjectURL(new Blob([t],{type:"text/markdown;charset=utf-8"})),je=document.createElement("a");je.href=ce,je.download="limr-notes.md",je.click(),setTimeout(()=>URL.revokeObjectURL(ce),1e3),$("已下载 Markdown"),M(null)};return b.jsxs(b.Fragment,{children:[b.jsxs("header",{className:"demo-header","data-limr-appearance":"classic",children:[b.jsxs("a",{className:"demo-brand",href:"/LiMR/",children:["LiMR ",b.jsx("span",{children:"Linloir’s limr Is a Markdown Renderer"})]}),b.jsxs("div",{className:"demo-header-end",children:[b.jsxs("nav",{className:"demo-controls demo-mode-nav","aria-label":"页面 / Pages",children:[b.jsx("a",{href:"#/playground","aria-current":y?void 0:"page",children:b.jsx("span",{className:"limr-underline",children:"Playground"})}),b.jsx("a",{href:ro(p,y?.page),"aria-current":y?"page":void 0,children:b.jsx("span",{className:"limr-underline",children:"Docs"})}),b.jsx("a",{href:"https://github.com/Linloir/LiMR",target:"_blank",rel:"noopener noreferrer",children:b.jsx("span",{className:"limr-underline",children:"GitHub"})})]}),b.jsxs("div",{className:"demo-controls demo-header-settings",children:["        ",b.jsxs("div",{className:"demo-dropdown",ref:le,children:[b.jsxs("button",{"aria-label":"界面语言 / Reader language",title:"切换阅读器内置文案 / Reader UI language","aria-expanded":P==="locale","aria-controls":"demo-locale-menu",onClick:()=>M(ce=>ce==="locale"?null:"locale"),children:[b.jsx("span",{className:"limr-underline",children:de.find(ce=>ce.value===p).label}),b.jsx(yt,{name:"chevron"})]}),b.jsx(pl,{open:P==="locale",id:"demo-locale-menu",role:"group","aria-label":"界面语言 / Reader language",children:de.map(ce=>b.jsx("button",{lang:ce.value,"aria-pressed":p===ce.value,onClick:()=>{f(ce.value),y&&(location.hash=ro(ce.value,y.page)),M(null),le.current?.querySelector("button")?.focus()},children:b.jsx("span",{className:"limr-underline",children:ce.label})},ce.value))})]}),b.jsxs("button",{className:"demo-theme",onClick:()=>d(!u),"aria-label":u?"浅色":"深色",title:u?"切换到浅色":"切换到深色",children:[b.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:u?b.jsxs(b.Fragment,{children:[b.jsx("circle",{cx:"12",cy:"12",r:"4"}),b.jsx("path",{d:"M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"})]}):b.jsx("path",{d:"M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"})}),b.jsx("span",{className:"limr-underline",children:u?"浅色":"深色"})]})]})]})]}),y?b.jsx(CO,{route:y,theme:u?"dark":"light"}):b.jsxs(b.Fragment,{children:[b.jsxs("div",{className:"demo-commandbar","data-limr-appearance":"classic",children:[b.jsxs("nav",{className:"demo-controls demo-document-controls","aria-label":"文本操作",children:[b.jsx("button",{onClick:()=>{o(!1),S(!T),M(null),T&&Ne()},children:b.jsx("span",{className:"limr-underline",children:T?"保存":"编辑"})}),b.jsx("span",{className:"demo-control-divider"}),b.jsxs("div",{className:"demo-dropdown",ref:te,children:[b.jsxs("button",{"aria-expanded":P==="load","aria-controls":"demo-load-menu",onClick:()=>M(ce=>ce==="load"?null:"load"),children:[b.jsx("span",{className:"limr-underline",children:"加载"}),b.jsx(yt,{name:"chevron"})]}),b.jsxs(pl,{open:P==="load",id:"demo-load-menu",className:"demo-load-menu",children:[b.jsxs("div",{role:"group","aria-label":"文本文件",children:[b.jsxs("button",{onClick:De,children:[b.jsx("span",{className:"limr-underline",children:"加载已保存文本"}),b.jsx("small",{children:"此浏览器中的文本与标记"})]}),b.jsxs("button",{onClick:()=>{U.current?.click(),M(null)},children:[b.jsx("span",{className:"limr-underline",children:"打开 Markdown 文件"}),b.jsx("small",{children:"从本地 .md 或 .txt 文件载入"})]}),b.jsxs("button",{onClick:Me,children:[b.jsx("span",{className:"limr-underline",children:"下载 Markdown"}),b.jsx("small",{children:"导出当前的完整文本"})]})]}),b.jsxs("div",{role:"group","aria-label":"预设文本",className:"demo-dropdown-section",children:[b.jsx("p",{className:"demo-small-label",children:"预设文本"}),GO.map(ce=>b.jsxs("button",{"aria-pressed":ge===ce.id,onClick:()=>{Ae(ce.source,ce.id),$(`已加载「${ce.label}」`)},children:[b.jsx("span",{className:"limr-underline",children:ce.label}),b.jsx("small",{children:ce.description})]},ce.id))]})]})]}),b.jsxs("div",{className:"demo-dropdown",ref:he,children:[b.jsxs("button",{"aria-expanded":P==="plugins","aria-controls":"demo-plugin-menu",onClick:()=>M(ce=>ce==="plugins"?null:"plugins"),children:[b.jsx("span",{className:"limr-underline",children:"插件"}),b.jsx(yt,{name:"chevron"})]}),b.jsxs(pl,{open:P==="plugins",id:"demo-plugin-menu",role:"group","aria-label":"插件",children:[b.jsxs("label",{className:"demo-plugin-option",children:[b.jsx("input",{type:"checkbox",checked:I,onChange:ce=>X(ce.target.checked),"aria-label":"启用旁注与笔记"}),b.jsxs("span",{children:[b.jsx("strong",{className:"limr-underline",children:"旁注与笔记"}),b.jsx("small",{children:"旁注、笔记、提问与脚注"})]})]}),b.jsxs("label",{className:"demo-plugin-option",children:[b.jsx("input",{type:"checkbox",checked:oe,onChange:ce=>Y(ce.target.checked),"aria-label":"启用 AI 问答"}),b.jsxs("span",{children:[b.jsx("strong",{className:"limr-underline",children:"AI 问答"}),b.jsx("small",{children:"本地模拟回答，无需配置服务"})]})]})]})]}),b.jsx("input",{hidden:!0,ref:U,type:"file",accept:".md,.markdown,.txt,text/plain,text/markdown","aria-label":"打开 Markdown 文件",onChange:async ce=>{const je=ce.currentTarget.files?.[0];if(ce.currentTarget.value="",!!je)try{Ae(await je.text()),$(`已加载 ${je.name}`)}catch{$("文件读取失败")}}})]}),b.jsxs("div",{className:"demo-controls demo-session-controls",children:[b.jsxs("div",{className:"demo-dropdown demo-translation-control",ref:ve,children:[b.jsxs("button",{"aria-label":"全局翻译展示模式","aria-expanded":P==="translation","aria-controls":"demo-translation-menu",onClick:()=>M(ce=>ce==="translation"?null:"translation"),children:[b.jsx("span",{className:"limr-underline",children:ae.find(ce=>ce.value===w).label}),b.jsx(yt,{name:"chevron"})]}),b.jsx(pl,{open:P==="translation",id:"demo-translation-menu",role:"group","aria-label":"全局翻译展示模式",children:ae.map(ce=>b.jsx("button",{"aria-pressed":w===ce.value,onClick:()=>{A(ce.value),M(null),ve.current?.querySelector("button")?.focus()},children:b.jsx("span",{className:"limr-underline",children:ce.label})},ce.value??"local"))})]}),b.jsxs("div",{className:"demo-dropdown demo-typography-control",ref:be,children:[b.jsxs("button",{"aria-label":"排版模式","aria-expanded":P==="typography","aria-controls":"demo-typography-menu",onClick:()=>M(ce=>ce==="typography"?null:"typography"),children:[b.jsx("span",{className:"limr-underline",children:xe.find(ce=>ce.value===x).label}),b.jsx(yt,{name:"chevron"})]}),b.jsx(pl,{open:P==="typography",id:"demo-typography-menu",role:"group","aria-label":"排版模式",children:xe.map(ce=>b.jsx("button",{"aria-pressed":x===ce.value,onClick:()=>{v(ce.value),M(null),be.current?.querySelector("button")?.focus()},children:b.jsx("span",{className:"limr-underline",children:ce.label})},ce.value))})]}),b.jsx("button",{className:"demo-stream-button",disabled:!t.length,"aria-pressed":a,onClick:()=>{a?(o(!1),$("已结束演示，完整文本已恢复")):(c(0),o(!0),S(!1),$(""),C(null),ze(ce=>ce+1))},children:b.jsx("span",{className:"limr-underline",children:a?"结束演示":"流式演示"})})]})]}),b.jsxs("div",{className:"demo-context-line",children:[b.jsx("span",{children:T?"在左侧写作，在右侧看见变化。":a?"正在播放当前文本，随时可以结束。":"选中文字，给想法一点颜色。悬浮色块调整样式，点击工具留下批注。"}),b.jsx("output",{"aria-live":"polite",children:V||Z||`${t.length.toLocaleString()} 字符 · ${R.filter(ce=>ce.type==="highlight").length} 处高亮 · ${R.filter(ce=>ce.type!=="highlight").length} 条注释`})]}),a&&b.jsx("div",{className:"demo-stream-progress",role:"progressbar","aria-label":"流式演示进度","aria-valuemin":0,"aria-valuemax":t.length,"aria-valuenow":s,children:b.jsx("span",{style:{width:`${s/Math.max(1,t.length)*100}%`}})}),b.jsxs("div",{className:T?"demo-workbench":"demo-reading",children:[T&&b.jsxs("section",{className:"demo-editor-pane",children:[b.jsxs("div",{className:"demo-pane-label",children:["Markdown ",b.jsx("span",{children:"直接编辑 · 双向滚动同步"})]}),b.jsx("textarea",{ref:j,wrap:"off",spellCheck:!1,className:"demo-editor","aria-label":"Markdown source",value:t,onChange:ce=>{o(!1),i(ce.target.value),H(""),_([]),$("")}})]}),b.jsxs("section",{className:T?"demo-preview-pane":void 0,children:[T&&b.jsxs("div",{className:"demo-pane-label",children:["实时预览 ",b.jsx("span",{children:"选区工具同样可用"})]}),b.jsx("div",{ref:T?B:void 0,className:T?"demo-preview-scroll":void 0,children:b.jsx("div",{className:"demo-page",children:b.jsx(sn,{source:a?t.slice(0,s):t,streaming:a,theme:u?"dark":"light",typography:x,parameters:{translationMode:w,onTranslationModeChange:A},locale:p==="zh-CN"?Vn:Cu,scrollRoot:T?z:null,toc:!T,sidebar:!T,actions:a?[]:void 0,plugins:ye,annotations:R,onAnnotationsChange:_,onSelectionChange:C,documentId:"demo"},q)})})]})]}),b.jsx("output",{id:"selection-data",hidden:!0,children:E?JSON.stringify(E):""})]}),b.jsx("footer",{className:"demo-footer",children:"LiMR · A quiet place for words."})]})}const Kt=new URLSearchParams(location.search).get("fixture");Kt==="hydrate"?om.hydrateRoot(document.getElementById("root"),b.jsx(mz,{}),{onRecoverableError:t=>{document.documentElement.dataset.hydrationError=String(t)}}):om.createRoot(document.getElementById("root")).render(Kt==="streaming"?b.jsx($j,{}):Kt==="media-annotations"?b.jsx(zO,{}):Kt==="translation-details"?b.jsx(OO,{}):Kt==="media"?b.jsx(jO,{}):Kt==="toolbar"?b.jsx(Nz,{}):Kt==="assistant-test"?b.jsx(JO,{}):Kt==="sidebar"?b.jsx(QO,{}):Kt==="selection-bench"?b.jsx(Rz,{}):Kt==="video"?b.jsx(Ez,{}):Kt==="overlay"?b.jsx(Tz,{}):Kt==="markers"?b.jsx(wz,{}):Kt==="visual"?b.jsx(bz,{}):Kt==="scroll"?b.jsx(WO,{}):Kt==="multiple"?b.jsx(eL,{}):Kt==="bench"?b.jsx(hz,{}):Kt==="resource"?b.jsx(rL,{}):b.jsx(jz,{}));export{lR as L,ec as _,hC as a,oL as b,Oz as c,vL as d,ex as e,pL as f,mm as g,bL as h,b as j,Du as m,Km as s,sL as w};
