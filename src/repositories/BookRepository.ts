import { prisma } from '../lib/prisma'
import { BookPage } from '../models/BookPage'

export const findAllBooksWithPagination = async (
  pageSize: number,
  pageNo: number
) => {
  const books = await prisma.book.findMany({
    include: { author: true },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })
  const count = await prisma.book.count()
  return { books, count } as unknown as BookPage
}

export const findBookById = (id: number) => {
  return prisma.book.findUnique({
    where: { id },
    include: { author: true },
  })
}

export const findBooksByTitleWithPagination = async (
  title: string,
  pageSize: number,
  pageNo: number
) => {
  const books = await prisma.book.findMany({
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    include: { author: true },
  })
  const count = await prisma.book.count({
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    },
  })
  return { books, count } as unknown as BookPage
}

export const createBook = (data: {
  title: string
  isbn: string
  category: string
  authorId: number
}) => {
  return prisma.book.create({
    data,
    include: { author: true },
  })
}

export const updateBook = (
  id: number,
  data: { title?: string; isbn?: string; category?: string; authorId?: number }
) => {
  return prisma.book.update({
    where: { id },
    data,
    include: { author: true },
  })
}

export const deleteBook = (id: number) => {
  return prisma.book.delete({
    where: { id },
  })
}

export const countBooks = () => {
  return prisma.book.count()
}

// ค้นหาหนังสือด้วย keyword (ชื่อหนังสือ, หมวดหมู่, ผู้แต่ง, ผู้ยืม)
export const searchByKeywordWithPagination = async (
  keyword: string,
  pageSize: number,
  pageNo: number
) => {
  const whereCondition = {
    OR: [
      // ค้นหาจากชื่อหนังสือ
      { title: { contains: keyword, mode: 'insensitive' as const } },
      // ค้นหาจากหมวดหมู่
      { category: { contains: keyword, mode: 'insensitive' as const } },
      // ค้นหาจากชื่อผู้แต่ง
      {
        author: {
          OR: [
            { firstName: { contains: keyword, mode: 'insensitive' as const } },
            { lastName: { contains: keyword, mode: 'insensitive' as const } },
          ],
        },
      },
      // ค้นหาจากชื่อผู้ยืม
      {
        borrowItems: {
          some: {
            borrowRecord: {
              member: {
                OR: [
                  {
                    firstName: {
                      contains: keyword,
                      mode: 'insensitive' as const,
                    },
                  },
                  {
                    lastName: {
                      contains: keyword,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ],
  }

  const books = await prisma.book.findMany({
    where: whereCondition,
    take: pageSize,
    skip: pageSize * (pageNo - 1),
    include: {
      author: true,
      borrowItems: {
        include: {
          borrowRecord: {
            include: {
              member: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1, // แสดงผู้ยืมล่าสุด
      },
    },
  })

  const count = await prisma.book.count({ where: whereCondition })

  // จัดรูปแบบข้อมูลให้เหมาะสม
  const formattedBooks = books.map((book) => ({
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    category: book.category,
    author: {
      id: book.author.id,
      firstName: book.author.firstName,
      lastName: book.author.lastName,
      fullName: `${book.author.firstName} ${book.author.lastName}`,
    },
    lastBorrower: book.borrowItems[0]
      ? {
          id: book.borrowItems[0].borrowRecord.member.id,
          firstName: book.borrowItems[0].borrowRecord.member.firstName,
          lastName: book.borrowItems[0].borrowRecord.member.lastName,
          fullName: `${book.borrowItems[0].borrowRecord.member.firstName} ${book.borrowItems[0].borrowRecord.member.lastName}`,
          borrowDate: book.borrowItems[0].borrowRecord.borrowDate,
        }
      : null,
  }))

  return { books: formattedBooks, count }
}
