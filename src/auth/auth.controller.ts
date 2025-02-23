import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('second_name') second_name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role,
  ) {
    return this.authService.register(name, surname, second_name, email, password, role);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
}
