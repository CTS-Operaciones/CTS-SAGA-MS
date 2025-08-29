
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,

} from 'class-validator';



export class CreateHasAdmissionDto {
  //Id del acta
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;
  // Inventory
  @IsArray()
  idInventory: number[];
}
