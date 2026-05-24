import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getClientData() {
    return this.adminService.getClientData();
  }

  @Post('country')
  async addCountry(@Body() body: { name: string; code: string }) {
    const { name, code } = body;
    return this.adminService.addCountry(name, code);
  }

  @Put('country')
  async updateCountry(
    @Body() body: { id: string; name: string; code: string },
  ) {
    const { id, name, code } = body;
    return this.adminService.updateCountry(id, name, code);
  }

  @Delete('country/:id')
  async deleteCountry(@Param('id') id: string) {
    return this.adminService.deleteCountry(id);
  }
}
