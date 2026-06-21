ALTER TABLE machines ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
-- Only one machine should be active at a time per user
-- We'll enforce this in app logic, not DB constraint
