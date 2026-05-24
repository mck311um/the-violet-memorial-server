import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CountryService } from './service/country.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, CountryService],
})
export class AdminModule {}
