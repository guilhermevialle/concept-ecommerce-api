import { Product } from '@/domain/entities/product'

export interface IProductRepository {
  save(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  update(product: Product): Promise<void>
  clear(): Promise<void>
}
