from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone
from app.models.models import Location, ActivityLog, AIInsight
from app.services.geofence_service import GeofenceService
import uuid

class BehaviorAnalysisService:
    """
    AI Intelligence Layer (Phase 3)
    Analyzes child location history to assign anomaly scores based on rule-based statistical bounds.
    """
    @staticmethod
    async def analyze_movement(db: AsyncSession, user_id: uuid.UUID):
        print("\\n" + "="*50)
        print(f"[PIPELINE STAGE 2] AI ANALYSIS STARTED FOR USER: {user_id}")
        print("="*50 + "\\n")
        
        now = datetime.now(timezone.utc)
        twenty_four_hours_ago = now - timedelta(hours=24)
        
        # 1. Fetch Location Data
        loc_result = await db.execute(
            select(Location)
            .where(Location.user_id == user_id)
            .where(Location.timestamp >= twenty_four_hours_ago)
            .order_by(Location.timestamp.asc())
        )
        locations = loc_result.scalars().all()
        
        if len(locations) < 2:
            print("    -> [AI Engine] Insufficient data (Need at least 2 points). Exiting.")
            return # Need at least two points to analyze movement anomalies
            
        total_score = 0
        anomalies_detected = []
        
        # 2. Sequential Analysis (Speed & Jumps)
        has_speed_anomaly = False
        has_jump_anomaly = False
        has_night_anomaly = False
        
        for i in range(1, len(locations)):
            loc_prev = locations[i-1]
            loc_curr = locations[i]
            
            # Time difference in hours
            time_diff_hours = (loc_curr.timestamp - loc_prev.timestamp).total_seconds() / 3600.0
            time_diff_secs = (loc_curr.timestamp - loc_prev.timestamp).total_seconds()
            
            if time_diff_secs <= 0:
                continue
                
            distance_meters = GeofenceService.haversine_distance(
                loc_prev.latitude, loc_prev.longitude,
                loc_curr.latitude, loc_curr.longitude
            )
            distance_km = distance_meters / 1000.0
            
            # Rule A: Speed Anomaly (> 120 km/h)
            speed_kmh = distance_km / time_diff_hours if time_diff_hours > 0 else 0
            if speed_kmh > 120 and not has_speed_anomaly:
                has_speed_anomaly = True
                total_score += 30
                anomalies_detected.append("Speed Anomaly (>120km/h)")
                
            # Rule D: Teleport/Jump Anomaly (> 5km in < 2 mins)
            if distance_km > 5 and time_diff_secs < 120 and not has_jump_anomaly:
                has_jump_anomaly = True
                total_score += 35
                anomalies_detected.append("Teleport Anomaly (>5km in <2m)")
                
            # Rule B: Night Movement Pattern
            hour = loc_curr.timestamp.hour
            # utc to local might be needed conceptually, but assuming UTC for demo
            if 0 <= hour <= 4 and not has_night_anomaly:
                has_night_anomaly = True
                total_score += 20
                anomalies_detected.append("Night Movement (12AM-4AM)")

            # Rule E: Immobility Detection (Potential Fall/Assault)
            # If time gap > 15 mins and distance < 2 meters
            if time_diff_secs > 900 and distance_meters < 2:
                total_score += 40
                anomalies_detected.append("Immobility Alert (No movement for 15m)")

            # Rule F: Vital Sign Anomaly (Heart Rate)
            if loc_curr.sensor_data and 'heart_rate' in loc_curr.sensor_data:
                hr = loc_curr.sensor_data['heart_rate']
                if (hr > 140 or hr < 40) and hr > 0: # Extreme tachycardia or bradycardia
                    total_score += 50
                    anomalies_detected.append(f"Vital Alert (Abnormal HR: {hr} BPM)")

        # 3. Activity Log Analysis (Breaches)
        breach_result = await db.execute(
            select(func.count(ActivityLog.id))
            .where(ActivityLog.user_id == user_id)
            .where(ActivityLog.action == "geofence_breach")
            .where(ActivityLog.created_at >= twenty_four_hours_ago)
        )
        breach_count = breach_result.scalar() or 0
        
        # Rule C: Frequent Geofence Breaches (3 or more)
        if breach_count >= 3:
            total_score += 25
            anomalies_detected.append("Frequent Geofence Breaches (3+ in 24h)")
            
        # 4. Insert Intelligence Output if anomalies found
        if total_score > 0:
            final_score = min(total_score, 100)
            
            insight = AIInsight(
                user_id=user_id,
                anomaly_type=", ".join(anomalies_detected),
                score=final_score
            )
            db.add(insight)
            await db.commit()
            
        return total_score
