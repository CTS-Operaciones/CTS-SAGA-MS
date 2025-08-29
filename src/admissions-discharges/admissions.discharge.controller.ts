import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdmissionsDischargesService } from './admissions-discharges.service';
import { CreateAdmissionsDischargeDto } from './dto/create-admissions-discharge.dto';
import { UpdateAdmissionsDischargeDto } from './dto/update-admissions-discharge.dto';
import {
  FindOneWhitTermAndRelationDto,
  PaginationDto,
  PaginationRelationsDto,
} from '../common';
@Controller()
export class AdmissionsDischargesController {
  constructor(private readonly admissionsDischargesService: AdmissionsDischargesService) {}

  @MessagePattern('createAdmissionsDischarge')
  create(@Payload() createAdmissionsDischargeDto: CreateAdmissionsDischargeDto) {
    return this.admissionsDischargesService.create(createAdmissionsDischargeDto);
  }

  @MessagePattern('findAllAdmissionsDischarges')
  findAll(@Payload() pagination: PaginationDto) {
    return this.admissionsDischargesService.findAll(pagination);
  }

  @MessagePattern('findOneAdmissionsDischarge')
  findOne(@Payload() findOne: FindOneWhitTermAndRelationDto) {
    return this.admissionsDischargesService.findOne(findOne);
  }
  @MessagePattern('updateAdmissionsDischarge')
  update(@Payload() updateAdmissionsDischargeDto: UpdateAdmissionsDischargeDto) {
    return this.admissionsDischargesService.update(updateAdmissionsDischargeDto);
  }

  @MessagePattern('removeAdmissionsDischarge')
  remove(@Payload() { id }: { id: number }) {
    return this.admissionsDischargesService.remove(id);
  }
}
