import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getContacts(@Req() req) {
    const userId = req.user.userId;
    return this.contactsService.getContacts(userId);
  }

  @UseGuards(AuthGuard)
  @Get('search')
  async searchUsers(@Query('query') query: string, @Req() req)  {
    return this.contactsService.searchUsers(query, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async addContact(@Req() req, @Body('contactId') contactId: string) {
    const userId = req.user.userId;
    return this.contactsService.addContact(userId, contactId);
  }
}
