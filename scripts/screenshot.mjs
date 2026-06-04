#!/usr/bin/env node
/**
 * screenshot.mjs
 *
 * Takes targeted screenshots of a URL using headless Chrome + CDP.
 * Saves PNGs into src/assets/reports/<slug>/
 *
 * Usage:
 *   node scripts/screenshot.mjs <url> <slug> [config-file]
 *
 * Examples:
 *   node scripts/screenshot.mjs https://www.myprotein.com/p/... myprotein-tshirt-2026-06-04
 *   node scripts/screenshot.mjs https://www.myprotein.com/p/... myprotein-tshirt-2026-06-04 scripts/configs/pdp.json
 *
 * If no config file is given, defaults to scripts/configs/pdp.json for PDP URLs,
 * scripts/configs/plp.json for /c/ URLs, scripts/configs/default.json otherwise.
 */

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

// ─── Config ────────────────────────────────────────────────────────────────

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CDP_PORT = 9229;
const VIEWPORT = { width: 1440, height: 900 };

// ─── Args ──────────────────────────────────────────────────────────────────

const [,, url, slug, configArg] = process.argv;

if (!url || !slug) {
  console.error('Usage: node scripts/screenshot.mjs <url> <slug> [config-file]');
  process.exit(1);
}

const ASSETS = join(ROOT, 'src', 'assets', 'reports', slug);

// Auto-select config based on URL pattern if not provided
function resolveConfig(configArg, url) {
  if (configArg) return resolve(configArg);
  if (url.includes('/p/') || url.includes('/product')) return join(__dir, 'configs', 'pdp.json');
  if (url.includes('/c/') || url.includes('/category')) return join(__dir, 'configs', 'plp.json');
  return join(__dir, 'configs', 'default.json');
}

const configPath = resolveConfig(configArg, url);
let config;
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch {
  console.error(`Config not found: ${configPath} — using built-in default.`);
  config = { shots: [{ name: 'above-fold', scrollY: 0 }] };
}

console.log(`\n📸 Screenshot tool`);
console.log(`   URL:    ${url}`);
console.log(`   Slug:   ${slug}`);
console.log(`   Config: ${configPath}`);
console.log(`   Output: ${ASSETS}\n`);

// ─── Helpers ───────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

function getCDPTarget() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${CDP_PORT}/json/list`, res => {
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => {
        try {
          const pages = JSON.parse(data);
          const target = pages.find(p => p.type === 'page');
          if (!target) reject(new Error('No page target found'));
          else resolve(target.webSocketDebuggerUrl);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

// ─── CDP Client ────────────────────────────────────────────────────────────

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.pending = new Map();
    this.msgId = 1;
    this.ready = new Promise(r => this.ws.addEventListener('open', r));
    this.ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression, returnValue = false) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: returnValue,
      awaitPromise: true,
    });
    if (returnValue) return res?.result?.value;
    return res;
  }

  async screenshot(clip) {
    const params = { format: 'png', captureBeyondViewport: false };
    if (clip) params.clip = { ...clip, scale: 1 };
    const { data } = await this.send('Page.captureScreenshot', params);
    return Buffer.from(data, 'base64');
  }

  close() { this.ws.close(); }
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function run() {
  mkdirSync(ASSETS, { recursive: true });

  // Fresh profile each run so cookie/consent banners always appear and get dismissed cleanly
  const { execSync } = await import('child_process');
  try { execSync('rm -rf /tmp/cdp-screenshot-profile-fresh'); } catch {}

  // Launch Chrome
  const chrome = spawn(CHROME, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    '--user-data-dir=/tmp/cdp-screenshot-profile-fresh',
    '--hide-scrollbars',
    url,
  ], { stdio: 'ignore' });

  process.on('exit', () => { try { chrome.kill(); } catch {} });

  // Wait for Chrome to start
  await sleep(3000);

  // Get WS URL with retries
  let wsUrl;
  for (let i = 0; i < 10; i++) {
    try { wsUrl = await getCDPTarget(); break; }
    catch { await sleep(1000); }
  }
  if (!wsUrl) { console.error('Chrome CDP not available'); process.exit(1); }

  const cdp = new CDP(wsUrl);
  await cdp.ready;

  // Wait for page load
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('⏳ Waiting for page to load...');
  await sleep(config.loadWait ?? 5000);

  // Dismiss cookie banner and any other popups
  await cdp.eval(`
    const dismiss = [
      // Cookie banners
      'Accept essential cookies only',
      "That's OK",
      'Accept all cookies',
      'Accept All',
      // Email/promo modals
      'No, thanks',
      'No thanks',
      // Generic close buttons
      '✕', '×', 'Close',
    ];
    document.querySelectorAll('button, [role="button"]').forEach(b => {
      const t = b.textContent.trim();
      if (dismiss.some(d => t === d || t.startsWith(d))) {
        b.click();
      }
    });
    // Also try common cookie banner selectors
    document.querySelector('#onetrust-reject-all-handler, #onetrust-accept-btn-handler, [class*="cookie"] button[class*="reject"], [class*="cookie"] button[class*="accept-essential"]')?.click();
  `);
  await sleep(800);

  // Second pass — some modals are time-delayed (e.g. newsletter popups)
  // Wait for them to appear then dismiss
  await sleep(2000);
  await cdp.eval(`
    const dismiss = ['No, thanks', 'No thanks', '✕', '×', 'Close', 'Accept essential cookies only', "That's OK"];
    document.querySelectorAll('button, [role="button"]').forEach(b => {
      const t = b.textContent.trim();
      if (dismiss.some(d => t === d || t.startsWith(d))) b.click();
    });
    // Hide any visible overlays/modals that remain
    document.querySelectorAll('[class*="modal"], [class*="overlay"], [class*="popup"], [class*="dialog"]').forEach(el => {
      if (el.offsetHeight > 0 && getComputedStyle(el).position === 'fixed') {
        el.style.display = 'none';
      }
    });
  `);
  await sleep(500);

  // Take each shot
  for (const shot of config.shots) {
    const outPath = join(ASSETS, `${shot.name}.png`);
    console.log(`📷 ${shot.name}...`);

    // Run any pre-shot JS
    if (shot.before) {
      await cdp.eval(shot.before);
      await sleep(shot.beforeWait ?? 600);
    }

    // Scroll to position
    const scrollY = shot.scrollY ?? 0;
    if (shot.scrollTo) {
      // Scroll to a CSS selector
      await cdp.eval(`
        const el = document.querySelector(${JSON.stringify(shot.scrollTo)});
        if (el) el.scrollIntoView({ block: 'center' });
      `);
      await sleep(600);
    } else {
      await cdp.eval(`window.scrollTo(0, ${scrollY})`);
      await sleep(300);
    }

    // Resolve clip region from a selector
    let clip = shot.clip ?? null;
    if (shot.clipSelector) {
      const rectJson = await cdp.eval(
        `JSON.stringify(document.querySelector(${JSON.stringify(shot.clipSelector)})?.getBoundingClientRect())`,
        true
      );
      if (rectJson) {
        const r = JSON.parse(rectJson);
        clip = { x: r.left, y: r.top, width: r.width, height: Math.min(r.height, shot.maxHeight ?? 600) };
      }
    }

    const png = await cdp.screenshot(clip || undefined);
    writeFileSync(outPath, png);
    console.log(`   ✅ Saved (${Math.round(png.length / 1024)}KB)`);
  }

  cdp.close();
  chrome.kill();

  console.log(`\n✅ All screenshots saved to ${ASSETS}\n`);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
