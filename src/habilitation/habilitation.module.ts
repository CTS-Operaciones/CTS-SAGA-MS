import { Module } from '@nestjs/common';
import { HabilitationService } from './habilitation.service';
import { HabilitationController } from './habilitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilitations } from 'cts-entities';
import { AdmissionsDischargesModule } from 'src/admissions-discharges/admissions-discharges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habilitations]),
    AdmissionsDischargesModule,
  ],
  controllers: [HabilitationController],
  providers: [HabilitationService],
  exports: [HabilitationService],
})
export class HabilitationModule {}
