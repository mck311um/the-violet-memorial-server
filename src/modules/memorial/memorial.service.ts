import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';

@Injectable()
export class MemorialService {
  private readonly logger = new Logger(MemorialService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllMemorials() {
    try {
      const memorials = await this.prisma.memorial.findMany();
      return memorials;
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
          potraitUrl: data.profilePicture,
          slug: this.generateSlug(data.name),
          createdBy: userId,
        },
      });

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

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
