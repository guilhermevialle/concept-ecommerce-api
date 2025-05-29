import { nanoid } from 'nanoid'

export class IDService {
  static isValid(id: string) {
    return id.trim().length === 21
  }

  static generate(): string {
    return nanoid(21)
  }
}

IDService.generate()
