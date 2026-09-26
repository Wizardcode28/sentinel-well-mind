import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve("D:/SIH_2026/sentinel-well-mind/docs");

async function generateTechSpecPDF() {
  console.log("Generating SentinelWell_Technical_Specification.pdf...");

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const techSpecMd = fs.readFileSync(path.join(DOCS_DIR, "TECHNICAL_SPECIFICATION.md"), "utf-8");

  // Clean Markdown -> HTML formatting
  let htmlContent = techSpecMd
    .replace(/^### (.*$)/gim, '<h3 style="color:#0f172a; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color:#1e293b; margin-top:24px; margin-bottom:12px; border-bottom:2px solid #cbd5e1; padding-bottom:6px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color:#0f2942; margin-top:10px; margin-bottom:14px;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre style="background:#0f172a; color:#f8fafc; padding:12px; border-radius:6px; font-size:11px; overflow-x:auto;">$1</pre>')
    .replace(/`([^`]+)`/gim, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:11px;">$1</code>')
    .replace(/^(\*|-)\s+(.*$)/gim, '<li style="margin-bottom:4px;">$2</li>')
    .replace(/(\n<li>.*<\/li>)+/gim, '<ul style="padding-left:20px; margin-top:6px; margin-bottom:10px;">$&</ul>')
    .replace(/\n\n/gim, '<p style="margin-top:6px; margin-bottom:10px; line-height:1.55;"></p>');

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
          @bottom-right {
            content: counter(page);
            font-size: 10px;
            color: #64748b;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #334155;
          font-size: 11.5px;
          line-height: 1.5;
          background: #ffffff;
        }
        .header-box {
          border-bottom: 2px solid #0284c7;
          padding-bottom: 10px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .badge {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 10.5px;
        }
        th {
          background: #0f172a;
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 6px 8px;
          border: 1px solid #cbd5e1;
        }
        td {
          padding: 6px 8px;
          border: 1px solid #cbd5e1;
          vertical-align: top;
        }
        tr:nth-child(even) td {
          background: #f8fafc;
        }
      </style>
    </head>
    <body>
      <div class="header-box">
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #0f2942;">SentinelWell AI</div>
          <div style="font-size: 11px; color: #64748b;">Technical Specification & Architecture Whitepaper</div>
        </div>
        <div class="badge">SIH 2026 · PS 26186</div>
      </div>

      ${htmlContent}

      <div style="margin-top:24px; border-top:1px solid #e2e8f0; padding-top:8px; font-size:10px; color:#94a3b8; text-align:center;">
        Smart India Hackathon 2026 · Ministry of Home Affairs / CRPF · Developed by MANIT Bhopal
      </div>
    </body>
    </html>
  `;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  await page.pdf({
    path: path.join(DOCS_DIR, "SentinelWell_Technical_Specification.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" }
  });

  await browser.close();
  console.log("Technical Specification PDF created successfully!");
}

generateTechSpecPDF().catch(console.error);
