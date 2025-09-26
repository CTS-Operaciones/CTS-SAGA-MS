import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdmissionsDischargesService } from './admissions-discharges.service';
import { CreateAdmissionsDischargeDto } from './dto/create-admissions-discharge.dto';
import { UpdateAdmissionsDischargeDto } from './dto/update-admissions-discharge.dto';
import { PaginationDto, PaginationRelationsDto } from '../common';
import { SearchDto } from 'src/common/dto/search.dto';
@Controller()
export class AdmissionsDischargesController {
  constructor(
    private readonly admissionsDischargesService: AdmissionsDischargesService,
  ) {}

  @MessagePattern('createAdmissionsDischarge')
  create(
    @Payload() createAdmissionsDischargeDto: CreateAdmissionsDischargeDto,
  ) {
    return this.admissionsDischargesService.create(
      createAdmissionsDischargeDto,
    );
  }

  @MessagePattern('findByTermAdmissionsDischarge')
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
    return this.admissionsDischargesService.findByTerm({
      searchDto,
      pagination,
    });
  }
  @MessagePattern('findAllAdmissionsDischarges')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.admissionsDischargesService.findAll(pagination);
  }

  @MessagePattern('findOneAdmissionsDischarge')
  findOne(
    @Payload()
    { term, relations, allRelations, deletes }: any,
  ) {
    return this.admissionsDischargesService.findOne({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('findOneAdmissionsByAssigment')
  findAdmissionsByAssigment(@Payload() { id }: { id: number }) {
    return this.admissionsDischargesService.findOneAdmissionsByAssigment(id);
  }
  @MessagePattern('updateAdmissionsDischarge')
  update(
    @Payload() updateAdmissionsDischargeDto: UpdateAdmissionsDischargeDto,
  ) {
    return this.admissionsDischargesService.update(
      updateAdmissionsDischargeDto,
    );
  }
}
