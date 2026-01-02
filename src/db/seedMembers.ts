import { prisma } from '../lib/prisma'

export async function seedMembers() {
  const members = await Promise.all([
    prisma.member.create({
      data: {
        memberCode: 'MEM001',
        firstName: 'วิชัย',
        lastName: 'ดีมาก',
        phone: '081-234-5678',
      },
    }),
    prisma.member.create({
      data: {
        memberCode: 'MEM002',
        firstName: 'สุดา',
        lastName: 'งามเลิศ',
        phone: '089-876-5432',
      },
    }),
    prisma.member.create({
      data: {
        memberCode: 'MEM003',
        firstName: 'ปิยะ',
        lastName: 'มั่นคง',
        phone: '062-111-2222',
      },
    }),
  ])

  console.log(`✅ สร้างสมาชิก ${members.length} คน`)
  return members
}
