import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MemorialService } from './memorial.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiGuard } from '../auth/guards/api.guard';
import { CreateMemoryDto } from './dto/create-memory.dto';

@Controller('memorial')
export class MemorialController {
  constructor(private readonly memorialService: MemorialService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMemorials() {
    return this.memorialService.getAllMemorials();
  }

  @Get('flames/count')
  @UseGuards(ApiGuard)
  async getFlameCount() {
    return this.memorialService.getFlameCount();
  }

  @Post('flame/light/:memorialId')
  @UseGuards(ApiGuard)
  async lightFlame(@Param('memorialId') memorialId: string, @Request() req) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.memorialService.lightFlame(memorialId, ip);
  }

  @Post('memory')
  @UseGuards(ApiGuard)
  async createMemory(@Body() body: CreateMemoryDto) {
    return this.memorialService.createMemory(body);
  }

  @Get('client')
  @UseGuards(ApiGuard)
  async getAllMemorialsForClient() {
    return this.memorialService.getAllMemorialsForClient();
  }

  @Get('client/:slug')
  @UseGuards(ApiGuard)
  async getMemorialBySlug(@Param('slug') slug: string) {
    console.log(`Fetching memorial with slug: ${slug}`);
    return this.memorialService.getMemorialBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMemorial(@Body() body: CreateMemorialDto, @Request() req) {
    const id = req.user.id;

    return this.memorialService.createMemorial(body, id);
  }
}
