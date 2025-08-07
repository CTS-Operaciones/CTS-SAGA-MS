import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryHasAssignService} from './inventory-has-assign.service';
import { CreateHasAssignDto}  from './dto/create-inventory-has-assign.dto';
import { FindOneWhitTermAndRelationDto } from 'src/common';

@Controller({ path: 'inventory-has-assign', version: '1' })
export class AssignmentsController {
  constructor(
    private readonly asssignmentsService: InventoryHasAssignService,
  ) {}

  @MessagePattern('createInventoryHasAssign')
  create(@Payload() createHasAssignDto: CreateHasAssignDto) {
    return this.asssignmentsService.create(createHasAssignDto);
  }

  @MessagePattern('findOneInventoryHasAssign')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.asssignmentsService.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('removeInventoryHasAssign')
  remove(@Payload() { id }: { id: number }) {
    return this.asssignmentsService.delete(id);
  }
}
