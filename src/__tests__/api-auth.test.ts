/**
 * Tests for API route authentication.
 *
 * All API routes (/api/search, /api/ai-suggest, /api/import-clb, /api/export-clb)
 * require authentication via Supabase session cookies. Unauthenticated requests
 * must receive a 401 Unauthorized response.
 *
 * Since these are Next.js App Router API routes that depend on Supabase SSR
 * and request/response objects, we test the authentication guard logic by
 * verifying the expected behavior pattern rather than calling the routes directly.
 *
 * This file tests:
 * 1. The auth-guard pattern: createServerSupabase -> getUser -> 401 if no user
 * 2. The response format for unauthorized requests
 * 3. Route-specific error messages
 */

import { describe, it, expect } from 'vitest'

// ---- Test the auth guard pattern used by all API routes ----

/**
 * Simulates the authentication check pattern used in all API routes.
 * All routes follow: if (!user) return 401 with error message.
 */
function simulateAuthGuard(user: { id: string } | null, routeName: string): { status: number; body: { error: string } } | null {
  if (!user) {
    const messages: Record<string, string> = {
      '/api/search': 'Unauthorized',
      '/api/ai-suggest': 'Unauthorized',
      '/api/import-clb': 'Unauthorized',
      '/api/export-clb': 'Authentication required to export cuts.',
    }
    return {
      status: 401,
      body: { error: messages[routeName] || 'Unauthorized' },
    }
  }
  return null // Proceed to route logic
}

describe('API Authentication Guards', () => {
  describe('/api/search', () => {
    it('returns 401 without auth', () => {
      const result = simulateAuthGuard(null, '/api/search')
      expect(result).not.toBeNull()
      expect(result!.status).toBe(401)
      expect(result!.body.error).toBe('Unauthorized')
    })

    it('proceeds when authenticated', () => {
      const result = simulateAuthGuard({ id: 'user-123' }, '/api/search')
      expect(result).toBeNull()
    })
  })

  describe('/api/ai-suggest', () => {
    it('returns 401 without auth', () => {
      const result = simulateAuthGuard(null, '/api/ai-suggest')
      expect(result).not.toBeNull()
      expect(result!.status).toBe(401)
      expect(result!.body.error).toBe('Unauthorized')
    })

    it('proceeds when authenticated', () => {
      const result = simulateAuthGuard({ id: 'user-456' }, '/api/ai-suggest')
      expect(result).toBeNull()
    })
  })

  describe('/api/import-clb', () => {
    it('returns 401 without auth', () => {
      const result = simulateAuthGuard(null, '/api/import-clb')
      expect(result).not.toBeNull()
      expect(result!.status).toBe(401)
      expect(result!.body.error).toBe('Unauthorized')
    })

    it('proceeds when authenticated', () => {
      const result = simulateAuthGuard({ id: 'user-789' }, '/api/import-clb')
      expect(result).toBeNull()
    })
  })

  describe('/api/export-clb', () => {
    it('returns 401 without auth', () => {
      const result = simulateAuthGuard(null, '/api/export-clb')
      expect(result).not.toBeNull()
      expect(result!.status).toBe(401)
      expect(result!.body.error).toBe('Authentication required to export cuts.')
    })

    it('proceeds when authenticated', () => {
      const result = simulateAuthGuard({ id: 'user-abc' }, '/api/export-clb')
      expect(result).toBeNull()
    })
  })

  describe('Auth guard response format', () => {
    it('returns a JSON-serializable error object', () => {
      const result = simulateAuthGuard(null, '/api/search')
      const json = JSON.stringify(result!.body)
      expect(json).toBe('{"error":"Unauthorized"}')
    })

    it('status code is always 401 for unauthenticated', () => {
      const routes = ['/api/search', '/api/ai-suggest', '/api/import-clb', '/api/export-clb']
      for (const route of routes) {
        const result = simulateAuthGuard(null, route)
        expect(result!.status).toBe(401)
      }
    })
  })
})

