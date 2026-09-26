import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const FRAMES_DIR = path.resolve("D:/SIH_2026/sentinel-well-mind/docs/videos/frames");

if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

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

let frameIndex = 0;

async function recordPage({
  page,
  url,
  role,
  token,
  title,
  subtitle,
  scrollSteps = 5,
  holdStart = 4,
  holdEnd = 4
}) {
  console.log(`Recording [${title}]...`);

  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2" });
  await page.evaluate(({ role, token }) => {
    localStorage.setItem("sentinelwell.role", role);
    localStorage.setItem("sentinelwell.token", token);
  }, { role, token });

  await page.goto(url, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 3500));

  // Inject sleek modern banner overlay
  await page.evaluate(({ title, subtitle }) => {
    const old = document.getElementById("sih-demo-overlay");
    if (old) old.remove();

    const banner = document.createElement("div");
    banner.id = "sih-demo-overlay";
    banner.style.position = "fixed";
    banner.style.bottom = "24px";
    banner.style.left = "280px";
    banner.style.zIndex = "999999";
    banner.style.background = "rgba(10, 25, 47, 0.92)";
    banner.style.backdropFilter = "blur(12px)";
    banner.style.border = "1px solid rgba(56, 189, 248, 0.35)";
    banner.style.borderRadius = "12px";
    banner.style.padding = "12px 24px";
    banner.style.boxShadow = "0 20px 35px -5px rgba(0,0,0,0.5), 0 0 20px rgba(56, 189, 248, 0.15)";
    banner.style.fontFamily = "system-ui, -apple-system, sans-serif";
    banner.style.color = "#ffffff";
    banner.style.maxWidth = "750px";
    banner.style.pointerEvents = "none";
    banner.style.animation = "fadeIn 0.5s ease-out";

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 10px #38bdf8;"></span>
        <div>
          <div style="font-size: 15px; font-weight: 700; letter-spacing: 0.3px; color: #f8fafc;">${title}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">${subtitle}</div>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }, { title, subtitle });

  async function snap() {
    const pad = String(frameIndex++).padStart(5, "0");
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame_${pad}.png`) });
  }

  // Initial hold
  for (let i = 0; i < holdStart; i++) {
    await snap();
    await new Promise(r => setTimeout(r, 400));
  }

  // Check scroll height
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);

  if (scrollHeight > 100) {
    const delta = scrollHeight / scrollSteps;
    for (let s = 1; s <= scrollSteps; s++) {
      const targetY = delta * s;
      await page.evaluate(y => window.scrollTo({ top: y, behavior: "smooth" }), targetY);
      await new Promise(r => setTimeout(r, 600));
      await snap();
      await snap();
    }
    // Bottom hold
    for (let i = 0; i < holdEnd; i++) {
      await snap();
      await new Promise(r => setTimeout(r, 400));
    }
  }
}

async function run() {
  console.log("Starting video frame capture pipeline...");
  const tokens = await getTokens();

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.0 },
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"]
  });

  const page = await browser.newPage();

  // 1. Title / Login screen
  await page.goto("https://sentinel-well-mind.vercel.app/login", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.bottom = "30px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.zIndex = "999999";
    banner.style.background = "rgba(10, 25, 47, 0.95)";
    banner.style.border = "1px solid rgba(56, 189, 248, 0.4)";
    banner.style.borderRadius = "14px";
    banner.style.padding = "16px 32px";
    banner.style.color = "#ffffff";
    banner.style.textAlign = "center";
    banner.style.fontFamily = "system-ui, sans-serif";
    banner.innerHTML = `
      <div style="font-size: 18px; font-weight: 700; color: #38bdf8;">SentinelWell AI · SIH 2026 Problem ID: 26186</div>
      <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">Predictive Personnel Stress & Welfare Monitoring System for Uniformed Forces</div>
    `;
    document.body.appendChild(banner);
  });
  for (let i = 0; i < 6; i++) {
    const pad = String(frameIndex++).padStart(5, "0");
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame_${pad}.png`) });
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. Welfare Command Center (Full page scroll)
  await recordPage({
    page,
    role: "welfare",
    token: tokens.welfare?.token,
    url: "https://sentinel-well-mind.vercel.app/welfare/dashboard",
    title: "Welfare Officer Command Center",
    subtitle: "Real-time triage of 165+ personnel, 6-month risk velocity curves, and unit wellness cards",
    scrollSteps: 8,
    holdStart: 6,
    holdEnd: 6
  });

  // 3. Personnel Risk Radar & Explainable AI (P-1024)
  await recordPage({
    page,
    role: "welfare",
    token: tokens.welfare?.token,
    url: "https://sentinel-well-mind.vercel.app/welfare/personnel/P-1024",
    title: "Explainable AI (SHAP) & Personnel Risk Radar",
    subtitle: "0–100 Welfare Index, primary trigger factor weights, longitudinal telemetry & action hub",
    scrollSteps: 8,
    holdStart: 6,
    holdEnd: 6
  });

  // 4. Welfare Alerts Center
  await recordPage({
    page,
    role: "welfare",
    token: tokens.welfare?.token,
    url: "https://sentinel-well-mind.vercel.app/welfare/alerts",
    title: "Proactive Welfare Alert Center",
    subtitle: "Automated early warnings for excessive workload and sustained sleep deficits",
    scrollSteps: 5,
    holdStart: 5,
    holdEnd: 5
  });

  // 5. Welfare Interventions Tracking
  await recordPage({
    page,
    role: "welfare",
    token: tokens.welfare?.token,
    url: "https://sentinel-well-mind.vercel.app/welfare/interventions",
    title: "Confidential Welfare Interventions",
    subtitle: "Logging supportive actions: 48-hr rest cycles, roster rotations & counseling",
    scrollSteps: 4,
    holdStart: 5,
    holdEnd: 4
  });

  // 6. Commander Battalion Overview
  await recordPage({
    page,
    role: "commander",
    token: tokens.commander?.token,
    url: "https://sentinel-well-mind.vercel.app/commander/dashboard",
    title: "Commander Battalion Overview",
    subtitle: "Aggregated force readiness without individual medical disclosure (Zero Stigma)",
    scrollSteps: 6,
    holdStart: 6,
    holdEnd: 5
  });

  // 7. Commander Unit Analytics
  await recordPage({
    page,
    role: "commander",
    token: tokens.commander?.token,
    url: "https://sentinel-well-mind.vercel.app/commander/analytics",
    title: "Longitudinal Unit Stress & Fatigue Analytics",
    subtitle: "Unit-level risk mix, leave utilization curves, and continuous deployment distributions",
    scrollSteps: 5,
    holdStart: 5,
    holdEnd: 4
  });

  // 8. Personnel Self-Check & Wellness Portal
  await recordPage({
    page,
    role: "personnel",
    token: tokens.personnel?.token,
    url: "https://sentinel-well-mind.vercel.app/personnel/dashboard",
    title: "Personnel Voluntary Check-In Portal",
    subtitle: "Sub-minute voluntary sliders for stress, sleep, energy, and perceived workload",
    scrollSteps: 5,
    holdStart: 5,
    holdEnd: 4
  });

  // 9. Personnel Trends
  await recordPage({
    page,
    role: "personnel",
    token: tokens.personnel?.token,
    url: "https://sentinel-well-mind.vercel.app/personnel/trends",
    title: "Personnel Wellness Trajectory",
    subtitle: "Personal historical monitoring of sleep, workload, and recuperation trends",
    scrollSteps: 5,
    holdStart: 5,
    holdEnd: 4
  });

  // 10. Personnel Privacy & Consent Manager
  await recordPage({
    page,
    role: "personnel",
    token: tokens.personnel?.token,
    url: "https://sentinel-well-mind.vercel.app/personnel/privacy",
    title: "Granular Privacy & Data Consent Center",
    subtitle: "Personnel control what is collected — immediate opt-in/opt-out for wellness data",
    scrollSteps: 4,
    holdStart: 5,
    holdEnd: 4
  });

  // 11. Administrator Governance & Simulation Engine
  await recordPage({
    page,
    role: "admin",
    token: tokens.admin?.token,
    url: "https://sentinel-well-mind.vercel.app/admin/dashboard",
    title: "Administration & Real-Time Stress Simulator",
    subtitle: "Live demo engine to simulate duty spikes and observe instant alert propagation",
    scrollSteps: 4,
    holdStart: 5,
    holdEnd: 4
  });

  // 12. Security Audit Logs
  await recordPage({
    page,
    role: "admin",
    token: tokens.admin?.token,
    url: "https://sentinel-well-mind.vercel.app/admin/audit-logs",
    title: "Immutable Security Audit Trails",
    subtitle: "Full audit logging of every single access event for compliance & confidentiality",
    scrollSteps: 8,
    holdStart: 5,
    holdEnd: 5
  });

  await browser.close();
  console.log(`Captured ${frameIndex} frames!`);
}

run().catch(err => {
  console.error("Recording error:", err);
  process.exit(1);
});
