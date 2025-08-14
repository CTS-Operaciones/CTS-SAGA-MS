import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory, Ubications } from 'cts-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from 'src/state/state.module';
import { UbicationsModule } from 'src/ubications/ubications.module';
import { ResourcesModule } from 'src/resources/resources.module';

@Module({
  imports: [
    UbicationsModule,
    StateModule,
    ResourcesModule,
    TypeOrmModule.forFeature([Inventory]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
