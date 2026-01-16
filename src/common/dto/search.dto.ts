import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  project_id?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  date_init?: String;

  @IsString()
  @IsOptional()
  @Type(() => String)
  date_end?: String;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  user_id?: number;
}

export class searchMaintenanceDto extends SearchDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: String;

  @IsString()
  @IsOptional()
  @Type(() => String)
  observations?: String;

  @IsString()
  @IsOptional()
  @Type(() => String)
  maintenanceType?: String;
}
