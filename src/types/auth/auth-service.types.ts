export interface TokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  user?: { userId: string; email: string };
  error?: {
    message: string;
    code: string;
    status: number;
  };
}

export interface AuthUser {
  userId: string;
  email: string;
}
