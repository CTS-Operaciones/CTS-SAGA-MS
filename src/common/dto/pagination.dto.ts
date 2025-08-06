import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IPaginateFilter, IPagination } from '../interfaces';
import { STATUS_RESOURCE } from '../constants/enums';
import { ToBoolean } from '../decorator';
export class PaginationDto implements IPagination {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ToBoolean('all')
  all?: boolean = false;
}

export class PaginationRelationsDto extends PaginationDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  relations?: boolean;
}


export class PaginationFilterAssigmentsDto<T>
  extends PaginationRelationsDto
  implements IPaginateFilter<T> {
  @IsEnum([...Object.values(STATUS_RESOURCE)])
  @IsOptional()
  status?: T extends { status: infer U } ? U : never;
}