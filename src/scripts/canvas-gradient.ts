// CANVAS GRADIENT ORBS / LAVA LAMP
//
// `canvasGradient(canvas, options)` attaches an animated shader gradient to a
// canvas and returns an instance handle: `{ tween, destroy }`. Call `destroy()`
// to release every resource it owns (listeners, rAF loop, observers, WebGL
// program). Ported from experiments/src/canvas-gradient-orbs; colors are hex,
// so GradientOrbs.astro resolves the theme tokens to hex before passing them.

// Types ------------------------------------------------------------------

export interface GradientPalette {
  bg: string;
  colors: string[];
}

export interface CanvasGradientOptions {
  bg?: string;
  colors?: string[];
  resolution?: number;
  // Multiplier on how fast the orbs drift (1 = default).
  speed?: number;
  // When true, render hard-edged discs at each orb position (no Gaussian
  // blend) so you can see the underlying motion. For debugging only.
  debug?: boolean;
}

export interface CanvasGradientInstance {
  // Tween bg + colors to a new palette over `duration` ms (OKLAB-interpolated).
  tween(palette: GradientPalette, duration?: number): void;
  // Release all resources. Safe to call more than once.
  destroy(): void;
}

// Consts -----------------------------------------------------------------

const MAX_ORBITS = 8;
const DEFAULT_BG = "#0a0a1a";
const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899"];

type Lab = [number, number, number];

// Color conversions ------------------------------------------------------

function hexToLinear(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToOklab(r: number, g: number, b: number): Lab {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToLinear(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function hexToOklab(hex: string): Lab {
  const [r, g, b] = hexToLinear(hex);
  return linearToOklab(r, g, b);
}

function oklabToLinearClamped(L: number, a: number, b: number): [number, number, number] {
  const [r, g, bl] = oklabToLinear(L, a, b);
  return [Math.max(0, r), Math.max(0, g), Math.max(0, bl)];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

// Orbit data -------------------------------------------------------------

interface Orbit {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  speed: number;
  phase: number;
  // Drawn-size multiplier on the global uSigma (1 = default size).
  scale: number;
}

function makeOrbits(count: number): Orbit[] {
  return Array.from({ length: count }, (_, i) => ({
    cx: Math.random(),
    cy: Math.random(),
    // First orbit sweeps a wide path; the rest drift within a small–medium
    // radius. (This is orbit radius, i.e. how far the blob wanders — not its
    // drawn size, which is uSigma * scale below.)
    rx: i === 0 ? 0.4 + Math.random() * 0.2 : 0.08 + Math.random() * 0.28,
    ry: i === 0 ? 0.4 + Math.random() * 0.2 : 0.08 + Math.random() * 0.28,
    speed: (0.04 + Math.random() * 0.12) * (Math.random() < 0.5 ? 1 : -1),
    phase: Math.random() * Math.PI * 2,
    // First blob renders noticeably larger; the rest vary subtly around 1.
    scale: i === 0 ? 1.5 : 0.8 + Math.random() * 0.5,
  }));
}

// WebGL helpers ----------------------------------------------------------

function compileShader(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "Shader compile error");
  }
  return s;
}

function linkProgram(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? "Program link error");
  }
  return p;
}

// Shaders ----------------------------------------------------------------

