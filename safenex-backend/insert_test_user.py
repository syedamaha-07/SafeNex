import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

async def insert_user():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@host.docker.internal:54322/postgres')
    async with sessionmaker(engine, class_=AsyncSession)() as session:
        # Insert the test user that the Flutter app is hardcoded to emit
        await session.execute(text("""
            INSERT INTO users (id, email, password_hash, role, full_name) 
            VALUES ('b9c3f4a1-8d2e-4c7b-9e1f-a5d6c8b2e3f4', 'test@example.com', 'xyz', 'child', 'Test Child') 
            ON CONFLICT (id) DO NOTHING
        """))
        
        # Insert a geofence so that the AI Pipeline prints can trigger upon distance checks
        # Geofence in New York (for legacy testing)
        await session.execute(text("""
            INSERT INTO geofences (id, user_id, name, center_lat, center_lng, radius) 
            VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'b9c3f4a1-8d2e-4c7b-9e1f-a5d6c8b2e3f4', 'Home Base NY', 40.7128, -74.0060, 50.0)
            ON CONFLICT (id) DO NOTHING
        """))
        
        # Geofence in Islamabad, Pakistan (for User local context)
        await session.execute(text("""
            INSERT INTO geofences (id, user_id, name, center_lat, center_lng, radius) 
            VALUES ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'b9c3f4a1-8d2e-4c7b-9e1f-a5d6c8b2e3f4', 'Home Base PK', 33.6844, 73.0479, 5000.0)
            ON CONFLICT (id) DO NOTHING
        """))
        await session.commit()
    print("Test User injected successfully!")

if __name__ == "__main__":
    asyncio.run(insert_user())
