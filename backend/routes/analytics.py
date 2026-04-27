from fastapi import APIRouter, Depends
from database import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/donor/{email}")
async def get_donor_analytics(email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": email})
    if not user:
        return {"total_donated": 0, "successful_deliveries": 0, "wastage_prevented": 0}
    
    total = await db.food_items.count_documents({"donor_id": str(user["_id"])})
    delivered = await db.food_items.count_documents({"donor_id": str(user["_id"]), "status": "Delivered"})
    
    # Simple mock metrics
    return {
        "total_donated": total,
        "successful_deliveries": delivered,
        "wastage_prevented": total * 1.5, # Mock kg
        "chart_data": [
            {"name": "Jan", "donations": 4},
            {"name": "Feb", "donations": total},
        ]
    }

@router.get("/ngo/{email}")
async def get_ngo_analytics(email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": email})
    if not user:
        return {"total_received": 0, "success_rate": 0}
    
    received = await db.food_items.count_documents({"assigned_to": str(user["_id"])})
    return {
        "total_received": received,
        "success_rate": 85 if received > 0 else 0,
        "chart_data": [
            {"name": "Mon", "received": 2},
            {"name": "Tue", "received": received},
        ]
    }

@router.get("/farm/{email}")
async def get_farm_analytics(email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": email})
    if not user:
        return {"waste_recycled": 0, "compost_produced": 0, "co2_offset": 0}
    
    recycled = await db.food_items.count_documents({"assigned_to": str(user["_id"])})
    return {
        "waste_recycled": recycled * 10, # Mock kg
        "compost_produced": recycled * 5,  # Mock kg
        "co2_offset": recycled * 2.5,     # Mock kg
        "chart_data": [
            {"name": "Wk 1", "recycled": 20},
            {"name": "Wk 2", "recycled": recycled * 10},
        ]
    }
