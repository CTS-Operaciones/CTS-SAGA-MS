import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FindOneWhitTermAndRelationDto, PaginationDto, PaginationRelationsDto } from 'src/common';
import { SearchDto } from 'src/common/dto/search.dto';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @MessagePattern('createAssignment')
  create(@Payload() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @MessagePattern('findAllAssignments')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.assignmentsService.findAll(pagination);
  }

  @MessagePattern('findOneAssignment')
  findOne(@Payload() findOne: FindOneWhitTermAndRelationDto) {
    return this.assignmentsService.findOne(findOne);
  }

  @MessagePattern('updateAssignment')
  update(@Payload() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(updateAssignmentDto);
  }

  @MessagePattern('removeAssignment')
  remove(@Payload() { id }: { id: number }) {
    return this.assignmentsService.remove(id);
  }

  @MessagePattern('findByTermRemoveAssignment')
  find(@Payload() searchDto: SearchDto) {
    return this.assignmentsService.findByTerm(searchDto);
  }
}
