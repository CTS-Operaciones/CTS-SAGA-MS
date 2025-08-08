import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigDataSource } from 'cts-entities';

import { ClasificationsModule } from './clasifications/clasifications.module';
import { ModelsModule } from './models/models.module';
import { BrandsModule } from './brands/brands.module';
import { ResourcesModule } from './resources/resources.module';
import { EnablingModule } from './enabling/enabling.module';
import { MantenanceModule } from './mantenance/mantenance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AdmissionsDischargesModule } from './admissions-discharges/admissions-discharges.module';
import { InventoryModule } from './inventory/inventory.module';
import { UbicationsModule } from './ubications/ubications.module';
import { InventoryHasAddModule } from './add-remove/inventory-has-add/inventory-has-add.module';
import { InventoryHasAssignModule } from './assignments/inventory-has-assign/inventory-has-assign.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ConfigDataSource }),
    ClasificationsModule,
    BrandsModule,
    ResourcesModule,
    ModelsModule,
    EnablingModule,
    MantenanceModule,
    AssignmentsModule,
    InventoryModule,
    AdmissionsDischargesModule,
    MantenanceModule,
    UbicationsModule,
    InventoryHasAddModule,
    InventoryHasAssignModule,
  ],
})
export class AppModule {}
