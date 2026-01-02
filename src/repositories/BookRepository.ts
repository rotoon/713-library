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
