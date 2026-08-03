# DUCK — PLAN DE 2000 PASOS REALES
## Portfolio Musical Interactivo — Finalización completa
## Archivo base: 02-DUCK-FUSIONADO-26-07-2026.html (candidato a definitivo)
## Metodología: Plan-Execute-Verify (PEV) con quality gates por fase
## Inicio: 2026-08-01

**Reglas de ejecución:**
1. Un paso a la vez. Nunca avanzar sin verificar el paso anterior.
2. Cada paso termina con [OK] o [FAIL]. Si [FAIL], corregir antes del siguiente.
3. Al cerrar cada fase de 100 pasos, correr su GATE de verificación completo.
4. Cada fase se ejecuta en sesión fresca, con este plan como único input de contexto.
5. No marcar completado sin evidencia (verificación fresca, no suposición).
6. Backup de `config.toml` y del HTML base antes de tocar nada.

---

# FASE 1: AUDITORÍA Y FUNDACIÓN (1-100)

## 1A. Inventario de versiones (1-30)
1. Inventariar las 43 versiones HTML en `DUCK/` y catalogar fecha, tamaño y estado. Criterio: tabla con 43 filas.
2. Abrir `02-DUCK-FUSIONADO-26-07-2026.html` y verificar que carga sin errores en consola. Criterio: 0 errores JS.
3. Comparar `02-DUCK-FUSIONADO-COMPLETO.html` vs `02-DUCK-FUSIONADO-26-07-2026.html`. Criterio: diff listado por sección.
4. Comparar `34-02-02-Duck-Definitive-INDEX.html` vs la versión fusionada reciente. Criterio: 1 ganador documentado.
5. Comparar `33-03-03-DUCK-MASTER.html` vs la fusionada. Criterio: sección faltante documentada.
6. Comparar `DUCK-MASTER-ULTIMATE-21SRT.html` vs la fusionada. Criterio: extras detectados documentados.
7. Extraer todas las secciones presentes en la versión elegida como base. Criterio: lista ordenada de <section>.
8. Listar todos los archivos CSS que referencia la base. Criterio: rutas existentes validadas.
9. Listar todos los archivos JS que referencia la base. Criterio: rutas existentes validadas.
10. Listar todas las imágenes referenciadas en la base. Criterio: cada src existe en disco.
11. Contar líneas del HTML base. Criterio: número exacto registrado.
12. Contar líneas de CSS inline. Criterio: número exacto registrado.
13. Contar líneas de JS inline. Criterio: número exacto registrado.
14. Detectar HTML malformado con validador (ej. Nu validator online o parseo). Criterio: errores listados.
15. Detectar etiquetas sin cerrar. Criterio: lista de líneas problemáticas.
16. Detectar atributos duplicados en un mismo elemento. Criterio: 0 o lista.
17. Detectar IDs duplicados en el documento. Criterio: 0 duplicados.
18. Detectar selectores CSS duplicados. Criterio: lista de duplicados.
19. Detectar funciones JS duplicadas. Criterio: lista de duplicados.
20. Detectar variables globales que colisionan (window.*). Criterio: lista de colisiones.
21. Registrar el tamaño en KB del HTML base. Criterio: peso registrado.
22. Registrar el peso total de CSS. Criterio: suma en KB.
23. Registrar el peso total de JS. Criterio: suma en KB.
24. Registrar el peso total de imágenes. Criterio: suma en KB.
25. Registrar el peso total de fuentes. Criterio: suma en KB.
26. Hacer backup byte-a-byte de la versión base elegida. Criterio: copia con hash SHA256 idéntico.
27. Hacer backup de `data.js` actual. Criterio: copia con hash idéntico.
28. Hacer backup de todos los CSS externos actuales. Criterio: copias verificadas.
29. Hacer backup de todos los JS externos actuales. Criterio: copias verificadas.
30. Crear `BACKUPS/` y mover los backups con prefijo de fecha. Criterio: carpeta con 5+ backups.

## 1B. Estado real de datos (31-60)
31. Abrir `data.js` y listar todas las claves raíz. Criterio: lista completa de exports.
32. Contar tracks reales en `DUCK_TRACKS`. Criterio: número >= 32.
33. Validar que cada track tiene nombre no vacío. Criterio: 0 vacíos.
34. Validar que cada track tiene artista o role. Criterio: 0 sin role.
35. Validar que cada track tiene URL de YouTube válida (formato). Criterio: todas matchean regex de YT.
36. Validar que cada track tiene año. Criterio: 0 sin año.
37. Validar que cada track tiene género. Criterio: 0 sin género.
38. Listar tracks sin cover referenciado. Criterio: lista con rutas faltantes.
39. Verificar que todos los covers existen en `images/covers/`. Criterio: 100% existentes o placeholders planeados.
40. Registrar tamaños de covers (KB). Criterio: tabla cover→KB.
41. Identificar covers > 500KB (a optimizar). Criterio: lista.
42. Identificar covers en formato no WebP. Criterio: lista de extensiones.
43. Verificar que no hay tracks duplicados (mismo title+artist). Criterio: 0 duplicados.
44. Verificar que no quedan restos de `DUCK_SINGLES`. Criterio: grep 0 coincidencias.
45. Verificar que `renderSingles()` fue eliminado. Criterio: grep 0 coincidencias.
46. Verificar que la sección HTML "singles" fue eliminada. Criterio: grep 0 coincidencias.
47. Confirmar nombres reales de las faixas del portfolio (Leones, Mayzer Gafur Menm, Chrislops ft. Soy Guchi, Hancornia). Criterio: data.js con nombres reales.
48. Confirmar roles por track (producer/mixer/master). Criterio: cada track con role coherente.
49. Verificar integración con portfolio 46graus (tracks faltantes). Criterio: gap list documentado.
50. Agregar género "funk" a tracks donde aplique. Criterio: tracks marcados.
51. Agregar año a tracks sin año. Criterio: 0 sin año.
52. Reemplazar covers placeholder genéricos por covers reales. Criterio: 0 placeholders genéricos en discografía.
53. Validar sintaxis de `data.js` con node --check. Criterio: sin errores de sintaxis.
54. Validar que `data.js` carga en navegador. Criterio: window.DATA existe.
55. Crear test: renderTracks() pinta N tracks donde N = length de DUCK_TRACKS. Criterio: coincidencia exacta.
56. Crear test: filtros de género devuelven solo tracks del género. Criterio: 100% de coincidencia.
57. Crear test: orden por fecha es descendente. Criterio: fechas decrecientes.
58. Crear test: búsqueda por texto devuelve coincidencias. Criterio: matches esperados.
59. Documentar el modelo de datos definitivo (shape de track). Criterio: schema en MD.
60. Congelar `data.js` como fuente única de verdad. Criterio: comentario en cabecera.

## 1C. Requisitos y criterios (61-90)
61. Redactar la definición de "web terminada" (done criteria global). Criterio: lista de 10 criterios.
62. Definir audiencia objetivo (fans de música, sellos, productores). Criterio: 1 párrafo.
63. Definir objetivo de la web (portfolio + branding + booking). Criterio: 1 frase clara.
64. Definir las 4 secciones obligatorias de contenido. Criterio: lista validada.
65. Definir las 4 funcionalidades interactivas obligatorias. Criterio: lista validada.
66. Definir los 4 idiomas soportados (PT/ES/EN/FR). Criterio: lista fijada.
67. Definir el modelo de modelo base (config del TUI). Criterio: config registrada.
68. Definir navegadores objetivo (Chrome, Firefox, Safari, Edge). Criterio: lista fijada.
69. Definir breakpoints objetivo (mobile/tablet/desktop/ultra-wide). Criterio: valores en px fijados.
70. Definir nota mínima de Lighthouse (perf/a11y/best-practices/SEO). Criterio: >= 90 cada uno.
71. Definir WCAG nivel AA como requisito de accesibilidad. Criterio: escrito en requisitos.
72. Definir criterio de rendimiento (LCP < 2.5s, CLS < 0.1, INP < 200ms). Criterio: escrito.
73. Definir criterio de SEO (Rich Results válido). Criterio: escrito.
74. Definir criterio de i18n (todas las claves en los 4 idiomas). Criterio: escrito.
75. Definir criterio de audio (Web Audio funciona sin errores). Criterio: escrito.
76. Definir criterio de PWA (SW registrado, offline básico). Criterio: escrito.
77. Definir criterio de seguridad (sin keys expuestas, CSP básica). Criterio: escrito.
78. Definir criterio de contenido (copy revisado y sin typos). Criterio: escrito.
79. Listar riesgos técnicos conocidos (Web Audio en mobile, WebGL en low-end). Criterio: 5+ riesgos.
80. Listar dependencias externas actuales (GSAP, Lenis, Three.js, etc.). Criterio: versión de cada una.
81. Evaluar si conviene mantener librerías vía CDN o local. Criterio: decisión con motivo.
82. Evaluar si el proyecto migra a build tooling (Vite) o se queda estático. Criterio: decisión documentada.
83. Verificar que no se rompe nada si se quita una librería no usada. Criterio: grep de uso.
84. Documentar la decisión de arquitectura (estático multi-archivo vs single-file). Criterio: 1 párrafo.
85. Definir la estructura de carpetas objetivo. Criterio: árbol en MD.
86. Definir convención de nombres de archivos. Criterio: regla escrita.
87. Definir convención de nombres de clases CSS (BEM). Criterio: regla escrita.
88. Definir convención de nombres de funciones JS (camelCase). Criterio: regla escrita.
89. Definir convención de commits (si hay git). Criterio: formato escrito.
90. Crear `docs/REQUISITOS.md` con todo lo anterior. Criterio: archivo completo.

## 1D. Setup de trabajo (91-100)
91. Confirmar que la carpeta de trabajo tiene espacio libre. Criterio: > 1GB libre.
92. Verificar que node existe (node --version). Criterio: v18+.
93. Verificar que git existe (git --version). Criterio: v2.30+.
94. Inicializar o confirmar repo git en la carpeta de trabajo. Criterio: git status funciona.
95. Crear commit inicial de backup (si git). Criterio: commit "chore: baseline 2000-pasos".
96. Crear el índice del plan (tabla de fases). Criterio: archivo con 20 filas.
97. Crear `docs/PROGRESO.md` para tracking de pasos. Criterio: archivo con checkbox de fases.
98. Crear `docs/ERRORES.md` para registrar fallos. Criterio: archivo con plantilla.
99. Crear `docs/DECISIONES.md` para registrar decisiones de arquitectura. Criterio: archivo con plantilla.
100. **GATE FASE 1**: verificar que backups existen, data.js validada, requisitos escritos, repo listo. Criterio: 4/4 OK.

---

# FASE 2: ARQUITECTURA Y ESTRUCTURA (101-200)

## 2A. Estructura de archivos (101-130)
101. Crear la estructura de carpetas objetivo. Criterio: árbol creado.
102. Crear `css/` con subcarpetas por módulo. Criterio: existe.
103. Crear `js/` con subcarpetas por módulo. Criterio: existe.
104. Crear `images/` con subcarpetas (covers, projects, studio, logos). Criterio: existen.
105. Crear `fonts/` para fuentes locales. Criterio: existe.
106. Crear `assets/` para misceláneos. Criterio: existe.
107. Crear `docs/` para documentación. Criterio: existe.
108. Mover `data.js` a `js/data.js`. Criterio: paths actualizados en HTML.
109. Extraer CSS inline del HTML a `css/main.css`. Criterio: HTML sin <style>.
110. Extraer JS inline del HTML a `js/main.js`. Criterio: HTML sin <script> salvo carga.
111. Verificar que el HTML sigue cargando tras extracción. Criterio: 0 errores consola.
112. Separar CSS de diseño base en `css/base.css`. Criterio: archivo coherente.
113. Separar CSS de layout en `css/layout.css`. Criterio: archivo coherente.
114. Separar CSS de componentes en `css/components.css`. Criterio: archivo coherente.
115. Separar CSS de animaciones en `css/animations.css`. Criterio: archivo coherente.
116. Separar CSS de responsive en `css/responsive.css`. Criterio: archivo coherente.
117. Separar JS de datos en `js/data.js`. Criterio: archivo puro de datos.
118. Separar JS de utilidades en `js/utils.js`. Criterio: funciones helpers.
119. Separar JS de audio en `js/audio.js`. Criterio: Web Audio centralizado.
120. Separar JS de instrumentos en `js/instruments.js`. Criterio: piano/rhythm/synth.
121. Separar JS de animaciones en `js/animations.js`. Criterio: GSAP/scroll.
122. Separar JS de i18n en `js/i18n.js`. Criterio: diccionarios y switcher.
123. Separar JS de init en `js/main.js`. Criterio: solo bootstrap.
124. Verificar orden de carga de scripts (utils→data→audio→instruments→animations→i18n→main). Criterio: consola 0 errores.
125. Verificar que las funciones no dependen de orden circular. Criterio: init sin ReferenceError.
126. Mover imágenes sueltas a `images/`. Criterio: rutas actualizadas.
127. Mover logos a `images/logos/`. Criterio: rutas actualizadas.
128. Mover covers a `images/covers/`. Criterio: rutas actualizadas.
129. Mover projects a `images/projects/`. Criterio: rutas actualizadas.
130. Mover studio a `images/studio/`. Criterio: rutas actualizadas.

## 2B. Configuración de build (131-150)
131. Decidir tooling (estático puro o Vite). Criterio: decisión registrada en DECISIONES.md.
132. Si Vite: crear `package.json`. Criterio: npm init válido.
133. Si Vite: instalar vite como devDependency. Criterio: package-lock presente.
134. Si Vite: configurar `vite.config.js`. Criterio: build base funciona.
135. Si Vite: mover HTML base a `index.html` raíz. Criterio: dev server carga.
136. Si Vite: configurar paths públicos. Criterio: assets resueltos.
137. Si Vite: configurar base URL para deploy. Criterio: build sin 404 de assets.
138. Si Vite: configurar minificación. Criterio: build produce dist/.
139. Si Vite: configurar source maps solo dev. Criterio: dist sin .map.
140. Si Vite: configurar tree shaking. Criterio: bundle no incluye código muerto.
141. Si estático: definir concatenación manual de CSS. Criterio: orden documentado.
142. Si estático: definir concatenación manual de JS. Criterio: orden documentado.
143. Crear script `npm run build` (o script equivalente). Criterio: comando corre.
144. Crear script `npm run preview` (o `serve`). Criterio: sirve el build.
145. Crear script `npm run lint` para HTML/CSS/JS. Criterio: pasa o lista warnings.
146. Crear script `npm run test` (tests unitarios mínimos). Criterio: corre.
147. Crear script `npm run a11y` (checks de accesibilidad). Criterio: corre.
148. Configurar `.gitignore` (node_modules, dist, .env). Criterio: git status limpio.
149. Configurar `.editorconfig`. Criterio: indentación consistente.
150. Configurar `.prettierrc` si aplica. Criterio: formateo consistente.

## 2C. Dependencias (151-170)
151. Auditar librerías actuales (GSAP, Lenis, Three.js, etc.). Criterio: lista con versiones.
152. Verificar que cada librería se usa realmente. Criterio: grep de cada import.
153. Eliminar librerías sin uso. Criterio: 0 referencias tras eliminar.
154. Decidir CDN vs local para cada librería. Criterio: tabla por librería.
155. Si CDN: agregar SRI (integrity) a cada script. Criterio: atributos integrity válidos.
156. Si local: descargar y referenciar archivos locales. Criterio: 200 al cargar.
157. Actualizar GSAP a la última estable si está en uso. Criterio: version check.
158. Actualizar Lenis a última estable si está en uso. Criterio: version check.
159. Actualizar Three.js a última estable si está en uso. Criterio: version check.
160. Verificar compatibilidad de las librerías actualizadas con el código existente. Criterio: 0 errores consola.
161. Verificar licencias de cada librería. Criterio: lista con licencia.
162. Verificar peso agregado de librerías (KB). Criterio: tabla.
163. Marcar librerías críticas que bloquean render. Criterio: lista.
164. Planear carga diferida (defer) de librerías no críticas. Criterio: script atributos definidos.
165. Verificar que el carrusel del hero funciona con librerías actualizadas. Criterio: test manual.
166. Verificar que las animaciones de scroll funcionan. Criterio: test manual.
167. Verificar que Web Audio no depende de librerías rotas. Criterio: test manual.
168. Verificar que el 3D (si existe) renderiza. Criterio: canvas con contenido.
169. Registrar versiones finales en `docs/DEPENDENCIAS.md`. Criterio: archivo completo.
170. Congelar dependencias (sin updates durante ejecución del plan). Criterio: nota en docs.

## 2D. Lint y calidad base (171-190)
171. Correr linter de HTML sobre el documento. Criterio: 0 errores o lista.
172. Correr linter de CSS. Criterio: 0 errores o lista.
173. Correr linter de JS. Criterio: 0 errores o lista.
174. Corregir todos los errores de HTML reportados. Criterio: re-run 0 errores.
175. Corregir todos los errores de CSS reportados. Criterio: re-run 0 errores.
176. Corregir todos los errores de JS reportados. Criterio: re-run 0 errores.
177. Eliminar código muerto en JS (funciones no llamadas). Criterio: grep 0 referencias muertas.
178. Eliminar variables no usadas. Criterio: linter 0 warnings.
179. Eliminar console.log de debug. Criterio: grep 0 (o centralizados).
180. Unificar comillas y punto y coma en JS. Criterio: prettier aplicado.
181. Unificar indentación en HTML. Criterio: consistente.
182. Unificar indentación en CSS. Criterio: consistente.
183. Eliminar comentarios de debug en HTML. Criterio: grep 0.
184. Eliminar comentarios de debug en CSS. Criterio: grep 0.
185. Eliminar comentarios de debug en JS. Criterio: grep 0.
186. Revisar que no hay rutas absolutas locales (C:\). Criterio: grep 0 en producción.
187. Revisar que no hay credenciales en el código. Criterio: grep de api_key/token.
188. Revisar que no hay datos de usuario reales (mails) hardcodeados salvo contacto. Criterio: lista auditada.
189. Revisar que los atributos alt/aria no tienen texto placeholder "lorem". Criterio: grep 0.
190. Registrar resultados de lint en `docs/LINT.md`. Criterio: archivo con resumen.

## 2E. Estructura semántica (191-200)
191. Verificar doctype `<!DOCTYPE html>`. Criterio: línea 1 correcta.
192. Verificar `<html lang>` correcto (pt-BR). Criterio: atributo presente.
193. Verificar charset UTF-8 en head. Criterio: meta presente.
194. Verificar viewport meta correcto. Criterio: content válido.
195. Verificar orden de head (charset, viewport, title, meta, links, scripts). Criterio: orden correcto.
196. Verificar que existe una sola etiqueta `<main>`. Criterio: 1 sola.
197. Verificar que existe una sola `<header>` principal. Criterio: 1 sola.
198. Verificar que existe una sola `<footer>`. Criterio: 1 sola.
199. Verificar que las secciones usan `<section>` con `aria-labelledby`. Criterio: todas etiquetadas.
200. **GATE FASE 2**: estructura modular creada, build configurado, lint limpio, semántica OK. Criterio: 4/4 OK.

---

# FASE 3: DESIGN SYSTEM Y TOKENS (201-300)

## 3A. Tokens de color (201-220)
201. Definir paleta base en CSS variables (raíz). Criterio: `:root` con variables.
202. Definir color de fondo principal (dark). Criterio: variable `--color-bg`.
203. Definir color de fondo secundario. Criterio: variable `--color-bg-2`.
204. Definir color de superficie/cards. Criterio: variable `--color-surface`.
205. Definir color de texto primario. Criterio: variable `--color-text`.
206. Definir color de texto secundario. Criterio: variable `--color-text-2`.
207. Definir color de acento 1 (primary). Criterio: variable `--color-accent`.
208. Definir color de acento 2 (secundario). Criterio: variable `--color-accent-2`.
209. Definir color de estado success. Criterio: variable `--color-success`.
210. Definir color de estado warning. Criterio: variable `--color-warning`.
211. Definir color de estado danger. Criterio: variable `--color-danger`.
212. Verificar contraste de texto sobre fondo (WCAG AA). Criterio: ratio >= 4.5:1.
213. Verificar contraste de acento sobre fondo. Criterio: ratio documentado.
214. Definir variantes hover de cada color. Criterio: variables `--color-*-hover`.
215. Definir variantes active de cada color. Criterio: variables `--color-*-active`.
216. Definir color de border/borde general. Criterio: variable `--color-border`.
216b. Definir color de overlay (backdrop). Criterio: variable `--color-overlay`.
217. Definir color de focus ring. Criterio: variable `--color-focus`.
218. Definir color de selección de texto. Criterio: `::selection` con variable.
219. Documentar la paleta en `docs/TOKENS.md`. Criterio: tabla de colores.
220. Verificar que no hay colores hardcodeados en CSS fuera de tokens. Criterio: grep 0 hex fuera de tokens.

