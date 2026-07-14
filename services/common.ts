import { http } from '@/lib/http/request'
import type {
  OaProject,
  OaProjectLoadParams,
  CameraDecryptParams,
  CameraDecryptResult,
  UploadEvidenceResult,
  AfterSaleUpdateParams,
} from '@/types/common-api'

export const commonService = {
  loadOaProject(params: OaProjectLoadParams) {
    return http.post<OaProject[]>('/api/oa/project/load', params)
  },

  decryptCamera(params: CameraDecryptParams) {
    return http.post<CameraDecryptResult>('api/station/camera/decrypt', params)
  },

  uploadEvidence(params: unknown) {
    return http.post<UploadEvidenceResult>('api/upload/evidence', params)
  },

  afterSaleUpdate(params: AfterSaleUpdateParams) {
    return http.post<null>('api/CompanyAfterSale/update', params)
  },
}
