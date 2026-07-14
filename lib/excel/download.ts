import instance from '@/lib/http/axios'
import { downloadBlob } from '@/utils/download'
import { timestampName } from '@/utils/date'

export async function downloadExcel(
  url: string,
  params: unknown,
  filename: string,
  ext = 'xls',
): Promise<void> {
  const response = await instance.request<ArrayBuffer>({
    method: 'POST',
    url,
    data: params,
    responseType: 'arraybuffer',
  })
  const blob = new Blob([response.data], {
    type: 'application/vnd.ms-excel',
  })
  downloadBlob(blob, timestampName(filename, ext))
}
