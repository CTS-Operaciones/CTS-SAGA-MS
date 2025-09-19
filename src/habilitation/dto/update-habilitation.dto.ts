import { PartialType } from '@nestjs/mapped-types';
import { CreateHabilitationDto } from './create-habilitation.dto';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateHabilitationDto extends PartialType(CreateHabilitationDto) {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
