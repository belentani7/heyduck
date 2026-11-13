/*
 * Design philosophy: Dark Cinematic — incluso el fallback mantiene el lenguaje de
 * señal, consola y orientación; nunca deja al visitante en un callejón sin salida.
 */
import { ArrowLeft, AudioWaveform } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px", background: "#080d0a", color: "#f1ecd9" }}>
      <section style={{ width: "min(560px, 100%)", border: "1px solid rgba(182,221,113,.25)", padding: "38px", background: "#0e1610" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#b6dd71", fontFamily: "monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase" }}>
          <AudioWaveform size={18} /> signal / 404
        </div>
        <h1 style={{ margin: "36px 0 14px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(48px, 10vw, 90px)", lineHeight: ".9", letterSpacing: "-.08em", textTransform: "uppercase" }}>Esta faixa<br /><span style={{ color: "#b6dd71" }}>não existe.</span></h1>
        <p style={{ maxWidth: "360px", color: "rgba(241,236,217,.58)" }}>O endereço saiu do setlist. Volta ao início e encontra o próximo sinal.</p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "26px", padding: "14px 17px", background: "#b6dd71", color: "#080d0a", fontFamily: "monospace", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" }}><ArrowLeft size={16} /> Voltar ao início</Link>
      </section>
    </main>
  );
}
