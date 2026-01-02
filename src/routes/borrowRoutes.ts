import { Router } from 'express'
import * as borrowService from '../services/BorrowService'

const router = Router()

// GET /borrows - ดึงประวัติการยืมทั้งหมด
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  const { pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    const result = await borrowService.getAllBorrowRecords(size, page)
    if (result.borrowItems.length === 0) {
      res.status(404).json({ error: 'ไม่พบประวัติการยืม' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result.borrowItems)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงประวัติการยืม' })
  } finally {
    console.log(
      `Request GET /borrows is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// GET /borrows/due?date=2026-01-03 - ค้นหาหนังสือที่มีกำหนดคืนในวันที่กำหนด
// Pagination: ?pageSize=10&pageNo=1
router.get('/due', async (req, res) => {
  const { date, pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    const result = await borrowService.getBooksByDueDate(
      date as string,
      size,
      page
    )
    if (result.borrowItems.length === 0) {
      res.status(404).json({ error: 'ไม่พบหนังสือที่มีกำหนดคืนในวันนี้' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result.borrowItems)
  } catch (error: any) {
    res
      .status(400)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่มีกำหนดคืนในวันนี้' })
  } finally {
    console.log(`Request GET /borrows/due?date=${date} is completed.`)
  }
})

// GET /borrows/unreturned - ค้นหาหนังสือที่ยังไม่ได้คืน
// Pagination: ?pageSize=10&pageNo=1
router.get('/unreturned', async (req, res) => {
  const { pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    const result = await borrowService.getUnreturnedBooks(size, page)
    if (result.borrowItems.length === 0) {
      res.status(404).json({ error: 'ไม่พบหนังสือที่ยังไม่ได้คืน' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result.borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่ยังไม่ได้คืน' })
  } finally {
    console.log(
      `Request GET /borrows/unreturned is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// GET /borrows/overdue - ค้นหาหนังสือที่เกินกำหนดคืน
// Pagination: ?pageSize=10&pageNo=1
router.get('/overdue', async (req, res) => {
  const { pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    const result = await borrowService.getOverdueBooks(size, page)
    if (result.borrowItems.length === 0) {
      res.status(404).json({ error: 'ไม่พบหนังสือที่เกินกำหนดคืน' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result.borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่เกินกำหนด' })
  } finally {
    console.log(
      `Request GET /borrows/overdue is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// POST /borrows/:borrowItemId/return - คืนหนังสือ
router.post('/:borrowItemId/return', async (req, res) => {
  const { borrowItemId } = req.params

  try {
    const result = await borrowService.returnBook(parseInt(borrowItemId))
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  } finally {
    console.log(`Request POST /borrows/${borrowItemId}/return is completed.`)
  }
})

export default router
