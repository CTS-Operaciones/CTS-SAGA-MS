import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-assignment.dto';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
