import * as borrowRepo from '../repositories/BorrowRepository'

export const getAllBorrowRecords = (
  pageSize: number = 10,
  pageNo: number = 1
) => {
  return borrowRepo.findAllBorrowRecordsWithPagination(pageSize, pageNo)
}

export const getBorrowRecordById = async (id: number) => {
  const record = await borrowRepo.findBorrowRecordById(id)
  if (!record) {
    throw new Error('ไม่พบประวัติการยืม')
  }
  return record
}

export const getBooksByDueDate = (
  dateString: string,
  pageSize: number = 10,
  pageNo: number = 1
) => {
  if (!dateString) {
    throw new Error('กรุณาระบุวันที่ (format: YYYY-MM-DD)')
  }
  const date = new Date(dateString)
  return borrowRepo.findBorrowItemsByDueDateWithPagination(
    date,
    pageSize,
    pageNo
  )
}

export const getUnreturnedBooks = (
  pageSize: number = 10,
  pageNo: number = 1
) => {
  return borrowRepo.findUnreturnedBooksWithPagination(pageSize, pageNo)
}

export const getOverdueBooks = (pageSize: number = 10, pageNo: number = 1) => {
  return borrowRepo.findOverdueBooksWithPagination(pageSize, pageNo)
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

export const count = () => {
  return borrowRepo.countBorrowItems()
}
