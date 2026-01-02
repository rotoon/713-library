import { Member } from '../generated/prisma/client'

export interface MemberPage {
  count: number
  members: Member[]
}
