/**
 * Tests for .clb / .lbset / .xml and CSV import parsing.
 *
 * These import the REAL parsing functions from src/lib/clb-parser.ts
 * (parseClbXml, parseCsv, extractValue) so the tests exercise production code.
 */

import { describe, it, expect } from 'vitest'
import { parseClbXml, parseCsv, extractValue } from '@/lib/clb-parser'

// ---- Test data ----

const VALID_CLB_SIMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnLibrary DisplayName="Test Library">
  <Material name="Stainless Steel">
    <Entry Thickness="3.0" Desc="Production cut" NoThickTitle="">
      <CutSetting type="Cut">
        <index Value="0"/>
        <name Value="C00"/>
        <speed Value="58.33"/>
        <maxPower Value="80"/>
        <minPower Value="15"/>
        <numPasses Value="1"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`

const VALID_CLB_MULTIPLE_MATERIALS = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnLibrary DisplayName="Full Library">
  <Material name="Stainless Steel">
    <Entry Thickness="3.0" Desc="Standard cut" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="58.33"/>
        <maxPower Value="80"/>
        <minPower Value="15"/>
        <numPasses Value="1"/>
      </CutSetting>
    </Entry>
    <Entry Thickness="5.0" Desc="Thick cut" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="33.33"/>
        <maxPower Value="95"/>
        <minPower Value="20"/>
        <numPasses Value="2"/>
      </CutSetting>
    </Entry>
  </Material>
  <Material name="Aluminum 6061">
    <Entry Thickness="2.0" Desc="Thin aluminum" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="41.67"/>
        <maxPower Value="70"/>
        <minPower Value="10"/>
        <numPasses Value="1"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`

const VALID_CLB_ENGRAVING = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnLibrary DisplayName="Engraving Library">
  <Material name="Anodized Aluminum">
    <Entry Thickness="2.0" Desc="Deep engrave" NoThickTitle="">
      <CutSetting type="Scan">
        <speed Value="16.67"/>
        <maxPower Value="50"/>
        <minPower Value="10"/>
        <numPasses Value="3"/>
        <interval Value="0.06"/>
        <frequency Value="80000"/>
        <scanAngle Value="45"/>
      </CutSetting>
    </Entry>
    <Entry Thickness="2.0" Desc="Image engrave" NoThickTitle="">
      <CutSetting type="Image">
        <speed Value="33.33"/>
        <maxPower Value="30"/>
        <minPower Value="5"/>
        <numPasses Value="1"/>
        <interval Value="0.04"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`

const VALID_CLB_NEGATIVE_THICKNESS = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnLibrary DisplayName="Test">
  <Material name="Generic">
    <Entry Thickness="-1.0" Desc="Unknown thickness" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="50"/>
        <maxPower Value="60"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`

// Galvo / MOPA fiber library: type="Scan", QPulseWidth (us), frequency, DPI,
// no thickness, lowercase BOM + CRLF, attributes in varied order.
const GALVO_MOPA_CLB =
  '﻿<?xml version="1.0" encoding="UTF-8"?>\r\n' +
  '<LightBurnLibrary DeviceName="Galvo Fiber">\r\n' +
  '  <Material name="Mild Steel &amp; Coated">\r\n' +
  '    <Entry NoThickTitle="Black Mark">\r\n' +
  '      <CutSetting type="Scan">\r\n' +
  '        <name Value="MOPA Black"/>\r\n' +
  '        <maxPower Value="40"/>\r\n' +
  '        <minPower Value="40"/>\r\n' +
  '        <speed Value="500"/>\r\n' +
  '        <frequency Value="200000"/>\r\n' +
  '        <QPulseWidth Value="200"/>\r\n' +
  '        <DPI Value="1000"/>\r\n' +
  '        <interval Value="0.025"/>\r\n' +
  '        <scanAngle Value="0"/>\r\n' +
  '        <crossHatch Value="1"/>\r\n' +
  '        <bidir Value="1"/>\r\n' +
  '        <numPasses Value="1"/>\r\n' +
  '      </CutSetting>\r\n' +
  '    </Entry>\r\n' +
  '  </Material>\r\n' +
  '</LightBurnLibrary>\r\n'

