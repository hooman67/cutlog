-- Add speed_profile column to machines table
ALTER TABLE machines
ADD COLUMN speed_profile text DEFAULT 'auto' CHECK (speed_profile IN ('fast', 'conservative', 'auto'));

-- Create index for profile queries
CREATE INDEX idx_machines_speed_profile ON machines(speed_profile);
