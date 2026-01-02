import { prisma } from '../lib/prisma'

export const findAllBooks = () => {
  return prisma.book.findMany({
    include: { author: true },
  })
}

export const findBookById = (id: number) => {
  return prisma.book.findUnique({
    where: { id },
    include: { author: true },
  })
}

export const findBooksByTitle = (title: string) => {
  return prisma.book.findMany({
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    },
    include: { author: true },
  })
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
