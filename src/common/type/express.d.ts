export interface UserPayLoad {
  id: number;
  email: string;
  role: number;
  accessToken: string;
  refreshToken: string;
}

declare module 'express' {
  export interface Request {
    user?: UserPayLoad;
  }
}
