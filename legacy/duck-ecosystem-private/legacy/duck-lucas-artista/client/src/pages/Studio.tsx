/*
 * Studio / playground criativo de Duck.
 * O áudio nasce localmente no navegador após uma ação explícita do usuário.
 * Não há upload de microfone nem promessa de DAW completa. O criador de letras
 * devolve apenas duas estrofes curtas de inspiração, nunca una canción completa.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, AudioLines, CircleStop, Headphones, Mic, MicOff, Music2, Play, RotateCcw, Sparkles, Waves } from "lucide-react";
import { Link } from "wouter";
import ShaderBackdrop from "@/components/ShaderBackdrop";

type AudioRig = {
  context: AudioContext;
  master: GainNode;
  filter: BiquadFilterNode;
  delay: DelayNode;
  delayGain: GainNode;
  analyser: AnalyserNode;
  micStream?: MediaStream;
  recorder?: MediaRecorder;
};

const pads = [
  { label: "C", note: 261.63, color: "lime" },
  { label: "D", note: 293.66, color: "violet" },
  { label: "E", note: 329.63, color: "cream" },
  { label: "G", note: 392.0, color: "blue" },
  { label: "A", note: 440.0, color: "orange" },
  { label: "C²", note: 523.25, color: "lime" },
];

const lyricSeeds = {
  noite: [
    ["A cidade acende devagar", "e eu guardo um pulso no bolso."],
    ["Deixo a janela respirar", "até o silêncio virar rosto."],
  ],
  movimento: [
    ["Pé no chão, sinal aberto", "cada esquina muda o tom."],
    ["Se o caminho fica incerto", "eu transformo o ruído em som."],
  ],
  interior: [
    ["Tem uma sala dentro da voz", "onde a pressa não entra."],
    ["Eu escuto o que ficou após", "e faço espaço para a pergunta."],
  ],
};

type Mood = keyof typeof lyricSeeds;

function createRig(): AudioRig {
  const context = new AudioContext();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(1.5);
  const delayGain = context.createGain();
  const analyser = context.createAnalyser();
  master.gain.value = 0.18;
  filter.type = "lowpass";
  filter.frequency.value = 14000;
  delay.delayTime.value = 0.17;
  delayGain.gain.value = 0.18;
  analyser.fftSize = 128;
  filter.connect(master);
  filter.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(master);
  master.connect(analyser);
  analyser.connect(context.destination);
  return { context, master, filter, delay, delayGain, analyser };
}

export default function Studio() {
  const rigRef = useRef<AudioRig | null>(null);
  const animationRef = useRef<number>(0);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [playingPad, setPlayingPad] = useState<number | null>(null);
  const [filter, setFilter] = useState(14000);
  const [space, setSpace] = useState(0.18);
  const [drive, setDrive] = useState(0.18);
  const [micActive, setMicActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("noite");
  const [verse, setVerse] = useState(lyricSeeds.noite);

  const ensureAudio = useCallback(async () => {
    if (!rigRef.current) rigRef.current = createRig();
    if (rigRef.current.context.state === "suspended") await rigRef.current.context.resume();
    setAudioReady(true);
    return rigRef.current;
  }, []);

  const triggerPad = async (note: number, index: number) => {
    const rig = await ensureAudio();
    if (!rig) return;
    const now = rig.context.currentTime;
    const oscillator = rig.context.createOscillator();
    const envelope = rig.context.createGain();
    oscillator.type = index % 2 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(note, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.36, now + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
    oscillator.connect(envelope);
    envelope.connect(rig.filter);
    oscillator.start(now);
    oscillator.stop(now + 0.85);
    setPlayingPad(index);
    window.setTimeout(() => setPlayingPad((current) => current === index ? null : current), 220);
  };

  const toggleMic = async () => {
    const rig = await ensureAudio();
    if (!rig) return;
    if (micActive && rig.micStream) {
      rig.micStream.getTracks().forEach((track) => track.stop());
      rig.micStream = undefined;
      setMicActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = rig.context.createMediaStreamSource(stream);
      source.connect(rig.filter);
      rig.micStream = stream;
      setMicActive(true);
    } catch {
      setMicActive(false);
    }
  };

  const toggleRecording = async () => {
    const rig = await ensureAudio();
    if (!rig || !rig.micStream) {
      await toggleMic();
      return;
    }
    if (recording && rig.recorder) {
      rig.recorder.stop();
      setRecording(false);
      return;
    }
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(rig.micStream);
    recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setRecordedUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    rig.recorder = recorder;
    setRecording(true);
  };

  const updateFilter = (value: number) => {
    setFilter(value);
    if (rigRef.current) rigRef.current.filter.frequency.setTargetAtTime(value, rigRef.current.context.currentTime, 0.04);
  };
  const updateSpace = (value: number) => {
    setSpace(value);
    if (rigRef.current) rigRef.current.delayGain.gain.setTargetAtTime(value, rigRef.current.context.currentTime, 0.04);
  };
  const updateDrive = (value: number) => {
    setDrive(value);
    if (rigRef.current) rigRef.current.master.gain.setTargetAtTime(0.12 + value * 0.26, rigRef.current.context.currentTime, 0.04);
  };

  const regenerateVerse = () => {
    const options = lyricSeeds[mood];
    setVerse([...options].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    const canvas = waveformRef.current;
    const rig = rigRef.current;
    if (!canvas || !rig) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const draw = () => {
      const data = new Uint8Array(rig.analyser.frequencyBinCount);
      rig.analyser.getByteFrequencyData(data);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(7,18,15,0.6)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#b7d63b";
      context.lineWidth = 2;
      context.beginPath();
      data.forEach((value, index) => {
        const x = (index / data.length) * canvas.width;
        const y = canvas.height - (value / 255) * canvas.height * 0.8 - 5;
        index === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
      });
      context.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [audioReady]);

  useEffect(() => () => {
    if (rigRef.current?.micStream) rigRef.current.micStream.getTracks().forEach((track) => track.stop());
    cancelAnimationFrame(animationRef.current);
    void rigRef.current?.context.close();
  }, []);

  return (
    <div className="studio-page">
      <ShaderBackdrop className="studio-shader" variant="lime" />
      <header className="studio-header page-frame"><Link href="/" className="back-link"><ArrowLeft size={16} /> início</Link><span className="singles-header-mark">DUCK / studio</span><Link href="/singles" className="studio-link">ver singles <ArrowUpRight size={15} /></Link></header>
      <main>
        <section className="studio-hero page-frame"><div className="section-marker">playground / sessão aberta</div><div className="studio-hero-layout"><div><h1>Entra no<br /><em>Studio.</em></h1><p>Um espaço para brincar de produtor: aciona um pad, move a mesa, escuta a forma de uma ideia e leva uma faísca para a sua próxima faixa.</p></div><div className="studio-status"><span className={audioReady ? "status-live" : ""} />{audioReady ? "áudio local ativo" : "clique para ativar"}</div></div></section>

        <section className="studio-console page-frame" aria-label="Mesa musical interativa">
          <div className="console-heading"><span className="eyebrow">01 / instrumentos</span><span>som sintético local · sem upload</span></div>
          <div className="console-grid">
            <div className="pad-bank"><div className="pad-bank-title"><Music2 size={17} /> pads de ideia</div><div className="pad-grid">{pads.map((pad, index) => <button key={pad.label} className={`sound-pad pad-${pad.color} ${playingPad === index ? "is-playing" : ""}`} onClick={() => void triggerPad(pad.note, index)} aria-label={`Tocar nota ${pad.label}`}><span>{pad.label}</span><small>{Math.round(pad.note)} Hz</small><i /></button>)}</div><p className="console-hint">Cada toque dispara um envelope curto. Use a sequência como rascunho de ritmo, não como instrumento final.</p></div>
            <div className="wave-panel"><canvas ref={waveformRef} width="520" height="210" /><div className="wave-overlay"><AudioLines size={16} /><span>{audioReady ? "monitorando" : "sem sinal"}</span></div></div>
          </div>
        </section>

        <section className="effects-section page-frame"><div className="console-heading"><span className="eyebrow">02 / mesa de efeitos</span><span>move os controles</span></div><div className="effects-grid"><label className="knob-control"><span>filtro</span><input type="range" min="500" max="16000" value={filter} onChange={(event) => updateFilter(Number(event.target.value))} /><strong>{Math.round(filter / 100) / 10} kHz</strong></label><label className="knob-control"><span>espaço</span><input type="range" min="0" max="0.7" step="0.01" value={space} onChange={(event) => updateSpace(Number(event.target.value))} /><strong>{Math.round(space * 100)}%</strong></label><label className="knob-control"><span>drive / ganho</span><input type="range" min="0" max="1" step="0.01" value={drive} onChange={(event) => updateDrive(Number(event.target.value))} /><strong>{Math.round(drive * 100)}%</strong></label><div className="effects-note"><Waves size={20} /><p>O objetivo é perceber como uma mesma ideia muda quando você corta brilho, adiciona espaço ou aproxima o nível.</p></div></div></section>

        <section className="mic-section page-frame"><div className="mic-copy"><div className="console-heading"><span className="eyebrow">03 / voz</span><span>permissão só quando você pedir</span></div><h2>Uma frase<br /><em>já é matéria.</em></h2><p>Ative o microfone para ouvir a própria voz atravessando a mesa. A gravação fica no navegador e não é enviada para servidor algum.</p><div className="mic-actions"><button className="button button-primary" onClick={() => void toggleMic()}>{micActive ? <MicOff size={17} /> : <Mic size={17} />}{micActive ? "desativar microfone" : "ativar microfone"}</button><button className="button button-ghost" onClick={() => void toggleRecording()}>{recording ? <CircleStop size={17} /> : <Mic size={17} />}{recording ? "parar gravação" : "gravar rascunho"}</button>{recordedUrl && <a className="recorded-link" href={recordedUrl} download="duck-studio-rascunho.webm"><Play size={14} /> ouvir / baixar rascunho</a>}</div></div><div className={`mic-visual ${micActive ? "is-live" : ""}`}><div className="mic-orb"><Mic size={30} /></div><span>{micActive ? "sinal aberto" : "aguardando sinal"}</span></div></section>

        <section className="lyric-section page-frame"><div className="console-heading"><span className="eyebrow">04 / faísca lírica</span><span>duas estrofes · não uma música inteira</span></div><div className="lyric-layout"><div><h2>Joga uma<br /><em>ideia no ar.</em></h2><p>Escolha um clima e gere um fragmento curto para continuar brincando. A ferramenta não escreve uma canção completa: ela abre uma porta.</p><div className="mood-options" role="group" aria-label="Escolher clima">{(Object.keys(lyricSeeds) as Mood[]).map((item) => <button key={item} className={mood === item ? "is-selected" : ""} onClick={() => setMood(item)}>{item}</button>)}</div><button className="button button-primary" onClick={regenerateVerse}><Sparkles size={17} /> gerar duas estrofes <RotateCcw size={15} /></button></div><div className="lyric-output"><span className="lyric-output-label">rascunho / {mood}</span>{verse.map(([lineA, lineB], index) => <div className="verse-block" key={`${lineA}-${index}`}><span>0{index + 1}</span><p>{lineA}<br /><em>{lineB}</em></p></div>)}</div></div></section>

        <section className="studio-note page-frame"><Headphones size={23} /><p>A produção começa antes do primeiro arquivo: começa quando você aprende a ouvir o que ainda não está pronto.</p></section>
      </main>
      <footer className="singles-footer page-frame"><span>Lucas / Duck · Studio playground</span><Link href="/singles">voltar para Singles →</Link></footer>
    </div>
  );
}
