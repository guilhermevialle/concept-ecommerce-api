import { describe, expect, it } from 'vitest'
import { Customer } from './customer'

describe('Customer Entity', () => {
  it('should create valid customer with default values (id)', () => {
    const customer = Customer.create({
      username: 'John Doe'
    })

    expect(customer.id).toBeDefined()
    expect(customer.createdAt).toBeDefined()
  })

  // username validations
  it("should throw if username isn't provided", () => {
    expect(() => Customer.create({} as any)).toThrow()
  })

  it('should throw if username is less than 3 characters', () => {
    expect(() => Customer.create({ username: 'Jo' } as any)).toThrow()
  })

  it('should throw if username is more than 64 characters', () => {
    expect(() => Customer.create({ username: 'a'.repeat(65) } as any)).toThrow()
  })
})
