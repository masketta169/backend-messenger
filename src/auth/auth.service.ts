import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(name: string, surname: string, second_name: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { name, surname, second_name, email, password: hashedPassword, role },
    });

    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Неверные учетные данные');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Неверные учетные данные');

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: 'REFRESH_SECRET' });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Недействительный refresh token');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new UnauthorizedException('Ошибка обновления токена');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Выход выполнен' };
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const accessToken = this.jwtService.sign(
      { userId, email, role },
      { secret: 'ACCESS_SECRET', expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: 'REFRESH_SECRET', expiresIn: '7d' }
    );

    // Сохраняем refreshToken в БД
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
