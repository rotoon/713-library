import { Author } from '../generated/prisma/client'

export interface AutherPage {
  count: number
  authors: Author[]
}
