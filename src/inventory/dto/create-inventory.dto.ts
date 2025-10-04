import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { STATUS_ENTRIES } from 'src/common/constants/';
export class CreateInventoryDto {
  @IsString()
  serialNumber?: string;

  @IsNumber()
  user_id?: number;

  @IsNumber()
  sede_id?: number;

  @IsNumber()
  state?: number;

  @IsNumber()
  resource: number;

  @IsEnum(STATUS_ENTRIES)
  @IsNotEmpty()
  status?: STATUS_ENTRIES;

  @IsNumber()
  ubications?: number;
}
