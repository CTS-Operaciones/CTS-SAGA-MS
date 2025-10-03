import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { STATUS_ENTRIES, STATUS_INVENTORY } from '../constants';
import { filter } from '../interfaces/searchFilter.interface';
import { PaginationDto } from './pagination.dto';
import { Type } from 'class-transformer';

export class filterDto implements filter {
  @IsNumber()
  model: number;

  @IsNumber()
  brand: number;

  @IsNumber()
  ubication: number;

  @IsNumber()
  name: string;

  @IsNumber()
  clasification: number;

  @IsNumber()
  resource: number;

  @IsNumber()
  user_id: number;

  @IsEnum(STATUS_ENTRIES)
  @IsNotEmpty()
  status: STATUS_ENTRIES;
}

export class InventoryQueryDto {
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @ValidateNested()
  @Type(() => filterDto)
  filter: filterDto;
}