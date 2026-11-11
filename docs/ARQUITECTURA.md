

<!-- repo-forge:docs-arquitectura:inicio -->
# Arquitectura

## Tipo

sitio estático publicable tal cual

## Piezas observadas

| Pieza | Evidencia |
|---|---|
| Lenguajes | JavaScript 64.3%, HTML 26.0%, Markdown 5.8%, CSS 2.2%, JSON 1.4%, Python 0.3% |
| Puntos de entrada | ninguno detectado |
| Páginas HTML | 8 |
| Tests | 3 archivos |
| Dependencias de paquete | 0 |

## Capas propuestas

```text
contenido/      datos y textos versionados
plataforma/     ficha, diseño y contrato del producto
brand/          tokens, marca y activos
scripts/        verificación y operación
tests/          pruebas ejecutables
```

La propuesta no mueve archivos existentes: describe dónde debe vivir lo nuevo para que
el repositorio siga siendo legible.

## Deuda declarada

- 6 lenguajes: coste de contexto alto.

<!-- repo-forge:arquitectura -->
<!-- repo-forge:docs-arquitectura:fin -->