// Newer format: param values nested as text nodes and type as nested tag,
// lowercase `value` attribute, attribute order varied.
const NESTED_VALUE_CLB = `<?xml version="1.0"?>
<LightBurnLibrary>
  <Material name="Acrylic">
    <Entry Thickness="6.0" Desc="Clear acrylic">
      <CutSetting>
        <type Value="Cut"/>
        <speed>20</speed>
        <maxPower>90</maxPower>
        <minPower>60</minPower>
        <numPasses>2</numPasses>
        <interval value="0.1"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`

// Flat fragment: no <LightBurnLibrary> / <Material>, just <CutSetting> blocks.
const FLAT_CUTSETTING_FRAGMENT = `<CutSetting type="Mark">
  <name Value="Deep Engrave"/>
  <speed Value="1000"/>
  <maxPower Value="60"/>
  <minPower Value="60"/>
  <frequency Value="60000"/>
  <QPulseWidth Value="100"/>
</CutSetting>
<CutSetting type="Offset">
  <speed Value="100"/>
  <maxPower Value="80"/>
</CutSetting>`

// Malformed XML — unbalanced tags, junk — should not throw.
const MALFORMED_XML = `<LightBurnLibrary>
  <Material name="Broken">
    <Entry Thickness="3.0">
      <CutSetting type="Cut">
        <speed Value="40"/>
        <maxPower Value="70"
      <!-- missing close -->
  <Material name="Recovered">
    <Entry Thickness="2.0" Desc="OK">
      <CutSetting type="Cut">
        <speed Value="30"/>
        <maxPower Value="50"/>
      </CutSetting>
    </Entry>
  </Material>`

const CSV_IMPORT = `material,thickness_mm,power_pct,speed (mm/min),line_interval_mm,frequency_hz,q_pulse_ns,num_passes,operation_type
Mild Steel,3,80,3500,0.1,20000,200000,2,cut
Anodized Aluminum,2,50,1200,0.06,80000,,3,engrave
"Brass, polished",1,40,900,0.04,60000,150000,1,mark`

const CSV_SPEED_MMS = `material,power,speed_mm_s,q_pulse_width_us
Plywood,75,30,
Steel,40,8.5,0.2`

// ---- Tests ----

describe('parseClbXml — classic .clb', () => {
  it('parses a simple single-material .clb file', () => {
    const entries = parseClbXml(VALID_CLB_SIMPLE)
    expect(entries).toHaveLength(1)
    expect(entries[0].material).toBe('Stainless Steel')
    expect(entries[0].thickness_mm).toBe(3.0)
    expect(entries[0].power_pct).toBe(80)
    expect(entries[0].min_power_pct).toBe(15)
    expect(entries[0].num_passes).toBe(1)
    expect(entries[0].cut_type).toBe('Cut')
    expect(entries[0].operation_type).toBe('cut')
  })

  it('parses multiple materials with multiple entries', () => {
    const entries = parseClbXml(VALID_CLB_MULTIPLE_MATERIALS)
    expect(entries).toHaveLength(3)
    expect(entries[0].material).toBe('Stainless Steel')
    expect(entries[0].thickness_mm).toBe(3.0)
    expect(entries[1].material).toBe('Stainless Steel')
    expect(entries[1].thickness_mm).toBe(5.0)
    expect(entries[2].material).toBe('Aluminum 6061')
    expect(entries[2].thickness_mm).toBe(2.0)
  })

  it('preserves description in notes', () => {
    const entries = parseClbXml(VALID_CLB_SIMPLE)
    expect(entries[0].notes).toContain('Production cut')
  })

  it('converts speed from mm/s to mm/min correctly', () => {
    const entries = parseClbXml(VALID_CLB_SIMPLE)
    // 58.33 mm/s * 60 = 3499.8 -> rounds to 3500
    expect(entries[0].speed_mm_min).toBe(3500)
  })

  it('converts various speeds correctly', () => {
    const entries = parseClbXml(VALID_CLB_MULTIPLE_MATERIALS)
    expect(entries[0].speed_mm_min).toBe(3500)
    expect(entries[1].speed_mm_min).toBe(2000)
    expect(entries[2].speed_mm_min).toBe(2500)
  })
})

