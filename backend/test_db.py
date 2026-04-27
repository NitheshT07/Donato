import os
import certifi
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    uri = os.getenv("MONGODB_URL")
    print(f"Connecting to: {uri[:20]}...")
    try:
        client = AsyncIOMotorClient(
            uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        # Try to ping the database
        await client.admin.command('ping')
        print("Ping successful!")
    except Exception as e:
        print(f"Ping failed: {e}")
        
    print("\nTrying with tlsAllowInvalidCertificates=True...")
    try:
        client = AsyncIOMotorClient(
            uri,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        await client.admin.command('ping')
        print("Ping (insecure) successful!")
    except Exception as e:
        print(f"Ping (insecure) failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
