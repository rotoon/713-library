import 'dotenv/config'
import express from 'express'
import * as bookService from './services/BookService'
import * as authorService from './services/AuthorService'
import * as memberService from './services/MemberService'
import * as borrowService from './services/BorrowService'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// ===================== BOOKS =====================

// GET /api/books - ดึงหนังสือทั้งหมด หรือค้นหาด้วย ?title=xxx
app.get('/api/books', async (req, res) => {
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

// GET /api/books/:id - ดึงหนังสือตาม ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params
    const book = await bookService.getBookById(parseInt(id))
    res.json(book)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// ===================== AUTHORS =====================

// GET /api/authors - ดึงผู้แต่งทั้งหมด
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors()
    res.json(authors)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้แต่ง' })
  }
})

// GET /api/authors/:id - ดึงผู้แต่งตาม ID
app.get('/api/authors/:id', async (req, res) => {
  try {
    const { id } = req.params
    const author = await authorService.getAuthorById(parseInt(id))
    res.json(author)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// ===================== MEMBERS =====================

// GET /api/members - ดึงสมาชิกทั้งหมด หรือค้นหาด้วย ?name=xxx
app.get('/api/members', async (req, res) => {
  try {
    const { name } = req.query
    if (name) {
      const members = await memberService.searchMembers(name as string)
      return res.json(members)
    }
    const members = await memberService.getAllMembers()
    res.json(members)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' })
  }
})

// GET /api/members/code/:code - ค้นหาสมาชิกตามรหัสสมาชิก
app.get('/api/members/code/:code', async (req, res) => {
  try {
    const { code } = req.params
    const member = await memberService.getMemberByCode(code)
    res.json(member)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// GET /api/members/:id - ดึงสมาชิกตาม ID
app.get('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params
    const member = await memberService.getMemberById(parseInt(id))
    res.json(member)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// ===================== BORROWS =====================

// GET /api/borrows - ดึงประวัติการยืมทั้งหมด
app.get('/api/borrows', async (req, res) => {
  try {
    const borrowRecords = await borrowService.getAllBorrowRecords()
    res.json(borrowRecords)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงประวัติการยืม' })
  }
})

// GET /api/borrows/due?date=2026-01-03 - ค้นหาหนังสือที่มีกำหนดคืนในวันที่กำหนด
app.get('/api/borrows/due', async (req, res) => {
  try {
    const { date } = req.query
    const borrowItems = await borrowService.getBooksByDueDate(date as string)
    res.json(borrowItems)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/borrows/unreturned - ค้นหาหนังสือที่ยังไม่ได้คืน
app.get('/api/borrows/unreturned', async (req, res) => {
  try {
    const borrowItems = await borrowService.getUnreturnedBooks()
    res.json(borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่ยังไม่ได้คืน' })
  }
})

// GET /api/borrows/overdue - ค้นหาหนังสือที่เกินกำหนดคืน
app.get('/api/borrows/overdue', async (req, res) => {
  try {
    const borrowItems = await borrowService.getOverdueBooks()
    res.json(borrowItems)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'เกิดข้อผิดพลาดในการค้นหาหนังสือที่เกินกำหนด' })
  }
})

// POST /api/borrows/:borrowItemId/return - คืนหนังสือ
app.post('/api/borrows/:borrowItemId/return', async (req, res) => {
  try {
    const { borrowItemId } = req.params
    const result = await borrowService.returnBook(parseInt(borrowItemId))
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// ===================== HEALTH CHECK =====================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
