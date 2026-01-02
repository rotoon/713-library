import { prisma } from '../lib/prisma'

import { AutherPage } from '../models/AutherPage'

export const findAllAuthorsWithPagination = (
  pageSize: number,
  pageNo: number
) => {
  const authors = prisma.author.findMany({
    include: { books: true },
    take: pageSize,
    skip: pageSize * (pageNo - 1),
  })
  const count = prisma.author.count()
  return { authors, count } as unknown as AutherPage
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
