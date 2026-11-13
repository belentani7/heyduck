import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Copy, Download, FolderOpen, Sparkles } from "lucide-react";

export const ProjectGallery: React.FC = () => {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Projeto excluído com sucesso.");
      utils.projects.list.invalidate();
    },
  });

  const duplicateMutation = trpc.projects.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Projeto duplicado com sucesso.");
      utils.projects.list.invalidate();
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-gray-400 font-['JetBrains_Mono']">Carregando projetos...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-['Unbounded'] text-[#00ff41]">{t("gallery")}</h2>
          <p className="text-xs text-gray-400 mt-1">Gerencie todos os seus volantes, cartões e códigos QR salvos.</p>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-16 text-center space-y-4">
          <FolderOpen className="w-12 h-12 text-[#00ff41]/40 mx-auto" />
          <p className="text-sm text-gray-400 font-['JetBrains_Mono']">{t("noProjects")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-[#07110a] border border-[#00ff41]/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#00ff41]/50 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-['JetBrains_Mono'] bg-[#00ff41]/10 text-[#00ff41] px-2 py-0.5 rounded border border-[#00ff41]/30">
                    {p.type}
                  </span>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold font-['Unbounded'] text-sm text-white truncate">{p.title}</h3>
              </div>

              {p.previewUrl ? (
                <div className="rounded-xl overflow-hidden border border-[#00ff41]/20 h-40 bg-[#030806]">
                  <img src={p.previewUrl} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl border border-[#00ff41]/20 h-40 bg-[#030806] flex items-center justify-center text-xs font-['JetBrains_Mono'] text-gray-500">
                  Preview Indisponível
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#00ff41]/10">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateMutation.mutate({ id: p.id })}
                    className="border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 text-xs h-8 px-2"
                    title={t("duplicate")}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Iniciando download...")}
                    className="border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 text-xs h-8 px-2"
                    title={t("download")}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate({ id: p.id })}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs h-8 px-2"
                  title={t("delete")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
