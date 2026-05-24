import { Controller } from '@nestjs/common';
import { MemorialService } from './memorial.service';

@Controller('memorial')
export class MemorialController {
  constructor(private readonly memorialService: MemorialService) {}
}
