# Guía de Alojamiento Libre y Autohospedado ("Estilo Pirata") — Duck Produção Musical

Esta guía detalla cómo desplegar la aplicación web **Duck Produção Musical** completamente fuera de GitHub y de plataformas corporativas tradicionales, utilizando alternativas gratuitas, descentralizadas o de autohospedaje en infraestructura propia.

---

## 1. Opción A: Despliegue Instantáneo en Surge.sh (Estático y Gratuito)
Surge permite publicar el sitio web compilado desde la terminal con un solo comando, sin necesidad de cuentas complejas ni servidores de pago.

### Pasos:
1. Instalar Surge globalmente en tu máquina (requiere Node.js):
   ```bash
   npm install -g surge
   ```
2. Compilar el proyecto en local:
   ```bash
   pnpm build
   ```
3. Publicar el directorio de distribución (`dist/public`):
   ```bash
   surge dist/public mi-duck-custom.surge.sh
   ```
   *La primera vez te pedirá un correo y contraseña para registrarte de forma anónima y gratuita en segundos.*

---

## 2. Opción B: Autohospedaje con Docker y Cloudflare Tunnels (Sin abrir puertos)
Si tienes un ordenador secundario, una Raspberry Pi o un VPS económico, puedes levantar la web en un contenedor Docker y exponerla con una URL pública segura (`https://*.trycloudflare.com`) sin configurar DNS ni abrir puertos en tu router.

### Pasos:
1. **Clonar o copiar el proyecto** en el servidor o máquina local.
2. **Construir y arrancar con Docker Compose**:
   ```bash
   docker compose up -d --build
   ```
   *Esto levantará Nginx sirviendo la web en el puerto `8080` local.*
3. **Exponer con Cloudflare Tunnel** (sin registro ni tarjeta):
   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```
   *Cloudflare te devolverá una URL pública temporal `https://xxxxxx.trycloudflare.com` con HTTPS automático e indestructible.*

---

## 3. Opción C: Despliegue Inmutable en IPFS (Web3 / Descentralizado)
Para alojar el sitio de forma permanente en la red P2P IPFS, inmune a caídas de servidores centralizados:

### Pasos:
1. Instalar la CLI de IPFS o utilizar herramientas de pinning como Pinata o Fleek.
2. Compilar el proyecto:
   ```bash
   pnpm build
   ```
3. Añadir la carpeta compilada a IPFS:
   ```bash
   ipfs add -r dist/public
   ```
4. El hash resultante (`Qm...` o `bafy...`) te permite acceder al sitio a través de cualquier pasarela pública IPFS (`https://gateway.ipfs.io/ipfs/<HASH>`).

---

## Seguridad y Privacidad
- La aplicación es puramente estática (`web-static`), por lo que no expone claves de base de datos ni credenciales en el cliente.
- Las variables de entorno inyectadas por el entorno de desarrollo se han saneado para garantizar que ningún token privado quede expuesto en el bundle compilado.
