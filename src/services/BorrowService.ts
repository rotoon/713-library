import * as borrowRepo from '../repositories/BorrowRepository'

export const getAllBorrowRecords = () => {
  return borrowRepo.findAllBorrowRecords()
}

export const getBorrowRecordById = async (id: number) => {
  const record = await borrowRepo.findBorrowRecordById(id)
  if (!record) {
    throw new Error('ไม่พบประวัติการยืม')
  }
  return record
}

export const getBooksByDueDate = (dateString: string) => {
  if (!dateString) {
    throw new Error('กรุณาระบุวันที่ (format: YYYY-MM-DD)')
  }
  const date = new Date(dateString)
  return borrowRepo.findBorrowItemsByDueDate(date)
}

export const getUnreturnedBooks = () => {
  return borrowRepo.findUnreturnedBooks()
}

export const getOverdueBooks = () => {
  return borrowRepo.findOverdueBooks()
}

export const borrowBooks = (
  memberId: number,
  items: { bookId: number; dueDate: Date }[]
) => {
  if (!items || items.length === 0) {
    throw new Error('กรุณาระบุหนังสือที่ต้องการยืม')
  }
  return borrowRepo.createBorrowRecord(memberId, items)
}

export const returnBook = (borrowItemId: number) => {
  return borrowRepo.returnBook(borrowItemId)
}
