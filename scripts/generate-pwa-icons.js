const fs = require('fs');
const path = require('path');

// SVGをPNGに変換するためのシンプルなHTMLテンプレート
const createHtmlTemplate = (svgContent, size) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Icon Generator</title>
  <style>
    body { margin: 0; padding: 0; background: transparent; }
    svg { width: ${size}px; height: ${size}px; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
`;

// アイコンサイズのリスト
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// メインアイコンのSVGを読み込み
const mainIconSvg = fs.readFileSync(path.join(__dirname, '../public/icons/icon.svg'), 'utf8');

// 各サイズのPNG用HTMLファイルを生成
iconSizes.forEach(size => {
  const htmlContent = createHtmlTemplate(mainIconSvg, size);
  const htmlPath = path.join(__dirname, `../public/icons/icon-${size}x${size}.html`);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`Generated HTML for ${size}x${size} icon`);
});

// ショートカットアイコンのHTMLも生成
const shortcutIcons = [
  { name: 'shortcut-new', svg: fs.readFileSync(path.join(__dirname, '../public/icons/shortcut-new.svg'), 'utf8') },
  { name: 'shortcut-mypage', svg: fs.readFileSync(path.join(__dirname, '../public/icons/shortcut-mypage.svg'), 'utf8') },
  { name: 'shortcut-map', svg: fs.readFileSync(path.join(__dirname, '../public/icons/shortcut-map.svg'), 'utf8') }
];

shortcutIcons.forEach(({ name, svg }) => {
  const htmlContent = createHtmlTemplate(svg, 96);
  const htmlPath = path.join(__dirname, `../public/icons/${name}-96x96.html`);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`Generated HTML for ${name} icon`);
});

console.log('\nIcon HTML files generated successfully!');
console.log('To convert to PNG, you can:');
console.log('1. Open each HTML file in a browser');
console.log('2. Use browser dev tools to take a screenshot');
console.log('3. Or use a tool like puppeteer to automate the conversion');
console.log('\nFor now, placeholder PNG files will be created...');

// プレースホルダーPNGファイルを作成（実際の変換は手動で行う必要があります）
iconSizes.forEach(size => {
  const pngPath = path.join(__dirname, `../public/icons/icon-${size}x${size}.png`);
  // 実際のPNGファイルは手動で作成する必要があります
  console.log(`Placeholder: ${pngPath}`);
});

shortcutIcons.forEach(({ name }) => {
  const pngPath = path.join(__dirname, `../public/icons/${name}-96x96.png`);
  console.log(`Placeholder: ${pngPath}`);
}); 