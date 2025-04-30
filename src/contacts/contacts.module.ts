import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
 imports: [AuthModule],
  controllers: [ContactsController],
  providers: [ContactsService, PrismaService, AuthGuard],
})
export class ContactsModule {}
