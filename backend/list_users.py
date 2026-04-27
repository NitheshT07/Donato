import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

async def list_users():
    MONGODB_URL = os.getenv("MONGODB_URL")
    client = AsyncIOMotorClient(
        MONGODB_URL,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True
    )
    db = client.donato
    
    print("Listing users:")
    async for user in db.users.find():
        print(f"Email: {user['email']}, Role: {user['role']}, Full Name: {user.get('full_name', 'N/A')}")

if __name__ == "__main__":
    asyncio.run(list_users())
