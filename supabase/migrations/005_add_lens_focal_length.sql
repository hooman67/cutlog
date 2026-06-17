-- Add lens focal length to machines table
-- This field stores the focusing lens focal length in mm (e.g., 110, 150, 300)
-- Used for parameter scaling when suggesting settings for different lens configurations

ALTER TABLE machines
ADD COLUMN lens_focal_length_mm integer DEFAULT 110;

-- Add a check constraint for reasonable lens values
ALTER TABLE machines
ADD CONSTRAINT check_lens_focal_length CHECK (lens_focal_length_mm > 0 AND lens_focal_length_mm <= 1000);

-- Create index for filtering
CREATE INDEX idx_machines_lens_focal_length ON machines(lens_focal_length_mm);
