import { Module } from '@nestjs/common';
import { MemorialService } from './memorial.service';
import { MemorialController } from './memorial.controller';
import { TimelineService } from './service/timeline.service';

@Module({
  controllers: [MemorialController],
  providers: [MemorialService, TimelineService],
})
export class MemorialModule {}
