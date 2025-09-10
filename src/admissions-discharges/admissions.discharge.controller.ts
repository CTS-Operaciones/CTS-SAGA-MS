import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdmissionsDischargesService } from './admissions-discharges.service';
import { CreateAdmissionsDischargeDto } from './dto/create-admissions-discharge.dto';
import { UpdateAdmissionsDischargeDto } from './dto/update-admissions-discharge.dto';
import { PaginationRelationsDto } from '../common';
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
  @MessagePattern('updateAdmissionsDischarge')
  update(
    @Payload() updateAdmissionsDischargeDto: UpdateAdmissionsDischargeDto,
  ) {
    return this.admissionsDischargesService.update(
      updateAdmissionsDischargeDto,
    );
  }
}
