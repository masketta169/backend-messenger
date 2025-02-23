import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Токен отсутствует или недействителен');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: 'ACCESS_SECRET' });
      req.user = decoded; // Добавляем пользователя в объект запроса
      return true;
    } catch (error) {
      throw new UnauthorizedException('Недействительный access token');
    }
  }
}
