/**
 * Tests for .clb file parsing logic.
 *
 * The parseClbXml function is defined inside src/app/api/import-clb/route.ts.
 * Since it's not exported, we re-implement and test the parsing logic here.
 * The algorithm is regex-based XML parsing of LightBurn .clb library format.
 */

import { describe, it, expect } from 'vitest'

// ---- Re-implement the parsing logic (mirrors import-clb/route.ts) ----

interface ParsedEntry {
  material: string
  thickness_mm: number | null
  power_pct: number | null
  speed_mm_min: number | null
  line_interval_mm: number | null
  notes: string | null
  cut_type: string
  num_passes: number | null
  min_power_pct: number | null
  frequency_hz: number | null
  operation_type: string | null
  cross_hatch: boolean | null
  scan_angle_degrees: number | null
}

function extractValue(content: string, tagName: string): number | null {
  const regex = new RegExp(`<${tagName}\\s+Value="([^"]*)"`, 'i')
  const match = content.match(regex)
  if (match) {
    const val = parseFloat(match[1])
    return isNaN(val) ? null : val
  }
  return null
}

function parseClbXml(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = []

  const materialRegex = /<Material\s+name="([^"]*)"[^>]*>([\s\S]*?)<\/Material>/gi
  let materialMatch

  while ((materialMatch = materialRegex.exec(xml)) !== null) {
    const materialName = materialMatch[1]
    const materialContent = materialMatch[2]

    const entryRegex = /<Entry\s+([^>]*)>([\s\S]*?)<\/Entry>/gi
    let entryMatch

    while ((entryMatch = entryRegex.exec(materialContent)) !== null) {
      const entryAttrs = entryMatch[1]
      const entryContent = entryMatch[2]

      const thicknessMatch = entryAttrs.match(/Thickness="([^"]*)"/i)
      const descMatch = entryAttrs.match(/Desc="([^"]*)"/i)

      let thickness: number | null = null
      if (thicknessMatch) {
        const t = parseFloat(thicknessMatch[1])
        if (!isNaN(t) && t > 0) {
          thickness = t
        }
      }

      const cutSettingRegex = /<CutSetting\s+type="([^"]*)"[^>]*>([\s\S]*?)<\/CutSetting>/gi
      let cutMatch

      while ((cutMatch = cutSettingRegex.exec(entryContent)) !== null) {
        const cutType = cutMatch[1]
        const cutContent = cutMatch[2]

        const speed = extractValue(cutContent, 'speed')
        const maxPower = extractValue(cutContent, 'maxPower')
        const minPower = extractValue(cutContent, 'minPower')
        const numPasses = extractValue(cutContent, 'numPasses')
        const interval = extractValue(cutContent, 'interval')

        const speedMmMin = speed !== null ? Math.round(speed * 60) : null

        const noteParts: string[] = []
        if (descMatch && descMatch[1]) noteParts.push(descMatch[1])
        if (cutType && cutType !== 'Cut') noteParts.push(`Type: ${cutType}`)
        if (numPasses !== null && numPasses > 1) noteParts.push(`${numPasses} passes`)

        const frequencyHz = extractValue(cutContent, 'frequency')
        const scanAngle = extractValue(cutContent, 'scanAngle')

        let operationType: string | null = null
        if (cutType) {
          const typeMap: Record<string, string> = {
            Engrave: 'engrave',
            Mark: 'mark',
            Cut: 'cut',
            Score: 'score',
            Fill: 'fill',
            Outline: 'outline',
            Scan: 'engrave',
            Image: 'engrave',
          }
          operationType = typeMap[cutType] || cutType.toLowerCase()
        }

        entries.push({
          material: materialName,
          thickness_mm: thickness,
          power_pct: maxPower,
          speed_mm_min: speedMmMin,
          line_interval_mm: interval,
          notes: noteParts.length > 0 ? noteParts.join(' | ') : null,
          cut_type: cutType,
          num_passes: numPasses !== null ? Math.round(numPasses) : null,
          min_power_pct: minPower,
          frequency_hz: frequencyHz !== null ? Math.round(frequencyHz) : null,
          operation_type: operationType,
          cross_hatch: null,
          scan_angle_degrees: scanAngle,
        })
      }
    }
  }

  return entries
}

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

