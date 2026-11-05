import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesToPrerender = [
  // Core landing pages
  '/',
  '/tools',
  '/about',
  '/privacy',
  '/terms',
  '/blog',

  // 10 Tools
  '/tools/stopwatch',
  '/tools/notepad',
  '/tools/word-counter',
  '/tools/json-formatter',
  '/tools/image-resizer',
  '/tools/password-generator',
  '/tools/base64-encoder',
  '/tools/markdown-previewer',
  '/tools/uuid-generator',
  '/tools/color-converter',

  // 11 Blog Articles
  '/blog/best-free-online-notepad-2024',
  '/blog/ultimate-guide-word-counter-seo',
  '/blog/json-formatter-complete-guide-developers',
  '/blog/top-free-developer-tools-online-2024',
  '/blog/seo-content-optimization-guide-beginners',
  '/blog/how-to-improve-writing-productivity',
  '/blog/secure-password-and-passphrase-guide-2026',
  '/blog/complete-guide-base64-and-url-encoding',
  '/blog/markdown-to-html-complete-guide-technical-writing',
  '/blog/understanding-uuid-v4-and-unix-timestamps',
  '/blog/web-colors-hex-rgb-hsl-and-wcag-accessibility'
];

async function prerender() {
  console.log('🚀 Starting DevToolBox SSG Pre-rendering for', routesToPrerender.length, 'routes...\n');
  const distDir = path.resolve(__dirname, 'dist');
  const templatePath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found! Run "vite build" first.');
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const serverEntryPath = path.resolve(distDir, 'server', 'entry-server.js');
  const serverModule = await import(pathToFileURL(serverEntryPath).href);
  const { render } = serverModule;

  let generatedCount = 0;

  for (const route of routesToPrerender) {
    const helmetContext = {};
    const { html, helmet } = render(route, helmetContext);

    // Extract page-specific tags (either from helmetContext or from the rendered string)
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);
    const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="(.*?)"\s*\/?>/);
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/);
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="(.*?)"\s*\/?>/);
    const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="(.*?)"\s*\/?>/);
    const ogUrlMatch = html.match(/<meta\s+property="og:url"\s+content="(.*?)"\s*\/?>/);
    const twitterTitleMatch = html.match(/<meta\s+name="twitter:title"\s+content="(.*?)"\s*\/?>/);
    const twitterDescMatch = html.match(/<meta\s+name="twitter:description"\s+content="(.*?)"\s*\/?>/);
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);

    let pageHtml = template;

    // Clean body markup by removing hoisted head elements from inside root
    let bodyMarkup = html
      .replace(/<title>.*?<\/title>/g, '')
      .replace(/<meta[^>]+>/g, '')
      .replace(/<link\s+rel="(?:canonical|icon|shortcut icon|apple-touch-icon|preload)"[^>]+>/g, '')
      .replace(/<script type="application\/ld\+json">.*?<\/script>/gs, '');

    // Inject clean body markup into <div id="root">
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${bodyMarkup}</div>`);

    // Replace <title> in <head>
    if (titleMatch && titleMatch[1]) {
      pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${titleMatch[1]}</title>`);
      pageHtml = pageHtml.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/i, `<meta name="title" content="${titleMatch[1]}" />`);
    }

    // Replace description in <head>
    if (descMatch && descMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${descMatch[1]}" />`);
    }

    // Replace keywords in <head>
    if (keywordsMatch && keywordsMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i, `<meta name="keywords" content="${keywordsMatch[1]}" />`);
    }

    // Replace canonical link in <head>
    if (canonicalMatch && canonicalMatch[1]) {
      pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalMatch[1]}" />`);
    }

    // Replace Open Graph metadata in <head>
    if (ogTitleMatch && ogTitleMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${ogTitleMatch[1]}" />`);
    }
    if (ogDescMatch && ogDescMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${ogDescMatch[1]}" />`);
    }
    if (ogUrlMatch && ogUrlMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${ogUrlMatch[1]}" />`);
    }

    // Replace Twitter metadata in <head>
    if (twitterTitleMatch && twitterTitleMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:title" content="${twitterTitleMatch[1]}" />`);
    }
    if (twitterDescMatch && twitterDescMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:description" content="${twitterDescMatch[1]}" />`);
    }
    if (ogUrlMatch && ogUrlMatch[1]) {
      pageHtml = pageHtml.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:url" content="${ogUrlMatch[1]}" />`);
    }

    // Replace or inject structured data in <head>
    if (jsonLdMatch && jsonLdMatch[1]) {
      pageHtml = pageHtml.replace(
        /<script type="application\/ld\+json">.*?<\/script>/s,
        `<script type="application/ld+json">${jsonLdMatch[1]}</script>`
      );
    }

    // Determine target directory and file path
    const targetDir = route === '/' 
      ? distDir 
      : path.join(distDir, ...route.split('/').filter(Boolean));
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, 'index.html');
    fs.writeFileSync(filePath, pageHtml, 'utf-8');
    generatedCount++;
    console.log(`✓ [${generatedCount}/${routesToPrerender.length}] Pre-rendered: ${route} -> ${path.relative(distDir, filePath)}`);
  }

  // Clean up server-only build bundle from dist
  const serverDir = path.resolve(distDir, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
  }

  console.log(`\n🎉 Successfully pre-rendered all ${generatedCount} routes to static HTML with full SEO tags and structured data!\n`);
}

prerender().catch((err) => {
  console.error('❌ SSG Pre-rendering error:', err);
  process.exit(1);
});
