import React, { createContext, useContext, useState } from "react";

export type Lang = "pt" | "es" | "en";

interface Translations {
  [key: string]: {
    pt: string;
    es: string;
    en: string;
  };
}

const translations: Translations = {
  appName: { pt: "DUCK Studio Maker", es: "DUCK Studio Maker", en: "DUCK Studio Maker" },
  dashboard: { pt: "Painel", es: "Dashboard", en: "Dashboard" },
  flyerGen: { pt: "Gerador de Flyers", es: "Generador de Flyers", en: "Flyer Generator" },
  cardGen: { pt: "Cartões de Visita", es: "Tarjetas de Visita", en: "Business Cards" },
  qrGen: { pt: "Códigos QR", es: "Códigos QR", en: "QR Codes" },
  gallery: { pt: "Meus Projetos", es: "Mis Proyectos", en: "My Projects" },
  logout: { pt: "Sair", es: "Cerrar Sesión", en: "Logout" },
  login: { pt: "Entrar com Manus", es: "Entrar con Manus", en: "Sign in with Manus" },
  welcome: { pt: "Bem-vindo ao DUCK Studio", es: "Bienvenido a DUCK Studio", en: "Welcome to DUCK Studio" },
  subtitle: { pt: "Plataforma profissional de design assistido por IA para produção musical e branding.", es: "Plataforma profesional de diseño asistido por IA para producción musical y branding.", en: "Professional AI-assisted design platform for music production and branding." },
  statsStreams: { pt: "Streams Totais", es: "Streams Totales", en: "Total Streams" },
  statsReleases: { pt: "Lançamentos", es: "Lanzamientos", en: "Releases" },
  statsFollowers: { pt: "Seguidores", es: "Seguidores", en: "Followers" },
  quickActions: { pt: "Ações Rápidas", es: "Acciones Rápidas", en: "Quick Actions" },
  createFlyer: { pt: "Criar Novo Flyer", es: "Crear Nuevo Flyer", en: "Create New Flyer" },
  createCard: { pt: "Criar Cartão", es: "Crear Tarjeta", en: "Create Card" },
  createQR: { pt: "Gerar QR Code", es: "Generar QR Code", en: "Generate QR Code" },
  saveProject: { pt: "Salvar Projeto", es: "Guardar Proyecto", en: "Save Project" },
  downloadPng: { pt: "Baixar PNG HD", es: "Descargar PNG HD", en: "Download HD PNG" },
  downloadSvg: { pt: "Baixar SVG", es: "Descargar SVG", en: "Download SVG" },
  aiEnhanceBtn: { pt: "Melhorar com IA", es: "Mejorar con IA", en: "AI Enhance" },
  genresTitle: { pt: "Gêneros Musicais", es: "Géneros Musicales", en: "Music Genres" },
  contactInfo: { pt: "Informações de Contato", es: "Información de Contacto", en: "Contact Information" },
  scanMe: { pt: "ESCANEIE PARA ACESSAR", es: "ESCANÉAME PARA ACCEDER", en: "SCAN TO ACCESS" },
  actions: { pt: "Ações", es: "Acciones", en: "Actions" },
  delete: { pt: "Excluir", es: "Eliminar", en: "Delete" },
  duplicate: { pt: "Duplicar", es: "Duplicar", en: "Duplicate" },
  download: { pt: "Baixar", es: "Descargar", en: "Download" },
  noProjects: { pt: "Nenhum projeto salvo ainda.", es: "No hay proyectos guardados todavía.", en: "No saved projects yet." },
  roleAdmin: { pt: "Administrador", es: "Administrador", en: "Administrator" },
  roleUser: { pt: "Usuário", es: "Usuario", en: "User" },
  livePreview: { pt: "PRÉ-VISUALIZAÇÃO AO VIVO", es: "PREVISUALIZACIÓN EN VIVO", en: "LIVE PREVIEW" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: (k) => k,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("duck_lang");
    return (saved === "es" || saved === "en" || saved === "pt") ? saved : "pt";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("duck_lang", newLang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
