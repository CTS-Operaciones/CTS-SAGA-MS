import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateHasAssignDto } from './create-inventory-has-assign.dto';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateHasAssignDto {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  idActa: number;

  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  itemId: number[];
}
