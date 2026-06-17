-- Add engraving-specific columns to cuts table
-- Supports Galvo laser operators with engraving parameters

ALTER TABLE cuts ADD COLUMN frequency_hz integer;
-- ^^ Frequency in Hz (e.g., 60000, 80000, 100000 Hz) for engraving operations

ALTER TABLE cuts ADD COLUMN num_passes integer;
-- ^^ Number of passes for engraving (nullable, can be 1 for single pass)

ALTER TABLE cuts ADD COLUMN operation_type text CHECK (operation_type IN ('engrave', 'mark', 'cut', 'score', 'fill', 'outline'));
-- ^^ Type of laser operation performed

ALTER TABLE cuts ADD COLUMN cross_hatch boolean;
-- ^^ Whether cross-hatch fill was used (typically for engraving)

ALTER TABLE cuts ADD COLUMN scan_angle_degrees numeric;
-- ^^ Rotation angle for scan pattern (-90 to 90 degrees)

-- Add laser_source_type to machines table to distinguish engraving vs cutting machines
ALTER TABLE machines ADD COLUMN laser_source_type text;
-- ^^ Examples: 'fiber_cutting', 'fiber_engraving', 'co2_cutting', 'diode_engraving', 'uv_marking'

-- Comment columns for documentation
COMMENT ON COLUMN cuts.frequency_hz IS 'Engraving frequency in Hz (e.g., 60000, 80000, 100000)';
COMMENT ON COLUMN cuts.num_passes IS 'Number of passes for engraving or multi-pass operations';
COMMENT ON COLUMN cuts.operation_type IS 'Type of operation: engrave, mark, cut, score, fill, or outline';
COMMENT ON COLUMN cuts.cross_hatch IS 'Whether cross-hatch fill pattern was used';
COMMENT ON COLUMN cuts.scan_angle_degrees IS 'Scan angle in degrees (-90 to 90)';
COMMENT ON COLUMN machines.laser_source_type IS 'Machine laser type: fiber_cutting, fiber_engraving, co2_cutting, diode_engraving, uv_marking, etc.';

-- Add index for operation_type queries
CREATE INDEX idx_cuts_operation_type ON cuts(operation_type);
