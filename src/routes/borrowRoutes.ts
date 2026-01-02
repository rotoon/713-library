import { Router } from 'express'
import * as borrowService from '../services/BorrowService'

const router = Router()

// GET /borrows - ดึงประวัติการยืมทั้งหมด
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  try {
    const { pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    const count = await borrowService.count()
    const borrowRecords = await borrowService.getAllBorrowRecords(size, page)
    res.setHeader('x-total-count', count.toString())
    res.json(borrowRecords)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงประวัติการยืม' })
  }
})

// GET /borrows/due?date=2026-01-03 - ค้นหาหนังสือที่มีกำหนดคืนในวันที่กำหนด
// Pagination: ?pageSize=10&pageNo=1
router.get('/due', async (req, res) => {
  try {
    const { date, pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1
    const count = await borrowService.count()

    const borrowItems = await borrowService.getBooksByDueDate(
      date as string,
      size,
      page
    )
    res.setHeader('x-total-count', count.toString())
    res.json(borrowItems)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// GET /borrows/unreturned - ค้นหาหนังสือที่ยังไม่ได้คืน
// Pagination: ?pageSize=10&pageNo=1
router.get('/unreturned', async (req, res) => {
  try {
    const { pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    const count = await borrowService.count()
    const borrowItems = await borrowService.getUnreturnedBooks(size, page)
    res.setHeader('x-total-count', count.toString())
    res.json(borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่ยังไม่ได้คืน' })
  }
})

// GET /borrows/overdue - ค้นหาหนังสือที่เกินกำหนดคืน
// Pagination: ?pageSize=10&pageNo=1
router.get('/overdue', async (req, res) => {
  try {
    const { pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1
    const count = await borrowService.count()
    const borrowItems = await borrowService.getOverdueBooks(size, page)
    res.setHeader('x-total-count', count.toString())
    res.json(borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่เกินกำหนด' })
  }
})

// POST /borrows/:borrowItemId/return - คืนหนังสือ
router.post('/:borrowItemId/return', async (req, res) => {
  try {
    const { borrowItemId } = req.params
    const result = await borrowService.returnBook(parseInt(borrowItemId))
    const count = await borrowService.count()
    res.setHeader('x-total-count', count.toString())
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
