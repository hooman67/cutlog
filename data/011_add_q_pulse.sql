ALTER TABLE cuts ADD COLUMN IF NOT EXISTS q_pulse_ns numeric;
COMMENT ON COLUMN cuts.q_pulse_ns IS 'Q-switch pulse width in nanoseconds (MOPA/galvo fiber lasers)';
