# DUCK A GEMA 1 LAB

Prototipo web estático de un estudio creativo, con una vista principal en HTML/CSS/JavaScript y un directorio experimental de seguimiento de manos en Python.

## Ejecutar la vista local

Requiere Node.js 20 o posterior. No hacen falta dependencias de npm:

```bash
npm run dev
```

Abre <http://127.0.0.1:3000>. El servidor solo escucha en la interfaz local y publica archivos estáticos de la lista permitida. No sirve archivos de configuración, repositorio ni el código Python.

## Comprobaciones

```bash
npm run lint
npm test
python -m compileall -q hand_tracking
```

`hand_tracking` es un módulo experimental. El repositorio no declara todavía las dependencias de ejecución necesarias para ejecutar su pipeline.

## Alcance del repositorio

Este árbol contiene páginas estáticas, scripts de navegador y el prototipo Python indicado arriba. No incluye los workspaces `frontend`/`backend`, servicios en la nube, colaboración multiusuario ni sincronización que aparecían en documentación antigua; por eso no se anuncian como capacidades disponibles aquí.


## Producto
Véase `plataforma/OFERTA.md`.
