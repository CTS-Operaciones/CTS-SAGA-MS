import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { STATUS_ENTRIES } from 'src/common/constants/';
export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  Idname: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsNumber()
  user_id: number;

  @IsNumber()
  stateId: number;

  @IsNumber()
  resourceId: number;

  @IsEnum(STATUS_ENTRIES)
  @IsNotEmpty()
  status: STATUS_ENTRIES;

  @IsNumber()
  ubications: number;
}
