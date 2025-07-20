import { Injectable,CanActivate,ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    canActivate( context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('No token provided'); 
        try {
            const payload = this.jwtService.verify(token);
            // request.matricule = payload.matricule;
        } catch (error) {
            Logger.error('Token verification failed:', error);
            throw new UnauthorizedException('Invalid token');
        }
    return true
  }
    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return null;
    }
}