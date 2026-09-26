import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.resolve('D:/SIH_2026/sentinel-well-mind/docs');
const IMAGES_DIR = path.join(DOCS_DIR, 'images');

const DIAGRAMS = [
  {
    name: 'diagram-architecture.png',
    code: `
flowchart TB
    subgraph Client ["Client Tier (Modern Defense-Grade Web Application)"]
        UI_P["Personnel Self-Portal<br>(Check-ins, Privacy, Trends)"]
        UI_W["Welfare Officer Command Center<br>(Triage Queue, Radar, Interventions)"]
        UI_C["Commander Analytics<br>(Unit Aggregates, Readiness Heatmap)"]
        UI_A["Admin & Governance<br>(Audit Logs, Stress Simulator)"]
    end

    subgraph API ["Backend API Layer (Node.js + Express + TypeScript)"]
        Auth["Security & RBAC Middleware<br>(JWT, Role Isolation, Helmet, RateLimiting)"]
        Routes["RESTful API Endpoints<br>(/personnel, /wellness, /risk, /alerts)"]
        Prisma["Prisma ORM Client"]
    end

    subgraph ML ["AI / ML Engine (FastAPI + Python)"]
        Prep["Feature Engineering Engine<br>(Sleep Index, Burnout Velocity)"]
        IForest["Isolation Forest<br>(Unsupervised Anomaly Detection)"]
        LGBM["LightGBM Multi-Class Classifier<br>(4 Risk Bands: Low/Mod/High/Critical)"]
        SHAP["SHAP TreeExplainer<br>(Explainable AI Primary Trigger Drivers)"]
    end

    subgraph DB ["Cloud Data Persistence Layer"]
        AivenDB[("Aiven Cloud MySQL<br>(TLS/SSL Encrypted Database)")]
    end

    UI_P & UI_W & UI_C & UI_A --> Auth
    Auth --> Routes
    Routes --> Prisma --> AivenDB
    Routes -- JSON Inference Request --> Prep
    Prep --> IForest
    Prep --> LGBM
    LGBM --> SHAP
    SHAP -- Risk Score + Top 3 Triggers --> Routes
`
  },
  {
    name: 'diagram-sequence.png',
    code: `
sequenceDiagram
    autonumber
    actor P as Personnel (Ground Officer)
    actor W as Welfare Officer
    participant FE as Web Interface
    participant BE as Express API Server
    participant ML as FastAPI ML Microservice
    participant DB as Aiven Cloud MySQL

    P->>FE: Submits voluntary daily check-in (Sleep, Energy, Fatigue)
    FE->>BE: POST /api/wellness/assessment
    BE->>DB: Persist WellnessAssessment & fetch operational duty history
    BE->>ML: POST /predict (dutyDays, nightShifts, sleepHours, fatigueScore)
    ML->>ML: Calculate derived indicators (SDI, Burnout Velocity)
    ML->>ML: Run Isolation Forest (anomaly detection) + LightGBM (risk band)
    ML->>ML: Execute SHAP TreeExplainer for top 3 contributing factors
    ML-->>BE: Returns Risk Band, Continuous Score (0-100), and Primary Triggers
    BE->>DB: Store RiskAssessment entry
    alt Risk Band is HIGH or CRITICAL
        BE->>DB: Auto-generate Welfare Alert
    end
    BE-->>FE: Return confirmed score & updated trajectory
    W->>FE: Inspects Command Center triage queue
    W->>FE: Selects personnel profile -> views SHAP factor breakdown
    W->>FE: Issues proactive welfare intervention (e.g., 48-hr Rest Cycle)
    FE->>BE: POST /api/interventions
    BE->>DB: Store confidential intervention record & audit trail
`
  },
  {
    name: 'diagram-roadmap.png',
    code: `
flowchart LR
    Phase1["Phase 1: SIH Prototype (Current)<br>• Multi-role dashboard<br>• LightGBM + SHAP inference<br>• Aiven Cloud DB integration<br>• Privacy & consent controls"] --> Phase2["Phase 2: Edge & Offline Readiness<br>• Mobile PWA for remote outposts<br>• Local SQLite/IndexedDB sync<br>• HRMS automated data connector<br>• Regional language support"]
    Phase2 --> Phase3["Phase 3: Force-Wide Deployment<br>• Wearable telemetry integration (BLE)<br>• Federated learning across battalions<br>• End-to-end homomorphic encryption<br>• Field trials with CAPF formations"]
`
  }
];

async function generateMermaidDiagrams() {
  console.log('Launching browser to render Mermaid diagrams to PNG...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 2 });

  for (const item of DIAGRAMS) {
    console.log(`Rendering ${item.name}...`);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
        <style>
          body {
            background-color: #ffffff;
            margin: 0;
            padding: 24px;
            display: inline-block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .mermaid {
            font-size: 14px;
          }
        </style>
        <script>
          mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            themeVariables: {
              primaryColor: '#e0f2fe',
              primaryBorderColor: '#0284c7',
              primaryTextColor: '#0f172a',
              lineColor: '#0284c7',
              secondaryColor: '#f1f5f9',
              tertiaryColor: '#f8fafc'
            }
          });
        </script>
      </head>
      <body>
        <div class="mermaid">
          ${item.code}
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.mermaid svg', { timeout: 60000 });

    const clip = await page.evaluate(() => {
      const el = document.querySelector('.mermaid svg');
      const rect = el.getBoundingClientRect();
      return {
        x: Math.max(0, rect.x - 10),
        y: Math.max(0, rect.y - 10),
        width: rect.width + 20,
        height: rect.height + 20
      };
    });

    const outputPath = path.join(IMAGES_DIR, item.name);
    await page.screenshot({ path: outputPath, clip });
    console.log(`Saved: ${outputPath}`);
  }

  await browser.close();
  console.log('All Mermaid diagrams converted to high-res PNG successfully!');
}

generateMermaidDiagrams().catch(console.error);
