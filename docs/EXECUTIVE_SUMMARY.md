# SentinelWell AI — Executive Summary Brief
**Smart India Hackathon (SIH) 2026** | **Problem Statement ID: 26186**  
**Issuing Organization:** Ministry of Home Affairs (MHA) & Central Reserve Police Force (CRPF)  
**Institution:** Maulana Azad National Institute of Technology (MANIT), Bhopal  
**Live Platform:** [https://sentinel-well-mind.vercel.app/login](https://sentinel-well-mind.vercel.app/login)

---

## 1. Operational Problem & Background
Uniformed personnel serving across the **Central Armed Police Forces (CRPF, BSF, CISF, ITBP, SSB)**, the **Indian Armed Forces**, and **State Police forces** face extraordinary operational demands: continuous counter-insurgency rotations, border deployments, irregular circadian rhythms, and prolonged separation from families.

* **The Core Gap:** Present welfare monitoring is almost exclusively **reactive**—burnout and psychological fatigue are identified only after severe operational degradation or tragic incidents occur.
* **The Trust Barrier:** Stigmatization surrounding mental health prevents personnel from seeking timely care due to fears of career penalties or administrative consequences.

---

## 2. The SentinelWell Solution & Ethical Philosophy
SentinelWell AI is an **indigenous, privacy-preserving, and explainable welfare monitoring platform** that shifts force health management from reactive intervention to proactive organizational prevention.

> **Ethical Creed:** *"Support, Not Surveillance. Welfare, Not Diagnosis."*

* **Multi-Factor Intelligence Fusion:** Fuses objective duty data (consecutive duty days, night shift density, deployment lengths, leave rejection rates) with voluntary, low-friction mobile wellness check-ins (sleep quality, perceived fatigue, energy).
* **Zero Medical Stigmatization:** Never outputs clinical psychiatric diagnoses or punitive tags like *"unfit"*. It outputs operational **Welfare Risk Tiers** (`Low`, `Moderate`, `High`, `Critical`) linked directly to support protocols.
* **Explainable AI (SHAP):** Replaces opaque "black-box" models with transparent game-theory Shapley attributions, highlighting the top 3 contributing stressors for every generated alert.

---

## 3. Role-Based Architecture & Air-Gapping

| Role Portal | Access Boundaries & Core Functions | Privacy Protections |
| :--- | :--- | :--- |
| **Personnel Portal** (`P-1024`) | Sub-minute daily check-in (stress, sleep, energy, workload), 6-month wellness trajectory, confidential support request button. | Full consent toggles; option to revoke optional telemetry anytime. Biometrics disabled by default. |
| **Welfare Officer** (`WO-208`) | Real-time triage command center (165+ records), 0–100 risk radar, SHAP trigger breakdown, intervention logging (rest cycles, roster rotation). | Confidential one-on-one view; records restricted from general duty rosters. |
| **Commander** (`CO-014`) | Battalion-level readiness heatmaps, unit-by-unit fatigue curves, continuous deployment distribution, leave utilization trends. | **Strictly Anonymized:** Zero visibility into individual medical or personal profiles. |
| **Administrator** (`AD-001`) | Immutable security access audit trails, user provisioning, real-time stress anomaly simulation engine. | Every data access and modification is cryptographically logged with timestamps. |

---

## 4. Technology Stack & Cloud Deployment
* **Client Layer:** React 19, TypeScript, TanStack Router, Tailwind CSS, Recharts, Lucide Icons (Hosted on Vercel).
* **Backend API Layer:** Node.js, Express, TypeScript, Prisma ORM, Helmet security, rate limiting (Render Cloud Services).
* **AI / ML Microservice:** Python 3.11, FastAPI, LightGBM (Multi-class Risk Classification), Isolation Forest (Unsupervised Anomaly Detection), SHAP TreeExplainer.
* **Database Infrastructure:** **Aiven Cloud MySQL** with enforced TLS/SSL encryption and automated failover.

---

## 5. Key Quantitative Impacts & Readiness
* **Early Detection Window:** Detects operational fatigue spikes **14 to 21 days earlier** than manual review.
* **Low Latency Inference:** `< 85ms` machine learning inference latency on multi-variate duty records.
* **End-to-End Encryption:** Strict role-based JWT access tokens over enforced SSL/TLS communication.
* **High Extensibility:** Ready for offline outpost PWA sync and future CAPF HRMS automated data adapters.

---

## 6. Project Team (MANIT Bhopal)
* **Puru Yadav** — Team Leader &middot; AI / ML & Predictive Analytics Lead
* **Nishant Pastor** — Frontend & UI/UX Specialist
* **Raghav Jhalani** — Data Engineering Lead
* **HarshVardhan Khare** — Model Optimization & Machine Learning
* **Aarti Mishra** — Quality Assurance & Defense Domain Research
* **Sarthak Mittal** — Backend Architecture & Cloud Deployment
