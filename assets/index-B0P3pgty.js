function pA(t,i){for(var r=0;r<i.length;r++){const o=i[r];if(typeof o!="string"&&!Array.isArray(o)){for(const s in o)if(s!=="default"&&!(s in t)){const u=Object.getOwnPropertyDescriptor(o,s);u&&Object.defineProperty(t,s,u.get?u:{enumerable:!0,get:()=>o[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const c of u.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerPolicy&&(u.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?u.credentials="include":s.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(s){if(s.ep)return;s.ep=!0;const u=r(s);fetch(s.href,u)}})();function Kh(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Df={exports:{}},nl={};var dv;function gA(){if(dv)return nl;dv=1;var t=Symbol.for("react.transitional.element"),i=Symbol.for("react.fragment");function r(o,s,u){var c=null;if(u!==void 0&&(c=""+u),s.key!==void 0&&(c=""+s.key),"key"in s){u={};for(var f in s)f!=="key"&&(u[f]=s[f])}else u=s;return s=u.ref,{$$typeof:t,type:o,key:c,ref:s!==void 0?s:null,props:u}}return nl.Fragment=i,nl.jsx=r,nl.jsxs=r,nl}var fv;function yA(){return fv||(fv=1,Df.exports=gA()),Df.exports}var v=yA(),Of={exports:{}},Pe={};var hv;function bA(){if(hv)return Pe;hv=1;var t=Symbol.for("react.transitional.element"),i=Symbol.for("react.portal"),r=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),c=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),g=Symbol.for("react.activity"),x=Symbol.for("react.view_transition"),b=Symbol.iterator;function w(U){return U===null||typeof U!="object"?null:(U=b&&U[b]||U["@@iterator"],typeof U=="function"?U:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},A=Object.assign,k={};function T(U,ne,he){this.props=U,this.context=ne,this.refs=k,this.updater=he||E}T.prototype.isReactComponent={},T.prototype.setState=function(U,ne){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,ne,"setState")},T.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function C(){}C.prototype=T.prototype;function D(U,ne,he){this.props=U,this.context=ne,this.refs=k,this.updater=he||E}var z=D.prototype=new C;z.constructor=D,A(z,T.prototype),z.isPureReactComponent=!0;var j=Array.isArray;function L(){}var I={H:null,A:null,T:null,S:null},q=Object.prototype.hasOwnProperty;function H(U,ne,he){var ee=he.ref;return{$$typeof:t,type:U,key:ne,ref:ee!==void 0?ee:null,props:he}}function Z(U,ne){return H(U.type,ne,U.props)}function oe(U){return typeof U=="object"&&U!==null&&U.$$typeof===t}function ue(U){var ne={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(he){return ne[he]})}var $=/\/+/g;function N(U,ne){return typeof U=="object"&&U!==null&&U.key!=null?ue(""+U.key):ne.toString(36)}function P(U){switch(U.status){case"fulfilled":return U.value;case"rejected":throw U.reason;default:switch(typeof U.status=="string"?U.then(L,L):(U.status="pending",U.then(function(ne){U.status==="pending"&&(U.status="fulfilled",U.value=ne)},function(ne){U.status==="pending"&&(U.status="rejected",U.reason=ne)})),U.status){case"fulfilled":return U.value;case"rejected":throw U.reason}}throw U}function K(U,ne,he,ee,pe){var ge=typeof U;(ge==="undefined"||ge==="boolean")&&(U=null);var ke=!1;if(U===null)ke=!0;else switch(ge){case"bigint":case"string":case"number":ke=!0;break;case"object":switch(U.$$typeof){case t:case i:ke=!0;break;case y:return ke=U._init,K(ke(U._payload),ne,he,ee,pe)}}if(ke)return pe=pe(U),ke=ee===""?"."+N(U,0):ee,j(pe)?(he="",ke!=null&&(he=ke.replace($,"$&/")+"/"),K(pe,ne,he,"",function(ve){return ve})):pe!=null&&(oe(pe)&&(pe=Z(pe,he+(pe.key==null||U&&U.key===pe.key?"":(""+pe.key).replace($,"$&/")+"/")+ke)),ne.push(pe)),1;ke=0;var le=ee===""?".":ee+":";if(j(U))for(var se=0;se<U.length;se++)ee=U[se],ge=le+N(ee,se),ke+=K(ee,ne,he,ge,pe);else if(se=w(U),typeof se=="function")for(U=se.call(U),se=0;!(ee=U.next()).done;)ee=ee.value,ge=le+N(ee,se++),ke+=K(ee,ne,he,ge,pe);else if(ge==="object"){if(typeof U.then=="function")return K(P(U),ne,he,ee,pe);throw ne=String(U),Error("Objects are not valid as a React child (found: "+(ne==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":ne)+"). If you meant to render a collection of children, use an array instead.")}return ke}function J(U,ne,he){if(U==null)return U;var ee=[],pe=0;return K(U,ee,"","",function(ge){return ne.call(he,ge,pe++)}),ee}function be(U){if(U._status===-1){var ne=U._result,he=ne();he.then(function(ee){(U._status===0||U._status===-1)&&(U._status=1,U._result=ee,he.status===void 0&&(he.status="fulfilled",he.value=ee))},function(ee){(U._status===0||U._status===-1)&&(U._status=2,U._result=ee,he.status===void 0&&(he.status="rejected",he.reason=ee))}),U._status===-1&&(U._status=0,U._result=he)}if(U._status===1)return U._result.default;throw U._result}var _=typeof reportError=="function"?reportError:function(U){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var ne=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof U=="object"&&U!==null&&typeof U.message=="string"?String(U.message):String(U),error:U});if(!window.dispatchEvent(ne))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",U);return}console.error(U)};function He(U){var ne=I.T,he={};he.types=ne!==null?ne.types:null,I.T=he;try{var ee=U(),pe=I.S;pe!==null&&pe(he,ee),typeof ee=="object"&&ee!==null&&typeof ee.then=="function"&&ee.then(L,_)}catch(ge){_(ge)}finally{ne!==null&&he.types!==null&&(ne.types=he.types),I.T=ne}}function Ee(U){var ne=I.T;if(ne!==null){var he=ne.types;he===null?ne.types=[U]:he.indexOf(U)===-1&&he.push(U)}else He(Ee.bind(null,U))}var B={map:J,forEach:function(U,ne,he){J(U,function(){ne.apply(this,arguments)},he)},count:function(U){var ne=0;return J(U,function(){ne++}),ne},toArray:function(U){return J(U,function(ne){return ne})||[]},only:function(U){if(!oe(U))throw Error("React.Children.only expected to receive a single React element child.");return U}};return Pe.Activity=g,Pe.Children=B,Pe.Component=T,Pe.Fragment=r,Pe.Profiler=s,Pe.PureComponent=D,Pe.StrictMode=o,Pe.Suspense=p,Pe.ViewTransition=x,Pe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I,Pe.__COMPILER_RUNTIME={__proto__:null,c:function(U){return I.H.useMemoCache(U)}},Pe.addTransitionType=Ee,Pe.cache=function(U){return function(){return U.apply(null,arguments)}},Pe.cacheSignal=function(){return null},Pe.cloneElement=function(U,ne,he){if(U==null)throw Error("The argument must be a React element, but you passed "+U+".");var ee=A({},U.props),pe=U.key;if(ne!=null)for(ge in ne.key!==void 0&&(pe=""+ne.key),ne)!q.call(ne,ge)||ge==="key"||ge==="__self"||ge==="__source"||ge==="ref"&&ne.ref===void 0||(ee[ge]=ne[ge]);var ge=arguments.length-2;if(ge===1)ee.children=he;else if(1<ge){for(var ke=Array(ge),le=0;le<ge;le++)ke[le]=arguments[le+2];ee.children=ke}return H(U.type,pe,ee)},Pe.createContext=function(U){return U={$$typeof:c,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null},U.Provider=U,U.Consumer={$$typeof:u,_context:U},U},Pe.createElement=function(U,ne,he){var ee,pe={},ge=null;if(ne!=null)for(ee in ne.key!==void 0&&(ge=""+ne.key),ne)q.call(ne,ee)&&ee!=="key"&&ee!=="__self"&&ee!=="__source"&&(pe[ee]=ne[ee]);var ke=arguments.length-2;if(ke===1)pe.children=he;else if(1<ke){for(var le=Array(ke),se=0;se<ke;se++)le[se]=arguments[se+2];pe.children=le}if(U&&U.defaultProps)for(ee in ke=U.defaultProps,ke)pe[ee]===void 0&&(pe[ee]=ke[ee]);return H(U,ge,pe)},Pe.createRef=function(){return{current:null}},Pe.forwardRef=function(U){return{$$typeof:f,render:U}},Pe.isValidElement=oe,Pe.lazy=function(U){return{$$typeof:y,_payload:{_status:-1,_result:U},_init:be}},Pe.memo=function(U,ne){return{$$typeof:m,type:U,compare:ne===void 0?null:ne}},Pe.startTransition=He,Pe.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()},Pe.use=function(U){return I.H.use(U)},Pe.useActionState=function(U,ne,he){return I.H.useActionState(U,ne,he)},Pe.useCallback=function(U,ne){return I.H.useCallback(U,ne)},Pe.useContext=function(U){return I.H.useContext(U)},Pe.useDebugValue=function(){},Pe.useDeferredValue=function(U,ne){return I.H.useDeferredValue(U,ne)},Pe.useEffect=function(U,ne){return I.H.useEffect(U,ne)},Pe.useEffectEvent=function(U){return I.H.useEffectEvent(U)},Pe.useId=function(){return I.H.useId()},Pe.useImperativeHandle=function(U,ne,he){return I.H.useImperativeHandle(U,ne,he)},Pe.useInsertionEffect=function(U,ne){return I.H.useInsertionEffect(U,ne)},Pe.useLayoutEffect=function(U,ne){return I.H.useLayoutEffect(U,ne)},Pe.useMemo=function(U,ne){return I.H.useMemo(U,ne)},Pe.useOptimistic=function(U,ne){return I.H.useOptimistic(U,ne)},Pe.useReducer=function(U,ne,he){return I.H.useReducer(U,ne,he)},Pe.useRef=function(U){return I.H.useRef(U)},Pe.useState=function(U){return I.H.useState(U)},Pe.useSyncExternalStore=function(U,ne,he){return I.H.useSyncExternalStore(U,ne,he)},Pe.useTransition=function(){return I.H.useTransition()},Pe.version="19.3.0",Pe}var mv;function Wh(){return mv||(mv=1,Of.exports=bA()),Of.exports}var O=Wh();const vA=Kh(O),uw=pA({__proto__:null,default:vA},[O]);var jf={exports:{}},il={},Lf={exports:{}},zf={};var pv;function xA(){return pv||(pv=1,(function(t){function i(P,K){var J=P.length;P.push(K);e:for(;0<J;){var be=J-1>>>1,_=P[be];if(0<s(_,K))P[be]=K,P[J]=_,J=be;else break e}}function r(P){return P.length===0?null:P[0]}function o(P){if(P.length===0)return null;var K=P[0],J=P.pop();if(J!==K){P[0]=J;e:for(var be=0,_=P.length,He=_>>>1;be<He;){var Ee=2*(be+1)-1,B=P[Ee],U=Ee+1,ne=P[U];if(0>s(B,J))U<_&&0>s(ne,B)?(P[be]=ne,P[U]=J,be=U):(P[be]=B,P[Ee]=J,be=Ee);else if(U<_&&0>s(ne,J))P[be]=ne,P[U]=J,be=U;else break e}}return K}function s(P,K){var J=P.sortIndex-K.sortIndex;return J!==0?J:P.id-K.id}if(t.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;t.unstable_now=function(){return u.now()}}else{var c=Date,f=c.now();t.unstable_now=function(){return c.now()-f}}var p=[],m=[],y=1,g=null,x=3,b=!1,w=!1,E=!1,A=!1,k=typeof setTimeout=="function"?setTimeout:null,T=typeof clearTimeout=="function"?clearTimeout:null,C=typeof setImmediate<"u"?setImmediate:null;function D(P){for(var K=r(m);K!==null;){if(K.callback===null)o(m);else if(K.startTime<=P)o(m),K.sortIndex=K.expirationTime,i(p,K);else break;K=r(m)}}function z(P){if(E=!1,D(P),!w)if(r(p)!==null)w=!0,j||(j=!0,oe());else{var K=r(m);K!==null&&N(z,K.startTime-P)}}var j=!1,L=-1,I=5,q=-1;function H(){return A?!0:!(t.unstable_now()-q<I)}function Z(){if(A=!1,j){var P=t.unstable_now();q=P;var K=!0;try{e:{w=!1,E&&(E=!1,T(L),L=-1),b=!0;var J=x;try{t:{for(D(P),g=r(p);g!==null&&!(g.expirationTime>P&&H());){var be=g.callback;if(typeof be=="function"){g.callback=null,x=g.priorityLevel;var _=be(g.expirationTime<=P);if(P=t.unstable_now(),typeof _=="function"){g.callback=_,D(P),K=!0;break t}g===r(p)&&o(p),D(P)}else o(p);g=r(p)}if(g!==null)K=!0;else{var He=r(m);He!==null&&N(z,He.startTime-P),K=!1}}break e}finally{g=null,x=J,b=!1}K=void 0}}finally{K?oe():j=!1}}}var oe;if(typeof C=="function")oe=function(){C(Z)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,$=ue.port2;ue.port1.onmessage=Z,oe=function(){$.postMessage(null)}}else oe=function(){k(Z,0)};function N(P,K){L=k(function(){P(t.unstable_now())},K)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(P){P.callback=null},t.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<P?Math.floor(1e3/P):5},t.unstable_getCurrentPriorityLevel=function(){return x},t.unstable_next=function(P){switch(x){case 1:case 2:case 3:var K=3;break;default:K=x}var J=x;x=K;try{return P()}finally{x=J}},t.unstable_requestPaint=function(){A=!0},t.unstable_runWithPriority=function(P,K){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var J=x;x=P;try{return K()}finally{x=J}},t.unstable_scheduleCallback=function(P,K,J){var be=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?be+J:be):J=be,P){case 1:var _=-1;break;case 2:_=250;break;case 5:_=1073741823;break;case 4:_=1e4;break;default:_=5e3}return _=J+_,P={id:y++,callback:K,priorityLevel:P,startTime:J,expirationTime:_,sortIndex:-1},J>be?(P.sortIndex=J,i(m,P),r(p)===null&&P===r(m)&&(E?(T(L),L=-1):E=!0,N(z,J-be))):(P.sortIndex=_,i(p,P),w||b||(w=!0,j||(j=!0,oe()))),P},t.unstable_shouldYield=H,t.unstable_wrapCallback=function(P){var K=x;return function(){var J=x;x=K;try{return P.apply(this,arguments)}finally{x=J}}}})(zf)),zf}var gv;function wA(){return gv||(gv=1,Lf.exports=xA()),Lf.exports}var _f={exports:{}},Yt={};var yv;function SA(){if(yv)return Yt;yv=1;var t=Wh();function i(y){var g="https://react.dev/errors/"+y;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)g+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+y+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function r(){}var o={d:{f:r,r:function(){throw Error(i(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},s=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),c=Symbol.for("react.optimistic_key");function f(y,g,x){var b=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:s,key:b==null?null:b===c?c:""+b,children:y,containerInfo:g,implementation:x}}var p=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(y,g){if(y==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return Yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Yt.browser=function(y){return{$$typeof:u,_reason:y}},Yt.createPortal=function(y,g){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(i(299));return f(y,g,null,x)},Yt.flushSync=function(y){var g=p.T,x=o.p;try{if(p.T=null,o.p=2,y)return y()}finally{p.T=g,o.p=x,o.d.f()}},Yt.preconnect=function(y,g){typeof y=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,o.d.C(y,g))},Yt.prefetchDNS=function(y){typeof y=="string"&&o.d.D(y)},Yt.preinit=function(y,g){if(typeof y=="string"&&g&&typeof g.as=="string"){var x=g.as,b=m(x,g.crossOrigin),w=typeof g.integrity=="string"?g.integrity:void 0,E=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;x==="style"?o.d.S(y,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:b,integrity:w,fetchPriority:E}):x==="script"&&o.d.X(y,{crossOrigin:b,integrity:w,fetchPriority:E,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},Yt.preinitModule=function(y,g){if(typeof y=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var x=m(g.as,g.crossOrigin);o.d.M(y,{crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}}else g==null&&o.d.M(y)},Yt.preload=function(y,g){if(typeof y=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var x=g.as,b=m(x,g.crossOrigin);o.d.L(y,x,{crossOrigin:b,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},Yt.preloadModule=function(y,g){if(typeof y=="string")if(g){var x=m(g.as,g.crossOrigin);o.d.m(y,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}else o.d.m(y)},Yt.requestFormReset=function(y){o.d.r(y)},Yt.unstable_batchedUpdates=function(y,g){return y(g)},Yt.useFormState=function(y,g,x){return p.H.useFormState(y,g,x)},Yt.useFormStatus=function(){return p.H.useHostTransitionStatus()},Yt.version="19.3.0",Yt}var bv;function cw(){if(bv)return _f.exports;bv=1;function t(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)}catch(i){console.error(i)}}return t(),_f.exports=SA(),_f.exports}var vv;function kA(){if(vv)return il;vv=1;var t=wA(),i=Wh(),r=cw();function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function u(e){for(var n=e,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(e=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function c(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function f(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(u(e)!==e)throw Error(o(188))}function m(e){var n=e.alternate;if(!n){if(n=u(e),n===null)throw Error(o(188));return n!==e?null:e}for(var a=e,l=n;;){var d=a.return;if(d===null)break;var h=d.alternate;if(h===null){if(l=d.return,l!==null){a=l;continue}break}if(d.child===h.child){for(h=d.child;h;){if(h===a)return p(d),e;if(h===l)return p(d),n;h=h.sibling}throw Error(o(188))}if(a.return!==l.return)a=d,l=h;else{for(var S=!1,M=d.child;M;){if(M===a){S=!0,a=d,l=h;break}if(M===l){S=!0,l=d,a=h;break}M=M.sibling}if(!S){for(M=h.child;M;){if(M===a){S=!0,a=h,l=d;break}if(M===l){S=!0,l=h,a=d;break}M=M.sibling}if(!S)throw Error(o(189))}}if(a.alternate!==l)throw Error(o(190))}if(a.tag!==3)throw Error(o(188));return a.stateNode.current===a?e:n}function y(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=y(e),n!==null)return n;e=e.sibling}return null}function g(e,n,a,l,d,h){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&a(e,l,d,h)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&g(e.child,n,a,l,d,h))return!0;e=e.sibling}return!1}function x(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function b(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function w(e){var n=[null,null],a=x(e);return a===null||E(n,e,a.child,{foundSelf:!1}),n}function E(e,n,a,l){for(;a!==null;){if(a===n)l.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(l.foundSelf)return e[1]=a,!0;e[0]=a}else if((a.tag!==22||a.memoizedState===null)&&E(e,n,a.child,l))return!0;a=a.sibling}return!1}function A(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(o(559))}}var k=null,T=null;function C(e,n,a){return e===a?!0:e===n?(k=e,!0):!1}function D(e,n,a){return e===a?(T=e,!1):e===n?(T!==null&&(k=e),!0):!1}function z(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function j(e,n,a){for(var l=0,d=e;d;d=a(d))l++;d=0;for(var h=n;h;h=a(h))d++;for(;0<l-d;)e=a(e),l--;for(;0<d-l;)n=a(n),d--;for(;l--;){if(e===n||n!==null&&e===n.alternate)return e;e=a(e),n=a(n)}return null}var L=Object.assign,I=Symbol.for("react.element"),q=Symbol.for("react.transitional.element"),H=Symbol.for("react.portal"),Z=Symbol.for("react.fragment"),oe=Symbol.for("react.strict_mode"),ue=Symbol.for("react.profiler"),$=Symbol.for("react.consumer"),N=Symbol.for("react.context"),P=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),J=Symbol.for("react.suspense_list"),be=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),He=Symbol.for("react.activity"),Ee=Symbol.for("react.legacy_hidden"),B=Symbol.for("react.memo_cache_sentinel"),U=Symbol.for("react.view_transition"),ne=Symbol.for("react.recoverable"),he=Symbol.iterator;function ee(e){return e===null||typeof e!="object"?null:(e=he&&e[he]||e["@@iterator"],typeof e=="function"?e:null)}var pe=Symbol.for("react.client.reference");function ge(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===pe?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Z:return"Fragment";case ue:return"Profiler";case oe:return"StrictMode";case K:return"Suspense";case J:return"SuspenseList";case He:return"Activity";case U:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case H:return"Portal";case N:return e.displayName||"Context";case $:return(e._context.displayName||"Context")+".Consumer";case P:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case be:return n=e.displayName||null,n!==null?n:ge(e.type)||"Memo";case _:n=e._payload,e=e._init;try{return ge(e(n))}catch{}}return null}var ke=Array.isArray,le=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,se=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ve={pending:!1,data:null,method:null,action:null},Ce=[],Me=-1;function ce(e){return{current:e}}function xe(e){0>Me||(e.current=Ce[Me],Ce[Me]=null,Me--)}function Ne(e,n){Me++,Ce[Me]=e.current,e.current=n}var Be=ce(null),X=ce(null),Le=ce(null),ie=ce(null);function ye(e,n){switch(Ne(Le,n),Ne(X,e),Ne(Be,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?xb(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=xb(n),e=wb(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}xe(Be),Ne(Be,e)}function Ae(){xe(Be),xe(X),xe(Le)}function me(e){var n=e.memoizedState;n!==null&&(Gr._currentValue=n.memoizedState,Ne(ie,e)),n=Be.current;var a=wb(n,e.type);n!==a&&(Ne(X,e),Ne(Be,a))}function je(e){X.current===e&&(xe(Be),xe(X)),ie.current===e&&(xe(ie),Gr._currentValue=ve)}var V,R;function we(e){if(V===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);V=n&&n[1]||"",R=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+V+e+R}var De=!1;function ze(e,n){if(!e||De)return"";De=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(n){var fe=function(){throw Error()};if(Object.defineProperty(fe.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(fe,[])}catch(Te){var Y=Te}Reflect.construct(e,[],fe)}else{try{fe.call()}catch(Te){Y=Te}fe=!1;try{var ae=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),fe=!0,new e}finally{fe&&(ae!==void 0?Object.defineProperty(e.prototype,"props",ae):delete e.prototype.props)}}}else{try{throw Error()}catch(Te){Y=Te}(fe=e())&&typeof fe.catch=="function"&&fe.catch(function(){})}}catch(Te){if(Te&&Y&&typeof Te.stack=="string")return[Te.stack,Y.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var d=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");d&&d.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var h=l.DetermineComponentFrameRoot(),S=h[0],M=h[1];if(S&&M){var F=S.split(`
`),W=M.split(`
`);for(d=l=0;l<F.length&&!F[l].includes("DetermineComponentFrameRoot");)l++;for(;d<W.length&&!W[d].includes("DetermineComponentFrameRoot");)d++;if(l===F.length||d===W.length)for(l=F.length-1,d=W.length-1;1<=l&&0<=d&&F[l]!==W[d];)d--;for(;1<=l&&0<=d;l--,d--)if(F[l]!==W[d]){if(l!==1||d!==1)do if(l--,d--,0>d||F[l]!==W[d]){var re=`
`+F[l].replace(" at new "," at ");return e.displayName&&re.includes("<anonymous>")&&(re=re.replace("<anonymous>",e.displayName)),re}while(1<=l&&0<=d);break}}}finally{De=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?we(a):""}function Fe(e,n){switch(e.tag){case 26:case 27:case 5:return we(e.type);case 16:return we("Lazy");case 13:return e.child!==n&&n!==null?we("Suspense Fallback"):we("Suspense");case 19:return we("SuspenseList");case 0:case 15:return ze(e.type,!1);case 11:return ze(e.type.render,!1);case 1:return ze(e.type,!0);case 31:return we("Activity");case 30:return we("ViewTransition");default:return""}}function qe(e){try{var n="",a=null;do n+=Fe(e,a),a=e,e=e.return;while(e);return n}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var tt=Object.prototype.hasOwnProperty,St=t.unstable_scheduleCallback,ht=t.unstable_cancelCallback,yi=t.unstable_shouldYield,Je=t.unstable_requestPaint,pt=t.unstable_now,Kt=t.unstable_getCurrentPriorityLevel,bi=t.unstable_ImmediatePriority,Nn=t.unstable_UserBlockingPriority,Nl=t.unstable_NormalPriority,k1=t.unstable_LowPriority,Gm=t.unstable_IdlePriority,A1=t.log,T1=t.unstable_setDisableYieldValue,so=null,yn=null;function Ui(e){if(typeof A1=="function"&&T1(e),yn&&typeof yn.setStrictMode=="function")try{yn.setStrictMode(so,e)}catch{}}var bn=Math.clz32?Math.clz32:R1,E1=Math.log,C1=Math.LN2;function R1(e){return e>>>=0,e===0?32:31-(E1(e)/C1|0)|0}var Dl=256,Ol=262144,jl=4194304;function Aa(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ll(e,n,a){var l=e.pendingLanes;if(l===0)return 0;var d=0,h=e.suspendedLanes,S=e.pingedLanes;e=e.warmLanes;var M=l&134217727;return M!==0?(l=M&~h,l!==0?d=Aa(l):(S&=M,S!==0?d=Aa(S):a||(a=M&~e,a!==0&&(d=Aa(a))))):(M=l&~h,M!==0?d=Aa(M):S!==0?d=Aa(S):a||(a=l&~e,a!==0&&(d=Aa(a)))),d===0?0:n!==0&&n!==d&&(n&h)===0&&(h=d&-d,a=n&-n,h>=a||h===32&&(a&4194048)!==0)?n:d}function uo(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function $m(e,n){(n&8)!==0&&(n|=n&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=n;0<a;){var l=31-bn(a),d=1<<l;n|=e[l],a&=~d}return n}function M1(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ym(){var e=jl;return jl<<=1,(jl&62914560)===0&&(jl=4194304),e}function ic(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function co(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function N1(e,n,a,l,d,h){var S=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var M=e.entanglements,F=e.expirationTimes,W=e.hiddenUpdates;for(a=S&~a;0<a;){var re=31-bn(a),fe=1<<re;M[re]=0,F[re]=-1;var Y=W[re];if(Y!==null)for(W[re]=null,re=0;re<Y.length;re++){var ae=Y[re];ae!==null&&(ae.lane&=-536870913)}a&=~fe}l!==0&&Jm(e,l,0),h!==0&&d===0&&e.tag!==0&&(e.suspendedLanes|=h&~(S&~n))}function Jm(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var l=31-bn(n);e.entangledLanes|=n,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function Xm(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var l=31-bn(a),d=1<<l;d&n|e[l]&n&&(e[l]|=n),a&=~d}}function Zm(e,n){var a=n&-n;return a=(a&42)!==0?1:ac(a),(a&(e.suspendedLanes|n))!==0?0:a}function ac(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function rc(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Qm(){var e=se.p;return e!==0?e:(e=window.event,e===void 0?32:av(e.type))}function Km(e,n){var a=se.p;try{return se.p=e,n()}finally{se.p=a}}var vi=Math.random().toString(36).slice(2),Ut="__reactFiber$"+vi,on="__reactProps$"+vi,rr="__reactContainer$"+vi,Wm="__reactEvents$"+vi,D1="__reactListeners$"+vi,O1="__reactHandles$"+vi,ep="__reactResources$"+vi,fo="__reactMarker$"+vi,zl="__reactLoad$"+vi;function _l(e){delete e[Ut],delete e[on],delete e[D1],delete e[O1]}function Ta(e){var n;if(n=e[Ut])return n;for(var a=e.parentNode;a;){if(n=a[rr]||a[Ut]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=Hb(e);e!==null;){if(a=e[Ut])return a;e=Hb(e)}return n}e=a,a=e.parentNode}return null}function or(e){if(e=e[Ut]||e[rr]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function ho(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(o(33))}function lr(e){var n=e[ep];return n||(n=e[ep]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function It(e){e[fo]=!0}function tp(e){e[zl]=void 0}var np=new Set,ip={};function Ea(e,n){sr(e,n),sr(e+"Capture",n)}function sr(e,n){for(ip[e]=n,e=0;e<n.length;e++)np.add(n[e])}var j1=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ap={},rp={};function L1(e){return tt.call(rp,e)?!0:tt.call(ap,e)?!1:j1.test(e)?rp[e]=!0:(ap[e]=!0,!1)}var rt=!1;function op(){var e=rt;return rt=!1,e}function Il(e,n,a){if(L1(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var l=n.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,a)}}function Hl(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,a)}}function xi(e,n,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,l)}}function vn(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function lp(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function z1(e,n,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var d=l.get,h=l.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return d.call(this)},set:function(S){a=""+S,h.call(this,S)}}),Object.defineProperty(e,n,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(S){a=""+S},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function oc(e){if(!e._valueTracker){var n=lp(e)?"checked":"value";e._valueTracker=z1(e,n,""+e[n])}}function sp(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),l="";return e&&(l=lp(e)?e.checked?"true":"false":e.value),e=l,e!==a?(n.setValue(e),!0):!1}var _1=/[\n"\\]/g;function Dn(e){return e.replace(_1,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function lc(e,n,a,l,d,h,S,M){e.name="",S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"?e.type=S:e.removeAttribute("type"),n!=null?S==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+vn(n)):e.value!==""+vn(n)&&(e.value=""+vn(n)):S!=="submit"&&S!=="reset"||e.removeAttribute("value"),n!=null?S==="number"&&e.value==n?sc(e,vn(e.value)):sc(e,vn(n)):a!=null?sc(e,vn(a)):l!=null&&e.removeAttribute("value"),d==null&&h!=null&&(e.defaultChecked=!!h),d!=null&&(e.checked=d&&typeof d!="function"&&typeof d!="symbol"),M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"?e.name=""+vn(M):e.removeAttribute("name")}function up(e,n,a,l,d,h,S,M){if(h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"&&(e.type=h),n!=null||a!=null){if(!(h!=="submit"&&h!=="reset"||n!=null)){oc(e);return}a=a!=null?""+vn(a):"",n=n!=null?""+vn(n):a,M||n===e.value||(e.value=n),e.defaultValue=n}l=l??d,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=M?e.checked:!!l,e.defaultChecked=!!l,S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"&&(e.name=S),oc(e)}function sc(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function ur(e,n,a,l){if(e=e.options,n){n={};for(var d=0;d<a.length;d++)n["$"+a[d]]=!0;for(a=0;a<e.length;a++)d=n.hasOwnProperty("$"+e[a].value),e[a].selected!==d&&(e[a].selected=d),d&&l&&(e[a].defaultSelected=!0)}else{for(a=""+vn(a),n=null,d=0;d<e.length;d++){if(e[d].value===a){e[d].selected=!0,l&&(e[d].defaultSelected=!0);return}n!==null||e[d].disabled||(n=e[d])}n!==null&&(n.selected=!0)}}function cp(e,n,a){if(n!=null&&(n=""+vn(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+vn(a):""}function dp(e,n,a,l){if(n==null){if(l!=null){if(a!=null)throw Error(o(92));if(ke(l)){if(1<l.length)throw Error(o(93));l=l[0]}a=l}a==null&&(a=""),n=a}a=vn(n),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),oc(e)}function cr(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var I1=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function fp(e,n,a){var l=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":l?e.setProperty(n,a):typeof a!="number"||a===0||I1.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function hp(e,n,a){if(n!=null&&typeof n!="object")throw Error(o(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||n!=null&&n.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="",rt=!0);for(var d in n)l=n[d],n.hasOwnProperty(d)&&a[d]!==l&&(fp(e,d,l),rt=!0)}else for(var h in n)n.hasOwnProperty(h)&&fp(e,h,n[h])}function uc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var H1=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),B1=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Bl(e){return B1.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ti(){}var cc=null;function dc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var dr=null,fr=null;function mp(e){var n=or(e);if(n&&(e=n.stateNode)){var a=e[on]||null;e:switch(e=n.stateNode,n.type){case"input":if(lc(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Dn(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var l=a[n];if(l!==e&&l.form===e.form){var d=l[on]||null;if(!d)throw Error(o(90));lc(l,d.value,d.defaultValue,d.defaultValue,d.checked,d.defaultChecked,d.type,d.name)}}for(n=0;n<a.length;n++)l=a[n],l.form===e.form&&sp(l)}break e;case"textarea":cp(e,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&ur(e,!!a.multiple,n,!1)}}}var fc=!1;function pp(e,n,a){if(fc)return e(n,a);fc=!0;try{var l=e(n);return l}finally{if(fc=!1,(dr!==null||fr!==null)&&(Bs(),dr&&(n=dr,e=fr,fr=dr=null,mp(n),e)))for(n=0;n<e.length;n++)mp(e[n])}}function mo(e,n){var a=e.stateNode;if(a===null)return null;var l=a[on]||null;if(l===null)return null;a=l[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(o(231,n,typeof a));return a}var wi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),hc=!1;if(wi)try{var po={};Object.defineProperty(po,"passive",{get:function(){hc=!0}}),window.addEventListener("test",po,po),window.removeEventListener("test",po,po)}catch{hc=!1}var Fi=null,mc=null,ql=null;function gp(){if(ql)return ql;var e,n=mc,a=n.length,l,d="value"in Fi?Fi.value:Fi.textContent,h=d.length;for(e=0;e<a&&n[e]===d[e];e++);var S=a-e;for(l=1;l<=S&&n[a-l]===d[h-l];l++);return ql=d.slice(e,1<l?1-l:void 0)}function Ul(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function Fl(){return!0}function yp(){return!1}function Wt(e){function n(a,l,d,h,S){this._reactName=a,this._targetInst=d,this.type=l,this.nativeEvent=h,this.target=S,this.currentTarget=null;for(var M in e)e.hasOwnProperty(M)&&(a=e[M],this[M]=a?a(h):h[M]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?Fl:yp,this.isPropagationStopped=yp,this}return L(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Fl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Fl)},persist:function(){},isPersistent:Fl}),n}var Pi={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Pl=Wt(Pi),go=L({},Pi,{view:0,detail:0}),q1=Wt(go),pc,gc,yo,Vl=L({},go,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:bc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==yo&&(yo&&e.type==="mousemove"?(pc=e.screenX-yo.screenX,gc=e.screenY-yo.screenY):gc=pc=0,yo=e),pc)},movementY:function(e){return"movementY"in e?e.movementY:gc}}),bp=Wt(Vl),U1=L({},Vl,{dataTransfer:0}),F1=Wt(U1),P1=L({},go,{relatedTarget:0}),yc=Wt(P1),V1=L({},Pi,{animationName:0,elapsedTime:0,pseudoElement:0}),G1=Wt(V1),$1=L({},Pi,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Y1=Wt($1),J1=L({},Pi,{data:0}),vp=Wt(J1),X1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Z1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Q1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function K1(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Q1[e])?!!n[e]:!1}function bc(){return K1}var W1=L({},go,{key:function(e){if(e.key){var n=X1[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Ul(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Z1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:bc,charCode:function(e){return e.type==="keypress"?Ul(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ul(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),eS=Wt(W1),tS=L({},Vl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),xp=Wt(tS),nS=L({},Pi,{submitter:0}),iS=Wt(nS),aS=L({},go,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:bc}),rS=Wt(aS),oS=L({},Pi,{propertyName:0,elapsedTime:0,pseudoElement:0}),lS=Wt(oS),sS=L({},Vl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),uS=Wt(sS),cS=L({},Pi,{newState:0,oldState:0,source:0}),dS=Wt(cS),fS=[9,13,27,32],vc=wi&&"CompositionEvent"in window,bo=null;wi&&"documentMode"in document&&(bo=document.documentMode);var hS=wi&&"TextEvent"in window&&!bo,wp=wi&&(!vc||bo&&8<bo&&11>=bo),Sp=" ",kp=!1;function Ap(e,n){switch(e){case"keyup":return fS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Tp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var hr=!1;function mS(e,n){switch(e){case"compositionend":return Tp(n);case"keypress":return n.which!==32?null:(kp=!0,Sp);case"textInput":return e=n.data,e===Sp&&kp?null:e;default:return null}}function pS(e,n){if(hr)return e==="compositionend"||!vc&&Ap(e,n)?(e=gp(),ql=mc=Fi=null,hr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return wp&&n.locale!=="ko"?null:n.data;default:return null}}var gS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ep(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!gS[e.type]:n==="textarea"}function Cp(e,n,a,l){dr?fr?fr.push(l):fr=[l]:dr=l,n=Gs(n,"onChange"),0<n.length&&(a=new Pl("onChange","change",null,a,l),e.push({event:a,listeners:n}))}var vo=null,xo=null;function yS(e){mb(e,0)}function Gl(e){var n=ho(e);if(sp(n))return e}function Rp(e,n){if(e==="change")return n}var Mp=!1;if(wi){var xc;if(wi){var wc="oninput"in document;if(!wc){var Np=document.createElement("div");Np.setAttribute("oninput","return;"),wc=typeof Np.oninput=="function"}xc=wc}else xc=!1;Mp=xc&&(!document.documentMode||9<document.documentMode)}function Dp(){vo&&(vo.detachEvent("onpropertychange",Op),xo=vo=null)}function Op(e){if(e.propertyName==="value"&&Gl(xo)){var n=[];Cp(n,xo,e,dc(e)),pp(yS,n)}}function bS(e,n,a){e==="focusin"?(Dp(),vo=n,xo=a,vo.attachEvent("onpropertychange",Op)):e==="focusout"&&Dp()}function vS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Gl(xo)}function xS(e,n){if(e==="click")return Gl(n)}function wS(e,n){if(e==="input"||e==="change")return Gl(n)}function SS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var xn=typeof Object.is=="function"?Object.is:SS;function wo(e,n){if(xn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),l=Object.keys(n);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var d=a[l];if(!tt.call(n,d)||!xn(e[d],n[d]))return!1}return!0}function Sc(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function jp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Lp(e,n){var a=jp(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=n&&l>=n)return{node:a,offset:n-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=jp(a)}}function zp(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?zp(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function _p(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Sc(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=Sc(e.document)}return n}function kc(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var kS=wi&&"documentMode"in document&&11>=document.documentMode,mr=null,Ac=null,So=null,Tc=!1;function Ip(e,n,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Tc||mr==null||mr!==Sc(l)||(l=mr,"selectionStart"in l&&kc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),So&&wo(So,l)||(So=l,l=Gs(Ac,"onSelect"),0<l.length&&(n=new Pl("onSelect","select",null,n,a),e.push({event:n,listeners:l}),n.target=mr)))}function Ca(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var pr={animationend:Ca("Animation","AnimationEnd"),animationiteration:Ca("Animation","AnimationIteration"),animationstart:Ca("Animation","AnimationStart"),transitionrun:Ca("Transition","TransitionRun"),transitionstart:Ca("Transition","TransitionStart"),transitioncancel:Ca("Transition","TransitionCancel"),transitionend:Ca("Transition","TransitionEnd")},Ec={},Hp={};wi&&(Hp=document.createElement("div").style,"AnimationEvent"in window||(delete pr.animationend.animation,delete pr.animationiteration.animation,delete pr.animationstart.animation),"TransitionEvent"in window||delete pr.transitionend.transition);function Ra(e){if(Ec[e])return Ec[e];if(!pr[e])return e;var n=pr[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in Hp)return Ec[e]=n[a];return e}var Bp=Ra("animationend"),qp=Ra("animationiteration"),Up=Ra("animationstart"),AS=Ra("transitionrun"),TS=Ra("transitionstart"),ES=Ra("transitioncancel"),Fp=Ra("transitionend"),Pp=new Map,Cc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Cc.push("scrollEnd");function Un(e,n){Pp.set(e,n),Ea(n,[e])}var CS=0;function Si(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=Gn.identifierPrefix;var a=CS++;return e="_"+e+"t_"+a.toString(32)+"_",n.autoName=e}function Vp(e){if(e==null||typeof e=="string")return e;var n=null,a=zr;if(a!==null)for(var l=0;l<a.length;l++){var d=e[a[l]];if(d!=null){if(d==="none")return"none";n=n==null?d:n+(" "+d)}}return n??e.default}function ki(e,n){return e=Vp(e),n=Vp(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var $l=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},On=[],gr=0,Rc=0;function Yl(){for(var e=gr,n=Rc=gr=0;n<e;){var a=On[n];On[n++]=null;var l=On[n];On[n++]=null;var d=On[n];On[n++]=null;var h=On[n];if(On[n++]=null,l!==null&&d!==null){var S=l.pending;S===null?d.next=d:(d.next=S.next,S.next=d),l.pending=d}h!==0&&Gp(a,d,h)}}function Jl(e,n,a,l){On[gr++]=e,On[gr++]=n,On[gr++]=a,On[gr++]=l,Rc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Mc(e,n,a,l){return Jl(e,n,a,l),Xl(e)}function Ma(e,n){return Jl(e,null,null,n),Xl(e)}function Gp(e,n,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var d=!1,h=e.return;h!==null;)h.childLanes|=a,l=h.alternate,l!==null&&(l.childLanes|=a),h.tag===22&&(e=h.stateNode,e===null||e._visibility&1||(d=!0)),e=h,h=h.return;return e.tag===3?(h=e.stateNode,d&&n!==null&&(d=31-bn(a),e=h.hiddenUpdates,l=e[d],l===null?e[d]=[n]:l.push(n),n.lane=a|536870912),h):null}function Xl(e){if(50<Vo)throw Vo=0,Hs=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var yr={};function RS(e,n,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ln(e,n,a,l){return new RS(e,n,a,l)}function Nc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ai(e,n){var a=e.alternate;return a===null?(a=ln(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&1206910976,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function $p(e,n){e.flags&=1206910978;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function Zl(e,n,a,l,d,h){var S=0;if(l=e,typeof l=="function")Nc(l)&&(S=1);else if(typeof l=="string")S=nA(e,a,Be.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(l){case He:return e=ln(31,a,n,d),e.elementType=He,e.lanes=h,e;case Z:return Na(a.children,d,h,n);case oe:S=8,d|=24;break;case ue:return e=ln(12,a,n,d|2),e.elementType=ue,e.lanes=h,e;case K:return e=ln(13,a,n,d),e.elementType=K,e.lanes=h,e;case J:return e=ln(19,a,n,d),e.elementType=J,e.lanes=h,e;case Ee:case U:return e=d|32,e=ln(30,a,n,e),e.elementType=U,e.lanes=h,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof l=="object"&&l!==null)switch(l.$$typeof){case N:S=10;break e;case $:S=9;break e;case P:S=11;break e;case be:S=14;break e;case _:S=16,l=null;break e}S=29,a=Error(o(130,e===null?"null":typeof e,"")),l=null}return n=ln(S,a,n,d),n.elementType=e,n.type=l,n.lanes=h,n}function Na(e,n,a,l){return e=ln(7,e,l,n),e.lanes=a,e}function Dc(e,n,a){return e=ln(6,e,null,n),e.lanes=a,e}function Yp(e){var n=ln(18,null,null,0);return n.stateNode=e,n}function Oc(e,n,a){return n=ln(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Jp=new WeakMap;function jn(e,n){if(typeof e=="object"&&e!==null){var a=Jp.get(e);return a!==void 0?a:(n={value:e,source:n,stack:qe(n)},Jp.set(e,n),n)}return{value:e,source:n,stack:qe(n)}}var br=[],vr=0,Ql=null,ko=0,Ln=[],zn=0,Vi=null,ni=1,ii="";function Ti(e,n){br[vr++]=ko,br[vr++]=Ql,Ql=e,ko=n}function Xp(e,n,a){Ln[zn++]=ni,Ln[zn++]=ii,Ln[zn++]=Vi,Vi=e;var l=ni;e=ii;var d=32-bn(l)-1;l&=~(1<<d),a+=1;var h=32-bn(n)+d;if(30<h){var S=d-d%5;h=(l&(1<<S)-1).toString(32),l>>=S,d-=S,ni=1<<32-bn(n)+d|a<<d|l,ii=h+e}else ni=1<<h|a<<d|l,ii=e}function Kl(e){e.return!==null&&(Ti(e,1),Xp(e,1,0))}function jc(e){for(;e===Ql;)Ql=br[--vr],br[vr]=null,ko=br[--vr],br[vr]=null;for(;e===Vi;)Vi=Ln[--zn],Ln[zn]=null,ii=Ln[--zn],Ln[zn]=null,ni=Ln[--zn],Ln[zn]=null}function Zp(e,n){Ln[zn++]=ni,Ln[zn++]=ii,Ln[zn++]=Vi,ni=n.id,ii=n.overflow,Vi=e}var Ht=null,bt=null,Ke=!1,Gi=null,_n=!1,Lc=Error(o(519));function $i(e){var n=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ao(jn(n,e)),Lc}function Qp(e){var n=e.stateNode,a=e.type,l=e.memoizedProps;switch(n[Ut]=e,n[on]=l,a){case"dialog":et("cancel",n),et("close",n);break;case"iframe":case"object":case"embed":et("load",n);break;case"video":case"audio":for(a=0;a<$o.length;a++)et($o[a],n);break;case"source":et("error",n);break;case"img":case"image":case"link":et("error",n),et("load",n);break;case"details":et("toggle",n);break;case"input":et("invalid",n),up(n,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":et("invalid",n);break;case"textarea":et("invalid",n),dp(n,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||l.suppressHydrationWarning===!0||bb(n.textContent,a)?(l.popover!=null&&(et("beforetoggle",n),et("toggle",n)),l.onScroll!=null&&et("scroll",n),l.onScrollEnd!=null&&et("scrollend",n),l.onClick!=null&&(n.onclick=ti),n=!0):n=!1,n||$i(e,!0)}function Wl(e){for(Ht=e.return;Ht;)switch(Ht.tag){case 5:case 31:case 13:_n=!1;return;case 27:case 3:_n=!0;return;default:Ht=Ht.return}}function xr(e){if(e!==Ht)return!1;if(!Ke)return Wl(e),Ke=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||df(e.type,e.memoizedProps)),a=!a),a&&bt&&$i(e),Wl(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));bt=Ib(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));bt=Ib(e)}else n===27?(n=bt,sa(e.type)?(e=xf,xf=null,bt=e):bt=n):bt=Ht?Hn(e.stateNode.nextSibling):null;return!0}function Da(){bt=Ht=null,Ke=!1}function zc(){var e=Gi;return e!==null&&(cn===null?cn=e:cn.push.apply(cn,e),Gi=null),e}function Ao(e){Gi===null?Gi=[e]:Gi.push(e)}var _c=ce(null),Oa=null,Ei=null;function Yi(e,n,a){Ne(_c,n._currentValue),n._currentValue=a}function Ci(e){e._currentValue=_c.current,xe(_c)}function es(e,n,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,l!==null&&(l.childLanes|=n)):l!==null&&(l.childLanes&n)!==n&&(l.childLanes|=n),e===a)break;e=e.return}}function Ic(e,n,a,l){var d=e.child;for(d!==null&&(d.return=e);d!==null;){var h=d.dependencies;if(h!==null){var S=d.child;h=h.firstContext;e:for(;h!==null;){var M=h;h=d;for(var F=0;F<n.length;F++)if(M.context===n[F]){h.lanes|=a,M=h.alternate,M!==null&&(M.lanes|=a),es(h.return,a,e),l||(S=null);break e}h=M.next}}else if(d.tag===18){if(S=d.return,S===null)throw Error(o(341));S.lanes|=a,h=S.alternate,h!==null&&(h.lanes|=a),es(S,a,e),S=null}else d.tag===13&&d.memoizedState!==null&&d.memoizedState.dehydrated===null?(d.lanes|=a,S=d.alternate,S!==null&&(S.lanes|=a),es(d.return,a,e),S=d.child,S=S!==null?S.sibling:null):S=d.child;if(S!==null)S.return=d;else for(S=d;S!==null;){if(S===e){S=null;break}if(d=S.sibling,d!==null){d.return=S.return,S=d;break}S=S.return}d=S}}function ja(e,n,a,l){e=null;for(var d=n,h=!1;d!==null;){if(!h){if((d.flags&524288)!==0)h=!0;else if((d.flags&262144)!==0)break}if(d.tag===10){var S=d.alternate;if(S===null)throw Error(o(387));if(S=S.memoizedProps,S!==null){var M=d.type;xn(d.pendingProps.value,S.value)||(e!==null?e.push(M):e=[M])}}else if(d===ie.current){if(S=d.alternate,S===null)throw Error(o(387));S.memoizedState.memoizedState!==d.memoizedState.memoizedState&&(e!==null?e.push(Gr):e=[Gr])}d=d.return}return e!==null&&Ic(n,e,a,l),n.flags|=262144,e!==null}function ts(e){for(e=e.firstContext;e!==null;){if(!xn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function La(e){Oa=e,Ei=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ft(e){return Kp(Oa,e)}function ns(e,n){return Oa===null&&La(e),Kp(e,n)}function Kp(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Ei===null){if(e===null)throw Error(o(308));Ei=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Ei=Ei.next=n;return a}var MS=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},NS=t.unstable_scheduleCallback,DS=t.unstable_NormalPriority,Rt={$$typeof:N,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Hc(){return{controller:new MS,data:new Map,refCount:0}}function To(e){e.refCount--,e.refCount===0&&NS(DS,function(){e.controller.abort()})}function Wp(e,n){if((e.pendingLanes&4194048)!==0){var a=e.transitionTypes;for(a===null&&(a=e.transitionTypes=[]),e=0;e<n.length;e++){var l=n[e];a.indexOf(l)===-1&&a.push(l)}}}var Eo=null;function OS(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var Co=null,Bc=0,za=0,wr=null;function jS(e,n){if(Co===null){var a=Co=[];Bc=0,za=tf(),wr={status:"pending",value:void 0,then:function(l){a.push(l)}}}return Bc++,n.then(eg,eg),n}function eg(){if(--Bc===0&&(Eo=null,Co!==null)){wr!==null&&(wr.status="fulfilled");var e=Co;Co=null,za=0,wr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function LS(e,n){var a=[],l={status:"pending",value:null,reason:null,then:function(d){a.push(d)}};return e.then(function(){l.status="fulfilled",l.value=n;for(var d=0;d<a.length;d++)(0,a[d])(n)},function(d){for(l.status="rejected",l.reason=d,d=0;d<a.length;d++)(0,a[d])(void 0)}),l}var tg=le.S;le.S=function(e,n){if(Yy=pt(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&jS(e,n),Eo!==null)for(var a=Br;a!==null;)Wp(a,Eo),a=a.next;if(a=e.types,a!==null){for(var l=Br;l!==null;)Wp(l,a),l=l.next;if(za!==0){l=Eo,l===null&&(l=Eo=[]);for(var d=0;d<a.length;d++){var h=a[d];l.indexOf(h)===-1&&l.push(h)}}}tg!==null&&tg(e,n)};var _a=ce(null);function qc(){var e=_a.current;return e!==null?e:gt.pooledCache}function is(e,n){n===null?Ne(_a,_a.current):Ne(_a,n.pool)}function ng(){var e=qc();return e===null?null:{parent:Rt._currentValue,pool:e}}var Sr=Error(o(460)),Uc=Error(o(474)),as=Error(o(542)),rs={then:function(){}};function ig(e){return e=e.status,e==="fulfilled"||e==="rejected"}function ag(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(ti,ti),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,og(e),e===void 0&&!("reason"in n)?Error(o(600)):e;default:if(typeof n.status=="string")n.then(ti,ti);else{if(e=gt,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(l){if(n.status==="pending"){var d=n;d.status="fulfilled",d.value=l}},function(l){if(n.status==="pending"){var d=n;d.status="rejected",d.reason=l}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,og(e),e}throw Ha=n,Sr}}function Ia(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Ha=a,Sr):a}}var Ha=null;function rg(){if(Ha===null)throw Error(o(459));var e=Ha;return Ha=null,e}function og(e){if(e===Sr||e===as)throw Error(o(483))}var kr=null,Ro=0;function os(e){var n=Ro;return Ro+=1,kr===null&&(kr=[]),ag(kr,e,n)}function Ji(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function ls(e,n){throw n.$$typeof===I?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function lg(e){function n(Q,G){if(e){var te=Q.deletions;te===null?(Q.deletions=[G],Q.flags|=16):te.push(G)}}function a(Q,G){if(!e)return null;for(;G!==null;)n(Q,G),G=G.sibling;return null}function l(Q){for(var G=new Map;Q!==null;)Q.key===null?G.set(Q.index,Q):G.set(Q.key,Q),Q=Q.sibling;return G}function d(Q,G){return Q=Ai(Q,G),Q.index=0,Q.sibling=null,Q}function h(Q,G,te){return Q.index=te,e?(te=Q.alternate,te!==null?(te=te.index,te<G?(Q.flags|=2,G):te):(Q.flags|=134217730,G)):(Q.flags|=1048576,G)}function S(Q){return e&&Q.alternate===null&&(Q.flags|=134217730),Q}function M(Q,G,te,de){return G===null||G.tag!==6?(G=Dc(te,Q.mode,de),G.return=Q,G):(G=d(G,te),G.return=Q,G)}function F(Q,G,te,de){var Oe=te.type;return Oe===Z?(Q=re(Q,G,te.props.children,de,te.key),Ji(Q,te),Q):G!==null&&(G.elementType===Oe||typeof Oe=="object"&&Oe!==null&&Oe.$$typeof===_&&Ia(Oe)===G.type)?(G=d(G,te.props),Ji(G,te),G.return=Q,G):(G=Zl(te.type,te.key,te.props,null,Q.mode,de),Ji(G,te),G.return=Q,G)}function W(Q,G,te,de){return G===null||G.tag!==4||G.stateNode.containerInfo!==te.containerInfo||G.stateNode.implementation!==te.implementation?(G=Oc(te,Q.mode,de),G.return=Q,G):(G=d(G,te.children||[]),G.return=Q,G)}function re(Q,G,te,de,Oe){return G===null||G.tag!==7?(G=Na(te,Q.mode,de,Oe),G.return=Q,G):(G=d(G,te),G.return=Q,G)}function fe(Q,G,te){if(typeof G=="string"&&G!==""||typeof G=="number"||typeof G=="bigint")return G=Dc(""+G,Q.mode,te),G.return=Q,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case q:return te=Zl(G.type,G.key,G.props,null,Q.mode,te),Ji(te,G),te.return=Q,te;case H:return G=Oc(G,Q.mode,te),G.return=Q,G;case _:return G=Ia(G),fe(Q,G,te)}if(ke(G)||ee(G))return G=Na(G,Q.mode,te,null),G.return=Q,G;if(typeof G.then=="function")return fe(Q,os(G),te);if(G.$$typeof===N)return fe(Q,ns(Q,G),te);ls(Q,G)}return null}function Y(Q,G,te,de){var Oe=G!==null?G.key:null;if(typeof te=="string"&&te!==""||typeof te=="number"||typeof te=="bigint")return Oe!==null?null:M(Q,G,""+te,de);if(typeof te=="object"&&te!==null){switch(te.$$typeof){case q:return te.key===Oe?F(Q,G,te,de):null;case H:return te.key===Oe?W(Q,G,te,de):null;case _:return te=Ia(te),Y(Q,G,te,de)}if(ke(te)||ee(te))return Oe!==null?null:re(Q,G,te,de,null);if(typeof te.then=="function")return Y(Q,G,os(te),de);if(te.$$typeof===N)return Y(Q,G,ns(Q,te),de);ls(Q,te)}return null}function ae(Q,G,te,de,Oe){if(typeof de=="string"&&de!==""||typeof de=="number"||typeof de=="bigint")return Q=Q.get(te)||null,M(G,Q,""+de,Oe);if(typeof de=="object"&&de!==null){switch(de.$$typeof){case q:return Q=Q.get(de.key===null?te:de.key)||null,F(G,Q,de,Oe);case H:return Q=Q.get(de.key===null?te:de.key)||null,W(G,Q,de,Oe);case _:return de=Ia(de),ae(Q,G,te,de,Oe)}if(ke(de)||ee(de))return Q=Q.get(te)||null,re(G,Q,de,Oe,null);if(typeof de.then=="function")return ae(Q,G,te,os(de),Oe);if(de.$$typeof===N)return ae(Q,G,te,ns(G,de),Oe);ls(G,de)}return null}function Te(Q,G,te,de){for(var Oe=null,it=null,Ie=G,Ue=G=0,Dt=null;Ie!==null&&Ue<te.length;Ue++){Ie.index>Ue?(Dt=Ie,Ie=null):Dt=Ie.sibling;var at=Y(Q,Ie,te[Ue],de);if(at===null){Ie===null&&(Ie=Dt);break}e&&Ie&&at.alternate===null&&n(Q,Ie),G=h(at,G,Ue),it===null?Oe=at:it.sibling=at,it=at,Ie=Dt}if(Ue===te.length)return a(Q,Ie),Ke&&Ti(Q,Ue),Oe;if(Ie===null){for(;Ue<te.length;Ue++)Ie=fe(Q,te[Ue],de),Ie!==null&&(G=h(Ie,G,Ue),it===null?Oe=Ie:it.sibling=Ie,it=Ie);return Ke&&Ti(Q,Ue),Oe}for(Ie=l(Ie);Ue<te.length;Ue++)Dt=ae(Ie,Q,Ue,te[Ue],de),Dt!==null&&(e&&(at=Dt.alternate,at!==null&&Ie.delete(at.key===null?Ue:at.key)),G=h(Dt,G,Ue),it===null?Oe=Dt:it.sibling=Dt,it=Dt);return e&&Ie.forEach(function(ha){return n(Q,ha)}),Ke&&Ti(Q,Ue),Oe}function _e(Q,G,te,de){if(te==null)throw Error(o(151));for(var Oe=null,it=null,Ie=G,Ue=G=0,Dt=null,at=te.next();Ie!==null&&!at.done;Ue++,at=te.next()){Ie.index>Ue?(Dt=Ie,Ie=null):Dt=Ie.sibling;var ha=Y(Q,Ie,at.value,de);if(ha===null){Ie===null&&(Ie=Dt);break}e&&Ie&&ha.alternate===null&&n(Q,Ie),G=h(ha,G,Ue),it===null?Oe=ha:it.sibling=ha,it=ha,Ie=Dt}if(at.done)return a(Q,Ie),Ke&&Ti(Q,Ue),Oe;if(Ie===null){for(;!at.done;Ue++,at=te.next())at=fe(Q,at.value,de),at!==null&&(G=h(at,G,Ue),it===null?Oe=at:it.sibling=at,it=at);return Ke&&Ti(Q,Ue),Oe}for(Ie=l(Ie);!at.done;Ue++,at=te.next())at=ae(Ie,Q,Ue,at.value,de),at!==null&&(e&&(Dt=at.alternate,Dt!==null&&Ie.delete(Dt.key===null?Ue:Dt.key)),G=h(at,G,Ue),it===null?Oe=at:it.sibling=at,it=at);return e&&Ie.forEach(function(mA){return n(Q,mA)}),Ke&&Ti(Q,Ue),Oe}function Ze(Q,G,te,de){if(typeof te=="object"&&te!==null&&te.type===Z&&te.key===null&&te.props.ref===void 0&&(te=te.props.children),typeof te=="object"&&te!==null){switch(te.$$typeof){case q:e:{for(var Oe=te.key;G!==null;){if(G.key===Oe){if(Oe=te.type,Oe===Z){if(G.tag===7){a(Q,G.sibling),de=d(G,te.props.children),Ji(de,te),de.return=Q,Q=de;break e}}else if(G.elementType===Oe||typeof Oe=="object"&&Oe!==null&&Oe.$$typeof===_&&Ia(Oe)===G.type){a(Q,G.sibling),de=d(G,te.props),Ji(de,te),de.return=Q,Q=de;break e}a(Q,G);break}else n(Q,G);G=G.sibling}te.type===Z?(de=Na(te.props.children,Q.mode,de,te.key),Ji(de,te),de.return=Q,Q=de):(de=Zl(te.type,te.key,te.props,null,Q.mode,de),Ji(de,te),de.return=Q,Q=de)}return S(Q);case H:e:{for(Oe=te.key;G!==null;){if(G.key===Oe)if(G.tag===4&&G.stateNode.containerInfo===te.containerInfo&&G.stateNode.implementation===te.implementation){a(Q,G.sibling),de=d(G,te.children||[]),de.return=Q,Q=de;break e}else{a(Q,G);break}else n(Q,G);G=G.sibling}de=Oc(te,Q.mode,de),de.return=Q,Q=de}return S(Q);case _:return te=Ia(te),Ze(Q,G,te,de)}if(ke(te))return Te(Q,G,te,de);if(ee(te)){if(Oe=ee(te),typeof Oe!="function")throw Error(o(150));return te=Oe.call(te),_e(Q,G,te,de)}if(typeof te.then=="function")return Ze(Q,G,os(te),de);if(te.$$typeof===N)return Ze(Q,G,ns(Q,te),de);ls(Q,te)}return typeof te=="string"&&te!==""||typeof te=="number"||typeof te=="bigint"?(te=""+te,G!==null&&G.tag===6?(a(Q,G.sibling),de=d(G,te),de.return=Q,Q=de):(a(Q,G),de=Dc(te,Q.mode,de),de.return=Q,Q=de),S(Q)):a(Q,G)}return function(Q,G,te,de){try{Ro=0;var Oe=Ze(Q,G,te,de);return kr=null,Oe}catch(Ie){if(Ie===Sr||Ie===as)throw Ie;var it=ln(29,Ie,null,Q.mode);return it.lanes=de,it.return=Q,it}}}var Ba=lg(!0),sg=lg(!1),Xi=!1;function Fc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Pc(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Zi(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Qi(e,n,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(ot&2)!==0){var d=l.pending;return d===null?n.next=n:(n.next=d.next,d.next=n),l.pending=n,n=Xl(e),Gp(e,null,a),n}return Jl(e,l,n,a),Xl(e)}function Mo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var l=n.lanes;l&=e.pendingLanes,a|=l,n.lanes=a,Xm(e,a)}}function Vc(e,n){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var d=null,h=null;if(a=a.firstBaseUpdate,a!==null){do{var S={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};h===null?d=h=S:h=h.next=S,a=a.next}while(a!==null);h===null?d=h=n:h=h.next=n}else d=h=n;a={baseState:l.baseState,firstBaseUpdate:d,lastBaseUpdate:h,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var Gc=!1;function No(){if(Gc){var e=wr;if(e!==null)throw e}}function Do(e,n,a,l){Gc=!1;var d=e.updateQueue;Xi=!1;var h=d.firstBaseUpdate,S=d.lastBaseUpdate,M=d.shared.pending;if(M!==null){d.shared.pending=null;var F=M,W=F.next;F.next=null,S===null?h=W:S.next=W,S=F;var re=e.alternate;re!==null&&(re=re.updateQueue,M=re.lastBaseUpdate,M!==S&&(M===null?re.firstBaseUpdate=W:M.next=W,re.lastBaseUpdate=F))}if(h!==null){var fe=d.baseState;S=0,re=W=F=null,M=h;do{var Y=M.lane&-536870913,ae=Y!==M.lane;if(ae?(nt&Y)===Y:(l&Y)===Y){Y!==0&&Y===za&&(Gc=!0),re!==null&&(re=re.next={lane:0,tag:M.tag,payload:M.payload,callback:null,next:null});e:{var Te=e,_e=M;Y=n;var Ze=a;switch(_e.tag){case 1:if(Te=_e.payload,typeof Te=="function"){fe=Te.call(Ze,fe,Y);break e}fe=Te;break e;case 3:Te.flags=Te.flags&-65537|128;case 0:if(Te=_e.payload,Y=typeof Te=="function"?Te.call(Ze,fe,Y):Te,Y==null)break e;fe=L({},fe,Y);break e;case 2:Xi=!0}}Y=M.callback,Y!==null&&(e.flags|=64,ae&&(e.flags|=8192),ae=d.callbacks,ae===null?d.callbacks=[Y]:ae.push(Y))}else ae={lane:Y,tag:M.tag,payload:M.payload,callback:M.callback,next:null},re===null?(W=re=ae,F=fe):re=re.next=ae,S|=Y;if(M=M.next,M===null){if(M=d.shared.pending,M===null)break;ae=M,M=ae.next,ae.next=null,d.lastBaseUpdate=ae,d.shared.pending=null}}while(!0);re===null&&(F=fe),d.baseState=F,d.firstBaseUpdate=W,d.lastBaseUpdate=re,h===null&&(d.shared.lanes=0),aa|=S,e.lanes=S,e.memoizedState=fe}}function ug(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function cg(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)ug(a[e],n)}var Ki=ce(null),ss=ce(0);function dg(e,n){e=Oi,Ne(ss,e),Ne(Ki,n),Oi=e|n.baseLanes}function $c(){Ne(ss,Oi),Ne(Ki,Ki.current)}function Yc(){Oi=ss.current,xe(Ki),xe(ss)}var Pt=ce(null),Xt=null;function Wi(e){var n=e.alternate;Ne(Vt,Vt.current&1),Ne(Pt,e),Xt===null&&(n===null||Ki.current!==null||n.memoizedState!==null)&&(Xt=e)}function Jc(e){Ne(Vt,Vt.current),Ne(Pt,e),Xt===null&&(Xt=e)}function fg(e){e.tag===22?(Ne(Vt,Vt.current),Ne(Pt,e),Xt===null&&(Xt=e)):ea()}function ea(){Ne(Vt,Vt.current),Ne(Pt,Pt.current)}function wn(e){xe(Pt),Xt===e&&(Xt=null),xe(Vt)}var Vt=ce(0);function Oo(e,n){Ne(Pt,Pt.current),Ne(Vt,n)}function Xc(e){xe(Vt),xe(Pt),Xt===e&&(Xt=null)}function us(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||bf(a)||vf(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Ri=0,Xe=null,mt=null,Mt=null,cs=!1,Ar=!1,qa=!1,ds=0,jo=0,Tr=null,zS=0;function At(){throw Error(o(321))}function Zc(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!xn(e[a],n[a]))return!1;return!0}function Qc(e,n,a,l,d,h){return Ri=h,Xe=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,le.H=e===null||e.memoizedState===null?Xg:Zg,qa=!1,h=a(l,d),qa=!1,Ar&&(h=mg(n,a,l,d)),hg(e),h}function hg(e){le.H=bs;var n=mt!==null&&mt.next!==null;if(Ri=0,Mt=mt=Xe=null,cs=!1,jo=0,Tr=null,n)throw Error(o(300));e===null||Nt||(e=e.dependencies,e!==null&&ts(e)&&(Nt=!0))}function mg(e,n,a,l){Xe=e;var d=0;do{if(Ar&&(Tr=null),jo=0,Ar=!1,25<=d)throw Error(o(301));if(d+=1,Mt=mt=null,e.updateQueue!=null){var h=e.updateQueue;h.lastEffect=null,h.events=null,h.stores=null,h.memoCache!=null&&(h.memoCache.index=0)}le.H=PS,h=n(a,l)}while(Ar);return h}function _S(){var e=le.H,n=e.useState()[0];return n=typeof n.then=="function"?Lo(n):n,e=e.useState()[0],(mt!==null?mt.memoizedState:null)!==e&&(Xe.flags|=1024),n}function Kc(){var e=ds!==0;return ds=0,e}function Wc(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function ed(e){if(cs){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}cs=!1}Ri=0,Mt=mt=Xe=null,Ar=!1,jo=ds=0,Tr=null}function en(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Mt===null?Xe.memoizedState=Mt=e:Mt=Mt.next=e,Mt}function Et(){if(mt===null){var e=Xe.alternate;e=e!==null?e.memoizedState:null}else e=mt.next;var n=Mt===null?Xe.memoizedState:Mt.next;if(n!==null)Mt=n,mt=e;else{if(e===null)throw Xe.alternate===null?Error(o(467)):Error(o(310));mt=e,e={memoizedState:mt.memoizedState,baseState:mt.baseState,baseQueue:mt.baseQueue,queue:mt.queue,next:null},Mt===null?Xe.memoizedState=Mt=e:Mt=Mt.next=e}return Mt}function fs(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Lo(e){var n=jo;return jo+=1,Tr===null&&(Tr=[]),e=ag(Tr,e,n),n=Xe,(Mt===null?n.memoizedState:Mt.next)===null&&(n=n.alternate,le.H=n===null||n.memoizedState===null?Xg:Zg),e}function hs(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Lo(e);if(e.$$typeof===ne)return;if(e.$$typeof===N)return Ft(e)}throw Error(o(438,String(e)))}function td(e){var n=null,a=Xe.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var l=Xe.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(n={data:l.data.map(function(d){return d.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=fs(),Xe.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),l=0;l<e;l++)a[l]=B;return n.index++,a}function Mi(e,n){return typeof n=="function"?n(e):n}function ms(e){var n=Et();return nd(n,mt,e)}function nd(e,n,a){var l=e.queue;if(l===null)throw Error(o(311));l.lastRenderedReducer=a;var d=e.baseQueue,h=l.pending;if(h!==null){if(d!==null){var S=d.next;d.next=h.next,h.next=S}n.baseQueue=d=h,l.pending=null}if(h=e.baseState,d===null)e.memoizedState=h;else{n=d.next;var M=S=null,F=null,W=n,re=!1;do{var fe=W.lane&-536870913;if(fe!==W.lane?(nt&fe)===fe:(Ri&fe)===fe){var Y=W.revertLane;if(Y===0)F!==null&&(F=F.next={lane:0,revertLane:0,gesture:null,action:W.action,hasEagerState:W.hasEagerState,eagerState:W.eagerState,next:null}),fe===za&&(re=!0);else if((Ri&Y)===Y){W=W.next,Y===za&&(re=!0);continue}else fe={lane:0,revertLane:W.revertLane,gesture:null,action:W.action,hasEagerState:W.hasEagerState,eagerState:W.eagerState,next:null},F===null?(M=F=fe,S=h):F=F.next=fe,Xe.lanes|=Y,aa|=Y;fe=W.action,qa&&a(h,fe),h=W.hasEagerState?W.eagerState:a(h,fe)}else Y={lane:fe,revertLane:W.revertLane,gesture:W.gesture,action:W.action,hasEagerState:W.hasEagerState,eagerState:W.eagerState,next:null},F===null?(M=F=Y,S=h):F=F.next=Y,Xe.lanes|=fe,aa|=fe;W=W.next}while(W!==null&&W!==n);if(F===null?S=h:F.next=M,!xn(h,e.memoizedState)&&(Nt=!0,re&&(a=wr,a!==null)))throw a;e.memoizedState=h,e.baseState=S,e.baseQueue=F,l.lastRenderedState=h}return d===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function id(e){var n=Et(),a=n.queue;if(a===null)throw Error(o(311));a.lastRenderedReducer=e;var l=a.dispatch,d=a.pending,h=n.memoizedState;if(d!==null){a.pending=null;var S=d=d.next;do h=e(h,S.action),S=S.next;while(S!==d);xn(h,n.memoizedState)||(Nt=!0),n.memoizedState=h,n.baseQueue===null&&(n.baseState=h),a.lastRenderedState=h}return[h,l]}function pg(e,n,a){var l=Xe,d=Et(),h=Ke;if(h){if(a===void 0)throw Error(o(407));a=a()}else a=n();var S=!xn((mt||d).memoizedState,a);if(S&&(d.memoizedState=a,Nt=!0),d=d.queue,od(bg.bind(null,l,d,e),[e]),e=d.getSnapshot!==n||S||Mt!==null&&(Mt.memoizedState.tag&1)!==0,Er(e?9:8,{destroy:void 0},yg.bind(null,l,d,a,n),null),e){if(l.flags|=2048,gt===null)throw Error(o(349));h||(Ri&127)!==0||gg(l,n,a)}return a}function gg(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=Xe.updateQueue,n===null?(n=fs(),Xe.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function yg(e,n,a,l){n.value=a,n.getSnapshot=l,vg(n)&&xg(e)}function bg(e,n,a){return a(function(){vg(n)&&xg(e)})}function vg(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!xn(e,a)}catch{return!0}}function xg(e){var n=Ma(e,2);n!==null&&dn(n,e,2)}function ad(e){var n=en();if(typeof e=="function"){var a=e;if(e=a(),qa){Ui(!0);try{a()}finally{Ui(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mi,lastRenderedState:e},n}function wg(e,n,a,l){return e.baseState=a,nd(e,mt,typeof l=="function"?l:Mi)}function IS(e,n,a,l,d){if(ys(e))throw Error(o(485));if(e=n.action,e!==null){var h={payload:d,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(S){h.listeners.push(S)}};le.T!==null?a(!0):h.isTransition=!1,l(h),a=n.pending,a===null?(h.next=n.pending=h,Sg(n,h)):(h.next=a.next,n.pending=a.next=h)}}function Sg(e,n){var a=n.action,l=n.payload,d=e.state;if(n.isTransition){var h=le.T,S={};S.types=h!==null?h.types:null,le.T=S;try{var M=a(d,l),F=le.S;F!==null&&F(S,M),kg(e,n,M)}catch(W){rd(e,n,W)}finally{h!==null&&S.types!==null&&(h.types=S.types),le.T=h}}else try{h=a(d,l),kg(e,n,h)}catch(W){rd(e,n,W)}}function kg(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Ag(e,n,l)},function(l){return rd(e,n,l)}):Ag(e,n,a)}function Ag(e,n,a){n.status="fulfilled",n.value=a,Tg(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,Sg(e,a)))}function rd(e,n,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do n.status="rejected",n.reason=a,Tg(n),n=n.next;while(n!==l)}e.action=null}function Tg(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function Eg(e,n){return n}function Cg(e,n){if(Ke){var a=gt.formState;if(a!==null){e:{var l=Xe;if(Ke){if(bt){t:{for(var d=bt,h=_n;d.nodeType!==8;){if(!h){d=null;break t}if(d=Hn(d.nextSibling),d===null){d=null;break t}}h=d.data,d=h==="F!"||h==="F"?d:null}if(d){bt=Hn(d.nextSibling),l=d.data==="F!";break e}}$i(l)}l=!1}l&&(n=a[0])}}return a=en(),a.memoizedState=a.baseState=n,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Eg,lastRenderedState:n},a.queue=l,a=$g.bind(null,Xe,l),l.dispatch=a,l=ad(!1),h=dd.bind(null,Xe,!1,l.queue),l=en(),d={state:n,dispatch:null,action:e,pending:null},l.queue=d,a=IS.bind(null,Xe,d,h,a),d.dispatch=a,l.memoizedState=e,[n,a,!1]}function Rg(e){var n=Et();return Mg(n,mt,e)}function Mg(e,n,a){if(n=nd(e,n,Eg)[0],e=ms(Mi)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var l=Lo(n)}catch(S){throw S===Sr?as:S}else l=n;n=Et();var d=n.queue,h=d.dispatch;return a!==n.memoizedState&&(Xe.flags|=2048,Er(9,{destroy:void 0},HS.bind(null,d,a),null)),[l,h,e]}function HS(e,n){e.action=n}function Ng(e){var n=Et(),a=mt;if(a!==null)return Mg(n,a,e);Et(),n=n.memoizedState,a=Et();var l=a.queue.dispatch;return a.memoizedState=e,[n,l,!1]}function Er(e,n,a,l){return e={tag:e,create:a,deps:l,inst:n,next:null},n=Xe.updateQueue,n===null&&(n=fs(),Xe.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,n.lastEffect=e),e}function Dg(){return Et().memoizedState}function ps(e,n,a,l){var d=en();Xe.flags|=e,d.memoizedState=Er(1|n,{destroy:void 0},a,l===void 0?null:l)}function gs(e,n,a,l){var d=Et();l=l===void 0?null:l;var h=d.memoizedState.inst;mt!==null&&l!==null&&Zc(l,mt.memoizedState.deps)?d.memoizedState=Er(n,h,a,l):(Xe.flags|=e,d.memoizedState=Er(1|n,h,a,l))}function Og(e,n){ps(8390656,8,e,n)}function od(e,n){gs(2048,8,e,n)}function BS(e){Xe.flags|=4;var n=Xe.updateQueue;if(n===null)n=fs(),Xe.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function jg(e){var n=Et().memoizedState;return BS({ref:n,nextImpl:e}),function(){if((ot&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}function Lg(e,n){return gs(4,2,e,n)}function zg(e,n){return gs(4,4,e,n)}function _g(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Ig(e,n,a){a=a!=null?a.concat([e]):null,gs(4,4,_g.bind(null,n,e),a)}function ld(){}function Hg(e,n){var a=Et();n=n===void 0?null:n;var l=a.memoizedState;return n!==null&&Zc(n,l[1])?l[0]:(a.memoizedState=[e,n],e)}function Bg(e,n){var a=Et();n=n===void 0?null:n;var l=a.memoizedState;if(n!==null&&Zc(n,l[1]))return l[0];if(l=e(),qa){Ui(!0);try{e()}finally{Ui(!1)}}return a.memoizedState=[l,n],l}function sd(e,n,a){return a===void 0||(Ri&1073741824)!==0&&(nt&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Xy(),Xe.lanes|=e,aa|=e,a)}function qg(e,n,a,l){return xn(a,n)?a:Ki.current!==null?(e=sd(e,a,l),xn(e,n)||(Nt=!0),e):(Ri&106)===0||(Ri&1073741824)!==0&&(nt&261930)===0?(Nt=!0,e.memoizedState=a):(e=Xy(),Xe.lanes|=e,aa|=e,n)}function Ug(e,n,a,l,d){var h=se.p;se.p=h!==0&&8>h?h:8;var S=le.T,M={};M.types=S!==null?S.types:null,le.T=M,dd(e,!1,n,a);try{var F=d(),W=le.S;if(W!==null&&W(M,F),F!==null&&typeof F=="object"&&typeof F.then=="function"){var re=LS(F,l);zo(e,n,re,Tn(e))}else zo(e,n,l,Tn(e))}catch(fe){zo(e,n,{then:function(){},status:"rejected",reason:fe},Tn())}finally{se.p=h,S!==null&&M.types!==null&&(S.types=M.types),le.T=S}}function qS(){}function ud(e,n,a,l){if(e.tag!==5)throw Error(o(476));var d=Fg(e).queue;Ug(e,d,n,ve,a===null?qS:function(){return Pg(e),a(l)})}function Fg(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:ve,baseState:ve,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mi,lastRenderedState:ve},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mi,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function Pg(e){var n=Fg(e);n.next===null&&(n=e.alternate.memoizedState),zo(e,n.next.queue,{},Tn())}function cd(){return Ft(Gr)}function Vg(){return Et().memoizedState}function Gg(){return Et().memoizedState}function US(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=Tn();e=Zi(a);var l=Qi(n,e,a);l!==null&&(dn(l,n,a),Mo(l,n,a)),n={cache:Hc()},e.payload=n;return}n=n.return}}function FS(e,n,a){var l=Tn();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},ys(e)?Yg(n,a):(a=Mc(e,n,a,l),a!==null&&(dn(a,e,l),Jg(a,n,l)))}function $g(e,n,a){var l=Tn();zo(e,n,a,l)}function zo(e,n,a,l){var d={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(ys(e))Yg(n,d);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=n.lastRenderedReducer,h!==null))try{var S=n.lastRenderedState,M=h(S,a);if(d.hasEagerState=!0,d.eagerState=M,xn(M,S))return Jl(e,n,d,0),gt===null&&Yl(),!1}catch{}if(a=Mc(e,n,d,l),a!==null)return dn(a,e,l),Jg(a,n,l),!0}return!1}function dd(e,n,a,l){if(l={lane:2,revertLane:tf(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},ys(e)){if(n)throw Error(o(479))}else n=Mc(e,a,l,2),n!==null&&dn(n,e,2)}function ys(e){var n=e.alternate;return e===Xe||n!==null&&n===Xe}function Yg(e,n){Ar=cs=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function Jg(e,n,a){if((a&4194048)!==0){var l=n.lanes;l&=e.pendingLanes,a|=l,n.lanes=a,Xm(e,a)}}var bs={readContext:Ft,use:hs,useCallback:At,useContext:At,useEffect:At,useImperativeHandle:At,useLayoutEffect:At,useInsertionEffect:At,useMemo:At,useReducer:At,useRef:At,useState:At,useDebugValue:At,useDeferredValue:At,useTransition:At,useSyncExternalStore:At,useId:At,useHostTransitionStatus:At,useFormState:At,useActionState:At,useOptimistic:At,useMemoCache:At,useCacheRefresh:At,useEffectEvent:At},Xg={readContext:Ft,use:hs,useCallback:function(e,n){return en().memoizedState=[e,n===void 0?null:n],e},useContext:Ft,useEffect:Og,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,ps(4194308,4,_g.bind(null,n,e),a)},useLayoutEffect:function(e,n){return ps(4194308,4,e,n)},useInsertionEffect:function(e,n){ps(4,2,e,n)},useMemo:function(e,n){var a=en();n=n===void 0?null:n;var l=e();if(qa){Ui(!0);try{e()}finally{Ui(!1)}}return a.memoizedState=[l,n],l},useReducer:function(e,n,a){var l=en();if(a!==void 0){var d=a(n);if(qa){Ui(!0);try{a(n)}finally{Ui(!1)}}}else d=n;return l.memoizedState=l.baseState=d,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:d},l.queue=e,e=e.dispatch=FS.bind(null,Xe,e),[l.memoizedState,e]},useRef:function(e){var n=en();return e={current:e},n.memoizedState=e},useState:function(e){e=ad(e);var n=e.queue,a=$g.bind(null,Xe,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:ld,useDeferredValue:function(e,n){var a=en();return sd(a,e,n)},useTransition:function(){var e=ad(!1);return e=Ug.bind(null,Xe,e.queue,!0,!1),en().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var l=Xe,d=en();if(Ke){if(a===void 0)throw Error(o(407));a=a()}else{if(a=n(),gt===null)throw Error(o(349));(nt&127)!==0||gg(l,n,a)}d.memoizedState=a;var h={value:a,getSnapshot:n};return d.queue=h,Og(bg.bind(null,l,h,e),[e]),l.flags|=2048,Er(9,{destroy:void 0},yg.bind(null,l,h,a,n),null),a},useId:function(){var e=en(),n=gt.identifierPrefix;if(Ke){var a=ii,l=ni;a=(l&~(1<<32-bn(l)-1)).toString(32)+a,n="_"+n+"R_"+a,a=ds++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=zS++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:cd,useFormState:Cg,useActionState:Cg,useOptimistic:function(e){var n=en();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=dd.bind(null,Xe,!0,a),a.dispatch=n,[e,n]},useMemoCache:td,useCacheRefresh:function(){return en().memoizedState=US.bind(null,Xe)},useEffectEvent:function(e){var n=en(),a={impl:e};return n.memoizedState=a,function(){if((ot&2)!==0)throw Error(o(440));return a.impl.apply(void 0,arguments)}}},Zg={readContext:Ft,use:hs,useCallback:Hg,useContext:Ft,useEffect:od,useImperativeHandle:Ig,useInsertionEffect:Lg,useLayoutEffect:zg,useMemo:Bg,useReducer:ms,useRef:Dg,useState:function(){return ms(Mi)},useDebugValue:ld,useDeferredValue:function(e,n){var a=Et();return qg(a,mt.memoizedState,e,n)},useTransition:function(){var e=ms(Mi)[0],n=Et().memoizedState;return[typeof e=="boolean"?e:Lo(e),n]},useSyncExternalStore:pg,useId:Vg,useHostTransitionStatus:cd,useFormState:Rg,useActionState:Rg,useOptimistic:function(e,n){var a=Et();return wg(a,mt,e,n)},useMemoCache:td,useCacheRefresh:Gg,useEffectEvent:jg},PS={readContext:Ft,use:hs,useCallback:Hg,useContext:Ft,useEffect:od,useImperativeHandle:Ig,useInsertionEffect:Lg,useLayoutEffect:zg,useMemo:Bg,useReducer:id,useRef:Dg,useState:function(){return id(Mi)},useDebugValue:ld,useDeferredValue:function(e,n){var a=Et();return mt===null?sd(a,e,n):qg(a,mt.memoizedState,e,n)},useTransition:function(){var e=id(Mi)[0],n=Et().memoizedState;return[typeof e=="boolean"?e:Lo(e),n]},useSyncExternalStore:pg,useId:Vg,useHostTransitionStatus:cd,useFormState:Ng,useActionState:Ng,useOptimistic:function(e,n){var a=Et();return mt!==null?wg(a,mt,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:td,useCacheRefresh:Gg,useEffectEvent:jg};function fd(e,n,a,l){n=e.memoizedState,a=a(l,n),a=a==null?n:L({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var hd={enqueueSetState:function(e,n,a){e=e._reactInternals;var l=Tn(),d=Zi(l);d.payload=n,a!=null&&(d.callback=a),n=Qi(e,d,l),n!==null&&(dn(n,e,l),Mo(n,e,l))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var l=Tn(),d=Zi(l);d.tag=1,d.payload=n,a!=null&&(d.callback=a),n=Qi(e,d,l),n!==null&&(dn(n,e,l),Mo(n,e,l))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=Tn(),l=Zi(a);l.tag=2,n!=null&&(l.callback=n),n=Qi(e,l,a),n!==null&&(dn(n,e,a),Mo(n,e,a))}};function Qg(e,n,a,l,d,h,S){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,h,S):n.prototype&&n.prototype.isPureReactComponent?!wo(a,l)||!wo(d,h):!0}function Kg(e,n,a,l){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,l),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,l),n.state!==e&&hd.enqueueReplaceState(n,n.state,null)}function Ua(e,n){var a=n;if("ref"in n){a={};for(var l in n)l!=="ref"&&(a[l]=n[l])}if(e=e.defaultProps){a===n&&(a=L({},a));for(var d in e)a[d]===void 0&&(a[d]=e[d])}return a}function Wg(e){$l(e)}function ey(e){console.error(e)}function ty(e){$l(e)}function vs(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(l){setTimeout(function(){throw l})}}function ny(e,n,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(d){setTimeout(function(){throw d})}}function md(e,n,a){return a=Zi(a),a.tag=3,a.payload={element:null},a.callback=function(){vs(e,n)},a}function iy(e){return e=Zi(e),e.tag=3,e}function ay(e,n,a,l){var d=a.type.getDerivedStateFromError;if(typeof d=="function"){var h=l.value;e.payload=function(){return d(h)},e.callback=function(){ny(n,a,l)}}var S=a.stateNode;S!==null&&typeof S.componentDidCatch=="function"&&(e.callback=function(){ny(n,a,l),typeof d!="function"&&(ra===null?ra=new Set([this]):ra.add(this));var M=l.stack;this.componentDidCatch(l.value,{componentStack:M!==null?M:""})})}function VS(e,n,a,l,d){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(n=a.alternate,n!==null&&ja(n,a,d,!0),a=Pt.current,a!==null){switch(a.tag){case 31:case 13:case 19:return Xt===null?qs():a.alternate===null&&Tt===0&&(Tt=3),a.flags&=-257,a.flags|=65536,a.lanes=d,l===rs?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([l]):n.add(l),Kd(e,l,d)),!1;case 22:return a.flags|=65536,l===rs?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([l]):a.add(l)),Kd(e,l,d)),!1}throw Error(o(435,a.tag))}return Kd(e,l,d),qs(),!1}if(Ke)return n=Pt.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=d,l!==Lc&&(e=Error(o(422),{cause:l}),Ao(jn(e,a)))):(l!==Lc&&(n=Error(o(423),{cause:l}),Ao(jn(n,a))),e=e.current.alternate,e.flags|=65536,d&=-d,e.lanes|=d,l=jn(l,a),d=md(e.stateNode,l,d),Vc(e,d),Tt!==4&&(Tt=2)),!1;var h=Error(o(520),{cause:l});if(h=jn(h,a),Po===null?Po=[h]:Po.push(h),Tt!==4&&(Tt=2),n===null)return!0;l=jn(l,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=d&-d,a.lanes|=e,e=md(a.stateNode,l,e),Vc(a,e),!1;case 1:if(n=a.type,h=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(ra===null||!ra.has(h))))return a.flags|=65536,d&=-d,a.lanes|=d,d=iy(d),ay(d,e,a,l),Vc(a,d),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var pd=Error(o(461)),Nt=!1;function Lt(e,n,a,l){n.child=e===null?sg(n,null,a,l):Ba(n,e.child,a,l)}function ry(e,n,a,l,d){a=a.render;var h=n.ref;if("ref"in l){var S={};for(var M in l)M!=="ref"&&(S[M]=l[M])}else S=l;return La(n),l=Qc(e,n,a,S,h,d),M=Kc(),e!==null&&!Nt?(Wc(e,n,d),Ni(e,n,d)):(Ke&&M&&Kl(n),n.flags|=1,Lt(e,n,l,d),n.child)}function oy(e,n,a,l,d){if(e===null){var h=a.type;return typeof h=="function"&&!Nc(h)&&h.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=h,ly(e,n,h,l,d)):(e=Zl(a.type,null,l,n,n.mode,d),e.ref=n.ref,e.return=n,n.child=e)}if(h=e.child,!kd(e,d)){var S=h.memoizedProps;if(a=a.compare,a=a!==null?a:wo,a(S,l)&&e.ref===n.ref)return Ni(e,n,d)}return n.flags|=1,e=Ai(h,l),e.ref=n.ref,e.return=n,n.child=e}function ly(e,n,a,l,d){if(e!==null){var h=e.memoizedProps;if(wo(h,l)&&e.ref===n.ref)if(Nt=!1,n.pendingProps=l=h,kd(e,d))(e.flags&131072)!==0&&(Nt=!0);else return n.lanes=e.lanes,Ni(e,n,d)}return gd(e,n,a,l,d)}function sy(e,n,a,l){var d=l.children,h=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((n.flags&128)!==0){if(h=h!==null?h.baseLanes|a:a,e!==null){for(l=n.child=e.child,d=0;l!==null;)d=d|l.lanes|l.childLanes,l=l.sibling;l=d&~h}else l=0,n.child=null;return uy(e,n,h,a,l)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&is(n,h!==null?h.cachePool:null),h!==null?dg(n,h):$c(),fg(n);else return l=n.lanes=536870912,uy(e,n,h!==null?h.baseLanes|a:a,a,l)}else h!==null?(is(n,h.cachePool),dg(n,h),ea(),n.memoizedState=null):(e!==null&&is(n,null),$c(),ea());return Lt(e,n,d,a),n.child}function _o(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function uy(e,n,a,l,d){var h=qc();return h=h===null?null:{parent:Rt._currentValue,pool:h},n.memoizedState={baseLanes:a,cachePool:h},e!==null&&is(n,null),$c(),fg(n),e!==null&&ja(e,n,l,!0),n.childLanes=d,null}function xs(e,n){return n=ws({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function cy(e,n,a){return Ba(n,e.child,null,a),e=xs(n,n.pendingProps),e.flags|=2,wn(n),n.memoizedState=null,e}function GS(e,n,a){var l=n.pendingProps,d=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(Ke){if(l.mode==="hidden")return e=xs(n,l),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},_o(null,e);if(Jc(n),(e=bt)?(e=_b(e,_n),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Vi!==null?{id:ni,overflow:ii}:null,retryLane:536870912,hydrationErrors:null},a=Yp(e),a.return=n,n.child=a,Ht=n,bt=null)):e=null,e===null)throw $i(n);return n.lanes=536870912,null}return xs(n,l)}var h=e.memoizedState;if(h!==null){var S=h.dehydrated;if(Jc(n),d)if(n.flags&256)n.flags&=-257,n=cy(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(o(558));else if(Nt||ja(e,n,a,!1),d=(a&e.childLanes)!==0,Nt||d){if(Ki.current===null){if(l=gt,l!==null&&(S=Zm(l,a),S!==0&&S!==h.retryLane))throw h.retryLane=S,Ma(e,S),dn(l,e,S),pd;qs()}n=cy(e,n,a)}else e=h.treeContext,bt=Hn(S.nextSibling),Ht=n,Ke=!0,Gi=null,_n=!1,e!==null&&Zp(n,e),n=xs(n,l),n.flags|=134221824;return n}return e=Ai(e.child,{mode:l.mode,children:l.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Cr(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(o(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function gd(e,n,a,l,d){return La(n),a=Qc(e,n,a,l,void 0,d),l=Kc(),e!==null&&!Nt?(Wc(e,n,d),Ni(e,n,d)):(Ke&&l&&Kl(n),n.flags|=1,Lt(e,n,a,d),n.child)}function dy(e,n,a,l,d,h){return La(n),n.updateQueue=null,a=mg(n,l,a,d),hg(e),l=Kc(),e!==null&&!Nt?(Wc(e,n,h),Ni(e,n,h)):(Ke&&l&&Kl(n),n.flags|=1,Lt(e,n,a,h),n.child)}function fy(e,n,a,l,d){if(La(n),n.stateNode===null){var h=yr,S=a.contextType;typeof S=="object"&&S!==null&&(h=Ft(S)),h=new a(l,h),n.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,h.updater=hd,n.stateNode=h,h._reactInternals=n,h=n.stateNode,h.props=l,h.state=n.memoizedState,h.refs={},Fc(n),S=a.contextType,h.context=typeof S=="object"&&S!==null?Ft(S):yr,h.state=n.memoizedState,S=a.getDerivedStateFromProps,typeof S=="function"&&(fd(n,a,S,l),h.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(S=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),S!==h.state&&hd.enqueueReplaceState(h,h.state,null),Do(n,l,h,d),No(),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308),l=!0}else if(e===null){h=n.stateNode;var M=n.memoizedProps,F=Ua(a,M);h.props=F;var W=h.context,re=a.contextType;S=yr,typeof re=="object"&&re!==null&&(S=Ft(re));var fe=a.getDerivedStateFromProps;re=typeof fe=="function"||typeof h.getSnapshotBeforeUpdate=="function",M=n.pendingProps!==M,re||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(M||W!==S)&&Kg(n,h,l,S),Xi=!1;var Y=n.memoizedState;h.state=Y,Do(n,l,h,d),No(),W=n.memoizedState,M||Y!==W||Xi?(typeof fe=="function"&&(fd(n,a,fe,l),W=n.memoizedState),(F=Xi||Qg(n,a,F,l,Y,W,S))?(re||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount()),typeof h.componentDidMount=="function"&&(n.flags|=4194308)):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=l,n.memoizedState=W),h.props=l,h.state=W,h.context=S,l=F):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),l=!1)}else{h=n.stateNode,Pc(e,n),S=n.memoizedProps,re=Ua(a,S),h.props=re,fe=n.pendingProps,Y=h.context,W=a.contextType,F=yr,typeof W=="object"&&W!==null&&(F=Ft(W)),M=a.getDerivedStateFromProps,(W=typeof M=="function"||typeof h.getSnapshotBeforeUpdate=="function")||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(S!==fe||Y!==F)&&Kg(n,h,l,F),Xi=!1,Y=n.memoizedState,h.state=Y,Do(n,l,h,d),No();var ae=n.memoizedState;S!==fe||Y!==ae||Xi||e!==null&&e.dependencies!==null&&ts(e.dependencies)?(typeof M=="function"&&(fd(n,a,M,l),ae=n.memoizedState),(re=Xi||Qg(n,a,re,l,Y,ae,F)||e!==null&&e.dependencies!==null&&ts(e.dependencies))?(W||typeof h.UNSAFE_componentWillUpdate!="function"&&typeof h.componentWillUpdate!="function"||(typeof h.componentWillUpdate=="function"&&h.componentWillUpdate(l,ae,F),typeof h.UNSAFE_componentWillUpdate=="function"&&h.UNSAFE_componentWillUpdate(l,ae,F)),typeof h.componentDidUpdate=="function"&&(n.flags|=4),typeof h.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&Y===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&Y===e.memoizedState||(n.flags|=1024),n.memoizedProps=l,n.memoizedState=ae),h.props=l,h.state=ae,h.context=F,l=re):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&Y===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&Y===e.memoizedState||(n.flags|=1024),l=!1)}return h=l,Cr(e,n),l=(n.flags&128)!==0,h||l?(h=n.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:h.render(),n.flags|=1,e!==null&&l?(n.child=Ba(n,e.child,null,d),n.child=Ba(n,null,a,d)):Lt(e,n,a,d),n.memoizedState=h.state,e=n.child):e=Ni(e,n,d),e}function hy(e,n,a,l){return Da(),n.flags|=256,Lt(e,n,a,l),n.child}var yd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function bd(e){return{baseLanes:e,cachePool:ng()}}function vd(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=An),e}function my(e,n,a){var l=n.pendingProps,d=!1,h=(n.flags&128)!==0,S;if((S=h)||(S=e!==null&&e.memoizedState===null?!1:(Vt.current&2)!==0),S&&(d=!0,n.flags&=-129),S=(n.flags&32)!==0,n.flags&=-33,e===null){if(Ke){if(d?Wi(n):ea(),(e=bt)?(e=_b(e,_n),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Vi!==null?{id:ni,overflow:ii}:null,retryLane:536870912,hydrationErrors:null},a=Yp(e),a.return=n,n.child=a,Ht=n,bt=null)):e=null,e===null)throw $i(n);return vf(e)?n.lanes=32:n.lanes=536870912,null}return h=l.children,l=l.fallback,d?(ea(),d=n.mode,h=ws({mode:"hidden",children:h},d),l=Na(l,d,a,null),h.return=n,l.return=n,h.sibling=l,n.child=h,l=n.child,l.memoizedState=bd(a),l.childLanes=vd(e,S,a),n.memoizedState=yd,_o(null,l)):(Wi(n),xd(n,h))}var M=e.memoizedState;if(M!==null){var F=M.dehydrated;if(F!==null)return $S(e,n,h,S,l,F,M,a)}return d?(ea(),d=l.fallback,h=n.mode,M=e.child,F=M.sibling,l=Ai(M,{mode:"hidden",children:l.children}),l.subtreeFlags=M.subtreeFlags&1206910976,F!==null?d=Ai(F,d):(d=Na(d,h,a,null),d.flags|=2),d.return=n,l.return=n,l.sibling=d,n.child=l,_o(null,l),l=n.child,d=e.child.memoizedState,d===null?d=bd(a):(h=d.cachePool,h!==null?(M=Rt._currentValue,h=h.parent!==M?{parent:M,pool:M}:h):h=ng(),d={baseLanes:d.baseLanes|a,cachePool:h}),l.memoizedState=d,l.childLanes=vd(e,S,a),n.memoizedState=yd,_o(e.child,l)):(Wi(n),a=e.child,e=a.sibling,a=Ai(a,{mode:"visible",children:l.children}),a.return=n,a.sibling=null,e!==null&&(S=n.deletions,S===null?(n.deletions=[e],n.flags|=16):S.push(e)),n.child=a,n.memoizedState=null,a)}function xd(e,n){return n=ws({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function ws(e,n){return e=ln(22,e,null,n),e.lanes=0,e}function Ss(e,n,a){return Ba(n,e.child,null,a),e=xd(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function $S(e,n,a,l,d,h,S,M){if(a)return n.flags&256?(Wi(n),n.flags&=-257,Ss(e,n,M)):n.memoizedState!==null?(ea(),n.child=e.child,n.flags|=128,null):(ea(),h=d.fallback,S=n.mode,d=ws({mode:"visible",children:d.children},S),h=Na(h,S,M,null),h.flags|=2,d.return=n,h.return=n,d.sibling=h,n.child=d,Ba(n,e.child,null,M),d=n.child,d.memoizedState=bd(M),d.childLanes=vd(e,l,M),n.memoizedState=yd,_o(null,d));if(Wi(n),vf(h)){if(l=h.nextSibling&&h.nextSibling.dataset,l)var F=l.dgst;return l=F,l!==""&&(d=Error(o(419)),d.stack="",d.digest=l,Ao({value:d,source:null,stack:null})),Ss(e,n,M)}if(Nt||ja(e,n,M,!1),l=(M&e.childLanes)!==0,Nt||l){if(Ki.current!==null)return Ss(e,n,M);if(l=gt,l!==null&&(d=Zm(l,M),d!==0&&d!==S.retryLane))throw S.retryLane=d,Ma(e,d),dn(l,e,d),pd;return bf(h)||qs(),Ss(e,n,M)}return bf(h)?(n.flags|=192,n.child=e.child,null):(e=S.treeContext,bt=Hn(h.nextSibling),Ht=n,Ke=!0,Gi=null,_n=!1,e!==null&&Zp(n,e),n=xd(n,d.children),n.flags|=134221824,n)}function py(e,n,a){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n),es(e.return,n,a)}function gy(e){for(var n=null;e!==null;){var a=e.alternate;a!==null&&us(a)===null&&(n=e),e=e.sibling}return n}function ks(e,n,a,l,d,h){var S=e.memoizedState;S===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:d,treeForkCount:h}:(S.isBackwards=n,S.rendering=null,S.renderingStartTime=0,S.last=l,S.tail=a,S.tailMode=d,S.treeForkCount=h)}function wd(e){var n=e.child;for(e.child=null;n!==null;){var a=n.sibling;n.sibling=e.child,e.child=n,n=a}}function Sd(e,n,a){var l=n.pendingProps,d=l.revealOrder,h=l.tail;l=l.children;var S=Vt.current;if(n.flags&128)return Oo(n,S),null;var M=(S&2)!==0;if(M?(S=S&1|2,n.flags|=128):S&=1,Oo(n,S),d==="backwards"&&e!==null?(wd(e),Lt(e,n,l,a),wd(e)):Lt(e,n,l,a),l=Ke?ko:0,!M&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&py(e,a,n);else if(e.tag===19)py(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(d){case"backwards":a=gy(n.child),a===null?(d=n.child,n.child=null):(d=a.sibling,a.sibling=null,wd(n)),ks(n,!0,d,null,h,l);break;case"unstable_legacy-backwards":for(a=null,d=n.child,n.child=null;d!==null;){if(e=d.alternate,e!==null&&us(e)===null){n.child=d;break}e=d.sibling,d.sibling=a,a=d,d=e}ks(n,!0,a,null,h,l);break;case"together":ks(n,!1,null,null,void 0,l);break;case"independent":n.memoizedState=null;break;default:a=gy(n.child),a===null?(d=n.child,n.child=null):(d=a.sibling,a.sibling=null),ks(n,!1,d,a,h,l)}return n.child}function yy(e,n,a){var l=n.pendingProps;return Yi(n,n.type,l.value),Lt(e,n,l.children,a),n.child}function Ni(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),aa|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(ja(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,a=Ai(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=Ai(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function kd(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&ts(e)))}function YS(e,n,a){switch(n.tag){case 3:ye(n,n.stateNode.containerInfo),Yi(n,Rt,e.memoizedState.cache),Da();break;case 27:case 5:me(n);break;case 4:ye(n,n.stateNode.containerInfo);break;case 10:Yi(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Jc(n),null;break;case 13:var l=n.memoizedState;if(l!==null){if(l.dehydrated!==null)return Wi(n),n.flags|=128,null;l=ja(e,n,a,!1);var d=n.child.childLanes;return l||(a&d)!==0?my(e,n,a):(Wi(n),e=Ni(e,n,a),e!==null?e.sibling:null)}Wi(n);break;case 19:if(n.flags&128)return Sd(e,n,a);if(d=(e.flags&128)!==0,l=(a&n.childLanes)!==0,l||(ja(e,n,a,!1),l=(a&n.childLanes)!==0),d){if(l)return Sd(e,n,a);n.flags|=128}if(d=n.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Oo(n,Vt.current),l)break;return null;case 22:return n.lanes=0,sy(e,n,a,n.pendingProps);case 24:Yi(n,Rt,e.memoizedState.cache)}return Ni(e,n,a)}function by(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)Nt=!0;else{if(!kd(e,a)&&(n.flags&128)===0)return Nt=!1,YS(e,n,a);Nt=(e.flags&131072)!==0}else Nt=!1,Ke&&(n.flags&1048576)!==0&&Xp(n,ko,n.index);switch(n.lanes=0,n.tag){case 16:e:{var l=n.pendingProps;if(e=Ia(n.elementType),n.type=e,typeof e=="function")Nc(e)?(l=Ua(e,l),n.tag=1,n=fy(null,n,e,l,a)):(n.tag=0,n=gd(null,n,e,l,a));else{if(e!=null){var d=e.$$typeof;if(d===P){n.tag=11,n=ry(null,n,e,l,a);break e}else if(d===be){n.tag=14,n=oy(null,n,e,l,a);break e}else if(d===N){n.tag=10,n.type=e,n=yy(null,n,a);break e}}throw n=ge(e)||e,Error(o(306,n,""))}}return n;case 0:return gd(e,n,n.type,n.pendingProps,a);case 1:return l=n.type,d=Ua(l,n.pendingProps),fy(e,n,l,d,a);case 3:e:{if(ye(n,n.stateNode.containerInfo),e===null)throw Error(o(387));l=n.pendingProps;var h=n.memoizedState;d=h.element,Pc(e,n),Do(n,l,null,a);var S=n.memoizedState;if(l=S.cache,Yi(n,Rt,l),l!==h.cache&&Ic(n,[Rt],a,!0),No(),l=S.element,h.isDehydrated)if(h={element:l,isDehydrated:!1,cache:S.cache},n.updateQueue.baseState=h,n.memoizedState=h,n.flags&256){n=hy(e,n,l,a);break e}else if(l!==d){d=jn(Error(o(424)),n),Ao(d),n=hy(e,n,l,a);break e}else for(e=n.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,bt=Hn(e.firstChild),Ht=n,Ke=!0,Gi=null,_n=!0,a=sg(n,null,l,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling;else{if(Da(),l===d){n=Ni(e,n,a);break e}Lt(e,n,l,a)}n=n.child}return n;case 26:return Cr(e,n),e===null?(a=Pb(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ke||(n.stateNode=Sb(n.type,n.pendingProps,Le.current,n)):n.memoizedState=Pb(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return me(n),e===null&&Ke&&(l=n.stateNode=Bb(n.type,n.pendingProps,Le.current),Ht=n,_n=!0,d=bt,sa(n.type)?(xf=d,bt=Hn(l.firstChild)):bt=d),Lt(e,n,n.pendingProps.children,a),Cr(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&Ke&&((d=l=bt)&&(l=Uk(l,n.type,n.pendingProps,_n),l!==null?(n.stateNode=l,Ht=n,bt=Hn(l.firstChild),_n=!1,d=!0):d=!1),d||$i(n)),me(n),d=n.type,h=n.pendingProps,S=e!==null?e.memoizedProps:null,l=h.children,df(d,h)?l=null:S!==null&&df(d,S)&&(n.flags|=32),n.memoizedState!==null&&(d=Qc(e,n,_S,null,null,a),Gr._currentValue=d),Cr(e,n),Lt(e,n,l,a),n.child;case 6:return e===null&&Ke&&((e=a=bt)&&(a=Fk(a,n.pendingProps,_n),a!==null?(n.stateNode=a,Ht=n,bt=null,e=!0):e=!1),e||$i(n)),null;case 13:return my(e,n,a);case 4:return ye(n,n.stateNode.containerInfo),l=n.pendingProps,e===null?n.child=Ba(n,null,l,a):Lt(e,n,l,a),n.child;case 11:return ry(e,n,n.type,n.pendingProps,a);case 7:return l=n.pendingProps,Cr(e,n),Lt(e,n,l,a),n.child;case 8:return Lt(e,n,n.pendingProps.children,a),n.child;case 12:return Lt(e,n,n.pendingProps.children,a),n.child;case 10:return yy(e,n,a);case 9:return d=n.type._context,l=n.pendingProps.children,La(n),d=Ft(d),l=l(d),n.flags|=1,Lt(e,n,l,a),n.child;case 14:return oy(e,n,n.type,n.pendingProps,a);case 15:return ly(e,n,n.type,n.pendingProps,a);case 19:return Sd(e,n,a);case 31:return GS(e,n,a);case 22:return sy(e,n,a,n.pendingProps);case 24:return La(n),l=Ft(Rt),e===null?(d=qc(),d===null&&(d=gt,h=Hc(),d.pooledCache=h,h.refCount++,h!==null&&(d.pooledCacheLanes|=a),d=h),n.memoizedState={parent:l,cache:d},Fc(n),Yi(n,Rt,d)):((e.lanes&a)!==0&&(Pc(e,n),Do(n,null,null,a),No()),d=e.memoizedState,h=n.memoizedState,d.parent!==l?(d={parent:l,cache:l},n.memoizedState=d,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=d),Yi(n,Rt,l)):(l=h.cache,Yi(n,Rt,l),l!==d.cache&&Ic(n,[Rt],a,!0))),Lt(e,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),l=n.pendingProps,l.name!=null&&l.name!=="auto"?n.flags|=e===null?18882560:18874368:Ke&&Kl(n),e!==null&&e.memoizedProps.name!==l.name?n.flags|=4194816:Cr(e,n),Lt(e,n,l.children,a),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function Di(e){e.flags|=4}function Ad(e,n,a,l,d){var h;if((h=(e.mode&32)!==0)&&(h=a===null?Yb(n,l):Yb(n,l)&&(l.src!==a.src||l.srcSet!==a.srcSet)),h){if(e.flags|=16777216,(d&335544128)===d)if(e.stateNode.complete)e.flags|=8192;else if(Wy())e.flags|=8192;else throw Ha=rs,Uc}else e.flags&=-16777217}function vy(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Jb(n))if(Wy())e.flags|=8192;else throw Ha=rs,Uc}function As(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Ym():536870912,e.lanes|=n,Or|=n)}function Io(e,n){if(!Ke)switch(e.tailMode){case"visible":break;case"collapsed":for(var a=e.tail,l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null;break;default:for(n=e.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null}}function vt(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(n)for(var d=e.child;d!==null;)a|=d.lanes|d.childLanes,l|=d.subtreeFlags&1206910976,l|=d.flags&1206910976,d.return=e,d=d.sibling;else for(d=e.child;d!==null;)a|=d.lanes|d.childLanes,l|=d.subtreeFlags,l|=d.flags,d.return=e,d=d.sibling;return e.subtreeFlags|=l,e.childLanes=a,n}function JS(e,n,a){var l=n.pendingProps;switch(jc(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return vt(n),null;case 1:return vt(n),null;case 3:return a=n.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),n.memoizedState.cache!==l&&(n.flags|=2048),Ci(Rt),Ae(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(xr(n)?Di(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,zc())),vt(n),null;case 26:var d=n.type,h=n.memoizedState;return e===null?(Di(n),h!==null?(vt(n),vy(n,h)):(vt(n),Ad(n,d,null,l,a))):h?h!==e.memoizedState?(Di(n),vt(n),vy(n,h)):(vt(n),n.flags&=-16777217):(e=e.memoizedProps,e!==l&&Di(n),vt(n),Ad(n,d,e,l,a)),null;case 27:if(je(n),a=Le.current,d=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==l&&Di(n);else{if(!l){if(n.stateNode===null)throw Error(o(166));return vt(n),n.subtreeFlags&=-33554433,null}e=Be.current,xr(n)?Qp(n):(e=Bb(d,l,a),n.stateNode=e,Di(n))}return vt(n),n.subtreeFlags&=-33554433,null;case 5:if(je(n),d=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==l&&Di(n);else{if(!l){if(n.stateNode===null)throw Error(o(166));return vt(n),n.subtreeFlags&=-33554433,null}if(h=Be.current,xr(n))Qp(n);else{var S=Jo(Le.current);switch(h){case 1:h=S.createElementNS("http://www.w3.org/2000/svg",d);break;case 2:h=S.createElementNS("http://www.w3.org/1998/Math/MathML",d);break;default:switch(d){case"svg":h=S.createElementNS("http://www.w3.org/2000/svg",d);break;case"math":h=S.createElementNS("http://www.w3.org/1998/Math/MathML",d);break;case"script":h=S.createElement("div"),h.innerHTML="<script><\/script>",h=h.removeChild(h.firstChild);break;case"select":h=typeof l.is=="string"?S.createElement("select",{is:l.is}):S.createElement("select"),l.multiple?h.multiple=!0:l.size&&(h.size=l.size);break;default:h=typeof l.is=="string"?S.createElement(d,{is:l.is}):S.createElement(d)}}h[Ut]=n,h[on]=l;e:for(S=n.child;S!==null;){if(S.tag===5||S.tag===6)h.appendChild(S.stateNode);else if(S.tag!==4&&S.tag!==27&&S.child!==null){S.child.return=S,S=S.child;continue}if(S===n)break e;for(;S.sibling===null;){if(S.return===null||S.return===n)break e;S=S.return}S.sibling.return=S.return,S=S.sibling}n.stateNode=h;e:switch($t(h,d,l),d){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Di(n)}}return vt(n),n.subtreeFlags&=-33554433,Ad(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==l&&Di(n);else{if(typeof l!="string"&&n.stateNode===null)throw Error(o(166));if(e=Le.current,xr(n)){if(e=n.stateNode,a=n.memoizedProps,l=null,d=Ht,d!==null)switch(d.tag){case 27:case 5:l=d.memoizedProps}e[Ut]=n,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||bb(e.nodeValue,a)),e||$i(n,!0)}else e=Jo(e).createTextNode(l),e[Ut]=n,n.stateNode=e}return vt(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(l=xr(n),a!==null){if(e===null){if(!l)throw Error(o(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Ut]=n}else Da(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;vt(n),e=!1}else a=zc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(wn(n),n):(wn(n),null);if((n.flags&128)!==0)throw Error(o(558))}return vt(n),null;case 13:if(l=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(d=xr(n),l!==null&&l.dehydrated!==null){if(e===null){if(!d)throw Error(o(318));if(d=n.memoizedState,d=d!==null?d.dehydrated:null,!d)throw Error(o(317));d[Ut]=n}else Da(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;vt(n),d=!1}else d=zc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=d),d=!0;if(!d)return n.flags&256?(wn(n),n):(wn(n),null)}return wn(n),(n.flags&128)!==0?(n.lanes=a,n):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=n.child,d=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(d=l.alternate.memoizedState.cachePool.pool),h=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(h=l.memoizedState.cachePool.pool),h!==d&&(l.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),As(n,n.updateQueue),vt(n),null);case 4:return Ae(),e===null&&of(n.stateNode.containerInfo),n.flags|=67108864,vt(n),null;case 10:return Ci(n.type),vt(n),null;case 19:if(Xc(n),l=n.memoizedState,l===null)return vt(n),null;if(d=(n.flags&128)!==0,h=l.rendering,h===null)if(d)Io(l,!1);else{if(Tt!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(h=us(e),h!==null){for(n.flags|=128,Io(l,!1),e=h.updateQueue,n.updateQueue=e,As(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)$p(a,e),a=a.sibling;return Oo(n,Vt.current&1|2),Ke&&Ti(n,l.treeForkCount),n.child}e=e.sibling}l.tail!==null&&pt()>_s&&(n.flags|=128,d=!0,Io(l,!1),n.lanes=4194304)}else{if(!d)if(e=us(h),e!==null){if(n.flags|=128,d=!0,e=e.updateQueue,n.updateQueue=e,As(n,e),Io(l,!0),l.tail===null&&l.tailMode!=="collapsed"&&l.tailMode!=="visible"&&!h.alternate&&!Ke)return vt(n),null}else 2*pt()-l.renderingStartTime>_s&&a!==536870912&&(n.flags|=128,d=!0,Io(l,!1),n.lanes=4194304);l.isBackwards?(h.sibling=n.child,n.child=h):(e=l.last,e!==null?e.sibling=h:n.child=h,l.last=h)}if(l.tail!==null){e=l.tail;e:{for(a=e;a!==null;){if(a.alternate!==null){a=!1;break e}a=a.sibling}a=!0}return l.rendering=e,l.tail=e.sibling,l.renderingStartTime=pt(),e.sibling=null,h=Vt.current,h=d?h&1|2:h&1,l.tailMode==="visible"||l.tailMode==="collapsed"||!a||Ke?Oo(n,h):(a=h,Ne(Pt,n),Ne(Vt,a),Xt===null&&(Xt=n)),Ke&&Ti(n,l.treeForkCount),e}return vt(n),null;case 22:case 23:return wn(n),Yc(),l=n.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(n.flags|=8192):l&&(n.flags|=8192),l?(a&536870912)!==0&&(n.flags&128)===0&&(vt(n),n.subtreeFlags&6&&(n.flags|=8192)):vt(n),a=n.updateQueue,a!==null&&As(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(l=n.memoizedState.cachePool.pool),l!==a&&(n.flags|=2048),e!==null&&xe(_a),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Ci(Rt),vt(n),null;case 25:return null;case 30:return n.flags|=33554432,vt(n),null}throw Error(o(156,n.tag))}function XS(e,n){switch(jc(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Ci(Rt),Ae(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return je(n),null;case 31:if(n.memoizedState!==null){if(wn(n),n.alternate===null)throw Error(o(340));Da()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(wn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));Da()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return Xc(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return Ae(),null;case 10:return Ci(n.type),null;case 22:case 23:return wn(n),Yc(),e!==null&&xe(_a),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Ci(Rt),null;case 25:return null;default:return null}}function xy(e,n){switch(jc(n),n.tag){case 3:Ci(Rt),Ae();break;case 26:case 27:case 5:je(n);break;case 4:Ae();break;case 31:n.memoizedState!==null&&wn(n);break;case 13:wn(n);break;case 19:Xc(n);break;case 10:Ci(n.type);break;case 22:case 23:wn(n),Yc(),e!==null&&xe(_a);break;case 24:Ci(Rt)}}function Ho(e,n){try{var a=n.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var d=l.next;a=d;do{if((a.tag&e)===e){l=void 0;var h=a.create,S=a.inst;l=h(),S.destroy=l}a=a.next}while(a!==d)}}catch(M){dt(n,n.return,M)}}function ta(e,n,a){try{var l=n.updateQueue,d=l!==null?l.lastEffect:null;if(d!==null){var h=d.next;l=h;do{if((l.tag&e)===e){var S=l.inst,M=S.destroy;if(M!==void 0){S.destroy=void 0,d=n;var F=a,W=M;try{W()}catch(re){dt(d,F,re)}}}l=l.next}while(l!==h)}}catch(re){dt(n,n.return,re)}}function wy(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{cg(n,a)}catch(l){dt(e,e.return,l)}}}function Sy(e,n,a){a.props=Ua(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){dt(e,n,l)}}function ai(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:var d=e.stateNode,h=Si(e.memoizedProps,d);(d.ref===null||d.ref.name!==h)&&(d.ref=Mb(h)),l=d.ref;break;case 7:if(e.stateNode===null){var S=new En(e);g(e.child,!1,Bk,S,void 0,void 0),e.stateNode=S}l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(M){dt(e,n,M)}}function Gt(e,n){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(d){dt(e,n,d)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(d){dt(e,n,d)}else a.current=null}function Ts(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var a=0;a<n.length;a++)zb(e.stateNode,n[a])}function ky(e){for(var n=e.return;n!==null&&(Ed(n)&&zb(e.stateNode,n.stateNode),!Td(n));)n=n.return}function Bo(e){for(var n=e.return;n!==null&&(Ed(n)&&qk(e.stateNode,n.stateNode),!Td(n));)n=n.return}function Td(e){return e.tag===5||e.tag===3||e.tag===27}function Ed(e){return e&&e.tag===7&&e.stateNode!==null}function Cd(e){var n=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(d){dt(e,e.return,d)}}function Rd(e,n,a){try{var l=e.stateNode;wk(l,e.type,a,n),l[on]=n}catch(d){dt(e,e.return,d)}}function Ay(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&sa(e.type)||e.tag===4}function Md(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ay(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&sa(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Nd(e,n,a,l){var d=e.tag;if(d===5||d===6)d=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(d,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(d),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=ti)),Ts(e,l),rt=!0;else if(d!==4&&(d===27&&(Ts(e,l),l=null,sa(e.type)&&(a=e.stateNode,n=null)),e=e.child,e!==null))for(Nd(e,n,a,l),e=e.sibling;e!==null;)Nd(e,n,a,l),e=e.sibling}function Es(e,n,a,l){var d=e.tag;if(d===5||d===6)d=e.stateNode,n?a.insertBefore(d,n):a.appendChild(d),Ts(e,l),rt=!0;else if(d!==4&&(d===27&&(Ts(e,l),l=null,sa(e.type)&&(a=e.stateNode)),e=e.child,e!==null))for(Es(e,n,a,l),e=e.sibling;e!==null;)Es(e,n,a,l),e=e.sibling}function Ty(e){var n=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,d=n.attributes;d.length;)n.removeAttributeNode(d[0]);$t(n,l,a),n[Ut]=e,n[on]=a}catch(h){dt(e,e.return,h)}}var Cs=!1,Sn=null;function Ey(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Cs=!0)}var ri=null;function Cy(){var e=ri;return ri=null,e}var sn=0;function Rr(e,n,a,l,d){return sn=0,Ry(e.child,n,a,l,d)}function Ry(e,n,a,l,d){for(var h=!1;e!==null;){if(e.tag===5){var S=e.stateNode;if(l!==null){var M=mf(S);l.push(M),M.view&&(h=!0)}else h||mf(S).view&&(h=!0);Cs=!0,Cb(S,sn===0?n:n+"_"+sn,a),sn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&d||Ry(e.child,n,a,l,d)&&(h=!0));e=e.sibling}return h}function oi(e,n){for(;e!==null;)e.tag===5?Rb(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||oi(e.child,n)),e=e.sibling}function Rs(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Rs(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(o(544));var a=n.name;n=ki(n.default,n.share),n!=="none"&&(Rr(e,a,n,null,!1)||oi(e.child,!1))}e=e.sibling}}function Dd(e,n){if(e.tag===30){var a=e.stateNode,l=e.memoizedProps,d=Si(l,a),h=ki(l.default,a.paired?l.share:l.enter);h!=="none"?Rr(e,d,h,null,!1)?(Rs(e),a.paired||n||_r(e,l.onEnter)):oi(e.child,!1):Rs(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Dd(e,n),e=e.sibling;else Rs(e)}function Od(e){if(Sn!==null&&Sn.size!==0){var n=Sn;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var a=e.memoizedProps,l=a.name;if(l!=null&&l!=="auto"){var d=n.get(l);if(d!==void 0){var h=ki(a.default,a.share);if(h!=="none"&&(Rr(e,l,h,null,!1)?(h=e.stateNode,d.paired=h,h.paired=d,_r(e,a.onShare)):oi(e.child,!1)),n.delete(l),n.size===0)break}}}Od(e)}e=e.sibling}}}function jd(e){if(e.tag===30){var n=e.memoizedProps,a=Si(n,e.stateNode),l=Sn!==null?Sn.get(a):void 0,d=ki(n.default,l!==void 0?n.share:n.exit);d!=="none"&&(Rr(e,a,d,null,!1)?l!==void 0?(d=e.stateNode,l.paired=d,d.paired=l,Sn.delete(a),_r(e,n.onShare)):_r(e,n.onExit):oi(e.child,!1)),Sn!==null&&Od(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)jd(e),e=e.sibling;else Sn!==null&&Od(e)}function My(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,a=Si(n,e.stateNode);n=ki(n.default,n.update),e.flags&=-5,n!=="none"&&Rr(e,a,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&My(e);e=e.sibling}}function Ld(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,oi(e.child,!1))}Ld(e)}e=e.sibling}}function Ms(e){if(e.tag===30)e.stateNode.paired=null,oi(e.child,!1),Ld(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ms(e),e=e.sibling;else Ld(e)}function Ny(e){for(e=e.child;e!==null;)e.tag===30?oi(e.child,!1):(e.subtreeFlags&33554432)!==0&&Ny(e),e=e.sibling}function zd(e,n,a,l,d,h,S){for(var M=!1;n!==null;){if(n.tag===5){var F=n.stateNode;if(h!==null&&sn<h.length){var W=h[sn],re=mf(F);(W.view||re.view)&&(M=!0);var fe;if(fe=(e.flags&4)===0)if(re.clip)fe=!0;else{fe=W.rect;var Y=re.rect;fe=fe.y!==Y.y||fe.x!==Y.x||fe.height!==Y.height||fe.width!==Y.width}fe&&(e.flags|=4),re.abs?re=!W.abs:(W=W.rect,re=re.rect,re=W.height!==re.height||W.width!==re.width),re&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&Cb(F,sn===0?a:a+"_"+sn,d),M&&(e.flags&4)!==0||(ri===null&&(ri=[]),ri.push(F,sn===0?l:l+"_"+sn,n.memoizedProps)),sn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&S?e.flags|=n.flags&32:zd(e,n.child,a,l,d,h,S)&&(M=!0));n=n.sibling}return M}function Dy(e,n){for(e=e.child;e!==null;){if(e.tag===30){var a=e.memoizedProps,l=e.stateNode,d=Si(a,l),h=ki(a.default,a.update),S;S=e.memoizedState,e.memoizedState=null,l=e;var M=e.child;sn=0,d=zd(l,M,d,d,h,S,!1),(e.flags&4)!==0&&d&&_r(e,a.onUpdate)}else(e.subtreeFlags&33554432)!==0&&Dy(e);e=e.sibling}}var Bt=!1,st=!1,li=!1,_d=!1,Oy=typeof WeakSet=="function"?WeakSet:Set,qt=null,si=!1,qo=!1,Ns=!1,Id=!1;function ZS(e,n,a){if(e=e.containerInfo,uf=$r,e=_p(e),kc(e)){if("selectionStart"in e)var l={start:e.selectionStart,end:e.selectionEnd};else e:{l=(l=e.ownerDocument)&&l.defaultView||window;var d=l.getSelection&&l.getSelection();if(d&&d.rangeCount!==0){l=d.anchorNode;var h=d.anchorOffset,S=d.focusNode;d=d.focusOffset;try{l.nodeType,S.nodeType}catch{l=null;break e}var M=0,F=-1,W=-1,re=0,fe=0,Y=e,ae=null;t:for(;;){for(var Te;Y!==l||h!==0&&Y.nodeType!==3||(F=M+h),Y!==S||d!==0&&Y.nodeType!==3||(W=M+d),Y.nodeType===3&&(M+=Y.nodeValue.length),(Te=Y.firstChild)!==null;)ae=Y,Y=Te;for(;;){if(Y===e)break t;if(ae===l&&++re===h&&(F=M),ae===S&&++fe===d&&(W=M),(Te=Y.nextSibling)!==null)break;Y=ae,ae=Y.parentNode}Y=Te}l=F===-1||W===-1?null:{start:F,end:W}}else l=null}l=l||{start:0,end:0}}else l=null;for(cf={focusedElem:e,selectionRange:l},$r=!1,a=(a&335544064)===a,qt=n,n=a?9270:1024;qt!==null;){if(e=qt,a&&(l=e.deletions,l!==null))for(h=0;h<l.length;h++)a&&jd(l[h]);if(e.alternate===null&&(e.flags&2)!==0)a&&Ey(e),Ds(a);else{if(e.tag===22){if(l=e.alternate,e.memoizedState!==null){l!==null&&l.memoizedState===null&&a&&jd(l),Ds(a);continue}else if(l!==null&&l.memoizedState!==null){a&&Ey(e),Ds(a);continue}}l=e.child,(e.subtreeFlags&n)!==0&&l!==null?(l.return=e,qt=l):(a&&My(e),Ds(a))}}Sn=null}function Ds(e){for(;qt!==null;){var n=qt,a=e,l=n.alternate,d=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((d&1024)!==0&&l!==null){a=void 0,d=l.memoizedProps,l=l.memoizedState;var h=n.stateNode;try{var S=Ua(n.type,d);a=h.getSnapshotBeforeUpdate(S,l),h.__reactInternalSnapshotBeforeUpdate=a}catch(M){dt(n,n.return,M)}}break;case 3:if((d&1024)!==0){if(l=n.stateNode.containerInfo,a=l.nodeType,a===9)yf(l);else if(a===1)switch(l.nodeName){case"HEAD":case"HTML":case"BODY":yf(l);break;default:l.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&l!==null&&(a=Si(l.memoizedProps,l.stateNode),d=n.memoizedProps,d=ki(d.default,d.update),d!=="none"&&Rr(l,a,d,l.memoizedState=[],!0));break;default:if((d&1024)!==0)throw Error(o(163))}if(l=n.sibling,l!==null){l.return=n.return,qt=l;break}qt=n.return}}function jy(e,n,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:ui(e,a),l&4&&Ho(5,a);break;case 1:if(ui(e,a),l&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(S){dt(a,a.return,S)}else{var d=Ua(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(d,n,e.__reactInternalSnapshotBeforeUpdate)}catch(S){dt(a,a.return,S)}}l&64&&wy(a),l&512&&ai(a,a.return);break;case 3:if(ui(e,a),l&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{cg(e,n)}catch(S){dt(a,a.return,S)}}break;case 27:n===null&&l&4&&Ty(a);case 26:case 5:ui(e,a),n===null&&l&4&&Cd(a),l&512&&ai(a,a.return);break;case 12:ui(e,a);break;case 31:ui(e,a),l&4&&Iy(e,a);break;case 13:ui(e,a),l&4&&Hy(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=sk.bind(null,a),Pk(e,a))));break;case 22:if(l=a.memoizedState!==null||Bt,!l){var h=n!==null&&n.memoizedState!==null||st;n=Bt,d=st,Bt=l,(st=h)&&!d?(l=2,(a.subtreeFlags&8772)!==0&&(l|=1),Vn(e,a,l)):ui(e,a),Bt=n,st=d}break;case 30:ui(e,a),l&512&&ai(a,a.return);break;case 7:l&512&&ai(a,a.return);default:ui(e,a)}}function Hd(e,n){for(e=e.child;e!==null;)Ly(e,n),e=e.sibling}function Ly(e,n){switch(e.tag){case 5:case 26:try{var a=e.stateNode;if(n){var l=a.style;typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"}else{var d=e.stateNode,h=e.memoizedProps.style,S=h!=null&&h.hasOwnProperty("display")?h.display:null;d.style.display=S==null||typeof S=="boolean"?"":(""+S).trim()}}catch(F){dt(e,e.return,F)}Bd(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,rt=!0}catch(F){dt(e,e.return,F)}break;case 18:try{var M=e.stateNode;n?Eb(M,!0):Eb(e.stateNode,!1)}catch(F){dt(e,e.return,F)}break;case 22:case 23:e.memoizedState===null&&Hd(e,n);break;default:Hd(e,n)}}function Bd(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var a=e,l=n;switch(a.tag){case 4:Ly(a,l);break e;case 22:a.memoizedState===null&&Bd(a,l);break e;default:Bd(a,l)}}e=e.sibling}}function zy(e){var n=e.alternate;n!==null&&(e.alternate=null,zy(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&_l(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var wt=null,un=!1;function Fn(e,n,a){for(a=a.child;a!==null;)_y(e,n,a),a=a.sibling}function _y(e,n,a){if(yn&&typeof yn.onCommitFiberUnmount=="function")try{yn.onCommitFiberUnmount(so,a)}catch{}switch(a.tag){case 26:st||Gt(a,n),Fn(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!st&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:st||Gt(a,n),Bo(a);var l=wt,d=un;sa(a.type)&&(wt=a.stateNode,un=!1),Fn(e,n,a),qb(a.stateNode,a.type,a.memoizedProps),wt=l,un=d;break;case 5:st||Gt(a,n),Bo(a);case 6:if(a.tag===6&&Bo(a),l=wt,d=un,wt=null,Fn(e,n,a),wt=l,un=d,wt!==null)if(un)try{(wt.nodeType===9?wt.body:wt.nodeName==="HTML"?wt.ownerDocument.body:wt).removeChild(a.stateNode),rt=!0}catch(h){dt(a,n,h)}else try{wt.removeChild(a.stateNode),rt=!0}catch(h){dt(a,n,h)}break;case 18:wt!==null&&(un?(e=wt,Tb(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Yr(e)):Tb(wt,a.stateNode));break;case 4:l=wt,d=un,wt=a.stateNode.containerInfo,un=!0,Fn(e,n,a),wt=l,un=d;break;case 0:case 11:case 14:case 15:ta(2,a,n),st||ta(4,a,n),Fn(e,n,a);break;case 1:st||(Gt(a,n),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Sy(a,n,l)),Fn(e,n,a);break;case 21:Fn(e,n,a);break;case 22:st=(l=st)||a.memoizedState!==null,Fn(e,n,a),st=l;break;case 30:Gt(a,n),Fn(e,n,a);break;case 7:st||Gt(a,n),Fn(e,n,a);break;default:Fn(e,n,a)}}function Iy(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Yr(e)}catch(a){dt(n,n.return,a)}}}function Hy(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Yr(e)}catch(a){dt(n,n.return,a)}}function QS(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new Oy),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new Oy),n;default:throw Error(o(435,e.tag))}}function Os(e,n){var a=QS(e);n.forEach(function(l){if(!a.has(l)){a.add(l);var d=uk.bind(null,e,l);l.then(d,d)}})}function tn(e,n,a){var l=n.deletions;if(l!==null)for(var d=0;d<l.length;d++){var h=l[d],S=e,M=n,F=M;e:for(;F!==null;){switch(F.tag){case 27:if(sa(F.type)){wt=F.stateNode,un=!1;break e}break;case 5:wt=F.stateNode,un=!1;break e;case 3:case 4:wt=F.stateNode.containerInfo,un=!0;break e}F=F.return}if(wt===null)throw Error(o(160));_y(S,M,h),wt=null,un=!1,S=h.alternate,S!==null&&(S.return=null),h.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)By(n,e,a),n=n.sibling}var Pn=null;function By(e,n,a){var l=e.alternate,d=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(d&4&&(l=e.updateQueue,l=l!==null?l.events:null,l!==null))for(var h=0;h<l.length;h++){var S=l[h];S.ref.impl=S.nextImpl}tn(n,e,a),nn(e),d&4&&(ta(3,e,e.return),Ho(3,e),ta(5,e,e.return));break;case 1:tn(n,e,a),nn(e),d&512&&(st||l===null||Gt(l,l.return)),d&64&&Bt&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(h=Pn,tn(n,e,a),nn(e),d&512&&(st||l===null||Gt(l,l.return)),d&4)if(d=l!==null?l.memoizedState:null,a=e.memoizedState,l===null)if(a===null)if(e.stateNode===null)if(Bt)e.stateNode=Sb(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,a=e.memoizedProps,d=h.ownerDocument||h;t:switch(n){case"title":l=d.getElementsByTagName("title")[0],(!l||l[fo]||l[Ut]||l.namespaceURI==="http://www.w3.org/2000/svg"||l.hasAttribute("itemprop"))&&(l=d.createElement(n),d.head.insertBefore(l,d.querySelector("head > title"))),$t(l,n,a),l[Ut]=e,It(l),n=l;break e;case"link":if(h=$b("link","href",d).get(n+(a.href||""))){for(S=0;S<h.length;S++)if(l=h[S],l.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&l.getAttribute("rel")===(a.rel==null?null:a.rel)&&l.getAttribute("title")===(a.title==null?null:a.title)&&l.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){h.splice(S,1);break t}}l=d.createElement(n),$t(l,n,a),d.head.appendChild(l);break;case"meta":if(h=$b("meta","content",d).get(n+(a.content||""))){for(S=0;S<h.length;S++)if(l=h[S],l.getAttribute("content")===(a.content==null?null:""+a.content)&&l.getAttribute("name")===(a.name==null?null:a.name)&&l.getAttribute("property")===(a.property==null?null:a.property)&&l.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&l.getAttribute("charset")===(a.charSet==null?null:a.charSet)){h.splice(S,1);break t}}l=d.createElement(n),$t(l,n,a),d.head.appendChild(l);break;default:throw Error(o(468,n))}l[Ut]=e,It(l),n=l}e.stateNode=n}else Bt||Af(h,e.type,e.stateNode);else e.stateNode=Gb(h,a,e.memoizedProps);else d!==a?(d===null?(n=l.stateNode,n===null||st||n.parentNode.removeChild(n)):d.count--,a===null?Bt||Af(h,e.type,e.stateNode):Gb(h,a,e.memoizedProps)):a===null&&e.stateNode!==null&&Rd(e,e.memoizedProps,l.memoizedProps);break;case 27:tn(n,e,a),nn(e),d&512&&(st||l===null||Gt(l,l.return)),l!==null&&d&4&&Rd(e,e.memoizedProps,l.memoizedProps);break;case 5:if(h=li,li=!1,tn(n,e,a),li=h,nn(e),d&512&&(st||l===null||Gt(l,l.return)),e.flags&32){n=e.stateNode;try{cr(n,""),rt=!0}catch(re){dt(e,e.return,re)}}d&4&&e.stateNode!=null&&(n=e.memoizedProps,Rd(e,n,l!==null?l.memoizedProps:n)),d&1024&&(_d=!0);break;case 6:if(tn(n,e,a),nn(e),d&4){if(e.stateNode===null)throw Error(o(162));n=e.memoizedProps,a=e.stateNode;try{a.nodeValue=n,rt=!0}catch(re){dt(e,e.return,re)}}break;case 3:if(rt=!1,Ys=null,h=Pn,Pn=Xo(n.containerInfo),tn(n,e,a),Pn=h,nn(e),d&4&&l!==null&&l.memoizedState.isDehydrated)try{Yr(n.containerInfo)}catch(re){dt(e,e.return,re)}_d&&(_d=!1,qy(e)),rt=!1;break;case 4:d=li,li=Bt,l=op(),h=Pn,Pn=Xo(e.stateNode.containerInfo),tn(n,e,a),nn(e),Pn=h,rt&&qo&&(Ns=!0),rt=l,li=d;break;case 12:tn(n,e,a),nn(e);break;case 31:tn(n,e,a),nn(e),d&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Os(e,n)));break;case 13:tn(n,e,a),nn(e),e.child.flags&8192&&e.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&(zs=pt()),d&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Os(e,n)));break;case 22:h=e.memoizedState!==null,S=l!==null&&l.memoizedState!==null;var M=Bt,F=st,W=li;Bt=M||h,li=W||h,st=F||S,tn(n,e,a),st=F,li=W,Bt=M,nn(e),d&8192&&(n=e.stateNode,n._visibility=h?n._visibility&-2:n._visibility|1,!h||l===null||S||Bt||st||(n=S||st,a=Bt,l=st,Bt=h||Bt,st=n,na(e,2),Bt=a,st=l),!h&&li||Hd(e,h)),d&4&&(n=e.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,Os(e,a))));break;case 19:tn(n,e,a),nn(e),d&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Os(e,n)));break;case 30:d&512&&(st||l===null||Gt(l,l.return)),d=op(),h=qo,S=(a&335544064)===a,M=e.memoizedProps,qo=S&&ki(M.default,M.update)!=="none",tn(n,e,a),nn(e),S&&l!==null&&rt&&(e.flags|=4),qo=h,rt=d;break;case 21:break;case 7:d&512&&(st||l===null||Gt(l,l.return)),l&&l.stateNode!==null&&(l.stateNode._fragmentFiber=e);default:tn(n,e,a),nn(e)}}function nn(e){var n=e.flags;if(n&2){try{for(var a,l=e.return;l!==null;){if(Ay(l)){a=l;break}l=l.return}l=null;for(var d=e.return;d!==null;){if(Ed(d)){var h=d.stateNode;l===null?l=[h]:l.push(h)}if(Td(d))break;d=d.return}var S=l;if(a==null)throw Error(o(160));switch(a.tag){case 27:var M=a.stateNode,F=Md(e);Es(e,F,M,S);break;case 5:var W=a.stateNode;a.flags&32&&(cr(W,""),a.flags&=-33);var re=Md(e);Es(e,re,W,S);break;case 3:case 4:var fe=a.stateNode.containerInfo,Y=Md(e);Nd(e,Y,fe,S);break;default:throw Error(o(161))}}catch(ae){dt(e,e.return,ae)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function qy(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;qy(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,$r=!0,n.reset(),$r=!1),e=e.sibling}}function Mr(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)Uy(n,e),n=n.sibling;else Dy(n)}function Uy(e,n){var a=e.alternate;if(a===null)Dd(e,!1);else switch(e.tag){case 3:if(Id=si=!1,Cy(),Mr(n,e),!si&&!Ns){if(e=ri,e!==null)for(var l=0;l<e.length;l+=3){a=e[l];var d=e[l+1];Rb(a,e[l+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+d+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Id=!0}ri=null;break;case 5:Mr(n,e);break;case 4:l=si,si=!1,Mr(n,e),si&&(Ns=!0),si=l;break;case 22:e.memoizedState===null&&(a.memoizedState!==null?Dd(e,!1):Mr(n,e));break;case 30:l=si,d=Cy(),si=!1,Mr(n,e),si&&(e.flags|=4);var h=e.memoizedProps,S=e.stateNode;n=Si(h,S),S=Si(a.memoizedProps,S);var M=ki(h.default,h.update);M==="none"?n=!1:(h=a.memoizedState,a.memoizedState=null,a=e.child,sn=0,n=zd(e,a,n,S,M,h,!0),sn!==(h===null?0:h.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(_r(e,e.memoizedProps.onUpdate),ri=d):d!==null&&(d.push.apply(d,ri),ri=d),si=(e.flags&32)!==0?!0:l;break;default:Mr(n,e)}}function ui(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)jy(e,n.alternate,n),n=n.sibling}function na(e,n){for(e=e.child;e!==null;){var a=e,l=n;switch(a.tag){case 0:case 11:case 14:case 15:ta(4,a,a.return),na(a,l);break;case 1:Gt(a,a.return);var d=a.stateNode;typeof d.componentWillUnmount=="function"&&Sy(a,a.return,d),na(a,l);break;case 27:(l&2)!==0&&qb(a.stateNode,a.type,a.memoizedProps);case 5:Gt(a,a.return),a.tag!==5&&a.tag!==27||Bo(a),na(a,l);break;case 6:Bo(a);break;case 26:Gt(a,a.return),d=a.stateNode,a.memoizedState!==null||d===null||st||d.parentNode.removeChild(d),na(a,l);break;case 22:a.memoizedState===null&&na(a,l);break;case 30:Gt(a,a.return),na(a,l);break;case 7:Gt(a,a.return);default:na(a,l)}e=e.sibling}}function Vn(e,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var l=n.alternate,d=e,h=n,S=h.flags,M=(a&1)!==0;switch(h.tag){case 0:case 11:case 15:Vn(d,h,a),Ho(4,h);break;case 1:if(Vn(d,h,a),l=h,d=l.stateNode,typeof d.componentDidMount=="function")try{d.componentDidMount()}catch(re){dt(l,l.return,re)}if(l=h,d=l.updateQueue,d!==null){var F=l.stateNode;try{var W=d.shared.hiddenCallbacks;if(W!==null)for(d.shared.hiddenCallbacks=null,d=0;d<W.length;d++)ug(W[d],F)}catch(re){dt(l,l.return,re)}}M&&S&64&&wy(h),ai(h,h.return);break;case 27:(a&2)!==0&&Ty(h);case 5:h.tag!==5&&h.tag!==27||ky(h),Vn(d,h,a),M&&l===null&&S&4&&Cd(h),ai(h,h.return);break;case 6:ky(h);break;case 26:F=h.stateNode,h.memoizedState!==null||F===null||Bt||Af(Xo(F.ownerDocument),h.type,F),Vn(d,h,a),M&&l===null&&S&4&&Cd(h),ai(h,h.return);break;case 12:Vn(d,h,a);break;case 31:Vn(d,h,a),M&&S&4&&Iy(d,h);break;case 13:Vn(d,h,a),M&&S&4&&Hy(d,h);break;case 22:h.memoizedState===null&&Vn(d,h,a),ai(h,h.return);break;case 30:Vn(d,h,a),ai(h,h.return);break;case 7:ai(h,h.return);default:Vn(d,h,a)}n=n.sibling}}function qd(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&To(a))}function Ud(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&To(e))}function In(e,n,a,l){var d=(a&335544064)===a;if(n.subtreeFlags&(d?10262:10256))for(n=n.child;n!==null;)Fy(e,n,a,l),n=n.sibling;else d&&Ny(n)}function Fy(e,n,a,l){var d=(a&335544064)===a;d&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Ms(n);var h=n.flags;switch(n.tag){case 0:case 11:case 15:In(e,n,a,l),h&2048&&Ho(9,n);break;case 1:In(e,n,a,l);break;case 3:In(e,n,a,l),d&&Id&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),h&2048&&(h=null,n.alternate!==null&&(h=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==h&&(n.refCount++,h!=null&&To(h)));break;case 12:if(h&2048){In(e,n,a,l),h=n.stateNode;try{var S=n.memoizedProps,M=S.id,F=S.onPostCommit;typeof F=="function"&&F(M,n.alternate===null?"mount":"update",h.passiveEffectDuration,-0)}catch(W){dt(n,n.return,W)}}else In(e,n,a,l);break;case 31:In(e,n,a,l);break;case 13:In(e,n,a,l);break;case 23:break;case 22:S=n.stateNode,M=n.alternate,n.memoizedState!==null?(d&&M!==null&&M.memoizedState===null&&Ms(M),S._visibility&2?In(e,n,a,l):Uo(e,n)):(d&&M!==null&&M.memoizedState!==null&&Ms(n),S._visibility&2?In(e,n,a,l):(S._visibility|=2,Nr(e,n,a,l,(n.subtreeFlags&10256)!==0||!1))),h&2048&&qd(M,n);break;case 24:In(e,n,a,l),h&2048&&Ud(n.alternate,n);break;case 30:d&&(h=n.alternate,h!==null&&(oi(h.child,!0),oi(n.child,!0))),In(e,n,a,l);break;default:In(e,n,a,l)}}function Nr(e,n,a,l,d){for(d=d&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var h=e,S=n,M=a,F=l,W=S.flags;switch(S.tag){case 0:case 11:case 15:Nr(h,S,M,F,d),Ho(8,S);break;case 23:break;case 22:var re=S.stateNode;S.memoizedState!==null?re._visibility&2?Nr(h,S,M,F,d):Uo(h,S):(re._visibility|=2,Nr(h,S,M,F,d)),d&&W&2048&&qd(S.alternate,S);break;case 24:Nr(h,S,M,F,d),d&&W&2048&&Ud(S.alternate,S);break;default:Nr(h,S,M,F,d)}n=n.sibling}}function Uo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,l=n,d=l.flags;switch(l.tag){case 22:Uo(a,l),d&2048&&qd(l.alternate,l);break;case 24:Uo(a,l),d&2048&&Ud(l.alternate,l);break;default:Uo(a,l)}n=n.sibling}}var Fa=8192;function Pa(e,n,a){if(e.subtreeFlags&Fa)for(e=e.child;e!==null;)Py(e,n,a),e=e.sibling}function Py(e,n,a){switch(e.tag){case 26:Pa(e,n,a),e.flags&Fa&&(e.memoizedState!==null?iA(a,Pn,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&Zb(a,e)));break;case 5:Pa(e,n,a),e.flags&Fa&&(e=e.stateNode,(n&335544128)===n&&Zb(a,e));break;case 3:case 4:var l=Pn;Pn=Xo(e.stateNode.containerInfo),Pa(e,n,a),Pn=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Fa,Fa=16777216,Pa(e,n,a),Fa=l):Pa(e,n,a));break;case 30:if((e.flags&Fa)!==0&&(l=e.memoizedProps.name,l!=null&&l!=="auto")){var d=e.stateNode;d.paired=null,Sn===null&&(Sn=new Map),Sn.set(l,d)}Pa(e,n,a);break;default:Pa(e,n,a)}}function Vy(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Fo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var l=n[a];qt=l,$y(l,e)}Vy(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Gy(e),e=e.sibling}function Gy(e){switch(e.tag){case 0:case 11:case 15:Fo(e),e.flags&2048&&ta(9,e,e.return);break;case 3:Fo(e);break;case 12:Fo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,js(e)):Fo(e);break;default:Fo(e)}}function js(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var l=n[a];qt=l,$y(l,e)}Vy(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:ta(8,n,n.return),js(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,js(n));break;default:js(n)}e=e.sibling}}function $y(e,n){for(;qt!==null;){var a=qt;switch(a.tag){case 0:case 11:case 15:ta(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:To(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,qt=l;else e:for(a=e;qt!==null;){l=qt;var d=l.sibling,h=l.return;if(zy(l),l===a){qt=null;break e}if(d!==null){d.return=h,qt=d;break e}qt=h}}}var KS={getCacheForType:function(e){var n=Ft(Rt),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Ft(Rt).controller.signal}},WS=typeof WeakMap=="function"?WeakMap:Map,ot=0,gt=null,We=null,nt=0,ct=0,kn=null,ia=!1,Dr=!1,Fd=!1,Oi=0,Tt=0,aa=0,Va=0,Ls=0,An=0,Or=0,Po=null,cn=null,Pd=!1,zs=0,Yy=0,_s=1/0,Is=null,ra=null,kt=0,Gn=null,Ga=null,ci=0,Vd=0,Gd=null,Jy=null,jr=null,Lr=null,zr=null,Vo=0,Hs=null;function Tn(){return(ot&2)!==0&&nt!==0?nt&-nt:le.T!==null?tf():Qm()}function Xy(){if(An===0)if((nt&536870912)===0||Ke){var e=Ol;Ol<<=1,(Ol&3932160)===0&&(Ol=262144),An=e}else An=536870912;return e=Pt.current,e!==null&&(e.flags|=32),An}function _r(e,n){if(n!=null){var a=e.stateNode,l=a.ref;l===null&&(l=a.ref=Mb(Si(e.memoizedProps,a))),Lr===null&&(Lr=[]),Lr.push(n.bind(null,l))}}function dn(e,n,a){(e===gt&&(ct===2||ct===9)||e.cancelPendingCommit!==null)&&(Ir(e,0),oa(e,nt,An,!1)),co(e,a),((ot&2)===0||e!==gt)&&(e===gt&&((ot&2)===0&&(Va|=a),Tt===4&&oa(e,nt,An,!1)),di(e))}function Zy(e,n,a){if((ot&6)!==0)throw Error(o(327));var l=!a&&(n&127)===0&&(n&e.expiredLanes)===0||uo(e,n),d=l?nk(e,n):Yd(e,n,!0),h=l;do{if(d===0){Dr&&!l&&oa(e,n,0,!1);break}else{if(a=e.current.alternate,h&&!ek(a)){d=Yd(e,n,!1),h=!1;continue}if(d===2){if(h=n,e.errorRecoveryDisabledLanes&h)var S=0;else S=e.pendingLanes&-536870913,S=S!==0?S:S&536870912?536870912:0;if(S!==0){n=S;e:{var M=e;d=Po;var F=M.current.memoizedState.isDehydrated;if(F&&(Ir(M,S).flags|=256),S=Yd(M,S,!1),S!==2&&S!==6){if(Fd&&!F){M.errorRecoveryDisabledLanes|=h,Va|=h,d=4;break e}h=cn,cn=d,h!==null&&(cn===null?cn=h:cn.push.apply(cn,h))}d=S}if(h=!1,d!==2)continue}}if(d===1){Ir(e,0),oa(e,n,0,!0);break}e:{switch(l=e,h=d,h){case 0:case 1:throw Error(o(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:oa(l,n,An,!ia);break e;case 2:cn=null;break;case 3:case 5:break;default:throw Error(o(329))}if((n&62914560)===n&&(d=zs+300-pt(),10<d)){if(oa(l,n,An,!ia),Ll(l,0,!0)!==0)break e;ci=n,l.timeoutHandle=hf(Qy.bind(null,l,a,cn,Is,Pd,n,An,Va,Or,ia,h,"Throttled",-0,0),d);break e}Qy(l,a,cn,Is,Pd,n,An,Va,Or,ia,h,null,-0,0)}}break}while(!0);di(e)}function Qy(e,n,a,l,d,h,S,M,F,W,re,fe,Y,ae){e.timeoutHandle=-1;var Te=n.subtreeFlags,_e=(h&335544064)===h;if(fe=null,(_e||Te&8192||(Te&16785408)===16785408)&&(fe={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ti},Sn=null,Py(n,h,fe),_e&&(Te=fe,_e=e.containerInfo,_e=(_e.nodeType===9?_e:_e.ownerDocument).__reactViewTransition,_e!=null&&(Te.count++,Te.waitingForViewTransition=!0,Te=Ko.bind(Te),_e.finished.then(Te,Te))),Te=(h&62914560)===h?zs-pt():(h&4194048)===h?Yy-pt():0,Te=aA(fe,Te),Te!==null)){ci=h,e.cancelPendingCommit=Te(rb.bind(null,e,n,h,a,l,d,S,M,F,W,re,fe,null,Y,ae)),oa(e,h,S,!W);return}rb(e,n,h,a,l,d,S,M,F,W,re,fe)}function ek(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var d=a[l],h=d.getSnapshot;d=d.value;try{if(!xn(h(),d))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function oa(e,n,a,l){n=$m(e,n),n&=~Ls,n&=~Va,e.suspendedLanes|=n,e.pingedLanes&=~n,l&&(e.warmLanes|=n),l=e.expirationTimes;for(var d=n;0<d;){var h=31-bn(d),S=1<<h;l[h]=-1,d&=~S}a!==0&&Jm(e,a,n)}function Bs(){return(ot&6)===0?(Go(0),!1):!0}function $d(){if(We!==null){if(ct===0)var e=We.return;else e=We,Ei=Oa=null,ed(e),kr=null,Ro=0,e=We;for(;e!==null;)xy(e.alternate,e),e=e.return;We=null}}function Ir(e,n){var a=e.timeoutHandle;return a!==-1&&(e.timeoutHandle=-1,Ak(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ci=0,$d(),gt=e,We=a=Ai(e.current,null),nt=n,ct=0,kn=null,ia=!1,Dr=uo(e,n),Fd=!1,Or=An=Ls=Va=aa=Tt=0,cn=Po=null,Pd=!1,Oi=$m(e,n),Yl(),a}function Ky(e,n){Xe=null,le.H=bs,n===Sr||n===as?(n=rg(),ct=3):n===Uc?(n=rg(),ct=4):ct=n===pd?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,kn=n,We===null&&(Tt=1,vs(e,jn(n,e.current)))}function Wy(){var e=Pt.current;return e===null?!0:(nt&4194048)===nt?Xt===null:(nt&62914560)===nt||(nt&536870912)!==0?e===Xt:!1}function eb(){var e=le.H;return le.H=bs,e===null?bs:e}function tb(){var e=le.A;return le.A=KS,e}function qs(){Tt=4,ia||(nt&4194048)!==nt&&Pt.current!==null||(Dr=!0),(aa&134217727)===0&&(Va&134217727)===0||gt===null||oa(gt,nt,An,!1)}function Yd(e,n,a){var l=ot;ot|=2;var d=eb(),h=tb();(gt!==e||nt!==n)&&(Is=null,Ir(e,n)),n=!1;var S=Tt;e:do try{if(ct!==0&&We!==null){var M=We,F=kn;switch(ct){case 8:$d(),S=6;break e;case 3:case 2:case 9:case 6:Pt.current===null&&(n=!0);var W=ct;if(ct=0,kn=null,Hr(e,M,F,W),a&&Dr){S=0;break e}break;default:W=ct,ct=0,kn=null,Hr(e,M,F,W)}}tk(),S=Tt;break}catch(re){Ky(e,re)}while(!0);return n&&e.shellSuspendCounter++,Ei=Oa=null,ot=l,le.H=d,le.A=h,We===null&&(gt=null,nt=0,Yl()),S}function tk(){for(;We!==null;)nb(We)}function nk(e,n){var a=ot;ot|=2;var l=eb(),d=tb();gt!==e||nt!==n?(Is=null,_s=pt()+500,Ir(e,n)):Dr=uo(e,n);e:do try{if(ct!==0&&We!==null){n=We;var h=kn;t:switch(ct){case 1:ct=0,kn=null,Hr(e,n,h,1);break;case 2:case 9:if(ig(h)){ct=0,kn=null,ib(n);break}n=function(){ct!==2&&ct!==9||gt!==e||(ct=7),di(e)},h.then(n,n);break e;case 3:ct=7;break e;case 4:ct=5;break e;case 7:ig(h)?(ct=0,kn=null,ib(n)):(ct=0,kn=null,Hr(e,n,h,7));break;case 5:var S=null;switch(We.tag){case 26:S=We.memoizedState;case 5:case 27:var M=We;if(S?Jb(S):M.stateNode.complete){ct=0,kn=null;var F=M.sibling;if(F!==null)We=F;else{var W=M.return;W!==null?(We=W,Us(W)):We=null}break t}}ct=0,kn=null,Hr(e,n,h,5);break;case 6:ct=0,kn=null,Hr(e,n,h,6);break;case 8:$d(),Tt=6;break e;default:throw Error(o(462))}}ik();break}catch(re){Ky(e,re)}while(!0);return Ei=Oa=null,le.H=l,le.A=d,ot=a,We!==null?0:(gt=null,nt=0,Yl(),Tt)}function ik(){for(;We!==null&&!yi();)nb(We)}function nb(e){var n=by(e.alternate,e,Oi);e.memoizedProps=e.pendingProps,n===null?Us(e):We=n}function ib(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=dy(a,n,n.pendingProps,n.type,void 0,nt);break;case 11:n=dy(a,n,n.pendingProps,n.type.render,n.ref,nt);break;case 5:ed(n);var l=n;l===Ht&&(Ke?(Wl(l),l.tag===5&&l.stateNode!=null&&(bt=l.stateNode)):(Wl(l),Ke=!0));default:xy(a,n),n=We=$p(n,Oi),n=by(a,n,Oi)}e.memoizedProps=e.pendingProps,n===null?Us(e):We=n}function Hr(e,n,a,l){Ei=Oa=null,ed(n),kr=null,Ro=0;var d=n.return;try{if(VS(e,d,n,a,nt)){Tt=1,vs(e,jn(a,e.current)),We=null;return}}catch(h){if(d!==null)throw We=d,h;Tt=1,vs(e,jn(a,e.current)),We=null;return}n.flags&32768?(Ke||l===1?e=!0:Dr||(nt&536870912)!==0?e=!1:(ia=e=!0,(l===2||l===9||l===3||l===6)&&(l=Pt.current,l!==null&&l.tag===13&&(l.flags|=16384))),ab(n,e)):Us(n)}function Us(e){var n=e;do{if((n.flags&32768)!==0){ab(n,ia);return}e=n.return;var a=JS(n.alternate,n,Oi);if(a!==null){We=a;return}if(n=n.sibling,n!==null){We=n;return}We=n=e}while(n!==null);Tt===0&&(Tt=5)}function ab(e,n){do{var a=XS(e.alternate,e);if(a!==null){a.flags&=32767,We=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){We=e;return}We=e=a}while(e!==null);Tt=6,We=null}function rb(e,n,a,l,d,h,S,M,F,W,re,fe){e.cancelPendingCommit=null;do Fs();while(kt!==0);if((ot&6)!==0)throw Error(o(327));if(n!==null){if(n===e.current)throw Error(o(177));e===gt&&(We=gt=null,nt=0),Ga=n,Gn=e,ci=a,Gd=d,Jy=l,ak(e,n,a,S,M,F,fe)}}function ak(e,n,a,l,d,h,S){var M=n.lanes|n.childLanes;if(Vd=M,M|=Rc,N1(e,a,M,l,d,h),Lr=null,(a&335544064)===a?(zr=OS(e),l=10262):(zr=null,l=10256),(n.subtreeFlags&l)!==0||(n.flags&l)!==0?(e.callbackNode=null,e.callbackPriority=0,ck(Nl,function(){return Qd(),null})):(e.callbackNode=null,e.callbackPriority=0),Cs=!1,l=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||l){l=le.T,le.T=null,d=se.p,se.p=2,h=ot,ot|=4;try{ZS(e,n,a)}finally{ot=h,se.p=d,le.T=l}}kt=1,Cs?jr=Nk(S,e.containerInfo,zr,Jd,Xd,ok,Zd,Qd,rk):(Jd(),Xd(),Zd())}function rk(e){if(kt!==0){var n=Gn.onRecoverableError;n(e,{componentStack:null})}}function ok(){kt===3&&(kt=0,Uy(Ga,Gn),kt=4)}function Jd(){if(kt===1){kt=0;var e=Gn,n=Ga,a=ci,l=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||l){l=le.T,le.T=null;var d=se.p;se.p=2;var h=ot;ot|=4;try{qo=Ns=!1,By(n,e,a),a=cf;var S=_p(e.containerInfo),M=a.focusedElem,F=a.selectionRange;if(S!==M&&M&&M.ownerDocument&&zp(M.ownerDocument.documentElement,M)){if(F!==null&&kc(M)){var W=F.start,re=F.end;if(re===void 0&&(re=W),"selectionStart"in M)M.selectionStart=W,M.selectionEnd=Math.min(re,M.value.length);else{var fe=M.ownerDocument||document,Y=fe&&fe.defaultView||window;if(Y.getSelection){var ae=Y.getSelection(),Te=M.textContent.length,_e=Math.min(F.start,Te),Ze=F.end===void 0?_e:Math.min(F.end,Te);!ae.extend&&_e>Ze&&(S=Ze,Ze=_e,_e=S);var Q=Lp(M,_e),G=Lp(M,Ze);if(Q&&G&&(ae.rangeCount!==1||ae.anchorNode!==Q.node||ae.anchorOffset!==Q.offset||ae.focusNode!==G.node||ae.focusOffset!==G.offset)){var te=fe.createRange();te.setStart(Q.node,Q.offset),ae.removeAllRanges(),_e>Ze?(ae.addRange(te),ae.extend(G.node,G.offset)):(te.setEnd(G.node,G.offset),ae.addRange(te))}}}}for(fe=[],ae=M;ae=ae.parentNode;)ae.nodeType===1&&fe.push({element:ae,left:ae.scrollLeft,top:ae.scrollTop});for(typeof M.focus=="function"&&M.focus(),M=0;M<fe.length;M++){var de=fe[M];de.element.scrollLeft=de.left,de.element.scrollTop=de.top}}$r=!!uf,cf=uf=null}finally{ot=h,se.p=d,le.T=l}}e.current=n,kt=2}}function Xd(){if(kt===2){kt=0;var e=Gn,n=Ga,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=le.T,le.T=null;var l=se.p;se.p=2;var d=ot;ot|=4;try{jy(e,n.alternate,n)}finally{ot=d,se.p=l,le.T=a}}kt=3}}function Zd(){if(kt===4||kt===3){kt=0;var e=jr;jr=null,Je();var n=Gn,a=Ga,l=ci,d=Jy,h=(l&335544064)===l?10262:10256;if((a.subtreeFlags&h)!==0||(a.flags&h)!==0?kt=5:(kt=0,Ga=Gn=null,ob(n,n.pendingLanes)),h=n.pendingLanes,h===0&&(ra=null),rc(l),a=a.stateNode,yn&&typeof yn.onCommitFiberRoot=="function")try{yn.onCommitFiberRoot(so,a,void 0,(a.current.flags&128)===128)}catch{}if(d!==null){a=le.T,h=se.p,se.p=2,le.T=null;try{for(var S=n.onRecoverableError,M=0;M<d.length;M++){var F=d[M];S(F.value,{componentStack:F.stack})}}finally{le.T=a,se.p=h}}if(d=Lr,S=zr,zr=null,d!==null&&(Lr=null,S===null&&(S=[]),e!==null))for(F=0;F<d.length;F++)a=(0,d[F])(S),a!==void 0&&e.finished.finally(a);(ci&3)!==0&&Fs(),di(n),h=n.pendingLanes,(l&261930)!==0&&(h&42)!==0?n===Hs?Vo++:(Vo=0,Hs=n):(Vo=0,Hs=null),Go(0)}}function ob(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,To(n)))}function Fs(){return jr!==null&&(jr.skipTransition(),jr=null),Jd(),Xd(),Zd(),Qd()}function Qd(){if(kt!==5)return!1;var e=Gn,n=Vd;Vd=0;var a=rc(ci),l=le.T,d=se.p;try{se.p=32>a?32:a,le.T=null,a=Gd,Gd=null;var h=Gn,S=ci;if(kt=0,Ga=Gn=null,ci=0,(ot&6)!==0)throw Error(o(331));var M=ot;if(ot|=4,Gy(h.current),Fy(h,h.current,S,a),ot=M,Go(0,!1),yn&&typeof yn.onPostCommitFiberRoot=="function")try{yn.onPostCommitFiberRoot(so,h)}catch{}return!0}finally{se.p=d,le.T=l,ob(e,n)}}function lb(e,n,a){n=jn(a,n),n=md(e.stateNode,n,2),e=Qi(e,n,2),e!==null&&(co(e,2),di(e))}function dt(e,n,a){if(e.tag===3)lb(e,e,a);else for(;n!==null;){if(n.tag===3){lb(n,e,a);break}else if(n.tag===1){var l=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(ra===null||!ra.has(l))){e=jn(a,e),a=iy(2),l=Qi(n,a,2),l!==null&&(ay(a,l,n,e),co(l,2),di(l));break}}n=n.return}}function Kd(e,n,a){var l=e.pingCache;if(l===null){l=e.pingCache=new WS;var d=new Set;l.set(n,d)}else d=l.get(n),d===void 0&&(d=new Set,l.set(n,d));d.has(a)||(Fd=!0,d.add(a),e=lk.bind(null,e,n,a),n.then(e,e))}function lk(e,n,a){var l=e.pingCache;l!==null&&l.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,gt===e&&(nt&a)===a&&((Tt===4||Tt===3&&(nt&62914560)===nt&&300>pt()-zs)&&(ot&2)===0?Ir(e,0):Ls|=a,Or===nt&&(Or=0)),di(e)}function sb(e,n){n===0&&(n=Ym()),e=Ma(e,n),e!==null&&(co(e,n),di(e))}function sk(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),sb(e,a)}function uk(e,n){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,d=e.memoizedState;d!==null&&(a=d.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(o(314))}l!==null&&l.delete(n),sb(e,a)}function ck(e,n){return St(e,n)}var Br=null,qr=null,Wd=!1,Ps=!1,ef=!1,la=0;function di(e){e!==qr&&e.next===null&&(qr===null?Br=qr=e:qr=qr.next=e),Ps=!0,Wd||(Wd=!0,fk())}function Go(e,n){if(!ef&&Ps){ef=!0;do for(var a=!1,l=Br;l!==null;){if(e!==0){var d=l.pendingLanes;if(d===0)var h=0;else{var S=l.suspendedLanes,M=l.pingedLanes;h=(1<<31-bn(42|e)+1)-1,h&=d&~(S&~M),h=h&201326741?h&201326741|1:h?h|2:0}h!==0&&(a=!0,fb(l,h))}else h=nt,h=Ll(l,l===gt?h:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(h&3)===0||uo(l,h)||(a=!0,fb(l,h));l=l.next}while(a);ef=!1}}function dk(){ub()}function ub(){Ps=Wd=!1;var e=0;la!==0&&kk()&&(e=la);for(var n=pt(),a=null,l=Br;l!==null;){var d=l.next,h=cb(l,n);h===0?(l.next=null,a===null?Br=d:a.next=d,d===null&&(qr=a)):(a=l,(e!==0||(h&3)!==0)&&(Ps=!0)),l=d}kt!==0&&kt!==5||Go(e),la!==0&&(la=0)}function cb(e,n){for(var a=e.suspendedLanes,l=e.pingedLanes,d=e.expirationTimes,h=e.pendingLanes&-62914561;0<h;){var S=31-bn(h),M=1<<S,F=d[S];F===-1?((M&a)===0||(M&l)!==0)&&(d[S]=M1(M,n)):F<=n&&(e.expiredLanes|=M),h&=~M}if(n=gt,a=nt,a=Ll(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===n&&(ct===2||ct===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&ht(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||uo(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(l!==null&&ht(l),rc(a)){case 2:case 8:a=Nn;break;case 32:a=Nl;break;case 268435456:a=Gm;break;default:a=Nl}return l=db.bind(null,e),a=St(a,l),e.callbackPriority=n,e.callbackNode=a,n}return l!==null&&l!==null&&ht(l),e.callbackPriority=2,e.callbackNode=null,2}function db(e,n){if(kt!==0&&kt!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Fs()&&e.callbackNode!==a)return null;var l=nt;return l=Ll(e,e===gt?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Zy(e,l,n),cb(e,pt()),e.callbackNode!=null&&e.callbackNode===a?db.bind(null,e):null)}function fb(e,n){if(Fs())return null;Zy(e,n,!0)}function fk(){Tk(function(){(ot&6)!==0?St(bi,dk):ub()})}function tf(){if(la===0){var e=za;e===0&&(e=Dl,Dl<<=1,(Dl&261888)===0&&(Dl=256)),la=e}return la}function hb(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Bl(e)}function hk(e,n,a,l,d){if(n==="submit"&&a&&a.stateNode===d){var h=hb((d[on]||null).action),S=l.submitter;S&&(n=(n=S[on]||null)?hb(n.formAction):S.getAttribute("formAction"),n!==null&&(h=n,S=null));var M=new Pl("action","action",null,l,d);e.push({event:M,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(la!==0){var F=new FormData(d,S);ud(a,{pending:!0,data:F,method:d.method,action:h},null,F)}}else typeof h=="function"&&(M.preventDefault(),F=new FormData(d,S),ud(a,{pending:!0,data:F,method:d.method,action:h},h,F))},currentTarget:d}]})}}for(var nf=0;nf<Cc.length;nf++){var af=Cc[nf],mk=af.toLowerCase(),pk=af[0].toUpperCase()+af.slice(1);Un(mk,"on"+pk)}Un(Bp,"onAnimationEnd"),Un(qp,"onAnimationIteration"),Un(Up,"onAnimationStart"),Un("dblclick","onDoubleClick"),Un("focusin","onFocus"),Un("focusout","onBlur"),Un(AS,"onTransitionRun"),Un(TS,"onTransitionStart"),Un(ES,"onTransitionCancel"),Un(Fp,"onTransitionEnd"),sr("onMouseEnter",["mouseout","mouseover"]),sr("onMouseLeave",["mouseout","mouseover"]),sr("onPointerEnter",["pointerout","pointerover"]),sr("onPointerLeave",["pointerout","pointerover"]),Ea("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ea("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ea("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ea("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ea("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ea("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var $o="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gk=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($o));function mb(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],d=l.event;l=l.listeners;e:{var h=void 0;if(n)for(var S=l.length-1;0<=S;S--){var M=l[S],F=M.instance,W=M.currentTarget;if(M=M.listener,F!==h&&d.isPropagationStopped())break e;h=M,d.currentTarget=W;try{h(d)}catch(re){$l(re)}d.currentTarget=null,h=F}else for(S=0;S<l.length;S++){if(M=l[S],F=M.instance,W=M.currentTarget,M=M.listener,F!==h&&d.isPropagationStopped())break e;h=M,d.currentTarget=W;try{h(d)}catch(re){$l(re)}d.currentTarget=null,h=F}}}}function et(e,n){var a=n[Wm];a===void 0&&(a=n[Wm]=new Set);var l=e+"__bubble";a.has(l)||(pb(n,e,2,!1),a.add(l))}function rf(e,n,a){var l=0;n&&(l|=4),pb(a,e,l,n)}var Vs="_reactListening"+Math.random().toString(36).slice(2);function of(e){if(!e[Vs]){e[Vs]=!0,np.forEach(function(a){a!=="selectionchange"&&(gk.has(a)||rf(a,!1,e),rf(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[Vs]||(n[Vs]=!0,rf("selectionchange",!1,n))}}function pb(e,n,a,l){switch(av(n)){case 2:var d=sA;break;case 8:d=uA;break;default:d=Ef}a=d.bind(null,n,a,e),d=void 0,!hc||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(d=!0),l?d!==void 0?e.addEventListener(n,a,{capture:!0,passive:d}):e.addEventListener(n,a,!0):d!==void 0?e.addEventListener(n,a,{passive:d}):e.addEventListener(n,a,!1)}function lf(e,n,a,l,d){var h=l;if((n&1)===0&&(n&2)===0&&l!==null)e:for(;;){if(l===null)return;var S=l.tag;if(S===3||S===4){var M=l.stateNode.containerInfo;if(M===d)break;if(S===4)for(S=l.return;S!==null;){var F=S.tag;if((F===3||F===4)&&S.stateNode.containerInfo===d)return;S=S.return}for(;M!==null;){if(S=Ta(M),S===null)return;if(F=S.tag,F===5||F===6||F===26||F===27){l=h=S;continue e}M=M.parentNode}}l=l.return}pp(function(){var W=h,re=dc(a),fe=[];e:{var Y=Pp.get(e);if(Y!==void 0){var ae=Pl,Te=e;switch(e){case"keypress":if(Ul(a)===0)break e;case"keydown":case"keyup":ae=eS;break;case"focusin":Te="focus",ae=yc;break;case"focusout":Te="blur",ae=yc;break;case"beforeblur":case"afterblur":ae=yc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ae=bp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ae=F1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ae=rS;break;case Bp:case qp:case Up:ae=G1;break;case Fp:ae=lS;break;case"scroll":case"scrollend":ae=q1;break;case"wheel":ae=uS;break;case"copy":case"cut":case"paste":ae=Y1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ae=xp;break;case"submit":ae=iS;break;case"toggle":case"beforetoggle":ae=dS}var _e=(n&4)!==0,Ze=!_e&&(e==="scroll"||e==="scrollend"),Q=_e?Y!==null?Y+"Capture":null:Y;_e=[];for(var G=W,te;G!==null;){var de=G;if(te=de.stateNode,de=de.tag,de!==5&&de!==26&&de!==27||te===null||Q===null||(de=mo(G,Q),de!=null&&_e.push(Yo(G,de,te))),Ze)break;G=G.return}0<_e.length&&(Y=new ae(Y,Te,null,a,re),fe.push({event:Y,listeners:_e}))}}if((n&7)===0){e:{if(ae=e==="mouseover"||e==="pointerover",Y=e==="mouseout"||e==="pointerout",ae&&a!==cc&&(Te=a.relatedTarget||a.fromElement)&&(Ta(Te)||Te[rr]))break e;(Y||ae)&&(Te=re.window===re?re:(ae=re.ownerDocument)?ae.defaultView||ae.parentWindow:window,Y?(ae=a.relatedTarget||a.toElement,Y=W,ae=ae?Ta(ae):null,ae!==null&&(Ze=u(ae),_e=ae.tag,ae!==Ze||_e!==5&&_e!==27&&_e!==6)&&(ae=null)):(Y=null,ae=W),Y!==ae&&(_e=bp,de="onMouseLeave",Q="onMouseEnter",G="mouse",(e==="pointerout"||e==="pointerover")&&(_e=xp,de="onPointerLeave",Q="onPointerEnter",G="pointer"),Ze=Y==null?Te:ho(Y),te=ae==null?Te:ho(ae),Te=new _e(de,G+"leave",Y,a,re),Te.target=Ze,Te.relatedTarget=te,de=null,Ta(re)===W&&(_e=new _e(Q,G+"enter",ae,a,re),_e.target=te,_e.relatedTarget=Ze,de=_e),Ze=de,_e=Y&&ae?j(Y,ae,yk):null,Y!==null&&gb(fe,Te,Y,_e,!1),ae!==null&&Ze!==null&&gb(fe,Ze,ae,_e,!0)))}e:{if(Y=W?ho(W):window,ae=Y.nodeName&&Y.nodeName.toLowerCase(),ae==="select"||ae==="input"&&Y.type==="file")var Oe=Rp;else if(Ep(Y))if(Mp)Oe=wS;else{Oe=vS;var it=bS}else ae=Y.nodeName,!ae||ae.toLowerCase()!=="input"||Y.type!=="checkbox"&&Y.type!=="radio"?W&&uc(W.elementType)&&(Oe=Rp):Oe=xS;if(Oe&&(Oe=Oe(e,W))){Cp(fe,Oe,a,re);break e}it&&it(e,Y,W)}switch(it=W?ho(W):window,e){case"focusin":(Ep(it)||it.contentEditable==="true")&&(mr=it,Ac=W,So=null);break;case"focusout":So=Ac=mr=null;break;case"mousedown":Tc=!0;break;case"contextmenu":case"mouseup":case"dragend":Tc=!1,Ip(fe,a,re);break;case"selectionchange":if(kS)break;case"keydown":case"keyup":Ip(fe,a,re)}var Ie;if(vc)e:{switch(e){case"compositionstart":var Ue="onCompositionStart";break e;case"compositionend":Ue="onCompositionEnd";break e;case"compositionupdate":Ue="onCompositionUpdate";break e}Ue=void 0}else hr?Ap(e,a)&&(Ue="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Ue="onCompositionStart");Ue&&(wp&&a.locale!=="ko"&&(hr||Ue!=="onCompositionStart"?Ue==="onCompositionEnd"&&hr&&(Ie=gp()):(Fi=re,mc="value"in Fi?Fi.value:Fi.textContent,hr=!0)),it=Gs(W,Ue),0<it.length&&(Ue=new vp(Ue,e,null,a,re),fe.push({event:Ue,listeners:it}),Ie?Ue.data=Ie:(Ie=Tp(a),Ie!==null&&(Ue.data=Ie)))),(Ie=hS?mS(e,a):pS(e,a))&&(Ue=Gs(W,"onBeforeInput"),0<Ue.length&&(it=new vp("onBeforeInput","beforeinput",null,a,re),fe.push({event:it,listeners:Ue}),it.data=Ie)),hk(fe,e,W,a,re)}mb(fe,n)})}function Yo(e,n,a){return{instance:e,listener:n,currentTarget:a}}function Gs(e,n){for(var a=n+"Capture",l=[];e!==null;){var d=e,h=d.stateNode;if(d=d.tag,d!==5&&d!==26&&d!==27||h===null||(d=mo(e,a),d!=null&&l.unshift(Yo(e,d,h)),d=mo(e,n),d!=null&&l.push(Yo(e,d,h))),e.tag===3)return l;e=e.return}return[]}function yk(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function gb(e,n,a,l,d){for(var h=n._reactName,S=[];a!==null&&a!==l;){var M=a,F=M.alternate,W=M.stateNode;if(M=M.tag,F!==null&&F===l)break;M!==5&&M!==26&&M!==27||W===null||(F=W,d?(W=mo(a,h),W!=null&&S.unshift(Yo(a,W,F))):d||(W=mo(a,h),W!=null&&S.push(Yo(a,W,F)))),a=a.return}S.length!==0&&e.push({event:n,listeners:S})}var bk=/\r\n?/g,vk=/\u0000|\uFFFD/g;function yb(e){return(typeof e=="string"?e:""+e).replace(bk,`
`).replace(vk,"")}function bb(e,n){return n=yb(n),yb(e)===n}function ft(e,n,a,l,d,h){switch(a){case"children":if(typeof l=="string")n==="body"||n==="textarea"&&l===""||cr(e,l);else if(typeof l=="number"||typeof l=="bigint")n!=="body"&&cr(e,""+l);else return;break;case"className":Hl(e,"class",l);break;case"tabIndex":Hl(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Hl(e,a,l);break;case"style":hp(e,l,h);return;case"data":if(n!=="object"){Hl(e,"data",l);break}case"src":case"href":if(l===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=Bl(l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof h=="function"&&(a==="formAction"?(n!=="input"&&ft(e,n,"name",d.name,d,null),ft(e,n,"formEncType",d.formEncType,d,null),ft(e,n,"formMethod",d.formMethod,d,null),ft(e,n,"formTarget",d.formTarget,d,null)):(ft(e,n,"encType",d.encType,d,null),ft(e,n,"method",d.method,d,null),ft(e,n,"target",d.target,d,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=Bl(l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=ti);return;case"onScroll":l!=null&&et("scroll",e);return;case"onScrollEnd":l!=null&&et("scrollend",e);return;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(a=l.__html,a!=null){if(d.children!=null)throw Error(o(60));h?.__html!==a&&(e.innerHTML=a)}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=Bl(l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":et("beforetoggle",e),et("toggle",e),Il(e,"popover",l);break;case"xlinkActuate":xi(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":xi(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":xi(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":xi(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":xi(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":xi(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":xi(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":xi(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":xi(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Il(e,"is",l);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=H1.get(a)||a,Il(e,a,l);else return}rt=!0}function sf(e,n,a,l,d,h){switch(a){case"style":hp(e,l,h);return;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(a=l.__html,a!=null){if(d.children!=null)throw Error(o(60));h?.__html!==a&&(e.innerHTML=a)}}break;case"children":if(typeof l=="string")cr(e,l);else if(typeof l=="number"||typeof l=="bigint")cr(e,""+l);else return;break;case"onScroll":l!=null&&et("scroll",e);return;case"onScrollEnd":l!=null&&et("scrollend",e);return;case"onClick":l!=null&&(e.onclick=ti);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!ip.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(d=a.endsWith("Capture"),h=a.slice(2,d?a.length-7:void 0),n=e[on]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(h,n,d),typeof l=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(h,l,d);break e}rt=!0,a in e?e[a]=l:l===!0?e.setAttribute(a,""):Il(e,a,l)}return}rt=!0}function $t(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":et("error",e),et("load",e);var l=!1,d=!1,h;for(h in a)if(a.hasOwnProperty(h)){var S=a[h];if(S!=null)switch(h){case"src":l=!0;break;case"srcSet":d=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:ft(e,n,h,S,a,null)}}d&&ft(e,n,"srcSet",a.srcSet,a,null),l&&ft(e,n,"src",a.src,a,null);return;case"input":et("invalid",e);var M=h=S=d=null,F=null,W=null;for(l in a)if(a.hasOwnProperty(l)){var re=a[l];if(re!=null)switch(l){case"name":d=re;break;case"type":S=re;break;case"checked":F=re;break;case"defaultChecked":W=re;break;case"value":h=re;break;case"defaultValue":M=re;break;case"children":case"dangerouslySetInnerHTML":if(re!=null)throw Error(o(137,n));break;default:ft(e,n,l,re,a,null)}}up(e,h,M,F,W,S,d,!1);return;case"select":et("invalid",e),l=S=h=null;for(d in a)if(a.hasOwnProperty(d)&&(M=a[d],M!=null))switch(d){case"value":h=M;break;case"defaultValue":S=M;break;case"multiple":l=M;default:ft(e,n,d,M,a,null)}n=h,a=S,e.multiple=!!l,n!=null?ur(e,!!l,n,!1):a!=null&&ur(e,!!l,a,!0);return;case"textarea":et("invalid",e),h=d=l=null;for(S in a)if(a.hasOwnProperty(S)&&(M=a[S],M!=null))switch(S){case"value":l=M;break;case"defaultValue":d=M;break;case"children":h=M;break;case"dangerouslySetInnerHTML":if(M!=null)throw Error(o(91));break;default:ft(e,n,S,M,a,null)}dp(e,l,d,h);return;case"option":for(F in a)a.hasOwnProperty(F)&&(l=a[F],l!=null)&&(F==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":ft(e,n,F,l,a,null));return;case"dialog":et("beforetoggle",e),et("toggle",e),et("cancel",e),et("close",e);break;case"iframe":case"object":et("load",e);break;case"video":case"audio":for(l=0;l<$o.length;l++)et($o[l],e);break;case"image":et("error",e),et("load",e);break;case"details":et("toggle",e);break;case"embed":case"source":case"link":et("error",e),et("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(W in a)if(a.hasOwnProperty(W)&&(l=a[W],l!=null))switch(W){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:ft(e,n,W,l,a,null)}return;default:if(uc(n)){for(re in a)a.hasOwnProperty(re)&&(l=a[re],l!==void 0&&sf(e,n,re,l,a,void 0));return}}for(M in a)a.hasOwnProperty(M)&&(l=a[M],l!=null&&ft(e,n,M,l,a,null))}var xk={};function wk(e,n,a,l){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var d=null,h=null,S=null,M=null,F=null,W=null,re=null;for(ae in a){var fe=a[ae];if(a.hasOwnProperty(ae)&&fe!=null)switch(ae){case"checked":break;case"value":break;case"defaultValue":F=fe;default:l.hasOwnProperty(ae)||ft(e,n,ae,null,l,fe)}}for(var Y in l){var ae=l[Y];if(fe=a[Y],l.hasOwnProperty(Y)&&(ae!=null||fe!=null))switch(Y){case"type":ae!==fe&&(rt=!0),h=ae;break;case"name":ae!==fe&&(rt=!0),d=ae;break;case"checked":ae!==fe&&(rt=!0),W=ae;break;case"defaultChecked":ae!==fe&&(rt=!0),re=ae;break;case"value":ae!==fe&&(rt=!0),S=ae;break;case"defaultValue":ae!==fe&&(rt=!0),M=ae;break;case"children":case"dangerouslySetInnerHTML":if(ae!=null)throw Error(o(137,n));break;default:ae!==fe&&ft(e,n,Y,ae,l,fe)}}lc(e,S,M,F,W,re,h,d);return;case"select":ae=S=M=Y=null;for(h in a)if(F=a[h],a.hasOwnProperty(h)&&F!=null)switch(h){case"value":break;case"multiple":ae=F;default:l.hasOwnProperty(h)||ft(e,n,h,null,l,F)}for(d in l)if(h=l[d],F=a[d],l.hasOwnProperty(d)&&(h!=null||F!=null))switch(d){case"value":h!==F&&(rt=!0),Y=h;break;case"defaultValue":h!==F&&(rt=!0),M=h;break;case"multiple":h!==F&&(rt=!0),S=h;default:h!==F&&ft(e,n,d,h,l,F)}n=M,a=S,l=ae,Y!=null?ur(e,!!a,Y,!1):!!l!=!!a&&(n!=null?ur(e,!!a,n,!0):ur(e,!!a,a?[]:"",!1));return;case"textarea":ae=Y=null;for(M in a)if(d=a[M],a.hasOwnProperty(M)&&d!=null&&!l.hasOwnProperty(M))switch(M){case"value":break;case"children":break;default:ft(e,n,M,null,l,d)}for(S in l)if(d=l[S],h=a[S],l.hasOwnProperty(S)&&(d!=null||h!=null))switch(S){case"value":d!==h&&(rt=!0),Y=d;break;case"defaultValue":d!==h&&(rt=!0),ae=d;break;case"children":break;case"dangerouslySetInnerHTML":if(d!=null)throw Error(o(91));break;default:d!==h&&ft(e,n,S,d,l,h)}cp(e,Y,ae);return;case"option":for(var Te in a)Y=a[Te],a.hasOwnProperty(Te)&&Y!=null&&!l.hasOwnProperty(Te)&&(Te==="selected"?e.selected=!1:ft(e,n,Te,null,l,Y));for(F in l)Y=l[F],ae=a[F],l.hasOwnProperty(F)&&Y!==ae&&(Y!=null||ae!=null)&&(F==="selected"?(Y!==ae&&(rt=!0),e.selected=Y&&typeof Y!="function"&&typeof Y!="symbol"):ft(e,n,F,Y,l,ae));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var _e in a)Y=a[_e],a.hasOwnProperty(_e)&&Y!=null&&!l.hasOwnProperty(_e)&&ft(e,n,_e,null,l,Y);for(W in l)if(Y=l[W],ae=a[W],l.hasOwnProperty(W)&&Y!==ae&&(Y!=null||ae!=null))switch(W){case"children":case"dangerouslySetInnerHTML":if(Y!=null)throw Error(o(137,n));break;default:ft(e,n,W,Y,l,ae)}return;default:if(uc(n)){for(var Ze in a)Y=a[Ze],a.hasOwnProperty(Ze)&&Y!==void 0&&!l.hasOwnProperty(Ze)&&sf(e,n,Ze,void 0,l,Y);for(re in l)Y=l[re],ae=a[re],!l.hasOwnProperty(re)||Y===ae||Y===void 0&&ae===void 0||sf(e,n,re,Y,l,ae);return}}for(var Q in a)Y=a[Q],a.hasOwnProperty(Q)&&Y!=null&&!l.hasOwnProperty(Q)&&ft(e,n,Q,null,l,Y);for(fe in l)Y=l[fe],ae=a[fe],!l.hasOwnProperty(fe)||Y===ae||Y==null&&ae==null||ft(e,n,fe,Y,l,ae)}function vb(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Sk(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var d=a[l],h=d.transferSize,S=d.initiatorType,M=d.duration;if(h&&M&&vb(S)){for(S=0,M=d.responseEnd,l+=1;l<a.length;l++){var F=a[l],W=F.startTime;if(W>M)break;var re=F.transferSize,fe=F.initiatorType;re&&vb(fe)&&(F=F.responseEnd,S+=re*(F<M?1:(M-W)/(F-W)))}if(--l,n+=8*(h+S)/(d.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var uf=null,cf=null;function Jo(e){return e.nodeType===9?e:e.ownerDocument}function xb(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function wb(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function Sb(e,n,a,l){return a=Jo(a).createElement(e),a[Ut]=l,a[on]=n,$t(a,e,n),It(a),a}function df(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var ff=null;function kk(){var e=window.event;return e&&e.type==="popstate"?e===ff?!1:(ff=e,!0):(ff=null,!1)}var hf=typeof setTimeout=="function"?setTimeout:void 0,Ak=typeof clearTimeout=="function"?clearTimeout:void 0,kb=typeof Promise=="function"?Promise:void 0,Ab=typeof requestAnimationFrame=="function"?requestAnimationFrame:hf,Tk=typeof queueMicrotask=="function"?queueMicrotask:typeof kb<"u"?function(e){return kb.resolve(null).then(e).catch(Ek)}:hf;function Ek(e){setTimeout(function(){throw e})}function sa(e){return e==="head"}function Tb(e,n){var a=n,l=0;do{var d=a.nextSibling;if(e.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(d),Yr(n);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")wf(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,wf(a);for(var h=a.firstChild;h;){var S=h.nextSibling,M=h.nodeName;h[fo]||M==="SCRIPT"||M==="STYLE"||M==="LINK"&&h.rel.toLowerCase()==="stylesheet"||a.removeChild(h),h=S}}else a==="body"&&wf(e.ownerDocument.body);a=d}while(a);Yr(n)}function Eb(e,n){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function Cb(e,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,a!=null&&(e.style.viewTransitionClass=a),a=getComputedStyle(e),a.display==="inline"){if(n=e.getClientRects(),n.length===1)var l=1;else for(var d=l=0;d<n.length;d++){var h=n[d];0<h.width&&0<h.height&&l++}l===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+a.paddingTop,e.marginBottom="-"+a.paddingBottom)}}function Rb(e,n){e=e.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(a=n.display,e.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?e.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function Ck(e,n,a){return a=a.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=a.innerHeight&&e.left<=a.innerWidth}}function mf(e){var n=e.getBoundingClientRect(),a=getComputedStyle(e);return Ck(n,a,e)}function Rk(e){return e.documentElement.clientHeight}function Mk(e){this.addEventListener("load",e),this.addEventListener("error",e)}function Nk(e,n,a,l,d,h,S,M,F){var W=n.nodeType===9?n:n.ownerDocument;try{var re=W.startViewTransition({update:function(){var Y=W.defaultView,ae=Y.navigation&&Y.navigation.transition,Te=W.fonts.status;l();var _e=[];if(Te==="loaded"&&(Rk(W),W.fonts.status==="loading"&&_e.push(W.fonts.ready)),Te=_e.length,e!==null)for(var Ze=e.suspenseyImages,Q=0,G=0;G<Ze.length;G++){var te=Ze[G];if(!te.complete){var de=te.getBoundingClientRect();if(0<de.bottom&&0<de.right&&de.top<Y.innerHeight&&de.left<Y.innerWidth){if(Q+=Xb(te),Q>Js){_e.length=Te;break}te=new Promise(Mk.bind(te)),_e.push(te)}}}if(0<_e.length)return Y=Promise.race([Promise.all(_e),new Promise(function(Oe){return setTimeout(Oe,500)})]).then(d,d),(ae?Promise.allSettled([ae.finished,Y]):Y).then(h,h);if(d(),ae)return ae.finished.then(h,h);h()},types:a});W.__reactViewTransition=re;var fe=[];return re.ready.then(function(){for(var Y=W.documentElement.getAnimations({subtree:!0}),ae=0;ae<Y.length;ae++){var Te=Y[ae],_e=Te.effect,Ze=_e.pseudoElement;if(Ze!=null&&Ze.startsWith("::view-transition")){fe.push(Te),Te=_e.getKeyframes();for(var Q=Ze=void 0,G=!0,te=0;te<Te.length;te++){var de=Te[te],Oe=de.width;if(Ze===void 0)Ze=Oe;else if(Ze!==Oe){G=!1;break}if(Oe=de.height,Q===void 0)Q=Oe;else if(Q!==Oe){G=!1;break}delete de.width,delete de.height,de.transform==="none"&&delete de.transform}G&&Ze!==void 0&&Q!==void 0&&(_e.setKeyframes(Te),G=getComputedStyle(_e.target,_e.pseudoElement),G.width!==Ze||G.height!==Q)&&(G=Te[0],G.width=Ze,G.height=Q,G=Te[Te.length-1],G.width=Ze,G.height=Q,_e.setKeyframes(Te))}}S()},function(Y){W.__reactViewTransition===re&&(W.__reactViewTransition=null);try{typeof Y=="object"&&Y!==null&&Y.name==="InvalidStateError"&&(Y.message==="View transition was skipped because document visibility state is hidden."||Y.message==="Skipping view transition because document visibility state has become hidden."||Y.message==="Skipping view transition because viewport size changed."||Y.message==="Transition was aborted because of invalid state")&&(Y=null),Y!==null&&F(Y)}finally{l(),d(),S()}}),re.finished.finally(function(){for(var Y=0;Y<fe.length;Y++)fe[Y].cancel();W.__reactViewTransition===re&&(W.__reactViewTransition=null),M()}),re}catch{return l(),d(),S(),null}}function $a(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}$a.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:L({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},$a.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,a=e.getAnimations({subtree:!0}),l=[],d=0;d<a.length;d++){var h=a[d].effect;h!==null&&h.target===e&&h.pseudoElement===n&&l.push(a[d])}return l},$a.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Mb(e){return{name:e,group:new $a("group",e),imagePair:new $a("image-pair",e),old:new $a("old",e),new:new $a("new",e)}}function En(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}En.prototype.addEventListener=function(e,n,a){var l=null,d=null;if(!(a!=null&&typeof a!="boolean"&&(l=a.signal||null,l!==null&&l.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var h=this._eventListeners;if(Db(h,e,n,a)===-1){var S=this,M=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(M=function(F){S.removeEventListener(e,n,a),typeof n=="function"?n.call(this,F):n.handleEvent(F)}),l!==null&&(d=S.removeEventListener.bind(S,e,n,a),l.addEventListener("abort",d,{once:!0}),d=l.removeEventListener.bind(l,"abort",d)),l=Ur(a),h.push({type:e,listener:n,optionsOrUseCapture:a,attachedListener:M,cleanup:d}),g(this._fragmentFiber.child,!1,Dk,e,M,l)}this._eventListeners=h}};function Dk(e,n,a,l){return A(e).addEventListener(n,a,l),!1}En.prototype.removeEventListener=function(e,n,a){var l=this._eventListeners;if(l!==null&&(n=Db(l,e,n,a),n!==-1)){var d=l[n];a=d.attachedListener;var h=d.cleanup;d=Ur(d.optionsOrUseCapture),g(this._fragmentFiber.child,!1,Ok,e,a,d),l.splice(n,1),h!==null&&h()}};function Ok(e,n,a,l){return A(e).removeEventListener(n,a,l),!1}function Ur(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function Nb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function Db(e,n,a,l){if(e.length===0)return-1;l=Nb(l);for(var d=0;d<e.length;d++){var h=e[d];if(h.type===n&&h.listener===a&&Nb(h.optionsOrUseCapture)===l)return d}return-1}En.prototype.dispatchEvent=function(e){var n=x(this._fragmentFiber);if(n===null)return!0;n=A(n);var a=this._eventListeners;if(a!==null&&0<a.length||!e.bubbles){var l=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var d=0;d<a.length;d++){var h=a[d];l.addEventListener(h.type,h.attachedListener,Ur(h.optionsOrUseCapture))}if(n.appendChild(l),e=l.dispatchEvent(e),a)for(d=0;d<a.length;d++)h=a[d],l.removeEventListener(h.type,h.attachedListener,Ur(h.optionsOrUseCapture));return n.removeChild(l),e}return n.dispatchEvent(e)},En.prototype.focus=function(e){g(this._fragmentFiber.child,!0,Ob,e,void 0,void 0)};function Ob(e,n){return e.tag===6?!1:(e=A(e),Vk(e,n))}En.prototype.focusLast=function(e){var n=[];g(this._fragmentFiber.child,!0,pf,n,void 0,void 0);for(var a=n.length-1;0<=a&&!Ob(n[a],e);a--);};function pf(e,n){return n.push(e),!1}En.prototype.blur=function(){var e=x(this._fragmentFiber);e!==null&&(e=A(e),e=Jo(e).activeElement,e!==null&&g(this._fragmentFiber.child,!1,jk,e,void 0,void 0))};function jk(e,n){return e.tag===6?!1:(e=A(e),e===n||e.contains(n)?(n.blur(),!0):!1)}En.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),g(this._fragmentFiber.child,!1,Lk,e,void 0,void 0)};function Lk(e,n){return e.tag===6||(e=A(e),n.observe(e)),!1}En.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),g(this._fragmentFiber.child,!1,zk,e,void 0,void 0);for(var a=n=0;a<$n.length;a++){var l=$n[a];l.fragmentInstance===this&&l.observer===e?e.unobserve(l.instance):$n[n++]=l}$n.length=n}};function zk(e,n){return e.tag===6||(e=A(e),n.unobserve(e)),!1}var $n=[],gf=!1;function _k(e,n,a){$n.push({fragmentInstance:e,observer:n,instance:a}),gf||(gf=!0,Gk(function(){gf=!1;var l=$n;$n=[];for(var d=0;d<l.length;d++){var h=l[d];h.observer.unobserve(h.instance)}}))}En.prototype.getClientRects=function(){var e=[];return g(this._fragmentFiber.child,!1,Ik,e,void 0,void 0),e};function Ik(e,n){if(e.tag===6){e=e.stateNode;var a=e.ownerDocument.createRange();a.selectNodeContents(e),n.push.apply(n,a.getClientRects())}else e=A(e),n.push.apply(n,e.getClientRects());return!1}En.prototype.getRootNode=function(e){var n=x(this._fragmentFiber);return n===null?this:A(n).getRootNode(e)},En.prototype.compareDocumentPosition=function(e){var n=x(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];g(this._fragmentFiber.child,!1,pf,a,void 0,void 0);var l=A(n);if(a.length===0){if(a=l,b(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var d=l=a.compareDocumentPosition(e);return a===e?d=Node.DOCUMENT_POSITION_CONTAINS:l&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=w(n)[1],a===null?d=Node.DOCUMENT_POSITION_PRECEDING:(e=A(a).compareDocumentPosition(e),d=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),d|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=A(a[0]),d=A(a[a.length-1]);var h=b(this._fragmentFiber)?n.parentElement:l;if(h==null)return Node.DOCUMENT_POSITION_DISCONNECTED;l=h.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,h=h.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_CONTAINED_BY;var S=n.compareDocumentPosition(e),M=d.compareDocumentPosition(e),F=S&Node.DOCUMENT_POSITION_CONTAINED_BY||M&Node.DOCUMENT_POSITION_CONTAINED_BY;return M=l&&h&&S&Node.DOCUMENT_POSITION_FOLLOWING&&M&Node.DOCUMENT_POSITION_PRECEDING,n=l&&n===e||h&&d===e||F||M?Node.DOCUMENT_POSITION_CONTAINED_BY:!l&&n===e||!h&&d===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:S,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Hk(n,this._fragmentFiber,a[0],a[a.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Hk(e,n,a,l,d){var h=Ta(d);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!h)e:{for(;h!==null;){if(h.tag===7&&(h===n||h.alternate===n)){a=!0;break e}h=h.return}a=!1}return a}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(h===null)return h=d.ownerDocument,d===h||d===h.documentElement||d===h.body;e:{for(h=n,n=x(n);h!==null;){if(!(h.tag!==5&&h.tag!==3&&h.tag!==27||h!==n&&h.alternate!==n)){h=!0;break e}h=h.return}h=!1}return h}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!h)&&!(n=h===a)&&(n=j(a,h,z),n===null?n=!1:(g(n,!0,C,h,a),h=k,k=null,n=h!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!h)&&!(n=h===l)&&(n=j(l,h,z),n===null?n=!1:(g(n,!0,D,h,l),h=k,T=k=null,n=h!==null)),n):!1}function jb(e,n){var a=e.ownerDocument.createRange();a.selectNodeContents(e),e=a.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}En.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(o(566));var n=[];g(this._fragmentFiber.child,!1,pf,n,void 0,void 0);var a=e!==!1;if(n.length===0){var l=w(this._fragmentFiber);if(l=a?l[1]||l[0]||x(this._fragmentFiber):l[0]||l[1],l===null)return;if(l.tag===6){e=A(l),jb(e,a);return}if(l=A(l),l.nodeType!==9){if(l.nodeType===11){a="host"in l?l.host:null,a!==null&&a.scrollIntoView(e);return}l.scrollIntoView(e)}}for(l=a?n.length-1:0;l!==(a?-1:n.length);){var d=n[l];d.tag===6?(d=A(d),jb(d,a)):A(d).scrollIntoView(e),l+=a?-1:1}};function Bk(e,n){return e=A(e),Lb(e,n),!1}function Lb(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function zb(e,n){var a=n._eventListeners;if(a!==null)for(var l=0;l<a.length;l++){var d=a[l];e.addEventListener(d.type,d.attachedListener,Ur(d.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(h){for(var S=0,M=0;M<$n.length;M++){var F=$n[M];(F.fragmentInstance!==n||F.observer!==h||F.instance!==e)&&($n[S++]=F)}$n.length=S,h.observe(e)}),Lb(e,n))}function qk(e,n){var a=n._eventListeners;if(a!==null)for(var l=0;l<a.length;l++){var d=a[l];e.removeEventListener(d.type,d.attachedListener,Ur(d.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(h){typeof h.rootMargin=="string"?_k(n,h,e):h.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function yf(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":yf(a),_l(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function Uk(e,n,a,l){for(;e.nodeType===1;){var d=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[fo])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(h=e.getAttribute("rel"),h==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(h!==d.rel||e.getAttribute("href")!==(d.href==null||d.href===""?null:d.href)||e.getAttribute("crossorigin")!==(d.crossOrigin==null?null:d.crossOrigin)||e.getAttribute("title")!==(d.title==null?null:d.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(h=e.getAttribute("src"),(h!==(d.src==null?null:d.src)||e.getAttribute("type")!==(d.type==null?null:d.type)||e.getAttribute("crossorigin")!==(d.crossOrigin==null?null:d.crossOrigin))&&h&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var h=d.name==null?null:""+d.name;if(d.type==="hidden"&&e.getAttribute("name")===h)return e}else return e;if(e=Hn(e.nextSibling),e===null)break}return null}function Fk(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Hn(e.nextSibling),e===null))return null;return e}function _b(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Hn(e.nextSibling),e===null))return null;return e}function bf(e){return e.data==="$?"||e.data==="$~"}function vf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Pk(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var l=function(){n(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Hn(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var xf=null;function Ib(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return Hn(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function Hb(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function Vk(e,n){function a(){l=!0}if(e.ownerDocument.activeElement===e)return!0;var l=!1;try{e.ownerDocument.addEventListener("focus",a,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",a,!0)}return l}function Gk(e){Ab(function(){Ab(function(n){return e(n)})})}function Bb(e,n,a){switch(n=Jo(a),e){case"html":if(e=n.documentElement,!e)throw Error(o(452));return e;case"head":if(e=n.head,!e)throw Error(o(453));return e;case"body":if(e=n.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function qb(e,n,a){for(var l in a){var d=a[l];a.hasOwnProperty(l)&&d!=null&&ft(e,n,l,null,xk,d)}a.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===ti&&(e.onclick=null),_l(e)}function wf(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);_l(e)}var Bn=new Map,Ub=new Set;function Xo(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var ji=se.d;se.d={f:$k,r:Yk,D:Jk,C:Xk,L:Zk,m:Qk,X:Wk,S:Kk,M:eA};function $k(){var e=ji.f(),n=Bs();return e||n}function Yk(e){var n=or(e);n!==null&&n.tag===5&&n.type==="form"?Pg(n):ji.r(e)}var Fr=typeof document>"u"?null:document;function Fb(e,n,a){var l=Fr;if(l&&typeof n=="string"&&n){var d=Dn(n);d='link[rel="'+e+'"][href="'+d+'"]',typeof a=="string"&&(d+='[crossorigin="'+a+'"]'),Ub.has(d)||(Ub.add(d),e={rel:e,crossOrigin:a,href:n},l.querySelector(d)===null&&(n=l.createElement("link"),$t(n,"link",e),It(n),l.head.appendChild(n)))}}function Jk(e){ji.D(e),Fb("dns-prefetch",e,null)}function Xk(e,n){ji.C(e,n),Fb("preconnect",e,n)}function Zk(e,n,a){ji.L(e,n,a);var l=Fr;if(l&&e&&n){var d='link[rel="preload"][as="'+Dn(n)+'"]';n==="image"&&a&&a.imageSrcSet?(d+='[imagesrcset="'+Dn(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(d+='[imagesizes="'+Dn(a.imageSizes)+'"]')):d+='[href="'+Dn(e)+'"]';var h=d;switch(n){case"style":h=Pr(e);break;case"script":h=Vr(e)}if(!(Bn.has(h)||(e=L({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),Bn.set(h,e),l.querySelector(d)!==null||n==="style"&&l.querySelector(Zo(h))||n==="script"&&l.querySelector(Qo(h))))){var S=l.createElement("link");$t(S,"link",e),n==="style"&&(S[zl]=!0,S.onload=S.onerror=function(){tp(S)}),It(S),l.head.appendChild(S)}}}function Qk(e,n){ji.m(e,n);var a=Fr;if(a&&e){var l=n&&typeof n.as=="string"?n.as:"script",d='link[rel="modulepreload"][as="'+Dn(l)+'"][href="'+Dn(e)+'"]',h=d;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":h=Vr(e)}if(!Bn.has(h)&&(e=L({rel:"modulepreload",href:e},n),Bn.set(h,e),a.querySelector(d)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Qo(h)))return}l=a.createElement("link"),$t(l,"link",e),It(l),a.head.appendChild(l)}}}function Kk(e,n,a){ji.S(e,n,a);var l=Fr;if(l&&e){var d=lr(l).hoistableStyles,h=Pr(e);n=n||"default";var S=d.get(h);if(!S){var M={loading:0,preload:null};if(S=l.querySelector(Zo(h)))M.loading=5;else{e=L({rel:"stylesheet",href:e,"data-precedence":n},a),(a=Bn.get(h))&&Sf(e,a);var F=S=l.createElement("link");It(F),$t(F,"link",e),F._p=new Promise(function(W,re){F.onload=W,F.onerror=re}),F.addEventListener("load",function(){M.loading|=1}),F.addEventListener("error",function(){M.loading|=2}),M.loading|=4,$s(S,n,l)}S={type:"stylesheet",instance:S,count:1,state:M},d.set(h,S)}}}function Wk(e,n){ji.X(e,n);var a=Fr;if(a&&e){var l=lr(a).hoistableScripts,d=Vr(e),h=l.get(d);h||(h=a.querySelector(Qo(d)),h||(e=L({src:e,async:!0},n),(n=Bn.get(d))&&kf(e,n),h=a.createElement("script"),It(h),$t(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},l.set(d,h))}}function eA(e,n){ji.M(e,n);var a=Fr;if(a&&e){var l=lr(a).hoistableScripts,d=Vr(e),h=l.get(d);h||(h=a.querySelector(Qo(d)),h||(e=L({src:e,async:!0,type:"module"},n),(n=Bn.get(d))&&kf(e,n),h=a.createElement("script"),It(h),$t(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},l.set(d,h))}}function Pb(e,n,a,l){var d=(d=Le.current)?Xo(d):null;if(!d)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Pr(a.href),n=lr(d).hoistableStyles,l=n.get(a),l||(l={type:"style",instance:null,count:0,state:null},n.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Pr(a.href);var h=lr(d).hoistableStyles,S=h.get(e);if(S||(d=d.ownerDocument||d,S={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},h.set(e,S),(h=d.querySelector(Zo(e)))?h._p||(S.instance=h,S.state.loading=5):(h=Bn.get(e),h||(h={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Bn.set(e,h)),tA(d,e,h,S.state))),n&&l===null)throw Error(o(528,""));return S}if(n&&l!==null)throw Error(o(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=Vr(a),n=lr(d).hoistableScripts,l=n.get(a),l||(l={type:"script",instance:null,count:0,state:null},n.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function Pr(e){return'href="'+Dn(e)+'"'}function Zo(e){return'link[rel="stylesheet"]['+e+"]"}function Vb(e){return L({},e,{"data-precedence":e.precedence,precedence:null})}function tA(e,n,a,l){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[zl]!==!0){l.loading=1;return}}else n=e.createElement("link"),n[zl]=!0,n.onload=n.onerror=tp.bind(null,n),$t(n,"link",a),It(n),e.head.appendChild(n);l.preload=n,n.addEventListener("load",function(){return l.loading|=1}),n.addEventListener("error",function(){return l.loading|=2})}function Vr(e){return'[src="'+Dn(e)+'"]'}function Qo(e){return"script[async]"+e}function Gb(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var l=e.querySelector('style[data-href~="'+Dn(a.href)+'"]');if(l)return n.instance=l,It(l),l;var d=L({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),It(l),$t(l,"style",d),$s(l,a.precedence,e),n.instance=l;case"stylesheet":d=Pr(a.href);var h=e.querySelector(Zo(d));if(h)return n.state.loading|=4,n.instance=h,It(h),h;l=Vb(a),(d=Bn.get(d))&&Sf(l,d),h=(e.ownerDocument||e).createElement("link"),It(h);var S=h;return S._p=new Promise(function(M,F){S.onload=M,S.onerror=F}),$t(h,"link",l),n.state.loading|=4,$s(h,a.precedence,e),n.instance=h;case"script":return h=Vr(a.src),(d=e.querySelector(Qo(h)))?(n.instance=d,It(d),d):(l=a,(d=Bn.get(h))&&(l=L({},a),kf(l,d)),e=e.ownerDocument||e,d=e.createElement("script"),It(d),$t(d,"link",l),e.head.appendChild(d),n.instance=d);case"void":return null;default:throw Error(o(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(l=n.instance,n.state.loading|=4,$s(l,a.precedence,e));return n.instance}function $s(e,n,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),d=l.length?l[l.length-1]:null,h=d,S=0;S<l.length;S++){var M=l[S];if(M.dataset.precedence===n)h=M;else if(h!==d)break}h?h.parentNode.insertBefore(e,h.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Sf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function kf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var Ys=null;function $b(e,n,a){if(Ys===null){var l=new Map,d=Ys=new Map;d.set(a,l)}else d=Ys,l=d.get(a),l||(l=new Map,d.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),d=0;d<a.length;d++){var h=a[d];if(!(h[fo]||h[Ut]||e==="link"&&h.getAttribute("rel")==="stylesheet")&&h.namespaceURI!=="http://www.w3.org/2000/svg"){var S=h.getAttribute(n)||"";S=e+S;var M=l.get(S);M?M.push(h):l.set(S,[h])}}return l}function Af(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function nA(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(e=n.disabled,typeof n.precedence=="string"&&e==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Yb(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function Jb(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Xb(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Zb(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=Xb(n),e.suspenseyImages.push(n)),e=rA.bind(e),n.decode().then(e,e))}function iA(e,n,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var d=Pr(l.href),h=n.querySelector(Zo(d));if(h){n=h._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=Ko.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=h,It(h);return}h=n.ownerDocument||n,l=Vb(l),(d=Bn.get(d))&&Sf(l,d),h=h.createElement("link"),It(h);var S=h;S._p=new Promise(function(M,F){S.onload=M,S.onerror=F}),$t(h,"link",l),a.instance=h}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=Ko.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var Js=0;function aA(e,n){return e.stylesheets&&e.count===0&&Zs(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&Zs(e,e.stylesheets),e.unsuspend){var h=e.unsuspend;e.unsuspend=null,h()}},6e4+n);0<e.imgBytes&&Js===0&&(Js=62500*Sk());var d=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Zs(e,e.stylesheets),e.unsuspend)){var h=e.unsuspend;e.unsuspend=null,h()}},(e.imgBytes>Js?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(d)}}:null}function Qb(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)Zs(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function Ko(){this.count--,Qb(this)}function rA(){this.imgCount--,Qb(this)}var Xs=null;function Zs(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Xs=new Map,n.forEach(oA,e),Xs=null,Ko.call(e))}function oA(e,n){if(!(n.state.loading&4)){var a=Xs.get(e);if(a)var l=a.get(null);else{a=new Map,Xs.set(e,a);for(var d=e.querySelectorAll("link[data-precedence],style[data-precedence]"),h=0;h<d.length;h++){var S=d[h];(S.nodeName==="LINK"||S.getAttribute("media")!=="not all")&&(a.set(S.dataset.precedence,S),l=S)}l&&a.set(null,l)}d=n.instance,S=d.getAttribute("data-precedence"),h=a.get(S)||l,h===l&&a.set(null,d),a.set(S,d),this.count++,l=Ko.bind(this),d.addEventListener("load",l),d.addEventListener("error",l),h?h.parentNode.insertBefore(d,h.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(d,e.firstChild)),n.state.loading|=4}}var Gr={$$typeof:N,Provider:null,Consumer:null,_currentValue:ve,_currentValue2:ve,_threadCount:0};function lA(e,n,a,l,d,h,S,M,F){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ic(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ic(0),this.hiddenUpdates=ic(null),this.identifierPrefix=l,this.onUncaughtError=d,this.onCaughtError=h,this.onRecoverableError=S,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=F,this.transitionTypes=null,this.incompleteTransitions=new Map}function Kb(e,n,a,l,d,h,S,M,F,W,re,fe){return e=new lA(e,n,a,S,F,W,re,fe,M),n=1,h===!0&&(n|=24),h=ln(3,null,null,n),e.current=h,h.stateNode=e,n=Hc(),n.refCount++,e.pooledCache=n,n.refCount++,h.memoizedState={element:l,isDehydrated:a,cache:n},Fc(h),e}function Wb(e){return e?(e=yr,e):yr}function ev(e,n,a,l,d,h){d=Wb(d),l.context===null?l.context=d:l.pendingContext=d,l=Zi(n),l.payload={element:a},h=h===void 0?null:h,h!==null&&(l.callback=h),a=Qi(e,l,n),a!==null&&(dn(a,e,n),Mo(a,e,n))}function tv(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Tf(e,n){tv(e,n),(e=e.alternate)&&tv(e,n)}function nv(e){if(e.tag===13||e.tag===31){var n=Ma(e,67108864);n!==null&&dn(n,e,67108864),Tf(e,67108864)}}function iv(e){if(e.tag===13||e.tag===31){var n=Tn();n=ac(n);var a=Ma(e,n);a!==null&&dn(a,e,n),Tf(e,n)}}var $r=!0;function sA(e,n,a,l){var d=le.T;le.T=null;var h=se.p;try{se.p=2,Ef(e,n,a,l)}finally{se.p=h,le.T=d}}function uA(e,n,a,l){var d=le.T;le.T=null;var h=se.p;try{se.p=8,Ef(e,n,a,l)}finally{se.p=h,le.T=d}}function Ef(e,n,a,l){if($r){var d=Cf(l);if(d===null)lf(e,n,l,Qs,a),rv(e,l);else if(dA(d,e,n,a,l))l.stopPropagation();else if(rv(e,l),n&4&&-1<cA.indexOf(e)){for(;d!==null;){var h=or(d);if(h!==null)switch(h.tag){case 3:if(h=h.stateNode,h.current.memoizedState.isDehydrated){var S=Aa(h.pendingLanes);if(S!==0){var M=h;for(M.pendingLanes|=2,M.entangledLanes|=2;S;){var F=1<<31-bn(S);M.entanglements[1]|=F,S&=~F}di(h),(ot&6)===0&&(_s=pt()+500,Go(0))}}break;case 31:case 13:M=Ma(h,2),M!==null&&dn(M,h,2),Bs(),Tf(h,2)}if(h=Cf(l),h===null&&lf(e,n,l,Qs,a),h===d)break;d=h}d!==null&&l.stopPropagation()}else lf(e,n,l,null,a)}}function Cf(e){return e=dc(e),Rf(e)}var Qs=null;function Rf(e){if(Qs=null,e=Ta(e),e!==null){var n=u(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=c(n),e!==null)return e;e=null}else if(a===31){if(e=f(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return Qs=e,null}function av(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Kt()){case bi:return 2;case Nn:return 8;case Nl:case k1:return 32;case Gm:return 268435456;default:return 32}default:return 32}}var Mf=!1,ua=null,ca=null,da=null,Wo=new Map,el=new Map,fa=[],cA="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function rv(e,n){switch(e){case"focusin":case"focusout":ua=null;break;case"dragenter":case"dragleave":ca=null;break;case"mouseover":case"mouseout":da=null;break;case"pointerover":case"pointerout":Wo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":el.delete(n.pointerId)}}function tl(e,n,a,l,d,h){return e===null||e.nativeEvent!==h?(e={blockedOn:n,domEventName:a,eventSystemFlags:l,nativeEvent:h,targetContainers:[d]},n!==null&&(n=or(n),n!==null&&nv(n)),e):(e.eventSystemFlags|=l,n=e.targetContainers,d!==null&&n.indexOf(d)===-1&&n.push(d),e)}function dA(e,n,a,l,d){switch(n){case"focusin":return ua=tl(ua,e,n,a,l,d),!0;case"dragenter":return ca=tl(ca,e,n,a,l,d),!0;case"mouseover":return da=tl(da,e,n,a,l,d),!0;case"pointerover":var h=d.pointerId;return Wo.set(h,tl(Wo.get(h)||null,e,n,a,l,d)),!0;case"gotpointercapture":return h=d.pointerId,el.set(h,tl(el.get(h)||null,e,n,a,l,d)),!0}return!1}function ov(e){var n=Ta(e.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=c(a),n!==null){e.blockedOn=n,Km(e.priority,function(){iv(a)});return}}else if(n===31){if(n=f(a),n!==null){e.blockedOn=n,Km(e.priority,function(){iv(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ks(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=Cf(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);cc=l,a.target.dispatchEvent(l),cc=null}else return n=or(a),n!==null&&nv(n),e.blockedOn=a,!1;n.shift()}return!0}function lv(e,n,a){Ks(e)&&a.delete(n)}function fA(){Mf=!1,ua!==null&&Ks(ua)&&(ua=null),ca!==null&&Ks(ca)&&(ca=null),da!==null&&Ks(da)&&(da=null),Wo.forEach(lv),el.forEach(lv)}function Ws(e,n){e.blockedOn===n&&(e.blockedOn=null,Mf||(Mf=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,fA)))}var eu=null;function sv(e){eu!==e&&(eu=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){eu===e&&(eu=null);for(var n=0;n<e.length;n+=3){var a=e[n],l=e[n+1],d=e[n+2];if(typeof l!="function"){if(Rf(l||a)===null)continue;break}var h=or(a);h!==null&&(e.splice(n,3),n-=3,ud(h,{pending:!0,data:d,method:a.method,action:l},l,d))}}))}function Yr(e){function n(F){return Ws(F,e)}ua!==null&&Ws(ua,e),ca!==null&&Ws(ca,e),da!==null&&Ws(da,e),Wo.forEach(n),el.forEach(n);for(var a=0;a<fa.length;a++){var l=fa[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<fa.length&&(a=fa[0],a.blockedOn===null);)ov(a),a.blockedOn===null&&fa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var d=a[l],h=a[l+1],S=d[on]||null;if(typeof h=="function")S||sv(a);else if(S){var M=null;if(h&&h.hasAttribute("formAction")){if(d=h,S=h[on]||null)M=S.formAction;else if(Rf(d)!==null)continue}else M=S.action;typeof M=="function"?a[l+1]=M:(a.splice(l,3),l-=3),sv(a)}}}function uv(){function e(h){h.canIntercept&&h.info==="react-transition"&&h.intercept({handler:function(){return new Promise(function(S){return d=S})},focusReset:"manual",scroll:"manual"})}function n(){d!==null&&(d(),d=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var h=navigation.currentEntry;h&&h.url!=null&&navigation.navigate(h.url,{state:h.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,d=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),d!==null&&(d(),d=null)}}}function Nf(e){this._internalRoot=e}tu.prototype.render=Nf.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(o(409));var a=n.current,l=Tn();ev(a,l,e,n,null,null)},tu.prototype.unmount=Nf.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;ev(e.current,2,null,e,null,null),Bs(),n[rr]=null}};function tu(e){this._internalRoot=e}tu.prototype.unstable_scheduleHydration=function(e){if(e){var n=Qm();e={blockedOn:null,target:e,priority:n};for(var a=0;a<fa.length&&n!==0&&n<fa[a].priority;a++);fa.splice(a,0,e),a===0&&ov(e)}};var cv=i.version;if(cv!=="19.3.0")throw Error(o(527,cv,"19.3.0"));se.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=m(n),e=e!==null?y(e):null,e=e===null?null:e.stateNode,e};var hA={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:le,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var nu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!nu.isDisabled&&nu.supportsFiber)try{so=nu.inject(hA),yn=nu}catch{}}return il.createRoot=function(e,n){if(!s(e))throw Error(o(299));var a=!1,l="",d=Wg,h=ey,S=ty;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onUncaughtError!==void 0&&(d=n.onUncaughtError),n.onCaughtError!==void 0&&(h=n.onCaughtError),n.onRecoverableError!==void 0&&(S=n.onRecoverableError)),n=Kb(e,1,!1,null,null,a,l,null,d,h,S,uv),e[rr]=n.current,of(e),new Nf(n)},il.hydrateRoot=function(e,n,a){if(!s(e))throw Error(o(299));var l=!1,d="",h=Wg,S=ey,M=ty,F=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(d=a.identifierPrefix),a.onUncaughtError!==void 0&&(h=a.onUncaughtError),a.onCaughtError!==void 0&&(S=a.onCaughtError),a.onRecoverableError!==void 0&&(M=a.onRecoverableError),a.formState!==void 0&&(F=a.formState)),n=Kb(e,1,!0,n,a??null,l,d,F,h,S,M,uv),n.context=Wb(null),a=n.current,l=Tn(),l=ac(l),d=Zi(l),d.callback=null,Qi(a,d,l),a=l,n.current.lanes=a,co(n,a),di(n),e[rr]=n.current,of(e),new tu(n)},il.version="19.3.0",il}var xv;function AA(){if(xv)return jf.exports;xv=1;function t(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)}catch(i){console.error(i)}}return t(),jf.exports=kA(),jf.exports}var Ch=AA();const TA={};function em(t,i){const r=TA,o=typeof r.includeImageAlt=="boolean"?r.includeImageAlt:!0,s=typeof r.includeHtml=="boolean"?r.includeHtml:!0;return dw(t,o,s)}function dw(t,i,r){if(EA(t)){if("value"in t)return t.type==="html"&&!r?"":t.value;if(i&&"alt"in t&&t.alt)return t.alt;if("children"in t)return wv(t.children,i,r)}return Array.isArray(t)?wv(t,i,r):""}function wv(t,i,r){const o=[];let s=-1;for(;++s<t.length;)o[s]=dw(t[s],i,r);return o.join("")}function EA(t){return!!(t&&typeof t=="object")}const Sv=document.createElement("i");function pl(t){const i="&"+t+";";Sv.innerHTML=i;const r=Sv.textContent;return r.charCodeAt(r.length-1)===59&&t!=="semi"||r===i?!1:r}function Xn(t,i,r,o){const s=t.length;let u=0,c;if(i<0?i=-i>s?0:s+i:i=i>s?s:i,r=r>0?r:0,o.length<1e4)c=Array.from(o),c.unshift(i,r),t.splice(...c);else for(r&&t.splice(i,r);u<o.length;)c=o.slice(u,u+1e4),c.unshift(i,0),t.splice(...c),u+=1e4,i+=1e4}function qn(t,i){return t.length>0?(Xn(t,t.length,0,i),t):i}const kv={}.hasOwnProperty;function fw(t){const i={};let r=-1;for(;++r<t.length;)CA(i,t[r]);return i}function CA(t,i){let r;for(r in i){const s=(kv.call(t,r)?t[r]:void 0)||(t[r]={}),u=i[r];let c;if(u)for(c in u){kv.call(s,c)||(s[c]=[]);const f=u[c];RA(s[c],Array.isArray(f)?f:f?[f]:[])}}}function RA(t,i){let r=-1;const o=[];for(;++r<i.length;)(i[r].add==="after"?t:o).push(i[r]);Xn(t,0,0,o)}function hw(t,i){const r=Number.parseInt(t,i);return r<9||r===11||r>13&&r<32||r>126&&r<160||r>55295&&r<57344||r>64975&&r<65008||(r&65535)===65535||(r&65535)===65534||r>1114111?"�":String.fromCodePoint(r)}function Zn(t){return t.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}const an=Sa(/[A-Za-z]/),Qt=Sa(/[\dA-Za-z]/),MA=Sa(/[#-'*+\--9=?A-Z^-~]/);function yu(t){return t!==null&&(t<32||t===127)}const Rh=Sa(/\d/),NA=Sa(/[\dA-Fa-f]/),DA=Sa(/[!-/:-@[-`{-~]/);function Re(t){return t!==null&&t<-2}function Qe(t){return t!==null&&(t<0||t===32)}function Ge(t){return t===-2||t===-1||t===32}const va=Sa(new RegExp("\\p{P}|\\p{S}","u")),zt=Sa(/\s/);function Sa(t){return i;function i(r){return r!==null&&r>-1&&t.test(String.fromCharCode(r))}}function ro(t){const i=[];let r=-1,o=0,s=0;for(;++r<t.length;){const u=t.charCodeAt(r);let c="";if(u===37&&Qt(t.charCodeAt(r+1))&&Qt(t.charCodeAt(r+2)))s=2;else if(u<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(u))||(c=String.fromCharCode(u));else if(u>55295&&u<57344){const f=t.charCodeAt(r+1);u<56320&&f>56319&&f<57344?(c=String.fromCharCode(u,f),s=1):c="�"}else c=String.fromCharCode(u);c&&(i.push(t.slice(o,r),encodeURIComponent(c)),o=r+s+1,c=""),s&&(r+=s,s=0)}return i.join("")+t.slice(o)}function $e(t,i,r,o){const s=o?o-1:1/0;let u=0;return c;function c(p){return Ge(p)?(t.enter(r),f(p)):i(p)}function f(p){return Ge(p)&&u++<s?(t.consume(p),f):(t.exit(r),i(p))}}function mw(t,i,r,o,s,u){let c=0;return f;function f(y){return Ge(y)?(t.enter(o),p(y)):m(y)}function p(y){return Ge(y)&&c<u?(t.consume(y),c++,p):(t.exit(o),m(y))}function m(y){return c>=s?i(y):r(y)}}const OA={tokenize:jA};function jA(t){const i=t.attempt(this.parser.constructs.contentInitial,o,s);let r;return i;function o(f){if(f===null){t.consume(f);return}return t.enter("lineEnding"),t.consume(f),t.exit("lineEnding"),$e(t,i,"linePrefix")}function s(f){return t.enter("paragraph"),u(f)}function u(f){const p=t.enter("chunkText",{contentType:"text",previous:r});return r&&(r.next=p),r=p,c(f)}function c(f){if(f===null){t.exit("chunkText"),t.exit("paragraph"),t.consume(f);return}return Re(f)?(t.consume(f),t.exit("chunkText"),u):(t.consume(f),c)}}let bu=class{constructor(){this.index=new Map,this.map=[]}add(i,r,o){Av(this,i,r,o,!1)}addBefore(i,r,o){Av(this,i,r,o,!0)}consume(i){if(this.map.sort(function(u,c){return u[0]-c[0]}),this.map.length===0)return;let r=this.map.length;const o=[];for(;r>0;)r-=1,o.push(i.slice(this.map[r][0]+this.map[r][1]),this.map[r][2]),i.length=this.map[r][0];o.push(i.slice()),i.length=0;let s=o.pop();for(;s;){for(const u of s)i.push(u);s=o.pop()}this.map.length=0,this.index.clear()}};function Av(t,i,r,o,s){if(r===0&&o.length===0)return;const u=t.index.get(i);if(u){u[1]+=r,s?(o.push(...u[2]),u[2]=o):u[2].push(...o);return}const c=[i,r,o];t.map.push(c),t.index.set(i,c)}const LA={tokenize:zA},Tv={tokenize:_A};function zA(t){const i=this,r=[];let o=0,s,u,c;return f;function f(C){if(o<r.length){const D=r[o];return i.containerState=D[1],t.attempt(D[0].continuation,p,m)(C)}return m(C)}function p(C){if(o++,i.containerState._closeFlow){i.containerState._closeFlow=void 0,s&&T();const D=i.events.length;let z=D,j;for(;z--;)if(i.events[z][0]==="exit"&&i.events[z][1].type==="chunkFlow"){j=i.events[z][1].end;break}k(o);let L=D;for(;L<i.events.length;)i.events[L][1].end={...j},L++;const I=new bu;return I.add(z+1,0,i.events.slice(D)),I.add(D,L-D,[]),I.consume(i.events),m(C)}return f(C)}function m(C){if(o===r.length){if(!s)return x(C);if(s.currentConstruct&&s.currentConstruct.concrete)return w(C);i.interrupt=!!(s.currentConstruct&&!s._gfmTableDynamicInterruptHack)}return i.containerState={},t.check(Tv,y,g)(C)}function y(C){return s&&T(),k(o),x(C)}function g(C){return i.parser.lazy[i.now().line]=o!==r.length,c=i.now().offset,w(C)}function x(C){return i.containerState={},t.attempt(Tv,b,w)(C)}function b(C){return o++,r.push([i.currentConstruct,i.containerState]),x(C)}function w(C){if(C===null){s&&T(),k(0),t.consume(C);return}return s=s||i.parser.flow(i.now()),t.enter("chunkFlow",{_tokenizer:s,contentType:"flow",previous:u}),E(C)}function E(C){if(C===null){A(t.exit("chunkFlow"),!0),k(0),t.consume(C);return}return Re(C)?(t.consume(C),A(t.exit("chunkFlow")),o=0,i.interrupt=void 0,f):(t.consume(C),E)}function A(C,D){const z=i.sliceStream(C);if(D&&z.push(null),C.previous=u,u&&(u.next=C),u=C,s.defineSkip(C.start),s.write(z),i.parser.lazy[C.start.line]){let j=s.events.length;for(;j--;)if(s.events[j][1].start.offset<c&&(!s.events[j][1].end||s.events[j][1].end.offset>c))return;const L=i.events.length;let I=L,q,H;for(;I--;)if(i.events[I][0]==="exit"&&i.events[I][1].type==="chunkFlow"){if(q){H=i.events[I][1].end;break}q=!0}for(k(o),j=L;j<i.events.length;)i.events[j][1].end={...H},j++;const Z=new bu;Z.add(I+1,0,i.events.slice(L)),Z.add(L,j-L,[]),Z.consume(i.events)}}function k(C){let D=r.length;for(;D-- >C;){const z=r[D];i.containerState=z[1],z[0].exit.call(i,t)}r.length=C}function T(){s.write([null]),u=void 0,s=void 0,i.containerState._closeFlow=void 0}}function _A(t,i,r){return $e(t,t.attempt(this.parser.constructs.document,i,r),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function vu(t){if(t===null||Qe(t)||zt(t))return 1;if(va(t))return 2}function Uu(t,i,r){const o=[];let s=-1;for(;++s<t.length;){const u=t[s].resolveAll;u&&!o.includes(u)&&(i=u(i,r),o.push(u))}return i}const Mh={name:"attention",resolveAll:IA,tokenize:HA};function IA(t,i){let r=-1,o;for(;++r<t.length;)if(t[r][0]==="enter"&&t[r][1].type==="attentionSequence"&&t[r][1]._close){let s=r;for(;s--;)if(t[s][0]==="exit"&&t[s][1].type==="attentionSequence"&&t[s][1]._open&&i.sliceSerialize(t[s][1]).charCodeAt(0)===i.sliceSerialize(t[r][1]).charCodeAt(0)){if((t[s][1]._close||t[r][1]._open)&&(t[r][1].end.offset-t[r][1].start.offset)%3&&!((t[s][1].end.offset-t[s][1].start.offset+t[r][1].end.offset-t[r][1].start.offset)%3))continue;const u=t[s][1].end.offset-t[s][1].start.offset>1&&t[r][1].end.offset-t[r][1].start.offset>1?2:1,c={...t[s][1].end},f={...t[r][1].start};Ev(c,-u),Ev(f,u);const p={type:u>1?"strongSequence":"emphasisSequence",start:c,end:{...t[s][1].end}},m={type:u>1?"strongSequence":"emphasisSequence",start:{...t[r][1].start},end:f},y={type:u>1?"strongText":"emphasisText",start:{...t[s][1].end},end:{...t[r][1].start}},g={type:u>1?"strong":"emphasis",start:{...p.start},end:{...m.end}};t[s][1].end={...p.start},t[r][1].start={...m.end},o=[],t[s][1].end.offset-t[s][1].start.offset&&(o=qn(o,[["enter",t[s][1],i],["exit",t[s][1],i]])),o=qn(o,[["enter",g,i],["enter",p,i],["exit",p,i],["enter",y,i]]),o=qn(o,Uu(i.parser.constructs.insideSpan.null,t.slice(s+1,r),i)),o=qn(o,[["exit",y,i],["enter",m,i],["exit",m,i],["exit",g,i]]);let x=0;t[r][1].end.offset-t[r][1].start.offset&&(x=2,o=qn(o,[["enter",t[r][1],i],["exit",t[r][1],i]])),Xn(t,s-1,r-s+3,o),r=s+o.length-x-2;break}}for(r=-1;++r<t.length;)t[r][1].type==="attentionSequence"&&(t[r][1].type="data");return t}function HA(t,i){const r=this.parser.constructs.attentionMarkers.null,o=this.previous,s=vu(o);let u;return c;function c(p){return u=p,t.enter("attentionSequence"),f(p)}function f(p){if(p===u)return t.consume(p),f;const m=t.exit("attentionSequence"),y=vu(p),g=!y||y===2&&s||r.includes(p)&&p!==42&&p!==95,x=!s||s===2&&y||r.includes(o)&&o!==42&&o!==95;return m._open=!!(u===42?g:g&&(s||!x)),m._close=!!(u===42?x:x&&(y||!g)),i(p)}}function Ev(t,i){t.column+=i,t.offset+=i,t._bufferIndex+=i}const BA={name:"autolink",tokenize:qA};function qA(t,i,r){let o=0;return s;function s(b){return t.enter("autolink"),t.enter("autolinkMarker"),t.consume(b),t.exit("autolinkMarker"),t.enter("autolinkProtocol"),u}function u(b){return an(b)?(t.consume(b),c):b===64?r(b):m(b)}function c(b){return b===43||b===45||b===46||Qt(b)?(o=1,f(b)):m(b)}function f(b){return b===58?(t.consume(b),o=0,p):(b===43||b===45||b===46||Qt(b))&&o++<32?(t.consume(b),f):(o=0,m(b))}function p(b){return b===62?(t.exit("autolinkProtocol"),t.enter("autolinkMarker"),t.consume(b),t.exit("autolinkMarker"),t.exit("autolink"),i):b===null||b===32||b===60||yu(b)?r(b):(t.consume(b),p)}function m(b){return b===64?(t.consume(b),y):MA(b)?(t.consume(b),m):r(b)}function y(b){return Qt(b)?g(b):r(b)}function g(b){return b===46?(t.consume(b),o=0,y):b===62?(t.exit("autolinkProtocol").type="autolinkEmail",t.enter("autolinkMarker"),t.consume(b),t.exit("autolinkMarker"),t.exit("autolink"),i):x(b)}function x(b){if((b===45||Qt(b))&&o++<63){const w=b===45?x:g;return t.consume(b),w}return r(b)}}const wl={partial:!0,tokenize:UA};function UA(t,i,r){return o;function o(u){return Ge(u)?$e(t,s,"linePrefix")(u):s(u)}function s(u){return u===null||Re(u)?i(u):r(u)}}const pw={continuation:{tokenize:PA},exit:VA,name:"blockQuote",tokenize:FA};function FA(t,i,r){const o=this;return s;function s(c){if(c===62){const f=o.containerState;return f.open||(t.enter("blockQuote",{_container:!0}),f.open=!0),t.enter("blockQuotePrefix"),t.enter("blockQuoteMarker"),t.consume(c),t.exit("blockQuoteMarker"),u}return r(c)}function u(c){return Ge(c)?(t.enter("blockQuotePrefixWhitespace"),t.consume(c),t.exit("blockQuotePrefixWhitespace"),t.exit("blockQuotePrefix"),i):(t.exit("blockQuotePrefix"),i(c))}}function PA(t,i,r){const o=this;return s;function s(c){return Ge(c)?$e(t,u,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(c):u(c)}function u(c){return t.attempt(pw,i,r)(c)}}function VA(t){t.exit("blockQuote")}const gw={name:"characterEscape",tokenize:GA};function GA(t,i,r){return o;function o(u){return t.enter("characterEscape"),t.enter("escapeMarker"),t.consume(u),t.exit("escapeMarker"),s}function s(u){return DA(u)?(t.enter("characterEscapeValue"),t.consume(u),t.exit("characterEscapeValue"),t.exit("characterEscape"),i):r(u)}}const yw={name:"characterReference",tokenize:$A};function $A(t,i,r){const o=this;let s=0,u,c;return f;function f(g){return t.enter("characterReference"),t.enter("characterReferenceMarker"),t.consume(g),t.exit("characterReferenceMarker"),p}function p(g){return g===35?(t.enter("characterReferenceMarkerNumeric"),t.consume(g),t.exit("characterReferenceMarkerNumeric"),m):(t.enter("characterReferenceValue"),u=31,c=Qt,y(g))}function m(g){return g===88||g===120?(t.enter("characterReferenceMarkerHexadecimal"),t.consume(g),t.exit("characterReferenceMarkerHexadecimal"),t.enter("characterReferenceValue"),u=6,c=NA,y):(t.enter("characterReferenceValue"),u=7,c=Rh,y(g))}function y(g){if(g===59&&s){const x=t.exit("characterReferenceValue");return c===Qt&&!pl(o.sliceSerialize(x))?r(g):(t.enter("characterReferenceMarker"),t.consume(g),t.exit("characterReferenceMarker"),t.exit("characterReference"),i)}return c(g)&&s++<u?(t.consume(g),y):r(g)}}const Nh={partial:!0,tokenize:YA};function YA(t,i,r){const o=this;return s;function s(c){return c===null?r(c):(t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),u)}function u(c){return o.parser.lazy[o.now().line]?r(c):i(c)}}const Cv={concrete:!0,name:"codeFenced",tokenize:JA};function JA(t,i,r){const o=this,s={partial:!0,tokenize:z};let u=0,c=0,f;return p;function p(j){return m(j)}function m(j){const L=o.events[o.events.length-1];return u=L&&L[1].type==="linePrefix"?L[2].sliceSerialize(L[1],!0).length:0,f=j,t.enter("codeFenced"),t.enter("codeFencedFence"),t.enter("codeFencedFenceSequence"),y(j)}function y(j){return j===f?(c++,t.consume(j),y):c<3?r(j):(t.exit("codeFencedFenceSequence"),Ge(j)?$e(t,g,"whitespace")(j):g(j))}function g(j){return j===null||Re(j)?(t.exit("codeFencedFence"),o.interrupt?i(j):t.check(Nh,E,D)(j)):(t.enter("codeFencedFenceInfo"),t.enter("chunkString",{contentType:"string"}),x(j))}function x(j){return j===null||Re(j)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),g(j)):Ge(j)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),$e(t,b,"whitespace")(j)):j===96&&j===f?r(j):(t.consume(j),x)}function b(j){return j===null||Re(j)?g(j):(t.enter("codeFencedFenceMeta"),t.enter("chunkString",{contentType:"string"}),w(j))}function w(j){return j===null||Re(j)?(t.exit("chunkString"),t.exit("codeFencedFenceMeta"),g(j)):j===96&&j===f?r(j):(t.consume(j),w)}function E(j){return t.attempt(s,D,A)(j)}function A(j){return t.enter("lineEnding"),t.consume(j),t.exit("lineEnding"),k}function k(j){return u>0&&Ge(j)?$e(t,T,"linePrefix",u+1)(j):T(j)}function T(j){return j===null||Re(j)?t.check(Nh,E,D)(j):(t.enter("codeFlowValue"),C(j))}function C(j){return j===null||Re(j)?(t.exit("codeFlowValue"),T(j)):(t.consume(j),C)}function D(j){return t.exit("codeFenced"),i(j)}function z(j,L,I){let q=0;return H;function H(N){return j.enter("lineEnding"),j.consume(N),j.exit("lineEnding"),Z}function Z(N){return j.enter("codeFencedFence"),Ge(N)?$e(j,oe,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(N):oe(N)}function oe(N){return N===f?(j.enter("codeFencedFenceSequence"),ue(N)):I(N)}function ue(N){return N===f?(q++,j.consume(N),ue):q>=c?(j.exit("codeFencedFenceSequence"),Ge(N)?$e(j,$,"whitespace")(N):$(N)):I(N)}function $(N){return N===null||Re(N)?(j.exit("codeFencedFence"),L(N)):I(N)}}}const If={name:"codeIndented",tokenize:ZA},XA={partial:!0,tokenize:QA};function ZA(t,i,r){return o;function o(f){return t.enter("codeIndented"),mw(t,s,r,"linePrefix",4,4)(f)}function s(f){return f===null?c(f):Re(f)?t.attempt(XA,s,c)(f):(t.enter("codeFlowValue"),u(f))}function u(f){return f===null||Re(f)?(t.exit("codeFlowValue"),s(f)):(t.consume(f),u)}function c(f){return t.exit("codeIndented"),i(f)}}function QA(t,i,r){const o=this;return s;function s(c){return o.parser.lazy[o.now().line]?r(c):Re(c)?(t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),s):mw(t,i,u,"linePrefix",4,4)(c)}function u(c){return Re(c)?s(c):r(c)}}const KA={name:"codeText",previous:eT,resolve:WA,tokenize:tT};function WA(t){let i=t.length-4,r=3,o,s;if((t[r][1].type==="lineEnding"||t[r][1].type==="space")&&(t[i][1].type==="lineEnding"||t[i][1].type==="space")){for(o=r;++o<i;)if(t[o][1].type==="codeTextData"){t[r][1].type="codeTextPadding",t[i][1].type="codeTextPadding",r+=2,i-=2;break}}for(o=r-1,i++;++o<=i;)s===void 0?o!==i&&t[o][1].type!=="lineEnding"&&(s=o):(o===i||t[o][1].type==="lineEnding")&&(t[s][1].type="codeTextData",o!==s+2&&(t[s][1].end=t[o-1][1].end,t.splice(s+2,o-s-2),i-=o-s-2,o=s+2),s=void 0);return t}function eT(t){return t!==96||this.events[this.events.length-1][1].type==="characterEscape"}function tT(t,i,r){let o=0,s,u;return c;function c(g){return t.enter("codeText"),t.enter("codeTextSequence"),f(g)}function f(g){return g===96?(t.consume(g),o++,f):(t.exit("codeTextSequence"),p(g))}function p(g){return g===null?r(g):g===32?(t.enter("space"),t.consume(g),t.exit("space"),p):g===96?(u=t.enter("codeTextSequence"),s=0,y(g)):Re(g)?(t.enter("lineEnding"),t.consume(g),t.exit("lineEnding"),p):(t.enter("codeTextData"),m(g))}function m(g){return g===null||g===32||g===96||Re(g)?(t.exit("codeTextData"),p(g)):(t.consume(g),m)}function y(g){return g===96?(t.consume(g),s++,y):s===o?(t.exit("codeTextSequence"),t.exit("codeText"),i(g)):(u.type="codeTextData",m(g))}}class nT{constructor(i){this.left=i?[...i]:[],this.right=[]}get(i){if(i<0||i>=this.left.length+this.right.length)throw new RangeError("Cannot access index `"+i+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return i<this.left.length?this.left[i]:this.right[this.right.length-i+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(i,r){const o=r??Number.POSITIVE_INFINITY;return o<this.left.length?this.left.slice(i,o):i>this.left.length?this.right.slice(this.right.length-o+this.left.length,this.right.length-i+this.left.length).reverse():this.left.slice(i).concat(this.right.slice(this.right.length-o+this.left.length).reverse())}splice(i,r,o){const s=r||0;this.setCursor(Math.trunc(i));const u=this.right.splice(this.right.length-s,Number.POSITIVE_INFINITY);return o&&al(this.left,o),u.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(i){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(i)}pushMany(i){this.setCursor(Number.POSITIVE_INFINITY),al(this.left,i)}unshift(i){this.setCursor(0),this.right.push(i)}unshiftMany(i){this.setCursor(0),al(this.right,i.reverse())}setCursor(i){if(!(i===this.left.length||i>this.left.length&&this.right.length===0||i<0&&this.left.length===0))if(i<this.left.length){const r=this.left.splice(i,Number.POSITIVE_INFINITY);al(this.right,r.reverse())}else{const r=this.right.splice(this.left.length+this.right.length-i,Number.POSITIVE_INFINITY);al(this.left,r.reverse())}}}function al(t,i){let r=0;if(i.length<1e4)t.push(...i);else for(;r<i.length;)t.push(...i.slice(r,r+1e4)),r+=1e4}function bw(t){const i={};let r=-1,o,s,u,c,f,p,m;const y=new nT(t);for(;++r<y.length;){for(;r in i;)r=i[r];if(o=y.get(r),r&&o[1].type==="chunkFlow"&&y.get(r-1)[1].type==="listItemPrefix"&&(p=o[1]._tokenizer.events,u=0,u<p.length&&p[u][1].type==="lineEndingBlank"&&(u+=2),u<p.length&&p[u][1].type==="content"))for(;++u<p.length&&p[u][1].type!=="content";)p[u][1].type==="chunkText"&&(p[u][1]._isInFirstContentOfListItem=!0,u++);if(o[0]==="enter")o[1].contentType&&(Object.assign(i,iT(y,r)),r=i[r],m=!0);else if(o[1]._container){for(u=r,s=void 0;u--;)if(c=y.get(u),c[1].type==="lineEnding"||c[1].type==="lineEndingBlank")c[0]==="enter"&&(s&&(y.get(s)[1].type="lineEndingBlank"),c[1].type="lineEnding",s=u);else if(!(c[1].type==="linePrefix"||c[1].type==="listItemIndent"))break;s&&(o[1].end={...y.get(s)[1].start},f=y.slice(s,r),f.unshift(o),y.splice(s,r-s+1,f))}}return Xn(t,0,Number.POSITIVE_INFINITY,y.slice(0)),!m}function iT(t,i){const r=t.get(i)[1],o=t.get(i)[2];let s=i-1;const u=[];let c=r._tokenizer;c||(c=o.parser[r.contentType](r.start),r._contentTypeTextTrailing&&(c._contentTypeTextTrailing=!0));const f=c.events,p=[],m={};let y,g,x=-1,b=r,w=0,E=0;const A=[E];for(;b;){for(;t.get(++s)[1]!==b;);u.push(s),b._tokenizer||(y=o.sliceStream(b),b.next||y.push(null),g&&c.defineSkip(b.start),b._isInFirstContentOfListItem&&(c._gfmTasklistFirstContentOfListItem=!0),c.write(y),b._isInFirstContentOfListItem&&(c._gfmTasklistFirstContentOfListItem=void 0)),g=b,b=b.next}for(b=r;++x<f.length;)f[x][0]==="exit"&&f[x-1][0]==="enter"&&f[x][1].type===f[x-1][1].type&&f[x][1].start.line!==f[x][1].end.line&&(E=x+1,A.push(E),b._tokenizer=void 0,b.previous=void 0,b=b.next);for(c.events=[],b?(b._tokenizer=void 0,b.previous=void 0):A.pop(),x=A.length;x--;){const k=f.slice(A[x],A[x+1]),T=u.pop();p.push([T,T+k.length-1]),t.splice(T,2,k)}for(p.reverse(),x=-1;++x<p.length;)m[w+p[x][0]]=w+p[x][1],w+=p[x][1]-p[x][0]-1;return m}const aT={resolve:oT,tokenize:lT},rT={partial:!0,tokenize:sT};function oT(t){return bw(t),t}function lT(t,i){let r;return o;function o(f){return t.enter("content"),r=t.enter("chunkContent",{contentType:"content"}),s(f)}function s(f){return f===null?u(f):Re(f)?t.check(rT,c,u)(f):(t.consume(f),s)}function u(f){return t.exit("chunkContent"),t.exit("content"),i(f)}function c(f){return t.consume(f),t.exit("chunkContent"),r.next=t.enter("chunkContent",{contentType:"content",previous:r}),r=r.next,s}}function sT(t,i,r){const o=this;return s;function s(c){return t.exit("chunkContent"),t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),$e(t,u,"linePrefix")}function u(c){if(c===null||Re(c))return r(c);const f=o.events[o.events.length-1];return!o.parser.constructs.disable.null.includes("codeIndented")&&f&&f[1].type==="linePrefix"&&f[2].sliceSerialize(f[1],!0).length>=4?i(c):t.interrupt(o.parser.constructs.flow,r,i)(c)}}function vw(t,i,r,o,s,u,c,f,p){const m=p||Number.POSITIVE_INFINITY;let y=0;return g;function g(k){return k===60?(t.enter(o),t.enter(s),t.enter(u),t.consume(k),t.exit(u),x):k===null||k===32||k===41||yu(k)?r(k):(t.enter(o),t.enter(c),t.enter(f),t.enter("chunkString",{contentType:"string"}),E(k))}function x(k){return k===62?(t.enter(u),t.consume(k),t.exit(u),t.exit(s),t.exit(o),i):(t.enter(f),t.enter("chunkString",{contentType:"string"}),b(k))}function b(k){return k===62?(t.exit("chunkString"),t.exit(f),x(k)):k===null||k===60||Re(k)?r(k):(t.consume(k),k===92?w:b)}function w(k){return k===60||k===62||k===92?(t.consume(k),b):b(k)}function E(k){return!y&&(k===null||k===41||Qe(k))?(t.exit("chunkString"),t.exit(f),t.exit(c),t.exit(o),i(k)):y<m&&k===40?(t.consume(k),y++,E):k===41?(t.consume(k),y--,E):k===null||k===32||k===40||yu(k)?r(k):(t.consume(k),k===92?A:E)}function A(k){return k===40||k===41||k===92?(t.consume(k),E):E(k)}}function xw(t,i,r,o,s,u){const c=this;let f=0,p;return m;function m(b){return t.enter(o),t.enter(s),t.consume(b),t.exit(s),t.enter(u),y}function y(b){return f>999||b===null||b===91||b===93&&!p||b===94&&!f&&"_hiddenFootnoteSupport"in c.parser.constructs?r(b):b===93?(t.exit(u),t.enter(s),t.consume(b),t.exit(s),t.exit(o),i):Re(b)?(t.enter("lineEnding"),t.consume(b),t.exit("lineEnding"),y):(t.enter("chunkString",{contentType:"string"}),g(b))}function g(b){return b===null||b===91||b===93||Re(b)||f++>999?(t.exit("chunkString"),y(b)):(t.consume(b),p||(p=!Ge(b)),b===92?x:g)}function x(b){return b===91||b===92||b===93?(t.consume(b),f++,g):g(b)}}function ww(t,i,r,o,s,u){let c;return f;function f(x){return x===34||x===39||x===40?(t.enter(o),t.enter(s),t.consume(x),t.exit(s),c=x===40?41:x,p):r(x)}function p(x){return x===c?(t.enter(s),t.consume(x),t.exit(s),t.exit(o),i):(t.enter(u),m(x))}function m(x){return x===c?(t.exit(u),p(c)):x===null?r(x):Re(x)?(t.enter("lineEnding"),t.consume(x),t.exit("lineEnding"),$e(t,m,"linePrefix")):(t.enter("chunkString",{contentType:"string"}),y(x))}function y(x){return x===c||x===null||Re(x)?(t.exit("chunkString"),m(x)):(t.consume(x),x===92?g:y)}function g(x){return x===c||x===92?(t.consume(x),y):y(x)}}function Li(t,i){let r;return o;function o(s){return Re(s)?(t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),r=!0,o):Ge(s)?$e(t,o,r?"linePrefix":"lineSuffix")(s):i(s)}}const uT={name:"definition",tokenize:dT},cT={partial:!0,tokenize:fT};function dT(t,i,r){const o=this;let s;return u;function u(b){return t.enter("definition"),c(b)}function c(b){return xw.call(o,t,f,r,"definitionLabel","definitionLabelMarker","definitionLabelString")(b)}function f(b){return s=Zn(o.sliceSerialize(o.events[o.events.length-1][1]).slice(1,-1)),b===58?(t.enter("definitionMarker"),t.consume(b),t.exit("definitionMarker"),p):r(b)}function p(b){return Qe(b)?Li(t,m)(b):m(b)}function m(b){return vw(t,y,r,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(b)}function y(b){return t.attempt(cT,g,g)(b)}function g(b){return Ge(b)?$e(t,x,"whitespace")(b):x(b)}function x(b){return b===null||Re(b)?(t.exit("definition"),o.parser.defined.push(s),i(b)):r(b)}}function fT(t,i,r){return o;function o(f){return Qe(f)?Li(t,s)(f):r(f)}function s(f){return ww(t,u,r,"definitionTitle","definitionTitleMarker","definitionTitleString")(f)}function u(f){return Ge(f)?$e(t,c,"whitespace")(f):c(f)}function c(f){return f===null||Re(f)?i(f):r(f)}}const hT={name:"hardBreakEscape",tokenize:mT};function mT(t,i,r){return o;function o(u){return t.enter("hardBreakEscape"),t.consume(u),s}function s(u){return Re(u)?(t.exit("hardBreakEscape"),i(u)):r(u)}}const pT={name:"headingAtx",resolve:gT,tokenize:yT};function gT(t,i){let r=t.length-2,o=3;if(t[o][1].type==="whitespace"&&(o+=2),r-2>o&&t[r][1].type==="whitespace"&&(r-=2),t[r][1].type==="atxHeadingSequence"&&(o===r-1||r-4>o&&t[r-2][1].type==="whitespace")&&(r-=o+1===r?2:4),r>o){const s={type:"atxHeadingText",start:t[o][1].start,end:t[r][1].end},u={type:"chunkText",start:t[o][1].start,end:t[r][1].end,contentType:"text"};Xn(t,o,r-o+1,[["enter",s,i],["enter",u,i],["exit",u,i],["exit",s,i]])}return t}function yT(t,i,r){let o=0;return s;function s(y){return t.enter("atxHeading"),u(y)}function u(y){return t.enter("atxHeadingSequence"),c(y)}function c(y){return y===35&&o++<6?(t.consume(y),c):y===null||Qe(y)?(t.exit("atxHeadingSequence"),f(y)):r(y)}function f(y){return y===35?(t.enter("atxHeadingSequence"),p(y)):y===null||Re(y)?(t.exit("atxHeading"),i(y)):Ge(y)?$e(t,f,"whitespace")(y):(t.enter("atxHeadingText"),m(y))}function p(y){return y===35?(t.consume(y),p):(t.exit("atxHeadingSequence"),f(y))}function m(y){return y===null||y===35||Qe(y)?(t.exit("atxHeadingText"),f(y)):(t.consume(y),m)}}const bT=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],Rv=["pre","script","style","textarea"],vT={concrete:!0,name:"htmlFlow",resolveTo:wT,tokenize:ST},xT={partial:!0,tokenize:kT};function wT(t){let i=t.length;for(;i--&&!(t[i][0]==="enter"&&t[i][1].type==="htmlFlow"););return i>1&&t[i-2][1].type==="linePrefix"&&(t[i][1].start=t[i-2][1].start,t[i+1][1].start=t[i-2][1].start,t.splice(i-2,2)),t}function ST(t,i,r){const o=this;let s,u,c,f,p;return m;function m(B){return y(B)}function y(B){return t.enter("htmlFlow"),t.enter("htmlFlowData"),t.consume(B),g}function g(B){return B===33?(t.consume(B),x):B===47?(t.consume(B),u=!0,E):B===63?(t.consume(B),s=3,o.interrupt?i:_):an(B)?(t.consume(B),c=String.fromCharCode(B),A):r(B)}function x(B){return B===45?(t.consume(B),s=2,b):B===91?(t.consume(B),s=5,f=0,w):an(B)?(t.consume(B),s=4,o.interrupt?i:_):r(B)}function b(B){return B===45?(t.consume(B),o.interrupt?i:_):r(B)}function w(B){const U="CDATA[";return B===U.charCodeAt(f++)?(t.consume(B),f===U.length?o.interrupt?i:oe:w):r(B)}function E(B){return an(B)?(t.consume(B),c=String.fromCharCode(B),A):r(B)}function A(B){if(B===null||B===47||B===62||Qe(B)){const U=B===47,ne=c.toLowerCase();return!U&&!u&&Rv.includes(ne)?(s=1,o.interrupt?i(B):oe(B)):bT.includes(c.toLowerCase())?(s=6,U?(t.consume(B),k):o.interrupt?i(B):oe(B)):(s=7,o.interrupt&&!o.parser.lazy[o.now().line]?r(B):u?T(B):C(B))}return B===45||Qt(B)?(t.consume(B),c+=String.fromCharCode(B),A):r(B)}function k(B){return B===62?(t.consume(B),o.interrupt?i:oe):r(B)}function T(B){return Ge(B)?(t.consume(B),T):H(B)}function C(B){return B===47?(t.consume(B),H):B===58||B===95||an(B)?(t.consume(B),D):Ge(B)?(t.consume(B),C):H(B)}function D(B){return B===45||B===46||B===58||B===95||Qt(B)?(t.consume(B),D):z(B)}function z(B){return B===61?(t.consume(B),j):Ge(B)?(t.consume(B),z):C(B)}function j(B){return B===null||B===60||B===61||B===62||B===96?r(B):B===34||B===39?(t.consume(B),p=B,L):Ge(B)?(t.consume(B),j):I(B)}function L(B){return B===p?(t.consume(B),p=null,q):B===null||Re(B)?r(B):(t.consume(B),L)}function I(B){return B===null||B===34||B===39||B===47||B===60||B===61||B===62||B===96||Qe(B)?z(B):(t.consume(B),I)}function q(B){return B===47||B===62||Ge(B)?C(B):r(B)}function H(B){return B===62?(t.consume(B),Z):r(B)}function Z(B){return B===null||Re(B)?oe(B):Ge(B)?(t.consume(B),Z):r(B)}function oe(B){return B===45&&s===2?(t.consume(B),P):B===60&&s===1?(t.consume(B),K):B===62&&s===4?(t.consume(B),He):B===63&&s===3?(t.consume(B),_):B===93&&s===5?(t.consume(B),be):Re(B)&&(s===6||s===7)?(t.exit("htmlFlowData"),t.check(xT,Ee,ue)(B)):B===null||Re(B)?(t.exit("htmlFlowData"),ue(B)):(t.consume(B),oe)}function ue(B){return t.check(Nh,$,Ee)(B)}function $(B){return t.enter("lineEnding"),t.consume(B),t.exit("lineEnding"),N}function N(B){return B===null||Re(B)?ue(B):(t.enter("htmlFlowData"),oe(B))}function P(B){return B===45?(t.consume(B),_):oe(B)}function K(B){return B===47?(t.consume(B),c="",J):oe(B)}function J(B){if(B===62){const U=c.toLowerCase();return Rv.includes(U)?(t.consume(B),He):oe(B)}return an(B)&&c.length<8?(t.consume(B),c+=String.fromCharCode(B),J):oe(B)}function be(B){return B===93?(t.consume(B),_):oe(B)}function _(B){return B===62?(t.consume(B),He):B===45&&s===2?(t.consume(B),_):oe(B)}function He(B){return B===null||Re(B)?(t.exit("htmlFlowData"),Ee(B)):(t.consume(B),He)}function Ee(B){return t.exit("htmlFlow"),i(B)}}function kT(t,i,r){return o;function o(s){return t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),t.attempt(wl,i,r)}}const AT={name:"htmlText",tokenize:TT};function TT(t,i,r){const o=this;let s,u,c;return f;function f(_){return t.enter("htmlText"),t.enter("htmlTextData"),t.consume(_),p}function p(_){return _===33?(t.consume(_),m):_===47?(t.consume(_),z):_===63?(t.consume(_),C):an(_)?(t.consume(_),I):r(_)}function m(_){return _===45?(t.consume(_),y):_===91?(t.consume(_),u=0,w):an(_)?(t.consume(_),T):r(_)}function y(_){return _===45?(t.consume(_),b):r(_)}function g(_){return _===null?r(_):_===45?(t.consume(_),x):Re(_)?(c=g,K(_)):(t.consume(_),g)}function x(_){return _===45?(t.consume(_),b):g(_)}function b(_){return _===62?P(_):_===45?x(_):g(_)}function w(_){const He="CDATA[";return _===He.charCodeAt(u++)?(t.consume(_),u===He.length?E:w):r(_)}function E(_){return _===null?r(_):_===93?(t.consume(_),A):Re(_)?(c=E,K(_)):(t.consume(_),E)}function A(_){return _===93?(t.consume(_),k):E(_)}function k(_){return _===62?P(_):_===93?(t.consume(_),k):E(_)}function T(_){return _===null||_===62?P(_):Re(_)?(c=T,K(_)):(t.consume(_),T)}function C(_){return _===null?r(_):_===63?(t.consume(_),D):Re(_)?(c=C,K(_)):(t.consume(_),C)}function D(_){return _===62?P(_):C(_)}function z(_){return an(_)?(t.consume(_),j):r(_)}function j(_){return _===45||Qt(_)?(t.consume(_),j):L(_)}function L(_){return Re(_)?(c=L,K(_)):Ge(_)?(t.consume(_),L):P(_)}function I(_){return _===45||Qt(_)?(t.consume(_),I):_===47||_===62||Qe(_)?q(_):r(_)}function q(_){return _===47?(t.consume(_),P):_===58||_===95||an(_)?(t.consume(_),H):Re(_)?(c=q,K(_)):Ge(_)?(t.consume(_),q):P(_)}function H(_){return _===45||_===46||_===58||_===95||Qt(_)?(t.consume(_),H):Z(_)}function Z(_){return _===61?(t.consume(_),oe):Re(_)?(c=Z,K(_)):Ge(_)?(t.consume(_),Z):q(_)}function oe(_){return _===null||_===60||_===61||_===62||_===96?r(_):_===34||_===39?(t.consume(_),s=_,ue):Re(_)?(c=oe,K(_)):Ge(_)?(t.consume(_),oe):(t.consume(_),$)}function ue(_){return _===s?(t.consume(_),s=void 0,N):_===null?r(_):Re(_)?(c=ue,K(_)):(t.consume(_),ue)}function $(_){return _===null||_===34||_===39||_===60||_===61||_===96?r(_):_===47||_===62||Qe(_)?q(_):(t.consume(_),$)}function N(_){return _===47||_===62||Qe(_)?q(_):r(_)}function P(_){return _===62?(t.consume(_),t.exit("htmlTextData"),t.exit("htmlText"),i):r(_)}function K(_){return t.exit("htmlTextData"),t.enter("lineEnding"),t.consume(_),t.exit("lineEnding"),J}function J(_){return Ge(_)?$e(t,be,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(_):be(_)}function be(_){return t.enter("htmlTextData"),c(_)}}const tm={name:"labelEnd",resolveAll:MT,resolveTo:NT,tokenize:DT},ET={tokenize:OT},CT={tokenize:jT},RT={tokenize:LT};function MT(t){let i=-1;const r=[];for(;++i<t.length;){const o=t[i][1];if(r.push(t[i]),o.type==="labelImage"||o.type==="labelLink"||o.type==="labelEnd"){const s=o.type==="labelImage"?4:2;o.type="data",i+=s}}return t.length!==r.length&&Xn(t,0,t.length,r),t}function NT(t,i){let r=t.length,o=0,s,u,c;for(;r--;){const y=t[r][1];if(s){if(y.type==="link"||y.type==="labelLink"&&y._inactive)break;t[r][0]==="enter"&&y.type==="labelLink"&&(y._inactive=!0)}else if(u){if(t[r][0]==="enter"&&(y.type==="labelImage"||y.type==="labelLink")&&!y._balanced&&(s=r,y.type!=="labelLink")){o=2;break}}else y.type==="labelEnd"&&(u=r)}const f={type:t[s][1].type==="labelLink"?"link":"image",start:{...t[s][1].start},end:{...t[t.length-1][1].end}},p={type:"label",start:{...t[s][1].start},end:{...t[u][1].end}},m={type:"labelText",start:{...t[s+o+2][1].end},end:{...t[u-2][1].start}};return c=[["enter",f,i],["enter",p,i]],c=qn(c,t.slice(s+1,s+o+3)),c=qn(c,[["enter",m,i]]),c=qn(c,Uu(i.parser.constructs.insideSpan.null,t.slice(s+o+4,u-3),i)),c=qn(c,[["exit",m,i],t[u-2],t[u-1],["exit",p,i]]),c=qn(c,t.slice(u+1)),c=qn(c,[["exit",f,i]]),Xn(t,s,t.length,c),t}function DT(t,i,r){const o=this,s=o._labelStarts;let u,c;if(s){for(;s.length>0&&s[s.length-1]._balanced;)s.pop();u=s[s.length-1]}return f;function f(x){return u?u._inactive?g(x):(c=o.parser.defined.includes(Zn(o.sliceSerialize({start:u.end,end:o.now()}))),t.enter("labelEnd"),t.enter("labelMarker"),t.consume(x),t.exit("labelMarker"),t.exit("labelEnd"),p):r(x)}function p(x){return x===40?t.attempt(ET,y,c?y:g)(x):x===91?t.attempt(CT,y,c?m:g)(x):c?y(x):g(x)}function m(x){return t.attempt(RT,y,g)(x)}function y(x){return s.pop(),i(x)}function g(x){return u._balanced=!0,r(x)}}function OT(t,i,r){return o;function o(g){return t.enter("resource"),t.enter("resourceMarker"),t.consume(g),t.exit("resourceMarker"),s}function s(g){return Qe(g)?Li(t,u)(g):u(g)}function u(g){return g===41?y(g):vw(t,c,f,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(g)}function c(g){return Qe(g)?Li(t,p)(g):y(g)}function f(g){return r(g)}function p(g){return g===34||g===39||g===40?ww(t,m,r,"resourceTitle","resourceTitleMarker","resourceTitleString")(g):y(g)}function m(g){return Qe(g)?Li(t,y)(g):y(g)}function y(g){return g===41?(t.enter("resourceMarker"),t.consume(g),t.exit("resourceMarker"),t.exit("resource"),i):r(g)}}function jT(t,i,r){const o=this;return s;function s(f){return xw.call(o,t,u,c,"reference","referenceMarker","referenceString")(f)}function u(f){return o.parser.defined.includes(Zn(o.sliceSerialize(o.events[o.events.length-1][1]).slice(1,-1)))?i(f):r(f)}function c(f){return r(f)}}function LT(t,i,r){return o;function o(u){return t.enter("reference"),t.enter("referenceMarker"),t.consume(u),t.exit("referenceMarker"),s}function s(u){return u===93?(t.enter("referenceMarker"),t.consume(u),t.exit("referenceMarker"),t.exit("reference"),i):r(u)}}const zT={name:"labelStartImage",resolveAll:tm.resolveAll,tokenize:_T};function _T(t,i,r){const o=this;let s;return u;function u(p){return t.enter("labelImage"),t.enter("labelImageMarker"),t.consume(p),t.exit("labelImageMarker"),c}function c(p){return p===91?(t.enter("labelMarker"),t.consume(p),t.exit("labelMarker"),s=t.exit("labelImage"),f):r(p)}function f(p){return p===94&&"_hiddenFootnoteSupport"in o.parser.constructs?r(p):(o._labelStarts=o._labelStarts||[],o._labelStarts.push(s),i(p))}}const IT={name:"labelStartLink",resolveAll:tm.resolveAll,tokenize:HT};function HT(t,i,r){const o=this;let s;return u;function u(f){return t.enter("labelLink"),t.enter("labelMarker"),t.consume(f),t.exit("labelMarker"),s=t.exit("labelLink"),c}function c(f){return f===94&&"_hiddenFootnoteSupport"in o.parser.constructs?r(f):(o._labelStarts=o._labelStarts||[],o._labelStarts.push(s),i(f))}}const Hf={name:"lineEnding",tokenize:BT};function BT(t,i){return r;function r(o){return t.enter("lineEnding"),t.consume(o),t.exit("lineEnding"),$e(t,i,"linePrefix")}}const mu={name:"thematicBreak",tokenize:qT};function qT(t,i,r){let o=0,s;return u;function u(m){return t.enter("thematicBreak"),c(m)}function c(m){return s=m,f(m)}function f(m){return m===s?(t.enter("thematicBreakSequence"),p(m)):o>=3&&(m===null||Re(m))?(t.exit("thematicBreak"),i(m)):r(m)}function p(m){return m===s?(t.consume(m),o++,p):(t.exit("thematicBreakSequence"),Ge(m)?$e(t,f,"whitespace")(m):f(m))}}const fn={continuation:{tokenize:VT},exit:$T,name:"list",tokenize:PT},UT={partial:!0,tokenize:YT},FT={partial:!0,tokenize:GT};function PT(t,i,r){const o=this,s=o.events[o.events.length-1];let u=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0,c=0;return f;function f(b){const w=o.containerState.type||(b===42||b===43||b===45?"listUnordered":"listOrdered");if(w==="listUnordered"?!o.containerState.marker||b===o.containerState.marker:Rh(b)){if(o.containerState.type||(o.containerState.type=w,t.enter(w,{_container:!0})),w==="listUnordered")return t.enter("listItemPrefix"),b===42||b===45?t.check(mu,r,m)(b):m(b);if(!o.interrupt||b===49)return t.enter("listItemPrefix"),t.enter("listItemValue"),p(b)}return r(b)}function p(b){return Rh(b)&&++c<10?(t.consume(b),p):(!o.interrupt||c<2)&&(o.containerState.marker?b===o.containerState.marker:b===41||b===46)?(t.exit("listItemValue"),m(b)):r(b)}function m(b){return t.enter("listItemMarker"),t.consume(b),t.exit("listItemMarker"),o.containerState.marker=o.containerState.marker||b,t.check(wl,o.interrupt?r:y,t.attempt(UT,x,g))}function y(b){return o.containerState.initialBlankLine=!0,u++,x(b)}function g(b){return Ge(b)?(t.enter("listItemPrefixWhitespace"),t.consume(b),t.exit("listItemPrefixWhitespace"),x):r(b)}function x(b){return o.containerState.size=u+o.sliceSerialize(t.exit("listItemPrefix"),!0).length,i(b)}}function VT(t,i,r){const o=this;return o.containerState._closeFlow=void 0,t.check(wl,s,u);function s(f){return o.containerState.furtherBlankLines=o.containerState.furtherBlankLines||o.containerState.initialBlankLine,$e(t,i,"listItemIndent",o.containerState.size+1)(f)}function u(f){return o.containerState.furtherBlankLines||!Ge(f)?(o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,c(f)):(o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,t.attempt(FT,i,c)(f))}function c(f){return o.containerState._closeFlow=!0,o.interrupt=void 0,$e(t,t.attempt(fn,i,r),"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(f)}}function GT(t,i,r){const o=this;return $e(t,s,"listItemIndent",o.containerState.size+1);function s(u){const c=o.events[o.events.length-1];return c&&c[1].type==="listItemIndent"&&c[2].sliceSerialize(c[1],!0).length===o.containerState.size?i(u):r(u)}}function $T(t){t.exit(this.containerState.type)}function YT(t,i,r){const o=this;return $e(t,s,"listItemPrefixWhitespace",o.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function s(u){const c=o.events[o.events.length-1];return!Ge(u)&&c&&c[1].type==="listItemPrefixWhitespace"?i(u):r(u)}}const Mv={name:"setextUnderline",resolveTo:JT,tokenize:XT};function JT(t,i){const r=new bu;let o=t.length,s,u,c;for(;o--;)if(t[o][0]==="enter"){if(t[o][1].type==="content"){s=o;break}t[o][1].type==="paragraph"&&(u=o)}else t[o][1].type==="content"&&r.add(o,1,[]),!c&&t[o][1].type==="definition"&&(c=o);const f={type:"setextHeading",start:{...t[s][1].start},end:{...t[t.length-1][1].end}};return t[u][1].type="setextHeadingText",c?(r.add(u,0,[["enter",f,i]]),r.add(c+1,0,[["exit",t[s][1],i]]),t[s][1].end={...t[c][1].end}):t[s][1]=f,r.add(t.length,0,[["exit",f,i]]),r.consume(t),t}function XT(t,i,r){const o=this;let s;return u;function u(m){let y=o.events.length,g;for(;y--;)if(o.events[y][1].type!=="lineEnding"&&o.events[y][1].type!=="linePrefix"&&o.events[y][1].type!=="content"){g=o.events[y][1].type==="paragraph";break}return!o.parser.lazy[o.now().line]&&(o.interrupt||g)?(t.enter("setextHeadingLine"),s=m,c(m)):r(m)}function c(m){return t.enter("setextHeadingLineSequence"),f(m)}function f(m){return m===s?(t.consume(m),f):(t.exit("setextHeadingLineSequence"),Ge(m)?$e(t,p,"lineSuffix")(m):p(m))}function p(m){return m===null||Re(m)?(t.exit("setextHeadingLine"),i(m)):r(m)}}const ZT={tokenize:QT};function QT(t){const i=this,r=t.attempt(wl,o,t.attempt(this.parser.constructs.flowInitial,s,$e(t,t.attempt(this.parser.constructs.flow,s,t.attempt(aT,s)),"linePrefix")));return r;function o(u){if(u===null){t.consume(u);return}return t.enter("lineEndingBlank"),t.consume(u),t.exit("lineEndingBlank"),i.currentConstruct=void 0,r}function s(u){if(u===null){t.consume(u);return}return t.enter("lineEnding"),t.consume(u),t.exit("lineEnding"),i.currentConstruct=void 0,r}}const KT={resolveAll:kw()},WT=Sw("string"),eE=Sw("text");function Sw(t){return{resolveAll:kw(t==="text"?tE:void 0),tokenize:i};function i(r){const o=this,s=this.parser.constructs[t],u=r.attempt(s,c,f);return c;function c(y){return m(y)?u(y):f(y)}function f(y){if(y===null){r.consume(y);return}return r.enter("data"),r.consume(y),p}function p(y){return m(y)?(r.exit("data"),u(y)):(r.consume(y),p)}function m(y){if(y===null)return!0;const g=s[y];let x=-1;if(g)for(;++x<g.length;){const b=g[x];if(!b.previous||b.previous.call(o,o.previous))return!0}return!1}}}function kw(t){return i;function i(r,o){let s=-1,u;for(;++s<=r.length;)u===void 0?r[s]&&r[s][1].type==="data"&&(u=s,s++):(!r[s]||r[s][1].type!=="data")&&(s!==u+2&&(r[u][1].end=r[s-1][1].end,r.splice(u+2,s-u-2),s=u+2),u=void 0);return t?t(r,o):r}}function tE(t,i){const r=new bu;let o=0;for(;++o<=t.length;)if((o===t.length||t[o][1].type==="lineEnding")&&t[o-1][1].type==="data"){const s=t[o-1][1],u=i.sliceStream(s);let c=u.length,f=-1,p=0,m;for(;c--;){const y=u[c];if(typeof y=="string"){for(f=y.length;y.charCodeAt(f-1)===32;)p++,f--;if(f)break;f=-1}else if(y===-2)m=!0,p++;else if(y!==-1){c++;break}}if(i._contentTypeTextTrailing&&o===t.length&&(p=0),p){const y={type:o===t.length||m||p<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:c?f:s.start._bufferIndex+f,_index:s.start._index+c,line:s.end.line,column:s.end.column-p,offset:s.end.offset-p},end:{...s.end}};s.end={...y.start},s.start.offset===s.end.offset?Object.assign(s,y):r.add(o,0,[["enter",y,i],["exit",y,i]])}o++}return r.consume(t),t}const nE={42:fn,43:fn,45:fn,48:fn,49:fn,50:fn,51:fn,52:fn,53:fn,54:fn,55:fn,56:fn,57:fn,62:pw},iE={91:uT},aE={[-2]:If,[-1]:If,32:If},rE={35:pT,42:mu,45:[Mv,mu],60:vT,61:Mv,95:mu,96:Cv,126:Cv},oE={38:yw,92:gw},lE={[-5]:Hf,[-4]:Hf,[-3]:Hf,33:zT,38:yw,42:Mh,60:[BA,AT],91:IT,92:[hT,gw],93:tm,95:Mh,96:KA},sE={null:[Mh,KT]},uE={null:[42,95]},cE={null:[]},dE=Object.freeze(Object.defineProperty({__proto__:null,attentionMarkers:uE,contentInitial:iE,disable:cE,document:nE,flow:rE,flowInitial:aE,insideSpan:sE,string:oE,text:lE},Symbol.toStringTag,{value:"Module"}));function fE(t,i,r){let o={_bufferIndex:-1,_index:0,line:r&&r.line||1,column:r&&r.column||1,offset:r&&r.offset||0};const s={},u=[];let c=[],f=[];const p={attempt:L(z),check:L(j),consume:T,enter:C,exit:D,interrupt:L(j,{interrupt:!0})},m={code:null,containerState:{},defineSkip:E,events:[],now:w,parser:t,previous:null,sliceSerialize:x,sliceStream:b,write:g};let y=i.tokenize.call(m,p);return i.resolveAll&&u.push(i),m;function g(Z){return c=qn(c,Z),A(),c[c.length-1]!==null?[]:(I(i,0),m.events=Uu(u,m.events,m),m.events)}function x(Z,oe){return mE(b(Z),oe)}function b(Z){return hE(c,Z)}function w(){const{_bufferIndex:Z,_index:oe,line:ue,column:$,offset:N}=o;return{_bufferIndex:Z,_index:oe,line:ue,column:$,offset:N}}function E(Z){s[Z.line]=Z.column,H()}function A(){for(;o._index<c.length;){const Z=c[o._index];if(typeof Z=="string"){const oe=o._index;for(o._bufferIndex<0&&(o._bufferIndex=0);o._index===oe&&o._bufferIndex<Z.length;)k(Z.charCodeAt(o._bufferIndex))}else k(Z)}}function k(Z){y=y(Z)}function T(Z){Re(Z)?(o.line++,o.column=1,o.offset+=Z===-3?2:1,H()):Z!==-1&&(o.column++,o.offset++),o._bufferIndex<0?o._index++:(o._bufferIndex++,o._bufferIndex===c[o._index].length&&(o._bufferIndex=-1,o._index++)),m.previous=Z}function C(Z,oe){const ue=oe||{};return ue.type=Z,ue.start=w(),m.events.push(["enter",ue,m]),f.push(ue),ue}function D(Z){const oe=f.pop();return oe.end=w(),m.events.push(["exit",oe,m]),oe}function z(Z,oe){I(Z,oe.from)}function j(Z,oe){oe.restore()}function L(Z,oe){return ue;function ue($,N,P){let K,J,be,_;return Array.isArray($)?Ee($):"tokenize"in $?Ee([$]):He($);function He(he){return ee;function ee(pe){const ge=pe!==null&&he[pe],ke=pe!==null&&he.null,le=[...Array.isArray(ge)?ge:ge?[ge]:[],...Array.isArray(ke)?ke:ke?[ke]:[]];return Ee(le)(pe)}}function Ee(he){return K=he,J=0,he.length===0?P:B(he[J])}function B(he){return ee;function ee(pe){return _=q(),be=he,he.partial||(m.currentConstruct=he),he.name&&m.parser.constructs.disable.null.includes(he.name)?ne():he.tokenize.call(oe?Object.assign(Object.create(m),oe):m,p,U,ne)(pe)}}function U(he){return Z(be,_),N}function ne(he){return _.restore(),++J<K.length?B(K[J]):P}}}function I(Z,oe){Z.resolveAll&&!u.includes(Z)&&u.push(Z),Z.resolve&&Xn(m.events,oe,m.events.length-oe,Z.resolve(m.events.slice(oe),m)),Z.resolveTo&&(m.events=Z.resolveTo(m.events,m))}function q(){const Z=w(),oe=m.previous,ue=m.currentConstruct,$=m.events.length,N=Array.from(f);return{from:$,restore:P};function P(){o=Z,m.previous=oe,m.currentConstruct=ue,m.events.length=$,f=N,H()}}function H(){o.line in s&&o.column<2&&(o.column=s[o.line],o.offset+=s[o.line]-1)}}function hE(t,i){const r=i.start._index,o=i.start._bufferIndex,s=i.end._index,u=i.end._bufferIndex;let c;if(r===s)c=[t[r].slice(o,u)];else{if(c=t.slice(r,s),o>-1){const f=c[0];typeof f=="string"?c[0]=f.slice(o):c.shift()}u>0&&c.push(t[s].slice(0,u))}return c}function mE(t,i){let r=-1;const o=[];let s;for(;++r<t.length;){const u=t[r];let c;if(typeof u=="string")c=u;else switch(u){case-5:{c="\r";break}case-4:{c=`
`;break}case-3:{c=`\r
`;break}case-2:{c=i?" ":"	";break}case-1:{if(!i&&s)continue;c=" ";break}default:c=String.fromCharCode(u)}s=u===-2,o.push(c)}return o.join("")}function pE(t){const o={constructs:fw([dE,...(t||{}).extensions||[]]),content:s(OA),defined:[],document:s(LA),flow:s(ZT),lazy:{},string:s(WT),text:s(eE)};return o;function s(u){return c;function c(f){return fE(o,u,f)}}}function gE(t){for(;!bw(t););return t}const Nv=/[\0\t\n\r]/g;function yE(){let t=1,i="",r=!0,o;return s;function s(u,c,f){u=i+(typeof u=="string"?u.toString():new TextDecoder(c||void 0).decode(u));const p=[];let m=0;for(i="",r&&(u.charCodeAt(0)===65279&&m++,r=void 0);m<u.length;){Nv.lastIndex=m;const y=Nv.exec(u),g=y&&y.index!==void 0?y.index:u.length,x=u.charCodeAt(g);if(!y){i=u.slice(m);break}if(x===10&&m===g&&o)p.push(-3),o=void 0;else switch(o&&(p.push(-5),o=void 0),m<g&&(p.push(u.slice(m,g)),t+=g-m),x){case 0:{p.push(65533),t++;break}case 9:{const b=Math.ceil(t/4)*4;for(p.push(-2);t++<b;)p.push(-1);break}case 10:{p.push(-4),t=1;break}default:o=!0,t=1}m=g+1}return f&&(o&&p.push(-5),i&&p.push(i),p.push(null)),p}}const bE=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Aw(t){return t.replace(bE,vE)}function vE(t,i,r){if(i)return i;if(r.charCodeAt(0)===35){const s=r.charCodeAt(1),u=s===120||s===88;return hw(r.slice(u?2:1),u?16:10)}return pl(r)||t}function zi(t){return!t||typeof t!="object"?"":"position"in t||"type"in t?Dv(t.position):"start"in t||"end"in t?Dv(t):"line"in t||"column"in t?Dh(t):""}function Dh(t){return Ov(t&&t.line)+":"+Ov(t&&t.column)}function Dv(t){return Dh(t&&t.start)+"-"+Dh(t&&t.end)}function Ov(t){return t&&typeof t=="number"?t:1}const Tw={}.hasOwnProperty;function xu(t,i,r){return i&&typeof i=="object"&&(r=i,i=void 0),xE(r)(gE(pE(r).document().write(yE()(t,i,!0))))}function xE(t){const i={afterExit:[],beforeEnter:[],transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:c(X),autolinkProtocol:H,autolinkEmail:H,atxHeading:c(ce),blockQuote:c(le),characterEscape:H,characterReference:H,codeFenced:c(se),codeFencedFenceInfo:f,codeFencedFenceMeta:f,codeIndented:c(se,f),codeText:c(ve,f),codeTextData:H,data:H,codeFlowValue:H,definition:c(Ce),definitionDestinationString:f,definitionLabelString:f,definitionTitleString:f,emphasis:c(Me),hardBreakEscape:c(xe),hardBreakTrailing:c(xe),htmlFlow:c(Ne,f),htmlFlowData:H,htmlText:c(Ne,f),htmlTextData:H,image:c(Be),label:f,link:c(X),listItem:c(ie),listItemValue:b,listOrdered:c(Le,x),listUnordered:c(Le),paragraph:c(ye),reference:U,referenceString:f,resourceDestinationString:f,resourceTitleString:f,setextHeading:c(ce),strong:c(Ae),thematicBreak:c(je)},exit:{atxHeading:m(),atxHeadingSequence:j,autolink:m(),autolinkEmail:ke,autolinkProtocol:ge,blockQuote:m(),characterEscapeValue:Z,characterReferenceMarkerHexadecimal:he,characterReferenceMarkerNumeric:he,characterReferenceValue:ee,characterReference:pe,codeFenced:m(k),codeFencedFence:A,codeFencedFenceInfo:w,codeFencedFenceMeta:E,codeFlowValue:Z,codeIndented:m(T),codeText:m(P),codeTextData:Z,data:Z,definition:m(),definitionDestinationString:z,definitionLabelString:C,definitionTitleString:D,emphasis:m(),hardBreakEscape:m(ue),hardBreakTrailing:m(ue),htmlFlow:m($),htmlFlowData:Z,htmlText:m(N),htmlTextData:Z,image:m(J),label:_,labelText:be,lineEnding:oe,link:m(K),listItem:m(),listOrdered:m(),listUnordered:m(),paragraph:m(),referenceString:ne,resourceDestinationString:He,resourceTitleString:Ee,resource:B,setextHeading:m(q),setextHeadingLineSequence:I,setextHeadingText:L,strong:m(),thematicBreak:m()}};Ew(i,(t||{}).mdastExtensions||[]);const r={};return o;function o(V){let R={type:"root",children:[],position:void 0};const we={stack:[R],tokenStack:[],config:i,enter:p,exit:y,buffer:f,resume:g,data:r},De=[],ze=[];let Fe=-1;for(;++Fe<V.length;)if(ze.push(V[Fe]),V[Fe][1].type==="listOrdered"||V[Fe][1].type==="listUnordered")if(V[Fe][0]==="enter")De.push(ze.length-1);else{const qe=De.pop();u(ze,qe)}for(V=ze,Fe=-1;++Fe<V.length;){const qe=i[V[Fe][0]];V[Fe][0]==="enter"&&i.beforeEnter.length>0&&s(i.beforeEnter,{...we,sliceSerialize:V[Fe][2].sliceSerialize},V[Fe][1]),Tw.call(qe,V[Fe][1].type)&&qe[V[Fe][1].type].call({...we,sliceSerialize:V[Fe][2].sliceSerialize},V[Fe][1]),V[Fe][0]==="exit"&&i.afterExit.length>0&&s(i.afterExit,{...we,sliceSerialize:V[Fe][2].sliceSerialize},V[Fe][1])}if(we.tokenStack.length>0){const qe=we.tokenStack[we.tokenStack.length-1];(qe[1]||jv).call(we,void 0,qe[0])}for(R.position={start:ma(V.length>0?V[0][1].start:{line:1,column:1,offset:0}),end:ma(V.length>0?V[V.length-2][1].end:{line:1,column:1,offset:0})},Fe=-1;++Fe<i.transforms.length;)R=i.transforms[Fe](R)||R;return R}function s(V,R,we){let De=-1;for(;++De<V.length;)V[De].call(R,we)}function u(V,R){const we=V.length-1;let De=R-1,ze=-1,Fe=!1,qe,tt,St,ht;const yi=[];for(;++De<=we;){const Kt=V[De];switch(Kt[1].type){case"listUnordered":case"listOrdered":case"blockQuote":{Kt[0]==="enter"?ze++:ze--,ht=void 0;break}case"lineEndingBlank":{Kt[0]==="enter"&&(qe&&!ht&&!ze&&!St&&(St=De),ht=void 0);break}case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:ht=void 0}if(!ze&&Kt[0]==="enter"&&Kt[1].type==="listItemPrefix"||ze===-1&&Kt[0]==="exit"&&(Kt[1].type==="listUnordered"||Kt[1].type==="listOrdered")){if(qe){let bi=De;for(tt=void 0;bi--;){const Nn=V[bi];if(Nn[1].type==="lineEnding"||Nn[1].type==="lineEndingBlank"){if(Nn[0]==="exit")continue;tt&&(V[tt][1].type="lineEndingBlank",Fe=!0),Nn[1].type="lineEnding",tt=bi}else if(!(Nn[1].type==="linePrefix"||Nn[1].type==="blockQuotePrefix"||Nn[1].type==="blockQuotePrefixWhitespace"||Nn[1].type==="blockQuoteMarker"||Nn[1].type==="listItemIndent"))break}St&&(!tt||St<tt)&&(qe._spread=!0),qe.end=Object.assign({},tt?V[tt][1].start:Kt[1].end),yi.push({at:tt||De,event:["exit",qe,Kt[2]]})}if(Kt[1].type==="listItemPrefix"){const bi={type:"listItem",_spread:!1,start:Object.assign({},Kt[1].start),end:void 0};qe=bi,yi.push({at:De,event:["enter",bi,Kt[2]]}),St=void 0,ht=!0}}}const Je=V.splice(R);let pt=0;for(De=-1;++De<Je.length;){for(;pt<yi.length&&yi[pt].at===R+De;)V.push(yi[pt++].event);V.push(Je[De])}V[R][1]._spread=Fe}function c(V,R){return we;function we(De){p.call(this,V(De),De),R&&R.call(this,De)}}function f(){this.stack.push({type:"fragment",children:[]})}function p(V,R,we){this.stack[this.stack.length-1].children.push(V),this.stack.push(V),this.tokenStack.push([R,we||void 0]),V.position={start:ma(R.start),end:void 0}}function m(V){return R;function R(we){V&&V.call(this,we),y.call(this,we)}}function y(V,R){const we=this.stack.pop(),De=this.tokenStack.pop();if(!De)throw new Error("Cannot close `"+V.type+"` ("+zi({start:V.start,end:V.end})+"): it’s not open");De[0].type!==V.type&&(R?R.call(this,V,De[0]):(De[1]||jv).call(this,V,De[0])),we.position.end=ma(V.end)}function g(){return em(this.stack.pop())}function x(){this.data.expectingFirstListItemValue=!0}function b(V){if(this.data.expectingFirstListItemValue){const R=this.stack[this.stack.length-2];R.start=Number.parseInt(this.sliceSerialize(V),10),this.data.expectingFirstListItemValue=void 0}}function w(){const V=this.resume(),R=this.stack[this.stack.length-1];R.lang=V}function E(){const V=this.resume(),R=this.stack[this.stack.length-1];R.meta=V}function A(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function k(){const V=this.resume(),R=this.stack[this.stack.length-1];R.value=V.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}function T(){const V=this.resume(),R=this.stack[this.stack.length-1];R.value=V.replace(/(\r?\n|\r)$/g,"")}function C(V){const R=this.resume(),we=this.stack[this.stack.length-1];we.label=R,we.identifier=Zn(this.sliceSerialize(V)).toLowerCase()}function D(){const V=this.resume(),R=this.stack[this.stack.length-1];R.title=V}function z(){const V=this.resume(),R=this.stack[this.stack.length-1];R.url=V}function j(V){const R=this.stack[this.stack.length-1];if(!R.depth){const we=this.sliceSerialize(V).length;R.depth=we}}function L(){this.data.setextHeadingSlurpLineEnding=!0}function I(V){const R=this.stack[this.stack.length-1];R.depth=this.sliceSerialize(V).codePointAt(0)===61?1:2}function q(){this.data.setextHeadingSlurpLineEnding=void 0}function H(V){const we=this.stack[this.stack.length-1].children;let De=we[we.length-1];(!De||De.type!=="text")&&(De=me(),De.position={start:ma(V.start),end:void 0},we.push(De)),this.stack.push(De)}function Z(V){const R=this.stack.pop();R.value+=this.sliceSerialize(V),R.position.end=ma(V.end)}function oe(V){const R=this.stack[this.stack.length-1];if(this.data.atHardBreak){const we=R.children[R.children.length-1];we.position.end=ma(V.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&i.canContainEols.includes(R.type)&&(H.call(this,V),Z.call(this,V))}function ue(){this.data.atHardBreak=!0}function $(){const V=this.resume(),R=this.stack[this.stack.length-1];R.value=V}function N(){const V=this.resume(),R=this.stack[this.stack.length-1];R.value=V}function P(){const V=this.resume(),R=this.stack[this.stack.length-1];R.value=V}function K(){const V=this.stack[this.stack.length-1];if(this.data.inReference){const R=this.data.referenceType||"shortcut";V.type+="Reference",V.referenceType=R,delete V.url,delete V.title}else delete V.identifier,delete V.label;this.data.referenceType=void 0}function J(){const V=this.stack[this.stack.length-1];if(this.data.inReference){const R=this.data.referenceType||"shortcut";V.type+="Reference",V.referenceType=R,delete V.url,delete V.title}else delete V.identifier,delete V.label;this.data.referenceType=void 0}function be(V){const R=this.sliceSerialize(V),we=this.stack[this.stack.length-2];we.label=Aw(R),we.identifier=Zn(R).toLowerCase()}function _(){const V=this.stack[this.stack.length-1],R=this.resume(),we=this.stack[this.stack.length-1];if(this.data.inReference=!0,we.type==="link"){const De=V.children;we.children=De}else we.alt=R}function He(){const V=this.resume(),R=this.stack[this.stack.length-1];R.url=V}function Ee(){const V=this.resume(),R=this.stack[this.stack.length-1];R.title=V}function B(){this.data.inReference=void 0}function U(){this.data.referenceType="collapsed"}function ne(V){const R=this.resume(),we=this.stack[this.stack.length-1];we.label=R,we.identifier=Zn(this.sliceSerialize(V)).toLowerCase(),this.data.referenceType="full"}function he(V){this.data.characterReferenceType=V.type}function ee(V){const R=this.sliceSerialize(V),we=this.data.characterReferenceType;let De;we?(De=hw(R,we==="characterReferenceMarkerNumeric"?10:16),this.data.characterReferenceType=void 0):De=pl(R);const ze=this.stack[this.stack.length-1];ze.value+=De}function pe(V){const R=this.stack.pop();R.position.end=ma(V.end)}function ge(V){Z.call(this,V);const R=this.stack[this.stack.length-1];R.url=this.sliceSerialize(V)}function ke(V){Z.call(this,V);const R=this.stack[this.stack.length-1];R.url="mailto:"+this.sliceSerialize(V)}function le(){return{type:"blockquote",children:[],position:void 0}}function se(){return{type:"code",lang:null,meta:null,value:"",position:void 0}}function ve(){return{type:"inlineCode",value:"",position:void 0}}function Ce(){return{type:"definition",identifier:"",label:null,title:null,url:"",position:void 0}}function Me(){return{type:"emphasis",children:[],position:void 0}}function ce(){return{type:"heading",depth:0,children:[],position:void 0}}function xe(){return{type:"break",position:void 0}}function Ne(){return{type:"html",value:"",position:void 0}}function Be(){return{type:"image",title:null,url:"",alt:null,position:void 0}}function X(){return{type:"link",title:null,url:"",children:[],position:void 0}}function Le(V){return{type:"list",ordered:V.type==="listOrdered",start:null,spread:V._spread,children:[],position:void 0}}function ie(V){return{type:"listItem",spread:V._spread,checked:null,children:[],position:void 0}}function ye(){return{type:"paragraph",children:[],position:void 0}}function Ae(){return{type:"strong",children:[],position:void 0}}function me(){return{type:"text",value:"",position:void 0}}function je(){return{type:"thematicBreak",position:void 0}}}function ma(t){return{line:t.line,column:t.column,offset:t.offset}}function Ew(t,i){let r=-1;for(;++r<i.length;){const o=i[r];Array.isArray(o)?Ew(t,o):wE(t,o)}}function wE(t,i){let r;for(r in i)if(Tw.call(i,r))switch(r){case"canContainEols":{const o=i[r];o&&t[r].push(...o);break}case"transforms":{const o=i[r];o&&t[r].push(...o);break}case"afterExit":case"beforeEnter":{const o=i[r];o&&t[r].push(o);break}case"enter":case"exit":{const o=i[r];o&&Object.assign(t[r],o);break}}}function jv(t,i){throw t?new Error("Cannot close `"+t.type+"` ("+zi({start:t.start,end:t.end})+"): a different token (`"+i.type+"`, "+zi({start:i.start,end:i.end})+") is open"):new Error("Cannot close document, a token (`"+i.type+"`, "+zi({start:i.start,end:i.end})+") is still open")}const SE=/[$_\p{ID_Start}]/u,kE=/[$_\u{200C}\u{200D}\p{ID_Continue}]/u,AE=/[-$_\u{200C}\u{200D}\p{ID_Continue}]/u,TE=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,EE=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Cw={};function Yn(t){return t?SE.test(String.fromCodePoint(t)):!1}function rl(t,i){const o=(i||Cw).jsx?AE:kE;return t?o.test(String.fromCodePoint(t)):!1}function Lv(t,i){return(Cw.jsx?EE:TE).test(t)}const CE={}.hasOwnProperty,RE=Symbol("continue"),Bf=Symbol("exit"),ME=Symbol("skip");function NE(t,i){let r,o;typeof i=="function"?r=i:i&&typeof i=="object"&&(i.enter&&(r=i.enter),i.leave&&(o=i.leave)),s(t,void 0,void 0,[])();function s(u,c,f,p){return qf(u)&&(m.displayName="node ("+u.type+")"),m;function m(){const y=r?zv(r(u,c,f,p)):[];if(y[0]===Bf)return y;if(y[0]!==ME){let g;for(g in u)if(CE.call(u,g)&&u[g]&&typeof u[g]=="object"&&g!=="data"&&g!=="position"){const x=p.concat(u),b=u[g];if(Array.isArray(b)){const w=b;let E=0;for(;E>-1&&E<w.length;){const A=w[E];if(qf(A)){const k=s(A,g,E,x)();if(k[0]===Bf)return k;E=typeof k[1]=="number"?k[1]:E+1}else E++}}else if(qf(b)){const w=s(b,g,void 0,x)();if(w[0]===Bf)return w}}}return o?zv(o(u,c,f,p)):y}}}function zv(t){return Array.isArray(t)?t:typeof t=="number"?[RE,t]:[t]}function qf(t){return!!(t&&typeof t=="object"&&"type"in t&&typeof t.type=="string"&&t.type.length>0)}class lt extends Error{constructor(i,r,o){super(),typeof r=="string"&&(o=r,r=void 0);let s="",u={},c=!1;if(r&&("line"in r&&"column"in r?u={place:r}:"start"in r&&"end"in r?u={place:r}:"type"in r?u={ancestors:[r],place:r.position}:u={...r}),typeof i=="string"?s=i:!u.cause&&i&&(c=!0,s=i.message,u.cause=i),!u.ruleId&&!u.source&&typeof o=="string"){const p=o.indexOf(":");p===-1?u.ruleId=o:(u.source=o.slice(0,p),u.ruleId=o.slice(p+1))}if(!u.place&&u.ancestors&&u.ancestors){const p=u.ancestors[u.ancestors.length-1];p&&(u.place=p.position)}const f=u.place&&"start"in u.place?u.place.start:u.place;this.ancestors=u.ancestors||void 0,this.cause=u.cause||void 0,this.column=f?f.column:void 0,this.fatal=void 0,this.file="",this.message=s,this.line=f?f.line:void 0,this.name=zi(u.place)||"1:1",this.place=u.place||void 0,this.reason=this.message,this.ruleId=u.ruleId||void 0,this.source=u.source||void 0,this.stack=c&&u.cause&&typeof u.cause.stack=="string"?u.cause.stack:"",this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}}lt.prototype.file="";lt.prototype.name="";lt.prototype.reason="";lt.prototype.message="";lt.prototype.stack="";lt.prototype.column=void 0;lt.prototype.line=void 0;lt.prototype.ancestors=void 0;lt.prototype.cause=void 0;lt.prototype.fatal=void 0;lt.prototype.place=void 0;lt.prototype.ruleId=void 0;lt.prototype.source=void 0;function DE(t,i){const r=i.prefix||"",o=i.suffix||"",s=Object.assign({},i.acornOptions),u=[],c=[],f=s.onComment,p=s.onToken;let m=!1,y,g;const x=Object.assign({},s,{onComment:u,preserveParens:!0});p&&(x.onToken=c);const b=OE(t,i.tokenTypes),w=b.value,E=r+w+o,A=_v(w);if(A&&!i.allowEmpty)throw new lt("Unexpected empty expression",{place:T(0),ruleId:"unexpected-empty-expression",source:"micromark-extension-mdx-expression"});try{y=i.expression&&!A?i.acorn.parseExpressionAt(E,0,x):i.acorn.parse(E,x)}catch(C){const D=C,z=T(D.pos);D.message=String(D.message).replace(/ \(\d+:\d+\)$/,""),D.pos=z.offset,D.loc={line:z.line,column:z.column-1},g=D,m=D.raisedAt>=r.length+w.length||D.message==="Unterminated comment"}if(y&&i.expression&&!A)if(_v(E.slice(y.end,E.length-o.length)))y={type:"Program",start:0,end:r.length+w.length,body:[{type:"ExpressionStatement",expression:y,start:0,end:r.length+w.length}],sourceType:"module",comments:[]};else{const C=T(y.end),D=new Error("Unexpected content after expression");D.pos=C.offset,D.loc={line:C.line,column:C.column-1},g=D,y=void 0}if(y){if(y.comments=u,NE(y,function(C,D,z,j){let L=j[j.length-1],I=D;C.type==="ParenthesizedExpression"&&L&&I&&(typeof z=="number"&&(L=L[I],I=z),L[I]=C.expression),k(C)}),Array.isArray(f))f.push(...u);else if(typeof f=="function")for(const C of u)f(C.type==="Block",C.value,C.start,C.end,C.loc.start,C.loc.end);for(const C of c)C.end<=r.length||C.start-r.length>=w.length||(k(C),Array.isArray(p)?p.push(C):p(C))}return{estree:y,error:g,swallow:m};function k(C){const D=T(C.start),z=T(C.end);C.start=D.offset,C.end=z.offset,C.loc={start:{line:D.line,column:D.column-1,offset:D.offset},end:{line:z.line,column:z.column-1,offset:z.offset}},C.range=[C.start,C.end]}function T(C){let D=C-r.length;D<0?D=0:D>w.length&&(D=w.length);let z=jE(b.stops,D);return z||(z={line:i.start.line,column:i.start.column,offset:i.start.offset}),z}}function _v(t){return/^\s*$/.test(t.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/[^\r\n]*(\r\n|\n|\r)/g,""))}function OE(t,i){const r={value:"",stops:[]};let o=-1;for(;++o<t.length;){const s=t[o];if(s[0]==="enter"){const u=s[1].type;if(u==="lineEnding"||i.includes(u)){const c=s[2].sliceStream(s[1]);for(;c.length>0&&c[0]===-1;)c.shift();const f=LE(c);r.stops.push([r.value.length,s[1].start]),r.value+=f,r.stops.push([r.value.length,s[1].end])}}}return r}function jE(t,i){let r=0;for(;r<t.length&&t[r][0]<=i;)r+=1;if(r===0)return;const[o,s]=t[r-1],u=i-o;return{line:s.line,column:s.column+u,offset:s.offset+u}}function LE(t){let i=-1;const r=[];let o;for(;++i<t.length;){const s=t[i];let u;if(typeof s=="string")u=s;else switch(s){case-5:{u="\r";break}case-4:{u=`
`;break}case-3:{u=`\r
`;break}case-2:{u="	";break}case-1:{if(o)continue;u=" ";break}default:u=String.fromCharCode(s)}o=s===-2,r.push(u)}return r.join("")}function Uf(t){const i=t||{},r=i.loc||{},o=i.range||[void 0,void 0],s=Iv(r.start,o[0]||i.start),u=Iv(r.end,o[1]||i.end);if(s&&u)return{start:s,end:u}}function Iv(t,i){if(t&&typeof t=="object"){const r="line"in t?Ff(t.line):void 0,o="column"in t?Ff(t.column):void 0;if(r&&o!==void 0)return{line:r,column:o+1,offset:Ff(i)}}}function Ff(t){return typeof t=="number"&&t>-1?t:void 0}const zE=2,Kr="https://github.com/micromark/micromark-extension-mdx-expression/tree/main/packages/micromark-extension-mdx-expression",_E="#unexpected-end-of-file-in-expression-expected-a-corresponding-closing-brace-for-",IE="#unexpected-lazy-line-in-expression-in-container-expected-line-to-be-prefixed",Hv="#unexpected-type-in-code-expected-an-object-spread-spread",HE="#unexpected-extra-content-in-spread-only-a-single-spread-is-supported",BE="#could-not-parse-expression-with-acorn";function Bv(t,i,r,o,s,u,c,f,p,m,y){const g=this,x=this.events.length+3;let b=0,w,E;return A;function A(D){return t.enter(r),t.enter(o),t.consume(D),t.exit(o),w=g.now(),k}function k(D){if(D===null){if(E)throw E;const z=new lt("Unexpected end of file in expression, expected a corresponding closing brace for `{`",{place:g.now(),ruleId:"unexpected-eof",source:"micromark-extension-mdx-expression"});throw z.url=Kr+_E,z}if(Re(D))return t.enter("lineEnding"),t.consume(D),t.exit("lineEnding"),C;if(D===125&&b===0){const z=u?qE.call(g,u,c,s,x,w,m||!1,p||!1):{type:"ok",estree:void 0};if(z.type==="ok"){t.enter(o),t.consume(D),t.exit(o);const j=t.exit(r);return f&&z.estree&&Object.assign(j,{estree:z.estree}),i}return E=z.message,t.enter(s),t.consume(D),T}return t.enter(s),T(D)}function T(D){return D===125&&b===0||D===null||Re(D)?(t.exit(s),k(D)):(D===123&&!u?b+=1:D===125&&(b-=1),t.consume(D),T)}function C(D){const z=g.now();if(z.line!==w.line&&!y&&g.parser.lazy[z.line]){const j=new lt("Unexpected lazy line in expression in container, expected line to be prefixed with `>` when in a block quote, whitespace when in a list, etc",{place:g.now(),ruleId:"unexpected-lazy",source:"micromark-extension-mdx-expression"});throw j.url=Kr+IE,j}return Ge(D)?$e(t,k,"linePrefix",zE+1)(D):k(D)}}function qE(t,i,r,o,s,u,c){const f=DE(this.events.slice(o),{acorn:t,tokenTypes:[r],acornOptions:i,start:s,expression:!0,allowEmpty:u,prefix:c?"({":"",suffix:c?"})":""}),p=f.estree;if(c&&p){const m=p.body[0];if(m.type!=="ExpressionStatement"||m.expression.type!=="ObjectExpression"){const y=Uf(m),g=new lt("Unexpected `"+m.type+"` in code: expected an object spread (`{...spread}`)",{place:y.start,ruleId:"non-spread",source:"micromark-extension-mdx-expression"});throw g.url=Kr+Hv,g}if(m.expression.properties[1]){const y=Uf(m.expression.properties[1]),g=new lt("Unexpected extra content in spread: only a single spread is supported",{place:y.start,ruleId:"spread-extra",source:"micromark-extension-mdx-expression"});throw g.url=Kr+HE,g}if(m.expression.properties[0]&&m.expression.properties[0].type!=="SpreadElement"){const y=Uf(m.expression.properties[0]),g=new lt("Unexpected `"+m.expression.properties[0].type+"` in code: only spread elements are supported",{place:y.start,ruleId:"non-spread",source:"micromark-extension-mdx-expression"});throw g.url=Kr+Hv,g}}if(f.error){const m=new lt("Could not parse expression with acorn",{cause:f.error,place:{line:f.error.loc.line,column:f.error.loc.column+1,offset:f.error.pos},ruleId:"acorn",source:"micromark-extension-mdx-expression"});return m.url=Kr+BE,{type:"nok",message:m}}return{type:"ok",estree:p}}const qv="https://github.com/micromark/micromark-extension-mdx-jsx";function Rw(t,i,r,o,s,u,c,f,p,m,y,g,x,b,w,E,A,k,T,C,D,z,j,L,I,q,H,Z,oe,ue,$,N){const P=this;let K,J;return be;function be(R){return t.enter(f),t.enter(p),t.consume(R),t.exit(p),_}function _(R){return Qe(R)?r(R):(K=He,Ae(R))}function He(R){if(R===47)return t.enter(m),t.consume(R),t.exit(m),K=Ee,Ae;if(R===62)return ye(R);if(R!==null&&R>=0&&Yn(R))return t.enter(g),t.enter(x),t.consume(R),B;V(R,"before name","a character that can start a name, such as a letter, `$`, or `_`"+(R===33?" (note: to create a comment in MDX, use `{/* text */}`)":""))}function Ee(R){if(R===62)return ye(R);if(R!==null&&R>=0&&Yn(R))return t.enter(g),t.enter(x),t.consume(R),B;V(R,"before name","a character that can start a name, such as a letter, `$`, or `_`"+(R===42||R===47?" (note: JS comments in JSX tags are not supported in MDX)":""))}function B(R){if(R!==null&&R>=0&&rl(R,{jsx:!0}))return t.consume(R),B;if(R===46||R===47||R===58||R===62||R===123||Qe(R)||zt(R))return t.exit(x),K=U,Ae(R);V(R,"in name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag"+(R===64?" (note: to create a link in MDX, use `[text](url)`)":""))}function U(R){if(R===46)return t.enter(b),t.consume(R),t.exit(b),K=ne,Ae;if(R===58)return t.enter(E),t.consume(R),t.exit(E),K=pe,Ae;if(R===47||R===62||R===123||R!==null&&R>=0&&Yn(R))return t.exit(g),le(R);V(R,"after name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function ne(R){if(R!==null&&R>=0&&Yn(R))return t.enter(w),t.consume(R),he;V(R,"before member name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function he(R){if(R!==null&&R>=0&&rl(R,{jsx:!0}))return t.consume(R),he;if(R===46||R===47||R===62||R===123||Qe(R)||zt(R))return t.exit(w),K=ee,Ae(R);V(R,"in member name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag"+(R===64?" (note: to create a link in MDX, use `[text](url)`)":""))}function ee(R){if(R===46)return t.enter(b),t.consume(R),t.exit(b),K=ne,Ae;if(R===47||R===62||R===123||R!==null&&R>=0&&Yn(R))return t.exit(g),le(R);V(R,"after member name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function pe(R){if(R!==null&&R>=0&&Yn(R))return t.enter(A),t.consume(R),ge;V(R,"before local name","a character that can start a name, such as a letter, `$`, or `_`"+(R===43||R!==null&&R>46&&R<58?" (note: to create a link in MDX, use `[text](url)`)":""))}function ge(R){if(R!==null&&R>=0&&rl(R,{jsx:!0}))return t.consume(R),ge;if(R===47||R===62||R===123||Qe(R)||zt(R))return t.exit(A),K=ke,Ae(R);V(R,"in local name","a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag")}function ke(R){if(R===47||R===62||R===123||R!==null&&R>=0&&Yn(R))return t.exit(g),le(R);V(R,"after local name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function le(R){if(R===47)return t.enter(y),t.consume(R),t.exit(y),K=ie,Ae;if(R===62)return ye(R);if(R===123)return Bv.call(P,t,se,k,T,C,o,s,u,!0,!1,c)(R);if(R!==null&&R>=0&&Yn(R))return t.enter(D),t.enter(z),t.enter(j),t.consume(R),ve;V(R,"before attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag")}function se(R){return K=le,Ae(R)}function ve(R){if(R!==null&&R>=0&&rl(R,{jsx:!0}))return t.consume(R),ve;if(R===47||R===58||R===61||R===62||R===123||Qe(R)||zt(R))return t.exit(j),K=Ce,Ae(R);V(R,"in attribute name","an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag")}function Ce(R){if(R===58)return t.enter(L),t.consume(R),t.exit(L),K=Me,Ae;if(R===61)return t.exit(z),t.enter(q),t.consume(R),t.exit(q),K=Ne,Ae;if(R===47||R===62||R===123||Qe(R)||zt(R)||R!==null&&R>=0&&Yn(R))return t.exit(z),t.exit(D),K=le,Ae(R);V(R,"after attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function Me(R){if(R!==null&&R>=0&&Yn(R))return t.enter(I),t.consume(R),ce;V(R,"before local attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function ce(R){if(R!==null&&R>=0&&rl(R,{jsx:!0}))return t.consume(R),ce;if(R===47||R===61||R===62||R===123||Qe(R)||zt(R))return t.exit(I),t.exit(z),K=xe,Ae(R);V(R,"in local attribute name","an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag")}function xe(R){if(R===61)return t.enter(q),t.consume(R),t.exit(q),K=Ne,Ae;if(R===47||R===62||R===123||R!==null&&R>=0&&Yn(R))return t.exit(D),le(R);V(R,"after local attribute name","a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag")}function Ne(R){if(R===34||R===39)return t.enter(H),t.enter(Z),t.consume(R),t.exit(Z),J=R,X;if(R===123)return Bv.call(P,t,Be,ue,$,N,o,s,u,!1,!1,c)(R);V(R,"before attribute value","a character that can start an attribute value, such as `\"`, `'`, or `{`"+(R===60?" (note: to use an element or fragment as a prop value in MDX, use `{<element />}`)":""))}function Be(R){return t.exit(D),K=le,Ae(R)}function X(R){return R===null&&V(R,"in attribute value","a corresponding closing quote `"+String.fromCodePoint(J)+"`"),R===J?(t.enter(Z),t.consume(R),t.exit(Z),t.exit(H),t.exit(D),J=void 0,K=le,Ae):Re(R)?(K=X,Ae(R)):(t.enter(oe),Le(R))}function Le(R){return R===null||R===J||Re(R)?(t.exit(oe),X(R)):(t.consume(R),Le)}function ie(R){if(R===62)return ye(R);V(R,"after self-closing slash","`>` to end the tag"+(R===42||R===47?" (note: JS comments in JSX tags are not supported in MDX)":""))}function ye(R){return t.enter(p),t.consume(R),t.exit(p),t.exit(f),i}function Ae(R){return Re(R)?(t.enter("lineEnding"),t.consume(R),t.exit("lineEnding"),je):Ge(R)||zt(R)?(t.enter("esWhitespace"),me(R)):K(R)}function me(R){return Re(R)?(t.exit("esWhitespace"),Ae(R)):Ge(R)||zt(R)?(t.consume(R),me):(t.exit("esWhitespace"),K(R))}function je(R){if(!c&&P.parser.lazy[P.now().line]){const we=new lt("Unexpected lazy line in container, expected line to be prefixed with `>` when in a block quote, whitespace when in a list, etc",P.now(),"micromark-extension-mdx-jsx:unexpected-lazy");throw we.url=qv+"#unexpected-lazy-line-in-container-expected-line-to-be",we}return Ae(R)}function V(R,we,De){const ze=new lt("Unexpected "+(R===null?"end of file":"character `"+(R===96?"` ` `":String.fromCodePoint(R))+"` ("+UE(R)+")")+" "+we+", expected "+De,P.now(),"micromark-extension-mdx-jsx:unexpected-"+(R===null?"eof":"character"));throw ze.url=qv+(R===null?"#unexpected-end-of-file-at-expected-expect":"#unexpected-character-at-expected-expect"),ze}}function UE(t){return"U+"+t.toString(16).toUpperCase().padStart(4,"0")}function FE(t,i){return{name:"mdxJsxTextTag",tokenize:r};function r(o,s,u){return Rw.call(this,o,s,u,t,i.acornOptions,i.addResult,!0,"mdxJsxTextTag","mdxJsxTextTagMarker","mdxJsxTextTagClosingMarker","mdxJsxTextTagSelfClosingMarker","mdxJsxTextTagName","mdxJsxTextTagNamePrimary","mdxJsxTextTagNameMemberMarker","mdxJsxTextTagNameMember","mdxJsxTextTagNamePrefixMarker","mdxJsxTextTagNameLocal","mdxJsxTextTagExpressionAttribute","mdxJsxTextTagExpressionAttributeMarker","mdxJsxTextTagExpressionAttributeValue","mdxJsxTextTagAttribute","mdxJsxTextTagAttributeName","mdxJsxTextTagAttributeNamePrimary","mdxJsxTextTagAttributeNamePrefixMarker","mdxJsxTextTagAttributeNameLocal","mdxJsxTextTagAttributeInitializerMarker","mdxJsxTextTagAttributeValueLiteral","mdxJsxTextTagAttributeValueLiteralMarker","mdxJsxTextTagAttributeValueLiteralValue","mdxJsxTextTagAttributeValueExpression","mdxJsxTextTagAttributeValueExpressionMarker","mdxJsxTextTagAttributeValueExpressionValue")}}function PE(t,i){return{concrete:!0,name:"mdxJsxFlowTag",tokenize:r};function r(o,s,u){const c=this;return f;function f(g){return p(g)}function p(g){return Rw.call(c,o,m,u,t,i.acornOptions,i.addResult,!1,"mdxJsxFlowTag","mdxJsxFlowTagMarker","mdxJsxFlowTagClosingMarker","mdxJsxFlowTagSelfClosingMarker","mdxJsxFlowTagName","mdxJsxFlowTagNamePrimary","mdxJsxFlowTagNameMemberMarker","mdxJsxFlowTagNameMember","mdxJsxFlowTagNamePrefixMarker","mdxJsxFlowTagNameLocal","mdxJsxFlowTagExpressionAttribute","mdxJsxFlowTagExpressionAttributeMarker","mdxJsxFlowTagExpressionAttributeValue","mdxJsxFlowTagAttribute","mdxJsxFlowTagAttributeName","mdxJsxFlowTagAttributeNamePrimary","mdxJsxFlowTagAttributeNamePrefixMarker","mdxJsxFlowTagAttributeNameLocal","mdxJsxFlowTagAttributeInitializerMarker","mdxJsxFlowTagAttributeValueLiteral","mdxJsxFlowTagAttributeValueLiteralMarker","mdxJsxFlowTagAttributeValueLiteralValue","mdxJsxFlowTagAttributeValueExpression","mdxJsxFlowTagAttributeValueExpressionMarker","mdxJsxFlowTagAttributeValueExpressionValue")(g)}function m(g){return Ge(g)?$e(o,y,"whitespace")(g):y(g)}function y(g){const x=c.parser.constructs.flow[123],b=Array.isArray(x)?x:x?[x]:[];let w;for(const E of b)if(E.name==="mdxFlowExpression"){w=E;break}return g===60?f(g):g===123&&w?o.attempt(w,y,u)(g):g===null||Re(g)?s(g):u(g)}}}function VE(t){const i={},r=i.acorn;let o;if(r){if(!r.parse||!r.parseExpressionAt)throw new Error("Expected a proper `acorn` instance passed in as `options.acorn`");o=Object.assign({ecmaVersion:2024,sourceType:"module"},i.acornOptions,{locations:!0})}else if(i.acornOptions||i.addResult)throw new Error("Expected an `acorn` instance passed in as `options.acorn`");return{flow:{60:PE(r||void 0,{acornOptions:o,addResult:i.addResult||void 0})},text:{60:FE(r||void 0,{acornOptions:o,addResult:i.addResult||void 0})}}}function Uv(t,i){const r=String(t);if(typeof i!="string")throw new TypeError("Expected character");let o=0,s=r.indexOf(i);for(;s!==-1;)o++,s=r.indexOf(i,s+i.length);return o}const GE=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],Fv={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function Mw(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=48&&i<=57}function $E(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=97&&i<=102||i>=65&&i<=70||i>=48&&i<=57}function YE(t){const i=typeof t=="string"?t.charCodeAt(0):t;return i>=97&&i<=122||i>=65&&i<=90}function Pv(t){return YE(t)||Mw(t)}const JE=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function Fu(t,i){const r=i||{},o=typeof r.additional=="string"?r.additional.charCodeAt(0):r.additional,s=[];let u=0,c=-1,f="",p,m;r.position&&("start"in r.position||"indent"in r.position?(m=r.position.indent,p=r.position.start):p=r.position);let y=(p?p.line:0)||1,g=(p?p.column:0)||1,x=w(),b;for(u--;++u<=t.length;)if(b===10&&(g=(m?m[c]:0)||1),b=t.charCodeAt(u),b===38){const k=t.charCodeAt(u+1);if(k===9||k===10||k===12||k===32||k===38||k===60||Number.isNaN(k)||o&&k===o){f+=String.fromCharCode(b),g++;continue}const T=u+1;let C=T,D=T,z;if(k===35){D=++C;const ue=t.charCodeAt(D);ue===88||ue===120?(z="hexadecimal",D=++C):z="decimal"}else z="named";let j="",L="",I="";const q=z==="named"?Pv:z==="decimal"?Mw:$E;for(D--;++D<=t.length;){const ue=t.charCodeAt(D);if(!q(ue))break;I+=String.fromCharCode(ue),z==="named"&&GE.includes(I)&&(j=I,L=pl(I))}let H=t.charCodeAt(D)===59;if(H){D++;const ue=z==="named"?pl(I):!1;ue&&(j=I,L=ue)}let Z=1+D-T,oe="";if(!(!H&&r.nonTerminated===!1))if(!I)z!=="named"&&E(4,Z);else if(z==="named"){if(H&&!L)E(5,1);else if(j!==I&&(D=C+j.length,Z=1+D-C,H=!1),!H){const ue=j?1:3;if(r.attribute){const $=t.charCodeAt(D);$===61?(E(ue,Z),L=""):Pv($)?L="":E(ue,Z)}else E(ue,Z)}oe=L}else{H||E(2,Z);let ue=Number.parseInt(I,z==="hexadecimal"?16:10);if(XE(ue))E(7,Z),oe="�";else if(ue in Fv)E(6,Z),oe=Fv[ue];else{let $="";ZE(ue)&&E(6,Z),ue>65535&&(ue-=65536,$+=String.fromCharCode(ue>>>10|55296),ue=56320|ue&1023),oe=$+String.fromCharCode(ue)}}if(oe){A(),x=w(),u=D-1,g+=D-T+1,s.push(oe);const ue=w();ue.offset++,r.reference&&r.reference.call(r.referenceContext||void 0,oe,{start:x,end:ue},t.slice(T-1,D)),x=ue}else I=t.slice(T-1,D),f+=I,g+=I.length,u=D-1}else b===10&&(y++,c++,g=0),Number.isNaN(b)?A():(f+=String.fromCharCode(b),g++);return s.join("");function w(){return{line:y,column:g,offset:u+((p?p.offset:0)||0)}}function E(k,T){let C;r.warning&&(C=w(),C.column+=T,C.offset+=T,r.warning.call(r.warningContext||void 0,JE[k],C,k))}function A(){f&&(s.push(f),r.text&&r.text.call(r.textContext||void 0,f,{start:x,end:w()}),f="")}}function XE(t){return t>=55296&&t<=57343||t>1114111}function ZE(t){return t>=1&&t<=8||t===11||t>=13&&t<=31||t>=127&&t<=159||t>=64976&&t<=65007||(t&65535)===65535||(t&65535)===65534}function QE(){return{canContainEols:["mdxJsxTextElement"],enter:{mdxJsxFlowTag:o,mdxJsxFlowTagClosingMarker:s,mdxJsxFlowTagAttribute:g,mdxJsxFlowTagExpressionAttribute:x,mdxJsxFlowTagAttributeValueLiteral:t,mdxJsxFlowTagAttributeValueExpression:t,mdxJsxFlowTagSelfClosingMarker:c,mdxJsxTextTag:o,mdxJsxTextTagClosingMarker:s,mdxJsxTextTagAttribute:g,mdxJsxTextTagExpressionAttribute:x,mdxJsxTextTagAttributeValueLiteral:t,mdxJsxTextTagAttributeValueExpression:t,mdxJsxTextTagSelfClosingMarker:c},exit:{mdxJsxFlowTagClosingMarker:f,mdxJsxFlowTagNamePrimary:p,mdxJsxFlowTagNameMember:m,mdxJsxFlowTagNameLocal:y,mdxJsxFlowTagExpressionAttribute:b,mdxJsxFlowTagExpressionAttributeValue:r,mdxJsxFlowTagAttributeNamePrimary:w,mdxJsxFlowTagAttributeNameLocal:E,mdxJsxFlowTagAttributeValueLiteral:A,mdxJsxFlowTagAttributeValueLiteralValue:r,mdxJsxFlowTagAttributeValueExpression:k,mdxJsxFlowTagAttributeValueExpressionValue:r,mdxJsxFlowTagSelfClosingMarker:T,mdxJsxFlowTag:C,mdxJsxTextTagClosingMarker:f,mdxJsxTextTagNamePrimary:p,mdxJsxTextTagNameMember:m,mdxJsxTextTagNameLocal:y,mdxJsxTextTagExpressionAttribute:b,mdxJsxTextTagExpressionAttributeValue:r,mdxJsxTextTagAttributeNamePrimary:w,mdxJsxTextTagAttributeNameLocal:E,mdxJsxTextTagAttributeValueLiteral:A,mdxJsxTextTagAttributeValueLiteralValue:r,mdxJsxTextTagAttributeValueExpression:k,mdxJsxTextTagAttributeValueExpressionValue:r,mdxJsxTextTagSelfClosingMarker:T,mdxJsxTextTag:C}};function t(){this.buffer()}function i(L){return{line:L.line,column:L.column,offset:L.offset}}function r(L){this.config.enter.data.call(this,L),this.config.exit.data.call(this,L)}function o(L){const I={name:void 0,attributes:[],close:!1,selfClosing:!1,start:L.start,end:L.end};this.data.mdxJsxTagStack||(this.data.mdxJsxTagStack=[]),this.data.mdxJsxTag=I,this.buffer()}function s(L){if(this.data.mdxJsxTagStack.length===0)throw new lt("Unexpected closing slash `/` in tag, expected an open tag first",{start:L.start,end:L.end},"mdast-util-mdx-jsx:unexpected-closing-slash")}function u(L){if(this.data.mdxJsxTag.close)throw new lt("Unexpected attribute in closing tag, expected the end of the tag",{start:L.start,end:L.end},"mdast-util-mdx-jsx:unexpected-attribute")}function c(L){if(this.data.mdxJsxTag.close)throw new lt("Unexpected self-closing slash `/` in closing tag, expected the end of the tag",{start:L.start,end:L.end},"mdast-util-mdx-jsx:unexpected-self-closing-slash")}function f(){const L=this.data.mdxJsxTag;L.close=!0}function p(L){const I=this.data.mdxJsxTag;I.name=this.sliceSerialize(L)}function m(L){const I=this.data.mdxJsxTag;I.name+="."+this.sliceSerialize(L)}function y(L){const I=this.data.mdxJsxTag;I.name+=":"+this.sliceSerialize(L)}function g(L){const I=this.data.mdxJsxTag;u.call(this,L),I.attributes.push({type:"mdxJsxAttribute",name:"",value:null,position:{start:i(L.start),end:void 0}})}function x(L){const I=this.data.mdxJsxTag;u.call(this,L),I.attributes.push({type:"mdxJsxExpressionAttribute",value:"",position:{start:i(L.start),end:void 0}}),this.buffer()}function b(L){const I=this.data.mdxJsxTag,q=I.attributes[I.attributes.length-1];q.type;const H=L.estree;q.value=this.resume(),q.position,q.position.end=i(L.end),H&&(q.data={estree:H})}function w(L){const I=this.data.mdxJsxTag,q=I.attributes[I.attributes.length-1];q.type,q.name=this.sliceSerialize(L),q.position,q.position.end=i(L.end)}function E(L){const I=this.data.mdxJsxTag,q=I.attributes[I.attributes.length-1];q.type,q.name+=":"+this.sliceSerialize(L),q.position,q.position.end=i(L.end)}function A(L){const I=this.data.mdxJsxTag,q=I.attributes[I.attributes.length-1];q.value=Fu(this.resume(),{nonTerminated:!1}),q.position,q.position.end=i(L.end)}function k(L){const I=this.data.mdxJsxTag,q=I.attributes[I.attributes.length-1];q.type;const H={type:"mdxJsxAttributeValueExpression",value:this.resume()},Z=L.estree;Z&&(H.data={estree:Z}),q.value=H,q.position,q.position.end=i(L.end)}function T(){const L=this.data.mdxJsxTag;L.selfClosing=!0}function C(L){const I=this.data.mdxJsxTag,q=this.data.mdxJsxTagStack,H=q[q.length-1];if(I.close&&H.name!==I.name)throw new lt("Unexpected closing tag `"+j(I)+"`, expected corresponding closing tag for `"+j(H)+"` ("+zi(H)+")",{start:L.start,end:L.end},"mdast-util-mdx-jsx:end-tag-mismatch");this.resume(),I.close?q.pop():this.enter({type:L.type==="mdxJsxTextTag"?"mdxJsxTextElement":"mdxJsxFlowElement",name:I.name||null,attributes:I.attributes,children:[]},L,D),I.selfClosing||I.close?this.exit(L,z):q.push(I)}function D(L,I){const q=this.data.mdxJsxTagStack,H=q[q.length-1],Z=L?" before the end of `"+L.type+"`":"",oe=L?{start:L.start,end:L.end}:void 0;throw new lt("Expected a closing tag for `"+j(H)+"` ("+zi({start:I.start,end:I.end})+")"+Z,oe,"mdast-util-mdx-jsx:end-tag-mismatch")}function z(L,I){const q=this.data.mdxJsxTag;throw new lt("Expected the closing tag `"+j(q)+"` either after the end of `"+I.type+"` ("+zi(I.end)+") or another opening tag after the start of `"+I.type+"` ("+zi(I.start)+")",{start:L.start,end:L.end},"mdast-util-mdx-jsx:end-tag-mismatch")}function j(L){return"<"+(L.close?"/":"")+(L.name||"")+">"}}function nm(t,i,r,o,s,u,c,f,p,m,y,g,x,b,w){let E,A;return k;function k(N){return t.enter(o),t.enter(s),t.consume(N),t.exit(s),T}function T(N){return N===35?(E=c,C(N)):N===46?(E=f,C(N)):w&&Ge(N)?$e(t,T,"whitespace")(N):!w&&Qe(N)?Li(t,T)(N):N===null||Re(N)||zt(N)||va(N)&&N!==45&&N!==95?$(N):(t.enter(u),t.enter(p),t.consume(N),j)}function C(N){const P=E+"Marker";return t.enter(u),t.enter(E),t.enter(P),t.consume(N),t.exit(P),D}function D(N){if(N===null||N===34||N===35||N===39||N===46||N===60||N===61||N===62||N===96||N===125||Qe(N))return r(N);const P=E+"Value";return t.enter(P),t.consume(N),z}function z(N){if(N===null||N===34||N===39||N===60||N===61||N===62||N===96)return r(N);if(N===35||N===46||N===125||Qe(N)){const P=E+"Value";return t.exit(P),t.exit(E),t.exit(u),T(N)}return t.consume(N),z}function j(N){return N===null||Re(N)||zt(N)||va(N)&&N!==45&&N!==46&&N!==58&&N!==95?(t.exit(p),w&&Ge(N)?$e(t,L,"whitespace")(N):!w&&Qe(N)?Li(t,L)(N):L(N)):(t.consume(N),j)}function L(N){return N===61?(t.enter(m),t.consume(N),t.exit(m),I):(t.exit(u),T(N))}function I(N){return N===null||N===60||N===61||N===62||N===96||N===125||w&&Re(N)?r(N):N===34||N===39?(t.enter(y),t.enter(x),t.consume(N),t.exit(x),A=N,H):w&&Ge(N)?$e(t,I,"whitespace")(N):!w&&Qe(N)?Li(t,I)(N):(t.enter(g),t.enter(b),t.consume(N),A=void 0,q)}function q(N){return N===null||N===34||N===39||N===60||N===61||N===62||N===96?r(N):N===125||Qe(N)?(t.exit(b),t.exit(g),t.exit(u),T(N)):(t.consume(N),q)}function H(N){return N===A?(t.enter(x),t.consume(N),t.exit(x),t.exit(y),t.exit(u),ue):(t.enter(g),Z(N))}function Z(N){return N===A?(t.exit(g),H(N)):N===null?r(N):Re(N)?w?r(N):Li(t,Z)(N):(t.enter(b),t.consume(N),oe)}function oe(N){return N===A||N===null||Re(N)?(t.exit(b),Z(N)):(t.consume(N),oe)}function ue(N){return N===125||Qe(N)?T(N):$(N)}function $(N){return N===125?(t.enter(s),t.consume(N),t.exit(s),t.exit(o),i):r(N)}}function im(t,i,r,o,s,u,c){let f=0,p=0,m;return y;function y(A){return t.enter(o),t.enter(s),t.consume(A),t.exit(s),g}function g(A){return A===93?(t.enter(s),t.consume(A),t.exit(s),t.exit(o),i):(t.enter(u),x(A))}function x(A){if(A===93&&!p)return E(A);const k=t.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:m});return m&&(m.next=k),m=k,b(A)}function b(A){return A===null||f>999||A===91&&++p>32?r(A):A===93&&!p--?(t.exit("chunkText"),E(A)):Re(A)?c?r(A):(t.consume(A),t.exit("chunkText"),x):(t.consume(A),A===92?w:b)}function w(A){return A===91||A===92||A===93?(t.consume(A),f++,b):b(A)}function E(A){return t.exit(u),t.enter(s),t.consume(A),t.exit(s),t.exit(o),i}}function am(t,i,r,o){const s=this;return u;function u(f){return f===null||Re(f)||va(f)||zt(f)?r(f):(t.enter(o),t.consume(f),c)}function c(f){return f===null||Re(f)||zt(f)||va(f)&&f!==45&&f!==95?(t.exit(o),s.previous===45||s.previous===95?r(f):i(f)):(t.consume(f),c)}}const KE={tokenize:tC,concrete:!0},WE={tokenize:nC,partial:!0},eC={tokenize:iC,partial:!0},iu={tokenize:aC,partial:!0};function tC(t,i,r){const o=this,s=o.events[o.events.length-1],u=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let c=0,f;return p;function p(q){return t.enter("directiveContainer"),t.enter("directiveContainerFence"),t.enter("directiveContainerSequence"),m(q)}function m(q){return q===58?(t.consume(q),c++,m):c<3?r(q):(t.exit("directiveContainerSequence"),am.call(o,t,y,r,"directiveContainerName")(q))}function y(q){return q===91?t.attempt(WE,g,g)(q):g(q)}function g(q){return q===123?t.attempt(eC,x,x)(q):x(q)}function x(q){return $e(t,b,"whitespace")(q)}function b(q){return t.exit("directiveContainerFence"),q===null?L(q):Re(q)?o.interrupt?i(q):t.attempt(iu,w,L)(q):r(q)}function w(q){return q===null?L(q):Re(q)?t.check(iu,C,L)(q):(t.enter("directiveContainerContent"),E(q))}function E(q){return t.attempt({tokenize:I,partial:!0},j,u?$e(t,A,"linePrefix",u+1):A)(q)}function A(q){return q===null?j(q):Re(q)?t.check(iu,T,j)(q):T(q)}function k(q){if(q===null){const H=t.exit("chunkDocument");return o.parser.lazy[H.start.line]=!1,j(q)}return Re(q)?t.check(iu,D,z)(q):(t.consume(q),k)}function T(q){const H=t.enter("chunkDocument",{contentType:"document",previous:f});return f&&(f.next=H),f=H,k(q)}function C(q){return t.enter("directiveContainerContent"),E(q)}function D(q){t.consume(q);const H=t.exit("chunkDocument");return o.parser.lazy[H.start.line]=!1,E}function z(q){const H=t.exit("chunkDocument");return o.parser.lazy[H.start.line]=!1,j(q)}function j(q){return t.exit("directiveContainerContent"),L(q)}function L(q){return t.exit("directiveContainer"),i(q)}function I(q,H,Z){let oe=0;return $e(q,ue,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function ue(P){return q.enter("directiveContainerFence"),q.enter("directiveContainerSequence"),$(P)}function $(P){return P===58?(q.consume(P),oe++,$):oe<c?Z(P):(q.exit("directiveContainerSequence"),$e(q,N,"whitespace")(P))}function N(P){return P===null||Re(P)?(q.exit("directiveContainerFence"),H(P)):Z(P)}}}function nC(t,i,r){return im(t,i,r,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function iC(t,i,r){return nm(t,i,r,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function aC(t,i,r){const o=this;return s;function s(c){return t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),u}function u(c){return o.parser.lazy[o.now().line]?r(c):i(c)}}const rC={tokenize:sC},oC={tokenize:uC,partial:!0},lC={tokenize:cC,partial:!0};function sC(t,i,r){const o=this;return s;function s(y){return t.enter("directiveLeaf"),t.enter("directiveLeafSequence"),t.consume(y),u}function u(y){return y===58?(t.consume(y),t.exit("directiveLeafSequence"),am.call(o,t,c,r,"directiveLeafName")):r(y)}function c(y){return y===91?t.attempt(oC,f,f)(y):f(y)}function f(y){return y===123?t.attempt(lC,p,p)(y):p(y)}function p(y){return $e(t,m,"whitespace")(y)}function m(y){return y===null||Re(y)?(t.exit("directiveLeaf"),i(y)):r(y)}}function uC(t,i,r){return im(t,i,r,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function cC(t,i,r){return nm(t,i,r,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const dC={tokenize:pC,previous:mC},fC={tokenize:gC,partial:!0},hC={tokenize:yC,partial:!0};function mC(t){return t!==58||this.events[this.events.length-1][1].type==="characterEscape"}function pC(t,i,r){const o=this;return s;function s(p){return t.enter("directiveText"),t.enter("directiveTextMarker"),t.consume(p),t.exit("directiveTextMarker"),am.call(o,t,u,r,"directiveTextName")}function u(p){return p===58?r(p):p===91?t.attempt(fC,c,c)(p):c(p)}function c(p){return p===123?t.attempt(hC,f,f)(p):f(p)}function f(p){return t.exit("directiveText"),i(p)}}function gC(t,i,r){return im(t,i,r,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function yC(t,i,r){return nm(t,i,r,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function bC(){return{text:{58:dC},flow:{58:[KE,rC]}}}const Pu=(function(t){if(t==null)return SC;if(typeof t=="function")return Vu(t);if(typeof t=="object")return Array.isArray(t)?vC(t):xC(t);if(typeof t=="string")return wC(t);throw new Error("Expected function, string, or object as test")});function vC(t){const i=[];let r=-1;for(;++r<t.length;)i[r]=Pu(t[r]);return Vu(o);function o(...s){let u=-1;for(;++u<i.length;)if(i[u].apply(this,s))return!0;return!1}}function xC(t){const i=t;return Vu(r);function r(o){const s=o;let u;for(u in t)if(s[u]!==i[u])return!1;return!0}}function wC(t){return Vu(i);function i(r){return r&&r.type===t}}function Vu(t){return i;function i(r,o,s){return!!(kC(r)&&t.call(this,r,typeof o=="number"?o:void 0,s||void 0))}}function SC(){return!0}function kC(t){return t!==null&&typeof t=="object"&&"type"in t}const Nw=[],AC=!0,Oh=!1,TC="skip";function Dw(t,i,r,o){let s;typeof i=="function"&&typeof r!="function"?(o=r,r=i):s=i;const u=Pu(s),c=o?-1:1;f(t,void 0,[])();function f(p,m,y){const g=p&&typeof p=="object"?p:{};if(typeof g.type=="string"){const b=typeof g.tagName=="string"?g.tagName:typeof g.name=="string"?g.name:void 0;Object.defineProperty(x,"name",{value:"node ("+(p.type+(b?"<"+b+">":""))+")"})}return x;function x(){let b=Nw,w,E,A;if((!i||u(p,m,y[y.length-1]||void 0))&&(b=EC(r(p,y)),b[0]===Oh))return b;if("children"in p&&p.children){const k=p;if(k.children&&b[0]!==TC)for(E=(o?k.children.length:-1)+c,A=y.concat(k);E>-1&&E<k.children.length;){const T=k.children[E];if(w=f(T,E,A)(),w[0]===Oh)return w;E=typeof w[1]=="number"?w[1]:E+c}}return b}}}function EC(t){return Array.isArray(t)?t:typeof t=="number"?[AC,t]:t==null?Nw:[t]}function CC(){return{canContainEols:["textDirective"],enter:{directiveContainer:RC,directiveContainerAttributes:Vf,directiveContainerLabel:DC,directiveLeaf:MC,directiveLeafAttributes:Vf,directiveText:NC,directiveTextAttributes:Vf},exit:{directiveContainer:Zf,directiveContainerAttributeClassValue:$f,directiveContainerAttributeIdValue:Gf,directiveContainerAttributeName:Jf,directiveContainerAttributeValue:Yf,directiveContainerAttributes:Xf,directiveContainerLabel:OC,directiveContainerName:Pf,directiveLeaf:Zf,directiveLeafAttributeClassValue:$f,directiveLeafAttributeIdValue:Gf,directiveLeafAttributeName:Jf,directiveLeafAttributeValue:Yf,directiveLeafAttributes:Xf,directiveLeafName:Pf,directiveText:Zf,directiveTextAttributeClassValue:$f,directiveTextAttributeIdValue:Gf,directiveTextAttributeName:Jf,directiveTextAttributeValue:Yf,directiveTextAttributes:Xf,directiveTextName:Pf}}}function RC(t){rm.call(this,"containerDirective",t)}function MC(t){rm.call(this,"leafDirective",t)}function NC(t){rm.call(this,"textDirective",t)}function rm(t,i){this.enter({type:t,name:"",attributes:{},children:[]},i)}function Pf(t){const i=this.stack[this.stack.length-1];i.type==="containerDirective"||i.type==="leafDirective"||i.type,i.name=this.sliceSerialize(t)}function DC(t){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},t)}function OC(t){this.exit(t)}function Vf(){this.data.directiveAttributes=[],this.buffer()}function Gf(t){this.data.directiveAttributes.push(["id",Fu(this.sliceSerialize(t),{attribute:!0})])}function $f(t){this.data.directiveAttributes.push(["class",Fu(this.sliceSerialize(t),{attribute:!0})])}function Yf(t){const i=this.data.directiveAttributes;i[i.length-1][1]=Fu(this.sliceSerialize(t),{attribute:!0})}function Jf(t){this.data.directiveAttributes.push([this.sliceSerialize(t),""])}function Xf(){const t=this.data.directiveAttributes,i={};let r=-1;for(;++r<t.length;){const s=t[r];s[0]==="class"&&i.class?i.class+=" "+s[1]:i[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const o=this.stack[this.stack.length-1];o.type==="containerDirective"||o.type==="leafDirective"||o.type,o.attributes=i}function Zf(t){this.exit(t)}function er(t,i,r){i(t,r);for(const o of t.children??[])er(o,i,t)}function om(t){return t.type==="image"?String(t.alt??""):t.value??t.children?.map(om).join("")??""}function ut(t){return{start:t.position?.start.offset??0,end:t.position?.end.offset??0}}function Jt(t,i){return t.start<i.end&&i.start<t.end}function Ow(t){const i=[0];for(let r=0;r<t.length;r++)t[r]==="\r"?(t[r+1]===`
`&&r++,i.push(r+1)):t[r]===`
`&&i.push(r+1);return i}function ol(t,i){let r=0,o=i.length;for(;r+1<o;){const s=r+o>>>1;i[s]<=t?r=s:o=s}return{offset:t,line:r+1,column:t-i[r]+1}}function jC(t){return t.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu,"").replace(/[\s_]+/g,"-").replace(/^-+|-+$/g,"")||"section"}function hn(t,i=!1){if(typeof t!="string")return;const r=t.trim().replace(/[\u0000-\u0020\u007f]/g,"");if(/^(?:https?:|mailto:|tel:)/i.test(r)||!/^[a-z][a-z\d+.-]*:/i.test(r)||i&&/^data:image\/(?:png|gif|jpe?g|webp|avif);base64,/i.test(r))return t}function LC(t){const i=new Set,r=new Set,o=new Set;for(const s of t){if(i.has(s.name))throw new Error(`Duplicate LiMR extension: ${s.name}. Use replaceExtension() to replace it explicitly.`);i.add(s.name);for(const[u,c,f]of[[s.tags,r,"tag"],[s.directives,o,"directive"]])for(const p of u??[]){if(c.has(p))throw new Error(`Duplicate LiMR ${f}: ${p}`);c.add(p)}}}function Vv(t){LC(t);const i=new Map(t.flatMap(f=>(f.tags??[]).map(p=>[p,f]))),r=new Map(t.flatMap(f=>(f.directives??[]).map(p=>[p,f]))),o=t.flatMap(f=>[...f.micromark??[]]),s=t.flatMap(f=>[...f.mdast??[]]);r.size&&(o.push(bC()),s.push(CC()));const u=i.size?[...o,{disable:{null:["htmlFlow","htmlText"]}},VE()]:o,c=i.size?[...s,QE()]:s;return(f,p,m,y,g="")=>{const x=g?`${g}

limr-definition-boundary

`:"",b=x+f,w=[];let E;const A=C=>ol(C,y.length?y:E??=Ow(m.source));let k,T;try{T=xu(b,{extensions:u,mdastExtensions:c})}catch(C){T=xu(b,{extensions:o,mdastExtensions:s}),k=p,w.push({message:C instanceof Error?C.message:String(C),offset:p})}T.children=T.children?.filter(C=>(C.position?.start.offset??0)>=x.length),(p||x.length||i.size||r.size)&&er(T,C=>{if(C.position&&(p||x.length)){const D=Math.max(0,C.position.start.offset-x.length+p),z=Math.max(D,C.position.end.offset-x.length+p);C.position={start:ol(D,y),end:ol(z,y)}}if(C.type==="mdxJsxFlowElement"||C.type==="mdxJsxTextElement"){const D=i.get(C.name??""),z=C.attributes,j={},L={};for(const I of z??[])if(I.type==="mdxJsxAttribute"&&(typeof I.value=="string"||I.value===null)){if(j[I.name]=I.value??!0,D&&typeof I.value=="string"&&I.position){const q=I.position.start.offset-x.length+p,H=I.position.end.offset-x.length+p,Z=m.source.slice(q,H),oe=Z.search(/["']/);oe>=0&&(L[I.name]={type:"text",value:I.value,verbatimEscapes:!0,position:{start:A(q+oe+1),end:A(H-1)}})}}else w.push({message:"JSX expressions are not executed. Use string attributes or pass data from React.",offset:C.position?.start.offset});C.inline=D?.display==="block"?!1:D?.display==="inline"?!0:C.type==="mdxJsxTextElement",C.type=D?"component":"html",C.attributes=j,Object.keys(L).length&&(C.attributeNodes=L),C.selection=D?.selection??"content",!D&&C.position&&(C.value=m.source.slice(C.position.start.offset,C.position.end.offset),C.children=void 0)}else if(C.type==="containerDirective"||C.type==="leafDirective"||C.type==="textDirective"){const D=r.get(C.name??"");if(D){const z=C.position?.start.offset??0,j=m.source.indexOf(`
`,z),L=m.source.slice(z,j<0?m.source.length:j),I=L.indexOf("{");if(I>=0){const q={},H=/([^\s{}=]+)\s*=\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s}]+))/g,Z=L.slice(I+1);for(const oe of Z.matchAll(H)){const ue=oe[1],$=C.attributes?.[ue];if(typeof $!="string")continue;const N=oe[2]!==void 0||oe[3]!==void 0,P=(oe[2]??oe[3]??oe[4]).length,K=z+I+1+oe.index+oe[0].length-(N?1:0);q[ue]={type:"text",value:$,position:{start:A(K-P),end:A(K)}}}Object.keys(q).length&&(C.attributeNodes=q)}C.inline=C.type==="textDirective",C.type="component",C.selection=D.selection??"content"}}}),(p||x.length)&&(T.position={start:ol(p,y),end:ol(p+f.length,y)});for(const C of t)try{C.transform?.(T,m)}catch(D){w.push({message:D instanceof Error?D.message:String(D),extension:C.name})}return{nodes:T.children??[],diagnostics:w,recoveryOffset:k}}}let zC=0;class _C{id;extensions;parse;snapshot;nextBlock=0;listeners=new Set;definitionSignature="";recoveryOffset;constructor(i="",r={}){this.id=r.id??`limr-${++zC}`,this.extensions=r.extensions??[],this.parse=Vv(this.extensions),this.update(i,{streaming:r.streaming})}getSnapshot=()=>this.snapshot;subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));setExtensions(i){if(i===this.extensions)return;this.parse=Vv(i),this.extensions=i;const r=this.snapshot;this.update(r.source,{streaming:r.streaming},!0)}append(i){return this.update(this.snapshot.source+i,{streaming:!0})}finish(){return this.update(this.snapshot.source,{streaming:!1})}update(i,r={},o=!1){const s=this.snapshot,u=r.streaming??!1;if(!o&&s?.source===i&&s.streaming===u)return s;const c=this.extensions.some(N=>N.transform&&N.scope!=="local"),f=!o&&s?.streaming&&i.startsWith(s.source)&&!c,p=!!s?.streaming&&!u;let m=f&&u&&s.blocks.length?s.blocks[s.blocks.length-1].range.start:0;const y=this.recoveryOffset!==void 0;f&&y&&(m=Math.min(m,this.recoveryOffset));let g=o||c?"extension":s?p?"finalize":f?"append":"replace":"initial";const x=m?Ow(i):[],b={source:i,streaming:u,documentId:this.id};let w=m?s.blocks.filter(N=>N.range.end<=m):[];const E=[];for(const N of w)er(N.node,P=>{if(P.type==="definition"||P.type==="footnoteDefinition"){const K=ut(P);E.push(i.slice(K.start,K.end))}});let A=this.parse(i.slice(m),m,b,x,E.join(`

`));const k=N=>{const P=[];for(const K of N)er(K,J=>{if(J.type==="definition"||J.type==="footnoteDefinition"){const be=ut(J);P.push(i.slice(be.start,be.end))}});return P.join("\0")};let T=k([...w.map(N=>N.node),...A.nodes]),C=i.length-m+E.join(`

`).length;const D=!!s&&T!==this.definitionSignature;m&&D&&(g="definitions",m=0,w=[],A=this.parse(i,0,b,x),T=k(A.nodes),C+=i.length),this.definitionSignature=T,this.recoveryOffset=A.recoveryOffset;const z=new Map(s?.blocks.map(N=>[N.range.start,N]));let j=w.length;const L=[...w];for(let N=0;N<A.nodes.length;N++){const P=A.nodes[N],K=ut(P),J=z.get(K.start),be=u&&N===A.nodes.length-1;!D&&!y&&g==="append"&&J&&J.node.type===P.type&&J.pending===be&&s.source.slice(J.range.start,J.range.end)===i.slice(K.start,K.end)?(L.push(J),j++):L.push({id:J?.id??`${this.id}-b${++this.nextBlock}`,node:P,range:K,pending:be})}const I=[],q=new Map,H=new Map,Z=[],oe=new Map,ue=[],$=new Map;for(const N of L)er(N.node,P=>{if(P.type==="heading"){const K=om(P),J=jC(K),be=$.get(J)??0;$.set(J,be+1),I.push({id:`${this.id}-${J}${be?`-${be}`:""}`,text:K,level:Number(P.depth),range:ut(P),blockId:N.id})}if(P.type==="definition"&&!q.has(String(P.identifier))&&q.set(String(P.identifier),P),P.type==="footnoteDefinition"&&!H.has(String(P.identifier))&&H.set(String(P.identifier),P),P.type==="footnoteReference"&&!Z.includes(String(P.identifier))&&Z.push(String(P.identifier)),P.type==="annotationDefinition"){const K=P.annotation;oe.set(K.id,K)}if(P.type==="annotationReference"){const K=ut(P);ue.push({id:`${this.id}-ref-${K.start}`,range:K,annotationIds:P.annotationIds,embedded:!0})}});this.snapshot={id:this.id,revision:(s?.revision??-1)+1,source:i,streaming:u,blocks:L,headings:s&&I.length===s.headings.length&&I.every((N,P)=>{const K=s.headings[P];return N.id===K.id&&N.text===K.text&&N.level===K.level&&N.blockId===K.blockId&&N.range.start===K.range.start&&N.range.end===K.range.end})?s.headings:I,definitions:q,footnotes:H,footnoteOrder:Z,annotations:[...oe.values()],occurrences:ue,diagnostics:A.diagnostics,metrics:{parsedCharacters:C,reusedBlocks:j,parsedBlocks:A.nodes.length,fullParse:m===0,reason:g}};for(const N of this.listeners)N();return this.snapshot}}function IC(t="",i={}){return new _C(t,i)}function lm(t,i,r,o={}){const s=t.slice(r.start,r.end),u=[],c=[];let f=0,p=!0;for(let m=0;m<s.length&&f<i.length;){let y=1,g=s[m];if(o.escapes!==!1&&s[m]==="\\"&&/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(s[m+1]??""))y=2,g=s[m+1];else if(s[m]==="&"){const x=/^&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/i.exec(s.slice(m));if(x){const b=Aw(x[0]);b!==x[0]&&(y=x[0].length,g=b)}}else s[m]==="\r"&&(y=s[m+1]===`
`?2:1,g=`
`);if(i.startsWith(g,f)){for(let x=0;x<g.length;x++)u.push(r.start+m),c.push(r.start+m+y);f+=g.length}else/[\s>]/.test(g)||(p=!1);m+=y}for(f!==i.length&&(p=!1);u.length<i.length;)u.push(r.start),c.push(r.end);return{starts:u,ends:c,exact:p}}function Gu(t,i,r={}){const o={start:Math.max(0,i.start),end:Math.min(t.source.length,i.end)},s={...o},u=new Set(["strong","emphasis","delete","link","linkReference","heading","listItem","blockquote"]),c=t.source,f=(A,k)=>!c.slice(A,k).trim();function p(A){const k=ut(A);if(!Jt(k,s)||k.start>=s.start&&k.end<=s.end)return;A.children?.forEach(p);let T;if(u.has(A.type)&&A.children?.length)T={start:ut(A.children[0]).start,end:ut(A.children.at(-1)).end};else if(A.type==="inlineCode"||A.type==="inlineMath"){const C=(A.type==="inlineCode"?/^`+/:/^\$+/).exec(c.slice(k.start,k.end))?.[0].length??0;T={start:k.start+C,end:k.end-C}}else if(A.type==="code"||A.type==="math"){const C=c.slice(k.start,k.end),D=/^[ \t]*(`{3,}|~{3,}|\${2,})[^\r\n]*(?:\r\n|\r|\n)/.exec(C);if(D){const z=D[1],j=/(?:\r\n|\r|\n)[ \t]*(`+|~+|\$+)[ \t]*$/.exec(C),L=j&&j[1][0]===z[0]&&j[1].length>=z.length;T={start:k.start+D[0].length,end:L?k.start+j.index:k.end}}}if(T&&(s.start>k.start&&s.start<k.end&&(s.start<=T.start||f(T.start,s.start))&&(s.start=k.start),s.end<k.end&&s.end>k.start&&(s.end>=T.end||f(s.end,T.end))&&(s.end=k.end)),A.type==="blockquote"){const C=Math.max(k.start,c.lastIndexOf(`
`,s.start-1)+1);/^[ \t]*(?:>[ \t]*)+$/.test(c.slice(C,s.start))&&(s.start=C)}}let m=0,y=t.blocks.length;for(;m<y;){const A=m+y>>>1;t.blocks[A].range.end<=o.start?m=A+1:y=A}const g=[];for(let A=m;A<t.blocks.length&&t.blocks[A].range.start<o.end;A++){const k=t.blocks[A];g.push(k),p(k.node)}const x=[],b=new Set(["paragraph","heading","code","math","table","listItem","thematicBreak","html"]);function w(A){const k=ut(A);if(Jt(k,o)){if(b.has(A.type)||A.type==="component"&&!A.inline){x.push(k);return}A.children?.forEach(w)}}g.forEach(A=>w(A.node));const E=A=>({ranges:A,sourceText:A.map(k=>t.source.slice(k.start,k.end)).join(`

`)});return{documentId:t.id,revision:t.revision,text:r.text??t.source.slice(o.start,o.end),quality:r.quality??"exact",settled:r.settled??!0,raw:E([o]),syntax:E([s]),blocks:E(x.length?x:[o])}}class HC{constructor(i=128){if(this.capacity=i,i<1)throw new Error("Cache capacity must be positive")}capacity;entries=new Map;get size(){return this.entries.size}get(i){if(!this.entries.has(i))return;const r=this.entries.get(i);return this.entries.delete(i),this.entries.set(i,r),r}set(i,r){for(this.entries.delete(i),this.entries.set(i,r);this.entries.size>this.capacity;)this.entries.delete(this.entries.keys().next().value)}delete(i){this.entries.delete(i)}clear(){this.entries.clear()}}class jw{values;pending=new Map;constructor(i=128){this.values=new HC(i)}acquire(i,r){const o=this.values.get(i);if(o!==void 0)return{promise:Promise.resolve(o),release(){}};let s=this.pending.get(i);if(!s){const c=new AbortController;s={promise:Promise.resolve().then(()=>r(c.signal)).then(p=>(c.signal.aborted||this.values.set(i,p),p)).finally(()=>{this.pending.get(i)?.controller===c&&this.pending.delete(i)}),controller:c,consumers:0},this.pending.set(i,s)}s.consumers++;let u=!1;return{promise:s.promise,release:()=>{u||(u=!0,--s.consumers===0&&queueMicrotask(()=>{s.consumers===0&&this.pending.get(i)===s&&(this.pending.delete(i),s.controller.abort())}))}}}invalidate(i){if(i!==void 0)this.values.delete(i),this.pending.get(i)?.controller.abort(),this.pending.delete(i);else{this.values.clear();for(const r of this.pending.values())r.controller.abort();this.pending.clear()}}}const gl={color:"#F2C744",style:"background"},pi=(t,i)=>t.start===i.start&&t.end===i.end;function Lw(t,i){if(!i.embedded)return i.range;let r=i.range;const o=s=>{const u=ut(s);Jt(u,i.range)&&(["paragraph","heading","listItem","tableCell"].includes(s.type)&&(r=u),s.children?.forEach(o))};for(const s of t.blocks)Jt(s.range,i.range)&&o(s.node);return r}function dl(t,i){return(t.anchors??(t.range?[{range:t.range}]:[])).flatMap(r=>{if(r.documentId&&r.documentId!==i.id)return[];let o=r.range;if(r.quote&&i.source.slice(o.start,o.end)!==r.quote){const s=i.source.indexOf(r.quote);if(s<0||i.source.indexOf(r.quote,s+1)>=0)return[];o={start:s,end:s+r.quote.length}}else if(r.revision!==void 0&&r.revision!==i.revision&&!r.quote)return[];return o.start>=0&&o.end<=i.source.length&&o.start<=o.end?[{...r,range:o}]:[]})}const Qf=new WeakMap;function zw(t,i){Qf.get(t)?.();const r=t instanceof Window?t.document.documentElement:t,o=t instanceof Window?t.scrollY:t.scrollTop,s=Math.max(0,Math.min(i,r.scrollHeight-(t instanceof Window?t.innerHeight:t.clientHeight)));if(matchMedia("(prefers-reduced-motion: reduce)").matches){t.scrollTo({top:s,behavior:"instant"});return}const u=Math.min(560,220+Math.abs(s-o)*.15);let c=0,f=0;const p=g=>{["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," "].includes(g.key)&&m()},m=()=>{cancelAnimationFrame(c),t.removeEventListener("wheel",m),t.removeEventListener("touchstart",m),t.removeEventListener("pointerdown",m),t.removeEventListener("keydown",p),Qf.delete(t)},y=g=>{f||=g;const x=Math.min(1,(g-f)/u);t.scrollTo({top:o+(s-o)*(1-Math.pow(1-x,4)),behavior:"instant"}),x<1?c=requestAnimationFrame(y):m()};Qf.set(t,m),t.addEventListener("wheel",m,{passive:!0}),t.addEventListener("touchstart",m,{passive:!0}),t.addEventListener("pointerdown",m,{passive:!0}),t.addEventListener("keydown",p),c=requestAnimationFrame(y)}const wu={language:"en",citation:"Citation",contents:"Contents",annotations:"Annotations",expand:"Expand",collapse:"Collapse",close:"Close",copy:"Copy",copied:"Copied",copyFailed:"Copy failed",copyImage:"Copy image URL",copyFigures:"Copy figures Markdown",loading:"Loading…",retry:"Retry",unavailable:"Content unavailable",footnotes:"Footnotes",definition:"Definition",question:"Question",note:"Note",extra:"Extended reading",hint:"Hint",answer:"Answer",submit:"Submit",correct:"Correct",incorrect:"Try again",play:"Play video",highlight:"Highlight",addHighlight:"Add highlight",editHighlight:"Edit highlight",highlightColor:"Color",highlightStyle:"Style",highlightBackground:"Background",highlightUnderline:"Underline",highlightDotted:"Dotted",highlightWavy:"Wavy",hideHighlight:"Hide highlight",showHighlight:"Show highlight",deleteAnnotations:"Delete",deleteAnnotationsHint:"Deletes {count} annotations on this text and any highlight."},Qn={language:"zh-CN",citation:"引用",contents:"目录",annotations:"注释",expand:"展开",collapse:"收起",close:"关闭",copy:"复制",copied:"已复制",copyFailed:"复制失败",copyImage:"复制图片 URL",copyFigures:"复制图组 Markdown",loading:"加载中…",retry:"重试",unavailable:"暂无内容",footnotes:"脚注",definition:"释义",question:"提问",note:"注释",extra:"拓展阅读",hint:"提示",answer:"答案",submit:"提交",correct:"回答正确",incorrect:"再试一次",play:"播放视频",highlight:"高亮",addHighlight:"添加高亮",editHighlight:"调整高亮",highlightColor:"颜色",highlightStyle:"样式",highlightBackground:"底色",highlightUnderline:"下划线",highlightDotted:"点线",highlightWavy:"波浪线",hideHighlight:"隐藏高亮",showHighlight:"显示高亮",deleteAnnotations:"删除",deleteAnnotationsHint:"将删除这段文字关联的 {count} 个注释及高亮。"};class Ya{constructor(i){this.value=i}value;listeners=new Set;get=()=>this.value;subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));set(i){if(!Object.is(this.value,i)){this.value=i;for(const r of this.listeners)r()}}}const jh=Object.freeze([]),sm=Object.freeze({occurrences:jh,highlights:jh});class BC{document;interaction=new Ya({selection:null,activeHeading:null,hovered:null,active:null,editing:null,activeHighlight:null,hoveredHighlight:null});layout=new Ya(0);viewport=new Ya(0);documentOffset=new Ya(0);decorations=new Ya({annotations:new Map,highlights:new Map,occurrences:[],referenceRanges:new Map,byBlock:new Map});configuration;resources=new jw(128);resourceVersions=new Ya(new Map);resourceKeys=new Map;nextResource=0;anchors=new Map;blocks=new Map;headings=new Map;bindings=new WeakMap;textBinders=new WeakMap;components={};annotationTypes=new Map;resolvedTypes=new WeakMap;locale=wu;content=null;selectionRange=null;highlightReference=null;layoutFrame=0;observer=null;headingPositions=[];localAnnotations=[];pendingOpen=null;pendingAnnotations;taskController=new AbortController;get signal(){return this.taskController.signal}commands={addAnnotation:(i,r={})=>{this.changeAnnotations(o=>{const s=[...o.filter(u=>u.id!==i.id),i];if(i.type!=="highlight"&&r.highlight!==!1&&(r.highlight!==void 0||this.annotationTypes.get(i.type)?.highlight!=="hover")){const u=this.document.getSnapshot();for(const c of dl(i,u))c.range.start===c.range.end||s.some(f=>f.type==="highlight"&&dl(f,u).some(p=>pi(p.range,c.range)))||s.push({id:`highlight-${crypto.randomUUID()}`,type:"highlight",anchors:[{...c,id:void 0}],data:{...gl,...r.highlight}})}return s}),r.edit&&this.commands.editAnnotation(i.id)},updateAnnotation:(i,r)=>this.changeAnnotations(o=>o.map(s=>s.id===i?{...s,...r,id:i}:s)),removeAnnotation:i=>this.changeAnnotations(r=>r.filter(o=>o.id!==i)),removeAnnotationsAt:i=>this.changeAnnotations(r=>r.flatMap(o=>{const s=o.anchors??(o.range?[{range:o.range}]:[]),u=s.filter(c=>!dl({...o,range:void 0,anchors:[c]},this.document.getSnapshot()).some(f=>i.some(p=>pi(p,f.range))));return u.length===s.length?[o]:u.length?[{...o,range:void 0,anchors:u}]:[]})),editAnnotation:i=>{this.updateInteraction({editing:i}),i&&this.commands.activateAnnotation(i)},activateAnnotation:i=>{const r=this.decorations.get().occurrences.find(o=>o.id===i||o.annotationIds.includes(i??""));this.pendingOpen=i&&!r?i:null,this.activate(r?.id??null)}};changeAnnotations(i){const r=this.configuration.get(),o=this.pendingAnnotations&&this.pendingAnnotations.input===r.annotations?this.pendingAnnotations.value:r.annotations??this.localAnnotations,s=i(o);if(r.annotations!==void 0&&!r.onAnnotationsChange)throw new Error("Controlled annotations require onAnnotationsChange to accept edits.");r.annotations===void 0?(this.localAnnotations=s,this.rebuildDecorations()):this.pendingAnnotations={input:r.annotations,value:s},r.onAnnotationsChange?.(s)}start(){this.taskController.signal.aborted&&(this.taskController=new AbortController)}dispose(){this.taskController.abort(),this.resources.invalidate(),this.resourceKeys.clear()}getResourceKey(i){const r=this.resourceKeys.get(i.id);if(r?.annotation===i)return r.key;r&&this.resources.invalidate(r.key);const o=`${i.id}:${++this.nextResource}`;return this.resourceKeys.set(i.id,{annotation:i,key:o}),o}invalidateAnnotation(i){const r=this.resourceKeys.get(i);r&&this.resources.invalidate(r.key);const o=new Map(this.resourceVersions.get());o.set(i,(o.get(i)??0)+1),this.resourceVersions.set(o)}constructor(i,r,o,s){this.configuration=new Ya(s),this.installConfiguration(s),this.document=IC(r,{id:i,streaming:o,extensions:s.extensions}),this.rebuildDecorations(),this.document.subscribe(()=>{this.rebuildDecorations();const u=this.interaction.get().selection;if(u&&u.raw.ranges.length===1){const c=this.document.getSnapshot(),f=u.raw.ranges[0];this.updateInteraction({selection:c.source.slice(f.start,f.end)===u.raw.sourceText?Gu(c,f,{text:u.text,quality:u.quality,settled:u.settled}):null})}this.requestLayout(),this.configuration.get().onDocumentChange?.(this.document.getSnapshot())})}installConfiguration(i){this.locale={...wu,...i.locale},this.components=Object.assign({},...(i.extensions??[]).map(o=>o.components),i.components);const r=[...(i.extensions??[]).flatMap(o=>[...o.annotationTypes??[]]),...i.annotationTypes??[]];this.annotationTypes=new Map(r.map(o=>{if(typeof o.label=="string")return[o.type,o];const s=o.label(this.locale),u=this.resolvedTypes.get(o),c=u?.label===s?u:{...o,label:s};return this.resolvedTypes.set(o,c),[o.type,c]}))}configure(i){const r=this.configuration.get();this.pendingAnnotations?.input!==i.annotations&&(this.pendingAnnotations=void 0),this.installConfiguration(i),this.configuration.set(i),r.extensions!==i.extensions?this.document.setExtensions(i.extensions??[]):(r.annotations!==i.annotations||r.annotationTypes!==i.annotationTypes)&&this.rebuildDecorations(),(r.annotationTypes!==i.annotationTypes||r.extensions!==i.extensions)&&this.resources.invalidate()}updateInteraction(i){const r=this.interaction.get();Object.keys(i).every(o=>Object.is(r[o],i[o]))||(this.interaction.set({...r,...i}),"selection"in i&&this.configuration.get().onSelectionChange?.(i.selection??null))}hover(i,r="marker"){this.updateInteraction({hovered:i,hoverSource:i?r:null}),this.configuration.get().onAnnotationHover?.(this.decorations.get().occurrences.find(o=>o.id===i)??null)}activate(i,r="marker"){this.updateInteraction({active:i,activeSource:i?r:null,hovered:null,hoverSource:null});const o=this.decorations.get().occurrences.find(s=>s.id===i);o&&this.configuration.get().onAnnotationClick?.(o)}hoverHighlight(i){this.interaction.get().hoveredHighlight!==i&&(this.updateInteraction({hoveredHighlight:i}),this.configuration.get().onHighlightHover?.(i?this.decorations.get().annotations.get(this.decorations.get().highlights.get(i)?.annotationId??"")??null:null))}activateHighlight(i){this.updateInteraction({activeHighlight:i,selection:null});const r=i&&this.decorations.get().highlights.get(i);r?this.configuration.get().onHighlightClick?.(this.decorations.get().annotations.get(r.annotationId)):this.highlightReference=null}clearSelection(){this.selectionRange=null;const i=typeof window>"u"?null:window.getSelection();i?.anchorNode&&this.content?.contains(i.anchorNode)&&i.removeAllRanges(),this.highlightReference=null,this.updateInteraction({selection:null,activeHighlight:null})}prepareTextBindings(i){const r=i.closest("[data-limr-block]"),o=r&&this.textBinders.get(r);o&&(this.textBinders.delete(r),o())}rebuildDecorations(){const i=this.document.getSnapshot(),r=this.configuration.get(),o=this.decorations.get(),s=new Map(i.annotations.map(b=>[b.id,b]));for(const b of r.annotations??this.localAnnotations)s.set(b.id,b);for(const[b,w]of this.resourceKeys)s.has(b)||(this.resources.invalidate(w.key),this.resourceKeys.delete(b));const u=this.resourceVersions.get();[...u.keys()].some(b=>!s.has(b))&&this.resourceVersions.set(new Map([...u].filter(([b])=>s.has(b))));const c=[...i.occurrences],f=[];for(const b of r.annotations??this.localAnnotations)dl(b,i).forEach((w,E)=>{if(b.type==="highlight"){const A=E?`${b.id}:${E}`:b.id,k={...b.data,id:A,annotationId:b.id,range:w.range},T=o.highlights.get(A);f.push(T&&!T.occurrenceId&&pi(T.range,k.range)&&T.color===k.color&&T.style===k.style&&T.hidden===k.hidden?T:k)}else c.push({...w,id:w.id??`${i.id}-${b.id}-${E}`,annotationIds:[b.id]})});c.sort((b,w)=>b.range.end-w.range.end||b.id.localeCompare(w.id));const p=new Map(c.map(b=>[b.id,Lw(i,b)]));for(const b of c){const w=s.get(b.annotationIds[0]),E=w&&this.annotationTypes.get(w.type);if(!w||E?.highlight!=="hover")continue;const A=p.get(b.id);if(A.start===A.end)continue;const k=`reference-${b.id}`,T={id:k,annotationId:w.id,occurrenceId:b.id,range:A,color:E.color??gl.color,style:"background"},C=o.highlights.get(k);f.push(C&&C.occurrenceId===T.occurrenceId&&C.annotationId===T.annotationId&&pi(C.range,A)&&C.color===T.color?C:T)}const m=new Map;for(const b of c.length||f.length?i.blocks:[]){const w=c.filter(z=>!z.embedded&&z.range.end>b.range.start&&z.range.end<=b.range.end),E=o.byBlock.get(b.id)??sm,A=E.occurrences,k=A&&A.length===w.length&&A.every((z,j)=>z.id===w[j].id&&z.range.start===w[j].range.start&&z.range.end===w[j].range.end&&z.annotationIds.join("\0")===w[j].annotationIds.join("\0")),T=f.filter(z=>Jt(z.range,b.range)),C=E.highlights,D=C.length===T.length&&C.every((z,j)=>z===T[j]);(w.length||T.length)&&m.set(b.id,k&&D?E:{occurrences:k?A:w,highlights:D?C:T})}const y=m.size===o.byBlock.size&&[...m].every(([b,w])=>o.byBlock.get(b)===w),g=new Map(f.map(b=>[b.id,b]));this.decorations.set({annotations:s,highlights:g,occurrences:c,referenceRanges:p,byBlock:y?o.byBlock:m});const x=this.interaction.get();if(x.editing&&!s.has(x.editing)&&this.pendingOpen!==x.editing&&this.updateInteraction({editing:null}),x.activeHighlight&&!g.has(x.activeHighlight)&&this.activateHighlight(null),x.hoveredHighlight&&!g.has(x.hoveredHighlight)&&this.hoverHighlight(null),x.active&&!c.some(b=>b.id===x.active)&&this.activate(null),x.hovered&&!c.some(b=>b.id===x.hovered)&&this.hover(null),this.pendingOpen){const b=c.find(w=>w.id===this.pendingOpen||w.annotationIds.includes(this.pendingOpen));b&&(this.pendingOpen=null,this.activate(b.id))}}registerAnchor(i,r){r?this.anchors.set(i,r):this.anchors.delete(i),this.requestLayout()}registerHeading(i,r){r?this.headings.set(i,r):this.headings.delete(i),this.requestLayout()}observeBlock(i){i&&(i.dataset.limrBlock&&this.blocks.set(i.dataset.limrBlock,i),this.observer?.observe(i))}unobserveBlock(i){i.dataset.limrBlock&&this.blocks.delete(i.dataset.limrBlock),this.observer?.unobserve(i)}getScrollTop(){return this.configuration.get().scrollRoot?.scrollTop??(typeof window<"u"?window.scrollY:0)}getViewportTop(){return this.configuration.get().scrollRoot?.getBoundingClientRect().top??0}getContentOffset(){const i=this.content&&getComputedStyle(this.content).translate;return i&&parseFloat(i.split(" ")[1]??"0")||0}scrollTo(i,r="smooth"){const o=this.configuration.get().scrollRoot??window;r==="smooth"?zw(o,i):o.scrollTo({top:Math.max(0,i),behavior:r})}scrollToHeading(i){const r=this.headings.get(i);r&&this.scrollTo(r.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24))}scrollToOccurrence(i){const r=this.anchors.get(i);r&&this.scrollTo(r.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24))}followFragment=i=>{if(i.defaultPrevented||i.button!==0||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey)return;const r=i.target instanceof Element?i.target.closest("a[href]"):null;if(!r||r.hasAttribute("download")||r.target&&r.target!=="_self"||!this.content?.contains(r))return;const o=new URL(r.href,document.baseURI);if(!o.hash||o.origin!==location.origin||o.pathname!==location.pathname||o.search!==location.search)return;let s;try{s=decodeURIComponent(o.hash.slice(1))}catch{return}const u=this.content.querySelector(`[id="${CSS.escape(s)}"]`);u&&(i.preventDefault(),this.scrollTo(u.getBoundingClientRect().top-this.getViewportTop()+this.getScrollTop()-(this.configuration.get().scrollOffset??24)),i.detail===0&&(u.hasAttribute("tabindex")||(u.tabIndex=-1,u.addEventListener("blur",()=>u.removeAttribute("tabindex"),{once:!0})),u.focus({preventScroll:!0})))};requestLayout=()=>{typeof window>"u"||!this.content||this.layoutFrame||(this.layoutFrame=window.requestAnimationFrame(()=>{this.layoutFrame=0;const i=this.getScrollTop()-this.getViewportTop();this.headingPositions=[...this.headings].filter(([,o])=>!o.closest("[inert]")).map(([o,s])=>({id:o,top:s.getBoundingClientRect().top+i})).sort((o,s)=>o.top-s.top);const r=this.interaction.get();r.active&&this.anchors.get(r.active)?.closest("[inert]")&&this.activate(null),r.hovered&&this.anchors.get(r.hovered)?.closest("[inert]")&&this.hover(null),this.layout.set(this.layout.get()+1),this.trackHeading()}))};trackHeading=()=>{const i=this.headingPositions,r=this.getScrollTop()+(this.configuration.get().scrollOffset??24)+2;let o=0,s=i.length;for(;o<s;){const p=o+s>>>1;i[p].top<=r?o=p+1:s=p}const u=this.configuration.get().scrollRoot,c=(u?.scrollHeight??document.documentElement.scrollHeight)-(u?.clientHeight??window.innerHeight),f=c>0&&this.getScrollTop()>=c-2;this.updateInteraction({activeHeading:i[f?i.length-1:Math.max(0,o-1)]?.id??null})};mountContent(i){this.content=i,this.observer=new ResizeObserver(this.requestLayout),this.observer.observe(i),i.querySelectorAll("[data-limr-block]").forEach(u=>this.observer.observe(u));let r=0;const o=()=>{r||(r=requestAnimationFrame(()=>{r=0,this.trackHeading(),this.viewport.set(this.viewport.get()+1)}))},s=this.configuration.get().scrollRoot??window;return s.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",this.requestLayout),document.fonts?.addEventListener("loadingdone",this.requestLayout),i.addEventListener("load",this.requestLayout,!0),i.addEventListener("click",this.followFragment),this.requestLayout(),()=>{this.content=null,this.observer?.disconnect(),this.observer=null,cancelAnimationFrame(r),cancelAnimationFrame(this.layoutFrame),this.layoutFrame=0,s.removeEventListener("scroll",o),window.removeEventListener("resize",this.requestLayout),document.fonts?.removeEventListener("loadingdone",this.requestLayout),i.removeEventListener("load",this.requestLayout,!0),i.removeEventListener("click",this.followFragment)}}}const _w=jh,qC={tokenize:$C,partial:!0},Iw={tokenize:YC,partial:!0},Hw={tokenize:JC,partial:!0},Bw={tokenize:XC,partial:!0},UC={tokenize:ZC,partial:!0},qw={name:"wwwAutolink",tokenize:VC,previous:Fw},Uw={name:"protocolAutolink",tokenize:GC,previous:Pw},Bi={name:"emailAutolink",tokenize:PC,previous:Vw},gi={};function FC(){return{text:gi}}let Ja=48;for(;Ja<123;)gi[Ja]=Bi,Ja++,Ja===58?Ja=65:Ja===91&&(Ja=97);gi[43]=Bi;gi[45]=Bi;gi[46]=Bi;gi[95]=Bi;gi[72]=[Bi,Uw];gi[104]=[Bi,Uw];gi[87]=[Bi,qw];gi[119]=[Bi,qw];function PC(t,i,r){const o=this;let s,u;return c;function c(g){return!Lh(g)||!Vw.call(o,o.previous)||um(o.events)?r(g):(t.enter("literalAutolink"),t.enter("literalAutolinkEmail"),f(g))}function f(g){return Lh(g)?(t.consume(g),f):g===64?(t.consume(g),p):r(g)}function p(g){return g===46?t.check(UC,y,m)(g):g===45||g===95||Qt(g)?(u=!0,t.consume(g),p):y(g)}function m(g){return t.consume(g),s=!0,p}function y(g){return u&&s&&an(o.previous)?(t.exit("literalAutolinkEmail"),t.exit("literalAutolink"),i(g)):r(g)}}function VC(t,i,r){const o=this;return s;function s(c){return c!==87&&c!==119||!Fw.call(o,o.previous)||um(o.events)?r(c):(t.enter("literalAutolink"),t.enter("literalAutolinkWww"),t.check(qC,t.attempt(Iw,t.attempt(Hw,u),r),r)(c))}function u(c){return t.exit("literalAutolinkWww"),t.exit("literalAutolink"),i(c)}}function GC(t,i,r){const o=this;let s="",u=!1;return c;function c(g){return(g===72||g===104)&&Pw.call(o,o.previous)&&!um(o.events)?(t.enter("literalAutolink"),t.enter("literalAutolinkHttp"),s+=String.fromCodePoint(g),t.consume(g),f):r(g)}function f(g){if(an(g)&&s.length<5)return s+=String.fromCodePoint(g),t.consume(g),f;if(g===58){const x=s.toLowerCase();if(x==="http"||x==="https")return t.consume(g),p}return r(g)}function p(g){return g===47?(t.consume(g),u?m:(u=!0,p)):r(g)}function m(g){return g===null||yu(g)||Qe(g)||zt(g)||va(g)?r(g):t.attempt(Iw,t.attempt(Hw,y),r)(g)}function y(g){return t.exit("literalAutolinkHttp"),t.exit("literalAutolink"),i(g)}}function $C(t,i,r){let o=0;return s;function s(c){return(c===87||c===119)&&o<3?(o++,t.consume(c),s):c===46&&o===3?(t.consume(c),u):r(c)}function u(c){return c===null?r(c):i(c)}}function YC(t,i,r){let o,s,u;return c;function c(m){return m===46||m===95?t.check(Bw,p,f)(m):m===null||Qe(m)||zt(m)||m!==45&&va(m)?p(m):(u=!0,t.consume(m),c)}function f(m){return m===95?o=!0:(s=o,o=void 0),t.consume(m),c}function p(m){return s||o||!u?r(m):i(m)}}function JC(t,i){let r=0,o=0;return s;function s(c){return c===40?(r++,t.consume(c),s):c===41&&o<r?u(c):c===33||c===34||c===38||c===39||c===41||c===42||c===44||c===46||c===58||c===59||c===60||c===63||c===93||c===95||c===126?t.check(Bw,i,u)(c):c===null||Qe(c)||zt(c)?i(c):(t.consume(c),s)}function u(c){return c===41&&o++,t.consume(c),s}}function XC(t,i,r){return o;function o(f){return f===33||f===34||f===39||f===41||f===42||f===44||f===46||f===58||f===59||f===63||f===95||f===126?(t.consume(f),o):f===38?(t.consume(f),u):f===93?(t.consume(f),s):f===60||f===null||Qe(f)||zt(f)?i(f):r(f)}function s(f){return f===null||f===40||f===91||Qe(f)||zt(f)?i(f):o(f)}function u(f){return an(f)?c(f):r(f)}function c(f){return f===59?(t.consume(f),o):an(f)?(t.consume(f),c):r(f)}}function ZC(t,i,r){return o;function o(u){return t.consume(u),s}function s(u){return Qt(u)?r(u):i(u)}}function Fw(t){return t===null||t===40||t===42||t===95||t===91||t===93||t===126||Qe(t)}function Pw(t){return!an(t)}function Vw(t){return!(t===47||Lh(t))}function Lh(t){return t===43||t===45||t===46||t===95||Qt(t)}function um(t){let i=t.length,r=!1;for(;i--;){const o=t[i][1];if((o.type==="labelLink"||o.type==="labelImage")&&!o._balanced){r=!0;break}if(o._gfmAutolinkLiteralWalkedInto){r=!1;break}}return t.length>0&&!r&&(t[t.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),r}const QC={tokenize:rR,partial:!0};function KC(){return{document:{91:{name:"gfmFootnoteDefinition",tokenize:nR,continuation:{tokenize:iR},exit:aR}},text:{91:{name:"gfmFootnoteCall",tokenize:tR},93:{name:"gfmPotentialFootnoteCall",add:"after",tokenize:WC,resolveTo:eR}}}}function WC(t,i,r){const o=this;let s=o.events.length;const u=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let c;for(;s--;){const p=o.events[s][1];if(p.type==="labelImage"){c=p;break}if(p.type==="gfmFootnoteCall"||p.type==="labelLink"||p.type==="label"||p.type==="image"||p.type==="link")break}return f;function f(p){if(!c||!c._balanced)return r(p);const m=Zn(o.sliceSerialize({start:c.end,end:o.now()}));return m.codePointAt(0)!==94||!u.includes(m.slice(1))?r(p):(t.enter("gfmFootnoteCallLabelMarker"),t.consume(p),t.exit("gfmFootnoteCallLabelMarker"),i(p))}}function eR(t,i){let r=t.length;for(;r--;)if(t[r][1].type==="labelImage"&&t[r][0]==="enter"){t[r][1];break}t[r+1][1].type="data",t[r+3][1].type="gfmFootnoteCallLabelMarker";const o={type:"gfmFootnoteCall",start:Object.assign({},t[r+3][1].start),end:Object.assign({},t[t.length-1][1].end)},s={type:"gfmFootnoteCallMarker",start:Object.assign({},t[r+3][1].end),end:Object.assign({},t[r+3][1].end)};s.end.column++,s.end.offset++,s.end._bufferIndex++;const u={type:"gfmFootnoteCallString",start:Object.assign({},s.end),end:Object.assign({},t[t.length-1][1].start)},c={type:"chunkString",contentType:"string",start:Object.assign({},u.start),end:Object.assign({},u.end)},f=[t[r+1],t[r+2],["enter",o,i],t[r+3],t[r+4],["enter",s,i],["exit",s,i],["enter",u,i],["enter",c,i],["exit",c,i],["exit",u,i],t[t.length-2],t[t.length-1],["exit",o,i]];return t.splice(r,t.length-r+1,...f),t}function tR(t,i,r){const o=this,s=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let u=0,c;return f;function f(g){return t.enter("gfmFootnoteCall"),t.enter("gfmFootnoteCallLabelMarker"),t.consume(g),t.exit("gfmFootnoteCallLabelMarker"),p}function p(g){return g!==94?r(g):(t.enter("gfmFootnoteCallMarker"),t.consume(g),t.exit("gfmFootnoteCallMarker"),t.enter("gfmFootnoteCallString"),t.enter("chunkString").contentType="string",m)}function m(g){if(u>999||g===93&&!c||g===null||g===91||Qe(g))return r(g);if(g===93){t.exit("chunkString");const x=t.exit("gfmFootnoteCallString");return s.includes(Zn(o.sliceSerialize(x)))?(t.enter("gfmFootnoteCallLabelMarker"),t.consume(g),t.exit("gfmFootnoteCallLabelMarker"),t.exit("gfmFootnoteCall"),i):r(g)}return Qe(g)||(c=!0),u++,t.consume(g),g===92?y:m}function y(g){return g===91||g===92||g===93?(t.consume(g),u++,m):m(g)}}function nR(t,i,r){const o=this,s=o.parser.gfmFootnotes||(o.parser.gfmFootnotes=[]);let u,c=0,f;return p;function p(w){return t.enter("gfmFootnoteDefinition")._container=!0,t.enter("gfmFootnoteDefinitionLabel"),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionLabelMarker"),m}function m(w){return w===94?(t.enter("gfmFootnoteDefinitionMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionMarker"),t.enter("gfmFootnoteDefinitionLabelString"),t.enter("chunkString").contentType="string",y):r(w)}function y(w){if(c>999||w===93&&!f||w===null||w===91||Qe(w))return r(w);if(w===93){t.exit("chunkString");const E=t.exit("gfmFootnoteDefinitionLabelString");return u=Zn(o.sliceSerialize(E)),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(w),t.exit("gfmFootnoteDefinitionLabelMarker"),t.exit("gfmFootnoteDefinitionLabel"),x}return Qe(w)||(f=!0),c++,t.consume(w),w===92?g:y}function g(w){return w===91||w===92||w===93?(t.consume(w),c++,y):y(w)}function x(w){return w===58?(t.enter("definitionMarker"),t.consume(w),t.exit("definitionMarker"),s.includes(u)||s.push(u),$e(t,b,"gfmFootnoteDefinitionWhitespace")):r(w)}function b(w){return i(w)}}function iR(t,i,r){return t.check(wl,i,t.attempt(QC,i,r))}function aR(t){t.exit("gfmFootnoteDefinition")}function rR(t,i,r){const o=this;return $e(t,s,"gfmFootnoteDefinitionIndent",5);function s(u){const c=o.events[o.events.length-1];return c&&c[1].type==="gfmFootnoteDefinitionIndent"&&c[2].sliceSerialize(c[1],!0).length===4?i(u):r(u)}}function oR(t){let r=(t||{}).singleTilde;const o={name:"strikethrough",tokenize:u,resolveAll:s};return r==null&&(r=!0),{text:{126:o},insideSpan:{null:[o]},attentionMarkers:{null:[126]}};function s(c,f){let p=-1;for(;++p<c.length;)if(c[p][0]==="enter"&&c[p][1].type==="strikethroughSequenceTemporary"&&c[p][1]._close){let m=p;for(;m--;)if(c[m][0]==="exit"&&c[m][1].type==="strikethroughSequenceTemporary"&&c[m][1]._open&&c[p][1].end.offset-c[p][1].start.offset===c[m][1].end.offset-c[m][1].start.offset){c[p][1].type="strikethroughSequence",c[m][1].type="strikethroughSequence";const y={type:"strikethrough",start:Object.assign({},c[m][1].start),end:Object.assign({},c[p][1].end)},g={type:"strikethroughText",start:Object.assign({},c[m][1].end),end:Object.assign({},c[p][1].start)},x=[["enter",y,f],["enter",c[m][1],f],["exit",c[m][1],f],["enter",g,f]],b=f.parser.constructs.insideSpan.null;b&&Xn(x,x.length,0,Uu(b,c.slice(m+1,p),f)),Xn(x,x.length,0,[["exit",g,f],["enter",c[p][1],f],["exit",c[p][1],f],["exit",y,f]]),Xn(c,m-1,p-m+3,x),p=m+x.length-2;break}}for(p=-1;++p<c.length;)c[p][1].type==="strikethroughSequenceTemporary"&&(c[p][1].type="data");return c}function u(c,f,p){const m=this.previous,y=this.events;let g=0;return x;function x(w){return m===126&&y[y.length-1][1].type!=="characterEscape"?p(w):(c.enter("strikethroughSequenceTemporary"),b(w))}function b(w){const E=vu(m);if(w===126)return g>1?p(w):(c.consume(w),g++,b);if(g<2&&!r)return p(w);const A=c.exit("strikethroughSequenceTemporary"),k=vu(w);return A._open=!k||k===2&&!!E,A._close=!E||E===2&&!!k,f(w)}}}class lR{constructor(){this.map=[],this.index=new Map}add(i,r,o){sR(this,i,r,o)}consume(i){if(this.map.sort(function(u,c){return u[0]-c[0]}),this.map.length===0)return;let r=this.map.length;const o=[];for(;r>0;)r-=1,o.push(i.slice(this.map[r][0]+this.map[r][1]),this.map[r][2]),i.length=this.map[r][0];o.push(i.slice()),i.length=0;let s=o.pop();for(;s;){for(const u of s)i.push(u);s=o.pop()}this.map.length=0,this.index.clear()}}function sR(t,i,r,o){if(r===0&&o.length===0)return;const s=t.index.get(i);if(s){s[1]+=r,s[2].push(...o);return}const u=[i,r,o];t.map.push(u),t.index.set(i,u)}function uR(t,i){let r=!1;const o=[];for(;i<t.length;){const s=t[i];if(r){if(s[0]==="enter")s[1].type==="tableContent"&&o.push(t[i+1][1].type==="tableDelimiterMarker"?"left":"none");else if(s[1].type==="tableContent"){if(t[i-1][1].type==="tableDelimiterMarker"){const u=o.length-1;o[u]=o[u]==="left"?"center":"right"}}else if(s[1].type==="tableDelimiterRow")break}else s[0]==="enter"&&s[1].type==="tableDelimiterRow"&&(r=!0);i+=1}return o}function cR(){return{flow:{null:{name:"table",tokenize:dR,resolveAll:fR}}}}function dR(t,i,r){const o=this;let s=0,u=0,c;return f;function f(H){let Z=o.events.length-1;for(;Z>-1;){const{type:$}=o.events[Z][1];if($==="lineEnding"||$==="linePrefix")Z--;else break}const oe=Z>-1?o.events[Z][1].type:null,ue=oe==="tableHead"||oe==="tableRow"?j:p;return ue===j&&o.parser.lazy[o.now().line]?r(H):ue(H)}function p(H){return t.enter("tableHead"),t.enter("tableRow"),m(H)}function m(H){return H===124||(c=!0,u+=1),y(H)}function y(H){return H===null?r(H):Re(H)?u>1?(u=0,o.interrupt=!0,t.exit("tableRow"),t.enter("lineEnding"),t.consume(H),t.exit("lineEnding"),b):r(H):Ge(H)?$e(t,y,"whitespace")(H):(u+=1,c&&(c=!1,s+=1),H===124?(t.enter("tableCellDivider"),t.consume(H),t.exit("tableCellDivider"),c=!0,y):(t.enter("data"),g(H)))}function g(H){return H===null||H===124||Qe(H)?(t.exit("data"),y(H)):(t.consume(H),H===92?x:g)}function x(H){return H===92||H===124?(t.consume(H),g):g(H)}function b(H){return o.interrupt=!1,o.parser.lazy[o.now().line]?r(H):(t.enter("tableDelimiterRow"),c=!1,Ge(H)?$e(t,w,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(H):w(H))}function w(H){return H===45||H===58?A(H):H===124?(c=!0,t.enter("tableCellDivider"),t.consume(H),t.exit("tableCellDivider"),E):z(H)}function E(H){return Ge(H)?$e(t,A,"whitespace")(H):A(H)}function A(H){return H===58?(u+=1,c=!0,t.enter("tableDelimiterMarker"),t.consume(H),t.exit("tableDelimiterMarker"),k):H===45?(u+=1,k(H)):H===null||Re(H)?D(H):z(H)}function k(H){return H===45?(t.enter("tableDelimiterFiller"),T(H)):z(H)}function T(H){return H===45?(t.consume(H),T):H===58?(c=!0,t.exit("tableDelimiterFiller"),t.enter("tableDelimiterMarker"),t.consume(H),t.exit("tableDelimiterMarker"),C):(t.exit("tableDelimiterFiller"),C(H))}function C(H){return Ge(H)?$e(t,D,"whitespace")(H):D(H)}function D(H){return H===124?w(H):H===null||Re(H)?!c||s!==u?z(H):(t.exit("tableDelimiterRow"),t.exit("tableHead"),i(H)):z(H)}function z(H){return r(H)}function j(H){return t.enter("tableRow"),L(H)}function L(H){return H===124?(t.enter("tableCellDivider"),t.consume(H),t.exit("tableCellDivider"),L):H===null||Re(H)?(t.exit("tableRow"),i(H)):Ge(H)?$e(t,L,"whitespace")(H):(t.enter("data"),I(H))}function I(H){return H===null||H===124||Qe(H)?(t.exit("data"),L(H)):(t.consume(H),H===92?q:I)}function q(H){return H===92||H===124?(t.consume(H),I):I(H)}}function fR(t,i){let r=-1,o=!0,s=0,u=[0,0,0,0],c=[0,0,0,0],f=!1,p=0,m,y,g;const x=new lR;for(;++r<t.length;){const b=t[r],w=b[1];b[0]==="enter"?w.type==="tableHead"?(f=!1,p!==0&&(Gv(x,i,p,m,y),y=void 0,p=0),m={type:"table",start:Object.assign({},w.start),end:Object.assign({},w.end)},x.add(r,0,[["enter",m,i]])):w.type==="tableRow"||w.type==="tableDelimiterRow"?(o=!0,g=void 0,u=[0,0,0,0],c=[0,r+1,0,0],f&&(f=!1,y={type:"tableBody",start:Object.assign({},w.start),end:Object.assign({},w.end)},x.add(r,0,[["enter",y,i]])),s=w.type==="tableDelimiterRow"?2:y?3:1):s&&(w.type==="data"||w.type==="tableDelimiterMarker"||w.type==="tableDelimiterFiller")?(o=!1,c[2]===0&&(u[1]!==0&&(c[0]=c[1],g=au(x,i,u,s,void 0,g),u=[0,0,0,0]),c[2]=r)):w.type==="tableCellDivider"&&(o?o=!1:(u[1]!==0&&(c[0]=c[1],g=au(x,i,u,s,void 0,g)),u=c,c=[u[1],r,0,0])):w.type==="tableHead"?(f=!0,p=r):w.type==="tableRow"||w.type==="tableDelimiterRow"?(p=r,u[1]!==0?(c[0]=c[1],g=au(x,i,u,s,r,g)):c[1]!==0&&(g=au(x,i,c,s,r,g)),s=0):s&&(w.type==="data"||w.type==="tableDelimiterMarker"||w.type==="tableDelimiterFiller")&&(c[3]=r)}for(p!==0&&Gv(x,i,p,m,y),x.consume(i.events),r=-1;++r<i.events.length;){const b=i.events[r];b[0]==="enter"&&b[1].type==="table"&&(b[1]._align=uR(i.events,r))}return t}function au(t,i,r,o,s,u){const c=o===1?"tableHeader":o===2?"tableDelimiter":"tableData",f="tableContent";r[0]!==0&&(u.end=Object.assign({},Zr(i.events,r[0])),t.add(r[0],0,[["exit",u,i]]));const p=Zr(i.events,r[1]);if(u={type:c,start:Object.assign({},p),end:Object.assign({},p)},t.add(r[1],0,[["enter",u,i]]),r[2]!==0){const m=Zr(i.events,r[2]),y=Zr(i.events,r[3]),g={type:f,start:Object.assign({},m),end:Object.assign({},y)};if(t.add(r[2],0,[["enter",g,i]]),o!==2){const x=i.events[r[2]],b=i.events[r[3]];if(x[1].end=Object.assign({},b[1].end),x[1].type="chunkText",x[1].contentType="text",r[3]>r[2]+1){const w=r[2]+1,E=r[3]-r[2]-1;t.add(w,E,[])}}t.add(r[3]+1,0,[["exit",g,i]])}return s!==void 0&&(u.end=Object.assign({},Zr(i.events,s)),t.add(s,0,[["exit",u,i]]),u=void 0),u}function Gv(t,i,r,o,s){const u=[],c=Zr(i.events,r);s&&(s.end=Object.assign({},c),u.push(["exit",s,i])),o.end=Object.assign({},c),u.push(["exit",o,i]),t.add(r+1,0,u)}function Zr(t,i){const r=t[i],o=r[0]==="enter"?"start":"end";return r[1][o]}const hR={name:"tasklistCheck",tokenize:pR};function mR(){return{text:{91:hR}}}function pR(t,i,r){const o=this;return s;function s(p){return o.previous!==null||!o._gfmTasklistFirstContentOfListItem?r(p):(t.enter("taskListCheck"),t.enter("taskListCheckMarker"),t.consume(p),t.exit("taskListCheckMarker"),u)}function u(p){return Qe(p)?(t.enter("taskListCheckValueUnchecked"),t.consume(p),t.exit("taskListCheckValueUnchecked"),c):p===88||p===120?(t.enter("taskListCheckValueChecked"),t.consume(p),t.exit("taskListCheckValueChecked"),c):r(p)}function c(p){return p===93?(t.enter("taskListCheckMarker"),t.consume(p),t.exit("taskListCheckMarker"),t.exit("taskListCheck"),f):r(p)}function f(p){return Re(p)?i(p):Ge(p)?t.check({tokenize:gR},i,r)(p):r(p)}}function gR(t,i,r){return $e(t,o,"whitespace");function o(s){return s===null?r(s):i(s)}}function Gw(t){return fw([FC(),KC(),oR(t),cR(),mR()])}function yR(t){if(typeof t!="string")throw new TypeError("Expected a string");return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function bR(t,i,r){const s=Pu((r||{}).ignore||[]),u=vR(i);let c=-1;for(;++c<u.length;)Dw(t,"text",f);function f(m,y){let g=-1,x;for(;++g<y.length;){const b=y[g],w=x?x.children:void 0;if(s(b,w?w.indexOf(b):void 0,x))return;x=b}if(x)return p(m,y)}function p(m,y){const g=y[y.length-1],x=u[c][0],b=u[c][1];let w=0;const A=g.children.indexOf(m);let k=!1,T=[];x.lastIndex=0;let C=x.exec(m.value);for(;C;){const z=C.index,j={index:C.index,input:C.input,stack:[...y,m]};let L=b(...C,j);if(typeof L=="string"&&(L=L.length>0?{type:"text",value:L}:void 0),L===!1)x.lastIndex=z+1;else{if(w!==z&&D({type:"text",value:m.value.slice(w,z)}),Array.isArray(L))for(const I of L)D(I);else L&&D(L);w=z+C[0].length,k=!0}if(!x.global)break;C=x.exec(m.value)}return k?(w<m.value.length&&D({type:"text",value:m.value.slice(w)}),g.children.splice(A,1,...T)):T=[m],A+T.length;function D(z){const j=T[T.length-1];j&&j.type==="text"&&z.type==="text"?j.value+=z.value:T.push(z)}}}function vR(t){if(!Array.isArray(t))throw new TypeError("Expected find and replace tuple or list of tuples");const i=[],r=!t[0]||Array.isArray(t[0])?t:[t];let o=-1;for(;++o<r.length;){const s=r[o];i.push([xR(s[0]),wR(s[1])])}return i}function xR(t){return typeof t=="string"?new RegExp(yR(t),"g"):t}function wR(t){return typeof t=="function"?t:function(){return t}}const Kf="phrasing",Wf=["autolink","link","image","label"];function SR(){return{transforms:[MR],enter:{literalAutolink:AR,literalAutolinkEmail:eh,literalAutolinkHttp:eh,literalAutolinkWww:eh},exit:{literalAutolink:RR,literalAutolinkEmail:CR,literalAutolinkHttp:TR,literalAutolinkWww:ER}}}function kR(){return{unsafe:[{character:"@",before:"[+\\-.\\w]",after:"[\\-.\\w]",inConstruct:Kf,notInConstruct:Wf},{character:".",before:"[Ww]",after:"[\\-.\\w]",inConstruct:Kf,notInConstruct:Wf},{character:":",before:"[ps]",after:"\\/",inConstruct:Kf,notInConstruct:Wf}]}}function AR(t){this.enter({type:"link",title:null,url:"",children:[]},t)}function eh(t){this.config.enter.autolinkProtocol.call(this,t)}function TR(t){this.config.exit.autolinkProtocol.call(this,t)}function ER(t){this.config.exit.data.call(this,t);const i=this.stack[this.stack.length-1];i.type,i.url="http://"+this.sliceSerialize(t)}function CR(t){this.config.exit.autolinkEmail.call(this,t)}function RR(t){this.exit(t)}function MR(t){bR(t,[[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi,NR],[new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)","gu"),DR]],{ignore:["link","linkReference"]})}function NR(t,i,r,o,s){let u="";if(!$w(s)||(/^w/i.test(i)&&(r=i+r,i="",u="http://"),!OR(r)))return!1;const c=jR(r+o);if(!c[0])return!1;const f={type:"link",title:null,url:u+i+c[0],children:[{type:"text",value:i+c[0]}]};return c[1]?[f,{type:"text",value:c[1]}]:f}function DR(t,i,r,o){return!$w(o,!0)||/[-\d_]$/.test(r)?!1:{type:"link",title:null,url:"mailto:"+i+"@"+r,children:[{type:"text",value:i+"@"+r}]}}function OR(t){const i=t.split(".");return!(i.length<2||i[i.length-1]&&(/_/.test(i[i.length-1])||!/[a-zA-Z\d]/.test(i[i.length-1]))||i[i.length-2]&&(/_/.test(i[i.length-2])||!/[a-zA-Z\d]/.test(i[i.length-2])))}function jR(t){const i=/[!"&'),.:;<>?\]}]+$/.exec(t);if(!i)return[t,void 0];t=t.slice(0,i.index);let r=i[0],o=r.indexOf(")");const s=Uv(t,"(");let u=Uv(t,")");for(;o!==-1&&s>u;)t+=r.slice(0,o+1),r=r.slice(o+1),o=r.indexOf(")"),u++;return[t,r]}function $w(t,i){const r=t.input.charCodeAt(t.index-1);return(t.index===0||zt(r)||va(r))&&(!i||r!==47)}Yw.peek=FR;function LR(){this.buffer()}function zR(t){this.enter({type:"footnoteReference",identifier:"",label:""},t)}function _R(){this.buffer()}function IR(t){this.enter({type:"footnoteDefinition",identifier:"",label:"",children:[]},t)}function HR(t){const i=this.resume(),r=this.stack[this.stack.length-1];r.type,r.identifier=Zn(this.sliceSerialize(t)).toLowerCase(),r.label=i}function BR(t){this.exit(t)}function qR(t){const i=this.resume(),r=this.stack[this.stack.length-1];r.type,r.identifier=Zn(this.sliceSerialize(t)).toLowerCase(),r.label=i}function UR(t){this.exit(t)}function FR(){return"["}function Yw(t,i,r,o){const s=r.createTracker(o);let u=s.move("[^");const c=r.enter("footnoteReference"),f=r.enter("reference");return u+=s.move(r.safe(r.associationId(t),{after:"]",before:u})),f(),c(),u+=s.move("]"),u}function PR(){return{enter:{gfmFootnoteCallString:LR,gfmFootnoteCall:zR,gfmFootnoteDefinitionLabelString:_R,gfmFootnoteDefinition:IR},exit:{gfmFootnoteCallString:HR,gfmFootnoteCall:BR,gfmFootnoteDefinitionLabelString:qR,gfmFootnoteDefinition:UR}}}function VR(t){let i=!1;return t&&t.firstLineBlank&&(i=!0),{handlers:{footnoteDefinition:r,footnoteReference:Yw},unsafe:[{character:"[",inConstruct:["label","phrasing","reference"]}]};function r(o,s,u,c){const f=u.createTracker(c);let p=f.move("[^");const m=u.enter("footnoteDefinition"),y=u.enter("label");return p+=f.move(u.safe(u.associationId(o),{before:p,after:"]"})),y(),p+=f.move("]:"),o.children&&o.children.length>0&&(f.shift(4),p+=f.move((i?`
`:" ")+u.indentLines(u.containerFlow(o,f.current()),i?Jw:GR))),m(),p}}function GR(t,i,r){return i===0?t:Jw(t,i,r)}function Jw(t,i,r){return(r?"":"    ")+t}const $R=["autolink","destinationLiteral","destinationRaw","reference","titleQuote","titleApostrophe"];cm.attention=QR;cm.peek=KR;function YR(){return{canContainEols:["delete"],enter:{strikethrough:XR},exit:{strikethrough:ZR}}}function JR(){return{handlers:{delete:cm},unsafe:[{character:"~",inConstruct:"phrasing",notInConstruct:$R}]}}function XR(t){this.enter({type:"delete",children:[],position:void 0},t)}function ZR(t){this.exit(t)}function cm(t,i,r,o){const s=r.createTracker(o),u=r.stack.includes("strikethrough")?"~":"~~",c=r.enter("strikethrough");let f=s.move(u);return f+=r.containerPhrasing(t,{...s.current(),before:f,after:"~"}),f+=s.move(u),c(),f}function QR(){return{construct:"strikethrough",markers:["~"],sizes:[2,1]}}function KR(){return"~"}function WR(t){return t.length}function eM(t,i){const r=i||{},o=(r.align||[]).concat(),s=r.stringLength||WR,u=[],c=[],f=[],p=[];let m=0,y=-1;for(;++y<t.length;){const E=[],A=[];let k=-1;for(t[y].length>m&&(m=t[y].length);++k<t[y].length;){const T=tM(t[y][k]);if(r.alignDelimiters!==!1){const C=s(T);A[k]=C,(p[k]===void 0||C>p[k])&&(p[k]=C)}E.push(T)}c[y]=E,f[y]=A}let g=-1;if(typeof o=="object"&&"length"in o)for(;++g<m;)u[g]=$v(o[g]);else{const E=$v(o);for(;++g<m;)u[g]=E}g=-1;const x=[],b=[];for(;++g<m;){const E=u[g];let A="",k="";E===99?(A=":",k=":"):E===108?A=":":E===114&&(k=":");let T=r.alignDelimiters===!1?1:Math.max(1,p[g]-A.length-k.length);const C=A+"-".repeat(T)+k;r.alignDelimiters!==!1&&(T=A.length+T+k.length,T>p[g]&&(p[g]=T),b[g]=T),x[g]=C}c.splice(1,0,x),f.splice(1,0,b),y=-1;const w=[];for(;++y<c.length;){const E=c[y],A=f[y];g=-1;const k=[];for(;++g<m;){const T=E[g]||"";let C="",D="";if(r.alignDelimiters!==!1){const z=p[g]-(A[g]||0),j=u[g];j===114?C=" ".repeat(z):j===99?z%2?(C=" ".repeat(z/2+.5),D=" ".repeat(z/2-.5)):(C=" ".repeat(z/2),D=C):D=" ".repeat(z)}r.delimiterStart!==!1&&!g&&k.push("|"),r.padding!==!1&&!(r.alignDelimiters===!1&&T==="")&&(r.delimiterStart!==!1||g)&&k.push(" "),r.alignDelimiters!==!1&&k.push(C),k.push(T),r.alignDelimiters!==!1&&k.push(D),r.padding!==!1&&k.push(" "),(r.delimiterEnd!==!1||g!==m-1)&&k.push("|")}w.push(r.delimiterEnd===!1?k.join("").replace(/ +$/,""):k.join(""))}return w.join(`
`)}function tM(t){return t==null?"":String(t)}function $v(t){const i=typeof t=="string"?t.codePointAt(0):0;return i===67||i===99?99:i===76||i===108?108:i===82||i===114?114:0}const nM=Pu(["break","delete","emphasis","footnote","footnoteReference","image","imageReference","inlineCode","inlineMath","link","linkReference","mdxJsxTextElement","mdxTextExpression","strong","text","textDirective"]);function iM(t,i,r,o){const s=r.enter("blockquote"),u=r.createTracker(o);u.move("> "),u.shift(2);const c=r.indentLines(r.containerFlow(t,u.current()),aM);return s(),c}function aM(t,i,r){return">"+(r?"":" ")+t}function rM(t,i){return Yv(t,i.inConstruct,!0)&&!Yv(t,i.notInConstruct,!1)}function Yv(t,i,r){if(typeof i=="string"&&(i=[i]),!i||i.length===0)return r;let o=-1;for(;++o<i.length;)if(t.includes(i[o]))return!0;return!1}function Jv(t,i,r,o){let s=-1;for(;++s<r.unsafe.length;){const u=r.unsafe[s];if(u.character===`
`&&!u.before&&!u.after&&rM(r.stack,u))return/[\t ]/.test(o.before)?"":" "}return`\\
`}function oM(t,i){const r=String(t);let o=r.indexOf(i),s=o,u=0,c=0;if(typeof i!="string")throw new TypeError("Expected substring");for(;o!==-1;)o===s?++u>c&&(c=u):u=1,s=o+i.length,o=r.indexOf(i,s);return c}function lM(t,i){return!!(i.options.fences===!1&&t.value&&!t.lang&&/[^\n\r ]/.test(t.value)&&!/^[\t ]*(?:[\n\r]|$)|(?:^|[\n\r])[\t ]*$/.test(t.value))}function sM(t){const i=t.options.fence||"`";if(i!=="`"&&i!=="~")throw new Error("Cannot serialize code with `"+i+"` for `options.fence`, expected `` ` `` or `~`");return i}function uM(t,i,r,o){const s=sM(r),u=t.value||"";if(lM(t,r)){const g=r.enter("codeIndented"),x=r.indentLines(u,cM);return g(),x}const c=r.createTracker(o),f=s.repeat(Math.max(oM(u,s)+1,3)),p=r.enter("codeFenced"),m=s==="`"?"GraveAccent":"Tilde";let y=c.move(f);if(t.lang){const g=r.enter(`codeFencedLang${m}`);y+=c.move(r.safe(t.lang,{before:y,after:" ",encode:["`"],...c.current()})),g()}if(t.lang&&t.meta){const g=r.enter(`codeFencedMeta${m}`);y+=c.move(" "),y+=c.move(r.safe(t.meta,{before:y,after:`
`,encode:["`"],...c.current()})),g()}return y+=c.move(`
`),u&&(y+=c.move(u+`
`)),y+=c.move(f),p(),y}function cM(t,i,r){return(r?"":"    ")+t}function dm(t){const i=t.options.quote||'"';if(i!=='"'&&i!=="'")throw new Error("Cannot serialize title with `"+i+"` for `options.quote`, expected `\"`, or `'`");return i}function dM(t,i,r,o){const s=dm(r),u=s==='"'?"Quote":"Apostrophe",c=r.enter("definition");let f=r.enter("label");const p=r.createTracker(o);let m=p.move("[");return m+=p.move(r.safe(r.associationId(t),{before:m,after:"]",...p.current()})),m+=p.move("]: "),f(),!t.url||/[\0- \u007F]/.test(t.url)?(f=r.enter("destinationLiteral"),m+=p.move("<"),m+=p.move(r.safe(t.url,{before:m,after:">",...p.current()})),m+=p.move(">")):(f=r.enter("destinationRaw"),m+=p.move(r.safe(t.url,{before:m,after:t.title?" ":`
`,...p.current()}))),f(),t.title&&(f=r.enter(`title${u}`),m+=p.move(" "+s),m+=p.move(r.safe(t.title,{before:m,after:s,...p.current()})),m+=p.move(s),f()),c(),m}function fM(t){const i=t.options.emphasis||"*";if(i!=="*"&&i!=="_")throw new Error("Cannot serialize emphasis with `"+i+"` for `options.emphasis`, expected `*`, or `_`");return i}fm.attention=hM;fm.peek=mM;function fm(t,i,r,o){const s=r.enter("phrasing"),u=r.containerPhrasing({type:"root",children:[t]},o);return s(),u}function hM(t,i){return{construct:"emphasis",markers:fM(i)==="*"?["*","_"]:["_","*"],sizes:[1]}}function mM(t,i,r){return r.options.emphasis||"*"}function pM(t){return"&#x"+t.toString(16).toUpperCase()+";"}function hm(t,i,r,o){let s,u,c;typeof i=="function"&&typeof r!="function"?(u=void 0,c=i,s=r):(u=i,c=r,s=o),Dw(t,u,f,s);function f(p,m){const y=m[m.length-1],g=y?y.children.indexOf(p):void 0;return c(p,g,y)}}function gM(t,i){let r=!1;return hm(t,function(o){if("value"in o&&/\r?\n|\r/.test(o.value)||o.type==="break")return r=!0,Oh}),!!((!t.depth||t.depth<3)&&em(t)&&(i.options.setext||r))}function yM(t,i,r,o){const s=Math.max(Math.min(6,t.depth||1),1),u=r.createTracker(o);if(gM(t,r)){const g=r.enter("headingSetext"),x=r.enter("phrasing"),b=r.containerPhrasing(t,{...u.current(),before:`
`,after:`
`});return x(),g(),b+`
`+(s===1?"=":"-").repeat(b.length-(Math.max(b.lastIndexOf("\r"),b.lastIndexOf(`
`))+1))}const c="#".repeat(s),f=r.enter("headingAtx"),p=r.enter("phrasing");u.move(c+" ");let m=r.containerPhrasing(t,{before:"# ",after:`
`,...u.current()});const y=m.charCodeAt(0);return(y===9||y===32)&&(m=pM(y)+m.slice(1)),m=m?c+" "+m:c,r.options.closeAtx&&(m+=" "+c),p(),f(),m}Xw.peek=bM;function Xw(t){return t.value||""}function bM(){return"<"}Zw.peek=vM;function Zw(t,i,r,o){const s=dm(r),u=s==='"'?"Quote":"Apostrophe",c=r.enter("image");let f=r.enter("label");const p=r.createTracker(o);let m=p.move("![");return m+=p.move(r.safe(t.alt,{before:m,after:"]",...p.current()})),m+=p.move("]("),f(),!t.url&&t.title||/[\0- \u007F]/.test(t.url)?(f=r.enter("destinationLiteral"),m+=p.move("<"),m+=p.move(r.safe(t.url,{before:m,after:">",...p.current()})),m+=p.move(">")):(f=r.enter("destinationRaw"),m+=p.move(r.safe(t.url,{before:m,after:t.title?" ":")",...p.current()}))),f(),t.title&&(f=r.enter(`title${u}`),m+=p.move(" "+s),m+=p.move(r.safe(t.title,{before:m,after:s,...p.current()})),m+=p.move(s),f()),m+=p.move(")"),c(),m}function vM(){return"!"}Qw.peek=xM;function Qw(t,i,r,o){const s=t.referenceType,u=r.enter("imageReference");let c=r.enter("label");const f=r.createTracker(o);let p=f.move("![");const m=r.safe(t.alt,{before:p,after:"]",...f.current()});p+=f.move(m+"]["),c();const y=r.stack;r.stack=y.filter(function(x){return x!=="phrasing"}),c=r.enter("reference");const g=r.safe(r.associationId(t),{before:p,after:"]",...f.current()});return c(),r.stack=y,u(),s==="full"||!m||m!==g?p+=f.move(g+"]"):s==="shortcut"?p=p.slice(0,-1):p+=f.move("]"),p}function xM(){return"!"}Kw.peek=wM;function Kw(t,i,r){let o=t.value||"",s="`",u=-1;for(;new RegExp("(^|[^`])"+s+"([^`]|$)").test(o);)s+="`";for(/[^\n\r ]/.test(o)&&(/^[\n\r ]/.test(o)&&/[\n\r ]$/.test(o)||/^`|`$/.test(o))&&(o=" "+o+" ");++u<r.unsafe.length;){const c=r.unsafe[u],f=r.compilePattern(c);if(!c.atBreak)continue;let p;for(;p=f.exec(o);){let m=p.index;o.charCodeAt(m)===10&&o.charCodeAt(m-1)===13&&m--,o=o.slice(0,m)+" "+o.slice(p.index+1)}}return s+o+s}function wM(){return"`"}function Ww(t,i){const r=em(t);return!!(!i.options.resourceLink&&t.url&&!t.title&&t.children&&t.children.length===1&&t.children[0].type==="text"&&(r===t.url||"mailto:"+r===t.url)&&/^[a-z][+\-.a-z]+:/i.test(t.url)&&!/[\0- <>\u007F]/.test(t.url))}e0.peek=SM;function e0(t,i,r,o){const s=dm(r),u=s==='"'?"Quote":"Apostrophe",c=r.createTracker(o);if(Ww(t,r)){const y=r.stack;r.stack=y.filter(function(b){return b!=="phrasing"});const g=r.enter("autolink");let x=c.move("<");return x+=c.move(r.containerPhrasing(t,{before:x,after:">",...c.current()})),x+=c.move(">"),g(),r.stack=y,x}const f=r.enter("link");let p=r.enter("label"),m=c.move("[");return m+=c.move(r.containerPhrasing(t,{before:m,after:"](",...c.current()})),m+=c.move("]("),p(),!t.url&&t.title||/[\0- \u007F]/.test(t.url)?(p=r.enter("destinationLiteral"),m+=c.move("<"),m+=c.move(r.safe(t.url,{before:m,after:">",...c.current()})),m+=c.move(">")):(p=r.enter("destinationRaw"),m+=c.move(r.safe(t.url,{before:m,after:t.title?" ":")",...c.current()}))),p(),t.title&&(p=r.enter(`title${u}`),m+=c.move(" "+s),m+=c.move(r.safe(t.title,{before:m,after:s,...c.current()})),m+=c.move(s),p()),m+=c.move(")"),f(),m}function SM(t,i,r){return Ww(t,r)?"<":"["}t0.peek=kM;function t0(t,i,r,o){const s=t.referenceType,u=r.enter("linkReference");let c=r.enter("label");const f=r.createTracker(o);let p=f.move("[");const m=r.containerPhrasing(t,{before:p,after:"]",...f.current()});p+=f.move(m+"]["),c();const y=r.stack;r.stack=y.filter(function(x){return x!=="phrasing"}),c=r.enter("reference");const g=r.safe(r.associationId(t),{before:p,after:"]",...f.current()});return c(),r.stack=y,u(),s==="full"||!m||m!==g?p+=f.move(g+"]"):s==="shortcut"?p=p.slice(0,-1):p+=f.move("]"),p}function kM(){return"["}function mm(t){const i=t.options.bullet||"*";if(i!=="*"&&i!=="+"&&i!=="-")throw new Error("Cannot serialize items with `"+i+"` for `options.bullet`, expected `*`, `+`, or `-`");return i}function AM(t){const i=mm(t),r=t.options.bulletOther;if(!r)return i==="*"?"-":"*";if(r!=="*"&&r!=="+"&&r!=="-")throw new Error("Cannot serialize items with `"+r+"` for `options.bulletOther`, expected `*`, `+`, or `-`");if(r===i)throw new Error("Expected `bullet` (`"+i+"`) and `bulletOther` (`"+r+"`) to be different");return r}function TM(t){const i=t.options.bulletOrdered||".";if(i!=="."&&i!==")")throw new Error("Cannot serialize items with `"+i+"` for `options.bulletOrdered`, expected `.` or `)`");return i}function n0(t){const i=t.options.rule||"*";if(i!=="*"&&i!=="-"&&i!=="_")throw new Error("Cannot serialize rules with `"+i+"` for `options.rule`, expected `*`, `-`, or `_`");return i}function EM(t,i,r,o){const s=r.enter("list"),u=r.bulletCurrent;let c=t.ordered?TM(r):mm(r);const f=t.ordered?c==="."?")":".":AM(r);let p=i&&r.bulletLastUsed?c===r.bulletLastUsed:!1;if(!t.ordered){const y=t.children?t.children[0]:void 0;if((c==="*"||c==="-")&&y&&(!y.children||!y.children[0])&&r.stack[r.stack.length-1]==="list"&&r.stack[r.stack.length-2]==="listItem"&&r.stack[r.stack.length-3]==="list"&&r.stack[r.stack.length-4]==="listItem"&&r.indexStack[r.indexStack.length-1]===0&&r.indexStack[r.indexStack.length-2]===0&&r.indexStack[r.indexStack.length-3]===0&&(p=!0),n0(r)===c&&y){let g=-1;for(;++g<t.children.length;){const x=t.children[g];if(x&&x.type==="listItem"&&x.children&&x.children[0]&&x.children[0].type==="thematicBreak"){p=!0;break}}}}p&&(c=f),r.bulletCurrent=c;const m=r.containerFlow(t,o);return r.bulletLastUsed=c,r.bulletCurrent=u,s(),m}function CM(t){const i=t.options.listItemIndent||"one";if(i!=="tab"&&i!=="one"&&i!=="mixed")throw new Error("Cannot serialize items with `"+i+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return i}function RM(t,i,r,o){const s=CM(r);let u=r.bulletCurrent||mm(r);i&&i.type==="list"&&i.ordered&&(u=(typeof i.start=="number"&&i.start>-1?i.start:1)+(r.options.incrementListMarker===!1?0:i.children.indexOf(t))+u);let c=u.length+1;(s==="tab"||s==="mixed"&&(i&&i.type==="list"&&i.spread||t.spread))&&(c=Math.ceil(c/4)*4);const f=r.createTracker(o);f.move(u+" ".repeat(c-u.length)),f.shift(c);const p=r.enter("listItem"),m=r.indentLines(r.containerFlow(t,f.current()),y);return p(),m;function y(g,x,b){return x?(b?"":" ".repeat(c))+g:(b?u:u+" ".repeat(c-u.length))+g}}function MM(t,i,r,o){const s=r.enter("paragraph"),u=r.enter("phrasing"),c=r.containerPhrasing(t,o);return u(),s(),c}function NM(t,i,r,o){if(!t.children.some(function(f){return nM(f)}))return r.containerFlow(t,o);const u=r.enter("phrasing"),c=r.containerPhrasing(t,o);return u(),c}function DM(t){const i=t.options.strong||"*";if(i!=="*"&&i!=="_")throw new Error("Cannot serialize strong with `"+i+"` for `options.strong`, expected `*`, or `_`");return i}pm.attention=OM;pm.peek=jM;function pm(t,i,r,o){const s=r.enter("phrasing"),u=r.containerPhrasing({type:"root",children:[t]},o);return s(),u}function OM(t,i){return{construct:"strong",markers:DM(i)==="*"?["*","_"]:["_","*"],sizes:[2]}}function jM(t,i,r){return r.options.strong||"*"}function LM(t,i,r,o){const s=i?i.children:[],u=s.indexOf(t);return r.safe(t.value,{...o,afterNode:s[u+1],beforeNode:s[u-1]})}function zM(t){const i=t.options.ruleRepetition||3;if(i<3)throw new Error("Cannot serialize rules with repetition `"+i+"` for `options.ruleRepetition`, expected `3` or more");return i}function _M(t,i,r){const o=(n0(r)+(r.options.ruleSpaces?" ":"")).repeat(zM(r));return r.options.ruleSpaces?o.slice(0,-1):o}const i0={blockquote:iM,break:Jv,code:uM,definition:dM,emphasis:fm,hardBreak:Jv,heading:yM,html:Xw,image:Zw,imageReference:Qw,inlineCode:Kw,link:e0,linkReference:t0,list:EM,listItem:RM,paragraph:MM,root:NM,strong:pm,text:LM,thematicBreak:_M};function IM(){return{enter:{table:HM,tableData:Xv,tableHeader:Xv,tableRow:qM},exit:{codeText:UM,table:BM,tableData:th,tableHeader:th,tableRow:th}}}function HM(t){const i=t._align;this.enter({type:"table",align:i.map(function(r){return r==="none"?null:r}),children:[]},t),this.data.inTable=!0}function BM(t){this.exit(t),this.data.inTable=void 0}function qM(t){this.enter({type:"tableRow",children:[]},t)}function th(t){this.exit(t)}function Xv(t){this.enter({type:"tableCell",children:[]},t)}function UM(t){let i=this.resume();this.data.inTable&&(i=i.replace(/\\([\\|])/g,FM));const r=this.stack[this.stack.length-1];r.type,r.value=i,this.exit(t)}function FM(t,i){return i==="|"?i:t}function PM(t){const i=t||{},r=i.tableCellPadding,o=i.tablePipeAlign,s=i.stringLength,u=r?" ":"|";return{unsafe:[{character:"\r",inConstruct:"tableCell"},{character:`
`,inConstruct:"tableCell"},{atBreak:!0,character:"|",after:"[	 :-]"},{character:"|",inConstruct:"tableCell"},{atBreak:!0,character:":",after:"-"},{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{inlineCode:x,table:c,tableCell:p,tableRow:f}};function c(b,w,E,A){return m(y(b,E,A),b.align)}function f(b,w,E,A){const k=g(b,E,A),T=m([k]);return T.slice(0,T.indexOf(`
`))}function p(b,w,E,A){const k=E.enter("tableCell"),T=E.enter("phrasing"),C=E.containerPhrasing(b,{...A,before:u,after:u});return T(),k(),C}function m(b,w){return eM(b,{align:w,alignDelimiters:o,padding:r,stringLength:s})}function y(b,w,E){const A=b.children;let k=-1;const T=[],C=w.enter("table");for(;++k<A.length;)T[k]=g(A[k],w,E);return C(),T}function g(b,w,E){const A=b.children;let k=-1;const T=[],C=w.enter("tableRow");for(;++k<A.length;)T[k]=p(A[k],b,w,E);return C(),T}function x(b,w,E){let A=i0.inlineCode(b,w,E);return E.stack.includes("tableCell")&&(A=A.replace(/\|/g,"\\$&")),A}}function VM(){return{exit:{taskListCheckValueChecked:Zv,taskListCheckValueUnchecked:Zv,paragraph:$M}}}function GM(){return{unsafe:[{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{listItem:YM}}}function Zv(t){const i=this.stack[this.stack.length-2];i.type,i.checked=t.type==="taskListCheckValueChecked"}function $M(t){const i=this.stack[this.stack.length-2];if(i&&i.type==="listItem"&&typeof i.checked=="boolean"){const r=this.stack[this.stack.length-1];r.type;const o=r.children[0];if(o&&o.type==="text"){const s=i.children;let u=-1,c;for(;++u<s.length;){const f=s[u];if(f.type==="paragraph"){c=f;break}}c===r&&(o.value=o.value.slice(1),o.value.length===0?r.children.shift():r.position&&o.position&&typeof o.position.start.offset=="number"&&(o.position.start.column++,o.position.start.offset++,r.position.start=Object.assign({},o.position.start)))}}this.exit(t)}function YM(t,i,r,o){const s=t.children[0],u=typeof t.checked=="boolean"&&s&&s.type==="paragraph",c="["+(t.checked?"x":" ")+"] ",f=r.createTracker(o);u&&f.move(c);let p=i0.listItem(t,i,r,{...o,...f.current()});return u&&(p=p.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/,m)),p;function m(y){return y+c}}function a0(){return[SR(),PR(),YR(),IM(),VM()]}function JM(t){return{extensions:[kR(),VR(t),JR(),PM(t),GM()]}}function gm(){return{name:"gfm",micromark:[Gw()],mdast:a0(),scope:"local"}}const XM="modulepreload",ZM=function(t){return"/LiMR/"+t},Qv={},r0=function(i,r,o){let s=Promise.resolve();if(r&&r.length>0){let p=function(m){return Promise.all(m.map(y=>Promise.resolve(y).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),f=c?.nonce||c?.getAttribute("nonce");s=p(r.map(m=>{if(m=ZM(m),m in Qv)return;Qv[m]=!0;const y=m.endsWith(".css"),g=y?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${g}`))return;const x=document.createElement("link");if(x.rel=y?"stylesheet":XM,y||(x.as="script"),x.crossOrigin="",x.href=m,f&&x.setAttribute("nonce",f),document.head.appendChild(x),y)return new Promise((b,w)=>{x.addEventListener("load",b),x.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${m}`)))})}))}function u(c){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=c,window.dispatchEvent(f),!f.defaultPrevented)throw c}return s.then(c=>{for(const f of c||[])f.status==="rejected"&&u(f.reason);return i().catch(u)})},QM={tokenize:KM,concrete:!0,name:"mathFlow"},Kv={tokenize:WM,partial:!0};function KM(t,i,r){const o=this,s=o.events[o.events.length-1],u=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let c=0;return f;function f(T){return t.enter("mathFlow"),t.enter("mathFlowFence"),t.enter("mathFlowFenceSequence"),p(T)}function p(T){return T===36?(t.consume(T),c++,p):c<2?r(T):(t.exit("mathFlowFenceSequence"),$e(t,m,"whitespace")(T))}function m(T){return T===null||Re(T)?g(T):(t.enter("mathFlowFenceMeta"),t.enter("chunkString",{contentType:"string"}),y(T))}function y(T){return T===null||Re(T)?(t.exit("chunkString"),t.exit("mathFlowFenceMeta"),g(T)):T===36?r(T):(t.consume(T),y)}function g(T){return t.exit("mathFlowFence"),o.interrupt?i(T):t.attempt(Kv,x,A)(T)}function x(T){return t.attempt({tokenize:k,partial:!0},A,b)(T)}function b(T){return(u?$e(t,w,"linePrefix",u+1):w)(T)}function w(T){return T===null?A(T):Re(T)?t.attempt(Kv,x,A)(T):(t.enter("mathFlowValue"),E(T))}function E(T){return T===null||Re(T)?(t.exit("mathFlowValue"),w(T)):(t.consume(T),E)}function A(T){return t.exit("mathFlow"),i(T)}function k(T,C,D){let z=0;return $e(T,j,"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function j(q){return T.enter("mathFlowFence"),T.enter("mathFlowFenceSequence"),L(q)}function L(q){return q===36?(z++,T.consume(q),L):z<c?D(q):(T.exit("mathFlowFenceSequence"),$e(T,I,"whitespace")(q))}function I(q){return q===null||Re(q)?(T.exit("mathFlowFence"),C(q)):D(q)}}}function WM(t,i,r){const o=this;return s;function s(c){return c===null?i(c):(t.enter("lineEnding"),t.consume(c),t.exit("lineEnding"),u)}function u(c){return o.parser.lazy[o.now().line]?r(c):i(c)}}function e2(t){let r={}.singleDollarTextMath;return r==null&&(r=!0),{tokenize:o,resolve:t2,previous:n2,name:"mathText"};function o(s,u,c){let f=0,p,m;return y;function y(E){return s.enter("mathText"),s.enter("mathTextSequence"),g(E)}function g(E){return E===36?(s.consume(E),f++,g):f<2&&!r?c(E):(s.exit("mathTextSequence"),x(E))}function x(E){return E===null?c(E):E===36?(m=s.enter("mathTextSequence"),p=0,w(E)):E===32?(s.enter("space"),s.consume(E),s.exit("space"),x):Re(E)?(s.enter("lineEnding"),s.consume(E),s.exit("lineEnding"),x):(s.enter("mathTextData"),b(E))}function b(E){return E===null||E===32||E===36||Re(E)?(s.exit("mathTextData"),x(E)):(s.consume(E),b)}function w(E){return E===36?(s.consume(E),p++,w):p===f?(s.exit("mathTextSequence"),s.exit("mathText"),u(E)):(m.type="mathTextData",b(E))}}}function t2(t){let i=t.length-4,r=3,o,s;if((t[r][1].type==="lineEnding"||t[r][1].type==="space")&&(t[i][1].type==="lineEnding"||t[i][1].type==="space")){for(o=r;++o<i;)if(t[o][1].type==="mathTextData"){t[i][1].type="mathTextPadding",t[r][1].type="mathTextPadding",r+=2,i-=2;break}}for(o=r-1,i++;++o<=i;)s===void 0?o!==i&&t[o][1].type!=="lineEnding"&&(s=o):(o===i||t[o][1].type==="lineEnding")&&(t[s][1].type="mathTextData",o!==s+2&&(t[s][1].end=t[o-1][1].end,t.splice(s+2,o-s-2),i-=o-s-2,o=s+2),s=void 0);return t}function n2(t){return t!==36||this.events[this.events.length-1][1].type==="characterEscape"}function i2(t){return{flow:{36:QM},text:{36:e2()}}}function a2(){return{enter:{mathFlow:t,mathFlowFenceMeta:i,mathText:u},exit:{mathFlow:s,mathFlowFence:o,mathFlowFenceMeta:r,mathFlowValue:f,mathText:c,mathTextData:f}};function t(p){const m={type:"element",tagName:"code",properties:{className:["language-math","math-display"]},children:[]};this.enter({type:"math",meta:null,value:"",data:{hName:"pre",hChildren:[m]}},p)}function i(){this.buffer()}function r(){const p=this.resume(),m=this.stack[this.stack.length-1];m.type,m.meta=p}function o(){this.data.mathFlowInside||(this.buffer(),this.data.mathFlowInside=!0)}function s(p){const m=this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),y=this.stack[this.stack.length-1];y.type,this.exit(p),y.value=m;const g=y.data.hChildren[0];g.type,g.tagName,g.children.push({type:"text",value:m}),this.data.mathFlowInside=void 0}function u(p){this.enter({type:"inlineMath",value:"",data:{hName:"code",hProperties:{className:["language-math","math-inline"]},hChildren:[]}},p),this.buffer()}function c(p){const m=this.resume(),y=this.stack[this.stack.length-1];y.type,this.exit(p),y.value=m,y.data.hChildren.push({type:"text",value:m})}function f(p){this.config.enter.data.call(this,p),this.config.exit.data.call(this,p)}}function yl({value:t="",onCopy:i,label:r,variant:o="plain",className:s=""}){const u=Wn(),[c,f]=O.useState("idle"),p=O.useRef(void 0),m=O.useRef(!0),y=c==="copied"?u.copied:c==="error"?u.copyFailed:r??u.copy;O.useEffect(()=>(m.current=!0,()=>{m.current=!1,clearTimeout(p.current)}),[]);const g=async()=>{try{if(i?await i():await navigator.clipboard.writeText(t),!m.current)return;f("copied")}catch{if(!m.current)return;f("error")}clearTimeout(p.current),p.current=setTimeout(()=>f("idle"),2200)};return v.jsxs("button",{type:"button",className:`limr-copy-button ${s}`,"data-variant":o,"data-status":c,"data-limr-ignore":"true","aria-label":y,title:y,onClick:g,children:[v.jsxs("svg",{className:"limr-copy-glyph",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[v.jsxs("g",{className:"limr-copy-sheets",children:[v.jsx("rect",{x:"8.5",y:"8",width:"10.5",height:"12",rx:"3"}),v.jsx("path",{d:"M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5"})]}),v.jsx("path",{className:"limr-copy-check",d:"m5.5 12 4.2 4.2 8.8-9",pathLength:"1"})]}),v.jsx("span",{className:c==="error"?"limr-copy-error":"limr-sr-only",role:"status",children:c==="copied"?u.copied:c==="error"?u.copyFailed:""})]})}let o0,r2;const o2=()=>r2??=r0(()=>import("./math-renderer-AKNKiaM5.js"),[]).then(t=>(o0=t.default,t)),l2=O.lazy(o2);function s2(t={}){function i({node:r}){const o=r.type==="math",s=v.jsx("code",{className:"limr-math-source",children:r.value}),u=o0??l2,c=v.jsx(O.Suspense,{fallback:s,children:v.jsx(u,{value:r.value??"",display:o,options:t})});return o?v.jsxs("div",{className:"limr-math-block",children:[c,v.jsx(yl,{className:"limr-math-copy",variant:"glass",label:"Copy LaTeX",value:`$$
${r.value??""}
$$`})]}):c}return{name:"math",micromark:[i2()],mdast:[a2()],scope:"local",components:{math:i,inlineMath:i}}}function ym(t){return(t.value??"").replace(/\r\n?|\n/g,t.type==="inlineCode"?" ":`
`)}function u2(t,i){const r=ut(i),o=t.slice(r.start,r.end),s=ym(i),u=[],c=[];if(i.type==="inlineCode"){const x=/^`+/.exec(o)?.[0].length??0;let b=x,w=o.length-x;const E=o.slice(b,w).replace(/\r\n?|\n/g," ");E.startsWith(" ")&&E.endsWith(" ")&&/[^ ]/.test(E)&&(b+=o.slice(b,b+2)===`\r
`?2:1,w-=o.slice(w-2,w)===`\r
`?2:1);for(let A=b;A<w;A++){const k=o[A]==="\r"&&o[A+1]===`
`?2:1;u.push(r.start+A),c.push(r.start+A+k),A+=k-1}return{starts:u,ends:c,exact:u.length===s.length}}const f=[...o.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)].filter(x=>x[0]);let m=/^[ \t]*(?:`{3,}|~{3,})/.test(f[0]?.[0]??"")?1:0,y=!0;const g=s.split(`
`);for(let x=0;x<g.length;x++,m++){const b=f[m],w=g[x],E=(b?.[0]??"").replace(/[\r\n]+$/,""),A=E.endsWith(w)?E.length-w.length:-1;(A<0||!b)&&(y=!1);const k=r.start+(b?.index??o.length)+Math.max(0,A);for(let T=0;T<w.length;T++)u.push(k+T),c.push(k+T+1);x<g.length-1&&(u.push(r.start+(b?.index??0)+E.length),c.push(r.start+(b?.index??0)+(b?.[0].length??E.length)))}return{starts:u,ends:c,exact:y}}const c2=new jw(96),d2={js:"javascript",ts:"typescript",py:"python",sh:"bash",yml:"yaml",md:"markdown",rs:"rust","c++":"cpp",text:"text",txt:"text"};function l0(t={}){function i({node:r,pending:o,renderValue:s}){const u=xt(),c=ym(r),f=String(r.lang??"text").toLowerCase(),p=d2[f]??f,[m,y]=O.useState(null),[g,x]=O.useState(t.eager??!1),b=O.useRef(null);O.useEffect(()=>{if(g)return;if(typeof IntersectionObserver>"u"){x(!0);return}const E=new IntersectionObserver(A=>{A.some(k=>k.isIntersecting)&&(x(!0),E.disconnect())},{root:u.configuration.get().scrollRoot,rootMargin:"400px"});return b.current&&E.observe(b.current),()=>E.disconnect()},[g,u]),O.useEffect(()=>{if(!g||c.length>(t.maxLength??1e5))return;let E=!1,A;const k=setTimeout(()=>{if(p==="text"||t.languages&&!t.languages.includes(p))return;const T=c2.acquire(JSON.stringify([c,p,t.lightTheme,t.darkTheme]),async()=>{const C=await r0(()=>import("./index-Bl2AfEuk.js"),[]);if(!(p in C.bundledLanguages)&&!(p in C.bundledLanguagesAlias))return[];const D=await C.codeToTokens(c,{lang:p,themes:{light:t.lightTheme??"github-light",dark:t.darkTheme??"github-dark"},defaultColor:!1});let z=0;return D.tokens.flatMap((j,L)=>{const I=j.map(q=>{const H=z;return z+=q.content.length,{content:q.content,offset:H,style:q.htmlStyle}});return L<D.tokens.length-1&&I.push({content:`
`,offset:z++}),I})});A=T.release,T.promise.then(C=>{E||y({code:c,tokens:C})}).catch(()=>{})},o?180:0);return()=>{E=!0,clearTimeout(k),A?.()}},[c,p,o,g]);const w=m?.code===c?m.tokens:void 0;return v.jsxs("div",{className:"limr-code-block",ref:b,children:[v.jsxs("div",{className:"limr-code-header","data-limr-ignore":"true",children:[v.jsx("span",{children:f}),v.jsx(yl,{value:c})]}),v.jsx("pre",{className:w?.length?"shiki":void 0,children:v.jsx("code",{children:s(w)})})]})}return{name:"code-highlight",scope:"local",components:{code:i}}}const f2=new Set(["inlineCode","code","math","inlineMath","image","imageReference","html"]),h2=new Set(["definition","footnoteDefinition","annotationDefinition","footnoteReference"]),m2=new Set(["text","paragraph","heading","strong","emphasis","delete","blockquote","list","listItem","link","linkReference","table","tableRow","tableCell","thematicBreak","break","annotationReference"]);function p2(t,i){const r=[];let o=!0;const s=u=>{if(!(u.selection==="atomic"||f2.has(u.type)||h2.has(u.type))){if(!m2.has(u.type)||i[u.type]){o=!1;return}if(u.type==="text"){u.value&&r.push(u);return}u.children?.forEach(s)}};return s(t),o?r:null}function g2(t,i){const r=ut(t),o=t.value??"",s=i.slice(r.start,r.end),u=s===o;let c;const f=()=>c??=lm(s,o,{start:0,end:s.length});return{range:r,atomic:!1,get exact(){return u||f().exact},resolve(p,m){const y=Math.max(0,Math.min(o.length,p));return u?r.start+y:r.start+(m==="start"?f().starts[y]??s.length:f().ends[y-1]??0)}}}function y2(t,i,r){const o=[],s=()=>o.forEach(m=>r.bindings.delete(m)),u=i.map(m=>g2(m,r.document.getSnapshot().source)),c=t.ownerDocument.createTreeWalker(t,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(m){if(m.nodeType===Node.ELEMENT_NODE){const y=m;return y.hasAttribute("data-limr-ignore")||y.hasAttribute("data-limr-text")||r.bindings.get(y)?.atomic?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_SKIP}return NodeFilter.FILTER_ACCEPT}});let f=0,p=0;for(let m=c.nextNode();m;m=c.nextNode()){const y=m.textContent??"";if(!y)continue;const g=[];for(let w=0;w<y.length;){const E=i[f]?.value??"",A=Math.min(y.length-w,E.length-p);if(A<=0||y.slice(w,w+A)!==E.slice(p,p+A))return s(),()=>{};g.push({start:w,end:w+A,offset:p,binding:u[f]}),w+=A,p+=A,p===E.length&&(f++,p=0)}const x=g[0],b=g[g.length-1];r.bindings.set(m,g.length===1&&x.offset===0&&y===i[f-1]?.value?x.binding:{range:{start:x.binding.range.start,end:b.binding.range.end},atomic:!1,get exact(){return g.every(w=>w.binding.exact)},resolve(w,E){const A=g.find(k=>E==="start"?k.end>w:k.end>=w)??b;return A.binding.resolve(A.offset+w-A.start,E)}}),o.push(m)}return s}const $u=t=>t?{"data-limr-block":t.id,"data-source-start":t.range.start,"data-source-end":t.range.end,"data-pending":t.pending||void 0}:{};function Su({occurrence:t}){const i=xt(),r=Ve(i.decorations,m=>m.annotations.get(t.annotationIds[0])),o=Ve(i.interaction,m=>m.active===t.id),s=Ve(i.interaction,m=>m.hovered===t.id),u=Ve(i.configuration,()=>i.annotationTypes.get(r?.type??"citation")),c=u?.icon,f=u?.Marker,p=typeof c=="function"||c&&typeof c=="object"&&!O.isValidElement(c)&&"$$typeof"in c?O.createElement(c):c;return v.jsx("span",{className:"limr-mark-wrap","data-limr-ignore":"true","data-limr-marker":t.id,"data-source-start":t.range.start,"data-source-end":t.range.end,children:v.jsxs("button",{type:"button",ref:m=>i.registerAnchor(t.id,m),className:"limr-mark","data-limr-anchor":t.id,"data-active":o||s||void 0,style:{"--limr-mark-color":u?.color},"aria-label":u?.label??r?.type??"Annotation","aria-expanded":o,onPointerEnter:m=>{m.pointerType!=="touch"&&i.hover(t.id)},onPointerLeave:m=>{m.pointerType!=="touch"&&i.interaction.get().hovered===t.id&&i.interaction.get().hoverSource==="marker"&&i.hover(null)},onFocus:m=>{m.currentTarget.matches(":focus-visible")&&i.hover(t.id)},onBlur:m=>{m.relatedTarget instanceof Element&&m.relatedTarget.closest("[data-occurrence]")?.getAttribute("data-occurrence")===t.id||i.interaction.get().hovered===t.id&&i.interaction.get().hoverSource==="marker"&&i.hover(null)},onClick:()=>{const m=i.interaction.get().hovered===t.id;i.activate(o?null:t.id),m&&i.hover(t.id)},children:[v.jsx("span",{className:"limr-mark-icon",children:f&&r?v.jsx(f,{annotation:r,active:o}):p??"•"}),t.annotationIds.length>1&&v.jsx("span",{className:"limr-mark-count",children:t.annotationIds.length})]})})}function zh({node:t,context:i,mapping:r,marks:o,style:s,className:u}){const{runtime:c}=i,f=t.value??"",p=ut(t),m=c.document.getSnapshot().source,y=O.useMemo(()=>{let k;const T=m.slice(p.start,p.end);return()=>{if(r)return r;if(!k){const C=lm(T,f,{start:0,end:T.length},{escapes:t.verbatimEscapes!==!0});k={starts:C.starts.map(D=>D+p.start),ends:C.ends.map(D=>D+p.start),exact:C.exact}}return k}},[t,r]),g=o??i.marks.get(t)??_w,x=i.highlights.filter(k=>Jt(k.range,p));if(!g.length&&!x.length){const k=!r&&m.slice(p.start,p.end)===f;return v.jsx("span",{style:s,className:u,"data-limr-text":"","data-source-start":p.start,"data-source-end":p.end,ref:T=>{T&&c.bindings.set(T,{range:p,atomic:!1,get exact(){return k||y().exact},resolve:(C,D)=>k?Math.max(p.start,Math.min(p.end,p.start+C)):D==="start"?y().starts[C]??p.end:y().ends[C-1]??p.start})},children:f})}const b=y(),w=new Map,E=new Set([0,f.length]);for(const k of g){let T=b.ends.findIndex(C=>C>=k.range.end);T=T<0?f.length:T+1,E.add(T),w.set(T,[...w.get(T)??[],k])}for(const k of x){const T=b.ends.findIndex(D=>D>k.range.start),C=b.starts.findIndex(D=>D>=k.range.end);E.add(Math.max(0,T)),E.add(C<0?f.length:C)}const A=[...E].sort((k,T)=>k-T);return v.jsx(v.Fragment,{children:A.slice(1).map((k,T)=>{const C=A[T],D={start:b.starts[C]??p.start,end:b.ends[k-1]??p.end},z=x.filter(L=>Jt(L.range,D));let j=f.slice(C,k);for(const L of z)j=v.jsx("mark",{"data-limr-highlight":L.id,"data-hidden":L.hidden||void 0,className:`limr-highlight limr-highlight-${L.style??"background"}`,style:{"--limr-highlight":L.color??"#f3ce7380"},children:j},L.id);return v.jsxs("span",{style:s,className:u,ref:L=>{L&&c.bindings.set(L,{range:D,atomic:!1,exact:b.exact,resolve:(I,q)=>{const H=Math.max(C,Math.min(k,C+I));return q==="start"?b.starts[H]??D.end:b.ends[H-1]??D.start}})},"data-limr-text":"","data-source-start":D.start,"data-source-end":D.end,children:[j,w.get(k)?.map(L=>v.jsx(Su,{occurrence:L},L.id))]},C)})})}function nh({node:t,context:i,tokens:r}){const o=i.runtime.document.getSnapshot().source,s=O.useMemo(()=>u2(o,t),[t]),u=ym(t),c=i.marks.get(t)??_w,f=r?.length?r:[{content:u,offset:0}];return v.jsx(v.Fragment,{children:f.map((p,m)=>{const y=p.offset,g=y+p.content.length,x={starts:s.starts.slice(y,g),ends:s.ends.slice(y,g),exact:s.exact},b={start:x.starts[0]??ut(t).start,end:x.ends.at(-1)??ut(t).end},w={type:"text",value:p.content,position:{start:{offset:b.start,line:0,column:0},end:{offset:b.end,line:0,column:0}}};return v.jsx(zh,{className:p.style?"limr-code-token":void 0,style:p.style,node:w,context:i,mapping:x,marks:c.filter(E=>E.range.end>b.start&&E.range.end<=b.end)},m)})})}function b2({node:t,context:i,children:r,inline:o,blockElement:s}){const u=ut(t),c=Ve(i.runtime.interaction,b=>b.selection?.raw.ranges.some(w=>Jt(w,u))??!1),f=i.highlights.filter(b=>!b.hidden&&Jt(b.range,u)),p=o?"span":"div",m=["image","imageReference"].includes(t.type)||t.type==="component"&&t.name==="img",y=m||!o,g=[...i.marks.get(t)??[],...y?i.afterMarks.get(t)??[]:[]],x=g.map(b=>v.jsx(Su,{occurrence:b},b.id));return v.jsxs(v.Fragment,{children:[v.jsxs(p,{...$u(s),className:`limr-atomic${m?" limr-atomic-image":""}${y?" limr-atomic-corner":""}${f.length?" limr-atomic-highlight":""}`,"data-selected":c||void 0,"data-limr-media":m?"image":void 0,"data-limr-atomic":o?"inline":"block","data-source-start":u.start,"data-source-end":u.end,style:{"--limr-highlight":f[0]?.color??"#f3ce7380"},ref:b=>{b&&i.runtime.bindings.set(b,{range:u,atomic:!0}),s?.ref(b)},children:[r,y&&!!g.length&&v.jsx("span",{className:"limr-corner-marks","data-limr-ignore":"true",children:x})]}),!y&&x]})}function v2({node:t,children:i,runtime:r,blockElement:o}){const s=(()=>{const u=r.document.getSnapshot(),c=t.position?.start.offset??0;let f=0,p=u.headings.length;for(;f<p;){const m=f+p>>>1;u.headings[m].range.start<c?f=m+1:p=m}return u.headings[f]?.range.start===c?u.headings[f].id:void 0})();return O.createElement(`h${t.depth}`,{...$u(o),id:s,ref:u=>{s&&r.registerHeading(s,u),o?.ref(u)}},i)}function Wv({node:t,children:i,image:r}){const o=kl(s=>s.definitions.get(String(t.identifier)));return o?r?v.jsx("img",{src:hn(o.url,!0),alt:String(t.alt??""),title:o.title?String(o.title):void 0,loading:"lazy",decoding:"async"}):v.jsx("a",{href:hn(o.url),title:o.title?String(o.title):void 0,children:i}):v.jsx(v.Fragment,{children:i||String(t.alt??t.label??"")})}function x2({node:t}){const i=xt(),r=String(t.identifier),o=kl(s=>s.footnoteOrder.indexOf(r)+1);return v.jsx("sup",{"data-limr-ignore":"true",children:v.jsx("a",{href:`#${i.document.id}-fn-${encodeURIComponent(r)}`,id:`${i.document.id}-fnref-${ut(t).start}`,"aria-label":`Footnote ${o}`,children:o})})}class w2 extends O.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(i,r){}componentDidUpdate(i){this.state.failed&&i.fallback!==this.props.fallback&&this.setState({failed:!1})}render(){return this.state.failed?v.jsx("pre",{className:"limr-extension-error",children:this.props.fallback}):this.props.children}}function s0(t){return t.type==="component"&&!t.inline||["math","code","list","table","blockquote"].includes(t.type)||(t.children?.some(s0)??!1)}function ku(t,i,r=0,o){const{runtime:s}=i;if(t.type==="text"&&i.compact)return t.value??"";const u=t===i.block.node?i.blockElement:void 0,c=`${t.type}-${t.position?.start.offset??r}-${r}`,f=t.type==="list"?{...i,tightList:!t.spread}:i,p=(A,k)=>{let T=-1;return A.forEach((C,D)=>{["definition","footnoteDefinition","annotationDefinition"].includes(C.type)||(T=D)}),T<0&&k?.trailing?[v.jsx(O.Fragment,{children:k.trailing},"trailing")]:A.map((C,D)=>ku(C,f,D,D===T?k?.trailing:void 0))},m=t.type==="table"?[]:t.type==="listItem"&&i.tightList?(t.children??[]).flatMap((A,k)=>A.type==="paragraph"?p(A.children??[]):ku(A,i,k)):p(t.children??[]),y=s.components[t.type==="component"?t.name??"":t.type];let g;if(y){const A=ut(t),k=T=>{const C=t.attributeNodes?.[T];if(!C)return String(t.attributes?.[T]??"");const D=ut(C);return v.jsx(zh,{node:C,context:i,marks:i.occurrences.filter(z=>z.range.end>D.start&&z.range.end<=D.end)})};g=v.jsx(w2,{fallback:s.document.getSnapshot().source.slice(A.start,A.end),children:v.jsx(y,{node:t,children:m,pending:i.block.pending,source:s.document.getSnapshot().source.slice(A.start,A.end),renderChildren:p,renderValue:T=>v.jsx(nh,{node:t,context:i,tokens:T}),renderAttribute:k})},c)}else switch(t.type){case"text":return v.jsxs(O.Fragment,{children:[i.compact?t.value??"":v.jsx(zh,{node:t,context:i}),o]},c);case"paragraph":g=s0(t)?v.jsxs("div",{className:"limr-paragraph",children:[m,o]}):v.jsxs("p",{children:[m,o]}),o=void 0;break;case"heading":return v.jsxs(v2,{node:t,runtime:s,blockElement:u,children:[m,o]},c);case"strong":g=v.jsx("strong",{children:m});break;case"emphasis":g=v.jsx("em",{children:m});break;case"delete":g=v.jsx("del",{children:m});break;case"inlineCode":g=v.jsx("code",{className:"limr-inline-code","data-limr-inline-syntax":"","data-source-start":ut(t).start,"data-source-end":ut(t).end,children:v.jsx(nh,{node:t,context:i})});break;case"code":g=v.jsx("pre",{children:v.jsx("code",{children:v.jsx(nh,{node:t,context:i})})});break;case"math":case"inlineMath":g=v.jsx("code",{children:t.value});break;case"blockquote":g=v.jsxs("blockquote",{className:"limr-note",children:[v.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:s.locale.note}),v.jsx("div",{className:"limr-block-content",children:m})]});break;case"list":g=t.ordered?v.jsx("ol",{start:Number(t.start??1),children:m}):v.jsx("ul",{children:m});break;case"listItem":g=v.jsxs("li",{className:typeof t.checked=="boolean"?"limr-task-item":void 0,children:[typeof t.checked=="boolean"&&v.jsx("input",{type:"checkbox",checked:t.checked,disabled:!0,"aria-label":"Task"}),m]});break;case"link":g=v.jsx("a",{href:hn(t.url),title:t.title?String(t.title):void 0,children:m});break;case"image":g=v.jsx("img",{src:hn(t.url,!0),alt:String(t.alt??""),title:t.title?String(t.title):void 0,loading:"lazy",decoding:"async"});break;case"linkReference":g=v.jsx(Wv,{node:t,image:!1,children:m});break;case"imageReference":g=v.jsx(Wv,{node:t,image:!0,children:m});break;case"thematicBreak":g=v.jsx("hr",{});break;case"break":g=v.jsx("br",{});break;case"table":{const A=t.children??[],k=t.align;g=v.jsx("div",{className:"limr-table-scroll",children:v.jsxs("table",{children:[v.jsx("thead",{children:A.slice(0,1).map((T,C)=>v.jsx("tr",{children:T.children?.map((D,z)=>v.jsx("th",{style:{textAlign:k?.[z]},children:p(D.children??[])},z))},C))}),v.jsx("tbody",{children:A.slice(1).map((T,C)=>v.jsx("tr",{children:T.children?.map((D,z)=>v.jsx("td",{style:{textAlign:k?.[z]},children:p(D.children??[])},z))},C))})]})});break}case"definition":case"footnoteDefinition":case"annotationDefinition":return null;case"footnoteReference":return v.jsxs(O.Fragment,{children:[v.jsx(x2,{node:t}),o]},c);case"annotationReference":{const A=t.inline?"span":"div";g=v.jsxs(A,{children:[m,v.jsx(Su,{occurrence:{id:`${s.document.id}-ref-${ut(t).start}`,range:ut(t),annotationIds:t.annotationIds,embedded:!0}})]});break}case"html":g=v.jsx("span",{className:"limr-literal",children:t.value});break;case"component":g=m;break;default:g=m.length?m:t.value??null}const x=t.selection==="atomic"||["math","inlineMath","image","imageReference","html"].includes(t.type),w=x&&(!t.inline&&!["inlineCode","inlineMath","html"].includes(t.type)||["image","imageReference"].includes(t.type)||t.name==="img")?void 0:i.afterMarks.get(t),E=A=>w?.length||o?v.jsxs(O.Fragment,{children:[A,w?.map(k=>v.jsx(Su,{occurrence:k},k.id)),o]},c):A;if(x)return E(v.jsx(b2,{node:t,context:i,blockElement:u,inline:t.inline||["inlineCode","inlineMath","image","imageReference","html"].includes(t.type),children:g},c));if(u){const A={...$u(u),ref:u.ref};return E(O.isValidElement(g)&&typeof g.type=="string"?O.cloneElement(g,{...A,key:c}):v.jsx("div",{...A,children:g},c))}return E(O.isValidElement(g)?O.cloneElement(g,{key:c}):v.jsx(O.Fragment,{children:g},c))}const u0=O.memo(function({block:i,runtime:r,components:o,extensions:s,decorations:u,footnoteId:c}){const f=O.useRef(null),p=O.useRef(void 0),{occurrences:m}=u,y=O.useMemo(()=>u.highlights.filter(T=>!T.occurrenceId),[u.highlights]),g=O.useMemo(()=>c?{...i.node,type:"listItem"}:i.node,[i,c]),x=O.useMemo(()=>p2(g,r.components),[g,r,o,s]),b=!!x&&!m.length&&!y.length,w=O.useCallback(T=>{p.current?.(),p.current=void 0,f.current&&r.textBinders.delete(f.current),f.current&&f.current!==T&&r.unobserveBlock(f.current),f.current=T,r.observeBlock(T),T&&b&&x.length&&r.textBinders.set(T,()=>{p.current=y2(T,x,r)})},[r,b,x]),{marks:E,afterMarks:A}=O.useMemo(()=>{const T=new Map,C=new Map;if(!m.length)return{marks:T,afterMarks:C};const D=[],z=[],j=new Map,L=new Set(["strong","emphasis","delete","link","linkReference","inlineCode","code","math","inlineMath","image","imageReference","html"]);function I(q,H=[]){q.attributeNodes&&z.push(...Object.values(q.attributeNodes));const Z=[...H,q];q.selection==="atomic"||["text","inlineCode","code","math","inlineMath","image","imageReference","html"].includes(q.type)?(D.push(q),j.set(q,Z)):q.children?.forEach(oe=>I(oe,Z))}I(i.node);for(const q of m){const H=[...D].reverse().find(oe=>ut(oe).start<q.range.end)??D[0];if(!(!(H&&(["image","imageReference"].includes(H.type)||H.name==="img")&&ut(H).end>=q.range.end)&&z.some(oe=>{const ue=ut(oe);return q.range.end>ue.start&&q.range.end<=ue.end}))&&H){const oe=j.get(H)?.find(N=>(L.has(N.type)||N.selection==="atomic")&&ut(N).end<=q.range.end),ue=oe?C:T,$=oe??H;ue.set($,[...ue.get($)??[],q])}}return{marks:T,afterMarks:C}},[i,m]);if(!c&&["definition","footnoteDefinition","annotationDefinition"].includes(i.node.type))return null;const k={runtime:r,block:i,marks:E,afterMarks:A,highlights:y,occurrences:m,compact:b,blockElement:{id:i.id,range:i.range,pending:i.pending,ref:w}};return c?v.jsx("li",{id:`${r.document.id}-fn-${encodeURIComponent(c)}`,...$u(k.blockElement),ref:w,children:i.node.children?.map((T,C)=>ku(T,{...k,blockElement:void 0},C))}):ku(i.node,k)});function S2(){const t=xt(),i=kl(c=>c),r=Ve(t.configuration,c=>c.components),o=Ve(t.configuration,c=>c.extensions),s=Ve(t.decorations,c=>c.byBlock),u=O.useMemo(()=>new Map(i.blocks.filter(c=>c.node.type==="footnoteDefinition").map(c=>[String(c.node.identifier),c])),[i.blocks]);return i.footnoteOrder.length?v.jsxs("section",{className:"limr-footnotes","aria-label":t.locale.footnotes,children:[v.jsx("hr",{}),v.jsx("ol",{children:i.footnoteOrder.map(c=>{const f=i.footnotes.get(c);if(!f)return null;const p=u.get(c)??{id:`${i.id}-fn-${c}`,range:ut(f),node:f,pending:!1};return v.jsx(u0,{block:p,runtime:t,components:r,extensions:o,footnoteId:c,decorations:s.get(p.id)??sm},c)})})]}):null}function ex(t,i){const r=t.closest("pre,p,figcaption,li,th,td,h1,h2,h3,h4,h5,h6,.limr-choice-text,.limr-definition-title,.limr-question-title,.limr-block-content");return r&&i.contains(r)?r:t.closest("[data-limr-block]")??i}function Au(t,i){i.prepareTextBindings(t);const r=[],o=(s,u)=>{if(s instanceof HTMLElement){if(s!==t&&s.hasAttribute("data-limr-document")||s.hasAttribute("inert"))return;const c=s.dataset.limrMarker,f=s.dataset.limrAtomic;if(c||f){const m=s.dataset.limrMedia==="image";r.push({node:s,kind:c?"marker":m?"image":f==="block"?"block":"inline",range:{start:Number(s.dataset.sourceStart),end:Number(s.dataset.sourceEnd)},flow:m?s:ex(s,i.content),offset:0});return}if(s.hasAttribute("data-limr-ignore"))return;const p=i.bindings.get(s);p&&(u={binding:p,offset:0})}if(s.nodeType===Node.TEXT_NODE){const c=i.bindings.get(s)??u?.binding,f=i.bindings.has(s)?0:u?.offset??0,p=s.textContent?.length??0;c?.resolve&&p&&r.push({node:s,kind:"text",range:{start:c.resolve(f,"start"),end:c.resolve(f+p,"end")},flow:ex(s.parentElement,i.content),binding:c,offset:f}),u&&(u.offset+=p);return}s.childNodes.forEach(c=>o(c,u))};return o(t),r}function bm(t,i,r){const o=t.node,s=o.length,u=t.binding.resolve;let c=0,f=s;for(;c<f;){const g=c+f>>>1;u(t.offset+g+1,"end")<=i.start?c=g+1:f=g}let p=c;for(c=p,f=s;c<f;){const g=c+f>>>1;u(t.offset+g,"start")<i.end?c=g+1:f=g}if(p===c)return null;let m=c;const y=document.createRange();if(r&&m-p>1024&&(y.setStart(o,p),y.setEnd(o,m),y.getBoundingClientRect().height>r.bottom-r.top+80)){for(c=p,f=m;c<f;){const x=c+f>>>1;y.setStart(o,x),y.setEnd(o,x+1),y.getBoundingClientRect().bottom<r.top?c=x+1:f=x}for(p=c,f=m;c<f;){const x=c+f>>>1;y.setStart(o,x),y.setEnd(o,x+1),y.getBoundingClientRect().top<=r.bottom?c=x+1:f=x}m=c}return p===m?null:(y.setStart(o,p),y.setEnd(o,m),y)}function k2(t,i){for(const r of t.document.getSnapshot().blocks){if(!Jt(r.range,i))continue;const o=t.blocks.get(r.id);if(o){for(const s of Au(o,t))if(!(s.kind==="marker"||!Jt(s.range,i)))if(s.kind==="text"){const u=bm(s,i);if(!u)continue;const c=s.node,f=u.endOffset;for(let p=u.startOffset;p<f;){const m=Math.min(f,p+(c.data.codePointAt(p)>65535?2:1));u.setStart(c,p),u.setEnd(c,m);const y=u.getBoundingClientRect();if(y.width&&y.height)return y;p=m}}else{const u=s.node,c=(u.querySelector(s.kind==="image"?"img":"[data-limr-selection-surface]")??u).getBoundingClientRect();if(c.width&&c.height)return c}}}return null}function A2(t,i,r){if(![...t.content.querySelectorAll('[data-limr-selection-order="visual"]')].some(g=>i.intersectsNode(g)))return;const o=[...t.blocks.values()].filter(g=>i.intersectsNode(g));o.sort((g,x)=>g.compareDocumentPosition(x)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);const s=o.flatMap(g=>Au(g,t)).filter(g=>g.kind!=="marker"),u=[];for(const g of s){if(!i.intersectsNode(g.node))continue;if(g.kind!=="text"){u.push(g.range);continue}const x=g.node,b=i.startContainer===x?i.startOffset:0,w=i.endContainer===x?i.endOffset:x.length;b<w&&u.push({start:g.binding.resolve(g.offset+b,"start"),end:g.binding.resolve(g.offset+w,"end")})}if(!u.length)return;const c=s.map(g=>g.range).sort((g,x)=>g.end-x.end),f=[];for(const g of u){const x=f.at(-1);let b=0,w=c.length;if(x)for(;b<w;){const E=b+w>>>1;c[E].end<=x.end?b=E+1:w=E}x&&g.start>=x.end&&(!c[b]||c[b].start>=g.start)?x.end=g.end:f.push({...g})}const p=t.document.getSnapshot(),m=f.map(g=>Gu(p,g,r)),y=g=>{const x=new Set,b=m.flatMap(w=>w[g].ranges).filter(w=>{const E=`${w.start}:${w.end}`;return x.has(E)?!1:(x.add(E),!0)});return{ranges:b,sourceText:b.map(w=>p.source.slice(w.start,w.end)).join(`

`)}};return{...m[0],raw:y("raw"),syntax:y("syntax"),blocks:y("blocks")}}function T2(t,i){O.useEffect(()=>{const r=t.content;if(!r||!i)return;let o=0,s=!1,u;function c(g,x,b){let w=g.nodeType===Node.ELEMENT_NODE?g:g.parentElement;if(!w||w.closest("[data-limr-document]")!==r||w.closest("[data-limr-ignore]"))return null;t.prepareTextBindings(w);const E=g.nodeType===Node.TEXT_NODE?t.bindings.get(g):void 0;if(E?.resolve)return{offset:E.resolve(x,b),atomic:!1,exact:E.exact!==!1};for(;w&&w!==r;){const C=t.bindings.get(w);if(C){if(C.atomic)return{offset:b==="start"?C.range.start:C.range.end,atomic:!0,exact:!0};const D=document.createRange();D.setStart(w,0);try{D.setEnd(g,x)}catch{return null}const z=D.toString().length;return{offset:C.resolve?.(z,b)??(b==="start"?C.range.start:C.range.end),atomic:!1,exact:C.exact!==!1}}w=w.parentElement}const A=g.nodeType===Node.ELEMENT_NODE?Array.from(g.childNodes):[],k=b==="start"?A.slice(x):A.slice(0,x).reverse(),T=C=>{if(C.nodeType===Node.TEXT_NODE&&C.textContent)return c(C,b==="start"?0:C.textContent.length,b);if(C instanceof Element){if(C.hasAttribute("data-limr-ignore")||C.hasAttribute("inert"))return null;const z=t.bindings.get(C);if(z?.atomic)return{offset:b==="start"?z.range.start:z.range.end,atomic:!0,exact:!0}}const D=Array.from(C.childNodes);b==="end"&&D.reverse();for(const z of D){const j=T(z);if(j)return j}return null};for(const C of k){const D=T(C);if(D)return D}return null}function f(){if(o=0,!s&&document.activeElement instanceof Element&&document.activeElement.closest("[data-limr-selection-ui]"))return;const g=window.getSelection();if(!g||g.isCollapsed||!g.rangeCount){(!(document.activeElement instanceof Element)||!document.activeElement.closest("[data-limr-selection-ui]"))&&(u=void 0,t.selectionRange=null,t.updateInteraction({selection:null}));return}const x=g.getRangeAt(0),b=t.document.getSnapshot().revision;if(t.interaction.get().selection&&u?.startNode===x.startContainer&&u.start===x.startOffset&&u.endNode===x.endContainer&&u.end===x.endOffset&&u.revision===b&&u.settled===!s)return;const w=c(x.startContainer,x.startOffset,"start"),E=c(x.endContainer,x.endOffset,"end");if(!w||!E){u=void 0,t.selectionRange=null,t.updateInteraction({selection:null});return}u={startNode:x.startContainer,start:x.startOffset,endNode:x.endContainer,end:x.endOffset,revision:b,settled:!s},t.selectionRange=x.cloneRange(),t.highlightReference=null;const A={text:g.toString(),settled:!s,quality:!w.exact||!E.exact?"unmapped":w.atomic||E.atomic?"atomic":"exact"};t.updateInteraction({activeHighlight:null,selection:A2(t,x,A)??Gu(t.document.getSnapshot(),{start:w.offset,end:E.offset},A)})}const p=()=>{o||(o=requestAnimationFrame(f))},m=()=>{s=!0},y=()=>{s=!1,p()};return document.addEventListener("selectionchange",p),r.addEventListener("pointerdown",m),document.addEventListener("pointerup",y),document.addEventListener("pointercancel",y),document.addEventListener("keyup",p),window.getSelection()?.isCollapsed===!1&&p(),()=>{cancelAnimationFrame(o),document.removeEventListener("selectionchange",p),r.removeEventListener("pointerdown",m),document.removeEventListener("pointerup",y),document.removeEventListener("pointercancel",y),document.removeEventListener("keyup",p)}},[t,i])}function E2(t,i,r,o){const s=[],u=(w,E,A)=>{const k=o(w.flow),T=o(A?.element??(w.kind==="text"?w.node.parentElement:w.flow)),C=A?A.rect.top+T.ascent:w.kind==="text"?E.top+T.ascent:E.bottom-k.descent;return{left:E.left,top:C-k.ascent,width:E.width,height:k.height,baseline:C,flow:w.flow}},c=(w,E)=>{for(let A=w+E;A>=0&&A<t.length;A+=E){const k=t[A];if(k.flow!==t[w].flow)return;if(k.kind==="text"){const T=k.node.textContent??"";if(T.trim())return k;if(!T.includes(`
`))continue}if(k.kind!=="marker")return}},f=(w,E)=>{const A=w.node,k=document.createRange(),T=E==="first"?0:Math.max(0,A.length-1);return k.setStart(A,T),k.setEnd(A,Math.min(A.length,T+1)),k.getBoundingClientRect()},p=(w,E)=>{const A=c(w,-1),k=c(w,1),T=[A&&{rect:f(A,"last"),element:A.node.parentElement},k&&{rect:f(k,"first"),element:k.node.parentElement}].filter(D=>!!D);T.sort((D,z)=>Math.abs(D.rect.bottom-E.bottom)-Math.abs(z.rect.bottom-E.bottom));const C=T[0];return C&&Math.abs(C.rect.bottom-E.bottom)<Math.max(E.height,C.rect.height)?C:void 0};let m=0,y=t.length;if(t.length>80&&t[0].flow.tagName==="PRE"&&t.at(-1)?.flow===t[0].flow){const w=k=>{const T=t[k];if(T.kind!=="text")return T.node.getBoundingClientRect();const C=document.createRange();return C.selectNodeContents(T.node),C.getBoundingClientRect()};let E=0,A=t.length;for(;E<A;){const k=E+A>>>1;w(k).bottom<r.top?E=k+1:A=k}for(m=E,A=t.length;E<A;){const k=E+A>>>1;w(k).top<=r.bottom?E=k+1:A=k}y=E}for(let w=m;w<y;w++){const E=t[w];if(E.kind==="marker"){const A=c(w,-1),k=c(w,1);if(!A||!k||i.start>=A.range.end||i.end<=k.range.start)continue;const T=E.node.getBoundingClientRect();if(!T.width||!T.height||T.bottom<r.top||T.top>r.bottom)continue;const C=u(E,T,p(w,T));s.push({...C,marker:E.node.dataset.limrMarker})}else if(Jt(E.range,i))if(E.kind==="text"){const A=bm(E,i,r),k=E.node.parentElement?.closest("[data-limr-inline-syntax]"),T=k?Array.from(k.getClientRects()):[],C=k&&getComputedStyle(k);for(const D of A?.getClientRects()??[])if(D.width&&D.height&&D.bottom>=r.top&&D.top<=r.bottom){const z=u(E,D),j=T[0],L=T.at(-1);k&&C&&j&&i.start<=Number(k.dataset.sourceStart)&&Math.abs(j.top-D.top)<D.height&&Math.abs(D.left-j.left-parseFloat(C.paddingLeft))<1&&(z.width+=z.left-j.left,z.left=j.left),k&&C&&L&&i.end>=Number(k.dataset.sourceEnd)&&Math.abs(L.top-D.top)<D.height&&Math.abs(L.right-parseFloat(C.paddingRight)-D.right)<1&&(z.width=L.right-z.left),s.push(z)}}else{const A=E.node,k=E.kind==="image"?A.querySelector("img")??A:E.kind==="block"?A.querySelector("[data-limr-selection-surface]")??A:A,T=k.getBoundingClientRect();if(!T.width||!T.height||T.bottom<r.top||T.top>r.bottom)continue;if(E.kind==="block"||E.kind==="image")s.push({left:T.left,top:T.top,width:T.width,height:T.height,atomic:!0,image:E.kind==="image",baseline:T.bottom,flow:E.kind==="image"?A:k,radius:getComputedStyle(k).borderRadius});else{const C=u(E,T,p(w,T));s.push({...C,atomic:!0})}}}const g=new Map,x=s.map(w=>{if(w.image||w.atomic&&w.height>o(w.flow).height*1.5)return w;let E=g.get(w.flow);E||(E=new Map,g.set(w.flow,E));const A=Math.floor(w.baseline/3);let k=[E.get(A),E.get(A-1),E.get(A+1)].find(T=>T&&Math.abs(T.baseline-w.baseline)<3);return k||(k=w,E.set(A,k)),{...w,top:k.top,height:k.height}}),b=[];for(let w=1;w<x.length;w++){const E=x[w-1],A=x[w],k=A.left-E.left-E.width;E.flow===A.flow&&Math.abs(E.top-A.top)<.5&&k>.1&&k<E.height*.6&&b.push({left:E.left+E.width,top:E.top,width:k,height:E.height,flow:E.flow})}return[...x,...b]}function C2({runtime:t,interactive:i=!0}){const r=O.useRef(null);return O.useEffect(()=>{const o=t.content,s=r.current;if(!o||!s)return;let u=0,c=!1,f=new WeakMap,p=new WeakMap;const m=new Map;let y,g=t.document.getSnapshot(),x=t.interaction.get().selection,b=t.decorations.get().byBlock,w=t.interaction.get().hoveredHighlight,E=t.interaction.get().activeHighlight,A=t.interaction.get().active,k=t.interaction.get().hovered;const T=new Map;let C=[];const D=ee=>[...T.values()].flatMap(pe=>Array.from(pe.children).filter(ge=>ge.dataset.paint===ee).map(ge=>ge.getBoundingClientRect())),z=()=>{const ee=t.interaction.get(),pe=t.decorations.get();return pe.referenceRanges.get(ee.hovered??"")??(ee.activeHighlight?pe.highlights.get(ee.activeHighlight)?.range:void 0)??pe.referenceRanges.get(ee.active??"")},j=ee=>{const pe=t.interaction.get(),ge=t.decorations.get();if(ee===pe.hovered)return!0;if(ee!==pe.active)return!1;const ke=ge.highlights.get(`reference-${pe.hovered}`);return!ke?.occurrenceId||!pi(ke.range,ge.referenceRanges.get(ee))},L=()=>{const ee=t.interaction.get(),pe=t.decorations.get(),ge=z();for(const ke of T.values())for(const le of ke.children){le.toggleAttribute("data-hovered",le.dataset.paint===ee.hoveredHighlight);const se=pe.highlights.get(le.dataset.paint??"");if(se?.occurrenceId){const ve=j(se.occurrenceId);le.toggleAttribute("data-active",ve),le.toggleAttribute("data-muted",!ve);continue}le.toggleAttribute("data-active",le.dataset.paint===ee.activeHighlight||!!ge&&!!se&&pi(ge,se.range)),le.toggleAttribute("data-muted",!!se?.hidden||!!ge&&!!se&&!pi(ge,se.range))}},I=(ee,pe)=>{pe.remove(),delete ee.dataset.limrHighlightHost,delete ee.dataset.limrHighlightPosition,T.delete(ee)},q=document.createElement("canvas"),H=q.getContext("2d"),Z=ee=>{const pe=p.get(ee);if(pe)return pe;const ge=getComputedStyle(ee),ke=parseFloat(ge.fontSize),le=parseFloat(ge.lineHeight)||ke*1.5,se=`${ge.fontStyle} ${ge.fontWeight} ${ke}px ${ge.fontFamily}`,ve=`${se}/${le}`;let Ce=m.get(ve);if(!Ce){H&&(H.font=se);const Me=H?.measureText("Mg"),ce=Me?.fontBoundingBoxAscent??ke*.9,xe=Me?.fontBoundingBoxDescent??ke*.25,Ne=Math.min(ce+xe,le-.5);Ce={ascent:ce-Math.max(0,ce+xe-Ne)/2,descent:xe,height:Ne},m.set(ve,Ce)}return p.set(ee,Ce),Ce},oe=()=>{s.childNodes.length&&s.replaceChildren();for(const[ee,pe]of T)I(ee,pe);C=[]},ue=()=>{cancelAnimationFrame(u),u=0;const ee=t.interaction.get().selection?.raw.ranges??[],pe=t.decorations.get().byBlock;if(!ee.length&&![...pe.values()].some(me=>me.highlights.length)){oe();return}const ge=t.document.getSnapshot();if(ge!==g&&(g=ge,y=void 0),!y){const me=new Map(ge.blocks.filter(V=>V.node.type==="footnoteDefinition").map(V=>[String(V.node.identifier),V]));y=[...ge.blocks.filter(V=>V.node.type!=="footnoteDefinition"),...ge.footnoteOrder.flatMap(V=>{const R=me.get(V),we=ge.footnotes.get(V);return R?[R]:we?[{id:`${ge.id}-fn-${V}`,range:{start:we.position.start.offset,end:we.position.end.offset}}]:[]})].flatMap(V=>{const R=t.blocks.get(V.id);return R?[{element:R,range:V.range,id:V.id}]:[]})}const ke=window.visualViewport,le={top:ke?.offsetTop??0,bottom:(ke?.offsetTop??0)+(ke?.height??window.innerHeight),left:ke?.offsetLeft??0,right:(ke?.offsetLeft??0)+(ke?.width??window.innerWidth)},se=t.configuration.get().scrollRoot;if(se){const me=se.getBoundingClientRect();le.top=Math.max(le.top,me.top+se.clientTop),le.bottom=Math.min(le.bottom,me.top+se.clientTop+se.clientHeight),le.left=Math.max(le.left,me.left+se.clientLeft),le.right=Math.min(le.right,me.left+se.clientLeft+se.clientWidth)}let ve=0,Ce=y.length;for(;ve<Ce;){const me=ve+Ce>>>1;y[me].element.getBoundingClientRect().bottom<le.top-32?ve=me+1:Ce=me}const Me=o.getBoundingClientRect();le.top=Math.max(le.top,Me.top),le.bottom=Math.min(le.bottom,Me.bottom);const ce=o.scrollLeft,xe=o.scrollTop,Ne=[],Be=new Map,X=me=>{const je=Be.get(me);if(je)return je;const V={...le};for(let R=me;R&&R!==o;R=R.parentElement){const we=getComputedStyle(R),De=R.getBoundingClientRect();/hidden|clip|auto|scroll/.test(we.overflowX)&&(V.left=Math.max(V.left,De.left+R.clientLeft),V.right=Math.min(V.right,De.left+R.clientLeft+R.clientWidth)),/hidden|clip|auto|scroll/.test(we.overflowY)&&(V.top=Math.max(V.top,De.top+R.clientTop),V.bottom=Math.min(V.bottom,De.top+R.clientTop+R.clientHeight))}return Be.set(me,V),V};for(let me=ve;me<y.length;me++){const je=y[me];if(je.element.getBoundingClientRect().top>le.bottom+32)break;const V=[...pe.get(je.id)?.highlights??[]];for(const we of ee)Jt(we,je.range)&&V.push({id:"selection",range:we,selection:!0});if(!V.length)continue;let R=f.get(je.element);R||(R=Au(je.element,t),f.set(je.element,R));for(const we of V){const De=E2(R,we.range,{top:le.top-32,bottom:le.bottom+32},Z);for(const ze of De){const Fe=X(ze.flow),qe=Math.max(ze.left,Fe.left),tt=Math.max(ze.top,Fe.top),St=Math.min(ze.left+ze.width,Fe.right)-qe,ht=Math.min(ze.top+ze.height,Fe.bottom)-tt;St<=0||ht<=0||Ne.push({rect:{...ze,left:qe-Me.left+ce,top:tt-le.top,width:St,height:ht},task:we})}}}s.style.top=`${le.top-Me.top+xe}px`,s.style.height=`${Math.max(0,le.bottom-le.top)}px`;const Le=new Map;for(const{rect:me,task:je}of Ne)if(!je.selection&&!Le.has(me.flow)){const V=me.flow,R=V.getBoundingClientRect();Le.set(V,{box:R,top:Math.max(le.top,R.top)-R.top-V.clientTop+V.scrollTop,positioned:getComputedStyle(V).position!=="static"})}const ie=new Map,ye=[];Ne.forEach(({rect:me,task:je})=>{let V=s,R=me.left,we=me.top;if(!je.selection){const tt=me.flow,St=Le.get(tt);let ht=T.get(tt);ht||(ht=document.createElement("span"),ht.className="limr-highlight-layer",ht.dataset.limrIgnore="true",ht.setAttribute("aria-hidden","true"),tt.dataset.limrHighlightHost="true",St.positioned||(tt.dataset.limrHighlightPosition="true"),tt.append(ht),T.set(tt,ht)),ht.style.top=`${St.top}px`,ht.style.height=`${Math.max(0,Math.min(le.bottom,St.box.bottom)-Math.max(le.top,St.box.top))}px`,V=ht,R+=Me.left-St.box.left-tt.clientLeft+tt.scrollLeft,we+=le.top-St.box.top-tt.clientTop+tt.scrollTop-St.top,ye.push({id:je.id,rect:{left:me.left+Me.left-ce,top:me.top+le.top,width:me.width,height:me.height}})}const De=ie.get(V)??0;ie.set(V,De+1);const ze=V.children[De]??document.createElement("span"),Fe=`limr-paint-rect limr-paint-${je.selection?"selection":je.style??"background"}`;ze.className!==Fe&&(ze.className=Fe),ze.dataset.paint=je.id,ze.toggleAttribute("data-reference",!!je.occurrenceId),me.marker?ze.dataset.marker=me.marker:delete ze.dataset.marker,me.atomic?ze.dataset.atomic="true":delete ze.dataset.atomic,me.image?ze.dataset.media="image":delete ze.dataset.media;const qe=`left:${R}px;top:${we}px;width:${me.width}px;height:${me.height}px;border-radius:${me.radius??"0"};`;if(ze.dataset.geometry!==qe&&(ze.style.cssText=qe,ze.dataset.geometry=qe),je.selection||ze.style.setProperty("--limr-highlight",je.color??"#F2C744"),je.occurrenceId){const tt=j(je.occurrenceId);ze.toggleAttribute("data-active",tt),ze.toggleAttribute("data-muted",!tt)}ze.parentNode||V.append(ze)});for(const me of[s,...T.values()])for(;me.children.length>(ie.get(me)??0);)me.lastChild.remove();for(const[me,je]of T)ie.has(je)||I(me,je);C=ye;const Ae=t.interaction.get().activeHighlight;Ae&&!C.some(me=>me.id===Ae)&&t.clearSelection(),L(),c&&(c=o.getAnimations().some(me=>me instanceof CSSTransition&&me.transitionProperty==="translate"&&me.playState==="running"),c&&$())},$=()=>{u||(u=requestAnimationFrame(ue))},N=ee=>{ee.target!==o||ee.propertyName!=="translate"||(c=!0,$())};o.addEventListener("transitionrun",N),o.addEventListener("transitionend",N),o.addEventListener("transitioncancel",N);const P=()=>{y=void 0,p=new WeakMap,$()},K=()=>{m.clear(),P()},J=[t.interaction.subscribe(()=>{const ee=t.interaction.get(),pe=ee.selection;(ee.hoveredHighlight!==w||ee.activeHighlight!==E||ee.active!==A||ee.hovered!==k)&&(w=ee.hoveredHighlight,E=ee.activeHighlight,A=ee.active,k=ee.hovered,L()),pe!==x&&(x=pe,ue())}),t.decorations.subscribe(()=>{const ee=t.decorations.get().byBlock;ee!==b&&(b=ee,f=new WeakMap,$())}),t.layout.subscribe(P),t.documentOffset.subscribe($),t.configuration.subscribe(P)],be=new MutationObserver(ee=>{let pe=!1;for(const ge of ee){const ke=ge.target instanceof Element?ge.target:ge.target.parentElement;if(!ke||ke===s||s.contains(ke)||ke.closest(".limr-highlight-layer")||ge.type==="childList"&&[...ge.addedNodes,...ge.removedNodes].every(se=>se instanceof Element&&se.classList.contains("limr-highlight-layer")))continue;const le=ke.closest("[data-limr-block]");le?f.delete(le):y=void 0,pe=!0}pe&&(p=new WeakMap,$())});be.observe(o,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["class","style","inert","open","data-limr-theme","data-limr-justify"]});const _=()=>{t.hoverHighlight(null),$()};document.addEventListener("scroll",_,{capture:!0,passive:!0}),window.visualViewport?.addEventListener("resize",$),window.visualViewport?.addEventListener("scroll",$),document.fonts?.addEventListener("loadingdone",K);const He=ee=>{const pe=ee.target instanceof Element?ee.target:null;if(!pe||pe.closest("[data-limr-document]")!==o||pe.closest("button,input,textarea,select,[contenteditable],[data-limr-ignore]"))return null;const ge=z(),ke=t.decorations.get();for(let le=C.length-1;le>=0;le--){const{rect:se,id:ve}=C[le],Ce=ke.highlights.get(ve);if(!(Ce?.occurrenceId||Ce?.hidden||ge&&Ce&&!pi(ge,Ce.range))&&ee.clientX>=se.left&&ee.clientX<=se.left+se.width&&ee.clientY>=se.top&&ee.clientY<=se.top+se.height)return ve}return null},Ee=ee=>{ee.buttons||t.hoverHighlight(He(ee))},B=()=>t.hoverHighlight(null);let U=null;const ne=ee=>{U={x:ee.clientX,y:ee.clientY}},he=ee=>{if(ee.defaultPrevented||ee.button!==0||ee.metaKey||ee.ctrlKey||ee.shiftKey||ee.altKey||!U||Math.hypot(ee.clientX-U.x,ee.clientY-U.y)>4||window.getSelection()?.isCollapsed===!1)return;const pe=He(ee);if(!pe)return;ee.preventDefault();const ge=t.decorations.get().highlights.get(pe),ke=[];let le=!1;for(const se of t.document.getSnapshot().blocks){if(!Jt(se.range,ge.range))continue;const ve=t.blocks.get(se.id);if(!ve)continue;const Ce=[];for(const Me of Au(ve,t)){if(!Jt(Me.range,ge.range)||Me.kind==="marker")continue;if(Me.kind!=="text"){le=!0;continue}const ce=bm(Me,ge.range,{top:-1/0,bottom:1/0});ce&&Ce.push(ce.toString())}Ce.length&&ke.push(Ce.join(""))}t.highlightReference={text:!le&&ke.length?ke.join(`

`):void 0,getClientRects:()=>D(pe),getBoundingClientRect:()=>{const se=D(pe);if(!se.length)return new DOMRect;const ve=Math.min(...se.map(Me=>Me.left)),Ce=Math.min(...se.map(Me=>Me.top));return new DOMRect(ve,Ce,Math.max(...se.map(Me=>Me.right))-ve,Math.max(...se.map(Me=>Me.bottom))-Ce)}},t.activateHighlight(pe)};return i&&(o.addEventListener("pointermove",Ee),o.addEventListener("pointerleave",B),o.addEventListener("pointerdown",ne),o.addEventListener("click",he)),o.dataset.limrPainted="true",$(),()=>{cancelAnimationFrame(u),be.disconnect(),J.forEach(ee=>ee()),document.removeEventListener("scroll",_,!0),window.visualViewport?.removeEventListener("resize",$),window.visualViewport?.removeEventListener("scroll",$),document.fonts?.removeEventListener("loadingdone",K),o.removeEventListener("transitionrun",N),o.removeEventListener("transitionend",N),o.removeEventListener("transitioncancel",N),o.removeEventListener("pointermove",Ee),o.removeEventListener("pointerleave",B),o.removeEventListener("pointerdown",ne),o.removeEventListener("click",he),delete o.dataset.limrPainted,oe()}},[t,i]),v.jsx("div",{ref:r,className:"limr-paint-layer","data-limr-ignore":"true","aria-hidden":"true"})}function Kn({className:t,style:i,interactive:r=!0,followOutput:o=!1,justify:s,...u}){const c=O.useContext(Sm);return u.source!==void 0||!c?v.jsx(Sl,{...u,justify:s,children:v.jsx(tx,{className:t,style:i,interactive:r,followOutput:o})}):v.jsx(tx,{className:t,style:i,interactive:r,followOutput:o,justify:s})}function tx({className:t,style:i,interactive:r,followOutput:o,justify:s}){const u=xt(),c=h0(),f=oo(),p=Ve(u.configuration,k=>k.theme??"light"),m=Ve(u.configuration,k=>k.justify??!1),y=Ve(u.configuration,k=>k.scrollRoot),g=Ve(u.documentOffset,k=>k),x=Ve(u.configuration,k=>k.components),b=Ve(u.configuration,k=>k.extensions),w=Ve(u.decorations,k=>k.byBlock),E=O.useRef(null),A=O.useRef(!0);return _t(()=>E.current?u.mountContent(E.current):void 0,[u,y]),_t(()=>u.requestLayout(),[u,s,m]),T2(u,r),O.useEffect(()=>{if(!o)return;const k=y??window,T=()=>{const C=y??window.document.documentElement,D=y?.clientHeight??window.innerHeight;A.current=C.scrollHeight-u.getScrollTop()-D<48};return k.addEventListener("scroll",T,{passive:!0}),()=>k.removeEventListener("scroll",T)},[u,o,y]),_t(()=>{if(!o||!c.streaming||!A.current)return;const k=requestAnimationFrame(()=>u.scrollTo(y?.scrollHeight??window.document.documentElement.scrollHeight,"instant"));return()=>cancelAnimationFrame(k)},[c,u,o,y]),v.jsxs("article",{ref:E,className:`limr-prose ${t??""}`,style:{...i,translate:g?`0 ${g}px`:i?.translate},"data-limr-theme":p,"data-limr-appearance":f,"data-limr-document":c.id,"data-limr-justify":s??m,children:[c.blocks.map(k=>v.jsx(u0,{block:k,runtime:u,components:x,extensions:b,decorations:w.get(k.id)??sm},k.id)),v.jsx(S2,{}),v.jsx(C2,{runtime:u,interactive:r})]})}function c0({children:t,active:i,resetKey:r,label:o}){const s=O.useRef(null),u=O.useRef(null),c=O.useRef(null),f=O.useRef(null),p=O.useRef(null),m=O.useRef(()=>{});_t(()=>{const b=s.current,w=b.parentElement;if(delete w.dataset.scrolling,!i)return;b.scrollTop=0;let E=0,A,k=0;const T=()=>{E=0;const j=f.current.clientHeight,L=b.scrollHeight-b.clientHeight,I=Math.min(j,Math.max(20,j*b.clientHeight/Math.max(1,b.scrollHeight)));w.toggleAttribute("data-overflow",L>1),c.current.style.height=`${I}px`,c.current.style.transform=`translateY(${L>0?Math.max(0,Math.min(1,b.scrollTop/L))*(j-I):0}px)`},C=()=>{E||(E=requestAnimationFrame(T))};m.current=()=>{clearTimeout(A),!w.closest("[data-motion]")&&(w.dataset.scrolling="true",A=setTimeout(()=>{p.current||delete w.dataset.scrolling},800))};const D=()=>{C(),b.scrollTop!==k&&(k=b.scrollTop,m.current())},z=new ResizeObserver(C);return z.observe(b),z.observe(u.current),b.addEventListener("scroll",D,{passive:!0}),T(),()=>{z.disconnect(),b.removeEventListener("scroll",D),cancelAnimationFrame(E),clearTimeout(A),p.current=null,m.current=()=>{},delete w.dataset.scrolling}},[i,r]);const y=b=>{if(b.button!==0)return;const w=s.current,E=c.current,A=f.current.clientHeight-E.offsetHeight;if(A<=0)return;b.preventDefault(),b.currentTarget.setPointerCapture(b.pointerId);const k=(w.scrollHeight-w.clientHeight)/A;b.target!==E&&(w.scrollTop=(b.clientY-f.current.getBoundingClientRect().top-E.offsetHeight/2)*k),p.current={pointerId:b.pointerId,y:b.clientY,scroll:w.scrollTop,scale:k},m.current()},g=b=>{const w=p.current;w?.pointerId===b.pointerId&&(s.current.scrollTop=w.scroll+(b.clientY-w.y)*w.scale)},x=b=>{p.current?.pointerId===b.pointerId&&(p.current=null,b.currentTarget.hasPointerCapture(b.pointerId)&&b.currentTarget.releasePointerCapture(b.pointerId),m.current())};return v.jsxs("div",{className:"limr-overlay-scroll",children:[v.jsx("div",{ref:s,className:"limr-overlay-content","data-limr-card-body":"",tabIndex:0,role:"region","aria-label":o,children:v.jsx("div",{ref:u,className:"limr-overlay-scroll-inner",children:t})}),v.jsx("div",{ref:f,className:"limr-overlay-scrollbar","aria-hidden":"true",onPointerDown:y,onPointerMove:g,onPointerUp:x,onPointerCancel:x,onLostPointerCapture:x,children:v.jsx("div",{ref:c,className:"limr-overlay-scroll-thumb"})})]})}function vm({title:t,bodyLabel:i,occurrence:r,expanded:o,pinned:s,canExpand:u,expand:c,collapse:f,close:p,children:m}){const y=Wn();return v.jsxs(v.Fragment,{children:[v.jsxs("div",{className:"limr-overlay-header",children:[v.jsx("span",{children:t}),v.jsxs("div",{className:"limr-overlay-controls",children:[o?v.jsx("button",{type:"button",onClick:f,children:v.jsx("span",{className:"limr-underline",children:y.collapse})}):u&&v.jsx("button",{type:"button",onClick:c,children:v.jsx("span",{className:"limr-underline",children:y.expand})}),s&&v.jsx("button",{type:"button",className:"limr-overlay-close",onClick:p,"aria-label":y.close,children:"×"})]})]}),v.jsx(c0,{active:!0,resetKey:r.id,label:i??(typeof t=="string"?t:y.annotations),children:m})]})}const R2=({children:t})=>v.jsx("p",{children:v.jsx("span",{className:"limr-underline",children:t})});function M2(){return v.jsx("svg",{viewBox:"0 0 16 16","aria-hidden":"true",fill:"currentColor",children:v.jsx("path",{d:"M2.5 4.2h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H2.5V4.2Zm6.7 0h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H9.2V4.2Z"})})}function xm({source:t,className:i,...r}){const o=xt(),s=Ve(o.configuration,u=>u);return v.jsx(Kn,{source:t,extensions:s.extensions,parameters:s.parameters,components:s.components,annotationTypes:s.annotationTypes,theme:s.theme,appearance:s.appearance,locale:s.locale,interactive:!1,...r,className:`limr-annotation-markdown ${i??""}`})}function d0(t={}){function i({annotations:s}){const u=O.useMemo(()=>s.filter(c=>c.type===(t.type??"citation")).map(c=>{const f=c.data,p=f?.summary?.trim()||f?.description?.trim();return p?xu(p).children?.map(om).join(" ").replace(/\s+/g," ").trim():hn(f?.url)||f?.title}).filter(Boolean).join(" · "),[s]);return u?v.jsx("span",{title:u,children:u}):null}function r(s){const u=Wn();return v.jsx(vm,{...s,title:u.citation??u.annotations})}function o({data:s}){const u=xt(),c=Ve(u.configuration,()=>u.components),f=O.useMemo(()=>({...c,paragraph:c.paragraph??R2}),[c]),p=O.useRef(null),m=hn(s?.url);return v.jsxs("div",{className:"limr-citation-content","data-linked":!!m||void 0,onClick:y=>{m&&!y.defaultPrevented&&!y.target.closest('a,button,input,textarea,select,summary,[role="button"],[contenteditable="true"],[data-limr-card-interactive]')&&window.getSelection()?.isCollapsed!==!1&&p.current?.click()},children:[v.jsx("a",{ref:p,className:"limr-citation-title",href:m,target:"_blank",rel:"noopener noreferrer",children:v.jsx("span",{className:"limr-underline",children:s?.title??s?.url??"Citation"})}),(s?.description||s?.summary)&&v.jsx(xm,{source:s.description||s.summary,components:f})]})}return{name:"citation",tags:["citation","ref"],scope:"local",annotationTypes:[{type:"citation",label:s=>s.citation??"Citation",icon:M2,color:"#6366f1",highlight:"hover",Content:o,...t,sidebar:{Preview:i,collapseOnContentClick:!1,...t.sidebar},overlay:{Card:r,expand:!1,...t.overlay}}],transform(s){er(s,u=>{if(u.type==="component"){if(u.name==="citation"){const c=u.attributes??{},f=String(c["cite-id"]??c.id??"");u.type="annotationDefinition",u.annotation={id:f,type:"citation",data:{title:c.title,url:c.url,description:c.desc??c.description,summary:c.summary}}}else if(u.name==="ref"){const c=String(u.attributes?.["cite-from-ids"]??u.attributes?.ids??u.attributes?.id??"");let f;try{const p=JSON.parse(c);f=Array.isArray(p)?p.map(String):[String(p)]}catch{f=c.split(",").map(p=>p.trim()).filter(Boolean)}u.type="annotationReference",u.annotationIds=f}}})}}}const N2=O.forwardRef(function({label:i,color:r,children:o,className:s="",style:u,...c},f){return v.jsx("span",{className:"limr-mark-wrap","data-limr-ignore":"true",children:v.jsx("button",{...c,ref:f,type:"button","aria-label":i,title:c.title??i,className:`limr-mark limr-action-mark ${s}`,style:{"--limr-mark-color":r,...u},children:v.jsx("span",{className:"limr-mark-icon",children:o})})})});function xa({open:t,children:i,className:r="",keepMounted:o=!1}){const[s,u]=O.useState(t),[c,f]=O.useState(t),p=O.useRef(null);return _t(()=>{if(o)return;if(t){if(!s){u(!0);return}p.current?.getBoundingClientRect(),f(!0);return}f(!1);const m=setTimeout(()=>u(!1),420);return()=>clearTimeout(m)},[t,o,s]),v.jsx("div",{ref:m=>{p.current=m,m?.toggleAttribute("inert",!t)},className:`limr-collapse ${r}`,"data-open":(o?t:c)||void 0,"aria-hidden":!t,children:v.jsx("div",{className:"limr-collapse-inner",children:s||o?i:null})})}const pu=["origin","translation","both"],ih={origin:"原文",translation:"译文",both:"对照"};function D2({mode:t}){return v.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:t==="both"?v.jsxs(v.Fragment,{children:[v.jsx("rect",{x:"2.5",y:"4",width:"8",height:"16",rx:"2.5"}),v.jsx("rect",{x:"13.5",y:"4",width:"8",height:"16",rx:"2.5"}),v.jsx("path",{d:"M5 9h3M5 12h3M16 9h3M16 12h3"})]}):v.jsxs(v.Fragment,{children:[v.jsx("rect",{x:"4.5",y:"3",width:"15",height:"18",rx:"3"}),t==="origin"?v.jsx("path",{d:"M8.5 8h7M8.5 12h7M8.5 16h4"}):v.jsx("path",{d:"M8 8.5h8M12 6.5v2M14.5 8.5c-.5 4-3 6.5-6.5 8M9.5 11c1.2 2.5 3.2 4.2 6.5 5.5"})]})})}function O2(t,i){return pu.includes(t)?t:i}function _h(t,i){for(const r of t.children??[]){if(r.name===i)return r;if(r.type==="paragraph"){const o=_h(r,i);if(o)return o}}}function j2(t={}){function i({node:r,children:o,renderChildren:s}){const u=_h(r,"origin"),c=_h(r,"translation"),[f,p]=O.useState(),m=lx("translationMode"),y=lx("onTranslationModeChange"),g=O2(m??f??r.attributes?.default,t.defaultMode??"origin"),x=u?c?g:"origin":"translation",b=pu[(pu.indexOf(x)+1)%pu.length],w=O.useRef(null),E=O.useRef(!1),A=m!==void 0&&!y;if(_t(()=>{E.current&&(w.current?.focus({preventScroll:!0}),E.current=!1)},[x]),!u&&!c)return v.jsx(v.Fragment,{children:o});const k=u&&c?v.jsx(N2,{ref:w,"data-translation-switch":"","data-mode":x,color:"var(--limr-translation-accent, #6b8fb5)",disabled:A,label:A?`当前${ih[x]}，由全局展示模式控制`:`当前${ih[x]}，切换到${ih[b]}`,onClick:()=>{E.current=document.activeElement===w.current,m!==void 0?y?.(b):p(b)},children:v.jsx(D2,{mode:x})}):void 0;return v.jsxs("div",{className:"limr-translations","data-mode":x,children:[c&&v.jsx(xa,{open:x!=="origin",keepMounted:!0,className:"limr-translation-panel",children:v.jsx("div",{className:"limr-translation-text","data-language":"translation",children:s(c.children??[],{trailing:x==="translation"?k:void 0})})}),u&&v.jsx(xa,{open:x!=="translation",keepMounted:!0,className:"limr-translation-panel",children:v.jsx("div",{className:"limr-translation-text","data-language":"origin",children:s(u.children??[],{trailing:x!=="translation"?k:void 0})})})]})}return{name:"translations",tags:["translations","origin","translation"],directives:["translations","origin","translation"],display:"block",scope:"local",parameters:{translationMode:void 0,onTranslationModeChange:void 0},components:{translations:i,origin:({children:r})=>v.jsx(v.Fragment,{children:r}),translation:({children:r})=>v.jsx(v.Fragment,{children:r})}}}function Yu({name:t,component:i,tags:r=[t],directives:o=[t],selection:s="content"}){return{name:t,tags:r,directives:o,selection:s,display:"block",scope:"local",components:Object.fromEntries([...new Set([...r,...o])].map(u=>[u,i]))}}function nx({title:t,open:i,onChange:r,children:o}){const[s,u]=O.useState(i);return O.useEffect(()=>{if(i){u(!0);return}const c=setTimeout(()=>u(!1),420);return()=>clearTimeout(c)},[i]),v.jsxs("details",{className:"limr-disclosure",open:s||i,"data-expanded":i||void 0,children:[v.jsxs("summary",{"aria-expanded":i,onClick:c=>{c.preventDefault(),r(!i)},"data-limr-ignore":"true",children:[v.jsx("span",{className:"limr-underline",children:t}),v.jsx("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:v.jsx("path",{d:"m6 8 4 4 4-4"})})]}),v.jsx(xa,{open:i,keepMounted:!0,children:v.jsx("div",{className:"limr-question-detail",children:o})})]})}function L2({checked:t}){return v.jsxs("svg",{className:"limr-choice-diamond",width:"14",height:"14",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true","data-limr-ignore":"true","data-checked":t||void 0,children:[v.jsx("path",{className:"limr-diamond-outline",d:"M9 1.5L16.5 9L9 16.5L1.5 9Z",fill:"none"}),v.jsx("path",{className:"limr-diamond-fill",d:"M9 5L13 9L9 13L5 9Z",fill:"currentColor"})]})}function z2(t,i="auto"){const r=hn(t);if(!r)return;let o;try{o=new URL(r.startsWith("//")?`https:${r}`:r)}catch{return i==="auto"||i==="native"?{url:r,native:!0}:void 0}if(!["https:","http:"].includes(o.protocol))return;const s=/(?:^|\.)(?:youtube\.com|youtube-nocookie\.com)$/.test(o.hostname)||o.hostname==="youtu.be",u=/(?:^|\.)bilibili\.com$/.test(o.hostname),c=i==="auto"?s?"youtube":u?"bilibili":"native":i;if(c==="native")return{url:r,native:!0};if(c==="youtube"&&s){const f=o.hostname==="youtu.be"?o.pathname.split("/")[1]:o.searchParams.get("v")??/^\/(?:embed|shorts|live)\/([\w-]+)/.exec(o.pathname)?.[1];if(f&&/^[\w-]{11}$/.test(f)){const p=new URL(`https://www.youtube.com/embed/${f}`),m=o.searchParams.get("start")??o.searchParams.get("t");if(m){const y=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(m),g=y?Number(y[1]??0)*3600+Number(y[2]??0)*60+Number(y[3]??0):0;g>0&&p.searchParams.set("start",String(g))}return{url:p.href,native:!1}}}if(c==="bilibili"&&u){const f=/\/video\/(BV[\w]+|av\d+)(?:\/|$)/.exec(o.pathname)?.[1],p=f?.startsWith("BV")?f:o.hostname==="player.bilibili.com"?o.searchParams.get("bvid"):null,m=f?.startsWith("av")?f.slice(2):o.hostname==="player.bilibili.com"?o.searchParams.get("aid"):null;if(p&&/^BV[\w]+$/.test(p)||m&&/^\d+$/.test(m)){const y=new URL("https://player.bilibili.com/player.html");y.searchParams.set(p?"bvid":"aid",p||m),y.searchParams.set("autoplay","0"),y.searchParams.set("high_quality","1"),y.searchParams.set("danmaku","0");const g=o.searchParams.get("p")??o.searchParams.get("page");return g&&/^[1-9]\d*$/.test(g)&&y.searchParams.set("page",g),{url:y.href,native:!1}}}}function _2(t={}){function i({node:r,source:o,renderAttribute:s}){const u=xt(),c=Ve(u.configuration,L=>L.scrollRoot),f=O.useRef(null),[p,m]=O.useState(!1),[y,g]=O.useState(!1),[x,b]=O.useState(!1),w=String(r.attributes?.provider??"auto"),E=String(r.attributes?.url??r.attributes?.src??""),A=r.attributes?.loading??t.loading??"visible",k=A==="click"||A==="eager"?A:"visible",T=t.resolveUrl?.(w,E),C=T&&hn(T)?{url:hn(T),native:w==="native"}:z2(E,w);O.useEffect(()=>{b(!1),g(!1)},[E,w]),O.useEffect(()=>{if(p||k!=="visible"||!f.current)return;if(typeof IntersectionObserver>"u"){m(!0);return}const L=new IntersectionObserver(I=>{I.some(q=>q.isIntersecting)&&(m(!0),L.disconnect())},{root:c,rootMargin:"200px"});return L.observe(f.current),()=>L.disconnect()},[p,k,c]);const D=k==="eager"||k==="visible"&&p||y,z=String(r.attributes?.title??`${w==="auto"?"Video":w} video`),j=hn(E);return v.jsxs("div",{ref:f,className:"limr-video","data-limr-selection-surface":"","data-loading":k,children:[v.jsx("div",{className:"limr-video-frame",children:!C||x?v.jsxs("div",{className:"limr-video-error",children:[v.jsx("span",{children:u.locale.unavailable}),j&&v.jsx("a",{href:j,target:"_blank",rel:"noopener noreferrer",children:E})]}):D?C.native?v.jsx("video",{controls:!0,playsInline:!0,preload:"metadata",src:C.url,"aria-label":z,onError:()=>b(!0)}):v.jsx("iframe",{src:C.url,title:z,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0,referrerPolicy:"strict-origin-when-cross-origin",onError:()=>b(!0)}):v.jsx("button",{type:"button",className:"limr-video-play",onClick:()=>g(!0),"aria-label":u.locale.play,children:v.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:v.jsx("path",{d:"m8 5 11 7-11 7Z",fill:"currentColor"})})})}),r.attributes?.title&&v.jsx("div",{className:"limr-video-title",children:s("title")}),v.jsx(yl,{className:"limr-video-copy",variant:"glass",value:o})]})}return Yu({name:"video",tags:["video","md-video"],component:t.component??i,selection:"atomic"})}const wm={minWidth:220,maxWidth:560,minHeight:120,maxHeight:480};function f0({ratio:t,limits:i}){const r=Math.min(i.maxWidth,i.maxHeight*t);return{maximum:r,minimum:Math.min(r,Math.max(i.minWidth,i.minHeight*t))}}function I2(t,i,r,o,s=!0){if(!i.length||t<=0)return 1;const u=i.map(f0),c=y=>{const g=(t-(y-1)*r)/y;return u.every(x=>g>=x.minimum)};if(o){let y=Math.max(1,Math.min(24,Math.floor(o)));if(s)for(;y>1&&!c(y);)y--;return y}const f=Math.max(...u.map(y=>y.maximum)),p=Math.max(...u.map(y=>y.minimum));let m=1;for(;m<i.length&&m<24&&t>=m*f+m*r+p&&c(m+1);)m++;return m}function Wa(t,i,r=!1){if(r&&(t===!1||t==="false"||t==="none"))return 1/0;if(typeof t!="number"&&(typeof t!="string"||!/^\d+(?:\.\d+)?(?:px)?$/.test(t)))return i;const o=typeof t=="number"?t:parseFloat(t);return Number.isFinite(o)&&o>=0?o:i}function ru(t={},i=wm){return{minWidth:Wa(t["min-width"],i.minWidth),maxWidth:Wa(t["max-width"],i.maxWidth,!0),minHeight:Wa(t["min-height"],i.minHeight),maxHeight:Wa(t["max-height"],i.maxHeight,!0)}}const ix=O.createContext(wm),fl=t=>t.name==="figcaption"||t.name==="caption",ax=t=>t.flatMap(i=>i.type==="paragraph"&&i.children?.some(r=>r.name==="figure"||fl(r))?i.children:[i]),rx=t=>t.attributes?.id?String(t.attributes.id):void 0,ox=(t,i)=>{const r=Number(t)/Number(i);return Number.isFinite(r)&&r>0?r:1};function H2(t={}){const i=ru({"min-width":t.minWidth,"max-width":t.maxWidth,"min-height":t.minHeight,"max-height":t.maxHeight});function r({node:u,renderChildren:c,renderAttribute:f,source:p}){const m=Wn(),y=ax(u.children??[]),g=y.filter(j=>j.name==="figure"),x=y.filter(fl),b=y.filter(j=>!fl(j)),w=O.useMemo(()=>ru(u.attributes,i),[u.attributes]),E=O.useRef(null),[A,k]=O.useState(1),T=Math.min(100,Wa(u.attributes?.gap,t.gap??16)),C=Wa(u.attributes?.rows,t.rows??0),D=Wa(u.attributes?.columns??u.attributes?.cols,t.columns??0)||(C>0?Math.ceil(g.length/C):void 0),z=String(u.attributes?.responsive??t.responsive??!0)!=="false";return O.useEffect(()=>{const j=E.current;if(!j)return;const L=()=>{const q=[...j.querySelectorAll(":scope > .limr-figure")],H=g.map((Z,oe)=>{const ue=q[oe]?.querySelector("img");return{ratio:ue?.naturalWidth&&ue.naturalHeight?ue.naturalWidth/ue.naturalHeight:ox(Z.attributes?.width,Z.attributes?.height),limits:ru(Z.attributes,w)}});k(I2(j.clientWidth,H,T,D,z))},I=new ResizeObserver(L);return I.observe(j),j.addEventListener("load",L,!0),j.addEventListener("error",L,!0),L(),()=>{I.disconnect(),j.removeEventListener("load",L,!0),j.removeEventListener("error",L,!0)}},[u,w,T,D,z]),v.jsxs("figure",{id:rx(u),className:"limr-figures","data-limr-selection-order":"visual","data-columns":A,"data-responsive":z,children:[v.jsx(yl,{value:p,label:m.copyFigures,variant:"glass",className:"limr-figures-copy"}),v.jsx(ix.Provider,{value:w,children:v.jsx("div",{ref:E,className:"limr-figures-grid",style:{gridTemplateColumns:`repeat(${A}, minmax(0, 1fr))`,gridTemplateRows:C?`repeat(${Math.max(1,Math.min(24,Math.floor(C)))}, auto auto)`:void 0,gap:T},children:c(b)})}),x.length?c(x):u.attributes?.caption?v.jsx("figcaption",{children:f("caption")}):null]})}function o({node:u,renderChildren:c,renderAttribute:f}){const p=Wn(),m=O.useContext(ix),y=ru(u.attributes,m===wm?i:m),g=O.useRef(null),[x,b]=O.useState(ox(u.attributes?.width,u.attributes?.height)),w=ax(u.children??[]),E=w.filter(fl),A=w.filter(T=>!fl(T));O.useEffect(()=>{const T=g.current;if(!T)return;const C=()=>{const D=T.querySelector("img");D?.naturalWidth&&D.naturalHeight&&b(D.naturalWidth/D.naturalHeight)};return C(),T.addEventListener("load",C,!0),()=>T.removeEventListener("load",C,!0)},[u]);const k=f0({ratio:x,limits:y}).maximum;return v.jsxs("figure",{id:rx(u),className:"limr-figure","data-limr-selection-order":"visual",style:{"--limr-figure-width":Number.isFinite(k)?`${k}px`:"100%","--limr-figure-min-height":`${Math.min(y.minHeight,y.maxHeight)}px`,"--limr-figure-max-height":Number.isFinite(y.maxHeight)?`${y.maxHeight}px`:"none"},children:[v.jsx("div",{ref:g,className:"limr-figure-media",children:c(A)}),v.jsx(yl,{onCopy:async()=>{const T=g.current?.querySelector("img")?.getAttribute("src");if(!T)throw new Error("Image URL unavailable");await navigator.clipboard.writeText(T)},label:p.copyImage,variant:"glass",className:"limr-figure-copy"}),E.length?c(E):u.attributes?.caption?v.jsx("figcaption",{children:f("caption")}):null]})}const s=({children:u})=>v.jsx("figcaption",{children:u});return{name:"figures",tags:["figures","figure","figcaption","caption","img"],directives:["figures","figure","figcaption"],scope:"local",display:"block",components:{figures:r,figure:o,figcaption:s,caption:s,img:({node:u})=>v.jsx("img",{src:hn(u.attributes?.src,!0),alt:String(u.attributes?.alt??""),loading:"lazy",decoding:"async"})},transform(u){const c=f=>{if(f.type==="component"&&f.name==="img"&&(f.selection="atomic",f.inline=!0),f.type==="component"&&f.name==="figure"&&(f.attributes?.src||f.attributes?.url)){const p=f.attributeNodes?.[f.attributes.src?"src":"url"];f.children=[{type:"image",url:f.attributes.src??f.attributes.url,alt:f.attributes.alt??"",position:p?.position??f.position},...f.children??[]]}f.children?.forEach(c)};c(u)}}}function Ka(t,i){const r=[];return er(t,o=>{o!==t&&o.name===i&&r.push(o)}),r}const Ih=({children:t})=>v.jsx(v.Fragment,{children:t});function B2(t={}){function i({node:r,children:o,renderChildren:s,renderAttribute:u}){const c=xt(),f=Ka(r,"title")[0],p=Ka(r,"content")[0];return v.jsxs("aside",{className:"limr-definition",children:[v.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:c.locale.definition}),(f||r.attributes?.title)&&v.jsx("div",{className:"limr-definition-title",children:f?s(f.children??[]):u("title")}),v.jsx("div",{className:"limr-block-content",children:p?s(p.children??[]):o})]})}return{...Yu({name:"definition",component:t.component??i}),tags:["definition","title","content"],components:{definition:t.component??i,title:Ih,content:Ih}}}function q2(t={}){function i({node:o,children:s,renderChildren:u,renderAttribute:c}){const f=xt(),[p,m]=O.useState(!1),[y,g]=O.useState(!1),[x,b]=O.useState([]),[w,E]=O.useState(!1),A=Ka(o,"question-content")[0],k=Ka(o,"question-hint")[0],T=Ka(o,"question-answer")[0],C=Ka(o,"question-sel-grp")[0],D=Ka(o,"question-sel"),z=String(C?.attributes?.multi??o.attributes?.multi??"false")==="true";let j=[];try{const I=JSON.parse(String(C?.attributes?.answer??o.attributes?.answer??"[]"));j=(Array.isArray(I)?I:[I]).map(Number)}catch{}const L=j.length===x.length&&j.every(I=>x.includes(I));return v.jsxs("section",{className:"limr-question",children:[v.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:f.locale.question}),o.attributes?.title&&v.jsx("div",{className:"limr-question-title",children:c("title")}),v.jsx("div",{className:"limr-block-content",children:A?u(A.children??[]):!D.length&&!k&&!T?s:null}),D.length>0&&v.jsxs("fieldset",{className:"limr-question-options",children:[v.jsx("legend",{className:"limr-sr-only",children:String(o.attributes?.title??f.locale.question)}),D.map((I,q)=>v.jsxs("label",{"data-selected":x.includes(q)||void 0,"data-result":w?j.includes(q)?"correct":x.includes(q)?"incorrect":void 0:void 0,children:[v.jsx("input",{type:z?"checkbox":"radio",name:`${f.document.id}-question-${ut(o).start}`,checked:x.includes(q),disabled:w,onChange:()=>{b(z?x.includes(q)?x.filter(H=>H!==q):[...x,q]:[q])}}),v.jsx(L2,{checked:x.includes(q)||w&&j.includes(q)}),v.jsx("span",{className:"limr-choice-text",children:u(I.children??[])})]},q))]}),D.length>0&&j.length>0&&v.jsxs("div",{className:"limr-question-actions","data-limr-ignore":"true",children:[v.jsx("button",{type:"button","data-checked":w||void 0,disabled:!w&&!x.length,onClick:()=>{w?(E(!1),b([]),g(!1)):(E(!0),g(!0))},children:v.jsx("span",{className:"limr-button-label",children:w?f.locale.retry:f.locale.submit},w?"retry":"submit")}),v.jsx(xa,{open:w,children:v.jsx("span",{role:"status",className:`limr-question-result ${L?"limr-success":"limr-error"}`,children:L?f.locale.correct:f.locale.incorrect})})]}),k&&v.jsx(nx,{title:f.locale.hint,open:p,onChange:m,children:u(k.children??[])}),T&&v.jsx(nx,{title:f.locale.answer,open:y,onChange:g,children:u(T.children??[])})]})}const r=["question-content","question-hint","question-answer","question-sel-grp","question-sel"];return{...Yu({name:"question",component:t.component??i}),tags:["question",...r],components:{question:t.component??i,...Object.fromEntries(r.map(o=>[o,Ih]))}}}function U2(t={}){const i=({node:o,children:s,renderAttribute:u})=>v.jsxs("div",{className:"limr-extra",children:[v.jsxs("a",{className:"limr-extra-link",href:hn(o.attributes?.url),target:"_blank",rel:"noreferrer",children:[v.jsx("span",{className:"limr-underline",children:u(o.attributes?.title?"title":"url")}),o.attributes?.desc&&v.jsx("p",{children:v.jsx("span",{className:"limr-underline",children:u("desc")})})]}),s]}),r=({children:o})=>{const s=xt();return v.jsxs("aside",{className:"limr-extras",children:[v.jsx("div",{className:"limr-card-label","data-limr-ignore":"true",children:s.locale.extra}),o]})};return{...Yu({name:"extras",component:t.component??r}),tags:["extras","extra"],components:{extras:t.component??r,extra:i}}}function F2(){return[gm(),s2(),l0(),B2(),q2(),U2(),_2(),H2(),d0(),j2()]}let P2;const Sm=O.createContext(null),_t=typeof window<"u"?O.useLayoutEffect:O.useEffect;function Sl({children:t,source:i="",streaming:r=!1,documentId:o,...s}){const u=O.useId(),c=O.useMemo(()=>{const y=s.extensions??(P2??=F2());return s.plugins?.length?[...y,...s.plugins]:y},[s.extensions,s.plugins]),f={...s,extensions:c},[p]=O.useState(()=>new BC(o??`limr-${u.replace(/[^a-z\d_-]/gi,"")}`,i,r,f)),m=O.useRef({source:i,streaming:r,config:f});return _t(()=>{const y=m.current;Object.keys({...y.config,...f}).some(x=>y.config[x]!==f[x])&&p.configure(f),(y.source!==i||y.streaming!==r)&&p.document.update(i,{streaming:r}),m.current={source:i,streaming:r,config:f}}),O.useEffect(()=>(p.start(),()=>p.dispose()),[p]),v.jsx(Sm.Provider,{value:p,children:t})}function xt(){const t=O.useContext(Sm);if(!t)throw new Error("This LiMR component needs a DocumentProvider or Reader. Markdown can also be used on its own.");return t}function lx(t){const i=xt();return Ve(i.configuration,r=>{if(r.parameters?.[t]!==void 0)return r.parameters[t];for(let o=(r.extensions?.length??0)-1;o>=0;o--){const s=r.extensions[o].parameters;if(s&&t in s)return s[t]}})}function Ve(t,i){const r=O.useRef(i);r.current=i;const o=O.useRef(void 0),s=O.useCallback(()=>{const u=t.get();if(o.current&&o.current.state===u&&o.current.select===r.current)return o.current.value;const c=r.current(u);return o.current={state:u,select:r.current,value:c},c},[t]);return O.useSyncExternalStore(t.subscribe,s,s)}function h0(){const t=xt();return O.useSyncExternalStore(t.document.subscribe,t.document.getSnapshot,t.document.getSnapshot)}function kl(t){const i=xt(),r=O.useMemo(()=>({subscribe:i.document.subscribe,get:i.document.getSnapshot}),[i]);return Ve(r,t)}function V2(){return Ve(xt().interaction,t=>t.selection)}function Al(){return Ve(xt().configuration,t=>t.theme??"light")}function oo(){return Ve(xt().configuration,t=>t.appearance??"classic")}function Wn(){const t=xt();return Ve(t.configuration,i=>i.locale),t.locale}function km(){const t=xt();return O.useMemo(()=>({...t.commands,document:t.document,get signal(){return t.signal},clearSelection:()=>t.clearSelection(),scrollToHeading:i=>t.scrollToHeading(i),scrollToAnnotation:i=>t.scrollToOccurrence(i),invalidateAnnotation:i=>t.invalidateAnnotation(i)}),[t])}function Am(t,i,r,o){O.useEffect(()=>{const s=t.current;if(!s)return;let u=0,c=0;const f=()=>{u=0,o?.();const A=s.getBoundingClientRect(),k=window.visualViewport;let T=Math.max(A.top,k?.offsetTop??0),C=Math.min(A.bottom,(k?.offsetTop??0)+(k?.height??innerHeight));const D=i.configuration.get().scrollRoot;if(D){const q=D.getBoundingClientRect();T=Math.max(T,q.top+D.clientTop),C=Math.min(C,q.top+D.clientTop+D.clientHeight)}const z=[...s.querySelectorAll(r)].map(q=>q.getBoundingClientRect()),j=C>T&&z.some(q=>q.top<T-.5),L=C>T&&z.some(q=>q.bottom>C+.5);s.toggleAttribute("data-overflow-top",j),s.toggleAttribute("data-overflow-bottom",L);const I=(q,H)=>{const Z=`${Math.max(0,H).toFixed(2)}px`;s.style.getPropertyValue(q)!==Z&&s.style.setProperty(q,Z)};I("--limr-fade-start",T-A.top),I("--limr-fade-end",C-A.top),c&&s.getAnimations({subtree:!0}).some(q=>q.playState==="running")?p():c=0},p=()=>{u||(u=requestAnimationFrame(f))},m=()=>{cancelAnimationFrame(u),f()},y=()=>{c++,p()},g=()=>{c=Math.max(0,c-1),p()};s.addEventListener("transitionrun",y),s.addEventListener("transitionend",g),s.addEventListener("transitioncancel",g);const x=new ResizeObserver(m);x.observe(s);const b=new MutationObserver(A=>{A.some(k=>{const T=k.target instanceof Element?k.target:k.target.parentElement;return T&&T!==s&&!T.closest(".limr-highlight-layer,.limr-paint-layer")})&&m()});b.observe(s,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["style","class"]});const w=[i.layout.subscribe(p),i.viewport.subscribe(m),i.documentOffset.subscribe(p),i.configuration.subscribe(p)],E=A=>{const k=A.target;(k===window.document||k===window||k instanceof Element&&k.contains(s))&&m()};return window.addEventListener("scroll",E,{capture:!0,passive:!0}),window.addEventListener("resize",p),window.visualViewport?.addEventListener("resize",p),window.visualViewport?.addEventListener("scroll",m),p(),()=>{cancelAnimationFrame(u),x.disconnect(),b.disconnect(),w.forEach(A=>A()),s.removeEventListener("transitionrun",y),s.removeEventListener("transitionend",g),s.removeEventListener("transitioncancel",g),window.removeEventListener("scroll",E,!0),window.removeEventListener("resize",p),window.visualViewport?.removeEventListener("resize",p),window.visualViewport?.removeEventListener("scroll",m),s.removeAttribute("data-overflow-top"),s.removeAttribute("data-overflow-bottom"),s.style.removeProperty("--limr-fade-start"),s.style.removeProperty("--limr-fade-end")}},[t,i,r,o])}function Ju({title:t,maxDepth:i=6,followActive:r=!0,topInset:o=24,updateHash:s=!1,className:u,style:c}){const f=xt(),p=oo(),m=Al(),y=Wn(),g=kl(C=>C.headings);Ve(f.layout,C=>C);const x=Ve(f.interaction,C=>C.activeHeading),b=O.useRef(null);Am(b,f,":scope > ol");const w=O.useRef(0),E=O.useRef(void 0),A=g.filter(C=>C.level<=i&&!f.headings.get(C.id)?.closest("[inert]"));A.sort((C,D)=>{const z=f.headings.get(C.id),j=f.headings.get(D.id);return z&&j&&z!==j?z.compareDocumentPosition(j)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1:0});const k=Math.min(...A.map(C=>C.level),6);O.useEffect(()=>{if(!r||!x)return;const C=()=>{const z=b.current;if(!z||z.clientHeight===0)return;const j=Array.from(z.querySelectorAll("[data-heading]")).find(q=>q.dataset.heading===x);if(!j)return;const L=j.getBoundingClientRect().top-z.getBoundingClientRect().top+z.scrollTop-o,I=Math.max(0,Math.min(L,z.scrollHeight-z.clientHeight));Math.abs(I-z.scrollTop)>1&&zw(z,I)},D=Math.max(0,w.current-Date.now());return E.current=setTimeout(C,D),()=>clearTimeout(E.current)},[x,g,r,o]);const T=()=>{w.current=Date.now()+1200,clearTimeout(E.current)};return v.jsxs("nav",{className:`limr-toc ${u??""}`,style:c,"data-limr-theme":m,"data-limr-appearance":p,"aria-label":t??y.contents,children:[v.jsx("div",{className:"limr-toc-title",children:t??y.contents}),v.jsx("div",{className:"limr-toc-scroll",ref:b,onWheel:T,onTouchStart:T,onKeyDown:T,tabIndex:0,children:v.jsx("ol",{children:A.map(C=>v.jsx("li",{children:v.jsx("a",{"data-heading":C.id,href:`#${C.id}`,"aria-current":C.id===x?"location":void 0,style:{paddingInlineStart:12+Math.min(C.level-k,4)*14},onClick:D=>{D.preventDefault(),f.scrollToHeading(C.id),s&&history.replaceState(history.state,"",`#${C.id}`)},children:v.jsx("span",{className:"limr-underline",children:C.text})})},C.id))})})]})}var bl=cw();function G2({annotationId:t,presentation:i,expanded:r=!0,enabled:o=!0}){const s=xt(),u=Ve(s.decorations,w=>w.annotations.get(t)),c=Ve(s.interaction,w=>w.editing===t),f=Ve(s.configuration,()=>s.annotationTypes.get(u?.type??"citation")),p=Ve(s.resourceVersions,w=>w.get(t)??0),[m,y]=O.useState({id:t,loading:!!f?.load,error:null});O.useEffect(()=>{if(!f?.load||!u||!o)return;let w=!1;y({id:t,loading:!0,error:null});const E=s.resources.acquire(s.getResourceKey(u),A=>f.load(u,{signal:A}));return E.promise.then(A=>{w||y({id:t,data:A,loading:!1,error:null})}).catch(A=>{w||y({id:t,loading:!1,error:A instanceof Error?A:new Error(String(A))})}),()=>{w=!0,E.release()}},[s,u,t,f,p,o]);const g=()=>s.invalidateAnnotation(t),x=f?.Content,b=m.id===t?m:{loading:!!f?.load,error:null,data:void 0};return u?x?v.jsx(x,{editing:c,annotation:u,data:f?.load?b.data??u.data:u.data,loading:f?.load?b.loading:!1,error:b.error,retry:g,presentation:i,expanded:r}):v.jsxs("span",{className:"limr-muted",children:[s.locale.unavailable," · ",u.type]}):v.jsxs("span",{className:"limr-muted",children:[s.locale.unavailable," · ",t]})}function m0({occurrence:t,presentation:i,expanded:r=!0,enabled:o=!0}){return v.jsx(v.Fragment,{children:t.annotationIds.map(s=>v.jsx("div",{className:"limr-annotation-entry",children:v.jsx(G2,{annotationId:s,presentation:i,expanded:r,enabled:o})},s))})}function Hh(t,i){const r=Lw(t,i),o=t.blocks.filter(c=>Jt(c.range,r));let s="";const u=c=>{const f=ut(c);if(!(!Jt(f,r)||["annotationReference","footnoteReference","annotationDefinition","definition"].includes(c.type)))if(c.value!==void 0){const p=lm(t.source,c.value,f);s+=c.value.split("").filter((m,y)=>p.ends[y]>r.start&&p.starts[y]<r.end).join("")}else c.type==="image"?s+=String(c.alt??""):c.children?.forEach(u)};return o.forEach((c,f)=>{f&&(s+=" "),u(c.node)}),i.embedded||(s||=i.quote??t.source.slice(r.start,r.end)),s.replace(/\s+/g," ").trim()}const $2=(t,{activeId:i,gap:r,height:o,prioritizeActive:s})=>{const u=t.map(p=>p.anchorTop),c=t.findIndex(p=>p.id===i),f=c<0?0:c;if(!t.length)return new Map;u[f]=o===void 0?t[f].anchorTop:Math.max(0,Math.min(t[f].anchorTop,o-t[f].height));for(let p=f-1;p>=0;p--)u[p]=Math.min(t[p].anchorTop,u[p+1]-t[p].height-r);for(let p=f+1;p<t.length;p++)u[p]=Math.max(t[p].anchorTop,u[p-1]+t[p-1].height+r);if(o!==void 0&&t.reduce((p,m)=>p+m.height,r*(t.length-1))<=o){const p=s&&c>=0?f+1:0;for(let m=t.length-1;m>=p;m--)u[m]=Math.min(u[m],(m===t.length-1?o:u[m+1]-r)-t[m].height);if(p||c<0||u[0]>=0)for(let m=p;m<t.length;m++)u[m]=Math.max(u[m],m===0?0:u[m-1]+t[m-1].height+r)}return new Map(t.map((p,m)=>[p.id,u[m]]))};function p0({sync:t="document",gap:i=14,positioner:r=$2,renderCard:o,className:s,style:u}){const c=xt(),f=h0(),p=oo(),m=Al(),y=Wn(),g=Ve(c.decorations,ie=>ie),x=Ve(c.interaction,ie=>ie.active),b=Ve(c.interaction,ie=>ie.hovered),w=Ve(c.interaction,ie=>ie.hoverSource),E=Ve(c.interaction,ie=>ie.activeSource);O.useSyncExternalStore(c.configuration.subscribe,c.configuration.get,c.configuration.get);const A=O.useSyncExternalStore(c.layout.subscribe,c.layout.get,c.layout.get),k=O.useSyncExternalStore(c.viewport.subscribe,c.viewport.get,c.viewport.get),T=O.useRef(null),C=O.useRef(new Map),[D,z]=O.useState(new Map),[j,L]=O.useState(new Map),[I,q]=O.useState(new Map),[H,Z]=O.useState(0),oe=O.useRef({sizes:new Map,minimum:new Map,height:0}),ue=O.useRef(0),[$,N]=O.useState(0),[P,K]=O.useState(0),[J,be]=O.useState(null),_=O.useRef(null),[He,Ee]=O.useState(null),B=O.useMemo(()=>{const ie=[...g.occurrences].sort((ye,Ae)=>ye.range.start-Ae.range.start||ye.range.end-Ae.range.end||ye.id.localeCompare(Ae.id));if(t==="none")for(const ye of g.annotations.values())ye.type!=="highlight"&&!ie.some(Ae=>Ae.annotationIds.includes(ye.id))&&ie.push({id:`unanchored-${ye.id}`,range:{start:0,end:0},annotationIds:[ye.id]});return ie},[g,t]),U=O.useMemo(()=>new Map(B.map(ie=>[ie.id,Hh(f,ie)])),[f,B]),ne=O.useMemo(()=>new Map(B.map(ie=>[ie.id,ie.annotationIds.flatMap(ye=>{const Ae=g.annotations.get(ye);return Ae?[Ae]:[]})])),[g,B]),he=O.useCallback((ie=!1)=>{const ye=new Map,Ae=new Map;C.current.forEach((we,De)=>{const ze=we.getBoundingClientRect().height;ye.set(De,ze);const Fe=[...we.querySelectorAll(":scope > .limr-sidebar-card-body > .limr-collapse")];Ae.set(De,ze-Fe.reduce((qe,tt)=>qe+tt.getBoundingClientRect().height,0))});const me=T.current?.getBoundingClientRect().height??0,je=oe.current;if(je.height===me&&je.sizes.size===ye.size&&[...ye].every(([we,De])=>De===je.sizes.get(we)&&Math.abs(Ae.get(we)-(je.minimum.get(we)??0))<.5))return;oe.current={sizes:ye,minimum:Ae,height:me};const V=()=>{z(ye),L(Ae),Z(me)};if(!ie){V();return}const R=T.current;R?.setAttribute("data-resizing",""),bl.flushSync(V),cancelAnimationFrame(ue.current),ue.current=requestAnimationFrame(()=>{ue.current=requestAnimationFrame(()=>R?.removeAttribute("data-resizing"))})},[]),ee=O.useCallback(()=>he(!0),[he]);Am(T,c,":scope > .limr-sidebar-card",ee),O.useEffect(()=>{const ie=new ResizeObserver(()=>he(!0));return T.current&&ie.observe(T.current),C.current.forEach(ye=>ie.observe(ye)),he(),()=>ie.disconnect()},[B,he,I]),O.useEffect(()=>()=>cancelAnimationFrame(ue.current),[]),_t(()=>{if(t==="none"||!T.current)return;const ie=T.current.getBoundingClientRect().top,ye=new Map,Ae=c.getContentOffset();for(const me of B){const je=c.anchors.get(me.id);if(!je||je.closest("[inert]"))continue;const V=k2(c,g.referenceRanges.get(me.id)??me.range);ye.set(me.id,(V||je.getBoundingClientRect()).top-ie-Ae)}q(me=>me.size===ye.size&&[...ye].every(([je,V])=>Math.abs(V-(me.get(je)??-1/0))<.5)?me:ye)},[c,g.referenceRanges,B,A,t]),_t(()=>{if(t!=="document"||!T.current)return;const ie=c.configuration.get().scrollRoot,ye=T.current.getBoundingClientRect(),Ae=Math.max(ye.top,c.getViewportTop()+(ie?.clientTop??0),window.visualViewport?.offsetTop??0),me=Math.min(ye.bottom,ie?c.getViewportTop()+ie.clientTop+ie.clientHeight:1/0,(window.visualViewport?.offsetTop??0)+(window.visualViewport?.height??innerHeight));N(Math.max(0,Ae-ye.top+(c.configuration.get().scrollOffset??24))),K(Math.max(0,me-Ae))},[c,A,k,t]),O.useEffect(()=>{const ie=Ae=>{if(Ae.button!==0)return;const me=Ae.target;if(!(me instanceof Element))return;const je=me.closest(".limr-sidebar-card"),V=me.closest("[data-limr-anchor]");if(je&&T.current?.contains(je)||V&&c.anchors.get(V.dataset.limrAnchor)===V||me.closest(".limr-overlay-positioner,.limr-selection-toolbar"))return;const{active:R,hovered:we}=c.interaction.get();(R||we)&&c.activate(null)},ye=Ae=>{if(Ae.key!=="Escape"||Ae.defaultPrevented||!c.interaction.get().active)return;c.anchors.get(c.interaction.get().active)?.focus({preventScroll:!0}),c.activate(null)};return window.document.addEventListener("pointerdown",ie),window.document.addEventListener("keydown",ye),()=>{window.document.removeEventListener("pointerdown",ie),window.document.removeEventListener("keydown",ye),t==="document"&&c.documentOffset.set(0)}},[c,t]);const pe=B.filter(ie=>t==="none"||I.has(ie.id));t!=="none"&&pe.sort((ie,ye)=>(I.get(ie.id)??0)-(I.get(ye.id)??0));const ge=pe.find(ie=>(I.get(ie.id)??0)>=$)?.id??pe.at(-1)?.id??null,ke=b??x??ge,le=b??x,se=b?w:x?E:null,ve=se==="sidebar"&&J?.id===ke?J:null,Ce=ve?.top;_t(()=>{const ie=_.current;if(_.current=le?{id:le,top:Ce}:null,le||t!=="document"||!T.current||matchMedia("(prefers-reduced-motion: reduce)").matches){Ee(null);return}if(!ie)return;const ye=getComputedStyle(T.current),Ae=ye.getPropertyValue("--limr-motion-slow").trim(),me=parseFloat(Ae)*(Ae.endsWith("ms")?1:1e3),je=Number.isFinite(me)?Math.max(0,me):460;if(!je){Ee(null);return}const V=T.current.animate([{},{}],{duration:je,easing:ye.getPropertyValue("--limr-ease").trim()||"ease-out"});Ee({...ie,progress:0});let R=0;const we=()=>{if(V.playState==="finished"){Ee(null);return}Ee({...ie,progress:V.effect?.getComputedTiming().progress??0}),R=requestAnimationFrame(we)};return R=requestAnimationFrame(we),()=>{cancelAnimationFrame(R),V.cancel()}},[le,Ce,t]);const Me=pe.map(ie=>({id:ie.id,anchorTop:I.get(ie.id)??0,height:D.get(ie.id)??80})),ce={activeId:ke,gap:i,height:t==="document"&&H>0?H:void 0,prioritizeActive:!!(b||x)},xe=new Map(r(ve?Me.map(ie=>ie.id===ve.id?{...ie,anchorTop:ve.top}:ie):Me,ce)),Ne=!le&&He;if(Ne){const ie=r(Me.map(ye=>ye.id===Ne.id&&Ne.top!==void 0?{...ye,anchorTop:Ne.top}:ye),{...ce,activeId:Ne.id,prioritizeActive:!0});for(const[ye,Ae]of xe)xe.set(ye,Ae+((ie.get(ye)??Ae)-Ae)*(1-Ne.progress))}const Be=ve?I.get(ve.id)??ve.top:0,X=t==="document"&&ve?(xe.get(ve.id)??ve.top)-Be:0;_t(()=>{t==="document"&&c.documentOffset.set(X)},[c,X,t]);const Le=ie=>{if(ve?.id===ie)return;const ye=C.current.get(ie);if(ye&&T.current){const Ae=T.current.getBoundingClientRect().top,me=ye.getBoundingClientRect().top-Ae;be({id:ie,top:me})}};return v.jsx("aside",{ref:T,"aria-label":y.annotations,className:`limr-sidebar ${s??""}`,"data-sync":t,"data-releasing":Ne?"":void 0,"data-limr-theme":m,"data-limr-appearance":p,style:u,children:pe.map(ie=>{const ye=g.annotations.get(ie.annotationIds[0]),Ae=c.annotationTypes.get(ye?.type??"citation"),me=x===ie.id,je=Ae?.sidebar,V=je?.Preview,R=se==="marker"&&ke===ie.id&&!me?Math.max(j.get(ie.id)??80,H-(I.get(ie.id)??0)):H,we=me?Math.min(R,Math.max(j.get(ie.id)??80,P||H)):R,De={"--limr-annotation-color":je?.color??Ae?.color,"--limr-annotation-border":je?.borderColor,"--limr-annotation-title":je?.titleColor,"--limr-annotation-text":je?.textColor,"--limr-annotation-excerpt":je?.excerptColor,"--limr-annotation-preview":je?.previewColor,"--limr-sidebar-preview-lines":String(Math.max(1,Math.floor(je?.previewLines??2))),...t==="document"?{position:"absolute",top:xe.get(ie.id)??0,insetInline:0,"--limr-sidebar-card-height":`${we}px`}:{marginBlockEnd:i}},ze=ie.annotationIds.every(qe=>c.annotationTypes.get(g.annotations.get(qe)?.type??"")?.sidebar?.collapseOnContentClick),Fe=()=>{const qe=c.interaction.get().hovered===ie.id||C.current.get(ie.id)?.matches(":hover");Le(ie.id),c.activate(me?null:ie.id,"sidebar"),qe&&c.hover(ie.id,"sidebar")};return v.jsx("div",{ref:qe=>{qe?C.current.set(ie.id,qe):C.current.delete(ie.id)},className:"limr-sidebar-card","data-type":ye?.type,"data-locked":ve?.id===ie.id||void 0,"data-active":me||b===ie.id||void 0,"data-expanded":me||void 0,"data-default-card":!o||void 0,"data-content-toggle":ze||void 0,"data-citations":ie.annotationIds.every(qe=>g.annotations.get(qe)?.type==="citation")||void 0,"data-occurrence":ie.id,style:De,onPointerEnter:qe=>{qe.pointerType!=="touch"&&(Le(ie.id),c.hover(ie.id,"sidebar"))},onPointerLeave:()=>{c.interaction.get().hovered===ie.id&&c.interaction.get().hoverSource==="sidebar"&&c.hover(null)},onClick:qe=>{(!me||ze)&&!o&&!qe.defaultPrevented&&!qe.target.closest('button,a,input,select,textarea,summary,[role="button"],[role="link"],[contenteditable="true"],[data-limr-card-interactive]')&&window.getSelection()?.isCollapsed!==!1&&Fe()},children:o?o({occurrence:ie,active:me,activate:Fe}):v.jsxs(v.Fragment,{children:[U.get(ie.id)&&v.jsx("div",{className:"limr-sidebar-reference",title:U.get(ie.id),children:v.jsx("p",{className:"limr-sidebar-excerpt",children:U.get(ie.id)})}),v.jsxs("div",{className:"limr-sidebar-card-body",children:[v.jsxs("button",{type:"button",className:"limr-sidebar-card-heading",onClick:Fe,"aria-expanded":me,children:[Ae?.label??ye?.type??"Reference",v.jsx("span",{className:"limr-sidebar-toggle",children:v.jsx("span",{className:"limr-button-label limr-underline",children:me?y.collapse:y.expand},String(me))})]}),V&&ye&&v.jsx(xa,{open:!me,keepMounted:!0,className:"limr-sidebar-preview-panel",children:v.jsx("div",{className:"limr-sidebar-preview",children:v.jsx(V,{annotation:ye,data:ye.data,occurrence:ie,annotations:ne.get(ie.id),referenceText:U.get(ie.id)??""})})}),v.jsx(xa,{open:me,className:"limr-sidebar-expansion",children:v.jsx("div",{className:"limr-sidebar-card-content",children:v.jsx(m0,{occurrence:ie,presentation:"sidebar",enabled:me})})})]})]})},ie.id)})})}function Xu(){return typeof window<"u"}function ka(t){return Tm(t)?(t.nodeName||"").toLowerCase():"#document"}function mn(t){var i;return(t==null||(i=t.ownerDocument)==null?void 0:i.defaultView)||window}function qi(t){var i;return(i=(Tm(t)?t.ownerDocument:t.document)||window.document)==null?void 0:i.documentElement}function Tm(t){return Xu()?t instanceof Node||t instanceof mn(t).Node:!1}function jt(t){return Xu()?t instanceof Element||t instanceof mn(t).Element:!1}function rn(t){return Xu()?t instanceof HTMLElement||t instanceof mn(t).HTMLElement:!1}function Tu(t){return!Xu()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof mn(t).ShadowRoot}function Zu(t){const{overflow:i,overflowX:r,overflowY:o,display:s}=ei(t);return/auto|scroll|overlay|hidden|clip/.test(i+o+r)&&s!=="inline"&&s!=="contents"}function Y2(t){return/^(table|td|th)$/.test(ka(t))}function Qu(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const J2=/transform|translate|scale|rotate|perspective|filter/,X2=/paint|layout|strict|content/,Xa=t=>!!t&&t!=="none";let ah;function Em(t){const i=jt(t)?ei(t):t;return Xa(i.transform)||Xa(i.translate)||Xa(i.scale)||Xa(i.rotate)||Xa(i.perspective)||!Ku()&&(Xa(i.backdropFilter)||Xa(i.filter))||J2.test(i.willChange||"")||X2.test(i.contain||"")}function Z2(t){let i=wa(t);for(;rn(i)&&!ya(i);){if(Em(i))return i;if(Qu(i))return null;i=wa(i)}return null}function Ku(){return ah==null&&(ah=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),ah}function ya(t){return/^(html|body|#document)$/.test(ka(t))}function ei(t){return mn(t).getComputedStyle(t)}function Wu(t){return jt(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function wa(t){if(ka(t)==="html")return t;const i=t.assignedSlot||t.parentNode||Tu(t)&&t.host||qi(t);return Tu(i)?i.host:i}function g0(t){const i=wa(t);return ya(i)?(t.ownerDocument||t).body:rn(i)&&Zu(i)?i:g0(i)}function ba(t,i,r){var o;i===void 0&&(i=[]),r===void 0&&(r=!0);const s=g0(t),u=s===((o=t.ownerDocument)==null?void 0:o.body),c=mn(s);if(u){const f=Bh(c);return i.concat(c,c.visualViewport||[],Zu(s)?s:[],f&&r?ba(f):[])}else return i.concat(s,ba(s,[],r))}function Bh(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}const io=Math.min,Ii=Math.max,Eu=Math.round,ou=Math.floor,Hi=t=>({x:t,y:t}),Q2={left:"right",right:"left",bottom:"top",top:"bottom"};function K2(t,i,r){return Ii(t,io(i,r))}function Tl(t,i){return typeof t=="function"?t(i):t}function nr(t){return t.split("-")[0]}function El(t){return t.split("-")[1]}function y0(t){return t==="x"?"y":"x"}function b0(t){return t==="y"?"height":"width"}function _i(t){const i=t[0];return i==="t"||i==="b"?"y":"x"}function v0(t){return y0(_i(t))}function W2(t,i,r){r===void 0&&(r=!1);const o=El(t),s=v0(t),u=b0(s);let c=s==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return i.reference[u]>i.floating[u]&&(c=Cu(c)),[c,Cu(c)]}function eN(t){const i=Cu(t);return[qh(t),i,qh(i)]}function qh(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const sx=["left","right"],ux=["right","left"],tN=["top","bottom"],nN=["bottom","top"];function iN(t,i,r){switch(t){case"top":case"bottom":return r?i?ux:sx:i?sx:ux;case"left":case"right":return i?tN:nN;default:return[]}}function aN(t,i,r,o){const s=El(t);let u=iN(nr(t),r==="start",o);return s&&(u=u.map(c=>c+"-"+s),i&&(u=u.concat(u.map(qh)))),u}function Cu(t){const i=nr(t);return Q2[i]+t.slice(i.length)}function rN(t){var i,r,o,s;return{top:(i=t.top)!=null?i:0,right:(r=t.right)!=null?r:0,bottom:(o=t.bottom)!=null?o:0,left:(s=t.left)!=null?s:0}}function oN(t){return typeof t!="number"?rN(t):{top:t,right:t,bottom:t,left:t}}function Ru(t){const{x:i,y:r,width:o,height:s}=t;return{width:o,height:s,top:r,left:i,right:i+o,bottom:r+s,x:i,y:r}}var lN=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","area[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],Mu=lN.join(","),x0=typeof Element>"u",ao=x0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Nu=!x0&&Element.prototype.getRootNode?function(t){var i;return t==null||(i=t.getRootNode)===null||i===void 0?void 0:i.call(t)}:function(t){return t?.ownerDocument},Du=function(i,r){var o;r===void 0&&(r=!0);var s=i==null||(o=i.getAttribute)===null||o===void 0?void 0:o.call(i,"inert"),u=s===""||s==="true",c=u||r&&i&&(typeof i.closest=="function"?i.closest("[inert]"):Du(i.parentNode));return c},sN=function(i){var r,o=i==null||(r=i.getAttribute)===null||r===void 0?void 0:r.call(i,"contenteditable");return o===""||o==="true"},w0=function(i,r,o){if(Du(i))return[];var s=Array.prototype.slice.apply(i.querySelectorAll(Mu));return r&&ao.call(i,Mu)&&s.unshift(i),s=s.filter(o),s},Ou=function(i,r,o){for(var s=[],u=Array.from(i);u.length;){var c=u.shift();if(!Du(c,!1))if(c.tagName==="SLOT"){var f=c.assignedElements(),p=f.length?f:c.children,m=Ou(p,!0,o);o.flatten?s.push.apply(s,m):s.push({scopeParent:c,candidates:m})}else{var y=ao.call(c,Mu);y&&o.filter(c)&&(r||!i.includes(c))&&s.push(c);var g=c.shadowRoot||typeof o.getShadowRoot=="function"&&o.getShadowRoot(c),x=!Du(g,!1)&&(!o.shadowRootFilter||o.shadowRootFilter(c));if(g&&x){var b=Ou(g===!0?c.children:g.children,!0,o);o.flatten?s.push.apply(s,b):s.push({scopeParent:c,candidates:b})}else u.unshift.apply(u,c.children)}}return s},S0=function(i){return!isNaN(parseInt(i.getAttribute("tabindex"),10))},k0=function(i){if(!i)throw new Error("No node provided");return i.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(i.tagName)||sN(i))&&!S0(i)?0:i.tabIndex},uN=function(i,r){var o=k0(i);return o<0&&r&&!S0(i)?0:o},cN=function(i,r){return i.tabIndex===r.tabIndex?i.documentOrder-r.documentOrder:i.tabIndex-r.tabIndex},A0=function(i){return i.tagName==="INPUT"},dN=function(i){return A0(i)&&i.type==="hidden"},fN=function(i){var r=i.tagName==="DETAILS"&&Array.prototype.slice.apply(i.children).some(function(o){return o.tagName==="SUMMARY"});return r},hN=function(i,r){for(var o=0;o<i.length;o++)if(i[o].checked&&i[o].form===r)return i[o]},mN=function(i){if(!i.name)return!0;var r=i.form||Nu(i),o=function(f){return r.querySelectorAll('input[type="radio"][name="'+f+'"]')},s;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")s=o(window.CSS.escape(i.name));else try{s=o(i.name)}catch(c){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",c.message),!1}var u=hN(s,i.form);return!u||u===i},pN=function(i){return A0(i)&&i.type==="radio"},gN=function(i){return pN(i)&&!mN(i)},yN=function(i){var r,o=i&&Nu(i),s=(r=o)===null||r===void 0?void 0:r.host,u=!1;if(o&&o!==i){var c,f,p;for(u=!!((c=s)!==null&&c!==void 0&&(f=c.ownerDocument)!==null&&f!==void 0&&f.contains(s)||i!=null&&(p=i.ownerDocument)!==null&&p!==void 0&&p.contains(i));!u&&s;){var m,y,g;o=Nu(s),s=(m=o)===null||m===void 0?void 0:m.host,u=!!((y=s)!==null&&y!==void 0&&(g=y.ownerDocument)!==null&&g!==void 0&&g.contains(s))}}return u},cx=function(i){var r=i.getBoundingClientRect(),o=r.width,s=r.height;return o===0&&s===0},bN=function(i,r){var o=r.displayCheck,s=r.getShadowRoot;if(o==="full-native"&&"checkVisibility"in i){var u=i.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!u}var c=getComputedStyle(i),f=c.visibility;if(f==="hidden"||f==="collapse")return!0;var p=ao.call(i,"details>summary:first-of-type"),m=p?i.parentElement:i;if(ao.call(m,"details:not([open]) *"))return!0;if(!o||o==="full"||o==="full-native"||o==="legacy-full"){if(typeof s=="function"){for(var y=i;i;){var g=i.parentElement,x=Nu(i);if(g&&!g.shadowRoot&&s(g)===!0)return cx(i);i.assignedSlot?i=i.assignedSlot:!g&&x!==i.ownerDocument?i=x.host:i=g}i=y}if(yN(i))return!i.getClientRects().length;if(o!=="legacy-full")return!0}else if(o==="non-zero-area")return cx(i);return!1},vN=function(i){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(i.tagName))for(var r=i.parentElement;r;){if(r.tagName==="FIELDSET"&&r.disabled){for(var o=0;o<r.children.length;o++){var s=r.children.item(o);if(s.tagName==="LEGEND")return ao.call(r,"fieldset[disabled] *")?!0:!s.contains(i)}return!0}r=r.parentElement}return!1},Uh=function(i,r){return!(r.disabled||dN(r)||bN(r,i)||fN(r)||vN(r))},Fh=function(i,r){return!(gN(r)||k0(r)<0||!Uh(i,r))},xN=function(i){var r=parseInt(i.getAttribute("tabindex"),10);return!!(isNaN(r)||r>=0)},T0=function(i){var r=[],o=[];return i.forEach(function(s,u){var c=!!s.scopeParent,f=c?s.scopeParent:s,p=uN(f,c),m=c?T0(s.candidates):f;p===0?c?r.push.apply(r,m):r.push(f):o.push({documentOrder:u,tabIndex:p,item:s,isScope:c,content:m})}),o.sort(cN).reduce(function(s,u){return u.isScope?s.push.apply(s,u.content):s.push(u.content),s},[]).concat(r)},ec=function(i,r){r=r||{};var o;return r.getShadowRoot?o=Ou([i],r.includeContainer,{filter:Fh.bind(null,r),flatten:!1,getShadowRoot:r.getShadowRoot,shadowRootFilter:xN}):o=w0(i,r.includeContainer,Fh.bind(null,r)),T0(o)},wN=function(i,r){r=r||{};var o;return r.getShadowRoot?o=Ou([i],r.includeContainer,{filter:Uh.bind(null,r),flatten:!0,getShadowRoot:r.getShadowRoot}):o=w0(i,r.includeContainer,Uh.bind(null,r)),o},E0=function(i,r){if(r=r||{},!i)throw new Error("No node provided");return ao.call(i,Mu)===!1?!1:Fh(r,i)};function C0(){const t=navigator.userAgentData;return t!=null&&t.platform?t.platform:navigator.platform}function R0(){const t=navigator.userAgentData;return t&&Array.isArray(t.brands)?t.brands.map(i=>{let{brand:r,version:o}=i;return r+"/"+o}).join(" "):navigator.userAgent}function SN(){return/apple/i.test(navigator.vendor)}function Ph(){const t=/android/i;return t.test(C0())||t.test(R0())}function kN(){return R0().includes("jsdom/")}const dx="data-floating-ui-focusable",AN="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Qr(t){let i=t.activeElement;for(;((r=i)==null||(r=r.shadowRoot)==null?void 0:r.activeElement)!=null;){var r;i=i.shadowRoot.activeElement}return i}function Rn(t,i){if(!t||!i)return!1;const r=i.getRootNode==null?void 0:i.getRootNode();if(t.contains(i))return!0;if(r&&Tu(r)){let o=i;for(;o;){if(t===o)return!0;o=o.parentNode||o.host}}return!1}function pa(t){return"composedPath"in t?t.composedPath()[0]:t.target}function rh(t,i){if(i==null)return!1;if("composedPath"in t)return t.composedPath().includes(i);const r=t;return r.target!=null&&i.contains(r.target)}function TN(t){return t.matches("html,body")}function Jn(t){return t?.ownerDocument||document}function EN(t){return rn(t)&&t.matches(AN)}function fx(t){return t?t.getAttribute("role")==="combobox"&&EN(t):!1}function Vh(t){return t?t.hasAttribute(dx)?t:t.querySelector("["+dx+"]")||t:null}function Wr(t,i,r){return r===void 0&&(r=!0),t.filter(s=>{var u;return s.parentId===i&&(!r||((u=s.context)==null?void 0:u.open))}).flatMap(s=>[s,...Wr(t,s.id,r)])}function hx(t,i){var r;let o=[],s=(r=t.find(u=>u.id===i))==null?void 0:r.parentId;for(;s;){const u=t.find(c=>c.id===s);s=u?.parentId,u&&(o=o.concat(u))}return o}function oh(t){t.preventDefault(),t.stopPropagation()}function CN(t){return"nativeEvent"in t}function RN(t){return t.mozInputSource===0&&t.isTrusted?!0:Ph()&&t.pointerType?t.type==="click"&&t.buttons===1:t.detail===0&&!t.pointerType}function MN(t){return kN()?!1:!Ph()&&t.width===0&&t.height===0||Ph()&&t.width===1&&t.height===1&&t.pressure===0&&t.detail===0&&t.pointerType==="mouse"||t.width<1&&t.height<1&&t.pressure===0&&t.detail===0&&t.pointerType==="touch"}var NN=typeof document<"u",DN=function(){},Mn=NN?O.useLayoutEffect:DN;const ON={...uw};function lh(t){const i=O.useRef(t);return Mn(()=>{i.current=t}),i}const jN=ON.useInsertionEffect,LN=jN||(t=>t());function mi(t){const i=O.useRef(()=>{});return LN(()=>{i.current=t}),O.useCallback(function(){for(var r=arguments.length,o=new Array(r),s=0;s<r;s++)o[s]=arguments[s];return i.current==null?void 0:i.current(...o)},[])}const Cl=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function M0(t,i){const r=ec(t,Cl()),o=r.length;if(o===0)return;const s=Qr(Jn(t)),u=r.indexOf(s),c=u===-1?i===1?0:o-1:u+i;return r[c]}function N0(t){return M0(Jn(t).body,1)||t}function D0(t){return M0(Jn(t).body,-1)||t}function hl(t,i){const r=i||t.currentTarget,o=t.relatedTarget;return!o||!Rn(r,o)}function zN(t){ec(t,Cl()).forEach(r=>{r.dataset.tabindex=r.getAttribute("tabindex")||"",r.setAttribute("tabindex","-1")})}function mx(t){t.querySelectorAll("[data-tabindex]").forEach(r=>{const o=r.dataset.tabindex;delete r.dataset.tabindex,o?r.setAttribute("tabindex",o):r.removeAttribute("tabindex")})}function px(t,i,r){let{reference:o,floating:s}=t;const u=_i(i),c=v0(i),f=b0(c),p=nr(i),m=u==="y",y=o.x+o.width/2-s.width/2,g=o.y+o.height/2-s.height/2,x=o[f]/2-s[f]/2;let b;switch(p){case"top":b={x:y,y:o.y-s.height};break;case"bottom":b={x:y,y:o.y+o.height};break;case"right":b={x:o.x+o.width,y:g};break;case"left":b={x:o.x-s.width,y:g};break;default:b={x:o.x,y:o.y}}const w=El(i);return w&&(b[c]+=x*(w==="end"?1:-1)*(r&&m?-1:1)),b}async function _N(t,i){var r;i===void 0&&(i={});const{x:o,y:s,platform:u,rects:c,elements:f,strategy:p}=t,{boundary:m="clippingAncestors",rootBoundary:y="viewport",elementContext:g="floating",altBoundary:x=!1,padding:b=0}=Tl(i,t),w=oN(b),A=f[x?g==="floating"?"reference":"floating":g],k=Ru(await u.getClippingRect({element:(r=await(u.isElement==null?void 0:u.isElement(A)))==null||r?A:A.contextElement||await(u.getDocumentElement==null?void 0:u.getDocumentElement(f.floating)),boundary:m,rootBoundary:y,strategy:p})),T=g==="floating"?{x:o,y:s,width:c.floating.width,height:c.floating.height}:c.reference,C=await(u.getOffsetParent==null?void 0:u.getOffsetParent(f.floating)),D=await(u.isElement==null?void 0:u.isElement(C))&&await(u.getScale==null?void 0:u.getScale(C))||{x:1,y:1},z=Ru(u.convertOffsetParentRelativeRectToViewportRelativeRect?await u.convertOffsetParentRelativeRectToViewportRelativeRect({elements:f,rect:T,offsetParent:C,strategy:p}):T);return{top:(k.top-z.top+w.top)/D.y,bottom:(z.bottom-k.bottom+w.bottom)/D.y,left:(k.left-z.left+w.left)/D.x,right:(z.right-k.right+w.right)/D.x}}const IN=50,HN=async(t,i,r)=>{const{placement:o="bottom",strategy:s="absolute",middleware:u=[],platform:c}=r,f=c.detectOverflow?c:{...c,detectOverflow:_N},p=await(c.isRTL==null?void 0:c.isRTL(i));let m=await c.getElementRects({reference:t,floating:i,strategy:s}),{x:y,y:g}=px(m,o,p),x=o,b=0;const w={};for(let E=0;E<u.length;E++){const A=u[E];if(!A)continue;const{name:k,fn:T}=A,{x:C,y:D,data:z,reset:j}=await T({x:y,y:g,initialPlacement:o,placement:x,strategy:s,middlewareData:w,rects:m,platform:f,elements:{reference:t,floating:i}});y=C??y,g=D??g,w[k]={...w[k],...z},j&&b<IN&&(b++,typeof j=="object"&&(j.placement&&(x=j.placement),j.rects&&(m=j.rects===!0?await c.getElementRects({reference:t,floating:i,strategy:s}):j.rects),{x:y,y:g}=px(m,x,p)),E=-1)}return{x:y,y:g,placement:x,strategy:s,middlewareData:w}},BN=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(i){var r,o;const{placement:s,middlewareData:u,rects:c,initialPlacement:f,platform:p,elements:m}=i,{mainAxis:y=!0,crossAxis:g=!0,fallbackPlacements:x,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:E=!0,...A}=Tl(t,i);if((r=u.arrow)!=null&&r.alignmentOffset)return{};const k=nr(s),T=_i(f),C=nr(f)===f,D=await(p.isRTL==null?void 0:p.isRTL(m.floating)),z=x||(C||!E?[Cu(f)]:eN(f)),j=w!=="none";!x&&j&&z.push(...aN(f,E,w,D));const L=[f,...z],I=await p.detectOverflow(i,A),q=[];let H=((o=u.flip)==null?void 0:o.overflows)||[];if(y&&q.push(I[k]),g){const $=W2(s,c,D);q.push(I[$[0]],I[$[1]])}if(H=[...H,{placement:s,overflows:q}],!q.every($=>$<=0)){var Z,oe;const $=(((Z=u.flip)==null?void 0:Z.index)||0)+1,N=L[$];if(N&&(!(g==="alignment"?T!==_i(N):!1)||H.every(J=>_i(J.placement)===T?J.overflows[0]>0:!0)))return{data:{index:$,overflows:H},reset:{placement:N}};let P=(oe=H.filter(K=>K.overflows[0]<=0).sort((K,J)=>K.overflows[1]-J.overflows[1])[0])==null?void 0:oe.placement;if(!P)switch(b){case"bestFit":{var ue;const K=(ue=H.filter(J=>{if(j){const be=_i(J.placement);return be===T||be==="y"}return!0}).map(J=>[J.placement,J.overflows.filter(be=>be>0).reduce((be,_)=>be+_,0)]).sort((J,be)=>J[1]-be[1])[0])==null?void 0:ue[0];K&&(P=K);break}case"initialPlacement":P=f;break}if(s!==P)return{reset:{placement:P}}}return{}}}},qN=new Set(["left","top"]);async function UN(t,i){const{placement:r,platform:o,elements:s}=t,u=await(o.isRTL==null?void 0:o.isRTL(s.floating)),c=nr(r),f=El(r),p=_i(r)==="y",m=qN.has(c)?-1:1,y=u&&p?-1:1,g=Tl(i,t);let{mainAxis:x,crossAxis:b,alignmentAxis:w}=typeof g=="number"?{mainAxis:g,crossAxis:0,alignmentAxis:null}:{mainAxis:g.mainAxis||0,crossAxis:g.crossAxis||0,alignmentAxis:g.alignmentAxis};return f&&typeof w=="number"&&(b=f==="end"?w*-1:w),p?{x:b*y,y:x*m}:{x:x*m,y:b*y}}const FN=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(i){var r,o;const{x:s,y:u,placement:c,middlewareData:f}=i,p=await UN(i,t);return c===((r=f.offset)==null?void 0:r.placement)&&(o=f.arrow)!=null&&o.alignmentOffset?{}:{x:s+p.x,y:u+p.y,data:{...p,placement:c}}}}},PN=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(i){const{x:r,y:o,placement:s,platform:u}=i,{mainAxis:c=!0,crossAxis:f=!1,limiter:p={fn:T=>{let{x:C,y:D}=T;return{x:C,y:D}}},...m}=Tl(t,i),y={x:r,y:o},g=await u.detectOverflow(i,m),x=_i(s),b=y0(x);let w=y[b],E=y[x];const A=(T,C)=>K2(C+g[T==="y"?"top":"left"],C,C-g[T==="y"?"bottom":"right"]);c&&(w=A(b,w)),f&&(E=A(x,E));const k=p.fn({...i,[b]:w,[x]:E});return{...k,data:{x:k.x-r,y:k.y-o,enabled:{[b]:c,[x]:f}}}}}},VN=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(i){const{placement:r,rects:o,platform:s,elements:u}=i,{apply:c=()=>{},...f}=Tl(t,i),p=await s.detectOverflow(i,f),m=nr(r),y=El(r),g=_i(r)==="y",{width:x,height:b}=o.floating;let w,E;m==="top"||m==="bottom"?(w=m,E=y===(await(s.isRTL==null?void 0:s.isRTL(u.floating))?"start":"end")?"left":"right"):(E=m,w=y==="end"?"top":"bottom");const A=b-p.top-p.bottom,k=x-p.left-p.right,T=io(b-p[w],A),C=io(x-p[E],k),D=i.middlewareData.shift,z=!D;let j=T,L=C;D!=null&&D.enabled.x&&(L=k),D!=null&&D.enabled.y&&(j=A),z&&!y&&(g?L=x-2*Ii(p.left,p.right):j=b-2*Ii(p.top,p.bottom)),await c({...i,availableWidth:L,availableHeight:j});const I=await s.getDimensions(u.floating);return x!==I.width||b!==I.height?{reset:{rects:!0}}:{}}}};function O0(t){const i=ei(t);let r=parseFloat(i.width)||0,o=parseFloat(i.height)||0;const s=rn(t),u=s?t.offsetWidth:r,c=s?t.offsetHeight:o,f=Eu(r)!==u||Eu(o)!==c;return f&&(r=u,o=c),{width:r,height:o,$:f}}function Cm(t){return jt(t)?t:t.contextElement}function eo(t){const i=Cm(t);if(!rn(i))return Hi(1);const r=i.getBoundingClientRect(),{width:o,height:s,$:u}=O0(i);let c=(u?Eu(r.width):r.width)/o,f=(u?Eu(r.height):r.height)/s;return(!c||!Number.isFinite(c))&&(c=1),(!f||!Number.isFinite(f))&&(f=1),{x:c,y:f}}const GN=Hi(0);function j0(t){const i=mn(t);return!Ku()||!i.visualViewport?GN:{x:i.visualViewport.offsetLeft,y:i.visualViewport.offsetTop}}function $N(t,i,r){return i===void 0&&(i=!1),!!r&&i&&r===mn(t)}function ir(t,i,r,o){i===void 0&&(i=!1),r===void 0&&(r=!1);const s=t.getBoundingClientRect(),u=Cm(t);let c=Hi(1);i&&(o?jt(o)&&(c=eo(o)):c=eo(t));const f=$N(u,r,o)?j0(u):Hi(0);let p=(s.left+f.x)/c.x,m=(s.top+f.y)/c.y,y=s.width/c.x,g=s.height/c.y;if(u&&o){const x=mn(u),b=jt(o)?mn(o):o;let w=x,E=Bh(w);for(;E&&b!==w;){const A=eo(E),k=E.getBoundingClientRect(),T=ei(E),C=k.left+(E.clientLeft+parseFloat(T.paddingLeft))*A.x,D=k.top+(E.clientTop+parseFloat(T.paddingTop))*A.y;p*=A.x,m*=A.y,y*=A.x,g*=A.y,p+=C,m+=D,w=mn(E),E=Bh(w)}}return Ru({width:y,height:g,x:p,y:m})}function tc(t,i){const r=Wu(t).scrollLeft;return i?i.left+r:ir(qi(t)).left+r}function L0(t,i){const r=t.getBoundingClientRect(),o=r.left+i.scrollLeft-tc(t,r),s=r.top+i.scrollTop;return{x:o,y:s}}function YN(t){let{elements:i,rect:r,offsetParent:o,strategy:s}=t;const u=s==="fixed",c=qi(o),f=i?Qu(i.floating):!1;if(o===c||f&&u)return r;let p={scrollLeft:0,scrollTop:0},m=Hi(1);const y=Hi(0),g=rn(o);if((g||!u)&&((ka(o)!=="body"||Zu(c))&&(p=Wu(o)),g)){const b=ir(o);m=eo(o),y.x=b.x+o.clientLeft,y.y=b.y+o.clientTop}const x=c&&!g&&!u?L0(c,p):Hi(0);return{width:r.width*m.x,height:r.height*m.y,x:r.x*m.x-p.scrollLeft*m.x+y.x+x.x,y:r.y*m.y-p.scrollTop*m.y+y.y+x.y}}function JN(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function XN(t){const i=Wu(t),r=t.ownerDocument.body,o=Ii(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=Ii(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let u=-i.scrollLeft+tc(t);const c=-i.scrollTop;return ei(r).direction==="rtl"&&(u+=Ii(t.clientWidth,r.clientWidth)-o),{width:o,height:s,x:u,y:c}}const ZN=25;function QN(t,i,r){r===void 0&&(r="viewport");const o=r==="layoutViewport",s=mn(t),u=qi(t),c=s.visualViewport;let f=u.clientWidth,p=u.clientHeight,m=0,y=0;if(c){const x=!Ku()||i==="fixed";o?x||(m=-c.offsetLeft,y=-c.offsetTop):(f=c.width,p=c.height,x&&(m=c.offsetLeft,y=c.offsetTop))}if(tc(u)<=0){const x=u.ownerDocument,b=x.body,w=getComputedStyle(b),E=x.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,A=Math.abs(u.clientWidth-b.clientWidth-E),k=getComputedStyle(u).scrollbarGutter==="stable both-edges"?A/2:A;k<=ZN&&(f-=k)}return{width:f,height:p,x:m,y}}function KN(t,i){const r=ir(t,!0,i==="fixed"),o=r.top+t.clientTop,s=r.left+t.clientLeft,u=eo(t),c=t.clientWidth*u.x,f=t.clientHeight*u.y,p=s*u.x,m=o*u.y;return{width:c,height:f,x:p,y:m}}function gx(t,i,r){let o;if(i==="viewport"||i==="layoutViewport")o=QN(t,r,i);else if(i==="document")o=XN(qi(t));else if(jt(i))o=KN(i,r);else{const s=j0(t);o={x:i.x-s.x,y:i.y-s.y,width:i.width,height:i.height}}return Ru(o)}function WN(t,i){const r=i.get(t);if(r)return r;let o=ba(t,[],!1).filter(f=>jt(f)&&ka(f)!=="body"),s=null;const u=ei(t).position==="fixed";let c=u?wa(t):t;for(;jt(c)&&!ya(c);){const f=ei(c),p=Em(c),m=s?s.position:u?"fixed":"";!p&&(m==="fixed"||m==="absolute"&&f.position==="static")?o=o.filter(g=>g!==c):s=f,c=wa(c)}return i.set(t,o),o}function eD(t){let{element:i,boundary:r,rootBoundary:o,strategy:s}=t;const c=[...r==="clippingAncestors"?Qu(i)?[]:WN(i,this._c):[].concat(r),o],f=gx(i,c[0],s);let p=f.top,m=f.right,y=f.bottom,g=f.left;for(let x=1;x<c.length;x++){const b=gx(i,c[x],s);p=Ii(b.top,p),m=io(b.right,m),y=io(b.bottom,y),g=Ii(b.left,g)}return{width:m-g,height:y-p,x:g,y:p}}function tD(t){const{width:i,height:r}=O0(t);return{width:i,height:r}}function nD(t,i,r){const o=rn(i),s=qi(i),u=r==="fixed",c=ir(t,!0,u,i);let f={scrollLeft:0,scrollTop:0};const p=Hi(0);if((o||!u)&&((ka(i)!=="body"||Zu(s))&&(f=Wu(i)),o)){const x=ir(i,!0,u,i);p.x=x.x+i.clientLeft,p.y=x.y+i.clientTop}!o&&s&&(p.x=tc(s));const m=s&&!o&&!u?L0(s,f):Hi(0),y=c.left+f.scrollLeft-p.x-m.x,g=c.top+f.scrollTop-p.y-m.y;return{x:y,y:g,width:c.width,height:c.height}}function sh(t){return ei(t).position==="static"}function yx(t,i){if(!rn(t)||ei(t).position==="fixed")return null;if(i)return i(t);let r=t.offsetParent;return qi(t)===r&&(r=r.ownerDocument.body),r}function z0(t,i){const r=mn(t);if(Qu(t))return r;if(!rn(t)){let s=wa(t);for(;s&&!ya(s);){if(jt(s)&&!sh(s))return s;s=wa(s)}return r}let o=yx(t,i);for(;o&&Y2(o)&&sh(o);)o=yx(o,i);return o&&ya(o)&&sh(o)&&!Em(o)?r:o||Z2(t)||r}const iD=async function(t){const i=this.getOffsetParent||z0,r=this.getDimensions,o=await r(t.floating);return{reference:nD(t.reference,await i(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function aD(t){return ei(t).direction==="rtl"}const rD={convertOffsetParentRelativeRectToViewportRelativeRect:YN,getDocumentElement:qi,getClippingRect:eD,getOffsetParent:z0,getElementRects:iD,getClientRects:JN,getDimensions:tD,getScale:eo,isElement:jt,isRTL:aD};function _0(t,i){return t.x===i.x&&t.y===i.y&&t.width===i.width&&t.height===i.height}function oD(t,i,r){let o=null,s;const u=qi(t);function c(){var y;clearTimeout(s),(y=o)==null||y.disconnect(),o=null}function f(y,g){y===void 0&&(y=!1),g===void 0&&(g=1),c();const x=t.getBoundingClientRect(),{left:b,top:w,width:E,height:A}=x;if(y||i(),!E||!A)return;const k=ou(w),T=ou(u.clientWidth-(b+E)),C=ou(u.clientHeight-(w+A)),D=ou(b),j={rootMargin:-k+"px "+-T+"px "+-C+"px "+-D+"px",threshold:Ii(0,io(1,g))||1};let L=!0;function I(q){const H=q[0].intersectionRatio;if(!_0(x,t.getBoundingClientRect()))return f();if(H!==g){if(!L)return f();H?f(!1,H):s=setTimeout(()=>{f(!1,1e-7)},1e3)}L=!1}try{o=new IntersectionObserver(I,{...j,root:u.ownerDocument})}catch{o=new IntersectionObserver(I,j)}o.observe(t)}const p=mn(t),m=()=>f(r);return p.addEventListener("resize",m),f(!0),()=>{p.removeEventListener("resize",m),c()}}function I0(t,i,r,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:u=!0,elementResize:c=typeof ResizeObserver=="function",layoutShift:f=typeof IntersectionObserver=="function",animationFrame:p=!1}=o,m=Cm(t),y=s||u?[...m?ba(m):[],...i?ba(i):[]]:[];y.forEach(k=>{s&&k.addEventListener("scroll",r),u&&k.addEventListener("resize",r)});const g=m&&f?oD(m,r,u):null;let x=-1,b=null;c&&(b=new ResizeObserver(k=>{let[T]=k;T&&T.target===m&&b&&i&&(b.unobserve(i),cancelAnimationFrame(x),x=requestAnimationFrame(()=>{var C;(C=b)==null||C.observe(i)})),r()}),m&&!p&&b.observe(m),i&&b.observe(i));let w,E=p?ir(t):null;p&&A();function A(){const k=ir(t);E&&!_0(E,k)&&r(),E=k,w=requestAnimationFrame(A)}return r(),()=>{var k;y.forEach(T=>{s&&T.removeEventListener("scroll",r),u&&T.removeEventListener("resize",r)}),g?.(),(k=b)==null||k.disconnect(),b=null,p&&cancelAnimationFrame(w)}}const lD=FN,sD=PN,uD=BN,cD=VN,dD=(t,i,r)=>{const o=new Map,s=r??{},u={...rD,...s.platform,_c:o};return HN(t,i,{...s,platform:u})};var fD=typeof document<"u",hD=function(){},gu=fD?O.useLayoutEffect:hD;function ju(t,i){if(t===i)return!0;if(typeof t!=typeof i)return!1;if(typeof t=="function"&&t.toString()===i.toString())return!0;let r,o,s;if(t&&i&&typeof t=="object"){if(Array.isArray(t)){if(r=t.length,r!==i.length)return!1;for(o=r;o--!==0;)if(!ju(t[o],i[o]))return!1;return!0}if(s=Object.keys(t),r=s.length,r!==Object.keys(i).length)return!1;for(o=r;o--!==0;)if(!{}.hasOwnProperty.call(i,s[o]))return!1;for(o=r;o--!==0;){const u=s[o];if(!(u==="_owner"&&t.$$typeof)&&!ju(t[u],i[u]))return!1}return!0}return t!==t&&i!==i}function H0(t){return typeof window>"u"?1:(t.ownerDocument.defaultView||window).devicePixelRatio||1}function bx(t,i){const r=H0(t);return Math.round(i*r)/r}function uh(t){const i=O.useRef(t);return gu(()=>{i.current=t}),i}function mD(t){t===void 0&&(t={});const{placement:i="bottom",strategy:r="absolute",middleware:o=[],platform:s,elements:{reference:u,floating:c}={},transform:f=!0,whileElementsMounted:p,open:m}=t,[y,g]=O.useState({x:0,y:0,strategy:r,placement:i,middlewareData:{},isPositioned:!1}),[x,b]=O.useState(o);ju(x,o)||b(o);const[w,E]=O.useState(null),[A,k]=O.useState(null),T=O.useCallback(J=>{J!==j.current&&(j.current=J,E(J))},[]),C=O.useCallback(J=>{J!==L.current&&(L.current=J,k(J))},[]),D=u||w,z=c||A,j=O.useRef(null),L=O.useRef(null),I=O.useRef(y),q=p!=null,H=uh(p),Z=uh(s),oe=uh(m),ue=O.useCallback(()=>{if(!j.current||!L.current)return;const J={placement:i,strategy:r,middleware:x};Z.current&&(J.platform=Z.current),dD(j.current,L.current,J).then(be=>{const _={...be,isPositioned:oe.current!==!1};$.current&&!ju(I.current,_)&&(I.current=_,bl.flushSync(()=>{g(_)}))})},[x,i,r,Z,oe]);gu(()=>{m===!1&&I.current.isPositioned&&(I.current.isPositioned=!1,g(J=>({...J,isPositioned:!1})))},[m]);const $=O.useRef(!1);gu(()=>($.current=!0,()=>{$.current=!1}),[]),gu(()=>{if(D&&(j.current=D),z&&(L.current=z),D&&z){if(H.current)return H.current(D,z,ue);ue()}},[D,z,ue,H,q]);const N=O.useMemo(()=>({reference:j,floating:L,setReference:T,setFloating:C}),[T,C]),P=O.useMemo(()=>({reference:D,floating:z}),[D,z]),K=O.useMemo(()=>{const J={position:r,left:0,top:0};if(!P.floating)return J;const be=bx(P.floating,y.x),_=bx(P.floating,y.y);return f?{...J,transform:"translate("+be+"px, "+_+"px)",...H0(P.floating)>=1.5&&{willChange:"transform"}}:{position:r,left:be,top:_}},[r,f,P.floating,y.x,y.y]);return O.useMemo(()=>({...y,update:ue,refs:N,elements:P,floatingStyles:K}),[y,ue,N,P,K])}const B0=(t,i)=>{const r=lD(t);return{name:r.name,fn:r.fn,options:[t,i]}},q0=(t,i)=>{const r=sD(t);return{name:r.name,fn:r.fn,options:[t,i]}},pD=(t,i)=>{const r=uD(t);return{name:r.name,fn:r.fn,options:[t,i]}},gD=(t,i)=>{const r=cD(t);return{name:r.name,fn:r.fn,options:[t,i]}},yD="data-floating-ui-focusable",vx="active",xx="selected",bD={...uw};let wx=!1,vD=0;const Sx=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+vD++;function xD(){const[t,i]=O.useState(()=>wx?Sx():void 0);return Mn(()=>{t==null&&i(Sx())},[]),O.useEffect(()=>{wx=!0},[]),t}const wD=bD.useId,Rm=wD||xD;function SD(){const t=new Map;return{emit(i,r){var o;(o=t.get(i))==null||o.forEach(s=>s(r))},on(i,r){t.has(i)||t.set(i,new Set),t.get(i).add(r)},off(i,r){var o;(o=t.get(i))==null||o.delete(r)}}}const kD=O.createContext(null),AD=O.createContext(null),U0=()=>{var t;return((t=O.useContext(kD))==null?void 0:t.id)||null},Mm=()=>O.useContext(AD);function vl(t){return"data-floating-ui-"+t}function TD(t){t.current!==-1&&(clearTimeout(t.current),t.current=-1)}let kx=0;function Jr(t,i){i===void 0&&(i={});const{preventScroll:r=!1,cancelPrevious:o=!0,sync:s=!1}=i;o&&cancelAnimationFrame(kx);const u=()=>t?.focus({preventScroll:r});s?u():kx=requestAnimationFrame(u)}function ED(t){return t?.ownerDocument||document}const to={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function Ax(t){return t==="inert"?to.inert:t==="aria-hidden"?to["aria-hidden"]:to.none}let lu=new WeakSet,su={},ch=0;const CD=()=>typeof HTMLElement<"u"&&"inert"in HTMLElement.prototype;function F0(t){return t?Tu(t)?t.host:F0(t.parentNode):null}const RD=(t,i)=>i.map(r=>{if(t.contains(r))return r;const o=F0(r);return t.contains(o)?o:null}).filter(r=>r!=null);function MD(t,i,r,o){const s="data-floating-ui-inert",u=o?"inert":r?"aria-hidden":null,c=RD(i,t),f=new Set,p=new Set(c),m=[];su[s]||(su[s]=new WeakMap);const y=su[s];c.forEach(g),x(i),f.clear();function g(b){!b||f.has(b)||(f.add(b),b.parentNode&&g(b.parentNode))}function x(b){!b||p.has(b)||[].forEach.call(b.children,w=>{if(ka(w)!=="script")if(f.has(w))x(w);else{const E=u?w.getAttribute(u):null,A=E!==null&&E!=="false",k=Ax(u),T=(k.get(w)||0)+1,C=(y.get(w)||0)+1;k.set(w,T),y.set(w,C),m.push(w),T===1&&A&&lu.add(w),C===1&&w.setAttribute(s,""),!A&&u&&w.setAttribute(u,u==="inert"?"":"true")}})}return ch++,()=>{m.forEach(b=>{const w=Ax(u),A=(w.get(b)||0)-1,k=(y.get(b)||0)-1;w.set(b,A),y.set(b,k),A||(!lu.has(b)&&u&&b.removeAttribute(u),lu.delete(b)),k||b.removeAttribute(s)}),ch--,ch||(to.inert=new WeakMap,to["aria-hidden"]=new WeakMap,to.none=new WeakMap,lu=new WeakSet,su={})}}function Tx(t,i,r){i===void 0&&(i=!1),r===void 0&&(r=!1);const o=ED(t[0]).body;return MD(t.concat(Array.from(o.querySelectorAll('[aria-live],[role="status"],output'))),o,i,r)}const Nm={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0},Lu=O.forwardRef(function(i,r){const[o,s]=O.useState();Mn(()=>{SN()&&s("button")},[]);const u={ref:r,tabIndex:0,role:o,"aria-hidden":o?void 0:!0,[vl("focus-guard")]:"",style:Nm};return v.jsx("span",{...i,...u})}),ND={clipPath:"inset(50%)",position:"fixed",top:0,left:0},P0=O.createContext(null),Ex=vl("portal");function DD(t){t===void 0&&(t={});const{id:i,root:r}=t,o=Rm(),s=G0(),[u,c]=O.useState(null),f=O.useRef(null);return Mn(()=>()=>{u?.remove(),queueMicrotask(()=>{f.current=null})},[u]),Mn(()=>{if(!o||f.current)return;const p=i?document.getElementById(i):null;if(!p)return;const m=document.createElement("div");m.id=o,m.setAttribute(Ex,""),p.appendChild(m),f.current=m,c(m)},[i,o]),Mn(()=>{if(r===null||!o||f.current)return;let p=r||s?.portalNode;p&&!Tm(p)&&(p=p.current),p=p||document.body;let m=null;i&&(m=document.createElement("div"),m.id=i,p.appendChild(m));const y=document.createElement("div");y.id=o,y.setAttribute(Ex,""),p=m||p,p.appendChild(y),f.current=y,c(y)},[i,r,o,s]),u}function V0(t){const{children:i,id:r,root:o,preserveTabOrder:s=!0}=t,u=DD({id:r,root:o}),[c,f]=O.useState(null),p=O.useRef(null),m=O.useRef(null),y=O.useRef(null),g=O.useRef(null),x=c?.modal,b=c?.open,w=!!c&&!c.modal&&c.open&&s&&!!(o||u);return O.useEffect(()=>{if(!u||!s||x)return;function E(A){u&&hl(A)&&(A.type==="focusin"?mx:zN)(u)}return u.addEventListener("focusin",E,!0),u.addEventListener("focusout",E,!0),()=>{u.removeEventListener("focusin",E,!0),u.removeEventListener("focusout",E,!0)}},[u,s,x]),O.useEffect(()=>{u&&(b||mx(u))},[b,u]),v.jsxs(P0.Provider,{value:O.useMemo(()=>({preserveTabOrder:s,beforeOutsideRef:p,afterOutsideRef:m,beforeInsideRef:y,afterInsideRef:g,portalNode:u,setFocusManagerState:f}),[s,u]),children:[w&&u&&v.jsx(Lu,{"data-type":"outside",ref:p,onFocus:E=>{if(hl(E,u)){var A;(A=y.current)==null||A.focus()}else{const k=c?c.domReference:null,T=D0(k);T?.focus()}}}),w&&u&&v.jsx("span",{"aria-owns":u.id,style:ND}),u&&bl.createPortal(i,u),w&&u&&v.jsx(Lu,{"data-type":"outside",ref:m,onFocus:E=>{if(hl(E,u)){var A;(A=g.current)==null||A.focus()}else{const k=c?c.domReference:null,T=N0(k);T?.focus(),c?.closeOnFocusOut&&c?.onOpenChange(!1,E.nativeEvent,"focus-out")}}})]})}const G0=()=>O.useContext(P0);function Cx(t){return O.useMemo(()=>i=>{t.forEach(r=>{r&&(r.current=i)})},t)}const Rx=20;let ga=[];function Dm(){ga=ga.filter(t=>{var i;return(i=t.deref())==null?void 0:i.isConnected})}function OD(t){Dm(),t&&ka(t)!=="body"&&(ga.push(new WeakRef(t)),ga.length>Rx&&(ga=ga.slice(-Rx)))}function Mx(){Dm();const t=ga[ga.length-1];return t?.deref()}function jD(t){const i=Cl();return E0(t,i)?t:ec(t,i)[0]||t}function Nx(t,i){var r;if(!i.current.includes("floating")&&!((r=t.getAttribute("role"))!=null&&r.includes("dialog")))return;const o=Cl(),u=wN(t,o).filter(f=>{const p=f.getAttribute("data-tabindex")||"";return E0(f,o)||f.hasAttribute("data-tabindex")&&!p.startsWith("-")}),c=t.getAttribute("tabindex");i.current.includes("floating")||u.length===0?c!=="0"&&t.setAttribute("tabindex","0"):(c!=="-1"||t.hasAttribute("data-tabindex")&&t.getAttribute("data-tabindex")!=="-1")&&(t.setAttribute("tabindex","-1"),t.setAttribute("data-tabindex","-1"))}const LD=O.forwardRef(function(i,r){return v.jsx("button",{...i,type:"button",ref:r,tabIndex:-1,style:Nm})});function zD(t){const{context:i,children:r,disabled:o=!1,order:s=["content"],guards:u=!0,initialFocus:c=0,returnFocus:f=!0,restoreFocus:p=!1,modal:m=!0,visuallyHiddenDismiss:y=!1,closeOnFocusOut:g=!0,outsideElementsInert:x=!1,getInsideElements:b=()=>[]}=t,{open:w,onOpenChange:E,events:A,dataRef:k,elements:{domReference:T,floating:C}}=i,D=mi(()=>{var se;return(se=k.current.floatingContext)==null?void 0:se.nodeId}),z=mi(b),j=typeof c=="number"&&c<0,L=fx(T)&&j,I=CD(),q=I?u:!0,H=!q||I&&x,Z=lh(s),oe=lh(c),ue=lh(f),$=Mm(),N=G0(),P=O.useRef(null),K=O.useRef(null),J=O.useRef(!1),be=O.useRef(!1),_=O.useRef(-1),He=O.useRef(-1),Ee=N!=null,B=Vh(C),U=mi(function(se){return se===void 0&&(se=B),se?ec(se,Cl()):[]}),ne=mi(se=>{const ve=U(se);return Z.current.map(Ce=>T&&Ce==="reference"?T:B&&Ce==="floating"?B:ve).filter(Boolean).flat()});O.useEffect(()=>{if(o||!m)return;function se(Ce){if(Ce.key==="Tab"){Rn(B,Qr(Jn(B)))&&U().length===0&&!L&&oh(Ce);const Me=ne(),ce=pa(Ce);Z.current[0]==="reference"&&ce===T&&(oh(Ce),Ce.shiftKey?Jr(Me[Me.length-1]):Jr(Me[1])),Z.current[1]==="floating"&&ce===B&&Ce.shiftKey&&(oh(Ce),Jr(Me[0]))}}const ve=Jn(B);return ve.addEventListener("keydown",se),()=>{ve.removeEventListener("keydown",se)}},[o,T,B,m,Z,L,U,ne]),O.useEffect(()=>{if(o||!C)return;function se(ve){const Ce=pa(ve),ce=U().indexOf(Ce);ce!==-1&&(_.current=ce)}return C.addEventListener("focusin",se),()=>{C.removeEventListener("focusin",se)}},[o,C,U]),O.useEffect(()=>{if(o||!g)return;function se(){be.current=!0,setTimeout(()=>{be.current=!1})}function ve(ce){const xe=ce.relatedTarget,Ne=ce.currentTarget,Be=pa(ce);queueMicrotask(()=>{const X=D(),Le=!(Rn(T,xe)||Rn(C,xe)||Rn(xe,C)||Rn(N?.portalNode,xe)||xe!=null&&xe.hasAttribute(vl("focus-guard"))||$&&(Wr($.nodesRef.current,X).find(ie=>{var ye,Ae;return Rn((ye=ie.context)==null?void 0:ye.elements.floating,xe)||Rn((Ae=ie.context)==null?void 0:Ae.elements.domReference,xe)})||hx($.nodesRef.current,X).find(ie=>{var ye,Ae,me;return[(ye=ie.context)==null?void 0:ye.elements.floating,Vh((Ae=ie.context)==null?void 0:Ae.elements.floating)].includes(xe)||((me=ie.context)==null?void 0:me.elements.domReference)===xe})));if(Ne===T&&B&&Nx(B,Z),p&&Ne!==T&&!(Be!=null&&Be.isConnected)&&Qr(Jn(B))===Jn(B).body){rn(B)&&B.focus();const ie=_.current,ye=U(),Ae=ye[ie]||ye[ye.length-1]||B;rn(Ae)&&Ae.focus()}if(k.current.insideReactTree){k.current.insideReactTree=!1;return}(L||!m)&&xe&&Le&&!be.current&&xe!==Mx()&&(J.current=!0,E(!1,ce,"focus-out"))})}const Ce=!!(!$&&N);function Me(){TD(He),k.current.insideReactTree=!0,He.current=window.setTimeout(()=>{k.current.insideReactTree=!1})}if(C&&rn(T))return T.addEventListener("focusout",ve),T.addEventListener("pointerdown",se),C.addEventListener("focusout",ve),Ce&&C.addEventListener("focusout",Me,!0),()=>{T.removeEventListener("focusout",ve),T.removeEventListener("pointerdown",se),C.removeEventListener("focusout",ve),Ce&&C.removeEventListener("focusout",Me,!0)}},[o,T,C,B,m,$,N,E,g,p,U,L,D,Z,k]);const he=O.useRef(null),ee=O.useRef(null),pe=Cx([he,N?.beforeInsideRef]),ge=Cx([ee,N?.afterInsideRef]);O.useEffect(()=>{var se,ve;if(o||!C)return;const Ce=Array.from((N==null||(se=N.portalNode)==null?void 0:se.querySelectorAll("["+vl("portal")+"]"))||[]),ce=(ve=($?hx($.nodesRef.current,D()):[]).find(Be=>{var X;return fx(((X=Be.context)==null?void 0:X.elements.domReference)||null)}))==null||(ve=ve.context)==null?void 0:ve.elements.domReference,xe=[C,ce,...Ce,...z(),P.current,K.current,he.current,ee.current,N?.beforeOutsideRef.current,N?.afterOutsideRef.current,Z.current.includes("reference")||L?T:null].filter(Be=>Be!=null),Ne=m||L?Tx(xe,!H,H):Tx(xe);return()=>{Ne()}},[o,T,C,m,Z,N,L,q,H,$,D,z]),Mn(()=>{if(o||!rn(B))return;const se=Jn(B),ve=Qr(se);queueMicrotask(()=>{const Ce=ne(B),Me=oe.current,ce=(typeof Me=="number"?Ce[Me]:Me.current)||B,xe=Rn(B,ve);!j&&!xe&&w&&Jr(ce,{preventScroll:ce===B})})},[o,w,B,j,ne,oe]),Mn(()=>{if(o||!B)return;const se=Jn(B),ve=Qr(se);OD(ve);function Ce(xe){let{reason:Ne,event:Be,nested:X}=xe;if(["hover","safe-polygon"].includes(Ne)&&Be.type==="mouseleave"&&(J.current=!0),Ne==="outside-press")if(X)J.current=!1;else if(RN(Be)||MN(Be))J.current=!1;else{let Le=!1;document.createElement("div").focus({get preventScroll(){return Le=!0,!1}}),Le?J.current=!1:J.current=!0}}A.on("openchange",Ce);const Me=se.createElement("span");Me.setAttribute("tabindex","-1"),Me.setAttribute("aria-hidden","true"),Object.assign(Me.style,Nm),Ee&&T&&T.insertAdjacentElement("afterend",Me);function ce(){if(typeof ue.current=="boolean"){const xe=T||Mx();return xe&&xe.isConnected?xe:Me}return ue.current.current||Me}return()=>{A.off("openchange",Ce);const xe=Qr(se),Ne=Rn(C,xe)||$&&Wr($.nodesRef.current,D(),!1).some(X=>{var Le;return Rn((Le=X.context)==null?void 0:Le.elements.floating,xe)}),Be=ce();queueMicrotask(()=>{const X=jD(Be);ue.current&&!J.current&&rn(X)&&(!(X!==xe&&xe!==se.body)||Ne)&&X.focus({preventScroll:!0}),Me.remove()})}},[o,C,B,ue,k,A,$,Ee,T,D]),O.useEffect(()=>(queueMicrotask(()=>{J.current=!1}),()=>{queueMicrotask(Dm)}),[o]),Mn(()=>{if(!o&&N)return N.setFocusManagerState({modal:m,closeOnFocusOut:g,open:w,onOpenChange:E,domReference:T}),()=>{N.setFocusManagerState(null)}},[o,N,m,w,E,g,T]),Mn(()=>{o||B&&Nx(B,Z)},[o,B,Z]);function ke(se){return o||!y||!m?null:v.jsx(LD,{ref:se==="start"?P:K,onClick:ve=>E(!1,ve.nativeEvent),children:typeof y=="string"?y:"Dismiss"})}const le=!o&&q&&(m?!L:!0)&&(Ee||m);return v.jsxs(v.Fragment,{children:[le&&v.jsx(Lu,{"data-type":"inside",ref:pe,onFocus:se=>{if(m){const Ce=ne();Jr(s[0]==="reference"?Ce[0]:Ce[Ce.length-1])}else if(N!=null&&N.preserveTabOrder&&N.portalNode)if(J.current=!1,hl(se,N.portalNode)){const Ce=N0(T);Ce?.focus()}else{var ve;(ve=N.beforeOutsideRef.current)==null||ve.focus()}}}),!L&&ke("start"),r,ke("end"),le&&v.jsx(Lu,{"data-type":"inside",ref:ge,onFocus:se=>{if(m)Jr(ne()[0]);else if(N!=null&&N.preserveTabOrder&&N.portalNode)if(g&&(J.current=!0),hl(se,N.portalNode)){const Ce=D0(T);Ce?.focus()}else{var ve;(ve=N.afterOutsideRef.current)==null||ve.focus()}}})]})}let uu=0;const Dx="--floating-ui-scrollbar-width";function _D(){const t=C0(),i=/iP(hone|ad|od)|iOS/.test(t)||t==="MacIntel"&&navigator.maxTouchPoints>1,r=document.body.style,s=Math.round(document.documentElement.getBoundingClientRect().left)+document.documentElement.scrollLeft?"paddingLeft":"paddingRight",u=window.innerWidth-document.documentElement.clientWidth,c=r.left?parseFloat(r.left):window.scrollX,f=r.top?parseFloat(r.top):window.scrollY;if(r.overflow="hidden",r.setProperty(Dx,u+"px"),u&&(r[s]=u+"px"),i){var p,m;const y=((p=window.visualViewport)==null?void 0:p.offsetLeft)||0,g=((m=window.visualViewport)==null?void 0:m.offsetTop)||0;Object.assign(r,{position:"fixed",top:-(f-Math.floor(g))+"px",left:-(c-Math.floor(y))+"px",right:"0"})}return()=>{Object.assign(r,{overflow:"",[s]:""}),r.removeProperty(Dx),i&&(Object.assign(r,{position:"",top:"",left:"",right:""}),window.scrollTo(c,f))}}let Ox=()=>{};const ID=O.forwardRef(function(i,r){const{lockScroll:o=!1,...s}=i;return Mn(()=>{if(o)return uu++,uu===1&&(Ox=_D()),()=>{uu--,uu===0&&Ox()}},[o]),v.jsx("div",{ref:r,...s,style:{position:"fixed",overflow:"auto",top:0,right:0,bottom:0,left:0,...s.style}})}),HD={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},BD={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},jx=t=>{var i,r;return{escapeKey:typeof t=="boolean"?t:(i=t?.escapeKey)!=null?i:!1,outsidePress:typeof t=="boolean"?t:(r=t?.outsidePress)!=null?r:!0}};function qD(t,i){i===void 0&&(i={});const{open:r,onOpenChange:o,elements:s,dataRef:u}=t,{enabled:c=!0,escapeKey:f=!0,outsidePress:p=!0,outsidePressEvent:m="pointerdown",referencePress:y=!1,referencePressEvent:g="pointerdown",ancestorScroll:x=!1,bubbles:b,capture:w}=i,E=Mm(),A=mi(typeof p=="function"?p:()=>!1),k=typeof p=="function"?A:p,T=O.useRef(!1),{escapeKey:C,outsidePress:D}=jx(b),{escapeKey:z,outsidePress:j}=jx(w),L=O.useRef(!1),I=mi($=>{var N;if(!r||!c||!f||$.key!=="Escape"||L.current)return;const P=(N=u.current.floatingContext)==null?void 0:N.nodeId,K=E?Wr(E.nodesRef.current,P):[];if(!C&&($.stopPropagation(),K.length>0)){let J=!0;if(K.forEach(be=>{var _;if((_=be.context)!=null&&_.open&&!be.context.dataRef.current.__escapeKeyBubbles){J=!1;return}}),!J)return}o(!1,CN($)?$.nativeEvent:$,"escape-key")}),q=mi($=>{var N;const P=()=>{var K;I($),(K=pa($))==null||K.removeEventListener("keydown",P)};(N=pa($))==null||N.addEventListener("keydown",P)}),H=mi($=>{var N;const P=u.current.insideReactTree;u.current.insideReactTree=!1;const K=T.current;if(T.current=!1,m==="click"&&K||P||typeof k=="function"&&!k($))return;const J=pa($),be="["+vl("inert")+"]",_=Jn(s.floating).querySelectorAll(be);let He=jt(J)?J:null;for(;He&&!ya(He);){const ne=wa(He);if(ya(ne)||!jt(ne))break;He=ne}if(_.length&&jt(J)&&!TN(J)&&!Rn(J,s.floating)&&Array.from(_).every(ne=>!Rn(He,ne)))return;if(rn(J)&&ue){const ne=ya(J),he=ei(J),ee=/auto|scroll/,pe=ne||ee.test(he.overflowX),ge=ne||ee.test(he.overflowY),ke=pe&&J.clientWidth>0&&J.scrollWidth>J.clientWidth,le=ge&&J.clientHeight>0&&J.scrollHeight>J.clientHeight,se=he.direction==="rtl",ve=le&&(se?$.offsetX<=J.offsetWidth-J.clientWidth:$.offsetX>J.clientWidth),Ce=ke&&$.offsetY>J.clientHeight;if(ve||Ce)return}const Ee=(N=u.current.floatingContext)==null?void 0:N.nodeId,B=E&&Wr(E.nodesRef.current,Ee).some(ne=>{var he;return rh($,(he=ne.context)==null?void 0:he.elements.floating)});if(rh($,s.floating)||rh($,s.domReference)||B)return;const U=E?Wr(E.nodesRef.current,Ee):[];if(U.length>0){let ne=!0;if(U.forEach(he=>{var ee;if((ee=he.context)!=null&&ee.open&&!he.context.dataRef.current.__outsidePressBubbles){ne=!1;return}}),!ne)return}o(!1,$,"outside-press")}),Z=mi($=>{var N;const P=()=>{var K;H($),(K=pa($))==null||K.removeEventListener(m,P)};(N=pa($))==null||N.addEventListener(m,P)});O.useEffect(()=>{if(!r||!c)return;u.current.__escapeKeyBubbles=C,u.current.__outsidePressBubbles=D;let $=-1;function N(_){o(!1,_,"ancestor-scroll")}function P(){window.clearTimeout($),L.current=!0}function K(){$=window.setTimeout(()=>{L.current=!1},Ku()?5:0)}const J=Jn(s.floating);f&&(J.addEventListener("keydown",z?q:I,z),J.addEventListener("compositionstart",P),J.addEventListener("compositionend",K)),k&&J.addEventListener(m,j?Z:H,j);let be=[];return x&&(jt(s.domReference)&&(be=ba(s.domReference)),jt(s.floating)&&(be=be.concat(ba(s.floating))),!jt(s.reference)&&s.reference&&s.reference.contextElement&&(be=be.concat(ba(s.reference.contextElement)))),be=be.filter(_=>{var He;return _!==((He=J.defaultView)==null?void 0:He.visualViewport)}),be.forEach(_=>{_.addEventListener("scroll",N)}),()=>{f&&(J.removeEventListener("keydown",z?q:I,z),J.removeEventListener("compositionstart",P),J.removeEventListener("compositionend",K)),k&&J.removeEventListener(m,j?Z:H,j),be.forEach(_=>{_.removeEventListener("scroll",N)}),window.clearTimeout($)}},[u,s,f,k,m,r,o,x,c,C,D,I,z,q,H,j,Z]),O.useEffect(()=>{u.current.insideReactTree=!1},[u,k,m]);const oe=O.useMemo(()=>({onKeyDown:I,...y&&{[HD[g]]:$=>{o(!1,$.nativeEvent,"reference-press")},...g!=="click"&&{onClick($){o(!1,$.nativeEvent,"reference-press")}}}}),[I,o,y,g]),ue=O.useMemo(()=>{function $(N){N.button===0&&(T.current=!0)}return{onKeyDown:I,onMouseDown:$,onMouseUp:$,[BD[m]]:()=>{u.current.insideReactTree=!0}}},[I,m,u]);return O.useMemo(()=>c?{reference:oe,floating:ue}:{},[c,oe,ue])}function UD(t){const{open:i=!1,onOpenChange:r,elements:o}=t,s=Rm(),u=O.useRef({}),[c]=O.useState(()=>SD()),f=U0()!=null,[p,m]=O.useState(o.reference),y=mi((b,w,E)=>{u.current.openEvent=b?w:void 0,c.emit("openchange",{open:b,event:w,reason:E,nested:f}),r?.(b,w,E)}),g=O.useMemo(()=>({setPositionReference:m}),[]),x=O.useMemo(()=>({reference:p||o.reference||null,floating:o.floating||null,domReference:o.reference}),[p,o.reference,o.floating]);return O.useMemo(()=>({dataRef:u,open:i,onOpenChange:y,elements:x,events:c,floatingId:s,refs:g}),[i,y,x,c,s,g])}function $0(t){var i,r;let{elements:o,...s}=t===void 0?{}:t;const{nodeId:u}=s,c=UD({...s,elements:{reference:(i=o?.reference)!=null?i:null,floating:(r=o?.floating)!=null?r:null}}),f=s.rootContext||c,p=f.elements,[m,y]=O.useState(null),[g,x]=O.useState(null),w=p?.domReference||m,E=O.useRef(null),A=Mm();Mn(()=>{w&&(E.current=w)},[w]);const k=mD({...s,elements:{...p,...g&&{reference:g}}}),T=O.useCallback(L=>{const I=jt(L)?{getBoundingClientRect:()=>L.getBoundingClientRect(),getClientRects:()=>L.getClientRects(),contextElement:L}:L;x(I),k.refs.setReference(I)},[k.refs]),C=O.useCallback(L=>{(jt(L)||L===null)&&(E.current=L,y(L)),(jt(k.refs.reference.current)||k.refs.reference.current===null||L!==null&&!jt(L))&&k.refs.setReference(L)},[k.refs]),D=O.useMemo(()=>({...k.refs,setReference:C,setPositionReference:T,domReference:E}),[k.refs,C,T]),z=O.useMemo(()=>({...k.elements,domReference:w}),[k.elements,w]),j=O.useMemo(()=>({...k,...f,refs:D,elements:z,nodeId:u}),[k,D,z,u,f]);return Mn(()=>{f.dataRef.current.floatingContext=j;const L=A?.nodesRef.current.find(I=>I.id===u);L&&(L.context=j)}),O.useMemo(()=>({...k,context:j,refs:D,elements:z}),[k,D,z,j])}function dh(t,i,r){const o=new Map,s=r==="item";let u=t;if(s&&t){const{[vx]:c,[xx]:f,...p}=t;u=p}return{...r==="floating"&&{tabIndex:-1,[yD]:""},...u,...i.map(c=>{const f=c?c[r]:null;return typeof f=="function"?t?f(t):null:f}).concat(t).reduce((c,f)=>(f&&Object.entries(f).forEach(p=>{let[m,y]=p;if(!(s&&[vx,xx].includes(m)))if(m.indexOf("on")===0){if(o.has(m)||o.set(m,[]),typeof y=="function"){var g;(g=o.get(m))==null||g.push(y),c[m]=function(){for(var x,b=arguments.length,w=new Array(b),E=0;E<b;E++)w[E]=arguments[E];return(x=o.get(m))==null?void 0:x.map(A=>A(...w)).find(A=>A!==void 0)}}}else c[m]=y}),c),{})}}function FD(t){t===void 0&&(t=[]);const i=t.map(f=>f?.reference),r=t.map(f=>f?.floating),o=t.map(f=>f?.item),s=O.useCallback(f=>dh(f,t,"reference"),i),u=O.useCallback(f=>dh(f,t,"floating"),r),c=O.useCallback(f=>dh(f,t,"item"),o);return O.useMemo(()=>({getReferenceProps:s,getFloatingProps:u,getItemProps:c}),[s,u,c])}const PD=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function VD(t,i){var r,o;i===void 0&&(i={});const{open:s,elements:u,floatingId:c}=t,{enabled:f=!0,role:p="dialog"}=i,m=Rm(),y=((r=u.domReference)==null?void 0:r.id)||m,g=O.useMemo(()=>{var T;return((T=Vh(u.floating))==null?void 0:T.id)||c},[u.floating,c]),x=(o=PD.get(p))!=null?o:p,w=U0()!=null,E=O.useMemo(()=>x==="tooltip"||p==="label"?{["aria-"+(p==="label"?"labelledby":"describedby")]:s?g:void 0}:{"aria-expanded":s?"true":"false","aria-haspopup":x==="alertdialog"?"dialog":x,"aria-controls":s?g:void 0,...x==="listbox"&&{role:"combobox"},...x==="menu"&&{id:y},...x==="menu"&&w&&{role:"menuitem"},...p==="select"&&{"aria-autocomplete":"none"},...p==="combobox"&&{"aria-autocomplete":"list"}},[x,g,w,s,y,p]),A=O.useMemo(()=>{const T={id:g,...x&&{role:x}};return x==="tooltip"||p==="label"?T:{...T,...x==="menu"&&{"aria-labelledby":y}}},[x,g,y,p]),k=O.useCallback(T=>{let{active:C,selected:D}=T;const z={role:"option",...C&&{id:g+"-fui-option"}};switch(p){case"select":case"combobox":return{...z,"aria-selected":D}}return{}},[g,p]);return O.useMemo(()=>f?{reference:E,floating:A,item:k}:{},[f,E,A,k])}const fh=t=>t?.playState==="running"||t?.playState==="paused",Lx=(t,i)=>{const r=parseFloat(t)*(t.endsWith("ms")?1:1e3);return Number.isFinite(r)&&r>0?r:i};function GD(t,i,r,o,s,u,c,f,p,m){const y=O.useRef(null),g=O.useRef(null),x=O.useRef(null),b=O.useRef(null),w=O.useRef(null),E=O.useRef(null),A=O.useRef({open:o,onExit:m});A.current={open:o,onExit:m},_t(()=>{if(!t||!i||!u)return;const k=E.current?.id===c,T=k&&E.current?.expanded!==s,C=!k||E.current?.open!==o||T,D=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!C&&!D)return;const z=getComputedStyle(t),j=t.querySelector(".limr-overlay-surface"),L=t.querySelector(".limr-overlay-card"),I=k?x.current?.effect?.target:null,q=T||s?L:I?.isConnected?I:t.querySelector("[data-limr-card-body], .limr-overlay-content"),H=q?getComputedStyle(q):null,Z={opacity:z.opacity,clipPath:z.clipPath},oe=z.transform,ue={opacity:H?.opacity??"1",transform:H?.transform??"none",clipPath:H?.clipPath??"none"};let $=k?y.current:s?p??null:null;if($&&k&&b.current&&z.transform!=="none"){const ve=new DOMMatrixReadOnly(z.transform);$=new DOMRect($.x+ve.m41,$.y+ve.m42,$.width,$.height)}if($&&k&&j&&w.current){const ve=new DOMMatrixReadOnly(getComputedStyle(j).transform);$=new DOMRect($.x,$.y,$.width*ve.a,$.height*ve.d)}const N=i.getBoundingClientRect(),P=r?.getBoundingClientRect()??N,K=Math.max(0,Math.min(100,((P.left+P.right)/2-N.left)/Math.max(1,N.width)*100)),J=z.borderRadius||"8px",be=`inset(${f==="bottom"?100:0}% ${100-K}% ${f==="bottom"?0:100}% ${K}% round ${J})`,_=Math.max(48,($?.width??0)-N.width+48,($?.height??0)-N.height+48),He=`inset(-${_}px -${_}px -${_}px -${_}px round ${J})`;if(g.current?.cancel(),x.current?.cancel(),b.current?.cancel(),w.current?.cancel(),g.current=x.current=b.current=w.current=null,E.current={id:c,expanded:s,open:o},y.current=N,D||!o&&!k){delete t.dataset.motion,o||A.current.onExit();return}const B=Lx((z.getPropertyValue("--limr-overlay-duration")||z.getPropertyValue("--limr-overlay-enter-duration")).trim(),560),U=Lx(z.getPropertyValue("--limr-overlay-morph-duration").trim(),480),ne=o&&!!$&&(T||!k&&s),he=!o&&s&&!!p,ee=he?p:N,pe=ne||s?U:B,ge=z.getPropertyValue("--limr-overlay-ease").trim()||"cubic-bezier(.22,1,.36,1)";if(t.dataset.motion=o?ne?"morphing":"opening":"closing",g.current=t.animate([k?{...Z,...ne?{clipPath:He}:{}}:{opacity:0,clipPath:ne?He:be},{opacity:o?1:0,clipPath:o||he?He:be}],{duration:pe,easing:ge,fill:"both"}),$&&(ne||oe!=="none"||he)){const ve=$.left-N.left,Ce=$.top-N.top,Me=$.width/Math.max(1,N.width),ce=$.height/Math.max(1,N.height);b.current=t.animate([{transform:`translate(${ve}px, ${Ce}px)`},{transform:`translate(${ee.left-N.left}px, ${ee.top-N.top}px)`}],{duration:pe,easing:ge,fill:"both"}),w.current=j?.animate([{transform:`scale(${Me}, ${ce})`},{transform:`scale(${ee.width/Math.max(1,N.width)}, ${ee.height/Math.max(1,N.height)})`}],{duration:pe,easing:ge,fill:"both"})??null}const ke=o?ne?50:k?0:35:0;x.current=q?.animate([k&&!ne?ue:{opacity:0,transform:"translateY(6px)",clipPath:ne?`inset(0px ${Math.max(0,N.width-$.width)}px ${Math.max(0,N.height-$.height)}px 0px)`:"inset(0px)"},{opacity:o?1:0,transform:o?"translateY(0px)":"translateY(-4px)",clipPath:he?`inset(0px ${Math.max(0,N.width-ee.width)}px ${Math.max(0,N.height-ee.height)}px 0px)`:"inset(0px)"}],{duration:pe-ke,delay:ke,easing:ge,fill:"both"})??null;const le=g.current,se=()=>{g.current===le&&([g.current,x.current,b.current,w.current].some(fh)||(delete t.dataset.motion,A.current.open?y.current=i.getBoundingClientRect():A.current.onExit()))};for(const ve of[g.current,x.current,b.current,w.current])ve&&(ve.onfinish=se);se()},[t,i,r,o,s,u,c,f,p]),_t(()=>{i&&o&&u&&!fh(b.current)&&(y.current=i.getBoundingClientRect())}),_t(()=>{if(!i||!o)return;const k=new ResizeObserver(()=>{fh(b.current)||(y.current=i.getBoundingClientRect())});return k.observe(i),()=>k.disconnect()},[i,o,c]),_t(()=>()=>{g.current?.cancel(),x.current?.cancel(),b.current?.cancel(),w.current?.cancel(),g.current=x.current=b.current=w.current=null,E.current=null,y.current=null,t&&delete t.dataset.motion},[t])}const ll=t=>typeof t=="number"?`${t}px`:t,$D=()=>()=>{};function Om({disabled:t=!1,portalRoot:i,previewWidth:r=340,maxHeight:o="80dvh"}){const s=xt(),u=oo(),c=Al(),f=Wn(),p=Ve(s.interaction,Je=>Je.editing),m=Ve(s.interaction,Je=>Je.active),y=Ve(s.interaction,Je=>Je.hovered),g=Ve(s.decorations,Je=>Je.occurrences);O.useSyncExternalStore(s.layout.subscribe,s.layout.get,s.layout.get);const[x,b]=O.useState(null),[w,E]=O.useState(null),[,A]=O.useState(0);O.useEffect(()=>{if(m||t){b(null);return}if(y){b(y);return}const Je=setTimeout(()=>b(null),90);return()=>clearTimeout(Je)},[y,m,t]),O.useEffect(()=>{const Je=()=>A(pt=>pt+1);return window.visualViewport?.addEventListener("resize",Je),window.visualViewport?.addEventListener("scroll",Je),window.addEventListener("resize",Je),()=>{window.visualViewport?.removeEventListener("resize",Je),window.visualViewport?.removeEventListener("scroll",Je),window.removeEventListener("resize",Je)}},[]);const k=m??x,T=g.find(Je=>Je.id===k),[C,D]=O.useState(null),z=T??C,j=z?.id,L=Ve(s.decorations,Je=>Je.annotations.get(z?.annotationIds[0]??"")),I=Ve(s.configuration,()=>s.annotationTypes.get(L?.type??"citation")),q=I?.overlay?.expand,H=typeof q=="function"?L&&q(L):q,Z=m===j,oe=Z&&!!H&&w!==j,[ue,$]=O.useState(!1),[N,P]=O.useState(!1),K=!!T&&!t;O.useSyncExternalStore(K?s.viewport.subscribe:$D,s.viewport.get,s.viewport.get),O.useEffect(()=>{K&&(D(T),$(oe),P(Z))},[T,K,oe,Z]);const J=()=>{(j?s.anchors.get(j):null)?.focus({preventScroll:!0}),s.activate(null),s.hover(null),b(null)},be=j?s.anchors.get(j):void 0,[_,He]=O.useState(null),Ee=_?.id===j?_:null,B=K?oe:ue,U=K&&B&&!Ee,ne=B&&!U,he=K?Z:N,ee=ne&&H&&H.placement==="center",pe=ne&&!ee&&Ee,{refs:ge,update:ke,floatingStyles:le,context:se,isPositioned:ve,placement:Ce,middlewareData:Me}=$0({open:K,elements:{reference:be??null},onOpenChange:Je=>{Je||J()},strategy:"fixed",transform:!1,placement:"bottom-start",whileElementsMounted:I0,middleware:[B0(8),pD({padding:12}),q0({padding:12}),gD({padding:12,apply:({availableHeight:Je,elements:pt})=>{ne?!ee&&!Ee&&(pt.floating.style.maxHeight=`min(${ll(H&&H.maxHeight||o)}, ${Math.max(0,Math.floor(Je))}px)`):pt.floating.style.maxHeight=`${Math.max(0,Math.floor(Math.min(360,Je)))}px`}},[ne,!!ee,!!Ee,H&&H.maxHeight,o]),{name:"limrAnchor",options:ne,fn:({elements:Je})=>({data:{id:Je.reference.dataset?.limrAnchor,expanded:ne}})}]});_t(()=>{K&&be&&ke()},[be,ke,K,ne]);const ce=qD(se,{escapeKey:!0,outsidePress:!0}),xe=VD(se,{role:"dialog"}),{getFloatingProps:Ne}=FD([ce,xe]),Be=!!ee||!!pe||!K||ve&&Me.limrAnchor?.id===j&&Me.limrAnchor?.expanded===ne,[X,Le]=O.useState(null),ie=(ne?Ee?.placement??"bottom":Ce).startsWith("top")?"bottom":"top";if(GD(X,ge.floating.current,be,K,ne,Be&&!U,j,ie,Ee?.rect,()=>{D(null),E(null),He(null)}),_t(()=>{if(!ne&&K&&Be&&ge.floating.current){const Je=ge.floating.current.getBoundingClientRect();(!Ee||Ee.placement!==Ce||["x","y","width","height"].some(pt=>Math.abs(Je[pt]-Ee.rect[pt])>.5))&&He({id:j,rect:Je,placement:Ce})}}),!z||t)return null;const ye=window.visualViewport,Ae=ye?.offsetLeft??0,me=ye?.offsetTop??0,je=ye?.width??window.innerWidth,V=ye?.height??window.innerHeight,R=me+12,we=me+V-12,De=Math.max(0,we-R),ze=ne&&H?H:void 0,Fe=`min(${ll(ze?.width??(ee?640:I?.overlay?.previewWidth??r))}, ${Math.max(0,je-24)}px)`;let qe={...le,width:Fe,maxHeight:Math.min(360,V-24)};if(ze){if(qe={...qe,height:ze.height===void 0?void 0:`min(${ll(ze.height)}, ${De}px)`,maxHeight:`min(${ll(ze.maxHeight??o)}, ${De}px)`},ee)qe={...qe,left:Ae+je/2,top:me+V/2,transform:"translate(-50%, -50%)"};else if(Ee){const Je=Ee.placement.startsWith("top"),pt=Math.max(0,Je?Ee.rect.bottom-R:we-Ee.rect.top);qe={...qe,left:Ee.rect.left,top:Je?Ee.rect.bottom:Ee.rect.top,transform:Je?"translateY(-100%)":"none",maxWidth:Ae+je-12-Ee.rect.left,maxHeight:`min(${ll(ze.maxHeight??o)}, ${pt}px)`}}}const tt=I?.overlay?.Card,St={annotation:L??{id:z.annotationIds[0],type:"unknown"},occurrence:z,presentation:ne?"expanded":"preview",expanded:ne,pinned:he,canExpand:!!H,expand:()=>{E(null),s.activate(z.id)},collapse:()=>{E(z.id),s.activate(z.id)},close:J,children:v.jsx(m0,{occurrence:z,presentation:ne?"expanded":"preview",expanded:ne})},ht=K&&!!ee,yi=v.jsx(zD,{context:se,modal:ht,disabled:!K||!Z||U,initialFocus:p?-1:ge.floating,returnFocus:!1,children:v.jsx("div",{ref:ge.setFloating,...Ne(),tabIndex:-1,"aria-label":I?.label??f.annotations,className:"limr-overlay-positioner",style:{...qe,pointerEvents:K?"auto":"none",visibility:Be&&!U?"visible":"hidden"},children:v.jsxs("div",{ref:Le,className:`limr-annotation-overlay ${ne?"limr-annotation-expanded":"limr-annotation-preview"}`,style:{"--limr-annotation-color":I?.color},"data-type":L?.type,"data-state":K?"open":"closing","data-pinned":he||void 0,"data-placement":ee?"center":pe?Ee.placement:Ce,"data-limr-theme":c,"data-limr-appearance":u,onPointerEnter:Je=>{!Z&&Je.pointerType!=="touch"&&s.hover(z.id)},onPointerLeave:()=>{Z||s.hover(null)},children:[v.jsx("div",{className:"limr-overlay-surface","aria-hidden":"true"}),v.jsx("div",{className:"limr-overlay-card",children:tt&&L?v.jsx(tt,{...St}):v.jsx(vm,{...St,title:I?.label??L?.type??f.annotations})})]})})});return v.jsx(V0,{root:i,children:v.jsx(ID,{className:"limr-backdrop","data-expanded":ht||void 0,lockScroll:ht,style:{pointerEvents:ht?"auto":"none"},children:yi})})}function Ct({name:t,...i}){return v.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",...i,children:v.jsxs("g",{transform:t==="highlight"?"translate(0 -1.25)":t==="comment"?"translate(0 -.5)":void 0,children:[(t==="eye"||t==="eye-off")&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6Z"}),v.jsx("circle",{cx:"12",cy:"12",r:"2.7"}),t==="eye-off"&&v.jsx("path",{d:"m4 4 16 16"})]}),t==="question"&&v.jsxs(v.Fragment,{children:[v.jsx("circle",{cx:"12",cy:"12",r:"8.5"}),v.jsx("path",{d:"M9.4 9a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2-2.6 3.7M12 17h.01"})]}),t==="highlight"&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"m8 15 7.6-9a2 2 0 0 1 2.8-.2l.8.7a2 2 0 0 1 .2 2.8L12 18l-4-3Z"}),v.jsx("path",{d:"m8 15-2 3 3 1 3-1M4 21h10M14 8l4 3.5"})]}),t==="edit"&&v.jsx(v.Fragment,{children:v.jsx("path",{d:"m14.5 5.5 4 4M4.5 19.5l4.5-1 11-11a2.1 2.1 0 0 0 0-3 2.1 2.1 0 0 0-3 0l-11 11-1.5 4Z"})}),t==="close"&&v.jsx("path",{d:"m6 6 12 12M18 6 6 18"}),t==="copy"&&v.jsxs(v.Fragment,{children:[v.jsx("rect",{x:"8.5",y:"8",width:"10.5",height:"12",rx:"3"}),v.jsx("path",{d:"M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5"})]}),["background","underline","dotted","wavy"].includes(t)&&v.jsxs(v.Fragment,{children:[t==="background"&&v.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"5",fill:"currentColor",fillOpacity:".13",stroke:"none"}),v.jsx("path",{d:"m8 15 3-8a1.05 1.05 0 0 1 2 0l3 8M9.2 12h5.6"}),t==="background"&&v.jsx("path",{d:"M7 19h10",strokeWidth:"2.5"}),t==="underline"&&v.jsx("path",{d:"M5 20h14"}),t==="dotted"&&v.jsx("path",{d:"M5 20h14",strokeDasharray:".1 3.4",strokeWidth:"2.4"}),t==="wavy"&&v.jsx("path",{d:"M4 20c1.3-2 2.7-2 4 0s2.7 2 4 0 2.7-2 4 0 2.7 2 4 0"})]}),t==="chevron"&&v.jsx("path",{d:"m8 10 4 4 4-4"}),t==="check"&&v.jsx("path",{d:"m5.5 12 4.2 4.2 8.8-9"}),t==="trash"&&v.jsx(v.Fragment,{children:v.jsx("path",{d:"M4.5 7h15M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l.7 12a2 2 0 0 0 2 2h4.6a2 2 0 0 0 2-2L17 7M10 11v6M14 11v6"})}),t==="note"&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"M14 3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9l-6-6Z"}),v.jsx("path",{d:"M14 3v4a2 2 0 0 0 2 2h4M8 13h8M8 17h5"})]}),t==="comment"&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"M8 19 4 21V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8Z"}),v.jsx("path",{d:"M8 9h8M8 13h5"})]}),t==="footnote"&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"M5 7h9M5 11h12M5 15h8M5 20h14M18 4h2v5"}),v.jsx("path",{d:"M17.5 9h4"})]}),t==="sparkles"&&v.jsxs(v.Fragment,{children:[v.jsx("path",{d:"m10.5 4 1.8 4.8 4.7 1.7-4.7 1.8-1.8 4.7-1.7-4.7L4 10.5l4.8-1.7L10.5 4Z"}),v.jsx("path",{d:"m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM19 3v4M17 5h4"})]})]})})}const YD=[{color:"#E57373",label:"Rose",labelZh:"玫瑰"},{color:"#F2C744",label:"Gold",labelZh:"暖黄"},{color:"#81B29A",label:"Sage",labelZh:"鼠尾草"},{color:"#6B9BD2",label:"Blue",labelZh:"雾蓝"},{color:"#B39DDB",label:"Lavender",labelZh:"薰衣草"},{color:"#E5A06E",label:"Apricot",labelZh:"杏橙"},{color:"#61AAA5",label:"Teal",labelZh:"青瓷"}];function JD(t={}){return{id:`copy-${t.format??"text"}`,label:t.label??(i=>i.locale.copy),icon:v.jsx(Ct,{name:"copy"}),successLabel:i=>i.locale.copied,successIcon:v.jsx(Ct,{name:"check"}),run:async({selection:i})=>{const r=t.format??"text";await navigator.clipboard.writeText(r==="text"?i.text:i[r].sourceText)}}}function XD({context:t,options:i}){const{locale:r,highlight:o,highlightAppearance:s}=t,u=s.color??gl.color,c=s.style??"background",f=[["background",r.highlightBackground],["underline",r.highlightUnderline],["dotted",r.highlightDotted],["wavy",r.highlightWavy]],p=(m,y)=>{const g={...s,color:m,style:y};t.setHighlightAppearance(g),o&&t.run(x=>x.updateAnnotation(o.id,{data:g}))};return v.jsxs("div",{className:"limr-highlight-settings",children:[v.jsxs("fieldset",{disabled:t.busy,children:[v.jsx("legend",{children:r.highlightStyle}),v.jsx("div",{className:"limr-highlight-styles",children:f.map(([m,y])=>v.jsxs("button",{type:"button","aria-pressed":c===m,onClick:()=>p(u,m),children:[v.jsx(Ct,{name:m}),v.jsx("span",{className:"limr-highlight-style-label",children:v.jsx("span",{className:"limr-underline",children:y})})]},m))})]}),v.jsxs("fieldset",{disabled:t.busy,children:[v.jsx("legend",{children:r.highlightColor}),v.jsx("div",{className:"limr-highlight-colors",children:(i.colors??YD).map(m=>v.jsx("button",{type:"button",className:"limr-color-swatch","aria-label":r.highlight==="高亮"?m.labelZh??m.label:m.label,title:r.highlight==="高亮"?m.labelZh??m.label:m.label,"aria-pressed":u.toLowerCase()===m.color.toLowerCase(),style:{"--swatch":m.color},onClick:()=>p(m.color,c),children:v.jsx(Ct,{name:"check"})},m.color))})]})]})}function ZD(t={}){return{id:"highlight-palette",label:i=>i.locale.editHighlight,icon:v.jsx(Ct,{name:"background"}),placement:"start",render:i=>v.jsx("button",{type:"button",className:"limr-toolbar-swatch","aria-label":i.locale.editHighlight,"aria-expanded":i.expanded,disabled:i.busy,onClick:()=>i.expanded?i.collapse():i.expand(),style:{"--swatch":i.highlightAppearance.color??gl.color}}),renderExpanded:i=>v.jsx(XD,{context:i,options:t})}}function Y0(){return{id:"highlight",label:t=>t.highlight?t.highlight.data?.hidden?t.locale.showHighlight:t.locale.hideHighlight:t.locale.addHighlight,icon:t=>v.jsx(Ct,{name:t.highlight?t.highlight.data?.hidden?"eye":"eye-off":"highlight"}),visible:t=>!t.highlight||t.annotations.some(i=>i.type!=="highlight"),run:t=>{t.highlight?t.updateAnnotation(t.highlight.id,{data:{...t.highlight.data,hidden:!t.highlight.data?.hidden}}):(t.addAnnotation({id:`highlight-${crypto.randomUUID()}`,type:"highlight",data:{...t.highlightAppearance,hidden:!1},anchors:t.selection.syntax.ranges.map(i=>({range:i,documentId:t.document.id,quote:t.document.source.slice(i.start,i.end)}))}),t.clearSelection())}}}function QD(){return{id:"delete-annotations",label:t=>t.locale.deleteAnnotations,icon:v.jsx(Ct,{name:"trash"}),placement:"end",tone:"danger",visible:t=>t.annotations.length>0,run:t=>{t.removeAnnotationsAt([...t.selection.raw.ranges,...t.selection.syntax.ranges]),t.activateAnnotation(null),t.clearSelection()}}}const KD=[ZD(),Y0(),JD(),QD()];function J0({actions:t,portalRoot:i,maxPanelHeight:r=260,className:o="",style:s,render:u}){const c=xt(),f=oo(),p=Al(),m=V2(),y=Ve(c.interaction,X=>X),g=Ve(c.decorations,X=>X),x=Ve(c.configuration,X=>X),b=y.activeHighlight?g.highlights.get(y.activeHighlight):null,w=g.occurrences.find(X=>X.id===y.active),E=w&&[...g.highlights.values()].some(X=>X.hidden&&pi(X.range,w.range)),A=O.useMemo(()=>{const X=new Map((t??KD).map(ie=>[ie.id,ie]));x.extensions?.forEach(ie=>ie.actions?.forEach(ye=>X.set(ye.id,ye))),t?.forEach(ie=>X.set(ie.id,ie));const Le=ie=>ie.placement==="start"?-1:ie.placement==="end"?1:0;return[...X.values()].sort((ie,ye)=>Le(ie)-Le(ye))},[x.extensions,t]),[k,T]=O.useState(null),C=O.useRef(!1),[D,z]=O.useState(null),[j,L]=O.useState(null),[I,q]=O.useState(null),[H,Z]=O.useState(!1),[oe,ue]=O.useState(gl),$=O.useRef(void 0),N=O.useRef(void 0),P=O.useId(),K=c.document.getSnapshot(),J=O.useMemo(()=>{if(m)return m;if(y.editing&&w?.annotationIds.includes(y.editing))return null;const X=b?.range??(E?w?.range:void 0);return X?Gu(K,X,{text:b?c.highlightReference?.text??Hh(K,{id:b.id,range:X}):Hh(K,w)}):null},[K,b,w,m,y.editing,E]),be=O.useMemo(()=>J?[...g.annotations.values()].filter(X=>dl(X,K).some(Le=>[...J.raw.ranges,...J.syntax.ranges].some(ie=>pi(Le.range,ie)))):[],[g,J,K]),_=b?g.annotations.get(b.annotationId):be.find(X=>X.type==="highlight"),He=_?.data??oe,Ee=J?{...c.commands,selection:J,annotations:be,highlight:_??null,locale:c.locale,addAnnotation:(X,Le)=>c.commands.addAnnotation(X,{highlight:He,...Le}),document:K,signal:c.signal,clearSelection:()=>c.clearSelection()}:null,B=Ee?A.filter(X=>X.visible?.(Ee)??!0):[],U=B.find(X=>X.id===j&&X.renderExpanded),ne=B.some(X=>X.renderExpanded),he=!!Ee&&J.settled&&B.length>0,{refs:ee,floatingStyles:pe,placement:ge,isPositioned:ke}=$0({open:he,strategy:"fixed",placement:"bottom",middleware:[B0(10),{name:"toolbarSpace",options:{hasPanels:ne,maxPanelHeight:r},fn({rects:X,placement:Le,elements:ie}){const ye=window.visualViewport,Ae=c.configuration.get().scrollRoot?.getBoundingClientRect(),me=Math.max(ye?.offsetTop??0,Ae?.top??0),je=Math.min((ye?.offsetTop??0)+(ye?.height??window.innerHeight),Ae?.bottom??1/0),V=Math.max(0,X.reference.y-me-20),R=Math.max(0,je-X.reference.y-X.reference.height-20),we=(ie.floating.querySelector(".limr-toolbar-actions")?.getBoundingClientRect().height??34)+(ie.floating.querySelector(".limr-toolbar-delete-hint")?.getBoundingClientRect().height??0),De=Math.max(0,parseFloat(getComputedStyle(ie.floating).getPropertyValue("--limr-toolbar-panel-max-height"))||r),ze=we+(ne?De:0)+24,Fe=R>=ze||R>=V?"bottom":"top",qe=Fe==="bottom"?R:V;return ie.floating.style.setProperty("--limr-toolbar-panel-height",`${Math.max(0,Math.min(De,qe-we-24))}px`),ie.floating.style.setProperty("--limr-toolbar-available-height",`${qe}px`),Le!==Fe?{reset:{placement:Fe}}:{}}},q0({padding:10})],whileElementsMounted:I0});O.useEffect(()=>{const X=m?c.selectionRange:b?c.highlightReference:w?c.anchors.get(w.id):null;X&&ee.setPositionReference({getBoundingClientRect:()=>X.getBoundingClientRect(),getClientRects:()=>X.getClientRects(),contextElement:c.content??void 0})},[c,ee,m,b,w]);const le=J?.raw.ranges.map(X=>`${X.start}-${X.end}`).join(",")??"";O.useEffect(()=>{z(null),L(null),q(null),Z(!1),clearTimeout($.current),clearTimeout(N.current)},[le,he]),O.useEffect(()=>()=>{clearTimeout($.current),clearTimeout(N.current)},[]);const se=()=>{c.clearSelection(),c.activate(null)};O.useEffect(()=>{if(!he)return;const X=ie=>{ie.target instanceof Element&&ie.target.closest("[data-limr-selection-ui],.limr-sidebar-card,.limr-overlay-positioner,[data-limr-anchor]")||c.interaction.get().activeHighlight&&c.clearSelection()},Le=ie=>{ie.key!=="Escape"||ie.defaultPrevented||(j?(L(null),ee.floating.current?.querySelector(`[data-action-id="${CSS.escape(j)}"] button`)?.focus()):se(),ie.preventDefault())};return document.addEventListener("pointerdown",X),document.addEventListener("keydown",Le),()=>{document.removeEventListener("pointerdown",X),document.removeEventListener("keydown",Le)}},[he,j,c,ee]);const ve=X=>{clearTimeout($.current),L(X)},Ce=async(X,Le)=>{if(!(!Ee||C.current||X.disabled?.(Ee))){C.current=!0,T(X.id),z(null);try{await Le()}catch(ie){c.signal.aborted||z(ie instanceof Error?ie.message:String(ie))}finally{C.current=!1,c.signal.aborted||T(null)}}},Me=X=>({...Ee,busy:!!k,expanded:j===X.id,highlightAppearance:He,setHighlightAppearance:ue,expand:()=>ve(X.id),collapse:()=>L(null),run:Le=>Ce(X,()=>Le(Ee))}),ce=X=>Ce(X,async()=>{X.run?await X.run(Me(X)):X.renderExpanded&&(j===X.id?L(null):ve(X.id)),X.successLabel&&!c.signal.aborted&&(q(X.id),clearTimeout(N.current),N.current=setTimeout(()=>q(null),2400))});if(!he||!Ee)return null;const xe=X=>{const Le=I===X.id&&X.successLabel?X.successLabel:X.label;return typeof Le=="function"?Le(Ee):Le},Ne=be.filter(X=>X.type!=="highlight").length,Be=B.some(X=>X.id==="delete-annotations")&&Ne>1?Ee.locale.deleteAnnotationsHint.replace("{count}",String(Ne)):null;return v.jsx(V0,{root:i,children:v.jsx("div",{ref:ee.setFloating,className:`limr-selection-toolbar ${o}`,style:{...s,...pe,visibility:ke?void 0:"hidden"},role:"toolbar","aria-label":"Text actions","data-limr-selection-ui":"true","data-limr-theme":p,"data-limr-appearance":f,"data-placement":ge,"data-highlight":_?.id,"data-expanded":U?.id,onMouseDown:X=>{(!(X.target instanceof Element)||!X.target.closest("input,textarea,select,[contenteditable]"))&&X.preventDefault()},onPointerEnter:()=>clearTimeout($.current),onPointerLeave:X=>{X.pointerType!=="mouse"||X.currentTarget.contains(document.activeElement)||($.current=setTimeout(()=>L(null),200))},onBlur:X=>{!X.currentTarget.contains(X.relatedTarget)&&!X.currentTarget.matches(":hover")&&L(null)},onKeyDown:X=>{if(!(X.target instanceof Element&&X.target.closest(".limr-toolbar-panel"))&&["ArrowRight","ArrowLeft","Home","End","ArrowDown","ArrowUp"].includes(X.key)){if(X.key==="ArrowDown"||X.key==="ArrowUp"){const Le=X.target.closest("[data-action-id]")?.dataset.actionId,ie=B.find(ye=>ye.id===Le);ie?.renderExpanded&&(ve(ie.id),requestAnimationFrame(()=>ee.floating.current?.querySelector(".limr-toolbar-panel button,.limr-toolbar-panel input,.limr-toolbar-panel textarea")?.focus()))}else{const Le=Array.from(X.currentTarget.querySelectorAll(".limr-toolbar-actions button:not(:disabled)")),ie=Le.indexOf(document.activeElement),ye=X.key==="Home"?0:X.key==="End"?Le.length-1:(ie+(X.key==="ArrowRight"?1:Le.length-1))%Le.length;Le[ye]?.focus()}X.preventDefault()}},children:v.jsxs("div",{className:"limr-toolbar-surface","data-ready":ke||void 0,children:[v.jsx("div",{className:"limr-toolbar-actions",children:u?u({context:Ee,actions:B,run:ce}):B.map((X,Le)=>v.jsx("div",{className:"limr-toolbar-item","data-action-id":X.id,"data-active":j===X.id||void 0,"data-tone":X.tone,"data-status":I===X.id?"success":void 0,style:{"--limr-tool-index":Le},onPointerEnter:ie=>{if(!(ie.pointerType!=="mouse"||k||X.disabled?.(Ee))&&!(U&&U.id!==X.id&&ee.floating.current?.querySelector(".limr-toolbar-panel")?.contains(document.activeElement))){clearTimeout($.current),X.renderExpanded?ve(X.id):L(null);try{X.onHover?.(Me(X))}catch(ye){z(ye instanceof Error?ye.message:String(ye))}}},children:X.render?X.render(Me(X)):v.jsxs("button",{className:"limr-toolbar-action",type:"button",disabled:!!k||X.disabled?.(Ee),onClick:()=>{ce(X)},"aria-label":xe(X),"aria-busy":k===X.id,"aria-expanded":X.renderExpanded?j===X.id:void 0,"aria-controls":X.renderExpanded&&j===X.id?P:void 0,"aria-describedby":X.id==="delete-annotations"&&Be&&H?`${P}-delete`:void 0,onPointerEnter:ie=>{X.id==="delete-annotations"&&ie.pointerType!=="touch"&&Z(!0)},onPointerLeave:ie=>{X.id==="delete-annotations"&&Z(ie.currentTarget.matches(":focus-visible"))},onFocus:ie=>{X.id==="delete-annotations"&&ie.currentTarget.matches(":focus-visible")&&Z(!0)},onBlur:ie=>{X.id==="delete-annotations"&&!ie.currentTarget.matches(":hover")&&Z(!1)},children:[v.jsxs("span",{className:"limr-tool-face","data-visible":I!==X.id||void 0,"aria-hidden":"true",children:[v.jsx("span",{className:"limr-tool-icon",children:typeof X.icon=="function"?X.icon(Ee):X.icon},typeof X.label=="function"?X.label(Ee):X.label),v.jsx("span",{className:"limr-tool-label limr-underline",children:typeof X.label=="function"?X.label(Ee):X.label})]}),X.successLabel&&v.jsxs("span",{className:"limr-tool-face","data-visible":I===X.id||void 0,"aria-hidden":"true",children:[v.jsx("span",{className:"limr-tool-icon",children:X.successIcon??(typeof X.icon=="function"?X.icon(Ee):X.icon)}),v.jsx("span",{className:"limr-tool-label limr-underline",children:typeof X.successLabel=="function"?X.successLabel(Ee):X.successLabel})]})]})},X.id))}),U&&v.jsx("div",{id:P,className:"limr-toolbar-panel",role:"group","aria-label":xe(U),children:v.jsx(c0,{active:!0,label:xe(U),children:U.renderExpanded(Me(U))})},U.id),Be&&v.jsx(xa,{open:H,keepMounted:!0,className:"limr-toolbar-delete-warning",children:v.jsx("p",{id:`${P}-delete`,className:"limr-toolbar-delete-hint",children:Be})}),D&&v.jsx("span",{role:"alert",className:"limr-action-error",children:D})]},le)})})}function pn({actions:t,toc:i=!0,sidebar:r=!0,followOutput:o=!1,sidebarBreakpoint:s=1120,fillHeight:u=!0,className:c,style:f,...p}){return v.jsx(Sl,{...p,children:v.jsx(WD,{actions:t,toc:i,sidebar:r,followOutput:o,sidebarBreakpoint:s,fillHeight:u,className:c,style:f})})}function WD({actions:t,toc:i,sidebar:r,followOutput:o,sidebarBreakpoint:s,fillHeight:u,className:c,style:f}){const p=xt(),m=Ve(p.configuration,z=>z.scrollRoot),y=Ve(p.layout,z=>z),g=oo(),x=Al(),b=O.useRef(null),w=O.useRef(null),E=O.useRef(null);Am(E,p,":scope > .limr-prose");const[A,k]=O.useState(0),[T,C]=O.useState(0);_t(()=>{if(!u||!b.current)return;const z=b.current.getBoundingClientRect().top-p.getViewportTop()-(m?.clientTop??0)+p.getScrollTop();C(Math.max(0,(m?.clientHeight??window.innerHeight)-z))},[p,m,u,y,A]),O.useEffect(()=>{const z=b.current;if(!z)return;const j=new ResizeObserver(()=>{k(z.clientWidth),p.requestLayout()});return j.observe(z),m&&j.observe(m),z.parentElement&&j.observe(z.parentElement),k(z.clientWidth),()=>j.disconnect()},[p,m,s]),_t(()=>{const z=w.current;if(!z)return;let j=0;const L=()=>{if(j=0,!z.clientWidth)return;const H=window.visualViewport;let Z=H?.offsetTop??0,oe=Z+(H?.height??window.innerHeight);if(m){const N=m.getBoundingClientRect().top+m.clientTop;Z=Math.max(Z,N),oe=Math.min(oe,N+m.clientHeight)}const ue=b.current.getBoundingClientRect();z.toggleAttribute("inert",ue.bottom<=Z||ue.top>=oe);const $=`${Math.max(0,oe-Math.max(Z,z.getBoundingClientRect().top)).toFixed(2)}px`;z.style.getPropertyValue("--limr-toc-available-height")!==$&&z.style.setProperty("--limr-toc-available-height",$)},I=()=>{j||(j=requestAnimationFrame(L))},q=[p.layout.subscribe(I),p.viewport.subscribe(I)];return window.addEventListener("scroll",I,{passive:!0}),window.addEventListener("resize",I),window.visualViewport?.addEventListener("resize",I),window.visualViewport?.addEventListener("scroll",I),L(),()=>{cancelAnimationFrame(j),q.forEach(H=>H()),window.removeEventListener("scroll",I),window.removeEventListener("resize",I),window.visualViewport?.removeEventListener("resize",I),window.visualViewport?.removeEventListener("scroll",I),z.removeAttribute("inert"),z.style.removeProperty("--limr-toc-available-height")}},[p,m,i]);const D=!!r&&A>=s;return v.jsxs("div",{ref:b,className:`limr-reader ${c??""}`,style:{"--limr-reader-available-height":u?`${T}px`:void 0,...f},"data-fill-height":u||void 0,"data-sidebar":D||void 0,"data-toc":i&&A>=800||void 0,"data-limr-theme":x,"data-limr-appearance":g,children:[i&&v.jsxs(v.Fragment,{children:[v.jsx("div",{ref:w,className:"limr-reader-toc",children:v.jsx(Ju,{})}),v.jsx(eO,{})]}),v.jsx("main",{ref:E,className:"limr-reader-content",children:v.jsx(Kn,{followOutput:o})}),D&&v.jsx(p0,{}),v.jsx(Om,{disabled:D}),v.jsx(J0,{actions:t})]})}function eO(){const t=Wn(),[i,r]=O.useState(!1),o=O.useId();return v.jsxs("div",{className:"limr-reader-mobile-toc",children:[v.jsxs("button",{type:"button",className:"limr-mobile-toc-toggle","aria-expanded":i,"aria-controls":o,onClick:()=>r(s=>!s),children:[v.jsx("span",{children:t.contents}),v.jsx("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:v.jsx("path",{d:"m6 8 4 4 4-4"})})]}),v.jsx("div",{id:o,children:v.jsx(xa,{open:i,keepMounted:!0,children:v.jsx(Ju,{})})})]})}function cu({open:t,children:i,className:r="",...o}){const[s,u]=O.useState(t),[c,f]=O.useState(!1);return O.useEffect(()=>{if(!t){f(!1);const y=setTimeout(()=>u(!1),360);return()=>clearTimeout(y)}u(!0);let p=0;const m=requestAnimationFrame(()=>{p=requestAnimationFrame(()=>f(!0))});return()=>{cancelAnimationFrame(m),cancelAnimationFrame(p)}},[t]),s?v.jsx("div",{...o,className:`demo-dropdown-menu ${r}`,"data-open":c||void 0,"aria-hidden":!t,ref:p=>{p?.toggleAttribute("inert",!t)},children:v.jsx("div",{className:"demo-dropdown-content",children:i})}):null}const tO=`# English documentation

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/README) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/README.md)

These pages describe the current public LiMR 1.0.0 implementation. Chinese is the default documentation language; every English page has a matching Chinese page.

| What you want to do | Read |
| --- | --- |
| Install and render a first document | [Getting started](getting-started.md) |
| Understand modules, included capabilities, and configuration | [Built-in modules](modules.md) |
| Write Markdown, exercises, citations, figures, and translations | [Default syntax](syntax.md) |
| Integrate React, streaming, custom layouts, or SSR | [Application integration](integration.md) |
| Persist selections, highlights, citations, and custom annotations | [Annotations and selection](annotations.md) |
| Add syntax, cards, selection actions, and parameters | [Extension development](extensions.md) |
| Build a standalone npm plugin and import it into an app | [Plugin packages](plugin-packages.md) |
| Customize themes, fonts, layouts, and portals | [Styles and fonts](styles.md) |
| Look up component props, hooks, and core APIs | [API reference](api.md) |
| Understand parsing, state, and resource boundaries | [Architecture and behavior](architecture.md) |
| Understand measurements and validation boundaries | [Performance and limits](performance.md) |
| Have an AI use LiMR or develop plugins | [AI Skills](ai-skills.md) |

Start with \`Reader\`, split components when a custom layout is needed, and add plugins for application features. Local persistence, import/export, and simulated assistant responses in the Playground belong to the demo application, not to Reader itself.

[Back to README](../../README.en.md) · [Live Playground](https://linloir.github.io/LiMR/)
`,nO=`# AI Skills: download, install, and use

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
`,iO=`# Annotations and selection

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
| text | Readable selected text |
| raw | Mapped original ranges and source |
| syntax | Absorbs adjacent standard Markdown delimiters at each edge, without selecting extra words or outer custom tags |
| blocks | Ranges and source for touched blocks |
| quality | exact, atomic, or unmapped |
| settled | False while a pointer selection is changing |
| documentId / revision | Owning document snapshot |

Each result has ranges and sourceText. Notes usually use syntax.ranges. Store document.source.slice(start, end) as quote for **every range**. Code supports partial selection; math and images are atomic. Do not infer offsets from DOM textContent lengths: entities, escapes, and emoji make those coordinates differ.

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
`,aO=`# API reference

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
| ToolIcon | name and SVG props; e.g. note, copy, sparkles, highlight |

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
`,rO=`# Architecture and behavior

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/architecture) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/architecture.md)

## Three public layers

1. core owns original source, AST, blocks, headings, embedded references, diagnostics, and selection coordinates, without a React/DOM runtime dependency.
2. React connects document, interaction, layout, external annotations, and resource state to views.
3. extensions implements defaults through the same public contract available to applications; modules can be appended, replaced, or removed.

Docs navigation and Playground persistence/loading/language menus belong to the demo application, not the LiMR core.

## Append parsing

Streaming reparses from the unstable final top-level block and reuses earlier stable blocks. Late Markdown reference/footnote definitions may change earlier semantics and trigger full correction. Middle edits, document-scoped transforms, extension changes, and finalization also reparse fully. Long lists, code fences, or unclosed tags can still make tail reparsing expensive.

Source is not rewritten before parsing, and public coordinates preserve UTF-16 offsets. Custom transforms must preserve positions and honor locality. Embedded references and application annotations enter separately and merge in the React layer.

## State and resources

Update configuration immutably and keep static references stable. Scrolling and parameter updates do not require parsing. A provider manages one primary body; document state and annotation requests are isolated between providers.

Annotation loading uses bounded per-reader caching; releasing consumers can cancel unused requests. Pure Shiki token results use a bounded module-level cache, separate from user annotation data. The library supplies no model service, authentication, database, or automatic persistence.

## Fallback behavior

Unknown HTML/custom tags remain inert source text. In the default configuration, unknown directives render their children. Unknown annotation types retain data and show generic markers/unavailable content rather than silently disappearing. Syntax recovery, transform diagnostics, and client renderer boundaries have distinct scopes; see [extensions](extensions.md).

## Validation boundaries

The repository includes parser/offset/SSR unit tests, real Chromium interaction regressions, and separate React 18/19 npm-consumer checks. Intercepted media, mobile viewport simulation, and performance fixtures are not proof of remote playback, physical-device acceptance, or universal performance.
`,oO=`# Extension development

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/extensions) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/extensions.md)

Start with [built-in modules](modules.md) for module objects, factories, names, Markdown tags, and the difference between \`extensions\` and \`plugins\`.

## Choose an interface

| Need | Interface |
| --- | --- |
| A new block with Markdown content | defineBlock |
| A standalone annotation type | defineAnnotation |
| Combined syntax, annotations, actions, and parameters | defineExtension / RendererExtension |
| A different view for an existing node | components |
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

This supports \`<notice title="Tip">…</notice>\` and \`:::notice{title="Tip"}\`. name becomes the tag and directive name unless tags/directives overrides them. defineBlock defaults to display: block, selection: content, and scope: local.

| NodeRendererProps | Use |
| --- | --- |
| node | AST node and static attributes |
| children | Already-rendered subtree; reuse it where possible |
| source | Source for **this node**, not the entire document |
| pending | Whether its tail block is still streaming |
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

SyntaxExtension supports micromark, mdast, tags, directives, display, selection, transform, and scope. Transforms default to document scope. Declare scope: local only if the transform depends on the current subtree and never revises earlier content or needs document-wide semantics. context.source is the original whole document; positions remain original UTF-16 offsets. Do not regex-rewrite source before parsing.

Unknown custom tags display their complete original text, including Markdown inside. Unknown directives in the default configuration render their inner Markdown without outer directive markers; with no directive extension installed, basic Markdown parsing applies. Incomplete tags fall back with diagnostics and retry on append. Finish with finish() or streaming=false. Transform exceptions become diagnostics. Client renderer boundaries can fall back to source, but React error boundaries do not catch server-rendering exceptions.

Validate tags/directives, Chinese/emoji, offsets, equivalence between finalized streams and one-shot parsing, SSR, and browser behavior for new interactions. For distribution, test actual packed consumption as described in [plugin packages](plugin-packages.md).

## Plugin localization

From 1.0.0, components can read the merged locale through useLocale() and select their own dictionary by locale.language. AnnotationType.label accepts a string or \`(locale) => string\`; actions use context.locale. Citation titles switch between Citation and 引用. A stable plugin instance can update labels without rewriting source. Saved user notes are never translated.
`,lO=`# Getting started

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
`,sO=`# Application integration

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

The application owns transport and appends each chunk to the complete answer. Do not pass only the newest chunk as source. The final update must set streaming to false to complete semantic correction. followOutput follows only while the reader remains near the bottom. The core engine supports append(chunk) / finish(); React props take the accumulated string.

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

React streaming SSR can also handle Suspense. Shiki adds highlighting on the client; SSR already includes code text. Annotation load requests start when a card is shown on the client. Put preloaded data in annotation.data if needed. The host must still serve CSS and fonts.

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
`,uO="# Built-in modules\n\n> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/modules) for the best reading experience.\n\n[Documentation](README.md) · [简体中文](../zh-CN/modules.md)\n\n## What is a module?\n\nLiMR's base parser understands CommonMark: headings, paragraphs, lists, links, images, and code fences. A **module** is a configuration object that adds capabilities, such as formulas, video rendering, or citation cards. Its public TypeScript type is `RendererExtension`, so the API also calls it an extension.\n\nA module can combine parsing rules, React components, annotation types, toolbar actions, and default parameters. It need not include all of them. For example, `math` adds formula syntax and rendering, `code-highlight` colors existing code fences, and `citation` provides both reference syntax and annotation cards.\n\nA **plugin** usually means a module added by your application or supplied by a third-party package. It uses the same interface as built-in modules. An npm package distributes code and can export several modules. Passing a module to `plugins` appends it to the existing configuration.\n\n## Functions, module names, and tag names\n\nConsider video:\n\n```tsx\nimport { Reader, standard, replaceExtension, video } from '@linloir/limr';\n\nconst videoModule = video({ loading: 'click' });\n// videoModule.name === 'video'\nconst extensions = replaceExtension(standard(), videoModule);\n\nexport function Article() {\n  return <Reader extensions={extensions} source={'<video src=\"/lesson.mp4\" />'} />;\n}\n```\n\n| Form | Where it belongs | Meaning |\n| --- | --- | --- |\n| `video` / `video(...)` | Application JavaScript / TypeScript | The imported function / a call that creates a module configuration object |\n| `videoModule` | Application code | Your variable name for that object; you can rename it |\n| `'video'` | The module object's `name` property | A stable identifier used to distinguish, replace, and remove modules |\n| `<video … />` / `<md-video … />` | Markdown content | Two tags registered by the module, using the same video renderer |\n| `::video{…}` | Markdown content | A registered directive; a `:::video` container also works |\n\nThe names need not match. The code-highlighting factory is `codeHighlight()`, its module name is `'code-highlight'`, and its content uses ordinary code fences without a `<code-highlight>` tag. Writing `video()` or the string `'video'` inside Markdown does not enable a module. Pass the returned object to `plugins`, not a string.\n\n`video({ loading: 'click' })` sets module defaults for that Reader. A `<video loading=\"eager\" … />` tag overrides the setting for one video. Available options vary by module; see [default syntax](syntax.md).\n\n## Ten default modules included with LiMR\n\nThese modules ship in `@linloir/limr`; they do not require ten separate npm installations. `standard()` returns an array containing the following ten module objects, each with its default settings.\n\n| Factory function | Object's `name` | Capability and content syntax |\n| --- | --- | --- |\n| `gfm()` | `gfm` | Tables, `~~strikethrough~~`, tasks, autolinks, `[^id]` endnotes |\n| `math()` | `math` | `$…$` inline and `$$…$$` display math; also import math.css |\n| `codeHighlight()` | `code-highlight` | Shiki colors for code fences with a language identifier |\n| `definition()` | `definition` | `<definition>` cards with a title and Markdown body |\n| `question()` | `question` | `<question>` exercises with choices, hints, answers, and local scoring |\n| `extras()` | `extras` | `<extras>` / `<extra>` further-reading links |\n| `video()` | `video` | `<video>` / `<md-video>` native video, YouTube, and Bilibili embeds |\n| `figures()` | `figures` | `<figures>` / `<figure>` responsive groups, single figures, and captions |\n| `citation()` | `citation` | `<citation>` source definitions and `<ref>` markers with cards |\n| `translations()` | `translations` | `<translations>` original, translated, and parallel views |\n\nImport these functions from `@linloir/limr` or `@linloir/limr/extensions`. `standard()` is a convenience function returning an array, not an eleventh module.\n\n`Reader`, standalone `Markdown`, and `DocumentProvider` automatically use `standard()` when `extensions` is omitted. Your first `<Reader source={source} />` therefore supports these capabilities. Components inside a shared Provider inherit its configuration. Core-only `createDocument()` starts with CommonMark; extensions must be explicit, and it does not display React UI.\n\nHighlight, copy, and annotation deletion are built-in toolbar actions. Highlights are saved as annotation data, not a separate Markdown tag. The Playground's margin notes, reading notes, questions, footnote annotations, and simulated assistant come from example plugins and **are not automatically installed in every Reader**. The `question()` exercise module is also separate from question annotations.\n\n## Choosing a configuration\n\nYou do not need to call `standard()` when the defaults suffice. For customization, distinguish three operations:\n\n| Goal | Configuration | Result |\n| --- | --- | --- |\n| Add your own capability | `plugins={[myPlugin]}` | Keep default modules and append your plugin object |\n| Keep only selected capabilities | `extensions={[gfm(), math()]}` | Replace the complete default module list; CommonMark remains available |\n| Configure a built-in module | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | Replace video by module `name`, preserving the other modules |\n\nTo remove one module, filter the array: `standard().filter(module => module.name !== 'video')`. Use `extensions={[]}` when extension syntax is unnecessary.\n\nDo not append `plugins={[video()]}` while the default video module is present: duplicate module names, tags, or directives throw. Without the corresponding module, unknown tags render as text, unknown directives may retain only their inner Markdown, and unknown annotation data remains with generic fallback UI. See [architecture and behavior](architecture.md) for the precise boundaries.\n\nNext, try the [syntax examples](syntax.md), create modules with [extension development](extensions.md), or distribute them using [plugin packages](plugin-packages.md).\n",cO=`# Performance and limits

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/performance) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

These are the repository's **2026-10-12 historical measurements**, retained for comparison. They were not rerun for this documentation/Playground update and are not guarantees.

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

The measurements do not cover large formula collections, Shiki cold starts, dense annotations, third-party plugins, full Reader layouts, or physical mobile devices. Installed font size also differs from browser transfers; see [styles and fonts](styles.md).

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
`,dO=`# Plugin packages

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
`,fO=`# Styles and fonts

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
| --limr-font-features | Defaults to 'palt' 1 for proportional punctuation where supported |
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

--limr-toolbar-available-height, --limr-toolbar-panel-height, and --limr-toc-available-height are runtime measurements, not theme inputs. AnnotationType.sidebar usually supplies local card colors; see [extensions](extensions.md).

## Fonts and package size

Local WOFF2 subsets of Maple Mono NF CN v7.9 ship in the package under the derivative name LiMR Maple Mono NF CN, with the OFL license. unicode-range and font-display: swap limit runtime requests, but the complete font assets still occupy about 31MB. base.css avoids browser loading, not npm installation size.

Body text does not automatically load Chinese fonts. Use system fallbacks, self-hosted fonts, or a host-chosen service. The Playground's Noto Serif SC belongs to the demo. No font should be assumed to cover every script.

Default font/math styles do not require a third-party CDN. Hosts can apply long-lived immutable caching to hashed font URLs; the library cannot set server HTTP headers. Remote image/video/plugin requests depend on content and host configuration.

## Layout and interaction conventions

The reading region determines synchronized sidebar height; do not size the page to all cards combined. Modules own content while the shared layout owns references, summaries, and card shells. Avoid duplicate padding or empty-paragraph compensation. Expanded cards animate from preview geometry; reduced-motion preferences disable motion.

Dense footer references borrow spare space above them at rest. Hovered or active items take alignment priority, allowing neighboring items to clip at the edges. Marker hover can compress the optional summary to leave room for the reference and heading. Expanded content is bounded by the visible reading region and scrolls within its card. Packed sidebar items still align the prose on hover. Deactivation smoothly restores the resting layout using current card heights, \`--limr-motion-slow\`, and \`--limr-ease\`, preserving gaps and page height.

Selection retains native browser ranges and keyboard behavior. Paint layers calculate visible fragments only. Code allows partial highlights, math is atomic, and image highlights use borders. Printing hides paint layers while keeping document content. Mobile automation does not certify native iOS/Android handles or physical-device behavior.

## CSS-only themes

Export CSS, include it in files, and mark sideEffects as ["**/*.css"]. A theme does not need React or parser runtime dependencies. Scope rules to an appearance name and check light, dark, auto, portals, and two differently themed readers on the same page.

Expanded toolbar panels use the full available toolbar width. The action row and available viewport determine its width; expanded content does not contribute intrinsic width or enlarge the toolbar. Highlight options use intrinsic text widths and wrap as whole items, aligned to the start. Multiline underlines need an inner inline span rather than a direct flex child.
`,hO=`# Default syntax

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/syntax) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/syntax.md)

**Modules** are configuration objects that add capabilities such as formulas, videos, or citations. A factory is called in application code to return an object; the module name is its \`name\` property, used for replacement and removal; tags and directives are the syntax written in Markdown. See [built-in modules](modules.md) for concepts and configuration.

The ten modules below ship with \`@linloir/limr\`. \`Reader\`, standalone \`Markdown\`, and \`DocumentProvider\` enable all of them through \`standard()\` by default; core-only \`createDocument()\` starts with CommonMark. The following sections include source and rendered examples, using LiMR itself.

## Module catalog

| Factory (application code) | Module name (name) | Capability | Registered tags / directives |
| --- | --- | --- | --- |
| \`gfm()\` | \`gfm\` | Tables, strikethrough, tasks, autolinks, standard footnotes | None |
| \`math()\` | \`math\` | Inline and display math | \`$…$\`, \`$$…$$\` |
| \`codeHighlight()\` | \`code-highlight\` | Shiki fenced-code highlighting | Standard code fences |
| \`definition()\` | \`definition\` | Definitions | Tags: definition, title, content; directive: definition |
| \`question()\` | \`question\` | Exercises and answers | question and child tags below; directive: question |
| \`extras()\` | \`extras\` | Further reading | Tags: extras, extra; directive: extras |
| \`video()\` | \`video\` | Native video, YouTube, Bilibili | Tags: video, md-video; directive: video |
| \`figures()\` | \`figures\` | Figure groups and captions | Tags: figures, figure, figcaption, caption, img; directives: figures, figure, figcaption |
| \`citation()\` | \`citation\` | Reference definitions and markers | Tags: citation, ref; no directives |
| \`translations()\` | \`translations\` | Original, translated, and parallel text | Tags and directives: translations, origin, translation |

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

[^note]: Content at the end of the document.
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

[^syntax-note]: Content at the end of the document.

Standard \`[^note]\` footnotes appear at the end; \`<ref>\` opens an annotation card. Ordinary Markdown supports \`![Description](/image.png)\`. Raw HTML is not passed through to the DOM. Register an extension or override \`components\` to customize rendering.

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

Import \`@linloir/limr/math.css\`. Configure formulas with \`math({ macros, strict })\`. Fenced language names select Shiki highlighting. Highlighting loads near the viewport; streaming code waits for a 180ms pause. Code over the default 100,000-character limit, unsupported languages, and languages outside the configured list retain readable source. Configure \`codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })\`.

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

Persistent highlights are annotations; there is no built-in \`==highlight==\` syntax. Register plugins for custom tags. Not every child tag has a corresponding directive. See [extension development](extensions.md) to select or replace default modules.
`,mO=`# 中文文档

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/README) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/README.md)

这套文档对应当前 LiMR 1.0.0 的公开实现。默认入口为中文，英文页面与本目录一一对应。

| 你要做什么 | 阅读文档 |
| --- | --- |
| 安装并显示第一篇文档 | [快速开始](getting-started.md) |
| 了解模块、默认包含的能力与配置方式 | [内置模块](modules.md) |
| 编写 Markdown、练习题、引用、图组与译文 | [默认语法](syntax.md) |
| 集成到 React、接收流式输出、自定义布局或 SSR | [项目集成](integration.md) |
| 保存选区、高亮、引用和自定义标注 | [标注与选区](annotations.md) |
| 新增语法、卡片、选区动作和模块参数 | [扩展开发](extensions.md) |
| 开发独立 npm 插件并在应用中引入 | [插件模块包](plugin-packages.md) |
| 调整主题、字体、布局与 portal 样式 | [样式与字体](styles.md) |
| 查询组件 props、hooks 和核心 API | [API 参考](api.md) |
| 理解解析、状态和资源边界 | [架构与行为](architecture.md) |
| 了解性能数据和验证范围 | [性能与限制](performance.md) |
| 让 AI 使用 LiMR 或开发插件 | [AI Skills](ai-skills.md) |

先接入 \`Reader\`，需要定制布局时再拆分组件；需要应用功能时优先添加插件。Playground 中的本地保存、导入导出和模拟问答是演示应用功能，不是 Reader 自带的服务。

[返回 README](../../README.md) · [在线 Playground](https://linloir.github.io/LiMR/)
`,pO=`# AI Skills：下载、导入与使用

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
`,gO=`# 标注与选区

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
| \`text\` | 可读的选中文本 |
| \`raw\` | 映射得到的原始范围和源码 |
| \`syntax\` | 仅吸收两端紧邻的标准 Markdown 标记，不扩选未选文字或特殊块外层标签 |
| \`blocks\` | 选区触及的块范围与源码 |
| \`quality\` | exact、atomic 或 unmapped |
| \`settled\` | 指针仍在拖选时为 false |
| \`documentId\` / \`revision\` | 选区所属文档快照 |

每种结果包含 ranges 和 sourceText。一般笔记使用 syntax.ranges，并为**每个范围**保存 \`document.source.slice(start, end)\` 作为 quote。代码支持部分选择；公式和图片作为原子内容。不要用 DOM textContent 长度倒推原文范围，实体、转义和 emoji 会让两者不同。

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
`,yO=`# API 参考

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
| ToolIcon | name 与 SVG 属性；如 note、copy、sparkles、highlight |

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
`,bO=`# 架构与行为

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/architecture) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/architecture.md)

## 三层公开边界

1. core 管理原始 source、AST、块、标题、源内引用、诊断和选区坐标，无 React/DOM 运行时依赖。
2. React 层将文档、交互、布局、外部标注和资源状态连接到组件。
3. extensions 层使用同一套公开接口提供默认语法和交互；应用可以追加、替换或移除。

Doc 页面导航和 Playground 的保存、加载、语言菜单属于演示应用，不进入 LiMR 核心架构。

## 追加解析

流式追加从末尾尚未稳定的顶层块回退，复用前面的稳定块。后到的 Markdown 引用/脚注定义可能影响前文，触发完整语义校正。中间编辑、全文 transform、更换扩展和流式结束也会完整解析。长列表、长代码块和未闭合标签仍可能产生较大的尾块重解析成本。

source 不经过替换预处理，所有公开坐标保留 UTF-16 偏移。自定义 transform 必须维护坐标和局部性约定。源码中引用数据与应用 annotations 分开输入，在 React 视图层合并。

## 状态与资源

配置数组/对象按不可变数据更新，静态配置保持引用稳定。滚动和 parameter 变化不需要重解析。一个 Provider 管理一个主正文；不同 Provider 的文档和标注请求隔离。

标注异步资源使用阅读器内有限缓存，消费者释放后可以取消无用请求。Shiki 的纯 token 结果使用模块级有限缓存；不应将其与用户标注数据缓存混为一谈。库不提供模型服务、账号认证、数据库或自动保存。

## 退化行为

未知 HTML/自定义标签是惰性的原文；默认配置下未知指令仅渲染子内容。未知标注类型保留数据并显示通用角标/不可用提示，并非静默跳过。不完整语法恢复、transform diagnostics 和客户端渲染错误边界各有自己的适用范围，见[扩展开发](extensions.md)。

## 验证边界

仓库包含解析/坐标/SSR 单元测试、真实 Chromium 交互回归和 React 18/19 独立 npm 消费验证。浏览器测试中的远程媒体拦截、移动视口模拟和性能夹具不等于真实平台播放、移动设备验收或通用性能承诺。
`,vO=`# 扩展开发

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/extensions) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/extensions.md)

第一次接触模块时，先阅读[内置模块](modules.md)：那里解释模块对象、创建函数、模块名、Markdown 标签，以及 \`extensions\` 和 \`plugins\` 的区别。

## 选择接口

| 需求 | 接口 |
| --- | --- |
| 一个带 Markdown 正文的新区块 | defineBlock |
| 一种独立标注类型 | defineAnnotation |
| 组合语法、标注、动作和参数 | defineExtension / RendererExtension |
| 改写某种已有节点的外观 | components |
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

支持 \`<notice title="提示">…</notice>\` 和 \`:::notice{title="提示"}\`。name 默认同时成为标签名和指令名，可通过 tags / directives 自定义。defineBlock 默认 display: block、selection: content、scope: local。

| NodeRendererProps | 用法 |
| --- | --- |
| node | 当前 AST 节点和静态属性 |
| children | 已经渲染好的子树；优先复用 |
| source | **当前节点**对应的源码片段，不是全文 |
| pending | 所属尾块是否仍在流式生成 |
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

SyntaxExtension 支持 micromark、mdast、tags、directives、display、selection、transform 和 scope。transform 默认全文作用域；仅依赖当前局部子树、不会回写前文或读取全局文档语义时才声明 scope: local。context.source 仍是原始全文，position 必须保持原始 UTF-16 坐标。不要先用正则替换 source 再解析。

未知特殊标签安全显示整段原文，内部 Markdown 也作为原文显示。默认配置的未知指令则渲染内部 Markdown，丢弃指令外层标记；未安装任何指令扩展时按基础 Markdown 解析。不完整标签会回退并记录 diagnostics，之后追加再尝试恢复；结束必须 finish 或 streaming=false。扩展 transform 的异常记录为 diagnostic；客户端渲染边界可回退源码，但 React 错误边界不负责捕获服务端渲染异常。

验证应覆盖标签/指令、中文与 emoji、源坐标、流式结束与一次性解析等价、SSR，以及新增交互的浏览器行为。独立分发还需验证真实打包消费，见[插件模块包](plugin-packages.md)。

## 插件本地化

1.0.0 起，组件可用 useLocale() 读取合并后的 locale，以 locale.language 选择自己的文案。AnnotationType.label 接受字符串或 \`(locale) => string\`；选区动作使用 context.locale。Citation 默认标题随语言切换为 Citation / 引用。保持插件实例稳定即可更新文案，无需重写源文；用户保存的笔记不会被翻译。
`,xO=`# 快速开始

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
`,wO=`# 项目集成

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

应用负责传输层，把每个片段追加到完整 \`answer\`；不要只把最后一个片段传给 source。最后一次更新必须传 \`streaming={false}\`，触发完整语义校正。followOutput 只在仍靠近底部时跟随，不会强行拉回正在阅读上文的用户。纯核心支持 \`append(chunk)\` / \`finish()\`，React props 使用累计字符串。

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

也可以使用 React 流式 SSR 处理 Suspense。Shiki 在客户端补充高亮，SSR HTML 仍包含代码文本。\`load\` 标注请求在客户端显示卡片时发起；如需服务端已有内容，可预先放进 annotation.data。宿主仍需把 CSS 和字体资源放到页面能访问的位置。

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
`,SO="# 内置模块\n\n> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/modules) 可获得最佳阅读体验。\n\n[文档目录](README.md) · [English](../en/modules.md)\n\n## 模块是什么\n\nLiMR 的基础解析器认识 CommonMark：标题、段落、列表、链接、图片和代码围栏等。**模块**是在这个基础上增加一组能力的配置对象，例如识别公式、渲染视频、显示引用卡片。开发时这个对象的公开类型叫 `RendererExtension`，所以 API 中也称它为“扩展”。\n\n模块可以同时包含语法规则、React 渲染组件、标注类型、工具栏动作和默认参数；并非每个模块都必须有这些部分。例如 `math` 增加公式语法和渲染，`code-highlight` 为现有代码围栏添加高亮，`citation` 同时提供引用语法和标注卡片。\n\n**插件**通常指应用自行添加的模块，或第三方包提供的模块。它与内置模块使用相同的接口；npm 包只是分发代码的方式，一个包可以导出多个模块。把模块放进 `plugins` 后，就会追加到已有配置中。\n\n## 函数、模块名和标签名的区别\n\n以视频为例：\n\n```tsx\nimport { Reader, standard, replaceExtension, video } from '@linloir/limr';\n\nconst videoModule = video({ loading: 'click' });\n// videoModule.name === 'video'\nconst extensions = replaceExtension(standard(), videoModule);\n\nexport function Article() {\n  return <Reader extensions={extensions} source={'<video src=\"/lesson.mp4\" />'} />;\n}\n```\n\n| 写法 | 在哪里使用 | 含义 |\n| --- | --- | --- |\n| `video` / `video(...)` | 应用的 JavaScript / TypeScript | 导入的函数 / 调用这个函数，创建一个模块配置对象 |\n| `videoModule` | 应用代码 | 自己给对象起的变量名，可以改成其他名字 |\n| `'video'` | 模块对象的 `name` 字段 | LiMR 区分、替换和移除模块时使用的稳定标识 |\n| `<video … />` / `<md-video … />` | Markdown 正文 | 模块注册的两种标签，触发同一个视频渲染器 |\n| `::video{…}` | Markdown 正文 | 模块注册的指令写法，也可以使用 `:::video` 容器 |\n\n这些名称不要求一致。例如创建代码高亮模块的函数是 `codeHighlight()`，对象的模块名却是 `'code-highlight'`，正文只需要普通代码围栏，不需要 `<code-highlight>` 标签。不要把 `video()` 或字符串 `'video'` 直接写进 Markdown 来启用模块，也不要把字符串放进 `plugins`；传入的是函数返回的对象。\n\n`video({ loading: 'click' })` 的参数设置这个 Reader 中视频模块的默认行为；正文的 `<video loading=\"eager\" … />` 则可以覆盖某一个视频的设置。不同模块支持不同参数，见[默认语法](syntax.md)。\n\n## 随 LiMR 提供的十个默认模块\n\n这些模块都随 `@linloir/limr` 安装，不需要再安装十个 npm 包。`standard()` 返回由下面十个模块对象组成的数组，使用各自的默认配置。\n\n| 创建模块的函数 | 对象的 `name` | 增加的能力与正文写法 |\n| --- | --- | --- |\n| `gfm()` | `gfm` | 表格、`~~删除线~~`、任务列表、自动链接、`[^id]` 文末脚注 |\n| `math()` | `math` | `$…$` 行内公式、`$$…$$` 块级公式，需要额外导入 math.css |\n| `codeHighlight()` | `code-highlight` | 使用 Shiki 为带语言标记的代码围栏着色 |\n| `definition()` | `definition` | `<definition>` 释义卡片，可带标题与 Markdown 正文 |\n| `question()` | `question` | `<question>` 练习题，选项、提示、答案与本地判分 |\n| `extras()` | `extras` | `<extras>` / `<extra>` 拓展阅读链接 |\n| `video()` | `video` | `<video>` / `<md-video>` 原生视频、YouTube、Bilibili 嵌入 |\n| `figures()` | `figures` | `<figures>` / `<figure>` 响应式图组、单图和图注 |\n| `citation()` | `citation` | `<citation>` 定义来源，`<ref>` 插入引用角标和卡片 |\n| `translations()` | `translations` | `<translations>` 包含原文与译文，切换原文、译文、对照 |\n\n所有函数都可以从 `@linloir/limr` 或 `@linloir/limr/extensions` 导入。`standard()` 是便捷组合函数，自身不是第十一个模块；它的返回值是数组。\n\n`Reader`、独立使用的 `Markdown`、`DocumentProvider` 在未传 `extensions` 时自动使用 `standard()`，因此最初的 `<Reader source={source} />` 就支持这些能力。共享 Provider 内的组件使用 Provider 的配置。纯核心 `createDocument()` 默认只启用 CommonMark；需要时显式传入扩展，它不负责显示 React UI。\n\n高亮、复制、删除选区标注是工具栏自带动作，高亮以 annotation 数据保存，不是另外一种默认 Markdown 标签。Playground 的旁注、笔记、提问、脚注和模拟 AI 问答来自示例插件，**没有自动装进每个 Reader**。`question()` 的练习题与“提问”标注也不是同一功能。\n\n## 按需要组合\n\n默认配置足够时不必写 `standard()`。需要定制时，记住这三个操作：\n\n| 目的 | 写法 | 结果 |\n| --- | --- | --- |\n| 加自己的功能 | `plugins={[myPlugin]}` | 保留默认模块，追加插件对象 |\n| 只保留指定能力 | `extensions={[gfm(), math()]}` | 替换完整默认模块清单；CommonMark 仍可用 |\n| 调整一个内置模块 | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | 按模块 `name` 替换视频，保留其他模块 |\n\n移除一个模块也可以过滤数组：`standard().filter(module => module.name !== 'video')`。不需要扩展语法时传 `extensions={[]}`。\n\n不要通过 `plugins={[video()]}` 再次追加已默认存在的视频模块：重复模块名、标签或指令会报错。模块没有启用时，未知标签按文本显示；未知指令可能仅留下内部 Markdown；已有的未知标注数据保留并显示通用回退。完整边界见[架构与行为](architecture.md)。\n\n接下来可以直接试读[语法示例](syntax.md)，或参考[扩展开发](extensions.md)创建模块、[插件模块包](plugin-packages.md)打包分发。\n",kO=`# 性能与限制

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/performance) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/performance.md)

以下保留仓库 **2026-10-12** 的历史基准，便于对照。它们不是本次文档/Playground 更新后重新测得的数据，也不是性能保证。

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

这些数据不覆盖大型公式集、Shiki 冷启动、密集标注、第三方插件、完整 Reader 布局或实体移动设备。字体安装体积与浏览器请求量也不同，见[样式与字体](styles.md)。

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
`,AO=`# 插件模块包

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
`,TO=`# 样式与字体

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
| --limr-font-features | 正文默认 'palt' 1，字体支持时采用比例标点 |
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

runtime 测量的 --limr-toolbar-available-height、--limr-toolbar-panel-height、--limr-toc-available-height 是布局输出，不应由主题覆盖。sidebar 的局部颜色通常由 AnnotationType.sidebar 配置提供，见[扩展开发](extensions.md)。

## 字体和资源体积

Maple Mono NF CN v7.9 的本地 WOFF2 子集随包分发，衍生字体名为 LiMR Maple Mono NF CN，OFL 许可证随资源提供。unicode-range 和 font-display: swap 限制运行时按需请求，但完整字体资产仍约 31MB，base.css 只避免浏览器加载，不减少 npm 安装体积。

正文不自动加载中文字体；可使用系统回退、自托管或宿主选定的字体服务。Playground 的 Noto Serif SC 是演示项目依赖。不要假定任何字体覆盖所有文字。

默认字体/公式样式不依赖外部 CDN。带哈希的字体资源可由宿主设置长期 immutable 缓存；库无法替服务器设置 HTTP 缓存头。远程图片、视频和插件请求由内容和宿主决定。

## 布局与交互约定

同步侧栏的高度由阅读区域决定，不能用所有卡片总高撑大页面。模块只控制自己的内容，骨架负责灰色关联区、摘要与卡片外壳；避免重复 padding 或空段落补偿。大卡片从预览位置过渡，减少动态效果设置会关闭动画。

密集的文末引用在静止时向上借用空余空间。悬浮或激活时优先对齐当前条目，允许邻项在边缘裁切；角标悬浮时可压缩可选摘要，为关联区和标题留出空间。展开内容受可见阅读区域高度限制，并可在卡片内滚动。侧栏条目即使被向上收拢，也会反向对齐正文。取消激活后按当前卡片高度平滑回位，使用 \`--limr-motion-slow\` 和 \`--limr-ease\`，保持卡片间距与页面高度。

选区保留原生浏览器范围与键盘行为，绘制层只计算可见片段。代码支持局部高亮，公式整体选择，图片高亮使用边框。打印隐藏绘制层并保留正文。移动端自动化检查不等于 iOS/Android 原生拖动手柄和真机验收。

## 仅 CSS 的独立主题

包可导出 CSS，files 包含 CSS，sideEffects 为 \`["**/*.css"]\`；不需要 React 或解析器运行时依赖。规则用独立 appearance 名隔离，覆盖浅色、深色、auto 和 portal，并在同页两个不同主题 Reader 中检查。

展开工具栏面板使用工具栏的全部可用宽度。宽度由当前操作按钮行与可用视口决定，展开内容不参与工具栏的固有宽度计算，不会反向撑大工具栏。高亮样式按钮按文字自然宽度排列，空间不足时整项换行并左对齐。多行下划线需要保持内部 span 为 inline，不把它直接作为 flex 子项。
`,EO=`# 默认语法

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/syntax) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/syntax.md)

**模块**是为 LiMR 增加一组能力的配置对象，例如公式、视频或引用。下面的“创建函数”在应用代码中调用，返回模块对象；“模块名”是对象的 \`name\` 字段，用于替换和移除；“标签 / 指令”才是写在 Markdown 正文中的语法。完整概念和配置方式见[内置模块](modules.md)。

\`@linloir/limr\` 随包提供以下十个模块。\`Reader\`、独立 \`Markdown\` 和 \`DocumentProvider\` 默认通过 \`standard()\` 全部启用；纯核心 \`createDocument()\` 默认只有 CommonMark。下面每节给出源码和实际效果，交互示例由 LiMR 自己渲染。

## 模块清单

| 创建函数（应用代码） | 模块名（name） | 默认能力 | 注册的特殊标签 / 指令 |
| --- | --- | --- | --- |
| \`gfm()\` | \`gfm\` | 表格、删除线、任务列表、自动链接、标准脚注 | 无 |
| \`math()\` | \`math\` | 行内与块级公式 | \`$…$\`、\`$$…$$\` |
| \`codeHighlight()\` | \`code-highlight\` | Shiki 围栏代码高亮 | 标准代码围栏 |
| \`definition()\` | \`definition\` | 释义 | 标签 \`definition\`、\`title\`、\`content\`；指令 \`definition\` |
| \`question()\` | \`question\` | 练习题与答案 | 标签 \`question\` 及下文子标签；指令 \`question\` |
| \`extras()\` | \`extras\` | 拓展阅读 | 标签 \`extras\`、\`extra\`；指令 \`extras\` |
| \`video()\` | \`video\` | 原生视频、YouTube、Bilibili | 标签 \`video\`、\`md-video\`；指令 \`video\` |
| \`figures()\` | \`figures\` | 图组与图注 | 标签 \`figures\`、\`figure\`、\`figcaption\`、\`caption\`、\`img\`；指令 \`figures\`、\`figure\`、\`figcaption\` |
| \`citation()\` | \`citation\` | 引用定义与角标 | 标签 \`citation\`、\`ref\`；不注册指令 |
| \`translations()\` | \`translations\` | 原文、译文与对照 | 标签及指令 \`translations\`、\`origin\`、\`translation\` |

这些是 Markdown 中允许的静态标签，不是任意 MDX/HTML 执行环境。使用字符串属性，如 \`multi="true"\`、\`answer="[0,2]"\`；不要使用 \`answer={[0,2]}\`、事件函数或展开属性。未注册 HTML 按文本显示；表达式不执行并可能产生诊断。嵌套块的标签和正文之间保留空行。

## CommonMark 与 GFM

\`\`\`\`markdown
# 标题

**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、\`行内代码\`。

> 引用块，默认界面标题为 Note / 注释。

- 普通列表
- [x] 已完成
- [ ] 未完成

| 名称 | 说明 |
| --- | --- |
| LiMR | Markdown renderer |

\`\`\`typescript
const value = 42;
\`\`\`

标准脚注[^note]。

[^note]: 出现在文末的脚注内容。
\`\`\`\`

实际效果（可交互）：

#### 标题示例

**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、\`行内代码\`。

> 引用块，默认界面标题为 Note / 注释。

- 普通列表
- [x] 已完成
- [ ] 未完成

| 名称 | 说明 |
| --- | --- |
| LiMR | Markdown renderer |

\`\`\`typescript
const value = 42;
\`\`\`

标准脚注[^syntax-note]。

[^syntax-note]: 出现在文末的脚注内容。

标准 \`[^note]\` 是文末脚注，\`<ref>\` 是标注卡片，两者不同。图片 \`![说明](/image.png)\` 由普通 Markdown 支持。原始 HTML 不透传到 DOM；需要自定义外观时注册扩展或覆盖 \`components\`。

## 公式与代码

\`\`\`markdown
行内公式：$E = mc^2$。

$$
\\int_0^1 x^2\\,dx = \\frac{1}{3}
$$
\`\`\`

实际效果（可交互）：

行内公式：$E = mc^2$。

$$
\\int_0^1 x^2\\,dx = \\frac{1}{3}
$$

公式需要导入 \`@linloir/limr/math.css\`；支持通过 \`math({ macros, strict })\` 配置。代码围栏语言用于 Shiki 高亮。默认接近视口才加载高亮，流式代码暂停更新 180ms 后尝试高亮；超过默认 100,000 字符、未支持或未在允许列表中的语言保留可读源码。\`codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })\` 可配置。

## 释义

\`\`\`markdown
<definition title="熵">

表示不确定性的量：$H(X)$。

</definition>
\`\`\`

实际效果（可交互）：

<definition title="熵">

表示不确定性的量：$H(X)$。

</definition>

富文本标题和指定正文可以使用子标签：

\`\`\`markdown
<definition>

<title>**Entropy** / 熵</title>

<content>

正文支持 Markdown。

</content>

</definition>
\`\`\`

\`title\` 属性按文字渲染；富文本用子标签。也可以写 \`:::definition{title="熵"}\`，以 \`:::\` 结束。

## 练习题

\`\`\`markdown
<question title="哪些是偶数？">

<question-content>请选择所有正确选项。</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>考虑能否被 2 整除。</question-hint>

<question-answer>2 和 4 是偶数。</question-answer>

</question>
\`\`\`

实际效果（可交互）：

<question title="哪些是偶数？">

<question-content>请选择所有正确选项。</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>考虑能否被 2 整除。</question-hint>

<question-answer>2 和 4 是偶数。</question-answer>

</question>

答案索引从 **0** 开始。\`multi\` 默认关闭；\`answer\` 可以是 JSON 数组或单个索引的字符串。属性优先读取选择组，其次读取 \`question\`。提示和答案可以单独展开，有答案索引时支持提交、判分和重试。它不连接 AI，也不创建问答标注。

## 拓展阅读

\`\`\`markdown
<extras>

<extra title="继续阅读" url="https://example.com/article" desc="背景和补充材料。" />

</extras>
\`\`\`

实际效果（可交互）：

<extras>

<extra title="内置模块" url="https://linloir.github.io/LiMR/#/docs/zh-CN/modules" desc="背景和补充材料。" />

</extras>

\`extra\` 使用 \`title\`、\`url\`、\`desc\`。链接经过内置 URL 过滤。

## 引用卡片

\`\`\`markdown
一个来源<ref id="a" />，或一组来源<ref ids='["a","b"]' />。

<ref id="a">带引用的 **原文**</ref>

<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />

<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />
\`\`\`

实际效果（可交互）：

一个来源<ref id="a" />，或一组来源<ref ids='["a","b"]' />。

<ref id="a">带引用的 **原文**</ref>

<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />

<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />

\`citation\` 的 ID 读取 \`cite-id\`，其次 \`id\`；说明读取 \`desc\`，其次 \`description\`。\`ref\` 读取 \`cite-from-ids\`、\`ids\`、\`id\`，支持 JSON 数组或逗号分隔字符串。定义本身不占正文位置，同一个定义可以被多个角标引用。

Citation 默认不提供展开大卡片，点击固定预览；摘要按 \`summary → description → 安全 URL → title\` 回退，去掉 Markdown 标记。正文显示 \`description\`，没有时显示 \`summary\`。悬浮或激活时临时高亮引用所在的最近文本块（段落、标题、列表项或表格单元格），不写入已保存高亮；外部范围标注使用绑定范围。配置与存储见[标注与选区](annotations.md)。

## 图片、图组与图注

\`\`\`markdown
<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="/figures/a.png" alt="实验 A" caption="(a) 实验 A" />

<figure id="experiment-b">

![实验 B](/figures/b.png)

<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>

</figure>

<figcaption>图 1 · 两个实验。</figcaption>

</figures>
\`\`\`

实际效果（可交互）：

<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="../assets/source.svg" alt="实验 A" caption="(a) 实验 A" />

<figure id="experiment-b">

![实验 B](../assets/rendered.svg)

<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>

</figure>

<figcaption>图 1 · 两个实验。</figcaption>

</figures>

\`figure\` 可独立使用。图片可以来自 \`src\` / \`url\` 属性、内部 Markdown 图片或 \`<img src="…" alt="…" />\`。每个 figure 放一张图；多张图用 figures。图注可用 \`caption\` 属性或 \`figcaption\` / \`caption\` 子标签，富文本使用子标签。\`id\` 可作为页内链接目标。

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| \`min-width\` / \`min-height\` | 220 / 120 | 决定何时增加列，窄容器优先适应宽度 |
| \`max-width\` / \`max-height\` | 560 / 480 | 保持比例的图片上限；\`none\` / \`false\` 取消上限 |
| \`columns\` / \`cols\` | 自动 | 指定列数，最多 24 |
| \`rows\` | 自动 | 未指定列数时由图数推导列数 |
| \`responsive\` | true | 容器不足时降低显式列数；false 保留列数 |
| \`gap\` | 16 | 图组间距，像素 |

尺寸接受非负数字或 \`px\`。图组限制由子图继承，子图可以覆盖。对应工厂参数为驼峰命名，例如 \`figures({ maxHeight: 360, maxWidth: false })\`。图片不变形、不裁切图注。单图复制按钮复制图片 URL；图组复制按钮复制 Markdown 源码，不下载图片二进制。

指令示例：

\`\`\`markdown
:::figures{columns="2"}
::figure{src="/a.png" caption="A"}
::figure{src="/b.png" caption="B"}
:::
\`\`\`

## 视频

\`\`\`markdown
<video src="/demo.mp4" provider="native" title="演示" />

<md-video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />

<video url="https://www.bilibili.com/video/BV1xx411c7mD/?p=2" />
\`\`\`

\`url\` 优先于 \`src\`；\`provider\` 默认 \`auto\`，还可以是 \`native\`、\`youtube\`、\`bilibili\`。YouTube 支持 watch、短链接、embed、shorts、live 和起始时间；Bilibili 支持 BV/av 与分 P。支持 \`title\` 和 \`loading\`。

**默认 \`loading="visible"\`**：在视口附近 200px 挂载播放器，不自动播放。\`click\` 等待点击，\`eager\` 立即挂载。可以用 \`video({ loading: 'click' })\` 设置模块默认值。平台、网络和嵌入权限仍会影响真实播放；不能把本地 iframe 测试当作远程播放保证。自定义平台通过 \`video({ resolveUrl })\` 接入。

点击加载的视频示例（点击前不创建播放器）：

<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="视频示例" />

## 分段译文

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

实际效果（可交互）：

<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>

\`default\` 为 \`origin\`、\`translation\` 或 \`both\`，未指定时默认 \`origin\`（可用工厂 \`defaultMode\` 改写）。角标依次切换原文、译文、对照；对照时译文在前。流式输入只有一侧时先显示已有内容。模块不提供自动翻译服务。

全局 \`parameters.translationMode\` 覆盖各块；传 \`onTranslationModeChange\` 接受角标发出的更改请求，否则全局模式锁定。设回 \`undefined\` 恢复各块的本地选择。见[项目集成](integration.md)。

## 选择与替换

默认高亮存为 annotation，没有 \`==高亮==\` 内置语法。自定义标签需注册插件；不是所有子标签都有同名指令。使用完整清单配置或替换默认模块，见[扩展开发](extensions.md)。
`,CO="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgNDgwIDI0MCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJSZW5kZXJlZCBkb2N1bWVudCI+CiAgPHJlY3Qgd2lkdGg9IjQ4MCIgaGVpZ2h0PSIyNDAiIHJ4PSIxMiIgZmlsbD0iI2VlZjJlYyIvPgogIDxnIGZpbGw9IiMzNjQ2MzMiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLHNlcmlmIj4KICAgIDx0ZXh0IHg9IjMyIiB5PSI2MCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiPk1hcmtkb3duPC90ZXh0PgogICAgPHRleHQgeD0iMzIiIHk9IjEwOCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPlJlYWRhYmxlIHNvdXJjZTwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxNTYiIGZvbnQtc2l6ZT0iMjQiPuKAoiBXcml0ZTwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxOTYiIGZvbnQtc2l6ZT0iMjQiPuKAoiBSZWFkPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",RO="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgNDgwIDI0MCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJNYXJrZG93biBzb3VyY2UiPgogIDxyZWN0IHdpZHRoPSI0ODAiIGhlaWdodD0iMjQwIiByeD0iMTIiIGZpbGw9IiNmM2YxZWUiLz4KICA8ZyBmaWxsPSIjNWE1NjUwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0Ij4KICAgIDx0ZXh0IHg9IjMyIiB5PSI2MCI+IyBNYXJrZG93bjwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyIiB5PSIxMDgiPioqUmVhZGFibGUgc291cmNlKio8L3RleHQ+CiAgICA8dGV4dCB4PSIzMiIgeT0iMTU2Ij4tIFdyaXRlPC90ZXh0PgogICAgPHRleHQgeD0iMzIiIHk9IjE5NiI+LSBSZWFkPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",MO=Object.assign({"../docs/en/README.md":tO,"../docs/en/ai-skills.md":nO,"../docs/en/annotations.md":iO,"../docs/en/api.md":aO,"../docs/en/architecture.md":rO,"../docs/en/extensions.md":oO,"../docs/en/getting-started.md":lO,"../docs/en/integration.md":sO,"../docs/en/modules.md":uO,"../docs/en/performance.md":cO,"../docs/en/plugin-packages.md":dO,"../docs/en/styles.md":fO,"../docs/en/syntax.md":hO,"../docs/zh-CN/README.md":mO,"../docs/zh-CN/ai-skills.md":pO,"../docs/zh-CN/annotations.md":gO,"../docs/zh-CN/api.md":yO,"../docs/zh-CN/architecture.md":bO,"../docs/zh-CN/extensions.md":vO,"../docs/zh-CN/getting-started.md":xO,"../docs/zh-CN/integration.md":wO,"../docs/zh-CN/modules.md":SO,"../docs/zh-CN/performance.md":kO,"../docs/zh-CN/plugin-packages.md":AO,"../docs/zh-CN/styles.md":TO,"../docs/zh-CN/syntax.md":EO}),NO=Object.assign({"../docs/assets/rendered.svg":CO,"../docs/assets/source.svg":RO}),zu=[["README","文档概览","Overview"],["getting-started","快速开始","Getting started"],["modules","内置模块","Built-in modules"],["syntax","默认语法","Default syntax"],["integration","项目集成","Application integration"],["annotations","标注与选区","Annotations and selection"],["extensions","扩展开发","Extension development"],["plugin-packages","插件模块包","Plugin packages"],["styles","样式与字体","Styles and fonts"],["api","API 参考","API reference"],["architecture","架构与行为","Architecture and behavior"],["performance","性能与限制","Performance and limits"],["ai-skills","AI Skills","AI Skills"]];function no(t,i="README",r){return`#/docs/${t}/${i}${r?`?heading=${encodeURIComponent(r)}`:""}`}function zx(t="zh-CN"){if(!location.hash.startsWith("#/docs"))return null;const[i,r=""]=location.hash.slice(1).split("?"),o=i.split("/");return{language:o[2]==="en"?"en":o[2]==="zh-CN"?"zh-CN":t,page:zu.some(([s])=>s===o[3])?o[3]:"README",heading:new URLSearchParams(r).get("heading")??void 0}}function DO(t,i){const r=hn(t);if(!r)return;const o=/^https:\/\/linloir\.github\.io\/LiMR\/downloads\/(limr-[\w.-]+\.zip)$/.exec(r);if(o)return`/LiMR/downloads/${o[1]}`;if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(r))return r;const s=new URL(r,`https://docs.local/docs/${i.language}/${i.page}.md`),u=/^\/docs\/(zh-CN|en)\/([\w-]+)\.md$/.exec(s.pathname);return u&&zu.some(([c])=>c===u[2])?no(u[1],u[2],s.hash.slice(1)):s.pathname==="/README.md"||s.pathname==="/docs/README.md"?no("zh-CN"):s.pathname==="/README.en.md"?no("en"):`https://github.com/Linloir/LiMR/blob/main${s.pathname}${s.hash}`}function OO({route:t,theme:i}){const[r,o]=O.useState(!1),s=O.useRef(null),u=t.language==="zh-CN",c=MO[`../docs/${t.language}/${t.page}.md`],f=`docs-${t.language}-${t.page}`,p=O.useMemo(()=>({image:({node:m})=>{const y=new URL(String(m.url??""),`https://docs.local/docs/${t.language}/${t.page}.md`).pathname;return v.jsx("img",{src:NO[`..${y}`]??hn(m.url,!0),alt:String(m.alt??""),title:m.title?String(m.title):void 0,loading:"lazy",decoding:"async"})},link:({node:m,children:y})=>{const g=DO(m.url,t),x=g?.startsWith("https://");return v.jsx("a",{href:g,target:x?"_blank":void 0,rel:x?"noopener noreferrer":void 0,children:y})}}),[t.language,t.page]);return O.useEffect(()=>{o(!1);const m=requestAnimationFrame(()=>{const y=t.heading&&document.getElementById(`${f}-${t.heading}`);y?y.scrollIntoView():window.scrollTo({top:0,behavior:"instant"}),s.current?.focus({preventScroll:!0})});return()=>cancelAnimationFrame(m)},[f,t.heading]),v.jsxs("div",{className:"demo-docs","data-limr-appearance":"classic",children:[v.jsxs("aside",{className:"demo-docs-directory",children:[v.jsx("div",{className:"demo-docs-directory-heading",children:u?"文档目录":"Documentation"}),v.jsxs("button",{type:"button",className:"demo-docs-toggle","aria-controls":"demo-docs-navigation","aria-expanded":r,onClick:()=>o(m=>!m),children:[v.jsxs("span",{className:"limr-underline",children:[u?"文档目录":"Documentation"," · ",zu.find(([m])=>m===t.page)?.[u?1:2]]}),v.jsx(Ct,{name:"chevron"})]}),v.jsx("nav",{id:"demo-docs-navigation",className:"demo-docs-links","data-open":r||void 0,"aria-label":u?"文档目录":"Documentation",children:zu.map(([m,y,g])=>v.jsx("a",{href:no(t.language,m),"aria-current":t.page===m?"page":void 0,children:v.jsx("span",{className:"limr-underline",children:u?y:g})},m))})]}),v.jsxs("div",{className:"demo-docs-article",ref:s,tabIndex:-1,lang:t.language,children:[t.page==="ai-skills"&&v.jsxs("div",{className:"demo-controls demo-docs-downloads",children:[v.jsxs("a",{href:"/LiMR/downloads/limr-use.zip",download:!0,children:[v.jsx(Ct,{name:"note"}),v.jsxs("span",{className:"limr-underline",children:[u?"下载":"Download"," limr-use"]})]}),v.jsxs("a",{href:"/LiMR/downloads/limr-plugin-development.zip",download:!0,children:[v.jsx(Ct,{name:"note"}),v.jsxs("span",{className:"limr-underline",children:[u?"下载":"Download"," limr-plugin-development"]})]})]}),v.jsx(pn,{documentId:f,source:c??"# Document unavailable",components:p,locale:u?Qn:wu,theme:i,toc:!1,sidebar:!1,fillHeight:!1},f)]})]})}const Gh=[{type:"margin-note",label:"旁注",icon:"comment",color:"#81B29A",hint:"在段落旁留下一个想法",labelEn:"Margin note",hintEn:"Leave a thought beside this passage"},{type:"reading-note",label:"笔记",icon:"note",color:"#6B9BD2",hint:"整理这一段的阅读笔记",labelEn:"Note",hintEn:"Write a reading note"},{type:"reader-question",label:"提问",icon:"question",color:"#E5A06E",hint:"写下还想进一步理解的问题",labelEn:"Question",hintEn:"What would you like to understand?"},{type:"reader-footnote",label:"脚注",icon:"footnote",color:"#B39DDB",hint:"补充解释或参考来源",labelEn:"Footnote",hintEn:"Add an explanation or a source"}];function jO({annotation:t,data:i,editing:r,presentation:o}){const s=km(),u=Wn(),c=u.language?.startsWith("zh")??!1,f=i?.draft??i?.text??"",p=r||i?.draft!==void 0,m=O.useRef(null),y=Gh.find(b=>b.type===t.type);O.useEffect(()=>{if(!p||o==="preview")return;const b=requestAnimationFrame(()=>{const w=m.current;w&&(w.focus({preventScroll:!0}),w.selectionStart=w.selectionEnd=w.value.length)});return()=>cancelAnimationFrame(b)},[p,o]),O.useLayoutEffect(()=>{const b=m.current;if(!b)return;const w=()=>{b.style.height="auto",b.style.height=`${b.scrollHeight}px`};w();let E=b.clientWidth;const A=new ResizeObserver(()=>{b.clientWidth!==E&&(E=b.clientWidth,w())});return A.observe(b.parentElement),()=>A.disconnect()},[p,f]);const g=()=>{f.trim()&&(s.updateAnnotation(t.id,{data:{text:f}}),s.editAnnotation(null))},x=()=>{i?.text.trim()?(s.updateAnnotation(t.id,{data:{text:i.text}}),s.editAnnotation(null)):s.removeAnnotation(t.id)};return v.jsx("div",{className:"demo-note-content","data-limr-card-interactive":"true",children:p?v.jsxs("form",{onSubmit:b=>{b.preventDefault(),g()},children:[v.jsx("textarea",{className:"demo-note-editor",ref:m,"aria-label":c?`${y.label}内容`:`${y.labelEn} content`,rows:1,value:f,onChange:b=>s.updateAnnotation(t.id,{data:{text:i?.text??"",draft:b.target.value}}),placeholder:c?y.hint:y.hintEn,onKeyDown:b=>{b.nativeEvent.isComposing||(b.key==="Escape"?(b.preventDefault(),b.stopPropagation(),x()):b.key==="Enter"&&(b.metaKey||b.ctrlKey)&&(b.preventDefault(),g()))}}),v.jsxs("div",{className:"demo-note-actions",children:[v.jsxs("button",{type:"button",onClick:x,children:[v.jsx(Ct,{name:"close"}),v.jsx("span",{className:"limr-underline",children:c?"取消":"Cancel"})]}),v.jsxs("button",{type:"submit",className:"demo-note-submit",disabled:!f.trim(),children:[v.jsx(Ct,{name:"check"}),v.jsx("span",{className:"limr-underline",children:u.submit})]})]})]}):v.jsxs(v.Fragment,{children:[v.jsx(xm,{source:i?.text||(c?"还没有内容。":"No content yet.")}),v.jsxs("div",{className:"demo-note-actions",children:[v.jsxs("button",{type:"button",onClick:()=>{s.updateAnnotation(t.id,{data:{text:i?.text??"",draft:i?.text??""}}),s.editAnnotation(t.id)},children:[v.jsx(Ct,{name:"edit"}),v.jsx("span",{className:"limr-underline",children:c?"修改":"Edit"})]}),v.jsxs("button",{type:"button",className:"demo-note-delete",onClick:()=>s.removeAnnotation(t.id),children:[v.jsx(Ct,{name:"trash"}),v.jsx("span",{className:"limr-underline",children:u.deleteAnnotations})]})]})]})})}function LO({data:t}){const i=Wn();return v.jsx("span",{children:t?.text||(i.language?.startsWith("zh")?"正在编辑…":"Editing…")})}function X0(){return{name:"reading-notes",annotationTypes:Gh.map(t=>({type:t.type,label:i=>i.language?.startsWith("zh")?t.label:t.labelEn,color:t.color,icon:v.jsx(Ct,{name:t.icon}),Content:jO,sidebar:{Preview:LO},overlay:{previewWidth:300,expand:{placement:"center",width:400,maxHeight:"75dvh"}}})),actions:Gh.map(t=>({id:`reading-notes:${t.type}`,label:i=>i.locale.language?.startsWith("zh")?t.label:t.labelEn,icon:v.jsx(Ct,{name:t.icon}),run:i=>{i.addAnnotation({id:`note-${crypto.randomUUID()}`,type:t.type,data:{text:"",draft:""},anchors:i.selection.syntax.ranges.map(r=>({range:r,documentId:i.document.id,quote:i.document.source.slice(r.start,r.end)}))},{edit:!0}),i.clearSelection()}}))}}const fi="/LiMR/papers/feature-channel.png",zO=`# Figures and translations

[Jump to figure](#target-figure) · Footnote[^note]

<figures id="auto-grid">

<figure src="${fi}" caption="First panel" />
<figure src="${fi}" caption="Second panel" />
<figure src="${fi}" caption="Third panel" />

<figcaption>A group caption with **Markdown**.</figcaption>

</figures>

<figures id="manual-grid" columns="3" rows="1">

<figure src="${fi}" />
<figure src="${fi}" />
<figure src="${fi}" />

</figures>

<figures id="fixed-grid" columns="3" responsive="false">

<figure src="${fi}" />
<figure src="${fi}" />
<figure src="${fi}" />

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

<figure id="target-figure" max-height="180" src="${fi}" caption="Destination" />

[^note]: A footnote destination.
`;function _O(){const[t,i]=O.useState(900),[r,o]=O.useState(),[s,u]=O.useState(null),c=new URLSearchParams(location.search).has("nested");return v.jsxs(v.Fragment,{children:[v.jsxs("div",{children:[v.jsxs("label",{children:["Width",v.jsx("input",{"aria-label":"Reader width",type:"number",value:t,onChange:f=>i(Number(f.target.value))})]}),v.jsxs("select",{"aria-label":"Translation mode",value:r??"local",onChange:f=>o(f.target.value==="local"?void 0:f.target.value),children:[v.jsx("option",{value:"local",children:"Local"}),v.jsx("option",{value:"origin",children:"Origin"}),v.jsx("option",{value:"translation",children:"Translation"}),v.jsx("option",{value:"both",children:"Both"})]})]}),v.jsx("div",{ref:c?u:void 0,"data-testid":"media-scroll",style:{width:"100%",height:c?520:void 0,overflow:c?"auto":void 0},children:v.jsx("div",{style:{width:t,maxWidth:"100%",margin:"0 auto"},children:v.jsx(pn,{source:zO,scrollRoot:c?s:null,toc:!1,sidebar:!1,parameters:{translationMode:r,onTranslationModeChange:o}})})}),v.jsx("div",{"data-testid":"isolated",children:v.jsx(Kn,{source:`<translations>

<origin>Isolated original</origin>

<translation>独立译文</translation>

</translations>`})})]})}function IO(){const[t,i]=O.useState(null);return v.jsxs(v.Fragment,{children:[v.jsx(pn,{source:`<translations>

<origin>

## Original heading

Original **selectable** words.<ref id="paired" />

</origin>

<translation>

## 译文标题

中文 **可选择** 内容。<ref id="paired" />

</translation>

</translations>

<citation id="paired" title="Paired reference" description="Only visible occurrences belong in the sidebar." />`,onSelectionChange:i}),v.jsx("output",{"data-testid":"translation-selection",hidden:!0,children:JSON.stringify(t)})]})}const HO=[X0()],_x=`Before the figures.

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

</translations>`;function BO(){const[t,i]=O.useState(800),[r,o]=O.useState(1),[s,u]=O.useState([]),[c,f]=O.useState(null),p=["一起换行。","final word."].flatMap((m,y)=>{const g=_x.indexOf(m);return Array.from({length:r},(x,b)=>({id:`line-${y}-${b}`,type:"citation",range:{start:g,end:g+m.length},data:{title:`Line note ${b+1}`}}))});return v.jsxs(v.Fragment,{children:[v.jsxs("div",{children:[v.jsxs("label",{children:["Width",v.jsx("input",{"aria-label":"Reader width",type:"number",value:t,onChange:m=>i(Number(m.target.value))})]}),v.jsxs("label",{children:["Markers",v.jsx("input",{"aria-label":"Marker count",type:"number",value:r,onChange:m=>o(Number(m.target.value))})]})]}),v.jsx("div",{style:{width:t,maxWidth:"100%",marginInline:"auto"},children:v.jsx(pn,{documentId:"media-annotations",source:_x,locale:Qn,plugins:HO,toc:!1,sidebar:!1,annotations:[...p,...s],onAnnotationsChange:m=>u(m.filter(y=>!y.id.startsWith("line-"))),onSelectionChange:f})}),v.jsx("output",{"data-testid":"media-selection",hidden:!0,children:JSON.stringify(c)}),v.jsx("output",{"data-testid":"media-annotations",hidden:!0,children:JSON.stringify(s)})]})}const Ix=v.jsx("svg",{viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:v.jsx("path",{d:"m8 2 1.8 4.2L14 8l-4.2 1.8L8 14l-1.8-4.2L2 8l4.2-1.8L8 2Z",fill:"currentColor"})});function jm({adapter:t,type:i="assistant",label:r="Ask assistant",icon:o=Ix,color:s="#8b5cf6",prompt:u=c=>`Explain “${c.text}”`}){function c(m){return v.jsx(vm,{...m,title:r})}function f({data:m}){return v.jsxs("div",{"aria-busy":m?.status==="streaming",children:[v.jsx(xm,{source:m?.text||"…",streaming:m?.status==="streaming"}),m?.status==="error"&&v.jsx("p",{role:"alert",children:m.error})]})}function p({data:m,referenceText:y}){const g=m?.question||y;return g?v.jsx("span",{title:g,children:g}):null}return{name:i,annotationTypes:[{type:i,label:r,icon:o,color:s,Content:f,sidebar:{Preview:p},overlay:{Card:c,expand:{placement:"center",width:680,height:"80dvh"}}}],actions:[{id:`${i}:ask`,label:r,icon:o??Ix,async run(m){const y=`${i}-${crypto.randomUUID()}`,g=u(m.selection);let x="";m.addAnnotation({id:y,type:i,data:{text:x,question:g,status:"streaming"},anchors:m.selection.syntax.ranges.map(b=>({range:b,documentId:m.document.id,quote:m.document.source.slice(b.start,b.end)}))}),m.activateAnnotation(y),m.clearSelection();try{for await(const b of t.answer({selection:m.selection,question:g,signal:m.signal})){if(m.signal.aborted)return;x+=b,m.updateAnnotation(y,{data:{text:x,question:g,status:"streaming"}})}m.signal.aborted||m.updateAnnotation(y,{data:{text:x,question:g,status:"complete"}})}catch(b){m.signal.aborted||m.updateAnnotation(y,{data:{text:x,question:g,status:"error",error:b instanceof Error?b.message:String(b)}})}}}]}}const Z0=`# 阅读，从容一点

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

点击“编辑”修改文章，再点击同一位置的“保存”返回阅读，文本就会保存在当前浏览器中。阅读时新增或修改的批注也会自动保存。下一次回来，可以继续从上一次留下的问题开始。

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
`,qO=`# 在文字旁，留下想法

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
`,UO=`# 让复杂的内容，清晰一点

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
`,FO=`# Express README

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
`,PO=`# Axios README

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
`,VO=`# Alice’s Adventures in Wonderland

Lewis Carroll · 1865

> 英文原著第一至第三章，公版作品。文本取自 [Project Gutenberg](https://www.gutenberg.org/ebooks/11)，保留三章原文与诗行，并为各章开头的选段新译中文；这些译文为 LiMR 示例编写，不取自已有中文译本。段末“原 / 译 / 对照”可切换显示。

## Chapter I · Down the Rabbit-Hole

<translations default="origin">

<origin>

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”

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

There was nothing so _very_ remarkable in that; nor did Alice think it so _very_ much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually _took a watch out of its waistcoat-pocket_, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

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

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled “ORANGE MARMALADE”, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.

</origin>

<translation>

不是井实在太深，就是她落得太慢；往下落时，她有充足的时间打量四周，猜测接下来会发生什么。起初她试着朝下看，可那里黑得什么也看不清。于是她转而看井壁，发现上面布满橱柜和书架，间或还挂着地图和图画。经过一个架子时，她取下一只罐子，上面写着“橘子果酱”，可惜里面是空的。她怕扔下去会砸死下面的人，便趁继续下落时，设法把罐子塞进另一个橱柜。

</translation>

</translations>

“Well!” thought Alice to herself, “after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!” (Which was very likely true.)

Down, down, down. Would the fall _never_ come to an end? “I wonder how many miles I’ve fallen by this time?” she said aloud. “I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—” (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a _very_ good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) “—yes, that’s about the right distance—but then I wonder what Latitude or Longitude I’ve got to?” (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)

Presently she began again. “I wonder if I shall fall right _through_ the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think—” (she was rather glad there _was_ no one listening, this time, as it didn’t sound at all the right word) “—but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?” (and she tried to curtsey as she spoke—fancy _curtseying_ as you’re falling through the air! Do you think you could manage it?) “And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.”

Down, down, down. There was nothing else to do, so Alice soon began talking again. “Dinah’ll miss me very much to-night, I should think!” (Dinah was the cat.) “I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?” And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, “Do cats eat bats? Do cats eat bats?” and sometimes, “Do bats eat cats?” for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, “Now, Dinah, tell me the truth: did you ever eat a bat?” when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.

Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, “Oh my ears and whiskers, how late it’s getting!” She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.

There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.

Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice’s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!

Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; “and even if my head would go through,” thought poor Alice, “it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin.” For, you see, so many out-of-the-way things had happened lately, that Alice had begun to think that very few things indeed were really impossible.

There seemed to be no use in waiting by the little door, so she went back to the table, half hoping she might find another key on it, or at any rate a book of rules for shutting people up like telescopes: this time she found a little bottle on it, (“which certainly was not here before,” said Alice,) and round the neck of the bottle was a paper label, with the words “DRINK ME,” beautifully printed on it in large letters.

It was all very well to say “Drink me,” but the wise little Alice was not going to do _that_ in a hurry. “No, I’ll look first,” she said, “and see whether it’s marked ‘_poison_’ or not”; for she had read several nice little histories about children who had got burnt, and eaten up by wild beasts and other unpleasant things, all because they _would_ not remember the simple rules their friends had taught them: such as, that a red-hot poker will burn you if you hold it too long; and that if you cut your finger _very_ deeply with a knife, it usually bleeds; and she had never forgotten that, if you drink much from a bottle marked “poison,” it is almost certain to disagree with you, sooner or later.

However, this bottle was _not_ marked “poison,” so Alice ventured to taste it, and finding it very nice, (it had, in fact, a sort of mixed flavour of cherry-tart, custard, pine-apple, roast turkey, toffee, and hot buttered toast,) she very soon finished it off.

*      *      *      *      *      *      *

    *      *      *      *      *      *

*      *      *      *      *      *      *

“What a curious feeling!” said Alice; “I must be shutting up like a telescope.”

And so it was indeed: she was now only ten inches high, and her face brightened up at the thought that she was now the right size for going through the little door into that lovely garden. First, however, she waited for a few minutes to see if she was going to shrink any further: she felt a little nervous about this; “for it might end, you know,” said Alice to herself, “in my going out altogether, like a candle. I wonder what I should be like then?” And she tried to fancy what the flame of a candle is like after the candle is blown out, for she could not remember ever having seen such a thing.

After a while, finding that nothing more happened, she decided on going into the garden at once; but, alas for poor Alice! when she got to the door, she found she had forgotten the little golden key, and when she went back to the table for it, she found she could not possibly reach it: she could see it quite plainly through the glass, and she tried her best to climb up one of the legs of the table, but it was too slippery; and when she had tired herself out with trying, the poor little thing sat down and cried.

“Come, there’s no use in crying like that!” said Alice to herself, rather sharply; “I advise you to leave off this minute!” She generally gave herself very good advice, (though she very seldom followed it), and sometimes she scolded herself so severely as to bring tears into her eyes; and once she remembered trying to box her own ears for having cheated herself in a game of croquet she was playing against herself, for this curious child was very fond of pretending to be two people. “But it’s no use now,” thought poor Alice, “to pretend to be two people! Why, there’s hardly enough of me left to make _one_ respectable person!”

Soon her eye fell on a little glass box that was lying under the table: she opened it, and found in it a very small cake, on which the words “EAT ME” were beautifully marked in currants. “Well, I’ll eat it,” said Alice, “and if it makes me grow larger, I can reach the key; and if it makes me grow smaller, I can creep under the door; so either way I’ll get into the garden, and I don’t care which happens!”

She ate a little bit, and said anxiously to herself, “Which way? Which way?”, holding her hand on the top of her head to feel which way it was growing, and she was quite surprised to find that she remained the same size: to be sure, this generally happens when one eats cake, but Alice had got so much into the way of expecting nothing but out-of-the-way things to happen, that it seemed quite dull and stupid for life to go on in the common way.

So she set to work, and very soon finished off the cake.

*      *      *      *      *      *      *

    *      *      *      *      *      *

*      *      *      *      *      *      *

## Chapter II · The Pool of Tears

<translations default="origin">

<origin>

“Curiouser and curiouser!” cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); “now I’m opening out like the largest telescope that ever was! Good-bye, feet!” (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). “Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I’m sure _I_ shan’t be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can;—but I must be kind to them,” thought Alice, “or perhaps they won’t walk the way I want to go! Let me see: I’ll give them a new pair of boots every Christmas.”

</origin>

<translation>

“越来越奇怪，越来越奇怪！”爱丽丝喊道。她惊讶得一时连话都说不周全了。“我现在像一架世界上最大的望远镜那样伸长了！再见啦，脚！”她低头看时，两只脚已经远得几乎看不见。“可怜的小脚呀，以后谁替你们穿鞋袜呢？我肯定办不到啦，离得实在太远了。你们只好自己想办法——不过我得对它们好一点，”她又想，“要不然，它们也许不肯往我想去的地方走呢！对了，每年圣诞节，我都送它们一双新靴子。”

</translation>

</translations>

And she went on planning to herself how she would manage it. “They must go by the carrier,” she thought; “and how funny it’ll seem, sending presents to one’s own feet! And how odd the directions will look!

     _Alice’s Right Foot, Esq., Hearthrug, near the Fender,_ (_with
     Alice’s love_).

Oh dear, what nonsense I’m talking!”

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

“You ought to be ashamed of yourself,” said Alice, “a great girl like you,” (she might well say this), “to go on crying in this way! Stop this moment, I tell you!” But she went on all the same, shedding gallons of tears, until there was a large pool all round her, about four inches deep and reaching half down the hall.

After a time she heard a little pattering of feet in the distance, and she hastily dried her eyes to see what was coming. It was the White Rabbit returning, splendidly dressed, with a pair of white kid gloves in one hand and a large fan in the other: he came trotting along in a great hurry, muttering to himself as he came, “Oh! the Duchess, the Duchess! Oh! won’t she be savage if I’ve kept her waiting!” Alice felt so desperate that she was ready to ask help of any one; so, when the Rabbit came near her, she began, in a low, timid voice, “If you please, sir—” The Rabbit started violently, dropped the white kid gloves and the fan, and skurried away into the darkness as hard as he could go.

Alice took up the fan and gloves, and, as the hall was very hot, she kept fanning herself all the time she went on talking: “Dear, dear! How queer everything is to-day! And yesterday things went on just as usual. I wonder if I’ve been changed in the night? Let me think: was I the same when I got up this morning? I almost think I can remember feeling a little different. But if I’m not the same, the next question is, Who in the world am I? Ah, _that’s_ the great puzzle!” And she began thinking over all the children she knew that were of the same age as herself, to see if she could have been changed for any of them.

“I’m sure I’m not Ada,” she said, “for her hair goes in such long ringlets, and mine doesn’t go in ringlets at all; and I’m sure I can’t be Mabel, for I know all sorts of things, and she, oh! she knows such a very little! Besides, _she’s_ she, and _I’m_ I, and—oh dear, how puzzling it all is! I’ll try if I know all the things I used to know. Let me see: four times five is twelve, and four times six is thirteen, and four times seven is—oh dear! I shall never get to twenty at that rate! However, the Multiplication Table doesn’t signify: let’s try Geography. London is the capital of Paris, and Paris is the capital of Rome, and Rome—no, _that’s_ all wrong, I’m certain! I must have been changed for Mabel! I’ll try and say ‘_How doth the little_—’” and she crossed her hands on her lap as if she were saying lessons, and began to repeat it, but her voice sounded hoarse and strange, and the words did not come the same as they used to do:—

“How doth the little crocodile     Improve his shining tail, And pour the waters of the Nile     On every golden scale!

“How cheerfully he seems to grin,     How neatly spread his claws, And welcome little fishes in     With gently smiling jaws!”

“I’m sure those are not the right words,” said poor Alice, and her eyes filled with tears again as she went on, “I must be Mabel after all, and I shall have to go and live in that poky little house, and have next to no toys to play with, and oh! ever so many lessons to learn! No, I’ve made up my mind about it; if I’m Mabel, I’ll stay down here! It’ll be no use their putting their heads down and saying ‘Come up again, dear!’ I shall only look up and say ‘Who am I then? Tell me that first, and then, if I like being that person, I’ll come up: if not, I’ll stay down here till I’m somebody else’—but, oh dear!” cried Alice, with a sudden burst of tears, “I do wish they _would_ put their heads down! I am so _very_ tired of being all alone here!”

As she said this she looked down at her hands, and was surprised to see that she had put on one of the Rabbit’s little white kid gloves while she was talking. “How _can_ I have done that?” she thought. “I must be growing small again.” She got up and went to the table to measure herself by it, and found that, as nearly as she could guess, she was now about two feet high, and was going on shrinking rapidly: she soon found out that the cause of this was the fan she was holding, and she dropped it hastily, just in time to avoid shrinking away altogether.

“That _was_ a narrow escape!” said Alice, a good deal frightened at the sudden change, but very glad to find herself still in existence; “and now for the garden!” and she ran with all speed back to the little door: but, alas! the little door was shut again, and the little golden key was lying on the glass table as before, “and things are worse than ever,” thought the poor child, “for I never was so small as this before, never! And I declare it’s too bad, that it is!”

As she said these words her foot slipped, and in another moment, splash! she was up to her chin in salt water. Her first idea was that she had somehow fallen into the sea, “and in that case I can go back by railway,” she said to herself. (Alice had been to the seaside once in her life, and had come to the general conclusion, that wherever you go to on the English coast you find a number of bathing machines in the sea, some children digging in the sand with wooden spades, then a row of lodging houses, and behind them a railway station.) However, she soon made out that she was in the pool of tears which she had wept when she was nine feet high.

“I wish I hadn’t cried so much!” said Alice, as she swam about, trying to find her way out. “I shall be punished for it now, I suppose, by being drowned in my own tears! That _will_ be a queer thing, to be sure! However, everything is queer to-day.”

Just then she heard something splashing about in the pool a little way off, and she swam nearer to make out what it was: at first she thought it must be a walrus or hippopotamus, but then she remembered how small she was now, and she soon made out that it was only a mouse that had slipped in like herself.

“Would it be of any use, now,” thought Alice, “to speak to this mouse? Everything is so out-of-the-way down here, that I should think very likely it can talk: at any rate, there’s no harm in trying.” So she began: “O Mouse, do you know the way out of this pool? I am very tired of swimming about here, O Mouse!” (Alice thought this must be the right way of speaking to a mouse: she had never done such a thing before, but she remembered having seen in her brother’s Latin Grammar, “A mouse—of a mouse—to a mouse—a mouse—O mouse!”) The Mouse looked at her rather inquisitively, and seemed to her to wink with one of its little eyes, but it said nothing.

“Perhaps it doesn’t understand English,” thought Alice; “I daresay it’s a French mouse, come over with William the Conqueror.” (For, with all her knowledge of history, Alice had no very clear notion how long ago anything had happened.) So she began again: “Où est ma chatte?” which was the first sentence in her French lesson-book. The Mouse gave a sudden leap out of the water, and seemed to quiver all over with fright. “Oh, I beg your pardon!” cried Alice hastily, afraid that she had hurt the poor animal’s feelings. “I quite forgot you didn’t like cats.”

“Not like cats!” cried the Mouse, in a shrill, passionate voice. “Would _you_ like cats if you were me?”

“Well, perhaps not,” said Alice in a soothing tone: “don’t be angry about it. And yet I wish I could show you our cat Dinah: I think you’d take a fancy to cats if you could only see her. She is such a dear quiet thing,” Alice went on, half to herself, as she swam lazily about in the pool, “and she sits purring so nicely by the fire, licking her paws and washing her face—and she is such a nice soft thing to nurse—and she’s such a capital one for catching mice—oh, I beg your pardon!” cried Alice again, for this time the Mouse was bristling all over, and she felt certain it must be really offended. “We won’t talk about her any more if you’d rather not.”

“We indeed!” cried the Mouse, who was trembling down to the end of his tail. “As if _I_ would talk on such a subject! Our family always _hated_ cats: nasty, low, vulgar things! Don’t let me hear the name again!”

“I won’t indeed!” said Alice, in a great hurry to change the subject of conversation. “Are you—are you fond—of—of dogs?” The Mouse did not answer, so Alice went on eagerly: “There is such a nice little dog near our house I should like to show you! A little bright-eyed terrier, you know, with oh, such long curly brown hair! And it’ll fetch things when you throw them, and it’ll sit up and beg for its dinner, and all sorts of things—I can’t remember half of them—and it belongs to a farmer, you know, and he says it’s so useful, it’s worth a hundred pounds! He says it kills all the rats and—oh dear!” cried Alice in a sorrowful tone, “I’m afraid I’ve offended it again!” For the Mouse was swimming away from her as hard as it could go, and making quite a commotion in the pool as it went.

So she called softly after it, “Mouse dear! Do come back again, and we won’t talk about cats or dogs either, if you don’t like them!” When the Mouse heard this, it turned round and swam slowly back to her: its face was quite pale (with passion, Alice thought), and it said in a low trembling voice, “Let us get to the shore, and then I’ll tell you my history, and you’ll understand why it is I hate cats and dogs.”

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

The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life. Indeed, she had quite a long argument with the Lory, who at last turned sulky, and would only say, “I am older than you, and must know better;” and this Alice would not allow without knowing how old it was, and, as the Lory positively refused to tell its age, there was no more to be said.

</origin>

<translation>

头一个问题当然是怎样重新弄干身子。大家商量了一会儿，爱丽丝竟觉得与它们熟络地说话再自然不过，仿佛认识了一辈子。她还和鹦鹉争论了好久。鹦鹉最后闷闷不乐，只肯说：“我比你年长，当然懂得更多。”可是，除非知道它究竟多大，爱丽丝就不肯认输；鹦鹉又坚决不肯说出年龄，于是也就无话可说了。

</translation>

</translations>

<translations default="origin">

<origin>

At last the Mouse, who seemed to be a person of authority among them, called out, “Sit down, all of you, and listen to me! _I’ll_ soon make you dry enough!” They all sat down at once, in a large ring, with the Mouse in the middle. Alice kept her eyes anxiously fixed on it, for she felt sure she would catch a bad cold if she did not get dry very soon.

</origin>

<translation>

最后，老鼠——它在这群动物中似乎颇有威望——大声说：“都坐下，听我说！我很快就会让你们全干起来！”大家立刻围坐成一个大圈，老鼠坐在中央。爱丽丝焦急地盯着它；她确信，如果不能尽快弄干，自己一定会重重地感冒。

</translation>

</translations>

“Ahem!” said the Mouse with an important air, “are you all ready? This is the driest thing I know. Silence all round, if you please! ‘William the Conqueror, whose cause was favoured by the pope, was soon submitted to by the English, who wanted leaders, and had been of late much accustomed to usurpation and conquest. Edwin and Morcar, the earls of Mercia and Northumbria—’”

“Ugh!” said the Lory, with a shiver.

“I beg your pardon!” said the Mouse, frowning, but very politely: “Did you speak?”

“Not I!” said the Lory hastily.

“I thought you did,” said the Mouse. “—I proceed. ‘Edwin and Morcar, the earls of Mercia and Northumbria, declared for him: and even Stigand, the patriotic archbishop of Canterbury, found it advisable—’”

“Found _what_?” said the Duck.

“Found _it_,” the Mouse replied rather crossly: “of course you know what ‘it’ means.”

“I know what ‘it’ means well enough, when _I_ find a thing,” said the Duck: “it’s generally a frog or a worm. The question is, what did the archbishop find?”

The Mouse did not notice this question, but hurriedly went on, “‘—found it advisable to go with Edgar Atheling to meet William and offer him the crown. William’s conduct at first was moderate. But the insolence of his Normans—’ How are you getting on now, my dear?” it continued, turning to Alice as it spoke.

“As wet as ever,” said Alice in a melancholy tone: “it doesn’t seem to dry me at all.”

“In that case,” said the Dodo solemnly, rising to its feet, “I move that the meeting adjourn, for the immediate adoption of more energetic remedies—”

“Speak English!” said the Eaglet. “I don’t know the meaning of half those long words, and, what’s more, I don’t believe you do either!” And the Eaglet bent down its head to hide a smile: some of the other birds tittered audibly.

“What I was going to say,” said the Dodo in an offended tone, “was, that the best thing to get us dry would be a Caucus-race.”

“What _is_ a Caucus-race?” said Alice; not that she wanted much to know, but the Dodo had paused as if it thought that _somebody_ ought to speak, and no one else seemed inclined to say anything.

“Why,” said the Dodo, “the best way to explain it is to do it.” (And, as you might like to try the thing yourself, some winter day, I will tell you how the Dodo managed it.)

First it marked out a race-course, in a sort of circle, (“the exact shape doesn’t matter,” it said,) and then all the party were placed along the course, here and there. There was no “One, two, three, and away,” but they began running when they liked, and left off when they liked, so that it was not easy to know when the race was over. However, when they had been running half an hour or so, and were quite dry again, the Dodo suddenly called out “The race is over!” and they all crowded round it, panting, and asking, “But who has won?”

This question the Dodo could not answer without a great deal of thought, and it sat for a long time with one finger pressed upon its forehead (the position in which you usually see Shakespeare, in the pictures of him), while the rest waited in silence. At last the Dodo said, “_Everybody_ has won, and all must have prizes.”

“But who is to give the prizes?” quite a chorus of voices asked.

“Why, _she_, of course,” said the Dodo, pointing to Alice with one finger; and the whole party at once crowded round her, calling out in a confused way, “Prizes! Prizes!”

Alice had no idea what to do, and in despair she put her hand in her pocket, and pulled out a box of comfits, (luckily the salt water had not got into it), and handed them round as prizes. There was exactly one a-piece, all round.

“But she must have a prize herself, you know,” said the Mouse.

“Of course,” the Dodo replied very gravely. “What else have you got in your pocket?” he went on, turning to Alice.

“Only a thimble,” said Alice sadly.

“Hand it over here,” said the Dodo.

Then they all crowded round her once more, while the Dodo solemnly presented the thimble, saying “We beg your acceptance of this elegant thimble;” and, when it had finished this short speech, they all cheered.

Alice thought the whole thing very absurd, but they all looked so grave that she did not dare to laugh; and, as she could not think of anything to say, she simply bowed, and took the thimble, looking as solemn as she could.

The next thing was to eat the comfits: this caused some noise and confusion, as the large birds complained that they could not taste theirs, and the small ones choked and had to be patted on the back. However, it was over at last, and they sat down again in a ring, and begged the Mouse to tell them something more.

“You promised to tell me your history, you know,” said Alice, “and why it is you hate—C and D,” she added in a whisper, half afraid that it would be offended again.

“Mine is a long and a sad tale!” said the Mouse, turning to Alice, and sighing.

“It _is_ a long tail, certainly,” said Alice, looking down with wonder at the Mouse’s tail; “but why do you call it sad?” And she kept on puzzling about it while the Mouse was speaking, so that her idea of the tale was something like this:—

         “Fury said to a mouse, That he met in the house, ‘Let us both
         go to law: _I_ will prosecute _you_.—Come, I’ll take no
         denial; We must have a trial: For really this morning I’ve
         nothing to do.’ Said the mouse to the cur, ‘Such a trial, dear
         sir, With no jury or judge, would be wasting our breath.’
         ‘I’ll be judge, I’ll be jury,’ Said cunning old Fury: ‘I’ll
         try the whole cause, and condemn you to death.’”

“You are not attending!” said the Mouse to Alice severely. “What are you thinking of?”

“I beg your pardon,” said Alice very humbly: “you had got to the fifth bend, I think?”

“I had _not!_” cried the Mouse, sharply and very angrily.

“A knot!” said Alice, always ready to make herself useful, and looking anxiously about her. “Oh, do let me help to undo it!”

“I shall do nothing of the sort,” said the Mouse, getting up and walking away. “You insult me by talking such nonsense!”

“I didn’t mean it!” pleaded poor Alice. “But you’re so easily offended, you know!”

The Mouse only growled in reply.

“Please come back and finish your story!” Alice called after it; and the others all joined in chorus, “Yes, please do!” but the Mouse only shook its head impatiently, and walked a little quicker.

“What a pity it wouldn’t stay!” sighed the Lory, as soon as it was quite out of sight; and an old Crab took the opportunity of saying to her daughter “Ah, my dear! Let this be a lesson to you never to lose _your_ temper!” “Hold your tongue, Ma!” said the young Crab, a little snappishly. “You’re enough to try the patience of an oyster!”

“I wish I had our Dinah here, I know I do!” said Alice aloud, addressing nobody in particular. “She’d soon fetch it back!”

“And who is Dinah, if I might venture to ask the question?” said the Lory.

Alice replied eagerly, for she was always ready to talk about her pet: “Dinah’s our cat. And she’s such a capital one for catching mice you can’t think! And oh, I wish you could see her after the birds! Why, she’ll eat a little bird as soon as look at it!”

This speech caused a remarkable sensation among the party. Some of the birds hurried off at once: one old Magpie began wrapping itself up very carefully, remarking, “I really must be getting home; the night-air doesn’t suit my throat!” and a Canary called out in a trembling voice to its children, “Come away, my dears! It’s high time you were all in bed!” On various pretexts they all moved off, and Alice was soon left alone.

“I wish I hadn’t mentioned Dinah!” she said to herself in a melancholy tone. “Nobody seems to like her, down here, and I’m sure she’s the best cat in the world! Oh, my dear Dinah! I wonder if I shall ever see you any more!” And here poor Alice began to cry again, for she felt very lonely and low-spirited. In a little while, however, she again heard a little pattering of footsteps in the distance, and she looked up eagerly, half hoping that the Mouse had changed his mind, and was coming back to finish his story.
`,GO=`# 前赤壁赋

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
`,$O=`# Scikit-learn: Machine Learning in Python

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
`,YO=`# Feature Visualization · 特征可视化

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
`,JO=`# The Building Blocks of Interpretability

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
`,XO=[{id:"welcome",label:"阅读与排版",description:"从一篇完整的文章开始",source:Z0},{id:"notes",label:"做一点笔记",description:"从复述到提问的完整阅读练习",source:qO},{id:"code",label:"公式与代码",description:"数值积分、误差与梯度下降",source:UO},{id:"express",label:"Express README",description:"Web 框架的设计与使用 · 英文",source:FO},{id:"axios",label:"Axios README",description:"请求、示例与 API 配置 · 英文",source:PO},{id:"alice",label:"爱丽丝漫游奇境",description:"英文原著前三章 · 各章选段中英对照",source:VO},{id:"chibi",label:"前赤壁赋",description:"苏轼 · 水与月的对话",source:GO},{id:"paper",label:"scikit-learn 论文",description:"2011 年原论文 · 选段译文与引用",source:$O},{id:"feature-visualization",label:"Feature Visualization",description:"Distill 2017 · 多图布局与逐段译文",source:YO},{id:"building-blocks",label:"可解释性的基础积木",description:"Distill 2018 · 论文插图与中英对照",source:JO},{id:"long",label:"长文阅读",description:"120 节内容，试试目录和滚动",source:Array.from({length:120},(t,i)=>`## 第 ${i+1} 节 · 足够长的标题需要自动换行以保持目录宽度

第 ${i+1} 节内容。

${"长文阅读需要保持清晰、稳定和流畅。".repeat(30)}`).join(`

`)}];function ZO(t,i){return new Promise((r,o)=>{if(i.aborted){o(i.reason);return}const s=()=>{clearTimeout(u),o(i.reason)},u=setTimeout(()=>{i.removeEventListener("abort",s),r()},t);i.addEventListener("abort",s,{once:!0})})}function QO({theme:t="light"}){const[i,r]=O.useState(!0),[o,s]=O.useState("尚未请求"),[u,c]=O.useState(null),f=O.useMemo(()=>[jm({label:"询问助手",prompt:p=>`请解释「${p.text}」。`,adapter:{async*answer({selection:p,signal:m}){s("回答中");try{for(const y of["关于 **",p.text,`** 的说明。

`,"这段回答使用 LiMR 渲染，","并通过同一个插件持续更新。"])await ZO(350,m),yield y;s("已完成")}catch(y){throw s(m.aborted?"已取消":"请求失败"),y}}}})],[]);return v.jsxs("div",{className:"demo-page demo-plugin-page",children:[v.jsxs("div",{className:"demo-plugin-intro",children:[v.jsx("p",{children:"选中正文，试试在阅读中发起一次问答。"}),v.jsx("p",{children:"插件提供菜单、角标和流式卡片。这里使用本地模拟回答。"}),v.jsxs("div",{className:"demo-controls",children:[v.jsx("button",{onClick:()=>r(!i),children:i?"卸载阅读器":"挂载阅读器"})," ",v.jsx("output",{id:"adapter-status",children:o})]})]}),i&&v.jsx(pn,{documentId:"plugin-demo",theme:t,source:`# 插件示例

选中 **重要内容**，再从工具菜单询问助手。

## 另一个章节

正文保持独立。`,plugins:f,locale:Qn,onSelectionChange:c}),v.jsx("output",{id:"selection-data",hidden:!0,children:u?JSON.stringify(u):""})]})}const _u=`# 插件示例

选中 **重要内容**，再从工具菜单询问助手。

单条引用<ref id="single" />与多条引用<ref ids="one,two" />。

## 另一个章节

正文保持独立。

<citation id="single" title="CommonMark Specification" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />

<citation id="one" title="First citation" description="第一条引用的描述。" />

<citation id="two" title="Last citation" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />`,KO=[jm({label:"询问助手",adapter:{async*answer(){yield"本地回答"}}})],Hx=Array.from({length:12},(t,i)=>({id:`answer-${i}`,type:"assistant",range:{start:_u.indexOf("重要内容"),end:_u.indexOf("重要内容")+4},data:{text:`关于 **重要内容** 的说明 ${i+1}。

这段回答使用 LiMR 渲染，并通过同一个插件持续更新。`,question:`问题 ${i+1}：请解释这段内容，并给出一个具体的例子。`,status:"complete"}})),hh=[{type:"palette",label:"Custom palette",color:"#d97706",sidebar:{color:"#2563eb",borderColor:"#9333ea",titleColor:"#059669",textColor:"#be185d",excerptColor:"#4f46e5",previewColor:"#0f766e",previewLines:3,Preview:({data:t})=>t==="hide"?null:v.jsxs("p",{children:["Module preview ",v.jsx("span",{style:{color:"#b45309"},children:"Inline preview"})," ","Long subtitle for configurable preview lines. ".repeat(12)]})},Content:()=>v.jsxs("p",{children:["Module text ",v.jsx("span",{style:{color:"#0369a1"},children:"Inline color"})]})}],Za=`# Citation hover

`+"Readable **rich text** and `inline code` with $x+1$, followed by more words. ".repeat(6)+`<ref id="single" /><ref ids="one,two" /><ref id="single" />

A saved highlight and a hidden highlight.

A **selected passage** with a ranged citation.

Reused source in another paragraph<ref id="single" />.

<citation id="single" title="Single citation" description="A compact description." />

<citation id="one" title="First citation" />

<citation id="two" title="Second citation" />`,WO=[{id:"saved",type:"highlight",range:{start:Za.indexOf("saved highlight"),end:Za.indexOf("saved highlight")+15},data:{color:"#F2C744"}},{id:"hidden",type:"highlight",range:{start:Za.indexOf("hidden highlight"),end:Za.indexOf("hidden highlight")+16},data:{color:"#81B29A",hidden:!0}},{id:"ranged",type:"citation",range:{start:Za.indexOf("selected passage"),end:Za.indexOf("selected passage")+16},data:{title:"Ranged citation"}}],ej=`# Offscreen references

`+Array.from({length:16},(t,i)=>`Referenced passage ${i+1}<ref id="single" />.`).join(`

`)+`

`+"More reading content after the references. ".repeat(160)+`

<citation id="single" title="Repeated citation" description="A short citation description." />`;function tj(){const t=new URLSearchParams(location.search).has("citations"),i=t&&new URLSearchParams(location.search).has("viewport"),[r,o]=O.useState(i?[]:t?WO:Hx),[s,u]=O.useState("#6366f1"),c=O.useMemo(()=>t?d0({color:s}).annotationTypes:void 0,[t,s]),[f,p]=O.useState(!1),[m,y]=O.useState("light"),[g,x]=O.useState("custom"),[b,w]=O.useState(null),E=new URLSearchParams(location.search).has("nested"),A=new URLSearchParams(location.search).has("previews")?`

摘要<ref id="summary" />，链接<ref id="url" />，标题<ref id="title" />。

<citation id="summary" summary="简短**摘要** &amp; 示例" description="完整描述不覆盖摘要。" url="https://example.com/full" />

<citation id="url" url="https://example.com/reference" />

<citation id="title" title="Title fallback" />`:"",k=i?ej:t?Za:f?_u+`

`+Array.from({length:12},(C,D)=>`## Section ${D}

${"正文跟随页面滚动。".repeat(30)}

引用<ref id="single" />。`).join(`

`):_u+A,T=v.jsx(pn,{documentId:"sidebar-fixture",source:k,annotations:r,annotationTypes:c,onAnnotationsChange:o,plugins:KO,theme:m,locale:Qn,scrollRoot:b});return v.jsxs("div",{className:"demo-page",children:[v.jsxs("div",{className:"demo-controls",children:[v.jsx("button",{onClick:()=>o(C=>[...C,{...Hx[0],id:`added-${C.length}`}]),children:"Add annotation"}),v.jsx("button",{onClick:()=>o(C=>C.map(D=>({...D,data:{...D.data,text:`流式回答中的更多内容。

`.repeat(40),status:"streaming"}}))),children:"Stream answer"}),v.jsx("button",{onClick:()=>p(C=>!C),children:"Toggle long document"}),v.jsx("button",{onClick:()=>y(C=>C==="light"?"dark":"light"),children:"Theme"}),v.jsx("button",{onClick:()=>x(C=>C==="custom"?"disabled":C==="disabled"?"empty":"custom"),children:"Toggle preview"}),t&&v.jsx("button",{onClick:()=>u("#0d9488"),children:"Citation color"})]}),E?v.jsx("div",{id:"sidebar-scroll-root",ref:w,style:{height:520,overflow:"auto",border:"1px solid #aaa"},children:T}):T,v.jsx(pn,{documentId:"palette-fixture",source:`# 颜色配置

Module palette.

第二段正文。

第三段正文。`,annotationTypes:g==="disabled"?[{...hh[0],sidebar:{...hh[0].sidebar,Preview:!1}}]:hh,annotations:[{id:"palette",type:"palette",data:g==="empty"?"hide":void 0,range:{start:8,end:14}}],toc:!1,theme:m})]})}function nj(){const[t,i]=O.useState(null),r=new URLSearchParams(location.search).has("reader"),o=O.useMemo(()=>Array.from({length:30},(s,u)=>`## Section ${u+1}

${"A paragraph in a shared scrolling region. ".repeat(25)} <ref id="ref-${u}" />

<citation id="ref-${u}" title="Reference ${u+1}" description="A **nested** description." />`).join(`

`),[]);return v.jsx("div",{className:"demo-page",children:v.jsx("div",{ref:i,id:"scroll-root",style:{height:520,overflowY:"auto",border:"1px solid #aaa"},children:r?v.jsx(pn,{documentId:"scroller",source:o,scrollRoot:t,locale:Qn,style:{padding:20}}):v.jsxs(Sl,{documentId:"scroller",source:o,scrollRoot:t,locale:Qn,children:[v.jsxs("div",{style:{display:"grid",gridTemplateColumns:"190px minmax(0,1fr) 260px",gap:24,padding:20,alignItems:"start"},children:[v.jsx(Ju,{style:{position:"sticky",top:0,height:420}}),v.jsx(Kn,{}),v.jsx(p0,{})]}),v.jsx(Om,{disabled:!0}),v.jsx(J0,{})]})})})}function ij(){const t=`# Same heading

<question answer="[0]"><question-content>Choose</question-content><question-sel>A</question-sel><question-sel>B</question-sel></question>

## Next`;return v.jsxs("div",{className:"demo-page",children:[v.jsx(Kn,{source:t}),v.jsx(Kn,{source:t})]})}const aj={type:"remote",label:"Remote",icon:"◎",overlay:{expand:{placement:"center",height:"80dvh"}},load:async(t,{signal:i})=>{const r=await fetch(`/mock/annotation?version=${t.data?.version??1}`,{signal:i});if(!r.ok)throw new Error("Request failed");return r.json()},Content:({data:t,loading:i,error:r,retry:o})=>v.jsx("div",{children:i?"Loading resource":r?v.jsx("button",{onClick:o,children:"Retry"}):v.jsx("span",{children:t?.title})})};function rj(){const t=km();return v.jsxs("div",{children:[v.jsx("button",{onClick:()=>t.invalidateAnnotation("remote"),children:"Refresh resource"}),v.jsx("button",{onClick:()=>t.updateAnnotation("remote",{data:{version:2}}),children:"Change resource"})]})}function oj(){const t=km(),i=O.useMemo(()=>r=>{r&&t.addAnnotation({id:"remote",type:"remote",range:{start:0,end:10},data:{version:1}})},[t]);return v.jsxs("div",{ref:i,children:[v.jsx(rj,{}),v.jsx(Kn,{}),v.jsx(Om,{})]})}const lj=[aj];function sj(){return v.jsx("div",{className:"demo-page",children:v.jsx(Sl,{source:`Read once.

<video provider="youtube" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />`,annotationTypes:lj,children:v.jsx(oj,{})})})}function uj(t,i){const r=i||{};return(t[t.length-1]===""?[...t,""]:t).join((r.padRight?" ":"")+","+(r.padLeft===!1?"":" ")).trim()}const cj=/[ \t\n\f\r]/g;function dj(t){return typeof t=="object"?t.type==="text"?Bx(t.value):!1:Bx(t)}function Bx(t){return t.replace(cj,"")===""}class Rl{constructor(i,r,o){this.normal=r,this.property=i,o&&(this.space=o)}}Rl.prototype.normal={};Rl.prototype.property={};Rl.prototype.space=void 0;function Q0(t,i){const r={},o={};for(const s of t)Object.assign(r,s.property),Object.assign(o,s.normal);return new Rl(r,o,i)}function $h(t){return t.toLowerCase()}class gn{constructor(i,r){this.attribute=r,this.property=i}}gn.prototype.attribute="";gn.prototype.booleanish=!1;gn.prototype.boolean=!1;gn.prototype.commaOrSpaceSeparated=!1;gn.prototype.commaSeparated=!1;gn.prototype.defined=!1;gn.prototype.mustUseProperty=!1;gn.prototype.number=!1;gn.prototype.overloadedBoolean=!1;gn.prototype.property="";gn.prototype.spaceSeparated=!1;gn.prototype.space=void 0;let fj=0;const Ye=ar(),Ot=ar(),Yh=ar(),Se=ar(),yt=ar(),tr=ar(),Cn=ar();function ar(){return 2**++fj}const Jh=Object.freeze(Object.defineProperty({__proto__:null,boolean:Ye,booleanish:Ot,commaOrSpaceSeparated:Cn,commaSeparated:tr,number:Se,overloadedBoolean:Yh,spaceSeparated:yt},Symbol.toStringTag,{value:"Module"})),mh=Object.keys(Jh);class Lm extends gn{constructor(i,r,o,s){let u=-1;if(super(i,r),qx(this,"space",s),typeof o=="number")for(;++u<mh.length;){const c=mh[u];qx(this,mh[u],(o&Jh[c])===Jh[c])}}}Lm.prototype.defined=!0;function qx(t,i,r){r&&(t[i]=r)}function lo(t){const i={},r={};for(const[o,s]of Object.entries(t.properties)){const u=new Lm(o,t.transform(t.attributes||{},o),s,t.space);t.mustUseProperty&&t.mustUseProperty.includes(o)&&(u.mustUseProperty=!0),i[o]=u,r[$h(o)]=o,r[$h(u.attribute)]=o}return new Rl(i,r,t.space)}const K0=lo({properties:{ariaActiveDescendant:null,ariaAtomic:Ot,ariaAutoComplete:null,ariaBusy:Ot,ariaChecked:Ot,ariaColCount:Se,ariaColIndex:Se,ariaColSpan:Se,ariaControls:yt,ariaCurrent:null,ariaDescribedBy:yt,ariaDetails:null,ariaDisabled:Ot,ariaDropEffect:yt,ariaErrorMessage:null,ariaExpanded:Ot,ariaFlowTo:yt,ariaGrabbed:Ot,ariaHasPopup:null,ariaHidden:Ot,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:yt,ariaLevel:Se,ariaLive:null,ariaModal:Ot,ariaMultiLine:Ot,ariaMultiSelectable:Ot,ariaOrientation:null,ariaOwns:yt,ariaPlaceholder:null,ariaPosInSet:Se,ariaPressed:Ot,ariaReadOnly:Ot,ariaRelevant:null,ariaRequired:Ot,ariaRoleDescription:yt,ariaRowCount:Se,ariaRowIndex:Se,ariaRowSpan:Se,ariaSelected:Ot,ariaSetSize:Se,ariaSort:null,ariaValueMax:Se,ariaValueMin:Se,ariaValueNow:Se,ariaValueText:null,role:null},transform(t,i){return i==="role"?i:"aria-"+i.slice(4).toLowerCase()}});function W0(t,i){return i in t?t[i]:i}function e1(t,i){return W0(t,i.toLowerCase())}const hj=lo({attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:tr,acceptCharset:yt,accessKey:yt,action:null,allow:null,allowFullScreen:Ye,allowPaymentRequest:Ye,allowUserMedia:Ye,alpha:Ye,alt:null,as:null,async:Ye,autoCapitalize:null,autoComplete:yt,autoFocus:Ye,autoPlay:Ye,blocking:yt,capture:null,charSet:null,checked:Ye,cite:null,className:yt,closedBy:null,colorSpace:null,cols:Se,colSpan:Se,command:null,commandFor:null,content:null,contentEditable:Ot,controls:Ye,controlsList:yt,coords:Se|tr,crossOrigin:null,data:null,dateTime:null,decoding:null,default:Ye,defer:Ye,dir:null,dirName:null,disabled:Ye,download:Yh,draggable:Ot,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:Ye,formTarget:null,headers:yt,height:Se,hidden:Yh,high:Se,href:null,hrefLang:null,htmlFor:yt,httpEquiv:yt,id:null,imageSizes:null,imageSrcSet:null,inert:Ye,inputMode:null,integrity:null,is:null,isMap:Ye,itemId:null,itemProp:yt,itemRef:yt,itemScope:Ye,itemType:yt,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:Ye,low:Se,manifest:null,max:null,maxLength:Se,media:null,method:null,min:null,minLength:Se,multiple:Ye,muted:Ye,name:null,nonce:null,noModule:Ye,noValidate:Ye,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:Ye,optimum:Se,pattern:null,ping:yt,placeholder:null,playsInline:Ye,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:Ye,referrerPolicy:null,rel:yt,required:Ye,reversed:Ye,rows:Se,rowSpan:Se,sandbox:yt,scope:null,scoped:Ye,seamless:Ye,selected:Ye,shadowRootClonable:Ye,shadowRootCustomElementRegistry:Ye,shadowRootDelegatesFocus:Ye,shadowRootMode:null,shadowRootSerializable:Ye,shape:null,size:Se,sizes:null,slot:null,span:Se,spellCheck:Ot,src:null,srcDoc:null,srcLang:null,srcSet:null,start:Se,step:null,style:null,tabIndex:Se,target:null,title:null,translate:null,type:null,typeMustMatch:Ye,useMap:null,value:Ot,width:Se,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:yt,axis:null,background:null,bgColor:null,border:Se,borderColor:null,bottomMargin:Se,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:Ye,declare:Ye,event:null,face:null,frame:null,frameBorder:null,hSpace:Se,leftMargin:Se,link:null,longDesc:null,lowSrc:null,marginHeight:Se,marginWidth:Se,noResize:Ye,noHref:Ye,noShade:Ye,noWrap:Ye,object:null,profile:null,prompt:null,rev:null,rightMargin:Se,rules:null,scheme:null,scrolling:Ot,standby:null,summary:null,text:null,topMargin:Se,valueType:null,version:null,vAlign:null,vLink:null,vSpace:Se,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:Ye,disablePictureInPicture:Ye,disableRemotePlayback:Ye,exportParts:tr,part:yt,prefix:null,property:null,results:Se,security:null,unselectable:null},space:"html",transform:e1}),mj=lo({attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",maskType:"mask-type",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},properties:{about:Cn,accentHeight:Se,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:Se,amplitude:Se,arabicForm:null,ascent:Se,attributeName:null,attributeType:null,azimuth:Se,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:Se,by:null,calcMode:null,capHeight:Se,className:yt,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:Se,diffuseConstant:Se,direction:null,display:null,dur:null,divisor:Se,dominantBaseline:null,download:Ye,dx:null,dy:null,edgeMode:null,editable:null,elevation:Se,enableBackground:null,end:null,event:null,exponent:Se,externalResourcesRequired:null,fill:null,fillOpacity:Se,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:tr,g2:tr,glyphName:tr,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:Se,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:Se,horizOriginX:Se,horizOriginY:Se,id:null,ideographic:Se,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:Se,k:Se,k1:Se,k2:Se,k3:Se,k4:Se,kernelMatrix:Cn,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:Se,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:Se,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:Se,overlineThickness:Se,paintOrder:null,panose1:null,path:null,pathLength:Se,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:yt,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:Se,pointsAtY:Se,pointsAtZ:Se,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Cn,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Cn,rev:Cn,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Cn,requiredFeatures:Cn,requiredFonts:Cn,requiredFormats:Cn,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:Se,specularExponent:Se,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:Se,strikethroughThickness:Se,string:null,stroke:null,strokeDashArray:Cn,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:Se,strokeOpacity:Se,strokeWidth:null,style:null,surfaceScale:Se,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Cn,tabIndex:Se,tableValues:null,target:null,targetX:Se,targetY:Se,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Cn,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:Se,underlineThickness:Se,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:Se,values:null,vAlphabetic:Se,vMathematical:Se,vectorEffect:null,vHanging:Se,vIdeographic:Se,version:null,vertAdvY:Se,vertOriginX:Se,vertOriginY:Se,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:Se,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:"svg",transform:W0}),t1=lo({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:"xlink",transform(t,i){return"xlink:"+i.slice(5).toLowerCase()}}),n1=lo({attributes:{xmlnsxlink:"xmlns:xlink"},properties:{xmlnsXLink:null,xmlns:null},space:"xmlns",transform:e1}),i1=lo({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:"xml",transform(t,i){return"xml:"+i.slice(3).toLowerCase()}}),pj={classId:"classID",dataType:"datatype",itemId:"itemID",strokeDashArray:"strokeDasharray",strokeDashOffset:"strokeDashoffset",strokeLineCap:"strokeLinecap",strokeLineJoin:"strokeLinejoin",strokeMiterLimit:"strokeMiterlimit",typeOf:"typeof",xLinkActuate:"xlinkActuate",xLinkArcRole:"xlinkArcrole",xLinkHref:"xlinkHref",xLinkRole:"xlinkRole",xLinkShow:"xlinkShow",xLinkTitle:"xlinkTitle",xLinkType:"xlinkType",xmlnsXLink:"xmlnsXlink"},gj=/[A-Z]/g,Ux=/-[a-z]/g,yj=/^data[-\w.:]+$/i;function bj(t,i){const r=$h(i);let o=i,s=gn;if(r in t.normal)return t.property[t.normal[r]];if(r.length>4&&r.slice(0,4)==="data"&&yj.test(i)){if(i.charAt(4)==="-"){const u=i.slice(5).replace(Ux,xj);o="data"+u.charAt(0).toUpperCase()+u.slice(1)}else{const u=i.slice(4);if(!Ux.test(u)){let c=u.replace(gj,vj);c.charAt(0)!=="-"&&(c="-"+c),i="data"+c}}s=Lm}return new s(o,i)}function vj(t){return"-"+t.toLowerCase()}function xj(t){return t.charAt(1).toUpperCase()}const wj=Q0([K0,hj,t1,n1,i1],"html"),zm=Q0([K0,mj,t1,n1,i1],"svg");function Sj(t){return t.join(" ").trim()}var Xr={},ph,Fx;function kj(){if(Fx)return ph;Fx=1;var t=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,i=/\n/g,r=/^\s*/,o=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,s=/^:\s*/,u=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,f=/^\s+|\s+$/g,p=`
`,m="/",y="*",g="",x="comment",b="declaration";function w(A,k){if(typeof A!="string")throw new TypeError("First argument must be a string");if(!A)return[];k=k||{};var T=1,C=1;function D($){var N=$.match(i);N&&(T+=N.length);var P=$.lastIndexOf(p);C=~P?$.length-P:C+$.length}function z(){var $={line:T,column:C};return function(N){return N.position=new j($),q(),N}}function j($){this.start=$,this.end={line:T,column:C},this.source=k.source}j.prototype.content=A;function L($){var N=new Error(k.source+":"+T+":"+C+": "+$);if(N.reason=$,N.filename=k.source,N.line=T,N.column=C,N.source=A,!k.silent)throw N}function I($){var N=$.exec(A);if(N){var P=N[0];return D(P),A=A.slice(P.length),N}}function q(){I(r)}function H($){var N;for($=$||[];N=Z();)N!==!1&&$.push(N);return $}function Z(){var $=z();if(!(m!=A.charAt(0)||y!=A.charAt(1))){for(var N=2;g!=A.charAt(N)&&(y!=A.charAt(N)||m!=A.charAt(N+1));)++N;if(N+=2,g===A.charAt(N-1))return L("End of comment missing");var P=A.slice(2,N-2);return C+=2,D(P),A=A.slice(N),C+=2,$({type:x,comment:P})}}function oe(){var $=z(),N=I(o);if(N){if(Z(),!I(s))return L("property missing ':'");var P=I(u),K=$({type:b,property:E(N[0].replace(t,g)),value:P?E(P[0].replace(t,g)):g});return I(c),K}}function ue(){var $=[];H($);for(var N;N=oe();)N!==!1&&($.push(N),H($));return $}return q(),ue()}function E(A){return A?A.replace(f,g):g}return ph=w,ph}var Px;function Aj(){if(Px)return Xr;Px=1;var t=Xr&&Xr.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(Xr,"__esModule",{value:!0}),Xr.default=r;const i=t(kj());function r(o,s){let u=null;if(!o||typeof o!="string")return u;const c=(0,i.default)(o),f=typeof s=="function";return c.forEach(p=>{if(p.type!=="declaration")return;const{property:m,value:y}=p;f?s(m,y,p):y&&(u=u||{},u[m]=y)}),u}return Xr}var sl={},Vx;function Tj(){if(Vx)return sl;Vx=1,Object.defineProperty(sl,"__esModule",{value:!0}),sl.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,i=/-([a-z])/g,r=/^[^-]+$/,o=/^-(webkit|moz|ms|o|khtml)-/,s=/^-(ms)-/,u=function(m){return!m||r.test(m)||t.test(m)},c=function(m,y){return y.toUpperCase()},f=function(m,y){return"".concat(y,"-")},p=function(m,y){return y===void 0&&(y={}),u(m)?m:(m=m.toLowerCase(),y.reactCompat?m=m.replace(s,f):m=m.replace(o,f),m.replace(i,c))};return sl.camelCase=p,sl}var ul,Gx;function Ej(){if(Gx)return ul;Gx=1;var t=ul&&ul.__importDefault||function(s){return s&&s.__esModule?s:{default:s}},i=t(Aj()),r=Tj();function o(s,u){var c={};return!s||typeof s!="string"||(0,i.default)(s,function(f,p){f&&p&&(c[(0,r.camelCase)(f,u)]=p)}),c}return o.default=o,ul=o,ul}var Cj=Ej();const Rj=Kh(Cj),a1=r1("end"),_m=r1("start");function r1(t){return i;function i(r){const o=r&&r.position&&r.position[t]||{};if(typeof o.line=="number"&&o.line>0&&typeof o.column=="number"&&o.column>0)return{line:o.line,column:o.column,offset:typeof o.offset=="number"&&o.offset>-1?o.offset:void 0}}}function Mj(t){const i=_m(t),r=a1(t);if(i&&r)return{start:i,end:r}}const Im={}.hasOwnProperty,Nj=new Map,Dj=/[A-Z]/g,Oj=new Set(["table","tbody","thead","tfoot","tr"]),jj=new Set(["td","th"]),o1="https://github.com/syntax-tree/hast-util-to-jsx-runtime";function Lj(t,i){if(!i||i.Fragment===void 0)throw new TypeError("Expected `Fragment` in options");const r=i.filePath||void 0;let o;if(i.development){if(typeof i.jsxDEV!="function")throw new TypeError("Expected `jsxDEV` in options when `development: true`");o=Fj(r,i.jsxDEV)}else{if(typeof i.jsx!="function")throw new TypeError("Expected `jsx` in production options");if(typeof i.jsxs!="function")throw new TypeError("Expected `jsxs` in production options");o=Uj(r,i.jsx,i.jsxs)}const s={Fragment:i.Fragment,ancestors:[],components:i.components||{},create:o,elementAttributeNameCase:i.elementAttributeNameCase||"react",evaluater:i.createEvaluater?i.createEvaluater():void 0,filePath:r,ignoreInvalidStyle:i.ignoreInvalidStyle||!1,passKeys:i.passKeys!==!1,passNode:i.passNode||!1,schema:i.space==="svg"?zm:wj,stylePropertyNameCase:i.stylePropertyNameCase||"dom",tableCellAlignToStyle:i.tableCellAlignToStyle!==!1},u=l1(s,t,void 0);return u&&typeof u!="string"?u:s.create(t,s.Fragment,{children:u||void 0},void 0)}function l1(t,i,r){if(i.type==="element")return zj(t,i,r);if(i.type==="mdxFlowExpression"||i.type==="mdxTextExpression")return _j(t,i);if(i.type==="mdxJsxFlowElement"||i.type==="mdxJsxTextElement")return Hj(t,i,r);if(i.type==="mdxjsEsm")return Ij(t,i);if(i.type==="root")return Bj(t,i,r);if(i.type==="text")return qj(t,i)}function zj(t,i,r){const o=t.schema;let s=o;i.tagName.toLowerCase()==="svg"&&o.space==="html"&&(s=zm,t.schema=s),t.ancestors.push(i);const u=u1(t,i.tagName,!1),c=Pj(t,i);let f=Bm(t,i);return Oj.has(i.tagName)&&(f=f.filter(function(p){return typeof p=="string"?!dj(p):!0})),s1(t,c,u,i),Hm(c,f),t.ancestors.pop(),t.schema=o,t.create(i,u,c,r)}function _j(t,i){if(i.data&&i.data.estree&&t.evaluater){const o=i.data.estree.body[0];return o.type,t.evaluater.evaluateExpression(o.expression)}xl(t,i.position)}function Ij(t,i){if(i.data&&i.data.estree&&t.evaluater)return t.evaluater.evaluateProgram(i.data.estree);xl(t,i.position)}function Hj(t,i,r){const o=t.schema;let s=o;i.name==="svg"&&o.space==="html"&&(s=zm,t.schema=s),t.ancestors.push(i);const u=i.name===null?t.Fragment:u1(t,i.name,!0),c=Vj(t,i),f=Bm(t,i);return s1(t,c,u,i),Hm(c,f),t.ancestors.pop(),t.schema=o,t.create(i,u,c,r)}function Bj(t,i,r){const o={};return Hm(o,Bm(t,i)),t.create(i,t.Fragment,o,r)}function qj(t,i){return i.value}function s1(t,i,r,o){typeof r!="string"&&r!==t.Fragment&&t.passNode&&(i.node=o)}function Hm(t,i){if(i.length>0){const r=i.length>1?i:i[0];r&&(t.children=r)}}function Uj(t,i,r){return o;function o(s,u,c,f){const m=Array.isArray(c.children)?r:i;return f?m(u,c,f):m(u,c)}}function Fj(t,i){return r;function r(o,s,u,c){const f=Array.isArray(u.children),p=_m(o);return i(s,u,c,f,{columnNumber:p?p.column-1:void 0,fileName:t,lineNumber:p?p.line:void 0},void 0)}}function Pj(t,i){const r={};let o,s;for(s in i.properties)if(s!=="children"&&Im.call(i.properties,s)){const u=Gj(t,s,i.properties[s]);if(u){const[c,f]=u;t.tableCellAlignToStyle&&c==="align"&&typeof f=="string"&&jj.has(i.tagName)?o=f:r[c]=f}}if(o){const u=r.style||(r.style={});u[t.stylePropertyNameCase==="css"?"text-align":"textAlign"]=o}return r}function Vj(t,i){const r={};for(const o of i.attributes)if(o.type==="mdxJsxExpressionAttribute")if(o.data&&o.data.estree&&t.evaluater){const u=o.data.estree.body[0];u.type;const c=u.expression;c.type;const f=c.properties[0];f.type,Object.assign(r,t.evaluater.evaluateExpression(f.argument))}else xl(t,i.position);else{const s=o.name;let u;if(o.value&&typeof o.value=="object")if(o.value.data&&o.value.data.estree&&t.evaluater){const f=o.value.data.estree.body[0];f.type,u=t.evaluater.evaluateExpression(f.expression)}else xl(t,i.position);else u=o.value===null?!0:o.value;r[s]=u}return r}function Bm(t,i){const r=[];let o=-1;const s=t.passKeys?new Map:Nj;for(;++o<i.children.length;){const u=i.children[o];let c;if(t.passKeys){const p=u.type==="element"?u.tagName:u.type==="mdxJsxFlowElement"||u.type==="mdxJsxTextElement"?u.name:void 0;if(p){const m=s.get(p)||0;c=p+"-"+m,s.set(p,m+1)}}const f=l1(t,u,c);f!==void 0&&r.push(f)}return r}function Gj(t,i,r){const o=bj(t.schema,i);if(!(r==null||typeof r=="number"&&Number.isNaN(r))){if(Array.isArray(r)&&(r=o.commaSeparated?uj(r):Sj(r)),o.property==="style"){let s=typeof r=="object"?r:$j(t,String(r));return t.stylePropertyNameCase==="css"&&(s=Yj(s)),["style",s]}return[t.elementAttributeNameCase==="react"&&o.space?pj[o.property]||o.property:o.attribute,r]}}function $j(t,i){try{return Rj(i,{reactCompat:!0})}catch(r){if(t.ignoreInvalidStyle)return{};const o=r,s=new lt("Cannot parse `style` attribute",{ancestors:t.ancestors,cause:o,ruleId:"style",source:"hast-util-to-jsx-runtime"});throw s.file=t.filePath||void 0,s.url=o1+"#cannot-parse-style-attribute",s}}function u1(t,i,r){let o;if(!r)o={type:"Literal",value:i};else if(i.includes(".")){const s=i.split(".");let u=-1,c;for(;++u<s.length;){const f=Lv(s[u])?{type:"Identifier",name:s[u]}:{type:"Literal",value:s[u]};c=c?{type:"MemberExpression",object:c,property:f,computed:!!(u&&f.type==="Literal"),optional:!1}:f}o=c}else o=Lv(i)&&!/^[a-z]/.test(i)?{type:"Identifier",name:i}:{type:"Literal",value:i};if(o.type==="Literal"){const s=o.value;return Im.call(t.components,s)?t.components[s]:s}if(t.evaluater)return t.evaluater.evaluateExpression(o);xl(t)}function xl(t,i){const r=new lt("Cannot handle MDX estrees without `createEvaluater`",{ancestors:t.ancestors,place:i,ruleId:"mdx-estree",source:"hast-util-to-jsx-runtime"});throw r.file=t.filePath||void 0,r.url=o1+"#cannot-handle-mdx-estrees-without-createevaluater",r}function Yj(t){const i={};let r;for(r in t)Im.call(t,r)&&(i[Jj(r)]=t[r]);return i}function Jj(t){let i=t.replace(Dj,Xj);return i.slice(0,3)==="ms-"&&(i="-"+i),i}function Xj(t){return"-"+t.toLowerCase()}const gh={action:["form"],cite:["blockquote","del","ins","q"],data:["object"],formAction:["button","input"],href:["a","area","base","link"],icon:["menuitem"],itemId:null,manifest:["html"],ping:["a","area"],poster:["video"],src:["audio","embed","iframe","img","input","script","source","track","video"]};function Zj(t){const i=this;i.parser=r;function r(o){return xu(o,{...i.data("settings"),...t,extensions:i.data("micromarkExtensions")||[],mdastExtensions:i.data("fromMarkdownExtensions")||[]})}}function Qj(t,i){const r={type:"element",tagName:"blockquote",properties:{},children:t.wrap(t.all(i),!0)};return t.patch(i,r),t.applyData(i,r)}function Kj(t,i){const r={type:"element",tagName:"br",properties:{},children:[]};return t.patch(i,r),[t.applyData(i,r),{type:"text",value:`
`}]}function Wj(t,i){const r=i.value?i.value+`
`:"",o={},s=i.lang?i.lang.split(/\s+/):[];s.length>0&&(o.className=["language-"+s[0]]);let u={type:"element",tagName:"code",properties:o,children:[{type:"text",value:r}]};return i.meta&&(u.data={meta:i.meta}),t.patch(i,u),u=t.applyData(i,u),u={type:"element",tagName:"pre",properties:{},children:[u]},t.patch(i,u),u}function eL(t,i){const r={type:"element",tagName:"del",properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}function tL(t,i){const r={type:"element",tagName:"em",properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}function nL(t,i){const r=typeof t.options.clobberPrefix=="string"?t.options.clobberPrefix:"user-content-",o=String(i.identifier).toUpperCase(),s=ro(o.toLowerCase()),u=t.footnoteOrder.indexOf(o);let c,f=t.footnoteCounts.get(o);f===void 0?(f=0,t.footnoteOrder.push(o),c=t.footnoteOrder.length):c=u+1,f+=1,t.footnoteCounts.set(o,f);const p={type:"element",tagName:"a",properties:{href:"#"+r+"fn-"+s,id:r+"fnref-"+s+(f>1?"-"+f:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(c)}]};t.patch(i,p);const m={type:"element",tagName:"sup",properties:{},children:[p]};return t.patch(i,m),t.applyData(i,m)}function iL(t,i){const r={type:"element",tagName:"h"+i.depth,properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}function aL(t,i){if(t.options.allowDangerousHtml){const r={type:"raw",value:i.value};return t.patch(i,r),t.applyData(i,r)}}function c1(t,i){const r=i.referenceType;let o="]";if(r==="collapsed"?o+="[]":r==="full"&&(o+="["+(i.label||i.identifier)+"]"),i.type==="imageReference")return[{type:"text",value:"!["+i.alt+o}];const s=t.all(i),u=s[0];u&&u.type==="text"?u.value="["+u.value:s.unshift({type:"text",value:"["});const c=s[s.length-1];return c&&c.type==="text"?c.value+=o:s.push({type:"text",value:o}),s}function rL(t,i){const r=String(i.identifier).toUpperCase(),o=t.definitionById.get(r);if(!o)return c1(t,i);const s={src:ro(o.url||""),alt:i.alt};o.title!==null&&o.title!==void 0&&(s.title=o.title);const u={type:"element",tagName:"img",properties:s,children:[]};return t.patch(i,u),t.applyData(i,u)}function oL(t,i){const r={src:ro(i.url)};i.alt!==null&&i.alt!==void 0&&(r.alt=i.alt),i.title!==null&&i.title!==void 0&&(r.title=i.title);const o={type:"element",tagName:"img",properties:r,children:[]};return t.patch(i,o),t.applyData(i,o)}function lL(t,i){const r={type:"text",value:i.value.replace(/\r?\n|\r/g," ")};t.patch(i,r);const o={type:"element",tagName:"code",properties:{},children:[r]};return t.patch(i,o),t.applyData(i,o)}function sL(t,i){const r=String(i.identifier).toUpperCase(),o=t.definitionById.get(r);if(!o)return c1(t,i);const s={href:ro(o.url||"")};o.title!==null&&o.title!==void 0&&(s.title=o.title);const u={type:"element",tagName:"a",properties:s,children:t.all(i)};return t.patch(i,u),t.applyData(i,u)}function uL(t,i){const r={href:ro(i.url)};i.title!==null&&i.title!==void 0&&(r.title=i.title);const o={type:"element",tagName:"a",properties:r,children:t.all(i)};return t.patch(i,o),t.applyData(i,o)}function cL(t,i,r){const o=t.all(i),s=r?dL(r):d1(i),u={},c=[];if(typeof i.checked=="boolean"){const y=o[0];let g;y&&y.type==="element"&&y.tagName==="p"?g=y:(g={type:"element",tagName:"p",properties:{},children:[]},o.unshift(g)),g.children.length>0&&g.children.unshift({type:"text",value:" "}),g.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:i.checked,disabled:!0},children:[]}),u.className=["task-list-item"]}let f=-1;for(;++f<o.length;){const y=o[f];(s||f!==0||y.type!=="element"||y.tagName!=="p")&&c.push({type:"text",value:`
`}),y.type==="element"&&y.tagName==="p"&&!s?c.push(...y.children):c.push(y)}const p=o[o.length-1];p&&(s||p.type!=="element"||p.tagName!=="p")&&c.push({type:"text",value:`
`});const m={type:"element",tagName:"li",properties:u,children:c};return t.patch(i,m),t.applyData(i,m)}function dL(t){let i=!1;if(t.type==="list"){i=t.spread||!1;const r=t.children;let o=-1;for(;!i&&++o<r.length;)i=d1(r[o])}return i}function d1(t){const i=t.spread;return i??t.children.length>1}function fL(t,i){const r={},o=t.all(i);let s=-1;for(typeof i.start=="number"&&i.start!==1&&(r.start=i.start);++s<o.length;){const c=o[s];if(c.type==="element"&&c.tagName==="li"&&c.properties&&Array.isArray(c.properties.className)&&c.properties.className.includes("task-list-item")){r.className=["contains-task-list"];break}}const u={type:"element",tagName:i.ordered?"ol":"ul",properties:r,children:t.wrap(o,!0)};return t.patch(i,u),t.applyData(i,u)}function hL(t,i){const r={type:"element",tagName:"p",properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}function mL(t,i){const r={type:"root",children:t.wrap(t.all(i))};return t.patch(i,r),t.applyData(i,r)}function pL(t,i){const r={type:"element",tagName:"strong",properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}function gL(t,i){const r=t.all(i),o=r.shift(),s=[];if(o){const c={type:"element",tagName:"thead",properties:{},children:t.wrap([o],!0)};t.patch(i.children[0],c),s.push(c)}if(r.length>0){const c={type:"element",tagName:"tbody",properties:{},children:t.wrap(r,!0)},f=_m(i.children[1]),p=a1(i.children[i.children.length-1]);f&&p&&(c.position={start:f,end:p}),s.push(c)}const u={type:"element",tagName:"table",properties:{},children:t.wrap(s,!0)};return t.patch(i,u),t.applyData(i,u)}function yL(t,i,r){const o=r?r.children:void 0,u=(o?o.indexOf(i):1)===0?"th":"td",c=r&&r.type==="table"?r.align:void 0,f=c?c.length:i.children.length;let p=-1;const m=[];for(;++p<f;){const g=i.children[p],x={},b=c?c[p]:void 0;b&&(x.align=b);let w={type:"element",tagName:u,properties:x,children:[]};g&&(w.children=t.all(g),t.patch(g,w),w=t.applyData(g,w)),m.push(w)}const y={type:"element",tagName:"tr",properties:{},children:t.wrap(m,!0)};return t.patch(i,y),t.applyData(i,y)}function bL(t,i){const r={type:"element",tagName:"td",properties:{},children:t.all(i)};return t.patch(i,r),t.applyData(i,r)}const $x=9,Yx=32;function vL(t){const i=String(t),r=/\r?\n|\r/g;let o=r.exec(i),s=0;const u=[];for(;o;)u.push(Jx(i.slice(s,o.index),s>0,!0),o[0]),s=o.index+o[0].length,o=r.exec(i);return u.push(Jx(i.slice(s),s>0,!1)),u.join("")}function Jx(t,i,r){let o=0,s=t.length;if(i){let u=t.codePointAt(o);for(;u===$x||u===Yx;)o++,u=t.codePointAt(o)}if(r){let u=t.codePointAt(s-1);for(;u===$x||u===Yx;)s--,u=t.codePointAt(s-1)}return s>o?t.slice(o,s):""}function xL(t,i){const r={type:"text",value:vL(String(i.value))};return t.patch(i,r),t.applyData(i,r)}function wL(t,i){const r={type:"element",tagName:"hr",properties:{},children:[]};return t.patch(i,r),t.applyData(i,r)}const SL={blockquote:Qj,break:Kj,code:Wj,delete:eL,emphasis:tL,footnoteReference:nL,heading:iL,html:aL,imageReference:rL,image:oL,inlineCode:lL,linkReference:sL,link:uL,listItem:cL,list:fL,paragraph:hL,root:mL,strong:pL,table:gL,tableCell:bL,tableRow:yL,text:xL,thematicBreak:wL,toml:du,yaml:du,definition:du,footnoteDefinition:du};function du(){}const f1=-1,nc=0,ml=1,Iu=2,qm=3,Um=4,Fm=5,Pm=6,h1=7,m1=8,{defineProperty:kL}=Object,p1=typeof self=="object"?self:globalThis,Xx=(t,i)=>{switch(t){case"Function":case"SharedWorker":case"Worker":case"eval":case"setInterval":case"setTimeout":throw new TypeError("unable to deserialize "+t)}return new p1[t](i)},AL=(t,i)=>{const r=(s,u)=>(t.set(u,s),s),o=s=>{if(t.has(s))return t.get(s);const[u,c]=i[s];switch(u){case nc:case f1:return r(c,s);case ml:{const f=r([],s);for(const p of c)f.push(o(p));return f}case Iu:{const f=r({},s);for(const[p,m]of c){const y=o(p),g=o(m);y==="__proto__"?kL(f,y,{value:g,configurable:!0,enumerable:!0,writable:!0}):f[y]=g}return f}case qm:return r(new Date(c),s);case Um:{const{source:f,flags:p}=c;return r(new RegExp(f,p),s)}case Fm:{const f=r(new Map,s);for(const[p,m]of c)f.set(o(p),o(m));return f}case Pm:{const f=r(new Set,s);for(const p of c)f.add(o(p));return f}case h1:{const{name:f,message:p}=c;return r(typeof p1[f]=="function"?Xx(f,p):new Error(p),s)}case m1:return r(BigInt(c),s);case"BigInt":return r(Object(BigInt(c)),s);case"ArrayBuffer":return r(new Uint8Array(c).buffer,c);case"DataView":{const{buffer:f}=new Uint8Array(c);return r(new DataView(f),c)}case"-0":return-0}return r(Xx(u,c),s)};return o},Zx=t=>AL(new Map,t)(0),Qa="",{toString:TL}={},{keys:EL,is:CL}=Object,cl=t=>{const i=typeof t;if(i!=="object"||!t)return[nc,i];const r=TL.call(t).slice(8,-1);switch(r){case"Array":return[ml,Qa];case"Object":return[Iu,Qa];case"Date":return[qm,Qa];case"RegExp":return[Um,Qa];case"Map":return[Fm,Qa];case"Set":return[Pm,Qa];case"DataView":return[ml,r]}return r.includes("Array")?[ml,r]:t instanceof Error?[h1,t.name||"Error"]:[Iu,r]},fu=([t,i])=>t===nc&&(i==="function"||i==="symbol"),RL=(t,i,r,o)=>{const s=(c,f)=>{const p=o.push(c)-1;return r.set(f,p),p},u=c=>{if(r.has(c))return r.get(c);let[f,p]=cl(c);switch(f){case nc:{let y=c;switch(p){case"bigint":f=m1,y=c.toString();break;case"number":if(!c&&CL(c,-0))return o.push(["-0"])-1;break;case"function":case"symbol":if(t)throw new TypeError("unable to serialize "+p);y=null;break;case"undefined":return s([f1],c)}return s([f,y],c)}case ml:{if(p){let x=c;return p==="DataView"?x=new Uint8Array(c.buffer):p==="ArrayBuffer"&&(x=new Uint8Array(c)),s([p,[...x]],c)}const y=[],g=s([f,y],c);for(const x of c)y.push(u(x));return g}case Iu:{if(p)switch(p){case"BigInt":return s([p,c.toString()],c);case"Boolean":case"Number":case"String":return s([p,c.valueOf()],c)}if(i&&"toJSON"in c)return u(c.toJSON());const y=[],g=s([f,y],c);for(const x of EL(c))(t||!fu(cl(c[x])))&&y.push([u(x),u(c[x])]);return g}case qm:return s([f,isNaN(c.getTime())?Qa:c.toISOString()],c);case Um:{const{source:y,flags:g}=c;return s([f,{source:y,flags:g}],c)}case Fm:{const y=[],g=s([f,y],c);for(const[x,b]of c)(t||!(fu(cl(x))||fu(cl(b))))&&y.push([u(x),u(b)]);return g}case Pm:{const y=[],g=s([f,y],c);for(const x of c)(t||!fu(cl(x)))&&y.push(u(x));return g}}const{message:m}=c;return s([f,{name:p,message:m}],c)};return u},Qx=(t,{json:i,lossy:r}={})=>{const o=[];return RL(!(i||r),!!i,new Map,o)(t),o},Hu=typeof structuredClone=="function"?(t,i)=>i&&("json"in i||"lossy"in i)?Zx(Qx(t,i)):structuredClone(t):(t,i)=>Zx(Qx(t,i));function ML(t,i){const r=[{type:"text",value:"↩"}];return i>1&&r.push({type:"element",tagName:"sup",properties:{},children:[{type:"text",value:String(i)}]}),r}function NL(t,i){return"Back to reference "+(t+1)+(i>1?"-"+i:"")}function DL(t){const i=typeof t.options.clobberPrefix=="string"?t.options.clobberPrefix:"user-content-",r=t.options.footnoteBackContent||ML,o=t.options.footnoteBackLabel||NL,s=t.options.footnoteLabel||"Footnotes",u=t.options.footnoteLabelTagName||"h2",c=t.options.footnoteLabelProperties||{className:["sr-only"]},f=[];let p=-1;for(;++p<t.footnoteOrder.length;){const m=t.footnoteById.get(t.footnoteOrder[p]);if(!m)continue;const y=t.all(m),g=String(m.identifier).toUpperCase(),x=ro(g.toLowerCase());let b=0;const w=[],E=t.footnoteCounts.get(g);for(;E!==void 0&&++b<=E;){w.length>0&&w.push({type:"text",value:" "});let T=typeof r=="string"?r:r(p,b);typeof T=="string"&&(T={type:"text",value:T}),w.push({type:"element",tagName:"a",properties:{href:"#"+i+"fnref-"+x+(b>1?"-"+b:""),dataFootnoteBackref:"",ariaLabel:typeof o=="string"?o:o(p,b),className:["data-footnote-backref"]},children:Array.isArray(T)?T:[T]})}const A=y[y.length-1];if(A&&A.type==="element"&&A.tagName==="p"){const T=A.children[A.children.length-1];T&&T.type==="text"?T.value+=" ":A.children.push({type:"text",value:" "}),A.children.push(...w)}else y.push(...w);const k={type:"element",tagName:"li",properties:{id:i+"fn-"+x},children:t.wrap(y,!0)};t.patch(m,k),f.push(k)}if(f.length!==0)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:u,properties:{...Hu(c),id:"footnote-label"},children:[{type:"text",value:s}]},{type:"text",value:`
`},{type:"element",tagName:"ol",properties:{},children:t.wrap(f,!0)},{type:"text",value:`
`}]}}const Xh={}.hasOwnProperty,OL={};function jL(t,i){const r=i||OL,o=new Map,s=new Map,u=new Map,c={...SL,...r.handlers},f={all:m,applyData:zL,definitionById:o,footnoteById:s,footnoteCounts:u,footnoteOrder:[],handlers:c,one:p,options:r,patch:LL,wrap:IL};return hm(t,function(y){if(y.type==="definition"||y.type==="footnoteDefinition"){const g=y.type==="definition"?o:s,x=String(y.identifier).toUpperCase();g.has(x)||g.set(x,y)}}),f;function p(y,g){const x=y.type,b=f.handlers[x];if(Xh.call(f.handlers,x)&&b)return b(f,y,g);if(f.options.passThrough&&f.options.passThrough.includes(x)){if("children"in y){const{children:E,...A}=y,k=Hu(A);return k.children=f.all(y),k}return Hu(y)}return(f.options.unknownHandler||_L)(f,y,g)}function m(y){const g=[];if("children"in y){const x=y.children;let b=-1;for(;++b<x.length;){const w=f.one(x[b],y);if(w){if(b&&x[b-1].type==="break"&&(!Array.isArray(w)&&w.type==="text"&&(w.value=Kx(w.value)),!Array.isArray(w)&&w.type==="element")){const E=w.children[0];E&&E.type==="text"&&(E.value=Kx(E.value))}Array.isArray(w)?g.push(...w):g.push(w)}}}return g}}function LL(t,i){t.position&&(i.position=Mj(t))}function zL(t,i){let r=i;if(t&&t.data){const o=t.data.hName,s=t.data.hChildren,u=t.data.hProperties;if(typeof o=="string")if(r.type==="element")r.tagName=o;else{const c="children"in r?r.children:[r];r={type:"element",tagName:o,properties:{},children:c}}r.type==="element"&&u&&Object.assign(r.properties,Hu(u)),"children"in r&&r.children&&s!==null&&s!==void 0&&(r.children=s)}return r}function _L(t,i){const r=i.data||{},o="value"in i&&!(Xh.call(r,"hProperties")||Xh.call(r,"hChildren"))?{type:"text",value:i.value}:{type:"element",tagName:"div",properties:{},children:t.all(i)};return t.patch(i,o),t.applyData(i,o)}function IL(t,i){const r=[];let o=-1;for(i&&r.push({type:"text",value:`
`});++o<t.length;)o&&r.push({type:"text",value:`
`}),r.push(t[o]);return i&&t.length>0&&r.push({type:"text",value:`
`}),r}function Kx(t){let i=0,r=t.charCodeAt(i);for(;r===9||r===32;)i++,r=t.charCodeAt(i);return t.slice(i)}function Wx(t,i){const r=jL(t,i),o=r.one(t,void 0),s=DL(r),u=Array.isArray(o)?{type:"root",children:o}:o||{type:"root",children:[]};return s&&u.children.push({type:"text",value:`
`},s),u}function HL(t,i){return t&&"run"in t?async function(r,o){const s=Wx(r,{file:o,...i});await t.run(s,o)}:function(r,o){return Wx(r,{file:o,...t||i})}}function ew(t){if(t)throw t}var yh,tw;function BL(){if(tw)return yh;tw=1;var t=Object.prototype.hasOwnProperty,i=Object.prototype.toString,r=Object.defineProperty,o=Object.getOwnPropertyDescriptor,s=function(m){return typeof Array.isArray=="function"?Array.isArray(m):i.call(m)==="[object Array]"},u=function(m){if(!m||i.call(m)!=="[object Object]")return!1;var y=t.call(m,"constructor"),g=m.constructor&&m.constructor.prototype&&t.call(m.constructor.prototype,"isPrototypeOf");if(m.constructor&&!y&&!g)return!1;var x;for(x in m);return typeof x>"u"||t.call(m,x)},c=function(m,y){r&&y.name==="__proto__"?r(m,y.name,{enumerable:!0,configurable:!0,value:y.newValue,writable:!0}):m[y.name]=y.newValue},f=function(m,y){if(y==="__proto__")if(t.call(m,y)){if(o)return o(m,y).value}else return;return m[y]};return yh=function p(){var m,y,g,x,b,w,E=arguments[0],A=1,k=arguments.length,T=!1;for(typeof E=="boolean"&&(T=E,E=arguments[1]||{},A=2),(E==null||typeof E!="object"&&typeof E!="function")&&(E={});A<k;++A)if(m=arguments[A],m!=null)for(y in m)g=f(E,y),x=f(m,y),E!==x&&(T&&x&&(u(x)||(b=s(x)))?(b?(b=!1,w=g&&s(g)?g:[]):w=g&&u(g)?g:{},c(E,{name:y,newValue:p(T,w,x)})):typeof x<"u"&&c(E,{name:y,newValue:x}));return E},yh}var qL=BL();const bh=Kh(qL);function Zh(t){if(typeof t!="object"||t===null)return!1;const i=Object.getPrototypeOf(t);return(i===null||i===Object.prototype||Object.getPrototypeOf(i)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)}function UL(){const t=[],i={run:r,use:o};return i;function r(...s){let u=-1;const c=s.pop();if(typeof c!="function")throw new TypeError("Expected function as last argument, not "+c);f(null,...s);function f(p,...m){const y=t[++u];let g=-1;if(p){c(p);return}for(;++g<s.length;)(m[g]===null||m[g]===void 0)&&(m[g]=s[g]);s=m,y?FL(y,f)(...m):c(null,...m)}}function o(s){if(typeof s!="function")throw new TypeError("Expected `middelware` to be a function, not "+s);return t.push(s),i}}function FL(t,i){let r;return o;function o(...c){const f=t.length>c.length;let p;f&&c.push(s);try{p=t.apply(this,c)}catch(m){const y=m;if(f&&r)throw y;return s(y)}f||(p&&p.then&&typeof p.then=="function"?p.then(u,s):p instanceof Error?s(p):u(p))}function s(c,...f){r||(r=!0,i(c,...f))}function u(c){s(null,c)}}const hi={basename:PL,dirname:VL,extname:GL,join:$L,sep:"/"};function PL(t,i){if(i!==void 0&&typeof i!="string")throw new TypeError('"ext" argument must be a string');Ml(t);let r=0,o=-1,s=t.length,u;if(i===void 0||i.length===0||i.length>t.length){for(;s--;)if(t.codePointAt(s)===47){if(u){r=s+1;break}}else o<0&&(u=!0,o=s+1);return o<0?"":t.slice(r,o)}if(i===t)return"";let c=-1,f=i.length-1;for(;s--;)if(t.codePointAt(s)===47){if(u){r=s+1;break}}else c<0&&(u=!0,c=s+1),f>-1&&(t.codePointAt(s)===i.codePointAt(f--)?f<0&&(o=s):(f=-1,o=c));return r===o?o=c:o<0&&(o=t.length),t.slice(r,o)}function VL(t){if(Ml(t),t.length===0)return".";let i=-1,r=t.length,o;for(;--r;)if(t.codePointAt(r)===47){if(o){i=r;break}}else o||(o=!0);return i<0?t.codePointAt(0)===47?"/":".":i===1&&t.codePointAt(0)===47?"//":t.slice(0,i)}function GL(t){Ml(t);let i=t.length,r=-1,o=0,s=-1,u=0,c;for(;i--;){const f=t.codePointAt(i);if(f===47){if(c){o=i+1;break}continue}r<0&&(c=!0,r=i+1),f===46?s<0?s=i:u!==1&&(u=1):s>-1&&(u=-1)}return s<0||r<0||u===0||u===1&&s===r-1&&s===o+1?"":t.slice(s,r)}function $L(...t){let i=-1,r;for(;++i<t.length;)Ml(t[i]),t[i]&&(r=r===void 0?t[i]:r+"/"+t[i]);return r===void 0?".":YL(r)}function YL(t){Ml(t);const i=t.codePointAt(0)===47;let r=JL(t,!i);return r.length===0&&!i&&(r="."),r.length>0&&t.codePointAt(t.length-1)===47&&(r+="/"),i?"/"+r:r}function JL(t,i){let r="",o=0,s=-1,u=0,c=-1,f,p;for(;++c<=t.length;){if(c<t.length)f=t.codePointAt(c);else{if(f===47)break;f=47}if(f===47){if(!(s===c-1||u===1))if(s!==c-1&&u===2){if(r.length<2||o!==2||r.codePointAt(r.length-1)!==46||r.codePointAt(r.length-2)!==46){if(r.length>2){if(p=r.lastIndexOf("/"),p!==r.length-1){p<0?(r="",o=0):(r=r.slice(0,p),o=r.length-1-r.lastIndexOf("/")),s=c,u=0;continue}}else if(r.length>0){r="",o=0,s=c,u=0;continue}}i&&(r=r.length>0?r+"/..":"..",o=2)}else r.length>0?r+="/"+t.slice(s+1,c):r=t.slice(s+1,c),o=c-s-1;s=c,u=0}else f===46&&u>-1?u++:u=-1}return r}function Ml(t){if(typeof t!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(t))}const XL={cwd:ZL};function ZL(){return"/"}function Qh(t){return!!(t!==null&&typeof t=="object"&&"href"in t&&t.href&&"protocol"in t&&t.protocol&&t.auth===void 0)}function QL(t){if(typeof t=="string")t=new URL(t);else if(!Qh(t)){const i=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+t+"`");throw i.code="ERR_INVALID_ARG_TYPE",i}if(t.protocol!=="file:"){const i=new TypeError("The URL must be of scheme file");throw i.code="ERR_INVALID_URL_SCHEME",i}return KL(t)}function KL(t){if(t.hostname!==""){const o=new TypeError('File URL host must be "localhost" or empty on darwin');throw o.code="ERR_INVALID_FILE_URL_HOST",o}const i=t.pathname;let r=-1;for(;++r<i.length;)if(i.codePointAt(r)===37&&i.codePointAt(r+1)===50){const o=i.codePointAt(r+2);if(o===70||o===102){const s=new TypeError("File URL path must not include encoded / characters");throw s.code="ERR_INVALID_FILE_URL_PATH",s}}return decodeURIComponent(i)}const vh=["history","path","basename","stem","extname","dirname"];class g1{constructor(i){let r;i?Qh(i)?r={path:i}:typeof i=="string"||WL(i)?r={value:i}:r=i:r={},this.cwd="cwd"in r?"":XL.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let o=-1;for(;++o<vh.length;){const u=vh[o];u in r&&r[u]!==void 0&&r[u]!==null&&(this[u]=u==="history"?[...r[u]]:r[u])}let s;for(s in r)vh.includes(s)||(this[s]=r[s])}get basename(){return typeof this.path=="string"?hi.basename(this.path):void 0}set basename(i){wh(i,"basename"),xh(i,"basename"),this.path=hi.join(this.dirname||"",i)}get dirname(){return typeof this.path=="string"?hi.dirname(this.path):void 0}set dirname(i){nw(this.basename,"dirname"),this.path=hi.join(i||"",this.basename)}get extname(){return typeof this.path=="string"?hi.extname(this.path):void 0}set extname(i){if(xh(i,"extname"),nw(this.dirname,"extname"),i){if(i.codePointAt(0)!==46)throw new Error("`extname` must start with `.`");if(i.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=hi.join(this.dirname,this.stem+(i||""))}get path(){return this.history[this.history.length-1]}set path(i){Qh(i)&&(i=QL(i)),wh(i,"path"),this.path!==i&&this.history.push(i)}get stem(){return typeof this.path=="string"?hi.basename(this.path,this.extname):void 0}set stem(i){wh(i,"stem"),xh(i,"stem"),this.path=hi.join(this.dirname||"",i+(this.extname||""))}fail(i,r,o){const s=this.message(i,r,o);throw s.fatal=!0,s}info(i,r,o){const s=this.message(i,r,o);return s.fatal=void 0,s}message(i,r,o){const s=new lt(i,r,o);return this.path&&(s.name=this.path+":"+s.name,s.file=this.path),s.fatal=!1,this.messages.push(s),s}toString(i){return this.value===void 0?"":typeof this.value=="string"?this.value:new TextDecoder(i||void 0).decode(this.value)}}function xh(t,i){if(t&&t.includes(hi.sep))throw new Error("`"+i+"` cannot be a path: did not expect `"+hi.sep+"`")}function wh(t,i){if(!t)throw new Error("`"+i+"` cannot be empty")}function nw(t,i){if(!t)throw new Error("Setting `"+i+"` requires `path` to be set too")}function WL(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}const ez=(function(t){const o=this.constructor.prototype,s=o[t],u=function(){return s.apply(u,arguments)};return Object.setPrototypeOf(u,o),u}),tz={}.hasOwnProperty;class Vm extends ez{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=UL()}copy(){const i=new Vm;let r=-1;for(;++r<this.attachers.length;){const o=this.attachers[r];i.use(...o)}return i.data(bh(!0,{},this.namespace)),i}data(i,r){return typeof i=="string"?arguments.length===2?(Ah("data",this.frozen),this.namespace[i]=r,this):tz.call(this.namespace,i)&&this.namespace[i]||void 0:i?(Ah("data",this.frozen),this.namespace=i,this):this.namespace}freeze(){if(this.frozen)return this;const i=this;for(;++this.freezeIndex<this.attachers.length;){const[r,...o]=this.attachers[this.freezeIndex];if(o[0]===!1)continue;o[0]===!0&&(o[0]=void 0);const s=r.call(i,...o);typeof s=="function"&&this.transformers.use(s)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(i){this.freeze();const r=hu(i),o=this.parser||this.Parser;return Sh("parse",o),o(String(r),r)}process(i,r){const o=this;return this.freeze(),Sh("process",this.parser||this.Parser),kh("process",this.compiler||this.Compiler),r?s(void 0,r):new Promise(s);function s(u,c){const f=hu(i),p=o.parse(f);o.run(p,f,function(y,g,x){if(y||!g||!x)return m(y);const b=g,w=o.stringify(b,x);az(w)?x.value=w:x.result=w,m(y,x)});function m(y,g){y||!g?c(y):u?u(g):r(void 0,g)}}}processSync(i){let r=!1,o;return this.freeze(),Sh("processSync",this.parser||this.Parser),kh("processSync",this.compiler||this.Compiler),this.process(i,s),aw("processSync","process",r),o;function s(u,c){r=!0,ew(u),o=c}}run(i,r,o){iw(i),this.freeze();const s=this.transformers;return!o&&typeof r=="function"&&(o=r,r=void 0),o?u(void 0,o):new Promise(u);function u(c,f){const p=hu(r);s.run(i,p,m);function m(y,g,x){const b=g||i;y?f(y):c?c(b):o(void 0,b,x)}}}runSync(i,r){let o=!1,s;return this.run(i,r,u),aw("runSync","run",o),s;function u(c,f){ew(c),s=f,o=!0}}stringify(i,r){this.freeze();const o=hu(r),s=this.compiler||this.Compiler;return kh("stringify",s),iw(i),s(i,o)}use(i,...r){const o=this.attachers,s=this.namespace;if(Ah("use",this.frozen),i!=null)if(typeof i=="function")p(i,r);else if(typeof i=="object")Array.isArray(i)?f(i):c(i);else throw new TypeError("Expected usable value, not `"+i+"`");return this;function u(m){if(typeof m=="function")p(m,[]);else if(typeof m=="object")if(Array.isArray(m)){const[y,...g]=m;p(y,g)}else c(m);else throw new TypeError("Expected usable value, not `"+m+"`")}function c(m){if(!("plugins"in m)&&!("settings"in m))throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");f(m.plugins),m.settings&&(s.settings=bh(!0,s.settings,m.settings))}function f(m){let y=-1;if(m!=null)if(Array.isArray(m))for(;++y<m.length;){const g=m[y];u(g)}else throw new TypeError("Expected a list of plugins, not `"+m+"`")}function p(m,y){let g=-1,x=-1;for(;++g<o.length;)if(o[g][0]===m){x=g;break}if(x===-1)o.push([m,...y]);else if(y.length>0){let[b,...w]=y;const E=o[x][1];Zh(E)&&Zh(b)&&(b=bh(!0,E,b)),o[x]=[m,b,...w]}}}}const nz=new Vm().freeze();function Sh(t,i){if(typeof i!="function")throw new TypeError("Cannot `"+t+"` without `parser`")}function kh(t,i){if(typeof i!="function")throw new TypeError("Cannot `"+t+"` without `compiler`")}function Ah(t,i){if(i)throw new Error("Cannot call `"+t+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function iw(t){if(!Zh(t)||typeof t.type!="string")throw new TypeError("Expected node, got `"+t+"`")}function aw(t,i,r){if(!r)throw new Error("`"+t+"` finished async. Use `"+i+"` instead")}function hu(t){return iz(t)?t:new g1(t)}function iz(t){return!!(t&&typeof t=="object"&&"message"in t&&"messages"in t)}function az(t){return typeof t=="string"||rz(t)}function rz(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}const oz="https://github.com/remarkjs/react-markdown/blob/main/changelog.md",rw=[],ow={allowDangerousHtml:!0},lz=/^(https?|ircs?|mailto|xmpp)$/i,sz=[{from:"astPlugins",id:"remove-buggy-html-in-markdown-parser"},{from:"allowDangerousHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"allowNode",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowElement"},{from:"allowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowedElements"},{from:"className",id:"remove-classname"},{from:"disallowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"disallowedElements"},{from:"escapeHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"includeElementIndex",id:"#remove-includeelementindex"},{from:"includeNodeIndex",id:"change-includenodeindex-to-includeelementindex"},{from:"linkTarget",id:"remove-linktarget"},{from:"plugins",id:"change-plugins-to-remarkplugins",to:"remarkPlugins"},{from:"rawSourcePos",id:"#remove-rawsourcepos"},{from:"renderers",id:"change-renderers-to-components",to:"components"},{from:"source",id:"change-source-to-children",to:"children"},{from:"sourcePos",id:"#remove-sourcepos"},{from:"transformImageUri",id:"#add-urltransform",to:"urlTransform"},{from:"transformLinkUri",id:"#add-urltransform",to:"urlTransform"}];function y1(t){const i=uz(t),r=cz(t);return dz(i.runSync(i.parse(r),r),t)}function uz(t){const i=t.rehypePlugins||rw,r=t.remarkPlugins||rw,o=t.remarkRehypeOptions?{...t.remarkRehypeOptions,...ow}:ow;return nz().use(Zj).use(r).use(HL,o).use(i)}function cz(t){const i=t.children||"",r=new g1;return typeof i=="string"&&(r.value=i),r}function dz(t,i){const r=i.allowedElements,o=i.allowElement,s=i.components,u=i.disallowedElements,c=i.skipHtml,f=i.unwrapDisallowed,p=i.urlTransform||fz;for(const y of sz)Object.hasOwn(i,y.from)&&(""+y.from+(y.to?"use `"+y.to+"` instead":"remove it")+oz+y.id,void 0);return hm(t,m),Lj(t,{Fragment:v.Fragment,components:s,ignoreInvalidStyle:!0,jsx:v.jsx,jsxs:v.jsxs,passKeys:!0,passNode:!0});function m(y,g,x){if(y.type==="raw"&&x&&typeof g=="number")return c?x.children.splice(g,1):x.children[g]={type:"text",value:y.value},g;if(y.type==="element"){let b;for(b in gh)if(Object.hasOwn(gh,b)&&Object.hasOwn(y.properties,b)){const w=y.properties[b],E=gh[b];(E===null||E.includes(y.tagName))&&(y.properties[b]=p(String(w||""),b,y))}}if(y.type==="element"){let b=r?!r.includes(y.tagName):u?u.includes(y.tagName):!1;if(!b&&o&&typeof g=="number"&&(b=!o(y,g,x)),b&&x&&typeof g=="number")return f&&y.children?x.children.splice(g,1,...y.children):x.children.splice(g,1),g}}}function fz(t){const i=t.indexOf(":"),r=t.indexOf("?"),o=t.indexOf("#"),s=t.indexOf("/");return i===-1||s!==-1&&i>s||r!==-1&&i>r||o!==-1&&i>o||lz.test(t.slice(0,i))?t:""}const hz={};function b1(t){const i=this,r=t||hz,o=i.data(),s=o.micromarkExtensions||(o.micromarkExtensions=[]),u=o.fromMarkdownExtensions||(o.fromMarkdownExtensions=[]),c=o.toMarkdownExtensions||(o.toMarkdownExtensions=[]);s.push(Gw(r)),u.push(a0()),c.push(JM(r))}function v1(t){return Array.from({length:t},(i,r)=>`## Section ${r+1}

A paragraph with **strong**, *emphasis*, [a link](https://example.com) and \`code\`. ${"Long documents should stay readable and interactive. ".repeat(5)}

- Item one
- Item two

| Name | Value |
| --- | ---: |
| Alpha | ${r} |
`).join(`
`)}const mz=[gm()];function pz(){const t=O.useRef(null);return O.useEffect(()=>{window.limrBenchmark=async({renderer:i,sections:r,stream:o=!1})=>{const s=Ch.createRoot(t.current),u=v1(r),c=[],f=(m,y)=>{const g=performance.now();bl.flushSync(()=>s.render(i==="limr"?v.jsx(Kn,{source:m,streaming:y,extensions:mz,documentId:"benchmark"}):v.jsx("article",{className:"limr-prose",children:v.jsx(y1,{remarkPlugins:[b1],children:m})}))),t.current.getBoundingClientRect(),c.push(performance.now()-g)};if(o){f("",!0);for(let m=256;m<u.length+256;m+=256)f(u.slice(0,m),m<u.length),await new Promise(requestAnimationFrame)}else f(u,!1);const p={characters:u.length,updates:c.length,totalMs:c.reduce((m,y)=>m+y,0),p95Ms:c.sort((m,y)=>m-y)[Math.floor(c.length*.95)],maxMs:Math.max(...c),elements:t.current.querySelectorAll("*").length};return await new Promise(requestAnimationFrame),bl.flushSync(()=>s.unmount()),await new Promise(requestAnimationFrame),p}},[]),v.jsx("div",{className:"demo-page",style:{maxWidth:900,margin:"auto"},ref:t})}function gz(){const t=kl(i=>({revision:i.revision,headings:i.headings.length}));return v.jsxs("output",{id:"snapshot-readout",children:[t.revision,":",t.headings]})}function yz(){const[t,i]=O.useState(`# Hydrated

A **stable** document with $x^2$.`);return v.jsxs("div",{className:"demo-page",children:[v.jsxs(Sl,{source:t,children:[v.jsx(Ju,{}),v.jsx(Kn,{}),v.jsx(gz,{})]}),v.jsx(Kn,{source:`# Another document

Separate ID.`}),v.jsx("button",{onClick:()=>i(r=>r+`

## Appended

New text.`),children:"Append"})]})}function bz(t,i,r){O.useEffect(()=>{if(!t||!i)return;const o=[0];for(let A=0;A<r.length;A++)r[A]===`
`&&o.push(A+1);const s=A=>{let k=0,T=o.length;for(;k<T;){const C=k+T>>>1;o[C]<=A?k=C+1:T=C}return Math.max(0,k-1)};let u=[],c=null,f=0,p=0;const m=()=>{const A=i.getBoundingClientRect().top,k=parseFloat(getComputedStyle(t).lineHeight),T={source:t.scrollHeight-t.clientHeight,rendered:i.scrollHeight-i.clientHeight};u=[{source:0,rendered:0}];for(const C of i.querySelectorAll(".limr-reader-content > .limr-prose > [data-limr-block]")){const D={source:s(Number(C.dataset.sourceStart))*k,rendered:C.getBoundingClientRect().top-A+i.scrollTop},z=u.at(-1);D.source>z.source&&D.rendered>z.rendered&&D.source<T.source&&D.rendered<T.rendered&&u.push(D)}u.push(T)},y=(A,k,T)=>{const C=u;let D=0,z=C.length;for(;D<z;){const I=D+z>>>1;C[I][k]<=A?D=I+1:z=I}const j=C[Math.max(0,D-1)],L=C[Math.min(C.length-1,D)];return j[T]+(L[T]-j[T])*Math.min(1,Math.max(0,(A-j[k])/Math.max(1,L[k]-j[k])))},g=A=>{A.target===c&&performance.now()<f||(cancelAnimationFrame(p),p=requestAnimationFrame(()=>{const k=A.target===t,T=k?i:t;c=T,f=performance.now()+100,T.scrollTop=y(k?t.scrollTop:i.scrollTop,k?"source":"rendered",k?"rendered":"source")}))},x=()=>{c=null,f=0},b=new ResizeObserver(m);b.observe(i),b.observe(t);const w=i.querySelector(".limr-prose");w&&b.observe(w);const E=new MutationObserver(m);return w&&E.observe(w,{childList:!0}),t.addEventListener("scroll",g,{passive:!0}),i.addEventListener("scroll",g,{passive:!0}),t.addEventListener("wheel",x,{passive:!0}),i.addEventListener("wheel",x,{passive:!0}),t.addEventListener("pointerdown",x),i.addEventListener("pointerdown",x),document.fonts.addEventListener("loadingdone",m),m(),()=>{cancelAnimationFrame(p),b.disconnect(),E.disconnect(),t.removeEventListener("scroll",g),i.removeEventListener("scroll",g),t.removeEventListener("wheel",x),i.removeEventListener("wheel",x),t.removeEventListener("pointerdown",x),i.removeEventListener("pointerdown",x),document.fonts.removeEventListener("loadingdone",m)}},[t,i,r])}const Bu=["# Selection and motion",'Left<ref id="between" /> right with `inline code` and $x^2$ end.<ref id="last" />',"```typescript\nconst total = 12;\nconst 你好 = total + 1;\n// next line: α Я é \n```",`$$
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

`),vz=[{id:"code-note",type:"citation",range:{start:Bu.indexOf("total ="),end:Bu.indexOf("total =")+5},data:{title:"Code annotation",description:"A card inserted into code."}}],xz=[Y0()];function wz(){const[t,i]=O.useState(vz),[r,o]=O.useState(null),[s,u]=O.useState(!1);return v.jsxs("div",{className:"demo-page",children:[v.jsx("div",{className:"demo-controls",children:v.jsx("button",{onClick:()=>u(!s),children:"Theme"})}),v.jsx(pn,{source:Bu,documentId:"visual",theme:s?"dark":"light",locale:Qn,annotations:t,onAnnotationsChange:i,actions:xz,onSelectionChange:o}),v.jsx("output",{id:"selection-data",hidden:!0,children:r?JSON.stringify(r):""}),v.jsx("output",{id:"source-data",hidden:!0,children:Bu})]})}const Th=v.jsx("svg",{width:"256",height:"256",style:{width:256,height:256},viewBox:"0 0 16 16",children:v.jsx("path",{d:"M8 1 15 8 8 15 1 8Z",fill:"currentColor"})}),x1=[{type:"large-svg",label:"Large SVG",icon:Th},{type:"nested-icon",label:"Nested icon",icon:v.jsx("div",{style:{width:200,height:200,fontSize:100},children:Th})},{type:"large-image",label:"Large image",icon:v.jsx("img",{width:"200",height:"200",alt:"",src:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>')})},{type:"custom-marker",label:"Custom marker",Marker:()=>v.jsx("div",{style:{width:160,height:160},children:Th})},{type:"text-icon",label:"Text icon",icon:"✦"}],Sz=`Reference<ref id="reference" /> **Bold plugin text**.

<citation id="reference" title="Reference" />`,kz=x1.map((t,i)=>({id:`plugin-${i}`,type:t.type,range:{start:32,end:38}}));function Az(){return v.jsx("div",{className:"demo-page",children:v.jsx(pn,{source:Sz,annotations:kz,annotationTypes:x1,toc:!1,sidebar:!1})})}const Tz=[{type:"detail",label:"Detail",icon:"✦",overlay:{expand:t=>({placement:t.data?.placement??"anchor",height:t.data?.height})},Content:({data:t,expanded:i})=>v.jsxs("div",{children:[v.jsx("p",{children:"Preview content"}),i&&v.jsxs(v.Fragment,{children:[v.jsx("p",{children:t?.text}),v.jsxs("label",{children:["Message ",v.jsx("input",{"aria-label":"Card draft",defaultValue:"Draft stays mounted"})]})]})]})},{type:"click-detail",label:"Click detail",sidebar:{collapseOnContentClick:!0},Content:()=>v.jsx("p",{children:"Click to collapse this module."})},{type:"custom-card",label:"Custom card",overlay:{previewWidth:286,expand:{placement:"center",width:512},Card:({expanded:t,expand:i,collapse:r,close:o,children:s})=>v.jsxs(v.Fragment,{children:[v.jsxs("header",{"data-testid":"module-card-header",style:{padding:16},children:[v.jsx("strong",{children:t?"Expanded by module":"Preview by module"}),v.jsx("button",{onClick:t?r:i,children:t?"Less detail":"More detail"})]}),v.jsx("section",{"data-limr-card-body":"",style:{padding:16},children:s}),v.jsx("footer",{children:v.jsx("button",{onClick:o,children:"Dismiss module"})})]})},Content:()=>v.jsxs("label",{children:["Module draft ",v.jsx("input",{"aria-label":"Module draft",defaultValue:"Keep my state"})]})}],Ez=[{id:"center",type:"detail",range:{start:0,end:6},data:{placement:"center",height:"80dvh",text:"A conversation with a large centered surface."}},{id:"anchor",type:"detail",range:{start:8,end:14},data:{placement:"anchor",text:"More detail. The card only grows to fit these extra lines, keeping its anchored edge fixed."}},{id:"click-detail",type:"click-detail",range:{start:16,end:21}},{id:"custom-card",type:"custom-card",range:{start:23,end:29}}];function Cz(){return v.jsx("div",{className:"demo-page",children:v.jsx(pn,{source:`Center. Anchor. Plain. Custom.

Reference<ref id="ref" />

<citation id="ref" title="A citation without expansion" description="Clickable sidebar content." url="https://example.com" />`,annotations:Ez,annotationTypes:Tz,locale:Qn,toc:!1})})}const Rz='<md-video provider="youtube" url="https://www.youtube.com/watch?v=M7lc1UVf-VE" title="YouTube video" />';function Mz(){const t=[Rz,...Array.from({length:40},(i,r)=>`Paragraph ${r}. Space before the next player.`),'<video url="https://www.bilibili.com/video/BV1xx411c7mD?p=2" />','<video url="https://youtu.be/M7lc1UVf-VE" loading="click" />'].join(`

`);return v.jsx("div",{className:"demo-page",children:v.jsx(pn,{source:t,toc:!1,sidebar:!1,locale:Qn})})}const Nz=[gm(),l0()];function Dz(){const t=new URLSearchParams(location.search),i=Math.min(5e3,Math.max(1,Number(t.get("sections")??1e3))),r=t.get("kind")==="code",o=O.useMemo(()=>r?`# Code selection

\`\`\`typescript
${Array.from({length:i},(u,c)=>`const value${c} = calculate(${c}, "Text 中文");`).join(`
`)}
\`\`\``:v1(i),[r,i]);window.selectionProbe??={updates:0,dragging:0,last:null};const s=u=>{window.selectionProbe.updates++,u&&!u.settled&&window.selectionProbe.dragging++,window.selectionProbe.last=u};return v.jsx("main",{style:{maxWidth:780,margin:"40px auto",padding:24},children:t.get("renderer")==="react-markdown"?v.jsx("article",{className:"limr-prose",children:v.jsx(y1,{remarkPlugins:[b1],children:o})}):v.jsx(Kn,{source:o,extensions:Nz,onSelectionChange:s,documentId:"selection-benchmark"})})}const qu="# Tools, close to the words\n\nAlpha **bravo** charlie, with &amp; entities and `literal code`.\n\nA second paragraph keeps the selection and the page independent.\n\n```ts\nconst value = 42;\n```",lw=qu.indexOf("bravo"),Oz=[{id:"lower",range:{start:qu.indexOf("Alpha"),end:qu.indexOf("charlie")+7},type:"highlight",data:{color:"#F2C744",style:"background"}},{id:"upper",range:{start:lw,end:lw+5},type:"highlight",data:{color:"#E57373",style:"wavy"}}];function jz(){const t=new URLSearchParams(location.search).has("controlled"),[i,r]=O.useState(t?Oz:[]),[o,s]=O.useState(""),[u,c]=O.useState(""),[f,p]=O.useState(0),m=O.useMemo(()=>[{name:"toolbar-example",actions:[{id:"custom",label:"Custom tool",icon:v.jsx("span",{style:{fontSize:300},children:v.jsx("svg",{style:{width:500,height:300},viewBox:"0 0 24 24",children:v.jsx("circle",{cx:"12",cy:"12",r:"7",fill:"currentColor"})})}),onHover:()=>p(y=>y+1),renderExpanded:y=>v.jsxs("div",{children:[v.jsxs("label",{children:["Panel input",v.jsx("input",{value:u,onChange:g=>c(g.target.value)})]}),v.jsx("button",{onClick:()=>{y.run(()=>{throw new Error("Panel action failed")})},children:"Fail action"}),v.jsx("button",{onClick:()=>{y.run(async g=>{await new Promise(x=>setTimeout(x,80)),c(g.selection.text)})},children:"Read selection"}),new URLSearchParams(location.search).has("tall")&&Array.from({length:30},(g,x)=>v.jsxs("p",{children:["Plugin paragraph ",x+1,": a longer explanation that fits the reading tools panel."]},x))]})}]}],[u]);return v.jsxs("div",{className:"demo-page",style:{minHeight:1800},children:[v.jsx(pn,{appearance:new URLSearchParams(location.search).has("skin")?"paper":void 0,source:qu,locale:Qn,plugins:m,annotations:t?i:void 0,onAnnotationsChange:r,onHighlightHover:y=>s(y?.id??"")}),v.jsx("output",{id:"highlight-data",hidden:!0,children:JSON.stringify(i)}),v.jsx("output",{id:"hovered-highlight",hidden:!0,children:o}),v.jsx("output",{id:"panel-value",hidden:!0,children:u}),v.jsx("output",{id:"hover-count",hidden:!0,children:f})]})}const w1="limr-playground-document",S1="limr-playground-locale";function Eh(){try{return localStorage.getItem(S1)==="en"?"en":"zh-CN"}catch{return"zh-CN"}}function sw(){try{const t=JSON.parse(localStorage.getItem(w1)??"null");if(!t||typeof t.source!="string"||!Array.isArray(t.annotations))return null;if(t.version===2)return t;if(t.version===1&&Array.isArray(t.highlights))return{source:t.source,annotations:[...t.annotations,...t.highlights.map(({id:i,range:r,...o})=>({id:i,range:r,type:"highlight",data:o}))]}}catch{}return null}function Lz(){const[t]=O.useState(sw),[i,r]=O.useState(t?.source??Z0),[o,s]=O.useState(!1),[u,c]=O.useState(0),[f,p]=O.useState(!1),[m,y]=O.useState(Eh),[g,x]=O.useState(()=>zx(Eh())),[b,w]=O.useState(!1),[E,A]=O.useState(),[k,T]=O.useState(!1),[C,D]=O.useState(null),[z,j]=O.useState(t?.annotations??[]),[L,I]=O.useState(null),[q,H]=O.useState(null),[Z,oe]=O.useState(!0),[ue,$]=O.useState(!0),[N,P]=O.useState(null),[K,J]=O.useState(""),[be,_]=O.useState(""),[He,Ee]=O.useState(0),[B,U]=O.useState("welcome"),ne=O.useRef(null),he=O.useRef(null),ee=O.useRef(null),pe=O.useRef(null),ge=O.useRef(null),ke=[{value:"zh-CN",label:"中文"},{value:"en",label:"English"}],le=[{value:void 0,label:"随段落"},{value:"origin",label:"原文"},{value:"translation",label:"译文"},{value:"both",label:"对照"}];bz(L,q,i);const se=O.useMemo(()=>{const ce=X0(),xe=m==="zh-CN",Ne=jm({label:xe?"询问助手":"Ask assistant",icon:v.jsx(Ct,{name:"sparkles"}),color:"#B39DDB",prompt:Be=>xe?`请解释「${Be.text}」。`:`Explain “${Be.text}”.`,adapter:{async*answer({selection:Be,signal:X}){_(xe?"回答中":"Answering…");try{for(const Le of xe?["关于 **",Be.text,`** 的思考。

`,"先试着用自己的话概括这段内容，",`再找一个生活中的例子与它联系起来。

`,"> 这是一段本地模拟回答，用于体验插件的流式交互。"]:["Thoughts on **",Be.text,`**.

`,"Try summarizing the passage in your own words, ",`then connect it to an everyday example.

`,"> This is a local simulated response demonstrating streaming plugin interaction."])await new Promise((ie,ye)=>{if(X.aborted){ye(X.reason);return}const Ae=()=>{clearTimeout(me),ye(X.reason)},me=setTimeout(()=>{X.removeEventListener("abort",Ae),ie()},160);X.addEventListener("abort",Ae,{once:!0})}),yield Le;_(xe?"回答已完成":"Answer complete")}catch(Le){throw _(X.aborted?"":xe?"回答失败":"Answer failed"),Le}}}});return[{...ce,actions:Z&&!o?ce.actions:[]},{...Ne,actions:ue&&!o?Ne.actions:[]}]},[Z,ue,o,m]);O.useEffect(()=>{if(!o)return;let ce=0;const xe=setInterval(()=>{ce=Math.min(i.length,ce+24),c(ce),ce===i.length&&(s(!1),J("流式演示完成，文本已保留"))},25);return()=>clearInterval(xe)},[o,i]),O.useEffect(()=>{const ce=()=>{const xe=zx(Eh());x(xe),xe&&(y(xe.language),s(!1)),P(null),D(null)};return ce(),window.addEventListener("hashchange",ce),()=>window.removeEventListener("hashchange",ce)},[]),O.useEffect(()=>{document.documentElement.dataset.theme=f?"dark":"light"},[f]),O.useEffect(()=>{try{localStorage.setItem(S1,m)}catch{}},[m]),O.useEffect(()=>{if(!N)return;const ce=N==="load"?he:N==="plugins"?ee:N==="locale"?ge:pe,xe=Be=>{Be.target instanceof Node&&!ce.current?.contains(Be.target)&&P(null)},Ne=Be=>{Be.key==="Escape"&&(P(null),ce.current?.querySelector("button")?.focus())};return document.addEventListener("pointerdown",xe),document.addEventListener("keydown",Ne),()=>{document.removeEventListener("pointerdown",xe),document.removeEventListener("keydown",Ne)}},[N]);const ve=(ce,xe="")=>{s(!1),c(0),r(ce),U(xe),j([]),D(null),_(""),Ee(Ne=>Ne+1),P(null)};O.useEffect(()=>{if(!(k||o))try{localStorage.setItem(w1,JSON.stringify({version:2,source:i,annotations:z}))}catch{J("自动保存失败，请下载 Markdown 保留文本")}},[i,z,k,o]);const Ce=()=>{const ce=sw();if(!ce){J("还没有可加载的文本");return}ve(ce.source),j(ce.annotations),J("已加载保存的文本与标记")},Me=()=>{const ce=URL.createObjectURL(new Blob([i],{type:"text/markdown;charset=utf-8"})),xe=document.createElement("a");xe.href=ce,xe.download="limr-notes.md",xe.click(),setTimeout(()=>URL.revokeObjectURL(ce),1e3),J("已下载 Markdown"),P(null)};return v.jsxs(v.Fragment,{children:[v.jsxs("header",{className:"demo-header","data-limr-appearance":"classic",children:[v.jsxs("a",{className:"demo-brand",href:"/LiMR/",children:["LiMR ",v.jsx("span",{children:"Linloir’s limr Is a Markdown Renderer"})]}),v.jsxs("div",{className:"demo-header-end",children:[v.jsxs("nav",{className:"demo-controls demo-mode-nav","aria-label":"页面 / Pages",children:[v.jsx("a",{href:"#/playground","aria-current":g?void 0:"page",children:v.jsx("span",{className:"limr-underline",children:"Playground"})}),v.jsx("a",{href:no(m,g?.page),"aria-current":g?"page":void 0,children:v.jsx("span",{className:"limr-underline",children:"Docs"})}),v.jsx("a",{href:"https://github.com/Linloir/LiMR",target:"_blank",rel:"noopener noreferrer",children:v.jsx("span",{className:"limr-underline",children:"GitHub"})})]}),v.jsxs("div",{className:"demo-controls demo-header-settings",children:["        ",v.jsxs("div",{className:"demo-dropdown",ref:ge,children:[v.jsxs("button",{"aria-label":"界面语言 / Reader language",title:"切换阅读器内置文案 / Reader UI language","aria-expanded":N==="locale","aria-controls":"demo-locale-menu",onClick:()=>P(ce=>ce==="locale"?null:"locale"),children:[v.jsx("span",{className:"limr-underline",children:ke.find(ce=>ce.value===m).label}),v.jsx(Ct,{name:"chevron"})]}),v.jsx(cu,{open:N==="locale",id:"demo-locale-menu",role:"group","aria-label":"界面语言 / Reader language",children:ke.map(ce=>v.jsx("button",{lang:ce.value,"aria-pressed":m===ce.value,onClick:()=>{y(ce.value),g&&(location.hash=no(ce.value,g.page)),P(null),ge.current?.querySelector("button")?.focus()},children:v.jsx("span",{className:"limr-underline",children:ce.label})},ce.value))})]}),v.jsxs("button",{className:"demo-theme",onClick:()=>p(!f),"aria-label":f?"浅色":"深色",title:f?"切换到浅色":"切换到深色",children:[v.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:f?v.jsxs(v.Fragment,{children:[v.jsx("circle",{cx:"12",cy:"12",r:"4"}),v.jsx("path",{d:"M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"})]}):v.jsx("path",{d:"M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"})}),v.jsx("span",{className:"limr-underline",children:f?"浅色":"深色"})]})]})]})]}),g?v.jsx(OO,{route:g,theme:f?"dark":"light"}):v.jsxs(v.Fragment,{children:[v.jsxs("div",{className:"demo-commandbar","data-limr-appearance":"classic",children:[v.jsxs("nav",{className:"demo-controls demo-document-controls","aria-label":"文本操作",children:[v.jsx("button",{onClick:()=>{s(!1),T(!k),P(null),k&&J("已自动保存到此浏览器")},children:v.jsx("span",{className:"limr-underline",children:k?"保存":"编辑"})}),v.jsx("span",{className:"demo-control-divider"}),v.jsxs("div",{className:"demo-dropdown",ref:he,children:[v.jsxs("button",{"aria-expanded":N==="load","aria-controls":"demo-load-menu",onClick:()=>P(ce=>ce==="load"?null:"load"),children:[v.jsx("span",{className:"limr-underline",children:"加载"}),v.jsx(Ct,{name:"chevron"})]}),v.jsxs(cu,{open:N==="load",id:"demo-load-menu",className:"demo-load-menu",children:[v.jsxs("div",{role:"group","aria-label":"文本文件",children:[v.jsxs("button",{onClick:Ce,children:[v.jsx("span",{className:"limr-underline",children:"加载已保存文本"}),v.jsx("small",{children:"此浏览器中的文本与标记"})]}),v.jsxs("button",{onClick:()=>{ne.current?.click(),P(null)},children:[v.jsx("span",{className:"limr-underline",children:"打开 Markdown 文件"}),v.jsx("small",{children:"从本地 .md 或 .txt 文件载入"})]}),v.jsxs("button",{onClick:Me,children:[v.jsx("span",{className:"limr-underline",children:"下载 Markdown"}),v.jsx("small",{children:"导出当前的完整文本"})]})]}),v.jsxs("div",{role:"group","aria-label":"预设文本",className:"demo-dropdown-section",children:[v.jsx("p",{className:"demo-small-label",children:"预设文本"}),XO.map(ce=>v.jsxs("button",{"aria-pressed":B===ce.id,onClick:()=>{ve(ce.source,ce.id),J(`已加载「${ce.label}」`)},children:[v.jsx("span",{className:"limr-underline",children:ce.label}),v.jsx("small",{children:ce.description})]},ce.id))]})]})]}),v.jsxs("div",{className:"demo-dropdown",ref:ee,children:[v.jsxs("button",{"aria-expanded":N==="plugins","aria-controls":"demo-plugin-menu",onClick:()=>P(ce=>ce==="plugins"?null:"plugins"),children:[v.jsx("span",{className:"limr-underline",children:"插件"}),v.jsx(Ct,{name:"chevron"})]}),v.jsxs(cu,{open:N==="plugins",id:"demo-plugin-menu",role:"group","aria-label":"插件",children:[v.jsxs("label",{className:"demo-plugin-option",children:[v.jsx("input",{type:"checkbox",checked:Z,onChange:ce=>oe(ce.target.checked),"aria-label":"启用旁注与笔记"}),v.jsxs("span",{children:[v.jsx("strong",{className:"limr-underline",children:"旁注与笔记"}),v.jsx("small",{children:"旁注、笔记、提问与脚注"})]})]}),v.jsxs("label",{className:"demo-plugin-option",children:[v.jsx("input",{type:"checkbox",checked:ue,onChange:ce=>$(ce.target.checked),"aria-label":"启用 AI 问答"}),v.jsxs("span",{children:[v.jsx("strong",{className:"limr-underline",children:"AI 问答"}),v.jsx("small",{children:"本地模拟回答，无需配置服务"})]})]})]})]}),v.jsx("input",{hidden:!0,ref:ne,type:"file",accept:".md,.markdown,.txt,text/plain,text/markdown","aria-label":"打开 Markdown 文件",onChange:async ce=>{const xe=ce.currentTarget.files?.[0];if(ce.currentTarget.value="",!!xe)try{ve(await xe.text()),J(`已加载 ${xe.name}`)}catch{J("文件读取失败")}}})]}),v.jsxs("div",{className:"demo-controls demo-session-controls",children:[v.jsxs("div",{className:"demo-dropdown demo-translation-control",ref:pe,children:[v.jsxs("button",{"aria-label":"全局翻译展示模式","aria-expanded":N==="translation","aria-controls":"demo-translation-menu",onClick:()=>P(ce=>ce==="translation"?null:"translation"),children:[v.jsx("span",{className:"limr-underline",children:le.find(ce=>ce.value===E).label}),v.jsx(Ct,{name:"chevron"})]}),v.jsx(cu,{open:N==="translation",id:"demo-translation-menu",role:"group","aria-label":"全局翻译展示模式",children:le.map(ce=>v.jsx("button",{"aria-pressed":E===ce.value,onClick:()=>{A(ce.value),P(null),pe.current?.querySelector("button")?.focus()},children:v.jsx("span",{className:"limr-underline",children:ce.label})},ce.value??"local"))})]}),v.jsx("button",{"aria-pressed":b,onClick:()=>w(ce=>!ce),title:b?"切换为左对齐":"两端对齐，末行保持左对齐",children:v.jsx("span",{className:"limr-underline",children:"两端对齐"})}),v.jsx("button",{className:"demo-stream-button",disabled:!i.length,"aria-pressed":o,onClick:()=>{o?(s(!1),J("已结束演示，完整文本已恢复")):(c(0),s(!0),T(!1),J(""),D(null),Ee(ce=>ce+1))},children:v.jsx("span",{className:"limr-underline",children:o?"结束演示":"流式演示"})})]})]}),v.jsxs("div",{className:"demo-context-line",children:[v.jsx("span",{children:k?"在左侧写作，在右侧看见变化。":o?"正在播放当前文本，随时可以结束。":"选中文字，给想法一点颜色。悬浮色块调整样式，点击工具留下批注。"}),v.jsx("output",{"aria-live":"polite",children:K||be||`${i.length.toLocaleString()} 字符 · ${z.filter(ce=>ce.type==="highlight").length} 处高亮 · ${z.filter(ce=>ce.type!=="highlight").length} 条注释`})]}),o&&v.jsx("div",{className:"demo-stream-progress",role:"progressbar","aria-label":"流式演示进度","aria-valuemin":0,"aria-valuemax":i.length,"aria-valuenow":u,children:v.jsx("span",{style:{width:`${u/Math.max(1,i.length)*100}%`}})}),v.jsxs("div",{className:k?"demo-workbench":"demo-reading",children:[k&&v.jsxs("section",{className:"demo-editor-pane",children:[v.jsxs("div",{className:"demo-pane-label",children:["Markdown ",v.jsx("span",{children:"直接编辑 · 双向滚动同步"})]}),v.jsx("textarea",{ref:I,wrap:"off",spellCheck:!1,className:"demo-editor","aria-label":"Markdown source",value:i,onChange:ce=>{s(!1),r(ce.target.value),U(""),j([]),J("")}})]}),v.jsxs("section",{className:k?"demo-preview-pane":void 0,children:[k&&v.jsxs("div",{className:"demo-pane-label",children:["实时预览 ",v.jsx("span",{children:"选区工具同样可用"})]}),v.jsx("div",{ref:k?H:void 0,className:k?"demo-preview-scroll":void 0,children:v.jsx("div",{className:"demo-page",children:v.jsx(pn,{source:o?i.slice(0,u):i,streaming:o,theme:f?"dark":"light",justify:b,parameters:{translationMode:E,onTranslationModeChange:A},locale:m==="zh-CN"?Qn:wu,scrollRoot:k?q:null,toc:!k,sidebar:!k,actions:o?[]:void 0,plugins:se,annotations:z,onAnnotationsChange:j,onSelectionChange:D,documentId:"demo"},He)})})]})]}),v.jsx("output",{id:"selection-data",hidden:!0,children:C?JSON.stringify(C):""})]}),v.jsx("footer",{className:"demo-footer",children:"LiMR · A quiet place for words."})]})}const Zt=new URLSearchParams(location.search).get("fixture");Zt==="hydrate"?Ch.hydrateRoot(document.getElementById("root"),v.jsx(yz,{}),{onRecoverableError:t=>{document.documentElement.dataset.hydrationError=String(t)}}):Ch.createRoot(document.getElementById("root")).render(Zt==="media-annotations"?v.jsx(BO,{}):Zt==="translation-details"?v.jsx(IO,{}):Zt==="media"?v.jsx(_O,{}):Zt==="toolbar"?v.jsx(jz,{}):Zt==="assistant-test"?v.jsx(QO,{}):Zt==="sidebar"?v.jsx(tj,{}):Zt==="selection-bench"?v.jsx(Dz,{}):Zt==="video"?v.jsx(Mz,{}):Zt==="overlay"?v.jsx(Cz,{}):Zt==="markers"?v.jsx(Az,{}):Zt==="visual"?v.jsx(wz,{}):Zt==="scroll"?v.jsx(nj,{}):Zt==="multiple"?v.jsx(ij,{}):Zt==="bench"?v.jsx(pz,{}):Zt==="resource"?v.jsx(sj,{}):v.jsx(Lz,{}));export{HC as L,r0 as _,uj as a,Sj as b,GE as c,Uv as d,bj as f,wj as h,v as j,zm as s,dj as w};