const VS2 = /* glsl */ `#version 300 es
void main() {
  vec2 pos[3];
  pos[0] = vec2(-1.0, -1.0);
  pos[1] = vec2( 3.0, -1.0);
  pos[2] = vec2(-1.0,  3.0);
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const FS2 = /* glsl */ `#version 300 es
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
}`;

// Debug fragment shader (WebGL2): hard-edged discs at each orb position,
// no Gaussian blend — reveals the raw motion the CPU feeds into uPositions.
const DEBUG_FS2 = /* glsl */ `#version 300 es
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
}`;

// WebGL1 fallback shaders (uses a full-screen quad via attribute buffer)
const VS1 = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FS1 = /* glsl */ `
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
}`;

// Debug fragment shader (WebGL1): hard-edged discs, no Gaussian blend.
const DEBUG_FS1 = /* glsl */ `
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
}`;

// Engine -----------------------------------------------------------------

export function canvasGradient(
  canvas: HTMLCanvasElement,
  options: CanvasGradientOptions = {}
): CanvasGradientInstance {
  const bg = options.bg ?? DEFAULT_BG;
  const colors = options.colors ?? DEFAULT_COLORS;
  const resolution = options.resolution ?? 0.5;
  const speed = options.speed ?? 1;
  const debug = options.debug ?? false;

  const ac = new AbortController();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Try WebGL2 first, fall back to WebGL1
  const gl2 = canvas.getContext("webgl2");
  const gl1 = gl2 ? null : canvas.getContext("webgl");
  const gl = (gl2 ?? gl1) as WebGL2RenderingContext | WebGLRenderingContext;

  if (!gl) return { tween() {}, destroy() {} };

  const isGL2 = !!gl2;

  // Compile + link
  const vs = compileShader(gl, gl.VERTEX_SHADER, isGL2 ? VS2 : VS1);
  const fsSrc = isGL2
    ? debug ? DEBUG_FS2 : FS2
    : debug ? DEBUG_FS1 : FS1;
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const program = linkProgram(gl, vs, fs);
  gl.useProgram(program);

  // WebGL1: full-screen quad vertex buffer
  let quadBuffer: WebGLBuffer | null = null;
  if (!isGL2) {
    quadBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  // Uniform locations
  const uCount = gl.getUniformLocation(program, "uCount");
  const uPositions = gl.getUniformLocation(program, "uPositions");
  const uColors = gl.getUniformLocation(program, "uColors");
  const uBgColor = gl.getUniformLocation(program, "uBgColor");
  const uSigma = gl.getUniformLocation(program, "uSigma");
  const uScale = gl.getUniformLocation(program, "uScale");

  const orbitCount = Math.min(colors.length, MAX_ORBITS);
  const orbits = makeOrbits(orbitCount);

  // Per-blob size multipliers. Constant for the life of the instance, so we
  // build the buffer once and upload it a single time below.
  const scaleData = new Float32Array(MAX_ORBITS).fill(1);
  for (let i = 0; i < orbitCount; i++) scaleData[i] = orbits[i].scale;
  gl.uniform1fv(uScale, scaleData); // program is already bound; value persists

  // Live color state. `current*` (linear RGB) is what the shader reads;
  // `current*Lab` (OKLAB) is the tween start point.
  const currentColors = new Float32Array(MAX_ORBITS * 3);
  const currentBgColor = new Float32Array(3);
  let currentLabColors: Lab[] = colors.slice(0, orbitCount).map(hexToOklab);
  let currentBgLab: Lab = hexToOklab(bg);

  // Persistent per-frame buffer (avoids allocating every render).
  const posData = new Float32Array(MAX_ORBITS * 2);

  setLinearFromLab();

  // Active tween, or null. Folded into the render loop so it pauses with it.
  let tween: {
    startColors: Lab[];
    targetColors: Lab[];
    startBg: Lab;
    targetBg: Lab;
    count: number;
    startTime: number;
    duration: number;
  } | null = null;

  // Sigma + run gate
  let sigmaPx = 0;
  let rafId: number | null = null;
  let isVisible = !document.hidden;
  let isIntersecting = true;

  // Sync linear-RGB shader state from the OKLAB state.
  function setLinearFromLab() {
    const [br, bgc, bb] = oklabToLinearClamped(...currentBgLab);
    currentBgColor[0] = br;
    currentBgColor[1] = bgc;
    currentBgColor[2] = bb;
    for (let i = 0; i < orbitCount; i++) {
      const [r, g, b] = oklabToLinearClamped(...currentLabColors[i]);
      currentColors[i * 3] = r;
      currentColors[i * 3 + 1] = g;
      currentColors[i * 3 + 2] = b;
    }
  }

  // Resize ---------------------------------------------------------------

  function resize() {
    const scale = resolution * (devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    sigmaPx = 0.35 * Math.min(canvas.width, canvas.height);
    if (!isRunning()) render(performance.now()); // keep static frame correct
  }

  // ResizeObserver tracks the canvas itself (handles flex/layout resizes the
  // window 'resize' event would miss), throttled to one redraw per frame.
  let resizePending = false;
  const ro = new ResizeObserver(() => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      resize();
    });
  });
  ro.observe(canvas);
  resize();

  // Render ---------------------------------------------------------------

  function applyTween(now: number) {
    if (!tween) return;
    const raw = (now - tween.startTime) / tween.duration;
    const done = raw >= 1;
    const p = easeInOutCubic(Math.min(raw, 1));

    currentBgLab = [
      lerp(tween.startBg[0], tween.targetBg[0], p),
      lerp(tween.startBg[1], tween.targetBg[1], p),
      lerp(tween.startBg[2], tween.targetBg[2], p),
    ];
    for (let i = 0; i < tween.count; i++) {
      const s = tween.startColors[i];
      const t = tween.targetColors[i];
      currentLabColors[i] = [
        lerp(s[0], t[0], p),
        lerp(s[1], t[1], p),
        lerp(s[2], t[2], p),
      ];
    }
    setLinearFromLab();
    if (done) tween = null;
  }

  function render(timestamp: number) {
    applyTween(timestamp);

    const t = (timestamp / 1000) * speed;
    for (let i = 0; i < orbitCount; i++) {
      const c = orbits[i];
      posData[i * 2] = (c.cx + c.rx * Math.cos(t * c.speed + c.phase)) * canvas.width;
      posData[i * 2 + 1] = (c.cy + c.ry * Math.sin(t * c.speed + c.phase)) * canvas.height;
    }

    gl.uniform1i(uCount, orbitCount);
    gl.uniform2fv(uPositions, posData);
    gl.uniform3fv(uColors, currentColors);
    gl.uniform3fv(uBgColor, currentBgColor);
    gl.uniform1f(uSigma, sigmaPx);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Keep looping while motion is allowed and the canvas is visible/onscreen.
    // (Reduced motion snaps tweens instantly, so it never re-enters here.)
    if (isRunning()) rafId = requestAnimationFrame(render);
    else rafId = null;
  }

  // Run gate -------------------------------------------------------------

  function isRunning(): boolean {
    return !prefersReducedMotion && isVisible && isIntersecting;
  }

  function syncLoop() {
    if (isRunning()) {
      if (rafId === null) rafId = requestAnimationFrame(render);
    } else if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  document.addEventListener(
    "visibilitychange",
    () => {
      isVisible = !document.hidden;
      syncLoop();
    },
    { signal: ac.signal }
  );

  const io = new IntersectionObserver(([entry]) => {
    isIntersecting = entry.isIntersecting;
    syncLoop();
  });
  io.observe(canvas);

  // Initial frame
  if (prefersReducedMotion) render(performance.now());
  else syncLoop();

  // Public API -----------------------------------------------------------

  function tweenTo(palette: GradientPalette, duration = 1500) {
    const targetColors = palette.colors.slice(0, MAX_ORBITS).map(hexToOklab);
    const targetBg = hexToOklab(palette.bg);
    const count = Math.min(currentLabColors.length, targetColors.length);

    // Reduced motion: snap + single redraw, no animation.
    if (prefersReducedMotion) {
      currentBgLab = [...targetBg];
      for (let i = 0; i < count; i++) currentLabColors[i] = [...targetColors[i]];
      setLinearFromLab();
      render(performance.now());
      return;
    }

    tween = {
      startColors: currentLabColors.map((c) => [...c] as Lab),
      targetColors,
      startBg: [...currentBgLab],
      targetBg,
      count,
      startTime: performance.now(),
      duration,
    };
    syncLoop(); // ensure the loop is alive to drive the tween
  }

  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    ac.abort();
    if (rafId !== null) cancelAnimationFrame(rafId);
    io.disconnect();
    ro.disconnect();
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (quadBuffer) gl.deleteBuffer(quadBuffer);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return { tween: tweenTo, destroy };
}
