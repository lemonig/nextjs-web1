export interface OaProject {
  id: string | number
  name?: string
  [prop: string]: unknown
}

export interface OaProjectLoadParams {
  [prop: string]: unknown
}

export interface CameraDecryptParams {
  serial: string
  verificationCode?: string
  [prop: string]: unknown
}

export interface CameraDecryptResult {
  [prop: string]: unknown
}

export interface UploadEvidenceResult {
  filePath: string
  originalFilename?: string
  url?: string
  [prop: string]: unknown
}

export interface AfterSaleUpdateParams {
  [prop: string]: unknown
}
