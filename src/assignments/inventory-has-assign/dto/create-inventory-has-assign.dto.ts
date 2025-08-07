
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateResourceDto as createResourceDto } from '../../../resources/dto/create-resource.dto';
import { Type } from 'class-transformer';
import { STATUS_RESOURCE } from 'src/common';

export class CreateHasAssignDto {
  // Resource
  @ValidateNested()
  @Type(() => createResourceDto)
  resource: createResourceDto;
  //Id del acta
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idActa: number;
  // Inventory
  @IsString()
  idName: string;
  @IsString()
  serialNumber: string;
  @IsNumber()
  ubications: number;
  @IsEnum(STATUS_RESOURCE)
  @IsNotEmpty()
  status: STATUS_RESOURCE;
  @IsNumber()
  user_id: number;
}
