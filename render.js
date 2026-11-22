// Render design.html to a 1024x1024 PNG using headless Chromium at native size.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const REPO = __dirname;
const CHROME = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell";
const OUT = path.join(REPO, "entry.png");
const SRC = path.join(REPO, "design.html");

function run(extra) {
  const args = [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1024,1024",
    ...extra,
    "file://" + SRC,
  ];
  return spawnSync(CHROME, args, { encoding: "utf8", timeout: 180000, maxBuffer: 32 * 1024 * 1024 });
}

// 1. layout QA from the page's own DOM
const qaRun = run(["--virtual-time-budget=4000", "--dump-dom"]);
const dom = qaRun.stdout || "";
const m = dom.match(/<pre id="qa">([\s\S]*?)<\/pre>/);
if (!m) {
  console.error("FAIL: QA block missing");
  process.exit(1);
}
const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
console.log("=== LAYOUT QA ===");
console.log(decode(m[1]).trim());

// 2. screenshot
const shot = run(["--screenshot=" + OUT]);
if (!fs.existsSync(OUT)) {
  console.error("FAIL: no screenshot, status=" + shot.status);
  process.exit(1);
}
console.log("=== SHOT ===");
console.log(OUT + " " + fs.statSync(OUT).size + " bytes");
