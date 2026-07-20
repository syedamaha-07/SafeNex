-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_relationships_parent_id ON relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_relationships_child_id ON relationships(child_id);

-- Enable Supabase Realtime for live tracking & SOS
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;

-- Set Replica Identity for full row data in realtime payloads
ALTER TABLE locations REPLICA IDENTITY FULL;
ALTER TABLE sos_alerts REPLICA IDENTITY FULL;

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------

-- 1. Locations
-- Children can insert their own locations
CREATE POLICY "Child can insert own locations" ON locations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view locations of their linked children
CREATE POLICY "Parent can view child locations" ON locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM relationships
            WHERE parent_id = auth.uid() AND child_id = locations.user_id
        )
    );

-- 2. SOS Alerts
-- Children can insert their own SOS alerts
CREATE POLICY "Child can trigger own SOS" ON sos_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view SOS alerts of their linked children
CREATE POLICY "Parent can view child SOS" ON sos_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM relationships
            WHERE parent_id = auth.uid() AND child_id = sos_alerts.user_id
        )
    );

-- 3. Activity Logs
-- Parents can view activity logs of their linked children
CREATE POLICY "Parent can view child activity" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM relationships
            WHERE parent_id = auth.uid() AND child_id = activity_logs.user_id
        )
    );
