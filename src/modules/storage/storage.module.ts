import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { AwsModule } from '../../common/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
