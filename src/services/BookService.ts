import * as bookRepo from '../repositories/BookRepository'

export const getAllBooks = () => {
  return bookRepo.findAllBooks()
}

export const getBookById = async (id: number) => {
  const book = await bookRepo.findBookById(id)
  if (!book) {
    throw new Error('ไม่พบหนังสือ')
  }
  return book
}

export const searchBooks = (title: string) => {
  if (!title || title.trim() === '') {
    throw new Error('กรุณาระบุชื่อหนังสือที่ต้องการค้นหา')
  }
  return bookRepo.findBooksByTitle(title)
}

export const createBook = (data: {
  title: string
  isbn: string
  category: string
  authorId: number
}) => {
  return bookRepo.createBook(data)
}

export const updateBook = (
  id: number,
  data: { title?: string; isbn?: string; category?: string; authorId?: number }
) => {
  return bookRepo.updateBook(id, data)
}

export const deleteBook = (id: number) => {
  return bookRepo.deleteBook(id)
}
