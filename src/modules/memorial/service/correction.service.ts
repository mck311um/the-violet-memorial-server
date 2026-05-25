import { Injectable, Logger } from '@nestjs/common';
import { CreateCorrectionDto } from '../dto/correction.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CorrectionService {
  private readonly logger = new Logger(CorrectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCorrection(data: CreateCorrectionDto) {
    try {
      await this.prisma.correction.create({
        data: {
          field: data.field,
          note: data.note,
          email: data.email,
          memorialId: data.memorialId,
        },
      });

      return { message: 'Correction submitted successfully' };
    } catch (error: any) {
      this.logger.error('Failed to create correction', error);
      throw error;
    }
  }
}
