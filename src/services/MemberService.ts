import * as memberRepo from '../repositories/MemberRepository'

export const getAllMembers = () => {
  return memberRepo.findAllMembers()
}

export const getMemberById = async (id: number) => {
  const member = await memberRepo.findMemberById(id)
  if (!member) {
    throw new Error('ไม่พบสมาชิก')
  }
  return member
}

export const getMemberByCode = async (memberCode: string) => {
  const member = await memberRepo.findMemberByCode(memberCode)
  if (!member) {
    throw new Error('ไม่พบสมาชิก')
  }
  return member
}

export const searchMembers = (name: string) => {
  if (!name || name.trim() === '') {
    throw new Error('กรุณาระบุชื่อที่ต้องการค้นหา')
  }
  return memberRepo.findMembersByName(name)
}

export const createMember = (data: {
  memberCode: string
  firstName: string
  lastName: string
  phone: string
}) => {
  return memberRepo.createMember(data)
}

export const updateMember = (
  id: number,
  data: {
    memberCode?: string
    firstName?: string
    lastName?: string
    phone?: string
  }
) => {
  return memberRepo.updateMember(id, data)
}

export const deleteMember = (id: number) => {
  return memberRepo.deleteMember(id)
}
