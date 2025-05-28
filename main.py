
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from database import Base, engine
from routes import router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Storm Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Storm Platform API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
