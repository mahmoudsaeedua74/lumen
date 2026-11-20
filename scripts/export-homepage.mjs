/**
 * Export the live LUMEN homepage for client presentation.
 * Does not modify the website — captures the rendered page only.
 *
 * Usage:
 *   npm run export:homepage
 */

import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const EXPORTS = join(ROOT, "exports");
const VIEWPORT = { width: 1440, height: 900 };
const BASE_URL_ENV = process.env.LUMEN_EXPORT_URL;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function startStaticServer() {
  return new Promise((resolveServer, reject) => {
    const server = createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let filePath = join(ROOT, urlPath === "/" ? "index.html" : urlPath);
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403).end("Forbidden");
          return;
        }
        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          res.writeHead(404).end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream" });
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500).end(String(err && err.message ? err.message : err));
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolveServer({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
    server.on("error", reject);
  });
}

async function waitForAssets(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolveImg) => {
          const done = () => resolveImg();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 4000);
        });
      })
    );

    // Let CSS SVG / entrance animations settle briefly.
    await new Promise((r) => setTimeout(r, 1200));
  });
}

async function pageContentHeight(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.ceil(
      Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0
      )
    );
  });
}

async function exportHomepage() {
  mkdirSync(EXPORTS, { recursive: true });

  let localServer = null;
  let baseUrl = BASE_URL_ENV;

  if (!baseUrl) {
    localServer = await startStaticServer();
    baseUrl = localServer.baseUrl;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const page = await context.newPage();

  const homeUrl = `${baseUrl.replace(/\/$/, "")}/index.html`;
  console.log(`Opening ${homeUrl}`);
  await page.goto(homeUrl, { waitUntil: "networkidle", timeout: 60000 });
  await waitForAssets(page);

  // Prefer screen media so the PDF matches the live site, not print stylesheets.
  await page.emulateMedia({ media: "screen" });

  const pngPath = join(EXPORTS, "LUMEN-Homepage-Desktop.png");
  const pdfPath = join(EXPORTS, "LUMEN-Homepage-Desktop.pdf");
  const altPdfPath = join(EXPORTS, "LUMEN-Homepage-Desktop-continuous.pdf");

  await page.screenshot({
    path: pngPath,
    fullPage: true,
    type: "png",
    animations: "disabled",
  });
  console.log(`Wrote ${pngPath}`);

  // Primary PDF: screen CSS, backgrounds on, CSS page size preferred, no margins.
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log(`Wrote ${pdfPath}`);

  // Alternative: one continuous page sized to the full rendered homepage
  // (avoids mid-section page breaks for client presentation decks).
  const height = await pageContentHeight(page);
  await page.pdf({
    path: altPdfPath,
    width: `${VIEWPORT.width}px`,
    height: `${Math.max(height, VIEWPORT.height)}px`,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log(`Wrote ${altPdfPath} (${VIEWPORT.width}×${height}px page)`);

  await browser.close();
  if (localServer) {
    await new Promise((resolveClose) => localServer.server.close(resolveClose));
  }

  console.log("\nExport complete:");
  console.log(`  PNG:          exports/LUMEN-Homepage-Desktop.png`);
  console.log(`  PDF:          exports/LUMEN-Homepage-Desktop.pdf`);
  console.log(`  Continuous:   exports/LUMEN-Homepage-Desktop-continuous.pdf`);
}

exportHomepage().catch((err) => {
  console.error(err);
  process.exit(1);
});
