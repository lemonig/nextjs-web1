import { http } from '@/lib/http/request'
import type {
  QuotationDetail,
  QuotationDetailListParams,
  QuotationDetailInsertParams,
  QuotationDetailUpdateParams,
  QuotationDetailPriceUpdateParams,
} from '@/types/quotation'

export const quotationDetailService = {
  list(params: QuotationDetailListParams) {
    return http.post<QuotationDetail[]>('/api/quotation/detail/list', params)
  },

  insert(params: QuotationDetailInsertParams) {
    return http.post<QuotationDetail>('/api/quotation/detail/insert', params)
  },

  update(params: QuotationDetailUpdateParams) {
    return http.post<QuotationDetail>('/api/quotation/detail/update', params)
  },

  remove(id: string | number) {
    return http.post<null>('/api/quotation/detail/delete', { id })
  },

  batchUpdatePrice(params: QuotationDetailPriceUpdateParams) {
    return http.post<null>('/api/quotation/detail/list/price/update', params)
  },
}
