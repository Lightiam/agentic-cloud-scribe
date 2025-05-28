
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import bcrypt
import json
import logging
import traceback

from database import get_db
from models import User, PricingTier
from schemas import UserCreate, UserLogin, Token
from auth import create_access_token, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/auth/register", response_model=Token)
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

@router.post("/auth/login", response_model=Token)
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

@router.get("/user/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "subscription_tier": current_user.subscription_tier,
        "created_at": current_user.created_at,
        "is_active": current_user.is_active
    }

@router.get("/pricing/tiers")
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

@router.get("/health")
async def health_check():
    from datetime import datetime
    return {"status": "healthy", "timestamp": datetime.utcnow()}
