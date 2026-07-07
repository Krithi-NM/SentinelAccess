import random
import datetime
import uuid
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from models import Base, User, AccessEvent
from ml_utils import train_and_score, compute_audit_hash

DB_URL = "sqlite:///./sentinelaccess.db"
engine = create_engine(DB_URL)

INDIAN_NAMES = [
    "Arjun Sharma", "Priya Patel", "Rahul Gupta", "Ananya Iyer", "Vikram Singh",
    "Sanya Malhotra", "Rohan Verma", "Kavita Rao", "Aditya Joshi", "Ishita Reddy",
    "Manish Pandey", "Sneha Kulkarni", "Abhishek Nair", "Deepika Deshmukh", "Suresh Kumar",
    "Meena Kumari", "Ajay Dev", "Pooja Bose", "Rajesh Khanna", "Sunita Williams",
    "Vijay Mallya", "Laxmi Mittal", "Harsha Vardhan", "Divya Bharti", "Kiran Mazumdar",
    "Azim Premji", "Mukesh Ambani", "Ratan Tata", "Gautam Adani", "Anand Mahindra",
    "Indra Nooyi", "Sundar Pichai", "Satya Nadella", "Shantanu Narayen", "Vinod Khosla",
    "Padmasree Warrior", "Rashmi Sinha", "Anu Jain", "Naveen Tewari", "Vijay Shekhar"
]

DEPARTMENTS = ["IT Operations", "Core Banking", "Vendor Management", "Human Resources", "Digital Banking", "Risk Management"]
RESOURCES = ["Core Banking DB", "Customer KYC Store", "Admin Console", "Payment Gateway Config", "HR Portal", "Internal Wiki", "Audit Logs"]
LOCATIONS = ["Mumbai", "Pune", "Bangalore", "Hyderabad", "Delhi", "Chennai"]

def generate_data():
    users = []
    roles = ["admin", "vendor", "contractor", "employee"]
    
    for i in range(40):
        u_id = f"U{1001 + i}"
        users.append({
            "user_id": u_id,
            "name": INDIAN_NAMES[i],
            "role": random.choice(roles),
            "department": random.choice(DEPARTMENTS),
            "join_date": datetime.datetime.now() - datetime.timedelta(days=random.randint(365, 1000))
        })
    
    events = []
    start_date = datetime.datetime.now() - datetime.timedelta(days=30)
    
    for user in users:
        # Establish a "normal" baseline for this user
        typical_hour = random.randint(9, 17) # daytime shift
        typical_location = random.choice(LOCATIONS)
        typical_resources = random.sample(RESOURCES, k=2)
        avg_volume = random.uniform(10, 100)
        
        # Generate ~20 events per user
        for j in range(22):
            is_anomaly = random.random() < 0.10 # 10% chance
            
            ts = start_date + datetime.timedelta(days=random.randint(0, 29), hours=random.randint(0, 23))
            
            if is_anomaly:
                anomaly_type = random.choice(["off_hours", "high_volume", "wrong_resource", "failed_logins", "new_location"])
                
                if anomaly_type == "off_hours":
                    hour = random.choice([1, 2, 3, 4, 23])
                    data_vol = random.uniform(5, 50)
                    res = typical_resources[0]
                    loc = typical_location
                    failed = 0
                elif anomaly_type == "high_volume":
                    hour = typical_hour + random.randint(-1, 1)
                    data_vol = avg_volume * random.uniform(20, 50)
                    res = typical_resources[0]
                    loc = typical_location
                    failed = 0
                elif anomaly_type == "wrong_resource":
                    hour = typical_hour
                    data_vol = random.uniform(5, 50)
                    res = "Core Banking DB" if user["role"] == "contractor" else random.choice([r for r in RESOURCES if r not in typical_resources])
                    loc = typical_location
                    failed = 0
                elif anomaly_type == "failed_logins":
                    hour = typical_hour
                    data_vol = random.uniform(1, 10)
                    res = typical_resources[0]
                    loc = typical_location
                    failed = random.randint(3, 5)
                else: # new_location
                    hour = typical_hour
                    data_vol = random.uniform(5, 50)
                    res = typical_resources[0]
                    loc = random.choice([l for l in LOCATIONS if l != typical_location])
                    failed = 0
            else:
                hour = typical_hour + random.randint(-1, 1)
                data_vol = avg_volume * random.uniform(0.5, 1.5)
                res = random.choice(typical_resources)
                loc = typical_location
                failed = 0
            
            ts = ts.replace(hour=hour % 24)
            
            events.append({
                "event_id": str(uuid.uuid4())[:8],
                "user_id": user["user_id"],
                "timestamp": ts,
                "action_type": random.choice(["login", "file_access", "data_export"]) if data_vol < 100 else "data_export",
                "resource_accessed": res,
                "access_hour": hour % 24,
                "location": loc,
                "data_volume_mb": round(data_vol, 2),
                "failed_attempts_before": failed,
                "ip_flag": loc != typical_location
            })
            
    return users, events

def seed_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    users_data, events_data = generate_data()
    
    # Process with ML
    users_df = pd.DataFrame(users_data)
    events_df = pd.DataFrame(events_data)
    
    scored_df = train_and_score(events_df, users_df)
    
    with Session(engine) as session:
        # Add users
        for u in users_data:
            session.add(User(**u))
        
        # Add events
        for _, row in scored_df.iterrows():
            event_dict = row.to_dict()
            # Remove helper columns from scoring
            clean_event = {k: event_dict[k] for k in [
                'event_id', 'user_id', 'timestamp', 'action_type', 'resource_accessed',
                'access_hour', 'location', 'ip_flag', 'data_volume_mb', 'failed_attempts_before',
                'risk_score', 'risk_tier', 'top_reasons'
            ]}
            # Add audit hash
            clean_event['audit_hash'] = compute_audit_hash(clean_event)
            session.add(AccessEvent(**clean_event))
            
        session.commit()
    print(f"Seeded {len(users_data)} users and {len(events_data)} events.")

if __name__ == "__main__":
    seed_db()
