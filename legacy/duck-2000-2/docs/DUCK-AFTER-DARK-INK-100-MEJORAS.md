# DUCK After Dark + Ink — 100 puntos para reorganizar, añadir y mejorar

Fecha: 2026-08-13

Base: `duck-after-dark-ink.html`, `duck-after-dark-ink.css` y `duck-after-dark-ink.js`.

Este documento organiza la siguiente iteración. No modifica la web ni sustituye otras variantes.

Prioridad: primero identidad, contenido verificable, accesibilidad y estabilidad; después profundidad de casos y animación avanzada; finalmente publicación.

## Arquitectura y variantes

001. Declarar `duck-after-dark-ink.html` variante experimental; mantener `index.html` sin cambios.
002. Documentar propósito, audiencia y diferencia de Ink, Human, After Dark y la versión unificada.
003. Ordenar el recorrido como identidad, transformación, persona, proceso, juego, obra y contacto.
004. Asignar a cada sección una función: presentar, demostrar, probar, convencer o convertir.
005. Reducir navegación a Duck, Proceso, Trabajos y Contacto; presentar Jugar dentro del relato.
006. Separar hechos confirmados, lenguaje creativo y contenido pendiente de validación.
007. Centralizar singles, servicios, biografía y contacto en una fuente de datos común.
008. Crear un manifiesto de fotografías, portadas, logo, audio, origen y permiso de uso.
009. Registrar cada revisión con captura, commit, responsable, variante y decisión.
010. Definir la elección final mediante identidad, claridad, obra, accesibilidad y rendimiento.

## Hero e identidad

011. Reescribir el eyebrow para presentar a Duck con voz artística, no como ficha administrativa.
012. Asegurar que `DUCK FAZ / O SOM / TER CARA` entre completo entre 320 y 430 píxeles.
013. Añadir una subfrase de dos líneas que diga para quién produce y qué ofrece.
014. Crear una copia recortada del logo oficial para eliminar lienzo transparente sobrante.
015. Definir un punto de enfoque fotográfico distinto para móvil, tablet y escritorio.
016. Mantener contraste constante del renglón verde durante toda la entrada.
017. Convertir `Vê a tinta entrar` en CTA de al menos 44 píxeles táctiles.
018. Añadir una señal visible de que el audio comienza apagado y requiere gesto.
019. Crear entrada estática equivalente cuando GSAP no cargue o haya movimiento reducido.
020. Validar el hero a los dos segundos con personas que no conozcan a Duck.

## Coreografía de tinta

021. Dividir `#inkShift` en espera, caída, anticipación, patada y transformación.
022. Dar peso al cubo con aceleración, sombra creciente, contacto y rebote mínimo.
023. Preparar la patada con mirada, cola, ala, apoyo y compresión corporal.
024. Sincronizar pie, giro del cubo, palabra, anillos y primera gota en el mismo frame.
025. Añadir movimiento independiente al asa, borde y goteo del cubo.
026. Variar gotas por tamaño, estela, viscosidad, velocidad y deformación.
027. Hacer que algunas manchas se adhieran a bordes, letras y fotografías posteriores.
028. Reducir el pin en móvil y conservar la coreografía extensa en escritorio.
029. Reintroducir pequeños vestigios morados al cambiar de capítulo.
030. Crear una salida progresiva hacia la biografía sin corte de color ni movimiento.

## Persona y fotografía

031. Incorporar una presentación breve en primera persona de Duck.
032. Sustituir manifiesto abstracto por una decisión real tomada en una producción.
033. Construir secuencia fotográfica de rostro, escucha, manos, estudio y sesión.
034. Evitar dos retratos consecutivos con encuadre y función equivalentes.
035. Crear recortes independientes por formato en vez de depender solo de `object-position`.
036. Añadir pies de foto con lugar, contexto y función de cada escena.
037. Incluir una cita confirmada de Duck sobre escuchar antes de producir.
038. Explicar Aracaju solo mediante información relevante y validada.
039. Mostrar el espacio de trabajo sin inventar marcas ni equipos.
040. Conectar la última fotografía con el primer paso del proceso mediante una transición compartida.

## Proceso y servicios

