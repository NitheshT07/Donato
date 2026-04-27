from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from schemas import FoodItem
from typing import List
from bson import ObjectId
from utils.email import send_otp_email

from datetime import datetime, timedelta

router = APIRouter(prefix="/farm", tags=["farm"])

@router.get("/requests", response_model=List[FoodItem])
async def get_farm_requests(db=Depends(get_db)):
    # Near expiry items OR items flagged as Spoiled by AI
    # OR Fresh items that are within the 30m logistic buffer
    now = datetime.utcnow()
    buffer_limit = now + timedelta(minutes=30)
    
    cursor = db.food_items.find({
        "status": "Uploaded", 
        "$or": [
            {"freshness": {"$in": ["Near Expiry", "Spoiled"]}},
            {
                "freshness": "Fresh",
                "expiry_time": {"$lte": buffer_limit}
            }
        ]
    }, {"otp": 0})
    items = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@router.post("/accept/{item_id}")
async def accept_for_compost(item_id: str, farm_email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": farm_email})
    if not user or user["role"] != "farm":
        raise HTTPException(status_code=403, detail="Only Farms can accept these items")
    
    # Fetch the item first to get its details (OTP, food_type)
    item = await db.food_items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    result = await db.food_items.update_one(
        {"_id": ObjectId(item_id), "status": "Uploaded"},
        {"$set": {"status": "Accepted", "assigned_to": str(user["_id"])}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item already processed or modified")
    
    # Send verification OTP to Farm
    send_otp_email(farm_email, item.get("otp", "N/A"), item["food_type"], "Farm/Recycling")
    
    return {"message": "Accepted for recycling successfully. Check your email for the collection OTP."}
