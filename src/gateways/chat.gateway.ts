import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaClient, Message, User } from '@prisma/client';

const prisma = new PrismaClient();

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: { [socketId: string]: string } = {}; // Храним сопоставление socketId и userId

  // Метод для обработки подключения клиента
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Можно хранить информацию о пользователе, если необходимо
  }

  // Метод для обработки отключения клиента
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Удаляем информацию о пользователе, если она есть
    delete this.users[client.id];
  }

  @SubscribeMessage('login') // Получаем информацию о пользователе (например, userId) при логине
  async handleLogin(@MessageBody() userId: string, client: Socket) {
    this.users[client.id] = userId; // Сохраняем связь socketId и userId
    console.log(`User ${userId} logged in with socket ${client.id}`);
  }

  @SubscribeMessage('send_message') // Обработка отправки личного сообщения
  async handleSendMessage(
    @MessageBody() data: { recipientId: string; content: string; senderId: string },
    client: Socket,
  ) {
    // Создаем сообщение в базе данных
    const message: Message = await prisma.message.create({
      data: {
        content: data.content,
        chatId: 'private-chat-id', // Здесь можно установить id чата, если хотите, чтобы было больше чатов
        userId: data.senderId,
      },
    });

    // Найдем сокет клиента-получателя
    const recipientSocketId = Object.keys(this.users).find(
      (socketId) => this.users[socketId] === data.recipientId,
    );

    // Если сокет получателя найден, отправляем сообщение
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receive_message', message); // Отправляем сообщение получателю
    }

    // Отправляем сообщение обратно отправителю, если необходимо
    this.server.to(client.id).emit('message_sent', message);

    return message;
  }
}
