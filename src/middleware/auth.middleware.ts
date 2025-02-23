import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

interface RequestWithUser extends Request {
  user?: any; // Добавляем user в Request
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Отсутствует access token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: 'ACCESS_SECRET' });
      req.user = decoded; // Теперь TypeScript не ругается
      next();
    } catch (error) {
      throw new UnauthorizedException('Недействительный access token');
    }
  }
}
