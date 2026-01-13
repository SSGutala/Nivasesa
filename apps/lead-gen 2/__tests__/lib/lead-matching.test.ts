import { describe, it, expect } from 'vitest'
import {
  isLocationMatch,
  isLanguageMatch,
  getMatchQuality,
  calculateLeadPriority,
  MatchQuality,
  LeadPriority,
  getWorkloadCategory,
  normalizeLanguage,
  parseLanguages,
  findCommonLanguages,
} from '@/lib/lead-matching'

describe('lead-matching utilities', () => {
  describe('isLocationMatch', () => {
    it('should match when city is in realtor cities', () => {
      const lead = { city: 'Frisco' }
      const realtor = { cities: 'Frisco, Plano, Irving' }
      expect(isLocationMatch(lead, realtor)).toBe(true)
    })

    it('should match with partial city name', () => {
      const lead = { city: 'Dallas' }
      const realtor = { cities: 'Dallas, Fort Worth' }
      expect(isLocationMatch(lead, realtor)).toBe(true)
    })

    it('should not match when city is not in realtor cities', () => {
      const lead = { city: 'Seattle' }
      const realtor = { cities: 'Dallas, Frisco' }
      expect(isLocationMatch(lead, realtor)).toBe(false)
    })

    it('should be case-insensitive', () => {
      const lead = { city: 'FRISCO' }
      const realtor = { cities: 'frisco, plano' }
      expect(isLocationMatch(lead, realtor)).toBe(true)
    })

    it('should return false when lead has no city', () => {
      const lead = {}
      const realtor = { cities: 'Frisco, Plano' }
      expect(isLocationMatch(lead, realtor)).toBe(false)
    })

    it('should return false when realtor has no cities', () => {
      const lead = { city: 'Frisco' }
      const realtor = {}
      expect(isLocationMatch(lead, realtor)).toBe(false)
    })
  })

  describe('isLanguageMatch', () => {
    it('should match when language is in realtor languages', () => {
      const lead = { languagePreference: 'Hindi' }
      const realtor = { languages: 'Hindi, Telugu, English' }
      expect(isLanguageMatch(lead, realtor)).toBe(true)
    })

    it('should not match when language is not found', () => {
      const lead = { languagePreference: 'Spanish' }
      const realtor = { languages: 'Hindi, Telugu, English' }
      expect(isLanguageMatch(lead, realtor)).toBe(false)
    })

    it('should return false when lead has no language preference', () => {
      const lead = {}
      const realtor = { languages: 'Hindi, Telugu' }
      expect(isLanguageMatch(lead, realtor)).toBe(false)
    })

    it('should be case-insensitive', () => {
      const lead = { languagePreference: 'HINDI' }
      const realtor = { languages: 'hindi, telugu' }
      expect(isLanguageMatch(lead, realtor)).toBe(true)
    })
  })

  describe('getMatchQuality', () => {
    it('should return EXCELLENT for scores >= 80', () => {
      expect(getMatchQuality(80)).toBe(MatchQuality.EXCELLENT)
      expect(getMatchQuality(95)).toBe(MatchQuality.EXCELLENT)
    })

    it('should return GOOD for scores >= 60 and < 80', () => {
      expect(getMatchQuality(60)).toBe(MatchQuality.GOOD)
      expect(getMatchQuality(79)).toBe(MatchQuality.GOOD)
    })

    it('should return FAIR for scores >= 40 and < 60', () => {
      expect(getMatchQuality(40)).toBe(MatchQuality.FAIR)
      expect(getMatchQuality(59)).toBe(MatchQuality.FAIR)
    })

    it('should return POOR for scores < 40', () => {
      expect(getMatchQuality(39)).toBe(MatchQuality.POOR)
      expect(getMatchQuality(0)).toBe(MatchQuality.POOR)
    })
  })

  describe('calculateLeadPriority', () => {
    it('should return HIGH for excellent match with ASAP timeline', () => {
      const lead = { timeline: 'ASAP', buyerEmail: 'test@example.com' }
      expect(calculateLeadPriority(85, lead)).toBe(LeadPriority.HIGH)
    })

    it('should return MEDIUM for good match', () => {
      const lead = { timeline: '3-6 months' }
      expect(calculateLeadPriority(70, lead)).toBe(LeadPriority.MEDIUM)
    })

    it('should return LOW for fair match', () => {
      const lead = { timeline: '6+ months' }
      expect(calculateLeadPriority(45, lead)).toBe(LeadPriority.LOW)
    })
  })

  describe('getWorkloadCategory', () => {
    it('should return Available for 0 leads', () => {
      expect(getWorkloadCategory(0)).toBe('Available')
    })

    it('should return Light Load for 1-5 leads', () => {
      expect(getWorkloadCategory(3)).toBe('Light Load')
    })

    it('should return At Capacity for > 30 leads', () => {
      expect(getWorkloadCategory(35)).toBe('At Capacity')
    })
  })

  describe('normalizeLanguage', () => {
    it('should normalize known languages', () => {
      expect(normalizeLanguage('Hindi')).toBe('hindi')
      expect(normalizeLanguage('TAMIL')).toBe('tamil')
    })

    it('should handle unknown languages', () => {
      expect(normalizeLanguage('French')).toBe('french')
    })
  })

  describe('parseLanguages', () => {
    it('should parse comma-separated languages', () => {
      const result = parseLanguages('Hindi, Telugu, English')
      expect(result).toHaveLength(3)
      expect(result).toContain('hindi')
      expect(result).toContain('telugu')
      expect(result).toContain('english')
    })

    it('should return empty array for empty string', () => {
      expect(parseLanguages('')).toEqual([])
    })
  })

  describe('findCommonLanguages', () => {
    it('should find common languages', () => {
      const common = findCommonLanguages('Hindi, English', 'Hindi, Telugu, English')
      expect(common).toHaveLength(2)
      expect(common).toContain('hindi')
      expect(common).toContain('english')
    })

    it('should return empty array when no common languages', () => {
      const common = findCommonLanguages('Spanish, French', 'Hindi, Telugu')
      expect(common).toHaveLength(0)
    })
  })
})
