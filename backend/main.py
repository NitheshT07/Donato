from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, food, ngo, farm, analytics
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Donato AI Food Redistribution API")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import requests # Pre-import for speed

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "http://localhost:3000")
    logger.error(f"Global error caught. Origin: {origin}, Error: {exc}")
    error_msg = str(exc)
    
    # Mirroring for CORS - ensure match with middleware for bit-perfect consistency
    cors_headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }
    
    # Map technical MongoDB errors to the one-time permanent fix
    is_db_error = any(kw in error_msg for kw in ["SSL", "TLSV1", "ServerSelectionTimeout", "timeout", "rejected"])
    
    if is_db_error:
        return JSONResponse(
            status_code=500,
            headers=cors_headers,
            content={
                "detail": "DATABASE CONNECTION REJECTED",
                "hint": "MongoDB is blocking your current IP. Your IP seems to be dynamic (changing). Please whitelist 0.0.0.0/0 in your MongoDB Atlas dashboard (Network Access) to fix this permanently."
            }
        )
    
    return JSONResponse(
        status_code=500,
        headers=cors_headers,
        content={"detail": "Internal Server Error", "error": error_msg}
    )

# Support for static files (uploaded food images)
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(food.router)
app.include_router(ngo.router)
app.include_router(farm.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Donato AI Food Redistribution API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
