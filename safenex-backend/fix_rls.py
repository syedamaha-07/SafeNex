import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def fix_rls():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@host.docker.internal:54322/postgres')
    async with engine.begin() as conn:
        print("Disabling RLS on all relevant tables...")
        tables = ['locations', 'sos_alerts', 'activity_logs', 'ai_insights', 'daily_summaries', 'users', 'geofences']
        for table in tables:
            await conn.execute(text(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY;"))
            await conn.execute(text(f"GRANT ALL ON TABLE {table} TO anon;"))
            await conn.execute(text(f"GRANT ALL ON TABLE {table} TO authenticated;"))
    print("RLS disabled for all telemetry, user, and geofence tables")

if __name__ == "__main__":
    asyncio.run(fix_rls())
