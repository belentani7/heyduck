import React, { useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Download, CreditCard, Mail, Phone, MapPin, Instagram } from "lucide-react";
import { toPng } from "html-to-image";

export const CardGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("DUCK");
  const [role, setRole] = useState("PRODUTOR MUSICAL");
  const [genres, setGenres] = useState("POP · TRAP · MPB · HIPHOP");
  const [instagram, setInstagram] = useState("@duck4s");
  const [email, setEmail] = useState("duck-beats@hotmail.com");
  const [phone, setPhone] = useState("+55 79 99602-6590");
  const [location, setLocation] = useState("Aracaju · Sergipe · Brasil");

  const cardRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Cartão salvo com sucesso na sua galeria!");
      utils.projects.list.invalidate();
    },
    onError: (err) => {
      toast.error("Erro ao salvar cartão: " + err.message);
    },
  });

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 0.95 });
        const link = document.createElement("a");
        link.download = `duck-card-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Cartão exportado em alta resolução com sucesso!");
      } catch (err) {
        toast.error("Erro ao exportar cartão.");
      }
    }
  };

  const handleSave = () => {
    createProject.mutate({
      title: `Cartão de Visita - ${name}`,
      type: "business_card",
      data: { name, role, genres, instagram, email, phone, location },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="lg:col-span-5 bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-['Unbounded'] text-[#00ff41]">{t("cardGen")}</h2>
          <p className="text-xs text-gray-400 mt-1">Configure a frente e o verso do seu cartão corporativo profissional.</p>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Nome / Marca</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Cargo / Profissão</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Gêneros</label>
            <Input value={genres} onChange={(e) => setGenres(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Instagram</label>
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">E-mail</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Telefone / WhatsApp</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>

          <div>
            <label className="text-xs font-['JetBrains_Mono'] text-gray-300">Localização</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-[#030806] border-[#00ff41]/30 text-white mt-1" />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button onClick={handleSave} className="flex-1 bg-[#00ff41] text-[#030806] hover:bg-[#00cc33] font-bold font-['Unbounded'] text-xs">
            <Save className="w-4 h-4 mr-2" /> {t("saveProject")}
          </Button>
          <Button onClick={handleDownload} variant="outline" className="border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 font-bold text-xs">
            <Download className="w-4 h-4 mr-2" /> {t("downloadPng")}
          </Button>
        </div>
      </div>

      {/* Preview Front & Back */}
      <div ref={cardRef} className="lg:col-span-7 flex flex-col items-center justify-center bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-8 space-y-8">
        <span className="text-xs font-['JetBrains_Mono'] text-[#00ff41]">FRENTE DO CARTÃO</span>
        <div className="w-full max-w-xl aspect-[1.75/1] bg-[#030806] border border-[#00ff41]/30 rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff41]/5 rounded-full blur-2xl"></div>
          <div>
            <h1 className="text-3xl font-black font-['Unbounded'] text-[#00ff41] tracking-wider">{name}</h1>
            <p className="text-xs font-['JetBrains_Mono'] text-gray-400 tracking-widest mt-1">PRODUÇÃO MUSICAL</p>
          </div>
          <div className="flex justify-between items-end border-t border-[#00ff41]/20 pt-4">
            <div className="text-[11px] font-['JetBrains_Mono'] text-[#00ff41] tracking-wider">
              {genres}
            </div>
            <CreditCard className="w-6 h-6 text-[#00ff41]/40" />
          </div>
        </div>

        <span className="text-xs font-['JetBrains_Mono'] text-[#00ff41] mt-4">VERSO DO CARTÃO</span>
        <div className="w-full max-w-xl aspect-[1.75/1] bg-[#030806] border border-[#00ff41]/30 rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="grid grid-cols-2 gap-4 items-center h-full">
            <div className="space-y-3 text-xs font-['Manrope']">
              <div className="font-bold font-['Unbounded'] text-[#00ff41] text-sm mb-2">{role}</div>
              <div className="flex items-center gap-2 text-gray-300">
                <Instagram className="w-3.5 h-3.5 text-[#00ff41]" /> {instagram}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-3.5 h-3.5 text-[#00ff41]" /> {email}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-[#00ff41]" /> {phone}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-[#00ff41]" /> {location}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#07110a] border border-[#00ff41]/20 p-4 rounded-xl">
              <div className="w-20 h-20 bg-[#e8dfc8] rounded-lg flex items-center justify-center p-1">
                <div className="w-full h-full border border-[#1a2a1a] rounded flex items-center justify-center text-[8px] font-['JetBrains_Mono'] text-[#1a2a1a] font-bold text-center">
                  DUCK QR
                </div>
              </div>
              <span className="text-[9px] font-['JetBrains_Mono'] text-[#00ff41] mt-2">duck.46graus.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
