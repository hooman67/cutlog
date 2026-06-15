#!/usr/bin/env python3
"""
Laser Parameter Scaling Module
===============================

Reimplementation of the LaserParamsConverter conversion logic
(https://github.com/shark92651/LaserParamsConverter) by David Christian (GPL-3).

This module provides functions to convert laser cutting/engraving parameters
between different machine configurations (wattage and lens focal length).

Core Physics:
    - Power density at the workpiece depends on both laser wattage and spot size.
    - Spot size is proportional to the focal length of the focusing lens.
    - A longer focal length lens produces a larger spot, spreading the same power
      over a bigger area, thus requiring more power to achieve the same effect.
    - When converting between wattages, we scale the power percentage to deliver
      the same absolute power at the workpiece.
    - When the computed power exceeds the machine's max capability, we compensate
      by reducing speed (giving the laser more dwell time per unit area).

Key Formula (from LaserParamsConverter C# source):
    1. power_modifier = (power_pct * output_lens_mm) / input_lens_mm
       - Accounts for spot size change between lenses
    2. output_power = (input_wattage * power_modifier) / output_wattage
       - Scales the percentage to deliver equivalent absolute power
    3. If output_power > max_power_pct:
       - speed_modifier = original_power / output_power
       - output_speed = input_speed * speed_modifier
       - output_power = max_power_pct (clamped)
       This reduces speed to compensate for the power ceiling.

Note: For CO2 lasers, lens correction is disabled (lens values forced to 1)
      because CO2 gantry lasers typically have fixed optics or the lens
      relationship differs from fiber galvo systems.

Usage:
    /opt/conda/bin/python3 scripts/parameter_scaling.py
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Default max power percentage (most controllers treat 100% as ceiling)
DEFAULT_MAX_POWER_PCT = 100

# Common fiber laser lens focal lengths (mm)
COMMON_FIBER_LENSES = [110, 150, 175, 200, 220, 254, 300, 330, 420]

# Common fiber laser wattages (W)
COMMON_FIBER_WATTAGES = [20, 30, 50, 60, 80, 100, 120, 150, 200]

# Common CO2 wattages (W)
COMMON_CO2_WATTAGES = [40, 50, 60, 80, 100, 130, 150, 180]


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class LaserType:
    """Laser type enumeration."""
    CO2 = "co2"
    FIBER = "fiber"


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------

def _decimal_to_int32(value: float) -> int:
    """
    Mimic C# Decimal.ToInt32() behavior: rounds to nearest integer
    using banker's rounding (round half to even), matching .NET semantics.

    Python's built-in round() already uses banker's rounding, so we use that.
    """
    return round(value)


# ---------------------------------------------------------------------------
# Core Conversion Functions
# ---------------------------------------------------------------------------

def scale_power(
    original_power_pct: float,
    original_wattage: int,
    target_wattage: int,
    original_lens_mm: int = 1,
    target_lens_mm: int = 1,
    max_power_pct: int = DEFAULT_MAX_POWER_PCT,
    laser_type: str = LaserType.FIBER,
) -> tuple[float, float | None]:
    """
    Scale power percentage when switching between laser configurations.

    The formula accounts for two physical effects:
    1. Lens focal length change: A longer lens produces a larger spot, so more
       power % is needed to maintain the same power density.
    2. Wattage change: A higher wattage laser needs less power % to deliver
       the same absolute watts at the workpiece.

    Formula:
        power_modifier = (power_pct * target_lens) / source_lens
        output_power = (source_wattage * power_modifier) / target_wattage

    If output exceeds max_power_pct, returns (max_power_pct, speed_modifier)
    where speed_modifier < 1.0 indicates the speed must be reduced.

    Args:
        original_power_pct: Power percentage on the source machine (0-100+).
        original_wattage: Source laser wattage in watts.
        target_wattage: Target laser wattage in watts.
        original_lens_mm: Source lens focal length in mm (ignored for CO2).
        target_lens_mm: Target lens focal length in mm (ignored for CO2).
        max_power_pct: Maximum power percentage the target machine supports.
        laser_type: "fiber" or "co2". CO2 ignores lens parameters.

    Returns:
        Tuple of (output_power_pct, speed_modifier_or_None).
        speed_modifier is None if power is within limits, otherwise it's the
        factor to multiply speed by (always < 1.0).
    """
    if laser_type == LaserType.CO2:
        original_lens_mm = 1
        target_lens_mm = 1

    # Step 1: Apply lens correction to get the "equivalent power" needed
    # A larger output lens = larger spot = need more power to maintain density
    power_modifier = (original_power_pct * target_lens_mm) / original_lens_mm

    # Step 2: Scale by wattage ratio
    # Higher wattage target = less % needed for same absolute power
    output_power = (original_wattage * power_modifier) / target_wattage

    # Step 3: Round to integer (matching C# Decimal.ToInt32 which uses
    # banker's rounding / round-half-to-even)
    # The C# code converts outPower to int BEFORE using it in speed calc
    output_power_int = _decimal_to_int32(output_power)

    # Step 4: Check if power exceeds machine maximum
    speed_modifier = None
    if output_power_int > max_power_pct:
        # Cannot achieve required power, must compensate with slower speed
        # C# uses: speedMod = (Decimal)Power / (Decimal)outPower
        # where outPower is the integer-rounded value
        speed_modifier = original_power_pct / output_power_int
        output_power_int = max_power_pct

    return (output_power_int, speed_modifier)


def scale_speed(
    original_speed: float,
    original_power_pct: float,
    original_wattage: int,
    target_wattage: int,
    original_lens_mm: int = 1,
    target_lens_mm: int = 1,
    max_power_pct: int = DEFAULT_MAX_POWER_PCT,
    laser_type: str = LaserType.FIBER,
) -> float:
    """
    Scale speed when switching between laser configurations.

    Speed only changes when the required power exceeds the target machine's
    maximum. In that case, we slow down to compensate (more energy per unit
    area from longer dwell time).

    The speed modifier formula:
        speed_modifier = original_power_pct / computed_output_power
        output_speed = original_speed * speed_modifier

    If the target machine can achieve the required power within its limits,
    the speed remains unchanged.

    Args:
        original_speed: Speed on the source machine (mm/s).
        original_power_pct: Power percentage on the source machine.
        original_wattage: Source laser wattage in watts.
        target_wattage: Target laser wattage in watts.
        original_lens_mm: Source lens focal length in mm.
        target_lens_mm: Target lens focal length in mm.
        max_power_pct: Maximum power percentage the target machine supports.
        laser_type: "fiber" or "co2".

    Returns:
        The scaled speed value (mm/s).
    """
    _, speed_modifier = scale_power(
        original_power_pct,
        original_wattage,
        target_wattage,
        original_lens_mm,
        target_lens_mm,
        max_power_pct,
        laser_type,
    )

    if speed_modifier is not None:
        # C# uses Decimal.ToInt32() which does banker's rounding
        return _decimal_to_int32(original_speed * speed_modifier)
    return _decimal_to_int32(original_speed)


def scale_parameters(
    params: dict,
    original_config: dict,
    target_config: dict,
) -> dict:
    """
    Scale a complete parameter set from one machine configuration to another.

    This is the high-level function that converts all relevant parameters
    in a single call, matching the behavior of the C# LaserParamsConverter
    library conversion.

    Args:
        params: Dictionary with laser parameters. Expected keys:
            - "power_pct": float (0-100) - power percentage
            - "speed_mms": float - marking speed in mm/s
            - "frequency_khz": float (optional) - pulse frequency in kHz
            - "pulse_width_ns": int (optional) - Q-pulse width in nanoseconds
            - "passes": int (optional) - number of passes/loops
        original_config: Source machine configuration. Expected keys:
            - "wattage": int - laser wattage (e.g., 30, 60, 100)
            - "lens_mm": int - lens focal length in mm (e.g., 110, 150, 300)
            - "laser_type": str - "fiber" or "co2"
            - "max_power_pct": int (optional, default 100)
        target_config: Target machine configuration (same keys as original_config).

    Returns:
        New dictionary with scaled parameters. Includes all original keys
        plus metadata about the conversion.
    """
    laser_type = original_config.get("laser_type", LaserType.FIBER)
    max_power = target_config.get("max_power_pct", DEFAULT_MAX_POWER_PCT)

    original_wattage = original_config["wattage"]
    target_wattage = target_config["wattage"]
    original_lens = original_config.get("lens_mm", 1)
    target_lens = target_config.get("lens_mm", 1)

    original_power = params["power_pct"]
    original_speed = params["speed_mms"]

    # Compute scaled power and speed
    output_power, speed_mod = scale_power(
        original_power,
        original_wattage,
        target_wattage,
        original_lens,
        target_lens,
        max_power,
        laser_type,
    )

    output_speed = scale_speed(
        original_speed,
        original_power,
        original_wattage,
        target_wattage,
        original_lens,
        target_lens,
        max_power,
        laser_type,
    )

    # Build output parameter set
    result = {
        "power_pct": output_power,
        "speed_mms": output_speed,
        "power_clamped": speed_mod is not None,
    }

    # Pass-through parameters that don't change with wattage/lens
    # (frequency and pulse width are independent of power/speed scaling
    # in the original converter — they're only overridden as a fixed value
    # via advanced settings, not scaled proportionally)
    if "frequency_khz" in params:
        result["frequency_khz"] = params["frequency_khz"]
    if "pulse_width_ns" in params:
        result["pulse_width_ns"] = params["pulse_width_ns"]
    if "passes" in params:
        result["passes"] = params["passes"]

    # Add conversion metadata
    result["_conversion"] = {
        "from": {
            "wattage": original_wattage,
            "lens_mm": original_lens,
            "laser_type": laser_type,
        },
        "to": {
            "wattage": target_wattage,
            "lens_mm": target_lens,
            "max_power_pct": max_power,
        },
        "speed_was_reduced": speed_mod is not None,
        "speed_modifier": speed_mod,
    }

    return result


# ---------------------------------------------------------------------------
# Batch Conversion
# ---------------------------------------------------------------------------

def scale_parameter_batch(
    param_list: list[dict],
    original_config: dict,
    target_config: dict,
) -> list[dict]:
    """
    Scale a batch of parameter sets from one configuration to another.

    Useful for converting an entire parameter library at once.

    Args:
        param_list: List of parameter dictionaries (see scale_parameters).
        original_config: Source machine configuration.
        target_config: Target machine configuration.

    Returns:
        List of scaled parameter dictionaries.
    """
    return [scale_parameters(p, original_config, target_config) for p in param_list]


# ---------------------------------------------------------------------------
# Utility / Analysis Functions
# ---------------------------------------------------------------------------

def compute_power_density_ratio(
    original_lens_mm: int,
    target_lens_mm: int,
) -> float:
    """
    Compute the power density ratio when switching lenses.

    Power density is inversely proportional to the square of the spot diameter.
    Spot diameter is approximately proportional to focal length for a given
    beam divergence and beam diameter.

    Power_density ratio = (original_lens / target_lens)^2

    A shorter lens concentrates power into a smaller spot -> higher density.

    Args:
        original_lens_mm: Original lens focal length.
        target_lens_mm: Target lens focal length.

    Returns:
        Ratio of power densities (target/original). Values > 1 mean the target
        configuration has LESS power density (larger spot).
    """
    return (target_lens_mm / original_lens_mm) ** 2


def compute_absolute_power(power_pct: float, wattage: int) -> float:
    """
    Compute the absolute power in watts from percentage and wattage.

    Args:
        power_pct: Power percentage (0-100).
        wattage: Laser wattage rating.

    Returns:
        Absolute power in watts.
    """
    return (power_pct / 100.0) * wattage


def compute_energy_density(
    power_pct: float,
    wattage: int,
    speed_mms: float,
    lens_mm: int,
    line_spacing_mm: float = 0.025,
) -> float:
    """
    Estimate energy density (J/mm^2) for a fill/hatch operation.

    This is a simplified model assuming:
    - Spot diameter proportional to lens focal length (using typical ratio)
    - Uniform beam profile

    Energy density = Power / (Speed * Line_Spacing)

    For comparing two configurations, the ratio of energy densities
    determines whether results will be equivalent.

    Args:
        power_pct: Power percentage.
        wattage: Laser wattage.
        speed_mms: Speed in mm/s.
        lens_mm: Lens focal length in mm.
        line_spacing_mm: Hatch line spacing in mm.

    Returns:
        Approximate energy density in J/mm^2.
    """
    absolute_power_w = compute_absolute_power(power_pct, wattage)
    if speed_mms == 0 or line_spacing_mm == 0:
        return float('inf')
    return absolute_power_w / (speed_mms * line_spacing_mm)


# ---------------------------------------------------------------------------
# Dataclass for structured parameter handling
# ---------------------------------------------------------------------------

@dataclass
class LaserConfig:
    """Machine configuration for a laser system."""
    wattage: int
    lens_mm: int = 110
    laser_type: str = LaserType.FIBER
    max_power_pct: int = DEFAULT_MAX_POWER_PCT

    def to_dict(self) -> dict:
        return {
            "wattage": self.wattage,
            "lens_mm": self.lens_mm,
            "laser_type": self.laser_type,
            "max_power_pct": self.max_power_pct,
        }


@dataclass
class LaserParams:
    """A set of laser marking/cutting parameters."""
    power_pct: float
    speed_mms: float
    frequency_khz: Optional[float] = None
    pulse_width_ns: Optional[int] = None
    passes: int = 1
    name: str = ""

    def to_dict(self) -> dict:
        d = {"power_pct": self.power_pct, "speed_mms": self.speed_mms, "passes": self.passes}
        if self.frequency_khz is not None:
            d["frequency_khz"] = self.frequency_khz
        if self.pulse_width_ns is not None:
            d["pulse_width_ns"] = self.pulse_width_ns
        return d

    def scale_to(self, source_config: LaserConfig, target_config: LaserConfig) -> "LaserParams":
        """Scale this parameter set to a different machine configuration."""
        result = scale_parameters(self.to_dict(), source_config.to_dict(), target_config.to_dict())
        return LaserParams(
            power_pct=result["power_pct"],
            speed_mms=result["speed_mms"],
            frequency_khz=result.get("frequency_khz"),
            pulse_width_ns=result.get("pulse_width_ns"),
            passes=result.get("passes", self.passes),
            name=f"{self.name} (scaled {target_config.wattage}W/{target_config.lens_mm}mm)",
        )


# ---------------------------------------------------------------------------
# Demo / Test
# ---------------------------------------------------------------------------

def demo():
    """Demonstrate the parameter scaling with example conversions."""
    print("=" * 70)
    print("LASER PARAMETER SCALING - Demo & Verification")
    print("=" * 70)
    print()
    print("Based on LaserParamsConverter by David Christian (GPL-3)")
    print("Repo: https://github.com/shark92651/LaserParamsConverter")
    print()

    # --- Example 1: Same lens, different wattage (scale down) ---
    print("-" * 70)
    print("Example 1: 30W -> 50W fiber laser, same 110mm lens")
    print("  (Higher wattage = less power % needed)")
    print("-" * 70)
    params = {"power_pct": 80, "speed_mms": 1000}
    source = {"wattage": 30, "lens_mm": 110, "laser_type": "fiber"}
    target = {"wattage": 50, "lens_mm": 110, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Input:  Power={params['power_pct']}%, Speed={params['speed_mms']} mm/s")
    print(f"  Output: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Clamped: {result['power_clamped']}")
    print()

    # --- Example 2: Same lens, different wattage (scale up - will clamp) ---
    print("-" * 70)
    print("Example 2: 60W -> 30W fiber laser, same 150mm lens")
    print("  (Lower wattage = more power % needed, may exceed max)")
    print("-" * 70)
    params = {"power_pct": 70, "speed_mms": 2000}
    source = {"wattage": 60, "lens_mm": 150, "laser_type": "fiber"}
    target = {"wattage": 30, "lens_mm": 150, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Input:  Power={params['power_pct']}%, Speed={params['speed_mms']} mm/s")
    print(f"  Output: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Clamped: {result['power_clamped']} (speed reduced to compensate)")
    print()

    # --- Example 3: Different lens, same wattage ---
    print("-" * 70)
    print("Example 3: 30W with 110mm lens -> 30W with 300mm lens")
    print("  (Larger lens = bigger spot = need more power for same density)")
    print("-" * 70)
    params = {"power_pct": 40, "speed_mms": 800}
    source = {"wattage": 30, "lens_mm": 110, "laser_type": "fiber"}
    target = {"wattage": 30, "lens_mm": 300, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Input:  Power={params['power_pct']}%, Speed={params['speed_mms']} mm/s")
    print(f"  Output: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Clamped: {result['power_clamped']}")
    print()

    # --- Example 4: Both lens and wattage change ---
    print("-" * 70)
    print("Example 4: 30W/110mm -> 100W/300mm (common upgrade path)")
    print("  (Much higher wattage partially offsets larger lens)")
    print("-" * 70)
    params = {"power_pct": 65, "speed_mms": 500, "frequency_khz": 30, "passes": 2}
    source = {"wattage": 30, "lens_mm": 110, "laser_type": "fiber"}
    target = {"wattage": 100, "lens_mm": 300, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Input:  Power={params['power_pct']}%, Speed={params['speed_mms']} mm/s, "
          f"Freq={params['frequency_khz']} kHz, Passes={params['passes']}")
    print(f"  Output: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s, "
          f"Freq={result.get('frequency_khz')} kHz, Passes={result.get('passes')}")
    print(f"  Clamped: {result['power_clamped']}")
    print()

    # --- Example 5: CO2 laser (no lens correction) ---
    print("-" * 70)
    print("Example 5: CO2 100W -> 50W (lens ignored for CO2)")
    print("-" * 70)
    params = {"power_pct": 40, "speed_mms": 300}
    source = {"wattage": 100, "lens_mm": 1, "laser_type": "co2"}
    target = {"wattage": 50, "lens_mm": 1, "laser_type": "co2", "max_power_pct": 90}
    result = scale_parameters(params, source, target)
    print(f"  Input:  Power={params['power_pct']}%, Speed={params['speed_mms']} mm/s")
    print(f"  Output: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Clamped: {result['power_clamped']}")
    print()

    # --- Example 6: Using dataclasses ---
    print("-" * 70)
    print("Example 6: Using LaserConfig/LaserParams dataclasses")
    print("-" * 70)
    src = LaserConfig(wattage=30, lens_mm=110)
    tgt = LaserConfig(wattage=60, lens_mm=220)
    p = LaserParams(power_pct=50, speed_mms=1200, frequency_khz=40, name="Stainless Black")
    scaled = p.scale_to(src, tgt)
    print(f"  Source config: {src.wattage}W, {src.lens_mm}mm lens")
    print(f"  Target config: {tgt.wattage}W, {tgt.lens_mm}mm lens")
    print(f"  Input:  {p.name} -> Power={p.power_pct}%, Speed={p.speed_mms} mm/s")
    print(f"  Output: {scaled.name} -> Power={scaled.power_pct}%, Speed={scaled.speed_mms} mm/s")
    print()

    # --- Verification against known C# behavior ---
    print("=" * 70)
    print("VERIFICATION: Matching C# LaserParamsConverter output")
    print("=" * 70)
    print()
    print("The C# Convert() method uses integer arithmetic (Decimal type):")
    print("  powerMod = (Power * outLens) / inLens")
    print("  outPower = (inWatts * powerMod) / outWatts")
    print("  if outPower > maxPower:")
    print("      speedMod = Power / outPower")
    print("      outSpeed = Speed * speedMod")
    print("      outPower = maxPower")
    print()

    # Reproduce exact C# test case: 30W/110mm -> 50W/150mm, power=80, speed=1000
    print("Test case: 30W/110mm -> 50W/150mm, power=80%, speed=1000mm/s, maxPower=100")
    # C# math:
    #   powerMod = (80 * 150) / 110 = 12000/110 = 109.0909...
    #   outPower = (30 * 109.0909) / 50 = 3272.727/50 = 65.454 -> rounds to 65
    #   outPower <= 100, so speed unchanged
    params = {"power_pct": 80, "speed_mms": 1000}
    source = {"wattage": 30, "lens_mm": 110, "laser_type": "fiber"}
    target = {"wattage": 50, "lens_mm": 150, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Result: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Expected (C# Decimal.ToInt32 truncates): Power=65%, Speed=1000 mm/s")
    print()

    # Another test: 60W/150mm -> 30W/110mm, power=70, speed=2000
    # C# math:
    #   powerMod = (70 * 110) / 150 = 7700/150 = 51.333...
    #   outPower = (60 * 51.333) / 30 = 3080/30 = 102.666 -> rounds to 103
    #   outPower > 100, so:
    #     speedMod = 70 / 103 = 0.6796...
    #     outSpeed = 2000 * 0.6796 = 1359.2 -> rounds to 1359
    #     outPower = 100
    print("Test case: 60W/150mm -> 30W/110mm, power=70%, speed=2000mm/s, maxPower=100")
    params = {"power_pct": 70, "speed_mms": 2000}
    source = {"wattage": 60, "lens_mm": 150, "laser_type": "fiber"}
    target = {"wattage": 30, "lens_mm": 110, "laser_type": "fiber", "max_power_pct": 100}
    result = scale_parameters(params, source, target)
    print(f"  Result: Power={result['power_pct']}%, Speed={result['speed_mms']} mm/s")
    print(f"  Expected: Power=100% (clamped), Speed ~1359 mm/s")
    print()

    print("=" * 70)
    print("FORMULA SUMMARY")
    print("=" * 70)
    print("""
    For FIBER lasers:
        power_modifier = (input_power_pct * target_lens_mm) / source_lens_mm
        output_power_pct = (source_wattage * power_modifier) / target_wattage

        If output_power_pct > max_power:
            speed_modifier = input_power_pct / output_power_pct
            output_speed = input_speed * speed_modifier
            output_power_pct = max_power
        Else:
            output_speed = input_speed (unchanged)

    For CO2 lasers:
        Same formula but lens values are forced to 1 (no lens correction).
        This simplifies to:
            output_power_pct = (source_wattage * input_power_pct) / target_wattage

    Frequency and pulse width:
        NOT scaled by the converter. They remain unchanged unless manually
        overridden via advanced settings (fixed pulse width).

    Physical interpretation:
        - The formula preserves "equivalent energy delivery" at the workpiece
        - Lens ratio compensates for spot size change (linear, not quadratic,
          because the converter uses a practical/empirical linear model rather
          than theoretical inverse-square for power density)
        - Speed reduction is a last resort when power ceiling is hit
    """)


if __name__ == "__main__":
    demo()
