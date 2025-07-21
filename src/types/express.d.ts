import { Request } from 'express';

declare module 'express' {
  interface Request {
    admin?: {
      matricule: string;
      role: string;
      iat: number // optionally allow more fields like iat, exp...
    };
  }
}