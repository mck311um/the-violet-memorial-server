import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);
  constructor(private readonly prisma: PrismaService) {}

  async addTimelineEntry(
    memorialId: string,
    title: string,
    description: string,
    year: number,
  ) {
    try {
      const timelineEntry = await this.prisma.timelineEntry.create({
        data: {
          memorialId,
          title,
          description,
          year,
        },
      });

      return {
        message: 'Timeline entry added successfully',
        timelineEntry,
      };
    } catch (error) {
      this.logger.error('Error adding timeline entry', error);
      throw error;
    }
  }
}
