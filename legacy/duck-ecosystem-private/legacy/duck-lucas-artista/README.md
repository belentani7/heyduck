# Duck — Lucas, produtor musical e artista

Landing page editorial para **Lucas**, conocido artísticamente como **Duck**. El sitio presenta su trayectoria, créditos de portafolio, servicios de producción y canales de contacto desde Aracaju, con la conexión territorial Recife–Aracaju indicada por el artista.

## Dirección de producto

La experiencia sigue una dirección de archivo de artista: verde floresta, crema y verde-lima de señal; fotografía personal; tipografía compacta; y una composición que funciona como una ficha musical contemporánea. El lenguaje está escrito para una persona creadora, no para una empresa o un estudio genérico.

La biografía pública usada como base indica que Lucas comenzó en la música a los 12 años, estudió guitarra y teoría musical en el Conservatorio de Música de Sergipe entre los 14 y 16 años, aprendió a grabar y producir en casa a los 17, empezó a lanzar canciones a los 19 y compró su primer curso de producción en 2021. La fuente pública principal es [duck.46graus.com](https://duck.46graus.com/).

## Qué incluye

La página principal presenta el nombre artístico y el nombre real, la trayectoria autodidacta, el proceso de trabajo y los canales directos de Duck. La ruta `/singles` convierte el portafolio en un archivo de objetos: portadas públicas, discos de vinilo que salen parcialmente del sleeve, zoom de puntero y enlaces directos a YouTube o Spotify. La ruta `/studio` ofrece un playground local con pads sintéticos, mesa de filtro/espacio/ganho, visualizador de nivel, activación explícita del micrófono, grabación WebM local y un generador de apenas dos estrofas de inspiración.

La comunicación explica la escucha en capas como una forma artística y técnica de percibir timbre, frecuencia, dinámica, espacio e intención. No presenta esa expresión como diagnóstico médico ni como afirmación sobrenatural. Tampoco inventa testimonios, reseñas ni logos de clientes; los créditos se muestran como información de portafolio y distinguen las funciones realizadas en cada trabajo.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Wouter
- Lucide React
- GSAP 3.15 para el movimiento de las capas de vinilo
- Canvas WebGL/GLSL con fallback CSS para la atmósfera procedural
- Web Audio API y MediaRecorder para el Studio local
- Manus WebDev static hosting

## Desarrollo local

```bash
pnpm install
pnpm dev
```

## Validación

```bash
pnpm check
pnpm build
```

## Estructura principal

```text
client/
  index.html
  src/
    App.tsx
    index.css
    components/ShaderBackdrop.tsx
    pages/Home.tsx
    pages/Singles.tsx
    pages/Studio.tsx
ideas.md
research_duck.md
technical_research.md
expansion_validation.md
README.md
todo.md
```

## Rutas públicas

| Ruta | Propósito |
| --- | --- |
| `/` | Perfil personal de Lucas/Duck y contacto |
| `/singles` | Archivo de portafolio con sleeves y vinilos interactivos |
| `/studio` | Playground local de pads, efectos, voz e inspiración lírica |

El Studio requiere una acción del usuario antes de activar audio o micrófono. El micrófono no se sube a ningún servicio y el generador lírico produce únicamente fragmentos breves para inspiración.

Los activos oficiales de Duck se referencian por URLs permanentes del almacenamiento del proyecto. Las imágenes no se guardan dentro de `client/public`.
