
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,

} from 'class-validator';
import { ASSIGNMENT_STATUS } from 'src/common';
import { ToBoolean } from 'src/common/decorator';

export class CreateHasMaintenanceDto {
  @IsNumber()
  idActa: number;

  @IsArray()
  idInventory: number[];

  //Agregar obsrevaciones  descripcion
  

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  @ToBoolean('is_preassignment')
  is_preassignment: boolean = false;
}
