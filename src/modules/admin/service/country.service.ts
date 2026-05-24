import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCountries() {
    try {
      const countries = await this.prisma.country.findMany({});
      return countries;
    } catch (error) {
      this.logger.error('Error fetching countries', error);
      throw error;
    }
  }

  async addCountry(name: string, code: string) {
    try {
      const existingCountry = await this.prisma.country.findUnique({
        where: {
          code,
        },
      });

      if (existingCountry) {
        this.logger.warn(`Country with code ${code} already exists`);
        return new ConflictException(
          `Country with code ${code} already exists`,
        );
      }

      const country = await this.prisma.country.create({
        data: {
          name,
          code,
        },
      });

      return {
        message: 'Country added successfully',
        country,
        countries: await this.getCountries(),
      };
    } catch (error) {
      this.logger.error('Error adding country', error);
      throw error;
    }
  }

  async updateCountry(id: string, name: string, code: string) {
    try {
      const existingCountry = await this.prisma.country.findUnique({
        where: {
          code,
        },
      });

      if (existingCountry && existingCountry.id !== id) {
        this.logger.warn(`Country with code ${code} already exists`);
        return new ConflictException(
          `Country with code ${code} already exists`,
        );
      }

      const country = await this.prisma.country.update({
        where: {
          id,
        },
        data: {
          name,
          code,
        },
      });

      return {
        message: 'Country updated successfully',
        country,
        countries: await this.getCountries(),
      };
    } catch (error) {
      this.logger.error('Error updating country', error);
      throw error;
    }
  }

  async deleteCountry(id: string) {
    try {
      await this.prisma.country.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Country deleted successfully',
        countries: await this.getCountries(),
      };
    } catch (error) {
      this.logger.error('Error deleting country', error);
      throw error;
    }
  }
}
