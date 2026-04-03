import sharp from 'sharp';

console.log('📸 Criando og:image para redes sociais...\n');

(async () => {
  try {
    // Criar uma imagem 1200x630 com fundo preto e logo centrado
    const svgImage = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DC143C;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF1744;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="#000000"/>
      <rect width="1200" height="630" fill="url(#grad)" opacity="0.1"/>

      <!-- Titulo -->
      <text x="600" y="150" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#DC143C" text-anchor="middle">
        SPARTAN TEAM
      </text>

      <!-- Subtitulo -->
      <text x="600" y="240" font-family="Arial, sans-serif" font-size="40" fill="#FFFFFF" text-anchor="middle">
        Muay Thai Premium
      </text>

      <!-- Descritivo -->
      <text x="600" y="310" font-family="Arial, sans-serif" font-size="28" fill="#888888" text-anchor="middle">
        Rio de Janeiro
      </text>

      <!-- Decoração -->
      <circle cx="600" cy="420" r="60" fill="none" stroke="#DC143C" stroke-width="3" opacity="0.5"/>
      <circle cx="600" cy="420" r="80" fill="none" stroke="#DC143C" stroke-width="1" opacity="0.3"/>

      <!-- Icone -->
      <text x="600" y="450" font-size="80" text-anchor="middle">⚔️</text>
    </svg>`;

    await sharp(Buffer.from(svgImage))
      .png({ quality: 80 })
      .toFile('og-image.png');

    console.log('✅ og-image.png criada com sucesso! (1200x630px)');
    console.log('📝 Imagem salva em: ./og-image.png');
    console.log('🔗 URL para meta tag: https://spartanteamrj.com/og-image.png');
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
})();
