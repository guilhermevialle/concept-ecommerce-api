import { describe, expect, it } from 'vitest'
import { IDService } from './id.service'

describe('ID Service', () => {
  it('should generate a valid id', () => {
    const id = IDService.generate()
    expect(id).toBeDefined()
    expect(id).toHaveLength(21)
  })

  it('should validate a valid id', () => {
    const id = IDService.generate()
    expect(IDService.isValid(id)).toBe(true)
  })

  it('should not validate an invalid id', () => {
    const id = 'invalid-id'
    expect(IDService.isValid(id)).toBe(false)
  })
})
