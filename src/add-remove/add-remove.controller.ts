import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddRemoveService } from './add-remove.service';
import { CreateAddRemoveDto } from './dto/create-add-remove.dto';
import { UpdateAddRemoveDto } from './dto/update-add-remove.dto';
import { PaginationRelationsDto } from 'src/common';

@Controller()
export class AddRemoveController {
  constructor(private readonly addRemoveService: AddRemoveService) {}

  @MessagePattern('createAddRemove')
  create(@Payload() createAddRemoveDto: CreateAddRemoveDto) {
    return this.addRemoveService.create(createAddRemoveDto);
  }

  @MessagePattern('findAllAddRemove')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.addRemoveService.findAll(pagination);
  }

  @MessagePattern('findOneAddRemove')
  findOne(
    @Payload()
    { term, relations, allRelations, deletes }: any,
  ) {
    return this.addRemoveService.findOne({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('updateAddRemove')
  update(@Payload() updateAddRemoveDto: UpdateAddRemoveDto) {
    return this.addRemoveService.update(updateAddRemoveDto);
  }

  @MessagePattern('getChildrenByResource')
  restore(@Payload() { id }: { id: number }) {
    return this.addRemoveService.getChildrenByResource(id);
  }
}
