import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class SelfGuard implements CanActivate {

   constructor(
      private readonly jwtService: JwtService,
      private readonly reflector: Reflector
    ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new ForbiddenException('No authenticated user');

    let payload: any;
        try {
          payload = this.jwtService.verify(token);
          request.admin = payload; 
        } catch (error) {
          Logger.error('Token verification failed:', error);
          throw new UnauthorizedException('Invalid token');
        }
    

    const matriculeFromToken = payload.matricule;

    // // 🧠 Matricule to compare from route params, body or query
    const matriculeFromRequest =
      request.params?.matricule || // e.g. /admin/217977
      request.body?.matricule ||   // e.g. { matricule: '217977' }
      request.query?.matricule;    // e.g. ?matricule=217977

    if (!matriculeFromRequest)
      throw new ForbiddenException('No target matricule provided');

    if (matriculeFromToken !== matriculeFromRequest)
      throw new ForbiddenException('You can only modify your own data');

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