041. Renombrar las cuatro etapas con expresiones que Duck utilizaría realmente.
042. Indicar qué debe aportar el artista en cada etapa.
043. Indicar qué recibe el artista al terminar cada etapa.
044. Relacionar cada etapa con una fotografía o caso verificable.
045. Diferenciar producción completa, beat, arreglo, mezcla, master y consultoría.
046. Explicar revisiones, formatos de entrega y límites de alcance.
047. Retirar frases defensivas sobre equipos inventados de la versión pública.
048. Crear ruta para quien tiene demo y otra para quien solo tiene una idea.
049. Añadir preguntas frecuentes basadas en dudas reales de artistas.
050. Terminar el proceso con CTA explícito hacia juego, trabajos o briefing.

## Signal Toy y audio

051. Presentar el Signal Toy como demostración de espacio y contraste, no como consola.
052. Dar una sola instrucción inicial antes de mostrar todos los controles.
053. Iniciar con un patrón musical útil en lugar de una superficie completamente vacía.
054. Hacer que pads activos representen capas sostenidas o secuenciadas.
055. Añadir reset visible que restaure sonido, controles y feedback.
056. Añadir volumen maestro con límite seguro y estado persistente durante la sesión.
057. Evitar clipping cuando coincidan oscilador, presión y varios pads.
058. Explicar con texto qué modifican Apertura y Presión.
059. Convertir la combinación creada en una frase reutilizable dentro del briefing.
060. Pausar render, scheduling y audio al salir de sección o esconder la pestaña.

## Trabajos y casos

061. Definir datos obligatorios por obra: título, artista, año, rol, portada, enlace y créditos.
062. Ampliar de tres a seis casos principales sin usar canciones incoherentes como relleno.
063. Indicar el rol exacto de Duck en cada publicación.
064. Añadir una decisión creativa concreta por trabajo.
065. Incorporar preview autorizado o enlace oficial por obra.
066. Permitir ampliar un caso sin perder la posición del catálogo horizontal.
067. Crear catálogo vertical para móvil y movimiento reducido.
068. Mostrar colaboradores y créditos completos cuando estén confirmados.
069. Retirar géneros, streams o métricas que no tengan fuente documentada.
070. Añadir selección secundaria filtrable por servicio, no por estética arbitraria.

## Confianza y contacto

071. Añadir testimonios con nombre, proyecto, permiso y procedencia.
072. Sustituir métricas no verificadas por evidencia documentada o retirarlas.
073. Confirmar que `duck@producao.com` es una dirección real antes de publicar.
074. Crear briefing breve con estado, objetivo, referencias, plazo y servicio.
075. Permitir copiar el briefing sin enviarlo automáticamente.
076. Publicar tiempo de respuesta solo cuando Duck lo confirme.
077. Añadir disponibilidad editable desde datos sin tocar el HTML.
078. Usar una fotografía de cierre distinta de las ya empleadas.
079. Crear CTA específico para mezcla y master además de producción completa.
080. Convertir shader y texto final en transición directa hacia una conversación.

## Accesibilidad, responsive y rendimiento

081. Completar navegación por teclado en cabecera, escena, juego, catálogo y contacto.
082. Mantener foco visible sobre morado, verde, crema, negro y fotografía.
083. Crear una experiencia reducida completa, no solo animaciones de duración mínima.
084. Hacer que pausar movimiento no congele desplazamiento ni oculte estados intermedios.
085. Anunciar audio, pads y feedback con nombres y estados accesibles.
086. Elevar microtextos inferiores al equivalente de 12 píxeles.
087. Medir contraste después de filtros, overlays y transformaciones.
088. Reservar ancho y alto de imágenes para evitar saltos de diseño.
089. Servir `srcset`, formatos modernos y carga diferida fuera del hero.
090. Limitar DPR y detener canvas y shader fuera del viewport.

## Ingeniería, QA y publicación

091. Separar HTML, estilos, interacción, contenido y datos sin duplicar constantes.
092. Fijar versiones locales o integridad de GSAP, Lenis y Three.js.
093. Mostrar fallbacks cuando GSAP, Web Audio, Canvas o WebGL fallen.
094. Definir política de seguridad compatible con dependencias y eliminar inline residual.
095. Automatizar pruebas de referencias, IDs, sintaxis, headings y campos de datos.
096. Probar teclado, movimiento reducido, audio apagado, reset y cambio de pestaña.
097. Definir presupuestos para LCP, CLS, INP, peso inicial, FPS, CPU y memoria.
098. Crear previews independientes para comparar variantes sin sobrescribirlas.
099. Validar Chrome, Edge, Firefox, Safari/iOS y Android real.
100. Someter la candidata final a aprobación explícita de Duck antes de sustituir `index.html`.