## 3B. Tokens de tipografía (221-240)
221. Definir escala tipográfica (1.25 modular scale). Criterio: variables `--fs-*`.
222. Definir tamaño base (16px). Criterio: variable `--fs-base`.
223. Definir fuente principal (display). Criterio: variable `--font-display`.
224. Definir fuente secundaria (body). Criterio: variable `--font-body`.
225. Definir fuente mono (si aplica). Criterio: variable `--font-mono`.
226. Verificar licencias de las fuentes. Criterio: docs con licencia.
227. Cargar fuentes de forma local o CDN con preconnect. Criterio: fuentes cargan.
228. Definir pesos de fuente usados (400/700/900). Criterio: cargados.
229. Definir line-height base (1.5). Criterio: variable `--lh-base`.
230. Definir line-height headings (1.1). Criterio: variable `--lh-heading`.
231. Definir letter-spacing para headings. Criterio: variable `--ls-heading`.
232. Definir letter-spacing para labels/uppercase. Criterio: variable `--ls-label`.
233. Definir tamaño h1. Criterio: clamp() con --fs-*.
234. Definir tamaño h2. Criterio: clamp().
235. Definir tamaño h3. Criterio: clamp().
236. Definir tamaño h4. Criterio: variable.
237. Definir tamaño body. Criterio: variable.
238. Definir tamaño small/caption. Criterio: variable.
239. Definir tamaño de botones. Criterio: variable.
240. Verificar que los tamaños responden con clamp() entre breakpoints. Criterio: fluido.

## 3C. Tokens de spacing y layout (241-260)
241. Definir base de spacing (4px). Criterio: variable `--sp-1`.
242. Definir escala de spacing (4,8,12,16,24,32,48,64,96,128). Criterio: variables `--sp-1` a `--sp-10`.
243. Definir container max-width (1200px). Criterio: variable `--container`.
244. Definir container wide (1440px). Criterio: variable `--container-wide`.
245. Definir gutter responsive. Criterio: variable con clamp().
246. Definir grid de 12 columnas. Criterio: utility classes `.col-*`.
247. Definir gap del grid base. Criterio: variable `--gap`.
248. Definir gap de secciones (vertical). Criterio: variable `--section-gap`.
249. Definir breakpoints (mobile 0-640, tablet 641-1024, desktop 1025-1440, ultra 1441+). Criterio: media queries.
250. Definir radius base (8px). Criterio: variable `--radius-sm`.
251. Definir radius medio (16px). Criterio: variable `--radius-md`.
252. Definir radius grande (24px). Criterio: variable `--radius-lg`.
253. Definir radius pill (999px). Criterio: variable `--radius-pill`.
254. Definir sombras (elevation system). Criterio: variables `--shadow-1..4`.
255. Definir z-index scale. Criterio: variables `--z-nav` a `--z-modal`.
256. Definir opacidades útiles (disabled, overlay). Criterio: variables `--op-*`.
257. Definir duraciones de transición. Criterio: variables `--dur-fast/med/slow`.
258. Definir easing functions (ease-out-cubic, ease-in-out). Criterio: variables `--ease-*`.
259. Definir blur tokens (backdrop). Criterio: variables `--blur-sm/md`.
260. Verificar coherencia: sin valores mágicos en componentes. Criterio: grep de px sueltos.

## 3D. Tokens de motion (261-280)
261. Definir duración base de micro-interacciones (150ms). Criterio: variable `--dur-micro`.
262. Definir duración de animaciones UI (300ms). Criterio: variable `--dur-ui`.
263. Definir duración de animaciones hero (600ms). Criterio: variable `--dur-hero`.
264. Definir duración de transiciones de página (800ms). Criterio: variable `--dur-page`.
265. Definir delay de stagger (60ms). Criterio: variable `--stagger`.
266. Definir easing para entradas (ease-out-expo). Criterio: variable `--ease-out-expo`.
267. Definir easing para micro (ease-in-out). Criterio: variable `--ease-micro`.
268. Definir easing para physics (spring). Criterio: documentado para GSAP.
269. Definir comportamiento con `prefers-reduced-motion`. Criterio: media query desactiva motion.
270. Verificar que GSAP usa los tokens de duración. Criterio: grep de dur en animations.js.
271. Verificar que CSS transitions usan tokens de duración. Criterio: grep.
272. Verificar que los delays de stagger usan el token. Criterio: grep.
273. Documentar las curvas de easing. Criterio: tabla en TOKENS.md.
274. Verificar que las animaciones no superan 400ms en UI crítica. Criterio: revisión.
275. Definir comportamiento de animación de scroll (scrub on/off). Criterio: decisión registrada.
276. Definir qué anima con GSAP y qué con CSS. Criterio: matriz en docs.
277. Verificar que micro-interacciones no bloquean interacción. Criterio: test.
278. Verificar que las animaciones no causan layout shift. Criterio: CLS medido tras animar.
279. Aplicar tokens de motion a todas las animaciones existentes. Criterio: 100% cobertura.
280. Congelar tokens de motion. Criterio: nota en TOKENS.md.

## 3E. Componentes base (281-295)
281. Crear componente Button primario. Criterio: `.btn--primary` con hover/active/focus.
282. Crear componente Button secundario. Criterio: `.btn--secondary`.
283. Crear componente Button ghost/outline. Criterio: `.btn--ghost`.
284. Crear componente Badge. Criterio: `.badge` con variantes.
285. Crear componente Card. Criterio: `.card` con padding y radius.
286. Crear componente Card con hover lift. Criterio: transform en hover.
287. Crear componente Input. Criterio: `.input` con focus ring.
288. Crear componente Select. Criterio: `.select` con dropdown.
289. Crear componente Modal base. Criterio: `.modal` con overlay y focus trap.
290. Crear componente Toast. Criterio: `.toast` con variantes.
291. Crear componente Tooltip. Criterio: `.tooltip` con posicionamiento.
292. Crear componente Divider. Criterio: `.divider`.
293. Crear componente Section title. Criterio: `.section-title` con label.
294. Crear componente Container. Criterio: `.container` con widths.
295. Verificar que todos los componentes usan tokens. Criterio: grep 0 hex/px sueltos.

## 3F. Verificación design system (296-300)
296. Correr Lighthouse Performance. Criterio: >= 90.
297. Correr Lighthouse Accessibility. Criterio: >= 90.
298. Correr Lighthouse Best Practices. Criterio: >= 90.
299. Correr Lighthouse SEO. Criterio: >= 90.
300. **GATE FASE 3**: tokens completos, componentes base, Lighthouse 4x90. Criterio: 3/3 OK.

---

# FASE 4: HTML ESTRUCTURA Y SEMÁNTICA (301-400)

## 4A. Head y meta (301-320)
301. Escribir title tag único y < 60 chars. Criterio: `DUCK — Produção Musical`.
302. Escribir meta description < 160 chars. Criterio: concisa y con keywords.
303. Escribir meta keywords (mínimas). Criterio: 5-10 palabras.
304. Escribir meta author. Criterio: DUCK.
305. Escribir meta theme-color. Criterio: coincide con fondo.
306. Escribir canonical URL. Criterio: https://heyduck.netlify.app/.
307. Escribir Open Graph tags (og:title, og:description, og:image, og:url, og:type). Criterio: 5 tags.
308. Escribir Twitter Card tags (summary_large_image). Criterio: 4 tags.
309. Escribir lang alternates (hreflang) para 4 idiomas + x-default. Criterio: 5 tags.
310. Escribir JSON-LD Person (name, jobTitle, sameAs). Criterio: válido.
311. Escribir JSON-LD WebSite. Criterio: válido.
312. Escribir JSON-LD MusicGroup/Artist con releases. Criterio: válido.
313. Escribir JSON-LD BreadcrumbList. Criterio: válido.
314. Validar JSON-LD con schema.org validator. Criterio: 0 errores.
315. Agregar favicon.ico. Criterio: 200 al cargar.
316. Agregar apple-touch-icon. Criterio: presente.
317. Agregar manifest.json (PWA). Criterio: válido y con iconos.
318. Agregar precarga de fuentes críticas. Criterio: `<link rel="preload">`.
319. Agregar dns-prefetch de dominios externos. Criterio: presentes.
320. Agregar preconnect de dominios críticos. Criterio: presentes.

## 4B. Header y nav (321-340)
321. Escribir header semántico con `role="banner"`. Criterio: presente.
322. Escribir logo en header con link a #hero. Criterio: funcional.
323. Escribir nav con lista de links (Inicio, Tracks, Studio, Sobre, Contato). Criterio: 5 links.
324. Verificar que no hay links duplicados en nav. Criterio: 0 duplicados.
325. Agregar skip-to-content link. Criterio: visible en focus.
326. Agregar aria-label al nav. Criterio: presente.
327. Agregar botón hamburguesa móvil con aria-expanded. Criterio: presente.
328. Agregar indicador de idioma en nav. Criterio: switcher visible.
329. Verificar que el header es sticky. Criterio: CSS position sticky.
330. Verificar que el header cambia de fondo al scrollear. Criterio: clase `.is-scrolled`.
331. Verificar que el logo tiene hover state. Criterio: CSS.
332. Verificar que los links de nav tienen active state. Criterio: `.is-active`.
333. Verificar que los links de nav tienen focus-visible. Criterio: CSS.
334. Verificar que el menú móvil cierra al hacer click en link. Criterio: JS.
335. Verificar que el menú móvil cierra al hacer click fuera. Criterio: JS.
336. Verificar que el menú móvil soporta teclado (Esc cierra). Criterio: JS.
337. Verificar que el header no tapa contenido (offset). Criterio: scroll-margin-top.
338. Verificar que el header es accesible en mobile. Criterio: test.
339. Verificar que el logo es legible en todos los temas. Criterio: contraste.
340. Verificar que la nav funciona sin JS. Criterio: fallback anchors.

## 4C. Secciones de contenido (341-360)
341. Escribir hero con `role="region"` y aria-label. Criterio: presente.
342. Escribir sección Tracks con heading h2. Criterio: presente.
343. Escribir sección Studio con heading h2. Criterio: presente.
344. Escribir sección Sobre/About con heading h2. Criterio: presente.
345. Escribir sección Contato/Contact con heading h2. Criterio: presente.
346. Escribir sección de juguetes/instrumentos con heading h2. Criterio: presente.
347. Verificar jerarquía de headings (h1 único, h2 secciones, h3 subsecciones). Criterio: sin saltos.
348. Agregar `aria-labelledby` a cada sección apuntando a su heading. Criterio: todos.
349. Verificar que cada sección tiene id único para anchor. Criterio: 0 duplicados.
350. Verificar que el orden de secciones coincide con el nav. Criterio: 1:1.
351. Verificar que el hero tiene texto introductorio. Criterio: no vacío.
352. Verificar que cada sección tiene copy en los 4 idiomas. Criterio: i18n keys.
353. Verificar que no hay secciones vacías o en construcción. Criterio: 0.
354. Verificar que no hay contenido duplicado entre secciones. Criterio: 0.
355. Verificar que los anchors scrollean suave. Criterio: Lenis o smooth scroll.
356. Verificar que el scroll respeta offset del header. Criterio: destino visible.
357. Verificar que las secciones tienen spacing consistente. Criterio: `--section-gap`.
358. Verificar que las secciones alternan fondos coherentemente. Criterio: visual.
359. Verificar que el contenido no se desborda en mobile. Criterio: 0 overflow horizontal.
360. Verificar que el contenido es legible en ultra-wide (max-width). Criterio: container.

## 4D. Contenido de tracks (361-380)
361. Verificar que la sección Tracks renderiza desde data.js. Criterio: N tracks pintados.
362. Verificar que cada track muestra title. Criterio: texto presente.
363. Verificar que cada track muestra role. Criterio: texto presente.
364. Verificar que cada track muestra año. Criterio: texto presente.
365. Verificar que cada track muestra género. Criterio: badge presente.
366. Verificar que cada track muestra cover. Criterio: imagen visible.
367. Verificar que cada cover tiene alt descriptivo. Criterio: `alt="Cover <title>"`.
368. Verificar que los covers usan loading="lazy". Criterio: atributo.
369. Verificar que los covers tienen dimensiones (aspect-ratio). Criterio: sin CLS.
370. Verificar que los covers usan WebP si existe. Criterio: <picture> o formato.
371. Verificar que el hover de track muestra overlay. Criterio: CSS.
372. Verificar que el hover de track muestra link de streaming. Criterio: botón.
373. Verificar que el link de streaming abre en nueva pestaña. Criterio: target=_blank.
374. Verificar que el link de streaming tiene rel="noopener noreferrer". Criterio: presente.
375. Verificar que los tracks se filtran por género. Criterio: test.
376. Verificar que los tracks se ordenan por fecha. Criterio: test.
377. Verificar que los tracks se buscan por texto. Criterio: test.
378. Verificar que el grid de tracks es responsive (4 cols desktop, 2 tablet, 1 móvil). Criterio: visual en 3 widths.
379. Verificar que no hay tracks con datos vacíos. Criterio: 0.
380. Verificar que los covers faltantes muestran placeholder diseñado. Criterio: no broken image.

## 4E. Studio y Sobre (381-395)
381. Verificar que la sección Studio muestra las estaciones de trabajo. Criterio: 3+ stations.
382. Verificar que cada estación tiene imagen. Criterio: visible.
383. Verificar que cada estación tiene título y specs. Criterio: texto.
384. Verificar que la sección Studio tiene hover effects. Criterio: CSS.
385. Verificar que la sección Sobre tiene texto de biografía. Criterio: 2+ párrafos.
386. Verificar que la biografía tiene traducciones. Criterio: i18n keys.
387. Verificar que la sección Sobre tiene imagen de perfil. Criterio: visible.
388. Verificar que la imagen de perfil tiene alt. Criterio: presente.
389. Verificar que la sección Sobre tiene stats (36M streams, 40+ releases, 500+ collabs). Criterio: 3 stats.
390. Verificar que los stats tienen counter animation. Criterio: JS.
391. Verificar que los stats son accesibles (aria-live). Criterio: presente.
392. Verificar que la timeline de Sobre funciona. Criterio: elementos renderizados.
393. Verificar que la timeline es responsive. Criterio: visual.
394. Verificar que el copy de Sobre está revisado sin typos. Criterio: revisión.
395. Verificar que las secciones Studio/Sobre tienen imagenes optimizadas. Criterio: WebP.

## 4F. Footer y cierre (396-400)
396. Escribir footer con `role="contentinfo"`. Criterio: presente.
397. Escribir footer con links sociales (YouTube, Instagram, etc.). Criterio: 3+ links.
398. Escribir footer con copyright. Criterio: año dinámico.
399. Escribir footer con link back-to-top. Criterio: funcional.
400. **GATE FASE 4**: head completo, nav funcional, secciones semánticas, tracks/studio/about/footer OK. Criterio: 4/4 OK.

---

# FASE 5: CSS GLOBAL Y LAYOUT (401-500)

## 5A. Reset y base (401-420)
401. Aplicar reset CSS moderno (box-sizing border-box global). Criterio: `*{box-sizing:border-box}`.
402. Resetear margen y padding de todos los elementos. Criterio: sin margen por defecto.
403. Resetear estilos de lista (list-style). Criterio: nav sin bullets.
404. Resetear estilos de botones (font inherit, background transparent). Criterio: botones consistentes.
405. Resetear estilos de inputs (font inherit). Criterio: consistente.
406. Definir img max-width 100% y height auto. Criterio: sin desbordes.
407. Definir img display block. Criterio: sin inline gap.
408. Definir picture display block. Criterio: consistente.
409. Definir root font-size 16px. Criterio: html.
410. Definir body font-family con fallback. Criterio: `--font-body`.
411. Definir body line-height. Criterio: `--lh-base`.
412. Definir body color y background. Criterio: tokens.
413. Definir text-rendering optimizado. Criterio: `optimizeLegibility`.
414. Definir -webkit-font-smoothing. Criterio: antialiased.
415. Definir selection styles. Criterio: `::selection`.
416. Definir focus-visible global. Criterio: anillo visible.
417. Definir scroll-behavior (con fallback para reduced-motion). Criterio: smooth.
418. Definir scrollbar styling. Criterio: personalizada.
419. Definir link base (color, hover). Criterio: tokens.
420. Verificar que el reset no rompe estilos existentes. Criterio: visual check.

## 5B. Layout system (421-440)
421. Crear utility `.container`. Criterio: max-width con padding.
422. Crear utility `.container--wide`. Criterio: 1440px.
423. Crear grid de 12 columnas `.grid`. Criterio: CSS grid.
424. Crear utilities de columna `.col-1` a `.col-12`. Criterio: todas.
425. Crear utilities de flex `.flex`, `.flex-center`, `.flex-between`. Criterio: presentes.
426. Crear utility `.section`. Criterio: padding vertical.
427. Crear utility `.section--alt` (fondo alterno). Criterio: presente.
428. Crear utility `.hidden` (accesible: visually-hidden). Criterio: screen readers.
429. Crear utility `.sr-only`. Criterio: solo lectores.
430. Crear utilities de spacing (`mt-*`, `mb-*`, `p-*`). Criterio: tokens.
431. Crear utility `.text-center`. Criterio: presente.
432. Crear utility `.text-uppercase`. Criterio: presente.
433. Crear utility `.no-scrollbar`. Criterio: presente.
434. Crear utility `.aspect-*` (ratios de imagen). Criterio: 16/9, 1/1, 4/3.
435. Crear utility `.ellipsis` (truncado de texto). Criterio: presente.
436. Verificar que los utilities usan tokens. Criterio: grep.
437. Verificar que el grid no causa overflow en mobile. Criterio: test.
438. Verificar que las columnas colapsan en mobile. Criterio: media query.
439. Documentar utilities en `docs/CSS.md`. Criterio: lista.
440. Verificar coherencia de uso de utilities en el HTML. Criterio: sin clases inline duplicadas.

## 5C. Tipografía en CSS (441-460)
441. Definir estilos h1-h6 (size, weight, line-height, margin). Criterio: tokens.
442. Definir estilos de párrafos (margin, line-height). Criterio: tokens.
443. Definir estilos de listas (padding-left). Criterio: consistente.
444. Definir estilos de blockquote (si existe). Criterio: presente.
445. Definir estilos de links inline (underline en hover). Criterio: presente.
446. Definir estilos de strong/em. Criterio: consistente.
447. Definir estilos de small/caption. Criterio: tokens.
448. Definir estilos de code/kbd (si aplica). Criterio: presente.
449. Definir estilos de labels. Criterio: tokens.
450. Definir estilos de títulos con gradiente de acento (si aplica). Criterio: coherente con marca.
451. Verificar que no hay font-size en px fuera de tokens. Criterio: grep.
452. Verificar que no hay line-height en px fuera de tokens. Criterio: grep.
453. Verificar que los headings tienen margin-bottom adecuado. Criterio: visual.
454. Verificar que los títulos se ven bien en móvil (clamp). Criterio: visual.
455. Verificar que los títulos se ven bien en ultra-wide. Criterio: visual.
456. Verificar que el texto largo no desborda. Criterio: overflow-wrap.
457. Verificar que las fuentes cargan con font-display: swap. Criterio: CSS.
458. Verificar que no hay FOIT (flash invisible text). Criterio: visual.
459. Verificar que los idiomas acentuados (PT/ES/FR) renderizan bien. Criterio: caracteres correctos.
460. Verificar que la tipografía es legible en los 4 idiomas. Criterio: revisión.

