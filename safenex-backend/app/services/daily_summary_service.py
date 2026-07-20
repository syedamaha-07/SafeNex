from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone
from app.models.models import Location, ActivityLog, DailySummary, AIInsight
from app.services.geofence_service import GeofenceService
import uuid

class DailySummaryService:
    @staticmethod
    async def generate_summary(db: AsyncSession, user_id: uuid.UUID):
        now = datetime.now(timezone.utc)
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # 1. Calculate Total Distance
        loc_result = await db.execute(
            select(Location)
            .where(Location.user_id == user_id)
            .where(Location.timestamp >= start_of_day)
            .order_by(Location.timestamp.asc())
        )
        locations = loc_result.scalars().all()
        
        total_distance = 0.0
        active_hours = 0.0
        if len(locations) >= 2:
            first_time = locations[0].timestamp
            last_time = locations[-1].timestamp
            active_hours = (last_time - first_time).total_seconds() / 3600.0
            
            for i in range(1, len(locations)):
                dist = GeofenceService.haversine_distance(
                    locations[i-1].latitude, locations[i-1].longitude,
                    locations[i].latitude, locations[i].longitude
                )
                total_distance += dist / 1000.0 # to km
                
        # 2. Count Geofence Exits
        breach_result = await db.execute(
            select(func.count(ActivityLog.id))
            .where(ActivityLog.user_id == user_id)
            .where(ActivityLog.action == "geofence_breach")
            .where(ActivityLog.created_at >= start_of_day)
        )
        breaches = breach_result.scalar() or 0
        
        # 3. Assess Risk Level based on maximum insight score today
        insight_result = await db.execute(
            select(func.max(AIInsight.score))
            .where(AIInsight.user_id == user_id)
            .where(AIInsight.created_at >= start_of_day)
        )
        max_score = insight_result.scalar() or 0
        
        if max_score > 60:
            risk_level = "High"
        elif max_score > 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
        # 4. Generate Summary Paragraph
        summary_text = (
            f"Today the child traveled {total_distance:.1f}km over {active_hours:.1f} active hours, "
            f"exited geofences {breaches} time(s), and showed {risk_level.lower()} risk behavior."
        )
        
        # 5. Insert Record
        summary_entry = DailySummary(
            user_id=user_id,
            summary_text=summary_text,
            risk_level=risk_level,
            total_distance_km=round(total_distance, 2),
            geofence_exits=float(breaches)
        )
        db.add(summary_entry)
        await db.commit()
        return summary_entry