// ---- Tests ----

describe('parseClbXml', () => {
  describe('Valid .clb XML parsing', () => {
    it('parses a simple single-material .clb file', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      expect(entries).toHaveLength(1)
      expect(entries[0].material).toBe('Stainless Steel')
      expect(entries[0].thickness_mm).toBe(3.0)
      expect(entries[0].power_pct).toBe(80)
      expect(entries[0].min_power_pct).toBe(15)
      expect(entries[0].num_passes).toBe(1)
      expect(entries[0].cut_type).toBe('Cut')
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
  })

  describe('CutSetting types', () => {
    it('maps "Cut" type to operation_type "cut"', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      expect(entries[0].operation_type).toBe('cut')
    })

    it('maps "Scan" type to operation_type "engrave"', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry).toBeDefined()
      expect(scanEntry!.operation_type).toBe('engrave')
    })

    it('maps "Image" type to operation_type "engrave"', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const imageEntry = entries.find((e) => e.cut_type === 'Image')
      expect(imageEntry).toBeDefined()
      expect(imageEntry!.operation_type).toBe('engrave')
    })

    it('adds type to notes for non-Cut types', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry!.notes).toContain('Type: Scan')
    })

    it('does not add type to notes for plain "Cut" type', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      expect(entries[0].notes).not.toContain('Type: Cut')
    })
  })

  describe('Speed conversion (mm/s to mm/min)', () => {
    it('converts speed from mm/s to mm/min correctly', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      // 58.33 mm/s * 60 = 3499.8 -> rounds to 3500
      expect(entries[0].speed_mm_min).toBe(3500)
    })

    it('converts various speeds correctly', () => {
      const entries = parseClbXml(VALID_CLB_MULTIPLE_MATERIALS)
      // 58.33 * 60 = 3500
      expect(entries[0].speed_mm_min).toBe(3500)
      // 33.33 * 60 = 2000
      expect(entries[1].speed_mm_min).toBe(2000)
      // 41.67 * 60 = 2500
      expect(entries[2].speed_mm_min).toBe(2500)
    })

    it('handles null speed (missing tag)', () => {
      const xml = `<?xml version="1.0"?>
<LightBurnLibrary DisplayName="T">
  <Material name="Test">
    <Entry Thickness="1.0" Desc="" NoThickTitle="">
      <CutSetting type="Cut">
        <maxPower Value="50"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`
      const entries = parseClbXml(xml)
      expect(entries[0].speed_mm_min).toBeNull()
    })
  })

  describe('Engraving parameters', () => {
    it('extracts frequency_hz from Scan entries', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry!.frequency_hz).toBe(80000)
    })

    it('extracts scan_angle_degrees', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry!.scan_angle_degrees).toBe(45)
    })

    it('extracts line_interval_mm', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry!.line_interval_mm).toBe(0.06)
    })

    it('adds multi-pass info to notes', () => {
      const entries = parseClbXml(VALID_CLB_ENGRAVING)
      const scanEntry = entries.find((e) => e.cut_type === 'Scan')
      expect(scanEntry!.notes).toContain('3 passes')
      expect(scanEntry!.num_passes).toBe(3)
    })

    it('does not add passes to notes when numPasses is 1', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      // numPasses = 1, should not appear in notes
      expect(entries[0].notes).not.toContain('pass')
    })
  })

  describe('Thickness handling', () => {
    it('handles negative thickness (-1.0) as null', () => {
      const entries = parseClbXml(VALID_CLB_NEGATIVE_THICKNESS)
      expect(entries[0].thickness_mm).toBeNull()
    })

    it('parses positive thickness correctly', () => {
      const entries = parseClbXml(VALID_CLB_SIMPLE)
      expect(entries[0].thickness_mm).toBe(3.0)
    })

    it('handles zero thickness as null', () => {
      const xml = `<?xml version="1.0"?>
<LightBurnLibrary DisplayName="T">
  <Material name="Test">
    <Entry Thickness="0" Desc="" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="10"/>
        <maxPower Value="50"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`
      const entries = parseClbXml(xml)
      expect(entries[0].thickness_mm).toBeNull()
    })
  })

  describe('Error handling', () => {
    it('returns empty array for non-XML content', () => {
      const entries = parseClbXml('This is not XML at all')
      expect(entries).toHaveLength(0)
    })

    it('returns empty array for empty string', () => {
      const entries = parseClbXml('')
      expect(entries).toHaveLength(0)
    })

    it('returns empty array for XML without LightBurn structure', () => {
      const xml = `<?xml version="1.0"?><root><item>data</item></root>`
      const entries = parseClbXml(xml)
      expect(entries).toHaveLength(0)
    })

    it('handles Material with no entries', () => {
      const xml = `<?xml version="1.0"?>
<LightBurnLibrary DisplayName="T">
  <Material name="EmptyMaterial">
  </Material>
</LightBurnLibrary>`
      const entries = parseClbXml(xml)
      expect(entries).toHaveLength(0)
    })

    it('handles Entry with no CutSetting', () => {
      const xml = `<?xml version="1.0"?>
<LightBurnLibrary DisplayName="T">
  <Material name="Test">
    <Entry Thickness="3.0" Desc="Empty" NoThickTitle="">
    </Entry>
  </Material>
</LightBurnLibrary>`
      const entries = parseClbXml(xml)
      expect(entries).toHaveLength(0)
    })

    it('handles malformed numeric values gracefully', () => {
      const xml = `<?xml version="1.0"?>
<LightBurnLibrary DisplayName="T">
  <Material name="Test">
    <Entry Thickness="abc" Desc="" NoThickTitle="">
      <CutSetting type="Cut">
        <speed Value="not_a_number"/>
        <maxPower Value="80"/>
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>`
      const entries = parseClbXml(xml)
      expect(entries).toHaveLength(1)
      expect(entries[0].thickness_mm).toBeNull()
      expect(entries[0].speed_mm_min).toBeNull()
      expect(entries[0].power_pct).toBe(80)
    })
  })

  describe('extractValue helper', () => {
    it('extracts numeric value from a tag', () => {
      const content = '<speed Value="58.33"/>'
      expect(extractValue(content, 'speed')).toBeCloseTo(58.33)
    })

    it('returns null for missing tag', () => {
      const content = '<speed Value="58.33"/>'
      expect(extractValue(content, 'maxPower')).toBeNull()
    })

    it('returns null for non-numeric value', () => {
      const content = '<speed Value="abc"/>'
      expect(extractValue(content, 'speed')).toBeNull()
    })

    it('is case-insensitive for tag names', () => {
      const content = '<MaxPower Value="80"/>'
      expect(extractValue(content, 'maxPower')).toBe(80)
    })

    it('handles zero values', () => {
      const content = '<minPower Value="0"/>'
      expect(extractValue(content, 'minPower')).toBe(0)
    })

    it('handles negative values', () => {
      const content = '<offset Value="-1.5"/>'
      expect(extractValue(content, 'offset')).toBe(-1.5)
    })
  })
})

