import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

# Improved connection handling for Windows environments
client = AsyncIOMotorClient(
    MONGODB_URL,
    tlsCAFile=certifi.where(),
    # Fallback to allow connection if handshake is slightly non-standard
    tlsAllowInvalidCertificates=True, 
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    retryWrites=True
)
db = client.donato

async def get_db():
    return db
