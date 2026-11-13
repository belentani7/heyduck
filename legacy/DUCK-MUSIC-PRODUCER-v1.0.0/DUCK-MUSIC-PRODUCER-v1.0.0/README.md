# DUCK MUSIC PRODUCER

**DUCK MUSIC PRODUCER** es una herramienta machine-only para organizar y operar proyectos de producción musical. La descarga contiene una API local, un CLI, un worker durable, persistencia en archivos, calendario, tareas, QC, finanzas, assets, contratos de DAW y cadenas operativas.

## Instalación Windows

Desde PowerShell, en la carpeta descomprimida del paquete:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Install-MusicStack-Hardened.ps1 -Component All -Install
.\Install-MusicStack-Hardened.ps1 -Component All -Install -Start
```

## Instalación Linux/macOS

```bash
chmod +x RUN.sh
./RUN.sh
```

`RUN.sh` instala las dependencias fijadas, prepara Chromium de Playwright, construye el bundle DUCK y arranca la API DUCK en el puerto 4200 por defecto.

## Docker

```bash
docker compose up --build
```

La API queda en `http://localhost:4200/api/duck/health`. El worker DUCK procesa jobs desde el volumen `duck-data`.

## Operación

La API ofrece proyectos, clientes, tareas, calendario, automatizaciones, QC, finanzas, audio, DAW, protocolo, jobs, cadenas y eventos bajo `/api/duck`. El CLI se ejecuta con `pnpm duck ...`; el worker continuo con `pnpm duck:worker` y una iteración con `pnpm duck:worker:once`.

## Alcance real

Esta versión implementa el núcleo operativo, persistencia, API, CLI, jobs y contratos. Las cadenas de mastering, mezcla y entrega son ejecuciones operativas registradas; **no incluyen todavía procesamiento DSP nativo ni control directo de Ableton, Logic, Pro Tools u otro DAW**. Para usar DSP o un DAW real hace falta conectar un adaptador específico.

## Legal y reproducibilidad

El paquete incluye `pnpm-lock.yaml`, `THIRD-PARTY-NOTICES.md` y `SECURITY-SCAN.md`. No se distribuyen credenciales. La licencia de cada dependencia debe conservarse al redistribuir el paquete.

## Verificación de instalación

En una instalación limpia se puede ejecutar:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm duck:build
pnpm test
pnpm verify:runtime
```

`verify:runtime` arranca el bundle DUCK, consulta `/api/duck/health`, comprueba el servicio y detiene el proceso de forma controlada.


## Producto
Véase `plataforma/OFERTA.md`.
