import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateHasAssignDto } from './create-inventory-has-assign.dto';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateHasAssignDto extends PartialType(CreateHasAssignDto) {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
