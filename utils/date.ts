import dayjs from 'dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatDate(
  value?: string | number | Date | null,
  format: string = DATE_FORMAT,
): string {
  if (value == null || value === '') return ''
  const d = dayjs(value)
  return d.isValid() ? d.format(format) : ''
}

export function formatDateTime(
  value?: string | number | Date | null,
): string {
  return formatDate(value, DATETIME_FORMAT)
}

export function timestampName(prefix: string, ext = 'xls'): string {
  return `${prefix}_${dayjs().format('YYYY_MM_DD')}.${ext}`
}
