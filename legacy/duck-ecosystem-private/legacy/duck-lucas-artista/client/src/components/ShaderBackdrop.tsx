/*
 * Componente visual da direção Arquivo de Artista: shader verde/índigo,
 * usado somente como atmosfera decorativa. O canvas nunca carrega texto crítico
 * e possui fallback CSS para navegadores sem WebGL ou com movimento reduzido.
 */

import { useEffect, useRef } from "react";

type ShaderBackdropProps = {
  className?: string;
  variant?: "violet" | "lime";
};

export default function ShaderBackdrop({ className = "", variant = "violet" }: ShaderBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_variant;
      float circle(vec2 p, vec2 center, float radius) {
        return smoothstep(radius, radius - 0.12, distance(p, center));
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;
        float t = reduced_placeholder;
        float drift = sin(u_time * 0.18) * 0.08;
        float fieldA = circle(p, vec2(-0.22 + drift, 0.08), 0.52);
        float fieldB = circle(p, vec2(0.35, -0.16 - drift), 0.44);
        float fieldC = circle(p, vec2(0.02, 0.42), 0.35);
        vec3 base = vec3(0.015, 0.035, 0.03);
        vec3 ink = mix(vec3(0.10, 0.05, 0.24), vec3(0.18, 0.35, 0.05), u_variant);
        vec3 color = base + ink * (fieldA * 0.6 + fieldB * 0.43 + fieldC * 0.2);
        color += vec3(0.12, 0.19, 0.06) * smoothstep(0.7, 0.1, length(p)) * 0.12;
        gl_FragColor = vec4(color, 0.94);
      }
    `.replace("reduced_placeholder", reduced ? "0.0" : "u_time");

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const shaderVariant = gl.getUniformLocation(program, "u_variant");
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(canvas.clientWidth * ratio);
      canvas.height = Math.floor(canvas.clientHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const render = (now: number) => {
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now * 0.001);
      gl.uniform1f(shaderVariant, variant === "lime" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    render(0);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={`shader-backdrop ${className}`} aria-hidden="true" />;
}
