import { Body, Controller, Post } from '@nestjs/common';
import { SignUpTdo } from './tdos/signUpTdo';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
   @Post('signup')
    async signup(@Body() signUpData : SignUpTdo) {
      return this.authService.signup(signUpData)
    }
    @Post('login')
    async login() {
  
    }
}
