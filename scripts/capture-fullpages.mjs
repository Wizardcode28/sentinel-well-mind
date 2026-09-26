import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("docs/images");

const ROLES = [
  { role: "welfare", serviceId: "WO-208" },
  { role: "commander", serviceId: "CO-014" },
  { role: "personnel", serviceId: "P-1024" },
  { role: "admin", serviceId: "AD-001" },
];

async function getTokens() {
  const tokens = {};
  for (const r of ROLES) {
    const res = await fetch("https://sentinelwell-api.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId: r.serviceId, password: "demo-access", role: r.role }),
    });
    const data = await res.json();
    if (data.success && data.data.accessToken) {
      tokens[r.role] = {
        token: data.data.accessToken,
        serviceId: r.serviceId,
      };
    }
  }
  return tokens;
}

async function capture() {
  const tokens = await getTokens();

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1440,900"
    ]
  });

  const page = await browser.newPage();

  async function visitAndCapture(role, url, baseName, fullPage = true) {
    console.log(`Capturing ${baseName} from ${url}...`);
    await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2" });
    await page.evaluate(({ role, token }) => {
      localStorage.setItem("sentinelwell.role", role);
      localStorage.setItem("sentinelwell.token", token);
    }, { role, token: tokens[role]?.token });

    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 4000));

    // Full page screenshot (captures everything including scrolled content)
    await page.screenshot({
      path: path.join(OUT_DIR, `${baseName}-full.png`),
      fullPage: true
    });
    console.log(`Saved: ${baseName}-full.png`);

    // Also scroll down and capture bottom section specifically if wanted
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUT_DIR, `${baseName}-mid.png`),
      fullPage: false
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUT_DIR, `${baseName}-bottom.png`),
      fullPage: false
    });
  }

  // 1. Welfare Command Center (top, full, bottom with Unit Cards & Table)
  await visitAndCapture("welfare", "https://sentinel-well-mind.vercel.app/welfare/dashboard", "02-welfare-dashboard");

  // 2. Personnel Radar (P-1024) (top, full, bottom with historical table/actions)
  await visitAndCapture("welfare", "https://sentinel-well-mind.vercel.app/welfare/personnel/P-1024", "03-welfare-personnel-radar");

  // 3. Commander Battalion Overview (top, full, bottom with unit charts and rosters)
  await visitAndCapture("commander", "https://sentinel-well-mind.vercel.app/commander/dashboard", "06-commander-dashboard");

  // 4. Personnel Self Dashboard (top, full, bottom with trends and support request)
  await visitAndCapture("personnel", "https://sentinel-well-mind.vercel.app/personnel/dashboard", "08-personnel-dashboard");

  // 5. Personnel Assessment (Full form)
  await visitAndCapture("personnel", "https://sentinel-well-mind.vercel.app/personnel/assessment", "09-personnel-assessment");

  // 6. Commander Analytics
  await visitAndCapture("commander", "https://sentinel-well-mind.vercel.app/commander/analytics", "07-commander-analytics");

  // 7. Welfare Alerts
  await visitAndCapture("welfare", "https://sentinel-well-mind.vercel.app/welfare/alerts", "05-welfare-alerts");

  // 8. Admin Audit Logs
  await visitAndCapture("admin", "https://sentinel-well-mind.vercel.app/admin/audit-logs", "12-admin-audit-logs");

  await browser.close();
  console.log("Full page and lower section captures completed!");
}

capture().catch(err => {
  console.error("Full capture failed:", err);
  process.exit(1);
});
