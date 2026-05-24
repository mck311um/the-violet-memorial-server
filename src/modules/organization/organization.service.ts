import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(params: CreateOrganizationDto) {
    try {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { slug: params.slug },
      });

      if (existingOrg) {
        this.logger.warn(
          `Attempt to create organization with existing slug: ${params.slug}`,
        );
        throw new Error('Organization slug already exists');
      }

      const organization = await this.prisma.organization.create({
        data: { name: params.name, slug: params.slug },
      });

      return organization;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getOrganizationBySlug(slug: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { slug },
      });

      if (!organization) {
        this.logger.warn(`Organization not found with slug: ${slug}`);
        throw new Error('Organization not found');
      }

      return organization;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getOrganizationById(id: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
      });

      if (!organization) {
        this.logger.warn(`Organization not found with ID: ${id}`);
        throw new Error('Organization not found');
      }

      return organization;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getAllOrganizations() {
    try {
      return await this.prisma.organization.findMany();
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async deleteOrganization(id: string) {
    try {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { id },
      });

      if (!existingOrg) {
        this.logger.warn(
          `Attempt to delete non-existent organization ID: ${id}`,
        );
        throw new Error('Organization not found');
      }

      await this.prisma.organization.delete({ where: { id } });
      this.logger.log(`Organization deleted with ID: ${id}`);
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
