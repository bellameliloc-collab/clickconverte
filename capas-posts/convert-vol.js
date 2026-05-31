const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const dir = __dirname;

function encodeLocalImages(html, baseDir) {
  let result = '';
  let remaining = html;
  const SRC_RE = /src="([^"]*)"/i;
  while (remaining.length > 0) {
    const match = remaining.match(SRC_RE);
    if (!match) { result += remaining; break; }
    result += remaining.slice(0, match.index);
    const relPath = match[1];
    if (!relPath.startsWith('data:') && !relPath.startsWith('http')) {
      const absPath = path.resolve(baseDir, relPath);
      if (fs.existsSync(absPath)) {
        const ext = path.extname(absPath).toLowerCase();
        const mime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' :
                     ext === '.png' ? 'image/png' :
                     ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
        const data = fs.readFileSync(absPath).toString('base64');
        result += `src="data:${mime};base64,${data}"`;
      } else {
        console.warn(`  ⚠ not found: ${absPath}`);
        result += match[0];
      }
    } else {
      result += match[0];
    }
    remaining = remaining.slice(match.index + match[0].length);
  }
  return result;
}

const posts = ['vol1', 'vol2', 'vol3', 'vol4', 'vol5'];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  for (const post of posts) {
    process.stdout.write(`Rendering ${post}... `);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    const htmlPath = path.resolve(dir, `${post}.html`);
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = encodeLocalImages(html, dir);
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({
      path: path.resolve(dir, `${post}.png`),
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
    });
    console.log('✓');
    await page.close();
  }
  await browser.close();
  console.log('\n✅ Série Volume gerada!');
})();
