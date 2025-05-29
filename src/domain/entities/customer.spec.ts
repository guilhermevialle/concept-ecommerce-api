import { describe, expect, it } from 'vitest'
import { Customer } from './customer'

describe('Customer Entity', () => {
  it('should create valid customer with default values (id, createdAt)', () => {
    const customer = Customer.create({
      username: 'John Doe',
      balanceInCents: 1000
    })

    expect(customer.toJSON()).toStrictEqual({
      id: expect.any(String),
      username: 'John Doe',
      balanceInCents: 1000,
      createdAt: expect.any(Date)
    })
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

  // balance validations
  it('should throw if balance is less than 0', () => {
    expect(() =>
      Customer.create({ username: 'John Doe', balanceInCents: -1 } as any)
    ).toThrow()
  })

  it('should throw if balance is not a number', () => {
    expect(() =>
      Customer.create({
        username: 'John Doe',
        balanceInCents: 'invalid'
      } as any)
    ).toThrow()
  })

  it('should throw if balance is greater than 100_000_000', () => {
    expect(() =>
      Customer.create({
        username: 'John Doe',
        balanceInCents: 100_000_001
      } as any)
    ).toThrow()
  })
})
