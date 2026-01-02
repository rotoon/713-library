import { prisma } from '../lib/prisma'

export const findAllMembers = (pageSize: number, pageNo: number) => {
  return prisma.member.findMany({
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })
}

export const findMemberById = (id: number) => {
  return prisma.member.findUnique({
    where: { id },
    include: {
      borrowRecords: {
        include: {
          borrowItems: {
            include: { book: true },
          },
        },
      },
    },
  })
}

export const findMemberByCode = (memberCode: string) => {
  return prisma.member.findUnique({
    where: { memberCode },
    include: {
      borrowRecords: {
        include: {
          borrowItems: {
            include: { book: true },
          },
        },
      },
    },
  })
}

export const findMembersByName = (
  name: string,
  pageSize: number,
  pageNo: number
) => {
  return prisma.member.findMany({
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    where: {
      OR: [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ],
    },
  })
}

export const createMember = (data: {
  memberCode: string
  firstName: string
  lastName: string
  phone: string
}) => {
  return prisma.member.create({ data })
}

export const updateMember = (
  id: number,
  data: {
    memberCode?: string
    firstName?: string
    lastName?: string
    phone?: string
  }
) => {
  return prisma.member.update({
    where: { id },
    data,
  })
}

export const deleteMember = (id: number) => {
  return prisma.member.delete({
    where: { id },
  })
}

export const countMembers = () => {
  return prisma.member.count()
}
