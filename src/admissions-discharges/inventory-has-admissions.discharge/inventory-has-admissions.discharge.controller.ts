import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryHasAdmissionService} from './inventory-has-admissions.discharge.service';
import { FindOneWhitTermAndRelationDto } from 'src/common';
import {CreateHasAdmissionDto} from './dto/create-inventory-has-admissions.discharge.dto'
@Controller({ path: 'inventory-has-admissions.discharge', version: '1' })
export class AssignmentsController {
  constructor(
    private readonly admissionsService: InventoryHasAdmissionService,
  ) {}

  @MessagePattern('createInventoryhasAdmissionDischarge')
  create(@Payload() CreateHasAdmissionDto: CreateHasAdmissionDto) {
    return this.admissionsService.create(CreateHasAdmissionDto);
  }

  @MessagePattern('findOneInventoryHasAdmission')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.admissionsService.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('removeInventoryHasAdmission')
  remove(@Payload() { id }: { id: number }) {
    return this.admissionsService.dlete(id);
  }
}
