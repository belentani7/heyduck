/**
 * hero-gl.js — Fondo generativo de heyduck (WebGL1 puro, sin librerías).
 *
 * Qué hace: dibuja un campo FBM (Fractal Brownian Motion) con deformación de
 * dominio y anillos de interferencia que reaccionan, de forma sutil, al nivel
 * de audio publicado por `studio.js` en `window.HeyduckBus.level`.
 *
 * Presupuesto y degradación:
 *   - Un solo triángulo a pantalla completa, 5 octavas de ruido: ~1 draw call.
 *   - DPR limitado a 1.5 (móviles incluidos) para no reventar la GPU.
 *   - Pausa el render cuando `document.hidden` o el canvas sale del viewport.
 *   - `prefers-reduced-motion`: un único fotograma estático, sin bucle.
 *   - Sin WebGL: la clase `hero--fallback` pinta un degradado CSS equivalente.
 *   - Contexto perdido: se escucha `webglcontextrestored` y se reconstruye.
 */
(function () {
  "use strict";

  var VERTEX_SOURCE = [
    "attribute vec2 aPosition;",
    "void main() {",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAGMENT_SOURCE = [
    "precision highp float;",
    "uniform vec2 uResolution;",
    "uniform float uTime;",
    "uniform float uLevel;",
    "",
    "float hash(vec2 p) {",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  float a = hash(i);",
    "  float b = hash(i + vec2(1.0, 0.0));",
    "  float c = hash(i + vec2(0.0, 1.0));",
    "  float d = hash(i + vec2(1.0, 1.0));",
    "  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);",
    "}",
    "",
    "float fbm(vec2 p) {",
    "  float value = 0.0;",
    "  float amplitude = 0.5;",
    "  for (int i = 0; i < 5; i++) {",
    "    value += amplitude * noise(p);",
    "    p *= 2.02;",
    "    amplitude *= 0.5;",
    "  }",
    "  return value;",
    "}",
    "",
    "void main() {",
    "  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;",
    "  float t = uTime * 0.06;",
    "  vec2 q = uv * 1.7;",
    "  float warp = fbm(q + vec2(t, -t * 0.7));",
    "  float field = fbm(q + warp * 1.35 + vec2(-t * 0.6, t * 0.4));",
    "  float rings = sin((length(uv) * 8.5 - uTime * 1.1) + field * 3.0) * 0.5 + 0.5;",
    "  float pulse = 1.0 + uLevel * 2.0;",
    "",
    "  vec3 base = vec3(0.043, 0.039, 0.035);",
    "  vec3 teal = vec3(0.30, 0.91, 0.88);",
    "  vec3 moss = vec3(0.60, 0.80, 0.42);",
    "",
    "  vec3 color = mix(base, teal, smoothstep(0.12, 1.0, field));",
    "  color = mix(color, moss, rings * 0.32 * field);",
    "  color += vec3(0.04, 0.14, 0.13) * pulse * field;",
    "  color *= smoothstep(1.45, 0.12, length(uv));",
    "",
    "  gl_FragColor = vec4(color, 1.0);",
    "}"
  ].join("\n");

  function now() {
    return (window.performance && performance.now ? performance.now() : Date.now()) / 1000;
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function Hero(canvas) {
    this.canvas = canvas;
    this.gl = null;
    this.program = null;
    this.uniforms = {};
    this.raf = 0;
    this.visible = true;
    this.start = now();
    this.level = 0;
    this.failed = false;
  }

  Hero.prototype.compile = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Shader " + type + ": " + log);
    }
    return shader;
  };

  Hero.prototype.build = function () {
    var gl =
      this.canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" }) ||
      this.canvas.getContext("experimental-webgl");

    if (!gl) throw new Error("WebGL no disponible");

    var vertex = this.compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    var fragment = this.compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);

    var program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Programa: " + gl.getProgramInfoLog(program));
    }

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    this.gl = gl;
    this.program = program;
    this.uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      level: gl.getUniformLocation(program, "uLevel")
    };
  };

  Hero.prototype.resize = function () {
    if (!this.gl) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    var rect = this.canvas.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width * ratio));
    var height = Math.max(1, Math.round(rect.height * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  };

  Hero.prototype.frame = function (time) {
    if (!this.gl) return;
    var gl = this.gl;
    this.resize();

    var bus = window.HeyduckBus || { level: 0 };
    var rawLevel = typeof bus.level === "number" ? bus.level : 0;
    // Suavizado: el shader no debe temblar con cada fotograma del analizador.
    this.level += (rawLevel - this.level) * 0.08;

    gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.time, typeof time === "number" ? time : now() - this.start);
    gl.uniform1f(this.uniforms.level, Math.min(1, this.level));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.flush();
  };

  Hero.prototype.loop = function () {
    var self = this;
    var tick = function () {
      self.raf = window.requestAnimationFrame(tick);
      self.frame();
    };
    this.raf = window.requestAnimationFrame(tick);
  };

  Hero.prototype.pause = function () {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  };

  Hero.prototype.resume = function () {
    if (this.raf || this.failed) return;
    if (!this.visible || document.hidden) return;
    this.loop();
  };

  Hero.prototype.fail = function (reason) {
    this.failed = true;
    this.pause();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.classList.add("hero--fallback");
    }
    this.canvas.setAttribute("aria-hidden", "true");
    if (window.console && console.info) console.info("hero-gl: " + reason + "; degradado a CSS");
  };

  Hero.prototype.init = function () {
    var self = this;

    try {
      this.build();
    } catch (error) {
      this.fail(error.message);
      return;
    }

    // Fotograma estático con movimiento reducido: mismo estilo, cero animación.
    if (reducedMotion()) {
      this.resize();
      this.frame(0);
      return;
    }

    this.canvas.addEventListener("webglcontextlost", function (event) {
      event.preventDefault();
      self.pause();
    });
    this.canvas.addEventListener("webglcontextrestored", function () {
      try {
        self.build();
        self.resume();
      } catch (error) {
        self.fail(error.message);
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self.pause();
      else self.resume();
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          self.visible = entries[i].isIntersecting;
        }
        if (self.visible) self.resume();
        else self.pause();
      }, { threshold: 0.01 });
      observer.observe(this.canvas);
    }

    window.addEventListener("resize", function () {
      self.resize();
      if (!self.raf) self.frame();
    });

    this.resume();
  };

  function boot() {
    var canvas = document.getElementById("hero-gl");
    if (!canvas) return;
    var hero = new Hero(canvas);
    hero.init();
    window.HeyduckHero = hero;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
