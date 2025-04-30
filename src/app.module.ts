import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chat.gateway';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [AuthModule, PrismaModule, ContactsModule, ChatsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
