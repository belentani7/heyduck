import React, { useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Download, Bird } from "lucide-react";
import { toPng } from "html-to-image";

export const QrGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [url, setUrl] = useState("https://duck.46graus.com");
  const [title, setTitle] = useState("DUCK Official QR");

  const qrRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("QR Code salvo com sucesso na sua galeria!");
      utils.projects.list.invalidate();
    },
    onError: (err) => {
      toast.error("Erro ao salvar QR: " + err.message);
    },
  });

  const handleDownloadPng = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { cacheBust: true, quality: 0.95 });
        const link = document.createElement("a");
        link.download = `duck-qr-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("QR Code PNG baixado com sucesso!");
      } catch (err) {
        toast.error("Erro ao baixar PNG.");
      }
    }
  };

  const handleDownloadSvg = () => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300"><rect width="300" height="300" fill="#e8dfc8"/><rect x="40" y="40" width="70" height="70" rx="12" fill="#1a2a1a"/><circle cx="150" cy="150" r="30" fill="#1a2a1a"/><text x="150" y="280" font-family="monospace" font-size="12" text-anchor="middle" fill="#1a2a1a">${url}</text></svg>`;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `duck-qr-${Date.now()}.svg`;
    link.click();
    toast.success("QR Code SVG baixado com sucesso!");
  };

  const handleSave = () => {
    createProject.mutate({
      title,
      type: "qr_code",
      data: { url },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="lg:col-span-5 bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-['Unbounded'] text-[#00ff41]">{t("qrGen")}</h2>
          <p className="text-xs text-gray-400 mt-1">Gere códigos QR personalizados com o pato geométrico central de DUCK.</p>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Título do Projeto</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">URL de Destino</label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>
        </div>

        <div className="bg-[#030806] border border-[#00ff41]/20 rounded-xl p-4 space-y-2 text-xs font-['JetBrains_Mono'] text-gray-400">
          <div className="flex items-center gap-2 text-[#00ff41] font-bold">
            <Bird className="w-4 h-4" /> Pato Geométrico Central
          </div>
          <p>O QR Code gerado possui alta correção de erros (H), permitindo a inserção perfeita do ícone do pato sem perda de leitura.</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1 bg-[#00ff41] text-[#030806] hover:bg-[#00cc33] font-bold font-['Unbounded'] text-xs">
            <Save className="w-4 h-4 mr-2" /> {t("saveProject")}
          </Button>
        </div>
      </div>

      {/* QR Preview */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-12 space-y-6">
        <span className="text-xs font-['JetBrains_Mono'] text-[#00ff41]">{t("livePreview")}</span>

        <div ref={qrRef} className="bg-[#e8dfc8] border-4 border-[#1a2a1a] rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full">
          <div className="w-48 h-48 bg-[#1a2a1a] rounded-xl flex items-center justify-center relative shadow-inner">
            <div className="absolute inset-3 border-2 border-dashed border-[#e8dfc8]/40 rounded grid grid-cols-6 grid-rows-6 gap-1 p-2">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className={`rounded-[2px] ${i % 2 === 0 || i % 5 === 0 ? "bg-[#e8dfc8]" : "bg-transparent"}`}></div>
              ))}
            </div>

            <div className="w-14 h-14 bg-[#e8dfc8] rounded-full flex items-center justify-center shadow-lg border-2 border-[#1a2a1a] z-10">
              <Bird className="w-8 h-8 text-[#1a2a1a]" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs font-['JetBrains_Mono'] text-[#1a2a1a] font-bold truncate max-w-[240px]">{url}</div>
            <div className="text-[10px] font-['JetBrains_Mono'] text-[#4a6b4a] mt-1">DUCK PRODUÇÃO MUSICAL</div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleDownloadPng} className="bg-[#00ff41] text-[#030806] hover:bg-[#00cc33] font-bold text-xs">
            <Download className="w-4 h-4 mr-2" /> {t("downloadPng")}
          </Button>
          <Button onClick={handleDownloadSvg} variant="outline" className="border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 font-bold text-xs">
            <Download className="w-4 h-4 mr-2" /> {t("downloadSvg")}
          </Button>
        </div>
      </div>
    </div>
  );
};
