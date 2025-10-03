import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHasMaintenances } from 'cts-entities';
import { InventoryModule } from '../../inventory/inventory.module';
import { MaintenancesModule } from '../mantenance.module';
import { InventoryHasMaintenanceController } from './inventory-has-maintenance.controller';
import {InventoryHasMaintenanceServices} from './inventory-has-maintenance.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryHasMaintenances]),
    InventoryModule,
    MaintenancesModule,
  ],
  controllers: [InventoryHasMaintenanceController],
  providers: [InventoryHasMaintenanceServices],
  exports: [InventoryHasMaintenanceServices],
})
export class InventoryHasMaintennaceModule {}
