from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str # donor, ngo, farm

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str

class User(UserBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class FoodUpload(BaseModel):
    food_type: str
    quantity: str
    prepared_time: str
    location: str
    image_url: Optional[str] = None

class FoodItem(FoodUpload):
    id: Optional[str] = Field(None, alias="_id")
    donor_id: str
    status: str = "Uploaded" # Uploaded, Accepted, In Transit, Delivered
    freshness: str # Fresh, Near Expiry
    expiry_time: Optional[datetime] = None
    otp: Optional[str] = None
    assigned_to: Optional[str] = None # NGO or Farm ID
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class DonationHistory(BaseModel):
    total_donated: int
    successful_deliveries: int
    wastage_prevented: float
