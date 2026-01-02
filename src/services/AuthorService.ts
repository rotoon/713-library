import * as authorRepo from '../repositories/AuthorRepository'

export const getAllAuthors = () => {
  return authorRepo.findAllAuthors()
}

export const getAuthorById = async (id: number) => {
  const author = await authorRepo.findAuthorById(id)
  if (!author) {
    throw new Error('ไม่พบผู้แต่ง')
  }
  return author
}

export const createAuthor = (data: {
  firstName: string
  lastName: string
  affiliation: string
}) => {
  return authorRepo.createAuthor(data)
}

export const updateAuthor = (
  id: number,
  data: { firstName?: string; lastName?: string; affiliation?: string }
) => {
  return authorRepo.updateAuthor(id, data)
}

export const deleteAuthor = (id: number) => {
  return authorRepo.deleteAuthor(id)
}
