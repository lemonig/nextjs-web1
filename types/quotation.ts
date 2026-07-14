export interface QuotationAttachment {
  filePath: string
  originalFilename: string
}

export interface Quotation {
  id: string | number
  project: string
  organization: string
  expiryDate?: string
  contractDetail?: string
  description?: string
  playerId?: string
  attachment?: QuotationAttachment
  [prop: string]: unknown
}

export interface QuotationListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface QuotationInsertParams {
  project: string
  organization: string
  expiryDate?: string
  contractDetail?: string
  description?: string
  playerId?: string
  attachment?: QuotationAttachment
  [prop: string]: unknown
}

export interface QuotationUpdateParams extends QuotationInsertParams {
  id: string | number
}

export interface QuotationDetail {
  id: string | number
  quotationId: string | number
  productId: string | number
  number?: number
  community?: string
  remarks?: string
  serial?: string
  verificationCode?: string
  [prop: string]: unknown
}

export interface QuotationDetailListParams {
  quotationId: string | number
}

export interface QuotationDetailInsertParams {
  quotationId: string | number
  productId: string | number
  number?: number
  community?: string
  remarks?: string
  serial?: string
  verificationCode?: string
  [prop: string]: unknown
}

export interface QuotationDetailUpdateParams
  extends QuotationDetailInsertParams {
  id: string | number
}

export interface QuotationDetailPriceUpdateParams {
  quotationId: string | number
  [prop: string]: unknown
}
