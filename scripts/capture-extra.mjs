import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("docs/images");

async function captureMore() {
  const res = await fetch("https://sentinelwell-api.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceId: "P-1024", password: "demo-access", role: "personnel" }),
  });
  const data = await res.json();
  const token = data.data.accessToken;

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"]
  });

  const page = await browser.newPage();
  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2" });
  await page.evaluate(({ token }) => {
    localStorage.setItem("sentinelwell.role", "personnel");
    localStorage.setItem("sentinelwell.token", token);
  }, { token });

  // 1. Personnel Trends
  await page.goto("https://sentinel-well-mind.vercel.app/personnel/trends", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(OUT_DIR, "13-personnel-trends.png"), fullPage: true });
  console.log("Saved: 13-personnel-trends.png");

  // 2. Personnel Support
  await page.goto("https://sentinel-well-mind.vercel.app/personnel/support", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(OUT_DIR, "14-personnel-support.png"), fullPage: true });
  console.log("Saved: 14-personnel-support.png");

  await browser.close();
}

captureMore().catch(console.error);
