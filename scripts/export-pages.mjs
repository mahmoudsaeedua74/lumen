/**
 * Export LUMEN pages for client presentation (screen CSS, continuous PDF).
 * Does not modify the website — captures the rendered page only.
 *
 * Usage:
 *   npm run export:all
 *   npm run export:product
 *   npm run export:mobile
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
const BASE_URL_ENV = process.env.LUMEN_EXPORT_URL;
const PRODUCT_SLUG = process.env.LUMEN_PRODUCT_SLUG || "serene";

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

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
        res.writeHead(200, {
          "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
        });
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

function capitalize(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function buildJobs(mode, slug) {
  const productName = capitalize(slug);
  const productPath = `product.html?slug=${encodeURIComponent(slug)}`;

  const homepageDesktop = {
    id: "homepage-desktop",
    label: "Homepage Desktop",
    path: "index.html",
    viewport: DESKTOP,
    prefix: "LUMEN-Homepage-Desktop",
    includePaginated: true,
  };

  const productDesktop = {
    id: "product-desktop",
    label: `Product Desktop (${productName})`,
    path: productPath,
    viewport: DESKTOP,
    prefix: `LUMEN-Product-${productName}-Desktop`,
    includePaginated: true,
  };

  const homepageMobile = {
    id: "homepage-mobile",
    label: "Homepage Mobile",
    path: "index.html",
    viewport: MOBILE,
    prefix: "LUMEN-Homepage-Mobile",
    includePaginated: false,
  };

  const productMobile = {
    id: "product-mobile",
    label: `Product Mobile (${productName})`,
    path: productPath,
    viewport: MOBILE,
    prefix: `LUMEN-Product-${productName}-Mobile`,
    includePaginated: false,
  };

  if (mode === "homepage") return [homepageDesktop];
  if (mode === "product") return [productDesktop];
  if (mode === "mobile") return [homepageMobile, productMobile];
  if (mode === "product-mobile-set") return [productDesktop, homepageMobile, productMobile];
  // all
  return [homepageDesktop, productDesktop, homepageMobile, productMobile];
}

async function exportJob(browser, baseUrl, job) {
  const context = await browser.newContext({
    viewport: {
      width: job.viewport.width,
      height: job.viewport.height,
    },
    deviceScaleFactor: job.viewport.deviceScaleFactor || 1,
    isMobile: !!job.viewport.isMobile,
    hasTouch: !!job.viewport.hasTouch,
    colorScheme: "light",
  });
  const page = await context.newPage();
  const url = `${baseUrl.replace(/\/$/, "")}/${job.path.replace(/^\//, "")}`;
  console.log(`\n→ ${job.label}`);
  console.log(`  Opening ${url}`);

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await waitForAssets(page);
  await page.emulateMedia({ media: "screen" });

  const pngPath = join(EXPORTS, `${job.prefix}.png`);
  const continuousPdfPath = join(EXPORTS, `${job.prefix}-continuous.pdf`);

  await page.screenshot({
    path: pngPath,
    fullPage: true,
    type: "png",
    animations: "disabled",
  });
  console.log(`  Wrote ${pngPath}`);

  if (job.includePaginated) {
    const pdfPath = join(EXPORTS, `${job.prefix}.pdf`);
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    console.log(`  Wrote ${pdfPath}`);
  }

  const height = await pageContentHeight(page);
  await page.pdf({
    path: continuousPdfPath,
    width: `${job.viewport.width}px`,
    height: `${Math.max(height, job.viewport.height)}px`,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log(`  Wrote ${continuousPdfPath} (${job.viewport.width}×${height}px)`);

  await context.close();
  return {
    label: job.label,
    files: [
      `${job.prefix}.png`,
      job.includePaginated ? `${job.prefix}.pdf` : null,
      `${job.prefix}-continuous.pdf`,
    ].filter(Boolean),
  };
}

async function main() {
  const mode = (process.argv[2] || "all").toLowerCase();
  const slug = PRODUCT_SLUG;
  const jobs = buildJobs(mode, slug);

  mkdirSync(EXPORTS, { recursive: true });

  let localServer = null;
  let baseUrl = BASE_URL_ENV;
  if (!baseUrl) {
    localServer = await startStaticServer();
    baseUrl = localServer.baseUrl;
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const job of jobs) {
      results.push(await exportJob(browser, baseUrl, job));
    }
  } finally {
    await browser.close();
    if (localServer) {
      await new Promise((resolveClose) => localServer.server.close(resolveClose));
    }
  }

  console.log("\nExport complete:");
  results.forEach((result) => {
    console.log(`  ${result.label}`);
    result.files.forEach((file) => console.log(`    exports/${file}`));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
