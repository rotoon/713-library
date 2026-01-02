import { prisma } from '../lib/prisma'

export const findAllAuthors = (pageSize: number, pageNo: number) => {
  return prisma.author.findMany({
    include: { books: true },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })
}

export const findAuthorById = (id: number) => {
  return prisma.author.findUnique({
    where: { id },
    include: { books: true },
  })
}

export const createAuthor = (data: {
  firstName: string
  lastName: string
  affiliation: string
}) => {
  return prisma.author.create({
    data,
    include: { books: true },
  })
}

export const updateAuthor = (
  id: number,
  data: { firstName?: string; lastName?: string; affiliation?: string }
) => {
  return prisma.author.update({
    where: { id },
    data,
    include: { books: true },
  })
}

export const deleteAuthor = (id: number) => {
  return prisma.author.delete({
    where: { id },
  })
}

export const countAuthors = () => {
  return prisma.author.count()
}
