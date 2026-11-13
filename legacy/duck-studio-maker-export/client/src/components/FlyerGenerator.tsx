import React, { useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Download, Save, Music } from "lucide-react";
import { toPng } from "html-to-image";

export const FlyerGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [title, setTitle] = useState("DUCK PRODUÇÃO MUSICAL");
  const [subtitle, setSubtitle] = useState("PRODUTOR MUSICAL");
  const [genres, setGenres] = useState("POP · TRAP · MPB · HIPHOP");
  const [description, setDescription] = useState("Produtor musical de Aracaju · Sergipe · Brasil com trabalhos para artistas do Brasil e exterior.");
  const [contact, setContact] = useState("@duck4s | +55 79 99602-6590");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResultUrl, setAiResultUrl] = useState("");

  const flyerRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Projeto salvo com sucesso na sua galeria!");
      utils.projects.list.invalidate();
    },
    onError: (err) => {
      toast.error("Erro ao salvar projeto: " + err.message);
    },
  });

  const aiEnhance = trpc.projects.aiEnhance.useMutation({
    onSuccess: (res) => {
      setAiGenerating(false);
      if (res.success && res.url) {
        setAiResultUrl(res.url);
        toast.success("Design melhorado com IA com sucesso!");
      } else {
        toast.error("Falha na geração de IA: " + (res.error || "Erro desconhecido"));
      }
    },
    onError: (err) => {
      setAiGenerating(false);
      toast.error("Erro na IA: " + err.message);
    },
  });

  const handleAiGenerate = () => {
    setAiGenerating(true);
    aiEnhance.mutate({ prompt: aiPrompt || "Cinematic electronic music flyer with duck branding", type: "flyer" });
  };

  const handleDownload = async () => {
    if (flyerRef.current) {
      try {
        const dataUrl = await toPng(flyerRef.current, { cacheBust: true, quality: 0.95 });
        const link = document.createElement("a");
        link.download = `duck-flyer-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Flyer exportado em alta resolução com sucesso!");
      } catch (err) {
        toast.error("Erro ao exportar imagem.");
      }
    }
  };

  const handleSave = () => {
    createProject.mutate({
      title: title || "Flyer DUCK",
      type: "flyer",
      data: { title, subtitle, genres, description, contact, aiResultUrl },
      previewUrl: aiResultUrl || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-7xl mx-auto">
      {/* Controls Form */}
      <div className="lg:col-span-5 bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-['Unbounded'] text-[#00ff41]">{t("flyerGen")}</h2>
          <p className="text-xs text-gray-400 mt-1">Configure o conteúdo e visual do seu volante profissional.</p>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Título Principal</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Subtítulo / Cargo</label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Gêneros / Tags</label>
            <Input value={genres} onChange={(e) => setGenres(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Descrição / Sobre</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1 h-20" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Contato & Redes</label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div className="pt-4 border-t border-[#00ff41]/10">
            <label className="text-xs font-['JetBrains_Mono'] text-[#00ff41]">Prompt IA Opcional</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Cyberpunk neon studio style..."
                className="bg-[#030806] border-[#00ff41]/30 text-white text-xs"
              />
              <Button
                onClick={handleAiGenerate}
                disabled={aiGenerating}
                className="bg-[#00ff41]/20 hover:bg-[#00ff41]/30 text-[#00ff41] border border-[#00ff41]/40 shrink-0"
              >
                <Sparkles className="w-4 h-4 mr-1" /> {aiGenerating ? "..." : "IA"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-[#00ff41] text-[#030806] hover:bg-[#00cc33] font-bold font-['Unbounded'] text-xs">
            <Save className="w-4 h-4 mr-2" /> {t("saveProject")}
          </Button>
          <Button onClick={handleDownload} variant="outline" className="border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 font-bold text-xs">
            <Download className="w-4 h-4 mr-2" /> {t("downloadPng")}
          </Button>
        </div>
      </div>

      {/* Realtime Live Preview */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-xs font-['JetBrains_Mono'] text-[#00ff41]/60">{t("livePreview")}</div>

        {aiResultUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-[#00ff41]/30 shadow-2xl max-w-md w-full">
            <img src={aiResultUrl} alt="AI Generated Flyer" className="w-full object-cover" />
            <div className="p-4 bg-[#030806] flex justify-between items-center">
              <span className="text-xs font-['JetBrains_Mono'] text-[#00ff41]">Renderizado por IA</span>
              <Button onClick={handleDownload} size="sm" className="bg-[#00ff41] text-[#030806] font-bold text-xs">
                <Download className="w-3 h-3 mr-1" /> {t("downloadPng")}
              </Button>
            </div>
          </div>
        ) : (
          <div ref={flyerRef} className="w-full max-w-md bg-[#030806] border border-[#00ff41]/30 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6 relative">
            <div className="w-12 h-12 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">
              <Music className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-lg font-black font-['Unbounded'] tracking-wider text-[#00ff41]">{title}</h1>
              <p className="text-[10px] font-['JetBrains_Mono'] text-gray-400 tracking-widest mt-1">{subtitle}</p>
            </div>

            <div className="w-full py-2 border-y border-[#00ff41]/20 text-xs font-['JetBrains_Mono'] text-[#00ff41]">
              {genres}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-['Manrope']">
              {description}
            </p>

            <div className="w-full bg-[#07110a] border border-[#00ff41]/20 rounded-xl p-4 flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-[#e8dfc8] rounded-lg flex items-center justify-center p-2">
                <div className="w-full h-full border-2 border-dashed border-[#1a2a1a] rounded flex items-center justify-center text-[10px] font-['JetBrains_Mono'] text-[#1a2a1a] font-bold">
                  DUCK QR
                </div>
              </div>
              <span className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41]">duck.46graus.com</span>
            </div>

            <div className="text-[10px] font-['JetBrains_Mono'] text-gray-400">
              {contact}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