## 5D. Responsive (461-480)
461. Definir breakpoint mobile-first (base). Criterio: estilos base móvil.
462. Definir media query min-width 641px (tablet). Criterio: presente.
463. Definir media query min-width 1025px (desktop). Criterio: presente.
464. Definir media query min-width 1441px (ultra). Criterio: presente.
465. Verificar que no hay media queries max-width conflictivas. Criterio: revisión.
466. Verificar que el grid colapsa correctamente. Criterio: visual 3 widths.
467. Verificar que el nav se vuelve hamburguesa en mobile. Criterio: visual.
468. Verificar que los instrumentos son usables en touch. Criterio: test touch.
469. Verificar que los botones tienen 44px mínimo en touch. Criterio: test.
470. Verificar que los modales caben en pantalla pequeña. Criterio: visual.
471. Verificar que el footer no se rompe en mobile. Criterio: visual.
472. Verificar que las imágenes no desbordan. Criterio: 0 overflow.
473. Verificar que el texto no se corta en mobile. Criterio: visual.
474. Verificar que los formularios son usables en mobile. Criterio: test.
475. Verificar que los controles de audio son usables en mobile. Criterio: test.
476. Verificar que el layout es estable al rotar pantalla. Criterio: test.
477. Verificar que el layout es estable al hacer zoom. Criterio: test 200%.
478. Verificar que no hay scroll horizontal en ningún width. Criterio: test.
479. Verificar que el viewport meta permite zoom (usuario). Criterio: `user-scalable` no bloqueado.
480. Documentar breakpoints probados. Criterio: tabla en docs.

## 5E. Dark mode y temas (481-495)
481. Verificar que el tema dark es el default. Criterio: body bg oscuro.
482. Verificar que no hay "flash" de tema claro al cargar. Criterio: script inline antes de CSS.
483. Definir variables de tema en `[data-theme]` si hay toggle. Criterio: presente o decidido.
484. Verificar que el toggle de tema (si existe) persiste en localStorage. Criterio: test.
485. Verificar que el toggle respeta prefers-color-scheme. Criterio: media query.
486. Verificar contraste en dark mode (WCAG AA). Criterio: ratios.
487. Verificar que las imágenes no se ven "quemadas" en dark. Criterio: filtro suave opcional.
488. Verificar que los form controls se ven en dark. Criterio: visual.
489. Verificar que el custom cursor es visible en dark. Criterio: visual.
490. Verificar que los modales se ven en dark. Criterio: visual.
491. Verificar que los tooltips se ven en dark. Criterio: visual.
492. Verificar que los toasts se ven en dark. Criterio: visual.
493. Verificar que la selección de texto es visible en dark. Criterio: visual.
494. Verificar que el scrollbar es visible en dark. Criterio: visual.
495. Verificar que el tema es consistente entre secciones. Criterio: revisión.

## 5F. Verificación layout (496-500)
496. Verificar que no hay reglas CSS huérfanas (selectores sin uso). Criterio: linter.
497. Verificar que no hay !important abusivos. Criterio: grep, justificar cada uno.
498. Verificar que el CSS final minifica sin errores. Criterio: build.
499. Medir peso del CSS final. Criterio: registrado.
500. **GATE FASE 5**: reset aplicado, layout system listo, responsive probado, dark mode OK. Criterio: 4/4 OK.

---

# FASE 6: NAVEGACIÓN Y SCROLL (501-600)

## 6A. Navbar (501-520)
501. Verificar que la navbar es fixed/sticky. Criterio: CSS.
502. Verificar que la navbar tiene z-index correcto. Criterio: sobre contenido.
503. Verificar que la navbar tiene fondo con blur al scroll. Criterio: `.is-scrolled`.
504. Verificar que la navbar muestra el logo. Criterio: visible.
505. Verificar que el logo es un link a #hero. Criterio: funcional.
506. Verificar que los links de nav scrollean a su sección. Criterio: test.
507. Verificar que el link activo se resalta al scroll. Criterio: IntersectionObserver o ScrollTrigger.
508. Verificar que el resaltado funciona al hacer click. Criterio: test.
509. Verificar que la navbar tiene separación entre links. Criterio: visual.
510. Verificar que la navbar tiene el switcher de idioma. Criterio: visible.
511. Verificar que la navbar tiene CTA (si aplica). Criterio: botón.
512. Verificar que la navbar no oculta contenido (padding top en body). Criterio: test.
513. Verificar que la navbar es accesible (aria-label). Criterio: presente.
514. Verificar que la navbar soporta teclado (tab). Criterio: test.
515. Verificar que la navbar no parpadea al scroll. Criterio: test.
516. Verificar que la navbar funciona en mobile (hamburguesa). Criterio: test.
517. Verificar que el menú móvil ocupa pantalla completa o drawer. Criterio: visual.
518. Verificar que el menú móvil se anima suavemente. Criterio: GSAP o CSS.
519. Verificar que el menú móvil bloquea scroll del body. Criterio: body overflow hidden.
520. Verificar que el menú móvil restaura scroll al cerrar. Criterio: test.

## 6B. Scroll suave y Lenis (521-540)
521. Verificar que Lenis (o smooth scroll) está inicializado. Criterio: JS init.
522. Verificar que Lenis no rompe el scroll nativo. Criterio: test.
523. Verificar que Lenis respeta `prefers-reduced-motion`. Criterio: desactivado si aplica.
524. Verificar que los anchors funcionan con Lenis (scrollTo). Criterio: test.
525. Verificar que scroll progress bar funciona. Criterio: barra visible y actualizada.
526. Verificar que back-to-top funciona. Criterio: botón visible tras scroll.
527. Verificar que back-to-top anima suavemente. Criterio: test.
528. Verificar que el scroll no se "hackea" (hijacking excesivo). Criterio: decisión.
529. Verificar que el scroll es fluido (60fps). Criterio: test performance.
530. Verificar que Lenis se destruye/limpia en SPA si aplica. Criterio: sin memory leak.
531. Verificar que el parallax de scroll funciona. Criterio: ScrollTrigger.
532. Verificar que el parallax no causa jank. Criterio: test.
533. Verificar que los elementos revelan al scroll (fade/slide). Criterio: GSAP ScrollTrigger.
534. Verificar que el reveal no rompe si JS falla. Criterio: contenido visible.
535. Verificar que el reveal respeta reduced-motion. Criterio: desactivado.
536. Verificar que el scroll es suave en Safari. Criterio: test.
537. Verificar que el scroll es suave en Firefox. Criterio: test.
538. Verificar que el scroll es suave en Chrome. Criterio: test.
539. Verificar que el scroll es suave en móvil. Criterio: test.
540. Verificar que no hay doble scroll (Lenis + nativo). Criterio: test.

## 6C. Custom cursor (541-555)
541. Verificar que el custom cursor existe (si aplica). Criterio: elemento en DOM.
542. Verificar que el cursor sigue al mouse con lerp. Criterio: suavidad.
543. Verificar que el cursor se oculta en touch devices. Criterio: media query hover none.
544. Verificar que el cursor cambia en hover de links. Criterio: escala/color.
545. Verificar que el cursor cambia en hover de botones. Criterio: escala.
546. Verificar que el cursor cambia en elementos interactivos (instrumentos). Criterio: estado.
547. Verificar que el cursor no interfiere con clicks. Criterio: pointer-events none.
548. Verificar que el cursor desaparece con mouse idle. Criterio: CSS.
549. Verificar que el cursor es visible sobre imágenes. Criterio: mix-blend o borde.
550. Verificar que el cursor no aparece en móvil. Criterio: media query.
551. Verificar que el cursor nativo se oculta correctamente. Criterio: cursor:none en elementos.
552. Verificar que el cursor respeta reduced-motion. Criterio: sin animación.
553. Verificar que el cursor funciona en iframes/videos. Criterio: test.
554. Verificar que el cursor se reinicia al cambiar de página. Criterio: test.
555. Verificar que el cursor es consistente en toda la página. Criterio: revisión.

## 6D. Menú móvil (556-575)
556. Verificar que el botón hamburguesa aparece solo en mobile. Criterio: media query.
557. Verificar que el hamburguesa se anima (3 líneas a X). Criterio: CSS/GSAP.
558. Verificar que el menú móvil se abre con animación. Criterio: test.
559. Verificar que el menú móvil se cierra con animación. Criterio: test.
560. Verificar que el menú móvil tiene aria-expanded correcto. Criterio: JS.
561. Verificar que el menú móvil tiene aria-controls. Criterio: presente.
562. Verificar que el menú móvil soporta Esc para cerrar. Criterio: test.
563. Verificar que el menú móvil soporta focus trap. Criterio: test.
564. Verificar que el menú móvil devuelve focus al abrir. Criterio: test.
565. Verificar que el menú móvil lista todos los links. Criterio: 5 links.
566. Verificar que el menú móvil tiene el switcher de idioma. Criterio: visible.
567. Verificar que el menú móvil tiene links sociales (opcional). Criterio: decisión.
568. Verificar que el menú móvil no se desborda. Criterio: visual.
569. Verificar que el menú móvil bloquea scroll. Criterio: body overflow.
570. Verificar que el menú móvil se cierra al navegar. Criterio: test.
571. Verificar que el menú móvil es consistente con desktop (mismos links). Criterio: comparación.
572. Verificar que el menú móvil es accesible. Criterio: test screen reader.
573. Verificar que el menú móvil anima con stagger. Criterio: links en cascada.
574. Verificar que el menú móvil funciona en iOS Safari. Criterio: test.
575. Verificar que el menú móvil no causa layout shift. Criterio: CLS test.

## 6E. Language switcher (576-595)
576. Verificar que el switcher de idioma existe en nav. Criterio: visible.
577. Verificar que el switcher muestra el idioma actual. Criterio: estado activo.
578. Verificar que el switcher tiene los 4 idiomas (PT/ES/EN/FR). Criterio: 4 opciones.
579. Verificar que cambiar idioma actualiza el texto de la página. Criterio: test.
580. Verificar que cambiar idioma actualiza el atributo lang. Criterio: JS.
581. Verificar que cambiar idioma persiste en localStorage. Criterio: reload mantiene.
582. Verificar que el idioma default es PT-BR. Criterio: primera carga.
583. Verificar que el switcher es accesible (aria-label). Criterio: presente.
584. Verificar que el switcher es un <select> o botones con teclado. Criterio: test.
585. Verificar que el switcher funciona en mobile. Criterio: test.
586. Verificar que el switcher anima la transición de texto. Criterio: fade.
587. Verificar que los textos dinámicos (JS-rendered) también cambian. Criterio: test.
588. Verificar que las fechas/números se localizan. Criterio: format.
589. Verificar que no hay textos sin traducción. Criterio: grep de keys faltantes.
590. Verificar que el switcher no rompe el DOM al cambiar. Criterio: test.
591. Verificar que el switcher funciona con i18n de data.js. Criterio: tracks traducidos.
592. Verificar que el switcher actualiza title y meta description. Criterio: document.title.
593. Verificar que el switcher actualiza hreflang (opcional). Criterio: decisión.
594. Verificar que el switcher no pierde estado al scroll. Criterio: test.
595. Verificar que el switcher es consistente en desktop y mobile. Criterio: revisión.

## 6F. Gate navegación (596-600)
596. Test: navegar a todas las secciones desde nav. Criterio: todas alcanzables.
597. Test: navegar con teclado (Tab/Enter/Esc). Criterio: sin trampas de focus.
598. Test: navegar en mobile. Criterio: hamburguesa funcional.
599. Test: cambiar idioma y navegar. Criterio: textos y anchors consistentes.
600. **GATE FASE 6**: navbar OK, Lenis OK, cursor OK, menú móvil OK, switcher OK. Criterio: 5/5 OK.

---

# FASE 7: HERO Y PRIMERA IMPRESIÓN (601-700)

## 7A. Hero layout (601-620)
601. Definir layout del hero (full-screen o 90vh). Criterio: decisión visual registrada.
602. Definir fondo del hero (color, gradiente, imagen, video o canvas). Criterio: elegido y justificado.
603. Verificar que el fondo no distrae del contenido. Criterio: contraste legible.
604. Definir overlay/gradiente sobre el fondo. Criterio: legibilidad.
605. Definir grain/texture overlay (si aplica). Criterio: sutil.
606. Definir grid pattern overlay (si aplica). Criterio: sutil.
607. Definir vignette para enfoque central. Criterio: sutil.
608. Definir logo en el hero. Criterio: visible y coherente con marca.
609. Definir título principal del hero. Criterio: texto en los 4 idiomas.
610. Definir subtítulo del hero. Criterio: texto en los 4 idiomas.
611. Definir descripción corta del hero. Criterio: 1-2 líneas.
612. Definir CTAs del hero (primario y secundario). Criterio: 2 botones.
613. Definir indicador de scroll en el hero. Criterio: visible.
614. Definir coordenadas/ciudad (si aplica). Criterio: dato real.
615. Definir waveform/visualizador decorativo (si aplica). Criterio: coherente con audio.
616. Definir badges/stats en hero (si aplica). Criterio: coherentes.
617. Definir responsive del hero (mobile: apilar, desktop: en línea). Criterio: visual.
618. Verificar que el hero no causa CLS al cargar. Criterio: medido.
619. Verificar que el hero carga rápido (LCP). Criterio: < 2.5s.
620. Verificar que el hero es consistente con el resto de la web. Criterio: revisión.

## 7B. Animación de entrada (621-640)
621. Definir secuencia de entrada del hero (orden: fondo, logo, título, subtítulo, CTAs). Criterio: timeline GSAP.
622. Animar el logo (pulse o ring). Criterio: suave y loop opcional.
623. Animar el título (fade-up o reveal por palabras). Criterio: elegido.
624. Animar el subtítulo (fade con delay). Criterio: stagger con título.
625. Animar la descripción (fade). Criterio: orden lógico.
626. Animar los CTAs (slide-up). Criterio: delay final.
627. Animar el indicador de scroll. Criterio: loop de fade.
628. Animar el waveform (si aplica). Criterio: ondas suaves.
629. Verificar que la secuencia dura < 1.5s. Criterio: no molesta.
630. Verificar que la secuencia respeta reduced-motion. Criterio: sin animación.
631. Verificar que la secuencia no bloquea interacción. Criterio: test.
632. Verificar que la secuencia no causa CLS. Criterio: medido.
633. Verificar que la secuencia es fluida (60fps). Criterio: test.
634. Verificar que la secuencia funciona en mobile. Criterio: test.
635. Verificar que la secuencia funciona si JS falla (fallback visible). Criterio: contenido presente.
636. Verificar que la secuencia se puede saltar (si es larga). Criterio: botón skip o rápida.
637. Verificar que el texto no queda invisible si la animación no corre. Criterio: fallback.
638. Verificar que las animaciones no usan transform que rompa layout. Criterio: medido.
639. Verificar que el hero se ve bien al hacer scroll rápido. Criterio: test.
640. Registrar la secuencia en `docs/ANIMACIONES.md`. Criterio: documentado.

## 7C. Parallax y mouse (641-660)
641. Definir parallax del hero al scroll (si aplica). Criterio: ScrollTrigger.
642. Verificar que el parallax no causa jank. Criterio: test 60fps.
643. Verificar que el parallax respeta reduced-motion. Criterio: desactivado.
644. Definir parallax por movimiento de mouse (si aplica). Criterio: sutil (<=10px).
645. Verificar que el parallax de mouse no molesta en touch. Criterio: media query hover.
646. Verificar que el parallax de mouse se suaviza con lerp. Criterio: suavidad.
647. Verificar que el parallax funciona sobre todos los elementos del hero. Criterio: consistente.
648. Verificar que el parallax no rompe el layout. Criterio: sin overflow.
649. Verificar que el parallax de fondo es diferente al de contenido (profundidad). Criterio: capas.
650. Verificar que las capas de parallax no se ven pixeladas. Criterio: imágenes nítidas.
651. Verificar que el parallax de mouse se reinicia al volver a la sección. Criterio: test.
652. Verificar que el parallax funciona en Safari. Criterio: test.
653. Verificar que el parallax funciona en Firefox. Criterio: test.
654. Verificar que el parallax no interfiere con el scroll. Criterio: test.
655. Verificar que el parallax es sutil (no mareo). Criterio: revisión de intensidad.
656. Verificar que el cursor custom interactúa con hero (si aplica). Criterio: test.
657. Verificar que los CTAs tienen efecto magnético (si aplica). Criterio: sutil.
658. Verificar que los CTAs tienen ripple/glow (si aplica). Criterio: sutil.
659. Verificar que el hero se comporta bien en ultra-wide. Criterio: contenido centrado.
660. Documentar los efectos del hero. Criterio: ANIMACIONES.md.

## 7D. Contenido y copy (661-680)
661. Redactar copy del título del hero (PT). Criterio: pegadizo y en marca.
662. Redactar copy del título (ES). Criterio: traducción natural.
663. Redactar copy del título (EN). Criterio: traducción natural.
664. Redactar copy del título (FR). Criterio: traducción natural.
665. Redactar subtítulo (PT/ES/EN/FR). Criterio: 4 versiones.
666. Redactar descripción (PT/ES/EN/FR). Criterio: 4 versiones.
667. Redactar CTA primario (PT/ES/EN/FR). Criterio: 4 versiones.
668. Redactar CTA secundario (PT/ES/EN/FR). Criterio: 4 versiones.
669. Verificar que el copy no tiene typos. Criterio: revisión.
670. Verificar que el copy no excede el espacio del hero. Criterio: visual en 4 idiomas.
671. Verificar que el copy es coherente con la marca DUCK. Criterio: tono.
672. Verificar que el título no se corta en mobile. Criterio: visual.
673. Verificar que el subtítulo no se corta en mobile. Criterio: visual.
674. Verificar que el copy respeta la jerarquía visual. Criterio: título > subtítulo > desc.
675. Verificar que los CTAs dicen exactamente lo que hacen. Criterio: texto claro.
676. Verificar que el CTA primario lleva a la sección correcta. Criterio: test.
677. Verificar que el CTA secundario lleva a la sección correcta. Criterio: test.
678. Verificar que el copy tiene keywords de SEO. Criterio: título y descripción.
679. Verificar que el copy es escaneable (corto). Criterio: 1-2 líneas por elemento.
680. Congelar copy del hero. Criterio: aprobado por usuario.

## 7E. Elementos decorativos (681-695)
681. Verificar que el grain overlay no pesa (SVG inline o CSS). Criterio: < 5KB.
682. Verificar que el grid overlay es sutil. Criterio: opacidad baja.
683. Verificar que el vignette no oscurece el texto. Criterio: legibilidad.
684. Verificar que el logo del hero es nítido (SVG o PNG 2x). Criterio: visual.
685. Verificar que el logo tiene hover/pulse sutil. Criterio: test.
686. Verificar que el indicador de scroll es visible. Criterio: contraste.
687. Verificar que el indicador de scroll funciona (baja). Criterio: click scroll.
688. Verificar que el waveform decorativo no consume CPU. Criterio: test performance.
689. Verificar que el waveform usa requestAnimationFrame correctamente. Criterio: sin leaks.
690. Verificar que los badges del hero (si aplica) son reales. Criterio: datos verificados.
691. Verificar que las coordenadas del hero (si aplica) son reales. Criterio: datos verificados.
692. Verificar que los elementos decorativos no duplican el contenido. Criterio: sin redundancia.
693. Verificar que los decorativos son consistentes en los 4 idiomas. Criterio: revisión.
694. Verificar que los decorativos no bloquean clicks. Criterio: pointer-events.
695. Verificar que los decorativos se ven bien en dark. Criterio: revisión.

## 7F. Gate hero (696-700)
696. Test: hero se ve bien en desktop 1920. Criterio: visual.
697. Test: hero se ve bien en tablet 768. Criterio: visual.
698. Test: hero se ve bien en mobile 375. Criterio: visual.
699. Test: hero carga con animación completa. Criterio: timeline completa.
700. **GATE FASE 7**: layout OK, animación OK, parallax OK, copy OK, responsive OK. Criterio: 5/5 OK.

---

# FASE 8: STATS, ABOUT Y TIMELINE (701-800)

