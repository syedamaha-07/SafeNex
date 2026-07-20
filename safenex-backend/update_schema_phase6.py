import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def update_schema():
    # Using the same connection string as fix_rls.py
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@host.docker.internal:54322/postgres')
    async with engine.begin() as conn:
        print("Starting Schema Update for Phase 6...")
        
        # 1. Create devices table
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS devices (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id),
                device_name TEXT NOT NULL,
                device_type TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))
        print("Table 'devices' created/verified.")

        # 2. Add hardware columns to locations
        # We use a sub-block to handle errors if columns already exist
        try:
            await conn.execute(text("ALTER TABLE locations ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'phone';"))
            await conn.execute(text("ALTER TABLE locations ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES devices(id);"))
            await conn.execute(text("ALTER TABLE locations ADD COLUMN IF NOT EXISTS sensor_data JSONB;"))
            print("Hardware columns added to 'locations' table.")
        except Exception as e:
            print(f"Note on locations update: {e}")

        # 3. Disable RLS for devices table immediately (for admin viewing)
        await conn.execute(text("ALTER TABLE devices DISABLE ROW LEVEL SECURITY;"))
        await conn.execute(text("GRANT ALL ON TABLE devices TO anon;"))
        await conn.execute(text("GRANT ALL ON TABLE devices TO authenticated;"))
        print("RLS disabled for 'devices' table.")

    print("Schema Update Phase 6 Completed successfully.")

if __name__ == "__main__":
    asyncio.run(update_schema())
