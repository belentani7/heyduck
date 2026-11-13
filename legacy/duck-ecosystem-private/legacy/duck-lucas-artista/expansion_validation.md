# Validación de la expansión DUCK

## Revisión visual

La página `/singles` se revisó en escritorio y móvil. Las seis entradas del catálogo muestran las portadas públicas del portafolio de Duck, cada una dentro de un objeto tipo sleeve con un disco de vinilo parcialmente oculto detrás. El layout pasa de dos columnas a una columna en móvil y conserva el título, crédito, tipo de trabajo y enlace público.

La página `/studio` se revisó en escritorio y móvil. Los pads se reorganizan de una matriz de tres columnas a una columna de controles; la mesa de efectos queda vertical en pantallas pequeñas; el bloque de voz y el generador de dos estrofas permanecen legibles y accionables.

## Interacción

GSAP 3.15.0 está instalado y se utiliza para que los vinilos se desplacen, roten y escalen al entrar y salir del puntero. El fondo shader es decorativo, tiene fallback CSS y se detiene cuando `prefers-reduced-motion` está activo. El audio del Studio requiere una acción explícita del usuario y permanece local al navegador.

## Validación técnica

`pnpm check` y `pnpm build` han terminado correctamente. Vite reporta únicamente el aviso habitual de chunk grande, no un error funcional. La grabación de voz se ofrece como WebM local, sin carga de archivos a un servidor.

## Revisión cinematográfica

La cuadrícula de catálogo se ha convertido en un índice secundario y la sección principal ahora es una vitrina cinética. La portada seleccionada entra con desplazamiento lateral, escala, perspectiva 3D y rotación; el vinilo aparece desde detrás con giro de 360 grados; el puntero aplica parallax separado a portada y disco; y el cambio de trabajo puede activarse mediante rueda, flechas, teclado, barras de progreso o tarjetas de índice.

La revisión en escritorio y móvil confirmó que el escenario mantiene jerarquía, controles y legibilidad. En móvil, la composición se vuelve vertical, el CTA ocupa el ancho disponible y el catálogo permanece seleccionable. El autoplay se puede pausar y se desactiva cuando el sistema solicita movimiento reducido.

La consola del navegador no mostró errores funcionales asociados al cambio. Las respuestas observadas en red corresponden a analítica con estado 200; no se detectaron recursos de singles con estados 4xx/5xx.
