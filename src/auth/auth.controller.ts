import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginTdo } from './tdos/LoginDto';
import { AuthService } from './auth.service';
import { SelfGuard } from '../guards/self.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginTdo: LoginTdo, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(loginTdo);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 42 * 24 * 60 * 60 * 1000, 
    });

    const { refreshToken, ...rest } = data; 
    return rest;
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;    
    const data = await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 42 * 24 * 60 * 60 * 1000,
    });

    const { refreshToken: _, ...rest } = data;
    return rest;
  } 

  @UseGuards(SelfGuard)
  @Post('logout')
  async logout(@Body('matricule') matricule: string, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return this.authService.logout(matricule);
  }
}
