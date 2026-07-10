# SentinelAccess - Insider Threat Detection Platform

SentinelAccess is a production-grade banking security dashboard designed to detect privileged access misuse and insider threats. It monitors access logs, establishes behavioral baselines using Machine Learning, and flags anomalies with plain-English explanations.

##  Tech Stack
- **Backend**: Python 3.10+, FastAPI
- **ML**: scikit-learn (IsolationForest), pandas, NumPy
- **Database**: SQLite (file-based)
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide-react

## Setup & Installation

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python seed.py  # Generates initial synthetic data and trains the model
python main.py  # Starts the API server on http://localhost:8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts the dashboard on http://localhost:5173 (or next available port)
```

## Git & Contribution

This repository contains both the `backend` (FastAPI + ML) and `frontend` (React + Vite) projects. Before contributing, ensure you do not commit environment files, build outputs, or node modules — a `.gitignore` has been added to help with that.

Common commands:

```bash
# From repository root
git status
git add -A
git commit -m "your message"
git push
```

If you need to run the full app locally, start the backend first, then the frontend (open two terminals):

```bash
# Terminal 1 - backend
cd backend
python -m pip install -r requirements.txt
python seed.py
python main.py

# Terminal 2 - frontend
cd frontend
npm install
npm run dev
```


##  Quantum-Safe Audit Log
Every access event is hashed using SHA-3-256 for tamper-evidence, ensuring that audit trails remain immutable and verifiable against future quantum computing threats.

## Behavior Analysis
The platform uses an **Isolation Forest** algorithm to detect deviations from a user's typical:
- Access hours
- Data export volumes
- Resource sets
- Geographic locations
- Failed login attempts