## 8A. Stats (701-720)
701. Definir layout de stats (grid de 3). Criterio: 3 stats.
702. Definir stat 1: 36M+ streams. Criterio: dato real.
703. Definir stat 2: 40+ releases. Criterio: dato real.
704. Definir stat 3: 500+ colaboraciones. Criterio: dato real.
705. Definir animación de contador (count-up al entrar en viewport). Criterio: ScrollTrigger.
706. Definir formato de números (36,000,000+ → 36M+). Criterio: formateo.
707. Definir etiqueta de cada stat. Criterio: texto en 4 idiomas.
708. Definir separadores entre stats. Criterio: línea o espacio.
709. Definir fondo/gradiente de la sección. Criterio: coherente.
710. Verificar que el contador anima solo una vez. Criterio: test.
711. Verificar que el contador es accesible (valor final en DOM). Criterio: aria-live o texto final.
712. Verificar que el contador respeta reduced-motion. Criterio: valor final directo.
713. Verificar que el contador no causa jank. Criterio: test.
714. Verificar que el layout de stats es responsive. Criterio: 3 cols desktop, 1 móvil.
715. Verificar que los stats son legibles. Criterio: tamaño y contraste.
716. Verificar que los stats se ven bien en mobile. Criterio: visual.
717. Verificar que los stats no desbordan. Criterio: test.
718. Verificar que los stats son consistentes en 4 idiomas. Criterio: revisión.
719. Verificar que los stats tienen hover effect (opcional). Criterio: sutil.
720. Verificar que los stats se ven bien en dark. Criterio: revisión.

## 8B. About layout (721-740)
721. Definir layout de About (grid 2 columnas: texto + imagen). Criterio: decisión.
722. Definir imagen de perfil (placeholder o real). Criterio: decidido.
723. Definir borde/efecto de la imagen. Criterio: coherente.
724. Definir filtro de la imagen (duotone, sepia, etc.). Criterio: sutil.
725. Definir headline de About. Criterio: texto en 4 idiomas.
726. Redactar párrafo 1 de la biografía (PT). Criterio: real y sin typos.
727. Redactar párrafo 2 (PT). Criterio: real.
728. Redactar párrafo 3 (PT, opcional). Criterio: real.
729. Traducir biografía a ES. Criterio: natural.
730. Traducir biografía a EN. Criterio: natural.
731. Traducir biografía a FR. Criterio: natural.
732. Definir spacing de About. Criterio: --section-gap.
733. Verificar que el texto es legible (line-height, tamaño). Criterio: visual.
734. Verificar que el texto no es demasiado largo. Criterio: 2-3 párrafos.
735. Verificar que la imagen no desborda. Criterio: test.
736. Verificar que el layout es responsive (apilar en mobile). Criterio: visual.
737. Verificar que la imagen se ve bien en dark. Criterio: revisión.
738. Verificar que la imagen tiene alt descriptivo. Criterio: presente.
739. Verificar que la imagen usa lazy loading. Criterio: atributo.
740. Verificar que la imagen está optimizada (WebP). Criterio: formato.

## 8C. Timeline (741-760)
741. Definir layout de timeline (vertical u horizontal). Criterio: decisión.
742. Listar hitos reales de la carrera de DUCK. Criterio: 5+ hitos reales.
743. Definir año de cada hito. Criterio: datos verificados.
744. Definir título de cada hito. Criterio: texto.
745. Definir descripción de cada hito. Criterio: 1-2 líneas.
746. Traducir hitos a los 4 idiomas. Criterio: i18n keys.
747. Definir línea conectora de la timeline. Criterio: CSS.
748. Definir puntos/nodos de la timeline. Criterio: CSS.
749. Definir hover effects en nodos. Criterio: sutil.
750. Definir animación de entrada de la timeline (stagger). Criterio: GSAP.
751. Verificar que la timeline es accesible (lista semántica). Criterio: ol/ul.
752. Verificar que la timeline es responsive. Criterio: visual en mobile.
753. Verificar que la timeline no causa overflow. Criterio: test.
754. Verificar que la timeline se ve bien en dark. Criterio: revisión.
755. Verificar que los hitos están en orden cronológico. Criterio: revisión.
756. Verificar que los hitos no tienen datos falsos. Criterio: verificados con usuario.
757. Verificar que la timeline respeta reduced-motion. Criterio: sin animación.
758. Verificar que la animación de entrada no bloquea lectura. Criterio: rápida.
759. Verificar que la timeline es consistente en 4 idiomas. Criterio: revisión.
760. Congelar datos de la timeline. Criterio: aprobado por usuario.

## 8D. Imágenes y media (761-780)
761. Optimizar imagen de perfil (WebP, tamaño correcto). Criterio: < 200KB.
762. Optimizar imágenes de studio (WebP). Criterio: < 300KB cada una.
763. Optimizar covers (WebP). Criterio: < 100KB cada una.
764. Optimizar imágenes de projects (WebP). Criterio: < 300KB.
765. Crear versiones srcset para imágenes grandes. Criterio: 3 tamaños.
766. Agregar width/height a todas las imágenes. Criterio: sin CLS.
767. Agregar loading="lazy" a imágenes below-fold. Criterio: presente.
768. Agregar decoding="async" a imágenes. Criterio: presente.
769. Verificar que no hay imágenes rotas (404). Criterio: test network.
770. Verificar que todas las imágenes tienen alt. Criterio: 100%.
771. Verificar que los alt son descriptivos (no "image"). Criterio: revisión.
772. Verificar que los alt no son duplicados. Criterio: revisión.
773. Verificar que las imágenes decorativas tienen alt="". Criterio: aria-hidden.
774. Verificar que las imágenes se ven nítidas en retina. Criterio: 2x donde aplique.
775. Verificar que el peso total de imágenes es aceptable. Criterio: registrado.
776. Verificar que las imágenes se ven bien en los 4 idiomas (texto en imagen). Criterio: evitar texto en imagen.
777. Verificar que las imágenes no tienen marcas de agua feas. Criterio: revisión.
778. Verificar que los placeholders (si hay) son coherentes. Criterio: diseño.
779. Documentar el inventario de imágenes. Criterio: MEDIA.md.
780. Verificar que las imágenes se cargan con prioridad correcta (preload hero). Criterio: LCP.

## 8E. Contenido de About (781-795)
781. Verificar que el headline de About es claro. Criterio: 1 frase.
782. Verificar que la biografía cuenta una historia coherente. Criterio: lectura.
783. Verificar que la biografía menciona género musical. Criterio: presente.
784. Verificar que la biografía menciona colaboraciones. Criterio: presente.
785. Verificar que la biografía menciona logros. Criterio: presente.
786. Verificar que la biografía no es excesiva. Criterio: 3 párrafos máx.
787. Verificar que la biografía no tiene texto falso. Criterio: verificado.
788. Verificar que la sección About tiene CTA (si aplica, ej. "Conheça o trabalho"). Criterio: decisión.
789. Verificar que el CTA de About lleva a Tracks. Criterio: test.
790. Verificar que About se ve bien en todos los widths. Criterio: visual.
791. Verificar que About es consistente con el diseño general. Criterio: tokens.
792. Verificar que el copy de About está en las claves i18n. Criterio: grep.
793. Verificar que no hay texto hardcodeado en el HTML de About. Criterio: grep.
794. Congelar copy de About. Criterio: aprobado.
795. Verificar que About no duplica contenido del hero. Criterio: revisión.

## 8F. Gate stats/about (796-800)
796. Test: stats cuentan al entrar en viewport. Criterio: animación correcta.
797. Test: About se ve bien en desktop y mobile. Criterio: visual.
798. Test: timeline se ve bien en desktop y mobile. Criterio: visual.
799. Test: idiomas muestran About y timeline correctamente. Criterio: 4 idiomas.
800. **GATE FASE 8**: stats OK, about OK, timeline OK, media OK, copy aprobado. Criterio: 5/5 OK.

---

# FASE 9: DISCOGRAFÍA / TRACKS (801-900)

## 9A. Data de tracks (801-820)
801. Abrir `js/data.js` y verificar estructura final de tracks. Criterio: array de objetos.
802. Definir campos mínimos por track (id, title, role, genre, year, url, cover). Criterio: schema.
803. Verificar que hay >= 32 tracks. Criterio: count.
804. Verificar que no hay IDs duplicados. Criterio: 0.
805. Verificar que no hay titles vacíos. Criterio: 0.
806. Verificar que no hay roles vacíos. Criterio: 0.
807. Verificar que no hay genres vacíos. Criterio: 0.
808. Verificar que no hay years vacíos. Criterio: 0.
809. Verificar que no hay urls vacías. Criterio: 0.
810. Verificar que todas las urls son de YouTube. Criterio: regex.
811. Verificar que las urls no tienen parámetros rotos. Criterio: test.
812. Verificar que los covers existen en disco. Criterio: 100%.
813. Verificar que los covers faltantes tienen placeholder diseñado. Criterio: no 404.
814. Verificar que los roles usan vocabulario consistente (produtor, mixagem, masterização). Criterio: lista.
815. Verificar que los genres usan vocabulario consistente. Criterio: lista.
816. Verificar que los genres cubren los filtros disponibles. Criterio: match.
817. Verificar que los tracks están ordenados por fecha (desc). Criterio: sort.
818. Verificar que el portfolio 46graus tiene sus tracks. Criterio: gap cerrado.
819. Verificar que los nombres de faixas son reales (Leones, Mayzer Gafur Menm, Chrislops, Hancornia). Criterio: verificado.
820. Congelar `data.js` de tracks. Criterio: nota en cabecera.

## 9B. Grid de tracks (821-840)
821. Definir layout de grid de tracks (4 cols desktop, 2 tablet, 1 móvil). Criterio: CSS.
822. Definir card de track (cover + overlay + info). Criterio: CSS.
823. Definir aspect-ratio del cover (1:1). Criterio: sin CLS.
824. Definir overlay en hover con gradiente. Criterio: CSS.
825. Definir título del track en el card. Criterio: texto.
826. Definir role del track en el card. Criterio: texto.
827. Definir año y género en el card. Criterio: badges.
828. Definir botón de streaming en hover. Criterio: visible.
829. Definir botón de play preview (si aplica). Criterio: test.
830. Definir transición de hover suave. Criterio: 300ms.
831. Verificar que el grid se renderiza desde data.js. Criterio: N tracks.
832. Verificar que el grid no duplica cards. Criterio: N == length.
833. Verificar que el grid ordena por fecha. Criterio: test.
834. Verificar que el grid es responsive. Criterio: 3 widths.
835. Verificar que los cards tienen altura consistente. Criterio: grid stretch.
836. Verificar que los títulos largos no rompen el card. Criterio: ellipsis.
837. Verificar que los roles largos no rompen el card. Criterio: ellipsis.
838. Verificar que el grid no causa CLS. Criterio: medido.
839. Verificar que el grid funciona sin JS (fallback estático). Criterio: decisión.
840. Verificar que el grid se ve bien en dark. Criterio: revisión.

## 9C. Filtros, búsqueda y orden (841-860)
841. Definir barra de filtros (géneros). Criterio: botones.
842. Definir filtro "Todos". Criterio: default activo.
843. Definir filtros por género. Criterio: de data.
844. Definir estado activo de filtro (aria-pressed). Criterio: presente.
845. Definir búsqueda por texto. Criterio: input.
846. Definir orden por fecha (recientes primero). Criterio: default.
847. Definir opción de orden (opcional). Criterio: select.
848. Definir contador de resultados. Criterio: "X tracks".
849. Definir estado vacío (sin resultados). Criterio: mensaje.
850. Definir animación de re-render (fade). Criterio: suave.
851. Verificar que filtrar por género devuelve solo ese género. Criterio: test.
852. Verificar que buscar por texto funciona (case-insensitive). Criterio: test.
853. Verificar que combinar filtro + búsqueda funciona. Criterio: test.
854. Verificar que el contador de resultados es correcto. Criterio: test.
855. Verificar que el estado vacío aparece correctamente. Criterio: test.
856. Verificar que el estado vacío tiene mensaje en 4 idiomas. Criterio: i18n.
857. Verificar que los filtros son accesibles (teclado). Criterio: test.
858. Verificar que los filtros funcionan en mobile. Criterio: test.
859. Verificar que los filtros no causan jank con muchos tracks. Criterio: test 40 tracks.
860. Verificar que el re-render no pierde el estado del scroll. Criterio: test.

## 9D. Modal de track (861-880)
861. Definir modal de detalle de track. Criterio: overlay + contenido.
862. Definir contenido del modal (cover grande, title, role, genre, year, descripción). Criterio: completo.
863. Definir botón "Ouvir / Escuchar" (link YouTube). Criterio: funcional.
864. Definir botón de cerrar modal. Criterio: X.
865. Definir cerrar con click fuera. Criterio: overlay click.
866. Definir cerrar con Esc. Criterio: teclado.
867. Definir focus trap dentro del modal. Criterio: test.
868. Definir devolución de focus al cerrar. Criterio: test.
869. Definir animación de apertura del modal. Criterio: suave.
870. Definir animación de cierre. Criterio: suave.
871. Definir aria-modal y role="dialog". Criterio: presente.
872. Definir aria-label descriptivo del modal. Criterio: presente.
873. Definir scroll del body bloqueado con modal abierto. Criterio: test.
874. Verificar que el modal funciona al hacer click en card. Criterio: test.
875. Verificar que el modal funciona con teclado (Enter). Criterio: test.
876. Verificar que el modal se ve bien en mobile (scroll interno). Criterio: visual.
877. Verificar que el modal se ve bien en dark. Criterio: visual.
878. Verificar que el modal no pierde datos al cambiar idioma. Criterio: test.
879. Verificar que el modal es accesible con screen reader. Criterio: test.
880. Verificar que el modal no causa CLS. Criterio: medido.

## 9E. Integración con audio (881-895)
881. Decidir si los tracks tienen preview de audio. Criterio: decisión.
882. Si preview: definir reproductor en el modal. Criterio: controls.
883. Si preview: cargar audio de forma lazy. Criterio: bajo demanda.
884. Si preview: verificar autoplay policies. Criterio: sin bloqueo.
885. Si preview: pausar al cerrar modal. Criterio: test.
886. Si preview: no reproducir varios a la vez. Criterio: single instance.
887. Si preview: verificar que el audio funciona en mobile. Criterio: test.
888. Si preview: verificar volumen y estado. Criterio: test.
889. Si no preview: el botón lleva directo a YouTube. Criterio: link.
890. Verificar que el link de YouTube abre en nueva pestaña. Criterio: target.
891. Verificar que el link tiene rel="noopener". Criterio: presente.
892. Verificar que el link no se bloquea por popup blocker. Criterio: test.
893. Verificar que el modal no reproduce audio sin interacción. Criterio: policy.
894. Verificar que los iconos de play/pause son accesibles. Criterio: aria-label.
895. Verificar que la sección tracks no rompe si el audio falla. Criterio: fallback link.

## 9F. Gate tracks (896-900)
896. Test: grid renderiza 32+ tracks. Criterio: count.
897. Test: filtros, búsqueda y orden funcionan. Criterio: 3/3.
898. Test: modal abre, muestra datos y cierra. Criterio: 3/3.
899. Test: audio (si aplica) reproduce y pausa. Criterio: test.
900. **GATE FASE 9**: data OK, grid OK, filtros OK, modal OK, audio/link OK. Criterio: 5/5 OK.

---

# FASE 10: STUDIO Y EQUIPO (901-1000)

## 10A. Studio layout (901-920)
901. Definir layout de la sección Studio. Criterio: decisión visual.
902. Definir encabezado de Studio (título + subtítulo). Criterio: 4 idiomas.
903. Definir lista de estaciones de trabajo (stations). Criterio: 3+ stations reales.
904. Definir station 1 (producción musical). Criterio: datos reales.
905. Definir station 2 (mixagem). Criterio: datos reales.
906. Definir station 3 (masterização). Criterio: datos reales.
907. Definir card de station (imagen + título + specs). Criterio: CSS.
908. Definir imagen de cada station. Criterio: real o placeholder.
909. Definir número/índice de cada station. Criterio: "01", "02".
910. Definir specs de cada station (equipo). Criterio: lista.
911. Definir hover effect de station (zoom imagen). Criterio: sutil.
912. Definir animación de entrada de stations (stagger). Criterio: GSAP.
913. Verificar que el layout es responsive. Criterio: 3 widths.
914. Verificar que las stations se ven bien en mobile. Criterio: apiladas.
915. Verificar que las imágenes no desbordan. Criterio: test.
916. Verificar que las imágenes están optimizadas. Criterio: WebP.
917. Verificar que las stations son accesibles (alt). Criterio: presente.
918. Verificar que las stations se ven bien en dark. Criterio: revisión.
919. Verificar que el copy de Studio está en i18n. Criterio: grep.
920. Congelar datos de Studio. Criterio: aprobado.

## 10B. Gear / equipo (921-940)
921. Definir sección de gear (equipo técnico). Criterio: decisión.
922. Definir categorías de gear (monitores, interface, synth, etc.). Criterio: 3+ categorías.
923. Definir card de categoría. Criterio: CSS.
924. Definir icono de cada categoría. Criterio: SVG o emoji (marca).
925. Definir lista de items por categoría. Criterio: 3+ items.
926. Definir nombre de cada item. Criterio: real.
927. Definir tipo de cada item (hardware/software). Criterio: dato.
928. Definir hover effect de categoría. Criterio: sutil.
929. Definir animación de entrada. Criterio: stagger.
930. Verificar que el layout es responsive. Criterio: visual.
931. Verificar que el gear se ve bien en mobile. Criterio: visual.
932. Verificar que los iconos son accesibles (aria-hidden + label). Criterio: presente.
933. Verificar que el gear se ve bien en dark. Criterio: revisión.
934. Verificar que el copy de gear está en i18n. Criterio: grep.
935. Verificar que los datos de gear son reales. Criterio: verificado.
936. Verificar que gear no duplica contenido de stations. Criterio: revisión.
937. Verificar que las categorías se ven bien en todos los widths. Criterio: visual.
938. Verificar que la animación de entrada respeta reduced-motion. Criterio: test.
939. Verificar que el gear no causa overflow. Criterio: test.
940. Congelar datos de gear. Criterio: aprobado.

## 10C. Modal de station (941-960)
941. Definir modal de detalle de station. Criterio: overlay.
942. Definir contenido del modal (imagen grande, specs, descripción). Criterio: completo.
943. Definir lista de specs técnicos. Criterio: detallada.
944. Definir botón de cerrar. Criterio: X.
945. Definir cerrar con click fuera. Criterio: overlay.
946. Definir cerrar con Esc. Criterio: teclado.
947. Definir focus trap. Criterio: test.
948. Definir devolución de focus. Criterio: test.
949. Definir animación de apertura/cierre. Criterio: suave.
950. Definir aria-modal/dialog. Criterio: presente.
951. Verificar que el modal funciona al hacer click en station. Criterio: test.
952. Verificar que el modal se ve bien en mobile. Criterio: scroll interno.
953. Verificar que el modal se ve bien en dark. Criterio: visual.
954. Verificar que el modal no pierde datos al cambiar idioma. Criterio: test.
955. Verificar que el modal es accesible con screen reader. Criterio: test.
956. Verificar que el modal no causa CLS. Criterio: medido.
957. Verificar que el body bloquea scroll con modal abierto. Criterio: test.
958. Verificar que solo un modal abre a la vez. Criterio: test.
959. Verificar que el modal carga la imagen sin jank. Criterio: test.
960. Verificar que el modal es consistente con el de tracks. Criterio: patrón compartido.

## 10D. Visual de Studio (961-980)
961. Definir fondo de Studio (oscuro, con textura). Criterio: coherente.
962. Definir grid/gradient de fondo de Studio. Criterio: sutil.
963. Verificar que el fondo no distrae del contenido. Criterio: legibilidad.
964. Definir separación visual entre stations. Criterio: gap.
965. Definir línea decorativa del encabezado. Criterio: CSS.
966. Verificar que el número de station es legible. Criterio: tamaño.
967. Verificar que los números usan la tipografía display. Criterio: coherente.
968. Verificar que las imágenes de stations tienen overlay legible. Criterio: gradiente.
969. Verificar que los specs tienen jerarquía visual. Criterio: labels vs valores.
970. Verificar que las estaciones se ven bien en ultra-wide. Criterio: centrado.
971. Verificar que la sección Studio no rompe el ritmo visual de la página. Criterio: revisión.
972. Verificar que Studio es coherente con tokens de color. Criterio: grep.
973. Verificar que las animaciones de Studio son consistentes con el resto. Criterio: tokens motion.
974. Verificar que Studio no tiene elementos decorativos vacíos. Criterio: revisión.
975. Verificar que el copy de Studio es escaneable. Criterio: corto.
976. Verificar que Studio tiene CTA (si aplica, ej. "Agende uma sessão"). Criterio: decisión.
977. Verificar que el CTA de Studio (si aplica) funciona. Criterio: test.
978. Verificar que Studio se ve bien con el tema dark. Criterio: revisión.
979. Verificar que Studio no duplica contenido de gear. Criterio: revisión.
980. Congelar diseño de Studio. Criterio: aprobado.

