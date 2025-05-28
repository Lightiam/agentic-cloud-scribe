
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import jwt
import bcrypt
import uuid
import os
import json
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

# Initialize FastAPI
app = FastAPI(title="Storm Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Models
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

# Pydantic Models
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Create tables
Base.metadata.create_all(bind=engine)

# Authentication functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(email: str = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/auth/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for email: {user.email}")
    
    try:
        # Check if user exists
        existing_user = db.query(User).filter(
            (User.email == user.email) | (User.username == user.username)
        ).first()
        
        if existing_user:
            logger.warning(f"User already exists: {user.email}")
            raise HTTPException(status_code=400, detail="Email or username already registered")
        
        # Hash password
        password_bytes = user.password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        
        logger.info(f"Password hashed successfully for {user.email}")
        
        # Create user
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password.decode('utf-8')
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"User created successfully in database: {user.email}")
        
        access_token = create_access_token(data={"sub": user.email})
        logger.info(f"Access token created for: {user.email}")
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration for {user.email}: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for email: {user.email}")
    
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        
        if not db_user:
            logger.warning(f"User not found: {user.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check password
        password_bytes = user.password.encode('utf-8')
        stored_hash = db_user.hashed_password.encode('utf-8')
        
        if not bcrypt.checkpw(password_bytes, stored_hash):
            logger.warning(f"Invalid password for user: {user.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": db_user.email})
        logger.info(f"Login successful for user: {user.email}")
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login for {user.email}: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/user/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "subscription_tier": current_user.subscription_tier,
        "created_at": current_user.created_at,
        "is_active": current_user.is_active
    }

@app.get("/pricing/tiers")
async def get_pricing_tiers(db: Session = Depends(get_db)):
    tiers = db.query(PricingTier).all()
    if not tiers:
        # Initialize default pricing tiers
        default_tiers = [
            PricingTier(
                name="Basic",
                price=44.0,
                features='["Up to 5 deployments", "Email support", "Basic monitoring", "1 concurrent instance"]',
                max_deployments=5,
                max_concurrent_instances=1,
                support_level="email"
            ),
            PricingTier(
                name="Professional",
                price=74.0,
                features='["Up to 25 deployments", "Priority support", "Advanced monitoring", "5 concurrent instances", "Multi-cloud", "Auto-scaling"]',
                max_deployments=25,
                max_concurrent_instances=5,
                support_level="priority"
            ),
            PricingTier(
                name="Enterprise",
                price=94.0,
                features='["Unlimited deployments", "24/7 phone support", "Custom integrations", "Unlimited concurrent instances", "Dedicated account manager", "SLA guarantee"]',
                max_deployments=-1,
                max_concurrent_instances=-1,
                support_level="phone"
            )
        ]
        
        for tier in default_tiers:
            db.add(tier)
        db.commit()
        
        tiers = default_tiers
    
    return [
        {
            "name": tier.name,
            "price": tier.price,
            "features": json.loads(tier.features),
            "max_deployments": tier.max_deployments,
            "max_concurrent_instances": tier.max_concurrent_instances,
            "support_level": tier.support_level
        }
        for tier in tiers
    ]

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Storm Platform API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
