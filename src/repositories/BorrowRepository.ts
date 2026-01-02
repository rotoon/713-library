import { prisma } from '../lib/prisma'
import { BorrowPage } from '../models/BorrowPage'

export const findAllBorrowRecordsWithPagination = async (
  pageSize: number,
  pageNo: number
) => {
  const borrowItems = await prisma.borrowRecord.findMany({
    include: {
      member: true,
      borrowItems: {
        include: { book: true },
      },
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })

  const count = await prisma.borrowRecord.count()
  return { borrowItems, count } as unknown as BorrowPage
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

export const findBorrowItemsByDueDateWithPagination = async (
  date: Date,
  pageSize: number,
  pageNo: number
) => {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)

  const borrowItems = await prisma.borrowItem.findMany({
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

  const count = await prisma.borrowItem.count({
    where: {
      dueDate: {
        gte: date,
        lt: nextDay,
      },
    },
  })
  return { borrowItems, count } as unknown as BorrowPage
}

export const findUnreturnedBooksWithPagination = async (
  pageSize: number,
  pageNo: number
) => {
  const borrowItems = await prisma.borrowItem.findMany({
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

  const count = await prisma.borrowItem.count({
    where: {
      returnedAt: null,
    },
  })
  return { borrowItems, count } as unknown as BorrowPage
}

export const findOverdueBooksWithPagination = async (
  pageSize: number,
  pageNo: number
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const borrowItems = await prisma.borrowItem.findMany({
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

  const count = await prisma.borrowItem.count({
    where: {
      returnedAt: null,
      dueDate: { lt: today },
    },
  })
  return { borrowItems, count } as unknown as BorrowPage
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
