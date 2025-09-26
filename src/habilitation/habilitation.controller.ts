import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HabilitationService } from './habilitation.service';
import { CreateHabilitationDto } from './dto/create-habilitation.dto';
import { UpdateHabilitationDto } from './dto/update-habilitation.dto';
import { PaginationDto, PaginationRelationsDto } from '../common';
import { SearchDto } from '../common/dto/search.dto';
@Controller()
export class HabilitationController {
  constructor(private readonly habilitationService: HabilitationService) {}

  @MessagePattern('createHabilitation')
  create(@Payload() createHabilitationDto: CreateHabilitationDto) {
    return this.habilitationService.create(createHabilitationDto);
  }

  @MessagePattern('findAllHabilitation')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.habilitationService.findAll(pagination);
  }

  @MessagePattern('findByTerm')
  find(
    @Payload()
    {
      pagination,
      searchDto,
    }: {
      searchDto: SearchDto;
      pagination: PaginationDto;
    },
  ) {
    return this.habilitationService.findByTerm({
      searchDto,
      pagination,
    });
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
  update(@Payload() updateHabilitationDto: UpdateHabilitationDto) {
    return this.habilitationService.update(updateHabilitationDto);
  }

  @MessagePattern('findOneHabilitationByAssigment')
  findAdmissionsByAssigment(@Payload() { id }: { id: number }) {
    return this.habilitationService.findOneHabilitationByAssigment(id);
  }
}
