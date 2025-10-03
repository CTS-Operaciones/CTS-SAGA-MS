import { PartialType } from '@nestjs/mapped-types';
import { CreateHasMaintenanceDto } from './create-inventory-has-maintenance.dto';

export class UpdateHasMaintenanceDto extends PartialType(CreateHasMaintenanceDto) {}
