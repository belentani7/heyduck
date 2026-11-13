# Hallazgos de investigación externa — corte 2026-08-18

## Tailwind CSS + Vite
La documentación oficial de Tailwind CSS muestra que la integración recomendada con Vite usa `tailwindcss` y `@tailwindcss/vite`, configura el plugin en `vite.config.ts` e importa `@import "tailwindcss"` en el CSS. La documentación consultada expone Tailwind CSS v4.3 en su selector de versión. Fuente: https://tailwindcss.com/docs/installation/using-vite

## Core Web Vitals
La guía oficial de web.dev mantiene como métricas Core Web Vitals a LCP, CLS e INP; INP sustituyó a FID como métrica estable en 2024. La validación de rendimiento deberá medir resultados reales o de laboratorio y reportar los valores, no asumir que un objetivo se cumple por configuración. Fuente: https://web.dev/articles/vitals

## Implicaciones para Duck
El proyecto actual ya usa Tailwind 4 + Vite, por lo que la dirección del scaffold es compatible con la documentación actual. La auditoría debe tratar el HTML de Drive como referencia visual y de contenido, pero eliminar dependencias CDN innecesarias, evitar imágenes base64 gigantes, usar assets comprimidos por URL de ciclo de vida y validar LCP/CLS/INP con evidencia.

## Estado de Drive
El inventario accesible contiene 913 carpetas, 62 archivos de texto, 6 ZIP, 3 Markdown, 3 Google Docs, 2 HTML y otros archivos. Los archivos Duck relevantes son `DUCK-2026-ACTUALIZADO.html`, `DUCK-INTEGRADO-0-10.html`, `DUCK-2026-INVENTARIO-Y-PLUGINS.md` y `DUCK-INTEGRADO-0-10.md`. La documentación de Drive advierte que GSAP, ScrollTrigger, ScrollToPlugin y Lenis se cargan por CDN; no están fijados localmente. También afirma que varios módulos y plugins OpenCode mencionados no fueron encontrados y no deben declararse instalados.

## Limitaciones de veracidad
Los documentos de Drive contienen afirmaciones aspiracionales de 0 a 10 y recomendaciones de backend, pero no son evidencia de que una web-static tenga backend, autenticación, base de datos, observabilidad o cumplimiento implementados. El informe final debe separar implementado, recomendado y no verificable.

## Fuentes de investigación adicionales pendientes
Consultar documentación oficial de Vite, React, OWASP ASVS, WCAG 2.2, npm/GitHub y fuentes de licencias de assets antes de cerrar la auditoría.

## Persistencia moderna

La documentación oficial consultada de PostgreSQL expone PostgreSQL 18.6 como versión actual de la documentación principal, junto con ramas soportadas 17, 16, 15 y 14. La guía cubre integridad SQL, índices, autenticación, backup/restore, alta disponibilidad, replicación y monitorización; por ello es una elección adecuada para usuarios, proyectos, pedidos de producción y metadatos relacionales si Duck evoluciona a full-stack. Fuente: https://www.postgresql.org/docs/current/index.html

La documentación oficial de Redis describe Redis 8.4 con mejoras de migración atómica de slots, operaciones de cadenas con compare-and-set, expiraciones multi-clave, stream processing con grupos de consumidores y búsqueda híbrida. Es una buena capa complementaria para caché, rate limiting y jobs, no un reemplazo automático de la base relacional. Fuente: https://redis.io/docs/latest/develop/whats-new/8-4/

## Decisión para este checkpoint

Duck sigue siendo `web-static`: no se añade PostgreSQL, Redis, colas ni autenticación ficticia. La recomendación de backend queda documentada como fase futura. Un 10/10 de backend no es defendible mientras el proyecto no tenga backend real, migraciones, pruebas y observabilidad implementadas.