describe('CutSetting types', () => {
  it('maps "Cut" -> "cut"', () => {
    expect(parseClbXml(VALID_CLB_SIMPLE)[0].operation_type).toBe('cut')
  })

  it('maps "Scan" -> "engrave"', () => {
    const e = parseClbXml(VALID_CLB_ENGRAVING).find((x) => x.cut_type === 'Scan')
    expect(e!.operation_type).toBe('engrave')
  })

  it('maps "Image" -> "engrave"', () => {
    const e = parseClbXml(VALID_CLB_ENGRAVING).find((x) => x.cut_type === 'Image')
    expect(e!.operation_type).toBe('engrave')
  })

  it('maps "Mark" -> "mark" and "Offset" -> "cut"', () => {
    const e = parseClbXml(FLAT_CUTSETTING_FRAGMENT)
    const mark = e.find((x) => x.cut_type === 'Mark')
    const offset = e.find((x) => x.cut_type === 'Offset')
    expect(mark!.operation_type).toBe('mark')
    expect(offset!.operation_type).toBe('cut')
  })

  it('adds type to notes for non-Cut types', () => {
    const e = parseClbXml(VALID_CLB_ENGRAVING).find((x) => x.cut_type === 'Scan')
    expect(e!.notes).toContain('Type: Scan')
  })

  it('does not add type to notes for plain "Cut"', () => {
    expect(parseClbXml(VALID_CLB_SIMPLE)[0].notes).not.toContain('Type: Cut')
  })
})

describe('Engraving parameters', () => {
  it('extracts frequency_hz, scan angle, interval, passes from Scan entries', () => {
    const e = parseClbXml(VALID_CLB_ENGRAVING).find((x) => x.cut_type === 'Scan')!
    expect(e.frequency_hz).toBe(80000)
    expect(e.scan_angle_degrees).toBe(45)
    expect(e.line_interval_mm).toBe(0.06)
    expect(e.num_passes).toBe(3)
    expect(e.notes).toContain('3 passes')
  })
})

describe('Galvo / MOPA .clb', () => {
  it('parses a galvo/MOPA file with BOM, CRLF, no thickness, type=Scan', () => {
    const entries = parseClbXml(GALVO_MOPA_CLB)
    expect(entries).toHaveLength(1)
    const e = entries[0]
    expect(e.material).toBe('Mild Steel & Coated') // ampersand decoded
    expect(e.thickness_mm).toBeNull() // no Thickness attr
    expect(e.power_pct).toBe(40)
    expect(e.operation_type).toBe('engrave')
    expect(e.frequency_hz).toBe(200000)
    expect(e.line_interval_mm).toBe(0.025)
    expect(e.cross_hatch).toBe(true)
    expect(e.scan_angle_degrees).toBe(0)
  })

  it('converts QPulseWidth from microseconds to nanoseconds (us * 1000)', () => {
    const e = parseClbXml(GALVO_MOPA_CLB)[0]
    // 200 us = 200000 ns
    expect(e.q_pulse_ns).toBe(200000)
  })

  it('converts galvo speed mm/s -> mm/min (500 -> 30000)', () => {
    const e = parseClbXml(GALVO_MOPA_CLB)[0]
    expect(e.speed_mm_min).toBe(30000)
  })

  it('notes DPI, Q-Pulse, bidir, cross-hatch', () => {
    const e = parseClbXml(GALVO_MOPA_CLB)[0]
    expect(e.notes).toContain('DPI: 1000')
    expect(e.notes).toContain('Q-Pulse: 200us')
    expect(e.notes).toContain('Bidirectional')
    expect(e.notes).toContain('Cross-hatch')
  })
})

