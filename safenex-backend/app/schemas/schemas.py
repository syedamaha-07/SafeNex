from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# USER SCHEMAS
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# AUTH SCHEMAS
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None

# LOCATION SCHEMAS
class LocationBase(BaseModel):
    latitude: float
    longitude: float

class LocationCreate(LocationBase):
    user_id: UUID
    source: Optional[str] = "phone"
    device_id: Optional[UUID] = None
    sensor_data: Optional[dict] = None

class Location(LocationBase):
    id: UUID
    user_id: UUID
    source: str
    device_id: Optional[UUID]
    sensor_data: Optional[dict]
    timestamp: datetime

    class Config:
        from_attributes = True

# SOS SCHEMAS
class SOSAlertBase(BaseModel):
    status: str

class SOSAlertCreate(SOSAlertBase):
    user_id: UUID

class SOSAlert(SOSAlertBase):
    id: UUID
    user_id: UUID
    triggered_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# DEVICE SCHEMAS
class DeviceBase(BaseModel):
    device_name: str
    device_type: str
    status: Optional[str] = "active"

class DeviceCreate(DeviceBase):
    user_id: UUID

class Device(DeviceBase):
    id: UUID
    user_id: UUID
    last_seen: datetime
    created_at: datetime

    class Config:
        from_attributes = True
