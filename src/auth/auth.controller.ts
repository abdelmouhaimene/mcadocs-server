import { Body, Controller, Post } from '@nestjs/common';
import { SignUpTdo } from './tdos/signUpTdo';
import { LoginTdo } from './tdos/LoginDto';
import { AuthService } from './auth.service';
import { RefreshTokenTdo } from './tdos/refreshTokensTdo';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
   @Post('signup')
    async signup(@Body() signUpData : SignUpTdo) {
      return this.authService.signup(signUpData)
    }
    @Post('login')
    async login(@Body() loginTdo : LoginTdo) {
      return this.authService.login(loginTdo)
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenTdos : RefreshTokenTdo) {
      return this.authService.refreshTokens(refreshTokenTdos.token)
    }
}
