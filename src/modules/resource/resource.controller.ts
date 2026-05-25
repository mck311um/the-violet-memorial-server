import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceDto } from './resource.dto';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async getAllResources() {
    return this.resourceService.getAllResources();
  }

  @Get('client')
  async getResourcesForClient() {
    return this.resourceService.getResourcesForClient();
  }

  @Post()
  async createResource(@Body() data: ResourceDto) {
    return this.resourceService.createResource(data);
  }

  @Post('update')
  async updateResource(@Body() data: ResourceDto) {
    return this.resourceService.updateResource(data);
  }
}
