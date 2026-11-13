import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Disc, Users, Radio, Award, Plus } from "lucide-react";

interface DashboardViewProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#07110a] to-[#030806] border border-[#00ff41]/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#00ff41]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs uppercase font-['JetBrains_Mono'] bg-[#00ff41]/10 text-[#00ff41] px-3 py-1 rounded-full border border-[#00ff41]/30">
            DUCK PRODUÇÃO MUSICAL
          </span>
          <h1 className="text-3xl lg:text-4xl font-black font-['Unbounded'] text-white">
            {t("welcome")}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed font-['Manrope']">
            {t("subtitle")}
          </p>
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => setCurrentTab("flyer")}
              className="bg-[#00ff41] text-[#030806] hover:bg-[#00cc33] font-bold font-['Unbounded'] text-xs px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" /> {t("createFlyer")}
            </Button>
            <Button
              onClick={() => setCurrentTab("gallery")}
              variant="outline"
              className="border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 font-bold font-['Unbounded'] text-xs px-6 py-3"
            >
              {t("gallery")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-['JetBrains_Mono']">{t("statsStreams")}</span>
            <Disc className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-3xl font-black font-['Unbounded'] text-white mt-4">36M+</div>
          <div className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41] mt-1">+14% este mês</div>
        </div>

        <div className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-['JetBrains_Mono']">{t("statsReleases")}</span>
            <Radio className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-3xl font-black font-['Unbounded'] text-white mt-4">40+</div>
          <div className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41] mt-1">Álbuns e Singles</div>
        </div>

        <div className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-['JetBrains_Mono']">{t("statsFollowers")}</span>
            <Users className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-3xl font-black font-['Unbounded'] text-white mt-4">1.4K+</div>
          <div className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41] mt-1">Artistas Ativos</div>
        </div>

        <div className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-['JetBrains_Mono']">Qualidade</span>
            <Award className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-3xl font-black font-['Unbounded'] text-white mt-4">100%</div>
          <div className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41] mt-1">Engenharia de Som</div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-['Unbounded'] text-[#00ff41]">{t("quickActions")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setCurrentTab("flyer")}
            className="cursor-pointer bg-[#07110a] border border-[#00ff41]/20 hover:border-[#00ff41] rounded-2xl p-6 transition-all group"
          >
            <h3 className="font-bold font-['Unbounded'] text-lg text-white group-hover:text-[#00ff41] transition-colors">{t("createFlyer")}</h3>
            <p className="text-xs text-gray-400 mt-2">Crie volantes profissionais de divulgação musical com pré-visualização e IA.</p>
          </div>

          <div
            onClick={() => setCurrentTab("card")}
            className="cursor-pointer bg-[#07110a] border border-[#00ff41]/20 hover:border-[#00ff41] rounded-2xl p-6 transition-all group"
          >
            <h3 className="font-bold font-['Unbounded'] text-lg text-white group-hover:text-[#00ff41] transition-colors">{t("createCard")}</h3>
            <p className="text-xs text-gray-400 mt-2">Desenvolva cartões de visita corporativos com frente, verso e QR code.</p>
          </div>

          <div
            onClick={() => setCurrentTab("qr")}
            className="cursor-pointer bg-[#07110a] border border-[#00ff41]/20 hover:border-[#00ff41] rounded-2xl p-6 transition-all group"
          >
            <h3 className="font-bold font-['Unbounded'] text-lg text-white group-hover:text-[#00ff41] transition-colors">{t("createQR")}</h3>
            <p className="text-xs text-gray-400 mt-2">Gere códigos QR customizados com o pato geométrico e exporte em PNG/SVG.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
