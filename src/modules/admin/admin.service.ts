import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CountryService } from './service/country.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly countryService: CountryService,
  ) {}

  async getClientData() {
    try {
      const [countries] = await Promise.all([this.prisma.country.findMany({})]);

      return {
        countries,
      };
    } catch (error) {
      this.logger.error('Error fetching client data', error);
      throw error;
    }
  }

  async addCountry(name: string, code: string) {
    return this.countryService.addCountry(name, code);
  }

  async updateCountry(id: string, name: string, code: string) {
    return this.countryService.updateCountry(id, name, code);
  }

  async deleteCountry(id: string) {
    return this.countryService.deleteCountry(id);
  }
}
