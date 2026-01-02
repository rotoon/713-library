import { Router } from 'express'
import * as bookService from '../services/BookService'

const router = Router()

// GET /books - ดึงหนังสือทั้งหมด หรือค้นหาด้วย ?keyword=xxx หรือ ?title=xxx
// keyword ค้นหาจาก: ชื่อหนังสือ, หมวดหมู่, ชื่อผู้แต่ง, ชื่อผู้ยืม
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  const { keyword, title, pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
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
      const result = await bookService.searchBooks(title as string, size, page)
      if (result.books.length === 0) {
        res.status(404).json({ error: 'ไม่พบหนังสือ' })
        return
      }
      res.setHeader('x-total-count', result.count.toString())
      return res.json(result.books)
    }

    // ไม่มี parameter = ดึงทั้งหมด
    const result = await bookService.getAllBooks(size, page)
    if (result.books.length === 0) {
      res.status(404).json({ error: 'ไม่พบหนังสือ' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result.books)
  } catch (error: any) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' })
  } finally {
    console.log(
      `Request is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// GET /books/:id - ดึงหนังสือตาม ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await bookService.getBookById(parseInt(id))
    res.json(result)
  } catch (error: any) {
    res.status(404).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' })
  } finally {
    console.log(`Request GET /books/${id} is completed.`)
  }
})

export default router
