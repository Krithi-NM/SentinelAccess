from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    user_id: str
    name: str
    role: str
    department: str
    join_date: datetime

    class Config:
        orm_mode = True

class EventBase(BaseModel):
    event_id: str
    user_id: str
    timestamp: datetime
    action_type: str
    resource_accessed: str
    access_hour: int
    location: str
    ip_flag: bool
    data_volume_mb: float
    failed_attempts_before: int
    risk_score: float
    risk_tier: str
    top_reasons: List[str]
    is_acknowledged: bool
    audit_hash: Optional[str]

    class Config:
        orm_mode = True

class EventWithUser(EventBase):
    user: UserBase

class DashboardSummary(BaseModel):
    total_today: int
    critical: int
    high: int
    medium: int
    top_risk_events: List[EventWithUser]

class UserProfile(UserBase):
    typical_hours: str
    typical_resources: List[str]
    avg_data_volume: float
    risk_trend: List[dict] # {timestamp, score}
    recent_events: List[EventBase]
