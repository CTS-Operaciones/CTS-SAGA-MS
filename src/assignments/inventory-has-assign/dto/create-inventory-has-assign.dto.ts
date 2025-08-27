
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateResourceDto as createResourceDto } from '../../../resources/dto/create-resource.dto';
import { Type } from 'class-transformer';


export class CreateHasAssignDto {
  //Id del acta
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;
  // Inventory
  @IsArray()
  idInventory: number[];
}
