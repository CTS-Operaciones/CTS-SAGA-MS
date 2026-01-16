import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHasMaintenanceDto {
  @IsNumber()
  idActa: number;

  @IsArray()
  inventory: number[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}
