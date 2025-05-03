from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


# Data that travels in websites needs to have a strict structure so that the server knows
# what to expect and so on.
# This file is to define those structures.


class UserCreate(BaseModel):
    id: str = str(uuid.uuid4())  # Generate a UUID for user ID
    email: EmailStr
    full_name: str
    role: str  # "admin" or "employee"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str

class TimeLogCreate(BaseModel):
    user_id: str  # UUID

class TimeLogOut(BaseModel):
    id: str  # UUID
    user_id: str
    clock_in: datetime
    clock_out: Optional[datetime] = None
    status: str 
