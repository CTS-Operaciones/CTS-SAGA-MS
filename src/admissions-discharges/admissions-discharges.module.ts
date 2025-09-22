import { Module } from '@nestjs/common';
import { AdmissionsDischargesService } from './admissions-discharges.service';
import { AdmissionsDischargesController } from './admissions.discharge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { admissionsDischarges } from 'cts-entities';
import { AssignmentsModule } from 'src/assignments/assignments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([admissionsDischarges]),
    AssignmentsModule,
  ],
  controllers: [AdmissionsDischargesController],
  providers: [AdmissionsDischargesService],
  exports: [AdmissionsDischargesService],
})
export class AdmissionsDischargesModule {}
