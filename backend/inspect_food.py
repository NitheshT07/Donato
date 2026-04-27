import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from database import get_db
from bson import ObjectId

async def inspect_food():
    db = await get_db()
    print("--- Food Item Database Inspection ---")
    
    cursor = db.food_items.find({}).sort("created_at", -1).limit(5)
    items = await cursor.to_list(length=5)
    
    if not items:
        print("No items found.")
        return

    for item in items:
        print(f"\nID: {item['_id']}")
        print(f"Food Type: '{item['food_type']}'")
        print(f"Status: {item['status']}")
        print(f"Prepared Time (Stored): {item.get('prepared_time')}")
        print(f"Expiry Time (Stored): {item.get('expiry_time')}")
        print(f"Created At: {item.get('created_at')}")
        print(f"OTP: {item.get('otp')}")
        
        # Calculate diff
        from datetime import datetime
        if item.get('expiry_time'):
            now = datetime.utcnow()
            diff = item['expiry_time'] - now
            hours = diff.total_seconds() / 3600
            print(f"Remaining Hours (Calculated from UTC now): {hours:.2f}")

    print("\n--- End of Inspection ---")

if __name__ == "__main__":
    asyncio.run(inspect_food())
