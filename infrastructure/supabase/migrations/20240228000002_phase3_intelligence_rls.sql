-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES FOR AI INTELLIGENCE
-------------------------------------------------------------------------------

-- 1. AI Insights
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Parents can view insights of their linked children
CREATE POLICY "Parent can view child ai insights" ON ai_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM relationships
            WHERE parent_id = auth.uid() AND child_id = ai_insights.user_id
        )
    );
    
-- Admins could view all, but relying on service role for backend insertion.
-- Backend uses service_role key to bypass RLS for inserts. No insert policy needed for users.

-- 2. Daily Summaries
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- Parents can view daily summaries of their linked children
CREATE POLICY "Parent can view child daily summaries" ON daily_summaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM relationships
            WHERE parent_id = auth.uid() AND child_id = daily_summaries.user_id
        )
    );
