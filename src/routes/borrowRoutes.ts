import { Router } from 'express'
import * as borrowService from '../services/BorrowService'

const router = Router()

// GET /borrows - ดึงประวัติการยืมทั้งหมด
router.get('/', async (req, res) => {
  try {
    const borrowRecords = await borrowService.getAllBorrowRecords()
    res.json(borrowRecords)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงประวัติการยืม' })
  }
})

// GET /borrows/due?date=2026-01-03 - ค้นหาหนังสือที่มีกำหนดคืนในวันที่กำหนด
router.get('/due', async (req, res) => {
  try {
    const { date } = req.query
    const borrowItems = await borrowService.getBooksByDueDate(date as string)
    res.json(borrowItems)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// GET /borrows/unreturned - ค้นหาหนังสือที่ยังไม่ได้คืน
router.get('/unreturned', async (req, res) => {
  try {
    const borrowItems = await borrowService.getUnreturnedBooks()
    res.json(borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่ยังไม่ได้คืน' })
  }
})

// GET /borrows/overdue - ค้นหาหนังสือที่เกินกำหนดคืน
router.get('/overdue', async (req, res) => {
  try {
    const borrowItems = await borrowService.getOverdueBooks()
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
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
