import { createDuckBus } from "./duck-bus.js";
import { mountLifecycle } from "./lifecycle.js";
import * as portal from "../modules/01-portal-vivo/module.js";
import * as identity from "../modules/02-identidad-organica/module.js";
import * as process from "../modules/03-motor-produccion/module.js";
import * as laboratory from "../modules/04-laboratorio-sonoro/module.js";
import * as discography from "../modules/05-discografia-conexion/module.js";

const bus = createDuckBus(document);
const modules = [
  { id: "01", ...portal },
  { id: "02", ...identity },
  { id: "03", ...process },
  { id: "04", ...laboratory },
  { id: "05", ...discography }
];

const unmount = mountLifecycle(bus, modules);

addEventListener("pagehide", () => {
  unmount();
  bus.destroy();
}, { once: true });
