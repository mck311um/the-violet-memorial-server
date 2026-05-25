import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMemorialDto,
  CreateMemorialSuggestionDto,
} from './dto/create-memorial.dto';
import { TimelineService } from './service/timeline.service';
import { NotFoundError } from 'rxjs';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { MemoryService } from './service/memory.service';
import { CorrectionService } from './service/correction.service';
import { CreateCorrectionDto } from './dto/correction.dto';

@Injectable()
export class MemorialService {
  private readonly logger = new Logger(MemorialService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly timelineService: TimelineService,
    private readonly memoryService: MemoryService,
    private readonly correctionService: CorrectionService,
  ) {}

  async getFlameCount() {
    try {
      const count = await this.prisma.flames.count();
      return count;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getAllMemorials() {
    try {
      const memorials = await this.prisma.memorial.findMany();
      return memorials;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getAllMemorialsForClient() {
    try {
      const memorials = await this.prisma.memorial.findMany({
        include: {
          country: true,
          timeline: true,
          memories: { where: { status: { not: 'REJECTED' } } },
        },
      });
      return memorials;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getMemorialBySlug(slug: string) {
    try {
      const memorial = await this.prisma.memorial.findUnique({
        where: { slug },
        include: {
          country: true,
          timeline: true,
          memories: { where: { status: { not: 'REJECTED' } } },
        },
      });

      if (!memorial) {
        this.logger.warn(`Memorial with slug "${slug}" not found`);
        throw new NotFoundException(`Memorial with slug "${slug}" not found`);
      }

      return memorial;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async createMemorial(data: CreateMemorialDto, userId: string) {
    try {
      const memorial = await this.prisma.memorial.create({
        data: {
          name: data.name,
          category: data.category,
          countryId: data.countryId,
          dateOfDeath: data.dateOfDeath,
          dateOfBirth: data.dateOfBirth,
          occupation: data.occupation,
          remembrance: data.remembrance,
          about: data.about,
          potraitUrl: data.potraitUrl,
          slug: this.generateSlug(data.name),
          createdBy: userId,
        },
      });

      const country = await this.prisma.country.findUnique({
        where: {
          id: data.countryId,
        },
      });

      await this.timelineService.addTimelineEntry(
        memorial.id,
        'Birth',
        `${data.name} was born in ${country?.name || 'Unknown Country'} on ${this.formatDate(data.dateOfBirth)}.`,
        new Date(data.dateOfBirth).getFullYear(),
      );

      const memorials = await this.getAllMemorials();

      return {
        message: 'Memorial created successfully',
        memorial,
        memorials,
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async createMemory(data: CreateMemoryDto) {
    return this.memoryService.createMemory(data);
  }

  async lightFlame(ipAddress: string) {
    try {
      const existingFlame = await this.prisma.flames.findFirst({
        where: {
          ipAddress,
        },
      });

      if (existingFlame) {
        this.logger.warn(`IP address ${ipAddress} has already lit a flame`);
        return this.getFlameCount();
      }

      await this.prisma.flames.create({
        data: {
          ipAddress,
        },
      });

      return await this.getFlameCount();
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async submitCorrection(data: CreateCorrectionDto) {
    return this.correctionService.createCorrection(data);
  }

  async createMemorialSuggestion(data: CreateMemorialSuggestionDto) {
    try {
      const suggestion = await this.prisma.memorialSuggestion.create({
        data: {
          name: data.name,
          country: data.country,
          message: data.message,
        },
      });

      return {
        message: 'Memory suggestion created successfully',
        suggestion,
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }
}
