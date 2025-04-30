import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPrivateChat(userId: string, contactId: string) {
    if (userId === contactId) {
      throw new BadRequestException('Нельзя создать чат с самим собой');
    }

    // Ищем существующий приватный чат
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        isGroup: false,
        users: {
          some: { userId: userId },
        },
        AND: {
          users: {
            some: { userId: contactId },
          },
        },
      },
      include: {
        users: {
          include: {
            user: true, // подтягиваем пользователя
          },
        },
      },
    });

    if (existingChat && existingChat.users.length === 2) {
      return existingChat;
    }

    // Создаём новый чат
    return this.prisma.chat.create({
      data: {
        isGroup: false,
        users: {
          create: [
            { userId },
            { userId: contactId },
          ],
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    const isMember = chat.users.some(chatUser => chatUser.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('Нет доступа к этому чату');
    }

    return this.prisma.chat.delete({
      where: { id: chatId },
    });
  }

  async getChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        users: {
          some: { userId },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    const isMember = chat.users.some(chatUser => chatUser.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('Нет доступа к этому чату');
    }

    return chat;
  }

  async getMessages(chatId: string, userId: string) {
    const isMember = await this.prisma.chatUser.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!isMember) throw new ForbiddenException('Вы не состоите в этом чате');

    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        reads: {
          select: {
            userId: true,
          },
        },
        deliveries: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  async saveMessage(chatId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
      },
    });
  
    const participants = await this.prisma.chatUser.findMany({
      where: {
        chatId,
        NOT: { userId: senderId },
      },
    });
  
    await this.prisma.userMessageDelivery.createMany({
      data: participants.map(p => ({
        userId: p.userId,
        messageId: message.id,
      })),
      skipDuplicates: true,
    });
  
    return message;
  }
  
  async markMessagesAsRead(chatId: string, userId: string) {
    const unreadMessages = await this.prisma.message.findMany({
      where: {
        chatId,
        reads: { none: { userId } },
        senderId: { not: userId },
      },
      select: { id: true },
    });
  
    if (!unreadMessages.length) return;
  
    await this.prisma.userMessageRead.createMany({
      data: unreadMessages.map(m => ({
        userId,
        messageId: m.id,
      })),
      skipDuplicates: true,
    });
  }

  async getChatParticipantIds(chatId: string, excludeUserId: string): Promise<string[]> {
    const users = await this.prisma.chatUser.findMany({
      where: {
        chatId,
        NOT: { userId: excludeUserId },
      },
      select: { userId: true },
    });
    return users.map(u => u.userId);
  }
}