describe('Newer nested-value format', () => {
  it('parses nested text-node values and nested <type> tag', () => {
    const entries = parseClbXml(NESTED_VALUE_CLB)
    expect(entries).toHaveLength(1)
    const e = entries[0]
    expect(e.material).toBe('Acrylic')
    expect(e.cut_type).toBe('Cut')
    expect(e.operation_type).toBe('cut')
    expect(e.speed_mm_min).toBe(1200) // 20 mm/s * 60
    expect(e.power_pct).toBe(90)
    expect(e.min_power_pct).toBe(60)
    expect(e.num_passes).toBe(2)
    expect(e.line_interval_mm).toBe(0.1) // lowercase value=
  })
})

describe('Flat CutSetting fragment fallback', () => {
  it('parses a flat fragment with no Material wrapper as "Imported"', () => {
    const entries = parseClbXml(FLAT_CUTSETTING_FRAGMENT)
    expect(entries).toHaveLength(2)
    expect(entries[0].material).toBe('Imported')
    expect(entries[0].cut_type).toBe('Mark')
    expect(entries[0].q_pulse_ns).toBe(100000) // 100us
    expect(entries[0].frequency_hz).toBe(60000)
  })
})

describe('Thickness handling', () => {
  it('handles negative thickness (-1.0) as null', () => {
    expect(parseClbXml(VALID_CLB_NEGATIVE_THICKNESS)[0].thickness_mm).toBeNull()
  })

  it('parses positive thickness correctly', () => {
    expect(parseClbXml(VALID_CLB_SIMPLE)[0].thickness_mm).toBe(3.0)
  })

  it('handles zero thickness as null', () => {
    const xml = `<LightBurnLibrary><Material name="Test">
      <Entry Thickness="0" Desc=""><CutSetting type="Cut">
        <speed Value="10"/><maxPower Value="50"/>
      </CutSetting></Entry></Material></LightBurnLibrary>`
    expect(parseClbXml(xml)[0].thickness_mm).toBeNull()
  })
})

describe('Error handling — never throws, returns good blocks', () => {
  it('returns empty array for non-XML content', () => {
    expect(parseClbXml('This is not XML at all')).toHaveLength(0)
  })

  it('returns empty array for empty string', () => {
    expect(parseClbXml('')).toHaveLength(0)
  })

  it('returns empty array for XML without LightBurn structure', () => {
    expect(parseClbXml(`<root><item>data</item></root>`)).toHaveLength(0)
  })

  it('does not throw on malformed XML and still recovers a good block', () => {
    let entries: ReturnType<typeof parseClbXml> = []
    expect(() => {
      entries = parseClbXml(MALFORMED_XML)
    }).not.toThrow()
    // Despite the unbalanced tags, at least one usable cut setting is recovered
    // (power + speed extracted) rather than crashing or returning nothing.
    expect(entries.length).toBeGreaterThanOrEqual(1)
    expect(entries[0].power_pct).not.toBeNull()
    expect(entries[0].speed_mm_min).not.toBeNull()
  })

  it('handles malformed numeric values gracefully', () => {
    const xml = `<LightBurnLibrary><Material name="Test">
      <Entry Thickness="abc" Desc=""><CutSetting type="Cut">
        <speed Value="not_a_number"/><maxPower Value="80"/>
      </CutSetting></Entry></Material></LightBurnLibrary>`
    const entries = parseClbXml(xml)
    expect(entries).toHaveLength(1)
    expect(entries[0].thickness_mm).toBeNull()
    expect(entries[0].speed_mm_min).toBeNull()
    expect(entries[0].power_pct).toBe(80)
  })

  it('handles Material with no entries / no CutSettings', () => {
    expect(
      parseClbXml(`<LightBurnLibrary><Material name="Empty"></Material></LightBurnLibrary>`)
    ).toHaveLength(0)
  })
})

