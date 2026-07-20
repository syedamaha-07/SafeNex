-- Seed users
INSERT INTO users (id, email, password_hash, role, full_name)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin@safenex.com', '$2b$12$LQv3c1yqBWVHxkd0LqCFaeXpA.8Y4.2Z7sA.z5G.vH1G6.z.z.z.z', 'admin', 'System Admin'),
    ('00000000-0000-0000-0000-000000000002', 'parent@safenex.com', '$2b$12$LQv3c1yqBWVHxkd0LqCFaeXpA.8Y4.2Z7sA.z5G.vH1G6.z.z.z.z', 'parent', 'John Parent'),
    ('00000000-0000-0000-0000-000000000003', 'child@safenex.com', '$2b$12$LQv3c1yqBWVHxkd0LqCFaeXpA.8Y4.2Z7sA.z5G.vH1G6.z.z.z.z', 'child', 'Jane Child');

-- Seed relationship
INSERT INTO relationships (parent_id, child_id)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

-- Seed initial location for child
INSERT INTO locations (user_id, latitude, longitude)
VALUES ('00000000-0000-0000-0000-000000000003', 40.7128, -74.0060);

-- Seed a geofence for child
INSERT INTO geofences (user_id, name, radius, center_lat, center_lng)
VALUES ('00000000-0000-0000-0000-000000000003', 'Home', 500, 40.7128, -74.0060);
