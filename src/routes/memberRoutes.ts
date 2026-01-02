import { Router } from 'express'
import * as memberService from '../services/MemberService'

const router = Router()

// GET /members - ดึงสมาชิกทั้งหมด หรือค้นหาด้วย ?name=xxx
// Pagination: ?pageSize=10&pageNo=1
router.get('/', async (req, res) => {
  const { name, pageSize, pageNo } = req.query
  const size = parseInt(pageSize as string) || 10
  const page = parseInt(pageNo as string) || 1

  try {
    if (name) {
      const result = await memberService.searchMembers(
        name as string,
        size,
        page
      )
      if (result.members.length === 0) {
        res.status(404).json({ error: 'ไม่พบสมาชิก' })
        return
      }
      res.setHeader('x-total-count', result.count.toString())
      return res.json(result)
    }
    const result = await memberService.getAllMembers(size, page)
    if (result.members.length === 0) {
      res.status(404).json({ error: 'ไม่พบสมาชิก' })
      return
    }
    res.setHeader('x-total-count', result.count.toString())
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' })
  } finally {
    console.log(
      `Request GET /members is completed. with pageNo=${page} and pageSize=${size}`
    )
  }
})

// GET /members/code/:code - ค้นหาสมาชิกตามรหัสสมาชิก
router.get('/code/:code', async (req, res) => {
  const { code } = req.params

  try {
    const result = await memberService.getMemberByCode(code)
    res.json(result)
  } catch (error: any) {
    res.status(404).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' })
  } finally {
    console.log(`Request GET /members/code/${code} is completed.`)
  }
})

// GET /members/:id - ดึงสมาชิกตาม ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await memberService.getMemberById(parseInt(id))
    res.json(result)
  } catch (error: any) {
    res.status(404).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' })
  } finally {
    console.log(`Request GET /members/${id} is completed.`)
  }
})

export default router
