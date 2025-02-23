import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chat.gateway';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
