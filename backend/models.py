from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True)
    name = Column(String)
    role = Column(String) # admin, vendor, contractor, employee
    department = Column(String)
    join_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    events = relationship("AccessEvent", back_populates="user")

class AccessEvent(Base):
    __tablename__ = "access_events"
    event_id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    timestamp = Column(DateTime)
    action_type = Column(String)
    resource_accessed = Column(String)
    access_hour = Column(Integer)
    location = Column(String)
    ip_flag = Column(Boolean, default=False)
    data_volume_mb = Column(Float)
    failed_attempts_before = Column(Integer, default=0)
    
    risk_score = Column(Float, default=0.0)
    risk_tier = Column(String) # Low, Medium, High, Critical
    top_reasons = Column(JSON) # List of strings
    is_acknowledged = Column(Boolean, default=False)
    audit_hash = Column(String)
    
    user = relationship("User", back_populates="events")
