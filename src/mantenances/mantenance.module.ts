import { Module } from '@nestjs/common';
import { MantenanceService } from './mantenance.service';
import { MantenanceController } from './mantenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenances } from 'cts-entities';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenances])],
  controllers: [MantenanceController],
  providers: [MantenanceService],
  exports: [MantenanceService],
})
export class MaintenancesModule {}



