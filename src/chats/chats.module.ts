import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../guards/auth.guard';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService, AuthGuard],
  exports: [ChatsService], // экспортируем для использования в сокетах и других модулях
})
export class ChatsModule {}
