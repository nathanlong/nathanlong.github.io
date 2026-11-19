var e=[`#3b82f6`,`#8b5cf6`,`#06b6d4`,`#ec4899`];function t(e){let t=e.replace(`#`,``),r=parseInt(t.slice(0,2),16)/255,i=parseInt(t.slice(2,4),16)/255,a=parseInt(t.slice(4,6),16)/255;return[n(r),n(i),n(a)]}function n(e){return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}function r(e,t,n){let r=.4122214708*e+.5363325363*t+.0514459929*n,i=.2119034982*e+.6806995451*t+.1073969566*n,a=.0883024619*e+.2817188376*t+.6299787005*n,o=Math.cbrt(r),s=Math.cbrt(i),c=Math.cbrt(a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]}function i(e,t,n){let r=e+.3963377774*t+.2158037573*n,i=e-.1055613458*t-.0638541728*n,a=e-.0894841775*t-1.291485548*n,o=r*r*r,s=i*i*i,c=a*a*a;return[4.0767416621*o-3.3077115913*s+.2309699292*c,-1.2684380046*o+2.6097574011*s-.3413193965*c,-.0041960863*o-.7034186147*s+1.707614701*c]}function a(e){let[n,i,a]=t(e);return r(n,i,a)}function o(e,t,n){let[r,a,o]=i(e,t,n);return[Math.max(0,r),Math.max(0,a),Math.max(0,o)]}function s(e,t,n){return e+(t-e)*n}function c(e){return e<.5?4*e**3:1-(-2*e+2)**3/2}function l(e){return Array.from({length:e},(e,t)=>({cx:Math.random(),cy:Math.random(),rx:t===0?.4+Math.random()*.2:.08+Math.random()*.28,ry:t===0?.4+Math.random()*.2:.08+Math.random()*.28,speed:(.04+Math.random()*.12)*(Math.random()<.5?1:-1),phase:Math.random()*Math.PI*2,scale:t===0?1.5:.8+Math.random()*.5}))}function u(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`Shader compile error`);return r}function d(e,t,n){let r=e.createProgram();if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)??`Program link error`);return r}var ee=`#version 300 es
void main() {
  vec2 pos[3];
  pos[0] = vec2(-1.0, -1.0);
  pos[1] = vec2( 3.0, -1.0);
  pos[2] = vec2(-1.0,  3.0);
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`,te=`#version 300 es
precision mediump float;
#define MAX_ORBITS 8

uniform int   uCount;
uniform vec2  uPositions[MAX_ORBITS];
uniform vec3  uColors[MAX_ORBITS];
uniform vec3  uBgColor;
uniform float uSigma;
uniform float uScale[MAX_ORBITS];

out vec4 fragColor;

float linearToSrgbChannel(float v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}

vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgbChannel(c.r), linearToSrgbChannel(c.g), linearToSrgbChannel(c.b));
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float totalWeight = 0.0;
  vec3  blended = vec3(0.0);

  for (int i = 0; i < MAX_ORBITS; i++) {
    if (i >= uCount) break;
    vec2 d = fragCoord - uPositions[i];
    float s = uSigma * uScale[i];
    float w = exp(-dot(d, d) / (2.0 * s * s));
    blended     += w * uColors[i];
    totalWeight += w;
  }

  vec3 color = (blended + uBgColor) / (totalWeight + 1.0);
  fragColor = vec4(linearToSrgb(color), 1.0);
}`,ne=`#version 300 es
precision mediump float;
#define MAX_ORBITS 8

uniform int   uCount;
uniform vec2  uPositions[MAX_ORBITS];
uniform vec3  uColors[MAX_ORBITS];
uniform vec3  uBgColor;
uniform float uSigma;
uniform float uScale[MAX_ORBITS];

out vec4 fragColor;

float linearToSrgbChannel(float v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}

vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgbChannel(c.r), linearToSrgbChannel(c.g), linearToSrgbChannel(c.b));
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec3 color = uBgColor;

  for (int i = 0; i < MAX_ORBITS; i++) {
    if (i >= uCount) break;
    float r = uSigma * uScale[i];
    float dist = length(fragCoord - uPositions[i]);
    if (dist < r) color = uColors[i];
  }

  fragColor = vec4(linearToSrgb(color), 1.0);
}`,re=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,f=`
precision mediump float;
#define MAX_ORBITS 8

uniform int   uCount;
uniform vec2  uPositions[MAX_ORBITS];
uniform vec3  uColors[MAX_ORBITS];
uniform vec3  uBgColor;
uniform float uSigma;
uniform float uScale[MAX_ORBITS];

float linearToSrgbChannel(float v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}

vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgbChannel(c.r), linearToSrgbChannel(c.g), linearToSrgbChannel(c.b));
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float totalWeight = 0.0;
  vec3  blended = vec3(0.0);

  for (int i = 0; i < MAX_ORBITS; i++) {
    if (i >= uCount) break;
    vec2 d = fragCoord - uPositions[i];
    float s = uSigma * uScale[i];
    float w = exp(-dot(d, d) / (2.0 * s * s));
    blended     += w * uColors[i];
    totalWeight += w;
  }

  vec3 color = (blended + uBgColor) / (totalWeight + 1.0);
  gl_FragColor = vec4(linearToSrgb(color), 1.0);
}`,p=`
precision mediump float;
#define MAX_ORBITS 8

uniform int   uCount;
uniform vec2  uPositions[MAX_ORBITS];
uniform vec3  uColors[MAX_ORBITS];
uniform vec3  uBgColor;
uniform float uSigma;
uniform float uScale[MAX_ORBITS];

float linearToSrgbChannel(float v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}

vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgbChannel(c.r), linearToSrgbChannel(c.g), linearToSrgbChannel(c.b));
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec3 color = uBgColor;

  for (int i = 0; i < MAX_ORBITS; i++) {
    if (i >= uCount) break;
    float r = uSigma * uScale[i];
    float dist = length(fragCoord - uPositions[i]);
    if (dist < r) color = uColors[i];
  }

  gl_FragColor = vec4(linearToSrgb(color), 1.0);
}`;function m(t,n={}){let r=n.bg??`#0a0a1a`,i=n.colors??e,m=n.resolution??.5,h=n.speed??1,g=n.debug??!1,_=new AbortController,v=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,y=t.getContext(`webgl2`),ie=y?null:t.getContext(`webgl`),b=y??ie;if(!b)return{tween(){},destroy(){}};let x=!!y,S=u(b,b.VERTEX_SHADER,x?ee:re),ae=x?g?ne:te:g?p:f,C=u(b,b.FRAGMENT_SHADER,ae),w=d(b,S,C);b.useProgram(w);let T=null;if(!x){T=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,T),b.bufferData(b.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),b.STATIC_DRAW);let e=b.getAttribLocation(w,`aPos`);b.enableVertexAttribArray(e),b.vertexAttribPointer(e,2,b.FLOAT,!1,0,0)}let E=b.getUniformLocation(w,`uCount`),D=b.getUniformLocation(w,`uPositions`),O=b.getUniformLocation(w,`uColors`),k=b.getUniformLocation(w,`uBgColor`),A=b.getUniformLocation(w,`uSigma`),j=b.getUniformLocation(w,`uScale`),M=Math.min(i.length,8),N=l(M),P=new Float32Array(8).fill(1);for(let e=0;e<M;e++)P[e]=N[e].scale;b.uniform1fv(j,P);let F=new Float32Array(24),I=new Float32Array(3),L=i.slice(0,M).map(a),R=a(r),z=new Float32Array(16);G();let B=null,V=0,H=null,U=!document.hidden,W=!0;function G(){let[e,t,n]=o(...R);I[0]=e,I[1]=t,I[2]=n;for(let e=0;e<M;e++){let[t,n,r]=o(...L[e]);F[e*3]=t,F[e*3+1]=n,F[e*3+2]=r}}function K(){let e=m*(devicePixelRatio||1),n=t.getBoundingClientRect();t.width=Math.max(1,Math.round(n.width*e)),t.height=Math.max(1,Math.round(n.height*e)),b.viewport(0,0,t.width,t.height),V=.35*Math.min(t.width,t.height),X()||Y(performance.now())}let q=!1,J=new ResizeObserver(()=>{q||(q=!0,requestAnimationFrame(()=>{q=!1,K()}))});J.observe(t),K();function oe(e){if(!B)return;let t=(e-B.startTime)/B.duration,n=t>=1,r=c(Math.min(t,1));R=[s(B.startBg[0],B.targetBg[0],r),s(B.startBg[1],B.targetBg[1],r),s(B.startBg[2],B.targetBg[2],r)];for(let e=0;e<B.count;e++){let t=B.startColors[e],n=B.targetColors[e];L[e]=[s(t[0],n[0],r),s(t[1],n[1],r),s(t[2],n[2],r)]}G(),n&&(B=null)}function Y(e){oe(e);let n=e/1e3*h;for(let e=0;e<M;e++){let r=N[e];z[e*2]=(r.cx+r.rx*Math.cos(n*r.speed+r.phase))*t.width,z[e*2+1]=(r.cy+r.ry*Math.sin(n*r.speed+r.phase))*t.height}b.uniform1i(E,M),b.uniform2fv(D,z),b.uniform3fv(O,F),b.uniform3fv(k,I),b.uniform1f(A,V),b.drawArrays(b.TRIANGLES,0,3),H=X()?requestAnimationFrame(Y):null}function X(){return!v&&U&&W}function Z(){X()?H===null&&(H=requestAnimationFrame(Y)):H!==null&&(cancelAnimationFrame(H),H=null)}document.addEventListener(`visibilitychange`,()=>{U=!document.hidden,Z()},{signal:_.signal});let Q=new IntersectionObserver(([e])=>{W=e.isIntersecting,Z()});Q.observe(t),v?Y(performance.now()):Z();function se(e,t=1500){let n=e.colors.slice(0,8).map(a),r=a(e.bg),i=Math.min(L.length,n.length);if(v){R=[...r];for(let e=0;e<i;e++)L[e]=[...n[e]];G(),Y(performance.now());return}B={startColors:L.map(e=>[...e]),targetColors:n,startBg:[...R],targetBg:r,count:i,startTime:performance.now(),duration:t},Z()}let $=!1;function ce(){$||($=!0,_.abort(),H!==null&&cancelAnimationFrame(H),Q.disconnect(),J.disconnect(),b.deleteProgram(w),b.deleteShader(S),b.deleteShader(C),T&&b.deleteBuffer(T),b.getExtension(`WEBGL_lose_context`)?.loseContext())}return{tween:se,destroy:ce}}var h=8,g=document.querySelector(`.gradient-orbs`),_=g?.querySelector(`canvas`);if(g&&_){let e=document.createElement(`span`);e.hidden=!0,g.append(e);let t=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0});t.canvas.width=t.canvas.height=1;let n=n=>{e.style.color=`var(${n})`,t.clearRect(0,0,1,1),t.fillStyle=getComputedStyle(e).color,t.fillRect(0,0,1,1);let[r,i,a]=t.getImageData(0,0,1,1).data;return`#`+[r,i,a].map(e=>e.toString(16).padStart(2,`0`)).join(``)},r=()=>{let e=getComputedStyle(g),t=[];for(let r=1;r<=h&&e.getPropertyValue(`--orb-${r}`).trim();r++)t.push(n(`--orb-${r}`));return{bg:n(`--orb-bg`),colors:t}},i=m(_,{...r(),speed:3}),a=!1,o=()=>{a||(a=!0,requestAnimationFrame(()=>{a=!1,i.tween(r(),1200)}))};new MutationObserver(o).observe(document.documentElement,{attributes:!0,attributeFilter:[`data-daypart`,`data-scheme`]}),matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,o)}