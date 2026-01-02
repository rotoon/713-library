import { prisma } from '../src/lib/prisma'
import {
  seedAuthors,
  seedBooks,
  seedMembers,
  seedBorrowRecords,
} from '../src/db'

async function main() {
  console.log('🌱 เริ่มสร้าง seed data...')

  // ลบข้อมูลเดิมก่อน (เรียงตาม dependency)
  await prisma.borrowItem.deleteMany()
  await prisma.borrowRecord.deleteMany()
  await prisma.book.deleteMany()
  await prisma.author.deleteMany()
  await prisma.member.deleteMany()

  // สร้างข้อมูล
  const authors = await seedAuthors()
  const books = await seedBooks(authors)
  const members = await seedMembers()
  await seedBorrowRecords(members, books)

  console.log('🎉 สร้าง seed data เสร็จสมบูรณ์!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