## 10E. Integración con contacto (981-995)
981. Verificar que Studio tiene forma de contactar (si aplica). Criterio: CTA o link.
982. Verificar que el CTA lleva a la sección de contacto. Criterio: anchor.
983. Verificar que el link de contacto funciona en mobile. Criterio: test.
984. Verificar que el link de contacto tiene aria-label. Criterio: presente.
985. Verificar que la sección Studio no muestra datos falsos de disponibilidad. Criterio: verificado.
986. Verificar que las specs de equipo son precisas. Criterio: verificado con usuario.
987. Verificar que Studio es consistente en los 4 idiomas. Criterio: revisión.
988. Verificar que no hay texto hardcodeado en Studio. Criterio: grep.
989. Verificar que las keys i18n de Studio existen. Criterio: grep.
990. Verificar que las imágenes de Studio no pesan demasiado. Criterio: < 300KB.
991. Verificar que las imágenes de Studio tienen srcset. Criterio: 2 tamaños.
992. Verificar que las imágenes de Studio tienen dimensiones. Criterio: sin CLS.
993. Verificar que el modal de station no rompe en mobile landscape. Criterio: test.
994. Verificar que la sección Studio es accesible (heading hierarchy). Criterio: test.
995. Verificar que Studio se ve bien con zoom 200%. Criterio: test.

## 10F. Gate studio (996-1000)
996. Test: Studio renderiza todas las stations. Criterio: count.
997. Test: modal de station abre y cierra. Criterio: test.
998. Test: gear muestra todas las categorías. Criterio: count.
999. Test: Studio se ve bien en desktop y mobile. Criterio: visual.
1000. **GATE FASE 10**: layout OK, gear OK, modal OK, visual OK, integración OK. Criterio: 5/5 OK.

---

# FASE 11: INSTRUMENTOS INTERACTIVOS (1001-1100)

## 11A. Piano (1001-1020)
1001. Verificar que la sección de instrumentos tiene heading y layout. Criterio: presente.
1002. Definir layout del piano (2 octavas + controles). Criterio: decisión.
1003. Definir teclas blancas. Criterio: renderizadas.
1004. Definir teclas negras. Criterio: renderizadas.
1005. Definir labels de notas. Criterio: C4, D4, etc.
1006. Definir interacción click en teclas. Criterio: sonido.
1007. Definir interacción teclado (QWERTY). Criterio: mapeo.
1008. Definir interacción touch (multi-touch). Criterio: varias teclas.
1009. Definir hover effect en teclas. Criterio: sutil.
1010. Definir active state (tecla presionada). Criterio: visual.
1011. Definir efecto de sustain (opcional). Criterio: botón.
1012. Definir control de volumen. Criterio: slider.
1013. Definir control de octava (shift). Criterio: botones +/-.
1014. Definir visualizer de barras (analyser). Criterio: canvas.
1015. Verificar que el sonido se genera con Web Audio (osciladores). Criterio: AudioContext.
1016. Verificar que las notas usan frecuencias correctas (A4=440). Criterio: tabla.
1017. Verificar que click + teclado + touch no duplican sonido. Criterio: test.
1018. Verificar que el piano es responsive. Criterio: visual.
1019. Verificar que el piano funciona en mobile. Criterio: touch.
1020. Verificar que el piano no causa jank con varias teclas. Criterio: test.

## 11B. Piano accesibilidad y sonido (1021-1040)
1021. Verificar que las teclas tienen aria-label (nota). Criterio: presente.
1022. Verificar que el piano se puede usar con teclado físico. Criterio: mapeo.
1023. Verificar que los controles son accesibles (slider, botones). Criterio: labels.
1024. Verificar que el AudioContext se crea con interacción de usuario. Criterio: policy.
1025. Verificar que el AudioContext se resume si se suspende. Criterio: JS.
1026. Verificar que los osciladores se detienen al soltar tecla. Criterio: sin sonido fantasma.
1027. Verificar que no hay memory leak de nodos de audio. Criterio: test.
1028. Verificar que el volumen controla la ganancia. Criterio: test.
1029. Verificar que el octave shift cambia las frecuencias. Criterio: test.
1030. Verificar que el visualizer muestra las frecuencias reales. Criterio: analyser.
1031. Verificar que el visualizer se detiene cuando no hay sonido. Criterio: sin gasto CPU.
1032. Verificar que el visualizer usa requestAnimationFrame. Criterio: sin leaks.
1033. Verificar que el piano respeta reduced-motion (visualizer). Criterio: desactivado.
1034. Verificar que el piano funciona en Safari (AudioContext). Criterio: test.
1035. Verificar que el piano funciona en Chrome. Criterio: test.
1036. Verificar que el piano funciona en Firefox. Criterio: test.
1037. Verificar que el piano funciona en iOS. Criterio: test.
1038. Verificar que el piano funciona con earphones (stereo). Criterio: test.
1039. Verificar que el piano no emite sonido al cargar la página. Criterio: test.
1040. Documentar el piano en `docs/AUDIO.md`. Criterio: completo.

## 11C. Rhythm Box / Secuenciador (1041-1060)
1041. Definir layout del rhythm box (grid 16 pasos). Criterio: 16 cells.
1042. Definir filas de instrumentos (kick, snare, hihat). Criterio: 3+ filas.
1043. Definir cell click para activar/desactivar. Criterio: test.
1044. Definir active state de cell (glow). Criterio: CSS.
1045. Definir playing state (cell actual). Criterio: pulse.
1046. Definir botón play/stop. Criterio: funcional.
1047. Definir control de tempo (BPM). Criterio: slider.
1048. Definir display de BPM. Criterio: número.
1049. Definir botón clear. Criterio: funcional.
1050. Definir botón random (generar patrón). Criterio: funcional.
1051. Definir sonido de kick (síntesis). Criterio: Web Audio.
1052. Definir sonido de snare. Criterio: síntesis.
1053. Definir sonido de hihat. Criterio: síntesis.
1054. Definir temporizador con Web Audio clock preciso. Criterio: lookahead.
1055. Verificar que el patrón se guarda (localStorage, opcional). Criterio: test.
1056. Verificar que el patrón se carga. Criterio: test.
1057. Verificar que el tempo controla la velocidad. Criterio: test.
1058. Verificar que play/stop funciona correctamente. Criterio: test.
1059. Verificar que clear resetea el patrón. Criterio: test.
1060. Verificar que random genera un patrón válido. Criterio: test.

## 11D. Rhythm box sonido y UX (1061-1080)
1061. Verificar que el clock usa lookahead scheduling (no setInterval). Criterio: precisión.
1062. Verificar que el tempo es estable (no drift). Criterio: test 1 min.
1063. Verificar que el metrónomo visual (step indicator) sincroniza. Criterio: test.
1064. Verificar que las células son accesibles (botones con aria-label). Criterio: presente.
1065. Verificar que el rhythm box se usa con teclado. Criterio: test.
1066. Verificar que el rhythm box se usa con touch. Criterio: test.
1067. Verificar que el rhythm box es responsive. Criterio: visual.
1068. Verificar que el rhythm box se ve bien en mobile. Criterio: grid escala.
1069. Verificar que el sonido no se solapa indebidamente. Criterio: test.
1070. Verificar que el volumen de cada instrumento es ajustable (opcional). Criterio: test.
1071. Verificar que el swing control (si aplica) funciona. Criterio: test.
1072. Verificar que la velocidad por paso (si aplica) funciona. Criterio: test.
1073. Verificar que el export de patrón (si aplica) funciona. Criterio: test.
1074. Verificar que el rhythm box respeta reduced-motion (visual). Criterio: test.
1075. Verificar que el rhythm box no causa jank. Criterio: test.
1076. Verificar que el AudioContext se maneja correctamente. Criterio: resume.
1077. Verificar que el rhythm box se detiene al cambiar de página. Criterio: cleanup.
1078. Verificar que no hay memory leak de nodos. Criterio: test.
1079. Verificar que el rhythm box funciona en los 4 navegadores. Criterio: test.
1080. Documentar el rhythm box en AUDIO.md. Criterio: completo.

## 11E. Sintetizador (1081-1095)
1081. Definir layout del synth (teclado + knobs). Criterio: decisión.
1082. Definir oscilador principal (waveform selectable). Criterio: sine/square/saw.
1083. Definir control de frecuencia/filtro. Criterio: knob.
1084. Definir control de envolvente (ADSR). Criterio: knobs.
1085. Definir control de efectos (delay, reverb). Criterio: knobs.
1086. Definir presets. Criterio: botones.
1087. Definir visualizer del synth. Criterio: canvas.
1088. Verificar que el synth produce sonido al tocar teclas. Criterio: test.
1089. Verificar que cambiar waveform cambia el sonido. Criterio: test.
1090. Verificar que los knobs controlan los parámetros. Criterio: test.
1091. Verificar que los presets cargan. Criterio: test.
1092. Verificar que los presets se guardan (opcional). Criterio: test.
1093. Verificar que el synth es responsive y usables en touch. Criterio: test.
1094. Verificar que el synth respeta reduced-motion. Criterio: test.
1095. Verificar que el synth no causa jank. Criterio: test.

## 11F. Gate instrumentos (1096-1100)
1096. Test: piano suena con click, teclado y touch. Criterio: 3/3.
1097. Test: rhythm box secuencia con tempo correcto. Criterio: test.
1098. Test: synth produce sonido y presets funcionan. Criterio: test.
1099. Test: instrumentos funcionan en los 4 navegadores. Criterio: test.
1100. **GATE FASE 11**: piano OK, rhythm OK, synth OK, sin jank, documentado. Criterio: 5/5 OK.

---

# FASE 12: VOZ, VISUALIZADOR Y GRABADORA (1101-1200)

## 12A. Voice visualizer (1101-1120)
1101. Definir layout del visualizador de voz. Criterio: decisión.
1102. Definir micrófono de entrada (getUserMedia). Criterio: permisos.
1103. Definir barras de frecuencia en tiempo real. Criterio: analyser.
1104. Definir colores según frecuencia. Criterio: tokens.
1105. Definir glow en picos. Criterio: sutil.
1106. Definir interpolación suave de barras. Criterio: lerp.
1107. Definir modos de visualización (opcional). Criterio: selector.
1108. Definir botón de inicio/parada del visualizador. Criterio: funcional.
1109. Definir estado de permisos de micrófono. Criterio: mensajes.
1110. Definir manejo de denegación de micrófono. Criterio: mensaje claro.
1111. Verificar que el visualizador responde al micrófono. Criterio: barras se mueven.
1112. Verificar que el visualizador se detiene al parar. Criterio: sin gasto.
1113. Verificar que el visualizador no causa jank. Criterio: test.
1114. Verificar que el visualizador usa requestAnimationFrame. Criterio: sin leaks.
1115. Verificar que los permisos se piden con interacción de usuario. Criterio: policy.
1116. Verificar que el visualizador funciona en Chrome. Criterio: test.
1117. Verificar que el visualizador funciona en Safari. Criterio: test (getUserMedia).
1118. Verificar que el visualizador funciona en Firefox. Criterio: test.
1119. Verificar que el visualizador es responsive. Criterio: visual.
1120. Verificar que el visualizador respeta reduced-motion. Criterio: test.

## 12B. Voice visualizer UX (1121-1140)
1121. Definir mensaje de "clique para habilitar o microfone". Criterio: i18n.
1122. Definir mensaje de error si no hay micrófono. Criterio: claro.
1123. Definir mensaje de error si permisos denegados. Criterio: claro.
1124. Definir botón de "tentar novamente". Criterio: funcional.
1125. Verificar que los mensajes están en 4 idiomas. Criterio: i18n.
1126. Verificar que el visualizador se detiene al cambiar de idioma. Criterio: cleanup.
1127. Verificar que el visualizador se detiene al salir de la sección. Criterio: IntersectionObserver.
1128. Verificar que el micrófono se libera al detener. Criterio: stop tracks.
1129. Verificar que no hay memory leak de MediaStream. Criterio: test.
1130. Verificar que el visualizador funciona con headphones. Criterio: test.
1131. Verificar que el visualizador es accesible (estado en aria-live). Criterio: presente.
1132. Verificar que el visualizador no bloquea el scroll. Criterio: test.
1133. Verificar que el visualizador es coherente con el diseño. Criterio: tokens.
1134. Verificar que el visualizador no duplica funcionalidad de la grabadora. Criterio: separado.
1135. Verificar que el visualizador se ve bien en dark. Criterio: revisión.
1136. Verificar que el visualizador funciona con baja latencia. Criterio: test.
1137. Verificar que el visualizador no consume CPU cuando idle. Criterio: test.
1138. Verificar que el visualizador es consistente en 4 idiomas. Criterio: revisión.
1139. Verificar que el visualizador no tiene texto hardcodeado. Criterio: grep.
1140. Documentar el visualizador en AUDIO.md. Criterio: completo.

## 12C. Voice recorder (1141-1160)
1141. Definir layout de la grabadora. Criterio: decisión.
1142. Definir botón de grabar. Criterio: funcional.
1143. Definir botón de detener. Criterio: funcional.
1144. Definir botón de reproducir. Criterio: funcional.
1145. Definir botón de descargar. Criterio: funcional.
1146. Definir display de tiempo. Criterio: mm:ss.
1147. Definir indicador de estado (grabando/reposo). Criterio: visual + aria-live.
1148. Definir display de forma de onda grabada. Criterio: canvas.
1149. Definir permisos de micrófono. Criterio: policy.
1150. Definir manejo de errores. Criterio: mensajes.
1151. Verificar que grabar captura audio real. Criterio: test.
1152. Verificar que detener corta la grabación. Criterio: test.
1153. Verificar que reproducir toca la grabación. Criterio: test.
1154. Verificar que descargar genera un archivo (WAV/WebM). Criterio: test.
1155. Verificar que el tiempo cuenta correctamente. Criterio: test.
1156. Verificar que el indicador de estado cambia. Criterio: test.
1157. Verificar que la forma de onda se dibuja. Criterio: canvas.
1158. Verificar que la forma de onda refleja la grabación real. Criterio: test.
1159. Verificar que grabar no funciona sin permisos. Criterio: test.
1160. Verificar que la grabación no se pierde al cambiar de idioma. Criterio: cleanup seguro.

## 12D. Recorder UX y efectos (1161-1180)
1161. Definir mensajes de error de grabadora en 4 idiomas. Criterio: i18n.
1162. Definir botón de "tentar novamente" si falla. Criterio: funcional.
1163. Verificar que la grabadora se detiene al salir de la sección. Criterio: cleanup.
1164. Verificar que el micrófono se libera al detener. Criterio: stop tracks.
1165. Verificar que no hay memory leak de MediaRecorder. Criterio: test.
1166. Verificar que la grabadora funciona en Chrome. Criterio: test.
1167. Verificar que la grabadora funciona en Safari. Criterio: test.
1168. Verificar que la grabadora funciona en Firefox. Criterio: test.
1169. Verificar que la grabadora funciona en iOS Safari. Criterio: test.
1170. Verificar que la grabadora es responsive. Criterio: visual.
1171. Verificar que la grabadora es accesible (botones con labels). Criterio: presente.
1172. Verificar que la grabadora respeta reduced-motion (waveform). Criterio: test.
1173. Verificar que la grabadora no causa jank. Criterio: test.
1174. Verificar que la grabadora usa el formato de audio correcto. Criterio: mimeType.
1175. Verificar que el archivo descargado se puede reproducir. Criterio: test.
1176. Verificar que el archivo tiene nombre correcto. Criterio: duck-recording.
1177. Verificar que la grabadora no supera límite de tiempo (opcional). Criterio: test.
1178. Verificar que la grabadora muestra advertencia de duración. Criterio: i18n.
1179. Verificar que la grabadora es coherente con el diseño. Criterio: tokens.
1180. Documentar la grabadora en AUDIO.md. Criterio: completo.

## 12E. Metrónomo y lyrics (1181-1195)
1181. Definir metrónomo con BPM. Criterio: funcional.
1182. Definir control de tempo del metrónomo. Criterio: slider.
1183. Definir acento en el primer beat. Criterio: distinto sonido.
1184. Definir display de beats per measure. Criterio: selector.
1185. Definir play/stop del metrónomo. Criterio: funcional.
1186. Definir lyrics generator. Criterio: datos.
1187. Definir líneas de lyrics suficientes. Criterio: 8+ líneas.
1188. Definir display de lyrics. Criterio: render.
1189. Verificar que el metrónomo mantiene tempo estable. Criterio: test.
1190. Verificar que el metrónomo usa lookahead clock. Criterio: precisión.
1191. Verificar que el metrónomo se detiene al salir de la sección. Criterio: cleanup.
1192. Verificar que el metrónomo respeta reduced-motion. Criterio: visual off.
1193. Verificar que los lyrics se traducen a 4 idiomas. Criterio: i18n.
1194. Verificar que el lyrics generator no tiene texto hardcodeado. Criterio: grep.
1195. Verificar que el metrónomo no causa jank. Criterio: test.

## 12F. Gate voz/recorder (1196-1200)
1196. Test: visualizador responde al micrófono. Criterio: test.
1197. Test: grabadora graba, reproduce y descarga. Criterio: 3/3.
1198. Test: metrónomo mantiene tempo. Criterio: test.
1199. Test: permisos y errores manejados en 4 idiomas. Criterio: test.
1200. **GATE FASE 12**: visualizador OK, recorder OK, metrónomo OK, sin leaks, documentado. Criterio: 5/5 OK.

---

# FASE 13: VISUALIZACIÓN 3D Y EFECTOS (1201-1300)

## 13A. Three.js setup (1201-1220)
1201. Decidir si la web usa Three.js/3D. Criterio: decisión en DECISIONES.md.
1202. Si 3D: verificar que Three.js está cargado (local o CDN). Criterio: window.THREE existe.
1203. Si 3D: crear escena. Criterio: Scene.
1204. Si 3D: configurar cámara (PerspectiveCamera). Criterio: fov correcto.
1205. Si 3D: configurar renderer (WebGL). Criterio: canvas.
1206. Si 3D: configurar luces (ambient + point). Criterio: iluminación.
1207. Si 3D: configurar materiales. Criterio: PBR o MeshStandard.
1208. Si 3D: cargar texturas. Criterio: sin errores.
1209. Si 3D: configurar post-processing (si aplica). Criterio: UnrealBloom/Pass.
1210. Si 3D: configurar el tamaño responsive. Criterio: resize.
1211. Si 3D: configurar devicePixelRatio. Criterio: nitidez.
1212. Si 3D: limitar DPR en mobile. Criterio: <= 2.
1213. Si 3D: verificar que la escena renderiza. Criterio: canvas con contenido.
1214. Si 3D: verificar que no hay errores en consola. Criterio: 0.
1215. Si 3D: verificar que el renderer usa requestAnimationFrame. Criterio: loop.
1216. Si 3D: verificar que el loop se pausa fuera de viewport. Criterio: IntersectionObserver.
1217. Si 3D: verificar que el loop se limpia en cleanup. Criterio: sin leaks.
1218. Si 3D: verificar que funciona en Chrome. Criterio: test.
1219. Si 3D: verificar que funciona en Safari. Criterio: test.
1220. Si 3D: verificar que funciona en mobile. Criterio: test.

