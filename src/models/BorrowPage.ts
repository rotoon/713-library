import { BorrowItem } from '../generated/prisma/client'

export interface BorrowPage {
  count: number
  borrowItems: BorrowItem[]
}
