import { Router } from 'express'
import * as bookService from '../services/BookService'

const router = Router()

// GET /books - ดึงหนังสือทั้งหมด หรือค้นหาด้วย ?keyword=xxx หรือ ?title=xxx
// keyword ค้นหาจาก: ชื่อหนังสือ, หมวดหมู่, ชื่อผู้แต่ง, ชื่อผู้ยืม
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  try {
    const { keyword, title, pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    // ถ้ามี keyword ให้ค้นหาแบบ keyword (หลายฟิลด์)
    if (keyword) {
      const result = await bookService.searchByKeyword(
        keyword as string,
        size,
        page
      )
      if (result.books.length === 0) {
        res.status(404).json({ error: 'ไม่พบหนังสือ' })
        return
      }
      res.setHeader('x-total-count', result.count.toString())
      return res.json(result.books)
    }

    // ถ้ามี title ให้ค้นหาเฉพาะชื่อหนังสือ
    if (title) {
      const books = await bookService.searchBooks(title as string, size, page)
      if (books.books.length === 0) {
        res.status(404).json({ error: 'ไม่พบหนังสือ' })
        return
      }
      res.setHeader('x-total-count', books.count.toString())
      return res.json(books.books)
    }

    // ไม่มี parameter = ดึงทั้งหมด
    const books = await bookService.getAllBooks(size, page)
    if (books.books.length === 0) {
      res.status(404).json({ error: 'ไม่พบหนังสือ' })
      return
    }
    res.setHeader('x-total-count', books.count.toString())
    res.json(books.books)
  } catch (error: any) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' })
  }
})

// GET /books/:id - ดึงหนังสือตาม ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const book = await bookService.getBookById(parseInt(id))
    res.json(book)
  } catch (error: any) {
    res.status(404).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' })
  }
})

export default router
