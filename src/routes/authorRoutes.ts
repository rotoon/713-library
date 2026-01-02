import { Router } from 'express'
import * as authorService from '../services/AuthorService'

const router = Router()

// GET /authors - ดึงผู้แต่งทั้งหมด
router.get('/', async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors()
    res.json(authors)
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
