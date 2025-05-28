
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from datetime import datetime
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String, default="free")
    created_at = Column(DateTime, default=datetime.utcnow)

class PricingTier(Base):
    __tablename__ = "pricing_tiers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    price = Column(Float)
    features = Column(Text)  # JSON array
    max_deployments = Column(Integer)
    max_concurrent_instances = Column(Integer)
    support_level = Column(String)

class Deployment(Base):
    __tablename__ = "deployments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    deployment_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    prompt = Column(Text)
    provider = Column(String)
    status = Column(String, default="pending")
    cost_estimate = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
