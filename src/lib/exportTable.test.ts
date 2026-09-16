import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({}),
    book_append_sheet: vi.fn(),
    sheet_to_csv: vi.fn().mockReturnValue('col1,col2\nval1,val2'),
  },
  write: vi.fn().mockReturnValue(new ArrayBuffer(8)),
}))

import { exportToExcel, exportToCsv } from './exportTable'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

const rows = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
]

describe('exportToExcel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle json_to_sheet avec les données', () => {
    exportToExcel(rows, 'test')
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(rows)
  })

  it('appelle book_new et book_append_sheet', () => {
    exportToExcel(rows, 'test')
    expect(XLSX.utils.book_new).toHaveBeenCalled()
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
  })

  it('appelle saveAs avec un Blob et le bon nom de fichier', () => {
    exportToExcel(rows, 'myfile')
    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      'myfile.xlsx'
    )
  })

  it('appelle XLSX.write avec bookType xlsx', () => {
    exportToExcel(rows, 'test')
    expect(XLSX.write).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ bookType: 'xlsx' })
    )
  })
})

describe('exportToCsv', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle json_to_sheet avec les données', () => {
    exportToCsv(rows, 'test')
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(rows)
  })

  it('appelle sheet_to_csv', () => {
    exportToCsv(rows, 'test')
    expect(XLSX.utils.sheet_to_csv).toHaveBeenCalled()
  })

  it('appelle saveAs avec un Blob CSV et le bon nom de fichier', () => {
    exportToCsv(rows, 'myfile')
    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      'myfile.csv'
    )
  })
})
