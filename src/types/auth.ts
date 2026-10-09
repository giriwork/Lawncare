export interface LoginRequest {
  phoneNumber: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
