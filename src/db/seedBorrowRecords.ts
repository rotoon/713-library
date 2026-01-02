import { Member, Book } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'

export async function seedBorrowRecords(members: Member[], books: Book[]) {
  // รายการที่ 1 - วิชัย ยืม 2 เล่ม
  await prisma.borrowRecord.create({
    data: {
      memberId: members[0].id,
      borrowDate: new Date('2025-12-20'),
      borrowItems: {
        create: [
          {
            bookId: books[0].id,
            dueDate: new Date('2026-01-03'),
            returnedAt: new Date('2026-01-02'), // คืนแล้ว
          },
          {
            bookId: books[2].id,
            dueDate: new Date('2026-01-03'),
            returnedAt: null, // ยังไม่คืน
          },
        ],
      },
    },
  })

  // รายการที่ 2 - สุดา ยืม 3 เล่ม
  await prisma.borrowRecord.create({
    data: {
      memberId: members[1].id,
      borrowDate: new Date('2025-12-25'),
      borrowItems: {
        create: [
          {
            bookId: books[1].id,
            dueDate: new Date('2026-01-08'),
            returnedAt: null, // ยังไม่คืน
          },
          {
            bookId: books[3].id,
            dueDate: new Date('2026-01-08'),
            returnedAt: null, // ยังไม่คืน
          },
          {
            bookId: books[4].id,
            dueDate: new Date('2026-01-08'),
            returnedAt: new Date('2026-01-01'), // คืนแล้ว
          },
        ],
      },
    },
  })

  console.log(`✅ สร้างประวัติการยืม 2 รายการ`)
}
