import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("docs/images");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

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
      console.log(`Retrieved direct token for ${r.role} (${r.serviceId})`);
    } else {
      console.error(`Failed token for ${r.role}:`, data);
    }
  }
  return tokens;
}

async function capture() {
  const tokens = await getTokens();

  console.log("Launching installed Chrome via puppeteer-core...");
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

  // 1. Login Page
  console.log("1. Capturing login screen...");
  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, "01-login-screen.png") });
  console.log("Captured 01-login-screen.png");

  // Helper to set localStorage session and navigate
  async function visitWithSession(role, targetUrl, screenshotName, waitMs = 4000) {
    console.log(`Setting session for ${role} -> ${targetUrl}...`);
    await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(({ role, token }) => {
      localStorage.setItem("sentinelwell.role", role);
      localStorage.setItem("sentinelwell.token", token);
    }, { role, token: tokens[role]?.token });

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, waitMs));
    await page.screenshot({ path: path.join(OUT_DIR, screenshotName) });
    console.log(`Captured ${screenshotName}`);
  }

  // --- WELFARE OFFICER ---
  await visitWithSession("welfare", "https://sentinel-well-mind.vercel.app/welfare/dashboard", "02-welfare-dashboard.png", 5000);
  await visitWithSession("welfare", "https://sentinel-well-mind.vercel.app/welfare/personnel/P-1024", "03-welfare-personnel-radar.png", 5000);
  await visitWithSession("welfare", "https://sentinel-well-mind.vercel.app/welfare/interventions", "04-welfare-interventions.png", 4000);
  await visitWithSession("welfare", "https://sentinel-well-mind.vercel.app/welfare/alerts", "05-welfare-alerts.png", 4000);

  // --- COMMANDER ---
  await visitWithSession("commander", "https://sentinel-well-mind.vercel.app/commander/dashboard", "06-commander-dashboard.png", 5000);
  await visitWithSession("commander", "https://sentinel-well-mind.vercel.app/commander/analytics", "07-commander-analytics.png", 5000);

  // --- PERSONNEL ---
  await visitWithSession("personnel", "https://sentinel-well-mind.vercel.app/personnel/dashboard", "08-personnel-dashboard.png", 5000);
  await visitWithSession("personnel", "https://sentinel-well-mind.vercel.app/personnel/assessment", "09-personnel-assessment.png", 4000);
  await visitWithSession("personnel", "https://sentinel-well-mind.vercel.app/personnel/privacy", "10-personnel-privacy.png", 4000);

  // --- ADMINISTRATOR ---
  await visitWithSession("admin", "https://sentinel-well-mind.vercel.app/admin/dashboard", "11-admin-simulation.png", 5000);
  await visitWithSession("admin", "https://sentinel-well-mind.vercel.app/admin/audit-logs", "12-admin-audit-logs.png", 4000);

  await browser.close();
  console.log("All authentic screens captured successfully!");
}

capture().catch((err) => {
  console.error("Capture failure:", err);
  process.exit(1);
});
