# Validación visual — 2026-08-20

Se capturó la landing completa en 1280×720 y 390×844 después de los cambios de accesibilidad.

## Escritorio

La composición Dark Cinematic mantiene jerarquía clara: hero con headline grande, bloque de métricas, sección editorial, servicios, catálogo, estudio y contacto. No se observaron desbordamientos horizontales, saltos de layout ni assets rotos. El nuevo bloque de catálogo mantiene la continuidad visual y el CTA de Apple Music sigue legible.

## Móvil

La landing mantiene el ancho del viewport y el stacking vertical esperado. La tipografía sigue siendo legible, las tarjetas de servicios se apilan y el formulario permanece dentro del ancho disponible. El menú móvil parte oculto por el atributo `hidden`; el estado abierto se activa con `aria-expanded` y `aria-controls`.

## Resultado

No se detectaron regresiones visuales en las capturas completas. La validación funcional de teclado y la prueba de envío del formulario quedan documentadas para ejecución en el navegador final antes de un cambio de backend.
