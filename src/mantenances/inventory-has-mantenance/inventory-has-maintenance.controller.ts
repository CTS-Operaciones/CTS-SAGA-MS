import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InventoryHasMaintenanceservices } from './inventory-has-maintenance.service';
import { CreateHasMaintenanceDto } from './dto/create-inventory-has-maintenance.dto';
import { FindOneWhitTermAndRelationDto } from 'src/common';

@Controller()
export class InventoryHasMaintenanceController {
  constructor(
    private readonly inventoryHasMaintenance: InventoryHasMaintenanceservices,
  ) {}
  @MessagePattern('createInventoryHasMaintenance')
  create(@Payload() createHasMaintenanceDto: CreateHasMaintenanceDto) {
    try {
      console.log(createHasMaintenanceDto);
      return this.inventoryHasMaintenance.create(createHasMaintenanceDto);
    } catch (error) {
      console.error('❌ Error en el controlador:', error);
      throw new RpcException(error.message || 'Error desconocido');
    }
  }

  @MessagePattern('findOneInventoryHasMaintenance')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.inventoryHasMaintenance.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }
  @MessagePattern('findOneInventoryMaintenance')
  findOneInventory(@Payload() { id }: { id: number }) {
    const findOne = { id };
    return this.inventoryHasMaintenance.findOne(id);
  }

  @MessagePattern('removeInventoryHasMaintenance')
  remove(@Payload() { id }: { id: number }) {
    return this.inventoryHasMaintenance.remove(id);
  }

  @MessagePattern('updateInventoryHasMaintenance')
  update(@Payload() updateDto: CreateHasMaintenanceDto) {
    return this.inventoryHasMaintenance.update(updateDto);
  }
}
