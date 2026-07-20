import math
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Geofence, ActivityLog
import uuid
from datetime import datetime

class GeofenceService:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the great circle distance in meters between two points 
        on the earth (specified in decimal degrees)
        """
        R = 6371000 # Radius of the earth in meters
        
        # Convert decimal degrees to radians
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        # Haversine formula
        a = math.sin(delta_phi / 2.0) ** 2 + \
            math.cos(phi1) * math.cos(phi2) * \
            math.sin(delta_lambda / 2.0) ** 2
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance

    @staticmethod
    async def check_geofences(db: AsyncSession, user_id: uuid.UUID, current_lat: float, current_lon: float) -> bool:
        """
        Check if the user's current location breaches any active geofences.
        Returns True if a breach occurred, False otherwise.
        """
        print("\\n" + "="*50)
        print(f"[PIPELINE STAGE 1] GEOFENCE CHECK CALLED FOR USER: {user_id}")
        print("="*50 + "\\n")
        
        result = await db.execute(select(Geofence).where(Geofence.user_id == user_id))
        geofences = result.scalars().all()
        
        breach_detected = False
        
        for fence in geofences:
            distance = GeofenceService.haversine_distance(
                current_lat, current_lon, fence.center_lat, fence.center_lng
            )
            
            if distance > fence.radius:
                breach_detected = True
                print(f"    -> [ALERT] GEOFENCE BREACH DETECTED: {distance}m > {fence.radius}m")
                # Log the breach
                log_entry = ActivityLog(
                    user_id=user_id,
                    action="geofence_breach",
                    details={"fence_name": fence.name, "distance_meters": round(distance, 2)}
                )
                db.add(log_entry)
                
        if breach_detected:
            await db.commit()
            
        return breach_detected
