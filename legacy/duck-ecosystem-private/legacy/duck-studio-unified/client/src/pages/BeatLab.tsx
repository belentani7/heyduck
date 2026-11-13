import { PortalShell } from "@/components/PortalShell";
import { Button } from "@/components/ui/button";
import { buildPreviewNotes, getPreviewDurationSeconds, type BeatLabMood } from "@/lib/beatLabSequence";
import { trpc } from "@/lib/trpc";
import { AudioLines, BrainCircuit, Layers3, Play, Sparkles, Square, WandSparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const presets = [
  { name: "Névoa verde", mood: "Noturno · 92 BPM", notes: "Rhodes granular, subgrave quente e percussão aberta." },
  { name: "Gravidade", mood: "Denso · 140 BPM", notes: "808 profundo, hats precisos e acordes suspensos." },
  { name: "Amanhecer", mood: "Luminoso · 110 BPM", notes: "Guitarra processada, percussão orgânica e baixo redondo." },
];

function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export default function BeatLab() {
  const [mood, setMood] = useState<BeatLabMood>("Noturno");
  const [bpm, setBpm] = useState(96);
  const [structure, setStructure] = useState("Intro · Verso · Refrão · Verso · Outro");
  const [variation, setVariation] = useState("Textura adicional");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const previewTimerRef = useRef<number | null>(null);
  const proposal = useMemo(() => `Proposta ${mood.toLowerCase()} · ${bpm} BPM`, [mood, bpm]);
  const previewNotes = useMemo(() => buildPreviewNotes(mood), [mood]);
  const previewSeconds = useMemo(() => getPreviewDurationSeconds(previewNotes.length, bpm), [bpm, previewNotes.length]);
  const saveProposal = trpc.portal.submitBrief.useMutation({
    onSuccess: () => toast.success("Proposta salva nos seus briefs."),
    onError: () => toast.error("Não foi possível salvar a proposta."),
  });
  const guidanceMutation = trpc.beatLab.guidance.useMutation({
    onSuccess: () => toast.success("Orientação gerada para sua revisão."),
    onError: () => toast.error("A orientação não ficou disponível. Revise o brief manualmente e tente mais tarde."),
  });
  const presetName = mood === "Denso" ? "Gravidade" : mood === "Luminoso" ? "Amanhecer" : "Névoa verde";

  const stopPreview = useCallback(() => {
    if (previewTimerRef.current !== null) {
      window.clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    oscillatorsRef.current.forEach(oscillator => {
      try { oscillator.stop(); } catch { /* Osciladores já finalizados não exigem ação adicional. */ }
    });
    oscillatorsRef.current = [];
    setIsPreviewPlaying(false);
  }, []);

  const playPreview = useCallback(async () => {
    if (!("AudioContext" in window)) {
      toast.error("Seu navegador não oferece a API de áudio necessária para esta prévia.");
      return;
    }
    stopPreview();
    try {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      await context.resume();
      const startAt = context.currentTime + 0.06;
      const stepSeconds = 60 / bpm;
      previewNotes.forEach((note, index) => {
        const start = startAt + index * stepSeconds;
        const end = start + stepSeconds * 0.72;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index % 4 === 0 ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(midiToFrequency(note), start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.08, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(end + 0.04);
        oscillatorsRef.current.push(oscillator);
      });
      setIsPreviewPlaying(true);
      previewTimerRef.current = window.setTimeout(stopPreview, Math.ceil((previewSeconds + 0.15) * 1000));
    } catch {
      toast.error("Não foi possível iniciar a prévia sonora. Tente novamente após interagir com a página.");
      stopPreview();
    }
  }, [bpm, previewNotes, previewSeconds, stopPreview]);

  useEffect(() => () => {
    stopPreview();
    void audioContextRef.current?.close();
  }, [stopPreview]);

  const saveToBrief = () => saveProposal.mutate({
    title: proposal,
    objective: `Proposta criada no Beat Lab. Estrutura: ${structure}. Variação: ${variation}.`,
    references: `Preset sugerido: ${presetName}.`,
    mood,
    bpm,
    genre: "Proposta Beat Lab",
  });
  const requestGuidance = () => guidanceMutation.mutate({ mood, bpm, structure, variation });
  const guidance = guidanceMutation.data;

  return <PortalShell label="Beat Lab">
    <section className="glass-panel overflow-hidden">
      <div className="border-b border-white/10 p-6 md:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">LABORATÓRIO GUIADO</p><h2 className="mt-3 font-display text-4xl text-white">Desenhe a direção antes de produzir.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/60">O Beat Lab transforma um brief em proposta de preset, estrutura e variação. A prévia abaixo é um esboço sonoro de oito passos criado no navegador; ela não gera stems nem substitui uma DAW.</p></div><WandSparkles className="text-emerald-300" size={28} /></div></div>
      <div className="grid gap-7 p-6 md:grid-cols-[.9fr_1.1fr] md:p-8"><div className="space-y-5"><label><span className="field-label">Clima principal</span><select value={mood} onChange={(event) => setMood(event.target.value as BeatLabMood)} className="studio-input"><option>Noturno</option><option>Denso</option><option>Luminoso</option><option>Íntimo</option><option>Cinemático</option></select></label><label><span className="field-label">Andamento · {bpm} BPM</span><input type="range" min="60" max="160" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} className="w-full accent-emerald-300" /></label><label><span className="field-label">Estrutura</span><select value={structure} onChange={(event) => setStructure(event.target.value)} className="studio-input"><option>Intro · Verso · Refrão · Verso · Outro</option><option>Intro · Refrão · Verso · Refrão · Ponte</option><option>Intro · Verso · Crescente · Drop · Outro</option></select></label><label><span className="field-label">Variação proposta</span><select value={variation} onChange={(event) => setVariation(event.target.value)} className="studio-input"><option>Textura adicional</option><option>Drop minimalista</option><option>Refrão expandido</option><option>Ponte instrumental</option></select></label></div>
        <div className="rounded-3xl border border-emerald-200/15 bg-gradient-to-br from-emerald-300/15 to-transparent p-6"><p className="mono-label">PROPOSTA DE DIREÇÃO</p><h3 className="mt-4 font-display text-3xl text-white">{proposal}</h3><div className="mt-7 space-y-4">{[{ icon: Sparkles, label: "Preset", value: presetName }, { icon: Layers3, label: "Estrutura", value: structure }, { icon: AudioLines, label: "Variação", value: variation }].map(({ icon: Icon, label, value }) => <div className="flex gap-3" key={label}><Icon className="mt-0.5 text-emerald-300" size={18} /><div><p className="text-xs font-bold text-emerald-100/55">{label}</p><p className="mt-1 text-sm text-white">{value}</p></div></div>)}</div><Button aria-pressed={isPreviewPlaying} onClick={() => void (isPreviewPlaying ? stopPreview() : playPreview())} className="mt-8 w-full border border-emerald-200/20 bg-white/5 text-white hover:bg-white/10">{isPreviewPlaying ? <><Square size={16} />Parar prévia sonora</> : <><Play size={16} />Ouvir esboço sonoro · {previewSeconds.toFixed(1)} s</>}</Button><Button onClick={requestGuidance} disabled={guidanceMutation.isPending} className="mt-3 w-full border border-emerald-200/20 bg-white/5 text-white hover:bg-white/10">{guidanceMutation.isPending ? "Gerando orientação…" : <><BrainCircuit size={16} />Gerar orientação de IA</>}</Button><Button onClick={saveToBrief} disabled={saveProposal.isPending} className="mt-3 w-full">{saveProposal.isPending ? "Salvando…" : "Salvar como brief de produção"}</Button></div>
      </div>
    </section>
    <section aria-live="polite" className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">{guidance ? <article className="glass-panel p-6"><p className="eyebrow">ORIENTAÇÃO ASSISTIVA · REVISÃO HUMANA</p><h3 className="mt-3 font-display text-3xl text-white">Pontos para refinar o esboço.</h3><p className="mt-4 text-sm leading-6 text-emerald-100/75">{guidance.summary}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><p className="mono-label">PERGUNTAS</p><ul className="mt-3 space-y-2 text-sm text-emerald-100/70">{guidance.questions.map(question => <li key={question}>• {question}</li>)}</ul></div><div><p className="mono-label">SUGESTÕES</p><ul className="mt-3 space-y-2 text-sm text-emerald-100/70">{guidance.suggestions.map(suggestion => <li key={suggestion}>• {suggestion}</li>)}</ul></div></div><p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-emerald-100/55">{guidance.reviewNote} A orientação não é salva automaticamente nem executa ações externas.</p></article> : <article className="glass-panel p-6"><p className="eyebrow">ORIENTAÇÃO ASSISTIVA</p><h3 className="mt-3 font-display text-3xl text-white">Use a IA como uma segunda escuta.</h3><p className="mt-4 text-sm leading-6 text-emerald-100/60">A orientação utiliza apenas os campos deste esboço para sugerir perguntas e pontos de produção. Revise tudo antes de salvar, compartilhar ou transformar em decisão criativa.</p></article>}<aside className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><p className="mono-label">LIMITE DA SESSÃO</p><p className="mt-3 text-sm leading-6 text-emerald-100/65">Nenhum áudio é enviado por esta ação. A IA não publica conteúdo, não contata clientes e não altera o seu projeto.</p></aside></section>
    <section className="mt-5 grid gap-4 md:grid-cols-3">{presets.map(preset => <article className="rounded-3xl border border-white/10 bg-white/[.035] p-5" key={preset.name}><p className="mono-label">PRESET</p><h3 className="mt-3 text-lg font-bold text-white">{preset.name}</h3><p className="mt-1 text-xs text-emerald-300">{preset.mood}</p><p className="mt-5 text-xs leading-5 text-emerald-100/55">{preset.notes}</p></article>)}</section>
  </PortalShell>;
}
