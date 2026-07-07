import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import MinMaxScaler
import hashlib
import json

def compute_audit_hash(event_data):
    # Convert event data to a stable string for hashing
    ordered_data = {k: str(v) for k, v in sorted(event_data.items())}
    data_str = json.dumps(ordered_data)
    return hashlib.sha3_256(data_str.encode()).hexdigest()

def engineer_features(events_df, users_df):
    """
    Feature engineering per event. 
    Assumes events_df has: user_id, access_hour, data_volume_mb, resource_accessed, location, failed_attempts_before
    """
    # 1. User Baselining
    user_baselines = events_df.groupby('user_id').agg({
        'access_hour': lambda x: x.mode().iloc[0] if not x.empty else 9,
        'data_volume_mb': 'mean',
        'location': lambda x: x.mode().iloc[0] if not x.empty else 'Mumbai'
    }).rename(columns={
        'access_hour': 'typical_hour',
        'data_volume_mb': 'avg_volume',
        'location': 'typical_location'
    })
    
    df = events_df.merge(user_baselines, on='user_id')
    
    # Calculate deviations
    df['hour_diff'] = abs(df['access_hour'] - df['typical_hour'])
    # Normalize hour diff to handle circular nature (23 to 0 is 1 hour diff)
    df['hour_diff'] = df['hour_diff'].map(lambda x: min(x, 24-x))
    
    df['volume_ratio'] = df['data_volume_mb'] / (df['avg_volume'] + 0.1) # avoid div by zero
    df['is_new_location'] = (df['location'] != df['typical_location']).astype(int)
    
    # Feature set for Isolation Forest
    features = ['hour_diff', 'volume_ratio', 'is_new_location', 'failed_attempts_before']
    return df, features

def train_and_score(events_df, users_df):
    if len(events_df) < 10: # Not enough data to train properly in early stages
        return events_df
        
    df, feature_cols = engineer_features(events_df, users_df)
    
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(df[feature_cols])
    
    # scores: higher is more anomalous (IsolationForest returns -1 for anomaly, 1 for normal)
    # df['anomaly_score'] = -model.decision_function(df[feature_cols])
    
    # We want a 0-100 score. 
    # model.decision_function range is roughly [-0.5, 0.5] where lower is anomaly.
    raw_scores = -model.decision_function(df[feature_cols])
    
    scaler = MinMaxScaler(feature_range=(0, 100))
    df['risk_score'] = scaler.fit_transform(raw_scores.reshape(-1, 1))
    
    # Risk tiers
    def get_tier(score):
        if score < 40: return "Low"
        if score < 65: return "Medium"
        if score < 85: return "High"
        return "Critical"
    
    df['risk_tier'] = df['risk_score'].apply(get_tier)
    
    # Explainability
    df['top_reasons'] = df.apply(lambda row: generate_reasons(row, feature_cols), axis=1)
    
    return df

def generate_reasons(row, feature_cols):
    reasons = []
    if row['risk_score'] < 40:
        return ["Activity fits typical user pattern."]
        
    if row['hour_diff'] > 4:
        reasons.append(f"Access at {row['access_hour']:02d}:00, outside normal window (typical: {row['typical_hour']:02d}:00)")
    
    if row['volume_ratio'] > 5:
        reasons.append(f"Data volume {row['volume_ratio']:.1f}x above user's average")
        
    if row['is_new_location'] == 1:
        reasons.append(f"Access from unusual location: {row['location']}")
        
    if row['failed_attempts_before'] > 0:
        reasons.append(f"{row['failed_attempts_before']} failed login attempts detected before success")
        
    if not reasons:
        reasons.append("Unusual combination of access patterns detected")
        
    return reasons[:3]
