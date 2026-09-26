import puppeteer from "puppeteer-core";
import path from "path";

const DOCS_DIR = path.resolve("D:/SIH_2026/sentinel-well-mind/docs");

async function renderDefencePDFs() {
  console.log("Launching headless browser to print defense publications...");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
      "--user-data-dir=D:\\chrome_temp_profile",
      "--disk-cache-dir=D:\\chrome_temp_cache"
    ]
  });

  // 1. Executive Summary PDF
  console.log("Rendering SentinelWell_Executive_Summary.pdf...");
  const page1 = await browser.newPage();
  await page1.goto(`file://${path.join(DOCS_DIR, "executive_summary_defence.html")}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page1.pdf({
    path: path.join(DOCS_DIR, "SentinelWell_Executive_Summary.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" }
  });
  await page1.close();
  console.log("Saved: SentinelWell_Executive_Summary.pdf");

  // 2. Technical Specification PDF
  console.log("Rendering SentinelWell_Technical_Specification.pdf...");
  const page2 = await browser.newPage();
  await page2.goto(`file://${path.join(DOCS_DIR, "techspec_defence.html")}`, { waitUntil: "load", timeout: 60000 });
  await page2.pdf({
    path: path.join(DOCS_DIR, "SentinelWell_Technical_Specification.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" }
  });
  await page2.close();
  console.log("Saved: SentinelWell_Technical_Specification.pdf");

  await browser.close();
  console.log("Both defense publications rendered successfully!");
}

renderDefencePDFs().catch(console.error);
