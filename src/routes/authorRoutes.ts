import { Router } from 'express'
import * as authorService from '../services/AuthorService'

const router = Router()

// GET /authors - ดึงผู้แต่งทั้งหมด
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  try {
    const { pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    const authors = await authorService.getAllAuthors(size, page)
    res.setHeader('x-total-count', authors.count)
    res.json(authors.authors)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้แต่ง' })
  }
})

// GET /authors/:id - ดึงผู้แต่งตาม ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const author = await authorService.getAuthorById(parseInt(id))
    res.json(author)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

export default router
