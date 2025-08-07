import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHasAssigment } from 'cts-entities';

import { InventoryHasAssignService} from './inventory-has-assign.service';
import { ResourcesModule } from '../../resources/resources.module';
import { AssignmentsModule } from '../assignments.module';
import { AssignmentsController } from './inventory-has-assign.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryHasAssigment]),
    ResourcesModule,
    AssignmentsModule,
  ],
  controllers: [AssignmentsController],
  providers: [InventoryHasAssignService],
  exports: [InventoryHasAssignService],
})
export class InventoryHasAssignModule {}
