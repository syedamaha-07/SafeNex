from sqlalchemy import Column, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # parent, child, admin
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Relationship(Base):
    __tablename__ = "relationships"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    child_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Device(Base):
    __tablename__ = "devices"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_name = Column(String, nullable=False)
    device_type = Column(String, nullable=False) # ble, wifi
    status = Column(String, default='active')
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Location(Base):
    __tablename__ = "locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    source = Column(String, default='phone') # phone, hardware
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id", ondelete="SET NULL"), nullable=True)
    sensor_data = Column(JSON, nullable=True) # heart_rate, battery, etc.
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Geofence(Base):
    __tablename__ = "geofences"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    radius = Column(Float, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SOSAlert(Base):
    __tablename__ = "sos_alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, nullable=False) # active, resolved, cancelled
    resolved_at = Column(DateTime(timezone=True))

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    anomaly_type = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DailySummary(Base):
    __tablename__ = "daily_summaries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    summary_text = Column(String, nullable=False)
    risk_level = Column(String, nullable=False) # Low, Medium, High
    total_distance_km = Column(Float, default=0.0)
    geofence_exits = Column(Float, default=0) # Float just for safety, but usually int
    date = Column(DateTime(timezone=True), server_default=func.now())
