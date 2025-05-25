// scripts/optimize-images.js
const fs    = require('fs').promises;
const sharp = require('sharp');
const path  = require('path');

const INPUT_DIR  = 'src/images';          // Ajusta si tu carpeta es distinta
const OUTPUT_DIR = 'docs/dist/images';  // Ya dentro de public/dist

(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const files = await fs.readdir(INPUT_DIR);

  await Promise.all(files.map(async file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.jfif'].includes(ext)) return;
    const name = path.basename(file, ext);

    const inputPath  = path.join(INPUT_DIR, file);
    const webpPath   = path.join(OUTPUT_DIR, `${name}.webp`);
    const avifPath   = path.join(OUTPUT_DIR, `${name}.avif`);
    const outputPath = path.join(OUTPUT_DIR, file);

    // 1) Genera WebP
    await sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(webpPath);

    // 2) Genera AVIF
    await sharp(inputPath)
      .avif({ quality: 50 })
      .toFile(avifPath);

    // 3) Copia el original optimizado (puedes añadir .jpeg/ .png params si quieres)
    await sharp(inputPath)
      .toFile(outputPath);

    console.log(`✔ ${file} → webp, avif, original optimizados`);
  }));

  console.log('✅ Imágenes optimizadas en', OUTPUT_DIR);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