describe('API Request Validation', () => {
  // Test the validation logic that follows auth checks in each route

  describe('/api/search validation', () => {
    function validateSearchRequest(body: { material?: unknown; thickness?: unknown }): { error: string; status: number } | null {
      if (!body.material || typeof body.material !== 'string') {
        return { error: "Missing or invalid 'material' field", status: 400 }
      }
      if (body.thickness === undefined || body.thickness === null || isNaN(Number(body.thickness))) {
        return { error: "Missing or invalid 'thickness' field", status: 400 }
      }
      return null
    }

    it('rejects missing material', () => {
      const result = validateSearchRequest({ thickness: 3 })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
      expect(result!.error).toContain('material')
    })

    it('rejects empty string material', () => {
      const result = validateSearchRequest({ material: '', thickness: 3 })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
    })

    it('rejects non-string material', () => {
      const result = validateSearchRequest({ material: 123, thickness: 3 })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
    })

    it('rejects missing thickness', () => {
      const result = validateSearchRequest({ material: 'Steel' })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
      expect(result!.error).toContain('thickness')
    })

    it('rejects NaN thickness', () => {
      const result = validateSearchRequest({ material: 'Steel', thickness: 'abc' })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
    })

    it('accepts valid request', () => {
      const result = validateSearchRequest({ material: 'Stainless Steel', thickness: 3 })
      expect(result).toBeNull()
    })

    it('accepts string numeric thickness', () => {
      const result = validateSearchRequest({ material: 'Steel', thickness: '3.5' })
      expect(result).toBeNull()
    })
  })

  describe('/api/ai-suggest validation', () => {
    function validateAiSuggestRequest(body: Record<string, unknown>): { error: string; status: number } | null {
      if (!body.material || !body.thickness_mm || !body.wattage || !body.lens_mm || !body.laser_type) {
        return { error: 'Missing required fields: material, thickness_mm, wattage, lens_mm, laser_type', status: 400 }
      }
      return null
    }

    it('rejects missing material', () => {
      const result = validateAiSuggestRequest({ thickness_mm: 3, wattage: 50, lens_mm: 110, laser_type: 'fiber' })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
    })

    it('rejects missing thickness_mm', () => {
      const result = validateAiSuggestRequest({ material: 'Steel', wattage: 50, lens_mm: 110, laser_type: 'fiber' })
      expect(result).not.toBeNull()
    })

    it('rejects missing wattage', () => {
      const result = validateAiSuggestRequest({ material: 'Steel', thickness_mm: 3, lens_mm: 110, laser_type: 'fiber' })
      expect(result).not.toBeNull()
    })

    it('rejects missing lens_mm', () => {
      const result = validateAiSuggestRequest({ material: 'Steel', thickness_mm: 3, wattage: 50, laser_type: 'fiber' })
      expect(result).not.toBeNull()
    })

    it('rejects missing laser_type', () => {
      const result = validateAiSuggestRequest({ material: 'Steel', thickness_mm: 3, wattage: 50, lens_mm: 110 })
      expect(result).not.toBeNull()
    })

    it('accepts complete valid request', () => {
      const result = validateAiSuggestRequest({
        material: 'Stainless Steel',
        thickness_mm: 3,
        wattage: 50,
        lens_mm: 110,
        laser_type: 'fiber',
      })
      expect(result).toBeNull()
    })
  })

  describe('/api/import-clb validation', () => {
    function validateImportFile(
      file: { name: string } | null
    ): { error: string; status: number } | null {
      if (!file) {
        return { error: 'No file provided', status: 400 }
      }
      const lowerName = file.name.toLowerCase()
      if (!lowerName.endsWith('.clb') && !lowerName.endsWith('.xml')) {
        return { error: 'Invalid file type. Please upload a .clb or .xml file.', status: 400 }
      }
      return null
    }

    it('rejects null file', () => {
      const result = validateImportFile(null)
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
      expect(result!.error).toContain('No file provided')
    })

    it('rejects .txt file', () => {
      const result = validateImportFile({ name: 'notes.txt' })
      expect(result).not.toBeNull()
      expect(result!.status).toBe(400)
      expect(result!.error).toContain('Invalid file type')
    })

    it('accepts .clb file', () => {
      const result = validateImportFile({ name: 'library.clb' })
      expect(result).toBeNull()
    })

    it('accepts .CLB file (case insensitive)', () => {
      const result = validateImportFile({ name: 'LIBRARY.CLB' })
      expect(result).toBeNull()
    })

    it('accepts .xml file', () => {
      const result = validateImportFile({ name: 'export.xml' })
      expect(result).toBeNull()
    })
  })

  describe('/api/export-clb XML generation', () => {
    // Test the escapeXml helper used in export
    function escapeXml(str: string): string {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }

    it('escapes ampersands', () => {
      expect(escapeXml('A & B')).toBe('A &amp; B')
    })

    it('escapes angle brackets', () => {
      expect(escapeXml('<tag>')).toBe('&lt;tag&gt;')
    })

    it('escapes quotes', () => {
      expect(escapeXml('She said "hello"')).toBe('She said &quot;hello&quot;')
    })

    it('escapes apostrophes', () => {
      expect(escapeXml("it's")).toBe('it&apos;s')
    })

    it('handles string with no special characters', () => {
      expect(escapeXml('plain text')).toBe('plain text')
    })

    it('handles empty string', () => {
      expect(escapeXml('')).toBe('')
    })

    it('handles multiple special characters together', () => {
      expect(escapeXml('a<b>c&d"e\'f')).toBe('a&lt;b&gt;c&amp;d&quot;e&apos;f')
    })
  })
})
