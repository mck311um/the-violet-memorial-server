import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceDto } from './resource.dto';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllResources() {
    try {
      const resources = await this.prisma.resource.findMany();
      return resources;
    } catch (error: any) {
      this.logger.error('Failed to fetch resources', error);
      throw error;
    }
  }

  async getResourcesForClient() {
    try {
      const resources = await this.getAllResources();
      return resources;
    } catch (error: any) {
      this.logger.error('Failed to fetch resources for client', error);
      throw error;
    }
  }

  async createResource(data: ResourceDto) {
    try {
      const resource = await this.prisma.resource.create({
        data: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          region: data.region,
          url: data.url,
        },
      });

      return {
        message: 'Resource created successfully',
        resource,
        resources: await this.getAllResources(),
      };
    } catch (error: any) {
      this.logger.error('Failed to create resource', error);
      throw error;
    }
  }

  async updateResource(data: ResourceDto) {
    try {
      const resource = await this.prisma.resource.update({
        where: { id: data.id },
        data: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          region: data.region,
          url: data.url,
        },
      });

      return {
        message: 'Resource updated successfully',
        resource,
        resources: await this.getAllResources(),
      };
    } catch (error: any) {
      this.logger.error('Failed to update resource', error);
      throw error;
    }
  }

  async deleteResource(id: string) {
    try {
      await this.prisma.resource.delete({
        where: { id },
      });

      return {
        message: 'Resource deleted successfully',
        resources: await this.getAllResources(),
      };
    } catch (error: any) {
      this.logger.error('Failed to delete resource', error);
      throw error;
    }
  }
}
