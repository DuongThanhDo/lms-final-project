import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Conversation } from './conversation.entity';
import { CreateMessageDto } from './message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    private readonly dataSource: DataSource
  ) {}

  async createConversation(participantIds: number[]): Promise<Conversation> {
    if (participantIds.length < 2) {
      throw new Error('Conversation must have at least 2 participants');
    }

    const sortedIds = [...participantIds].sort((a, b) => a - b);

    return await this.dataSource.transaction(async (manager) => {
      const participants = await manager
        .getRepository(User)
        .findByIds(participantIds);

      if (participants.length !== participantIds.length) {
        throw new NotFoundException('Some participants not found');
      }

      // LOCK tránh race condition
      const existingConversation = await manager
        .getRepository(Conversation)
        .createQueryBuilder('conversation')
        .setLock('pessimistic_write')
        .leftJoin('conversation.participants', 'participant')
        .where('participant.id IN (:...ids)', { ids: sortedIds })
        .groupBy('conversation.id')
        .having('COUNT(DISTINCT participant.id) = :count', {
          count: sortedIds.length,
        })
        .getOne();

      if (existingConversation) {
        return existingConversation;
      }

      const newConversation = manager.create(Conversation, { participants });
      return await manager.save(newConversation);
    });
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<any> {
    const sender = await this.userRepository.findOneBy({
      id: createMessageDto.senderId,
    });
    if (!sender)
      throw new NotFoundException(
        `User sender with ID ${createMessageDto.senderId} not found`,
      );

    const conversation = await this.conversationRepository.findOne({
      where: { id: createMessageDto.conversationId },
      relations: ['participants'],
    });
    if (!conversation)
      throw new NotFoundException(
        `Conversation with ID ${createMessageDto.conversationId} not found`,
      );

    // Kiểm tra sender là participant
    const isParticipant = conversation.participants.some(
      (u) => u.id === sender.id,
    );
    if (!isParticipant)
      throw new NotFoundException('Sender is not part of this conversation');

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
      conversation,
    });

    // Lưu message
    const savedMessage = await this.messageRepository.save(message);

    // Cập nhật thời gian cập nhật conversation
    conversation.updatedAt = new Date();
    await this.conversationRepository.save(conversation);

        // Lấy lại message kèm quan hệ cần thiết
    const fullMessage = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'sender.profile', 'sender.profile.avatar', 'conversation'],
    });

    return fullMessage;
  }

  async getConversationWithParticipants(
    conversationId: number,
  ): Promise<Conversation | any> {
    return this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });
  }

  async findMessagesByConversation(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender', 'sender.profile', 'sender.profile.avatar'],
      order: { createdAt: 'ASC' },
    });
  }

  async findUserConversations(userId: number): Promise<Conversation[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('participant.profile', 'profile')
      .leftJoinAndSelect('profile.avatar', 'avatar')
      .innerJoin(
        'conversation.participants',
        'checkUser',
        'checkUser.id = :userId',
        { userId },
      )
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();

    return conversations.map((c) => ({
      ...c,
      participants: c.participants.filter((p) => p.id !== userId),
    }));
  }
  async findConversation(
    user1Id: number,
    user2Id: number,
  ): Promise<Conversation | null> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('participant.id IN (:...ids)', { ids: [user1Id, user2Id] })
      .getMany();

    for (const convo of conversations) {
      const participantIds = convo.participants.map((p) => p.id);
      const hasBothUsers =
        participantIds.includes(user1Id) && participantIds.includes(user2Id);
      if (hasBothUsers && convo.participants.length === 2) {
        return convo;
      }
    }

    return null;
  }
}
