import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryHasAddRemoval } from 'cts-entities';
import { InventoryHasAddService } from './inventory-has-add.service';
import { AddRemoveModule } from '../add-remove.module';
import { InventoryHasAddController } from './inventory-has-add.controller';
import { InventoryModule } from 'src/inventory/inventory.module';

  @Module({
    imports: [
      TypeOrmModule.forFeature([InventoryHasAddRemoval]),
      AddRemoveModule,
      InventoryModule,
    ],
    controllers: [InventoryHasAddController],
    providers: [InventoryHasAddService],
    exports: [InventoryHasAddService],
  })
  export class InventoryHasAddModule {}