## 13B. Logo 3D (1221-1240)
1221. Si 3D: crear geometría del logo (o importar modelo). Criterio: visible.
1222. Si 3D: aplicar material al logo. Criterio: coherente con marca.
1223. Si 3D: definir animación de rotación idle. Criterio: lenta y suave.
1224. Si 3D: definir interacción con mouse (parallax). Criterio: sutil.
1225. Si 3D: definir interacción con scroll. Criterio: rotación/desplazamiento.
1226. Si 3D: definir hover effect (escala/glow). Criterio: sutil.
1227. Si 3D: definir click interaction (opcional). Criterio: test.
1228. Si 3D: definir responsive scaling. Criterio: se adapta.
1229. Si 3D: verificar que el logo no bloquea el render del resto. Criterio: test.
1230. Si 3D: verificar que el logo es nítido. Criterio: DPR.
1231. Si 3D: verificar que el logo no causa jank. Criterio: test.
1232. Si 3D: verificar que el logo respeta reduced-motion. Criterio: rotación off.
1233. Si 3D: verificar que el logo tiene fallback 2D si WebGL falla. Criterio: imagen.
1234. Si 3D: verificar que el fallback se activa en low-end. Criterio: test.
1235. Si 3D: verificar que el logo se ve bien en dark. Criterio: luz.
1236. Si 3D: verificar que el logo se ve bien en mobile. Criterio: tamaño.
1237. Si 3D: verificar que el logo no interfiere con clicks. Criterio: raycast correcto.
1238. Si 3D: verificar que el logo se detiene fuera de viewport. Criterio: test.
1239. Si 3D: documentar el logo 3D. Criterio: docs.
1240. Si NO 3D: verificar que el logo es SVG/PNG nítido y animado con CSS/GSAP. Criterio: coherente.

## 13C. Sistema de partículas (1241-1260)
1241. Si 3D: crear emisor de partículas. Criterio: Points.
1242. Si 3D: definir física de partículas (velocidad, gravedad). Criterio: coherente.
1243. Si 3D: definir colores de partículas. Criterio: tokens.
1244. Si 3D: definir tamaños de partículas. Criterio: variados.
1245. Si 3D: definir ciclo de vida (spawn/despawn). Criterio: pool.
1246. Si 3D: definir interacción con mouse (atraer/repeler). Criterio: sutil.
1247. Si 3D: definir interacción con scroll. Criterio: sutil.
1248. Si 3D: verificar que las partículas no causan jank. Criterio: 60fps.
1249. Si 3D: verificar que el pool no crece sin límite. Criterio: fixed count.
1250. Si 3D: verificar que las partículas respetan reduced-motion. Criterio: off.
1251. Si 3D: verificar que las partículas funcionan en mobile. Criterio: count reducido.
1252. Si 3D: verificar que las partículas se detienen fuera de viewport. Criterio: test.
1253. Si 3D: verificar que las partículas se limpian. Criterio: sin leaks.
1254. Si 3D: verificar que las partículas no bloquean el render principal. Criterio: test.
1255. Si 3D: verificar que las partículas se ven bien en dark. Criterio: contraste.
1256. Si 3D: verificar que las partículas no distraen del contenido. Criterio: sutil.
1257. Si 3D: verificar que las partículas usan buffer attributes eficientes. Criterio: test.
1258. Si 3D: verificar que el sistema se pausa en background tab. Criterio: test.
1259. Si 3D: documentar el sistema de partículas. Criterio: docs.
1260. Si NO 3D: verificar que el fondo usa canvas 2D o CSS animado sutil. Criterio: eficiente.

## 13D. Canvas 2D / fondo (1261-1280)
1261. Decidir si hay fondo animado (canvas 2D, CSS, o estático). Criterio: decisión.
1262. Si canvas 2D: crear contexto 2D. Criterio: sin errores.
1263. Si canvas 2D: definir dibujo del fondo (ondas, grid, etc.). Criterio: coherente.
1264. Si canvas 2D: definir animación con rAF. Criterio: sin leaks.
1265. Si canvas 2D: definir pause fuera de viewport. Criterio: IntersectionObserver.
1266. Si canvas 2D: definir responsive (redraw al resize). Criterio: test.
1267. Si canvas 2D: limitar DPR. Criterio: mobile <= 2.
1268. Si canvas 2D: verificar que no causa jank. Criterio: 60fps.
1269. Si canvas 2D: verificar que respeta reduced-motion. Criterio: estático.
1270. Si canvas 2D: verificar que no interfiere con clicks. Criterio: pointer-events.
1271. Si canvas 2D: verificar que funciona en Safari. Criterio: test.
1272. Si canvas 2D: verificar que funciona en mobile. Criterio: test.
1273. Si canvas 2D: verificar que se pausa en background tab. Criterio: test.
1274. Si canvas 2D: verificar que no consume CPU idle. Criterio: test.
1275. Si CSS animado: verificar que es GPU-accelerated (transform/opacity). Criterio: test.
1276. Si CSS animado: verificar que no causa repaint excesivo. Criterio: test.
1277. Verificar que el fondo no distrae del contenido. Criterio: legibilidad.
1278. Verificar que el fondo es consistente en toda la página. Criterio: revisión.
1279. Documentar el fondo. Criterio: docs.
1280. Verificar que el fondo no aumenta el LCP. Criterio: medido.

## 13E. Efectos visuales (1281-1295)
1281. Definir efecto de glitch (si aplica). Criterio: sutil y en hover.
1282. Verificar que el glitch no causa epilepsia (no flicker). Criterio: revisión.
1283. Definir efecto de texto split/reveal (si aplica). Criterio: GSAP.
1284. Verificar que el texto split no rompe si JS falla. Criterio: fallback.
1285. Definir efecto de borde draw (si aplica). Criterio: SVG.
1286. Verificar que los efectos SVG usan líneas simples. Criterio: no manual complejo.
1287. Definir efecto de grain/noise (si aplica). Criterio: sutil.
1288. Verificar que el grain no pesa (SVG inline). Criterio: < 5KB.
1289. Verificar que los efectos respetan reduced-motion. Criterio: todos off.
1290. Verificar que los efectos no causan jank. Criterio: test.
1291. Verificar que los efectos no bloquean interacción. Criterio: pointer-events.
1292. Verificar que los efectos son consistentes en toda la web. Criterio: tokens.
1293. Verificar que los efectos no son excesivos (anti-slop). Criterio: revisión.
1294. Verificar que los efectos funcionan en mobile (GPU). Criterio: test.
1295. Documentar los efectos en ANIMACIONES.md. Criterio: completo.

## 13F. Gate 3D/efectos (1296-1300)
1296. Test: el 3D (si aplica) renderiza sin errores. Criterio: test.
1297. Test: los efectos visuales funcionan sin jank. Criterio: test.
1298. Test: todo respeta reduced-motion. Criterio: test.
1299. Test: la web funciona si WebGL falla (fallback). Criterio: test.
1300. **GATE FASE 13**: 3D OK o fallback OK, efectos OK, sin jank, documentado. Criterio: 4/4 OK.

---

# FASE 14: AUDIO ENGINE Y SONIDO (1301-1400)

## 14A. Arquitectura de audio (1301-1320)
1301. Verificar que hay un único AudioContext compartido. Criterio: audio.js.
1302. Verificar que el AudioContext se crea con interacción. Criterio: policy.
1303. Verificar que el AudioContext se resume si se suspende. Criterio: JS.
1304. Definir master gain (volumen global). Criterio: nodo.
1305. Definir compressor master (limitar peaks). Criterio: DynamicsCompressor.
1306. Definir ruta de señal: instruments → master → destination. Criterio: conexión.
1307. Definir analizador master (para visualizers). Criterio: AnalyserNode.
1308. Definir manejo de errores de audio. Criterio: try/catch.
1309. Verificar que no hay múltiples AudioContexts. Criterio: singleton.
1310. Verificar que los nodos se desconectan al limpiar. Criterio: no leaks.
1311. Verificar que el audio no empieza sin interacción. Criterio: test.
1312. Verificar que el master gain controla todo. Criterio: test.
1313. Verificar que el compressor previene clipping. Criterio: test.
1314. Verificar que el analizador alimenta los visualizers. Criterio: test.
1315. Verificar que el audio funciona en Chrome. Criterio: test.
1316. Verificar que el audio funciona en Safari. Criterio: test (webkit prefix).
1317. Verificar que el audio funciona en Firefox. Criterio: test.
1318. Verificar que el audio funciona en iOS. Criterio: test.
1319. Verificar que el audio funciona con headphones. Criterio: stereo.
1320. Documentar la arquitectura de audio en AUDIO.md. Criterio: diagrama.

## 14B. Síntesis de sonido (1321-1340)
1321. Definir función playNote(freq, duration). Criterio: oscilador.
1322. Definir envelope ADSR. Criterio: gain automation.
1323. Definir síntesis de kick. Criterio: pitch drop.
1324. Definir síntesis de snare. Criterio: noise + tone.
1325. Definir síntesis de hihat. Criterio: highpass noise.
1326. Definir síntesis de bass. Criterio: low osc.
1327. Definir síntesis de lead. Criterio: saw osc.
1328. Definir síntesis de pad. Criterio: detuned oscs.
1329. Definir efectos de voz (reverb, delay). Criterio: nodos.
1330. Verificar que cada sonido suena correcto. Criterio: escucha.
1331. Verificar que los sonidos no clip. Criterio: nivel.
1332. Verificar que los sonidos se detienen a tiempo. Criterio: no sustain infinito.
1333. Verificar que los sonidos no se solapan mal. Criterio: test.
1334. Verificar que las frecuencias son correctas. Criterio: tabla.
1335. Verificar que los envolventes son suaves (no clicks). Criterio: attack/release.
1336. Verificar que el noise usa buffer reutilizado. Criterio: no alloc cada vez.
1337. Verificar que la síntesis es eficiente en CPU. Criterio: test.
1338. Verificar que la síntesis funciona en mobile. Criterio: test.
1339. Verificar que la síntesis es consistente entre navegadores. Criterio: test.
1340. Documentar los sonidos. Criterio: AUDIO.md.

## 14C. Efectos (1341-1360)
1341. Definir delay con feedback. Criterio: DelayNode.
1342. Definir reverb (convolver o simple). Criterio: nodo.
1343. Definir chorus (si aplica). Criterio: modulación.
1344. Definir flanger (si aplica). Criterio: modulación.
1345. Definir filter (lowpass/highpass). Criterio: BiquadFilter.
1346. Definir distortion (si aplica). Criterio: WaveShaper.
1347. Definir control de mix de efectos (dry/wet). Criterio: gain.
1348. Definir presets de efectos. Criterio: combinaciones.
1349. Verificar que los efectos se aplican en cadena correcta. Criterio: ruta.
1350. Verificar que el dry/wet funciona. Criterio: test.
1351. Verificar que los efectos no causan feedback. Criterio: test.
1352. Verificar que los efectos no clip. Criterio: nivel.
1353. Verificar que los efectos se desactivan correctamente. Criterio: bypass.
1354. Verificar que los presets cargan. Criterio: test.
1355. Verificar que los efectos son eficientes en CPU. Criterio: test.
1356. Verificar que los efectos funcionan en mobile. Criterio: test.
1357. Verificar que los efectos son consistentes entre navegadores. Criterio: test.
1358. Verificar que los efectos respetan el master volume. Criterio: test.
1359. Verificar que los efectos se limpian al cambiar. Criterio: no leaks.
1360. Documentar los efectos. Criterio: AUDIO.md.

## 14D. Integración de instrumentos (1361-1380)
1361. Verificar que el piano usa audio.js. Criterio: no duplicado.
1362. Verificar que el rhythm box usa audio.js. Criterio: no duplicado.
1363. Verificar que el synth usa audio.js. Criterio: no duplicado.
1364. Verificar que el metrónomo usa audio.js. Criterio: no duplicado.
1365. Verificar que el voice visualizer usa audio.js. Criterio: no duplicado.
1366. Verificar que la grabadora usa audio.js. Criterio: no duplicado.
1367. Verificar que ningún instrumento crea su propio AudioContext. Criterio: singleton.
1368. Verificar que los instrumentos se detienen entre sí si es necesario. Criterio: test.
1369. Verificar que el master volume afecta a todos. Criterio: test.
1370. Verificar que el visualizador master muestra todo. Criterio: test.
1371. Verificar que cambiar de instrumento no deja sonido colgado. Criterio: cleanup.
1372. Verificar que el AudioContext no se crea al cargar la página. Criterio: policy.
1373. Verificar que el AudioContext se crea al primer clic. Criterio: test.
1374. Verificar que el estado de audio se indica en la UI. Criterio: icono.
1375. Verificar que el indicador de audio es accesible. Criterio: aria.
1376. Verificar que los instrumentos funcionan juntos sin conflicto. Criterio: test.
1377. Verificar que los instrumentos son consistentes en los 4 navegadores. Criterio: test.
1378. Verificar que los instrumentos son eficientes en CPU juntos. Criterio: test.
1379. Documentar la integración. Criterio: AUDIO.md.
1380. Verificar que el audio no rompe si un instrumento falla. Criterio: aislamiento.

## 14E. Rendimiento de audio (1381-1395)
1381. Verificar que el audio no causa jank en la UI. Criterio: test.
1382. Verificar que el audio usa nodos de manera eficiente. Criterio: revisión.
1383. Verificar que no hay nodos que se crean por frame. Criterio: pool.
1384. Verificar que el visualizador no dibuja cuando no hay audio. Criterio: test.
1385. Verificar que el visualizador usa barras eficientes. Criterio: count razonable.
1386. Verificar que el audio se pausa en background tab. Criterio: test.
1387. Verificar que el audio se reanuda al volver. Criterio: test.
1388. Verificar que el audio no consume batería en idle. Criterio: test.
1389. Verificar que el audio funciona con baja latencia. Criterio: test.
1390. Verificar que el audio respeta el volumen del sistema. Criterio: test.
1391. Verificar que el audio no tiene zumbido/ruido de fondo. Criterio: escucha.
1392. Verificar que el audio no se distorsiona a volumen alto. Criterio: compressor.
1393. Verificar que el audio se mantiene en sync con las animaciones. Criterio: test.
1394. Verificar que el audio se documenta con diagrama de flujo. Criterio: docs.
1395. Verificar que el audio funciona con el test de 10 minutos (sin drift). Criterio: test.

## 14F. Gate audio (1396-1400)
1396. Test: todos los instrumentos suenan correctamente. Criterio: escucha.
1397. Test: el master volume controla todos los instrumentos. Criterio: test.
1398. Test: los efectos y presets funcionan. Criterio: test.
1399. Test: el audio es estable en 10 minutos. Criterio: sin drift.
1400. **GATE FASE 14**: arquitectura OK, síntesis OK, efectos OK, integración OK, sin leaks. Criterio: 5/5 OK.

---

# FASE 15: ANIMACIONES GSAP Y MICROINTERACCIONES (1401-1500)

## 15A. GSAP setup (1401-1420)
1401. Verificar que GSAP está cargado. Criterio: window.gsap existe.
1402. Verificar que ScrollTrigger está registrado. Criterio: plugin registrado.
1403. Verificar que ScrollSmoother (si aplica) está registrado. Criterio: registrado.
1404. Verificar que SplitText (si aplica) está registrado. Criterio: registrado.
1405. Definir helpers comunes (fadeUp, fadeIn). Criterio: funciones reutilizables.
1406. Definir config global de easing. Criterio: CustomEase o tokens.
1407. Definir config global de duración. Criterio: tokens.
1408. Definir función de init de animaciones. Criterio: main.js.
1409. Definir función de cleanup de animaciones. Criterio: gsap.context.
1410. Verificar que gsap.context se usa (evitar leaks). Criterio: patrón.
1411. Verificar que las animaciones se revierten al cambiar de sección. Criterio: test.
1412. Verificar que las animaciones se revierten al cambiar de idioma. Criterio: test.
1413. Verificar que gsap no anima elementos fuera de viewport. Criterio: ScrollTrigger.
1414. Verificar que gsap no causa jank. Criterio: 60fps.
1415. Verificar que gsap respeta reduced-motion. Criterio: matchMedia.
1416. Verificar que gsap funciona en Chrome. Criterio: test.
1417. Verificar que gsap funciona en Safari. Criterio: test.
1418. Verificar que gsap funciona en Firefox. Criterio: test.
1419. Verificar que gsap funciona en mobile. Criterio: test.
1420. Documentar el setup de gsap. Criterio: ANIMACIONES.md.

## 15B. ScrollTrigger (1421-1440)
1421. Definir animación de entrada de secciones (fade-up). Criterio: todas las secciones.
1422. Definir stagger de cards (tracks, stations). Criterio: retardo en cascada.
1423. Definir parallax de imágenes. Criterio: sutil.
1424. Definir contadores (stats) al entrar en viewport. Criterio: once.
1425. Definir barra de progreso de scroll. Criterio: global.
1426. Definir pin de sección (si aplica). Criterio: decisión.
1427. Definir scrub de animaciones (si aplica). Criterio: vinculadas al scroll.
1428. Verificar que cada ScrollTrigger tiene toggleActions correcto. Criterio: play/reverse.
1429. Verificar que los triggers no se disparan en load (fuera de viewport). Criterio: test.
1430. Verificar que los triggers se actualizan al resize. Criterio: ScrollTrigger.refresh().
1431. Verificar que los triggers se actualizan al cambiar idioma. Criterio: refresh.
1432. Verificar que los triggers se actualizan al cargar imágenes (layout). Criterio: refresh.
1433. Verificar que los triggers no causan jank al scrollear. Criterio: test.
1434. Verificar que los triggers respetan reduced-motion. Criterio: sin scrub.
1435. Verificar que los triggers se limpian en cleanup. Criterio: kill().
1436. Verificar que no hay triggers huérfanos. Criterio: test.
1437. Verificar que los triggers funcionan en mobile. Criterio: test.
1438. Verificar que los triggers funcionan en Safari. Criterio: test.
1439. Verificar que los triggers no rompen el scroll nativo. Criterio: test.
1440. Documentar cada trigger en ANIMACIONES.md. Criterio: tabla.

## 15C. Microinteracciones (1441-1460)
1441. Definir hover en botones (escala, sombra). Criterio: sutil.
1442. Definir hover en cards de tracks (lift). Criterio: transform.
1443. Definir hover en cards de stations (zoom imagen). Criterio: sutil.
1444. Definir hover en links de nav (underline animado). Criterio: sutil.
1445. Definir hover en social links (color/glow). Criterio: sutil.
1446. Definir click en botones (press). Criterio: escala 0.98.
1447. Definir focus en inputs (glow). Criterio: focus-visible.
1448. Definir toggle switch animado (si aplica). Criterio: suave.
1449. Definir loading skeleton shimmer. Criterio: CSS.
1450. Definir success checkmark (si aplica). Criterio: animado.
1451. Verificar que las microinteracciones no bloquean clicks. Criterio: test.
1452. Verificar que las microinteracciones respetan reduced-motion. Criterio: off.
1453. Verificar que las microinteracciones no causan repaint excesivo. Criterio: GPU.
1454. Verificar que las microinteracciones son consistentes. Criterio: tokens.
1455. Verificar que las microinteracciones no son excesivas (anti-slop). Criterio: revisión.
1456. Verificar que las microinteracciones funcionan en touch (hover fallback). Criterio: test.
1457. Verificar que las microinteracciones funcionan en mobile. Criterio: test.
1458. Verificar que las microinteracciones son accesibles (no solo color). Criterio: test.
1459. Verificar que las microinteracciones usan transform/opacity. Criterio: GPU.
1460. Documentar las microinteracciones. Criterio: ANIMACIONES.md.

## 15D. Texto y reveals (1461-1480)
1461. Definir reveal de headings al entrar en viewport. Criterio: fade-up.
1462. Definir reveal de párrafos. Criterio: fade.
1463. Definir split text en headings (si aplica). Criterio: por palabra/letra.
1464. Verificar que el split text se recompone al resize. Criterio: test.
1465. Verificar que el split text respeta idiomas acentuados. Criterio: test.
1466. Verificar que el split text respeta reduced-motion. Criterio: sin split.
1467. Verificar que el split text no rompe si JS falla. Criterio: texto visible.
1468. Verificar que el split text no causa CLS. Criterio: medido.
1469. Verificar que el split text funciona en mobile. Criterio: test.
1470. Verificar que el split text no causa jank. Criterio: test.
1471. Definir reveal de imágenes (clip o fade). Criterio: sutil.
1472. Verificar que los reveals no bloquean lectura. Criterio: rápidos.
1473. Verificar que los reveals son consistentes en toda la web. Criterio: helpers.
1474. Verificar que los reveals funcionan con lazy loading. Criterio: sync.
1475. Verificar que los reveals se reinician al cambiar idioma. Criterio: refresh.
1476. Verificar que los reveals son accesibles (contenido visible). Criterio: fallback.
1477. Verificar que los reveals no son excesivos. Criterio: anti-slop.
1478. Verificar que los reveals funcionan en todos los navegadores. Criterio: test.
1479. Verificar que los reveals no superan 600ms. Criterio: tokens.
1480. Documentar los reveals. Criterio: ANIMACIONES.md.

