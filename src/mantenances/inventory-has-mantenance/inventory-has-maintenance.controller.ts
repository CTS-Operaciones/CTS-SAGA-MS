import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateHasMaintenanceDto}  from './dto/create-inventory-has-maintenance.dto';
import { FindOneWhitTermAndRelationDto } from 'src/common';
import { InventoryHasMaintenanceServices } from './inventory-has-maintenance.service'
import { } from './inventory-has-maintenance.service'
@Controller({ path: 'inventory-has-assign', version: '1' })
export class InventoryHasMaintenanceController {z
  constructor(
    private readonly maintenancesService: InventoryHasMaintenanceServices,
  ) {}

  @MessagePattern('createInventoryHasAssign')
  create(@Payload() CreateHasMaintenanceDto: CreateHasMaintenanceDto) {
    return this.maintenancesService.create(CreateHasMaintenanceDto);
  }

  @MessagePattern('findOneInventoryHasAssign')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.maintenancesService.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('removeInventoryHasAssign')
  remove(@Payload() { id }: { id: number }) {
    return this.maintenancesService.delete(id);
  }

  @MessagePattern('updateInventoryHasAssigment')
  update(@Payload() updateDto: CreateHasMaintenanceDto) {
    return this.maintenancesService.update(updateDto);
  }
}
