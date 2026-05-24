import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MemorialService } from './memorial.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('memorial')
@UseGuards(JwtAuthGuard)
export class MemorialController {
  constructor(private readonly memorialService: MemorialService) {}

  @Post()
  async createMemorial(@Body() body: CreateMemorialDto, @Request() req) {
    const id = req.user.id;

    return this.memorialService.createMemorial(body, id);
  }
}
