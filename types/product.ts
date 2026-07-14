export interface CategoryField {
  field: string
  name: string
  value?: string
}

export interface ProductCategory {
  id: string | number
  name: string
  brandList?: string[]
  categoryFieldList?: CategoryField[]
  children?: ProductCategory[]
  [prop: string]: unknown
}

export interface Product {
  id: string | number
  categoryId: string | number
  name: string
  brand?: string
  price?: number
  [prop: string]: unknown
}

export interface ProductListParams {
  categoryId?: string | number
  page?: number
  pageSize?: number
  keyword?: string
  [prop: string]: unknown
}

export interface ProductInsertParams {
  categoryId: string | number
  name: string
  brand?: string
  price?: number
  [prop: string]: unknown
}

export interface ProductUpdateParams extends ProductInsertParams {
  id: string | number
}

export interface ProductFormValues {
  name: string
  brand?: string
  price?: number
  [prop: string]: unknown
}

export interface ProductImportParams {
  categoryId: string | number
  filePath: string
  [prop: string]: unknown
}
