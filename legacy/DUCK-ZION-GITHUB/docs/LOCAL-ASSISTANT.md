# Asistente local de diálogo

## Diseño

El paquete incorpora un modo **local-only** para conversaciones sobre producción musical. La ruta `POST /api/local-assistant/chat` solo intenta conectarse al endpoint loopback configurado en `LOCAL_LLM_BASE_URL`; si no está disponible, devuelve un error controlado y no utiliza una alternativa remota.

La opción inicial es **Qwen2.5-0.5B-Instruct en GGUF**, ejecutado mediante un servidor local compatible con OpenAI, como `llama.cpp`. El modelo es pequeño, adecuado para diálogo breve y con licencia Apache-2.0 según su ficha pública [1]. La calidad será limitada frente a modelos grandes; el sistema compensa parcialmente mediante una base local curada de producción musical, historial corto, temperatura baja y preguntas de aclaración.

| Elemento | Configuración |
|---|---|
| Modelo inicial | `Qwen2.5-0.5B-Instruct-GGUF` |
| Endpoint | `http://127.0.0.1:8080/v1` |
| Uso | Solo diálogo educativo; no ejecuta herramientas |
| Conocimiento | `src/lib/music-knowledge.ts` |
| Historial | Máximo 12 mensajes, truncados a 4.000 caracteres |
| Salida | Máximo 500 tokens por respuesta |
| Auditoría | `AuditLog` con modo, modelo, conocimiento, tamaño de mensaje y errores; no se guarda el texto completo en el log |
| Privacidad | Sin fallback remoto y sin llamadas de red desde el cliente local |

## Arranque conceptual

Se debe descargar el modelo desde su fuente oficial, verificar el hash del archivo y ejecutar un servidor local de inferencia. El paquete no descarga pesos automáticamente ni ejecuta binarios por seguridad. La configuración queda en `.env` local y la plantilla pública solo contiene loopback y nombres de modelo.

```bash
export LOCAL_LLM_BASE_URL=http://127.0.0.1:8080/v1
export LOCAL_LLM_MODEL=Qwen2.5-0.5B-Instruct-GGUF
```

La interfaz de Duck arranca en modo local por defecto y permite alternar al asistente existente. Para una política de privacidad máxima se recomienda mantener siempre el modo local y bloquear salidas externas del proceso mediante firewall o perfil de ejecución.

## Límites de conocimiento

El asistente no afirma haber escuchado audio, no inventa compatibilidad de plugins y no puede instalar, mover o ejecutar archivos. La base local contiene principios de ganancia, dinámica, EQ, estéreo, profundidad, flujo de mezcla y criterios de verificación. Las recomendaciones deben validarse escuchando, comparando a nivel igualado y revisando la traducción en distintos sistemas.

## Fuentes

[1]: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct "Qwen2.5-0.5B-Instruct — Hugging Face"
[2]: https://github.com/ggml-org/llama.cpp "llama.cpp — inferencia local GGUF"
