from fastapi import FastAPI
from contextlib import asynccontextmanager
from .db.database import engine, Base
from .db import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic goes here
    print("Centrus ERP backend starting up...")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    yield  # The application runs while this is yielding
    
    # Shutdown logic goes here
    # Example: Close connections, clean up resources
    print("Centrus ERP backend shutting down...")

app = FastAPI(title="Centrus ERP API", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Welcome to Centrus ERP API", "status": "operational"}
