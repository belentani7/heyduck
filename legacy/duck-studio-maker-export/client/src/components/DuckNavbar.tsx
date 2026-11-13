import React from "react";
import { useLanguage, Lang } from "../contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Globe, LogOut, Shield, User as UserIcon, LayoutDashboard, FileText, CreditCard, QrCode, FolderGit2 } from "lucide-react";

interface DuckNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const DuckNavbar: React.FC<DuckNavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "flyer", label: t("flyerGen"), icon: FileText },
    { id: "card", label: t("cardGen"), icon: CreditCard },
    { id: "qr", label: t("qrGen"), icon: QrCode },
    { id: "gallery", label: t("gallery"), icon: FolderGit2 },
  ];

  return (
    <aside className="w-64 bg-[#07110a] border-r border-[#00ff41]/15 flex flex-col justify-between shrink-0 hidden md:flex">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-[#00ff41]/15 flex items-center justify-between">
          <div
            onClick={() => setCurrentTab("dashboard")}
            className="cursor-pointer flex items-center gap-2 font-black text-xl tracking-wider text-[#00ff41] font-['Unbounded']"
          >
            <span>DUCK</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-['JetBrains_Mono']">
              STUDIO
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#00ff41] text-[#030806] font-bold shadow-lg shadow-[#00ff41]/10"
                    : "text-gray-400 hover:text-[#00ff41] hover:bg-[#030806]/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer controls: Language & Auth */}
      <div className="p-4 border-t border-[#00ff41]/15 space-y-4">
        {/* Language switch */}
        <div className="flex items-center justify-between bg-[#030806] border border-[#00ff41]/20 rounded-xl p-1.5">
          <div className="flex items-center gap-1.5 px-2">
            <Globe className="w-3.5 h-3.5 text-[#00ff41]" />
            <span className="text-xs font-['JetBrains_Mono'] text-gray-400 uppercase">{lang}</span>
          </div>
          <div className="flex gap-1">
            {(["pt", "es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[10px] uppercase font-['JetBrains_Mono'] rounded transition-all ${
                  lang === l ? "bg-[#00ff41] text-[#030806] font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* User state */}
        {isAuthenticated && user ? (
          <div className="bg-[#030806] border border-[#00ff41]/20 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <UserIcon className="w-4 h-4 text-[#00ff41] shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{user.name || user.email}</div>
                <div className="text-[9px] font-['JetBrains_Mono0'] text-[#00ff41]">{user.role.toUpperCase()}</div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title={t("logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            onClick={() => startLogin()}
            className="w-full bg-[#00ff41] hover:bg-[#00cc33] text-[#030806] font-bold font-['Unbounded'] text-xs py-2.5"
          >
            {t("login")}
          </Button>
        )}
      </div>
    </aside>
  );
};
