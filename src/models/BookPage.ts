import { Book } from '../generated/prisma/client'

export interface BookPage {
  count: number
  books: Book[]
}
