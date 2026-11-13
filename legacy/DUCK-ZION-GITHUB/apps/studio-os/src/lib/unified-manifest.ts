export type UnifiedModuleStatus = 'core' | 'ready' | 'adapter' | 'asset'

export interface UnifiedModule {
  id: string
  name: string
  status: UnifiedModuleStatus
  version: string
  capabilities: string[]
  permissions: string[]
  healthPath?: string
}

export const UNIFIED_MANIFEST = {
  protocol: 'duck-zion.unified/v1',
  generatedAt: '2026-08-15',
  modules: [
    {
      id: 'studio-os',
      name: 'Duck Studio OS',
      status: 'core',
      version: '0.2.1',
      capabilities: ['dashboard', 'crm', 'projects', 'versions', 'finance', 'automation', 'plugins', 'audit', 'analytics'],
      permissions: ['database:read', 'database:write', 'audit:append'],
      healthPath: '/api/health',
    },
    {
      id: 'ecosystem',
      name: 'Duck Ecosystem',
      status: 'ready',
      version: '1.0.0',
      capabilities: ['routers', 'contracts', 'tests'],
      permissions: ['api:read'],
    },
    {
      id: 'portal-clientes',
      name: 'Portal de Clientes',
      status: 'adapter',
      version: '1.0.0',
      capabilities: ['client-view', 'deliverables', 'messages', 'mobile', 'desktop'],
      permissions: ['projects:read', 'files:read', 'messages:write'],
    },
    {
      id: 'gema-toolkit',
      name: 'Gema Toolkit',
      status: 'asset',
      version: '1.0.0',
      capabilities: ['tuner', 'mastering', 'narrative-experience'],
      permissions: [],
    },
    {
      id: 'experiencia-inmersiva',
      name: 'Experiencia Inmersiva',
      status: 'asset',
      version: '1.0.0',
      capabilities: ['gsap', 'lenis', 'visual-storytelling'],
      permissions: [],
    },
  ] satisfies UnifiedModule[],
} as const

export function getUnifiedCapabilities() {
  return {
    protocol: UNIFIED_MANIFEST.protocol,
    modules: UNIFIED_MANIFEST.modules.map((module) => ({
      id: module.id,
      name: module.name,
      status: module.status,
      version: module.version,
      capabilities: module.capabilities,
      permissions: module.permissions,
      healthPath: module.healthPath ?? null,
    })),
  }
}
