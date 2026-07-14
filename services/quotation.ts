import { http } from '@/lib/http/request'
import type {
  Quotation,
  QuotationListParams,
  QuotationInsertParams,
  QuotationUpdateParams,
} from '@/types/quotation'

export const quotationService = {
  list(params?: QuotationListParams) {
    return http.post<Quotation[]>('/api/quotation/list', params)
  },

  detail(id: string | number) {
    return http.post<Quotation>('api/quotation/detail', { id })
  },

  insert(params: QuotationInsertParams) {
    return http.post<Quotation>('/api/quotation/insert', params)
  },

  update(params: QuotationUpdateParams) {
    return http.post<Quotation>('/api/quotation/update', params)
  },

  remove(id: string | number) {
    return http.post<null>('/api/quotation/delete', { id })
  },

  copy(id: string | number) {
    return http.post<Quotation>('/api/quotation/copy', { id })
  },

  export(params: QuotationListParams, filename = 'quotation') {
    return http.download('/api/quotation/export', params, filename)
  },
}
