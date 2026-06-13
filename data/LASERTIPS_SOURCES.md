# Laser Cutting Parameter Scraping - Sources and Summary

## Date: 2026-06-12

## Sources Successfully Scraped

### 1. lasertips.org (Primary)
- **URL**: https://www.lasertips.org
- **Data type**: Fiber laser cutting/marking parameters
- **Laser models referenced**: Raycus 20W/30W, JPT 50W/100W/200W, JNCT 1000W
- **Materials found**: Brass, Silver, Gold, Aluminum, Carbon Steel
- **Parameters available**: Material, thickness (mm), power (%), speed (mm/s), line interval (mm), frequency (kHz), loops
- **Parameters NOT available**: Gas type, gas pressure, focus position, nozzle diameter, nozzle distance
- **Notes**: This site focuses on fiber laser marking/engraving parameters with cutting via multi-pass ablation (loops). Not traditional CNC gas-assisted cutting. Speed was 0 for many entries (indicating stationary point cutting with loops). Subdomains co2galvo.lasertips.org and uv.lasertips.org contained only engraving data for non-metal materials.
- **Rows extracted**: 15

### 2. Wikipedia - Laser Cutting Article
- **URL**: https://en.wikipedia.org/wiki/Laser_cutting
- **Data type**: CO2 laser cutting reference speeds and power requirements
- **Materials found**: Stainless Steel, Aluminum, Mild Steel, Titanium, Plywood, Boron/Epoxy
- **Thickness range**: 0.51mm to 13mm
- **Parameters available**: Material, thickness (mm), cutting speed (cm/s), required power (W)
- **Parameters NOT available**: Gas pressure, focus position, nozzle diameter, nozzle distance
- **Gas type inferred**: N2 for stainless/aluminum, O2 for mild steel, Ar for titanium, air for non-metals
- **Rows extracted**: 28

## Sources Attempted But Unavailable

The following sites were attempted but returned errors (404, 403, connection refused, or no parameter data):

| Site | Status |
|------|--------|
| bodor.com | 404 |
| senfenglaser.com | 404 |
| trumpf.com | 503 |
| machinemfg.com | 403 |
| hsglaserco.com | Connection refused |
| stylecnc.com | No parameter tables (marketing only) |
| baison-laser.com | Connection refused |
| xtlaser.com | 404 |
| thefabricator.com | 403 |
| bystronic.com | No parameter tables |
| laserax.com | 404 |
| sciencedirect.com | 403 |
| researchgate.net | 403 |
| engineeringtoolbox.com | 403 |
| coherent.com | 404 |
| epiloglaser.com | 404 |
| troteclaser.com | 404 |
| mornlaser.com | 404 / Connection refused |
| cloudraylaser.com | 404 |
| ipgphotonics.com | 404 |
| amada.com | No parameter tables |
| precitec.com | 404 |
| kern-microtechnik.com | 429 |

## Data Quality Notes

1. **lasertips.org data**: These are for fiber laser marking machines (20-200W) using multi-pass ablation, not CNC sheet metal cutting machines (1000W+). Parameters include "loops" (number of passes) which is not in our schema. Speed was often 0 (stationary wobble cutting). Line interval data was captured.

2. **Wikipedia data**: Authoritative reference values from published sources. Speeds represent maximum achievable rates for CO2 lasers at stated power. Power is at 100% since values represent minimum power required. Gas types are inferred from standard industrial practice.

3. **Missing fields**: Most rows have NULLs for gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, and nozzle_distance_mm since these machine-specific parameters were not published in the source tables.

## Total Records

- **Total SQL INSERT rows**: 43
- **Materials covered**: 9 (Brass, Silver, Gold, Aluminum, Mild Steel, Stainless Steel 304, Titanium, Plywood, Boron Epoxy)
- **Thickness range**: 0.4mm to 13mm

## Recommendations for Future Scraping

1. **Manufacturer PDF datasheets** - Trumpf, Bystronic, Amada publish detailed parameter tables in their machine manuals (not publicly web-accessible)
2. **CNC forums** - Practical Machinist, CNCZone have user-shared parameters
3. **YouTube descriptions** - Many CNC operators share parameters in video descriptions
4. **Direct API access** - Some Chinese manufacturers (Han's Laser, HSG) have parameter calculators behind authentication
