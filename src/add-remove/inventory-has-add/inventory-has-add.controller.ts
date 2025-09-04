import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryHasAddService} from './inventory-has-add.service';
import { CreateHasAddRemoveDto}  from './dto/create-inventory-has-add-remove.dto';
import { FindOneWhitTermAndRelationDto } from 'src/common';

@Controller()
export class InventoryHasAddController {
  constructor(private readonly addRemoveService: InventoryHasAddService) {}

  @MessagePattern('createInventoryHasAdd')
  create(@Payload() createAddRemoveDto: CreateHasAddRemoveDto) {
    return this.addRemoveService.create(createAddRemoveDto);
  }
  @MessagePattern('getResourcesByActa')
  get(@Payload() { id }: { id: number }) {
    return this.addRemoveService.getResourcesByActa(id);
  }
  @MessagePattern('findOneInventoryHasAdd')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.addRemoveService.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('removeInventoryHasAdd')
  remove(@Payload() { id }: { id: number }) {
    return this.addRemoveService.removeActa(id);
  }

  @MessagePattern('removeItemInventoryHasAdd')
  restore(@Payload() { id }: { id: number }) {
    return this.addRemoveService.removeItem(id);
  }
}
