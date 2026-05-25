import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMemoryDto } from '../dto/create-memory.dto';

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMemoriesByMemorialId(memorialId: string) {
    try {
      const memories = await this.prisma.memory.findMany({
        where: { memorialId, status: { not: 'REJECTED' } },
      });
      return memories;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async createMemory(data: CreateMemoryDto) {
    try {
      const memory = await this.prisma.memory.create({
        data: {
          name: data.name,
          initials: await this.getInitials(data.name),
          message: data.message,
          memorialId: data.memorialId,
          imageUrl: data.imageUrl,
        },
      });

      return {
        message: 'Memory created successfully',
        memory,
        memories: await this.getMemoriesByMemorialId(data.memorialId),
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private async getInitials(name: string): Promise<string> {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) {
      return '';
    }
    const initials = words.map((word) => word[0].toUpperCase()).join('');
    return initials;
  }
}
