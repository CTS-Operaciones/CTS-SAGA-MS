import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MantenanceService } from './mantenance.service';
import { CreateMantenanceDto } from './dto/create-mantenance.dto';
import { UpdateMantenanceDto } from './dto/update-mantenance.dto';
import { FindOneWhitTermAndRelationDto, PaginationDto, PaginationRelationsDto } from 'src/common';
import { SearchDto } from 'src/common/dto/search.dto';

@Controller()
export class MantenanceController {
  constructor(private readonly MantenanceService: MantenanceService) {}

  @MessagePattern('createMaintenance')
  create(@Payload() CreateMantenanceDto: CreateMantenanceDto) {
    return this.MantenanceService.create(CreateMantenanceDto);
  }

  @MessagePattern('findAllMantenance')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.MantenanceService.findAll(pagination);
  }

  @MessagePattern('findOneMaintenance')
  findOne(@Payload() findOne: FindOneWhitTermAndRelationDto) {
    return this.MantenanceService.findOne(findOne);
  }

  @MessagePattern('updateMaintenance')
  update(@Payload() UpdateMantenanceDto: UpdateMantenanceDto) {
    return this.MantenanceService.update(UpdateMantenanceDto);
  }

  @MessagePattern('removeMaintenance')
  remove(@Payload() { id }: { id: number }) {
    return this.MantenanceService.remove(id);
  }

 /*  @MessagePattern('findByTermRemoveMaintenance')
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
    return this.MantenanceService.findByTerm({
      searchDto,
      pagination,
    });
  } */
}
