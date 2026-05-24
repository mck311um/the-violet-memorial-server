import { Module } from '@nestjs/common';
import { MemorialService } from './memorial.service';
import { MemorialController } from './memorial.controller';
import { TimelineService } from './service/timeline.service';
import { MemoryService } from './service/memory.service';

@Module({
  controllers: [MemorialController],
  providers: [MemorialService, TimelineService, MemoryService],
})
export class MemorialModule {}
