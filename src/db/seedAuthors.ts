import { prisma } from '../lib/prisma'

export async function seedAuthors() {
  const authors = await Promise.all([
    prisma.author.create({
      data: {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        affiliation: 'มหาวิทยาลัยเชียงใหม่',
      },
    }),
    prisma.author.create({
      data: {
        firstName: 'สมหญิง',
        lastName: 'รักเรียน',
        affiliation: 'จุฬาลงกรณ์มหาวิทยาลัย',
      },
    }),
    prisma.author.create({
      data: {
        firstName: 'มานะ',
        lastName: 'สุขสันต์',
        affiliation: 'มหาวิทยาลัยธรรมศาสตร์',
      },
    }),
  ])

  console.log(`✅ สร้างผู้แต่ง ${authors.length} คน`)
  return authors
}
