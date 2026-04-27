from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from database import get_db
from schemas import FoodItem
from typing import List, Optional
import os
import random
from datetime import datetime, timedelta
from ml_model import analyzer

router = APIRouter(prefix="/food", tags=["food"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload", response_model=FoodItem)
async def upload_food(
    food_type: str = Form(...),
    quantity: str = Form(...),
    prepared_time: str = Form(...),
    location: str = Form(...),
    donor_email: str = Form(...),
    image_file: UploadFile = File(...),
    db=Depends(get_db)
):
    print(f"DEBUG: UPLOAD ATTEMPT - Email: '{donor_email}'")
    user = await db.users.find_one({"email": donor_email})
    
    if not user:
        print(f"ERROR: UPLOAD FAILED - User not found in DB for email: '{donor_email}'")
        raise HTTPException(status_code=403, detail=f"User {donor_email} not found in database")
        
    user_role = user.get("role", "").lower()
    print(f"DEBUG: USER FOUND - Email: {user['email']}, Role: {user['role']}, ID: {user['_id']}")
    
    if user_role != "donor":
        print(f"ERROR: UPLOAD FAILED - Unauthorized role: '{user_role}' for '{donor_email}'")
        raise HTTPException(status_code=403, detail=f"Only donors can upload food. Current role: {user_role}")

    # Save the file
    file_extension = image_file.filename.split(".")[-1]
    # Clean filename: replace @ with _ and add timestamp
    safe_email = donor_email.replace('@', '_').replace('.', '_')
    filename = f"{datetime.now().timestamp()}_{safe_email}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    content = await image_file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # ML Analysis using ResNet50 + Heuristics
    analysis = analyzer.predict(content)
    
    # Calculate expiry_time (Logistic Buffer Logic)
    SHELF_LIFE_MAPPING = {
        'dosa': 6, 'idli': 8, 'rice': 4, 'meals': 5, 'vegetables': 48, 'fruit': 72, 'bread': 24, 'milk': 12, 'default': 6
    }
    
    def get_hours(t: str):
        type_l = t.lower().strip()
        # Exact match check first
        if type_l in SHELF_LIFE_MAPPING:
            return SHELF_LIFE_MAPPING[type_l]
        # Partial match check
        for k, h in SHELF_LIFE_MAPPING.items():
            if k in type_l: 
                print(f"DEBUG: Partial match found: '{k}' in '{type_l}' -> {h} hours")
                return h
        print(f"DEBUG: No match found for '{type_l}', using default 6 hours")
        return SHELF_LIFE_MAPPING['default']

    try:
        prepared_dt = datetime.fromisoformat(prepared_time.replace('Z', '+00:00'))
    except Exception:
        prepared_dt = datetime.utcnow()

    shelf_life = get_hours(food_type)
    expiry_dt = prepared_dt + timedelta(hours=shelf_life)
    
    print(f"DEBUG: UPLOAD - Type: {food_type}, Prepared: {prepared_dt}, ShelfLife: {shelf_life}, Expiry: {expiry_dt}")
    
    otp_code = str(random.randint(100000, 999999))
    
    food_dict = {
        "food_type": food_type,
        "quantity": quantity,
        "prepared_time": prepared_time,
        "location": location,
        "donor_id": str(user["_id"]),
        "status": "Uploaded",
        "freshness": analysis["status"],
        "expiry_time": expiry_dt,
        "otp": otp_code,
        "image_url": f"/uploads/{filename}",
        "created_at": datetime.utcnow()
    }
    
    result = await db.food_items.insert_one(food_dict)
    food_dict["_id"] = str(result.inserted_id)
    return food_dict

@router.get("/history/{user_email}", response_model=List[FoodItem])
async def get_history(user_email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = {}
    if user["role"] == "donor":
        query = {"donor_id": str(user["_id"])}
    elif user["role"] == "ngo" or user["role"] == "farm":
        query = {"assigned_to": str(user["_id"])}
        
    cursor = db.food_items.find(query).sort("created_at", -1)
    items = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@router.delete("/{item_id}")
async def delete_food(item_id: str, donor_email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": donor_email})
    if not user or user["role"] != "donor":
        raise HTTPException(status_code=403, detail="Only donors can delete their donations")
    
    # Check if the item exists and belongs to the donor, and is NOT yet accepted
    item = await db.food_items.find_one({
        "_id": ObjectId(item_id),
        "donor_id": str(user["_id"])
    })
    
    if not item:
        raise HTTPException(status_code=404, detail="Donation not found or unauthorized")
    
    if item["status"] != "Uploaded":
        raise HTTPException(status_code=400, detail="Cannot delete a donation that has already been accepted or processed")
    
    await db.food_items.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Donation deleted successfully"}
