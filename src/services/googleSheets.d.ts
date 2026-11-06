export interface PhotoData {
  base64: string;
  filename: string;
  mimeType: string;
}

export interface SubmitDelegationParams {
  college: string;
  clName: string;
  clPhone: string;
  aclName: string;
  aclPhone: string;
  clPhotoFile?: File | null;
  aclPhotoFile?: File | null;
  refId?: string;
  institutionSecret?: string;
}

export interface SubmitDelegationResult {
  status: 'success' | 'duplicate' | 'error';
  refId: string;
  message: string;
  timestamp?: string;
  college?: string;
  clName?: string;
  clPhone?: string;
  aclName?: string;
  aclPhone?: string;
}

export function fileToBase64(file: File): Promise<PhotoData | null>;

export function submitDelegation(params: SubmitDelegationParams): Promise<SubmitDelegationResult>;