describe('File extension validation', () => {
  // This tests the logic from the API route - file extension check
  function isValidExtension(filename: string): boolean {
    const lowerName = filename.toLowerCase()
    return lowerName.endsWith('.clb') || lowerName.endsWith('.xml')
  }

  it('accepts .clb extension', () => {
    expect(isValidExtension('library.clb')).toBe(true)
  })

  it('accepts .CLB extension (case-insensitive)', () => {
    expect(isValidExtension('LIBRARY.CLB')).toBe(true)
  })

  it('accepts .Clb mixed case', () => {
    expect(isValidExtension('MyFile.Clb')).toBe(true)
  })

  it('accepts .xml extension', () => {
    expect(isValidExtension('export.xml')).toBe(true)
  })

  it('accepts .XML extension', () => {
    expect(isValidExtension('EXPORT.XML')).toBe(true)
  })

  it('rejects .txt files', () => {
    expect(isValidExtension('notes.txt')).toBe(false)
  })

  it('rejects .json files', () => {
    expect(isValidExtension('config.json')).toBe(false)
  })

  it('rejects files with no extension', () => {
    expect(isValidExtension('library')).toBe(false)
  })

  it('rejects .clb in middle of filename', () => {
    expect(isValidExtension('my.clb.backup')).toBe(false)
  })
})
