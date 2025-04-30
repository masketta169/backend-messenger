// ✅ src/gateways/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, string>();

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.userSockets.get(client.id);
    this.logger.log(`Client disconnected: ${client.id} (user: ${userId})`);
    this.userSockets.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { userId: string; chatId: string },
    @ConnectedSocket() client: Socket
  ) {
    this.userSockets.set(client.id, data.userId);
    client.join(data.chatId);
    this.logger.log(`User ${data.userId} joined chat ${data.chatId}`);
  }

  @SubscribeMessage('send_message')
async handleSendMessage(
  @MessageBody() data: { chatId: string; senderId: string; content: string },
  @ConnectedSocket() client: Socket
) {
  const message = await this.chatsService.saveMessage(data.chatId, data.senderId, data.content);

  // находим получателей (всех кроме отправителя)
  const participants = await this.chatsService.getChatParticipantIds(data.chatId, data.senderId);

  // отправка события receive_message
  this.server.to(data.chatId).emit('receive_message', message);

  // отправка события доставки
  this.server.to(data.chatId).emit('message_delivered', {
    chatId: data.chatId,
    messageId: message.id,
    deliveredTo: participants,
  });
}

  @SubscribeMessage('read_messages')
  async handleReadMessages(
    @MessageBody() data: { chatId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    await this.chatsService.markMessagesAsRead(data.chatId, data.userId);
    this.server.to(data.chatId).emit('messages_read', {
      chatId: data.chatId,
      userId: data.userId,
    });
  }
}
