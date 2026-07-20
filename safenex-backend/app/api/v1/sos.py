from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_child_user
from app.models.models import User, SOSAlert, ActivityLog
from app.schemas.schemas import SOSAlertCreate, SOSAlert as SOSAlertSchema

router = APIRouter()

@router.post("/trigger", response_model=SOSAlertSchema)
async def trigger_sos(
    sos_in: SOSAlertCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger an immediate SOS Alert from a child device.
    """
    # Authentication temporarily bypassed for testing
        
    # Create SOS Entry
    new_alert = SOSAlert(
        user_id=sos_in.user_id,
        status="active"
    )
    db.add(new_alert)
    
    # Log Activity
    log_entry = ActivityLog(
        user_id=sos_in.user_id,
        action="sos_triggered",
        details={
            "status": "active",
            "escalation": "MOCK_SMS_SENT_TO_1122",
            "guardian_alert": "SENT"
        }
    )
    db.add(log_entry)
    
    # Mock SMS Gateway Simulation
    print(f"\n[EMERGENCY] SOS TRIGGERED FOR USER {sos_in.user_id}")
    print(f"[GATEWAY] Sending encrypted GPS packet to Rescue 1122... DONE")
    print(f"[GATEWAY] Sending SMS alert to verified Guardian contacts... DONE\n")
    
    await db.commit()
    await db.refresh(new_alert)
    
    return new_alert