## 15E. Transiciones y easter egg (1481-1495)
1481. Definir transición de carga inicial (intro). Criterio: corta.
1482. Verificar que la intro no bloquea la lectura (skip). Criterio: < 1.5s o saltable.
1483. Verificar que la intro respeta reduced-motion. Criterio: sin intro.
1484. Definir transición de cambio de idioma (fade). Criterio: suave.
1485. Verificar que la transición de idioma no pierde estado. Criterio: test.
1486. Definir easter egg de DUCK (scroll o teclas). Criterio: coherente con marca.
1487. Verificar que el easter egg es descubrible. Criterio: pista sutil.
1488. Verificar que el easter egg funciona en desktop. Criterio: test.
1489. Verificar que el easter egg funciona en mobile (si aplica). Criterio: test.
1490. Verificar que el easter egg respeta reduced-motion. Criterio: test.
1491. Verificar que el easter egg no interfiere con el resto. Criterio: test.
1492. Verificar que el easter egg se puede activar varias veces. Criterio: test.
1493. Verificar que el easter egg no causa jank. Criterio: test.
1494. Verificar que el easter egg es consistente con la marca. Criterio: revisión.
1495. Documentar el easter egg. Criterio: ANIMACIONES.md.

## 15F. Gate animaciones (1496-1500)
1496. Test: todas las secciones animan al entrar. Criterio: visual.
1497. Test: los contadores y parallax funcionan. Criterio: test.
1498. Test: las microinteracciones responden. Criterio: test.
1499. Test: todo respeta reduced-motion. Criterio: test.
1500. **GATE FASE 15**: GSAP setup OK, triggers OK, micro OK, reveals OK, sin leaks. Criterio: 5/5 OK.

---

# FASE 16: i18n Y TRADUCCIONES (1501-1600)

## 16A. Sistema i18n (1501-1520)
1501. Verificar que hay un archivo de diccionarios (js/i18n.js). Criterio: existe.
1502. Definir estructura de diccionarios (pt/es/en/fr). Criterio: 4 objetos.
1503. Definir función t(key). Criterio: traduce por clave.
1504. Definir función de detección de idioma inicial. Criterio: localStorage > navigator > default.
1505. Definir default pt-BR. Criterio: primera carga.
1506. Definir persistencia en localStorage. Criterio: reload mantiene.
1507. Definir actualización del atributo lang. Criterio: document.documentElement.lang.
1508. Definir actualización de textos estáticos. Criterio: data-i18n.
1509. Definir actualización de textos dinámicos. Criterio: re-render.
1510. Definir actualización de title y meta description. Criterio: document.title.
1511. Verificar que t() no devuelve undefined. Criterio: fallback a clave.
1512. Verificar que las claves no tienen espacios raros. Criterio: convención.
1513. Verificar que el sistema funciona sin JS (solo PT). Criterio: fallback.
1514. Verificar que el sistema es eficiente (no re-render de toda la página). Criterio: test.
1515. Verificar que el sistema no causa jank al cambiar idioma. Criterio: test.
1516. Verificar que el sistema funciona en los 4 navegadores. Criterio: test.
1517. Verificar que el sistema maneja texto largo en otros idiomas. Criterio: layout.
1518. Verificar que el sistema maneja caracteres acentuados. Criterio: test.
1519. Documentar el sistema i18n. Criterio: I18N.md.
1520. Verificar que no hay textos hardcodeados en HTML. Criterio: grep.

## 16B. Diccionario PT (1521-1540)
1521. Escribir todas las claves en PT-BR. Criterio: completo.
1522. Verificar que la navegación tiene claves PT. Criterio: 5 links.
1523. Verificar que el hero tiene claves PT. Criterio: 6+ claves.
1524. Verificar que stats tiene claves PT. Criterio: 3+ claves.
1525. Verificar que About tiene claves PT. Criterio: 4+ claves.
1526. Verificar que la timeline tiene claves PT. Criterio: N hitos.
1527. Verificar que Tracks tiene claves PT (título, filtros, estados). Criterio: 8+ claves.
1528. Verificar que Studio tiene claves PT. Criterio: 6+ claves.
1529. Verificar que Gear tiene claves PT. Criterio: 4+ claves.
1530. Verificar que los instrumentos tienen claves PT. Criterio: labels.
1531. Verificar que Contact tiene claves PT. Criterio: 6+ claves.
1532. Verificar que el Footer tiene claves PT. Criterio: 4+ claves.
1533. Verificar que los easter eggs tienen claves PT. Criterio: presente.
1534. Verificar que los mensajes de error tienen claves PT. Criterio: presente.
1535. Verificar que los placeholders tienen claves PT. Criterio: presente.
1536. Verificar que los tooltips tienen claves PT. Criterio: presente.
1537. Verificar que los toasts tienen claves PT. Criterio: presente.
1538. Verificar que el copy de PT está sin typos. Criterio: revisión.
1539. Verificar que el PT es natural (no traducción literal). Criterio: revisión.
1540. Congelar diccionario PT. Criterio: aprobado.

## 16C. Diccionario ES (1541-1560)
1541. Escribir todas las claves en ES. Criterio: completa (mismas keys).
1542. Verificar que ES tiene las mismas keys que PT. Criterio: diff 0 faltantes.
1543. Verificar que ES no tiene claves extra. Criterio: diff 0 extra.
1544. Verificar que ES no tiene textos en portugués. Criterio: grep.
1545. Verificar que ES no tiene textos en inglés. Criterio: grep.
1546. Verificar que el copy de ES es natural. Criterio: revisión.
1547. Verificar que ES maneja tildes correctamente. Criterio: test.
1548. Verificar que los textos largos de ES no rompen el layout. Criterio: test.
1549. Verificar que los botones de ES no son demasiado largos. Criterio: visual.
1550. Verificar que los headings de ES no se cortan. Criterio: visual.
1551. Verificar que los mensajes de error de ES existen. Criterio: presente.
1552. Verificar que los placeholders de ES existen. Criterio: presente.
1553. Verificar que los tooltips de ES existen. Criterio: presente.
1554. Verificar que los toasts de ES existen. Criterio: presente.
1555. Verificar que la nav de ES está completa. Criterio: 5 links.
1556. Verificar que el hero de ES está completo. Criterio: 6+ claves.
1557. Verificar que los instrumentos de ES están completos. Criterio: labels.
1558. Verificar que el contacto de ES está completo. Criterio: 6+ claves.
1559. Verificar que el copy de ES está sin typos. Criterio: revisión.
1560. Congelar diccionario ES. Criterio: aprobado.

## 16D. Diccionario EN (1561-1580)
1561. Escribir todas las claves en EN. Criterio: completa (mismas keys).
1562. Verificar que EN tiene las mismas keys que PT. Criterio: diff 0 faltantes.
1563. Verificar que EN no tiene claves extra. Criterio: diff 0 extra.
1564. Verificar que EN no tiene textos en portugués/español. Criterio: grep.
1565. Verificar que el copy de EN es natural (no portuñol). Criterio: revisión.
1566. Verificar que EN maneja palabras largas correctamente. Criterio: layout.
1567. Verificar que los textos largos de EN no rompen el layout. Criterio: test.
1568. Verificar que los botones de EN no son demasiado largos. Criterio: visual.
1569. Verificar que los headings de EN no se cortan. Criterio: visual.
1570. Verificar que los mensajes de error de EN existen. Criterio: presente.
1571. Verificar que los placeholders de EN existen. Criterio: presente.
1572. Verificar que los tooltips de EN existen. Criterio: presente.
1573. Verificar que los toasts de EN existen. Criterio: presente.
1574. Verificar que la nav de EN está completa. Criterio: 5 links.
1575. Verificar que el hero de EN está completo. Criterio: 6+ claves.
1576. Verificar que los instrumentos de EN están completos. Criterio: labels.
1577. Verificar que el contacto de EN está completo. Criterio: 6+ claves.
1578. Verificar que el copy de EN está sin typos. Criterio: revisión.
1579. Verificar que EN funciona con la URL de streaming (en inglés). Criterio: test.
1580. Congelar diccionario EN. Criterio: aprobado.

## 16E. Diccionario FR (1581-1595)
1581. Escribir todas las claves en FR. Criterio: completa (mismas keys).
1582. Verificar que FR tiene las mismas keys que PT. Criterio: diff 0 faltantes.
1583. Verificar que FR no tiene claves extra. Criterio: diff 0 extra.
1584. Verificar que FR no tiene textos en otros idiomas. Criterio: grep.
1585. Verificar que el copy de FR es natural. Criterio: revisión.
1586. Verificar que FR maneja acentos correctamente. Criterio: test.
1587. Verificar que los textos largos de FR no rompen el layout. Criterio: test.
1588. Verificar que los botones de FR no son demasiado largos. Criterio: visual.
1589. Verificar que los headings de FR no se cortan. Criterio: visual.
1590. Verificar que los mensajes de error de FR existen. Criterio: presente.
1591. Verificar que los placeholders de FR existen. Criterio: presente.
1592. Verificar que los tooltips de FR existen. Criterio: presente.
1593. Verificar que los toasts de FR existen. Criterio: presente.
1594. Verificar que la nav y hero de FR están completos. Criterio: presente.
1595. Congelar diccionario FR. Criterio: aprobado.

## 16F. Gate i18n (1596-1600)
1596. Verificar que los 4 diccionarios tienen las mismas keys. Criterio: diff 0.
1597. Test: cambiar a ES muestra todo en español. Criterio: visual.
1598. Test: cambiar a EN muestra todo en inglés. Criterio: visual.
1599. Test: cambiar a FR muestra todo en francés. Criterio: visual.
1600. **GATE FASE 16**: sistema OK, PT/ES/EN/FR completos y aprobados. Criterio: 5/5 OK.

---

# FASE 17: RECURSOS 21ST.DEV Y ROBOT INTERACTIVO (1601-1700)

## 17A. Robot mascota interactivo (1601-1620)
1601. Verificar que el robot mascota CSS existe en la base (`.duck-robot-mascot`). Criterio: presente en DOM.
1602. Definir anatomía del robot (cabeza, cuerpo, ojos, antena, brazos). Criterio: 5+ partes con clases.
1603. Definir animación idle (blink, balanceo). Criterio: @keyframes robotBlink.
1604. Definir hover state (glow + ojos siguen cursor). Criterio: JS con mousemove.
1605. Definir interacción click (bounce o sonido). Criterio: evento click.
1606. Verificar que el robot respeta reduced-motion. Criterio: animación off.
1607. Verificar que el robot no bloquea clicks de contenido. Criterio: pointer-events en wrapper.
1608. Definir posición del robot (fixed corner o sección). Criterio: decisión visual.
1609. Verificar que el robot es visible en mobile. Criterio: tamaño adaptado.
1610. Verificar que el robot no distrae del contenido. Criterio: sutil.
1611. Definir speech bubble del robot (mensaje aleatorio). Criterio: array de frases.
1612. Traducir frases del robot a 4 idiomas. Criterio: i18n keys.
1613. Verificar que el speech bubble se oculta al idle. Criterio: timeout.
1614. Definir animación de entrada del robot (slide-in). Criterio: GSAP.
1615. Verificar que el robot funciona en Chrome. Criterio: test.
1616. Verificar que el robot funciona en Safari. Criterio: test.
1617. Verificar que el robot funciona en Firefox. Criterio: test.
1618. Verificar que el robot funciona en mobile. Criterio: test.
1619. Documentar el robot en ANIMACIONES.md. Criterio: completo.
1620. Verificar que el robot no causa jank. Criterio: test 60fps.

## 17B. Glow / Liquid buttons (1621-1640)
1621. Definir botón glow (box-shadow animado). Criterio: clase `.btn--glow`.
1622. Definir botón liquid (onda en hover). Criterio: CSS con ::before.
1623. Definir botón gradient-border. Criterio: borde animado.
1624. Definir botón shine (barrido de luz). Criterio: pseudo-elemento.
1625. Definir botón magnetic (atrae cursor). Criterio: JS.
1626. Verificar que los botones usan tokens de color. Criterio: grep.
1627. Verificar que los botones respetan reduced-motion. Criterio: off.
1628. Verificar que los botones son accesibles (focus ring). Criterio: focus-visible.
1629. Verificar que los botones funcionan en touch. Criterio: hover fallback.
1630. Verificar que los botones no causan jank. Criterio: GPU.
1631. Aplicar glow a CTAs del hero. Criterio: coherente.
1632. Aplicar glow a botones de secciones clave. Criterio: coherente.
1633. Verificar que el glow no distrae en mobile. Criterio: reducido.
1634. Verificar que el glow es consistente con la marca. Criterio: tokens.
1635. Verificar que los botones se ven bien en dark. Criterio: revisión.
1636. Verificar que los botones se ven bien en los 4 idiomas. Criterio: largo del texto.
1637. Verificar que los botones no desbordan en mobile. Criterio: max-width.
1638. Verificar que los botones son usables (44px min). Criterio: touch.
1639. Documentar los botones. Criterio: docs.
1640. Verificar que los botones funcionan sin JS. Criterio: fallback CSS.

## 17C. Bento grid (1641-1660)
1641. Definir bento grid en About/Studio (cards de distinto tamaño). Criterio: CSS grid.
1642. Definir bento para servicios (3-5 cards). Criterio: layout.
1643. Definir bento para studio (cards con imágenes). Criterio: grid.
1644. Definir bento para gallery. Criterio: grid.
1645. Definir span de cards (col-span/row-span). Criterio: grid-area.
1646. Definir hover effects de cards bento (lift). Criterio: sutil.
1647. Verificar que el bento es responsive (colapsa a 1 col). Criterio: media query.
1648. Verificar que el bento no causa CLS. Criterio: aspect-ratio.
1649. Verificar que el bento se ve bien en mobile. Criterio: apilado.
1650. Verificar que el bento se ve bien en tablet. Criterio: 2 cols.
1651. Verificar que el bento se ve bien en desktop. Criterio: 3-4 cols.
1652. Verificar que las cards bento usan tokens. Criterio: grep.
1653. Verificar que las cards bento son accesibles (heading). Criterio: jerarquía.
1654. Verificar que las cards bento tienen imágenes optimizadas. Criterio: WebP.
1655. Verificar que el bento no duplica contenido de secciones. Criterio: revisión.
1656. Verificar que el bento respeta reduced-motion. Criterio: hover off.
1657. Documentar el bento grid. Criterio: docs.
1658. Verificar que el bento se ve bien en dark. Criterio: revisión.
1659. Verificar que el bento se ve bien en los 4 idiomas. Criterio: largo texto.
1660. Verificar que el bento es consistente con el resto. Criterio: tokens.

## 17D. Marquee / ticker (1661-1680)
1661. Definir marquee de géneros/skills (loop infinito). Criterio: CSS animation.
1662. Definir marquee en hero o entre secciones. Criterio: posición.
1663. Definir velocidad del marquee. Criterio: tokens motion.
1664. Definir pausa en hover. Criterio: CSS.
1665. Verificar que el marquee es GPU-accelerated (transform). Criterio: sin repaint.
1666. Verificar que el marquee respeta reduced-motion. Criterio: estático.
1667. Verificar que el marquee no causa CLS. Criterio: altura fija.
1668. Verificar que el marquee no desborda en mobile. Criterio: overflow hidden.
1669. Verificar que el marquee se ve bien en dark. Criterio: revisión.
1670. Verificar que el contenido del marquee está en 4 idiomas. Criterio: i18n.
1671. Verificar que el marquee no duplica el contenido principal. Criterio: decorativo.
1672. Definir marquee de logos (opcional). Criterio: decidido.
1673. Verificar que el marquee funciona en Safari. Criterio: test.
1674. Verificar que el marquee funciona en mobile. Criterio: test.
1675. Verificar que el marquee no consume CPU idle. Criterio: test.
1676. Verificar que el marquee se pausa fuera de viewport. Criterio: IntersectionObserver.
1677. Documentar el marquee. Criterio: docs.
1678. Verificar que el marquee usa tokens de color. Criterio: grep.
1679. Verificar que el marquee es consistente con la marca. Criterio: revisión.
1680. Verificar que el marquee no causa jank. Criterio: test.

## 17E. Recursos de audio 21st.dev (1681-1695)
1681. Definir audio visualizer reactivo al micrófono (barras 3D). Criterio: canvas/WebGL.
1682. Definir visualizer con colores según frecuencia. Criterio: tokens.
1683. Definir visualizer circular. Criterio: canvas 2D.
1684. Verificar que el visualizer responde a audio real. Criterio: barras se mueven.
1685. Verificar que el visualizer usa analyser master. Criterio: audio.js.
1686. Verificar que el visualizer se detiene sin audio. Criterio: sin gasto CPU.
1687. Verificar que el visualizer respeta reduced-motion. Criterio: off.
1688. Verificar que el visualizer funciona en mobile. Criterio: test.
1689. Verificar que el visualizer no causa jank. Criterio: rAF.
1690. Verificar que el visualizer se limpia en cleanup. Criterio: sin leaks.
1691. Documentar los visualizers. Criterio: AUDIO.md.
1692. Verificar que los recursos 21st.dev están integrados sin romper lo existente. Criterio: 0 errores consola.
1693. Verificar que el peso agregado de recursos es aceptable. Criterio: < 200KB CSS/JS.
1694. Verificar que los recursos funcionan sin librerías extra no usadas. Criterio: grep.
1695. Verificar que los recursos son consistentes con el design system. Criterio: tokens.

## 17F. Gate integración 21st.dev (1696-1700)
1696. Test: robot interactivo funciona en desktop. Criterio: anima y responde.
1697. Test: glow buttons y bento grid funcionan. Criterio: visual.
1698. Test: marquee y visualizers funcionan. Criterio: test.
1699. Test: todo respeta reduced-motion y es accesible. Criterio: test.
1700. **GATE FASE 17**: robot OK, buttons OK, bento OK, marquee OK, visualizers OK. Criterio: 5/5 OK.

---

# FASE 18: TESTING FUNCIONAL INTEGRADO (1701-1800)

## 18A. Test de instrumentos (1701-1720)
1701. Test: piano suena con click en todas las teclas. Criterio: test.
1702. Test: piano suena con teclado físico (mapeo QWERTY). Criterio: test.
1703. Test: piano responde a multi-touch. Criterio: 2+ teclas.
1704. Test: rhythm box reproduce patrón a tempo correcto. Criterio: test.
1705. Test: rhythm box con 16 pasos y 3 instrumentos. Criterio: grid correcto.
1706. Test: synth produce sonido y presets cargan. Criterio: test.
1707. Test: metrónomo mantiene tempo con acento. Criterio: test.
1708. Test: visualizador de voz responde al micrófono. Criterio: test.
1709. Test: grabadora graba/reproduce/descarga. Criterio: 3/3.
1710. Test: los instrumentos no se solapan entre sí. Criterio: test.
1711. Test: master volume controla todos. Criterio: test.
1712. Test: los instrumentos funcionan juntos sin conflicto. Criterio: test.
1713. Test: el AudioContext no se crea sin interacción. Criterio: policy.
1714. Test: no hay sonido fantasma tras soltar tecla. Criterio: test.
1715. Test: los instrumentos funcionan en los 4 navegadores. Criterio: test.
1716. Test: los instrumentos son eficientes en CPU. Criterio: test 60fps.
1717. Test: los instrumentos son usables en touch. Criterio: test.
1718. Test: los instrumentos son accesibles (aria-labels). Criterio: test.
1719. Documentar resultados de tests. Criterio: docs/TEST.md.
1720. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.

