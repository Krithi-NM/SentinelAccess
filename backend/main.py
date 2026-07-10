from fastapi import FastAPI, Depends, HTTPException, Query
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import create_engine, desc, func
import models, schemas, ml_utils, uuid
from database import get_db, engine, SessionLocal
from seed import seed_db
import pandas as pd
from datetime import datetime, timedelta

app = FastAPI(title="SentinelAccess Insider Threat Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    # Ensure database tables exist and seed demo data if empty.
    models.Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        if db.query(models.AccessEvent).count() == 0:
            seed_db()
    finally:
        db.close()

@app.get("/api/events", response_model=List[schemas.EventWithUser])
def get_events(
    risk_tier: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(models.AccessEvent).options(joinedload(models.AccessEvent.user))
    if risk_tier:
        query = query.filter(models.AccessEvent.risk_tier == risk_tier)
    if user_id:
        query = query.filter(models.AccessEvent.user_id == user_id)
    
    return query.order_by(desc(models.AccessEvent.risk_score)).offset(offset).limit(limit).all()

@app.get("/api/events/{event_id}", response_model=schemas.EventWithUser)
def get_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(models.AccessEvent).options(joinedload(models.AccessEvent.user)).filter(models.AccessEvent.event_id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.get("/api/dashboard/summary", response_model=schemas.DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    # Find the "latest" day in the data to simulate "today"
    latest_event = db.query(models.AccessEvent).order_by(desc(models.AccessEvent.timestamp)).first()
    if not latest_event:
        return {"total_today": 0, "critical": 0, "high": 0, "medium": 0, "top_risk_events": []}
    
    # Count by tier for the "today" (most recent calendar day)
    total_today = db.query(models.AccessEvent).filter(
        func.date(models.AccessEvent.timestamp) == func.date(latest_event.timestamp)
    ).count()
    
    # Global counts for critical/high/medium as summary cards often show current total or subset.
    # The user asked to compute 'Critical', 'High', 'Medium' - I'll keep these global for better context
    # but the "total_today" will be specific to the day.
    critical = db.query(models.AccessEvent).filter(models.AccessEvent.risk_tier == "Critical").count()
    high = db.query(models.AccessEvent).filter(models.AccessEvent.risk_tier == "High").count()
    medium = db.query(models.AccessEvent).filter(models.AccessEvent.risk_tier == "Medium").count()
    
    top_events = db.query(models.AccessEvent).options(joinedload(models.AccessEvent.user)).order_by(desc(models.AccessEvent.risk_score)).limit(5).all()
    
    return {
        "total_today": total_today,
        "critical": critical,
        "high": high,
        "medium": medium,
        "top_risk_events": top_events
    }

@app.get("/api/users/{user_id}", response_model=schemas.UserProfile)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    events = db.query(models.AccessEvent).filter(models.AccessEvent.user_id == user_id).order_by(models.AccessEvent.timestamp).all()
    
    # Calculate simple baselines
    hours = [e.access_hour for e in events]
    typical_hour = f"{max(set(hours), key=hours.count):02d}:00" if hours else "09:00"
    
    resources = list(set([e.resource_accessed for e in events]))
    avg_vol = sum([e.data_volume_mb for e in events]) / len(events) if events else 0
    
    risk_trend = [{"timestamp": e.timestamp.isoformat(), "score": e.risk_score} for e in events]
    
    return {
        **user.__dict__,
        "typical_hours": typical_hour,
        "typical_resources": resources,
        "avg_data_volume": round(avg_vol, 2),
        "risk_trend": risk_trend,
        "recent_events": events[::-1][:10]
    }

@app.post("/api/events/{event_id}/acknowledge")
def acknowledge_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(models.AccessEvent).filter(models.AccessEvent.event_id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.is_acknowledged = True
    event.status = "Acknowledged"
    db.commit()
    return {"status": "success"}

@app.post("/api/events/{event_id}/escalate")
def escalate_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(models.AccessEvent).filter(models.AccessEvent.event_id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.is_escalated = True
    event.status = "Escalated"
    db.commit()
    return {"status": "success"}

@app.post("/api/simulate-attack")
def simulate_attack(db: Session = Depends(get_db)):
    # Create a specific sequence for "EMP-SIM-01"
    sim_id = "EMP-SIM-01"
    user = db.query(models.User).filter(models.User.user_id == sim_id).first()
    if not user:
        user = models.User(
            user_id=sim_id,
            name="Vikram Malhotra",
            role="admin",
            department="IT Operations",
            join_date=datetime.now() - timedelta(days=500)
        )
        db.add(user)
        db.commit()

    now = datetime.now()
    
    # 1. Login
    e1 = models.AccessEvent(
        event_id=str(uuid.uuid4())[:8],
        user_id=sim_id,
        timestamp=now - timedelta(minutes=15),
        action_type="login",
        resource_accessed="Admin Console",
        access_hour=9,
        location="Mumbai",
        ip_flag=False,
        data_volume_mb=2.5,
        failed_attempts_before=0,
        risk_score=15.0,
        risk_tier="Low",
        top_reasons=["Standard login from known location."],
        audit_hash="SIM_HASH_1",
        status="Pending"
    )
    
    # 2. Access Privileged Server
    e2 = models.AccessEvent(
        event_id=str(uuid.uuid4())[:8],
        user_id=sim_id,
        timestamp=now - timedelta(minutes=10),
        action_type="file_access",
        resource_accessed="Core Banking DB",
        access_hour=9,
        location="Mumbai",
        ip_flag=False,
        data_volume_mb=15.0,
        failed_attempts_before=0,
        risk_score=45.0,
        risk_tier="Medium",
        top_reasons=["Accessed high-value resource.", "Unusual resource for this role."],
        audit_hash="SIM_HASH_2",
        status="Pending"
    )
    
    # 3. High Volume Download
    e3 = models.AccessEvent(
        event_id=str(uuid.uuid4())[:8],
        user_id=sim_id,
        timestamp=now - timedelta(minutes=5),
        action_type="data_export",
        resource_accessed="Core Banking DB",
        access_hour=9,
        location="Mumbai",
        ip_flag=False,
        data_volume_mb=4500.0,
        failed_attempts_before=0,
        risk_score=98.5,
        risk_tier="Critical",
        top_reasons=["45x normal data volume download.", "Potential data exfiltration detected.", "MFA not challenged for large export."],
        audit_hash="SIM_HASH_3",
        status="Pending"
    )
    
    db.add(e1)
    db.add(e2)
    db.add(e3)
    db.commit()
    
    return {"status": "attack simulated", "event_id": e3.event_id}

@app.post("/api/rescore")
def rescore_events(db: Session = Depends(get_db)):
    # In a real app, this would fetch new data. Here we just re-run the ML pipeline on existing data.
    events = db.query(models.AccessEvent).all()
    users = db.query(models.User).all()
    
    events_df = pd.DataFrame([e.__dict__ for e in events])
    users_df = pd.DataFrame([u.__dict__ for u in users])
    
    scored_df = ml_utils.train_and_score(events_df, users_df)
    
    for _, row in scored_df.iterrows():
        e = db.query(models.AccessEvent).filter(models.AccessEvent.event_id == row['event_id']).first()
        if e:
            e.risk_score = row['risk_score']
            e.risk_tier = row['risk_tier']
            e.top_reasons = row['top_reasons']
            # Re-hash since content changed
            clean_event = {k: row[k] for k in [
                'event_id', 'user_id', 'timestamp', 'action_type', 'resource_accessed',
                'access_hour', 'location', 'ip_flag', 'data_volume_mb', 'failed_attempts_before',
                'risk_score', 'risk_tier', 'top_reasons'
            ]}
            e.audit_hash = ml_utils.compute_audit_hash(clean_event)
            
    db.commit()
    return {"status": "rescoring complete"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
