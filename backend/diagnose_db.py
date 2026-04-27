import os
import certifi
import asyncio
import socket
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def diagnose():
    uri = os.getenv("MONGODB_URL")
    print("="*60)
    print("MDB ATLAS CONNECTION DIAGNOSTIC")
    print("="*60)
    
    # Get Public IP
    import requests
    try:
        public_ip = requests.get('https://api.ipify.org').text
        print(f"Your Public IP: {public_ip}")
    except:
        print("Could not determine public IP.")
        
    print("\nAttempting connection to MongoDB Atlas...")
    client = AsyncIOMotorClient(
        uri,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000
    )
    
    try:
        # The 'ping' command is the standard way to test a connection
        await client.admin.command('ping')
        print("SUCCESS: Connected to MongoDB Atlas!")
    except Exception as e:
        error_str = str(e)
        print("FAILURE: Could not connect to MongoDB.")
        print("-" * 30)
        if "SSL: TLSV1_ALERT_INTERNAL_ERROR" in error_str:
            print("CRITICAL: IP WHITELISTING ERROR DETECTED")
            print(f"MongoDB Atlas is REJECTING your connection from {public_ip}.")
            print("ACTION REQUIRED: Log in to Atlas -> Network Access -> Add IP Address")
        else:
            print(f"Error Details: {error_str}")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(diagnose())
