# SentinelAccess Presentation Content

## Slide 1 — Title
**Product Name:** SentinelAccess  
**Tagline:** Banking-Grade Insider Threat Detection with Explainable AI & Immutable Audit Trails.  
**Team Name:** [INSERT TEAM NAME]  
**Date:** [INSERT DATE]

---

## Slide 2 — Problem Statement
**Problem Statement:** Addressing the "Visibility Gap" in Privileged Access Misuse and Insider Threats within Financial Institutions.  
**Why SentinelAccess?** Traditional rule-based systems fail to catch "low and slow" data exfiltration or credential misuse that occurs within valid access windows. SentinelAccess solves this by shifting from static rules to dynamic behavioral baselining, using machine learning to detect subtle deviations in access patterns that indicate a compromised insider or malicious agent.

---

## Slide 3 — Pre-Requisite
**Backend Dependencies:** `fastapi`, `uvicorn`, `sqlalchemy`, `pandas`, `scikit-learn`, `numpy`.  
**Frontend Dependencies:** `react` (v19), `recharts`, `tailwind-css`, `lucide-react`, `axios`.  
**Data Assumptions:** 
- The system is pre-seeded via `seed.py` with 40 unique user profiles (Indian Banking context).
- Synthetic generation assumes a 10% anomaly rate across 30 days of access logs.
- Baselines are established per-user for "typical" access hours, resource sets, and data volumes.  
**External Access:** None. The application is completely self-contained, using a local SQLite database and local ML model training.

---

## Slide 4 — Tools or Resources
**Backend Framework:** FastAPI (Python 3.10+)  
**Machine Learning:** scikit-learn (Isolation Forest Algorithm for Unsupervised Anomaly Detection)  
**Frontend Framework:** React 19 (Vite Build System)  
**Styling:** Tailwind CSS 3.4 (Modern, Utility-first UI)  
**Charting:** Recharts (Dynamic Risk Distribution and Trend Visualization)  
**Database:** SQLite via SQLAlchemy ORM (Lightweight, Single-file Database)

---

## Slide 5 — Supporting Functional Documents
**Data Schema:**
- **User Model (`users`):** `user_id`, `name`, `role` (Admin, Vendor, Employee, Contractor), `department`, `join_date`.
- **Access Event Model (`access_events`):** `event_id`, `timestamp`, `action_type`, `resource_accessed`, `data_volume_mb`, `location`, `failed_attempts_before`, `risk_score`, `risk_tier`, `top_reasons`, `audit_hash`.

**Logic & Scoring Flow:**
- **Feature Engineering:** Implemented in `ml_utils.py:engineer_features()`. Calculates deviations (Hour Diff, Volume Ratio, New Location) relative to user-specific historical baselines.
- **ML Scoring:** Implemented in `ml_utils.py:train_and_score()`. Uses `IsolationForest` to generate anomaly scores, scaled 0-100 via `MinMaxScaler`.
- **Explainability:** Realized via `ml_utils.py:generate_reasons()`, which maps feature deviations to natural language insights (e.g., "Data volume 12x above average").

---

## Slide 6 — Key Differentiators & Adoption Plan
**Differentiators:**
1. **Explainable AI (XAI):** Unlike "black-box" models, every flagged alert displays 2-3 concrete reasons derived from the model's feature space.
2. **Immutable Audit Trails:** Each event record includes a SHA-3-256 hash (`audit_hash`) of its data, ensuring log integrity for regulatory compliance (SEBI/RBI).
3. **Per-User Baselining:** Model accounts for individual user roles (e.g., a Vendor's "normal" is different from an Admin's).

**Adoption Plan:**
- **Phase 1:** Stealth monitoring alongside existing SIEM tools to tune contamination rates.
- **Phase 2:** Integration with IAM systems for automated "Just-in-Time" MFA challenges on high-risk events.

---

## Slide 7 — GitHub Repository & Diagrams
**GitHub Link:** [INSERT GITHUB LINK]  
**Diagrams/Screenshots to Include:**
- **Dashboard Overview:** Showing high-level risk distribution and critical alert counts.
- **Alert Feed:** Prioritized list of recent anomalies.
- **Risk Distribution Chart:** Visualization of "Low" vs "Critical" events.
- **Architecture Diagram:** Multi-layered flow from raw logs to React UI.

---

