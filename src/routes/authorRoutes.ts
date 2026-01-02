import { Router } from 'express'
import * as authorService from '../services/AuthorService'

const router = Router()

// GET /authors - ดึงผู้แต่งทั้งหมด
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  const { pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    const authors = await authorService.getAllAuthors(size, page)
    if (authors.authors.length === 0) {
      res.status(404).json({ error: 'ไม่พบผู้แต่ง' })
      return
    }
    res.setHeader('x-total-count', authors.count.toString())
    res.json(authors.authors)
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้แต่ง' })
  } finally {
    console.log(
      `Request GET /authors is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// GET /authors/:id - ดึงผู้แต่งตาม ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const author = await authorService.getAuthorById(parseInt(id))
    res.json(author)
  } catch (error: any) {
    res.status(404).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้แต่ง' })
  } finally {
    console.log(`Request GET /authors/${id} is completed.`)
  }
})

export default router
