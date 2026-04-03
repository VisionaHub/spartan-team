const fs = require('fs');
const path = require('path');

// Usando APIs nativas do Sharp
const sharp = (() => {
  try {
    return require('sharp');
  } catch {
    console.log('Sharp não instalado. Usando método alternativo...');
    return null;
  }
})();

const files = fs.readdirSync('.');
const imageFiles = files.filter(f => /\.(png|jpe?g)$/i.test(f));

if (!sharp) {
  console.log('⚠️  Sharp não disponível. Vou usar ImageMagick nativo...');
  // Fallback: usar mogrify via Node exec
  const { execSync } = require('child_process');
  imageFiles.forEach(file => {
    try {
      console.log(`Comprimindo ${file}...`);
      execSync(`mogrify -quality 70 -resize 80%% "${file}"`, {
        stdio: 'pipe',
        shell: 'powershell'
      });
      const newSize = fs.statSync(file).size / 1024 / 1024;
      console.log(`✅ ${file} → ${newSize.toFixed(2)} MB`);
    } catch (e) {
      console.error(`❌ Erro comprimindo ${file}:`, e.message);
    }
  });
} else {
  // Com Sharp
  (async () => {
    for (const file of imageFiles) {
      try {
        const fullPath = path.join(__dirname, file);
        const stat = fs.statSync(fullPath);
        const sizeBefore = (stat.size / 1024 / 1024).toFixed(2);

        console.log(`Comprimindo ${file} (${sizeBefore} MB)...`);

        await sharp(fullPath)
          .resize(Math.floor(stat.size * 0.8 / 1024 / 1024), null, { withoutEnlargement: true })
          .toFormat(file.endsWith('.png') ? 'png' : 'jpeg', { quality: 70 })
          .toFile(`${file}.tmp`);

        fs.renameSync(`${file}.tmp`, file);
        const sizeAfter = (fs.statSync(file).size / 1024 / 1024).toFixed(2);
        console.log(`✅ ${file}: ${sizeBefore} MB → ${sizeAfter} MB`);
      } catch (e) {
        console.error(`❌ Erro: ${e.message}`);
      }
    }
  })();
}
