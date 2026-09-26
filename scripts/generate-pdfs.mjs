import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve("D:/SIH_2026/sentinel-well-mind/docs");

async function generatePDFs() {
  console.log("Generating PDFs with Chromium printToPDF...");

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Helper function to render markdown-like HTML to clean defense-grade PDF
  async function renderToPDF(title, subtitle, contentMarkdown, outputPath) {
    // Basic Markdown to HTML converter
    let htmlContent = contentMarkdown
      .replace(/^### (.*$)/gim, '<h3 style="color:#0f172a; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#1e293b; margin-top:26px; margin-bottom:12px; border-bottom:2px solid #cbd5e1; padding-bottom:6px;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="color:#0f2942; margin-top:10px; margin-bottom:14px;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:12px;">$1</code>')
      .replace(/^(\*|-)\s+(.*$)/gim, '<li style="margin-bottom:6px;">$2</li>')
      .replace(/(\n<li>.*<\/li>)+/gim, '<ul style="padding-left:20px; margin-top:6px; margin-bottom:12px;">$&</ul>')
      .replace(/\n\n/gim, '<p style="margin-top:8px; margin-bottom:12px; line-height:1.6;"></p>');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {
              content: counter(page);
              font-size: 10px;
              color: #64748b;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            font-size: 12.5px;
            line-height: 1.55;
            background: #ffffff;
          }
          .header-box {
            border-bottom: 3px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .badge {
            background: #e0f2fe;
            color: #0369a1;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 11px;
          }
          th {
            background: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
          }
          td {
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          blockquote {
            background: #f0f9ff;
            border-left: 4px solid #0284c7;
            margin: 14px 0;
            padding: 10px 14px;
            color: #0369a1;
            font-style: italic;
          }
          .footer-note {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div style="font-size: 20px; font-weight: 800; color: #0f2942;">SentinelWell AI</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Predictive Personnel Stress & Welfare Monitoring System for Uniformed Forces</div>
          </div>
          <div class="badge">SIH 2026 · PS 26186</div>
        </div>

        ${htmlContent}

        <div class="footer-note">
          Smart India Hackathon 2026 · Ministry of Home Affairs (MHA) / CRPF · Developed by MANIT Bhopal
        </div>
      </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" }
    });
    console.log(`Generated: ${outputPath}`);
  }

  // 1. Generate Executive Summary PDF
  const execSummaryMd = fs.readFileSync(path.join(DOCS_DIR, "EXECUTIVE_SUMMARY.md"), "utf-8");
  await renderToPDF(
    "SentinelWell AI — Executive Summary Brief",
    "Smart India Hackathon 2026",
    execSummaryMd,
    path.join(DOCS_DIR, "SentinelWell_Executive_Summary.pdf")
  );

  // 2. Generate Technical Specification PDF
  const techSpecMd = fs.readFileSync(path.join(DOCS_DIR, "TECHNICAL_SPECIFICATION.md"), "utf-8");
  await renderToPDF(
    "SentinelWell AI — Technical Specification Whitepaper",
    "Smart India Hackathon 2026",
    techSpecMd,
    path.join(DOCS_DIR, "SentinelWell_Technical_Specification.pdf")
  );

  await browser.close();
  console.log("All PDF documents generated successfully!");
}

generatePDFs().catch(console.error);
