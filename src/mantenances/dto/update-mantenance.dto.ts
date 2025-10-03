import { PartialType } from '@nestjs/mapped-types';
import { CreateMantenanceDto } from './create-mantenance.dto';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateMantenanceDto extends PartialType(CreateMantenanceDto) {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
