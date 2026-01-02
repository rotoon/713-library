import { Router } from 'express'
import * as bookService from '../services/BookService'

const router = Router()

// GET /books - ดึงหนังสือทั้งหมด หรือค้นหาด้วย ?title=xxx
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  try {
    const { title, pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    if (title) {
      const books = await bookService.searchBooks(title as string, size, page)
      res.setHeader('x-total-count', books.count.toString())
      return res.json(books)
    }
    const books = await bookService.getAllBooks(size, page)
    res.setHeader('x-total-count', books.count.toString())
    res.json(books)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' })
  }
})

// GET /books/:id - ดึงหนังสือตาม ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const book = await bookService.getBookById(parseInt(id))
    res.json(book)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

export default router
