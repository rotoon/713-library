import { prisma } from '../lib/prisma'

export const findAllBorrowRecords = (pageSize: number, pageNo: number) => {
  return prisma.borrowRecord.findMany({
    include: {
      member: true,
      borrowItems: {
        include: { book: true },
      },
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })
}

export const findBorrowRecordById = (id: number) => {
  return prisma.borrowRecord.findUnique({
    where: { id },
    include: {
      member: true,
      borrowItems: {
        include: { book: true },
      },
    },
  })
}

export const findBorrowItemsByDueDate = (
  date: Date,
  pageSize: number,
  pageNo: number
) => {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)

  return prisma.borrowItem.findMany({
    where: {
      dueDate: {
        gte: date,
        lt: nextDay,
      },
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    include: {
      book: { include: { author: true } },
      borrowRecord: { include: { member: true } },
    },
  })
}

export const findUnreturnedBooks = (pageSize: number, pageNo: number) => {
  return prisma.borrowItem.findMany({
    where: {
      returnedAt: null,
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    include: {
      book: { include: { author: true } },
      borrowRecord: { include: { member: true } },
    },
  })
}

export const findOverdueBooks = (pageSize: number, pageNo: number) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.borrowItem.findMany({
    where: {
      returnedAt: null,
      dueDate: { lt: today },
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    include: {
      book: { include: { author: true } },
      borrowRecord: { include: { member: true } },
    },
  })
}

export const createBorrowRecord = (
  memberId: number,
  items: { bookId: number; dueDate: Date }[]
) => {
  return prisma.borrowRecord.create({
    data: {
      memberId,
      borrowItems: {
        create: items.map((item) => ({
          bookId: item.bookId,
          dueDate: item.dueDate,
        })),
      },
    },
    include: {
      member: true,
      borrowItems: {
        include: { book: true },
      },
    },
  })
}

export const returnBook = (borrowItemId: number) => {
  return prisma.borrowItem.update({
    where: { id: borrowItemId },
    data: { returnedAt: new Date() },
    include: {
      book: true,
      borrowRecord: { include: { member: true } },
    },
  })
}

export const countBorrowItems = () => {
  return prisma.borrowItem.count()
}
