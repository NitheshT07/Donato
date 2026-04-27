from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from schemas import FoodItem
from typing import List
from bson import ObjectId
from utils.email import send_otp_email

from datetime import datetime, timedelta

router = APIRouter(prefix="/ngo", tags=["ngo"])

@router.get("/requests", response_model=List[FoodItem])
async def get_ngo_requests(db=Depends(get_db)):
    # Fresh food not yet accepted AND with at least 30m logistic buffer
    now = datetime.utcnow()
    buffer_limit = now + timedelta(minutes=30)
    
    # Query: Fresh, Uploaded, and Expiring after the buffer limit
    # We also include items where expiry_time is missing for safety (legacy)
    cursor = db.food_items.find({
        "status": "Uploaded", 
        "freshness": "Fresh",
        "$or": [
            {"expiry_time": {"$gt": buffer_limit}},
            {"expiry_time": None}
        ]
    }, {"otp": 0})
    items = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@router.post("/accept/{item_id}")
async def accept_donation(item_id: str, ngo_email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": ngo_email})
    if not user or user["role"] != "ngo":
        raise HTTPException(status_code=403, detail="Only NGOs can accept these donations")
    
    # Fetch the item first to get its details (OTP, food_type)
    item = await db.food_items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    result = await db.food_items.update_one(
        {"_id": ObjectId(item_id), "status": "Uploaded"},
        {"$set": {"status": "Accepted", "assigned_to": str(user["_id"])}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item already accepted or modified")
    
    # Send verification OTP to NGO
    send_otp_email(ngo_email, item.get("otp", "N/A"), item["food_type"], "NGO")
    
    return {"message": "Donation accepted successfully. Check your registered email for the collection OTP."}
