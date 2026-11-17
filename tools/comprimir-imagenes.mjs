// =========================================================
//  Compresión de imágenes del proyecto (Fase 3)
//
//  Uso:
//    1. npm install sharp
//    2. node tools/comprimir-imagenes.mjs
//
//  Qué hace:
//    - Recorre img_galeria/ e images/
//    - Redimensiona a lo ancho máximo 1600px (sin ampliar)
//    - Recodifica a WebP calidad 78
//    - SOLO sobrescribe si el archivo nuevo es más pequeño
//    - Ignora archivos que ya están por debajo del objetivo
//
//  Sugerencia: hacé una copia de seguridad de img_galeria/
//  antes de la primera ejecución, o usá git.
// =========================================================
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Windows agota los handles si sharp abre demasiados archivos a la vez.
sharp.concurrency(2);

const MAX_WIDTH = 1600;
const QUALITY = 78;
const MAX_BYTES = 200 * 1024; // Objetivo: < 200 KB por imagen
const DIRS = ['img_galeria', 'images'];
const ROOT = process.env.IMG_ROOT
  ? path.resolve(process.env.IMG_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let optimizadas = 0;
let omitidas = 0;
let ahorrado = 0;

for (const dir of DIRS) {
  const fullDir = path.join(ROOT, dir);
  const files = (await readdir(fullDir)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));

  for (const file of files) {
    const filePath = path.join(fullDir, file);
    const antes = (await readFile(filePath)).length;

    if (antes <= MAX_BYTES) {
      omitidas++;
      continue;
    }

    try {
      // Leemos a memoria: sharp con ruta mantiene el handle abierto en Windows
      // y al sobrescribir el mismo archivo da "unknown error, open".
      const source = await readFile(filePath);
      const meta = await sharp(source).metadata();
      const necesitaRedimensionar = (meta.width || 0) > MAX_WIDTH;

      let pipeline = sharp(source);
      if (necesitaRedimensionar) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }
      const buffer = await pipeline.webp({ quality: QUALITY }).toBuffer();

      if (buffer.length < antes) {
        await writeFile(filePath, buffer);
        const ahorro = antes - buffer.length;
        ahorrado += ahorro;
        optimizadas++;
        console.log(
          `${dir}/${file}: ${(antes / 1024).toFixed(0)} KB -> ${(buffer.length / 1024).toFixed(0)} KB`
        );
      } else {
        omitidas++;
      }
    } catch (err) {
      console.warn(`No se pudo procesar ${dir}/${file}: ${err.message}`);
    }
  }
}

console.log('--------------------------------------------');
console.log(`Imágenes optimizadas: ${optimizadas}`);
console.log(`Ya estaban bien:     ${omitidas}`);
console.log(`Espacio liberado:    ${(ahorrado / 1024 / 1024).toFixed(2)} MB`);
