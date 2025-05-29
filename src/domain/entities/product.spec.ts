import { toCents } from '@/shared/utils/to-cents'
import { beforeEach, describe, expect, it } from 'vitest'
import { Product } from './product'

const props = {
  title: 'iPhone X',
  summary:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  priceInCents: toCents(999.9),
  currency: 'USD',
  stockQuantity: 99
}

describe('Product Entity', () => {
  let product: Product

  beforeEach(() => {
    product = Product.create({ ...props })
  })

  it('should create a new Product', () => {
    expect(product).toBeInstanceOf(Product)
    expect(product.toJSON()).toStrictEqual({
      id: expect.any(String),
      ...props
    })
  })

  it('should throw an error if is missing props to create', () => {
    expect(() => Product.create({} as any)).toThrow()
  })

  it('should throw if is missing props to restore', () => {
    expect(() => Product.restore({} as any)).toThrow()
  })

  it("should return false if the product isn't available", () => {
    product.updateStockQuantity(0)
    expect(product.isAvailable()).toBe(false)
  })

  it('should return true if the product is available', () => {
    expect(product.isAvailable()).toBe(true)
  })

  it('should update the product price in cents', () => {
    product.updatePrice(toCents(999.9))
    expect(product.priceInCents).toBe(toCents(999.9))
  })
})
