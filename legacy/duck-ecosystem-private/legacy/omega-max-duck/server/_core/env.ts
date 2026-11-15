export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // Forge / Manus (existente)
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Superpowers MCP Hub (nuevo)
  mcpServerUrl: process.env.MCP_SERVER_URL ?? "stdio://belentani-hub",
  // Google Cloud / Gemini (nuevo)
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  // OpenAI ChatGPT fallback (nuevo)
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  // GitHub (nuevo)
  githubToken: process.env.GITHUB_TOKEN ?? "",
  githubOwner: process.env.GITHUB_OWNER ?? "belentani7",
  // Suno música (nuevo)
  sunoApiKey: process.env.SUNO_API_KEY ?? "",
  // LinkedIn (nuevo)
  linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN ?? "",
  // DistroKid (nuevo)
  distrokidApiKey: process.env.DISTROKID_API_KEY ?? "",
  // Google Cloud project (nuevo)
  googleProjectId: process.env.GOOGLE_PROJECT_ID ?? "agentes-ia-497222",
};
