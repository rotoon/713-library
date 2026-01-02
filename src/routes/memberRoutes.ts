import { Router } from 'express'
import * as memberService from '../services/MemberService'

const router = Router()

// GET /members - ดึงสมาชิกทั้งหมด หรือค้นหาด้วย ?name=xxx
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  try {
    const { name, pageSize, pageNo } = req.query
    const size = parseInt(pageSize as string) || 10
    const page = parseInt(pageNo as string) || 1

    if (name) {
      const members = await memberService.searchMembers(
        name as string,
        size,
        page
      )
      return res.json(members)
    }
    const members = await memberService.getAllMembers(size, page)
    const count = await memberService.count()
    res.setHeader('x-total-count', count.toString())
    res.json(members)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' })
  }
})

// GET /members/code/:code - ค้นหาสมาชิกตามรหัสสมาชิก
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params
    const member = await memberService.getMemberByCode(code)
    res.json(member)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// GET /members/:id - ดึงสมาชิกตาม ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const member = await memberService.getMemberById(parseInt(id))
    res.json(member)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

export default router
