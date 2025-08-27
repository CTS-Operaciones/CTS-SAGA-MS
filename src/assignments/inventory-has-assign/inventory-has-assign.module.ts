import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHasAssigment } from 'cts-entities';

import { InventoryHasAssignService } from './inventory-has-assign.service';
import { InventoryModule } from '../../inventory/inventory.module';
import { AssignmentsModule } from '../assignments.module';
import { AssignmentsController } from './inventory-has-assign.controller';
import { In } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryHasAssigment]),
    InventoryModule,
    AssignmentsModule,
  ],
  controllers: [AssignmentsController],
  providers: [InventoryHasAssignService],
  exports: [InventoryHasAssignService],
})
export class InventoryHasAssignModule {}
