import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("docs/images");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
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

  console.log("1. Navigating to login page...");
  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, "01-login-screen.png") });
  console.log("Saved: 01-login-screen.png");

  async function loginAs(roleText, serviceId, password = "demo-access") {
    console.log(`Logging in as ${roleText} (${serviceId})...`);
    await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 1500));

    // Click the role button
    const buttons = await page.$$("button");
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.toLowerCase().includes(roleText.toLowerCase())) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));

    // Clear and fill inputs
    await page.evaluate(() => {
      const idInput = document.querySelector("input#serviceId");
      if (idInput) idInput.value = "";
    });
    await page.type("input#serviceId", serviceId);
    await page.type("input[type='password']", password);

    // Submit
    const submitBtn = await page.$("button[type='submit']");
    if (submitBtn) {
      await submitBtn.click();
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  // --- WELFARE OFFICER ---
  await loginAs("welfare", "WO-208");
  await page.screenshot({ path: path.join(OUT_DIR, "02-welfare-dashboard.png") });
  console.log("Saved: 02-welfare-dashboard.png");

  // Personnel radar detail
  console.log("Navigating to personnel radar detail...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/welfare/personnel/P-1024", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "03-welfare-personnel-radar.png") });
    console.log("Saved: 03-welfare-personnel-radar.png");
  } catch (e) {
    console.log("Personnel radar detail error:", e.message);
  }

  // Welfare Interventions
  console.log("Navigating to welfare interventions...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/welfare/interventions", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "04-welfare-interventions.png") });
    console.log("Saved: 04-welfare-interventions.png");
  } catch (e) {
    console.log("Welfare interventions error:", e.message);
  }

  // Welfare Alerts
  console.log("Navigating to welfare alerts...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/welfare/alerts", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "05-welfare-alerts.png") });
    console.log("Saved: 05-welfare-alerts.png");
  } catch (e) {
    console.log("Welfare alerts error:", e.message);
  }

  // --- COMMANDER ---
  await loginAs("commander", "CO-014");
  await page.screenshot({ path: path.join(OUT_DIR, "06-commander-dashboard.png") });
  console.log("Saved: 06-commander-dashboard.png");

  console.log("Navigating to commander analytics...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/commander/analytics", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "07-commander-analytics.png") });
    console.log("Saved: 07-commander-analytics.png");
  } catch (e) {
    console.log("Commander analytics error:", e.message);
  }

  // --- PERSONNEL PORTAL ---
  await loginAs("personnel", "P-1024");
  await page.screenshot({ path: path.join(OUT_DIR, "08-personnel-dashboard.png") });
  console.log("Saved: 08-personnel-dashboard.png");

  console.log("Navigating to personnel assessment check-in...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/personnel/assessment", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "09-personnel-assessment.png") });
    console.log("Saved: 09-personnel-assessment.png");
  } catch (e) {
    console.log("Personnel assessment error:", e.message);
  }

  console.log("Navigating to personnel privacy manager...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/personnel/privacy", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "10-personnel-privacy.png") });
    console.log("Saved: 10-personnel-privacy.png");
  } catch (e) {
    console.log("Personnel privacy error:", e.message);
  }

  // --- ADMINISTRATOR ---
  await loginAs("administrator", "AD-001");
  await page.screenshot({ path: path.join(OUT_DIR, "11-admin-simulation.png") });
  console.log("Saved: 11-admin-simulation.png");

  console.log("Navigating to admin audit logs...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/admin/audit-logs", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(OUT_DIR, "12-admin-audit-logs.png") });
    console.log("Saved: 12-admin-audit-logs.png");
  } catch (e) {
    console.log("Admin audit logs error:", e.message);
  }

  await browser.close();
  console.log("ALL ASSETS CAPTURED SUCCESSFULLY!");
}

capture().catch(err => {
  console.error("Capture process error:", err);
  process.exit(1);
});
