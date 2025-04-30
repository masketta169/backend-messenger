import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContacts(userId: string) {
    return this.prisma.contact.findMany({
      where: { ownerId: userId },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            surname: true,
            second_name: true,
            email: true,
            tag: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchUsers(searchQuery: string, currentUserId: string) {
    if (!searchQuery.trim()) {
      return [];
    }
  
    return this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // <-- Исключаем самого себя
          {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { tag: { contains: searchQuery, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        surname: true,
        second_name: true,
        email: true,
        tag: true,
        role: true,
      },
      take: 20,
    });
  }
  

  async addContact(ownerId: string, contactId: string) {
    if (ownerId === contactId) {
      throw new Error('Нельзя добавить самого себя в контакты');
    }

    const existing = await this.prisma.contact.findFirst({
      where: {
        ownerId,
        contactId,
      },
    });

    if (existing) {
      throw new Error('Контакт уже добавлен');
    }

    return this.prisma.contact.create({
      data: {
        ownerId,
        contactId,
      },
    });
  }
}
