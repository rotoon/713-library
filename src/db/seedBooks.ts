import { prisma } from '../lib/prisma'
import { Author } from '../generated/prisma/client'

export async function seedBooks(authors: Author[]) {
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'เรียนรู้ TypeScript ใน 7 วัน',
        isbn: '978-616-001-001-1',
        category: 'เทคโนโลยี',
        authorId: authors[0].id,
      },
    }),
    prisma.book.create({
      data: {
        title: 'Node.js สำหรับมือใหม่',
        isbn: '978-616-001-002-2',
        category: 'เทคโนโลยี',
        authorId: authors[0].id,
      },
    }),
    prisma.book.create({
      data: {
        title: 'ศิลปะการบริหารเวลา',
        isbn: '978-616-002-001-1',
        category: 'พัฒนาตนเอง',
        authorId: authors[1].id,
      },
    }),
    prisma.book.create({
      data: {
        title: 'คิดบวก ชีวิตเปลี่ยน',
        isbn: '978-616-002-002-2',
        category: 'พัฒนาตนเอง',
        authorId: authors[1].id,
      },
    }),
    prisma.book.create({
      data: {
        title: 'ประวัติศาสตร์ไทยร่วมสมัย',
        isbn: '978-616-003-001-1',
        category: 'ประวัติศาสตร์',
        authorId: authors[2].id,
      },
    }),
  ])

  console.log(`✅ สร้างหนังสือ ${books.length} เล่ม`)
  return books
}
