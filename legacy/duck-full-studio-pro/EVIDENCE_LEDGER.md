# Livro de Evidências — DUCK Studio Pro

Este documento cataloga de forma transparente lo que está probado y lo que es pendiente en el repositorio.

## Matriz de Verificación

| Recurso | ¿Está conectado a Base de Datos SQL / Drizzle? | ¿Tiene pruebas unitarias? | ¿Funciona de extremo a extremo sin simulación? |
|---|---|---|---|
| **Autenticación (OAuth)** | Sí (`users` table) | Sí (`auth.logout.test.ts`) | Sí (Flujo Manus OAuth) |
| **Proyectos de Estúdio** | No (Devuelve array estático en tRPC) | No | Parcial (Interfaz visual operativa) |
| **Vault de Plugins (400)** | No (Array en memoria tRPC) | No | Parcial (Buscador y listado visual) |
| **Portal de Clientes** | No (Estático en tRPC) | No | Parcial (Vista y enlaces de ejemplo) |
| **Asistente CoLab (IA)** | No (Reglas if/else en tRPC) | Sí (`duck.test.ts`) | Parcial (Chat interactivo simulado) |
| **Subida de Stems a S3** | No | No | Pendiente (Requiere credenciales y bucket activo) |
