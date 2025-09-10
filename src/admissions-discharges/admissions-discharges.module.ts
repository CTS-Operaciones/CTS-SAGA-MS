import { Module } from '@nestjs/common';
import { AdmissionsDischargesService } from './admissions-discharges.service';
import { AdmissionsDischargesController } from './admissions.discharge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { admissionsDischarges } from 'cts-entities';

@Module({
  imports: [TypeOrmModule.forFeature([admissionsDischarges])],
  controllers: [AdmissionsDischargesController],
  providers: [AdmissionsDischargesService],
  exports: [AdmissionsDischargesService],
})
export class AdmissionsDischargesModule {}
