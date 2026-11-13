'use client'

import { useEffect, useState } from 'react'
import { Boxes, CheckCircle2, LockKeyhole, Sparkles, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Module = {
  id: string
  name: string
  status: 'core' | 'ready' | 'adapter' | 'asset'
  version: string
  capabilities: string[]
  permissions: string[]
  healthPath: string | null
}

const statusLabel: Record<Module['status'], string> = {
  core: 'Núcleo',
  ready: 'Listo',
  adapter: 'Adaptador',
  asset: 'Activo',
}

export function UnifiedEcosystemView() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/unified', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('manifest unavailable')))
      .then((payload) => setModules(payload.modules ?? []))
      .catch(() => setModules([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[oklch(0.82_0.29_145/0.25)] bg-gradient-to-br from-[oklch(0.18_0.04_150)] via-card to-background p-6 sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[oklch(0.82_0.29_145/0.10)] blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-[oklch(0.82_0.29_145/0.4)] text-[oklch(0.85_0.32_145)]">DUCK ZION UNIFIED · v1</Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ecosistema unificado</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Una sola superficie para Studio OS, Portal de Clientes, automatizaciones, plugins y experiencias Gema. Cada módulo declara capacidades y permisos antes de conectarse.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
            <Activity className="h-4 w-4 text-[oklch(0.82_0.29_145)]" />
            <span>{loading ? 'Sincronizando manifiesto…' : `${modules.length} módulos declarados`}</span>
          </div>
        </div>
      </section>

      {modules.length === 0 && !loading ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">El manifiesto no está disponible.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="group border-border/60 bg-card/70 transition-colors hover:border-[oklch(0.82_0.29_145/0.35)]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[oklch(0.82_0.29_145/0.12)] p-2.5 text-[oklch(0.85_0.32_145)]"><Boxes className="h-5 w-5" /></div>
                    <div><CardTitle className="text-base">{module.name}</CardTitle><p className="mt-1 font-mono text-[10px] text-muted-foreground">{module.id} · {module.version}</p></div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{statusLabel[module.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">{module.capabilities.map((capability) => <Badge key={capability} variant="outline" className="text-[10px] font-normal">{capability}</Badge>)}</div>
                <div className="flex items-center gap-2 border-t border-border/50 pt-3 text-[11px] text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" /><span>{module.permissions.length ? module.permissions.join(' · ') : 'Sin permisos de backend'}</span><CheckCircle2 className="ml-auto h-3.5 w-3.5 text-[oklch(0.82_0.29_145)]" /></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-xs text-muted-foreground"><Sparkles className="h-4 w-4 text-[oklch(0.82_0.29_145)]" />La instalación de plugins y automatizaciones requiere manifest, permisos mínimos, health check y registro de auditoría.</div>
    </div>
  )
}