## Slide 8 — Business Potential and Relevance
**Business Value:**
- **Regulatory Compliance:** Directly addresses requirements for "Continuous Monitoring" of privileged accounts.
- **Risk Mitigation:** Detects data exfiltration *before* the final export by identifying unusual resource traversal or off-hours login attempts.
- **Operational Efficiency:** Reduces "Alert Fatigue" for SOC analysts by providing pre-analyzed explanations for every risk score.

---

## Slide 9 — Uniqueness of Approach
**Real Implementation Choices:**
- **Unsupervised Learning:** Uses `IsolationForest` in `ml_utils.py`, meaning it requires no labeled "bad" data to start detecting threats.
- **Edge-Ready Architecture:** Small footprint (FastAPI + SQLite) allows it to run on-premise near the data source, ensuring zero data leakage to public clouds.
- **Audit-First Design:** The inclusion of `compute_audit_hash` in the core ML pipeline ensures that the "Analysis" is as tamper-proof as the "Log."

---

## Slide 10 — User Experience
**Workflow:**
1. **Dashboard:** Analyst sees a "Risk Temperature" graph and total critical alerts.
2. **Alerts Page:** User scans a color-coded table (Critical/High/Medium).
3. **Event Detail Slide-over:** Clicking an alert opens a panel (implemented in `EventDetail.jsx`) showing the exact timestamp, location, and the **Top Reasons** for the score.
4. **User Profile:** Drill down into a specific user's login history and historical risk trend.

---

## Slide 11 — Scalability
**Current State:** Stateless FastAPI API with local SQLite.
**Scaling Path:**
- **Database:** Simple migration to **Postgres** (SQLAlchemy `DB_URL` change) for concurrent write heavy-lifting.
- **Training:** Moving from on-request retraining to a background **Celery/Redis** worker task for 1.0 models.
- **Distributed:** Deployable via Docker (Backend + Frontend containers) for K8s orchestration.

---

## Slide 12 — Ease of Deployment and Maintenance
**Setup Simplicity:**
- Single `requirements.txt` for backend.
- Automated `seed.py` command that builds the database and trains the initial model in < 5 seconds.
- Vite-powered frontend for lightning-fast HMR during customization.
**Maintenance:**
- Model retraining is as simple as re-running the scoring pipeline periodically.
- No specialized MLops infrastructure required for the prototype.

---

## Slide 13 — Security Considerations
**Implemented Features:**
- **SHA-3 Audit Integrity:** Located in `ml_utils.py`, ensuring log records cannot be modified after the fact without breaking the hash.
- **Data Privacy:** Local execution ensures sensitive banking resource names (e.g., "Core Banking DB") never leave the internal network.
**Prototype Note:** Dashboard currently bypasses Auth for demo ease; Production roadmap includes JWT-based RBAC for access to the SentinelAccess cockpit itself.

---

## Slide 14 — Architecture Diagram
**Data Flow Chain:**
1. **Ingest/Seed:** `seed.py` generates synthetic event objects.
2. **Analysis:** `ml_utils.py` processes objects → `IsolationForest` outputs scores.
3. **Storage:** `database.py` commits scored events + SHA-3 hashes to `sentinelaccess.db`.
4. **API Serve:** `main.py` endpoints (`/api/alerts`, `/api/stats`) query DB.
5. **Consumption:** `App.jsx` routes to `Dashboard.jsx`, which fetches via `axios`.
6. **Rendering:** `Recharts` and `EventTable.jsx` display findings to the end-user.

---

## Slide 15 — Screenshots, Demo Video & GitHub Link
**Captures Needed:**
- [ ] **Main Dashboard:** Ensure 'Risk Tier Distribution' donut chart is visible.
- [ ] **Alert Details:** Screenshot of the `EventDetail` slide-over specifically highlighting the "Anomaly Reasons" bullet points.
- [ ] **User Profile:** Showing the "Risk Score Over Time" line chart for a suspicious user.
- [ ] **Audit Hash:** A screenshot of the raw JSON/Table view showing the `audit_hash` field to prove log integrity.

---

## Slide 16 — Thank You
**Team Members:**
- [NAME 1] - [ROLE]
- [NAME 2] - [ROLE]
- [NAME 3] - [ROLE]
**Contact:** [EMAIL/LINKEDIN/GITHUB]
**Q&A Session**
