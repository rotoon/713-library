import { Router } from 'express'
import * as bookService from '../services/BookService'

const router = Router()

// GET /books - ดึงหนังสือทั้งหมด หรือค้นหาด้วย ?title=xxx
router.get('/', async (req, res) => {
  try {
    const { title } = req.query
    if (title) {
      const books = await bookService.searchBooks(title as string)
      return res.json(books)
    }
    const books = await bookService.getAllBooks()
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
