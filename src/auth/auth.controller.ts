import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginTdo } from './tdos/LoginDto';
import { AuthService } from './auth.service';
import { RefreshTokenTdo } from './tdos/refreshTokensTdo';
import { SelfGuard } from '../guards/self.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginTdo : LoginTdo) {
      return this.authService.login(loginTdo)
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenTdos : RefreshTokenTdo) {
      return this.authService.refreshTokens(refreshTokenTdos.token) 
    }

    @UseGuards(SelfGuard)
    @Post('logout')
    async logout(@Body('matricule') matricule: string) {
      return this.authService.logout(matricule)
    }
}
