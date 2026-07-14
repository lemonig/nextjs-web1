import { http } from '@/lib/http/request'
import type {
  Product,
  ProductCategory,
  ProductListParams,
  ProductInsertParams,
  ProductUpdateParams,
} from '@/types/product'

export const productService = {
  list(params?: ProductListParams) {
    return http.post<Product[]>('/api/product/list', params)
  },

  detail(id: string | number) {
    return http.post<Product>('/api/product/detail', { id })
  },

  insert(params: ProductInsertParams) {
    return http.post<Product>('/api/product/insert', params)
  },

  update(params: ProductUpdateParams) {
    return http.post<Product>('/api/product/update', params)
  },

  remove(id: string | number) {
    return http.post<null>('/api/product/delete', { id })
  },

  import(params: unknown) {
    return http.post<null>('/api/product/import', params)
  },

  export(params: ProductListParams = {}, filename = 'product') {
    return http.download('/api/product/export', params, filename)
  },

  category() {
    return http.post<ProductCategory[]>('/api/product/category')
  },
}