## 18B. Test de navegación e i18n (1721-1740)
1721. Test: navegación a todas las secciones desde nav. Criterio: todas alcanzables.
1722. Test: scroll suave con Lenis a anchors. Criterio: test.
1723. Test: scroll progress bar se actualiza. Criterio: test.
1724. Test: back-to-top funciona. Criterio: test.
1725. Test: menú móvil abre/cierra correctamente. Criterio: test.
1726. Test: menú móvil bloquea/restaura scroll. Criterio: test.
1727. Test: menú móvil soporta teclado (Esc). Criterio: test.
1728. Test: switcher cambia a ES correctamente. Criterio: visual.
1729. Test: switcher cambia a EN correctamente. Criterio: visual.
1730. Test: switcher cambia a FR correctamente. Criterio: visual.
1731. Test: switcher persiste en localStorage. Criterio: reload.
1732. Test: textos dinámicos se actualizan al cambiar idioma. Criterio: tracks re-render.
1733. Test: title/meta se actualizan al cambiar idioma. Criterio: document.title.
1734. Test: los 4 diccionarios tienen las mismas keys. Criterio: diff 0.
1735. Test: no hay textos sin traducir en la página. Criterio: grep.
1736. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.
1737. Test: el custom cursor no bloquea interacción. Criterio: pointer-events.
1738. Test: el cursor se oculta en touch. Criterio: media query.
1739. Test: parallax de scroll funciona sin jank. Criterio: test.
1740. Test: reveals de secciones se disparan al entrar en viewport. Criterio: test.

## 18C. Test de datos y contenido (1741-1760)
1741. Test: la discografía renderiza >= 32 tracks. Criterio: count.
1742. Test: filtros por género devuelven solo ese género. Criterio: test.
1743. Test: búsqueda por texto funciona. Criterio: case-insensitive.
1744. Test: orden por fecha es descendente. Criterio: test.
1745. Test: modal de track abre/muestra/cierra. Criterio: 3/3.
1746. Test: modal de track soporta Esc y click fuera. Criterio: test.
1747. Test: modal de track tiene focus trap. Criterio: test.
1748. Test: links de YouTube abren en nueva pestaña. Criterio: target.
1749. Test: covers faltantes muestran placeholder. Criterio: no broken.
1750. Test: studio muestra todas las stations. Criterio: count.
1751. Test: modal de station abre/cierra. Criterio: test.
1752. Test: gear muestra categorías. Criterio: count.
1753. Test: stats cuentan al entrar en viewport. Criterio: once.
1754. Test: timeline muestra hitos en orden. Criterio: cronológico.
1755. Test: gallery carousel navega (prev/next/autoplay). Criterio: test.
1756. Test: singles/carousel funciona. Criterio: test.
1757. Test: no hay contenido duplicado en la página. Criterio: grep.
1758. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.
1759. Test: la página funciona sin JS (fallback). Criterio: contenido visible.
1760. Test: no hay enlaces rotos internos. Criterio: test.

## 18D. Test de responsive (1761-1780)
1761. Test: layout en 375px (mobile). Criterio: sin overflow.
1762. Test: layout en 640px (mobile landscape). Criterio: sin overflow.
1763. Test: layout en 768px (tablet). Criterio: 2 cols.
1764. Test: layout en 1024px (desktop). Criterio: 3-4 cols.
1765. Test: layout en 1440px (wide). Criterio: container.
1766. Test: layout en 1920px (ultra-wide). Criterio: centrado.
1767. Test: nav se vuelve hamburguesa en mobile. Criterio: visual.
1768. Test: grid de tracks colapsa correctamente. Criterio: visual.
1769. Test: instrumentos son usables en touch. Criterio: 44px min.
1770. Test: modales caben en pantalla pequeña. Criterio: scroll interno.
1771. Test: no hay scroll horizontal en ningún width. Criterio: 0.
1772. Test: texto no se corta en mobile. Criterio: visual.
1773. Test: imágenes no desbordan. Criterio: max-width.
1774. Test: formulario es usable en mobile. Criterio: test.
1775. Test: layout estable al rotar pantalla. Criterio: test.
1776. Test: layout estable con zoom 200%. Criterio: test.
1777. Test: botones son usables en touch. Criterio: 44px.
1778. Test: el diseño se ve bien en los 4 idiomas en mobile. Criterio: visual.
1779. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.
1780. Documentar breakpoints probados. Criterio: docs.

## 18E. Test de errores y edge cases (1781-1795)
1781. Test: denegar permisos de micrófono muestra error claro. Criterio: i18n.
1782. Test: WebGL no disponible muestra fallback. Criterio: sin crash.
1783. Test: audio falla sin romper la página. Criterio: aislamiento.
1784. Test: imágenes rotas muestran placeholder. Criterio: no broken.
1785. Test: búsqueda sin resultados muestra estado vacío. Criterio: mensaje.
1786. Test: red lenta (throttle) no rompe la carga. Criterio: skeleton.
1787. Test: localStorage lleno no rompe la página. Criterio: try/catch.
1788. Test: URL con hash inválido no rompe. Criterio: fallback.
1789. Test: doble clic en botones no duplica acciones. Criterio: debounce.
1790. Test: rapid scroll no rompe animaciones. Criterio: test.
1791. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.
1792. Test: la página funciona en modo incógnito. Criterio: test.
1793. Test: la página funciona con JS deshabilitado. Criterio: fallback.
1794. Test: la página funciona con cookies deshabilitadas. Criterio: test.
1795. Registrar errores encontrados en ERRORES.md. Criterio: completo.

## 18F. Gate testing integrado (1796-1800)
1796. Test: los instrumentos pasan todos los tests. Criterio: 100%.
1797. Test: navegación e i18n pasan todos los tests. Criterio: 100%.
1798. Test: datos y responsive pasan todos los tests. Criterio: 100%.
1799. Test: edge cases manejados sin crash. Criterio: 0 crashes.
1800. **GATE FASE 18**: instrumentos OK, nav/i18n OK, datos OK, responsive OK, edge OK. Criterio: 5/5 OK.

---

# FASE 19: PWA, SEO, ACCESIBILIDAD Y PERFORMANCE (1801-1900)

## 19A. PWA (1801-1820)
1801. Crear `manifest.json` (name, icons, theme_color). Criterio: válido.
1802. Registrar Service Worker (sw.js). Criterio: registrado.
1803. Definir cache estático (shell). Criterio: precache.
1804. Definir cache de runtime (dinámico). Criterio: network-first.
1805. Definir offline fallback. Criterio: página offline.
1806. Verificar que el SW se actualiza. Criterio: versión.
1807. Verificar que el SW no cachea datos sensibles. Criterio: revisión.
1808. Verificar que la app es instalable (Lighthouse). Criterio: criterio PWA.
1809. Definir splash screen. Criterio: manifest.
1810. Definir iconos en todos los tamaños (192, 512). Criterio: presentes.
1811. Verificar que el manifest tiene start_url. Criterio: presente.
1812. Verificar que el manifest tiene display standalone. Criterio: presente.
1813. Verificar que el manifest tiene lang. Criterio: pt-BR.
1814. Verificar que el SW se registra solo en producción. Criterio: condición.
1815. Verificar que el SW no interfiere con dev. Criterio: test.
1816. Verificar que la PWA funciona offline básico. Criterio: test.
1817. Verificar que la PWA actualiza el contenido al volver online. Criterio: test.
1818. Verificar que la PWA es compatible con Chrome. Criterio: test.
1819. Verificar que la PWA es compatible con Safari (partial). Criterio: test.
1820. Documentar la PWA. Criterio: docs/PWA.md.

## 19B. SEO avanzado (1821-1840)
1821. Verificar que solo hay un h1. Criterio: 1.
1822. Verificar que el h1 contiene keywords. Criterio: SEO.
1823. Verificar que todos los h2 son descriptivos. Criterio: revisión.
1824. Verificar que las imágenes tienen alt con keywords. Criterio: revisión.
1825. Verificar que la meta description es única y < 160 chars. Criterio: test.
1826. Verificar que el title es único y < 60 chars. Criterio: test.
1827. Verificar que los JSON-LD son válidos. Criterio: validator.
1828. Verificar que hreflang está presente para 4 idiomas. Criterio: 5 tags.
1829. Verificar que canonical está presente. Criterio: 1.
18210. Verificar que robots.txt existe. Criterio: 200.
18210. Verificar que sitemap.xml existe. Criterio: 200.
1830. Verificar que no hay contenido duplicado. Criterio: revisión.
1831. Verificar que las URLs son limpias. Criterio: revisión.
1832. Verificar que los anchors tienen texto descriptivo. Criterio: revisión.
1833. Verificar que no hay texto oculto para SEO. Criterio: revisión.
1834. Verificar que las páginas son escaneables (crawlable). Criterio: test.
1835. Verificar que Open Graph está completo. Criterio: 5 tags.
1836. Verificar que Twitter Cards están completas. Criterio: 4 tags.
1837. Verificar que la página es compartible en redes. Criterio: test.
1838. Verificar que el SEO es consistente en 4 idiomas. Criterio: revisión.
1839. Verificar que no hay errores 404 internos. Criterio: test.
1840. Documentar el SEO. Criterio: docs/SEO.md.

## 19C. Accesibilidad WCAG AA (1841-1860)
1841. Correr Lighthouse Accessibility. Criterio: >= 90.
1842. Verificar contraste de todos los textos. Criterio: AA.
1843. Verificar que todos los elementos interactivos son focusables. Criterio: test.
1844. Verificar que el orden de focus es lógico. Criterio: test.
1845. Verificar que los modales tienen focus trap. Criterio: test.
1846. Verificar que los form controls tienen labels. Criterio: test.
1847. Verificar que los inputs tienen autocomplete. Criterio: test.
1848. Verificar que los errores de formulario son accesibles. Criterio: aria.
1849. Verificar que los iconos tienen aria-hidden o label. Criterio: test.
1850. Verificar que los botones tienen nombre accesible. Criterio: test.
1851. Verificar que los enlaces tienen texto accesible. Criterio: test.
1852. Verificar que el contenido es navegable con teclado. Criterio: test.
1853. Verificar que no hay keyboard traps. Criterio: test.
1854. Verificar que los cambios dinámicos usan aria-live. Criterio: test.
1855. Verificar que los tooltips son accesibles. Criterio: test.
1856. Verificar que la página soporta screen readers. Criterio: test.
1857. Verificar que los headings tienen jerarquía correcta. Criterio: test.
1858. Verificar que no hay contenido que parpadea (epilepsia). Criterio: test.
1859. Corregir cualquier [FAIL] de accesibilidad. Criterio: re-test OK.
1860. Documentar la accesibilidad. Criterio: docs/A11Y.md.

## 19D. Performance (1861-1880)
1861. Correr Lighthouse Performance. Criterio: >= 90.
1862. Medir LCP. Criterio: < 2.5s.
1863. Medir CLS. Criterio: < 0.1.
1864. Medir INP. Criterio: < 200ms.
1865. Verificar que las imágenes están optimizadas. Criterio: WebP.
1866. Verificar que los scripts se cargan con defer. Criterio: atributo.
1867. Verificar que el CSS crítico está inline. Criterio: LCP.
1868. Verificar que el JS se code-splits. Criterio: módulos.
1869. Verificar que las animaciones son GPU. Criterio: transform.
1870. Verificar que no hay layout thrashing. Criterio: test.
1871. Verificar que los listeners no causan leaks. Criterio: test.
1872. Verificar que el peso total de la página es aceptable. Criterio: < 2MB.
1873. Verificar que el servidor tiene compresión (gzip/brotli). Criterio: header.
1874. Verificar que el servidor tiene cache headers. Criterio: test.
1875. Verificar que el hero se carga con prioridad. Criterio: preload.
1876. Verificar que los recursos no críticos se cargan lazy. Criterio: test.
1877. Verificar que el render no bloquea el thread. Criterio: test.
1878. Verificar que la página es fluida en scroll (60fps). Criterio: test.
1879. Corregir cualquier [FAIL] de performance. Criterio: re-test OK.
1880. Documentar las métricas finales. Criterio: docs/PERF.md.

## 19E. Seguridad (1881-1895)
1881. Verificar que no hay API keys en el código. Criterio: grep.
1882. Verificar que no hay credenciales hardcodeadas. Criterio: grep.
1883. Definir CSP básica (si aplica). Criterio: header.
1884. Verificar que los iframes tienen sandbox (si aplica). Criterio: test.
1885. Verificar que los links externos tienen rel="noopener". Criterio: grep.
1886. Verificar que no hay evaluación de input del usuario inseguro. Criterio: revisión.
1887. Verificar que los formularios no envían datos sensibles. Criterio: revisión.
1888. Verificar que no hay XSS (sanitización). Criterio: test.
1889. Verificar que no hay dependencias vulnerables. Criterio: audit.
1890. Verificar que el HTTPS está activo. Criterio: test.
1891. Verificar que no hay mixed content. Criterio: test.
1892. Verificar que los headers de seguridad existen. Criterio: test.
1893. Verificar que no hay información de servidor expuesta. Criterio: test.
1894. Corregir cualquier [FAIL] de seguridad. Criterio: re-test OK.
1895. Documentar la seguridad. Criterio: docs/SECURITY.md.

## 19F. Gate PWA/SEO/a11y/perf (1896-1900)
1896. Test: PWA instalable y offline. Criterio: test.
1897. Test: SEO audit pasa. Criterio: test.
1898. Test: Lighthouse a11y >= 90. Criterio: test.
1899. Test: Lighthouse perf >= 90. Criterio: test.
1900. **GATE FASE 19**: PWA OK, SEO OK, a11y OK, perf OK, seguridad OK. Criterio: 5/5 OK.

---

# FASE 20: DEPLOY, VERIFICACIÓN FINAL Y ENTREGA (1901-2000)

## 20A. Build de producción (1901-1920)
1901. Configurar build de producción. Criterio: dist/ generado.
1902. Minificar HTML. Criterio: build.
1903. Minificar CSS. Criterio: build.
1904. Minificar JS. Criterio: build.
1905. Optimizar imágenes finales. Criterio: WebP.
1906. Generar favicons en todos los tamaños. Criterio: presentes.
1907. Verificar que el build no tiene 404. Criterio: test.
1908. Verificar que el build mantiene el funcionamiento. Criterio: test.
1909. Verificar que el build es reproducible. Criterio: 2 builds idénticos.
1910. Verificar que el build no incluye archivos de dev. Criterio: revisión.
1911. Verificar que el build no incluye source maps. Criterio: revisión.
1912. Verificar que el build comprime assets. Criterio: gzip.
1913. Verificar que el build genera el manifest. Criterio: presente.
1914. Verificar que el build genera sw.js. Criterio: presente.
1915. Verificar que el build genera sitemap. Criterio: presente.
1916. Verificar que el build genera robots.txt. Criterio: presente.
1917. Probar el build en servidor local (preview). Criterio: carga.
1918. Probar el build en producción (deploy). Criterio: carga.
1919. Verificar que el build es consistente con dev. Criterio: test.
1920. Documentar el proceso de build. Criterio: docs/BUILD.md.

## 20B. Deploy (1921-1940)
1921. Decidir plataforma de deploy (Netlify/Vercel/GitHub Pages). Criterio: decisión.
1922. Configurar el dominio. Criterio: heyduck.netlify.app.
1923. Configurar HTTPS. Criterio: activo.
1924. Configurar redirects (si aplica). Criterio: test.
1925. Configurar headers de seguridad en la plataforma. Criterio: test.
1926. Configurar cache headers. Criterio: test.
1927. Configurar compresión. Criterio: test.
1928. Deploy del build de producción. Criterio: URL activa.
1929. Verificar que el deploy carga correctamente. Criterio: 0 errores.
1930. Verificar que los assets cargan (200). Criterio: test.
1931. Verificar que las fuentes cargan. Criterio: test.
1932. Verificar que las imágenes cargan. Criterio: test.
1933. Verificar que el SW se registra en producción. Criterio: test.
1934. Verificar que el manifest se sirve correctamente. Criterio: test.
1935. Verificar que el sitemap se sirve. Criterio: test.
1936. Verificar que robots.txt se sirve. Criterio: test.
1937. Verificar que los hreflang apuntan a URLs reales. Criterio: test.
1938. Verificar que el canonical apunta a la URL real. Criterio: test.
1939. Verificar que el deploy se actualiza con CI (si aplica). Criterio: test.
1940. Registrar la URL de producción. Criterio: docs.

## 20C. Verificación final (1941-1960)
1941. Correr Lighthouse en producción (perf/a11y/bp/seo). Criterio: 4x90.
1942. Correr test de carga de la página. Criterio: test.
1943. Verificar que todas las secciones renderizan en producción. Criterio: test.
1944. Verificar que todos los instrumentos funcionan en producción. Criterio: test.
1945. Verificar que la i18n funciona en producción. Criterio: 4 idiomas.
1946. Verificar que la PWA funciona en producción. Criterio: test.
1947. Verificar que el SEO funciona en producción. Criterio: test.
1948. Verificar la accesibilidad en producción. Criterio: test.
1949. Verificar la performance en producción. Criterio: test.
1950. Verificar que la página funciona en los 4 navegadores. Criterio: test.
1951. Verificar que la página funciona en mobile real. Criterio: test.
1952. Verificar que la página funciona en tablet real. Criterio: test.
1953. Verificar que la página funciona en desktop real. Criterio: test.
1954. Verificar que la página no tiene errores en consola. Criterio: 0.
1955. Verificar que la página no tiene warnings en consola. Criterio: 0.
1956. Verificar que la página no tiene errores de red. Criterio: 0.
1957. Verificar que la página no tiene errores de render. Criterio: 0.
1958. Corregir cualquier [FAIL] detectado. Criterio: re-test OK.
1959. Registrar los resultados finales. Criterio: docs/FINAL.md.
1960. Verificar que todos los gates de fase pasan. Criterio: 20/20.

## 20D. Entrega (1961-1980)
1961. Crear backup final del proyecto completo. Criterio: zip.
1962. Crear README.md del proyecto. Criterio: completo.
1963. Crear docs/PROGRESO.md final (checklist completo). Criterio: 2000 pasos.
1964. Crear docs/ERRORES.md final (todos los fallos resueltos). Criterio: completo.
1965. Crear docs/DECISIONES.md final (todas las decisiones). Criterio: completo.
1966. Crear docs/TOKENS.md final. Criterio: completo.
1967. Crear docs/REQUISITOS.md final. Criterio: completo.
1968. Crear docs/AUDIO.md final. Criterio: completo.
1969. Crear docs/ANIMACIONES.md final. Criterio: completo.
1970. Crear docs/TEST.md final. Criterio: completo.
1971. Crear docs/PERF.md final. Criterio: completo.
1972. Crear docs/A11Y.md final. Criterio: completo.
1973. Crear docs/SEO.md final. Criterio: completo.
1974. Crear docs/SECURITY.md final. Criterio: completo.
1975. Crear docs/PWA.md final. Criterio: completo.
1976. Crear docs/BUILD.md final. Criterio: completo.
1977. Crear docs/DEPENDENCIAS.md final. Criterio: completo.
1978. Crear docs/MEDIA.md final. Criterio: completo.
1979. Crear docs/I18N.md final. Criterio: completo.
1980. Verificar que todos los docs existen y son coherentes. Criterio: 19 docs.

## 20E. Validación de requisitos (1981-1995)
1981. Verificar criterio: 10 done criteria globales. Criterio: 10/10.
1982. Verificar criterio: 32+ tracks reales. Criterio: count.
1983. Verificar criterio: 4 idiomas completos. Criterio: diff 0.
1984. Verificar criterio: 4 funcionalidades interactivas. Criterio: funcionan.
1985. Verificar criterio: Lighthouse 4x90. Criterio: test.
1986. Verificar criterio: WCAG AA. Criterio: test.
1987. Verificar criterio: LCP/CLS/INP. Criterio: test.
1988. Verificar criterio: PWA instalable. Criterio: test.
1989. Verificar criterio: SEO Rich Results. Criterio: test.
1990. Verificar criterio: sin keys expuestas. Criterio: grep.
1991. Verificar criterio: copy sin typos. Criterio: revisión.
1992. Verificar criterio: 4 navegadores soportados. Criterio: test.
1993. Verificar criterio: audio sin errores. Criterio: test.
1994. Verificar criterio: contenido sin duplicados. Criterio: grep.
1995. Verificar criterio: web terminada según definición. Criterio: lista completa.

## 20F. GATE FINAL (1996-2000)
1996. **GATE A**: todas las fases 1-19 con GATE OK. Criterio: 19/19.
1997. **GATE B**: producción funcional, tests pasan, deploy activo. Criterio: 3/3.
1998. **GATE C**: docs completos, backups finales, repo limpio. Criterio: 3/3.
1999. **GATE D**: validación de requisitos 100%. Criterio: 15/15.
2000. **CIERRE**: web DUCK terminada según definición. Entregar resumen final al usuario con caveats y next steps. Criterio: plan completo 2000/2000.
