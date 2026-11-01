/**
 * Test de veracidad R3: ninguna cifra de marketing sin fuente en el sitio vivo.
 * Regla R3: cifras de marketing (número + "+") deben tener fuente o eliminarse.
 * Se enfoca en los badges de estadísticas y la bio (contexto de marketing),
 * no en falsos positivos de CSS/JS.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname);
const VIVOS = [
  path.join(ROOT, "index.html"),
  path.join(ROOT, "data.js"),
];

function leer(p) {
  return fs.readFileSync(p, "utf8");
}

// Patrón de marketing: número + "+" seguido de palabra de contexto de métrica
const patronesMarketing = [
  /\b\d+[KM]?\+\s*(STREAMS|LANÇAMENTOS|LANZAMIENTOS|RELEASES|SORTIES|ABONNÉS|FOLLOWERS|SEGUIDORES)/gi,
  /\b\d+[KM]?\+\s*(MILLION|MILLÓN|MILLÕES)\s*STREAMS/gi,
  /mais\s+de\s+\d+\+\s*lançamentos/gi,
];

let totalHallazgos = 0;
for (const archivo of VIVOS) {
  const contenido = leer(archivo);
  let hallazgosArchivo = 0;
  for (const patron of patronesMarketing) {
    const coincidencias = contenido.match(patron);
    if (coincidencias) {
      console.log(`R3 FALLO en ${path.basename(archivo)}: ${coincidencias.join(", ")}`);
      hallazgosArchivo += coincidencias.length;
      totalHallazgos += coincidencias.length;
    }
  }
  if (hallazgosArchivo === 0) {
    console.log(`R3 OK en ${path.basename(archivo)}: sin cifras de marketing sin fuente`);
  }
}

if (totalHallazgos > 0) {
  console.log(`\nR3: ${totalHallazgos} cifra(s) de marketing sin fuente pendiente(s)`);
  process.exit(1);
} else {
  console.log("\nR3: todas las cifras de marketing tienen fuente o fueron eliminadas");
  process.exit(0);
}
