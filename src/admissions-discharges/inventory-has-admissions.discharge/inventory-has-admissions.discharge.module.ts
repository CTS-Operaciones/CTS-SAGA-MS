import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHasAssigment } from 'cts-entities';

import { InventoryHasAdmissionService} from './inventory-has-admissions.discharge.service';
import { InventoryModule } from '../../inventory/inventory.module';
import { AdmissionsDischargesModule} from '../admissions-discharges.module';
import { AssignmentsController } from './inventory-has-admissions.discharge.controller';
import { In } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryHasAssigment]),
    InventoryModule,
    AdmissionsDischargesModule,
  ],
  controllers: [AssignmentsController],
  providers: [InventoryHasAdmissionService],
  exports: [InventoryHasAdmissionService],
})
export class InventoryHasAssignModule {}
