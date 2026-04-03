import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const cwd = process.cwd();

function getTotalSize(pattern) {
  const files = globSync(pattern, { cwd });
  return files.reduce((sum, f) => {
    const p = path.join(cwd, f);
    return sum + (fs.existsSync(p) ? fs.statSync(p).size : 0);
  }, 0);
}

console.log('🔄 Comprimindo imagens...\n');

(async () => {
  try {
    const sizeBefore = getTotalSize('*.{png,jpg,jpeg}');
    console.log(`📦 Tamanho antes: ${(sizeBefore / 1024 / 1024).toFixed(2)} MB\n`);

    const files = await imagemin(['*.png', '*.jpg', '*.jpeg'], {
      destination: '.',
      plugins: [
        imageminMozjpeg({ quality: 70 }),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

    const sizeAfter = getTotalSize('*.{png,jpg,jpeg}');
    console.log(`\n✅ Compressão concluída!`);
    console.log(`📦 Tamanho depois: ${(sizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Economia: ${((1 - sizeAfter / sizeBefore) * 100).toFixed(1)}%`);
    console.log(`📊 Arquivos otimizados: ${files.length}`);
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
})();
