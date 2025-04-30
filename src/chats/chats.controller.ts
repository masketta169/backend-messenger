import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Post('private')
  async createPrivateChat(@Req() req, @Body('contactId') contactId: string) {
    const userId = req.user.userId;
    return this.chatsService.createPrivateChat(userId, contactId);
  }

  @UseGuards(AuthGuard)
  @Delete(':chatId')
  async deleteChat(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.userId;
    return this.chatsService.deleteChat(userId, chatId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getChats(@Req() req) {
    const userId = req.user.userId;
    return this.chatsService.getChats(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':chatId')
  async getChat(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.userId;
    return this.chatsService.getChat(userId, chatId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/messages')
  async getMessages(@Req() req, @Param('id') chatId: string) {
    const userId = req.user.userId;
    await this.chatsService.markMessagesAsRead(chatId, userId);
    return this.chatsService.getMessages(chatId, userId); // ⬅ обязательно передай userId
  }
}
