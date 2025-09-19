import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HabilitationService } from './habilitation.service';
import { CreateHabilitationDto } from './dto/create-habilitation.dto';
import { UpdateHabilitationDto } from './dto/update-habilitation.dto';
import { PaginationRelationsDto } from '../common';
@Controller()
export class HabilitationController {
  constructor(
    private readonly habilitationService: HabilitationService,
  ) {}

  @MessagePattern('createHabilitation')
  create(
    @Payload() createHabilitationDto: CreateHabilitationDto,
  ) {
    return this.habilitationService.create(
      createHabilitationDto,
    );
  }

  @MessagePattern('findAllHabilitation')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.habilitationService.findAll(pagination);
  }

  @MessagePattern('findOneHabilitation')
  findOne(
    @Payload()
    { term, relations, allRelations, deletes }: any,
  ) {
    return this.habilitationService.findOne({
      term,
      relations,
      deletes,
      allRelations,
    });
  }
  @MessagePattern('updateHabilitation')
  update(
    @Payload() updateHabilitationDto: UpdateHabilitationDto,
  ) {
    return this.habilitationService.update(updateHabilitationDto);
  }
}
