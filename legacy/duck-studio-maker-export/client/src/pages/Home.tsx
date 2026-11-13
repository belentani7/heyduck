import React, { useState } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import { DuckNavbar } from "../components/DuckNavbar";
import { DashboardView } from "../components/DashboardView";
import { FlyerGenerator } from "../components/FlyerGenerator";
import { CardGenerator } from "../components/CardGenerator";
import { QrGenerator } from "../components/QrGenerator";
import { ProjectGallery } from "../components/ProjectGallery";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("dashboard");

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#030806] text-[#ecf5ec]">
        <DuckNavbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <main className="flex-1">
          {currentTab === "dashboard" && <DashboardView setCurrentTab={setCurrentTab} />}
          {currentTab === "flyer" && <FlyerGenerator />}
          {currentTab === "card" && <CardGenerator />}
          {currentTab === "qr" && <QrGenerator />}
          {currentTab === "gallery" && <ProjectGallery />}
        </main>

        <footer className="border-t border-[#00ff41]/15 py-6 px-8 text-center text-xs font-['JetBrains_Mono'] text-gray-500">
          © 2026 DUCK Produção Musical · Todos os direitos reservados.
        </footer>
      </div>
    </LanguageProvider>
  );
}
