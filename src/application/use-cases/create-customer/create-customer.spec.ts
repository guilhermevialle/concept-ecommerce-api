import { ICustomerRepository } from '@/interfaces/repositories/customer.interface'
import { makeDependencies } from '@/tests/helpers/make-dependencies'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateCustomer } from './create-customer'

describe('CreateCustomer Use Case', () => {
  let customerRepo: ICustomerRepository
  let useCase: CreateCustomer

  beforeEach(() => {
    customerRepo = makeDependencies().customerRepo
    useCase = new CreateCustomer(customerRepo)
  })

  it('should be able to create a customer', async () => {
    const customer = await useCase.execute({
      username: 'test',
      email: 'm5oCt@example.com'
    })

    expect(customer).toBeTruthy()
  })

  it('should throw if customer with same username already exists', async () => {
    await useCase.execute({
      username: 'test',
      email: 'm5oCt@example.com'
    })

    await expect(() =>
      useCase.execute({
        username: 'test',
        email: 'm5oCt@example.com'
      })
    ).rejects.toThrow()
  })

  it('should throw if customer with same email already exists', async () => {
    await useCase.execute({
      username: 'test',
      email: 'm5oCt@example.com'
    })

    await expect(() =>
      useCase.execute({
        username: 'test2',
        email: 'm5oCt@example.com'
      })
    ).rejects.toThrow()
  })
})
