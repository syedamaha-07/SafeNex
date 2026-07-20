from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, SessionLocal
from app.api.deps import get_current_child_user
from app.models.models import User, Location, ActivityLog
from app.schemas.schemas import LocationCreate, Location as LocationSchema
from app.services.geofence_service import GeofenceService
from app.services.behavior_analysis_service import BehaviorAnalysisService

router = APIRouter()

async def run_ai_analysis(user_id):
    """Background task to run AI analysis in a new DB session context."""
    async with SessionLocal() as session:
        await BehaviorAnalysisService.analyze_movement(session, user_id)


@router.post("/update", response_model=LocationSchema)
async def update_location(
    location_in: LocationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest a new GPS location from a child device.
    """
    # Authentication temporarily bypassed for testing
    
    # 1. Store the new location
    new_location = Location(
        user_id=location_in.user_id,
        latitude=location_in.latitude,
        longitude=location_in.longitude,
        source=location_in.source,
        device_id=location_in.device_id,
        sensor_data=location_in.sensor_data
    )
    db.add(new_location)
    
    # 2. Check for Geofence breaches
    breach = await GeofenceService.check_geofences(
        db=db, 
        user_id=location_in.user_id, 
        current_lat=location_in.latitude, 
        current_lon=location_in.longitude
    )
    
    # Commit main location and any service logs generated inside check_geofences
    await db.commit()
    await db.refresh(new_location)

    # Trigger AI Anomaly Detection in background immediately after persistence
    background_tasks.add_task(run_ai_analysis, location_in.user_id)

    # Note: Returning breach flag in a header or custom schema wrapper if mobile needs immediate feedback
    return new_location