describe('extractValue helper', () => {
  it('extracts from Value="..." attribute', () => {
    expect(extractValue('<speed Value="58.33"/>', 'speed')).toBeCloseTo(58.33)
  })

  it('extracts from lowercase value="..." attribute', () => {
    expect(extractValue('<speed value="42"/>', 'speed')).toBe(42)
  })

  it('extracts from nested <tag>X</tag>', () => {
    expect(extractValue('<speed>17.5</speed>', 'speed')).toBe(17.5)
  })

  it('returns null for missing tag', () => {
    expect(extractValue('<speed Value="58.33"/>', 'maxPower')).toBeNull()
  })

  it('returns null for non-numeric value', () => {
    expect(extractValue('<speed Value="abc"/>', 'speed')).toBeNull()
  })

  it('is case-insensitive for tag names', () => {
    expect(extractValue('<MaxPower Value="80"/>', 'maxPower')).toBe(80)
  })

  it('handles zero and negative values', () => {
    expect(extractValue('<minPower Value="0"/>', 'minPower')).toBe(0)
    expect(extractValue('<offset Value="-1.5"/>', 'offset')).toBe(-1.5)
  })
})

describe('parseCsv', () => {
  it('parses a CSV with galvo columns and "speed (mm/min)" header', () => {
    const entries = parseCsv(CSV_IMPORT)
    expect(entries).toHaveLength(3)
    const steel = entries[0]
    expect(steel.material).toBe('Mild Steel')
    expect(steel.thickness_mm).toBe(3)
    expect(steel.power_pct).toBe(80)
    expect(steel.speed_mm_min).toBe(3500) // already mm/min, not multiplied
    expect(steel.line_interval_mm).toBe(0.1)
    expect(steel.frequency_hz).toBe(20000)
    expect(steel.q_pulse_ns).toBe(200000)
    expect(steel.num_passes).toBe(2)
    expect(steel.operation_type).toBe('cut')
  })

  it('maps engrave / mark operation types and handles quoted commas', () => {
    const entries = parseCsv(CSV_IMPORT)
    expect(entries[1].operation_type).toBe('engrave')
    expect(entries[1].q_pulse_ns).toBeNull() // empty cell
    expect(entries[2].material).toBe('Brass, polished') // quoted comma preserved
    expect(entries[2].operation_type).toBe('mark')
  })

  it('converts speed_mm_s -> mm/min and q_pulse us -> ns', () => {
    const entries = parseCsv(CSV_SPEED_MMS)
    expect(entries[0].material).toBe('Plywood')
    expect(entries[0].speed_mm_min).toBe(1800) // 30 mm/s * 60
    expect(entries[0].power_pct).toBe(75)
    expect(entries[1].speed_mm_min).toBe(510) // 8.5 * 60
    expect(entries[1].q_pulse_ns).toBe(200) // 0.2 us * 1000
  })

  it('returns empty array when no material column present', () => {
    expect(parseCsv('foo,bar\n1,2')).toHaveLength(0)
  })

  it('returns empty array for header-only CSV', () => {
    expect(parseCsv('material,power_pct')).toHaveLength(0)
  })
})

describe('File extension validation', () => {
  function isValidExtension(filename: string): boolean {
    const lowerName = filename.toLowerCase()
    return ['.clb', '.xml', '.lbset', '.csv', '.tsv', '.txt'].some((ext) =>
      lowerName.endsWith(ext)
    )
  }

  it('accepts .clb / .CLB / .Clb', () => {
    expect(isValidExtension('library.clb')).toBe(true)
    expect(isValidExtension('LIBRARY.CLB')).toBe(true)
    expect(isValidExtension('MyFile.Clb')).toBe(true)
  })

  it('accepts .xml / .lbset / .csv', () => {
    expect(isValidExtension('export.xml')).toBe(true)
    expect(isValidExtension('settings.lbset')).toBe(true)
    expect(isValidExtension('data.csv')).toBe(true)
  })

  it('rejects .json files', () => {
    expect(isValidExtension('config.json')).toBe(false)
  })

  it('rejects files with no extension', () => {
    expect(isValidExtension('library')).toBe(false)
  })
})
