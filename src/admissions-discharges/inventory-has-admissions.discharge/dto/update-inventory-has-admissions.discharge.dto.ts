
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateHasAdmissionDto {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  idActa: number;

  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  itemId: number[];
}
