import { Product } from '@/domain/entities/product'
import { IProductRepository } from '@/interfaces/repositories/product'

export class MemoryProductRepository implements IProductRepository {
  private storage: Product[] = []

  async save(product: Product): Promise<void> {
    this.storage.push(product)
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.storage.find((product) => product.id === id)
    return product ?? null
  }

  async update(product: Product): Promise<void> {
    const index = this.storage.findIndex((product) => product.id === product.id)
    this.storage[index] = product
  }

  async clear(): Promise<void> {
    this.storage = []
  }
}
