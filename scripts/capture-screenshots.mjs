import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("d:/SIH_2026/sentinel-well-mind/docs/images");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  console.log("Launching Chromium with local Chrome binary...");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  console.log("1. Navigating to login page...");
  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, "01-login-screen.png") });
  console.log("Captured 01-login-screen.png");

  // Helper to log in with a role
  async function loginAs(roleIndex, serviceId, password = "demo-access") {
    await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500);

    // click role button if selector exists
    // The role tabs/buttons: "personnel", "welfare", "commander", "admin"
    const buttons = await page.$$("button");
    for (const b of buttons) {
      const text = (await b.innerText()).toLowerCase();
      if (text.includes(["personnel", "welfare", "commander", "admin"][roleIndex])) {
        await b.click();
        break;
      }
    }

    await page.fill("input#serviceId", serviceId);
    await page.fill("input[type='password']", password);
    await page.click("button[type='submit']");
    await page.waitForTimeout(4000);
  }

  // --- WELFARE OFFICER ---
  console.log("2. Logging in as Welfare Officer (WO-208)...");
  await loginAs(1, "WO-208");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, "02-welfare-dashboard.png") });
  console.log("Captured 02-welfare-dashboard.png");

  // Personnel Detail in Welfare
  console.log("3. Viewing personnel detail / risk radar...");
  // click first personnel row or navigate directly
  try {
    const row = await page.$("tbody tr, a[href*='/welfare/personnel']");
    if (row) {
      await row.click();
      await page.waitForTimeout(3000);
    } else {
      await page.goto("https://sentinel-well-mind.vercel.app/welfare/personnel/P-1024", { waitUntil: "networkidle" });
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: path.join(OUT_DIR, "03-welfare-personnel-radar.png") });
    console.log("Captured 03-welfare-personnel-radar.png");
  } catch (e) {
    console.log("Could not open personnel detail:", e.message);
  }

  // Welfare Interventions
  console.log("4. Viewing welfare interventions...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/welfare/interventions", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "04-welfare-interventions.png") });
    console.log("Captured 04-welfare-interventions.png");
  } catch (e) {
    console.log("Error capturing interventions:", e.message);
  }

  // Welfare Alerts
  console.log("5. Viewing welfare alerts...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/welfare/alerts", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "05-welfare-alerts.png") });
    console.log("Captured 05-welfare-alerts.png");
  } catch (e) {
    console.log("Error capturing alerts:", e.message);
  }

  // --- COMMANDER ---
  console.log("6. Logging in as Commander (CO-014)...");
  await loginAs(2, "CO-014");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, "06-commander-dashboard.png") });
  console.log("Captured 06-commander-dashboard.png");

  // Commander Analytics
  console.log("7. Viewing commander analytics...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/commander/analytics", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "07-commander-analytics.png") });
    console.log("Captured 07-commander-analytics.png");
  } catch (e) {
    console.log("Error capturing analytics:", e.message);
  }

  // --- PERSONNEL PORTAL ---
  console.log("8. Logging in as Personnel (P-1024)...");
  await loginAs(0, "P-1024");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, "08-personnel-dashboard.png") });
  console.log("Captured 08-personnel-dashboard.png");

  // Personnel Assessment
  console.log("9. Viewing self-assessment check-in...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/personnel/assessment", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "09-personnel-assessment.png") });
    console.log("Captured 09-personnel-assessment.png");
  } catch (e) {
    console.log("Error capturing assessment:", e.message);
  }

  // Personnel Privacy
  console.log("10. Viewing personnel privacy manager...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/personnel/privacy", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "10-personnel-privacy.png") });
    console.log("Captured 10-personnel-privacy.png");
  } catch (e) {
    console.log("Error capturing privacy:", e.message);
  }

  // --- ADMINISTRATOR ---
  console.log("11. Logging in as Administrator (AD-001)...");
  await loginAs(3, "AD-001");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, "11-admin-simulation.png") });
  console.log("Captured 11-admin-simulation.png");

  // Admin Audit Logs
  console.log("12. Viewing admin audit logs...");
  try {
    await page.goto("https://sentinel-well-mind.vercel.app/admin/audit-logs", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, "12-admin-audit-logs.png") });
    console.log("Captured 12-admin-audit-logs.png");
  } catch (e) {
    console.log("Error capturing audit logs:", e.message);
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
