import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ASSIGNMENT_STATUS } from 'src/common/constants/enums';
export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  comments: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  project_id: number;

  /*TODO: VERIFICAR SI AGREGAR EL USER O  LAS FIRMAS*/
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  user_id: number;

  @IsEnum(ASSIGNMENT_STATUS)
  type: ASSIGNMENT_STATUS;
}
